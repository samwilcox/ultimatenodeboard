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
 * UNB URL helper.
 */
UNB.on('ui.init', () => {
    UNB.helpers = UNB.helpers || {};
    UNB.helpers.url = UNB.helpers.url || {};

    /**
     * Redirect the user to a given URL.
     * 
     * @param {string} url - The URL to redirect to.
     */
    UNB.helpers.url.redirect = (url) => {
        location.href = url;
        return;
    };
});