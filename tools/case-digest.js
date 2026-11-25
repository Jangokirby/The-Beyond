#!/usr/bin/env node
/* Prints the story of a case in one compact page for reading (premise, people, the enemy and its rule, each scene's opening, clues, interview questions, endings),
   without the machinery. Used for the narrative read against the Death of a Bloodline bar.   node tools/case-digest.js <case-id> [...]  */
const L = require("./load-cases.js")();
const txt = (s) => String(s || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
const walk = (o, f) => { if (Array.isArray(o)) o.forEach((x) => walk(x, f)); else if (o && typeof o === "object") { f(o); Object.values(o).forEach((v) => walk(v, f)); } };
for (const id of process.argv.slice(2)) {
  const a = L[id]; if (!a) { console.log("missing", id); continue; }
  console.log(`\n######## ${a.title} (${a.year}, ${a.setting})\n${txt(a.summary)}`);
  console.log("\nOBJECTIVES:"); for (const o of a.objectives || []) console.log(`  [${o.kind}] ${txt(o.t)}${o.benefit ? "  (benefit: " + txt(o.benefit.label) + ")" : ""}`);
  console.log("\nPEOPLE:"); for (const [k, n] of Object.entries(a.npcs || {})) console.log(`  ${n.name}: ${txt(n.tag)}. ${txt(n.look).slice(0, 160)}`);
  console.log("\nENEMIES:"); for (const [k, e] of Object.entries(a.enemies || {})) console.log(`  ${e.build ? e.build.name : k}: ${txt(e.build && (e.build.text || e.build.dies)).slice(0, 420)}`);
  console.log("\nCLUES:"); for (const [k, c] of Object.entries(a.clues || {})) console.log(`  - ${txt(c.t)} [${txt(c.s)}]: ${txt(c.x).slice(0, 260)}`);
  console.log("\nSCENES:");
  for (const [sid, s] of Object.entries(a.scenes || {})) {
    const says = []; walk(s.onEnter, (o) => { if (o.say) says.push(txt(o.say)); });
    console.log(`  * ${s.name} [${sid}]: ${says.slice(0, 2).join(" / ").slice(0, 380)}`);
    const opts = (s.options || []).map((o) => o.label).join(" | "); console.log(`      options: ${opts.slice(0, 300)}`);
    const asks = []; walk(s.options, (o) => { if (o.converse) for (const t of o.converse.topics || []) asks.push(txt(t.ask) + (t.cha ? " (cha)" : "")); }); if (asks.length) console.log(`      asks: ${asks.join(" | ").slice(0, 380)}`);
  }
  const ends = []; walk(a.scenes, (o) => { if (o.end) ends.push(o); }); console.log(`\nENDINGS: ${ends.length} end steps`);
  for (const [sid, s] of Object.entries(a.scenes || {})) if (/end|after|morning|dawn/i.test(sid + s.name)) { const says = []; walk(s.onEnter, (o) => { if (o.say) says.push(txt(o.say)); }); walk(s.options, (o) => { if (o.say) says.push(txt(o.say)); }); console.log(`  [${sid}] ${says.slice(0, 5).join(" / ").slice(0, 700)}`); }
}
