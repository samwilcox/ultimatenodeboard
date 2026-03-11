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

const setupRoutes = require('../routes');
const Logger = require('../log/logger');

/**
 * Initialize the UNB routes.
 * 
 * @param {object} app - The `Express` application instance.
 */
const initRoutes = async (app) => {
    try {
        Logger.info('Initialization', 'Initializing UNB routing...');
        setupRoutes(app);
        Logger.info('Initialization', 'UNB routing initialized.');
    } catch (error) {
        Logger.error('InitRoutes', `Init routes failed: ${error}.`, { error });
        throw error;
    }
};

module.exports = initRoutes;