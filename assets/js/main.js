const $ = (id) => document.getElementById(id);

function closeMenu() {
  navMenu.classList.remove("show");
  const icon = navToggle?.querySelector("i");
  if (icon) {
    icon.classList.add("bx-menu");
    icon.classList.remove("bx-x");
  }
}

const navToggle = $("nav-toggle");
const navMenu = $("nav-menu");

navToggle?.addEventListener("click", () => {
  navMenu.classList.toggle("show");

  const icon = navToggle.querySelector("i");
  if (icon) {
    icon.classList.toggle("bx-menu");
    icon.classList.toggle("bx-x");
  }
});

document.querySelectorAll(".nav__link").forEach((link) => {
  if (!link.classList.contains("dark__mode")) {
    link.addEventListener("click", closeMenu);
  }
});

document.addEventListener("click", (e) => {
  if (
    navMenu?.classList.contains("show") &&
    !navMenu.contains(e.target) &&
    !navToggle.contains(e.target)
  ) {
    closeMenu();
  }
});

const sections = document.querySelectorAll("section[id]");

function updateActiveLink() {
  const scrollY = window.scrollY;

  sections.forEach((section) => {
    const top = section.offsetTop - 58;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute("id");
    const link = document.querySelector(`.nav__menu a[href*="${id}"]`);

    if (link) {
      link.classList.toggle("active-link", scrollY > top && scrollY <= bottom);
    }
  });
}

window.addEventListener("scroll", updateActiveLink);

if (typeof ScrollReveal !== "undefined") {
  const sr = ScrollReveal({
    origin: "top",
    distance: "60px",
    duration: 2000,
    delay: 200,
  });

  sr.reveal(".home__data, .about__img, .skills__subtitle, .skills__text");

  sr.reveal(".home__img, .about__subtitle, .about__text, .skills__img", {
    delay: 400,
  });

  sr.reveal(".home__social-icon", { interval: 200 });

  sr.reveal(".skills__data, .contact__input", { interval: 200 });
}

const darkModeToggle = $("dark-mode");

function syncDarkModeIcon(isDark) {
  if (darkModeToggle) {
    darkModeToggle.innerHTML = isDark
      ? '<i class="bx bxs-sun"></i>'
      : '<i class="bx bxs-moon"></i>';
  }
}

const savedMode = localStorage.getItem("dark-mode") === "enabled";
if (savedMode) {
  document.body.classList.add("dark-mode");
}
syncDarkModeIcon(savedMode);

darkModeToggle?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  const isDark = document.body.classList.toggle("dark-mode");
  syncDarkModeIcon(isDark);
  localStorage.setItem("dark-mode", isDark ? "enabled" : "disabled");
});

const contactForm = $("contact-form");

if (contactForm) {
  const nameInput = $("contact-name");
  const emailInput = $("contact-email");
  const messageInput = $("contact-message");
  const errorEl = $("contact-error");
  const successEl = $("contact-success");

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const RECIPIENT = "sunarsumit011@gmail.com";

  function showError(msg) {
    errorEl.textContent = msg;
    successEl.textContent = "";
  }

  function showSuccess(msg) {
    successEl.textContent = msg;
    errorEl.textContent = "";
  }

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !email || !message) {
      showError("Please fill in all fields before sending.");
      return;
    }

    if (!EMAIL_PATTERN.test(email)) {
      showError("Please enter a valid email address.");
      return;
    }

    const subject = encodeURIComponent(`New message from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    );
    window.location.href = `mailto:${RECIPIENT}?subject=${subject}&body=${body}`;

    showSuccess(
      "Your email client should open now. " +
        "If nothing happened, make sure a default mail app is configured on your device.",
    );

    contactForm.reset();
  });
}


const scrollTopBtn = $("scroll-top");

window.addEventListener("scroll", () => {
  if (!scrollTopBtn) return;
  if (window.scrollY > 300) {
    scrollTopBtn.classList.add("show");
  } else {
    scrollTopBtn.classList.remove("show");
  }
});

scrollTopBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

