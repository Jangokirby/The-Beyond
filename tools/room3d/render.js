/* Renders a layout to a picture with the same kit the editor uses.
   usage: node render.js <layout.json | preset:tavern:16:11> <outname>   writes <outname>.beyondmap (picture + walls + lights), .layout.json and .jpg
   (starts the game's own server; needs playwright) */
const { chromium } = require("playwright"); const { spawn } = require("child_process"); const fs = require("fs"), path = require("path");
(async () => {
  const root = path.join(__dirname, "..", ".."), arg = process.argv[2] || "public/lab/layouts/ward.json", out = process.argv[3] || "render";
  const rel = arg.startsWith("preset:") ? "/" + arg : "/" + path.relative(path.join(root, "public/lab"), path.resolve(arg)).split(path.sep).join("/");
  const srv = spawn("node", ["server.js"], { cwd: root, env: { ...process.env, PORT: "8766" } }); await new Promise((r) => setTimeout(r, 1500));
  const b = await chromium.launch({ args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] }), p = await b.newPage({ viewport: { width: 1700, height: 1300 } });
  await p.goto("http://localhost:8766/lab/render.html#" + rel.replace(/^\//, "")); await p.waitForFunction(() => window.DONE, null, { timeout: 90000 });
  const pack = await p.evaluate(() => window.PACK);
  fs.writeFileSync(out + ".beyondmap", JSON.stringify(pack)); fs.writeFileSync(out + ".layout.json", JSON.stringify(pack.layout, null, 1)); fs.writeFileSync(out + ".jpg", Buffer.from(pack.image.split(",")[1], "base64"));
  console.log("wrote", out + ".beyondmap", pack.view.W + "x" + pack.view.H);
  await b.close(); srv.kill();
})();
