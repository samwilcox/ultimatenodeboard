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

const PaginationCursorService = require('../pagination/cursor/pagination-cursor.service');
const FilterService = require('../services/filter.service');
const SortService = require('../services/sort.service');

/**
 * UNB topic pagination service
 * 
 * Service for paginating for the infinite scroll feature.
 */
class TopicPaginationService {
    /**
     * List topics for keyset.
     * 
     * @param {object} req - The request object from `Express`.
     * @param {object} options - Options for list.
     * @param {bigint} options.cursor - The cursor.
     * @param {number} options.limit - The limit of items per load.
     * @returns {Promise<{
     *      topics: object[],
     *      nextCursor: bigint,
     *      hasMore: boolean
     * }} A promise that resolves to paginated data.
     */
    static async list(req, { cursor, limit }) {
        const { db } = req.app.locals;

        const filterSpec = FilterService.getTopicFilterSpec(req);
        const sortSpec = SortService.getTopicSortSpec(req);

        const decodedCursor = PaginationCursorService.decode(cursor);

        const { items, nextCursor, hasMore } =
            await db.repo.topics.listKeyset({
                cursor: decodedCursor,
                limit,
                filterSpec,
                sortSpec
            });

        return {
            topics: items,
            nextCursor: PaginationCursorService.encode(nextCursor),
            hasMore
        };
    }
};

module.exports = TopicPaginationService;