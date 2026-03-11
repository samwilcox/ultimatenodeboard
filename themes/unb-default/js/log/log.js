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
 * UNB log service.
 */
UNB.on('ui.init', function () {
    UNB.log = UNB.log || {};

    // UNB log levels
    UNB.log.levels = {
        info: 'info',
        debug: 'debug',
        warn: 'warn',
        error: 'error'
    };

    /**
     * Write a new log entry to the console.
     * 
     * @param {string} message - The message to log.
     * @param {object} [options={}] - Options for writing the log.
     * @param {UNB.log.levels|string} [options.level='UNB.log.levels.info'] - The log level for this log entry.
     * @param {string|null} [options.section=null] - The UNB framework section (default is `null`). 
     */
    UNB.log.write = (message, options = {}) => {
        const { level = UNB.log.levels.info, section = null } = options;
        const segments = [];

        segments.push(UNB.helpers.log.chalk.cyan('[UNB]', true));

        switch (level) {
            case UNB.log.levels.info:
                segments.push(UNB.helpers.log.chalk.green('[INFO]'));
                break;

            case UNB.log.levels.debug:
                segments.push(UNB.helpers.log.chalk.purple('[DEBUG]'));
                break;

            case UNB.log.levels.warn:
                segments.push(UNB.helpers.log.chalk.yellow('[WARN]'));
                break;

            case UNB.log.levels.error:
                segments.push(UNB.helpers.log.chalk.red('[ERROR]'));
                break;

            default:
                segments.push(UNB.helpers.log.chalk.pink('[UNKNOWN]'));
                break;
        }

        if (section) {
            segments.push(UNB.helpers.log.chalk.darkYellow(`[${section}]`));
        }

        segments.push(UNB.helpers.log.segment(`: ${message}`));

        const args = UNB.helpers.log.combine(...segments);

        switch (level) {
            case UNB.log.levels.info: console.info(...args); break;
            case UNB.log.levels.debug: console.debug(...args); break;
            case UNB.log.levels.warn: console.warn(...args); break;
            case UNB.log.levels.error: console.error(...args); break;
            default: console.log(...args); break;
        }
    };

    /**
     * Log an info message to the console.
     * 
     * @param {string} message - The message to log.
     * @param {string|null} [section=null] - Optional section string (default is `null`). 
     */
    UNB.log.info = (message, section = null) => {
        UNB.log.write(message, { level: UNB.log.levels.info, section });
    };

    /**
     * Log an debug message to the console.
     * 
     * @param {string} message - The message to log.
     * @param {string|null} [section=null] - Optional section string (default is `null`). 
     */
    UNB.log.debug = (message, section = null) => {
        UNB.log.write(message, { level: UNB.log.levels.debug, section });
    };

    /**
     * Log an warning message to the console.
     * 
     * @param {string} message - The message to log.
     * @param {string|null} [section=null] - Optional section string (default is `null`). 
     */
    UNB.log.warn = (message, section = null) => {
        UNB.log.write(message, { level: UNB.log.levels.warn, section });
    };

    /**
     * Log an error message to the console.
     * 
     * @param {string} message - The message to log.
     * @param {string|null} [section=null] - Optional section string (default is `null`). 
     */
    UNB.log.error = (message, section = null) => {
        UNB.log.write(message, { level: UNB.log.levels.error, section });
    };
});