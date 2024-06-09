document.addEventListener('DOMContentLoaded', () => {
    // Insert header and footer
    insertHeader();
    insertFooter();

    const views = {
        home: document.getElementById('home-view'),
        detail: document.getElementById('detail-view'),
        login: document.getElementById('login-view'),
        create: document.getElementById('create-view')
    };

    // Navigation
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const view = e.target.getAttribute('data-view');
            showView(view);
        });
    });

    // Show the specified view
    function showView(view) {
        Object.values(views).forEach(v => v.style.display = 'none');
        views[view].style.display = 'block';
    }

    // Show home view by default
    showView('home');
});
