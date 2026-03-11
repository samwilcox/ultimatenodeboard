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
 * UNB log levels.
 */
const UNB_LOG_LEVELS = Object.freeze({
    /**
     * 0. Information log level.
     */
    INFO: 'INFO',

    /**
     * 1. Debug log level.
     */
    DEBUG: 'DEBUG',

    /**
     * 2. Warning log level.
     */
    WARN: 'WARN',

    /**
     * 3. Error log level.
     */
    ERROR: 'ERROR'
});

module.exports = UNB_LOG_LEVELS;