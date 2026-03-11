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

const { sessionVarExists, getSessionVar } = require("../session/session.helper");
const UNB_SESSION_KEYS = require("../session/session.keys");

/**
 * Get the currently selected topic sort option.
 * 
 * @param {object} req - The request object from `Express`.
 * @returns {"latest"|
 *           "top"|
 *           "newest"|
 *           "oldest"|
 *           "likes"
 * } The selected topic sort option.
 */
const getSelectTopicSort = (req) => {
    if (!req) return 'latest';

    if (sessionVarExists(req, UNB_SESSION_KEYS.TOPICS_SORT)) {
        return getSessionVar(req, UNB_SESSION_KEYS.TOPICS_SORT);
    } else {
        return 'latest';
    }
};

/**
 * Build the sort to locale mapping.
 * 
 * @param {LocaleService} localeService - The UNB locale service instance.
 * @returns {{
 *      latest: string,
 *      top: string,
 *      newest: string,
 *      oldest: string,
 *      likes: string
 * }} The sort to locale mapping. 
 */
const buildSortLocaleMap = (localeService) => {
    return {
        latest: localeService.tSync('sort.latest'),
        top: localeService.tSync('sort.top'),
        newest: localeService.tSync('sort.newest'),
        oldest: localeService.tSync('sort.oldest'),
        likes: localeService.tSync('sort.likes')
    };  
};

module.exports = {
    getSelectTopicSort,
    buildSortLocaleMap
};