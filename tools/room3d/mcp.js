#!/usr/bin/env node
/* An MCP server (Model Context Protocol) for the map tool, over stdio. Any MCP client can use it: Claude Desktop, Claude Code,
   Cursor, and local setups such as LM Studio or Open WebUI with an MCP bridge. It exposes the same tools as the command line.
   Add to a client's config:  { "mcpServers": { "beyond-maps": { "command": "node", "args": ["<path>/tools/room3d/mcp.js"] } } } */
const { fns } = require("./lib.js");
/* the tool list lives in public/lab/api.js (TOOLS): one place, so the CLI, MCP and function-calling lists cannot drift apart */
let TOOLS = [], loaded = import(require("url").pathToFileURL(require("path").join(__dirname, "..", "..", "public", "lab", "api.js")).href).then((m) => { TOOLS = m.TOOLS.map((t) => [t.name, t.description, t.parameters]); });
const send = (o) => process.stdout.write(JSON.stringify(o) + "\n");
let buf = ""; process.stdin.on("data", async (d) => {
  buf += d; let i; while ((i = buf.indexOf("\n")) >= 0) { const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1); if (!line) continue; let m; try { m = JSON.parse(line); } catch (e) { continue; }
    if (m.method === "initialize") send({ jsonrpc: "2.0", id: m.id, result: { protocolVersion: (m.params && m.params.protocolVersion) || "2024-11-05", capabilities: { tools: {} }, serverInfo: { name: "beyond-maps", version: "1" } } });
    else if (m.method === "tools/list") { await loaded; send({ jsonrpc: "2.0", id: m.id, result: { tools: TOOLS.map(([name, description, inputSchema]) => ({ name, description, inputSchema })) } }); }
    else if (m.method === "tools/call") { const f = fns[m.params.name]; if (!f) { send({ jsonrpc: "2.0", id: m.id, error: { code: -32601, message: "no such tool" } }); continue; } try { const r = await f(m.params.arguments || {}); send({ jsonrpc: "2.0", id: m.id, result: { content: [{ type: "text", text: JSON.stringify(r) }] } }); } catch (e) { send({ jsonrpc: "2.0", id: m.id, result: { isError: true, content: [{ type: "text", text: e.message }] } }); } }
    else if (m.id !== undefined) send({ jsonrpc: "2.0", id: m.id, result: {} }); }
});
