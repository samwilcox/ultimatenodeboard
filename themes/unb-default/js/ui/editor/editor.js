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

import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import ListItem from '@tiptap/extension-list-item';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import Image from '@tiptap/extension-image';
import Blockquote from '@tiptap/extension-blockquote';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import { Plugin } from 'prosemirror-state';
import UnbMedia from './extensions/media-node-view.extension';
import CodeBlockModule from '../../../../../src/editor/extensions/code-block.extension';
import FontSize from '../../../../../src/editor/extensions/font-size.extension';
import Indent from '../../../../../src/editor/extensions/indent.extension';
import UnbSpoiler from '../../../../../src/editor/extensions/spoiler.extension';
import UnbQuote from '../../../../../src/editor/extensions/quote-block.extension';

const { UnbCodeBlock, lowlight: unbLowlight } = CodeBlockModule;

UNB.editor = UNB.editor || {};
UNB.editor.lowLight = unbLowlight;

/**
 * UNB text editor (powered by TipTap!).
 */
UNB.on('ui.init', () => {
    const $fontScroller = $('[data-unb-editor-font-scroller]');
    const $fontSizeScroller = $('[data-unb-editor-font-size-scroller]');
    const $fontColorScroller = $('[data-unb-editor-font-color-scroller]');
    const $textAlignScroller = $('[data-unb-editor-addformatting-scroller]');

    $fontScroller.hide();
    $fontSizeScroller.hide();
    $fontColorScroller.hide();
    $textAlignScroller.hide();

    UNB.editor.editors = UNB.editor.editors || {};

    const locale = window.UNB_BOOTSTRAP.locale;

    $('[data-unb-editor]').each(function () {
        const $surface = $(this);

        if ($surface.data('__unbEditorInit')) return;
        $surface.data('__unbEditorInit', true);

        const inputSelector = $surface.data('unb-input');
        const placeholder = $surface.data('unb-placeholder');
        const $input = $(inputSelector);
        if (!$input.length) return;

        const $editorWrap = $surface.closest('.unb-editor');
        const $toolbar = $editorWrap.find('.unb-editor-toolbar');

        const editorKey = $editorWrap.data('unb-editor-key') || $surface.attr('id');
    
        if (!editorKey) {
            UNB.log.warn('Missing editor key. Add data-unb-editor-key to editor wrapper.');
            return;
        }

        let syncTimeout = null;

        const editor = new Editor({
            element: this,
            extensions: [
                StarterKit.configure({
                    codeBlock: false
                }),

                UnbCodeBlock,
                UnbQuote.configure({
                    label: locale.editor.quote
                }),
                Underline,
                Subscript,
                Superscript,
                UnbMedia,
                TextStyle,
                Color,
                FontSize,
                FontFamily.configure({ types: ['textStyle'] }),
                Image.configure({
                    inline: false,
                    allowBase64: false
                }),
                Blockquote,
                UnbSpoiler.configure({
                    label: locale.editor.spoiler
                }),
                HorizontalRule,
                ListItem,
                Indent,
                TextAlign.configure({
                    types: ['heading', 'paragraph']
                }),
                Link.configure({
                    openOnClick: false
                }),
                Placeholder.configure({
                    placeholder
                })
            ],
            editorProps: {
                attributes: {
                    spellcheck: 'false',
                    autocapitalize: 'off',
                    autocomplete: 'off',
                    autocorrect: 'off'
                },
                handlePaste(view, event) {
                    const text = event.clipboardData?.getData('text/plain');
                    if (!text) return false;

                    const m = text.match(/https?:\/\/[^\s]+/i);
                    if (!m) return false;

                    const url = m[0];

                    const ok = editor.commands.insertMedia(url);
                    return ok;
                }
            },
            content: $input.val() || '',
            onUpdate({ editor }) {
                clearTimeout(syncTimeout),
                
                syncTimeout = setTimeout(() => {
                    $input.val(JSON.stringify(editor.getJSON()));
                }, 300);
            },
            onSelectionUpdate({ editor }) {
                updateToolbarState($toolbar, editorKey, editor);
            }
        });

        $surface.data('unb-editor', editor);
        UNB.editor.editors[editorKey] = editor;

        bindToolbar($editorWrap, $toolbar, editorKey);
        updateToolbarState($toolbar, editorKey, editor);
    });

    /**
     * Handle when the user clicks on the font selection.
     */
    $(document).on('click', '[data-unb-editor-font-select]', function (e) {
        e.preventDefault();
        e.stopPropagation();

        if ($fontScroller.is(':visible')) {
            $fontScroller.slideUp();
        } else {
            $fontScroller.slideDown();
        }   
    });

    /**
     * Handle when the user clicks on the font size selection.
     */
    $(document).on('click', '[data-unb-editor-font-size-select]', function (e) {
        e.preventDefault();
        e.stopPropagation();

        if ($fontSizeScroller.is(':visible')) {
            $fontSizeScroller.slideUp();
        } else {
            $fontSizeScroller.slideDown();
        }
    });

    /**
     * Handle when the user clicks on the font color selection.
     */
    $(document).on('click', '[data-unb-editor-font-color-select]', function (e) {
        e.preventDefault();
        e.stopPropagation();

        if ($fontColorScroller.is(':visible')) {
            $fontColorScroller.slideUp();
        } else {
            $fontColorScroller.slideDown();
        }
    });

    /**
     * Handle when the user clicks on the text align selection.
     */
    $(document).on('click', '[data-unb-editor-addformatting-select]', function (e) {
        e.preventDefault();
        e.stopPropagation();

        if ($textAlignScroller.is(':visible')) {
            $textAlignScroller.slideUp();
        } else {
            $textAlignScroller.slideDown();
        }
    });

    /**
     * Handle when the user clicks on the button to insert a hyperlink.
     */
    $(document).on('click', '[data-unb-editor-insert-url-button]', function (e) {
        e.preventDefault();

        $urlField = $('[data-unb-editor-insert-url-url-field]');
        $titleField = $('[data-unb-editor-insert-url-title-field]');

        if (!$urlField.length) return;

        const url = $urlField.val();
        const title = $titleField.val();


    });
});

/**
 * Get dropdown menus for the editor.
 * 
 * @param {string} editorKey - The editor key name.
 * @returns {jQuery[]} The collection of menus. 
 */
const getMenusForEditor = (editorKey) => {
    return $(`.unb-drop-down[data-unb-editor-key="${editorKey}"]`);
};

/**
 * Bind the toolbar to the editor.
 * 
 * @param {jQuery} $editorWrap - The editor wrap jQuery element.
 * @param {jQuery} $toolbar - The toolbar jQuery element. 
 * @param {string} editorKey - The editor key to bind. 
 */
const bindToolbar = ($editorWrap, $toolbar, editorKey) => {
    if (!$toolbar.length) return;
    if ($toolbar.data('__unbToolbarInit')) return;

    $toolbar.data('__unbToolbarInit', true);

    if (!UNB.editor.__toolHandlerBound) {
        UNB.editor.__toolHandlerBound = true;

        $(document).on('click', '[data-tool]', function (e) {
            e.preventDefault();

            const $btn = $(this);
            const tool = $btn.data('tool');
            if (!tool) return;

            let $editorWrap = $btn.closest('.unb-editor');
            let resolvedEditorKey = $editorWrap.data('unb-editor-key');

            if (!resolvedEditorKey) {
                resolvedEditorKey = $btn
                    .closest('.unb-drop-down')
                    .data('editor-key');
            }

            const editor = UNB.editor.editors?.[resolvedEditorKey];
            if (!editor) return;

            applyTool(editor, tool, $btn);

            const $toolbar = $(`[data-unb-editor-key="${resolvedEditorKey}"]`)
                .find('.unb-editor-toolbar');

            updateToolbarState($toolbar, resolvedEditorKey, editor);
        });
    }
};

/**
 * Update the toolbar state.
 * 
 * @param {jQuery} $toolbar - The toolbar jQuery element.
 * @param {string} editorKey - The editor key name.
 * @param {Editor} editor - The editor. 
 */
const updateToolbarState = ($toolbar, editorKey, editor) => {
    if (!$toolbar.length) return;

    const indentLevel =
        (editor.getAttributes('paragraph')?.indent || 0) ||
        (editor.getAttributes('heading')?.indent || 0);

    const inList = editor.isActive('bulletList') || editor.isActive('orderedList');

    setActive($toolbar, 'bold', editor.isActive('bold'));
    setActive($toolbar, 'italic', editor.isActive('italic'));
    setActive($toolbar, 'underline', editor.isActive('underline'));
    setActive($toolbar, 'strike', editor.isActive('strike'));
    setActive($toolbar, 'subscript', editor.isActive('subscript'));
    setActive($toolbar, 'superscript', editor.isActive('superscript'));
    setActive($toolbar, 'alignLeft', editor.isActive({ textAlign: 'left' }));
    setActive($toolbar, 'alignCenter', editor.isActive({ textAlign: 'center' }));
    setActive($toolbar, 'alignRight', editor.isActive({ textAlign: 'right' }));
    setActive($toolbar, 'alignJustify', editor.isActive({ textAlign: 'justify' }));
    setActive($toolbar, 'indent', indentLevel > 0 || inList);
    setActive($toolbar, 'outdent', indentLevel > 0 || inList);
    setActive($toolbar, 'orderedList', editor.isActive('orderedList'));
    setActive($toolbar, 'bulletList', editor.isActive('bulletList'));

    setDisabled($toolbar, 'bold', !editor.can().chain().toggleBold().run());
    setDisabled($toolbar, 'italic', !editor.can().chain().toggleItalic().run());
    setDisabled($toolbar, 'underline', !editor.can().chain().toggleUnderline().run());
    setDisabled($toolbar, 'strike', !editor.can().chain().toggleStrike().run());
    setDisabled($toolbar, 'subscript', !editor.can().chain().toggleSubscript().run());
    setDisabled($toolbar, 'superscript', !editor.can().chain().toggleSuperscript().run());
    setDisabled($toolbar, 'alignLeft', !editor.can().chain().setTextAlign('left').run());
    setDisabled($toolbar, 'alignCenter', !editor.can().chain().setTextAlign('center').run());
    setDisabled($toolbar, 'alignRight', !editor.can().chain().setTextAlign('right'));
    setDisabled($toolbar, 'alignJustify', !editor.can().chain().setTextAlign('justify'));
    setDisabled($toolbar, 'indent', inList ? !editor.can().chain().sinkListItem('listItem').run() : !editor.can().chain().indent().run());
    setDisabled($toolbar, 'outdent', inList ? !editor.can().chain().liftListItem('listItem').run() : !editor.can().chain().outdent().run());
    setDisabled($toolbar, 'orderedList', !editor.can().chain().toggleOrderedList().run());
    setDisabled($toolbar, 'bulletList', !editor.can().chain().toggleBulletList().run());
};

/**
 * Set tool on toolbar active.
 * 
 * @param {jQuery} $root - The root jQuery element.
 * @param {string} tool - The tool on the toolbar.
 * @param {boolean} active - `true` if active, `false` if inactive. 
 */
const setActive = ($root, tool, active) => {
    const $btn = $root.find(`[data-tool="${tool}"]`);
    $btn.toggleClass('is-active', !!active);
    $btn.find('i').toggleClass('is-active', !!active);
};

/**
 * Set tool on toolbar disabled.
 * 
 * @param {jQuery} $root - The root jQuery element.
 * @param {string} tool - The tool on the toolbar.
 * @param {boolean} disabled - `true` if disabled, `false` if not.
 */
const setDisabled = ($root, tool, disabled) => {
    const $btn = $root.find(`[data-tool="${tool}"]`);
    $btn.toggleClass('is-disabled', !!disabled);

    $btn.attr('aria-disabled', disabled ? 'true' : 'false');
    $btn.attr('tabindex', disabled ? '-1' : '0');
};

/**
 * Apply a tool.
 * 
 * @param {Editor} editor - The editor. 
 * @param {string} tool - The tool on the toolbar. 
 * @param {jQuery} $btn - The jQuery button element. 
 */
const applyTool = (editor, tool, $btn = null) => {
    const locale = UNB.config.payload.locale;

    switch (tool) {
        case 'bold':
            editor.chain().focus().toggleBold().run();
            break;

        case 'italic':
            editor.chain().focus().toggleItalic().run();
            break;

        case 'underline':
            editor.chain().focus().toggleUnderline().run();
            break;

        case 'undo':
            editor.chain().focus().undo().run();
            break;

        case 'redo':
            editor.chain().focus().redo().run();
            break;

        case 'strike':
            editor.chain().focus().toggleStrike().run();
            break;

        case 'subscript':
            editor.chain().focus().toggleSubscript().run();
            break;

        case 'superscript':
            editor.chain().focus().toggleSuperscript().run();
            break;

        case 'font': {
            const font = ($btn?.data('unb-editor-font') || '').trim();
            if (!font) return;

            const $fontDisplay = $('[data-unb-editor-font-display]');

            if (font === 'default') {
                editor.chain().focus().unsetFontFamily().run();
                $fontDisplay.text(locale.common.default);
            } else {
                editor.chain().focus().setFontFamily(font).run();
                $fontDisplay.text(font);
            }
            break;
        }

        case 'color': {
            const color = ($btn?.data('unb-editor-font-color') || '').trim();
            if (!color) return;

            const label = $btn?.data('unb-editor-font-color-label') || null;

            const $colorDisplay = $('[data-unb-editor-font-color-display]');

            if (color === 'default') {
                editor.chain().focus().unsetColor().run();
                $colorDisplay.text(locale.common.default);
            } else {
                editor.chain().focus().setColor(color).run();
                $colorDisplay.text(label);
            }
        }

        case 'size': {
            const sizeAttr = $btn.attr('data-unb-editor-font-size');
            if (sizeAttr === undefined) return;

            const $sizeDisplay = $('[data-unb-editor-font-size-display]');

            if (sizeAttr === 'default') {
                editor.chain().focus().unsetFontSize().run();
                $sizeDisplay.text(locale.common.default);
            } else {
                editor.chain().focus().setFontSize(parseInt(sizeAttr, 10)).run();
                $sizeDisplay.text(sizeAttr);
            }

            break;
        }

        case 'alignLeft':
            editor.chain().focus().setTextAlign('left').run();
            break;

        case 'alignCenter':
            editor.chain().focus().setTextAlign('center').run();
            break;

        case 'alignRight':
            editor.chain().focus().setTextAlign('right').run();
            break;

        case 'alignJustify':
            editor.chain().focus().setTextAlign('justify').run();
            break;

        case 'indent':
            if (editor.isActive('bulletList') || editor.isActive('orderedList')) {
                editor.chain().focus().sinkListItem('listItem').run();
            } else {
                editor.chain().focus().indent().run();
            }

            break;

        case 'outdent':
            if (editor.isActive('bulletList') || editor.isActive('orderedList')) {
                editor.chain().focus().liftListItem('listItem').run();
            } else {
                editor.chain().focus().outdent().run();
            }

            break;

        case 'bulletList':
            editor.chain().focus().toggleBulletList().run();
            break;

        case 'orderedList':
            editor.chain().focus().toggleOrderedList().run();
            break;

        case 'horizontalRule':
            UNB.dropdown?.close?.();

            editor
                .chain()
                .focus()
                .setHorizontalRule()
                .insertContent('<p></p>')
                .run();

            break;
    }
};