import {updateStripePaymentElements} from "./views/login.js";

export function displayErrorMessage(message) {
    let errorContainer = document.getElementById('error-container');
    console.log(errorContainer)
    errorContainer.classList.add('show');
    errorContainer.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

    // Automatically hide the error message after 5 seconds
    setTimeout(() => {
        if (errorContainer) {
            errorContainer.classList.remove('show');
            setTimeout(() => {
            }, 500); // Wait for the fade-out transition to complete
        }
    }, 6000);
}

export function decodeJwt() {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
        return null; // or handle the missing JWT case as needed
    }
    const base64Url = jwt.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


export function setupUtils() {
    updateStripePaymentElements();
}

