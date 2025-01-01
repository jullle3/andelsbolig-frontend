import { authFetch } from "../auth/auth.js";
import {
    cleanParams,
    displayErrorMessage,
    displaySuccessMessage,
    parseFormattedInteger,
    removeDots,
    showConfirmationModal
} from "../utils.js";
import {loadAgents} from "../agent/agent.js";


// The agent currently being edited
export let activeAgent = {
    _id: null,
    created: null,
    updated: null,
    created_by: null,
    notifications: null,
    active: null,
    criteria: null,
}


export async function SetupAgentEditView() {
    document.getElementById('back-arrow-edit-view').addEventListener('click', () => {
        window.history.back();
    });

    document.getElementById('editAnnonceagentBtn').addEventListener('click', async () => {
        try {
            // Get the match count from the backend
            const count = await getAnnonceagentMatchCount();

            return
            // Show confirmation modal
            showConfirmationModal(
                'Rediger Annonceagent',
                `Din Annonceagent matcher ${count} boliger, vil du oprette den?`,
                () => updateAnnonceagent(),
                "action-button btn-primary"
            );
        } catch (error) {
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


export function updateAnnonceagent() {
    const cityInput = $("#city-agenteditview").val();
    const postalNumber = $("#postal-number-agenteditview").val();
    const priceRange = $("#price-range-slider-agenteditview")[0].noUiSlider.get();
    const squareMetersRange = $("#square-meters-range-slider-agenteditview")[0].noUiSlider.get();
    const roomsRange = $("#rooms-range-slider-agenteditview")[0].noUiSlider.get();

    const priceFrom = parseFormattedInteger(priceRange[0]);
    const priceTo = parseFormattedInteger(priceRange[1]);
    const squareMetersFrom = parseFormattedInteger(squareMetersRange[0]);
    const squareMetersTo = parseFormattedInteger(squareMetersRange[1]);
    const roomsFrom = parseFormattedInteger(roomsRange[0]);
    const roomsTo = parseFormattedInteger(roomsRange[1]);

    // Construct the criteria object according to the backend model
    const criteria = {
        price_from: isNaN(priceFrom) ? null : priceFrom,
        price_to: isNaN(priceTo) ? null : priceTo,
        rooms_from: isNaN(roomsFrom) ? null : roomsFrom,
        rooms_to: isNaN(roomsTo) ? null : roomsTo,
        square_meters_from: isNaN(squareMetersFrom) ? null : squareMetersFrom,
        square_meters_to: isNaN(squareMetersTo) ? null : squareMetersTo,
        cities: cityInput ? [cityInput] : null,
        postal_numbers: postalNumber ? [postalNumber] : null,
        // Add features or max_distance_km if you have them from other inputs
        features: null,
        max_distance_km: null
    };

    // Construct the overall agent data
    const agentData = {
        _id: activeAgent._id,
        created: activeAgent.created,
        updated: activeAgent.updated,
        created_by: activeAgent.created_by,
        notifications: activeAgent.notifications,
        active: activeAgent.active,
        criteria: criteria,
    };

    authFetch("/agent", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(agentData)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    displayErrorMessage("Der opstod en fejl");
                    throw new Error(err.detail || "Unknown error occurred");
                });
            }
            return response.json();
        })
        .then(data => {
            displaySuccessMessage("Annonceagent opdateret");
            loadAgents()
            showView('agent')

        })
        .catch(error => {
            displayErrorMessage("Der opstod en fejl");
        });
}


