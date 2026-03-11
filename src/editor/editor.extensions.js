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

const FontSize = require('./extensions/font-size.extension');
const UnbCodeBlock = require('./extensions/code-block.extension');
const UnbMedia = require('./extensions/media.extension');
const UnbQuote = require('./extensions/quote-block.extension');
const UnbSpoiler = require('./extensions/spoiler.extension');
const Indent = require('./extensions/indent.extension');
const EditorError = require('../errors/editor.error');
const { UNB_ERROR_CODES } = require('../errors/error.enums');
const Logger = require('../log/logger');

const HardBreak = require('@tiptap/extension-hard-break').default;
const StarterKit = require('@tiptap/starter-kit').default;
const Link = require('@tiptap/extension-link').default;
const Underline = require('@tiptap/extension-underline').default;
const Subscript = require('@tiptap/extension-subscript').default;
const Superscript = require('@tiptap/extension-superscript').default;
const TextAlign = require('@tiptap/extension-text-align').default;
const ListItem = require('@tiptap/extension-list-item').default;
const Color = require('@tiptap/extension-color').default;
const { TextStyle } = require('@tiptap/extension-text-style');
const FontFamily = require('@tiptap/extension-font-family').default;
const Image = require('@tiptap/extension-image').default;
const Blockquote = require('@tiptap/extension-blockquote').default;
const HorizontalRule = require('@tiptap/extension-horizontal-rule').default;

const extensions = [
    StarterKit.configure({ codeBlock: false }),
    UnbCodeBlock,
    UnbQuote,
    Underline,
    Subscript,
    Superscript,
    UnbMedia,
    TextStyle,
    Color,
    FontSize,
    FontFamily.configure({ types: ['textStyle'] }),
    Image,
    Blockquote,
    UnbSpoiler,
    HorizontalRule,
    ListItem,
    Indent,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Link,
    HardBreak
];

extensions.forEach((ext, i) => {
    if (!ext) {
        Logger.error('UNBEditorExtensions', `UNB text editor extension failed to load at index: '${i}': '${extensions[i]}'`, { ext, i });
    }
});

const cleanExtensions = extensions.filter(Boolean);

if (cleanExtensions.length !== extensions.length) {
    throw new EditorError(
        'Failed to load a UNB text editor extension.',
        {
            code: UNB_ERROR_CODES.EDITOR_EXT_LOAD_FAILED
        }
    );
}

module.exports = Object.freeze(cleanExtensions);