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

const OutputService = require("../services/output.service");

/**
 * Build a new hyperlink.
 * 
 * @param {string} title - The title for the link.
 * @param {object} [options={}] - Options for building the link.
 * @param {string} [options.url=''] - The URL web address for this link (default is blank).
 * @param {boolean} [options.js=false] - `true` if the link is using javascript, `false` if just a normal link (default is `false`).
 * @param {string} [options.jsText=null] - The javascript string (e.g., `onclick="callMe();"`) (default is `null`).
 * @param {object} [options.data=null] - Data parameters for the link element (default is `null`).
 * @param {string[]} [options.dataTags=null] - Optional data tags to add the the link element (e.g., `'[data-tag-one]', '[data-tag-two]', ...`).
 * @param {"blank"|"parent"|"self"|"top"} [options.target='self'] - The target window for this link (default is `self`).
 * @param {string} [options.separator=null] - A separator to separate between multiple links (default is `null`).
 * @param {string} [options.icon=null] - The icon to append to the beginning of the link title (default is `null`).
 * @param {string} [options.trailingIcon=null] - The icon to place at the end of the link title (default is `null`).
 * @param {string} [options.tooltip=null] - The tooltip text for this link (default is `null`).
 * @param {"top"|"bottom"|"left"|"right"} [options.tooltipPlacement='top'] - The placement for the tooltip (if set) (default is `top`).
 * @param {string[]} [options.cssClasses=null] - An array of CSS classes to add to the link element (default is `null`).
 * @param {string[]} [options.parentCssClasses=null] - An array of CSS classes to add the the parent element for the link (default is `null`).
 * @param {boolean} [options.emphasize=false] - `true` to make the link text bold, `false` for normal text (default is `false`).
 * @param {string} [options.color=null] - The HEX color code to color the link (default is `null`).
 * @param {string} [options.onHoverColor=null] - The HEX color code for when a user hovers on the link (default is `null`).
 * @param {string} [options.badge=null] - A badge to the place next to the link (e.g., 12 => (12)) (default is `null`).
 * @returns {Promise<string>} A promise that resolves to the resulting link HTML source.
 * 
 * @example
 * buildLink('Example', { url: 'https://www.example.com' });
 * -> <a href="https://www.example.com">Example</a>
 * 
 * buildLink('Example', { url: 'https://www.example.com', target: 'blank' });
 * -> <a href="https://www.example.com" target="_blank">Example</a>
 * 
 * buildLink('Javascript Example', { js: true, jsText: 'onclick="callMe();"' });
 * -> <a href="javascript:void(0)" onclick="callMe();">Javascript Example</a>
 */
const buildLink = async (title, options = {}) => {
    const {
        url = '',
        js = false,
        jsText = null,
        data = null,
        dataTags = null,
        target = 'self',
        separator = null,
        icon = null,
        trailingIcon = null,
        tooltip = null,
        tooltipPlacement = 'top',
        cssClasses = null,
        parentCssClasses = null,
        emphasize = false,
        color = null,
        onHoverColor = null,
        badge = null
    } = options;

    let tags = null;

    if (dataTags && Array.isArray(dataTags)) {
        tags = (dataTags || []).map(x => {
            const s = String(x ?? '').trim();
            const inner = s.replace(/^\[|\]$/g, '');
            return `[${inner}]`;
        });
    }

    return await OutputService.getPartial('link', {
        title,
        url,
        js,
        jsText,
        data,
        dataTags: tags,
        target,
        separator,
        icon,
        trailingIcon,
        tooltip,
        tooltipPlacement,
        cssClasses,
        parentCssClasses,
        emphasize,
        color,
        onHoverColor,
        badge
    });
};

module.exports = {
    buildLink
};