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
 * UNB group
 * 
 * An entity that represents a single group.
 */
class Group {
    /**
     * Create a new instance of `Group`.
     */
    constructor() {
        this._key = null;
        this._name = null;
        this._pluralName = null;
        this._description = null;
        this._sortOrder = null;
        this._system = false;
        this._inherits = null;
        this._color = null;
        this._icon = null;
    }

    /**
     * Get the key for this group.
     * 
     * @returns {string} The key name for this group.
     */
    get key() {
        return this._key;
    }

    /**
     * Set the key for this group.
     * 
     * @param {string} key - The key name for this group.
     */
    set key(key) {
        this._key = key;
    }

    /**
     * Get the name of this group.
     * 
     * @returns {string} The name of this group.
     */
    get name() {
        return this._name;
    }

    /**
     * Set the name of this group.
     * 
     * @param {string} name - The name of this group.
     */
    set name(name) {
        this._name = name;
    }

    /**
     * Get the plural name for this group.
     * 
     * @returns {string} The plural name of this group.
     */
    get pluralName() {
        return this._pluralName;
    }

    /**
     * Set the plural name for this group.
     * 
     * @param {string} pluralName - The plural name of this group.
     */
    set pluralName(pluralName) {
        this._pluralName = pluralName;
    }

    /**
     * Get the description of this group.
     * 
     * @returns {string} The description of this group.
     */
    get description() {
        return this._description;
    }

    /**
     * Set the description of this group.
     * 
     * @param {string} description - The description of this group.
     */
    set description(description) {
        this._description = description;
    }

    /**
     * Get the sort order for this group.
     * 
     * @returns {number} The sort number for this group.
     */
    get sortOrder() {
        return this._sortOrder;
    }

    /**
     * Set the sort order for this group.
     * 
     * @param {number} sortOrder - The sort number for this group.
     */
    set sortOrder(sortOrder) {
        this._sortOrder = sortOrder;
    }

    /**
     * Get whether this group is a "system" group (cannot be deleted).
     * 
     * @returns {boolean} `true` if a system group, `false` if not.
     */
    get system() {
        return this._system;
    }

    /**
     * Set whether this group is a "system" group (cannot be deleted).
     * 
     * @param {boolean} system - `true` if a system group, `false` if not.
     */
    set system(system) {
        this._system = system;
    }

    /**
     * Get the inherits for this group.
     * 
     * @returns {string[]|null} - The inherits collection for this group.
     */
    get inherits() {
        return this._inherits;
    }

    /**
     * Set the inherits for this group.
     * 
     * @param {string[]|null} inherits - The inherits collection for this group.
     */
    set inherits(inherits) {
        this._inherits = inherits;
    }

    /**
     * Get the group color data.
     * 
     * @returns {{
     *      light: {
     *          normal: {
     *              text: string,
     *              background: string
     *          },
     *          hover: {
     *              text: string,
     *              background: string
     *          }
     *      },
     *      dark: {
     *          normal: {
     *              text: string,
     *              background: string
     *          },
     *          hover: {
     *              text: string,
     *              background: string
     *          }
     *      }
     * }} The group color data object.
     */
    get color() {
        return this._color;
    }

    /**
     * Set the group color data.
     * 
     * @param {{
     *      light: {
     *          normal: {
     *              text: string,
     *              background: string
     *          },
     *          hover: {
     *              text: string,
     *              background: string
     *          }
     *      },
     *      dark: {
     *          normal: {
     *              text: string,
     *              background: string
     *          },
     *          hover: {
     *              text: string,
     *              background: string
     *          }
     *      }
     * }} color - The group color data object. 
     */
    set color(color) {
        this._color = color;
    }

    /**
     * Set the icon for this group.
     * 
     * @returns {string|null} The FontAwesome icon for this group or `null`
     *                        if no icon is set.
     */
    get icon() {
        return this._icon;
    }

    /**
     * Set the icon for this group.
     * 
     * @param {string|null} icon - The FontAwesome icon for this group or
     *                             `null if no icon is set.
     */
    set icon(icon) {
        this._icon = icon;
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
            pluralName: this._pluralName,
            description: this._description,
            sortOrder: this._sortOrder,
            system: this._system,
            inherits: this._inherits,
            color: this._color,
            icon: this._icon
        };
    }
}

module.exports = Group;