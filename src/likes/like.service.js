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
const { formatDateTime } = require('../datetime/datetime.service');
const { formatNumberCompact } = require('../helpers/number.helper');
const LikeRespository = require('../repository/like.repository');
const { getPartial } = require('../services/output.service');

/**
 * UNB like service
 * 
 * Service for handling likes.
 */
class LikeService {
    /**
     * Check if a member liked the given content.
     * 
     * @param {("topic"|"post"|"comment")} contentType - The content type.
     * @param {string} contentKey - The content key name. 
     * @param {Member|string} member - Either the member key name or the member entity instance.
     * @returns {Promise<boolean>} A promise that resolves to either:
     *                             `true` if the member likes the content.
     *                             `false` if the member has not liked the content.
     * 
     * @example
     * likesContent('topic', 'topic_123456', 'member_123'); // true
     */
    static async likesContent(contentType, contentKey, member) {
        const {
            membersService,
            cacheProviderService,
            db
        } = DataStore.get('unb');

        member = await membersService.resolve(member);

        if (!member) return false;

        const cacheKey = UNB_CACHE_KEYS.MEMBER_LIKED
            .replace('{contentType}', contentType)
            .replace('{contentKey}', contentKey)
            .replace('{memberKey}', member.key);

        return await cacheProviderService.get(cacheKey, async () => {
            const likes = await db?.repo?.likes?.getByQuery({
                contentType,
                contentKey,
                likedBy: member.key
            });

            if (!likes || likes.length === 0) return false;

            return true;
        });
    }

    /**
     * Get the total likes for given content.
     * 
     * @param {("topic"|"post"|"comment")} contentType - The content type.     
     * @param {string} contentKey - The content key.
     * @returns {Promise<{
     *      raw: number,
     *      formatted: string
     * }} A promise that resolves to an object containing the total likes for
     *    the given content. 
     */
    static async totalLikesForContent(contentType, contentKey) {
        const {
            cacheProviderService,
            db
        } = DataStore.get('unb');

        const cacheKey = UNB_CACHE_KEYS.TOTAL_LIKES
            .replace('{contentType}', contentType)
            .replace('{contentKey}', contentKey);

        return await cacheProviderService.get(cacheKey, async () => {
            const likes = await db?.repo?.likes?.getByQuery({
                contentType,
                contentKey
            });

            if (!likes) return { raw: 0, formatted: '0' };

            return {
                raw: likes.length,
                formatted: formatNumberCompact(likes.length)
            };
        });
    }

    /**
     * Build the likes list for given content.
     * 
     * @param {("topic"|"post"|"comment")} contentType - The content type. 
     * @param {string} contentKey - The content key.
     * @returns {Promise<([{
     *      author: {
     *          link: string,
     *          photo: string
     *      },
     *      likedAt: string
     * }]|null)>} A promise that resolves to an array of likes or `null` if
     *           there are no likes. 
     */
    static async buildLikeList(contentType, contentKey) {
        const totalLikes = await LikeService.totalLikesForContent(contentType, contentKey);
        if (totalLikes.raw === 0) return null;

        const {
            db,
            membersService
        } = DataStore.get('unb');

        const list = [];

        const likes = await Promise.all(
            await db?.repo?.likes?.getByQuery({
                contentType,
                contentKey,
                private: false
            }).map(async l => await LikeRespository.getByKey(l.key))
        );

        if (!likes) return null;

        likes.sort((a, b) => (b.likedAt).getTime() - (a.likedAt).getTime());

        for (const like of likes) {
            const author = await membersService.get(like.likedBy);

            if (author) {
                list.push({
                    author: {
                        link: await membersService.profileLink(author),
                        photo: await membersService.profilePhoto(author.key, { type: 'thumb' })
                    },
                    likedAt: await formatDateTime(like.likedAt, { timeAgo: true })
                });
            }
        }

        return list;
    }

    /**
     * Like content.
     * 
     * @param {("topic"|"post"|"comment")} contentType - The content type. 
     * @param {string} contentKey - The content key. 
     * @param {boolean} prvt - `true` to hide the like from the list, `false` to show the like
     *                            in the list.
     * @param {Member|string|null} [member=null] - Optional member key or entity (default is `null`). 
     * @returns {Promise<{
     *      ok: boolean,
     *      message: (string|null)
     * }>} A promise that resolves to the result of the like.
     */
    static async likeContent(contentType, contentKey, prvt, member = null) {
        const { db, localeService } = DataStore.get('unb');

        if (!member) {
            member = DataStore.get('unb')?.member;

            if (!member) return {
                ok: false,
                message: await localeService.t('error.like.service.member.not.resolved')
            };
        } else {
            const { membersService } = DataStore.get('unb');
            member = await membersService.resolve(member);

            if (!member) return {
                ok: false,
                message: await localeService.t('error.like.service.member.not.resolved')
            };
        }

        if (!member.signedIn) {
            return {
                ok: false,
                message: await localeService.t('error.like.service.member.only')
            };
        }

        const liked = await LikeService.likesContent(contentType, contentKey, member);

        if (liked) {
            return {
                ok: false,
                message: await localeService.t('error.like.service.liked')
            };
        }

        await db?.repo?.likes?.create({
            contentType,
            contentKey,
            likedBy: member.key,
            likedAt: new Date(),
            private: prvt
        });

        return { ok: true };
    }

    /**
     * Unlike content.
     *  
     * @param {"topic"|"post"|"comment"} contentType - The content type to unlike. 
     * @param {string} contentKey - The content key to unlike. 
     * @param {(Member|string|null)} [member=null] - Optional member key or entity.
     *                                               Default is `null`.
     * @returns {Promise<{
     *      ok: boolean,
     *      message: (string|null)
     * }>} A promise that resolves to the result of the unlike. 
     */
    static async unlikeContent(contentType, contentKey, member = null) {
        const { db, localeService } = DataStore.get('unb');

        if (!member) {
            member = DataStore.get('unb')?.member;

            if (!member) return {
                ok: false,
                message: await localeService.t('error.like.service.member.not.resolved')
            };
        } else {
            const { membersService } = DataStore.get('unb');
            member = await membersService.resolve(member);

            if (!member) return {
                ok: false,
                message: await localeService.t('error.like.service.member.not.resolved')
            };
        }

        if (!member.signedIn) {
            return {
                ok: false,
                message: await localeService.t('error.like.service.member.only')
            };
        }

        const liked = await LikeService.likesContent(contentType, contentKey, member);

        if (!liked) {
            return {
                ok: false,
                message: await localeService.t('error.api.like.not.liked')
            };
        }

        await db?.repo?.likes?.delete({ contentType, contentKey, likedBy: member.key });

        return { ok: true };
    }

    /**
     * Build the like button.
     * 
     * @param {("topic"|"post"|"comment")} contentType - The content type. 
     * @param {string} contentKey - The content key name.
     * @param {boolean} [build=false] - `true` to build the HTML for the button.
     *                                  `false` to build the data object for the button.
     * @returns {Promise<({
     *      hasLiked: boolean,
     *      
     * }|string)>} A promise that resolves to the like component data object or the HTML
     *             source for the button. 
     */
    static async build(contentType, contentKey, build = false) {
        const { member, localeService } = DataStore.get('unb');

        const liked = await LikeService.likesContent(contentType, contentKey, member);

        if (build) {
            return await getPartial('likes/button', {
                button: {
                    hasLiked: liked,
                    totalLikes: (await LikeService.totalLikesForContent(contentType, contentKey)).formatted,
                    signedIn: member.signedIn,
                    label: liked
                        ? await localeService.t('common.unlike')
                        : await localeService.t('common.like'),
                    contentType,
                    contentKey
                }
            });
        } else {
            return {
                hasLiked: liked,
                totalLikes: (await LikeService.totalLikesForContent(contentType, contentKey)).formatted,
                signedIn: member.signedIn,
                label: liked
                    ? await localeService.t('common.unlike')
                    : await localeService.t('common.like'),
                contentType,
                contentKey
            };
        }
    }
}

module.exports = LikeService;