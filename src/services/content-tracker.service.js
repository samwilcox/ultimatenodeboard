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

const { cookieExists, getCookie } = require('../cookies/cookies.helper');
const UNB_COOKIE_KEYS = require('../cookies/cookies.keys');
const UNB_CACHE_KEYS = require('../data/cache/cache.keys');
const DataStore = require('../datastore/datastore');
const { normalizeTimestamp } = require('../helpers/normalize.helper');

/**
 * UNB content tracker service
 * 
 * Service for tracking content, such a whether content has been read, etc.
 */
class ContentTrackerService {
    /**
     * Check if content is unread.
     * 
     * @param {object} req - The request object from `Express`.
     * @param {string} contentType - The content type.
     * @param {string} contentKey - The content key.
     * @param {Date} timestamp - The timestamp to compare to.
     * @returns {Promise<boolean>} A promise that resolves to either:
     *                             `true` if the content is currently unread.
     *                             `false` if the content has been read.
     */
    static async isUnread(req, contentType, contentKey, timestamp) {
        const { member, cacheProviderService, db, } = DataStore.get('unb');

        if (member.signedIn) {
            const cacheKey = UNB_CACHE_KEYS.TOPIC_READ_STATUS
                .replace('{memberKey}', member.key)
                .replace('{contentKey}', contentKey);

            return await cacheProviderService.get(
                cacheKey,
                async () => {
                    const tracker = await db.repo.contentTracker.getOneByQuery({
                        contentType,
                        contentKey,
                        trackingType: 'content_unread'
                    });

                    if (!tracker) return true;

                    const lastReadAt = normalizeTimestamp(tracker.metadata.lastReadAt);

                    if (!lastReadAt) return true;

                    if (timestamp < lastReadAt) {
                        return true;
                    } else {
                        return false;
                    }
                }
            );
        } else {
            if (cookieExists(req, UNB_COOKIE_KEYS.CONTENT_READ_TRACKER)) {
                const tracker = getCookie(req, UNB_COOKIE_KEYS.CONTENT_READ_TRACKER);

                if (!tracker) return true;

                const tracked = tracker?.find(t => t.contentType === contentType && t.contentKey === contentKey);

                if (!tracked) return true;

                if (timestamp < tracked.lastReadAt) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return true;
            }
        }
    }
}

module.exports = ContentTrackerService;