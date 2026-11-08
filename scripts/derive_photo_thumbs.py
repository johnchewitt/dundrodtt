"""Generate gallery thumbnails for every catalogued photograph.

Originals under public/photos/ stay untouched; derivatives land in
public/photos-thumbs/<year>/<ID>.webp at <=560px width (no upscaling:
images narrower than that are re-encoded at native size).
"""
import json
import pathlib
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
photos = json.loads((ROOT / 'src/content/photos.json').read_text())

made = 0
for p in photos:
    src = ROOT / 'public' / p['assetPath']
    rel = pathlib.PurePosixPath(p['assetPath'])
    out = ROOT / 'public' / 'photos-thumbs' / rel.relative_to('photos')
    out = out.with_suffix('.webp')
    out.parent.mkdir(parents=True, exist_ok=True)
    im = Image.open(src).convert('RGB')
    w = min(560, im.width)  # never upscale
    h = round(im.height * w / im.width)
    im.resize((w, h), Image.LANCZOS).save(out, 'WEBP', quality=80)
    made += 1
print(f'{made} thumbnails written to public/photos-thumbs/')
