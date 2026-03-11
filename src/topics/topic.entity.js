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
 * UNB topic
 * 
 * An entity that represents a single topic.
 */
class Topic {
    /**
     * Create a new instance of `Topic`.
     */
    constructor() {
        this._key = null;
        this._forumKey = null;
        this._title = null;
        this._createdBy = null;
        this._createdAt = null;
        this._tags = null;
        this._totalViews = null;
        this._locked = false;
        this._visible = false;
        this._solution = {};
        this._pinned = false;
        this._pollKey = null;
    }

    /**
     * Get the topic key name.
     * 
     * @returns {string} The topic key name.
     */
    get key() {
        return this._key;
    }

    /**
     * Set the topic key name.
     * 
     * @param {string} key - The topic key name. 
     */
    set key(key) {
        this._key = key;
    }

    /**
     * Get the forum key name this topic belongs to.
     * 
     * @returns {string} The forum key name this topic belongs to.
     */
    get forumKey() {
        return this._forumKey;
    }

    /**
     * Set the forum key name this topic belongs to.
     * 
     * @param {string} forumKey - The forum key name this topic belongs to.
     */
    set forumKey(forumKey) {
        this._forumKey = forumKey;
    }

    /**
     * Get the title of this topic.
     * 
     * @returns {string} The title of this topic.
     */
    get title() {
        return this._title;
    }

    /**
     * Set the title of this topic.
     * 
     * @param {string} title - The title of this topic.
     */
    set title(title) {
        this._title = title;
    }

    /**
     * Get the member that created this topic.
     * 
     * @returns {Member} The member who created this topic.
     */
    get createdBy() {
        return this._createdBy;
    }

    /**
     * Set the member that created this topic.
     * 
     * @param {Member} createdBy - The member who created this topic. 
     */
    set createdBy(createdBy) {
        this._createdBy = createdBy;
    }

    /**
     * Get the date when this topic was created.
     * 
     * @returns {Date} The date of when this topic was created.
     */
    get createdAt() {
        return this._createdAt;
    }

    /**
     * Set the date when this topic was created.
     * 
     * @param {Date} createdAt - The date of when this topic was created.
     */
    set createdAt(createdAt) {
        this._createdAt = createdAt;
    }

    /**
     * Get the tags associated with this topic.
     * 
     * @returns {string[]|null} The tags associated with this topic.
     */
    get tags() {
        return this._tags;
    }

    /**
     * Set the tags associated with this topic.
     * 
     * @param {string[]|null} tags - The tags associated with this topic.
     */
    set tags(tags) {
        this._tags = tags;
    }

    /**
     * Get the total views for this topic.
     * 
     * @returns {number} The total views for this topic.
     */
    get totalViews() {
        return this._totalViews;
    }

    /**
     * Set the total views for this topic.
     * 
     * @param {number} totalViews - The total views for this topic.
     */
    set totalViews(totalViews) {
        this._totalViews = totalViews;
    }

    /**
     * Get whether this topic is locked.
     * 
     * @returns {boolean} `true` if this topic is locked, `false` if unlocked.
     */
    get locked() {
        return this._locked;
    }

    /**
     * Set whether this topic is locked.
     * 
     * @param {boolean} locked - `true` if this topic is locked, `false` if unlocked.
     */
    set locked(locked) {
        this._locked = locked;
    }

    /**
     * Get whether this topic is visible.
     * 
     * @returns {boolean} `true` if this topic is visible, `false` if not.
     */
    get visible() {
        return this._visible;
    }

    /**
     * Set whether this topic is visible.
     * 
     * @param {boolean} visible - `true` if this topic is visible, `false` if not.
     */
    set visible(visible) {
        this._visible = visible;
    }

    /**
     * Get the solution data for this topic.
     * 
     * @returns {{
     *      solution: boolean,
     *      postKey: string|null,
     * }} The solution data for this topic.
     */
    get solution() {
        return this._solution;
    }

    /**
     * Set the solution data for this topic.
     * 
     * @param {{
     *      solution: boolean,
     *      postKey: string|null
     * }} solution - The solution data for this topic.
     */
    set solution(solution) {
        this._solution = solution;
    }

    /**
     * Get whether this topic has been pinned.
     * 
     * @returns {boolean} `true` if pinned, `false` if not.
     */
    get pinned() {
        return this._pinned;
    }

    /**
     * Set whether this topic has been pinned.
     * 
     * @param {boolean} pinned - `true` if pinned, `false` if not.
     */
    set pinned(pinned) {
        this._pinned = pinned;
    }

    /**
     * Get the poll key name associated with this topic.
     * 
     * @returns {string|null} The poll key name or `null` if this topic is not associated
     *                        with any polls.
     */ 
    get pollKey() {
        return this._pollKey;
    }

    /**
     * Set the poll key name associated with this topic.
     * 
     * @param {string|null} pollKey - The poll key name or `null` if this topic is not
     *                                associated with any polls.
     */
    set pollKey(pollKey) {
        this._pollKey = pollKey;
    }

    /**
     * Convert this entity to a JSON representation.
     * 
     * @returns {JSON} The JSON representation of this entity.
     */
    toJSON() {
        return {
            key: this._key,
            forumKey: this._forumKey,
            title: this._title,
            createdBy: this._createdBy,
            createdAt: this._createdAt,
            tags: this._tags,
            totalViews: this._totalViews,
            locked: this._locked,
            visible: this._visible,
            solution: this._solution,
            pinned: this._pinned,
            pollKey: this._pollKey
        };
    }
}

module.exports = Topic;