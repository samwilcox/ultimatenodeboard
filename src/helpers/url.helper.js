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

const InvalidParameterError = require("../errors/invalid-parameter.error");
const DataStore = require('../datastore/datastore');
const slugify = require('slugify');
const axios = require('axios');

/**
 * Build an URL.
 * 
 * @param {string[]|null} [segments=null] - List of URL segments (e.g., segment1/segment2/...). 
 * @param {object} [options={}] - Options for building an URL.
 * @param {object|null} [options.query=null] - Optional URL query parameters (default is `null`).
 * @returns {string} The newly built URL address. 
 */
const buildUrl = (segments = null, options = {}) => {
    const { query = null } = options;

    let url = process.env.UNB_BASE_URL.replace(/\/+$/, '');

    if (segments && Array.isArray(segments) && segments.length) {
        for (const segment of segments) {
            url += `/${encodeURIComponent(segment)}`;
        }
    }

    if (query && typeof query === 'object' && Object.keys(query).length) {
        url += `?${new URLSearchParams(query).toString()}`;
    }

    return url;
};

/**
 * Build a slug-based URL path using a canonical identifier and a title.
 * 
 * @param {string} title - Human-readable title to slugify.
 * @param {string} key - Canonical, immutable identifier.
 * @returns {string} The slug-based URL path.
 * @throws {InvalidParameterError} If the key parameter is not valid.
 * 
 * @example
 * buildSlugPath('Forum Title', 'id_54321') -> 'id_54321/forum-title'
 * buildSlugPath('How to Cache Widgets!', 't_9f3c2a8b') -> 't_9f3c2a8b/how-to-cache-widgets'
 */
const buildSlugPath = (title, key) => {
    const { localeService } = DataStore.get('unb');

    if (!key || typeof key !== 'string') {
        throw new InvalidParameterError(localeService.tSync('error.url.helper.slugpath.invalid.key'));
    }

    if (typeof title !== 'string' || !title.trim()) {
        return key;
    }

    const slug = slugify(title, {
        lower: true,
        strict: true,
        trim: true
    });

    return slug
        ? `${key}/${slug}`
        : key;
};

/**
 * Check if an URL exists.
 * 
 * @param {string} url - The URL web address to check for existence.
 * @returns {Promise<boolean>} A promise that resolves to either `true` if exists or `false` if does not exist.
 */
const urlExists = async (url) => {
    try {
        const response = await axios.head(url, { timeout: 5000 });
        return response.status >= 200 && response.status < 400;
    } catch {
        return false;
    }
};

/**
 * Get the current request URL.
 * 
 * @param {object} req - The request object from `Express`.
 * @returns {string} The current URL.
 */
const getCurrentUrl = (req) => {
    return `${req.protocol}://${req.get('host')}${req.originalUrl}`;
};

module.exports = {
    buildUrl,
    buildSlugPath,
    urlExists,
    getCurrentUrl
};