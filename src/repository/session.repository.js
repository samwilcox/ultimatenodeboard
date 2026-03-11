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

const DataStore = require('../datastore/datastore');

/**
 * UNB session repository.
 * 
 * Responsible for creating the `Session` entity.
 */
class SessionRespository {
    /**
     * Get a like by key name.
     * 
     * @param {string} key - The session key name.
     * @returns {Promise<Session>} A promise that resolves to the Session entity instance.
     */
    static async getByKey(key) {
        const data = await this.getDataByKey(key);
        return await this.build(key, data);
    }

    /**
     * Get data by key name.
     * 
     * @param {string} key - The session key name.
     * @returns {Promise<object>|null} A promise that resolves to the data for this entity or `null` if not found.
     */
    static async getDataByKey(key) {
        const { db } = DataStore.get('unb');
        const data = await db.repo.sessions.getByKey(key);
        return data || null;
    }

    /**
     * Build the entity.
     * 
     * @param {string} key - The session key name.
     * @param {object|null} data - The data for the session or `null` if not found. 
     * @returns {Promise<Session>} A promise that resolves to the session entity instance.
     */
    static async build(key, data) {
        const Session = require('../session/session.entity');
        let session = new Session();

        session.key = (data && data.key ? data.key : null) ?? key ?? null;

        return session;
    }
}

module.exports = SessionRespository;