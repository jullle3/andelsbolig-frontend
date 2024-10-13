import {setupUtils} from "./utils.js";
import {setupViews, showView} from "./views/viewManager.js";
import {setupProfileView} from "./profile/profile.js";
import {populateCreateAdvertisementForm, setupCreateAdvertisementView} from "./create-advertisement/create-advertisement.js";
import {fetchAndDisplayAdvertisements, setupHomeView} from "./home/home.js";
import {setupRegisterView} from "./create-user/create-user.js";
import {setupLogoutView} from "./logout/logout.js";
import {setupLoginView} from "./login/login.js";
import {SetupHeader} from "./header/header.js";
import {setupMapView} from "./map/map.js";

document.addEventListener('DOMContentLoaded', () => {
    SetupHeader();
    setupUtils();
    setupViews();
    setupProfileView();
    setupHomeView();
    setupCreateAdvertisementView();
    populateCreateAdvertisementForm();

    setupRegisterView();
    setupLoginView();
    setupLogoutView();
    setupMapView();

    // Call on page load
    fetchAndDisplayAdvertisements();
    showView('home');
    // displayAdvertisementDetail('66b78e9a3e8b4fe4fd952fbd')

    // Check the initial URL and show the corresponding view
    const initialView = window.location.hash.replace('#', '') || 'home';
    // showView(initialView);
});

