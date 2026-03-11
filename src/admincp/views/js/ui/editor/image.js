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
 * UNB editor insert image.
 */
UNB_ADMINCP.on('ui.init', () => {
    /**
     * Handles when the user clicks on the custom dimensions option.
     */
    $(document).on('click', '[data-unb-editor-insert-image-custom-checkbox]', function (e) {    
        const $checkbox = $(this);

        const editorKey = ($checkbox.data('unb-editor-key') || '').trim();
        if (!editorKey) return;

        const $dims = $(`[data-unb-editor-insert-image-dimensions][data-unb-editor-key="${editorKey}"]`);

        if ($checkbox.is(':checked')) {
            $dims.fadeIn();
        } else {
            $dims.fadeOut();
        }
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
 * Helper that probes an image and returns data for it.
 * 
 * @param {string} src - The image source.
 * @returns {Promise<{
 *      ok: boolean,
 *      width: number,
 *      height: number
 * }>} A promise that resolves to an object containing the image data.
 */
const probeImage = (src) => {
    return new Promise((resolve) => {
        if (!src) return resolve({ ok: false });

        const img = new Image();

        img.onload = () => resolve({
            ok: true,
            width: img.naturalWidth || 0,
            height: img.naturalHeight || 0
        });

        img.onerror = () => resolve({ ok: false });

        img.crossOrigin = 'anonymous';
        img.src = src;
    });
};

/**
 * Setup a modal instance.
 * 
 * @param {JQuery} $modal - The model.
 */
const setupImageModal = ($modal) => {
    if ($modal.data('__unbImageModalInit')) return;
    $modal.data('__unbImageModalInit', true);

    const $url = $modal.find('[data-unb-editor-insert-image-url-field]');
    const $customDims = $modal.find('[data-unb-editor-insert-image-custom-checkbox]');
    const $dims = $modal.find('[data-unb-editor-insert-image-dimensions]');
    const $w = $modal.find('[data-unb-editor-insert-image-width]');
    const $h = $modal.find('[data-unb-editor-insert-image-height]');
    const $lock = $modal.find('[data-unb-editor-insert-image-ar-checkbox]');
    const $insert = $modal.find('[data-unb-editor-insert-image-button]');

    let naturalWidth = 0;
    let naturalHeight = 0;
    let aspect = 0;
    let lastEdited = null;
    let suppressSync = false;
    let urlTimer = null;

    const reset = () => {
        naturalWidth = 0;
        naturalHeight = 0;
        aspect = 0;
        lastEdited = null;
        suppressSync = false;

        $url.val('');
        $customDims.prop('checked', false);
        $dims.hide();
        $lock.prop('checked', true);
        $w.val('');
        $h.val('');
    };

    const syncFromWidth = () => {
        if (!$lock.prop('checked')) return;
        if (!aspect) return;

        const width  = clampInt($w.val());
        if (!width) return;

        const height = Math.round(width / aspect);
        suppressSync = true;
        $h.val(height);
        suppressSync = false;
    };

    const syncFromHeight = () => {
        if (!$lock.prop('checked')) return;
        if (!aspect) return;

        const height = clampInt($h.val());
        if (!height) return;

        const width = Math.round(height * aspect);
        suppressSync = true;
        $w.val(width);
        suppressSync = false;
    };

    const onUrlChanged = async () => {
        const src = ($url.val() || '').trim();

        if (!src) {
            naturalWidth = 0;
            naturalHeight = 0;
            aspect = 0;
            return;
        }

        const res = await probeImage(src);

        if (!res.ok || !res.width || !res.height) {
            naturalWidth = 0;
            naturalHeight = 0;
            aspect = 0;
            return;
        }

        if ($customDims.prop('checked') && $lock.prop('checked')) {
            if (lastEdited === 'h') syncFromHeight();
            else syncFromWidth();
        }

        naturalWidth = res.width;
        naturalHeight = res.height;
        aspect = naturalWidth / naturalHeight;

        if ($customDims.prop('checked')) {
            if (!clampInt($w.val())) $w.val(naturalWidth);
            if (!clampInt($h.val())) $h.val(naturalHeight);

            if ($lock.prop('checked')) {
                if (lastEdited === 'h') syncFromHeight();
                else syncFromWidth();
            }
        }
    };

    $url.on('input', () => {
        clearTimeout(urlTimer);
        urlTimer = setTimeout(onUrlChanged, 350);
    });

    $w.on('input', () => {
        if (suppressSync) return;
        lastEdited = 'w';
        syncFromWidth();
    });

    $h.on('input', () => {
        if (suppressSync) return;
        lastEdited = 'h';
        syncFromHeight();
    });

    $lock.on('change', function () {
        if (!$(this).prop('checked')) return;
        if (lastEdited === 'h') syncFromHeight();
        else syncFromWidth();
    });

    $insert.on('click', function (e) {
        e.preventDefault();

        const $button = $(this);

        const editorKey = ($button.data('unb-editor-key') || '').trim();
        if (!editorKey) return;

        const editor = UNB_ADMINCP.editor.editors?.[editorKey];

        if (!editor) {
            UNB_ADMINCP.log.warn(`Could not locate editor: ${editor}.`, 'UNBEditor');
            return;
        }

        const src = ($url.val() || '').trim();
        if (!src) return;

        let width = null;
        let height = null;

        if ($customDims.prop('checked')) {
            const wVal = clampInt($w.val());
            const hVal = clampInt($h.val());

            if (wVal) width = wVal;
            if (hVal) height = hVal;
        }

        const attrs = [];
        attrs.push(`src="${src.replace(/"/g, '&quot;')}"`);

        if (width) attrs.push(`width="${width}"`);
        if (height) attrs.push(`height="${height}"`);
        
        editor.chain().focus().insertContent(`<img ${attrs.join(' ')}>`).run();

        UNB_ADMINCP.modal?.close?.($modal);
        reset();
    });

    $modal.on('close', reset);
    $modal.data('__unbImageModalReset', reset);
};

$(document).on('click', '[data-tool="image"]', function (e) {
    e.preventDefault();

    const $btn = $(this);

    const editorKey = ($btn.data('unb-editor-key') || '').trim();

    if (!editorKey) {
        UNB_ADMINCP.log.warn('Could not determine editorKey for image tool.', 'UNBEditor');
        return;
    }

    let $modal = $(`[data-unb-editor-insert-image-modal][data-unb-editor-key="${editorKey}"]`);

    if (!$modal.length) {
        const $editorWrap = $(`.unb-editor[data-unb-editor-key="${editorKey}"]`);
        $modal = $editorWrap.find('dialog.data-unb-editor-insert-image-modal');
    }

    if (!$modal.length) {
        UNB_ADMINCP.log.warn(`No image modal found for editor: ${editorKey}.`, 'UNBEditor');
        return;
    }

    $modal.attr('data-unb-editor-key', editorKey);
    setupImageModal($modal);

    UNB_ADMINCP.dropdown?.close?.();
    UNB_ADMINCP.modal.open($modal);
});