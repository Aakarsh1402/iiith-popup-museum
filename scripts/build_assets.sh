#!/usr/bin/env bash
# Thin wrapper: the pipeline is Python (Pillow + poppler), since ImageMagick is not required.
set -e
cd "$(dirname "$0")/.."
python3 scripts/build_assets.py
python3 scripts/gen_images_js.py
python3 scripts/gen_transcripts_js.py
