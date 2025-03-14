import {showView} from "../views/viewManager.js";
import {updateNavbar} from "../header/header.js";
import {resetCurrentUser} from "../utils.js";

export function setupLogoutView() {
    document.getElementById("logout").addEventListener('click', (event) => {
        // event.preventDefault(); // Prevent the default link behavior
        // Clear JWT from localStorage
        localStorage.removeItem('jwt');
        resetCurrentUser()

        // Clean the users information from the website
        document.getElementById('navbar-name').textContent = 'Hej! Log ind her';
        document.getElementById('fullName-profile').value = '';
        document.getElementById('email-profile').value = '';
        updateNavbar()
        showView('advertisement_list');
    });
}
