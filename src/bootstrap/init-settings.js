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

const createSettingsService = require('../settings');
const Logger = require('../log/logger');

/**
 * Initialize UNB application settings service.
 * 
 * @param {object[]} repo - The UNB database repository.
 * @returns {Promise<SettingsService>} A promise that resolves to the UNB settings service.
 */
const initSettings = async (repo) => {
    try {
        Logger.info('Initialization', 'Initializing the UNB application settings service...');

        const settingsService = createSettingsService();

        await settingsService.load(repo);

        Logger.info('Initialization', `UNB application settings initialized (${await settingsService.size()} key${await settingsService.size() === 1 ? '' : 's'}).`);

        return settingsService;
    } catch (error) {
        Logger.error('Bootstrap.initSettings', `Failed to initialize settings: ${error}.`, { error, repo });
        throw error;
    }
};

module.exports = initSettings;