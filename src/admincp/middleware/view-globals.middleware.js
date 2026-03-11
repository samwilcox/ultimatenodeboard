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

const { buildUrl } = require('../../helpers/url.helper');
const Logger = require('../../log/logger');

/**
 * UNB AdminCP globals populator.
 */
module.exports = function viewGlobalsMiddleware() {
    return async function (req, res, next) {
        try {
            const { member } = req.app.locals;
            const t = req.t;

            let globals = {
                _urls: {
                    cssUrl: buildUrl(['acp', 'css']),
                    jsUrl: buildUrl(['acp', 'js']),
                    base: buildUrl(['admincp']),
                    forums: {
                        forums: buildUrl(['admincp', 'forums']),
                        create: buildUrl(['admincp', 'forums', 'create'])
                    }
                }
            };

            res.locals = {
                ...res.locals,
                ...globals
            };

            next();
        } catch (error) {
            Logger.error('AdminCP.ViewGlobalsMiddleware', `AdminCP.ViewGlobalsMiddleware failed: ${error}.`, { error });
            next(error);
        }
    };
}