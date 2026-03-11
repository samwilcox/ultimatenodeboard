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

const { buildLink } = require('../helpers/link.helper');
const Logger = require('../log/logger');
const UNB_PERMISSION_KEYS = require('../permissions/permissions.keys');
const PermissionsService = require('../permissions/permissions.service');
const ListBuilderService = require('../services/list.builder.service');
const UNB_LIST_OPTIONS = require('../services/list.options');
const UNB_SETTING_KEYS = require('../settings/settings.keys');
const { version } = require('../../package.json');
const DateTimeService = require('../datetime/datetime.service');
const AuthService = require('../auth/auth.service');
const { sessionVarExists } = require('../session/session.helper');
const UNB_SESSION_KEYS = require('../session/session.keys');
const { cookieExists, deleteCookie } = require('../cookies/cookies.helper');
const UNB_COOKIE_KEYS = require('../cookies/cookies.keys');
const { buildUrl } = require('../helpers/url.helper');
const { buildEntityUrl } = require('../helpers/entity.helper');

/**
 * UNB middleware for building the global payload.
 */
module.exports = function createViewGlobalsMiddleware() {
    return async function viewGlobalsMiddleware(req, res, next) {
        try {
            const member = res.locals.member;
            const t = req.t;
            const { settingsService, localeService, membersService } = req.app.locals;

            const permissions = await PermissionsService.canBatch(member, [
                UNB_PERMISSION_KEYS.help.access,
                UNB_PERMISSION_KEYS.features.access,
                UNB_PERMISSION_KEYS.features.members,
                UNB_PERMISSION_KEYS.features.whosOnline,
                UNB_PERMISSION_KEYS.features.search,
                UNB_PERMISSION_KEYS.features.tags,
                UNB_PERMISSION_KEYS.features.groups,
                UNB_PERMISSION_KEYS.features.retroactiveTimeline,
                UNB_PERMISSION_KEYS.features.cookieManagement,
                UNB_PERMISSION_KEYS.features.help,
                UNB_PERMISSION_KEYS.administration.adminCPPanel,
                UNB_PERMISSION_KEYS.moderation.toolbox
            ]);

            let authError = false;

            if (cookieExists(req, UNB_COOKIE_KEYS.AUTH_ERROR_FLAG)) {
                authError = true;
                deleteCookie(res, UNB_COOKIE_KEYS.AUTH_ERROR_FLAG);
            }
            
            let globals = {
                member,
                t,

                urls: {
                    base: process.env.UNB_BASE_URL,
                    assets: `${process.env.UNB_BASE_URL}/public/assets`,
                    accountSettings: buildUrl(['accountsettings']),
                    myProfile: buildEntityUrl('member', member.key, member.username),
                    editProfile: buildUrl(['accountsettings', 'profile']),
                    bookmarks: buildUrl(['bookmarks']),
                    friendsList: buildUrl(['friendslist']),
                    moderatorToolbox: buildUrl(['moderatortoolbox']),
                    administratorControlPanel: buildUrl(['admincp']),
                    signOut: buildUrl(['auth', 'signout'])
                },

                site: {
                    title: await settingsService.get(UNB_SETTING_KEYS.COMMUNITY_TITLE),
                    logoType: await settingsService.get(UNB_SETTING_KEYS.COMMUNITY_LOGO_TYPE),
                    logo: {
                        light: await settingsService.get(UNB_SETTING_KEYS.COMMUNITY_LOGO_LIGHT),
                        dark: await settingsService.get(UNB_SETTING_KEYS.COMMUNITY_LOGO_DARK)
                    }
                },

                memberConfig: member.configs,

                themeMode: member.themeMode,

                permissions: {
                    help: permissions[UNB_PERMISSION_KEYS.help.access],
                    features: {
                        access: permissions[UNB_PERMISSION_KEYS.features.access],
                        members: permissions[UNB_PERMISSION_KEYS.features.members],
                        whosOnline: permissions[UNB_PERMISSION_KEYS.features.whosOnline],
                        search: permissions[UNB_PERMISSION_KEYS.features.search],
                        tags: permissions[UNB_PERMISSION_KEYS.features.tags],
                        groups: permissions[UNB_PERMISSION_KEYS.features.groups],
                        retroactiveTimeline: permissions[UNB_PERMISSION_KEYS.features.retroactiveTimeline],
                        cookieManagement: permissions[UNB_PERMISSION_KEYS.features.cookieManagement],
                        help: permissions[UNB_PERMISSION_KEYS.features.help]
                    },
                    adminCP: permissions[UNB_PERMISSION_KEYS.administration.adminCPPanel],
                    moderatorToolbox: permissions[UNB_PERMISSION_KEYS.moderation.toolbox]
                },

                settings: {
                    signUpEnabled: await settingsService.get(UNB_SETTING_KEYS.ACCOUNT_SIGNUP_ENABLED),
                },

                languages: await ListBuilderService.build(UNB_LIST_OPTIONS.LANGUAGES),
                themes: await ListBuilderService.build(UNB_LIST_OPTIONS.THEMES),
                parsedLocale: {
                    poweredBy: await localeService.t('global.poweredby', {
                        link: await buildLink('Ultimate Node Board', {
                            url: 'https://www.ultimatenodeboard.com',
                            target: 'blank'
                        }),
                        version
                    }),
                    allTimes: await localeService.t('global.all.times', {
                        timezone: member.settings.dateTime.timeZone,
                        gmt: await DateTimeService.getTimezoneOffset(member.settings.dateTime.timeZone)
                    }),
                    generatedAt: await localeService.t('global.generated.at', {
                        time: await DateTimeService.formatDateTime(new Date(), { timeOnly: true, timeAgo: false })
                    })
                },
                authForm: await AuthService.buildSignInForm(req),
                authError,
                memberInfo: {
                    photo: await membersService.profilePhoto(member.key, { type: 'mini', link: false }),
                    name: await membersService.getName(member)
                }
            };

            res.locals = {
                ...res.locals,
                ...globals
            };

            next();
        } catch (error) {
            Logger.error('ViewGlobalsMiddleware', `View globals middleware failed: ${error}.`, { error });
            next(error);
        }
    };
};