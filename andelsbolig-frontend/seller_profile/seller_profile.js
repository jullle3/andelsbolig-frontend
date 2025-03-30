import {authFetch} from "../auth/auth.js";
import {displayErrorMessage} from "../utils.js";

export async function loadSellerProfile(profile_id) {
    const response = await authFetch(`/user/${profile_id}`);
    if (!response.ok) {
        let body = await response.json()
        displayErrorMessage(body.detail);
        return;
    }

    const seller_profile = await response.json();
    document.getElementById('seller-fullNameNavbar-profile').textContent = seller_profile.full_name;
    document.getElementById('seller-email-profile').value = seller_profile.email;
    document.getElementById('seller-phone-profile').value = seller_profile.phone_number;
}