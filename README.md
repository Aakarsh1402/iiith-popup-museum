# Do You Know Your Institute?

Pop-up museum website for Team CakedUp's UPDH project "Do You Know Your Institute?" (IIIT Hyderabad, exhibition on 14 November 2026).

## Open it
- Double-click `site/index.html` (Chrome). No internet or server needed.
- Exhibit monitors: 4, one per board, each on its own laptop. Open the page with the screen id, then press `F` for fullscreen:
  - Board 1: `site/index.html?screen=board1` (old campus photo slideshow, `#/photos`)
  - Board 2: `site/index.html?screen=board2` (buildings growing, satellite time-lapse, `#/buildings`)
  - Board 3: `site/index.html?screen=board3` (the map: the 2002 plan fading into today, journeys)
  - Board 4: `site/index.html?screen=board4` (How we know; press `T` for the website tour)
  - After 90 s with no input a screen goes back to its home view.
- Keys: `1`-`9`, `0` jump between pages, `F` fullscreen, `H` home, `Esc` closes panels, `T` website tour (PageDown/PageUp or a clicker steps it), `N` speaker notes. `?dev=1` shows dev helpers.

## Work on it
- Claude sessions: read `CLAUDE.md` first (it is loaded automatically). Claims are in `TASKS.md`, messages in `HANDOFF.md`.
- Facts: `context.md` (single source of truth). Build plan: `IMPLEMENTATION_PLAN.md`. UI helpers: `site/js/core/README.md`.
- Check before committing: `node scripts/check.mjs`
- Rebuild images after changing `raw/`: `bash scripts/build_assets.sh` (needs Python 3 + Pillow + poppler).
- Physical board print files: `print/` (PDFs in `print/pdf/`).
