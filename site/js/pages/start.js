/* start.js: Start page with the turning IIIT badge, the four roots (one per board) and the fun-fact ticker. Owner: aakarsh-claude (A4).
   M.coin.create(host, opts) is reusable on other pages: returns {flip(), destroy()}.
   opts.faces = [frontSrc, backSrc] swaps the images; opts.flat = true gives a thin painted edge instead of metal. */
(function () {
  "use strict";
  var M = window.M, el = M.ui.el, svg = M.ui.svg, U = M.util;

  /* ======================= 3D coin ======================= */
  M.coin = {
    create: function (host, opts) {
      opts = opts || {};
      var reduce = U.prefersReducedMotion();
      var faces = opts.faces || ["assets/img/coin-front.png", "assets/img/coin-back.png"];
      var stage = el("div", { class: ["coin-stage", opts.flat ? "coin--flat" : ""], role: "img", tabindex: "0",
        "aria-label": opts.label || "A coin. One side shows IIIT's banyan logo, the other the HISTREE banyan. Drag to spin it, or click to flip." });
      if (opts.size) stage.style.setProperty("--size", opts.size);
      var coin = el("div", { class: "coin" });
      var edge = el("div", { class: "coin-edge" });
      var LAYERS = opts.flat ? 10 : 24;
      for (var i = 0; i < LAYERS; i++) {
        var th = opts.flat ? 0.014 : 0.036, z = -th + 2 * th * i / (LAYERS - 1);
        edge.appendChild(el("i", { style: { transform: "translateZ(calc(var(--size) * " + z.toFixed(4) + "))" } }));
      }
      var glintF = el("div", { class: "coin-glint" }), glintB = el("div", { class: "coin-glint" });
      coin.appendChild(edge);
      coin.appendChild(el("div", { class: "coin-face front" }, el("img", { src: faces[0], alt: "", draggable: "false" }), glintF));
      coin.appendChild(el("div", { class: "coin-face back" }, el("img", { src: faces[1], alt: "", draggable: "false" }), glintB));
      var shadow = el("div", { class: "coin-shadow" });
      var caption = el("div", { class: "coin-caption" }, "IIIT's logo");
      stage.appendChild(coin); stage.appendChild(shadow);
      if (opts.caption !== false) stage.appendChild(caption);
      if (opts.hint !== false) stage.appendChild(el("div", { class: "coin-hint" }, "Drag to spin. Click to flip."));
      host.appendChild(stage);

      var HOLD = opts.hold || 3600, SPIN = opts.spin || 1900;
      var angle = opts.startBack ? 180 : 0, base = angle, tx = 0, ty = 0, ttx = 0, tty = 0;
      var mode = reduce ? "still" : "auto", autoT = 0, last = performance.now(), raf = 0, resumeTimer = 0;
      var vel = 0, dragX = 0, moved = 0, cancelTween = null, visible = true;

      function nearestFace(a) { return Math.round(a / 180) * 180; }
      function goTo(target, dur) {
        if (cancelTween) cancelTween();
        mode = "tween";
        var from = angle;
        cancelTween = U.tween({ from: from, to: target, duration: reduce ? 1 : (dur || 900), ease: U.easeInOutCubic,
          onUpdate: function (v) { angle = v; }, onDone: function () { cancelTween = null; base = target; mode = "idle"; scheduleResume(); } });
      }
      function scheduleResume() {
        clearTimeout(resumeTimer);
        if (reduce) return;
        resumeTimer = setTimeout(function () { base = nearestFace(angle); angle = base; autoT = 0; mode = "auto"; }, opts.resumeAfter || 5000);
      }
      function frame(now) {
        var dt = Math.min(64, now - last); last = now;
        if (mode === "auto") {
          autoT += dt;
          var cyc = HOLD + SPIN, k = autoT % cyc, n = Math.floor(autoT / cyc);
          angle = base + n * 180 + (k < HOLD ? 0 : 180 * U.easeInOutCubic((k - HOLD) / SPIN));
        } else if (mode === "inertia") {
          angle += vel * dt / 16; vel *= Math.pow(0.94, dt / 16);
          if (Math.abs(vel) < 0.35) goTo(nearestFace(angle + vel * 6), 700);
        }
        var wob = reduce ? 0 : 1, t = now / 1000;
        tx += (ttx - tx) * 0.08; ty += (tty - ty) * 0.08;
        var rx = tx + wob * Math.sin(t * 0.9) * 3.5, ry = angle + ty + wob * Math.sin(t * 0.63) * 4;
        coin.style.transform = "rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg)";
        var rel = ((ry % 360) + 540) % 360 - 180;                // -180..180, 0 = front facing
        var faceRel = Math.abs(rel) <= 90 ? rel : (rel > 0 ? rel - 180 : rel + 180);
        var g = (50 - faceRel * 0.85) + "%";
        var o = (0.3 + 0.6 * Math.exp(-Math.pow((Math.abs(faceRel) - 26) / 24, 2))).toFixed(3);
        glintF.style.setProperty("--glint", g); glintB.style.setProperty("--glint", g);
        glintF.style.setProperty("--glint-o", o); glintB.style.setProperty("--glint-o", o);
        shadow.style.setProperty("--sh", (0.22 + 0.78 * Math.abs(Math.cos(ry * Math.PI / 180))).toFixed(3));
        var showingFront = Math.abs(rel) <= 90;
        if (caption._f !== showingFront) { caption._f = showingFront; caption.textContent = (showingFront ? "Front: IIIT's banyan logo" : "Back: the HISTREE banyan") + (opts.hint === false ? "" : ". Drag to spin"); }
        if (visible) raf = requestAnimationFrame(frame); else raf = 0;
      }

      // pointer: tilt on hover, drag to spin, click to flip
      function onMove(e) {
        var r = stage.getBoundingClientRect();
        if (mode === "drag") {
          var dx = e.clientX - dragX; dragX = e.clientX; moved += Math.abs(dx);
          angle += dx * 0.55; vel = dx * 0.55;
          return;
        }
        if (reduce) return;
        ttx = -((e.clientY - r.top) / r.height - 0.5) * 16;
        tty = ((e.clientX - r.left) / r.width - 0.5) * 16;
      }
      function onDown(e) {
        if (e.button !== 0 && e.pointerType === "mouse") return;
        stage.setPointerCapture(e.pointerId);
        if (cancelTween) { cancelTween(); cancelTween = null; }
        clearTimeout(resumeTimer);
        mode = "drag"; dragX = e.clientX; moved = 0; vel = 0;
        stage.classList.add("dragging");
      }
      function onUp() {
        if (mode !== "drag") return;
        stage.classList.remove("dragging");
        if (moved < 5) { goTo(nearestFace(angle) + 180, 1000); return; }
        mode = reduce ? "idle" : "inertia";
        if (reduce) goTo(nearestFace(angle), 1);
      }
      function onLeave() { ttx = 0; tty = 0; }
      function onKey(e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); goTo(nearestFace(angle) + 180, 1000); } }
      stage.addEventListener("pointermove", onMove);
      stage.addEventListener("pointerdown", onDown);
      stage.addEventListener("pointerup", onUp);
      stage.addEventListener("pointercancel", onUp);
      stage.addEventListener("pointerleave", onLeave);
      stage.addEventListener("keydown", onKey);
      var io = ("IntersectionObserver" in window) ? new IntersectionObserver(function (en) {
        visible = en[0].isIntersecting && !document.hidden;
        if (visible && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
      }) : null;
      if (io) io.observe(stage);
      raf = requestAnimationFrame(frame);

      return {
        el: stage,
        flip: function () { goTo(nearestFace(angle) + 180, 1000); },
        destroy: function () { cancelAnimationFrame(raf); raf = 0; visible = false; clearTimeout(resumeTimer); if (cancelTween) cancelTween(); if (io) io.disconnect(); stage.remove(); }
      };
    }
  };

  /* ======================= page ======================= */
  var ROOTS = [
    { n: "Board 1", title: "Setting the scene", href: "#/photos", color: "var(--soil)",
      text: "1998 to 2002: borrowed buildings and a diploma on trust." },
    { n: "Board 2", title: "The IIIT Way", href: "#/way", color: "var(--ochre-ink)",
      text: "Borrow, share, take back, build your own." },
    { n: "Board 3", title: "Institutional changes", href: "#/map", color: "var(--banyan)",
      text: "Rooms that moved, trees that moved, files that went online." },
    { n: "Board 4", title: "How we know", href: "#/how-we-know", color: "var(--slate)",
      text: "Where memories disagree, and how we checked." }
  ];

  var timers = [], coinApi = null, offResize = null, rootsDrawn = false;

  function drawRoots(container, svgEl, coinEl, cards, animate) {
    var cr = container.getBoundingClientRect();
    var sr = coinEl.getBoundingClientRect();
    svgEl.setAttribute("viewBox", "0 0 " + cr.width + " " + cr.height);
    svgEl.textContent = "";
    if (sr.width === 0) return;
    var sx = sr.left + sr.width / 2 - cr.left, sy = sr.bottom - cr.top - sr.height * 0.06;
    cards.forEach(function (card, i) {
      var r = card.getBoundingClientRect();
      var ex = r.left + r.width / 2 - cr.left, ey = r.top - cr.top + 2;
      [0, 1, 2].forEach(function (k) {
        var off = (k - 1) * 9, thin = k !== 1;
        var x0 = sx + off * 1.6 + (i - 1.5) * 10, y0 = sy;
        // drop straight down first, run low above the cards, then into each card
        var c1x = x0 + off, c1y = ey + 6;
        var c2x = ex + off * 2.2, c2y = y0 + (ey - y0) * 0.62;
        var d = "M" + x0.toFixed(1) + " " + y0.toFixed(1) + " C" + c1x.toFixed(1) + " " + c1y.toFixed(1) + " " + c2x.toFixed(1) + " " + c2y.toFixed(1) + " " + (ex + off * 1.4).toFixed(1) + " " + ey.toFixed(1);
        var p = svg("path", { d: d, "stroke-width": thin ? 1.2 : 2.6, class: thin ? "thin" : "" });
        svgEl.appendChild(p);
        if (animate && !U.prefersReducedMotion()) {
          var len = p.getTotalLength();
          p.style.setProperty("--len", len.toFixed(0));
          p.style.setProperty("--d", (500 + i * 160 + k * 60) + "ms");
          p.classList.add("draw");
        }
      });
    });
  }

  function ticker() {
    var facts = U.shuffle(M.facts || []);
    var stage = el("div", { class: "ticker-stage", "aria-live": "polite" });
    var bar = el("div", { class: "ticker-bar" });
    var idx = -1, items = [], paused = false, t = 0, DUR = 8000;
    facts.forEach(function (f) {
      var ev = f.eventId ? U.event(f.eventId) : null;
      var im = f.image ? U.image(f.image) : null;
      items.push(el("div", { class: "ticker-item" },
        im ? el("div", { class: "ticker-thumb" }, el("img", { src: im.thumb, alt: "" })) : el("div", { class: "ticker-thumb", style: { display: "grid", placeItems: "center" } }, M.ui.banyanMark()),
        el("div", null,
          el("div", { class: "ticker-text" }, ev ? el("a", { href: U.href("timeline", ev.id) }, f.text) : f.text),
          el("div", { class: "ticker-src" }, M.ui.sourceBadges(f.sources, { compact: true })))));
    });
    items.forEach(function (n) { stage.appendChild(n); });
    function show(n) {
      if (!items.length) return;
      var prev = items[idx];
      idx = (n + items.length) % items.length;
      if (prev) { prev.classList.remove("on"); prev.classList.add("off"); setTimeout(function () { prev.classList.remove("off"); }, 700); }
      items[idx].classList.add("on");
      bar.style.transition = "none"; bar.style.width = "0";
      void bar.offsetWidth;
      if (!paused) { bar.style.transition = "width " + DUR + "ms linear"; bar.style.width = "100%"; }
      clearTimeout(t); if (!paused) t = setTimeout(function () { show(idx + 1); }, DUR);
    }
    var box = el("div", { class: "ticker enter", style: { "--d": "700ms" },
      on: { pointerenter: function () { paused = true; clearTimeout(t); bar.style.transition = "none"; },
            pointerleave: function () { paused = false; show(idx); } } },
      el("div", { class: "ticker-label" }, "Did you know?"),
      stage,
      el("div", { class: "ticker-ctrl" },
        el("button", { class: "icon-btn", "aria-label": "Previous fact", on: { click: function () { show(idx - 1); } } }, M.ui.icon("chevron-left")),
        el("button", { class: "icon-btn", "aria-label": "Next fact", on: { click: function () { show(idx + 1); } } }, M.ui.icon("chevron-right"))),
      bar);
    show(0);
    timers.push(function () { clearTimeout(t); });
    return box;
  }

  M.pages.start = {
    id: "start", route: "start", title: "Start", navLabel: "Start", nav: true, navOrder: 1,
    render: function (root) {
      var cfg = M.config;
      var coinHost = el("div", { class: "coin-wrap enter", style: { "--d": "150ms" } });
      var cards = ROOTS.map(function (r, i) {
        return el("a", { class: "root-card enter", href: r.href, style: { "--c": r.color, "--d": (900 + i * 120) + "ms" } },
          el("span", { class: "num" }, r.n), el("h3", null, r.title), el("p", null, r.text),
          el("span", { class: "go" }, M.ui.icon("arrow-right")));
      });
      var rootsSvg = svg("svg", { class: "roots-svg", "aria-hidden": "true" });
      var section = el("section", { class: "page start wrap" },
        el("div", { class: "start-hero" },
          el("div", { class: "start-copy" },
            el("div", { class: "start-kicker enter", style: { "--d": "0ms" } }, el("span", null, "IIIT Hyderabad"), el("span", null, "1998 to today")),
            el("h1", { class: "start-title enter", style: { "--d": "80ms" } }, "Do you know your institute?"),
            el("p", { class: "start-arg enter", style: { "--d": "300ms" } },
              "IIIT started in borrowed buildings and slowly put down its own roots, like the banyan on its logo."),
            el("div", { class: "start-cta enter", style: { "--d": "420ms" } },
              el("a", { class: "btn btn--green", href: "#/quiz" }, "Take the quiz", M.ui.icon("arrow-right")),
              el("a", { class: "btn btn--ghost", href: "#/timeline" }, "See the timeline"))),
          coinHost),
        el("div", { class: "roots" }, rootsSvg, el("div", { class: "roots-grid" }, cards)),
        ticker());
      root.appendChild(section);
      coinApi = M.coin.create(coinHost, { faces: ["assets/img/iiit-badge.png", "assets/img/iiit-badge.png"], flat: true, caption: false, hint: false,
        hold: 2600, spin: 2400, label: "IIIT Hyderabad's logo in a round badge. Drag to spin it." });
      var redraw = function (anim) { drawRoots(section.querySelector(".roots"), rootsSvg, coinApi.el, cards, anim); };
      // draw once the entrance animation has placed everything
      var t1 = setTimeout(function () { redraw(true); rootsDrawn = true; }, 650);
      timers.push(function () { clearTimeout(t1); });
      var onR = U.debounce(function () { if (rootsDrawn) redraw(false); }, 120);
      window.addEventListener("resize", onR);
      offResize = function () { window.removeEventListener("resize", onR); };
    },
    destroy: function () {
      timers.forEach(function (f) { f(); }); timers = [];
      if (coinApi) coinApi.destroy(); coinApi = null;
      if (offResize) offResize(); offResize = null; rootsDrawn = false;
    }
  };
})();
