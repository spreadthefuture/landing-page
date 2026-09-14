// Enhancement only: the site is complete with this file absent, the page just
// jumps on open and the covers pop instead of crossfading.
//
// One .episodes-layout holds the page's single cover panel and, beside it, every
// season's list. The panel answers to any row in any of those lists; the loop is
// still written per layout so a second one would work on its own.
for (const layout of document.querySelectorAll('.episodes-layout')) {
  const lists = layout.querySelectorAll('.episodes');
  const artPanel = layout.querySelector('.episode-art-panel');
  if (!lists.length) continue;

  // Episodes are an exclusive accordion (<details name="episode">), so opening one
  // collapses the one above and the clicked row can slide off the top of the window.
  // Clamp it: the row may move up, but never past the top edge. Anything else is left
  // exactly where the browser put it. The accordion is shared across seasons (one
  // name for the whole page), so the row that collapses may sit in another list;
  // the listener still fires on the row that was clicked, which is the one that
  // must stay in view.
  layout.addEventListener('click', (event) => {
    const summary = event.target.closest('.episode-summary');
    if (!summary) return;

    requestAnimationFrame(() => {
      const { top } = summary.getBoundingClientRect();
      if (top < 0) window.scrollBy(0, top);
    });
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

  const showArt = (src) => {
    if (!src || src === currentSrc) return;
    currentSrc = src;
    const next = layers[1 - activeLayer];
    next.src = src;
    next.classList.add('is-active');
    layers[activeLayer].classList.remove('is-active');
    activeLayer = 1 - activeLayer;
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

  // On narrow screens the panel becomes sticky flush to the viewport top (see
  // styles.css). .is-pinned adds back a gutter of space above the cover once
  // it is actually stuck, without affecting its unpinned, in-flow position: a
  // sentinel sits right above the panel in the markup, and once scrolling
  // carries it past the viewport top the panel must be pinned.
  const artSentinel = layout.querySelector('.episode-art-sentinel');

  if (artSentinel) {
    const pinObserver = new IntersectionObserver(
      ([entry]) => artPanel.classList.toggle('is-pinned', !entry.isIntersecting),
      { threshold: 0 }
    );
    pinObserver.observe(artSentinel);
  }
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
}
