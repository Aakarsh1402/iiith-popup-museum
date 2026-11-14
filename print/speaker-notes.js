/* speaker-notes.js: lays out print/speaker-notes.html. Owner: saharsh-claude (S11).
   Page notes and tour steps come from M.notes (site/data/notes.js); monitors from M.config.screens.
   "On the board" repeats the point of each sheet in boards/board-sheets.pdf (its page 1 has the same list). */
(function () {
  "use strict";
  var M = window.M, N = M.notes || { pages: {}, tour: [] }, S = (M.config && M.config.screens) || {};
  var root = document.getElementById("root");

  function el(tag, attrs) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "class") n.className = attrs[k]; else if (k === "style") n.setAttribute("style", attrs[k]); else n.setAttribute(k, attrs[k]);
    });
    for (var i = 2; i < arguments.length; i++) add(n, arguments[i]);
    return n;
  }
  function add(n, c) { if (c == null || c === false) return; if (Array.isArray(c)) return c.forEach(function (x) { add(n, x); }); n.appendChild(c instanceof Node ? c : document.createTextNode(String(c))); }
  function srcLine(ids) {
    var names = (ids || []).map(function (id) { return (M.sources && M.sources[id] && M.sources[id].short) || id; });
    return names.length ? el("div", { class: "src" }, "Sources: " + names.join("; ")) : null;
  }
  function routeKey(r) { return String(r || "").replace(/^#\//, "").split(/[?\/]/)[0] || "start"; }
  /* the first n sentences, without splitting after "Mr." or "P. J." */
  function sentences(text, n) {
    var out = "", re = /[.!?]["')]?\s+/g, m, last = 0, count = 0;
    while ((m = re.exec(text)) && count < n) {
      if (/(?:^|\s)(?:Mr|Mrs|Dr|Prof|Rs|St|c|vs|[A-Z])$/.test(text.slice(0, m.index))) continue;
      out = text.slice(0, m.index + m[0].length).trim(); last = m.index + m[0].length; count++;
    }
    return count < n || last >= text.length ? text : out;
  }

  var NAMES = { start: "Start", timeline: "Timeline", photos: "Old campus photos", way: "The IIIT Way", buildings: "How buildings grew", map: "Map",
    histree: "HISTREE (the trees)", "how-we-know": "How we know", voices: "Voices", archive: "Archive", quiz: "Quiz" };

  var BOARDS = [
    { kicker: "Entry", title: "Entry table", color: "#B07D16", screen: null, routes: ["quiz", "start"],
      lead: "Hand each visitor 1 or 2 flashcards, so about four people can play at once. Then point to the QR code for the full quiz on their phone.",
      sheets: [["p.17-20", "Quiz flashcards, Q1 to Q8. The answer is printed upside down at the bottom of each card."]] },
    { kicker: "Board 1", title: "Setting the scene (1998 to 2002)", color: "#A9502C", screen: "board1", routes: ["photos", "timeline"],
      sheets: [["p.3 A3", "Gachibowli in 1998: a village with one road in. 6 companies at Cyber Towers, about 1,000 by 2007-08."],
        ["p.4 A4", "Borrowed buildings: IIIT started in two government buildings it was lent. Only two floors of Nilgiri were in use."],
        ["p.5 A4", "A diploma on trust: 49 of 50 joined for a diploma, trusting IIIT to become a university. It did in 2001."],
        ["p.6 A3", "Where students lived: a bungalow, then bunks in Vindhya, then hostels. Single rooms then, triple sharing now."]] },
    { kicker: "Board 2", title: "The IIIT Way", color: "#2F5D3A", screen: "board2", routes: ["buildings", "way"],
      sheets: [["p.7 A4", "Himalaya: a 22 crore loan, paid off in 6 of 10 years. Who paid for each block. Only Block C was IIIT's own money."],
        ["p.8 A3", "The IIIT Way: borrow, share, take back, build your own. IIIT was a landlord too."],
        ["p.9-10 A4", "Civil: padlocked labs on a CS and ECE campus, then the paper trail. Ask visitors if they know when it closed."],
        ["p.11 A4", "Fun facts: Motorola's granite floor in Vindhya. First in Hyderabad to go fully online, says Sridhar."]] },
    { kicker: "Board 3", title: "Institutional changes", color: "#3E5C76", screen: "board3", routes: ["map", "histree"],
      sheets: [["p.12 A4", "Attendance, then and now (still a draft: fill in the team's info)."],
        ["p.13 A4", "IMS: paper files to IMS in 2017, one process at a time. Some records stay on paper for audits. Not \"the first fully digital college\"."],
        ["p.14 A3", "Moving rooms: the library, the mess, the big lecture hall, Block D, the server room, the cricket ground."],
        ["p.15-16 A4", "Trees: four banyans saved from a road widening. Navjeevan's three stops. Jagruthi the tree, Jagruti the mascot."]] },
    { kicker: "Board 4", title: "How we know (monitor only)", color: "#6B4E71", screen: "board4", routes: ["how-we-know", "voices", "archive"],
      lead: "No printed panels. Start on the conflict and verified cards, then give a website tour (next page).",
      sheets: [["Behind", "The 2002 layout plan and the scanned floor plans, already printed."]] }
  ];

  var pages = [];
  function page(color, kicker, title) {
    var p = el("section", { class: "page", style: "--c: " + color });
    add(p, [el("div", { class: "kicker" }, kicker), el("h1", null, title)]);
    pages.push({ node: p, kicker: kicker });
    root.appendChild(p);
    return p;
  }

  BOARDS.forEach(function (b) {
    var p = page(b.color, "Speaker notes  |  " + b.kicker, b.title);
    var sc = b.screen && S[b.screen];
    if (sc) add(p, el("div", { class: "screen" },
      el("b", null, "Monitor"), el("span", null, sc.label),
      el("b", null, "Open"), el("code", null, "site/index.html?screen=" + b.screen),
      el("b", null, "Shows"), el("span", null, (sc.playlist || [{ route: sc.home }]).map(function (x) { return NAMES[routeKey(x.route)] || x.route; }).join(", then ") + (sc.tour ? ". Press T for the website tour." : ". After 90 s idle it goes back here."))));
    if (b.lead) add(p, el("p", { style: "margin:0; font-size:11pt" }, b.lead));
    add(p, el("div", null, el("h2", null, "On the board"), el("ul", { class: "sheets" }, b.sheets.map(function (s) { return el("li", null, el("span", null, s[0]), el("div", null, s[1])); }))));
    add(p, el("h2", { style: "margin-top:1mm" }, "What to say at the screen"));
    b.routes.forEach(function (r) {
      var n = N.pages && N.pages[r];
      if (!n) return;
      add(p, el("div", { class: "note" }, el("h2", { style: "font-size:11.5pt" }, NAMES[r] || r, el("span", { class: "route" }, "#/" + r)), el("p", null, n.text), srcLine(n.sources)));
    });
  });

  /* the Board 4 website tour */
  (function () {
    var p = page("#6B4E71", "Speaker notes  |  Board 4", "The website tour");
    add(p, el("div", { class: "keys" },
      el("span", null, el("kbd", null, "T"), " or the Tour button: start or stop"),
      el("span", null, el("kbd", null, "PageDown"), " / ", el("kbd", null, "PageUp"), " (or ", el("kbd", null, "]"), " ", el("kbd", null, "["), "): next, back"),
      el("span", null, el("kbd", null, "N"), ": show or hide the notes on screen"),
      el("span", null, el("kbd", null, "Esc"), ": close a panel")));
    add(p, el("table", null,
      el("thead", null, el("tr", null, el("th", null, "#"), el("th", { style: "width:34%" }, "On screen"), el("th", null, "Say"))),
      el("tbody", null, (N.tour || []).map(function (t, i) {
        var n = N.pages && N.pages[routeKey(t.route)];
        return el("tr", null, el("td", { class: "n" }, String(i + 1)),
          el("td", null, el("b", null, t.title), el("br"), t.text, el("small", null, t.route)),
          el("td", null, n ? sentences(n.text, 2) : ""));
      }))));
    add(p, el("p", { class: "src", style: "margin:0" }, "The full note for each page is on that board's sheet, and on screen with N. Every fact in these notes is from context.md."));
  })();

  pages.forEach(function (pg, i) {
    add(pg.node, el("div", { class: "foot" }, el("span", null, pg.kicker + "  |  Do You Know Your Institute?, Team CakedUp"), el("span", null, "Page " + (i + 1) + " of " + pages.length)));
  });
})();
