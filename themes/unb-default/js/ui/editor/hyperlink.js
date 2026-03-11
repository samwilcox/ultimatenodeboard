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
 * UNB Editor hyperlink model.
 */
UNB.on('ui.init', () => {
    UNB.editor = UNB.editor || {};

    UNB.editor.hyperlink = UNB.editor.hyperlink || {
        editorKey: null,
        selection: null
    };

    /**
     * Handle when the user clicks the insert hyperlink button.
     */
    $(document).on('click', '[data-unb-editor-insert-url-button]', function (e) {
        const $modal = $(this).closest('[data-unb-editor-insert-link-modal]');
        const editorKey = ($modal.data('editor-key') || '').toString().trim();

        const locale = UNB.config.payload.locale;

        if (!editorKey) {
            UNB.log.warn(`No editor found for link tool: ${editorKey}.`, 'UNBEditor');
            return;
        }

        const editor = UNB.editor.editors?.[editorKey];

        if (!editor) {
            UNB.log.warn(`No editor found for link tool: ${editorKey}.`, 'UNBEditor');
            return;
        }

        UNB.editor.hyperlink.editorKey = editorKey;

        UNB.editor.hyperlink.selection = {
            from: editor.state.selection.from,
            to: editor.state.selection.to
        };

        const $urlField = $modal.find('[data-unb-editor-insert-url-url-field]');
        const $titleField = $modal.find('[data-unb-editor-insert-url-title-field]');

        let url = ($urlField.val() || '').trim();
        let title = ($titleField.val() || '').trim();

        if (!url) {
            UNB.notify(locale.error.editor.hyperlinkUrlRequired, { error: true });
            return;
        }

        if (!/^https?:\/\//i.test(url) && !/^mailto:/i.test(url)) {
            url = `https://${url}`;
        }

        if (UNB.editor.hyperlink.selection) {
            editor.commands.setTextSelection(UNB.editor.hyperlink.selection);
        }

        editor.chain().focus().run();

        let { from, to } = editor.state.selection;
        const hasSelection = from !== to;

        if (!hasSelection && title) {
            editor.chain().insertContent(title).run();

            editor.commands.setTextSelection({
                from,
                to: from + title.length
            });

            from = editor.state.selection.from;
            to = editor.state.selection.to;
        }

        if (from === to) {
            editor.chain().insertContent(url).run();

            editor.commands.setTextSelection({
                from,
                to: from + url.length
            });
        }

        editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ href: url })
            .run();

        UNB.modal.close($modal);

        UNB.editor.hyperlink.editorKey = null;
        UNB.editor.hyperlink.selection = null;

        $urlField.val('');
        $titleField.val('');
    });
});