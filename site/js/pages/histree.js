/* histree.js: HISTREE (#/histree), the trees that were moved here and took root. Owner: saharsh-claude (S8).
   Reads M.trees and M.treesExtra (owned by aakarsh-claude). Works with zero tree photos: a tree with photos: []
   shows a "photo coming" tile, so adding photos only needs edits to trees.js. */
(function () {
  "use strict";
  var M = window.M, U = M.util, UI = M.ui, el = UI.el, svg = UI.svg;
  var st = null;

  function photos(t, ratio) {
    var ids = (t.photos || []).filter(function (id) { return U.image(id); });
    if (!ids.length) return el("div", { class: "photo-tile ht-photo-coming" }, UI.icon("tree"), el("span", null, "Photo coming on 14 Nov"));
    return el("div", { class: "ht-photos" }, ids.map(function (id) { return UI.imageFigure(id, { gallery: ids, ratio: ratio || "4/3" }); }));
  }

  /* Navjeevan's moves: nodes joined by arrows that draw in one after another. */
  function movesDiagram(t) {
    var moves = t.moves || [], n = moves.length;
    if (n < 2) return null;
    var W = 720, H = 190, pad = 90, gap = (W - pad * 2) / (n - 1), y = 92;
    var s = svg("svg", { viewBox: "0 0 " + W + " " + H, class: "ht-moves", role: "img", "aria-label": t.name + " was moved: " + moves.map(function (m) { return m.label; }).join(", then ") + "." });
    s.appendChild(svg("defs", null, svg("marker", { id: "ht-arrow", viewBox: "0 0 10 10", refX: 8, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse" },
      svg("path", { d: "M0 0 L10 5 L0 10 z", fill: "var(--soil)" }))));
    for (var i = 0; i < n - 1; i++) {
      var x1 = pad + i * gap + 46, x2 = pad + (i + 1) * gap - 46;
      s.appendChild(svg("path", { class: "ht-move-path", d: "M" + x1 + " " + y + " Q" + ((x1 + x2) / 2) + " " + (y - 54) + " " + x2 + " " + y, "marker-end": "url(#ht-arrow)", style: "--d: " + (300 + i * 700) + "ms" }));
      s.appendChild(svg("text", { class: "ht-move-n", x: (x1 + x2) / 2, y: y - 40, "text-anchor": "middle" }, "Move " + (i + 1)));
    }
    moves.forEach(function (m, k) {
      var x = pad + k * gap, last = k === n - 1;
      var g = svg("g", { class: ["ht-node", last ? "ht-node--now" : ""].join(" "), style: "--d: " + (k * 700) + "ms" },
        svg("circle", { cx: x, cy: y, r: 40 }),
        svg("path", { d: "M" + x + " " + (y + 18) + " v-14 M" + (x - 20) + " " + (y - 2) + " q20 -34 40 0 q-20 10 -40 0 z", class: "ht-node-tree" }),
        svg("text", { x: x, y: y + 66, "text-anchor": "middle", class: "ht-node-lbl" }, m.label),
        last ? svg("text", { x: x, y: y + 86, "text-anchor": "middle", class: "ht-node-sub" }, "where it stands now") : null);
      s.appendChild(g);
    });
    return s;
  }

  function movesChips(t) {
    var moves = t.moves || [];
    if (!moves.length) return null;
    return el("ol", { class: "ht-path", "aria-label": "Where it has stood" }, moves.map(function (m) { return el("li", null, m.label); }));
  }

  function treeCard(t) {
    return el("article", { class: "ht-card", id: "ht-" + t.id },
      photos(t),
      el("div", { class: "ht-card-body" },
        el("div", { class: "kicker" }, t.kind),
        el("h3", null, t.name),
        el("p", null, t.story),
        movesChips(t),
        UI.sourceBadges(t.sources, { compact: true })));
  }

  M.pages.histree = {
    id: "histree", route: "histree", title: "HISTREE", navLabel: "HISTREE", nav: true, navOrder: 5,

    render: function (root) {
      st = { coin: null };
      var trees = M.trees || [], X = M.treesExtra || {};
      var nav = U.byId(trees, "navjeevan"), jag = U.byId(trees, "jagruthi");
      var others = trees.filter(function (t) { return t !== nav; });
      var art = el("div", { class: "ht-hero-art" });

      var page = el("section", { class: "page ht" }, el("div", { class: "wrap" }, el("div", { class: "page-pad" },
        el("header", { class: "ht-hero" },
          el("div", { class: "ht-hero-text" },
            el("div", { class: "kicker" }, "Board 3 / HISTREE"),
            el("h1", null, "Even the trees were moved here and took root"),
            el("p", { class: "lede" }, X.intro || ""),
            el("div", { class: "ht-hero-links" },
              el("a", { class: "btn btn--green", href: "#/map?layer=trees" }, UI.icon("pin"), "See the trees on the map"),
              el("a", { class: "btn btn--ghost", href: U.href("voices", "P-SLN") }, "SLN Shastry's interview")),
            X.sources ? UI.sourceBadges(X.sources, { compact: true }) : null),
          art),

        nav ? el("section", { class: "ht-feature" },
          el("div", { class: "ht-feature-text" },
            el("div", { class: "kicker" }, "Transplanted three times, says SLN Shastry"),
            el("h2", null, nav.name),
            el("p", { class: "ht-feature-story" }, nav.story),
            UI.sourceBadges(nav.sources, { compact: true })),
          el("div", { class: "ht-feature-vis" }, movesDiagram(nav), photos(nav, "16/10"))) : null,

        jag ? el("section", { class: "ht-echo" },
          el("div", { class: "ht-echo-side" }, el("span", { class: "mono" }, "The tree"), el("b", null, "Jagruthi"), el("span", null, "One of the four banyans SLN Shastry saved from the road widening.")),
          el("div", { class: "ht-echo-mid", "aria-hidden": "true" }, "="),
          el("div", { class: "ht-echo-side" }, el("span", { class: "mono" }, "The mascot"), el("b", null, "Jagruti"), el("span", null, "IIIT's mascot, the banyan tree, as Wikipedia lists it.")),
          el("p", { class: "ht-echo-note" }, "Same name, one letter apart. We don't know yet if the tree was named after the mascot or the other way round."),
          UI.sourceBadges(["S-SLN", "S-WIKI-OLD"], { compact: true })) : null,

        el("h2", { class: "ht-sub" }, "The other trees"),
        el("div", { class: "ht-grid" }, others.map(treeCard)),

        (X.images || []).length ? el("section", { class: "ht-related" },
          el("h2", { class: "ht-sub" }, "Banyans in our photos"),
          el("div", { class: "ht-related-grid" }, X.images.filter(function (id) { return U.image(id); }).map(function (id) { return UI.imageFigure(id, { gallery: X.images, ratio: "16/10" }); }))) : null)));
      root.appendChild(page);

      if (M.coin && M.coin.create) {
        try { st.coin = M.coin.create(art, { size: "min(22rem, 70vw)", caption: false, hint: false }); } catch (e) { st.coin = null; }
      }
      if (!st.coin) art.appendChild(el("img", { src: "assets/img/banyan-color.png", alt: "", class: "ht-hero-img" }));
      st.io = UI.reveal(page.querySelectorAll(".ht-card, .ht-echo"), 70);
      if (!U.prefersReducedMotion()) requestAnimationFrame(function () { var v = page.querySelector(".ht-feature-vis"); if (v) v.classList.add("go"); });
      else { var v = page.querySelector(".ht-feature-vis"); if (v) v.classList.add("go", "still"); }
    },

    destroy: function () {
      if (!st) return;
      if (st.coin && st.coin.destroy) st.coin.destroy();
      if (st.io) st.io.disconnect();
      st = null;
    }
  };
})();
