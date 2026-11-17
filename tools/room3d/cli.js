#!/usr/bin/env node
/* Command line for the map tool. Everything reads and writes JSON, so a script, a local model or Claude Code can drive it.
     node tools/room3d/cli.js <command> '<json arguments>'      (or pipe the JSON in)      node tools/room3d/cli.js help
   Layouts are plain JSON: pass them in, get them back; "render" writes files. */
const { fns } = require("./lib.js");
const cmd = process.argv[2], rest = process.argv.slice(3).join(" ");
(async () => {
  if (!cmd || cmd === "help") { console.log("commands: " + Object.keys(fns).join(", ") + "\nexample: node tools/room3d/cli.js new_room '{\"w\":12,\"h\":9}'"); return; }
  if (!fns[cmd]) { console.error("unknown command: " + cmd); process.exit(1); }
  let input = rest; if (!input && !process.stdin.isTTY) input = require("fs").readFileSync(0, "utf8");
  let args = {}; if (input && input.trim()) { try { args = JSON.parse(input); } catch (e) { console.error("the arguments must be JSON: " + e.message); process.exit(1); } }
  console.log(JSON.stringify(await fns[cmd](args), null, 1));
})().catch((e) => { console.error(e.message); process.exit(1); });
