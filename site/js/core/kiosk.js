/* kiosk.js: per-monitor screens, idle reset + playlists, keyboard shortcuts. Owner: aakarsh-claude (A2).
   index.html?screen=board1#/...  (query BEFORE the hash). Screens live in M.config.screens. */
(function () {
  "use strict";
  var M = (window.M = window.M || {});
  var U = M.util;
  var K = (M.kiosk = {});
  var search = U.parseQuery(location.search);
  var screenId = search.screen || null;
  var screen = screenId && M.config && M.config.screens ? M.config.screens[screenId] || null : null;
  M.state.screen = screen ? screenId : null;
  K.dev = search.dev === "1";

  var idleMs = ((M.config && M.config.idleSeconds) || 90) * 1000;
  var pscale = search.pscale ? Math.max(0.01, +search.pscale) : 1;   // ?pscale=0.1 speeds playlists up for testing
  if (search.idle) idleMs = Math.max(5, +search.idle) * 1000; // ?idle=10 for testing
  var idleTimer = 0, playTimer = 0, playIndex = -1, playing = false, progressEl = null, progRaf = 0, tourIdle = 0;
  var inputFns = [];

  K.screen = function () { return screen; };
  K.screenId = function () { return screenId; };
  K.homeRoute = function () { return screen ? screen.home : "#/start"; };
  K.isPlaying = function () { return playing; };

  /** Subscribe to real user input (pointer, key, wheel, touch). Pages use it to stop autoplay. Returns unsubscribe. */
  K.onInput = function (fn) { inputFns.push(fn); return function () { inputFns = inputFns.filter(function (f) { return f !== fn; }); }; };

  function pathOf(hash) { return ((hash || "").split("?")[0].replace(/^#\/?/, "").split("/")[0]) || "start"; }

  function stopPlaylist() {
    playing = false; clearTimeout(playTimer); cancelAnimationFrame(progRaf);
    if (progressEl) progressEl.firstChild.style.width = "0";
  }
  function runProgress(ms) {
    if (!progressEl) { progressEl = M.ui.el("div", { class: "kiosk-progress" }, M.ui.el("span")); document.body.appendChild(progressEl); }
    var bar = progressEl.firstChild, t0 = performance.now();
    cancelAnimationFrame(progRaf);
    (function tick(now) { var k = U.clamp((now - t0) / ms, 0, 1); bar.style.width = (k * 100) + "%"; if (k < 1 && playing) progRaf = requestAnimationFrame(tick); })(t0);
  }
  function playNext(skips) {
    var list = (screen && screen.playlist) || [{ route: screen.home, secs: 0 }];
    playIndex = (playIndex + 1) % list.length;
    var item = list[playIndex];
    // a page that is still a "coming soon" stub never gets screen time
    if (M.router.isStub(item.route) && list.length > 1 && (skips || 0) < list.length) { playNext((skips || 0) + 1); return; }
    playing = true;
    while (M.ui.closeTop()) { /* clear overlays */ }
    M.router.go(item.route, { force: true });
    var ms = item.secs * 1000 * pscale;
    if (list.length > 1 && item.secs) { runProgress(ms); playTimer = setTimeout(playNext, ms); }
    updatePill();
  }
  function onIdle() {
    if (!screen) return;
    // a guide talking over one tour step keeps the tour; a tour left alone for 10 minutes ends
    if (M.tour && M.tour.active()) { tourIdle += idleMs; if (tourIdle < 600000) { resetIdle(); return; } M.tour.stop(); }
    tourIdle = 0;
    if (M.tour) M.tour.toggleNotes(false);
    playIndex = -1;
    playNext();
  }
  function resetIdle() { clearTimeout(idleTimer); if (screen) idleTimer = setTimeout(onIdle, idleMs); }

  var lastMove = 0;
  function onInput(e) {
    if (e.type === "pointermove") { var now = Date.now(); if (now - lastMove < 250) return; lastMove = now; }
    if (playing) { stopPlaylist(); updatePill(); }
    tourIdle = 0;
    resetIdle();
    inputFns.slice().forEach(function (fn) { try { fn(e); } catch (err) { console.error(err); } });
  }
  ["pointerdown", "pointermove", "keydown", "wheel", "touchstart"].forEach(function (t) {
    window.addEventListener(t, onInput, { passive: true, capture: true });
  });

  /* "Back to ..." pill */
  var pill = null;
  function updatePill() {
    if (!screen) return;
    var away = pathOf(location.hash) !== pathOf(screen.home);
    var show = away && !playing;
    if (show && !pill) {
      pill = M.ui.el("button", { class: "kiosk-pill", type: "button", on: { click: function () { playIndex = -1; playNext(); } } },
        M.ui.icon("home"), "Back to " + (screen.short || screen.label.split(":")[0]));
      document.body.appendChild(pill);
    } else if (!show && pill) { pill.remove(); pill = null; }
  }

  /* keyboard */
  function onKey(e) {
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target, tag = t && t.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (t && t.isContentEditable)) return;
    var k = e.key;
    if (k === "Escape") { M.ui.closeTop(); return; }
    if (k === "f" || k === "F") { K.toggleFullscreen(); return; }
    if (k === "h" || k === "H") { M.router.go(K.homeRoute()); return; }
    if (/^[0-9]$/.test(k)) {
      var pages = K.navPages(), idx = k === "0" ? 9 : (+k - 1);
      if (pages[idx]) { e.preventDefault(); M.router.go("#/" + (pages[idx].route || pages[idx].id)); }
    }
  }
  /* ---------- fullscreen + wake lock (for a phone cast to a screen: no keyboard, and the phone must not sleep) ---------- */
  function fsElement() { return document.fullscreenElement || document.webkitFullscreenElement || null; }
  K.toggleFullscreen = function () {
    var d = document.documentElement;
    try {
      if (!fsElement()) { var p = (d.requestFullscreen || d.webkitRequestFullscreen || function () {}).call(d, { navigationUI: "hide" }); if (p && p.catch) p.catch(function () {}); }
      else (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    } catch (e) { /* not allowed here (e.g. iPhone Safari): use Add to Home Screen instead */ }
  };
  /** A "Full screen" button for kiosk screens on touch devices (phones have no F key). Hidden on laptops and once fullscreen. */
  K.fullscreenButton = function () {
    var canFs = document.fullscreenEnabled || document.webkitFullscreenEnabled;
    // some Android phones report (hover: hover), so also count any touch input; a touchscreen laptop gets the button too, which is harmless
    var touch = navigator.maxTouchPoints > 0 || (window.matchMedia && (window.matchMedia("(any-pointer: coarse)").matches || window.matchMedia("(hover: none)").matches));
    if (!screen || !canFs || !touch) return null;
    var b = M.ui.el("button", { type: "button", class: "nav-fs", "aria-label": "Full screen", title: "Full screen (F)", on: { click: K.toggleFullscreen } }, M.ui.icon("expand"), M.ui.el("span", null, "Full screen"));
    function sync() { b.hidden = !!fsElement(); }
    document.addEventListener("fullscreenchange", sync); document.addEventListener("webkitfullscreenchange", sync);
    return b;
  };
  var wakeLock = null;
  function keepAwake() {
    if (!screen || !navigator.wakeLock || document.visibilityState !== "visible" || wakeLock) return;
    navigator.wakeLock.request("screen").then(function (l) { wakeLock = l; l.addEventListener("release", function () { wakeLock = null; }); }).catch(function () { /* refused (battery saver, insecure origin): set the phone's screen timeout instead */ });
  }

  /** Pages in the top nav: M.config.nav (list of routes) if set, else every page with nav: true by navOrder. */
  K.navPages = function () {
    var order = M.config && M.config.nav;
    if (order) return order.map(function (r) { return M.router.pageFor("#/" + r); }).filter(Boolean);
    return Object.keys(M.pages).map(function (k) { return M.pages[k]; }).filter(function (p) { return p.nav; })
      .sort(function (a, b) { return (a.navOrder || 99) - (b.navOrder || 99); });
  };

  K.start = function () {
    document.addEventListener("keydown", onKey);
    if (screen) {
      document.body.classList.add("kiosk");
      if (screen.tour) document.body.classList.add("tour-screen");
      // keep a phone (or a TV browser) from going to sleep while it drives a screen; the lock drops when the tab is hidden, so take it again
      keepAwake();
      document.addEventListener("visibilitychange", keepAwake);
      window.addEventListener("pointerdown", keepAwake, { passive: true });
      // arm the idle timer only once someone touches it (or if it opened somewhere other than home),
      // so a screen that starts on its home view doesn't restart itself 90 s later
      if (location.hash !== screen.home) resetIdle();
      M.router.onChange(updatePill);
      // Start the playlist timer straight away if we open on the home route.
      setTimeout(function () { if (pathOf(location.hash) === pathOf(screen.home) && screen.playlist && screen.playlist.length > 1) { playIndex = 0; playing = true; runProgress(screen.playlist[0].secs * 1000 * pscale); playTimer = setTimeout(playNext, screen.playlist[0].secs * 1000 * pscale); } updatePill(); }, 50);
    }
    if (K.dev) {
      var tag = M.ui.el("div", { class: "dev-route" });
      document.body.appendChild(tag);
      M.router.onChange(function () { tag.textContent = (screenId ? "[" + screenId + "] " : "") + location.hash; });
      document.body.classList.add("dev");
    }
  };
})();
