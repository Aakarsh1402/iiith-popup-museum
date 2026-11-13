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
  /** The page module a hash would render (or null). */
  R.pageFor = function (hash) { return table()[R.parse(hash).route] || null; };
  /** True while a page is still the "coming soon" placeholder. */
  R.isStub = function (hash) { var p = R.pageFor(hash); return !p || /M\.ui\.stub\(/.test(String(p.render)); };

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

  var pending = 0; // a view-transition swap is queued; it reads location.hash when it runs

  R._handle = function (force) {
    force = force || R._forceNext; R._forceNext = false;
    var t = table();
    if (!t[R.parse(location.hash).route]) history.replaceState(null, "", "#/start");
    M.state.route = location.hash || "#/start";
    if (pending) { pending = 2; return; }   // fast second click: the queued swap picks up the newest hash
    var p = R.parse(location.hash), page = t[p.route];
    if (current && current.page === page && !force && typeof page.update === "function") {
      current.params = p.params; current.query = p.query; current.hash = location.hash;
      try { page.update(p.params, p.query); } catch (e) { console.error("[router] update failed", e); }
      R._emit();
      return;
    }
    var app = document.getElementById("app"), token = {};
    R._token = token;
    function swap() {
      if (R._token !== token) return;          // a newer swap already ran
      R._token = null; pending = 0;
      p = R.parse(location.hash); page = t[p.route] || t.start;
      var ctx = { params: p.params, query: p.query, route: p.route };
      if (current && current.page && current.page.destroy) { try { current.page.destroy(); } catch (e) { console.error("[router] destroy failed", e); } }
      if (M.ui && M.ui.closeTop) { while (M.ui.closeTop()) { /* close overlays from the old page */ } }
      app.textContent = "";
      app.className = "";
      app.dataset.page = page.id;
      document.body.dataset.page = page.id;
      current = { page: page, route: p.route, params: p.params, query: p.query, hash: location.hash };
      try { page.render(app, ctx); } catch (e) { console.error("[router] render failed", e); app.appendChild(M.ui.el("div", { class: "wrap stub" }, M.ui.el("p", null, "Something went wrong on this page."))); }
      document.title = (page.title ? page.title + " | " : "") + "Do You Know Your Institute?";
      window.scrollTo(0, 0);
      try { app.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
      R._emit();   // after the swap, so the nav marks the page that is actually showing
    }
    var first = !current;
    if (!first && document.startViewTransition && !U.prefersReducedMotion()) {
      pending = 1;
      var vt = document.startViewTransition(swap);
      [vt.ready, vt.finished, vt.updateCallbackDone].forEach(function (pr) { if (pr && pr.catch) pr.catch(function () { /* skipped: fine */ }); });
      setTimeout(function () { if (R._token === token) swap(); }, 1200);   // safety net if the browser never runs the callback
    } else {
      swap();
      if (!first && !U.prefersReducedMotion()) { app.classList.add("fade-in"); }
    }
  };

  R.start = function () {
    window.addEventListener("hashchange", function () { R._handle(false); });
    if (!location.hash) history.replaceState(null, "", (M.kiosk && M.kiosk.homeRoute()) || "#/start");
    R._handle(true);
  };
})();
