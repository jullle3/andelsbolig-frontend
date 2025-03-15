import {authFetch} from "../auth/auth.js";
import {resetViewAfterLogin, showView, viewAfterLogin} from "../views/viewManager.js";
import {decodeJwt, displayErrorMessage, displaySuccessMessage, loadUser} from "../utils.js";
import {setupProfileView} from "../profile/profile.js";
import {updateNavbar} from "../header/header.js";

export function setupLoginView() {
    // Add event listener to toggle password visibility for all password
    const passwordInputs = document.querySelectorAll('input[type="password"]');

    passwordInputs.forEach(input => {
        const toggleIcon = document.createElement('span');
        toggleIcon.classList.add('input-group-text', 'toggle-password');
        toggleIcon.innerHTML = '<i class="bi bi-eye-slash"></i>';

        input.parentNode.insertBefore(toggleIcon, input.nextSibling);

        toggleIcon.addEventListener('click', function() {
            const passwordIcon = this.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                passwordIcon.classList.remove('bi-eye-slash');
                passwordIcon.classList.add('bi-eye');
            } else {
                input.type = 'password';
                passwordIcon.classList.remove('bi-eye');
                passwordIcon.classList.add('bi-eye-slash');
            }
        });
    });

    document.getElementById('loginModalSubmit').addEventListener('click', async () => {
        const email = document.getElementById('modal-login-email').value;
        const password = document.getElementById('modal-login-password').value;

        handleLogin(email, password);
    });


    document.getElementById('modalRegisterForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const userData = {
            email : document.getElementById('modal-register-email').value,
            password : document.getElementById('modal-register-password').value,
            full_name : document.getElementById('modal-register-fullname').value,
        };

        // Optional param
        const phone = document.getElementById('modal-register-phone').value.trim();
        if (phone) userData.phone_number = phone;

        const response = await authFetch('/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        const response_json = await response.json();

        if (!response.ok) {
            displayErrorMessage(response_json.detail)
            return
        }

        updateAfterLogin(response_json.jwt, "registerModal")
    });


    // Smooth transition from login to register modal
    document.getElementById('showRegisterModalLink').addEventListener('click', (e) => {
        e.preventDefault();

        const loginModalEl = document.getElementById('loginModal');
        const registerModalEl = document.getElementById('registerModal');

        const loginModal = bootstrap.Modal.getInstance(loginModalEl) || new bootstrap.Modal(loginModalEl);
        const registerModal = new bootstrap.Modal(registerModalEl);

        // Hide login modal first
        loginModalEl.addEventListener('hidden.bs.modal', function onHidden() {
            loginModalEl.removeEventListener('hidden.bs.modal', onHidden);
            registerModal.show();
        });

        loginModalEl.addEventListener('shown.bs.modal', () => loginModal.hide(), {once: true});
        loginModal.hide();
        registerModal.show();
    });
}

async function handleLogin(email, password) {
    const response = await authFetch('/login', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    if (response.ok) {
        const result = await response.json();
        updateAfterLogin(result.jwt, "loginModal")
        displaySuccessMessage("Du er nu logget ind")
    } else {
        displayErrorMessage('Login mislykkedes. Tjek dine oplysninger.');
    }
}


// Updates that are to be ran after user logged in
export async function updateAfterLogin(jwt, modalToHideID) {
    updateJWT(jwt);
    setupProfileView();
    updateNavbar()
    loadUser()

    // Close the modal after successful login
    bootstrap.Modal.getInstance(document.getElementById(modalToHideID)).hide();

    if (viewAfterLogin === null) {
        return
    }

    // Important that this awaits, since the values reset in resetViewAfterLogin() are used in showView()
    await showView(viewAfterLogin);
    resetViewAfterLogin();
}


export function updateJWT(jwt) {
    localStorage.setItem('jwt', jwt);
    updateStripePaymentElements();
}

export function updateStripePaymentElements() {
    // Connect stripe HTML elements to the user's client reference id. This ensures that the user's payment is correctly associated with their account.
    const decodedJwt = decodeJwt();
    if (decodedJwt) {
        document.getElementById('stripePricingTable').setAttribute('client-reference-id', decodedJwt.sub);
    }
}