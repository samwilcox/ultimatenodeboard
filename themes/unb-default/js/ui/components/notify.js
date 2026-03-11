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
 * UNB notification banner component.
 */
UNB.on('ui.init', () => {
    'use strict';

    /**
     * Show a UNB notification banner.
     * 
     * @param {string} message - The message to display.
     * @param {object} [options={}] - Options for notification display.
     * @param {boolean} [options.error=false] - `true` if an error, `false` if not (default is `false`).
     * @param {number} [options.duration=5000] - The total duration to display the banner (default is `5000` ms (5 seconds)). 
     */
    UNB.notify = (message, options = {}) => {
        const { 
            error = false,
            duration = 5000
        } = options;

        
    };
});