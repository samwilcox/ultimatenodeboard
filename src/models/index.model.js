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

const { getSelectedTopicFilter, buildFilterLocaleMap } = require("../helpers/filter.helper");
const { getSelectTopicSort, buildSortLocaleMap } = require("../helpers/sort.helper");

/**
 * UNB index model
 * 
 * Model for the index of the bulletin board.
 */
class IndexModel {
    /**
     * Create a new instance of `IndexModel`.
     */
    constructor() {
        this._payload = {};
    }

    /**
     * Handles the index of the bulletin board.
     * 
     * @param {object} req - The request object from `Express`.
     * @param {object} res - The response object from `Express`.
     * @param {NextFunction} next - The next middleware to execute. 
     * @returns {Promise<object>} A promise that resolves to the payload data.
     */
    async index(req, res, next) {
        const { forumsService, localeService } = req.app.locals;

        this._payload.forums = await forumsService.buildForumsListing();

        const filter = getSelectedTopicFilter(req);
        const sort = getSelectTopicSort(req);
        
        this._payload.selects = {
            filter,
            sort,
            button: {
                filter: buildFilterLocaleMap(localeService)[filter],
                sort: buildSortLocaleMap(localeService)[sort]
            }
        };

        return this._payload;
    }
}

module.exports = IndexModel;