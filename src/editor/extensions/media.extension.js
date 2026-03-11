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

/**
 * Media providers supported by UNB media embeds.
 */
const MEDIA_PROVIDERS = [
  {
    name: 'youtube',
    match: url => {
      const m =
        url.match(/(?:youtube\.com\/watch\?v=)([^&]+)/i) ||
        url.match(/youtu\.be\/([^?&]+)/i) ||
        url.match(/youtube\.com\/embed\/([^?&]+)/i)

      if (!m) return null
      return { type: 'youtube', id: m[1] }
    },
    toEmbedUrl: ({ id }) => `https://www.youtube.com/embed/${id}`,
  },

  {
    name: 'vimeo',
    match: url => {
      const m = url.match(/vimeo\.com\/(\d+)/i)
      if (!m) return null
      return { type: 'vimeo', id: m[1] }
    },
    toEmbedUrl: ({ id }) => `https://player.vimeo.com/video/${id}`,
  },

  {
    name: 'mp4',
    match: url => {
      if (!/\.mp4(\?.*)?$/i.test(url)) return null
      return { type: 'mp4', url }
    },
    toEmbedUrl: ({ url }) => url,
  },
]

const detectMedia = url => {
  if (!url || typeof url !== 'string') return null

  const clean = url.trim()

  for (const p of MEDIA_PROVIDERS) {
    const res = p.match(clean)
    if (res) return { provider: p.name, ...res }
  }

  return null
}

const UnbMedia = Node.create({
  name: 'unbMedia',

  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      provider: { default: null },
      width: { default: null },
      height: { default: null },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-unb-media]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-unb-media': 'true',
      }),
    ]
  },

  addCommands() {
    return {
      insertMedia:
        options =>
        ({ commands }) => {
          let url = null
          let width = null
          let height = null

          if (typeof options === 'string') {
            url = options
          } else if (typeof options === 'object' && options !== null) {
            url = options.url
            width = options.width ?? null
            height = options.height ?? null
          }

          if (!url) return false

          const media = detectMedia(url)
          if (!media) return false

          if (media.type === 'mp4') {
            return commands.insertContent({
              type: 'unbMedia',
              attrs: {
                provider: 'mp4',
                src: media.url,
                width,
                height,
              },
            })
          }

          const providerObj = MEDIA_PROVIDERS.find(
            x => x.name === media.provider
          )

          if (!providerObj) return false

          const embedUrl = providerObj.toEmbedUrl(media)
          if (!embedUrl) return false

          return commands.insertContent({
            type: 'unbMedia',
            attrs: {
              provider: media.provider,
              src: embedUrl,
              width,
              height,
            },
          })
        },
    }
  },
})

module.exports = UnbMedia