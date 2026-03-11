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

const { UNB_ERROR_EXPOSURE } = require('./error.enums');
const { generateHash } = require('../helpers/hash.helper');

/**
 * UNB error.
 * 
 * The base UNB error class.
 */
class UnbError extends Error {
    constructor(message, {
        code = '',
        expose = UNB_ERROR_EXPOSURE.NONE,
        metaData = {}
    } = {}) {
        super(message);
        this.code = code;
        this.expose = expose;
        this.metaData = metaData;
        this.hashCode = generateHash({ length: 8 });

        Error.captureStackTrace(this, this.constructor);
    }
};

module.exports = UnbError;