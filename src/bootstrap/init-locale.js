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

const createLocaleService = require('../locale');
const Logger = require('../log/logger');

/**
 * Initialize the UNB locale service.
 * 
 * @param {SettingsService} settingsService - The UNB settings service.
 * @param {object[]} repo - The UNB database repository.
 * @returns {Promise<LocaleService>} A promise that resolves to the UNB locale service.
 */
const initLocale = async (settingsService, repo) => {
    try {
        Logger.info('Initialization', 'Initializing the UNB locale service...');

        const localeService = createLocaleService(settingsService);

        await localeService.load();

        Logger.info('Initialization', 'UNB locale service initialized.');

        return localeService;
    } catch (error) {
        Logger.error('Bootstrap.initLocale', `Failed to initialize the UNB locale service: ${error}.`, { error, settingsService });
        throw error;
    }
};

module.exports = initLocale;