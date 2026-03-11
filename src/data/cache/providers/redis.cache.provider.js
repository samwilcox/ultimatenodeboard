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

const DataStore = require('../../../datastore/datastore');
const { createClient } = require('redis');
const Logger = require('../../../log/logger');
const CacheError = require('../../../errors/cache.error');
const UNB_CACHE_MAP = require('../cache.map');

/**
 * UNB redis cache provider
 * 
 * Provider that stores cache in a Redis server.
 */
class RedisCacheProvider {
    /**
     * Create new instance of `RedisCacheProvider`.
     */
    constructor() {
        this._client = null;
        this._connected = false;
    }

    /**
     * Connect to the Redis server.
     */
    async connectClient() {
        try {
            const config = {
                socket: {
                    host: process.env.UNB_CACHE_REDIS_HOST || '127.0.0.1',
                    port: parseInt(process.env.UNB_CACHE_REDIS_PORT, 10) || 6379,
                    tls: process.env.UNB_CACHE_REDIS_TLS === 'true'
                }
            };

            if (process.env.UNB_CACHE_REDIS_AUTH === 'true') {
                config.username = process.env.UNB_CACHE_REDIS_AUTH_USERNAME;
                config.password = process.env.UNB_CACHE_REDIS_AUTH_PASSWORD;
            }
            
            this._client = createClient(config);

            this._client.on('error', (error) => {
                Logger.error('Cache.Redis.Provider.Client', `Redis client failed: ${error}.`, { error });
                throw error;
            });

            await this._client.connect();
            this._connected = true;

            Logger.debug('Cache.Redis.Provider.Client', `UNB connected to Redis server: ${config.socket.host}:${config.socket.port}.`);
        } catch (error) {
            Logger.error('Cache.Redis.Provider', `Cache Redis provider failed: ${error}.`, { error });
            throw error;
        }
    }

    /**
     * Get the value for a given cache key.
     * 
     * @param {string} key - The cache key.
     * @param {Function} fn - Async callback function to fetch fresh data. 
     * @param {number|null} [ttl=null] - Optional TTL expirary in seconds (`null` = no expiration). (default is `null`).
     * @param {SettingsService} [settingsService=null] - Optional UNB settings service.
     * @returns {Promise<*>} A promise that resolves to the `value` for the given `key`. 
     * @throws {CacheError} If the function parameter is invalid or Redis client is not connected.
     */
    async get(key, fn, ttl = null, settingsService = null) {
        if (!this._connected) {
            throw new CacheError('Redis client not connected.');
        }

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
            const cached = await this._client.get(key);

            if (cached !== null) {
                try {
                    return JSON.parse(cached);
                } catch {
                    return cached;
                }
            }
        }

        if (!fn) return null;

        if (typeof fn !== 'function') {
            throw new CacheError(`cache get() function parameter is invalid for key '${key}'.`, { key });
        }

        const value = await fn();

        if (doCache) {
            await this.set(key, value, resolvedTtl);
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
        if (!this._connected) {
            throw new CacheError('Redis client not connected.');
        }

        const payload =
            typeof value === 'string'
                ? value
                : JSON.stringify(value);

        let safeTTL = null;

        if (ttl !== null && ttl !== undefined) {
            const parsed = Number.parseInt(ttl, 10);

            if (Number.isInteger(parsed) && parsed > 0) {
                safeTTL = parsed;
            }
        }

        if (safeTTL !== null) {
            await this._client.set(key, payload, { EX: safeTTL });
        } else {
            await this._client.set(key, payload);
        }
    }

    /**
     * Delete a key from the cache.
     * 
     * @param {string} key - The name of the key to delete from the cache.
     * @throws {CacheError} If the key is invalid.
     */
    async del(key) {
        if (!this._connected) {
            throw new CacheError('Redis client not connected.');
        }

        if (!key || typeof key !== 'string') {
            throw new CacheError('Invalid cache key', { key });
        }

        await this._client.del(key);
    }

    /**
     * Get the TTL.
     * 
     * @param {string} key - The name of the key.
     * @returns {Promise<ttl>} A promise that resolves to the redis ttl.
     */
    async ttl(key) {
        if (!this._connected) {
            throw new CacheError('Redis client not connected.');
        }

        return this._client.ttl(key);
    }

    /**
     * Get multiple cache key values.
     * 
     * @param {string[]} keys - The cache keys to retreive.
     * @returns {Promise<object>} A promise that resolves to an object with the resulting key values. 
     */
    async mget(keys = []) {
        if (!this._connected) {
            throw new Error('Redis client not connected.');
        }

        if (!Array.isArray(keys) || !keys.length) {
            return {};
        }

        const values = await this._client.mGet(keys);

        const result = {};

        keys.forEach((key, index) => {
            const value = values[index];

            if (value === null) {
                result[key] = null;
            } else {
                try {
                    result[key] = JSON.parse(value);
                } catch {
                    result[key] = value;
                }
            }
        });

        return result;
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

module.exports = RedisCacheProvider;