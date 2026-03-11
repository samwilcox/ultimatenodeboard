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
 * Cast a value to a given type.
 * 
 * @param {string} value - The value to cast.
 * @param {
 *  "string"|"number"|"int"|"float"|"boolean"|
 *  "bool"|"json"|"object"|"array"|"date"|
 *  "datetime"|"bigint"|"buffer"} type - The type to cast to.
 */
const cast = (value, type) => {
    if (value === null || value === undefined) return null;

    switch (type?.toLowerCase()) {
        case 'string':
            return String(value);
        
        case 'number':
        case 'int':
        case 'float':
            const num = Number(value);
            return isNaN(num) ? null : num;

        case 'boolean':
        case 'bool':
            if (typeof value === 'boolean') return value;
            if (typeof value === 'number') return value === 1;

            return ['true', '1', 'yes', 'on'].includes(
                String(value).toLowerCase()
            );

        case 'json':
        case 'object':
        case 'array':
            try { return JSON.parse(value); }
            catch { return null; }

        case 'date':
        case 'datetime':
            const date = new Date(value);
            return isNaN(date.getTime()) ? null : date;

        case 'bigint':
            try { return BigInt(value); }
            catch { return null; }

        case 'buffer':
            return Buffer.from(value);

        default:
            return value;
    }
};

module.exports = {
    cast
};