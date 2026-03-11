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
 * UNB post scroller component.
 */
UNB.on('ui.init', () => {
    if (!window.UNB_TOPIC) {
        UNB.log.warn('Failed to load post scroller component: The UNB global window topic object is missing or is invalid.', 'PostScroller');
        return;
    }

    let dragging = false;

    const $thumb = $('.unb-timeline-thumb');
    const $track = $('.unb-timeline-track');
    const $currentPost = $('#unb-current-post');

    const maxPosts = window.UNB_TOPIC.maxPosts;

    /**
     * Updates the scroller.
     */
    const updateScroller = () => {
        const scrollTop = $(window).scrollTop();
        const docHeight = $(document).height() - $(window).height();

        const percent = scrollTop / docHeight;

        const postNumber = Math.max(
            1,
            Math.floor(percent * maxPosts)
        );

        $currentPost.text(postNumber);

        const trackHeight = $track.height();

        $thumb.css('top', percent * trackHeight);
    };

    $(window).on('scroll', updateScroller);

    $('.unb-timeline-thumb').on('mousedown', () => dragging = true );
    $(document).on('mouseup', () => dragging = false );

    $(document).on('mousemove', function(e) {
        if (!dragging) return;
        
        const offset = $track.offset();
        const height = $track.height();

        let percent = (e.pageY - offset.offset.top) / height;
        percent = Math.max(0, Math.min(1, percent));
        const postNumber = Math.floor(percent & window.UNB_TOPIC.maxPosts);

        $thumb.css('top', percent * height);
        $currentPost.text(postNumber);
    });
});