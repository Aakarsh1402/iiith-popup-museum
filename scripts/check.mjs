#!/usr/bin/env node
// check.mjs: validates site data + copy rules. No dependencies. Run from repo root: node scripts/check.mjs
// Exit code 1 on errors (must fix), 0 with warnings (fine to commit). Owner: aakarsh-claude (A2).
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = path.join(ROOT, "site");
const errors = [], warnings = [];
const err = (m) => errors.push(m), warn = (m) => warnings.push(m);

// ---- load data files in a sandbox ----
const ctx = {}; ctx.window = ctx; vm.createContext(ctx);
const dataDir = path.join(SITE, "data");
const order = ["config.js", ...fs.readdirSync(dataDir).filter((f) => f.endsWith(".js") && f !== "config.js").sort()];
for (const f of order) {
  try { vm.runInContext(fs.readFileSync(path.join(dataDir, f), "utf8"), ctx, { filename: f }); }
  catch (e) { err(`data/${f}: failed to load: ${e.message}`); }
}
const M = ctx.M || {};
const S = M.sources || {};
const arr = (x) => (Array.isArray(x) ? x : []);
const ids = (list) => new Set(arr(list).map((x) => x.id));
const images = new Set(arr(M.images).map((x) => x.id));
const people = ids(M.people), events = ids(M.events), places = ids(M.places), conflicts = ids(M.conflicts), journeys = ids(M.journeys);

// 1. unique ids
for (const [name, list] of Object.entries({ people: M.people, events: M.events, places: M.places, facts: M.facts, journeys: M.journeys, trees: M.trees, conflicts: M.conflicts, verified: M.verified, images: M.images, documents: M.documents, "quiz.questions": M.quiz && M.quiz.questions, "way.chapters": M.way && M.way.chapters })) {
  const seen = new Set();
  for (const x of arr(list)) { if (!x || !x.id) { err(`${name}: item without id`); continue; } if (seen.has(x.id)) err(`${name}: duplicate id ${x.id}`); seen.add(x.id); }
}

// 2/3. references + every item has sources
function checkSources(where, list, required = true) {
  if (!Array.isArray(list) || !list.length) { if (required) err(`${where}: no sources`); return; }
  for (const s of list) if (!S[s]) err(`${where}: unknown source ${s}`);
}
function checkImages(where, list) {
  for (const i of arr(list)) if (!images.has(i)) err(`${where}: unknown image ${i}`);
}
for (const im of arr(M.images)) {
  for (const k of ["file", "thumb"]) if (!fs.existsSync(path.join(SITE, im[k] || "x"))) err(`images ${im.id}: missing file ${im[k]}`);
}
for (const p of arr(M.people)) { if (!S[p.sourceId]) err(`people ${p.id}: unknown sourceId ${p.sourceId}`); if (p.photo && !images.has(p.photo)) err(`people ${p.id}: unknown photo ${p.photo}`); }
const ERAS = new Set(["founding", "growing", "takingback", "now", "undated"]);
const CATS = new Set(["buildings", "operations", "people", "trees", "land", "curriculum"]);
const CONF = new Set(["corroborated", "single", "contested", "todo"]);
for (const e of arr(M.events)) {
  const w = `events ${e.id}`;
  checkSources(w, e.sources); checkImages(w, e.images);
  if (!ERAS.has(e.era)) err(`${w}: bad era ${e.era}`);
  if (!CONF.has(e.confidence)) err(`${w}: bad confidence ${e.confidence}`);
  for (const c of arr(e.category)) if (!CATS.has(c)) err(`${w}: bad category ${c}`);
  for (const p of arr(e.places)) if (!places.has(p)) err(`${w}: unknown place ${p}`);
  for (const p of arr(e.people)) if (!people.has(p)) err(`${w}: unknown person ${p}`);
  if (e.conflictId && conflicts.size && !conflicts.has(e.conflictId)) err(`${w}: unknown conflict ${e.conflictId}`);
  if (e.conflictId && !conflicts.size) warn(`${w}: conflict ${e.conflictId} (conflicts.js not filled yet)`);
  if ((e.title || "").length > 70) warn(`${w}: title > 70 chars`);
  if (wc(e.summary) > 30) warn(`${w}: summary ${wc(e.summary)} words (> 30)`);
  if (wc(e.body) > 120) warn(`${w}: body ${wc(e.body)} words (> 120)`);
}
for (const f of arr(M.facts)) { checkSources(`facts ${f.id}`, f.sources); if (f.image) checkImages(`facts ${f.id}`, [f.image]); if (f.eventId && !events.has(f.eventId)) err(`facts ${f.id}: unknown event ${f.eventId}`); }
for (const p of arr(M.places)) { checkSources(`places ${p.id}`, p.sources); checkImages(`places ${p.id}`, p.images); checkImages(`places ${p.id}`, p.sequence); for (const j of arr(p.journeys)) if (!journeys.has(j)) err(`places ${p.id}: unknown journey ${j}`); }
for (const j of arr(M.journeys)) for (const [k, s] of arr(j.stops).entries()) { const w = `journeys ${j.id} stop ${k + 1}`; checkSources(w, s.sources); if (s.place && !places.has(s.place)) err(`${w}: unknown place ${s.place}`); if (s.image) checkImages(w, [s.image]); }
for (const t of arr(M.trees)) { checkSources(`trees ${t.id}`, t.sources); checkImages(`trees ${t.id}`, t.photos); checkImages(`trees ${t.id}`, t.related); }
const qs = arr(M.quiz && M.quiz.questions);
for (const q of qs) { checkSources(`quiz ${q.id}`, q.sources); if (!(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < arr(q.options).length)) err(`quiz ${q.id}: bad answer index`); if (q.eventId && !events.has(q.eventId)) err(`quiz ${q.id}: unknown event ${q.eventId}`); }
for (const c of arr(M.conflicts)) for (const [k, a] of arr(c.accounts).entries()) checkSources(`conflicts ${c.id} account ${k + 1}`, a.sources);
for (const v of arr(M.verified)) for (const [k, n] of arr(v.chain).entries()) { checkSources(`verified ${v.id} node ${k + 1}`, n.sources); if (n.image) checkImages(`verified ${v.id}`, [n.image]); }
if (M.correction) checkSources("correction", M.correction.sources);
for (const r of arr(M.ending && M.ending.rows)) checkSources(`ending row ${r.when}`, r.sources);
for (const ch of arr(M.way && M.way.chapters)) { checkSources(`way ${ch.id}`, ch.sources); checkImages(`way ${ch.id}`, ch.images); }

// 5/6. copy rules on visible strings
const BANNED = ["delve", "tapestry", "testament", "rich history", "vibrant", "nestled", "in conclusion", "pivotal", "crucial", "seamless", "showcase", "underscore", "multifaceted", "groundbreaking", "cutting-edge", "realm", "boasts"];
const SKIP_KEYS = new Set(["todo", "notes", "url", "file", "thumb", "sourceFile", "id"]);
function walk(obj, where, fn, key) {
  if (typeof obj === "string") { if (!SKIP_KEYS.has(key)) fn(obj, where); return; }
  if (Array.isArray(obj)) obj.forEach((v, i) => walk(v, `${where}[${i}]`, fn, key));
  else if (obj && typeof obj === "object") for (const k of Object.keys(obj)) walk(obj[k], `${where}.${k}`, fn, k);
}
function copyRules(s, where, strictDash = true) {
  if (s.includes("—")) err(`${where}: em dash`);
  if (/\w\s?–\s?\w/.test(s)) (strictDash ? err : warn)(`${where}: en dash used as punctuation`);
  if (/[‘’“”]/.test(s)) err(`${where}: curly quote (use straight quotes)`);
  if (/[→←•]/.test(s)) warn(`${where}: arrow or bullet glyph in text`);
  if (/TODO/.test(s)) warn(`${where}: contains TODO in visible text`);
  const low = s.toLowerCase();
  for (const b of BANNED) if (low.includes(b)) warn(`${where}: word "${b}"`);
}
for (const k of Object.keys(M)) if (k !== "transcripts") walk(M[k], `M.${k}`, (s, w) => copyRules(s, w));
walk(M.transcripts, "M.transcripts", (s, w) => { if (s.includes("—")) err(`${w}: em dash`); });
// em dashes in pages + index.html
for (const f of [path.join(SITE, "index.html"), ...fs.readdirSync(path.join(SITE, "js", "pages")).map((x) => path.join(SITE, "js", "pages", x)), ...fs.readdirSync(path.join(SITE, "js", "core")).filter((x) => x.endsWith(".js")).map((x) => path.join(SITE, "js", "core", x))]) {
  const t = fs.readFileSync(f, "utf8"); const rel = path.relative(ROOT, f);
  if (t.includes("—")) err(`${rel}: em dash`);
  if (/[‘’“”]/.test(t)) err(`${rel}: curly quote`);
}
// print folder (physical boards)
const printDir = path.join(ROOT, "print");
if (fs.existsSync(printDir)) for (const f of fs.readdirSync(printDir).filter((x) => /\.(html|js)$/.test(x))) {
  const t = fs.readFileSync(path.join(printDir, f), "utf8");
  if (t.includes("—")) err(`print/${f}: em dash`);
}
// never-show list
const NEVER = [/summer interns?.*raghu|raghu.*summer intern/i, /no corporate involvement/i, /Talon'?s Print/];
// the privacy redaction in Sridhar's transcript must stay in place
if (M.transcripts && M.transcripts["P-SRIDHAR"] && !M.transcripts["P-SRIDHAR"].paras.some((p) => p.includes("[One sentence removed by the team for privacy.]"))) err("transcripts P-SRIDHAR: the privacy redaction marker is missing");
walk(M, "M", (s, w) => { for (const re of NEVER) if (re.test(s) && !w.startsWith("M.transcripts.P-PJN")) err(`${w}: matches never-show rule ${re}`); });

function wc(s) { return (s || "").trim().split(/\s+/).filter(Boolean).length; }

// 7. summary
const evs = arr(M.events);
const count = (f) => evs.reduce((o, e) => { for (const k of [].concat(f(e))) o[k] = (o[k] || 0) + 1; return o; }, {});
console.log(`events: ${evs.length}  by era ${JSON.stringify(count((e) => e.era))}`);
console.log(`        by category ${JSON.stringify(count((e) => e.category))}`);
console.log(`        contested ${evs.filter((e) => e.confidence === "contested").length}, todo ${evs.filter((e) => e.confidence === "todo").length}, featured ${evs.filter((e) => e.featured).length}`);
console.log(`people ${arr(M.people).length}, places ${arr(M.places).length}, journeys ${arr(M.journeys).length}, facts ${arr(M.facts).length}, quiz ${qs.length}, conflicts ${arr(M.conflicts).length}, verified ${arr(M.verified).length}, images ${images.size}, documents ${arr(M.documents).length}, transcripts ${Object.keys(M.transcripts || {}).length}`);
if (warnings.length) { console.log(`\n${warnings.length} warning(s):`); warnings.slice(0, 80).forEach((w) => console.log("  warn  " + w)); if (warnings.length > 80) console.log(`  ... and ${warnings.length - 80} more`); }
if (errors.length) { console.log(`\n${errors.length} error(s):`); errors.forEach((e) => console.log("  ERROR " + e)); process.exit(1); }
console.log("\ncheck passed" + (warnings.length ? " (with warnings)" : ""));
