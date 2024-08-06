import {authFetch} from "../auth/auth.js";
import {showView} from "../views/viewManager.js";
import {displayErrorMessage} from "../utils.js";
import {updateJWT} from "../login/login.js";

export function setupRegisterView() {
    const registerForm = document.getElementById('registerForm');

    document.getElementById('registerForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(registerForm);
        const userData = {
            email: formData.get('email'),
            password: formData.get('password'),
            full_name: formData.get('full_name'),
            phone_number: formData.get('phone_number')
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
            // alert('User registered successfully'); // Consider updating this to a more user-friendly message display as well
            registerForm.reset();
            showView('home');
        }
        else {
            const errorResponse = await response.json(); // Parse the error response
            const errorMessages = errorResponse.detail.map(error => error.msg.replace('Value error, ', '')).join('\n');
            displayErrorMessage(errorMessages, 8000);
        }
    });
}