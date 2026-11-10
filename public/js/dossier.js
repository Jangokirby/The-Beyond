/* ============================================================================
   PICTURE STYLES — Painted (the default: oil paintings made for this game,
   assets/painted) and Photo (public-domain photos and engravings tinted to one
   ink-on-paper look, assets/dossier). Settings → Art style chooses; Drawn loads
   none of this and uses the vector art. The patrons and the title keep the
   rulebook's own art in every style. index.html loads js/art/<style>/lib.js and
   picks.js before this file and sets window.ART_STYLE.

   Every picture comes from window.DOSSIER_LIB (js/dossier-lib.js):
     (painted only — pin: true marks a painting made for one case; it is only used where
      js/dossier-picks.js puts it)
     portraits: { id, f, era: [eraIds], sex: "m"|"f", age: "child"|"young"|"adult"|"old", tags: [] }
     monsters:  { id, f, kinds: [sprite kinds], names: [words to match], jp: bool }
     scenes:    { id, f, themes: [scene themes], eras: [eraIds] }
   ART.portrait / ART.scene / ART.sprite are replaced so the rest of the game
   works unchanged. Anything the library has no match for falls back to the
   drawn vector art, so nothing ever goes blank.
   To add your own picture: put the file in assets/painted/ (or assets/dossier/) and add a line to
   dossier-lib.js (or to DOSSIER_PICKS below to pin it to one character).
   ========================================================================== */
(function () {
  const LIB = window.DOSSIER_LIB || { portraits: [], monsters: [], scenes: [] };
  const ART = window.ART, A0 = { portrait: ART.portrait, scene: ART.scene, sprite: ART.sprite };
  const STYLE = window.ART_STYLE || "painted", PAINTED = STYLE === "painted";
  const D = (window.DOSSIER = { LIB, style: STYLE });
  const hash = (s) => { let h = 2166136261; for (const ch of String(s)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  const byId = {}; for (const g of ["portraits", "monsters", "scenes"]) for (const x of LIB[g]) byId[x.id] = x;
  D.get = (id) => byId[id];
  const ERAS = ["medieval", "victorian", "wars", "atomic", "modern", "now"];
  D.eraOf = (year) => (window.CDATA && window.CDATA.eraOf ? window.CDATA.eraOf(+year || 2000).id : "modern");
  /* nearest eras first, so a 1958 case with few 1950s photos borrows from the 1940s before the 1990s */
  const nearEras = (era) => { const i = Math.max(0, ERAS.indexOf(era)); return ERAS.slice().sort((a, b) => Math.abs(ERAS.indexOf(a) - i) - Math.abs(ERAS.indexOf(b) - i)); };

  /* ---------------------------------------------------------------- portraits */
  const reg = (group, prefix, item) => { const key = prefix + item.id; window.ASSETS[group][key] = item.f; return key; };
  D.portraitKey = (id) => (byId[id] ? reg("portraits", "ph:", byId[id]) : null);
  D.portraitsFor = (opts = {}) => {
    let list = LIB.portraits.filter((p) => !p.pin && (!p.npcOnly || opts.npc));
    if (opts.sex) list = list.filter((p) => p.sex === opts.sex);
    if (opts.age) { const a = list.filter((p) => p.age === opts.age || (opts.age === "adult" && p.age === "young")); if (a.length) list = a; }
    if (opts.tags && opts.tags.length) { const t = list.filter((p) => opts.tags.some((x) => (p.tags || []).includes(x))); if (t.length) list = t; }
    if (opts.era) for (const e of nearEras(opts.era)) { const m = list.filter((p) => p.era.includes(e)); if (m.length >= (opts.min || 1)) return m; }
    return list;
  };
  /* a look with { photo } shows that photo; otherwise one is chosen from the look's hash so old saves stay stable */
  ART.portrait = (o) => {
    o = o || {};
    const chosen = (o.photos && o.photos[STYLE]) || o.photo;   // a portrait chosen in each style is kept for that style
    if (chosen && byId[chosen]) return D.portraitKey(chosen);
    const campEra = window.CAMP && CAMP.camp ? D.eraOf(CAMP.camp.year) : null;
    const pool = D.portraitsFor({ era: o.era || D.ctxEra || campEra, sex: o.sex, age: o.age, tags: o.tags });
    if (!pool.length) return A0.portrait(o);
    return D.portraitKey(pool[hash(JSON.stringify(o)) % pool.length].id);
  };

  /* ---------------------------------------------------------------- scenes */
  D.sceneFor = (theme, era, seed, avoid) => {
    let pool = LIB.scenes.filter((s) => !s.pin && s.themes.includes(theme));
    if (!pool.length) return null;
    for (const e of nearEras(era || D.ctxEra || "modern")) { const m = pool.filter((s) => s.eras.includes(e)); if (m.length) { pool = m; break; } }
    const fresh = avoid ? pool.filter((s) => !avoid.has(s.id)) : pool;
    const p = (fresh.length ? fresh : pool)[hash(theme + seed) % (fresh.length || pool.length)];
    if (avoid) avoid.add(p.id);
    return p;
  };
  ART.scene = (theme, seed = "") => { if (seed === "title" && window.ASSETS.scenes.title) return "title"; const s = D.sceneFor(theme, null, seed); return s ? reg("scenes", "ph:", s) : A0.scene(theme, seed); };

  /* ---------------------------------------------------------------- monsters */
  D.monsterFor = (kind, name = "", jp = false, avoid) => {
    const n = String(name).toLowerCase();
    let pool = LIB.monsters.filter((m) => !m.pin && (!m.jp || jp));
    const named = pool.filter((m) => (m.names || []).some((w) => n.includes(w)));
    if (named.length) pool = named;
    else { const k = pool.filter((m) => m.kinds.includes(kind)); if (!k.length) return null; pool = k; }
    if (jp) { const j = pool.filter((m) => m.jp); if (j.length) pool = j; }
    const fresh = avoid ? pool.filter((m) => !avoid.has(m.id)) : pool;
    const p = (fresh.length ? fresh : pool)[hash(kind + name) % (fresh.length || pool.length)];
    if (avoid) avoid.add(p.id);
    return p;
  };
  ART.sprite = (kind = "humanoid", hue = 0, name = "") => { const m = D.monsterFor(kind, name); return m ? reg("sprites", "ph:", m) : A0.sprite(kind, hue); };

  /* ---------------------------------------------------------------- NPC sex/age guess for cases without a pinned photo */
  const FEM = /\b(she|her|hers|woman|girl|mother|mrs|miss|ms|sister|widow|wife|aunt|auntie|grandmother|nun|lady|maid|housemaid|daughter|midwife|goose girl)\b/;
  const MAS = /\b(he|him|his|man|boy|father|mr|brother|abbot|padre|monk|husband|uncle|sheriff|sgt|colonel|lt|inspector|pastor|conductor|sons)\b/;
  D.guess = (n) => {
    const t = `${n.name || ""} ${n.tag || ""} ${n.look || ""}`.toLowerCase().replace(/[.']/g, " ");
    const f = (t.match(new RegExp(FEM, "g")) || []).length, m = (t.match(new RegExp(MAS, "g")) || []).length;
    const ageM = t.match(/\b(\d{1,2})\b/); const num = ageM ? +ageM[1] : 0;
    const age = (num && num < 16) || /\b(girl|boy|child|sons)\b/.test(t) ? "child" : (num >= 60 || /\b(old|elderly|grey|gray|seventy|eighty)\b/.test(t) ? "old" : "adult");
    return { sex: f > m ? "f" : m > f ? "m" : (hash(n.name) % 2 ? "f" : "m"), age };
  };

  /* ---------------------------------------------------------------- per-case picks
     After a case compiles, give every character, place and monster a picture that suits its era,
     never repeating one inside the same case. DOSSIER_PICKS pins hand-chosen images. */
  const PICKS = window.DOSSIER_PICKS || {};
  const compile0 = window.ADV.compile;
  window.ADV.compile = (a) => {
    const era = D.eraOf(a.year), pk = PICKS[a.id] || {}, jp = a.flavor === "jp";
    D.ctxEra = era;
    const M = compile0(a);
    const usedP = new Set(), usedS = new Set(), usedM = new Set();
    for (const id of Object.values(pk.npcs || {})) usedP.add(id);
    for (const [id, n] of Object.entries(a.npcs || {})) {
      if (n.portraitKey && window.ASSETS.portraits[n.portraitKey]) { M.npcs[id].portrait = n.portraitKey; continue; }   // someone met before keeps their face
      const want = (pk.npcs || {})[id] || (n.face && n.face.photo);
      if (want && byId[want]) { M.npcs[id].portrait = D.portraitKey(want); continue; }
      const g = { ...D.guess(n), ...(n.face && n.face.sex ? { sex: n.face.sex } : {}), ...(n.face && n.face.tags ? { tags: n.face.tags } : {}), ...(pk.who || {})[id] };
      let pool = D.portraitsFor({ era, sex: g.sex, age: g.age, tags: g.tags, npc: true, min: 2 });
      const fresh = pool.filter((p) => !usedP.has(p.id)); if (fresh.length) pool = fresh;
      if (!pool.length) continue;
      const p = pool[hash(a.id + id) % pool.length]; usedP.add(p.id);
      M.npcs[id].portrait = D.portraitKey(p.id);
    }
    for (const [id, e] of Object.entries(a.enemies || {})) {
      const want = (pk.enemies || {})[id];
      const m = want && byId[want] ? byId[want] : D.monsterFor((e.build || e).sprite || "humanoid", (e.build || e).name || e.name || id, jp, usedM);
      if (m) { usedM.add(m.id); M.enemies[id].sprite = reg("sprites", "ph:", m); }
    }
    for (const [id, loc] of Object.entries(M.locations)) {
      const want = (pk.scenes || {})[id];
      const s = want && byId[want] ? byId[want] : D.sceneFor(loc.theme, era, id, usedS);
      if (s) loc.scene = reg("scenes", "ph:", s);
    }
    for (const [id, enc] of Object.entries(M.encounters)) {
      const want = (pk.fights || {})[id] || (pk.scenes || {})[id];
      const s = want && byId[want] ? byId[want] : D.sceneFor((a.encounters[id] || {}).theme || "interior", era, id, null);
      if (s) enc.scene = reg("scenes", "ph:", s);
    }
    D.ctxEra = null;
    return M;
  };

  /* ---------------------------------------------------------------- the handmade first case and title art */
  const FIXED = window.DOSSIER_FIXED || {};
  for (const [group, map] of Object.entries(FIXED)) for (const [key, id] of Object.entries(map)) if (byId[id]) window.ASSETS[group][key] = byId[id].f;

  /* ---------------------------------------------------------------- player photos */
  D.playerPool = (era) => D.portraitsFor({ era, min: 12 }).filter((p) => !p.npcOnly);
  /* opts: { sex: "f"|"m", tags: heritage words from js/people.js } narrow the pool when they can */
  D.fits = (id, d) => { const p = byId[id]; if (!p) return false; if ((d.sex === "f" || d.sex === "m") && p.sex && p.sex !== d.sex) return false;
    const want = window.PEOPLE ? PEOPLE.heritageOf(d.origin) : []; return !want.length || !(p.tags || []).length || want.some((x) => p.tags.includes(x)); };
  D.rollPhoto = (look, era, opts = {}) => {
    let pool = D.playerPool(era);
    /* with few matches in this era, borrow from the neighbouring ones */
    const near = nearEras(era || "modern").slice(0, 3), okSex = (p) => !(opts.sex === "f" || opts.sex === "m") || p.sex === opts.sex, okTag = (p) => !(opts.tags || []).length || opts.tags.some((x) => (p.tags || []).includes(x));
    const wide = LIB.portraits.filter((p) => !p.npcOnly && !p.pin && p.era.some((e) => near.includes(e)) && okSex(p) && okTag(p));
    if (wide.length > pool.filter((p) => okSex(p) && okTag(p)).length && pool.filter((p) => okSex(p) && okTag(p)).length < 3) pool = wide;
    if (opts.sex === "f" || opts.sex === "m") { const s = pool.filter((p) => p.sex === opts.sex); if (s.length) pool = s; }
    if (opts.tags && opts.tags.length) { const t = pool.filter((p) => opts.tags.some((x) => (p.tags || []).includes(x))); if (t.length) pool = t; }
    if (pool.length) { look.photo = pool[Math.floor(Math.random() * pool.length)].id; look.photos = { ...(look.photos || {}), [STYLE]: look.photo }; } return look;
  };
  /* CAMP loads after this file, so the roll button is wrapped once the page is ready */
  document.addEventListener("DOMContentLoaded", () => {
    const rollLook0 = window.CAMP && window.CAMP.rollLook;
    if (rollLook0) window.CAMP.rollLook = (d) => { rollLook0(d); const era = window.CAMP.camp ? D.eraOf(window.CAMP.camp.year) : (D.pickState.era || "modern"); return D.rollPhoto(d.look, era === "all" ? "modern" : era, { sex: d.sex, tags: window.PEOPLE ? PEOPLE.heritageOf(d.origin) : [] }); };
  });

  /* ---------------------------------------------------------------- photo picker (creator and workshop)
     opts: { era, value, onPick(id), npc } — shows the era's photos first, with era and sex filters. */
  const ERA_NAMES = { medieval: "Old Order", victorian: "Gaslight", wars: "World Wars", atomic: "Atomic", modern: "Late Century", now: "Present" };
  D.pickState = { era: null, sex: "" };
  D.picker = (opts) => {
    const el = window.UI.el, st = D.pickState;
    if (!st.era || opts.resetEra) st.era = opts.era || "modern";
    if (opts.sex !== st.lastSex) { st.lastSex = opts.sex; st.sex = opts.sex === "f" || opts.sex === "m" ? opts.sex : ""; }
    const want = opts.tags || [], fits = (p) => want.some((x) => (p.tags || []).includes(x));
    const wrap = el("div", { class: "photopick" });
    const draw = () => {
      let list = LIB.portraits.filter((p) => !p.pin && (opts.npc || !p.npcOnly) && (st.era === "all" || p.era.includes(st.era)) && (!st.sex || p.sex === st.sex));
      if (want.length) list = [...list.filter(fits), ...list.filter((p) => !fits(p))];   // faces that suit the agent's origin first
      const chip = (label, on, fn) => el("button", { class: "segbtn" + (on ? " on" : ""), type: "button", onclick: () => { fn(); draw(); } }, label);
      wrap.replaceChildren(
        el("div", { class: "seg pp-eras" }, ...ERAS.map((e) => chip(ERA_NAMES[e] + (e === opts.era ? " ★" : ""), st.era === e, () => { st.era = e; })), chip("All", st.era === "all", () => { st.era = "all"; })),
        el("div", { class: "seg pp-sex" }, chip("Anyone", !st.sex, () => { st.sex = ""; }), chip("Women", st.sex === "f", () => { st.sex = "f"; }), chip("Men", st.sex === "m", () => { st.sex = "m"; }),
          el("small", { class: "muted" }, `${list.length} portraits`)),
        el("div", { class: "pp-grid" }, ...list.map((p) => el("button", { class: "pp" + (opts.value === p.id ? " on" : ""), type: "button", title: p.id, "aria-label": "Choose this portrait",
          onclick: () => { opts.value = p.id; opts.onPick(p.id); wrap.querySelectorAll(".pp").forEach((b) => b.classList.toggle("on", b.title === p.id)); } },
          el("img", { src: p.f, alt: "", loading: "lazy" })))));
    };
    draw();
    return wrap;
  };
  /* ---------------------------------------------------------------- hideout rooms and agency seals */
  const ROOMS = ["medieval", "victorian", "wars", "atomic", "modern", "now"];
  const SEALS = { OID: "oid", WCA: "wca", NSBD: "nsbd", EHG: "ehg", BFV: "bfv" };
  if (PAINTED) document.addEventListener("DOMContentLoaded", () => {
    const H = window.HIDE; if (H && H.room) { const room0 = H.room; H.room = (id) => { const e = id || (window.CAMP && CAMP.camp ? D.eraOf(CAMP.camp.year) : "modern"); return ROOMS.includes(e) ? `assets/painted/h/${e}.jpg` : room0(id); }; }
    /* the painted rooms all share one layout: notice board, weapon rack, door, phone, shelves, cabinet, archway, two benches and a chest */
    const BOX = { board: [0, 26, 11, 28], armory: [14, 24, 12, 38], door: [30, 8, 10, 58], phone: [45, 26, 8, 20], archive: [58, 4, 14, 62],
      vault: [75, 38, 10, 30], garage: [89, 10, 11, 58], table: [2, 78, 30, 18], log: [42, 80, 18, 16], cot: [70, 80, 30, 16] };
    if (H) H.relayout = (ps) => ps.map((p) => (BOX[p.id] ? { ...p, x: BOX[p.id][0], y: BOX[p.id][1], w: BOX[p.id][2], h: BOX[p.id][3] } : p));
    const seal = (root) => root.querySelectorAll && root.querySelectorAll(".crest:not(.sealed)").forEach((c) => {
      const k = SEALS[c.textContent.trim()]; if (!k) return;
      c.classList.add("sealed"); c.title = c.textContent; c.style.backgroundImage = `url(assets/painted/u/agency-${k}.jpg)`; c.textContent = "";
    });
    new MutationObserver((ms) => { for (const m of ms) for (const n of m.addedNodes) if (n.nodeType === 1) { if (n.classList.contains("crest")) seal(n.parentNode); else seal(n); } }).observe(document.body, { childList: true, subtree: true });
    seal(document);
  });
  /* painted items, where they exist, stand in for the drawn icons (gear and things in scenes) */
  const ITEMS = LIB.items || {};
  if (Object.keys(ITEMS).length) {
    for (const [k, f] of Object.entries(ITEMS)) if (window.ASSETS.items) window.ASSETS.items[k] = f;
    if (window.PROPS) { const src0 = PROPS.src; PROPS.src = (k) => ITEMS[k] || src0(k); }
  }
  D.src = (id) => (byId[id] ? byId[id].f : "");
  document.documentElement.classList.add("ed-dossier", PAINTED ? "ed-painted" : "ed-photo");
})();
