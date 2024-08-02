import {setupUtils} from "./utils.js";
import {setupViews} from "./views/viewManager.js";
import {setupProfileView} from "./views/profile.js";
import {setupCreateAdvertisementView} from "./views/create_listing.js";
import {fetchAndDisplayAdvertisements, setupHomeView} from "./views/advertisements.js";
import {setupRegisterView} from "./views/register.js";
import {setupLogoutView} from "./views/logout.js";
import {setupLoginView} from "./views/login.js";
import {insertHeader} from "./header/header.js";

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

