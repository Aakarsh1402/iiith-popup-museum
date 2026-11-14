# CLAUDE.md: rules for every Claude (and human) working in this repo

This repo is the website for Team CakedUp's UPDH pop-up museum "Do You Know Your Institute?" (exhibition: Saturday 14 Nov 2026). Several people run their own Claude Code sessions on it at the same time. Those sessions cannot see each other, so **the repo is the only shared channel**. Follow this file exactly.

## 1. Read first (in this order)
1. This file.
2. `TASKS.md`: who is working on what right now. Never start a task someone else has claimed.
3. The last ~40 lines of `HANDOFF.md`: messages between sessions. Act on anything addressed to you or to `all`.
4. `context.md`: every fact, source ID, conflict and the physical exhibit plan. **The only source of truth for content.**
5. `IMPLEMENTATION_PLAN.md`: how the site is built (architecture, data schemas, page specs).
6. `site/js/core/README.md`: the shared UI helpers (`M.ui.*`, `M.util.*`). Reuse them; don't write your own modal/lightbox/badge.

## 2. How sessions talk to each other
- **Before starting any task and before every commit:** `git pull --rebase`. Then re-read `TASKS.md` and the new lines of `HANDOFF.md`.
- **Claim a task** by editing its row in `TASKS.md` (`owner` = your name, `status` = `doing`), commit and push **immediately**, before writing code. If the push is rejected because someone else pushed first, pull, re-check the row, and back off if they claimed it.
- **Send a message** by appending ONE line to the end of `HANDOFF.md`:
  `- [2026-11-14 10:42] [from soham-claude to aakarsh-claude] events.js needs an event for the 2003 games; can you add it? (re: timeline)`
  Use `to all` for announcements. Never edit or delete earlier lines. `HANDOFF.md` is union-merged by git, so appends never conflict.
- **Reply** by appending a new line that starts with `re:` and quotes the time of the line you answer.
- **Need a file you don't own changed?** Don't edit it. Append a HANDOFF line to its owner (see `TASKS.md`).
- **Finished a task?** Set `status` = `done` in `TASKS.md`, push, and append a one-line `to all` note saying what changed and how to see it (route or file).
- Long-running or blocked? Say so in HANDOFF so nobody waits on you silently.

## 3. Hard rules for code
- Static site, **no build step, no framework, no CDN, nothing fetched from the internet**. Plain HTML + CSS + vanilla JS (ES2020).
- Must work when `site/index.html` is **double-clicked (file://) in Chrome**: no `fetch`/XHR of local files, no ES modules, classic `<script>` tags, one global namespace `window.M`. All data ships as `.js` files assigning onto `M`.
- Page modules register on `M.pages.<id>` with `render(root, ctx)`, optional `update(params, query)`, and `destroy()` (clear every timer and listener you added).
- Only edit files your task owns (file list per task in `TASKS.md`). `site/index.html` already lists every planned script; don't add new script tags without a HANDOFF note to the foundation owner.
- Respect `prefers-reduced-motion`. Wrap every `localStorage` access in try/catch.
- Run `node scripts/check.mjs` before every commit. It must pass (warnings are OK).
- Images: re-run `bash scripts/build_assets.sh` only if you change `raw/`. Generated files in `site/assets/`, `site/data/images.js` and `site/data/transcripts.js` are committed; don't hand-edit them.

## 4. Hard rules for visitor-facing text (site copy, data strings, board text)
- Plain undergraduate student voice. Short sentences. Sentence-case headings.
- **No em dashes (U+2014). No en dashes as punctuation. Straight quotes only.** No "delve", "tapestry", "testament", "rich history", "vibrant", "nestled", "pivotal", "crucial", "not just X but Y", "In conclusion", no trailing "..., highlighting the importance of ..." clauses. The check script enforces the dash/quote rules and warns on the words.
- Every fact must trace to a source ID in `context.md` section 6, and every event/card/fact/quiz item carries `sources: [...]`. If something isn't in `context.md` or `sources/`, don't invent it: put `TODO(team): ...` in a `todo` field, never in visible text.
- The PJN dossier is AI-polished: paraphrase its facts, never quote its wording as his words.
- Never show: the sentence removed from Sridhar's interview (and never try to restore it), any name or face for the official in the phone-booth bribe story, the "summer interns" claim, or "Himalaya had no corporate involvement" (only Block C was self-funded).

## 5. Privacy
- `raw/interviews_corpus/` and `raw/interviews_corpus.zip` are deliberately **not in git** (raw interview files). Don't add them. The cleaned texts in `sources/transcripts/` are what the site uses.
- Don't commit anyone's personal email or phone number. Commit with your GitHub noreply address if you can.
- No `Co-Authored-By` trailers in commit messages (team preference).

## 6. Running and checking
- Open `site/index.html` in Chrome (double-click). Kiosk mode per monitor: `site/index.html?screen=board2` (screens are in `site/data/config.js`). `?dev=1` turns on dev helpers (map coordinate picker etc.).
- Headless screenshot for self-checks:
  `google-chrome --headless=new --screenshot=/tmp/shot.png --window-size=1920,1080 "file://$PWD/site/index.html#/timeline"`
- Keys: `1`-`9`, `0` jump between pages, `F` fullscreen, `H` home, `Esc` closes panels.
