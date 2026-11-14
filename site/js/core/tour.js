/* tour.js: the Board 4 website tour and the speaker notes. Owner: aakarsh-claude (A9).
   T (or the Tour button in the nav) starts/stops the tour. Next/back: the buttons, PageDown/PageUp (clickers), or ] and [.
   N shows/hides the speaker note for the page on screen (M.notes.pages). Notes are hidden by default and never shown on kiosk idle. */
(function () {
  "use strict";
  var M = window.M, el = M.ui.el, U = M.util;
  var T = (M.tour = {});
  var bar = null, noteBox = null, idx = -1, notesOn = false;

  function steps() { return (M.notes && M.notes.tour) || []; }
  function routeName(hash) { return M.router.parse(hash || location.hash).route; }

  /* ---------- speaker note ---------- */
  function renderNote() {
    var n = M.notes && M.notes.pages && M.notes.pages[routeName()];
    if (!notesOn || !n) { if (noteBox) { noteBox.remove(); noteBox = null; } return; }
    if (!noteBox) { noteBox = el("aside", { class: "speaker-note", "aria-live": "polite" }); document.body.appendChild(noteBox); }
    noteBox.textContent = "";
    noteBox.appendChild(el("div", { class: "sn-head" }, el("b", null, "Speaker note"), el("span", null, "N to hide")));
    noteBox.appendChild(el("p", null, n.text));
    noteBox.classList.toggle("with-tour", !!bar);
  }
  T.toggleNotes = function (force) { notesOn = force == null ? !notesOn : !!force; renderNote(); };

  /* ---------- tour bar ---------- */
  function draw() {
    var list = steps(), s = list[idx];
    if (!bar || !s) return;
    bar.textContent = "";
    var dots = el("div", { class: "tour-dots" }, list.map(function (_, i) {
      return el("button", { type: "button", class: i === idx ? "on" : (i < idx ? "done" : ""), "aria-label": "Step " + (i + 1), on: { click: function () { T.go(i); } } });
    }));
    bar.appendChild(el("div", { class: "tour-main" },
      el("div", { class: "tour-kicker mono" }, "Website tour " + (idx + 1) + " / " + list.length),
      el("div", { class: "tour-title" }, s.title),
      el("div", { class: "tour-text" }, s.text)));
    bar.appendChild(el("div", { class: "tour-side" }, dots,
      el("div", { class: "tour-btns" },
        el("button", { type: "button", class: "icon-btn", "aria-label": "Back", disabled: idx === 0, on: { click: T.prev } }, M.ui.icon("chevron-left")),
        idx < list.length - 1
          ? el("button", { type: "button", class: "btn btn--green tour-next", on: { click: T.next } }, "Next", M.ui.icon("arrow-right"))
          : el("button", { type: "button", class: "btn btn--green tour-next", on: { click: T.stop } }, "End tour", M.ui.icon("check")),
        el("button", { type: "button", class: "icon-btn", "aria-label": "End tour", on: { click: T.stop } }, M.ui.icon("close")))));
    bar.classList.remove("swap"); void bar.offsetWidth; bar.classList.add("swap");
  }
  T.go = function (i) {
    var list = steps(); if (!list.length) return;
    idx = U.clamp(i, 0, list.length - 1);
    if (!bar) { bar = el("div", { class: "tour-bar", role: "region", "aria-label": "Website tour" }); document.body.appendChild(bar); document.body.classList.add("touring"); }
    while (M.ui.closeTop()) { /* clear panels from the last stop */ }
    M.router.go(list[idx].route, { force: true });
    draw(); renderNote();
  };
  T.start = function () { T.go(0); };
  T.next = function () { T.go(idx + 1); };
  T.prev = function () { T.go(idx - 1); };
  T.active = function () { return !!bar; };
  T.stop = function () {
    if (bar) { bar.remove(); bar = null; }
    idx = -1; document.body.classList.remove("touring"); renderNote(); updateBtn();
  };

  /* ---------- nav button ---------- */
  var navBtn = null;
  function updateBtn() { if (navBtn) navBtn.setAttribute("aria-pressed", String(!!bar)); }
  T.navButton = function () {
    navBtn = el("button", { type: "button", class: "nav-tour", "aria-pressed": "false", title: "Website tour (T)", on: { click: function () { if (bar) T.stop(); else T.start(); updateBtn(); } } },
      M.ui.icon("play"), el("span", null, "Tour"));
    return navBtn;
  };

  document.addEventListener("keydown", function (e) {
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target, tag = t && t.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (t && t.isContentEditable)) return;
    if (e.key === "t" || e.key === "T") { if (bar) T.stop(); else T.start(); updateBtn(); }
    else if (e.key === "n" || e.key === "N") T.toggleNotes();
    else if (bar && (e.key === "PageDown" || e.key === "]")) { e.preventDefault(); T.next(); }
    else if (bar && (e.key === "PageUp" || e.key === "[")) { e.preventDefault(); T.prev(); }
  });

  // keep the note in step with the page; the router calls this after every swap
  M.router.onChange(renderNote);
})();
