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

const { formatApiResponse } = require("../helpers/api.helper");
const FilterService = require("../services/filter.service");
const SortService = require("../services/sort.service");
const UNB_SETTING_KEYS = require("../settings/settings.keys");
const TopicViewBuilder = require("../topics/topic.view.builder");
const Logger = require('../log/logger');
const TopicPostsService = require("../services/topic-posts.service");
const ApiService = require("../services/api.service");
const LikeService = require("../likes/like.service");
const OutputService = require("../services/output.service");

/**
 * UNB API model
 * 
 * Model for the UNB API.
 */
class ApiModel {
    /**
     * Handles the index of the bulletin board.
     * 
     * @param {object} req - The request object from `Express`.
     * @param {object} res - The response object from `Express`.
     * @param {NextFunction} next - The next middleware to execute. 
     * @returns {Promise<object>} A promise that resolves to the JSON to send to the client.
     */
    async ui(req, res, next) {
        const { mode = 'config' } = req.query;
        const { localeService } = req.app.locals;

        switch (mode) {
            case 'config':
                return formatApiResponse(true, {
                    payload: await this.buildConfig(req)
                });

            default:
                return formatApiResponse(false, {
                    error: await localeService.t('error.api.ui.invalid.mode', { mode })
                });
        }
    }

    /**
     * Build the UI configuration payload.
     * 
     * @param {object} req - The request object from `Express`.
     * @returns {Promise<object>} A promise that resolves to the UI configuration.
     */
    async buildConfig(req) {
        const { localeService, settingsService, member } = req.app.locals;

        return {
            urls: {
                base: process.env.UNB_BASE_URL,
                api: `${process.env.UNB_BASE_URL}/api`,
                assets: member.configs.assetUrl
            },

            locale: {
                global: {
                    toggleToDarkMode: await localeService.t('global.toggle.dark.mode'),
                    toggleToLightMode: await localeService.t('global.toggle.light.mode')
                },
                index: {
                    sortLatest: await localeService.t('sort.latest'),
                    sortTop: await localeService.t('sort.top'),
                    sortNewest: await localeService.t('sort.newest'),
                    sortOldest: await localeService.t('sort.oldest'),
                    sortLikes: await localeService.t('sort.likes'),
                    filterAll: await localeService.t('filters.all'),
                    filterUnread: await localeService.t('filters.unread'),
                    filterRead: await localeService.t('filters.read'),
                    filterAnswered: await localeService.t('filters.answered'),
                    filterUnanswered: await localeService.t('filters.unanswered'),
                    filterHot: await localeService.t('filters.hot'),
                    filterPinned: await localeService.t('filters.pinned'),
                    filterUnpinned: await localeService.t('filters.unpinned'),
                    filterLocked: await localeService.t('filters.locked'),
                    filterUnlocked: await localeService.t('filters.unlocked')
                },
                auth: {
                    showPasswordTooltip: await localeService.t('auth.form.password.toggle.show.tooltip'),
                    hidePasswordTooltip: await localeService.t('auth.form.password.toggle.hide.tooltip')
                },
                common: {
                    default: await localeService.t('common.default')
                },
                error: {
                    editor: {
                        hyperlinkUrlRequired: await localeService.t('error.hyperlink.url.required')
                    }
                },
                editor: {
                    gif: {
                        none: await localeService.t('editor.tools.insert.gif.none')
                    },
                    emoji: {
                        none: await localeService.t('error.editor.insert.emoji.none'),
                        failed: await localeService.t('error.editor.insert.emoji.load.failed'),
                        subgroups: await localeService.t('error.editor.tools.insert.emoji.emoji.subgroup.all')
                    },
                    code: await localeService.t('editor.tools.insert.code.blockquote.title')
                }
            },

            settings: {
                logoType: await settingsService.get(UNB_SETTING_KEYS.COMMUNITY_LOGO_TYPE),
                logoLight: await settingsService.get(UNB_SETTING_KEYS.COMMUNITY_LOGO_LIGHT),
                logoDark: await settingsService.get(UNB_SETTING_KEYS.COMMUNITY_LOGO_DARK)
            }
        };
    }

    /**
     * Fetch topics.
     * 
     * @param {object} req - The request object from `Express`.
     * @param {object} res - The response object from `Express`.
     * @param {NextFunction} next - The next middleware to execute. 
     * @returns {Promise<object>} A promise that resolves to the JSON to send to the client.
     */
    async fetchTopics(req, res, next) {
        const { forum, page } = req.query;
        const { db, member, forumsService, localeService } = req.app.locals;
        const filters = {};

        const totalBeforeFilter = await db.repo.topics.total();

        if (forum) {
            const forumEntity = await forumsService.get(forum);

            if (forumEntity) {
                filters.forumKey = forumEntity.key;
            }
        }

        const resolvedFilter = await FilterService.getTopicFilterSpec(req);
        const resolvedSort = await SortService.getTopicSortSpec(req);

        if (resolvedFilter.append) {
            filters[resolvedFilter.append.key] = resolvedFilter.append.value;
        }
        
        let topics = await db.repo.topics.getForListing(member, filters, page);
        topics = await FilterService.filterTopics(req, resolvedFilter.filter, topics);
        topics = await SortService.sortTopics(resolvedSort, topics);

        let html = '';

        if (Array.isArray(topics) && topics.length) {
            for (const topic of topics) {
                html += await TopicViewBuilder.build(req, topic);
            }
        }

        const source = (topics.length === 0 && totalBeforeFilter > 0)
            ? await localeService.t('index.no.topics.by.filter')
            : html;

        const hasMore = topics.length === member.settings.pagination.limit.topics;
        let pageNumber = parseInt(page, 10);

        return formatApiResponse(true, {
            topics: source,
            hasMore,
            page: hasMore ? pageNumber + 1 : pageNumber
        });
    }

    /**
     * Handle all GIPHY requests.
     * 
     * @param {object} req - The request object from `Express`.
     * @param {object} res - The response object from `Express`.
     * @param {NextFunction} next - The next middleware to execute. 
     * @returns {Promise<object>} A promise that resolves to the JSON to send to the client.
     */
    async giphy(req, res, next) {
        const { mode, q, offset = 0 } = req.query;
        const { settingsService, localeService } = req.app.locals;

        try {
            const MAX_PER_REQUEST = 50;
            const apiKey = await settingsService.get(UNB_SETTING_KEYS.EDITOR_GIPHY_API_KEY);
            const limit = await settingsService.get(UNB_SETTING_KEYS.EDITOR_GIPHY_LIMIT);

            if (!apiKey) {
                return formatApiResponse(false, { error: await localeService.t('error.api.giphy.api.key.missing') });
            }

            let url = null;

            switch (mode) {
                case 'search':
                    url = `https://api.giphy.com/v1/gifs/search?api_key=${encodeURIComponent(apiKey)}&q=${encodeURIComponent(q)}&limit=${limit}&offset=${offset}&lang=en`;
                    break;

                case 'trending':
                    url = `https://api.giphy.com/v1/gifs/trending?api_key=${encodeURIComponent(apiKey)}&offset=${offset}`;
                    break;

                default:
                    return formatApiResponse(false, { error: await localeService.t('error.api.giphy.invalid.mode', { mode }) });
            }

            const r = await fetch(url);
            const json = await r.json();

            return formatApiResponse(true, {
                data: json.data || []
            });
        } catch (error) {
            Logger.error('ApiModel.Giphy', `Giphy API request failed: ${error}.`, { error });
            return formatApiResponse(false, { error: await localeService.t('error.api.giphy.failed') });
        }
    }

    /**
     * Handle emoji requests.
     * 
     * @param {object} req - The request object from `Express`.
     * @param {object} res - The response object from `Express`.
     * @param {NextFunction} next - The next middleware to execute. 
     * @returns {Promise<object>} A promise that resolves to the JSON to send to the client.
     */
    async emoji(req, res, next) {
        const { localeService } = req.app.locals;

        try {
            const { mode, q, group, subgroup } = req.query;
            const { localeService, emojiService } = req.app.locals;

            if (mode === 'categories') {
                return formatApiResponse(true, {
                    data: emojiService.buildCategoriesPayload()
                });
            }

            if (mode === 'category') {
                const _group = String(group || '').trim();
                const _subgroup = String(subgroup || '').trim();

                if (!_group) {
                    return formatApiResponse(false, {
                        error: await localeService.t('editor.insert.emoji.missing.group.parameter')
                    });
                }

                const items = emojiService.getCategoryItems(_group, _subgroup);

                return formatApiResponse(true, {
                    data: {
                        group: _group,
                        subgroup: _subgroup || null,
                        items
                    }
                });
            }

            if (mode === 'search') {
                const _q = String(q || '').trim();

                if (!_q) {
                    return formatApiResponse(true, {
                        data: {
                            q: '',
                            items: []
                        }
                    });
                }

                const results = emojiService.searchEmoji(_q);

                return formatApiResponse(true, {
                    data: {
                        q: _q,
                        items: results
                    }
                });
            }

            return formatApiResponse(false, {
                error: await localeService.t('editor.insert.emoji.api.error')
            });
        } catch (error) {
            Logger.error('ApiModel', `API model failed: ${error}.`, { error });

            return formatApiResponse(false, {
                error: await localeService.t('error.editor.insert.emoji.api.error')
            });
        }
    }

    /**
     * Handles loading posts for a topic.
     * 
     * @param {object} req - The request object from `Express`.
     * @param {object} res - The response object from `Express`.
     * @param {NextFunction} next - The next middleware to execute. 
     * @returns {Promise<object>} A promise that resolves to the JSON to send to the client.
     */
    async posts(req, res, next) {
        const { topicKey } = req.params;
        const { center, mode = 'around', limit = 50 } = req.query;

        return formatApiResponse(true, {
            result: await TopicPostsService.getWindow({
                topicKey,
                mode,
                center: center ? Number(center) : undefined,
                limit: limit ? Number(limit) : undefined,
                build: true
            }),
        });
    }

    /**
     * Like/unlike content.
     * 
     * @param {object} req - The request object from `Express`.
     * @param {object} res - The response object from `Express`.
     * @param {NextFunction} next - The next middleware to execute. 
     * @returns {Promise<object>} A promise that resolves to the JSON to send to the client.
     */
    async likeUnlike(req, res, next) {
        const { localeService, member } = req.app.locals;

        try {
            if (!member.signedIn) {
                return formatApiResponse(false, {
                    error: await localeService.t('error.api.like.not.member')
                });
            }

            const { action } = req.body;

            if (!action || typeof action !== 'string') {
                return formatApiResponse(false, {
                    error: await localeService.t('error.api.like.missing.action')
                });
            }

            let result;

            switch (action.toLowerCase()) {
                case 'like':
                    result = await ApiService.likeUnlike(req, 'like');

                    if (result.ok) {
                        return formatApiResponse(true, {
                            
                        });
                    } else {
                        return formatApiResponse(false, {
                            error: await localeService.t('error.api.like.failed.to.like')
                        });
                    }
                case 'unlike':
                    result = await ApiModel.likeUnlike(req, 'unlike');

                    if (result.ok) {
                        return formatApiResponse(true, {

                        });
                    } else {
                        return formatApiResponse(false, {
                            error: await localeService.t('error.api.like.failed.to.unlike')
                        });
                    }
                default:
                    return formatApiResponse(false, {
                        error: await localeService.t('error.api.like.invalid.action', { action })
                    });
            }
        } catch (error) {
            Logger.error('ApiModal.likeUnlike', `ApiModel.likeUnlike failed: ${error}.`, { error });

            return formatApiResponse(false, {
                error: await localeService.t('error.api.like.failed')
            });
        }
    }

    /**
     * Get the likes listing for content.
     * 
     * @param {object} req - The request object from `Express`.
     * @param {object} res - The response object from `Express`.
     * @param {NextFunction} next - The next middleware to execute. 
     * @returns {Promise<object>} A promise that resolves to the JSON to send to the client.
     */
    async getLikes(req, res, next) {
        const { localeService } = req.app.locals;

        try {
            const { contentType, contentKey } = req.query;

            if (!contentType || !contentKey || typeof contentType !== 'string' || typeof contentKey !== 'string') {
                return formatApiResponse(false, {
                    error: await localeService.t('error.api.like.list.invalid')
                });
            }

            const likesList = await LikeService.buildLikeList(contentType, contentKey);

            if (likesList && likesList.length) {
                let html = '';

                for (const like of likesList) {
                    html += await OutputService.getPartial('likes/like-item', {
                        post: like
                    });
                }

                return formatApiResponse(true, {
                    list: html
                });
            } else {
                return formatApiResponse(true, {
                    list: await localeService.t('api.no.likes.to.display')
                });
            }
        } catch (error) {
            Logger.error('ApiModel.getLikes', `ApiMode.getLikes failed: ${error}.`, { error });

            return formatApiResponse(false, {
                error: await localeService.t('error.api.like.list.failed')
            });
        }
    }
}

module.exports = ApiModel;