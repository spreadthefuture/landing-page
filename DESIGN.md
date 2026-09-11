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
> Last updated: 2026-09-11

Spread The Future is a podcast site built as a single typographic stack. There is
no chrome: no cards, no shadows, no borders except hairline rules, no chromatic
color except the three platform brand colors that appear only on hover. Hierarchy
comes from scale and weight alone, on one family, in two weights. Every size is a
`clamp()`, so the page is fluid rather than stepped through breakpoints, and the
two breakpoints that do exist (40rem, 46rem) are structural, not cosmetic. The
signature moves are the wordmark set as wide as the viewport allows, the thin
`--rule` lines that separate every episode, and the persistent square cover that
crossfades beside the list, one per season.

## Colors

| Name | Token | Value | Role |
|------|-------|-------|------|
| Near black | `--bg` | `#0A0A0A` | The page canvas, everywhere. Never pure black |
| Soft white | `--fg` | `#F4F4F2` | All primary text, the wordmark, icon fill at rest, the focus ring. Never pure white |
| Gray | `--muted` | `#8A8A8A` | Secondary text: episode numbers, meta lines, descriptions, the "Available on" label, credit locations, the mobile nav divider, the footer's social links, "coming soon" in an announced season's heading |
| Rule | `--rule` | `#2A2A2A` | The 1px lines under the episodes lead-in and every episode row. The only border in the system |
| Surface | `--surface` | `#1A1A1A` | Sits behind cover artwork while it loads, so the frame is never a hole in the page |
| Footer gray | `--muted-dim` | `#5C5C5C` | The copyright line only. A step further back than `--muted` |

Brand colors appear on hover only, on the platform icon and nothing else:
Spotify `#1ED760`, Apple Podcasts `#A945E3`, Deezer `#A238FF`.

## Typography

### Liberation Sans — the only typeface

Self-hosted from `assets/font/liberation-fonts-ttf-2.1.5/` via four `@font-face`
rules (regular, bold, italic, bold italic), TTF, `font-display: swap`. Stack:
`'Liberation Sans', Arial, Helvetica, sans-serif`.

- **Weights:** 400 (body, meta, prose) and 700 (everything else). No other weight.
- **Case:** headings, nav, episode rows, credit names and the tagline are
  uppercase. All of it is written in sentence case in the markup and uppercased
  in CSS, so screen readers read words rather than spelling them out. The one
  exception is the season heading, which is set in sentence case and carries no
  `text-transform` at all: "Season 1", one capital.
- **Letter spacing:** `0.01em`–`0.02em` on large bold type, `0.1em`–`0.12em` on
  the small gray tracked labels. Nothing negative.
- **Open question:** the choice between Liberation Sans and Inter is still open.
  Do not swap the stack without asking.

The wordmark is an inline SVG of live `<text>` in Arial Bold, repeated in each
page's markup. It is not outlined, so it renders in whatever the viewer has.

### Type Scale

Every size is fluid. The `clamp()` is the spec; the min/max are the ends of it.

| Role | Size | Weight | Line height | Tracking |
|------|------|--------|-------------|----------|
| wordmark | `clamp(250px, 34vw, 520px)` wide | 700 | 0 | — |
| site nav | `clamp(2rem, 5vw, 4rem)` · `4.6vw` below 40rem | 700 | 1 | — |
| tagline | `clamp(1.35rem, 3vw, 3.75rem)` · `6vw` below 40rem | 700 | 1.15 | 0.01em |
| credits intro / season title | `clamp(1.6rem, 4vw, 3.25rem)` | 700 | 1.2 | 0.01em |
| about heading | `clamp(1.15rem, 2.4vw, 1.6rem)` | 700 | 1.2 | 0.02em |
| episode row | `clamp(0.95rem, 1.9vw, 1.45rem)` | 700 | — | 0.01em |
| credit name | `clamp(1.05rem, 1.9vw, 1.5rem)` | 700 | — | 0.01em |
| about text / closing | `clamp(1rem, 1.7vw, 1.25rem)` | 400 | 1.6 | — |
| credit role / location | `clamp(0.9rem, 1.4vw, 1.125rem)` · `1rem` below 46rem | 400 | 1.2 | — |
| episode description | `clamp(0.9rem, 1.1vw, 1rem)` | 400 | 1.6 | — |
| tracked label | `0.8125rem` | 400 | — | 0.12em (0.1em on episode meta) |
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
  masthead as one row, the episode art panel stacks above the list, the tagline
  switches to viewport sizing.
- **46rem** — the credits and thanks grids drop from three columns to one; the
  footer steps up one size.

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
"Available on" label in beside About and Credits, separated by gray `⎮` dividers
that exist only at that width.

### Platform bar
**Role:** "AVAILABLE ON: SPOTIFY / APPLE PODCASTS / DEEZER"

Small tracked uppercase, the label in gray. Each icon is a CSS mask (not an
`<img>`) so it inherits `currentColor` at rest and transitions to the platform's
brand color on hover, with no second source file. Below 40rem the names are
visually hidden and only the icons show, enlarged. The same `.platform-name`
mechanism drives the per-episode listen links, so both drop to icons together.

### Tagline
**Role:** The one sentence on the homepage, between masthead and list

Bold uppercase, sized near the wordmark, wrapping edge to edge under it.
Asymmetric margins on purpose: `--space-m` above ties it to the masthead,
`--space-xl` below is the largest gap on the page and marks the break to the list.

### Episodes lead-in
**Role:** Quiet signpost above the list

Small gray tracked uppercase with a `--rule` bottom border, the same line used
between episode rows, so the two read as one family. It appears once, at the top,
above the first season heading, and leads the whole page rather than any one
season.

### Season section
**Role:** One season: its heading, then its episodes

A `<section class="season">` per season, newest first. The heading is the credits
page's "Our Team" type (`clamp(1.6rem, 4vw, 3.25rem)`, bold) left aligned on the
page edge under the wordmark rather than centred, followed by that season's own
art panel and episode list. It is the site's only heading **not** uppercased:
"Season 1" keeps its single capital, so it labels the list below it instead of
reading as a second masthead. Spacing is `--space-m` from the lead-in
down to the first heading (a margin collapse: the heading carries no margin, the
section owns it) and `--space-xl` between seasons, the same break the tagline
takes to the list.

A season the show has announced but has no episodes for yet renders the heading
alone, finished by "coming soon" inside it: `.season-coming`, a span at the
heading's own size and weight in `--muted`, so it reads "Season 2 coming soon"
as one line, white then gray. No cover and no rows. It was once a small tracked
label under the heading, which matched the lead-in above too closely. Which
seasons those are is `ANNOUNCED_SEASONS` in `scripts/build.py`; the words
disappear on their own once the feed carries an episode for that season.

### Episode row
**Role:** One episode, expanded in place

Native `<details>` / `<summary>`, every row sharing `name="episode"` so opening
one closes the last. Works with JavaScript off. The summary is a flex line: gray
number, bold uppercase title (wrapping, never truncated), and a plus/minus toggle
at the right edge built from two `::before`/`::after` bars, sized in `em` so it
scales with the row. A `--rule` line under every row. Opening reveals meta,
description (justified, hyphenated, capped at 60ch) and platform links.

### Episode art panel
**Role:** Persistent square cover beside one season's list

One per season, inside that season's `.episodes-layout`, which bounds how far it
sticks: a cover travels with its own rows and releases at the end of them. It
shows its season's latest cover at rest and answers only to hovers in the list
beside it. `clamp(240px, 47vw, 620px)`, sticky at `--gutter` from the top on
desktop. Two
stacked `<img>` layers inside one frame; `script.js` loads the incoming cover into
whichever layer is hidden, then swaps `.is-active`, so the 0.4s opacity transition
crossfades between real pixels. Shows the first episode's cover at rest, the
hovered row's cover while the pointer is on a row (gated on
`(hover: hover) and (pointer: fine)`), and the open row's cover whenever one is
expanded. Below 40rem it stacks full-width above the list and sticks flush to the
viewport top; a zero-size sentinel above it drives `.is-pinned`, which adds an
opaque gutter of padding once pinned so nothing shows through the gap.

### Hairline rule
**Role:** The only divider in the system

1px `var(--rule)`, as a `border-bottom` on the episodes lead-in and on every
`.episode`. There is no standalone divider element and no other border anywhere.

### Credit card
**Role:** One team member

The whole card is a single link to that person's LinkedIn: circular portrait
(`clamp(150px, 24vw, 360px)`, `object-fit: cover`), bold uppercase name, then role
in white and country in gray, sharing one rule so the two lines always match.
Three across, one per row below 46rem.

### Footer
**Role:** Social links over the copyright line

Two lines on every page, both centered, with 6rem of space above the first. A row
of links (LinkedIn, Instagram, then RSS as a word) sits in `--muted`, one step
brighter than the copyright beneath it, and carries the `--space-s` gap down to
it. The two glyphs are CSS masks like the platform icons, but sized in `rem`
rather than `em`: the row must not resize with the copyright type. Both are drawn
edge to edge inside a 24x24 box, so one 1.25rem square lands their outer edges on
the same four lines; the RSS word is bold and tracked like the "Available on"
bar, centered on the glyphs' axis rather than hung off a baseline. Each link is
padded, not enlarged, to a 32px tap target, and the facing padding comes back out
of the row's gap so the space between glyphs still reads 1.75rem.

The copyright stays `#5C5C5C` and is still the only thing using it.

## Interaction

- **The hover fade is the only hover state on the site:** `opacity: 0.8` over a
  `0.2s ease` transition, declared once as a single grouped rule near the top of
  `styles.css` covering the wordmark, the site nav, the platform links, the
  episode summary, the per-episode listen links, the credit cards, the about
  page's prose link and the footer's social links. Add new hoverable things to that rule rather than giving
  them their own. The exceptions are the platform icons, which shift to their
  brand color instead, and episode-description links, which lift to `--fg`.
- **Links carry no underline** except inside prose (episode descriptions, the
  about page closing line), where they are underlined with a 3px / 0.2em offset.
- **Focus:** because links are unstyled, `:focus-visible` is the only keyboard
  affordance — a 2px `--fg` outline at 4px offset.
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
  `script.js` is enhancement only (scroll clamp, cover crossfade, pinned padding).
- Do not edit `archive/`, or link to it. It is read-only history.
- Do not put markup or styling in `scripts/build.py`. Every tag it renders lives
  in the four `<template>` blocks in `index.html`: `episode`, `episode-link`,
  `season` and `season-upcoming`.

## Elevation

There is none. No shadow, no glow, no z-axis depth except the single `z-index: 1`
that keeps the pinned mobile cover above the list it scrolls over. Separation is
done with space and hairline rules.

## Imagery

Two kinds only, both real photographs, both from outside the repo's design system:

- **Episode covers** — square, from the RSS feed on Cloudfront, shown at 6px
  radius over `--surface`, `object-fit: cover`, in the persistent panel only.
  `build.py` still writes an `.episode-art` image into every row and the panel
  reads its sources from those, but the in-row copy is `display: none` at every
  width: it would be a cover inside the cover.
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
no centered column, except the about page, which caps its `main` at 46rem and
centers it for a comfortable measure.

The homepage reads top to bottom: wordmark and nav side by side, platform bar,
tagline, lead-in, then one section per season, newest first, each a left-aligned
heading over a two-column flex row of persistent cover and episode list.
The credits page is a three-column grid with one spacing band. The about page is a
centered stack of three heading-and-paragraph sections plus two closing lines.

Every page is standalone: no includes, so the head block, the wordmark SVG and the
footer are repeated in all three files on purpose. Change one, change all three.

## Known duplication

Two things are still written twice, both deliberately:

- **`.visually-hidden` and the mobile `.platform-name` rule** hold the same five
  declarations. They cannot share a selector list: one is unconditional, the
  other lives inside the 40rem media query, and plain CSS has no way to scope
  half a selector list. Change one, change the other. Both rules say so.
- **`.platforms` and `.episode-links`** share an identical block of font-size,
  letter-spacing, text-transform and gap. Merging them into one tracked-label
  class is possible but would put the header bar and the per-episode links on one
  rule, which is a design decision (are they the same thing, or two things that
  happen to match?) rather than a cleanup. Left as is until that is settled.

## Reference

- `PROJECT-CONTEXT.md` — goal, phases, open questions, the reasoning behind each
  build. Local only, gitignored.
- `CLAUDE.md` — the working conventions for this repo.
