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

const http = require('http');
const Logger = require('./log/logger');
const createApp = require('./app');

createApp()
    .then(app => {
        const port = Number(process.env.UNB_SERVER_PORT) || 3000;
        const server = http.createServer(app);

        server.listen(port, () => {
            Logger.info('Initialization', `UNB is now listening at ${process.env.UNB_BASE_URL}.`);
        });

        const shutdown = () => {
            Logger.warn('shutdown', 'Shutting down UNB server...');

            server.close(() => {
                Logger.info('shutdown', 'HTTP server closed. Bye!');
                process.exit(0);
            });
        };

        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);
    })
    .catch (error => {
        console.log(error);
        Logger.error('fatal', `Fatal UNB initialization error: ${error}.`, { error });
        process.exit(1);
    });