/* =========================================================
   TERHATHUM — INTERACTION & MOTION
   ========================================================= */

const nav = document.getElementById("siteNav");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const heroImage = document.querySelector(".hero img");

const progressBar = document.createElement("div");
progressBar.className = "scroll-progress";
document.body.appendChild(progressBar);

function handleScroll() {
  const scrollY = window.scrollY;

  if (scrollY > 40) {
    nav?.classList.add("is-scrolled");
  } else {
    nav?.classList.remove("is-scrolled");
  }

  const documentHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const progress = documentHeight > 0 ? (scrollY / documentHeight) * 100 : 0;
  progressBar.style.width = `${progress}%`;

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
  if (isOpen) closeMenu(); else openMenu();
}

if (navToggle && navLinks) {
  navToggle.addEventListener("click", toggleMenu);
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 560) closeMenu();
  });
}

/* ---------------------------------------------------------
   Reveal on scroll
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
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );
  revealEls.forEach((element) => observer.observe(element));
} else {
  revealEls.forEach((element) => element.classList.add("is-visible"));
}

/* ---------------------------------------------------------
   Active navigation section
   --------------------------------------------------------- */
const sections = document.querySelectorAll("main section[id]");
const sectionLinks = document.querySelectorAll('.site-nav a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((link) => link.classList.remove("active"));
      const activeLink = document.querySelector(`.site-nav a[href="#${entry.target.id}"]`);
      activeLink?.classList.add("active");
    });
  },
  { threshold: 0.35 }
);

sections.forEach((section) => sectionObserver.observe(section));

/* ---------------------------------------------------------
   Image parallax (story photos)
   --------------------------------------------------------- */
const storyImages = document.querySelectorAll(".story-media img");

function updateImageParallax() {
  storyImages.forEach((image) => {
    const rect = image.getBoundingClientRect();
    const viewportCenter = window.innerHeight / 2;
    const imageCenter = rect.top + rect.height / 2;
    const distance = imageCenter - viewportCenter;
    const movement = Math.max(-14, Math.min(14, distance * -0.025));
    image.style.setProperty("--image-offset", `${movement}px`);
  });
}

window.addEventListener("scroll", updateImageParallax, { passive: true });
updateImageParallax();

/* ---------------------------------------------------------
   Footer year
   --------------------------------------------------------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const menuStyle = document.createElement("style");
menuStyle.textContent = `body.menu-open { overflow: hidden; }`;
document.head.appendChild(menuStyle);

/* =========================================================
   LIGHTBOX — every photo tagged .lightbox-img or living
   inside .gallery-grid / .trail-thumb becomes clickable and
   opens a full-size, keyboard-navigable viewer.
   ========================================================= */
(function setupLightbox() {
  const items = Array.from(
    document.querySelectorAll(".lightbox-img, .gallery-grid a, .trail-thumb")
  ).map((el) => {
    if (el.tagName === "IMG") {
      return { src: el.getAttribute("src"), caption: el.dataset.caption || el.alt || "" };
    }
    const img = el.querySelector("img");
    return { src: el.getAttribute("href") || img?.getAttribute("src"), caption: img?.dataset.caption || img?.alt || "" };
  }).filter((item) => item.src);

  if (!items.length) return;

  const overlay = document.createElement("div");
  overlay.className = "lightbox-overlay";
  overlay.innerHTML = `
    <button class="lightbox-close" aria-label="Close">✕</button>
    <button class="lightbox-nav prev" aria-label="Previous photo">‹</button>
    <button class="lightbox-nav next" aria-label="Next photo">›</button>
    <figure class="lightbox-figure">
      <img alt="">
      <figcaption class="lightbox-caption"></figcaption>
    </figure>
  `;
  document.body.appendChild(overlay);

  const imgEl = overlay.querySelector("img");
  const captionEl = overlay.querySelector(".lightbox-caption");
  let currentIndex = 0;

  function show(index) {
    currentIndex = (index + items.length) % items.length;
    const item = items[currentIndex];
    imgEl.setAttribute("src", item.src);
    imgEl.setAttribute("alt", item.caption);
    captionEl.textContent = item.caption;
  }

  function open(index) {
    show(index);
    overlay.classList.add("is-open");
    document.body.classList.add("menu-open");
  }

  function close() {
    overlay.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  let pointer = 0;
  document.querySelectorAll(".lightbox-img, .gallery-grid a, .trail-thumb").forEach((el) => {
    const myIndex = pointer++;
    el.addEventListener("click", (event) => {
      event.preventDefault();
      open(myIndex);
    });
    if (el.tagName === "IMG") {
      el.setAttribute("tabindex", "0");
      el.setAttribute("role", "button");
      el.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open(myIndex);
        }
      });
    }
  });
  overlay.querySelector(".lightbox-close").addEventListener("click", close);
  overlay.querySelector(".prev").addEventListener("click", () => show(currentIndex - 1));
  overlay.querySelector(".next").addEventListener("click", () => show(currentIndex + 1));
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) close();
  });

  document.addEventListener("keydown", (event) => {
    if (!overlay.classList.contains("is-open")) return;
    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft") show(currentIndex - 1);
    if (event.key === "ArrowRight") show(currentIndex + 1);
  });
})();

/* =========================================================
   ANIMATED STAT COUNTERS — used on the homepage stat strip
   and the travel dashboard's figure row.
   ========================================================= */
(function setupCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length || !("IntersectionObserver" in window)) {
    counters.forEach((el) => {
      el.textContent = `${el.dataset.count}${el.dataset.suffix || ""}`;
    });
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    if (prefersReducedMotion || Number.isNaN(target)) {
      el.textContent = `${el.dataset.count}${suffix}`;
      return;
    }
    const duration = 1200;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = `${value}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((el) => counterObserver.observe(el));
})();

/* =========================================================
   ANIMATED CHART BARS — travel dashboard elevation chart
   ========================================================= */
(function setupChartBars() {
  const bars = document.querySelectorAll(".chart-bar");
  if (!bars.length) return;

  if (!("IntersectionObserver" in window)) {
    bars.forEach((bar) => bar.classList.add("is-visible"));
    return;
  }

  const barObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("is-visible"), i * 90);
          barObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach((bar) => barObserver.observe(bar));
})();
