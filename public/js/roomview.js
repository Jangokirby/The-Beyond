/* ============================================================================
   ROOM VIEW (a test): a scene with a map is shown from INSIDE the room, like an old dungeon crawler or Myst:
   you stand in the middle, turn left and right to see the four walls, click things on the walls (the same marks as ever),
   and click a door to load the next room. The picture is the map tool's 3D room, seen at eye height.
   Two feels to compare (button in the corner):  Live = smooth turning, flickering lamps.  Stills = snap turns with a crossfade (pre-rendered feel).
   Turn on:  Settings > "Explore rooms in first person (a test)", or open the game with ?rooms=1
   Scenes without a map are unchanged. Nothing here changes the rules: it only changes how the scene is drawn.
   ========================================================================== */
(function () {
  const G = window.GAME, U = window.UI; if (!G || !U) return;
  const el = U.el, RV = (window.ROOMVIEW = {}), base = document.currentScript ? document.currentScript.src : location.href;
  let kit = null, st = null;
  const FACING = ["north", "east", "south", "west"];
  const loadKit = async () => kit || (kit = await import(new URL("../lab/kit.js", base).href).then(async (m) => { await m.loadPieces(); return m; }));
  RV.wanted = () => { try { return !!(window.RPGX && RPGX.on("rooms")); } catch (e) { return false; } };
  RV.mode = (() => { try { return localStorage.getItem("beyond.rvmode") || "live"; } catch (e) { return "live"; } })();
  if (/[?&]rooms=1/.test(location.search) && window.RPGX && RPGX.set) { try { RPGX.set("rooms", true); } catch (e) {} }

  const cleanup = () => {
    if (!st) return; const s = st; st = null; cancelAnimationFrame(s.raf); try { s.ro.disconnect(); } catch (e) {} document.removeEventListener("keydown", s.key);
    try { s.renderer.dispose(); } catch (e) {} s.nodes.forEach((n) => n.remove());
    const fr = U.$("#frame"), bg = U.$("#bg"); if (bg) bg.style.visibility = ""; if (fr) { fr.style.aspectRatio = ""; fr.style.width = ""; }
  };
  RV.leave = cleanup;
  RV.sync = (loc, pk) => { if (RV.wanted()) RV.enter(loc, pk); else cleanup(); };

  RV.enter = async (loc, pk) => {
    if (st && st.loc === loc) return; cleanup(); const token = (RV._tok = (RV._tok || 0) + 1);
    const frame = U.$("#frame"), bg = U.$("#bg"), hot = U.$("#hotspots"); if (!frame || !bg) return;
    let K; try { K = await loadKit(); } catch (e) { console.warn("room view: could not load the map kit", e); return; }
    if (token !== RV._tok || G.loc() !== loc) return;
    const THREE = K.THREE, L = JSON.parse(JSON.stringify(pk.layout)); await K.prepare(L);
    if (token !== RV._tok || G.loc() !== loc) return;
    const { scene } = K.build(L, { firstPerson: true });
    const cv = el("canvas", { id: "rv", style: "position:absolute;inset:0;width:100%;height:100%;display:block" });
    const fade = el("div", { id: "rvfade", style: "position:absolute;inset:0;background:#000;opacity:1;transition:opacity .5s ease;pointer-events:none;z-index:7" });
    const still = el("img", { id: "rvstill", alt: "", style: "position:absolute;inset:0;width:100%;height:100%;opacity:0;transition:opacity .35s ease;pointer-events:none;z-index:2" });
    const label = el("div", { id: "rvlabel", style: "position:absolute;left:50%;bottom:10px;transform:translateX(-50%);z-index:8;font:600 12px system-ui;letter-spacing:.08em;color:#efeadb;background:rgba(8,12,18,.6);padding:3px 12px;border-radius:12px;pointer-events:none;text-transform:uppercase" });
    const btn = (txt, side, fn, title) => el("button", { class: "btn", title, "aria-label": title, onclick: (e) => { e.stopPropagation(); U.click && U.click(); fn(); }, style: `position:absolute;top:50%;${side}:8px;transform:translateY(-50%);z-index:8;width:44px;height:64px;font-size:26px;line-height:1;padding:0;background:rgba(8,12,18,.55);color:#efeadb;border:1px solid rgba(239,234,219,.4);border-radius:10px;cursor:pointer` }, txt);
    const modeBtn = el("button", { class: "btn small", title: "Live: smooth turning and flickering lamps. Stills: snap turns, like pre-rendered views.", style: "position:absolute;right:8px;top:8px;z-index:8;font:600 11px system-ui;padding:4px 10px;background:rgba(8,12,18,.6);color:#efeadb;border:1px solid rgba(239,234,219,.4);border-radius:10px;cursor:pointer", onclick: (e) => { e.stopPropagation(); RV.mode = RV.mode === "live" ? "stills" : "live"; try { localStorage.setItem("beyond.rvmode", RV.mode); } catch (er) {} st.need = true; modeBtn.textContent = "View: " + RV.mode; loop(); } }, "View: " + RV.mode);
    const nodes = [cv, still, fade, label, btn("‹", "left", () => turn(-1), "Turn left"), btn("›", "right", () => turn(1), "Turn right"), modeBtn];
    bg.after(cv); frame.append(still, fade, label, ...nodes.slice(4)); bg.style.visibility = "hidden";
    frame.style.aspectRatio = "16 / 10"; frame.style.width = "min(100cqw, 160cqh)";
    const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, preserveDrawingBuffer: true }); renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.25; renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const cam = new THREE.PerspectiveCamera(72, 1.6, 0.1, 80), eye = [L.w / 2, 1.55, L.h / 2]; cam.position.set(...eye);
    const lights = []; scene.traverse((o) => { if (o.isPointLight) lights.push({ o, i: o.intensity, p: Math.random() * 10 }); });
    /* people stand in the room as painted cutouts (the diorama test) */
    const npcs = (window.MODULE && MODULE.npcs) || {}, map = loc.map || {}, sprites = [];
    for (const [id, p] of Object.entries(map.npcs || {})) {
      const n = npcs[id]; if (!n || !n.portrait) continue; const img = new Image(); img.crossOrigin = "anonymous";
      img.onload = () => { const c = document.createElement("canvas"); c.width = c.height = 256; const g = c.getContext("2d"); g.save(); g.beginPath(); g.roundRect ? g.roundRect(8, 8, 240, 240, 36) : g.rect(8, 8, 240, 240); g.clip(); g.drawImage(img, 0, 0, 256, 256); g.restore(); g.lineWidth = 6; g.strokeStyle = "#c9b27a"; g.stroke();
        const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex })); sp.scale.set(1.15, 1.15, 1); sp.position.set(p[0], 1.25, p[1]); scene.add(sp);
        const ring = new THREE.Mesh(new THREE.CircleGeometry(.5, 24), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: .45 })); ring.rotation.x = -Math.PI / 2; ring.position.set(p[0], .02, p[1]); scene.add(ring); st && (st.need = true); };
      img.src = U.img(n.portrait, "portraits");
    }
    const s = (st = { loc, pk, L, THREE, scene, cam, renderer, cv, still, fade, label, nodes, lights, face: 0, yaw: 0, need: true, raf: 0, t0: performance.now(), key: null, ro: null, props: L.props || [], doors: L.doors || [] });
    const size = () => { const w = frame.clientWidth, h = frame.clientHeight; if (!w || !h) return; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); s.need = true; };
    s.ro = new ResizeObserver(size); s.ro.observe(frame); size();
    const where = (h) => { /* a mark's place on the wall: the prop or door it belongs to, at about chest height */
      const q = h.mapPos || [L.w / 2, L.h - 1]; let best = null, bd = 1e9;
      for (const d of s.doors) { const dd = Math.hypot(d.x - q[0], d.z - q[1]); if (dd < bd) { bd = dd; best = [d.x, 1.15, d.z]; } } if (best && bd < (h.go ? 2.6 : 1.7)) return best;   // a mark by a door sits on the door
      best = null; bd = 1e9;
      { for (const p of s.props) { const d = K.CATALOG[p.t]; if (!d || !d.block) continue; const dd = Math.hypot(p.x - q[0], p.z - q[1]); if (dd < bd) { bd = dd; best = [p.x, 0.95, p.z]; } } if (best && bd < 2.4 && !/^talk/i.test(h.label)) return best; }
      return [q[0], /^talk/i.test(h.label) ? 1.2 : 1.0, q[1]];
    };
    const v = new THREE.Vector3();
    const place = () => {
      if (!st) return; const ls = loc.hotspots || [];
      for (const b of hot.querySelectorAll(".hot")) {
        const h = ls.find((x) => String(x.id) === b.dataset.id); if (!h) continue; const w = where(h); v.set(w[0], w[1], w[2]).project(cam);
        const on = v.z < 1 && Math.abs(v.x) < 1.04 && Math.abs(v.y) < 1.04; b.style.display = on ? "" : "none";
        if (on) { const wd = 6.2, ht = wd * (frame.clientWidth / Math.max(1, frame.clientHeight)); Object.assign(b.style, { left: `${(v.x * .5 + .5) * 100 - wd / 2}%`, top: `${(-v.y * .5 + .5) * 100 - ht / 2}%`, width: `${wd}%`, height: `${ht}%` }); }
      }
    };
    s.place = place;
    const turn = (d) => {
      if (!st) return; if (RV.mode === "stills") { try { still.src = cv.toDataURL("image/jpeg", .85); still.style.transition = "none"; still.style.opacity = "1"; void still.offsetWidth; still.style.transition = "opacity .35s ease"; } catch (e) {} s.face = (s.face + d + 4) % 4; s.yaw = -s.face * Math.PI / 2; cam.rotation.y = s.yaw; s.need = true; requestAnimationFrame(() => { render(); still.style.opacity = "0"; }); }
      else { s.face = (s.face + d + 4) % 4; s.need = true; loop(); }
      label.textContent = FACING[s.face] + " wall";
    };
    const render = () => { if (!st) return; place(); renderer.render(scene, cam); s.need = false; };
    const loop = () => {
      if (!st) return; cancelAnimationFrame(s.raf); const t = (performance.now() - s.t0) / 1000;
      if (RV.mode === "live") {
        const target = -s.face * Math.PI / 2; let dy = target - s.yaw; dy = Math.atan2(Math.sin(dy), Math.cos(dy)); s.yaw += dy * 0.16; if (Math.abs(dy) < 0.002) s.yaw = target;
        cam.rotation.y = s.yaw + Math.sin(t * .6) * .004; cam.position.y = eye[1] + Math.sin(t * .9) * .008; lights.forEach((l) => { l.o.intensity = l.i * (1 + .06 * Math.sin(t * 7 + l.p) + .04 * Math.sin(t * 13.3 + l.p * 2)); }); render(); s.raf = requestAnimationFrame(loop);
      } else { cam.rotation.y = -s.face * Math.PI / 2; cam.position.y = eye[1]; lights.forEach((l) => { l.o.intensity = l.i; }); if (s.need) render(); s.raf = requestAnimationFrame(loop); }
    };
    s.key = (e) => { if (document.querySelector(".modal") || /input|textarea|select/i.test((e.target || {}).tagName || "")) return; const k = e.key.toLowerCase(); if (k === "arrowleft" || k === "a" || k === "q") { e.preventDefault(); turn(-1); } else if (k === "arrowright" || k === "d") { e.preventDefault(); turn(1); } };
    document.addEventListener("keydown", s.key); s.nodes = nodes;
    if (window.WALK && WALK.on) WALK.set(false);
    label.textContent = FACING[0] + " wall"; loop(); setTimeout(() => { fade.style.opacity = "0"; }, 60); setTimeout(() => { try { fade.remove(); } catch (e) {} }, 900);
  };
  /* marks are rebuilt after every action: put them back on the walls */
  const rh = G.renderHotspots; G.renderHotspots = function () { rh.apply(this, arguments); try { if (st && st.place) st.place(); } catch (e) {} };
  const style = document.createElement("style"); style.textContent = "#scene.combat #rv{filter:brightness(.35) saturate(.6)} #scene #rv ~ #cast{display:none} #frame:has(#rv) .walktok, #frame:has(#rv) .npctok, #frame:has(#rv) .walkprompt{display:none !important}"; document.head.append(style);
})();
