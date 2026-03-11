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
 * UNB forum
 * 
 * An entity that represents a single forum.
 */
class Forum {
    /**
     * Create a new instance of `Forum`.
     */
    constructor() {
        this._key = null;
        this._title = null;
        this._description = null;
        this._sortOrder = null;
        this._visible = false;
        this._color = {};
        this._icon = null;
        this._archived = false;
        this._parentKey = null;
        this._displayChildForums = false;
        this._childForums = null;
        this._forumType = null;
        this._hotThreshold = null;
    }

    /**
     * Get the forum key name.
     * 
     * @returns {string} The forum key name.
     */
    get key() {
        return this._key;
    }

    /**
     * Set the forum key name.
     * 
     * @param {string} key - The forum key name.
     */
    set key(key) {
        this._key = key;
    }

    /**
     * Get the forum title.
     * 
     * @returns {string} The forum title.
     */
    get title() {
        return this._title;
    }

    /**
     * Set the forum title.
     * 
     * @param {string} title - The forum title.
     */
    set title(title) {
        this._title = title;
    }

    /**
     * Get the forum description.
     * 
     * @returns {string} The forum description.
     */
    get description() {
        return this._description;
    }

    /**
     * Set the forum description.
     * 
     * @param {string} description - The forum description.
     */
    set description(description) {
        this._description = description;
    }

    /**
     * Get the sort order for this forum.
     * 
     * @returns {number} The sort order for this forum.
     */
    get sortOrder() {
        return this._sortOrder;
    }

    /**
     * Set the sort order for this forum.
     * 
     * @param {number} sortOrder - The sort order for this forum.
     */
    set sortOrder(sortOrder) {
        this._sortOrder = sortOrder;
    }

    /**
     * Get whether this forum is visible.
     * 
     * @returns {boolean} `true` if the forum is visible, `false` if forum is hidden.
     */
    get visible() {
        return this._visible;
    }

    /**
     * Set whether this forum is visible.
     * 
     * @param {boolean} visible - `true` if the forum is visible, `false` if forum is hidden.
     */
    set visible(visible) {
        this._visible = visible;
    }

    /**
     * Get the color data object for this forum.
     * 
     * @returns {object} The color data object for this forum.
     */
    get color() {
        return this._color;
    }

    /**
     * Set the color data object for this forum.
     * 
     * @param {object} color - The color data object for this forum. 
     */
    set color(color) {
        this._color = color;
    }

    /**
     * Get the icon for this forum.
     * 
     * @returns {string} The icon for this forum.
     */
    get icon() {
        return this._icon;
    }

    /**
     * Set the icon for this forum.
     * 
     * @param {string} icon - The icon for this forum.
     */
    set icon(icon) {
        this._icon = icon;
    }

    /**
     * Get whether this forum is archived.
     * 
     * @returns {boolean} `true` if this forum is archived, `false` if not archived.
     */
    get archived() {
        return this._archived;
    }

    /**
     * Set whether this forum is archived.
     * 
     * @param {boolean} archived - `true` if this forum is archived, `false` if not archived.
     */
    set archived(archived) {
        this._archived = archived;
    }

    /**
     * Get the key for the parent for this forum (if has a parent).
     * 
     * @returns {string|null} The key for the parent forum or `null` if no parent.
     */
    get parentKey() {
        return this._parentKey;
    }

    /**
     * Set the key for the parent for this forum (if has a parent).
     * 
     * @param {string|null} parentKey - The key for the parent forum or `null` if no parent.
     */
    set parentKey(parentKey) {
        this._parentKey = parentKey;
    }

    /**
     * Get whether to display the child forums for this forum (if any).
     * 
     * @returns {boolean} `true` to display child forums, `false` not to.
     */
    get displayChildForums() {
        return this._displayChildForums;
    }

    /**
     * Set whether to display the child forums for this forum (if any).
     * 
     * @param {boolean} displayChildForums - `true` to display child forums, `false` not to.
     */
    set displayChildForums(displayChildForums) {
        this._displayChildForums = displayChildForums;
    }

    /**
     * Get the list of child forums for this forum.
     * 
     * @returns {string[]|null} The list of child forums for this forum or `null` if no child forums.
     */
    get childForums() {
        return this._childForums;
    }

    /**
     * Set the list of child forums for this forum.
     * 
     * @param {string[]|null} childForums - The list of child forums for this forum or `null` if no child forums.
     */
    set childForums(childForums) {
        this._childForums = childForums;
    }

    /**
     * Get the forum type of this forum.
     * 
     * @returns {"normal"|"qa"} - The forum type of this forum.
     */
    get forumType() {
        return this._forumType;
    }

    /**
     * Set the forum type of this forum.
     * 
     * @param {"normal"|"qa"} forumType - The forum type of this forum. 
     */
    set forumType(forumType) {
        this._forumType = forumType;
    }

    /**
     * Get the total replies for a topic to be considered hot.
     * 
     * @returns {number} The total replies for a topic to be considered hot.
     */
    get hotThreshold() {
        return this._hotThreshold;
    }

    /**
     * Set the total replies for a topic to be considered hot.
     */
    set hotThreshold(hotThreshold) {
        this._hotThreshold = hotThreshold;
    }

    /**
     * Convert this entity to a JSON representation.
     * 
     * @returns {JSON} The JSON representation of this entity.
     */
    toJSON() {
        return {
            key: this._key,
            title: this._title,
            description: this._description,
            sortOrder: this._sortOrder,
            visible: this._visible,
            color: this._color,
            icon: this._icon,
            archived: this._archived,
            parentKey: this._parentKey,
            displayChildForums: this._displayChildForums,
            childForums: this._childForums,
            forumType: this._forumType,
            hotThreshold: this._hotThreshold
        };
    }
}

module.exports = Forum;