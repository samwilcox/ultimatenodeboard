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
 * UNB application settings schema.
 */
const UNB_SETTINGS_SCHEMA = Object.seal({
    'community.title': {
        type: 'String',
        defaultValue: 'Ultimate Node Board',
        localeKey: 'settings.community.title.desc'
    },

    'community.logo.type': {
        type: 'String',
        defaultValue: 'image',
        localeKey: 'settings.community.logo.type.desc'
    },

    'community.logo.light': {
        type: 'String',
        defaultValue: 'logo-light.png',
        localeKey: 'settings.community.logo.light.desc'
    },

    'community.logo.dark': {
        type: 'String',
        defaultValue: 'logo-dark.png',
        localeKey: 'settings.community.logo.dark.desc'
    },

    'file.size.units': {
        type: 'Array',
        defaultValue: ['B', 'KB', 'MB', 'GB', 'TB', 'PB'],
        localeKey: 'settings.file.size.units.desc'
    },

    'locale.default': {
        type: 'String',
        defaultValue: 'en-US',
        localeKey: 'settings.locale.default.desc'
    },

    'theme.default': {
        type: 'String',
        defaultValue: 'unb-default',
        localeKey: 'settings.theme.default.desc'
    },

    'theme.default.mode': {
        type: 'String',
        defaultValue: 'light',
        localeKey: 'settings.theme.default.mode.desc'
    },

    'cache.locales.enabled': {
        type: 'Boolean',
        defaultValue: true,
        localeKey: 'settings.cache.locales.enabled.desc'
    },

    'cache.locales.ttl': {
        type: 'Number',
        defaultValue: null,
        localeKey: 'settings.cache.locales.ttl.desc'
    },

    'cache.themes.enabled': {
        type: 'Boolean',
        defaultValue: true,
        localeKey: 'settings.cache.themes.enabled.desc'
    },

    'cache.themes.ttl': {
        type: 'Number',
        defaultValue: null,
        localeKey: 'settings.cache.themes.ttl.desc'
    },

    'cache.permissions.enabled': {
        type: 'Boolean',
        defaultValue: true,
        localeKey: 'settings.cache.permissions.enabled.desc'
    },

    'cache.permissions.ttl': {
        type: 'Number',
        defaultValue: 120,
        localeKey: 'settings.permissions.ttl.desc'
    },

    'account.signup.enabled': {
        type: 'Boolean',
        defaultValue: true,
        localeKey: 'settings.account.signup.enabled.desc'
    },

    'cache.installed.languages.enabled': {
        type: 'Boolean',
        defaultValue: true,
        localeKey: 'settings.cache.installed.languages.enabled.desc'
    },

    'cache.installed.languages.ttl': {
        type: 'Number',
        defaultValue: null,
        localeKey: 'settings.cache.installed.languages.ttl.desc'
    },

    'cache.installed.themes.enabled': {
        type: 'Boolean',
        defaultValue: true,
        localeKey: 'settings.cache.installed,themes.enabled.desc'
    },

    'cache.installed.themes.ttl': {
        type: 'Number',
        defaultValue: null,
        localeKey: 'settings.cache.installed.themes.ttl.desc'
    },

    'cache.topic.replies.enabled': {
        type: 'Boolean',
        defaultValue: true,
        localeKey: 'settings.cache.topic.replies.enabled.desc'
    },

    'cache.topic.replies.ttl': {
        type: 'Number',
        defaultValue: 120,
        localeKey: 'settings.cache.topic.replies.ttl.desc'
    },

    'cache.likes.enabled': {
        type: 'Boolean',
        defaultValue: true,
        localeKey: 'settings.cache.likes.enabled.desc'
    },

    'cache.likes.ttl': {
        type: 'Number',
        defaultValue: 120,
        localeKey: 'settings.cache.likes.ttl.desc'
    },

    'datetime.timeago.max.days': {
        type: 'Number',
        defaultValue: 7,
        localeKey: 'settings.datetime.timeago.max.days.desc'
    },

    'datetime.default': {
        type: 'Object',
        defaultValue: {
            timeZone: 'America/Boise',
            format: {
                date: 'MM/dd/yyyy',
                time: 'hh:mm a',
                full: 'MM/dd/yyyy hh:mm a'
            },
            timeAgo: true
        },
        localeKey: 'settings.datetime.default.desc'
    },

    'member.allow.display.name': {
        type: 'Boolean',
        defaultValue: true,
        localeKey: 'settings.member.allow.display.name.desc'
    },

    'cache.member.profile.photo.enabled': {
        type: 'Boolean',
        defaultValue: true,
        localeKey: 'settings.cache.member.profile.photo.enabled.desc'
    },

    'cache.member.profile.photo.ttl': {
        type: 'Number',
        defaultValue: 360,
        localeKey: 'settings.cache.member.profile.photo.ttl.desc'
    },

    'upload.base.path': {
        type: 'String',
        defaultValue: 'uploads',
        localeKey: 'settings.upload.base.path.desc'
    },

    'upload.profile.photos.path': {
        type: 'String',
        defaultValue: 'profile-photos',
        localeKey: 'settings.upload.profile.photos.path.desc'
    },

    'photo.no.photo.colors': {
        type: 'Array',
        defaultValue: [
            { letter: 'A', light: { background: '#EF4444', text: '#FFFFFF' }, dark: { background: '#7F1D1D', text: '#FFFFFF' } },
            { letter: 'B', light: { background: '#F97316', text: '#FFFFFF' }, dark: { background: '#7C2D12', text: '#FFFFFF' } },
            { letter: 'C', light: { background: '#F59E0B', text: '#000000' }, dark: { background: '#78350F', text: '#FFFFFF' } },
            { letter: 'D', light: { background: '#EAB308', text: '#000000' }, dark: { background: '#713F12', text: '#FFFFFF' } },
            { letter: 'E', light: { background: '#84CC16', text: '#000000' }, dark: { background: '#365314', text: '#FFFFFF' } },
            { letter: 'F', light: { background: '#22C55E', text: '#000000' }, dark: { background: '#14532D', text: '#FFFFFF' } },
            { letter: 'G', light: { background: '#10B981', text: '#000000' }, dark: { background: '#064E3B', text: '#FFFFFF' } },
            { letter: 'H', light: { background: '#14B8A6', text: '#000000' }, dark: { background: '#134E4A', text: '#FFFFFF' } },
            { letter: 'I', light: { background: '#06B6D4', text: '#000000' }, dark: { background: '#164E63', text: '#FFFFFF' } },
            { letter: 'J', light: { background: '#0EA5E9', text: '#FFFFFF' }, dark: { background: '#0C4A6E', text: '#FFFFFF' } },
            { letter: 'K', light: { background: '#3B82F6', text: '#FFFFFF' }, dark: { background: '#1E3A8A', text: '#FFFFFF' } },
            { letter: 'L', light: { background: '#6366F1', text: '#FFFFFF' }, dark: { background: '#312E81', text: '#FFFFFF' } },
            { letter: 'M', light: { background: '#8B5CF6', text: '#FFFFFF' }, dark: { background: '#4C1D95', text: '#FFFFFF' } },
            { letter: 'N', light: { background: '#A855F7', text: '#FFFFFF' }, dark: { background: '#581C87', text: '#FFFFFF' } },
            { letter: 'O', light: { background: '#D946EF', text: '#FFFFFF' }, dark: { background: '#701A75', text: '#FFFFFF' } },
            { letter: 'P', light: { background: '#EC4899', text: '#FFFFFF' }, dark: { background: '#831843', text: '#FFFFFF' } },
            { letter: 'Q', light: { background: '#F43F5E', text: '#FFFFFF' }, dark: { background: '#881337', text: '#FFFFFF' } },
            { letter: 'R', light: { background: '#FB7185', text: '#000000' }, dark: { background: '#9F1239', text: '#FFFFFF' } },
            { letter: 'S', light: { background: '#FDBA74', text: '#000000' }, dark: { background: '#9A3412', text: '#FFFFFF' } },
            { letter: 'T', light: { background: '#FCD34D', text: '#000000' }, dark: { background: '#92400E', text: '#FFFFFF' } },
            { letter: 'U', light: { background: '#A3E635', text: '#000000' }, dark: { background: '#3F6212', text: '#FFFFFF' } },
            { letter: 'V', light: { background: '#4ADE80', text: '#000000' }, dark: { background: '#166534', text: '#FFFFFF' } },
            { letter: 'W', light: { background: '#2DD4BF', text: '#000000' }, dark: { background: '#115E59', text: '#FFFFFF' } },
            { letter: 'X', light: { background: '#22D3EE', text: '#000000' }, dark: { background: '#155E75', text: '#FFFFFF' } },
            { letter: 'Y', light: { background: '#60A5FA', text: '#FFFFFF' }, dark: { background: '#1E40AF', text: '#FFFFFF' } },
            { letter: 'Z', light: { background: '#818CF8', text: '#FFFFFF' }, dark: { background: '#3730A3', text: '#FFFFFF' } }
            ],
        localeKey: 'settings.photo.no.photo.colors.desc'
    },

    'cache.content.read.status.enabled': {
        type: 'Boolean',
        defaultValue: true,
        localeKey: 'settings.cache.content.read.status.enabled.desc'
    },

    'cache.content.read.status.ttl': {
        type: 'Number',
        defaultValue: 60,
        localeKey: 'settings.cache.content.read.status.ttl.desc'
    },

    'cache.topic.last.post.enabled': {
        type: 'Boolean',
        defaultValue: true,
        localeKey: 'settings.cache.topic.last.post.enabled.desc'
    },

    'cache.topic.last.post.ttl': {
        type: 'Number',
        defaultValue: 60,
        localeKey: 'settings.cache.topic.last.post.ttl.desc'
    },

    'pagination.default': {
        type: 'Object',
        defaultValue: {
            limit: {
                topics: 30
            }
        },
        localeKey: 'settings.pagination.default.desc'
    },

    'cache.filter.topic.to.post.enabled': {
        type: 'Boolean',
        defaultValue: true,
        localeKey: 'settings.filter.topic.to.post.enabled.desc'
    },

    'cache.filter.topic.to.post.ttl': {
        type: 'Number',
        defaultValue: 120,
        localeKey: 'settings.cache.filter.topic.to.post.ttl.desc'
    },

    'cache.topic.has.attachments.enabled': {
        type: 'Boolean',
        defaultValue: true,
        localeKey: 'settings.cache.topic.has.attachments.enabled.desc'
    },

    'cache.topic.has.attachments.ttl': {
        type: 'Number',
        defaultValue: 300,
        localeKey: 'settings.cache.topic.has.attachments.ttl.desc'
    },

    'topics.list.preview.enabled': {
        type: 'Boolean',
        defaultValue: true,
        localeKey: 'settings.topics.list.preview.enabled.desc'
    },

    'auth.allow.username': {
        type: 'Boolean',
        defaultValue: false,
        localeKey: 'settings.auth.allow.username.desc'
    },

    'auth.remember.me.enabled': {
        type: 'Boolean',
        defaultValue: true,
        localeKey: 'settings.auth.remember.me.enabled.desc'
    },

    'security.csrf.enabled': {
        type: 'Boolean',
        defaultValue: true,
        localeKey: 'settings.security.csrf.enabled.desc'
    },

    'security.csrf.check.origin.enabled': {
        type: 'Boolean',
        defaultValue: true,
        localeKey: 'settings.security.csrf.check.origin.enabled.desc'
    },

    'security.csrf.cookie.name': {
        type: 'String',
        defaultValue: '_csrfToken',
        localeKey: 'settings.security.csrf.cookie.name.desc'
    },

    'security.csrf.token.ttl.seconds': {
        type: 'Number',
        defaultValue: 3600,
        localeKey: 'settings.security.csrf.token.ttl.seconds.desc'
    },

    'security.csrf.safe.methods': {
        type: 'Array',
        defaultValue: ['GET', 'HEAD', 'OPTIONS'],
        localeKey: 'settings.security.csrf.safe.methods.desc'
    },

    'security.account.lockout.enabled': {
        type: 'Boolean',
        defaultValue: false,
        localeKey: 'settings.security.account.lockout.enabled.desc'
    },

    'security.account.lockout.max.failed.attempts': {
        type: 'Number',
        defaultValue: 6,
        localeKey: 'settings.account.lockout.max.failed.attempts.desc'
    },

    'security.account.lockout.allow.expire': {
        type: 'Boolean',
        defaultValue: true,
        localeKey: 'settings.security.account.lockout.allow.expire.desc'
    },

    'security.account.lockout.expiration.minutes': {
        type: 'Number',
        defaultValue: 15,
        localeKey: 'settings.security.account.lockout.expiration.minutes.desc'
    },

    'security.password.salt.rounds': {
        type: 'Number',
        defaultValue: 10,
        localeKey: 'settings.security.password.salt.rounds.desc'
    },

    'session.ttl.seconds': {
        type: 'Number',
        defaultValue: 7200,
        localeKey: 'settings.session.ttl.seconds.desc'
    },

    'session.ip.match': {
        type: 'Boolean',
        defaultValue: false,
        localeKey: 'settings.session.ip.match.desc'
    },

    'search.bot.agent.patterns': {
        type: 'Array',
        defaultValue: [],
        localeKey: 'settings.search.bot.agent.patterns.desc'
    },

    'session.remember.ttl.seconds': {
        type: 'Number',
        defaultValue: 2582000, // 30 days
        localeKey: 'settings.session.remember.ttl.seconds.desc'
    },

    'editor.fonts': {
        type: 'Array',
        defaultValue: [
            "Arial",
            "Arial Black",
            "Arial Narrow",
            "Arial Rounded MT Bold",
            "Avant Garde",
            "Book Antiqua",
            "Bookman",
            "Calibri",
            "Cambria",
            "Candara",
            "Century Gothic",
            "Charcoal",
            "Chicago",
            "Comic Sans MS",
            "Consolas",
            "Constantia",
            "Copperplate",
            "Courier",
            "Courier New",
            "Didot",
            "Franklin Gothic Medium",
            "Garamond",
            "Geneva",
            "Georgia",
            "Gill Sans",
            "Google Sans Flex",
            "Goudy Old Style",
            "Helvetica",
            "Helvetica Neue",
            "Hoefler Text",
            "Impact",
            "Lucida Bright",
            "Lucida Console",
            "Lucida Fax",
            "Lucida Grande",
            "Lucida Sans",
            "Lucida Sans Typewriter",
            "Marker Felt",
            "Microsoft Sans Serif",
            "Monaco",
            "MS Sans Serif",
            "MS Serif",
            "New York",
            "Optima",
            "Palatino",
            "Palatino Linotype",
            "Perpetua",
            "Segoe UI",
            "Tahoma",
            "Times",
            "Times New Roman",
            "Trebuchet MS",
            "Verdana",
            "cursive",
            "fantasy",
            "monospace",
            "sans-serif",
            "serif",
            "system-ui"
        ],
        localeKey: 'settings.editor.font.desc'
    },

    'editor.font.default': {
        type: 'String',
        defaultValue: 'Google Sans Flex',
        localeKey: 'settings.editor.font.default.desc'
    },

    'editor.font.sizes': {
        type: 'Array',
        defaultValue: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100],
        localeKey: 'settings.editor.font.sizes.desc'
    },

    'editor.font.size.default': {
        type: 'Number',
        defaultValue: 14,
        localeKey: 'settings.editor.font.size.default.desc'
    },

    'editor.font.colors': {
        type: 'Array',
        defaultValue: [
            { label: 'Black', hex: '#000000' },
            { label: 'Dark Gray', hex: '#333333' },
            { label: 'Gray', hex: '#666666' },
            { label: 'Light Gray', hex: '#999999' },
            { label: 'White', hex: '#FFFFFF' },

            { label: 'Red', hex: '#FF0000' },
            { label: 'Dark Red', hex: '#8B0000' },
            { label: 'Crimson', hex: '#DC143C' },
            { label: 'Firebrick', hex: '#B22222' },
            { label: 'Tomato', hex: '#FF6347' },
            { label: 'Coral', hex: '#FF7F50' },

            { label: 'Orange', hex: '#FFA500' },
            { label: 'Dark Orange', hex: '#FF8C00' },
            { label: 'Gold', hex: '#FFD700' },
            { label: 'Goldenrod', hex: '#DAA520' },
            { label: 'Amber', hex: '#FFBF00' },
            { label: 'Brown', hex: '#8B4513' },

            { label: 'Yellow', hex: '#FFFF00' },
            { label: 'Khaki', hex: '#F0E68C' },
            { label: 'Lemon', hex: '#FFF44F' },

            { label: 'Green', hex: '#00AA00' },
            { label: 'Dark Green', hex: '#006400' },
            { label: 'Forest Green', hex: '#228B22' },
            { label: 'Sea Green', hex: '#2E8B57' },
            { label: 'Lime', hex: '#00FF00' },
            { label: 'Mint', hex: '#3EB489' },

            { label: 'Teal', hex: '#008080' },
            { label: 'Cyan', hex: '#00FFFF' },
            { label: 'Turquoise', hex: '#40E0D0' },
            { label: 'Aqua', hex: '#00BFFF' },

            { label: 'Blue', hex: '#0000FF' },
            { label: 'Dark Blue', hex: '#00008B' },
            { label: 'Navy', hex: '#001F3F' },
            { label: 'Royal Blue', hex: '#4169E1' },
            { label: 'Dodger Blue', hex: '#1E90FF' },
            { label: 'Sky Blue', hex: '#87CEEB' },

            { label: 'Purple', hex: '#800080' },
            { label: 'Indigo', hex: '#4B0082' },
            { label: 'Violet', hex: '#8A2BE2' },
            { label: 'Dark Violet', hex: '#9400D3' },
            { label: 'Plum', hex: '#DDA0DD' },

            { label: 'Pink', hex: '#FF69B4' },
            { label: 'Hot Pink', hex: '#FF1493' },
            { label: 'Deep Pink', hex: '#FF007F' },
            { label: 'Magenta', hex: '#FF00FF' },

            { label: 'Maroon', hex: '#800000' },
            { label: 'Olive', hex: '#808000' },
            { label: 'Slate Gray', hex: '#708090' },
            { label: 'Steel Blue', hex: '#4682B4' }
        ],
        localeKey: 'settings.editor.font.colors.desc'
    },

    'editor.font.color.default': {
        type: 'String',
        defaultValue: '#000000',
        localeKey: 'settings.editor.font.color.default.desc'
    },

    'editor.code.languages': {
        type: 'Array',
        defaultValue: [
            { localeKey: 'editor.code.language.html', value: 'xml' },
            { localeKey: 'editor.code.language.css', value: 'css' },
            { localeKey: 'editor.code.language.scss', value: 'scss' },
            { localeKey: 'editor.code.language.less', value: 'less' },
            { localeKey: 'editor.code.language.javascript', value: 'javascript' },
            { localeKey: 'editor.code.language.typescript', value: 'typescript' },
            { localeKey: 'editor.code.language.json', value: 'json' },
            { localeKey: 'editor.code.language.yaml', value: 'yaml' },
            { localeKey: 'editor.code.language.markdown', value: 'markdown' },
            { localeKey: 'editor.code.language.node', value: 'javascript' },
            { localeKey: 'editor.code.language.jsx', value: 'jsx' },
            { localeKey: 'editor.code.language.tsx', value: 'tsx' },
            { localeKey: 'editor.code.language.python', value: 'python' },
            { localeKey: 'editor.code.language.java', value: 'java' },
            { localeKey: 'editor.code.language.c', value: 'c' },
            { localeKey: 'editor.code.language.cpp', value: 'cpp' },
            { localeKey: 'editor.code.language.csharp', value: 'csharp' },
            { localeKey: 'editor.code.language.go', value: 'go' },
            { localeKey: 'editor.code.language.rust', value: 'rust' },
            { localeKey: 'editor.code.language.swift', value: 'swift' },
            { localeKey: 'editor.code.language.kotlin', value: 'kotlin' },
            { localeKey: 'editor.code.language.scala', value: 'scala' },
            { localeKey: 'editor.code.language.ruby', value: 'ruby' },
            { localeKey: 'editor.code.language.php', value: 'php' },
            { localeKey: 'editor.code.language.perl', value: 'perl' },
            { localeKey: 'editor.code.language.dart', value: 'dart' },
            { localeKey: 'editor.code.language.lua', value: 'lua' },
            { localeKey: 'editor.code.language.bash', value: 'bash' },
            { localeKey: 'editor.code.language.shell', value: 'shell' },
            { localeKey: 'editor.code.language.powershell', value: 'powershell' },
            { localeKey: 'editor.code.language.sql', value: 'sql' },
            { localeKey: 'editor.code.language.mongodb', value: 'mongodb' },
            { localeKey: 'editor.code.language.dockerfile', value: 'dockerfile' },
            { localeKey: 'editor.code.language.nginx', value: 'nginx' },
            { localeKey: 'editor.code.language.ini', value: 'ini' },
            { localeKey: 'editor.code.language.toml', value: 'toml' },
            { localeKey: 'editor.code.language.latex', value: 'latex' },
            { localeKey: 'editor.code.language.haskell', value: 'haskell' },
            { localeKey: 'editor.code.language.elixir', value: 'elixir' },
            { localeKey: 'editor.code.language.erlang', value: 'erlang' },
            { localeKey: 'editor.code.language.clojure', value: 'clojure' },
            { localeKey: 'editor.code.language.asm', value: 'armasm' },
            { localeKey: 'editor.code.language.x86asm', value: 'x86asm' },
            { localeKey: 'editor.code.language.r', value: 'r' },
            { localeKey: 'editor.code.language.matlab', value: 'matlab' },
            { localeKey: 'editor.code.language.graphql', value: 'graphql' },
            { localeKey: 'editor.code.language.regex', value: 'regex' },
            { localeKey: 'editor.code.language.diff', value: 'diff' },
            { localeKey: 'editor.code.language.gdscript', value: 'gdscript' },
            { localeKey: 'editor.code.language.ejs', value: 'ejs' },
            { localeKey: 'editor.code.language.handlebars', value: 'handlebars' },
            { localeKey: 'editor.code.language.protobuf', value: 'protobuf' },
            { localeKey: 'editor.code.language.makefile', value: 'makefile' }
        ],
        localeKey: 'settings.editor.code.languages.desc'
    },

    'editor.giphy.api.key': {
        type: 'String',
        defaultValue: null,
        localeKey: 'settings.editor.giphy.api.key.desc'
    },

    'editor.giphy.limit': {
        type: 'Number',
        defaultValue: 200,
        localeKey: 'settings.editor.giphy.limit.desc'
    },

    'editor.toolbar.default': {
        type: 'Object',
        defaultValue: {
            bold: true,
            italic: true,
            underline: true,
            font: true,
            ['align.center']: true,
            ['align.justify']: true,
            ['align.left']: true,
            ['align.right']: true,
            ['insert.code']: true,
            ['insert.media']: true,
            ['insert.quote']: true,
            ['insert.horizontal.rule']: true,
            ['insert.spoiler']: true,
            color: true,
            ['insert.emoji']: true,
            ['insert.gif']: true,
            ['horizontal.rule']: true,
            ['insert.hyperlink']: true,
            ['insert.image']: true,
            indent: true,
            media: true,
            ['ordered.list']: true,
            ['unordered.list']: true,
            outdent: true,
            quote: true,
            redo: true,
            undo: true,
            size: true,
            spoiler: true,
            strikthrough: true,
            subscript: true,
            superscript: true
        },
        localeKey: 'settings.editor.toolbar.default.desc'
    },

    'sidebar.defaults': {
        type: 'Object',
        defaultValue: {
            posts: {
                enabled: true,
                position: 'right'
            }
        },
        localeKey: 'settings.sidebar.defaults.desc'
    },

    'cache.topic.total.posts.enabled': {
        type: 'Boolean',
        defaultValue: true,
        localeKey: 'settings.cache.topic.total.posts.enabled.desc'
    },

    'cache.topic.total.posts.ttl': {
        type: 'Number',
        defaultValue: 300,
        localeKey: 'settings.cache.topic.total.posts.ttl.desc'
    },

    'cache.topic.total.posters.enabled': {
        type: 'Boolean',
        defaultValue: true,
        localeKey: 'settings.topic.total.posters.enabled.desc'
    },

    'cache.topic.total.posters.ttl': {
        type: 'Number',
        defaultValue: 300,
        localeKey: 'settings.cache.topic.total.posters.ttl.desc'
    },

    'cache.topic.tags.enabled': {
        type: 'Boolean',
        defaultValue: true,
        localeKey: 'settings.cache.topic.tags.enabled.desc'
    },

    'cache.topic.tags.ttl': {
        type: 'Number',
        defaultValue: 300,
        localeKey: 'settings.cache.topic.tags.ttl.desc'
    },

    'topic.service.tags.truncate': {
        type: 'Boolean',
        defaultValue: true,
        localeKey: 'settings.topic.service.tags.truncate.desc'
    },

    'topic.service.tags.truncate.max.tags': {
        type: 'Number',
        defaultValue: 2,
        localeKey: 'settings.topic.service.tags.truncate.max.tags.desc'
    },

    'group.color.default': {
        type: "Object",
        defaultValue: {
            light: {
                normal: {
                    text: '#FFFFFF',
                    background: '#000000'
                },
                hover: {
                    text: '#FFFFFF',
                    background: '#373737'
                }
            },
            dark: {
                normal: {
                    text: '#000000',
                    background: '#FFFFFF'
                },
                hover: {
                    text: '#000000',
                    background: '#E2E2E2'
                }
            }
        },
        localeKey: 'settings.group.color.default.desc'
    },

    'online.tracker.service.ttl': {
        type: 'Number',
        defaultValue: 300,
        localeKey: 'settings.online.tracker.service.ttl.desc'
    },

    'cache.likes.enabled': {
        type: 'Boolean',
        defaultValue: true,
        localeKey: 'settings.cache.likes.enabled.desc'
    },

    'cache.likes.ttl': {
        type: 'Number',
        defaultValue: 60,
        localeKey: 'settings.cache.likes.ttl.desc'
    },

    'cache.likes.per.member.enabled': {
        type: 'Boolean',
        defaultValue: true,
        localeKey: 'settings.cache.likes.per.member.enabled.desc'
    },

    'cache.likes.per.member.ttl': {
        type: 'Number',
        defaultValue: 60,
        localeKey: 'settings.cache.likes.per.member.ttl.desc'
    },

    'posts.timeline.gap.enabled': {
        type: 'Boolean',
        defaultValue: true,
        localeKey: 'settings.posts.timeline.gap.enabled.desc'
    },
    
    'posts.timeline.gap.seconds': {
        type: 'Number',
        defaultValue: 86400,
        localeKey: 'settings.posts.timeline.gap.seconds.desc'
    }
});

Object.freeze(UNB_SETTINGS_SCHEMA);
module.exports = UNB_SETTINGS_SCHEMA;