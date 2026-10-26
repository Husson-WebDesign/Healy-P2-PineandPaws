document.addEventListener("DOMContentLoaded", function () {

    // -----------------------------------------------------
    // Mobile Navigation Toggle
    // Runs on: index.html, about.html, services.html, pet-care.html, Book.html
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
    // Booking Form Validation
    // -----------------------------------------------------
    const bookingForm = document.querySelector("#booking-form");

    if (bookingForm) {
        bookingForm.addEventListener("submit", function (event) {
            const nameInput = document.querySelector("#owner-name");
            const emailInput = document.querySelector("#owner-email");
            const phoneInput = document.querySelector("#owner-phone");
            const petNameInput = document.querySelector("#pet-name");
            const serviceSelect = document.querySelector("#service-select");

            const nameError = document.querySelector("#name-error");
            const emailError = document.querySelector("#email-error");
            const phoneError = document.querySelector("#phone-error");
            const petNameError = document.querySelector("#pet-name-error");
            const serviceError = document.querySelector("#service-error");
            const formSuccess = document.querySelector("#form-success");

            let hasErrors = false;

            if (nameError) nameError.textContent = "";
            if (emailError) emailError.textContent = "";
            if (phoneError) phoneError.textContent = "";
            if (petNameError) petNameError.textContent = "";
            if (serviceError) serviceError.textContent = "";
            if (formSuccess) formSuccess.textContent = "";

            if (nameInput && nameInput.value.trim() === "") {
                if (nameError) nameError.textContent = "Please enter your name.";
                hasErrors = true;
            }

            if (emailInput) {
                const emailVal = emailInput.value.trim();
                if (emailVal === "") {
                    if (emailError) emailError.textContent = "Please enter your email address.";
                    hasErrors = true;
                } else if (!emailVal.includes("@") || !emailVal.includes(".")) {
                    if (emailError) emailError.textContent = "Please enter a valid email address.";
                    hasErrors = true;
                }
            }

            if (phoneInput && phoneInput.value.trim() === "") {
                if (phoneError) phoneError.textContent = "Please enter your phone number.";
                hasErrors = true;
            }

            if (petNameInput && petNameInput.value.trim() === "") {
                if (petNameError) petNameError.textContent = "Please enter your pet's name.";
                hasErrors = true;
            }

            if (serviceSelect && serviceSelect.value === "") {
                if (serviceError) serviceError.textContent = "Please select a service.";
                hasErrors = true;
            }

            if (hasErrors) {
                event.preventDefault();
            } else {
                event.preventDefault();
                if (formSuccess) {
                    formSuccess.textContent = "Thank you! Your appointment request has been received.";
                }
                bookingForm.reset();
            }
        });
    }

    // -----------------------------------------------------
    // FAQ Accordion Toggle (Optional Feature)
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
// =========================================================
// Form Dropdown Toggle (Book.html)
// =========================================================
const formToggleBtn = document.querySelector(".form-toggle-btn");
const formDropdownContent = document.querySelector(".form-dropdown-content");

if (formToggleBtn && formDropdownContent) {
    formToggleBtn.addEventListener("click", function () {
        if (formDropdownContent.style.display === "block") {
            formDropdownContent.style.display = "none";
            formToggleBtn.setAttribute("aria-expanded", "false");
            formToggleBtn.textContent = "Click here to open the appointment request form ▼";
        } else {
            formDropdownContent.style.display = "block";
            formToggleBtn.setAttribute("aria-expanded", "true");
            formToggleBtn.textContent = "Close appointment request form ▲";
        }
    });
}
const cardToggles = document.querySelectorAll(".card-toggle-btn");

if (cardToggles.length > 0) {
    cardToggles.forEach(function (button) {
        button.addEventListener("click", function () {
            const parentCard = this.parentElement;
            
            parentCard.classList.toggle("active");
            
            const isOpen = parentCard.classList.contains("active");
            this.setAttribute("aria-expanded", isOpen);
        });
    });
}