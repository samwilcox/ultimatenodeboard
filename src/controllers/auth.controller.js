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

const AuthModel = require("../models/auth.model");
const Logger = require('../log/logger');

/**
 * UNB auth controller.
 * 
 * Controller for authentication.
 */
class AuthController {
    /**
     * Create a new instance of `AuthController`.
     */
    constructor() {
        this._model = new AuthModel();
    }

    /**
     * Process the user sign in request.
     * 
     * @param {object} req - The request object from `Express`.
     * @param {object} res - The response object from `Express`.
     * @param {NextFunction} next - The next middleware to execute. 
     */
    async signin(req, res, next) {
        try {
            await this._model.processSignIn(req, res, next);
        } catch (error) {
            Logger.error('AuthController', `Auth controller failed: ${error}.`, { error });
            next(error);
        }
    }

    /**
     * Sign out the member.
     * 
     * @param {object} req - The request object from `Express`.
     * @param {object} res - The response object from `Express`.
     * @param {NextFunction} next - The next middleware to execute. 
     */
    async signout(req, res, next) {
        try {
            await this._model.signOutMember(req, res, next);
        } catch (error) {
            Logger.error('AuthController', `Auth controller failed: ${error}.`, { error });
            next(error);
        }
    }
} 

module.exports = AuthController;