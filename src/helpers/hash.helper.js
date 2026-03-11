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

/**
 * Helper that generates a hash string.
 * 
 * @param {object} [options={}] - Options for generating the hash.
 * @param {*|null} [options.data=''] - Optional data to embed into the hash.
 * @param {number} [options.length=32] - The total character length for the hash (default is `32`).
 * @returns {string} The generated hash string. 
 */
const generateHash = (options = {}) => {
    const { data = '', length = 32 } = options;
    const token = crypto.randomBytes(32).toString('hex');
    return crypto.createHash('sha256').update(token + data).digest('hex').substring(0, length);
};

module.exports = {
    generateHash
};