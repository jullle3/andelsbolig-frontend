import {loadAgentView} from "../agent/agent.js";

// Setup click events for all views
const views = {
    advertisement_list: document.getElementById('advertisement_list-view'),
    detail: document.getElementById('detail-view'),
    login: document.getElementById('login-view'),
    create: document.getElementById('create-view'),
    agent: document.getElementById('agent-view'),
    agent_create: document.getElementById('agent-create-view'),
    agent_edit: document.getElementById('agent-edit-view'),
    register: document.getElementById('register-view'),
    profile: document.getElementById('profile-view'),
    seller_profile: document.getElementById('seller-profile-view'),
    // payment1: document.getElementById('payment-view1'),
    payment2: document.getElementById('payment-view2'),
    faq: document.getElementById('faq-view'),
    map: document.getElementById('map-view'),
};

let currentView = 'advertisement_list'; // Track the current view


export function showView(view) {
    if (!views[view]) {
        console.error(`Invalid view: "${view}". Defaulting to 'advertisement_list'.`);
        view = 'advertisement_list'; // Fallback to a default view
    }

    // Hide all views
    Object.values(views).forEach(v => {
        v.classList.remove('active');
        v.style.display = 'none';
    });

    // Show the target view
    views[view].style.display = 'block';
    setTimeout(() => {
        views[view].classList.add('active');
    }, 10); // Delay to ensure the display change is processed

    // Close the navbar when a new view is shown
    closeNavbar();

    currentView = view; // Update the current view

    // Push the new state to the history stack
    history.pushState({ view: view }, '', `#${view}`);
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
                showView(viewName); // Call the function to update the view
            }
        });
    });
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


window.showView = showView;
