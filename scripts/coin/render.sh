#!/usr/bin/env bash
# Renders both coin faces to transparent PNGs with headless Chrome. Run from the repo root.
set -e
cd "$(dirname "$0")/../.."
for face in front back; do
  google-chrome --headless=new --disable-gpu --no-sandbox --hide-scrollbars --default-background-color=00000000 \
    --virtual-time-budget=2500 --window-size=1200,1200 --force-device-scale-factor=1 \
    --screenshot="site/assets/img/coin-$face.png" "file://$PWD/scripts/coin/coin-face.html?face=$face" 2>/dev/null
done
python3 - <<'PY'
from PIL import Image
for f in ("front", "back"):
    p = f"site/assets/img/coin-{f}.png"
    im = Image.open(p).convert("RGBA")
    im.save(p, optimize=True)
    small = im.resize((128, 128), Image.LANCZOS); small.save(f"site/assets/img/coin-{f}-128.png", optimize=True)
    print(p, im.size)
PY
