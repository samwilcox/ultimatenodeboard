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

const router = require('express').Router();
const ApiController = require('../controllers/api.controller');

const apiController = new ApiController();

router.get('/ui', apiController.ui.bind(apiController));
router.get('/fetch/topics', apiController.fetchTopics.bind(apiController));
router.get('/editor/giphy', apiController.giphy.bind(apiController));
router.get('/editor/emoji', apiController.emoji.bind(apiController));
router.get('/topics/:topicKey/posts', apiController.posts.bind(apiController));
router.post('/like', apiController.likeUnlike.bind(apiController));
router.get('/like/list', apiController.getLikes.bind(apiController));

module.exports = router;