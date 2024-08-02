import {authFetch} from "../auth/auth.js";
import {showView} from "../views/viewManager.js";
import {displayAdvertisementDetail} from "../advertisement_detail/advertisement_detail.js";

export function setupHomeView() {
    document.getElementById('backButton').addEventListener('click', () => {
        showView('home');
    });

    // Debounce function to delay the search
    function debounce(func, delay) {
        let debounceTimeout;
        return function (...args) {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Add debounce to search input
    document.getElementById('home-search').addEventListener('input', debounce((e) => {
        const searchTerm = e.target.value;
        fetchAndDisplayAdvertisements(searchTerm);
    }, 500));

}

export async function fetchAndDisplayAdvertisements(searchTerm = '') {
    const listingsContainer = document.getElementById('listings-container');
    const noResultsContainer = document.getElementById('no-results');

    // Fetch the advertisements
    const response = await authFetch('advertisement?text=' + searchTerm);
    const data = await response.json();

    // Check if advertisements are available
    if (data.objects.length === 0) {
        noResultsContainer.style.display = 'block';
    } else {
        noResultsContainer.style.display = 'none';
        data.objects.forEach(advertisement => {
            // Properly encode the advertisement object for insertion into an HTML attribute
            const adJson = JSON.stringify(advertisement).replace(/"/g, '&quot;');
            const imagesToShow = advertisement.images.slice(0, 4);
            listingsContainer.innerHTML += `
            <!-- 4 cols large screen, 3 cols medium, 1 col small (phone)            -->
            <div class="col-md-4 col-xl-3 p-4">
                <div class="card">
<!--                <div class="card " style="width: 18rem;">-->
                    <img class="card-img-top" src="${advertisement.images[0].thumbnail_url}" alt="advertisement image" onclick='displayAdvertisementDetail(${adJson})' />
                    <div class="card-body">
                        <h5 class="card-title">${advertisement.title}</h5>
                        <p class="card-text">${advertisement.description}</p>
                        <p class="card-text"><strong>Price:</strong> ${advertisement.price} DKK</p>
                        <p class="card-text"><strong>Monthly Fee:</strong> ${advertisement.monthly_fee} DKK</p>
                        <p class="card-text"><strong>Address:</strong> ${advertisement.address}, ${advertisement.city} ${advertisement.postal_code}</p>
                        <p class="card-text"><strong>Area:</strong> ${advertisement.square_meters} m², ${advertisement.number_of_rooms} rooms</p>
                    </div>
                </div>
            </div>
            `;
        });
    }
}
