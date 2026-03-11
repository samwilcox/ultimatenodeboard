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
 * UNB members table schema.
 */
const MEMBERS_SCHEMA = Object.freeze({
    key: 'string',
    username: 'string',
    displayName: 'string',
    useDisplayName: 'boolean',
    passwordHash: 'string',
    emailAddress: 'string',
    locale: 'string',
    theme: 'string',
    settings: 'object',
    primaryGroup: 'string',
    secondaryGroups: 'array',
    photo: 'object',
    lockout: 'object',
    lastVisit: 'date'
});

module.exports = MEMBERS_SCHEMA;