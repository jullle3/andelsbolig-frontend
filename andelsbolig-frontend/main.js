import {fetchAndDisplayAdvertisements, setupUtils} from "./utils.js";
import {setupViews, showView} from "./views/viewManager.js";
import {setupProfileView} from "./profile/profile.js";
import {populateCreateAdvertisementForm, setupCreateAdvertisementView} from "./create-advertisement/create-advertisement.js";
import {setupRegisterView} from "./create-user/create-user.js";
import {setupLogoutView} from "./logout/logout.js";
import {setupLoginView} from "./login/login.js";
import {SetupHeader} from "./header/header.js";
import {setupMapView} from "./advertisement_map/advertisement_map.js";
import {setupAdvertisementListView} from "./advertisement_list/advertisement_list.js";

document.addEventListener('DOMContentLoaded', () => {
    SetupHeader();
    setupUtils();
    setupViews();
    setupProfileView();
    setupAdvertisementListView();
    setupCreateAdvertisementView();
    populateCreateAdvertisementForm();

    setupRegisterView();
    setupLoginView();
    setupLogoutView();
    setupMapView();

    // Call on page load
    fetchAndDisplayAdvertisements();
    showView('advertisement_list');
    // displayAdvertisementDetail('66b78e9a3e8b4fe4fd952fbd')

    // Check the initial URL and show the corresponding view
    const initialView = window.location.hash.replace('#', '') || 'advertisement_list';
    // showView(initialView);
});

