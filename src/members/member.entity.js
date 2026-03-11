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
 * UNB entity that represents a single member.
 */
class Member {
    /**
     * Create a new instance of `Member`.
     */
    constructor() {
        this._key = null;
        this._username = null;
        this._displayName = null;
        this._useDisplayName = false;
        this._emailAddress = null;
        this._locale = null;
        this._theme = null;
        this._themeMode = null;
        this._settings = {};
        this._configs = {};
        this._signedIn = false;
        this._primaryGroup = null;
        this._secondaryGroups = null;
        this._groups = null;
        this._photo = {};
        this._lockout = {};
        this._lastVisit = null;
        this._anonymous = false;
    }

    /**
     * Get the key for this member.
     * 
     * @returns {string} The key for this member.
     */
    get key() {
        return this._key;
    }

    /**
     * Set the key for this member.
     * 
     * @param {string} key - The key for this member.
     */
    set key(key) {
        this._key = key;
    }

    /**
     * Get the username for this member.
     * 
     * @returns {string} The username for this member.
     */
    get username() {
        return this._username;
    }

    /**
     * Set the username for this member.
     * 
     * @param {string} username  - The username for this member.
     */
    set username(username) {
        this._username = username;
    }

    /**
     * Get the display name for this member.
     * 
     * @returns {string} The display name for this member.
     */
    get displayName() {
        return this._displayName;
    }

    /**
     * Set the display name for this member.
     * 
     * @param {string} displayName - The display name for this member.
     */
    set displayName(displayName) {
        this._displayName = displayName;
    }

    /**
     * Get whether this member wants to use their display name.
     * 
     * @returns {boolean} `true` if member wants to use their display name, `false` to use their username.
     */
    get useDisplayName() {
        return this._useDisplayName;
    }

    /**
     * Set whether this member wants to use their display name.
     * 
     * @param {boolean} useDisplayName - `true` if member wants to use their display name, `false` to use their username.
     */
    set useDisplayName(useDisplayName) {
        this._useDisplayName = useDisplayName;
    }

    /**
     * Get the email address for this member.
     * 
     * @returns {string} The email address for this member.
     */
    get emailAddress() {
        return this._emailAddress;
    }

    /**
     * Set the email address for this member.
     * 
     * @param {string} emailAddress - The email address for this member.
     */
    set emailAddress(emailAddress) {
        this._emailAddress = emailAddress;
    }

    /**
     * Get the default locale for this member.
     * 
     * @returns {string} The default locale for this member.
     */
    get locale() {
        return this._locale;
    }

    /**
     * Set the default locale for this member.
     * 
     * @param {string} locale  The default locale for this member.
     */
    set locale(locale) {
        this._locale = locale;
    }

    /**
     * Get the default theme for this member.
     * 
     * @returns {string} The default theme for this member.
     */
    get theme() {
        return this._theme;
    }

    /**
     * Set the default theme for this member.
     * 
     * @param {string} theme - The default theme for this member.
     */
    set theme(theme) {
        this._theme = theme;
    }

    /**
     * Get the theme mode for this member.
     * 
     * @returns {"light"|"dark"} The theme mode (either `light` or `dark`).
     */
    get themeMode() {
        return this._themeMode;
    }

    /**
     * Set the theme mode for this member.
     * 
     * @param {"light"|"dark"} themeMode - The theme mode (either `light` or `dark`). 
     */
    set themeMode(themeMode) {
        this._themeMode = themeMode;
    }

    /**
     * Get the member settings data object.
     * 
     * @returns {{
     *      dateTime: {
     *          timeZone: string,
     *          format: {
     *              date: string,
     *              time: string,
     *              full: string
     *          },
     *          timeAgo: boolean
     *      },
     *      pagination: {
     *          limit: {
     *              topics: number
     *          }
     *      },
     *      topics: {
     *          preview: boolean
     *      },
     *      editor: {
     *          toolbar: {
     *              bold: boolean,
     *              italic: boolean,
     *              underline: boolean,
     *              font: boolean,
     *              aligncenter: boolean,
     *              alignjustify: boolean,
     *              alignleft: boolean,
     *              alignright: boolean,
     *              code: boolean,
     *              color: boolean,
     *              emoji: boolean,
     *              gif: boolean,
     *              horizontalrule: boolean,
     *              hyperlink: boolean,
     *              image: boolean,
     *              indent: boolean,
     *              media: boolean,
     *              orderedlist: boolean,
     *              unorderedlist: boolean,
     *              outdent: boolean,
     *              quote: boolean,
     *              redo: boolean,
     *              undo: boolean,
     *              size: boolean,
     *              spoiler: boolean,
     *              strikethrough: boolean,
     *              subscript: boolean,
     *              superscript: boolean
     *          },
     *          defaultFont: string,
     *          defaultFontSize: number,
     *          defaultFontColor: string,
     *      sidebar: {
     *          posts: {
     *              enabled: boolean,
     *              position: ("left"|"right")
     *          }
     *      }
     * }} The member's settings data object.
     */
    get settings() {
        return this._settings;
    }

    /**
     * Set the member settings data object.
     * 
     * @param {{
     *      dateTime: {
     *          timeZone: string,
     *          format: {
     *              date: string,
     *              time: string,
     *              full: string
     *          },
     *          timeAgo: boolean
     *      },
     *      pagination: {
     *          limit: {
     *              topics: number
     *          }
     *      },
     *      topics: {
     *          preview: boolean
     *      },
     *      editor: {
     *          toolbar: {
     *              bold: boolean,
     *              italic: boolean,
     *              underline: boolean,
     *              font: boolean,
     *              aligncenter: boolean,
     *              alignjustify: boolean,
     *              alignleft: boolean,
     *              alignright: boolean,
     *              code: boolean,
     *              color: boolean,
     *              emoji: boolean,
     *              gif: boolean,
     *              horizontalrule: boolean,
     *              hyperlink: boolean,
     *              image: boolean,
     *              indent: boolean,
     *              media: boolean,
     *              orderedlist: boolean,
     *              unorderedlist: boolean,
     *              outdent: boolean,
     *              quote: boolean,
     *              redo: boolean,
     *              undo: boolean,
     *              size: boolean,
     *              spoiler: boolean,
     *              strikethrough: boolean,
     *              subscript: boolean,
     *              superscript: boolean
     *          },
     *          defaultFont: string,
     *          defaultFontSize: number,
     *          defaultFontColor: string,
     *      sidebar: {
     *          posts: {
     *              enabled: boolean,
     *              position: ("left"|"right")
     *          }
     *      }
     * }} settings - The member's settings data object.
     */
    set settings(settings) {
        this._settings = settings;
    }

    /**
     * Get the misc configurations object.
     * 
     * @returns {object} The misc configurations object.
     */
    get configs() {
        return this._configs;
    }

    /**
     * Set the misc configurations object.
     * 
     * @param {object} configs - The misc configurations object. 
     */
    set configs(configs) {
        this._configs = configs;
    }

    /**
     * Get whether this member is signed in.
     * 
     * @returns {boolean} `true` if the user is signed in, `false` if not signed in.
     */
    get signedIn() {
        return this._signedIn;
    }

    /**
     * Set whether this member is signed in.
     * 
     * @param {boolean} signedIn - `true` if the user is signed in, `false` if not signed in. 
     */
    set signedIn(signedIn) {
        this._signedIn = signedIn;
    }

    /**
     * Get the member's primary group.
     * 
     * @returns {Group} The member's primary group.
     */
    get primaryGroup() {
        return this._primaryGroup;
    }

    /**
     * Set the member's primary group.
     * 
     * @param {Group} primaryGroup - The member's primary group. 
     */
    set primaryGroup(primaryGroup) {
        this._primaryGroup = primaryGroup;
    }

    /**
     * Get the member's secondary groups.
     * 
     * @returns {Group[]|null} The member's secondary groups or `null` if no secondary groups.
     */
    get secondaryGroups() {
        return this._secondaryGroups;
    }

    /**
     * Set the member's secondary groups.
     * 
     * @param {Group[]|null} secondaryGroups - The member's secondary groups or `null` if no secondary groups.
     */
    set secondaryGroups(secondaryGroups) {
        this._secondaryGroups = secondaryGroups;
    }

    /**
     * Get all of the member's groups.
     * 
     * @returns {Group[]} An array of groups this member is a member of.
     */
    get groups() {
        return this._groups;
    }

    /**
     * Set all the member's groups.
     * 
     * @param {Group[]} groups - An array of groups this member is a member of.
     */
    set groups(groups) {
        this._groups = groups;
    }

    /**
     * Get the member's photo data object.
     * 
     * @returns {{
     *      type: "uploaded"|"avatar"|"linked"|"none",
     *      key: string
     * }} The member's photo data object.
     */
    get photo() {
        return this._photo;
    }

    /**
     * Set the member's photo data object.
     * 
     * @param {{
     *      type: "uploaded"|"avatar"|"linked"|"none",
     *      key: string
     * }} photo - The member's photo data object.
     */
    set photo(photo) {
        this._photo = photo;
    }

    /**
     * Get the member's lockout data object.
     * 
     * @returns {{
     *      locked: boolean,
     *      attempts: number,
     *      expires: Date|null
     * }} The member's lockout data object.
     */
    get lockout() {
        return this._lockout;
    }

    /**
     * Set the member's lockout data object.
     * 
     * @param {{
     *      locked: boolean,
     *      attempts: number,
     *      expires: Date|null
     * }} lockout - The member's lockout data object. 
     */
    set lockout(lockout) {
        this._lockout = lockout;
    }

    /**
     * Get the last visit for this member.
     * 
     * @returns {Date|null} The member's last visit or `null`.
     */
    get lastVisit() {
        return this._lastVisit;
    }

    /**
     * Set the last visit for this member.
     * 
     * @param {Date|null} lastVisit - The member's last visit or `null`.
     */
    set lastVisit(lastVisit) {
        this._lastVisit = lastVisit;
    }

    /**
     * Get whether the member wants to be shown as anonymous.
     * 
     * @returns {boolean} `true` to be anonymous, `false` to not be anonymous.
     */
    get anonymous() {
        return this._anonymous;
    }

    /**
     * Set whether the member wants to be shown as anonymous.
     * 
     * @param {boolean} anonymous - `true` to be anonymous, `false` to not be anonymous.
     */
    set anonymous(anonymous) {
        this._anonymous = anonymous;
    }

    /**
     * Convert this entity to a JSON representation.
     * 
     * @returns {JSON} The JSON representation for this entity.
     */
    toJSON() {
        return {
            key: this._key,
            username: this._username,
            displayName: this._displayName,
            useDisplayName: this._useDisplayName,
            emailAddress: this._emailAddress,
            locale: this._locale,
            theme: this._theme,
            themeMode: this._themeMode,
            settings: this._settings,
            configs: this._configs,
            signedIn: this._signedIn,
            primaryGroup: this._primaryGroup,
            secondaryGroups: this._secondaryGroups,
            groups: this._groups,
            photo: this._photo,
            lockout: this._lockout,
            lastVisit: this._lastVisit,
            anonymous: this._anonymous
        };
    }
}

module.exports = Member;