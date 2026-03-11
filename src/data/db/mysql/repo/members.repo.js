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

const Logger = require('../../../../log/logger');
const KeyGeneratorService = require('../../key-generator.service');
const MEMBERS_SCHEMA = require('../schema/members.schema');
const { buildCreateQuery, buildUpdateQuery, buildDeleteQuery, rowHydrator } = require('./repo.helpers');

/**
 * Create the members repo for MySQL databases.
 * 
 * @param {object} pool - The MySQL database pool instance.
 */
const createMembersRepo = (pool) => {
    const table = `${process.env.UNB_MYSQL_PREFIX ?? ''}members`;

    return {
        /**
         * Get the entire collection of records from the members table.
         * 
         * @returns {Promise<Array>} A promise that resolves to the collection of records.
         */
        async getAll() {
            try {
                const [rows] = await pool.execute(
                    `SELECT * FROM \`${table}\``,
                    []
                );

                return rows ? rows.map(row => rowHydrator(row, MEMBERS_SCHEMA)) : null;
            } catch (error) {
                Logger.error('MySQL.Repo.Members', `Failed to get all records from the members table: ${error}.`, { error, repo: table });
                throw error;
            }
        },

        /**
         * Get a single record by key name from the members table.
         * 
         * @param {string} key - The key name.
         * @returns {Promise<object|null>} A promise that resolves to the data for the key or `null` if not found.
         */
        async getByKey(key) {
            try {
                const [rows] = await pool.execute(
                    `SELECT * FROM \`${table}\` WHERE key = ?`,
                    [key]
                );

                return rows[0] ? rowHydrator(rows[0], MEMBERS_SCHEMA) : null;
            } catch (error) {
                Logger.error('MySQL.Repo.Members', `Failed to get any records for the key '${key}' in the members table: ${error}.`, { error, repo: table });
                throw error;
            }
        },

        /**
         * Get records by a given query from the members table.
         * 
         * @param {object} query - The query data.
         * @returns {Promise<object[]|null} A promise that resolves to the data for the query or `null` if not found. 
         */
        async getByQuery(query) {
            try {
                const data = [];
                let str = '';

                for (const [key, value] of Object.entries(query)) {
                    data.push(value);

                    if (str.trim().length !== 0) {
                        str += ',';
                    }

                    str += `${key} = ?`;
                }

                const [rows] = await pool.execute(
                    `SELECT * FROM \`${table}\` WHERE ${str}`,
                    data
                );
                
                return rows.map(row => rowHydrator(row, MEMBERS_SCHEMA));
            } catch (error) {
                Logger.error('MySQL.Repo.Members', `Failed to get any records for the query in the members table: ${error}.`, { error, repo: table });
                throw error;
            }
        },

        /**
         * Get a single record for a given query from the members table.
         * 
         * @param {object} query - The query data.
         * @returns {Promise<object[]|null} A promise that resolves to the data for the query or `null` if not found. 
         */
        async getOneByQuery(query) {
            try {
                const data = [];
                let str = '';

                for (const [key, value] of Object.entries(query)) {
                    data.push(value);

                    if (str.trim().length !== 0) {
                        str += ',';
                    }

                    str += `${key} = ?`;
                }

                const [rows] = await pool.execute(
                    `SELECT * FROM \`${table}\` WHERE ${str}`,
                    data
                );

                return rows[0] ? rowHydrator(rows[0], MEMBERS_SCHEMA) : null;
            } catch (error) {
                Logger.error('MySQL.Repo.Members', `Failed to get any records for the query in the members table: ${error}.`, { error , repo: table });
                throw error;
            }
        },

        /**
         * Create a new record in the members table.
         * 
         * @param {object} data - The data to create the new record.
         */
        async create(data) {
            try {
                let key;

                if (data.key) {
                    key = data.key;
                    delete data.key;
                } else {
                    KeyGeneratorService.generate('member');
                }

                const query = buildCreateQuery(key, data);

                return await pool.execute(
                    `INSERT INTO \`${table}\` ${query}`,
                    values
                );
            } catch (error) {
                Logger.error('MySQL.Repo.Members', `Failed to create a new record in the members table: ${error}.`, { error, repo: table });
                throw error;
            }
        },

        /**
         * Update data in the members table.
         * 
         * @param {object} filter - The filter data to target the data to update. 
         * @param {object} data - The data to update in the members table. 
         */
        async update(filter, data) {
            try {
                const query = buildUpdateQuery(filter, data);

                return await pool.execute(
                    `UPDATE \`${table}\` ${query.sql}`,
                    query.values
                );
            } catch (error) {
                Logger.error('MySQL.Repo.Members', `Failed to update a record in the members table: ${error}.`, { error, repo: table });
                throw error;
            }
        },

        /**
         * Delete record or records from the members table.
         * 
         * @param {object} filter - The filter data to target what to delete from members table.
         */
        async delete(filter) {
            try {
                const query = buildDeleteQuery(filter);

                return await pool.execute(
                    `DELETE FROM \`${table}\` ${query.sql}`,
                    query.values
                );
            } catch (error) {
                Logger.error('MySQL.Repo.Members', `Failed to delete from the members table: ${error}.`, { error, repo: table });
                throw error;
            }
        }
    };
};

module.exports = createMembersRepo;