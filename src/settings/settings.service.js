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

const UNB_SETTING_KEYS = require('./settings.keys');
const UNB_SETTINGS_SCHEMA = require('./settings.schema');
const Logger = require('../log/logger');
const { cast } = require('../helpers/cast.helper');

/**
 * UNB settings service.
 * 
 * Service for fetching and working with UNB application settings.
 */
class SettingsService {
    /**
     * Create a new instance of `SettingsService`.
     */
    constructor() {
        this._settings = new Map();
        this._loaded = false;
    }

    /**
     * Load the UNB application settings.
     * 
     * @param {object[]} repo - UNB database repository instance. 
     */
    async load(repo) {
        if (this._loaded) return;

        try {
            const schema = UNB_SETTINGS_SCHEMA;
            const settings = await repo.settings.getAll();

            for (const [key, value] of Object.entries(schema)) {
                const setting = settings?.find(s => s.key === key);
                
                this._settings.set(key, {
                    value: setting ? cast(setting.value, value.type) : null,
                    def: value.defaultValue
                });
            }

            this._loaded = true;
        } catch (error) {
            Logger.error('SettingsService', `Failed to load UNB application settings: ${error}.`, { error, repo });
            throw error;
        }
    }

    /**
     * Get an UNB application setting value by key.
     * 
     * @param {UNB_SETTING_KEYS|string} key - The setting key name.
     * @param {boolean} [useDefault=true] - `true` to use default if value for key is null, `false` if not.
     * @returns {Promise<*|null>} A promise that resolves to the setting value or `null` if key does not exist.
     */
    async get(key, useDefault = true) {
        await this.load();

        if (await this.exists(key)) {
            if (await this._settings.get(key).value) {
                return await this._settings.get(key).value;
            } else {
                return useDefault ? await this._settings.get(key).def : null;
            }
        }

        return null;
    }

    /**
     * Get an UNB application setting value by key synchronously.
     * 
     * @param {UNB_SETTING_KEYS|string} key - The setting key name.
     * @param {boolean} [useDefault=true] - `true` to use default if value for key is null, `false` if not.
     * @returns {any|null} The setting value or `null` if key does not exist.
     */
    getSync(key, useDefault = true) {
        if (this._settings.has(key)) {
            if (this._settings.get(key).value) {
                return this._settings.get(key).value;
            } else {
                return useDefault ? this._settings.get(key).def : null;
            }
        }

        return null;
    }

    /**
     * Check if a key exists in the UNB application settings.
     * 
     * @param {UNB_SETTING_KEYS|string} key - The setting key name.
     * @returns {Promise<boolean>} A promise that resolves to either `true` if key exists, `false` if not.
     */
    async exists(key) {
        await this.load();
        return this._settings.has(key);
    }

    /**
     * Get the total UNB application setting key/value pairs.
     * 
     * @returns {number} The total UNB application setting key/value pairs.
     */
    async size() {
        await this.load();
        return this._settings.size;
    }

    /**
     * Get the entire UNB application settings map.
     * 
     * @returns {Map} The UNB application settings map.
     */
    async all() {
        await this.load();
        return { ...this._settings };
    }
}

module.exports = SettingsService;