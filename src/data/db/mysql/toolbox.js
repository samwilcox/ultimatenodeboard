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
const mysql = require('mysql2/promise');

/**
 * UNB toolbox for MMySQL databases.
 */
const toolbox = {
    pool: null,

    /**
     * Establish connection to the MySQL database server.
     */
    async connect() {
        if (this.pool) return this.pool;

        try {
            this.pool = await mysql.createPool({
                host: process.env.UNB_MYSQL_HOST ?? 'localhost',
                port: Number(process.env.UNB_MYSQL_PORT) ?? 3306,
                user: process.env.UNB_MYSQL_USER ?? 'root',
                password: process.env.UNB_MYSQL_PASSWORD,
                database: process.env.UNB_MYSQL_DB,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0               
            });

            Logger.info('Initialization', 'Connected to MySQL database.', { pool: this.pool });

            return this.pool;
        } catch (error) {
            Logger.error('MySQL.Driver.Connect', `Failed to establish a connection to the MySQL database server: ${error}.`, { error });
            throw error;
        }
    },

    /**
     * Disconnect from the MySQL database server.
     */
    async disconnect() {
        if (!this.pool) return;

        try {
            Logger.info('Shutdown', 'Disconnecting from the MySQL database server...');

            await this.pool.end();

            Logger.info('Shutdown', 'Disconnected from the MySQL database server.');
        } catch (error) {   
            Logger.error('MySQL.Driver.Connect', `Failed to establish a connection to the MySQL database server: ${error}.`, { error });
            throw error;
        }
    }
};

module.exports = toolbox;