import { basePath } from "../config/config.js";

export function SetupHeader() {
    document.body.insertAdjacentHTML('afterbegin', `
<nav class="navbar navbar-expand-lg navbar-light bg-white navbar-shadow">
  <div class="container">
    <a class="navbar-brand" href="#" data-view="home">
      <img src="../${basePath}favicon/android-chrome-512x512.png" alt="Logo" style="height: 40px;"> Andelsbolig Basen
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarContent">
      <ul class="navbar-nav ms-auto">
<!--        <li class="nav-item"><a class="nav-link" href="#" data-view="faq">FAQ</a></li>-->
        <li class="nav-item"><a class="nav-link" href="#" data-view="map">Kort</a></li>
        <li class="nav-item"><a class="nav-link" href="#" data-view="payment2">Abonnér</a></li>
        <li class="nav-item"><a class="nav-link" href="#" data-view="create">Opret & Rediger Annonce</a></li>
        <li class="nav-item"><a class="nav-link" href="#" data-view="register">Opret Bruger</a></li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbar-name" role="button" data-bs-toggle="dropdown" aria-expanded="false">Hej! Log ind her</a>
          <ul class="dropdown-menu dropdown-content" aria-labelledby="navbar-name">
            <li><a class="dropdown-item" href="#" data-view="profile">My Profile</a></li>
            <li><a class="dropdown-item" href="#" id="logoutLink">Logout</a></li>
            <li><a class="dropdown-item" href="#" data-view="login">Login</a></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</nav>
    `);


    // Add event listener to all nav links
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', function() {
            // Remove 'active' class from all links
            document.querySelectorAll('nav ul li a').forEach(link => link.classList.remove('active'));
            // Add 'active' class to the clicked link
            this.classList.add('active');
        });
    });
}