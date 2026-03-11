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
 * Map a value to an automatically detected type.
 * 
 * @param {*} value - The value to map the the proper type.
 * @returns {*} The value in its detected type.
 */
const mapValue = (value) => {
    if (value === undefined) return null;
    if (value === null) return null;

    if (typeof value === 'boolean') return value ? 1 : 0;

    if (typeof value === 'bigint') return value.toString();

    if (value instanceof Date) {
        return value.toUTCString().slice(0, 19).replace('T', ' ');
    }

    if (Buffer.isBuffer(value)) return value;

    if (Array.isArray(value) || typeof value === 'object') {
        return JSON.stringify(value);
    }

    return value;
};

/**
 * Convert the row to the corresponding value types from the given schema.
 * 
 * @param {object} row - The row data object. 
 * @param {object} [schema={}] - The schema.
 * @returns {*} The value converted to the proper value type. 
 */
const rowHydrator = (row, schema = {}) => {
    const hydrated = {};

    for (const [key, value] of Object.entries(row)) {
        hydrated[key] = cast(value, schema[key]);
    }

    return hydrated;
};

/**
 * Helper that casts a value.
 * 
 * @param {*} value - The value to cast.
 * @param {string} type - The value type to cast.
 * @returns {*} The casted value. 
 */
const cast = (value, type) => {
    if (value === null || value === undefined) return null;

    switch (type) {
        case 'json':
            try { return JSON.parse(value); } catch { return value; }

        case 'boolean':
            return Boolean(value);

        case 'date':
            return new Date(value);

        case 'bigint':
            return BigInt(value);

        case 'number':
            return Number(value);

        default:
            return value;
    }
};

/**
 * Build a create query for MySQL.
 * 
 * @param {string} key - The key for this create query.
 * @param {object} data - The data being inserted.
 * @returns {string} The SQL create query.
 */
const buildCreateQuery = (key, data) => {
    const keys = Object.keys(data);
    const values = keys.map(k => mapValue(k));
    values.unshift(key);

    const placeholders = keys.map(() => '?').join(', ');
    const columns = keys.map(k => `\`${key}\``).join(', ');
    placeholders.unshift('?');
    columns.unshift('key, ');

    return `(${columns}) VALUES (${placeholders})`;
};

/**
 * Build an update query string.
 * 
 * @param {object} filter - The filter for updating. 
 * @param {object} data - The data to update.
 * @returns {{
 *      sql: string,
 *      values: array
 * }} An object containing the sql and values.
 */
const buildUpdateQuery = (filter, data) => {
    const filterKeys = Object.keys(filter);
    const dataKeys = Object.keys(data);

    const filterPlaceholders = filterKeys.map(([k, v]) => `${k} = ?`).join(' AND ');
    const dataPlaceholders = dataKeys.map(([k, v]) => `${k} = ?`).join(', ');

    const values = [...Object.values(data), ...Object.values(filter)];
    
    return {
        sql: `SET ${dataPlaceholders} WHERE ${filterPlaceholders}`,
        values
    };
};

/**
 * 
 * @param {object} filter - The filter for deleting.
 * @returns {{
 *      sql: string,
 *      values: array
 * }} An object conaining the sql and values.
 */
const buildDeleteQuery = (filter) => {
    const filterKeys = Object.keys(filter);
    const filterPlaceholders = filterKeys.map(([k, v]) => `${k} = ?`).join(' AND ');
    const values = filterKeys.map(k => mapValue(k));

    return {
        sql: filterPlaceholders,
        values
    };
};

module.exports = {
    mapValue,
    rowHydrator,
    buildCreateQuery,
    buildUpdateQuery,
    buildDeleteQuery
};