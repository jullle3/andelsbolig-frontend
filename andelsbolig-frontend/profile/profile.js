
export function setupProfileView() {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
        const payload = jwt.split('.')[1]; // Get the payload part of the JWT
        const decodedPayload = atob(payload); // Base64 decode
        const payloadObj = JSON.parse(decodedPayload); // Parse the JSON string

        document.getElementById('navbar-name').textContent = payloadObj.full_name;
        document.getElementById('fullName-profile').value = payloadObj.full_name;
        document.getElementById('email-profile').value = payloadObj.email;
    }
}