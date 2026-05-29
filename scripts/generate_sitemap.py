#!/usr/bin/env python3
"""
Gera sitemap.xml a partir da lista de páginas do site.
Usa a data do último commit do git como <lastmod> de cada URL.
Inclui extensão sitemap-image/1.1 com cat-thumbnail.png.
"""
from __future__ import annotations

import subprocess
from html import escape
from pathlib import Path

BASE = "https://brianmonteiro54.github.io/Balaio-de-Gatos"
THUMB = f"{BASE}/cat-thumbnail.png"
THUMB_TITLE = "Balaio de Gatos"
THUMB_CAPTION = "Balaio de Gatos: aulas visuais de IA pra Escola da Nuvem"

PAGES: list[tuple[str, str, str]] = [
    # (relative_file_path, url_path, priority)
    ("index.html", f"{BASE}/", "1.0"),
    ("aula1/index.html", f"{BASE}/aula1/", "0.9"),
    ("aula2/index.html", f"{BASE}/aula2/", "0.9"),
    ("aula3/index.html", f"{BASE}/aula3/", "0.9"),
    ("aula4/index.html", f"{BASE}/aula4/", "0.9"),
    ("aula5/index.html", f"{BASE}/aula5/", "0.9"),
    ("aula6/index.html", f"{BASE}/aula6/", "0.9"),
    ("aula7/index.html", f"{BASE}/aula7/", "0.9"),
    ("aula8/index.html", f"{BASE}/aula8/", "0.9"),
    ("aula9/index.html", f"{BASE}/aula9/", "0.9"),
    ("aula10/index.html", f"{BASE}/aula10/", "0.9"),
    ("aula11/index.html", f"{BASE}/aula11/", "0.9"),
    ("aula12/index.html", f"{BASE}/aula12/", "0.9"),
    ("aula13/index.html", f"{BASE}/aula13/", "0.9"),
    ("aula14/index.html", f"{BASE}/aula14/", "0.9"),
    ("aula15/index.html", f"{BASE}/aula15/", "0.9"),
    ("aula16/index.html", f"{BASE}/aula16/", "0.9"),
    ("aula17/index.html", f"{BASE}/aula17/", "0.9"),
    ("aula19/index.html", f"{BASE}/aula19/", "0.9"),
    ("aula20/index.html", f"{BASE}/aula20/", "0.9"),
    ("aula21/index.html", f"{BASE}/aula21/", "0.9"),
    ("aula22/index.html", f"{BASE}/aula22/", "0.9"),
    ("mapa/index.html", f"{BASE}/mapa/", "0.7"),
    ("game/index.html", f"{BASE}/game/", "0.6"),
]


def last_commit_date(path: str) -> str:
    """Returns ISO 8601 date of last commit that touched the file, or empty string."""
    try:
        result = subprocess.run(
            ["git", "log", "-1", "--format=%cI", "--", path],
            capture_output=True,
            text=True,
            check=True,
        )
        return result.stdout.strip()
    except (subprocess.CalledProcessError, FileNotFoundError):
        return ""


def build_sitemap() -> str:
    parts = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
        '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    ]

    for file_path, url, priority in PAGES:
        if not Path(file_path).exists():
            print(f"[SKIP] {file_path} não existe")
            continue

        lastmod = last_commit_date(file_path)
        changefreq = "weekly" if priority == "1.0" else "monthly"

        parts.append("  <url>")
        parts.append(f"    <loc>{escape(url)}</loc>")
        if lastmod:
            parts.append(f"    <lastmod>{lastmod}</lastmod>")
        parts.append(f"    <changefreq>{changefreq}</changefreq>")
        parts.append(f"    <priority>{priority}</priority>")
        parts.append("    <image:image>")
        parts.append(f"      <image:loc>{escape(THUMB)}</image:loc>")
        parts.append(f"      <image:title>{escape(THUMB_TITLE)}</image:title>")
        parts.append(f"      <image:caption>{escape(THUMB_CAPTION)}</image:caption>")
        parts.append("    </image:image>")
        parts.append("  </url>")

    parts.append("</urlset>")
    return "\n".join(parts) + "\n"


def main() -> None:
    sitemap = build_sitemap()
    out = Path("sitemap.xml")
    out.write_text(sitemap, encoding="utf-8")
    print(f"sitemap.xml regenerado com {len(PAGES)} URLs.")


if __name__ == "__main__":
    main()
