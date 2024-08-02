import {authFetch} from "../auth.js";
import {showView} from "./viewManager.js";
import {displayErrorMessage} from "../utils.js";
import {updateJWT} from "./login.js";

export function setupRegisterView() {
    const registerForm = document.getElementById('registerForm');

    document.getElementById('registerForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(registerForm);
        const userData = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
            full_name: formData.get('full_name') || null, // Handle optional fields
            phone_number: formData.get('phone_number') || null
        };

        const response = await authFetch('user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            const result = await response.json();
            updateJWT(result.jwt);
            alert('User registered successfully'); // Consider updating this to a more user-friendly message display as well
            registerForm.reset();
            showView('home');
        }
        else {
            const errorResponse = await response.json(); // Parse the error response
            const errorMessage = errorResponse.detail || 'Failed to register user';
            displayErrorMessage(errorMessage);
        }
    });
}