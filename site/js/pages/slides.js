/* slides.js: the two monitor slideshows. Owner: aakarsh-claude (A10).
   #/photos     Board 1: old photos of the campus, one or two per slide (four for the Nilgiri court signs), black background, crossfade every 7.5 s (10 s for the four).
   #/buildings  Board 2: satellite sequences of buildings going up, oldest to newest, with the place name on screen.
   Both play on their own forever. A mouse nudge never stops them; arrows / the buttons step, Space pauses.
   Two image buffers + img.decode() before each fade, so it can loop for hours without a flash. */
(function () {
  "use strict";
  var M = window.M, el = M.ui.el, U = M.util;

  var PROSP = "assets/docs/prospectus/img/";
  var VIDEO = "From IIITH's 20-year video";
  var PROSP_SRC = "IIIT prospectus, around 2001";
  var COURT = "assets/img/nilgiri-court/";   // paper signs inside Nilgiri from its court days (team photos, 14 Nov; originals in raw/nilgiri-court/)

  /* Board 1. Every captioned old photo of the campus we have. Order: the land, the first buildings, the first batch,
     the prospectus years, the first graduates. Captions are cut down from images.js / documents.js. */
  var PHOTO_SLIDES = [
    { imgs: ["img-02"], text: "The road to and from OBH. Look how empty the land is.", src: VIDEO },
    { imgs: ["img-01"], text: "The early main gate. The sign says \"Indian Institute of Information Technology\".", src: VIDEO },
    { imgs: ["img-04"], text: "The guest house from above, on bare red soil. Its sign says \"Guest House, Mess & Lounge\".", src: VIDEO },
    { imgs: ["img-05"], text: "OBH, with a banyan that was still young.", src: VIDEO },
    { files: [COURT + "1-bar-association.jpg", COURT + "2-court-hall-7.jpg", COURT + "3-library.jpg", COURT + "4-govt-pleader.jpg"], ms: 10000,
      text: "Signs from when Nilgiri was being built as a court.", src: "Team photo archive" },
    { imgs: ["img-07"], text: "Inauguration of the first batch of GDIT students.", src: VIDEO },
    { imgs: ["img-03"], text: "An early classroom.", src: VIDEO },
    { imgs: ["img-08"], text: "A full classroom listening to a panel.", src: VIDEO },
    { files: [PROSP + "ximg-01.jpg", PROSP + "ximg-02.jpg"], text: "Lawns, hedges and a building with a covered porch.", src: PROSP_SRC },
    { imgs: ["img-19"], files: [PROSP + "ximg-05.jpg"], text: "Company schools on campus: IBM, Oracle, Motorola and a Cisco academy.", src: "Team photo archive; " + PROSP_SRC },
    { files: [PROSP + "ximg-06.jpg", PROSP + "ximg-07.jpg"], text: "Computer labs: CRT monitors and workstations in cubicles.", src: PROSP_SRC },
    { imgs: ["img-06"], text: "The first graduating batch.", src: VIDEO }
  ];

  /* Board 2. Satellite sequences, in the order context.md 14.3 gives. Frames come from places.js `sequence`. */
  var BUILD_PLACES = [
    { id: "nab", name: "New Academic Block", line: "Going up where the first batch lived in 1998." },
    { id: "bakul", name: "Bakul Nivas", line: "Seen from above while it was built." },
    { id: "felicity", name: "Felicity ground", line: "The Felicity ground, seen from above." },
    { id: "amphitheatre", name: "Amphitheatre", line: "The amphitheatre and the basketball court." }
  ];

  // black video bars on the 20-year-video stills: [top %, bottom %] to crop away
  var CROP = { "img-01": [14.4, 5.1], "img-02": [13.4, 12.6], "img-03": [13.0, 12.5], "img-04": [13.0, 12.6], "img-05": [12.9, 12.5], "img-07": [6.5, 0] };
  var FILE_SIZES = { "1-bar-association.jpg": [1000, 750], "2-court-hall-7.jpg": [1000, 750], "3-library.jpg": [1000, 750], "4-govt-pleader.jpg": [1000, 750], "ximg-01.jpg": [550, 324], "ximg-02.jpg": [550, 324], "ximg-05.jpg": [173, 209], "ximg-06.jpg": [524, 425], "ximg-07.jpg": [499, 431] };

  var S = null;

  /** {src, w, h} for an image id from images.js or a plain file path. */
  function pic(x) {
    var im = U.image(x);
    if (im) return { src: im.file, w: im.w || 1600, h: im.h || 1000, crop: CROP[x] || null };
    var sz = FILE_SIZES[x.split("/").pop()] || [1600, 1000];
    return { src: x, w: sz[0], h: sz[1] };
  }
  function imgNode(p, extra) {
    var keep = p.crop ? 1 - (p.crop[0] + p.crop[1]) / 100 : 1;
    var st = { "--ar": (p.w / (p.h * keep)).toFixed(4), "--nw": Math.round(p.w * 2.2) + "px" };
    if (p.crop) st.objectViewBox = "inset(" + p.crop[0] + "% 0 " + p.crop[1] + "% 0)";
    Object.keys(extra || {}).forEach(function (k) { st[k] = extra[k]; });
    return el("div", { class: "sl-img" }, el("img", { src: p.src, alt: "", draggable: "false", style: st }));
  }

  function decodeAll(node) {
    var imgs = Array.prototype.slice.call(node.querySelectorAll("img"));
    return Promise.all(imgs.map(function (i) { return i.decode ? i.decode().catch(function () {}) : Promise.resolve(); }));
  }

  /* ---------- shared player ---------- */
  function player(opts) {
    // opts: { root, items[], build(item, i) -> node, dur(item) -> ms, onShow(item, i) }
    var st = { i: -1, timer: 0, paused: false, cur: null, busy: false, t0: 0, ms: 0, raf: 0 };
    function schedule(ms) {
      clearTimeout(st.timer); st.ms = ms; st.t0 = performance.now();
      if (!st.paused) st.timer = setTimeout(function () { go(st.i + 1); }, ms);
    }
    function go(n) {
      if (!S || st.busy) return;
      var len = opts.items.length, idx = ((n % len) + len) % len, item = opts.items[idx];
      var node = opts.build(item, idx);
      st.busy = true;
      opts.stage.appendChild(node);
      decodeAll(node).then(function () {
        if (!S) return;
        st.busy = false;
        void node.offsetWidth;
        node.classList.add("on");
        var old = st.cur; st.cur = node; st.i = idx;
        if (old) { old.classList.remove("on"); old.classList.add("leaving"); setTimeout(function () { old.remove(); }, 1700); }
        if (opts.onShow) opts.onShow(item, idx);
        schedule(opts.dur(item));
      });
    }
    function tick() {
      if (!S) return;
      var k = st.paused ? null : U.clamp((performance.now() - st.t0) / (st.ms || 1), 0, 1);
      if (k != null && opts.progress) opts.progress.style.transform = "scaleX(" + k.toFixed(4) + ")";
      st.raf = requestAnimationFrame(tick);
    }
    st.raf = requestAnimationFrame(tick);
    return {
      go: go,
      next: function () { go(st.i + 1); },
      prev: function () { go(st.i - 1); },
      index: function () { return st.i; },
      toggle: function () {
        st.paused = !st.paused;
        if (st.paused) clearTimeout(st.timer); else schedule(Math.max(1500, st.ms - (performance.now() - st.t0)));
        return st.paused;
      },
      stop: function () { clearTimeout(st.timer); cancelAnimationFrame(st.raf); }
    };
  }

  function chrome(root, kind, head, sub) {
    var stage = el("div", { class: "sl-stage" });
    var progress = el("i");
    var count = el("span", { class: "sl-count mono" });
    var pauseBtn = el("button", { class: "sl-btn", type: "button", "aria-label": "Pause" }, M.ui.icon("pause"));
    var prevBtn = el("button", { class: "sl-btn", type: "button", "aria-label": "Previous" }, M.ui.icon("chevron-left"));
    var nextBtn = el("button", { class: "sl-btn", type: "button", "aria-label": "Next" }, M.ui.icon("chevron-right"));
    var sec = el("section", { class: "page slides", dataset: { kind: kind } },
      stage,
      el("header", { class: "sl-head" }, el("b", null, head), sub ? el("span", null, sub) : null),
      el("div", { class: "sl-foot" }, count, el("div", { class: "sl-progress" }, progress), el("div", { class: "sl-ctrl" }, prevBtn, pauseBtn, nextBtn)));
    root.appendChild(sec);
    return { sec: sec, stage: stage, progress: progress, count: count, pauseBtn: pauseBtn, prevBtn: prevBtn, nextBtn: nextBtn };
  }

  function wire(c, p) {
    function setPause(paused) {
      c.pauseBtn.textContent = ""; c.pauseBtn.appendChild(M.ui.icon(paused ? "play" : "pause"));
      c.pauseBtn.setAttribute("aria-label", paused ? "Play" : "Pause");
      c.sec.classList.toggle("paused", paused);
    }
    c.prevBtn.addEventListener("click", function () { p.prev(); });
    c.nextBtn.addEventListener("click", function () { p.next(); });
    c.pauseBtn.addEventListener("click", function () { setPause(p.toggle()); });
    function onKey(e) {
      var t = e.target; if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      if (e.key === "ArrowRight") { e.preventDefault(); p.next(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); p.prev(); }
      else if (e.key === " ") { e.preventDefault(); setPause(p.toggle()); }
    }
    document.addEventListener("keydown", onKey);
    // hide the cursor and the buttons when the mouse rests
    var idle = 0;
    function wake() { c.sec.classList.add("awake"); clearTimeout(idle); idle = setTimeout(function () { if (S) c.sec.classList.remove("awake"); }, 2500); }
    c.sec.addEventListener("pointermove", wake);
    S.cleanup.push(function () { document.removeEventListener("keydown", onKey); clearTimeout(idle); p.stop(); });
  }

  /* ---------- Board 1: photos ---------- */
  function buildPhoto(item, i) {
    var pics = (item.imgs || []).concat(item.files || []).map(pic);
    var fig = el("div", { class: ["sl-fig", pics.length > 2 ? "four" : pics.length > 1 ? "two" : "one"] }, pics.map(function (p, k) {
      return imgNode(p, { "--kb-x": ((i + k) % 2 ? -1.5 : 1.5) + "%", "--kb-y": ((i % 3) - 1) + "%" });
    }));
    return el("div", { class: "sl-slide" }, fig,
      el("div", { class: "sl-cap" }, el("p", { class: "sl-text" }, item.text), el("p", { class: "sl-src" }, item.src)));
  }

  M.pages.photos = {
    id: "photos", route: "photos", title: "Old campus", navLabel: "Old campus", nav: true, navOrder: 3,
    render: function (root) {
      S = { cleanup: [] };
      var c = chrome(root, "photos", "Setting the scene", "IIIT in its early years");
      var p = player({ stage: c.stage, progress: c.progress, items: PHOTO_SLIDES, build: buildPhoto,
        dur: function (it) { return it.ms || 7500; },
        onShow: function (item, i) { c.count.textContent = (i + 1) + " / " + PHOTO_SLIDES.length; } });
      wire(c, p);
      p.go(0);
    },
    destroy: function () { if (!S) return; S.cleanup.forEach(function (f) { f(); }); S = null; }
  };

  /* ---------- Board 2: buildings ---------- */
  function buildingItems() {
    var items = [];
    BUILD_PLACES.forEach(function (bp) {
      var pl = U.place(bp.id); if (!pl) return;
      var seq = (pl.sequence || []).filter(function (id) { return U.image(id); });
      seq.forEach(function (id, k) {
        items.push({ place: bp, img: id, k: k, n: seq.length, first: k === 0, last: k === seq.length - 1 });
      });
    });
    return items;
  }
  function buildFrame(item) {
    var p = pic(item.img); p.w = p.w || 1600;
    var node = el("div", { class: ["sl-slide", "sl-frame", item.first ? "first" : ""] },
      el("div", { class: "sl-fig one sat" }, imgNode(p)),
      el("div", { class: "sl-place" },
        el("h2", null, item.place.name),
        el("p", null, item.place.line),
        el("div", { class: "sl-pips" }, Array.apply(null, { length: item.n }).map(function (_, j) {
          return el("i", { class: j < item.k ? "done" : (j === item.k ? "now" : "") });
        })),
        el("p", { class: "sl-src" }, "Google Earth screenshots, oldest to newest. Frame " + (item.k + 1) + " of " + item.n + ".")));
    return node;
  }

  M.pages.buildings = {
    id: "buildings", route: "buildings", title: "How buildings grew", navLabel: "Buildings", nav: true, navOrder: 5,
    render: function (root) {
      S = { cleanup: [] };
      var items = buildingItems();
      var c = chrome(root, "buildings", "How buildings grew", "Satellite views over the years");
      var p = player({ stage: c.stage, progress: c.progress, items: items, build: buildFrame,
        dur: function (it) { return it.last ? 5200 : (it.first ? 4200 : 2800); },
        onShow: function (it) {
          var placeNo = BUILD_PLACES.indexOf(it.place) + 1;
          c.count.textContent = placeNo + " / " + BUILD_PLACES.length;
          c.sec.classList.toggle("new-place", it.first);
        } });
      wire(c, p);
      p.go(0);
    },
    destroy: function () { if (!S) return; S.cleanup.forEach(function (f) { f(); }); S = null; }
  };
})();
