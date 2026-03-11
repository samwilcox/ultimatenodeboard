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
 * Enumeration of the UNB error exposure levels.
 */
const UNB_ERROR_EXPOSURE = Object.freeze({
    /**
     * Never expose the error to users.
     */
    NONE: 'none',

    /**
     * Safe for all users.
     */
    USER: 'user',

    /**
     * Moderators plus admins.
     */
    STAFF: 'staff',

    /**
     * Admins only.
     */
    ADMIN: 'admin',

    /**
     * For development only.
     */
    DEBUG: 'debug'
});

/**
 * Enumeration of the UNB error codes.
 */
const UNB_ERROR_CODES = Object.freeze({
    INVALID_PARAMETER: 'UNB_INVALID_PARAMETER',
    DATABASE_CONNECT_FAILED: 'UNB_DATABASE_CONNECT_FAILED',
    DATABASE_DISCONNECT_FAILED: 'UNB_DISCONNECT_FAILED',
    DATABASE_PROVIDER_NOT_SUPPORTED: 'UNB_PROVIDER_NOT_SUPPORTED',
    UNSUPPORTED_ERROR: 'UNB_UNSUPPORTED_ERROR',
    CACHE_ERROR: 'UNB_CACHE_ERROR',
    UNINITIALIZED_ERROR: 'UNB_UNINITIALIZED_ERROR',
    INVALID_ERROR: 'UNB_INVALID_ERROR',
    NOT_FOUND_ERROR: 'UNB_NOT_FOUND_ERROR',
    CSRF_ERROR: 'UNB_CSRF_ERROR',
    CSRF_SESSION_REQUIRED: 'UNB_SESSION_REQUIRED',
    SESSION_ERROR: 'UNB_SESSION_ERROR',
    FORUM_PERMISSION_ERROR: 'UNB_FORUM_PERMISSION_ERROR',
    PERMISSION_ERROR: 'UNB_PERMISSION_ERROR',
    EDITOR_ERROR: 'UNB_EDITOR_ERROR',
    EDITOR_EXT_LOAD_FAILED: 'UNB_EDITOR_EXT_LOAD_FAILED'
});

module.exports = {
    UNB_ERROR_EXPOSURE,
    UNB_ERROR_CODES
};