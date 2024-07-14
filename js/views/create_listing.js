import {authFetch} from "../auth.js";

export function setupCreateListingView() {
    const createListingView = document.getElementById('create-view');
    createListingView.style.display = 'none'; // Hide the view by default

    // Handle image uploads
    document.getElementById('images').addEventListener('change', async (event) => {
        const files = event.target.files;
        const imagePreview = document.getElementById('imagePreview');

        for (const file of files) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await authFetch('upload', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    const result = await response.json();

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
                    console.error('Failed to upload image:', file.name);
                }
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    });

    // Handle create listing form submission
    document.getElementById('createForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        const newListing = {
            title: "Auto-generated Title",  // Auto-generate or leave blank for backend to handle
            description: "Auto-generated Description",  // Auto-generate or leave blank for backend to handle
            price: parseInt(formData.get('price')),
            monthly_fee: parseInt(formData.get('monthly_fee')),
            address: formData.get('address'),
            city: "Auto-generated City",  // Auto-generate or leave blank for backend to handle
            postal_code: "0000",  // Auto-generate or leave blank for backend to handle
            square_meters: parseInt(formData.get('square_meters')),
            number_of_rooms: parseInt(formData.get('number_of_rooms')),
            contact_email: [formData.get('contact_email')],
            date_posted: Math.floor(Date.now() / 1000),
            located_at_top: formData.get('located_at_top') ? true : false,
            location: [0, 0], // Dummy location, replace with actual logic if needed
            views: 0,
            deleted: false
        };

        try {
            const response = await authFetch('advertisement', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newListing)
            });
            console.log("Response:", response); // Debugging

            if (!response.ok) {
                throw new Error('Failed to create listing');
            }

            alert('Listing created successfully!');
            fetchAndDisplayAdvertisements(); // Refresh the listings
        } catch (error) {
            console.error('Error creating listing:', error);
            alert('Failed to create listing');
        }
    });
}
