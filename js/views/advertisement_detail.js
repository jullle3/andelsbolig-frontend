import {showView} from "../views.js";

export function displayListingDetail(listing) {
    const detailContainer = document.getElementById('detail');
    // Start of the carousel markup
    let carouselInnerHtml = listing.images.map((img, index) => `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
            <img src="${img.url}" class="d-block w-100" alt="Image of an apartment">
        </div>
    `).join('');

    // Complete carousel markup with indicators and controls
    detailContainer.innerHTML = `
        <h2>${listing.title}</h2>
        <p>${listing.description}</p>
        <p><strong>Price:</strong> ${listing.price} DKK</p>
        <p><strong>Monthly Fee:</strong> ${listing.monthly_fee} DKK</p>
        <p><strong>Address:</strong> ${listing.address}, ${listing.city} ${listing.postal_code}</p>
        <p><strong>Square Meters:</strong> ${listing.square_meters} m²</p>
        <p><strong>Number of Rooms:</strong> ${listing.number_of_rooms}</p>
        <p><strong>Date Posted:</strong> ${new Date(listing.created).toLocaleDateString()}</p>
        <p><strong>Contact Email:</strong> ${listing.contact_email.join(', ')}</p>
        <div id="listingImagesCarousel" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
                ${carouselInnerHtml}
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#listingImagesCarousel" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#listingImagesCarousel" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
        `;
    showView('detail');
}
