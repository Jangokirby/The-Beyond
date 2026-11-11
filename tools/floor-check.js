/* FLOOR CHECK: measures each case against the Death of a Bloodline floor (node tools/floor-check.js [id...]).
   Not a quality judgement, a minimum: real investigation, a unique enemy, people worth interviewing,
   more than one way to solve it, and endings that depend on how well it went. */
const fs = require("fs"), path = require("path");
const PUB = path.join(__dirname, "..", "public");
global.document = { addEventListener() {} };
global.window = { ART: { SKIN: Array(10).fill(0), HAIRC: Array(12).fill(0), OUTFIT: Array(14).fill(0) }, ADV: { LIBRARY: {}, register(a) { this.LIBRARY[a.id] = a; } } };
window.PACKS = { define(p) { for (const a of p.cases) window.ADV.register(a); } };
const files = ["js/casekit.js", "js/adventures.js", "js/adventures2.js", "js/adventures3.js", "js/modules1.js", "js/modules1b.js", "js/modules1c.js", "js/modules2.js", "js/modules3.js", "js/modules4.js", "js/modules5.js", "js/tutorial.js", ...fs.readdirSync(path.join(PUB, "packs")).filter((f) => f.endsWith(".js")).map((f) => "packs/" + f)];
for (const f of files) { const p = path.join(PUB, f); if (fs.existsSync(p)) eval(fs.readFileSync(p, "utf8")); }
const LIB = window.ADV.LIBRARY;
const walk = (o, f) => { if (Array.isArray(o)) o.forEach((x) => walk(x, f)); else if (o && typeof o === "object") { f(o); Object.values(o).forEach((v) => walk(v, f)); } };
const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(LIB);
let bad = 0;
for (const id of ids) {
  const a = LIB[id]; if (!a) { console.log("missing", id); continue; }
  const n = { search: 0, interview: 0, limited: 0, cha: 0, combat: 0, ends: new Set(), res: new Set(), size: JSON.stringify(a).length, groups: 0 };
  walk(a.scenes, (o) => {
    if (o.check && o.check.investigate) n.search++;
    if (o.converse) { n.interview++; if (o.converse.limit) n.limited++; for (const t of o.converse.topics || []) if (t.cha) n.cha++; }
    if (o.combat) n.combat++;
    if (o.set && typeof o.set === "string" && o.set.startsWith("res_")) n.res.add(o.set);
    if (o.end) n.ends.add(o.end);
  });
  const prim = a.objectives.filter((o) => o.kind === "primary"), sec = a.objectives.filter((o) => o.kind === "secondary"), ben = sec.filter((o) => o.benefit);
  const uniq = Object.values(a.enemies || {}).filter((e) => e.build && e.build.text).length;
  const tiers = (JSON.stringify(a.scenes).match(/"if":\{"flag":"res_|"if":"res_|"if":\{"ge":|"if":\{"obj":/g) || []).length;
  const probs = [];
  if (Object.keys(a.clues).length < 6) probs.push(`clues ${Object.keys(a.clues).length} < 6`);
  if (prim.length < 2) probs.push("fewer than 2 primary objectives");
  if (sec.length < 2 || ben.length < 2) probs.push(`secondary ${sec.length}, with a benefit ${ben.length} (need 2+)`);
  if (n.search < 5) probs.push(`searches ${n.search} < 5`);
  if (n.limited < 1 || n.cha < 1) probs.push("no Charisma-limited interview with extra topics");
  if (n.res.size < 2) probs.push(`ways to solve it ${n.res.size} < 2 (set flags res_*)`);
  if (!uniq) probs.push("no enemy with its own rules (build.text)");
  if (tiers < 3) probs.push("endings do not depend on how it went");
  if (n.size < 17000) probs.push(`size ${(n.size / 1000).toFixed(0)} KB (the floor is the DoB scale; aim for 17 KB+)`);
  /* a limited interview must not hide what the case needs: topics that set a flag or clue used in an if must be free (or Charisma extras) */
  const used = new Set(); const grab = (c) => { if (c == null) return; if (typeof c === "string") used.add(c); else if (c.flag) used.add(c.flag); else if (c.clue) used.add("clue:" + c.clue); else if (c.obj) used.add("obj:" + c.obj); else if (c.not !== undefined) grab(c.not); else if (c.all) c.all.forEach(grab); else if (c.any) c.any.forEach(grab); };
  walk(a.scenes, (o) => { if (o.if !== undefined) grab(o.if); });
  walk(a.scenes, (o) => { if (o.converse && o.converse.limit) for (const t of o.converse.topics || []) { if (t.free || t.cha) continue; const gives = []; walk(t.then || [], (x) => { if (typeof x.set === "string") gives.push(x.set); if (x.clue) gives.push("clue:" + x.clue); }); const g = gives.filter((x) => used.has(x)); if (g.length) probs.push(`limited interview "${t.ask}" gates ${g.join(", ")}: make it free:true`); } });
  console.log((probs.length ? "BELOW " : "ok    ") + id.padEnd(24), `${(n.size / 1000).toFixed(0)}KB clues ${Object.keys(a.clues).length} search ${n.search} interviews ${n.interview} (limited ${n.limited}, cha ${n.cha}) combat ${n.combat} ways ${n.res.size} benefits ${ben.length}`);
  for (const p of probs) console.log("        - " + p);
  if (probs.length) bad++;
}
console.log(bad ? `${bad} case(s) below the floor` : "all cases meet the floor");
process.exit(bad ? 1 : 0);
