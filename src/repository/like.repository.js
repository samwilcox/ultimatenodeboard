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
const { normalizeTimestamp, normalizeBoolean } = require('../helpers/normalize.helper');

/**
 * UNB like repository.
 * 
 * Responsible for creating the `Like` entity.
 */
class LikeRespository {
    /**
     * Get a like by key name.
     * 
     * @param {string} key - The like key name.
     * @returns {Promise<Like>} A promise that resolves to the Like entity instance.
     */
    static async getByKey(key) {
        const data = await this.getDataByKey(key);
        return await this.build(key, data);
    }

    /**
     * Get data by key name.
     * 
     * @param {string} key - The like key name.
     * @returns {Promise<object>|null} A promise that resolves to the data for this entity or `null` if not found.
     */
    static async getDataByKey(key) {
        const { db } = DataStore.get('unb');
        const data = await db.repo.likes.getByKey(key);
        return data || null;
    }

    /**
     * Build the entity.
     * 
     * @param {string} key - The like key name.
     * @param {object|null} data - The data for the like or `null` if not found. 
     * @returns {Promise<Like>} A promise that resolves to the like entity instance.
     */
    static async build(key, data) {
        const Like = require('../likes/like.entity');
        let like = new Like();

        const exists = data && Object.keys(data).length;
        if (!exists) return null;

        like.key = data.key ?? key ?? null;
        like.contentType = data.contentType ?? null;
        like.contentKey = data.contentKey ?? null;
        like.likedBy = data.likedBy ?? null;
        like.likedAt = normalizeTimestamp(data.likedAt, null);
        like.private = normalizeBoolean(data.private, false);

        return like;
    }
}

module.exports = LikeRespository;