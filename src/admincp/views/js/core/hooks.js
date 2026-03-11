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
 * UNB AdminCP hook system.
 */
(function (window, $) {
    window.UNB_ADMINCP = window.UNB_ADMINCP || {};
    const hooks = {};

    /**
     * Register a hook.
     * 
     * @param {string} name - The hook name.
     * @param {function} fn - The hook function. 
     */
    window.UNB_ADMINCP.on = function (name, fn) {
        (hooks[name] ??= []).push(fn);
    };

    /**
     * Fire an UI hook and invoke all registered callbacks.
     * 
     * @param {string} name - The hook identifier.
     * @param {object} [payload={}] - Optional data payload. 
     */
    window.UNB_ADMINCP.fire = function (name, payload = {}) {
        (hooks[name] || {}).forEach(fn => fn(payload));
    };
})(window, jQuery);

export const __unbAdminCP_hooks_initialized = true;