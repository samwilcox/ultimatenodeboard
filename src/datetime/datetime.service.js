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
const { pluralOrSingular } = require('../helpers/grammer.helper');
const DataStore = require('../datastore/datastore');
const UNB_SETTING_KEYS = require('../settings/settings.keys');

/**
 * UNB date time service
 * 
 * Service for parsing and working with timestamps.
 */
class DateTimeService {
    /**
     * Normalize supported date input types into a native Date object.
     * 
     * @param {Date|number|string} input - The raw date input to normalize.
     * @returns {Date} A valid Date instance.
     * @throws {TypeError} If the input cannot be normalized to a Date object. 
     */
    static normalizeDate(input) {
        if (input instanceof Date) return input;
        if (typeof input === 'number') return new Date(input);
        if (typeof input === 'string') return new Date(input);

        throw new TypeError('normalizeDate(): invalid date input.');
    }

    /**
     * Formats a date as a localized relative time string (e.g., `5 minutes ago`).
     * 
     * @param {Date} date - The normalized Date instance. 
     * @param {object} [options={}] - Relative formatting options.
     * @param {string} [options.timeZone] - The timezone identifier (IANA).
     * @returns {Promise<string|null>} A promise that resolves to a localized relative time string,
     *                                 or `null` if not applicable. 
     */
    static async formatRelativeTime(date, options = {}) {
        const {
            timeZone = 'UTC'
        } = options;

        const { settingsService, localeService } = DataStore.get('unb');

        const maxDays = await settingsService.get(UNB_SETTING_KEYS.DATETIME_TIMEAGO_MAX_DAYS);
        const now = new Date();
        const diffMs = now - date;

        if (diffMs < 0) return null;

        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);
        const diffMonths = Math.floor(diffDays / 30); // Approx
        const diffYears = Math.floor(diffDays / 365); // Approx

        if (diffDays > maxDays) {
            return null;
        }

        if (diffSeconds < 60) {
            return await localeService.t('datetime.service.just.now');
        }

        if (diffMinutes < 60) {
            return await pluralOrSingular('datetime.service.minutes.ago', 'datetime.service.minute.ago', diffMinutes);
        }

        if (diffHours < 24) {
            return await pluralOrSingular('datetime.service.hours.ago', 'datetime.service.hour.ago', diffHours);
        }

        if (diffDays < 30) {
            return await pluralOrSingular('datetime.service.days.ago', 'datetime.service.day.ago', diffDays);
        }

        if (diffMonths < 12) {
            return await pluralOrSingular('datetime.service.months.ago', 'datetime.service.month.ago', diffMonths);
        }

        return await pluralOrSingular('datetime.service.years.ago', 'datetime.service.year.ago', diffYears);
    }

    /**
     * Formats a date using a custom pattern string.
     * 
     * Supported tokens:
     * yyyy, MM, dd, hh, HH, mm, a
     * 
     * @param {Date} date - The normalized Date instance.
     * @param {object} options - Options for formatting Date with pattern.
     * @param {string} options.pattern - THe date/time pattern string.
     * @param {string} options.timeZone - The IANA timezone identifier.
     * @returns {string} The formatted date/time string. 
     */
    static formatDateWithPattern(date, { pattern, timeZone }) {
        const { member } = DataStore.get('unb');
        const locale = member.locale;

        const zonedDate = new Date(date.toLocaleString(locale, { timeZone }));
        const pad = (n) => String(n).padStart(2, '0');

        const map = {
            yyyy: zonedDate.getFullYear(),
            MM: pad(zonedDate.getMonth() + 1),
            dd: pad(zonedDate.getDate()),
            hh: pad(((zonedDate.getHours() + 11) % 12) + 1),
            HH: pad(zonedDate.getHours()),
            mm: pad(zonedDate.getMinutes()),
            a: zonedDate.getHours() >= 12 ? 'PM' : 'AM'
        };

        return pattern.replace(
            /yyyy|MM|dd|hh|HH|mm|a/g,
            token => map[token]
        );
    }

    /**
     * Formats a date/time value according to system defaults or member preferences.
     * 
     * @param {Date|number|string} input - The date value to format. 
     * @param {object} [options={}] - Formatting options.
     * @param {boolean} [options.dateOnly=false] - `true` to only format and return the date itself (default is `false`).
     * @param {boolean} [options.timeOnly=false] - `true` to only format and return the time itself (default is `false`).
     * @param {boolean} [options.timeAgo=false] - `true` to return a human-readable time ago string for the date (e.g., `2 minutes ago`) (default is `false`). 
     * @returns {Promise<string>} A promise that resolves to a formatted date and/or time string depending on options.
     */
    static async formatDateTime(input, options = {}) {
        const date = DateTimeService.normalizeDate(input);

        const {
            dateOnly = false,
            timeOnly = false,
            timeAgo = false
        } = options;

        const { member, settingsService } = DataStore.get('unb');

        const defaultDateTime = await settingsService.get(UNB_SETTING_KEYS.DATETIME_DEFAULT);
        let relative = defaultDateTime.timeAgo;
        let dateTime = member.settings.dateTime;
        const locale = member.locale;

        if (relative && timeAgo) {
            const relativeResult = await DateTimeService.formatRelativeTime(date, {
                timeZone: dateTime.timeZone
            });

            if (relativeResult !== null) {
                return relativeResult;
            }
        }

        const resolvedFormat =
            timeOnly ? dateTime.format.time :
            dateOnly ? dateTime.format.date :
            dateTime.format.full;

        if (resolvedFormat) {
            return DateTimeService.formatDateWithPattern(date, {
                pattern: resolvedFormat,
                timeZone: dateTime.timeZone
            });
        }

        const intlOptions = { timeZone: dateTime.timeZone };

        if (!timeOnly) intlOptions.dateStyle = 'medium';
        if (!dateOnly) intlOptions.timeStyle = 'short';

        return new Intl.DateTimeFormat(locale, intlOptions).format(date);
    }

    /**
     * Returns the GMT offset for a given IANA timezone.
     * 
     * Example output:
     *   `+02:00`
     *   `-07:00`
     * 
     * @param {string} timeZone - The time zone.
     * @returns {string} The GMT offset.
     */
    static getTimezoneOffset(timeZone) {
        const date = new Date();

        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone,
            timeZoneName: 'shortOffset'
        }).formatToParts(date);

        const offsetPart = parts.find(p => p.type === 'timeZoneName');
        let result = offsetPart ? offsetPart.value.replace('GMT', '') : '+0:00';

        if (!result.includes(':')) {
            result = `${result}:00`;
        }

        return result;
    }

    /**
     * Converts a Date object into a Unix epoch timestamp.
     * 
     * @param {Date} date - The javascript Date instance to convert.
     * @returns {number} The epoch timestamp in milliseconds.
     */
    static dateToEpoch(date) {
        return date.getTime();
    }

    /**
     * Converts a Unix epoch timestamp into a Date object.
     * 
     * @param {number} epoch - The epoch timestamp in milliseconds.
     * @returns {Date} A javascript Date instance representing the timestamp.
     */
    static epochToDate(epoch) {
        return new Date(epoch);
    }

    /**
     * Convert a string value to a javascript Date object.
     * 
     * @param {string} str - The string to convert to a Date object.
     * @param {number} [depth=0] - The depth to help prevent excessive recursion.
     * @returns {Date|null} The resuling javascript Date object or `null` if invalid. 
     */
    static stringToDate(str, depth = 0) {
        if (!str || typeof str !== 'string') {
            return null;
        }

        str = str.trim();
        
        if (depth > 10) return null;

        let isoDate = DateTime.fromISO(str);
        if (isoDate.isValid) return isoDate.toJSDate();

        let sqlDate = DateTime.fromSQL(str);
        if (sqlDate.isValid) return sqlDate.toJSDate();

        if (/^\d{10}$/.test(str)) {
            let unixDate = DateTime.fromSeconds(parseInt(str, 10));
            if (unixDate.isValid) return unixDate.toJSDate();
        }

        const relativeMatch = str.match(/([+-]?\d+)\s*(seconds?|secs?|sec?|minutes?|mins?|min?|hours?|hrs?|hr?|days?|weeks?|months?|mnths?|mnth?|years?|yr?|yrs?)/i);

        if (relativeMatch) {
            const amount = parseInt(relativeMatch[1], 10);
            const unit = normalizeLuxonUnit(relativeMatch[2]);

            const dt = DateTime.now().plus({ [unit]: amount });

            return dt.isValid ? dt.toJSDate() : null;
        }

        const yearFormats = ["yyyy", "yy"];
        const monthFormats = ["MMMM", "MMM", "MM"];
        const dayFormats = ["d", "dd"];
        const separators = ["-", "/", ".", " "];

        let possibleFormats = [];
        for (let y of yearFormats) {
            for (let m of monthFormats) {
                for (let d of dayFormats) {
                    for (let sep of separators) {
                        possibleFormats.push(`${m}${sep}${d}${sep}${y}`);
                        possibleFormats.push(`${y}${sep}${m}${sep}${d}`);
                        possibleFormats.push(`${d}${sep}${m}${sep}${y}`);
                    }
                }
            }
        }

        let timeFormats = ["HH:mm:ss", "HH:mm", "h:mm a"];
        for (let fmt of [...possibleFormats]) {
            for (let t of timeFormats) {
                possibleFormats.push(`${fmt} ${t}`);
            }
        }

        for (const format of possibleFormats) {
            let date = DateTime.fromFormat(input, format);
            if (date.isValid) return date.toJSDate();
        }

        const cleanedInput = str.replace(/\s+/g, " ").trim();
        if (cleanedInput !== str) {
            return this.stringToDate(cleanedInput, depth + 1);
        }

        return null;   
    }

    /**
     * Format the time gap between two timestamps.
     * 
     * @param {Date|string|number} eariler - The earlier timestamp. 
     * @param {Date|string|number} later - The later timestamp.
     * @returns {string|null} The gap label string or `null` if invalid. 
     */
    static formatTimeGap(eariler, later) {
        const MS = {
            minute: 60 * 1000,
            hour: 60 * 60 * 1000,
            day: 24 * 60 * 60 * 1000,
            week: 7 * 24 * 60 * 60 * 1000,
            month: 30 * 24 * 60 * 60 * 1000,
            year: 365 * 24 * 60 * 60 * 1000
        };

        if (!eariler || !later) return null;

        const start = new Date(eariler);
        const end = new Date(later);

        const diff = end.getTime() - start.getTime();

        if (diff <= 0) return null;

        let value;
        let unit;

        if (diff >= MS.year) {
            value = Math.floor(diff / MS.year);
            unit = 'year';
        } else if (diff >= MS.month) {
            value = Math.floor(diff / MS.month);
            unit = 'month';
        } else if (diff >= MS.week) {
            value = Math.floor(diff / MS.week);
            unit = 'week';
        } else if (diff >= MS.day) {
            value = Math.floor(diff / MS.day);
            unit = 'day';
        } else if (diff >= MS.hour) {
            value = Math.floor(diff / MS.hour);
            unit = 'hour';
        } else {
            value = Math.floor(diff / MS.minute);
            unit = 'minute';
        }

        switch (unit) {
            case 'minute':
                return pluralOrSingular(
                    'datetime.service.gap.minutes.later',
                    'datetime.service.gap.minute.later',
                    value
                );
            case 'hour':
                return pluralOrSingular(
                    'datetime.service.gap.hours.later',
                    'datetime.service.gap.hour.later',
                    value
                );
            case 'day':
                return pluralOrSingular(
                    'datetime.service.gap.days.later',
                    'datetime.service.gap.day.later',
                    value
                );
            case 'week':
                return pluralOrSingular(
                    'datetime.service.gap.weeks.later',
                    'datetime.service.gap.week.later',
                    value
                );
            case 'month':
                return pluralOrSingular(
                    'datetime.service.gap.months.later',
                    'datetime.service.gap.month.later',
                    value
                );
            case 'year':
                return pluralOrSingular(
                    'datetime.service.gap.years.later',
                    'datetime.service.gap.year.later',
                    value
                );
            default:
                return null;
        }
    }
}

module.exports = DateTimeService;