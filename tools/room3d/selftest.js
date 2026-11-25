#!/usr/bin/env node
/* Exercises every tool once and reports pass/fail. Run it after setting up a machine, or after changing the map tool:
     node tools/room3d/selftest.js          (needs: node, playwright with chromium; renders use CPU, no GPU)
   It cleans up the files it makes. Exit code 0 = all good. */
const fs = require("fs"), path = require("path"), { pathToFileURL } = require("url"), { fns } = require("./lib.js");
const lab = path.join(__dirname, "..", "..", "public", "lab"); let bad = 0;
const t = async (name, fn) => { const t0 = Date.now(); try { const r = await fn(); if (r === false) throw new Error("returned false"); console.log(`ok    ${name} (${Date.now() - t0} ms)`); return r; } catch (e) { bad++; console.log(`FAIL  ${name}: ${e.message}`); } };
const need = (c, m) => { if (!c) throw new Error(m); };
(async () => {
  const { TOOLS } = await import(pathToFileURL(path.join(lab, "api.js")).href);
  await t("every tool in TOOLS has an implementation", () => { const miss = TOOLS.map((x) => x.name).filter((n) => !fns[n]); need(!miss.length, "missing: " + miss.join(", ")); });
  await t("tools.json matches TOOLS", () => { const j = JSON.parse(fs.readFileSync(path.join(__dirname, "tools.json"), "utf8")); need(j.openai.length === TOOLS.length, `tools.json has ${j.openai.length}, TOOLS has ${TOOLS.length}: run build-tools-json.js`); });
  const presets = await t("list_presets", async () => { const r = await fns.list_presets(); need(r.length >= 40, "only " + r.length + " presets"); return r; });
  await t("list_pieces (all, and by tag)", async () => { const a = await fns.list_pieces({}), b = await fns.list_pieces({ tag: "scifi" }); need(a.length >= 120 && b.length >= 5, `pieces ${a.length}, scifi ${b.length}`); });
  let room; await t("new_room", async () => { room = (await fns.new_room({ w: 14, h: 9, name: "selftest" })).layout; need(room && room.w === 14, "no layout"); });
  for (const key of ["tavern", "neon_alley", "great_hall", "jungle"]) await t(`apply_ops furnish ${key} + validate + ascii`, async () => { const r = await fns.apply_ops({ layout: room, ops: [{ op: "furnish", preset: key }] }); const L = r.layout || r; need(L.props && L.props.length > 3, "no props"); need(key !== "neon_alley" && key !== "jungle" || L.style.outdoor, "outdoor flag lost"); const v = await fns.validate({ layout: L }); need(v, "no validate result"); const a = await fns.ascii({ layout: L }); need(((a.rows || []).join("")).length > 50, "empty ascii"); });
  await t("suggest_bust is period-right and stable", async () => { const a = (await fns.suggest_bust({ name: "Ada", gender: "f", year: 1917, job: "nurse", age: 30 })).spec, b = (await fns.suggest_bust({ name: "Ada", gender: "f", year: 1917, job: "nurse", age: 30 })).spec; need(a.outfit === "nurse" && a.hat === "nurse_veil", "nurse not dressed as a nurse"); need(JSON.stringify(a) === JSON.stringify(b), "not stable"); });
  await t("list_bust_parts", async () => { const p = await fns.list_bust_parts(); need(p.hair.length >= 6 && p.hats.length >= 5 && p.outfits.length >= 6, "few parts"); });
  await t("plan_case (dry run)", async () => { const r = await fns.plan_case({ case_id: "qf-1-hush" }); need(r.ok && /trench/.test(r.plan), "no plan: " + (r.error || r.plan)); });
  await t("add_piece_type", async () => { const r = await fns.add_piece_type({ spec: { id: "selftest_piece", name: "Selftest", tags: ["any"], size: [1, 1], block: true, parts: [{ shape: "box", size: [1, 1, 1], pos: [0, .5, 0], mat: "wood" }] } }); need(r.ok !== false, r.error); });
  await t("render (picture + map pack)", async () => { const L = (await fns.apply_ops({ layout: room, ops: [{ op: "furnish", preset: "study" }, { op: "add_piece", t: "selftest_piece", x: 6, z: 4, rot: 0 }] })).layout; const r = await fns.render({ layout: L, name: "selftest-room" }); need(r.ok, r.error); need(fs.statSync(path.join(__dirname, "..", "..", r.pack)).size > 20000, "pack too small"); });
  await t("render_portrait", async () => { const s = (await fns.suggest_bust({ name: "Test", gender: "m", year: 1890, job: "clerk", age: 50 })).spec; const r = await fns.render_portrait({ spec: s, name: "selftest-portrait" }); need(r.ok && fs.statSync(path.join(__dirname, "..", "..", r.picture)).size > 8000, "portrait too small"); });
  await t("character models: inspect, import base + part, list, render", async () => {
    const makeGlb = require("./glb.js"), os = require("os"), tmp = fs.mkdtempSync(path.join(os.tmpdir(), "chr-"));
    fs.writeFileSync(path.join(tmp, "selftest_base.glb"), makeGlb([{ name: "body", pos: [0, .7, 0], box: [.5, 1.4, .3], material: "cloth", color: "#556677" }, { name: "head", pos: [0, 1.55, 0], box: [.26, .3, .26], material: "skin", color: "#e0b090" }, { name: "anchor_head", pos: [0, 1.55, 0] }, { name: "anchor_face", pos: [0, 1.55, .13] }, { name: "anchor_torso", pos: [0, 1.1, 0] }]));
    fs.writeFileSync(path.join(tmp, "selftest_hat.glb"), makeGlb([{ name: "hat", pos: [0, .22, 0], box: [.34, .14, .34], material: "cloth", color: "#884433" }]));
    const bad = await fns.inspect_character_model({ file: path.join(tmp, "selftest_base.glb") }); need(bad.ok && bad.anchors.head && bad.size.h > 1.5, "inspect failed: " + JSON.stringify(bad).slice(0, 200));
    const b = await fns.import_character({ file: path.join(tmp, "selftest_base.glb"), kind: "base", id: "selftest_base", height: 1.7 }); need(b.ok, b.error);
    const h = await fns.import_character({ file: path.join(tmp, "selftest_hat.glb"), kind: "part", id: "selftest_hat", slot: "hat" }); need(h.ok, h.error);
    const kit = await fns.list_character_kit(); need(kit.bases.some((x) => x.id === "selftest_base") && kit.parts.some((x) => x.id === "selftest_hat"), "not in kit");
    const r = await fns.render_character({ name: "selftest-character", spec: { base: "selftest_base", parts: { hat: "selftest_hat" }, colors: { skin: "#8a5a3c", cloth: "#2f4a8a" } } }); need(r.ok, r.error); need(fs.statSync(path.join(__dirname, "..", "..", r.picture)).size > 6000, "picture too small");
  });
  await t("modular kit: import a folder (licensed), register a kit, build a room from it", async () => {
    const makeGlb = require("./glb.js"), os = require("os"), d = fs.mkdtempSync(path.join(os.tmpdir(), "kit-")), dir = path.join(d, "structure"); fs.mkdirSync(dir);
    fs.writeFileSync(path.join(dir, "wall_2m.glb"), makeGlb([{ name: "w", pos: [0, 1.3, -.1], box: [2, 2.6, .2], material: "stone", color: "#8a8478" }]));
    fs.writeFileSync(path.join(dir, "door_2m.glb"), makeGlb([{ name: "lintel", pos: [0, 2.35, -.1], box: [2, .5, .2], material: "stone", color: "#6a6458" }, { name: "l", pos: [-.9, 1.05, -.1], box: [.2, 2.1, .2], material: "stone", color: "#6a6458" }, { name: "r", pos: [.9, 1.05, -.1], box: [.2, 2.1, .2], material: "stone", color: "#6a6458" }]));
    fs.writeFileSync(path.join(dir, "floor_tile.glb"), makeGlb([{ name: "t", pos: [0, .02, 0], box: [2, .04, 2], material: "stone", color: "#9a948a" }]));
    fs.writeFileSync(path.join(dir, "crate_a.glb"), makeGlb([{ name: "c", pos: [0, .4, 0], box: [.8, .8, .8], material: "wood", color: "#8a6a3a" }]));
    const r = await fns.import_models({ dir: d, pack: "selftestpack", licensed: true }); need(r.ok && r.imported === 4, "import_models: " + JSON.stringify(r).slice(0, 300));
    need(r.pieces.some((p) => p.id === "selftestpack_crate_a" && p.block) && r.pieces.some((p) => p.id === "selftestpack_floor_tile" && !p.block), "block guess wrong");
    const k = await fns.register_kit({ kit: { id: "selftest_kit", name: "Selftest", grid: 2, wall: "selftestpack_wall_2m", door: "selftestpack_door_2m", floor: "selftestpack_floor_tile", licensed: true } }); need(k.ok, k.error);
    need((await fns.list_kits()).some((x) => x.id === "selftest_kit"), "kit not listed");
    let room = (await fns.new_room({ w: 10, h: 8, name: "selftest-kit" })).layout; room = (await fns.apply_ops({ layout: room, ops: [{ op: "set_style", style: { kit: "selftest_kit", mood: "day" } }, { op: "add_door", x: 5, z: 0, w: 2, axis: "h" }, { op: "add_piece", t: "selftestpack_crate_a", x: 4, z: 4, rot: 0 }] })).layout;
    const rr = await fns.render({ layout: room, name: "selftest-kit" }); need(rr.ok, rr.error); need(fs.statSync(path.join(__dirname, "..", "..", rr.pack)).size > 15000, "kit render too small");
    fs.copyFileSync(path.join(lab, "maps", "selftest-kit.jpg"), path.join(require("os").tmpdir(), "selftest-kit.jpg"));
  });
  await t("Map Studio server: health, tools, a tool call, refuses path tricks", async () => {
    const { start } = require("../../mapstudio/studio.js"), http = require("http"), srv = await start(47398), get = (m, p, b) => new Promise((ok, no) => { const r = http.request({ host: "127.0.0.1", port: 47398, path: p, method: m }, (res) => { let d = ""; res.on("data", (c) => d += c); res.on("end", () => ok([res.statusCode, d])); }); r.on("error", no); if (b) r.write(b); r.end(); });
    try { need(JSON.parse((await get("GET", "/api/health"))[1]).ok, "health"); need(JSON.parse((await get("GET", "/api/tools"))[1]).length === TOOLS.length, "tool count"); const r = JSON.parse((await get("POST", "/api/tool/new_room", '{"w":9,"h":7}'))[1]); need(r.layout && r.layout.w === 9, "new_room over HTTP"); need((await get("GET", "/lab/..%2f..%2fserver.js"))[0] === 403, "path traversal not blocked"); need((await get("GET", "/"))[0] === 200, "hub page"); } finally { srv.close(); }
  });
  await t("named rooms: new_room, apply_ops/validate/ascii/render by name", async () => {
    const r = await fns.new_room({ w: 12, h: 8, name: "selftest-named" }); need(r.room === "selftest-named" && r.saved, "not saved");
    const a = await fns.apply_ops({ room: "selftest-named", ops: [{ op: "furnish", preset: "study" }] }); need(a.ok && a.props > 3 && !a.layout, "compact reply expected: " + JSON.stringify(a).slice(0, 200));
    need((await fns.validate({ room: "selftest-named" })), "validate by name"); need(((await fns.ascii({ room: "selftest-named" })).rows || []).length > 5, "ascii by name");
    need((await fns.list_rooms()).rooms.some((x) => x.room === "selftest-named"), "not listed");
    let msg = ""; try { await fns.validate({ room: "no-such-room" }); } catch (e) { msg = e.message; } need(/no room called/.test(msg), "unhelpful error: " + msg);
    const rr = await fns.render({ room: "selftest-named" }); need(rr.ok, rr.error);
  });
  await t("Map Studio survives --open with no browser opener (servers)", async () => {
    const { spawn } = require("child_process"), c = spawn("node", [path.join(__dirname, "..", "..", "mapstudio", "studio.js"), "--open"], { env: { ...process.env, MAPSTUDIO_PORT: "47397", PATH: "/nonexistent-dir:" + path.dirname(process.execPath) } });
    await new Promise((r) => setTimeout(r, 2500)); const alive = c.exitCode === null; c.kill(); need(alive, "the server died after starting (a missing xdg-open must not crash it)"); });
  /* clean up */
  try { fs.rmSync(path.join(lab, "models", "_licensed", "selftestpack"), { recursive: true, force: true }); for (const f of ["pieces/_licensed-selftestpack.json", "kits/_licensed-selftest_kit.json", "layouts/selftest-kit.json", "maps/selftest-kit.beyondmap", "maps/selftest-kit.jpg", "maps/selftest-kit.layout.json"]) try { fs.unlinkSync(path.join(lab, f)); } catch (e) {}
    for (const [f, n] of [["pieces/index.local.json", "_licensed-selftestpack.json"], ["kits/index.local.json", "_licensed-selftest_kit.json"]]) { const p = path.join(lab, f); if (fs.existsSync(p)) { const a = JSON.parse(fs.readFileSync(p, "utf8")).filter((x) => x !== n); if (a.length) fs.writeFileSync(p, JSON.stringify(a)); else fs.unlinkSync(p); } } } catch (e) {}
  try { const kf = path.join(lab, "characters", "kit.json"), k = JSON.parse(fs.readFileSync(kf, "utf8")); k.bases = k.bases.filter((x) => !/^selftest/.test(x.id)); k.parts = k.parts.filter((x) => !/^selftest/.test(x.id)); fs.writeFileSync(kf, JSON.stringify(k, null, 1)); } catch (e) {}
  for (const f of ["selftest_base.glb", "selftest_hat.glb"]) try { fs.unlinkSync(path.join(lab, "characters", "models", f)); } catch (e) {}
  for (const f of ["portraits/selftest-character.png", "portraits/selftest-character.json"]) try { fs.unlinkSync(path.join(lab, f)); } catch (e) {}
  try { const f = path.join(lab, "pieces", "custom.json"); if (fs.existsSync(f)) { const a = JSON.parse(fs.readFileSync(f, "utf8")).filter((x) => x.id !== "selftest_piece"); if (a.length) fs.writeFileSync(f, JSON.stringify(a, null, 1)); else { fs.unlinkSync(f); const ip = path.join(lab, "pieces", "index.json"); fs.writeFileSync(ip, JSON.stringify(JSON.parse(fs.readFileSync(ip, "utf8")).filter((x) => x !== "custom.json"))); } } } catch (e) {}
  for (const f of ["layouts/selftest-named.json", "maps/selftest-named.beyondmap", "maps/selftest-named.jpg", "maps/selftest-named.layout.json", "layouts/selftest.json", "layouts/selftest-room.json", "maps/selftest-room.beyondmap", "maps/selftest-room.jpg", "maps/selftest-room.layout.json", "portraits/selftest-portrait.png", "portraits/selftest-portrait.json"]) try { fs.unlinkSync(path.join(lab, f)); } catch (e) {}
  console.log(bad ? `\n${bad} FAILED` : "\nall passed"); process.exit(bad ? 1 : 0);
})();
