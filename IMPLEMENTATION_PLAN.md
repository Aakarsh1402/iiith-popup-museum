# IMPLEMENTATION_PLAN.md: exhibit website v1

Website for the "Do You Know Your Institute?" pop-up museum (HISTREE = the trees page only, renamed 14 Nov). Read `context.md` first: it holds every fact, source, conflict and the physical plan. This file says how to build the site.

---

## 0. How to use this plan

**Status (14 Nov 2026, 01:30):** the review pass is done (see "Review notes" at the bottom). Two Claude sessions build the site in parallel, split 60/40 (section 10): **aakarsh-claude** (60%) and **saharsh-claude** (40%). Coordination rules are in `CLAUDE.md`; live claims are in `TASKS.md`; messages go in `HANDOFF.md`.

1. Read `CLAUDE.md`, `context.md`, then this file.
2. Build only the files your side owns (section 10). Schemas in section 5 are frozen; a schema change needs a HANDOFF note and the owner of that data file applies it.
3. Integration pass (aakarsh-claude, with saharsh-claude's help): run the checks in section 11, fix cross-file issues, then both humans give feedback.

**Scope of v1:** the site runs locally on the exhibit laptops (file://) and looks finished. No backend, no analytics. The same `site/` folder can also be served by GitHub Pages so phones can open the quiz (section 13).

---

## 1. Hard technical constraints

- **Static, no build step, no framework, no CDN.** Plain HTML + CSS + vanilla JS (ES2020). Nothing fetched from the internet, so it works offline at the venue. No npm dependencies for the site itself. Node and Python are fine for **scripts** only.
- **Must work when opened by double-clicking `site/index.html` (file://) in Chrome.** That means:
  - No `fetch()` or XHR of local files (Chrome blocks them on file://).
  - No ES modules (`type="module"` is blocked on file://). Use classic `<script src>` tags and one global namespace: `window.M`.
  - All data (including transcripts) ships as `.js` files that assign onto `window.M`, e.g. `M.events = [...]`.
  - Images load with plain `<img src="assets/...">` (relative paths), which works on file://.
- It must also work when served by `python3 -m http.server` from `site/`.
- **Targets:** exhibit monitors at 1920x1080 (landscape; also check 1366x768), viewed from 1 to 2 m with a mouse. Phones at 360 to 430 px wide (mainly for the quiz and the voices pages). Chrome first; Firefox should not break.
- `localStorage` only as a best-effort extra (quiz entry score, last route). Wrap every access in try/catch; the site must work without it.
- Respect `prefers-reduced-motion`.
- No em dashes (U+2014) in any visitor-facing string. The check script enforces this.
- Use no copyrighted characters or logos except IIIT's own name. Draw the banyan illustration ourselves (simple original SVG).

---

## 2. Repo layout (final target)

```
iiith-popup-museum/
  README.md                    # how to open the site, how to add content (written by Agent A)
  context.md                   # facts + physical plan (source of truth)
  IMPLEMENTATION_PLAN.md       # this file
  raw/                         # untouched originals. Never edit, never serve directly.
    interviews_corpus.zip
    interviews_corpus/         # extracted copy of the zip (docx/pdf/md/jpeg)
      civil_engineering_branch_uncaptioned/   # 12 uncaptioned civil photos
    photos.zip
    photos/                    # extracted: 01..50_*.jpeg + captions.md + captions.json
    IIIT_Hyderabad_prospectus_c2001.pdf      # 11 pages, has a text layer
    Lab_floorplans.pdf                       # 27 pages, scanned (no text layer)
    ping_echoes_library_article.pdf          # 3 pages, scanned (identical to interviews_corpus/library-ping.pdf)
    curriculum_screenshots/                  # 3 highlighted crops from the prospectus
  sources/                     # human/agent-readable extractions of raw/
    transcripts/*.md           # 7 interview texts (already extracted)
    documents/                 # phase4_submission.txt, prospectus_c2001_layout.txt, captions.md/.json
  scripts/
    build_assets.sh            # raw/ -> site/assets/ (images, pdf pages)       [Agent B]
    gen_images_js.py           # captions.json -> site/data/images.js           [Agent B]
    gen_transcripts_js.py      # sources/transcripts/*.md -> site/data/transcripts.js [Agent B]
    check.mjs                  # data validation + lint                           [Agent A]
    screenshot.mjs             # optional Playwright screenshots of every route   [Agent A]
  site/
    index.html
    css/
      base.css                 # tokens, reset, type, layout                      [A]
      components.css           # cards, badges, modal, lightbox, chips, nav       [A]
      start.css timeline.css ending.css          [E]
      map.css histree.css                        [D]
      way.css voices.css howweknow.css quiz.css  [F]
      archive.css                                [B]
    js/
      core/util.js router.js kiosk.js ui.js main.js   [A]
      pages/start.js timeline.js ending.js            [E]
      pages/map.js histree.js                         [D]
      pages/way.js voices.js howweknow.js quiz.js     [F]
      pages/archive.js                                [B]
    data/
      config.js                [A]
      sources.js people.js events.js facts.js quiz.js conflicts.js verified.js ending.js way.js   [C]
      places.js journeys.js trees.js                  [D]
      images.js documents.js transcripts.js           [B] (generated + hand-written documents.js)
    assets/
      photos/full/*.jpg  photos/thumb/*.jpg           [B, generated]
      docs/<doc-id>/p-01.png ... + thumb/p-01.jpg     [B, generated]
      curriculum/*.png                                [B, copied]
      img/banyan.svg, img/silhouette.svg ...          [E / F, hand-made]
      comic/ (optional: scans of a hand-drawn comic; see 7.7)
  qa/                          # screenshots from scripts/screenshot.mjs (gitignored or committed, your call)
```

`site/` is self-contained: copying just the `site/` folder to a laptop must be enough to run the exhibit.

---

## 3. Asset pipeline (Agent B)

Tools expected: ImageMagick (`convert`/`magick`), poppler (`pdftoppm`, `pdfimages`), Python 3. Script must be idempotent and re-runnable.

`scripts/build_assets.sh`:
1. **Photos:** for each `raw/photos/NN_*.jpeg` write
   - `site/assets/photos/full/NN_slug.jpg`: longest side 1600 px, quality 82, auto-orient, strip metadata
   - `site/assets/photos/thumb/NN_slug.jpg`: longest side 480 px, quality 75
   - Also process `raw/interviews_corpus/saranga hall the past library, now a lecture hall.jpeg` -> `x01_saranga-hall-2.jpg` and the 12 uncaptioned civil photos -> `c01..c12_civil-uncaptioned.jpg` (put them in the gallery as "uncaptioned, from the civil department visit, 28 Oct 2026").
2. **PDF pages** (`pdftoppm -r 150 -png`, then thumbs at 300 px wide as jpg):
   - `raw/IIIT_Hyderabad_prospectus_c2001.pdf` -> `site/assets/docs/prospectus/p-01.png ... p-11.png`
   - `raw/Lab_floorplans.pdf` -> `site/assets/docs/floorplans/p-01.png ... p-27.png` (scans are large; use `-r 110` if files exceed ~1.5 MB each, then pngquant or convert to jpg quality 80)
   - `raw/ping_echoes_library_article.pdf` -> `site/assets/docs/ping/p-01.png ... p-03.png`
3. **Prospectus embedded photos:** `pdfimages -png` into `site/assets/docs/prospectus/img/`; keep only real photos (drop tiny or blank ones; size > 20 KB is a fine filter). Name them `ximg-01.png` and so on.
4. **Curriculum screenshots:** copy `raw/curriculum_screenshots/*.png` to `site/assets/curriculum/`.
5. The 2002 layout plan (photo 50) is also used as the **map base**. Additionally export `site/assets/map/plan-2002.jpg` at longest side 2400 px for zooming.
6. **Present-day map:** if the team adds `raw/map/current_campus.jpg` (a Google Earth screenshot), export `site/assets/map/now.jpg` at 2400 px. If it's missing, skip silently (the map page handles it).

`scripts/gen_images_js.py`: reads `raw/photos/captions.json` and writes `site/data/images.js`:
```js
window.M = window.M || {};
M.images = [
  { id: "img-04", n: 4, file: "assets/photos/full/04_early-guest-house.jpg",
    thumb: "assets/photos/thumb/04_early-guest-house.jpg",
    caption: "...", section: "...", tags: ["..."], notes: "...", source: "S-PHOTOS" },
  ...
];
```
Use ids `img-01`...`img-50`, `img-x01`, `img-c01`...`img-c12`. Captions are the team's; copy them exactly except: fix "The back in the day photo of the road to and from OBH." to "An early photo of the road to and from OBH." Also capitalise and add a full stop to "Early photo of obh with still young banyan tree". Keep the meaning.

`scripts/gen_transcripts_js.py`: reads `sources/transcripts/*.md` and writes `site/data/transcripts.js` as `M.transcripts = { "P-GOPI": { title, sourceFile, text } ... }` (map filename -> person id: gopi->P-GOPI, sln-shastry->P-SLN, pj-narayanan-dossier->P-PJN, ks-rajan-notes->P-RAJAN, muralidhar-librarian->P-MURALI, prabhakar-m->P-PRAB, sridhar-kora->P-SRIDHAR). Escape correctly with `json.dumps`. **Redaction before export:** the one sensitive sentence in Sridhar Kora's text is already replaced at source with "[One sentence removed by the team for privacy.]"; keep it that way. Remove the cut-off last line of Prabhakar M's text. For the PJN dossier, prepend a note: "This is a write-up of the interview, not a word-for-word transcript."

`site/data/documents.js` (hand-written by B) describes each document and its pages. Floor-plan page notes (from a visual check; **verify each against the image** and fix):
| page | note |
|---|---|
| 1 | Table: floor space by centre, Vindhya and Nilgiri, total 92,017 sq ft |
| 2 | LTRC, 1st floor, Vindhya A1-A4/B2 (13,341 sq ft on this floor) |
| 3 | C-VEST, 3rd floor, Vindhya A5, 3,160 |
| 4 | CDE, 3rd floor, Vindhya A5, 3,029 |
| 5 | CVIT, 2nd floor, Vindhya A3, 6,817 |
| 6 | RRC, 3rd floor, Vindhya B5, 4,336 |
| 7 | C-STAR, 3rd floor, Vindhya B3/B4, 4,286 |
| 8 | CBS (Building Science Lab), 2nd floor, Vindhya B2, 1,012; Kidosoft next door |
| 9 | EERC with CASE Lab, 1st floor, Vindhya C1, C2, B2, 3,606 |
| 10 | SPRC, 3rd floor, Vindhya B6, 2,520 |
| 11 | LSI, 3rd floor, Vindhya B2, 2,310 |
| 12 | CITE, 2nd floor, Vindhya B2, 1,183 |
| 13 | CCNSB, 3rd floor, Vindhya A2-A4/B2, 9,338 |
| 14 | PSRC, 2nd floor, Vindhya B2, 1,073 |
| 15 | CEH, 3rd floor, Vindhya C1-C3, 3,435 |
| 16 | ICTARD (e-Sagu), 2nd floor, Vindhya B3, 3,896 |
| 17 | CIE, 2nd floor, Nilgiri |
| 18 | CIE, 2nd floor, Vindhya C4/C5, 8,422 |
| 19 | ORD (Outreach Division), 3rd floor, Vindhya C1 & C3, 2,568 |
| 20 | EQITEEC (Enhance Edu), 2nd floor, Vindhya C3, 8,345 |
| 21 | SER Lab, 3rd floor, Vindhya B6, 444 |
| 22 | Cognitive Science Lab, 1st floor, Vindhya B5, 2,024 (SpectraForce next door) |
| 23 | Compilers Lab, 3rd floor, Vindhya B6, 196 |
| 24 | Science Lab (with Dry Lab), 1st floor, Vindhya A1/A2 area, 2,121 |
| 25 | Intel Multicore Lab, 3rd floor, Nilgiri, 529 |
| 26 | Longer table incl. hardware labs, classrooms, MSIT, digital library |
| 27 | Leased spaces: RGUKT, Kidosoft, SpectraForce, SBH, Xerox, Milk & Water, TalentSprint, Prudhvi |

Prospectus page notes: p1 cover (iiit.net); p2 intro, people (Raj Reddy, Narendra Ahuja), programmes, corporate schools; p3 partner companies list, UG programme; p4-5 curriculum, electives (dot-com era, Sanskrit strand); p6 research centres (IT for Railways...), HSSM electives (Vedanta), infrastructure (62 acres); p7 single rooms, PC ratio 1:2, library under construction, faculty list; p8-11 faculty profiles (Govindarajulu's career on p10).

---

## 4. App architecture (Agent A)

### 4.1 index.html
- `<meta name="viewport" content="width=device-width, initial-scale=1">`, title "HISTREE | Do You Know Your Institute?".
- Body: `<header id="nav">`, `<main id="app" tabindex="-1">`, `<div id="modal-root">`, `<div id="toast-root">`.
- Script order (all classic `<script src defer>`): `data/*.js` (config first) -> `js/core/util.js`, `ui.js`, `router.js`, `kiosk.js` -> `js/pages/*.js` -> `js/core/main.js`.
- Agent A creates **stub files for every planned page, CSS and data file** on day one (a page stub just renders its title and "coming soon"), so the script list never changes and no agent has to touch index.html.

### 4.2 Global namespace
```js
window.M = {
  config, sources, people, events, facts, quiz, conflicts, verified, correction, ending, way,
  places, journeys, trees, images, documents, transcripts,   // data
  pages: {},          // page modules register here
  util: {}, ui: {},   // helpers
  state: { screen: null, route: null }
};
```

### 4.3 Router (`router.js`)
- Hash routes: `#/start`, `#/timeline`, `#/timeline/<eventId>`, `#/map`, `#/map/<placeId>`, `#/way`, `#/way/<chapterId>`, `#/histree`, `#/voices`, `#/voices/<personId>`, `#/how-we-know`, `#/how-we-know/<cardId>`, `#/archive`, `#/archive/<docId>`, `#/archive/<docId>/<page>`, `#/quiz`, `#/ending`.
- Query params after the route are allowed: `#/timeline?filter=buildings&era=founding&autoplay=1`.
- Page module contract:
```js
M.pages.timeline = {
  id: "timeline", title: "Timeline", nav: true, navOrder: 2, key: "2",
  render(root, { params, query }) { /* build DOM into root */ },
  update(params, query) { /* optional: same page, new params, no full re-render */ },
  destroy() { /* remove listeners, timers */ }
};
```
- On route change: if same page and `update` exists, call it; else `destroy()` the old page, clear `#app`, `render()` the new one, move focus to `#app`, scroll to top. Fade transition (150 ms opacity) unless reduced motion.
- Unknown route -> `#/start`.

### 4.4 Kiosk mode (`kiosk.js`)
- `index.html?screen=board2` (query string **before** the hash) selects a screen from `M.config.screens`. Each screen has `home` (a hash route) and `label` ("Board 2: Borrowed Branches").
- If a screen is set and the user is not on its home route: show a floating pill bottom-right "Back to Board 2" (click = go home).
- **Idle timer:** after `M.config.idleSeconds` (default 90) with no pointer/key/touch/wheel input, go to the screen's home route and close any modal. Pages with autoplay start their autoplay when reached via idle or initial load.
- Without `?screen=`, no idle behaviour (normal browsing, e.g. on phones).
- Keys (all screens): `1`..`9`, `0` jump to nav pages in navOrder; `F` toggles fullscreen (`document.documentElement.requestFullscreen()`); `H` goes home (screen home or `#/start`); `Esc` closes modal/lightbox. Ignore keys while focus is in an input.
- `?dev=1` enables dev helpers (the map coordinate picker, outlines on hotspots, a corner overlay with the current route).

`site/data/config.js`:
```js
M.config = {
  title: "HISTREE", subtitle: "Do You Know Your Institute?",
  team: "Team CakedUp", course: "UPDH, IIIT Hyderabad", date: "14 November 2026",
  idleSeconds: 90,
  quizUrl: null,   // set when hosted; while null, show "Ask a guide for a quiz card"
  // We will have 2 or 3 monitors. Each screen has a home and an idle "playlist": after idleSeconds
  // with no input the screen goes to playlist[0], stays `secs`, then moves to the next item, looping.
  // Any input stops the playlist and the "Back to ..." pill appears.
  screens: {
    // 3-monitor setup
    history:  { label: "Monitor 1: Boards 1-2 (history)", home: "#/timeline?autoplay=1",
                playlist: [ { route: "#/timeline?autoplay=1", secs: 150 }, { route: "#/way?autoplay=1", secs: 120 } ] },
    map:      { label: "Monitor 2: Board 3 (moving rooms)", home: "#/map?autoplay=1",
                playlist: [ { route: "#/map?autoplay=1", secs: 180 }, { route: "#/histree", secs: 40 } ] },
    evidence: { label: "Monitor 3: Board 4 + exit (how we know)", home: "#/how-we-know?autoplay=1",
                playlist: [ { route: "#/how-we-know?autoplay=1", secs: 120 }, { route: "#/voices", secs: 40 }, { route: "#/ending", secs: 60 } ] },
    // 2-monitor setup: use these two instead
    left:     { label: "Monitor A: Boards 1-2", home: "#/timeline?autoplay=1",
                playlist: [ { route: "#/timeline?autoplay=1", secs: 150 }, { route: "#/way?autoplay=1", secs: 120 } ] },
    right:    { label: "Monitor B: Boards 3-4", home: "#/map?autoplay=1",
                playlist: [ { route: "#/map?autoplay=1", secs: 150 }, { route: "#/how-we-know?autoplay=1", secs: 120 }, { route: "#/ending", secs: 50 } ] },
    // phones at the entry table / a spare tablet
    entry:    { label: "Entry", home: "#/start" }
  }
};
```
Monitor plan (updated 14 Nov): **4 monitors**, one per board: `?screen=board1` (old photos slideshow), `board2` (buildings time-lapse), `board3` (map), `board4` (How we know + website tour). Phones scan the entry QR for `#/quiz` (needs GitHub Pages, section 13). Every page must also work with plain mouse browsing, because visitors will click around on all screens.

### 4.5 Shared UI (`ui.js`), documented in `site/js/core/README.md`
- `M.ui.el(tag, attrs, ...children)`: tiny DOM builder (sets text via textContent, never innerHTML for data strings).
- `M.ui.sourceBadges(sourceIds)`: row of small badges: label from `M.sources[id].short`, colour by type (oral / document / photo / web). Click opens a popover with the full citation and a link (voices page for oral, archive page for documents, photo lightbox for photos, URL text for web).
- `M.ui.confidenceTag(level)`: "Corroborated" (green), "One source" (grey), "Sources disagree" (amber, links to the conflict), "To check" (dashed outline).
- `M.ui.imageFigure(imgId, {size})`: figure with thumb, caption and credit; click opens the lightbox.
- `M.ui.lightbox(imgIds, startIndex)`: full-screen viewer, arrow keys, caption, Esc to close, wheel/pinch zoom on the image.
- `M.ui.modal(contentNode, {title})`.
- `M.ui.chips(options, active, onChange)`: filter chips.
- `M.ui.card({kicker, title, body, image, onClick})`.
- `M.util.byId(list, id)`, `M.util.sourcesFor(...)`, `M.util.eventsForPlace(placeId)`, `M.util.eventsForPerson(personId)` (an event belongs to a person if `people` includes them **or** `sources` includes their oral source), `M.util.formatYear(event)`, `M.util.debounce`, `M.util.prefersReducedMotion()`.

### 4.6 Nav
Top bar: small banyan mark + "HISTREE" + links in navOrder: 1 Start, 2 Timeline, 3 Map, 4 The IIIT Way, 5 HISTREE, 6 Voices, 7 How We Know, 8 Archive, 9 Quiz, 0 Then and Now (ending). Show the number key hint subtly on monitors (`min-width: 1200px`). On phones: hamburger menu. The active link is underlined in the accent colour.

---

## 5. Data model and seed content

All data files start with `window.M = window.M || {};`. IDs are stable strings. All visitor text follows `context.md` section 4 (student voice, no em dashes, length limits). **Every event, card, fact and quiz item must carry `sources: [...]` using IDs from `M.sources`.** Content comes only from `context.md` and `sources/` / `raw/`.

### 5.1 `sources.js` (Agent C)
```js
M.sources = {
  "S-GOPI": { type: "oral", short: "Interview with Mr. Gopi (2026)", personId: "P-GOPI" },
  "S-PROSP": { type: "document", short: "IIIT prospectus (c.2001)", docId: "doc-prospectus",
               note: "Early official brochure. Written to attract students." },
  "S-LAYOUT2002": { type: "document", short: "Campus layout plan (2002), via SLN Shastry", docId: "doc-layout2002" },
  "S-PHOTOS": { type: "photo", short: "Team photo archive (captions by the team)" },
  "S-NEWS-THUB": { type: "web", short: "Telangana Today (2022); Wikipedia: T-Hub", url: "https://telanganatoday.com/hyderabad-t-hub-celebrates-seven-years-of-innovation" },
  ...
};
```
Include every ID in `context.md` section 6 (S-GOPI, S-SLN, S-PJN, S-RAJAN, S-MURALI, S-PRAB, S-SRIDHAR, S-PROSP, S-LAYOUT2002, S-FLOORPLANS, S-PING, S-PHOTOS, S-CURRSHOTS, S-PHASE4, S-CIVILRAW, S-BLOG25, S-BLOGCORP, S-BLOGFOUNDERS, S-IIITGLANCE, S-NEWS-THUB, S-NEWS-SATYAM, S-WIKI-OLD). Web URLs: blogs.iiit.ac.in/?p=22437, ?p=22443, ?p=22503, ?p=22026; iiit.ac.in/?p=2214; en.wikipedia.org/wiki/T-Hub; en.wikipedia.org/wiki/Satyam_scandal. On the site, show web URLs as text (the exhibit is offline).

### 5.2 `people.js` (Agent C)
```js
M.people = [
  { id: "P-GOPI", name: "Mr. Gopi", fullName: "Mr. Gopalakrishnan (Gopi)", initials: "G",
    role: "Guest house caretaker; ran the campus phone booth", years: "1998 to now", joined: 1998,
    photo: null, sourceId: "S-GOPI", transcriptId: "P-GOPI",
    oneLine: "Has been here since the bullock-cart days.",
    toldUs: ["The guest house was the first mess.", "He ran a phone booth and was asked for a bribe.", "..."],
    featured: true },
  ...
];
```
All 7 interviewees from `context.md` section 5. `photo` stays null until the team adds consented portraits (then point it at an image id). Render initials avatars meanwhile.

### 5.3 `events.js` (Agent C), the timeline backbone
```js
M.events = [
  { id: "e-1999-bunks",
    year: 1999, yearEnd: null, approx: false, dateLabel: "1999",   // dateLabel is what's shown
    era: "founding",               // founding (<=2002) | growing (2003-2014) | takingback (2015-2022) | now (2023-2026) | undated
    title: "A whole batch sleeps on bunk beds inside Vindhya",       // <= 70 chars
    summary: "There were no hostels yet, so the 1999 batch slept army-style on two-tier bunks inside an academic building.", // <= 30 words
    body: "...",                   // <= 120 words, optional
    category: ["buildings"],       // buildings | operations | people | trees | land | curriculum (1-2)
    places: ["vindhya"],           // ids in M.places (optional)
    people: [],                    // ids in M.people (subjects, optional)
    sources: ["S-PJN", "S-GOPI"],
    confidence: "corroborated",    // corroborated | single | contested | todo
    conflictId: null,              // "C2" etc. when contested
    images: [],                    // ids in M.images
    featured: true,                // shown in autoplay and on the Start loop
    quizId: null }
];
```
Build **45 to 60 events** from `context.md` section 7 (every bullet there that has a year or a clear period). Undated items go in era `undated` with `dateLabel: "Undated"`. `yearEnd` for ranges (e.g. corporate schools 1998-2007, T-Hub 2015-2022, phone booth 1998-2002). Mark `approx: true` for "around" dates (render as "c.2002" / "around 2002").

Seed (Agent C must keep these and add the rest):
- e-1998-start: 2 Sep 1998, first batch begins on two floors of Nilgiri. [S-PJN, S-BLOG25] corroborated, featured, images img-07, img-08
- e-1998-diploma: 49 of 50 joined, for a diploma (GDIT). [S-GOPI, S-PJN]
- e-1998-mess: the guest house is the first mess. [S-GOPI, S-PHOTOS] corroborated, images img-04, img-30
- e-1998-library: library opens in Nilgiri 119, now Saranga Hall. [S-PING, S-MURALI] corroborated, images img-37, img-38
- e-1998-booth: Gopi's phone booth and the Rs. 2,000 bribe (1998 to around 2002). [S-GOPI] single, img-29
- e-1998-corpschools: corporate schools in the Corporate Schools building (1998-2007). [S-PROSP, S-LAYOUT2002, S-BLOGCORP] corroborated, img-19
- e-1999-bunks (above)
- e-2001-deemed: deemed university status. [S-PJN, S-PROSP]
- e-2001-library-move: library moves to Vindhya A6. [S-MURALI]
- e-c2001-prospectus: what the prospectus shows (single rooms, 62 acres, IT for Railways, Vedanta...). [S-PROSP, S-CURRSHOTS]
- e-2002-plan: the 62-acre layout plan. [S-LAYOUT2002] img-50, conflictId C2
- e-2007-vindhya: IIIT takes Vindhya back. [S-PJN] conflictId C1
- e-2015-thub: T-Hub opens in Himalaya Block D. [S-NEWS-THUB, S-PJN]
- e-2018-blockA: Block A bought out from TalentSprint. [S-PJN]
- e-2022-blockD: T-Hub leaves, Block D returns. [S-NEWS-THUB, S-PJN]
- e-undated-civil: the civil engineering department, now empty. [S-PHOTOS, S-PROSP, S-FLOORPLANS] todo, images img-39..img-48 (pick 4)

### 5.4 `places.js` (Agent D)
Map hotspots are rectangles in **percent of the base image** (x, y = top-left corner; w, h = size). First guesses for the 2002 plan (`assets/map/plan-2002.jpg`, north points **down**), to be tuned with the `?dev=1` picker:
```js
M.places = [
  { id: "nilgiri", name: "Nilgiri", aka: ["IIIT Main Building (2002 plan)"],
    hotspot: { plan2002: { x: 58, y: 66, w: 17, h: 15 }, now: null },
    summary: "The first academic building. First classes, first library, first servers.",
    images: ["img-37", "img-38"], journeys: ["library", "server-room", "big-hall"], sources: ["S-PJN"] },
  { id: "vindhya", name: "Vindhya", aka: ["Corporate Schools (2002 plan)"],
    hotspot: { plan2002: { x: 31, y: 60, w: 26, h: 21 } }, ... },
  { id: "guest-house", name: "Guest House", hotspot: { plan2002: { x: 60, y: 40, w: 12, h: 13 } }, ... },
  { id: "obh", name: "Old Boys Hostel (OBH)", hotspot: { plan2002: { x: 68, y: 21, w: 18, h: 20 } }, ... },
  { id: "nbh", name: "New Boys Hostel", hotspot: { plan2002: { x: 74, y: 52, w: 13, h: 12 } }, ... },
  { id: "girls-hostel", name: "Girls Hostel", hotspot: { plan2002: { x: 74, y: 64, w: 13, h: 12 } }, ... },
  { id: "faculty-quarters", name: "Faculty Quarters", hotspot: { plan2002: { x: 58, y: 52, w: 16, h: 9 } }, ... },
  { id: "playground", name: "Play grounds", hotspot: { plan2002: { x: 31, y: 51, w: 26, h: 8 } }, ... },
  { id: "substation", name: "Substation", hotspot: { plan2002: { x: 16, y: 63, w: 12, h: 9 } }, ... },
  { id: "stadium", name: "Gachibowli Stadium (next door)", hotspot: { plan2002: { x: 88, y: 30, w: 11, h: 22 } }, ... }
];
```
Places that are **not on the 2002 plan** (built later) get `hotspot.plan2002: null` and appear in a side list "Built after 2002": Himalaya (blocks A, C, D, KRB), Bakul Nivas, New Academic Block, Felicity ground, amphitheatre, civil department (location TODO), Saranga Hall (inside Nilgiri: link to nilgiri). If `assets/map/now.jpg` exists, they get `hotspot.now` coordinates too (set by the team with the dev picker).

Each place detail panel shows: name + aka, summary, photo strip, "What happened here" (events filtered by place, sorted by year, mini vertical timeline), linked journeys, sources.

### 5.5 `journeys.js` (Agent D)
```js
M.journeys = [
  { id: "library", title: "The library has moved twice. A third move is coming.",
    stops: [
      { place: "nilgiri", label: "Nilgiri 119 (now Saranga Hall)", when: "1998", text: "175 books on the first day books arrived. Open till midnight. Run by student librarians.", sources: ["S-PING", "S-MURALI"], image: "img-37" },
      { place: "vindhya", label: "Vindhya A6", when: "2001", text: "...", sources: ["S-MURALI"] },
      { place: "vindhya", label: "Vindhya A6, two floors", when: "2016-2020", text: "...", sources: ["S-MURALI"] },
      { place: "nab", label: "New Academic Block", when: "coming", text: "...", sources: ["S-MURALI"], image: "img-14" }
    ] },
  ...
];
```
All 13 journeys in `context.md` section 11.

### 5.6 `trees.js` (Agent D)
Four banyans (Navjeevan with 3 moves; Jagruthi; the Judge's Quarters tree; the Buddha Nivas tree) + the PGDIT-2002 neem (img-49) + the framed banyan photo (img-26) + the young banyan at OBH (img-05). Fields: `id, name, kind, story, moves: [{place, label}], photos: [imgIds], sources`. Photos taken on the morning of the 14th go in later (`photos: []` for now, show a "photo coming" tile).

### 5.7 `facts.js` (Agent C)
The 25 fun facts in `context.md` section 7 ("Fun facts pool"): `{ id, text (<= 25 words), sources, image (optional), eventId (optional) }`.

### 5.8 `quiz.js` (Agent C)
8 questions, 3-4 options each, one correct:
```js
M.quiz = { title: "Do you know your institute?", questions: [
  { id: "q1", q: "Where were the first classes held in 1998?", options: ["Himalaya", "Nilgiri", "Vindhya", "The guest house"], answer: 1,
    explain: "Only the first two floors of Nilgiri were in use. The one big hall, SH-1, was next door in Vindhya.", sources: ["S-PJN"] },
  { id: "q2", q: "What did the first batch enrol for?", options: ["A B.Tech", "A diploma (GDIT)", "An M.Tech"], answer: 1, ... },
  { id: "q3", q: "Where did the 1999 batch sleep?", options: ["In a hotel", "On bunk beds inside Vindhya", "In Parijat Nivas"], answer: 1, ... },
  { id: "q4", q: "What was the guest house used as in the early days?", options: ["A lecture hall", "The mess", "The library"], answer: 1, ... },
  { id: "q5", q: "Where did the library start?", options: ["Saranga Hall", "Vindhya A6", "Himalaya"], answer: 0, ... },
  { id: "q6", q: "How many times has the banyan Navjeevan been moved?", options: ["Never", "Once", "Three times"], answer: 2, ... },
  { id: "q7", q: "Which company's black granite floor is still in Vindhya?", options: ["IBM", "Motorola", "Oracle"], answer: 1, ... },
  { id: "q8", q: "What was Himalaya Block D from 2015 to 2022?", options: ["A hostel", "T-Hub, the state's startup incubator", "The civil department"], answer: 1, ... }
] };
```
The paper quiz cards (physical) must use exactly these 8 questions.

### 5.9 `conflicts.js` and `verified.js` (Agent C)
```js
M.conflicts = [
  { id: "C1", question: "Why did the company schools leave?",
    accounts: [
      { who: "Prof. P. J. Narayanan", sources: ["S-PJN"], text: "(paraphrase) The teaching didn't work..." },
      { who: "Mr. Gopi", sources: ["S-GOPI"], text: "..." },
      { who: "IIIT's own blog", sources: ["S-BLOGCORP"], text: "..." },
      { who: "The prospectus (c.2001)", sources: ["S-PROSP"], text: "..." }
    ],
    ourTake: "...", settleWith: "...", featured: true },
  ... // C1-C5 from context.md section 8 (C6/C7 optional, featured: false)
];
M.verified = [ { id: "V1", claim: "The guest house was the first mess.",
  chain: [ { kind: "oral", text: "Gopi told us the guest house served as the mess.", sources: ["S-GOPI"] },
           { kind: "photo", text: "An old aerial photo shows the sign: 'I.I.I.T Guest House, Mess & Lounge'.", sources: ["S-PHOTOS"], image: "img-04" },
           { kind: "photo", text: "Today the lobby stands where the mess was.", sources: ["S-PHOTOS"], image: "img-30" } ],
  note: "One memory, checked against a photo." }, ... ]; // V1-V7
M.correction = { title: "We got it wrong", before: "Our Phase 4 draft said Mr. Gopi managed the first mess.",
  after: "His interview says he turned that job down and ran the phone booth instead.", lesson: "History gets corrected when you go back to the source.", sources: ["S-PHASE4", "S-GOPI"] };
```

### 5.10 `ending.js` (Agent C)
`M.ending = { title, rows: [{ when, problem, solved, sources }], now: { text, sources, image: "img-14" }, prompt }` from `context.md` section 13.

### 5.11 `way.js` (Agent C writes text; Agent F renders)
```js
M.way = {
  title: "Borrow, share, take back, build your own",
  intro: "...",
  chapters: [
    { id: "borrow", kicker: "1998", title: "Borrowed ground, borrowed teachers", body: "...", visual: "photos", images: ["img-01", "img-03"], sources: [...] },
    { id: "share", kicker: "1998-2007", title: "Companies in the classroom", body: "...", visual: "schools", sources: [...] },
    { id: "stayed", kicker: "1998-2001", title: "The school principal who became a professor", body: "...", visual: "evidence", sources: ["S-PROSP", "S-GOPI", "S-PING"] },
    { id: "takeback", kicker: "2007, 2018, 2022", title: "Taking it back", body: "...", visual: "takebacks", sources: [...] },
    { id: "build", kicker: "Himalaya", title: "A loan and four blocks", body: "...", visual: "himalaya", sources: ["S-PJN"] },
    { id: "landlord", kicker: "Early 2010s", title: "IIIT the landlord", body: "...", visual: "leased", sources: ["S-FLOORPLANS"] },
    { id: "own", kicker: "Always", title: "What IIIT built for itself", body: "...", visual: "list", sources: ["S-PJN", "S-PRAB", "S-SRIDHAR"] },
    { id: "cut", kicker: "Undated", title: "A branch that was cut", body: "...", visual: "civil", images: ["img-39", "img-42", "img-43", "img-46", "img-40", "img-44"], sources: ["S-PHOTOS", "S-PROSP", "S-FLOORPLANS"] }
  ],
  corporateSchools: ["IBM School of Enterprise-wide Computing", "Oracle School of Advanced Software Technology", "Satyam School of Applied Information Systems", "Motorola School of Communication Technology", "Signal Tree School of Excellence in Software Development Methodologies", "CISCO Academy Training Centre"],
  himalaya: [
    { id: "C", name: "Block C", role: "Lecture halls and exam centre", funding: "Fitted out with IIIT's own money", color: "own" },
    { id: "A", name: "Block A", role: "Admin today", funding: "Fitted out with TalentSprint; IIIT bought it out in 2018", color: "partner" },
    { id: "KRB", name: "Kohli Research Block", role: "Research", funding: "Built with TCS", color: "partner2" },
    { id: "D", name: "Block D", role: "Research labs since 2022", funding: "T-Hub, the state's startup incubator, 2015 to 2022", color: "state" }
  ],
  loan: { amount: "22 crore rupees", today: "about 70 crore today", term: "10 years", repaid: "6 years", sources: ["S-PJN"] },
  leased: [ ["RGUKT", 20238], ["TalentSprint", 22260], ["Prudhvi (vacant)", 13902], ["SpectraForce", 4464], ["SBH (bank)", 2474], ["Milk & Water", 2331], ["Kidosoft", 1000], ["Xerox", 61] ]
};
```

---

## 6. Visual design

Direction: **an archive with a living tree in it.** Warm paper, ink, red-soil terracotta (the early photos are all red soil and saplings), banyan green. Archival details (paper texture via a subtle CSS gradient, typed labels, thin rules, document "stamps" for confidence) but clean and highly legible from 2 m. If the `frontend-design` skill is available, read it before styling.

Tokens (`base.css`, CSS custom properties). Check every text/background pair for WCAG AA contrast and adjust:
```
--paper: #F4EEE2;  --paper-2: #EAE1CF;  --ink: #26241F;  --ink-2: #5A554B;
--banyan: #2F5D3A; --leaf: #6E9B5A;     --soil: #A9502C; --ochre: #C9962E;
--slate: #3E5C76;  --plum: #6B4E71;     --teal: #2D7A78;
--ok: #2F7D4F;     --warn: #B7791F;     --todo: #8A8577;
category colours: buildings=soil, operations=slate, people=plum, trees=banyan, land=ochre, curriculum=teal
source type colours: oral=slate, document=soil, photo=teal, web=ink-2
```
Type: three OFL fonts are **vendored as local woff2 files** in `site/assets/fonts/` (loaded with `@font-face` from relative paths, so they work offline and on file://): **Fraunces** for headings, **Atkinson Hyperlegible** for body text (made for legibility, good at 2 m), **JetBrains Mono** for labels and dates. Fallbacks: `Georgia, serif` / `system-ui, sans-serif` / `ui-monospace, monospace`. Never link Google Fonts at runtime. Use the CSS variables `--font-display`, `--font-body`, `--font-mono` from `base.css`. Root font size `clamp(16px, 0.55rem + 0.6vw, 22px)`, so about 20 px on a 1920 monitor. Headline sizes large (`clamp(2.2rem, 4vw, 4.5rem)` on Start).

Layout: max content width 1600 px on monitors; generous margins. Everything clickable needs at least a 44 px target. Visible focus rings.

Motion: 150 to 400 ms ease-out for panels and cards; timeline panning uses `transform` on a GPU layer with rAF inertia; no motion when reduced motion is preferred.

Banyan illustration (`assets/img/banyan.svg`, Agent E): an original, simple, flat SVG: trunk, wide canopy, 4 to 6 aerial roots. On Start the 4 main roots are labelled and clickable (Borrowed Ground -> timeline, Borrowed Branches -> way, Moving Rooms -> map, How We Know -> how-we-know). Leaves can gently sway (CSS) unless reduced motion.

---

## 7. Page specs

Each page lists layout, interactions, data, kiosk behaviour and acceptance criteria (AC).

### 7.1 Start `#/start` (Agent E)
- Left: title "HISTREE", subtitle "How IIIT Put Down Its Own Roots", small line "Do You Know Your Institute? | Team CakedUp | UPDH". The 3-sentence argument (`context.md` section 2, trimmed to under 60 words).
- Right: the banyan SVG with 4 labelled roots as the route map.
- Bottom band: **fun-fact ticker**: one fact at a time from `M.facts` (shuffled), large text, source badge, optional thumbnail; changes every 8 s with a fade; arrows to step; pauses on hover.
- Quiz call to action: if `M.config.quizUrl` set, show a QR code (generate later; leave a fixed-size placeholder box with the text "Quiz QR here"); else "Ask a guide for a quiz card, or tap Quiz above".
- Kiosk: home of `entry`.
- AC: readable from 2 m at 1920x1080; ticker never shows a fact without a source; roots navigate correctly; works at 390 px (stacked).

### 7.2 Timeline `#/timeline` (Agent E): the centrepiece. Build it well.
- **Horizontal track**, 1995 to 2026 plus an "Undated" zone at the right end. Year ticks every year, bold every 5. Era bands behind the track (Founding 1998-2002, Growing 2003-2014, Taking back 2015-2022, Now 2023-2026) with labels.
- **Event cards** sit in lanes above and below the axis, grouped by category (one lane per category, or auto-stacked to avoid overlap; pick one approach and make sure nothing overlaps at 1920 px). Card: date label (monospace), title, category colour stripe, thumbnail if any, confidence stamp. Range events (`yearEnd`) render as a bar along the axis with the card at the start.
- **Navigation:** drag to pan (pointer events), mouse wheel / trackpad pans horizontally, arrow keys step to the previous/next event, era buttons jump with an eased scroll. Zoom: 2 levels (overview showing all years; detail with about 6 years per screen) via buttons and `+`/`-` keys. Panning must feel smooth: transform-based with inertia, 60 fps on a normal laptop with 60 events.
- **Filters:** chips: All, Buildings, Operations, People, Trees, Land, Curriculum, plus a toggle "Show where sources disagree" (highlights `contested` events, dims the rest). Filtered-out cards fade and collapse; the layout re-flows smoothly. Query params reflect the state (`?filter=buildings&era=founding`) so a monitor can be pointed at a filtered view.
- **Detail panel:** clicking a card opens a side panel (right, 40% width on monitors; full-screen sheet on phones): date, title, body, images (click -> lightbox), category, places (links to `#/map/<id>`), people (links to `#/voices/<id>`), source badges, confidence; if `conflictId`, a "Sources disagree" box linking to `#/how-we-know/<id>`. URL updates to `#/timeline/<eventId>` (deep-linkable). Prev/next buttons inside the panel.
- **Autoplay** (`?autoplay=1`, used by board1's home): pans to the era's first featured event, opens its panel, waits 9 s, moves to the next featured event in the era, loops through the era, then restarts. Any user input stops autoplay until the next idle reset.
- AC: all events render; no overlapping cards at 1920x1080 in either zoom; filter + era query params work on load; deep links open the right panel; autoplay runs for 10+ minutes without drift or leaks (check timers are cleared in destroy); usable on phone (vertical list fallback below 700 px wide: events grouped by era as a vertical timeline with the same filters).

### 7.3 Map `#/map` (Agent D)
- Base: the 2002 layout plan image, fit to the viewport, with pan (drag) and zoom (wheel/pinch, buttons) via CSS transform. Badge in the corner: "Campus layout plan, 2002 (62 acres). From SLN Shastry. North points down, as on the original."
- Hotspots: semi-transparent outlined rectangles over buildings with name labels (from `M.places`). Hover highlights; click opens the place panel (right side, as in the timeline) and sets `#/map/<placeId>`.
- **"Built after 2002" list** (left rail): places with no 2002 hotspot (Himalaya, Bakul Nivas, NAB, Felicity ground, amphitheatre, civil department). Click opens their panel. Where satellite sequences exist (NAB img-09..14, Bakul img-33..36, Felicity img-15..18, amphitheatre img-31..32), the panel shows a **stepper/slider through the sequence** (a mini flipbook) with "Satellite images, dates not shown on screenshots" (img-32 is 14 Mar 2018).
- **Then/now slider:** only if `assets/map/now.jpg` exists (check via an `<img>` onload/onerror). The "now" image overlays the plan; a range slider controls its opacity (0 = 2002, 100 = today). Alignment comes from `M.config.mapAlign = { scale, rotateDeg, x, y }`, editable with the dev picker. If the image is missing, hide the slider (in `?dev=1`, show a note "Add raw/map/current_campus.jpg and rerun build_assets.sh").
- **Journeys layer:** a toggle "Show how rooms moved" lists the 13 journeys; selecting one draws numbered stops on the map (only for stops whose place has a hotspot; others listed in the panel) connected by a dashed animated path, and shows the stop cards in the side panel.
- **Trees layer:** toggle "HISTREE" shows tree pins (Navjeevan's three positions joined by arrows: main road -> Bakul Nivas -> OBH; Bakul is not on the 2002 plan, so place that stop in the side list). Tree pin positions are approximate, so label them "approximate".
- **Dev picker** (`?dev=1`): clicking the map shows the x/y percent of the click and lets you drag out a rectangle that prints `{x, y, w, h}` to a copyable box and the console. This is how the team tunes hotspots in minutes.
- AC: all hotspots line up with their buildings on the plan (tune with the picker); panels deep-link; zoom and pan are smooth and bounded (can't lose the map off-screen); the journeys layer works for library, mess, sleep and Vindhya; works with a mouse only; on phones the panel becomes a bottom sheet.

### 7.4 The IIIT Way `#/way` (Agent F)
- Vertical scroll story, one chapter per screen-height section, from `M.way.chapters`. A left progress rail shows chapter names; the current one is highlighted. Arrow keys / PageUp / PageDown move between chapters; `#/way/<chapterId>` deep-links.
- Visuals per chapter (`visual` field):
  - `photos`: 2-3 images.
  - `schools`: the six corporate schools as "nameplates" over img-19; plus the prospectus page crop (p.3 partner list) and the Ping page-1 image as small documents (click -> archive viewer at that page).
  - `evidence`: three linked evidence cards for Govindarajulu (Gopi's account, prospectus profile on p.10, Ping mention), joined by a drawn line, ending in a "Corroborated" stamp.
  - `takebacks`: three dated "returned" stamps: Vindhya 2007, Block A 2018, Block D 2022.
  - `himalaya`: **interactive SVG of four blocks** (simple top-down rectangles roughly like the Himalaya layout, labelled C, A, KRB, D), coloured by funding (own / partner / state). Click a block to show its story; legend below; the loan facts as big numbers ("22 crore", "10 years given", "paid off in 6").
  - `leased`: a horizontal bar chart of leased sq ft (`M.way.leased`), built with plain SVG or CSS. If the `dataviz` skill is available, follow it. Label: "Undated floor-space survey, probably early 2010s."
  - `list`: icon list (servers in Nilgiri, self-hosted email, IMS 2017, fully online in 2020).
  - `civil`: dark-toned gallery of the civil photos with captions, plus a callout: prospectus "M.Tech in IT for Building Sciences (for architects and civil engineers)" and the floor-plan EERC/CASE Lab page (link to archive p.9). End with: "We couldn't find out when it closed. Do you know? Tell a guide."
- Autoplay (`?autoplay=1`): advance one chapter every 14 s, loop.
- AC: every chapter has a source line; the Himalaya diagram is the visual highlight; text follows the length limits; works on phones (chapters stack, diagrams scale).

### 7.5 HISTREE `#/histree` (Agent D)
- Short page: intro ("Even the trees were moved here and took root"), the 4 banyan cards + the neem, each with story, photos (or a "photo coming 14 Nov" tile) and sources. Navjeevan gets a small animated diagram of its 3 moves (three nodes and arrows; no map needed). Link: "See the trees on the map" -> `#/map?layer=trees`.
- Shows the name echo: Jagruthi the tree vs Jagruti the mascot.
- AC: works with zero tree photos; swapping in photos only needs edits to `trees.js`.

### 7.6 Voices `#/voices` and `#/voices/<personId>` (Agent F)
- Index: big header "7 people told us their IIIT" (count computed from data), consent line ("Everyone here agreed to be recorded and quoted."), grid of person cards (avatar or initials, name, role, years badge, one line). Sort by year joined (1998 first).
- Person page: header (avatar, name, role, years at IIIT), "What they told us" bullets (each linked to an event when possible), "On the timeline" (events from `M.util.eventsForPerson`, clickable), "Where their memory disagrees with others" (conflicts that cite them), then the **full transcript** from `M.transcripts` in a readable column with a search box that highlights matches. For PJN, show the "write-up, not word-for-word" note at the top.
- Gopi's page also shows the **phone-booth comic** (see 7.7).
- AC: every person page works; transcripts render with paragraphs; search highlights; the redactions in section 3 are applied; readable on phones.

### 7.7 Phone-booth comic (Agent F, inside Gopi's page and as a featured block on the timeline event e-1998-booth)
- v1: four panels built from HTML/CSS + simple original SVG figures (a booth, a phone, a faceless silhouette for the official, the Commodore as a figure with a peaked cap seen from behind), each with a caption from `context.md` section 7. Muted palette. The official is never named and never given a face.
- If the team scans a hand-drawn comic into `site/assets/comic/panel-1.jpg` ... `panel-4.jpg`, a flag `M.config.comicImages = true` swaps the SVG panels for the scans.
- Ends with photo img-29: "This is Gopi's room today. The booth stood here."

### 7.8 How We Know `#/how-we-know` (Agent F): our differentiator
- Intro (under 60 words): oral history depends on memory; memories disagree; we checked them against documents and photos, and against each other.
- **Section A, "Sources disagree":** conflict cards C1-C5 as flip cards. Front: question + "Who's right?" + the accounts as coloured speech blocks with source badges. Click to flip (3D flip, or a crossfade if reduced motion): "What we think" + "What would settle it". `#/how-we-know/C1` opens with that card flipped and scrolled into view.
- **Section B, "Checked and confirmed":** V1-V7 as evidence chains: horizontal sequence of nodes (oral / photo / document icons) joined by a line, each node with a short text and thumbnail; ends with a green "Corroborated" stamp.
- **Section C, "We got it wrong":** the correction card, styled like a corrected proof (strike-through on the "before" text, the "after" written beside it).
- **Section D, "How we worked":** 4 short bullets: we interviewed 7 people; we asked consent; we cross-checked memories against the prospectus, the 2002 plan, the floor plans and photos; we're publishing what we found so others can add to it (link to Archive). Keep the course language light: "shared authority" can appear once.
- AC: all cards flip with mouse and keyboard (Enter/Space); every account has a source badge; deep links work.

### 7.9 Archive `#/archive` (Agent B)
- Grid of document tiles (cover thumbnail, title, date, one-line description): Prospectus c.2001; Lab floor plans + floor-space tables (undated, probably early 2010s); Campus layout plan 2002; Ping "Echoes" library article (c.2016); Curriculum highlights (the 3 screenshots); Photo archive (all images grouped by caption section: early campus stills, satellite sequences, corporate schools, guest house, Saranga Hall, civil department, artefacts, uncaptioned civil photos); Interview transcripts (links to Voices).
- **Document viewer** `#/archive/<docId>/<page>`: big page image with zoom/pan, thumbnail strip, page note (from `documents.js`), prev/next, keyboard arrows. Highlights: for the prospectus, a "Curriculum as a period piece" note on pp. 4-6 with the dot-com electives, the Sanskrit strand (Vedanta, Navya-Nyaya, Panini's Ashtadhyayi) and the research centres (IT for Railways, IT for Indian Society).
- **Contribute** card at the top: "This archive should outlive our exhibit. We plan to put these files on Wikimedia Commons and the Internet Archive so anyone can add to them. Have an old photo, document or memory of IIIT? Tell a guide or write it on the wall." (No upload feature in v1.)
- AC: all 27 floor-plan pages and 11 prospectus pages viewable and zoomable; photo gallery opens the lightbox; works offline.

### 7.10 Quiz `#/quiz` (Agent F)
- Phone-first single column (also fine on monitors). Start screen: "8 questions. Take it now, then again at the exit." Toggle: "This is my first try" / "I'm back after the exhibit".
- One question per screen, big tap targets; after an answer: show right/wrong, the explanation and source badge, "Next".
- End: score, and if a first-try score is stored (localStorage, try/catch), "You went from 3 to 7". Button "Explore the answers" -> the linked timeline events.
- AC: playable with keyboard and touch; never crashes without localStorage; questions match the paper cards exactly.

### 7.11 Then and Now (ending) `#/ending` (Agent E)
- Title "Every generation here thought it had run out of room." Rows from `M.ending.rows` reveal one by one (staggered fade-in on load, all visible at once if reduced motion): when, problem, how it got solved, source badges.
- Then the "now" block with img-14 (NAB site) and text; then the prompt "Which problem on campus today will be a story in ten years? Add it to the wall." Thank-you line with all interviewees' names.
- Kiosk: home of `exit`; replays the reveal after each idle reset.
- AC: readable from 2 m; every row sourced.

---

## 8. Content writing rules for agents (Agent C mainly, but everyone writing copy)
- Facts only from `context.md` and `sources/`/`raw/`. If you need something that isn't there, write `TODO(team): ...` in a `todo` field, not in visible text.
- Student voice, short sentences, no em dashes, no AI tells (see `context.md` section 4). Read each string as if a first-year will read it from 2 m away.
- Paraphrase the PJN dossier; never quote it as his words. Direct quotes only from transcript text, marked with quote marks and the source.
- Don't show: the sensitive sentence removed from Sridhar's interview; any name for the official in the bribe story; the "summer interns" claim; "Himalaya had no corporate involvement".
- Conflicts are shown fairly: no side is mocked; "our take" stays humble.

---

## 9. Build order and cut line

**P0 (must be on the monitors):** Foundation (router, kiosk, nav, UI), assets, sources/people/events data, Start, Timeline, Map (2002 plan + hotspots + panels), The IIIT Way, Voices (+ transcripts), How We Know.
**P1:** Archive viewer, Quiz, Then and Now, journeys layer on the map, Himalaya interactive diagram polish, autoplay modes.
**P2:** HISTREE page, trees layer, then/now slider (needs the team's current map image), comic SVG panels, dev picker extras, phone polish.

If time runs out, ship P0 and hide the nav links for unfinished pages (`nav: false`).

---

## 10. Work split and file ownership (2 sessions, 60/40)

Each session edits **only its own files**. Need something from the other side? Append a line to `HANDOFF.md` (see `CLAUDE.md`). `TASKS.md` mirrors this table with live status.

### aakarsh-claude (about 60% of the site + the physical boards)
| Area | Files |
|---|---|
| Repo, coordination, asset pipeline | `CLAUDE.md`, `TASKS.md`, `.gitignore`, `.gitattributes`, `scripts/build_assets.*`, `scripts/gen_*.py`, `site/assets/**` (except `site/assets/img/silhouette.svg` and comic files), `site/data/images.js`, `site/data/transcripts.js` |
| Foundation | `site/index.html`, `site/css/base.css`, `site/css/components.css`, `site/js/core/*` (+ `site/js/core/README.md`), `site/data/config.js`, `site/assets/fonts/*`, `scripts/check.mjs`, `scripts/screenshot.mjs`, `README.md` |
| Core data | `site/data/sources.js`, `people.js`, `events.js`, `facts.js`, `places.js`, `journeys.js`, `trees.js` |
| Pages | Start (`start.js/.css`, `assets/img/banyan.svg`), **Timeline** (`timeline.js/.css`), **Map** (`map.js/.css`) |
| Physical boards | `print/**` (section 14) |

### saharsh-claude (about 40% of the site)
| Area | Files |
|---|---|
| Story + evidence data | `site/data/way.js`, `conflicts.js`, `verified.js` (also holds `M.correction`), `quiz.js`, `ending.js`, `documents.js` |
| Pages | **The IIIT Way** (`way.js/.css`, Himalaya diagram), **Voices** + person pages + phone-booth comic (`voices.js/.css`, `assets/img/silhouette.svg`, `assets/comic/*`), **How We Know** (`howweknow.js/.css`), **Archive** + document viewer (`archive.js/.css`), **Quiz** (`quiz.js/.css`), **Then and Now** (`ending.js/.css`), **HISTREE** page (`histree.js/.css`; reads `M.trees`, owned by aakarsh) |

### Old agent letters
Sections 2 to 7 still say "Agent A" to "Agent F". Read them as: A, B (pipeline), C (sources/people/events/facts), D (map, places, journeys, trees), E (start, timeline) = **aakarsh-claude**; B (archive, documents.js), C (way, conflicts, verified, quiz, ending), D (HISTREE page only), E (ending page), F = **saharsh-claude**. The tables above win if anything disagrees.

### Order and dependencies
- saharsh-claude can start **immediately** on its data files (`way.js`, `conflicts.js`, `verified.js`, `quiz.js`, `ending.js`, `documents.js`): the schemas are in section 5 and the facts are in `context.md`. `M.sources` IDs are exactly the IDs in `context.md` section 6; `M.people` IDs are in `context.md` section 5; event IDs follow `e-<year>-<slug>` and the seed IDs in 5.3 are guaranteed to exist.
- Page work starts once aakarsh-claude posts **"foundation pushed"** in `HANDOFF.md` (router, kiosk, nav, `M.ui.*` helpers, page stubs, `sources.js`, `people.js`, seed events). Until then, page code can be written against the contract in section 4 and the helper list in 4.5.
- Suggested saharsh order: data files, How We Know, Voices (+comic), The IIIT Way, Quiz, Then and Now, Archive, HISTREE.
- Suggested aakarsh order: foundation, core data, Start, Timeline, Map, physical boards, integration.
- Both run `node scripts/check.mjs` before every push and `git pull --rebase` before every commit.

## 11. Checks and QA (Agent A writes the script; the integration pass runs everything)

`scripts/check.mjs` (Node, no dependencies): load every `site/data/*.js` in a `vm` context with a `window` object, then:
1. Unique IDs within each collection.
2. Every `sources` entry exists in `M.sources`; every `images` entry exists in `M.images` **and** its `file`/`thumb` exists on disk; every `places`/`people`/`conflictId`/`eventId` reference resolves.
3. Every event, fact, quiz question, conflict account, verified node, journey stop, ending row and way chapter has at least one source.
4. Quiz: `answer` is a valid index.
5. **No U+2014 (em dash)** in any string in `site/data/*.js`, or in text in `site/index.html` and `site/js/pages/*.js`. Also flag U+2013 used as a dash between words.
6. Warn (don't fail) on: titles > 70 chars, summaries > 30 words, bodies > 120 words; strings containing "TODO"; banned words list (delve, tapestry, testament, rich history, vibrant, nestled, in conclusion).
7. Print a summary: counts of events per era/category, contested events, todo items.

Manual/visual QA:
- Open `site/index.html` by double-click (file://) in Chrome: no console errors on any route.
- `?screen=board1` ... `?screen=exit`: correct home; idle return after 90 s (temporarily set `idleSeconds` to 10 to test); "Back to board" pill works.
- 1920x1080 and 1366x768: nothing overflows, text readable at 2 m. 390x844: quiz and voices fully usable.
- Keyboard: number keys, F, H, Esc, arrows on timeline, way and archive viewer.
- Autoplay pages left running 15 minutes: no slowdown (check timers/listeners cleaned up on route change).
- `scripts/screenshot.mjs` (optional, needs Playwright): screenshot every route at both sizes into `qa/` for review.
- Final read of all visible copy against `context.md` section 4 and section 10 (nothing from the "do not show" list appears).

---

## 12. Exhibit-day setup (for the README)
- Copy `site/` to each laptop (USB). Open in Chrome: `file:///.../site/index.html?screen=board2` (and so on per monitor). Press F (or F11) for fullscreen.
- Disable sleep and screen saver; plug in power; attach a mouse.
- Keep one spare laptop with the site open as a backup.

## 13. Later (not v1): hosting
- `site/` is already static, so GitHub Pages works by pointing it at `/site` (or copying `site/` to a `gh-pages` branch).
- Then set `M.config.quizUrl`, generate the QR (`python -m qrcode` or any offline QR library, saved as `site/assets/img/quiz-qr.png`) and print it for the entry board and voices cards.
- The course guest lecture's advice: also upload the archive files (with permissions) to Wikimedia Commons / Internet Archive and link them from the Archive page.

---

## 14. Physical boards as print files (aakarsh-claude)

The team builds cardboard/softboard boards by hand from printed sheets. We generate those sheets from the **same data files as the site** so the boards and screens never disagree.

- `print/boards.html`: loads `../site/data/*.js` with classic script tags and lays out every printable item with CSS `@page` sizes. Sections: title board, 4 board headers + panels (A3), comic captions (A4), journey cards (A5), voices cards (A5), conflict flip cards (A4, front + inside), verified + correction cards (A4), timeline game cards (A6, front/back), quiz cards (A5), exit wall panel (A2). Each item shows a cut size, and a small footer with the board it belongs to.
- `print/layout.html`: a to-scale plan of each board (what goes where, sizes in cm), one page per board, so the team can lay out softboards in minutes.
- `print/build.sh`: headless Chrome `--print-to-pdf` per section into `print/pdf/*.pdf` (A3 panels, A4 cards, A5 cards etc. as separate PDFs so each prints at the right size).
- Text limits follow `context.md` section 4 (board header < 60 words, panel < 120, card < 30) and every item carries its source line.
- Plan for **2 or 3 monitors** (section 4.4): boards reference the monitor next to them ("Try it on the screen: find the library's three homes").

## Review notes
- Split changed from 6 or 3 agents to 2 sessions, 60/40 (section 10); ownership mirrored in `TASKS.md`; coordination protocol in `CLAUDE.md`.
- Monitors: planned for 2 or 3, with idle playlists per screen (4.4). Screen ids changed (`history`, `map`, `evidence`, or `left`/`right`).
- Asset pipeline is Python (Pillow + poppler) because ImageMagick isn't on the build machine: `scripts/build_assets.py` (wrapped by `build_assets.sh`). PDF pages are exported as **`p-NN.jpg`** (not png) at 150 dpi (prospectus, Ping) and 110 dpi (floor plans), thumbs in `thumb/p-NN.jpg`. Prospectus embedded photos: `assets/docs/prospectus/img/ximg-01..07.jpg`. Map base `assets/map/plan-2002.jpg` is 1280x1152 (the original scan is small; that's the max).
- `raw/interviews_corpus/` and its zip are **not in git** (privacy). Extra photos derived from them (`img-x01`, `img-c01..c12`) are already exported to `site/assets/photos/` and listed in `images.js`.
- The sensitive sentence in Sridhar's interview is removed at source (transcript, context.md, this file). Generators also normalise em/en dashes and curly quotes so the check passes.
- `M.images` entries also carry `w`, `h` and `group` (archive grouping key: early, satellite, corporate, guesthouse, saranga, civil, artefacts, civilraw).
- `M.transcripts[id]` is `{ title, sourceFile, note, paras: [string] }` (paragraphs, not one text blob). Lines with runs of 3+ spaces are table rows from the PJN dossier; render them in monospace with `white-space: pre-wrap`.
- Fonts: vendored woff2 (section 6) instead of system fonts only.
- Added section 14 (physical boards as print files, generated from the site data).
