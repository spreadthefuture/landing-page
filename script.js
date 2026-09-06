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

// Row hover swaps the panel's cover only on pointer devices with real hover;
// touch would otherwise leave the wrong cover showing after a tap.
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

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
