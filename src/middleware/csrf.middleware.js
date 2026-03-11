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

const { getCookie, setCookie } = require('../cookies/cookies.helper');
const { isValidOrigin } = require('../helpers/origin.helper');
const Logger = require('../log/logger');
const CsrfService = require('../security/csrf.service');
const UNB_SETTING_KEYS = require('../settings/settings.keys');

/**
 * Normalize CSRF token value.
 * 
 * @param {string} value - The token value.
 * @returns {string} The normalized token. 
 */
const normalizeToken = (value) => {
    if (!value || typeof value !== 'string') return null;

    const idx = value.indexOf(':');
    if (idx !== -1) return value.slice(0, idx);

    return value;
};

/**
 * Middleware for enforcing UNB CSRF security protection.
 */
module.exports = function createCsrfMiddleware() {
    return async function csrfMiddleware(req, res, next) {
        try {
            const { settingsService } = req.app.locals;

            const SAFE_METHODS = new Set(await settingsService.get(UNB_SETTING_KEYS.SECURITY_CSRF_SAFE_METHODS));
            const enabled = await settingsService.get(UNB_SETTING_KEYS.SECURITY_CSRF_ENABLED);

            if (!enabled) {
                res.locals.csrf = { enabled: false };
                return next();
            }

            if (!req.session) {
                if (!SAFE_METHODS.has(req.method)) {
                    return res.status(403).json({ ok: false, error: 'CSRF_SESSION_REQUIRED' });
                }

                res.locals.csrf = { enabled: true, token: null };
                return next();
            }

            const checkOrigin = await settingsService.get(UNB_SETTING_KEYS.SECURITY_CSRF_CHECK_ORIGIN_ENABLED);
            const csrfCookieName = await settingsService.get(UNB_SETTING_KEYS.SECURITY_CSRF_COOKIE_NAME);
            const csrfTtlSeconds = await settingsService.get(UNB_SETTING_KEYS.SECURITY_CSRF_TOKEN_TTL_SECONDS);

            let cookieRaw = getCookie(req, csrfCookieName);
            let cookieToken = normalizeToken(cookieRaw);

            if (!cookieToken) {
                cookieToken = CsrfService.generateToken();

                setCookie(res, csrfCookieName, cookieToken, {
                    maxAge: csrfTtlSeconds * 1000,
                    httpOnly: false,
                    sameSite: 'lax',
                    secure: process.env.NODE_ENV === 'production'
                });

                cookieRaw = cookieToken;
            }

            res.locals.csrf = {
                enabled: true,
                token: cookieToken,
                fieldName: '_csrf',
                headerName: 'X-CSRF-Token',
                cookieName: csrfCookieName
            };

            if (!SAFE_METHODS.has(req.method)) {
                if (checkOrigin) {
                    const allowedOrigin = process.env.UNB_BASE_URL;

                    if (!isValidOrigin(req, allowedOrigin)) {
                        Logger.warn('CsrfMiddleware', 'Origin check failed.', { origin: req.get('Origin'), referer: req.get('Referer') });

                        return res.status(403).json({ ok: false, error: 'CSRF_ORIGIN_INVALID' });
                    }
                }

                const providedRaw = CsrfService.extractToken(req);
                const provided = normalizeToken(providedRaw);

                if (!provided || !CsrfService.timingSafeEqual(cookieToken, provided)) {
                    return res.status(403).json({ ok: false, error: 'CSRF_INVALID' });
                }
            }

            return next();
        } catch (error) {
            Logger.error('CsrfMiddleware', `CSRF middleware failed: ${error}.`, { error });
            next(error);
        }
    };
};