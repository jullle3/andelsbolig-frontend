import {authFetch} from "../auth/auth.js";
import {displayErrorMessage} from "../utils.js";
import {showView} from "../views/viewManager.js";

export async function loadSellerProfileView(profile_id) {

    const response = await authFetch(`/user/${profile_id}`);
    if (!response.ok) {
        let body = await response.json()
        displayErrorMessage(body.detail);
        return;
    }

    const seller_profile = await response.json();
    console.log(seller_profile)

    document.getElementById('seller-fullNameNavbar-profile').textContent = seller_profile.full_name;
    document.getElementById('seller-email-profile').value = seller_profile.email;
    document.getElementById('seller-phone-profile').value = seller_profile.phone_number;

    showView('seller_profile');
}


window.loadSellerProfileView = loadSellerProfileView;
