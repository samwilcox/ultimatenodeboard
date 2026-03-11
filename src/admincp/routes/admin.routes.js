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

const express = require('express');
const router = express.Router();

const adminMiddleware = require('../middleware/admin.middleware');
const viewGlobalsMiddleware = require('../middleware/view-globals.middleware');
const AdminController = require('../controllers/admin.controller');
const ForumsController = require('../controllers/forums.controller');

const adminController = new AdminController();
const forumsController = new ForumsController();

router.use(adminMiddleware());
router.use(viewGlobalsMiddleware());

router.get('/', adminController.dashboard.bind(adminController));

router.get('/forums', forumsController.forums.bind(forumsController));
router.get('/forums/create', forumsController.createForum.bind(forumsController));

module.exports = router;