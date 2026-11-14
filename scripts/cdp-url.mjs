#!/usr/bin/env node
// cdp.mjs: drive headless Chrome in real time (animations run), evaluate JS, take screenshots. No dependencies (Node 22).
// Usage: node scripts/cdp.mjs '<hash route>' out.png [--size 1920x1080] [--wait 2500] [--eval "js"] [--steps file.json] [--reduce]
//   --steps: JSON array of {wait: ms} | {eval: "js"} | {shot: "file.png"} | {click: "css selector"} | {key: "ArrowRight"}
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const route = args[0] || "#/start", out = args[1] || "shot.png";
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const [W, H] = opt("--size", "1920x1080").split("x").map(Number);
const wait = +opt("--wait", "2500");
const evalJs = opt("--eval", null);
const stepsFile = opt("--steps", null);
const query = opt("--query", "");
const reduce = args.includes("--reduce");

const port = 9300 + Math.floor(Math.random() * 500);
fs.mkdirSync(path.join(ROOT, "qa"), { recursive: true });
const userDir = fs.mkdtempSync(path.join(ROOT, "qa", ".cdp-"));
const chrome = spawn("google-chrome", ["--headless=new", "--disable-gpu", "--no-sandbox", "--hide-scrollbars", `--remote-debugging-port=${port}`, `--user-data-dir=${userDir}`,
  `--window-size=${W},${H}`, ...(reduce ? ["--force-prefers-reduced-motion"] : []), "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getWs() {
  for (let i = 0; i < 60; i++) {
    try { const r = await fetch(`http://127.0.0.1:${port}/json/list`); const j = await r.json(); const p = j.find((x) => x.type === "page"); if (p) return p.webSocketDebuggerUrl; } catch (e) { /* not up yet */ }
    await sleep(150);
  }
  throw new Error("chrome did not start");
}

const ws = new WebSocket(await getWs());
await new Promise((r) => ws.addEventListener("open", r));
let id = 0; const pending = new Map(); const logs = [];
ws.addEventListener("message", (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); }
  if (d.method === "Runtime.consoleAPICalled") logs.push(`[console.${d.params.type}] ` + d.params.args.map((a) => a.value ?? a.description).join(" "));
  if (d.method === "Runtime.exceptionThrown") logs.push("[exception] " + (d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text));
});
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const evaluate = async (expr) => { const r = await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true }); return r.result?.result?.value ?? r.result?.exceptionDetails?.exception?.description; };
const shot = async (file) => { const r = await send("Page.captureScreenshot", { format: "png" }); fs.writeFileSync(file, Buffer.from(r.result.data, "base64")); };

await send("Runtime.enable"); await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: W < 700 });
await send("Page.navigate", { url: route });
await sleep(wait);
if (stepsFile) {
  for (const s of JSON.parse(fs.readFileSync(stepsFile, "utf8"))) {
    if (s.wait) await sleep(s.wait);
    if (s.eval) console.log("eval:", JSON.stringify(await evaluate(s.eval)));
    if (s.click) await evaluate(`document.querySelector(${JSON.stringify(s.click)}).click()`);
    if (s.key) { await send("Input.dispatchKeyEvent", { type: "keyDown", key: s.key, code: s.key }); await send("Input.dispatchKeyEvent", { type: "keyUp", key: s.key, code: s.key }); }
    if (s.wheel) { await send("Input.dispatchMouseEvent", { type: "mouseWheel", x: s.wheel.x, y: s.wheel.y, deltaX: 0, deltaY: s.wheel.dy }); }
    if (s.shot) await shot(s.shot);
  }
}
if (evalJs) console.log("eval:", JSON.stringify(await evaluate(evalJs)));
await shot(out);
if (logs.length) console.log(logs.slice(0, 30).join("\n"));
ws.close(); chrome.kill();
setTimeout(() => { try { fs.rmSync(userDir, { recursive: true, force: true }); } catch (e) { /* chrome still closing */ } }, 400);
