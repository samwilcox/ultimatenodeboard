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

const CacheFactory = require('../data/cache/cache.factory');
const Logger = require('../log/logger');

/**
 * Initialize the UNB cache service.
 * 
 * @returns {Promise<CacheProvider>} A promise that resolves to the UNB cache service provider instance.
 */
const initCache = async () => {
    try {
        Logger.info('Initialization', 'Initializing UNB cache service provider...');

        const cacheProvider = await CacheFactory.create();

        Logger.info('Initialization', 'UNB cache service provider initialized.', { cacheProvider });

        return cacheProvider;
    } catch (error) {
        Logger.error('Bootstrap.initCache', `Failed to initialize the UNB cache service provider: ${error}.`, { error });
        throw error;
    }
};

module.exports = initCache;