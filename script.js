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
