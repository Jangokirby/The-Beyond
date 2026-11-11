/* ============================================================================
   SOFT-LOCK CHECKER for data cases (node tools/softlock.js [caseId...])

   Walks every reachable state of each case: every roll both passing and
   failing, every story choice, every order of options. Reports
     LOCK      a state with nothing to click and no ending
     NO WIN    a state from which no "win" ending can be reached any more
   with the shortest list of actions that leads there. It reads the case data
   only; nothing is played in a browser.
   ========================================================================== */
const fs = require("fs"), path = require("path");
const PUB = path.join(__dirname, "..", "public");
global.document = { addEventListener() {} };
global.window = { ART: { SKIN: Array(10).fill(0), HAIRC: Array(12).fill(0), OUTFIT: Array(14).fill(0) }, ADV: { LIBRARY: {}, register(a) { this.LIBRARY[a.id] = a; } } };
window.PACKS = { define(p) { for (const a of p.cases) window.ADV.register(a); } };
for (const f of ["js/adventures.js", "js/adventures2.js", "js/adventures3.js", "js/casekit.js", "js/modules1.js", "js/modules1b.js", "js/modules1c.js", "js/tutorial.js", ...fs.readdirSync(path.join(PUB, "packs")).filter((f) => f.endsWith(".js")).map((f) => "packs/" + f)])
  { const p = path.join(PUB, f); if (fs.existsSync(p)) eval(fs.readFileSync(p, "utf8")); }
eval(fs.readFileSync(path.join(PUB, "js/rites.js"), "utf8"));
const LIB = window.ADV.LIBRARY;
const arr = (x) => (x == null ? [] : Array.isArray(x) ? x : [x]);

function check(a, opts = {}) {
  const arcAll = opts.arcAll || false;   // assume every arc flag from earlier parts is set (or none)
  const cond = (c, s) => {
    if (c == null) return true;
    if (typeof c === "string") return s.f.has(c);
    if (c.flag) return s.f.has(c.flag);
    if (c.not !== undefined) return !cond(c.not, s);
    if (c.clue) return s.c.has(c.clue);
    if (c.obj) return s.o.has(c.obj);
    if (c.ge || c.lt) return !!c.ge;
    if (c.all) return c.all.every((x) => cond(x, s));
    if (c.any) return c.any.some((x) => cond(x, s));
    if (c.arc) return s.a.has(c.arc) || (arcAll && !s.au.has(c.arc));
    return true;
  };
  const clone = (s) => ({ sc: s.sc, f: new Set(s.f), c: new Set(s.c), o: new Set(s.o), a: new Set(s.a), au: new Set(s.au), end: s.end });
  const key = (s) => [s.sc, s.end || "", [...s.f].sort().join(","), [...s.c].sort().join(","), [...s.o].sort().join(","), [...s.a].sort().join(",")].join("|");
  /* run steps; returns list of resulting states (branching on rolls and choices) */
  const run = (steps, s, depth = 0) => {
    let cur = [s];
    for (const st of arr(steps)) {
      const next = [];
      for (const x of cur) {
        if (x.end || x.moved) { next.push(x); continue; }
        if (st.set) { x.f.add(st.set); next.push(x); }
        else if (st.unset) { x.f.delete(st.unset); next.push(x); }
        else if (st.clue) { x.c.add(st.clue); next.push(x); }
        else if (st.objective) { x.o.add(st.objective); next.push(x); }
        else if (st.arcSet) { x.a.add(st.arcSet); next.push(x); }
        else if (st.arcUnset) { x.a.delete(st.arcUnset); x.au.add(st.arcUnset); next.push(x); }
        else if (st.check || st.group || st.read || st.trap) {
          const c = st.check || st.group || st.read || st.trap;
          next.push(...run(c.ok, clone(x), depth + 1), ...run(c.fail, clone(x), depth + 1));
        } else if (st.combat) {
          const w = run(st.win, clone(x), depth + 1);
          next.push(...w);
          const lost = clone(x); lost.end = "lose"; next.push(lost);
          next.push(clone(x));   // fled: back where you were
        } else if (st.goto) {
          if (!a.scenes[st.goto]) { const b = clone(x); b.end = "BROKEN goto " + st.goto; next.push(b); continue; }
          x.sc = st.goto; x.moved = true;
          const sc = a.scenes[st.goto];
          x.moved = false;
          const r = depth > 30 ? [x] : run(nsEnter(st.goto, sc.onEnter), x, depth + 1);
          for (const y of r) y.moved = true;
          next.push(...r);
        } else if (st.if) next.push(...run(cond(st.if, x) ? st.then : st.else, x, depth + 1));
        else if (st.once) { const k = "once:" + st.once; if (x.f.has(k)) next.push(x); else { x.f.add(k); next.push(...run(st.steps, x, depth + 1)); } }
        else if (st.choice) { const os = st.choice.options.filter((o) => cond(o.if, x)); if (!os.length) next.push(x); for (const o of os) next.push(...run(o.steps, clone(x), depth + 1)); }
        else if (st.converse) {
          /* assume players ask about everything they can, then also the path where they leave at once */
          next.push(clone(x));
          let all = [x];
          for (const t of st.converse.topics || []) all = all.flatMap((y) => (cond(t.if, y) ? run(t.then, y, depth + 1) : [y]));
          next.push(...all);
        }
        else if (st.inc) { x.f.add(st.inc + "+"); next.push(x); }
        else if (st.end) { x.end = st.end; next.push(x); }
        else next.push(x);
      }
      cur = next;
    }
    return cur;
  };
  function nsEnter(id, en) { return (en || []).map((x) => (x && x.once ? { ...x, once: id + ":" + x.once } : x)); }
  const options = (s) => (a.scenes[s.sc].options || []).map((o, i) => ({ o, i })).filter(({ o, i }) => cond(o.if, s) && !(o.once && s.f.has(`opt:${s.sc}:${i}`)));

  let start = { sc: a.start, f: new Set(), c: new Set(), o: new Set(), a: new Set(opts.arcFlags || []), au: new Set(), end: null };
  const init = run(nsEnter(a.start, a.scenes[a.start].onEnter), start);
  const seen = new Map(), queue = [], edges = new Map(), problems = [];
  const add = (s, from, label) => { delete s.moved; const k = key(s); if (seen.has(k)) { edges.get(k).from.push(from); return; } seen.set(k, s); edges.set(k, { from: [from], by: label, prev: from }); queue.push(k); };
  for (const s of init) add(s, null, "start");
  let n = 0;
  while (queue.length && n < (opts.max || +process.env.SL_MAX || 150000)) {
    const k = queue.shift(), s = seen.get(k); n++;
    if (s.end) continue;
    const os = options(s);
    if (!os.length) { problems.push({ kind: "LOCK", k }); if (process.env.SL_DEBUG) console.error("LOCKSTATE", [...s.f].join(","), "|", [...s.o].join(",")); continue; }
    for (const { o, i } of os) {
      const b = clone(s); if (o.once) b.f.add(`opt:${s.sc}:${i}`);
      for (const r of run(o.steps, b)) add(r, k, `${s.sc}: ${o.label}`);
    }
  }
  /* which states can still reach a win? walk backwards from every win */
  const back = new Map(); for (const [k, e] of edges) for (const f of e.from) if (f) { if (!back.has(f)) back.set(f, []); back.get(f).push(k); }
  const canWin = new Set();
  const wins = [...seen].filter(([, s]) => s.end === "win").map(([k]) => k);
  const rev = new Map(); for (const [k, e] of edges) for (const f of e.from) if (f) { if (!rev.has(k)) rev.set(k, []); rev.get(k).push(f); }
  const stack = [...wins]; while (stack.length) { const k = stack.pop(); if (canWin.has(k)) continue; canWin.add(k); for (const p of rev.get(k) || []) stack.push(p); }
  const pathTo = (k) => { const out = []; let cur = k, guard = 0; while (cur && guard++ < 60) { const e = edges.get(cur); out.unshift(e.by); cur = e.prev; } return out; };
  const noWin = [...seen].filter(([k, s]) => !s.end && !canWin.has(k) && seen.get(k));
  /* report the "first" no-win states: those whose parent could still win */
  const firstNoWin = noWin.filter(([k]) => { const p = edges.get(k).prev; return p && canWin.has(p); });
  const broken = [...seen].filter(([, s]) => s.end && String(s.end).startsWith("BROKEN"));
  return { states: seen.size, capped: queue.length > 0, wins: wins.length, locks: problems.map((p) => ({ path: pathTo(p.k), sc: seen.get(p.k).sc })),
    noWin: firstNoWin.map(([k]) => ({ path: pathTo(k), sc: seen.get(k).sc })), broken: broken.map(([k, s]) => s.end) };
}

module.exports = { check, LIB };
if (require.main === module) {
  const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(LIB);
  let bad = 0;
  for (const id of ids) {
    const a = LIB[id];
    for (const arcAll of /"arc"/.test(JSON.stringify(a)) ? [false, true] : [false]) {
      const r = check(a, { arcAll });
      const tag = arcAll ? " (with every earlier arc choice)" : "";
      const issues = r.locks.length + r.noWin.length + r.broken.length + (r.wins ? 0 : 1);
      bad += issues;
      console.log(`${issues ? "PROBLEMS" : "ok      "} ${id}${tag}: ${r.states} states, ${r.wins} winning${r.capped ? " (search capped)" : ""}`);
      if (!r.wins) console.log("   no way to win at all");
      for (const b of r.broken) console.log("   " + b);
      const show = (label, list) => { const seenPaths = new Set(); for (const p of list.slice(0, 40)) { const sig = p.path.at(-1); if (seenPaths.has(sig)) continue; seenPaths.add(sig); console.log(`   ${label} in ${p.sc} after: ${p.path.slice(1).join(" > ")}`); if (seenPaths.size >= 4) break; } };
      show("LOCK  ", r.locks); show("NO WIN", r.noWin);
    }
  }
  process.exit(bad ? 1 : 0);
}
