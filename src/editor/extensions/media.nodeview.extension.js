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

const BaseUnbMedia = require('./media.extension');

module.exports = BaseUnbMedia.extend({
    addNodeView() {
        return ({ node }) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'unb-media';

            const src = node.attrs.src;
            const provider = node.attrs.provider;
            const width = node.attrs.width;
            const height = node.attrs.height;

            if (!src) {
                const placeholder = document.createElement('div');
                placeholder.className = 'unb-media__missing';
                placeholder.textContent = '[Media embed failed: missing src]';

                wrapper.appendChild(placeholder);

                return { dom: wrapper };
            }

            if (provider === 'mp4') {
                const video = document.createElement('video');

                video.controls = true;
                video.src = src;
                video.style.width  = width  ? `${width}px`  : '100%';
                video.style.height = height ? `${height}px` : 'auto';

                wrapper.appendChild(video);
            } else {
                const iframe = document.createElement('iframe');

                iframe.src = src;
                iframe.setAttribute('frameborder', '0');
                iframe.setAttribute('allowfullscreen', 'true');

                iframe.setAttribute(
                    'allow',
                    'encrypted-media; autoplay; clipboard-write; fullscreen'
                );

                iframe.setAttribute(
                    'referrerpolicy',
                    'strict-origin-when-cross-origin'
                );

                iframe.style.width = width
                    ? `${width}px`
                    : '100%';

                iframe.style.height = height
                    ? `${height}px`
                    : provider === 'tiktok'
                        ? '600px'
                        : '360px';

                wrapper.appendChild(iframe);
            }

            return { dom: wrapper };
        };
    }
});