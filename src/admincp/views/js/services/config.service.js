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
UNB_ADMINCP.on('ui.init', async () => {
    UNB_ADMINCP.config = UNB_ADMINCP.config || {};
    UNB_ADMINCP.config.payload = UNB_ADMINCP.config.payload || {};
    UNB_ADMINCP.config.loaded = UNB_ADMINCP.config.loaded || false;

    /**
     * Loads the UNB configurations from the backend API service.
     */
    UNB_ADMINCP.config.load = () => {
        if (UNB_ADMINCP.config.loaded) {
            UNB_ADMINCP.log.info('Configurations already loaded.', 'ConfigService');
            return;
        }

        UNB_ADMINCP.log.info('Loading configurations from backend...', 'ConfigService');

        return UNB_ADMINCP.ajax.get('ui', {
            query: { mode: 'config' },

            onError(error) {
                UNB_ADMINCP.log.error(`UI configuration load failed: ${error}.`, 'ConfigService');
            }
        })
        .then(response => {
            UNB_ADMINCP.config.payload = response?.payload?.payload || response;

            UNB_ADMINCP.fire?.('ui.config.loaded', UNB_ADMINCP.config.payload);

            UNB_ADMINCP.config.loaded = true;

            UNB_ADMINCP.log.info('UI configurations loaded.', 'ConfigService');

            return UNB_ADMINCP.config.payload;
        });
    };

    UNB_ADMINCP.config.load().then(config => {
        UNB_ADMINCP.locale = UNB_ADMINCP.locale || config.locale;
    });
});