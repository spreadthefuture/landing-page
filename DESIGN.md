# SPREAD THE FUTURE: Style Reference

> Documents the site as built, not as imagined. Update it in the same commit as any
> design change, along with `PROJECT-CONTEXT.md`.
>
> Last updated: 2026-09-23

A dark podcast site built as a single typographic stack. No chrome: no cards, no
shadows (one faint text glow on hover aside), no borders except hairline rules, no
chromatic color except three platform brand colors on hover. Hierarchy comes from
scale and weight alone, on one family in two weights. Every size is a `clamp()`, so
the page is fluid, and the one breakpoint is structural. The signature moves: the
wordmark set wide, the thin `--rule` under every episode, and one persistent square
cover that crossfades beside the list.

## The system at a glance

One value per job, shared by all three pages. Reuse these rather than adding a
near-duplicate.

| Job | The one value |
|-----|---------------|
| Breakpoint | `46rem`, always written `max-width: 46rem` |
| Vertical gaps | `--space-s` / `--space-m` / `--space-xl`, on every page |
| Line heights | `1` (site nav), `1.6` (prose), `1.2` (everything else, set on `body`) |
| Label size (platform bar, episode listen links, quote source, contact field labels and submit, footer column headings and links) | `clamp(0.875rem, 1.2vw, 1rem)` |
| Row size (episode row, "Coming soon.", credit name, about heading, contact title) | `clamp(1.05rem, 1.9vw, 1.5rem)` |
| Prose size (about text, credits team line and contact line, contact intro and inputs, episode description and meta, credit role and location) | `clamp(1rem, 1.7vw, 1.25rem)` |
| Prose link (episode description, credits contact line) | underlined, `text-underline-offset: 0.2em`; the second is also `--fg`. The footer tagline's link underlines on hover and focus only |
| Measure (max line length) | `48ch` about principles, `60ch` episode description, `38ch` quotes. Keep any new prose in that 45 to 60ch range |
| Glow (white text on hover only) | `--glow`, or `--glow-filter` for the wordmark and footer icons |
| Entrance | `fade-in` + `drift-in` keyframes, on `--ease-fade` / `--ease-drift` |
| Brand name in copy | `SPREAD THE FUTURE`, uppercase in the markup |
| Page description (meta and Open Graph) | The same sentence on all three pages, matching the tagline |

## Colors

| Name | Token | Value | Role |
|------|-------|-------|------|
| Near black | `--bg` | `#0A0A0A` | The page canvas. Never pure black |
| Soft white | `--fg` | `#F4F4F2` | Primary text, the wordmark, icons at rest, the focus ring. Never pure white |
| Gray | `--muted` | `#8A8A8A` | Secondary text: episode numbers, meta, descriptions, per-episode listen links, the "Listen on" label, credit locations, the unlit words of the about statement, footer social and column links, the mobile header's platform icons, "Coming soon." |
| Rule | `--rule` | `#2A2A2A` | The 1px line under every episode row above 46rem, and the one across the footer. The only border |
| Surface | `--surface` | `#1A1A1A` | Behind cover artwork while it loads |
| Footer gray | `--muted-dim` | `#5C5C5C` | The footer's own text: the tagline under the wordmark and the copyright line |

Brand colors appear on hover only, on platform icons: Spotify `#1ED760`, Apple
Podcasts `#A945E3`, Deezer `#A238FF`.

## Typography

### Arial, the only typeface

Stack: `'STF Sans', Arial, Helvetica, sans-serif`. `STF Sans` is four `@font-face`
rules at the top of `styles.css`, each asking for Arial's PostScript face first and
falling back to bundled Liberation Sans:

```css
src: local('ArialMT'),
     url('assets/font/liberation-fonts-ttf-2.1.5/LiberationSans-Regular.ttf') format('truetype');
```

**Do not flatten this to `font-family: Arial`.** Android aliases `arial` to Roboto and
Linux fontconfig aliases it to Liberation Sans, so a stack led by `Arial` never falls
through. A family name with no system alias forces the `src` list to be read, and the
PostScript name (`ArialMT`) keeps `local()` clear of the same aliases. The wordmark SVG
uses the same trick with `Arial-BoldMT`.

| Platform | Renders | Downloaded |
|----------|---------|------------|
| Windows, macOS, iOS, Linux with Arial | Arial | nothing |
| Android, Linux without Arial | Liberation Sans (metric-compatible) | ~400KB per face used |

- **`font-display: swap`:** viewers without Arial see their default sans first, with a
  slight reflow when the file lands.
- **Do not add `rel="preload"`.** It would force the download on viewers who have
  Arial.
- **Settled.** Do not swap the stack, change the `local()` names, or rename
  `STF Sans` without asking.

### Rules

- **Weights:** 400 (body, meta, prose) and 700 (everything else). Nothing else.
- **Case:** uppercase for the site nav, platform labels, episode rows, credit names and
  about headings, written in sentence case in the markup and uppercased in CSS so
  screen readers read words. Not uppercased: the homepage tagline, the about statement,
  the season heading ("Season 1"), the quotes and the credits headings. The brand name
  is the one thing uppercase in the markup.
- **Line height:** `1.2` on `body`, `1` on the site nav, `1.6` on prose.
  `line-height: 0` on the wordmark and `1` on the RSS word are box resets.
- **Letter spacing:** `0.01em` to `0.02em` on large bold type, normal on small labels,
  `0.12em` only on the footer's RSS word. Nothing negative.

### Type scale

| Role | Size | Weight | Line height | Tracking |
|------|------|--------|-------------|----------|
| wordmark | `clamp(250px, 34vw, 520px)` wide | 700 | 0 (reset) | |
| site nav | `clamp(2rem, 5vw, 4rem)` · `8vw` below 46rem | 700 | 1 | |
| tagline | `clamp(1.35rem, 3vw, 3.75rem)` · `6vw` below 46rem | 700 | 1.2 | 0.01em |
| about statement | `clamp(1.35rem, 3vw, 3.75rem)` · `8vw` below 46rem | 700 | 1.2 | 0.01em |
| heading: credits intro / season title / quote | `clamp(1.6rem, 4vw, 3.25rem)` | 700 | 1.2 | 0.01em |
| row | `clamp(1.05rem, 1.9vw, 1.5rem)` | 700 | 1.2 | 0.01em |
| mobile open episode heading | `1.15rem` | 700 | 1.2 | 0.01em |
| prose | `clamp(1rem, 1.7vw, 1.25rem)` · credit role / location `1rem` below 46rem | 400 | 1.6 (1.2 on meta and credit lines) | |
| label | `clamp(0.875rem, 1.2vw, 1rem)` | 700 | 1.2 | |
| footer RSS word | `0.8125rem` | 700 | 1 (reset) | 0.12em |
| footer | `0.875rem` · `0.8rem` below 46rem | 400 | 1.2 | |

## Spacing & layout

Three vertical gaps: **s** pins a label to its subject, **m** is the gap inside a
block, **xl** is the break between blocks. Needing a fourth means the stack is wrong.

| Token | Value | Role |
|-------|-------|------|
| `--gutter` | `clamp(1.5rem, 5vw, 4rem)` | Page padding, left/right/top |
| `--space-s` | `clamp(1rem, 2vw, 1.5rem)` | Label to its subject |
| `--space-m` | `clamp(2rem, 5vw, 3.5rem)` | Gap inside a block |
| `--space-xl` | `clamp(5rem, 12.5vw, 9rem)` | Break between blocks |
| `--row-pad` | `clamp(1.1rem, 2.2vw, 1.6rem)` | Padding above and below an episode row's text, named so `.season-title` can subtract it |

| Gap | Home | About | Credits |
|-----|------|-------|---------|
| Platform links to first block | `--space-xl` | `--space-xl` | `--space-xl` |
| Heading to what it names | `--space-s` | `--space-s` | `--space-xl`, except the team line at `--space-s` |
| Items inside a block | `--space-m` between seasons | `--space-m` between principles | `--space-xl` between card rows, `--space-m` between videographers |
| Block to block | `--space-xl` | `--space-xl` | `--space-xl` |

Credits uses `--space-xl` where the others use `s` or `m` because the portraits are
large and a tighter gap crowds them. `--portrait` and `--col-gap` are widths and stay
page-local.

Bottom padding is `clamp(1.25rem, 5vh, var(--gutter))`, measured against viewport
height so the last element sits the same distance off the bottom on every page.

**Page structure.** `body` is a flex column at `min-height: 100svh`, padded by
`--gutter`. No max-width container, except credits, whose `main` is capped at 85rem
and centered. Every page is standalone: the head block, wordmark SVG and footer are
repeated in all three files, and since the footer carries the wordmark too, that SVG
now sits twice in each. Change one, change all six.

**Border radius:** 6px on cover art, 50% on credit portraits, 0 everywhere else.

### Breakpoint

`46rem` (736px), shared by every page and by `script.js`'s `matchMedia`. Below it:

- **Header:** platform names collapse to icons, with "Listen on" at their size; the
  site nav folds behind a plus beside the wordmark.
- **Home:** the list becomes the mobile feed; the tagline switches to viewport sizing.
- **About:** each band stacks photo then text, left aligned; the statement switches to viewport sizing.
- **Credits:** grids drop to one column.
- **Footer:** steps down one size, the columns close up, and the bottom band stacks.

## Components

### Wordmark
Inline SVG, filled with `currentColor`, linked to `/` on every page, with the standard
hover fade. `will-change: opacity` stops Safari re-hinting the glyphs mid-hover.

### Site nav
About / Credits, bold uppercase, stacked right-aligned beside the wordmark.

**Below 46rem:** the links fold behind "MORE" and the episode row's plus
(`.menu-toggle`), set vertically at `1.25rem` down the right edge beside the wordmark,
reading bottom to top with the plus at the top and upright. Tapping it slides About and
Credits open under it, right aligned at `8vw`, `--space-s` below the wordmark, on the
mobile feed's 500ms cubic ease-in-out; the words fade and drift in 0.1s and 0.18s
behind. The plus turns to a minus; Escape closes. A `.js` class set by a one-line
script in each page's head hides the nav before first paint, so without JS the nav
stays open and the plus never shows.

### Platform bar
"LISTEN ON: SPOTIFY / APPLE PODCASTS / DEEZER". Bold uppercase at the label size,
normal letter spacing, the label in gray. Icons are CSS masks, so they inherit
`currentColor` and shift to brand color on hover. Below 46rem the names are visually
hidden, the icons enlarge to 1.5em, and "Listen on" takes the same 1.5em so label
and icons read as one line. There the icons are `--muted` like the label. The same `.platform-name` rule drives the per-episode
listen links.

### Tagline
The homepage's one sentence, bold, in sentence case and all `--fg`, wrapping edge
to edge. No lit phrases.

Above: `--space-xl`, or `--space-xl` plus `--space-m` under 46rem. Below: `--space-xl`
plus `--space-m`, plus `.episodes-layout`'s `--space-m` padding, so the sentence stands clear of both the masthead and the cover.

**Homepage entrance:** `fade-in` and `drift-in` over 1.2s, in two beats: tagline at
0.1s, then the whole `.episodes-layout` at 0.2s. The header stays still. Settled by
about 1.5s. Pure CSS, removed under reduced motion.

### Season section
A `<section class="season">` per season, newest first, stacked in `.seasons` to the
right of the cover. The first heading starts level with the top of the cover. The
heading uses the credits heading type and is **not** uppercased, so it labels the
list rather than reading as a second masthead.

- `--space-m` padding at the top of `.episodes-layout`; no rule over the list.
- `--space-s` from heading to rows. The heading's margin is
  `--space-s - --row-pad` because the first row's padding supplies the rest. Below
  46rem, where rows have no padding, it is plain `--space-s` and "Coming soon." drops
  its top padding.
- `--space-m` between seasons, so each heading sits closer to its rows than to the
  season above.

An announced season with no episodes yet shows its heading and a `.season-coming`
row: "Coming soon." in `--muted`, sized and padded like an episode number. The seasons
come from `ANNOUNCED_SEASONS` in `scripts/build.py`.

### Episode row
Native `<details>` / `<summary>`, sharing `name="episode"`, so it works with JS off.
The summary is a flex line: gray number, bold uppercase title (wraps, never
truncates), and a plus/minus toggle built from `::before`/`::after` bars sized in
`em`. A `--rule` line under every row above 46rem.

Opening reveals the description (justified, hyphenated, max 60ch), the meta line
(date - duration), then platform links. With `script.js`, rows slide open and closed
on the mobile feed's engine (500ms cubic ease-in-out), and opening one folds the
other at the same time. Above 46rem the page eases the clicked row up until its top
rule sits level with the top of the cover, which is the panel's sticky offset
(`--gutter`); the first row already sits on that line, so every row lands on the same
one. Without a cover panel the clicked row simply holds its place under the pointer. Above 46rem the text also fades and drifts in over
0.6s. The toggle turns back to plus on the closing click via `.is-closing`. Padding
sits on `.episode-body` so the fold reaches 0.

### Episode art panel
One square cover for the page, sticky at `--gutter` from the top, released at the end
of the last season. Size `clamp(240px, 47vw, max(620px, 100vw / 3))`: capped at 620px,
then growing at a third of the viewport from 1860px up.

It shows the newest cover until the pointer visits a row, then that row's cover (on
`(hover: hover) and (pointer: fine)` devices), and the open row's cover while one is
expanded. Hover is sticky: leaving a row holds its cover rather than snapping back to
the newest, so the panel reads as a record of where the reader has been. Two stacked `<img>` layers: `script.js` loads the incoming cover into the
hidden layer, then swaps `.is-active` for a 0.4s crossfade, with no scale. At most
one swap per frame, because leave and enter fire together when moving between rows
and swapping on both skipped the crossfade. Hidden below 46rem.

While an incoming cover is still downloading its layer carries `.is-loading` and stays
at opacity 0, so the frame's own `--surface` square shows instead: an `<img>` keeps
painting its previous image until the new `src` decodes, which used to fade in a cover
from two hovers ago. The placeholder is the frame, not an image, so it costs no
request. `script.js` also warms all eight covers on `requestIdleCallback` after load
(they sit on a remote CDN and every row's own `<img>` is `display: none` on desktop),
so the dark square is a blink at most.

### Mobile feed
The episode list below 46rem. Season headings and "Coming soon." stay. Each summary is
just its cover: full width, square, 6px radius over `--surface`, `--gutter` between
covers. Number and title stay in the summary for screen readers (visually hidden) and
are shown at the top of the open text as `.episode-heading` (bold uppercase, 1.15rem,
number in `--muted`, `aria-hidden`). Then description, meta and platform icons (1.5em,
the header's mobile size), with
`--gutter` above and `--space-m` below. Padding sits on `.episode-body`, not the
panel, so the fold reaches 0.

Tapping a cover opens its text and pushes the covers below down; tapping again folds
it; opening one closes any other. With `script.js`, one frame loop drives every panel
and the scroll over 500ms on a cubic ease-in-out. The opening title eases to its
`scroll-margin-top` (`calc(100svh / 3)`), so the bottom of the cover stays in view
above it. Scroll is set with `scrollTo` to a whole pixel each frame (fractional
`scrollBy` made the end shiver). `.is-list-moving` turns scroll anchoring off during
the motion. Closing does not scroll. Instant under reduced motion; without JS the
native accordion just toggles.

### Credit card
The whole card links to that person's LinkedIn: circular portrait
(`clamp(150px, 24vw, 360px)`, `object-fit: cover`), bold uppercase name, role in
`--fg` and country in `--muted`. Three across, one below 46rem.

**Team line.** `.credits-lede` introduces the grid: "Meet the people behind the
episodes.", centred gray prose at the prose size, `--space-s` under "Our team" so it
belongs to the heading rather than floating between it and the portraits. The one
place on this page that uses `--space-s`.

**Contact line.** `.contact-line` closes the page, `--space-xl` under the
videographers: centred gray prose at the prose size, "The future is a
conversation." with only "Contact us." as a `--fg` underlined link that opens the
contact overlay. It is the site's one way into the form.

**Entrance:** `fade-in` and `drift-in` over 1.2s, 100ms apart: "Our Team" at 0.1s,
"Our Team" and the line under it at 0.1s,
each row of cards at 0.2s and 0.3s, the videographers at 0.4s, the contact line at
0.5s. Whole by about 1.7s. Removed under reduced motion.

### About page
A manifesto in three beats, the statement landing as the conclusion:

1. **Principles.** `.about-sections`, `--space-xl` below the masthead: three
   alternating bands, `--space-xl` apart. Each band is a square photo
   (`.about-figure`, the homepage cover's size, `object-fit: cover`, 6px radius over
   `--surface`) with its credit caption set inside the bottom corner on the outer
   edge (bottom right on band 02; bottom right on every band below 46rem),
   `0.75rem` in, in `--muted` at `0.75rem` (`0.625rem` at 70% opacity below 46rem), and the principle beside it at
   `--space-m`, centred on the photo's height. Band 02 is mirrored with `row-reverse`
   and its text right aligned against the photo. Each heading has its number (`01` to
   `03`, `aria-hidden`, `--muted`) on its own line above. Prose in `--fg`, `--space-s`
   below, max **48ch**: the cap sits on the paragraph, so it is measured in the prose
   size and every band reads the same width. Below 46rem every band stacks photo then
   text, all left aligned, `--space-m` apart.
2. **Statement.** `.about-statement`, bold sentence case at the tagline's scale,
   `--space-xl` above and nothing below: it closes the page. The sentence is
   `--muted`; only "the unexpected and the improbable" (a `<strong>` with weight
   reset) is `--fg`. Credits are reached from the nav, not from the prose, and the
   contact line lives at the end of the credits page.

**Entrance:** in reading order, 1.2s per block (the other pages' tempo; 1.8s made the
photos, and so their colour, feel late): opacity on `ease-in-out`
and a 0.375rem drift on `--ease-drift`. Blocks on screen at load run in pure CSS,
delays principles 0.15s / 0.4s / 0.65s, statement 1s. Blocks below
the fold wait hidden (`.is-waiting`, set by `script.js`) and play the same entrance
with no delay as each scrolls into view (`.is-entering`, 10% up from the bottom
edge), 250ms apart when several arrive together. Under reduced motion the
animations are removed, not shortened, because the global rule does not shorten
delays, and nothing waits.

**Scroll colour:** each band's photo goes from `grayscale(1)` to full colour and
its heading and prose from `--muted` to `--fg` as it rises into view, holds through
the middle of the screen, and goes back as it leaves (keyframes `band-photo` and
`band-words`, gray at 0% and 100%, colour from 30% to 70%). Pure CSS, a view
timeline per band (`view-timeline: --band`), linear, so the colour is always exactly
where the scroll is at any speed; neighbouring bands crossfade in the gap. The
number stays `--muted`. No hover state: a stale hover during scrolling held the
colour back. Browsers without `animation-timeline` keep every band in colour.

### Contact overlay
The contact form, on the credits page only, opened from that page's contact line. No
card and no elevation: a `min(34rem, 100%)` panel on `--bg` inside a 1px `--rule`
border,
centred over a `rgb(10 10 10 / 0.92)` scrim, `--space-m` padding. The close
control is the episode row's plus turned 45 degrees, `--muted` lifting to `--fg`.
Title at the row size, bold uppercase; intro in `--muted` prose capped at 48ch;
fields are a bold uppercase `--muted` label over an input with no box, just a
1px `--rule` underline that goes `--muted` on hover and `--fg` on focus.
The submit button is bold uppercase at the label size on the same hairline
border, which lifts to `--fg` with `--glow` on hover.

**Error state, monochrome.** A field the reader has left empty (or an address
that is not one) takes a 2px `--fg` underline, the heaviest line in the panel,
and shows its message under it at the label size in `--fg`: "Please fill out
this field." The message's line is always reserved (`min-height: 1.6em`), so the
form never jumps. No colour: the cue is weight and brightness. The state is
`:user-invalid`, so nothing is marked wrong before it has been written in.

**Below 46rem** the panel is full width and sits low, near the thumb, but stays a
closed box: all four borders, `--gutter` all round, with `env(safe-area-inset-bottom)`
added at the bottom so it clears the home indicator instead of reading as cut off. It
does not take focus on opening, so the keyboard stays down until a field is tapped.
The close control is a 2.75rem box for the thumb, cross centred.

Opening is 0.3s: opacity on `--ease-fade`, the panel's 0.375rem rise on
`--ease-drift`, the site's one gesture. Closed state is `visibility: hidden`, so
nothing inside it takes keyboard focus.

**Mechanism.** The browser's own validation bubble is a light popup the page
cannot style, so with JS the form is `novalidate` and `script.js` marks the
empty fields itself (`.is-invalid`, styled with `:user-invalid`) and focuses the
first one; a corrected field clears on input. The `required` attributes stay, so
with JS off the browser does the checking its own way.

The email field carries `pattern="[^@\s]+@[^@\s]+\.[^@\s]+"` on top of
`type="email"`, because the type alone accepts an address with no dot in the
domain (`tom@gmail` passes it). The pattern asks for one `@` and a dot after it,
and nothing beyond that: no TLD list, no rules on the part before the `@`. Plus
signs, dots, apostrophes and new TLDs all go through. `checkValidity()` covers
it, so both the JS and the JS-off paths pick it up with no other change.

`:target` opens it, so the links are plain anchors to `#contact`
and the form works with JS off (it posts to Web3Forms and the "close" links are
anchors to `#`). `script.js` adds `.is-open` instead and never touches the hash,
so the page keeps its scroll position; it also focuses the first field, closes on
Escape or a click on the scrim, returns focus to the link it came from, and locks
the page scroll with `body.is-locked`. Both selectors drive the same rules.

**One form, on the credits page.** The markup sits before that page's footer and
nowhere else, so the contact line's `#contact` is a local anchor and the overlay
opens where the reader already is. Home and about carry no form and no opener.

A page arrived at with `#contact` already in the URL (an old `/about/#contact`
link, or a shared one) still opens on arrival: `script.js` swaps the hash for
the class state and drops it from the URL, and with JS off `:target` does the
same on its own. An opener whose `href` points at another page is left to
navigate.

**Sent state.** A sent message is answered in the panel it was written in: same
box, same close cross, the title, intro and form swapped for a "Message sent"
title and one line of `--muted` prose, "Thank you." No confirmation page of our own,
and never Web3Forms' own success page. The swap is `display`, on child selectors
(`.contact-panel > .contact-title`, `> .contact-intro`, `.contact-form`), so the
confirmation's own title and line, one level deeper, are untouched.

Two ways in, like the overlay itself. With JS, `script.js` posts the form with
`fetch` and adds `.is-sent`, so the reader never leaves the page and the hash is
never touched; the button reads "Sending" while the request is out, and focus
moves to the close cross. With JS off, a hidden `redirect` field sends the reader
back to the credits page at `#sent`, where `:has(.contact-sent:target)`
both opens the overlay and shows the confirmation. The hidden field carries the
absolute `https://spreadthefuture.com/credits/#sent`; Web3Forms requires a
full URL on the same domain. A failed `fetch` falls back to that ordinary post,
so a written message is never lost to a network error. Closing the panel clears
`.is-sent` and resets the form, so the next message starts clean.

### Quotes
The homepage's closing block, `--space-xl` below the list. A `<section class="quotes">`
of `<figure>`s (`<blockquote>` + `<figcaption>`). Quote at the heading scale, capped
at 38ch, centered, in sentence case. The source sits `--space-s` below as a gray label;
a work's title is a `<cite>` in italic.

Without JS the quotes stack `--space-m` apart. `script.js` adds `.is-rotating`: all
quotes share one grid cell (so the block never changes height), bottom aligned, and
crossfade with a 0.5rem rise over 0.6s, the incoming one 0.2s behind. It also appends
`.quotes-nav`, one 2.5rem `--rule` bar per quote. The active bar fills in `--fg` over
**9s**, and that animation is the timer: `script.js` advances on `animationend`. The
fill pauses on hover (real hover devices) or keyboard focus. Under reduced motion the
fill is removed, so rotation stops and the bars are manual controls.

**Entrance:** `.is-waiting` hides the block until a quarter of it is in view, then
`.is-entering` runs the fade and drift, bars 0.2s behind. The 9s timer starts there.

### Footer
Two bands, left aligned, `max(6rem, var(--space-xl))` **plus `--space-m`** above: the
footer is a block of its own now rather than two lines, so a page break's worth of air
was not enough to make it read as the end.

**Top band (`.footer-top`).** The wordmark on the left, linked to `/` with the
masthead's hover, at `clamp(150px, 16vw, 210px)` wide: well under half the masthead's
smallest size, so it signs the page off rather than starting it again. It is the only
thing in the footer in `--fg` by inheritance, set on `.footer-wordmark` because the
footer's own colour is gray. The band is `align-items: flex-start`, so the mark
starts level with the column headings, dropped `0.25rem` to line its caps up with
theirs rather than its box with their line box: the SVG carries no leading and a
heading does. A bottom-aligned version was tried and read as hanging in the space.

Under the mark, `.footer-tagline`: "Produced by an international team with love ♥︎",
the footer's own size and `--muted-dim` by inheritance, `--space-s` below the mark
(the mark carries no leading, so less read as crowding it) and `line-height: 1.6` as
prose. "international team" links to the credits page and is the site's one hidden
link: no underline and no colour of its own at rest, so the line reads as a sentence
and the wordmark stays the lit thing in the band. Hover and `:focus-visible` lift it
to `--fg`, glow it and draw the prose underline at `0.2em`. The mark and the line are wrapped in `.footer-brand`
(`max-width: 24rem`) so the pair moves as one item in the band and the columns stay
against the right edge. It is the site's only sign off, and it sits on all three
pages.
Pushed to the right edge, `.footer-cols`, two columns `clamp(2.5rem, 7vw, 7rem)`
apart: **LISTEN** (Spotify, Apple Podcasts, Deezer) and **THE PODCAST** (About,
Credits). Headings are the label size, bold, uppercased in CSS, in `--fg`, `--space-s`
above their list. The links are the same size and weight in `--muted`, `0.75rem`
apart, lifting to `--fg` and then glowing like every other gray link. Both bands wrap
to a stack when they no longer fit side by side.

Two columns, not three or four. The site has about ten destinations and two of them
already sit in the header, so a wider grid would need invented links. No contact
column: the form is reached from the credits page's closing line (see **Contact
overlay**). No season links, which would mean new markup inside the generated block.

**Bottom band (`.footer-bottom`).** A 1px `--rule` line, `--space-m` under the
columns and `--space-s` above this row, then the social links on the left and the
copyright on the right, right aligned against them. LinkedIn, Instagram, TikTok and a
bold tracked "RSS" word, in `--muted`; the credit and the copyright on one line in
`--muted-dim`, the same quiet gray as the tagline in the band above. None of the three sits in a badge or a container: LinkedIn is
the bare "in", not the filled square it ships as, because a filled square reads as a
block of light next to an outline and pulls the row off center. The glyphs are CSS
masks sized in `rem` (not `em`) so they do not scale with the copyright type. All
three are drawn in a 24x24 box, so one 1.25rem square aligns them; the RSS word
centers on the same axis. Instagram is the only one full-bleed in that box.
The LinkedIn "in" and the TikTok note are bare marks, so each file scales its glyph
to 21 of the 24 units and centers it, which holds them a hair inside Instagram's
frame. Instagram's frame and lens ring are 2.6 of its 24 units, which lands near
2.2px on a 20px glyph; rescaling it means redoing that arithmetic.
Each link is padded to a 32px tap target, with the padding taken back out of the row
gap so glyphs still read 1.75rem apart.

There is no contact glyph here either: `assets/social/mail.svg` stays in the
repo, unused.

**Below 46rem** the type steps down to `0.8rem`, the columns close to `2.5rem` apart
but stay two abreast (they are two or three short words each), and the bottom band
stacks left aligned.

## Interaction

- **One glow:** `--glow` (in `:root`), two `text-shadow` layers in `--fg`: a 0.2em
  core at 20% and a 0.8em haze at 10%, in em so it scales with the type.
  `--glow-filter` is the same two layers as `drop-shadow()`, for the SVG wordmark and
  the masked footer icons. Hover only: nothing glows at rest. Gray never glows.
- **One hover state:** white things glow, over `0.2s ease`, declared once as a grouped
  rule near the top of `styles.css`. Add new hoverable things to that rule. Gray links
  lift to `--fg` first and then glow (episode description links, per-episode listen
  links, footer icons). In a row or card only the white text glows: the episode title
  but not its number, the credit name and role but not the country. Platform icons
  also shift to brand color. The quote bars are the one exception: shapes, not type,
  they keep a dim to `opacity: 0.8`.
- **No underlines** except on prose links, with a `0.2em` offset: the episode
  description's links and the credits contact line's "Contact us." link, both also
  lifted to `--fg`. The footer tagline's credits link is the one exception: it
  draws its underline on hover and focus only.
- **Focus:** `:focus-visible` is a 2px `--fg` outline at 4px offset.
- **Motion:** one gesture, a fade plus a small upward drift. Two curves in `:root`:
  `--ease-fade` (`ease-in-out`) for opacity, `--ease-drift`
  (`cubic-bezier(0.25, 0.46, 0.45, 0.94)`) for movement. One pair of keyframes,
  `fade-in` and `drift-in` (0.375rem rise). Opacity never goes on an ease-out: it snaps
  on. Entrances start within 0.3s of load and settle by about 1.5s (about is the 2.5s
  exception). No animation library.
- **Reduced motion:** a global `prefers-reduced-motion` block cuts every transition,
  animation and smooth scroll to 0.01ms.

## Imagery

- **Episode covers:** square, from the RSS feed, 6px radius over `--surface`,
  `object-fit: cover`. `build.py` writes an `.episode-art` image into every summary.
  Above 46rem those are hidden and only feed the panel; below 46rem they are the rows.
- **About photos:** `assets/about-photos/1.jpg` to `3.jpg`, in band order, served as
  is and squared in CSS with `object-fit: cover`.
- **Credit portraits:** 720x720, JPEG q68, from `assets/credits-photos/`, cropped to a
  circle.
- **Icons:** only the three masked platform glyphs and the three masked social glyphs
  (`assets/social/`, single path, single color, in a 24x24 box; Instagram full-bleed,
  LinkedIn and TikTok scaled to 21 units and centered).
  No badges or containers. `mail.svg` sits beside them, no longer
  used by any page. No illustration or decorative graphics.

## Do's and don'ts

### Do
- Use only the six color tokens. New grays go in `:root`.
- Size type with `clamp()` rather than adding a breakpoint.
- Keep every gap on `--space-s` / `--space-m` / `--space-xl`.
- Write uppercase copy in sentence case in the markup and uppercase it in CSS.
- Reuse `--rule` at 1px for any new separator.
- Explain non-obvious CSS in a comment above it, as the file already does.

### Don't
- Add a chromatic color. Brand colors are for platform icon hover only.
- Use pure `#000` or `#FFF`.
- Add shadows, gradients or any elevation. The system is flat. The one exception is
  `--glow`: use it as is, never a second glow or a glow on gray.
- Add border radius beyond the 6px covers and circular portraits.
- Add a font, a weight, or a fourth spacing size without asking.
- Add a JavaScript dependency. The site must work fully with JS off; `script.js` is
  enhancement only.
- Put markup or styling in `scripts/build.py`. Every generated tag lives in the four
  `<template>` blocks in `index.html` (`episode`, `episode-link`, `season`,
  `season-upcoming`). The cover panel and `.episodes-layout` are written once outside
  the generated block.

## Known inconsistencies

Left as is, each waiting on a design call:

- **Off-token values.** Summary gap `1.5rem`, `.episode-links` top `1.75rem`,
  `.episode-body` bottom `clamp(2.5rem, 5vw, 4rem)`, credit name/role margins
  `1rem` / `0.5rem`, about caption `0.75rem` type (`0.625rem` at `opacity: 0.7` on mobile) and
  `0.75rem` inset, contact field
  label gap `0.5rem`, error message pull-up `-0.25rem`, close control
  `2.75rem` / `0.9rem`, submit padding `0.75rem 1.75rem`, mobile open
  heading margin `0.75rem`, footer link list gap `0.75rem`, brand column `24rem`,
  column gap
  `clamp(2.5rem, 7vw, 7rem)` and wordmark cap-height drop `0.25rem`, toggle transition `0.25s`
  against the `0.2s` hover.
- **The footer wordmark's own size**, `clamp(150px, 16vw, 210px)`, which is not
  derived from the masthead's `clamp(250px, 34vw, 520px)` by any ratio. It was
  picked by eye to read as a sign-off.

## Known duplication

Both deliberate:

- **`.visually-hidden` and the mobile `.platform-name` rule** hold the same five
  declarations. One is unconditional, the other inside the 46rem media query, so they
  cannot share a selector. Change one, change the other.
- **`.platforms` and `.episode-links`** share font-size, font-weight, text-transform
  and gap. Merging them is a design decision (same thing, or two things that match?),
  not a cleanup.
