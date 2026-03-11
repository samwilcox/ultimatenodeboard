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
 * UNB AJAX library.
 */
(function (global, $) {
    'use strict';

    if (!$) {
        throw new Error('UNB_ADMINCP.ajax requires jQuery.');
    }

    const Ajax = {};

    /**
     * UNB core AJAX request method.
     * 
     * @param {"GET"|"POST"} method - The HTTP method to invoke. 
     * @param {string} action - The AJAX action to perform. 
     * @param {object} [options={}] - Options for the AJAX request.
     * @param {object|null} [options.data={}] - Optional data to send (default is `null`).
     * @param {object} [options.headers={}] - Optional headers to include in the request.
     * @param {number} [options.timeout=10000] - The total timeout period in milliseconds (default is `10000').
     * @param {"json"} [options.dataType='json'] - The data type of the data to send (default is `json`).
     * @param {string} [options.contentType='application/json'] - THe content type of the data being sent (default is `application/json`).
     * @param {Function|null} [options.onError=null] - Optional on error callback function (default is `null`).
     * @param {object|null} [options.query=null] - Optional query parameters (default is `null`).
     */
    Ajax.request = (method, action, options = {}) => {
        const {
            data = null,
            headers = {},
            timeout = 10000,
            dataType = 'json',
            contentType = 'application/json',
            onError = null,
            query = null
        } = options;
        
        const queryString = query  
            ? `?${new URLSearchParams(query).toString()}`
            : '';

        const bootstrap = window.UNB_BOOTSTRAP;

        const url = `${bootstrap.urls.api}/${action}${queryString}`;
        let finalData = dataType === 'json' ? JSON.stringify(data) : data;

        return new Promise((resolve, reject) => {
            $.ajax({
                method,
                url,
                data: finalData,
                headers: { ...headers },
                timeout,
                dataType,
                contentType,
                xhrFields: {
                    useCredentials: true
                },

                success(response) {
                    resolve(response);
                },

                error(xhr, status, error) {
                    const payload = {
                        xhr,
                        status,
                        error,
                        response: xhr?.responseJSON || null
                    };

                    if (typeof onError === 'function') {
                        onError(payload);
                    }

                    reject(payload);
                }
            })
        });
    };

    /**
     * Perform an AJAX GET request.
     * 
     * @param {string} action - The AJAX action to perform. 
     * @param {object} [options={}] - Options for the AJAX request.
     * @param {object|null} [options.data={}] - Optional data to send (default is `null`).
     * @param {object} [options.headers={}] - Optional headers to include in the request.
     * @param {number} [options.timeout=10000] - The total timeout period in milliseconds (default is `10000').
     * @param {"json"} [options.dataType='json'] - The data type of the data to send (default is `json`).
     * @param {string} [options.contentType='application/json'] - THe content type of the data being sent (default is `application/json`).
     * @param {Function|null} [options.onError=null] - Optional on error callback function (default is `null`).
     * @param {object|null} [options.query=null] - Optional query parameters (default is `null`).
     */
    Ajax.get = (action, options = {}) => {
        return Ajax.request('GET', action, options);
    };

    /**
     * Perform an AJAX POST request.
     * 
     * @param {string} action - The AJAX action to perform. 
     * @param {object} [data={}] - Data parameters to send.
     * @param {object} [options={}] - Options for the AJAX request.
     * @param {object|null} [options.data={}] - Optional data to send (default is `null`).
     * @param {object} [options.headers={}] - Optional headers to include in the request.
     * @param {number} [options.timeout=10000] - The total timeout period in milliseconds (default is `10000').
     * @param {"json"} [options.dataType='json'] - The data type of the data to send (default is `json`).
     * @param {string} [options.contentType='application/json'] - THe content type of the data being sent (default is `application/json`).
     * @param {Function|null} [options.onError=null] - Optional on error callback function (default is `null`).
     * @param {object|null} [options.query=null] - Optional query parameters (default is `null`).
     */
    Ajax.post = (action, data = {}, options = {}) => {
        return Ajax.request('POST', action, { ...options, data });
    };

    global.UNB = global.UNB || {};
    global.UNB_ADMINCP.ajax = Ajax;
})(window, window.jQuery);