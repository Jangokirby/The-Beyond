#!/usr/bin/env node
/* One-time setup on a new machine: installs what the drawing tools need (Playwright + its Chromium) without touching package.json.
   Run from anywhere:  node studio/setup.js */
const { spawnSync } = require("child_process"), path = require("path"), root = path.join(__dirname, "..");
const run = (c, a) => { console.log("> " + [c, ...a].join(" ")); const r = spawnSync(c, a, { cwd: root, stdio: "inherit", shell: process.platform === "win32" }); if (r.status !== 0) { console.error("failed: " + c + " " + a.join(" ")); process.exit(1); } };
const major = +process.versions.node.split(".")[0]; if (major < 18) { console.error("Node 18 or newer is needed (you have " + process.versions.node + ")"); process.exit(1); }
run("npm", ["install"]); run("npm", ["install", "--no-save", "playwright"]); run("npx", ["playwright", "install", "chromium"]);
console.log("\nSetup done. Start Map Studio with:  node studio/studio.js --open\nCheck everything works with:  node tools/room3d/selftest.js");
