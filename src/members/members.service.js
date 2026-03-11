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

const { buildEntityUrl } = require('../helpers/entity.helper');
const Logger = require('../log/logger');
const MemberRespository = require('../repository/member.repository');
const OutputService = require('../services/output.service');
const UNB_SETTING_KEYS = require('../settings/settings.keys');
const DataStore = require('../datastore/datastore');
const UNB_CACHE_KEYS = require('../data/cache/cache.keys');
const { urlExists } = require('../helpers/url.helper');

/**
 * UNB members service.
 * 
 * Service for interfacing with members.
 */
class MembersService {
    /**
     * Create a new instance of `MembersService`.
     */
    constructor(localeService, settingsService, repo, cacheProviderService) {
        this._members = new Map();
        this._loaded = false;
        this._localeService = localeService;
        this._settingsService = settingsService;
        this._repo = repo;
        this._cacheProviderService = cacheProviderService;
    }

    /**
     * Load the members.
     */
    async load() {
        if (this._loaded) return;

        try {
            const members = await this._repo.members.getAll();

            for (const member of members) {
                const entity = await MemberRespository.getByKey(member.key, { repo: this._repo, settingsService: this._settingsService, cacheProviderService: this._cacheProviderService });

                if (entity) {
                    this._members.set(entity.key, entity);
                }
            }

            this._loaded = true;
        } catch (error) {
            Logger.error('MembersService', `Failed to load members: ${error}.`, { error, repo: this._repo });
            throw error;
        }
    }

    /**
     * Get the member entity instance for a member key.
     * 
     * @param {string} key - The member key.
     * @returns {Promise<Member|null>} A promise that resolves to either the Member entity instance of `null` if not found.
     */
    async get(key) {
        return await this.exists(key) ? this._members.get(key) : null;
    }

    /**
     * Check if a member key exists.
     * 
     * @param {string} key - The member key.
     * @returns {Promise<boolean>} A promise that resolves to either `true` if key exists, `false` if not.
     */
    async exists(key) {
        return this._members.has(key);
    }

    /**
     * Get all of the members.
     * 
     * @returns {Map} The entire members map.
     */
    all() {
        return { ...this._members };
    }

    /**
     * Get all of the members in a normal array.
     * 
     * @returns {array} The entire members array.
     */
    allArr() {
        const members = [];

        for (const [key, value] of this._members) {
            members.push(value);
        }

        return members;
    }

    /**
     * Resolve and get the entity for a member.
     * 
     * @param {Member|string} member - Either the member entity or the member key name.
     * @returns {Member|null} The resolved member entity or `null` if it could not be resolved.
     */
    async resolve(member) {
        if (typeof member === 'string') {
            return await this.get(member);
        }

        return member;
    }

    /**
     * Update the member in the memory cache.
     * 
     * @param {Member|string} member - Either the member entity or the member key name. 
     */
    async updateMember(member) {
        member = await this.resolve(member);
        this._members.set(member.key, member);
    }

    /**
     * Get the member entity for a given identity.
     * 
     * @param {string} identity - The member's identity (either email address or username).
     * @returns {Member|null} The member entity instance or `null` if the identity cannot be resolved.
     */
    resolveByIdentity(identity) {
        if (!identity || typeof identity !== 'string') return null;

        const members = this.allArr();
        const member = members?.find(m => m.emailAddress === identity || m.username === identity);
        
        if (!member) return null;

        return member;
    }

    /**
     * Get the name for a member.
     * 
     * @param {Member|string} member - Either the member entity or the member key name.
     * @returns {Promise<string|'Unknown'>} - A promise that resolves to the member's name or `Unknown` if the member does not exist.
     */
    async getName(member) {
        member = await this.resolve(member);
        if (!member) return await this._localeService.t('common.unknown');

        const allowDisplayName = await this._settingsService.get(UNB_SETTING_KEYS.MEMBER_ALLOW_DISPLAY_NAME);

        if (allowDisplayName && member.useDisplayName) {
            return member.displayName;
        }

        return member.username;
    }

    /**
     * Build the profile link for a member.
     * 
     * @param {Member|string} member - Either the member entity or the member key name.
     * @param {object} [options={}] - Options for building the profile link.
     * @param {string} [options.tooltip] - Optional tooltip text.
     * @param {"top"|"bottom"|"left"|"right"} [options.tooltipPosition='top'] - The position for the text tooltip (default is `top`).
     * @param {string|null} [options.separator=null] - Optional separator to separate this profile link from other links next to it.
     * @param {boolean} [options.includeTooltip=true] - `true` to include the text tooltip, `false` not to (default is `true`).
     * @returns {Promise<string|'Unknown'>} A promise that resolves to the profile link for the member or
     *                                      `Unknown` if the member does not exist.
     */
    async profileLink(member, options = {}) {
        member = await this.resolve(member);

        if (member) {
            const {
                tooltip = await this._localeService.t('member.service.profile.link.tooltip', { name: await this.getName(member) }),
                tooltipPosition = 'top',
                separator = null,
                includeTooltip = true
            } = options;

            return OutputService.getPartial('member/link', {
                name: await this.getName(member),
                url: buildEntityUrl('member', member.key, member.username),
                tooltip,
                tooltipPosition,
                separator,
                includeTooltip
            });
        }
    }

    /**
     * Get a member's profile photo.
     * 
     * @param {Member|string} memberKey - Either the member entity or the member key name.
     * @param {object} [options={}] - Options for the profile photo.
     * @param {"normal"|"thumbnail"|"mini"} [options.type='normal'] - The profile photo type to get (default is `normal`).
     * @param {boolean} [options.link=true] - `true` to include a link to the member's profile, `false` not to include a link (default is `true`). 
     * @param {boolean} [options.includeTooltip=true] - `true` to include a tooltip for the link (default is `true`).
     * @param {string} [options.tooltip=null] - Optional custom tooltip text (default is `null`).
     * @param {"top"|"bottom"|"left"|"right"} [options.tooltipPlacement='top'] - The placement for the tooltip text window.
     * @returns {Promise<string>} A promise that resolves to the member profile photo source HTML.
     */
    async profilePhoto(memberKey, options = {}) {
        const { type = 'normal' } = options;
        const { cacheProviderService } = DataStore.get('unb');

        if (!this._members.has(memberKey)) {
            return await this.handleNoPhoto(
                'G',
                null,
                options
            );
        }

        const member = this._members.get(memberKey);
        const firstLetter = (await this.getName(member)).substring(0, 1);

        if (!member.photo) {
            return await this.handleNoPhoto(
                firstLetter,
                member,
                options
            );
        }

        const photo = member.photo;

        switch (photo.type) {
            case 'uploaded':
                return await cacheProviderService.get(
                    UNB_CACHE_KEYS.PROFILE_PHOTOS
                        .replace('{type}', type)
                        .replace('{forumKey}', member.key),
                    async () => await this.handleUploadedPhoto(
                        member,
                        photo,
                        firstLetter,
                        options
                    )
                );
            case 'none':
                return await this.handleNoPhoto(
                    firstLetter,
                    member,
                    options
                );
            default:
                return await this.handleNoPhoto(
                    firstLetter,
                    member,
                    options
                );
        }
    }

    /**
     * Handles no photo profile photos.
     * 
     * @param {string} firstLetter - The first letter of the member's name.
     * @param {Member|null} member - Optional member entity (required if its a no photo for a member) (default is `null`). 
     * @param {object} [options={}] - Options for handling the no photo.
     * @param {string|null} [options.separator=null] - Optional separator to separate this profile link from other links next to it.
     * @param {boolean} [options.includeTooltip=true] - `true` to include the text tooltip, `false` not to (default is `true`).
     * @param {boolean} [options.includeTooltip=true] - `true` to include a tooltip for the link (default is `true`).
     * @param {string} [options.tooltip=null] - Optional custom tooltip text (default is `null`).
     * @param {"top"|"bottom"|"left"|"right"} [options.tooltipPlacement='top'] - The placement for the tooltip text window.
     * @returns {Promise<string>} A promise that resolves to the built no photo profile photo HTML source.
     */
    async handleNoPhoto(firstLetter, member = null, options = {}) {
        const { type = 'normal' } = options;
        const { cacheProviderService } = DataStore.get('unb');

        if (member) {
            return await cacheProviderService.get(
                UNB_CACHE_KEYS.PROFILE_PHOTOS
                    .replace('{type}', type)
                    .replace('{memberKey}', member.key),
                async () => await this.buildNoPhoto(firstLetter, options)
            );
        }

        return await this.buildNoPhoto(firstLetter, options);
    }

    /**
     * Handle uploaded member profile photo.
     * 
     * @param {Member} member - The member entity instance. 
     * @param {object} photo - The member's photo object. 
     * @param {string} firstLetter - The first letter of the member's name. 
     * @param {object} [options={}] - Options for the profile photo. 
     * @param {"normal"|"thumbnail"} [options.type='normal'] - The profile photo type to get (default is `normal`).
     * @param {boolean} [options.link=true] - `true` to include a link to the member's profile, `false` not to include a link (default is `true`). 
     * @param {boolean} [options.includeTooltip=true] - `true` to include a tooltip for the link (default is `true`).
     * @param {string} [options.tooltip=null] - Optional custom tooltip text (default is `null`).
     * @param {"top"|"bottom"|"left"|"right"} [options.tooltipPlacement='top'] - The placement for the tooltip text window.
     * @returns {Promise<string>} A promise that resolves to the built profile photo HTML source.
     */
    async handleUploadedPhoto(member, photo, firstLetter, options = {}) {
        const { settingsService, db } = DataStore.get('unb');

        const uploadsDir = await settingsService.get(UNB_SETTING_KEYS.UPLOAD_BASE_PATH);
        const profilePhotosDir = await settingsService.get(UNB_SETTING_KEYS.UPLOAD_PROFILE_PHOTOS_PATH);

        const memberPhoto = await db.repo.memberPhotos.getByKey(photo.key);

        if (!memberPhoto) return await this.buildNoPhoto(firstLetter, options);

        const fileName = memberPhoto.fileName;

        const photoUrl = `${process.env.UNB_BASE_URL}/public/${uploadsDir}/${profilePhotosDir}/${member.key}/${fileName}`;
        const exists = await urlExists(photoUrl);

        return exists
            ? await this.buildPhoto(member, photoUrl, options)
            : await this.buildNoPhoto(firstLetter, options);
    }

    /**
     * Builds the no photo source.
     * 
     * @param {string} firstLetter - The first letter of the name.
     * @param {object} [options={}] - Options for the profile photo. 
     * @param {"normal"|"thumbnail"} [options.type='normal'] - The profile photo type to get (default is `normal`).
     * @param {boolean} [options.link=true] - `true` to include a link to the member's profile, `false` not to include a link (default is `true`). 
     * @param {boolean} [options.includeTooltip=true] - `true` to include a tooltip for the link (default is `true`).
     * @param {string} [options.tooltip=null] - Optional custom tooltip text (default is `null`).
     * @param {"top"|"bottom"|"left"|"right"} [options.tooltipPlacement='top'] - The placement for the tooltip text window.
     * @param {Member|null} [member=null] - Optional member entity instance if no photo building if for a member (default is `null`).
     * @returns {Promise<string>} A promise that resolves to the HTML source for the no photo. 
     */
    async buildNoPhoto(firstLetter, options = {}, member = null) {
        const { settingsService } = DataStore.get('unb');

        const {
            type = 'normal',
            link = true,
            includeTooltip = member ? true : false,
            tooltip = await this._localeService.t('member.service.profile.link.tooltip', { name: await this.getName(member) }),
            tooltipPlacement = 'top'
        } = options;
        
        const colors = await settingsService.get(UNB_SETTING_KEYS.PHOTO_NO_PHOTO_COLORS);
        const color = colors?.find(c => c.letter === firstLetter);

        return await OutputService.getPartial('member/no-photo', {
            letter: firstLetter,
            url: link && member ? buildEntityUrl('member', member.key, await this.getName(member)) : null,
            type,
            colors: color,
            includeTooltip,
            tooltip,
            tooltipPlacement
        });
    }

    /**
     * Builds the photo source.
     * 
     * @param {Member} member - The member entity service instance. 
     * @param {string} source - The photo image source. 
     * @param {object} [options={}] - Options for the profile photo. 
     * @param {"normal"|"thumbnail"} [options.type='normal'] - The profile photo type to get (default is `normal`).
     * @param {boolean} [options.link=true] - `true` to include a link to the member's profile, `false` not to include a link (default is `true`). 
     * @param {boolean} [options.includeTooltip=true] - `true` to include a tooltip for the link (default is `true`).
     * @param {string} [options.tooltip=null] - Optional custom tooltip text (default is `null`).
     * @param {"top"|"bottom"|"left"|"right"} [options.tooltipPlacement='top'] - The placement for the tooltip text window.
     * @returns {Promise<string>} A promise that resolves to thge HTML source for the photo.
     */
    async buildPhoto(member, source, options = {}) {
        const {
            type = 'normal',
            link = true,
            includeTooltip = true,
            tooltip = await this._localeService.t('member.service.profile.link.tooltip', { name: await this.getName(member) }),
            tooltipPlacement = 'top'
        } = options;

        return await OutputService.getPartial('member/photo', {
            source,
            url: link ? buildEntityUrl('member', member.key, await this.getName(member)) : null,
            type,
            includeTooltip,
            tooltip,
            tooltipPlacement
        });
    }

    /**
     * Check if a member is a member of a group.
     * 
     * @param {Member|string} member - The member entity or the member key name.
     * @param {Group|string} group - The group entity or the group key name.
     * @returns {Promise<boolean>} A promise that resolves to either:
     *                             `true` if the member is a member of the group.
     *                             `false` if the member is NOT a member of the group.
     */
    async isInGroup(member, group) {
        if (!member || !group) return false;

        member = await this.resolve(member);

    }

    /**
     * Build the group badges for a member.
     * 
     * @param {Member|string} member - Either the member key name or the member entity instance.
     * @returns {Promise<[object]|null} A promise that resolves to the array of group badge data objects
     *                                  or `null` if the member cannot be resolved or the member groups
     *                                  cannot be resolved.
     */
    async buildGroupBadges(member) {
        member = await this.resolve(member);
        if (!member) return null;

        const { groupsService } = DataStore.get('unb');

        const badges = [];
        const groups = member.groups;

        if (!groups) return null;

        await Promise.all(
            groups.map(async g => badges.push(
                await groupsService.build({
                    group: g,
                    mode: 'badge'
                })
            ))
        );

        return badges;
    }

    /**
     * Check if the given user is a guest.
     * 
     * @param {Member} member - The member entity instance.
     * @returns {Promise<boolean>} A promise that resolves to either:
     *                             `true` if the user is a guest, `false` if not. 
     */
    async isGuest(member) {
        return (await this.getName(member)).toLowerCase() === 'guest';
    }
}

module.exports = MembersService;