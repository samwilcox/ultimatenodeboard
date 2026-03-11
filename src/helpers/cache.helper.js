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

const InvalidError = require("../errors/invalid.error");
const { buildUrl, buildSlugPath } = require('./url.helper');

/**
 * Build the cache for lists.
 * 
 * @private
 * @param {object[]} repo - The UNB database repository.
 * @param {Member} member - The member entity instance.
 * @param {"languages"|"themes"} type - The type to build for.
 * @param {LocaleService} localeService - The UNB locale service instance.
 * @returns {Promise<{
 *      label: string,
 *      url: string,
 *      selected: boolean
 * }} A promise that resolves to the languages array.
 * @throws {InvalidError} If the type is invalid.
 */
const buildListCache = async (repo, member, type, localeService) => {
    let items = null;

    switch (type) {
        case 'languages':
            items = await repo.locales.getAll();
            break;
        case 'themes':
            items = await repo.themes.getAll();
            break;
        default:
            throw new InvalidError(await localeService.t('error.cache.helper.invalid.cache.type'));
    }

    items.sort((a, b) => a.title.localeCompare(b.title));

    const itemsList = [];

    for (const item of items) {
        const selected = type === 'languages'
            ? member.locale === item.key
            : member.theme === item.key

        itemsList.push({
            label: item.title,
            url: `${buildUrl(['select', type])}/${buildSlugPath(item.title, item.key)}`,
            selected
        });
    }

    return itemsList;
};

module.exports = {
    buildListCache
};