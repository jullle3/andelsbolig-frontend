import {authFetch} from "../auth.js";
import {showView} from "../views.js";
import {displayErrorMessage} from "../utils.js";

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
            localStorage.setItem('jwt', result.jwt);
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
}