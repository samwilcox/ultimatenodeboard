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
 * UNB error box.
 */
UNB.on('ui.init', () => {
    /**
     * Handles when the user clicks on the close button.
     */
    $(document).on('click', '[data-unb-error-box-close]', function (e) {
        e.preventDefault();

        const $errorbox = $('[data-unb-error-box]');
        $errorbox.fadeOut();
    });

    UNB.components = UNB.components || {};
    UNB.components.errorbox = UNB.components.errorbox || {};

    /**
     * Change the text of the errorbox.
     * 
     * @param {string} text - The text inside the errorbox.
     */
    UNB.components.errorbox.text = (text) => {
        const $errorbox = $('[data-unb-error-box]');
        const $textSpan = $errorbox.find('[data-role="text"]');
        $textSpan.text(text);
    };
});