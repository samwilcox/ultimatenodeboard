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
const ForumsModel = require('../models/forums.model');

/**
 * UNB admincp forums management controller.
 */
class ForumsController {
    /**
     * Create a new instance of `ForumsController`.
     */
    constructor() {
        this._model = new ForumsModel();
    }

    /**
     * Forums management.
     * 
     * @param {object} req - The request object from `Express`.
     * @param {object} res - The response object from `Express`.
     * @param {NextFunction} next - The next middleware to execute.
     */
    async forums(req, res, next) {
        try {
            const payload = await this._model.forums(req, res, next);
            res.render('pages/forums/forums', { layout: 'layouts/layout', ...payload });
        } catch (error) {
            Logger.error('ForumsController', `Forums controller failed: ${error}.`, { error });
            next(error);
        }
    }

    /**
     * Create a new forum form.
     * 
     * @param {object} req - The request object from `Express`.
     * @param {object} res - The response object from `Express`.
     * @param {NextFunction} next - The next middleware to execute.
     */
    async createForum(req, res, next) {
        try {
            const payload = await this._model.createForum(req, res, next);
            res.render('pages/forums/create', { layout: 'layouts/layout', ...payload });
        } catch (error) {
            Logger.error('ForumsController', `Forums controller failed: ${error}.`, { error });
            next(error);
        }
    }
}

module.exports = ForumsController;