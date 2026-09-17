# Spread The Future — Style Reference

> Near-black canvas, soft-white type, thin rules. A masthead of oversized bold
> uppercase over a list of episodes, where the only decoration is a square cover
> and a 6px radius.

**Theme:** dark

> **Keep this file current.** It documents the site as built, not as imagined.
> Whenever the design changes (a color, a size, a component, a breakpoint),
> update this file in the same commit, along with `PROJECT-CONTEXT.md` and its
> "Last updated" line.
>
> Last updated: 2026-09-17

Spread The Future is a podcast site built as a single typographic stack. There is
no chrome: no cards, no shadows, no borders except hairline rules, no chromatic
color except the three platform brand colors that appear only on hover. Hierarchy
comes from scale and weight alone, on one family, in two weights. Every size is a
`clamp()`, so the page is fluid rather than stepped through breakpoints, and the
two breakpoints that do exist (40rem, 46rem) are structural, not cosmetic. The
signature moves are the wordmark set as wide as the viewport allows, the thin
`--rule` lines that separate every episode, and the one persistent square cover
that crossfades beside the list, every season's rows stacked in the column next
to it.

## Colors

| Name | Token | Value | Role |
|------|-------|-------|------|
| Near black | `--bg` | `#0A0A0A` | The page canvas, everywhere. Never pure black |
| Soft white | `--fg` | `#F4F4F2` | All primary text, the wordmark, icon fill at rest, the focus ring. Never pure white |
| Gray | `--muted` | `#8A8A8A` | Secondary text: episode numbers, meta lines, descriptions, the per-episode listen links and their icons at rest, the "Listen on" label, credit locations, the mobile nav divider, the footer's social links, the "Coming soon." row in an announced season |
| Rule | `--rule` | `#2A2A2A` | The 1px line over the episode list and under every episode row, above 40rem. The only border in the system |
| Surface | `--surface` | `#1A1A1A` | Sits behind cover artwork while it loads, so the frame is never a hole in the page |
| Footer gray | `--muted-dim` | `#5C5C5C` | The copyright line only. A step further back than `--muted` |

Brand colors appear on hover only, on the platform icon and nothing else:
Spotify `#1ED760`, Apple Podcasts `#A945E3`, Deezer `#A238FF`.

## Typography

### Arial — the only typeface

Taken from the viewer's own system wherever one exists, downloaded only where it
does not. Stack: `'STF Sans', Arial, Helvetica, sans-serif`.

`STF Sans` is not a separate typeface. It is the name of four `@font-face` rules
at the top of `styles.css`, each of which asks for Arial's matching PostScript
face first and falls back to the bundled Liberation Sans:

```css
src: local('ArialMT'),
     url('assets/font/liberation-fonts-ttf-2.1.5/LiberationSans-Regular.ttf') format('truetype');
```

The indirection is the whole point, so do not flatten it back to
`font-family: Arial`. A font stack falls through only on a name the system cannot
resolve, and both platforms without Arial resolve the name anyway: Android aliases
`arial` to `sans-serif`, which is Roboto (`<alias name="arial" to="sans-serif" />`
in `/system/etc/fonts.xml`), and Linux fontconfig aliases it to Liberation Sans.
A stack led by `Arial` therefore never reaches any fallback, and Android renders
Roboto. Naming a family the system has no alias for is what forces the `src` list
to be consulted; naming the PostScript face rather than the family (`ArialMT`, not
`Arial`) keeps `local()` out of the same aliases. The wordmark SVG has always used
the same trick with `Arial-BoldMT`.

| Platform | Renders | Font downloaded |
|----------|---------|-----------------|
| Windows, macOS, iOS | Arial, the real one, matched by PostScript name | none |
| Linux with Arial installed | Arial | none |
| Android, Linux without Arial | Liberation Sans, metric-compatible with Arial: same advance widths, same line breaks | ~400KB per face used |

Because the faces are matched one at a time, a viewer with Arial installed
downloads nothing at any weight, and a viewer without it downloads only the faces
the page actually uses: regular and bold always, italic at load too, for
the work titles in the quote sources, bold italic effectively never.

- **Weights:** 400 (body, meta, prose) and 700 (everything else). No other weight.
- **Case:** headings, nav, episode rows, credit names and the tagline are
  uppercase. All of it is written in sentence case in the markup and uppercased
  in CSS, so screen readers read words rather than spelling them out. The one
  exception is the season heading, which is set in sentence case and carries no
  `text-transform` at all: "Season 1", one capital.
- **Letter spacing:** `0.01em`–`0.02em` on large bold type, normal on the
  small bold labels (platform bar, episode listen links, quote source), and
  `0.12em` only on the footer's RSS word. Nothing negative.
- **Settled:** the family is Arial. The earlier open question between Liberation
  Sans and Inter is closed. Do not swap the stack, change the `local()` names, or
  rename the `STF Sans` family without asking.

Two loading consequences to keep in mind:

- `font-display: swap` means a viewer without Arial paints in Roboto (Android) or
  their default sans first and swaps when the file lands, which reflows slightly
  on a slow connection. The alternative was hiding the text until it arrives.
- **Do not add `rel="preload"` for these files.** Preload fetches unconditionally,
  which would force a 400KB download onto every visitor who already has Arial and
  needs nothing. The `src` fallback is deliberately lazy.

The wordmark is an inline SVG of live `<text>` in Arial Bold, repeated in each
page's markup. It is not outlined, so it renders in whatever the viewer has,
which is now the same family as the rest of the page.

### Type Scale

Every size is fluid. The `clamp()` is the spec; the min/max are the ends of it.

| Role | Size | Weight | Line height | Tracking |
|------|------|--------|-------------|----------|
| wordmark | `clamp(250px, 34vw, 520px)` wide | 700 | 0 | — |
| site nav | `clamp(2rem, 5vw, 4rem)` · `4.6vw` below 40rem | 700 | 1 | — |
| tagline | `clamp(1.35rem, 3vw, 3.75rem)` · `6vw` below 40rem | 700 | 1.15 | 0.01em |
| about statement | `clamp(1.35rem, 5vw, 4rem)` · `8vw` below 40rem | 700 | 1.1 | 0.01em |
| credits intro / season title / quote | `clamp(1.6rem, 4vw, 3.25rem)` | 700 | 1.2 | 0.01em |
| episode row | `clamp(0.95rem, 1.9vw, 1.45rem)` | 700 | — | 0.01em |
| credit name / about heading | `clamp(1.05rem, 1.9vw, 1.5rem)` | 700 | 1.2 on about | 0.01em |
| about text / closing | `clamp(1rem, 1.7vw, 1.25rem)` | 400 | 1.6 | — |
| credit role / location | `clamp(0.9rem, 1.4vw, 1.125rem)` · `1rem` below 46rem | 400 | 1.2 | — |
| episode description / meta (date - duration) | `clamp(0.9rem, 1.2vw, 1.125rem)` | 400 | 1.6 on description | — |
| small label | `0.8125rem` | 700 | — | — |
| footer | `0.8rem` · `0.875rem` above 46rem | 400 | — | — |

## Spacing & Layout

Vertical rhythm is three variables, deliberately: **s** pins a label to the thing
it labels, **m** is the gap inside a block, **xl** is the break between blocks.
A fourth size means the stack itself is wrong.

| Token | Value | Role |
|-------|-------|------|
| `--gutter` | `clamp(1.5rem, 5vw, 4rem)` | Page padding, left/right/top |
| `--space-s` | `clamp(1rem, 2vw, 1.5rem)` | Label to its subject |
| `--space-m` | `clamp(2rem, 5vw, 3.5rem)` | Gap inside a block |
| `--space-xl` | `clamp(4rem, 10vw, 8rem)` | Break between blocks |
| `--band` | `clamp(5rem, 13vw, 12rem)` · `clamp(5rem, 17vw, 8rem)` below 46rem | Credits page only: the one spacing value for that whole page |

Bottom padding is `clamp(1.25rem, 5vh, var(--gutter))` — measured against
viewport *height*, not width, so the last element sits the same distance off the
bottom edge on every page.

### Border radius

| Element | Value |
|---------|-------|
| cover artwork | 6px |
| credit portraits | 50% (circle) |
| everything else | 0 |

### Breakpoints

Two, both structural:

- **40rem** — platform names collapse to icons, the site nav moves under the
  masthead as one row, the episode list becomes the mobile feed (the art panel
  and the rules go, every row is its own cover), the tagline switches to
  viewport sizing.
- **46rem** — the credits and thanks grids drop from three columns to one, the
  about principles drop from three columns to one; the footer steps up one size.

## Components

### Wordmark
**Role:** Brand anchor, top-left of every page

Inline SVG, `clamp(250px, 34vw, 520px)` wide, filled with `currentColor`, wrapped
in a link to `/` on every page including home. Carries the standard hover fade.
`will-change: opacity` keeps it on its own layer so Safari does not re-hint the
glyphs mid-hover.

### Site nav
**Role:** About / Credits, top-right of the header

Bold uppercase at heading scale, stacked right-aligned beside the wordmark. Below
40rem it becomes a single left-aligned row under the masthead, folding the
"Listen on" label in beside About and Credits, separated by gray `⎮` dividers
that exist only at that width.

### Platform bar
**Role:** "LISTEN ON: SPOTIFY / APPLE PODCASTS / DEEZER"

Small bold uppercase at normal letter spacing (thin, wide tracking read as a
generic template label), the label in gray at the same size and weight as the names. Each icon is a CSS mask (not an
`<img>`) so it inherits `currentColor` at rest and transitions to the platform's
brand color on hover, with no second source file. Below 40rem the names are
visually hidden and only the icons show, enlarged. The same `.platform-name`
mechanism drives the per-episode listen links, so both drop to icons together.

### Tagline
**Role:** The one sentence on the homepage, between masthead and list

Bold uppercase, sized near the wordmark, wrapping edge to edge under it.
Asymmetric margins on purpose: `--space-m` above ties it to the masthead,
`--space-xl` below is the largest gap on the page and marks the break to the list.

**Homepage entrance.** The credits page's entrance (the about page's `about-fade`
and `about-drift`, 1.2s) on two beats: the tagline at 0.1s, then
`.episodes-layout`, the cover and every season as one block, at 0.2s. The header stays still, as on the other pages. The list is
legible by about 0.5s and the page settled by about 1.5s. Pure CSS, runs with JS
off, removed under reduced motion.

### Season section
**Role:** One season: its heading, then its episodes

A `<section class="season">` per season, newest first, all of them stacked in
`.seasons`, the column to the right of the page's one cover. A heading sits over
that season's rows, so the season names are read in the list rather than beside
it: the first heading starts level with the top of the cover. The heading is the
credits page's "Our Team" type (`clamp(1.6rem, 4vw, 3.25rem)`, bold), left
aligned on the column edge. It is the site's only heading **not** uppercased:
"Season 1" keeps its single capital, so it labels the list below it instead of
reading as a second masthead. Spacing: a `--rule` line over the list (`.episodes-layout`'s top border, desktop
only), then `--space-m` down to the cover and the first heading, `--space-s` from a
heading to its own rows, and `--space-m` from one season to the next. The pairing
is what separates the seasons: each heading sits closer to its rows than to the
season above. Not `--space-xl` between seasons any more, which was right when a
season was a full-width block of the page and opens a hole in the column now.

A season the show has announced but has no episodes for yet renders the heading
alone, then a "Coming soon." row below it: `.season-coming`, sized and weighted
like an episode number (`.episode-number`'s font size and weight, same row
padding) in `--muted`, so it reads as the row this season doesn't have yet
rather than a caption under the heading. Being an announced season, it is the
top of the column, above the seasons that do have rows. No cover and no other
rows. Which seasons those are is `ANNOUNCED_SEASONS` in `scripts/build.py`; the
row disappears on its own once the feed carries an episode for that season.

### Episode row
**Role:** One episode, expanded in place

Native `<details>` / `<summary>`, every row sharing `name="episode"` so opening
one closes the last. Works with JavaScript off. The summary is a flex line: gray
number, bold uppercase title (wrapping, never truncated), and a plus/minus toggle
at the right edge built from two `::before`/`::after` bars, sized in `em` so it
scales with the row. A `--rule` line under every row (above 40rem; the mobile feed has none). Opening reveals meta,
description (justified, hyphenated, capped at 60ch) and platform links.

### Episode art panel
**Role:** Persistent square cover beside the whole episode list

One for the page, inside the single `.episodes-layout`, which bounds how far it
sticks: it travels the full list and releases at the end of the last season. It
shows the newest episode's cover at rest and answers to a hover on any row in any
season. `clamp(240px, 47vw, max(620px, 100vw / 3))`: it tops out at 620px, then
from a 1860px viewport up it grows again at a third of the viewport width. Sticky
at `--gutter` from the top on desktop. Two
stacked `<img>` layers inside one frame; `script.js` loads the incoming cover into
whichever layer is hidden, then swaps `.is-active`, so the 0.4s opacity transition
crossfades between real pixels. The incoming cover also settles from
`scale(1.015)` to full size over 0.8s on `--ease-drift` (`cover-settle`, an
animation so it replays on every swap), clipped by the frame, so it reads as a
print laid down. The outgoing one only fades. Scale rather than a rise, which
would open a gap at the frame's bottom edge. `script.js` applies at most one swap
per frame, with the last cover asked for: moving from row to row fires leave and
enter together, and swapping on both used to flip the layers back before a paint,
so the new cover replaced the old one in place with no crossfade. Shows the first episode's cover at rest, the
hovered row's cover while the pointer is on a row (gated on
`(hover: hover) and (pointer: fine)`), and the open row's cover whenever one is
expanded. Below 40rem it is hidden: the mobile feed gives every row its own
cover instead.

### Mobile feed
**Role:** The episode list below 40rem

A feed of covers, nothing pinned. The season headings and the "Coming soon." row
stay; the episode rows lose their
rules, number, title and toggle, and each summary is just its episode's cover:
full column width, square, 6px radius over `--surface`, `--gutter` between
covers (the same air as either side of them). The number and title stay in the summary for screen readers (they ride
on the mobile `.platform-name` visually-hidden rule) and are shown at the top of
the open text as `.episode-heading`, in the episode row's type a step larger
(bold uppercase, 1.15rem, number in `--muted`), `aria-hidden` so they are not read twice. Below
that: meta, description, platform icons, with `--gutter` of padding above (the
same as beside the cover) and `--space-m` below, so an open episode's end plus the
next cover's `--gutter` is a clearly bigger break than between two closed covers.
An open cover goes black and white (`filter: grayscale(1)`, 0.5s ease) and takes
its colour back at the tap that closes it: `script.js` sets `.is-closing` on the
row for the fold, since `open` itself stays set until the fold ends. That padding sits on `.episode-body`, not on the panel: the panel is what
slides to 0, and padding on it would stop the fold short and then snap.

Tapping a cover opens its text underneath and the covers below slide down;
tapping it again folds it back; opening one closes any other. With `script.js`,
one frame loop drives every sliding panel and the scroll together over 500ms on
a cubic ease-in-out, so nothing moves on a separate clock. The panel heights
ease, and so does the place on screen of the opening episode's title
(`.episode-heading`), from where it sits under the cover at the tap to its
`scroll-margin-top` (`--gutter`), so the title lands at the top and the cover
scrolls off above. The scroll is whatever keeps it there each frame, set with
`scrollTo` to a whole pixel from its page position (fractional `scrollBy`
nudges made the end of the ease shiver on mobile), so it travels one way only
while a row above it folds.
`.is-feed-moving` switches scroll anchoring off on the root for the length of
the motion. Closing does not scroll. Under reduced motion
both are instant. Without JS the native accordion opens and closes without
animation or scrolling.

### Hairline rule
**Role:** The only divider in the system

1px `var(--rule)`, as the `border-top` of `.episodes-layout` and a `border-bottom` on every
`.episode`, above 40rem only. There is no standalone divider element and no other
border anywhere.
### Credit card
**Role:** One team member

The whole card is a single link to that person's LinkedIn: circular portrait
(`clamp(150px, 24vw, 360px)`, `object-fit: cover`), bold uppercase name, then role
in white and country in gray, sharing one rule so the two lines always match.
Three across, one per row below 46rem.

**Entrance.** The about page's `about-fade` and `about-drift` with the same
curves, per block, but quicker: 1.2s, 100ms between beats. "Our Team" at 0.1s,
each row of cards as one block at 0.2s and 0.3s, the videographers heading and
list together at 0.4s. Whole by about 1.6s. Below 46rem the "rows" are still
cards 1 to 3 and 4 to 6. Removed under reduced motion.

### About page
**Role:** What the podcast is, as a manifesto in three beats, loud to quiet

1. **Statement.** `.about-statement`, the page's one belief as a poster: bold
   uppercase at `clamp(1.35rem, 5vw, 4rem)` (`8vw` below 40rem), line height 1.1, `--space-xl` above
   and below so it stands apart from the masthead rather than finishing it (the
   homepage tagline's job). The sentence is `--muted`; only "the unexpected and
   the improbable", a `<strong>` with its weight reset to inherit, is `--fg`. This
   gray-with-a-lit-phrase move exists only here.
2. **Principles.** `.about-sections`, a three-column grid, `--space-m` gap, one
   column below 46rem, with no rules: space and the numbers carry the structure.
   The heading is the credit name's type, uppercase, with
   its number (`01`, `02`, `03`, `aria-hidden`) on its own line above in `--muted`,
   so the three headings start level however their words wrap. Prose follows
   `--space-s` below, in `--fg`.
3. **Sign off.** `.about-closing`, centred, `--space-xl` above, at the prose size in
   `--muted`, with its link to the credits in `--fg` and underlined.

**Entrance.** Pure CSS, once on load, in reading order, and a fade first. Two
animations per block, both 1.8s: opacity 0 to 1 on `ease-in-out`, and a 0.375rem
upward drift on a gentle ease-out (`cubic-bezier(0.25, 0.46, 0.45, 0.94)`).
Opacity must not go on an ease-out: it front-loads the change and the text snaps
on. Delays: statement 0.15s (clear of first paint and the font swap), principles
0.6s / 0.85s / 1.1s, sign off 1.35s, so the page is whole by about 3s. Only opacity
and transform animate. The brief is calm: a 0.5s version with line draws felt
stressful, and a 1.4s ease-out fade still felt abrupt. Under reduced motion the animations are removed, not shortened,
because the global rule does not shorten delays.

### Quotes
**Role:** The homepage's closing block, between the episode list and the footer

A `<section class="quotes">` of `<figure>`s, each a `<blockquote>` and a
`<figcaption>`. `--space-xl` above it (the break between blocks, as under the
tagline); the footer's own 6rem carries the space below. The quote is set at the
credits intro / season title scale (`clamp(1.6rem, 4vw, 3.25rem)`, bold, 1.2
line height), capped at 38ch and centered on the page, source and bars
included, and in sentence case like the season heading:
these are someone's words, and uppercase would shout them. The source sits
`--space-s` under it as the small gray bold uppercase label, set like the platform bar; the title of a
work in it is a `<cite>`, left in italic.

Without JS the quotes simply stack, `--space-m` apart. `script.js` adds
`.is-rotating`, which puts every quote in one grid cell (so the block is as tall
as the longest quote and never jumps), bottom aligned so the source line always
sits the same distance above the bars, and crossfades between them: 0.6s opacity
plus a 0.5rem rise, the incoming one 0.2s behind the outgoing. It also appends
`.quotes-nav`, one button per quote, each drawn as a 2.5rem `--rule` hairline.
The active bar fills left to right in `--fg` over **9s**, and that CSS animation is
the timer: `script.js` advances on its `animationend`, so the interval lives once,
in `styles.css`. The fill pauses while the pointer is over the block (on real
hover devices) or a bar has keyboard focus, and under reduced motion it is removed
outright, which stops the rotation and leaves the bars as manual controls.

**Entrance.** The block rises in the first time a quarter of it scrolls into
view: `script.js` sets `.is-waiting` (opacity 0, first bar's fill paused), and an
`IntersectionObserver` swaps it for `.is-entering`, which runs the homepage
entrance's fade and drift, the bars 0.2s behind the words. So the 9s rotation
starts when the reader arrives, not at page load. Without JS, or under reduced
motion, the block is simply there.

### Footer
**Role:** Social links over the copyright line

Two lines on every page, both centered, with 6rem of space above the first. A row
of links (LinkedIn, Instagram, then RSS as a word) sits in `--muted`, one step
brighter than the copyright beneath it, and carries the `--space-s` gap down to
it. The two glyphs are CSS masks like the platform icons, but sized in `rem`
rather than `em`: the row must not resize with the copyright type. Both are drawn
edge to edge inside a 24x24 box, so one 1.25rem square lands their outer edges on
the same four lines; the RSS word is bold and tracked (the site's one small
tracked word), centered on the glyphs' axis rather than hung off a baseline. Each link is
padded, not enlarged, to a 32px tap target, and the facing padding comes back out
of the row's gap so the space between glyphs still reads 1.75rem.

The copyright stays `#5C5C5C` and is still the only thing using it.

## Interaction

- **The hover fade is the only hover state on the site:** `opacity: 0.8` over a
  `0.2s ease` transition, declared once as a single grouped rule near the top of
  `styles.css` covering the wordmark, the site nav, the platform links, the
  episode summary, the credit cards, the about
  page's prose link, the footer's social links and the quote bars. Add new hoverable things to that rule rather than giving
  them their own. The exceptions are the platform icons, which shift to their
  brand color instead, and episode-description links and the per-episode listen links, which lift from
  gray to `--fg` (the listen links' icons take their brand color at the same time).
- **Links carry no underline** except inside prose (episode descriptions, the
  about page closing line), where they are underlined with a 3px / 0.2em offset.
- **Focus:** because links are unstyled, `:focus-visible` is the only keyboard
  affordance — a 2px `--fg` outline at 4px offset.
- **Motion:** one gesture across the site, a fade plus a small upward drift, on
  two curves declared once in `:root`: `--ease-fade` (`ease-in-out`) for opacity
  and `--ease-drift` (`cubic-bezier(0.25, 0.46, 0.45, 0.94)`) for movement. Every
  entrance, the cover crossfade and the quote rotation use them. Opacity never
  goes on an ease-out: it snaps on. Motion supports the content and never holds
  it back: entrances start within 0.3s and settle by about 1.5s (the about page's
  slower 3s is the one exception). No animation library: CSS does all of it.
- **Reduced motion:** a global `prefers-reduced-motion` block cuts every
  transition, animation and smooth scroll to 0.01ms.

## Do's and Don'ts

### Do
- Use only the five color tokens. New grays go in `:root` or reuse `--muted`.
- Size type with `clamp()` and let it be fluid, rather than adding a breakpoint.
- Keep every gap on `--space-s` / `--space-m` / `--space-xl` (or `--band` on the
  credits page).
- Write uppercase copy in sentence case in the markup and uppercase it in CSS.
- Keep the two weights: 400 and 700, nothing between and nothing outside.
- Reuse `--rule` for any new separator, at 1px, edge to edge within its column.
- Explain non-obvious CSS in a comment above it — the file's existing comments
  carry the reasoning for nearly every unusual value, and that is the convention.
- Keep `index.html` and `styles.css` separate: no `<style>` block, no `style`
  attributes except the ones baked into the wordmark SVG.

### Don't
- Do not introduce a chromatic color. The three brand colors are hover-only on
  platform icons and are not available for anything else.
- Do not use pure `#000` or pure `#FFF`.
- Do not add box-shadows, gradients, or elevation of any kind — the system is flat.
- Do not add border-radius beyond the 6px on cover art and the circle on portraits.
- Do not use the em dash in prose or UI copy.
- Do not add a font, a weight, or a fourth spacing size without asking.
- Do not add a JavaScript dependency: the site must work fully with JS off, and
  `script.js` is enhancement only (scroll clamp, cover crossfade, the mobile
  feed's slide and scroll, quote rotation and its scroll-in entrance).
- Do not edit `archive/`, or link to it. It is read-only history.
- Do not put markup or styling in `scripts/build.py`. Every tag it renders lives
  in the four `<template>` blocks in `index.html`: `episode`, `episode-link`,
  `season` and `season-upcoming`. The cover panel and the `.episodes-layout`
  around the markers are page furniture, written once in `index.html` outside the
  generated block, so the build script never touches them.

## Elevation

There is none. No shadow, no glow, no z-axis depth. Separation is done with
space and hairline rules.

## Imagery

Two kinds only, both real photographs, both from outside the repo's design system:

- **Episode covers** — square, from the RSS feed on Cloudfront, shown at 6px
  radius over `--surface`, `object-fit: cover`. Above 40rem, in the persistent
  panel only: `build.py` writes an `.episode-art` image into every row's summary
  and the panel reads its sources from those, but the in-row copy is
  `display: none` there, since it would be a cover beside the cover. Below 40rem
  the panel is hidden and the in-row copy is the row (see Mobile feed).
- **Credit portraits** — square source files cropped to a circle, served at
  720×720, JPEG q68, ~125KB each, from `assets/credits-photos/`.

No illustration, no decorative graphics, no iconography beyond the three masked
platform glyphs in the header and the two masked social glyphs in the footer,
from `assets/social/`. Those two are single-path, single-color and full-bleed in
their 24x24 box, which is what lets the mask recolor them and what keeps their
edges aligned with each other.

## Layout

A single flex column per page: `body` is `display: flex; flex-direction: column`
at `min-height: 100svh`, padded by `--gutter`. There is no max-width container and
no centered column on the homepage or the about page, which runs gutter to
gutter like the homepage; the credits page caps its `main` at 85rem
and centers it too, so the three-column grid keeps some air at the edges on a
wide screen instead of running out to the gutter.

The homepage reads top to bottom: wordmark and nav side by side, platform bar,
tagline, then one two-column flex row: the persistent cover on the left,
and on the right a column of seasons, newest first, each a left-aligned heading
over its own rows, then the rotating quotes before the footer.
The credits page is a three-column grid with one spacing band. The about page is a
poster-sized statement, three numbered principles side by side, and one quiet
centred closing line.

Every page is standalone: no includes, so the head block, the wordmark SVG and the
footer are repeated in all three files on purpose. Change one, change all three.

## Known duplication

Two things are still written twice, both deliberately:

- **`.visually-hidden` and the mobile `.platform-name` rule** hold the same five
  declarations. They cannot share a selector list: one is unconditional, the
  other lives inside the 40rem media query, and plain CSS has no way to scope
  half a selector list. Change one, change the other. Both rules say so.
- **`.platforms` and `.episode-links`** share an identical block of font-size,
  font-weight, text-transform and gap. Merging them into one small-label
  class is possible but would put the header bar and the per-episode links on one
  rule, which is a design decision (are they the same thing, or two things that
  happen to match?) rather than a cleanup. Left as is until that is settled.

## Reference

- `PROJECT-CONTEXT.md` — goal, phases, open questions, the reasoning behind each
  build. Local only, gitignored.
- `CLAUDE.md` — the working conventions for this repo.
