#!/usr/bin/env bash
# Builds the board print PDFs with headless Chrome. Run from anywhere: bash print/build.sh
set -e
cd "$(dirname "$0")"
mkdir -p pdf
URL="file://$PWD/boards.html"
pdf() { google-chrome --headless=new --disable-gpu --no-sandbox --no-pdf-header-footer --virtual-time-budget=6000 --run-all-compositor-stages-before-draw --print-to-pdf="pdf/$2" "$URL$1" 2>/dev/null; echo "pdf/$2"; }
pdf "?only=a2p" "A2_title-board_plan-2002_exit-panel.pdf"
pdf "?only=a3l" "A3-landscape_board-headers_strips.pdf"
pdf "?only=a3p" "A3-portrait_panels.pdf"
pdf "?only=a4p" "A4-portrait_cards_conflicts_verified.pdf"
pdf "?only=a5p" "A5-portrait_journeys_voices_quiz.pdf"
pdf "?only=a5l" "A5-landscape_comic-panels.pdf"
pdf "?only=a6l" "A6_timeline-game_himalaya-labels.pdf"
pdf "?only=layout" "Layout-plans_A4.pdf"
pdf "" "ALL_preview.pdf"
