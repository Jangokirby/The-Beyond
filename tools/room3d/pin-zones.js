#!/usr/bin/env node
/* Puts each combat zone of a case on a place on the scene's map, and writes public/lab/maps/<case>/zones.json.
   A zone named "The pillars" goes on the pillars; "The gate road" at a door; "The stairs" by an exit; a zone with no match gets a spot from its
   grid position. Zones are spread so cards do not sit on top of each other. Uses the maps already made (run after automap or hand-made maps).
     node tools/room3d/pin-zones.js <case-id> [...]       (no ids: every case that has maps)       Add  at: [x, z]  to a zone in the case to place it by hand. */
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..", ".."), maps = path.join(root, "public", "lab", "maps"), LIB = require("../load-cases.js")();
const walk = (o, f) => { if (Array.isArray(o)) o.forEach((x) => walk(x, f)); else if (o && typeof o === "object") { f(o); Object.values(o).forEach((v) => walk(v, f)); } };
const WORDS = [ // [zone-name words, prop ids to look for ("door" = an exit)]
  [/stair|step|door|gate|entrance|exit|arch|passage|corridor|threshold|porch|landing|road|track|path|lane|street/, ["door", "gate_arch", "airlock", "turnstile"]],
  [/pillar|column|colonnade|post/, ["pillar_stone", "temple_column", "bulkhead", "tether_pillar"]], [/wall|rampart|battlement|parapet|barricade|wire|sandbag/, ["castle_wall", "sandbags", "fence", "adobe_wall"]],
  [/water|flood|river|canal|sea|lake|stream|pool|well|harbour|quay|dock|boat|deck/, ["rowboat", "canoe", "well", "life_raft", "bollard", "ship_mast"]],
  [/fire|stove|hearth|forge|furnace|kiln|oven|boiler|engine|reactor/, ["fireplace", "stove", "campfire", "anvil_forge", "brazier", "boiler", "reactor", "hanging_pot"]],
  [/bed|ward|cot|bunk|sickbay|sleep/, ["bed_iron", "bed_double", "cot", "stretcher", "hospital_bed", "capsule_bed", "cryo_pod"]],
  [/table|bar|counter|kitchen|dining|feast|market|stall|shop/, ["table_long", "table_round", "counter", "market_stall", "market_cart_fruit", "shelf_aisle", "neon_stall"]],
  [/altar|chapel|church|sanctuary|shrine|nave|crypt|tomb|grave/, ["altar", "statue", "candelabra", "font_stone", "sarcophagus", "gravestone", "grave_cross", "coffin", "shrine_gate"]],
  [/desk|study|office|library|record|archive|shelf|book/, ["desk", "bookshelf", "filing_cabinet", "cubicle", "computer_desk"]], [/console|control|server|terminal|machine|generator|lab/, ["console", "server_rack", "server_tower", "computer_desk", "holo_table", "generator"]],
  [/tree|wood|forest|thicket|bush|grove|garden/, ["tree_pine", "tree_oak", "bush", "palm", "vine_tree"]], [/crate|store|cellar|stock|cargo|barrel|hold|warehouse|container/, ["crate", "crate_stack", "barrel", "cargo_container", "cargo_crate_sf"]],
  [/hall|room|chamber|floor|centre|center|middle|heart|yard|court|square|ring|hole|pit|clearing/, ["rug", "table_round", "campfire"]]];
const ids = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(maps).filter((d) => fs.existsSync(path.join(maps, d, "index.json")));
let total = 0, sem = 0;
for (const cid of ids) {
  const a = LIB[cid], idxF = path.join(maps, cid, "index.json"); if (!a || !fs.existsSync(idxF)) { console.log(`skip ${cid}: no case or no maps`); continue; }
  const idx = JSON.parse(fs.readFileSync(idxF, "utf8")), out = {};
  for (const [eid, enc] of Object.entries(a.encounters || {})) {
    let scene = null; for (const [sid, s] of Object.entries(a.scenes)) { let hit = false; walk(s, (o) => { if (o.combat === eid) hit = true; }); if (hit && idx[sid]) { scene = sid; break; } }
    if (!scene) continue;
    const pk = JSON.parse(fs.readFileSync(path.join(root, "public", idx[scene].pack), "utf8")), L = pk.layout, zs = enc.zones || [], used = new Set(), pos = {};
    const cols = Math.max(...zs.map((z) => z.col)) + 1, rows = Math.max(...zs.map((z) => z.row)) + 1, M = 1.8, props = L.props || [];
    for (const z of zs) {
      let p = null; total++;
      if (z.at) { pos[z.id] = z.at; continue; }
      const rule = WORDS.find(([re]) => re.test(String(z.name).toLowerCase()));
      if (rule) for (const want of rule[1]) {
        if (want === "door") { const d = (L.doors || []).find((_, i) => !used.has("d" + i)); if (d) { const i = L.doors.indexOf(d); used.add("d" + i); const ix = d.axis === "h" ? 0 : d.x === 0 ? 1.4 : -1.4, iz = d.axis === "h" ? (d.z === 0 ? 1.4 : -1.4) : 0; p = [d.x + ix, d.z + iz]; break; } continue; }
        const q = props.find((pr, i) => pr.t === want && !used.has("p" + i)); if (q) { used.add("p" + props.indexOf(q)); p = [q.x, q.z + 0.9 > L.h - 1 ? q.z - 0.9 : q.z + 0.9]; break; }
      }
      if (p) sem++; else p = [M + (z.col + .5) / cols * (L.w - 2 * M), M + (z.row + .5) / rows * (L.h - 2 * M)];
      pos[z.id] = p;
    }
    /* spread: push apart zones that are too close, keep them inside the room */
    const D = Math.max(2.6, Math.max(L.w, L.h) * 0.2), keys = Object.keys(pos);
    for (let it = 0; it < 60; it++) { let moved = false; for (let i = 0; i < keys.length; i++) for (let j = i + 1; j < keys.length; j++) { const A = pos[keys[i]], B = pos[keys[j]], dx = B[0] - A[0], dz = B[1] - A[1], d = Math.hypot(dx, dz) || 0.01; if (d < D) { const push = (D - d) / 2, ux = d < .02 ? 1 : dx / d, uz = d < .02 ? 0 : dz / d; A[0] -= ux * push; A[1] -= uz * push; B[0] += ux * push; B[1] += uz * push; moved = true; } } for (const k of keys) { pos[k][0] = Math.max(1.2, Math.min(L.w - 1.2, pos[k][0])); pos[k][1] = Math.max(1.2, Math.min(L.h - 1.2, pos[k][1])); } if (!moved) break; }
    out[eid] = Object.fromEntries(keys.map((k) => [k, [Math.round(pos[k][0] * 100) / 100, Math.round(pos[k][1] * 100) / 100]]));
    console.log(`${cid}/${eid} (scene ${scene}): ${keys.length} zones placed`);
  }
  if (Object.keys(out).length) fs.writeFileSync(path.join(maps, cid, "zones.json"), JSON.stringify(out)); else console.log(`${cid}: no encounter in a mapped scene`);
}
console.log(`\n${sem} of ${total} zones matched a prop or door by name; the rest were placed from their grid position.`);
