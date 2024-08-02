let apiUrl;
let basePath;

if (window.location.hostname === 'localhost') {
    apiUrl = 'http://localhost:8500/';
    basePath = '';
} else {
    apiUrl = 'https://hidden-slice-416812.ew.r.appspot.com/';
    basePath = 'andelsbolig-frontend/';
}

export {basePath, apiUrl};