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
 * UNB AdminCP main routines.
 */
UNB_ADMINCP.on('ui.init', () => {
    const $header = $('[data-unb-header]');
    const $mainMenu = $('[data-unb-main-menu]');
    const $subMenu = $('[data-unb-sub-menu]');
    const $main = $('[data-unb-main]');
    const $wall = $('[data-unb-wall]');

    const headerHeight = $header.outerHeight();
    const subLeft = `${$mainMenu.outerWidth() + 40}px`;

    $mainMenu.css({
        top: `${headerHeight + 40}px`
    });

    $subMenu.css({
        top: `${headerHeight + 40}px`,
        left: subLeft
    });

    $main.css({
        marginTop: `${headerHeight + 40}px`,
        marginLeft: `${$mainMenu.outerWidth() + $subMenu.outerWidth() + 60}px`,
        marginRight: '20px'
    });

    $wall.css({
        height: `${headerHeight + 20}`
    });

    const selectedItem = UNB_ADMINCP.services.storage.get(UNB_ADMINCP.STORAGE.KEYS.SELECTED_CATEGORY);

    toggleMenuItem(selectedItem ?? 'general');

    /**
     * Handles when the user clicks on a main menu item.
     */
    $mainMenu.on('mouseover', '[data-unb-role]', function (e) {
        e.preventDefault();

        const $item = $(this);
        const role = ($item.attr('data-unb-role') || '').trim();

        if (!role || !isValidItem(role)) return;

        selectMenuItem(role);
        toggleMenuItem(role);


    });
});

/**
 * Get the main menu items.
 * 
 * @returns {{
 *      general: JQuery,
 *      members: JQuery,
 *      permissions: JQuery,
 *      groups: JQuery,
 *      forums: JQuery,
 *      themes: JQuery,
 *      languages: JQuery,
 *      performance: JQuery,
 *      security: JQuery,
 *      logs: JQuery,
 *      plugins: JQuery,
 *      support: JQuery
 * }} Ab object of the main menu items.
 */
const getMainMenuItems = () => {
    const $mainMenu = $('[data-unb-main-menu]');

    const menuItems = {
        general: $mainMenu.find('[data-unb-role="general"]'),
        members: $mainMenu.find('[data-unb-role="members"]'),
        permissions: $mainMenu.find('[data-unb-role="permissions"]'),
        groups: $mainMenu.find('[data-unb-role="groups"]'),
        forums: $mainMenu.find('[data-unb-role="forums"]'),
        themes: $mainMenu.find('[data-unb-role="themes"]'),
        languages: $mainMenu.find('[data-unb-role="languages"]'),
        performance: $mainMenu.find('[data-unb-role="performance"]'),
        security: $mainMenu.find('[data-unb-role="security"]'),
        logs: $mainMenu.find('[data-unb-role="logs"]'),
        plugins: $mainMenu.find('[data-unb-role="plugins"]'),
        support: $mainMenu.find('[data-unb-role="support"]')
    };

    return menuItems;
};

/**
 * Toggle the given menu item.
 * 
 * @param {string} selectedItem - The toggled menu item. 
 */
const toggleMenuItem = (selectedItem) => {
    const $subMenu = $('[data-unb-sub-menu]');
    const menuItems = getMainMenuItems();

    for (const [key, value] of Object.entries(menuItems)) {
        if (key === selectedItem) {
            menuItems[key].addClass('selected');
            $subMenu.find(`[data-unb-role="${key}"]`).show();
        } else {
            menuItems[key].removeClass('selected');
            $subMenu.find(`[data-unb-role="${key}"]`).hide();
        }
    }
};

/**
 * Select the given menu item.
 * 
 * @param {string} menuItem - The menu item selected.
 */
const selectMenuItem = (menuItem) => {
    if (!isValidItem(menuItem)) return;
    UNB_ADMINCP.services.storage.set(UNB_ADMINCP.STORAGE.KEYS.SELECTED_CATEGORY, menuItem);
};

/**
 * Check if the menu item is valid.
 * 
 * @param {string} menuItem - The menu item selected.
 * @returns {boolean} `true` if a valid menu item, `false` if not.
 */
const isValidItem = (menuItem) => {
    const items = [
        'general',
        'members',
        'permissions',
        'groups',
        'forums',
        'themes',
        'languages',
        'performance',
        'security',
        'logs',
        'plugins',
        'support'
    ];

    return items.includes(menuItem);
};