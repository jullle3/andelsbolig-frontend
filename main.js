import {insertHeader, setupUtils} from "./js/utils.js";
import {setupViews, showView} from "./js/views.js";
import {setupProfileView} from "./js/views/profile.js";
import {setupCreateAdvertisementView} from "./js/views/create_listing.js";
import {fetchAndDisplayAdvertisements, setupHomeView} from "./js/views/advertisements.js";
import {setupRegisterView} from "./js/views/register.js";
import {setupLogoutView} from "./js/views/logout.js";
import {setupLoginView} from "./js/views/login.js";

document.addEventListener('DOMContentLoaded', () => {
    insertHeader();
    setupUtils();
    setupViews();
    setupProfileView();
    setupHomeView();
    setupCreateAdvertisementView();
    setupRegisterView();
    setupLoginView();
    setupLogoutView();

    // Call on page load
    fetchAndDisplayAdvertisements();
});

