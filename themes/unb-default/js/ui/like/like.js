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
 * UNB like handler.
 */
UNB.on('ui.init', () => {
    /**
     * Handle when the user clicks on the like button.
     */
    $(document).on('click', '[data-unb-like-button]', function (e) {
        e.preventDefault();

        const $button = $(this);

        if ($button.is('[data-unb-like-guest="true"]')) {
            const $modal = $('#unb-modal-signin');
            UNB.modal.open?.($modal);
            return;
        }

        const contentType = $button.data('unb-like-content-type');
        const contentKey = $button.data('unb-like-content-key');
        const action = $button.data('unb-like-button-action');

        if (!contentType || !contentKey || !action) return;

        UNB.ajax.post('like', {
            contentType,
            contentKey,
            action
        }).then(data => {
            const likeData = data?.payload;
            console.log(data);

            if (likeData?.button) {
                const $wrapper = $(`[data-unb-like-button-wrapper][data-unb-like-content-type="${contentType}"][data-unb-like-content-key="${contentKey}"]`);

                if ($wrapper.length) {
                    $wrapper.empty();
                    $wrapper.html(likeData.button);
                }
            }
        });
    });

    /**
     * Handle when the user clicks on the like badge.
     */
    $(document).on('click', '[data-unb-like-badge]', function (e) {
        e.preventDefault();

        const $badge = $(this);
        const $modal = $('#unb-modal-likes-list');

        const contentType = $badge.data('unb-like-content-type');
        const contentKey = $badge.data('unb-like-content-type');

        if (!contentType || !contentKey) return;

        UNB.ajax.get('like/list', {
            query: {
                contentType,
                contentKey
            }
        }).then(data => {
            if (data.ok) {
                const list = data?.payload?.list;

                if (list) {
                    const $content = $modal.find('[data-unb-like-content]');
                    $content.empty();
                    $content.html(list);
                    UNB.modal?.open?.($modal);
                }
            }
        });
    });
});