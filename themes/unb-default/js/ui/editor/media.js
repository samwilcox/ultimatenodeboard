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
 * UNB media.
 */
UNB.on('ui.init', () => {
    /**
     * Handle when the user clicks on the media tool.
     */
    $(document).on('click', '[data-tool="media"]', function (e) {
        e.preventDefault();

        const $btn = $(this);
        const editorKey = ($btn.data('unb-editor-key') || '').trim();

        if (!editorKey) {
            UNB.log.warn('Could not determine editorKey for image tool.', 'UNBEditor');
            return;
        }

        let $modal = $(`[data-unb-editor-insert-media-modal][data-unb-editor-key="${editorKey}"]`);

        if (!$modal.length) {
            const $editorWrap = $(`.unb-editor[data-unb-editor-key="${editorKey}"]`);
            $modal = $editorWrap.find(`[data-unb-editor-insert-media-modal]`);
        }

        if (!$modal.length) {
            UNB.log.warn(`No image modal found for editor: ${editorKey}.`, 'UNBEditor');
            return;
        }

        $modal.attr('data-unb-editor-key', editorKey);

        setupMediaModal($modal);

        UNB.dropdown?.close?.();
        UNB.modal.open($modal);
    });
});

/**
 * Helper to clamp to a given int.
 * 
 * @param {number|string} v - The number to clamp to.
 * @returns {number} The clamped number.
 */
const clampInt = (v) => {
    const n = parseInt(String(v || '').trim(), 10);
    return Number.isFinite(n) && n > 0 ? n : 0;
};

/**
 * Setup the media modal.
 * 
 * @param {JQuery} $modal - The modal element.
 */
const setupMediaModal = ($modal) => {
    if ($modal.data('__unbMediaModalInit')) return;
    $modal.data('__unbMediaModalInit', true);

    const $url = $modal.find('[data-unb-editor-insert-media-url-field]');
    const $useCustom = $modal.find('[data-unb-editor-insert-media-custom-checkbox]');
    const $dimsArea = $modal.find('[data-unb-editor-insert-media-dimensions]');
    const $w = $modal.find('[data-unb-editor-insert-media-width]');
    const $h = $modal.find('[data-unb-editor-insert-media-height]');
    const $insert = $modal.find('[data-unb-editor-insert-media-button]');

    const reset = () => {
        $url.val('');
        $useCustom.prop('checked', false);
        $dimsArea.fadeOut();
        $w.val('');
        $h.val('');
    };

    $useCustom.on('change', function () {
        const on = !!$(this).prop('checked');

        if (on) {
            $dimsArea.fadeIn();
        } else {
            $dimsArea.fadeOut();
        }
    });

    $insert.on('click', function (e) {
        e.preventDefault();

        const $button = $(this);

        const editorKey = ($button.data('unb-editor-key') || '').trim();
        if (!editorKey) return;

        const editor = UNB.editor.editors?.[editorKey];
        if (!editor) return;

        const src = ($url.val() || '').trim();
        if (!src) return;

        let width = null;
        let height = null;

        if ($useCustom.prop('checked')) {
            const wVal = clampInt($w.val());
            const hVal = clampInt($h.val());

            if (wVal) width = wVal;
            if (hVal) height = hVal;
        }

        const ok = editor.commands.insertMedia({
            url: src,
            width,
            height
        });

        if (!ok) return;

        UNB.modal?.close?.($modal);
        reset();
    });

    $modal.on('close', reset);
};