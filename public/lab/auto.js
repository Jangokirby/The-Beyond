/* AUTO-MAP: plans a room for a scene of a written case, with no AI.
   Input (a "spec"): { id, name, theme, text, cast:[npcIds], npcs:{id:name}, options:[{label, kind:"talk"|"find"|"go"|"other", npc, goto}] }
   It picks a preset from the scene's words, sizes the room from how much happens in it, puts a door for every way out,
   places the people, and puts a spot for every option (talk at the person, find at a fitting piece, go at the door). */
import { CATALOG, render, loadPieces, prepare } from "./kit.js"; import { PRESETS, furnish, blank } from "./gen.js";
const RULES = [[/\b(ward|hospital|infirmary|clinic|sick|nurse)\b/, "ward"], [/\b(cellar|crypt|vault|basement|store|dock|tunnel|mine|cave|shelter|hold|engine room)\b/, "cellar"], [/\b(tavern|inn\b|bar\b|pub|caf[eé]|club|saloon|noodle|stall|stage|cabaret)\b/, "tavern"],
  [/\b(chapel|church|abbey|cathedral|shrine|temple|altar|hut|vestry)\b/, "chapel"], [/\b(office|record|archive|study|library|desk|studio|lab|institute|monitor|workshop|lathe|engineer|bridge|cabin|room|plan|desk)\b/, "study"],
  [/\b(canteen|mess|kitchen|hall|lobby|dining|refectory|station|platform|market)\b/, "canteen"], [/\b(bedroom|flat|apartment|house|home|cell|guest|bunk|bed)\b/, "bedroom"]];
const OUTRULES = [[/\b(cemetery|graveyard|churchyard|burial|tombs?)\b/, "graveyard"], [/\b(harbou?r|dock|docks|pier|wharf|quay|beach|shore|deck|ship|boat|schooner|reef|convoy|sea)\b/, "harbour"], [/\b(trench|no man|wire|sap|front line)\b/, "trench"], [/\b(snow|snowy|ice|glacier|arctic|antarctic)\b/, "snowfield"],
  [/\b(camp|encampment|bivouac)\b/, "camp"], [/\b(forest|woods?|clearing|jungle|trail|path|thicket)\b/, "woods"], [/\b(yard|farm|garden|field|courtyard|village|orchard|gate)\b/, "yard"], [/\b(street|road|lane|alley|market|square|avenue|promenade|stilt|roofs?|bridge|skybridge|pavement)\b/, "street"]];
const THEME_OUT = { street: "street", forest: "woods", village: "yard", sea: "harbour", trench: "trench", snow: "snowfield", desert: "camp", drive: "street", fog: "street" };
const STRONG_IN = /\b(office|room|hut|hall|ward|cellar|crypt|chapel|church|lab|institute|studio|bedroom|flat|apartment|hospital|tavern|club|canteen|kitchen|library|vault|shelter|cabin|house|shop|dugout|station|clinic|stage|bridge of)\b/;
const SIZE = { gallery: [16, 10], great_hall: [18, 12], dungeon: [16, 10], smithy: [12, 9], medieval_village: [24, 14], castle_yard: [22, 14], tenement: [10, 8], factory: [18, 11], theatre: [16, 12], cinema: [14, 11], apartment: [14, 9], office_mod: [16, 11], shop: [14, 10], subway: [22, 12], server_room: [14, 9], hospital_mod: [18, 10], lab_scifi: [16, 11], corridor: [20, 7], cargo_bay: [20, 12], quarters: [12, 8], reactor_hall: [16, 12], neon_alley: [24, 14], modern_street: [26, 14], rooftop: [18, 11], desert_town: [24, 14], ruins: [22, 13], temple_court: [20, 13], jungle: [22, 14], rail: [24, 13], train_car: [16, 7], ship_deck: [22, 12], reef: [20, 12], polar_station: [22, 14], orbital: [22, 13], garden: [20, 13], street: [24, 14], woods: [22, 14], camp: [20, 13], yard: [20, 14], graveyard: [20, 14], harbour: [22, 12], trench: [22, 12], snowfield: [22, 14], ward: [20, 12], tavern: [16, 11], study: [12, 9], cellar: [14, 10], canteen: [18, 11], bedroom: [10, 8], chapel: [14, 10] };
const PIECE = [[/terminal|console|screen|monitor|hologram|display|control|panel/, ["console", "holo_table", "cubicle", "computer_desk"]], [/server|data|mainframe|drive\b|archive of/, ["server_rack", "server_tower"]], [/\bcar\b|vehicle|\bvan\b|truck|wreck/, ["car", "van", "car_wreck"]], [/statue|idol|carving|relief|effigy/, ["statue"]], [/throne|seat of power/, ["throne"]], [/sarcophag|tomb|coffin|crypt/, ["sarcophagus", "coffin"]], [/cage|prisoner|shackle/, ["cage_iron"]], [/forge|anvil|weapon|armou?r|sword/, ["anvil_forge", "weapon_rack", "armour_stand"]], [/loom|machine|engine|boiler|turbine/, ["loom", "boiler", "generator"]], [/projector|film|reel|cinema/, ["projector", "cinema_screen"]], [/sofa|couch|television|\btv\b/, ["sofa", "tv_set"]], [/fridge|freezer/, ["fridge", "kitchen_unit"]], [/pod|cryo|capsule/, ["cryo_pod", "capsule_bed", "hospital_bed"]], [/reactor|core\b/, ["reactor"]], [/container|cargo|freight/, ["cargo_container", "cargo_crate_sf"]], [/gun|cannon|turret/, ["deck_gun"]], [/mast|sail|rigging/, ["ship_mast"]], [/gallows|noose|hang/, ["gallows"]], [/shrine|altar/, ["altar", "statue"]], [/bed|bunk|cot|sleep|pillow/, ["bed_iron", "bed_double", "cot"]], [/register|ledger|file|record|paper|log|note|desk|report|graph|book|read|document|letter/, ["desk", "bookshelf", "filing_cabinet"]], [/stove|fire|ash|burn|hearth/, ["stove", "fireplace"]],
  [/lamp|light|candle|dark/, ["lamp_table", "lamp_floor", "candle"]], [/crate|box|supply|supplies|kit|medical/, ["crate", "crate_med", "crate_stack"]], [/barrel|cask|drink|wine|beer/, ["barrel"]], [/shelf|shelves|bookcase|archive/, ["bookshelf"]],
  [/gramophone|music|song|record player|phonograph/, ["gramophone"]], [/table|map|plan|tea|meal/, ["table_long", "table_round", "desk"]], [/sink|wash|water/, ["sink"]], [/locker|cabinet|cupboard|wardrobe|drawer/, ["cabinet", "locker", "wardrobe", "filing_cabinet"]]];
const hash = (s) => { let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const fp = (p) => { const d = CATALOG[p.t]; if (!d) return null; const sw = (p.rot || 0) % 180 ? d.size[1] : d.size[0], sd = (p.rot || 0) % 180 ? d.size[0] : d.size[1]; return { x: p.x - sw / 2, z: p.z - sd / 2, w: sw, h: sd }; };

/* ERA: the year, the place and the scene's words pick a period-right preset (castle, tenement, modern street, neon alley, jungle ...) */
const OUTSET = new Set(["street", "yard", "woods", "camp", "harbour", "trench", "snowfield", "graveyard"]);
const ERA_RULES = [
  [/\b(cabin|bunk|quarters|lounge|dormitory|habitat|berth)\b/, "quarters", [2050, 3000]], [/\b(district|after dark|megablock|plaza|arcade)\b/, "neon_alley", [2050, 3000]],
  [/\b(hills?|marsh|moor|fen|bog|heath|fell)\b/, "woods", [0, 3000], true], [/\b(gallery|museum|exhibition|salon|showroom)\b/, "gallery", [1700, 3000]],
  [/\b(throne|great hall|banquet|audience|court of)\b/, "great_hall", [0, 1700]], [/\b(dungeon|oubliette|gaol|jail|prison|cell block|holding cell)\b/, "dungeon", [0, 1950]],
  [/\b(forge|smithy|blacksmith|farrier)\b/, "smithy", [0, 1900]], [/\b(castle|keep|rampart|battlement|bailey|gatehouse|fortress|citadel|monastery|abbey grounds)\b/, "castle_yard", [0, 1700]],
  [/\b(theat(re|er)|opera|music hall|cabaret|stage door|auditorium)\b/, "theatre", [1700, 1990]], [/\b(cinema|picture show|projection|drive-in|drive in|movie)\b/, "cinema", [1895, 2100]],
  [/\b(mill|factory|foundry|loom|cannery|workhouse|works)\b/, "factory", [1750, 1960]], [/\b(subway|metro|underground station|tube station|platform)\b/, "subway", [1890, 2300]],
  [/\b(server|data[- ]?vault|datacent|mainframe|data hall)\b/, "server_room", [1960, 3000]], [/\b(cryo|laborator|lab\b|sterile|clean room)\b/, "lab_scifi", [2050, 3000]],
  [/\b(airlock|bulkhead|corridor|hatchway|spine|passage)\b/, "corridor", [2050, 3000]], [/\b(cargo|hangar|container|freight|loading bay|dock bay)\b/, "cargo_bay", [2050, 3000]],
  [/\b(reactor|engine room|turbine|power core)\b/, "reactor_hall", [2050, 3000]], [/\b(neon|night market|noodle|stilt|skybridge|back alley)\b/, "neon_alley", [2050, 3000]],
  [/\b(roof|rooftop)\b/, "rooftop", [1960, 3000]], [/\b(tether|orbital|zero-g|space station|platform ring)\b/, "orbital", [2050, 3000]],
  [/\b(shrine|torii|temple)\b/, "temple_court", [0, 1990]], [/\b(ruin|excavation|tomb|pyramid|catacomb|dig site|stair?well of stone)\b/, "ruins", [0, 3000]],
  [/\b(jungle|rainforest|river bank|riverbank|igarap|tributary|canoe)\b/, "jungle", [0, 3000]], [/\b(carriage|compartment|dining car|sleeper)\b/, "train_car", [1830, 2100]],
  [/\b(railway|rail yard|railroad|track|trackside|signal box|siding)\b/, "rail", [1830, 2100]], [/\b(deck|bridge of|quarterdeck|gun deck|corvette|schooner|frigate|freighter|hull)\b/, "ship_deck", [0, 2100]],
  [/\b(reef|coral|lagoon|shallows|dive)\b/, "reef", [0, 3000]], [/\b(park|garden|lawn|arbou?r|conservatory grounds)\b(?!\s+(tower|hotel|court|block))/, "garden", [1700, 3000], true],
  [/\b(shop|store|supermarket|convenience|pharmacy|mini-?mart)\b/, "shop", [1960, 3000]], [/\b(apartment|flat\b|condo|living room)\b/, "apartment", [1960, 2070]],
  [/\b(tenement|slum|rookery|lodging)\b/, "tenement", [1700, 1930]], [/\b(ward|hospital|clinic|infirmary|surgery)\b/, "hospital_mod", [1965, 2070]]];
const GENERIC = { // [from, to, generic preset -> era preset]
  mid: [1961, 2070, { street: "modern_street", yard: "modern_street", bedroom: "apartment", study: "office_mod", office: "office_mod", ward: "hospital_mod", canteen: "shop", tavern: "tavern" }],
  far: [2070, 3000, { street: "neon_alley", yard: "neon_alley", bedroom: "quarters", study: "lab_scifi", office: "lab_scifi", ward: "lab_scifi", canteen: "cargo_bay", tavern: "neon_alley", cellar: "corridor", woods: "garden", camp: "polar_station", trench: "cargo_bay" }],
  old: [0, 1700, { street: "medieval_village", yard: "medieval_village", canteen: "great_hall" }] };
function eraKey(spec, key) {
  const y = +spec.year || 1900, nm = `${spec.name} ${spec.theme || ""}`.toLowerCase(), set = `${spec.setting || ""}`.toLowerCase(), th = spec.theme || "";
  const hit = (txt) => ERA_RULES.find(([re, k, [a, b], outOnly]) => y >= a && y <= b && re.test(txt) && (!outOnly || OUTSET.has(key)));
  if (th === "train") return /\b(car\b|carriage|compartment|dining|cabin|sleeper|tatami)\b/.test(nm) ? "train_car" : /\b(station|platform|engine|cab\b)\b/.test(nm) ? "rail" : "train_car";
  const h = hit(nm);
  if (h) return h[1];
  if (th === "desert") return /\b(ruin|tomb|temple|pyramid|catacomb|stair)/.test(`${spec.text || ""}`.toLowerCase().slice(0, 200)) ? "ruins" : "desert_town";
  if (th === "forest" && /\b(brazil|amazon|congo|borneo|rio|guiana|sumatra|jungle)\b/.test(set)) return "jungle";
  if (th === "sea" && OUTSET.has(key)) return /\b(schooner|aboard|ship|corvette|frigate|freighter|vessel|boat|deck|hull)\b/.test(nm) ? "ship_deck" : key;
  if (th === "snow" && y > 1990 && /\b(antarctic|arctic|polar|vostok|greenland|svalbard)/.test(set)) return "polar_station";
  const G = y > 2070 ? GENERIC.far : y >= 1961 ? GENERIC.mid : y < 1700 ? GENERIC.old : null; if (G && G[2][key]) return G[2][key];
  return key;
}
export function planScene(spec, seed = 1) {
  const text = `${spec.name} ${spec.theme || ""} ${spec.text || ""}`.toLowerCase();
  let key = (RULES.find(([re]) => re.test(`${spec.name} ${spec.theme || ""}`.toLowerCase())) || RULES.find(([re]) => re.test(text.slice(0, 220))) || [0, spec.theme === "cellar" ? "cellar" : spec.theme === "church" ? "chapel" : "study"])[1];
  { const nm = `${spec.name}`.toLowerCase(), outT = THEME_OUT[spec.theme];
    const byName = OUTRULES.find(([re]) => re.test(nm)); const strongIn = STRONG_IN.test(nm);
    if (byName && !(strongIn && !/\b(cemetery|graveyard|churchyard|harbou?r|dock|trench|camp|quay|deck|schooner)\b/.test(nm))) key = byName[1];
    else if (outT && !strongIn) key = (OUTRULES.find(([re]) => re.test(text.slice(0, 160))) || [0, outT])[1]; }
  key = eraKey(spec, key); if (!PRESETS[key]) key = "study";
  if (key === "chapel" && !PRESETS.chapel) key = "study";
  const nOpt = (spec.options || []).length, gotos = [...new Set((spec.options || []).filter((o) => o.goto).map((o) => o.goto))];
  let [w, h] = SIZE[key] || [12, 9]; if (nOpt > 7) { w += 3; h += 2; } if (gotos.length > 3) w += 2;
  const L = furnish(blank(w, h, spec.name), key, hash(spec.id + seed) % 997 + 3);
  /* a door for each way out, spread round the walls */
  const SLOTS = [{ x: w / 2, z: h, axis: "h", dx: 0, dz: -.9 }, { x: 0, z: h / 2, axis: "v", dx: .9, dz: 0 }, { x: w, z: h / 2, axis: "v", dx: -.9, dz: 0 }, { x: w * .22, z: h, axis: "h", dx: 0, dz: -.9 }, { x: w * .78, z: h, axis: "h", dx: 0, dz: -.9 }, { x: w * .3, z: 0, axis: "h", dx: 0, dz: .9 }, { x: w * .7, z: 0, axis: "h", dx: 0, dz: .9 }];
  const use = SLOTS.slice(0, Math.max(1, gotos.length)); L.doors = use.map((s) => ({ x: s.x, z: s.z, w: 1.5, axis: s.axis }));
  L.props = L.props.filter((p) => !use.some((s) => Math.hypot(p.x - (s.x + s.dx * 1.4), p.z - (s.z + s.dz * 1.4)) < 1.8));
  L.windows = (L.style && L.style.outdoor) ? [] : [{ x: w * .3, z: 0, w: 1.3, axis: "h" }, { x: w * .7, z: 0, w: 1.3, axis: "h" }].filter((x) => !use.some((s) => s.z === 0 && Math.abs(s.x - x.x) < 1.6));
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
let loaded = false;
export async function buildPack(spec, seed) {
  if (!loaded) { await loadPieces(); loaded = true; }
  const plan = planScene(spec, seed); await prepare(plan.layout); const c = document.createElement("canvas"), r = render(plan.layout, c);
  return { plan, pack: { format: "beyond-map-1", layout: plan.layout, view: r.view, collide: r.collide, foot: r.foot, lights: r.lights, exits: r.exits, image: c.toDataURL("image/jpeg", .82) } };
}
