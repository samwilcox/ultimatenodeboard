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
 * UNB forums table schema.
 */
const FORUMS_SCHEMA = Object.freeze({
    key: 'string',
    title: 'string',
    description: 'string',
    sortOrder: 'number',
    visible: 'boolean',
    color: 'object',
    icon: 'string',
    archived: 'boolean',
    parentKey: 'string',
    displayChildForums: 'boolean',
    childForums: 'array',
    forumType: 'string'
});

module.exports = FORUMS_SCHEMA;