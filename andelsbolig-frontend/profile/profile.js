import {authFetch} from "../auth/auth.js";
import {displayErrorMessage} from "../utils.js";

export function setupProfileView() {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
        const payload = jwt.split('.')[1]; // Get the payload part of the JWT
        const decodedPayload = atob(payload); // Base64 decode
        const payloadObj = JSON.parse(decodedPayload); // Parse the JSON string

        document.getElementById('navbar-name').textContent = payloadObj.full_name;
        document.getElementById('fullName-profile').value = payloadObj.full_name;
        document.getElementById('email-profile').value = payloadObj.email;
        // Det er hacky, men nedenstående må ikke ændres uden at der også laves ændringer i backend.
        document.getElementById('email_notifications').checked = payloadObj.email_notifications;
        document.getElementById('sms_notifications').checked = payloadObj.sms_notifications;
    }


    $('.profile-patch-operation').change(async function () {
        const settingName = this.id;  // e.g., 'email-notifications' or 'sms-notifications'
        const settingValue = $(this).is(':checked');  // true if checked (on), false if not (off)

        const response = await authFetch('/user', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({[settingName]: settingValue})
        })

        if (!response.ok) {
            displayErrorMessage("Noget gik galt");
            return;
        }
    })
}
