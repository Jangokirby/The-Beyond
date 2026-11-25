#!/usr/bin/env node
/* Finds progress locked behind a persuasive agent: a flag that is set ONLY by a Charisma-gated question ("cha": N, not "free") and is then needed
   (an "if" on an option) to go somewhere or to reach an objective. The case standard says questions the case needs must be free.
   node tools/gate-check.js [case-id ...]      */
const LIB = require("./load-cases.js")();
const walk = (o, f, parent) => { if (Array.isArray(o)) o.forEach((x) => walk(x, f, parent)); else if (o && typeof o === "object") { f(o, parent); for (const [k, v] of Object.entries(o)) walk(v, f, o); } };
const flagsIn = (c) => { const out = new Set(); const grab = (v) => { if (typeof v === "string") out.add(v); else if (v && typeof v === "object") { if (v.not) grab(v.not); if (v.all) v.all.forEach(grab); if (v.any) v.any.forEach(grab); if (v.flag) grab(v.flag); } }; grab(c); return out; };
let bad = 0; const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(LIB);
for (const id of ids) {
  const a = LIB[id]; if (!a) continue; const setBy = {}; // flag -> { gated: n, open: n }
  const mark = (f, gated, where) => { (setBy[f] = setBy[f] || { gated: 0, open: 0, where: [] })[gated ? "gated" : "open"]++; if (gated) setBy[f].where.push(where); };
  walk(a.scenes, (o) => {
    if (o.converse) for (const t of o.converse.topics || []) { const gated = !!t.cha && !t.free; walk(t.then || [], (x) => { if (x.set) mark(x.set, gated, `"${t.ask}" (cha ${t.cha})`); }); }
  });
  /* every other place a flag can be set counts as an open way */
  walk(a.scenes, (o, parent) => { if (o.set && typeof o.set === "string" && !(parent && parent.ask && parent.cha && !parent.free)) { /* counted below */ } });
  const openSet = new Set(); const scan = (node, inGatedTopic) => { if (Array.isArray(node)) node.forEach((x) => scan(x, inGatedTopic)); else if (node && typeof node === "object") { const g = inGatedTopic || (node.ask !== undefined && !!node.cha && !node.free); if (node.set && typeof node.set === "string" && !g) openSet.add(node.set); for (const v of Object.values(node)) scan(v, g); } };
  scan(a.scenes, false);
  const needed = new Set(); walk(a.scenes, (o) => { if (o.label && o.if !== undefined && (o.steps || []).some((s) => s && s.goto)) flagsIn(o.if).forEach((f) => needed.add(f)); });
  for (const [f, v] of Object.entries(setBy)) if (v.gated && !openSet.has(f) && needed.has(f)) { bad++; console.log(`LOCKED BEHIND CHARISMA  ${id}: flag "${f}" opens a way forward but is only set by ${v.where.join(", ")}`); }
}
console.log(bad ? `\n${bad} gate(s) found` : "no progress is locked behind a Charisma-gated question");
process.exit(bad ? 1 : 0);
