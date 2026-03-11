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

const DateTimeService = require("../datetime/datetime.service");
const { adjustBackgroundColor } = require("../helpers/color.helper");
const { buildEntityUrl } = require("../helpers/entity.helper");
const { getSelectedTopicFilter } = require("../helpers/filter.helper");
const { formatNumberCompact } = require("../helpers/number.helper");
const PostService = require("../posts/post.service");
const PostRespository = require("../repository/post.repository");
const ContentTrackerService = require("../services/content-tracker.service");
const OutputService = require("../services/output.service");
const TopicService = require("./topic.service");

/**
 * UNB topic view builder.
 */
class TopicViewBuilder {
    /**
     * Build the topic view.
     * 
     * @param {object} req - The request object from `Express`.
     * @param {object[]} data - The topic data to build with.
     * @returns {Promise<string>} The topic HTML source.  
     */
    static async build(req, data) {
        const { membersService, localeService, forumsService, member } = req.app.locals;

        const filter = getSelectedTopicFilter(req);
        const viewMode = TopicService.getViewMode(filter);
        let post = null;

        if (viewMode === 'post') {
            post = await PostService.getPostForTopic(data, filter === 'answered' || filter === 'pinned' ? filter : null);
            post = await PostRespository.getByKey(post);
        }

        const creator = viewMode === 'topic' 
            ? (await membersService.get(data.createdBy) ?? null)
            : (await membersService.get(post?.createdBy) ?? null);

        const forum = await forumsService.get(data.forumKey);
        const forumBubbles = {};

        if (forum) {
            if (forum.parentKey) {
                const parent = await forumsService.get(forum.parentKey);

                if (parent) {
                    forumBubbles.parent = {
                        title: parent.title,
                        url: buildEntityUrl('forum', parent.key, parent.title),
                        icon: parent.icon ?? '',
                        colors: {
                            ...forum.color,
                            hover: {
                                light: adjustBackgroundColor(forum.color.light.bg, forum.color.light.text),
                                dark: adjustBackgroundColor(forum.color.dark.bg, forum.color.dark.text)
                            }
                        }
                    };
                }

                forumBubbles.child = {
                    title: forum.title,
                    url: buildEntityUrl('forum', forum.key, forum.title),
                    icon: forum.icon ?? '',
                    colors: {
                        ...forum.color,
                        hover: {
                            light: adjustBackgroundColor(forum.color.light.bg, forum.color.light.text),
                            dark: adjustBackgroundColor(forum.color.dark.bg, forum.color.dark.text)
                        }
                    }
                };
            } else {
                forumBubbles.parent = {
                    title: forum.title,
                    url: buildEntityUrl('forum', forum.key, forum.title),
                    icon: forum.icon ?? '',
                    colors: {
                        ...forum.color,
                        hover: {
                            light: adjustBackgroundColor(forum.color.light.bg, forum.color.light.text),
                            dark: adjustBackgroundColor(forum.color.dark.bg, forum.color.dark.text)
                        }
                    }
                }
            }
        }

        return await OutputService.getPartial('topics/topic-item', {
            urls: {
                base: process.env.UNB_BASE_URL
            },
            viewMode,
            preview: member.settings.topics.preview,
            author: {
                photo: await membersService.profilePhoto(creator.key, { type: 'thumbnail', includeTooltip: false }),
            },
            authorTimestamp: viewMode === 'topic'
                ? await localeService.t('topics.view.builder.started', {
                    link: await membersService.profileLink(creator, { includeTooltip: false }),
                    timestamp: await DateTimeService.formatDateTime(data.createdAt, { timeAgo: true })
                })
                : await localeService.t('topics.view.builder.replied.at', {
                    link: await membersService.profileLink(creator, { includeTooltip: false }),
                    timestamp: await DateTimeService.formatDateTime(post.createdAt, { timeAgo: true })
                }),
            topic: {
                title: data.title,
                url: buildEntityUrl('topic', data.key, data.title)
            },
            bubbles: {
                pinned: data.pinned,
                locked: data.locked,
                attachments: await TopicService.haveAttachments(data),
                solution: data.solution?.solution ?? false,
                poll: data.pollKey ? true : false
            },
            forumBubbles,
            forum,
            unread: await ContentTrackerService.isUnread(req, 'topic', data.key, await TopicService.getLastPost(data.key)),
            totalViews: formatNumberCompact(data.totalViews),
            totalPosts: formatNumberCompact(await TopicService.totalReplies(data.key) + 1)
        });
    }
}

module.exports = TopicViewBuilder;