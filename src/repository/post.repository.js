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
const { normalizeObject, normalizeTimestamp, normalizeArray, normalizeBoolean, normalizeNumber } = require('../helpers/normalize.helper');

/**
 * UNB post repository.
 * 
 * Responsible for creating the `Post` entity.
 */
class PostRespository {
    /**
     * Get a post by key name.
     * 
     * @param {string} key - The post key name.
     * @returns {Promise<Forum>} A promise that resolves to the Forum entity instance.
     */
    static async getByKey(key) {
        const data = await this.getDataByKey(key);
        return await this.build(key, data);
    }

    /**
     * Get data by key name.
     * 
     * @param {string} key - The post key name.
     * @returns {Promise<object>|null} A promise that resolves to the data for this entity or `null` if not found.
     */
    static async getDataByKey(key) {
        const { db } = DataStore.get('unb');

        const data = await db.repo.posts.getByKey(key);

        return data || null;
    }

    /**
     * Build the entity.
     * 
     * @param {string} key - The posts key name.
     * @param {object|null} data - The data for the post or `null` if not found. 
     * @returns {Promise<Post>} A promise that resolves to the post entity instance.
     */
    static async build(key, data) {
        const Post = require('../posts/post.entity');
        let post = new Post();

        const exists = data && Object.keys(data).length;
        if (!exists) return null;

        post.key = data.key ?? key ?? null;
        post.forumKey = data.forumKey ?? null;
        post.topicKey = data.topicKey ?? null;
        post.postNumber = normalizeNumber(data.postNumber);
        post.createdBy = data.createdBy ?? null;
        post.createdAt = normalizeTimestamp(data.createdAt, null);
        post.tags = normalizeObject(data.tags, null);
        post.content = normalizeObject(data.content, null);
        post.isFirstPost = normalizeBoolean(data.isFirstPost, false);
        post.attachments = normalizeArray(data.attachments, null);
        post.ipAddress = data.ipAddress ?? null;
        post.hostname = data.hostname ?? null;
        post.userAgent = data.userAgent ?? null;

        return post;
    }
}

module.exports = PostRespository;