#!/usr/bin/env bash
# Builds boards/HISTREE-board-sheets.pdf from boards/sheets.html with headless Chrome.
# Each page comes out at its own paper size (A3, A4, A4 landscape). Run from anywhere: bash boards/build.sh
set -e
cd "$(dirname "$0")"
google-chrome --headless=new --disable-gpu --no-sandbox --no-pdf-header-footer --allow-file-access-from-files \
  --virtual-time-budget=10000 --run-all-compositor-stages-before-draw \
  --print-to-pdf="HISTREE-board-sheets.pdf" "file://$PWD/sheets.html" 2>/dev/null
echo "boards/HISTREE-board-sheets.pdf"
pdfinfo -f 1 -l 99 HISTREE-board-sheets.pdf 2>/dev/null | grep -E "^Pages|size" || true
