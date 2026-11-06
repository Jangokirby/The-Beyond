/* Standalone live-table transport. Supplies window.claude.use("db"|"user") over a WebSocket to server.js,
   so live.js runs unchanged outside Claude. Room code lives in the URL hash: #room=ABCDE */
(function () {
  if (window.claude && window.claude.use) return;
  const LS = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return v === undefined ? null : v; };
  const rnd = (n) => Array.from(crypto.getRandomValues(new Uint8Array(n)), (b) => "abcdefghijklmnopqrstuvwxyz0123456789"[b % 36]).join("");
  let uid = LS("beyond.uid"); if (!uid) { uid = "p" + rnd(12); LS("beyond.uid", uid); }
  let token = LS("beyond.token"); if (!token) { token = rnd(32); LS("beyond.token", token); }
  const roomCode = () => ((location.hash.match(/room=([A-Za-z0-9]+)/) || [])[1] || "").toUpperCase();
  const NET = (window.NET = { uid, host: false, room: roomCode(), status: "idle", error: "" });

  let ws = null, ready = null, nid = 0, rid = 0;
  const subs = new Map(), acks = new Map();
  const wsUrl = () => (location.protocol === "https:" ? "wss://" : "ws://") + location.host + "/live";

  function connect(create) {
    return new Promise((resolve, reject) => {
      NET.status = "connecting";
      const s = (ws = new WebSocket(wsUrl()));
      let done = false;
      s.onopen = () => s.send(JSON.stringify({ t: "hello", room: NET.room, uid, token, create: !!create }));
      s.onmessage = (ev) => {
        const m = JSON.parse(ev.data);
        if (m.t === "hi") { NET.host = m.host; NET.room = m.room; NET.status = "on"; done = true; resubscribe(); resolve(m); }
        else if (m.t === "err") { NET.status = "error"; NET.error = m.msg; if (!done) reject(new Error(m.msg)); }
        else if (m.t === "snap") { const sub = subs.get(m.id); if (sub) sub.deliver(m); }
        else if (m.t === "ack") { const a = acks.get(m.rid); if (a) { acks.delete(m.rid); m.ok ? a.res() : a.rej(new Error(m.err || "write refused")); } }
      };
      s.onclose = () => { if (ws !== s) return; NET.status = "off"; for (const a of acks.values()) a.rej(new Error("disconnected")); acks.clear(); if (done) setTimeout(() => { if (ws === s && NET.room) connect(false).catch(() => {}); }, 1500); else reject(new Error("could not connect")); };
      s.onerror = () => {};
    });
  }
  function resubscribe() { for (const [id, sub] of subs) ws.send(JSON.stringify({ t: "sub", id, kind: sub.kind, path: sub.path })); }
  function write(op, path, data) {
    return new Promise((res, rej) => {
      if (!ws || ws.readyState !== 1) return rej(new Error("offline"));
      const r = ++rid; acks.set(r, { res, rej });
      ws.send(JSON.stringify({ t: "w", rid: r, op, path, data }));
    });
  }
  const sub = (kind, path, cb, err) => {
    const id = ++nid; subs.set(id, { kind, path, deliver: cb });
    if (ws && ws.readyState === 1 && NET.status === "on") ws.send(JSON.stringify({ t: "sub", id, kind, path }));
    return () => { subs.delete(id); if (ws && ws.readyState === 1) ws.send(JSON.stringify({ t: "unsub", id })); };
  };
  const db = {
    doc: (path) => ({
      id: path.split("/").pop(), path,
      set: (d) => write("set", path, d), update: (d) => write("update", path, d), delete: () => write("delete", path),
      onSnapshot: (cb, err) => sub("doc", path, (m) => cb({ exists: !!m.exists, id: path.split("/").pop(), data: () => m.data }), err),
      get: () => new Promise((res) => { const un = sub("doc", path, (m) => { setTimeout(un); res({ exists: !!m.exists, data: () => m.data }); }); }),
    }),
    collection: (path) => ({
      doc: (id) => db.doc(path + "/" + id),
      onSnapshot: (cb, err) => { let prev = {}; return sub("col", path, (m) => {
        const cur = {}, ch = [];
        for (const d of m.docs) { const j = JSON.stringify(d.data); cur[d.id] = j; if (prev[d.id] !== j) ch.push({ type: d.id in prev ? "modified" : "added", doc: { id: d.id, data: () => d.data } }); }
        for (const id in prev) if (!(id in cur)) ch.push({ type: "removed", doc: { id, data: () => ({}) } });
        prev = cur;
        cb({ docs: m.docs.map((d) => ({ id: d.id, data: () => d.data })), docChanges: () => ch });
      }, err); },
    }),
  };
  const user = { id: async () => uid, canEdit: async () => NET.host, isOwner: () => NET.host, me: async () => ({ id: uid }) };

  NET.create = async () => { await connect(true); location.hash = "room=" + NET.room; try { LS("beyond.host." + NET.room, "1"); } catch (e) {} return NET.room; };
  NET.join = (code) => { location.hash = "room=" + String(code || "").toUpperCase().replace(/[^A-Z0-9]/g, ""); location.reload(); };
  NET.link = () => location.origin + location.pathname + "#room=" + NET.room;
  NET.leave = () => { location.hash = ""; location.reload(); };

  if (NET.room) ready = connect(false).catch((e) => { NET.error = e.message; });
  window.claude = {
    use: async (name) => {
      if (name !== "db" && name !== "user") return null;
      if (!NET.room) return null;
      await ready; if (NET.status !== "on") return null;
      return name === "db" ? db : user;
    },
  };
  /* "Host a table" creates a room, then LIVE re-initialises against it */
  NET.start = async () => { await NET.create(); ready = Promise.resolve(); if (window.LIVE) await window.LIVE.init(); };
})();
