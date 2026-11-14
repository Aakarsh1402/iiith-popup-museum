/* theme.js: picks the colour scheme before the page paints. Owner: saharsh-claude. Styles live in css/themes.css.
   index.html?theme=navy (or banyan, sky, paper). The query sits before the #, so it stays while you move between pages.
   Add &themes to show a picker for comparing. Nothing is stored, so a monitor never keeps a scheme someone was trying out.
   DEFAULT is what every screen gets without ?theme; "paper" is the original beige. */
(function () {
  "use strict";
  var THEMES = [
    { id: "paper", label: "Paper (now)", swatch: "#F4EEE2" },
    { id: "navy", label: "IIIT navy", swatch: "#0B3563" },
    { id: "banyan", label: "Navy + banyan", swatch: "#2E6B3E" },
    { id: "sky", label: "Sky", swatch: "#2B7BD6" }
  ];
  var DEFAULT = "paper";
  var ids = THEMES.map(function (t) { return t.id; });
  var m = /[?&]theme=([a-z]+)/.exec(location.search);
  var theme = m && ids.indexOf(m[1]) >= 0 ? m[1] : DEFAULT;
  document.documentElement.setAttribute("data-theme", theme);

  if (!/[?&]themes\b/.test(location.search)) return;
  function setParam(id) {
    var q = location.search.replace(/^\?/, "").split("&").filter(function (p) { return p && p.indexOf("theme=") !== 0; });
    q.unshift("theme=" + id);
    try { history.replaceState(history.state, "", "?" + q.join("&") + location.hash); } catch (e) { /* file:// in some browsers */ }
  }
  document.addEventListener("DOMContentLoaded", function () {
    var bar = document.createElement("div");
    bar.className = "theme-picker";
    bar.setAttribute("role", "group");
    bar.setAttribute("aria-label", "Colour scheme");
    THEMES.forEach(function (t) {
      var b = document.createElement("button");
      b.type = "button";
      b.innerHTML = '<i style="background:' + t.swatch + '"></i>' + t.label;
      b.setAttribute("aria-pressed", String(t.id === theme));
      b.addEventListener("click", function () {
        theme = t.id;
        document.documentElement.setAttribute("data-theme", t.id);
        setParam(t.id);
        Array.prototype.forEach.call(bar.querySelectorAll("button"), function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      });
      bar.appendChild(b);
    });
    document.body.appendChild(bar);
  });
})();
