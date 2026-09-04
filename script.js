/* =========================================================
   TERHATHUM — INTERACTION & MOTION
   ========================================================= */

const nav = document.getElementById("siteNav");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const hero = document.querySelector(".hero");
const heroImage = document.querySelector(".hero img");

/* ---------------------------------------------------------
   Scroll state + reading progress
   --------------------------------------------------------- */

const progressBar = document.createElement("div");
progressBar.className = "scroll-progress";
document.body.appendChild(progressBar);

function handleScroll() {
  const scrollY = window.scrollY;

  // Navigation state
  if (scrollY > 40) {
    nav?.classList.add("is-scrolled");
  } else {
    nav?.classList.remove("is-scrolled");
  }

  // Reading progress
  const documentHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  const progress =
    documentHeight > 0 ? (scrollY / documentHeight) * 100 : 0;

  progressBar.style.width = `${progress}%`;

  // Hero parallax
  if (heroImage && scrollY < window.innerHeight) {
    const movement = Math.min(scrollY * 0.12, 80);
    heroImage.style.transform = `translateY(${movement}px) scale(1.04)`;
  }
}

window.addEventListener("scroll", handleScroll, { passive: true });
handleScroll();


/* ---------------------------------------------------------
   Mobile navigation
   --------------------------------------------------------- */

function closeMenu() {
  if (!navLinks || !navToggle) return;

  navLinks.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.textContent = "☰";

  document.body.classList.remove("menu-open");
}

function openMenu() {
  if (!navLinks || !navToggle) return;

  navLinks.classList.add("is-open");
  navToggle.setAttribute("aria-expanded", "true");
  navToggle.textContent = "✕";

  document.body.classList.add("menu-open");
}

function toggleMenu() {
  const isOpen = navLinks?.classList.contains("is-open");

  if (isOpen) {
    closeMenu();
  } else {
    openMenu();
  }
}

if (navToggle && navLinks) {
  navToggle.addEventListener("click", toggleMenu);

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close with Escape
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  // Close if viewport becomes desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 560) {
      closeMenu();
    }
  });
}


/* ---------------------------------------------------------
   Reveal animations
   --------------------------------------------------------- */

const revealEls = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -60px 0px"
    }
  );

  revealEls.forEach((element) => observer.observe(element));
} else {
  revealEls.forEach((element) => {
    element.classList.add("is-visible");
  });
}


/* ---------------------------------------------------------
   Active navigation section
   --------------------------------------------------------- */

const sections = document.querySelectorAll(
  "main section[id]"
);

const sectionLinks = document.querySelectorAll(
  '.site-nav a[href^="#"]'
);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      sectionLinks.forEach((link) => {
        link.classList.remove("active");
      });

      const activeLink = document.querySelector(
        `.site-nav a[href="#${entry.target.id}"]`
      );

      activeLink?.classList.add("active");
    });
  },
  {
    threshold: 0.35
  }
);

sections.forEach((section) => {
  sectionObserver.observe(section);
});


/* ---------------------------------------------------------
   Image parallax
   --------------------------------------------------------- */

const storyImages = document.querySelectorAll(
  ".story-media img"
);

function updateImageParallax() {
  storyImages.forEach((image) => {
    const rect = image.getBoundingClientRect();

    const viewportCenter = window.innerHeight / 2;
    const imageCenter = rect.top + rect.height / 2;

    const distance = imageCenter - viewportCenter;
    const movement = Math.max(
      -14,
      Math.min(14, distance * -0.025)
    );

    image.style.setProperty(
      "--image-offset",
      `${movement}px`
    );
  });
}

window.addEventListener(
  "scroll",
  updateImageParallax,
  { passive: true }
);

updateImageParallax();


/* ---------------------------------------------------------
   Footer year
   --------------------------------------------------------- */

const yearEl = document.getElementById("year");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}


/* ---------------------------------------------------------
   Prevent scroll behind mobile menu
   --------------------------------------------------------- */

const menuStyle = document.createElement("style");

menuStyle.textContent = `
  body.menu-open {
    overflow: hidden;
  }
`;

document.head.appendChild(menuStyle);
