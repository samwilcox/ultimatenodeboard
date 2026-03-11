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
 * UNB editor spoiler.
 */
UNB_ADMINCP.on('ui.init', () => {
    'use strict';

    setupSpoiler();
});

/**
 * Setup the UNB spoiler.
 */
const setupSpoiler = () => {
    if ($(document).data('__unbEditorSpoilerInit')) return;
    $(document).data('__unbEditorSpoilerInit', true);

    $(document).on('click', '[data-tool="spoiler"]', function (e) {
        e.preventDefault();

        const $button = $(this);
        if (!$button.length) return;

        const editorKey = ($button.attr('data-unb-editor-key') || '').trim();
        const editor = UNB_ADMINCP.editor.editors?.[editorKey];

        if (!editor) return;

        editor
            .chain()
            .focus()
            .insertSpoiler()
            .run();
    });

    $(document).on('click', '[unb-editor-spoiler-header]', function () {
        $(this)
            .closest('.unb-editor-spoiler')
            .toggleClass('is-open');
    });
};