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

const DataStore = require('../datastore/datastore');
const UNB_SETTING_KEYS = require('../settings/settings.keys');

/**
 * Detect whether the user is a search bot. 
 * 
 * @param {string} userAgent - The user agent.
 * @returns {Promise<{
 *      present: boolean,
 *      name: string|null
 * }} A promise that resolves to an object containing the search bot data.
 */
const detectSearchBots = async (userAgent) => {
    const { settingsService } = DataStore.get('unb');

    if (!userAgent || typeof userAgent !== 'string') {
        return { present: false, name: null };
    }

    let patterns = [];

    try {
        patterns = await settingsService.get(UNB_SETTING_KEYS.SEARCH_BOT_AGENT_PATTERNS);
    } catch {
        return { present: false, name: null };
    }

    for (const entry of patterns) {
        if (!entry?.name || !entry?.pattern) {
            continue;
        }

        try {
            const regex = new RegExp(entry.pattern, 'i');

            if (regex.test(userAgent)) {
                return { present: true, name: entry.name };
            }
        } catch {
            continue;
        }
    }

    return { present: false, name: null };
};

module.exports = {
    detectSearchBots
};