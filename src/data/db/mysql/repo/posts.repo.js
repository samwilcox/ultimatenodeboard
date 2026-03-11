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
const POSTS_SCHEMA = require('../schema/posts.schema');
const { buildCreateQuery, buildUpdateQuery, buildDeleteQuery, rowHydrator } = require('./repo.helpers');

/**
 * Create the posts repo for MySQL databases.
 * 
 * @param {object} pool - The MySQL database pool instance.
 */
const createPostsRepo = (pool) => {
    const table = `${process.env.UNB_MYSQL_PREFIX ?? ''}posts`;

    return {
        /**
         * Get the entire collection of records from the posts table.
         * 
         * @returns {Promise<Array>} A promise that resolves to the collection of records.
         */
        async getAll() {
            try {
                const [rows] = await pool.execute(
                    `SELECT * FROM \`${table}\``,
                    []
                );

                return rows ? rows.map(row => rowHydrator(row, POSTS_SCHEMA)) : null;
            } catch (error) {
                Logger.error('MySQL.Repo.Posts', `Failed to get all records from the posts table: ${error}.`, { error, repo: table });
                throw error;
            }
        },

        /**
         * Get a single record by key name from the posts table.
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

                return rows[0] ? rowHydrator(rows[0], POSTS_SCHEMA) : null;
            } catch (error) {
                Logger.error('MySQL.Repo.Posts', `Failed to get any records for the key '${key}' in the posts table: ${error}.`, { error, repo: table });
                throw error;
            }
        },

        /**
         * Get records by a given query from the posts table.
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
                        if (str.length) str += ' AND';
                    }

                    str += `${key} = ?`;
                }

                const [rows] = await pool.execute(
                    `SELECT * FROM \`${table}\` WHERE ${str}`,
                    data
                );
                
                return rows.map(row => rowHydrator(row, POSTS_SCHEMA));
            } catch (error) {
                Logger.error('MySQL.Repo.Posts', `Failed to get any records for the query in the posts table: ${error}.`, { error, repo: table });
                throw error;
            }
        },

        /**
         * Get a single record for a given query from the posts table.
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

                return rows[0] ? rowHydrator(rows[0], POSTS_SCHEMA) : null;
            } catch (error) {
                Logger.error('MySQL.Repo.Posts', `Failed to get any records for the query in the posts table: ${error}.`, { error , repo: table });
                throw error;
            }
        },

        /**
         * Create a new record in the posts table.
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
                    KeyGeneratorService.generate('post');
                }

                const query = buildCreateQuery(key, data);

                return await pool.execute(
                    `INSERT INTO \`${table}\` ${query}`,
                    values
                );
            } catch (error) {
                Logger.error('MySQL.Repo.Posts', `Failed to create a new record in the posts table: ${error}.`, { error, repo: table });
                throw error;
            }
        },

        /**
         * Update data in the posts table.
         * 
         * @param {object} filter - The filter data to target the data to update. 
         * @param {object} data - The data to update in the posts table. 
         */
        async update(filter, data) {
            try {
                const query = buildUpdateQuery(filter, data);

                return await pool.execute(
                    `UPDATE \`${table}\` ${query.sql}`,
                    query.values
                );
            } catch (error) {
                Logger.error('MySQL.Repo.Posts', `Failed to update a record in the posts table: ${error}.`, { error, repo: table });
                throw error;
            }
        },

        /**
         * Delete record or records from the posts table.
         * 
         * @param {object} filter - The filter data to target what to delete from posts table.
         */
        async delete(filter) {
            try {
                const query = buildDeleteQuery(filter);

                return await pool.execute(
                    `DELETE FROM \`${table}\` ${query.sql}`,
                    query.values
                );
            } catch (error) {
                Logger.error('MySQL.Repo.Posts', `Failed to delete from the posts table: ${error}.`, { error, repo: table });
                throw error;
            }
        },

        /**
         * Get the meta for posts for infinite scrolling.
         * 
         * @param {string} topicKey - The topic key.
         */
        async getMeta(topicKey) {
            try {
                const [rows] = await pool.execute(
                    `
                    SELECT MAX(postNumber) as maxPostNumber
                    FROM \`${table}\`
                    WHERE topicKey = ?
                    `,
                    [topicKey]
                );

                return {
                    maxPostNumber: rows[0]?.maxPostNumber ?? 0
                };
            } catch (error) {
                Logger.error('MySQL.Repo.Posts.getMeta',
                    `Failed to get meta for topic '${topicKey}': ${error}.`,
                    { error, repo: table }
                );
                throw error;
            }
        },

        /**
         * Get the posts after the post number for infinite scrolling.
         * 
         * @param {string} topicKey - The topic key.
         * @param {number} postNumber - The post number.
         * @param {number} limit - The total posts.
         */
        async getAfter(topicKey, postNumber, limit) {
            try {
                const [rows] = await pool.execute(
                    `
                    SELECT *
                    FROM \`${table}\`
                    WHERE topicKey = ?
                    AND postNumber > ?
                    ORDER BY postNumber ASC
                    LIMIT ?
                    `,
                    [topicKey, postNumber, limit]
                );

                return rows.map(row => rowHydrator(row, POSTS_SCHEMA));
            } catch (error) {
                Logger.error('MySQL.Repo.Posts.getAfter',
                    `Failed to get posts after ${postNumber} for topic '${topicKey}': ${error}.`,
                    { error, repo: table }
                );
                throw error;
            }
        },

        /**
         * Get the posts before the post number for infinite scrolling.
         * 
         * @param {string} topicKey - The topic key.
         * @param {number} postNumber - The post number.
         * @param {number} limit - The total posts.
         */
        async getBefore(topicKey, postNumber, limit) {
            try {
                const [rows] = await pool.execute(
                    `
                    SELECT *
                    FROM \`${table}\`
                    WHERE topicKey = ?
                    AND postNumber < ?
                    ORDER BY postNumber DESC
                    LIMIT ?
                    `,
                    [topicKey, postNumber, limit]
                );

                return rows
                    .reverse()
                    .map(row => rowHydrator(row, POSTS_SCHEMA));
            } catch (error) {
                Logger.error('MySQL.Repo.Posts.getBefore',
                    `Failed to get posts before ${postNumber} for topic '${topicKey}': ${error}.`,
                    { error, repo: table }
                );
                throw error;
            }
        },

        /**
         * Get the posts around the post number for infinite scrolling.
         * 
         * @param {string} topicKey - The topic key.
         * @param {number} center - The centered number.
         * @param {number} limit - The total posts.
         */
        async getAround(topicKey, center, limit) {
            try {
                const half = Math.floor(limit / 2);
                const start = Math.max(1, center - half);
                const end = center + half;

                const [rows] = await pool.execute(
                    `
                    SELECT *
                    FROM \`${table}\`
                    WHERE topicKey = ?
                    AND postNumber BETWEEN ? AND ?
                    ORDER BY postNumber ASC
                    LIMIT ?
                    `,
                    [topicKey, start, end, limit]
                );

                return rows.map(row => rowHydrator(row, POSTS_SCHEMA));
            } catch (error) {
                Logger.error('MySQL.Repo.Posts.getAround',
                    `Failed to get posts around ${center} for topic '${topicKey}': ${error}.`,
                    { error, repo: table }
                );
                throw error;
            }
        }
    };
};

module.exports = createPostsRepo;