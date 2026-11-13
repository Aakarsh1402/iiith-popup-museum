/* voices.js: Voices index (#/voices) and person pages (#/voices/<personId>?q=search). Owner: saharsh-claude (S3).
   Person pages: what they told us, timeline events, where their memory disagrees or is backed up, the full transcript
   with search. Gopi's page also shows the phone-booth comic, which other pages can embed with M.pages.voices.comic(). */
(function () {
  "use strict";
  var M = window.M, U = M.util, UI = M.ui, el = UI.el, svg = UI.svg;
  var st = null;

  /* Editor's notes shown inside transcripts (we never change the transcript text itself). */
  var SIC = { "P-PJN": [ { re: /Talon[\u2019']s Print/g, note: "we think this is TalentSprint" } ] };

  /* ---------- transcript rendering (tiny, safe markdown: **b**, *i*, `code`) ---------- */
  function inline(text) {
    var out = [], re = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|`[^`]+`)/g, last = 0, m;
    while ((m = re.exec(text))) {
      if (m.index > last) out.push(text.slice(last, m.index));
      var t = m[0];
      if (t.indexOf("**") === 0) out.push(el("strong", null, t.slice(2, -2)));
      else if (t.charAt(0) === "`") out.push(el("code", null, t.slice(1, -1)));
      else out.push(el("em", null, t.slice(1, -1)));
      last = m.index + t.length;
    }
    if (last < text.length) out.push(text.slice(last));
    return out;
  }
  function isHeading(p) {
    if (/^#{1,4}\s/.test(p)) return true;
    var t = p.trim();
    if (t.length > 72 || /[.,;:?!"]$/.test(t)) return false;
    return /^\d+\.\s+[A-Z&\s,()0-9:-]+$/.test(t) || (t.length < 60 && /^[A-Z]/.test(t) && t.split(/\s+/).length <= 9 && !/^[-*>]/.test(t));
  }
  /* Merge lines that a converter split mid-sentence (a line starting in lower case continues the previous one). */
  function mergeParas(paras) {
    var out = [];
    paras.forEach(function (p) {
      if (out.length && /^[a-z]/.test(p) && !/[.!?:]$/.test(out[out.length - 1])) out[out.length - 1] += " " + p;
      else out.push(p);
    });
    return out;
  }
  function transcriptBlocks(t, personId) {
    var nodes = [], list = null;
    mergeParas(t.paras || []).forEach(function (p) {
      var bullet = /^\s*(?:[-*]|\d+\.)\s+(?:\[[ x]\]\s+)?/.exec(p);
      if (bullet && !/^\d+\.\s+[A-Z&\s,()0-9:-]+$/.test(p.trim())) {
        if (!list) { list = el("ul", { class: "voices-ul" }); nodes.push(list); }
        list.appendChild(el("li", null, inline(p.slice(bullet[0].length))));
        return;
      }
      list = null;
      if (/^-{3,}$/.test(p.trim())) nodes.push(el("hr", { class: "rule" }));
      else if (/ {3,}/.test(p)) nodes.push(el("pre", { class: "voices-pre" }, p));
      else if (/^>\s?/.test(p)) nodes.push(el("blockquote", { class: "voices-bq" }, inline(p.replace(/^>\s?/, ""))));
      else if (isHeading(p)) nodes.push(el("h4", { class: "voices-h" }, inline(p.replace(/^#+\s*/, ""))));
      else nodes.push(el("p", null, inline(p)));
    });
    (SIC[personId] || []).forEach(function (s) { annotate(nodes, s); });
    return nodes;
  }
  function textNodes(root) {
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), out = [], n;
    while ((n = w.nextNode())) out.push(n);
    return out;
  }
  function annotate(nodes, s) {
    nodes.forEach(function (root) {
      textNodes(root).forEach(function (tn) {
        s.re.lastIndex = 0;
        var m = s.re.exec(tn.nodeValue);
        if (!m) return;
        var after = tn.splitText(m.index + m[0].length);
        tn.parentNode.insertBefore(el("span", { class: "voices-sic", title: "Editor's note" }, "[" + s.note + "]"), after);
      });
    });
  }
  function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  /** Wraps every match of q inside container in <mark>. Returns the marks. */
  function highlight(container, q) {
    var marks = [];
    if (!q || q.trim().length < 2) return marks;
    var re = new RegExp(escapeRe(q.trim()), "gi");
    textNodes(container).forEach(function (tn) {
      if (tn.parentNode.closest(".voices-sic")) return;
      var v = tn.nodeValue, m, last = 0, frag = null;
      re.lastIndex = 0;
      while ((m = re.exec(v))) {
        if (!frag) frag = document.createDocumentFragment();
        if (m.index > last) frag.appendChild(document.createTextNode(v.slice(last, m.index)));
        var mk = el("mark", null, m[0]); frag.appendChild(mk); marks.push(mk);
        last = m.index + m[0].length;
      }
      if (frag) { if (last < v.length) frag.appendChild(document.createTextNode(v.slice(last))); tn.parentNode.replaceChild(frag, tn); }
    });
    return marks;
  }

  /* ---------- phone-booth comic (original SVG; the official never has a face or a name) ---------- */
  var C = { ink: "#26241F", gopi: "#3E5C76", skin: "#B98563", trousers: "#3b3a36", navy: "#2d3a52", white: "#F4F1EA", shadow: "#4a4a52",
    soil: "#A9502C", ochre: "#C9962E", paper: "#F4EEE2", wall: "#EAE1CF", green: "#2F5D3A" };
  function person(x, base, o) {
    o = o || {};
    var dir = o.dir || 1, s = o.scale || 1, body = o.body || C.gopi, head = o.head || C.skin, legs = o.legs || C.trousers;
    var g = svg("g", { transform: "translate(" + x + " " + base + ") scale(" + (s * dir) + " " + s + ")" });
    g.appendChild(svg("rect", { x: -15, y: -58, width: 12, height: 58, rx: 5, fill: legs }));
    g.appendChild(svg("rect", { x: 3, y: -58, width: 12, height: 58, rx: 5, fill: legs }));
    g.appendChild(svg("rect", { x: -24, y: -118, width: 48, height: 66, rx: 18, fill: body }));
    var arm = o.arm || "down";
    var armPath = { down: "M18 -104 L24 -66", out: "M18 -104 L50 -92", up: "M18 -104 L40 -132", phone: "M18 -104 L18 -86 L6 -128" }[arm];
    g.appendChild(svg("path", { d: armPath, stroke: body, "stroke-width": 11, "stroke-linecap": "round", "stroke-linejoin": "round", fill: "none" }));
    g.appendChild(svg("path", { d: "M-18 -104 L-24 -66", stroke: body, "stroke-width": 11, "stroke-linecap": "round", fill: "none" }));
    if (o.hand && arm !== "down") { var hp = { out: [52, -92], up: [42, -134], phone: [6, -130] }[arm]; g.appendChild(svg("circle", { cx: hp[0], cy: hp[1], r: 6, fill: head })); }
    g.appendChild(svg("circle", { cx: 0, cy: -136, r: 18, fill: head }));
    if (o.face === "kind") {
      g.appendChild(svg("path", { d: "M-6 -134 a2 2 0 1 0 .1 0 M7 -134 a2 2 0 1 0 .1 0", stroke: C.ink, "stroke-width": 3, "stroke-linecap": "round", fill: "none" }));
      g.appendChild(svg("path", { d: "M-7 -127 Q0 -121 7 -127", stroke: C.ink, "stroke-width": 2, "stroke-linecap": "round", fill: "none" }));
      g.appendChild(svg("path", { d: "M-18 -140 Q-14 -158 2 -156 Q16 -156 18 -142 Q10 -150 -2 -148 Q-12 -148 -18 -140 Z", fill: C.ink }));
    } else if (o.face === "back") {
      g.appendChild(svg("path", { d: "M-18 -136 A18 18 0 0 1 18 -136 L18 -128 Q0 -122 -18 -128 Z", fill: "#2b2925" }));
    }
    if (o.cap) {
      g.appendChild(svg("path", { d: "M-22 -146 Q0 -166 22 -146 L20 -140 L-20 -140 Z", fill: C.white, stroke: C.ink, "stroke-width": 1.5 }));
      g.appendChild(svg("rect", { x: -20, y: -144, width: 40, height: 6, fill: C.navy }));
      g.appendChild(svg("circle", { cx: 0, cy: -150, r: 3, fill: C.ochre }));
    }
    return g;
  }
  function booth(x, base, lit) {
    return svg("g", { transform: "translate(" + x + " " + base + ")" },
      lit ? svg("circle", { cx: 0, cy: -96, r: 92, fill: "#ffd27a", opacity: ".22" }) : null,
      svg("rect", { x: -36, y: -178, width: 72, height: 178, rx: 6, fill: C.soil }),
      svg("rect", { x: -40, y: -190, width: 80, height: 18, rx: 4, fill: "#7a3a1f" }),
      svg("text", { x: 0, y: -176.5, "text-anchor": "middle", "font-size": 12, "font-weight": 700, fill: lit ? "#ffe2a6" : C.paper, style: "font-family: var(--font-mono); letter-spacing: 2px" }, "PHONE"),
      svg("rect", { x: -26, y: -160, width: 52, height: 92, rx: 4, fill: lit ? "#ffe9b8" : "#cdbfa5" }),
      svg("path", { d: "M-8 -132 q-8 0 -8 8 v10 q0 8 8 8 M8 -132 q8 0 8 8", stroke: C.ink, "stroke-width": 5, "stroke-linecap": "round", fill: "none" }),
      svg("rect", { x: -14, y: -118, width: 28, height: 22, rx: 4, fill: C.ink }),
      svg("rect", { x: -32, y: -60, width: 64, height: 4, fill: "#7a3a1f" }));
  }
  function bubble(x, y, w, h, tailX, tailY, content) {
    return svg("g", null,
      svg("path", { d: "M" + (x + 14) + " " + y + " h" + (w - 28) + " q14 0 14 14 v" + (h - 28) + " q0 14 -14 14 H" + (tailX + 10) + " L" + tailX + " " + tailY + " L" + (tailX - 4) + " " + (y + h) + " H" + (x + 14) + " q-14 0 -14 -14 v" + (-(h - 28)) + " q0 -14 14 -14 Z",
        fill: "#fff", stroke: C.ink, "stroke-width": 2 }), content);
  }
  function plateIcon(cx, cy) {
    return svg("g", null, svg("circle", { cx: cx, cy: cy, r: 13, fill: "none", stroke: C.ink, "stroke-width": 2.5 }), svg("circle", { cx: cx, cy: cy, r: 6, fill: "none", stroke: C.ink, "stroke-width": 1.5 }),
      svg("path", { d: "M" + (cx - 22) + " " + (cy - 12) + " v24 M" + (cx - 26) + " " + (cy - 12) + " v8 q4 4 8 0 v-8 M" + (cx + 22) + " " + (cy - 12) + " q5 6 0 12 v12", stroke: C.ink, "stroke-width": 2, fill: "none", "stroke-linecap": "round" }));
  }
  function phoneIcon(cx, cy) {
    return svg("path", { d: "M" + (cx - 14) + " " + (cy - 6) + " q14 -10 28 0 l-3 7 l-6 -2 v-4 q-5 -2 -10 0 v4 l-6 2 z M" + (cx - 9) + " " + (cy + 3) + " h18 l4 10 h-26 z", fill: C.soil, stroke: C.ink, "stroke-width": 1.5, "stroke-linejoin": "round" });
  }
  function clock(cx, cy, r) {
    return svg("g", null, svg("circle", { cx: cx, cy: cy, r: r, fill: "#fff", stroke: C.ink, "stroke-width": 2 }),
      svg("path", { d: "M" + cx + " " + cy + " v" + (-r * .65) + " M" + cx + " " + cy + " l" + (r * .5) + " " + (r * .2), stroke: C.ink, "stroke-width": 2, "stroke-linecap": "round" }));
  }
  function scene(n) {
    var s = svg("svg", { viewBox: "0 0 400 260", class: "voices-panel-svg", role: "img", "aria-hidden": "true" });
    var floor = function (fill) { return svg("rect", { x: 0, y: 226, width: 400, height: 34, fill: fill || "#d9c9a8" }); };
    if (n === 1) {
      s.appendChild(svg("rect", { width: 400, height: 260, fill: "#efe4cf" }));
      s.appendChild(svg("rect", { x: 210, y: 70, width: 180, height: 156, fill: C.wall, stroke: "#cbb994" }));
      s.appendChild(svg("rect", { x: 216, y: 80, width: 168, height: 24, rx: 3, fill: C.green }));
      s.appendChild(svg("text", { x: 300, y: 96, "text-anchor": "middle", "font-size": 9.5, fill: "#fff", style: "font-family: var(--font-mono)" }, "Guest House, Mess & Lounge"));
      [232, 300].forEach(function (wx) { s.appendChild(svg("rect", { x: wx, y: 120, width: 46, height: 40, fill: "#c9d6d8", stroke: "#a8987a" })); });
      s.appendChild(svg("rect", { x: 312, y: 176, width: 34, height: 50, fill: "#8a6a45" }));
      s.appendChild(floor());
      s.appendChild(person(105, 228, { body: C.white, head: C.skin, legs: C.navy, face: "back", cap: true, arm: "out", hand: true }));
      s.appendChild(person(205, 228, { body: C.gopi, face: "kind", dir: -1 }));
      s.appendChild(bubble(52, 16, 92, 54, 98, 84, plateIcon(98, 43)));
      s.appendChild(bubble(176, 14, 88, 54, 206, 80, phoneIcon(220, 40)));
    } else if (n === 2) {
      s.appendChild(svg("rect", { width: 400, height: 260, fill: "#e6dccb" }));
      s.appendChild(floor());
      s.appendChild(booth(330, 228, false));
      s.appendChild(svg("path", { d: "M316 110 q-30 30 -10 60 q14 20 -6 40", stroke: C.ink, "stroke-width": 3, fill: "none", "stroke-dasharray": "2 6", "stroke-linecap": "round" }));
      s.appendChild(clock(258, 46, 18));
      s.appendChild(person(90, 228, { body: C.shadow, head: C.shadow, legs: C.shadow, face: "none", arm: "out", hand: true }));
      s.appendChild(person(210, 228, { body: C.gopi, face: "kind", dir: -1, arm: "out", hand: true }));
      s.appendChild(svg("g", { transform: "rotate(-8 152 124)" },
        svg("rect", { x: 122, y: 110, width: 60, height: 30, rx: 3, fill: "#cfe3c2", stroke: C.green, "stroke-width": 2 }),
        svg("text", { x: 152, y: 130, "text-anchor": "middle", "font-size": 11, "font-weight": 700, fill: C.green, style: "font-family: var(--font-mono)" }, "Rs. 2,000")));
    } else if (n === 3) {
      s.appendChild(svg("rect", { width: 400, height: 260, fill: "#efe4cf" }));
      s.appendChild(floor());
      s.appendChild(svg("rect", { x: 30, y: 150, width: 150, height: 14, fill: "#8a6a45" }));
      s.appendChild(svg("rect", { x: 44, y: 164, width: 10, height: 62, fill: "#7a5c3a" }));
      s.appendChild(svg("rect", { x: 156, y: 164, width: 10, height: 62, fill: "#7a5c3a" }));
      s.appendChild(svg("path", { d: "M128 150 v-10 h26 v10 z", fill: C.ink }));
      s.appendChild(person(96, 228, { body: C.white, head: C.skin, legs: C.navy, face: "back", cap: true, arm: "phone", hand: true }));
      s.appendChild(svg("path", { d: "M128 74 l8 -20 M146 82 l18 -12 M150 102 l20 0", stroke: C.soil, "stroke-width": 4, "stroke-linecap": "round" }));
      s.appendChild(booth(318, 228, true));
      s.appendChild(svg("g", null, svg("circle", { cx: 366, cy: 40, r: 18, fill: "#2F7D4F" }), svg("path", { d: "M357 40 l6 6 l12 -13", stroke: "#fff", "stroke-width": 4, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" })));
    } else {
      s.appendChild(svg("rect", { width: 400, height: 260, fill: "#1f2a40" }));
      [[120, 18], [200, 40], [260, 22], [90, 64], [170, 70], [230, 84]].forEach(function (p) { s.appendChild(svg("circle", { cx: p[0], cy: p[1], r: 1.8, fill: "#f4eee2", opacity: ".8" })); });
      s.appendChild(svg("path", { d: "M354 28 a22 22 0 1 0 14 38 a18 18 0 1 1 -14 -38 z", fill: "#f4e3b0" }));
      s.appendChild(floor("#2b3550"));
      s.appendChild(booth(320, 228, true));
      var cols = ["#6B4E71", "#2D7A78", "#A87A1E", "#57524A", "#3E5C76", "#8A3E20"];
      for (var i = 0; i < 6; i++) s.appendChild(person(250 - i * 40, 228, { scale: .62 + (i % 2) * .05, body: cols[i], head: "#9c7a5c", legs: "#22252e", face: "back" }));
      s.appendChild(clock(84, 44, 18));
    }
    return s;
  }
  var CAPTIONS = [
    "A retired Commodore on the staff asked Mr. Gopi to run the guest house mess. Gopi felt it wasn't a one-man job, and asked to run a phone booth instead.",
    "The telecom officials kept delaying the connection. One of them asked for a Rs. 2,000 bribe. Gopi, from a simple rural background, paid it. The booth still didn't work.",
    "When the Commodore found out, he complained to senior government officials. The booth was connected that same day.",
    "About 100 people a day used the booth. The queues were longest from 8 pm to midnight, when calls were cheaper. Around 2002, mobile phones took over and it closed."
  ];
  function comic(opts) {
    opts = opts || {};
    var scans = M.config && M.config.comicImages;
    var panels = CAPTIONS.map(function (cap, i) {
      return el("figure", { class: "voices-panel" },
        el("div", { class: "voices-panel-art" },
          scans ? el("img", { src: "assets/comic/panel-" + (i + 1) + ".jpg", alt: "Comic panel " + (i + 1) + ". " + cap }) : scene(i + 1),
          el("span", { class: "voices-panel-n mono" }, String(i + 1))),
        el("figcaption", null, cap));
    });
    var end = U.image("img-29") ? el("figure", { class: "voices-panel voices-panel--photo" },
      UI.imageFigure("img-29", { caption: false, ratio: "4/3" }),
      el("figcaption", null, "When the booth closed, Gopi became the guest house caretaker. This is his room today. The booth stood here.")) : null;
    return el("section", { class: ["voices-comic", opts.compact ? "voices-comic--compact" : ""], "aria-label": "Comic: the phone booth story" },
      el("header", { class: "voices-comic-head" },
        el("div", { class: "kicker" }, "As told by Mr. Gopi (2026)"),
        el("h2", null, "The phone booth and the Rs. 2,000 bribe"),
        el("p", { class: "muted small" }, "We drew the official as a shadow with no face, and we don't name him.")),
      el("div", { class: "voices-panels" }, panels, end),
      UI.sourceBadges(["S-GOPI", "S-PHOTOS"]));
  }

  /* ---------- index ---------- */
  function sortedPeople() { return (M.people || []).slice().sort(function (a, b) { return (a.joined || 9999) - (b.joined || 9999); }); }
  function avatar(p, size) { var a = UI.avatar(p, size); if (p.color) a.style.setProperty("--c", p.color); return a; }
  var NUM = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

  function renderIndex(root) {
    var people = sortedPeople(), n = people.length;
    var y0 = 1998, y1 = 2026;
    var byYear = {};
    var strip = el("div", { class: "voices-strip", "aria-hidden": "true" },
      el("div", { class: "voices-strip-line" }),
      [1998, 2002, 2006, 2010, 2014, 2018, 2022, 2026].map(function (y) { return el("span", { class: "voices-strip-tick mono", style: { left: ((y - y0) / (y1 - y0) * 100) + "%" } }, String(y)); }),
      people.map(function (p) {
        var k = byYear[p.joined] = (byYear[p.joined] || 0) + 1;
        return el("a", { class: "voices-strip-pin", href: U.href("voices", p.id), tabindex: "-1", style: { left: ((p.joined - y0) / (y1 - y0) * 100) + "%", "--row": k - 1, "--c": p.color || "var(--plum)" } },
          el("span", { class: "dot" }), el("span", { class: "stem" }), el("span", { class: "lbl" }, p.name));
      }));

    var grid = el("div", { class: "voices-grid" }, people.map(function (p) {
      var evs = U.eventsForPerson(p.id).length;
      return el("a", { class: "voices-card", href: U.href("voices", p.id), style: { "--c": p.color || "var(--plum)" } },
        avatar(p, "4.4rem"),
        el("div", { class: "voices-card-body" },
          el("span", { class: "voices-years mono" }, p.years),
          el("h3", null, p.name),
          el("p", { class: "voices-role" }, p.role),
          el("p", { class: "voices-one" }, p.oneLine),
          evs ? el("span", { class: "voices-count-ev mono" }, evs + " moments on the timeline") : null,
          el("span", { class: "voices-more mono" }, "Read the interview", UI.icon("arrow-right"))));
    }));

    root.appendChild(el("section", { class: "page voices" }, el("div", { class: "wrap" }, el("div", { class: "page-pad" },
      el("header", { class: "voices-hero" },
        el("div", { class: "kicker" }, "Board 4 / Voices"),
        el("h1", null, (n <= 10 ? NUM[n].charAt(0).toUpperCase() + NUM[n].slice(1) : n) + " people told us their IIIT"),
        el("p", { class: "lede" }, "Staff, faculty and the librarian. Some have been here since the first batch in 1998. Most of what you see in this exhibit started as something one of them remembered."),
        el("p", { class: "voices-consent" }, UI.icon("check"), "Everyone here agreed to be recorded and quoted.")),
      el("h2", { class: "voices-sub" }, "When they arrived"),
      strip,
      grid,
      el("aside", { class: "callout voices-howto" },
        el("h3", null, "How to read these interviews"),
        el("p", null, "Most of the texts are write-ups made from the recordings, not word-for-word transcripts. Prof. Narayanan's came to us as a polished write-up, so we use its facts but never quote its wording as his. Prof. Rajan's is a set of notes from an automatic transcript. Where we cut a line, the text says so."))))));
  }

  /* ---------- person page ---------- */
  function renderPerson(root, id, query) {
    var p = U.person(id);
    if (!p) { renderIndex(root); return; }
    var people = sortedPeople(), i = people.indexOf(p);
    var prevP = people[(i - 1 + people.length) % people.length], nextP = people[(i + 1) % people.length];
    var sid = p.sourceId, src = U.source(sid) || {};
    var t = (M.transcripts || {})[p.transcriptId || p.id];
    var events = U.eventsForPerson(p.id);
    var conflicts = (M.conflicts || []).filter(function (c) { return c.accounts.some(function (a) { return (a.sources || []).indexOf(sid) >= 0; }); });
    var checked = (M.verified || []).filter(function (v) { return v.chain.some(function (n) { return (n.sources || []).indexOf(sid) >= 0; }); });

    var head = el("header", { class: "voices-person-head", style: { "--c": p.color || "var(--plum)" } },
      el("a", { class: "btn btn--ghost voices-back", href: U.href("voices") }, UI.icon("arrow-left"), "All voices"),
      el("div", { class: "voices-person-id" },
        avatar(p, "7rem"),
        el("div", null,
          el("div", { class: "kicker" }, "Interview, 2026"),
          el("h1", null, p.fullName || p.name),
          el("p", { class: "voices-role voices-role--big" }, p.role),
          el("span", { class: "voices-years mono" }, "At IIIT: " + p.years))));

    var left = el("div", { class: "voices-col-left" },
      p.toldUs && p.toldUs.length ? el("section", { class: "voices-block" },
        el("h2", null, "What they told us"),
        el("ul", { class: "voices-told" }, p.toldUs.map(function (s) { return el("li", null, s); })),
        UI.sourceBadges([sid])) : null,
      events.length ? el("section", { class: "voices-block" },
        el("h2", null, "On the timeline"),
        el("ol", { class: "voices-events" }, events.map(function (e) {
          return el("li", null, el("a", { href: U.href("timeline", e.id) }, el("span", { class: "mono" }, U.formatYear(e)), el("span", null, e.title)));
        }))) : null,
      conflicts.length ? el("section", { class: "voices-block" },
        el("h2", null, "Where this memory disagrees"),
        conflicts.map(function (c) {
          var mine = c.accounts.filter(function (a) { return (a.sources || []).indexOf(sid) >= 0; })[0];
          return el("a", { class: "voices-mini", href: U.href("how-we-know", c.id) },
            el("span", { class: "kicker" }, c.id), el("b", null, c.question), mine ? el("span", { class: "muted small" }, mine.text) : null,
            el("span", { class: "voices-more mono" }, "See every side", UI.icon("arrow-right")));
        })) : null,
      checked.length ? el("section", { class: "voices-block" },
        el("h2", null, "Where other sources back it up"),
        checked.map(function (v) {
          return el("a", { class: "voices-mini voices-mini--ok", href: U.href("how-we-know", v.id) },
            el("span", { class: "kicker" }, v.id), el("b", null, v.claim), el("span", { class: "voices-more mono" }, "See the evidence", UI.icon("arrow-right")));
        })) : null);

    var right = el("div", { class: "voices-col-right" });
    if (t) {
      var body = el("div", { class: "voices-transcript" });
      var count = el("span", { class: "voices-count mono", "aria-live": "polite" });
      var input = el("input", { type: "search", class: "voices-search-input", placeholder: "Search this interview", "aria-label": "Search this interview", value: query.q || "" });
      var prev = el("button", { class: "icon-btn", type: "button", "aria-label": "Previous match", on: { click: function () { step(-1); } } }, UI.icon("chevron-up"));
      var next = el("button", { class: "icon-btn", type: "button", "aria-label": "Next match", on: { click: function () { step(1); } } }, UI.icon("chevron-down"));
      var marks = [], cur = -1;
      var draw = function (q) {
        body.textContent = "";
        transcriptBlocks(t, p.id).forEach(function (n) { body.appendChild(n); });
        marks = highlight(body, q); cur = -1;
        count.textContent = q && q.trim().length >= 2 ? (marks.length === 1 ? "1 match" : marks.length + " matches") : "";
        prev.disabled = next.disabled = marks.length === 0;
        if (marks.length) step(1);
      };
      var step = function (d) {
        if (!marks.length) return;
        if (cur >= 0) marks[cur].classList.remove("current");
        cur = (cur + d + marks.length) % marks.length;
        marks[cur].classList.add("current");
        count.textContent = (cur + 1) + " of " + marks.length;
        var mk = marks[cur];
        /* wait a frame so the router's scroll-to-top on first render doesn't cancel this */
        requestAnimationFrame(function () { if (mk.isConnected) mk.scrollIntoView({ behavior: U.prefersReducedMotion() ? "auto" : "smooth", block: "center" }); });
      };
      var onInput = U.debounce(function () {
        draw(input.value);
        M.router.replace(U.href("voices", p.id, input.value.trim() ? { q: input.value.trim() } : null));
      }, 180);
      input.addEventListener("input", onInput);
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") { e.preventDefault(); step(e.shiftKey ? -1 : 1); }
        else if (e.key === "Escape") { input.value = ""; onInput(); }
      });
      right.appendChild(el("section", { class: "voices-block voices-tr" },
        el("div", { class: "voices-tr-head" },
          el("h2", null, "The interview"),
          el("p", { class: "mono small muted" }, t.title)),
        t.note ? el("p", { class: "callout voices-note" }, t.note) : (src.note ? el("p", { class: "voices-note-plain muted small" }, src.note) : null),
        el("div", { class: "voices-search" }, UI.icon("search"), input, count, prev, next),
        body));
      draw(query.q || "");
    } else {
      right.appendChild(el("p", { class: "empty" }, "Transcript not available."));
    }

    var nav = el("nav", { class: "voices-pn", "aria-label": "Other voices" },
      el("a", { class: "btn btn--ghost", href: U.href("voices", prevP.id) }, UI.icon("arrow-left"), prevP.name),
      el("a", { class: "btn btn--ghost", href: U.href("voices", nextP.id) }, nextP.name, UI.icon("arrow-right")));

    root.appendChild(el("section", { class: "page voices voices--person" }, el("div", { class: "wrap" }, el("div", { class: "page-pad" },
      head,
      p.id === "P-GOPI" ? comic() : null,
      el("div", { class: "voices-cols" }, left, right),
      nav))));
  }

  /* Stack strip labels into rows so none overlap (measured after layout). */
  function layoutStrip() {
    var strip = st && st.root.querySelector(".voices-strip");
    if (!strip || !strip.offsetWidth) return;
    var pins = Array.prototype.slice.call(strip.querySelectorAll(".voices-strip-pin"));
    var rows = [];
    pins.forEach(function (pin) { pin.style.setProperty("--row", 0); });
    pins.map(function (pin) { var r = pin.querySelector(".lbl").getBoundingClientRect(); return { pin: pin, l: r.left, w: r.width }; })
      .sort(function (a, b) { return a.l - b.l; })
      .forEach(function (o) {
        var r = 0; while (rows[r] != null && rows[r] + 12 > o.l) r++;
        rows[r] = o.l + o.w;
        o.pin.style.setProperty("--row", r);
      });
    strip.style.setProperty("--rows", rows.length);
  }

  function draw(params, query) {
    st.root.textContent = "";
    if (params && params[0]) renderPerson(st.root, params[0], query || {});
    else { renderIndex(st.root); requestAnimationFrame(layoutStrip); }
    if (st.io) st.io.disconnect();
    st.io = UI.reveal(st.root.querySelectorAll(".voices-card, .voices-panel"), 50);
  }

  M.pages.voices = {
    id: "voices", route: "voices", title: "Voices", navLabel: "Voices", nav: true, navOrder: 6,
    render: function (root, ctx) {
      st = { root: root, io: null, person: ctx.params[0] || null, onResize: U.debounce(function () { layoutStrip(); }, 120) };
      window.addEventListener("resize", st.onResize);
      draw(ctx.params, ctx.query);
    },
    update: function (params, query) {
      var id = params[0] || null;
      if (id === st.person) return; /* same person: only the ?q= changed (we did that ourselves) */
      st.person = id;
      draw(params, query);
      window.scrollTo(0, 0);
    },
    destroy: function () { if (!st) return; if (st.io) st.io.disconnect(); window.removeEventListener("resize", st.onResize); st = null; },
    comic: comic
  };
})();
