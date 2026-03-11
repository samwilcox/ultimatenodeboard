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

const createForumsService = require('../forums');
const Logger = require('../log/logger');

/**
 * Initialize the UNB forums service.
 * 
 * @param {CacheProviderService} cacheProviderService - The UNB cache provider service instance. 
 * @param {object[]} repo - The UNB database repositories.
 * @returns {ForumsService} The UNB forums service instance. 
 */
const initForums = async (cacheProviderService, repo) => {
    try {
        Logger.info('Initialization', 'Initializing the UNB forums service...');

        const forumsService = createForumsService(cacheProviderService, repo);

        await forumsService.load();

        Logger.info('Initialization', 'UNB forums service initialized.');

        return forumsService;
    } catch (error) {
        Logger.error('Bootstrap.initForums', `Init forums failed: ${error}.`, { error });
        throw error;
    }
};

module.exports = initForums;