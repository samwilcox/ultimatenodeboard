/**
 * =======================================================================
 * ULTIMATE NODE BOARD (UNB)
 * =======================================================================
 * 
 * @author  Sam Wilcox
 * @email   sam@ultimatenodeboard.com
 * @website https://www.ultimatenodeboard.com
 * @github  https://github.com/samwilcox/ultimatenodeboard
 * 
 * -----------------------------------------------------------------------
 * USER-END USER LICENSE AGREEMENT:
 * -----------------------------------------------------------------------
 * 
 * Ultimate Node Board is licensed under a dual license mode under the MIT
 * and the Apache v2 licenses.
 * 
 * For further details regarding the user-end license agreement, please
 * visit: https://license.ultimatenodeboard.com
 * 
 * =======================================================================
 */

'use strict';

const Session = require('../session/session.entity');
const { cookieExists, getCookie, deleteCookie } = require('../cookies/cookies.helper');
const UNB_COOKIE_KEYS = require('../cookies/cookies.keys');
const InvalidParameterError = require('../errors/invalid-parameter.error');
const { getUserIp } = require('../helpers/ip.helper');
const { buildUrl } = require('../helpers/url.helper');
const Logger = require('../log/logger');
const SessionRespository = require('../repository/session.repository');
const UNB_SETTING_KEYS = require('../settings/settings.keys');
const { dateToEpoch } = require('../datetime/datetime.service');
const { hashToken } = require('../helpers/auth.helper');

const isApiRequest = (req) =>
    req.originalUrl.startsWith('/api') ||
    req.xhr ||
    (req.headers.accept || '').includes('application/json');

const handleAuthFailure = async (req, res) => {
    await destroy(req, res);

    if (isApiRequest(req)) {
        return res.status(401).json({ ok: false, auth: false });
    }

    return res.redirect(buildUrl());
};

/**
 * UNB session middleware for handling user sessions.
 */
module.exports = function createSessionMiddleware() {
    return async function sessionMiddleware(req, res, next) {
        try {
            const { db, settingsService, membersService } = req.app.locals;

            await garbageCollection(req);

            let session = await SessionRespository.getByKey(req.sessionID);
            session.key = req.sessionID;

            session = setUserData(req, session);
            session = await setSessionData(req, settingsService, session);

            const ipMatch = await settingsService.get(UNB_SETTING_KEYS.SESSION_IP_MATCH);
            const authToken = resolveAuthToken(req);

            if (authToken) {
                const device = await db.repo.memberDevices.getOneByQuery({ authToken });

                if (!device) {
                    return await handleAuthFailure(req, res);
                }

                const member = membersService.allArr()
                    .find(m => m.key === device.memberKey);

                if (!member) {
                    return await handleAuthFailure(req, res);
                }

                session.memberKey = member.key;

                if (!(await validateIpMatch(req, session, ipMatch, res))) {
                    if (!ipMatch) return true;

                    const ip = getUserIp(req);
                    const ua = req.headers['user-agent'];

                    if (session.ipAddress !== ip || session.userAgent !== ua) {
                        await handleAuthFailure(req, res);
                        return false;
                    }

                    return true;
                }

                attachSession(req, session);

                const existing = await db.repo.sessions.getOneByQuery({ key: req.sessionID });

                if (existing) {
                    await update(req, session);
                } else {
                    await create(req, session);
                }
            } else {
                attachSession(req, session);

                const existing = await db.repo.sessions.getOneByQuery({ key: req.sessionID });

                if (existing) {
                    if (!(await validateIpMatch(req, session, ipMatch, res))) {
                        return;
                    }

                    await update(req, session);
                } else {
                    await create(req, session);
                }
            }

            next();
        } catch (error) {
            Logger.error('SessionMiddleware', `Session middleware failed: ${error}.`, { error });
            next(error);
        }
    };
}

/**
 * Set the user data for the session.
 * 
 * @param {object} req - The request object from `Express`.
 * @param {Session} session - The session entity instance.
 * @returns {Session} The modified session entity instance.
 */
const setUserData = (req, session) => {
    session.ipAddress = getUserIp(req);
    session.userAgent = req.headers['user-agent'];
    session.hostname = req.hostname;
    session.adminSession = false;

    return session;
};

/**
 * Set the session data for the session.
 * 
 * @param {object} req - The request object from `Express`.
 * @param {SettingsService} settingsService - The UNB settings service instance.
 * @param {Session} session - The session entity instance.
 * @returns {Promise<Session>} A promise that resolves to the modified session entity instance. 
 */
const setSessionData = async (req, settingsService, session) => {
    const ttl = await settingsService.get(UNB_SETTING_KEYS.SESSION_TTL_SECONDS);
    const now = new Date();

    session.location = req.originalUrl;
    session.lastActivity = now;
    session.expires = new Date(now.getTime() + ttl * 1000);

    return session;
};

/**
 * Resolve an auth token.
 * 
 * @param {object} req - The request object from `Express`.
 * @returns {string|null} The resolved auth token or `null` if it cannot be resolved.
 */
const resolveAuthToken = (req) => {
    if (cookieExists(req, UNB_COOKIE_KEYS.AUTH_TOKEN)) {
        return getCookie(req, UNB_COOKIE_KEYS.AUTH_TOKEN);
    }

    return null;
};

/**
 * Perform an IP match.
 * 
 * @param {object} req - The request object from `Express`.
 * @param {Session} session - The session entity instance. 
 * @param {boolean} ipMatch - `true` to perform an ip match, `false` not to. 
 * @param {object} res - The response object from `Express`.
 * @returns {Promise<boolean>} A promise that resolves to either:
 *                             `true` if a valid match, `false` if not. 
 */
const validateIpMatch = async (req, session, ipMatch, res) => {
    if (!ipMatch) return true;

    const ip = getUserIp(req);
    const ua = req.headers['user-agent'];

    if (session.ipAddress !== ip || session.userAgent !== ua) {
        await destroy(req, res);
        res.redirect(buildUrl());
        return false;
    }

    return true;
};

/**
 * Attach the session to the request.
 * 
 * @param {object} req - The request object from `Express`.
 * @param {Session} session - The session entity instance. 
 */
const attachSession = (req, session) => {
    req.unbSession = session;
    req.app.locals.unbSession = session;
};

/**
 * Create a new user session.
 * 
 * @param {object} req - The request object from `Express`.
 * @param {Session} session - The session entity instance.
 * @throws {InvalidParameterError} If the session parameter is null.
 */
const create = async (req, session) => {
    const { localeService } = req.app.locals;

    if (!session || !(session instanceof Session)) {
        throw new InvalidParameterError(await localeService.t('error.session.middleware.missing.session.param'));
    }

    if (modifySession(req)) {
        const { db } = req.app.locals;

        await db.repo.sessions.create({
            key: session.key,
            memberKey: session.memberKey,
            expires: session.expires,
            lastActivity: session.lastActivity,
            location: session.location,
            userAgent: session.userAgent,
            ipAddress: session.ipAddress,
            hostname: session.hostname,
            bot: session.bot,
            adminSession: session.adminSession,
            revoked: session.revoked
        });
    }
}

/**
 * Update the user session.
 * 
 * @param {object} req - The request object from `Express`.
 * @param {Session} session - The session entity instance.
 * @throws {InvalidParameterError} If the session parameter is null.
 */
const update = async (req, session) => {
    const { localeService } = req.app.locals;

    if (!session || !(session instanceof Session)) {
        throw new InvalidParameterError(await localeService.t('session.middleware.missing.session.param'));
    }

    if (modifySession(req)) {
        const { db } = req.app.locals;

        await db.repo.sessions.update({
            key: session.key
        }, {
            expires: session.expires,
            lastActivity: session.lastActivity,
            location: session.location
        });
    }
};

/**
 * Destroy the session.
 * 
 * @param {object} req - The request object from `Express`.
 * @param {object} res - The response object from `Express`.
 */
const destroy = async (req, res) => {
    if (modifySession(req)) {
        const { db } = req.app.locals;

        let sessionKey = null;

        if (req.unbSession === null || req.unbSession === undefined) {
            sessionKey = req.sessionID;
        } else {
            sessionKey = req.unbSession.key;
        }

        req.session.destroy(error => {
            if (error) {
                Logger.error('SessionMiddleware.Destroy', `Failed to destroy the user session: ${error}.`, { error });
            }
        });

        deleteCookie(res, UNB_COOKIE_KEYS.AUTH_TOKEN);

        await db.repo.sessions.delete({ key: sessionKey });
    }
};

/**
 * Performs garbage collection of expired user sessions.
 * 
 * @param {object} req - The request object from `Express`.
 */
const garbageCollection = async (req) => {
    const { db } = req.app.locals;

    const sessions = db.repo.sessions.getAll();
    
    if (sessions && Array.isArray(sessions)) {
        const filtered = sessions.filter(s => s.expires <= dateToEpoch(new Date()));

        if (filtered.length > 0) {
            for (const session of filtered) {
                await db.repo.sessions.delete({ key: session.key });
            }
        }
    }
};

/**
 * Check whether to continue to modify the user session.
 * 
 * @param {object} req - The request object from `Express`.
 * @returns {boolean} `true` to modify session, `false` not to.
 */
const modifySession = (req) => {
    const invalidPaths = ['/api'];

    for (const path of invalidPaths) {
        if (req.originalUrl.includes(path)) {
            return false;
        }
    }

    return true;
};