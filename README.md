# HISTREE: How IIIT Put Down Its Own Roots

Pop-up museum website for Team CakedUp's UPDH project "Do You Know Your Institute?" (IIIT Hyderabad, exhibition on 14 November 2026).

## Open it
- Double-click `site/index.html` (Chrome). No internet or server needed.
- Exhibit monitors (2 or 3), one per laptop, fullscreen with `F`:
  - 3 monitors: `site/index.html?screen=history`, `?screen=map`, `?screen=evidence`
  - 2 monitors: `site/index.html?screen=left`, `?screen=right`
  - After 90 s with no input a screen goes back to its home view and cycles through a short playlist.
- Keys: `1`-`9`, `0` jump between pages, `F` fullscreen, `H` home, `Esc` closes panels. `?dev=1` shows dev helpers.

## Work on it
- Claude sessions: read `CLAUDE.md` first (it is loaded automatically). Claims are in `TASKS.md`, messages in `HANDOFF.md`.
- Facts: `context.md` (single source of truth). Build plan: `IMPLEMENTATION_PLAN.md`. UI helpers: `site/js/core/README.md`.
- Check before committing: `node scripts/check.mjs`
- Rebuild images after changing `raw/`: `bash scripts/build_assets.sh` (needs Python 3 + Pillow + poppler).
- Physical board print files: `print/` (PDFs in `print/pdf/`).
