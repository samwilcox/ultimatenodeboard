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

const UNB_LIST_OPTIONS = require('./list.options');
const DataStore = require('../datastore/datastore');
const UNB_CACHE_KEYS = require('../data/cache/cache.keys');
const { buildListCache } = require('../helpers/cache.helper');

/**
 * UNB list builder service
 * 
 * Service for building various lists.
 */
class ListBuilderService {
    /**
     * Build the list option.
     * 
     * @param {UNB_LIST_OPTIONS|string} option - The list option to build.
     * @returns {Promise<array>} A promise that resolves to built option. 
     */
    static async build(option) {
        switch (option) {
            case 'LANGUAGES':
                return await this.buildLanguages();
            case 'THEMES':
                return await this.buildThemes();
            default:

        }
    }

    /**
     * Build the languages list.
     * 
     * @returns {Promise<{  
     *      label: string,
     *      url: string,
     *      selected: boolean
     * }} A promise that resolves to an array of languages.
     */
    static async buildLanguages() {
        const {
            cacheProviderService,
            db,
            localeService,
            member 
        } = DataStore.get('unb');

        const languages = await cacheProviderService.get(
            UNB_CACHE_KEYS.LANGUAGES_LIST,
            async () => await buildListCache(
                db.repo,
                member,
                'languages',
                localeService
            )
        );

        return languages;
    }

    /**
     * Build the themes list.
     * 
     * @returns {Promise<{  
     *      label: string,
     *      url: string,
     *      selected: boolean
     * }} A promise that resolves to an array of themes.
     */
    static async buildThemes() {
        const {
            cacheProviderService,
            db,
            localeService,
            member 
        } = DataStore.get('unb');

        const themes = await cacheProviderService.get(
            UNB_CACHE_KEYS.THEMES_LIST,
            async () => await buildListCache(
                db.repo,
                member,
                'themes',
                localeService
            )
        )

        return themes;
    }
}

module.exports = ListBuilderService;