// Function to initialize the Google Map
import {authFetch} from "../auth/auth.js";
import {displayErrorMessage} from "../utils.js";
import {displayAdvertisementDetail} from "../advertisement_detail/advertisement_detail.js";

let infowindow;


export function setupMapView() {
}

export function initMap() {
    const mapOptions = {
        zoom: 7, // Adjusted zoom to get a good view of Denmark
        center: new google.maps.LatLng(56.26392, 9.501785), // Center on Denmark
        mapId: '9df01a95f0b6f4d6' // Custom map style
    };
    window.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    infowindow = new google.maps.InfoWindow();

    fetchLocationsAndDisplay(); // Fetch locations after initializing the map
}


function createCustomSVGIcon(color, title) {
    return `<svg fill="#000000" height="32px" width="32px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 486.196 486.196" xml:space="preserve">
        <rect width="486.196" height="486.196" fill="white"/> <!-- White background rectangle -->
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
            <g>
                <path d="M481.708,220.456l-228.8-204.6c-0.4-0.4-0.8-0.7-1.3-1c-5-4.8-13-5-18.3-0.3l-228.8,204.6c-5.6,5-6,13.5-1.1,19.1 c2.7,3,6.4,4.5,10.1,4.5c3.2,0,6.4-1.1,9-3.4l41.2-36.9v7.2v106.8v124.6c0,18.7,15.2,34,34,34c0.3,0,0.5,0,0.8,0s0.5,0,0.8,0h70.6 c17.6,0,31.9-14.3,31.9-31.9v-121.3c0-2.7,2.2-4.9,4.9-4.9h72.9c2.7,0,4.9,2.2,4.9,4.9v121.3c0,17.6,14.3,31.9,31.9,31.9h72.2 c19,0,34-18.7,34-42.6v-111.2v-34v-83.5l41.2,36.9c2.6,2.3,5.8,3.4,9,3.4c3.7,0,7.4-1.5,10.1-4.5 C487.708,233.956,487.208,225.456,481.708,220.456z M395.508,287.156v34v111.1c0,9.7-4.8,15.6-7,15.6h-72.2c-2.7,0-4.9-2.2-4.9-4.9 v-121.1c0-17.6-14.3-31.9-31.9-31.9h-72.9c-17.6,0-31.9,14.3-31.9,31.9v121.3c0,2.7-2.2,4.9-4.9,4.9h-70.6c-0.3,0-0.5,0-0.8,0 s-0.5,0-0.8,0c-3.8,0-7-3.1-7-7v-124.7v-106.8v-31.3l151.8-135.6l153.1,136.9L395.508,287.156L395.508,287.156z"></path>
            </g>
        </g>
    </svg>`;
}

function createCustomSVGIconWithPNG(imageUrl, width, height) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}px" height="${height}px" viewBox="0 0 ${width} ${height}">
        <image href="${imageUrl}" width="${width}" height="${height}"/>
    </svg>`;
}


async function fetchLocationsAndDisplay() {
    let t1 = performance.now();
    const response = await authFetch('/advertisement?size=10000');
    if (!response.ok) {
        let body = await response.json();
        displayErrorMessage(body.detail);
        return;
    }

    const parser = new DOMParser();

    const advertisements = await response.json();
    window.markers = advertisements.objects.map(ad => {
        // const svgString = createCustomSVGIcon("#7837FF", "Test");
        // const svgElement = parser.parseFromString(svgString, "image/svg+xml").documentElement;
        const customSVG = createCustomSVGIconWithPNG('pics/house_marker.png', 40, 40);
        const svgElement = parser.parseFromString(customSVG, "image/svg+xml").documentElement;


        const marker = new google.maps.marker.AdvancedMarkerElement({
            position: new google.maps.LatLng(ad.location.coordinates[0], ad.location.coordinates[1]),
            // collisionBehavior: google.maps.CollisionBehavior.OPTIONAL_AND_HIDES_LOWER_PRIORITY,
            map: window.map,
            title: ad.title,
            content: svgElement,

            // very CPU intensive to build HTML content for all markers
            // content: buildContent(ad),
        });

        // Attach the click event listener
        // Attach click event listener to build and display content only when needed
        marker.addListener('click', function() {
            const content = buildContent(ad);  // Build content dynamically on click
            // Assuming infowindow is a global or previously defined variable
            infowindow.setContent(content);
            infowindow.open(window.map, marker);
        });

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
        <i aria-hidden="true" class="fa fa-icon fa-advertisement_list" title="advertisement_list"></i>
<!--        <i aria-hidden="true" class="bi bi-clock-history"></i>-->
<!--        <i aria-hidden="true"></i>-->
<!--        <span class="fa-sr-only">advertisement_list</span>-->
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

