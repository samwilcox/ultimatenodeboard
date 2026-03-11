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
 * UNB data store.
 * 
 * Stores data temporarily in memory.
 */
class DataStore {
    static _instance = null;

    /**
     * Get the singleton instance of `DataStore`.
     * 
     * @returns {DataStore} The singleton instance of `DataStore`.
     */
    static getInstance() {
        if (!DataStore._instance) DataStore._instance = new DataStore();
        return DataStore._instance;
    }

    /**
     * Create a new instance of `DataStore`.
     */
    constructor() {
        this._data = new Map();
    }

    /**
     * Set a new key in the data store.
     * 
     * @param {string} key - The name of the key to set.
     * @param {*} value - The value to set for the key.
     */
    set(key, value) {
        this._data.set(key, value);
    }

    /**
     * Get the value for a key from the data store.
     * 
     * @param {string} key - The name of the key to get value for.
     * @returns {*} The value for the key.
     */
    get(key) {
        return this.exists(key) ? this._data.get(key) : null;
    }

    /**
     * Check if a key exists in the data store.
     * 
     * @param {string} key - The name of the key to check for existence.
     * @returns {boolean} `true` if the key exists, `false` if not.
     */
    exists(key) {
        return this._data.has(key);
    }

    /**
     * Get the total size of the data store.
     * 
     * @returns {number} The total items in the data store.
     */
    size() {
        return this._data.size;
    }

    /**
     * Get the entire data store map.
     * 
     * @returns {Map} Get the entire map for the data store.
     */
    all() {
        return { ...this._data };
    }

    /**
     * Clear out the data store.
     */
    clear() {
        this._data = new Map();
    }
};

module.exports = DataStore.getInstance();