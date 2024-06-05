async function fetchAdvertisements() {
    const query = document.getElementById('search').value;
    try {
        const response = await fetch(`http://localhost:8500/advertisement?text=${query}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const ads = await response.json();
        displayAdvertisements(ads);
    } catch (error) {
        console.error('Error fetching advertisements:', error);
    }
}

function displayAdvertisements(ads) {
    const adsContainer = document.getElementById('ads');
    adsContainer.innerHTML = '';
    ads.forEach(ad => {
        const adCard = document.createElement('div');
        adCard.className = 'col-md-4 ad-card';
        adCard.innerHTML = `
            <div class="card">
                <img src="${ad.image}" class="card-img-top ad-img" alt="${ad.title}">
                <div class="card-body">
                    <h5 class="card-title">${ad.title}</h5>
                    <h6 class="card-subtitle mb-2">${ad.price}</h6>
                    <p class="card-text">${ad.description}</p>
                </div>
            </div>
        `;
        adsContainer.appendChild(adCard);
    });
}

// Add event listener for the search input
document.getElementById('search').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        fetchAdvertisements();
    }
});

// Fetch advertisements initially
// fetchAdvertisements();
