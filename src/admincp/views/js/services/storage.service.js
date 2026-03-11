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

/**
 * UNB storage service.
 */
UNB_ADMINCP.on('ui.init', () => {
    UNB_ADMINCP.services = UNB_ADMINCP.services || {};
    UNB_ADMINCP.services.storage = UNB_ADMINCP.services.storage || {};

    /**
     * Check if a key exists in storage.
     * 
     * @param {string} key - The key name.
     * @returns {boolean} `true` if the key exists in storage, `false` if not.
     */
    UNB_ADMINCP.services.storage.exists = (key) => {
        return localStorage.getItem(key) !== null;
    };

    /**
     * Set a value for a key in storage.
     * 
     * @param {string} key - The key name.
     * @param {any} value - The value for the key.
     */
    UNB_ADMINCP.services.storage.set = (key, value) => {
        localStorage.setItem(key, value);
    };

    /**
     * Get a value for a key from storage.
     * 
     * @param {string} key - The key name to get value for.
     * @returns {any|null} The value for the key given or `null` if the key does not exist.
     */
    UNB_ADMINCP.services.storage.get = (key) => {
        return UNB_ADMINCP.services.storage.exists(key)
            ? localStorage.getItem(key)
            : null;
    };

    /**
     * Get the total number of keys.
     * 
     * @returns {number} The total number of keys in storage.
     */
    UNB_ADMINCP.services.storage.size = () => {
        return localStorage.length;
    };

    /**
     * Clear out the storage.
     */
    UNB_ADMINCP.services.storage.clear = () => {
        localStorage.clear();
    };
});