#!/usr/bin/env python3
"""Procedural banyan for HISTREE (our own drawing, grown with a space-colonization algorithm).

Writes:
  site/assets/img/banyan-mask.png   white tree on transparent (coin relief, silhouettes)
  site/assets/img/banyan-color.png  painted version on transparent (pages, boards)
Run from repo root: python3 scripts/gen_banyan.py [seed]
"""
import math, os, random, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "site", "assets", "img")
SEED = int(sys.argv[1]) if len(sys.argv) > 1 else 7
rnd = random.Random(SEED)
nrnd = np.random.default_rng(SEED)

SS = 2
W, H = 1600 * SS, 1060 * SS
GROUND = H * 0.905
CX = W * 0.5
LX, LY = -0.62, -0.78                      # light from the upper left
SPAN = W * 0.43                            # half-width of the crown


def u(a, b):
    return rnd.uniform(a, b)


def crown_top(x):
    t = (x - CX) / SPAN
    return H * 0.085 + (abs(t) ** 2.0) * H * 0.27 + math.sin(x / W * 17 + 1.0) * H * 0.016


def crown_bottom(x):
    t = (x - CX) / SPAN
    return H * 0.47 + (abs(t) ** 2.4) * H * 0.03 + math.sin(x / W * 21 + 2.0) * H * 0.018


# ------------------------------------------------------------------ attraction points
pts = []
while len(pts) < 2600:
    x = CX + nrnd.uniform(-1, 1) * SPAN
    y = nrnd.uniform(H * 0.05, H * 0.52)
    if crown_top(x) < y < crown_bottom(x) and abs(x - CX) < SPAN * 0.98:
        pts.append((x, y))
P = np.array(pts, dtype=np.float64)

# ------------------------------------------------------------------ space colonization
D = W * 0.0072        # step
RI = W * 0.085        # influence radius
RK = W * 0.0135       # kill distance
nodes = [(CX, GROUND)]
parent = [-1]
# trunk: grow straight up (slight lean) until it meets the crown
y = GROUND
while y > H * 0.58:
    y -= D
    nodes.append((CX + math.sin(y / H * 9) * W * 0.004, y))
    parent.append(len(nodes) - 2)

alive = np.ones(len(P), bool)
for it in range(420):
    N = np.array(nodes)
    A = P[alive]
    if len(A) == 0:
        break
    d2 = ((A[:, None, :] - N[None, :, :]) ** 2).sum(-1)
    near = d2.argmin(1)
    dmin = np.sqrt(d2[np.arange(len(A)), near])
    ok = dmin < RI
    if not ok.any():
        break
    grow = {}
    for ai in np.where(ok)[0]:
        ni = near[ai]
        v = A[ai] - N[ni]
        v /= (np.linalg.norm(v) + 1e-9)
        grow.setdefault(ni, []).append(v)
    added = 0
    for ni, vs in grow.items():
        v = np.mean(vs, 0)
        v[1] *= 0.86                       # banyans spread sideways more than up
        n = np.linalg.norm(v)
        if n < 1e-6:
            continue
        v = v / n
        v += nrnd.normal(0, 0.12, 2)
        v /= np.linalg.norm(v)
        nx, ny = N[ni] + v * D
        nodes.append((nx, ny)); parent.append(ni); added += 1
    # kill reached attractors
    N = np.array(nodes)
    idx = np.where(alive)[0]
    d2 = ((P[idx][:, None, :] - N[None, -added:, :]) ** 2).sum(-1) if added else None
    if added:
        alive[idx[(d2.min(1) < RK * RK)]] = False
    if added == 0:
        break

N = np.array(nodes)
parent = np.array(parent)
children = [[] for _ in nodes]
for i, p in enumerate(parent):
    if p >= 0:
        children[p].append(i)

# pipe model thickness: w^e = sum(child w^e)
EXP = 2.3
w = np.zeros(len(nodes))
order = sorted(range(len(nodes)), key=lambda i: -i)   # children have higher index than parents
for i in order:
    if not children[i]:
        w[i] = 1.0
    else:
        w[i] = sum(w[c] ** EXP for c in children[i]) ** (1 / EXP)
TIP, TRUNK = 1.3 * SS, W * 0.082
w = TIP + (TRUNK - TIP) * ((w - 1) / (w[0] - 1)) ** 0.82   # keep twigs thin, trunk massive

# ------------------------------------------------------------------ layers
canopy = Image.new("L", (W, H), 0)
holes = Image.new("L", (W, H), 0)
wood = Image.new("L", (W, H), 0)
shade = Image.new("L", (W, H), 0)      # per-cluster light for the colour version
dc, dh, dw, ds = (ImageDraw.Draw(x) for x in (canopy, holes, wood, shade))

# wood: trunk and limbs (draw thick first so joints look smooth)
segs = [(i, parent[i]) for i in range(1, len(nodes))]
segs.sort(key=lambda s: -w[s[0]])
for i, p in segs:
    (x0, y0), (x1, y1) = N[p], N[i]
    if p == 0:
        y0 = GROUND
    ww = w[i]
    # fluted trunk: wobble edges near the ground
    dw.line([x0, y0, x1, y1], fill=255, width=max(1, int(ww)))
    r = ww / 2
    dw.ellipse([x1 - r, y1 - r, x1 + r, y1 + r], fill=255)

# trunk flare and surface roots
for side in (-1, 1):
    for k in range(5):
        x0 = CX + side * W * u(0.005, 0.03)
        x1 = CX + side * W * u(0.07, 0.17)
        yb = GROUND + u(-2, 5) * SS
        steps = 12
        prev = None
        for s in range(steps + 1):
            t = s / steps
            xx = x0 + (x1 - x0) * t
            yy = GROUND - W * 0.03 * (1 - t) ** 2.2 + (yb - GROUND) * t + math.sin(t * 7 + k) * SS * 2
            ww = W * 0.022 * (1 - t) + 1.5 * SS
            if prev:
                dw.line([prev[0], prev[1], xx, yy], fill=255, width=int(ww))
            dw.ellipse([xx - ww / 2, yy - ww / 2, xx + ww / 2, yy + ww / 2], fill=255)
            prev = (xx, yy)

# fluting: thin dark grooves on the trunk (cut into the mask so the relief shows ridges)
grooves = Image.new("L", (W, H), 0)
dg = ImageDraw.Draw(grooves)
trunk_w = W * 0.085
for g in range(7):
    f = (g + 0.5) / 7 - 0.5
    pts_ = []
    for s in range(30):
        t = s / 29
        yy = GROUND - W * 0.02 - t * (GROUND - W * 0.02 - H * 0.585)
        half = trunk_w * (0.5 - 0.12 * t) * (1.25 - 0.25 * t)
        xx = CX + f * 2 * half * 0.9 + math.sin(t * 6 + g) * SS * 3
        pts_.append((xx, yy))
    dg.line(pts_, fill=150, width=int(1.6 * SS))

# foliage: clusters at twig tips and along fine branches
tips = [i for i in range(len(nodes)) if (not children[i] or w[i] < W * 0.0028) and N[i][1] < H * 0.555]
rnd.shuffle(tips)
clusters = []
for i in tips:
    x, y = N[i]
    r = W * u(0.020, 0.032) * (1.1 if y < H * 0.3 else 1)
    cx, cy = x + u(-0.3, 0.3) * r, y - r * 0.25
    clusters.append((cx, cy, r))
clusters.sort(key=lambda c: c[1])     # draw from the top so lower clusters overlap

for (cx, cy, r) in clusters:
    # leafy blob: core + ragged fringe of small leaves
    dc.ellipse([cx - r * .74, cy - r * .66, cx + r * .74, cy + r * .66], fill=255)
    for _ in range(int(r / SS * 0.9)):
        a = u(0, 2 * math.pi)
        d = r * u(0.55, 1.0)
        lx, ly = cx + math.cos(a) * d, cy + math.sin(a) * d * 0.85
        lr = u(0.004, 0.0085) * W
        dc.ellipse([lx - lr, ly - lr * u(.55, .9), lx + lr, ly + lr * u(.55, .9)], fill=255)
    # shade map for the colour version (lit upper-left)
    for k in range(4):
        rr = r * (1 - k * 0.2)
        ox, oy = LX * r * 0.18 * k, LY * r * 0.18 * k
        ds.ellipse([cx + ox - rr * .7, cy + oy - rr * .62, cx + ox + rr * .7, cy + oy + rr * .62], fill=60 + k * 48)

# light speckles: on the lit rim of each cluster, more toward the top of the crown
for (cx, cy, r) in clusters:
    top, bot = crown_top(cx), crown_bottom(cx)
    hgt = 1 - (cy - top) / max(1.0, bot - top)
    n = int(10 + 18 * hgt)
    for _ in range(n):
        a = u(math.pi * 0.95, math.pi * 1.75)       # upper-left arc
        d = r * u(0.35, 0.82)
        px, py = cx + math.cos(a) * d, cy + math.sin(a) * d * 0.85
        s = u(0.0009, 0.0024) * W
        dh.ellipse([px - s, py - s * u(.55, 1), px + s, py + s * u(.55, 1)], fill=255)
    if rnd.random() < 0.5:
        a = u(math.pi * 1.1, math.pi * 1.5)
        px, py = cx + math.cos(a) * r * .55, cy + math.sin(a) * r * .5
        s = u(0.0018, 0.0034) * W
        dh.ellipse([px - s, py - s * .6, px + s, py + s * .6], fill=255)

# aerial roots: hang from limbs below the crown; some reach the ground as pillar roots
cand = [i for i in range(len(nodes)) if W * 0.004 < w[i] < W * 0.03 and N[i][1] > crown_bottom(N[i][0]) - H * 0.07 and abs(N[i][0] - CX) > W * 0.07]
rnd.shuffle(cand)
roots, used = 0, []
for i in cand:
    if roots >= 34:
        break
    x, y = N[i]
    if any(abs(x - ux) < W * u(0.010, 0.03) for ux in used):
        continue
    used.append(x)
    pillar = rnd.random() < 0.16 and W * 0.12 < abs(x - CX) < SPAN * 0.8 and sum(1 for q in used[:-1] if abs(q - x) < W * .05) < 2
    end = GROUND + u(0, 3) * SS if pillar else y + (GROUND - y) * (u(0.08, 0.35) if rnd.random() < .6 else u(0.35, 0.8))
    w0 = (u(3.0, 6.5) if pillar else u(1.1, 2.0)) * SS * (1.6 if pillar else 1)
    steps, prev = 22, None
    ph = u(0, 6.28)
    for s in range(steps + 1):
        t = s / steps
        xx = x + math.sin(t * u(2, 4) + ph) * SS * 2.2
        yy = y + (end - y) * t
        ww = w0 * (1 + 0.5 * t) if pillar else w0 * (1 - 0.75 * t)
        if prev:
            dw.line([prev[0], prev[1], xx, yy], fill=255, width=max(1, int(ww)))
        prev = (xx, yy)
    if not pillar:
        for _ in range(rnd.randint(1, 4)):
            ox = u(-7, 7) * SS
            e2 = y + (end - y) * u(0.5, 1.15)
            px_, py_ = None, None
            for s in range(15):
                tt = s / 14
                qx = x + ox + math.sin(tt * 3 + ox) * SS * 1.5
                qy = y + u(0, 4) * SS * (1 - tt) + (e2 - y) * tt
                if px_ is not None:
                    dw.line([px_, py_, qx, qy], fill=255, width=max(1, int(SS * (1.1 - .7 * tt))))
                px_, py_ = qx, qy
    else:   # pillars: a second strand twisting around the first
        ox = u(3, 6) * SS * rnd.choice((-1, 1))
        px_ = None
        for s in range(23):
            tt = s / 22
            qx = x + ox * math.sin(tt * 5 + ox)
            qy = y + (end - y) * tt
            if px_ is not None:
                dw.line([px_, py_, qx, qy], fill=255, width=max(1, int(w0 * .45)))
            px_, py_ = qx, qy
    if pillar:   # small flare where it meets the ground
        dw.polygon([(x - w0 * 1.8, GROUND + 2 * SS), (x + w0 * 1.8, GROUND + 2 * SS), (x + w0 * .6, GROUND - 10 * SS), (x - w0 * .6, GROUND - 10 * SS)], fill=255)
    roots += 1

# ground line + grass ticks
dw.line([W * 0.22, GROUND + 2 * SS, W * 0.78, GROUND + 2 * SS], fill=255, width=int(1.6 * SS))
for _ in range(300):
    gx = u(W * 0.2, W * 0.8)
    gl = u(2, 10) * SS * max(0.2, 1 - abs(gx - CX) / (W * 0.32))
    dw.line([gx, GROUND + 2 * SS, gx + u(-2, 2) * SS, GROUND + 2 * SS - gl], fill=230, width=SS)

# ------------------------------------------------------------------ compose
blur = lambda im, r: np.asarray(im.filter(ImageFilter.GaussianBlur(r)), dtype=np.float32) / 255
c = blur(canopy, 0.7 * SS)
h = blur(holes, 0.5 * SS)
wd = blur(wood, 0.5 * SS)
wd[int(GROUND + 4 * SS):, :] = 0
gr = blur(grooves, 0.6 * SS)
sh = blur(shade, 6 * SS)

fol = np.clip(c - h, 0, 1)
woodm = np.clip(wd - gr * 0.85 * (1 - c), 0, 1)
mask = np.clip(np.maximum(fol, woodm), 0, 1)


def to_img(rgba):
    return Image.fromarray(rgba, "RGBA").resize((W // SS, H // SS), Image.LANCZOS)


rgba = np.zeros((H, W, 4), np.uint8)
rgba[..., :3] = 255
rgba[..., 3] = (mask * 255).astype(np.uint8)
os.makedirs(OUT, exist_ok=True)
to_img(rgba).save(os.path.join(OUT, "banyan-mask.png"), optimize=True)

# colour version
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
dark = np.array([24, 48, 30], np.float32)
mid = np.array([52, 92, 50], np.float32)
hi = np.array([132, 164, 88], np.float32)
lit = np.clip(sh * 0.85 + (1 - np.clip((yy - H * 0.08) / (H * 0.45), 0, 1)) * 0.25, 0, 1)[..., None]
leaf = dark * (1 - lit) + mid * lit
leaf = leaf * (1 - h[..., None]) + hi * h[..., None]
bark_dark = np.array([70, 48, 34], np.float32)
bark_hi = np.array([146, 106, 72], np.float32)
bmix = np.clip(0.55 - (yy - H * 0.5) / H * 0.6, 0.2, 0.7)[..., None]
bark = bark_dark * (1 - bmix) + bark_hi * bmix
bark = bark * (1 - gr[..., None] * 0.6)
woodtop = np.clip(wd - c * 0.9, 0, 1)[..., None]
rgb = leaf * (1 - woodtop) + bark * woodtop
alpha = np.clip(np.maximum(c, wd), 0, 1)
rgba = np.zeros((H, W, 4), np.uint8)
rgba[..., :3] = np.clip(rgb, 0, 255).astype(np.uint8)
rgba[..., 3] = (alpha * 255).astype(np.uint8)
to_img(rgba).save(os.path.join(OUT, "banyan-color.png"), optimize=True)
print("banyan: seed", SEED, "nodes", len(nodes), "clusters", len(clusters), "roots", roots)
