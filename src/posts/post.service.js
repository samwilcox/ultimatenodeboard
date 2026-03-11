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

const Topic = require("../topics/topic.entity");
const DataStore = require('../datastore/datastore');
const UNB_CACHE_KEYS = require("../data/cache/cache.keys");
const TopicService = require("../topics/topic.service");

/**
 * UNB post service
 * 
 * This service handles forum posts.
 */
class PostService {
    /**
     * Get the post for a given topic and mode.
     * 
     * @param {Topic} topic - The topic entity instance. 
     * @param {"answered"} [mode='answered'] - The mode.
     * @returns {Promise<string|null>} A promise that resolves to either the post key or
     *                                 `null` if topic is not found. 
     */
    static async getPostForTopic(topic, mode = 'answered') {
        if (!topic || !(topic instanceof Topic)) return null;

        const { db, cacheProviderService } = DataStore.get('unb');
        let cacheKey;

        if (mode === 'answered') {
            cacheKey = UNB_CACHE_KEYS.TOPIC_FILTER_TO_POST_MAP
                .replace('{mode}', mode)
                .replace('{topicKey}', topic.key);

            return await cacheProviderService.get(
                cacheKey,
                async () => {
                    if (topic?.solution?.solution && topic?.solution?.postKey) {
                        return topic.solution.postKey;
                    }

                    return null;
                }
            );
        } else if (mode === 'pinned') {
            cacheKey = UNB_CACHE_KEYS.TOPIC_FILTER_TO_POST_MAP
                .replace('{mode}', mode)
                .replace('{topicKey}', topic.key);

            return await cacheProviderService.get(
                cacheKey,
                async () => {
                    const post = await db.repo.posts.getOneByQuery({
                        topicKey: topic.key,
                        isFirstPost: true
                    });

                    if (!post || !post?.key) return null;

                    return post.key;
                }
            );
        }
    }
}

module.exports = PostService;