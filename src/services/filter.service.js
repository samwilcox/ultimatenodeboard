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

const { sessionVarExists, getSessionVar, setSessionVar } = require("../session/session.helper");
const UNB_SESSION_KEYS = require("../session/session.keys");
const TopicService = require("../topics/topic.service");
const ContentTrackerService = require("./content-tracker.service");

/**
 * UNB filter service
 * 
 * Service for filtering various content.
 */
class FilterService {
    /**
     * Filter topics.
     * 
     * @param {object} req - The request object from `Express`.
     * @returns {Promise<object>} A promise that resolves to the filtered topics.
     */
    static async getTopicFilterSpec(req) {
        let filter = 'all';

        if (this.validateTopicFilter(req.query?.filter)) {
            filter = req.query.filter;
            setSessionVar(req, UNB_SESSION_KEYS.TOPICS_FILTER, filter);
        } else if (sessionVarExists(req, UNB_SESSION_KEYS.TOPICS_FILTER)) {
            filter = getSessionVar(req, UNB_SESSION_KEYS.TOPICS_FILTER);
        }

        switch (filter) {
            case 'pinned':
                return {
                    filter,
                    append: {
                        key: 'pinned',
                        value: true
                    }
                }; 
            case 'unpinned':
                return {
                    filter,
                    append: {
                        key: 'pinned',
                        value: false
                    }
                }; 
            case 'locked':
                return {
                    filter,
                    append: {
                        key: 'locked',
                        value: true
                    }
                }; 
            case 'unlocked':
                return {
                    filter,
                    append: {
                        key: 'locked',
                        value: false
                    }
                }; 
            default:
                return {
                    filter,
                    append: null
                };
        }
    }

    /**
     * Validate a topic filter.
     * 
     * @param {string} filter - The filter to validate.
     * @returns {boolean} `true` if valid topic filter, `false` if not.
     */
    static validateTopicFilter(filter) {
        if (!filter || typeof filter !== 'string') return false;

        const allowedFilters = [
            'all',
            'unread',
            'read',
            'answered',
            'unanswered',
            'hot',
            'pinned',
            'unpinned',
            'locked',
            'unlocked'
        ];

        return allowedFilters.includes(filter);
    }

    /**
     * Filter topics.
     * 
     * @param {object} req - The request object from `Express`.
     * @param {string} mode - The filter mode. 
     * @param {object[]} topics - The topics array.
     * @returns {Promise<object[]>} A promise that resolves to an array of topic data objects. 
     */
    static async filterTopics(req, mode, topics) {
        if (!mode || typeof mode !== 'string' || !Array.isArray(topics)) return [];
        let filtered = [];

        const { forumsService } = req.app.locals;

        switch (mode) {
            case 'unread':
                for (const topic of topics) {
                    const unread = await ContentTrackerService.isUnread(req, 'topic', topic.key, await TopicService.getLastPost(topic.key).createdAt);

                    if (unread) {
                        filtered.push(topic);
                    }
                }

                return filtered;

            case 'read':
                for (const topic of topics) {
                    const unread = await ContentTrackerService.isUnread(req, 'topic', topic.key, await TopicService.getLastPost(topic.key).createdAt);

                    if (!unread) {
                        filtered.push(topic);
                    }
                }

                return filtered;

            case 'answered':
                for (const topic of topics) {
                    if (topic.solution?.solution) {
                        filtered.push(topic);
                    }
                }

                return filtered;

            case 'unanswered':
                for (const topic of topics) {
                    if (!topic.solution?.solution) {
                        filtered.push(topic);
                    }
                }

                return filtered;

            case 'hot':
                for (const topic of topics) {
                    const forum = await forumsService.get(topic.forumKey);
                    if (!forum) return topics;

                    const theshold = forum.hotThreshold;
                    const replies = await TopicService.totalReplies(topic.key);

                    if (replies >= theshold) {
                        filtered.push(topic);
                    }
                }

                return filtered;

            default:
                return topics;
        }
    }
}

module.exports = FilterService;