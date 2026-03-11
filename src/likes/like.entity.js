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
 * UNB like
 * 
 * An entity that represents a single like.
 */
class Like {
    /**
     * Create a new instance of `Like'.
     */
    constructor() {
        this._key = null;
        this._contentType = null;
        this._contentKey = null;
        this._likedBy = null;
        this._likedAt = null;
        this._private = false;
    }

    /**
     * Get the key name for this like.
     * 
     * @returns {string} The key name for this like.
     */
    get key() {
        return this._key;
    }

    /**
     * Set the key name for this like.
     */
    set key(key) {
        this._key = key;
    }

    /**
     * Get the content type for this like.
     * 
     * @returns {"topic"|"post"|"comment"} The content type for this like.
     */
    get contentType() {
        return this._contentType;
    }

    /**
     * Set the content type for this like.
     * 
     * @param {"topic"|"post"|"comment"} contentType - The content type for this like. 
     */
    set contentType(contentType) {
        this._contentType = contentType;
    }

    /**
     * Get the content key for this like.
     * 
     * @returns {string} The content key for this like.
     */
    get contentKey() {
        return this._contentKey;
    }

    /**
     * Set the content key for this like.
     * 
     * @param {string} contentKey - The content key for this like.
     */
    set contentKey(contentKey) {
        this._contentKey = contentKey;
    }

    /**
     * Get the member that liked the content.
     * 
     * @returns {string} The key for the member that liked the content.
     */
    get likedBy() {
        return this._likedBy;
    }

    /**
     * Set the member that liked the content.
     * 
     * @param {string} likedBy - The key for the member that liked that content.
     */
    set likedBy(likedBy) {
        this._likedBy = likedBy;
    }

    /**
     * Get the date of when the content was liked.
     * 
     * @returns {Date} The date of when the content was liked.
     */
    get likedAt() {
        return this._likedAt;
    }

    /**
     * Set the date of when the content was liked.
     * 
     * @param {Date} likedAt - The date of when the content was liked.
     */
    set likedAt(likedAt) {
        this._likedAt = likedAt;
    }

    /**
     * Get whether this like is private.
     * 
     * @returns {boolean} `true` if private, `false` if not.
     */
    get private() {
        return this._private;
    }

    /**
     * Set whether this like is private.
     * 
     * @param {boolean} private - `true` if private, `false` if not.
     */
    set private(private) {
        this._private = private;
    }

    /**
     * Convert this entity to a JSON representation.
     * 
     * @returns {JSON} The JSON representation of this entity.
     */
    toJSON() {
        return {
            key: this._key,
            contentType: this._contentType,
            contentKey: this._contentKey,
            likedBy: this._likedBy,
            likedAt: this._likedAt,
            private: this._private
        };
    }
}

module.exports = Like;