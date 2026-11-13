/* quiz.js: the entry/exit quiz (#/quiz). Owner: saharsh-claude (S5). Data: M.quiz (same 8 questions as the paper cards,
   in the same order, options never shuffled). The first-try score is kept in localStorage via M.util.store (never throws),
   so a visitor can compare at the exit. Keys: A-D pick an answer, Enter goes on. */
(function () {
  "use strict";
  var M = window.M, U = M.util, UI = M.ui, el = UI.el;
  var LETTERS = ["A", "B", "C", "D", "E"];
  var st = null;

  function qs() { return (M.quiz && M.quiz.questions) || []; }

  function screen(node) {
    st.box.textContent = "";
    st.box.appendChild(node);
    st.box.classList.remove("quiz-in"); void st.box.offsetWidth; st.box.classList.add("quiz-in");
    var h = st.box.querySelector("h1, h2");
    if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
    if (st.box.getBoundingClientRect().top < 0) st.box.scrollIntoView({ block: "start" });
  }

  /* ---------- start ---------- */
  function startScreen() {
    st.step = "start"; st.i = 0; st.answers = [];
    var first = U.store.get("quiz-first", null);
    if (st.mode == null) st.mode = first ? "exit" : "first";
    var seg = el("div", { class: "quiz-seg", role: "radiogroup", "aria-label": "Which try is this?" },
      [["first", "This is my first try"], ["exit", "I'm back after the exhibit"]].map(function (m) {
        return el("button", { type: "button", role: "radio", "aria-checked": String(st.mode === m[0]), class: "quiz-seg-btn",
          on: { click: function () { st.mode = m[0]; Array.prototype.forEach.call(seg.children, function (b, k) { b.setAttribute("aria-checked", String(k === (m[0] === "first" ? 0 : 1))); }); } } }, m[1]);
      }));
    screen(el("div", { class: "quiz-start" },
      el("div", { class: "kicker" }, "Entry and exit quiz"),
      el("h1", null, (M.quiz && M.quiz.title) || "Do you know your institute?"),
      el("p", { class: "lede" }, (M.quiz && M.quiz.intro) || (qs().length + " questions. Take it now, then again at the exit.")),
      first ? el("p", { class: "quiz-prev" }, UI.icon("clock"), "Your first try on this device: " + first.score + " of " + first.total + ".") : null,
      seg,
      el("button", { type: "button", class: "btn btn--green quiz-go", on: { click: function () { st.answers = []; question(0); } } }, "Start the quiz", UI.icon("arrow-right")),
      el("p", { class: "muted small quiz-paper" }, "Prefer paper? Ask a guide for a quiz card. It has the same questions.")));
  }

  /* ---------- question ---------- */
  function question(i) {
    st.step = "q"; st.i = i;
    var q = qs()[i], answered = false;
    var feedback = el("div", { class: "quiz-feedback", "aria-live": "polite" });
    var next = el("button", { type: "button", class: "btn quiz-next", hidden: true, on: { click: function () { go(); } } },
      i === qs().length - 1 ? "See my score" : "Next question", UI.icon("arrow-right"));
    var opts = q.options.map(function (o, k) {
      return el("button", { type: "button", class: "quiz-opt", dataset: { k: String(k) }, on: { click: function () { pick(k); } } },
        el("span", { class: "quiz-letter mono", "aria-hidden": "true" }, LETTERS[k]), el("span", { class: "quiz-opt-text" }, o),
        el("span", { class: "quiz-mark", "aria-hidden": "true" }));
    });
    function pick(k) {
      if (answered) return;
      answered = true;
      var right = k === q.answer;
      st.answers[i] = k;
      opts.forEach(function (b, j) {
        b.disabled = true;
        if (j === q.answer) { b.classList.add("is-right"); b.querySelector(".quiz-mark").appendChild(UI.icon("check")); }
        else if (j === k) { b.classList.add("is-wrong"); b.querySelector(".quiz-mark").appendChild(UI.icon("close")); }
        else b.classList.add("is-dim");
      });
      feedback.appendChild(el("div", { class: ["quiz-verdict", right ? "ok" : "no"] }, right ? "Right!" : "Not quite. It's " + LETTERS[q.answer] + ": " + q.options[q.answer] + "."));
      feedback.appendChild(el("p", null, q.explain));
      feedback.appendChild(UI.sourceBadges(q.sources, { compact: true }));
      next.hidden = false;
      next.focus({ preventScroll: true });
      next.scrollIntoView({ block: "nearest", behavior: U.prefersReducedMotion() ? "instant" : "smooth" });
    }
    function go() { if (i + 1 < qs().length) question(i + 1); else result(); }
    st.pick = pick; st.next = function () { if (answered) go(); };
    screen(el("div", { class: "quiz-q" },
      el("div", { class: "quiz-progress" },
        el("span", { class: "mono" }, "Question " + (i + 1) + " of " + qs().length),
        el("ol", { class: "quiz-dots", "aria-hidden": "true" }, qs().map(function (x, j) {
          var cls = j < i ? (st.answers[j] === qs()[j].answer ? "ok" : "no") : (j === i ? "now" : "");
          return el("li", { class: cls });
        }))),
      el("h2", { class: "quiz-question" }, q.q),
      el("div", { class: "quiz-opts", role: "group", "aria-label": "Answers" }, opts),
      feedback,
      next));
  }

  /* ---------- result ---------- */
  function result() {
    st.step = "result";
    var total = qs().length, score = qs().reduce(function (s, q, i) { return s + (st.answers[i] === q.answer ? 1 : 0); }, 0);
    var first = U.store.get("quiz-first", null), line;
    if (st.mode === "first") {
      U.store.set("quiz-first", { score: score, total: total });
      line = score === total ? "Full marks. You really do know your institute." : "Now walk the exhibit. The answers are all on the boards. Then take it again at the exit.";
    } else if (first && first.total === total) {
      line = score > first.score ? "You went from " + first.score + " to " + score + ". The exhibit worked!" :
        score === first.score ? "Same as your first try: " + score + ". Ask a guide about the ones you missed." :
        "Your first try was " + first.score + ". Memory is tricky, which is what Board 4 is about.";
    } else {
      line = "We couldn't find a first-try score on this device, but " + score + " of " + total + " is yours to keep.";
    }
    var review = el("ol", { class: "quiz-review" }, qs().map(function (q, i) {
      var right = st.answers[i] === q.answer;
      var href = q.eventId && U.event(q.eventId) ? U.href("timeline", q.eventId) : (q.link || null);
      return el("li", { class: right ? "ok" : "no" },
        el("span", { class: "quiz-review-mark", "aria-label": right ? "Right" : "Wrong" }, UI.icon(right ? "check" : "close")),
        el("div", null,
          el("b", null, q.q),
          el("span", null, "Answer: " + q.options[q.answer] + (right ? "" : " (you said " + (q.options[st.answers[i]] || "nothing") + ")")),
          href ? el("a", { href: href }, href.indexOf("#/timeline") === 0 ? "See it on the timeline" : "Read more", UI.icon("arrow-right")) : null));
    }));
    screen(el("div", { class: "quiz-result" },
      el("div", { class: "kicker" }, st.mode === "first" ? "Your first try" : "Your exit score"),
      el("h2", { class: "quiz-score" }, el("b", null, String(score)), el("span", null, " of " + total)),
      el("p", { class: "lede" }, line),
      el("div", { class: "quiz-actions" },
        el("button", { type: "button", class: "btn btn--green", on: { click: function () { st.mode = st.mode === "first" ? "exit" : "first"; startScreen(); } } }, UI.icon("flip"), st.mode === "first" ? "Done the exhibit? Try again" : "Play again"),
        el("a", { class: "btn btn--ghost", href: U.href("timeline") }, "Explore the timeline")),
      el("h3", { class: "quiz-review-title" }, "Explore the answers"),
      review));
  }

  function onKey(e) {
    if (!st || e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target && e.target.tagName;
    if (t === "INPUT" || t === "TEXTAREA") return;
    if (st.step === "q") {
      var k = LETTERS.indexOf(String(e.key).toUpperCase());
      if (k >= 0 && k < qs()[st.i].options.length) { e.preventDefault(); st.pick(k); }
      else if (e.key === "Enter" && !(e.target && e.target.closest && e.target.closest("button, a"))) { e.preventDefault(); st.next(); }
    }
  }

  M.pages.quiz = {
    id: "quiz", route: "quiz", title: "Quiz", navLabel: "Quiz", nav: true, navOrder: 9,
    render: function (root, ctx) {
      st = { step: "start", i: 0, answers: [], mode: null, box: el("div", { class: "quiz-box" }) };
      root.appendChild(el("section", { class: "page quiz" }, el("div", { class: "wrap" }, el("div", { class: "page-pad" }, st.box))));
      document.addEventListener("keydown", onKey);
      if (!qs().length) { st.box.appendChild(el("p", { class: "empty" }, "The quiz is not ready yet.")); return; }
      startScreen();
    },
    destroy: function () { document.removeEventListener("keydown", onKey); st = null; }
  };
})();
