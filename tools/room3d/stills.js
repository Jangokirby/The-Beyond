#!/usr/bin/env node
/* Eye-level stills of rooms, for repainting with an image tool: a colour picture and a matching depth picture for each of the four walls,
   plus where the marks (examine spots, doors, people) fall on each picture.
     node tools/room3d/stills.js <out-folder> <case/scene> [<case/scene> ...]      e.g.  stills.js stills tutorial/hall tutorial/cellar
   Writes <out>/<case>-<scene>/{north,east,south,west}-color.png, -depth.png and views.json. Uses the maps already made for the case.      */
const { chromium } = require("playwright"), { spawn } = require("child_process"), fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..", ".."), [outDir, ...jobs] = process.argv.slice(2);
if (!outDir || !jobs.length) { console.error("usage: stills.js <out-folder> <case/scene> ..."); process.exit(1); }
(async () => {
  const port = 9100 + (process.pid % 800), srv = spawn("node", ["server.js"], { cwd: root, env: { ...process.env, PORT: String(port) } }); await new Promise((r) => setTimeout(r, 1500));
  const b = await chromium.launch({ args: require("./gpu.js")() }), p = await b.newPage({ viewport: { width: 1000, height: 700 } });
  await p.goto(`http://localhost:${port}/lab/stills.html`); await p.waitForFunction(() => window.READY, null, { timeout: 60000 });
  for (const job of jobs) {
    const [cid, sid] = job.split("/"), idx = JSON.parse(fs.readFileSync(path.join(root, "public/lab/maps", cid, "index.json"), "utf8"))[sid]; if (!idx) { console.log("no map for " + job); continue; }
    const pk = JSON.parse(fs.readFileSync(path.join(root, "public", idx.pack), "utf8")), spots = { ...(idx.spots || {}) };
    const views = await p.evaluate(([L, S]) => window.STILLS(L, S), [pk.layout, spots]), d = path.join(outDir, `${cid}-${sid}`); fs.mkdirSync(d, { recursive: true });
    for (const v of views) { fs.writeFileSync(path.join(d, `${v.face}-color.png`), Buffer.from(v.color.split(",")[1], "base64")); fs.writeFileSync(path.join(d, `${v.face}-depth.png`), Buffer.from(v.depth.split(",")[1], "base64")); }
    fs.writeFileSync(path.join(d, "views.json"), JSON.stringify({ room: pk.layout.name, size_m: [pk.layout.w, pk.layout.h], eye_height_m: 1.55, fov_deg: 72, views: views.map((v) => ({ face: v.face, marks: v.marks })) }, null, 1)); console.log(`${job}: 4 views -> ${d}`);
  }
  await b.close(); srv.kill();
})();
