import {authFetch} from "../auth/auth.js";
import {cityData, postalData} from "../config/hardcoded_data.js";
import {
    displayErrorMessage,
    cleanParams,
    removeDots,
    parseFormattedInteger, displaySuccessMessage, currentUser, favoriteAdvertisement, decodeJwt
} from "../utils.js";
import {loadAgents} from "../agent/agent.js";
import {showView} from "../views/viewManager.js";
import {displayAdvertisementsOnMap} from "../advertisement_map/advertisement_map.js";
import {basePath} from "../config/config.js";


let page = 0;
let size = 20;


export function setupAdvertisementListView() {
    // Debounce function to delay the search
    function debounce(func, delay) {
        let debounceTimeout;
        return function (...args) {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Add debounce to search input
    document.getElementById('advertisement-list-search-list').addEventListener('input', debounce(async (e) => {
        sendSearchData('list')
    }, 500));
    document.getElementById('advertisement-list-search-map').addEventListener('input', debounce(async (e) => {
        sendSearchData('map')
    }, 500));


    setupPriceSliders()
    setupMonthlyFeeSliders()
    setupSquareMetersSliders()
    setupRoomsSliders()
    setupAllAutoCompletes()
}


export async function sendSearchData(advertisementView, append = false) {
    // TODO Map view might not scale to 10_000 advertisements
    // Pagination is only really implemented for list view
    if (advertisementView === 'list') {
        size = 20
        if (append) {
            page += 1;
        } else {
            page = 0
        }
    } else if (advertisementView === 'map') {
        page = 0
        size = 10_000
    }

    let sortValue = "";
    if (advertisementView === 'list') {
        const sortSelect = document.getElementById(`sort-options-${advertisementView}`);
        sortValue = sortSelect.value;
    }

    // Extract values and construct the query parameters
    const params = new URLSearchParams(cleanParams({
        text: document.getElementById(`advertisement-list-search-${advertisementView}`).value,
        price_from: removeDots(document.getElementById(`price-range-slider-${advertisementView}`).noUiSlider.get()[0]),
        price_to: removeDots(document.getElementById(`price-range-slider-${advertisementView}`).noUiSlider.get()[1]),
        monthly_fee_from: removeDots(document.getElementById(`monthly-price-range-slider-${advertisementView}`).noUiSlider.get()[0]),
        monthly_fee_to: removeDots(document.getElementById(`monthly-price-range-slider-${advertisementView}`).noUiSlider.get()[1]),
        square_meter_from: document.getElementById(`square-meters-range-slider-${advertisementView}`).noUiSlider.get()[0],
        square_meter_to: document.getElementById(`square-meters-range-slider-${advertisementView}`).noUiSlider.get()[1],
        rooms_from: document.getElementById(`rooms-range-slider-${advertisementView}`).noUiSlider.get()[0],
        rooms_to: document.getElementById(`rooms-range-slider-${advertisementView}`).noUiSlider.get()[1],
        postal_number: $(`#postal-number-${advertisementView}`).val(),
        city: $(`#city-${advertisementView}`).val(),
        radius: $(`#radius-${advertisementView}`).val(),
        favorites_only: document.getElementById(`favorites-only-${advertisementView}`).checked ? "true" : "",
        sort: sortValue,
        page: page.toString(),
        size: size.toString(),
    })).toString();

    let response = await authFetch('/advertisement?' + params)

    if (!response.ok) {
        displayErrorMessage("Noget gik galt");
        return;
    }
    let response_json = await response.json()

    // Update search result counter
    $(`#search-result-count-${advertisementView}`).text(response_json.total_object_count)


    // Load results in either list or map view
    if (advertisementView === 'list') {
        displayAdvertisementsOnList(response_json, append, true);
    } else if (advertisementView === 'map') {
        displayAdvertisementsOnMap(response_json)
    }
}


function setupPriceSliders() {
    // Common configuration for both sliders
    const sliderConfig = {
        start: [0, 10_000_000], // Starting handles
        connect: true,
        range: {
            min: 0,
            max: 10_000_000
        },
        step: 5000,
        format: wNumb({
            decimals: 0,
            thousand: '.'
        }),
        tooltips: true
    };

    const slider1 = document.getElementById('price-range-slider-list');
    noUiSlider.create(slider1, sliderConfig);
    slider1.noUiSlider.on('update', (values) => {
        $('#min-price').text(values[0]);
        $('#max-price').text(values[1]);
    });

    const slider2 = document.getElementById('price-range-slider-map');
    noUiSlider.create(slider2, sliderConfig);
    slider2.noUiSlider.on('update', (values) => {
        $('#min-price').text(values[0]);
        $('#max-price').text(values[1]);
    });

    const slider3 = document.getElementById('price-range-slider-agenteditview');
    noUiSlider.create(slider3, sliderConfig);
    slider3.noUiSlider.on('update', (values) => {
        // TODO: er det et problem at den hedder det samme som slider4
        $('#min-price-edit').text(values[0]);
        $('#max-price-edit').text(values[1]);
    });

    const slider4 = document.getElementById('price-range-slider-agentcreateview');
    noUiSlider.create(slider4, sliderConfig);
    slider4.noUiSlider.on('update', (values) => {
        $('#min-price-edit').text(values[0]);
        $('#max-price-edit').text(values[1]);
    });

}

function setupMonthlyFeeSliders() {
    // Common configuration for both monthly-fee sliders
    const monthlyFeeConfig = {
        start: [0, 40_000],
        connect: true,
        range: {
            min: 0,
            max: 40_000
        },
        step: 100,
        format: wNumb({
            decimals: 0,
            thousand: '.'
        }),
        tooltips: true
    };

    // Main view slider
    const monthlyFeeSliderAdvertisementList = document.getElementById('monthly-price-range-slider-list');
    noUiSlider.create(monthlyFeeSliderAdvertisementList, monthlyFeeConfig);
    monthlyFeeSliderAdvertisementList.noUiSlider.on('update', (values) => {
        $('#min-monthly-fee').text(values[0]);
        $('#max-monthly-fee').text(values[1]);
    });

    const monthlyFeeSliderAdvertisementMap = document.getElementById('monthly-price-range-slider-map');
    noUiSlider.create(monthlyFeeSliderAdvertisementMap, monthlyFeeConfig);
    monthlyFeeSliderAdvertisementMap.noUiSlider.on('update', (values) => {
        $('#min-monthly-fee').text(values[0]);
        $('#max-monthly-fee').text(values[1]);
    });

    // Agent-edit view slider
    const monthlyFeeSliderAgentEdit = document.getElementById('monthly-price-range-slider-agenteditview');
    noUiSlider.create(monthlyFeeSliderAgentEdit, monthlyFeeConfig);
    monthlyFeeSliderAgentEdit.noUiSlider.on('update', (values) => {
        $('#min-monthly-fee-edit').text(values[0]);
        $('#max-monthly-fee-edit').text(values[1]);
    });

    // Agent-edit view slider
    const monthlyFeeSliderAgentCreate = document.getElementById('monthly-price-range-slider-agentcreateview');
    noUiSlider.create(monthlyFeeSliderAgentCreate, monthlyFeeConfig);
    monthlyFeeSliderAgentCreate.noUiSlider.on('update', (values) => {
        $('#min-monthly-fee-edit').text(values[0]);
        $('#max-monthly-fee-edit').text(values[1]);
    });
}

function setupSquareMetersSliders() {
    // Common configuration for both square-meters sliders
    const squareMetersConfig = {
        start: [0, 400],
        connect: true,
        range: {
            min: 0,
            max: 400
        },
        step: 10,
        format: wNumb({
            decimals: 0,
            thousand: '.'
        }),
        tooltips: true
    };

    // Main view slider
    const squareMetersSliderAdvertisementList = document.getElementById('square-meters-range-slider-list');
    noUiSlider.create(squareMetersSliderAdvertisementList, squareMetersConfig);
    squareMetersSliderAdvertisementList.noUiSlider.on('update', (values) => {
        $('#min-square-meters').text(values[0]);
        $('#max-square-meters').text(values[1]);
    });

    const squareMetersSliderAdvertisementMap = document.getElementById('square-meters-range-slider-map');
    noUiSlider.create(squareMetersSliderAdvertisementMap, squareMetersConfig);
    squareMetersSliderAdvertisementMap.noUiSlider.on('update', (values) => {
        $('#min-square-meters').text(values[0]);
        $('#max-square-meters').text(values[1]);
    });

    // Agent-edit view slider
    const squareMetersSliderAgentEdit = document.getElementById('square-meters-range-slider-agenteditview');
    noUiSlider.create(squareMetersSliderAgentEdit, squareMetersConfig);
    squareMetersSliderAgentEdit.noUiSlider.on('update', (values) => {
        $('#min-square-meters-edit').text(values[0]);
        $('#max-square-meters-edit').text(values[1]);
    });

    // Agent-edit view slider
    const squareMetersSliderAgentCreate = document.getElementById('square-meters-range-slider-agentcreateview');
    noUiSlider.create(squareMetersSliderAgentCreate, squareMetersConfig);
    squareMetersSliderAgentCreate.noUiSlider.on('update', (values) => {
        $('#min-square-meters-edit').text(values[0]);
        $('#max-square-meters-edit').text(values[1]);
    });
}

function setupRoomsSliders() {
    // Common configuration for both rooms sliders
    const roomsConfig = {
        start: [1, 10],
        connect: true,
        range: {
            min: 1,
            max: 10
        },
        step: 1,
        format: wNumb({
            decimals: 0,
            thousand: '.'
        }),
        tooltips: true
    };

    // Main view slider
    const roomsSliderAdvertisementList = document.getElementById('rooms-range-slider-list');
    noUiSlider.create(roomsSliderAdvertisementList, roomsConfig);
    roomsSliderAdvertisementList.noUiSlider.on('update', (values) => {
        $('#min-rooms').text(values[0]);
        $('#max-rooms').text(values[1]);
    });

    const roomsSliderAdvertisementMap = document.getElementById('rooms-range-slider-map');
    noUiSlider.create(roomsSliderAdvertisementMap, roomsConfig);
    roomsSliderAdvertisementMap.noUiSlider.on('update', (values) => {
        $('#min-rooms').text(values[0]);
        $('#max-rooms').text(values[1]);
    });

    // Agent-edit view slider
    const roomsSliderAgentEdit = document.getElementById('rooms-range-slider-agenteditview');
    noUiSlider.create(roomsSliderAgentEdit, roomsConfig);
    roomsSliderAgentEdit.noUiSlider.on('update', (values) => {
        $('#min-rooms-edit').text(values[0]);
        $('#max-rooms-edit').text(values[1]);
    });
    // Agent-edit view slider
    const roomsSliderAgentCreate = document.getElementById('rooms-range-slider-agentcreateview');
    noUiSlider.create(roomsSliderAgentCreate, roomsConfig);
    roomsSliderAgentCreate.noUiSlider.on('update', (values) => {
        $('#min-rooms-edit').text(values[0]);
        $('#max-rooms-edit').text(values[1]);
    });
}


function setupCityAutocomplete(suffix, cityData) {
    $("#city" + suffix).autocomplete({
        source: cityData,
        delay: 0,
        minLength: 0,
        select: function (event, ui) {
            console.log(ui.item.value);
            $("#city" + suffix).val(ui.item.value);
        }
    }).focus(function () {
        // Trigger the search to show all entries when the field is focused
        $(this).autocomplete("search", "");
    });
}

function setupPostalAutocomplete(suffix, postalData) {
    // Example: selector could be "#postal-number" or "#postal-number-agenteditview"
    $("#postal-number" + suffix).autocomplete({
        delay: 0,
        minLength: 0,
        source: function (request, response) {
            const matches = $.map(postalData, function (cityName, postalCode) {
                if (postalCode.startsWith(request.term)) {
                    return `${postalCode} - ${cityName}`;
                }
            });
            response(matches);
        },
        select: function (event, ui) {
            // Split the string "postalcode - cityName"
            const parts = ui.item.value.split(" - ");

            // Set the input to the postal code
            $("#postal-number" + suffix).val(parts[0]);
            // Also update the radius div with the postal code
            $("#radius-postalnumber" + suffix).val(parts[0]);

            // Prevent the widget from overwriting the input field value
            return false;
        }
    }).focus(function () {
        // Trigger the search to show all entries when the field is focused
        $(this).autocomplete("search", "");
    });
}


function setupAllAutoCompletes() {
    // Main View
    setupPostalAutocomplete("-list", postalData);
    setupCityAutocomplete("-list", cityData);

    // Map view
    setupPostalAutocomplete("-map", postalData);
    setupCityAutocomplete("-map", cityData);

    // Agent Edit View
    setupPostalAutocomplete("-agenteditview", postalData);
    setupCityAutocomplete("-agenteditview", cityData);

    // Agent Edit View
    setupPostalAutocomplete("-agentcreateview", postalData);
    setupCityAutocomplete("-agentcreateview", cityData);

}


export async function displayAdvertisementsOnList(response, append = false, triggerPopup = false) {
    const advertisements = response.objects;
    const listingsContainer = document.getElementById('listings-container');
    const noResultsContainer = document.getElementById('no-results');

    // Clear previous listings if not appending
    if (!append) listingsContainer.innerHTML = '';

    // Check if advertisements are available
    if (advertisements.length === 0) {
        noResultsContainer.style.display = 'block';
    } else {
        noResultsContainer.style.display = 'none';
        advertisements.forEach(advertisement => {
            // Larger screens have more cols
            listingsContainer.innerHTML += `
            <div class="col-sm-6 col-md-4 col-lg-3 p-sm-3 p-md-3 p-lg-3 p-xl-3 p-xxl-3 pt-4">
                ${generateAdvertisementCard(advertisement, "data-advertisement-id-list")}
            </div>
            `;
        });
    }

    // Display Next Page button only if more results are available
    if (response.total_object_count > listingsContainer.children.length) {
        $("#next-page-button").removeClass('d-none');
    } else {
        $("#next-page-button").addClass('d-none');
    }

    // TODO: Bugged, it always shows up
    // if (triggerPopup) {
    // Show popup after a short delay
    // setTimeout(showAnnonceagentPopup, 500);
    // }
}


function showAnnonceagentPopup() {
    const popup = `
        <div id="annonceagent-popup" class="position-fixed bottom-0 end-0 p-3" style="z-index: 1050;">
            <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                    <strong class="me-auto">Annonceagent</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body d-flex justify-content-between align-items-center">
                    <span>Opret annonceagent ud fra din søgning?</span>
                    <button type="button" class="btn action-button text-white btn-sm" id="create-annonceagent-button">Opret</button>
                </div>
            </div>
        </div>
    `;

    // Append the popup to the body
    $('body').append(popup);

    // Add event listener to the button
    $('#create-annonceagent-button').on('click', function () {
        createAnnonceagent(crypto.randomUUID(), "advertisement_list");
    });

}

export function createAnnonceagent(agentId, view) {
    let cityInput, postalNumber, priceRange, monthlyPriceRange, squareMetersRange, roomsRange, radius, name, active;

    // Pick values from correct views/sliders
    if (view === 'advertisement_list') {
        cityInput = $("#city").val();
        postalNumber = $("#postal-number").val();
        priceRange = $("#price-range-slider")[0].noUiSlider.get();
        monthlyPriceRange = $("#monthly-price-range-slider")[0].noUiSlider.get();
        squareMetersRange = $("#square-meters-range-slider")[0].noUiSlider.get();
        roomsRange = $("#rooms-range-slider")[0].noUiSlider.get();
        radius = $("#radius").val();
        name = null;
        active = true;
    } else if (view === 'agent-create') {
        cityInput = $("#city-agentcreateview").val();
        postalNumber = $("#postal-number-agentcreateview").val();
        priceRange = $("#price-range-slider-agentcreateview")[0].noUiSlider.get();
        monthlyPriceRange = $("#monthly-price-range-slider-agentcreateview")[0].noUiSlider.get();
        squareMetersRange = $("#square-meters-range-slider-agentcreateview")[0].noUiSlider.get();
        roomsRange = $("#rooms-range-slider-agentcreateview")[0].noUiSlider.get();
        radius = $("#radius-agentcreateview").val();
        name = $("#name-agentcreateview").val();
        active = $("#active-agentcreateview").is(":checked");
    } else if (view === 'agent-edit') {
        cityInput = $("#city-agenteditview").val();
        postalNumber = $("#postal-number-agenteditview").val();
        priceRange = $("#price-range-slider-agenteditview")[0].noUiSlider.get();
        monthlyPriceRange = $("#monthly-price-range-slider-agenteditview")[0].noUiSlider.get();
        squareMetersRange = $("#square-meters-range-slider-agenteditview")[0].noUiSlider.get();
        roomsRange = $("#rooms-range-slider-agenteditview")[0].noUiSlider.get();
        radius = $("#radius-agenteditview").val();
        name = $("#name-agenteditview").val();
        active = $("#active-agenteditview").is(":checked");
    }

    const priceFrom = parseFormattedInteger(priceRange[0]);
    const priceTo = parseFormattedInteger(priceRange[1]);
    const monthlyPriceFrom = parseFormattedInteger(monthlyPriceRange[0]);
    const monthlyPriceTo = parseFormattedInteger(monthlyPriceRange[1]);
    const squareMetersFrom = parseFormattedInteger(squareMetersRange[0]);
    const squareMetersTo = parseFormattedInteger(squareMetersRange[1]);
    const roomsFrom = parseFormattedInteger(roomsRange[0]);
    const roomsTo = parseFormattedInteger(roomsRange[1]);

    // Construct the criteria object according to the backend model
    const criteria = {
        price_from: isNaN(priceFrom) ? null : priceFrom,
        price_to: isNaN(priceTo) ? null : priceTo,
        monthly_price_from: isNaN(monthlyPriceFrom) ? null : monthlyPriceFrom,
        monthly_price_to: isNaN(monthlyPriceTo) ? null : monthlyPriceTo,
        rooms_from: isNaN(roomsFrom) ? null : roomsFrom,
        rooms_to: isNaN(roomsTo) ? null : roomsTo,
        square_meters_from: isNaN(squareMetersFrom) ? null : squareMetersFrom,
        square_meters_to: isNaN(squareMetersTo) ? null : squareMetersTo,
        postal_numbers: postalNumber ? [postalNumber] : null,
        radius: radius ? radius : null,
        cities: cityInput ? [cityInput] : null,
        // Add features or max_distance_km if you have them from other inputs
        features: null,
        max_distance_km: null
    };

    // Construct the overall agent data
    const agentData = {
        notifications: ["sms", "email"],
        active: active,
        criteria: criteria,
        name: name,
    };

    if (agentId != null) {
        agentData.id = agentId;
    }

    authFetch("/agent", {
        method: "POST",
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
            displaySuccessMessage("Annonceagent oprettet");
            loadAgents()
            showView('agent')

            console.log("Agent successfully created or updated:", data);
        })
        .catch(error => {
            displayErrorMessage("Der opstod en fejl");
            console.error("Failed to create/update agent:", error);
        });

}

// TODO: Fix transparent dropdown her
//  måske med "card card-body" som dropdown har i Opret Din Annonceagent
function generateSearchComponents(suffix) {
    return `
<div class="container mt-4 pb-2">
  <div class="row justify-content-center">
    <!-- Container for Search Bar -->
    <div class="col-12 col-md-8">
      <!-- First row: Search bar -->
      <div class="row">
        <div class="col">
          <div class="input-group">
            <input class="form-control" type="text" id="advertisement-list-search-${suffix}" 
                   placeholder="Vej, by, postnr, kommune, landsdel eller fritekst">
            <div class="input-group-text">
              <!-- Toggle Advanced Search dropdown -->
              <button class="btn ms-2" type="button" data-bs-toggle="collapse" 
                      data-bs-target="#advanced-search-${suffix}" aria-expanded="false" 
                      aria-controls="advanced-search">
                <i class="bi bi-three-dots-vertical"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Second row: Advanced Search Dropdown (using card design for unification) -->
      <div class="row mt-3">
        <div class="col">
          <div class="collapse" id="advanced-search-${suffix}">
            <div class="card card-body">
              ${generateAdvancedSearchFieldsForSearch(suffix)}
              <button type="button" class="btn action-button w-100 text-white mt-3" 
                      onclick="sendSearchData('${suffix}')">Søg</button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Third row: Results Counter and Sort Dropdown -->
      <div class="row mt-3">
        <div class="col-6 d-flex align-items-center">
          <span class="badge rounded-pill bg-light text-muted border">
            <span id="search-result-count-${suffix}">0</span> Resultater
          </span>
        </div>
        <div class="col-6 d-flex align-items-center justify-content-end">
          ${suffix === 'list' ? `
          <select class="form-select w-auto" id="sort-options-${suffix}">
            <option value="created-desc">Sorter nyeste først</option>
            <option value="created-asc">Ældste først</option>
            <option value="price-asc">Billigste først</option>
            <option value="price-desc">Dyreste først</option>
            <option value="monthly_fee-asc">Billigste husleje først</option>
            <option value="monthly_fee-desc">Dyreste husleje først</option>
            <option value="square_meters-asc">Mindste først</option>
            <option value="square_meters-desc">Største først</option>
          </select>
          ` : ''}
        </div>
      </div>
    </div>
  </div>
</div>
  `;
}


// TODO: mangler favorites only param her!!
function generateAdvancedSearchFieldsForSearch(suffix) {
    return `
    <!-- Price -->
    <div class="mt-4 mb-1 p-0 pb-4">
      <div class="row align-items-center">
        <div class="col-4 text-start"><h6 class="mb-0">Pris kr</h6></div>
        <div class="col-8"><div id="price-range-slider-${suffix}" class="slider"></div></div>
      </div>
    </div>
    <!-- Monthly Fee -->
    <div class="mt-3 m-0 p-0 pb-4">
      <div class="row align-items-center">
        <div class="col-4 text-start"><h6 class="mb-0">Mdl. ydelse kr</h6></div>
        <div class="col-8"><div id="monthly-price-range-slider-${suffix}" class="slider"></div></div>
      </div>
    </div>
    <!-- Square Meters -->
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
    <!-- Radius Search -->
    <div class="m-0 p-0 pb-4">
      <div class="row align-items-center">
        <div class="col-4 text-start"><h6 class="mb-0">Radius søgning</h6></div>
        <div class="col-2">
          <input type="text" id="radius-${suffix}" class="form-control" />
        </div>
        <div class="col-2"><h6 class="mb-0">km fra</h6></div>
        <div class="col-4">
          <input type="text" id="radius-postalnumber-${suffix}" class="form-control" placeholder="Postnr" />
        </div>
      </div>
    </div>
  `;
}



export function insertSearchComponents() {
    document.querySelectorAll('.view[data-advertisement-view]').forEach(view => {
        // For which view to load the search bar (list or map)
        const advertisementViewType = view.getAttribute('data-advertisement-view');
        const container = view.querySelector('.search-components-container');
        container.innerHTML = generateSearchComponents(advertisementViewType);

        // Attach event listener for sort dropdown
        if (advertisementViewType === 'list') {
            const sortSelect = container.querySelector(`#sort-options-${advertisementViewType}`);
            sortSelect.addEventListener('change', () => {
                // Trigger the method to update the results with new sorting.
                sendSearchData('list');
            });
        }
    });
}


// Return true if the given advertisement is in the logged in users favorite list, else false
export function isAdvertisementFavorite(advertisement_id) {
    if (currentUser === null) {
        return false
    }

    return currentUser.favorite_advertisements.includes(advertisement_id);
}

export function generateAdvertisementCard(advertisement, advertisementHTMLId) {
    let jwt = decodeJwt()
    // Only consider the ad owner if jwt is present
    const isOwner = jwt && advertisement.created_by === jwt.sub;

    return `
<div class="card advertisement-card position-relative" onclick="showView('detail', new URLSearchParams({id: '${advertisement._id}'}))">
  <!-- Conditionally add badge -->
  ${isOwner ? `<span class="position-absolute top-0 start-0 badge bg-primary m-2">Din Annonce</span>` : ''}

    <div class="favorite-icon position-absolute" ${advertisementHTMLId}="${advertisement._id}" style="top: 10px; right: 10px; z-index: 10; background: rgba(255,255,255,0.5); border-radius: 40%; padding: 5px;" onclick="event.stopPropagation(); favoriteAdvertisement('${advertisementHTMLId}', '${advertisement._id}');">
        <i class="${isAdvertisementFavorite(advertisement._id) ? 'bi bi-heart-fill text-danger' : 'bi bi-heart'}"></i>
    </div>
    <img class="card-img-top" 
         src="${advertisement.images.length > 0 ? advertisement.images[0].thumbnail_url : `${basePath}/pics/no_image_available.webp`}" 
         alt="Billede kommer snart" />

     
    <div class="card-body">
    
    <!-- Allow title and description to be None -->
    <h5 class="card-text">
      ${advertisement.title
    ? (advertisement.title.length > 40
    ? advertisement.title.substring(0, 40) + '...'
    : advertisement.title)
    : ''}
    </h5>
    <p class="card-text">
      ${advertisement.description
    ? (advertisement.description.length > 50
    ? advertisement.description.substring(0, 50) + '...'
    : advertisement.description)
    : ''}
    </p>

    <p class="card-text text-muted">
      <i class="bi bi-tag" data-bs-toggle="tooltip" data-bs-placement="top" title="Pris - samlet pris for ejendommen"></i>
      ${advertisement.price.toLocaleString('da-DK')} kr.
    </p>
    <p class="card-text text-muted">
      <i class="bi bi-calendar" data-bs-toggle="tooltip" data-bs-placement="top" title="Månedlig ydelse - de månedlige omkostninger"></i>
      ${advertisement.monthly_fee.toLocaleString('da-DK')} kr./mdn
    </p>
    <p class="card-text text-muted">
      <i class="bi bi-rulers" data-bs-toggle="tooltip" data-bs-placement="top" title="Størrelse - boligens areal og antal værelser"></i>
      ${advertisement.square_meters} m², ${advertisement.rooms} værelser
    </p>
    <p class="card-text text-muted">
      <i class="bi bi-geo-alt" data-bs-toggle="tooltip" data-bs-placement="top" title="Adresse - ejendommens placering"></i>
      ${advertisement.address && advertisement.city && advertisement.postal_number
    ? `${advertisement.street_name}, ${advertisement.postal_number} ${advertisement.postal_name}, ${advertisement.city} - ${advertisement.floor} ${advertisement.floor_side}`
    : "Ikke angivet"}
    </p>
    
    </div>
</div>
`;
}

window.sendSearchData = sendSearchData;
