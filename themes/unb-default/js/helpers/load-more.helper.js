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
 * UNB helpers for working with the load more button.
 */
UNB.on('ui.init', () => {
    UNB.helpers = UNB.helpers || {};
    UNB.helpers.loadMore = UNB.helpers.loadMore || {};

    /**
     * Toggle the load more button.
     * 
     * @param {boolean} visible - `true` to show the load more button, `false` for hide the load more button.
     */
    UNB.helpers.loadMore.toggle = (visible) => {
        const $loadMore = $('[data-unb-load-more]');

        if (visible) {
            $loadMore.fadeIn();
        } else {
            $loadMore.fadeOut();
        }
    };
});