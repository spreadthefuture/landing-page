// Episodes are an exclusive accordion (<details name="episode">), so opening one
// collapses the one above and the clicked row can slide off the top of the window.
// Clamp it: the row may move up, but never past the top edge. Anything else is left
// exactly where the browser put it.
const episodes = document.querySelector('.episodes');

if (episodes) {
  episodes.addEventListener('click', (event) => {
    const summary = event.target.closest('.episode-summary');
    if (!summary) return;

    requestAnimationFrame(() => {
      const { top } = summary.getBoundingClientRect();
      if (top < 0) window.scrollBy(0, top);
    });
  });
}

// The color wash behind a row on hover is pointer only, and waits for its
// cover to have actually decoded, so a slow or broken one shows nothing rather
// than a flash of empty box.
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

const ready = new Map();

const load = (src, onReady) => {
  let state = ready.get(src);
  if (!state) {
    state = { ok: false, waiting: [] };
    const probe = new Image();
    probe.addEventListener('load', () => {
      state.ok = true;
      for (const fn of state.waiting) fn();
      state.waiting.length = 0;
    }, { once: true });
    probe.src = src;
    ready.set(src, state);
  }
  if (onReady) {
    if (state.ok) onReady();
    else state.waiting.push(onReady);
  }
  return state;
};

// Warm every cover once the page itself has finished loading, so the first hover
// of a row is as instant as the rest, and hand each row its own cover as it
// lands. Setting that property and inserting the .episode-wash layer is the
// whole of the wash's JS: the hover, the graded blur and the grain are all CSS.
// The layer goes in here rather than in the markup because the effect is already
// gated on the cover having decoded, so a row that never gets one never gets the
// empty span either. Deliberately at odds with the loading="lazy" on the panel
// artwork: the covers are wanted up front for the hover, just not ahead of the
// page. Idle time only, so it never competes with the page's own load.
if (episodes && finePointer.matches) {
  const warm = () => {
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 200));
    idle(() => {
      for (const art of episodes.querySelectorAll('.episode-art')) {
        const row = art.closest('.episode');
        // Escaped for a CSS string, not for an identifier: only quotes and
        // backslashes need it, and CSS.escape would mangle the rest of the URL.
        const url = art.src.replace(/["\\]/g, '\\$&');
        load(art.src, () => {
          if (!row) return;
          row.style.setProperty('--cover-image', `url("${url}")`);
          const summary = row.querySelector('.episode-summary');
          if (summary && !summary.querySelector('.episode-wash')) {
            const wash = document.createElement('span');
            wash.className = 'episode-wash';
            wash.setAttribute('aria-hidden', 'true');
            summary.prepend(wash);
          }
        });
      }
    });
  };

  if (document.readyState === 'complete') warm();
  else window.addEventListener('load', warm, { once: true });
}

// The persistent cover to the left of the list: the latest episode's art at
// rest, the hovered row's while the pointer is over it, the open row's
// whenever one is expanded. Two stacked <img> layers so a change crossfades
// instead of popping: the incoming cover loads into the hidden layer, then
// swap which one carries .is-active and CSS transitions the opacity.
const artPanel = document.querySelector('.episode-art-panel');

if (episodes && artPanel) {
  const layers = artPanel.querySelectorAll('.episode-art-layer');
  let activeLayer = 0;
  let currentSrc = null;
  let openSrc = null;

  const firstCover = episodes.querySelector('.episode-art');
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

  for (const details of episodes.querySelectorAll('.episode')) {
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
    for (const summary of episodes.querySelectorAll('.episode-summary')) {
      const cover = summary.closest('.episode').querySelector('.episode-art');
      summary.addEventListener('mouseenter', () => showArt(cover.src));
      summary.addEventListener('mouseleave', () => showArt(openSrc || defaultSrc));
    }
  }
}
