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

const ForumsService = require('./forums.service');

let _instance = null;

/**
 * Create/get instance of `ForumsService`.
 * 
 * @param {CacheProviderService} cacheProviderService - The UNB cache provider service instance.
 * @param {object[]} repo - The UNB database repositories.
 * @returns {ForumsService} The UNB forum service instance.
 */
const createForumsService = (cacheProviderService, repo) => {
    if (!_instance) _instance = new ForumsService(cacheProviderService, repo);
    return _instance;
};

module.exports = createForumsService;