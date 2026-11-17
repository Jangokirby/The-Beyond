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
  /* clean up */
  try { const f = path.join(lab, "pieces", "custom.json"); if (fs.existsSync(f)) { const a = JSON.parse(fs.readFileSync(f, "utf8")).filter((x) => x.id !== "selftest_piece"); if (a.length) fs.writeFileSync(f, JSON.stringify(a, null, 1)); else { fs.unlinkSync(f); const ip = path.join(lab, "pieces", "index.json"); fs.writeFileSync(ip, JSON.stringify(JSON.parse(fs.readFileSync(ip, "utf8")).filter((x) => x !== "custom.json"))); } } } catch (e) {}
  for (const f of ["layouts/selftest-room.json", "maps/selftest-room.beyondmap", "maps/selftest-room.jpg", "maps/selftest-room.layout.json", "portraits/selftest-portrait.png", "portraits/selftest-portrait.json"]) try { fs.unlinkSync(path.join(lab, f)); } catch (e) {}
  console.log(bad ? `\n${bad} FAILED` : "\nall passed"); process.exit(bad ? 1 : 0);
})();
