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
 * UNB permission rules table schema.
 */
const PERMISSION_RULES_SCHEMA = Object.freeze({
    key: 'string',
    scopeType: 'string',
    scopeKey: 'string',
    enabled: 'boolean',
    users: 'object',
    groups: 'object',
    updatedAt: 'date',
    updatedBy: 'string'
});

module.exports = PERMISSION_RULES_SCHEMA;