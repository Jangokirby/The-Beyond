/* ============================================================================
   MAP MODE (a test): a scene that has a `map` plays on a walkable map instead of a painting.
   In the case data:  scene.map = { pack: "lab/maps/x.beyondmap", spots: { "<option label>": [x, z] }, npcs: { npcId: [x, z] }, start: [x, z] }
   The pack (made in the Map Builder) gives the picture, the walls and the lights. Your options become things you walk up to and
   press E on: the same dice, interviews, clues and endings as ever, underneath. Scenes without a map are unchanged.
   ========================================================================== */
(function () {
  const G = window.GAME, U = window.UI; if (!G || !U) return;
  const MM = (window.MAPMODE = {}), cache = {};
  const load = (url) => cache[url] ? Promise.resolve(cache[url]) : fetch(url).then((r) => r.json()).then((j) => (cache[url] = j));
  MM.cur = () => { const l = G.loc && G.loc(); return l && l.map && cache[l.map.pack] ? { loc: l, map: l.map, pk: cache[l.map.pack] } : null; };
  MM.project = (pk, x, z) => [pk.view.W / 2 + (x - pk.view.cx) * pk.view.k, pk.view.H / 2 + (z - pk.view.cz) * pk.view.sin * pk.view.k];
  MM.unproject = (pk, px, py) => [(px - pk.view.W / 2) / pk.view.k + pk.view.cx, (py - pk.view.H / 2) / (pk.view.sin * pk.view.k) + pk.view.cz];
  const spotFor = (map, label) => { const s = map.spots || {}; if (s[label]) return s[label]; const k = Object.keys(s).find((x) => label.toLowerCase().startsWith(x.toLowerCase()) || x.toLowerCase().startsWith(label.toLowerCase().slice(0, 18))); return k ? s[k] : null; };
  const apply = (loc, pk) => {
    const sc = U.$("#scene"), fr = U.$("#frame"), bg = U.$("#bg"); if (!sc || !fr || !bg) return;
    sc.classList.add("mapmode"); const a = pk.view.W / pk.view.H; fr.style.aspectRatio = String(a); fr.style.width = `min(100cqw, ${a * 100}cqh)`;
    if (bg.getAttribute("src") !== pk.image) { bg.src = pk.image; bg.style.objectFit = "fill"; }
    reposition();
    if (window.WALK && !WALK.on) WALK.set(true);
  };
  const undo = () => { const sc = U.$("#scene"), fr = U.$("#frame"), bg = U.$("#bg"); if (!sc || !sc.classList.contains("mapmode")) return; sc.classList.remove("mapmode"); fr.style.aspectRatio = ""; fr.style.width = ""; bg.style.objectFit = ""; };
  const reposition = () => {
    const m = MM.cur(); if (!m) return; const { loc, map, pk } = m;
    let n = 0;
    for (const h of loc.hotspots || []) {
      let p = spotFor(map, h.label); if (!p) { p = [(map.start || pk.layout.start || [pk.layout.w / 2, pk.layout.h - 2])[0] + (n++ % 6) * 1.2 - 3, (pk.layout.h - 1.4)]; }
      h.mapPos = p;
      const b = document.querySelector(`#hotspots .hot[data-id="${h.id}"]`); if (!b) continue;
      const [px, py] = MM.project(pk, p[0], p[1]);
      Object.assign(b.style, { left: `${(px / pk.view.W) * 100 - 3}%`, top: `${(py / pk.view.H) * 100 - 5}%`, width: "6%", height: "8%" });
    }
  };
  const rl0 = G.renderLocation;
  G.renderLocation = function () {
    rl0.apply(this, arguments);
    const l = G.loc();
    if (l && l.map) { const c = cache[l.map.pack]; if (c) apply(l, c); else load(l.map.pack).then((pk) => { if (G.loc() === l) { apply(l, pk); G.renderHotspots(); } }); } else undo();
  };
  const rh0 = G.renderHotspots;
  G.renderHotspots = function () { rh0.apply(this, arguments); try { reposition(); } catch (e) {} };
  /* the cast stands on the map, not beside it */
  const style = document.createElement("style"); style.textContent = "#scene.mapmode #cast:not(.solo){display:none} #scene.mapmode #bg{image-rendering:auto} #scene.mapmode .hot .mark{opacity:.85}"; document.head.append(style);
  /* data cases: pass the scene's map through */
  const c0 = window.ADV && ADV.compile;
  if (c0) ADV.compile = function (a) { const M = c0.apply(this, arguments); for (const [id, sc] of Object.entries(a.scenes || {})) if (sc.map && M.locations[id]) M.locations[id].map = sc.map; return M; };
})();
