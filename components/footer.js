const footerTemplate = `
<footer>
    <p>&copy; 2024 Andelsboliger Portal. All rights reserved.</p>
</footer>
`;

function insertFooter() {
    document.body.insertAdjacentHTML('beforeend', footerTemplate);
}
