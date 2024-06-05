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
            displayListings(data);
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
                <p><strong>Price:</strong> ${listing.price}</p>
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
