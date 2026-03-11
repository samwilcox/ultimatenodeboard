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

const UNB_CACHE_KEYS = require('../data/cache/cache.keys');
const DataStore = require('../datastore/datastore');
const { normalizeObject, normalizeArray, normalizeTimestamp, normalizeBoolean } = require('../helpers/normalize.helper');
const UNB_SETTING_KEYS = require('../settings/settings.keys');
const path = require('path');
const GroupRespository = require('./group.repository');

/**
 * UNB member repository.
 * 
 * Responsible for creating the `Member` entity.
 */
class MemberRespository {
    /**
     * Get a member by key name.
     * 
     * @param {string} key - The member key name.
     * @param {object} [options={}] - Options for getting member by key name.
     * @param {object} [options.repo=null] - Optional UNB database repo`.
     * @returns {Promise<Member>} A promise that resolves to the Member entity instance.
     */
    static async getByKey(key, options = {}) {
        const data = await this.getDataByKey(key, options);
        return await this.build(key, data, options);
    }

    /**
     * Get data by key name.
     * 
     * @param {string} key - The member key name.
     * @param {object} [options={}] - Options for getting member by key name.
     * @param {object} [options.repo=null] - Optional UNB database repo`.
     * @returns {Promise<object>|null} A promise that resolves to the data for this entity or `null` if not found.
     */
    static async getDataByKey(key, options = {}) {
        let { repo = null } = options;
        let data = null;

        if (repo) {
            data = await repo.members.getByKey(key);
        } else {
            const { db } = DataStore.get('unb');
            data = await db.repo.members.getByKey(key);
        }

        return data || null;
    }

    /**
     * Build the entity.
     * 
     * @param {string} key - The member key name.
     * @param {object|null} data - The data for the member or `null` if not found.
     * @param {object} [options={}] - Options for getting member by key name.
     * @param {object[]|null} [options.repo=null] - Optional UNB database repo`. 
     * @param {SettingsService|null} [options.settingsService=null] - Optional UNB settings service instance.
     * @param {CacheProviderService|null} [options.cacheProviderService=null] - Optional UNB cache provider service.
     * @returns {Promise<Member>} A promise that resolves to the member entity instance.
     */
    static async build(key, data, options = {}) {
        let { repo = null, settingsService = null, cacheProviderService = null } = options;

        if (!repo && !settingsService && !cacheProviderService) {
            const {
                _repo: repo,
                _settingsService: settingsService,
                _cacheProviderService: cacheProviderService
            } = DataStore.get('unb');

            repo = _repo;
            settingsService = _settingsService;
            cacheProviderService = _cacheProviderService;
        }

        const Member = require('../members/member.entity');
        let member = new Member();

        const exists = data && Object.keys(data).length;

        if (exists) {
            member.key = data.key ?? key ?? null;
            member.username = data.username ?? null;
            member.displayName = data.displayName ?? null;
            member.useDisplayName = data.useDisplayName ?? null;
            member.emailAddress = data.emailAddress ?? null;
            member.locale = data.locale ?? await settingsService.get(UNB_SETTING_KEYS.LOCALE_DEFAULT) ?? 'en-US';
            member.theme = data.theme ?? await settingsService.get(UNB_SETTING_KEYS.THEME_DEFAULT) ?? 'unb-default';
            member.themeMode = data.themeMode ?? await settingsService.get(UNB_SETTING_KEYS.THEME_DEFAULT_MODE) ?? 'light';
            member.settings = normalizeObject(data.settings, null);
            member.primaryGroup = await GroupRespository.getByKey(data.primaryGroup, { repo, settingsService }) ?? null;
            member.secondaryGroups = normalizeArray(data.secondaryGroups, null);
            member.groups = await this.buildGroups(member.primaryGroup, member.secondaryGroups) ?? null;
            member.photo = normalizeObject(data.photo, { type: 'none' });
            member.lockout = normalizeObject(data.lockout, { locked: false });
            member.lastVisit = normalizeTimestamp(data.lastVisit, null);
            member.anonymous = normalizeBoolean(data.anonymous, false);
        } else {
            member = await this.buildForGuest(member);
        }

        const themes = await cacheProviderService.get(
            UNB_CACHE_KEYS.THEMES,
            async () => await repo.themes.getAll(),
            null,
            settingsService
        );

        const theme = themes?.find(t => t.key === member.theme);

        member.configs = {
            localePath: path.join(__dirname, '..', '..', 'locale', member.locale),
            themePath: path.join(__dirname, '..', '..', 'themes', theme.folder, 'html'),
            themeCssUrl: `${process.env.UNB_BASE_URL}/themes/${theme.folder}/css`,
            themeJsUrl: `${process.env.UNB_BASE_URL}/themes/${theme.folder}/js`,
            assetUrl: `${process.env.UNB_BASE_URL}/public/assets`,
            themeFolder: theme.folder
        };

        return member;
    }

    /**
     * Build the member entity for a guest.
     * 
     * @param {Member} member - The Member entity instance.
     * @param {object} [options={}] - Options for getting member by key name.
     * @param {object[]|null} [options.repo=null] - Optional UNB database repo`. 
     * @param {SettingsService|null} [options.settingsService=null] - Optional UNB settings service instance.
     * @param {CacheProviderService|null} [options.cacheProviderService=null] - Optional UNB cache provider service.
     * @returns {Promise<Member>} A promise that resolves to the Member entity instance that was built for the guest. 
     */
    static async buildForGuest(member, options = {}) {
        let { repo = null, settingsService = null } = options;

        if (!repo && !settingsService) {
            const unb = DataStore.get('unb');
            repo = unb.db?.repo;
            settingsService = unb.settingsService;
        }

        member.username = 'Guest';
        member.displayName = 'Guest';
        member.useDisplayName = false;
        member.emailAddress = null;
        member.locale = await settingsService.get(UNB_SETTING_KEYS.LOCALE_DEFAULT) ?? 'en-US';
        member.theme = await settingsService.get(UNB_SETTING_KEYS.THEME_DEFAULT) ?? 'unb-default';
        member.themeMode = await settingsService.get(UNB_SETTING_KEYS.THEME_DEFAULT_MODE) ?? 'light';
        member.signedIn = false;
        member.primaryGroup = await GroupRespository.getByKey('guests', { repo, settingsService });
        member.secondaryGroups = null;
        member.groups = [member.primaryGroup];
        member.photo = { type: 'none' };

        member.settings = {
            dateTime: await settingsService.get(UNB_SETTING_KEYS.DATETIME_DEFAULT),
            pagination: await settingsService.get(UNB_SETTING_KEYS.PAGINATION_DEFAULT),
            topics: {
                preview: await settingsService.get(UNB_SETTING_KEYS.TOPICS_LIST_PREVIEW_ENABLED)
            },
            editor: {
                toolbar: await settingsService.get(UNB_SETTING_KEYS.EDITOR_TOOLBAR_DEFAULT),
                defaultFont: await settingsService.get(UNB_SETTING_KEYS.EDITOR_FONT_DEFAULT),
                defaultFontSize: await settingsService.get(UNB_SETTING_KEYS.EDITOR_FONT_SIZE_DEFAULT),
                defaultFontColor: await settingsService.get(UNB_SETTING_KEYS.EDITOR_FONT_COLOR_DEFAULT)
            },
            sidebar: await settingsService.get(UNB_SETTING_KEYS.SIDEBAR_DEFAULTS)
        };

        member.lockout = { locked: false };
        member.lastVisit = null;
        member.anonymous = false;

        return member;
    }

    /**
     * Build the groups array collection.
     * 
     * @param {Group} primary - The primary group.
     * @param {Group[]|null} [secondary=null] - Optional array of secondary groups (default is `null`). 
     * @returns {Group[]} An array of groups the member is a member of.
     */
    static async buildGroups(primary, secondary = null) {
        const groups = [];

        if (primary) {
            groups.push(primary);
        }

        if (secondary && Array.isArray(secondary)) {
            secondary.map(g => groups.push(g));
        }

        return groups;
    }
}

module.exports = MemberRespository;