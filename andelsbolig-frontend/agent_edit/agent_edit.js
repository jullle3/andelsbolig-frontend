import { authFetch } from "../auth/auth.js";
import {displayErrorMessage, showConfirmationModal} from "../utils.js";

export async function SetupAgentEditView() {
    const backArrowButton = document.getElementById('back-arrow');

    if (backArrowButton) {
        backArrowButton.addEventListener('click', () => {
            // Go back to the previous history state
            window.history.back();
        });
    }
}
