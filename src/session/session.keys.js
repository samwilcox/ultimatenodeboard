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
 * UNB session variable keys.
 */
const UNB_SESSION_KEYS = Object.freeze({
    AUTH_TOKEN: 'unb.auth.token',
    TOPICS_SORT: 'unb.topics.sort',
    TOPICS_FILTER: 'unb.topics.filter',
    FORM_ERROR: 'unb.form.error'
});

module.exports = UNB_SESSION_KEYS;