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
 * Create the permission definitions repo for MongoDB databases.
 * 
 * @param {Mongodb} mongoDb - The MongoDB instance. 
 */
const createPermissionDefinitionsRepo = (mongoDb) => {
    const repo = `${process.env.UNB_MONGODB_PREFIX ?? ''}permission_definitions`;
    const collection = mongoDb.collection(repo);

    return {
        /**
         * Get all entries from the permission definitions database repo.
         * 
         * @returns {Promise<Array>} A promise that resolves to an array of all the permission definitions records.
         */
        async getAll() {
            try {
                return await collection.find({}).toArray();
            } catch (error) {
                Logger.error('MongoDB.Repo.PermissionDefinitions.GetAll', `Failed to get all entries from the permission definitions collection: ${error}.`, { error, repo });
                throw error;
            }
        },

        /**
         * Get an entry from the permission definitions collection by key name.
         * 
         * @param {string} key - The name of the key for the record to get.
         * @returns {Promise<object|null>} A promise that resolves to either the data for the key or `null` if not found.
         */
        async getByKey(key) {
            try {
                return await collection.findOne({ key });
            } catch (error) {
                Logger.error('MongoDB.Repo.PermissionDefinitions.GetByKey', `Failed to get an entry by key from the permission definitions collection: ${error}.`, { error, repo });
                throw error;
            }
        },

        /**
         * Get all entries from the permissions collection by a given query.
         * 
         * @param {object} query - An object with key-value parameters to query data from the permission definitions collection.
         * @returns {Promise<object|null>} A promise that resolves to either the data for the query or `null` if not found. 
         */
        async getByQuery(query) {
            try {
                return await collection.find(query).toArray();
            } catch (error) {
                Logger.error('MongoDB.Repo.PermissionDefinitions.getByQuery', `Failed to get any entries for the query from the permission definitions collection: ${error}.`, { error, repo });
                throw error;
            }
        },

        /**
         * Get a single entry from the permission definitions collection by a given query.
         * 
         * @param {object} query - An object with key-value parameters to query data from the permission definitions collection.
         * @returns {Promise<object|null>} A promise that resolves to either the data for the query or `null` if not found. 
         */
        async getOneByQuery(query) {
            try {
                return await collection.findOne(query);
            } catch (error) {
                Logger.error('MongoDB.Repo.PermissionDefinitions.getOneByQuery', `Failed to get a single entry for the query from the permission definitions collection: ${error}.`, { error, repo });
                throw error;
            }
        },

        /**
         * Create a new record in the permission definitions collection.
         * 
         * @param {object} data - The data to insert into the permission definitions collection. 
         */
        async create(data) {
            try {
                const key = KeyGeneratorService.generate('permission_definition');
                data = { key, ...data };

                await collection.insertOne(data);

                return key;
            } catch (error) {
                Logger.error('MongoDB.Repo.PermissionDefinitions.Create', `Failed to create a new record in the permission definitions collection: ${error}.`, { error, repo });
                throw error;
            }
        },

        /**
         * Update a record in the permission definitions collection.
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
                Logger.error('MongoDB.Repo.PermissionDefinitions.Update', `Failed to update data in the permission definitons collection: ${error}.`, { error, repo });
                throw error;
            }
        },

        /**
         * Delete a record from the permision definitions collection.
         * 
         * @param {object} filter - The data filter. 
         */
        async delete(filter) {
            try {
                return await collection.deleteOne(filter);
            } catch (error) {
                Logger.error('MongoDB.Repo.SessionDefintions.Update', `Failed to delete from the session defintions collection: ${error}.`, { error, repo });
                throw error;
            }
        }
    };
};

module.exports = createPermissionDefinitionsRepo;