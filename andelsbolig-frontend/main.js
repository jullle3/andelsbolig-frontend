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
import {SetupAgentView} from "./agent/agent.js";
import {SetupAgentEditView} from "./agent_edit/agent_edit.js";
import {SetupAgentCreateView} from "./agent_create/agent_create.js";

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
    SetupAgentView();
    SetupAgentEditView();
    SetupAgentCreateView();

    // Call on page load
    fetchAndDisplayAdvertisements();

    // Check the initial URL and show the corresponding view
    const initialView = window.location.hash.replace('#', '') || 'advertisement_list';
    showView(initialView);
    showView('agent_edit');
});

