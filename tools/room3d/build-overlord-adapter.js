#!/usr/bin/env node
/* Writes studio/overlord/mapstudio-tools.json: Map Studio's tools in the shape Overlord's tools.js uses (name, risk, description, parameters),
   plus which goblins get which. Run after changing the tool list:  node tools/room3d/build-overlord-adapter.js
   Tool names are prefixed studio_ so they cannot clash with Overlord's own tools. */
const fs = require("fs"), path = require("path"), { pathToFileURL } = require("url");
const RISK = { read: ["list_pieces", "list_presets", "list_rooms", "list_maps", "list_kits", "list_character_kit", "list_bust_parts", "suggest_bust", "validate", "ascii", "plan_case", "inspect_character_model"],
  write: ["new_room", "apply_ops", "render", "map_case", "install_map", "import_model", "import_models", "import_vtt", "add_piece_type", "register_kit", "import_character", "render_character", "render_portrait"] };
const ROLES = { // which goblin gets which tools (shorter lists suit small local models)
  mapper: ["list_pieces", "list_presets", "list_rooms", "list_maps", "list_kits", "new_room", "apply_ops", "validate", "ascii", "render", "plan_case", "map_case", "install_map"],
  sculptor: ["list_pieces", "add_piece_type", "import_model", "import_models", "list_kits", "register_kit", "inspect_character_model", "import_character", "list_character_kit", "render_character", "list_bust_parts", "suggest_bust", "render_portrait"],
  snoop: ["list_pieces", "list_rooms", "list_maps", "list_kits", "validate", "ascii", "render", "plan_case", "list_character_kit"],
  foreman: ["list_rooms", "list_maps", "list_presets", "plan_case"],
  wizard: "all", grunt: "all" };
(async () => {
  const { TOOLS } = await import(pathToFileURL(path.join(__dirname, "..", "..", "public", "lab", "api.js")).href);
  const out = TOOLS.map((t) => ({ name: "studio_" + t.name, studio: t.name, risk: RISK.read.includes(t.name) ? "read" : "write", description: "[Map Studio] " + t.description, parameters: t.parameters }));
  const unknown = TOOLS.map((t) => t.name).filter((n) => !RISK.read.includes(n) && !RISK.write.includes(n)); if (unknown.length) { console.error("give these a risk in build-overlord-adapter.js: " + unknown.join(", ")); process.exit(1); }
  const roles = {}; for (const [r, l] of Object.entries(ROLES)) roles[r] = l === "all" ? out.map((x) => x.name) : l.map((n) => "studio_" + n);
  fs.writeFileSync(path.join(__dirname, "..", "..", "studio", "overlord", "mapstudio-tools.json"), JSON.stringify({ tools: out, roles }, null, 1)); console.log(`mapstudio-tools.json: ${out.length} tools; ` + Object.entries(roles).map(([r, l]) => `${r} ${l.length}`).join(", "));
})();
