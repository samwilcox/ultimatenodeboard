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
 * UNB application setting keys.
 */
const UNB_SETTING_KEYS = Object.freeze({
    COMMUNITY_TITLE: 'community.title',
    FILE_SIZE_UNITS: 'file.size.units',
    LOCALE_DEFAULT: 'locale.default',
    THEME_DEFAULT: 'theme.default',
    CACHE_LOCALES_ENABLED: 'cache.locales.enabled',
    CACHE_LOCALES_TTL: 'cache.locales.ttl',
    CACHE_THEMES_ENABLED: 'cache.themes.enabled',
    CACHE_THEMES_TTL: 'cache.themes.ttl',
    COMMUNITY_LOGO_TYPE: 'community.logo.type',
    COMMUNITY_LOGO_LIGHT: 'community.logo.light',
    COMMUNITY_LOGO_DARK: 'community.logo.dark',
    THEME_DEFAULT_MODE: 'theme.default.mode',
    CACHE_PERMISSIONS_ENABLED: 'cache.permissions.enabled',
    CACHE_PERMISSIONS_TTL: 'cache.permissions.ttl',
    ACCOUNT_SIGNUP_ENABLED: 'account.signup.enabled',
    CACHE_INSTALLED_LANGUAGES_ENABLED: 'cache.installed.languages.enabled',
    CACHE_INSTALLED_LANGUAGES_TTL: 'cache.installed.languages.ttl',
    CACHE_INSTALLED_THEMES_ENABLED: 'cache.installed.themes.enabled',
    CACHE_INSTALLED_THEMES_TTL: 'cache.installed.themes.ttl',
    CACHE_TOPIC_REPLIES_ENABLED: 'cache.topic.replies.enabled',
    CACHE_TOPIC_REPLIES_TTL: 'cache.topic.replies.ttl',
    CACHE_LIKES_ENABLED: 'cache.topic.enabled',
    CACHE_LIKES_TTL: 'cache.likes.ttl',
    DATETIME_TIMEAGO_MAX_DAYS: 'datetime.timeago.max.days',
    DATETIME_DEFAULT: 'datetime.default',
    MEMBER_ALLOW_DISPLAY_NAME: 'member.allow.display.name',
    CACHE_MEMBER_PROFILE_PHOTO_ENABLED: 'cache.member.profile.photo.enabled',
    CACHE_MEMBER_PROFILE_PHOTO_TTL: 'cache.member.profile.photo.ttl',
    UPLOAD_BASE_PATH: 'upload.base.path',
    UPLOAD_PROFILE_PHOTOS_PATH: 'upload.profile.photos.path',
    PHOTO_NO_PHOTO_COLORS: 'photo.no.photo.colors',
    CACHE_CONTENT_READ_STATUS_ENABLED: 'cache.content.read.status.enabled',
    CACHE_CONTENT_READ_STATUS_TTL: 'cache.content.read.status.ttl',
    CACHE_TOPIC_LAST_POST_ENABLED: 'cache.topic.last.post.enabled',
    CACHE_TOPIC_LAST_POST_TTL: 'cache.topic.last.post.ttl',
    PAGINATION_DEFAULT: 'pagination.default',
    CACHE_FILTER_TOPIC_TO_POST_ENABLED: 'cache.filter.topic.to.post.enabled',
    CACHE_FILTER_TOPIC_TO_POST_TTL: 'cache.filter.topic.to.post.ttl',
    CACHE_TOPIC_HAS_ATTACHMENTS_ENABLED: 'cache.topic.has.attachments.enabled',
    CACHE_TOPIC_HAS_ATTACHMENTS_TTL: 'cache.topic.has.attachments.ttl',
    TOPICS_LIST_PREVIEW_ENABLED: 'topics.list.preview.enabled',
    AUTH_ALLOW_USERNAME: 'auth.allow.username',
    AUTH_REMEMBER_ME_ENABLED: 'auth.remember.me.enabled',
    SECURITY_CSRF_ENABLED: 'security.csrf.enabled',
    SECURITY_CSRF_CHECK_ORIGIN_ENABLED: 'security.csrf.check.origin.enabled',
    SECURITY_CSRF_COOKIE_NAME: 'security.csrf.cookie.name',
    SECURITY_CSRF_TOKEN_TTL_SECONDS: 'security.csrf.token.ttl.seconds',
    SECURITY_CSRF_SAFE_METHODS: 'security.csrf.safe.methods',
    SECURITY_ACCOUNT_LOCKOUT_ENABLED: 'security.account.lockout.enabled',
    SECURITY_ACCOUNT_LOCKOUT_MAX_FAILED_ATTEMPTS: 'security.account.lockout.max.failed.attempts',
    SECURITY_ACCOUNT_LOCKOUT_ALLOW_EXPIRE: 'security.account.lockout.allow.expire',
    SECURITY_ACCOUNT_LOCKOUT_EXPIRATION_MINUTES: 'security.account.lockout.expiration.minutes',
    SECURITY_PASSWORD_SALT_ROUNDS: 'security.password.salt.rounds',
    SESSION_TTL_SECONDS: 'session.ttl.seconds',
    SESSION_IP_MATCH: 'session.ip.match',
    SEARCH_BOT_AGENT_PATTERNS: 'search.bot.agent.patterns',
    SESSION_REMEMBER_TTL_SECONDS: 'session.remember.ttl.seconds',
    EDITOR_FONTS: 'editor.fonts',
    EDITOR_FONT_DEFAULT: 'editor.font.default',
    EDITOR_FONT_SIZES: 'editor.font.sizes',
    EDITOR_FONT_SIZE_DEFAULT: 'editor.font.size.default',
    EDITOR_FONT_COLORS: 'editor.font.colors',
    EDITOR_FONT_COLOR_DEFAULT: 'editor.font.color.default',
    EDITOR_CODE_LANGUAGES: 'editor.code.languages',
    EDITOR_GIPHY_API_KEY: 'editor.giphy.api.key',
    EDITOR_GIPHY_LIMIT: 'editor.giphy.limit',
    EDITOR_TOOLBAR_DEFAULT: 'editor.toolbar.default',
    SIDEBAR_DEFAULTS: 'sidebar.defaults',
    CACHE_TOPIC_TOTAL_POSTS_ENABLED: 'cache.topic.total.posts.enabled',
    CACHE_TOPIC_TOTAL_POSTS_TTL: 'cache.topic.total.posts.ttl',
    CACHE_TOPIC_TOTAL_POSTERS_ENABLED: 'cache.topic.total.posters.enabled',
    CACHE_TOPIC_TOTAL_POSTERS_TTL: 'cache.topic.total.posters.ttl',
    CACHE_TOPIC_TAGS_ENABLED: 'cache.topic.tags.enabled',
    CACHE_TOPIC_TAGS_TTL: 'cache.topic.tags.ttl',
    TOPIC_SERVICE_TAGS_TRUNCATE: 'topic.service.tags.truncate',
    TOPIC_SERVICE_TAGS_TRUNCATE_MAX_TAGS: 'topic.service.tags.truncate.max.tags',
    GROUP_COLOR_DEFAULT: 'group.color.default',
    ONLINE_TRACKER_SERVICE_TTL: 'online.tracker.service.ttl',
    CACHE_LIKES_ENABLED: 'cache.likes.enabled',
    CACHE_LIKES_TTL: 'cache.likes.ttl',
    CACHE_LIKES_PER_MEMBER_ENABLED: 'cache.likes.per.member.enabled',
    CACHE_LIKES_PER_MEMBER_TTL: 'cache.likes.per.member.ttl',
    POSTS_TIMELINE_GAP_ENABLED: 'posts.timeline.gap.enabled',
    POSTS_TIMELINE_GAP_SECONDS: 'posts.timeline.gap.seconds'
});

module.exports = UNB_SETTING_KEYS;