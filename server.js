/* The Beyond — static host + live table relay. No database needed; rooms live in memory and are saved to ./data/rooms.json */
const http = require("http"), fs = require("fs"), path = require("path");
const { WebSocketServer } = require("ws");

const PORT = process.env.PORT || 3000;
const PUB = path.join(__dirname, "public");
const DATA = process.env.DATA_DIR || path.join(__dirname, "data");
const MAX_ROOMS = 300, MAX_DOC = 256 * 1024, MAX_PLAYERS = 12, ROOM_TTL = 3 * 24 * 3600 * 1000;
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".ogg": "audio/ogg", ".wav": "audio/wav", ".woff2": "font/woff2", ".ico": "image/x-icon", ".webmanifest": "application/manifest+json" };

/* ---------- rooms ---------- */
let rooms = {};
try { rooms = JSON.parse(fs.readFileSync(path.join(DATA, "rooms.json"), "utf8")); } catch (e) {}
for (const r of Object.values(rooms)) { r.clients = new Set(); r.docs = r.docs || {}; r.users = r.users || {}; }
let dirty = false;
setInterval(() => {
  const now = Date.now();
  for (const [k, r] of Object.entries(rooms)) if (!r.clients.size && now - r.touched > ROOM_TTL) { delete rooms[k]; dirty = true; }
  if (!dirty) return; dirty = false;
  try {
    fs.mkdirSync(DATA, { recursive: true });
    const out = {}; for (const [k, r] of Object.entries(rooms)) out[k] = { hostToken: r.hostToken, docs: r.docs, users: r.users, touched: r.touched };
    fs.writeFileSync(path.join(DATA, "rooms.json.tmp"), JSON.stringify(out)); fs.renameSync(path.join(DATA, "rooms.json.tmp"), path.join(DATA, "rooms.json"));
  } catch (e) { console.error("save failed", e.message); }
}, 15000);

const code = () => { const a = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; let s = ""; for (let i = 0; i < 5; i++) s += a[Math.floor(Math.random() * a.length)]; return s; };
const segs = (p) => String(p).split("/").filter(Boolean);
const validPath = (p) => typeof p === "string" && p.length < 200 && /^[\w\-./]+$/.test(p) && !p.includes("..");

function canWrite(c, p) {
  if (c.host) return true;
  const s = segs(p);
  return s.length === 4 && s[0] === "live" && s[1] === "lobby" && (s[2] === "seats" || s[2] === "in" || s[2] === "chat") && s[3] === c.uid;
}
const kids = (room, prefix) => {
  const out = [], pre = prefix.replace(/\/$/, "") + "/";
  for (const k of Object.keys(room.docs)) if (k.startsWith(pre) && !k.slice(pre.length).includes("/")) out.push({ id: k.slice(pre.length), data: room.docs[k] });
  return out;
};
const send = (ws, o) => { if (ws.readyState === 1) ws.send(JSON.stringify(o)); };
function notify(room, p) {
  for (const c of room.clients) for (const [id, sub] of c.subs) {
    if (sub.kind === "doc" && sub.path === p) send(c.ws, { t: "snap", id, exists: p in room.docs, data: room.docs[p] });
    else if (sub.kind === "col") { const pre = sub.path.replace(/\/$/, "") + "/"; if (p.startsWith(pre) && !p.slice(pre.length).includes("/")) send(c.ws, { t: "snap", id, docs: kids(room, sub.path) }); }
  }
}

/* ---------- http ---------- */
const server = http.createServer((req, res) => {
  let u = decodeURIComponent((req.url || "/").split("?")[0]);
  if (u === "/healthz") { res.end("ok"); return; }
  if (u.endsWith("/")) u += "index.html";
  const f = path.normalize(path.join(PUB, u));
  if (!f.startsWith(PUB)) { res.writeHead(403); res.end(); return; }
  fs.readFile(f, (err, buf) => {
    if (err) { res.writeHead(404); res.end("not found"); return; }
    const ext = path.extname(f).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream", "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=3600" });
    res.end(buf);
  });
});

/* ---------- websocket ---------- */
const wss = new WebSocketServer({ server, path: "/live", maxPayload: 1024 * 1024 });
wss.on("connection", (ws) => {
  const c = { ws, room: null, uid: null, host: false, subs: new Map(), n: 0, t0: Date.now() };
  ws.on("message", (raw) => {
    let m; try { m = JSON.parse(raw); } catch (e) { return; }
    if (!c.room) {
      if (m.t !== "hello" || typeof m.uid !== "string" || typeof m.token !== "string" || m.uid.length > 60 || m.token.length > 80) return ws.close();
      let room, rc = String(m.room || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
      if (m.create) {
        if (Object.keys(rooms).length >= MAX_ROOMS) return send(ws, { t: "err", msg: "Server is full, try later." });
        do { rc = code(); } while (rooms[rc]);
        room = rooms[rc] = { hostToken: m.token, docs: {}, users: {}, clients: new Set(), touched: Date.now() };
        dirty = true;
      } else room = rooms[rc];
      if (!room) return send(ws, { t: "err", msg: "No table with that code." });
      if (room.users[m.uid] && room.users[m.uid] !== m.token) return send(ws, { t: "err", msg: "That seat id is in use." });
      if (!room.users[m.uid] && Object.keys(room.users).length >= MAX_PLAYERS) return send(ws, { t: "err", msg: "Table is full." });
      room.users[m.uid] = m.token;
      Object.assign(c, { room, uid: m.uid, host: room.hostToken === m.token, code: rc });
      room.clients.add(c); room.touched = Date.now(); dirty = true;
      return send(ws, { t: "hi", room: rc, host: c.host, count: room.clients.size });
    }
    const room = c.room; room.touched = Date.now();
    if (m.t === "sub" && validPath(m.path) && c.subs.size < 20) {
      c.subs.set(m.id, { kind: m.kind === "col" ? "col" : "doc", path: m.path });
      if (m.kind === "col") send(ws, { t: "snap", id: m.id, docs: kids(room, m.path) });
      else send(ws, { t: "snap", id: m.id, exists: m.path in room.docs, data: room.docs[m.path] });
    } else if (m.t === "unsub") c.subs.delete(m.id);
    else if (m.t === "w") {
      const ack = (ok, err) => send(ws, { t: "ack", rid: m.rid, ok, err });
      if (!validPath(m.path)) return ack(false, "bad path");
      if (!canWrite(c, m.path)) return ack(false, "not allowed");
      if (++c.n > 2000 && (Date.now() - c.t0) / 1000 < c.n / 30) return ack(false, "slow down");
      if (m.op === "delete") delete room.docs[m.path];
      else {
        const cur = m.op === "update" ? Object.assign({}, room.docs[m.path] || {}, m.data) : m.data;
        if (!cur || typeof cur !== "object" || JSON.stringify(cur).length > MAX_DOC) return ack(false, "too large");
        room.docs[m.path] = cur;
      }
      dirty = true; ack(true); notify(room, m.path);
    }
  });
  ws.on("close", () => { if (c.room) c.room.clients.delete(c); });
  ws.on("error", () => {});
});
server.listen(PORT, () => console.log("The Beyond running on :" + PORT));
