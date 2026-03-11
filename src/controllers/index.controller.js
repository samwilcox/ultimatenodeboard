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

const IndexModel = require("../models/index.model");
const Logger = require('../log/logger');

/**
 * UNB index controller.
 * 
 * Controller for the index of the bulletin board.
 */
class IndexController {
    /**
     * Create a new instance of `IndexController`.
     */
    constructor() {
        this._model = new IndexModel();
    }

    /**
     * Handles the index of the bulletin board.
     * 
     * @param {object} req - The request object from `Express`.
     * @param {object} res - The response object from `Express`.
     * @param {NextFunction} next - The next middleware to execute. 
     */
    async index(req, res, next) {
        try {
            const payload = await this._model.index(req, res, next);
            res.render('index/index', { ...payload });
        } catch (error) {
            Logger.error('IndexController', `Index controller failed: ${error}.`, { error });
            next(error);
        }
    }
} 

module.exports = IndexController;