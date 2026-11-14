# Do You Know Your Institute?

Pop-up museum website for Team CakedUp's UPDH project "Do You Know Your Institute?" (IIIT Hyderabad, exhibition on 14 November 2026).

## Open it
- Double-click `site/index.html` (Chrome). No internet or server needed.
- Exhibit monitors: 4, one per board. Laptops can't plug into the screens, so phones cast to them (see "On the day" below). Open the page with the screen id, then press `F` or tap Full screen:
  - Board 1: `site/index.html?screen=board1` (old campus photo slideshow, `#/photos`)
  - Board 2: `site/index.html?screen=board2` (buildings growing, satellite time-lapse, `#/buildings`)
  - Board 3: `site/index.html?screen=board3` (the map: the 2002 plan fading into today, journeys)
  - Board 4: `site/index.html?screen=board4` (How we know; press `T` for the website tour)
  - After 90 s with no input a screen goes back to its home view.
- Keys: `1`-`9`, `0` jump between pages, `F` fullscreen, `H` home, `Esc` closes panels, `T` website tour (PageDown/PageUp or a clicker steps it), `N` speaker notes. `?dev=1` shows dev helpers.

## On the day: phone casting and hosting (14 Nov)
The IT dept says the screens can't take HDMI from a laptop; we cast a phone to them instead. Board 4 is a vertical standee. So each screen is a phone that opens the live site and mirrors itself to the screen.

**Live site (already up):** https://saha264.github.io/iiith-popup-museum/ (GitHub Pages from Saharsh's fork; the quiz QR code points here).
- Screen links: add `?screen=board1` ... `?screen=board4` to that address, e.g. `https://saha264.github.io/iiith-popup-museum/?screen=board4`.
- **It does not follow `main` by itself.** `pages.yml` asks for a run every 15 minutes, but GitHub hardly runs the fork's schedule (one scheduled run on 14 Nov, at 06:53 UTC). After the last push of the day, Saharsh opens github.com/Saha264/iiith-popup-museum > Actions > Publish site > Run workflow. The job pulls `main` first and the site is live about 2 minutes later.
- Pages lets browsers cache files for 10 minutes, so reload the phones about 10 minutes after the publish.

**Each phone, before casting**
1. Plug it into a charger or power bank. Turn on Do Not Disturb (notifications show up on the big screen too) and turn off battery saver.
2. Lock the rotation: portrait for the Board 4 standee, landscape for the Board 1-3 monitors.
3. Open the screen link in Chrome and tap **Full screen** in the top bar. That button only shows on touch screens; the address bar disappears once it's tapped. On an iPhone use Share > Add to Home Screen and open it from the icon instead (iPhones can't go full screen from a web page).
4. The page keeps the phone awake while it's open (only on the https site). Still set the screen timeout to the longest option as a backup.
5. Start casting from the quick settings: Smart View, Screen cast or Cast, whichever the screen supports (Miracast, Google Cast, or the screen's own app). An iPhone needs an AirPlay receiver.
6. Board 4: the **Tour** button in the top bar starts the 6-step website tour; Next and Back are in the tour bar. The guide talks while watching the big screen. Left alone, a screen goes back to its home view after 90 s; a tour left alone ends after 10 minutes.

**What the standee will show**
- A phone is about 20:9 and the standee is 16:9 turned upright, so a mirrored phone leaves bars at the sides. No page layout can fix that.
- If the standee has its own browser (most Android standees do), open the Board 4 link there instead. Then no phone is needed, there are no bars, and the site's 1080 x 1920 layout fills the screen (`site/css/portrait.css`).
- If the "standee" is an ordinary TV turned on its side, a portrait phone will show up sideways. Use the TV's rotation setting if it has one, otherwise ask IT for a screen that takes portrait input.

**If the internet is down:** a laptop with this repo serves it over its own hotspot. Run `cd site && python3 -m http.server 8000`, connect the phones to the hotspot, and open `http://<laptop IP>:8000/?screen=board4` (`hostname -I` or `ipconfig` shows the IP). Campus Wi-Fi often blocks phone-to-laptop traffic, so use the hotspot. On plain http the keep-awake doesn't work, so set the screen timeout by hand.

## Work on it
- Claude sessions: read `CLAUDE.md` first (it is loaded automatically). Claims are in `TASKS.md`, messages in `HANDOFF.md`.
- Facts: `context.md` (single source of truth). Build plan: `IMPLEMENTATION_PLAN.md`. UI helpers: `site/js/core/README.md`.
- Check before committing: `node scripts/check.mjs`
- Rebuild images after changing `raw/`: `bash scripts/build_assets.sh` (needs Python 3 + Pillow + poppler).
- Physical board print files: `print/` (PDFs in `print/pdf/`).
