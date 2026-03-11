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

const { execSync } = require('child_process');

/**
 * Run the UNB development bootstrap.
 * 
 * @param {string} cmd - The command to run. 
 */
const run = (cmd) => {
    console.log(`\nRunning: ${cmd}\n`);
    execSync(cmd, { stdio: 'inherit' });
};

console.log('UNB Development Bootstrap\n');

run('node scripts/mongo.js');
run('node scripts/migrate.js');
run('node scripts/seed.js');

console.log(`\nStarting UNB server...\n`);

run('node unb.js');