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

const EditorService = require("../../editor/editor.service");
const { buildUrl } = require("../../helpers/url.helper");

/**
 * UNB forums management model.
 */
class ForumsModel {
    /**
     * Create a new instance of `ForumsModel`.
     */
    constructor() {
        this._payload = {};
    }

    /**
     * The AdminCP forum management.
     * 
     * @param {object} req - The request object from `Express`.
     * @param {object} res - The response object from `Express`.
     * @param {NextFunction} next - The next middleware to execute.
     * @returns {Promise<object>} A promise that resolves to the payload.
     */
    async forums(req, res, next) {
        const { forumsService } = req.app.locals;

        const data = await forumsService.allArr();
        const forums = [];

        const forumsNoChildren = data
            .filter(f => f.parentKey === null)
            .sort((a, b) => a.sortOrder - b.sortOrder);

        const forumChildren = data.filter(f => f.parentKey !== null);

        if (forumsNoChildren.length > 0) {
            for (const forum of forumsNoChildren) {
                let childrenList = null;

                const children = forumChildren
                    .filter(c => c.parentKey === forum.key)
                    .sort((a, b) => a.sortOrder - b.sortOrder);

                if (children.length > 0) {
                    childrenList = children;
                }

                forums.push({
                    forum,
                    children: childrenList
                });
            }
        }

        this._payload.forums = forums;

        this._payload.links = {
            createForum: buildUrl(['admincp', 'forums', 'create'])
        };

        return this._payload;
    }

    /**
     * Create new forum form.
     * 
     * @param {object} req - The request object from `Express`.
     * @param {object} res - The response object from `Express`.
     * @param {NextFunction} next - The next middleware to execute.
     * @returns {Promise<object>} A promise that resolves to the payload.
     */
    async createForum(req, res, next) {
        const { localeService, forumsService } = req.app.locals;
        const { parent } = req.query;

        this._payload.title = await localeService.t('admin.forums.create.forum.title');

        if (parent) {
            const forum = await forumsService.get(parent);

            if (forum) {
                this._payload.title = await localeService.t('admin.forums.create.forum.child.title', { title: forum.title });
            }
        }

        this._payload.editor = await EditorService.build({ returnHtml: true });

        return this._payload;
    }
}

module.exports = ForumsModel;