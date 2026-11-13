/* ending.js: Then and Now, the exit wall (#/ending). Owner: saharsh-claude (S6). Data: M.ending, M.people, M.config.
   Rows reveal one by one on load (problem, then how it got solved); all at once with reduced motion.
   The NAB satellite images loop as a flipbook. In a kiosk playlist (or ?autoplay=1) the page slowly tours itself. */
(function () {
  "use strict";
  var M = window.M, U = M.util, UI = M.ui, el = UI.el;
  var TEAM = ["Aakarsh Mishra", "Soham Chatterjee", "Yogesh Krishna", "Siddharth Choudhary", "Saharsh"];
  var st = null;

  function later(fn, ms) { var t = setTimeout(fn, ms); st.timers.push(t); return t; }
  function smooth() { return U.prefersReducedMotion() ? "instant" : "smooth"; }

  function row(r, i) {
    return el("li", { class: "end-row", style: { "--i": i } },
      el("div", { class: "end-when mono" }, r.when),
      el("div", { class: "end-problem" }, el("span", { class: "end-tag end-tag--stuck mono" }, "Stuck"), el("p", null, r.problem)),
      el("div", { class: "end-solved" }, el("span", { class: "end-tag end-tag--solved mono" }, UI.icon("check"), "Solved"), el("p", null, r.solved)),
      UI.sourceBadges(r.sources, { compact: true }));
  }

  function flipbook(ids, note) {
    ids = (ids || []).filter(function (id) { return U.image(id); });
    if (!ids.length) return null;
    var i = ids.length - 1;
    var img = el("img", { src: U.image(ids[i]).file, alt: U.image(ids[i]).caption, class: "end-flip-img" });
    var count = el("span", { class: "end-flip-n mono" });
    var bar = el("div", { class: "end-flip-steps" }, ids.map(function (id, k) {
      return el("button", { type: "button", "aria-label": "Satellite image " + (k + 1) + " of " + ids.length, on: { click: function () { stopFlip(); show(k); } } });
    }));
    function show(k) {
      i = k;
      img.src = U.image(ids[k]).file; img.alt = U.image(ids[k]).caption;
      count.textContent = (k + 1) + " / " + ids.length;
      Array.prototype.forEach.call(bar.children, function (b, j) { b.setAttribute("aria-current", j === k ? "true" : "false"); });
    }
    function stopFlip() { clearInterval(st.flip); st.flip = 0; }
    ids.forEach(function (id) { var pre = new Image(); pre.src = U.image(id).file; });
    show(i);
    if (!U.prefersReducedMotion()) { i = -1; st.flip = setInterval(function () { show((i + 1) % ids.length); }, 1400); }
    return el("figure", { class: "end-flip" },
      el("button", { type: "button", class: "end-flip-stage", "aria-label": "Open the satellite images", on: { click: function () { UI.lightbox(ids, i); } } }, img, count),
      bar,
      note ? el("figcaption", { class: "mono small" }, note) : null);
  }

  function tour() {
    if (st.touring) return;
    st.touring = true;
    var stops = [st.rowsEl, st.nowEl, st.promptEl, null];
    var k = 0;
    (function next() {
      if (!st || !st.touring) return;
      var n = stops[k % stops.length]; k++;
      if (n) window.scrollTo({ top: Math.max(0, n.getBoundingClientRect().top + window.scrollY - 90), behavior: smooth() });
      else window.scrollTo({ top: 0, behavior: smooth() });
      later(next, n ? 15000 : 10000);
    })();
    st.unsub.push(M.kiosk.onInput(function () { if (st) { st.touring = false; st.timers.forEach(clearTimeout); st.timers = []; } }));
  }

  M.pages.ending = {
    id: "ending", route: "ending", title: "Then and now", navLabel: "Then and now", nav: true, navOrder: 10,

    render: function (root, ctx) {
      st = { timers: [], unsub: [], flip: 0, touring: false };
      var E = M.ending || { rows: [] }, C = M.config || {};
      var names = (M.people || []).map(function (p) { return p.fullName || p.name; });
      st.rowsEl = el("ol", { class: "end-rows" }, (E.rows || []).map(row));
      st.nowEl = E.now ? el("section", { class: "end-now" },
        flipbook(E.now.images || [E.now.image], E.now.imagesNote),
        el("div", { class: "end-now-text" },
          el("div", { class: "kicker" }, E.now.kicker || "Now"),
          el("h2", null, "Out of room, again"),
          el("p", { class: "end-now-p" }, E.now.text),
          UI.sourceBadges(E.now.sources, { compact: true }))) : null;
      st.promptEl = el("section", { class: "end-prompt" },
        E.closing ? el("p", { class: "end-closing" }, E.closing) : null,
        el("div", { class: "end-note" },
          el("p", null, E.prompt),
          el("span", { class: "end-note-hint mono" }, "Sticky notes and pens are by the wall")));

      var page = el("section", { class: "page end" }, el("div", { class: "wrap" }, el("div", { class: "page-pad" },
        el("header", { class: "end-hero" },
          el("div", { class: "kicker" }, E.kicker || "Then and now"),
          el("h1", null, E.title),
          E.intro ? el("p", { class: "lede" }, E.intro) : null),
        st.rowsEl,
        st.nowEl,
        st.promptEl,
        el("footer", { class: "end-thanks" },
          el("p", null, el("b", null, E.thanksLead || "Thank you to everyone who told us their IIIT:"), " ", names.join(", ") + ". And to everyone in the offices who answered our questions."),
          el("p", { class: "mono small" }, (C.team || "Team CakedUp") + ": " + TEAM.join(", ") + ". " + (C.course || "UPDH, IIIT Hyderabad") + ", " + (C.date || "14 November 2026") + "."),
          el("div", { class: "end-links" },
            el("a", { class: "btn btn--green", href: U.href("quiz") }, "Take the exit quiz", UI.icon("arrow-right")),
            el("a", { class: "btn btn--ghost", href: U.href("how-we-know") }, "How we know all this"))))));
      root.appendChild(page);

      /* staggered reveal: rows start hidden and switch on one by one */
      if (!U.prefersReducedMotion()) {
        page.classList.add("end-animate");
        Array.prototype.forEach.call(st.rowsEl.children, function (li, i) { later(function () { li.classList.add("in"); }, 350 + i * 520); });
      }
      if (ctx.query.autoplay === "1" || (M.kiosk.isPlaying && M.kiosk.isPlaying())) later(tour, 350 + (E.rows || []).length * 520 + 6000);
    },

    destroy: function () {
      if (!st) return;
      st.timers.forEach(clearTimeout);
      clearInterval(st.flip);
      st.unsub.forEach(function (f) { f(); });
      st = null;
    }
  };
})();
