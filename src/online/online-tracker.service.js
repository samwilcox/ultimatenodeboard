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

const { getUserIp } = require("../helpers/ip.helper");
const UNB_SETTING_KEYS = require("../settings/settings.keys");
const UNB_PRESENCE_TYPES = require("./presence.types");

/**
 * UNB online tracker service.
 * 
 * Service for tracking the current online users.
 */
class OnlineTrackerService {
    /**
     * Create a new instance of `OnlineTrackerService`.
     * 
     * @param {SettingsService} settingsService - The UNB settings service instance. 
     */
    constructor(settingsService) {
        this._records = new Map();
        this._ttl = 300 * 1000;
        this._settingsService = settingsService;
    }

    /**
     * Load the online tracker service.
     * This basically sets up the TTL.
     */
    async load() {
        this._ttl = await this._settingsService.get(
            UNB_SETTING_KEYS.ONLINE_TRACKER_SERVICE_TTL
        ) * 1000;
    }

    /**
     * Update the member in the online tracker.
     * If they don't exist yet, adds them.
     * If they exist, update the record.
     * 
     * @param {object} req - The request object from `Express`.
     * @param {Member} member - The member entity instance. 
     * @param {string} sessionId - The session identifier.
     */
    touchMember(req, member, sessionId) {
        this._records.set(member.key, {
            type: member.anonymous ? UNB_PRESENCE_TYPES.ANONYMOUS : UNB_PRESENCE_TYPES.MEMBER,
            sessionId,
            lastActivity: new Date(),
            searchBot: { present: false, name: null },
            meta: {
                member,
                currentPath: req.originalUrl,
                userAgent: req.headers['user-agent'],
                ipAddress: getUserIp(req),
                hostname: req.hostname
            }
        });
    }

    /**
     * Update the guest in the online tracker.
     * If they don't exist yet, adds them.
     * If they exist, update the record.
     * 
     * @param {object} req - The request object from `Express`.
     * @param {Member} member - The member entity instance. 
     * @param {string} sessionId - The session identifier.
     */
    touchGuest(req, member, sessionId) {
        this._records.set(sessionId, {
            type: UNB_PRESENCE_TYPES.GUEST,
            sessionId,
            lastActivity: new Date(),
            searchBot: { present: false, name: null },
            meta: {
                member,
                currentPath: req.originalUrl,
                userAgent: req.headers['user-agent'],
                ipAddress: getUserIp(req),
                hostname: req.hostname
            }
        });
    }

    /**
     * Update the search bot in the online tracker.
     * If they don't exist, adds them.
     * If they exist, update the record.
     * 
     * @param {object} req - The request object from `Express`.
     * @param {Member} member - The member entity instance. 
     * @param {string} sessionId - The session identifier. 
     * @param {string} searchBotName - The search bot name. 
     */
    touchSearchBot(req, member, sessionId, searchBotName) {
        this._records.set(sessionId, {
            type: UNB_PRESENCE_TYPES.SEARCH_BOT,
            sessionId,
            lastActivity: new Date(),
            searchBot: { present: true, name: searchBotName },
            meta: {
                member,
                currentPath: req.originalUrl,
                userAgent: req.headers['user-agent'],
                ipAddress: getUserIp(req),
                hostname: req.hostname
            }
        });
    }

    /**
     * Check if a member is currently online.
     * 
     * @param {string} memberKey - The member key name.
     * @returns {boolean} `true` if the member is online, `false` if not.
     */
    isOnline(memberKey) {
        const entry = this._records.get(memberKey);
        if (!entry) return false;

        return (Date.now() - entry.lastActivity) < this._ttl;
    }

    /**
     * Remove a member from the online tracker.
     * 
     * @param {string} memberKey - The member key name.
     */
    removeMember(memberKey) {
        this._records.delete(memberKey);
    }

    /**
     * Remove either a guest or a search bot user from the online tracker.
     * 
     * @param {string} sessionId - The session identifier.
     */
    remove(sessionId) {
        this._records.delete(sessionId);
    }

    /**
     * Perform garbage collection on expired user records.
     */
    garbageCollection() {
        const now = Date().now();

        for (const [key, entry] of this._records) {
            if ((now - entry.lastActivity) <= this._ttl) {
                this._records.delete(key);
            }
        }
    }
}

module.exports = OnlineTrackerService;