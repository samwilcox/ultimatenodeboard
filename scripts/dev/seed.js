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

const processSeeds = require('./seeds');
const MongoClient = require('mongodb').MongoClient;

/**
 * UNB Development: seed
 * Seeding development data into the MongoDB container.
 */
const seed = async () => {
    const uri = process.env.UNB_MONGODB_URI;
    const client = await MongoClient.connect(uri);
    const db = client.db();

    console.log('Seeding dev data...');

    await processSeeds(db);

    console.log('Seed complete.');

    client.close();
};

seed();