# SPREAD THE FUTURE: Style Reference

> Documents the site as built, not as imagined. Update it in the same commit as any
> design change, along with `PROJECT-CONTEXT.md`.
>
> Last updated: 2026-11-15

A dark podcast site built as a single typographic stack. No chrome: no cards, no
shadows (one faint text glow on hover aside), no borders except hairline rules, no
chromatic color except three platform brand colors on hover. Hierarchy comes from
scale and weight alone, on one family in two weights. Every size is a `clamp()`, so
the page is fluid, and the one breakpoint is structural. The signature moves: the
wordmark set wide, and the homepage's fan of episode covers, which springs from one
episode to the next.

## The system at a glance

One value per job, shared by every page. Reuse these rather than adding a
near-duplicate.

| Job | The one value |
|-----|---------------|
| Breakpoint | `46rem`, always written `max-width: 46rem` |
| Vertical gaps | `--space-s` / `--space-m` / `--space-xl`, on every page |
| Line heights | `1` (site nav), `1.6` (prose), `1.2` (everything else, set on `body`) |
| Label size (platform bar, quote source, contact field labels and submit, footer column headings and links; the footer links are `1.25rem` below 46rem) | `clamp(0.875rem, 1.2vw, 1rem)` |
| Row size (carousel caption title, credit name, about heading, contact title, the episode page's platform links and "Discover more episodes"; the latter is `1.25rem` below 46rem) | `clamp(1.05rem, 1.9vw, 1.5rem)` |
| Prose size (the `body` base size, about text, credits team line and contact line, contact intro and inputs, carousel role line, episode page description and meta, credit role and location) | `clamp(1rem, 1.5vw, 1.125rem)` |
| Prose link (episode description, credits contact line) | underlined, `text-underline-offset: 0.2em`; the second is also `--fg` |
| Measure (max line length) | `48ch` about principles, `60ch` episode description and carousel caption, `38ch` quotes. Keep any new prose in that 45 to 60ch range |
| Glow (white text on hover only) | `--glow`, or `--glow-filter` for the wordmark and footer icons |
| Entrance | `fade-in` + `drift-in` keyframes, on `--ease-fade` / `--ease-drift` |
| Brand name in copy | `SPREAD THE FUTURE`, uppercase in the markup |
| Page description (meta and Open Graph) | The same sentence on every page, matching the tagline (`404.html` carries the meta description but no Open Graph) |

## Colors

| Name | Token | Value | Role |
|------|-------|-------|------|
| Near black | `--bg` | `#0A0A0A` | The page canvas. Never pure black |
| Soft white | `--fg` | `#F4F4F2` | Primary text, the wordmark, icons at rest, the focus ring. Never pure white |
| Prose gray | `--prose` | `#B0B0B0` | Paragraphs meant to be read: episode descriptions, the carousel's role line, the credits lede and contact line, the contact overlay's intro and sent line, the homepage sublines under the tagline and the institutions heading. 9.1:1 on `--bg` |
| Gray | `--muted` | `#8A8A8A` | Secondary text that recedes (5.7:1 on `--bg`): episode numbers (carousel captions included), meta, the "Listen on" label, credit locations, the unlit words of the about statement, footer social and column links, the mobile header's platform icons |
| Rule | `--rule` | `#2A2A2A` | The 1px line across the footer, the contact panel's box and fields, the quote bars. The only border |
| Surface | `--surface` | `#1A1A1A` | Behind cover artwork while it loads |
| Footer gray | `--muted-dim` | `#5C5C5C` | The footer's own text: the credit and copyright line |

For body text in soft white anywhere, use `.body-text`: `--fg`, the prose size
(`clamp(1rem, 1.5vw, 1.125rem)`), line height 1.6, no max width.

Brand colors appear on hover only, on platform icons: Spotify `#1ED760`, Apple
Podcasts `#A945E3`, Deezer `#A238FF`, YouTube `#FF0000`.

## Typography

### ABC Areal, with Arial as the fallback

Stack: `'ABC Areal', 'STF Sans', Arial, Helvetica, sans-serif`. `ABC Areal` is one
variable `@font-face` (weights 100 to 900, no italic) at the top of `styles.css`, loaded
from `https://stf-areal-font.netlify.app/ABCArealVariable.woff2`, a separate Netlify
site. The font is licensed (Dinamo EULA, web license: WOFF2 only, one domain) and the
license forbids public repos, so the file is gitignored (`assets/font/ABCAreal/`) and
never committed. That site's `_headers` currently allows any origin (`*`) so local
testing works. At launch, lock it to `https://spreadthefuture.com` so other sites
cannot hotlink the font.

If Areal fails to load, `STF Sans` takes over: four `@font-face` rules that ask for
Arial's PostScript face first and fall back to bundled Liberation Sans:

```css
src: local('ArialMT'),
     url('assets/font/liberation-fonts-ttf-2.1.5/LiberationSans-Regular.ttf') format('truetype');
```

**Do not flatten `STF Sans` to `font-family: Arial`.** Android aliases `arial` to Roboto
and Linux fontconfig aliases it to Liberation Sans, so a stack led by `Arial` never falls
through. A family name with no system alias forces the `src` list to be read, and the
PostScript name (`ArialMT`) keeps `local()` clear of the same aliases.

| Situation | Renders | Downloaded |
|-----------|---------|------------|
| Areal loads | ABC Areal | ~180KB, once, then cached |
| Areal blocked or down, Arial installed | Arial | nothing extra |
| Areal blocked or down, no Arial (Android, some Linux) | Liberation Sans | ~400KB per face used |

- **`font-display: swap`:** viewers see the fallback first, with a slight reflow when
  Areal lands.
- **No italic.** Areal ships no italic in the hosted file, and the site uses none.
- **The wordmark** is outlined paths (`Logo2-AREAL.svg` and the inline logo), so it
  does not depend on any font loading.
- **Settled.** Do not swap the stack, change the `local()` names, or rename
  `STF Sans` without asking. Never commit the Areal files.

### Rules

- **Weights:** 400 (body, meta, prose) and 650 (everything else), with one exception: the homepage tagline is 700, on purpose, so the one sentence reads heavier. The fallback fonts show 650 and 700 with the same bold file, declared as 700 in `@font-face`. Nothing else.
- **Case:** uppercase for the site nav, platform labels, carousel caption titles, credit names and
  about headings, written in sentence case in the markup and uppercased in CSS so
  screen readers read words. Not uppercased: the homepage tagline, the about statement,
  the carousel's role line, the quotes and the credits headings. The brand name
  is the one thing uppercase in the markup.
- **Line height:** `1.2` on `body`, `1` on the site nav, `1.6` on prose.
  `line-height: 0` on the wordmark is a box reset.
- **Letter spacing:** `0.01em` to `0.02em` on large bold type, normal on small labels.
  Nothing negative.

### Type scale

| Role | Size | Weight | Line height | Tracking |
|------|------|--------|-------------|----------|
| wordmark | `clamp(250px, 34vw, 520px)` wide | 650 | 0 (reset) | |
| site nav | `clamp(2rem, 5vw, 4rem)` · `8vw` below 46rem | 650 | 1 | |
| tagline | `clamp(1.75rem, 3.9vw, 5rem)` (about 2.5 lines on desktop) · `8vw` below 46rem | 700 | 1.2 | 0.01em |
| tagline subline | `clamp(1rem, 1.5vw, 1.125rem)` | 400 | 1.6 | |
| about statement | `clamp(1.35rem, 3vw, 3.75rem)` · `8vw` below 46rem | 650 | 1.2 | 0.01em |
| heading: credits intro / institutions / quote | `clamp(1.6rem, 4vw, 3.25rem)` | 650 | 1.2 | 0.01em |
| audience figure | `clamp(3rem, 7vw, 6rem)` | 400 | 1.2 | 0.015em |
| sub-heading: "Videographers", "Special thanks" | `clamp(1.375rem, 2.6vw, 2.25rem)` | 650 | 1.2 | 0.01em |
| row | `clamp(1.05rem, 1.9vw, 1.5rem)` | 650 | 1.2 | 0.01em |
| episode page platform links | row size, no hairlines, rows `--space-s` apart and `--space-s` under the label · below 46rem a centred row of columns a third wide, a quarter wide when an episode has all four links (so one or two links sit centred, not beside an empty column; in a quarter, "Apple Podcasts" wraps to two lines below about 400px), `8vw` logo (the site nav's mobile size) over its name at `0.8rem` 400 `--muted`, sentence case, the same `--space-m` + `--row-pad` above and below | 650 | 1.2 | 0.01em |
| prose | `clamp(1rem, 1.5vw, 1.125rem)` · credit role / location `1rem` below 46rem | 400 | 1.6 (1.2 on meta and credit lines) | |
| label | `clamp(0.875rem, 1.2vw, 1rem)` | 650 | 1.2 | |
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
| `--row-pad` | `clamp(1.1rem, 2.2vw, 1.6rem)` | Padding above and below each platform column on a phone's episode page |

| Gap | Home | About | Credits |
|-----|------|-------|---------|
| Platform links to first block | `--space-xl` | `--space-xl` | `--space-xl` |
| Heading to what it names | `--space-s` | `--space-s` | `--space-xl`, except the team line at `--space-s` and the videographers and special thanks at `--space-m` |
| Items inside a block | `--space-m` cover to caption | `--space-m` between principles | `--space-xl` between card rows, `--space-m` between videographers (`--space-s` below 46rem) |
| Block to block | `--space-xl` | `--space-xl` | `--space-xl` |

Credits uses `--space-xl` where the others use `s` or `m` because the portraits are
large and a tighter gap crowds them. `--portrait` and `--col-gap` are widths and stay
page-local.

On an episode page, "Discover more episodes" is white, at the row size like the platform links above it, `--space-m` under the
date line on desktop, the same gap as between the text column's other blocks. Below
46rem it sits `--space-xl` under it, centred, so it reads as a way out rather than
part of the description.

Bottom padding is `clamp(1.25rem, 5vh, var(--gutter))`, measured against viewport
height so the last element sits the same distance off the bottom on every page.

**Page structure.** `body` is a flex column at `min-height: 100svh`, padded by
`--gutter`. No max-width container, except credits, whose `main` is capped at 85rem
and centered. Every page is standalone: the head block, wordmark SVG and footer are
repeated in all five files (the three pages, `404.html` and
`scripts/episode-template.html`, which renders `episode/`), and since the footer carries
the wordmark too, that SVG sits twice in each. Change one, change all ten.

**Border radius:** 6px on cover art, 50% on credit portraits, 0 everywhere else.

### Breakpoint

`46rem` (736px), shared by every page and by `script.js`'s `matchMedia`. Below it:

- **Header:** platform names collapse to icons, with "Listen on" at their size; the
  site nav folds behind a plus beside the wordmark.
- **Home:** the carousel's centre cover grows to `min(70vw, 54svh)`; the tagline switches to viewport sizing.
- **About:** each band stacks photo then text, band 02's text right aligned; the statement switches to viewport sizing.
- **Credits:** grids drop to one column.
- **Footer:** reduced to centred lines (page links, social row), then the credit and copyright as one tight two-line block.

## Components

### Wordmark
Inline SVG, filled with `currentColor`, linked to `/` on every page, with the standard
hover fade. `will-change: opacity` stops Safari re-hinting the glyphs mid-hover.

**Homepage entrance (`.logo--intro`).** Plays once on load, then the mark is still.
Rebuilt in CSS from the motion designer's Lottie (`assets/logos/animation/`), with
its timings and curves: "SPREAD" slides in from the left (104px in the letters'
space, 26% of the logo's width) and "THE FUTURE" from the right (123px, 32%), each
fading up over 0.7s, then the bar wipes in left to right (`scale`, origin left)
from 1.42s to 2.77s. The Lottie's mask runs 2.23s on `cubic-bezier(0.333, 0, 0, 1)`
but starts left of the bar and ends past it, so the CSS curve,
`cubic-bezier(0.31, 0.13, 0.1, 0.81)`, is the slice of it during which the bar
actually fills; the bar is still moving when it lands, as in the original. Starts
at 1s, after a deliberate beat with no mark in the header, settled by about 2.77s.
It is the page's first beat: the tagline and the list wait for its letters to land
(see **Tagline**). The
Lottie's own exit and 12s loop are not used: they left the header without a logo
for about 2.5s of every cycle. The selectors walk the SVG's structure (first six
letter groups, the rest, the `rect`) because the footer shares the markup, and the
motion uses the `translate` / `scale` properties because a CSS `transform` would
replace each group's transform attribute. The SVG is `overflow: visible` so the
letters are not cut at its edge. Removed under reduced motion. Other pages' logos
stay still.

**Only on arrival.** The head script on every page sets a `sessionStorage` flag
(`stf-visited`) and, if it was already set, adds `.is-return` to `<html>` before
first paint. On `.is-return` the homepage skips the wordmark and header entrance
entirely (the header is simply there) and the tagline and list take the other
pages' timing, 0.15s and 0.4s. So the entrance plays when someone lands on the site
in a tab, and not when they come back to the homepage from another page, go back,
or reload. A new tab counts as a new arrival. If storage is blocked the entrance
plays every time. The intro rules sit inside
`@media (prefers-reduced-motion: no-preference)` behind `:root:not(.is-return)`,
because their selectors are too specific for the usual reduced-motion reset. Any
new page must carry the same head script, or arriving home from it replays the
entrance.

### Site nav
About / Credits, bold uppercase, stacked right-aligned beside the wordmark.

**Below 46rem:** the links fold behind "MORE" and a plus
(`.menu-toggle`), set vertically at `1.25rem` down the right edge beside the wordmark,
reading bottom to top with the plus at the top and upright. The header is a
two-column grid here, so on the narrowest phones (iPhone SE) the wordmark shrinks
below its 250px floor rather than pushing "MORE" onto its own line. Tapping it slides About and
Credits open under it, right aligned at `8vw`, `--space-s` below the wordmark, on the
site's 500ms cubic ease-in-out fold; the words fade and drift in 0.1s and 0.18s
behind. The plus turns to a minus; Escape closes. A `.js` class set by the small
script in each page's head hides the nav before first paint, so without JS the nav
stays open and the plus never shows.

### Platform bar
"LISTEN ON: SPOTIFY / APPLE PODCASTS / DEEZER / YOUTUBE". YouTube is also in the
footer's LISTEN column, and in episode-details.json, so an episode shows its YouTube link once
that URL is filled in. Bold uppercase at the label size,
normal letter spacing, the label in gray. Icons are CSS masks, so they inherit
`currentColor` and shift to brand color on hover. Below 46rem the names are visually
hidden, the icons enlarge to 1.5em, and "Listen on" takes the same 1.5em so label
and icons read as one line. There the icons are `--muted` like the label.
Below 46rem only, the row ends with the Instagram glyph (`.platforms-instagram`), at the
icons' 1.5em and in `--muted`, lifting to `--fg` with the glow on hover like the footer's. Its gap is
fluid, up to 1.25rem, so the six items stay on one line down to 320px.

### Tagline
The homepage's one sentence, bold, in sentence case and all `--fg`, wrapping edge
to edge. No lit phrases.

**Subline (`.tagline-sub`).** One sentence under the tagline in `--prose`, at the prose size, full width, prose line height 1.6. It sits `--space-s` under the tagline and carries the gap down to the carousel, so the tagline's bottom margin is `--space-s` and the subline's is `--space-xl` plus `--space-m`. It enters with the tagline, on the same beat.

Above: `--space-xl`, or `--space-xl` plus `--space-m` under 46rem. Below: `--space-xl`
plus `--space-m`, the same gap the carousel keeps above the institutions, so the carousel sits evenly between the two.

**Homepage entrance:** the wordmark goes first (see **Wordmark**), then `fade-in` and
`drift-in` over 1.2s, in two beats 250ms apart, the about page's tempo: tagline at
1.6s, as the wordmark's letters finish landing and while its bar is still drawing,
then the carousel at 1.85s (its covers fan out, see **Carousel**). The rest of the header (site nav, the
phone's "More" toggle, platform bar) is held back so the wordmark arrives alone,
then fades in as one beat at 1.4s, 0.2s ahead of the tagline, over 1.2s on
`--ease-fade`. Fade only, no drift: it is chrome, not content, and a vertical drift
beside the letters' horizontal slide pulls against it. Keyed off `.logo--intro`, so
other pages' headers stay still; the open phone nav is excluded, since it would
replay the delay. Settled by about 3.4s, once the carousel's caption is in. Pure CSS apart from the carousel, removed under reduced motion.

### Carousel
Every episode, newest first, as a fan of square covers (`<section class="carousel">`),
between the tagline's subline and the institutions, `--space-xl` + `--space-m` clear of
both. Generated by `scripts/build.py` from `#slide-template` (one `<li class="slide">`
per episode) and `#slide-role-template`. It runs edge to edge, past the body's gutter,
clipped sideways only (`overflow: clip visible`), so the side covers never widen the page.

- **Centre cover:** `--s`, `clamp(260px, min(32vw, 54vh), 520px)`, `min(70vw, 54svh)`
  below 46rem. 6px radius over `--surface`. It links to the episode's page
  (`/episode/s2e3/`); the cover link is `aria-hidden` and out of the tab order, the
  caption's title link is the real one.
- **The fan:** each step away from the centre scales by 0.8 and sits at
  `S * 2.4 * (1 - 0.8^a)` from it, so outer covers tuck behind the inner ones; covers
  fade out between 3.6 and 5 steps. It loops: the last episode sits beside the first.
- **Caption:** centred, `--space-m` under the cover, capped at 60ch. The S#E# label in
  `--muted` and the title at the row size, bold uppercase, glowing on hover; then the
  guest's role (`role` in `episode-details.json`) at the prose size in `--prose`, `--space-s`
  below. No role, no line (season 1). Captions share one grid cell, so the block is as
  tall as the longest and never jumps. Out in 0.3s; in once it has gone, title and role
  each fading and drifting up over 0.7s, 80ms apart.
- **Motion (`script.js`):** one float, `pos`, is the whole state, driven by a damped
  spring: autoplay `omega 7.5, damping 0.863` (0.4% overshoot), a fast gesture
  `omega 10, damping 0.81` (1.2%), a slow one critically damped. Autoplay moves one
  cover after a 3s rest, paused during a drag and while the tab is hidden. Drag
  (pointer, one to one), trackpad swipe, arrow keys and a click on a side cover all
  move it; a click on the centre cover, or Enter on the focused carousel, opens the
  episode. Pressing the fan gives it to `scale(0.98)`, springing back on release.
- **Entrance:** covers wait stacked and invisible behind the centre one until the
  homepage entrance reaches them (1.85s on arrival, 0.4s with `.is-return`) and a
  quarter of the carousel is in view, then fan out, the centre first and each step 60ms
  behind, over 1.1s on an ease-out quint, with the site's 6px drift; the caption follows
  at 0.55s.
- **Reduced motion:** no sliding and no autoplay. The fan simply fades in, and moving
  crossfades the covers and caption out and back (Web Animations API, since the global
  reduced-motion rule cuts CSS transitions).
- **Without JS:** a row of covers that scrolls sideways with scroll snap, `--space-m`
  apart, each caption `--space-s` under its own cover; it takes the tagline's CSS
  entrance at 1.85s. The `.js` class (set in the head) switches on the fan layout.

### Credit card
The whole card links to that person's LinkedIn: circular portrait
(`clamp(150px, 24vw, 360px)`, `object-fit: cover`), shown in black and white
(`grayscale(1)`) and turning to full colour over 0.6s (`--ease-drift`) on hover or keyboard focus, bold uppercase name, role in
`--fg` and country in `--muted`. Three across, one below 46rem.

**Team line.** `.credits-lede` introduces the grid: "Meet the people behind the
episodes.", centred `--prose` at the prose size, `--space-s` under "Our team" so it
belongs to the heading rather than floating between it and the portraits.

**Videographers.** `.credits-intro--sub`: the "Our team" heading a step down, at its
own `clamp(1.375rem, 2.6vw, 2.25rem)`, so it sits between "Our team" and the names on
every screen and the videographers no longer read as the team's equals. Their names
keep the card name's style, three across (one below 46rem), `--space-m` under the
heading and `--space-m` apart (`--space-s` below 46rem, so the heading's gap stays
the larger one).

**Special thanks.** A second `.credits-intro--sub`, "Special thanks", `--space-xl`
under the videographers, then a second `.thanks-list` laid out exactly as the
videographers': the card name's style, three across (one below 46rem), `--space-m`
under the heading and `--space-m` apart (`--space-s` below 46rem).

In both lists the grid fills left to right, so a short last row starts in the left
column: one name alone sits in the left column, not centred.

**Contact line.** `.contact-line` closes the page, `--space-xl` under the
special thanks: centred gray prose at the prose size, "The future is a
conversation." with only "Contact us." as a `--fg` underlined link that opens the
contact overlay. It is the site's one way into the form.

**Entrance:** `fade-in` and `drift-in` over 1.2s, 100ms apart: "Our Team" at 0.1s,
"Our Team" and the line under it at 0.1s,
each row of cards at 0.2s and 0.3s, the videographers at 0.4s, the special thanks at 0.5s,
the contact line at 0.6s. Whole by about 1.8s. Removed under reduced motion.

### About page
A manifesto in three beats, the statement landing as the conclusion:

1. **Principles.** `.about-sections`, `--space-xl` below the masthead: three
   alternating bands, `--space-xl` apart. Each band is a square photo
   (`.about-figure`, the homepage cover's size, `object-fit: cover`, 6px radius over
   `--surface`) with its credit caption set inside the bottom corner on the outer
   edge (bottom right on band 02; below 46rem, opposite the text: bottom right on bands 01 and 03, bottom left on band 02),
   `0.75rem` in, in `--muted` at `0.75rem` (`0.625rem` at 70% opacity below 46rem), and the principle beside it at
   `--space-m`, centred on the photo's height. Band 02 is mirrored with `row-reverse`
   and its text right aligned against the photo. Each heading has its number (`01` to
   `03`, `aria-hidden`, `--muted`) on its own line above. Prose in `--fg`, `--space-s`
   below, max **48ch**: the cap sits on the paragraph, so it is measured in the prose
   size and every band reads the same width. Below 46rem every band stacks photo then
   text, `--space-m` apart; band 02 keeps its text right aligned.
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

### Not found page
`404.html` at the root, which GitHub Pages serves for any missing path at any depth,
so every link and asset in it is absolute. It is the about page's frame (head script,
header, footer) with one block in `main`, which grows (`flex: 1`) to keep the footer
at the bottom and centres the block vertically between masthead and footer.

- **Sentence.** `.not-found-text`, "This page is a possible tomorrow.": the about
  statement's colouring, `--muted` with only "possible tomorrow" (a `<strong>` with
  weight reset) in `--fg`, at its size too, `clamp(1.35rem, 3vw, 3.75rem)`.
  "Page not found" is a visually hidden `h2`.
- **Way out.** `.not-found-back`, "Back to the present", linked to `/`: bold uppercase
  `--fg` at the row size, glowing on hover. A label under type this large read as a
  footnote. A link, not a timed redirect, so the reader can see the link they
  followed was broken.
- **Desktop.** Centred across the page, a poster rather than a paragraph. `--space-xl`
  above the sentence, `--space-m` to the link, `--space-xl` under it, so the block
  keeps clear of the masthead and the footer on a short screen.
- **Below 46rem.** Back on the left edge, the sentence at the tagline's `8vw`, and the
  link pinned to it at `--space-s`, so the two lines read as one block.
- **Own classes.** Not `.about-statement`, which `script.js` holds back until it
  scrolls into view and which waits 1s behind the principles.
- **Head.** `noindex`, no canonical and no Open Graph: it is not a page to share.
- **Analytics.** GoatCounter counts every hit as the path `/404`
  (`data-goatcounter-settings`), so broken addresses do not appear as pages of their
  own. The referrer still shows where each one came from.

**Entrance:** `fade-in` and `drift-in` over 1.2s, sentence at 0.15s and link at 0.4s.
Settled by about 1.6s. Removed under reduced motion.

### Contact overlay
The contact form, on the credits page only, opened from that page's contact line. No
card and no elevation: a `min(34rem, 100%)` panel on `--bg` inside a 1px `--rule`
border,
centred over a `rgb(10 10 10 / 0.92)` scrim, `--space-m` padding. The close
control is the site nav's plus turned 45 degrees, `--muted` lifting to `--fg`.
Title at the row size, bold uppercase; intro in `--prose` capped at 48ch;
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
title and one line of `--prose`, "Thank you." No confirmation page of our own,
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

### Institutions
A `<section class="institutions">` between the carousel and the quotes,
`--space-xl` margin above plus `--space-m` padding above and below, so it sits
`--space-xl` + `--space-m` clear of the carousel and the quotes. Centred heading "Executive-level speakers" at the heading size, bold uppercase,
then a line at the prose size in `--prose` `--space-s` below, then `--space-m` down to a wrapping, centred flex row of white logos from
`assets/institutions-logos/` (`<ul class="institutions-logos">`, one `<li><img>` each).
Every logo shares a base height `--logo-h`, `clamp(3rem, 6vw, 5.5rem)`, and width cap
`--logo-w`, `min(60vw, 18rem)`, at `0.85` opacity; gaps are `--space-m` by `--space-xl`
(`--space-m` both ways below 46rem). Above 46rem the base is 1.2x (`clamp(3.6rem, 7.2vw, 6.6rem)`,
cap `21.6rem`) and the logos break into three on the first row and the rest on the second, via a
full-width `::before` flex item ordered after the third logo. Each `<img>` carries a
`logo-<name>` class, and a list in `styles.css` gives each one a `--size` multiplier
(1 = 100%, 0.8 = 80%) applied to both the height and the width cap, tuned by eye. The
Albanian ministry's crest, with small type, is at 1.4 so it reads at the same weight as the
wide wordmarks. To add a logo, add an `<li>` with a new class, plus a `--size` line if 1 does
not look right. Currently, in order,
Europe Jacques Delors, the Albanian ministry, IHP, WWF EPO and The Good Lobby.

### Audience
A `<section class="audience">` between the institutions and the quotes, spaced like
the institutions (`--space-xl` margin above plus `--space-m` padding above and below).
Centred heading "A sound that keeps you listening" at the heading size, bold uppercase with balanced wrapping, then
`--space-m` down to three figures (`<ul class="audience-stats">`) in three equal columns,
capped at 72rem, stacked `--space-m` apart below 46rem. Each figure is the number at
`clamp(3rem, 7vw, 6rem)`, weight 400, tabular digits (the largest type after the wordmark), its unit (`.stat-unit`: +, h, kHz) at half that size on the same baseline, over a label at the row
size (400, `--fg`), `--space-s` below, capped at 16ch with balanced wrapping. Currently, left to right,
180 h yearly combined listening time, 10 000 + monthly social views (views on the social networks), 48 kHz sound
sampling rate.

Each number is in the markup at its final value, once visually hidden for screen readers
and once `aria-hidden` (`.stat-count`, holding `.stat-num` and `.stat-unit`, with `data-count` and `data-suffix`). **Entrance:** `script.js` sets `.is-waiting`
and zeroes the counters; once 40% of the block is in view, `.is-entering` runs the fade
and drift on each figure 150ms apart, and each number counts up from 0 over 1.8s on an
ease-out quart, so it slows into its final value. Thousands are split by a no-break space (10 000). Without JS or under reduced motion the final values are simply there.

### Quotes
The homepage's closing block, `--space-xl` below the audience figures. A `<section class="quotes">`
of `<figure>`s (`<blockquote>` + `<figcaption>`). Quote at the heading scale, capped
at 38ch, centered, in sentence case. The source sits `--space-s` below as a gray label.
A quote from an episode is a link to that episode's page (`<a class="quote-link"
href="/episode/s2e1/">` around the text).
It keeps the quote's color and glows on hover like other text links, and its hit area
stretches over the figure, which is only as wide as its text, so the source line is
part of the target.

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

The mark is wrapped in `.footer-brand` (`max-width: 24rem`) so it stays a distinct
item in the band and the columns stay against the right edge.
Pushed to the right edge, `.footer-cols`, two columns `clamp(2.5rem, 7vw, 7rem)`
apart: **LISTEN** (Spotify, Apple Podcasts, Deezer, YouTube) and **THE PODCAST** (About,
Credits). Headings are the label size, bold, uppercased in CSS, in `--fg`, `--space-s`
above their list. The links are the same size and weight in `--muted`, `0.75rem`
apart, lifting to `--fg` and then glowing like every other gray link. Both bands wrap
to a stack when they no longer fit side by side.

Two columns, not three or four. The site has about ten destinations and two of them
already sit in the header, so a wider grid would need invented links. No contact
column: the form is reached from the credits page's closing line (see **Contact
overlay**). No episode links, which would mean new markup inside the generated block.

**Bottom band (`.footer-bottom`).** A 1px `--rule` line, `--space-m` under the
columns and `--space-s` above this row, then the social links on the left and the
copyright on the right, right aligned against them. LinkedIn and Instagram,
in `--muted` (no RSS link since 2026-09-28); the credit and the copyright on one line in
`--muted-dim`. Neither sits in a badge or a container: LinkedIn is
the bare "in", not the filled square it ships as, because a filled square reads as a
block of light next to an outline and pulls the row off center. The glyphs are CSS
masks sized in `rem` (not `em`) so they do not scale with the copyright type. Both
are drawn in a 24x24 box, so one 1.25rem square aligns them. Instagram is the
only one full-bleed in that box.
The LinkedIn "in" is a bare mark, so its file scales the glyph to 21 of the 24
units and centers it, which holds it a hair inside Instagram's frame. Instagram's frame and lens ring are 2.6 of its 24 units, which lands near
2.2px on a 20px glyph; rescaling it means redoing that arithmetic.
Each link is padded to a 32px tap target, with the padding taken back out of the row
gap so glyphs still read 1.75rem apart.

There is no contact glyph here either: `assets/social/mail.svg` stays in the
repo, unused.

**Below 46rem the footer is a different object.** Not a columned block but three
centred lines, the type stepped down to `0.8rem`: the two THE PODCAST links side by
side as one row at `1.25rem` (the header's "More" size), then the social row, then the credit and the copyright on two lines. `--space-s` between the rows but only `0.375rem` between the two sentences, so they read as one small block closing the page rather than two more steps widening it into a pyramid; and
`--space-xl` above, since three lines of type do not need a block's worth of air to
read as the end. The wordmark, the two column headings and the whole LISTEN column
are hidden, and the bottom band's rule with them: a second
wordmark and a repeat of the header's platform bar read as a wall of small type on a
phone. Nothing is lost that the page does not already carry, since the header's
platform icons sit on every page. The links' row gap is the social row's `1.75rem`, so
the three lines run on one rhythm. Hiding is `display: none` on `.footer-brand`,
`.footer-col--listen` and `.footer-col-title`; the two columns carry a `.footer-col`
class for that one selector.

The two links are `--fg` here rather than `--muted`, the one place they differ from
the desktop footer: with the wordmark hidden the band would otherwise hold nothing
lit and read as unfinished. White at rest also puts them back on the site's usual
footing, where a white thing only glows on hover instead of lifting first.

## Interaction

- **One glow:** `--glow` (in `:root`), two `text-shadow` layers in `--fg`: a 0.2em
  core at 20% and a 0.8em haze at 10%, in em so it scales with the type.
  `--glow-filter` is the same two layers as `drop-shadow()`, for the SVG wordmark and
  the masked footer icons. Hover only: nothing glows at rest. Gray never glows.
- **One hover state:** white things glow, over `0.2s ease`, declared once as a grouped
  rule near the top of `styles.css`. Add new hoverable things to that rule. Gray links
  lift to `--fg` first and then glow (episode description links, footer icons). In a
  title or card only the white text glows: the carousel caption's title
  but not its number, the credit name and role but not the country. Platform icons
  also shift to brand color. The quote bars are the one exception: shapes, not type,
  they keep a dim to `opacity: 0.8`.
- **No underlines** except on prose links, with a `0.2em` offset: the episode
  description's links and the credits contact line's "Contact us." link, both also
  lifted to `--fg`.
- **Focus:** `:focus-visible` is a 2px `--fg` outline at 4px offset (inset by 2px on
  the carousel, which meets the window's edges).
- **Motion:** one gesture, a fade plus a small upward drift. Two curves in `:root`:
  `--ease-fade` (`ease-in-out`) for opacity, `--ease-drift`
  (`cubic-bezier(0.25, 0.46, 0.45, 0.94)`) for movement. One pair of keyframes,
  `fade-in` and `drift-in` (0.375rem rise). Opacity never goes on an ease-out: it snaps
  on. Entrances start within 0.3s of load and settle by about 1.5s (the about page's
  2.5s and the homepage's 3.4s, which starts with a 1s beat and then waits for the
  wordmark, are the exceptions). Two departures: the homepage wordmark's entrance,
  which keeps the motion designer's slides, wipe and curves (see **Wordmark**), and the
  carousel, which moves on a damped spring and fans out on an ease-out quint (see
  **Carousel**). No animation library.
- **Reduced motion:** a global `prefers-reduced-motion` block cuts every transition,
  animation and smooth scroll to 0.01ms.

## Imagery

- **No saving:** every `<img>` blocks the right-click menu (`script.js`), dragging
  and the iOS long-press menu (`styles.css`). A deterrent, not protection.

- **Episode covers:** square, from the RSS feed, 6px radius over `--surface`,
  `object-fit: cover`. `build.py` writes one into every carousel slide.
- **About photos:** `assets/about-photos/1.jpg` to `3.jpg`, in band order, served as
  is and squared in CSS with `object-fit: cover`.
- **Credit portraits:** 720x720, JPEG q68, from `assets/credits-photos/`, cropped to a
  circle.
- **Icons:** only the three masked platform glyphs and the two masked social glyphs
  (`assets/social/`, single path, single color, in a 24x24 box; Instagram full-bleed,
  LinkedIn scaled to 21 units and centered).
  No badges or containers. `mail.svg` sits beside them, no longer
  used by any page. No illustration or decorative graphics.

## Do's and don'ts

### Do
- Use only the six color tokens. New grays go in `:root`.
- Size type with `clamp()` rather than adding a breakpoint.
- Keep every gap on `--space-s` / `--space-m` / `--space-xl`.
- Write uppercase copy in sentence case in the markup and uppercase it in CSS.
- Reuse `--rule` at 1px for any new separator, above 46rem only.
- Explain non-obvious CSS in a comment above it, as the file already does.

### Don't
- Draw a divider line below 46rem. On a phone nothing carries a `--rule` line (the
  footer band); spacing does the separating. Form
  field underlines and the quote bars are controls, not dividers, and stay.
- Add a chromatic color. Brand colors are for platform icon hover only.
- Use pure `#000` or `#FFF`.
- Add shadows, gradients or any elevation. The system is flat. The one exception is
  `--glow`: use it as is, never a second glow or a glow on gray.
- Add border radius beyond the 6px covers and circular portraits.
- Add a font, a weight, or a fourth spacing size without asking.
- Add a JavaScript dependency. The site must work fully with JS off; `script.js` is
  enhancement only.
- Put markup or styling in `scripts/build.py`. Every generated tag lives in the two
  `<template>` blocks in `index.html` (`slide`, `slide-role`). The carousel section
  around the generated slides is written once, outside the generated block.

## Known inconsistencies

Left as is, each waiting on a design call:

- **Off-token values.** Carousel caption label gap `0.35em`, caption fades `0.3s` /
  `0.7s`, the press's own overshoot curve, credit name/role margins
  `1rem` / `0.5rem`, about caption `0.75rem` type (`0.625rem` at `opacity: 0.7` on mobile) and
  `0.75rem` inset, contact field
  label gap `0.5rem`, error message pull-up `-0.25rem`, close control
  `2.75rem` / `0.9rem`, submit padding `0.75rem 1.75rem`, footer link list gap `0.75rem`, brand column `24rem`,
  column gap
  `clamp(2.5rem, 7vw, 7rem)` and wordmark cap-height drop `0.25rem`, toggle transition `0.25s`
  against the `0.2s` hover.
- **The carousel's sizes in px** (`260px` / `520px` on `--s`), where the rest of the
  page sizes in rem.
- **The footer wordmark's own size**, `clamp(150px, 16vw, 210px)`, which is not
  derived from the masthead's `clamp(250px, 34vw, 520px)` by any ratio. It was
  picked by eye to read as a sign-off.

## Known duplication

Deliberate:

- **`.visually-hidden` and the mobile `.platform-name` rule** hold the same five
  declarations. One is unconditional, the other inside the 46rem media query, so they
  cannot share a selector. Change one, change the other.
