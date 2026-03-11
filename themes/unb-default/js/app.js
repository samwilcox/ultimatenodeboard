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

/* -------------------------------------------------------------------- */
/* Third party libraries                                                */
/* -------------------------------------------------------------------- */
import './thirdparty/jquery-ui.js';

/* -------------------------------------------------------------------- */
/* UNB core libraries                                                   */
/* -------------------------------------------------------------------- */
import './core/hooks.js';

/* -------------------------------------------------------------------- */
/* UNB UI logging system                                                */
/* -------------------------------------------------------------------- */
import './log/log.helpers.js';
import './log/log.js';

/* -------------------------------------------------------------------- */
/* UNB service libraries                                                */
/* -------------------------------------------------------------------- */
import './services/config.service.js';
import './services/storage.service.js';
import './services/storage.keys.js';

/* -------------------------------------------------------------------- */
/* UNB helpers                                                          */
/* -------------------------------------------------------------------- */
import './helpers/loader.helper.js';
import './helpers/url.helper.js';
import './helpers/load-more.helper.js';
import './helpers/html.helper.js';

/* -------------------------------------------------------------------- */
/* UNB UI libraries                                                     */
/* -------------------------------------------------------------------- */
import './ui/ajax/ajax.core.js';
import './ui/theme/theme.toggle.js';
import './ui/components/dropdowns.js';
import './ui/pages/index.page.js';
import './ui/components/modal.js';
import './ui/auth/password-toggle.js';
import './ui/components/errorbox.js';
import './ui/auth/detect.js';
import './ui/editor/editor.js';
import './ui/editor/hyperlink.js';
import './ui/components/notify.js';
import './ui/editor/image.js';
import './ui/editor/media.js';
import './ui/editor/gif.js';
import './ui/editor/emoji.js';
import './ui/editor/code.js';
import './ui/editor/quote.js';
import './ui/editor/spoiler.js';
import './ui/posts/infinite-scroll.js';
import './ui/like/like.js';
import './ui/components/post-scroller.js';

/**
 * UNB UI bootstrap process.
 */
$(function () {
    if (UNB.__uiInitialized) return;
    UNB.__uiInitialized = true;

    UNB.data = UNB.data || {};

    UNB.fire('ui.init');
});