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
 * UNB posts table schema.
 */
const POSTS_SCHEMA = Object.freeze({
    key: 'string',
    forumKey: 'string',
    topicKey: 'string',
    postNumber: 'number',
    createdBy: 'string',
    createdAt: 'date',
    tags: 'array',
    content: 'object',
    attachments: 'array',
    ipAddress: 'string',
    hostname: 'string',
    userAgent: 'string'
});

module.exports = POSTS_SCHEMA;