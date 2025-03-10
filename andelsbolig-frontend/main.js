import {setupUtils} from "./utils.js";
import {setupViews, showView} from "./views/viewManager.js";
import {setupProfileView} from "./profile/profile.js";
import {populateCreateAdvertisementForm, setupCreateAdvertisementView} from "./create-advertisement/create-advertisement.js";
import {setupLogoutView} from "./logout/logout.js";
import {setupLoginView} from "./login/login.js";
import {SetupHeader} from "./header/header.js";
import {setupMapView} from "./advertisement_map/advertisement_map.js";
import {setupAdvertisementListView} from "./advertisement_list/advertisement_list.js";
import {SetupAgentView} from "./agent/agent.js";
import {SetupAgentEditView} from "./agent_edit/agent_edit.js";
import {insertSharedComponents, SetupAgentCreateView} from "./agent_create/agent_create.js";

document.addEventListener('DOMContentLoaded', () => {
    SetupHeader();
    setupUtils();
    setupViews();
    setupProfileView();
    insertSharedComponents()

    setupAdvertisementListView();
    setupCreateAdvertisementView();
    populateCreateAdvertisementForm();

    setupLoginView();
    setupLogoutView();
    setupMapView();
    SetupAgentView();
    SetupAgentEditView();
    SetupAgentCreateView();


    // showView('advertisement_list');
    handleRouting();

    // Handle back and forward navigation
    window.addEventListener('popstate', handleRouting);

    // Call on page load
    // sendSearchData()

    // Check the initial URL and show the corresponding view
    // const initialView = window.location.hash.replace('#', '') || 'advertisement_list';
    // showView(initialView);
});

