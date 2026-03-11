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

const Logger = require('../log/logger');
const MemberRespository = require('../repository/member.repository');
const { getCookie, cookieExists } = require('../cookies/cookies.helper');
const UNB_COOKIE_KEYS = require('../cookies/cookies.keys');
const DataStore = require('../datastore/datastore');
const { sessionVarExists, getSessionVar } = require('../session/session.helper');
const UNB_SESSION_KEYS = require('../session/session.keys');
const { getCurrentUrl } = require('../helpers/url.helper');
const SessionService = require('../services/session.service');

/**
 * UNB middleware for detecting users.
 */
module.exports = function createMemberMiddleware() {
    return async function memberMiddleware(req, res, next) {
        try {
            const { db, settingsService, cacheProviderService } = req.app.locals;
            let member = null;

            if (cookieExists(req, UNB_COOKIE_KEYS.AUTH_TOKEN)) {
                const authToken = getCookie(req, UNB_COOKIE_KEYS.AUTH_TOKEN);
                member = await autoSignInMemberIfValidated(req, res, authToken, true);
            }

            if (!member) {
                member = await MemberRespository.getByKey(null, { repo: db.repo, settingsService, cacheProviderService });
                member.signedIn = false;
            } else {
                member.signedIn = true;
            }

            res.locals.member = member;
            req.app.locals.member = member;

            const unb = DataStore.get('unb');
            unb.member = member;
            unb.req = req;
            unb.res = res;

            DataStore.set('unb', unb);

            next();
        } catch (error) {
            Logger.error('MemberMiddleware', `Member middleware failed: ${error}.`, { error });
            next(error);
        }
    };
}

/**
 * Validate the member, auto sign in the member if they are validated.
 * 
 * @param {object} req - The request object from `Express`.
 * @param {object} res - The response object from `Express`.
 * @param {string} authToken - The auth token.
 * @param {boolean} rememberMe - `true` if the user wants to be remembered, `false` if not.
 * @returns {Promise<Member|null>} A promise that resolves to either the member entity instance or
 *                                 `null` if member is not validated.
 */
const autoSignInMemberIfValidated = async (req, res, authToken, rememberMe) => {
    const { db, membersService } = req.app.locals;

    const device = await db.repo.memberDevices.getOneByQuery({ authToken });

    if (!device) return null;

    const member = await membersService.get(device.memberKey);

    if (!member) return null;

    //await SessionService.create(req, res, member, rememberMe);

    member.signedIn = true;

    return member;
};