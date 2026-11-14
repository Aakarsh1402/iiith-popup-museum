#!/usr/bin/env bash
# Builds the board sheet PDFs with headless Chrome. Each page comes out at its own paper size (A3, A4, A4 landscape).
#   bash boards/build.sh          both versions
#   bash boards/build.sh white    sheets.html        -> board-sheets.pdf, board-sheets-print.pdf (the white backup)
#   bash boards/build.sh colour   sheets-colour.html -> board-sheets-colour.pdf, board-sheets-colour-print.pdf
# Run from anywhere.
set -e
cd "$(dirname "$0")"
pdf() { google-chrome --headless=new --disable-gpu --no-sandbox --no-pdf-header-footer --allow-file-access-from-files \
  --virtual-time-budget=10000 --run-all-compositor-stages-before-draw \
  --print-to-pdf="$2" "file://$PWD/$1" 2>/dev/null; }
one() { # $1 = html, $2 = pdf name without .pdf
  pdf "$1" "$2.pdf"
  echo "boards/$2.pdf (review copy: red boxes show missing photos)"
  # the copy to print: any photo still missing from img/add/ closes up instead of printing a red box
  pdf "$1?final" "$2-print.pdf"
  echo "boards/$2-print.pdf (print this one)"
  pdfinfo "$2-print.pdf" 2>/dev/null | grep -E "^Pages" || true
}
case "${1:-both}" in
  white) one sheets.html board-sheets ;;
  colour) one sheets-colour.html board-sheets-colour ;;
  *) one sheets.html board-sheets; one sheets-colour.html board-sheets-colour ;;
esac
