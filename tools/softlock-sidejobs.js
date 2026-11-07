/* Runs the soft-lock checker over a few hundred generated side jobs. */
const { check } = require("./softlock.js");
const fs = require("fs"), path = require("path"), PUB = path.join(__dirname, "..", "public");
window.ASSETS = { scenes: {}, portraits: {}, sprites: {} };
for (const f of ["cdata.js", "gamedata.js", "art.js"]) eval(fs.readFileSync(path.join(PUB, "js", f), "utf8"));
window.CAMP = { rollName: () => "Ann Example", migrate: () => {}, advList: () => [], allAdventures: () => [], ui: {} };
window.UI = { el: () => {} };
const lib = window.ADV.LIBRARY; eval(fs.readFileSync(path.join(PUB, "js", "adv.js"), "utf8")); Object.assign(window.ADV.LIBRARY, lib);
eval(fs.readFileSync(path.join(PUB, "js", "gen-text.js"), "utf8"));
eval(fs.readFileSync(path.join(PUB, "js", "gen.js"), "utf8"));
/* no unfilled placeholders anywhere in a job */
const holes = (a) => (JSON.stringify(a).match(/\{[a-zA-Z_]+\}/g) || []);
let bad = 0, n = 0;
for (const y of [1200, 1700, 1888, 1916, 1944, 1960, 1985, 2005, 2030]) for (let m = 0; m < 12; m++) for (let i = 0; i < 3; i++) {
  const c = { id: "c" + m, year: y, agency: "WCA", missionsDone: m };
  for (const pull of [0, 5, 9]) {
    global.WORLD = window.WORLD = { ensure: () => ({ pull, threats: [] }) };
    const a = window.GEN.make(`c${m}:${m}:${i}`, c, { slot: i, base: m * 31 + 7 }); n++;
    const h = holes(a); if (h.length) { bad++; console.log("PLACEHOLDER", a.title, [...new Set(h)].join(" ")); continue; }
    const r = check(a);
    const issues = r.locks.length + r.noWin.length + r.broken.length + (r.wins ? 0 : 1);
    if (issues) { bad++; if (bad < 6) console.log("PROBLEM", y, a.title, JSON.stringify(r.locks.concat(r.noWin).slice(0, 2).map((x) => x.path.slice(1).join(" > ")))); }
  }
}
console.log(`${n} side jobs checked, ${bad} with problems`);
process.exit(bad ? 1 : 0);
