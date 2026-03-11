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
 * Get the currently selected topic filter.
 * 
 * @param {object} req - The request object from `Express`.
 * @returns {"all"|
 *      "unread"|
 *      "read"|
 *      "answered"|
 *      "hot"|
 *      "pinned"|
 *      "unpinned"|
 *      "locked"|
 *      "unlocked"
 * } The selected topic filter.
 */
const getSelectedTopicFilter = (req) => {
    if (!req) return 'all';

    if (sessionVarExists(req, UNB_SESSION_KEYS.TOPICS_FILTER)) {
        return getSessionVar(req, UNB_SESSION_KEYS.TOPICS_FILTER);
    }

    return 'all';
};

/**
 * Build the filter locale mapping.
 * 
 * @param {LocaleService} localeService - The UNB locale service instance.
 * @returns {{
 *      all: string,
 *      unread: string,
 *      read: string,
 *      answered: string,
 *      unanswered: string,
 *      hot: string,
 *      pinned: string,
 *      unpinned: string,
 *      locked: string,
 *      unlocked: string
 * }} The filter locale mapping object.
 */
const buildFilterLocaleMap = (localeService) => {
    return {
        all: localeService.tSync('filters.all'),
        unread: localeService.tSync('filters.unread'),
        read: localeService.tSync('filters.read'),
        answered: localeService.tSync('filters.answered'),
        unanswered: localeService.tSync('filters.unanswered'),
        hot: localeService.tSync('filters.hot'),
        pinned: localeService.tSync('filters.pinned'),
        unpinned: localeService.tSync('filters.unpinned'),
        locked: localeService.tSync('filters.locked'),
        unlocked: localeService.tSync('filters.unlocked')
    };
};

module.exports = {
    getSelectedTopicFilter,
    buildFilterLocaleMap
};