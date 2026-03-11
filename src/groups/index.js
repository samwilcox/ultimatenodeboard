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

const GroupService = require("./group.service");

let _instance = null;

/**
 * Create the UNB group service instance.
 * 
 * @param {object[]} repo - The UNB database repositories.   
 * @param {CacheProviderService} cacheProviderService - The UNB cache service. 
 * @param {SettingsService} settingsService - The UNB settings service instance.
 * @returns {GroupService} The UNB group service instance.
 */
const createGroupService = (repo, cacheProviderService, settingsService) => {
    if (!_instance) _instance = new GroupService(repo, cacheProviderService, settingsService);
    return _instance;
};

module.exports = createGroupService;