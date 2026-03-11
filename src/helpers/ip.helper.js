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
 * Get the user's IP address.
 * 
 * @param {object} req - The request object from `Express`.
 * @returns {string} The user's IP address.
 */
const getUserIp = (req) => {
    let ip =
        req.headers['cf-connecting-ip'] ||
        req.headers['true-client-ip'] ||
        req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        req.ip ||
        req.socket.remoteAddress ||
        '';

    if (ip === '::1' || ip.startsWith('::ffff')) {
        ip = '127.0.0.1';
    }

    return ip;
};

module.exports = {
    getUserIp
};