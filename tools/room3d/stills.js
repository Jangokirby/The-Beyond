#!/usr/bin/env node
/* Eye-level stills of rooms, for repainting with an image tool: a colour picture and a matching depth picture for each of the four walls,
   plus where the marks (examine spots, doors, people) fall on each picture.
     node tools/room3d/stills.js <out-folder> <case/scene> [<case/scene> ...]      e.g.  stills.js stills tutorial/hall tutorial/cellar
   Writes <out>/<case>-<scene>/{north,east,south,west}-color.png, -depth.png and views.json and room.json (description + what is on each wall). Uses the maps already made for the case.      */
const { chromium } = require("playwright"), { spawn } = require("child_process"), fs = require("fs"), path = require("path");
const lib = require("../load-cases.js")(), root = path.join(__dirname, "..", ".."), [outDir, ...jobs] = process.argv.slice(2);
if (!outDir || !jobs.length) { console.error("usage: stills.js <out-folder> <case/scene> ..."); process.exit(1); }

/* room.json: a plain description of the room (no people, no style words) and what stands on each wall, for the repaint tool's prompt. */
const MAT = { brick: "brick", concrete: "bare concrete", plaster: "plastered", wood: "timber-panelled" }, FLOOR = { stone: "flagstone", tile: "tiled", wood: "wooden plank" }, LIGHT = { day: "daylight", dim: "dim light", night: "night-time darkness with small pools of light" };
const KEYS = [[/gas ?light|gas lamp/i, "gas lamps"], [/oil lamp|lantern/i, "oil lamps"], [/candle/i, "candles"], [/fluorescent|strip light/i, "fluorescent tubes"], [/damp|mould|mildew/i, "damp patches on the walls"], [/dust/i, "a layer of dust"], [/peeling|wallpaper/i, "peeling wallpaper"], [/marble/i, "marble"], [/tiles?\b/i, "tiling"], [/linoleum|lino/i, "linoleum"], [/iron/i, "ironwork"], [/radiator/i, "a radiator"], [/telephone|phone/i, "a telephone"], [/typewriter/i, "a typewriter"], [/radio|wireless/i, "a radio set"], [/curtain/i, "curtains"], [/portrait|painting/i, "framed paintings"]];
const caseText = (cid, sid) => { const sc = (((lib[cid] || {}).scenes || {})[sid]) || {}; return { name: sc.name || "", text: JSON.stringify(sc.onEnter || []).replace(/"(say|text)":"([^"]*)"/g, " $2 ").replace(/[{}\[\]"]/g, " ") + " " + (sc.name || ""), year: (lib[cid] || {}).year }; };
const describe = (L, ww, ct) => {
  const st = L.style || {}, parts = [], extra = KEYS.filter(([re]) => re.test(ct.text)).map((k) => k[1]).slice(0, 3);
  if (st.outdoor) parts.push(`An outdoor space${ct.year ? " around " + ct.year : ""}, ${LIGHT[st.mood] || "even light"}, ${/stone|brick|wood/.test(st.wall) ? (MAT[st.wall] || st.wall) + " structures" : "open ground"} at the edges`);
  else parts.push(`${ct.name ? ct.name + ": a " : "A "}room${ct.year ? " of about " + ct.year : ""} with ${MAT[st.wall] || st.wall || "plain"} walls and a ${FLOOR[st.floor] || st.floor || "plain"} floor, ${LIGHT[st.mood] || "even light"}`);
  const fit = ww.lights.length ? `lit by ${ww.lights.join(" and ")}` : "";
  if (fit) parts.push(fit); if (ww.rug) parts.push("a worn rug on the floor");
  const main = [...new Set(Object.values(ww.walls).flatMap((s) => s.split(", ")).filter((x) => x !== "bare wall" && !ww.lights.includes(x) && !/door|window/.test(x)))].slice(0, 4); if (main.length) parts.push("with " + main.join(", "));
  if (extra.length) parts.push("showing " + extra.join(", "));
  let t = parts.join(", ").replace(/ ,/g, ",").replace(/,+/g, ",").replace(/\s+/g, " ") + "."; const w = t.split(" "); if (w.length > 50) t = w.slice(0, 50).join(" ").replace(/[,;:]$/, "") + ".";
  return t;
};
(async () => {
  const port = 9100 + (process.pid % 800), srv = spawn("node", ["server.js"], { cwd: root, env: { ...process.env, PORT: String(port) } }); await new Promise((r) => setTimeout(r, 1500));
  const b = await chromium.launch({ args: require("./gpu.js")() }), p = await b.newPage({ viewport: { width: 1000, height: 700 } });
  await p.goto(`http://localhost:${port}/lab/stills.html`); await p.waitForFunction(() => window.READY, null, { timeout: 60000 });
  for (const job of jobs) {
    const [cid, sid] = job.split("/"), idx = JSON.parse(fs.readFileSync(path.join(root, "public/lab/maps", cid, "index.json"), "utf8"))[sid]; if (!idx) { console.log("no map for " + job); continue; }
    const pk = JSON.parse(fs.readFileSync(path.join(root, "public", idx.pack), "utf8")), spots = { ...(idx.spots || {}) };
    const views = await p.evaluate(([L, S]) => window.STILLS(L, S), [pk.layout, spots]), d = path.join(outDir, `${cid}-${sid}`); fs.mkdirSync(d, { recursive: true });
    for (const v of views) { fs.writeFileSync(path.join(d, `${v.face}-color.png`), Buffer.from(v.color.split(",")[1], "base64")); fs.writeFileSync(path.join(d, `${v.face}-depth.png`), Buffer.from(v.depth.split(",")[1], "base64")); }
    fs.writeFileSync(path.join(d, "views.json"), JSON.stringify({ room: pk.layout.name, size_m: [pk.layout.w, pk.layout.h], eye_height_m: 1.55, fov_deg: 72, views: views.map((v) => ({ face: v.face, marks: v.marks })) }, null, 1)); const ww = await p.evaluate((L) => window.WALLS(L), pk.layout); fs.writeFileSync(path.join(d, "room.json"), JSON.stringify({ description: describe(pk.layout, ww, caseText(cid, sid)), walls: ww.walls }, null, 1));
    console.log(`${job}: 4 views -> ${d}`);
  }
  await b.close(); srv.kill();
})();
