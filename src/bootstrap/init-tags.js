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
const createTagsService = require('../tags');

/**
 * Initialize the UNB tags service.
 * 
 * @param {object[]} repo - The UNB database repositories collection.
 * @returns {Promise<TagsService>} A promise that resolves to the UNB tags service. 
 */
const initTags = async (repo) => {
    try {
        Logger.info('Initialization', 'Initializing the UNB tags service...');

        const tagsService = createTagsService(repo);

        await tagsService.load();

        Logger.info('Initialization', 'UNB tags service initialized.');

        return tagsService;
    } catch (error) {
        Logger.error('Bootstrap.initTags', `Failed to initialize UNB tags service: ${error}.`, { error });
        throw error;
    }
};

module.exports = initTags;