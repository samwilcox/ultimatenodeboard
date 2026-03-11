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

const { Node, mergeAttributes } = require('@tiptap/core')

const UnbSpoiler = Node.create({
  name: 'spoilerBlock',

  group: 'block',

  content: 'block+',

  defining: true,

  addOptions() {
    return {
      label: 'Spoiler',
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div.unb-editor-spoiler',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        class: 'unb-editor-spoiler',
      }),
      [
        'div',
        { class: 'unb-editor-spoiler-header' },
        this.options.label,
      ],
      [
        'div',
        { class: 'unb-editor-spoiler-content' },
        0,
      ],
    ]
  },

  addCommands() {
    return {
      insertSpoiler:
        () =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            content: [
              {
                type: 'paragraph',
              },
            ],
          })
        },
    }
  },
})

module.exports = UnbSpoiler