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
 * UNB editor emoji.
 */
UNB.on('ui.init', () => {
    /**
     * Handles when the user clicks on the emoji tool.
     */
    $(document).on('click', '[data-tool="emoji"]', function (e) {
        e.preventDefault();

        const $btn = $(this);
        const editorKey = ($btn.data('unb-editor-key') || '').trim();

        if (!editorKey) {
            UNB.log.warn('Could not determine editorKey for emoji tool.', 'UNBEditor');
            return;
        }

        let $modal = $(`[data-unb-editor-insert-emoji-modal][data-unb-editor-key="${editorKey}"]`);

        if (!$modal.length) {
            const $editorWrap = $(`.unb-editor[data-unb-editor-key="${editorKey}"]`);
            $modal = $editorWrap.find(`[data-unb-editor-insert-emoji-modal]`);
        }

        if (!$modal.length) {
            UNB.log.warn(`No emoji modal found for editor: ${editorKey}.`, 'UNBEditor');
            return;
        }

        $modal.attr('data-unb-editor-key', editorKey);

        setupEmojiModal($modal);

        UNB.editor.emoji.loadDefault();

        $modal.attr('data-unb-width', 800);

        UNB.dropdown?.close?.();
        UNB.modal.open($modal);
    });
});

/**
 * Setup the Emoji modal.
 * 
 * @param {JQuery} $modal - The emoji modal.
 */
const setupEmojiModal = ($modal) => {
    if ($modal.data('__unbEmojiModalInit')) return;
    $modal.data('__unbEmojiModalInit', true);

    const $q = $modal.find('[data-unb-editor-insert-emoji-search-field]');
    const $group = $modal.find('[data-unb-role="group"]');
    const $subgroup = $modal.find('[data-unb-role="subgroup"]');
    const $tone = $modal.find('[data-unb-role="tone"]');
    const $grid = $modal.find('[data-unb-editor-insert-emoji-grid]');

    let debounceTimer = null;
    let requestId = 0;

    UNB.editor = UNB.editor || {};
    UNB.editor.emoji = UNB.editor.emoji || {};
    UNB.editor.emoji.state = UNB.editor.emoji.state || {};
    UNB.editor.emoji._cache = UNB.editor.emoji._cache || { categories: null };

    const normalize = (s) => String(s || '').trim();

    const escapeHtml = (str) => {
        if (str == null) return '';
        return String(str)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    };

    const prettifyKey = (s) => {
        const str = normalize(s);
        if (!str) return '';
        return str
            .replaceAll('-', ' ')
            .replace(/\b\w/g, m => m.toUpperCase());
    };

    const clearGrid = () => {
        if (!$grid.length) return;
        $grid.empty();
    };

    const getActiveEditorKey = () => normalize($modal.attr('data-unb-editor-key'));
    const getEditor = (editorKey) => (editorKey ? (UNB.editor.editors?.[editorKey] || null) : null);

    const restoreSelection = (editorKey, editor) => {
        const state = UNB.editor.emoji.state?.[editorKey];
        const sel = state?.selection;

        if (sel?.from != null && sel?.to != null) {
            editor.chain().focus().setTextSelection(sel).run();
        } else {
            editor.chain().focus().run();
        }
    };

    const hexcodeToUnicode = (hexcode) => {
        const hex = normalize(hexcode);
        if (!hex) return '';

        try {
            const parts = hex.split('-').map(p => parseInt(p, 16)).filter(n => Number.isFinite(n));
            if (!parts.length) return '';
            return String.fromCodePoint(...parts);
        } catch {
            return '';
        }
    };

    const parseToneValue = (val) => {
        const v = normalize(val).toLowerCase();

        if (!v || v === 'default' || v === 'none') return null;
        if (v === 'light') return 0;
        if (v === 'mediumlight' || v === 'medium-light') return 1;
        if (v === 'medium') return 2;
        if (v === 'mediumdark' || v === 'medium-dark') return 3;
        if (v === 'dark') return 4;

        const n = Number(v);
        if (Number.isFinite(n) && n >= 0) return n;

        return null;
    };

    const getSelectedToneIndex = () => {
        if (!$tone.length) return null;
        return parseToneValue($tone.val());
    };

    const pickEmojiUnicodeByTone = (item, toneIndex) => {
        const base = item?.unicode || hexcodeToUnicode(item?.hexcode);
        if (toneIndex == null) return base || '';

        const skins = item?.skins;

        if (!skins || !skins.length) return base || '';

        if (typeof skins[0] === 'string') {
            return skins[toneIndex] || base || '';
        }

        if (typeof skins[0] === 'object') {
            return skins[toneIndex]?.unicode
                || hexcodeToUnicode(skins[toneIndex]?.hexcode)
                || base
                || '';
        }

        return base || '';
    };

    const insertEmoji = (emojiChar, label = '') => {
        const editorKey = getActiveEditorKey();
        const editor = getEditor(editorKey);
        if (!editor) return false;

        restoreSelection(editorKey, editor);

        const text = String(emojiChar || '');
        if (!text) return false;

        return editor.chain().focus().insertContent(text).run();
    };

    const renderEmojiGrid = (items) => {
        clearGrid();

        const $grid = $modal.find('[data-unb-editor-insert-emoji-grid]');

        if (!Array.isArray(items) || !items.length) {
            const locale = UNB.config.payload.locale;
            $grid.text(locale.editor.emoji.none || 'No emojis found');
            return;
        }

        const toneIndex = getSelectedToneIndex();

        items.forEach(item => {
            const label = normalize(item?.label);
            const finalUnicode = pickEmojiUnicodeByTone(item, toneIndex);

            if (!finalUnicode) return;

            const $btn = $(`
                <div class="unb-editor-emoji-item" tabindex="0" role="button" aria-label="">
                    <span class="unb-editor-emoji-char"></span>
                </div>
            `);

            $btn.attr('aria-label', label || 'emoji');
            $btn.find('.unb-editor-emoji-char').text(finalUnicode);

            $btn.data('emojiUnicode', finalUnicode);
            $btn.data('emojiLabel', label);

            $grid.append($btn);
        });
    };

    const renderGroups = (groups) => {
        if (!$group.length) return;
        $group.empty();

        (groups || []).forEach(g => {
            const key = normalize(g?.key);
            const label = normalize(g?.label) || prettifyKey(key);

            if (!key) return;

            $group.append(`<option value="${escapeHtml(key)}">${escapeHtml(label)}</option>`);
        });
    };

    const renderSubgroupsForGroup = (groupKey, categoriesPayload) => {
        if (!$subgroup.length) return;

        $subgroup.empty();

        const g = (categoriesPayload?.groups || []).find(x => normalize(x?.key) === normalize(groupKey));
        const subs = g?.subgroups || [];

        subs.forEach(sg => {
            const key = normalize(sg?.key);
            const label = normalize(sg?.label) || prettifyKey(key);

            if (!key) return;

            $subgroup.append(`<option value="${escapeHtml(key)}">${escapeHtml(label)}</option>`);
        });
    };

    const apiGetCategories = async () => {
        if (UNB.editor.emoji._cache.categories) return UNB.editor.emoji._cache.categories;

        const res = await UNB.ajax.get('editor/emoji', { query: { mode: 'categories' } });
        const payload = res?.payload.data || null;

        UNB.editor.emoji._cache.categories = payload;

        return payload;
    };

    const apiGetCategoryItems = async (groupKey, subgroupKey = '') => {
        const query = { mode: 'category', group: groupKey };
        if (subgroupKey) query.subgroup = subgroupKey;

        const res = await UNB.ajax.get('editor/emoji', { query });

        return res?.payload?.data?.items || [];
    };

    const apiSearch = async (q) => {
        const res = await UNB.ajax.get('editor/emoji', { query: { mode: 'search', q } });

        return res?.payload?.data.items || [];
    };

    const loadDefaultView = async () => {
        requestId += 1;
        const rid = requestId;
        const locale = UNB.config.payload.locale;

        clearGrid();

        try {
            const cats = await apiGetCategories();
            if (rid !== requestId) return;

            const groups = cats?.groups || [];
            renderGroups(groups);

            const firstGroupKey = normalize(groups?.[0]?.key);

            if ($group.length) {
                $group.val(firstGroupKey || '');
            }

            renderSubgroupsForGroup(firstGroupKey, cats);

            if (!firstGroupKey) {
                const editorKey = getActiveEditorKey();
                const $modal = $(`[data-unb-editor-insert-emoji-modal][data-unb-editor-key="${editorKey}"]`);
                const $grid = $modal.find('[data-unb-editor-insert-emoji-grid]');
                $grid.text(locale.editor.emoji.none);
                return;
            }

            const items = await apiGetCategoryItems(firstGroupKey, '');
            if (rid !== requestId) return;

            renderEmojiGrid(items);
        } catch (error) {
            if (rid !== requestId) return;
            UNB.log.error(`Emoji load default failed: ${error}.`, 'UNBEditor');
        }
    };

    const loadCategoryView = async (groupKey, subgroupKey = '') => {
        requestId += 1;
        const rid = requestId;

        clearGrid();

        try {
            const items = await apiGetCategoryItems(groupKey, subgroupKey);
            if (rid !== requestId) return;

            renderEmojiGrid(items);
        } catch (error) {
            if (rid !== requestId) return;
            UNB.log.error(`Emoji load category failed: ${error}.`, 'UNBEditor');
        }
    };

    const loadSearchView = async (q) => {
        requestId += 1;
        const rid = requestId;

        clearGrid();

        try {
            const items = await apiSearch(q);
            if (rid !== requestId) return;

            renderEmojiGrid(items);
        } catch (error) {
            if (rid !== requestId) return;
            UNB.log.error(`Emoji search for search term '${q}' failed: ${error}.`, 'UNBEditor');
        }
    };

    const ensureCategoriesThenRenderSubgroups = async (groupKey) => {
        try {
            const cats = await apiGetCategories();
            renderSubgroupsForGroup(groupKey, cats);
        } catch (error) {
            UNB.log.error(`Emoji categories fetch failed: ${error}.`, 'UNBEditor');

            if ($subgroup.length) {
                const locale = UNB.config.payload.locale;

                $subgroup.empty().append(`<option value="">${locale.editor.emoji.subgroups || 'All subgroups'}</value>`);
            }
        }
    };

    $modal.on('click', '.unb-editor-emoji-item', function (e) {
        e.preventDefault();

        const unicode = $(this).data('emojiUnicode');
        const label = $(this).data('emojiLabel') || '';

        if (!unicode) return;

        const ok = insertEmoji(unicode, label);
        if (ok) UNB.modal.close?.($modal);
    });

    $modal.on('keydown', '.unb-editor-emoji-item', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        $(this).trigger('click');
    });

    $q.on('input', function () {
        clearTimeout(debounceTimer);

        const q = normalize($(this).val());

        debounceTimer = setTimeout(async () => {
            if (!q) {
                const g = normalize($group.val());
                const sq = normalize($subgroup.val());

                if (g) {
                    await loadCategoryView(g, sq);
                } else {
                    await loadDefaultView();
                }

                return;
            }

            await loadSearchView(q);
        }, 250);
    });

    $group.on('change', async function () {
        const g = normalize($(this).val());

        if ($q.length) $q.val('');
        
        await ensureCategoriesThenRenderSubgroups(g);

        const sg = normalize($subgroup.val());

        if (!g) {
            clearGrid();
            return;
        }

        await loadCategoryView(g, sg);
    });

    $subgroup.on('change', async function () {
        const q = normalize($q.val());
        if (q) return;

        const g = normalize($group.val());
        const sq = normalize($(this).val());

        if (!g) return;

        await loadCategoryView(g, sq);
    });

    $tone.on('change', async function () {
        const q = normalize($q.val());

        if (q) {
            await loadSearchView(q);
            return;
        }

        const g = normalize($group.val());
        const sq = normalize($subgroup.val());

        if (!g) {
            await loadDefaultView();
            return;
        }

        await loadCategoryView(g, sq);
    });

    $modal.on('click', '[data-unb-editor-insert-emoji-reset]', function (e) {
        e.preventDefault();

        if ($q.length) $q.val();
        loadDefaultView();
    });

    $modal.on('click', '[data-unb-role="load-default"]', function () {
        if ($q.length) $q.val('');
        loadDefaultView();
    });

    $modal.on('click', '[data-unb-role="close"]', function () {
        UNB.modal.close?.[$modal];
    });

    $modal.on('close', function () {
        clearTimeout(debounceTimer);
        requestId += 1;

        if ($q.length) $q.val('');
        clearGrid();
    });

    UNB.editor.emoji.loadDefault = () => loadDefaultView();
    UNB.editor.emoji.focusSearch = () => $q.trigger('focus');
};