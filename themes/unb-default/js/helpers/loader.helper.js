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
 * UNB AJAX loader helpers.
 */
UNB.on('ui.init', () => {
    UNB.helpers = UNB.helpers || {};
    UNB.helpers.loader = UNB.helpers.loader || {};

    /**
     * Show the AJAX loader inside the given container.
     * 
     * @param {jQuery} $container - The container to show the loader inside of. 
     */
    UNB.helpers.loader.show = ($container) => {
        const $tpl = $('#unb-ajax-loader').clone();
        $tpl.attr('id', 'unb-placed-loader');

        $container.append($tpl);
    };

    /**
     * Hide the AJAX loader.
     * 
     * @param {jQuery} $container - The container the loader was spawned inside of. 
     */
    UNB.helpers.loader.hide = ($container) => {
        $container.find('#unb-placed-loader').remove();
    };
});