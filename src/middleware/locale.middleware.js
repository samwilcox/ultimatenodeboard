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
const { buildListCache } = require('../helpers/cache.helper');
const Logger = require('../log/logger');
const UNB_SETTING_KEYS = require('../settings/settings.keys');

/**
 * UNB locale middleware for assigning locale.
 */
module.exports = function createLocaleMiddleware(settingsService, localeService, repo) {
    return async function localeMiddleware(req, res, next) {
        try {
            const member = res.locals.member;
            const locale = member.locale || await settingsService.get(UNB_SETTING_KEYS.LOCALE_DEFAULT) || 'en-US';
            const { cacheProviderService, db } = req.app.locals;

            if (!localeService.hasLoadedLocale(locale)) {
                await localeService.loadLocale(locale);
            }

            req.t = (key, vars = {}) => localeService.tSync(key, vars, locale);
            res.locals.t = req.t;
            req.app.locals.t = req.t;

            const installedLanguages = await cacheProviderService.get(
                UNB_CACHE_KEYS.LANGUAGES_LIST,
                async () => await buildListCache(
                    repo,
                    member,
                    'languages',
                    localeService
                )
            );
            
            const unb = DataStore.get('unb');
            unb.t = req.t;
            unb.installedLanguages = installedLanguages;
            DataStore.set('unb', unb);

            req.app.locals.installedLanguages = installedLanguages;

            next();
        } catch (error) {
            Logger.error('LocaleMiddleware', `Locale middleware failed: ${error}.`, { error });
            next(error);
        }
    };
}