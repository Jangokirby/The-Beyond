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
  const step = () => {
    raf = requestAnimationFrame(step);
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
    else if (k === "e" || k === "enter" || k === " ") { const n = stage() && nearest(); if (n) { e.preventDefault(); n.click(); } }
  });
  document.addEventListener("keyup", (e) => keys.delete(e.key.toLowerCase()));
  document.addEventListener("click", (e) => {
    if (!W.on || !stage() || e.target.closest(".hot, button, a, input")) return;
    const s = stage().getBoundingClientRect(); if (e.clientX < s.left || e.clientX > s.right || e.clientY < s.top || e.clientY > s.bottom) return;
    target = { x: ((e.clientX - s.left) / s.width) * 100, y: Math.max(22, ((e.clientY - s.top) / s.height) * 100) };
  });
  W.set = (v) => { W.on = !!v; const L = ensure(); if (L) L.style.display = W.on ? "block" : "none"; if (W.on) { lastLoc = ""; if (!raf) raf = requestAnimationFrame(step); } document.documentElement.classList.toggle("walking", W.on); try { localStorage.setItem("beyond.walk", W.on ? "1" : "0"); } catch (e) {} if (window.GAME && G.showIdle && G.state && G.state.phase === "explore") G.showIdle(); };
  const idle0 = G.showIdle;
  G.showIdle = function () {
    idle0.apply(this, arguments);
    if (!window.RPGX || !RPGX.on("walk") || !G.state || G.state.phase !== "explore") return;
    const g = U.choicesBox().querySelector(".idle-grid");
    if (g) g.append(el("button", { class: "btn choice idle walkbtn", onclick: () => { U.click(); W.set(!W.on); } }, el("span", { class: "lbl" }, W.on ? "Stop walking" : "Walk around"), el("small", { class: "spotinfo" }, W.on ? "Back to pointing and clicking" : "WASD or click the ground · E to use")));
  };
})();
