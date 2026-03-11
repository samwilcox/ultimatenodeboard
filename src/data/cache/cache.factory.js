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

const UnsupportedError = require("../../errors/unsupported.error");
const MemoryCacheProvider = require("./providers/memory.cache.provider");
const RedisCacheProvider = require("./providers/redis.cache.provider");

/**
 * UNB cache factory.
 * 
 * Factory for building instances of `CacheFactory`.
 */
class CacheFactory {
    static _instance = null;

    /**
     * Create a new instance of the cache provider.
     * 
     * @returns {Promise<CacheProvider>} A promise that resolves to the cache provider instance.
     * @throws {UnsupportedError} If the cache method is unsupported.
     */
    static async create() {
        if (CacheFactory._instance) return CacheFactory._instance;

        switch (process.env.UNB_CACHE_METHOD.toLowerCase()) {
            case 'memory':
                CacheFactory._instance = new MemoryCacheProvider();
                break;

            case 'redis':
                CacheFactory._instance = new RedisCacheProvider();
                await CacheFactory._instance.connectClient();
                break;

            default:
                throw new UnsupportedError(`Cache method '${process.env.UNB_CACHE_METHOD}' is not supported.`, { method: process.env.UNB_CACHE_METHOD });
        }

        return CacheFactory._instance;
    }
}

module.exports = CacheFactory;