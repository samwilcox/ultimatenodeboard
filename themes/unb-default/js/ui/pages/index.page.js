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
 * UNB index page.
 */
UNB.on('ui.init', () => {
    // Sorting
    const $latest = $('[data-unb-sort-topic-latest]');
    const $top = $('[data-unb-sort-topic-top]');
    const $newest = $('[data-unb-sort-topic-newest]');
    const $oldest = $('[data-unb-sort-topic-oldest]');
    const $likes = $('[data-unb-sort-topic-likes]');

    // Filters
    const $all = $('[data-unb-filter-topic-all]');
    const $unread = $('[data-unb-filter-topic-unread]');
    const $read = $('[data-unb-filter-topic-read]');
    const $answered = $('[data-unb-filter-topic-answered]');
    const $unanswered = $('[data-unb-filter-topic-unanswered]');
    const $hot = $('[data-unb-filter-topic-hot]');
    const $pinned = $('[data-unb-filter-topic-pinned]');
    const $unpinned = $('[data-unb-filter-topic-unpinned]');
    const $locked = $('[data-unb-filter-topic-locked]');
    const $unlocked = $('[data-unb-filter-topic-unlocked]');

    /**
     * Helper that handles when a sort option is clicked.
     * 
     * @param {
     *      "latest"|
     *      "top"|
     *      "newest"|
     *      "oldest"|
     *      "likes"|
     *      "asnwered"
     * } sort - The sort option selected. 
     */
    const onSortSelect = (sort) => {
        if (!sort || typeof sort !== 'string') return;

        const locale = UNB.config.payload.locale.index;

        const sorts = {
            latest: $latest,
            top: $top,
            newest: $newest,
            oldest: $oldest,
            likes: $likes,
        };

        const sortsLocaleMap = {
            latest: locale.sortLatest,
            top: locale.sortTop,
            newest: locale.sortNewest,
            oldest: locale.sortOldest,
            likes: locale.sortLikes,
        };

        if (!(sort in sorts)) return;

        sorts[sort]
            .removeClass('fa-regular fa-circle')
            .addClass('fa-solid fa-circle');

        for (const [key, value] of Object.entries(sorts)) {
            if (key !== sort) {
                value
                    .removeClass('fa-solid fa-circle')
                    .addClass('fa-regular fa-circle');
            }
        }

        const $button = $('[data-unb-sort-button]');
        const $select = $button.find('[data-role="select"]');

        $select.text(sortsLocaleMap[sort]);

        fetchTopics(null, sort, UNB.data.page ?? 0);
    };

    /**
     * Filter topics on filter select. 
     * 
     * @param {
     *      "all" |
     *      "unread" |
     *      "read" |
     *      "answered" |
     *      "unanswered" |
     *      "hot" |
     *      "pinned" |
     *      "unpinned" |
     *      "locked" |
     *      "unlocked"
     * } filter - The filter selected.
     */
    const onFilterSelect = (filter) => {
        if (!filter || typeof filter !== 'string') return;

        const locale = UNB.config.payload.locale.index;

        const filters = {
            all: $all,
            unread: $unread,
            read: $read,
            answered: $answered,
            unanswered: $unanswered,
            hot: $hot,
            pinned: $pinned,
            unpinned: $unpinned,
            locked: $locked,
            unlocked: $unlocked
        };

        const filtersLocaleMap = {
            all: locale.filterAll,
            unread: locale.filterUnread,
            read: locale.filterRead,
            answered: locale.filterAnswered,
            unanswered: locale.filterUnanswered,
            hot: locale.filterHot,
            pinned: locale.filterPinned,
            unpinned: locale.filterUnpinned,
            locked: locale.filterLocked,
            unlocked: locale.filterUnlocked
        };

        if (!(filter in filters)) return;

        filters[filter]
            .removeClass('fa-regular fa-circle')
            .addClass('fa-solid fa-circle');

        for (const [key, value] of Object.entries(filters)) {
            if (key !== filter) {
                value
                    .removeClass('fa-solid fa-circle')
                    .addClass('fa-regular fa-circle');
            }
        }

        const $button = $('[data-unb-filter-button]');
        const $select = $button.find('[data-role="select"]');

        $select.text(filtersLocaleMap[filter]);

        fetchTopics(filter, null, UNB.data.page ?? 0);
    };

    /**
     * Fetch topics from the UNB backend API service.
     * 
     * @param {string} [filter=null] - The filter.
     * @param {string} [sort=null] - The sort option.
     * @param {number} [page=0] - The page number. 
     */
    const fetchTopics = (filter = null, sort = null, page = 0) => {
        const $container = $('[data-unb-content-container]');
        UNB.helpers.loader.show($container);

        UNB.ajax.get('fetch/topics', {
            query: {
                filter,
                sort,
                page,
                forum: null
            },

            onError(error) {
                UNB.log.error(`fetchTopics failed: ${error}.`, 'fetchTopics');
            }
        })
        .then(response => {
            const payload = response.payload;
            $container.html(payload.topics);

            if (payload.hasMore) {
                UNB.helpers.loadMore.toggle(true);
            } else {
                UNB.helpers.loadMore.toggle(false);
            }

            UNB.data.page = UNB.data.page || 0;
            UNB.data.page = parseInt(payload.page);
        });
    };

    /**
     * Handle when the user clicks on a sort item.
     */
    $(document).on('click', '[data-unb-sort-item]', function (e) {
        e.preventDefault();

        const $item = $(this);
        const sort = $item.data('unb-sort');

        if (!sort || typeof sort !== 'string') return;

        onSortSelect(sort);
    });

    /**
     * Handle when the user click on a filter item.
     */
    $(document).on('click', '[data-unb-filter-item]', function (e) {
        e.preventDefault();

        const $item = $(this);
        const filter = $item.data('unb-filter');

        if (!filter || typeof filter !== 'string') return;

        onFilterSelect(filter);
    });

    /**
     * Load the topics on page load.
     */
    jQuery(() => {
        fetchTopics();
    });

    /**
     * Handle when the user clicks on the topic item div.
     */
    $(document).on('click', '[data-unb-topic-item]', function (e) {
        e.preventDefault();

        const $div = $(this);
        const url = $div.data('unb-url');

        if (url) {
            UNB.helpers.url.redirect(url);
        }
    });
});