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
 * UNB AdminCP log helper.
 */
UNB_ADMINCP.on('ui.init', () => {
    UNB_ADMINCP.helpers = UNB_ADMINCP.helpers || {};
    UNB_ADMINCP.helpers.log = UNB_ADMINCP.helpers.log || {};

    UNB_ADMINCP.helpers.log.chalk = {
        red: (msg, bold = false) => UNB_ADMINCP.helpers.log.toChalkString(msg, '#f44336', bold),
        green: (msg, bold = false) => UNB_ADMINCP.helpers.log.toChalkString(msg, '#4CAF50', bold),
        yellow: (msg, bold = false) => UNB_ADMINCP.helpers.log.toChalkString(msg, '#FFC197', bold),
        cyan: (msg, bold = false) => UNB_ADMINCP.helpers.log.toChalkString(msg, '#00BCD4', bold),
        pink: (msg, bold = false) => UNB_ADMINCP.helpers.log.toChalkString(msg, '#FFC0C0', bold),
        purple: (msg, bold = false) => UNB_ADMINCP.helpers.log.toChalkString(msg, '#800080', bold),
        lime: (msg, bold = false) => UNB_ADMINCP.helpers.log.toChalkString(msg, '#00FF00', bold),
        darkYellow: (msg, bold = false) => UNB_ADMINCP.helpers.log.toChalkString(msg, '#C0C000', bold)
    };

    /**
     * Build a styled console segment.
     * 
     * @param {string} msg - The message segment.
     * @param {object} [options={}] - Options for building the segment.
     * @param {string} [options.color='#FFFFFF'] - Text color.
     * @param {boolean} [options.bold=false] - `true` to bold the text, `false` for normal text.
     * @returns {Array} Console argument parts. 
     */
    UNB_ADMINCP.log.segment = (msg, options = {}) => {
        const { color = '#FFFFFF', bold = false } = options;

        return [
            `%c${msg}`,
            `color:${color};${bold ? 'font-weight: bold;' : ''}`
        ];
    };

    /**
     * Combine the console segments into a single console string.
     * 
     * @param  {...any} segments - The segments to combine.
     * @returns {string} The combined segments console string.
     */
    UNB_ADMINCP.log.combine = (...segments) => {
        const formatParts = [];
        const styleParts = [];

        segments.forEach(seg => {
            formatParts.push(seg[0]);
            styleParts.push(seg[1]);
        });

        return [formatParts.join(''), ...styleParts];
    };

    /**
     * Build and return the chalk string.
     * 
     * @param {string} msg - The message to chalk.
     * @param {string} [color='#FFFFFF'] - The text color hex code. 
     * @param {boolean} bold - `true` to bold text, `false` for normal text.
     * @returns {string} The chalked string for the console. 
     */
    UNB_ADMINCP.log.toChalkString = (msg, color = '#FFFFFF', bold = false) => {
        return UNB_ADMINCP.helpers.log.segment(msg, { color, bold });
    };
});