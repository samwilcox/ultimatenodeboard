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
 * UNB sessions table schema.
 */
const SESSIONS_SCHEMA = Object.freeze({
    key: 'string',
    memberKey: 'string',
    expires: 'date',
    lastActivity: 'date',
    location: 'string',
    userAgent: 'string',
    ipAddress: 'string',
    hostname: 'string',
    bot: 'object',
    adminSession: 'boolean',
    revoked: 'boolean'
});

module.exports = SESSIONS_SCHEMA;