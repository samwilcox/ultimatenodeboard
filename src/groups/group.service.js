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
const GroupRespository = require("../repository/group.repository");
const Group = require("./group.entity");
const DataStore = require('../datastore/datastore');

/**
 * UNB group service
 * 
 * Service for working with user groups.
 */
class GroupService {
    /**
     * Create a new instance of `GroupService`.
     * 
     * @param {object[]} repo - The UNB database repositories.   
     * @param {CacheProviderService} cacheProviderService - The UNB cache service. 
     * @param {SettingsService} settingsService - The UNB settings service instance.
     */
    constructor(repo, cacheProviderService, settingsService) {
        this._groups = new Map();
        this._loaded = false;
        this._repo = repo;
        this._cacheProviderService = cacheProviderService;
        this._settingsService = settingsService;
    }

    /**
     * Load the groups.
     * 
     * @returns {Promise<GroupService>} A promise that resolves to the UNB group service instance.
     */
    async load() {
        if (this._loaded) return this._groups;

        const groups = await this._repo.groups.getAll();

        await Promise.all(
            groups
                .map(async g => await GroupRespository.getByKey(g.key, { repo: this._repo, settingsService: this._settingsService }))
                .sort((a, b) => a.sortOrder - b.sortOrder)
        );

        groups.map(g => this._groups.set(g.key, g));

        this._loaded = true;

        return this._groups;
    }

    /**
     * Get a group by key.
     * 
     * @param {string} key - The group key name.
     * @returns {Promise<Group|null>} A promise that resolves to either the group entity or `null` if not found.
     */
    async get(key) {
        await this.load();
        return await this.exists(key) ? this._groups[key] : null;
    } 

    /**
     * Check if a group exists by key.
     * 
     * @param {string} key - The group key name.
     * @returns {Promise<boolean>} A promise that resolves to either `true` if the key exists,
     *                             `false` if it does not.
     */
    async exists(key) {
        await this.load();
        return this._groups.has(key);
    }

    /**
     * Get the total groups in the group service.
     * 
     * @returns {Promise<number>} A promise that resolves to the size of the group service.
     */
    async size() {
        await this.load();
        return this._groups.size;
    }

    /**
     * Get the entire map of groups.
     * 
     * @returns {Promise<Map>} The full map of groups.
     */
    async all() {
        await this.load();
        return { ...this._groups };
    }

    /**
     * Resolve a group.
     * 
     * @param {Group} group - The group entity instance.
     * @returns {Promise<Group|null>} A promise that resolves to either the group entity or
     *                                `null` if not found. 
     */
    async resolve(group) {
        if (group instanceof Group) return group;
        if (typeof group !== 'string') return null;
        await this.load();

        if (this._groups.has(group)) {
            return this._groups.get(group);
        }

        return null;
    }

    /**
     * Reset the cache.
     */
    async reset() {
        this._loaded = false;
        this._groups = new Map();
        await this.load();
    }

    /**
     * Build a group component.
     * 
     * @param {object} params - Parameters for building the group component.
     * @param {Group|string} params.group - Either the group key name or the group
     *                                      entity instance.
     * @param {("badge")} params.mode - The mode for what to build:
     *                                  `badge => build a group badge component.
     * @returns {Promise<object|null>} A promise that resolves to the built group component or `null` if
     *          invalid mode passed in. 
     */
    async build(params) {
        const { group, mode } = params;

        const resolvedGroup = await this.resolve(group);
        if (!resolvedGroup) return null;

        switch (mode) {
            case 'badge':
                return await this.buildBadge(resolvedGroup);
            default:
                return null;
        }
    }

    /**
     * Build the data for a group badge component.
     * 
     * @param {Group} group - The group entity instance.
     * @returns {Promise<{
     *      name: string,
     *      url: string,
     *      icon: (string|null),
     *      color: {
     *          light: {
     *              normal: {
     *                  text: string,
     *                  background: string
     *              },
     *              hover: {
     *                  text: string,
     *                  background: string
     *              }
     *          },
     *          dark: {
     *              normal: {
     *                  text: string,
     *                  background: string
     *              },
     *              hover: {
     *                  text: string,
     *                  background: string
     *              }
     *          }
     *      }
     * }} A promise that resolves to the built badge data. 
     */
    async buildBadge(group) {
        const { member } = DataStore.get('unb');

        return {
            name: group.pluralName,
            url: buildEntityUrl('group', group.key, group.pluralName),
            icon: group.icon,
            color: group.color,
            themeMode: member.themeMode
        };
    }
}

module.exports = GroupService;