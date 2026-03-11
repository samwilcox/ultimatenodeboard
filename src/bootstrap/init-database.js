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
const DatabaseFactory = require('../data/db/database.factory');

/**
 * Initializes the database for UNB.
 * 
 * @returns {Promise<{
 *      db: object,
 *      toolset: object,
 *      repo: object[]
 * }>} A promise that resolves to database toolset and repo.
 */
const initDatabase = async () => {
    try {
        Logger.info('Initialization', 'Initializing the UNB database system...');

        const { toolbox, repo } = await DatabaseFactory.create();

        Logger.info('Initialization', 'UNB database system initialized.');

        return {
            db,
            toolbox,
            repo
        };
    } catch (error) {
        Logger.error('Bootstrap.InitDatabase', `Failed to initialize the database: ${error}.`, { error });
        throw error;
    }
};

module.exports = initDatabase;