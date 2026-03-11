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
const { buildUrl } = require('../../helpers/url.helper');
const PermissionsService = require('../../permissions/permissions.service');
const UNB_PERMISSION_KEYS = require('../../permissions/permissions.keys');
/**
 * Check if the user has admin permissions.
 * 
 * @param {object} req - The request object from `Express`.
 * @returns {Promise<boolean>} A promise that resolves to either `true` if has permissions, or
 *                             `false` if not.
 */
const hasAdminPermissions = async (req) => {
    // const { member } = req.app.locals;

    // if (!member.signedIn) return false;

    // if (PermissionsService.can(member, UNB_PERMISSION_KEYS.administration.adminCPPanel)) return true;

    // return false;

    return true;
};

/**
 * UNB middleware for the AdminCP.
 */
module.exports = function adminMiddleware() {
    return async function (req, res, next) {
        try {
            res.locals.isAdmin = true;

            const ok = await hasAdminPermissions(req);

            if (!ok) {
                return res.redirect(buildUrl());
            }

            next();
        } catch (error) {
            Logger.error('AdminMiddleware', `Admin middleware failed: ${error}.`, { error });
            next(error);
        }
    };
}