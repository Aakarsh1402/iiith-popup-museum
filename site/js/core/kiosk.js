/* kiosk.js: per-monitor screens, idle reset + playlists, keyboard shortcuts. Owner: aakarsh-claude (A2).
   index.html?screen=history#/...  (query BEFORE the hash). Screens live in M.config.screens. */
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
  if (search.idle) idleMs = Math.max(5, +search.idle) * 1000; // ?idle=10 for testing
  var idleTimer = 0, playTimer = 0, playIndex = -1, playing = false, progressEl = null, progRaf = 0;
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
  function playNext() {
    var list = (screen && screen.playlist) || [{ route: screen.home, secs: 0 }];
    playIndex = (playIndex + 1) % list.length;
    var item = list[playIndex];
    playing = true;
    while (M.ui.closeTop()) { /* clear overlays */ }
    M.router.go(item.route, { force: true });
    if (list.length > 1 && item.secs) { runProgress(item.secs * 1000); playTimer = setTimeout(playNext, item.secs * 1000); }
    updatePill();
  }
  function onIdle() {
    if (!screen) return;
    playIndex = -1;
    playNext();
  }
  function resetIdle() { clearTimeout(idleTimer); if (screen) idleTimer = setTimeout(onIdle, idleMs); }

  var lastMove = 0;
  function onInput(e) {
    if (e.type === "pointermove") { var now = Date.now(); if (now - lastMove < 250) return; lastMove = now; }
    if (playing) { stopPlaylist(); updatePill(); }
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
    if (k === "f" || k === "F") {
      if (!document.fullscreenElement) { var d = document.documentElement; (d.requestFullscreen || d.webkitRequestFullscreen || function () {}).call(d); }
      else (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      return;
    }
    if (k === "h" || k === "H") { M.router.go(K.homeRoute()); return; }
    if (/^[0-9]$/.test(k)) {
      var pages = K.navPages(), idx = k === "0" ? 9 : (+k - 1);
      if (pages[idx]) { e.preventDefault(); M.router.go("#/" + (pages[idx].route || pages[idx].id)); }
    }
  }
  K.navPages = function () {
    return Object.keys(M.pages).map(function (k) { return M.pages[k]; }).filter(function (p) { return p.nav; })
      .sort(function (a, b) { return (a.navOrder || 99) - (b.navOrder || 99); });
  };

  K.start = function () {
    document.addEventListener("keydown", onKey);
    if (screen) {
      document.body.classList.add("kiosk");
      resetIdle();
      M.router.onChange(updatePill);
      // Start the playlist timer straight away if we open on the home route.
      setTimeout(function () { if (pathOf(location.hash) === pathOf(screen.home) && screen.playlist && screen.playlist.length > 1) { playIndex = 0; playing = true; runProgress(screen.playlist[0].secs * 1000); playTimer = setTimeout(playNext, screen.playlist[0].secs * 1000); } updatePill(); }, 50);
    }
    if (K.dev) {
      var tag = M.ui.el("div", { class: "dev-route" });
      document.body.appendChild(tag);
      M.router.onChange(function () { tag.textContent = (screenId ? "[" + screenId + "] " : "") + location.hash; });
      document.body.classList.add("dev");
    }
  };
})();
