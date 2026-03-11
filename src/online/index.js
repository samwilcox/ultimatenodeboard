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

const OnlineTrackerService = require("./online-tracker.service");

let _instance = null;

/**
 * 
 * @param {SettingsService} settingsService - The UNB settings service instance.
 * @returns {OnlineTrackerService} The UNB online tracker service instance. 
 */
const createOnlineTrackerService = (settingsService) => {
    if (!_instance) _instance = new OnlineTrackerService(settingsService);
    return _instance;
};

module.exports = createOnlineTrackerService;