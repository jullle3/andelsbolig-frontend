import { authFetch } from "../auth/auth.js";
import {cleanParams, displayErrorMessage, removeDots, showConfirmationModal} from "../utils.js";
import {createAnnonceagent} from "../advertisement_list/advertisement_list.js";

export async function SetupAgentCreateView() {
    document.getElementById('back-arrow-create-view').addEventListener('click', () => {
        window.history.back();
    });

    document.getElementById('createAnnonceagentBtn').addEventListener('click', async () => {
        try {
            const count = await getAnnonceagentMatchCount();
            showConfirmationModal(
                'Opret Annonceagent',
                `Din Annonceagent matcher ${count} boliger, vil du oprette den?`,
                () => createAnnonceagent(crypto.randomUUID(), "agent-create"),
                "action-button btn-primary"
            );
        } catch (error) {
            console.error('Error getting match count:', error);
            alert('Noget gik galt, prøv igen senere.');
        }
    });
}



async function getAnnonceagentMatchCount() {
    // Count number of advertisements that matches a given query

    const params = new URLSearchParams(cleanParams({
        text: document.getElementById('advertisement-list-search-agentcreateview').value,
        price_from: removeDots(document.getElementById('price-range-slider-agentcreateview').noUiSlider.get()[0]),
        price_to: removeDots(document.getElementById('price-range-slider-agentcreateview').noUiSlider.get()[1]),
        monthly_fee_from: removeDots(document.getElementById('monthly-price-range-slider-agentcreateview').noUiSlider.get()[0]),
        monthly_fee_to: removeDots(document.getElementById('monthly-price-range-slider-agentcreateview').noUiSlider.get()[1]),
        square_meter_from: document.getElementById('square-meters-range-slider-agentcreateview').noUiSlider.get()[0],
        square_meter_to: document.getElementById('square-meters-range-slider-agentcreateview').noUiSlider.get()[1],
        rooms_from: document.getElementById('rooms-range-slider-agentcreateview').noUiSlider.get()[0],
        rooms_to: document.getElementById('rooms-range-slider-agentcreateview').noUiSlider.get()[1],
        postal_number: $("#postal-number-agentcreateview").val(),
        city: $("#city-agentcreateview").val(),
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


function generateSharedComponents(viewType) {
    const searchIdSuffix = viewType === "edit" ? "agenteditview" : "agentcreateview";

    return `
        <!-- Text search bar -->
        <div class="container">
            <div class="row justify-content-center">
                <h1 class="pb-4">${viewType === "edit" ? "Rediger din Annonceagent" : "Opret Din Annonceagent"}</h1>
                <div class="col-8 d-flex position-relative" style="min-width: 600px">
                    <div class="input-group w-100 pb-1">
                        <input class="form-control" type="text" id="advertisement-list-search-${searchIdSuffix}" placeholder="Fritekst, vej, by, postnr, kommune eller landsdel" />
                    </div>
                </div>
            </div>

            <!-- Results Counter -->
            <div class="row justify-content-center mt-2">
                <div class="col-12 col-md-auto d-flex justify-content-center">
                    <span class="badge rounded-pill bg-light text-dark border">
                        <span id="search-result-count-${searchIdSuffix}">0</span>
                        <span> Resultater</span>
                    </span>
                </div>
            </div>

            <!-- Advanced Search Fields & Search button -->
            <div class="row justify-content-center mt-3">
                <div class="col-8" style="min-width: 600px">
                    <div class="card card-body">
                        ${generateAdvancedSearchFields(searchIdSuffix)}
                        <button id="${viewType === "edit" ? "editAnnonceagentBtn" : "createAnnonceagentBtn"}" type="button" class="btn action-button w-100 text-white mt-3">
                            ${viewType === "edit" ? "Rediger Annonceagent" : "Opret Annonceagent"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateAdvancedSearchFields(suffix) {
    return `
        <!-- Price -->
        <div class="mt-4 mb-1 p-0 pb-4">
            <div class="row align-items-center">
                <div class="col-4 text-start"><h6 class="mb-0">Pris kr</h6></div>
                <div class="col-8"><div id="price-range-slider-${suffix}" class="slider"></div></div>
            </div>
        </div>
        <!-- Monthly fee -->
        <div class="mt-3 m-0 p-0 pb-4">
            <div class="row align-items-center">
                <div class="col-4 text-start"><h6 class="mb-0">Mdl. ydelse kr</h6></div>
                <div class="col-8"><div id="monthly-price-range-slider-${suffix}" class="slider"></div></div>
            </div>
        </div>
        <!-- Square meters -->
        <div class="mt-3 m-0 p-0 pb-4">
            <div class="row align-items-center">
                <div class="col-4 text-start"><h6 class="mb-0">Størrelse m2</h6></div>
                <div class="col-8"><div id="square-meters-range-slider-${suffix}" class="slider"></div></div>
            </div>
        </div>
        <!-- Rooms -->
        <div class="mt-3 m-0 p-0 pb-4">
            <div class="row align-items-center">
                <div class="col-4 text-start"><h6 class="mb-0">Værelser</h6></div>
                <div class="col-8"><div id="rooms-range-slider-${suffix}" class="slider"></div></div>
            </div>
        </div>
        <!-- Postal Number -->
        <div class="m-0 p-0 pb-4">
            <div class="row align-items-center">
                <div class="col-4 text-start"><h6 class="mb-0">Postnr</h6></div>
                <div class="col-8">
                    <input type="text" id="postal-number-${suffix}" class="form-control" placeholder="Indtast postnummer" />
                </div>
            </div>
        </div>
        <!-- City -->
        <div class="m-0 p-0 pb-4">
            <div class="row align-items-center">
                <div class="col-4 text-start"><h6 class="mb-0">By</h6></div>
                <div class="col-8">
                    <input type="text" id="city-${suffix}" class="form-control" placeholder="Indtast by" />
                </div>
            </div>
        </div>

        <!-- Name -->
        <div class="m-0 p-0 pb-4">
            <div class="row align-items-center">
                <div class="col-4 text-start"><h6 class="mb-0">Navn</h6></div>
                <div class="col-8">
                    <input type="text" id="name-${suffix}" class="form-control" placeholder="F.eks. Store boliger i København" />
                </div>
            </div>
        </div>

    `;
}


export function insertSharedComponents() {
    document.querySelectorAll('.view[data-agent-type]').forEach(view => {
        const agentType = view.getAttribute('data-agent-type'); // Retrieve "edit" or "create"
        const container = view.querySelector('.shared-components-container');
        if (!container) return;

        container.innerHTML = generateSharedComponents(agentType);

        // Attach specific event listeners
        // const buttonId = viewType === 'edit' ? 'editAnnonceagentBtn' : 'createAnnonceagentBtn';
        // document.getElementById(buttonId).addEventListener('click', event => {
        //     event.stopPropagation();
        //     if (viewType === 'edit') {
        //         console.log('Edit agent logic goes here');
        //     } else if (viewType === 'create') {
        //         console.log('Create agent logic goes here');
        //     }
        // });
    });
}
