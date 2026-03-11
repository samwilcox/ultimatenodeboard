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

const { formatDateTime } = require("../datetime/datetime.service");
const NotFoundError = require("../errors/not-found.error");
const UnauthorizedError = require("../errors/unauthorized.error");
const { adjustBackgroundColor } = require("../helpers/color.helper");
const { buildEntityUrl } = require("../helpers/entity.helper");
const { pluralOrSingular } = require("../helpers/grammer.helper");
const UNB_PERMISSION_KEYS = require("../permissions/permissions.keys");
const PermissionsService = require("../permissions/permissions.service");
const TopicRespository = require("../repository/topic.repository");
const TopicService = require("../topics/topic.service");

/**
 * UNB topics model
 * 
 * Model for displaying topics for forums and other routines.
 */
class TopicsModel {
    /**
     * Create a new instance of `TopicsModel`.
     */
    constructor() {
        this._payload = {};
    }

    /**
     * View a selected topic.
     * 
     * @param {object} req - The request object from `Express`.
     * @param {object} res - The response object from `Express`.
     * @param {NextFunction} next - The next middleware to execute. 
     * @returns {Promise<object>} A promise that resolves to the payload data.
     * @throws {NotFoundError} If the topic and/or forum is not found.
     * @throws {UnauthorizedError} If the user does not have permissions to view the forum the topic belongs to.
     */
    async view(req, res, next) {
        const { topicKey } = req.params;
        const { localeService, member, forumsService, membersService } = req.app.locals;

        const topic = await TopicRespository.getByKey(topicKey);

        if (!topic) {
            throw new NotFoundError(await localeService.t('error.topic.not.found'), { topic });
        }

        const forum = await forumsService.get(topic.forumKey);

        if (!forum) {
            throw new NotFoundError(await localeService.t('forum.not.found'), { forum, topic });
        }

        if (!await PermissionsService.can(member, UNB_PERMISSION_KEYS.forum.view, { forumKey: forum.key })) {
            throw new UnauthorizedError(await localeService.t('error.invalid.permissions'));
        }

        this._payload.sidebar = member.settings?.sidebar;
        this._payload.topic = topic;
        this._payload.forum = forum;

        this._payload.colors = {
            light: adjustBackgroundColor(forum.color.light.bg, forum.color.light.text),
            dark: adjustBackgroundColor(forum.color.dark.bg, forum.color.dark.text)
        };

        this._payload._urls = {
            forum: buildEntityUrl('forum', forum.key, forum.title)
        };

        const totalReplies = TopicService.totalReplies(topic.key);

        this._payload.bubbles = {
            hot: totalReplies >= forum.hotThreshold
        };

        const postTotals = await TopicService.totalPosts(topic);
        const postersTotals = await TopicService.totalPosters(topic);

        this._payload.locales = {
            totalPosts: pluralOrSingular(
                'posts.total.posts.plural',
                'posts.total.posts.singular',
                postTotals.raw
            ),
            totalPosters: pluralOrSingular(
                'posts.total.posters.plural',
                'posts.total.posters.singular',
                postersTotals.raw
            ),
            totalViews: pluralOrSingular(
                'topics.bubble.views.plural',
                'topics.bubble.views.singular',
                topic.totalViews
            )
        };

        const creator = await membersService.get(topic.createdBy);

        this._payload.rendered = {
            creator: {
                photo: await membersService.profilePhoto(creator.key, { type: 'thumbnail' }),
                link: await membersService.profileLink(creator)
            },
            createdAt: await formatDateTime(topic.createdAt, { timeAgo: true })
        };

        this._payload.tags = await TopicService.getTags(topic);
        this._payload.themeMode = member.themeMode;
        this._payload.modal = { t: req.t };
        this._payload.maxPosts = member.settings?.pagination?.limit?.posts || 50;

        return this._payload;
    }
}

module.exports = TopicsModel;