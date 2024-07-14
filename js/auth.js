let apiUrl;

if (window.location.hostname === 'localhost') {
    apiUrl = 'http://localhost:8500/';
} else {
    apiUrl = 'https://hidden-slice-416812.ew.r.appspot.com/';
}


/**
 * A wrapper around the fetch function to automatically include JWT in the headers.
 * @param {string} url The URL to fetch.
 * @param {object} options Additional options for the fetch request.
 * @returns {Promise<Response>} The fetch promise.
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