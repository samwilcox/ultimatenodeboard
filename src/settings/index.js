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

const SettingsService = require('./settings.service');

let _instance = null;

/**
 * Create/get an instance of the `SettingsService`.
 * 
 * @returns {SettingsService} The UNB settings service instance.
 */
const createSettingsService = () => {
    if (!_instance) _instance = new SettingsService();
    return _instance;
};

module.exports = createSettingsService;