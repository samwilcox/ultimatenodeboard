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
 * UNB groups table schema.
 */
const GROUPS_SCHEMA = Object.freeze({
    key: 'string',
    name: 'string',
    pluralName: 'string',
    description: 'string',
    sortOrder: 'number',
    system: 'boolean',
    inherits: 'array',
    color: 'object',
    icon: 'string'
});

module.exports = GROUPS_SCHEMA;