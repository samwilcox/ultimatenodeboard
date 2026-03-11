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

const Logger = require('../log/logger');

/**
 * Either sets a new cookie or overwrites a cookie if its already been set.
 * 
 * @param {object} res - The response object from `Express`.
 * @param {string} name - The name for the cookie.
 * @param {any} value - The value to set.
 * @param {object} [options={}] - Optional options for setting the cookie. 
 */
const setCookie = (res, name, value, options = {}) => {
    options = options || {};

    if (res.headersSent) {
        Logger.warn('CookieHelper', 'Headers already sent. Unable to modify headers.');
        return;
    }

    const cookieOptions = {
        httpOnly: String(process.env.UNB_COOKIE_HTTP_ONLY).toLowerCase() === 'true',
        secure: String(process.env.UNB_COOKIE_SECURE).toLowerCase() === 'true',
        path: String(process.env.UNB_COOKIE_PATH) || '/',
        domain: String(process.env.UNB_COOKIE_DOMAIN) || '',
        maxAge: options.maxAge || Number(process.env.UNB_COOKIE_MAX_AGE_SECONDS) * 1000 || 3600 * 1000,
        sameSite: options.sameSite || String(process.env.UNB_COOKIE_SAME_SITE),
        ...options
    };

    Logger.debug('CookieHelper', `Setting cookie with name '${name}' and value '${value}'...`, { name, value });

    res.cookie(name, value, cookieOptions);

    Logger.debug('CookieHelper', `Cookie '${name}' with value '${value}' set.`, { name, value });
};

/**
 * Get a cookie value by name.
 * 
 * @param {object} req - The request object from `Express`.
 * @param {string} name - The name of the cookie.
 * @returns {any|null} The value of the cookie or `null` if the cookie does not exist.
 */
const getCookie = (req, name) => {
    return req.cookies?.[name] || null;
};

/**
 * Delete a cookie.
 * 
 * @param {object} res - The response object from `Express`.
 * @param {string} name - The name of the cookie.
 * @param {any|null} [options={}] - Options for deleting the cookie.
 */
const deleteCookie = (res, name, options = {}) => {
    const delOptions = { ...options, maxAge: 0 };

    Logger.debug('CookieHelper', `Deleting cookie '${name}'...`, { name });

    setCookie(res, name, '', delOptions);

    Logger.debug('CookieHelper', `Cookie '${name}' deleted.`, { name });
};

/**
 * Check if a cookie exists.
 * 
 * @param {object} req - The request object from `Express`.
 * @param {string} name - The name of the cookie.
 * @returns {boolean} `true` if the cookie exists, `false` if not.
 */
const cookieExists = (req, name) => {
    return getCookie(req, name) !== null;
};

module.exports = {
    setCookie,
    getCookie,
    deleteCookie,
    cookieExists
};