/* router.js: hash router with page lifecycle and view transitions. Owner: aakarsh-claude (A2).
   Routes look like #/<route>/<param>/<param>?key=value. Pages register on M.pages with a `route` name. */
(function () {
  "use strict";
  var M = (window.M = window.M || {});
  var U = M.util;
  var R = (M.router = {});
  var current = null; // { page, route, params, query, hash }
  var byRoute = null;

  function table() {
    if (byRoute) return byRoute;
    byRoute = {};
    Object.keys(M.pages).forEach(function (k) { var p = M.pages[k]; p.id = p.id || k; byRoute[p.route || p.id] = p; });
    return byRoute;
  }

  R.parse = function (hash) {
    var h = (hash || "").replace(/^#\/?/, "");
    var qi = h.indexOf("?"), path = qi >= 0 ? h.slice(0, qi) : h, q = qi >= 0 ? h.slice(qi) : "";
    var parts = path.split("/").filter(Boolean).map(function (s) { try { return decodeURIComponent(s); } catch (e) { return s; } });
    return { route: parts[0] || "start", params: parts.slice(1), query: U.parseQuery(q) };
  };

  R.current = function () { return current; };

  /** Navigate. opts.force re-renders even if the page is the same. opts.replace uses replaceState. */
  R.go = function (hash, opts) {
    opts = opts || {};
    if (hash.charAt(0) !== "#") hash = "#" + hash;
    if (opts.force && location.hash === hash) { R._handle(true); return; }
    if (opts.replace) { history.replaceState(null, "", hash); R._handle(!!opts.force); }
    else if (location.hash === hash) R._handle(!!opts.force);
    else { R._forceNext = !!opts.force; location.hash = hash; }
  };

  /** Change the URL (e.g. filters) without re-rendering. */
  R.replace = function (hash) {
    if (hash.charAt(0) !== "#") hash = "#" + hash;
    history.replaceState(null, "", hash);
    if (current) { var p = R.parse(hash); current.params = p.params; current.query = p.query; current.hash = hash; }
    M.state.route = hash;
    R._emit();
  };

  var listeners = [];
  R.onChange = function (fn) { listeners.push(fn); return function () { listeners = listeners.filter(function (f) { return f !== fn; }); }; };
  R._emit = function () { listeners.forEach(function (fn) { try { fn(current); } catch (e) { console.error(e); } }); };

  R._handle = function (force) {
    force = force || R._forceNext; R._forceNext = false;
    var t = table(), p = R.parse(location.hash), page = t[p.route];
    if (!page) { history.replaceState(null, "", "#/start"); p = R.parse("#/start"); page = t.start; }
    var ctx = { params: p.params, query: p.query, route: p.route };
    M.state.route = location.hash || "#/start";
    if (current && current.page === page && !force && typeof page.update === "function") {
      current.params = p.params; current.query = p.query; current.hash = location.hash;
      try { page.update(p.params, p.query); } catch (e) { console.error("[router] update failed", e); }
      R._emit();
      return;
    }
    var app = document.getElementById("app");
    function swap() {
      if (current && current.page && current.page.destroy) { try { current.page.destroy(); } catch (e) { console.error("[router] destroy failed", e); } }
      if (M.ui && M.ui.closeTop) { while (M.ui.closeTop()) { /* close overlays from the old page */ } }
      app.textContent = "";
      app.className = "";
      app.dataset.page = page.id;
      document.body.dataset.page = page.id;
      current = { page: page, route: p.route, params: p.params, query: p.query, hash: location.hash };
      try { page.render(app, ctx); } catch (e) { console.error("[router] render failed", e); app.appendChild(M.ui.el("div", { class: "wrap stub" }, M.ui.el("p", null, "Something went wrong on this page."))); }
      document.title = (page.title ? page.title + " | " : "") + "HISTREE | Do You Know Your Institute?";
      window.scrollTo(0, 0);
      try { app.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
    }
    var first = !current;
    if (!first && document.startViewTransition && !U.prefersReducedMotion()) {
      document.startViewTransition(swap);
    } else {
      swap();
      if (!first && !U.prefersReducedMotion()) { app.classList.add("fade-in"); }
    }
    R._emit();
  };

  R.start = function () {
    window.addEventListener("hashchange", function () { R._handle(false); });
    if (!location.hash) history.replaceState(null, "", (M.kiosk && M.kiosk.homeRoute()) || "#/start");
    R._handle(true);
  };
})();
