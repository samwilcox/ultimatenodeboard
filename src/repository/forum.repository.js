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
const { normalizeNumber, normalizeBoolean, normalizeObject, normalizeArray } = require('../helpers/normalize.helper');

/**
 * UNB forum repository.
 * 
 * Responsible for creating the `Forum` entity.
 */
class ForumRespository {
    /**
     * Get a forum by key name.
     * 
     * @param {string} key - The forum key name.
     * @param {object} [options={}] = Options for get forum by key.
     * @param {object} [options.repo=null] - Optional UNB database repository (default is `null`).
     * @returns {Promise<Forum>} A promise that resolves to the Forum entity instance.
     */
    static async getByKey(key, options = {}) {
        const data = await this.getDataByKey(key, options);
        return await this.build(key, data);
    }

    /**
     * Get data by key name.
     * 
     * @param {string} key - The forum key name.
     * @param {object} [options={}] = Options for get forum by key.
     * @param {object} [options.repo=null] - Optional UNB database repository (default is `null`).
     * @returns {Promise<object>|null} A promise that resolves to the data for this entity or `null` if not found.
     */
    static async getDataByKey(key, options = {}) {
        let { repo = null } = options;
        let data = null;

        if (repo) {
            data = await repo.forums.getByKey(key);
        } else {
            const { db } = DataStore.get('unb');
            data = await db.repo.forums.getByKey(key);
        }

        return data || null;
    }

    /**
     * Build the entity.
     * 
     * @param {string} key - The forum key name.
     * @param {object|null} data - The data for the forum or `null` if not found. 
     * @returns {Promise<Forum>} A promise that resolves to the forum entity instance.
     */
    static async build(key, data) {
        const Forum = require('../forums/forum.entity');
        let forum = new Forum();

        const exists = data && Object.keys(data).length;
        if (!exists) return null;

        forum.key = data.key ?? key ?? null;
        forum.categoryKey = data.categoryKey ?? null;
        forum.title = data.title ?? null;
        forum.description = data.description ?? null;
        forum.sortOrder = normalizeNumber(data.sortOrder);
        forum.visible = normalizeBoolean(data.visible, true);
        forum.color = normalizeObject(data.color, null);
        forum.icon = data.icon ?? null;
        forum.archived = normalizeBoolean(data.archived, false);
        forum.parentKey = data.parentKey ?? null;
        forum.displayChildForums = normalizeBoolean(data.displayChildForums, true);
        forum.childForums = normalizeArray(data.childForums, null);
        forum.forumType = data.forumType ?? 'normal';
        forum.hotThreshold = normalizeNumber(data.hotThreshold) ?? 20;

        return forum;
    }
}

module.exports = ForumRespository;