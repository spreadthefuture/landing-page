#!/usr/bin/env python3
"""Render one standalone share page per episode into episode/<label>/index.html.

Standard library only. Run manually, after build.py, or via
.github/workflows/update-episode-pages.yml:

    python3 scripts/episode_pages.py

Reads episodes.json (written by build.py) and links.json, fills
scripts/episode-template.html, and rebuilds every page on every run. Pages are
generated output: never edit them by hand, edit the template and bump its
"last updated" line instead. Nothing on the site links to these pages; they exist
to be shared.
"""

import json
import re

from build import DATA_FILE, ROOT, fill, load_links

TEMPLATE_FILE = ROOT / "scripts" / "episode-template.html"
OUT_DIR = ROOT / "episode"
SITE_URL = "https://spreadthefuture.com"

TEMPLATE_STAMP = re.compile(r"<!-- episode page template, last updated (\d{4}-\d{2}-\d{2}) -->")
PAGE_STAMP = re.compile(r"<!-- generated from scripts/episode-template\.html, last updated (\d{4}-\d{2}-\d{2}) -->")

# Whole marker lines, indentation included. The listen block also takes the blank
# line after it, so dropping it leaves no double gap in the markup.
LISTEN_BLOCK = re.compile(r"^[ \t]*<!-- listen:start -->\n(.*?)^[ \t]*<!-- listen:end -->\n(\n?)", re.S | re.M)
LINK_BLOCK = re.compile(r"^[ \t]*<!-- link:start -->\n(.*?)^[ \t]*<!-- link:end -->\n", re.S | re.M)
LISTEN_TOKEN = "\0listen\0"

# The feed ends its cover credit with a stray <br /> and no full stop, and tags
# links "ugc". The pages follow the hand-built S1E7 page instead.
TRAILING_BREAK = re.compile(r"<br\s*/?>\s*(</p>\s*)$", re.IGNORECASE)
UNPUNCTUATED_END = re.compile(r"(?<![.!?])(</p>\s*)$")


def tidy_description(description_html):
    tidied = description_html.replace('rel="ugc noopener noreferrer"', 'rel="noopener noreferrer"')
    tidied = TRAILING_BREAK.sub(r"\1", tidied)
    return UNPUNCTUATED_END.sub(r".\1", tidied)


def share_description(episode, entry):
    description = (entry.get("description") or "").strip()
    if description:
        return description
    guest = episode["title"].split(" on ", 1)[0]
    print(f"  no description in links.json for {episode['label']}, using the fallback")
    return f"A conversation with {guest}, on SPREAD THE FUTURE: a podcast about possible tomorrows."


def render_listen(block, episode, entry, links):
    """The listen nav with one row per platform URL, or nothing when there are none."""
    link = LINK_BLOCK.search(block)
    rows = "".join(
        fill(link.group(1), {"url": url, "name": platform["name"], "key": platform["key"]})
        for platform in links["platforms"]
        for url in [(entry.get(platform["key"]) or "").strip()]
        if url
    )
    if not rows:
        print(f"  no platform URLs for {episode['label']}, dropping the listen block")
        return ""
    return LINK_BLOCK.sub(lambda _: rows, block)


def render(template, stamp, episode, links):
    entry = links["episodes"].get(episode["guid"], {})
    if not entry:
        print(f"  no links.json entry for {episode['title_full']} ({episode['guid']})")
    slug = episode["label"].lower()
    values = {
        **episode,
        "page_url": f"{SITE_URL}/episode/{slug}/",
        "share_description": share_description(episode, entry),
        "description": tidy_description(episode["description_html"]),
    }

    listen = LISTEN_BLOCK.search(template)
    listen_markup = render_listen(listen.group(1), episode, entry, links)
    if listen_markup:
        listen_markup += listen.group(2)

    page = LISTEN_BLOCK.sub(lambda _: LISTEN_TOKEN, template)
    page = TEMPLATE_STAMP.sub(
        f"<!-- generated from scripts/episode-template.html, last updated {stamp} -->", page
    )
    return fill(page, values).replace(LISTEN_TOKEN, listen_markup)


def status(old, new, stamp):
    if old is None:
        return "new"
    if old == new:
        return "unchanged"
    previous = PAGE_STAMP.search(old)
    if previous and previous.group(1) != stamp:
        return f"updated (template {previous.group(1)} -> {stamp})"
    return "updated (content)"


def main():
    template = TEMPLATE_FILE.read_text(encoding="utf-8")
    stamp = TEMPLATE_STAMP.search(template)
    if not stamp:
        raise SystemExit(f"{TEMPLATE_FILE.name} is missing its 'last updated' line")
    stamp = stamp.group(1)
    for marker in ("listen", "link"):
        if f"<!-- {marker}:start -->" not in template or f"<!-- {marker}:end -->" not in template:
            raise SystemExit(f"{TEMPLATE_FILE.name} is missing the {marker}:start / {marker}:end markers")

    data = json.loads(DATA_FILE.read_text(encoding="utf-8"))
    links = load_links()

    for episode in data["episodes"]:
        if not episode["label"]:
            print(f"  no S#E# label on {episode['title_full']!r}, skipping it")
            continue
        page_file = OUT_DIR / episode["label"].lower() / "index.html"
        new = render(template, stamp, episode, links)
        old = page_file.read_text(encoding="utf-8") if page_file.exists() else None
        if old != new:
            page_file.parent.mkdir(parents=True, exist_ok=True)
            page_file.write_text(new, encoding="utf-8")
        print(f"{page_file.relative_to(ROOT)}: {status(old, new, stamp)}")


if __name__ == "__main__":
    main()
