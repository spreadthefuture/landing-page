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
