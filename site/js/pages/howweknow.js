/* howweknow.js: How We Know (Board 4). Conflict flip cards, verified evidence chains, our correction, how we worked.
   Owner: saharsh-claude (S2). Data: M.conflicts, M.verified, M.correction. Routes: #/how-we-know, #/how-we-know/<C1|V1|correction>.
   ?autoplay=1 scrolls through the conflict cards, flipping each, then the verified chains and the correction. */
(function () {
  "use strict";
  var M = window.M, U = M.util, UI = M.ui, el = UI.el;
  var KIND_ICON = { oral: "mic", document: "doc", photo: "photo", web: "globe" };
  var KIND_LABEL = { oral: "Interview", document: "Document", photo: "Photo", web: "Web" };
  var st = null;

  function sourceType(ids) { var s = U.source((ids || [])[0]); return (s && s.type) || "web"; }
  function later(fn, ms) { var t = setTimeout(fn, ms); st.timers.push(t); return t; }
  function scrollTo(node, block) {
    if (!node) return;
    node.scrollIntoView({ behavior: U.prefersReducedMotion() ? "auto" : "smooth", block: block || "start" });
  }

  /* ---------- A. conflict flip cards ---------- */
  function account(a) {
    var type = sourceType(a.sources);
    return el("div", { class: "hwk-say", style: { "--c": "var(--s-" + type + ")" } },
      el("div", { class: "hwk-say-who" }, UI.icon(KIND_ICON[type] || "doc"), a.who,
        a.paraphrase ? el("span", { class: "hwk-say-note" }, "our summary") : null),
      el("p", null, a.text),
      UI.sourceBadges(a.sources, { compact: true }));
  }

  function conflictCard(c) {
    var front, back, card, flipBtn, backBtn;
    var onTimeline = (M.events || []).filter(function (e) { return e.conflictId === c.id; }).sort(U.byYear);
    function setFlipped(on, fromUser) {
      card.classList.toggle("flipped", on);
      flipBtn.setAttribute("aria-pressed", String(on));
      front.inert = on; back.inert = !on;
      front.setAttribute("aria-hidden", String(on)); back.setAttribute("aria-hidden", String(!on));
      if (fromUser) {
        M.router.replace(on ? U.href("how-we-know", c.id) : U.href("how-we-know"));
        (on ? backBtn : flipBtn).focus({ preventScroll: true });
      }
    }
    flipBtn = el("button", { class: "btn hwk-flip-btn", type: "button", "aria-pressed": "false",
      on: { click: function (e) { e.stopPropagation(); setFlipped(true, true); } } }, UI.icon("flip"), "What we think");
    backBtn = el("button", { class: "btn btn--ghost hwk-flip-btn", type: "button",
      on: { click: function (e) { e.stopPropagation(); setFlipped(false, true); } } }, UI.icon("flip"), "Back to the accounts");

    front = el("div", { class: "hwk-face hwk-front" },
      el("div", { class: "hwk-card-top" }, el("span", { class: "kicker" }, c.id + (c.kicker ? " / " + c.kicker : "")), UI.stamp("Sources disagree", "contested")),
      el("h3", { class: "hwk-q" }, c.question),
      el("div", { class: ["hwk-says", c.accounts.length > 2 ? "hwk-says--grid" : ""] }, c.accounts.map(account)),
      el("div", { class: "hwk-card-foot" }, el("span", { class: "hwk-who-right" }, "Who's right?"), flipBtn));

    back = el("div", { class: "hwk-face hwk-back", "aria-hidden": "true" },
      el("div", { class: "hwk-card-top" }, el("span", { class: "kicker" }, c.id + (c.kicker ? " / " + c.kicker : "")), el("span", { class: "hwk-q-small" }, c.question)),
      el("h4", null, "What we think"),
      el("p", { class: "hwk-take" }, c.ourTake),
      el("h4", null, "What would settle it"),
      el("p", null, c.settleWith),
      c.settleSources ? UI.sourceBadges(c.settleSources, { compact: true }) : null,
      onTimeline.length ? el("div", { class: "hwk-links" }, el("span", { class: "mono small" }, "On the timeline:"),
        onTimeline.map(function (e) { return el("a", { href: U.href("timeline", e.id) }, U.formatYear(e) + ": " + e.title); })) : null,
      el("div", { class: "hwk-card-foot" }, el("span"), backBtn));
    back.inert = true;

    card = el("article", { class: ["hwk-flip", c.featured ? "" : "hwk-flip--minor"], id: "hwk-" + c.id, tabindex: "-1",
      "aria-label": "Conflict card " + c.id + ": " + c.question,
      on: {
        click: function (e) { if (e.target.closest("a, button, .popover")) return; setFlipped(!card.classList.contains("flipped"), true); },
        keydown: function (e) { if (e.target === card && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); setFlipped(!card.classList.contains("flipped"), true); } }
      } },
      el("div", { class: "hwk-flip-inner" }, front, back));
    st.cards[c.id] = { node: card, flip: setFlipped };
    return card;
  }

  /* ---------- B. verified chains ---------- */
  function chainNode(n) {
    var media = null;
    if (n.image && U.image(n.image)) media = UI.imageFigure(n.image, { caption: false, ratio: "4/3" });
    else if (n.doc) {
      var d = U.byId(M.documents || [], n.doc), pg = d && d.pages[(n.page || 1) - 1];
      if (pg) media = el("a", { class: "hwk-docthumb", href: U.href("archive", n.doc, n.page || 1), "aria-label": "Open " + d.title + ", page " + (n.page || 1) },
        el("img", { src: pg.thumb, alt: "", loading: "lazy" }), el("span", null, UI.icon("doc"), "p." + (n.page || 1)));
    }
    return el("li", { class: "hwk-node", style: { "--c": "var(--s-" + n.kind + ")" } },
      el("span", { class: "hwk-node-dot", "aria-hidden": "true" }, UI.icon(KIND_ICON[n.kind] || "doc")),
      el("div", { class: "hwk-node-card" },
        el("div", { class: "hwk-node-kind" }, KIND_LABEL[n.kind] || n.kind, n.label ? el("span", null, " / " + n.label) : null),
        media,
        el("p", null, n.text),
        UI.sourceBadges(n.sources, { compact: true })));
  }

  function verifiedRow(v) {
    var row = el("article", { class: "hwk-chain", id: "hwk-" + v.id, tabindex: "-1" },
      el("header", { class: "hwk-chain-head" },
        el("span", { class: "kicker" }, v.id),
        el("h3", null, v.claim),
        v.note ? el("p", { class: "muted" }, v.note) : null),
      el("ol", { class: "hwk-nodes" }, v.chain.map(chainNode),
        el("li", { class: "hwk-node hwk-node--end" }, UI.stamp("Corroborated", "corroborated", true))));
    st.cards[v.id] = { node: row };
    return row;
  }

  /* ---------- C. correction ---------- */
  function correction(c) {
    if (!c) return null;
    var node = el("article", { class: "hwk-proof", id: "hwk-correction", tabindex: "-1" },
      el("div", { class: "hwk-proof-paper" },
        el("div", { class: "hwk-proof-label mono" }, "Our Phase 4 draft, 6 Nov 2026"),
        el("p", { class: "hwk-proof-before" }, el("del", null, c.before)),
        el("p", { class: "hwk-proof-after" }, el("span", { class: "hwk-caret", "aria-hidden": "true" }, "^"), c.after),
        el("p", { class: "hwk-proof-lesson" }, c.lesson)),
      el("div", { class: "hwk-proof-side" },
        el("h3", null, c.title),
        c.how ? el("p", null, c.how) : null,
        el("div", { class: "hwk-links" },
          el("a", { href: U.href("voices", "P-GOPI") }, "Read Mr. Gopi's interview"),
          U.event("e-1998-booth") ? el("a", { href: U.href("timeline", "e-1998-booth") }, "The phone booth on the timeline") : null),
        UI.sourceBadges(c.sources)));
    st.cards.correction = { node: node };
    return node;
  }

  /* ---------- D. how we worked ---------- */
  function howWeWorked() {
    var n = (M.people || []).length;
    var docs = (M.documents || []).filter(function (d) { return d.id !== "curriculum"; }).length;
    var stats = [[n, n === 1 ? "interview" : "interviews"], [docs, "old documents"], [(M.images || []).length, "photos"], [(M.conflicts || []).length, "disagreements"]];
    var steps = [
      { t: "We listened", b: "We recorded interviews with " + n + " people who built IIIT or keep it running: staff, faculty and the librarian. Everyone here agreed to be recorded and quoted." },
      { t: "We checked", b: "We read what they told us against the c.2001 prospectus, the 2002 layout plan, the lab floor plans, a Ping article and our own photos." },
      { t: "We showed our working", b: "Where sources disagree, we show every side, say what we think and what would settle it. Where we were wrong, we say so. One interview reached us as a polished write-up, so we use its facts but never quote it as his words." },
      { t: "We're sharing it", b: "This history isn't only ours to tell. We're putting the documents and interviews in the open so others can correct and add to them. Historians call this shared authority." }
    ];
    return el("div", { class: "hwk-worked" },
      el("div", { class: "hwk-stats" }, stats.map(function (s) { return el("div", { class: "hwk-stat" }, el("b", null, String(s[0])), el("span", null, s[1])); })),
      el("ol", { class: "hwk-steps" }, steps.map(function (s, i) { return el("li", null, el("span", { class: "hwk-step-n mono" }, String(i + 1)), el("div", null, el("h3", null, s.t), el("p", null, s.b))); })),
      el("div", { class: "hwk-cta" },
        el("a", { class: "btn btn--green", href: U.href("voices") }, UI.icon("mic"), "Meet the people we interviewed"),
        el("a", { class: "btn btn--ghost", href: U.href("archive") }, UI.icon("doc"), "Open the archive")));
  }

  function sectionHead(id, kicker, title, lede) {
    return el("header", { class: "hwk-sec-head", id: "hwk-sec-" + id },
      el("div", { class: "kicker" }, kicker), el("h2", null, title), lede ? el("p", { class: "lede" }, lede) : null);
  }

  /* ---------- focus + autoplay ---------- */
  function focusCard(id, flip) {
    var c = st.cards[id];
    if (!c) return;
    if (c.flip) c.flip(flip !== false, false);
    scrollTo(c.node, c.flip ? "center" : "start");
    c.node.classList.remove("hwk-ping"); void c.node.offsetWidth; c.node.classList.add("hwk-ping");
  }

  function startAutoplay() {
    if (st.playing) return;
    st.playing = true;
    Object.keys(st.cards).forEach(function (k) { if (st.cards[k].flip) st.cards[k].flip(false, false); });
    var seq = [];
    (M.conflicts || []).filter(function (c) { return c.featured; }).forEach(function (c) {
      seq.push({ ms: 3500, run: function () { st.cards[c.id].flip(false, false); scrollTo(st.cards[c.id].node, "center"); } });
      seq.push({ ms: 9000, run: function () { st.cards[c.id].flip(true, false); } });
      seq.push({ ms: 900, run: function () { st.cards[c.id].flip(false, false); } });
    });
    (M.verified || []).forEach(function (v) { seq.push({ ms: 6500, run: function () { focusCard(v.id); } }); });
    if (st.cards.correction) seq.push({ ms: 9000, run: function () { focusCard("correction"); } });
    seq.push({ ms: 3000, run: function () { window.scrollTo({ top: 0, behavior: U.prefersReducedMotion() ? "auto" : "smooth" }); } });
    var i = 0;
    (function step() {
      if (!st || !st.playing) return;
      var s = seq[i % seq.length]; i++;
      s.run();
      later(step, s.ms);
    })();
    st.unsub.push(M.kiosk.onInput(stopAutoplay));
  }
  function stopAutoplay() {
    if (!st) return;
    st.playing = false;
    st.timers.forEach(clearTimeout); st.timers = [];
  }

  M.pages.howweknow = {
    id: "howweknow", route: "how-we-know", title: "How we know", navLabel: "How we know", nav: true, navOrder: 7,

    render: function (root, ctx) {
      st = { timers: [], unsub: [], cards: {}, playing: false, io: null };
      var featured = (M.conflicts || []).filter(function (c) { return c.featured; });
      var minor = (M.conflicts || []).filter(function (c) { return !c.featured; });
      var jump = [["disagree", "Sources disagree"], ["checked", "Checked and confirmed"], ["wrong", "We got it wrong"], ["worked", "How we worked"]];

      var page = el("section", { class: "page hwk" }, el("div", { class: "wrap" },
        el("div", { class: "page-pad" },
          el("header", { class: "hwk-hero" },
            el("div", { class: "kicker" }, "Board 4"),
            el("h1", null, "How we know"),
            el("p", { class: "lede" }, "Oral history runs on memory, and memories disagree. So we checked what people told us against documents, photos and each other. Here is where they clash, where they line up, and where we got it wrong ourselves."),
            el("nav", { class: "hwk-jump", "aria-label": "Sections on this page" }, jump.map(function (j) {
              return el("button", { type: "button", class: "chip", on: { click: function () { scrollTo(document.getElementById("hwk-sec-" + j[0])); } } }, j[1]);
            }))),

          sectionHead("disagree", "A", "Sources disagree", "Each card is a question our sources answer differently. Read the accounts, decide who you believe, then flip the card."),
          el("div", { class: "hwk-legend" }, ["oral", "document", "web"].map(function (t) {
            return el("span", { style: { "--c": "var(--s-" + t + ")" } }, UI.icon(KIND_ICON[t]), KIND_LABEL[t] === "Web" ? "Website" : KIND_LABEL[t]);
          })),
          el("div", { class: "hwk-flips" }, featured.map(conflictCard)),
          minor.length ? el("div", { class: "hwk-minor" }, el("h3", { class: "hwk-minor-title" }, "Smaller disagreements"),
            el("div", { class: "hwk-flips hwk-flips--minor" }, minor.map(conflictCard))) : null,

          sectionHead("checked", "B", "Checked and confirmed", "Sometimes a memory and a document, made years apart by different people, say the same thing. That's as close to sure as we get."),
          el("div", { class: "hwk-chains" }, (M.verified || []).map(verifiedRow)),

          sectionHead("wrong", "C", "We got it wrong", "Historians correct themselves. Here is one of ours."),
          correction(M.correction),

          sectionHead("worked", "D", "How we worked"),
          howWeWorked())));

      root.appendChild(page);
      st.io = UI.reveal(page.querySelectorAll(".hwk-chain, .hwk-proof, .hwk-steps > li"), 60);

      var target = ctx.params[0];
      if (target) requestAnimationFrame(function () { if (st) focusCard(target, true); });
      if (ctx.query.autoplay === "1") later(startAutoplay, 600);
    },

    update: function (params, query) {
      if (params[0] && st.cards[params[0]]) {
        var c = st.cards[params[0]];
        if (!(c.flip && c.node.classList.contains("flipped"))) focusCard(params[0], true);
      }
      if (query.autoplay === "1") startAutoplay();
    },

    destroy: function () {
      if (!st) return;
      stopAutoplay();
      st.unsub.forEach(function (f) { f(); });
      if (st.io) st.io.disconnect();
      st = null;
    }
  };
})();
