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

function insertHeader() {
    document.body.insertAdjacentHTML('afterbegin', headerTemplate);
}
