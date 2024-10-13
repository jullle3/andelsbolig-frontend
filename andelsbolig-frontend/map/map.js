// Function to initialize the Google Map
import {authFetch} from "../auth/auth.js";
import {displayErrorMessage} from "../utils.js";


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
    window.markers = advertisements.objects.map(ad => {
        const dotContent = createBlueDotContent();
        return new google.maps.marker.AdvancedMarkerElement({
            position: new google.maps.LatLng(ad.location.coordinates[1], ad.location.coordinates[0]),
            map: window.map,
            content: dotContent,
            title: ad.title
        });
    });
}

function updateMarkerIcons() {
    const zoomLevel = window.map.getZoom();
    window.markers.forEach(marker => {
        if (zoomLevel >= 15) {
            marker.setIcon(null); // Remove the small dot icon
            marker.setContent(marker.content); // Set to the previously created HTML content
        } else {
            marker.setContent(null); // Remove the HTML content
            marker.setIcon(smallDotIcon); // Show the small dot icon
        }
    });
}

function createBlueDotContent() {
    const dot = document.createElement('div');
    dot.style.width = '14px';  // Same size as before
    dot.style.height = '14px';  // Same size as before
    dot.style.backgroundColor = '#007BFF';  // A vibrant blue color
    dot.style.borderRadius = '50%';  // Keeps it circular
    dot.style.boxShadow = '0 0 0 1px #0056b3';  // A slightly darker blue for the outline
    dot.style.position = 'absolute';
    dot.style.transform = 'translate(-50%, -50%)'; // Ensures it's centered
    return dot;
}




window.initMap = initMap;
