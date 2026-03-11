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
const path = require('path');
const ejs = require('ejs');
const DataStore = require('../datastore/datastore');
const { readFile } = require('./file.helper');
const NotFoundError = require('../errors/not-found.error');

/**
 * Render a partial.
 * 
 * @param {string} partial - The partial to render.
 * @param {object} [payload={}] - Optional payload data.
 * @returns {string} The rendered HTML. 
 * @throws {NotFoundError} If the template file is not found.
 */
const renderPartial = async (partial, payload = {}) => {
    try {
        const { member, localeService } = DataStore.get('unb');
        
        const partialFile = `${partial}${partial.endsWith('.ejs') ? '' : '.ejs'}`;
        const partialPath = path.join(member.configs.themePath, 'partials', partialFile);
        const tpl = readFile(partialPath);

        if (!tpl) {
            throw new NotFoundError(await localeService.t('output.helper.tpl.not.found'), { partial, payload, partialPath, tpl });
        }

        return await ejs.render(tpl, payload, { filename: partialPath });
    } catch (error) {
        Logger.error('OutputHelper', `Output failed to render partial: ${error}.`, { partial, payload, error });
        throw error;
    }
};

module.exports = {
    renderPartial
};