#!/usr/bin/env node
/* MAP STUDIO: the map and character tools as a local app.
   Run:  node studio/studio.js [--open]        (or studio/start.sh, studio/start.bat, or the desktop window: studio/README.md)
   What it gives you:
     /                  the hub: links to the Map Builder, Map Lab and Character Builder, plus a console that runs any tool
     /lab/...           the lab pages and files (maps, pieces, kits, portraits)
     GET  /api/health   { ok, version, tools }
     GET  /api/tools    the tool list (name, description, JSON schema), same as tools/room3d/tools.json
     POST /api/tool/<name>    body: JSON arguments; reply: JSON result.  e.g. POST /api/tool/new_room {"w":12,"h":9}
     PUT  /api/upload/<file>  raw bytes -> saved in studio/inbox/, reply { path } (for agents on another machine; give that path to import_models etc.)
     POST /api/selftest       runs tools/room3d/selftest.js and returns its report
   Safety: it listens on 127.0.0.1 only unless you set STUDIO_HOST. If you expose it on a network, set STUDIO_TOKEN and send "Authorization: Bearer <token>". */
const http = require("http"), fs = require("fs"), path = require("path"), { spawn } = require("child_process");
const ROOT = path.join(__dirname, ".."), LAB = path.join(ROOT, "public", "lab"), INBOX = path.join(__dirname, "inbox"), HUB = path.join(__dirname, "index.html");
const PORT = +process.env.STUDIO_PORT || 47330, HOST = process.env.STUDIO_HOST || "127.0.0.1", TOKEN = process.env.STUDIO_TOKEN || "";
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".glb": "model/gltf-binary", ".gltf": "model/gltf+json", ".beyondmap": "application/json", ".svg": "image/svg+xml" };
let fns = null, TOOLS = null; const loadTools = async () => { if (!fns) { fns = require("../tools/room3d/lib.js").fns; TOOLS = (await import(require("url").pathToFileURL(path.join(LAB, "api.js")).href)).TOOLS; } };
const json = (res, code, o) => { res.writeHead(code, { "Content-Type": "application/json" }); res.end(JSON.stringify(o)); };
const body = (req, max = 200 * 1024 * 1024) => new Promise((ok, no) => { const c = []; let n = 0; req.on("data", (d) => { n += d.length; if (n > max) { no(new Error("too large")); req.destroy(); } else c.push(d); }); req.on("end", () => ok(Buffer.concat(c))); req.on("error", no); });
const okOrigin = (o) => !o || /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(o);
let busy = Promise.resolve();   // tools that draw run one at a time

function start(port = PORT) {
  const srv = http.createServer(async (req, res) => {
    const u = new URL(req.url, "http://x"), p = decodeURIComponent(u.pathname), origin = req.headers.origin;
    if (!okOrigin(origin) && !TOKEN) { res.writeHead(403); return res.end("origin not allowed"); }
    if (origin) { res.setHeader("Access-Control-Allow-Origin", origin); res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS"); }
    if (req.method === "OPTIONS") { res.writeHead(204); return res.end(); }
    try {
      if (p.startsWith("/api/")) {
        if (TOKEN && req.headers.authorization !== "Bearer " + TOKEN) return json(res, 401, { ok: false, error: "missing or wrong token" });
        await loadTools();
        if (p === "/api/health") return json(res, 200, { ok: true, app: "map-studio", version: require("./package.json").version, tools: TOOLS.length });
        if (p === "/api/tools") return json(res, 200, TOOLS);
        let m;
        if ((m = p.match(/^\/api\/tool\/([a-z_]+)$/)) && req.method === "POST") {
          const f = fns[m[1]]; if (!f) return json(res, 404, { ok: false, error: "no such tool: " + m[1] });
          let args = {}; const raw = (await body(req, 64 * 1024 * 1024)).toString("utf8"); if (raw.trim()) { try { args = JSON.parse(raw); } catch (e) { return json(res, 400, { ok: false, error: "body must be JSON: " + e.message }); } }
          const run = busy.then(() => f(args)); busy = run.catch(() => {}); let r; try { r = await run; } catch (e) { return json(res, 500, { ok: false, error: e.message }); }
          return json(res, 200, r === undefined ? { ok: true } : r);
        }
        if ((m = p.match(/^\/api\/upload\/([\w.\- ]+)$/)) && req.method === "PUT") { fs.mkdirSync(INBOX, { recursive: true }); const dst = path.join(INBOX, path.basename(m[1])); fs.writeFileSync(dst, await body(req)); return json(res, 200, { ok: true, path: dst }); }
        if (p === "/api/selftest" && req.method === "POST") { const c = spawn("node", [path.join(ROOT, "tools/room3d/selftest.js")], { cwd: ROOT }); let out = ""; c.stdout.on("data", (d) => out += d); c.stderr.on("data", (d) => out += d); c.on("close", (code) => json(res, 200, { ok: code === 0, report: out })); return; }
        return json(res, 404, { ok: false, error: "unknown API path" });
      }
      if (p === "/" || p === "/index.html") { res.writeHead(200, { "Content-Type": MIME[".html"] }); return res.end(fs.readFileSync(HUB)); }
      if (p.startsWith("/lab/")) { const f = path.normalize(path.join(LAB, p.slice(5))); if (!f.startsWith(LAB) || /_licensed/.test(p) && false) { res.writeHead(403); return res.end(); } return fs.readFile(f, (e, b) => { if (e) { res.writeHead(404); return res.end("not found"); } res.writeHead(200, { "Content-Type": MIME[path.extname(f).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-cache" }); res.end(b); }); }
      res.writeHead(404); res.end("not found");
    } catch (e) { json(res, 500, { ok: false, error: e.message }); }
  });
  return new Promise((ok, no) => { srv.on("error", no); srv.listen(port, HOST, () => ok(srv)); });
}
module.exports = { start, PORT, HOST };
if (require.main === module) start().then(() => { const url = `http://${HOST === "0.0.0.0" ? "localhost" : HOST}:${PORT}/`; console.log(`Map Studio running at ${url}${TOKEN ? "  (token required for /api)" : ""}`); if (process.argv.includes("--open")) { const o = process.platform === "win32" ? ["cmd", ["/c", "start", url]] : process.platform === "darwin" ? ["open", [url]] : ["xdg-open", [url]]; try { spawn(o[0], o[1], { stdio: "ignore", detached: true }).unref(); } catch (e) {} } }).catch((e) => { console.error(e.code === "EADDRINUSE" ? `Port ${PORT} is already in use: Map Studio may already be running (set STUDIO_PORT to use another).` : e.message); process.exit(1); });
