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
 * UNB bootstraps.
 */
module.exports = {
    initDatabase: require('./init-database'),
    initSettings: require('./init-settings'),
    initCache: require('./init-cache'),
    initLocale: require('./init-locale'),
    initRoutes: require('./init-routes'),
    initMembers: require('./init-members'),
    initForums: require('./init-forums'),
    initGroups: require('./init-groups'),
    initEmoji: require('./init.emoji'),
    initTags: require('./init-tags'),
    initOnline: require('./init-online')
};