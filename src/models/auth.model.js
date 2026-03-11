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

const AuthService = require('../auth/auth.service');
const { setCookie } = require('../cookies/cookies.helper');
const UNB_COOKIE_KEYS = require('../cookies/cookies.keys');
const { buildUrl } = require('../helpers/url.helper');
const Logger = require('../log/logger');
const SessionService = require('../services/session.service');
const { setSessionVar } = require('../session/session.helper');
const UNB_SESSION_KEYS = require('../session/session.keys');

/**
 * UNB auth model
 * 
 * Model for authentication.
 */
class AuthModel {
    /**
     * Create a new instance of `IndexModel`.
     */
    constructor() {
        this._payload = {};
    }

    /**
     * Process the user sign in request.
     * 
     * @param {object} req - The request object from `Express`.
     * @param {object} res - The response object from `Express`.
     * @param {NextFunction} next - The next middleware to execute. 
     */
    async processSignIn(req, res, next) {
        let result = null;

        try {
            const {
                url,
                identity,
                password,
                rememberme
            } = req.body;

            result = await AuthService.validateCredentials(identity, password);

            if (!result.ok) {
                setSessionVar(req, UNB_SESSION_KEYS.FORM_ERROR, {
                    message: result.message,
                    attempts: result.attempts,
                    expires: result.expires
                });

                setCookie(res, UNB_COOKIE_KEYS.AUTH_ERROR_FLAG, true);

                return res.redirect(url);
            }

            await SessionService.create(req, res, result.member, Boolean(rememberme));

            return res.redirect(url || '/');
        } catch (error) {
            console.log(error);
            Logger.error('AuthModel', `AuthModel.processSignIn() failed: ${error}.`, { error });
            return res.redirect(buildUrl())
        }
    }

    /**
     * Sign out the member.
     * 
     * @param {object} req - The request object from `Express`.
     * @param {object} res - The response object from `Express`.
     * @param {NextFunction} next - The next middleware to execute. 
     */
    async signOutMember(req, res, next) {
        try {
            return await SessionService.signOut(req, res);
        } catch (error) {
            Logger.error('AuthModel', `AuthModel.signOutMember() failed: ${error}.`, { error });
            return res.redirect(buildUrl());
        }
    }
}

module.exports = AuthModel;