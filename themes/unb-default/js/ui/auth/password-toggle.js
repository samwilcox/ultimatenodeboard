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
 * UNB password toggle.
 */
UNB.on('ui.init', () => {
    $(document).on('click', '[data-unb-toggle-protected]', function (e) {
        e.preventDefault();

        const $toggle = $(this);
        const $field = $('[data-unb-toggle-protected-field]');
        const locale = UNB.config.payload.locale;
        const showLocale = locale.auth.showPasswordTooltip;
        const hideLocale = locale.auth.hidePasswordTooltip;
        const $icon = $toggle.find('i');

        if ($field.attr('type') === 'password') {
            $field.attr('type', 'text');
            $toggle.attr('data-title', hideLocale);
            $icon.removeClass('fa-eye-slash');
            $icon.addClass('fa-eye');
        } else {
            $field.attr('type', 'password');
            $toggle.attr('data-title', showLocale);
            $icon.removeClass('fa-eye');
            $icon.addClass('fa-eye-slash');
        }
    });
});