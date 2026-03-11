const UNB_PERMISSION_KEYS = require('../src/permissions/permissions.keys');

function flatten(obj, result = []) {
    for (const key in obj) {
        const value = obj[key];
        if (typeof value === 'string') {
            result.push(value);
        } else if (typeof value === 'object' && value !== null) {
            flatten(value, result);
        }
    }
    return result;
}

function getGroupsForPermission(key) {
    if (key.startsWith('administration.')) {
        return ['administrators'];
    }

    if (key.startsWith('moderation.')) {
        return ['administrators', 'moderators'];
    }

    return ['administrators', 'moderators', 'members', 'guests'];
}

function generateDocuments() {
    const flatKeys = flatten(UNB_PERMISSION_KEYS);

    const docs = flatKeys.map(key => ({
        key,
        scopeType: 'global',
        scopeKey: null,
        enabled: true,
        users: {
            allow: [],
            deny: []
        },
        groups: {
            allow: getGroupsForPermission(key),
            deny: []
        },
        updatedAt: new Date(),
        updatedBy: 'system.seed'
    }));

    return docs;
}

const documents = generateDocuments();

console.log(JSON.stringify(documents, null, 2));