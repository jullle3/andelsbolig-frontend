import { isLoggedIn, decodeJwt } from "../utils.js";
import {basePath} from "../config/config.js";

export function SetupHeader() {
    document.body.insertAdjacentHTML('afterbegin', `
    <nav class="navbar navbar-expand-lg navbar-light bg-white navbar-shadow">
      <div class="container">
        <a class="navbar-brand" href="#" data-view="advertisement_list">
          <img src="../${basePath}/favicon/android-chrome-512x512.webp" alt="Logo" style="height: 40px;"> Andelsbolig Basen
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarContent">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item"><a class="nav-link" href="#" data-view="advertisement_map">Kort</a></li>
            <li class="nav-item"><a class="nav-link" href="#" data-view="create">Din Annonce</a></li>
            <li class="nav-item"><a class="nav-link" href="#" data-view="agent">Annonceagenter</a></li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbar-name" role="button" data-bs-toggle="dropdown">Hej! Log ind her</a>
              <ul class="dropdown-menu dropdown-content" aria-labelledby="navbar-name">
                <li><a class="dropdown-item" href="#" data-view="profile">Profil</a></li>
                <li><a class="dropdown-item" href="#" id="logout" id="logoutLink">Log ud</a></li>
                <li><a class="dropdown-item" href="#" data-view="login">Log ind / Opret</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>`);

    updateNavbar(); // Initial state check

    // Setup event handlers
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', function() {
            document.querySelectorAll('nav ul li a').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

export function updateNavbar() {
    const decodedJwt = decodeJwt();

    // Elements to toggle visibility
    const profileLink = document.querySelector('[data-view="profile"]').parentElement;
    const logoutLink = document.getElementById("logout").parentElement;
    const loginLink = document.querySelector('[data-view="login"]').parentElement;
    const navbarGreeting = document.getElementById('navbar-name');

    if (loggedIn()) {
        profileLink.style.display = 'block';
        logoutLink.style.display = 'block'
        loginLink.style.display = 'none';

        navbarGreeting.innerText = decodedJwt.full_name;
    } else {
        profileLink.style.display = 'none';
        logoutLink.style.display = 'none'
        loginLink.style.display = 'block';
        navbarGreeting.textContent = "Hej! Log ind her";
    }
}

// Helper to check login status
function loggedIn() {
    return localStorage.getItem('jwt') !== null;
}

// Call this function after login/logout actions
window.updateNavbar = updateNavbar;
