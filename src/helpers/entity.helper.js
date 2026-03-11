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

const NotFoundError = require('../errors/not-found.error');
const { buildSlugPath, buildUrl } = require('./url.helper');
const DataStore = require('../datastore/datastore');

/**
 * Build the URL for the given entity.
 * 
 * @param {string} entityType - The entity type. 
 * @param {string} key - The key name for the entity.
 * @param {string|null} [title=null] - Optional title for the entity (default is `null`).
 * @returns {string} The built URL for the entity. 
 * @throws {NotFoundError} If the given entity does not exist in the UNB entities list.
 */
const buildEntityUrl = (entityType, key, title = null) => {
    if ((!entityType || typeof entityType !== 'string') || (!key || typeof key !== 'string')) return '';

    const slugPath = buildSlugPath(title ?? '', key);

    const { localeService } = DataStore.get('unb');

    switch (entityType) {
        case 'member':
            return `${buildUrl(['members', 'profile'])}/${slugPath}`;

        case 'forum':
            return `${buildUrl(['forums', 'view'])}/${slugPath}`;

        case 'topic':
            return `${buildUrl(['topics', 'view'])}/${slugPath}`;

        case 'tag':
            return `${buildUrl(['tags', 'view'])}/${slugPath}`;

        case 'group':
            return `${buildUrl(['groups', 'view'])}/${slugPath}`;

        default:
            throw new NotFoundError(localeService.tSync('error.entities.urls.not.in.list', { entity: entityType }));
    }
};  

module.exports = {
    buildEntityUrl
};