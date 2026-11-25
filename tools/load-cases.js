/* Loads every written case (modules and packs) into a plain object, outside the browser. Used by the map generator. */
const fs = require("fs"), path = require("path");
module.exports = function loadCases() {
  const PUB = path.join(__dirname, "..", "public");
  global.document = { addEventListener() {} };
  global.window = { ART: { SKIN: Array(10).fill(0), HAIRC: Array(12).fill(0), OUTFIT: Array(14).fill(0) }, ADV: { LIBRARY: {}, register(a) { this.LIBRARY[a.id] = a; } } };
  window.PACKS = { define(p) { for (const a of p.cases) window.ADV.register(a); } };
  const mods = fs.readdirSync(path.join(PUB, "js")).filter((f) => /^modules\d*[bc]?\.js$/.test(f)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const files = ["js/casekit.js", ...mods.map((f) => "js/" + f), "js/tutorial.js", ...fs.readdirSync(path.join(PUB, "packs")).filter((f) => f.endsWith(".js")).map((f) => "packs/" + f)];
  for (const f of files) { const p = path.join(PUB, f); if (fs.existsSync(p)) { try { (0, eval)(fs.readFileSync(p, "utf8")); } catch (e) { /* a file that needs the browser is skipped */ } } }
  return window.ADV.LIBRARY;
};
