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

'use strict';

const crypto = require('crypto');
const DataStore = require('../datastore/datastore');
const InvalidParameterError = require('../errors/invalid-parameter.error');
const UNB_CACHE_KEYS = require('../data/cache/cache.keys');

/***
 * UNB permissions service
 * 
 * Central UNB permissions service for resolving and handling permissions
 * for various situations throughout the bulletin board system.
 */
class PermissionsService {
    static RULE_KEY_FIELD = 'key';

    /**
     * Check if a member has a single permission.
     * 
     * @param {Member|string} member - Member entity for key.   
     * @param {string} permissionKey - Permission key. 
     * @param {object} [scopeContext={}] - Optional scope context.
     * @param {string} [scopeContext.topicKey] - Optional topic key
     * @param {string} [scopeContext.forumKey] - Optional forum key.
     * @returns {Promise<boolean>} A promise that resolves to either:
     *                             `true` if the user has valid permissions.
     *                             `false` if the user DO NOT have permissions. 
     */
    static async can(member, permissionKey, scopeContext = {}) {
        const perms = await this.canBatch(member, [permissionKey], scopeContext);
        return perms?.[permissionKey] === true;
    }

    /**
     * Check if a member has ALL permissions in the list.
     * Returns an object map: `{ [key]: boolean }`
     * 
     * @param {Member|string} member - Member entity or key. 
     * @param {string[]} permissionsKeys - Array of permission keys to get permissions for. 
     * @param {object} [scopeContext={}] - Optional scope context. 
     * @param {string} [scopeContext.topicKey] - Optional topic key
     * @param {string} [scopeContext.forumKey] - Optional forum key.
     * @returns {Promise<object>} A promise that resolves to an object with key => boolean key/value pairs.
     * @throws {InvalidParameterError} If the permissionsKeys parameter is not an array.
     */
    static async canList(member, permissionsKeys, scopeContext = {}) {
        const { localeService } = DataStore.get('unb');

        if (!Array.isArray(permissionsKeys)) {
            throw new InvalidParameterError(
                await localeService.t('error.permissions.service.permissionkeys.not.array'),
                { permissionsKeys }
            );
        }

        return await this.canBatch(member, permissionsKeys, scopeContext);
    }

    /**
     * Check if a member has at least one permission in the list.
     * 
     * @param {Member|string} member - Member entity or key. 
     * @param {string[]} permissionsKeys - Array of permission keys to get permissions for. 
     * @param {object} [scopeContext={}] - Optional scope context. 
     * @param {string} [scopeContext.topicKey] - Optional topic key
     * @param {string} [scopeContext.forumKey] - Optional forum key.
     * @returns {Promise<object>} A promise that resolves to an object with key => boolean key/value pairs.
     * @throws {InvalidParameterError} If the permissionsKeys parameter is not an array.
     */
    static async canSome(member, permissionKeys, scopeContext = {}) {
        const { localeService } = DataStore.get('unb');

        if (!Array.isArray(permissionKeys)) {
            throw new InvalidParameterError(
                await localeService.t('error.permissions.service.permissionkeys.not.array'),
                { permissionKeys }
            );
        }

        if (!permissionKeys.length) return false;

        const results = await this.canBatch(member, permissionKeys, scopeContext);

        for (const k of permissionKeys) {
            if (results?.[k] === true) return true;
        }

        return false;
    }

    /**
     * Batch resolve permissions efficiently.
     * 
     * Returns `{ [permissionKey]: boolean }`
     * 
     * @param {Member|string} member - Member entity or key. 
     * @param {string[]} permissionsKeys - Array of permission keys to get permissions for. 
     * @param {object} [scopeContext={}] - Optional scope context. 
     * @param {string} [scopeContext.topicKey] - Optional topic key
     * @param {string} [scopeContext.forumKey] - Optional forum key.
     * @returns {Promise<object>} A promise that resolves to an object with key => boolean key/value pairs.
     */
    static async canBatch(member, permissionKeys, scopeContext = {}) {
        const { membersService } = DataStore.get('unb');

        if (!Array.isArray(permissionKeys) || !permissionKeys.length) {
            return {};
        }

        member = await membersService.resolve(member);

        if (!member) {
            member = {
                key: null,
                groups: [{ key: 'guests' }]
            };
        }

        const expandedGroups = await this._getExpandedGroupKeys(member);

        const results = {};
        const unresolved = [];

        for (const key of permissionKeys) {
            const scopeChain = await this._validateAndBuildScopeChain(
                key,
                scopeContext
            );

            const rules = await this._getRulesForKeys([key], scopeChain);

            const resolved = this.resolveFromRules(
                member,
                expandedGroups,
                rules,
                scopeChain
            );

            if (resolved === null) {
                unresolved.push(key);
            } else {
                results[key] = resolved;
            }
        }

        if (unresolved.length) {
            const defMap = await this._getDefinitionsMap(unresolved);

            for (const key of unresolved) {
                const def = defMap.get(key);
                results[key] = def?.default === 'allow';
            }
        }

        return results;
    }

    /**
     * Similar to `canBatch`, but caches the entire batch result for this member+scope+keyset.
     * 
     * @param {Member|string} member - Member entity or key. 
     * @param {string[]} permissionsKeys - Array of permission keys to get permissions for. 
     * @param {object} [scopeContext={}] - Optional scope context. 
     * @param {string} [scopeContext.topicKey] - Optional topic key
     * @param {string} [scopeContext.forumKey] - Optional forum key.
     * @returns {Promise<object>} A promise that resolves to an object with key => boolean key/value pairs.
     */
    static async canBatchCached(member, permissionKeys, scopeContext = {}) {
        const { cacheProviderService, membersService } = DataStore.get('unb');

        if (!Array.isArray(permissionKeys) || !permissionKeys.length) return {};

        member = await membersService.resolve(member);

        if (!member) {
            member = {
                key: null,
                groups: [{ key: 'guests' }]
            };
        }

        const scopeChain = this._buildScopeChain(scopeContext);
        const scopeHash = this._buildScopeHash(scopeChain);
        const keysHash = this._hashPermissionKeys(permissionKeys);
        const memberKeyForCache = member.key || 'guest';

        const cacheKey = UNB_CACHE_KEYS.PERMISSION_RESOLVE_BATCH
            .replace('{memberKey}', memberKeyForCache)
            .replace('{scopeHash}', scopeHash)
            .replace('{keysHash}', keysHash);

        return await cacheProviderService.get(cacheKey, async () => {
            return await this.canBatch(member, permissionKeys, scopeContext);
        });
    }

    /**
     * Build scope chain
     * 
     * Supported: topic -> forum -> global
     * 
     * @private
     * @param {object} [scopeContext={}] - Optional scope context.
     * @returns {{
     *      type: string,
     *      key: (string|null)
     * }[]} An object containing the type and key. 
     */
    static _buildScopeChain(scopeContext = {}) {
        const chain = [];

        const topicKey = (scopeContext?.topicKey || '').trim();
        const forumKey = (scopeContext?.forumKey || '').trim();

        if (topicKey) chain.push({ type: 'topic', key: topicKey });
        if (forumKey) chain.push({ type: 'forum', key: forumKey });

        chain.push({ type: 'global', key: null });

        return chain;
    }   

    /**
     * Build stable scope hash for caching purposes.
     * 
     * @private
     * @param {{
     *      type: string,
     *      key: (string|null)
     * }[]} scopeChain - The scope chain object. 
     */
    static _buildScopeHash(scopeChain) {
        return (scopeChain || [])
            .map(s => `${s.type}:${s.key ?? 'null'}`)
            .join('|');
    }

    /**
     * Create a stable hash for permission key sets.
     *
     * @private 
     * @param {string[]} permissionKeys - The permissions keys collection.
     * @returns {string} The hashed keys.
     */
    static _hashPermissionKeys(permissionKeys) {
        const stable = [...new Set(permissionKeys.filter(Boolean))].sort().join('|');
        return crypto.createHash('sha256').update(stable).digest('hex').slice(0, 24);
    }

    /**
     * Expand member groups with group inheritence, cached per member.
     * 
     * @private
     * @param {Member} member - The member entity.
     * @returns {Promise<string[]>} A promise that resolves the expanded group keys. 
     */
    static async _getExpandedGroupKeys(member) {
        const { cacheProviderService, db } = DataStore.get('unb');

        const memberKey = member?.key;

        const direct = (member.groups || [])
            .map(g => (g?.key || '').trim())
            .filter(Boolean);

        if (!memberKey) {
            return [...new Set(direct)];
        }

        const cacheKey = UNB_CACHE_KEYS.MEMBER_GROUPS_EXPANDED
            .replace('{memberKey}', memberKey);

        return await cacheProviderService.get(cacheKey, async () => {
            const direct = (member.groups || [])
            .map(g => (g?.key || '').trim())
            .filter(Boolean);

            if (!direct.length) return [];

            const groupRepo = db?.repo?.groups;

            if (!groupRepo || typeof groupRepo.getAll !== 'function') {
                return [...new Set(direct)];
            }

            const groups = await groupRepo.getAll();
            const groupMap = new Map((groups || []).map(g => [g.key, g]));

            const expanded = new Set();
            const stack = [...direct];

            while (stack.length) {
                const gk = stack.pop();
                if (!gk) continue;
                if (expanded.has(gk)) continue;

                expanded.add(gk);

                const group = groupMap.get(gk);
                if (!group) continue;

                const inherits = Array.isArray(group.inherits) ? group.inherits : [];

                for (const parent of inherits) {
                    const pk = (parent || '').trim();
                    if (pk && !expanded.has(pk)) stack.push(pk);
                }
            }

            return [...expanded];
        });
    }

    /**
     * Fetch all permission rules for many permission keys and the scope chain.
     * 
     * @param {string[]} permissionsKeys - Array of permission keys to get permissions for. 
     * @param {{
     *      type: string,
     *      key: (string|null)
     * }[]} scopeChain The scope chain collection.
     */
    static async _getRulesForKeys(permissionKeys, scopeChain) {
        const { db } = DataStore.get('unb');
        const repo = db?.repo?.permissionRules;

        if (!repo || typeof repo.getByQuery !== 'function') {
            return [];
        }

        const results = [];

        for (const permissionKey of permissionKeys) {
            for (const scope of scopeChain) {
                const rule = await repo.getByQuery({
                    key: permissionKey,
                    scopeType: scope.type,
                    scopeKey: scope.key
                });

                if (rule) {
                    if (Array.isArray(rule))
                    results.push(...rule);
                } else {
                    results.push(rule);
                }
            }
        }

        return results;
    }

    /**
     * Get the definitions map for permission keys.
     * 
     * @param {string[]} permissionKeys - Array of permission keys.
     * @returns {Promise<(Map|null)>} A promise that resolves to the definition map or `null.
     */
    static async _getDefinitionsMap(permissionKeys) {
        const { cacheProviderService, db } = DataStore.get('unb');
        const repo = db?.repo?.permissionDefinitions;

        const map = new Map();
        if (!repo) return map;

        for (const key of permissionKeys) {
            const cacheKey = UNB_CACHE_KEYS.PERMISSION_DEFINITION
                .replace('{permissionKey}', key);

            const def = await cacheProviderService.get(cacheKey, async () => {
                if (typeof repo.getOneByQuery === 'function') {
                    return await repo.getOneByQuery({ key });
                }

                return null;
            });

            if (def?.key) {
                map.set(def.key, def);
            }
        }

        return map;
    }

    /**
     * Resolve a single permission from rule docs using precendence:
     * - most specific scope -> least
     * - user deny > user allow > group deny > group allow
     * - deny wins at same tier
     * - no match -> null (caller uses definition default)
     * 
     * @param {Member} member - The member entity. 
     * @param {string[]} expandedGroups - The list of expanded groups. 
     * @param {object[]} rules - List of rules. 
     * @param {{
     *      type: string,
     *      key: (string|null)
     * }[]} scopeChain - The scope chain.
     * @returns {boolean|null} `true` if resolved from rules, `false` if not, or
     *                         `null`if invalid scope key.  
     */
    static resolveFromRules(member, expandedGroups, rules, scopeChain) {
        const ruleMap = new Map();

        for (const r of (rules || [])) {
            const st = r?.scopeType;
            const sk = r?.scopeKey ?? 'null';
            if (!st) continue;

            ruleMap.set(`${st}:${sk}`, r);
        }

        const memberKey = member?.key;
        const groups = Array.isArray(expandedGroups) ? expandedGroups : [];

        for (const scope of (scopeChain || [])) {
            const st = scope.type;
            const sk = scope.key ?? 'null';

            const rule = ruleMap.get(`${st}:${sk}`);
            if (!rule || rule.enabled === false) continue;

            if (Array.isArray(rule?.users?.deny) &&
                rule.users.deny.includes(memberKey)) {
                return false;
            }

            if (Array.isArray(rule?.users?.allow) &&
                rule.users.allow.includes(memberKey)) {
                return true;
            }

            if (Array.isArray(rule?.groups?.deny) &&
                this._intersects(rule.groups.deny, groups)) {
                return false;
            }

            if (Array.isArray(rule?.groups?.allow) &&
                this._intersects(rule.groups.allow, groups)) {
                return true;
            }
        }

        return null;
    }

    /**
     * Check if any element of a is in b.
     * 
     * @private
     * @param {string[]} a - The first collection.
     * @param {string[]} b - The second collection.
     * @returns {boolean} `true` if the collections intersect, `false` if not. 
     */
    static _intersects(a, b) {
        if (!Array.isArray(a) || !a.length) return false;
        if (!Array.isArray(b) || !b.length) return false;

        const setB = new Set(b);

        for (const x of a) {
            if (setB.has(x)) return true;
        }

        return false;
    }

    /**
     * Flatten an object.
     * 
     * @param {object} obj - The object to flatten. 
     * @param {object} [result={}] - The result (for recursion purposes).
     * @returns {object} The resulting flattened object. 
     */
    static flatten(obj, result = {}) {
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                result[obj[key]] = obj[key];
            } else {
                this.flatten(obj[key], result);
            }
        }

        return result;
    }

    /**
     * Get the definition for a permission.
     * 
     * @private
     * @param {string} permissionKey - The permission key.
     * @returns {Promise<object|null>} A promise that resolves to the permission definition or
     *                                 `null` if an invalid permission key.
     */
    static async _getDefinition(permissionKey) {
        if (!permissionKey) return null;

        const map = await this._getDefinitionsMap([permissionKey]);
        return map.get(permissionKey) || null;
    }

    /**
     * Validate and then build the scope chain.
     * 
     * @private
     * @param {string} permissionKey - The permission key.
     * @param {object} [scopeContext={}] - Optional scope context (omit for global).
     * @returns {Promise<object[{
     *      type: string,
     *      key: (string|null)
     * }]>} A promise that resolves to an array of data objects. 
     */
    static async _validateAndBuildScopeChain(permissionKey, scopeContext = {}) {
        const definition = await this._getDefinition(permissionKey);

        if (!definition) {
            return [{ type: 'global', key: null }];
        }

        const allowedScopes = Array.isArray(definition.scopeTypes)
            ? definition.scopeTypes
            : ['global'];

        const chain = [];

        const topicKey = (scopeContext?.topicKey || '').trim();
        const forumKey = (scopeContext?.forumKey || '').trim();

        if (topicKey && allowedScopes.includes('topic')) {
            chain.push({ type: 'topic', key: topicKey });
        }

        if (forumKey && allowedScopes.includes('forum')) {
            chain.push({ type: 'forum', key: forumKey });
        }

        if (allowedScopes.includes('global')) {
            chain.push({ type: 'global', key: null });
        }

        if (!chain.length) {
            chain.push({ type: 'global', key: null });
        }

        return chain;
    }
}

module.exports = PermissionsService;