import {authFetch} from "../auth.js";
import {showView} from "./viewManager.js";
import {decodeJwt, displayErrorMessage} from "../utils.js";

export function setupLoginView() {
    const loginForm = document.getElementById('loginForm');

    document.getElementById('loginForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(loginForm);
        const userData = {
            email: formData.get('email'),
            password: formData.get('password'),
        };

        const response = await authFetch('login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            const result = await response.json();
            updateJWT(result.jwt);
            alert('User login success');
            loginForm.reset();
            showView('home');
        }
        else {
            const errorResponse = await response.json(); // Parse the error response
            const errorMessage = errorResponse.detail || 'Failed to login user';
            displayErrorMessage(errorMessage);
        }
    });


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
}

export function updateJWT(jwt) {
    localStorage.setItem('jwt', jwt);
    updateStripePaymentElements();
    document.getElementById('stripeBuyButton').setAttribute('client-reference-id', jwt.sub);
}

export function updateStripePaymentElements() {
    // Connect stripe HTML elements to the user's client reference id. This ensures that the user's payment is correctly associated with their account.
    const decodedJwt = decodeJwt();
    if (decodedJwt) {
        // document.getElementById('stripeBuyButton').setAttribute('client-reference-id', decodedJwt.sub);
        document.getElementById('stripePricingTable').setAttribute('client-reference-id', decodedJwt.sub);
    }
}