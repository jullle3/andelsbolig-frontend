import {updateStripePaymentElements} from "./login/login.js";
import {authFetch} from "./auth/auth.js";
import {displayLoginModal} from "./views/viewManager.js";

export let currentUser = null;


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

    // Start the fade-out effect after ms-1000 milliseconds to allow for 1 second of fade effect
    errorContainer.timeoutId = setTimeout(() => {
        errorContainer.classList.add('fade-out');
        // Finally, hide the message completely
        setTimeout(() => hideErrorMessage(), 1000);
    }, ms - 1000);
}

export function displaySuccessMessage(message, ms = 5000) {
    const animation = document.getElementById("success-animation");
    // Reset animation
    animation.stop();

    let successContainer = document.getElementById('success-container');
    let successMessage = document.getElementById('success-message');

    successMessage.innerHTML = message.replace(/\n/g, '<br>');
    successContainer.style.display = 'block';
    successContainer.classList.add('show');
    animation.play();

    if (successContainer.timeoutId) {
        clearTimeout(successContainer.timeoutId);
    }

    successContainer.timeoutId = setTimeout(() => {
        successContainer.classList.add('fade-out');
        setTimeout(() => hideSuccessMessage(), 1000);
    }, ms - 1000);
}

function hideErrorMessage() {
    let errorContainer = document.getElementById('error-container');
    errorContainer.style.display = 'none';
    errorContainer.classList.remove('show', 'fade-out');
}

export function hideSuccessMessage() {
    let successContainer = document.getElementById('success-container');
    successContainer.style.display = 'none';
    successContainer.classList.remove('show', 'fade-out');
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


export function parseFormattedInteger(value) {
    // Helper function to convert formatted string with delimiters to integer
    return parseInt(value.replace(/\./g, ''), 10);
}



export function showConfirmationModal(title, message, onConfirm, confirmButtonClass = "btn-danger") {
    // Update the modal title & body text
    $('#genericConfirmationModalLabel').text(title);
    $('#genericConfirmationModal .modal-body').text(message);

    // Update the confirm button styling and text
    const $confirmButton = $('#confirmActionButton');
    // Remove any previous color classes you might have added
    $confirmButton.removeClass('btn-danger btn-primary btn-success btn-warning action-button');
    // Add the new (or default) class
    $confirmButton.addClass(confirmButtonClass);

    // Remove old click handlers; add the new confirm callback
    $confirmButton.off('click').on('click', function() {
        onConfirm();
        $('#genericConfirmationModal').modal('hide');
    });

    // Show the modal
    $('#genericConfirmationModal').modal('show');
}

export function isLoggedIn() {
    return localStorage.getItem('jwt') !== null;
}

/**
 *
 * @returns {boolean} True if the user is still subscribed, false otherwise.
 */
export async function isSubscribed() {
    let response = await authFetch("/is-subscribed")
    return response.ok
}

// Load and store info about the logged-in user
export async function loadUser() {
    if (!isLoggedIn()) {
        return
    }

    const jwt = decodeJwt()
    const response = await authFetch(`/user/${jwt.sub}`);

    if (!response.ok) {
        let body = await response.json()
        displayErrorMessage(body.detail);
        return;
    }
    currentUser = await response.json()
}

export function resetCurrentUser(){
    currentUser = null;
}

// Called when user clicks "favorite" icon on an advertisement, the to either favorite or unfavorite then depends on the isFavorited param
export async function favoriteAdvertisement(id_to_update, advertisementId) {
    if (currentUser === null) {
        displayLoginModal(null, null)
        return;
    }

    const isFavorited = currentUser.favorite_advertisements.includes(advertisementId);

    // Update "favorite" icon for advertisement
    const iconElement = document.querySelector(`.favorite-icon[${id_to_update}="${advertisementId}"] i`);
    if (!iconElement) {
        console.warn(`Favorite icon for advertisement ${advertisementId} not found.`);
        return;
    }

    // Determine the operation: if currently favorited, we want to remove it, otherwise add it.
    const addOperation = !isFavorited;

    if (addOperation) {
        // Added to favorites
        currentUser.favorite_advertisements.push(advertisementId);
        iconElement.classList.remove("bi-heart");
        iconElement.classList.add("bi-heart-fill", "text-danger");
    } else {
        // Removed from favorites
        currentUser.favorite_advertisements = currentUser.favorite_advertisements.filter(item => item !== advertisementId);
        iconElement.classList.remove("bi-heart-fill", "text-danger");
        iconElement.classList.add("bi-heart");
    }

    // Query the backend to update the user's favorites
    const response = await authFetch('/user', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            favorite_advertisement: advertisementId,
            favorite_advertisement_add_operation: addOperation
        })
    });

    if (!response.ok) {
        displayErrorMessage("Noget gik galt");
    }
}

/**
 * Opens the given URL in a new browser tab or window in a way
 * that works reliably across desktop and mobile (iOS) browsers.
 *
 * Why this approach?
 * 1. Mobile Safari (and many WebViews) will block pop‑ups that are not
 *    initiated by a direct user gesture. Creating and “clicking” an
 *    <a> tag in the same event handler satisfies that requirement.
 * 2. Using an anchor with `target="_blank"` ensures the new page
 *    opens separately, and `rel="noopener noreferrer"` prevents
 *    the new tab from gaining access to your page via `window.opener`.
 *
 * @param {string} url
 *   The destination URL to open. Must be a fully qualified URL
 *   (including protocol), e.g. "https://home.dk/sag/6110007062".
 */
export function openInNewTab(url) {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    // Must be inserted into the DOM for the click to work in some browsers
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}


window.formatNumber = formatNumber;
window.hideSuccessMessage = hideSuccessMessage;
window.hideErrorMessage = hideErrorMessage;
window.favoriteAdvertisement = favoriteAdvertisement;