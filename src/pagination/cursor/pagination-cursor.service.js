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
 * UNB pagination cursor service
 * 
 * Service for cursor implementation for the infinite scroll feature.
 */
class PaginationCursorService {
    static #lastTime = 0;
    static #sequence = 0;

    /**
     * Generates a new cursor (BigInt).
     * 48 bits timestamp (ms), 16 bits sequence.
     */
    static generateCursor() {
        const now = Date.now();

        if (now === this.#lastTime) {
            this.#sequence++;

            if (this.#sequence > 0xffff) {
                while (Date.now() === this.#lastTime) {}
                return this.generateCursor();
            }
        } else {
            this.#lastTime = now;
            this.#sequence = 0;
        }

        return (BigInt(now) << 16n) | BigInt(this.#sequence);
    }

    /**
     * Encode a cursor.
     * 
     * @param {bigint|null} cursor - The cursor.
     * @returns {string|null} The encoded cursor. 
     */
    static encode(cursor) {
        return cursor == null ? null : cursor.toString();
    }

    /**
     * Decode a cursor.
     * 
     * @param {string|null|undefined} cursor - The cursor.
     * @returns {bigint|null} The decoded bigint or `null` if cannot decode.
     */
    static decode(cursor) {
        if (!cursor) return null;
        return BigInt(cursor);
    }
};

module.exports = PaginationCursorService;