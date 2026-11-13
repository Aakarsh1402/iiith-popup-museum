#!/usr/bin/env bash
# Quick headless screenshot for self-checks: scripts/shot.sh "<hash route>" out.png [WxH]
# Reduced motion is forced so entrance animations finish instantly.
cd "$(dirname "$0")/.."
google-chrome --headless=new --disable-gpu --no-sandbox --hide-scrollbars --force-prefers-reduced-motion \
  --virtual-time-budget=${BUDGET:-3000} --window-size=${3:-1920,1080} --screenshot="$2" "file://$PWD/site/index.html$1" 2>/dev/null
