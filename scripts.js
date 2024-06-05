// script.js

document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('searchBar');
    const listingsContainer = document.getElementById('listings');
    let debounceTimeout;

    // Fetch listings from the backend with optional search text
    async function fetchListings(searchText = '') {
        try {
            const response = await fetch(`http://localhost:8500/advertisement?text=${encodeURIComponent(searchText)}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            displayListings(data.objects);
        } catch (error) {
            console.error('Error fetching listings:', error);
        }
    }

    // Display listings in the DOM
    function displayListings(listings) {
        listingsContainer.innerHTML = '';
        listings.forEach(listing => {
            const listingElement = document.createElement('div');
            listingElement.classList.add('listing');
            listingElement.innerHTML = `
                <h2>${listing.title}</h2>
                <p>${listing.description}</p>
                <p><strong>Price:</strong> ${listing.price} DKK</p>
                <p><strong>Monthly Fee:</strong> ${listing.monthly_fee} DKK</p>
                <p><strong>Address:</strong> ${listing.address}, ${listing.city} ${listing.postal_code}</p>
                <p><strong>Square Meters:</strong> ${listing.square_meters} m²</p>
                <p><strong>Number of Rooms:</strong> ${listing.number_of_rooms}</p>
                <p><strong>Date Posted:</strong> ${new Date(listing.date_posted * 1000).toLocaleDateString()}</p>
                <p><strong>Contact Email:</strong> ${listing.contact_email.join(', ')}</p>
                <div class="images">
                    ${listing.images.map(img => `<img src="${img}" alt="Image of ${listing.title}" />`).join('')}
                </div>
            `;
            listingsContainer.appendChild(listingElement);
        });
    }

    // Debounce function to delay the search
    function debounce(func, delay) {
        return function(...args) {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Fetch listings when the search input changes with debounce
    const handleSearchInput = (e) => {
        const searchTerm = e.target.value;
        fetchListings(searchTerm);
    };

    // Add debounce to search input
    searchBar.addEventListener('input', debounce(handleSearchInput, 500));

    // Initial fetch of listings
    fetchListings();
});
