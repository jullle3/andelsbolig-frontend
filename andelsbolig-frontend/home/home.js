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

    // Create skeleton screen
    let skeletonScreen = document.createElement('div');
    skeletonScreen.id = 'skeleton-screen';
    skeletonScreen.className = 'skeleton-container';

    // Add skeleton cards
    for (let i = 0; i < 4; i++) {
        const skeletonCard = document.createElement('div');
        skeletonCard.className = 'skeleton-card';
        skeletonCard.innerHTML = `
            <div class="skeleton-image"></div>
            <div class="skeleton-info">
                <div class="skeleton-title"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-text"></div>
            </div>
        `;
        listingsContainer.appendChild(skeletonCard);
    }

    skeletonScreen.style.display = 'flex';

    const response = await authFetch('advertisement?text=' + searchTerm);
    const data = await response.json();
    listingsContainer.innerHTML = '';
    skeletonScreen.style.display = 'none';

    if (data.objects.length === 0) {
        noResultsContainer.style.display = 'flex';
    } else {
        noResultsContainer.style.display = 'none';
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
                    <a href="mailto:${advertisement.emails ? advertisement.emails.join(', ') : '#'}" class="contact-link">Contact</a>
                </div>
            `;

            // Add click event listener to the card
            card.addEventListener('click', () => displayAdvertisementDetail(advertisement));
            listingsContainer.appendChild(card);
        });
    }
}

