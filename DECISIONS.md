# Decisions and assumptions, 14 Nov (morning round)

Aakarsh asked for a lot of changes overnight and said not to wait for answers. These are the calls aakarsh-claude made without asking. Undo any of them by telling a Claude session in this repo.

## Names and text
- The project is called **Do You Know Your Institute?** everywhere: the site header and tab title, the Start page, README, CLAUDE.md and context.md. **HISTREE** is only the trees page (`#/histree`), the trees layer on the map and the trees board sheet.
- Visitor text on my pages is cut to one line of context per screen. Details sit behind a click: the timeline panel, map panels, journey steps.
- Speaker notes live in `site/data/notes.js`. Press **N** on any page to show or hide them. They are hidden by default, and an idle monitor always turns them off. There is a printable copy in `print/pdf/Speaker-notes_A4.pdf` (saharsh-claude builds it).

## Nav and monitors
- **Nav order** is in `M.config.nav` (config.js): Timeline, Old campus, The IIIT Way, Buildings, Map, HISTREE, How we know, Voices, Archive, Quiz. The logo goes to Start. **Then and now** (`#/ending`) is off the nav, because the exit wall is out of the final layout. It's still in the tour and at `#/ending`.
- **4 monitors, one per board:**
  - `?screen=board1` shows the old photos slideshow.
  - `board2` shows the buildings time-lapse.
  - `board3` shows the map only. I took the trees page out of its rotation because it still shows "photo coming" tiles.
  - `board4` shows How we know, plus the tour.
  - The old ids (history, map, evidence, left, right) are gone.
- **Idle behaviour:**
  - After 90 s with no input, a screen goes back to its home view.
  - The idle timer only starts once someone touches the screen, so a monitor left on its home view never restarts itself.
  - A running tour is never cut off by idle. A tour left alone for 10 minutes ends.
- **Website tour (Board 4):** 6 steps: Start, Himalaya (`#/way/build`), the library journey on the map, How we know, Then and now, Quiz. Press T to start. Next/Back buttons, a clicker's PageDown/PageUp, or `]` and `[` step it. I cut it from 11 steps because the prof gets about 2 minutes.

## Slideshows
- **Board 1 (`#/photos`)**: every captioned old photo of the campus we have. That's photos 01-08 and 19 plus the five campus photos printed in the prospectus. The two portraits from the prospectus are left out.
  - Small prospectus photos are paired two to a slide so they aren't blown up. Nothing is shown at more than 2.2x its real size.
  - The black video bars on the 20-year-video stills are cropped off.
  - 11 slides at 7.5 s each, about 82 s per loop.
- **Board 2 (`#/buildings`)**: NAB (6 frames), Bakul Nivas (4), Felicity ground (4), amphitheatre (2), each in the order of the photo numbers, which I took as oldest to newest.
  - No years are shown, because only one frame has a readable date.
  - Frames are zoomed in a little to push Google's map labels to the edges. Some labels may still show; they're credited as Google Earth screenshots.
  - About 60 s per loop.
- On the monitors (kiosk mode) the slideshows hide the nav and the mouse cursor. A mouse nudge never stops them; Space pauses.

## Map
- **The morph:** your Google Earth screenshot is warped into the frame of the 2002 plan, so the two line up and every hotspot and journey works on both.
  - Four landmarks were used: OBH's cross, Nilgiri, the field behind it, and the main road / ISB road junction. The error is under 8 px. Script: `scripts/map/align_satellite.py`.
  - Google's labels and pins are painted out of the image.
  - **North is down**, as on the 2002 plan, so the satellite view is turned upside down compared with Google Maps.
  - The page opens on the 2002 plan and fades into today about a second later. `?view=2002` keeps it on the plan.
- **Newer buildings traced by eye** on the satellite: NAB, Bakul Nivas, Felicity ground. Treat them as approximate.
- **Himalaya** is drawn on the old "play ground with a dais" from the 2002 plan. That's an inference from the cricket-ground journey ("a cricket ground became Himalaya"), and the outline is approximate.
- The **amphitheatre** isn't placed on the map; I couldn't find it on the screenshot.
- On today's view, "Play grounds" and "Faculty Quarters" (2002 only) are hidden, because NAB and Himalaya stand there now.
- All 13 journeys were checked one by one: every stop that has a place gets a marker, and none of the markers end up under the side panel.

## Look ("un-AI-slop")
- The old look was the stock "tasteful AI" style: cream + terracotta + Fraunces, all-caps mono labels, middle dots, arrows on buttons, cards with coloured stripes, fade-up on everything.
- The new look is grounded in the 2002 layout plan:
  - Colours: plan white, IIIT logo navy, the logo's green, plan blue for links, and red ink only for "sources disagree" and corrections.
  - Font: **Archivo** (open licence, vendored, works offline), set narrow and heavy for headings and normal width for text.
- Sources: Anthropic's frontend-design skill and github.com/funboy322/avoid-ai-design.
- **The old look is always one click away:** add `?look=classic` to the URL, or restore the files from git tag `look-v1-before-unslop`.
- The Start page logo is a flat, blue, round IIIT badge built from the official logo. It spins all the time; drag or click to spin it yourself.

## Housekeeping
- The laptop has a temporary 6-hour block on sleep and lid-close suspend (`systemd-inhibit`). It ends by itself and changes no settings.
- Some `HANDOFF.md` lines from aakarsh-claude this morning have times about 2 hours ahead of the real clock. The order of the lines is right; the times aren't.

## Open questions for the team
- **Consent:** saharsh-claude published the site at saha264.github.io/iiith-popup-museum (the QR codes point there). It serves the 7 full transcripts and 3 headshots taken from public profiles. context.md still lists consent for both as a TODO. If the answer is no, delete `site/assets/img/people/*` (initials take over) and hide the full transcripts in the hosted copy.
- **4 laptops:** do we have them? With fewer, Board 4's tour can run on any laptop: press T.
- **Morning photos:** the banyans, the granite floor, Jagruthi today. Drop them in `raw/` or `boards/img/add/` and the boards and HISTREE page fill in.
