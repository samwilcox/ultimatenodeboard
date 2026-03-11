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
 * UNB cache keys.
 */
const UNB_CACHE_KEYS = Object.freeze({
    LOCALES: 'unb.locales',
    THEMES: 'unb.themes',
    PERMISSIONS: 'unb.permissions.{permissionKey}',
    LANGUAGES_LIST: 'unb.languages.list',
    THEMES_LIST: 'unb.themes.list',
    TOPIC_REPLIES: 'unb.topic.replies.{topicKey}',
    LIKES: 'unb.likes.{contentType}.{contentKey}',
    PROFILE_PHOTOS: 'unb.member.profile.photo.{type}.{memberKey}',
    TOPIC_READ_STATUS: 'unb.topic.read.status.{contentKey}.{memberKey}',
    TOPIC_LAST_POST: 'unb.topic.last.post.{topicKey}',
    TOPIC_FILTER_TO_POST_MAP: 'unb.topic.filter.to.post.map.{mode}.{topicKey}',
    TOPIC_HAS_ATTACHMENTS: 'unb.topic.has.attachments.{topicKey}',
    MEMBER_GROUPS_EXPANDED: 'unb.member.{memberKey}.groups.expanded',
    PERMISSION_DEFINITION: 'unb.permdef.{permissionKey}',
    PERMISSION_RULES: 'unb.permrules.{permissionKey}.{scopeHash}',
    PERMISSION_RESOLVE_BATCH: 'unb.permres.{memberKey}.{scopeHash}.{keysHash}',
    TOPIC_TOTAL_POSTS: 'unb.topic.total.posts.{topicKey}',
    TOPIC_TOTAL_POSTERS: 'unb.topic.total.posters.{topicKey}',
    TOPIC_TAGS: 'unb.topic.tags.{topicKey}',
    TOTAL_LIKES: 'unb.likes.{contentType}.{contentKey}',
    MEMBER_LIKED: 'unb.member.liked.{contentType}.{contentKey}.{memberKey}'
});

module.exports = UNB_CACHE_KEYS;