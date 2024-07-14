import {authFetch} from "../auth.js";
import {showView} from "../views.js";

export function setupRegisterView() {
    const registerForm = document.getElementById('registerForm');

    document.getElementById('registerForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(registerForm);
        console.log(formData);
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
            localStorage.setItem('jwt', result.jwt);
            alert('User registered successfully'); // Consider updating this to a more user-friendly message display as well
            registerForm.reset();
            showView('home');
        }
        else {
            const errorResponse = await response.json(); // Parse the error response
            const errorMessage = errorResponse.detail || 'Failed to register user';
            const errorElement = document.getElementById('error-message');
            errorElement.textContent = errorMessage; // Set the error message
            errorElement.classList.remove('d-none', 'fade-out'); // Make sure the error message is visible and reset fade-out

            // Wait for 4 seconds before starting the fade out
            setTimeout(() => {
                errorElement.classList.add('fade-out');

                // Wait for the fade-out transition to end before hiding the element
                errorElement.addEventListener('transitionend', () => {
                    errorElement.classList.add('d-none'); // Hide the element after fade-out
                    errorElement.classList.remove('fade-out'); // Reset for next time
                }, { once: true }); // Ensure the event listener is removed after it fires
            }, 4000);
        }
    });
}