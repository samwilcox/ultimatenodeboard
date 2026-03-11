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

const DataStore = require('../datastore/datastore');
const { normalizeTimestamp } = require('../helpers/normalize.helper');

/**
 * UNB tag repository.
 * 
 * Responsible for creating the `Tag` entity.
 */
class TagRespository {
    /**
     * Get a tag by key name.
     * 
     * @param {string} key - The tag key name.
     * @param {object} [options=null] - Options for getting by key.
     * @param {object[]} [options.repo=null] - Optional UNB database repositories collection (default is `null`).
     * @returns {Promise<Topic>} A promise that resolves to the Tag entity instance.
     */
    static async getByKey(key, options = {}) {
        const data = await this.getDataByKey(key, options);
        return await this.build(key, data);
    }

    /**
     * Get data by key name.
     * 
     * @param {string} key - The tag key name.
     * @param {object} [options=null] - Options for getting by key.
     * @param {object[]} [options.repo=null] - Optional UNB database repositories collection (default is `null`).
     * @returns {Promise<object>|null} A promise that resolves to the data for this entity or `null` if not found.
     */
    static async getDataByKey(key, options = {}) {
        let { repo = null } = options;

        if (!repo) {
            const { db } = DataStore.get('unb');
            repo = db?.repo;
        }

        const data = await repo.tags.getByKey(key);

        return data || null;
    }

    /**
     * Build the entity.
     * 
     * @param {string} key - The tag key name.
     * @param {object|null} data - The data for the tag or `null` if not found. 
     * @returns {Promise<Topic>} A promise that resolves to the tag entity instance.
     */
    static async build(key, data) {
        const Tag = require('../tags/tag.entity');
        let tag = new Tag();

        const exists = data && Object.keys(data).length;
        if (!exists) return null;

        tag.key = data.key ?? key ?? null;
        tag.name = data.name ?? null;
        tag.createdBy = data.createdBy ?? null;
        tag.createdAt = normalizeTimestamp(data.createdAt, null);
        tag.updatedAt = normalizeTimestamp(data.updatedAt, null);

        return tag;
    }
}

module.exports = TagRespository;