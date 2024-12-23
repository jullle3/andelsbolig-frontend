import { authFetch } from "../auth/auth.js";
import {cleanParams, displayErrorMessage, removeDots, showConfirmationModal} from "../utils.js";
import {createAnnonceagent, displayAdvertisements} from "../advertisement_list/advertisement_list.js";

export async function SetupAgentEditView() {
    document.getElementById('back-arrow').addEventListener('click', () => {
        window.history.back();
    });

    document.getElementById('createAnnonceagentBtn').addEventListener('click', async () => {
        try {
            // Get the match count from the backend
            const count = await getAnnonceagentMatchCount();

            // Show confirmation modal
            showConfirmationModal(
                'Opret Annonceagent',
                `Din Annonceagent matcher ${count} boliger, vil du oprette den?`,
                () => createAnnonceagent(crypto.randomUUID()),
                "action-button btn-primary"
            );
        } catch (error) {
            console.error('Error getting match count:', error);
            alert('Noget gik galt, prøv igen senere.');
        }
    });
}



async function getAnnonceagentMatchCount() {
    // Construct the query parameters
    const params = new URLSearchParams(cleanParams({
        text: document.getElementById('advertisement-list-search-agenteditview').value,
        price_from: removeDots(document.getElementById('price-range-slider-agenteditview').noUiSlider.get()[0]),
        price_to: removeDots(document.getElementById('price-range-slider-agenteditview').noUiSlider.get()[1]),
        monthly_fee_from: removeDots(document.getElementById('monthly-fee-range-slider-agenteditview').noUiSlider.get()[0]),
        monthly_fee_to: removeDots(document.getElementById('monthly-fee-range-slider-agenteditview').noUiSlider.get()[1]),
        square_meter_from: document.getElementById('square-meters-range-slider-agenteditview').noUiSlider.get()[0],
        square_meter_to: document.getElementById('square-meters-range-slider-agenteditview').noUiSlider.get()[1],
        rooms_from: document.getElementById('rooms-range-slider-agenteditview').noUiSlider.get()[0],
        rooms_to: document.getElementById('rooms-range-slider-agenteditview').noUiSlider.get()[1],
        postal_number: $("#postal-number-agenteditview").val(),
        city: $("#city-agenteditview").val(),
        count_only: 'true'
    })).toString();

    // Perform the fetch using await
    const response = await authFetch('/advertisement?' + params);
    if (!response.ok) {
        displayErrorMessage("Noget gik galt");
        throw new Error("Failed to get match count");
    }

    // Parse response, then return the total count
    const data = await response.json();
    return data.total_object_count;
}

