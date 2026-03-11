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

const Logger = require('../log/logger');
const TagRespository = require('../repository/tag.repository');
const Tag = require('./tag.entity');

/**
 * UNB tags service
 * 
 * Service for working with tags.
 */
class TagsService {
    constructor(repo) {
        this._tags = new Map();
        this._loaded = false;
        this._repo = repo;
    }

    /**
     * Load the tags into memory.
     */
    async load() {
        if (this._loaded) {
            return this._tags;
        }

        try {
            const tags = await this._repo.tags.getAll();

            for (const tag of tags) {
                const entity = await TagRespository.getByKey(tag.key, { repo: this._repo });

                if (entity) {
                    this._tags.set(entity.key, entity);
                }
            }

            this._loaded = true;
        } catch (error) {
            Logger.error('TagService', `Tag service failed: ${error}.`, { error });
            throw error;
        }
    }

    /**
     * Get a tag entity.
     * 
     * @param {string} key - The tag key name to get.
     * @returns {Promise<Tag|null>} A promise that resolves to the tag entity or
     *                              `null` if not found.
     */
    async get(key) {
        await this.load();
        return await this.exists(key) ? this._tags.get(key) : null;
    }

    /**
     * Check if the tag exists.
     * 
     * @param {string} key - The tag key name to check.
     * @returns {Promise<boolean>} A promise that resolves to either `true` if the key exists,
     *                             `false` if does not exist.
     */
    async exists(key) {
        await this.load();
        return this._tags.has(key);
    }

    /**
     * Resolve a topic.
     * 
     * @param {Tag|string} tag - Either tha tag key name or the tag entity.
     * @returns {Promise<Tag|null>} A promise that resolves to either the Tag entity or `null`
     *                              if the tag does not exist. 
     */
    async resolve(tag) {
        await this.load();

        if (tag instanceof Tag) {
            return tag;
        }

        if (typeof tag === 'string') {
            const entity = this._tags.get(tag);
            if (entity) return entity;
        }

        return null;
    }

    /**
     * Resolve a collection of tag key names to a list of tag entity instances.
     * 
     * @param {string[]} tags - The collection of tags key names.
     * @returns {Promise<Tag[]>} A promise that resolves to the list of resolved tag entities. 
     */
    async resolveFromList(tags) {
        await this.load();
        if (!tags) return [];

        const list = [];

        for (const tag of tags) {
            const entity = await this.get(tag);

            if (entity) {
                list.push(entity);
            }
        }

        return list;
    }
} 

module.exports = TagsService;