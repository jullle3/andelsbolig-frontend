import {editAgent, loadAgents} from "../agent/agent.js";
import {isLoggedIn} from "../utils.js";
import {loadAdvertisementDetail} from "../advertisement_detail/advertisement_detail.js";
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
const protectedViews = ["agent", "login", "create"];
// Store requested view if not logged in
export let viewAfterLogin = null;

export function resetViewAfterLogin() {
    viewAfterLogin = null;
}

// TODO: Endpoints that need to load config upon requests should be called from here
// All views are to be accessed via this method. It authorizes the user (if needed), loads required data and shows the
// view afterward
export async function showView(view, viewParams = new URLSearchParams()) {
    // Check user is logged in
    if (protectedView(view) && !isLoggedIn()) {
        displayLoginModal(view)
        return
    }

    if (!views[view]) {
        console.log(`Invalid view: "${view}". Defaulting to 'advertisement_list'.`);
        view = 'advertisement_list';
    }

    await loadViewData(view, viewParams)

    Object.values(views).forEach(v => {
        v.classList.remove('active');
        v.style.display = 'none';
    });

    views[view].style.display = 'block';
    setTimeout(() => views[view].classList.add('active'), 10);

    closeNavbar();
    currentView = view;

    // Store relevant params in URL such that users can share them with friends.
    viewParams.set("view", view)
    const urlWithParams = `${window.location.pathname}?${viewParams.toString()}`;
    history.pushState({ view, params: viewParams.toString() }, '', urlWithParams);

}

function displayLoginModal(requestedView) {
    viewAfterLogin = requestedView;  // Remember the original view
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();
}

// Load content for a given view
async function loadViewData(view, viewParams) {
    switch (view) {
        case "detail":
            await loadAdvertisementDetail(viewParams.get("id"))
            break;
        case "seller_profile":
            await loadSellerProfile(viewParams.get("id"))
            break;
        case "agent":
            await loadAgents()
            break;
        case "agent_edit":
            await editAgent(viewParams.get("id"))
            break;
        default:
            break;
    }
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
            } else {
                showView(viewName);
            }
        });
    });
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


// Support navigating back and forth between pages while preserving URL params
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.view) {
        const params = new URLSearchParams(event.state.params || '');
        loadViewData(event.state.view, params).then(() => {
            Object.values(views).forEach(v => {
                v.classList.remove('active');
                v.style.display = 'none';
            });

            views[event.state.view].style.display = 'block';
            setTimeout(() => views[event.state.view].classList.add('active'), 10);

            currentView = event.state.view;
        }).catch(err => {
            console.error("Error loading view on popstate:", err);
        });
}})


window.showView = showView;
