// main.js

// Insert header and footer
document.addEventListener('DOMContentLoaded', () => {
    // Insert header and footer
    document.body.insertAdjacentHTML('afterbegin', `
        <header>
            <div class="logo">Andelsboliger Portal</div>
            <nav>
                <ul>
                    <li><a href="#" data-view="home">Home</a></li>
                    <li><a href="#" data-view="login">Login</a></li>
                    <li><a href="#" data-view="create">Create Listing</a></li>
                </ul>
                <div class="burger-menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </nav>
        </header>
    `);

    document.body.insertAdjacentHTML('beforeend', `
        <footer>
            <p>&copy; 2024 Andelsboliger Portal. All rights reserved.</p>
        </footer>
    `);

    const views = {
        home: document.getElementById('home-view'),
        detail: document.getElementById('detail-view'),
        login: document.getElementById('login-view'),
        create: document.getElementById('create-view')
    };

    function showView(view) {
        Object.values(views).forEach(v => v.style.display = 'none');
        views[view].style.display = 'block';
    }

    // Navigation
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const view = e.target.getAttribute('data-view');
            showView(view);
        });
    });

    // Show home view by default
    showView('home');

    // Fetch listings from the backend with optional search text
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

    // Display listings in the DOM
    function displayListings(listings) {
        const listingsContainer = document.getElementById('listings');
        listingsContainer.innerHTML = '';
        listings.forEach(listing => {
            const listingElement = document.createElement('div');
            listingElement.classList.add('listing');
            listingElement.innerHTML = `
                <h2>${listing.title}</h2>
                <p>${listing.description}</p>
                <p><strong>Price:</strong> ${listing.price} DKK</p>
                <button class="view-detail" data-id="${listing._id}">View Details</button>
                <div class="images">
                    ${listing.images.map(img => `<img src="${img}" alt="Image of ${listing.title}" />`).join('')}
                </div>
            `;
            listingsContainer.appendChild(listingElement);
        });

        document.querySelectorAll('.view-detail').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                fetchListingDetail(id).then(displayListingDetail);
            });
        });
    }

    // Fetch and display a single listing's details
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

    // Display a single listing's details in the DOM
    function displayListingDetail(listing) {
        const detailContainer = document.getElementById('detail');
        detailContainer.innerHTML = `
            <h2>${listing.title}</h2>
            <p>${listing.description}</p>
            <p><strong>Price:</strong> ${listing.price} DKK</p>
            <p><strong>Monthly Fee:</strong> ${listing.monthly_fee} DKK</p>
            <p><strong>Address:</strong> ${listing.address}, ${listing.city} ${listing.postal_code}</p>
            <p><strong>Square Meters:</strong> ${listing.square_meters} m²</p>
            <p><strong>Number of Rooms:</strong> ${listing.number_of_rooms}</p>
            <p><strong>Date Posted:</strong> ${new Date(listing.created * 1000).toLocaleDateString()}</p>
            <p><strong>Contact Email:</strong> ${listing.contact_email.join(', ')}</p>
            <div class="images">
                ${listing.images.map(img => `<img src="${img}" alt="Image of ${listing.title}" />`).join('')}
            </div>
        `;
        showView('detail');
    }

    document.getElementById('backButton').addEventListener('click', () => {
        showView('home');
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
            images: formData.get('images').split(',').map(img => img.trim()),
            created: Math.floor(Date.now() / 1000),
            // located_at_top: formData.get('located_at_top') ? true : false,
            location: [0, 0], // Dummy location, replace with actual logic if needed
            views: 0,
            deleted: false
        };

        console.log("New Listing Data:", newListing); // Debugging

        try {
            const response = await fetch('http://localhost:8500/advertisement', {
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
            event.target.reset();
            showView('home');
            fetchListings().then(data => displayListings(data.objects)); // Refresh the listings
        } catch (error) {
            console.error('Error creating listing:', error);
            alert('Failed to create listing');
        }
    });

    // Initial fetch of listings
    fetchListings().then(data => displayListings(data.objects));

    // Debounce function to delay the search
    function debounce(func, delay) {
        let debounceTimeout;
        return function (...args) {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // Add debounce to search input
    document.getElementById('searchBar').addEventListener('input', debounce((e) => {
        const searchTerm = e.target.value;
        fetchListings(searchTerm).then(data => displayListings(data.objects));
    }, 500));
});
