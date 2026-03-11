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
 * UNB permission keys.
 */
const UNB_PERMISSION_KEYS = Object.freeze({
    administration: {
        access: 'administration.access',
        adminCPPanel: 'administration.admincp.panel'
    },

    moderation: {
        access: 'moderation.access',
        toolbox: 'moderation.toolbox'
    },

    help: {
        access: 'help.access'
    },

    features: {
        access: 'features.access',
        members: 'features.members',
        whosOnline: 'features.whos.online',
        search: 'features.search',
        tags: 'features.tags',
        groups: 'features.groups',
        retroactiveTimeline: 'features.retroactive.timeline',
        cookieManagement: 'features.cookie.management',
        help: 'features.help'
    },

    editor: {
        toolbar: {
            font: 'editor.toolbar.font',
            size: 'editor.toolbar.size',
            color: 'editor.toolbar.color',
            bold: 'editor.toolbar.bold',
            italic: 'editor.toolbar.italic',
            underline: 'editor.toolbar.underline',
            strikethrough: 'editor.toolbar.strikethrough',
            indent: 'editor.toolbar.indent',
            outdent: 'editor.toolbar.outdent',
            subscript: 'editor.toolbar.subscript',
            superscript: 'editor.toolbar.superscript',
            align: {
                left: 'editor.toolbar.align.left',
                center: 'editor.toolbar.align.center',
                right: 'editor.toolbar.align.right',
                justify: 'editor.toolbar.align.justify'
            },
            orderedList: 'editor.toolbar.orderedlist',
            unorderedList: 'editor.toolbar.unorderedlist',
            undo: 'editor.toolbar.undo',
            redo: 'editor.toolbar.redo',
            insert: {
                hyperlink: 'editor.toolbar.insert.hyperlink',
                image: 'editor.toolbar.insert.image',
                media: 'editor.toolbar.insert.media',
                quote: 'editor.toolbar.insert.quote',
                code: 'editor.toolbar.insert.code',
                gif: 'editor.toolbar.insert.gif',
                emoji: 'editor.toolbar.insert.emoji',
                horizontalRule: 'editor.toolbar.insert.horizontal.rule',
                spoiler: 'editor.toolbar.insert.spoiler'
            }
        }
    },

    forum: {
        view: 'forum.view'
    }
});

module.exports = UNB_PERMISSION_KEYS;