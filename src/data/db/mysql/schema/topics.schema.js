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
 * UNB topics table schema.
 */
const TOPICS_SCHEMA = Object.freeze({
    key: 'string',
    forumKey: 'string',
    title: 'string',
    createdBy: 'string',
    createdAt: 'date',
    tags: 'array',
    totalViews: 'number',
    locked: 'boolean',
    visible: 'boolean',
    pollKey: 'string'
});

module.exports = TOPICS_SCHEMA;