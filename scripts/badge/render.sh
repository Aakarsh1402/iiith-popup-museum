#!/usr/bin/env bash
# Renders the round IIIT badge to transparent PNGs with headless Chrome. Run from the repo root.
set -e
cd "$(dirname "$0")/../.."
google-chrome --headless=new --disable-gpu --no-sandbox --hide-scrollbars --default-background-color=00000000 \
  --allow-file-access-from-files --virtual-time-budget=2500 --window-size=1200,1200 --force-device-scale-factor=1 \
  --screenshot="site/assets/img/iiit-badge.png" "file://$PWD/scripts/badge/badge.html" 2>/dev/null
python3 - <<'PY'
from PIL import Image
p = "site/assets/img/iiit-badge.png"
im = Image.open(p).convert("RGBA"); im.save(p, optimize=True)
for s in (128, 64):
    im.resize((s, s), Image.LANCZOS).save(f"site/assets/img/iiit-badge-{s}.png", optimize=True)
print(p, im.size)
PY
