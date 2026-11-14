/* voices.js: Voices index (#/voices) and person pages (#/voices/<personId>?q=search). Owner: saharsh-claude (S3).
   Person pages: what they told us, timeline events, where their memory disagrees or is backed up, the full transcript
   with search. */
(function () {
  "use strict";
  var M = window.M, U = M.util, UI = M.ui, el = UI.el;
  var st = null;

  /* Editor's notes shown inside transcripts (we never change the transcript text itself). */
  var SIC = { "P-PJN": [ { re: /Talon[\u2019']s Print/g, note: "we think this is TalentSprint" } ] };

  /* ---------- transcript rendering (tiny, safe markdown: **b**, *i*, `code`) ---------- */
  function inline(text) {
    var out = [], re = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|`[^`]+`)/g, last = 0, m;
    while ((m = re.exec(text))) {
      if (m.index > last) out.push(text.slice(last, m.index));
      var t = m[0];
      if (t.indexOf("**") === 0) out.push(el("strong", null, t.slice(2, -2)));
      else if (t.charAt(0) === "`") out.push(el("code", null, t.slice(1, -1)));
      else out.push(el("em", null, t.slice(1, -1)));
      last = m.index + t.length;
    }
    if (last < text.length) out.push(text.slice(last));
    return out;
  }
  function isHeading(p) {
    if (/^#{1,4}\s/.test(p)) return true;
    var t = p.trim();
    if (t.length > 72 || /[.,;:?!"]$/.test(t)) return false;
    return /^\d+\.\s+[A-Z&\s,()0-9:-]+$/.test(t) || (t.length < 60 && /^[A-Z]/.test(t) && t.split(/\s+/).length <= 9 && !/^[-*>]/.test(t));
  }
  /* Merge lines that a converter split mid-sentence (a line starting in lower case continues the previous one). */
  function mergeParas(paras) {
    var out = [];
    paras.forEach(function (p) {
      if (out.length && /^[a-z]/.test(p) && !/[.!?:]$/.test(out[out.length - 1])) out[out.length - 1] += " " + p;
      else out.push(p);
    });
    return out;
  }
  function transcriptBlocks(t, personId) {
    var nodes = [], list = null;
    mergeParas(t.paras || []).forEach(function (p) {
      var bullet = /^\s*(?:[-*]|\d+\.)\s+(?:\[[ x]\]\s+)?/.exec(p);
      if (bullet && !/^\d+\.\s+[A-Z&\s,()0-9:-]+$/.test(p.trim())) {
        if (!list) { list = el("ul", { class: "voices-ul" }); nodes.push(list); }
        list.appendChild(el("li", null, inline(p.slice(bullet[0].length))));
        return;
      }
      list = null;
      if (/^-{3,}$/.test(p.trim())) nodes.push(el("hr", { class: "rule" }));
      else if (/ {3,}/.test(p)) nodes.push(el("pre", { class: "voices-pre" }, p));
      else if (/^>\s?/.test(p)) nodes.push(el("blockquote", { class: "voices-bq" }, inline(p.replace(/^>\s?/, ""))));
      else if (isHeading(p)) nodes.push(el("h4", { class: "voices-h" }, inline(p.replace(/^#+\s*/, ""))));
      else nodes.push(el("p", null, inline(p)));
    });
    (SIC[personId] || []).forEach(function (s) { annotate(nodes, s); });
    return nodes;
  }
  function textNodes(root) {
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), out = [], n;
    while ((n = w.nextNode())) out.push(n);
    return out;
  }
  function annotate(nodes, s) {
    nodes.forEach(function (root) {
      textNodes(root).forEach(function (tn) {
        s.re.lastIndex = 0;
        var m = s.re.exec(tn.nodeValue);
        if (!m) return;
        var after = tn.splitText(m.index + m[0].length);
        tn.parentNode.insertBefore(el("span", { class: "voices-sic", title: "Editor's note" }, "[" + s.note + "]"), after);
      });
    });
  }
  function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  /** Wraps every match of q inside container in <mark>. Returns the marks. */
  function highlight(container, q) {
    var marks = [];
    if (!q || q.trim().length < 2) return marks;
    var re = new RegExp(escapeRe(q.trim()), "gi");
    textNodes(container).forEach(function (tn) {
      if (tn.parentNode.closest(".voices-sic")) return;
      var v = tn.nodeValue, m, last = 0, frag = null;
      re.lastIndex = 0;
      while ((m = re.exec(v))) {
        if (!frag) frag = document.createDocumentFragment();
        if (m.index > last) frag.appendChild(document.createTextNode(v.slice(last, m.index)));
        var mk = el("mark", null, m[0]); frag.appendChild(mk); marks.push(mk);
        last = m.index + m[0].length;
      }
      if (frag) { if (last < v.length) frag.appendChild(document.createTextNode(v.slice(last))); tn.parentNode.replaceChild(frag, tn); }
    });
    return marks;
  }

  /* ---------- index ---------- */
  function sortedPeople() { return (M.people || []).slice().sort(function (a, b) { return (a.joined || 9999) - (b.joined || 9999); }); }
  /* Headshots: public profiles (INAE, IIIT website and blog, LinkedIn for Prabhakar); Gopi's from the team. Anyone not listed shows initials. */
  var PHOTOS = {};
  ["P-GOPI", "P-SLN", "P-PJN", "P-MURALI", "P-RAJAN", "P-PRAB", "P-SRIDHAR"].forEach(function (id) { PHOTOS[id] = "assets/img/people/" + id + ".jpg"; });
  function avatar(p, size) {
    var a = UI.avatar(p, size);
    if (p.color) a.style.setProperty("--c", p.color);
    if (PHOTOS[p.id] && !a.querySelector("img")) {
      a.textContent = "";
      a.classList.add("avatar--photo");
      a.appendChild(el("img", { src: PHOTOS[p.id], alt: "", on: { error: function () { a.classList.remove("avatar--photo"); a.textContent = p.initials || "?"; } } }));
    }
    return a;
  }
  var NUM = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

  function renderIndex(root) {
    var people = sortedPeople(), n = people.length;
    var y0 = 1998, y1 = 2026;
    var byYear = {};
    var strip = el("div", { class: "voices-strip", "aria-hidden": "true" },
      el("div", { class: "voices-strip-line" }),
      [1998, 2002, 2006, 2010, 2014, 2018, 2022, 2026].map(function (y) { return el("span", { class: "voices-strip-tick mono", style: { left: ((y - y0) / (y1 - y0) * 100) + "%" } }, String(y)); }),
      people.map(function (p) {
        var k = byYear[p.joined] = (byYear[p.joined] || 0) + 1;
        return el("a", { class: "voices-strip-pin", href: U.href("voices", p.id), tabindex: "-1", style: { left: ((p.joined - y0) / (y1 - y0) * 100) + "%", "--row": k - 1, "--c": p.color || "var(--plum)" } },
          el("span", { class: "dot" }), el("span", { class: "stem" }), el("span", { class: "lbl" }, p.name));
      }));

    /* the ring: everyone we interviewed, in the order they arrived, clockwise from the top */
    var ring = el("div", { class: "voices-ring" },
      el("div", { class: "voices-ring-line", "aria-hidden": "true" }),
      el("header", { class: "voices-ring-centre" },
        el("div", { class: "kicker" }, "Voices"),
        el("h1", null, (n <= 10 ? NUM[n].charAt(0).toUpperCase() + NUM[n].slice(1) : n) + " people told us their IIIT"),
        el("p", { class: "lede" }, "Most of this exhibit started as something one of them remembered."),
        el("p", { class: "voices-consent" }, UI.icon("check"), "Everyone here agreed to be recorded and quoted.")),
      el("ul", { class: "voices-ring-list" }, people.map(function (p, i) {
        var ang = (-90 + i * 360 / n) * Math.PI / 180;
        return el("li", { class: "voices-ring-item", style: { "--x": Math.cos(ang).toFixed(4), "--y": Math.sin(ang).toFixed(4), "--i": i, "--c": p.color || "var(--plum)" } },
          el("a", { class: "voices-ring-link", href: U.href("voices", p.id) },
            avatar(p, "var(--av)"),
            el("span", { class: "voices-ring-name" }, p.name),
            el("span", { class: "voices-ring-years mono" }, p.years)));
      })));

    root.appendChild(el("section", { class: "page voices" }, el("div", { class: "wrap" }, el("div", { class: "page-pad" },
      ring,
      el("h2", { class: "voices-sub" }, "When they arrived"),
      strip,
      el("p", { class: "voices-credit muted small" }, "Photos of Prof. Narayanan, Prof. Rajan, SLN Shastry, G. Muralidhar, Prabhakar M and Sridhar Kora are from their public profiles (INAE, the IIIT website and blog, LinkedIn)."),
      el("details", { class: "callout voices-howto" },
        el("summary", null, "How to read these interviews"),
        el("p", null, "Most texts are write-ups of the recordings, not word for word. Prof. Narayanan's came as a polished write-up, so we never quote its wording as his. Prof. Rajan's is notes from an automatic transcript. Where we cut a line, the text says so."))))));
  }

  /* ---------- person page ---------- */
  function renderPerson(root, id, query) {
    var p = U.person(id);
    if (!p) { renderIndex(root); return; }
    var people = sortedPeople(), i = people.indexOf(p);
    var prevP = people[(i - 1 + people.length) % people.length], nextP = people[(i + 1) % people.length];
    var sid = p.sourceId, src = U.source(sid) || {};
    var t = (M.transcripts || {})[p.transcriptId || p.id];
    var events = U.eventsForPerson(p.id);
    var conflicts = (M.conflicts || []).filter(function (c) { return c.accounts.some(function (a) { return (a.sources || []).indexOf(sid) >= 0; }); });
    var checked = (M.verified || []).filter(function (v) { return v.chain.some(function (n) { return (n.sources || []).indexOf(sid) >= 0; }); });

    var head = el("header", { class: "voices-person-head", style: { "--c": p.color || "var(--plum)" } },
      el("a", { class: "btn btn--ghost voices-back", href: U.href("voices") }, UI.icon("arrow-left"), "All voices"),
      el("div", { class: "voices-person-id" },
        avatar(p, "7rem"),
        el("div", null,
          el("div", { class: "kicker" }, "Interview, 2026"),
          el("h1", null, p.fullName || p.name),
          el("p", { class: "voices-role voices-role--big" }, p.role),
          el("span", { class: "voices-years mono" }, "At IIIT: " + p.years))));

    var left = el("div", { class: "voices-col-left" },
      p.toldUs && p.toldUs.length ? el("section", { class: "voices-block" },
        el("h2", null, "What they told us"),
        el("ul", { class: "voices-told" }, p.toldUs.map(function (s) { return el("li", null, s); })),
        UI.sourceBadges([sid])) : null,
      events.length ? el("section", { class: "voices-block" },
        el("h2", null, "On the timeline"),
        el("ol", { class: "voices-events" }, events.map(function (e) {
          return el("li", null, el("a", { href: U.href("timeline", e.id) }, el("span", { class: "mono" }, U.formatYear(e)), el("span", null, e.title)));
        }))) : null,
      conflicts.length ? el("section", { class: "voices-block" },
        el("h2", null, "Where this memory disagrees"),
        conflicts.map(function (c) {
          var mine = c.accounts.filter(function (a) { return (a.sources || []).indexOf(sid) >= 0; })[0];
          return el("a", { class: "voices-mini", href: U.href("how-we-know", c.id) },
            el("span", { class: "kicker" }, c.id), el("b", null, c.question), mine ? el("span", { class: "muted small" }, mine.text) : null,
            el("span", { class: "voices-more mono" }, "See every side", UI.icon("arrow-right")));
        })) : null,
      checked.length ? el("section", { class: "voices-block" },
        el("h2", null, "Where other sources back it up"),
        checked.map(function (v) {
          return el("a", { class: "voices-mini voices-mini--ok", href: U.href("how-we-know", v.id) },
            el("span", { class: "kicker" }, v.id), el("b", null, v.claim), el("span", { class: "voices-more mono" }, "See the evidence", UI.icon("arrow-right")));
        })) : null);

    var right = el("div", { class: "voices-col-right" });
    if (t) {
      var body = el("div", { class: "voices-transcript" });
      var count = el("span", { class: "voices-count mono", "aria-live": "polite" });
      var input = el("input", { type: "search", class: "voices-search-input", placeholder: "Search this interview", "aria-label": "Search this interview", value: query.q || "" });
      var prev = el("button", { class: "icon-btn", type: "button", "aria-label": "Previous match", on: { click: function () { step(-1); } } }, UI.icon("chevron-up"));
      var next = el("button", { class: "icon-btn", type: "button", "aria-label": "Next match", on: { click: function () { step(1); } } }, UI.icon("chevron-down"));
      var marks = [], cur = -1;
      var toggle = el("button", { type: "button", class: "btn btn--ghost voices-tr-toggle", "aria-expanded": "false", on: { click: function () { setOpen(body.hidden); } } });
      var setOpen = function (open) {
        body.hidden = !open;
        toggle.setAttribute("aria-expanded", String(open));
        toggle.textContent = open ? "Hide the interview" : "Read the full interview";
      };
      var draw = function (q) {
        if (q && q.trim().length >= 2) setOpen(true);
        body.textContent = "";
        transcriptBlocks(t, p.id).forEach(function (n) { body.appendChild(n); });
        marks = highlight(body, q); cur = -1;
        count.textContent = q && q.trim().length >= 2 ? (marks.length === 1 ? "1 match" : marks.length + " matches") : "";
        prev.disabled = next.disabled = marks.length === 0;
        if (marks.length) step(1);
      };
      var step = function (d) {
        if (!marks.length) return;
        if (cur >= 0) marks[cur].classList.remove("current");
        cur = (cur + d + marks.length) % marks.length;
        marks[cur].classList.add("current");
        count.textContent = (cur + 1) + " of " + marks.length;
        var mk = marks[cur];
        /* wait a frame so the router's scroll-to-top on first render doesn't cancel this */
        requestAnimationFrame(function () { if (mk.isConnected) mk.scrollIntoView({ behavior: U.prefersReducedMotion() ? "auto" : "smooth", block: "center" }); });
      };
      var onInput = U.debounce(function () {
        draw(input.value);
        M.router.replace(U.href("voices", p.id, input.value.trim() ? { q: input.value.trim() } : null));
      }, 180);
      input.addEventListener("input", onInput);
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") { e.preventDefault(); step(e.shiftKey ? -1 : 1); }
        else if (e.key === "Escape") { input.value = ""; onInput(); }
      });
      right.appendChild(el("section", { class: "voices-block voices-tr" },
        el("div", { class: "voices-tr-head" },
          el("h2", null, "The interview"),
          el("p", { class: "mono small muted" }, t.title)),
        t.note ? el("p", { class: "callout voices-note" }, t.note) : (src.note ? el("p", { class: "voices-note-plain muted small" }, src.note) : null),
        el("div", { class: "voices-search" }, UI.icon("search"), input, count, prev, next),
        toggle, body));
      setOpen(false);
      draw(query.q || "");
    } else {
      right.appendChild(el("p", { class: "empty" }, "Transcript not available."));
    }

    var nav = el("nav", { class: "voices-pn", "aria-label": "Other voices" },
      el("a", { class: "btn btn--ghost", href: U.href("voices", prevP.id) }, UI.icon("arrow-left"), prevP.name),
      el("a", { class: "btn btn--ghost", href: U.href("voices", nextP.id) }, nextP.name, UI.icon("arrow-right")));

    root.appendChild(el("section", { class: "page voices voices--person" }, el("div", { class: "wrap" }, el("div", { class: "page-pad" },
      head,
      el("div", { class: "voices-cols" }, left, right),
      nav))));
  }

  /* Stack strip labels into rows so none overlap (measured after layout). */
  function layoutStrip() {
    var strip = st && st.root.querySelector(".voices-strip");
    if (!strip || !strip.offsetWidth) return;
    var pins = Array.prototype.slice.call(strip.querySelectorAll(".voices-strip-pin"));
    var rows = [];
    pins.forEach(function (pin) { pin.style.setProperty("--row", 0); });
    pins.map(function (pin) { var r = pin.querySelector(".lbl").getBoundingClientRect(); return { pin: pin, l: r.left, w: r.width }; })
      .sort(function (a, b) { return a.l - b.l; })
      .forEach(function (o) {
        var r = 0; while (rows[r] != null && rows[r] + 12 > o.l) r++;
        rows[r] = o.l + o.w;
        o.pin.style.setProperty("--row", r);
      });
    strip.style.setProperty("--rows", rows.length);
  }

  function draw(params, query) {
    st.root.textContent = "";
    if (params && params[0]) renderPerson(st.root, params[0], query || {});
    else { renderIndex(st.root); requestAnimationFrame(layoutStrip); }
  }

  M.pages.voices = {
    id: "voices", route: "voices", title: "Voices", navLabel: "Voices", nav: true, navOrder: 6,
    render: function (root, ctx) {
      st = { root: root, io: null, person: ctx.params[0] || null, onResize: U.debounce(function () { layoutStrip(); }, 120) };
      window.addEventListener("resize", st.onResize);
      draw(ctx.params, ctx.query);
    },
    update: function (params, query) {
      var id = params[0] || null;
      if (id === st.person) return; /* same person: only the ?q= changed (we did that ourselves) */
      st.person = id;
      draw(params, query);
      window.scrollTo(0, 0);
    },
    destroy: function () { if (!st) return; if (st.io) st.io.disconnect(); window.removeEventListener("resize", st.onResize); st = null; }
  };
})();
