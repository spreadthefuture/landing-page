#!/usr/bin/env python3
"""Fetch the STF podcast RSS feed, write episodes.json, render it into index.html.

Standard library only. Run manually or via .github/workflows/update-episodes.yml:

    python3 scripts/build.py

The feed is the single source of truth for episodes. Generated output is committed
so the site stays static and fetches nothing at runtime.
"""

import html
import json
import re
import textwrap
import urllib.request
import xml.etree.ElementTree as ET
from datetime import timezone
from email.utils import parsedate_to_datetime
from pathlib import Path

FEED_URL = "https://anchor.fm/s/469ddf8c/podcast/rss"
ROOT = Path(__file__).resolve().parent.parent
DATA_FILE = ROOT / "episodes.json"
PAGE_FILE = ROOT / "index.html"
# Hand-maintained, never written by this script: the feed only carries one link per
# episode, and we want our own Spotify / Apple / Deezer URLs instead.
LINKS_FILE = ROOT / "links.json"

START = "<!-- episodes:start -->"
END = "<!-- episodes:end -->"

TEMPLATE = re.compile(r'<template id="episode-template">\n(.*?)\s*</template>', re.DOTALL)
LINK_TEMPLATE = re.compile(r'<template id="episode-link-template">\n(.*?)\s*</template>', re.DOTALL)
RAW_PLACEHOLDER = re.compile(r"\{\{\{(\w+)\}\}\}")
PLACEHOLDER = re.compile(r"\{\{(\w+)\}\}")

ITUNES = "{http://www.itunes.com/dtds/podcast-1.0.dtd}"

# Titles carry their own display number ahead of the colon, e.g.
# "S1E6: Fabio on our Relations with Objects". The season is optional so the older
# "E06: ..." form still parses. itunes:episode counts each language version
# separately (1 to 14 for 7 episodes), so it is not usable for display. The title
# prefix is, and its season wins over itunes:season when both are present.
NUMBER_PREFIX = re.compile(r"^\s*(?:S(?P<season>\d+))?E(?P<number>\d+)\s*[:.\-]\s*", re.IGNORECASE)

# Description HTML is copied straight out of the feed, so its links arrive with
# whatever attributes the feed happens to carry. Every outbound link on the site
# opens in a new tab, so normalise them here rather than trusting the feed.
DESCRIPTION_LINK = re.compile(r"<a\s+([^>]*?)\s*>", re.IGNORECASE)
LINK_ATTR = re.compile(r'\s*(target|rel)\s*=\s*"[^"]*"', re.IGNORECASE)


def open_links_in_new_tab(description_html):
    """Force target="_blank" (and a safe rel) on every link in a description."""
    def rewrite(match):
        attrs = LINK_ATTR.sub("", match.group(1)).strip()
        return f'<a {attrs} target="_blank" rel="ugc noopener noreferrer">'

    return DESCRIPTION_LINK.sub(rewrite, description_html)


def text(node, path, default=""):
    found = node.find(path)
    return (found.text or default).strip() if found is not None else default


def parse_duration(raw):
    """'00:08:30' or '510' to (seconds, '8:30')."""
    if not raw:
        return None, ""
    parts = raw.split(":")
    try:
        numbers = [int(p) for p in parts]
    except ValueError:
        return None, raw
    seconds = 0
    for n in numbers:
        seconds = seconds * 60 + n
    hours, rest = divmod(seconds, 3600)
    minutes, secs = divmod(rest, 60)
    display = f"{hours}:{minutes:02d}:{secs:02d}" if hours else f"{minutes}:{secs:02d}"
    return seconds, display


def parse_episode(item):
    raw_title = text(item, "title")
    match = NUMBER_PREFIX.match(raw_title)
    number = int(match.group("number")) if match else None
    title = raw_title[match.end():] if match else raw_title

    season = match.group("season") if match else None
    if season is None:
        season = text(item, f"{ITUNES}season")

    # The prefix is displayed exactly as the feed writes it, e.g. "S1E6". No padding,
    # no reformatting: the title is the source of truth for the label too.
    label = match.group(0).strip().rstrip(":.-").strip() if match else ""

    published = parsedate_to_datetime(text(item, "pubDate")).astimezone(timezone.utc)
    seconds, duration = parse_duration(text(item, f"{ITUNES}duration"))

    enclosure = item.find("enclosure")
    image = item.find(f"{ITUNES}image")

    return {
        "guid": text(item, "guid"),
        "number": number,
        "season": int(season) if season else None,
        "label": label,
        "title": title,
        "title_full": raw_title,
        "link": text(item, "link"),
        "description_html": open_links_in_new_tab(text(item, "description")),
        "published": published.isoformat(),
        "published_display": f"{published.day} {published:%B %Y}",
        "duration": duration,
        "duration_seconds": seconds,
        "image": image.get("href") if image is not None else None,
        "audio_url": enclosure.get("url") if enclosure is not None else None,
        # Enclosures are audio/x-m4a, not mp3. Do not assume the extension anywhere.
        "audio_type": enclosure.get("type") if enclosure is not None else None,
        "audio_bytes": int(enclosure.get("length")) if enclosure is not None and enclosure.get("length") else None,
    }


def fetch(url=FEED_URL):
    request = urllib.request.Request(url, headers={"User-Agent": "spreadthefuture-site/1.0"})
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read()


def build_data(feed_bytes):
    channel = ET.fromstring(feed_bytes).find("channel")
    episodes = [parse_episode(item) for item in channel.findall("item")]
    # Every language version is listed on its own, newest first.
    episodes.sort(key=lambda e: e["published"], reverse=True)
    return {
        "feed_url": FEED_URL,
        "title": text(channel, "title"),
        "episode_count": len(episodes),
        "episodes": episodes,
    }


def read_template(page, pattern, name):
    """Pull markup out of index.html. This script owns no markup of its own."""
    match = pattern.search(page)
    if not match:
        raise SystemExit(f'index.html is missing <template id="{name}">')
    return textwrap.dedent(match.group(1)).strip("\n")


def load_links():
    if not LINKS_FILE.exists():
        raise SystemExit(f"{LINKS_FILE.name} is missing: it holds the per-episode platform URLs")
    return json.loads(LINKS_FILE.read_text(encoding="utf-8"))


def build_links(episode, links, template):
    """Render one platform link per non-empty URL in links.json, in listed order."""
    entry = links["episodes"].get(episode["guid"])
    if entry is None:
        print(f"  no links.json entry for {episode['title_full']} ({episode['guid']})")
        return ""
    rows = [
        fill(template, {"url": url, "name": platform["name"], "icon": platform["icon"]})
        for platform in links["platforms"]
        for url in [(entry.get(platform["key"]) or "").strip()]
        if url
    ]
    if not rows:
        print(f"  no platform URLs yet for {episode['title_full']}")
    return "\n" + "\n".join("  " + row for row in rows) + "\n" if rows else ""


def fill(template, episode):
    """Substitute placeholders against one episode.

    {{key}}   escaped, safe anywhere including attributes.
    {{{key}}} raw, for values that are already HTML such as description_html.
    """
    def lookup(match):
        key = match.group(1)
        if key not in episode:
            raise SystemExit(f"index.html template uses unknown placeholder {{{{{key}}}}}")
        return str(episode[key] or "")

    def lookup_raw(match):
        # A multi-line value is indented to match the line it was dropped into.
        value = lookup(match)
        line = match.string[:match.start()].rpartition("\n")[2]
        indent = line[:len(line) - len(line.lstrip())]
        return value.replace("\n", "\n" + indent)

    filled = RAW_PLACEHOLDER.sub(lookup_raw, template)
    return PLACEHOLDER.sub(lambda m: html.escape(lookup(m), quote=True), filled)


def render(episodes, template):
    rows = [textwrap.indent(fill(template, episode), "      ") for episode in episodes]
    return '    <ul class="episodes">\n' + "\n".join(rows) + "\n    </ul>"


def inject(page, markup):
    if START not in page or END not in page:
        raise SystemExit(f"index.html is missing the {START} / {END} markers")
    before, rest = page.split(START, 1)
    _, after = rest.split(END, 1)
    PAGE_FILE.write_text(f"{before}{START}\n{markup}\n    {END}{after}", encoding="utf-8")


def main():
    data = build_data(fetch())
    DATA_FILE.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    page = PAGE_FILE.read_text(encoding="utf-8")
    links = load_links()
    link_template = read_template(page, LINK_TEMPLATE, "episode-link-template")
    for episode in data["episodes"]:
        episode["links"] = build_links(episode, links, link_template)

    inject(page, render(data["episodes"], read_template(page, TEMPLATE, "episode-template")))
    print(f"{data['episode_count']} episodes written to {DATA_FILE.name} and {PAGE_FILE.name}")


if __name__ == "__main__":
    main()
