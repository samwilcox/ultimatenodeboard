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

const { buildEntityUrl } = require("../helpers/entity.helper");
const ForumRespository = require("../repository/forum.repository");

/**
 * UNB forum service
 * 
 * Service for forum-related operations.
 */
class ForumService {
    /**
     * Create a new instance of `ForumService`.
     * 
     * @param {CacheProvderService} cacheProviderService - The UNB cache provider service. 
     * @param {object[]} repo - The UNB database repositories. 
     */
    constructor(cacheProviderService, repo) {
        this._forums = new Map();
        this._cacheProviderService = cacheProviderService;
        this._repo = repo;
        this._loaded = false;
    }

    /**
     * Load the forums.
     */
    async load() {
        if (this._loaded) {
            return this._forums;
        }

        const forums = await this._repo.forums.getAll();

        if (Array.isArray(forums) && forums.length) {
            for (const forum of forums) {
                const entity = await ForumRespository.getByKey(forum.key, { repo: this._repo });

                if (entity) {
                    this._forums.set(entity.key, entity);
                }
            }
        }

        this._loaded = true;

        return this._forums;
    }

    /**
     * Get the forum entity for a forum key.
     * 
     * @param {string} forumKey - The forum key.
     * @returns {Promise<Forum|null>} A promise that resolves to the forum entity or `null` if not found.
     */
    async get(forumKey) {
        await this.load();
        return await this.exists(forumKey) ? this._forums.get(forumKey) : null;
    }

    /**
     * Check if a forum exists by key.
     * 
     * @param {string} forumKey - The forum key.
     * @returns {Promise<boolean>} A promise that resolves to either `true` if exists, `false` if not.
     */
    async exists(forumKey) {
        await this.load();
        return this._forums.has(forumKey);
    }

    /**
     * Get the entire forums map.
     * 
     * @returns {Promise<Map>} The entire forums map.
     */
    async all() {
        await this.load();
        return { ...this._forums };
    }

    /**
     * Get the entire forums map as an array.
     * 
     * @returns {Promise<[Forum]>} A promose that resolves to the forums map array.
     */
    async allArr() {
        return Array.from(this._forums.values());
    }

    /**
     * Check if a forum has children or not.
     * 
     * @param {string} forumKey - The forum key to check for children for.
     * @returns {Promise<{
     *      haveChildren: boolean,
     *      children: Forum[] | null
     * }} A promise that resolves to an object containing data for child forums.
     */
    async checkForChildForums(forumKey) {
        if (!forumKey) return { haveChildren: false, children: null };
        const forum = await this.get(forumKey);
        if (!forum || !forum.children) return { haveChildren: false, children: null };
        
        const children = await Promise.all(
            forum.children
                .map(async c => await ForumRespository.getByKey(c))
                .sort((a, b) => a.sortOrder - b.sortOrder)
        );

        if (!children || !Array.isArray(children) || !children.length) {
            return { haveChildren: false, children: null };
        }

        return children;
    }

    /**
     * Check if the selected forum is a child.
     * 
     * @param {string} selectedKey - The selected forum key.
     * @returns {Promise<{
     *      isChild: boolean,
     *      parentKey: string
     * }>} A promise that resolves to an object containing the results.
     */
    async isSelectedForumAChild(selectedKey) {
        if (!selectedKey || typeof selectedKey !== 'string') return { isChild: false, parentKey: null };
        const forum = await this.get(selectedKey);
        if (!forum) return { isChild: false, parentKey: null };

        return {
            isChild: forum.parentKey !== null,
            parentKey: forum.parentKey
        };
    }

    /**
     * Build the forums listing for the side bar.
     * 
     * @param {string|null} [selectedKey=null] - Optional selected key (default is `null`).
     * @returns {Promise<[{
     *      key: string,
     *      title: string,
     *      url: string,
     *      icon: string,
     *      color: {
     *          light: string,
     *          dark: string
     *      },
     *      selected: boolean,
     *      isChild: boolean
     * }]|null} A promise that resolves to an array of forum data objects or `null` if not forums.
     */
    async buildForumsListing(selectedKey = null) {
        await this.load();

        const raw = this._forums;
        if (!raw || (!(raw instanceof Map))) return null;

        const forumsList = [];

        for (const [, value] of raw) {
            forumsList.push(value);
        }

        const forums = forumsList
            .filter(f => f.visible === true && f.parentKey === null)
            .sort((a, b) => a.sortOrder - b.sortOrder);

        if (!forums || !Array.isArray(forums)) return null;

        if (forums.length) {
            const isSelectedChild = await this.isSelectedForumAChild(selectedKey);
            const listing = [];
            const childForums = [];

            for (const forum of forums) {
                if (isSelectedChild.isChild) {
                    if (forum.key === isSelectedChild.parentKey) {
                        const children = await this.checkForChildForums(forum.key);

                        if (children.haveChildren && Array.isArray(children.children)) {
                            for (const child of children.children) {
                                childForums.push({
                                    key: child.key,
                                    title: child.title,
                                    url: buildEntityUrl('forum', child.key, child.title),
                                    color: {
                                        light: child.color.light,
                                        dark: child.color.dark
                                    },
                                    selected: child.key === selectedKey,
                                    isChild: true
                                });
                            }
                        }
                    }
                } else {
                    listing.push({
                        key: forum.key,
                        title: forum.title,
                        url: buildEntityUrl('forum', forum.key, forum.title),
                        icon: forum.icon ?? null,
                        color: {
                            light: forum.color.light,
                            dark: forum.color.dark
                        },
                        selected: forum.key === selectedKey,
                        isChild: false
                    });
                }

                if (childForums.length > 0) {
                    listing.push(...childForums);
                }
            }

            return listing;
        }

        return null;
    }
}

module.exports = ForumService;