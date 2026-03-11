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

const createGroupService = require("../groups");
const Logger = require('../log/logger');

/**
 * Initialize the UNB groups service.
 * 
 * @param {object[]} repo - The UNB database reposities.
 * @param {CacheProviderService} cacheProviderService - The UNB cache provider service instance.
 * @param {SettingsService} settingsService - The UNB settings service instance.
 * @returns {Promise<GroupService>} A promise that resolves to the UNB group service instance.  
 */
const initGroups = async (repo, cacheProviderService, settingsService) => {
    try {
        Logger.info('Initialization', 'Initializing the UNB groups service...');

        const groupService = createGroupService(repo, cacheProviderService, settingsService);

        await groupService.load();

        Logger.info('Initialization', 'UNB group service initialized.');

        return groupService;
    } catch (error) {
        Logger.error('Bootstrap.initGroups', `Init groups failed: ${error}.`, { error });
        throw error;
    }
};

module.exports = initGroups;