import {editAgent, loadAgents} from "../agent/agent.js";
import {isLoggedIn, isSubscribed, openInNewTab} from "../utils.js";
import {loadAdvertisementDetail} from "../advertisement_detail/advertisement_detail.js";
import {loadSellerProfile} from "../seller_profile/seller_profile.js";
import {sendSearchData} from "../advertisement_list/advertisement_list.js";

// Setup click events for all views
const views = {
    advertisement_list: document.getElementById('advertisement_list'),
    advertisement_map: document.getElementById('advertisement_map'),
    // Hack to redirect users to that page when completing login
    login: document.getElementById('advertisement_list'),
    detail: document.getElementById('detail'),
    create: document.getElementById('create'),
    agent: document.getElementById('agent'),
    agent_create: document.getElementById('agent_create'),
    agent_edit: document.getElementById('agent_edit'),
    profile: document.getElementById('profile'),
    seller_profile: document.getElementById('seller_profile'),
    successful_redirect: document.getElementById('successful_redirect'),
    faq: document.getElementById('faq'),
    terms_and_conditions: document.getElementById('terms_and_conditions'),
};

// Starting view
let currentView = 'advertisement_list';
// All views that require login
const loginRequiredViews = ["agent", "login", "create", "seller_profile", "successful_redirect"];
const payWalledViews = ["seller_profile", "successful_redirect"];

// Store requested view to remember redirects after login popup
export let viewAfterLogin = null;
export let viewParamsAfterLogin = new URLSearchParams();

export function resetViewAfterLogin() {
    viewAfterLogin = null;
    viewParamsAfterLogin = new URLSearchParams();
}

// All views are to be accessed via this method. It authorizes the user (if needed), loads required data and shows the
// view afterward
export async function showView(view, viewParams = new URLSearchParams()) {
    if (loginRequiredView(view) && !isLoggedIn()) {
        displayLoginModal(view, viewParams)
        return
    }

    if (payWalledView(view) && !(await isSubscribed())) {
        // Show payment popup, successful users are redirected to our homepage
        new bootstrap.Modal(document.getElementById('paymentModal')).show();
        return
    }

    if (!views[view]) {
        console.log(`Invalid view: "${view}". Defaulting to 'advertisement_list'.`);
        view = 'advertisement_list';
    }

    // Restore params in case the user was redirected to a view after navigating through the login modal
    if (viewParams.toString() === "") {
        viewParams = viewParamsAfterLogin
    }

    if (view === "successful_redirect") {
        let scraped_realtor_url = viewParams.get("scraped_realtor_url")
        if (typeof scraped_realtor_url === 'string' && scraped_realtor_url.trim() !== '') {
            openInNewTab(scraped_realtor_url)
        }
    } else {
        await loadViewData(view, viewParams)
    }

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

// Store values that will be needede after successful login
export function displayLoginModal(requestedView, viewParams) {
    viewAfterLogin = requestedView;  // Remember the original view
    viewParamsAfterLogin = viewParams;  // Remember the original params
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();
}

// Load content for a given view
async function loadViewData(view, viewParams) {
    switch (view) {
        case "detail":
            await loadAdvertisementDetail(viewParams.get("id"))
            window.scrollTo({ top: 0, behavior: 'smooth' });
            break;
        case "seller_profile":
            await loadSellerProfile(viewParams.get("id"))
            break;
        // case "successful_redirect":
        //     let scraped_realtor_url = viewParams.get("scraped_realtor_url")
        //     if (typeof scraped_realtor_url === 'string' && scraped_realtor_url.trim() !== '') {
        //         openInNewTab(scraped_realtor_url)
        //     }
        //     break;
        case "agent":
            await loadAgents()
            break;
        case "agent_edit":
            await editAgent(viewParams.get("id"))
            break;
        case "advertisement_map":
            let advertisement_id = viewParams.get("id")
            sendSearchData('map', false, advertisement_id)
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

function loginRequiredView(viewName) {
    return loginRequiredViews.includes(viewName);
}

function payWalledView(viewName) {
    return payWalledViews.includes(viewName);
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
