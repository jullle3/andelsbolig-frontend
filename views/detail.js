document.addEventListener('DOMContentLoaded', () => {
    const backButton = document.getElementById('backButton');

    function displayListingDetail(listing) {
        const detailContainer = document.getElementById('detail');
        detailContainer.innerHTML = `
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
        showView('detail');
    }

    backButton.addEventListener('click', () => {
        showView('home');
    });
});
