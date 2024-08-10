import {authFetch} from "../auth/auth.js";
import {fetchAndDisplayAdvertisements} from "../home/home.js";
import {decodeJwt, displayErrorMessage} from "../utils.js";


export async function setupCreateAdvertisementView() {
    const createAdvertisementView = document.getElementById('create-view');
    createAdvertisementView.style.display = 'none'; // Hide the view by default

    // Handle image uploads
    document.getElementById('create-images').addEventListener('change', async (event) => {
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
                const imgElement = createImageElement(result);
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

        // Format the price and monthly_fee fields
        const priceInput = document.getElementById('display_price');
        const monthlyFeeInput = document.getElementById('display_monthly_fee');

        const formatNumber = (input) => {
            let with_dots = input.value;
            input.value = with_dots.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            return input.value.replace(/\./g, '');
        };

        const formattedPrice = formatNumber(priceInput);
        const formattedMonthlyFee = formatNumber(monthlyFeeInput);

        const newAdvertisement = {
            title: formData.get('title'),
            description: formData.get('description'),
            price: parseInt(formattedPrice),
            monthly_fee: parseInt(formattedMonthlyFee),
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
        await populateCreateAdvertisementForm();
    });

}


export async function populateCreateAdvertisementForm() {
    /**
     * Populates the create advertisement form with existing advertisement data if available.
     *
     * This function decodes the JWT to get the logged-in user's ID, fetches the advertisement
     * created by the user, and populates the form fields with the advertisement data if it exists.
     */

    const decodedJwt = decodeJwt();

    if (!decodedJwt) {
        // User's not logged in
        return;
    }

    // Fetch existing advertisement
    const response = await authFetch('advertisement?created_by=' + decodedJwt.sub);
    const data = await response.json();
    const advertisement = data.objects[0]; // Assuming only one advertisement per user

    // Populate form fields if advertisement exists
    if (advertisement) {
        document.getElementById('title').value = advertisement.title || '';
        document.getElementById('description').value = advertisement.description || '';
        document.getElementById('price').value = advertisement.price || '';
        document.getElementById('monthly_fee').value = advertisement.monthly_fee || '';
        document.getElementById('address').value = advertisement.address || '';
        document.getElementById('square_meters').value = advertisement.square_meters || '';
        document.getElementById('rooms').value = advertisement.rooms || '';
        document.getElementById('located_at_top').checked = advertisement.located_at_top || false;

        // Display existing images
        const imagePreview = document.getElementById('imagePreview');
        advertisement.images.forEach(img => {
            const imgElement = createImageElement(img);
            imagePreview.appendChild(imgElement);
        });
    }
}


function createImageElement(img) {
    const imgContainer = document.createElement('div');
    imgContainer.style.position = 'relative';
    imgContainer.style.display = 'inline-block';
    imgContainer.style.margin = '5px';
    imgContainer.className = 'thumbnail';

    const imgElement = document.createElement('img');
    imgElement.src = img.thumbnail_url;
    imgElement.alt = 'advertisement image';
    imgElement.style.width = '100px';
    imgElement.style.height = '100px';
    imgElement.style.objectFit = 'cover';
    imgElement.style.display = 'block';

    const deleteIcon = document.createElement('i');
    deleteIcon.className = 'bi bi-x-circle-fill';
    deleteIcon.style.position = 'absolute';
    deleteIcon.style.top = '5px';
    deleteIcon.style.right = '5px';
    deleteIcon.style.color = 'black';
    deleteIcon.style.fontSize = '25px';
    deleteIcon.style.display = 'none';
    deleteIcon.style.cursor = 'pointer';

    // Add hover effects to show delete icon
    imgContainer.addEventListener('mouseover', () => {
        deleteIcon.style.display = 'block';
    });
    imgContainer.addEventListener('mouseout', () => {
        deleteIcon.style.display = 'none';
    });

    // Add click event listener to delete the image
    deleteIcon.addEventListener('click', async () => {
        const userConfirmed = confirm('Are you sure you want to delete this image?');
        if (!userConfirmed) {
            return;
        }

        const thumbnail_name = img.thumbnail_url.split('/').pop();
        const response = await authFetch(`upload/${encodeURIComponent(thumbnail_name)}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            imgContainer.remove();
        } else {
            displayErrorMessage('Failed to delete image');
        }
    });

    imgContainer.appendChild(imgElement);
    imgContainer.appendChild(deleteIcon);

    return imgContainer;
}