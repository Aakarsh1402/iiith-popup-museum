/* way.js: The IIIT Way (Board 2), a scroll story. Owner: saharsh-claude (S4). Data: M.way.
   #/way/<chapterId> deep-links a chapter. Arrow Up/Down and PageUp/PageDown move between chapters.
   ?autoplay=1 moves one chapter every 14 s (and steps through the Himalaya blocks), looping; any input stops it. */
(function () {
  "use strict";
  var M = window.M, U = M.util, UI = M.ui, el = UI.el, svg = UI.svg;
  var STEP_MS = 14000;
  var st = null;

  var ICON = {
    server: "M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01M12 7h5M12 17h5",
    mail: "M3 6h18v12H3zM3 7l9 6 9-6",
    files: "M6 3h9l3 3v15H6zM15 3v3h3M9 10h6M9 14h6M9 18h4",
    online: "M3 5h18v11H3zM8 20h8M12 16v4",
    water: "M12 3c3 4 6 7.5 6 11a6 6 0 0 1-12 0c0-3.5 3-7 6-11z"
  };
  function icon(name) { return svg("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": 2, "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true" }, svg("path", { d: ICON[name] || ICON.files })); }
  function later(fn, ms) { var t = setTimeout(fn, ms); st.timers.push(t); return t; }
  function smooth() { return U.prefersReducedMotion() ? "instant" : "smooth"; }
  function fmt(n) { return n.toLocaleString("en-IN"); }
  function docThumb(d) {
    var doc = U.byId(M.documents || [], d.doc), pg = doc && doc.pages[(d.page || 1) - 1];
    if (!pg) return null;
    return el("a", { class: "way-doc", href: U.href("archive", d.doc, d.page || 1) },
      el("span", { class: "way-doc-img" }, el("img", { src: pg.thumb, alt: "", loading: "lazy" })),
      el("span", { class: "way-doc-lbl" }, UI.icon("doc"), d.label));
  }

  /* ---------- visuals ---------- */
  function vPhotos(ch) {
    var ids = (ch.images || []).filter(function (id) { return U.image(id); });
    return el("div", { class: "way-photos way-photos--" + ids.length }, ids.map(function (id, i) {
      return UI.imageFigure(id, { gallery: ids, ratio: i === 0 ? "16/10" : "4/3", className: "way-photo way-photo--" + i });
    }));
  }

  function vSchools(ch) {
    return el("div", { class: "way-schools" },
      el("div", { class: "way-schools-board" },
        el("div", { class: "way-schools-title mono" }, "Corporate schools on campus, c.2001"),
        el("ol", { class: "way-plates" }, (M.way.corporateSchools || []).map(function (s) { return el("li", { class: "way-plate" }, s); })),
        UI.sourceBadges(M.way.corporateSchoolsSources || ["S-PROSP"], { compact: true })),
      el("div", { class: "way-schools-side" },
        (ch.images || []).map(function (id) { return UI.imageFigure(id, { ratio: "16/10" }); }),
        ch.docs ? el("div", { class: "way-docs" }, ch.docs.map(docThumb)) : null));
  }

  function vEvidence() {
    var kinds = { oral: "mic", document: "doc", photo: "photo", web: "globe" };
    return el("div", { class: "way-evidence" },
      el("ol", { class: "way-ev-list" }, (M.way.evidence || []).map(function (n) {
        var pg = null;
        if (n.doc) { var d = U.byId(M.documents || [], n.doc); pg = d && d.pages[(n.page || 1) - 1]; }
        return el("li", { class: "way-ev", style: { "--c": "var(--s-" + n.kind + ")" } },
          el("span", { class: "way-ev-dot" }, UI.icon(kinds[n.kind] || "doc")),
          el("div", { class: "way-ev-card" },
            el("div", { class: "way-ev-kind mono" }, n.label),
            pg ? el("a", { class: "way-ev-thumb", href: U.href("archive", n.doc, n.page) }, el("img", { src: pg.thumb, alt: "", loading: "lazy" })) : null,
            el("p", null, n.text),
            UI.sourceBadges(n.sources, { compact: true })));
      }), el("li", { class: "way-ev way-ev--end" }, UI.stamp("Corroborated", "corroborated", true))));
  }

  function vTakebacks() {
    return el("div", { class: "way-stamps" }, (M.way.stamps || []).map(function (s, i) {
      return el("div", { class: "way-stamp", style: { "--r": [-6, 3, -2][i % 3] + "deg" } },
        el("span", { class: "way-stamp-top mono" }, "Returned to IIIT"),
        el("b", null, s.year),
        el("span", { class: "way-stamp-place" }, s.place),
        el("span", { class: "way-stamp-text" }, s.text),
        UI.sourceBadges(s.sources, { compact: true }));
    }));
  }

  /* Himalaya: four cardboard-box blocks, coloured by who paid. A sketch, not to scale. */
  var BLOCK_LAYOUT = { A: { x: 40, y: 150, w: 150, h: 92 }, C: { x: 220, y: 118, w: 200, h: 124 }, D: { x: 450, y: 150, w: 150, h: 92 }, KRB: { x: 280, y: 14, w: 220, h: 72 } };
  var BLOCK_COLOR = { own: "var(--banyan)", partner: "#C46A1C", partner2: "var(--slate)", state: "var(--plum)" };
  function vHimalaya() {
    var blocks = M.way.himalaya || [], DX = 26, DY = 18;
    var story = el("div", { class: "way-hb-story", "aria-live": "polite" });
    var svgEl = svg("svg", { viewBox: "0 0 640 270", class: "way-hb-svg", role: "group", "aria-label": "The four Himalaya blocks. Pick one to read its story." });
    svgEl.appendChild(svg("path", { d: "M20 250 L620 250", stroke: "var(--rule)", "stroke-width": 2 }));
    var nodes = {};
    blocks.forEach(function (b) {
      var L = BLOCK_LAYOUT[b.id] || { x: 20, y: 20, w: 120, h: 80 }, x = L.x, y = L.y, w = L.w, h = L.h;
      var g = svg("g", { class: "way-blk", tabindex: "0", role: "button", "aria-pressed": "false", "aria-label": b.name + ": " + b.funding, style: "--c: " + (BLOCK_COLOR[b.color] || "var(--ink-3)"),
        on: { click: function () { select(b.id, true); }, keydown: function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(b.id, true); } } } },
        svg("ellipse", { class: "way-blk-shadow", cx: x + w / 2 + DX / 2, cy: y + h + 4, rx: w / 2 + 10, ry: 7 }),
        svg("g", { class: "way-blk-lift" },
          svg("path", { class: "way-blk-top", d: "M" + x + " " + y + " l" + DX + " " + (-DY) + " h" + w + " l" + (-DX) + " " + DY + " z" }),
          svg("path", { class: "way-blk-side", d: "M" + (x + w) + " " + y + " l" + DX + " " + (-DY) + " v" + h + " l" + (-DX) + " " + DY + " z" }),
          svg("rect", { class: "way-blk-front", x: x, y: y, width: w, height: h }),
          svg("text", { class: "way-blk-name", x: x + 12, y: y + 30 }, b.name),
          svg("text", { class: "way-blk-role", x: x + 12, y: y + 52 }, b.short || b.role)));
      nodes[b.id] = g;
      svgEl.appendChild(g);
    });
    function select(id, fromUser) {
      var b = U.byId(blocks, id); if (!b) return;
      st.hbSelected = id;
      Object.keys(nodes).forEach(function (k) { nodes[k].classList.toggle("on", k === id); nodes[k].setAttribute("aria-pressed", String(k === id)); });
      svgEl.classList.add("has-sel");
      story.textContent = "";
      story.style.setProperty("--c", BLOCK_COLOR[b.color] || "var(--ink-3)");
      story.appendChild(el("div", { class: "kicker" }, b.funding));
      story.appendChild(el("h3", null, b.name));
      story.appendChild(el("p", null, b.story));
      story.appendChild(UI.sourceBadges(b.sources, { compact: true }));
      if (fromUser) stopAutoplay();
    }
    st.hbSelect = select;
    var loan = M.way.loan || {};
    var track = el("div", { class: "way-loan-track", "aria-label": "Ten years to repay. Paid off in six." },
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (y) { return el("span", { class: y <= 6 ? "paid" : "" }, String(y)); }));
    var wrap = el("div", { class: "way-hb" },
      el("div", { class: "way-hb-stage" },
        svgEl,
        el("div", { class: "way-hb-legend" }, (M.way.himalayaLegend || []).map(function (l) { return el("span", null, el("i", { style: { background: BLOCK_COLOR[l.color] } }), l.label); })),
        el("p", { class: "way-hb-note mono" }, "A sketch of how the blocks are funded, not a map. Not to scale.")),
      story,
      el("div", { class: "way-loan" },
        el("div", { class: "way-loan-stat" }, el("b", null, "22 crore"), el("span", null, "rupees borrowed, " + (loan.today || "about 70 crore today"))),
        el("div", { class: "way-loan-stat" }, el("b", null, "10 years"), el("span", null, "given to pay it back")),
        el("div", { class: "way-loan-stat" }, el("b", null, "6 years"), el("span", null, "to pay it all off")),
        el("div", { class: "way-loan-bar" }, track, el("span", { class: "mono small" }, "Years 7 to 10 were never needed.")),
        UI.sourceBadges(loan.sources || ["S-PJN"], { compact: true })));
    select("C", false);
    return wrap;
  }

  function vLeased() {
    var rows = (M.way.leased || []).map(function (r) { return { name: r[0], v: r[1], vacant: /vacant/i.test(r[0]) }; }).sort(function (a, b) { return b.v - a.v; });
    var max = Math.max.apply(null, rows.map(function (r) { return r.v; }).concat([1]));
    var top = Math.ceil(max / 5000) * 5000, ticks = [];
    for (var t = 0; t <= top; t += 5000) ticks.push(t);
    var total = M.way.leasedTotal || rows.reduce(function (s, r) { return s + r.v; }, 0);
    var tip = el("div", { class: "way-tip", role: "tooltip", hidden: true });
    function show(r, e, bar) {
      tip.hidden = false; tip.textContent = "";
      tip.appendChild(el("b", null, r.name));
      tip.appendChild(el("span", null, fmt(r.v) + " sq ft, " + Math.round(r.v / total * 1000) / 10 + "% of the leased space"));
      var host = bar.closest(".way-bars").getBoundingClientRect(), br = bar.getBoundingClientRect();
      tip.style.left = Math.min(host.width - 260, Math.max(0, br.right - host.left + 12)) + "px";
      tip.style.top = (br.top - host.top - 6) + "px";
    }
    function hide() { tip.hidden = true; }
    var chart = el("div", { class: "way-bars", role: "img", "aria-label": "Bar chart of leased space by tenant. Largest: " + rows[0].name + ", " + fmt(rows[0].v) + " sq ft." },
      el("div", { class: "way-bars-grid", "aria-hidden": "true" }, ticks.map(function (t) { return el("span", { style: { left: (t / top * 100) + "%" } }); })),
      rows.map(function (r) {
        var bar = el("span", { class: ["way-bar", r.vacant ? "way-bar--vacant" : ""], style: { width: Math.max(.4, r.v / top * 100) + "%" } });
        var row = el("div", { class: "way-bar-row", tabindex: "0",
          on: { pointerenter: function (e) { show(r, e, bar); }, pointerleave: hide, focus: function (e) { show(r, e, bar); }, blur: hide } },
          el("span", { class: "way-bar-name" }, r.name),
          el("span", { class: "way-bar-track" }, bar, el("span", { class: "way-bar-val mono", style: { left: "calc(" + (r.v / top * 100) + "% + .5rem)" } }, fmt(r.v))));
        return row;
      }),
      el("div", { class: "way-bars-axis mono", "aria-hidden": "true" }, el("span"), el("span", { class: "way-bars-ticks" }, ticks.map(function (t) { return el("span", { style: { left: (t / top * 100) + "%" } }, t === 0 ? "0" : (t / 1000) + "K"); }))),
      tip);
    var table = el("details", { class: "way-table" }, el("summary", null, "Show as a table"),
      el("table", null, el("thead", null, el("tr", null, el("th", null, "Tenant"), el("th", null, "Sq ft"))),
        el("tbody", null, rows.map(function (r) { return el("tr", null, el("td", null, r.name), el("td", null, fmt(r.v))); }),
          el("tr", null, el("td", null, "Empty (C6-101 and 102)"), el("td", null, "388")),
          el("tr", { class: "total" }, el("td", null, "Total"), el("td", null, fmt(total))))));
    return el("div", { class: "way-leased" },
      el("div", { class: "way-leased-head" },
        el("div", { class: "way-hero-num" }, el("b", null, fmt(total)), el("span", null, "sq ft leased out")),
        el("p", { class: "way-chart-title" }, "Spaces IIIT leased out, by tenant (sq ft)")),
      chart,
      el("p", { class: "mono small muted way-chart-note" }, M.way.leasedNote || ""),
      table,
      UI.sourceBadges(M.way.leasedSources || ["S-FLOORPLANS"], { compact: true }));
  }

  function vList() {
    return el("ul", { class: "way-own" }, (M.way.own || []).map(function (o) {
      return el("li", null,
        el("span", { class: "way-own-icon" }, icon(o.icon)),
        el("div", null,
          el("span", { class: "mono way-own-when" }, o.when),
          el("h3", null, o.title),
          el("p", null, o.text),
          UI.sourceBadges(o.sources, { compact: true })));
    }));
  }

  function vCivil(ch) {
    var ids = (ch.images || []).filter(function (id) { return U.image(id); });
    return el("div", { class: "way-civil" },
      el("div", { class: "way-civil-grid" }, ids.map(function (id) { return UI.imageFigure(id, { gallery: ids, ratio: "1/1" }); })),
      el("div", { class: "way-civil-docs" },
        el("h3", null, "Paper traces"),
        (M.way.civil || []).map(function (c) {
          return el("a", { class: "way-civil-doc", href: U.href("archive", c.doc, c.page) },
            el("span", { class: "mono" }, c.label + ", p." + c.page), el("span", null, c.text));
        })));
  }

  var VISUALS = { photos: vPhotos, schools: vSchools, evidence: vEvidence, takebacks: vTakebacks, himalaya: vHimalaya, leased: vLeased, list: vList, civil: vCivil };

  /* ---------- chapters ---------- */
  /* One sentence up front, the rest behind "Read more" (team rule: minimal text, details behind a click). */
  var ABBR = /(?:^|\s)(?:Mr|Mrs|Ms|Dr|Prof|Rs|St|c|vs|[A-Z])$/;
  function firstSentence(text) {
    var re = /[.!?]["')]?\s+/g, m;
    while ((m = re.exec(text))) { if (!ABBR.test(text.slice(0, m.index))) return [text.slice(0, m.index + m[0].length).trim(), text.slice(m.index + m[0].length)]; }
    return [text, ""];
  }
  function leadMore(text, cls) {
    var parts = firstSentence(text || "");
    if (!parts[1]) return el("p", { class: cls }, parts[0]);
    return el("div", { class: "way-lead" }, el("p", { class: cls }, parts[0]),
      el("details", { class: "way-more" }, el("summary", null, el("span", { class: "way-more-open" }, "Read more"), el("span", { class: "way-more-close" }, "Show less")), el("p", { class: cls }, parts[1])));
  }

  function chapter(ch, i) {
    var links = [];
    if (ch.conflictId) links.push(UI.confidenceTag("contested", ch.conflictId));
    if (ch.verifiedId) links.push(el("a", { class: "stamp stamp--corroborated", href: U.href("how-we-know", ch.verifiedId) }, UI.icon("check"), "Checked: see how"));
    var text = el("div", { class: "way-text" },
      el("div", { class: "way-kicker" }, el("span", { class: "way-num mono" }, String(i + 1).padStart(2, "0")), el("span", { class: "kicker" }, ch.kicker)),
      el("h2", { id: "way-h-" + ch.id }, ch.title),
      leadMore(ch.body, "way-body"),
      ch.ask ? el("p", { class: "way-ask" }, ch.ask) : null,
      links.length ? el("div", { class: "way-links" }, links) : null,
      ch.visual !== "schools" && ch.visual !== "civil" && ch.docs ? el("div", { class: "way-docs" }, ch.docs.map(docThumb)) : null,
      UI.sourceLine(ch.sources),
      UI.sourceBadges(ch.sources, { compact: true }));
    var vis = VISUALS[ch.visual] ? VISUALS[ch.visual](ch) : null;
    return el("section", { class: ["way-ch", "way-ch--" + ch.visual], id: "way-" + ch.id, dataset: { ch: ch.id }, "aria-labelledby": "way-h-" + ch.id },
      el("div", { class: "way-ch-inner" }, text, el("div", { class: "way-vis" }, vis)));
  }

  function goTo(id, opts) {
    opts = opts || {};
    var node = id === "intro" ? st.intro : document.getElementById("way-" + id);
    if (!node) return;
    var off = parseFloat(getComputedStyle(document.documentElement).fontSize) * 4 + (st.railScroll ? st.rail.offsetHeight : 0);
    var y = id === "intro" ? 0 : node.getBoundingClientRect().top + window.scrollY - off;
    window.scrollTo({ top: Math.max(0, y), behavior: opts.instant ? "instant" : smooth() });
    setCurrent(id);
    if (opts.url) M.router.replace(id === "intro" ? U.href("way") : U.href("way", id));
  }
  function order() { return ["intro"].concat((M.way.chapters || []).map(function (c) { return c.id; })); }
  function setCurrent(id) {
    st.current = id;
    Array.prototype.forEach.call(st.rail.querySelectorAll("button"), function (b) {
      if (b.dataset.ch === id) { b.setAttribute("aria-current", "step"); if (st.railScroll) b.scrollIntoView({ block: "nearest", inline: "center" }); }
      else b.removeAttribute("aria-current");
    });
  }
  /** The chapter whose top has passed 45% of the viewport. */
  function currentFromScroll() {
    var o = order(), cur = "intro", line = window.innerHeight * 0.45;
    o.forEach(function (id) {
      var n = id === "intro" ? st.intro : document.getElementById("way-" + id);
      if (n && n.getBoundingClientRect().top <= line) cur = id;
    });
    return cur;
  }
  function onScroll() {
    if (st.scrollRaf) return;
    st.scrollRaf = requestAnimationFrame(function () { if (!st) return; st.scrollRaf = 0; var c = currentFromScroll(); if (c !== st.current) setCurrent(c); });
  }
  function move(d) {
    var o = order(), i = o.indexOf(currentFromScroll());
    goTo(o[U.clamp(i + d, 0, o.length - 1)], { url: true });
  }
  function onKey(e) {
    var t = e.target, tag = t && t.tagName;
    if (e.ctrlKey || e.metaKey || e.altKey || tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    if (e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); move(1); }
    else if (e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); move(-1); }
  }

  /* ---------- autoplay ---------- */
  function startAutoplay() {
    if (st.playing) return;
    st.playing = true;
    var o = order(), i = Math.max(0, o.indexOf(currentFromScroll()));
    (function step() {
      if (!st || !st.playing) return;
      var id = o[i % o.length]; i++;
      goTo(id);
      var ch = U.byId(M.way.chapters || [], id);
      if (ch && ch.visual === "himalaya" && st.hbSelect) {
        (M.way.himalaya || []).forEach(function (b, k) { later(function () { if (st && st.playing) st.hbSelect(b.id, false); }, k * (STEP_MS / 4)); });
      }
      later(step, id === "intro" ? 6000 : STEP_MS);
    })();
    st.unsub.push(M.kiosk.onInput(stopAutoplay));
  }
  function stopAutoplay() {
    if (!st || !st.playing) return;
    st.playing = false;
    st.timers.forEach(clearTimeout); st.timers = [];
  }

  M.pages.way = {
    id: "way", route: "way", title: "The IIIT way", navLabel: "The IIIT way", nav: true, navOrder: 4,

    render: function (root, ctx) {
      st = { timers: [], unsub: [], playing: false, current: "intro", scrollRaf: 0, hbSelect: null, railScroll: false };
      var W = M.way || { chapters: [] };
      st.rail = el("nav", { class: "way-rail", "aria-label": "Chapters" },
        el("button", { type: "button", class: "way-rail-intro", dataset: { ch: "intro" }, on: { click: function () { stopAutoplay(); goTo("intro", { url: true }); } } }, el("span", { class: "mono" }, "00"), el("span", null, "Start")),
        W.chapters.map(function (c, i) {
          return el("button", { type: "button", dataset: { ch: c.id }, on: { click: function () { stopAutoplay(); goTo(c.id, { url: true }); } } },
            el("span", { class: "mono" }, String(i + 1).padStart(2, "0")), el("span", null, c.title));
        }));
      st.intro = el("header", { class: "way-intro", id: "way-intro", dataset: { ch: "intro" } },
        el("div", { class: "way-intro-text" },
          el("div", { class: "kicker" }, "Board 2 / The IIIT Way"),
          el("h1", null, W.title),
          el("p", { class: "lede" }, W.intro),
          el("ol", { class: "way-verbs" }, ["Borrow", "Share", "Take back", "Build your own"].map(function (v, i) { return el("li", null, el("span", { class: "mono" }, String(i + 1)), v); })),
          el("button", { type: "button", class: "btn btn--green", on: { click: function () { stopAutoplay(); goTo(W.chapters[0].id, { url: true }); } } }, "Start reading", UI.icon("chevron-down")),
          W.sources ? el("div", { class: "way-intro-src" }, UI.sourceBadges(W.sources, { compact: true })) : null),
        el("div", { class: "way-intro-art", "aria-hidden": "true" }, el("img", { src: "assets/img/banyan-color.png", alt: "", onerror: "this.style.display='none'" })));

      var page = el("section", { class: "page way" }, el("div", { class: "wrap way-layout" },
        st.rail,
        el("div", { class: "way-main" }, st.intro, W.chapters.map(chapter))));
      root.appendChild(page);

      st.railScroll = window.matchMedia("(max-width: 1100px)").matches;
      window.addEventListener("scroll", onScroll, { passive: true });
      st.reveal = UI.reveal(page.querySelectorAll(".way-vis"), 0);
      document.addEventListener("keydown", onKey);
      setCurrent("intro");
      var target = ctx.params[0];
      if (target) later(function () { goTo(target, { instant: true }); }, 60);
      if (ctx.query.autoplay === "1") later(startAutoplay, target ? 400 : 1500);
    },

    update: function (params, query) {
      if (params[0]) goTo(params[0]);
      if (query.autoplay === "1") startAutoplay();
    },

    destroy: function () {
      if (!st) return;
      stopAutoplay();
      st.timers.forEach(clearTimeout);
      st.unsub.forEach(function (f) { f(); });
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(st.scrollRaf);
      if (st.reveal) st.reveal.disconnect();
      st = null;
    }
  };
})();
