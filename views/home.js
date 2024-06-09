document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('searchBar');
    const listingsContainer = document.getElementById('listings');

    function displayListings(listings) {
        listingsContainer.innerHTML = '';
        listings.forEach(listing => {
            const listingElement = document.createElement('div');
            listingElement.classList.add('listing');
            listingElement.innerHTML = `
                <h2>${listing.title}</h2>
                <p>${listing.description}</p>
                <p><strong>Price:</strong> ${listing.price} DKK</p>
                <button class="view-detail" data-id="${listing._id}">View Details</button>
                <div class="images">
                    ${listing.images.map(img => `<img src="${img}" alt="Image of ${listing.title}" />`).join('')}
                </div>
            `;
            listingsContainer.appendChild(listingElement);
        });

        document.querySelectorAll('.view-detail').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                fetchListingDetail(id).then(displayListingDetail);
            });
        });
    }

    searchBar.addEventListener('input', debounce((e) => {
        const searchTerm = e.target.value;
        fetchListings(searchTerm).then(data => displayListings(data.objects));
    }, 500));

    fetchListings().then(data => displayListings(data.objects));
});
