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

const MembersService = require('./members.service');

let _instance = null;

/**
 * Create/get instance of the `MembersService`.
 * 
 * @param {LocaleService} localeService - The UNB locale service instance.
 * @param {SettingsService} settingsService - The UNB settings service instance.
 * @param {CacheProviderService} cacheProviderService - The UNB cache provider service instance.
 * @param {object[]} repo - The UNB database repositories.
 * @returns {MemberService} The instance of `MemberService`.
 */
const createMembersService = (localeService, settingsService, repo, cacheProviderService) => {
    if (!_instance) _instance = new MembersService(localeService, settingsService, repo, cacheProviderService);
    return _instance;
};

module.exports = createMembersService;