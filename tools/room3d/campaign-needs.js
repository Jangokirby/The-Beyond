#!/usr/bin/env node
/* A shopping list for a campaign: every map it needs (size, look, exits, people) and every prop model on them (real-world size, how many, where),
   plus the objects the story names that are only stood in for by a plain stand-in piece today. Made from the maps themselves, so it is always true.
     node tools/room3d/campaign-needs.js <name> <case-id> [<case-id> ...]       writes art/needs-<name>.md, -maps.csv and -props.csv      */
const fs = require("fs"), path = require("path"), root = path.join(__dirname, "..", ".."), { fns } = require("./lib.js"), LIB = require("../load-cases.js")();
(async () => {
  const [name, ...ids] = process.argv.slice(2); if (!name || !ids.length) { console.error("usage: campaign-needs.js <name> <case-id> ..."); process.exit(1); }
  const pieces = Object.fromEntries((await fns.list_pieces({})).map((p) => [p.id, p])), maps = [], props = {}, hero = [];
  for (const cid of ids) {
    const a = LIB[cid], idxF = path.join(root, "public/lab/maps", cid, "index.json"); if (!a || !fs.existsSync(idxF)) { console.error("no maps for " + cid); continue; }
    const idx = JSON.parse(fs.readFileSync(idxF, "utf8"));
    for (const [sid, e] of Object.entries(idx)) {
      const pk = JSON.parse(fs.readFileSync(path.join(root, "public", e.pack), "utf8")), L = pk.layout, st = L.style || {}, sc = a.scenes[sid] || {};
      maps.push({ case: cid, part: a.title, scene: sid, name: sc.name || sid, w: L.w, h: L.h, floor: st.floor, wall: st.outdoor ? "(outdoor)" : st.wall, mood: st.mood, outdoor: !!st.outdoor, doors: (L.doors || []).length, people: Object.keys(e.npcs || {}).map((n) => (a.npcs[n] || {}).name || n).join("; "), spots: Object.keys(e.spots || {}).length, props: (L.props || []).length });
      for (const p of L.props || []) { const d = pieces[p.t] || {}; const r = (props[p.t] = props[p.t] || { id: p.t, name: d.name || p.t, size: d.size, block: d.block, tags: (d.tags || []).join(" "), count: 0, scenes: new Set() }); r.count++; r.scenes.add(`${cid}/${sid}`); }
      for (const [label, pos] of Object.entries(e.spots || {})) { if (e.npcs && Object.values(e.npcs).some((q) => q[0] === pos[0] && q[1] === pos[1])) continue; let best = null, bd = 99; for (const p of L.props || []) { const dd = Math.hypot(p.x - pos[0], p.z - pos[1]); if (dd < bd) { bd = dd; best = p; } } if (best && bd < 3 && !/^(talk|to |go |back|enter|leave)/i.test(label)) hero.push({ case: cid, scene: sc.name || sid, label, standin: (pieces[best.t] || {}).name || best.t }); }
    }
  }
  const P = Object.values(props).sort((x, y) => y.count - x.count), out = path.join(root, "art"), rows = (o) => Object.values(o).map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",");
  fs.writeFileSync(path.join(out, `needs-${name}-maps.csv`), Object.keys(maps[0]).join(",") + "\n" + maps.map(rows).join("\n"));
  fs.writeFileSync(path.join(out, `needs-${name}-props.csv`), "id,name,width_m,depth_m,blocks_walking,tags,times_used,scenes\n" + P.map((p) => `${p.id},"${p.name}",${p.size ? p.size[0] : ""},${p.size ? p.size[1] : ""},${p.block},"${p.tags}",${p.count},"${[...p.scenes].join(" ")}"`).join("\n"));
  const kinds = { indoor: maps.filter((m) => !m.outdoor).length, outdoor: maps.filter((m) => m.outdoor).length };
  let md = `# Asset needs: ${name}\n\nMade from the maps in the game (\`node tools/room3d/campaign-needs.js ${name} ${ids.join(" ")}\`). ${maps.length} maps (${kinds.indoor} indoor, ${kinds.outdoor} outdoor) and ${P.length} different props.\n\n`;
  md += `## Rules for every model (so any software can feed the map tool)\n- Units: **metres**. A standing person is about 1.7 m and a token is drawn about 1.1 m wide, so a bed is about two tokens long.\n- Origin on the floor at the middle of the base; **+Z is the front**; Y up. One file per prop, \`.glb\` (binary glTF 2.0), static mesh, no rig.\n- Name materials \`skin\`, \`hair\`, \`cloth\`, \`cloth2\` or \`trim\` only where the colour should be changeable (people and clothes); props can keep their own colours.\n- Keep each prop under about 5,000 triangles. File name = the prop id below (for example \`bed_iron.glb\`).\n- Then: \`import_models { dir, pack, licensed: true }\` (or the Map Builder) to bring them in. See \`CHARACTER-IMPORT.md\` for people.\n\n`;
  md += `## Maps (${maps.length})\n| Part | Scene | Size (m) | Look | Exits | People | Marks |\n|---|---|---|---|---|---|---|\n` + maps.map((m) => `| ${m.case} | ${m.name} | ${m.w} × ${m.h} | ${m.outdoor ? "outdoor, " : ""}${m.floor}${m.outdoor ? "" : " floor, " + m.wall + " walls"}, ${m.mood} | ${m.doors} | ${m.people || "none"} | ${m.spots} |`).join("\n") + "\n\n";
  md += `## Props (${P.length}), most used first\n| Prop id | Name | Size W × D (m) | Blocks walking | Used | Where (first 3) |\n|---|---|---|---|---|---|\n` + P.map((p) => `| \`${p.id}\` | ${p.name} | ${p.size ? p.size[0] + " × " + p.size[1] : "?"} | ${p.block ? "yes" : "no"} | ${p.count}× | ${[...p.scenes].slice(0, 3).join(", ")} |`).join("\n") + "\n\n";
  md += `## Story objects that only have a plain stand-in today (${hero.length}): worth a real model\n| Part | Scene | The story's object | Stand-in now |\n|---|---|---|---|\n` + hero.map((h) => `| ${h.case} | ${h.scene} | ${h.label} | ${h.standin} |`).join("\n") + "\n";
  fs.writeFileSync(path.join(out, `needs-${name}.md`), md); console.log(`maps ${maps.length}, props ${P.length}, story objects ${hero.length}`);
})();
