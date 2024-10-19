import {authFetch} from "../auth/auth.js";
import {displayAdvertisementDetail} from "../advertisement_detail/advertisement_detail.js";

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
    document.getElementById('advertisement-list-search').addEventListener('input', debounce((e) => {
        const searchTerm = e.target.value;
        fetchAndDisplayAdvertisements(searchTerm);
    }, 500));

    setupPriceSlider()
    setupMonthlyFeeSlider()
    setupSquareMetersSlider()
    setupRoomsSlider()
    setupOnClickSendSearchData()
}


function setupOnClickSendSearchData() {
    window.sendSearchData = function() {
        // Collect data from inputs
        const searchText = document.getElementById('advertisement-list-search').value;
        const size = document.getElementById('size').value;

        // Construct the JSON body
        const jsonData = {
            search: searchText,
            priceRange: document.getElementById('price-range-slider').noUiSlider.get(),
            size: size
        };

        // Fetch API to send the data to your backend
        // fetch('/your-backend-endpoint', {  // Replace '/your-backend-endpoint' with your actual endpoint URL
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(jsonData)
        // }).then(response => response.json())
        //     .then(data => {
        //         console.log('Success:', data);
        //         Process the response data here
            // })
            // .catch((error) => {
            //     console.error('Error:', error);
            // });
    // };
    }
}


function setupPriceSlider() {
    const price_slider = document.getElementById('price-range-slider');

    noUiSlider.create(price_slider, {
        start: [250000, 750000], // Starting values for the handles
        connect: true, // Display a colored bar between the handles
        range: {
            'min': 0,
            'max': 1_000_000
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
        start: [2500, 7500], // Starting values for the handles
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


export async function fetchAndDisplayAdvertisements(searchTerm = '') {
    const listingsContainer = document.getElementById('listings-container');
    const noResultsContainer = document.getElementById('no-results');
    listingsContainer.innerHTML = '';

    // Fetch the advertisements
    const response = await authFetch('advertisement?text=' + searchTerm);
    const data = await response.json();

    // Check if advertisements are available
    if (data.objects.length === 0) {
        noResultsContainer.style.display = 'block';
    } else {
        noResultsContainer.style.display = 'none';
        data.objects.forEach(advertisement => {
            listingsContainer.innerHTML += `
            <!-- Show 1 row on mobile -->
            <!--            <div class="col-md-6 col-lg-4 col-xl-3 p-4">-->
            <!-- Show 2 rows on mobile -->
            <div class="col-sm-6 col-md-4 col-lg-3 p-3 pb-3 ">
<!--            <div class="col-sm-6 col-md-4 col-lg-3 p-3 pb-4">-->
            <div class="card advertisement-card" onclick="displayAdvertisementDetail('${advertisement._id}')">
            <img class="card-img-top" src="${advertisement.images.length > 0 ? advertisement.images[0].thumbnail_url : ''}" alt="Billede kommer snart" />
          <div class="card-body">
                        <h5 class="card-text">${advertisement.title.length > 40 ? advertisement.title.substring(0, 40) + '...' : advertisement.title}</h5>
                        <p class="card-text">${advertisement.description.length > 50 ? advertisement.description.substring(0, 50) + '...' : advertisement.description}</p>
                        <p class="card-text"><strong>Pris</strong> ${advertisement.price.toLocaleString('da-DK')} DKK</p>
                        <p class="card-text"><strong>Månedlig ydelse</strong> ${advertisement.monthly_fee.toLocaleString('da-DK')} DKK</p>                        <p class="card-text"><strong>Størrelse</strong> ${advertisement.square_meters} m², ${advertisement.rooms} værelser</p>
                        <p class="card-text"><strong>Adresse</strong> ${advertisement.address}, ${advertisement.city} ${advertisement.postal_code}</p>
                    </div>
                </div>
            </div>
            `;
        });
    }
}
