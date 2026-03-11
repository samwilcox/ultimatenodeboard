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

const { JSDOM } = require('jsdom');

/**
 * Truncate a string.
 * 
 * @param {string} str - The string to truncate.
 * @param {number} [maxChars=250] - The maximum characters before being truncated (default is `250`).
 * @returns {string} The truncated string. 
 * 
 * @example
 * truncate('I am a string and might be long', 15); // -> 'I am a string a...'
 */
const truncate = (str, maxChars = 250) => {
    if (!str || typeof str !== 'string') return '';

    if (str.length <= maxChars) return str;

    return `${str.substring(0, maxChars)}...`;
};

/**
 * Sanitize HTML for preview.
 * 
 * @param {string} html - The HTML to sanitize for preview.
 * @returns {string} The sanitized preview text.
 */
const sanitizePreview = (html) => {
    const dom = new JSDOM('<body>${html}</body>');
    const document = dom.window.document;

    document.querySelectorAll(
        'img, video, audio, iframe, embed, object, script, style, svg, canvas'
    ).forEach(el => el.remove());

    let text = document.body.textContent || '';

    text = text.replace(/\s+/g, ' ').trim();

    return text;
};

module.exports = {
    truncate,
    sanitizePreview
};