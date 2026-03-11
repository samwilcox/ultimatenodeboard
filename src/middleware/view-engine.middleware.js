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

const { pathExists } = require('../helpers/file.helper');
const Logger = require('../log/logger');
const path = require('path');

/**
 * UNB middleware for setting up the view engine.
 */
module.exports = function createViewEngineMiddleware(app) {
    return async function viewEngineMiddleware(req, res, next) {
        try {
            const member = res.locals.member;
            const themePath = member.configs.themePath;

            if (!themePath || !pathExists(themePath)) {
                themePath = path.join(__dirname, '..', '..', 'themes', 'unb-default', 'html');
            }

            app.set('view engine', 'ejs');

            app.set('views', [
                themePath,
                path.join(__dirname, '../admincp/views')
            ]);

            app.set('layout', 'layout');


            next();
        } catch (error) {
            Logger.error('ViewEngineMiddleware', `View engine middleware failed: ${error}.`, { error });
            next(error);
        }
    };
};