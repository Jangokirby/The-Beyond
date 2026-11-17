/* ============================================================================
   WALK: move your team through the picture. Arrow keys or WASD (or click the ground) walk the leader;
   the others follow. Walk up to a thing you can examine, a person or an exit and press E (or Enter,
   or Space) to use it. The buttons still work, so nobody is forced to walk.
   Switch it off in Settings (Roleplaying features).
   ========================================================================== */
(function () {
  const G = window.GAME, U = window.UI; if (!G || !U) return;
  const el = U.el, W = (window.WALK = { on: false });
  const keys = new Set(); let raf = 0, layer = null, tokens = [], pos = { x: 50, y: 82 }, trail = [], lastLoc = "", prompt = null, target = null;
  const R = 0.3, WSPEED = 0.075, mm = () => window.MAPMODE && MAPMODE.cur();
  let wpos = { x: 0, z: 0 }, wtrail = [], wloc = "", wtarget = null;
  const blockedW = (m, x, z) => { const L = m.pk.layout; if (x < R || z < R || x > L.w - R || z > L.h - R) return true; for (const f of m.pk.foot) if (x > f.x - R && x < f.x + f.w + R && z > f.z - R && z < f.z + f.h + R) return true; for (const s of m.pk.collide) { const [x1, z1, x2, z2] = s, dx = x2 - x1, dz = z2 - z1, l = dx * dx + dz * dz || 1, u = Math.max(0, Math.min(1, ((x - x1) * dx + (z - z1) * dz) / l)); if (Math.hypot(x - (x1 + u * dx), z - (z1 + u * dz)) < R * .9) return true; } for (const n of Object.values(m.map.npcs || {})) if (Math.hypot(x - n[0], z - n[1]) < .6) return true; return false; };
  const SPEED = 0.55;   // percent of the picture per frame
  const stage = () => document.querySelector("#hotspots");
  const modalOpen = () => !!document.querySelector("#overlay:not([hidden]) .modal, #overlay .modal");
  const team = () => (G.active ? G.active() : []).filter((a) => !a.dead);
  const ensure = () => {
    const h = stage(); if (!h) return null;
    if (!layer || !layer.isConnected) { layer = el("div", { id: "walk", "aria-hidden": "true", style: "position:absolute;inset:0;z-index:5;pointer-events:none" }); h.parentNode.append(layer); }
    return layer;
  };
  const build = () => {
    const L = ensure(); if (!L) return; L.innerHTML = ""; tokens = [];
    team().slice(0, 4).forEach((a, i) => {
      const t = el("div", { class: "walktok", style: `position:absolute;width:5.2%;aspect-ratio:1;transform:translate(-50%,-100%);border-radius:50%;border:2px solid ${i ? "#cfd3da" : "#f2c14e"};overflow:hidden;background:#111;box-shadow:0 3px 8px rgba(0,0,0,.6);transition:left .06s linear, top .06s linear` }, el("img", { src: U.img(a.portrait, "portraits"), alt: "", style: "width:100%;height:100%;object-fit:cover" }));
      L.append(t); tokens.push(t);
    });
    prompt = el("div", { class: "walkprompt", style: "position:absolute;left:50%;bottom:3%;transform:translateX(-50%);padding:4px 10px;background:rgba(10,12,16,.88);color:#f2c14e;font:600 .85rem/1.2 monospace;border:1px solid #f2c14e;display:none;white-space:nowrap" });
    L.append(prompt); place();
  };
  const place = () => { tokens.forEach((t, i) => { const p = i === 0 ? pos : (trail[Math.min(trail.length - 1, i * 7)] || pos); t.style.left = p.x + "%"; t.style.top = p.y + "%"; t.style.zIndex = String(Math.round(p.y)); }); };
  const rectOf = (b) => { const s = stage().getBoundingClientRect(), r = b.getBoundingClientRect(); return { x: ((r.left - s.left) / s.width) * 100, y: ((r.top - s.top) / s.height) * 100, w: (r.width / s.width) * 100, h: (r.height / s.height) * 100 }; };
  const nearest = () => {
    let best = null, bd = 1e9;
    for (const b of stage().querySelectorAll(".hot")) { if (b.disabled) continue; const r = rectOf(b), cx = r.x + r.w / 2, cy = r.y + r.h / 2, dx = Math.max(0, Math.abs(pos.x - cx) - r.w / 2), dy = Math.max(0, Math.abs((pos.y - 3) - cy) - r.h / 2), d = Math.hypot(dx, dy); if (d < bd) { bd = d; best = b; } }
    return bd < 5 ? best : null;
  };
  const stepMap = (m) => {
    const loc = G.state && G.state.loc; if (loc !== wloc || !tokens.length) { wloc = loc; const s = m.map.start || m.pk.layout.start || [m.pk.layout.w / 2, m.pk.layout.h - 2]; wpos = { x: s[0], z: s[1] }; wtrail = []; wtarget = null; build(); }
    let dx = (keys.has("d") || keys.has("arrowright") ? 1 : 0) - (keys.has("a") || keys.has("arrowleft") ? 1 : 0), dz = (keys.has("s") || keys.has("arrowdown") ? 1 : 0) - (keys.has("w") || keys.has("arrowup") ? 1 : 0);
    if (dx || dz) wtarget = null; else if (wtarget) { const ex = wtarget.x - wpos.x, ez = wtarget.z - wpos.z, d = Math.hypot(ex, ez); if (d < .12) wtarget = null; else { dx = ex / d; dz = ez / d; } }
    if (dx || dz) { const n = Math.hypot(dx, dz) || 1, ox = wpos.x, oz = wpos.z; if (!blockedW(m, wpos.x + dx / n * WSPEED, wpos.z)) wpos.x += dx / n * WSPEED; if (!blockedW(m, wpos.x, wpos.z + dz / n * WSPEED)) wpos.z += dz / n * WSPEED; if (Math.hypot(wpos.x - ox, wpos.z - oz) > .01) { wtrail.unshift({ ...wpos }); wtrail.length = Math.min(wtrail.length, 60); } else wtarget = null; }
    const sp = (q) => { const [px, py] = MAPMODE.project(m.pk, q.x, q.z); return { x: (px / m.pk.view.W) * 100, y: (py / m.pk.view.H) * 100 }; };
    tokens.forEach((t, i) => { const q = i === 0 ? wpos : (wtrail[Math.min(wtrail.length - 1, i * 12)] || wpos), p = sp(q); t.style.left = p.x + "%"; t.style.top = p.y + "%"; t.style.width = "3.4%"; t.style.zIndex = String(Math.round(p.y)); });
    npcTokens(m);
    document.querySelectorAll("#hotspots .hot.near").forEach((b) => b.classList.remove("near")); let best = null, bd = 1e9;
    for (const h of m.loc.hotspots || []) { if (!h.mapPos) continue; const b = document.querySelector(`#hotspots .hot[data-id="${h.id}"]`); if (!b || b.disabled) continue; const d = Math.hypot(wpos.x - h.mapPos[0], wpos.z - h.mapPos[1]); if (d < bd) { bd = d; best = b; } }
    if (best && bd < 1.5) { best.classList.add("near"); const tg = best.querySelector(".tag"); prompt.textContent = `E · ${tg ? tg.textContent : "Use"}`; prompt.style.display = "block"; } else prompt.style.display = "none";
  };
  const npcTokens = (m) => { const L = ensure(); if (!L) return; for (const [id, p] of Object.entries(m.map.npcs || {})) { let e = L.querySelector(`.npctok[data-id="${id}"]`); const npc = (window.MODULE.npcs || {})[id] || {}; if (!e) { e = el("div", { class: "npctok", "data-id": id, title: npc.name || id, style: "position:absolute;width:3.4%;aspect-ratio:1;transform:translate(-50%,-100%);border-radius:50%;border:2px solid #c9b27a;overflow:hidden;background:#111;box-shadow:0 3px 8px rgba(0,0,0,.6)" }, el("img", { src: U.img(npc.portrait, "portraits"), alt: "", style: "width:100%;height:100%;object-fit:cover" })); L.append(e); } const [px, py] = MAPMODE.project(m.pk, p[0], p[1]); e.style.left = (px / m.pk.view.W) * 100 + "%"; e.style.top = (py / m.pk.view.H) * 100 + "%"; } };
  const step = () => {
    raf = requestAnimationFrame(step);
    { const m = mm(); if (m && W.on && stage() && !G.busy && !modalOpen()) return stepMap(m); }
    if (!W.on || !stage() || G.busy || modalOpen()) { if (prompt) prompt.style.display = "none"; return; }
    const loc = G.state && G.state.loc; if (loc !== lastLoc) { lastLoc = loc; pos = { x: 50, y: 84 }; trail = []; target = null; build(); }
    let dx = (keys.has("d") || keys.has("arrowright") ? 1 : 0) - (keys.has("a") || keys.has("arrowleft") ? 1 : 0), dy = (keys.has("s") || keys.has("arrowdown") ? 1 : 0) - (keys.has("w") || keys.has("arrowup") ? 1 : 0);
    if (dx || dy) target = null;
    else if (target) { const ex = target.x - pos.x, ey = target.y - pos.y, d = Math.hypot(ex, ey); if (d < SPEED) target = null; else { dx = ex / d; dy = ey / d; } }
    if (dx || dy) { const n = Math.hypot(dx, dy) || 1; pos = { x: Math.max(3, Math.min(97, pos.x + (dx / n) * SPEED)), y: Math.max(40, Math.min(96, pos.y + (dy / n) * SPEED * 0.8)) }; trail.unshift({ ...pos }); trail.length = Math.min(trail.length, 40); }
    place();
    document.querySelectorAll("#hotspots .hot.near").forEach((b) => b.classList.remove("near"));
    const n = nearest(); if (n) { n.classList.add("near"); const t = n.querySelector(".tag"); prompt.textContent = `E · ${t ? t.textContent : "Use"}`; prompt.style.display = "block"; } else prompt.style.display = "none";
  };
  document.addEventListener("keydown", (e) => {
    if (!W.on || e.target.closest("input, textarea, select") || modalOpen()) return;
    const k = e.key.toLowerCase();
    if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(k)) { keys.add(k); e.preventDefault(); }
    else if (k === "e" || k === "enter" || k === " ") { const n = stage() && (mm() ? document.querySelector("#hotspots .hot.near") : nearest()); if (n) { e.preventDefault(); n.click(); } }
  });
  document.addEventListener("keyup", (e) => keys.delete(e.key.toLowerCase()));
  document.addEventListener("click", (e) => {
    if (!W.on || !stage() || e.target.closest(".hot, button, a, input")) return;
    { const m = mm(); if (m) { const s = stage().getBoundingClientRect(); if (e.clientX < s.left || e.clientX > s.right || e.clientY < s.top || e.clientY > s.bottom) return; const [x, z] = MAPMODE.unproject(m.pk, ((e.clientX - s.left) / s.width) * m.pk.view.W, ((e.clientY - s.top) / s.height) * m.pk.view.H); wtarget = { x, z }; return; } }
    const s = stage().getBoundingClientRect(); if (e.clientX < s.left || e.clientX > s.right || e.clientY < s.top || e.clientY > s.bottom) return;
    target = { x: ((e.clientX - s.left) / s.width) * 100, y: Math.max(22, ((e.clientY - s.top) / s.height) * 100) };
  });
  W.set = (v) => { W.on = !!v; const L = ensure(); if (L) L.style.display = W.on ? "block" : "none"; if (W.on) { lastLoc = ""; if (!raf) raf = requestAnimationFrame(step); } document.documentElement.classList.toggle("walking", W.on); try { localStorage.setItem("beyond.walk", W.on ? "1" : "0"); } catch (e) {} if (window.GAME && G.showIdle && G.state && G.state.phase === "explore" && !G.busy) G.showIdle(); };
  const idle0 = G.showIdle;
  G.showIdle = function () {
    idle0.apply(this, arguments);
    if (!window.RPGX || !RPGX.on("walk") || !G.state || G.state.phase !== "explore") return;
    const g = U.choicesBox().querySelector(".idle-grid");
    if (g && !mm()) g.append(el("button", { class: "btn choice idle walkbtn", onclick: () => { U.click(); W.set(!W.on); } }, el("span", { class: "lbl" }, W.on ? "Stop walking" : "Walk around"), el("small", { class: "spotinfo" }, W.on ? "Back to pointing and clicking" : "WASD or click the ground · E to use")));
  };
})();
