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

const NotFoundError = require("../errors/not-found.error");
const Logger = require('../log/logger');
const DataStore = require('../datastore/datastore');
const path = require('path');
const { readFile } = require("../helpers/file.helper");
const ejs = require('ejs');

/**
 * UNB output service
 * 
 * Service for outputting a partial to HTML string form.
 */
class OutputService {
    /**
     * Get the HTML for a partial.
     * 
     * @param {string} partial - The name of the EJS partial.
     * @param {object} [payload={}] - Optional payload data for the partial.
     * @returns {Promise<string>} A promise that resolves to the result HTML string.
     * @throws {NotFoundError} If the partial is not found. 
     */
    static async getPartial(partial, payload = {}) {
        try {
            const { member, localeService, req } = DataStore.get('unb');
            const partialPath = path.join(member.configs.themePath, 'partials', `${partial}.ejs`);
            const template = readFile(partialPath);

            if (!template) {
                throw new NotFoundError(await localeService.t('error.output.service.partial.not.found', { partial }), { partial, template });
            }

            payload = {
                t: req.t,
                ...payload
            };

            return await ejs.render(template, payload, { filename: partialPath });
        } catch (error) {
            Logger.error('OutputService', `Get partial failed: ${error}.`, { error, partial, payload });
            throw error;
        }
    }
}

module.exports = OutputService;