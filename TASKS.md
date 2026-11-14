# TASKS.md: claim board

Rules are in `CLAUDE.md` section 2. The split is 60/40 between two sessions (see `IMPLEMENTATION_PLAN.md` section 10):
**aakarsh-claude** (Aakarsh) and **saharsh-claude** (Saharsh). Each session only edits files in its own rows.
Update `status` (`todo` / `doing` / `done` / `blocked`) as you go, and push right away so the other side sees it.

## aakarsh-claude (60%)
| id | task | files owned | status |
|---|---|---|---|
| A1 | Repo setup, coordination, asset pipeline + generated data | `CLAUDE.md`, `TASKS.md`*, `.gitignore`, `.gitattributes`, `scripts/build_assets.*`, `scripts/gen_*.py`, `site/assets/**` (not silhouette/comic), `site/data/images.js`, `site/data/transcripts.js` | done |
| A2 | Foundation: shell, router, kiosk + idle playlists, nav, UI kit, fonts, check script, README | `site/index.html`, `site/css/base.css`, `site/css/components.css`, `site/js/core/*`, `site/data/config.js`, `site/assets/fonts/*`, `scripts/check.mjs`, `scripts/screenshot.mjs`, `README.md` | doing |
| A3 | Core data | `site/data/sources.js`, `people.js`, `events.js`, `facts.js`, `places.js`, `journeys.js`, `trees.js` | doing |
| A4 | Start page + 3D coin + banyan | `site/js/pages/start.js`, `site/css/start.css`, `site/assets/img/banyan-*.png`, `coin-*.png`, `scripts/gen_banyan.py`, `scripts/coin/*` | done |
| A5 | Timeline (centrepiece: zoom, filters, detail panel, autoplay) | `site/js/pages/timeline.js`, `site/css/timeline.css` | done |
| A6 | Map (2002 plan, hotspots, journeys layer, trees layer, satellite flipbooks) | `site/js/pages/map.js`, `site/css/map.css` | done |
| A7 | Physical boards: print HTML + PDFs + board layout plans | `print/**` (handed to saharsh-claude as S11 on 14 Nov) | done |
| A8 | Integration pass + QA | any file, after a HANDOFF note | doing |
| A9 | 14 Nov round 2 (from Aakarsh): nav underline bug, timeline bugs, rename (project = "Do You Know Your Institute?", HISTREE = only the trees), Start: blue rotating IIIT logo, minimal copy on my pages, speaker notes, 4-monitor config, website tour (Board 4) | `site/js/core/*`, `site/index.html`, `site/data/config.js`, `site/data/notes.js` (new), start/timeline/map files | doing |
| A10 | Monitor slideshows: M1 old campus photos, M2 building evolutions | `site/js/pages/slides.js`, `site/css/slides.css` (new) | done |
| A11 | Map: 2002 plan morphs into today's satellite view (Google Earth screenshot), every journey works on it | `site/js/pages/map.js`, `site/css/map.css`, `site/assets/img/map/*`, `raw/map/*` | doing |

## saharsh-claude (40%)
| id | task | files owned | status |
|---|---|---|---|
| S1 | Story + evidence data (start now, no foundation needed) | `site/data/way.js`, `conflicts.js`, `verified.js` (+ `M.correction`), `quiz.js`, `ending.js`, `documents.js` | done |
| S2 | How We Know (conflict flip cards, verified chains, correction, how we worked; `?autoplay=1` cycles flips) | `site/js/pages/howweknow.js`, `site/css/howweknow.css` | done |
| S3 | Voices index + person pages + transcript search + phone-booth comic | `site/js/pages/voices.js`, `site/css/voices.css`, `site/assets/img/silhouette.svg`, `site/assets/comic/*` | done |
| S4 | The IIIT Way (scroll story, Himalaya diagram, leased bar chart, civil gallery, autoplay) | `site/js/pages/way.js`, `site/css/way.css` | done |
| S5 | Quiz | `site/js/pages/quiz.js`, `site/css/quiz.css` | done |
| S6 | Then and Now (ending) | `site/js/pages/ending.js`, `site/css/ending.css` | done |
| S7 | Archive + document viewer | `site/js/pages/archive.js`, `site/css/archive.css` | done |
| S8 | HISTREE page (reads `M.trees`) | `site/js/pages/histree.js`, `site/css/histree.css` | done |
| S9 | New board sheets for the final layout (context.md 14.7), one PDF | `boards/**` | done |
| S10 | Up for grabs, saharsh-claude first (claim it here): Archive tab works end to end; minimal copy pass on S2-S8 pages; "HISTREE" only for the trees (project name is "Do You Know Your Institute?") on S pages | S2-S8 files | done |
| S11 | From aakarsh-claude: print/ rename + drop out-of-plan sheets, speaker-notes sheet from M.notes, 390px/1366px QA on every page | `print/**` | doing |

\* Both sessions may edit their own rows' `status` column in this file. Nothing else in it.
