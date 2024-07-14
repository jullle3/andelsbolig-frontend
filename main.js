import { authFetch } from './js/auth.js';



document.addEventListener('DOMContentLoaded', () => {
    // Insert header
    document.body.insertAdjacentHTML('afterbegin', `
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container">
    <a class="navbar-brand" href="#" data-view="home">
      <img src="/favicon/android-chrome-512x512.png" alt="Logo" style="height: 80px;"> Andelsbolig Basen
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarContent">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <a class="nav-link" href="#" data-view="create">Opret Annonce</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#" data-view="register">Opret Bruger</a>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbar-name" data-view="profile" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            My name
          </a>
          <ul class="dropdown-menu" aria-labelledby="navbar-name">
            <li><a class="dropdown-item" href="#" data-view="profile">My Profile</a></li>
            <li><a class="dropdown-item" href="#" id="logoutLink">Logout</a></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</nav>
    `);

    // Setup click events for all elements with a 'data-view' attribute
    const clickableElements = document.querySelectorAll('[data-view]'); // This now includes the navbar brand

    clickableElements.forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            // Remove 'active' class from all clickable elements
            clickableElements.forEach(el => el.classList.remove('active'));
            // Add 'active' class to the clicked element if it's not the logo (handled separately if needed)
            if (this !== document.querySelector('.navbar-brand')) {
                this.classList.add('active');
            }
            const viewName = this.getAttribute('data-view');
            showView(viewName); // Call the function to update the view
        });
    });

    const views = {
        home: document.getElementById('home-view'),
        detail: document.getElementById('detail-view'),
        login: document.getElementById('login-view'),
        create: document.getElementById('create-view'),
        register: document.getElementById('register-view'),
        profile: document.getElementById('profile-view')
    };

    function showView(view) {
        Object.values(views).forEach(v => v.style.display = 'none');
        views[view].style.display = 'block';
    }

    // Navigation
    // document.querySelectorAll('nav a').forEach(link => {
    //     link.addEventListener('click', (e) => {
    //         e.preventDefault();
    //         const view = e.target.getAttribute('data-view');
    //         showView(view);
    //     });
    // });

    // Show home view by default
    // showView('home');

    // Populate profile view
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
        const payload = jwt.split('.')[1]; // Get the payload part of the JWT
        const decodedPayload = atob(payload); // Base64 decode
        const payloadObj = JSON.parse(decodedPayload); // Parse the JSON string

        if (payloadObj.username) {
            document.getElementById('username-profile').textContent = payloadObj.username;
        }
        if (payloadObj.full_name) {
            document.getElementById('navbar-name').textContent = payloadObj.full_name;
            document.getElementById('fullName-profile').textContent = payloadObj.full_name;
        }
        if (payloadObj.email) {
            document.getElementById('email-profile').textContent = payloadObj.email;
        }
    }

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
            // event.target.reset();
            // showView('home');
            fetchListings().then(data => displayListings(data.objects)); // Refresh the listings
        } catch (error) {
            console.error('Error creating listing:', error);
            alert('Failed to create listing');
        }
    });

    // Fetch listings from the backend with optional search text
    async function fetchListings(searchText = '') {
        try {
            const response = await authFetch(`advertisement?text=${encodeURIComponent(searchText)}`);
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
                    ${listing.images.map(img => `<img src="${img.thumbnail_url}" alt="Image of an apartment" />`).join('')}
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
            const response = await authFetch(`advertisement/${id}`);
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
            <p><strong>Date Posted:</strong> ${new Date(listing.created).toLocaleDateString()}</p>
            <p><strong>Contact Email:</strong> ${listing.contact_email.join(', ')}</p>
            <div class="images">
                ${listing.images.map(img => `<img src="${img.url}" alt="Image of an apartment" />`).join('')}
            </div>
        `;
        showView('detail');
    }

    document.getElementById('backButton').addEventListener('click', () => {
        showView('home');
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


    const registerForm = document.getElementById('registerForm');

    // Register user
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(registerForm);
        const userData = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
            full_name: formData.get('full_name') || null, // Handle optional fields
            phone_number: formData.get('phone_number') || null
        };

            const response = await authFetch('user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                const result = await response.json();
                localStorage.setItem('jwt', result.jwt);
                alert('User registered successfully'); // Consider updating this to a more user-friendly message display as well
                registerForm.reset();
                showView('home');
            }
            else {
                const errorResponse = await response.json(); // Parse the error response
                const errorMessage = errorResponse.detail || 'Failed to register user';
                const errorElement = document.getElementById('error-message');
                errorElement.textContent = errorMessage; // Set the error message
                errorElement.classList.remove('d-none', 'fade-out'); // Make sure the error message is visible and reset fade-out

                // Wait for 4 seconds before starting the fade out
                setTimeout(() => {
                    errorElement.classList.add('fade-out');

                    // Wait for the fade-out transition to end before hiding the element
                    errorElement.addEventListener('transitionend', () => {
                        errorElement.classList.add('d-none'); // Hide the element after fade-out
                        errorElement.classList.remove('fade-out'); // Reset for next time
                    }, { once: true }); // Ensure the event listener is removed after it fires
                }, 4000);
            }


    });


    // LOGOUT
    const logoutLink = document.getElementById("logoutLink");

    logoutLink.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent the default link behavior
        // Clear JWT from localStorage
        localStorage.removeItem('jwt');
        showView('home');
    });
});
