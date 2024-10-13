// Function to initialize the Google Map
import {authFetch} from "../auth/auth.js";
import {displayErrorMessage} from "../utils.js";
import {displayAdvertisementDetail} from "../advertisement_detail/advertisement_detail.js";


export function setupMapView() {
}

export function initMap() {
    const mapOptions = {
        zoom: 7, // Adjusted zoom to get a good view of Denmark
        center: new google.maps.LatLng(56.26392, 9.501785), // Center on Denmark
        mapId: '9df01a95f0b6f4d6' // Custom map style
    };
    window.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    fetchLocationsAndDisplay(); // Fetch locations after initializing the map
}


async function fetchLocationsAndDisplay() {
    let t1 = performance.now();
    const response = await authFetch('advertisement?size=10000');
    if (!response.ok) {
        let body = await response.json();
        displayErrorMessage(body.detail);
        return;
    }

    const advertisements = await response.json();
    window.markers = advertisements.objects.map(ad => {
        const marker = new google.maps.marker.AdvancedMarkerElement({
            position: new google.maps.LatLng(ad.location.coordinates[0], ad.location.coordinates[1]),
            map: window.map,
            title: ad.title,
            content: buildContent(ad),
        });

        // Attach the click event listener
        marker.addListener('click', () => toggleHighlight(marker));
        return marker;
    });

    let t2 = performance.now(); // End timing after all markers are set up
    console.log(`Added markers ${Math.round(t2 - t1)} milliseconds`);

}

function buildContent(advertisement) {
    const content = document.createElement("div");

    content.classList.add("property");
    content.innerHTML = `
    <div class="icon">
        <i aria-hidden="true" class="fa fa-icon fa-home" title="home"></i>
<!--        <i aria-hidden="true" class="bi bi-clock-history"></i>-->
<!--        <i aria-hidden="true"></i>-->
<!--        <span class="fa-sr-only">home</span>-->
    </div>
    <div class="details" onclick="displayAdvertisementDetail('${advertisement._id}')">
    <div class="details">
        <div class="price">${advertisement.price}</div>
        <div class="address">${advertisement.address}</div>
        <div class="features">
        <div>
<!--            <i aria-hidden="true" class="fa fa-bed fa-lg bed" title="bedroom"></i>-->
<!--            <span class="fa-sr-only">bedroom</span>-->
            <span>1</span>
        </div>
        <div>
<!--            <i aria-hidden="true" class="fa fa-bath fa-lg bath" title="bathroom"></i>-->
<!--            <span class="fa-sr-only">bathroom</span>-->
            <span>1</span>
        </div>
        <div>
<!--            <i aria-hidden="true" class="fa fa-ruler fa-lg size" title="size"></i>-->
<!--            <span class="fa-sr-only">size</span>-->
            <span>10<sup>2</sup></span>
        </div>
        </div>
    </div>
    `;
    return content;
}



function toggleHighlight(markerView) {
    if (markerView.content.classList.contains("highlight")) {
        markerView.content.classList.remove("highlight");
        markerView.zIndex = null;
    } else {
        markerView.content.classList.add("highlight");
        markerView.zIndex = 1;
    }
}

window.initMap = initMap;

