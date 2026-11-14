/* config.js: site settings and the monitor screens. Owner: aakarsh-claude (A2). See IMPLEMENTATION_PLAN.md 4.4. */
window.M = window.M || {};
M.config = {
  title: "Do You Know Your Institute?", subtitle: "IIIT Hyderabad, 1998 to today",
  team: "Team CakedUp", course: "UPDH, IIIT Hyderabad", date: "14 November 2026",
  idleSeconds: 90,
  quizUrl: null,        // set when hosted (GitHub Pages); while null the site says "Ask a guide for a quiz card"
  mapAlign: { scale: 1, rotateDeg: 180, x: 0, y: 0 },
  // Top nav, in board order (Start is the logo; Then and now stays reachable from the tour and the quiz).
  nav: ["timeline", "photos", "way", "buildings", "map", "histree", "how-we-know", "voices", "archive", "quiz"],
  // 4 monitors, one per board (context.md 14). Open site/index.html?screen=board1 (etc.) on each laptop, press F.
  // After idleSeconds with no input a screen goes back to playlist[0]; with more than one item it moves on after `secs`.
  screens: {
    board1: { label: "Monitor 1: Board 1, Setting the scene", short: "the old photos", home: "#/photos",
              playlist: [ { route: "#/photos", secs: 0 } ] },
    board2: { label: "Monitor 2: Board 2, The IIIT Way", short: "the buildings", home: "#/buildings",
              playlist: [ { route: "#/buildings", secs: 0 } ] },
    board3: { label: "Monitor 3: Board 3, Institutional changes", short: "the map", home: "#/map?autoplay=1",
              playlist: [ { route: "#/map?autoplay=1", secs: 0 } ] },
    board4: { label: "Monitor 4: Board 4, How we know", short: "how we know", home: "#/how-we-know?autoplay=1", tour: true,
              playlist: [ { route: "#/how-we-know?autoplay=1", secs: 0 } ] },
    entry:  { label: "Entry (spare screen)", short: "the start", home: "#/start" }
  }
};
