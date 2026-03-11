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
 * For further details regarding the user-end license agreement, pleaseLO<
 * visit: https://license.ultimatenodeboard.com
 * 
 * =======================================================================
 */

const Logger = require('../log/logger');
const createMembersService = require('../members');

/**
 * Initialize the UNB members service.
 * 
 * @param {LocaleService} localeService - The UNB locale service instance.
 * @param {SettingsService} settingsService - The UNB settings service instance.
 * @param {object[]} repo - The UNB database repository.
 * @param {CacheProviderService} cacheProviderService - The UNB cache provider service instance.
 * @returns {MembersService} The UNB members service instance.
 */
const initMembers = async (localeService, settingsService, repo, cacheProviderService) => {
    try {
        Logger.info('Initialization', 'Initializing the UNB members service...');

        const membersService = createMembersService(localeService, settingsService, repo, cacheProviderService);
        await membersService.load();

        Logger.info('Initialization', 'UNB members service initialized.');

        return membersService;
    } catch (error) {
        Logger.error('Bootstrap.initMembers', `Init members failed: ${error}.`, { error });
        throw error;
    }
};

module.exports = initMembers;