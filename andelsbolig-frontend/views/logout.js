import {showView} from "./viewManager.js";

export function setupLogoutView() {
    document.getElementById("logoutLink").addEventListener('click', (event) => {
        event.preventDefault(); // Prevent the default link behavior
        // Clear JWT from localStorage
        localStorage.removeItem('jwt');
        showView('home');
    });
}
