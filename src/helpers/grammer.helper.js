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

const DataStore = require('../datastore/datastore');
const { formatNumberCompact } = require('./number.helper');

/**
 * Either return a singular or plural locale/text based on the total.
 * 
 * @param {string} plural - Either the plural locale key or the plural text.
 * @param {string} singular - Either the singular locale key or the singular text. 
 * @param {number} total - The total.
 * @param {object} [options={}] - Options for plural or singular.
 * @param {boolean} [options.locale=true] - `true` to use locale keys, `false` for normal non-locale text. 
 * @param {boolean} [options.format=true] - `true` to format the total, `false` not to.
 */
const pluralOrSingular = (plural, singular, total, options = {}) => {
    const { localeService } = DataStore.get('unb');
    const { locale = true, format = true } = options;

    let totalNumber = format ? formatNumberCompact(total) : total;

    if (total === 1) {
        return locale
            ? localeService.tSync(singular, { total: totalNumber })
            : singular.replace('{total}', totalNumber);
    } else {
        return locale
            ? localeService.tSync(plural, { total: totalNumber })
            : plural.replace('{total}', totalNumber);
    }
};

module.exports = {
    pluralOrSingular
};