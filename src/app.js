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

const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const ejsLayouts = require('express-ejs-layouts');
const session = require('express-session');
const Logger = require('./log/logger');
const DataStore = require('./datastore/datastore');
const memberMiddleware = require('./middleware/member.middleware');
const localeMiddleware = require('./middleware/locale.middleware');
const viewEngineMiddleware = require('./middleware/view-engine.middleware');
const viewGlobalsMiddleware = require('./middleware/view-globals.middleware');
const themeMiddleware = require('./middleware/theme.middleware');
const csrfMiddleware = require('./middleware/csrf.middleware');
const sessionMiddleware = require('./middleware/session.middleware');
const sessionInitMiddleware = require('./middleware/session-init.middleware');
const onlineTrackerMiddleware = require('./middleware/online-tracker.middleware');

const {
    initDatabase,
    initSettings,
    initCache,
    initLocale,
    initRoutes,
    initMembers,
    initForums,
    initGroups,
    initEmoji,
    initTags,
    initOnline
} = require('./bootstrap');

let UNB_APP_PROMISE = null;

/**
 * Initializes the UNB application.
 */
const createApp = async () => {
    if (UNB_APP_PROMISE) {
        return UNB_APP_PROMISE;
    }

    UNB_APP_PROMISE = (async () => {
        Logger.info('Initialization', 'Initializing UNB...');

        const { db, toolbox, repo } = await initDatabase();
        const settingsService = await initSettings(repo);
        const cacheProviderService = await initCache();
        const localeService = await initLocale(settingsService);
        const membersService = await initMembers(localeService, settingsService, repo, cacheProviderService);
        const forumsService = await initForums(cacheProviderService, repo);
        const groupsService = await initGroups(repo, cacheProviderService, settingsService);
        const emojiService = await initEmoji();
        const tagsService = await initTags(repo);
        const onlineTrackerService = await initOnline(settingsService);

        const database = {
            instance: db,
            toolbox,
            repo
        };

        app.locals.db = database;
        app.locals.settingsService = settingsService;
        app.locals.cacheProviderService = cacheProviderService;
        app.locals.localeService = localeService;
        app.locals.membersService = membersService;
        app.locals.forumsService = forumsService;
        app.locals.groupsService = groupsService;
        app.locals.emojiService = emojiService;
        app.locals.tagsService = tagsService;
        app.locals.onlineTrackerService = onlineTrackerService;

        DataStore.set('unb', {
            db: database,
            settingsService,
            cacheProviderService,
            localeService,
            membersService,
            forumsService,
            groupsService,
            emojiService,
            tagsService,
            onlineTrackerService
        });

        app.use(cors({
            origin: process.env.UNB_BASE_URL,
            credentials: true
        }));

        app.use(cookieParser());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use('/public', express.static(path.join(__dirname, '..', 'public')));
        app.use('/themes', express.static(path.join(__dirname, '..', 'themes')));
        app.use('/acp/css', express.static(path.join(__dirname, 'admincp', 'views', 'css')));
        app.use('/acp/js', express.static(path.join(__dirname, 'admincp', 'views', 'js')));
        app.use(session({
            secret: process.env.UNB_SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: Boolean(process.env.UNB_SESSION_SECURE_COOKIE),
                maxAge: Number(process.env.UNB_SESSION_COOKIE_MAX_AGE_SECONDS)
            }
        }));
        app.use(sessionInitMiddleware());
        app.use(sessionMiddleware());
        app.use(memberMiddleware());
        app.use(localeMiddleware(settingsService, localeService, repo));
        app.use(themeMiddleware(repo));
        app.use(csrfMiddleware());
        app.use(ejsLayouts);
        app.use(viewEngineMiddleware(app));
        app.use(viewGlobalsMiddleware());
        app.use(onlineTrackerMiddleware());

        await initRoutes(app);

        Logger.info('Initialization', 'UNB initialization complete!');

        global._UNB_APP = app;

        return app;
    })();

    return UNB_APP_PROMISE;
};

module.exports = createApp;