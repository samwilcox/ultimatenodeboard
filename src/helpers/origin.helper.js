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

/**
 * Check if an origin is valid.
 * 
 * @param {object} req - The request object from `Express`.
 * @param {string} allowedOrigin - The allowed origin.
 * @returns {boolean} `true` if the origin is valid, `false` if not.
 */
const isValidOrigin = (req, allowedOrigin) => {
    const origin = req.get('Origin') || req.get('Referer');
    if (!origin) return false;

    try {
        const url = new URL(origin);
        return url.origin === allowedOrigin;
    } catch {
        return false;
    }
};

module.exports = {
    isValidOrigin
};