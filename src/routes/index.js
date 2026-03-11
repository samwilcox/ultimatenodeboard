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

const indexRoutes = require('./index.routes');
const apiRoutes = require('./api.routes');
const authRoutes = require('./auth.routes');
const adminCPRoutes = require('../admincp/routes/admin.routes');
const topicsRoutes = require('./topics.routes');

/**
 * Setup the UNB routing paths.
 * 
 * @param {object} app - The `Express` application instance. 
 */
const setupRoutes = (app) => {
    app.use('/', indexRoutes);
    app.use('/api', apiRoutes);
    app.use('/auth', authRoutes);
    app.use('/admincp', adminCPRoutes);
    app.use('/topics', topicsRoutes);
};

module.exports = setupRoutes;