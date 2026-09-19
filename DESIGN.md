# SPREAD THE FUTURE: Style Reference

> Documents the site as built, not as imagined. Update it in the same commit as any
> design change, along with `PROJECT-CONTEXT.md`.
>
> Last updated: 2026-09-20

A dark podcast site built as a single typographic stack. No chrome: no cards, no
shadows (one faint text glow on hover aside), no borders except hairline rules, no chromatic
color except three platform brand colors on hover. Hierarchy comes from scale and weight alone, on one family in
two weights. Every size is a `clamp()`, so the page is fluid, and the one breakpoint
is structural. The signature moves: the wordmark set wide, the thin `--rule` under
every episode, and one persistent square cover that crossfades beside the list.

## The system at a glance

One value per job, shared by all three pages. Reuse these rather than adding a
near-duplicate.

| Job | The one value |
|-----|---------------|
| Breakpoint | `46rem`, always written `max-width: 46rem` |
| Vertical gaps | `--space-s` / `--space-m` / `--space-xl`, on every page |
| Line heights | `1` (site nav), `1.6` (prose), `1.2` (everything else, set on `body`) |
| Label size (platform bar, episode listen links, quote source) | `clamp(0.875rem, 1.2vw, 1rem)` |
| Row size (episode row, "Coming soon.", credit name, about heading) | `clamp(1.05rem, 1.9vw, 1.5rem)` |
| Prose size (about text and closing, episode description and meta, credit role and location) | `clamp(1rem, 1.7vw, 1.25rem)` |
| Prose link (episode description) | underlined, `text-underline-offset: 0.2em`; the about closing link is `--fg`, no underline |
| Glow (white text on hover only) | `--glow`, or `--glow-filter` for the wordmark and footer icons |
| Entrance | `fade-in` + `drift-in` keyframes, on `--ease-fade` / `--ease-drift` |
| Brand name in copy | `SPREAD THE FUTURE`, uppercase in the markup |
| Page description (meta and Open Graph) | The same sentence on all three pages, matching the tagline |

## Colors

| Name | Token | Value | Role |
|------|-------|-------|------|
| Near black | `--bg` | `#0A0A0A` | The page canvas. Never pure black |
| Soft white | `--fg` | `#F4F4F2` | Primary text, the wordmark, icons at rest, the focus ring. Never pure white |
| Gray | `--muted` | `#8A8A8A` | Secondary text: episode numbers, meta, descriptions, per-episode listen links, the "Listen on" label, credit locations, the unlit words of the about statement, footer social links, the mobile header's platform icons, "Coming soon." |
| Rule | `--rule` | `#2A2A2A` | The 1px line under every episode row, above 46rem. The only border |
| Surface | `--surface` | `#1A1A1A` | Behind cover artwork while it loads |
| Footer gray | `--muted-dim` | `#5C5C5C` | The copyright line only |

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
- **Case:** uppercase for the site nav, platform labels, episode rows, credit names,
  and about headings. Written in sentence
  case in the markup and uppercased in CSS, so screen readers read words. Not
  uppercased: the homepage tagline, the about statement, the season heading ("Season 1"), the quotes, and the credits headings.
  The brand name is the one thing uppercase in the markup.
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
| Heading to what it names | `--space-s` | `--space-s` | `--space-xl` |
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
repeated in all three files. Change one, change all three.

**Border radius:** 6px on cover art, 50% on credit portraits, 0 everywhere else.

### Breakpoint

`46rem` (736px), shared by every page and by `script.js`'s `matchMedia`. Below it:

- **Header:** platform names collapse to icons, with "Listen on" at their size; the
  site nav folds behind a plus beside the wordmark.
- **Home:** the list becomes the mobile feed; the tagline switches to viewport sizing.
- **About:** each band stacks photo then text, left aligned; the statement switches to viewport sizing.
- **Credits:** grids drop to one column.
- **Footer:** steps down one size.

## Components

### Wordmark
Inline SVG, filled with `currentColor`, linked to `/` on every page, with the standard
hover fade. `will-change: opacity` stops Safari re-hinting the glyphs mid-hover.

### Site nav
About / Credits, bold uppercase, stacked right-aligned beside the wordmark.

**Below 46rem (trial):** the links fold away behind "MORE" and the episode
row's plus (`.menu-toggle`), set vertically at `1.25rem` down the right edge beside the
wordmark, reading bottom to top with the plus at the top; the plus stays upright. Tapping it slides About and Credits open under it, right aligned at `8vw`, `--space-s` below
the wordmark, on the mobile feed's 500ms cubic ease-in-out; the words fade and drift in
0.1s and 0.18s behind. The plus turns to a minus; Escape closes. A `.js` class set by
a one-line script in each page's head hides the nav before first paint, so without JS
the nav simply stays open and the plus never shows.

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
other at the same time. The clicked row holds its place while a row above it folds
(never past the window's top edge). Above 46rem the text also fades and drifts in over
0.6s. The toggle turns back to plus on the closing click via `.is-closing`. Padding
sits on `.episode-body` so the fold reaches 0.

### Episode art panel
One square cover for the page, sticky at `--gutter` from the top, released at the end
of the last season. Size `clamp(240px, 47vw, max(620px, 100vw / 3))`: capped at 620px,
then growing at a third of the viewport from 1860px up.

It shows the newest cover at rest, the hovered row's cover (on
`(hover: hover) and (pointer: fine)` devices), and the open row's cover while one is
expanded. Two stacked `<img>` layers: `script.js` loads the incoming cover into the
hidden layer, then swaps `.is-active` for a 0.4s crossfade, with no scale. At most
one swap per frame, because leave and enter fire together when moving between rows
and swapping on both skipped the crossfade. Hidden below 46rem.

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

**Entrance:** `fade-in` and `drift-in` over 1.2s, 100ms apart: "Our Team" at 0.1s,
each row of cards at 0.2s and 0.3s, the videographers at 0.4s. Whole by about 1.6s.
Removed under reduced motion.

### About page
A manifesto in three beats, the statement landing as the conclusion:

1. **Principles.** `.about-sections`, `--space-xl` below the masthead: three
   alternating bands, `--space-xl` apart. Each band is a square photo
   (`.about-figure`, the homepage cover's size, `object-fit: cover`, 6px radius over
   `--surface`) with its credit caption set inside the bottom corner on the outer
   edge (bottom right on band 02, bottom left on every band below 46rem),
   `0.75rem` in, in `--muted` at `0.75rem`, and the principle beside it at
   `--space-m`, bottom aligned to the photo. Band 02 is
   mirrored with `row-reverse` and its text right aligned against the photo. Each
   heading has its number (`01` to `03`, `aria-hidden`, `--muted`) on its own line
   above. Prose in `--fg`, `--space-s` below, max 60ch. Below 46rem every band stacks
   photo then text, all left aligned, `--space-m` apart.
2. **Statement.** `.about-statement`, bold sentence case at the tagline's scale,
   `--space-xl` above and `--space-xl` + `--space-m` below. The sentence is
   `--muted`; only "the unexpected and the improbable" (a `<strong>` with weight
   reset) is `--fg`.
3. **Sign off.** `.about-closing`, centred, `--space-xl` above, prose size in
   `--muted`, its credits link in `--fg`, no underline: the sentence's one link.

**Entrance:** in reading order, 1.2s per block (the other pages' tempo; 1.8s made the photos, and so their colour, feel late): opacity on `ease-in-out`
and a 0.375rem drift on `--ease-drift`. Blocks on screen at load run in pure CSS,
delays principles 0.15s / 0.4s / 0.65s, statement 1s, sign off 1.35s. Blocks below
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
Centered, two lines, `max(6rem, var(--space-xl))` above. First, LinkedIn, Instagram
and a bold tracked "RSS" word, in `--muted`, `--space-s` above the copyright line in
`--muted-dim`. The glyphs are CSS masks sized in `rem` (not `em`) so they do not scale
with the copyright type. Both fill their 24x24 box, so one 1.25rem square aligns their
edges; the RSS word centers on the same axis. Each link is padded to a 32px tap
target, with the padding taken back out of the row gap so glyphs still read 1.75rem
apart.

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
- **No underlines** except on episode description prose links, with a `0.2em`
  offset. The about closing's credits link lifts to `--fg` instead, the sentence's
  only link.
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
- **Icons:** only the three masked platform glyphs and the two masked social glyphs
  (`assets/social/`, single path, single color, full-bleed in a 24x24 box). No
  illustration or decorative graphics.

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
  `1rem` / `0.5rem`, about caption `0.75rem` type and inset, mobile open
  heading margin `0.75rem`, toggle transition `0.25s`
  against the `0.2s` hover.

## Known duplication

Both deliberate:

- **`.visually-hidden` and the mobile `.platform-name` rule** hold the same five
  declarations. One is unconditional, the other inside the 46rem media query, so they
  cannot share a selector. Change one, change the other.
- **`.platforms` and `.episode-links`** share font-size, font-weight, text-transform
  and gap. Merging them is a design decision (same thing, or two things that match?),
  not a cleanup.
