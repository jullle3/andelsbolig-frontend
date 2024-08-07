import {showView} from "../views/viewManager.js";

export function setupLogoutView() {
    document.getElementById("logoutLink").addEventListener('click', (event) => {
        // event.preventDefault(); // Prevent the default link behavior
        // Clear JWT from localStorage
        localStorage.removeItem('jwt');

        // Clean the users information from the website
        document.getElementById('navbar-name').textContent = 'Hej! Log ind her';
        document.getElementById('fullName-profile').value = '';
        document.getElementById('email-profile').value = '';
        showView('home');
    });
}
