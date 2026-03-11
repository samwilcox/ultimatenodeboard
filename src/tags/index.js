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

const TagsService = require('./tags.service');

let _instance = null;

/**
 * Create the tags service instance.
 * 
 * @param {object[]} repo - The UNB database respositories collection.
 * @returns {TagsService} The UNB tags service instance. 
 */
const createTagsService = (repo) => {
    if (!_instance) _instance = new TagsService(repo);
    return _instance;
};

module.exports = createTagsService;