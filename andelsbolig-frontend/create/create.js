import {authFetch} from "../auth/auth.js";
import {fetchAndDisplayAdvertisements} from "../home/home.js";
import {decodeJwt, displayErrorMessage} from "../utils.js";


export async function setupCreateAdvertisementView() {
    const createAdvertisementView = document.getElementById('create-view');
    createAdvertisementView.style.display = 'none'; // Hide the view by default

    const decodedJwt = decodeJwt();

    // Fetch existing advertisement
    const response = await authFetch('advertisement?created_by=' + decodedJwt.sub);
    const data = await response.json();
    const advertisement = data.objects[0]; // Assuming only one advertisement per user

    // Populate form fields if advertisement exists
    if (advertisement) {
        document.getElementById('price').value = advertisement.price || '';
        document.getElementById('monthly_fee').value = advertisement.monthly_fee || '';
        document.getElementById('address').value = advertisement.address || '';
        document.getElementById('square_meters').value = advertisement.square_meters || '';
        document.getElementById('rooms').value = advertisement.rooms || '';
        document.getElementById('located_at_top').checked = advertisement.located_at_top || false;

        // Display existing images
        const imagePreview = document.getElementById('imagePreview');
        advertisement.images.forEach(img => {
            const imgElement = document.createElement('img');
            imgElement.src = img.thumbnail_url;
            imgElement.alt = 'advertisement image';
            imgElement.style.width = '100px';
            imgElement.style.height = '100px';
            imgElement.style.objectFit = 'cover';
            imgElement.style.margin = '5px';
            imagePreview.appendChild(imgElement);
        });
    }

    // Handle image uploads
    document.getElementById('images').addEventListener('change', async (event) => {
        const files = event.target.files;
        const imagePreview = document.getElementById('imagePreview');

        for (const file of files) {
            const formData = new FormData();
            formData.append('file', file);

            const response = await authFetch('upload', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            if (response.ok) {
                // Display thumbnail
                const imgElement = document.createElement('img');
                imgElement.src = result.thumbnail_url;
                imgElement.alt = file.name;
                imgElement.style.width = '100px';
                imgElement.style.height = '100px';
                imgElement.style.objectFit = 'cover';
                imgElement.style.margin = '5px';
                imagePreview.appendChild(imgElement);
            } else {
                displayErrorMessage(result.detail);
                console.error('Failed to upload image:', file.name);
            }
        }
    });

    // Create advertisement form submission
    document.getElementById('createForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        const newAdvertisement = {
            price: parseInt(formData.get('price')),
            monthly_fee: parseInt(formData.get('monthly_fee')),
            square_meters: parseInt(formData.get('square_meters')),
            rooms: parseInt(formData.get('rooms')),
            located_at_top: formData.get('located_at_top') ? true : false,
            address: formData.get('address'),
            city: "Auto-generated City",  // Auto-generate or leave blank for backend to handle
        };

        const response = await authFetch('advertisement', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newAdvertisement)
        });
        if (!response.ok) {
            displayErrorMessage(response.message);
            console.log(response)
            throw new Error('Failed to create advertisement');
        }

        alert('advertisement created successfully!');
        fetchAndDisplayAdvertisements(); // Refresh the listings
    });
}