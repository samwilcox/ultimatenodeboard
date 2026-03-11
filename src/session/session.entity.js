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
 * UNB session
 * 
 * Entity that represents a single session.
 */
class Session {
    /**
     * Create a new instance of `Session`.
     */
    constructor() {
        this._key = null;
        this._memberKey = null;
        this._expires = null;
        this._lastActivity = null;
        this._location = null;
        this._userAgent = null;
        this._ipAddress = null;
        this._hostname = null;
        this._bot = null;
        this._adminSession = false;
        this._revoked = false;
    }

    /**
     * Get the session key.
     * 
     * @returns {string} The session key.
     */
    get key() {
        return this._key;
    }

    /**
     * Set the session key.
     * 
     * @param {string} key - The session key.
     */
    set key(key) {
        this._key = key;
    }

    /**
     * Get the member key of the member associated with this session.
     * 
     * @returns {string} The member key of the member associated with this session.
     */
    get memberKey() {
        return this._memberKey;
    }

    /**
     * Set the member key of the member associated with this session.
     * 
     * @param {string} memberKey - The member key of the memebr associated with this session.
     */
    set memberKey(memberKey) {
        this._memberKey = memberKey;
    }

    /**
     * Get the expiration for this session.
     * 
     * @returns {Date} The date when this session expires.
     */
    get expires() {
        return this._expires;
    }

    /**
     * Set the expiration for this session.
     * 
     * @param {Date} expires - The date when this session expires.
     */
    set expires(expires) {
        this._expires = expires;
    }

    /**
     * Get the last activity for this session.
     * 
     * @returns {Date} The last activity for this session.
     */
    get lastActivity() {
        return this._lastActivity;
    }

    /**
     * Set the last activity for this session.
     * 
     * @param {Date} lastActivity - The last activity for this session.
     */
    set lastActivity(lastActivity) {
        this._lastActivity = lastActivity;
    }

    /**
     * Get the location of the user in this session.
     * 
     * @returns {string} The location of the user in this session.
     */
    get location() {
        return this._location;
    }

    /**
     * Set the location of the user for this session.
     * 
     * @param {string} location - The location of the user in this session.
     */
    set location(location) {
        this._location = location;
    }

    /**
     * Get the user agent for the user of this session.
     * 
     * @returns {string} The user agent for this user of this session.
     */
    get userAgent() {
        return this._userAgent;
    }

    /**
     * Set the user agent for the user of this session.
     * 
     * @param {string} userAgent - The user agent for this user of this session.
     */
    set userAgent(userAgent) {
        this._userAgent = userAgent;
    }

    /**
     * Get the IP address for the user of this session.
     * 
     * @returns {string} The IP address for the user of this session.
     */
    get ipAddress() {
        return this._ipAddress;
    }

    /**
     * Set the IP address for the user of this session.
     * 
     * @param {string} ipAddress - The IP address for the user of this session.
     */
    set ipAddress(ipAddress) {
        this._ipAddress = ipAddress;
    }

    /**
     * Get the hostname for the user of this session.
     * 
     * @returns {string} The hostname for the user of this session.
     */
    get hostname() {
        return this._hostname;
    }

    /**
     * Set the hostname for the user of this session.
     * 
     * @param {string} hostname - The hostname for the user of this session.
     */
    set hostname(hostname) {
        this._hostname = hostname;
    }

    /**
     * Get the bot data for this session.
     * 
     * @returns {{  
     *      present: boolean,
     *      name: string|null
     * }} The bot data for this session.
     */
    get bot() {
        return this._bot;
    }

    /**
     * Set the bot data for this session.
     * 
     * @param {{
     *      present: boolean,
     *      name: string|null
     * }} bot - THe bot data for this session.q
     */
    set bot(bot) {
        this._bot = bot;
    }

    /**
     * Get whether this session is an administrator session.
     * 
     * @returns {boolean} `true` if an administrator session, `false` if not.
     */
    get adminSession() {
        return this._adminSession;
    }

    /**
     * Set whether this session is an administrator session.
     * 
     * @param {boolean} adminSession - `true` if an administrator session, `false` if not.
     */
    set adminSession(adminSession) {
        this._adminSession = adminSession;
    }

    /**
     * Get whether this session has been revoked.
     * 
     * @returns {boolean} `true` if revoked, `false` if not.
     */
    get revoked() {
        return this._revoked;
    }

    /**
     * Get whether this session has been revoked.
     * 
     * @param {boolean} revoked - `true` if revoked, `false` if not.
     */
    set revoked(revoked) {
        this._revoked = revoked;
    }
}

module.exports = Session;