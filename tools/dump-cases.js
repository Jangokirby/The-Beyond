/* Prints every case's people, enemies, scenes and fights as JSON (used by tools/build-painted.py). */
const fs = require("fs"), path = require("path");
const PUB = path.join(__dirname, "..", "public");
global.document = { addEventListener() {} };
global.window = { ART: { SKIN: Array(10).fill(0), HAIRC: Array(12).fill(0), OUTFIT: Array(14).fill(0) }, ADV: { LIBRARY: {}, register(a) { this.LIBRARY[a.id] = a; } } };
window.PACKS = { define(p) { for (const a of p.cases) window.ADV.register(a); } };
const js = fs.readdirSync(path.join(PUB, "js")).filter((f) => /^modules\d*[bc]?\.js$/.test(f)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
for (const f of ["js/casekit.js", ...js.map((f) => "js/" + f), "js/tutorial.js", ...fs.readdirSync(path.join(PUB, "packs")).filter((f) => f.endsWith(".js")).map((f) => "packs/" + f)]) { const p = path.join(PUB, f); if (fs.existsSync(p)) eval(fs.readFileSync(p, "utf8")); }
const out = {};
for (const a of Object.values(window.ADV.LIBRARY)) out[a.id] = { year: a.year, npcs: Object.fromEntries(Object.entries(a.npcs || {}).map(([k, n]) => [k, n.recurs || ""])), enemies: Object.keys(a.enemies || {}), scenes: Object.keys(a.scenes || {}), fights: Object.keys(a.encounters || {}) };
console.log(JSON.stringify(out));
