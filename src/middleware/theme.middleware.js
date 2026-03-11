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
const { buildListCache } = require('../helpers/cache.helper');
const Logger = require('../log/logger');
const DataStore = require('../datastore/datastore');

/**
 * UNB theme middleware
 * 
 * Middleware for configuring theme-related data.
 */
module.exports = function createThemeMiddleware(repo) {
    return async function themeMiddleware(req, res, next) {
        try {
            const {
                cacheProviderService,
                member,
                localeService
            } = req.app.locals;

            const installedThemes = await cacheProviderService.get(
                UNB_CACHE_KEYS.THEMES_LIST,
                async () => await buildListCache(
                    repo,
                    member,
                    'themes',
                    localeService
                )
            );

            const unb = DataStore.get('unb');
            unb.installedThemes = installedThemes;

            req.app.locals.installedThemes = installedThemes;

            next();
        } catch (error) {
            Logger.error('ThemeMiddleware', `Theme middleware failed: ${error}.`, { error });
            next(error);
        }
    };
};