/* map.js: Board 3, "Moving rooms". The 2002 layout plan morphing into today's satellite view (warped into the plan's frame,
   so every hotspot, journey and label stays put), room journeys, trees and satellite flipbooks.
   Owner: aakarsh-claude (A6, A11). Routes: #/map, #/map/<placeId>, #/map?journey=<id>, ?layer=trees, ?view=2002, ?autoplay=1, ?dev=1. */
(function () {
  "use strict";
  var M = window.M, el = M.ui.el, svg = M.ui.svg, U = M.util;
  var IMG_W = 1280, IMG_H = 1152;
  var S = null;

  // approximate positions (percent of the plan) for things that are not drawn as buildings
  var APPROX = { "main-road": { x: 50, y: 89.5 } };

  function rectPx(h) { return { x: h.x / 100 * IMG_W, y: h.y / 100 * IMG_H, w: h.w / 100 * IMG_W, h: h.h / 100 * IMG_H }; }
  function polyPx(n) { return n.map(function (q) { return { x: q[0] / 100 * IMG_W, y: q[1] / 100 * IMG_H }; }); }
  /** Where a place sits on the map: the 2002 rectangle, or the polygon traced on today's view. */
  function geom(place) {
    var hs = place && place.hotspot; if (!hs) return null;
    if (hs.plan2002) { var r = rectPx(hs.plan2002); r.poly = null; r.now = false; return r; }
    if (hs.now) {
      var pts = polyPx(hs.now), xs = pts.map(function (q) { return q.x; }), ys = pts.map(function (q) { return q.y; });
      var x0 = Math.min.apply(null, xs), y0 = Math.min.apply(null, ys);
      return { x: x0, y: y0, w: Math.max.apply(null, xs) - x0, h: Math.max.apply(null, ys) - y0, poly: pts, now: true };
    }
    return null;
  }
  function centerPx(place) { var g = geom(place); return g ? { x: g.x + g.w / 2, y: g.y + g.h / 2 } : null; }

  /* ---------- 2002 plan <-> today ---------- */
  function setMorph(t) {
    S.t = U.clamp(t, 0, 1);
    var e = S.t * S.t * (3 - 2 * S.t);
    S.planImg.style.opacity = (1 - e).toFixed(3);
    S.nowImg.style.opacity = e.toFixed(3);
    var isNow = S.t > 0.5;
    if (S.root.classList.contains("is-now") !== isNow) { S.root.classList.toggle("is-now", isNow); updateBadge(); }
    S.morphRange.value = String(Math.round(S.t * 100));
  }
  function updateBadge() {
    var now = S.t > 0.5;
    S.badge.firstChild.textContent = now ? "Today" : "Layout plan, 2002";
    S.badge.lastChild.textContent = now ? "Google Earth screenshot, lined up with the plan. North is down." : "62 acres. From SLN Shastry. North is down.";
    S.morphBtns[0].classList.toggle("on", !now); S.morphBtns[1].classList.toggle("on", now);
  }
  function morphTo(target, dur) {
    if (S.cancelMorph) S.cancelMorph();
    if (U.prefersReducedMotion() || dur === 0) { setMorph(target); return; }
    S.cancelMorph = U.tween({ from: S.t, to: target, duration: dur || 2200, ease: U.easeInOutCubic, onUpdate: setMorph, onDone: function () { S.cancelMorph = null; } });
  }
  function toScreen(p) { var st = S.zp.state(); return { x: st.x + p.x * st.s, y: st.y + p.y * st.s }; }

  /** Fly so a plan rectangle sits in the part of the map that the side panel doesn't cover. maxK caps zoom (times the fit scale). */
  function focusVisible(x, y, w, h, pad, maxK) {
    var hr = S.host.getBoundingClientRect();
    var sheetW = S.sheet && S.sheet.isOpen() ? S.sheet.el.getBoundingClientRect().width : 0;
    var vw = Math.max(240, Math.min(hr.width, window.innerWidth - sheetW - hr.left));
    var fit = Math.min((hr.width - 32) / IMG_W, (hr.height - 32) / IMG_H);
    var s = Math.min(vw / (w * (1 + 2 * pad)), hr.height / (h * (1 + 2 * pad)));
    s = U.clamp(s, fit, fit * (maxK || 2.4));
    S.zp.zoomTo(s, vw / 2 - (x + w / 2) * s, hr.height / 2 - (y + h / 2) * s, true);
  }

  /* ---------- overlay (labels and markers stay crisp, not scaled) ---------- */
  function placeOverlay() {
    if (!S) return;
    S.labels.forEach(function (l) {
      var p = toScreen(l.at);
      l.el.style.transform = "translate(" + p.x.toFixed(1) + "px," + p.y.toFixed(1) + "px)";
    });
    S.markers.forEach(function (m) {
      var p = toScreen(m.at);
      m.el.style.transform = "translate(" + p.x.toFixed(1) + "px," + p.y.toFixed(1) + "px)";
    });
  }

  /* ---------- place panel ---------- */
  function flipbook(ids, note) {
    var i = 0, timer = 0;
    var imgs = ids.map(function (id) { var im = U.image(id); return el("img", { src: im.file, alt: im.caption, class: "fb-img", draggable: "false" }); });
    var stage = el("div", { class: "fb-stage", on: { click: function () { M.ui.lightbox(ids, i); } } }, imgs);
    var label = el("span", { class: "fb-count mono" });
    var range = el("input", { type: "range", min: "0", max: String(ids.length - 1), value: "0", class: "fb-range", "aria-label": "Step through the satellite images",
      on: { input: function () { stop(); show(+range.value); } } });
    var playBtn = el("button", { class: "icon-btn", "aria-label": "Play", on: { click: function () { timer ? stop() : play(); } } }, M.ui.icon("play"));
    function show(n) {
      i = (n + ids.length) % ids.length;
      imgs.forEach(function (im, k) { im.classList.toggle("on", k === i); });
      range.value = String(i); label.textContent = (i + 1) + " / " + ids.length;
    }
    function play() { stop(); playBtn.replaceChildren(M.ui.icon("pause")); timer = setInterval(function () { show(i + 1); }, 1400); S.timers.push(function () { clearInterval(timer); }); }
    function stop() { clearInterval(timer); timer = 0; playBtn.replaceChildren(M.ui.icon("play")); }
    show(0);
    if (!U.prefersReducedMotion()) setTimeout(play, 600);
    return el("div", { class: "fb" }, stage, el("div", { class: "fb-ctrl" }, playBtn, range, label), note ? el("p", { class: "fb-note" }, note) : null);
  }

  function placeContent(p) {
    var evs = U.eventsForPlace(p.id);
    var gallery = (p.images || []).filter(function (id) { return U.image(id) && (!p.sequence || p.sequence.indexOf(id) < 0); });
    var js = (p.journeys || []).map(function (id) { return U.byId(M.journeys, id); }).filter(Boolean);
    return el("div", { class: "map-detail" },
      el("div", { class: "kicker" }, p.after2002 ? "Built after 2002" : "On the 2002 plan"),
      el("h2", null, p.name),
      (p.aka || []).length ? el("p", { class: "map-aka mono" }, p.aka.join(" | ")) : null,
      el("p", { class: "map-sum" }, p.summary),
      p.sequence ? flipbook(p.sequence, p.id === "amphitheatre" ? "Satellite screenshots. The second one is dated 14 March 2018." : "Satellite screenshots from Google Earth, in order. The dates aren't shown on them.") : null,
      gallery.length ? el("div", { class: "map-gallery" }, gallery.slice(0, 9).map(function (id) { return M.ui.imageFigure(id, { gallery: gallery, caption: false, ratio: "4/3" }); })) : null,
      evs.length ? el("div", { class: "map-evs" }, el("h3", null, "What happened here"),
        el("ol", { class: "map-ev-list" }, evs.map(function (e) {
          return el("li", { style: { "--c": M.ui.category((e.category || [])[0]).color } },
            el("a", { href: U.href("timeline", e.id) }, el("span", { class: "mono" }, U.formatYear(e)), el("span", null, e.title)));
        }))) : null,
      js.length ? el("div", { class: "map-js" }, el("h3", null, "Rooms that moved through here"),
        el("div", { class: "map-js-btns" }, js.map(function (j) { return el("button", { class: "chip", type: "button", style: { "--c": j.color }, on: { click: function () { selectJourney(j.id, true); } } }, el("span", { class: "dot" }), j.short); }))) : null,
      el("div", { class: "map-src" }, M.ui.sourceBadges(p.sources)));
  }

  function openPlace(id, opts) {
    opts = opts || {};
    var p = U.place(id); if (!p) return;
    S.openId = id;
    S.hotEls.forEach(function (h) { h.el.classList.toggle("sel", h.id === id); });
    S.labels.forEach(function (l) { l.el.classList.toggle("sel", l.id === id); });
    S.railPlaces.forEach(function (b) { b.classList.toggle("on", b.dataset.id === id); });
    S.sheet.setBar([el("span", { class: "mono small muted" }, "Moving rooms")]);
    S.sheet.setContent(placeContent(p));
    S.sheet.open();
    var g = geom(p);
    if (p.after2002 && S.t < 0.5) morphTo(1, 1600);
    else if (p.hideNow && S.t > 0.5) morphTo(0, 1600);
    if (g && opts.fly !== false) requestAnimationFrame(function () { if (S) focusVisible(g.x, g.y, g.w, g.h, 0.9, 2.6); });
    if (!opts.silent) setHash();
  }
  function closePlace() {
    S.openId = null;
    S.hotEls.forEach(function (h) { h.el.classList.remove("sel"); });
    S.labels.forEach(function (l) { l.el.classList.remove("sel"); });
    S.railPlaces.forEach(function (b) { b.classList.remove("on"); });
    setHash();
  }

  /* ---------- journeys ---------- */
  function clearJourney() {
    S.journeyId = null;
    S.pathLayer.textContent = "";
    S.markers.forEach(function (m) { m.el.remove(); }); S.markers = [];
    S.railJourneys.forEach(function (b) { b.classList.remove("on"); });
    S.root.classList.remove("has-journey");
  }
  function smoothPath(pts) {
    if (pts.length < 2) return "";
    var d = "M" + pts[0].x.toFixed(1) + " " + pts[0].y.toFixed(1);
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      var c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 }, c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
      if (p1.x === p2.x && p1.y === p2.y) continue;
      d += " C" + c1.x.toFixed(1) + " " + c1.y.toFixed(1) + " " + c2.x.toFixed(1) + " " + c2.y.toFixed(1) + " " + p2.x.toFixed(1) + " " + p2.y.toFixed(1);
    }
    return d;
  }
  function selectJourney(id, fromUser) {
    var j = U.byId(M.journeys, id); if (!j) return;
    clearJourney();
    S.journeyId = id;
    S.root.classList.add("has-journey");
    var needsNow = j.stops.some(function (s) { var pl = s.place && U.place(s.place); return pl && pl.after2002; });
    if (needsNow && S.t < 0.5) morphTo(1, 1600);
    S.railJourneys.forEach(function (b) { b.classList.toggle("on", b.dataset.id === id); });
    // points for stops that are on the plan (merge repeated places)
    var pts = [], seen = {};
    j.stops.forEach(function (s, i) {
      var c = s.place ? centerPx(U.place(s.place)) : null;
      if (!c) return;
      var key = s.place;
      if (seen[key] != null) { seen[key].nums.push(i + 1); return; }
      var m = { at: c, nums: [i + 1], place: s.place };
      seen[key] = m; pts.push(m);
    });
    // nudge a path that would collapse to one point into a small loop
    var d = smoothPath(pts.map(function (p) { return p.at; }));
    if (d) {
      var base = svg("path", { d: d, class: "jr-path-base", style: { stroke: j.color } });
      var ants = svg("path", { d: d, class: "jr-path", style: { stroke: j.color } });
      S.pathLayer.appendChild(base); S.pathLayer.appendChild(ants);
      if (!U.prefersReducedMotion()) {
        var len = base.getTotalLength();
        base.style.strokeDasharray = len; base.style.strokeDashoffset = len;
        base.getBoundingClientRect();
        base.style.transition = "stroke-dashoffset 1.6s cubic-bezier(.65,0,.35,1)";
        base.style.strokeDashoffset = "0";
      }
    }
    pts.forEach(function (p, k) {
      var mk = el("button", { class: "jr-marker", type: "button", style: { "--c": j.color, "--d": (300 + k * 280) + "ms" }, on: { click: function () { openPlace(p.place); } } },
        el("b", null, p.nums.join(", ")));
      S.overlay.appendChild(mk);
      S.markers.push({ el: mk, at: p.at });
    });
    placeOverlay();
    if (pts.length) {
      var xs = pts.map(function (p) { return p.at.x; }), ys = pts.map(function (p) { return p.at.y; });
      var x0 = Math.min.apply(null, xs), x1 = Math.max.apply(null, xs), y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
      var w = Math.max(220, x1 - x0), h = Math.max(220, y1 - y0);
      S.pendingFocus = [(x0 + x1) / 2 - w / 2, (y0 + y1) / 2 - h / 2, w, h];
    }
    // panel: the stops as a stepper
    S.sheet.setBar([el("span", { class: "mono small muted" }, "A room's journey")]);
    S.sheet.setContent(el("div", { class: "map-detail jr-detail", style: { "--c": j.color } },
      el("div", { class: "kicker" }, "Journey"),
      el("h2", null, j.title),
      el("ol", { class: "jr-steps" }, j.stops.map(function (s, i) {
        var pl = s.place ? U.place(s.place) : null;
        return el("li", { class: "jr-step", style: { "--d": (i * 110) + "ms" } },
          el("span", { class: "jr-num" }, String(i + 1)),
          el("div", { class: "jr-body" },
            el("div", { class: "jr-when mono" }, s.when),
            el("h3", null, s.label),
            el("p", null, s.text),
            s.image && U.image(s.image) ? M.ui.imageFigure(s.image, { caption: false, ratio: "16/9" }) : null,
            el("div", { class: "jr-foot" },
              pl ? el("button", { class: "tl-chip-link", type: "button", on: { click: function () { openPlace(pl.id); } } }, M.ui.icon("pin"), pl.name) : null,
              M.ui.sourceBadges(s.sources, { compact: true }))));
      }))));
    S.sheet.open();
    S.openId = null;
    if (S.pendingFocus) { var f = S.pendingFocus; S.pendingFocus = null; requestAnimationFrame(function () { if (S) focusVisible(f[0], f[1], f[2], f[3], 0.45, 1.9); }); }
    if (fromUser !== false) setHash();
  }

  /* ---------- trees layer ---------- */
  function setTrees(on) {
    S.trees = on;
    S.root.classList.toggle("show-trees", on);
    S.treeBtn.setAttribute("aria-pressed", String(on));
    S.treeLayer.textContent = "";
    S.treeMarkers.forEach(function (m) { m.el.remove(); }); S.treeMarkers = [];
    if (!on) { placeOverlay(); return; }
    var road = { x: APPROX["main-road"].x / 100 * IMG_W, y: APPROX["main-road"].y / 100 * IMG_H };
    var bakul = centerPx(U.place("bakul")), obh = centerPx(U.place("obh"));
    var obhPin = { x: obh.x, y: obh.y + 40 };
    S.treeLayer.appendChild(svg("path", { d: smoothPath([road, bakul, obhPin]), class: "tree-path" }));
    [{ at: road, t: "1. The main road (about here)" }, { at: bakul, t: "2. Bakul Nivas" }, { at: obhPin, t: "3. OBH, where Navjeevan stands now" }].forEach(function (m) {
      var n = el("div", { class: "tree-pin" }, M.ui.icon("tree"), el("span", null, m.t));
      S.overlay.appendChild(n); S.treeMarkers.push({ el: n, at: m.at }); S.markers.push({ el: n, at: m.at });
    });
    if (S.t < 0.5) morphTo(1, 1600);
    var tx = [road.x, bakul.x, obhPin.x], ty = [road.y, bakul.y, obhPin.y];
    var bx = Math.min.apply(null, tx), by = Math.min.apply(null, ty);
    requestAnimationFrame(function () { if (S) focusVisible(bx, by, Math.max.apply(null, tx) - bx, Math.max.apply(null, ty) - by, 0.25, 1.6); });
    placeOverlay();
  }

  function setHash() {
    var q = {};
    if (S.journeyId) q.journey = S.journeyId;
    if (S.trees) q.layer = "trees";
    if (S.t < 0.5) q.view = "2002";
    var h = "#/map" + (S.openId ? "/" + S.openId : "") + U.buildQuery(q);
    if (location.hash !== h) { S.selfNav = true; location.hash = h; }
  }

  /* ---------- dev picker ---------- */
  function devPicker(content) {
    var box = el("div", { class: "dev-picker" }, "Dev picker: drag on the map to get a hotspot");
    S.root.appendChild(box);
    var start = null, rect = svg("rect", { class: "dev-rect" });
    S.pathLayer.parentNode.appendChild(rect);
    content.addEventListener("pointerdown", function (e) { if (!e.altKey && !e.shiftKey) return; e.stopPropagation(); start = S.zp.toContent(e.clientX, e.clientY); }, true);
    window.addEventListener("pointermove", function (e) {
      if (!start) return; var p = S.zp.toContent(e.clientX, e.clientY);
      rect.setAttribute("x", Math.min(start.x, p.x)); rect.setAttribute("y", Math.min(start.y, p.y)); rect.setAttribute("width", Math.abs(p.x - start.x)); rect.setAttribute("height", Math.abs(p.y - start.y));
    });
    window.addEventListener("pointerup", function (e) {
      if (!start) return; var p = S.zp.toContent(e.clientX, e.clientY);
      var r = { x: +(Math.min(start.x, p.x) / IMG_W * 100).toFixed(1), y: +(Math.min(start.y, p.y) / IMG_H * 100).toFixed(1), w: +(Math.abs(p.x - start.x) / IMG_W * 100).toFixed(1), h: +(Math.abs(p.y - start.y) / IMG_H * 100).toFixed(1) };
      var txt = JSON.stringify(r).replace(/"/g, ""); box.textContent = "plan2002: " + txt + "   (shift+drag again)"; console.log("hotspot", txt); start = null;
    });
    box.textContent = "Dev picker: hold Shift and drag on the map to measure a hotspot";
  }

  /* ---------- autoplay (kiosk) ---------- */
  function startAutoplay() {
    stopAutoplay();
    var seq = [{ morph: 0, ms: 4500 }, { morph: 1, ms: 5000 }];
    ["library", "navjeevan", "sleep", "big-hall", "cricket", "eat", "block-d", "vindhya-rooms", "guest-house"].forEach(function (id) { seq.push({ j: id, ms: 11000 }); });
    ["nab", "himalaya", "bakul", "nilgiri", "vindhya", "obh"].forEach(function (id) { seq.push({ p: id, ms: 8000 }); });
    var i = 0;
    S.autoplay = true;
    function step() {
      if (!S || !S.autoplay) return;
      var s = seq[i % seq.length]; i++;
      if (s.morph != null) { clearJourney(); while (M.ui.closeTop()) { /* close the panel */ } S.zp.fit(true); morphTo(s.morph, 2600); }
      else if (s.j) selectJourney(s.j, false); else { clearJourney(); openPlace(s.p, { silent: true }); }
      S.autoTimer = setTimeout(step, s.ms);
    }
    S.autoTimer = setTimeout(step, 1200);
    S.offInput = M.kiosk.onInput(function (ev) { if (ev.type !== "pointermove") stopAutoplay(); });
  }
  function stopAutoplay() { if (!S) return; S.autoplay = false; clearTimeout(S.autoTimer); if (S.offInput) { S.offInput(); S.offInput = null; } }

  /* ---------- page ---------- */
  M.pages.map = {
    id: "map", route: "map", title: "Map", navLabel: "Map", nav: true, navOrder: 3,
    render: function (root, ctx) {
      var q = ctx.query || {};
      S = { labels: [], markers: [], treeMarkers: [], hotEls: [], timers: [], railPlaces: [], railJourneys: [], openId: null, journeyId: null, trees: false };
      var places = M.places || [];

      // map content: image + svg overlay in plan pixels
      var img = el("img", { src: "assets/map/plan-2002.jpg", alt: "Layout plan of IIIT Gachibowli, 62 acres, 2002. North points down.", draggable: "false", class: "map-img plan" });
      var nowImg = el("img", { src: "assets/map/now-aligned.jpg", alt: "Today's satellite view of the campus, turned to match the 2002 plan.", draggable: "false", class: "map-img now" });
      S.planImg = img; S.nowImg = nowImg; S.t = 0;
      var svgEl = svg("svg", { class: "map-svg", viewBox: "0 0 " + IMG_W + " " + IMG_H, width: IMG_W, height: IMG_H });
      var hotLayer = svg("g", { class: "hot-layer" });
      S.pathLayer = svg("g", { class: "path-layer" });
      S.treeLayer = svg("g", { class: "tree-layer" });
      svgEl.appendChild(hotLayer); svgEl.appendChild(S.treeLayer); svgEl.appendChild(S.pathLayer);
      function eraClass(p) { return p.after2002 ? "now-only" : (p.hideNow ? "then-only" : ""); }
      places.forEach(function (p) {
        var r = geom(p); if (!r) return;
        var g = r.poly
          ? svg("polygon", { points: r.poly.map(function (q) { return q.x.toFixed(1) + "," + q.y.toFixed(1); }).join(" "), class: "hot " + eraClass(p), tabindex: "0", role: "button", "aria-label": p.name })
          : svg("rect", { x: r.x, y: r.y, width: r.w, height: r.h, rx: 6, class: "hot " + eraClass(p), tabindex: "0", role: "button", "aria-label": p.name });
        g.addEventListener("click", function () { clearJourney(); openPlace(p.id); });
        g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); clearJourney(); openPlace(p.id); } });
        g.addEventListener("pointerenter", function () { S.root.querySelector('.map-label[data-id="' + p.id + '"]').classList.add("hover"); });
        g.addEventListener("pointerleave", function () { S.root.querySelector('.map-label[data-id="' + p.id + '"]').classList.remove("hover"); });
        hotLayer.appendChild(g); S.hotEls.push({ id: p.id, el: g });
      });
      var content = el("div", { class: "map-content", style: { width: IMG_W + "px", height: IMG_H + "px" } }, nowImg, img, svgEl);
      var host = el("div", { class: "map-host" });
      S.overlay = el("div", { class: "map-overlay" });
      places.forEach(function (p) {
        var r = geom(p); if (!r) return;
        var lab = el("button", { class: "map-label " + eraClass(p), type: "button", dataset: { id: p.id }, on: { click: function () { clearJourney(); openPlace(p.id); } } }, p.name.replace(/ \(.*\)$/, ""));
        if (p.labelBelow) lab.classList.add("below");
        S.overlay.appendChild(lab); S.labels.push({ id: p.id, el: lab, at: { x: r.x + r.w / 2, y: p.labelBelow ? r.y + r.h : r.y } });
      });
      var badge = el("div", { class: "map-badge" }, el("b", null, ""), el("span", null, ""));
      S.badge = badge;
      S.morphRange = el("input", { type: "range", min: "0", max: "100", value: "0", class: "morph-range", "aria-label": "Fade between the 2002 plan and today",
        on: { input: function () { if (S.cancelMorph) S.cancelMorph(); stopAutoplay(); setMorph(+S.morphRange.value / 100); }, change: function () { setHash(); } } });
      S.morphBtns = [
        el("button", { type: "button", class: "morph-btn", on: { click: function () { stopAutoplay(); morphTo(0); setTimeout(function () { if (S) setHash(); }, 50); } } }, "2002 plan"),
        el("button", { type: "button", class: "morph-btn", on: { click: function () { stopAutoplay(); morphTo(1); setTimeout(function () { if (S) setHash(); }, 50); } } }, "Today")];
      var morphCtl = el("div", { class: "map-morph" }, S.morphBtns[0], S.morphRange, S.morphBtns[1]);
      var compass = el("div", { class: "map-compass", title: "North points down on this plan" }, el("span", null, "N"), M.ui.icon("arrow-right"));
      var zoomCtl = el("div", { class: "zp-controls" },
        el("button", { class: "icon-btn", "aria-label": "Zoom in", on: { click: function () { S.zp.zoomBy(1.5); } } }, M.ui.icon("plus")),
        el("button", { class: "icon-btn", "aria-label": "Zoom out", on: { click: function () { S.zp.zoomBy(1 / 1.5); } } }, M.ui.icon("minus")),
        el("button", { class: "icon-btn", "aria-label": "Fit the whole plan", on: { click: function () { S.zp.fit(true); } } }, M.ui.icon("fit")));
      var stage = el("div", { class: "map-stage" }, host, S.overlay, morphCtl, badge, compass, zoomCtl);

      // left rail
      var jList = el("div", { class: "rail-list" }, (M.journeys || []).map(function (j) {
        var b = el("button", { class: "rail-btn", type: "button", dataset: { id: j.id }, style: { "--c": j.color }, on: { click: function () { stopAutoplay(); selectJourney(j.id); } } },
          el("span", { class: "rail-dot" }), el("span", null, j.short), el("small", { class: "mono" }, j.stops.length + " stops"));
        S.railJourneys.push(b); return b;
      }));
      var aList = el("div", { class: "rail-list" }, places.filter(function (p) { return p.after2002; }).map(function (p) {
        var b = el("button", { class: "rail-btn place", type: "button", dataset: { id: p.id }, on: { click: function () { stopAutoplay(); clearJourney(); openPlace(p.id); } } },
          M.ui.icon(p.sequence ? "layers" : "pin"), el("span", null, p.name), p.sequence ? el("small", { class: "mono" }, p.sequence.length + " satellite") : null);
        S.railPlaces.push(b); return b;
      }));
      places.filter(function (p) { return !p.after2002; }).forEach(function () {});
      S.treeBtn = el("button", { class: "chip", type: "button", "aria-pressed": "false", style: { "--c": "var(--banyan)" }, on: { click: function () { setTrees(!S.trees); setHash(); } } }, M.ui.icon("tree"), "HISTREE: where Navjeevan moved");
      var rail = el("aside", { class: "map-rail" },
        el("div", { class: "kicker" }, "Board 3"),
        el("h1", null, "Moving rooms"),
        el("p", { class: "map-intro" }, "The 2002 campus plan, lined up with today. Pick a journey, or click a building."),
        el("h3", { class: "rail-h" }, "Journeys"), jList,
        el("h3", { class: "rail-h" }, "Built after 2002"), aList,
        el("div", { class: "rail-foot" }, S.treeBtn));

      S.root = el("section", { class: "page map-page" }, rail, stage);
      setMorph(0); updateBadge();
      root.appendChild(S.root);
      S.host = host;
      S.sheet = M.ui.sheet({ onClose: function () { closePlace(); if (S.journeyId) clearJourney(); setHash(); } });
      S.zp = M.ui.zoomPan(host, content, { contentW: IMG_W, contentH: IMG_H, maxScale: 5, padding: 16, onChange: placeOverlay,
        insetRight: function () { return S && S.sheet && S.sheet.isOpen() ? S.sheet.el.getBoundingClientRect().width : 0; } });
      S.timers.push(function () { S.zp.destroy(); });
      var onResize = U.debounce(placeOverlay, 60);
      window.addEventListener("resize", onResize);
      S.timers.push(function () { window.removeEventListener("resize", onResize); });
      if (M.kiosk.dev) devPicker(content);

      var t = setTimeout(function () {
        if (!S) return;
        placeOverlay();
        // the plan first, then it turns into today (unless the link asks for the 2002 view)
        if (q.view !== "2002" && !q.journey && !ctx.params[0] && q.layer !== "trees") {
          var tm = setTimeout(function () { if (S && !S.cancelMorph && S.t === 0) morphTo(1, 2800); }, U.prefersReducedMotion() ? 0 : 1300);
          S.timers.push(function () { clearTimeout(tm); });
        }
        if (q.layer === "trees") setTrees(true);
        if (ctx.params[0]) openPlace(ctx.params[0], { silent: true });
        else if (q.journey) selectJourney(q.journey, false);
        else if (q.autoplay === "1") startAutoplay();
      }, 120);
      S.timers.push(function () { clearTimeout(t); });
    },
    update: function (params, query) {
      if (!S) return;
      if (S.selfNav) { S.selfNav = false; return; }
      if (params[0] && params[0] !== S.openId) { clearJourney(); openPlace(params[0], { silent: true }); }
      else if (!params[0] && query.journey && query.journey !== S.journeyId) selectJourney(query.journey, false);
      else if (!params[0] && !query.journey && (S.journeyId || S.openId)) { clearJourney(); S.openId = null; S.sheet.close(true); closePlace(); }
      if ((query.layer === "trees") !== S.trees) setTrees(query.layer === "trees");
      if (query.autoplay === "1" && !S.autoplay) startAutoplay();
      if (query.view === "2002" && S.t > 0.5) morphTo(0);
    },
    destroy: function () {
      if (!S) return;
      stopAutoplay();
      if (S.cancelMorph) S.cancelMorph();
      S.timers.forEach(function (f) { f(); });
      if (S.sheet) S.sheet.destroy();
      S = null;
    }
  };
})();
