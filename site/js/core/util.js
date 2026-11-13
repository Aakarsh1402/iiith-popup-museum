/* util.js: small pure helpers on M.util. Owner: aakarsh-claude (A2). Documented in js/core/README.md. */
(function () {
  "use strict";
  var M = (window.M = window.M || {});
  M.pages = M.pages || {};
  M.state = M.state || { screen: null, route: null };
  var U = (M.util = M.util || {});

  U.byId = function (list, id) {
    if (!list || id == null) return null;
    if (!Array.isArray(list)) return list[id] || null;
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  };

  var _imgIndex = null;
  U.image = function (id) {
    if (!_imgIndex) { _imgIndex = {}; (M.images || []).forEach(function (im) { _imgIndex[im.id] = im; }); }
    return _imgIndex[id] || null;
  };
  U.person = function (id) { return U.byId(M.people || [], id); };
  U.event = function (id) { return U.byId(M.events || [], id); };
  U.place = function (id) { return U.byId(M.places || [], id); };
  U.source = function (id) { return (M.sources || {})[id] || null; };

  /** Source records for a list of ids (unknown ids are skipped). */
  U.sourcesFor = function (ids) { return (ids || []).map(U.source).filter(Boolean); };

  /** Events that happened at a place, sorted by year. */
  U.eventsForPlace = function (placeId) {
    return (M.events || []).filter(function (e) { return (e.places || []).indexOf(placeId) >= 0; }).sort(U.byYear);
  };

  /** Events linked to a person: listed in `people`, or citing that person's oral source. */
  U.eventsForPerson = function (personId) {
    var p = U.person(personId); var sid = p && p.sourceId;
    return (M.events || []).filter(function (e) {
      return (e.people || []).indexOf(personId) >= 0 || (sid && (e.sources || []).indexOf(sid) >= 0);
    }).sort(U.byYear);
  };

  U.byYear = function (a, b) {
    var ay = a.year == null ? 9999 : a.year, by = b.year == null ? 9999 : b.year;
    return ay - by || (a.sort || 0) - (b.sort || 0);
  };

  /** What to show as an event's date. */
  U.formatYear = function (e) {
    if (!e) return "";
    if (e.dateLabel) return e.dateLabel;
    if (e.year == null) return "Undated";
    var s = (e.approx ? "c." : "") + e.year;
    if (e.yearEnd) s += " to " + e.yearEnd;
    return s;
  };

  U.clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  U.lerp = function (a, b, t) { return a + (b - a) * t; };
  U.easeOutCubic = function (t) { return 1 - Math.pow(1 - t, 3); };
  U.easeInOutCubic = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  U.easeOutQuint = function (t) { return 1 - Math.pow(1 - t, 5); };

  U.prefersReducedMotion = function () {
    try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; }
  };

  /** rAF tween. Returns a cancel function. opts: {from, to, duration, ease, onUpdate(v, t), onDone} */
  U.tween = function (opts) {
    var from = opts.from, to = opts.to, dur = U.prefersReducedMotion() ? 1 : (opts.duration || 400);
    var ease = opts.ease || U.easeOutCubic, t0 = performance.now(), raf = 0, done = false;
    function step(now) {
      var t = U.clamp((now - t0) / dur, 0, 1), k = ease(t);
      var v = typeof from === "number" ? U.lerp(from, to, k) : Object.keys(from).reduce(function (o, key) { o[key] = U.lerp(from[key], to[key], k); return o; }, {});
      opts.onUpdate && opts.onUpdate(v, t);
      if (t < 1) raf = requestAnimationFrame(step); else { done = true; opts.onDone && opts.onDone(); }
    }
    raf = requestAnimationFrame(step);
    return function cancel() { if (!done) cancelAnimationFrame(raf); done = true; };
  };

  U.debounce = function (fn, ms) {
    var t; return function () { var a = arguments, s = this; clearTimeout(t); t = setTimeout(function () { fn.apply(s, a); }, ms); };
  };
  U.throttle = function (fn, ms) {
    var last = 0, t; return function () {
      var now = Date.now(), a = arguments, s = this;
      if (now - last >= ms) { last = now; fn.apply(s, a); }
      else { clearTimeout(t); t = setTimeout(function () { last = Date.now(); fn.apply(s, a); }, ms - (now - last)); }
    };
  };

  U.shuffle = function (arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  };

  U.wordCount = function (s) { return (s || "").trim().split(/\s+/).filter(Boolean).length; };

  /** localStorage that never throws. */
  U.store = {
    get: function (k, dflt) { try { var v = localStorage.getItem("histree:" + k); return v == null ? dflt : JSON.parse(v); } catch (e) { return dflt; } },
    set: function (k, v) { try { localStorage.setItem("histree:" + k, JSON.stringify(v)); } catch (e) { /* ignore */ } }
  };

  /** Query string helpers for the part after "?" in a hash route. */
  U.parseQuery = function (q) {
    var o = {}; (q || "").replace(/^\?/, "").split("&").forEach(function (kv) {
      if (!kv) return; var i = kv.indexOf("="); var k = decodeURIComponent(i < 0 ? kv : kv.slice(0, i));
      o[k] = i < 0 ? "1" : decodeURIComponent(kv.slice(i + 1));
    }); return o;
  };
  U.buildQuery = function (o) {
    var parts = Object.keys(o || {}).filter(function (k) { return o[k] != null && o[k] !== "" && o[k] !== false; })
      .map(function (k) { return encodeURIComponent(k) + "=" + encodeURIComponent(o[k]); });
    return parts.length ? "?" + parts.join("&") : "";
  };

  /** Build a hash link: U.href("timeline", "e-1998-start", {filter: "trees"}) -> "#/timeline/e-1998-start?filter=trees" */
  U.href = function (route) {
    var args = Array.prototype.slice.call(arguments, 1), q = null;
    if (args.length && typeof args[args.length - 1] === "object" && args[args.length - 1] !== null) q = args.pop();
    var p = ["#", route].concat(args.filter(function (x) { return x != null && x !== ""; }).map(encodeURIComponent)).join("/");
    return p + (q ? U.buildQuery(q) : "");
  };

  U.uid = (function () { var n = 0; return function (p) { return (p || "u") + (++n); }; })();
})();
