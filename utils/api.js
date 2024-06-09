async function fetchListings(searchText = '') {
    try {
        const response = await fetch(`http://localhost:8500/advertisement?text=${encodeURIComponent(searchText)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching listings:', error);
        throw error;
    }
}

async function fetchListingDetail(id) {
    try {
        const response = await fetch(`http://localhost:8500/advertisement/${id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching listing details:', error);
        throw error;
    }
}

async function createListing(data) {
    try {
        const response = await fetch('http://localhost:8500/advertisement', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Failed to create listing');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating listing:', error);
        throw error;
    }
}
