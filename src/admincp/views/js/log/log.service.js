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
 * UNB AdminCP log service.
 */
UNB_ADMINCP.on('ui.init', () => {
    UNB_ADMINCP.log = UNB_ADMINCP.log || {};

    UNB_ADMINCP.log.levels = {
        info: 'info',
        debug: 'debug',
        warn: 'warn',
        error: 'error'
    };

    /**
     * Write a new log entry to the console.
     * 
     * @param {string} message - The message to log.
     * @param {object} [options={}] - Options for writing to the log. 
     */
    UNB_ADMINCP.log.write = (message, options = {}) => {
        const { level = UNB_ADMINCP.log.levels.info, section = null } = options;
        const segments = [];

        segments.push(UNB_ADMINCP.helpers.log.chalk.cyan('[UNB-ADMINCP]', true));

        switch (level) {
            case UNB_ADMINCP.log.levels.info:
                segments.push(UNB_ADMINCP.helpers.log.chalk.green('[INFO]'));
                break;

            case UNB_ADMINCP.log.levels.debug:
                segments.push(UNB_ADMINCP.helpers.log.chalk.purple('[DEBUG]'));
                break;

            case UNB_ADMINCP.log.levels.warn:
                segments.push(UNB_ADMINCP.helpers.log.chalk.yellow('[WARN]'));
                break;

            case UNB_ADMINCP.log.levels.error:
                segments.push(UNB_ADMINCP.helpers.log.chalk.red('[ERROR]'));
                break;

            default:
                segments.push(UNB_ADMINCP.helpers.log.chalk.pink('[UNKNOWN]'));
                break;
        }

        if (section) {
            segments.push(UNB_ADMINCP.helpers.log.chalk.darkYellow(`[${section}]`));
        }

        segments.push(UNB_ADMINCP.helpers.log.segment(`: ${message}`));

        const args = UNB_ADMINCP.helpers.log.combine(...segments);

        switch (level) {
            case UNB_ADMINCP.log.levels.info: console.info(...args); break;
            case UNB_ADMINCP.log.levels.debug: console.debug(...args); break;
            case UNB_ADMINCP.log.levels.warn: console.warn(...args); break;
            case UNB_ADMINCP.log.levels.error: console.error(...args); break;
            default: console.log(...args); break;
        }
    };

    /**
     * Log an info message to the console.
     * 
     * @param {string} message - The message to log.
     * @param {string|null} [section=null] - Optional section name. 
     */
    UNB_ADMINCP.log.info = (message, section = null) => {
        UNB_ADMINCP.log.write(message, { level: UNB_ADMINCP.log.levels.info, section });
    };

    /**
     * Log an debug message to the console.
     * 
     * @param {string} message - The message to log.
     * @param {string|null} [section=null] - Optional section name. 
     */
    UNB_ADMINCP.log.debug = (message, section = null) => {
        UNB_ADMINCP.log.write(message, { level: UNB_ADMINCP.log.levels.debug, section });
    };

    /**
     * Log an warn message to the console.
     * 
     * @param {string} message - The message to log.
     * @param {string|null} [section=null] - Optional section name. 
     */
    UNB_ADMINCP.log.warn = (message, section = null) => {
        UNB_ADMINCP.log.write(message, { level: UNB_ADMINCP.log.levels.warn, section });
    };

    /**
     * Log an error message to the console.
     * 
     * @param {string} message - The message to log.
     * @param {string|null} [section=null] - Optional section name. 
     */
    UNB_ADMINCP.log.error = (message, section = null) => {
        UNB_ADMINCP.log.write(message, { level: UNB_ADMINCP.log.levels.error, section });
    };
});