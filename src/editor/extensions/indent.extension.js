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

const { Extension } = require('@tiptap/core')

const clamp = (n, min, max) => Math.max(min, Math.min(max, n))

/**
 * UNB paragraph/heading indent extension.
 */
const Indent = Extension.create({
  name: 'unbIndent',

  addOptions() {
    return {
      types: ['paragraph', 'heading'],
      minLevel: 0,
      maxLevel: 8,
      stepEm: 2, // each indent level = 2em
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          indent: {
            default: 0,

            parseHTML: element => {
              const raw = element.getAttribute('data-indent')
              const n = raw ? parseInt(raw, 10) : 0
              return Number.isFinite(n) ? n : 0
            },

            renderHTML: attributes => {
              const level = attributes.indent ?? 0
              if (!level || level <= 0) return {}

              const em = level * this.options.stepEm

              return {
                'data-indent': String(level),
                style: `padding-left: ${em}em;`,
              }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    const types = this.options.types
    const minLevel = this.options.minLevel
    const maxLevel = this.options.maxLevel

    const updateIndent =
      delta =>
      ({ tr, state, dispatch }) => {
        const { from, to } = state.selection
        let changed = false

        state.doc.nodesBetween(from, to, (node, pos) => {
          if (!types.includes(node.type.name)) return

          const current = node.attrs.indent ?? 0
          const next = clamp(current + delta, minLevel, maxLevel)
          if (next === current) return

          tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            indent: next,
          })

          changed = true
        })

        if (!changed) return false

        if (dispatch) dispatch(tr)
        return true
      }

    const resetIndent =
      () =>
      ({ tr, state, dispatch }) => {
        const { from, to } = state.selection
        let changed = false

        state.doc.nodesBetween(from, to, (node, pos) => {
          if (!types.includes(node.type.name)) return

          const current = node.attrs.indent ?? 0
          if (!current) return

          tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            indent: 0,
          })

          changed = true
        })

        if (!changed) return false

        if (dispatch) dispatch(tr)
        return true
      }

    return {
      indent: () => updateIndent(+1),
      outdent: () => updateIndent(-1),
      resetIndent: () => resetIndent(),
    }
  },
})

module.exports = Indent