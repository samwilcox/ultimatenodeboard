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
const SortService = require('../../../../services/sort.service');

/**
 * Create the topics repo for MongoDB databases.
 * 
 * @param {Mongodb} mongoDb - The MongoDB instance. 
 */
const createTopicsRepo = (mongoDb) => {
    const repo = `${process.env.UNB_MONGODB_PREFIX ?? ''}topics`;
    const collection = mongoDb.collection(repo);

    return {
        /**
         * Get all entries from the topics database repo.
         * 
         * @returns {Promise<Array>} A promise that resolves to an array of all the topics records.
         */
        async getAll() {
            try {
                return await collection.find({}).toArray();
            } catch (error) {
                Logger.error('MongoDB.Repo.Topics.GetAll', `Failed to get all entries from the topics collection: ${error}.`, { error, repo });
                throw error;
            }
        },

        /**
         * Get an entry from the topics collection by key name.
         * 
         * @param {string} key - The name of the key for the record to get.
         * @returns {Promise<object|null>} A promise that resolves to either the data for the key or `null` if not found.
         */
        async getByKey(key) {
            try {
                return await collection.findOne({ key });
            } catch (error) {
                Logger.error('MongoDB.Repo.Topics.GetByKey', `Failed to get an entry by key from the topics collection: ${error}.`, { error, repo });
                throw error;
            }
        },

        /**
         * Get all entries from the topics collection by a given query.
         * 
         * @param {object} query - An object with key-value parameters to query data from the topics collection.
         * @returns {Promise<object|null>} A promise that resolves to either the data for the query or `null` if not found. 
         */
        async getByQuery(query) {
            try {
                return await collection.find(query).toArray();
            } catch (error) {
                Logger.error('MongoDB.Repo.Topics.getByQuery', `Failed to get any entries for the query from the topics collection: ${error}.`, { error, repo });
                throw error;
            }
        },

        /**
         * Get a single entry from the topics collection by a given query.
         * 
         * @param {object} query - An object with key-value parameters to query data from the topics collection.
         * @returns {Promise<object|null>} A promise that resolves to either the data for the query or `null` if not found. 
         */
        async getOneByQuery(query) {
            try {
                return await collection.findOne(query);
            } catch (error) {
                Logger.error('MongoDB.Repo.Topics.getOneByQuery', `Failed to get a single entry for the query from the topics collection: ${error}.`, { error, repo });
                throw error;
            }
        },

        /**
         * Create a new record in the topics collection.
         * 
         * @param {object} data - The data to insert into the topics collection. 
         */
        async create(data) {
            try {
                const key = KeyGeneratorService.generate('topic');
                data = { key, ...data };

                await collection.insertOne(data);

                return key;
            } catch (error) {
                Logger.error('MongoDB.Repo.Topic.Create', `Failed to create a new record in the topic collection: ${error}.`, { error, repo });
                throw error;
            }
        },

        /**
         * Update a record in the topic collection.
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
                Logger.error('MongoDB.Repo.Topics.Update', `Failed to update data in the topics collection: ${error}.`, { error, repo });
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
                const skip = page * limit;

                let topics = await collection
                                .find(filter)
                                .skip(skip)
                                .sort({ createdAt: -1 })
                                .limit(limit)
                                .toArray();

                return topics;
            } catch (error) {
                Logger.error('MongoDB.Repo.Topics.getForListing', `Failed to get topics for listing: ${error}.`, { error, repo });
                throw error;
            }
        },

        /**
         * Get the total documents in this repo.
         * 
         * @returns {number} The total documents in this collection.
         */
        async total() {
            try {
                return await collection.estimatedDocumentCount();
            } catch (error) {
                Logger.error('MongoDB.Repo.Topics.total', `Failed to get total topics: ${error}.`, { error, repo });
                throw error;
            }
        }
    };
};

module.exports = createTopicsRepo;