import {showView} from "../views/viewManager.js";
import {authFetch} from "../auth/auth.js";
import {decodeJwt, displayErrorMessage} from "../utils.js";
import {isAdvertisementFavorite} from "../advertisement_list/advertisement_list.js";
import {basePath} from "../config/config.js";

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
    const isFavorited = isAdvertisementFavorite(advertisement._id);
    const detail_view = document.getElementById('detail');
    const decodedJwt = decodeJwt();
    if (decodedJwt === null) {
        isAdvertisementCreatedByUser = false;
    } else {
        isAdvertisementCreatedByUser = advertisement.created_by === decodedJwt.sub;
    }

    let carouselInnerHtml = advertisement.images.length > 0
        ? advertisement.images.map((img, index) => `
      <div class="advertisement-image carousel-item ${index === 0 ? 'active' : ''}">
        <img
          src="${img.url}"
          class="d-block w-100"
          alt="Thumbnail of apartment"
          role="button"
          data-bs-toggle="modal"
          data-bs-target="#fullImageModal"
          data-bs-slide-to="${index}"
        >
      </div>
    `).join('')
        : `
    <div class="advertisement-image carousel-item active">
      <img src="../${basePath}/pics/no_image_available.webp" class="d-block w-100" alt="Billede kommer snart">
    </div>
  `;


    // 1) Render the detail view (thumbnails + everything else)
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


    <!-- Details -->
    <div class="row p-4">
        <div class="col-lg-6">
            <h2>${advertisement.title}</h2>
            <p>${advertisement.description}</p>
        </div>
        
        <div class="col-lg-6 vertical-line horizontal-line p-4">
        
                    <div class="favorite-icon text-end p-0 m-0" data-advertisement-id-detail="${advertisement._id}" onclick="favoriteAdvertisement('data-advertisement-id-detail', '${advertisement._id}');">
                        <i class="${isFavorited ? 'bi bi-heart-fill text-danger' : 'bi bi-heart'}"></i>
                         Gem
                    </div>
                    
            
            <form class="read-only-form  pt-0 mt-0">
                <label class="text-secondary" for="display_price">Pris inkl. forbedringer</label>
                <div class="input-group">
                    <input class="form-control" value="${advertisement.price.toLocaleString('da-DK')}" type="text"  id="display_price" name="display_price" required readonly
                           oninput="formatNumber(this, 'price');">
                    <div class="input-group-text">kr</div>
                    <input type="hidden" id="price" name="price">
                </div>
                
                <label class="text-secondary mt-2" for="display_improvements_price">Forbedringer udgør</label>
                <div class="input-group">
                    <input class="form-control" value="${advertisement.improvements_price.toLocaleString('da-DK')}" type="text"  id="display_improvements_price" name="display_improvements_price" required readonly
                           oninput="formatNumber(this, 'improvements_price');">
                    <div class="input-group-text">kr</div>
                    <input type="hidden" id="improvements_price" name="improvements_price">
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
                  <input 
                    class="form-control" 
                    value="${advertisement.street_name}, ${advertisement.postal_number} ${advertisement.postal_name}, ${advertisement.city} - ${advertisement.floor} ${advertisement.floor_side}"
                    type="text" 
                    id="address" 
                    name="address" 
                    required 
                    readonly
                  >
                  <!-- Input group addon with text above the map icon -->
                  <span 
                    class="input-group-text" 
                    style="cursor: pointer" 
                    onclick="showView('advertisement_map', new URLSearchParams({id: '${advertisement._id}'}))"
                    aria-label="Vis på kort"
                  >
                    <div class="text-center">
                      <small class="d-block">Kort</small>
                      <i class="bi bi-geo-alt"></i>
                    </div>
                  </span>
                </div>


                <label class="text-secondary mt-2" for="construction_year">Byggeår for ejendommen</label>
                <div class="input-group">
                    <input class="form-control" 
                           value="${(advertisement.construction_year === null || advertisement.construction_year === '') ? '' : advertisement.construction_year}" 
                           type="text" 
                           id="construction_year" 
                           name="construction_year" 
                           readonly>
                </div>
                
                <label class="text-secondary mt-2" for="equity_percentage">Friværdi i ejendommen</label>
                <div class="input-group">
                    <input class="form-control" 
                           value="${(advertisement.equity_percentage === null || advertisement.equity_percentage === '') ? '' : advertisement.equity_percentage}" 
                           type="number" 
                           id="equity_percentage" 
                           name="equity_percentage" 
                           min="0" 
                           max="100" 
                           readonly>
                    <span class="input-group-text">%</span>
                </div>

                <div class="d-flex justify-content-between align-items-center">
                    <div class="form-check form-switch mt-2">
                        <input class="form-check-input" type="checkbox" id="located_at_top" name="located_at_top" ${advertisement.located_at_top ? 'checked' : ''}>
                        <label class="form-check-label text-secondary" for="located_at_top">Øverste etage</label>
                    </div>
                    
                    <div class="form-check form-switch mt-2">
                        <input class="form-check-input" type="checkbox" id="balcony" name="balcony" ${advertisement.balcony ? 'checked' : ''}>
                        <label class="form-check-label text-secondary" for="balcony">Altan</label>
                    </div>
                    
                    <div class="form-check form-switch mt-2">
                        <input class="form-check-input" type="checkbox" id="elevator" name="elevator" ${advertisement.elevator ? 'checked' : ''}>
                        <label class="form-check-label text-secondary" for="elevator">Elevator</label>
                    </div>
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
            
            ${ advertisement.energy_label ? `
              <div class="label-container">
                <img src="../${basePath}/pics/energy/${advertisement.energy_label}.webp" style="width: 80px; height: 80px" alt="Energy Label ${advertisement.energy_label}">
              </div>
            ` : '' }


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
                        <!-- Contact button depend on the advertisement type. Some require a redirect-->
                        ${ advertisement.scraped_realtor_url && typeof advertisement.scraped_realtor_url === 'string' ? `
                          <button class="mt-4 btn action-button w-100 text-white p-2" onclick="showView('successful_redirect', new URLSearchParams({scraped_realtor_url: '${advertisement.scraped_realtor_url}'}))">
                            Kontakt sælger
                          </button>
                        ` : `
                          <button class="mt-4 btn action-button w-100 text-white p-2" onclick="showView('seller_profile', new URLSearchParams({id: '${advertisement.created_by}'}))">
                            Kontakt sælger
                          </button>
                        ` }

                    </div>
                </div>
            `}

        </div>
    </div>
</div>
        `;

    // 2 now populate the *full‑screen* carousel inside the modal:
    // target the modal’s inner carousel container
    document.querySelector('#fullImageModal .carousel-inner').innerHTML = advertisement.images
        .map((img, idx) => `
      <div class="carousel-item ${idx === 0 ? 'active' : ''} h-100">
        <img
          src="${img.url}"
          class="d-block w-100 h-100 object-fit-contain"
          alt="Full‑size image"
        >
      </div>
    `).join('');

    // 3) Attach “click outside image closes modal”
    const modalEl     = document.getElementById('fullImageModal');
    const modalContent = modalEl.querySelector('.modal-content');

    modalContent.addEventListener('click', (e) => {
        console.log("click")
        // if the click hit neither the prev/next controls nor the close (X) button…
        if (
            !e.target.closest('.carousel-control-prev, .carousel-control-next, .btn-close')
        ) {
            // …then hide the modal
            bootstrap.Modal.getInstance(modalEl).hide();
        }
    });
}

