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
const TOPICS_SCHEMA = require('../schema/topics.schema');
const { buildCreateQuery, buildUpdateQuery, buildDeleteQuery, rowHydrator } = require('./repo.helpers');

/**
 * Create the topics repo for MySQL databases.
 * 
 * @param {object} pool - The MySQL database pool instance.
 */
const createTopicsRepo = (pool) => {
    const table = `${process.env.UNB_MYSQL_PREFIX ?? ''}topics`;

    return {
        /**
         * Get the entire collection of records from the topics table.
         * 
         * @returns {Promise<Array>} A promise that resolves to the collection of records.
         */
        async getAll() {
            try {
                const [rows] = await pool.execute(
                    `SELECT * FROM \`${table}\``,
                    []
                );

                return rows ? rows.map(row => rowHydrator(row, TOPICS_SCHEMA)) : null;
            } catch (error) {
                Logger.error('MySQL.Repo.Topics', `Failed to get all records from the topics table: ${error}.`, { error, repo: table });
                throw error;
            }
        },

        /**
         * Get a single record by key name from the topics table.
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

                return rows[0] ? rowHydrator(rows[0], TOPICS_SCHEMA) : null;
            } catch (error) {
                Logger.error('MySQL.Repo.Topics', `Failed to get any records for the key '${key}' in the topics table: ${error}.`, { error, repo: table });
                throw error;
            }
        },

        /**
         * Get records by a given query from the topics table.
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
                
                return rows.map(row => rowHydrator(row, TOPICS_SCHEMA));
            } catch (error) {
                Logger.error('MySQL.Repo.Topics', `Failed to get any records for the query in the topics table: ${error}.`, { error, repo: table });
                throw error;
            }
        },

        /**
         * Get a single record for a given query from the topics table.
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

                return rows[0] ? rowHydrator(rows[0], TOPICS_SCHEMA) : null;
            } catch (error) {
                Logger.error('MySQL.Repo.Topics', `Failed to get any records for the query in the topics table: ${error}.`, { error , repo: table });
                throw error;
            }
        },

        /**
         * Create a new record in the topics table.
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
                    KeyGeneratorService.generate('topic');
                }

                const query = buildCreateQuery(key, data);

                return await pool.execute(
                    `INSERT INTO \`${table}\` ${query}`,
                    values
                );
            } catch (error) {
                Logger.error('MySQL.Repo.Topics', `Failed to create a new record in the topics table: ${error}.`, { error, repo: table });
                throw error;
            }
        },

        /**
         * Update data in the topics table.
         * 
         * @param {object} filter - The filter data to target the data to update. 
         * @param {object} data - The data to update in the topics table. 
         */
        async update(filter, data) {
            try {
                const query = buildUpdateQuery(filter, data);

                return await pool.execute(
                    `UPDATE \`${table}\` ${query.sql}`,
                    query.values
                );
            } catch (error) {
                Logger.error('MySQL.Repo.Topics', `Failed to update a record in the topics table: ${error}.`, { error, repo: table });
                throw error;
            }
        },

        /**
         * Delete record or records from the topics table.
         * 
         * @param {object} filter - The filter data to target what to delete from topics table.
         */
        async delete(filter) {
            try {
                const query = buildDeleteQuery(filter);

                return await pool.execute(
                    `DELETE FROM \`${table}\` ${query.sql}`,
                    query.values
                );
            } catch (error) {
                Logger.error('MySQL.Repo.Topics', `Failed to delete from the topics table: ${error}.`, { error, repo: table });
                throw error;
            }
        },

        /**
         * Get the topics listing for all forums or a single forum.
         * 
         * @param {Member} member - The member entity instance. 
         * @param {object} [filter={}] - Optional filters. 
         * @param {number} [page=0] - The page number.
         * @returns {Promise<array>} A promise that resolves to the topics listing array. 
         */
        async getForListing(member, filter = {}, page = 0) {
            try {
                const limit = member.settings?.pagination?.limit?.topics;
                const offset = page * limit;

                const values = [];
                let where = '';

                for (const [key, value] of Object.entries(filter)) {
                    values.push(value);

                    if (where.length > 0) {
                        where += ' AND ';
                    }

                    where += `\`${key}\` = ?`;
                }

                const sql = `
                    SELECT *
                    FROM \`${table}\`
                    ${where ? `WHERE ${where}` : ''}
                    ORDER BY createdAt DESC
                    LIMIT ?
                    OFFSET ?
                `;

                values.push(limit, offset);

                const [rows] = await pool.execute(sql, values);

                return rows.map(row => rowHydrator(row, TOPICS_SCHEMA));
            } catch (error) {
                Logger.error('MySQL.Repo.Topics', `Failed to get topics for listing: ${error}.`, { error });
                throw error;
            }
        },

        /**
         * Get the total rows in this table.
         * 
         * @returns {Promise<number>} A promise that resolves to the total number of rows in the table.
         */
        async total() {
            try {
                const sql = `
                    SELECT COUNT(*) AS total FROM \`${table}\`
                `;

                const row = await pool.execute(sql);
                return parseInt(row.total, 10);
            } catch (error) {
                Logger.error('MySQL.Repo.Topics', `Failed to get total rows from topics: ${error}.`, { error });
                throw error;
            }
        }
    };
};

module.exports = createTopicsRepo;