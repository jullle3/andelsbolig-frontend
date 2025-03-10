import {loadAgentView} from "../agent/agent.js";
import {displayErrorMessage, isLoggedIn} from "../utils.js";
import {loadSellerProfile} from "../seller_profile/seller_profile.js";

// Setup click events for all views
const views = {
    advertisement_list: document.getElementById('advertisement_list'),
    // Hack to redirect users to that page when completing login
    login: document.getElementById('advertisement_list'),
    detail: document.getElementById('detail'),
    create: document.getElementById('create'),
    agent: document.getElementById('agent'),
    agent_create: document.getElementById('agent_create'),
    agent_edit: document.getElementById('agent_edit'),
    profile: document.getElementById('profile'),
    seller_profile: document.getElementById('seller_profile'),
    // payment1: document.getElementById('payment-view1'),
    payment2: document.getElementById('payment2'),
    faq: document.getElementById('faq'),
    map: document.getElementById('map'),
};


// Starting view
let currentView = 'advertisement_list';
// All views that require login
const protectedViews = ["agent", "login", "create", "seller_profile"];
// Store requested view if not logged in
export let viewAfterLogin = null;
export let viewParamsAfterLogin = null;

export function resetViewAfterLogin() {
    viewAfterLogin = null;
    viewParamsAfterLogin = null;
}

export function showView(view, params = null) {
    if (protectedView(view) && !isLoggedIn()) {
        displayLoginModal(view, params);
        return;
    }

    if (!views[view]) {
        console.error(`Invalid view: "${view}". Defaulting to 'advertisement_list'.`);
        view = 'advertisement_list';
    }

    Object.values(views).forEach(v => {
        v.classList.remove('active');
        v.style.display = 'none';
    });

    views[view].style.display = 'block';
    setTimeout(() => views[view].classList.add('active'), 10);

    closeNavbar();
    currentView = view;

    // Update URL depending on view
    let urlPath = view;
    if (view === 'detail' && params && params.id) {
        urlPath = `/detail/${params.id}`;
        loadDetail(params.id);
    } else {
        urlPath = `/${view}`;
    }

    history.pushState({ view: view, params: params }, '', urlFor(view, params));
}

// Helper function to generate URLs
function urlFor(view, params) {
    switch(view) {
        case 'detail':
            return `/detail/${params ? params.id : ''}`;
        default:
            return `/${view}`;
    }
}


function displayLoginModal(requestedView, viewParams) {
    // Need to store in global variables since showView is called after a successful login
    viewAfterLogin = requestedView;  // Remember the original view
    viewParamsAfterLogin = viewParams;  // Remember the original view params

    console.log(viewParamsAfterLogin)
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();
}

export function setupViews() {
    const clickableElements = document.querySelectorAll('[data-view]');

    clickableElements.forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            // Remove 'active' class from all clickable elements
            clickableElements.forEach(el => el.classList.remove('active'));
            // Add 'active' class to the clicked element if it's not the logo (handled separately if needed)
            if (this !== document.querySelector('.navbar-brand')) {
                this.classList.add('active');
            }
            const viewName = this.getAttribute('data-view');
            if (viewName === 'advertisement_list' && currentView === 'advertisement_list') {
                scrollDownToHideNavbar(); // Scroll down if already on the advertisement_list view
            } else if (viewName === 'agent') {
                loadAgentView()
            } else {
                showView(viewName);
            }
        });
    });
}


// TODO: Endpoints that need to load config upon requests should be called from here
// Load content for a given view
async function loadViewData(view) {
    switch (view) {
        case "seller_profile":
            await loadSellerProfile()
            break;
        default:
            console.log("Default :)")
    }

}

function protectedView(viewName) {
    return protectedViews.includes(viewName);
}


function closeNavbar() {
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (navbarCollapse.classList.contains('show')) {
        navbarCollapse.classList.remove('show');
    }
}

function scrollDownToHideNavbar() {
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    window.scrollTo({
        top: navbarHeight,
        behavior: 'smooth'
    });
}


// Handle the popstate event to navigate back
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.view) {
        showView(event.state.view);
    }
});

function handleRouting() {
    const path = window.location.pathname.split('/');
    const view = path[1];
    const param = path[2];

    console.log(view)
    console.log(param)
    if (view === 'detail' && param) {
        showView('detail', { id: param });
    } else {
        showView(view || 'advertisement_list');
    }
}

window.handleRouting = handleRouting;
window.showView = showView;
