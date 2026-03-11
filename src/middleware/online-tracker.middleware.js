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

const { detectSearchBots } = require('../helpers/detection.helper');
const Logger = require('../log/logger');

/**
 * UNB online tracker middleware for tracking online users.
 */
module.exports = function () {
    return async function onlineTrackerMiddleware(req, res, next) {
        try {
            const { member, onlineTrackerService } = req.app.locals;
            const sessionId = req.sessionID;

            if (member.signedIn) {
                onlineTrackerService.touchMember(req, member, sessionId);
            } else {
                const searchBot = await detectSearchBots(req.headers['user-agent']);

                if (searchBot.present) {
                    onlineTrackerService.touchSearchBot(req, member, sessionId, searchBot.name);
                } else {
                    onlineTrackerService.touchGuest(req, member, sessionId);
                }
            }

            next();
        } catch (error) {
            Logger.error('OnlineTrackerMiddleware', `Online tracker middleware failed: ${error}.`, { error });
            next(error);
        }
    };
};