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

const LocaleService = require('./locale.service');

let _instance = null;

/**
 * Create/get the UNB locale service.
 * 
 * @param {SettingsService} settingsService - The UNB settings service.
 */
const createLocaleService = (settingsService) => {
    if (!_instance) _instance = new LocaleService(settingsService);
    return _instance;
};

module.exports = createLocaleService;