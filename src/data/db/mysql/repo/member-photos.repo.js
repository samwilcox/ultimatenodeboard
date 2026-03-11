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
const MEMBER_PHOTOS_SCHEMA = require('../schema/member-photos.schema');
const { buildCreateQuery, buildUpdateQuery, buildDeleteQuery, rowHydrator } = require('./repo.helpers');

/**
 * Create the member photos repo for MySQL databases.
 * 
 * @param {object} pool - The MySQL database pool instance.
 */
const createMemberPhotosRepo = (pool) => {
    const table = `${process.env.UNB_MYSQL_PREFIX ?? ''}member_photos`;

    return {
        /**
         * Get the entire collection of records from the member photos table.
         * 
         * @returns {Promise<Array>} A promise that resolves to the collection of records.
         */
        async getAll() {
            try {
                const [rows] = await pool.execute(
                    `SELECT * FROM \`${table}\``,
                    []
                );

                return rows ? rows.map(row => rowHydrator(row, MEMBER_PHOTOS_SCHEMA)) : null;
            } catch (error) {
                Logger.error('MySQL.Repo.MemberPhotos', `Failed to get all records from the member photos table: ${error}.`, { error, repo: table });
                throw error;
            }
        },

        /**
         * Get a single record by key name from the member photos table.
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

                return rows[0] ? rowHydrator(rows[0], MEMBER_PHOTOS_SCHEMA) : null;
            } catch (error) {
                Logger.error('MySQL.Repo.MemberPhotos', `Failed to get any records for the key '${key}' in the member photos table: ${error}.`, { error, repo: table });
                throw error;
            }
        },

        /**
         * Get records by a given query from the member photos table.
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
                
                return rows.map(row => rowHydrator(row, MEMBER_PHOTOS_SCHEMA));
            } catch (error) {
                Logger.error('MySQL.Repo.MemberPhotos', `Failed to get any records for the query in the member photos table: ${error}.`, { error, repo: table });
                throw error;
            }
        },

        /**
         * Get a single record for a given query from the member photos table.
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

                return rows[0] ? rowHydrator(rows[0], MEMBER_PHOTOS_SCHEMA) : null;
            } catch (error) {
                Logger.error('MySQL.Repo.MemberPhotos', `Failed to get any records for the query in the member photos table: ${error}.`, { error , repo: table });
                throw error;
            }
        },

        /**
         * Create a new record in the member photos table.
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
                    KeyGeneratorService.generate('member_photo');
                }

                const query = buildCreateQuery(key, data);

                return await pool.execute(
                    `INSERT INTO \`${table}\` ${query}`,
                    values
                );
            } catch (error) {
                Logger.error('MySQL.Repo.MemberPhotos', `Failed to create a new record in the member photos table: ${error}.`, { error, repo: table });
                throw error;
            }
        },

        /**
         * Update data in the member photos table.
         * 
         * @param {object} filter - The filter data to target the data to update. 
         * @param {object} data - The data to update in the member photos table. 
         */
        async update(filter, data) {
            try {
                const query = buildUpdateQuery(filter, data);

                return await pool.execute(
                    `UPDATE \`${table}\` ${query.sql}`,
                    query.values
                );
            } catch (error) {
                Logger.error('MySQL.Repo.MemberPhotos', `Failed to update a record in the member photos table: ${error}.`, { error, repo: table });
                throw error;
            }
        },

        /**
         * Delete record or records from the member photos table.
         * 
         * @param {object} filter - The filter data to target what to delete from member photos table.
         */
        async delete(filter) {
            try {
                const query = buildDeleteQuery(filter);

                return await pool.execute(
                    `DELETE FROM \`${table}\` ${query.sql}`,
                    query.values
                );
            } catch (error) {
                Logger.error('MySQL.Repo.MemberPhotos', `Failed to delete from the member photos table: ${error}.`, { error, repo: table });
                throw error;
            }
        }
    };
};

module.exports = createMemberPhotosRepo;