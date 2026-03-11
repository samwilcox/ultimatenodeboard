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

const crypto = require('crypto');
const CsrfError = require('../errors/csrf.error');

/**
 * UNB CSRF service
 * 
 * Service for CSRF security measures to protect against attacks.
 */
class CsrfService {
    /**
     * Generate a brand new CSRF token.
     * 
     * @returns {string} The generated token.
     */
    static generateToken() {
        return crypto.randomBytes(32).toString('hex');
    }

    /**
     * Ensures that the CSRF token does exist.
     * 
     * @param {object} req - The request object from `Express`.
     * @param {object} [options={}] - Options for ensuring the token.
     * @param {boolean} [options.expires] - `true` if CSRF token expires, `false` if not.
     * @param {number} [options.ttlSeconds] - The total seconds a CSRF token has to live (if `options.expires=true`).
     * @returns {object} The UNB CSRF data object instance.
     * @throws {CsrfError} If `req.session` is not present.
     */
    static ensure(req, options = {}) {
        const { expires, ttlSeconds } = options;
        const { localeService } = req.app.locals;

        if (!req.session) {
            throw new CsrfError(localeService.tSync('security.csrf.req.session.required'), { req });
        }

        const now = new Date();

        if (!req.session.csrf) {
            const token = this.generateToken();

            req.session.csrf = {
                token,
                issuedAt: now,
                expiresAt: expires
                    ? now + ttlSeconds * 1000
                    : null
            };
        }

        return req.session.csrf;
    }

    /**
     * Rotate a CSRF token.
     * 
     * @param {object} req - The request object from `Express`.
     * @param {object} [options={}] - Options for rotating the CSRF token.
     * @param {boolean} [options.expires] - `true` if the CSRF tokens expire, `false` if not.
     * @param {number} [options.ttlSeconds] - The total seconds a CSRF token has to live (if `options.expires=true`).
     * @throws {CsrfError} If `req.session` is not present. 
     */
    static rotate(req, options = {}) {
        const { expires, ttlSeconds } = options;
        const { localeService } = req.app.locals;

        if (!req.session) {
            throw new CsrfError(localeService.tSync('security.csrf.req.session.required'), { req });
        }

        const now = new Date();

        req.session.csrf = {
            token: this.generateToken(),
            issuedAt: now,
            expiresAt: expires
                ? now + ttlSeconds * 1000
                : null
        };

        return req.session.csrf;
    }

    /**
     * Check if a CSRF token has expired.
     * 
     * @param {object} csrf - The UNB CSRF security token object instance.
     * @returns {boolean} `true` if the token is expired, `false` if not.
     */
    static isExpired(csrf) {
        if (!csrf || !csrf.expiresAt) {
            return false;
        }

        return Date.now() > csrf.expiresAt;
    }

    /**
     * Check if two strings are equal keeping it safe for timing purposes.
     * 
     * @param {string} a - The first string.
     * @param {string} b - The second string.
     * @returns {boolean} `true` if strings are equal, `false` if not.
     */
    static timingSafeEqual(a, b) {
        try {
            const ba = Buffer.from(a, 'utf8');
            const bb = Buffer.from(b, 'utf8');
            return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
        } catch {
            return false;
        }
    }

    /**
     * Extract the token from the request object from `Express`.
     * 
     * @param {object} req - The request object from `Express`.
     * @returns {object} The UNB CSRF security token data object instance.
     */
    static extractToken(req) {
        return (
            req.get?.('X-CSRF-Token') ||
            req.headers?.['x-csrf-token'] ||
            req.body?._csrf ||
            null
        );
    }
}

module.exports = CsrfService;