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

const Logger = require('../log/logger');

/**
 * UNB middleware for initializing the session.
 */
module.exports = function createSessionInitMiddleware() {
    return async function sessionInitMiddleware(req, res, next) {
        try {
            // Just add last activity to make express session initialize properly
            req.session.lastActivity = new Date();

            next();
        } catch (error) {
            Logger.error('SessionInitMiddleware', `Session init middleware failed: ${error}.`, { error });
            next(error);
        }
    };  
}