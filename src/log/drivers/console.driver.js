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

const UNB_LOG_LEVELS = require('../log.levels');
const chalk = require('chalk');

/**
 * UNB console driver.
 * 
 * Handles the logging to the console window.
 */
class ConsoleDriver {
    /**
     * Output the log to the console window.
     * 
     * @param {string} timestamp - The timestamp for the logged message.
     * @param {UNB_LOG_LEVELS|string} level - The log level for this log. 
     * @param {string} section - The section where the message is coming from. 
     * @param {string} message - The log message. 
     */
    static out(timestamp, level, section, message) {
        switch (level) {
            case UNB_LOG_LEVELS.INFO:
                console.info(this.build(timestamp, level, section, message));
                break;

            case UNB_LOG_LEVELS.DEBUG:
                console.debug(this.build(timestamp, level, section, message));
                break;

            case UNB_LOG_LEVELS.WARN:
                console.warn(this.build(timestamp, level, section, message));
                break;

            case UNB_LOG_LEVELS.ERROR:
                console.error(this.build(timestamp, level, section, message));
                break;

            default:
                return;
        }
    }

    /**
     * Helper that builds the output for the console.
     * 
     * @private
     * @param {string} timestamp - The timestamp for the logged message.
     * @param {UNB_LOG_LEVELS|string} level - The log level for this log. 
     * @param {string} section - The section where the message is coming from. 
     * @param {string} message - The log message. 
     * @returns {string} The output to send to the console.
     */
    static build(timestamp, level, section, message) {
        const colors = {
            info: chalk.green.bold(`[${String(UNB_LOG_LEVELS.INFO.toUpperCase())}]`),
            debug: chalk.magenta(`[${String(UNB_LOG_LEVELS.DEBUG).toUpperCase()}]`),
            warn: chalk.yellow.bold(`[${String(UNB_LOG_LEVELS.WARN).toUpperCase()}]`),
            error: chalk.red.bold(`[${String(UNB_LOG_LEVELS.ERROR).toUpperCase()}]`),
            tag: chalk.cyan.bold('[UNB]'),
        };

        return `${colors.tag}${colors[level.toLowerCase()]}${chalk.gray(`[${timestamp}]`)}${chalk.blueBright(`[${section}]`)}: ${message}`;
    }
};

module.exports = ConsoleDriver;