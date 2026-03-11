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

function getGroupFromKey(key) {
    return key.split('.')[0];
}

function isDangerous(key) {
    return key.startsWith('administration.');
}

function generateDefinitions() {
    const flatKeys = flatten(UNB_PERMISSION_KEYS);

    const now = new Date();

    return flatKeys.map(key => ({
        key,
        group: getGroupFromKey(key),

        labelLocaleKey: `permissions.${key}.label`,
        descriptionLocaleKey: `permissions.${key}.description`,

        scopeTypes: ['global'],

        default: 'deny',

        pluginKey: null,

        isDangerous: isDangerous(key),

        createdAt: now,
        updatedAt: now
    }));
}

const documents = generateDefinitions();

console.log(JSON.stringify(documents, null, 2));