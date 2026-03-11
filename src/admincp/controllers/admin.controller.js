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

'use strict';

const Logger = require('../../log/logger');
const AdminModel = require('../models/admin.model');

/**
 * UNB admincp controller
 */
class AdminController {
    /**
     * Create a new instance of `AdminController`.
     */
    constructor() {
        this._model = new AdminModel();
    }

    /**
     * The AdminCP dashboard.
     * 
     * @param {object} req - The request object from `Express`.
     * @param {object} res - The response object from `Express`.
     * @param {NextFunction} next - The next middleware to execute.
     */
    async dashboard(req, res, next) {
        try {
            const payload = await this._model.dashboard(req, res, next);
            res.render('pages/dashboard', { layout: 'layouts/layout', ...payload });
        } catch (error) {
            Logger.error('AdminController', `AdminController.dashboard() failed: ${error}.`, { error });
            next(error);
        }
    }   
}

module.exports = AdminController;