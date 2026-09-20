// Enhancement only: the site is complete with this file absent, the page just
// jumps on open, the covers pop instead of crossfading, and the quotes stack.
//
// One .episodes-layout holds the page's single cover panel and, beside it, every
// season's list. The panel answers to any row in any of those lists; the loop is
// still written per layout so a second one would work on its own.

// Rows slide open and closed. In the mobile feed (styles.css, below 46rem) every
// row is a cover, and a tap also brings that episode's title a third of the way
// down the screen.
const feed = window.matchMedia('(max-width: 46rem)');
const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
const FEED_DURATION = 500;
// Ease in and out, so the fold starts as gently as it lands.
const feedEase = (t) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

for (const layout of document.querySelectorAll('.episodes-layout')) {
  const lists = layout.querySelectorAll('.episodes');
  const artPanel = layout.querySelector('.episode-art-panel');
  const episodes = [...layout.querySelectorAll('.episode')];
  if (!lists.length) continue;

  // The accordion is exclusive (<details name="episode">), but the browser closes
  // the other row instantly, which would cut its closing slide short. So with
  // this file present, exclusivity is done here instead: the name comes off, and
  // the click handler below closes the open row itself, with the slide.
  let current = null;

  for (const details of episodes) {
    details.removeAttribute('name');
    details.addEventListener('toggle', () => {
      if (details.open) {
        current = details;
      } else if (current === details) {
        current = null;
      }
    });
  }

  // One motion at a time drives every sliding panel and the scroll together,
  // from a single frame loop on a single curve, so the page never moves on one
  // clock and the panels on another. A tap mid-motion starts a new one from
  // wherever everything currently is. Closing only clears `open` once the fold
  // has finished, so the text stays visible while it folds; .is-closing marks
  // that fold, so the toggle turns back at the tap, not at the end.
  const root = document.documentElement;
  let motion = null;
  let frame = null;

  const measure = (details, opening) => {
    const panel = details.querySelector('.episode-panel');
    const from = details.open ? panel.getBoundingClientRect().height : 0;
    details.open = true;
    details.classList.toggle('is-closing', !opening);
    panel.style.height = '';
    const to = opening ? panel.scrollHeight : 0;
    panel.style.overflow = 'hidden';
    panel.style.height = `${from}px`;
    return { panel, from, to };
  };

  const tick = (now) => {
    const m = motion;
    m.start ??= now;
    const t = calm.matches ? 1 : Math.min((now - m.start) / FEED_DURATION, 1);
    const e = feedEase(t);

    for (const { panel, from, to } of m.panels.values()) {
      panel.style.height = `${from + (to - from) * e}px`;
    }

    // The focus's place on screen is what eases, from where it was tapped to
    // topTo, so it travels one way only however the rows above it fold. Read after the heights are written, so this frame's fold counts.
    // Scrolled to a whole pixel, worked out from the page position rather than
    // nudged by the fractional difference: browsers round the scroll, and those
    // sub-pixel nudges made the slow end of the ease shiver up and down.
    if (m.focus) {
      const top = m.focus.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, Math.round(top - (m.topFrom + (m.topTo - m.topFrom) * e)));
    }

    if (t < 1) {
      frame = requestAnimationFrame(tick);
      return;
    }
    for (const [details, { panel, to }] of m.panels) {
      panel.style.height = '';
      panel.style.overflow = '';
      if (!to) details.open = false;
      details.classList.remove('is-closing');
    }
    motion = null;
    frame = null;
    root.classList.remove('is-list-moving');
  };

  // changes: [details, opening] pairs. focus: the element whose place on screen
  // eases to topTo while everything moves.
  const run = (changes, focus, topTo) => {
    const targets = new Map();
    if (motion) for (const [details, { to }] of motion.panels) targets.set(details, to > 0);
    for (const [details, opening] of changes) targets.set(details, opening);
    motion = {
      panels: new Map([...targets].map(([details, opening]) => [details, measure(details, opening)])),
      focus,
      topFrom: focus ? focus.getBoundingClientRect().top : 0,
      topTo,
      start: null,
    };
    root.classList.add('is-list-moving');
    frame ??= requestAnimationFrame(tick);
  };

  layout.addEventListener('click', (event) => {
    const summary = event.target.closest('.episode-summary');
    if (!summary) return;
    const details = summary.closest('.episode');

    event.preventDefault();
    if (current === details) {
      current = null;
      run([[details, false]], null);
      return;
    }
    const changes = current ? [[current, false], [details, true]] : [[details, true]];
    current = details;

    if (feed.matches) {
      // The open text's title is what lands at its scroll-margin-top (a third
      // of the way down), not the cover above it.
      const heading = details.querySelector('.episode-heading');
      run(changes, heading, parseFloat(getComputedStyle(heading).scrollMarginTop) || 0);
      return;
    }

    // Desktop: the clicked row holds still while a row above it folds, so it
    // stays under the pointer, but never sits above the window's top edge.
    const { top } = summary.getBoundingClientRect();
    run(changes, summary, Math.max(top, 0));
  });

  if (!artPanel) continue;

  // Row hover swaps the panel's cover only on pointer devices with real hover;
  // touch would otherwise leave the wrong cover showing after a tap.
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  // The persistent cover to the left of the list: the newest episode's art at
  // rest, the hovered row's while the pointer is over it, the open row's whenever
  // one is expanded. Two stacked <img> layers so a change crossfades instead of
  // popping: the incoming cover loads into the hidden layer, then swap which one
  // carries .is-active and CSS transitions the opacity.
  const layers = artPanel.querySelectorAll('.episode-art-layer');
  let activeLayer = 0;
  let currentSrc = null;
  let openSrc = null;

  // Seasons render newest first and rows newest first within a season, so the
  // first cover in the markup is the latest episode's.
  const firstCover = layout.querySelector('.episode-art');
  const defaultSrc = firstCover ? firstCover.src : null;

  // Applied once per frame, with the last cover asked for. Moving from one row
  // to the next fires leave and enter together; swapping on both would flip the
  // layers back before the browser draws, so the new cover would replace the old
  // one in place, with no crossfade.
  let pendingSrc = null;
  let swapFrame = null;

  const showArt = (src) => {
    if (!src) return;
    pendingSrc = src;
    swapFrame ??= requestAnimationFrame(() => {
      swapFrame = null;
      if (pendingSrc === currentSrc) return;
      currentSrc = pendingSrc;
      const next = layers[1 - activeLayer];
      next.src = currentSrc;
      next.classList.add('is-active');
      layers[activeLayer].classList.remove('is-active');
      activeLayer = 1 - activeLayer;
    });
  };

  showArt(defaultSrc);

  for (const details of layout.querySelectorAll('.episode')) {
    const cover = details.querySelector('.episode-art');
    details.addEventListener('toggle', () => {
      if (details.open) {
        openSrc = cover ? cover.src : null;
        showArt(openSrc || defaultSrc);
      } else if (cover && cover.src === openSrc) {
        openSrc = null;
      }
    });
  }

  if (finePointer.matches) {
    for (const summary of layout.querySelectorAll('.episode-summary')) {
      const cover = summary.closest('.episode').querySelector('.episode-art');
      summary.addEventListener('mouseenter', () => showArt(cover.src));
      summary.addEventListener('mouseleave', () => showArt(openSrc || defaultSrc));
    }
  }
}

// The phone header's menu (below 46rem): the plus beside the wordmark slides
// About and Credits open under it, on the feed's duration and curve, and folds
// them away again. A second tap mid-motion turns it from wherever it is.
// Without this file the nav simply stays open.
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

if (menuToggle && siteNav) {
  let menuFrame = null;

  const setMenu = (opening) => {
    const from = siteNav.classList.contains('is-open') ? siteNav.getBoundingClientRect().height : 0;
    menuToggle.setAttribute('aria-expanded', opening);
    siteNav.classList.add('is-open');
    siteNav.style.height = '';
    const to = opening ? siteNav.scrollHeight : 0;
    siteNav.style.overflow = 'hidden';
    siteNav.style.height = `${from}px`;

    cancelAnimationFrame(menuFrame);
    let start = null;
    const tick = (now) => {
      start ??= now;
      const t = calm.matches ? 1 : Math.min((now - start) / FEED_DURATION, 1);
      siteNav.style.height = `${from + (to - from) * feedEase(t)}px`;
      if (t < 1) {
        menuFrame = requestAnimationFrame(tick);
        return;
      }
      siteNav.style.height = '';
      siteNav.style.overflow = '';
      if (!opening) siteNav.classList.remove('is-open');
    };
    menuFrame = requestAnimationFrame(tick);
  };

  const isOpen = () => menuToggle.getAttribute('aria-expanded') === 'true';

  menuToggle.addEventListener('click', () => setMenu(!isOpen()));
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !isOpen()) return;
    setMenu(false);
    menuToggle.focus();
  });
}

// Quotes after the episode list. Without this they stack; with it they share one
// spot and rotate. Each bar's fill animation (styles.css) is the timer: when the
// active one finishes, the next quote comes up, so hover, focus and reduced motion
// pause or stop the rotation from CSS alone.
const quoteBlock = document.querySelector('.quotes');
const quotes = quoteBlock ? quoteBlock.querySelectorAll('.quote') : [];

if (quotes.length > 1) {
  const nav = document.createElement('div');
  nav.className = 'quotes-nav';

  const dots = [...quotes].map((quote, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'quote-dot';
    dot.setAttribute('aria-label', `Quote ${i + 1} of ${quotes.length}`);
    dot.addEventListener('click', () => showQuote(i));
    dot.addEventListener('animationend', () => showQuote((i + 1) % quotes.length));
    nav.append(dot);
    return dot;
  });

  const showQuote = (index) => {
    quotes.forEach((quote, i) => quote.classList.toggle('is-active', i === index));
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
      dot.setAttribute('aria-current', i === index);
    });
  };

  // .is-starting holds the transitions off for the first frame, so the quotes
  // that were stacked a moment ago drop out instantly instead of fading away.
  quoteBlock.classList.add('is-rotating', 'is-starting');
  quoteBlock.append(nav);
  showQuote(0);
  requestAnimationFrame(() => requestAnimationFrame(() => quoteBlock.classList.remove('is-starting')));

  // The block rises in the first time it comes into view, and the rotation
  // waits for that (.is-waiting holds the bar's fill in styles.css). Under
  // reduced motion it is simply there.
  if (!calm.matches && 'IntersectionObserver' in window) {
    quoteBlock.classList.add('is-waiting');
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      quoteBlock.classList.replace('is-waiting', 'is-entering');
      observer.disconnect();
    }, { threshold: 0.25 });
    observer.observe(quoteBlock);
  }
}

// About page. Blocks below the fold at load (styles.css runs the rest on its
// own) wait hidden and rise in as each scrolls into view, 250ms apart when
// several arrive together. A block scrolled past too fast to be seen comes in
// anyway, so none is left hidden above the reader. Under reduced motion every
// block is simply there.
const aboutBlocks = document.querySelectorAll('.about-section, .about-statement, .about-closing, .about-contact');

if (aboutBlocks.length && !calm.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    let beat = 0;
    for (const entry of entries) {
      if (!entry.isIntersecting && entry.boundingClientRect.top > 0) continue;
      observer.unobserve(entry.target);
      setTimeout(() => entry.target.classList.replace('is-waiting', 'is-entering'), beat++ * 250);
    }
  }, { rootMargin: '0px 0px -10% 0px' });

  for (const block of aboutBlocks) {
    if (block.getBoundingClientRect().top < window.innerHeight) continue;
    block.classList.add('is-waiting');
    observer.observe(block);
  }
}

// Contact overlay. The link is a plain anchor to #contact, so with JS off the
// :target rules open it and the "close" links take it away again. With JS the
// hash never changes: the class does the same job, the page keeps its scroll
// position, and the overlay can put focus in the first field, hold Escape, and
// hand focus back to the link it came from. The scroll behind is locked while
// it is open, so the page under the scrim does not drift.
const contactOverlay = document.querySelector('.contact-overlay');
const contactOpen = document.querySelector('.contact-open');

if (contactOverlay && contactOpen) {
  const closers = contactOverlay.querySelectorAll('.contact-scrim, .contact-close');
  const firstField = contactOverlay.querySelector('.contact-input');

  const setContact = (open) => {
    contactOverlay.classList.toggle('is-open', open);
    document.body.classList.toggle('is-locked', open);
    // Not on a phone: focusing a field there opens the keyboard at once, which
    // covers the form the reader has not yet read. They tap the field they want.
    if (open && !feed.matches) firstField?.focus({ preventScroll: true });
    else contactOpen.focus({ preventScroll: true });
  };

  contactOpen.addEventListener('click', (event) => {
    event.preventDefault();
    setContact(true);
  });

  for (const closer of closers) {
    closer.addEventListener('click', (event) => {
      event.preventDefault();
      setContact(false);
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !contactOverlay.classList.contains('is-open')) return;
    event.preventDefault();
    setContact(false);
  });

  // Validation, in the page's own type rather than the browser's bubble: a
  // light popup over the dark panel, positioned by the browser, is the one
  // thing here we cannot style. So with JS the form is set novalidate and a
  // blocked send marks every empty field itself (.is-invalid, which styles.css
  // pairs with :user-invalid), then puts the cursor in the first one. The
  // required attributes stay on the fields, so with JS off the browser still
  // does the checking its own way and nothing is submitted empty.
  const contactForm = contactOverlay.querySelector('.contact-form');

  if (contactForm) {
    contactForm.noValidate = true;

    contactForm.addEventListener('submit', (event) => {
      const invalid = contactForm.querySelectorAll('.contact-input:invalid');
      for (const field of contactForm.querySelectorAll('.contact-input')) {
        field.classList.toggle('is-invalid', !field.checkValidity());
      }
      if (!invalid.length) return;
      event.preventDefault();
      invalid[0].focus();
    });

    // A field that has been corrected stops being marked as soon as it is
    // valid again, rather than waiting for the next send.
    contactForm.addEventListener('input', (event) => {
      if (!event.target.classList.contains('is-invalid')) return;
      if (event.target.checkValidity()) event.target.classList.remove('is-invalid');
    });
  }
}
