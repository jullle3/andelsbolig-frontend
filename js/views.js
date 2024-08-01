// Setup click events for all views
const views = {
    home: document.getElementById('home-view'),
    detail: document.getElementById('detail-view'),
    login: document.getElementById('login-view'),
    create: document.getElementById('create-view'),
    register: document.getElementById('register-view'),
    profile: document.getElementById('profile-view'),
    // payment1: document.getElementById('payment-view1'),
    payment2: document.getElementById('payment-view2'),
    '404': document.getElementById('404-view')
};

export function showView(view) {
    Object.values(views).forEach(v => {
        v.classList.remove('active');
        v.style.display = 'none';
    });
    views[view].style.display = 'block';
    setTimeout(() => {
        views[view].classList.add('active');
    }, 10); // Delay to ensure the display change is processed
    closeNavbar(); // Close the navbar when a new view is shown
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
            showView(viewName); // Call the function to update the view
        });
    });
}

function closeNavbar() {
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (navbarCollapse.classList.contains('show')) {
        navbarCollapse.classList.remove('show');
    }
}