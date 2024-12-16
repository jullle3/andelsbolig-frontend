import {updateStripePaymentElements} from "./login/login.js";
import {authFetch} from "./auth/auth.js";
import {displayAdvertisements} from "./advertisement_list/advertisement_list.js";


export function displayErrorMessage(message, ms = 5000) {
    let errorContainer = document.getElementById('error-container');
    let errorMessage = document.getElementById('error-message');
    errorMessage.innerHTML = message.replace(/\n/g, '<br>');

    errorContainer.style.display = 'block';
    errorContainer.classList.add('show');

    // Clear any existing timeout to avoid multiple timeouts running simultaneously
    if (errorContainer.timeoutId) {
        clearTimeout(errorContainer.timeoutId);
    }

    // Set a new timeout to hide the error message after X seconds
    errorContainer.timeoutId = setTimeout(() => hideErrorMessage(), ms);
}


export function hideErrorMessage() {
    let errorContainer = document.getElementById('error-container');
    if (errorContainer) {
        errorContainer.classList.remove('show');
        setTimeout(() => {
            errorContainer.style.display = 'none';
        }, 500); // Delay to allow for fade transition
    }
}

export function displaySuccessMessage(message, ms = 5000) {
    let successContainer = document.getElementById('success-container');
    let successMessage = document.getElementById('success-message');
    successMessage.innerHTML = message.replace(/\n/g, '<br>');

    successContainer.style.display = 'block';
    successContainer.classList.add('show');

    // Clear any existing timeout to avoid multiple timeouts running simultaneously
    if (successContainer.timeoutId) {
        clearTimeout(successContainer.timeoutId);
    }

    // Set a new timeout to hide the success message after X seconds
    successContainer.timeoutId = setTimeout(() => hideSuccessMessage(), ms);
}

export function hideSuccessMessage() {
    let errorContainer = document.getElementById('success-container');
    if (errorContainer) {
        errorContainer.classList.remove('show');
        setTimeout(() => {
            errorContainer.style.display = 'none';
        }, 500); // Delay to allow for fade transition
    }
}


export function decodeJwt() {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
        return null; // or handle the missing JWT case as needed
    }
    const base64Url = jwt.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


export function setupUtils() {
    updateStripePaymentElements();
    document.getElementById('error-message-remove').addEventListener('click', hideErrorMessage);
}

function formatNumber(input) {
    let cursorPosition = input.selectionStart;  // Save the cursor position
    const originalLength = input.value.length;  // Save the original length of the string

    let with_dots = input.value;
    input.value = with_dots.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Adjust cursor position after formatting
    const newLength = input.value.length;
    cursorPosition = cursorPosition - (originalLength - newLength);

    input.setSelectionRange(cursorPosition, cursorPosition);
}


// Clean the params for an HTTP request removing any empty or whitespace-only values
export function cleanParams(params) {
    return Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v && v.trim() !== '')
    );
}

export function removeDots(inputString) {
    return inputString.replace(/\./g, '');
}

export async function fetchAndDisplayAdvertisements(searchTerm = "") {
    // Fetch the advertisements
    const response = await authFetch('/advertisement?text=' + searchTerm);
    displayAdvertisements(await response.json());
}

export function parseFormattedInteger(value) {
    // Helper function to convert formatted string with delimiters to integer
    return parseInt(value.replace(/\./g, ''), 10);
}


window.formatNumber = formatNumber;
