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

const UNB_CACHE_KEYS = require('../data/cache/cache.keys');
const DataStore = require('../datastore/datastore');
const { buildEntityUrl } = require('../helpers/entity.helper');
const { normalizeTimestamp } = require('../helpers/normalize.helper');
const { formatNumberCompact } = require('../helpers/number.helper');
const PostRespository = require('../repository/post.repository');
const TopicRespository = require('../repository/topic.repository');
const UNB_SETTING_KEYS = require('../settings/settings.keys');
const Tag = require('../tags/tag.entity');
const Topic = require('./topic.entity');

/**
 * UNB topic service
 * 
 * Service for topic-related operations.
 */
class TopicService {
    /**
     * Get the total replies for a topic.
     * 
     * @param {string} topicKey - The topic key name.
     * @returns {Promise<number>} The total replies for the given topic.
     */
    static async totalReplies(topicKey) {
        const { cacheProviderService, db } = DataStore.get('unb');
        const repo = db.repo;

        const totalReplies = await cacheProviderService.get(
            UNB_CACHE_KEYS.TOPIC_REPLIES.replace('{topicKey}', topicKey),
            async () => {
                const posts = await repo.posts.getByQuery({ topicKey });
                return posts && Array.isArray(posts) ? (posts.length - 1) : 0;
            }
        );

        return totalReplies;
    }

    /**
     * Get the last post info for a topic.
     * 
     * @param {string} topicKey - The topic key name.
     * @returns {Promise<object|null>} A promise that resolves to the last post information instance, or
     *                               `null` if not found.
     */
    static async getLastPost(topicKey) {
        const { cacheProviderService, db } = DataStore.get('unb');

        return await cacheProviderService.get(
            UNB_CACHE_KEYS.TOPIC_LAST_POST.replace('{topicKey}', topicKey),
            async () => {
                const posts = await db.repo.posts.getByQuery({ topicKey })
                posts.sort((a, b) => normalizeTimestamp(b.createdAt).getTime() - normalizeTimestamp(a.createdAt).getTime());
                const post = posts[0];

                if (!post) return null;

                return {
                    key: post.key,
                    createdAt: normalizeTimestamp(post.createdAt),
                };
            }
        );
    }

    /**
     * Get the topic view mode.
     * 
     * @param {string} filter - The selected filter.
     * @returns {"topic"|"post"} The view mode.
     */
    static getViewMode(filter) {
        switch (filter) {
            case 'all':
                return 'topic';

            case 'unread':
                return 'topic';

            case 'read':
                return 'topic';

            case 'answered':
                return 'post';

            case 'unanswered':
                return 'topic';

            case 'hot':
                return 'topic';

            case 'pinned':
                return 'post';

            case 'unpinned':
                return 'topic';

            case 'locked':
                return 'topic';

            case 'unlocked':
                return 'topic';

            default:
                return 'topic';
        }
    }

    /**
     * Resolve to the topic entity instance.
     * 
     * @param {Topic|string} topic - Either the topic entity or the topic key name.
     * @returns {Promise<Topic|null>} A promise that resolves to the topic entity instance. 
     */
    static async resolveTopic(topic) {
        if (!topic) return null;
        if (topic instanceof Topic) return topic;
        if (typeof topic === 'object') return await TopicRespository.getByKey(topic.key);
        if (typeof topic !== 'string') return null;
        return await TopicRespository.getByKey(topic);
    }

    /**
     * Check if a topic contains attachments.
     * 
     * @param {Topic|string} topic - Either the topic entity or the topic key name.
     * @returns {Promise<boolean>} A promise that resolves to either:
     *                             `true` if the topic has attachments.
     *                             `false` if the topic does not have attachments. 
     */
    static async haveAttachments(topic) {
        topic = await this.resolveTopic(topic);

        const { cacheProviderService, db } = DataStore.get('unb');

        return await cacheProviderService.get(
            UNB_CACHE_KEYS.TOPIC_HAS_ATTACHMENTS.replace('{topicKey}', topic.key),
            async () => {
                const posts = await db.repo.posts.getByQuery({ topicKey: topic.key });

                if (posts) {
                    for (const post of posts) {
                        const entity = await PostRespository.getByKey(post.key);

                        if (entity) {
                            if (entity.attachments && Array.isArray(entity.attachments)) {
                                return true;
                            }
                        }
                    }
                }

                return false;
            }
        );
    }

    /**
     * Get the total posts for a topic.
     * 
     * @param {Topic|string} topic - Either the topic entity or the topic key name.
     * @returns {Promise<{
     *      raw: number,
     *      formatted: string
     * }|null>} A promise that resolves to an object containing the raw total and formatted
     *          total or `null` if topic does not exist.
     */
    static async totalPosts(topic) {
        const { cacheProviderService, db } = DataStore.get('unb');

        topic = await this.resolveTopic(topic);
        if (!topic) return null;

        const repo = db?.repo?.posts;
        if (!repo) return null;

        const cacheKey = UNB_CACHE_KEYS.TOPIC_TOTAL_POSTS
            .replace('{topicKey}', topic.key);

        return await cacheProviderService.get(cacheKey, async () => {
            const posts = await repo.getByQuery({ topicKey: topic.key });
            
            return {
                raw: posts.length,
                formatted: formatNumberCompact(posts.length)
            };
        });
    }

    /**
     * Get the total unique posters in the topic.
     * 
     * @param {Topic|string} topic - Either the topic entity or the topic key name.
     * @returns {Promise<{
     *      raw: number,
     *      formatted: string
     * }|null>} A promise that resolves to an object containing the raw total and formatted
     *          total or `null` if topic does not exist.  
     */
    static async totalPosters(topic) {
        const { cacheProviderService, db } = DataStore.get('unb');

        topic = await this.resolveTopic(topic);
        if (!topic) return null;

        const repo = db?.repo?.posts;
        if (!repo) return null;

        const cacheKey = UNB_CACHE_KEYS.TOPIC_TOTAL_POSTERS
            .replace('{topicKey}', topic.key);

        return await cacheProviderService.get(cacheKey, async () => {
            const posts = await repo.getByQuery({ topicKey: topic.key });
            const posters = [];

            for (const post of posts) {
                if (!posters.includes(post.createdBy)) {
                    posters.push(post.createdBy);
                }
            }

            return {
                raw: posters.length,
                formatted: formatNumberCompact(posters.length)
            };
        });
    }

    /**
     * Get the tags for a topic.
     * 
     * @param {Topic|string} topic - Either the topic key or the topic key name.
     * @returns {Promise<{
     *      haveTags: boolean,
     *      tags: (Tag[]|null),
     *      truncated: {
     *          brief: (Tag[]|null),
     *          remaining: (Tag[]|null)
     *      }
     * }>} A promise that resolves to an object containing the tags for the topic.
     */
    static async getTags(topic) {
        const { cacheProviderService, tagsService, settingsService } = DataStore.get('unb');

        topic = await this.resolveTopic(topic);

        const cacheKey = UNB_CACHE_KEYS.TOPIC_TAGS
            .replace('{topicKey}', topic.key);

        return await cacheProviderService.get(cacheKey, async () => {
            const tagObj = {
                haveTags: false,
                tags: null,
                truncated: {
                    brief: null,
                    remaining: null
                },
                urls: []
            };

            if (!topic.tags) return tagObj;
            const tags = await tagsService.resolveFromList(topic.tags);
            if (tags.length < 1) return tagObj;

            for (const tag of tags) {
                tagObj.urls.push({
                    key: tag.key,
                    url: buildEntityUrl('tag', tag.key, tag.name)
                });
            }

            tagObj.haveTags = true;
            tagObj.tags = tags;

            const truncate = await settingsService.get(UNB_SETTING_KEYS.TOPIC_SERVICE_TAGS_TRUNCATE);
            const maxTags = await settingsService.get(UNB_SETTING_KEYS.TOPIC_SERVICE_TAGS_TRUNCATE_MAX_TAGS);

            if (truncate) {
                if (tags.length > maxTags) {
                    tagObj.truncated.brief = tags.slice(0, maxTags);
                    tagObj.truncated.remaining = tags.slice(maxTags);
                } else {
                    tagObj.truncated.brief = tags;
                    tagObj.truncated.remaining = [];
                }
            } else {
                tagObj.truncated.remaining = tags;
            }

            return tagObj;
        });
    }
}

module.exports = TopicService;