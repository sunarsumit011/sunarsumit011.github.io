const $ = (id) => document.getElementById(id);

const navToggle = $("nav-toggle");
const navMenu = $("nav-menu");

function closeMenu() {
  navMenu.classList.remove("show");
  navToggle?.setAttribute("aria-expanded", "false");
  navToggle?.setAttribute("aria-label", "Open menu");

  const icon = navToggle?.querySelector("i");
  if (icon) {
    icon.classList.add("bx-menu");
    icon.classList.remove("bx-x");
  }
}

function openMenu() {
  navMenu.classList.add("show");
  navToggle?.setAttribute("aria-expanded", "true");
  navToggle?.setAttribute("aria-label", "Close menu");

  const icon = navToggle?.querySelector("i");
  if (icon) {
    icon.classList.toggle("bx-menu");
    icon.classList.toggle("bx-x");
  }
}

navToggle?.addEventListener("click", () => {
  const isOpen = navMenu.classList.contains("show");
  if (isOpen) {
    closeMenu();
  } else {
    openMenu();
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


document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && navMenu?.classList.contains("show")) {
    closeMenu();
    navToggle?.focus();
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

window.addEventListener("scroll", updateActiveLink, { passive: true });

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
      ? '<i class="bx bxs-sun" aria-hidden="true"></i>'
      : '<i class="bx bxs-moon" aria-hidden="true"></i>';
    darkModeToggle.setAttribute("aria-pressed", String(isDark));
  }
}

let savedMode = false;
try {
  savedMode = localStorage.getItem("dark-mode") === "enabled";
} catch (err) {
  savedMode = false;
}

if (savedMode) {
  document.body.classList.add("dark-mode");
}
syncDarkModeIcon(savedMode);

darkModeToggle?.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  const isDark = document.body.classList.toggle("dark-mode");
  syncDarkModeIcon(isDark);
  try {
    localStorage.setItem("dark-mode", isDark ? "enabled" : "disabled");
  } catch (err) {

  }
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
      emailInput.focus();
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

(function heroTyper() {
  const container = document.getElementById("hero-typed");
  if (!container) return;
  const cursor = document.querySelector(".hero-cursor");
  container.innerHTML = "";
  const hi = document.createElement("span");
  hi.textContent = "Hi,";
  container.appendChild(hi);
  container.appendChild(document.createElement("br"));

  const segments = [
    { text: "I'm ", cls: null, br: false, animateCursor: false },
    {
      text: "Sumit",
      cls: "home__title-color",
      br: false,
      animateCursor: false,
    },
    { text: "Front-End Dev", cls: null, br: true, animateCursor: true },
  ];

  let si = 0,
    ci = 0,
    span = null;

  function tick() {
    if (si >= segments.length) return;

    const seg = segments[si];

    if (ci === 0) {
      if (seg.br) container.appendChild(document.createElement("br"));
      span = document.createElement("span");
      if (seg.cls) span.className = seg.cls;
      container.appendChild(span);

      cursor?.classList.toggle("hero-cursor--blink", !!seg.animateCursor);
    }

    if (ci < seg.text.length) {
      span.textContent += seg.text[ci++];
      setTimeout(tick, 80);
    } else {
      si++;
      ci = 0;
      setTimeout(tick, 80);
    }
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    segments.forEach((seg) => {
      if (seg.br) container.appendChild(document.createElement("br"));
      const s = document.createElement("span");
      if (seg.cls) s.className = seg.cls;
      s.textContent = seg.text;
      container.appendChild(s);
    });
  } else {
    setTimeout(tick, 350);
  }
})();

const footerYear = $("footer-year");
if (footerYear) {
  footerYear.textContent = String(new Date().getFullYear());
}
