/* timeline.js: the zoomable timeline (centrepiece). Owner: aakarsh-claude (A5).
   Semantic zoom: overview = stacked dots per year; zoom in = compact cards; further = full cards with photos.
   View state is (centre year, px per year). Everything is positioned with transforms every frame. */
(function () {
  "use strict";
  var M = window.M, el = M.ui.el, U = M.util;

  var ERAS = [
    { id: "before", label: "Before IIIT", from: 1994.6, to: 1998, color: "rgba(122,115,102,.07)", ink: "var(--ink-3)" },
    { id: "founding", label: "Founding", years: "1998 to 2002", from: 1998, to: 2003, color: "rgba(169,80,44,.10)", ink: "var(--soil)" },
    { id: "growing", label: "Growing", years: "2003 to 2014", from: 2003, to: 2015, color: "rgba(201,150,46,.10)", ink: "var(--ochre-ink)" },
    { id: "takingback", label: "Taking back", years: "2015 to 2022", from: 2015, to: 2023, color: "rgba(47,93,58,.10)", ink: "var(--banyan)" },
    { id: "now", label: "Now", years: "2023 to 2026", from: 2023, to: 2027, color: "rgba(62,92,118,.10)", ink: "var(--slate)" },
    { id: "undated", label: "Undated", years: "dates unknown", from: 2027.6, to: 2031, color: "rgba(138,133,119,.09)", ink: "var(--ink-3)" }
  ];
  var MIN_YEAR = 1994.6, MAX_YEAR = 2031;
  var DOT_MAX = 105, FULL_MIN = 380;          // px-per-year thresholds for dots / compact / full
  var CARD = { compact: { w: 240, h: 80 }, full: { w: 310, h: 118 } };

  var S = null; // page state

  function eraOf(id) { return ERAS.filter(function (e) { return e.id === id; })[0]; }

  /* ---------- world positions (stable, independent of filters) ---------- */
  function computeWorld(events) {
    var byYear = {};
    events.forEach(function (e) { var k = e.year == null ? "u" : e.year; (byYear[k] = byYear[k] || []).push(e); });
    Object.keys(byYear).forEach(function (k) {
      var list = byYear[k].sort(function (a, b) { return (a.sort || 0) - (b.sort || 0); });
      list.forEach(function (e, i) {
        if (k === "u") e._x = 2028 + (i + 0.5) / list.length * 2.6;
        else e._x = +k + 0.12 + (i + 0.5) / list.length * 0.76;
        e._stack = i; e._stackN = list.length;
      });
    });
  }

  /* ---------- view math ---------- */
  function sx(year) { return (year - S.center) * S.ppy + S.w / 2; }
  function yearAt(px) { return (px - S.w / 2) / S.ppy + S.center; }
  function minPpy() { return (S.w - 80) / (MAX_YEAR - MIN_YEAR); }
  function maxPpy() { return Math.max(1300, S.w / 1.4); }
  function clampView() {
    S.ppy = U.clamp(S.ppy, minPpy(), maxPpy());
    var half = S.w / 2 / S.ppy, lo = MIN_YEAR + half - 0.6, hi = MAX_YEAR - half + 0.6;
    S.center = lo > hi ? (MIN_YEAR + MAX_YEAR) / 2 : U.clamp(S.center, lo, hi);
  }
  function mode() { return S.ppy < DOT_MAX ? "dot" : (S.ppy < FULL_MIN ? "compact" : "full"); }

  /* ---------- filters ---------- */
  function visibleEvent(e) {
    if (S.filter !== "all" && (e.category || []).indexOf(S.filter) < 0) return false;
    return true;
  }

  /* ---------- lane packing (depends on zoom + filter, not on pan) ---------- */
  function packLanes() {
    var m = mode(), card = CARD[m === "full" ? "full" : "compact"];
    var gapY = 12, above = S.axisY - 40 - 50, below = S.trackH - S.axisY - 40 - S.rangeH - 6;
    var nA = Math.max(1, Math.floor(above / (card.h + gapY))), nB = Math.max(1, Math.floor(below / (card.h + gapY)));
    var order = [];
    for (var i = 0; i < Math.max(nA, nB); i++) { if (i < nA) order.push({ side: -1, i: i }); if (i < nB) order.push({ side: 1, i: i }); }
    var lanes = order.map(function () { return []; });
    var pr = function (e) { return e.id === S.openId ? 0 : (e.featured ? 1 : 2); };
    var list = S.events.filter(function (e) { return e._vis; }).sort(function (a, b) { return pr(a) - pr(b) || a._x - b._x; });
    list.forEach(function (e) {
      e._lane = null;
      if (m === "dot") return;
      var a = e._x * S.ppy - 18, b = a + card.w;                 // world px (pan independent)
      for (var k = 0; k < order.length; k++) {
        var free = lanes[k].every(function (iv) { return b + 14 <= iv[0] || a >= iv[1] + 14; });
        if (free) { lanes[k].push([a, b]); e._lane = order[k]; break; }
      }
    });
    S.cardSize = card; S.gapY = gapY;
  }

  /* ---------- render loop ---------- */
  function layout() {
    var m = mode();
    if (m !== S.lastMode || S.lastPpyPack == null || Math.abs(S.ppy - S.lastPpyPack) / S.lastPpyPack > 0.015 || S.dirty) {
      packLanes(); S.lastPpyPack = S.ppy; S.dirty = false;
      if (m !== S.lastMode) { S.track.dataset.mode = m; S.lastMode = m; }
    }
    var card = S.cardSize;
    // eras
    ERAS.forEach(function (er, i) {
      var l = sx(er.from), r = sx(er.to), node = S.eraEls[i];
      node.style.transform = "translateX(" + l.toFixed(1) + "px)";
      node.style.width = Math.max(0, r - l).toFixed(1) + "px";
      var lab = node.firstChild, labW = lab.offsetWidth || 120;
      var pad = U.clamp(-l + 16, 16, Math.max(16, r - l - labW - 16));
      lab.style.transform = "translateX(" + pad.toFixed(1) + "px)";
    });
    // ticks
    var every = S.ppy > 70 ? 1 : (S.ppy > 26 ? 5 : 10);
    S.ticks.forEach(function (t) {
      var x = sx(t.year);
      var show = x > -60 && x < S.w + 60;
      t.el.style.transform = "translateX(" + x.toFixed(1) + "px)";
      t.el.style.visibility = show ? "" : "hidden";
      t.el.classList.toggle("lbl", t.year % every === 0);
    });
    // range bars
    S.ranges.forEach(function (r) {
      var l = sx(r.e._x - 0.1), rr = sx(r.e.yearEnd + 0.9);
      r.el.style.transform = "translate(" + l.toFixed(1) + "px," + (S.axisY + 30 + r.row * 8) + "px)";
      r.el.style.width = Math.max(4, rr - l).toFixed(1) + "px";
      r.el.classList.toggle("hide", !r.e._vis);
    });
    // events
    S.events.forEach(function (e) {
      var x = sx(e._x), y, stem = 0, sTop = S.axisY, n = e._node;
      if (!e._vis) { n.outer.style.transform = "translateX(" + x.toFixed(1) + "px)"; n.stem.style.opacity = "0"; return; }
      var on = x > -card.w - 40 && x < S.w + 40;
      n.outer.style.visibility = on ? "" : "hidden";
      if (m === "dot" || !e._lane) {
        y = S.axisY - 14 - e._dotRow * 15;
        if (m !== "dot" && !e._lane) y = S.axisY;   // overflow: marker on the axis
        n.outer.classList.add("as-dot");
        n.stem.style.opacity = "0";
      } else {
        n.stem.style.opacity = "";
        n.outer.classList.remove("as-dot");
        if (e._lane.side < 0) { y = S.axisY - 40 - (e._lane.i + 1) * (card.h + S.gapY) + S.gapY; stem = S.axisY - (y + card.h); sTop = y + card.h; }
        else { y = S.axisY + 40 + S.rangeH + e._lane.i * (card.h + S.gapY); stem = y - S.axisY; sTop = S.axisY; }
        n.outer.dataset.side = e._lane.side < 0 ? "up" : "down";
      }
      n.outer.style.transform = "translateX(" + x.toFixed(1) + "px)";
      n.inner.style.transform = "translateY(" + y.toFixed(1) + "px)";
      n.stem.style.transform = "translate(" + x.toFixed(1) + "px," + sTop.toFixed(1) + "px)";
      n.stem.style.height = Math.max(0, stem).toFixed(0) + "px";
      n.stem.classList.toggle("up", !!(e._lane && e._lane.side < 0));
      n.stem.classList.toggle("sel", e.id === S.openId);
    });
    // minimap brush
    var mw = S.mini.clientWidth, span = MAX_YEAR - MIN_YEAR;
    var bl = (yearAt(0) - MIN_YEAR) / span * mw, br = (yearAt(S.w) - MIN_YEAR) / span * mw;
    S.brush.style.transform = "translateX(" + U.clamp(bl, 0, mw).toFixed(1) + "px)";
    S.brush.style.width = Math.max(10, U.clamp(br, 0, mw) - U.clamp(bl, 0, mw)).toFixed(1) + "px";
    S.zoomLabel.textContent = m === "dot" ? "Overview" : (m === "compact" ? "Closer" : "Close up");
    S.hint.classList.toggle("show", m === "dot");
  }
  function requestLayout() { if (!S.raf) S.raf = requestAnimationFrame(function () { S.raf = 0; if (S) layout(); }); }

  /* ---------- animation: fly between views (zoom out, pan, zoom in) ---------- */
  function flyTo(center, ppy, dur) {
    if (S.cancelFly) S.cancelFly();
    var c0 = S.center, p0 = S.ppy;
    var target = { center: center, ppy: ppy };
    var saveP = S.ppy, saveC = S.center; S.ppy = ppy; S.center = center; clampView(); target.ppy = S.ppy; target.center = S.center; S.ppy = saveP; S.center = saveC;
    var distPx = Math.abs(target.center - c0) * Math.min(p0, target.ppy);
    var dip = Math.max(0, Math.log(Math.max(1, distPx / (S.w * 0.6)))) * 0.75;
    var lp0 = Math.log(p0), lp1 = Math.log(target.ppy);
    dur = U.prefersReducedMotion() ? 1 : (dur || (900 + Math.min(900, dip * 500)));
    S.flying = true;
    S.cancelFly = U.tween({ from: 0, to: 1, duration: dur, ease: U.easeInOutCubic, onUpdate: function (t) {
      S.ppy = Math.exp(U.lerp(lp0, lp1, t) - dip * Math.sin(Math.PI * t));
      // move the centre so the pan feels even on screen
      S.center = U.lerp(c0, target.center, t);
      clampView(); layout();
    }, onDone: function () { S.cancelFly = null; S.flying = false; } });
  }
  function zoomAround(factor, anchorPx, animate) {
    var a = anchorPx == null ? S.w / 2 : anchorPx;
    var yA = yearAt(a), p1 = U.clamp(S.ppy * factor, minPpy(), maxPpy());
    var c1 = yA - (a - S.w / 2) / p1;
    if (animate) flyTo(c1, p1, 520);
    else { S.ppy = p1; S.center = c1; clampView(); requestLayout(); }
  }
  function focusEvent(e, opts) {
    opts = opts || {};
    var p = Math.max(S.ppy, opts.ppy || FULL_MIN * 1.25);
    var offset = S.sheet.isOpen() || opts.withSheet ? (S.w * 0.2) / p : 0;   // keep the card clear of the panel
    flyTo(e._x + offset, p);
  }
  function showEra(id) {
    var er = eraOf(id); if (!er) return;
    var p = (S.w - 120) / (er.to - er.from);
    flyTo((er.from + er.to) / 2, Math.max(p, minPpy()));
  }

  /* ---------- DOM ---------- */
  function catColor(e) { return M.ui.category((e.category || [])[0]).color; }

  function buildEvent(e) {
    var im = (e.images || []).map(U.image).filter(Boolean)[0];
    var conf = e.confidence;
    var card = el("button", { class: "tl-card", type: "button", "aria-label": U.formatYear(e) + ": " + e.title, on: { click: function (ev) { ev.stopPropagation(); openEvent(e.id, true); } } },
      el("span", { class: "tl-card-stripe" }),
      el("span", { class: "tl-card-body" },
        el("span", { class: "tl-date" }, U.formatYear(e)),
        el("span", { class: "tl-title" }, e.title),
        el("span", { class: "tl-meta" },
          (e.category || []).map(function (c) { return el("span", { class: "cat-dot", style: { "--c": M.ui.category(c).color }, title: M.ui.category(c).label }); }),
          conf === "contested" ? el("span", { class: "tl-flag contested" }, "Sources disagree") : conf === "corroborated" ? el("span", { class: "tl-flag ok" }, "Corroborated") : conf === "todo" ? el("span", { class: "tl-flag todo" }, "To check") : null)),
      im ? el("span", { class: "tl-thumb" }, el("img", { src: im.thumb, alt: "", loading: "lazy", draggable: "false" })) : null);
    var dot = el("button", { class: "tl-dot", type: "button", tabindex: "-1", "aria-hidden": "true", on: { click: function (ev) { ev.stopPropagation(); openEvent(e.id, true); } } });
    var tip = el("span", { class: "tl-tip" }, el("b", null, U.formatYear(e)), " ", e.title);
    var inner = el("div", { class: "tl-ev-inner" }, dot, card, tip);
    var stem = el("div", { class: "tl-stem2", style: { "--c": catColor(e) } });
    var outer = el("div", { class: ["tl-ev", e.featured ? "featured" : "", conf === "contested" ? "contested" : ""], style: { "--c": catColor(e) }, dataset: { id: e.id } }, inner);
    e._node = { outer: outer, inner: inner, card: card, stem: stem };
    return outer;
  }

  function applyFilter() {
    var n = 0;
    var perYear = {};
    S.events.forEach(function (e) {
      e._vis = visibleEvent(e);
      var dim = S.contested && e.confidence !== "contested";
      e._node.outer.classList.toggle("out", !e._vis);
      e._node.outer.classList.toggle("dim", !!dim && e._vis);
      if (e._vis) {
        n++;
        var k = e.year == null ? "u" : e.year;
        e._dotRow = perYear[k] = (perYear[k] == null ? 0 : perYear[k] + 1);
      }
    });
    S.count.textContent = n + (n === 1 ? " event" : " events");
    S.dirty = true;
    // minimap dots
    S.miniDots.textContent = "";
    var span = MAX_YEAR - MIN_YEAR, rows = {};
    S.events.forEach(function (e) {
      if (!e._vis) return;
      var k = Math.floor(e._x * 2); rows[k] = (rows[k] || 0) + 1;
      S.miniDots.appendChild(el("i", { style: { left: ((e._x - MIN_YEAR) / span * 100).toFixed(3) + "%", bottom: (6 + (rows[k] - 1) * 4) + "px", background: catColor(e) } }));
    });
    requestLayout();
  }

  function syncQuery(replace) {
    var q = {};
    if (S.filter !== "all") q.filter = S.filter;
    if (S.contested) q.contested = "1";
    if (S.era) q.era = S.era;
    var id = S.openId ? "/" + S.openId : "";
    var h = "#/timeline" + id + U.buildQuery(q);
    if (replace !== false) M.router.replace(h);
    return h;
  }

  /* ---------- detail sheet ---------- */
  function sheetContent(e) {
    var era = eraOf(e.era);
    var list = S.events.filter(function (x) { return x._vis; }).sort(function (a, b) { return a._x - b._x; });
    var idx = list.indexOf(e);
    var prev = list[idx - 1], next = list[idx + 1];
    S.sheet.setBar([
      el("button", { class: "icon-btn", "aria-label": "Previous event", disabled: !prev, on: { click: function () { if (prev) openEvent(prev.id, true); } } }, M.ui.icon("chevron-left")),
      el("button", { class: "icon-btn", "aria-label": "Next event", disabled: !next, on: { click: function () { if (next) openEvent(next.id, true); } } }, M.ui.icon("chevron-right")),
      el("span", { class: "mono small muted", style: { marginLeft: ".4rem" } }, (idx + 1) + " of " + list.length)
    ]);
    var imgs = (e.images || []).filter(function (id) { return U.image(id); });
    var places = (e.places || []).map(U.place).filter(Boolean);
    var people = (e.people || []).map(U.person).filter(Boolean);
    var conflict = e.conflictId ? U.byId(M.conflicts || [], e.conflictId) : null;
    var wrap = el("div", { class: "tl-detail", style: { "--c": catColor(e) } },
      el("div", { class: "tl-d-top" },
        el("span", { class: "tl-d-date" }, U.formatYear(e)),
        era ? el("span", { class: "tl-d-era", style: { color: era.ink } }, era.label) : null,
        M.ui.confidenceTag(e.confidence, e.conflictId)),
      el("h2", { class: "tl-d-title" }, e.title),
      el("p", { class: "tl-d-sum" }, e.summary),
      imgs.length ? el("div", { class: ["tl-d-imgs", imgs.length === 1 ? "one" : ""] }, imgs.slice(0, 6).map(function (id) { return M.ui.imageFigure(id, { gallery: imgs, caption: imgs.length <= 2, ratio: imgs.length === 1 ? null : "4/3" }); })) : null,
      e.body ? el("p", { class: "tl-d-body" }, e.body) : null,
      e.id === "e-1998-booth" && M.pages.voices && M.pages.voices.comic ? el("div", { class: "tl-d-comic" }, M.pages.voices.comic({ compact: true })) : null,
      conflict ? el("a", { class: "tl-d-conflict", href: U.href("how-we-know", conflict.id) },
        M.ui.icon("alert"), el("span", null, el("b", null, "Sources disagree. "), conflict.question || "See how the accounts differ."), M.ui.icon("arrow-right")) : null,
      el("dl", { class: "tl-d-facts" },
        el("dt", null, "Category"), el("dd", null, (e.category || []).map(function (c) { var k = M.ui.category(c); return el("span", { class: "tag", style: { "--c": k.color } }, el("span", { class: "cat-dot" }), k.label); })),
        places.length ? [el("dt", null, "Where"), el("dd", null, places.map(function (p) { return el("a", { class: "tl-chip-link", href: U.href("map", p.id) }, M.ui.icon("pin"), p.name); }))] : null,
        people.length ? [el("dt", null, "Who told us"), el("dd", null, people.map(function (p) { return el("a", { class: "tl-chip-link", href: U.href("voices", p.id) }, M.ui.avatar(p, "1.6rem"), p.name); }))] : null),
      el("div", { class: "tl-d-sources" }, el("div", { class: "kicker", style: { color: "var(--ink-2)" } }, "Sources"), M.ui.sourceBadges(e.sources)));
    return wrap;
  }

  function openEvent(id, fly) {
    var e = U.byId(S.events, id);
    if (!e) return;
    if (!e._vis) { S.filter = "all"; S.chips.setActive("all"); applyFilter(); }
    S.openId = id;
    S.events.forEach(function (x) { x._node.outer.classList.toggle("sel", x.id === id); });
    S.dirty = true; requestLayout();
    S.sheet.setContent(sheetContent(e));
    var wasOpen = S.sheet.isOpen();
    S.sheet.open();
    S.root.classList.add("sheet-open");
    if (fly !== false) focusEvent(e, { withSheet: true });
    var h = syncQuery(false);
    if (location.hash !== h) { S.selfNav = true; location.hash = h; }
    if (!wasOpen) requestLayout();
  }
  function closeEvent(fromSheet) {
    S.openId = null;
    S.events.forEach(function (x) { x._node.outer.classList.remove("sel"); });
    if (!fromSheet) S.sheet.close(true);
    S.root.classList.remove("sheet-open");
    var h = syncQuery(false);
    if (location.hash !== h) { S.selfNav = true; location.hash = h; }
  }

  /* ---------- autoplay ---------- */
  function startAutoplay() {
    stopAutoplay();
    var list = S.events.filter(function (e) { return e.featured && e._vis && (!S.era || e.era === S.era); }).sort(function (a, b) { return a._x - b._x; });
    if (!list.length) return;
    var i = 0;
    S.autoplay = true;
    S.root.classList.add("autoplaying");
    function step() {
      if (!S || !S.autoplay) return;
      var e = list[i % list.length]; i++;
      openEvent(e.id, true);
      S.autoTimer = setTimeout(step, 9000);
    }
    // open with a sweeping overview first
    flyTo(S.center, minPpy() * 1.02, 900);
    S.autoTimer = setTimeout(step, 1600);
    S.offInput = M.kiosk.onInput(function (ev) {
      if (ev.type === "pointermove") return;     // small mouse nudges don't stop the show
      stopAutoplay();
    });
  }
  function stopAutoplay() {
    if (!S) return;
    S.autoplay = false; clearTimeout(S.autoTimer);
    if (S.offInput) { S.offInput(); S.offInput = null; }
    S.root && S.root.classList.remove("autoplaying");
  }

  /* ---------- interaction ---------- */
  function bindTrack(track) {
    var drag = null, vel = 0, lastT = 0, inertia = 0;
    function down(e) {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      if (S.cancelFly) { S.cancelFly(); S.cancelFly = null; S.flying = false; }
      cancelAnimationFrame(inertia);
      drag = { x: e.clientX, c: S.center, moved: 0, id: e.pointerId };
      vel = 0; lastT = performance.now();
    }
    function move(e) {
      if (!drag || e.pointerId !== drag.id) return;
      var dx = e.clientX - drag.x;
      if (!drag.cap && Math.abs(dx) > 4) { drag.cap = true; track.setPointerCapture(e.pointerId); track.classList.add("dragging"); }
      if (!drag.cap) return;
      var now = performance.now(), prevC = S.center;
      S.center = drag.c - dx / S.ppy; clampView();
      vel = (S.center - prevC) / Math.max(1, now - lastT) * 16; lastT = now;
      drag.moved = Math.abs(dx);
      requestLayout();
    }
    function up() {
      if (!drag) return;
      var wasDrag = drag.cap; drag = null;
      track.classList.remove("dragging");
      if (wasDrag) {
        track._suppress = true; setTimeout(function () { track._suppress = false; }, 0);
        if (!U.prefersReducedMotion() && performance.now() - lastT < 90) {
          (function glide() { vel *= 0.93; if (Math.abs(vel * S.ppy) < 0.3) return; S.center += vel; clampView(); layout(); inertia = requestAnimationFrame(glide); })();
        }
      }
    }
    track.addEventListener("pointerdown", down);
    track.addEventListener("pointermove", move);
    track.addEventListener("pointerup", up);
    track.addEventListener("pointercancel", up);
    track.addEventListener("click", function (e) { if (track._suppress) { e.stopPropagation(); e.preventDefault(); } }, true);
    track.addEventListener("wheel", function (e) {
      e.preventDefault();
      if (S.cancelFly) { S.cancelFly(); S.cancelFly = null; }
      var r = track.getBoundingClientRect();
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && !e.ctrlKey) { S.center += e.deltaX / S.ppy; clampView(); requestLayout(); return; }
      var dy = e.deltaMode === 1 ? e.deltaY * 30 : e.deltaY;
      zoomAround(Math.exp(-dy * (e.ctrlKey ? 0.01 : 0.0018)), e.clientX - r.left, false);
    }, { passive: false });
    track.addEventListener("dblclick", function (e) { var r = track.getBoundingClientRect(); zoomAround(2.2, e.clientX - r.left, true); });
    S.cleanup.push(function () { cancelAnimationFrame(inertia); });
  }

  function bindMini(mini) {
    var dragging = false;
    function toYear(e) { var r = mini.getBoundingClientRect(); return MIN_YEAR + U.clamp((e.clientX - r.left) / r.width, 0, 1) * (MAX_YEAR - MIN_YEAR); }
    mini.addEventListener("pointerdown", function (e) {
      dragging = true; mini.setPointerCapture(e.pointerId);
      flyTo(toYear(e), S.ppy, 420);
    });
    mini.addEventListener("pointermove", function (e) { if (!dragging) return; if (S.cancelFly) { S.cancelFly(); S.cancelFly = null; } S.center = toYear(e); clampView(); requestLayout(); });
    mini.addEventListener("pointerup", function () { dragging = false; });
  }

  function onKey(e) {
    if (!S) return;
    var t = e.target; if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
    if (e.key === "+" || e.key === "=") { zoomAround(1.8, null, true); e.preventDefault(); }
    else if (e.key === "-" || e.key === "_") { zoomAround(1 / 1.8, null, true); e.preventDefault(); }
    else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      var list = S.events.filter(function (x) { return x._vis; }).sort(function (a, b) { return a._x - b._x; });
      var cur = S.openId ? U.byId(S.events, S.openId) : null, i;
      if (cur) i = list.indexOf(cur) + (e.key === "ArrowRight" ? 1 : -1);
      else { var c = S.center; i = 0; while (i < list.length - 1 && list[i]._x < c) i++; if (e.key === "ArrowLeft") i--; }
      i = U.clamp(i, 0, list.length - 1);
      if (list[i]) { e.preventDefault(); openEvent(list[i].id, true); }
    }
  }

  /* ---------- phone list ---------- */
  function renderList(root, query) {
    var filter = query.filter || "all";
    var box = el("div", { class: "tl-list" });
    function draw() {
      box.textContent = "";
      ERAS.forEach(function (er) {
        var evs = (M.events || []).filter(function (e) { return e.era === er.id && (filter === "all" || (e.category || []).indexOf(filter) >= 0); }).sort(U.byYear);
        if (!evs.length) return;
        box.appendChild(el("h2", { class: "tl-list-era", style: { color: er.ink } }, er.label, el("small", null, er.years || "")));
        evs.forEach(function (e) {
          var im = (e.images || []).map(U.image).filter(Boolean)[0];
          box.appendChild(el("details", { class: "tl-list-item", style: { "--c": catColor(e) } },
            el("summary", null, el("span", { class: "tl-date" }, U.formatYear(e)), el("span", { class: "tl-title" }, e.title)),
            el("div", { class: "tl-list-body" },
              im ? M.ui.imageFigure(im.id, { gallery: e.images }) : null,
              el("p", null, e.summary), e.body ? el("p", { class: "muted" }, e.body) : null,
              M.ui.confidenceTag(e.confidence, e.conflictId), M.ui.sourceBadges(e.sources))));
        });
      });
    }
    var chips = M.ui.chips([{ id: "all", label: "All" }].concat(M.ui.CATEGORIES), filter, function (id) { filter = id; chips.setActive(id); draw(); });
    root.appendChild(el("section", { class: "page wrap page-pad tl-phone" },
      el("div", { class: "kicker" }, "Boards 1 and 2"), el("h1", null, "Timeline"),
      el("p", { class: "lede" }, "Tap an event to open it."), chips, box));
    draw();
  }

  /* ---------- page ---------- */
  M.pages.timeline = {
    id: "timeline", route: "timeline", title: "Timeline", navLabel: "Timeline", nav: true, navOrder: 2,
    render: function (root, ctx) {
      if (window.innerWidth < 700) { renderList(root, ctx.query); S = null; return; }
      var q = ctx.query || {};
      S = { events: (M.events || []).slice(), filter: q.filter || "all", contested: q.contested === "1", era: q.era || null,
        cleanup: [], openId: null, center: 2010, ppy: 60, rangeH: 40, raf: 0 };
      computeWorld(S.events);

      var chips = M.ui.chips([{ id: "all", label: "All" }].concat(M.ui.CATEGORIES), S.filter, function (id) {
        S.filter = id; chips.setActive(id); applyFilter(); syncQuery();
      });
      S.chips = chips;
      var contestedBtn = el("button", { class: "chip tl-contested-btn", type: "button", "aria-pressed": String(S.contested), style: { "--c": "var(--warn-ink)" },
        on: { click: function () { S.contested = !S.contested; contestedBtn.setAttribute("aria-pressed", String(S.contested)); applyFilter(); syncQuery(); } } },
        M.ui.icon("alert"), "Where sources disagree");
      var eraBtns = el("div", { class: "tl-eras" }, ERAS.filter(function (e) { return e.id !== "before"; }).map(function (er) {
        return el("button", { class: "tl-era-btn", type: "button", style: { "--c": er.ink }, on: { click: function () { S.era = er.id; syncQuery(); showEra(er.id); } } },
          el("b", null, er.label), el("small", null, er.years));
      }));
      S.count = el("span", { class: "tl-count mono" });
      S.zoomLabel = el("span", { class: "tl-zoom-label mono" });
      var zoomCtl = el("div", { class: "tl-zoom" },
        el("button", { class: "icon-btn", "aria-label": "Zoom out", title: "Zoom out (-)", on: { click: function () { zoomAround(1 / 1.9, null, true); } } }, M.ui.icon("minus")),
        S.zoomLabel,
        el("button", { class: "icon-btn", "aria-label": "Zoom in", title: "Zoom in (+)", on: { click: function () { zoomAround(1.9, null, true); } } }, M.ui.icon("plus")),
        el("button", { class: "icon-btn", "aria-label": "Show everything", title: "Show all years", on: { click: function () { S.era = null; syncQuery(); flyTo((MIN_YEAR + MAX_YEAR) / 2, minPpy(), 800); } } }, M.ui.icon("fit")));

      var track = el("div", { class: "tl-track", tabindex: "0", "aria-label": "Timeline. Scroll to zoom, drag to move, arrow keys to step through events." });
      var eraLayer = el("div", { class: "tl-eras-layer" });
      S.eraEls = ERAS.map(function (er) {
        var n = el("div", { class: "tl-era-band", style: { background: er.color, "--ink": er.ink } }, el("div", { class: "tl-era-label" }, el("b", null, er.label), er.years ? el("span", null, er.years) : null));
        eraLayer.appendChild(n); return n;
      });
      var axis = el("div", { class: "tl-axis" });
      var tickLayer = el("div", { class: "tl-ticks" });
      S.ticks = [];
      for (var y = 1995; y <= 2027; y++) {
        var tk = el("div", { class: ["tl-tick", y % 5 === 0 ? "major" : ""] }, el("span", null, String(y)));
        tickLayer.appendChild(tk); S.ticks.push({ year: y, el: tk });
      }
      var undatedTick = el("div", { class: "tl-tick major lbl undated" }, el("span", null, "No date"));
      tickLayer.appendChild(undatedTick); S.ticks.push({ year: 2028, el: undatedTick });
      var rangeLayer = el("div", { class: "tl-ranges" });
      S.ranges = []; var rows = [];
      S.events.filter(function (e) { return e.yearEnd; }).sort(function (a, b) { return a._x - b._x; }).forEach(function (e) {
        var row = 0; while (rows[row] != null && rows[row] > e._x) row++; rows[row] = e.yearEnd + 1;
        var r = el("button", { class: "tl-range", type: "button", style: { background: catColor(e) }, title: U.formatYear(e) + ": " + e.title, on: { click: function (ev) { ev.stopPropagation(); openEvent(e.id, true); } } });
        rangeLayer.appendChild(r); S.ranges.push({ e: e, el: r, row: row });
      });
      var evLayer = el("div", { class: "tl-events" }), stemLayer = el("div", { class: "tl-stems" });
      S.events.forEach(function (e) { evLayer.appendChild(buildEvent(e)); stemLayer.appendChild(e._node.stem); });
      S.hint = el("div", { class: "tl-hint" }, M.ui.icon("search"), "Scroll to zoom in. Drag to move. Click a dot to open it.");
      track.appendChild(eraLayer); track.appendChild(axis); track.appendChild(tickLayer); track.appendChild(rangeLayer); track.appendChild(stemLayer); track.appendChild(evLayer); track.appendChild(S.hint);

      S.miniDots = el("div", { class: "tl-mini-dots" });
      S.brush = el("div", { class: "tl-mini-brush" });
      var miniEras = ERAS.map(function (er) { return el("div", { class: "tl-mini-era", style: { left: ((er.from - MIN_YEAR) / (MAX_YEAR - MIN_YEAR) * 100) + "%", width: ((er.to - er.from) / (MAX_YEAR - MIN_YEAR) * 100) + "%", background: er.color.replace(/[\d.]+\)$/, ".22)") } }, el("span", null, er.label)); });
      S.mini = el("div", { class: "tl-mini", "aria-label": "Overview of all years. Click or drag to move." }, miniEras, S.miniDots, S.brush);

      S.sheet = M.ui.sheet({ onClose: function () { closeEvent(true); } });
      S.track = track;
      S.root = el("section", { class: "page tl-page" },
        el("div", { class: "tl-head wrap" },
          el("div", { class: "tl-head-l" }, el("div", { class: "kicker" }, "Boards 1 and 2"), el("h1", null, "Timeline"),
            el("p", { class: "tl-lede" }, "Twenty-eight years of IIIT, from a village road to the New Academic Block. ", S.count, ".")),
          el("div", { class: "tl-head-r" }, eraBtns)),
        el("div", { class: "tl-tools wrap" }, chips, contestedBtn, el("span", { class: "grow" }), zoomCtl),
        track,
        el("div", { class: "tl-mini-wrap wrap" }, S.mini));
      root.appendChild(S.root);

      // sizes
      function measure() {
        var r = track.getBoundingClientRect();
        S.w = r.width; S.trackH = r.height; S.axisY = Math.round(S.trackH * 0.5);
        track.style.setProperty("--axis", S.axisY + "px");
        S.dirty = true; clampView(); layout();
      }
      applyFilter();
      measure();
      bindTrack(track); bindMini(S.mini);
      var onResize = U.debounce(measure, 80);
      window.addEventListener("resize", onResize);
      document.addEventListener("keydown", onKey);
      S.cleanup.push(function () { window.removeEventListener("resize", onResize); document.removeEventListener("keydown", onKey); });

      // initial view: overview, then fly in (feels alive on load)
      S.ppy = minPpy(); S.center = (MIN_YEAR + MAX_YEAR) / 2; clampView(); layout();
      var id = ctx.params[0];
      var t0 = setTimeout(function () {
        if (!S) return;
        if (id && U.byId(S.events, id)) openEvent(id, true);
        else if (q.autoplay === "1") startAutoplay();
        else if (S.era) showEra(S.era);
        else flyTo(2002.5, (S.w - 120) / 11, 1500);
      }, 350);
      S.cleanup.push(function () { clearTimeout(t0); });
    },
    update: function (params, query) {
      if (!S) return;
      if (S.selfNav) { S.selfNav = false; return; }
      var id = params[0];
      if (id && id !== S.openId) openEvent(id, true);
      else if (!id && S.openId) closeEvent(false);
      if (query.era && query.era !== S.era) { S.era = query.era; showEra(S.era); }
      if ((query.filter || "all") !== S.filter) { S.filter = query.filter || "all"; S.chips.setActive(S.filter); applyFilter(); }
      if (query.autoplay === "1" && !S.autoplay) startAutoplay();
    },
    destroy: function () {
      if (!S) return;
      stopAutoplay();
      if (S.cancelFly) S.cancelFly();
      cancelAnimationFrame(S.raf);
      S.cleanup.forEach(function (f) { f(); });
      if (S.sheet) S.sheet.destroy();
      S = null;
    }
  };
})();
