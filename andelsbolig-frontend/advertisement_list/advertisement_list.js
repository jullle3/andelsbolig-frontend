import {authFetch} from "../auth/auth.js";
import {displayAdvertisementDetail} from "../advertisement_detail/advertisement_detail.js";
import {cityData, postalData} from "../config/hardcoded_data.js";
import {
    displayErrorMessage,
    cleanParams,
    removeDots,
    fetchAndDisplayAdvertisements,
    parseFormattedInteger, displaySuccessMessage
} from "../utils.js";


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
    document.getElementById('advertisement-list-search').addEventListener('input', debounce(async (e) => {
        const searchTerm = e.target.value;
        fetchAndDisplayAdvertisements(searchTerm);
    }, 500));

    setupPriceSlider()
    setupMonthlyFeeSlider()
    setupSquareMetersSlider()
    setupRoomsSlider()
    setupAutoComplete()
}


function sendSearchData(append=false) {
    // Extract values and construct the query parameters
    const params = new URLSearchParams(cleanParams({
        text: document.getElementById('advertisement-list-search').value,
        price_from: removeDots(document.getElementById('price-range-slider').noUiSlider.get()[0]),
        price_to: removeDots(document.getElementById('price-range-slider').noUiSlider.get()[1]),
        monthly_fee_from: removeDots(document.getElementById('monthly-fee-range-slider').noUiSlider.get()[0]),
        monthly_fee_to: removeDots(document.getElementById('monthly-fee-range-slider').noUiSlider.get()[1]),
        square_meter_from: document.getElementById('square-meters-range-slider').noUiSlider.get()[0],
        square_meter_to: document.getElementById('square-meters-range-slider').noUiSlider.get()[1],
        rooms_from: document.getElementById('rooms-range-slider').noUiSlider.get()[0],
        rooms_to: document.getElementById('rooms-range-slider').noUiSlider.get()[1],
        postal_number: $("#postal-number").val(),
        city: $("#city").val()
    })).toString();

    // Fetch API to send the data to your backend
    authFetch('/advertisement?' + params).then(response => {
        if (!response.ok) {
            displayErrorMessage("Noget gik galt");
            return;
        }
        return response.json();
    }).then(data => {
        displayAdvertisements(data, append, true);
    }).catch(error => {
        console.error('Error:', error);
    });
}


function setupPriceSlider() {
    const price_slider = document.getElementById('price-range-slider');

    noUiSlider.create(price_slider, {
        start: [0, 7_000_000], // Starting values for the handles
        connect: true, // Display a colored bar between the handles
        range: {
            'min': 0,
            'max': 10_000_000
        },
        step: 5000, // Increment steps
        format: wNumb({
            decimals: 0, // No decimals in the output
            thousand: '.',
            // prefix: 'kr ',
            // suffix: " .-"
        }),
        tooltips: true // Show tooltips with formatted values
    });

    // When the slider value changes, update a hypothetical input/display
    price_slider.noUiSlider.on('update', function(values, handle) {
        $('#min-price').text(values[0]);
        $('#max-price').text(values[1]);
    });
}

function setupMonthlyFeeSlider() {
    const monthly_fee_slider = document.getElementById('monthly-fee-range-slider');

    noUiSlider.create(monthly_fee_slider, {
        start: [0, 28_500], // Starting values for the handles
        connect: true, // Display a colored bar between the handles
        range: {
            'min': 0,
            'max': 40_000
        },
        step: 100, // Increment steps
        format: wNumb({
            decimals: 0, // No decimals in the output
            thousand: '.',
            // prefix: 'kr ',
            // suffix: " .-"
        }),
        tooltips: true // Show tooltips with formatted values
    });

    // When the slider value changes, update a hypothetical input/display
    monthly_fee_slider.noUiSlider.on('update', function(values, handle) {
        $('#min-price').text(values[0]);
        $('#max-price').text(values[1]);
    });
}

function setupSquareMetersSlider() {
    const square_meters_slider = document.getElementById('square-meters-range-slider');

    noUiSlider.create(square_meters_slider, {
        start: [50, 100], // Starting values for the handles
        connect: true, // Display a colored bar between the handles
        range: {
            'min': 0,
            'max': 400
        },
        step: 10,
        format: wNumb({
            decimals: 0, // No decimals in the output
            thousand: '.',
            // prefix: 'kr ',
            // suffix: " .-"
        }),
        tooltips: true
    });

    square_meters_slider.noUiSlider.on('update', function(values, handle) {
        $('#min-price').text(values[0]);
        $('#max-price').text(values[1]);
    });
}

function setupRoomsSlider() {
    const rooms_slider = document.getElementById('rooms-range-slider');

    noUiSlider.create(rooms_slider, {
        start: [2, 5], // Starting values for the handles
        connect: true, // Display a colored bar between the handles
        range: {
            'min': 1,
            'max': 10
        },
        step: 1,
        format: wNumb({
            decimals: 0,
            thousand: '.',
            // prefix: 'kr ',
            // suffix: " .-"
        }),
        tooltips: true // Show tooltips with formatted values
    });

    rooms_slider.noUiSlider.on('update', function(values, handle) {
        $('#min-price').text(values[0]);
        $('#max-price').text(values[1]);
    });
}



function setupAutoComplete() {
    // Autocomplete for city input
    $("#city").autocomplete({
        source: cityData,
        delay: 0,
        minLength: 0, // Allow dropdown to appear with zero characters
        select: function(event, ui) {
            console.log(ui.item.value)
            $("#city").val(ui.item.value);
        }
    }).focus(function() {
        // Trigger the search to show all entries when the field is focused
        $(this).autocomplete("search", "");
    });

    // Autocomplete for postal number input
    $("#postal-number").autocomplete({
        delay: 0,
        minLength: 0, // Allow dropdown to appear with zero characters
        source: function(request, response) {
            const matches = $.map(postalData, function(postal_city, postal_code) {
                if (postal_code.startsWith(request.term)) {
                    return `${postal_code} - ${postal_city}`;
                }
            });
            response(matches);
        },
        select: function(event, ui) {
            // Only use postal_code part
            const parts = ui.item.value.split(" - ");
            $("#postal-number").val(parts[0]);
            return false; // Prevent the widget from updating the input with the selected value
        }
    }).focus(function() {
        // Trigger the search to show all entries when the field is focused
        $(this).autocomplete("search", "");
    });
}

export async function displayAdvertisements(response, append=false, triggerPopup=false) {
    const advertisements = response.objects;
    const listingsContainer = document.getElementById('listings-container');
    const noResultsContainer = document.getElementById('no-results');

    // Clear previous listings
    if (!append)
        listingsContainer.innerHTML = '';

    // Check if advertisements are available
    if (advertisements.length === 0) {
        noResultsContainer.style.display = 'block';
    } else {
        noResultsContainer.style.display = 'none';
        advertisements.forEach(advertisement => {
            listingsContainer.innerHTML += `
            <div class="col-sm-6 col-md-4 col-lg-3 p-3 pb-3">
                <div class="card advertisement-card" onclick="displayAdvertisementDetail('${advertisement._id}')">
                    <img class="card-img-top" src="${advertisement.images.length > 0 ? advertisement.images[0].thumbnail_url : ''}" alt="Billede kommer snart" />
                    <div class="card-body">
                        <h5 class="card-text">${advertisement.title.length > 40 ? advertisement.title.substring(0, 40) + '...' : advertisement.title}</h5>
                        <p class="card-text">${advertisement.description.length > 50 ? advertisement.description.substring(0, 50) + '...' : advertisement.description}</p>
                        <p class="card-text"><strong>Pris</strong> ${advertisement.price.toLocaleString('da-DK')} DKK</p>
                        <p class="card-text"><strong>Månedlig ydelse</strong> ${advertisement.monthly_fee.toLocaleString('da-DK')} DKK</p>
                        <p class="card-text"><strong>Størrelse</strong> ${advertisement.square_meters} m², ${advertisement.rooms} værelser</p>
                        <p class="card-text"><strong>Adresse</strong> ${advertisement.address}, ${advertisement.city} ${advertisement.postal_code}</p>
                    </div>
                </div>
            </div>
            `;
        });
    }

    updateSearchResultsCount(listingsContainer.children.length);

    // Display Next Page button only if more results are available
    if (response.total_object_count > response.count) {
        $("#next-page-button").removeClass('d-none')
    } else {
        $("#next-page-button").addClass('d-none')
    }

    showAnnonceagentPopup()

    if (triggerPopup) {
        // Show popup after a short delay
        setTimeout(showAnnonceagentPopup, 500);
    }
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
    $('#create-annonceagent-button').on('click', function() {
        createAnnonceagent(crypto.randomUUID());
    });

}

function createAnnonceagent(agentId) {
    const cityInput = $("#city").val();
    const postalNumber = $("#postal-number").val();

    const priceRange = $("#price-range-slider")[0].noUiSlider.get();
    const squareMetersRange = $("#square-meters-range-slider")[0].noUiSlider.get();
    const roomsRange = $("#rooms-range-slider")[0].noUiSlider.get();

    const minPrice = parseFormattedInteger(priceRange[0]);
    const maxPrice = parseFormattedInteger(priceRange[1]);
    const minSquareMeters = parseFormattedInteger(squareMetersRange[0]);
    const maxSquareMeters = parseFormattedInteger(squareMetersRange[1]);
    const minRooms = parseFormattedInteger(roomsRange[0]);
    const maxRooms = parseFormattedInteger(roomsRange[1]);

    // Construct the criteria object according to the backend model
    const criteria = {
        min_price: isNaN(minPrice) ? null : minPrice,
        max_price: isNaN(maxPrice) ? null : maxPrice,
        min_rooms: isNaN(minRooms) ? null : minRooms,
        max_rooms: isNaN(maxRooms) ? null : maxRooms,
        min_square_meters: isNaN(minSquareMeters) ? null : minSquareMeters,
        max_square_meters: isNaN(maxSquareMeters) ? null : maxSquareMeters,
        cities: cityInput ? [cityInput] : null,
        postal_numbers: postalNumber ? [postalNumber] : null,
        // Add features or max_distance_km if you have them from other inputs
        features: null,
        max_distance_km: null
    };

    // Construct the overall agent data
    const agentData = {
        notifications: ["sms", "email"],
        active: true,
        criteria: criteria
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
            console.log("Agent successfully created or updated:", data);
        })
        .catch(error => {
            displayErrorMessage("Der opstod en fejl");
            console.error("Failed to create/update agent:", error);
        });
}


function updateSearchResultsCount(count) {
    $('#search-result-count').text(count);
}

window.sendSearchData = sendSearchData;
