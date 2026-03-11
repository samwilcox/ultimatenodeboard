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

/**
 * Create the posts repo for MongoDB databases.
 * 
 * @param {Mongodb} mongoDb - The MongoDB instance. 
 */
const createPostsRepo = (mongoDb) => {
    const repo = `${process.env.UNB_MONGODB_PREFIX ?? ''}posts`;
    const collection = mongoDb.collection(repo);

    return {
        /**
         * Get all entries from the posts database repo.
         * 
         * @returns {Promise<Array>} A promise that resolves to an array of all the post records.
         */
        async getAll() {
            try {
                return await collection.find({}).toArray();
            } catch (error) {
                Logger.error('MongoDB.Repo.Posts.GetAll', `Failed to get all entries from the posts collection: ${error}.`, { error, repo });
                throw error;
            }
        },

        /**
         * Get an entry from the posts collection by key name.
         * 
         * @param {string} key - The name of the key for the record to get.
         * @returns {Promise<object|null>} A promise that resolves to either the data for the key or `null` if not found.
         */
        async getByKey(key) {
            try {
                return await collection.findOne({ key });
            } catch (error) {
                Logger.error('MongoDB.Repo.Posts.GetByKey', `Failed to get an entry by key from the posts collection: ${error}.`, { error, repo });
                throw error;
            }
        },

        /**
         * Get all entries from the posts collection by a given query.
         * 
         * @param {object} query - An object with key-value parameters to query data from the posts collection.
         * @returns {Promise<object|null>} A promise that resolves to either the data for the query or `null` if not found. 
         */
        async getByQuery(query) {
            try {
                return await collection.find(query).toArray();
            } catch (error) {
                Logger.error('MongoDB.Repo.Posts.getByQuery', `Failed to get any entries for the query from the posts collection: ${error}.`, { error, repo });
                throw error;
            }
        },

        /**
         * Get a single entry from the posts collection by a given query.
         * 
         * @param {object} query - An object with key-value parameters to query data from the posts collection.
         * @returns {Promise<object|null>} A promise that resolves to either the data for the query or `null` if not found. 
         */
        async getOneByQuery(query) {
            try {
                return await collection.findOne(query);
            } catch (error) {
                Logger.error('MongoDB.Repo.Posts.getOneByQuery', `Failed to get a single entry for the query from the posts collection: ${error}.`, { error, repo });
                throw error;
            }
        },

        /**
         * Create a new record in the posts collection.
         * 
         * @param {object} data - The data to insert into the posts collection. 
         */
        async create(data) {
            try {
                const key = KeyGeneratorService.generate('post');
                data = { key, ...data };

                await collection.insertOne(data);

                return key;
            } catch (error) {
                Logger.error('MongoDB.Repo.Posts.Create', `Failed to create a new record in the posts collection: ${error}.`, { error, repo });
                throw error;
            }
        },

        /**
         * Update a record in the topics collection.
         * 
         * @param {object} filter - The data filter. 
         * @param {object} data - The data to update. 
         */
        async update(filter, data) {
            try {
                return await collection.updateOne(
                    { ...filter },
                    { $set: { ...data } }
                );
            } catch (error) {
                Logger.error('MongoDB.Repo.Posts.Update', `Failed to update data in the posts collection: ${error}.`, { error, repo });
                throw error;
            }
        },

        /**
         * Get the meta for the posts.
         * 
         * @param {string} topicKey - The topic key.
         * @returns {Promise<{
         *      maxPostNumber: number
         * }>} A promise that resolves to an object containing the maxPostNumber.
         */
        async getMeta(topicKey) {
            try {
                const doc = await collection
                    .find({ topicKey })
                    .sort({ postNumber: -1 })
                    .limit(1)
                    .project({ postNumber: 1 })
                    .next();

                return {
                    maxPostNumber: doc?.postNumber ?? 0
                };
            } catch (error) {
                Logger.error('MongoDB.Repo.Posts.getMeta', `Failed to get meta in the posts collection: ${error}`, { error, topicKey });
                throw error;
            }
        },

        /**
         * Get the posts after the post number for infinite scrolling.
         * 
         * @param {string} topicKey - The topic key.
         * @param {number} postNumber - The post number.
         * @param {number} limit - The limit of posts.
         * @returns {Promise<object[]>} A promise that resolves to an array of objects.
         */
        async getAfter(topicKey, postNumber, limit) {
            try {
                return await collection
                    .find({
                        topicKey,
                        postNumber: { $gt: postNumber }
                    })
                    .sort({ postNumber: 1 })
                    .limit(limit)
                    .toArray();
            } catch (error) {
                Logger.error('MongoDB.Repo.Posts.getAfter', `Failed to get posts after the post number from the posts collection: ${error}.`, { error, topicKey, postNumber, limit });
                throw error;
            }
        },

        /**
         * Get the posts before the post number for infinite scrolling.
         * 
         * @param {string} topicKey - The topic key.
         * @param {number} postNumber - The post number.
         * @param {number} limit - The limit of posts.
         * @returns {Promise<object[]>} A promise that resolves to an array of objects.
         */
        async getBefore(topicKey, postNumber, limit) {
            try {
                const rows = await collection
                    .find({
                        topicKey,
                        postNumber: { $lt: postNumber }
                    })
                    .sort({ postNumber: -1 })
                    .limit(limit)
                    .toArray();

                return rows.reverse();
            } catch (error) {
                Logger.error('MongoDB.Repo.Posts.getBefore', `Failed to get posts before the post number from the posts collection: ${error}.`, { error, topicKey, postNumber, limit });
                throw error;
            }
        },

        /**
         * Get the posts around the post number for infinite scrolling.
         * 
         * @param {string} topicKey - The topic key.
         * @param {number} center - The centered number.
         * @param {number} limit - The limit of posts.
         * @returns {Promise<object[]>} A promise that resolves to an array of objects.
         */
        async getAround(topicKey, center, limit) {
            try {
                const half = Math.floor(limit / 2);
                const start = Math.max(1, center - half);
                const end = center + half;

                return await collection
                    .find({
                        topicKey,
                        postNumber: { $gte: start, $lte: end }
                    })
                    .sort({ postNumber: 1 })
                    .limit(limit)
                    .toArray();
            } catch (error) {
                Logger.error('MongoDB.Repo.Posts.getAround', `Failed to get posts around the post number from the posts collection: ${error}.`, { error, topicKey, center, limit });
                throw error;
            }
        }
    };
};

module.exports = createPostsRepo;