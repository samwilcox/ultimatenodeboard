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
 * UNB storage keys.
 */
UNB_ADMINCP.on('ui.init', () => {
    UNB_ADMINCP.STORAGE = UNB_ADMINCP.STORAGE || {};
    UNB_ADMINCP.STORAGE.KEYS = UNB_ADMINCP.STORAGE.KEYS || {};

    const keys = Object.freeze({
        SELECTED_CATEGORY: 'unb.selected.category'
    });

    UNB_ADMINCP.STORAGE.KEYS = keys;
});