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
 * UNB post
 * 
 * An entity that represents a single topic.
 */
class Post {
    /**
     * Create a new instance of `Post`.
     */
    constructor() {
        this._key = null;
        this._forumKey = null;
        this._topicKey = null;
        this._postNumber = null;
        this._createdBy = null;
        this._createdAt = null;
        this._tags = null;
        this._content = null;
        this._isFirstPost = false;
        this._attachments = null;
        this._ipAddress = null;
        this._hostname = null;
        this._userAgent = null;
    }

    /**
     * Get the post key name for this post.
     * 
     * @returns {string} The post key name for this post.
     */
    get key() {
        return this._key;
    }

    /**
     * Set the post key name for this post.
     * 
     * @param {string} key - The post key name for this post.
     */
    set key(key) {
        this._key = key;
    }

    /**
     * Get the forum key of the forum this post belongs to.
     * 
     * @returns {string} The forum key of the forum this post belongs to.
     */
    get forumKey() {
        return this._forumKey;
    }

    /**
     * Set the forum key of the forum this post belongs to.
     * 
     * @param {string} forumKey - The forum key of the forum this post belongs to.
     */
    set forumKey(forumKey) {
        this._forumKey = forumKey;
    }

    /**
     * Get the topic key of the topic this post belongs to.
     * 
     * @returns {string} The topic key of the topic this post belongs to.
     */
    get topicKey() {
        return this._topicKey;
    }

    /**
     * Set the topic key of this topic this post belongs to.
     * 
     * @param {string} topicKey - The topic key of the topic this post belongs to.
     */
    set topicKey(topicKey) {
        this._topicKey = topicKey;
    }

    /**
     * Get the author that created this post.
     * 
     * @returns {string} The author's key name that created this post.
     */
    get createdBy() {
        return this._createdBy;
    }

    /**
     * Set the author that created this post.
     * 
     * @param {string} createdBy - The author's key name that created this post.
     */
    set createdBy(createdBy) {
        this._createdBy = createdBy;
    }

    /**
     * Get the date of when this post was created.
     * 
     * @returns {Date} The date of when this post was created.
     */
    get createdAt() {
        return this._createdAt;
    }

    /**
     * Set the date of when this post was created.
     * 
     * @param {Date} createdAt - The date of when this post was created.
     */
    set createdAt(createdAt) {
        this._createdAt = createdAt;
    }

    /**
     * Get the tags associated with this post.
     * 
     * @returns {string[]|null} The tags associated with this post.
     */
    get tags() {
        return this._tags;
    }

    /**
     * Set the tags associated with this post.
     * 
     * @param {string[]|null} tags - The tags associated with this post. 
     */
    set tags(tags) {
        this._tags = tags;
    }

    /**
     * Get the content of this post.
     * 
     * @returns {object} The content of this post.
     */
    get content() {
        return this._content;
    }

    /**
     * Set the content of this post.
     * 
     * @param {object} content - The content of this post.
     */
    set content(content) {
        this._content = content;
    }

    /**
     * Get whether this post was the first post in the topic.
     * 
     * @returns {boolean} `true` if the first post, `false` if not.
     */
    get isFirstPost() {
        return this._isFirstPost;
    }

    /**
     * Set whether this post was the first post in the topic.
     * 
     * @param {boolean} isFirstPost - `true` if the first post, `false` if not.
     */
    set isFirstPost(isFirstPost) {
        this._isFirstPost = isFirstPost;
    }

    /**
     * Get the attachments attached to this post.
     * 
     * @returns {string[]|null} The attachments attached to this post or `null` if none.
     */
    get attachments() {
        this._attachments;
    }

    /**
     * Set the attachments attached to this post.
     * 
     * @param {string[]|null} attachments - The attachments attached to this post or `null` if none.
     */
    set attachments(attachments) {
        this._attachments = attachments;
    }

    /**
     * Get the IP address for the user that created this post.
     * 
     * @returns {string} The IP address for the user that created this post.
     */
    get ipAddress() {
        return this._ipAddress;
    }

    /**
     * Set the IP address for the user that created this post.
     * 
     * @param {string} ipAddress - The IP address for the user that created this post.
     */
    set ipAddress(ipAddress) {
        this._ipAddress = ipAddress;
    }

    /**
     * Get the hostname for the user that created this post.
     * 
     * @returns {string} The hostname for the user that created this post.
     */
    get hostname() {
        return this._hostname;
    }

    /**
     * Set the hostname for the user that created this post.
     * 
     * @param {string} hostname - The hostname for the user that created this post.
     */
    set hostname(hostname) {
        this._hostname = hostname;
    }

    /**
     * Get the user agent for the user that created this post.
     * 
     * @returns {string} The user agent for the user that created this post.
     */
    get userAgent() {
        return this._userAgent;
    }

    /**
     * Set the user agent for the user that created this post.
     * 
     * @param {string} userAgent - The user agent for the user that created this post.
     */
    set userAgent(userAgent) {
        this._userAgent = userAgent;
    }

    /**
     * Get the post number for this post.
     * 
     * @returns {number} The post number for this post.
     */
    get postNumber() {
        return this._postNumber;
    }

    /**
     * Set the post number for this post.
     * 
     * @param {number} postNumber - The post number for this post.
     */
    set postNumber(postNumber) {
        this._postNumber = postNumber;
    }

    /**
     * Convert this entity to a JSON representation.
     * 
     * @returns {JSON} The JSON representation of this entity.
     */
    toJSON() {
        return {
            key: this._key,
            forumKey: this._forumKey,
            topicKey: this._topicKey,
            postNumber: this._postNumber,
            createdBy: this._createdBy,
            createdAt: this._createdAt,
            tags: this._tags,
            content: this._content,
            isFirstPost: this._isFirstPost,
            attachments: this._attachments,
            ipAddress: this._ipAddress,
            hostname: this._hostname,
            userAgent: this._userAgent
        };
    }
}

module.exports = Post;