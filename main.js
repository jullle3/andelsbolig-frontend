import {insertHeader} from "./js/utils.js";
import {setupViews} from "./js/views.js";
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
});
