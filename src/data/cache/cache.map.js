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

const UNB_CACHE_KEYS = require('./cache.keys');

/**
 * UNB cache map that maps the given cache key to the settings for the
 * specific cache.
 */
const UNB_CACHE_MAP = Object.freeze({
    [UNB_CACHE_KEYS.LOCALES]: {
        enabledKey: 'cache.locales.enabled',
        ttlKey: 'cache.locales.ttl',
        pattern: null
    },

    [UNB_CACHE_KEYS.LANGUAGES_LIST]: {
        enabledKey: 'cache.installed.languages.enabled',
        ttlKey: 'cache.installed.languages.ttl',
        pattern: null
    },

    [UNB_CACHE_KEYS.THEMES_LIST]: {
        enabledKey: 'cache.installed.themes.enabled',
        ttlKey: 'cache.installed.themes.ttl',
        pattern: null
    },

    [UNB_CACHE_KEYS.PERMISSIONS]: {
        enabledKey: 'cache.permissions.enabled',
        ttlKey: 'cache.permissions.ttl',
        pattern: /^unb\.permissions\.[^.]+$/
    },

    [UNB_CACHE_KEYS.TOPIC_REPLIES]: {
        enabledKey: 'cache.topic.replies.enabled',
        ttlKey: 'cache.topic.replies.ttl',
        pattern: /^unb\.topic\.replies\.[^.]+$/
    },

    [UNB_CACHE_KEYS.LIKES]: {
        enabledKey: 'cache.likes.enabled',
        ttlKey: 'cache.likes.ttl',
        pattern: /^unb\.likes\.[^.]+\.[^.]+$/
    },

    [UNB_CACHE_KEYS.PROFILE_PHOTOS]: {
        enabledKey: 'cache.member.profile.photo.enabled',
        ttlKey: 'cache.member.profile.photo.ttl',
        pattern: /^unb\.member\.profile\.photo\.[^.]+\.[^.]+$/
    },

    [UNB_CACHE_KEYS.TOPIC_READ_STATUS]: {
        enabledKey: 'cache.content.read.status.enabled',
        ttlKey: 'cache.content.read.status.ttl',
        pattern: /^unb\.topic\.read\.status\.[^.]+\.[^.]+$/
    },

    [UNB_CACHE_KEYS.TOPIC_LAST_POST]: {
        enabledKey: 'cache.topic.last.post.enabled',
        ttlKey: 'cache.topic.last.post.ttl',
        pattern: /^unb\.topic\.last\.post\.[^.]+$/
    },

    [UNB_CACHE_KEYS.TOPIC_FILTER_TO_POST_MAP]: {
        enabledKey: 'cache.filter.topic.to.post.enabled',
        ttlKey: 'cache.filter.topic.to.post.ttl',
        pattern: /^unb\.topic\.filter\.to\.post\.map\.[^.]+\.[^.]+$/
    },

    [UNB_CACHE_KEYS.TOPIC_HAS_ATTACHMENTS]: {
        enabledKey: 'cache.topic.has.attachments.enabled',
        ttlKey: 'cache.topic.has.attachments.ttl',
        pattern: /^unb\.topic\.has\.attachments\.[^.]+$/
    },

    [UNB_CACHE_KEYS.TOPIC_TOTAL_POSTS]: {
        enabledKey: 'cache.topic.total.posts.enabled',
        ttlKey: 'cache.topic.total.posts.ttl',
        pattern: /^unb\.topic\.total\.posts\.[^.]+$/
    },

    [UNB_CACHE_KEYS.TOPIC_TOTAL_POSTERS]: {
        enabledKey: 'cache.topic.total.posters.enabled',
        ttlKey: 'cache.topic.total.posters.ttl',
        pattern: /^unb\.topic\.total\.posters\.[^.]+$/
    },

    [UNB_CACHE_KEYS.TOPIC_TAGS]: {
        enabledKey: 'cache.topic.tags.enabled',
        ttlKey: 'cache.topic.tags.ttl',
        pattern: /^unb\.topic\.tags\.[^.]+$/
    },

    [UNB_CACHE_KEYS.TOTAL_LIKES]: {
        enabledKey: 'cache.likes.enabled',
        ttlKey: 'cache.likes.enabled',
        pattern: /^unb\.likes\.[^.]+\.[^.]+$/
    },

    [UNB_CACHE_KEYS.MEMBER_LIKED]: {
        enabledKey: 'cache.likes.per.member.enabled',
        ttlKey: 'cache.likes.per.member.ttl',
        pattern: /^unb\.member\.liked\.[^.]+\.[^.]+\.[^.]+$/
    }
});

module.exports = UNB_CACHE_MAP;