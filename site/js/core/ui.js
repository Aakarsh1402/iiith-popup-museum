/* ui.js: shared DOM builders and widgets on M.ui. Owner: aakarsh-claude (A2).
   Never use innerHTML for data strings: el() sets text with textContent. Documented in js/core/README.md. */
(function () {
  "use strict";
  var M = (window.M = window.M || {});
  var U = M.util;
  var UI = (M.ui = M.ui || {});
  var SVGNS = "http://www.w3.org/2000/svg";

  function append(node, kids) {
    kids.forEach(function (c) {
      if (c == null || c === false) return;
      if (Array.isArray(c)) return append(node, c);
      node.appendChild(c instanceof Node ? c : document.createTextNode(String(c)));
    });
  }
  function setAttrs(node, attrs, isSvg) {
    Object.keys(attrs || {}).forEach(function (k) {
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k === "class") node.setAttribute("class", Array.isArray(v) ? v.filter(Boolean).join(" ") : v);
      else if (k === "text") node.textContent = v;
      else if (k === "html") node.innerHTML = v; /* only for trusted, hand-written markup */
      else if (k === "style" && typeof v === "object") Object.keys(v).forEach(function (s) { if (s.indexOf("--") === 0) node.style.setProperty(s, v[s]); else node.style[s] = v[s]; });
      else if (k === "on") Object.keys(v).forEach(function (ev) { node.addEventListener(ev, v[ev]); });
      else if (k === "dataset") Object.keys(v).forEach(function (d) { node.dataset[d] = v[d]; });
      else if (!isSvg && (k in node) && typeof v !== "string" && k !== "list") node[k] = v;
      else node.setAttribute(k, v === true ? "" : v);
    });
  }

  /** el("div", {class: "x", on: {click: fn}}, "text", childNode, [more]) */
  UI.el = function (tag, attrs) {
    var node = document.createElement(tag);
    setAttrs(node, attrs, false);
    append(node, Array.prototype.slice.call(arguments, 2));
    return node;
  };
  UI.svg = function (tag, attrs) {
    var node = document.createElementNS(SVGNS, tag);
    setAttrs(node, attrs, true);
    append(node, Array.prototype.slice.call(arguments, 2));
    return node;
  };
  var el = UI.el;

  /* ---------- icons (inline SVG, stroke style) ---------- */
  var ICONS = {
    "chevron-left": "M15 18l-6-6 6-6", "chevron-right": "M9 18l6-6-6-6", "chevron-down": "M6 9l6 6 6-6", "chevron-up": "M18 15l-6-6-6 6",
    "arrow-right": "M5 12h14M13 6l6 6-6 6", "arrow-left": "M19 12H5M11 6l-6 6 6 6",
    close: "M6 6l12 12M18 6L6 18", plus: "M12 5v14M5 12h14", minus: "M5 12h14",
    search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4",
    play: "M7 5l12 7-12 7z", pause: "M8 5v14M16 5v14",
    pin: "M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21zM12 7.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4z",
    home: "M4 11l8-7 8 7M6 9.5V20h12V9.5",
    mic: "M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3",
    doc: "M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6",
    photo: "M4 6h16v13H4zM4 16l5-5 4 4 3-3 4 4M15.5 9.5h.01",
    globe: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18",
    layers: "M12 3l9 5-9 5-9-5zM3 13l9 5 9-5",
    tree: "M12 21v-7M12 14c-4 0-7-2.5-7-6a5 5 0 0 1 4-4.9A4 4 0 0 1 15 3a5 5 0 0 1 4 5c0 3.5-3 6-7 6zM9 21h6",
    book: "M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5",
    expand: "M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5",
    fit: "M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5M9 9h6v6H9z",
    menu: "M4 7h16M4 12h16M4 17h16",
    link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
    flip: "M4 9h13l-3-3M20 15H7l3 3",
    check: "M5 12.5l4.5 4.5L19 7",
    quote: "M7 7h4v4c0 3-1.5 5-4 6M14 7h4v4c0 3-1.5 5-4 6",
    filter: "M4 5h16l-6 8v6l-4-2v-4z",
    clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2",
    alert: "M12 3l10 18H2zM12 10v5M12 18h.01"
  };
  UI.icon = function (name, cls) {
    var s = UI.svg("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true", class: cls || null });
    s.appendChild(UI.svg("path", { d: ICONS[name] || ICONS.close }));
    if (name === "play") s.firstChild.setAttribute("fill", "currentColor");
    return s;
  };

  /* ---------- categories ---------- */
  UI.CATEGORIES = [
    { id: "buildings", label: "Buildings", color: "var(--c-buildings)" },
    { id: "operations", label: "Operations", color: "var(--c-operations)" },
    { id: "people", label: "People", color: "var(--c-people)" },
    { id: "trees", label: "Trees", color: "var(--c-trees)" },
    { id: "land", label: "Land", color: "var(--c-land)" },
    { id: "curriculum", label: "Curriculum", color: "var(--c-curriculum)" }
  ];
  UI.category = function (id) { return UI.CATEGORIES.filter(function (c) { return c.id === id; })[0] || { id: id, label: id, color: "var(--ink-3)" }; };

  /* ---------- popover ---------- */
  var openPop = null;
  UI.closePopover = function () { if (openPop) { openPop.remove(); openPop = null; } };
  UI.popover = function (anchor, content) {
    UI.closePopover();
    var pop = el("div", { class: "popover", role: "dialog" }, content);
    document.body.appendChild(pop);
    var r = anchor.getBoundingClientRect(), pw = pop.offsetWidth, ph = pop.offsetHeight;
    var left = U.clamp(r.left, 12, window.innerWidth - pw - 12);
    var top = r.bottom + 8; if (top + ph > window.innerHeight - 12) top = Math.max(12, r.top - ph - 8);
    pop.style.left = left + "px"; pop.style.top = top + "px";
    openPop = pop;
    setTimeout(function () {
      function off(ev) { if (!pop.contains(ev.target)) { UI.closePopover(); document.removeEventListener("pointerdown", off, true); } }
      document.addEventListener("pointerdown", off, true);
    }, 0);
    return pop;
  };
  window.addEventListener("hashchange", function () { UI.closePopover(); });

  /* ---------- sources ---------- */
  var TYPE_ICON = { oral: "mic", document: "doc", photo: "photo", web: "globe" };
  var TYPE_LABEL = { oral: "Interview", document: "Document", photo: "Photo", web: "Web source" };

  function sourceDetail(id) {
    var s = U.source(id) || { type: "web", short: id };
    var kids = [el("div", { class: "kicker" }, TYPE_LABEL[s.type] || "Source"), el("h4", null, s.short || id)];
    if (s.note) kids.push(el("p", null, s.note));
    if (s.date) kids.push(el("p", { class: "small mono" }, s.date));
    var link = null;
    if (s.type === "oral" && s.personId) link = el("a", { class: "btn btn--ghost", href: U.href("voices", s.personId) }, "Read the interview", UI.icon("arrow-right"));
    else if (s.type === "document" && s.docId) link = el("a", { class: "btn btn--ghost", href: U.href("archive", s.docId) }, "Open in the archive", UI.icon("arrow-right"));
    else if (s.type === "photo") link = el("a", { class: "btn btn--ghost", href: U.href("archive", "photos") }, "See the photo archive", UI.icon("arrow-right"));
    if (s.url) kids.push(el("p", { class: "url" }, s.url));
    if (link) { link.addEventListener("click", UI.closePopover); kids.push(link); }
    kids.push(el("p", { class: "small mono", style: { marginTop: ".6rem", color: "var(--ink-3)" } }, "Source ID: " + id));
    return kids;
  }

  /** Row of clickable source badges. */
  UI.sourceBadges = function (ids, opts) {
    opts = opts || {};
    var wrap = el("div", { class: "badges" });
    (ids || []).forEach(function (id) {
      var s = U.source(id) || { type: "web", short: id };
      var b = el("button", { class: "badge badge--" + s.type, type: "button", title: s.short, on: { click: function (ev) { ev.stopPropagation(); UI.popover(b, sourceDetail(id)); } } },
        UI.icon(TYPE_ICON[s.type] || "doc"), opts.compact ? (s.tiny || s.short) : s.short);
      wrap.appendChild(b);
    });
    return wrap;
  };

  /** Plain one-line source note: "Source: Interview with Mr. Gopi (2026); ..." */
  UI.sourceLine = function (ids) {
    var names = U.sourcesFor(ids).map(function (s) { return s.short; });
    return el("p", { class: "source-line" }, el("b", null, names.length > 1 ? "Sources: " : "Source: "), names.join("; ") || "TODO");
  };

  /* ---------- confidence ---------- */
  var CONF = { corroborated: "Corroborated", single: "One source", contested: "Sources disagree", todo: "To check" };
  UI.confidenceTag = function (level, conflictId) {
    var label = CONF[level] || level;
    if (level === "contested" && conflictId) {
      return el("a", { class: "stamp stamp--contested", href: U.href("how-we-know", conflictId), title: "See how the sources disagree" }, UI.icon("alert"), label);
    }
    return el("span", { class: "stamp stamp--" + level }, level === "corroborated" ? UI.icon("check") : null, label);
  };
  UI.stamp = function (text, kind, big) { return el("span", { class: ["stamp", "stamp--" + (kind || "single"), big ? "stamp--big" : ""] }, text); };

  /* ---------- chips ---------- */
  /** options: [{id, label, color}], active: id or [ids]; onChange(id) */
  UI.chips = function (options, active, onChange) {
    var wrap = el("div", { class: "chips", role: "group" });
    function isOn(id) { return Array.isArray(active) ? active.indexOf(id) >= 0 : active === id; }
    options.forEach(function (o) {
      var b = el("button", { class: "chip", type: "button", "aria-pressed": String(isOn(o.id)), style: { "--c": o.color || "var(--ink)" }, on: { click: function () { onChange(o.id); } } },
        o.color ? el("span", { class: "dot" }) : null, o.label);
      b.dataset.id = o.id;
      wrap.appendChild(b);
    });
    wrap.setActive = function (a) { active = a; Array.prototype.forEach.call(wrap.children, function (b) { b.setAttribute("aria-pressed", String(isOn(b.dataset.id))); }); };
    return wrap;
  };

  /* ---------- card ---------- */
  UI.card = function (o) {
    var tag = o.href ? "a" : (o.onClick ? "button" : "div");
    var c = el(tag, { class: ["card", (o.href || o.onClick) ? "clickable" : "", o.className], href: o.href || null, type: tag === "button" ? "button" : null, on: o.onClick ? { click: o.onClick } : null },
      o.image ? el("div", { class: "card-img" }, el("img", { src: (U.image(o.image) || {}).thumb || o.image, alt: "", loading: "lazy" })) : null,
      el("div", { class: "card-body" },
        o.kicker ? el("div", { class: "kicker" }, o.kicker) : null,
        o.title ? el("h3", null, o.title) : null,
        o.body ? el("p", null, o.body) : null,
        o.footer || null));
    return c;
  };

  /* ---------- avatar ---------- */
  UI.avatar = function (person, size) {
    var a = el("span", { class: "avatar", style: { "--s": size || "3rem" }, "aria-hidden": "true" });
    var img = person && person.photo && U.image(person.photo);
    if (img) a.appendChild(el("img", { src: img.thumb, alt: "" }));
    else a.textContent = (person && person.initials) || "?";
    return a;
  };

  /* ---------- figure + lightbox ---------- */
  /** opts: {size: "thumb"|"full", caption: true, gallery: [imgIds], ratio: "4/3", className} */
  UI.imageFigure = function (imgId, opts) {
    opts = opts || {};
    var im = U.image(imgId);
    if (!im) return el("div", { class: "photo-tile" }, opts.missing || "Photo coming");
    var gallery = opts.gallery || [imgId];
    var btn = el("button", { class: "fig-btn", type: "button", "aria-label": "Open photo: " + im.caption, style: opts.ratio ? { aspectRatio: opts.ratio } : null,
      on: { click: function (ev) { ev.stopPropagation(); UI.lightbox(gallery, Math.max(0, gallery.indexOf(imgId))); } } },
      el("img", { src: opts.size === "full" ? im.file : im.thumb, alt: im.caption, loading: "lazy", draggable: "false" }));
    return el("figure", { class: ["fig", opts.className] }, btn,
      opts.caption === false ? null : el("figcaption", null, opts.captionText || im.caption, el("span", { class: "credit" }, "Photo " + (im.n < 100 ? im.n : im.id.replace("img-", "")) + ", team photo archive")));
  };

  UI.lightbox = function (imgIds, start) {
    var ids = (imgIds || []).filter(function (id) { return U.image(id); });
    if (!ids.length) return;
    var i = U.clamp(start || 0, 0, ids.length - 1);
    var stage = el("div", { class: "lb-stage" });
    var count = el("span", { class: "count" });
    var cap = el("div", { class: "lb-cap" });
    var prev = el("button", { class: "icon-btn lb-nav prev", "aria-label": "Previous photo", on: { click: function () { go(i - 1); } } }, UI.icon("chevron-left"));
    var next = el("button", { class: "icon-btn lb-nav next", "aria-label": "Next photo", on: { click: function () { go(i + 1); } } }, UI.icon("chevron-right"));
    var box = el("div", { class: "lightbox", role: "dialog", "aria-modal": "true", "aria-label": "Photo viewer" },
      el("div", { class: "lb-top" }, count, el("span", { class: "mono small", style: { opacity: .6 } }, "Scroll or pinch to zoom, drag to move"),
        el("button", { class: "icon-btn", "aria-label": "Close", on: { click: close } }, UI.icon("close"))),
      stage, cap);
    stage.appendChild(prev); stage.appendChild(next);
    var zp = null;
    function go(n) {
      i = (n + ids.length) % ids.length;
      var im = U.image(ids[i]);
      if (zp) zp.destroy();
      Array.prototype.slice.call(stage.querySelectorAll(".zp")).forEach(function (n) { n.remove(); });
      var img = el("img", { src: im.file, alt: im.caption, draggable: "false" });
      var host = el("div", { class: "zp", style: { position: "absolute", inset: "0" } });
      stage.insertBefore(host, prev);
      var w = im.w || 1600, h = im.h || 1200;
      img.style.position = "static"; img.style.maxWidth = "none"; img.style.maxHeight = "none"; img.style.transform = "none";
      img.style.width = w + "px"; img.style.height = h + "px";
      zp = UI.zoomPan(host, img, { contentW: w, contentH: h, maxScale: 6, padding: 24 });
      count.textContent = (i + 1) + " / " + ids.length;
      cap.textContent = "";
      cap.appendChild(document.createTextNode(im.caption));
      cap.appendChild(el("span", { class: "credit" }, "Photo " + (im.n < 100 ? im.n : im.id.replace("img-", "")) + ". " + (im.section || "")));
      prev.hidden = next.hidden = ids.length < 2;
    }
    function key(e) {
      if (e.key === "Escape") { e.stopPropagation(); close(); }
      else if (e.key === "ArrowLeft") go(i - 1);
      else if (e.key === "ArrowRight") go(i + 1);
    }
    function close() {
      document.removeEventListener("keydown", key, true);
      box.classList.add("closing");
      setTimeout(function () { if (zp) zp.destroy(); box.remove(); }, 170);
      UI._lightbox = null;
    }
    document.addEventListener("keydown", key, true);
    document.body.appendChild(box);
    go(i);
    UI._lightbox = { close: close };
    return UI._lightbox;
  };

  /* ---------- modal ---------- */
  UI.modal = function (content, opts) {
    opts = opts || {};
    var overlay, prevFocus = document.activeElement;
    function close() {
      document.removeEventListener("keydown", key, true);
      overlay.classList.add("closing");
      setTimeout(function () { overlay.remove(); if (prevFocus && prevFocus.focus) prevFocus.focus(); }, 170);
      opts.onClose && opts.onClose();
      UI._modal = null;
    }
    function key(e) { if (e.key === "Escape") { e.stopPropagation(); close(); } }
    var box = el("div", { class: "modal", role: "dialog", "aria-modal": "true", "aria-label": opts.title || "Dialog" },
      el("button", { class: "icon-btn modal-close", "aria-label": "Close", on: { click: close } }, UI.icon("close")),
      opts.title ? el("h2", null, opts.title) : null, content);
    overlay = el("div", { class: "overlay", on: { click: function (e) { if (e.target === overlay) close(); } } }, box);
    document.getElementById("modal-root").appendChild(overlay);
    document.addEventListener("keydown", key, true);
    box.querySelector(".modal-close").focus();
    UI._modal = { close: close, el: box };
    return UI._modal;
  };

  /* ---------- side sheet ---------- */
  /** One sheet at a time. UI.sheet({onClose, bar: [nodes]}) -> {el, body, setContent(node), open(), close(), isOpen()} */
  UI.sheet = function (opts) {
    opts = opts || {};
    var body = el("div", { class: "sheet-body" });
    var barExtra = el("div", { class: "grow", style: { display: "flex", gap: ".5rem", alignItems: "center" } });
    var s = el("aside", { class: "sheet", "aria-hidden": "true" },
      el("div", { class: "sheet-bar" }, barExtra,
        el("button", { class: "icon-btn", "aria-label": "Close panel", on: { click: function () { api.close(); } } }, UI.icon("close"))),
      body);
    (opts.root || document.body).appendChild(s);
    var api = {
      el: s, body: body, bar: barExtra,
      setContent: function (node) { body.textContent = ""; body.scrollTop = 0; append(body, [node]); },
      setBar: function (nodes) { barExtra.textContent = ""; append(barExtra, [nodes]); },
      open: function () { s.classList.add("open"); s.setAttribute("aria-hidden", "false"); UI._sheet = api; },
      close: function (silent) { if (!s.classList.contains("open")) return; s.classList.remove("open"); s.setAttribute("aria-hidden", "true"); if (UI._sheet === api) UI._sheet = null; if (!silent && opts.onClose) opts.onClose(); },
      isOpen: function () { return s.classList.contains("open"); },
      destroy: function () { s.remove(); if (UI._sheet === api) UI._sheet = null; }
    };
    return api;
  };

  /** Close whatever overlay is on top (used by Esc and the kiosk idle reset). Returns true if something closed. */
  UI.closeTop = function () {
    if (UI._lightbox) { UI._lightbox.close(); return true; }
    if (UI._modal) { UI._modal.close(); return true; }
    if (document.querySelector(".popover")) { UI.closePopover(); return true; }
    if (UI._sheet) { UI._sheet.close(); return true; }
    return false;
  };

  /* ---------- toast ---------- */
  UI.toast = function (msg, ms) {
    var t = el("div", { class: "toast", role: "status" }, msg);
    document.getElementById("toast-root").appendChild(t);
    setTimeout(function () { t.style.transition = "opacity .3s"; t.style.opacity = "0"; setTimeout(function () { t.remove(); }, 320); }, ms || 2600);
  };

  /* ---------- reveal on scroll ---------- */
  /** Adds .reveal to nodes and fades them in when they enter the viewport. stagger in ms. */
  UI.reveal = function (nodes, stagger) {
    nodes = Array.prototype.slice.call(nodes || []);
    if (U.prefersReducedMotion() || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    nodes.forEach(function (n, k) { n.classList.add("reveal"); n.style.setProperty("--d", ((stagger || 0) * (k % 8)) + "ms"); io.observe(n); });
    return io;
  };

  /* ---------- zoom / pan surface ---------- */
  /** Makes `content` (absolutely positioned, natural size contentW x contentH) pannable and zoomable inside `host`.
      opts: {contentW, contentH, minScale (default: fit), maxScale (4), padding (0), onChange(state), wheelZoom (true)}
      Returns {fit(anim), zoomBy(f, cx, cy, anim), zoomTo(s, x, y, anim), focusRect(x, y, w, h, anim, pad), state(), destroy()}. Coordinates are content pixels. */
  UI.zoomPan = function (host, content, opts) {
    opts = opts || {};
    host.classList.add("zp");
    content.classList.add("zp-content");
    if (content.parentNode !== host) host.appendChild(content);
    var W = opts.contentW, H = opts.contentH, pad = opts.padding || 0;
    var st = { s: 1, x: 0, y: 0 }, cancelAnim = null, vel = { x: 0, y: 0 }, inertiaRaf = 0;
    function fitScale() { var r = host.getBoundingClientRect(); return Math.min((r.width - pad * 2) / W, (r.height - pad * 2) / H); }
    function minS() { return opts.minScale || fitScale(); }
    function maxS() { return (opts.maxScale || 4) * Math.max(fitScale(), .05) / Math.min(1, fitScale() || 1) ; }
    function bound(s) {
      var r = host.getBoundingClientRect(), cw = W * s.s, ch = H * s.s;
      if (cw <= r.width) s.x = (r.width - cw) / 2; else s.x = U.clamp(s.x, r.width - cw - pad, pad);
      if (ch <= r.height) s.y = (r.height - ch) / 2; else s.y = U.clamp(s.y, r.height - ch - pad, pad);
      return s;
    }
    function apply() {
      content.style.transform = "translate(" + st.x + "px," + st.y + "px) scale(" + st.s + ")";
      opts.onChange && opts.onChange(st);
    }
    function set(s, anim, dur) {
      var target = bound({ s: U.clamp(s.s, minS() * .999, absMax()), x: s.x, y: s.y });
      if (cancelAnim) cancelAnim();
      if (!anim) { st = target; apply(); return; }
      var from = { s: st.s, x: st.x, y: st.y };
      content.style.willChange = "transform";
      cancelAnim = U.tween({ from: from, to: target, duration: dur || 520, ease: U.easeInOutCubic, onUpdate: function (v) { st = v; apply(); }, onDone: function () { cancelAnim = null; content.style.willChange = ""; } });
    }
    function absMax() { return Math.max(minS() * 1.01, fitScale() * (opts.maxScale || 4)); }
    function zoomAt(f, cx, cy, anim) {
      var ns = U.clamp(st.s * f, minS(), absMax()), k = ns / st.s;
      set({ s: ns, x: cx - (cx - st.x) * k, y: cy - (cy - st.y) * k }, anim, 380);
    }
    function onWheel(e) {
      if (opts.wheelZoom === false) return;
      e.preventDefault();
      var r = host.getBoundingClientRect();
      if (e.ctrlKey || Math.abs(e.deltaY) >= Math.abs(e.deltaX)) zoomAt(Math.exp(-e.deltaY * (e.ctrlKey ? 0.012 : 0.0022)), e.clientX - r.left, e.clientY - r.top, false);
      else set({ s: st.s, x: st.x - e.deltaX, y: st.y }, false);
    }
    var pointers = {}, last = null, pinch0 = null, moved = 0, lastT = 0;
    function onDown(e) {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      if (e.target.closest && e.target.closest("button, a, input, .no-pan")) return;
      host.setPointerCapture(e.pointerId);
      pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
      cancelAnimationFrame(inertiaRaf); if (cancelAnim) { cancelAnim(); cancelAnim = null; }
      last = { x: e.clientX, y: e.clientY }; moved = 0; vel = { x: 0, y: 0 }; lastT = performance.now();
      var ids = Object.keys(pointers);
      if (ids.length === 2) { var a = pointers[ids[0]], b = pointers[ids[1]]; pinch0 = { d: Math.hypot(a.x - b.x, a.y - b.y), s: st.s }; }
      host.classList.add("dragging");
    }
    function onMove(e) {
      if (!pointers[e.pointerId]) return;
      pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
      var ids = Object.keys(pointers), r = host.getBoundingClientRect();
      if (ids.length === 2 && pinch0) {
        var a = pointers[ids[0]], b = pointers[ids[1]], d = Math.hypot(a.x - b.x, a.y - b.y);
        zoomAt((pinch0.s * d / pinch0.d) / st.s, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top, false);
        return;
      }
      var dx = e.clientX - last.x, dy = e.clientY - last.y, now = performance.now(), dt = Math.max(1, now - lastT);
      moved += Math.abs(dx) + Math.abs(dy);
      vel = { x: dx / dt * 16, y: dy / dt * 16 }; lastT = now;
      last = { x: e.clientX, y: e.clientY };
      set({ s: st.s, x: st.x + dx, y: st.y + dy }, false);
    }
    function onUp(e) {
      delete pointers[e.pointerId];
      if (Object.keys(pointers).length < 2) pinch0 = null;
      if (Object.keys(pointers).length) return;
      host.classList.remove("dragging");
      if (moved > 6) {
        host._suppressClick = true; setTimeout(function () { host._suppressClick = false; }, 0);
        if (!U.prefersReducedMotion() && performance.now() - lastT < 80) {
          (function glide() {
            vel.x *= 0.92; vel.y *= 0.92;
            if (Math.abs(vel.x) + Math.abs(vel.y) < 0.4) return;
            set({ s: st.s, x: st.x + vel.x, y: st.y + vel.y }, false);
            inertiaRaf = requestAnimationFrame(glide);
          })();
        }
      }
    }
    function onClickCapture(e) { if (host._suppressClick) { e.stopPropagation(); e.preventDefault(); } }
    function onDbl(e) { var r = host.getBoundingClientRect(); zoomAt(1.8, e.clientX - r.left, e.clientY - r.top, true); }
    host.addEventListener("wheel", onWheel, { passive: false });
    host.addEventListener("pointerdown", onDown);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerup", onUp);
    host.addEventListener("pointercancel", onUp);
    host.addEventListener("click", onClickCapture, true);
    host.addEventListener("dblclick", onDbl);
    var ro = ("ResizeObserver" in window) ? new ResizeObserver(U.debounce(function () { if (st.s < minS()) api.fit(false); else set(st, false); }, 60)) : null;
    if (ro) ro.observe(host);

    var api = {
      fit: function (anim) { var s = minS(); set({ s: s, x: 0, y: 0 }, anim); },
      zoomBy: function (f, cx, cy, anim) { var r = host.getBoundingClientRect(); zoomAt(f, cx == null ? r.width / 2 : cx, cy == null ? r.height / 2 : cy, anim !== false); },
      zoomTo: function (s, x, y, anim) { set({ s: s, x: x, y: y }, anim); },
      /** Animate so content rect (x, y, w, h) fills the view. */
      focusRect: function (x, y, w, h, anim, padFrac) {
        var r = host.getBoundingClientRect(), p = padFrac == null ? 0.25 : padFrac;
        var s = Math.min(r.width / (w * (1 + p * 2)), r.height / (h * (1 + p * 2)));
        s = U.clamp(s, minS(), absMax());
        set({ s: s, x: r.width / 2 - (x + w / 2) * s, y: r.height / 2 - (y + h / 2) * s }, anim !== false, 900);
      },
      state: function () { return { s: st.s, x: st.x, y: st.y }; },
      toContent: function (clientX, clientY) { var r = host.getBoundingClientRect(); return { x: (clientX - r.left - st.x) / st.s, y: (clientY - r.top - st.y) / st.s }; },
      destroy: function () {
        cancelAnimationFrame(inertiaRaf); if (cancelAnim) cancelAnim(); if (ro) ro.disconnect();
        host.removeEventListener("wheel", onWheel); host.removeEventListener("pointerdown", onDown); host.removeEventListener("pointermove", onMove);
        host.removeEventListener("pointerup", onUp); host.removeEventListener("pointercancel", onUp); host.removeEventListener("click", onClickCapture, true); host.removeEventListener("dblclick", onDbl);
      }
    };
    requestAnimationFrame(function () { api.fit(false); });
    return api;
  };

  /** Stub renderer for pages that are not built yet. */
  UI.stub = function (root, title, owner) {
    root.appendChild(el("section", { class: "page wrap stub" }, el("div", null,
      el("div", { class: "kicker" }, "Coming soon"), el("h1", null, title),
      el("p", { class: "muted" }, "This page is being built" + (owner ? " by " + owner : "") + "."))));
  };
})();
