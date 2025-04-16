import {loadUser, setupUtils} from "./utils.js";
import {setupViews, showView} from "./views/viewManager.js";
import {setupProfileView} from "./profile/profile.js";
import {populateCreateAdvertisementForm, setupCreateAdvertisementView} from "./create-advertisement/create-advertisement.js";
import {setupLogoutView} from "./logout/logout.js";
import {setupLoginView} from "./login/login.js";
import {SetupHeader} from "./header/header.js";
import {setupMapView} from "./advertisement_map/advertisement_map.js";
import {insertSearchComponents, setupAdvertisementListView} from "./advertisement_list/advertisement_list.js";
import {SetupAgentView} from "./agent/agent.js";
import {SetupAgentEditView} from "./agent_edit/agent_edit.js";
import {insertSharedComponents, SetupAgentCreateView} from "./agent_create/agent_create.js";
import {SetupFooter} from "./footer/footer.js";

document.addEventListener('DOMContentLoaded', async () => {
    SetupHeader();
    SetupFooter();

    setupUtils();
    setupViews();
    setupProfileView();

    insertSharedComponents()
    insertSearchComponents()

    setupAdvertisementListView();

    setupCreateAdvertisementView();
    populateCreateAdvertisementForm();

    setupLoginView();
    setupLogoutView();
    setupMapView();
    SetupAgentView();
    SetupAgentEditView();
    SetupAgentCreateView();

    // Important to await, since user is used in sendSearchData()
    await loadUser()
    sendSearchData('list')
    await handleRouting()
});

// Change route accordingly whenver user pastes a new URL into the browser
window.addEventListener('hashchange', handleRouting);

// Centralized function to handle routing
async function handleRouting() {
    const params = new URLSearchParams(window.location.search);
    const view = params.get("view")
    await showView(view, params);
}

