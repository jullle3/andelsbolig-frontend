import {apiUrl} from "../config/config.js";

/**
 * A wrapper around the fetch function to automatically include JWT in the headers.
 */
export function authFetch(url, options = {}) {
    const jwt = localStorage.getItem('jwt');

    // Ensure headers object exists
    if (!options.headers) {
        options.headers = {};
    }

    // Append the Authorization header with the JWT, if it exists
    if (jwt) {
        options.headers['Authorization'] = `Bearer ${jwt}`;
    }

    return fetch(apiUrl + url, options);
}