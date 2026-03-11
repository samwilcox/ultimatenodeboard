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

const DataStore = require("../../../datastore/datastore");
const CacheError = require("../../../errors/cache.error");
const UNB_CACHE_MAP = require("../cache.map");

/**
 * UNB memory cache provider.
 * 
 * Cache provider that stores cached data in memory.
 */
class MemoryCacheProvider {
    /**
     * Create a new instance of `MemoryCacheProvider`.
     */
    constructor() {
        this._cache = new Map();
    }

    /**
     * Get the value for a given cache key.
     * 
     * @param {string} key - The cache key.
     * @param {Function} fn - Async callback function to fetch fresh data. 
     * @param {number|null} [ttl=null] - Optional TTL expirary in seconds (`null` = no expiration). (default is `null`).
     * @param {SettingsService} [settingsService=null] - Optional UNB settings service.
     * @returns {Promise<*>} A promise that resolves to the `value` for the given `key`. 
     * @throws {CacheError} If the function parameter is invalid.
     */
    async get(key, fn, ttl = null, settingsService = null) {
        if (!settingsService) {
            const { settingsService: _settingsService } = DataStore.get('unb');
            settingsService = _settingsService;
        }

        const settings = this.resolveCacheSettings(key);

        let doCache = false;
        let resolvedTtl = ttl;

        if (settings) {
            doCache = await settingsService.get(settings.enabledKey, true);

            if (resolvedTtl === null) {
                resolvedTtl = await settingsService.get(settings.ttlKey, null);
            }
        }

        if (doCache) {
            const entry = this._cache.get(key);

            if (entry) {
                if (!entry.expiresAt || Date.now() < entry.expiresAt) {
                    return entry.value;
                }

                this._cache.delete(key);
            }
        }

        if (!fn) return null;

        if (typeof fn !== 'function') {
            throw new CacheError(`cache get() function parameter is invalid for key '${key}'.`, { key });
        }

        const value = await fn();

        if (doCache) {
            const expiresAt = resolvedTtl
                ? Date.now() + resolvedTtl * 1000
                : null;

            this._cache.set(key, { value, expiresAt });
        }

        return value;
    }

    /**
     * Set a value for a key in the cache.
     * 
     * @param {string} key - The name of the `key` to set the `value` for.
     * @param {*} value - The `value` to set for the given `key`.
     * @param {number|null} [ttl=null] - Optional TTL expirary (default is `null`). 
     */
    async set(key, value, ttl = null) {
        const expiresAt = ttl
            ? Date.now() + ttl * 1000
            : null;

        this._cache.set(key, { value, expiresAt });
    }

    /**
     * Delete a key from the cache.
     * 
     * @param {string} key - The name of the key to delete from the cache.
     * @throws {CacheError} If the key is invalid.
     */
    async del(key) {
        if (!key || typeof key !== 'string') {
            throw new CacheError('Invalid cache key.', { key });
        }

        this._cache.delete(key);
    }

    /**
     * Resolve cache configs by key.
     * 
     * @private
     * @param {string} key - The name of the key.
     * @returns {object|null} The cache map for the given key or `null` if the key does not exist.
     */
    resolveCacheSettings(key) {
        if (UNB_CACHE_MAP[key]) {
            return UNB_CACHE_MAP[key];
        }

        for (const config of Object.values(UNB_CACHE_MAP)) {
            if (config.pattern && config.pattern.test(key)) {
                return config;
            }
        }

        return null;
    }
}

module.exports = MemoryCacheProvider;