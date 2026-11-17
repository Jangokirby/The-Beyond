/* Makes a map for every scene of a written case, automatically (no AI, no cost once it runs).
     node tools/room3d/automap.js <case-id> [<case-id> ...]      or      node tools/room3d/automap.js --all-missing
   Writes public/lab/maps/<case>/<scene>.beyondmap and public/lab/maps/<case>/index.json (which the game reads).
   Then open the Map Builder to tidy any room by hand. */
const { chromium } = require("playwright"); const { spawn } = require("child_process"); const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..", ".."), lib = require("../load-cases.js")();
const ids = process.argv.slice(2).filter((x) => !x.startsWith("--")), all = process.argv.includes("--all-missing");
const want = all ? Object.keys(lib).filter((k) => !fs.existsSync(path.join(root, "public/lab/maps", k, "index.json")) && k !== "tutorial") : ids;
const spec = (a, id) => { const sc = a.scenes[id], opts = (sc.options || []).map((o) => { const js = JSON.stringify(o.steps || []); const conv = js.match(/"converse":\{"npc":"(\w+)"/), go = Array.isArray(o.steps) && o.steps.length === 1 && o.steps[0].goto ? o.steps[0].goto : (o.steps || []).filter((s) => s.goto).length && !js.includes('"check"') && !js.includes('"combat"') ? (o.steps.find((s) => s.goto) || {}).goto : null;
  return { label: o.label, kind: conv ? "talk" : go ? "go" : js.includes('"check"') ? "find" : "other", npc: conv && conv[1], goto: go || undefined }; });
  const txt = JSON.stringify(sc.onEnter || []).replace(/"(say|text)":"([^"]*)"/g, " $2 ").replace(/[{}\[\]"]/g, " ").slice(0, 500);
  return { id, name: sc.name, theme: sc.theme, text: txt, cast: sc.cast || [], npcs: Object.fromEntries(Object.entries(a.npcs || {}).map(([k, v]) => [k, v.name])), options: opts }; };
(async () => {
  if (!want.length) return console.log("Nothing to do.");
  const srv = spawn("node", ["server.js"], { cwd: root, env: { ...process.env, PORT: "8767" } }); await new Promise((r) => setTimeout(r, 1500));
  const b = await chromium.launch({ args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] }), p = await b.newPage({ viewport: { width: 1700, height: 1300 } });
  await p.goto("http://localhost:8767/lab/auto.html"); await p.waitForFunction(() => window.READY);
  for (const cid of want) {
    const a = lib[cid]; if (!a) { console.log("no such case:", cid); continue; }
    const dir = path.join(root, "public/lab/maps", cid); fs.mkdirSync(dir, { recursive: true }); const index = {};
    for (const sid of Object.keys(a.scenes)) {
      const r = await p.evaluate(([s]) => window.AUTO(s).then((x) => ({ plan: x.plan.map, preset: x.plan.preset, pack: x.pack })), [spec(a, sid)]);
      fs.writeFileSync(path.join(dir, sid + ".beyondmap"), JSON.stringify(r.pack));
      index[sid] = { pack: `lab/maps/${cid}/${sid}.beyondmap`, start: r.plan.start, npcs: r.plan.npcs, spots: r.plan.spots };
      process.stdout.write(`${cid}/${sid} (${r.preset}) `);
    }
    fs.writeFileSync(path.join(dir, "index.json"), JSON.stringify(index)); console.log("\n" + cid + ": " + Object.keys(index).length + " maps");
  }
  const caseIds = fs.readdirSync(path.join(root, "public/lab/maps")).filter((d) => fs.existsSync(path.join(root, "public/lab/maps", d, "index.json")));
  fs.writeFileSync(path.join(root, "public/lab/maps/index.json"), JSON.stringify(caseIds));
  await b.close(); srv.kill();
})();
