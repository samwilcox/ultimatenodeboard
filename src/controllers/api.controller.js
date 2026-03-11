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

const ApiModel = require("../models/api.model");
const Logger = require('../log/logger');

/**
 * UNB API controller.
 * 
 * Controller for the UNB API.
 */
class ApiController {
    /**
     * Create a new instance of `ApiController`.
     */
    constructor() {
        this._model = new ApiModel();
    }

    /**
     * Handles all UI-related tasks.
     * 
     * @param {object} req - The request object from `Express`.
     * @param {object} res - The response object from `Express`.
     * @param {NextFunction} next - The next middleware to execute. 
     */
    async ui(req, res, next) {
        try {
            const payload = await this._model.ui(req, res, next);
            res.json(payload);
        } catch (error) {
            Logger.error('ApiController', `API controller failed: ${error}.`, { error });
            next(error);
        }
    }

    /**
     * Fetches topics.
     * 
     * @param {object} req - The request object from `Express`.
     * @param {object} res - The response object from `Express`.
     * @param {NextFunction} next - The next middleware to execute. 
     */
    async fetchTopics(req, res, next) {
        try {
            const payload = await this._model.fetchTopics(req, res, next);
            res.json(payload);
        } catch (error) {
            Logger.error('ApiController', `API controller failed: ${error}.`, { error });
            next(error);
        }
    }

    /**
     * Handle all GIPHY requests.
     * 
     * @param {object} req - The request object from `Express`.
     * @param {object} res - The response object from `Express`.
     * @param {NextFunction} next - The next middleware to execute. 
     */
    async giphy(req, res, next) {
        try {
            const payload = await this._model.giphy(req, res, next);
            res.json(payload);
        } catch (error) {
            Logger.error('ApiController', `API controller failed: ${error}.`, { error });
            next(error);
        }
    }

    /**
     * Handle all emoji requests.
     * 
     * @param {object} req - The request object from `Express`.
     * @param {object} res - The response object from `Express`.
     * @param {NextFunction} next - The next middleware to execute. 
     */
    async emoji(req, res, next) {
        try {
            const payload = await this._model.emoji(req, res, next);
            res.json(payload);
        } catch (error) {
            Logger.error('ApiController', `API controller failed: ${error}.`, { error });
            next(error);
        }
    }

    /**
     * Handles loading posts for a topic.
     * 
     * @param {object} req - The request object from `Express`.
     * @param {object} res - The response object from `Express`.
     * @param {NextFunction} next - The next middleware to execute.
     */
    async posts(req, res, next) {
        try {
            const payload = await this._model.posts(req, res, next);
            res.json(payload);
        } catch (error) {
            Logger.error('ApiController', `API controller failed: ${error}.`, { error });
            next(error);
        }
    }

    /**
     * Handles like/unlike of content.
     * 
     * @param {object} req - The request object from `Express`.
     * @param {object} res - The response object from `Express`.
     * @param {NextFunction} next - The next middleware to execute.
     */
    async likeUnlike(req, res, next) {
        try {
            const payload = await this._model.likeUnlike(req, res, next);
            res.json(payload);
        } catch (error) {
            Logger.error('ApiController', `API controller failed: ${error}.`, { error });
            next(error);
        }
    }

    /**
     * Get the likes for content.
     * 
     * @param {object} req - The request object from `Express`.
     * @param {object} res - The response object from `Express`.
     * @param {NextFunction} next - The next middleware to execute.
     */
    async getLikes(req, res, next) {
        try {
            const payload = await this._model.getLikes(req, res, next);
            res.json(payload);
        } catch (error) {
            Logger.error('ApiController', `API controller failed: ${error}.`, { error });
            next(error);
        }
    }
} 

module.exports = ApiController;