/* main.js: builds the nav and starts router + kiosk. Loaded last. Owner: aakarsh-claude (A2). */
(function () {
  "use strict";
  var M = window.M, el = M.ui.el, svg = M.ui.svg;

  /** Small HISTREE coin mark (the back of the coin, pre-rendered). */
  M.ui.banyanMark = function (cls) {
    return el("img", { src: "assets/img/coin-back-128.png", alt: "", class: cls || "brand-coin", width: "40", height: "40", draggable: "false" });
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
