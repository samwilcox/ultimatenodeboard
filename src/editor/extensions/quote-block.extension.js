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

const Blockquote = require('@tiptap/extension-blockquote').default

const UnbQuote = Blockquote.extend({
  name: 'quoteBlock',

  addOptions() {
    return {
      label: 'Quote',
    }
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      { class: 'unb-editor-quote-wrapper' },
      [
        'div',
        { class: 'unb-editor-quote-header' },
        this.options.label,
      ],
      [
        'blockquote',
        {
          ...HTMLAttributes,
          class: `unb-editor-quote-block ${HTMLAttributes.class || ''}`,
        },
        0,
      ],
    ]
  },
})

module.exports = UnbQuote