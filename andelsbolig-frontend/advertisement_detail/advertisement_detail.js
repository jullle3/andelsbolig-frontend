import {showView} from "../views/viewManager.js";
import {authFetch} from "../auth/auth.js";
import {decodeJwt, displayErrorMessage} from "../utils.js";
import {loadSellerProfileView} from "../seller_profile/seller_profile.js";

function setFullImageSrc(src) {
    const modalImage = document.querySelector('#fullImageModal .modal-body img');
    modalImage.src = src; // Set the source of the modal image to the source of the clicked image
}

export async function loadAdvertisementDetail(advertisement_id) {
    // Fetch the advertisement
    const response = await authFetch(`/advertisement/${advertisement_id}`);
    if (!response.ok) {
        let body = await response.json()
        displayErrorMessage(body.detail);
        return;
    }

    let isAdvertisementCreatedByUser;
    const advertisement = await response.json();
    const detail_view = document.getElementById('detail');
    const decodedJwt = decodeJwt();
    if (decodedJwt === null) {
        isAdvertisementCreatedByUser = false;
    } else {
        isAdvertisementCreatedByUser = advertisement.created_by === decodedJwt.sub;
    }

    // Start of the image carousel
    // tmp disable
    //<!--        <img src="${img.url}" class="d-block w-100" alt="Image of an apartment" data-bs-toggle="modal" data-bs-target="#fullImageModal" onclick="setFullImageSrc('${img.url}')">-->
    let carouselInnerHtml = advertisement.images.map((img, index) => `
    <div class="advertisement-image carousel-item ${index === 0 ? 'active' : ''}">
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
        <div class="col-lg-6">
            <h2>${advertisement.title}</h2>
            <p>${advertisement.description}</p>
        </div>
        
        <div class="col-lg-6 vertical-line p-4">
            <form class="read-only-form">
                <label class="text-secondary" for="display_price">Pris</label>
                <div class="input-group">
                    <input class="form-control" value="${advertisement.price.toLocaleString('da-DK')}" type="text"  id="display_price" name="display_price" required readonly
                           oninput="formatNumber(this, 'price');">
                    <div class="input-group-text">kr</div>
                    <input type="hidden" id="price" name="price">
                </div>

                <label class="text-secondary mt-2" for="display_monthly_fee">Månedlig ydelse</label>
                <div class="input-group">
                    <input class="form-control" value="${advertisement.monthly_fee.toLocaleString('da-DK')}" type="text" id="display_monthly_fee" name="display_monthly_fee" readonly
                           required oninput="formatNumber(this, 'monthly_fee');">
                    <span class="input-group-text">kr</span>
                    <input type="hidden" id="monthly_fee" name="monthly_fee">
                </div>

                <label class="text-secondary mt-2" for="square_meters">Størrelse</label>
                <div class="input-group">
                    <input class="form-control" value="${advertisement.square_meters}" id="square_meters" name="square_meters" required readonly>
                    <span class="input-group-text">m²</span>
                </div>

                <label class="text-secondary mt-2" for="rooms">Antal værelser</label>
                <div class="input-group">
                    <input class="form-control" value="${advertisement.rooms}" type="number" id="rooms" name="rooms" required readonly min=1 max="10">
                </div>

                <label class="text-secondary mt-2" for="address">Addresse</label>
                <div class="input-group">
                    <input class="form-control" value="${advertisement.address}" type="text" id="address" name="address" required readonly>
                </div>

                <div class="form-check form-switch mt-2">
                    <input class="form-check-input" type="checkbox" id="located_at_top" name="located_at_top" disabled ${advertisement.located_at_top ? 'checked' : ''}>
                    <label class="form-check-label text-secondary" for="located_at_top">Øverste etage</label>
                </div>
            </form>

            <p class="mt-4">
              <i class="bi bi-clock-history"></i> <strong>Tid på markedet</strong>
              ${Math.floor((new Date() - new Date(advertisement.created * 1000)) / (1000 * 60 * 60 * 24))} dage
            </p>
            
            <p class="mt-4">
              <i class="bi bi-eye"></i> <strong>Visninger</strong>
              ${advertisement.views}
            </p>

            ${isAdvertisementCreatedByUser ? `
                <div class="row justify-content-center">
                    <div class="col-auto w-100">
                        <button class="mt-4 btn action-button w-100 text-white p-2" onclick="showView('create')">
                            Gå til redigering
                        </button>
                    </div>
                </div>
            ` : `
                <div class="row justify-content-center">
                    <div class="col-auto w-100">
                        <button class="mt-4 btn action-button w-100 text-white p-2" onclick="loadSellerProfileView('${advertisement.created_by}')">
                            Kontakt sælger
                        </button>
                    </div>
                </div>
            `}

        </div>
    </div>
</div>
    
    
        `;
    showView('detail');
}

window.loadAdvertisementDetail = loadAdvertisementDetail;
window.setFullImageSrc = setFullImageSrc;

