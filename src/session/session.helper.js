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

const UninitializedError = require("../errors/uninitialized.error");

/**
 * Set a session key value.
 * 
 * @param {object} req - The request from `Express`.
 * @param {string} key - The session key name. 
 * @param {any} value - The value for the session key. 
 * @throws {UninitializedError} If the session has not been initialized.
 */
const setSessionVar = (req, key, value) => {
    if (!req.session) {
        throw new UninitializedError('Session is not initialized.');
    }

    req.session[key] = value;
};

/**
 * Get the value for a session key name.
 * 
 * @param {object} req - The request from `Express`.
 * @param {string} key - The session key name. 
 * @returns {any} The value for the session key.
 */
const getSessionVar = (req, key) => {
    return req.session && req.session[key] ? req.session[key] : null;
};

/**
 * Check if a session key exists.
 * 
 * @param {object} req - The request from `Express`.
 * @param {string} key - The session key name. 
 * @returns {boolean} `true` if the key exists, `false` if not.
 */
const sessionVarExists = (req, key) => {
    return req.session && key in req.session;
};

/**
 * Delete a session variable.
 * 
 * @param {object} req - The request from `Express`.
 * @param {string} key - The session key name. 
 */
const deleteSessionVar = (req, key) => {
    if (req.session && sessionVarExists(req, key)) {
        delete req.session[key];
    }
};

/**
 * Get the total session variables.
 * 
 * @returns {number} The total number of session variables.
 */
const sessionVarSize = () => {
    req.session ? Object.keys(req.session).length : 0;
};

/**
 * Get the all the session variables.
 * 
 * @param {object} req - The request object from `Express`.
 * @returns {object} The session data object.
 */
const sessionVarAll = (req) => {
    return { ...req.session || {} };
};

module.exports = {
    setSessionVar,
    getSessionVar,
    sessionVarExists,
    deleteSessionVar,
    sessionVarSize,
    sessionVarAll
};