/* ============================================================
   HELPERS
   Small reusable utilities used throughout the file.
   ============================================================ */

/**
 * Shorthand for document.getElementById.
 * @param {string} id
 * @returns {HTMLElement|null}
 */
const $ = (id) => document.getElementById(id);

/**
 * Reset the hamburger icon back to the "menu" state.
 * Extracted so it can be called from multiple event handlers.
 */
function closeMenu() {
  navMenu.classList.remove("show");
  const icon = navToggle?.querySelector("i");
  if (icon) {
    icon.classList.add("bx-menu");
    icon.classList.remove("bx-x");
  }
}

/* ============================================================
   ELEMENT REFERENCES
   Queried once at the top — avoids repeated DOM lookups.
   ============================================================ */
const navToggle = $("nav-toggle");
const navMenu   = $("nav-menu");

/* ============================================================
   HAMBURGER MENU — open / close on toggle button click
   ============================================================ */
navToggle?.addEventListener("click", () => {
  navMenu.classList.toggle("show");

  // Swap the icon between ☰ (menu) and ✕ (close)
  const icon = navToggle.querySelector("i");
  if (icon) {
    icon.classList.toggle("bx-menu");
    icon.classList.toggle("bx-x");
  }
});

/* ============================================================
   CLOSE MENU — when any nav link is clicked (mobile UX)
   ============================================================ */
document.querySelectorAll(".nav__link").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

/* ============================================================
   CLOSE MENU — when the user taps outside the panel
   ============================================================ */
document.addEventListener("click", (e) => {
  if (
    navMenu?.classList.contains("show") &&
    !navMenu.contains(e.target) &&
    !navToggle.contains(e.target)
  ) {
    closeMenu();
  }
});

/* ============================================================
   ACTIVE NAV LINK ON SCROLL
   Highlights the link that corresponds to the visible section.
   ============================================================ */
const sections = document.querySelectorAll("section[id]");

function updateActiveLink() {
  const scrollY = window.scrollY;

  sections.forEach((section) => {
    const top    = section.offsetTop - 58; // account for fixed header
    const bottom = top + section.offsetHeight;
    const id     = section.getAttribute("id");
    const link   = document.querySelector(`.nav__menu a[href*="${id}"]`);

    if (link) {
      link.classList.toggle("active-link", scrollY > top && scrollY <= bottom);
    }
  });
}

window.addEventListener("scroll", updateActiveLink);

/* ============================================================
   SCROLL REVEAL ANIMATIONS
   Groups are staggered for a polished entrance effect.
   ============================================================ */
const sr = ScrollReveal({
  origin:   "top",
  distance: "60px",
  duration: 2000,
  delay:    200,
});

// Immediate reveal targets
sr.reveal(".home__data, .about__img, .skills__subtitle, .skills__text");

// Slightly delayed secondary elements
sr.reveal(".home__img, .about__subtitle, .about__text, .skills__img", { delay: 400 });

// Staggered social icons (one after another)
sr.reveal(".home__social-icon", { interval: 200 });

// Staggered skill bars and contact inputs
sr.reveal(".skills__data, .contact__input", { interval: 200 });

/* ============================================================
   DARK MODE TOGGLE
   Persists the user's preference in localStorage.
   ============================================================ */
const darkModeToggle = $("dark-mode");

/** Update the toggle icon to match the current mode. */
function syncDarkModeIcon(isDark) {
  if (darkModeToggle) {
    darkModeToggle.innerHTML = isDark
      ? '<i class="bx bxs-sun"></i>'
      : '<i class="bx bxs-moon"></i>';
  }
}

// Restore saved preference on page load
const savedMode = localStorage.getItem("dark-mode") === "enabled";
if (savedMode) {
  document.body.classList.add("dark-mode");
  syncDarkModeIcon(true);
}

darkModeToggle?.addEventListener("click", (e) => {
  e.preventDefault();
  const isDark = document.body.classList.toggle("dark-mode");
  syncDarkModeIcon(isDark);
  localStorage.setItem("dark-mode", isDark ? "enabled" : "disabled");
});

/* ============================================================
   CONTACT FORM — mailto handler with validation
   Opens the user's default mail client with pre-filled content.
   ============================================================ */
const contactForm = $("contact-form");

if (contactForm) {
  const nameInput    = $("contact-name");
  const emailInput   = $("contact-email");
  const messageInput = $("contact-message");
  const errorEl      = $("contact-error");
  const successEl    = $("contact-success");

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const RECIPIENT     = "sunarsumit011@gmail.com";

  /** Show an error message and clear any existing success message. */
  function showError(msg) {
    errorEl.textContent   = msg;
    successEl.textContent = "";
  }

  /** Show a success message and clear any existing error message. */
  function showSuccess(msg) {
    successEl.textContent = msg;
    errorEl.textContent   = "";
  }

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name    = nameInput.value.trim();
    const email   = emailInput.value.trim();
    const message = messageInput.value.trim();

    // Validate: all fields required
    if (!name || !email || !message) {
      showError("Please fill in all fields before sending.");
      return;
    }

    // Validate: well-formed email address
    if (!EMAIL_PATTERN.test(email)) {
      showError("Please enter a valid email address.");
      return;
    }

    // Build the mailto URI and open it in the default mail app
    const subject = encodeURIComponent(`New message from ${name}`);
    const body    = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );
    window.location.href = `mailto:${RECIPIENT}?subject=${subject}&body=${body}`;

    showSuccess(
      "Your email client should open now. " +
      "If nothing happened, make sure a default mail app is configured on your device."
    );

    contactForm.reset();
  });
}
