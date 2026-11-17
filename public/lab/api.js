/* THE MAP API: one small, forgiving set of operations on a room layout, usable by a person, a script or any AI.
   Everything takes and returns plain JSON. Mistakes come back as clear messages (what is wrong, where, and what to do),
   so a small local model can correct itself. Works in Node and in the browser.
   Layout: see kit.js. Coordinates are metres: x runs left to right (0..w), z runs top to bottom (0..h); the camera looks from the bottom. */
import { CATALOG } from "./kit.js"; import { PRESETS, furnish, blank } from "./gen.js";
const R = (n) => Math.round(n * 100) / 100;
export const rot = (r) => ([0, 90, 180, 270].includes(+r) ? +r : 0);
export const sizeOf = (p) => { const d = CATALOG[p.t].size, sw = rot(p.rot) % 180 ? d[1] : d[0], sd = rot(p.rot) % 180 ? d[0] : d[1]; return [sw, sd]; };
export const foot = (p) => { const [w, d] = sizeOf(p); return { x: p.x - w / 2, z: p.z - d / 2, w, h: d }; };

const lev = (a, b) => { const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]); for (let j = 1; j <= b.length; j++) d[0][j] = j; for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return d[a.length][b.length]; };
const near = (s) => Object.keys(CATALOG).map((k) => [k, k.includes(String(s)) || String(s).includes(k) ? 0 : lev(k, String(s))]).sort((x, y) => x[1] - y[1]).slice(0, 4).filter((x) => x[1] <= 4).map((x) => x[0]);
export function listPieces(filter = {}) {
  return Object.entries(CATALOG).filter(([id, d]) => (!filter.tag || d.tags.includes(filter.tag) || id.includes(filter.tag)) && (!filter.light || d.light)).map(([id, d]) => ({ id, name: d.name, size: d.size, blocks: !!d.block, light: !!d.light, tags: d.tags }));
}
export function presets() { return Object.entries(PRESETS).map(([k, p]) => ({ id: k, name: p.name, style: p.style })); }
export function newRoom(w = 12, h = 9, name = "New room", style) { const L = blank(+w, +h, name); if (style) L.style = { ...L.style, ...style }; return L; }

/* Operations. Each returns "" if fine, or a message. They never throw, and they fix small things (clamping) and say so. */
export function applyOps(L, ops) {
  const log = [], err = [];
  const inRoom = (v, m) => Math.max(.3, Math.min(m - .3, +v));
  for (const [i, o] of (Array.isArray(ops) ? ops : [ops]).entries()) {
    const at = `op ${i} (${o && o.op})`;
    try {
      switch (o.op) {
        case "set_style": L.style = { ...L.style, ...o.style }; break;
        case "set_size": L.w = +o.w; L.h = +o.h; L.walls = blank(L.w, L.h).walls; break;
        case "furnish": if (!PRESETS[o.preset]) err.push(`${at}: no preset "${o.preset}". Presets: ${Object.keys(PRESETS).join(", ")}`); else { const keep = { doors: L.doors, windows: L.windows, things: L.things, npcs: L.npcs }; furnish(L, o.preset, o.seed || 7); Object.assign(L, keep); log.push(`filled with ${o.preset}`); } break;
        case "clear_props": L.props = []; break;
        case "add_piece": {
          if (!CATALOG[o.t]) { err.push(`${at}: unknown piece "${o.t}". Call list_pieces. Did you mean: ${near(o.t).join(", ") || "none close; call list_pieces"}`); break; }
          const p = { t: o.t, x: R(inRoom(o.x, L.w)), z: R(inRoom(o.z, L.h)), rot: rot(o.rot) }; if (p.x !== R(+o.x) || p.z !== R(+o.z)) log.push(`${at}: moved ${o.t} inside the room to ${p.x},${p.z}`);
          L.props.push(p); break; }
        case "move_piece": { const p = L.props[o.index]; if (!p) { err.push(`${at}: no piece number ${o.index} (there are ${L.props.length}, counting from 0)`); break; } p.x = R(inRoom(o.x ?? p.x, L.w)); p.z = R(inRoom(o.z ?? p.z, L.h)); if (o.rot !== undefined) p.rot = rot(o.rot); break; }
        case "remove_piece": { if (!L.props[o.index]) { err.push(`${at}: no piece number ${o.index}`); break; } L.props.splice(o.index, 1); break; }
        case "add_door": case "add_window": {
          const h = o.axis === "h"; if (o.axis !== "h" && o.axis !== "v") { err.push(`${at}: axis must be "h" (a wall running left-right, z=0 or z=${L.h}) or "v" (a wall running top-bottom, x=0 or x=${L.w})`); break; }
          const d = { x: h ? R(inRoom(o.x, L.w)) : (+o.x > L.w / 2 ? L.w : 0), z: h ? (+o.z > L.h / 2 ? L.h : 0) : R(inRoom(o.z, L.h)), w: +o.w || (o.op === "add_door" ? 1.5 : 1.3), axis: o.axis };
          (o.op === "add_door" ? L.doors : L.windows).push(d); break; }
        case "add_wall": { const [a, b] = [o.a, o.b]; if (!(a && b) || (a[0] !== b[0] && a[1] !== b[1])) { err.push(`${at}: walls must be straight: a and b share an x or a z`); break; } L.walls.push({ a: a.map(R), b: b.map(R) }); break; }
        case "add_thing": L.things.push({ x: R(inRoom(o.x, L.w)), z: R(inRoom(o.z, L.h)), label: String(o.label || "Something"), text: String(o.text || ""), ...(o.act ? { act: o.act, res: o.res || "" } : {}) }); break;
        case "set_npc": L.npcs = [{ x: R(inRoom(o.x, L.w)), z: R(inRoom(o.z, L.h)), label: String(o.label || "Someone"), portrait: o.portrait || "../assets/painted/a/wars-f-05.jpg" }]; break;
        case "set_start": L.start = [R(inRoom(o.x, L.w)), R(inRoom(o.z, L.h))]; break;
        default: err.push(`${at}: unknown op. Known: set_style, set_size, furnish, clear_props, add_piece, move_piece, remove_piece, add_door, add_window, add_wall, add_thing, set_npc, set_start`);
      }
    } catch (e) { err.push(`${at}: ${e.message}`); }
  }
  return { layout: L, errors: err, notes: log };
}

/* Checks a layout and says what is wrong: overlaps, blocked doors, places you cannot reach. */
export function validate(L) {
  const problems = [], warn = [];
  const blocking = L.props.map((p, i) => ({ p, i, f: CATALOG[p.t] && CATALOG[p.t].block ? foot(p) : null })).filter((x) => x.f);
  for (const { p, i, f } of blocking) { if (f.x < -.05 || f.z < -.05 || f.x + f.w > L.w + .05 || f.z + f.h > L.h + .05) problems.push(`piece ${i} (${p.t}) sticks out of the room; move it inward`); }
  for (let a = 0; a < blocking.length; a++) for (let b = a + 1; b < blocking.length; b++) { const A = blocking[a].f, B = blocking[b].f; if (A.x < B.x + B.w - .1 && B.x < A.x + A.w - .1 && A.z < B.z + B.h - .1 && B.z < A.z + A.h - .1) problems.push(`pieces ${blocking[a].i} (${blocking[a].p.t}) and ${blocking[b].i} (${blocking[b].p.t}) overlap; move one`); }
  const step = .5, W = Math.round(L.w / step), H = Math.round(L.h / step), free = (x, z) => { for (const { f } of blocking) if (x > f.x - .3 && x < f.x + f.w + .3 && z > f.z - .3 && z < f.z + f.h + .3) return false; return x > .3 && z > .3 && x < L.w - .3 && z < L.h - .3; };
  const key = (i, j) => i + "," + j, seen = new Set(), start = L.start || [L.w / 2, L.h - 1.5];
  let si = Math.round(start[0] / step), sj = Math.round(start[1] / step); if (!free(si * step, sj * step)) { warn.push("the start point is inside furniture; move it"); }
  const q = [[si, sj]]; seen.add(key(si, sj)); while (q.length) { const [i, j] = q.shift(); for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const a = i + di, b = j + dj; if (a < 0 || b < 0 || a > W || b > H || seen.has(key(a, b)) || !free(a * step, b * step)) continue; seen.add(key(a, b)); q.push([a, b]); } }
  const reach = (x, z, r = 1.3) => { for (let a = Math.round((x - r) / step); a <= Math.round((x + r) / step); a++) for (let b = Math.round((z - r) / step); b <= Math.round((z + r) / step); b++) if (seen.has(key(a, b)) && Math.hypot(a * step - x, b * step - z) <= r) return true; return false; };
  for (const d of L.doors) if (!reach(d.x + (d.axis === "v" ? (d.x === 0 ? .8 : -.8) : 0), d.z + (d.axis === "h" ? (d.z === 0 ? .8 : -.8) : 0), 1.0)) problems.push(`the door at ${d.x},${d.z} cannot be reached from the start; clear furniture in front of it`);
  for (const t of L.things) if (!reach(t.x, t.z)) problems.push(`the examine spot "${t.label}" at ${t.x},${t.z} cannot be reached; move it or the furniture round it`);
  for (const n of L.npcs) if (!reach(n.x, n.z)) problems.push(`the person "${n.label}" at ${n.x},${n.z} cannot be reached`);
  if (!L.doors.length) problems.push("the room has no door");
  if (L.props.length < 4) warn.push("the room is nearly empty; add furniture");
  const open = seen.size / Math.max(1, W * H); if (open < .35) warn.push(`only ${Math.round(open * 100)}% of the room is walkable; it is crowded`);
  return { ok: !problems.length, problems, warnings: warn, walkable: Math.round(open * 100) + "%" };
}

/* A text picture of the room, for models that cannot see. 1 character = 0.5 m. */
export function ascii(L) {
  const step = .5, W = Math.round(L.w / step), H = Math.round(L.h / step), g = Array.from({ length: H }, () => Array(W).fill("."));
  const mark = (x, z, c) => { const i = Math.floor(x / step), j = Math.floor(z / step); if (g[j] && g[j][i] !== undefined) g[j][i] = c; };
  const legend = {}, sym = (t) => { if (!legend[t]) { const used = new Set(Object.values(legend)); const c = (t[0] + t.split("_").map((s) => s[0]).join("")).toUpperCase().split("").find((ch) => /[A-Z]/.test(ch) && !used.has(ch)) || "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").find((ch) => !used.has(ch) && !["D", "P", "S"].includes(ch)) || "#"; legend[t] = c; } return legend[t]; };
  L.props.forEach((p) => { if (!CATALOG[p.t]) return; const f = foot(p); for (let x = f.x; x < f.x + f.w - .01; x += step) for (let z = f.z; z < f.z + f.h - .01; z += step) mark(x + .01, z + .01, sym(p.t)); });
  for (const d of L.doors) { const h = d.axis === "h"; for (let k = -d.w / 2; k < d.w / 2; k += step) mark(h ? d.x + k : Math.min(d.x, L.w - .01), h ? Math.min(d.z, L.h - .01) : d.z + k, "D"); }
  L.things.forEach((t, i) => mark(t.x, t.z, "?")); L.npcs.forEach((n) => mark(n.x, n.z, "P")); if (L.start) mark(L.start[0], L.start[1], "S");
  return { rows: g.map((r) => r.join("")), legend: { ...Object.fromEntries(Object.entries(legend).map(([k, v]) => [v, k])), D: "door", "?": "examine spot", P: "person", S: "start", ".": "floor" }, scale: "1 character = 0.5 m; top of the picture is z=0 (back wall); the camera looks from the bottom", size: [L.w, L.h] };
}

/* A way for a model to learn the format: the tool list, in the shape both OpenAI-style and Anthropic function calling accept. */
export const TOOLS = [
  { name: "list_pieces", description: "List the furniture and props you may place: id, size in metres, whether it blocks walking, tags.", parameters: { type: "object", properties: { tag: { type: "string", description: "optional: only pieces with this tag or id part, e.g. medical, tavern, church, modern" } } } },
  { name: "new_room", description: "Start a room. Returns the layout. x runs 0..w left to right, z runs 0..h top to bottom.", parameters: { type: "object", properties: { w: { type: "number" }, h: { type: "number" }, name: { type: "string" }, style: { type: "object", properties: { floor: { enum: ["wood", "stone", "tile", "dirt"] }, wall: { enum: ["plaster", "brick", "wood", "concrete"] }, mood: { enum: ["day", "dim", "night"] } } } }, required: ["w", "h"] } },
  { name: "apply_ops", description: "Change the room with a list of operations. ops: set_style{style}, furnish{preset}, clear_props, add_piece{t,x,z,rot}, move_piece{index,x,z,rot}, remove_piece{index}, add_door{x,z,w,axis}, add_window{x,z,w,axis}, add_wall{a:[x,z],b:[x,z]}, add_thing{x,z,label,text,act,res}, set_npc{x,z,label}, set_start{x,z}. Errors say exactly what to fix.", parameters: { type: "object", properties: { layout: { type: "object" }, ops: { type: "array", items: { type: "object" } } }, required: ["layout", "ops"] } },
  { name: "validate", description: "Check a layout: overlaps, pieces outside the room, doors or examine spots that cannot be reached.", parameters: { type: "object", properties: { layout: { type: "object" } }, required: ["layout"] } },
  { name: "ascii", description: "Draw the room as text so you can see where things are. Use it after changes.", parameters: { type: "object", properties: { layout: { type: "object" } }, required: ["layout"] } },
  { name: "render", description: "Render the room to a picture (jpg) and a map pack the game can use. Returns the file paths.", parameters: { type: "object", properties: { layout: { type: "object" }, name: { type: "string", description: "file name without extension" } }, required: ["layout", "name"] } },
  { name: "add_piece_type", description: "Define a NEW piece from primitives: {id,name,tags,size:[w,d],block,parts:[{shape:box|cyl|cone|sphere,size:[w,h,d] or r,h or r,pos:[x,y,z],rot:[deg,deg,deg],mat:wood|dark|iron|brass|sheet|stone|brick|crate|canvas|red|metalBlue|or '#rrggbb'}]}. y is up; the piece stands on y=0 and is centred on x,z.", parameters: { type: "object", properties: { spec: { type: "object" } }, required: ["spec"] } },
  { name: "map_case", description: "Make maps for every scene of a written case (by id), automatically.", parameters: { type: "object", properties: { case_id: { type: "string" } }, required: ["case_id"] } },
  { name: "list_presets", description: "List the room presets for furnish{preset}: id, name and style. Grouped by era in MAPS.md.", parameters: { type: "object", properties: {} } },
  { name: "plan_case", description: "Dry run: say which preset each scene of a written case would get, without drawing anything. Use before map_case.", parameters: { type: "object", properties: { case_id: { type: "string" } }, required: ["case_id"] } },
  { name: "import_model", description: "Add a .glb/.gltf 3D model file as a piece. Give file path, id, name, tags and height in metres (the size is measured).", parameters: { type: "object", properties: { file: { type: "string" }, id: { type: "string" }, name: { type: "string" }, tags: { type: "array", items: { type: "string" } }, height: { type: "number" }, block: { type: "boolean" } }, required: ["file", "id"] } },
  { name: "import_vtt", description: "Convert a Dungeon Alchemist or Dungeondraft export (.dd2vtt/.uvtt) into a map pack.", parameters: { type: "object", properties: { file: { type: "string" }, name: { type: "string" } }, required: ["file"] } },
  { name: "install_map", description: "Put a rendered map pack into a scene of a written case, with optional spots {label:[x,z]}, npcs {id:[x,z]} and start [x,z].", parameters: { type: "object", properties: { case_id: { type: "string" }, scene: { type: "string" }, pack: { type: "string", description: "path to a .beyondmap file" }, spots: { type: "object" }, npcs: { type: "object" }, start: { type: "array", items: { type: "number" } } }, required: ["case_id", "scene", "pack"] } },
  { name: "list_bust_parts", description: "List every swappable part for a portrait bust (brows, eyes, mouths, noses, moustaches, beards, hair, hats, glasses, outfits) and the colour fields.", parameters: { type: "object", properties: {} } },
  { name: "suggest_bust", description: "Pick a period-right portrait spec from what is known about a person. Same name gives the same face. Returns {spec}; edit it, then render_portrait.", parameters: { type: "object", properties: { name: { type: "string" }, gender: { type: "string", description: "f, m or x" }, age: { type: "number" }, year: { type: "number" }, job: { type: "string" }, origin: { type: "string", description: "place or people, e.g. Burgundy, Lagos, Rajasthan" }, mood: { type: "string", description: "neutral, worried, stern, happy or shocked" } } } },
  { name: "render_portrait", description: "Draw a portrait bust from a spec (see list_bust_parts) to a PNG in public/lab/portraits/. Returns the file paths.", parameters: { type: "object", properties: { spec: { type: "object" }, name: { type: "string", description: "file name without extension" }, w: { type: "number" }, h: { type: "number" } }, required: ["spec", "name"] } }
];
export { CATALOG, PRESETS };
