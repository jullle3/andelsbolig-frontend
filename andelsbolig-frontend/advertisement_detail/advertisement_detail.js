import {showView} from "../views/viewManager.js";

export function displayAdvertisementDetail(advertisement) {
    console.log(advertisement)
    const detailContainer = document.getElementById('detail');
    // Start of the carousel markup
    let carouselInnerHtml = advertisement.images.map((img, index) => `
        <div class="advertisement-image carousel-item ${index === 0 ? 'active' : ''}">
            <img src="${img.url}" class="d-block w-100" alt="Image of an apartment">
        </div>
    `).join('');

    // Complete carousel markup with indicators and controls
    detailContainer.innerHTML = `
        <h2>${advertisement.title}</h2>
        <p>${advertisement.description}</p>
        <p><strong>Price:</strong> ${advertisement.price} DKK</p>
        <p><strong>Monthly Fee:</strong> ${advertisement.monthly_fee} DKK</p>
        <p><strong>Address:</strong> ${advertisement.address}, ${advertisement.city} ${advertisement.postal_code}</p>
        <p><strong>Square Meters:</strong> ${advertisement.square_meters} m²</p>
        <p><strong>Number of Rooms:</strong> ${advertisement.number_of_rooms}</p>
        <p><strong>Date Posted:</strong> ${new Date(advertisement.created).toLocaleDateString()}</p>
        <p><strong>Contact Email:</strong> ${advertisement.emails ? advertisement.emails.join(', ') : 'undefined'}</p>

        <div id="listingImagesCarousel" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
                ${carouselInnerHtml}
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#listingImagesCarousel" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#listingImagesCarousel" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
            </button>
        </div>
        `;
    showView('detail');
}

window.displayAdvertisementDetail = displayAdvertisementDetail;