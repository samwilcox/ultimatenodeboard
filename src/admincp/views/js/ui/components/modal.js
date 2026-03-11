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
 * UNB modal component.
 */
UNB_ADMINCP.on('ui.init', () => {
    let activeModal = null;
    const $overlay = $('#unb-background-disabler');

    /**
     * Open a modal component.
     * 
     * @param {jQuery} $modal - The modal to open. 
     */
    const openModal = ($modal) => {
        if (!$modal || !$modal.length) return;

        if (UNB_ADMINCP.dropdown?.close) {
            UNB_ADMINCP.dropdown.close();
        }

        if (activeModal && activeModal[0] !== $modal[0]) {
            closeModal(activeModal);
        }

        let modalWidth = 500;
        
        if ($modal.data('unb-width')) {
            modalWidth = parseInt($modal.data('unb-width'), 10);
        }

        $modal.css({
            width: `${modalWidth}px`
        });

        activeModal = $modal;

        $overlay.css('display', 'block');
        $modal.css('display', 'block');

        requestAnimationFrame(() => {
            $overlay.addClass('active')
            $modal
                .addClass('active')
                .attr('aria-hidden', 'false');
            $('body').addClass('modal-open');
        });
    };

    /**
     * Close a modal component.
     * 
     * @param {jQuery} $modal - The modal to close.
     */
    const closeModal = ($modal) => {
        if (!$modal || !$modal.length) return;

        $modal.removeClass('active').attr('aria-hidden', 'true');
        $overlay.removeClass('active');
        $('body').removeClass('modal-open');

        setTimeout(() => {
            $modal.css('display', 'none');
            $overlay.css('display', 'none');
        }, 250);

        activeModal = null;
    };

    UNB_ADMINCP.modal = UNB_ADMINCP.modal || {};
    UNB_ADMINCP.modal.open = openModal;
    UNB_ADMINCP.modal.close = closeModal;
    UNB_ADMINCP.modal.closeAll = () => activeModal && closeModal(activeModal);

    /**
     * Handle when a user clicks on the modal close.
     */
    $(document).on('click', '[data-unb-modal-close]', function (e) {
        e.preventDefault();

        if (activeModal) {
            closeModal(activeModal);
        }
    });

    /**
     * Handle when a user clicks on a modal open request.
     */
    $(document).on('click', '[data-unb-modal-open]', function (e) {
        e.preventDefault();

        const modalId = $(this).data('unb-modal-open');

        if (!modalId) {
            return;
        }

        const $modal = $(`#${modalId}`);

        openModal($modal);
    });

    /**
     * Handle when a user clicks on the overlay.
     */
    $overlay.on('click', function () {
        if (activeModal) {
            closeModal(activeModal);
        }
    });

    /**
     * Handle when a user presses the escape key.
     */
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape' && activeModal) {
            closeModal(activeModal);
        } 
    });
});