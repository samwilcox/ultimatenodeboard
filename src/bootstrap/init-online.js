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

const Logger = require('../log/logger');
const createOnlineTrackerService = require('../online');

/**
 * Initialize the UNB online tracker service.
 * 
 * @param {SettingsService} settingsService - The UNB settings service instance.
 * @returns {Promise<OnlineTrackerService>} A promise that resolves to the UNB online tracker
 *                                          service instance. 
 */
const initOnline = async (settingsService) => {
    try {
        Logger.info('Initialization', 'Initializing the UNB online tracker service...');

        const onlineTrackerService = createOnlineTrackerService(settingsService);

        await onlineTrackerService.load();

        Logger.info('Initialization', 'UNB online tracker service initialized.');

        return onlineTrackerService;
    } catch (error) {
        Logger.error('Bootstrap.initOnline', `Failed to initialize online tracker service: ${error}.`, { error });
        throw error;
    }
};

module.exports = initOnline;