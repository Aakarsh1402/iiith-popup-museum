#!/usr/bin/env python3
"""raw/ -> site/assets/. Idempotent. Needs Pillow + poppler (pdftoppm, pdfimages).

Run from the repo root:  python3 scripts/build_assets.py
Folders that are missing (e.g. raw/interviews_corpus, which is not in git) are skipped.
"""
import glob, os, re, shutil, subprocess, sys, tempfile
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, "raw")
OUT = os.path.join(ROOT, "site", "assets")


def ensure(d):
    os.makedirs(d, exist_ok=True)
    return d


def save_resized(src, dst, longest, quality):
    im = Image.open(src)
    im = ImageOps.exif_transpose(im).convert("RGB")
    im.thumbnail((longest, longest), Image.LANCZOS)
    im.save(dst, "JPEG", quality=quality, optimize=True, progressive=True)
    return im.size


def photos():
    full = ensure(os.path.join(OUT, "photos", "full"))
    thumb = ensure(os.path.join(OUT, "photos", "thumb"))
    sizes = {}
    for src in sorted(glob.glob(os.path.join(RAW, "photos", "[0-9][0-9]_*.jpeg"))):
        name = os.path.splitext(os.path.basename(src))[0] + ".jpg"
        sizes[name] = save_resized(src, os.path.join(full, name), 1600, 82)
        save_resized(src, os.path.join(thumb, name), 480, 75)
    corpus = os.path.join(RAW, "interviews_corpus")
    sar = os.path.join(corpus, "saranga hall the past library, now a lecture hall.jpeg")
    if os.path.exists(sar):
        save_resized(sar, os.path.join(full, "x01_saranga-hall-2.jpg"), 1600, 82)
        save_resized(sar, os.path.join(thumb, "x01_saranga-hall-2.jpg"), 480, 75)
    civ = sorted(glob.glob(os.path.join(corpus, "civil_engineering_branch_uncaptioned", "*.jpeg")))
    for i, src in enumerate(civ, 1):
        name = "c%02d_civil-uncaptioned.jpg" % i
        save_resized(src, os.path.join(full, name), 1600, 82)
        save_resized(src, os.path.join(thumb, name), 480, 75)
    print("photos:", len(sizes), "+ extras" if civ else "(corpus extras skipped)")
    return sizes


def pdf_pages(pdf, docid, dpi):
    if not os.path.exists(pdf):
        print("skip", pdf)
        return
    d = ensure(os.path.join(OUT, "docs", docid))
    t = ensure(os.path.join(d, "thumb"))
    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run(["pdftoppm", "-r", str(dpi), "-png", pdf, os.path.join(tmp, "p")], check=True)
        pages = sorted(glob.glob(os.path.join(tmp, "p-*.png")))
        for src in pages:
            n = int(re.search(r"-(\d+)\.png$", src).group(1))
            im = Image.open(src).convert("RGB")
            im.save(os.path.join(d, "p-%02d.jpg" % n), "JPEG", quality=80, optimize=True, progressive=True)
            im.thumbnail((300, 1000), Image.LANCZOS)
            im.save(os.path.join(t, "p-%02d.jpg" % n), "JPEG", quality=72, optimize=True)
    print(docid, "pages:", len(pages))


def prospectus_images():
    pdf = os.path.join(RAW, "IIIT_Hyderabad_prospectus_c2001.pdf")
    d = ensure(os.path.join(OUT, "docs", "prospectus", "img"))
    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run(["pdfimages", "-png", pdf, os.path.join(tmp, "i")], check=True)
        k = 0
        for src in sorted(glob.glob(os.path.join(tmp, "i-*.png"))):
            if os.path.getsize(src) < 20000:
                continue
            im = Image.open(src)
            if min(im.size) < 120:
                continue
            k += 1
            im.convert("RGB").save(os.path.join(d, "ximg-%02d.jpg" % k), "JPEG", quality=82)
    print("prospectus images:", k)


def curriculum():
    d = ensure(os.path.join(OUT, "curriculum"))
    for src in glob.glob(os.path.join(RAW, "curriculum_screenshots", "*.png")):
        shutil.copy2(src, d)


def map_base():
    d = ensure(os.path.join(OUT, "map"))
    size = save_resized(os.path.join(RAW, "photos", "50_layout-plan-2002-62-acres.jpeg"),
                        os.path.join(d, "plan-2002.jpg"), 2400, 88)
    print("plan-2002:", size)
    now = os.path.join(RAW, "map", "current_campus.jpg")
    if os.path.exists(now):
        print("now:", save_resized(now, os.path.join(d, "now.jpg"), 2400, 85))


if __name__ == "__main__":
    photos()
    pdf_pages(os.path.join(RAW, "IIIT_Hyderabad_prospectus_c2001.pdf"), "prospectus", 150)
    pdf_pages(os.path.join(RAW, "Lab_floorplans.pdf"), "floorplans", 110)
    pdf_pages(os.path.join(RAW, "ping_echoes_library_article.pdf"), "ping", 150)
    prospectus_images()
    curriculum()
    map_base()
