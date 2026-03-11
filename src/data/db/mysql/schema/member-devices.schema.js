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
 * UNB member devices table schema.
 */
const MEMBER_DEVICES_SCHEMA = Object.freeze({
    key: 'string',
    memberKey: 'string',
    authToken: 'string',
    userAgent: 'string',
    ipAddress: 'string',
    lastUsedAt: 'date'
});

module.exports = MEMBER_DEVICES_SCHEMA;