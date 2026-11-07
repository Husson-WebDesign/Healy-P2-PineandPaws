// ==========================================
// Pine & Paws Pet Grooming - Master Script
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------------------
    // 1. Mobile Navigation Toggle
    // -----------------------------------------------------
    const menuButton = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".main-nav");

    if (menuButton && navigation) {
        menuButton.addEventListener("click", function () {
            navigation.classList.toggle("open");
            const isOpen = navigation.classList.contains("open");
            menuButton.setAttribute("aria-expanded", isOpen);
        });
    }

    // -----------------------------------------------------
    // 2. Services JSON Fetching & Filtering (services.html)
    // -----------------------------------------------------
    initServices();

    // -----------------------------------------------------
    // 3. Inquiry Form Validation & Demonstration Preview (contact.html)
    // -----------------------------------------------------
    initContactForm();

    // -----------------------------------------------------
    // 4. FAQ Accordion Toggle (if present)
    // -----------------------------------------------------
    const faqCards = document.querySelectorAll(".faq-card");
    if (faqCards.length > 0) {
        faqCards.forEach(function (card) {
            card.addEventListener("click", function () {
                card.classList.toggle("active");
            });
        });
    }
});

/* ==========================================
   Services Handling with Local Fallback
   ========================================== */
async function initServices() {
    const container = document.getElementById('services-grid');
    if (!container) return; // Only runs on services.html

    // Fallback data prevents crashes if opened locally via file:// (CORS restriction)
    const fallbackServices = [
        {
            "id": "bath-brush",
            "name": "Bath & Brush",
            "category": "all",
            "startingPrice": "$35",
            "duration": "1 - 1.5 hours",
            "description": "A complete bathing and brushing service designed to clean the coat, remove loose fur, and leave pets feeling fresh.",
            "suitability": "Ideal for routine coat maintenance for all dogs and cats."
        },
        {
            "id": "full-groom",
            "name": "Full Groom",
            "category": "dog",
            "startingPrice": "$55",
            "duration": "2 - 3 hours",
            "description": "Comprehensive grooming service including bath, blow-dry, styling hair cut, nail trim, and ear cleaning.",
            "suitability": "Recommended for breeds requiring regular haircutting or heavy coat styling."
        },
        {
            "id": "puppy-intro",
            "name": "Puppy Introduction",
            "category": "puppy",
            "startingPrice": "$30",
            "duration": "45 - 60 mins",
            "description": "Gentle introductory session to acclimate young pets to salon equipment, sounds, and positive handling.",
            "suitability": "Designed specifically for puppies under 6 months old."
        },
        {
            "id": "nail-care",
            "name": "Nail Care",
            "category": "all",
            "startingPrice": "$15",
            "duration": "15 - 30 mins",
            "description": "Nail trimming and filing to promote healthy paw structure and comfortable walking.",
            "suitability": "Suitable for all dogs and cats as a standalone or add-on service."
        },
        {
            "id": "de-shedding",
            "name": "De-Shedding Treatment",
            "category": "dog",
            "startingPrice": "$45",
            "duration": "1.5 - 2 hours",
            "description": "Specialized undercoat removal using de-shedding shampoos, conditioners, and targeted brushing tools.",
            "suitability": "Best for double-coated breeds experiencing heavy seasonal shedding."
        },
        {
            "id": "cat-grooming",
            "name": "Cat Grooming",
            "category": "cat",
            "startingPrice": "$50",
            "duration": "1 - 2 hours",
            "description": "Patience-focused feline grooming service including gentle bath, dry, brush-out, and nail trim.",
            "suitability": "Tailored for long-haired or short-haired cats needing coat maintenance."
        }
    ];

    let services = [];
    try {
        const response = await fetch('data/services.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        services = await response.json();
    } catch (error) {
        console.warn('Notice: Local JSON fetch restricted by browser. Using built-in service fallback data.');
        services = fallbackServices;
    }
    
    renderServices(services, container);
    setupFilterButtons(services, container);
    checkUrlFilter(services, container);
}

function renderServices(services, container) {
    if (services.length === 0) {
        container.innerHTML = `
            <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <h3>No Matching Services Found</h3>
                <p>We couldn't find any services matching your selected category.</p>
                <button class="button button-outline" id="reset-filter-btn" style="margin-top: 1rem;">View All Services</button>
            </div>
        `;
        document.getElementById('reset-filter-btn')?.addEventListener('click', () => {
            document.querySelector('[data-filter="all"]')?.click();
        });
        return;
    }

    container.innerHTML = services.map(service => `
        <article class="card service-card">
            <div class="service-card-header" style="display: flex; justify-content: space-between; align-items: baseline;">
                <h3>${service.name}</h3>
                <span class="badge" style="background-color: var(--bg-alt, #e8f0eb); color: var(--primary, #2c4a3e); padding: 0.25rem 0.75rem; border-radius: 12px; font-weight: 600;">Starting at ${service.startingPrice}</span>
            </div>
            <p style="margin: 0.75rem 0;">${service.description}</p>
            <p><small><strong>Approximate Duration:</strong> ${service.duration}</small></p>
            <p><small><em>${service.suitability}</em></small></p>
            <div class="card-footer-action" style="margin-top: 1.25rem;">
                <a href="contact.html?service=${service.id}" class="button" style="display: inline-block;">Prepare Inquiry for ${service.name}</a>
            </div>
        </article>
    `).join('');
}

function setupFilterButtons(services, container) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => {
                b.classList.remove('active');
                b.style.backgroundColor = 'transparent';
                b.style.color = 'var(--primary, #2c4a3e)';
            });
            btn.classList.add('active');
            btn.style.backgroundColor = 'var(--primary, #2c4a3e)';
            btn.style.color = '#ffffff';

            const category = btn.getAttribute('data-filter');
            const filtered = category === 'all' 
                ? services 
                : services.filter(s => s.category === category || s.category === 'all');
            
            renderServices(filtered, container);
        });
    });
}

function checkUrlFilter(services, container) {
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');
    if (filterParam) {
        const filtered = services.filter(s => s.id === filterParam);
        if (filtered.length > 0) {
            renderServices(filtered, container);
        }
    }
}

/* ==========================================
   Contact Form Preselection & Preview Modal
   ========================================== */
function initContactForm() {
    const form = document.getElementById('inquiry-form');
    if (!form) return; // Only runs on contact.html

    const urlParams = new URLSearchParams(window.location.search);
    const selectedService = urlParams.get('service');
    if (selectedService) {
        const serviceSelect = document.getElementById('service-interest');
        if (serviceSelect) serviceSelect.value = selectedService;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        showPreviewModal(data, form);
    });
}

function showPreviewModal(data, form) {
    const overlay = document.createElement('div');
    overlay.id = 'preview-modal-overlay';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(0, 0, 0, 0.6); display: flex;
        align-items: center; justify-content: center; z-index: 1000; padding: 1rem;
    `;

    overlay.innerHTML = `
        <div style="background-color: #fff; max-width: 550px; width: 100%; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); max-height: 90vh; overflow-y: auto;">
            <h2 style="color: var(--primary, #2c4a3e); margin-bottom: 0.5rem;">Inquiry Demonstration Preview</h2>
            <p style="font-size: 0.9rem; color: #555; margin-bottom: 1.5rem;">
                <em>Note: This website is an educational student demonstration project. No live booking has been received, processed, or stored.</em>
            </p>
            <ul style="list-style: none; padding: 0; margin-bottom: 1.5rem; line-height: 1.8;">
                <li><strong>Owner Name:</strong> ${escapeHtml(data.ownerName)}</li>
                <li><strong>Email:</strong> ${escapeHtml(data.ownerEmail)}</li>
                <li><strong>Phone:</strong> ${escapeHtml(data.ownerPhone)}</li>
                <li><strong>Pet Name:</strong> ${escapeHtml(data.petName)} (${escapeHtml(data.petType)})</li>
                <li><strong>Requested Service:</strong> ${escapeHtml(data.serviceInterest)}</li>
                <li><strong>Preferred Day:</strong> ${escapeHtml(data.preferredDay || 'Flexible')}</li>
                <li><strong>Notes/Special Needs:</strong> ${escapeHtml(data.petNotes || 'None provided')}</li>
            </ul>
            <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                <button type="button" id="edit-inquiry-btn" class="button button-outline">Edit Information</button>
                <button type="button" id="close-inquiry-btn" class="button">Done / Reset Form</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById('edit-inquiry-btn').addEventListener('click', () => {
        document.body.removeChild(overlay);
    });

    document.getElementById('close-inquiry-btn').addEventListener('click', () => {
        document.body.removeChild(overlay);
        form.reset();
    });
}

function escapeHtml(str) {
    return String(str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}