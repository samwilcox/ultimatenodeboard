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

const { generateHTML } = require('@tiptap/html/server');
const Logger = require('../log/logger');
const Extensions = require('../editor/editor.extensions');
const sanitizeHtml = require('sanitize-html');

/**
 * UNB render service
 * 
 * Service for rendering various things, such as HTML from the UNB editor, etc.
 */
class RenderService {
    /**
     * Render the HTML from editor JSON content.
     * 
     * @param {JSON} json - The JSON from the editor to render.
     * @returns {string} The resulting HTML source. 
     */
    static renderEditorContent(json) {
        if (!json) return '';

        try {
            for (const ext of Extensions) {
            if (!ext) {
                console.error('UNB EXTENSION ERROR: undefined extension detected');
            } else if (!ext.name) {
                console.error('UNB EXTENSION ERROR: extension missing name', ext);
            }
        }

            return sanitizeHtml(generateHTML(json, Extensions));
        } catch (error) {
            console.log(error);
            Logger.warn('RenderService', `Failed to render editor content: ${error}.`, { error });
            return '';
        }
    }
}

module.exports = RenderService;