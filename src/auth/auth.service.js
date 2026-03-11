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
const DateTimeService = require('../datetime/datetime.service');
const { buildErrorBox } = require('../helpers/error-box.helper');
const { buildLink } = require('../helpers/link.helper');
const { buildUrl, getCurrentUrl } = require('../helpers/url.helper');
const MemberRespository = require('../repository/member.repository');
const { sessionVarExists, getSessionVar, deleteSessionVar } = require('../session/session.helper');
const UNB_SESSION_KEYS = require('../session/session.keys');
const UNB_SETTING_KEYS = require('../settings/settings.keys');
const bcrypt = require('bcrypt');

/**
 * UNB auth service
 * 
 * Service for handling authentication-related tasks.
 */
class AuthService {
    /**
     * Build the sign in form.
     * 
     * @param {object} req - The request object from `Express`.
     * @returns {Promise<boolean>} A promise that returns the sign in form data.
     */
    static async buildSignInForm(req) {
        const { settingsService, localeService } = DataStore.get('unb');
        let errorBox = null;

        if (sessionVarExists(req, UNB_SESSION_KEYS.FORM_ERROR)) {
            const formError = getSessionVar(req, UNB_SESSION_KEYS.FORM_ERROR);
            const message = formError.message;

            errorBox = buildErrorBox({
                error: message,
                canClose: true,
                display: true
            });

            deleteSessionVar(req, UNB_SESSION_KEYS.FORM_ERROR);
        } else {
            errorBox = buildErrorBox({
                display: false,
                canClose: true
            });
        }

        return {
            settings: {
                allowUsername: await settingsService.get(UNB_SETTING_KEYS.AUTH_ALLOW_USERNAME),
                rememberMeAllowed: await settingsService.get(UNB_SETTING_KEYS.AUTH_REMEMBER_ME_ENABLED)
            },
            parsedLocale: {
                forgotPassword: await localeService.t('auth.form.forgotpassword', {
                    link: await buildLink(await localeService.t('auth.form.forgotpassword.link'), {
                        url: buildUrl(['auth', 'forgotpassword'])
                    })
                }),
                signUp: await localeService.t('auth.form.signup', {
                    link: await buildLink(await localeService.t('auth.form.signup.link'), {
                        url: buildUrl(['signup'])
                    })
                })
            },
            errorBox,
            currentUrl: getCurrentUrl(req),
            action: buildUrl(['auth', 'signin'])
        };
    }

    /**
     * Validate an user's account entered credentials.
     * 
     * @param {string} identity - The user's identity (either email or username).
     * @param {string} plainTextPassword - The plaintext password entered by the user.
     * @returns {Promise<{
     *      ok: boolean,
     *      message: string|null,
     *      attempts: number|null,
     *      expires: number|null,
     *      member: Member|null
     * }} A promise that resolves to an object containing the authentication results.
     */
    static async validateCredentials(identity, plainTextPassword) {
        const {
            membersService,
            settingsService,
            localeService,
            db
        } = DataStore.get('unb');

        const lockoutMaxFailedAttempts = await settingsService.get(UNB_SETTING_KEYS.SECURITY_ACCOUNT_LOCKOUT_MAX_FAILED_ATTEMPTS);
        const member = await membersService.resolveByIdentity(identity);

        if (!member) {
            return {
                ok: false,
                message: await localeService.t('error.auth.service.credentials.invalid'),
                attempts: 0,
                expires: null,
                member: await MemberRespository.getByKey(null)
            };
        }

        const memberData = await db.repo.members.getOneByQuery({ key: member.key });

        if (!this.verifyPassword(plainTextPassword, memberData.passwordHash)) {
            const lockedInfo = await this.handleAccountLockout(member.key, false);

            if (lockedInfo.locked) {
                return {
                    ok: false,
                    message: lockedInfo.expires === null
                        ? await localeService.t('error.auth.service.credentials.locked.expire.disabled')
                        : await localeService.t('error.auth.service.credentials.locked.expire.enabled', {
                            total: Math.round(localeService.expires)
                        }),
                    attempts: lockedInfo.attempts,
                    expires: lockedInfo.expires,
                    member
                };
            } else {
                if (lockedInfo.enabled) {
                    return {
                        ok: false,
                        message: await localeService.t('error.auth.service.credentials.unlocked.attempts.remaining', {
                            start: lockedInfo.attempts,
                            end: lockoutMaxFailedAttempts
                        }),
                        attempts: lockedInfo.attempts,
                        expires: lockedInfo.expires,
                        member
                    };
                } else {
                    return {
                        ok: false,
                        message: await localeService.t('error.auth.service.credentials.invalid'),
                        attempts: 0,
                        expires: null,
                        member
                    };
                }
            }
        }

        const lockedInfo = await this.handleAccountLockout(member.key, true);

        if (lockedInfo.locked) {
            return {
                ok: false,
                message: lockedInfo.expires === null
                        ? await localeService.t('error.auth.service.credentials.locked.expire.disabled')
                        : await localeService.t('error.auth.service.credentials.locked.expire.enabled', {
                            total: Math.round(localeService.expires)
                        }),
                attempts: lockedInfo.attempts,
                expires: lockedInfo.expires,
                member
            };
        } else {
            return {
                ok: true,
                message: null,
                attempts: null,
                expires: null,
                member
            };
        }
    }

    /**
     * Handles any account lockout. This all depends on the settings for account lockout.
     * 
     * @param {string} key - The member's key name.
     * @param {boolean} authenticated - `true` if the member has been authenticated.
     *                                  `false` if the member has not been authenticated yet.
     * @returns {Promise<{
     *      locked: boolean,
     *      enabled: boolean,
     *      attempts: number|null,
     *      expires: number|null
     * }} A promise that resolves to a data object containing lockout details. 
     */
    static async handleAccountLockout(key, authenticated) {
        const { settingsService } = DataStore.get('unb');

        const lockoutEnabled = await settingsService.get(UNB_SETTING_KEYS.SECURITY_ACCOUNT_LOCKOUT_ENABLED);
        const lockoutMaxFailedAttempts = await settingsService.get(UNB_SETTING_KEYS.SECURITY_ACCOUNT_LOCKOUT_MAX_FAILED_ATTEMPTS);
        const lockoutAllowExpire = await settingsService.get(UNB_SETTING_KEYS.SECURITY_ACCOUNT_LOCKOUT_ALLOW_EXPIRE);
        const lockoutExpirationMins = await settingsService.get(UNB_SETTING_KEYS.SECURITY_ACCOUNT_LOCKOUT_EXPIRATION_MINUTES);

        const base = {
            locked: false,
            enabled: Boolean(lockoutEnabled),
            attempts: 0,
            expires: null
        };

        if (!lockoutEnabled) return base;

        const member = await MemberRespository.getByKey(key);

        if (!member) return base;

        let lockout = member.lockout;

        if (authenticated) {
            if (!lockout.locked && lockout.attempts > 0) {
                lockout = {
                    locked: false,
                    attempts: 0,
                    expires: null
                };

                await this.updateLockout(member, lockout);

                return base;
            }

            if (lockout.locked && lockoutAllowExpire && lockout.expires !== null && lockout.expires <= DateTimeService.dateToEpoch(new Date())) {
                lockout.locked = false;
                lockout.attempts = 0;
                lockout.expires = null;

                await this.updateLockout(member, lockout);

                return base;
            }
        } else {
            let attempts = lockout.attempts;
            attempts++;

            lockout.attempts = attempts;

            if (attempts >= lockoutMaxFailedAttempts) {
                lockout.locked = true;
                
                lockout.expires = lockoutAllowExpire
                    ? DateTimeService.dateToEpoch(new Date()) + (lockoutExpirationMins * 60)
                    : null;

                await this.updateLockout(member, lockout);

                base.locked = true;
                base.attempts = attempts;
                base.expires = lockout.expires;

                return base;
            } else {
                await this.updateLockout(member, lockout);

                base.attempts = attempts;
                base.expires = lockout.expires;

                return base;
            }
        }

        return base;
    }

    /**
     * Helper that updates the member lockout data object.
     * 
     * @private
     * @param {Member} member - The member entity instance. 
     * @param {object} lockout - The member's lockout data object. 
     */
    static async updateLockout(member, lockout) {
        const { db, membersService } = DataStore.get('unb');

        await db.repo.members.update({ key: member.key }, { lockout });
        member.lockout = lockout;

        await membersService.updateMember(member);
    }

    /**
     * Hash a plaintext password.
     * 
     * @param {string} plainText - The plain text password to hash.
     * @returns {Promise<string>} A promise that resolves to the hashed password string.
     * @throws {TypeError} If the plain text parameter is not a string.
     */
    static async hashPassword(plainText) {
        const { localeService, settingsService } = DataStore.get('unb');

        if (typeof plainText !== 'string' || !plainText.length) {
            throw new TypeError(await localeService.t('error.auth.service.password.type.error'));
        }

        const saltRounds = await settingsService.get(UNB_SETTING_KEYS.SECURITY_PASSWORD_SALT_ROUNDS);

        return await bcrypt.hash(plainText, saltRounds);
    }

    /**
     * Verify a plaintext password against a stored hash.
     * 
     * @param {string} plainText - The plain text password entered by the user.
     * @param {string} storedHash - The stored password hash from the database.
     * @returns {Promise<boolean>} A promise that resolves to either:
     *                             `true` if password has been verified.
     *                             `false` if the password is invalid.
     */
    static async verifyPassword(plainText, storedHash) {
        if (!plainText || !storedHash) return false;

        try {
            return await bcrypt.compare(plainText, storedHash);
        } catch {
            return false;
        }
    }

    /**
     * Determine whether a password hash should be rehashed.
     * 
     * @param {string} storedHash - The stored password hash from the database.
     * @returns {boolean} `true` if needs to be rehashed, `false` if not.
     */
    static async needsRehash(storedHash) {
        if (!storedHash) return false;

        const { settingsService } = DataStore.get('unb');

        const saltRounds = await settingsService.get(UNB_SETTING_KEYS.SECURITY_PASSWORD_SALT_ROUNDS);

        try {
            const rounds = bcrypt.getRounds(storedHash);
            return rounds < saltRounds;
        } catch {
            return false;
        }
    }
}

module.exports = AuthService;