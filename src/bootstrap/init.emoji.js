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

const createEmojiService = require('../emoji');
const Logger = require('../log/logger');

/**
 * Initialize the UNB emoji service.
 * 
 * @returns {EmojiService} The `EmojiService` instance.
 */
const initEmoji = async () => {
    try {
        Logger.info('Initialization', 'Initializing the UNB emoji service...');

        const emojiService = createEmojiService();
        await emojiService.load();

        Logger.info('Initialization', 'UNB emoji service initialized.');

        return emojiService;
    } catch (error) {
        Logger.error('Bootstrap.initEmoji', `Bootstrap.initEmoji failed: ${error}.`, { error });
        throw error;
    }
};

module.exports = initEmoji;