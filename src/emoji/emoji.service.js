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

const { stat, readFile } = require('../helpers/file.helper');
const Logger = require('../log/logger');
const path = require('path');

/**
 * UNB emoji service
 * 
 * Service for handling UNB emoticons.
 */
class EmojiService {
    /**
     * Create a new instance of `EmojiService`.
     */
    constructor() {
        this._emojis = null;
        this._emojiCacheMtime = 0;
        this._categoriesPayloadCache = null;
    }

    /**
     * Load all the emoji.
     * 
     * @returns {Promise<object|null>} A promise that resolves to the emojis object.
     */
    async load() {
        try {
            const emojiFilePath = path.join(
                __dirname,
                '..',
                '..',
                'public',
                'assets',
                'emoji',
                'unb-emoji.json'
            );

            const fileStat = stat(emojiFilePath);
            const mtime = fileStat?.mtimeMs || 0;

            if (this._emojis && this._emojiCacheMtime === mtime) {
                return this._emojis;
            }

            const raw = readFile(emojiFilePath);
            const json = JSON.parse(raw);

            this._emojis = json;
            this._emojiCacheMtime = mtime;
            this._categoriesPayloadCache = null;

            return json;
        } catch (error) {
            Logger.error('EmojiService', `Emoji service failed to load emojis: ${error}.`, { error });
            return null;
        }
    }

    /**
     * Normalize an input string.
     * 
     * @param {string} str - The string to normalize.
     * @returns {string} The normalized string.
     */
    normalize(str) {
        return String(str || '').toLowerCase().trim();
    }

    /**
     * Check if a key is garbage.
     * 
     * @param {string} key - The key to check.
     * @returns {boolean} `true` if a garbage key, `false` if not.
     */
    isGarbageKey(key) {
        const k = String(key || '').trim().toLowerCase();
        if (!k) return true;

        if (k === '[object object]') return true;
        if (k.includes('undefined')) return true;
        if (k.includes('null')) return true;
        if (k.startsWith('[object')) return true;

        return false;
    }

    /**
     * Build categories list in a UI-friendly shape.
     * 
     * @returns {{
     *      totalGroups: number,
     *      groups: object[]
     * }} The payload.
     */
    buildCategoriesPayload() {
        if (this._categoriesPayloadCache) {
            return this._categoriesPayloadCache;
        }

        const cats = this._emojis?.categories;
        const out = { totalGroups: 0, groups: [] };

        if (!cats || typeof cats !== 'object') {
            this._categoriesPayloadCache = out;
            return out;
        }

        const normalizeGroup = (groupKey, groupObj) => {
            if (groupObj?.name && typeof groupObj.name === 'object') {
                return {
                    key: String(groupObj.name.key || groupKey || '').trim(),
                    label: String(groupObj.name.message || groupObj.name.label || groupKey || '').trim(),
                    order: Number.isFinite(groupObj.name.order) ? groupObj.name.order : 9999
                };
            }

            return {
                key: String(groupKey || '').trim(),
                label: String(groupObj?.name || groupKey || '').trim(),
                order: 9999
            };
        };

        const normalizeSubgroup = (subgroupKey) => {
            const key = String(subgroupKey || '').trim();
            return { key, label: key };
        };

        const payload = Object.keys(cats).map(groupKey => {
            const groupObj = cats[groupKey] || {};
            const group = normalizeGroup(groupKey, groupObj);
            const subgroupsObj = groupObj.subgroups || {};

            const subgroups = Object.keys(subgroupsObj)
                .filter(sgKey => !this.isGarbageKey(sgKey))
                .map(normalizeSubgroup)
                .filter(sg => sg.key);

            return { ...group, subgroups };
        })
        .filter(g => g.key && g.label && !this.isGarbageKey(g.key) && !this.isGarbageKey(g.label))
        .sort((a, b) => (a.order - b.order) || a.label.localeCompare(b.label));

        out.totalGroups = payload.length;
        out.groups = payload;

        this._categoriesPayloadCache = out;

        return out;
    }

    /**
     * Get the items for a category.
     * 
     * @param {string} group - The group key.
     * @param {string} subgroup - The subgroup key.
     * @returns {object[]} An object of category items.
     */
    getCategoryItems(group, subgroup = '') {
        const cats = this._emojis?.categories;
        if (!cats || typeof cats !== 'object') return [];

        const wanted = String(group || '').trim();
        if (!wanted) return [];

        const groupKey = Object.keys(cats).find(k => {
            const obj = cats[k] || {};
            const nk = obj?.name?.key;

            return String(k).trim() === wanted || String(nk || '').trim() === wanted;
        });

        if (!groupKey) return [];

        const groupObj = cats[groupKey];
        const sg = groupObj?.subgroups || {};

        if (!subgroup) {
            const out = [];

            Object.keys(sg).forEach(sgKey => {
                if (this.isGarbageKey(sgKey)) return;

                (sg[sgKey] || []).forEach(item => {
                    out.push({
                        ...item,
                        group: wanted,
                        subgroup: sgKey
                    });
                });
            });

            return out;
        }

        if (this.isGarbageKey(subgroup)) return [];

        const items = sg[subgroup] || [];

        return items.map(item => ({
            ...item,
            group: wanted,
            subgroup
        }));
    }

    /**
     * Search emojis.
     * 
     * @param {string} q - The search query.
     * @returns {object[]} An arrow of objects.
     */
    searchEmoji(q) {
        const needle = this.normalize(q);

        const index = this._emojis?.searchIndex || [];
        if (!needle || !index.length) return [];

        const hits = index.filter(row => {
            if (!row?.tokens?.length) return false;
            return row.tokens.some(t => t.includes(needle));
        });

        return hits.map(row = ({
            unicode: row.unicode,
            hexcode: row.hexcode,
            label: row.label,
            skins: row.skins || []
        }));
    }
};

module.exports = EmojiService;