/* main.js: builds the nav and starts router + kiosk. Loaded last. Owner: aakarsh-claude (A2). */
(function () {
  "use strict";
  var M = window.M, el = M.ui.el, svg = M.ui.svg;

  /** Small original banyan mark: wide canopy, trunk, aerial roots. */
  M.ui.banyanMark = function (cls) {
    return svg("svg", { viewBox: "0 0 64 64", class: cls || null, "aria-hidden": "true" },
      svg("ellipse", { cx: 32, cy: 22, rx: 27, ry: 14, fill: "var(--banyan)" }),
      svg("ellipse", { cx: 19, cy: 19, rx: 12, ry: 9, fill: "var(--leaf)", opacity: ".55" }),
      svg("ellipse", { cx: 42, cy: 17, rx: 11, ry: 8, fill: "var(--leaf)", opacity: ".4" }),
      svg("path", { d: "M29 30 C29 40 27 48 24 56 H40 C37 48 35 40 35 30 Z", fill: "var(--soil)" }),
      svg("path", { d: "M13 30 V52 M20 33 V55 M45 33 V55 M52 30 V50", stroke: "var(--soil)", "stroke-width": "2", "stroke-linecap": "round", fill: "none", opacity: ".8" }),
      svg("path", { d: "M8 57 H56", stroke: "var(--ink)", "stroke-width": "2", "stroke-linecap": "round", opacity: ".5" }));
  };

  function buildNav() {
    var nav = document.getElementById("nav");
    var links = el("ul", { class: "nav-links", id: "nav-links" });
    M.kiosk.navPages().forEach(function (p, i) {
      var key = i === 9 ? "0" : String(i + 1);
      links.appendChild(el("li", null, el("a", { href: "#/" + (p.route || p.id), dataset: { route: p.route || p.id } },
        el("span", { class: "key" }, key), p.navLabel || p.title)));
    });
    var toggle = el("button", { class: "nav-toggle", "aria-label": "Menu", "aria-controls": "nav-links", "aria-expanded": "false",
      on: { click: function () { var o = links.classList.toggle("open"); toggle.setAttribute("aria-expanded", String(o)); } } }, M.ui.icon("menu"));
    nav.appendChild(el("div", { class: "wrap nav-inner" },
      el("a", { class: "brand", href: "#/start", "aria-label": "HISTREE home" }, M.ui.banyanMark(),
        el("span", null, el("b", null, "HISTREE"), el("small", null, "Do you know your institute?"))),
      toggle, links));
    links.addEventListener("click", function () { links.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); });
    function mark() {
      var r = M.router.current(); var route = r ? r.route : "start";
      Array.prototype.forEach.call(links.querySelectorAll("a"), function (a) {
        if (a.dataset.route === route) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
      });
    }
    M.router.onChange(mark);
  }

  function boot() {
    buildNav();
    M.kiosk.start();
    M.router.start();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
