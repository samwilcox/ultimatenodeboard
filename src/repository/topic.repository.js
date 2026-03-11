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
const { normalizeNumber, normalizeBoolean, normalizeObject, normalizeTimestamp, normalizeArray, normalizeBigInt } = require('../helpers/normalize.helper');

/**
 * UNB topic repository.
 * 
 * Responsible for creating the `Topic` entity.
 */
class TopicRespository {
    /**
     * Get a forum by key name.
     * 
     * @param {string} key - The topic key name.
     * @returns {Promise<Topic>} A promise that resolves to the Topic entity instance.
     */
    static async getByKey(key) {
        const data = await this.getDataByKey(key);
        return await this.build(key, data);
    }

    /**
     * Get data by key name.
     * 
     * @param {string} key - The forum key name.
     * @returns {Promise<object>|null} A promise that resolves to the data for this entity or `null` if not found.
     */
    static async getDataByKey(key) {
        const { db } = DataStore.get('unb');

        const data = await db.repo.topics.getByKey(key);

        return data || null;
    }

    /**
     * Build the entity.
     * 
     * @param {string} key - The topic key name.
     * @param {object|null} data - The data for the topic or `null` if not found. 
     * @returns {Promise<Topic>} A promise that resolves to the topic entity instance.
     */
    static async build(key, data) {
        const Topic = require('../topics/topic.entity');
        let topic = new Topic();

        const exists = data && Object.keys(data).length;
        if (!exists) return null;

        topic.key = data.key ?? key ?? null;
        topic.forumKey = data.forumKey ?? null;
        topic.title = data.title ?? null;
        topic.createdBy = data.createdBy ?? null;
        topic.createdAt = normalizeTimestamp(data.createdAt, null);
        topic.tags = normalizeArray(data.tags, null);
        topic.totalViews = normalizeNumber(data.totalViews);
        topic.locked = normalizeBoolean(data.locked, false);
        topic.visible = normalizeBoolean(data.visible, true);
        topic.solution = normalizeObject(data.solution, { solution: false });
        topic.pinned = normalizeBoolean(data.pinned, false);
        topic.pollKey = data.pollKey ?? null;

        return topic;
    }
}

module.exports = TopicRespository;