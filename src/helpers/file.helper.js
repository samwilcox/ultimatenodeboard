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

const fs = require('fs');
const path = require('path');
const Logger = require('../log/logger');
const DataStore = require('../datastore/datastore');
const UNB_SETTING_KEYS = require('../settings/settings.keys');

/**
 * Create a new file with content.
 * 
 * @param {string} filePath - The file path of the file to create.
 * @param {string} content - The content for the file. 
 * @throws {Error} If the file creation process fails.
 */
const createFile = (filePath, content = '') => {
    try {
        fs.writeFileSync(filePath, content, { flag: 'wx' });
    } catch (error) {
        Logger.error('FileHelper', `Error creating file '${filePath}': ${error}.`, { error, filePath, content });
        throw error;
    }
};

/**
 * Write content to a file.
 * 
 * @param {string} filePath - The file path of the file to write to.
 * @param {string} content - The content to write to the file.
 * @throws {Error} If the file write process fails.
 */
const writeFile = (filePath, content = '') => {
    try {
        fs.writeFileSync(filePath, content);
    } catch (error) {
        Logger.error('FileHelper', `Error writing content to file '${filePath}': ${error}.`, { error, filePath, content });
        throw error;
    }
};

/**
 * Append content to a file.
 * 
 * @param {string} filePath - The file path of the file to append content to.
 * @param {string} content - The content to append to the file.
 * @throws {Error} If the file append process fails.
 */
const appendToFile = (filePath, content) => {
    try {
        fs.appendFileSync(filePath, content);
    } catch (error) {
        Logger.error('FileHelper', `Error appending content to file '${filePath}': ${error}.`, { error, filePath, content });
        throw error;
    }
};

/**
 * Read content of a file.
 * 
 * @param {string} filePath - The path to the file to read to contents of.
 * @returns {string} The content of the file.
 * @throws {Error} If the file read process fails.
 */
const readFile = (filePath) => {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        Logger.error('FileHelper', `Error reading the content of the file '${filePath}': ${error}.`, { error, filePath });
        throw error;
    }
};

/**
 * Delete a file.
 * 
 * @param {string} filePath - The path to the file to delete.
 * @throws {Error} If the file deletion process fails.
 */
const deleteFile = (filePath) => {
    try {
        fs.unlinkSync(filePath);
    } catch (error) {
        Logger.error('FileHelper', `Error deleting file '${filePath}': ${error}.`, { error, filePath });
        throw error;
    }
};

/**
 * Set permissions on a file.
 * 
 * @param {string} filePath - The path to the file to set permissions on.
 * @param {number} mode - The permissions in octel to set on the file (e.g., 0x644).
 * @throws {Error} If the permission set process fails. 
 */
const setPermissions = (filePath, mode) => {
    try {
        fs.chmodSync(filePath, mode);
    } catch (error) {
        Logger.error('FileHelper', `Error setting permissions on file '${filePath}': ${error}.`, { error, filePath, mode });
        throw error;
    }
};

/**
 * Move a file.
 * 
 * @param {string} filePath - The path to the file to move.
 * @param {string} destination - The destination path to move the file to.
 * @throws {Error} If the file move process fails.
 */
const moveFile = (filePath, destination) => {
    try {
        fs.mkdirSync(path.dirname(destination), { recursive: true });
        fs.renameSync(filePath, destination);
    } catch (error) {
        Logger.error('FileHelper', `Error moving file '${filePath}' to '${destination}': ${error}.`, { error, filePath, destination });
        throw error;
    }
};

/**
 * Get the size of a file.
 * 
 * @param {string} filePath - The path to the file to get the size for.
 * @returns {number} The total size of the file in bytes.
 * @throws {Error} If the file size return process fails.
 */
const fileSize = (filePath) => {
    try {
        const stats = fs.statSync(filePath);
        return stats.size ?? 0;
    } catch (error) {
        Logger.error('FileHelper', `Error fetching the file size of file '${filePath}': ${error}.`, { error, filePath });
        throw error;
    }
};

/**
 * Create a directory.
 * If the directory does exist, nothing happens.
 * 
 * @param {string} directory - The path to the directory to create.
 * @throws {Error} If the file creation process fails.
 */
const createDirectory = (directory) => {
    try {
        fs.mkdirSync(directory, { recursive: true });
    } catch (error) {
        Logger.error('FileHelper', `Error creating the directory '${directory}': ${error}.`, { error, directory });
        throw error;
    }
};

/**
 * Check whether a path exists.
 * 
 * @param {string} path - The path the check for existence.
 * @returns {boolean} `true` if the path exists, `false` if not.
 * @throws {Error} If the file path check fails.
 */
const pathExists = (path) => {
    try {
        return fs.existsSync(path);
    } catch (error) {
        Logger.error('FileHelper', `Error checking existence of path: '${path}': ${error}.`, { error, path });
        throw error;
    }
};

/**
 * Read the contents of a directory.
 * 
 * @param {string} path - The path to read the content of.
 * @returns {fs.Dirent} The fs.Dirent file listing object.
 */
const readDir = (path) => {
    try {
        return fs.readdirSync(path, { withFileTypes: true });
    } catch (error) {
        Logger.error('FileHelper', `Error reading the directory: '${path}': ${error}.`, { error, path });
        throw error;
    }
};

/**
 * Get the statistics for a file.
 * 
 * @param {string} path - The path to the file to get statistics on.
 * @returns {object} An object containing the file statistics.
 * @throws {Error} If the file statistics fetch process fails.
 */
const stat = (path) => {
    try {
        return fs.statSync(path);
    } catch (error) {
        Logger.error('FileHelper', `Error fetching the statistics on file '${path}': ${error}.`, { error, path });
        throw error;
    }
};

/**
 * Format a file size in bytes into a humean-readable string format.
 * 
 * @param {number} bytes - The file size in bytes to format.
 * @returns {Promise<string>} A promise that resolves to a human-readable file size string (e.g., `1.23 MB`).
 * 
 * @example
 * const size = formatFileSize(12300000); // 1.23 MB
 */
const formatFileSize = async (bytes) => {
    const n = Number(bytes);

    const { settingsService } = DataStore.get('unb');

    const sizeUnits = await settingsService.get(UNB_SETTING_KEYS.FILE_SIZE_UNITS, ['B', 'KB', 'MB', 'GB', 'TB', 'PB']);

    if (!Number.isFinite(n) || n <= 0) {
        return `0 ${sizeUnits[0]}`;
    }

    const i = Math.min(Math.max(Math.floor(Math.log(n) / Math.log(1024)), 0), sizeUnits.length - 1);

    const formattedSize = (n / Math.pow(1024, i)).toFixed(2);

    return `${formattedSize} ${sizeUnits[i]}`;
};

module.exports = {
    createFile,
    writeFile,
    appendToFile,
    readFile,
    deleteFile,
    setPermissions,
    moveFile,
    fileSize,
    createDirectory,
    pathExists,
    readDir,
    stat,
    formatFileSize
};