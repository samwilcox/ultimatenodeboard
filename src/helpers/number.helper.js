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

/**
 * Format a number into a compact, `human-friendly` string.
 * 
 * Examples:
 *   950       -> "950"
 *   1200      -> "1.2K"
 *   54310     -> "54.31K"
 *   1120000   -> "1.12M"
 *   987654321 -> "987.65M"
 * 
 * @param {number} value - The input number value.
 * @returns {string} A `human-friendly` formatted number string.
 */
const formatNumberCompact = (value) => {
    const num = Number(value);

    if (!Number.isFinite(num)) {
        return '0';
    }

    if (num < 1000) {
        return String(num);
    }

    const units = [
        { value: 1e9, suffix: 'B' },
        { value: 1e6, suffix: 'M' },
        { value: 1e3, suffix: 'K' }
    ];

    for (const unit of units) {
        if (num >= unit.value) {
            return (
                (num / unit.value)
                    .toFixed(2)
                    .replace(/\.00$/, '')
                    .replace(/(\.\d)$/, '$1')
                + unit.suffix
            );
        }
    }

    return String(num);
};

module.exports = {
    formatNumberCompact
};