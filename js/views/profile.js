
export function setupProfileView() {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
        const payload = jwt.split('.')[1]; // Get the payload part of the JWT
        const decodedPayload = atob(payload); // Base64 decode
        const payloadObj = JSON.parse(decodedPayload); // Parse the JSON string

        if (payloadObj.username) {
            document.getElementById('username-profile').textContent = payloadObj.username;
        }
        if (payloadObj.full_name) {
            document.getElementById('navbar-name').textContent = payloadObj.full_name;
            document.getElementById('fullName-profile').textContent = payloadObj.full_name;
        }
        if (payloadObj.email) {
            document.getElementById('email-profile').textContent = payloadObj.email;
        }
    }
}
