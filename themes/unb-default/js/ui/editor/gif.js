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
 * UNB insert gif.
 */
UNB.on('ui.init', () => {
    /**
     * Handle when the user clicks on the GIF tool.
     */
    $(document).on('click', '[data-tool="gif"]', function (e) {
        e.preventDefault();

        const $button = $(this);
        const editorKey = ($button.data('unb-editor-key') || '').trim();

        if (!editorKey) {
            UNB.log.warn('Could not determine editorKey for the GIF tool.', 'UNBEditor');
            return;
        }

        let $modal = $(`[data-unb-editor-insert-gif-modal][data-unb-editor-key="${editorKey}"]`);

        if (!$modal.length) {
            const $editorWrap = $(`.unb-editor[data-unb-editor-key="${editorKey}"]`);
            $modal = $editorWrap.find(`[data-unb-editor-insert-media-modal]`);
        }

        if (!$modal.length) {
            UNB.log.warn(`No GIF modal found for editor: ${editorKey}.`, 'UNBEditor');
            return;
        }

        $modal.attr('data-unb-editor-key', editorKey);

        setupGifModal($modal);

        UNB.editor.gif.loadTrending();

        UNB.dropdown?.close?.();
        UNB.modal.open($modal);
    }); 
});

/**
 * Setup the GIF modal.
 * 
 * @param {JQuery} $modal - The GIF modal.
 */
const setupGifModal = ($modal) => {
    if ($modal.data('__unbGifModalInit')) return;
    $modal.data('__unbGifModalInit', true);

    const $q = $modal.find('[data-unb-editor-insert-gif-search-field]');
    const $grid = $modal.find('[data-unb-editor-insert-gif-grid]');
    const locale = UNB.config.payload.locale;

    let debounceTimer = null;
    let requestId = 0;

    let offset = 0;
    let loading = false;
    let hasMore = true;
    let currentMode = 'trending';
    let currentQuery = '';

    UNB.editor.gif = UNB.editor.gif || {};
    UNB.editor.gif.state = UNB.editor.gif.state || {};

    const escapeHtml = (str) => {
        if (str === null) return;

        return String(str)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    };

    const getActiveEditorKey = () => {
        return ($modal.data('unb-editor-key') || '').trim();
    };

    const getEditor = (editorKey) => {
        if (!editorKey) return null;
        return UNB.editor.editors?.[editorKey] || null;
    };

    const renderGifs = (items, append = false) => {
        if (!append) $grid.empty();

        if (!items || !items.length) {
            $grid.text(locale.editor.gif.none);
            return;
        }

        items.forEach(g => {
            const preview =
                g.previewUrl ||
                g.preview ||
                g.images?.fixed_width_small?.url ||
                g.images?.fixed_width?.url ||
                g.images?.downsized?.url ||
                g.url;

            const original =
                g.gifUrl ||
                g.originalUrl ||
                g.images?.original?.url ||
                g.images?.fixed_width?.url ||
                g.url;

            if (!preview || !original) return;

            const title = (g.title || '').trim();

            const $item = $(`
                <div class="unb-editor-gif-item" tabindex="0" role="button">
                    <img loading="lazy" alt="">
                </div>
            `);

            $item.find('img')
                .attr('src', preview)
                .attr('alt', title);

            $item.data('gifUrl', original);
            $item.data('gifTitle', title);

            $grid.append($item);
        });
    };

    const loadGifs = async (mode, q = '', reset = false) => {
        if (loading) return;
        if (!hasMore && !reset) return;

        if (reset) {
            offset = 0;
            hasMore = true;
            $grid.empty();
        }

        loading = true;
        requestId += 1;
        const localeRequestId = requestId;

        try {
            const res = await UNB.ajax.get('editor/giphy', {
                query: {
                    mode,
                    q,
                    offset
                }
            });

            if (localeRequestId !== requestId) return;

            const items = res?.payload.data || [];

            if (!items.length) {
                hasMore = false;
                return;
            }

            renderGifs(items, true);

            offset += items.length;

        } catch (error) {
            UNB.log.error('GIF load failed.', 'UNBEditor');
        } finally {
            loading = false;
        }
    };

    const restoreSelection = (editorKey, editor) => {
        const state = UNB.editor.gif.state?.[editorKey];
        const sel = state?.selection;

        if (sel?.from != null && sel?.to != null) {
            editor.chain().focus().setTextSelection(sel).run();
        } else {
            editor.chain().focus().run();
        }
    };

    const insertGif = (gifUrl, title = '') => {
        const editorKey = getActiveEditorKey();
        const editor = getEditor(editorKey);
        if (!editor) return false;

        restoreSelection(editorKey, editor);

        const html = `<img src="${gifUrl}" alt="${escapeHtml(title)}">`;
        const ok = editor.chain().focus().insertContent(html).run();

        return ok;
    };

    $modal.on('click', '.unb-editor-gif-item', function (e) {
        e.preventDefault();

        const gifUrl = $(this).data('gifUrl');
        const title = $(this).data('gifTitle') || '';

        if (!gifUrl) return;

        const ok = insertGif(gifUrl, title);
        if (ok) UNB.modal?.close?.($modal);
    });

    $q.on('input', function () {
        clearTimeout(debounceTimer);

        const q = ($(this).val() || '').trim();

        debounceTimer = setTimeout(() => {
            currentMode = q ? 'search' : 'trending';
            currentQuery = q;
            loadGifs(currentMode, currentQuery, true);
        }, 250);
    });

    $modal.on('close', function () {
        clearTimeout(debounceTimer);
        requestId += 1;
        $q.val('');
        $grid.empty();
    });

    $grid.on('scroll', function () {
        const threshold = 150;

        const scrollTop = $grid.scrollTop();
        const height = $grid.innerHeight();
        const scrollHeight = $grid[0].scrollHeight;

        if (scrollTop + height >= scrollHeight - threshold) {
            loadGifs(currentMode, currentQuery);
        }
    });

    currentMode = 'trending';
    currentQuery = '';
    loadGifs('trending', '', true);

    UNB.editor.gif.loadTrending = () => loadGifs('trending');
    UNB.editor.gif.search = (q) => loadGifs('search', q);
    UNB.editor.focusSearch = () => $q.trigger('focus');
};