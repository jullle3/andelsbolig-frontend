import {setupUtils} from "./utils.js";
import {setupViews, showView} from "./views/viewManager.js";
import {setupProfileView} from "./profile/profile.js";
import {setupCreateAdvertisementView} from "./create/create.js";
import {fetchAndDisplayAdvertisements, setupHomeView} from "./home/home.js";
import {setupRegisterView} from "./register/register.js";
import {setupLogoutView} from "./logout/logout.js";
import {setupLoginView} from "./login/login.js";
import {insertHeader} from "./header/header.js";
import {displayAdvertisementDetail} from "./advertisement_detail/advertisement_detail.js";

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
    // showView('register');
    // displayAdvertisementDetail('66ad6718d8ed65fe7d1b5624')
});

