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
 * UNB editor code.
 */
UNB.on('ui.init', () => {
    /**
     * Handles when the user clicks the insert code tool.
     */
    $(document).on('click', '[data-tool="code"]', function (e) {
        e.preventDefault();

        const $button = $(this);
        const editorKey = ($button.data('unb-editor-key') || '').trim();

        if (!editorKey) {
            UNB.log.warn('Could not determine the editorKey for code tool.', 'UNBEditor');
            return;
        }

        let $modal = $(`[data-unb-editor-insert-code-modal][data-unb-editor-key="${editorKey}"]`);

        if (!$modal.length) {
            const $editorWrap = $(`.unb-editor[data-unb-editor-key="${editorKey}"]`);
            $modal = $editorWrap.find('[data-unb-editor-insert-code-modal]');
        }

        if (!$modal.length) {
            UNB.log.warn(`No code modal found for editor: ${editorKey}.`, 'UNBEditor');
            return;
        }

        $modal.attr('data-unb-editor-key', editorKey);

        setupCodeModal($modal);

        $modal.attr('data-unb-width', 800);

        UNB.dropdown?.close?.();
        UNB.modal.open($modal);

        $modal.find('[data-unb-role="code"]').trigger('focus');
    });
});

/**
 * Setup the code modal.
 * 
 * @param {JQuery} $modal - The code modal.
 */
const setupCodeModal = ($modal) => {
    if ($modal.data('__unbEditorCodeModalInit')) return;
    $modal.data('__unbEditorCodeModalInit', true);

    const $code = $modal.find('[data-unb-role="code"]');
    const $insert = $modal.find('[data-unb-role="insert"]');
    const $lang = $modal.find('[data-unb-role="language"]');

    /**
     * Enable tab support inside textarea
     */
    $code.on('keydown', function (e) {
        if (e.key !== 'Tab') return;

        e.preventDefault();

        const el = this;
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const value = el.value;

        const selected = value.slice(start, end);

        if (selected.includes('\n')) {
            const lines = selected.split('\n');

            if (e.shiftKey) {
                const unindented = lines.map(line =>
                    line.startsWith('\t') ? line.slice(1) :
                    line.startsWith('    ') ? line.slice(4) :
                    line
                ).join('\n');

                el.value = value.slice(0, start) + unindented + value.slice(end);
                el.selectionStart = start;
                el.selectionEnd = start + unindented.length;
            } else {
                const indented = lines.map(line => '\t' + line).join('\n');

                el.value = value.slice(0, start) + indented + value.slice(end);
                el.selectionStart = start;
                el.selectionEnd = start + indented.length; // FIXED
            }

            return;
        }

        if (!e.shiftKey) {
            el.value = value.slice(0, start) + '\t' + value.slice(end);
            el.selectionStart = el.selectionEnd = start + 1;
        }
    });

    /**
     * Insert code into editor
     */
    $insert.on('click', function (e) {
        e.preventDefault();

        const editorKey = ($modal.attr('data-unb-editor-key') || '').trim();
        const editor = UNB.editor.editors?.[editorKey];

        if (!editor) {
            UNB.log.warn(`No editor found for editorKey: ${editorKey}.`, 'UNBEditor');
            return;
        }

        const codeText = ($code.val() || '').trim();
        if (!codeText) return;

        let language = ($lang.val() || 'autodetect').trim();

        if (language === 'autodetect') {
            try {
                const res = UNB.editor.lowLight?.highlightAuto(codeText);
                language = res?.data?.language || null;
            } catch {
                language = null;
            }
        }

        editor
            .chain()
            .focus()
            .insertContent({
                type: 'codeBlock',
                attrs: { language: language || null },
                content: [
                {
                    type: 'text',
                    text: codeText,
                },
                ],
            })
            .run();

        UNB.modal.close?.($modal);
    });
};