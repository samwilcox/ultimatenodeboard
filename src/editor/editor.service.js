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
const { generateHash } = require('../helpers/hash.helper');
const PermissionsService = require('../permissions/permissions.service');
const OutputService = require('../services/output.service');
const UNB_SETTING_KEYS = require('../settings/settings.keys');
const UNB_EDITOR_TOOLS = require('./editor.tools');

/**
 * UNB editor service
 * 
 * Service for building the UNB rich test editor.
 */
class EditorService {
    /**
     * Build a new instance of a UNB text editor component.
     * 
     * @param {object} [options={}] - Options for building the text editor.
     * @param {{
     *      top: boolean,
     *      bottom: boolean
     * }} [options.margin={ top: false, bottom: false }] - `true` for enabling a margin, `false` to disable a margin.
     *                                                     (default is `{ top: false, bottom: false }`).
     * @param {string|null} [options.key=null] - Optional key for the editor (default is auto-generated).
     * @param {boolean} [options.returnHtml=false] - `true` to return HTML, `false` to return the data object (default is `false`).
     * @returns {Promise<{
     *      key: string,
     *      enabledTools: object[],
     *      defaultFont: string,
     *      fonts: string[],
     *      defaultFontSize: number,
     *      fontSizes: number[],
     *      defaultFontColor: string,
     *      fontColors: string[],
     *      languages: Array<[{
     *          localeKey: string,
     *          value: string
     *      }],
     *      enabledGroups: {
     *          font: boolean,
     *          markup: boolean,
     *          indentOutdent: boolean,
     *          script: boolean,
     *          align: boolean,
     *          lists: boolean,
     *          insert: boolean,
     *          undoRedo: boolean
     *      }
     * }>} A promise that resolves to the text editor data object.
     */
    static async build(options = {}) {
        const {
            margin = { top: false, bottom: false },
            key = generateHash(),
            returnHtml = false
        } = options;

        const { member, settingsService } = DataStore.get('unb');

        const enabledTools = await this.getEnabledTools();

        const defaultFont = member.settings.editor.defaultFont;
        const fonts = await settingsService.get(UNB_SETTING_KEYS.EDITOR_FONTS);

        const defaultFontSize = member.settings.editor.defaultFontSize;
        const fontSizes = await settingsService.get(UNB_SETTING_KEYS.EDITOR_FONT_SIZES);

        const defaultFontColor = member.settings.editor.defaultFontColor;
        const fontColors = await settingsService.get(UNB_SETTING_KEYS.EDITOR_FONT_COLORS);

        const languages = await settingsService.get(UNB_SETTING_KEYS.EDITOR_CODE_LANGUAGES);

        const enabledGroups = this.getEnabledToolGroups(enabledTools);

        if (returnHtml) {
            return OutputService.getPartial('editor/editor', {
                editor: {
                    key,
                    enabledTools,
                    defaultFont,
                    fonts,
                    defaultFontSize,
                    fontSizes,
                    defaultFontColor,
                    fontColors,
                    languages,
                    enabledGroups
                }
            });
        } else {
            return {
                key,
                enabledTools,
                defaultFont,
                fonts,
                defaultFontSize,
                fontSizes,
                defaultFontColor,
                fontColors,
                languages,
                enabledGroups
            };
        }
    }

    /**
     * Returns the list of toolbar tools that are currently enabled/disabled.
     * 
     * @private
     * @returns {Promise<[object]>} A promise that resolves to an array containing
     *                              details for each toolbar item.
     */
    static async getEnabledTools() {
        const { member, localeService } = DataStore.get('unb');

        const toolbar = member.settings?.editor?.toolbar;
        const tools = [];

        for (const tool of Object.values(UNB_EDITOR_TOOLS)) {
            const key = tool.key;
            const enabled = await PermissionsService.can(member, tool.permissionKey);
            const enabledViaMember = toolbar[key];

            tools[key] = {
                enabled: enabled && enabledViaMember,
                label: await localeService.t(tool.localeKey)
            };
        }

        return tools;
    }

    /**
     * Get the enabled tool groups.
     * 
     * @param {object[]} tools - An array of all the tools.
     * @returns {{
     *      font: boolean,
     *      markup: boolean,
     *      extra: boolean,
     *      indentOutdent: boolean,
     *      script: boolean,
     *      align: boolean,
     *      lists: boolean,
     *      insert: boolean,
     *      undoRedo: boolean,
     *      toolbar: boolean
     * }} An object containing the boolean flags for each tool group. 
     */
    static getEnabledToolGroups(tools) {
        const flags = {
            font: false,
            markup: false,
            extra: false,
            indentOutdent: false,
            script: false,
            align: false,
            lists: false,
            insert: false,
            undoRedo: false,
            toolbar: false,
        };

        if (tools.font || tools.size || tools.color) flags.font = true;
        if (tools.bold || tools.italic || tools.underline || tools.strikethrough) flags.markup = true;
        if (tools.indent || tools.outdent) flags.indentOutdent = true;
        if (tools.subscript || tools.superscript) flags.script = true;
        if (tools['align.left'] || tools['align.center'] || tools['align-right'] || tools['align-justify']) flags.align = true;
        if (tools['ordered.list'] || tools['unordered.list']) flags.lists = true;

        if (
            tools.strikethrough ||
            tools.subscript ||
            tools['align.left'] ||
            tools['align.center'] ||
            tools['align.right'] ||
            tools['align.justify'] ||
            tools.indent ||
            tools.outdent ||
            tools['ordered.list'] ||
            tools['unordered.list']
        ) {
            flags.extra = true;
        }

        if (
            tools['insert.hyperlink'] ||
            tools['insert.image'] ||
            tools['insert.media'] ||
            tools['insert.quote'] ||
            tools['insert-code'] ||
            tools['insert.gif'] ||
            tools['insert.emoji'] ||
            tools['insert-horizontal.rule'] ||
            tools['insert-spoiler']
        ) {
            flags.insert = true;
        }

        if (tools.undo || tools.redo) flags.undoRedo = true;

        if (
            flags.font ||
            flags.markup ||
            flags.indentOutdent ||
            flags.script ||
            flags.align ||
            flags.lists ||
            flags.insert ||
            flags.undoRedo
        ) {
            flags.toolbar = true;
        }

        return flags;
    }
}

module.exports = EditorService;