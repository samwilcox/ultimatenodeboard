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

const UnsupportedError = require('../../errors/unsupported.error');

/**
 * UNB database factory.
 * 
 * Builds and returns the configured database provider repository and tools.
 */
class DatabaseFactory {
    static _instance = { toolbox: null, repo: null };

    /**
     * Create a new instance of the configured database provider data. 
     * 
     * @returns {Promise<{
     *      toolbox: object,
     *      repo: object[]
     * }>} A promise that resolves to an object containing the toolbox and repo.
     * @throws {UnsupportedError} If the database provider set is not supported.
     */
    static async create() {
        if (DatabaseFactory._instance.toolbox === null && DatabaseFactory._instance.repo === null) {
            const provider = process.env.UNB_DATABASE_PROVIDER || 'mongodb';
            let path;

            if (provider === 'mongodb') {
                path = './mongodb';
            } else if (provider === 'mysql') {
                path = './mysql';
            }

            const { toolbox, repo } = require(path);

            switch (provider) {
                case 'mongodb':
                    DatabaseFactory._instance.toolbox = toolbox;
                    DatabaseFactory._instance.repo = await repo();
                    break;

                case 'mysql':
                    DatabaseFactory._instance.toolbox = toolbox;
                    DatabaseFactory._instance.repo = await repo();
                    break;
            
                default:
                    throw new UnsupportedError(`Unsupported database provider: '${provider}'.`, { provider });
            }
        }

        return DatabaseFactory._instance;
    }
};

module.exports = DatabaseFactory;