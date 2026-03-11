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

const crypto = require('crypto');
const InvalidParameterError = require('../../errors/invalid-parameter.error');

/**
 * UNB key generator service.
 * 
 * This class generates brand new random key strings for database record entries.
 */
class KeyGeneratorService {
    /**
     * Generate an unique key for a database record entry.
     * 
     * @param {string} prefix - The key prefix (e.g., `t` or `p`, `post_', etc).
     * @param {number} [randomBytes=4] - Random byte length (default is `4`).
     * @returns {string} The unique key.
     * @throws {InvalidParameterError} If the prefix is invalid. 
     */
    static generate(prefix, randomBytes = 4) {
        if (!prefix || typeof prefix !== 'string') {
            throw new InvalidParameterError('Invalid prefix given to generate a new key for a database record entry.', { prefix });
        }

        const timePart = Date.now().toString(36);

        const randomPart = crypto
            .randomBytes(randomBytes)
            .toString('base64url');

        return `${prefix}_${timePart}_${randomPart}`;
    }
};

module.exports = KeyGeneratorService;