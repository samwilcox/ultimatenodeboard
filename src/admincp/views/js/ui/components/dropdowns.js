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
 * UNB drop down component.
 */
UNB_ADMINCP.on('ui.init', () => {
    'use strict';

    let $activeMenu = null;
    let $activeToggle = null;

    /**
     * Close the active drop down menu.
     */
    const closeActiveDropdown = () => {
        if (!$activeMenu || !$activeToggle) return;

        $activeMenu.stop(true, true).fadeOut(120, function () {});

        $activeToggle.removeClass('is-open');

        $activeMenu = null;
        $activeToggle = null;
    };

    UNB_ADMINCP.dropdown = UNB_ADMINCP.dropdown || {};
    UNB_ADMINCP.dropdown.close = () => closeActiveDropdown();

    /**
     * Clamp a value to make sure it does not go under minimum value and
     * does not go over maximum value.
     * 
     * @param {number} value - The value.
     * @param {number} min - The minimum value.
     * @param {number} max - The maximum value.
     * @returns {number} The clamped value.
     */
    const clamp = (value, min, max) => {
        return Math.max(min, Math.min(max, value));
    };

    /**
     * Detect the best direction to open the drop down menu.
     * 
     * @param {jQuery} $toggle - The toggle jQuery object instance. 
     * @param {jQuery} $menu - The menu jQuery object instance. 
     * @returns {"down"|"up"|"right"|"left"} The best direction for the menu.
     */
    const getBestDirection = ($toggle, $menu) => {
        const toggleRect = $toggle[0].getBoundingClientRect();
        
        const wasHidden = $menu.is(':hidden');
        if (wasHidden) {
            $menu.css({ display: 'block', visibility: 'hidden' });
        }

        const menuHeight = $menu.outerHeight(true);
        const menuWidth = $menu.outerWidth(true);

        if (wasHidden) {
            $menu.css({ display: 'none', visibility: '' });
        }

        const spaceBelow = window.innerHeight - toggleRect.bottom;
        const spaceAbove = toggleRect.top;
        const spaceRight = window.innerWidth - toggleRect.right;
        const spaceLeft = toggleRect.left;

        if (spaceBelow >= menuHeight) return 'down';
        if (spaceAbove >= menuHeight) return 'up';
        if (spaceRight >= menuWidth) return 'right';
        if (spaceLeft >= menuWidth) return 'left';

        return 'down';
    };

    /**
     * Position the drop down menu in the best possible spot.
     * 
     * @param {jQuery} $toggle - The toggle element jQuery object instance.
     * @param {jQuery} $menu - The menu element jQuery object instance.
     * @param {"top"|"bottom"|"right"|"left"} direction - The direction to position the drop-down menu. 
     */
    const positionMenu = ($toggle, $menu, direction) => {
        const offset = $toggle.offset();
        const toggleHeight = $toggle.outerHeight(true);
        const toggleWidth = $toggle.outerWidth(true);
        const menuWidth = $menu.outerWidth(true);
        const menuHeight = $menu.outerHeight(true);

        const viewportPadding = 8;

        let left = 0;
        let top = 0;

        switch (direction) {
            case 'up':
                left = offset.left + toggleWidth - menuWidth;
                top = offset.top - menuHeight;
                break;

            case 'right':
                left = offset.left + toggleWidth;
                top = offset.top;
                break;

            case 'left':
                left = offset.left - menuWidth;
                top = offset.top;
                break;

            default: // down
                left = offset.left + toggleWidth - menuWidth;
                top = offset.top + toggleHeight;
        }

        left = clamp(
            left,
            viewportPadding,
            window.innerWidth - menuWidth - viewportPadding
        );

        $menu.css({ left, top });
    };

    /**
     * Open the drop-down menu.
     * 
     * @param {jQuery} $menu - The menu element jQuery object instance.
     * @param {"top"|"bottom"|"right"|"left"} direction - The direction to open the drop-down menu. 
     */
    const openMenu = ($menu, direction) => {
        $menu.css({ position: 'absolute', zIndex: 9999 });

        if (direction === 'up' || direction === 'down') {
            $menu.stop(true, true).slideDown(150);
        } else {
            $menu.stop(true, true).fadeIn(120);
        }
    };

    /**
     * Handle when a user clicks on a link to open a drop down menu.
     * 
     * @param {Event} e - The event object instance.
     */
    $(document).on('click', '.dropdown-toggle', function (e) {
        e.preventDefault();
        e.stopPropagation();

        const $toggle = $(this);
        const key = $toggle.data('dropdown');

        if (!key) return;

        const $menu = $(`[data-dropdown-menu="${key}"]`);
        if (!$menu.length) return;

        if ($activeMenu && $activeToggle && $toggle.is($activeToggle)) {
            closeActiveDropdown();
            return;
        }

        closeActiveDropdown();

        $menu.hide().appendTo('body');

        const direction = getBestDirection($toggle, $menu);
        positionMenu($toggle, $menu, direction);
        openMenu($menu, direction);

        $toggle.addClass('is-open');

        $activeMenu = $menu;
        $activeToggle = $toggle;
    });

    /**
     * Handle when the user clicks anywhere in the window and detect whether they clicked
     * inside an active drop down menu or not. If they clicked outside, close the active
     * drop down menu component.
     * 
     * @param {Event} e - The event object instance.
     */
    $(document).on('click', function (e) {
        if ($activeMenu && !$(e.target).closest('.drop-down-menu, .dropdown-toggle').length) {
            closeActiveDropdown();
        }
    });

    /**
     * Handle when a user presses a key on their keyboard.
     * If they clicked `Escape` key, then close any active drop down menu component.
     * 
     * @param {Event} e - The event object instance.
     */
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape') {
            closeActiveDropdown();
        }
    });

    /**
     * Handle when the user clicks on the drop down menu component.
     * 
     * @param {Event} e - The event object instance.
     */
    $(document).on('click', '.drop-down-menu', function (e) {
        e.stopPropagation();
    });

    /**
     * Handle when the user resizes the window.
     * 
     * @param {Event} e - The event object instance.
     */
    $(window).on('resize', function () {
        if ($activeMenu && $activeToggle) {
            const direction = getBestDirection($activeToggle, $activeMenu);
            positionMenu($activeToggle, $activeMenu, direction);
        }
    });
});