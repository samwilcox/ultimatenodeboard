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

const Logger = require('../../../log/logger');
const { MongoClient } = require('mongodb');

/**
 * UNB toolbox for MongoDB databases.
 */
const toolbox = {
    db: null,
    client: null,

    /**
     * Establish connection to the MongoDB database server.
     */
    async connect() {
        if (this.db) return this.db;

        try {
            this.client = new MongoClient(process.env.UNB_MONGODB_URI);    
            await this.client.connect();
            
            this.db = this.client.db(process.env.UNB_MONGODB_DB_NAME);

            Logger.info('Initialization', `Connected to MongoDB database: ${process.env.UNB_MONGODB_DB_NAME}.`);

            return this.db;
        } catch (error) {
            Logger.error('MongoDB.Driver.Connect', `Failed to establish a connection to the MongoDB database server: ${error}.`, { error });
            throw error;
        }
    },

    /**
     * Disconnect from the MongoDB database server.
     */
    async disconnect() {
        if (!this.db) return;

        try {
            Logger.info('Shutdown', 'Disconnecting from MongoDB...');

            await this.client.close();
            this._client = null;
            this._db = null;

            Logger.info('Shutdown', 'MongoDB disconnected.');
        } catch (error) {   
            Logger.error('MongoDB.Driver.Connect', `Failed to establish a connection to the MongoDB database server: ${error}.`, { error });
            throw error;
        }
    }
};

module.exports = toolbox;