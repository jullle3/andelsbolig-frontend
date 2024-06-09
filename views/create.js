document.addEventListener('DOMContentLoaded', () => {
    const createForm = document.getElementById('createForm');

    createForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(createForm);
        const newListing = {
            title: formData.get('title'),
            description: formData.get('description'),
            price: parseInt(formData.get('price')),
            monthly_fee: parseInt(formData.get('monthly_fee')),
            address: formData.get('address'),
            city: formData.get('city'),
            postal_code: formData.get('postal_code'),
            square_meters: parseInt(formData.get('square_meters')),
            number_of_rooms: parseInt(formData.get('number_of_rooms')),
            contact_email: [formData.get('contact_email')],
            images: formData.get('images').split(',').map(img => img.trim()),
            date_posted: Math.floor(Date.now() / 1000),
            located_at_top: false,
            location: [0, 0], // Dummy location, replace with actual logic if needed
            views: 0,
            deleted: false
        };

        try {
            await createListing(newListing);
            alert('Listing created successfully!');
            createForm.reset();
            showView('home');
            fetchListings().then(data => displayListings(data.objects)); // Refresh the listings
        } catch (error) {
            console.error('Error creating listing:', error);
            alert('Failed to create listing');
        }
    });
});
