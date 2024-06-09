// components.js

const headerTemplate = `
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
`;

const footerTemplate = `
<footer>
    <p>&copy; 2024 Andelsboliger Portal. All rights reserved.</p>
</footer>
`;

// Function to insert header
function insertHeader() {
    document.body.insertAdjacentHTML('afterbegin', headerTemplate);
}

// Function to insert footer
function insertFooter() {
    document.body.insertAdjacentHTML('beforeend', footerTemplate);
}
