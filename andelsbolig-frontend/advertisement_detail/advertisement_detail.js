import {showView} from "../views/viewManager.js";
import {authFetch} from "../auth/auth.js";

function setFullImageSrc(src) {
    const modalImage = document.querySelector('#fullImageModal .modal-body img');
    modalImage.src = src; // Set the source of the modal image to the source of the clicked image
}

export async function displayAdvertisementDetail(advertisement_id) {
    // Fetch the advertisement
    const response = await authFetch(`advertisement/${advertisement_id}`)
    const advertisement = await response.json();

    const detail_view = document.getElementById('detail-view');
    // Start of the carousel markup
    let carouselInnerHtml = advertisement.images.map((img, index) => `
    <div class="advertisement-image carousel-item ${index === 0 ? 'active' : ''}">
<!--        <img src="${img.url}" class="d-block w-100" alt="Image of an apartment" data-bs-toggle="modal" data-bs-target="#fullImageModal" onclick="setFullImageSrc('${img.url}')">-->
        <img src="${img.url}" class="d-block w-100" alt="Image of an apartment">
    </div>
`).join('');


    detail_view.innerHTML = `

    <!-- Images -->
<div class="container-fluid">
    <div class="row">
        <div class="col-12 p-0">
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
        </div>
    </div>

<!-- TODO: Modal tmp disabled -->
<!-- Modal for Viewing Full-Size Image as a popup -->
<!--<div class="modal fade" id="fullImageModal" tabindex="-1" aria-labelledby="fullImageModalLabel" aria-hidden="true">-->
<!--    <div class="modal-dialog modal-fullscreen">-->
<!--        <div class="modal-content">-->
<!--            <div class="modal-header">-->
<!--                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>-->
<!--            </div>-->
<!--            <div class="modal-body">-->
<!--                <img src="" alt="Full Size Image" class="w-100"> &lt;!&ndash; Image src will be dynamically set &ndash;&gt;-->
<!--            </div>-->
<!--        </div>-->
<!--    </div>-->
<!--</div>-->


   
    <!-- Details -->
    <div class="row p-4">
        <h2>${advertisement.title}</h2>
        <p>${advertisement.description}</p>
        <p><strong>Price:</strong> ${advertisement.price} DKK</p>
        <p><strong>Monthly Fee:</strong> ${advertisement.monthly_fee} DKK</p>
        <p><strong>Address:</strong> ${advertisement.address}, ${advertisement.city} ${advertisement.postal_code}</p>
        <p><strong>Square Meters:</strong> ${advertisement.square_meters} m²</p>
        <p><strong>Number of Rooms:</strong> ${advertisement.number_of_rooms}</p>
        <p><strong>Date Posted:</strong> ${new Date(advertisement.created).toLocaleDateString()}</p>
        <p><strong>Contact Email:</strong> ${advertisement.emails ? advertisement.emails.join(', ') : 'undefined'}</p>
    </div>
</div>
    
    
        `;
    showView('detail');
}

window.displayAdvertisementDetail = displayAdvertisementDetail;
window.setFullImageSrc = setFullImageSrc;

