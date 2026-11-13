/* config.js: site settings and the monitor screens. Owner: aakarsh-claude (A2). See IMPLEMENTATION_PLAN.md 4.4. */
window.M = window.M || {};
M.config = {
  title: "HISTREE", subtitle: "Do You Know Your Institute?",
  tagline: "How IIIT Put Down Its Own Roots",
  team: "Team CakedUp", course: "UPDH, IIIT Hyderabad", date: "14 November 2026",
  idleSeconds: 90,
  quizUrl: null,        // set when hosted (GitHub Pages); while null the site says "Ask a guide for a quiz card"
  comicImages: false,   // true once scans exist in assets/comic/panel-1.jpg ... panel-4.jpg
  mapAlign: { scale: 1, rotateDeg: 180, x: 0, y: 0 },
  // 2 or 3 monitors. After idleSeconds with no input a screen goes to playlist[0], stays `secs`, then moves on, looping.
  screens: {
    history:  { label: "Monitor 1: Boards 1 and 2", short: "the timeline", home: "#/timeline?autoplay=1",
                playlist: [ { route: "#/timeline?autoplay=1", secs: 150 }, { route: "#/way?autoplay=1", secs: 120 } ] },
    map:      { label: "Monitor 2: Board 3", short: "the map", home: "#/map?autoplay=1",
                playlist: [ { route: "#/map?autoplay=1", secs: 180 }, { route: "#/histree", secs: 40 } ] },
    evidence: { label: "Monitor 3: Board 4 and exit", short: "how we know", home: "#/how-we-know?autoplay=1",
                playlist: [ { route: "#/how-we-know?autoplay=1", secs: 120 }, { route: "#/voices", secs: 40 }, { route: "#/ending", secs: 60 } ] },
    left:     { label: "Monitor A: Boards 1 and 2", short: "the timeline", home: "#/timeline?autoplay=1",
                playlist: [ { route: "#/timeline?autoplay=1", secs: 150 }, { route: "#/way?autoplay=1", secs: 120 } ] },
    right:    { label: "Monitor B: Boards 3 and 4", short: "the map", home: "#/map?autoplay=1",
                playlist: [ { route: "#/map?autoplay=1", secs: 150 }, { route: "#/how-we-know?autoplay=1", secs: 120 }, { route: "#/ending", secs: 50 } ] },
    entry:    { label: "Entry", short: "the start", home: "#/start" }
  }
};
