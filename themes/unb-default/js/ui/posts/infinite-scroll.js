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
 * UNB posts infinite scrolling service.
 */
UNB.on('ui.init', () => {
    UNB.posts = UNB.posts || {};
    UNB.posts.infiniteScroll = UNB.posts.infiniteScroll || {};
    
    UNB.posts.infiniteScroll.postWindowState = UNB.posts.infiniteScroll.postWindowState || {
        topicKey: null,
        maxPostNumber: 0,
        lowestLoaded: null,
        highestLoaded: null,
        loadingAbove: false,
        loadingBelow: false,
        hasMoreAbove: true,
        hasMoreBelow: true,
        limit: 50
    };

    let $container;

    /**
     * Initialize the posts infinite scroll.
     * 
     * @param {string} topicKey - The topic key for the topic.
     * @param {jQuery} containerSelector - The container selector. 
     */
    UNB.posts.infiniteScroll.init = (topicKey, containerSelector) => {
        const state = UNB.posts.infiniteScroll.postWindowState;

        state.topicKey = topicKey;
        $container = $(containerSelector);

        if (!$container.length) {
            UNB.log.warn('Infinite scroll container not found.', 'Posts.InfiniteScroll');
            return;
        }

        const hash = window.location.hash;
        let centerFromHash = null;

        if (hash && hash.startsWith('#post-')) {
            centerFromHash = parseInt(hash.replace('#post-', ''), 10);
        }

        UNB.posts.infiniteScroll.loadInitial(topicKey, centerFromHash);
        UNB.posts.infiniteScroll.bindScroll();
    };

    /**
     * Loaded the initial posts for the topic.
     * 
     * @param {string} topicKey - The topic key.
     * @param {number} [centerOverride=null] - The center from hash.
     */
    UNB.posts.infiniteScroll.loadInitial = (topicKey, centerOverride = null) => {
        const state = UNB.posts.infiniteScroll.postWindowState;
        const memory = UNB.posts.infiniteScroll.restoreScrollMemory();
        const mode = memory ? 'around' : 'around';
        const center = centerOverride || memory?.postNumber || null;

        UNB.ajax.get(`topics/${topicKey}/posts`, {
            query: {
                mode,
                center,
                limit: state.limit
            }
        }).then(data => {
            const payload = data.payload.result;
            state.maxPostNumber = payload.meta.maxPostNumber;
            UNB.posts.infiniteScroll.renderPosts(payload.posts);

            if (payload.posts.length) {
                state.lowestLoaded = payload.posts[0].postNumber;
                state.highestLoaded = payload.posts[payload.posts.length - 1].postNumber;
            }

            state.hasMoreAbove = payload.meta.hasMoreAbove;
            state.hasMoreBelow = payload.meta.hasMoreBelow;

            if (memory) {
                setTimeout(() => {
                    const $target = $container.find(`[data-unb-post-number="${memory.postNumber}"]`);

                    if ($target.length) {
                        const top = $target.position().top;

                        $container.scrollTop($container.scrollTop() + top + memory.offset);
                    }
                }, 0);
            }

            if (center) {
                setTimeout(() => {
                    const $target = $container.find(`[data-unb-post-number="${center}"]`);

                    if ($target.length) {
                        const containerHeight = $container.innerHeight();
                        const targetTop = $target.position().top;

                        $container.scrollTop($container.scrollTop() + targetTop - containerHeight / 2);
                    }
                }, 0);
            }
        });
    };

    /**
     * Load posts below the post number.
     */
    UNB.posts.infiniteScroll.loadBelow = () => {
        const state = UNB.posts.infiniteScroll.postWindowState;
        state.loadingBelow = true;

        UNB.ajax.get(`topics/${state.topicKey}/posts`, {
            query: {
                mode: 'after',
                center: state.highestLoaded,
                limit: state.limit
            }
        }).then(data => {
            UNB.posts.infiniteScroll.appendPostsBottom(data.posts);

            if (data.posts.length) {
                state.highestLoaded = data.posts[data.posts.length - 1].postNumber;
            }

            state.hasMoreBelow = data.meta.hasMoreBelow;
            state.loadingBelow = false;
        });
    };

    /**
     * Load posts above the post number.
     */
    UNB.posts.infiniteScroll.loadAbove = () => {
        const state = UNB.posts.infiniteScroll.postWindowState;
        state.loadingAbove = true;
        
        const previousHeight = $container[0].scrollHeight;

        UNB.ajax.get(`topics/${state.topicKey}/posts`, {
            query: {
                mode: 'before',
                center: state.lowestLoaded,
                limit: state.limit
            }
        }).then(data => {
            UNB.posts.infiniteScroll.prependPostsTop(data.posts);

            const newHeight = $container[0].scrollHeight;
            const diff = newHeight - previousHeight;

            $container.scrollTop($container.scrollTop() + diff);

            if (data.posts.length) {
                state.lowestLoaded = data.posts[0].postNumber;
            }

            state.hasMoreAbove = data.meta.hasMoreAbove;
            state.loadingAbove = false;
        });
    };

    /**
     * Handle the scrolling for infinite scroll.
     */
    UNB.posts.infiniteScroll.handleScroll = () => {
        const state = UNB.posts.infiniteScroll.postWindowState;
        const scrollTop = $container.scrollTop();
        const containerHeight = $container.innerHeight();
        const scrollHeight = $container[0].scrollHeight;
        const nearBottom = scrollTop + containerHeight >= scrollHeight - 300;
        const nearTop = scrollTop <= 300;
        
        if (nearBottom && state.hasMoreBelow && !state.loadingBelow) {
            UNB.posts.infiniteScroll.loadBelow();
        }

        if (nearTop && state.hasMoreAbove && !state.loadingAbove) {
            UNB.posts.infiniteScroll.loadAbove();
        }

        UNB.posts.infiniteScroll.syncUrlWithScroll();
    };

    /**
     * Bind the scroller.
     */
    UNB.posts.infiniteScroll.bindScroll = () => {
        $container.on('scroll', UNB.posts.infiniteScroll.debounce(UNB.posts.infiniteScroll.handleScroll, 100));
    };

    /**
     * Jump to the post.
     * 
     * @param {number} ratio - The ratio to jump to.
     */
    UNB.posts.infiniteScroll.jumpToRatio = (ratio) => {
        const state = UNB.posts.infiniteScroll.postWindowState;
        const target = Math.floor(state.maxPostNumber * ratio);

        UNB.ajax.get(`topics/${state.topicKey}/posts`, {
            query: {
                mode: 'around',
                center: target,
                limit: state.limit
            }
        }).then(data => {
            UNB.posts.infiniteScroll.clearPosts();
            UNB.posts.infiniteScroll.renderPosts(data.posts);

            state.lowestLoaded = data.posts[0]?.postNumber;
            state.highestLoaded = data.posts[data.posts.length - 1]?.postNumber;

            state.hasMoreAbove = data.meta.hasMoreAbove;
            state.hasMoreBelow = data.meta.hasMoreBelow;

            $container.scrollTop($container.innerHeight() / 2);
        });
    };

    /**
     * Render the posts.
     * 
     * @param {string[]} posts - Collection of posts.
     */
    UNB.posts.infiniteScroll.renderPosts = (posts) => {
        $container.empty();
        UNB.posts.infiniteScroll.appendPostsBottom(posts);
    };

    /**
     * Append the posts to bottom.
     * 
     * @param {string[]} posts - Collection of posts.
     */
    UNB.posts.infiniteScroll.appendPostsBottom = (posts) => {
        posts.forEach(post => {
            $container.append(post);
        });
    };

    /**
     * Append the posts to the top.
     * 
     * @param {string[]} posts - Collection of posts.
     */
    UNB.posts.infiniteScroll.appendPostsTop = (posts) => {
        posts.forEach(post => {
            $container.prepend(post);
        });
    };

    /**
     * Clear the posts container.
     */
    UNB.posts.infiniteScroll.clearPosts = () => {
        $container.empty();
    };

    /**
     * Debouce the posts.
     * 
     * @param {Function} fn - The callback function. 
     * @param {number} delay - The total delay period in MS (milliseconds). 
     */
    UNB.posts.infiniteScroll.debounce = (fn, delay) => {
        let timer;

        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(timer);

            timer = setTimeout(() => {
                fn.apply(context, args);
            }, delay);
        };
    };

    /**
     * Save scroll memory.
     */
    UNB.posts.infiniteScroll.saveScrollMemory = () => {
        if (!$container) return;

        const state = UNB.posts.infiniteScroll.postWindowState;

        const $firstVisible = $container.find('.unb-post').filter(function () {
            const top = $(this).position().top;
            return top >= 0;
        }).first();

        if (!$firstVisible.length) return;

        const postNumber = $firstVisible.data('unb-post-number');
        const offset = $firstVisible.position().top;

        UNB.services.storage.set(
            UNB.services.storage.keys.topicScroll.replace('{topicKey}', state.topicKey),
            JSON.stringify({ postNumber, offset })
        );
    };

    /**
     * Restore the scroll memory.
     */
    UNB.posts.infiniteScroll.restoreScrollMemory = () => {
        const state = UNB.posts.infiniteScroll.postWindowState;
        const raw = UNB.services.storage.get(UNB.services.storage.keys.topicScroll.replace('{topicKey}', state.topicKey));

        if (!raw) return false;

        try {
            const data = JSON.parse(raw);

            if (!data.postNumber) return false;

            return data;
        } catch {
            return false;
        }
    };

    /**
     * Save scroll memory when leaving the page.
     */
    $(window).on('beforeunload', () => {
        UNB.posts.infiniteScroll.saveScrollMemory();
    });

    /**
     * Syncs the URL in the browser during scrolling.
     */
    UNB.posts.infiniteScroll.syncUrlWithScroll = () => {
        if (!$container) return;

        const $visible = $container.find('.unb-post').filter(function () {
            return $(this).position().top >= 0;
        }).first();

        if (!$visible.lenght) return;

        const postNumber = $visible.data('unb-post-number');
        if (!postNumber) return;

        const newHash = `#post-${postNumber}`;

        if (window.location.hash !== newHash) {
            history.replaceState(null, '', newHash);
        }
    };

    /**
     * Jump to a given post.
     * 
     * @param {number} postNumber - The post number.
     */
    UNB.posts.infiniteScroll.jumpToPost = (postNumber) => {
        const state = UNB.posts.infiniteScroll.postWindowState;

        UNB.ajax.get(`topics/${state.topicKey}/posts`, {
            query: {
                mode: 'around',
                center: postNumber,
                limit: state.limit
            }
        }).then(data => {
            UNB.posts.infiniteScroll.clearPosts();
            UNB.posts.infiniteScroll.renderPosts(data.posts);

            state.lowestLoaded = data.posts[0]?.postNumber;
            state.highestLoaded = data.posts[data.posts.length - 1]?.postNumber;
            state.hasMoreAbove = data.meta.hasMoreAbove;
            state.hasMoreBelow = data.meta.hasMoreBelow;

            setTimeout(() => {
                const $target = $container.find(`[data-unb-post-number="${postNumber}"]`);

                if ($target.length) {
                    const containerHeight = $container.innerHeight();
                    const targetTop = $target.position().top;

                    $container.scrollTop($container.scrollTop() + targetTop - containerHeight / 2);
                }
            }, 0);
        });
    };

    window.addEventListener('popstate', () => {
        const hash = window.location.hash;

        if (hash.startsWith('#post-')) {
            const postNumber = parseInt(hash.replace('#post-', ''), 10);

            UNB.posts.infiniteScroll.jumpToPost(postNumber);
        }
    });
});