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
 * UNB permission definitions table schema.
 */
const PERMISSION_DEFINITIONS_SCHEMA = Object.freeze({
    key: 'string',
    group: 'string',
    labelLocaleKey: 'string',
    descriptionLocaleKey: 'string',
    scopeTypes: ['global', 'forum', 'topic'],
    default: 'string',
    pluginKey: 'string',
    isDangerous: 'boolean',
    createdAt: 'date',
    updatedAt: 'date'
});

module.exports = PERMISSION_DEFINITIONS_SCHEMA;