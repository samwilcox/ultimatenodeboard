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

import './core/hooks.js';

import './services/storage.service.js';
import './services/storage.keys.js';
import './services/config.service.js';

import './log/log.service.js';
import './log/log.helper.js';

import './ui/main.js';
import './ui/editor/editor.js';
import './ui/components/dropdowns.js';
import './ui/components/errorbox.js';
import './ui/components/modal.js';
import './ui/editor/editor.js';
import './ui/editor/hyperlink.js';
import './ui/editor/image.js';
import './ui/editor/media.js';
import './ui/editor/gif.js';
import './ui/editor/emoji.js';
import './ui/editor/code.js';
import './ui/editor/quote.js';
import './ui/editor/spoiler.js';
import './ui/ajax/ajax.js';

$(function () {
    if (UNB_ADMINCP.__uiInitialized) return;
    UNB_ADMINCP.__uiInitialized = true;

    UNB_ADMINCP.data = UNB_ADMINCP.data || {};

    UNB_ADMINCP.fire('ui.init');
});