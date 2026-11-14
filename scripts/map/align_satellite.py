#!/usr/bin/env python3
"""Warps today's satellite screenshot (raw/map/current_campus_google.png, Google Earth, 2026) into the frame of the
2002 layout plan (site/assets/map/plan-2002.jpg), so the map page can fade one into the other with every hotspot,
journey and label staying in place. Four landmarks picked by eye on both images; least-squares affine.
Also prints the hotspot polygons (percent of the plan) for places built after 2002. Run from the repo root."""
import json
import numpy as np
from PIL import Image, ImageFilter

PLAN = "site/assets/map/plan-2002.jpg"
SAT = "raw/map/current_campus_google.png"
OUT = "site/assets/map/now-aligned.jpg"

# (plan x, y) <-> (satellite x, y), in pixels of each image
PAIRS = [
    ((952, 348), (291, 652)),    # OBH: the circle in the middle of the cross-shaped block
    ((865, 880), (742, 268)),    # Nilgiri ("IIIT Main Building")
    ((843, 788), (685, 352)),    # the play ground behind Nilgiri (brown field today)
    ((150, 1062), (1368, 672)),  # the main road meets the road to ISB
]
# places built after 2002, outlined on the satellite (satellite pixels)
NOW = {
    "nab": [(560, 378), (700, 378), (700, 515), (560, 515)],
    "bakul": [(615, 38), (775, 38), (775, 168), (615, 168)],
    "himalaya": None,   # drawn straight on the plan below: the old play ground strip, which the cricket journey says became Himalaya
    "felicity": [(345, 380), (465, 405), (390, 550), (265, 480)],
}

P = np.array([p for p, _ in PAIRS], float)
S = np.array([s for _, s in PAIRS], float)
A = np.hstack([P, np.ones((len(P), 1))])
X = np.linalg.lstsq(A, S, rcond=None)[0]           # plan -> satellite (3x2)
print("residuals (px):", np.round(np.linalg.norm(A @ X - S, axis=1), 1).tolist())
M = np.vstack([X.T, [0, 0, 1]])
Minv = np.linalg.inv(M)                              # satellite -> plan

plan = Image.open(PLAN).convert("RGB")
sat = Image.open(SAT).convert("RGB")

# Google's map labels and pins sit right on top of campus; paint them out (mask the text, then fill it from around).
from scipy import ndimage
LABELS = [(560, 595, 900, 700), (900, 615, 965, 685), (0, 415, 310, 485), (0, 40, 160, 180)]   # x0, y0, x1, y1
a = np.asarray(sat).astype(float)
mx, mn = a.max(2), a.min(2)
inbox = np.zeros(a.shape[:2], bool)
for x0, y0, x1, y1 in LABELS: inbox[y0:y1, x0:x1] = True
white = inbox & ((mn > 228) | ((a[..., 1] > 240) & (a[..., 0] > 170) & (a[..., 2] > 170)))   # label text (white or pale green) and pin icons
pin = inbox & (np.abs(a[..., 0] - 120) < 14) & (np.abs(a[..., 1] - 144) < 14) & (np.abs(a[..., 2] - 156) < 14)   # IIIT pin
teal = inbox & (a[..., 1] - a[..., 0] > 70) & (a[..., 1] > 120)      # green pins
halo = inbox & (mx < 75) & ndimage.binary_dilation(white, iterations=4)   # dark outline around the text
mask = ndimage.binary_dilation(white | pin | teal | halo, iterations=1)
mask = ndimage.binary_closing(mask, iterations=2)
fill = a.copy(); known = (~mask).astype(float)
for sigma in (1.5, 3, 6, 12):
    num = np.stack([ndimage.gaussian_filter(fill[..., c] * known, sigma) for c in range(3)], 2)
    den = ndimage.gaussian_filter(known, sigma)[..., None]
    est = num / np.maximum(den, 1e-6)
    upd = mask & (den[..., 0] > 0.15) & (known < 1)
    fill[upd] = est[upd]; known[upd] = 1
sat = Image.fromarray(np.clip(fill, 0, 255).astype(np.uint8))
W, H = plan.size
# PIL's affine maps each output pixel (plan frame) to an input pixel (satellite): that is X itself
coeffs = (X[0, 0], X[1, 0], X[2, 0], X[0, 1], X[1, 1], X[2, 1])
warped = sat.transform((W, H), Image.AFFINE, data=coeffs, resample=Image.BICUBIC, fillcolor=(0, 0, 0))
mask = Image.new("L", sat.size, 255).transform((W, H), Image.AFFINE, data=coeffs, resample=Image.BILINEAR, fillcolor=0)
mask = mask.filter(ImageFilter.GaussianBlur(10))
# outside the screenshot: smear its edge colours outwards and darken, so the corner reads as "beyond the photo"
wa = np.asarray(warped).astype(float); ma = np.asarray(mask).astype(float)[..., None] / 255.0
num = np.stack([ndimage.gaussian_filter(wa[..., c] * ma[..., 0], 60) for c in range(3)], 2)
den = ndimage.gaussian_filter(ma[..., 0], 60)[..., None]
ext = num / np.maximum(den, 1e-4)
paper = np.array([236, 239, 235], float)              # the map stage background (look.css --paper-2)
far = np.clip(ndimage.distance_transform_edt(ma[..., 0] < 0.5) / 90.0, 0, 1)[..., None]
ext = ext * 0.35 * (1 - far) + paper * (0.65 + 0.35 * far) if True else ext
out = wa * ma + ext * (1 - ma)
Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(OUT, quality=90, optimize=True, progressive=True)
print("wrote", OUT, (W, H))

def to_plan_pct(pt):
    x, y, _ = Minv @ np.array([pt[0], pt[1], 1.0])
    return [round(x / W * 100, 1), round(y / H * 100, 1)]
out = {k: [to_plan_pct(p) for p in v] for k, v in NOW.items() if v}
out["himalaya"] = [[40.0, 57.0], [56.5, 57.0], [56.5, 64.5], [40.0, 64.5]]
print(json.dumps(out))
