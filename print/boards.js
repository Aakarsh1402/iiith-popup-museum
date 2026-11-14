/* boards.js: builds the older printable sheets from the site's data. Written by aakarsh-claude (A7); owned by saharsh-claude since S11.
   The final layout's sheets are in boards/board-sheets.pdf (context.md 14). Every sheet here that they replace, or that is
   not in the final layout, prints with a banner saying so (see STATUS at the bottom). The comic and the Board 4 cards are gone.
   ?only=a3p (or a2p, a3l, a4p, a4l, a5p, a6l, layout) renders just that size, for print/build.sh. */
(function () {
  "use strict";
  var M = window.M;
  var ONLY = new URLSearchParams(location.search).get("only");
  var BOARD = { w: 120, h: 90 };   // softboard size in cm (TODO(team): confirm)
  var root = document.getElementById("root");
  var SIZES = { a2p: [42, 59.4], a3p: [29.7, 42], a3l: [42, 29.7], a4p: [21, 29.7], a4l: [29.7, 21], a5p: [14.8, 21], a5l: [21, 14.8], a6l: [14.8, 10.5] };
  var layoutItems = {};   // board -> [{label, size, color}]

  function el(tag, attrs) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      var v = attrs[k]; if (v == null || v === false) return;
      if (k === "class") n.className = v; else if (k === "style") Object.keys(v).forEach(function (s) { if (s.indexOf("--") === 0) n.style.setProperty(s, v[s]); else n.style[s] = v[s]; });
      else if (k === "text") n.textContent = v; else n.setAttribute(k, v);
    });
    for (var i = 2; i < arguments.length; i++) add(n, arguments[i]);
    return n;
  }
  function add(n, c) { if (c == null || c === false) return; if (Array.isArray(c)) return c.forEach(function (x) { add(n, x); }); n.appendChild(c instanceof Node ? c : document.createTextNode(String(c))); }
  function img(id) { var im = (M.images || []).filter(function (x) { return x.id === id; })[0]; return im; }
  function photo(id, cap) { var im = img(id); if (!im) return null; return el("figure", { class: "photo-fig", style: { margin: 0 } }, el("div", { class: "photo", style: { height: "100%" } }, el("img", { src: "../site/" + im.file, alt: "" })), cap === false ? null : el("figcaption", null, cap || im.caption)); }
  function src(ids) {
    var names = (ids || []).map(function (id) { return (M.sources[id] || {}).short || id; });
    return el("div", { class: "src" }, el("b", null, names.length > 1 ? "Sources: " : "Source: "), names.join("; "));
  }
  function sheet(size, board, label, color, cls) {
    var s = el("section", { class: "sheet " + size + " " + (cls || ""), style: { "--c": color || "var(--soil)" } });
    s.appendChild(el("div", { class: "foot" }, el("span", null, board + "  |  " + label), el("span", null, size.toUpperCase().replace("P", " portrait").replace("L", " landscape") + "  |  Do You Know Your Institute?, Team CakedUp")));
    (layoutItems[board] = layoutItems[board] || []).push({ label: label, size: size, color: color });
    if (!ONLY || ONLY === size) root.appendChild(s);
    return s;
  }
  function byId(list, id) { return (list || []).filter(function (x) { return x.id === id; })[0]; }

  var C = { b1: "#A9502C", b2: "#85600F", b3: "#2F5D3A", b4: "#3E5C76", exit: "#6B4E71", table: "#2D7A78" };

  /* ================= title board ================= */
  (function () {
    var s = sheet("a2p", "Entry", "Title board (print at A2, or scale up to 2 x 3 ft)", C.b1, "title-board");
    var roots = [["Board 1", "Setting the scene", C.b1], ["Board 2", "The IIIT Way", C.b2], ["Board 3", "Institutional changes", C.b3], ["Board 4", "How we know", C.b4]];
    add(s, [
      el("div", { class: "top" }, el("div", { class: "kick" }, "A pop-up museum by Team CakedUp"), el("img", { class: "coin-img", src: "../site/assets/img/iiit-badge.png", alt: "" })),
      el("h1", { class: "title-long" }, "Do You Know Your Institute?"),
      el("div", { class: "sub" }, "How IIIT put down its own roots"),
      el("p", { class: "arg" }, "IIIT's logo is a banyan. A banyan often starts out leaning on another tree, then drops roots of its own until it can stand by itself. ", el("b", null, "IIIT grew the same way."), " It began in borrowed government buildings, with borrowed teachers and company schools in its classrooms. Over 25 years it took those spaces back and built its own."),
      el("div", { class: "tree" }, el("img", { src: "../site/assets/img/banyan-color.png", alt: "" }),
        roots.map(function (r, i) { return el("div", { class: "root-label", style: { "--c": r[2], left: (2 + i * 93) + "mm" } }, el("b", null, r[0]), el("span", null, r[1])); })),
      el("div", { class: "bottom" },
        el("div", { class: "team" }, el("b", null, "Team CakedUp"), el("br"), "Aakarsh Mishra, Soham Chatterjee, Yogesh Krishna, Siddharth Choudhary, Saharsh", el("br"), "UPDH (Understanding Public and Digital History), IIIT Hyderabad, 14 November 2026"),
        el("div", { class: "qr qr-live" }, el("img", { src: "../boards/img/qr-quiz.svg", alt: "QR code for the quiz" }), el("span", null, "Scan for the full quiz")))
    ]);
  })();

  /* ================= board headers ================= */
  var HEADERS = [
    { board: "Board 1", n: "1", title: "Setting the scene", years: "1998 to 2002", color: C.b1, q: "Where do you start a college when you don't have a building?",
      intro: "In 1998 IIIT had land, two old government buildings and 49 students. No hostels and no degree yet. This board is about those first years, when almost everything IIIT used was borrowed from someone else.",
      screen: "On the screen: old photos of the campus.", img: "img-04", sources: ["S-PJN", "S-GOPI"] },
    { board: "Board 2", n: "2", title: "The IIIT Way", color: C.b2, q: "Borrow, share, take back, build your own.",
      intro: "IIIT let company schools into its classrooms, rented space to tenants, lent a whole building to the state, and then took the space back. When it built Himalaya it borrowed the money and paid it off early. Look for the same pattern in every panel.",
      screen: "On the screen: how the buildings grew, seen from above.", img: "img-19", sources: ["S-PJN", "S-PROSP", "S-FLOORPLANS"] },
    { board: "Board 3", n: "3", title: "Institutional changes", color: C.b3, q: "Did you know the library has moved twice?",
      intro: "Rooms at IIIT don't stay put, and neither does the way it runs. The library and the big lecture hall moved, paper files gave way to IMS, and even the banyans were moved.",
      screen: "On the screen: the map. Pick a journey.", img: "img-50", sources: ["S-LAYOUT2002", "S-MURALI", "S-RAJAN", "S-SLN"] }
  ];
  HEADERS.forEach(function (h) {
    var s = sheet("a3l", h.board, "Board header", h.color, "header-sheet");
    add(s, [el("div", { class: "band" }), el("div", { class: "num" }, h.n),
      el("div", null, el("div", { class: "kicker" }, h.board + (h.years ? "  |  " + h.years : "")), el("h1", null, h.title), el("div", { class: "q" }, h.q),
        el("p", { class: "intro" }, h.intro), el("div", { class: "screen" }, h.screen)),
      el("div", { class: "side" }, el("div", { class: "photo", style: { height: "150mm" } }, el("img", { src: "../site/" + img(h.img).file, alt: "" })), el("div", { class: "cap" }, img(h.img).caption))]);
  });

  /* ================= panels (A3 portrait unless noted) ================= */
  function panel(size, board, color, o) {
    var s = sheet(size, board, o.label || o.title, color, "panel");
    add(s, [el("div", { class: "band" }), el("div", { class: "kicker" }, o.kicker || board), el("h2", null, o.title),
      o.lede ? el("div", { class: "lede" }, o.lede) : null,
      o.photosTop ? el("div", { class: "photos " + (o.photosTop.length > 1 ? "two" : "one") }, o.photosTop.map(function (p) { return photo(p); })) : null,
      o.body ? el("div", { class: "body" }, [].concat(o.body).map(function (t) { return el("p", null, t); })) : null,
      o.extra || null,
      o.photos ? el("div", { class: "photos " + (o.photos.length > 1 ? "two" : "one") }, o.photos.map(function (p) { return photo(p); })) : null,
      o.tip ? el("div", { class: "tip" }, o.tip) : null,
      el("div", { class: "grow" }), src(o.sources)]);
    return s;
  }

  // Board 1
  panel("a3p", "Board 1", C.b1, { title: "Gachibowli, 1998", lede: "Would you recognise it?",
    body: ["In 1998 Gachibowli was a village. Mr. Gopi remembers bullock carts on the path near campus, and bears, pigs and monkeys wandering in from the forest-like land around it.", "Prof. Rajan says one district road from Mehdipatnam was the only way in. Past Tolichowki there was almost nothing until IIIT. Cyber Towers had just opened with about six companies. Ten years later a state study counted close to 1,000."],
    photos: ["img-02", "img-01"], sources: ["S-GOPI", "S-RAJAN", "S-PHOTOS"] });
  panel("a3p", "Board 1", C.b1, { title: "A college in borrowed buildings", lede: "IIIT didn't build its first buildings. It was handed them.",
    body: ["The state government gave IIIT two existing buildings, today's Vindhya and Nilgiri. Mr. Gopi says Vindhya was the district collectorate and Nilgiri the district court. SLN Shastry remembers Nilgiri as an unfinished government building.", "In 1998 only Nilgiri's first two floors were in use, for classrooms, labs, the office and exams. The one big lecture hall, SH-1, was in Vindhya. IIIT had five or six teachers of its own, so professors from the University of Hyderabad taught the basic sciences and humanities."],
    photos: ["img-03"], sources: ["S-PJN", "S-GOPI", "S-SLN"] });
  panel("a3p", "Board 1", C.b1, { title: "A diploma on trust", lede: "Would you join a college that couldn't promise you a degree?",
    body: ["The first batch had 50 seats and 49 students joined. They signed up for a Graduate Diploma in IT (GDIT), not a degree, trusting that IIIT would get university status later.", "You can still see it in their old email addresses: students were @gdit.iiit.net and faculty were @iiit.net. The bet paid off in 2001, when IIIT became a deemed university."],
    photos: ["img-07", "img-08"], sources: ["S-GOPI", "S-PJN", "S-PHOTOS"] });
  panel("a3p", "Board 1", C.b1, { title: "Where did they sleep?", lede: "There were no hostels in 1998.",
    body: ["Prof. Narayanan says the first batch lived in the District Collector's bungalow and three flats, on the spot where the New Academic Block is going up now. SLN Shastry remembers boys staying in Vindhya and girls in the Judge's Quarters.", "In 1999 the second batch slept army-style on two-tier bunk beds inside Vindhya, where block A4 and the library are today. In 2000 Palash, Parijat and Kadamb opened, and the bunks came down."],
    photos: ["img-05"], sources: ["S-PJN", "S-SLN"] });
  // Board 2 (texts from M.way, written for the site)
  var W = M.way || { chapters: [] };
  function ch(id) { return byId(W.chapters, id) || {}; }
  panel("a3p", "Board 2", C.b2, { title: ch("share").title || "Companies in the classroom", kicker: "Board 2  |  " + (ch("share").kicker || "1998 to 2007"), body: ch("share").body,
    extra: W.corporateSchools && W.corporateSchools.length ? el("div", { class: "callout" }, el("b", null, "The prospectus (c.2001) lists: "), W.corporateSchools.join("; ") + ".") : null,
    photos: ["img-19"], sources: ch("share").sources || ["S-PROSP"] });
  (function () {
    var j = byId(M.journeys, "vindhya-rooms");
    var rows = [["Blocks A1 and B2", "Motorola school", "Advanced computing labs. The black granite floor is still there."], ["B5", "IBM and Oracle classrooms", "LTRC, now CSTAR"], ["Today's SPCRC", "Motorola school", "CVIT, now SPCRC"], ["SH-3 area", "Satyam unit", "Robotics Research Centre"], ["Library, 2nd floor", "B.Tech workstations (1 PC for 3)", "Part of the library"]];
    panel("a4p", "Board 2", C.b2, { title: "Vindhya then and now", lede: "Same rooms, new jobs.",
      extra: el("table", null, el("tr", null, el("th", null, "Where"), el("th", null, "Then"), el("th", null, "Later")), rows.map(function (r) { return el("tr", null, r.map(function (c) { return el("td", null, c); })); })),
      tip: "Go and look at the floor in Vindhya A1 and B2. Motorola's black granite is still there.", sources: (j && j.stops[0].sources) || ["S-PJN"] });
  })();
  panel("a4p", "Board 2", C.b2, { title: ch("stayed").title || "Who stayed", kicker: "Board 2  |  " + (ch("stayed").kicker || ""), body: ch("stayed").body,
    extra: (W.evidence || []).length ? el("div", { class: "verified" }, el("div", { class: "chain" }, W.evidence.map(function (n) { return el("div", { class: "node text-only" }, el("div", null, el("div", { class: "k" }, n.label), el("p", null, n.text))); })), el("span", { class: "stamp", style: { "--c": "var(--ok)" } }, "Three sources agree")) : null,
    sources: ch("stayed").sources || ["S-GOPI", "S-PROSP", "S-PING"] });
  panel("a4p", "Board 2", C.b2, { title: ch("takeback").title || "Taking it back", kicker: "Board 2  |  " + (ch("takeback").kicker || ""), body: ch("takeback").body,
    extra: el("div", { style: { display: "grid", gap: "4mm", marginTop: "3mm" } }, (W.stamps || []).map(function (s, i) { return el("div", { style: { display: "flex", gap: "5mm", alignItems: "center" } }, el("span", { class: "stamp", style: { "--c": "var(--soil)", fontSize: "16pt", transform: "rotate(" + (i % 2 ? 3 : -4) + "deg)" } }, "Returned " + s.year), el("div", null, el("b", null, s.place), el("div", { style: { fontSize: "11pt", color: "var(--ink-2)" } }, s.text))); })),
    sources: ch("takeback").sources || ["S-PJN", "S-NEWS-THUB"] });
  panel("a3p", "Board 2", C.b2, { title: ch("build").title || "A loan and four blocks", kicker: "Board 2  |  " + (ch("build").kicker || "Himalaya"), body: ch("build").body,
    extra: el("div", { class: "callout" }, el("b", null, "22 crore"), " borrowed. ", el("b", null, "10 years"), " to pay it back. Paid off in ", el("b", null, "6"), ". The cardboard model in front of this board shows who paid for each block."),
    sources: ch("build").sources || ["S-PJN"] });
  (function () {
    var leased = (W.leased || []).map(function (r) { return Array.isArray(r) ? { name: r[0], sqft: r[1] } : r; });
    var max = Math.max.apply(null, leased.map(function (r) { return r.sqft || r.value || 0; }).concat([1]));
    panel("a4p", "Board 2", C.b2, { title: ch("landlord").title || "IIIT the landlord", kicker: "Board 2  |  " + (ch("landlord").kicker || "Early 2010s"), body: ch("landlord").body,
      extra: el("div", { class: "bars" }, leased.slice(0, 8).map(function (r) { var v = r.sqft || r.value || 0; return el("div", { class: "bar" }, el("span", null, r.name || r.label), el("i", { style: { width: (v / max * 100) + "%" } }), el("span", null, v.toLocaleString("en-IN") + " sq ft")); })),
      sources: ch("landlord").sources || ["S-FLOORPLANS"] });
  })();
  panel("a4p", "Board 2", C.b2, { title: ch("own").title || "What IIIT built for itself", kicker: "Board 2  |  " + (ch("own").kicker || ""), body: ch("own").body,
    extra: el("div", { style: { display: "grid", gap: "3.5mm", marginTop: "2mm" } }, (W.own || []).map(function (o) { return el("div", { style: { display: "grid", gridTemplateColumns: "20mm 1fr", gap: "4mm", padding: "3mm 0", borderTop: ".3mm solid var(--rule)" } }, el("div", { style: { font: "700 13pt var(--mono)", color: "var(--c)" } }, o.when), el("div", null, el("b", { style: { fontFamily: "var(--disp)", fontSize: "14pt" } }, o.title), el("div", { style: { fontSize: "11pt", color: "var(--ink-2)", lineHeight: "1.4" } }, o.text))); })),
    sources: ch("own").sources || ["S-PJN", "S-PRAB", "S-SRIDHAR"] });
  (function () {
    var s = sheet("a3l", "Board 2", "Bottom strip: a branch that was cut", "#C9962E", "strip dark");
    var c = ch("cut");
    add(s, [el("div", { class: "kicker", style: { color: "#C9962E" } }, "Board 2  |  " + (c.kicker || "Undated")), el("h2", null, c.title || "A branch that was cut"),
      el("div", { class: "row", style: { gridTemplateColumns: "repeat(6, 1fr)" } }, ["img-39", "img-42", "img-43", "img-46", "img-40", "img-44"].map(function (id) { return el("div", null, el("div", { class: "photo" }, el("img", { src: "../site/" + img(id).file })), el("div", { class: "cap" }, img(id).caption.replace(" in the abandoned civil engineering department", "").replace(", in the abandoned civil engineering department", ""))); })),
      el("p", { style: { fontSize: "14pt", lineHeight: "1.5", maxWidth: "330mm" } }, c.body || ""),
      el("p", { style: { font: "italic 500 20pt var(--disp)", color: "#E8C66B" } }, "We couldn't find out when it closed. Do you know? Tell a guide."),
      el("div", { style: { flex: 1 } }), src(c.sources || ["S-PHOTOS", "S-PROSP", "S-FLOORPLANS"])]);
  })();
  // Himalaya model labels
  (W.himalaya && W.himalaya.length ? W.himalaya : [
    { id: "C", name: "Block C", role: "Lecture halls and exam centre", funding: "Fitted out with IIIT's own money", color: "own" },
    { id: "A", name: "Block A", role: "Admin today", funding: "Fitted out with TalentSprint; IIIT bought it out in 2018", color: "partner" },
    { id: "KRB", name: "Kohli Research Block", role: "Research", funding: "Built with TCS", color: "partner2" },
    { id: "D", name: "Block D", role: "Research labs since 2022", funding: "T-Hub, 2015 to 2022", color: "state" }]).forEach(function (b) {
    var col = { own: "#2F5D3A", partner: "#B7791F", partner2: "#3E5C76", state: "#6B4E71" }[b.color] || "#2F5D3A";
    var s = sheet("a6l", "Board 2", "Himalaya model label: " + b.name, col, "model-label");
    add(s, [el("div", { class: "blk" }, b.name), el("div", { class: "fund" }, b.funding), el("div", { class: "role" }, b.role)]);
  });

  // Board 3
  (function () {
    var s = sheet("a2p", "Behind Board 4", "The 2002 layout plan (A2, or A1 if you can)", C.b4, "panel");
    add(s, [el("div", { class: "band" }), el("div", { class: "kicker" }, "Behind Board 4  |  The 2002 plan"), el("h2", null, "Layout plan of IIIT, Gachibowli (2002)"),
      el("div", { class: "lede" }, "62 acres. North points down, as on the original."),
      el("div", { style: { flex: 1, display: "grid", placeItems: "center", margin: "4mm 0" } }, el("img", { src: "../site/assets/map/plan-2002.jpg", style: { width: "100%", border: ".5mm solid #ccc" } })),
      src(["S-LAYOUT2002"])]);
  })();
  ["library", "big-hall", "eat", "sleep", "vindhya-rooms", "server-room", "cricket", "block-d"].forEach(function (id) {
    var j = byId(M.journeys, id); if (!j) return;
    var s = sheet("a5p", "Board 3", "Journey card: " + j.short, C.b3, "card journey-card");
    var srcs = []; j.stops.forEach(function (st) { st.sources.forEach(function (x) { if (srcs.indexOf(x) < 0) srcs.push(x); }); });
    add(s, [el("div", { class: "kicker" }, "Journey  |  " + j.short), el("h3", null, j.title),
      el("ol", { class: "stops" }, j.stops.map(function (st, i) { return el("li", { "data-n": i + 1 }, el("span", { class: "when" }, st.when), el("span", { class: "lab" }, st.label), el("span", { class: "txt" }, st.text)); })),
      null,
      el("div", { class: "grow" }), src(srcs)]);
  });
  (function () {
    var s = sheet("a3l", "Board 3", "HISTREE strip (print on green card if you can)", C.b3, "strip");
    var T = M.trees || [];
    add(s, [el("div", { class: "kicker" }, "Board 3  |  HISTREE"), el("h2", null, "Even the trees were moved here and took root."),
      el("p", { style: { fontSize: "13pt", maxWidth: "330mm" } }, (M.treesExtra && M.treesExtra.intro) || ""),
      el("div", { class: "row", style: { gridTemplateColumns: "repeat(5, 1fr)" } }, T.map(function (t) {
        var pic = (t.photos && t.photos[0]) || (t.related && t.related[0]);
        return el("div", { style: { background: "#fff", border: ".4mm solid var(--rule)", borderRadius: "2mm", padding: "3mm" } },
          pic ? el("div", { class: "photo", style: { height: "40mm" } }, el("img", { src: "../site/" + img(pic).file })) : el("div", { class: "photo", style: { height: "40mm", display: "grid", placeItems: "center", font: "8pt var(--mono)", color: "#9a917f" } }, "Photo on 14 Nov"),
          el("h3", { style: { fontSize: "15pt", margin: "2mm 0 1mm" } }, t.name), el("div", { class: "cap" }, t.story),
          t.moves && t.moves.length > 2 ? el("div", { class: "cap", style: { fontFamily: "var(--mono)", color: "var(--banyan)", marginTop: "2mm" } }, t.moves.map(function (m) { return m.label; }).join("  >  ")) : null);
      })),
      el("div", { style: { flex: 1 } }), src(["S-SLN", "S-WIKI-OLD", "S-PHOTOS"])]);
  })();
  (function () {
    var s = sheet("a3l", "Board 3", "Satellite strip: three places changing", C.b3, "strip");
    var rows = [["New Academic Block (going up where the first batch lived)", ["img-09", "img-10", "img-11", "img-12", "img-13", "img-14"]], ["Bakul Nivas (Navjeevan the banyan's second home)", ["img-33", "img-34", "img-35", "img-36"]], ["Felicity ground", ["img-15", "img-16", "img-17", "img-18"]]];
    add(s, [el("div", { class: "kicker" }, "Board 3  |  From above"), el("h2", { style: { fontSize: "26pt" } }, "Three places, watched from above"),
      rows.map(function (r) { return el("div", null, el("div", { class: "cap", style: { fontWeight: 700, color: "var(--ink)" } }, r[0]), el("div", { class: "row", style: { gridTemplateColumns: "repeat(6, 1fr)", margin: "1mm 0 3mm" } }, r[1].map(function (id) { return el("div", { class: "photo", style: { height: "38mm" } }, el("img", { src: "../site/" + img(id).file })); }))); }),
      el("p", { class: "cap" }, "Google Earth screenshots, oldest first. The dates aren't shown on them."), el("div", { style: { flex: 1 } }), src(["S-PHOTOS"])]);
  })();

  // Exit wall
  (function () {
    var E = M.ending || {};
    var s = sheet("a2p", "Exit wall", "Exit panel: every generation thought it had run out of room", C.exit, "exit-panel");
    add(s, [el("div", { class: "kicker" }, E.kicker || "Exit"), el("h1", null, E.title || "Every generation here thought it had run out of room."),
      E.intro ? el("p", { style: { fontSize: "17pt", color: "var(--ink-2)", maxWidth: "330mm" } }, E.intro) : null,
      el("div", { class: "exit-rows" }, (E.rows || []).map(function (r) { return el("div", { class: "exit-row" }, el("div", { class: "when" }, r.when), el("div", null, r.problem), el("div", { class: "solved" }, r.solved)); })),
      E.now ? el("div", { class: "exit-now" }, el("p", null, E.now.text), el("div", { class: "photo", style: { height: "90mm" } }, el("img", { src: "../site/" + img("img-14").file }))) : null,
      el("div", { style: { height: "8mm" } }),
      el("div", { class: "exit-prompt" }, E.prompt || "Which problem on campus today will be a story in ten years?")]);
  })();
  (function () {
    var s = sheet("a4p", "Exit wall", "Thank-you card", C.exit, "card");
    add(s, [el("div", { class: "kicker" }, "Thank you"), el("h3", { style: { fontSize: "30pt" } }, "Thank you to everyone who told us their IIIT."),
      el("ul", { style: { fontSize: "15pt", lineHeight: "1.7" } }, (M.people || []).map(function (p) { return el("li", null, el("b", null, p.fullName), ", " + p.role.replace(/\.$/, "").toLowerCase()); })),
      el("p", { class: "body", style: { fontSize: "13pt" } }, "And to the Registrar's office, the library, the hostel office and the guest house staff, and to Prof. Isha Dubey."), el("div", { class: "grow" })]);
  })();

  // Table 2: timeline game (A6 front/back) and quiz
  var GAME = [["The first classes start, in Nilgiri", "1998", "e-1998-start"], ["The first books arrive in the library (Saranga Hall)", "1998", "e-1998-library"], ["A whole batch sleeps on bunk beds in Vindhya", "1999", "e-1999-bunks"], ["Palash and Parijat hostels open", "2000", "e-2000-hostels"], ["IIIT becomes a deemed university", "2001", "e-2001-deemed"], ["The library moves to Vindhya", "2001", "e-2001-library-move"], ["The 62-acre layout plan is drawn", "2002", "e-2002-plan"], ["Afro-Asian Games press meets in the guest house", "2003", "e-2003-games"], ["Four messes, and Yuktahar", "2005", "e-2005-messes"], ["IIIT takes Vindhya back from the company schools", "2007", "e-2007-vindhya"], ["Faculty move into their own quarters", "2010", "e-2010-quarters"], ["T-Hub opens in Himalaya Block D", "2015", "e-2015-thub"], ["Office paper files start moving into IMS", "2017", "e-2017-ims"], ["UGEE, IIIT's own entrance exam, starts", "2018", "e-2018-ugee"], ["The whole institute goes online", "2020", "e-2020-covid"], ["Block D comes back to IIIT", "2022", "e-2022-blockD"]];
  GAME.forEach(function (g, i) {
    var f = sheet("a6l", "Table 2", "Timeline game card " + (i + 1) + " (front)", C.table, "game-card");
    add(f, el("div", null, el("div", { class: "ev" }, g[0]), el("div", { class: "hint" }, "Put the cards in order. Then flip them.")));
    var b = sheet("a6l", "Table 2", "Timeline game card " + (i + 1) + " (back)", C.table, "game-card back");
    add(b, el("div", null, el("div", { class: "yr" }, g[1]), el("div", { class: "ev2" }, g[0])));
  });
  (function () {
    var Q = (M.quiz && M.quiz.questions) || [];
    var s = sheet("a5p", "Table 1", "Quiz card (print about 40)", C.table, "quiz-card");
    add(s, [el("div", { class: "kicker" }, "Do you know your institute?"), el("h3", null, "8 questions. Now, and again after the exhibit."),
      el("ol", null, Q.map(function (q) { return el("li", null, q.q, el("span", { class: "opts" }, q.options.map(function (o, i) { return String.fromCharCode(97 + i) + ") " + o; }).join("   "))); })),
      el("div", { class: "scores" }, el("div", null, "Entry score"), el("div", null, "Exit score"))]);
    var k = sheet("a4p", "Table 1", "Quiz answer key (stick on the back of the scoreboard)", C.table, "card");
    add(k, [el("div", { class: "kicker" }, "Answer key"), el("h3", { style: { fontSize: "26pt" } }, "Quiz answers"),
      el("ol", { style: { fontSize: "12.5pt", lineHeight: "1.5", paddingLeft: "6mm" } }, Q.map(function (q) { return el("li", { style: { marginBottom: "3mm" } }, el("b", null, q.q + " "), String.fromCharCode(97 + q.answer) + ") " + q.options[q.answer] + ". ", el("span", { style: { color: "var(--ink-2)" } }, q.explain)); }))]);
  })();

  /* ================= layout plans (A4 landscape, one per board) ================= */
  function shelfPack(items) {
    var gap = 2, x = gap, y = gap, rowH = 0, placed = [], extra = [];
    items.forEach(function (it) {
      var sz = SIZES[it.size];
      if (x + sz[0] + gap > BOARD.w) { x = gap; y += rowH + gap; rowH = 0; }
      if (y + sz[1] + gap > BOARD.h) { extra.push(it); return; }
      placed.push({ it: it, x: x, y: y, w: sz[0], h: sz[1] }); x += sz[0] + gap; rowH = Math.max(rowH, sz[1]);
    });
    return { placed: placed, extra: extra };
  }
  var ORDER = { a2p: 0, a3l: 1, a3p: 2, a4p: 3, a4l: 3, a5p: 4, a5l: 4, a6l: 5 };
  // hand-placed layouts (cm from the top-left of a 120 x 90 board). [label pattern, x, y]
  var HAND = {
    "Board 1": [[/Board header/, 0.5, 0.5],
      [/Gachibowli, 1998/, 44.5, 0.5], [/borrowed buildings/, 74.7, 0.5], [/diploma on trust/, 44.5, 46], [/Where did they sleep/, 74.7, 46]],
    "Board 3": [[/Board header/, 0.5, 0.5], [/2002 layout plan/, 43.5, 0.3], [/HISTREE strip/, 0.5, 60.1], [/Satellite strip/, 43.5, 60.1],
      [/Journey card: The library/, 87.5, 0.5], [/big lecture/, 103.3, 0.5], [/Where you eat/, 87.5, 22], [/Where you sleep/, 103.3, 22],
      [/Vindhya's rooms/, 87.5, 43.5], [/server room/, 103.3, 43.5], [/cricket/, 87.5, 65], [/Block D/, 103.3, 65]]
  };
  function handPack(board, items) {
    var spec = HAND[board], placed = [], used = [];
    spec.forEach(function (s) {
      var it = items.filter(function (x) { return used.indexOf(x) < 0 && s[0].test(x.label); })[0];
      if (!it) return; used.push(it);
      var sz = SIZES[it.size]; placed.push({ it: it, x: s[1], y: s[2], w: sz[0], h: sz[1] });
    });
    return { placed: placed, extra: items.filter(function (x) { return used.indexOf(x) < 0; }) };
  }
  ["Board 1", "Board 2", "Board 3", "Exit wall"].forEach(function (b) {
    var items = (layoutItems[b] || []).filter(function (it) { return !/model label/i.test(it.label) && !/inside/.test(it.label); }).slice().sort(function (a, c) { return ORDER[a.size] - ORDER[c.size]; });
    var res = HAND[b] ? handPack(b, items) : shelfPack(items);
    var s = el("section", { class: "sheet a4l layout" });
    if (!ONLY || ONLY === "a4l" || ONLY === "layout") root.appendChild(s);
    var scale = 1.62; // mm per cm on paper
    var plan = el("div", { class: "board-plan", style: { width: (BOARD.w * scale) + "mm", height: (BOARD.h * scale) + "mm" } },
      res.placed.map(function (p) { return el("div", { class: "item", style: { "--c": p.it.color || "#555", left: (p.x * scale) + "mm", top: (p.y * scale) + "mm", width: (p.w * scale) + "mm", height: (p.h * scale) + "mm" } }, el("b", null, p.it.size.toUpperCase()), p.it.label); }));
    add(s, [el("h2", null, b + ": layout plan"), el("div", { class: "meta" }, "PROVISIONAL. Assumes a " + BOARD.w + " x " + BOARD.h + " cm softboard (TODO: confirm the real size). To scale. Conflict cards: tape the inside sheet behind the front as a flap."),
      plan, res.extra.length ? el("div", { class: "legend" }, el("b", null, "Off the board (table, side panel or a second board): "), res.extra.map(function (e) { return e.label; }).join("; ")) : null,
      b === "Board 2" ? el("div", { class: "legend" }, "Himalaya cardboard model sits on a table in front: 4 boxes with the four A6 labels.") : null,
      el("div", { class: "foot" }, el("span", null, "Layout plan  |  " + b), el("span", null, "Do You Know Your Institute?, Team CakedUp"))]);
  });

  /* ================= status banners (final layout: context.md 14, boards/board-sheets.pdf) ================= */
  var NEW = "boards/board-sheets.pdf";
  var STATUS = [
    [/^Layout plan/, "sup", "SUPERSEDED by " + NEW + " page 2. Don't print."],
    [/^Board 1  \|  (Gachibowli|A college in borrowed|A diploma on trust|Where did they sleep)/, "sup", "SUPERSEDED by " + NEW + " pages 3 to 6. Don't print."],
    [/^Board 2  \|  Himalaya model label/, "out", "NOT IN THE FINAL LAYOUT (no Himalaya model). Print only if the team brings it back."],
    [/^Board 2  \|  (?!Board header)/, "sup", "SUPERSEDED by " + NEW + " pages 7 to 11. Don't print."],
    [/^Board 3  \|  Satellite strip/, "sup", "SUPERSEDED: these images play on the Board 2 monitor (#/buildings). Don't print."],
    [/^Board 3  \|  (?!Board header)/, "sup", "SUPERSEDED by " + NEW + " pages 13 to 16. Don't print."],
    [/^Board \d  \|  Board header/, "opt", "OPTIONAL: not in the final layout. Print only if you want a header card."],
    [/^Behind Board 4/, "opt", "The team already has this printed. Reprint only if needed."],
    [/^Table 1  \|  Quiz card/, "sup", "SUPERSEDED by the flashcards in " + NEW + " pages 17 to 20. Don't print."],
    [/^(Exit wall|Table 2)/, "out", "NOT IN THE FINAL LAYOUT (context.md 14.6). Print only if the team brings it back."]
  ];
  Array.prototype.forEach.call(document.querySelectorAll(".sheet"), function (sh) {
    var label = ((sh.querySelector(".foot span") || {}).textContent || "").trim();
    for (var i = 0; i < STATUS.length; i++) {
      if (STATUS[i][0].test(label)) { sh.classList.add("status-" + STATUS[i][1]); sh.insertBefore(el("div", { class: "status-banner status-banner--" + STATUS[i][1] }, STATUS[i][2]), sh.firstChild); return; }
    }
  });

  // overflow sweep: any sheet whose content is taller than the paper gets flagged (never print a clipped source line)
  function sweep() {
    var bad = [];
    Array.prototype.forEach.call(document.querySelectorAll(".sheet"), function (s) {
      if (s.scrollHeight > s.clientHeight + 2 || s.scrollWidth > s.clientWidth + 2) {
        var label = (s.querySelector(".foot span") || {}).textContent || "?";
        bad.push(label + " (+" + Math.round((s.scrollHeight - s.clientHeight) / 3.78) + "mm)");
        s.classList.add("overflow");
      }
    });
    document.body.dataset.overflow = bad.join(" || ");
    if (bad.length) console.warn("OVERFLOW:", bad.join(" || "));
  }
  var imgs = Array.prototype.slice.call(document.images);
  Promise.all([document.fonts ? document.fonts.ready : Promise.resolve()].concat(imgs.map(function (im) { return im.complete ? 1 : new Promise(function (r) { im.onload = im.onerror = r; }); })))
    .then(function () { sweep(); document.body.dataset.ready = "1"; });
})();
