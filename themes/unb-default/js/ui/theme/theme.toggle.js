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
 * UNB theme toggling service.
 */
UNB.on('ui.init', () => {
    UNB.theme = UNB.theme || {};

    /**
     * Set the theme mode.
     * 
     * @param {"light"|"dark"} mode - The mode to set. 
     */
    UNB.theme.setMode = (mode) => {
        const $root = $('html');
        
        $root.removeClass('dark-mode');

        if (mode === 'dark') {
            $root.addClass('dark-mode');
        }

        UNB.services.storage.set('unb.theme.mode', mode);
    };

    /**
     * Toggle the community logo (only if set to image).
     * 
     * @param {"light"|"dark"} mode - The theme mode to toggle to. 
     */
    const toggleLogo = (mode) => {
        const $logo = $('[data-community-logo]');
        const assetsUrl = UNB.config.payload.urls.assets;
        const logoType = UNB.config.payload.settings.logoType;
        const lightLogo = UNB.config.payload.settings.logoLight;
        const darkLogo = UNB.config.payload.settings.logoDark;

        if (logoType === 'image' && $logo.length) {
            const newSrc = `${assetsUrl}/${mode === 'light' ? lightLogo : darkLogo}`;
            $logo.attr('src', newSrc);
        }
    };

    /**
     * Toggle the theme mode toggle icon.
     * 
     * @param {"light"|"dark"} mode - The theme mode to toggle to. 
     */
    const toggleIcon = (mode) => {
        const $icon = $('#unb-theme-mode-toggle');
        const darkIcon = 'fa-solid fa-moon';
        const lightIcon = 'fa-solid fa-lightbulb';

        $icon.removeClass(mode === 'light' ? lightIcon : darkIcon);
        $icon.addClass(mode === 'light' ? darkIcon : lightIcon);
    };

    /**
     * Handles when a user clicks the theme mode toggle link.
     */
    $(document).on('click', '[data-theme-mode-toggle]', function (e) {
        e.preventDefault();

        const $toggle = $(this);
        const $root = $('html');
        const isDark = $root.hasClass('dark-mode');

        const toLightTooltip = UNB.config.payload.locale.global.toggleToLightMode;
        const toDarkTooltip = UNB.config.payload.locale.global.toggleToDarkMode;

        const newMode = isDark ? 'light' : 'dark';
        UNB.theme.setMode(newMode);

        toggleIcon(newMode);

        $toggle.attr('data-title', newMode === 'dark' ? toLightTooltip : toDarkTooltip);

        toggleLogo(newMode);
    });

    /**
     * Detects if there is a set theme mode.
     * If there is a set theme mode, then sets the theme mode accordingly.
     */
    const detectMode = () => {
        if (UNB.services.storage.exists('unb.theme.mode')) {
            const mode = UNB.services.storage.get('unb.theme.mode');
            UNB.theme.setMode(mode);
            toggleLogo(mode);
            toggleIcon(mode);
        }
    };

    /**
     * Detect when the configs have loaded before we detect theme mode.
     */
    UNB.on('ui.config.loaded', function (payload) {
        UNB.config.payload = payload;
        detectMode();
    });
});