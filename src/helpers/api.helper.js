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
 * Format the API response.
 * 
 * @param {boolean} ok - `true` is request succeeded, `false` if request failed. 
 * @param {object} [payload={}] - Optional data payload to send with the response.
 * @returns {object} The resulting API response payload. 
 */
const formatApiResponse = (ok, payload = {}) => {
    return {
        ok,
        payload
    };
};

module.exports = {
    formatApiResponse
};