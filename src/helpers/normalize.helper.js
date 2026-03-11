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
 * Normalize a value to a number.
 * 
 * @param {any} value - The value to normalize to a number.
 * @returns {number} The normalized number.
 */
const normalizeNumber = (value) => {
    return Number(value);
};

/**
 * Normalize a value to a boolean.
 * 
 * @param {any} value - The input to normalize.
 * @param {boolean} [def=false] - The default if value cannot be normalized.
 * @returns {boolean} The normalized boolean value. 
 */
const normalizeBoolean = (value, def = false) => {
    if (!value) return def;

    if (typeof value === 'number') {
        return normalizeNumber(value) === 1;
    }

    if (typeof value === 'string') {
        return String(value).toLowerCase === 'true' || String(value).toLowerCase() === '1';
    }

    if (typeof value === 'boolean') {
        return value;
    }

    return def;
};

/**
 * Normalize a value to an object.
 * 
 * @param {any} value - The input to normalize.
 * @param {object} [def={}] - The default if value cannot be normalized. 
 * @returns {object} The normalized object.
 */
const normalizeObject = (value, def = {}) => {
    if (!value) return def;

    if (typeof value === 'string') {
        try {
            return JSON.parse(value);
        } catch {
            return def;
        }
    }

    if (typeof value === 'object') {
        return value;
    }

    return def;
};

/**
 * Normalize a timestamp.
 * 
 * @param {any} value - The input to normalize.
 * @param {any|null} [def=null] - The default if value cannot be normalized.
 * @returns {Date|null} The normalized Date object or `null`. 
 */
const normalizeTimestamp = (value, def = null) => {
    if (value == null) return def;

    if (value instanceof Date) {
        return isNaN(value.getTime()) ? def : value;
    }

    if (typeof value === 'number') {
        const d = new Date(value);
        return isNaN(d.getTime()) ? def : d;
    }

    if (typeof value === 'string') {
        const d = new Date(value);
        return isNaN(d.getTime()) ? def : d;
    }

    return def;
};

/**
 * Normalize an array.
 * 
 * @param {any} value - The input to normalize. 
 * @param {array|null} [def=null] - The default if value cannot be normalized.
 * @returns {array} The normalized array. 
 */
const normalizeArray = (value, def = null) => {
    if (!value) return def;

    if (typeof value === 'string') {
        try {
            return JSON.parse(value);
        } catch {
            return def;
        }
    }

    if (Array.isArray(value)) {
        return value;
    }

    return def;
};

/**
 * Normalize an enum.
 * 
 * @param {any} value - The input to normalize.
 * @param {string[]} allowedValues - An array of allowed values. 
 * @param {array|null} [def=null] - The default if value cannot be normalized. 
 */
const normalizeEnum = (value, allowedValues, def = null) => {
    if (!value || !Array.isArray(allowedValues)) return def;

    let allowed = false;
    let officialValue = null;

    for (const v of allowedValues) {
        if (v.toLowerCase() === value.toLowerCase()) {
            allowed = true;
            officialValue = v;
            break;
        }
    }

    if (!allowed) return def;

    return officialValue;
};

/**
 * Normalize a big int.
 * 
 * @param {any} value - The value to normalize to big int.
 * @param {bigint|null} [def=null] - The default is value cannot be normalized. 
 * @returns {bigint} The resulting normalized big int value.
 */
const normalizeBigInt = (value, def = null) => {
    if (!value) return def;
    return BigInt(value);
};

module.exports = {
    normalizeNumber,
    normalizeBoolean,
    normalizeObject,
    normalizeTimestamp,
    normalizeArray,
    normalizeEnum,
    normalizeBigInt
};