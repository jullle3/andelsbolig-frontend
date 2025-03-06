import {authFetch} from "../auth/auth.js";
import {showView, viewAfterLogin} from "../views/viewManager.js";
import {decodeJwt, displayErrorMessage} from "../utils.js";
import {setupProfileView} from "../profile/profile.js";

export function setupLoginView() {
    const loginForm = document.getElementById('loginForm');

    document.getElementById('loginForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(loginForm);
        const userData = {
            email: formData.get('email'),
            password: formData.get('password'),
        };

        const response = await authFetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            const result = await response.json();
            updateJWT(result.jwt);
            // alert('User login success');
            loginForm.reset();
            showView('advertisement_list');
            // To update the website with the user's information
            setupProfileView();

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



    // TODO This should replace existing login
    // Login modal
    document.getElementById('loginModalSubmit').addEventListener('click', async () => {
        const email = document.getElementById('modal-login-email').value;
        const password = document.getElementById('modal-login-password').value;

        handleLogin(email, password);
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
        updateJWT(result.jwt);
        setupProfileView();
        $('#loginModal').modal('hide');
        if (viewAfterLogin) {
            showView(viewAfterLogin);
            viewAfterLogin = null;
        } else {
            showView('advertisement_list');
        }
    } else {
        displayErrorMessage('Login mislykkedes. Tjek dine oplysninger.');
    }
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