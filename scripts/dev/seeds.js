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

const fs = require('fs').promises;
const path = require('path');

/**
 * Process all seeds for development purposes.
 * 
 * @param {MongoDBClient} db - The MongoDB client instance. 
 */
const processSeeds = async (db) => {
    const collections = {
        forums: db.collections('forums'),
        likes: db.collections('likes'),
        locales: db.collections('locales'),
        memberDevices: db.collections('member_devices'),
        memberPhotos: db.collections('member_photos'),
        members: db.collections('members'),
        permissionDefinitions: db.collections('permission_definitions'),
        permissionRules: db.collections('permission_rules'),
        posts: db.collections('posts'),
        sessions: db.collections('sessions'),
        settings: db.collections('settings'),
        tags: db.collections('tags'),
        themes: db.collections('themes'),
        topics: db.collections('topics'),
        userGroups: db.collections('user_groups')
    };

    for (const [name, collection] of Object.entries(collections)) {
        const nameLowered = name.toLowerCase();

        console.log(`Processing seed: ${name}...`);

        const filePath = path.join('seeds', `${nameLowered}.json`);

        try {
            const fileData = await fs.readFile(filePath, { encoding: 'utf8' });
            const json = JSON.parse(fileData);

            if (!json || !Array.isArray(json)) {
                console.error(`Data is missing for seed: ${name}.`);
                process.exit(1);
            }

            for (const seed of json) {
                await collection.insertOne(seed);
            }
        } catch (error) {
            console.error(`Failed to process seed: ${name}:`, error);
            process.exit(1);
        }

        console.log(`Seed ${name} planted.`);
    }
};

module.exports = processSeeds;