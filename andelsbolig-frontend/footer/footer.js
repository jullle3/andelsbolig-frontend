import {basePath} from "../config/config.js";

export function SetupFooter() {
    const currentYear = new Date().getFullYear();

    document.body.insertAdjacentHTML('beforeend', `
<!-- Example Static Footer -->
<footer class="border-top py-3" style="background-color: #fafafa;">
  <div class="container">
    <div class="row align-items-center">
      <!-- Left Column: Copyright -->
      <div class="col-4 text-start">
        <small class="text-muted">&copy; ${currentYear} Andelsbolig Basen</small>
<!--        <small class="text-muted">CVR 40606130</small>-->
      </div>
      
      <!-- Middle Column: Logo -->
      <div class="col-4 text-center">
        <a href="#">
          <img src="../${basePath}/favicon/android-chrome-192x192.webp" alt="Logo" class="footer-logo" style="height: 50px;">
        </a>
      </div>

      <!-- Right Column: Nav Links -->
      <div class="col-4 text-end">
        <ul class="nav justify-content-end">
          <li class="nav-item">
            <a href="mailto:kontakt@andelsboligbasen.dk" class="nav-link px-2 text-muted">Kontakt</a>
          </li>
          <li class="nav-item">
            <a href="/boligmarked" class="nav-link px-2 text-muted">Boligmarked</a>
          </li>
          <li class="nav-item">
            <a href="/about" class="nav-link px-2 text-muted">Om</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</footer>

  `);
}