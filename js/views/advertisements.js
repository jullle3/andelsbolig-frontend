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

    data.objects.forEach(advertisement => {
        const card = document.createElement('div');
        card.className = 'advertisement-card';
        const imagesToShow = advertisement.images.slice(0, 4);
        card.innerHTML = `
            <div class="advertisement-image-container">
                ${imagesToShow.map(img => `<img src="${img.thumbnail_url}" alt="advertisement image" class="advertisement-image">`).join('')}
            </div>
            <div class="advertisement-info">
                <h3 class="advertisement-title">${advertisement.title}</h3>
                <p class="advertisement-description">${advertisement.description}</p>
                <p><strong>Price:</strong> ${advertisement.price} DKK</p>
                <p><strong>Monthly Fee:</strong> ${advertisement.monthly_fee} DKK</p>
                <p><strong>Address:</strong> ${advertisement.address}, ${advertisement.city} ${advertisement.postal_code}</p>
                <p><strong>Area:</strong> ${advertisement.square_meters} m², ${advertisement.number_of_rooms} rooms</p>
                <a href="mailto:${advertisement.contact_email.join(', ')}" class="contact-link">Contact</a>
            </div>
        `;
        // Add click event listener to the card
        card.addEventListener('click', () => displayListingDetail(advertisement));
        listingsContainer.appendChild(card);
    });
}
