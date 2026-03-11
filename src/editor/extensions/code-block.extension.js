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

const CodeBlockLowlight = require('@tiptap/extension-code-block-lowlight').default
const { lowlight } = require('lowlight')

const js = require('highlight.js/lib/languages/javascript')
const ts = require('highlight.js/lib/languages/typescript')
const xml = require('highlight.js/lib/languages/xml')
const css = require('highlight.js/lib/languages/css')
const scss = require('highlight.js/lib/languages/scss')
const json = require('highlight.js/lib/languages/json')
const yaml = require('highlight.js/lib/languages/yaml')
const md = require('highlight.js/lib/languages/markdown')
const bash = require('highlight.js/lib/languages/bash')
const python = require('highlight.js/lib/languages/python')
const java = require('highlight.js/lib/languages/java')
const c = require('highlight.js/lib/languages/c')
const cpp = require('highlight.js/lib/languages/cpp')
const csharp = require('highlight.js/lib/languages/csharp')
const go = require('highlight.js/lib/languages/go')
const rust = require('highlight.js/lib/languages/rust')
const php = require('highlight.js/lib/languages/php')
const ruby = require('highlight.js/lib/languages/ruby')
const sql = require('highlight.js/lib/languages/sql')
const diff = require('highlight.js/lib/languages/diff')

// register languages
lowlight.registerLanguage('javascript', js)
lowlight.registerLanguage('js', js)

lowlight.registerLanguage('typescript', ts)
lowlight.registerLanguage('ts', ts)

lowlight.registerLanguage('html', xml)
lowlight.registerLanguage('xml', xml)

lowlight.registerLanguage('css', css)
lowlight.registerLanguage('scss', scss)

lowlight.registerLanguage('json', json)
lowlight.registerLanguage('yaml', yaml)
lowlight.registerLanguage('yml', yaml)

lowlight.registerLanguage('markdown', md)
lowlight.registerLanguage('md', md)

lowlight.registerLanguage('bash', bash)
lowlight.registerLanguage('shell', bash)
lowlight.registerLanguage('sh', bash)

lowlight.registerLanguage('python', python)
lowlight.registerLanguage('py', python)

lowlight.registerLanguage('java', java)

lowlight.registerLanguage('c', c)
lowlight.registerLanguage('cpp', cpp)
lowlight.registerLanguage('c++', cpp)

lowlight.registerLanguage('csharp', csharp)
lowlight.registerLanguage('cs', csharp)

lowlight.registerLanguage('go', go)
lowlight.registerLanguage('golang', go)

lowlight.registerLanguage('rust', rust)
lowlight.registerLanguage('rs', rust)

lowlight.registerLanguage('php', php)

lowlight.registerLanguage('ruby', ruby)
lowlight.registerLanguage('rb', ruby)

lowlight.registerLanguage('sql', sql)

lowlight.registerLanguage('diff', diff)

const UnbCodeBlock = CodeBlockLowlight.extend({
  name: 'codeBlock',

  renderHTML({ node, HTMLAttributes }) {
    const language = node.attrs.language || null

    return [
      'div',
      { class: 'unb-editor-code-wrapper' },
      [
        'div',
        { class: 'unb-editor-code-header' },
        language ? language.toUpperCase() : 'CODE'
      ],
      [
        'pre',
        {
          ...HTMLAttributes,
          class: `unb-editor-code-block ${HTMLAttributes.class || ''}`
        },
        [
          'code',
          { class: HTMLAttributes.class },
          0
        ]
      ]
    ]
  }
}).configure({
  lowlight
})

module.exports = UnbCodeBlock;