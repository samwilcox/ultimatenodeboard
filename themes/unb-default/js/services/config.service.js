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
 * UNB configurations service.
 */
UNB.on('ui.init', async () => {
    UNB.config = UNB.config || {};
    UNB.config.payload = UNB.config.payload || {};
    UNB.config.loaded = UNB.config.loaded || false;

    /**
     * Loads the UNB configurations from the backend API service.
     */
    UNB.config.load = () => {
        if (UNB.config.loaded) {
            UNB.log.info('Configurations already loaded.', 'ConfigService');
            return;
        }

        UNB.log.info('Loading configurations from backend...', 'ConfigService');

        return UNB.ajax.get('ui', {
            query: { mode: 'config' },

            onError(error) {
                UNB.log.error(`UI configuration load failed: ${error}.`, 'ConfigService');
            }
        })
        .then(response => {
            UNB.config.payload = response?.payload?.payload || response;

            UNB.fire?.('ui.config.loaded', UNB.config.payload);

            UNB.config.loaded = true;

            UNB.log.info('UI configurations loaded.', 'ConfigService');

            return UNB.config.payload;
        });
    };

    UNB.config.load().then(config => {
        UNB.locale = UNB.locale || config.locale;
    });
});