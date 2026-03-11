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
 * UNB tag
 * 
 * An entity that represents a single tag.
 */
class Tag {
    /**
     * Create new instance of `Tags`.
     */
    constructor() {
        this._key = null;
        this._name = null;
        this._createdBy = null;
        this._createdAt = null;
        this._updatedAt = null;
    }

    /**
     * Get the key for this tag.
     * 
     * @returns {string} The key for this tag.
     */
    get key() {
        return this._key;
    }

    /**
     * Set the key for this tag.
     * 
     * @param {string} key - The key for this tag.
     */
    set key(key) {
        this._key = key;
    }

    /**
     * Get the name for this tag.
     * 
     * @returns {string} The name for this tag.
     */
    get name() {
        return this._name;
    }

    /**
     * Set the name for this tag.
     * 
     * @param {string} name - The name for this tag.    
     */
    set name(name) {
        this._name = name;
    }

    /**
     * Get the key for the member that created this tag.
     * 
     * @returns {string} The member key for the member that created this tag.
     */
    get createdBy() {
        return this._createdBy;
    }

    /**
     * Set the key for the member that created this tag.
     * 
     * @param {string} createdBy - The member key for the member that created this tag.
     */
    set createdBy(createdBy) {
        this._createdBy = createdBy;
    }

    /**
     * Get the date of when this tag was created.
     * 
     * @returns {Date} The date of when this tag was created.
     */
    get createdAt() {
        return this._createdAt;
    }

    /**
     * Set the date of when this tag was created.
     * 
     * @param {Date} createdAt - The date of when this tag was created.
     */
    set createdAt(createdAt) {
        this._createdAt = createdAt;
    }

    /**
     * Get the date of when this tag was last updated.
     * 
     * @returns {Date} The date of when this tag was last updated.
     */
    get updatedAt() {
        return this._updatedAt;
    }

    /**
     * Set the date of when this tag was last updated.
     * 
     * @param {Date} updatedAt - The date of when this tag was last updated.
     */
    set updatedAt(updatedAt) {
        this._updatedAt = updatedAt;
    }

    /**
     * Convert this entity to a JSON representation.
     * 
     * @returns {JSON} The JSON representation of this entity.
     */
    toJSON() {
        return {
            key: this._key,
            name: this._name,
            createdBy: this._createdBy,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt
        };
    }
}

module.exports = Tag;