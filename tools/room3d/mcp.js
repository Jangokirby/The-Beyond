#!/usr/bin/env node
/* An MCP server (Model Context Protocol) for the map tool, over stdio. Any MCP client can use it: Claude Desktop, Claude Code,
   Cursor, and local setups such as LM Studio or Open WebUI with an MCP bridge. It exposes the same tools as the command line.
   Add to a client's config:  { "mcpServers": { "beyond-maps": { "command": "node", "args": ["<path>/tools/room3d/mcp.js"] } } } */
const { fns } = require("./lib.js");
const TOOLS = [
  ["list_pieces", "List the furniture and props you may place (id, size in metres, whether it blocks walking, tags).", { type: "object", properties: { tag: { type: "string" } } }],
  ["presets", "List the room presets that furnish a room in one step (ward, tavern, study, cellar, ...).", { type: "object", properties: {} }],
  ["new_room", "Start a room. x runs 0..w left to right, z 0..h top to bottom. Returns {layout}.", { type: "object", properties: { w: { type: "number" }, h: { type: "number" }, name: { type: "string" }, style: { type: "object" } }, required: ["w", "h"] }],
  ["apply_ops", "Change a layout. ops: set_style, furnish{preset}, clear_props, add_piece{t,x,z,rot}, move_piece{index,x,z,rot}, remove_piece{index}, add_door{x,z,w,axis h|v}, add_window, add_wall{a,b}, add_thing{x,z,label,text,act,res}, set_npc, set_start. Returns {layout, errors, notes}; fix the errors and call again.", { type: "object", properties: { layout: { type: "object" }, ops: { type: "array", items: { type: "object" } } }, required: ["layout", "ops"] }],
  ["validate", "Check a layout for overlaps, pieces outside the room, and doors or examine spots that cannot be reached.", { type: "object", properties: { layout: { type: "object" } }, required: ["layout"] }],
  ["ascii", "Draw the room as text (1 char = 0.5 m) so you can see it without images.", { type: "object", properties: { layout: { type: "object" } }, required: ["layout"] }],
  ["render", "Render the layout to a jpg and a map pack. Returns the file paths.", { type: "object", properties: { layout: { type: "object" }, name: { type: "string" } }, required: ["layout", "name"] }],
  ["add_piece_type", "Define a NEW piece from primitives (box, cyl, cone, sphere) and save it to the catalog.", { type: "object", properties: { spec: { type: "object" } }, required: ["spec"] }],
  ["import_model", "Add a .glb/.gltf 3D model file as a piece. Give file, id, name, tags, and height in metres.", { type: "object", properties: { file: { type: "string" }, id: { type: "string" }, name: { type: "string" }, tags: { type: "array", items: { type: "string" } }, height: { type: "number" } }, required: ["file", "id"] }],
  ["import_vtt", "Convert a Dungeon Alchemist or Dungeondraft export (.dd2vtt/.uvtt) into a map pack.", { type: "object", properties: { file: { type: "string" }, name: { type: "string" } }, required: ["file"] }],
  ["install_map", "Put a map pack into a scene of a written case, optionally with spots and npcs positions.", { type: "object", properties: { case_id: { type: "string" }, scene: { type: "string" }, pack: { type: "string" }, spots: { type: "object" }, npcs: { type: "object" }, start: { type: "array", items: { type: "number" } } }, required: ["case_id", "scene", "pack"] }],
  ["map_case", "Make maps automatically for every scene of a written case, by id.", { type: "object", properties: { case_id: { type: "string" } }, required: ["case_id"] }]
];
const send = (o) => process.stdout.write(JSON.stringify(o) + "\n");
let buf = ""; process.stdin.on("data", async (d) => {
  buf += d; let i; while ((i = buf.indexOf("\n")) >= 0) { const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1); if (!line) continue; let m; try { m = JSON.parse(line); } catch (e) { continue; }
    if (m.method === "initialize") send({ jsonrpc: "2.0", id: m.id, result: { protocolVersion: (m.params && m.params.protocolVersion) || "2024-11-05", capabilities: { tools: {} }, serverInfo: { name: "beyond-maps", version: "1" } } });
    else if (m.method === "tools/list") send({ jsonrpc: "2.0", id: m.id, result: { tools: TOOLS.map(([name, description, inputSchema]) => ({ name, description, inputSchema })) } });
    else if (m.method === "tools/call") { const f = fns[m.params.name]; if (!f) { send({ jsonrpc: "2.0", id: m.id, error: { code: -32601, message: "no such tool" } }); continue; } try { const r = await f(m.params.arguments || {}); send({ jsonrpc: "2.0", id: m.id, result: { content: [{ type: "text", text: JSON.stringify(r) }] } }); } catch (e) { send({ jsonrpc: "2.0", id: m.id, result: { isError: true, content: [{ type: "text", text: e.message }] } }); } }
    else if (m.id !== undefined) send({ jsonrpc: "2.0", id: m.id, result: {} }); }
});
