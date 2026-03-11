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

const TopicsModel = require("../models/topics.model");
const Logger = require('../log/logger');

/**
 * UNB topics controller.
 * 
 * Controller for displaying topics for forums and other various routines.
 */
class TopicsController {
    /**
     * Create a new instance of `TopicsController`.
     */
    constructor() {
        this._model = new TopicsModel();
    }

    /**
     * View a selected topic.
     * 
     * @param {object} req - The request object from `Express`.
     * @param {object} res - The response object from `Express`.
     * @param {NextFunction} next - The next middleware to execute.
     */
    async view(req, res, next) {
        try {
            const payload = await this._model.view(req, res, next);
            res.render('topics/view', { ...payload });
        } catch (error) {
            Logger.error('TopicsController', `Topics controller failed: ${error}.`, { error });
            next(error);
        }
    }
} 

module.exports = TopicsController;