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

const path = require('path');
const { readFile, readDir } = require('../helpers/file.helper');
const Logger = require('../log/logger');
const UNB_SETTING_KEYS = require('../settings/settings.keys');
const DataStore = require('../datastore/datastore');

/**
 * UNB locale service.
 * 
 * Service for fetching and working with locales.
 */
class LocaleService {
    /**
     * Create a new instance of `LocaleService`.
     */
    constructor(settingsService) {
        this._locale = {};
        this._loaded = false;
        this._settingsService = settingsService;
    }

    /**
     * Load the locale.
     */
    async load() {
        if (this._loaded) return;

        try {
            const defaultLocale = await this._settingsService.get(UNB_SETTING_KEYS.LOCALE_DEFAULT) ?? 'en-US';
            await this.loadLocale(defaultLocale);
            this._loaded = true;
        } catch (error) {
            Logger.error('LocaleService', `Locale service failed to load locale: ${error}.`, { error });
            throw error;
        }
    }

    /**
     * Load a given locale.
     * 
     * @param {string} locale - The locale to load.
     */
    async loadLocale(locale) {
        const localePath = path.join(__dirname, '..', '..', 'locale', locale);
        const files = readDir(localePath);

        this._locale[locale] = {};

        for (const file of files) {
            if (file.name !== 'manifest.json' && file.name.endsWith('.json')) {

                const content = require(path.join(localePath, file.name));
                const namespace = file.name.replace('.json', '');

                this._locale[locale][namespace] = content;
            }
        }
    }


    /**
     * Check if a locale has been loaded.
     * 
     * @param {string} locale - The locale to check.
     * @returns {boolean} `true` if locale is loaded, `false` if not.
     */
    hasLoadedLocale(locale) {
        return locale in this._locale;
    }

    /**
     * Resolves and returns a localized string for the given key.
     * 
     * @param {string} key - The translation key identifier (e.g., `forum.title`).
     * @param {object} [vars={}] - Optional variables for interpolation.
     * @returns {Promise<string>} A promise that resolves to a localized string with variables subtituted. 
     */
    async t(key, vars = {}) {
        const dict = await this.resolveTranslations();

        let value = this.resolveKey(dict, key);
        if (!value) value = key;

        for (const [k, v] of Object.entries(vars)) {
            const token = `{${k}}`;
            value = value.split(token).join(String(v));
        }

        return value;
    }

    /**
     * Resolves and returns a localized string for the given key synchonously.
     * 
     * @param {string} key - The translation key identifier (e.g., `forum.title`).
     * @param {object} [vars={}] - Optional variables for interpolation. 
     * @param {string} locale - The locale to use. 
     */
    tSync(key, vars = {}, locale = 'en-US') {
        const dict = this._locale[locale];

        let value = this.resolveKey(dict, key);
        if (!value) value = key;

        for (const [k, v] of Object.entries(vars)) {
            const token = `{${k}}`;
            value = value.split(token).join(String(v));
        }

        return value;
    }

    /**
     * Resolves the translations for the member.
     * 
     * @returns {Promise<Map>} A promise that resolves to the translations map.
     */
    async resolveTranslations() {
        await this.load();

        const { member, settingsService } = DataStore.get('unb');
        const defaultLocale = await settingsService.get(UNB_SETTING_KEYS.LOCALE_DEFAULT) ?? 'en-US';

        if (!member) return this._locale[defaultLocale];

        const locale = member.locale;

        if (!this.hasLoadedLocale(locale)) {
            await this.loadLocale(locale);
        }

        return this._locale[locale];
    }

    /**
     * Resolve a key.
     */
    resolveKey(dict, key) {
        if (!dict) return null;

        const parts = key.split('.');
        let current = dict;

        for (let i = 0; i < parts.length; i++) {
            const remaining = parts.slice(i).join('.');

            if (Object.prototype.hasOwnProperty.call(current, remaining)) {
                return current[remaining];
            }

            if (!Object.prototype.hasOwnProperty.call(current, parts[i])) {
                return null;
            }

            current = current[parts[i]];
        }

        return current;
    }

}

module.exports = LocaleService;