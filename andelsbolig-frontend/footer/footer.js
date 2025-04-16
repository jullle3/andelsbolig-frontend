import {basePath, stripe_customer_portal} from "../config/config.js";

export function SetupFooter() {
    const currentYear = new Date().getFullYear();

    document.body.insertAdjacentHTML('beforeend', `
<!-- Example Static Footer -->
<footer class="border-top py-3 mt-4" style="background-color: #fafafa;">
  <div class="container">
    <div class="row align-items-center">
      <!-- Left Column: Copyright -->
      <div class="col-4 text-start">
        <small
            class="text-muted"
            id="footer-cvr"
            role="button"
            style="cursor: pointer;"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="CVR: 40606130"
        >
            &copy; ${currentYear} Andelsbolig Basen
        </small>
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
            <a href="${stripe_customer_portal}" target="_blank" class="nav-link px-2 text-muted">Kundeportal</a>
          </li>
          <li class="nav-item">
            <a href="#" data-bs-toggle="modal" data-bs-target="#aboutModal" class="nav-link px-2 text-muted">Om</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</footer>

  `);

    // Setup Bootstrap tooltip
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
        new bootstrap.Tooltip(el);
    });

    const footerCvrEl = document.getElementById('footer-cvr');
    const cvrNumber = '40606130';

    if (footerCvrEl) {
        const tooltip = bootstrap.Tooltip.getInstance(footerCvrEl);

        footerCvrEl.addEventListener('click', () => {
            navigator.clipboard.writeText(cvrNumber).then(() => {
                // Temporarily change tooltip content
                tooltip.setContent({ '.tooltip-inner': 'CVR kopieret' });
                tooltip.show();

                setTimeout(() => {
                    tooltip.setContent({ '.tooltip-inner': 'CVR: 40606130' });
                }, 2500);
            });
        });
    }
}