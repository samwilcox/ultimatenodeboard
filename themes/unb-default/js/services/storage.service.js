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
UNB.on('ui.init', () => {
    UNB.services = UNB.services || {};
    UNB.services.storage = UNB.services.storage || {};

    /**
     * Check if a key exists in storage.
     * 
     * @param {string} key - The key name.
     * @returns {boolean} `true` if the key exists in storage, `false` if not.
     */
    UNB.services.storage.exists = (key) => {
        return localStorage.getItem(key) !== null;
    };

    /**
     * Get a value from storage by key.
     * 
     * @param {string} key - The key name.
     * @returns {any|null} The value for the key or `null` if the key does not exist.
     */
    UNB.services.storage.get = (key) => {
        return UNB.services.storage.exists(key)
            ? localStorage.getItem(key)
            : null;
    };

    /**
     * Set a value for a key in storage.
     * 
     * @param {string} key - The key name.
     * @param {any|null} value - The value to set for the key. 
     */
    UNB.services.storage.set = (key, value) => {
        localStorage.setItem(key, value);
    };

    /**
     * Get the total size of local storage.
     * 
     * @returns {number} The total size of locale storage.
     */
    UNB.services.storage.size = () => {
        return localStorage.length;
    };

    /**
     * Clear all of local storage.
     */
    UNB.services.storage.clear = () => {
        localStorage.clear();
    };
});