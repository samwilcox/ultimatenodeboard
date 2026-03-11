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
 * Build the error box data object.
 * 
 * @param {object} [options={}] - Options for building the error box.
 * @param {string|null} [options.error=null] - Optional error message to display (default is `null`).
 * @param {boolean} [options.display=false] - `true` to display the error box, `false` to hide the error box (default is `false`).
 * @param {boolean} [options.canClose=true] - `true` to allow the user to close the box, `false` not to allow the user to close the box (default is `true`).
 * @returns {{
 * 
 * }} The error box data object. 
 */
const buildErrorBox = (options = {}) => {
    const {
        error = null,
        display = false,
        canClose = true
    } = options;

    return {
        error,
        display,
        canClose
    };
};

module.exports = {
    buildErrorBox
};