// Nav background on scroll
const nav = document.getElementById('siteNav');
const onScroll = () => {
  if (window.scrollY > 40) {
    nav.classList.add('is-scrolled');
  } else {
    nav.classList.remove('is-scrolled');
  }
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Reveal-on-scroll
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
