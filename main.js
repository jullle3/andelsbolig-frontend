import {insertHeader} from "./js/utils.js";
import {setupViews, showView} from "./js/views.js";
import {setupProfileView} from "./js/views/profile.js";
import {setupCreateAdvertisementView} from "./js/views/create_listing.js";
import {fetchAndDisplayAdvertisements, setupHomeView} from "./js/views/advertisements.js";
import {setupRegisterView} from "./js/views/register.js";
import {setupLogoutView} from "./js/views/logout.js";

document.addEventListener('DOMContentLoaded', () => {
    insertHeader();
    setupViews();
    setupProfileView();
    setupHomeView();
    setupCreateAdvertisementView();
    setupRegisterView();
    setupLogoutView();

    // Call on page load
    fetchAndDisplayAdvertisements();

    // Handle routing
    handleRouting();
    window.addEventListener('popstate', handleRouting);
});


function handleRouting() {
    const url = new URL(window.location.href);
    const path = url.pathname;
    const viewParam = url.searchParams.get('view');

    let view = '404';

    if (viewParam && path.includes('/index.html')) {
        view = 'login';
    } else if (path.includes('/index.html')) {
        view = 'home';
    }

    // console.log(url)
    // console.log(path)
    // console.log(viewParam)
    // console.log(view)
    showView(view);
}