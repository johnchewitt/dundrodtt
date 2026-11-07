#!/usr/bin/env python3
"""Regenerate the cover's WebP derivatives from the catalogued PNGs.

The two large 1955 plates are the only images given true full-screen
treatment; serving their full PNGs costs ~4.3 MB on first paint, so the
cover uses these display-resolution WebP derivatives (~240 KB total)
with the catalogue PNGs as <picture> fallback. Run after replacing
either source plate:

    python3 scripts/derive_cover_assets.py
"""
import os
from PIL import Image

JOBS = [
    ('public/photos/1955/DU-1955-05.png', 'public/derived/cover-finish.webp'),
    ('public/photos/1955/DU-1955-03.png', 'public/derived/cover-duel.webp'),
]

os.makedirs('public/derived', exist_ok=True)
for src, dest in JOBS:
    im = Image.open(src).convert('RGB')
    if im.width > 1920:
        im = im.resize((1920, round(im.height * 1920 / im.width)), Image.LANCZOS)
    im.save(dest, 'WEBP', quality=80, method=6)
    print(dest, im.size, f'{os.path.getsize(dest) // 1024} KB')
