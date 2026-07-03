// Duplicate the trusted-by logo track so the marquee loops seamlessly.
const track = document.querySelector('.trusted-by__track');
if (track) {
  track.innerHTML += track.innerHTML;
}

// FAQ accordion — keep a single item open, mirroring the Figma design.
document.querySelectorAll('.faq summary').forEach((summary) => {
  summary.addEventListener('click', () => {
    const target = summary.parentElement;
    document.querySelectorAll('.faq[open]').forEach((faq) => {
      if (faq !== target) faq.removeAttribute('open');
    });
  });
});

// Community gallery arrows: nudge the gallery horizontally (static image, so
// this simply scrolls the container when it overflows on small screens).
const gallery = document.querySelector('.community__gallery');
document.querySelectorAll('.community__arrows .round-btn').forEach((btn, i) => {
  btn.addEventListener('click', () => {
    gallery.scrollBy({ left: i === 0 ? -448 : 448, behavior: 'smooth' });
  });
});

// Nav dropdowns: click toggles (for touch), Escape and outside-click close.
document.querySelectorAll('.nav-dropdown > .header__nav-item').forEach((trigger) => {
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const dropdown = trigger.parentElement;
    const open = dropdown.classList.toggle('is-open');
    trigger.setAttribute('aria-expanded', String(open));
    document.querySelectorAll('.nav-dropdown.is-open').forEach((other) => {
      if (other !== dropdown) {
        other.classList.remove('is-open');
        other.querySelector('.header__nav-item').setAttribute('aria-expanded', 'false');
      }
    });
  });
});

document.addEventListener('click', () => {
  document.querySelectorAll('.nav-dropdown.is-open').forEach((dropdown) => {
    dropdown.classList.remove('is-open');
    dropdown.querySelector('.header__nav-item').setAttribute('aria-expanded', 'false');
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.nav-dropdown.is-open').forEach((dropdown) => {
      dropdown.classList.remove('is-open');
      dropdown.querySelector('.header__nav-item').setAttribute('aria-expanded', 'false');
    });
  }
});

// Debug helper: /?open=product or /?open=resources forces a dropdown open
// (used for visual QA screenshots; harmless in normal use).
const openParam = new URLSearchParams(location.search).get('open');
if (openParam) {
  const idx = openParam === 'product' ? 0 : 1;
  const dd = document.querySelectorAll('.nav-dropdown')[idx];
  if (dd) dd.classList.add('is-open');
}

// Mobile burger menu
const header = document.querySelector('.header');
const burger = document.querySelector('.header__burger');
if (burger) {
  burger.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = header.classList.toggle('is-menu-open');
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  // Keep the sheet open when interacting inside it; close on outside taps.
  document.addEventListener('click', (e) => {
    if (header.classList.contains('is-menu-open') && !header.contains(e.target)) {
      header.classList.remove('is-menu-open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });
  header.querySelector('.header__nav').addEventListener('click', (e) => {
    // Let dropdown toggles work without closing the sheet.
    if (e.target.closest('.nav-dropdown > .header__nav-item')) return;
    e.stopPropagation();
  });
}
