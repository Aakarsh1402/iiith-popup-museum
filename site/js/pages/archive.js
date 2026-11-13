/* archive.js: the Archive (#/archive), document viewer (#/archive/<docId>/<page>) and photo archive (#/archive/photos[/<group>]).
   Owner: saharsh-claude (S7). Data: M.documents, M.images, M.people.
   Viewer: drag/wheel/pinch zoom (M.ui.zoomPan), page strip, page notes, Left/Right for pages, +/- to zoom, R to turn the page. */
(function () {
  "use strict";
  var M = window.M, U = M.util, UI = M.ui, el = UI.el;
  var GROUP_NOTE = { satellite: "Google Earth screenshots. Only photo 32 shows a date (14 March 2018).", civilraw: "Our own photos from the visit on 28 Oct 2026. We haven't captioned these yet.", early: "Stills from IIIT's 20-year video." };
  var st = null;

  function docs() { return M.documents || []; }
  function groups() {
    var out = [], seen = {};
    (M.images || []).forEach(function (im) {
      if (!seen[im.group]) { seen[im.group] = { id: im.group, label: im.section || im.group, ids: [] }; out.push(seen[im.group]); }
      seen[im.group].ids.push(im.id);
    });
    return out;
  }
  function backLink() { return el("a", { class: "btn btn--ghost arc-back", href: U.href("archive") }, UI.icon("arrow-left"), "Archive"); }

  /* ---------- index ---------- */
  function tile(o) {
    return el("a", { class: "arc-tile", href: o.href },
      el("span", { class: ["arc-tile-cover", o.mosaic ? "arc-tile-cover--mosaic" : ""] }, o.mosaic ? o.mosaic.map(function (src) { return el("img", { src: src, alt: "", loading: "lazy" }); }) : el("img", { src: o.cover, alt: "", loading: "lazy" })),
      el("span", { class: "arc-tile-body" },
        el("span", { class: "arc-tile-meta mono" }, o.meta),
        el("span", { class: "arc-tile-title" }, o.title),
        el("span", { class: "arc-tile-desc" }, o.desc)));
  }
  function renderIndex(root) {
    var imgs = M.images || [], people = M.people || [];
    var tiles = docs().map(function (d) {
      return tile({ href: U.href("archive", d.id, 1), cover: d.cover, title: d.title, desc: d.desc, meta: d.date + " / " + d.pages.length + (d.pages.length === 1 ? " page" : " pages") });
    });
    tiles.push(tile({ href: U.href("archive", "photos"), mosaic: ["img-04", "img-19", "img-37", "img-42"].map(function (id) { return (U.image(id) || {}).thumb; }).filter(Boolean),
      title: "Photo archive", desc: "Old stills, satellite views, the guest house, Saranga Hall and the empty civil department.", meta: imgs.length + " photos / " + groups().length + " groups" }));
    tiles.push(tile({ href: U.href("voices"), mosaic: null, cover: "assets/docs/ping/thumb/p-02.jpg", title: "Interviews", desc: "The written-up interviews with the " + people.length + " people who told us their IIIT. Each one is searchable.", meta: people.length + " interviews / 2026" }));
    var cur = U.byId(docs(), "curriculum"), pros = U.byId(docs(), "prospectus");
    var hl = pros && pros.highlights && pros.highlights[0];
    root.appendChild(el("section", { class: "page arc" }, el("div", { class: "wrap" }, el("div", { class: "page-pad" },
      el("header", { class: "arc-hero" },
        el("div", { class: "kicker" }, "Board 4 / Archive"),
        el("h1", null, "The archive"),
        el("p", { class: "lede" }, "Everything we found. Open a document to read it and zoom in.")),
      el("aside", { class: "arc-contribute" },
        el("span", { class: "arc-contribute-icon" }, UI.icon("plus")),
        el("div", null,
          el("h2", null, "This archive should outlive our exhibit"),
          el("p", null, "We plan to put these files on Wikimedia Commons and the Internet Archive. Have an old photo or document of IIIT? Tell one of us."))),
      el("div", { class: "arc-grid" }, tiles),
      hl && cur ? el("section", { class: "arc-feature" },
        el("div", { class: "arc-feature-text" },
          el("div", { class: "kicker" }, "From the prospectus, c.2001"),
          el("h2", null, hl.title),
          el("p", null, hl.text),
          el("div", { class: "arc-feature-links" },
            el("a", { class: "btn btn--green", href: U.href("archive", "prospectus", hl.pages[0]) }, "Read pages " + hl.pages[0] + " to " + hl.pages[hl.pages.length - 1], UI.icon("arrow-right")),
            el("a", { class: "btn btn--ghost", href: U.href("archive", "curriculum", 1) }, "See our highlights")),
          UI.sourceBadges(hl.sources, { compact: true })),
        el("div", { class: "arc-feature-imgs" }, cur.pages.map(function (pg) {
          return el("a", { href: U.href("archive", "curriculum", pg.n), class: "arc-feature-img" }, el("img", { src: pg.thumb, alt: pg.note, loading: "lazy" }));
        }))) : null))));
  }

  /* ---------- photo archive ---------- */
  function renderPhotos(root, groupId) {
    var gs = groups(), active = groupId && gs.some(function (g) { return g.id === groupId; }) ? groupId : "all";
    st.group = active;
    var list = el("div", { class: "arc-photo-groups" });
    function draw() {
      list.textContent = "";
      gs.filter(function (g) { return active === "all" || g.id === active; }).forEach(function (g) {
        list.appendChild(el("section", { class: "arc-photo-group", id: "arc-g-" + g.id },
          el("header", null, el("h2", null, g.label), el("span", { class: "mono small muted" }, g.ids.length + (g.ids.length === 1 ? " photo" : " photos")),
            GROUP_NOTE[g.id] ? el("p", { class: "muted small" }, GROUP_NOTE[g.id]) : null),
          el("div", { class: "arc-photo-grid" }, g.ids.map(function (id) { return UI.imageFigure(id, { gallery: g.ids, ratio: "4/3" }); }))));
      });
    }
    var chips = UI.chips([{ id: "all", label: "All photos" }].concat(gs.map(function (g) { return { id: g.id, label: g.label.replace(/:.*$/, "").replace(/ \(.*\)$/, "") }; })), active, function (id) {
      active = id; st.group = id; chips.setActive(id); draw();
      M.router.replace(id === "all" ? U.href("archive", "photos") : U.href("archive", "photos", id));
    });
    draw();
    root.appendChild(el("section", { class: "page arc" }, el("div", { class: "wrap" }, el("div", { class: "page-pad" },
      backLink(),
      el("header", { class: "arc-hero arc-hero--small" },
        el("div", { class: "kicker" }, "Archive"),
        el("h1", null, "Photo archive"),
        el("p", { class: "lede" }, (M.images || []).length + " photos. The captions are ours. Click a photo to see it full size."),
        UI.sourceBadges(["S-PHOTOS", "S-CIVILRAW"], { compact: true })),
      chips, list))));
  }

  /* ---------- document viewer ---------- */
  function renderViewer(root, d, n) {
    st.doc = d;
    st.turn = 0;
    var count = el("span", { class: "arc-count mono" });
    var prev = el("button", { class: "icon-btn", type: "button", "aria-label": "Previous page", on: { click: function () { go(st.page - 1); } } }, UI.icon("chevron-left"));
    var next = el("button", { class: "icon-btn", type: "button", "aria-label": "Next page", on: { click: function () { go(st.page + 1); } } }, UI.icon("chevron-right"));
    st.host = el("div", { class: "arc-stage-host" });
    var stage = el("div", { class: "arc-stage" }, st.host,
      el("div", { class: "zp-controls" },
        el("button", { class: "icon-btn", type: "button", "aria-label": "Zoom in", on: { click: function () { if (st.zp) st.zp.zoomBy(1.5); } } }, UI.icon("plus")),
        el("button", { class: "icon-btn", type: "button", "aria-label": "Zoom out", on: { click: function () { if (st.zp) st.zp.zoomBy(1 / 1.5); } } }, UI.icon("minus")),
        el("button", { class: "icon-btn", type: "button", "aria-label": "Fit the page", on: { click: function () { if (st.zp) st.zp.fit(true); } } }, UI.icon("fit")),
        el("button", { class: "icon-btn", type: "button", "aria-label": "Turn the page", on: { click: function () { turn(); } } }, UI.icon("flip"))),
      el("span", { class: "arc-stage-hint mono" }, "Drag to move. Scroll or pinch to zoom."));
    st.side = el("aside", { class: "arc-side" });
    st.strip = el("ol", { class: "arc-strip", "aria-label": "Pages" }, d.pages.map(function (pg) {
      return el("li", null, el("a", { href: U.href("archive", d.id, pg.n), class: "arc-thumb", "aria-label": "Page " + pg.n, dataset: { n: String(pg.n) },
        on: { click: function (e) { e.preventDefault(); go(pg.n); } } },
        el("img", { src: pg.thumb, alt: "", loading: "lazy" }), el("span", { class: "mono" }, String(pg.n))));
    }));
    st.count = count; st.prevBtn = prev; st.nextBtn = next;
    root.appendChild(el("section", { class: "page arc arc--viewer" },
      el("div", { class: "arc-bar" },
        backLink(),
        el("div", { class: "arc-bar-title" }, el("b", null, d.title), el("span", { class: "mono small muted" }, d.date)),
        el("div", { class: "arc-bar-nav" }, prev, count, next)),
      el("div", { class: "arc-body" }, stage, st.side),
      st.strip));
    show(n, true);
  }

  function go(n) {
    if (!st.doc) return;
    n = U.clamp(n, 1, st.doc.pages.length);
    if (n === st.page) return;
    show(n);
    M.router.replace(U.href("archive", st.doc.id, n));
  }
  function turn() { st.turn = (st.turn + 90) % 360; loadImage(curPage()); }
  function curPage() { return st.doc.pages[st.page - 1]; }

  function loadImage(pg) {
    if (st.zp) { st.zp.destroy(); st.zp = null; }
    st.host.textContent = "";
    var token = {}; st.loadToken = token;
    var spinner = el("div", { class: "arc-loading mono" }, "Loading page " + pg.n + "...");
    st.host.appendChild(spinner);
    var img = new Image();
    img.alt = st.doc.title + ", page " + pg.n;
    img.draggable = false;
    img.onload = function () {
      if (!st || st.loadToken !== token) return;
      var W = img.naturalWidth, H = img.naturalHeight, rot = ((pg.rot || 0) + st.turn) % 360, side = rot % 180 !== 0;
      var cw = side ? H : W, ch = side ? W : H;
      var content = el("div", { class: "arc-content", style: { width: cw + "px", height: ch + "px" } });
      var tr = { 0: "none", 90: "translate(" + H + "px,0) rotate(90deg)", 180: "translate(" + W + "px," + H + "px) rotate(180deg)", 270: "translate(0," + W + "px) rotate(270deg)" }[rot];
      img.style.cssText = "position:absolute;left:0;top:0;width:" + W + "px;height:" + H + "px;max-width:none;transform-origin:0 0;transform:" + tr;
      content.appendChild(img);
      st.host.textContent = "";
      st.zp = UI.zoomPan(st.host, content, { contentW: cw, contentH: ch, maxScale: 6, padding: 16 });
    };
    img.onerror = function () { if (st && st.loadToken === token) spinner.textContent = "This page image is missing."; };
    img.src = pg.file;
  }

  function show(n, first) {
    var d = st.doc;
    n = U.clamp(n || 1, 1, d.pages.length);
    st.page = n;
    var pg = curPage();
    loadImage(pg);
    st.count.textContent = "Page " + n + " of " + d.pages.length;
    st.prevBtn.disabled = n <= 1; st.nextBtn.disabled = n >= d.pages.length;
    Array.prototype.forEach.call(st.strip.querySelectorAll(".arc-thumb"), function (a) {
      var on = +a.dataset.n === n;
      if (on) { a.setAttribute("aria-current", "page"); a.scrollIntoView({ block: "nearest", inline: "center", behavior: first || U.prefersReducedMotion() ? "instant" : "smooth" }); }
      else a.removeAttribute("aria-current");
    });
    var hls = (d.highlights || []).filter(function (h) { return h.pages.indexOf(n) >= 0; });
    var extras = (d.extras || []).filter(function (x) { return x.page === n; });
    st.side.textContent = "";
    st.side.appendChild(el("div", { class: "arc-note" },
      el("div", { class: "kicker" }, "Page " + n),
      el("p", null, pg.note || "No note for this page yet."),
      pg.rot ? el("p", { class: "mono small muted" }, "This scan is sideways, so we turned it to read the labels. Use the turn button to see it as scanned.") : null));
    hls.forEach(function (h) {
      st.side.appendChild(el("div", { class: "callout arc-hl" }, el("h3", null, h.title), el("p", null, h.text), UI.sourceBadges(h.sources, { compact: true })));
    });
    if (extras.length) st.side.appendChild(el("div", { class: "arc-extras" },
      el("h3", null, "Photos printed on this page"),
      el("div", { class: "arc-extras-grid" }, extras.map(function (x) {
        return el("button", { type: "button", class: "arc-extra", "aria-label": "Open photo: " + x.caption,
          on: { click: function () { UI.modal(el("figure", { class: "arc-extra-big" }, el("img", { src: x.file, alt: x.caption }), el("figcaption", null, x.caption)), { title: d.title + ", page " + x.page }); } } },
          el("img", { src: x.file, alt: "", loading: "lazy" }));
      }))));
    st.side.appendChild(el("div", { class: "arc-about" },
      el("h3", null, "About this document"),
      el("p", null, d.about),
      UI.sourceBadges(d.sources || [d.sourceId]),
      M.kiosk && M.kiosk.screen() ? null : el("a", { class: "arc-full", href: pg.file, target: "_blank", rel: "noopener" }, UI.icon("expand"), "Open the page image on its own")));
  }

  function onKey(e) {
    if (!st || !st.doc || e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target && e.target.tagName;
    if (t === "INPUT" || t === "TEXTAREA" || document.querySelector(".lightbox, .overlay")) return;
    if (e.key === "ArrowLeft") { e.preventDefault(); go(st.page - 1); }
    else if (e.key === "ArrowRight") { e.preventDefault(); go(st.page + 1); }
    else if ((e.key === "+" || e.key === "=") && st.zp) st.zp.zoomBy(1.4);
    else if (e.key === "-" && st.zp) st.zp.zoomBy(1 / 1.4);
    else if (e.key === "r" || e.key === "R") turn();
  }

  function draw(params) {
    if (st.zp) { st.zp.destroy(); st.zp = null; }
    st.doc = null; st.page = 0;
    st.root.textContent = "";
    var id = params[0];
    if (id === "photos") renderPhotos(st.root, params[1]);
    else if (id && U.byId(docs(), id)) renderViewer(st.root, U.byId(docs(), id), parseInt(params[1], 10) || 1);
    else renderIndex(st.root);
  }

  M.pages.archive = {
    id: "archive", route: "archive", title: "Archive", navLabel: "Archive", nav: true, navOrder: 8,
    render: function (root, ctx) {
      st = { root: root, zp: null, doc: null, page: 0, turn: 0, key: (ctx.params[0] || "") };
      document.addEventListener("keydown", onKey);
      draw(ctx.params);
    },
    update: function (params) {
      if (st.doc && params[0] === st.doc.id) { var n = parseInt(params[1], 10) || 1; if (n !== st.page) show(n); return; }
      if (params[0] === "photos" && st.key === "photos" && (params[1] || "all") === st.group) return; /* our own chip change */
      st.key = params[0] || "";
      draw(params);
      window.scrollTo(0, 0);
    },
    destroy: function () {
      if (!st) return;
      if (st.zp) st.zp.destroy();
      document.removeEventListener("keydown", onKey);
      st = null;
    }
  };
})();
