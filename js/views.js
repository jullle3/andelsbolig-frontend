// Setup click events for all views

const views = {
    home: document.getElementById('home-view'),
    detail: document.getElementById('detail-view'),
    login: document.getElementById('login-view'),
    create: document.getElementById('create-view'),
    register: document.getElementById('register-view'),
    profile: document.getElementById('profile-view'),
    '404': document.getElementById('404-view')
};

export function showView(view) {
    Object.values(views).forEach(v => v.style.display = 'none');
    views[view].style.display = 'block';
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
