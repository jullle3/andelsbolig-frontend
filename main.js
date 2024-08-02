import {setupUtils} from "./andelsbolig-frontend/utils.js";
import {setupViews} from "./andelsbolig-frontend/views/viewManager.js";
import {setupProfileView} from "./andelsbolig-frontend/views/profile.js";
import {setupCreateAdvertisementView} from "./andelsbolig-frontend/views/create_listing.js";
import {fetchAndDisplayAdvertisements, setupHomeView} from "./andelsbolig-frontend/views/advertisements.js";
import {setupRegisterView} from "./andelsbolig-frontend/views/register.js";
import {setupLogoutView} from "./andelsbolig-frontend/views/logout.js";
import {setupLoginView} from "./andelsbolig-frontend/views/login.js";
import {insertHeader} from "./andelsbolig-frontend/header/header.js";

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

