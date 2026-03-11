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

const UNB_PERMISSION_KEYS = require("../permissions/permissions.keys");

/**
 * UNB editor tools.
 */
const UNB_EDITOR_TOOLS = Object.freeze({
    font: {
        key: 'font',
        localeKey: 'editor.tools.font',
        permissionKey: UNB_PERMISSION_KEYS.editor.toolbar.font
    },

    size: {
        key: 'size',
        localeKey: 'editor.tools.size',
        permissionKey: UNB_PERMISSION_KEYS.editor.toolbar.size
    },

    color: {
        key: 'color',
        localeKey: 'editor.tools.color',
        permissionKey: UNB_PERMISSION_KEYS.editor.toolbar.color
    },

    bold: {
        key: 'bold',
        localeKey: 'editor.tools.bold',
        permissionKey: UNB_PERMISSION_KEYS.editor.toolbar.bold
    },

    italic: {
        key: 'italic',
        localeKey: 'editor.tools.italic',
        permissionKey: UNB_PERMISSION_KEYS.editor.toolbar.italic
    },

    underline: {
        key: 'underline',
        localeKey: 'editor.tools.underline',
        permissionKey: UNB_PERMISSION_KEYS.editor.toolbar.underline
    },

    strikethrough: {
        key: 'strikethrough',
        localeKey: 'editor.tools.strikethrough',
        permissionKey: UNB_PERMISSION_KEYS.editor.toolbar.strikethrough
    },

    indent: {
        key: 'indent',
        localeKey: 'editor.tools.indent',
        permissionKey: UNB_PERMISSION_KEYS.editor.toolbar.indent
    },

    outdent: {
        key: 'outdent',
        localeKey: 'editor.tools.outdent',
        permissionKey: UNB_PERMISSION_KEYS.editor.toolbar.outdent
    },

    subscript: {
        key: 'subscript',
        localeKey: 'editor.tools.subscript',
        permissionKey: UNB_PERMISSION_KEYS.editor.toolbar.subscript
    },

    superscript: {
        key: 'superscript',
        localeKey: 'editor.tools.superscript',
        permissionKey: UNB_PERMISSION_KEYS.editor.toolbar.superscript
    },

    alignLeft: {
        key: 'align.left',
        localeKey: 'editor.tools.align.left',
        permissionKey: UNB_PERMISSION_KEYS.editor.toolbar.align.left
    },

    alignCenter: {
        key: 'align.center',
        localeKey: 'editor.tools.align.center',
        permissionKey: UNB_PERMISSION_KEYS.editor.toolbar.align.center
    },

    alignRight: {
        key: 'align.right',
        localeKey: 'editor.tools.align.right',
        permissionKey: UNB_PERMISSION_KEYS.editor.toolbar.align.right
    },

    alignJustify: {
        key: 'align.justify',
        localeKey: 'editor.tools.align.justify',
        permissionKey: UNB_PERMISSION_KEYS.editor.toolbar.align.justify
    },

    orderedList: {
        key: 'ordered.list',
        localeKey: 'editor.tools.ordered.list',
        permissionKey: UNB_PERMISSION_KEYS.editor.toolbar.orderedList
    },

    unorderedList: {
        key: 'unordered.list',
        localeKey: 'editor.tools.unordered.list',
        permissionKey: UNB_PERMISSION_KEYS.editor.toolbar.unorderedList
    },

    undo: {
        key: 'undo',
        localeKey: 'editor.tools.undo',
        permissionKey: UNB_PERMISSION_KEYS.editor.toolbar.undo
    },

    redo: {
        key: 'redo',
        localeKey: 'editor.tools.redo',
        permissionKey: UNB_PERMISSION_KEYS.editor.toolbar.redo
    },

    hyperlink: {
        key: 'insert.hyperlink',
        localeKey: 'editor.tools.insert.hyperlink',
        permissionKey: UNB_PERMISSION_KEYS.editor.toolbar.insert.hyperlink
    },

    image: {
        key: 'insert.image',
        localeKey: 'editor.tools.insert.image',
        permissionKey: UNB_PERMISSION_KEYS.editor.toolbar.insert.image
    },

    media: {
        key: 'insert.media',
        localeKey: 'editor.tools.insert.media',
        permissionKey: UNB_PERMISSION_KEYS.editor.toolbar.insert.media
    },

    quote: {
        key: 'insert.quote',
        localeKey: 'editor.tools.insert.quote',
        permissionKey: UNB_PERMISSION_KEYS.editor.toolbar.insert.quote
    },

    code: {
        key: 'insert.code',
        localeKey: 'editor.tools.insert.code',
        permissionKey: UNB_PERMISSION_KEYS.editor.toolbar.insert.code
    },

    gif: {
        key: 'insert.gif',
        localeKey: 'editor.tools.insert.gif',
        permissionKey: UNB_PERMISSION_KEYS.editor.toolbar.insert.gif
    },

    emoji: {
        key: 'insert.emoji',
        localeKey: 'editor.tools.insert.emoji',
        permissionKey: UNB_PERMISSION_KEYS.editor.toolbar.insert.emoji
    },

    horizontalRule: {
        key: 'insert.horizontal.rule',
        localeKey: 'editor.tools.insert.horizontal.rule',
        permissionKey: UNB_PERMISSION_KEYS.editor.toolbar.insert.horizontalRule
    },

    spoiler: {
        key: 'insert.spoiler',
        localeKey: 'editor.tools.insert.spoiler',
        permissionKey: UNB_PERMISSION_KEYS.editor.toolbar.insert.spoiler
    }
});

module.exports = UNB_EDITOR_TOOLS;