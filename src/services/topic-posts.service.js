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

const Logger = require('../log/logger');
const DataStore = require('../datastore/datastore');
const NotFoundError = require('../errors/not-found.error');
const { renderPartial } = require('../helpers/output.helper');
const LikeService = require('../likes/like.service');
const { formatDateTime } = require('../datetime/datetime.service');
const PostRespository = require('../repository/post.repository');
const RenderService = require('./render.service');
const UNB_SETTING_KEYS = require('../settings/settings.keys');
const DateTimeService = require('../datetime/datetime.service');

/**
 * UNB topic posts service
 * 
 * This service handles the infinite scroll for displaying posts for a topic.
 */
class TopicPostsService {
    /**
     * Get the window for posts in the topic.
     * 
     * @param {object} params - Parameters for retrieving the posts window.
     * @param {string} params.topicKey - The topic key name.
     * @param {("after"|"before"|"around")} [params.mode='around'] - Optional mode override (default is `around`).
     * @param {number|null} params.center - The post number to center the window around.
     * @param {number} [params.limit=50] - Optional limit for the total posts to get (default is `50`).
     * @param {boolean} [params.build=false] - `true` to build the HTML for the posts, `false` not to (default is `false`).
     * @returns {Promise<{
     *      meta: {
     *          maxPostNumber: number,
     *          hasMoreAbove: boolean,
     *          hasMoreBelow: boolean
     *      },
     *      posts: []
     * }>} A promise that resolves to the meta and posts.
     * @throws {NotFoundError} If the topic key was not supplied.
     */   
    static async getWindow({ topicKey, mode = 'around', center, limit = 50, build = false }) {
        try {
            const {
                db,
                localeService,
                membersService,
                onlineTrackerService,
                req,
                settingsService
            } = DataStore.get('unb');

            const postsRepo = db?.repo?.posts;

            if (!topicKey) {
                throw new NotFoundError(await localeService.t('error.topic.posts.service.topic.key.required'), { topicKey, mode, center, limt });
            }

            limit = Math.min(Math.max(limit, 1), 200);

            const meta = await postsRepo.getMeta(topicKey);
            const maxPostNumber = meta?.maxPostNumber ?? 0;

            if (maxPostNumber === 0) {
                return {
                    meta: {
                        maxPostNumber: 0,
                        hasMoreAbove: false,
                        hasMoreBelow: false
                    },
                    posts: []
                };
            }

            if (!center || center <= 0) {
                center = maxPostNumber;
            }

            let posts;

            switch (mode) {
                case 'after':
                    posts = await postsRepo.getAfter(topicKey, center, limit);
                    break;

                case 'before':
                    posts = await postsRepo.getBefore(topicKey, center, limit);
                    break;

                case 'around':
                    posts = await postsRepo.getAround(topicKey, center, limit);
                    break;

                default:
                    posts = await postsRepo.getAround(topicKey, center, limit);
                    break;
            }

            if (!posts.length) {
                return {
                    meta: {
                        maxPostNumber,
                        hasMoreAbove: false,
                        hasMoreBelow: false
                    },
                    posts: []
                };
            }

            const firstPostNumber = posts[0].postNumber;
            const lastPostNumber = posts[posts.length - 1].postNumber;
            let built = null;

            const gapEnabled = await settingsService.get(UNB_SETTING_KEYS.POSTS_TIMELINE_GAP_ENABLED);
            const gapSeconds = await settingsService.get(UNB_SETTING_KEYS.POSTS_TIMELINE_GAP_SECONDS);

            posts = await Promise.all(
                posts.map(async p => await PostRespository.getByKey(p.key))
            );

            if (build) {
                built = [];
                let previousTimestamp = null;

                for (const post of posts) {
                    const author = await membersService.get(post.createdBy);
                    const gap = { insert: false, diff: null };

                    if (gapEnabled && previousTimestamp) {
                        const diffSeconds = post.createdAt - previousTimestamp / 1000;

                        if (diffSeconds >= gapSeconds) {
                            gap.insert = true;
                            gap.diff = DateTimeService.formatTimeGap(previousTimestamp, post.createdAt);
                        }

                        previousTimestamp = post.createdAt;
                    }

                    built.push(await renderPartial('posts/post-item', {
                        post: {
                            author: {
                                photo: await membersService.profilePhoto(author.key, { type: 'thumbnail' }),
                                link: await membersService.profileLink(author),
                                groups: await membersService.buildGroupBadges(author),
                                guest: await membersService.isGuest(author),
                                online: onlineTrackerService.isOnline(author.key)
                            },
                            t: req.t,
                            likeButton: await LikeService.build('post', post.key),
                            postKey: post.key,
                            posted: await localeService.t('posts.posted', { timestamp: await formatDateTime(post.createdAt, { timeAgo: true })}),
                            content: RenderService.renderEditorContent(post.content),
                            gap
                        }
                    }));
                }
            }

            return {
                meta: {
                    maxPostNumber,
                    hasMoreAbove: firstPostNumber > 1,
                    hasMoreBelow: lastPostNumber < maxPostNumber
                },
                posts: built ? built : posts
            };
        } catch (error) {
            console.log(error);
            Logger.error('TopicPostsService.getWindow', `Failed to get post window: ${error}`, { error });
            throw error;
        }
    }
}

module.exports = TopicPostsService;