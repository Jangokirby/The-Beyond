/* AUTO-MAP: plans a room for a scene of a written case, with no AI.
   Input (a "spec"): { id, name, theme, text, cast:[npcIds], npcs:{id:name}, options:[{label, kind:"talk"|"find"|"go"|"other", npc, goto}] }
   It picks a preset from the scene's words, sizes the room from how much happens in it, puts a door for every way out,
   places the people, and puts a spot for every option (talk at the person, find at a fitting piece, go at the door). */
import { CATALOG, render } from "./kit.js"; import { PRESETS, furnish, blank } from "./gen.js";
const RULES = [[/\b(ward|hospital|infirmary|clinic|sick|nurse)\b/, "ward"], [/\b(cellar|crypt|vault|basement|store|dock|tunnel|mine|cave|shelter|hold|engine room)\b/, "cellar"], [/\b(tavern|inn\b|bar\b|pub|caf[eé]|club|saloon|noodle|stall|stage|cabaret)\b/, "tavern"],
  [/\b(chapel|church|abbey|cathedral|shrine|temple|altar|hut|vestry)\b/, "chapel"], [/\b(office|record|archive|study|library|desk|studio|lab|institute|monitor|workshop|lathe|engineer|bridge|cabin|room|plan|desk)\b/, "study"],
  [/\b(canteen|mess|kitchen|hall|lobby|dining|refectory|station|platform|market)\b/, "canteen"], [/\b(bedroom|flat|apartment|house|home|cell|guest|bunk|bed)\b/, "bedroom"]];
const SIZE = { ward: [20, 12], tavern: [16, 11], study: [12, 9], cellar: [14, 10], canteen: [18, 11], bedroom: [10, 8], chapel: [14, 10] };
const PIECE = [[/bed|bunk|cot|sleep|pillow/, ["bed_iron", "bed_double", "cot"]], [/register|ledger|file|record|paper|log|note|desk|report|graph|book|read|document|letter/, ["desk", "bookshelf", "filing_cabinet"]], [/stove|fire|ash|burn|hearth/, ["stove", "fireplace"]],
  [/lamp|light|candle|dark/, ["lamp_table", "lamp_floor", "candle"]], [/crate|box|supply|supplies|kit|medical/, ["crate", "crate_med", "crate_stack"]], [/barrel|cask|drink|wine|beer/, ["barrel"]], [/shelf|shelves|bookcase|archive/, ["bookshelf"]],
  [/gramophone|music|song|record player|phonograph/, ["gramophone"]], [/table|map|plan|tea|meal/, ["table_long", "table_round", "desk"]], [/sink|wash|water/, ["sink"]], [/locker|cabinet|cupboard|wardrobe|drawer/, ["cabinet", "locker", "wardrobe", "filing_cabinet"]]];
const hash = (s) => { let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const fp = (p) => { const d = CATALOG[p.t]; if (!d) return null; const sw = (p.rot || 0) % 180 ? d.size[1] : d.size[0], sd = (p.rot || 0) % 180 ? d.size[0] : d.size[1]; return { x: p.x - sw / 2, z: p.z - sd / 2, w: sw, h: sd }; };
export function planScene(spec, seed = 1) {
  const text = `${spec.name} ${spec.theme || ""} ${spec.text || ""}`.toLowerCase();
  let key = (RULES.find(([re]) => re.test(`${spec.name} ${spec.theme || ""}`.toLowerCase())) || RULES.find(([re]) => re.test(text.slice(0, 220))) || [0, spec.theme === "cellar" ? "cellar" : spec.theme === "church" ? "chapel" : "study"])[1];
  if (key === "chapel" && !PRESETS.chapel) key = "study";
  const nOpt = (spec.options || []).length, gotos = [...new Set((spec.options || []).filter((o) => o.goto).map((o) => o.goto))];
  let [w, h] = SIZE[key] || [12, 9]; if (nOpt > 7) { w += 3; h += 2; } if (gotos.length > 3) w += 2;
  const L = furnish(blank(w, h, spec.name), key, hash(spec.id + seed) % 997 + 3);
  /* a door for each way out, spread round the walls */
  const SLOTS = [{ x: w / 2, z: h, axis: "h", dx: 0, dz: -.9 }, { x: 0, z: h / 2, axis: "v", dx: .9, dz: 0 }, { x: w, z: h / 2, axis: "v", dx: -.9, dz: 0 }, { x: w * .22, z: h, axis: "h", dx: 0, dz: -.9 }, { x: w * .78, z: h, axis: "h", dx: 0, dz: -.9 }, { x: w * .3, z: 0, axis: "h", dx: 0, dz: .9 }, { x: w * .7, z: 0, axis: "h", dx: 0, dz: .9 }];
  const use = SLOTS.slice(0, Math.max(1, gotos.length)); L.doors = use.map((s) => ({ x: s.x, z: s.z, w: 1.5, axis: s.axis }));
  L.props = L.props.filter((p) => !use.some((s) => Math.hypot(p.x - (s.x + s.dx * 1.4), p.z - (s.z + s.dz * 1.4)) < 1.8));
  L.windows = [{ x: w * .3, z: 0, w: 1.3, axis: "h" }, { x: w * .7, z: 0, w: 1.3, axis: "h" }].filter((x) => !use.some((s) => s.z === 0 && Math.abs(s.x - x.x) < 1.6));
  const foots = () => L.props.filter((p) => CATALOG[p.t] && CATALOG[p.t].block).map(fp).filter(Boolean);
  const taken = [];
  const free = (tx, tz) => { let best = null, bd = 1e9; const F = foots(); for (let x = 1; x <= w - 1; x += .5) for (let z = 1; z <= h - 1; z += .5) { if (F.some((r) => x > r.x - .6 && x < r.x + r.w + .6 && z > r.z - .6 && z < r.z + r.h + .6)) continue; if (taken.some((t) => Math.hypot(t[0] - x, t[1] - z) < 1.1)) continue; if (use.some((s) => Math.hypot(x - s.x, z - s.z) < 1.3)) continue; const d = Math.hypot(x - tx, z - tz); if (d < bd) { bd = d; best = [x, z]; } } return best || [w / 2, h / 2]; };
  const out = { start: null, npcs: {}, spots: {} };
  out.start = free(w / 2, h - 2); taken.push(out.start);
  const people = [...new Set([...(spec.options || []).filter((o) => o.npc).map((o) => o.npc), ...(spec.cast || [])])];
  people.forEach((id, i) => { const p = free(w * (.3 + .4 * ((i + (hash(spec.id) % 3)) % 3) / 2), h * (.35 + .12 * (i % 2))); out.npcs[id] = p; taken.push(p); });
  const doorFor = new Map(gotos.map((g, i) => [g, use[i % use.length]])); const usedProps = new Set();
  for (const o of spec.options || []) {
    let p = null;
    if (o.kind === "talk" && o.npc && out.npcs[o.npc]) p = out.npcs[o.npc];
    else if (o.goto && doorFor.get(o.goto)) { const d = doorFor.get(o.goto); p = [d.x + d.dx * .9, d.z + d.dz * .9]; }
    else if (o.kind === "find" || o.kind === "other") {
      const lab = o.label.toLowerCase(); const want = (PIECE.find(([re]) => re.test(lab)) || [0, null])[1];
      let cand = L.props.filter((q) => CATALOG[q.t] && CATALOG[q.t].block && !usedProps.has(q) && (!want || want.includes(q.t)));
      if (!cand.length) cand = L.props.filter((q) => CATALOG[q.t] && CATALOG[q.t].block && !usedProps.has(q));
      const q = cand[hash(spec.id + o.label) % Math.max(1, cand.length)];
      if (q) { usedProps.add(q); const d = CATALOG[q.t].size; const ox = w / 2 - q.x, oz = h / 2 - q.z, n = Math.hypot(ox, oz) || 1; p = free(q.x + ox / n * (Math.max(d[0], d[1]) / 2 + .9), q.z + oz / n * (Math.max(d[0], d[1]) / 2 + .9)); }
    }
    if (!p) p = free(w * (.2 + (hash(o.label) % 60) / 100), h * (.3 + (hash(o.label + "z") % 40) / 100));
    out.spots[o.label] = p; if (o.kind !== "talk" && !o.goto) taken.push(p);
  }
  L.npcs = []; L.start = out.start; return { layout: L, map: out, preset: key };
}
export async function buildPack(spec, seed) {
  const plan = planScene(spec, seed), c = document.createElement("canvas"), r = render(plan.layout, c);
  return { plan, pack: { format: "beyond-map-1", layout: plan.layout, view: r.view, collide: r.collide, foot: r.foot, lights: r.lights, exits: r.exits, image: c.toDataURL("image/jpeg", .82) } };
}
