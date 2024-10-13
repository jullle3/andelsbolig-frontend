// Function to initialize the Google Map
import {authFetch} from "../auth/auth.js";
import {displayErrorMessage} from "../utils.js";

const smallDotIcon = {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 3,
    fillColor: '#FF0000',
    fillOpacity: 0.6,
    strokeWeight: 0
};


// Load Google Maps script dynamically and initialize the map
export function loadGoogleMaps() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCStq9v7paVD8cksRB8LvIh1oZeGSIkEvk&callback=initMap&libraries=marker`;
    script.async = true;
    document.head.appendChild(script);
}


function initMap() {
    const mapOptions = {
        zoom: 7, // Adjusted zoom to get a good view of Denmark
        center: new google.maps.LatLng(56.26392, 9.501785), // Center on Denmark
        mapId: '9df01a95f0b6f4d6 ' // Custom map style
    };
    window.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    fetchLocationsAndDisplay(); // Fetch locations after initializing the map
}


async function fetchLocationsAndDisplay() {
    const response = await authFetch('advertisement?size=10000');
    if (!response.ok) {
        let body = await response.json();
        displayErrorMessage(body.detail);
        return;
    }

    const advertisements = await response.json();

    console.log(advertisements);

    // Ensure AdvancedMarkerElement is loaded
    if (!google.maps.marker) {
        console.error("AdvancedMarkerElement library not loaded.");
        return;
    }

    // Add markers to the map based on fetched locations
    advertisements.objects.forEach(advertisement => {
        const marker = new google.maps.marker.AdvancedMarkerElement({
            position: new google.maps.LatLng(advertisement.location.coordinates[1], advertisement.location.coordinates[0]),
            map: window.map,
            title: advertisement.title // Changed from location.name to advertisement.title
        });
    });
}



window.initMap = initMap;