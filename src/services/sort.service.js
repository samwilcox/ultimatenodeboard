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

const { spread } = require("axios");
const { normalizeTimestamp } = require("../helpers/normalize.helper");
const LikeService = require("../likes/like.service");
const PostRespository = require("../repository/post.repository");
const TopicRespository = require("../repository/topic.repository");
const { sessionVarExists, getSessionVar, setSessionVar } = require("../session/session.helper");
const UNB_SESSION_KEYS = require("../session/session.keys");
const TopicService = require("../topics/topic.service");

/**
 * UNB sort service
 * 
 * Service for sorting various content.
 */
class SortService {
    /**
     * Sort topics.
     * 
     * @param {object} req - The request from `Express`.
     * @param {object[]} topics - The topics to sort.
     * @returns {Promise<[{
     *      orderBy: string,
     *      direction: string     
     * }]|null} A promise that resolves to an array of sorted topic-post data or `null` if no topics/posts.
     */
    static async getTopicSortSpec(req) {
        let sort = 'latest';

        if (this.validateTopicSort(req.query?.sort)) {
            sort = req.query.sort;
            setSessionVar(req, UNB_SESSION_KEYS.TOPICS_SORT, sort);
        } else if (sessionVarExists(req, UNB_SESSION_KEYS.TOPICS_SORT)) {
            sort = getSessionVar(req, UNB_SESSION_KEYS.TOPICS_SORT);
        }

        return sort;
    }

    /**
     * Helper that validates whether a sort is valid for topics.
     * 
     * @private
     * @param {string} sort - The sort to validate.
     * @returns {boolean} `true` if a valid sort, `false` if not.
     */
    static validateTopicSort(sort) {
        if (!sort || typeof sort !== 'string') return false;

        const allowedSorts = [
            'latest',
            'top',
            'newest',
            'oldest',
            'likes',
        ];

        return allowedSorts.includes(sort);
    }

    /**
     * Sort topics.
     * 
     * @param {"latest"} mode - The mode to sort by. 
     * @param {object[]} topics - The array of topics to sort.
     * @returns {Promise<object[]>} A promise that resolves to an array of topic objects. 
     */
    static async sortTopics(mode, topics) {
        if (!mode || typeof mode !== 'string' || !Array.isArray(topics)) return [];
        let sorted = [];
        let sortedTopics = [];

        switch (mode) {
            case 'latest':
                sortedTopics = [];

                for (const topic of topics) {
                    const lastPostAt = await TopicService.getLastPost(topic.key);

                    sortedTopics.push({
                        topic,
                        lastPostAt: lastPostAt.createdAt
                    });
                }

                sortedTopics.sort((a, b) => b.lastPostAt.getTime() - a.lastPostAt.getTime());
                sorted = sortedTopics.map(t => t.topic);

                return sorted;

            case 'top':
                sortedTopics = [];

                for (const topic of topics) {
                    const replies = await TopicService.totalReplies(topic.key);

                    sortedTopics.push({
                        topic,
                        replies
                    });
                }

                sortedTopics.sort((a, b) => b.replies - a.replies);
                sorted = sortedTopics.map(t => t.topic);

                return sorted;

            case 'newest':
                sortedTopics = [];

                for (const topic of topics) {
                    sortedTopics.push({
                        topic,
                        date: topic.createdAt
                    });
                }

                sortedTopics.sort((a, b) => b.date.getTime() - a.date.getTime());
                sorted = sortedTopics.map(t => t.topic);

                return sorted;

            case 'oldest':
                sortedTopics = [];

                for (const topic of topics) {
                    sortedTopics.push({
                        topic,
                        date: topic.createdAt
                    });
                }

                sortedTopics.sort((a, b) => a.date.getTime() - b.date.getTime());
                sorted = sortedTopics.map(t => t.topic);

                return sorted;

            case 'likes':
                sortedTopics = [];

                for (const topic of topics) {
                    sortedTopics.push({
                        topic,
                        likes: await LikeService.totalLikesForContent('topic', topic.key)
                    });
                }

                sortedTopics.sort((a, b) => b.likes - a.likes);
                sorted = sortedTopics.map(t => t.topic);

                return sorted;

            default:
                return topics;
        }
    }
}

module.exports = SortService;