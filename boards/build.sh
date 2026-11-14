#!/usr/bin/env bash
# Builds boards/board-sheets.pdf from boards/sheets.html with headless Chrome.
# Each page comes out at its own paper size (A3, A4, A4 landscape). Run from anywhere: bash boards/build.sh
set -e
cd "$(dirname "$0")"
google-chrome --headless=new --disable-gpu --no-sandbox --no-pdf-header-footer --allow-file-access-from-files \
  --virtual-time-budget=10000 --run-all-compositor-stages-before-draw \
  --print-to-pdf="board-sheets.pdf" "file://$PWD/sheets.html" 2>/dev/null
echo "boards/board-sheets.pdf (review copy: red boxes show missing photos)"
# the copy to print: any photo still missing from img/add/ closes up instead of printing a red box
google-chrome --headless=new --disable-gpu --no-sandbox --no-pdf-header-footer --allow-file-access-from-files \
  --virtual-time-budget=10000 --run-all-compositor-stages-before-draw \
  --print-to-pdf="board-sheets-print.pdf" "file://$PWD/sheets.html?final" 2>/dev/null
echo "boards/board-sheets-print.pdf (print this one)"
pdfinfo board-sheets-print.pdf 2>/dev/null | grep -E "^Pages" || true
