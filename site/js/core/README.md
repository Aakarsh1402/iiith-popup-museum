# Core helpers (`M.ui`, `M.util`, `M.router`, `M.kiosk`)

Owner: aakarsh-claude. Use these instead of writing your own. Ask in `HANDOFF.md` if you need something added.

## Page module contract
```js
M.pages.voices = {
  id: "voices", route: "voices", title: "Voices", navLabel: "Voices", nav: true, navOrder: 6,
  render(root, ctx) { /* ctx = { params: [...], query: {...}, route } ; build DOM into root */ },
  update(params, query) { /* optional: same page, new params (e.g. #/voices/P-GOPI). No re-render. */ },
  destroy() { /* clear EVERY timer, rAF, listener, observer and sheet you created */ }
};
```
- `route` is the hash name (`how-we-know` for `M.pages.howweknow`). `navOrder` sets the nav position and the number key.
- Wrap your page in `<section class="page">`; use `.wrap` for the centred max-width container and `.page-pad` for top/bottom padding.
- Page transitions (View Transitions, cross-fade) are automatic on page change. Same-page param changes call `update`.

## M.ui
| helper | what it does |
|---|---|
| `el(tag, attrs, ...children)` | DOM builder. attrs: `class` (string or array), `text`, `style` (object, supports `--vars`), `on: {click: fn}`, `dataset`, any attribute. Children: nodes, strings, arrays, null. Never use innerHTML for data. |
| `svg(tag, attrs, ...children)` | Same for SVG elements. |
| `icon(name)` | Inline stroke icon. Names: chevron-left/right/up/down, arrow-left/right, close, plus, minus, search, play, pause, pin, home, mic, doc, photo, globe, layers, tree, book, expand, fit, menu, link, flip, check, quote, filter, clock, alert. Use icons, not arrow characters, in UI. |
| `sourceBadges(ids, {compact})` | Row of source badges (colour by type). Click opens a popover with the citation and a link to Voices / Archive. |
| `sourceLine(ids)` | Plain "Source: ..." line for the bottom of a card. |
| `confidenceTag(level, conflictId)` | Rubber-stamp tag: Corroborated / One source / Sources disagree (links to `#/how-we-know/<id>`) / To check. |
| `stamp(text, kind, big)` | Generic stamp. kind: corroborated, single, contested, todo. |
| `chips(options, active, onChange)` | Filter chips. options `[{id, label, color}]`. Returned node has `.setActive(id)`. |
| `card({kicker, title, body, image, href, onClick, footer, className})` | Basic card (image = image id). |
| `avatar(person, size)` | Initials avatar (or portrait if `person.photo` is set). |
| `imageFigure(imgId, {size, caption, gallery, ratio, captionText})` | Figure with thumb + caption; click opens the lightbox over `gallery`. |
| `lightbox(imgIds, startIndex)` | Full-screen viewer with zoom/pan, arrows, Esc. |
| `modal(node, {title, onClose})` | Modal dialog. Returns `{close}`. |
| `sheet({onClose, root})` | Slide-in side panel (bottom sheet on phones). Returns `{el, body, bar, setContent(node), setBar(nodes), open(), close(silent), isOpen(), destroy()}`. Call `destroy()` in your page's destroy. |
| `closeTop()` | Closes the top-most overlay (lightbox, modal, popover, sheet). Esc and the kiosk call it. |
| `toast(msg)` | Small message at the bottom. |
| `reveal(nodes, staggerMs)` | Fade/slide nodes in as they scroll into view (no-op with reduced motion). |
| `zoomPan(host, content, {contentW, contentH, maxScale, padding, onChange})` | Drag/wheel/pinch zoom surface. Returns `{fit(anim), zoomBy(f), zoomTo(s,x,y,anim), focusRect(x,y,w,h,anim), state(), toContent(cx,cy), destroy()}`. Used by the map, the lightbox and the archive viewer. |
| `banyanMark()` | The small banyan logo SVG. |
| `CATEGORIES`, `category(id)` | Event categories with labels and colour variables. |
| `stub(root, title, owner)` | "Coming soon" placeholder. |

## M.util
`byId(list, id)`, `image(id)`, `person(id)`, `event(id)`, `place(id)`, `source(id)`, `sourcesFor(ids)`, `eventsForPlace(placeId)`, `eventsForPerson(personId)`, `byYear` (sort fn), `formatYear(event)`, `clamp`, `lerp`, `easeOutCubic`, `easeInOutCubic`, `easeOutQuint`, `tween({from, to, duration, ease, onUpdate, onDone})` (returns cancel; numbers or `{a, b}` objects), `debounce`, `throttle`, `shuffle`, `wordCount`, `prefersReducedMotion()`, `store.get(k, default)` / `store.set(k, v)` (localStorage that never throws), `parseQuery`, `buildQuery`, `href(route, ...params, {query})`, `uid(prefix)`.

## M.router
`go(hash, {force, replace})`, `replace(hash)` (change the URL without re-rendering, e.g. filters), `current()`, `onChange(fn)` (returns unsubscribe), `parse(hash)`.

## M.kiosk
`onInput(fn)` (returns unsubscribe; fires on real user input; use it to stop autoplay), `screen()`, `screenId()`, `homeRoute()`, `isPlaying()`, `dev` (true with `?dev=1`).

Autoplay convention: if `ctx.query.autoplay === "1"`, start your autoplay loop, and stop it on the first `M.kiosk.onInput` call. Clear timers in `destroy()`. The kiosk playlist re-opens your route with `autoplay=1` after 90 s idle.

## CSS tokens (base.css)
Colours: `--paper --paper-2 --paper-3 --card --ink --ink-2 --ink-3 --rule --banyan --banyan-deep --leaf --soil --soil-deep --ochre --ochre-ink --slate --plum --teal --ok --warn --warn-ink --todo --night`. Categories: `--c-buildings --c-operations --c-people --c-trees --c-land --c-curriculum`. Source types: `--s-oral --s-document --s-photo --s-web`. Fonts: `--font-display` (Fraunces) `--font-body` (Atkinson Hyperlegible) `--font-mono` (JetBrains Mono). Motion: `--ease-out --ease-in-out --t-fast --t-med --t-slow`. Shadows: `--shadow-1/2/3`. Prefix your page's classes (e.g. `.hwk-`, `.voices-`) so CSS files never clash.
