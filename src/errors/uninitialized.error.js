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

const UnbError = require('./unb.error');
const { UNB_ERROR_EXPOSURE, UNB_ERROR_CODES } = require('./error.enums');

/**
 * UNB uninitialized error.
 * 
 * Handles when something is has not been initialized.
 */
class UninitializedError extends UnbError {
    /**
     * Throw a new `UninitializedError`.
     * 
     * @param {string} message - The error message.
     * @param {object} [metaData={}] - Optional meta data for this error. 
     */
    constructor(message, metaData = {}) {
        super(message, {
            code: metaData.code ?? UNB_ERROR_CODES.UNINITIALIZED_ERROR,
            expose: metaData.expose ?? UNB_ERROR_EXPOSURE.USER,
            metaData
        });

        this.name = this.constructor.name;
        this.metaData = metaData;
    }
};

module.exports = UninitializedError;