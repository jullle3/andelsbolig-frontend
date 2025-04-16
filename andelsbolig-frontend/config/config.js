let apiUrl;
let basePath;
let stripe_customer_portal;

if (window.location.hostname === 'localhost') {
    apiUrl = 'http://localhost:8500';
    basePath = '';
    stripe_customer_portal = 'https://billing.stripe.com/p/login/test_14kaFp1Rc6wX0Le9AA'
} else {
    apiUrl = 'https://hidden-slice-416812.ew.r.appspot.com';
    basePath = 'andelsbolig-frontend';
    stripe_customer_portal = 'https://billing.stripe.com/p/login/test_14kaFp1Rc6wX0Le9AA'
}

export {basePath, apiUrl, stripe_customer_portal};