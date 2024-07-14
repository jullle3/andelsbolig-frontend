import {authFetch} from "../auth.js";
import {showView} from "../views.js";
import {displayListingDetail} from "./advertisement_detail.js";

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
    document.getElementById('searchBar').addEventListener('input', debounce((e) => {
        const searchTerm = e.target.value;
        fetchAndDisplayAdvertisements(searchTerm);
    }, 500));

}

export async function fetchAndDisplayAdvertisements(searchTerm = '') {
    const listingsContainer = document.getElementById('listings-container');
    listingsContainer.innerHTML = 'Loading...';

    const response = await authFetch('advertisement?text=' + searchTerm);
    const data = await response.json();
    listingsContainer.innerHTML = '';

    data.objects.forEach(listing => {
        const card = document.createElement('div');
        card.className = 'listing-card';
        const imagesToShow = listing.images.slice(0, 4);
        card.innerHTML = `
            <div class="listing-image-container">
                ${imagesToShow.map(img => `<img src="${img.thumbnail_url}" alt="Listing image" class="listing-image">`).join('')}
            </div>
            <div class="listing-info">
                <h3 class="listing-title">${listing.title}</h3>
                <p class="listing-description">${listing.description}</p>
                <p><strong>Price:</strong> ${listing.price} DKK</p>
                <p><strong>Monthly Fee:</strong> ${listing.monthly_fee} DKK</p>
                <p><strong>Address:</strong> ${listing.address}, ${listing.city} ${listing.postal_code}</p>
                <p><strong>Area:</strong> ${listing.square_meters} m², ${listing.number_of_rooms} rooms</p>
                <a href="mailto:${listing.contact_email.join(', ')}" class="contact-link">Contact</a>
            </div>
        `;
        // Add click event listener to the card
        card.addEventListener('click', () => displayListingDetail(listing));
        listingsContainer.appendChild(card);
    });
}
