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
const { normalizeNumber, normalizeBoolean, normalizeArray, normalizeObject } = require('../helpers/normalize.helper');
const UNB_SETTING_KEYS = require('../settings/settings.keys');

/**
 * UNB member repository.
 * 
 * Responsible for creating the `Member` entity.
 */
class GroupRespository {
    /**
     * Get a group by key name.
     * 
     * @param {string} key - The group key name.
     * @param {object} [options={}] - Options for getting entity.
     * @param {object[]|null} [options.repo=null] - Optional UNB database respositories collection (default is `null`).
     * @param {SettingsService|null} [options.settingsService=null] - Optional UNB settings service instance (default is `null`).
     * @returns {Promise<Member>} A promise that resolves to the Group entity instance.
     */
    static async getByKey(key, options = {}) {
        const data = await this.getDataByKey(key, options);
        return await this.build(key, data, options);
    }

    /**
     * Get data by key name.
     * 
     * @param {string} key - The group key name.
     * @param {object} [options={}] - Options for getting entity.
     * @param {object[]|null} [options.repo=null] - Optional UNB database respositories collection (default is `null`).
     * @param {SettingsService|null} [options.settingsService=null] - Optional UNB settings service instance (default is `null`).
     * @returns {Promise<object>|null} A promise that resolves to the data for this entity or `null` if not found.
     */
    static async getDataByKey(key, options = {}) {
        const { repo = null } = options;
        let data = null;

        if (repo) {
            data = await repo.groups.getByKey(key);
        } else {
            const { db } = DataStore.get('unb');
            data = await db.repo.groups.getByKey(key);
        }

        return data || null;
    }

    /**
     * Build the entity.
     * 
     * @param {string} key - The group key name.
     * @param {object|null} data - The data for the group or `null` if not found. 
     * @param {object} [options={}] - Options for getting entity.
     * @param {object[]|null} [options.repo=null] - Optional UNB database respositories collection (default is `null`).
     * @param {SettingsService|null} [options.settingsService=null] - Optional UNB settings service instance (default is `null`).
     * @returns {Promise<Group>} A promise that resolves to the group entity instance.
     */
    static async build(key, data, options = {}) {
        const Group = require('../groups/group.entity');
        let group = new Group();

        const exists = data && Object.keys(data).length;
        if (!exists) return null;

        let { settingsService = null } = options;

        if (!settingsService) {
            settingsService = DataStore.get('unb').settingsService;
        }

        group.key = data.key ?? key ?? null;
        group.name = data.name ?? null;
        group.pluralName = data.pluralName ?? null;
        group.description = data.description ?? null;
        group.sortOrder = normalizeNumber(data.sortOrder);
        group.system = normalizeBoolean(data.system, false);
        group.inherits = normalizeArray(data.inherits, null);
        group.color = normalizeObject(data.color, await settingsService.get(UNB_SETTING_KEYS.GROUP_COLOR_DEFAULT));
        group.icon = data.icon ?? null;

        return group;
    }
}

module.exports = GroupRespository;