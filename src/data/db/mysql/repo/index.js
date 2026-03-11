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

const createSettingsRepo = require('./settings.repo');
const createMembersRepo = require('./members.repo');
const createLocalesRepo = require('./locales.repo');
const createThemesRepo = require('./themes.repo');
const createMemberDevicesRepo = require('./member-devices.repo');
const createForumsRepo = require('./forums.repo');
const createTopicsRepo = require('./topics.repo');
const createPostsRepo = require('./posts.repo');
const createLikesRepo = require('./likes.repo');
const createMemberPhotosRepo = require('./member-photos.repo');
const createGroupsRepo = require('./groups.repo');
const createContentTrackerRepo = require('./content-tracker.repo');
const createSessionsRepo = require('./sessions.repo');
const createPermissionDefinitionsRepo = require('./permission-definitions.repo');
const createPermissionRulesRepo = require('./permission-rules.repo');
const createTagsRepo = require('./tags.repo');
const { connect } = require('../toolbox');
const Logger = require('../../../../log/logger');

/**
 * Initialize the UNB database repository for MySQL databases.
 * 
 * @returns {Promise<object>} A promise that resolves to an object containing the database repos.
 */
const initializeRepo = async () => {
    let db = null;

    try {
        db = await connect();
    } catch (error) {
        Logger.error('MySQL.Index', `Failed to connect to the MySQL database server: ${error}.`, { error, db });
    }

    return {
        settings: await createSettingsRepo(db),
        members: await createMembersRepo(db),
        locales: await createLocalesRepo(db),
        themes: await createThemesRepo(db),
        memberDevices: await createMemberDevicesRepo(db),
        forums: await createForumsRepo(db),
        topics: await createTopicsRepo(db),
        posts: await createPostsRepo(db),
        likes: await createLikesRepo(db),
        memberPhotos: await createMemberPhotosRepo(db),
        groups: await createGroupsRepo(db),
        contentTracker: await createContentTrackerRepo(db),
        sessions: await createSessionsRepo(db),
        permissionDefinitions: await createPermissionDefinitionsRepo(db),
        permissionRules: await createPermissionRulesRepo(db),
        tags: await createTagsRepo(db)
    };
};

module.exports = initializeRepo;