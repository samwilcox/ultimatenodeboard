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

const LikeService = require('../likes/like.service');
const Logger = require('../log/logger');

/**
 * UNB API service.
 * 
 * Service for supporting API requests.
 */
class ApiService {
    /**
     * Like/unlike content.
     * 
     * @param {object} req - The request object from `Express`.
     * @param {("like"|"unlike")} action - The like action to execute.
     * @returns {Promise<{
     *      ok: boolean,
     *      message: ("string"|null)
     * }>} A promise that resolves to an object containing the result of the request.
     */
    static async likeUnlike(req, action) {
        const { localeService, member } = req.app.locals;

        try {
            const {
                contentType,
                contentKey,
                prvt
            } = req.body;

            if (!contentType ||
                !contentKey ||
                typeof contentType !== 'string' ||
                typeof contentKey !== 'string'
            ) {
                return {
                    ok: false,
                    message: await localeService.t('error.api.like.invalid.param')
                };
            }

            if (action === 'like') {
                return LikeService.likeContent(
                    contentType,
                    contentKey,
                    Boolean(prvt),
                    member
                );
            } else {
                return LikeService.unlikeContent(
                    contentType,
                    contentKey,
                    member
                );
            }
        } catch (error) {
            Logger.error('ApiService.likeUnlike', `ApiService.likeUnlike failed: ${error}.`, { error, req });

            return {
                ok: false,
                message: await localeService.t('error.api.like.failed')
            };
        }
    }
}

module.exports = ApiService;