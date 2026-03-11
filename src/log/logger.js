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

const { DateTime } = require('luxon');
const ConsoleDriver = require('./drivers/console.driver');
const UNB_LOG_LEVELS = require('./log.levels');

/**
 * UNB logging system.
 * 
 * This logs messages to the console and/or the database.
 */
class Logger {
    static _levels = [
        UNB_LOG_LEVELS.INFO,
        UNB_LOG_LEVELS.DEBUG,
        UNB_LOG_LEVELS.WARN,
        UNB_LOG_LEVELS.ERROR
    ];

    /**
     * Log a new message.
     * 
     * @param {string} section - The application section logging from.
     * @param {UNB_LOG_TYPE|string} level - The log level for this message.
     * @param {string} message - The message to log. 
     * @param {object} [metaData={}] - Optional additional data. 
     */
    static log(section, level, message, metaData = {}) {
        if (this.logToConsole(level)) {
            ConsoleDriver.out(this.timestamp(), level, section, message);
        }
    }

    /**
     * Log an info message.
     * 
     * @param {string} section - The application section logging from.
     * @param {string} message - The message to log.
     * @param {object} [metaData={}] - Optional additional information. 
     */
    static info(section, message, metaData = {}) {
        this.log(section, UNB_LOG_LEVELS.INFO, message, metaData);
    }

    /**
     * Log a debug message.
     * 
     * @param {string} section - The application section logging from.
     * @param {string} message - The message to log.
     * @param {object} [metaData={}] - Optional additional information. 
     */
    static debug(section, message, metaData = {}) {
        this.log(section, UNB_LOG_LEVELS.INFO, message, metaData);
    }

    /**
     * Log a warning message.
     * 
     * @param {string} section - The application section logging from.
     * @param {string} message - The message to log.
     * @param {object} [metaData={}] - Optional additional information. 
     */
    static warn(section, message, metaData = {}) {
        this.log(section, UNB_LOG_LEVELS.INFO, message, metaData);
    }

    /**
     * Log an error message.
     * 
     * @param {string} section - The application section logging from.
     * @param {string} message - The message to log.
     * @param {object} [metaData={}] - Optional additional information. 
     */
    static error(section, message, metaData = {}) {
        this.log(section, UNB_LOG_LEVELS.INFO, message, metaData);
    }

    /**
     * Helper that returns whether to log the message to the console.
     * 
     * @private
     * @param {UNB_LOG_LEVELS|string} level - The UNB log level. 
     * @returns {boolean} `true` to log to the console, `false` not to.
     */
    static logToConsole(level) {
        const idx = Logger._levels.indexOf(level);
        if (idx === -1) return false;

        const logLevel = process.env.UNB_LOG_LEVEL;
        if (!logLevel) return false;

        const logLevelIdx = Logger._levels.indexOf(logLevel);
        if (!logLevelIdx === -1) return false;

        if (idx <= logLevelIdx) return true;
        return false;
    }

    /**
     * Returns the timestamp for the log entry.
     * 
     * @private
     * @returns {string} The timestamp for the log entry.
     */
    static timestamp() {
        const tz = process.env.UNB_LOG_TIMEZONE;

        return DateTime.now()
            .setZone(tz)
            .toFormat('yyyy-LL-dd HH:mm:ss ZZZZ');
    }
};

module.exports = Logger;