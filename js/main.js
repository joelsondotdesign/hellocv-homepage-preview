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

// Scroll reveals: marketing sections ease in the first time they enter the
// viewport. Grid siblings stagger 60ms apart; capped so nothing feels slow.
const revealTargets = document.querySelectorAll(
  '.section-heading, .feature-row__copy, .feature-row__media, .bento__card, ' +
  '.testimonial, .community__head, .describe__stage, .pricing__head, .plan, ' +
  '.cta__title, .cta__sub, .cta__composer, .faqs__intro, .faqs__list'
);

if ('IntersectionObserver' in window) {
  const staggerGroups = ['.bento__card', '.testimonial', '.plan'];
  revealTargets.forEach((el) => {
    el.classList.add('reveal');
    for (const sel of staggerGroups) {
      if (el.matches(sel)) {
        const siblings = [...el.parentElement.querySelectorAll(sel)];
        el.style.setProperty('--reveal-delay', `${Math.min(siblings.indexOf(el), 4) * 60}ms`);
      }
    }
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        // Cards inside a horizontal scroller may never intersect vertically
        // themselves — reveal the whole group when the scroller shows up.
        const scroller = entry.target.closest('.testimonials__row');
        if (scroller) {
          scroller.querySelectorAll('.reveal').forEach((card) => {
            card.classList.add('is-visible');
            io.unobserve(card);
          });
        } else {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );
  revealTargets.forEach((el) => io.observe(el));
}
