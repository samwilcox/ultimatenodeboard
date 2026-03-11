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

const { setCookie, getCookie, deleteCookie } = require("../cookies/cookies.helper");
const UNB_COOKIE_KEYS = require("../cookies/cookies.keys");
const SessionError = require("../errors/session.error");
const { generateAuthToken } = require("../helpers/auth.helper");
const { detectSearchBots } = require("../helpers/detection.helper");
const { generateHash } = require("../helpers/hash.helper");
const { getUserIp } = require("../helpers/ip.helper");
const { setSessionVar, deleteSessionVar } = require("../session/session.helper");
const UNB_SESSION_KEYS = require("../session/session.keys");
const UNB_SETTING_KEYS = require("../settings/settings.keys");

/**
 * UNB session service
 * 
 * Service for handling authentication sessions.
 */
class SessionService {
    /**
     * Attach authentication to the current session.
     * 
     * @param {object} req - The request object from `Express`.
     * @param {object} res - The response object from `Express`.
     * @param {Member} member - The member entity instance. 
     * @param {boolean} [rememberMe=false] - `true` to remember the user, `false` to not remember the user.
     * @throws {SessionError} If the session has not been initialized.
     */
    static async create(req, res, member, rememberMe = false) {
        const { localeService, settingsService, db } = req.app.locals;

        if (!req.session || !req.sessionID) {
            throw new SessionError(await localeService.t('error.session.service.no.session'));
        }

        const ttlSeconds = await settingsService.get(UNB_SETTING_KEYS.SESSION_REMEMBER_TTL_SECONDS)

        const now = new Date();
        const expiresAt = new Date(now.getTime() + ttlSeconds * 1000);
        const sessionId = req.sessionID;

        await db.repo.sessions.update({
            key: sessionId
        }, {
            memberKey: member.key,
            expires: expiresAt,
            lastActivity: new Date(now),
            ipAddress: getUserIp(req),
            userAgent: req.headers['user-agent'] || null,
            hostname: req.hostname,
            bot: await detectSearchBots(req.headers['user-agent']),
            adminSession: false,
            revoked: false
        });

        const authToken = generateAuthToken();

        const deviceExists = await db.repo.memberDevices.getOneByQuery({ memberKey: member.key }) ? true : false;

        if (deviceExists) {
            await db.repo.memberDevices.update({
                memberKey: member.key
            }, {
                authToken: authToken,
                lastUsedAt: new Date()
            });
        } else {
            const deviceHash = generateHash({ data: req.headers['user-agent'] });

            await db.repo.memberDevices.create({
                key: deviceHash,
                memberKey: member.key,
                authToken: authToken,
                userAgent: req.headers['user-agent'],
                ipAddress: getUserIp(req),
                lastUsedAt: new Date()
            });
        }

        setSessionVar(req, UNB_SESSION_KEYS.AUTH_TOKEN, authToken);
        
        if (rememberMe) {
            setCookie(res, UNB_COOKIE_KEYS.AUTH_TOKEN, authToken, {
                maxAge: ttlSeconds * 1000
            });
        } else {
            setCookie(res, UNB_COOKIE_KEYS.AUTH_TOKEN, authToken);
        }

        return {
            sessionId,
            memberKey: member.key,
            rememberMe,
            expiresAt
        };
    }

    /**
     * Sign out the member from their account.
     * 
     * @param {object} req - The request object from `Express`.
     * @param {object} res - The response object from `Express`.
     */
    static async signOut(req, res) {
        const { member, db, unbSession } = req.app.locals;
        const authToken = getCookie(req, UNB_COOKIE_KEYS.AUTH_TOKEN);

        const now = new Date();

        await db.repo.memberDevices.update(
            { authToken, memberKey: member.key },
            { authToken: null, lastUsedAt: now }
        );

        await db.repo.sessions.delete({ key: unbSession.key, memberKey: member.key });

        await db.repo.members.update(
            { key: member.key },
            { lastVisit: now }
        );

        deleteSessionVar(req, UNB_SESSION_KEYS.AUTH_TOKEN);
        deleteCookie(res, UNB_COOKIE_KEYS.AUTH_TOKEN);

        return res.redirect(buildUrl());
    }
}

module.exports = SessionService;