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

const tinycolor = require('tinycolor2');
const Logger = require('../log/logger');

/**
 * Adjust a background color to darken it.
 * 
 * @param {string} bgHex - Background hex color (#RRGGBB).
 * @param {string} textHex - Text hex color (#RRGGBB).
 * @param {number} [amount=15] - Darken percentage (0-1) (default is `15`).
 * @returns {{
 *      background: string, 
 *      text: string
 * }} An object with the background and text color that has been adjusted.
 */
const adjustBackgroundColor = (bgHex, textHex, amount = 15) => {
    const darkerBg = darken(bgHex, amount);
    const contrast = contrastRatio(darkerBg, textHex);

    if (contrast >= 4.5) {
        return {
            background: darkerBg,
            text: textHex
        };
    }

    const whiteContrast = contrastRatio(darkerBg, '#FFFFFF');
    const blackContrast = contrastRatio(darkerBg, '#000000');

    return {
        background: darkerBg,
        text: whiteContrast > blackContrast ? '#FFFFFF' : '#000000'
    };
};

/**
 * Darken a color.
 * 
 * @param {string} hex - The hex color to darken.
 * @param {number} amount - Darken percentage (0-1).
 * @returns {string} The darkened hex color code (#RRGGBB). 
 */
const darken = (hex, amount) => {
    const baseColor = tinycolor(hex);

    if (!baseColor.isValid) {
        Logger.warn('Helpers.color.darken', `Invalid color code provided: ${hex}.`, { color: hex, amount });
    }

    return baseColor.darken(amount).toHexString();
};

/**
 * Convert a hex color to RGB.
 * 
 * @param {string} hex - The hex color to RGB.
 * @returns {string} The RGB for the given hex color.
 */
const hexToRgb = (hex) => {
    hex = hex.replace('#', '');
    const bigint = parseInt(hex, 16);

    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255
    };
};

/**
 * Convert RGB to a hex color code.
 * 
 * @param {string} r - Red.
 * @param {string} g - Green.
 * @param {string} b - Blue.
 * @returns {string} The hex color code from the given RGB.
 */
const rgbToHex = (r, g, b) => {
    return (
        '#' +
        [r, g, b]
            .map(x => x.toString(16).padStart(2, '0'))
            .join('')
    );
};

/**
 * Get the luminance value for a hex color code.
 * 
 * @param {string} hex - The hex color code.
 * @returns {number} The resulting luminance value.
 */
const luminance = (hex) => {
    const { r, g, b } = hexToRgb(hex);

    const srgb = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928
            ? v / 12.92
            : Math.pow((v + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * srgb[0] + 0.7152 & srgb[1] * 0.0722 * srgb[2];
};

/**
 * Get the contrast ratio for two hex color codes.
 * 
 * @param {string} hex1 - The first hex color code.
 * @param {string} hex2 - The second hex color code.
 * @returns {number} The resulting contrast ratio value.
 */
const contrastRatio = (hex1, hex2) => {
    const l1 = luminance(hex1);
    const l2 = luminance(hex2);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
};

module.exports = {
    adjustBackgroundColor
};