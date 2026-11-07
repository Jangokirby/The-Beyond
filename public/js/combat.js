/* Zone combat for The Beyond RPG: rooms are zones, Speed decides the order,
   two actions a turn, attacks vs Evasion Rating, damage minus Resistance. */
(function () {
  const M = window.MODULE, U = window.UI, el = U.el, G = window.GAME;
  const C = {};
  let c = null;

  const sleep = (ms) => U.sleep(U.reduced() ? Math.min(ms, 120) : ms);
  const rnd = () => R.rand();
  const log = (html, cls = "") => U.print(html, "clog " + cls);
  const dieGlyph = (v) => "⚀⚁⚂⚃⚄⚅"[v - 1];

  /* ================================================================== setup */
  C.start = (encId, opts = {}) => new Promise((resolve) => {
    const enc = M.encounters[encId];
    const st = G.state;
    c = { id: encId, enc, resolve, round: 0, done: false, outcome: null, surprise: !!opts.surprise, pick: null,
      sev: enc.severity != null ? enc.severity : ((G.loc() && G.loc().severity) || 0),
      zones: {}, adj: {}, units: [], gmFate: st.gmFate, knifeTaken: false, cols: 0, rows: 0, canFlee: !!opts.canFlee };
    for (const z of enc.zones) { c.zones[z.id] = { ...z, bright: false, boost: z.light ? (R.ZONE_LIGHT[z.light] || 0) : 0 }; c.adj[z.id] = []; c.cols = Math.max(c.cols, z.col + 1); c.rows = Math.max(c.rows, z.row + 1); }
    for (const [a, b] of enc.edges) { c.adj[a].push(b); c.adj[b].push(a); }
    for (const a of G.active()) c.units.push({ kind: "agent", uid: a.id, ref: a, name: a.short, zone: enc.start, out: false });
    if (st.nomura && st.nomura.joined && !st.nomura.dead) c.units.push({ kind: "ally", uid: "nomura", ref: st.nomura, name: "Nomura", zone: enc.start, out: false });
    for (const g of st.guards || []) if (!g.dead) c.units.push({ kind: "ally", uid: g.id, ref: g, name: g.short, zone: enc.start, out: false });
    let n = 0;
    for (const f of enc.foes) {
      const d = M.enemies[f.t];
      const npc = f.as ? M.npcs[f.as] : null;
      c.units.push({ kind: "enemy", uid: "e" + ++n, t: f.t, def: d, as: f.as || null, boss: !!d.boss,
        name: npc ? `Paper ${npc.name.split(" ")[0]}` : (f.name || d.name), zone: f.zone, sprite: d.sprite,
        pools: { health: { cur: d.health, max: d.health }, sanity: { cur: d.sanity, max: d.sanity }, stability: { cur: d.stability, max: d.stability } },
        attack: d.attack, er: d.er, br: d.br, mr: d.mr, sr: d.sr, speed: d.speed, actions: d.actions, cr: d.cr, weight: d.weight,
        statuses: [], attacked: false, cd: { shape: 0, walls: 1, palm: 0, fold: 1 }, shape: null, dead: false,
        words: d.words || 0, supp: 0, hidden: false, cs: {} });
    }
    for (const a of G.active()) a.statuses = [];
    G.state.phase = "combat";
    document.body.dataset.mode = "combat";
    U.$("#scene").classList.add("combat");
    U.$("#bg").src = U.img(enc.scene);
    U.$("#hotspots").innerHTML = "";
    U.$("#cast").innerHTML = "";
    U.$("#board").hidden = false;
    U.$("#loc-name").textContent = enc.name;
    U.$("#loc-jp").textContent = "戦闘";
    U.$("#loc-light").textContent = enc.lit ? "Lit" : "Shadow −2";
    U.particles(enc.boss ? "lilies" : "none");
    AudioMan.music(enc.music);
    AudioMan.ambience(null);
    render();
    run();
  });

  /* ================================================================== queries */
  const ghost = () => c.units.find((u) => u.t === "ghost");
  const alive = (u) => (u.kind === "enemy" ? !u.dead : !(u.ref.dead || u.out));
  const isAgent = (u) => u.kind === "agent";
  const friends = () => c.units.filter((u) => u.kind !== "enemy" && alive(u));
  const foes = () => c.units.filter((u) => u.kind === "enemy" && alive(u));
  const inZone = (z, list) => list.filter((u) => u.zone === z);
  const statusOf = (u, id) => (u.kind === "enemy" ? u.statuses : u.ref.statuses || (u.ref.statuses = [])).find((s) => s.id === id);
  const statuses = (u) => (u.kind === "enemy" ? u.statuses : (u.ref.statuses = u.ref.statuses || []));
  const addStatus = (u, s) => { const list = statuses(u); const i = list.findIndex((x) => x.id === s.id); if (i >= 0) list.splice(i, 1); list.push(s); };
  const removeStatus = (u, id) => { const list = statuses(u); const i = list.findIndex((x) => x.id === id); if (i >= 0) list.splice(i, 1); };
  const GE = window.GEAR;
  const cs = (u) => (u.cs = u.cs || {});
  const gw = (u, n) => u.kind === "agent" && GE.w(u.ref, n);
  const ga = (u, n) => u.kind === "agent" && GE.a(u.ref, n);
  const mc = (e, n) => (e.kind === "enemy" && e.def.built ? GE.count(e.def.mods, n) : 0);
  const within = (z, r) => { const seen = new Set([z]); let f = [z]; for (let i = 0; i < r; i++) { const nx = []; for (const q of f) for (const n of c.adj[q]) if (!seen.has(n)) { seen.add(n); nx.push(n); } f = nx; } return [...seen]; };
  const pitchAt = (z) => (c.zones[z].boost || 0) <= -3 || foes().some((e) => mc(e, "Born from the Depths") && within(e.zone, 2).includes(z));
  const radianceAt = (z) => (c.zones[z].boost || 0) >= 3 || foes().some((e) => mc(e, "Radiance") && within(e.zone, 2).includes(z));
  const glowIn = (z) => {
    if (pitchAt(z)) return false;
    if ((c.zones[z].boost || 0) >= 1) return true;
    if ((c.zones[z].boost || 0) <= -1) return false;
    if (c.zones[z].bright) return true;
    if (c.zones[z].dark) return false;
    return c.enc.lit || friends().some((u) => u.zone === z && u.ref.traits && u.ref.traits.torchBearer);
  };
  const replicaIn = (z) => foes().some((e) => e.zone === z && e.t === "replica");
  const controlOf = (z) => {
    const a = inZone(z, friends()).reduce((n, u) => n + (ga(u, "Hostile") ? 2 : 1), 0);
    const e = inZone(z, foes()).reduce((s, u) => s + u.weight, 0);
    if (e > 0 && e >= 2 * a) return "enemy";
    if (a > 0 && a >= 2 * e) return "agent";
    return null;
  };
  const near = (z) => [z, ...c.adj[z]];
  /* ---- Zone Modifiers ---- */
  const zoneSev = (z) => { const w = zmod(z, "weather"); return w ? +w.p || 0 : (c.sev || 0); };
  const zmod = (z, id) => ((c.zones[z] && c.zones[z].mods) || []).find((m) => m.id === id);
  const ents = (z) => c.units.filter((u) => alive(u) && u.zone === z);
  const intang = (z) => c.zones[z] && c.zones[z].intangible === c.round;
  const zoneBound = (u) => zmod(u.zone, "bound") && c.zones[u.zone].boundAt === c.round;
  const ZDT = ["health", "health", "sanity", "stability", "elemental", "corrupted"];
  const zoneDt = (z) => (zmod(z, "unpredictable") ? c.zones[z].dtype || null : null);
  /* a quick check for anything in a zone: agents roll for real, others use 2d6 + 1 */
  async function zoneCheck(u, aspect, cr, label) {
    if (u.kind === "agent") {
      const r = await G.rollModal({ agent: u.ref, label, sub: `${R.ASPECT_LABEL[aspect]} vs ${cr >= 10 ? "Challenging" : "Medium"}`, mods: [{ label: R.ASPECT_LABEL[aspect], value: R.aspect(u.ref, aspect), base: true }, ...penalties(u)], target: cr, targetLabel: `CR ${cr}`, items: G.itemsFor(u.ref, aspect), kind: "check" });
      return r.ok;
    }
    const d = R.roll2d6(); return d[0] + d[1] + 1 >= cr;
  }
  const zoneHurt = async (u, pool, n, why, opts) => { log(`${why}: ${u.name} takes ${n} ${R.POOL_LABEL[pool]}.`, "hurt"); if (u.kind === "enemy") hurtEnemy(u, pool, n); else await hurt(u, pool, n, opts || { direct: true }); };
  async function spawnFoe(z) {
    const f = c.enc.foes[Math.floor(rnd() * c.enc.foes.length)]; if (!f) return;
    const d = M.enemies[f.t];
    c.nid = (c.nid || 100) + 1;
    const e = { kind: "enemy", uid: "e" + c.nid, t: f.t, def: d, as: null, boss: false, name: f.name || d.name, zone: z, sprite: d.sprite,
      pools: { health: { cur: d.health, max: d.health }, sanity: { cur: d.sanity, max: d.sanity }, stability: { cur: d.stability, max: d.stability } },
      attack: d.attack, er: d.er, br: d.br, mr: d.mr, sr: d.sr, speed: d.speed, actions: d.actions, cr: d.cr, weight: d.weight,
      statuses: [], attacked: false, cd: { shape: 0, walls: 1, palm: 0, fold: 1 }, shape: null, dead: false, words: d.words || 0, supp: 0, hidden: false, cs: {} };
    c.units.push(e); log(`<b>The portal spits out ${e.name}.</b>`, "bad"); render();
  }
  function snapshot() {
    return c.units.map((u) => ({ u, zone: u.zone, dead: u.kind === "enemy" ? u.dead : !!u.ref.dead, out: !!u.out, hidden: !!u.hidden,
      pools: JSON.parse(JSON.stringify(poolsOf(u))), st: JSON.parse(JSON.stringify(statuses(u))) }));
  }
  function restore(snap) {
    for (const s of snap) {
      const u = s.u; u.zone = s.zone; u.out = s.out; u.hidden = s.hidden;
      if (u.kind === "enemy") u.dead = s.dead; else u.ref.dead = s.dead;
      const P = poolsOf(u); for (const k of Object.keys(s.pools)) P[k].cur = s.pools[k].cur;
      const L = statuses(u); L.length = 0; L.push(...s.st);
    }
    G.refreshParty(); render();
  }
  /* Housing and vehicle Modifiers that matter when the fight starts */
  async function propertyOpening() {
    const ag = c.units.filter((u) => u.kind === "agent");
    const P = ag.map((u) => u.ref.prop).filter(Boolean);
    if (P.some((p) => p.hidden)) for (const u of ag) if (!u.hidden) { u.hidden = true; }
    if (P.some((p) => p.hidden)) log("Your base was never found. The party starts the fight hidden.", "good");
    const seen = new Set(), traps = Math.max(0, ...P.map((p) => p.traps || 0));
    for (let i = 0; i < traps && foes().length; i++) { const e = foes()[Math.floor(rnd() * foes().length)]; log(`A trap from home springs on ${e.name}: 6 flat damage.`, "good"); hurtEnemy(e, "health", 6); }
    const guns = [].concat(...P.map((p) => p.guns || []));
    for (const wc of guns) { if (!foes().length) break; const e = foes()[Math.floor(rnd() * foes().length)]; const d = R.roll2d6(); const tot = d[0] + d[1] + 3 + wc; if (tot >= e.er) { const dmg = 3 * wc + 3; log(`Mounted guns open up on ${e.name}: ${tot} vs ER ${e.er}, ${dmg} damage.`, "good"); hurtEnemy(e, "health", dmg); } else log(`Mounted guns miss ${e.name} (${tot} vs ER ${e.er}).`); }
    for (const u of ag) if (u.ref.prop && u.ref.prop.fast) cs(u).freeStepsPer = Math.max(cs(u).freeStepsPer || 0, 1);
    checkEnd();
  }
  async function zoneRound() {
    const mods = Object.entries(c.zones).filter(([, Z]) => (Z.mods || []).length);
    if (c.swapped) { for (const [x, y] of c.swapped) for (const k of ["health", "sanity", "stability"]) { const A = poolsOf(x)[k], B = poolsOf(y)[k]; [A.cur, B.cur] = [B.cur, A.cur]; } c.swapped = null; }
    if (!mods.length) return;
    for (const u of c.units) for (const st of [...statuses(u)]) if (st.hz && st.hz !== u.zone) { removeStatus(u, st.id); log(`${u.name} is clear of the hazard.`); }
    c.snap = mods.some(([z]) => zmod(z, "timeSlip")) ? snapshot() : null;
    c.rec = [];
    for (const [z, Z] of mods) {
      if (zmod(z, "bound")) { Z.boundAt = c.round; if (ents(z).length) log(`Spectral chains close around ${Z.name}.`, "bad"); }
      if (zmod(z, "flicker")) { const d = R.d6(); Z.intangible = d === 6 ? c.round : null; if (d === 6) log(`${Z.name} flickers out of existence this round.`, "bad"); }
      if (zmod(z, "unpredictable")) { const d = R.d6(); Z.dtype = ZDT[d - 1]; log(`${Z.name}: damage here is now ${Z.dtype}.`, "bad"); }
      if (zmod(z, "portal") && R.d6() === 6) await spawnFoe(z);
      if (zmod(z, "bodySwap") && R.d6() === 6) {
        const here = ents(z).filter((u) => u.kind !== "ally");
        const mine = []; for (const u of here) if (await zoneCheck(u, "morality", R.cr("medium"), "Resist the swap")) log(`${u.name} holds onto itself.`); else mine.push(u);
        if (mine.length > 1) { c.swapped = []; for (let i = 0; i + 1 < mine.length; i += 2) { const x = mine[i], y = mine[i + 1]; for (const k of ["health", "sanity", "stability"]) { const A = poolsOf(x)[k], B = poolsOf(y)[k]; [A.cur, B.cur] = [B.cur, A.cur]; } c.swapped.push([x, y]); log(`${x.name} and ${y.name} trade bodies until the round ends.`, "bad"); } G.refreshParty(); render(); }
      }
      for (const u of ents(z)) {
        if (c.done || !alive(u)) break;
        if (zmod(z, "soulDrain")) for (const k of ["health", "sanity", "stability"]) { if (!alive(u)) break; await zoneHurt(u, k, 1, "Soul Drain"); }
        const hz = zmod(z, "hazard");
        if (hz && alive(u)) {
          await zoneHurt(u, "health", 2, "Elemental Hazard", { elemental: true });
          const el_ = hz.p || "burning";
          const mk = GE.STATUS[el_] ? GE.statusObj(el_) : (window.MAGIC && window.MAGIC.ELEMENTS[el_] ? window.MAGIC.ELEMENTS[el_].mk(0) : null);
          if (alive(u) && mk && !statusOf(u, mk.id)) { addStatus(u, { ...mk, rounds: 99, hz: z }); log(`${u.name} is ${el_}.`, "bad"); }
        }
        if (zmod(z, "livingShadows") && alive(u) && !u.hidden) {
          if (await zoneCheck(u, "awareness", R.cr("medium"), "Dodge your shadow")) log(`${u.name} dodges its own shadow.`);
          else await zoneHurt(u, "stability", 2, "Living Shadows");
        }
        if (zmod(z, "plagued") && alive(u) && !statusOf(u, "disease")) {
          if (!(await zoneCheck(u, "humors", R.cr("medium"), "Resist the plague"))) { addStatus(u, GE.statusObj("disease")); log(`${u.name} catches a disease.`, "bad"); }
        }
        if (zmod(z, "gravity") && alive(u)) {
          if (!(await zoneCheck(u, (u.kind === "agent" && R.aspect(u.ref, "agility") > R.aspect(u.ref, "strength")) ? "agility" : "strength", 8, "Hold your footing"))) {
            const to = c.adj[z][Math.floor(rnd() * c.adj[z].length)];
            if (to) { u.zone = to; log(`${u.name} is thrown into ${c.zones[to].name}.`, "bad"); await zoneHurt(u, "health", 8, "Falling", { elemental: true }); render(); }
          }
        }
      }
    }
    render();
  }
  async function zoneTurn(u) {
    if (!u.zone || !c.zones[u.zone]) return;
    const z = u.zone;
    if (u.kind === "agent") u.ref._zp = zmod(z, "wellspring") ? 1 : 0;
    if (zmod(z, "lost") && !u.skipTurn) {
      if (!(await zoneCheck(u, "mindfulness", R.cr("medium"), "Shake off the lost feeling"))) { log(`${u.name} sits down and sobs. Lost.`, "bad"); u.skipTurn = true; }
    }
  }
  async function zoneEnd() {
    if (!c.rec || !c.snap && !c.rec) return;
    for (const [z] of Object.entries(c.zones)) {
      if (zmod(z, "echoes") && R.d6() === 6 && c.rec.length) {
        log(`<b>The room echoes.</b> Everything that hit ${c.zones[z].name} this round happens again.`, "bad");
        const evs = c.rec.filter((r) => r.zone === z); c.rec = [];
        for (const r of evs) { if (!alive(r.u)) continue; if (r.u.kind === "enemy") hurtEnemy(r.u, r.pool, r.n); else await hurt(r.u, r.pool, r.n, { direct: true }); }
      }
    }
    if (c.snap && R.d6() === 6) { log(`<b>Time slips.</b> The round never happened.`, "bad"); restore(c.snap); }
    if (c.snap) { c.order = c.order.reverse(); c.reverseNext = !c.reverseNext; }
    c.snap = null;
  }
  /* Flanking: one side controls two rooms next to a room holding the other side, so that room is trapped between them.
     Only the first flank counts, and only one can stand at a time. */
  const flankNow = () => {
    const cand = [];
    for (const z of Object.keys(c.zones)) {
      const here = controlOf(z);
      if (!here) continue;
      const by = here === "agent" ? "enemy" : "agent";
      const arms = c.adj[z].filter((n) => controlOf(n) === by);
      if (arms.length >= 2) cand.push({ z, by, arms });
    }
    if (c.flank && cand.some((x) => x.z === c.flank.z && x.by === c.flank.by)) return c.flank;
    const was = c.flank;
    c.flank = cand[0] || null;
    if (c.flank && !was) log(`<b>${c.flank.by === "agent" ? "You flank them" : "They flank you"}</b> in ${c.zones[c.flank.z].name}: no hiding, fleeing, charging or counter-flanking there.`, c.flank.by === "agent" ? "good" : "bad");
    return c.flank;
  };
  const flankedUnit = (u) => { const f = flankNow(); if (!f || f.z !== u.zone) return false; return (u.kind === "enemy" ? "enemy" : "agent") !== f.by; };
  const erOf = (u) => {
    if (u.kind === "ally") return u.ref.er || 7;
    if (u.kind === "enemy") return Math.max(0, u.er - (statusOf(u, "crippled") ? 2 : 0));
    const S = cs(u);
    return Math.max(0, R.er(u.ref) + (S.patient || 0) - (S.berserk || 0) - (S.retal || 0));
  };
  /* an enemy's Resistance Type (br / mr / sr), with Leader, Shade, Sun Born, Crippled and Suppression */
  const resOf = (e, k) => {
    let v = e[k] - (statusOf(e, "crippled") && k === "br" ? 2 : 0);
    if (e.def.built) {
      if (mc(e, "Leader")) v += Math.min(4, foes().filter((x) => x !== e && within(e.zone, 1).includes(x.zone)).length);
      if (mc(e, "Shade") && !glowIn(e.zone)) v += 2;
      if (mc(e, "Sun Born") && glowIn(e.zone)) v += 2;
    }
    return Math.max(0, v - (k === "br" ? (e.supp || 0) : 0));
  };
  const brOf = (u) => (u.kind === "enemy" ? resOf(u, "br") : u.kind === "ally" ? (u.ref.br || 3) : Math.max(0, R.br(u.ref) - (cs(u).retal || 0)));
  const poolsOf = (u) => (u.kind === "enemy" ? u.pools : u.ref.pools);

  /* rolling modifiers for an agent standing in a zone */
  const zoneCtx = (u) => {
    const extra = [];
    if (replicaIn(u.zone)) extra.push({ label: "Disruption Aura", value: -2 });
    return { lighting: "shadow", glow: glowIn(u.zone), extra };
  };

  const bfsStep = (from, targets) => {
    if (targets.includes(from)) return from;
    const prev = { [from]: null };
    const q = [from];
    while (q.length) {
      const z = q.shift();
      for (const n of c.adj[z]) {
        if (n in prev) continue;
        prev[n] = z;
        if (targets.includes(n)) { let s = n; while (prev[s] !== from) s = prev[s]; return s; }
        q.push(n);
      }
    }
    return from;
  };

  /* ================================================================== render */
  function render() {
    const board = U.$("#board");
    board.innerHTML = "";
    const order = c.order || [];
    const init = el("div", { class: "initbar", "aria-label": "Turn order" }, el("span", { class: "rnd" }, `Round ${c.round || 1}`),
      ...order.filter(alive).map((u) => el("span", { class: "ini" + (u === c.active ? " now" : "") + (u.kind === "enemy" ? " foe" : "") }, u.name)));
    const grid = el("div", { class: "zones", style: { gridTemplateColumns: `repeat(${c.cols}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${c.rows}, 1fr)` } });
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("class", "edges");
    svg.setAttribute("viewBox", `0 0 ${c.cols * 100} ${c.rows * 100}`);
    svg.setAttribute("preserveAspectRatio", "none");
    for (const [a, b] of c.enc.edges) {
      const za = c.zones[a], zb = c.zones[b];
      const ln = document.createElementNS(svgNS, "line");
      ln.setAttribute("x1", za.col * 100 + 50); ln.setAttribute("y1", za.row * 100 + 50);
      ln.setAttribute("x2", zb.col * 100 + 50); ln.setAttribute("y2", zb.row * 100 + 50);
      svg.append(ln);
    }
    grid.append(svg);
    for (const z of Object.values(c.zones)) {
      const ctl = controlOf(z.id);
      const picking = c.pick && c.pick.type === "zone" && c.pick.set.includes(z.id);
      const card = el("div", { class: "zone" + (glowIn(z.id) ? " glow" : "") + (ctl ? " ctl-" + ctl : "") + (picking ? " pick" : ""),
        style: { gridColumn: z.col + 1, gridRow: z.row + 1 }, "data-z": z.id },
        el("div", { class: "zname" }, z.name, z.knife && !c.knifeTaken ? el("span", { class: "zicon", title: "The bleeding knife" }, "🗡") : null),
        el("div", { class: "ztags" }, el("span", { class: "light" }, glowIn(z.id) ? "Glow" : "Shadow"), ctl ? el("span", { class: "ctl" }, ctl === "enemy" ? "enemy-held" : "held") : null,
          replicaIn(z.id) ? el("span", { class: "aura" }, "aura −2") : null));
      if (picking) card.append(el("button", { class: "zpick", "aria-label": `Move to ${z.name}`, onclick: () => { U.click(); const p = c.pick; c.pick = null; U.clearChoices(); render(); p.resolve(z.id); } }, "Move here"));
      const toks = el("div", { class: "tokens" });
      for (const u of c.units.filter((x) => x.zone === z.id && alive(x))) toks.append(token(u));
      card.append(toks);
      grid.append(card);
    }
    board.append(init, grid);
  }

  function token(u) {
    const targeting = c.pick && c.pick.type === "unit" && c.pick.set.includes(u);
    const p = poolsOf(u);
    const stl = statuses(u).map((s) => el("span", { class: "s " + s.id }, s.label));
    const bars = el("div", { class: "tbars" }, ...["health", "sanity", "stability"].map((k) =>
      el("span", { class: "tb " + k, style: { width: Math.max(0, (p[k].cur / p[k].max) * 100) + "%" } })));
    let face;
    if (u.kind === "enemy") {
      const sp = u.t === "ghost" ? (u.shape ? "ghost_" + u.shape : "ghost_base") : u.sprite;
      face = el("img", { class: "sprite " + u.t, src: U.img(sp, "sprites"), alt: "" });
    } else face = el("span", { class: "chip", style: { backgroundImage: `url(${U.img(u.ref.portrait, "portraits")})` } });
    const b = el("button", { class: "token " + u.kind + (u === c.active ? " active" : "") + (targeting ? " target" : "") + (u.t === "ghost" ? " boss" : ""),
      "data-uid": u.uid, "aria-label": `${u.name}: Health ${p.health.cur}, Sanity ${p.sanity.cur}, Stability ${p.stability.cur}`,
      onclick: () => {
        if (targeting) { U.click(); const pk = c.pick; c.pick = null; U.clearChoices(); render(); pk.resolve(u); return; }
        if (u.kind === "enemy") inspect(u); else if (u.kind === "agent") G.sheet(u.ref);
      } }, face, el("span", { class: "tname" }, u.name), bars, stl.length ? el("span", { class: "tst" }, ...stl) : null);
    return b;
  }

  function floatNum(u, text, cls) {
    const t = document.querySelector(`.token[data-uid="${u.uid}"]`);
    if (!t) return;
    const f = el("span", { class: "floatnum " + cls }, text);
    t.append(f);
    setTimeout(() => f.remove(), 1300);
  }

  function inspect(e) {
    const d = e.def;
    const body = el("div", { class: "foe-sheet" },
      el("img", { src: U.img(e.t === "ghost" ? (e.shape ? "ghost_" + e.shape : "ghost_base") : e.sprite, "sprites"), alt: "" }),
      el("div", {}, el("p", { class: "small" }, `${d.type} · ${d.crLabel}` + (e.as ? ` · wearing ${M.npcs[e.as].name}'s face` : "")),
        el("div", { class: "defense" }, ...[["Health", `${e.pools.health.cur}/${e.pools.health.max}`], ["Sanity", `${e.pools.sanity.cur}/${e.pools.sanity.max}`], ["Stability", `${e.pools.stability.cur}/${e.pools.stability.max}`],
          ["Attack", "+" + e.attack], ["ER", e.er], ["BR", e.br], ["MR", e.mr], ["SR", e.sr], ["Speed", e.speed], ["Actions", e.actions]].map(([k, v]) => el("div", {}, el("small", {}, k), el("b", {}, String(v))))),
        ...d.mods.map((m) => el("p", { class: "small" }, el("b", {}, m + ". "), (M.modText || {})[m] || ""))));
    U.modal({ title: e.name, cls: "wide", body });
  }

  /* ================================================================== picking */
  const pickZone = (set) => new Promise((resolve) => { c.pick = { type: "zone", set, resolve }; render(); cancelButton(); });
  const pickUnit = (set) => new Promise((resolve) => { c.pick = { type: "unit", set, resolve }; render(); cancelButton(); });
  function cancelButton() {
    const box = U.choicesBox();
    box.innerHTML = "";
    box.append(el("div", { class: "idle-label" }, c.pick.type === "zone" ? "Tap a highlighted room" : "Tap a highlighted target"),
      el("button", { class: "btn choice", onclick: () => { U.click(); const p = c.pick; c.pick = null; U.clearChoices(); render(); if (p) p.resolve(null); } }, el("span", { class: "lbl" }, "Cancel")));
  }

  /* ================================================================== main loop */
  async function run() {
    if (c.enc.boss) await bossIntro();
    else log(`<b>${c.enc.name}.</b> ${c.surprise ? "You strike before they can turn." : (c.enc.fightText || "The paper dolls flicker and come for you.")}`);
    while (!c.done) {
      c.round += 1;
      c.order = initiative();
      if (c.round === 1) await propertyOpening();
      if (c.reverseNext) c.order.reverse();
      const heads = c.units.filter(alive).length;
      for (const x of c.units) if (x.kind === "agent") x.intr = R.initiative(x.ref) > heads ? 1 : 0;
      render();
      await zoneRound();
      for (const u of c.order) {
        if (c.done) break;
        if (!alive(u)) continue;
        c.active = u;
        render();
        await startOfTurn(u);
        if (c.done || !alive(u)) continue;
        if (u.skipTurn) { u.skipTurn = false; log(`${u.name} can't act this turn.`); await sleep(500); continue; }
        if (u.kind === "enemy" && !(c.surprise && c.round === 1)) await offerInterrupts(u);
        if (c.done || !alive(u)) continue;
        if (u.kind === "enemy") {
          if (c.surprise && c.round === 1) { continue; }
          await (u.t === "ghost" ? ghostTurn(u) : replicaTurn(u));
        } else await playerTurn(u);
        checkEnd();
        render();
      }
      await endRound();
    }
    await finish();
  }

  function initiative() {
    const bonus = { agent: 0, enemy: 0 };
    for (const z of Object.keys(c.zones)) { const ctl = controlOf(z); if (ctl) bonus[ctl] += 1; }
    const list = c.units.filter(alive).map((u) => {
      let sp = u.kind === "enemy" ? u.speed + bonus.enemy : (u.kind === "ally" ? 1 : R.initiative(u.ref)) + bonus.agent;
      if (u.kind === "agent" && (u.ref.injuries || []).some((i) => i.actLast)) sp = -99;
      return { u, sp };
    });
    list.sort((a, b) => b.sp - a.sp || (a.u.kind === "enemy") - (b.u.kind === "enemy"));
    return list.map((x) => x.u);
  }

  function checkEnd() {
    if (c.done) return;
    if (c.enc.boss) {
      const g = ghost();
      if (g.dead) { c.done = true; c.outcome = "killed"; return; }
    } else if (!foes().length) { c.done = true; c.outcome = "victory"; return; }
    if (!c.units.some((u) => isAgent(u) && alive(u))) { c.done = true; c.outcome = c.units.some((u) => u.fled) ? "fled" : "wiped"; }
  }

  async function endRound() {
    await zoneEnd();
    if (window.MAGIC) window.MAGIC.tick({ log, dispelAll: magicEnv(null).dispelAll }, c.units.filter((x) => x.kind === "agent").map((x) => x.ref));
    for (const u of c.units) {
      for (const st of [...statuses(u)]) {
        if (st.id === "protect" && st.rounds < 99) { st.rounds -= 1; if (st.rounds <= 0) removeStatus(u, "protect"); }
      }
      if (u.kind === "agent") {
        const S = cs(u);
        if (S.attacked !== c.round) { if (gw(u, "Patient")) S.patient = Math.min(12, (S.patient || 0) + 4); S.berserk = 0; }
        S.retal = 0;
        if (S.stealth > 0) { S.stealth -= 1; if (S.stealth === 0 && u.hidden) { u.hidden = false; log(`${u.name}'s Stealth Armor fades.`); } }
      }
    }
    for (const e of foes()) {
      if (!e.def.built || c.done) continue;
      const ad = mc(e, "Aura of Damage");
      if (ad) for (const f of friends().filter((x) => x.zone === e.zone)) { const pool = GE.param(e.def.mods, "Aura of Damage") || "health"; log(`${e.name}'s aura burns ${f.name} for ${2 * ad}.`, "hurt"); await hurt(f, pool, 2 * ad, { direct: true }); }
      const ah = mc(e, "Aura of Healing");
      if (ah) { const n = 2 + 5 * (ah - 1); for (const x of foes().filter((y) => y.zone === e.zone)) for (const k of ["health", "sanity", "stability"]) x.pools[k].cur = Math.min(x.pools[k].max, x.pools[k].cur + n); log(`${e.name}'s aura mends its allies (+${n}).`, "bad"); }
      if (mc(e, "Fated")) { c.gmFate += mc(e, "Fated"); G.state.gmFate = c.gmFate; log(`${e.name} gains the Beyond a Fate point.`, "bad"); }
      if (mc(e, "Death Mark") && !e.markDone && c.round >= (e.def.deathMark || 6)) { e.markDone = true; await deathMark(e); }
    }
    render();
  }
  async function deathMark(e) {
    log(`<b>${e.name}'s Death Mark comes due.</b> Everyone rolls the Death Die.`, "bad");
    for (const u of c.units.filter((x) => isAgent(x) && alive(x))) {
      const res = R.deathDie(u.ref);
      AudioMan.sfx("death_die");
      if (res.survived) log(`${u.name} rolls ${res.total} and lives.`, "good");
      else if (res.outcome === "now") { u.ref.dead = true; u.ref.deathText = "Claimed by a Death Mark."; log(`<b>${u.name} dies.</b>`, "bad"); }
      else { u.ref.marked = res.outcome; u.out = true; log(`${u.name} rolls ${res.total} and collapses, marked for death.`, "bad"); }
    }
    G.refreshParty(); checkEnd();
  }

  /* Speed above the number of fighters buys one Interruption a round: a single action in someone else's turn. */
  async function offerInterrupts(foe) {
    for (const x of c.units.filter((q) => q.kind === "agent" && alive(q) && q.intr > 0 && !q.hidden && !statusOf(q, "grappled"))) {
      if (c.done || !alive(foe)) return;
      const go = await LW(x.ref, () => U.choose(`${x.name} has an Interruption (Speed beats the ${c.units.filter(alive).length} fighters). Act before ${foe.name}?`, [{ id: "y", label: "Interrupt", hint: "one action now" }, { id: "n", label: "Save it" }]));
      if (go !== "y") continue;
      x.intr = 0; x.ap = 1;
      log(`<b>${x.name} interrupts.</b>`, "turn");
      c.active = x; render();
      const act = await LW(x.ref, () => chooseAction(x, 1));
      if (act && act !== "end") { await LW(x.ref, () => act()); checkEnd(); }
      x.ap = 0; c.active = foe; render();
    }
  }

  async function startOfTurn(u) {
    AudioMan.sfx("turn_start", { volume: 0.5 });
    await zoneTurn(u);
    const list = statuses(u);
    if (u.kind === "enemy") { u.turnPinned = !!u.pinned; u.pinned = false; u.movesTurn = 0; }
    if (u.kind === "agent") {
      const S = cs(u);
      S.freeSteps = S.freeStepsPer || 0;
      const ps = statusOf(u, "possessed");
      if (ps && !c.units.some((x) => x.uid === ps.by && !x.dead)) { removeStatus(u, "possessed"); log(`${u.name} is released as the possessor dies.`, "good"); }
      if (gw(u, "Wanted") && !foes().some((f) => f.uid === S.wanted) && foes().length) {
        const fs = foes(); const t = fs.length === 1 ? fs[0] : await pickUnit(fs);
        if (t) { S.wanted = t.uid; log(`${u.name} marks ${t.name}.`); }
      }
      if (foes().some((e) => mc(e, "Nightmare") && within(e.zone, 2).includes(u.zone)) && !statusOf(u, "terrified")) { addStatus(u, GE.statusObj("terrified")); log(`${u.name} is gripped by nightmare.`, "bad"); }
    }
    if (u.kind === "enemy" && u.def.regen && u.pools.health.cur < u.pools.health.max) {
      u.pools.health.cur = Math.min(u.pools.health.max, u.pools.health.cur + u.def.regen);
      log(`${u.name} regenerates ${u.def.regen}.`, "bad");
    }
    for (const s of [...list]) {
      if (s.id === "burning" || s.id === "bleeding") {
        const bl = s.id === "bleeding";
        log(`${u.name} ${bl ? "bleeds" : "burns"}: ${s.dmg} ${bl ? "" : "fire "}damage.`, "hurt");
        AudioMan.sfx(bl ? "health_hit" : "burn", { volume: 0.6 });
        if (u.kind === "enemy") hurtEnemy(u, "health", s.dmg); else await hurt(u, "health", s.dmg, { elemental: true });
        s.rounds -= 1;
        if (s.rounds <= 0) removeStatus(u, s.id);
        checkEnd();
        if (c.done || !alive(u)) return;
      }
      if (s.id === "paper") {
        s.rounds -= 1;
        if (s.rounds <= 0) { removeStatus(u, "paper"); log(`${u.name}'s skin softens back into flesh.`); }
      }
      if (s.id === "stun") { removeStatus(u, "stun"); u.skipTurn = true; }
      if (s.id === "terrified") {
        log(`${u.name} is terrified: 3 Sanity damage.`, "hurt");
        if (u.kind === "enemy") hurtEnemy(u, "sanity", 3); else await hurt(u, "sanity", 3, { direct: true });
        s.rounds -= 1; if (s.rounds <= 0) removeStatus(u, "terrified");
        if (c.done || !alive(u)) return;
      }
      if (s.id === "fear" || s.id === "soulsevered") {
        const pl = s.pool, nm = s.id === "fear" ? "Fear" : "Soul Severed";
        log(`${u.name} suffers ${nm}: ${s.dmg} ${R.POOL_LABEL[pl]}.`, "hurt");
        if (u.kind === "enemy") hurtEnemy(u, pl, s.dmg); else await hurt(u, pl, s.dmg, { direct: true });
        s.rounds -= 1; if (s.rounds <= 0) removeStatus(u, s.id);
        if (c.done || !alive(u)) return;
      }
      if (s.id === "suffocation") {
        log(`${u.name} can't breathe: 1 off every Healing Pool.`, "hurt");
        for (const k of ["health", "sanity", "stability"]) { if (u.kind === "enemy") hurtEnemy(u, k, 1); else await hurt(u, k, 1, { direct: true }); if (!alive(u)) break; }
        s.rounds -= 1; if (s.rounds <= 0) removeStatus(u, s.id);
        if (c.done || !alive(u)) return;
      }
      if (s.id === "commanded") { u.skipTurn = true; s.rounds -= 1; if (s.rounds <= 0) removeStatus(u, "commanded"); }
      if (s.id === "frozen" || s.id === "poisoned") { s.rounds -= 1; if (s.rounds <= 0) { removeStatus(u, s.id); log(`${u.name} is no longer ${s.id}.`); } }
      if (s.id === "inspire") {
        if (u.kind === "agent") { for (const k of ["health", "sanity", "stability"]) u.ref.pools[k].cur = Math.min(u.ref.pools[k].max, u.ref.pools[k].cur + 1); G.refreshParty(); }
        s.rounds -= 1; if (s.rounds <= 0) removeStatus(u, "inspire");
      }
      if (s.id === "protect" && s.caster === u.uid && s.rounds === 1) removeStatus(u, "protect");
    }
    if (u.kind === "agent" && (u.ref.injuries || []).some((i) => i.absent) && !u.skipTurn) {
      const d = R.roll2d6();
      if (d[0] + d[1] + R.aspect(u.ref, "mindfulness") < 8) { log(`${u.name} stares at nothing (Absent).`); u.skipTurn = true; }
    }
  }

  /* ================================================================== player turn */
  const LW = (a, f) => (window.LIVE ? window.LIVE.wrap(a, f) : f());
  const playerTurn = (u) => LW(u.ref, () => playerTurn0(u));
  async function playerTurn0(u) {
    const a = u.ref;
    let full = u.kind === "ally" ? 1 : R.actionsPerTurn(a, c.round);
    if (u.kind === "agent") {
      if (statusOf(u, "poisoned")) full = Math.max(1, full - 1);
      if ((pitchAt(u.zone) && a.vision !== "dark") || (radianceAt(u.zone) && !(a.traits && a.traits.sunSight))) full = Math.max(1, full - 1);
      if (cs(u).rapidNext) { full = 1; cs(u).rapidNext = false; }
      cs(u).offhand = false;
    }
    u.ap = full;
    log(`<b>${u.name}'s turn.</b>`, "turn");
    if (u.kind === "agent" && statusOf(u, "swallowed")) { await struggle(u); c.active = null; return; }
    if (u.kind === "agent" && statusOf(u, "possessed")) { const freed = await breakPossession(u); if (!freed) { await possessedAct(u); c.active = null; return; } }
    while (u.ap > 0 && !c.done && alive(u)) {
      if (statusOf(u, "grappled")) {
        const pick = await U.choose(`${u.name} is held. Only breaking free is possible.`, [{ id: "free", label: "Struggle free", hint: "Strength roll, costs an action" }, { id: "end", label: "End turn" }]);
        if (pick !== "free") break;
        await breakGrip(u); u.ap -= 1; render(); continue;
      }
      const act = await chooseAction(u, full);
      if (!act || act === "end") break;
      const spent = await act();
      if (spent === false) continue;
      u.ap -= spent === 0 ? 0 : (spent || 1);
      checkEnd();
      render();
    }
    c.active = null;
  }
  async function struggle(u) {
    const a = u.ref, s = statusOf(u, "swallowed");
    const r = await G.rollModal({ agent: a, label: "Claw free", sub: "Strength vs Challenging", mods: [{ label: "Strength", value: R.aspect(a, "strength"), base: true }], target: R.cr("challenging"), targetLabel: `CR ${R.cr("challenging")}`, kind: "check" });
    if (r.ok) { removeStatus(u, "swallowed"); const by = c.units.find((x) => x.uid === s.by); if (by) u.zone = by.zone; log(`${u.name} tears free.`, "good"); render(); return; }
    s.fails = (s.fails || 0) + 1;
    log(`${u.name} can't get out (${s.fails}/4).`, "bad");
    if (s.fails >= 4) { a.dead = true; a.deathText = "Swallowed whole."; log(`<b>${u.name} is eaten.</b>`, "bad"); U.flash(); checkEnd(); }
  }
  async function breakPossession(u) {
    const a = u.ref;
    const r = await G.rollModal({ agent: a, label: "Fight the possession", sub: "Morality vs Medium", mods: [{ label: "Morality", value: R.aspect(a, "morality"), base: true }], target: R.cr("medium"), targetLabel: `CR ${R.cr("medium")}`, kind: "check" });
    if (r.ok) { removeStatus(u, "possessed"); log(`${u.name} throws the thing out.`, "good"); return true; }
    return false;
  }
  async function possessedAct(u) {
    const a = u.ref;
    const victims = friends().filter((x) => x !== u && within(u.zone, rangeOf(u)).includes(x.zone));
    if (!victims.length) { log(`${u.name} stands rigid, eyes rolled back.`, "bad"); return; }
    const v = R.pick(victims);
    const d = R.roll2d6(); const total = d[0] + d[1] + a.weapon.bonus + R.aspect(a, a.weapon.aspect);
    if (R.meets(total, erOf(v))) { const dmg = Math.max(0, total - brOf(v)); log(`Possessed, ${u.name} attacks ${v.name} (${total} vs ER ${erOf(v)}): <b>${dmg}</b> Health.`, "hurt"); await hurt(v, "health", dmg); }
    else log(`Possessed, ${u.name} swings at ${v.name} and misses.`);
  }

  function chooseAction(u, full) {
    return new Promise((resolve) => {
      const a = u.ref;
      const box = U.choicesBox();
      box.innerHTML = "";
      const z = u.zone;
      const opts = [];
      const melee = u.kind === "agent" && a.weapon.range === 0 && !gw(u, "Long Range");
      const range = rangeOf(u);
      const targets = foes().filter((e) => !e.hidden && within(z, range).includes(e.zone));
      const frozen = !!statusOf(u, "frozen");
      opts.push({ label: "Move", hint: frozen ? "Frozen: cannot move" : controlOf(z) === "enemy" ? "Speed roll to break away" : "1 room", disabled: frozen, fn: () => doMove(u) });
      if (targets.length) opts.push({ label: "Attack", hint: u.kind === "ally" ? "revolver" : a.weapon.name, fn: () => doAttack(u, targets) });
      if (melee) {
        const chargeable = foes().filter((e) => c.adj[z].includes(e.zone));
        if (chargeable.length) opts.push({ label: "Charge", hint: flankedUnit(u) ? "Flanked: cannot charge" : "move in and strike, Strength roll", disabled: flankedUnit(u), fn: () => doCharge(u, chargeable) });
      }
      if (u.kind === "agent" && a.magic && R.potency(a) > 0 && Object.values(a.magic.words).some((n) => n > 0)) opts.push({ label: "Cast a spell", hint: foes().some((e) => near(z).includes(e.zone)) ? "string words" : "no foe in reach: heal or ward", fn: () => doCast(u) });
      if (u.kind === "agent" && a.traits.torchBearer && !a.flareUsed && inZone(z, foes()).length) opts.push({ label: "Lantern flare", hint: "once a day: 15 Stability to foes here", fn: () => doFlare(u) });
      if (u.kind === "agent" && window.MECH.powers(a).some((p) => p.kind === "auto" || p.kind === "narrative")) opts.push({ label: "Powers", hint: "patron gifts", fn: () => doPowers(u) });
      if (c.enc.boss && c.zones[z].knife && !c.knifeTaken && u.kind === "agent") opts.push({ label: "Take the bleeding knife", fn: () => doKnife(u) });
      if (c.enc.boss && u.kind === "agent" && G.api.done("so1") && G.api.done("so3")) {
        const g = ghost();
        const can = g.zone === z && u.ap >= 2;
        opts.push({ label: "Perform the banishment rite", hint: can ? "both actions · Occult, Ancient or Faith vs 10" : g.zone !== z ? "must stand with the Paper Ghost" : "needs both actions", disabled: !can, fn: () => doRite(u) });
      }
      if (u.kind === "agent") {
        if (gw(u, "Dash") && foes().length && !frozen) opts.push({ label: "Dash", hint: "move and attack as one action", fn: () => doDash(u) });
        if (gw(u, "Rapid Fire") && u.ap === full && targets.length) opts.push({ label: "Rapid Fire", hint: "up to 5 attacks, then 1 action next turn", fn: () => doRapid(u) });
        if (gw(u, "Dual Wield") && !cs(u).offhand && targets.length) opts.push({ label: "Off-hand attack", hint: "free, once a turn", fn: () => doOffhand(u) });
        if (gw(u, "Throwing") && a.weapon.range === 0) { const th = foes().filter((e) => !e.hidden && within(z, 1).includes(e.zone)); if (th.length) opts.push({ label: "Throw weapon", hint: "ranged one-handed, +1", fn: () => doThrow(u, th) }); }
        const gripable = foes().filter((e) => e.zone === z && !e.hidden);
        if (gripable.length && !statusOf(u, "grappled")) {
          opts.push({ label: "Grapple", hint: "Strength vs its CR: it can only struggle free", fn: () => doGrapple(u, gripable) });
          opts.push({ label: "Shove", hint: "Strength vs its CR: throw it one room away", fn: () => doShove(u, gripable) });
        }
        if (!u.hidden && foes().length) opts.push({ label: "Hide", hint: R.fx(a, "noHide") ? "Hysterical Laughter: cannot hide" : flankedUnit(u) ? "Flanked: cannot hide" : "Awareness vs the toughest foe's CR", disabled: flankedUnit(u) || R.fx(a, "noHide"), fn: () => doHide(u) });
        if (foes().some((e) => e.hidden)) opts.push({ label: "Search", hint: "find a hidden foe", fn: () => doSearch(u) });
        if (foes().length && c.canFlee) opts.push({ label: "Flee", hint: flankedUnit(u) ? "Flanked: cannot flee" : "Speed vs the toughest foe's CR", disabled: flankedUnit(u), fn: () => doFlee(u) });
        if (ga(u, "Stealth Armor") && !(a.dailyUsed || {}).stealth) opts.push({ label: "Stealth Armor", hint: "unseen for 6 rounds, once a day", fn: () => doStealth(u) });
        if (gw(u, "Glowing") && !c.zones[z].bright) opts.push({ label: "Weapon glow", hint: "free: this room becomes Glow", fn: async () => { c.zones[z].bright = true; c.zones[z].dark = false; log(`${a.weapon.name} glows.`); render(); return 0; } });
        if (gw(u, "Smokey") && !c.zones[z].dark) opts.push({ label: "Smoke", hint: "free: this room becomes Shadow", fn: async () => { c.zones[z].dark = true; c.zones[z].bright = false; log(`Smoke pours off ${a.weapon.name}. The room goes dim.`); render(); return 0; } });
      }
      if (statusOf(u, "burning") && u.ap === full) opts.push({ label: "Put out the flames", hint: "whole turn", fn: async () => { removeStatus(u, "burning"); log(`${u.name} beats out the flames.`); return full; } });
      opts.push({ label: "End turn", fn: () => "end" });
      box.append(el("div", { class: "turnhead" },
        el("span", { class: "chip", style: { backgroundImage: `url(${U.img(a.portrait || "nomura", "portraits")})` } }),
        el("b", {}, u.name), el("span", { class: "ap" }, "●".repeat(u.ap) + "○".repeat(Math.max(0, full - u.ap))), el("small", {}, c.zones[z].name)));
      const grid = el("div", { class: "idle-grid" });
      for (const o of opts) grid.append(el("button", { class: "btn choice" + (o.label === "End turn" ? " exit" : ""), disabled: o.disabled,
        onclick: () => { U.click(); box.innerHTML = ""; const r = o.fn; resolve(r === "end" || o.label === "End turn" ? "end" : r); } },
        el("span", { class: "lbl" }, o.label), o.hint ? el("span", { class: "hint" }, o.hint) : null));
      box.append(grid);
    });
  }

  /* ---------------------------------------------------------------- actions */
  const rangeOf = (u) => { const r = u.kind === "ally" ? 1 : u.ref.weapon.range + (gw(u, "Long Range") ? 1 : 0); return zoneSev(u.zone) >= 3 ? Math.min(r, 1) : r; };
  async function doMove(u) {
    if (statusOf(u, "frozen")) { log(`${u.name} is frozen in place.`); return false; }
    if (zoneBound(u)) { log(`${u.name} is held in place by spectral chains.`, "bad"); return false; }
    const dest = await pickZone(c.adj[u.zone]);
    if (!dest) return false;
    if (zmod(dest, "constricted") && ents(dest).length >= 2) { log(`${c.zones[dest].name} is too cramped: only 2 can fit.`, "bad"); return false; }
    if (zmod(dest, "obstructed")) {
      if (u.ap < 2 && !(cs(u).freeSteps > 0)) { log(`${c.zones[dest].name} is obstructed: crossing takes 2 movement.`, "bad"); return false; }
      u.ap -= 1; log(`Picking a way through ${c.zones[dest].name} takes extra effort.`);
    }
    if (controlOf(u.zone) === "enemy") {
      const need = Math.max(...inZone(u.zone, foes()).map((e) => e.cr));
      const r = u.kind === "agent"
        ? await G.rollModal({ agent: u.ref, label: "Break away", sub: "Reposition: Speed", mods: [{ label: "Speed", value: R.aspect(u.ref, "speed"), base: true }, ...penalties(u)], target: need, targetLabel: `beat the strongest foe here: ${need}`, kind: "check" })
        : { ok: R.meets(R.roll2d6().reduce((s, x) => s + x) + 1, need) };
      if (!r.ok) { log(`${u.name} can't break away.`); return 1; }
    }
    const freeStep = u.kind === "agent" && (cs(u).freeSteps || 0) > 0;
    if (freeStep) cs(u).freeSteps -= 1;
    u.zone = dest;
    AudioMan.sfx("footsteps", { volume: 0.5 });
    log(`${u.name} moves to ${c.zones[dest].name}.`);
    if (ga(u, "Blink") && c.adj[dest].length) {
      const more = await U.choose("Blink: one more room for free?", [{ id: "y", label: "Blink onward" }, { id: "n", label: "Stay here" }]);
      if (more === "y") { const d2 = await pickZone(c.adj[dest]); if (d2) { u.zone = d2; log(`${u.name} blinks into ${c.zones[d2].name}.`); } }
    }
    render();
    await reachCheck(u);
    if (freeStep) { log(`${u.name}'s quickened step costs no action.`); return 0; }
    return 1;
  }
  /* monsters with Reach strike anyone who walks into their room (once a round) */
  async function reachCheck(u) {
    for (const e of foes()) if (e.zone === u.zone && mc(e, "Reach") && e.reachRound !== c.round && alive(u) && !c.done) { e.reachRound = c.round; log(`${e.name} lashes out as ${u.name} enters.`); await enemyAttack(e, u, { free: true }); }
  }

  function penalties(u) {
    if (u.kind !== "agent") return [];
    const out = [];
    if (pitchAt(u.zone) && u.ref.vision !== "dark") out.push({ label: "Pitch dark", value: -R.SHADOW_PENALTY * 2 });
    else if (u.ref.vision !== "dark" && !glowIn(u.zone)) out.push({ label: "Shadow", value: -R.SHADOW_PENALTY });
    if (radianceAt(u.zone) && !(u.ref.traits && u.ref.traits.sunSight)) out.push({ label: "Blinding light", value: -R.BLIND_PENALTY });
    if (replicaIn(u.zone)) out.push({ label: "Disruption Aura", value: -2 });
    const bz = c.zones[u.zone] ? c.zones[u.zone].boost || 0 : 0;
    if (Math.abs(bz) === 2 && ((bz > 0 && !(u.ref.traits && u.ref.traits.sunSight)) || (bz < 0 && u.ref.vision !== "dark"))) out.push({ label: bz > 0 ? "Too bright: Blind" : "Too dark: Blind", value: -R.BLIND_PENALTY });
    if (R.fx(u.ref, "dependent") && friends().filter((x) => x.kind === "agent").length < 2) out.push({ label: "Alone (Dependent)", value: -2 });
    if (statusOf(u, "blind") || R.has(u.ref, "blind")) out.push({ label: "Blind", value: -R.BLIND_PENALTY });
    const sv_ = zoneSev(u.zone);
    if (R.weatherMod(sv_)) out.push({ label: `Weather ${sv_}`, value: R.weatherMod(sv_) });
    if ((u.ref.injuries || []).some((i) => i.blind)) out.push({ label: "Blind", value: -R.BLIND_PENALTY });
    return out;
  }

  async function doAttack(u, targets) {
    const t = targets.length === 1 ? targets[0] : await pickUnit(targets);
    if (!t) return false;
    await agentAttack(u, t);
    return 1;
  }

  async function doCharge(u, targets) {
    const t = targets.length === 1 ? targets[0] : await pickUnit(targets);
    if (!t) return false;
    if (statusOf(u, "frozen")) { log(`${u.name} is frozen in place.`); return false; }
    if (zoneBound(u)) { log(`${u.name} is held in place by spectral chains.`, "bad"); return false; }
    if (zmod(t.zone, "constricted") && ents(t.zone).length >= 2) { log(`No room to charge into ${c.zones[t.zone].name}.`, "bad"); return false; }
    const r = await G.rollModal({ agent: u.ref, label: `Charge ${t.name}`, sub: "Strength vs its CR", mods: [{ label: "Strength", value: R.aspect(u.ref, "strength"), base: true }, ...(gw(u, "Charging") ? [{ label: "Charging", value: 3 }] : []), ...penalties(u)],
      target: t.cr, targetLabel: `CR ${t.cr}`, items: G.itemsFor(u.ref, "strength"), kind: "check" });
    if (!r.ok) { log(`${u.name}'s charge falters.`); await enemyAttack(t, u, { counter: true }); return 1; }
    u.zone = t.zone;
    log(`${u.name} charges into ${c.zones[t.zone].name}!`);
    render();
    await reachCheck(u);
    if (alive(u) && alive(t)) await agentAttack(u, t);
    return 1;
  }

  /* returns true when the attack hit */
  async function agentAttack(u, t, opts = {}) {
    await familiarFaces(t);
    if (!alive(t) || !alive(u) || c.done) return false;
    if (intang(u.zone) || intang(t.zone)) { log(`${u.name}'s strike passes through nothing. The room is out of phase.`, "bad"); return false; }
    const a = u.ref;
    const isAlly = u.kind === "ally";
    const S = cs(u);
    const W = (n) => !isAlly && GE.w(a, n);
    let mods;
    if (isAlly) mods = [{ label: "Attack", value: u.ref.attackBonus != null ? u.ref.attackBonus : 3, base: true }];
    else if (opts.throw) mods = [{ label: "Thrown +1", value: 1, base: true }, { label: R.ASPECT_LABEL.awareness, value: R.aspect(a, "awareness") }, ...penalties(u)];
    else mods = [{ label: a.weapon.decay ? `${a.weapon.artifact || "Weapon"} +${u.dec == null ? a.weapon.decay : u.dec}` : `${a.weapon.type} +${a.weapon.bonus}`, value: a.weapon.decay ? (u.dec == null ? a.weapon.decay : u.dec) : a.weapon.bonus, base: true },
      { label: a.weapon.combo ? a.weapon.combo.map((k) => R.ASPECT_LABEL[k]).join(" + ") : R.ASPECT_LABEL[a.weapon.aspect], value: a.weapon.combo ? a.weapon.combo.reduce((s, k) => s + R.aspect(a, k), 0) : R.aspect(a, a.weapon.aspect) }, ...penalties(u)];
    if (!isAlly) {
      mods.push(...GE.rollMods(a));
      if (W("Foe Hater") && t.def.type === GE.pick(a, "w", "Foe Hater")) mods.push({ label: "Foe Hater", value: 2 });
      if (W("Leadership")) { const n = friends().filter((x) => x !== u && x.zone === u.zone).length; if (n) mods.push({ label: "Leadership", value: n }); }
      if (W("Wanted") && S.wanted === t.uid) mods.push({ label: "Wanted", value: 2 });
      if (W("Silent") && u.hidden) mods.push({ label: "Silent, hiding", value: 2 });
      if (statusOf(u, "inspire")) mods.push({ label: "Inspired", value: 2 });
    }
    if (u.knife && t.t === "ghost") mods.push({ label: "Bleeding knife", value: 2 });
    if (opts.extra) mods.push(opts.extra);
    const accurate = W("Accurate");
    const er = erOf(t) - (accurate ? 2 : 0);
    const agentLike = isAlly ? { short: u.name, portrait: u.ref.portrait || "nomura", fate: 0 } : a;
    const r = await G.rollModal({ agent: agentLike, label: `${u.name} attacks ${t.name}`, sub: isAlly ? (u.ref.attackBonus != null ? "Fights" : "Revolver") : opts.throw ? a.weapon.name + " (thrown)" : a.weapon.name, mods, target: er,
      targetLabel: `ER ${erOf(t)}${accurate ? " (Accurate: −2)" : ""}`, kind: "attack", allowFate: !isAlly && !opts.free });
    G.refreshParty();
    S.attacked = c.round;
    S.patient = 0;
    if (W("Suppression")) t.supp = (t.supp || 0) + 1;
    if (u.hidden && !(S.stealth > 0)) { u.hidden = false; log(`${u.name} is seen.`); }
    if (r.fumble && !isAlly && a.weapon.artifact === "THE WEIGHT OF SIN" && !a.weapon.cleansed) { R.addNoticed(a, 1); log("The Weight of Sin: +1 Noticed.", "bad"); }
    if (r.fumble) {
      log(`${u.name} fumbles!`, "bad");
      S.berserk = 0;
      if (t.zone === u.zone) await enemyAttack(t, u, { counter: true });
      return false;
    }
    if (!r.ok) {
      AudioMan.sfx("miss_whoosh"); log(`${u.name} misses ${t.name}.`);
      S.berserk = 0;
      if (W("Backlash") && !opts.noBacklash && alive(t) && !c.done) { log(`${a.weapon.name} lashes back for a free swing.`); await agentAttack(u, t, { free: true, noBacklash: true, extra: { label: "Backlash", value: -4 } }); }
      if (W("Covert") && !u.hidden && !c.done) await doHide(u, true);
      return false;
    }
    AudioMan.sfx(isAlly ? "gunshot" : a.weapon.sfx);
    const crit = r.crit || (W("Precise") && r.nat >= 11);
    if (crit && !r.crit) log("Precise: a critical hit.", "crit");
    let dmg = r.total - (W("Void") ? 0 : brOf(t));
    const wm = isAlly ? [] : a.weapon.mods;
    if (wm.includes("Heavy")) dmg += 2;
    if (W("Close Quarters") && t.zone === u.zone) dmg += 3;
    if (W("Berserker")) { if (S.berserk) log(`Berserker: +${S.berserk} damage.`); dmg += S.berserk || 0; S.berserk = (S.berserk || 0) + 1; }
    if (W("Suppression")) dmg -= 2;
    if (!isAlly && (a.bonusDamage || 0)) dmg += a.bonusDamage;
    if (!isAlly && a.weapon.decay) u.dec = Math.max(1, (u.dec == null ? a.weapon.decay : u.dec) - 1);
    if (!isAlly && a.weapon.mastered && dmg > 0) { dmg *= 2; }
    if (wm.includes("Breaching") && t.def.type === "Construct") dmg *= 2;
    const sp = isAlly ? null : a.weapon.specialty;
    if (crit && !isAlly) {
      if (sp === "Deadly") { dmg *= 2; log("Critical: Deadly, double damage!", "crit"); }
      if (sp === "Sunder") { t.br = Math.max(0, t.br - 3); t.mr = Math.max(0, t.mr - 3); t.sr = Math.max(0, t.sr - 3); log(`Critical: Sunder! ${t.name}'s resistances fall by 3.`, "crit"); }
      if (sp === "Forceful") { dmg += 5; }
    }
    dmg = Math.max(0, dmg);
    if (wm.includes("Cleave") && dmg > 1) {
      const others = inZone(t.zone, foes()).filter((e) => e !== t);
      if (others.length) {
        const c2 = await U.choose(`Cleave: split the ${dmg} damage with another foe in the room?`, [
          { id: "no", label: `All ${dmg} into ${t.name}` }, ...others.map((o) => ({ id: o.uid, label: `Split with ${o.name}` }))]);
        if (c2 !== "no") {
          const o = others.find((x) => x.uid === c2);
          const half = Math.floor(dmg / 2);
          dmg -= half;
          await familiarFaces(o);
          c.killer = u;
          applyHit(o, half, u);
        }
      }
    }
    c.killer = u;
    applyHit(t, dmg, u);
    if (W("Suppression")) t.supp = 0;
    if (W("Pin Down") && !t.dead) t.pinned = true;
    if (W("Spell Bane") && t.words > 0) { t.words -= 1; log(`${t.name} loses a word (${t.words} left).`); }
    if (!isAlly && a.weapon.bleed && !t.dead) addStatus(t, { id: "bleeding", label: "Bleeding", dmg: 2, rounds: 3 });
    /* weapon Specialties on a critical hit */
    if (crit && !isAlly) {
      const live = !t.dead;
      if (sp === "Flaming" && live) { addStatus(t, GE.statusObj("burning")); AudioMan.sfx("burn"); log(`Critical: ${t.name} is set alight!`, "crit"); }
      if (sp === "Sharp" && live) { addStatus(t, GE.statusObj("bleeding")); log(`Critical: ${t.name} bleeds.`, "crit"); }
      if (sp === "Poisonous" && live) { addStatus(t, GE.statusObj("poisoned")); log(`Critical: ${t.name} is poisoned (one fewer action).`, "crit"); }
      if (sp === "Frost" && live) { addStatus(t, GE.statusObj("frozen")); log(`Critical: ${t.name} is frozen solid and cannot move.`, "crit"); }
      if (sp === "Crushing" && live) { addStatus(t, GE.statusObj("crippled")); log(`Critical: a bone breaks. ${t.name} is crippled.`, "crit"); }
      if (sp === "Stun" && live) { addStatus(t, { id: "stun", label: "Stunned" }); log(`Critical: ${t.name} is stunned and loses its next turn.`, "crit"); }
      if (sp === "Forceful" && live) {
        const away = c.adj[t.zone].filter((z) => z !== u.zone)[0] || c.adj[t.zone][0];
        if (away) { t.zone = away; log(`Critical: ${t.name} is thrown into ${c.zones[away].name}.`, "crit"); }
      }
      if (sp === "Harmony") { u.ap += 1; log("Critical: Harmony grants another action.", "crit"); }
      if (sp === "Inspire") { for (const f of friends()) addStatus(f, { id: "inspire", label: "Inspired", rounds: 5 }); log("Critical: Inspire! Allies gain +2 to Attack and heal 1 of each pool for 5 rounds.", "crit"); }
      if (sp === "Lightning") { const half = Math.floor(dmg / 2); for (const o of inZone(t.zone, foes())) if (o !== t && half > 0) { log(`Lightning arcs into ${o.name} for ${half}.`, "crit"); c.killer = u; hurtEnemy(o, "health", half); } }
      if (sp === "Vampiric" && dmg > 0) { const hp = a.pools.health; hp.cur = Math.min(hp.max, hp.cur + dmg); log(`Critical: ${u.name} drinks ${dmg} Health.`, "crit"); G.refreshParty(); }
      if (sp === "Block") { u.block = true; log(`Critical: ${u.name} is ready to turn aside the next blow.`, "crit"); }
    }
    /* weapon Modifiers on a hit */
    if (W("Explosive") && dmg > 1) {
      const half = Math.floor(dmg / 2);
      for (const x of c.units.filter((q) => q.zone === t.zone && q !== t && q !== u && alive(q))) {
        log(`The blast catches ${x.name} for ${half}.`, "hurt");
        if (x.kind === "enemy") { c.killer = u; hurtEnemy(x, "health", half); } else await hurt(x, "health", half, { direct: true });
      }
    }
    if (t.dead && !isAlly) {
      if (W("Bloodlust") && S.bloodRound !== c.round && !opts.noChain) {
        const next = foes().filter((e) => !e.hidden && within(u.zone, rangeOf(u)).includes(e.zone));
        if (next.length) { S.bloodRound = c.round; const t2 = next.length === 1 ? next[0] : await pickUnit(next); if (t2) { log("Bloodlust: a free attack."); await agentAttack(u, t2, { free: true, noChain: true }); } }
      }
      if (W("Intimidating") && foes().length && !c.done) {
        const f = foes()[0];
        const ir = await G.rollModal({ agent: a, label: `Intimidate ${f.name}`, sub: "Charisma vs its CR", mods: [{ label: "Charisma", value: R.aspect(a, "charisma"), base: true }, ...penalties(u)], target: f.cr, targetLabel: `CR ${f.cr}`, kind: "check" });
        if (ir.ok) { f.dead = true; log(`${f.name} breaks and runs.`, "crit"); checkEnd(); }
      }
    }
    if (W("Ricochet") && !c.done) {
      const more = foes().filter((e) => e !== t && !e.hidden && within(u.zone, rangeOf(u)).includes(e.zone));
      if (more.length) { const t2 = more.length === 1 ? more[0] : await pickUnit(more); if (t2) { log("Ricochet!"); await agentAttack(u, t2, { free: true, noBacklash: true, noChain: true, extra: { label: "Ricochet", value: -3 } }); } }
    }
    if (W("Covert") && !u.hidden && !c.done) await doHide(u, true);
    return true;
  }

  /* ---------------------------------------------------------------- hiding, fleeing and the other weapon actions */
  async function doHide(u, free = false) {
    const a = u.ref;
    if ((a.injuries || []).some((i) => i.disorderName === "Hysterical Laughter")) { log(`${u.name} can't stop laughing, and so can't hide.`); return free ? false : 1; }
    const need = Math.max(...foes().map((e) => e.cr), 7);
    const mods = [{ label: "Awareness", value: R.aspect(a, "awareness"), base: true }, ...penalties(u)];
    if (ga(u, "Discreet")) mods.push({ label: "Discreet", value: 1 });
    if (free && gw(u, "Silent")) mods.push({ label: "Silent", value: 2 });
    const r = await G.rollModal({ agent: a, label: free ? "Slip out of sight" : "Hide", sub: "Awareness vs the toughest foe's CR", mods, target: need, targetLabel: `CR ${need}`, kind: "check", allowFate: !free });
    if (r.ok) { u.hidden = true; log(`${u.name} slips out of sight. No one can find ${a.short} until ${a.short} acts or is found.`); render(); }
    else log(`${u.name} is spotted.`);
    return free ? true : 1;
  }
  async function doSearch(u) {
    const hid = foes().filter((e) => e.hidden);
    const t = hid.length === 1 ? hid[0] : await pickUnit(hid);
    if (!t) return false;
    const a = u.ref;
    const r = await G.rollModal({ agent: a, label: `Search for ${t.name}`, sub: "Awareness vs its CR", mods: [{ label: "Awareness", value: R.aspect(a, "awareness"), base: true }, ...penalties(u)], target: t.cr, targetLabel: `CR ${t.cr}`, kind: "check" });
    if (r.ok) { t.hidden = false; log(`${u.name} spots ${t.name}.`); render(); } else log(`${u.name} finds nothing.`);
    return 1;
  }
  /* Forceful Movement and Grapples. Magic moves automatically; bodies roll Strength against the CR.
     A grapple moves nothing: the held one can only spend actions trying to break free. */
  async function strengthContest(u, t, label) {
    return G.rollModal({ agent: u.ref, label: `${label} ${t.name}`, sub: "Strength vs its CR", mods: [{ label: "Strength", value: R.aspect(u.ref, "strength"), base: true }, ...penalties(u)], target: t.cr, targetLabel: `CR ${t.cr}`, items: G.itemsFor(u.ref, "strength"), kind: "check" });
  }
  async function doGrapple(u, targets) {
    const t = targets.length === 1 ? targets[0] : await pickUnit(targets);
    if (!t) return false;
    const r = await strengthContest(u, t, "Grapple");
    if (!r.ok) { log(`${u.name} can't get a grip on ${t.name}.`); return 1; }
    addStatus(t, { id: "grappled", label: "Grappled", by: u.uid, rounds: 99 });
    log(`${u.name} pins ${t.name}. It can do nothing but struggle.`, "good");
    return 1;
  }
  async function doShove(u, targets) {
    const t = targets.length === 1 ? targets[0] : await pickUnit(targets);
    if (!t) return false;
    const r = await strengthContest(u, t, "Shove");
    if (!r.ok) { log(`${u.name} can't budge ${t.name}.`); return 1; }
    const dest = await pickZone(c.adj[t.zone]);
    if (dest) { t.zone = dest; removeStatus(t, "grappled"); log(`${u.name} drives ${t.name} back into ${c.zones[dest].name}.`, "good"); render(); }
    return 1;
  }
  async function breakGrip(u) {
    const g = statusOf(u, "grappled");
    const holder = c.units.find((x) => x.uid === g.by);
    if (!holder || !alive(holder) || holder.zone !== u.zone) { removeStatus(u, "grappled"); log(`${u.name} is no longer held.`); return false; }
    const need = u.kind === "enemy" ? 7 + (holder.kind === "agent" ? R.aspect(holder.ref, "strength") : 2) : holder.cr;
    if (u.kind === "enemy") {
      const d = R.roll2d6(), tot = d[0] + d[1] + (((u.def && u.def.core && u.def.core.body) || 1));
      if (tot >= need) { removeStatus(u, "grappled"); log(`${u.name} tears free (${tot} vs ${need}).`, "bad"); }
      else log(`${u.name} thrashes in the hold (${tot} vs ${need}).`, "good");
      return true;
    }
    const r = await G.rollModal({ agent: u.ref, label: "Break free", sub: "Strength vs the holder's CR", mods: [{ label: "Strength", value: R.aspect(u.ref, "strength"), base: true }, ...penalties(u)], target: need, targetLabel: `CR ${need}`, kind: "check" });
    if (r.ok) { removeStatus(u, "grappled"); log(`${u.name} breaks free.`, "good"); } else log(`${u.name} can't break the hold.`, "bad");
    return true;
  }

  async function doFlee(u) {
    const a = u.ref;
    if (zoneBound(u)) { log(`${u.name} can't leave: spectral chains.`, "bad"); return false; }
    if (R.fx(a, "noFlee")) { log(`${u.name} can't walk away from a fight (Intermittent Explosive Disorder).`); return false; }
    if (a.prop && a.prop.easyEscape) { u.out = true; u.fled = true; log(`<b>${u.name} slips out the way the Easy Escape was built for.</b>`, "good"); checkEnd(); return 2; }
    const need = Math.max(...foes().map((e) => e.cr));
    const mods = [{ label: "Speed", value: R.aspect(a, "speed"), base: true }, ...penalties(u)];
    if (ga(u, "Slippery")) mods.push({ label: "Slippery", value: 4 });
    const r = await G.rollModal({ agent: a, label: "Flee", sub: "Speed vs the toughest foe's CR", mods, target: need, targetLabel: `CR ${need}`, kind: "check" });
    if (!r.ok) { log(`${u.name} can't get away.`); return 2; }
    u.out = true; u.fled = true;
    log(`<b>${u.name} gets out.</b>`, "good");
    if (a.traits && a.traits.crossFlee && a.core.spirit > 1) { a.core.spirit -= 1; log(`The Cross takes its price: ${u.name}'s Spirit falls by 1.`, "bad"); }
    checkEnd();
    return 2;
  }
  async function doStealth(u) {
    const a = u.ref;
    a.dailyUsed = a.dailyUsed || {}; a.dailyUsed.stealth = true;
    cs(u).stealth = 6; u.hidden = true;
    AudioMan.sfx("guard");
    log(`${u.name}'s armor drinks the light. Unseen for six rounds.`, "spell");
    render();
    return 1;
  }
  async function doDash(u) {
    const dest = await pickZone(c.adj[u.zone]);
    if (!dest) return false;
    u.zone = dest; log(`${u.name} dashes into ${c.zones[dest].name}.`); render();
    await reachCheck(u);
    const targets = foes().filter((e) => !e.hidden && within(dest, rangeOf(u)).includes(e.zone));
    if (targets.length && alive(u)) { const t = targets.length === 1 ? targets[0] : await pickUnit(targets); if (t) await agentAttack(u, t); }
    return 1;
  }
  async function doRapid(u) {
    let n = 0;
    for (let i = 0; i < 5 && !c.done && alive(u); i++) {
      const targets = foes().filter((e) => !e.hidden && within(u.zone, rangeOf(u)).includes(e.zone));
      if (!targets.length) break;
      const t = targets.length === 1 ? targets[0] : await pickUnit(targets);
      if (!t) break;
      await agentAttack(u, t, { free: true, noBacklash: i > 0 });
      n++;
    }
    if (!n) return false;
    cs(u).rapidNext = true;
    return u.ap;
  }
  async function doOffhand(u) {
    const targets = foes().filter((e) => !e.hidden && within(u.zone, rangeOf(u)).includes(e.zone));
    const t = targets.length === 1 ? targets[0] : await pickUnit(targets);
    if (!t) return false;
    cs(u).offhand = true;
    await agentAttack(u, t, { free: true });
    return 0;
  }
  async function doThrow(u, targets) {
    const t = targets.length === 1 ? targets[0] : await pickUnit(targets);
    if (!t) return false;
    await agentAttack(u, t, { throw: true });
    return 1;
  }

  function applyHit(t, dmg, u) {
    if (t.dead) return;
    if (dmg <= 0) { log(`${u.name} hits ${t.name}, but it shrugs it off.`); floatNum(t, "0", "zero"); return; }
    if (t.t === "replica" && dmg > 10) {
      log(`${u.name} tears straight through ${t.name}. <b>Fragile Construction</b>: destroyed.`, "crit");
      AudioMan.sfx("paper_tear");
      t.pools.health.cur = 0;
      kill(t);
      return;
    }
    const zd = zoneDt(u.zone);
    const pool = zd === "sanity" || zd === "stability" ? zd : "health";
    log(`${u.name} hits ${t.name} for <b>${dmg}</b> ${R.POOL_LABEL[pool]}.`);
    hurtEnemy(t, pool, dmg);
    if (zmod(u.zone, "bloodMist") && alive(u) && u.kind !== "enemy") { const hp = poolsOf(u).health; const b = hp.cur; hp.cur = Math.min(hp.max, hp.cur + dmg); if (hp.cur > b) { log(`Blood Mist: ${u.name} drinks ${hp.cur - b} Health.`, "good"); G.refreshParty(); } }
  }

  function hurtEnemy(e, pool, n) {
    if (e.dead) return;
    if (zmod(e.zone, "chaoticHealing") && R.d6() === 6) { const p = e.pools[pool]; p.cur = Math.min(p.max, p.cur + n); log(`${e.name} is healed instead (Chaotic Healing).`, "bad"); render(); return; }
    if (c.rec) c.rec.push({ u: e, pool, n, zone: e.zone });
    e.pools[pool].cur -= n;
    floatNum(e, "−" + n, pool);
    if (e.pools[pool].cur <= 0 && mc(e, "Undeath")) {
      const d = R.d6();
      if (d >= 4) { e.pools[pool].cur = Math.min(e.pools[pool].max, 10); log(`${e.name} refuses to die (${d}). It rises with ${e.pools[pool].cur} ${R.POOL_LABEL[pool]}.`, "bad"); render(); return; }
      log(`${e.name} twitches (${d}) and stays down.`);
    }
    if (e.pools[pool].cur <= 0) kill(e);
    render();
  }

  function kill(e) {
    e.dead = true;
    if (e.t === "ghost") { AudioMan.sfx("ghost_die"); log("<b>The Paper Ghost is torn apart.</b>", "crit"); }
    else { AudioMan.sfx(e.def.hitSfx || "paper_crinkle"); log(e.t === "replica" ? `${e.name} crumples into a heap of creased paper.` : `${e.name} ${e.def.dies || "goes down"}.`); }
    const k = c.killer;
    if (k && k.kind === "agent" && ga(k, "Cannibal")) { const hp = k.ref.pools.health; hp.cur = Math.min(hp.max, hp.cur + 2); log(`${k.name} feeds: +2 Health.`, "good"); G.refreshParty(); }
    for (const q of c.units) { const sw = q.kind === "agent" && statusOf(q, "swallowed"); if (sw && sw.by === e.uid) { removeStatus(q, "swallowed"); q.zone = e.zone; log(`${q.name} tumbles out of ${e.name}.`, "good"); } }
    checkEnd();
  }

  /* Familiar Faces: the first time a replica is attacked, everyone sees the real tenant screaming. */
  async function familiarFaces(t) {
    if (t.t !== "replica" || t.attacked) return;
    t.attacked = true;
    const npc = M.npcs[t.as];
    AudioMan.sfx("replica_flicker");
    await faceFlash(npc);
    const agents = c.units.filter((u) => isAgent(u) && alive(u));
    const res = await G.groupCheck({ aspect: "morality", cr: R.cr("easy"), label: "Familiar Faces", agents: agents.map((u) => u.ref),
      intro: `For a split moment ${t.name} looks exactly like ${npc.name}, screaming. Morality vs ${R.cr("easy")}, or take 5 Sanity and 5 Stability damage.`,
      ctx: (a) => zoneCtx(agents.find((u) => u.ref === a)) });
    for (const r of res) {
      if (r.ok) continue;
      const u = agents.find((x) => x.ref === r.agent);
      log(`${u.name} hesitates.`, "hurt");
      await hurt(u, "sanity", 5, { direct: true });
      if (alive(u)) await hurt(u, "stability", 5, { direct: true });
    }
  }

  function faceFlash(npc) {
    return new Promise((res) => {
      AudioMan.sfx("replica_scream");
      const f = el("div", { class: "faceflash" }, el("img", { src: U.img(npc.portrait, "portraits"), alt: "" }));
      document.body.append(f);
      U.shake();
      setTimeout(() => { f.remove(); res(); }, U.reduced() ? 300 : 900);
    });
  }

  /* ---------------------------------------------------------------- magic */
  const zoneSpread = (start, n) => { const out = [start]; let f = [start]; while (out.length < n && f.length) { const nx = []; for (const q of f) for (const z of c.adj[q]) if (!out.includes(z) && out.length < n) { out.push(z); nx.push(z); } f = nx; } return out; };
  const magicEnv = (u) => ({
    log, alive, familiar: (t) => (t.kind === "enemy" ? familiarFaces(t) : Promise.resolve()),
    hurt: async (t, pool, n) => { if (t.kind === "enemy") hurtEnemy(t, pool, n); else await hurt(t, pool, n, { direct: true, spell: true }); },
    heal: (t, pool, n) => { if (zmod(t.zone, "chaoticHealing")) { log(`Chaotic Healing: ${t.name} loses ${n} instead.`, "bad"); if (t.kind === "enemy") hurtEnemy(t, pool, n); else poolsOf(t)[pool].cur = Math.max(1, poolsOf(t)[pool].cur - n); G.refreshParty(); return 0; } const p = poolsOf(t)[pool]; const b = p.cur; p.cur = Math.min(p.max, p.cur + n); floatNum(t, "+" + (p.cur - b), "heal"); AudioMan.sfx("heal"); G.refreshParty(); return p.cur - b; },
    statuses, addStatus, removeStatus,
    allyBoost: (t, k, n, sid) => {
      const map = { strength: "attackBonus", agility: "er", durability: "br", willpower: "mr", morality: "sr" };
      const f = map[k]; if (!f) return;
      t.ref[f] = (t.ref[f] || 0) + n;
      MAGIC.undo(sid, () => { t.ref[f] -= n; });
    },
    speed: (t, n, rounds, sid) => {
      if (t.kind === "enemy") { const was = t.speed; t.speed = Math.max(0, t.speed + n); MAGIC.undo(sid, () => { t.speed = was; }); log(`${t.name} is ${n < 0 ? "slowed" : "quickened"}.`, "spell"); }
      else if (t.kind === "agent") {
        (t.ref.spellBuffs = t.ref.spellBuffs || []).push({ aspect: "speed", n, rounds, spell: sid });
        const S = cs(t); S.freeStepsPer = (S.freeStepsPer || 0) + n; S.freeSteps = S.freeStepsPer; MAGIC.undo(sid, () => { S.freeStepsPer = Math.max(0, (S.freeStepsPer || 0) - n); S.freeSteps = Math.min(S.freeSteps || 0, S.freeStepsPer); });
        log(`${t.name} is ${n < 0 ? "slowed" : "quickened: +" + n + " Speed and " + n + " free Zone step" + (n > 1 ? "s" : "") + " a turn"}.`, "good");
      }
    },
    light: (z, n, sid) => { const Z = c.zones[z]; Z.boost = (Z.boost || 0) + n; MAGIC.undo(sid, () => { Z.boost -= n; }); render(); },
    zoneOf: (x) => x.zone, zoneName: (z) => c.zones[z].name,
    move: async (t, p) => {
      const set = within(t.zone, p).filter((z) => z !== t.zone);
      if (!set.length) return;
      log(`Where does ${t.name} go? (up to ${p} Zone${p > 1 ? "s" : ""})`);
      const dest = await pickZone(set);
      if (!dest) return;
      t.zone = dest; log(`${t.name} is thrown into ${c.zones[dest].name}.`, "spell"); render();
    },
    mimic: (m) => { (c.mimics = c.mimics || []).push(m); },
    weather: (k, p) => { c.weather = { kind: k, p }; },
    dispelAll: (sid) => {
      for (const x of c.units) { const L = statuses(x); for (let i = L.length - 1; i >= 0; i--) if (L[i].spell === sid) L.splice(i, 1); }
      c.mimics = (c.mimics || []).filter((m) => m.spell !== sid);
      for (const x of c.units) if (x.spell === sid && x.kind === "ally") { x.out = true; log(`${x.name} fades away.`); }
      render();
    },
    spawn: async ({ name, diff, type, who, spell }) => {
      const m = window.ADV.buildMonster({ name, type: type || "Human", difficulty: diff, sprite: "humanoid", mods: [] });
      const look = { skin: "#c68d62", hairC: "#17120f", hair: "short", outfit: "#2b2b2b", extra: "none", bg: "#2b2f3a", name };
      const ref = { id: "sm_" + Date.now(), name, short: name, portrait: window.ART.portrait(look), attackBonus: m.attack + 2, er: m.er, br: m.br, mr: m.mr, sr: m.sr,
        pools: { health: { cur: m.health, max: m.health }, sanity: { cur: m.sanity, max: m.sanity }, stability: { cur: m.stability, max: m.stability } } };
      c.units.push({ kind: "ally", uid: ref.id, ref, name, zone: who.zone, out: false, spell });
      log(`${name} answers the call.`, "spell"); render();
    }
  });

  async function doCast(u) {
    const a = u.ref;
    if (R.potency(a) < 1) { log(`${u.name} has no Potency. No string of words can be spoken.`); return false; }
    if (intang(u.zone)) { log(`Magic can't take hold while the room is out of phase.`, "bad"); return false; }
    if (zmod(u.zone, "warped") && !(await zoneCheck(u, "willpower", R.cr("medium"), "Speak through the warped sound"))) { log(`${u.name}'s words come out as noise.`, "bad"); return 1; }
    const spell = await MAGIC.build(a);
    if (!spell) return false;
    const range = near(u.zone);
    const T = { enemies: [], allies: [], zones: [], areas: spell.areas, objects: spell.objects };
    const pickMany = async (cand, n, mine) => {
      if (cand.length <= n) return cand.slice();
      const out = [];
      while (out.length < n) { const t = await pickUnit(cand.filter((x) => !out.includes(x))); if (!t) break; out.push(t); }
      return out;
    };
    if (spell.enemies) {
      const cand = foes().filter((e) => range.includes(e.zone));
      if (!cand.length) { log(`No foe is within a room of ${u.name}. The words wait.`); return false; }
      T.enemies = await pickMany(cand, spell.enemies);
      if (!T.enemies.length) return false;
    }
    if (spell.allies) {
      if (spell.self) T.allies = [u];
      else T.allies = await pickMany(friends().filter((x) => range.includes(x.zone)), spell.allies);
    }
    if (spell.areas) {
      log("Choose the middle of the area.");
      const z = await pickZone(range);
      if (!z) return false;
      T.zones = zoneSpread(z, spell.areas);
    }
    for (const w of spell.words) a.magic.words[w] -= 1;
    AudioMan.sfx("spell_cast");
    U.flash("#fff3c8");
    await MAGIC.run(magicEnv(u), u, spell, T);
    G.refreshParty();
    checkEnd();
    render();
    return 1;
  }

  async function doPowers(u) {
    const a = u.ref, list = window.MECH.powers(a).filter((p) => p.kind === "auto" || p.kind === "narrative");
    const id = await U.choose("Call on a patron's gift", [...list.map((p) => ({ id: p.key, label: p.name, hint: (p.cost ? `${p.cost.n} ${R.POOL_LABEL[p.cost.pool]}` : "free") + (p.kind === "narrative" ? " · ruled at the table" : "") })), { id: "x", label: "Never mind" }]);
    const p = list.find((x) => x.key === id); if (!p) return false;
    if (p.auto === "wrath" || p.auto === "arrival") {
      if (!window.MECH.pay(a, p.cost)) return false;
      let targets = foes();
      if (p.auto === "arrival") targets = targets.filter((e) => near3(u.zone).includes(e.zone)).slice(0, 5);
      AudioMan.sfx(p.auto === "wrath" ? "flare" : "banish"); U.flash(p.auto === "wrath" ? "#fff7d6" : "#3a1a4a");
      log(`${u.name} calls on <b>${p.name}</b>.`, "spell");
      for (const e of targets) { if (e.dead) continue; const n = p.auto === "wrath" && e.def.type !== "Human" ? 20 : 10; log(`${e.name} takes <b>${n}</b> Corrupted damage.`); hurtEnemy(e, "health", n); }
      return 2;
    }
    const used = await window.MECH.use(a, p);
    return used ? 1 : false;
  }
  const near3 = (z) => { const seen = new Set([z]); let f = [z]; for (let i = 0; i < 3; i++) { const nx = []; for (const q of f) for (const n of c.adj[q]) if (!seen.has(n)) { seen.add(n); nx.push(n); } f = nx; } return [...seen]; };

  async function doFlare(u) {
    u.ref.flareUsed = true;
    AudioMan.sfx("flare");
    U.flash("#fff7d6");
    log(`${u.name}'s lantern blazes white.`, "spell");
    for (const e of inZone(u.zone, foes())) { await familiarFaces(e); if (!e.dead) { log(`${e.name} takes <b>15</b> Stability.`); hurtEnemy(e, "stability", 15); } }
    return 1;
  }

  async function doKnife(u) {
    c.knifeTaken = true;
    u.knife = true;
    AudioMan.sfx("blade_hit");
    log(`${u.name} takes the knife.`, "spell");
    await G.api.narrate("The only thing in the room that hasn't become paper: the murder weapon, still fresh with blood. It drips endlessly, and where it touches the floor the paper peels back.");
    await G.api.complete("so2");
    render();
    return 1;
  }

  async function doRite(u) {
    const a = u.ref;
    const best = ["occult", "ancient", "faith"].sort((x, y) => R.aspect(a, y) - R.aspect(a, x))[0];
    await G.api.narrate(`${u.name} opens the Yamada family book and reads the name aloud, line by line, as Ichiban's journal instructs, tracing the old forms of the Folded Palm in the air.`);
    const r = await G.rollModal({ agent: a, label: "The banishment rite", sub: `${R.ASPECT_LABEL[best]}: reseal the dojo`, mods: [{ label: R.ASPECT_LABEL[best], value: R.aspect(a, best), base: true }, ...penalties(u)],
      target: R.cr("medium"), targetLabel: `CR ${R.cr("medium")} · Medium`, items: G.itemsFor(a, best), kind: "check" });
    G.refreshParty();
    if (r.ok) { c.done = true; c.outcome = "banished"; return 2; }
    log("The Paper Ghost clutches the talisman tighter. The folds resist.", "bad");
    return 2;
  }

  /* ================================================================== damage to agents */
  async function hurt(u, pool, amount, opts = {}) {
    if (!alive(u) || amount <= 0) return 0;
    const a = u.ref;
    if (zmod(u.zone, "chaoticHealing") && R.d6() === 6) { const pp = a.pools[pool]; pp.cur = Math.min(pp.max, pp.cur + amount); log(`${u.name} is healed instead (Chaotic Healing).`, "good"); G.refreshParty(); render(); return 0; }
    if (c.rec) c.rec.push({ u, pool, n: amount, zone: u.zone });
    if (u.kind === "agent" && (a.injuries || []).some((i) => i.extraDamage)) amount += 2;
    const ward = statusOf(u, "protect");
    if (ward && ward.pools.includes(pool) && !opts.elemental) {
      const cut = Math.min(amount, ward.amt);
      amount -= cut;
      if (cut) log(`The ward absorbs ${cut}.`);
      if (amount <= 0) return 0;
    }
    if (u.kind === "agent" && opts.elemental && ga(u, "Built From Darkness")) { amount = Math.max(0, amount - brOf(u)); if (amount <= 0) return 0; }
    if (u.kind === "agent" && pool === "sanity" && a.traits && a.traits.sanityImmune && !opts.self) { log(`${u.name} feels nothing. The Dead Mountain takes it.`); return 0; }
    const p = a.pools[pool];
    if (u.kind === "agent" && pool === "sanity" && p.cur - amount <= 0) {
      const bonds = a.bonds.filter((b) => b.value > 0);
      if (bonds.length) {
        const ch = await U.choose(`${u.name}'s mind is about to break. Let a Bond carry it? (${amount} Sanity damage)`, [
          ...bonds.map((b, i) => ({ id: String(i), label: `${b.name}, ${b.rel} (${b.value})` })), { id: "no", label: "Take it" }]);
        if (ch !== "no") {
          const b = bonds[+ch];
          b.value -= amount;
          log(`${u.name} pushes it down, and somewhere across Tokyo, ${b.name} feels them pull away.${b.value <= 0 ? " The Bond is severed." : ""}`, "bond");
          G.refreshParty();
          return 0;
        }
      }
    }
    if (u.kind === "agent" && pool === "stability" && a.magic && p.cur - amount <= 0 && window.MAGIC) {
      const gave = await window.MAGIC.stabilityBuffer(a, amount, u.name);
      if (gave) { amount -= gave; log(`${u.name} cuts ${gave} word${gave > 1 ? "s" : ""} loose to stay in this world.`, "bad"); if (amount <= 0) { G.refreshParty(); return 0; } }
    }
    p.cur -= amount;
    floatNum(u, "−" + amount, pool);
    AudioMan.sfx(pool === "health" ? "health_hit" : pool === "sanity" ? "sanity_hit" : "stability_hit", { volume: 0.7 });
    G.refreshParty();
    render();
    if (p.cur <= 0) await poolZero(u, pool);
    return amount;
  }

  async function takeInjury(u, pool) {
    const a = u.ref, safe = R.safeInjuries(a, pool), pickFrom = safe.length ? safe : R.INJURIES[pool];
    const iid = await U.choose(`Choose ${u.name}'s ${R.POOL_LABEL[pool]} injury.`, pickFrom.map((i) => ({ id: i.id, label: i.name, hint: i.text })));
    const chosen = R.INJURIES[pool].find((i) => i.id === iid) || pickFrom[0];
    let did = null, mut = null;
    if (chosen.mutation) { const rolls = R.rollMutation(); const traits = []; for (const r of rolls) if (r.aspect === "trait") traits.push(await U.choose("Choose the Mutation Trait.", R.MUTATIONS.map((m) => ({ id: m.id, label: m.name, hint: m.text })))); mut = { rolls, traits }; }
    if (chosen.disorder) did = await U.choose("Choose the Mental Disorder.", R.DISORDERS.filter((d) => d.id !== "hopeless").map((d) => ({ id: d.id, label: d.name, hint: d.text })));
    const res = R.applyInjury(a, pool, chosen.id, did, mut);
    log(`${u.name} suffers <b>${res.injury.name}</b>: ${res.injury.text} ${res.notes.join(" ")}`, "bad");
    if (res.died) { a.dead = true; a.deathText = `${R.deathCause(pool, u.name)}`; log(`<b>${u.name} is dead.</b>`, "bad"); }
  }
  const poolZero = (u, pool) => LW(u.ref, () => poolZero0(u, pool));
  async function poolZero0(u, pool) {
    const a = u.ref;
    a.pools[pool].cur = 0;
    if (u.kind === "ally") {
      u.out = true;
      if (pool === "health") a.dead = true;
      log(`<b>${u.name} goes down.</b>`, "bad");
      return;
    }
    if (a.traits && a.traits.lastStand && !a.lastStandUsed) {
      a.lastStandUsed = true;
      for (const k of ["health", "sanity", "stability"]) a.pools[k].cur = Math.min(a.pools[k].max, a.pools[k].cur + 5);
      AudioMan.sfx("guard");
      log(`<b>Last Stand.</b> ${u.name} refuses to fall: +5 to every Healing Pool.`, "crit");
      G.refreshParty();
      return;
    }
    const risky = Object.entries(a.core).filter(([, v]) => v <= 1).map(([k]) => k);
    const warn = risky.length ? ` ${u.name}'s ${risky.map((k) => k[0].toUpperCase() + k.slice(1)).join(" and ")} ${risky.length > 1 ? "are" : "is"} already 1: an Injury that lowers ${risky.length > 1 ? "them" : "it"} is death.` : "";
    const choice = await U.modal({ title: `${u.name}: ${R.POOL_LABEL[pool]} 0`, jp: "瀕死", dismiss: false,
      body: `<p>${R.POOL_LABEL[pool]} has hit 0. Choose.</p><p><b>Take an Injury:</b> recover 10 ${R.POOL_LABEL[pool]}, but suffer a ${R.POOL_LABEL[pool]} injury of your choice and lose a Core Stat point.${warn}</p><p><b>Roll the Death Die:</b> 2d6. On 7 or more, recover half of every Healing Pool. Below 7, ${u.name} is marked for death.</p>`,
      buttons: [{ id: "injury", label: "Take an Injury" }, { id: "die", label: "Roll the Death Die", cls: "primary" }] });
    if (choice === "injury") {
      const safe = R.safeInjuries(a, pool);
      const pickFrom = safe.length ? safe : R.INJURIES[pool];
      const iid = await U.choose(`Choose ${u.name}'s ${R.POOL_LABEL[pool]} injury. It is how they keep fighting.${safe.length ? "" : " Every option is fatal; choose carefully."}`,
        pickFrom.map((i) => ({ id: i.id, label: i.name, hint: i.text })));
      const chosen = R.INJURIES[pool].find((i) => i.id === iid) || pickFrom[0];
      let did = null, mut = null;
      if (chosen.mutation) {
        const rolls = R.rollMutation();
        await U.modal({ title: "The Beyond rewrites you", jp: "変異", dismiss: false, body: `<p>Two rolls of 3d6 on the Mutation table.</p><p class="mono">${rolls.map((r) => `${r.dice.join(" + ")} = ${r.total}: ${r.aspect === "trait" ? "a Mutation Trait" : R.ASPECT_LABEL[r.aspect]}`).join("<br>")}</p><p>${rolls.some((r) => r.aspect === "trait") ? "A Mutation Trait. You choose which." : "These two Aspects swap values."}</p>`, buttons: [{ id: "ok", label: "Continue", cls: "primary" }] });
        const traits = [];
        for (const r of rolls) if (r.aspect === "trait") traits.push(await U.choose("Choose the Mutation Trait.", R.MUTATIONS.map((m) => ({ id: m.id, label: m.name, hint: m.text }))));
        mut = { rolls, traits };
      }
      if (chosen.disorder) did = await U.choose("Choose the Mental Disorder.", R.DISORDERS.map((d) => ({ id: d.id, label: d.name, hint: d.text })));
      const res = R.applyInjury(a, pool, chosen.id, did, mut);
      if (did === "existential") {
        const names = { body: "Body", mind: "Mind", spirit: "Spirit" };
        const from = await U.choose("Existential Crisis: which Core Stat falls (with all its Aspects)?", Object.keys(names).filter((k) => a.core[k] > 1).map((k) => ({ id: k, label: `${names[k]} (${a.core[k]})` })));
        const to = await U.choose("Which Core Stat takes the same points?", Object.keys(names).filter((k) => k !== from).map((k) => ({ id: k, label: `${names[k]} (${a.core[k]})` })));
        if (from && to) { R.existential(a, from, to); log(`${u.name}'s ${names[from]} falls by 1 and ${names[to]} rises by 1, Aspects with them.`, "bad"); }
      }
      AudioMan.sfx("injury");
      log(`${u.name} suffers <b>${res.injury.name}</b>: ${res.injury.text} ${res.notes.join(" ")}`, "bad");
      if (res.injury.needsSpirit && !res.died) await takeInjury(u, "stability");
      if (res.died) { a.dead = true; a.deathText = `The ${res.injury.name.toLowerCase()} was more than ${u.name} could take. ${R.deathCause(pool, u.name)}`; log(`<b>${u.name} is dead.</b>`, "bad"); U.flash(); }
      else if (c.canFlee && foes().length && !R.fx(a, "noFlee") && !u.out) {
        const go = await U.choose("Taking an Injury gives a free Flee. Use it now?", [{ id: "y", label: "Flee for free", hint: "Speed vs the toughest foe's CR" }, { id: "n", label: "Keep fighting" }]);
        if (go === "y") await doFlee(u);
      }
    } else {
      AudioMan.sfx("death_die");
      const res = R.deathDie(a);
      await U.modal({ title: "The Death Die", jp: "生死", dismiss: false, body: `<div class="dice-row">${[0, 1].map((i) => `<div class="die landed" data-v="${res.dice[i]}">${pipHTML(res.dice[i])}</div>`).join("")}</div><p class="center big">${res.total}: ${res.survived ? "survives" : "marked for death"}</p>`,
        buttons: [{ id: "ok", label: "Continue", cls: "primary" }] });
      if (res.survived) log(`${u.name} drags a breath back in (${res.total}). Half of every Healing Pool returns.`, "crit");
      else if (res.outcome === "now") { a.dead = true; a.deathText = "The Death Die came up short, and the GM's die said now. " + R.deathCause(pool, u.name); log(`<b>${u.name} dies.</b>`, "bad"); U.flash(); }
      else { a.marked = res.outcome; a.markedPool = pool; u.out = true; log(`${u.name} collapses, <b>marked for death</b>. They aren't ready to go just yet.`, "bad"); }
    }
    G.refreshParty();
    render();
    checkEnd();
  }
  const pipHTML = (v) => { const P = { 1: [5], 2: [1, 9], 3: [1, 5, 9], 4: [1, 3, 7, 9], 5: [1, 3, 5, 7, 9], 6: [1, 3, 4, 6, 7, 9] }; let s = ""; for (let i = 1; i <= 9; i++) s += `<i class="${P[v].includes(i) ? "on" : ""}"></i>`; return s; };

  /* ================================================================== enemy turns */
  async function replicaTurn(e) {
    const n = Math.max(1, (e.t === "replica" ? 1 : Math.max(1, e.actions || 1)) - (statusOf(e, "poisoned") ? 1 : 0));
    for (let i = 0; i < n && !c.done; i++) { if (!alive(e)) break; await enemyAct(e); }
  }
  const targetable = () => friends().filter((x) => !x.hidden && !statusOf(x, "swallowed"));
  async function enemyAct(e) {
    await sleep(350);
    if (statusOf(e, "grappled")) { await breakGrip(e); return; }
    for (const m of c.mimics || []) {
      if (m.rounds <= 0) continue;
      e.seen = e.seen || {};
      if (e.seen[m.spell] === "saw") continue;
      const d = R.roll2d6(), tot = d[0] + d[1] + ((e.def && e.def.core && e.def.core.mind) || 0);
      if (tot >= m.cr) { e.seen[m.spell] = "saw"; log(`${e.name} sees through the illusion (${tot} vs CR ${m.cr}).`); }
      else { log(`${e.name} lunges at ${m.what}, and wastes its turn (${tot} vs CR ${m.cr}).`, "good"); return; }
    }
    const tg = targetable();
    const here = inZone(e.zone, tg);
    const reach = e.def.range || 0;
    const shoot = reach ? tg.filter((u) => within(e.zone, reach).includes(u.zone)) : [];
    if (e.def.built && e.words > 0 && (here.length || shoot.length) && rnd() < 0.5) { if (await enemyCast(e)) return; }
    if (here.length || shoot.length) {
      const pool = here.length ? here : shoot;
      if (e.def.built && (mc(e, "Possession") || mc(e, "Hijack"))) {
        const cand = pool.filter((x) => x.kind === "agent" && !statusOf(x, "possessed"));
        if (cand.length && !e.possessing && rnd() < 0.6) { await enemyPossess(e, cand[0]); return; }
      }
      const t = pool.sort((x, y) => erOf(x) - erOf(y))[0];
      /* Monsters grapple too: a hand-to-hand foe in the same room sometimes grabs instead of striking */
      const held = here.filter((x) => x.kind !== "ally" && !statusOf(x, "grappled") && !x.hidden);
      const grip = !e.def.range && held.length && !c.units.some((x) => statusOf(x, "grappled") && x.kind === "agent" && statusOf(x, "grappled").by === e.uid) && rnd() < 0.25;
      if (grip) {
        const v = held.sort((x, y) => (R.aspect(x.ref, "strength") || 0) - (R.aspect(y.ref, "strength") || 0))[0];
        const d = R.roll2d6(), tot = d[0] + d[1] + ((e.def.core && e.def.core.body) || 1), need = 7 + (R.aspect(v.ref, "strength") || 0);
        if (tot >= need) { addStatus(v, { id: "grappled", label: "Grappled", by: e.uid, rounds: 99 }); log(`<b>${e.name} seizes ${v.name}</b> (${tot} vs ${need}). ${v.name} can only try to break free.`, "bad"); }
        else log(`${e.name} grabs for ${v.name} and ${v.name} twists clear (${tot} vs ${need}).`, "good");
        return;
      }
      await enemyAttack(e, t);
      return;
    }
    if (statusOf(e, "frozen")) { log(`${e.name} is frozen solid.`); return; }
    if (e.turnPinned && (e.movesTurn || 0) >= 1) { log(`${e.name} is pinned down.`); return; }
    const goal = friends().map((u) => u.zone);
    if (!goal.length) return;
    const steps = e.turnPinned ? 1 : (e.def.built ? (e.def.move || 1) : 1);
    for (let i = 0; i < steps; i++) {
      const step = bfsStep(e.zone, goal);
      if (step === e.zone) break;
      if (zoneBound(e)) { log(`${e.name} strains against the chains.`); break; }
      if (zmod(step, "constricted") && ents(step).length >= 2) break;
      if (zmod(step, "obstructed")) { if (i + 1 >= steps && (e.movesTurn || 0) < 1) { e.movesTurn = 1; log(`${e.name} claws through the clutter.`); break; } i += 1; }
      e.zone = step;
    }
    e.movesTurn = (e.movesTurn || 0) + 1;
    log(`${e.name} ${e.t === "replica" ? "drifts" : "moves"} into ${c.zones[e.zone].name}.`);
    AudioMan.sfx(e.def.hitSfx || "paper_crinkle", { volume: 0.4 });
    if (mc(e, "Elusive") && !e.hidden && !flankedUnit(e)) { e.hidden = true; log(`${e.name} melts out of sight.`); }
    render();
    for (const f of friends()) if (gw(f, "Reach") && f.zone === e.zone && cs(f).reachRound !== c.round && alive(e)) { cs(f).reachRound = c.round; log(`${f.name} strikes first as ${e.name} closes in.`); await agentAttack(f, e, { free: true, noBacklash: true }); }
  }
  async function enemyPossess(e, t) {
    let ok = true;
    if (mc(e, "Possession")) {
      const d1 = R.roll2d6(), d2 = R.roll2d6();
      const mine = d1[0] + d1[1] + e.attack, theirs = d2[0] + d2[1] + R.aspect(t.ref, "morality");
      ok = mine > theirs;
      log(`${e.name} reaches for ${t.name}'s mind: ${mine} against ${theirs}.`, "bad");
    }
    if (!ok) { log(`${t.name} holds on to themselves.`, "good"); return; }
    addStatus(t, { id: "possessed", label: "Possessed", rounds: 99, by: e.uid });
    e.possessing = t.uid;
    log(`<b>${t.name} is possessed.</b>`, "bad");
    G.refreshParty();
  }
  async function enemyCast(e) {
    const tg = targetable().filter((x) => within(e.zone, 1).includes(x.zone));
    if (!tg.length) return false;
    const t = tg.sort((x, y) => poolsOf(x).health.cur - poolsOf(y).health.cur)[0];
    e.words -= 1;
    const p = Math.max(1, e.def.potency || 1);
    const dt = ["health", "sanity", "stability"].includes(e.def.dtype) ? e.def.dtype : "stability";
    let dmg = 3 * p;
    if (t.kind === "agent" && ga(t, "Magic Resistant")) dmg -= dt === "health" ? brOf(t) : dt === "sanity" ? R.mr(t.ref) : R.sr(t.ref);
    dmg = Math.max(0, dmg);
    AudioMan.sfx("spell_cast");
    log(`${e.name} speaks a word at ${t.name}: <b>${dmg}</b> ${R.POOL_LABEL[dt]}. (${e.words} words left)`, "spell");
    if (dmg) await hurt(t, dt, dmg, { direct: true });
    return true;
  }
  const healFoe = (e, pool, n) => { if (zmod(e.zone, "chaoticHealing")) { hurtEnemy(e, pool, n); return; } const p = e.pools[pool]; const b = p.cur; p.cur = Math.min(p.max, p.cur + n); if (p.cur > b) log(`${e.name} heals ${p.cur - b} ${R.POOL_LABEL[pool]}.`, "bad"); };
  const hitStatus = (t, id) => {
    if (!GE.STATUS[id]) return;
    if (id === "crippled" && t.kind === "agent") { t.ref.crippled = true; log(`${t.name} is crippled: Body −2 until a long rest.`, "bad"); }
    else { addStatus(t, GE.statusObj(id)); log(`${t.name} is ${GE.STATUS[id].label.toLowerCase()}.`, "bad"); }
  };

  async function enemyAttack(e, t, opts = {}) {
    if (!alive(e) || !alive(t) || c.done) return;
    if (intang(e.zone) || intang(t.zone)) { log(`${e.name} swipes through empty air. The room is out of phase.`, "good"); return; }
    if (e.hidden) { e.hidden = false; log(`${e.name} bursts out of hiding.`); }
    if (!opts.counter && t.kind === "agent") {
      const ox = c.units.find((u) => u.kind === "agent" && u !== t && u.ref.traits && u.ref.traits.guardian && alive(u) && u.zone === t.zone && !statusOf(u, "stun"));
      if (ox) {
        const ch = await U.choose(`${e.name} goes for ${t.name}. ${ox.name} is right there.`, [{ id: "yes", label: `${ox.name} steps in and takes the hit` }, { id: "no", label: `Let ${t.name} take it` }]);
        if (ch === "yes") { t = ox; AudioMan.sfx("guard"); log(`${ox.name} steps in front.`); }
      }
    }
    if (!opts.counter) {
      for (const f of friends()) {
        if (f.kind !== "agent" || f === t || !gw(f, "Covering Fire") || cs(f).coverRound === c.round || !alive(e) || !within(f.zone, rangeOf(f)).includes(e.zone)) continue;
        cs(f).coverRound = c.round;
        log(`${f.name} lays down covering fire.`);
        await agentAttack(f, e, { free: true, noBacklash: true });
        if (!alive(e) || c.done) return;
      }
    }
    await sleep(250);
    let dice = R.roll2d6();
    let total = dice[0] + dice[1] + e.attack;
    const er = erOf(t);
    let hit = R.meets(total, er) && dice[0] + dice[1] !== 2;
    if (!hit && e.t === "ghost" && c.gmFate > 0 && e.pools.health.cur <= e.pools.health.max * 0.6 && dice[0] + dice[1] !== 2) {
      c.gmFate -= 1;
      G.state.gmFate = c.gmFate;
      dice = [6, 6];
      total = 12 + e.attack;
      hit = true;
      AudioMan.sfx("fate");
      log("<b>The Beyond leans in.</b> (The GM spends their Fate Point.)", "bad");
    }
    const line = `${e.name} ${opts.counter ? "counters" : "attacks"} ${t.name}: ${dieGlyph(dice[0])}${dieGlyph(dice[1])} +${e.attack} = ${total} vs ER ${er}`;
    if (dice[0] + dice[1] === 2) {
      log(line + ". Fumble!", "good");
      if (t.kind === "agent" && !opts.counter) { log(`${t.name} gets a free counter-attack.`); await agentAttack(t, e, { free: true }); }
      return;
    }
    if (!hit) {
      AudioMan.sfx("miss_whoosh"); log(line + ". Miss.");
      await retaliate(e, t, opts);
      return;
    }
    AudioMan.sfx(e.t === "ghost" ? "ghost_hit" : (e.def.hitSfx || "paper_crinkle"));
    let dt = zoneDt(e.zone) || e.def.dtype || "health", elemental = false, resist = 0;
    if (dt === "elemental") { dt = "health"; elemental = true; }
    else if (dt === "corrupted") { dt = "health"; resist = 0; }
    else resist = dt === "health" ? brOf(t) : t.kind === "agent" ? (dt === "sanity" ? R.mr(t.ref) : R.sr(t.ref)) : 0;
    const bonus = (e.def.dmgBonus && e.def.dmgBonus[dt]) || 0;
    const pen = e.def.rangedPenalty && e.zone !== t.zone ? e.def.rangedPenalty : 0;
    let dmg = Math.max(0, total - resist + bonus - pen);
    if (t.kind === "agent" && t.block && dmg > 0) { t.block = false; dmg = 0; log(`${t.name} turns the blow aside (Block).`, "good"); }
    if (dt === "health" && t.kind === "agent" && statusOf(t, "paper") && dmg > 10) {
      log(line + `. ${t.name} is paper: <b>Fragile</b>. The blow goes straight through.`, "bad");
      AudioMan.sfx("paper_tear");
      t.ref.pools.health.cur = 0;
      await poolZero(t, "health");
      return;
    }
    log(line + `. Hit: <b>${dmg}</b> ${R.POOL_LABEL[dt]}.`, dmg ? "hurt" : "");
    let dealt = 0;
    if (dmg) dealt = await hurt(t, dt, dmg, elemental ? { elemental: true } : {});
    if (dealt > 0 && zmod(e.zone, "bloodMist")) { const hp = e.pools.health; hp.cur = Math.min(hp.max, hp.cur + dealt); log(`Blood Mist: ${e.name} drinks ${dealt} Health.`, "bad"); }
    if (e.def.built && !c.done) {
      if (dealt > 0) {
        if (mc(e, "Bloodthirsty")) healFoe(e, "health", 5 * mc(e, "Bloodthirsty"));
        if (mc(e, "Brain Food")) healFoe(e, "sanity", 5 * mc(e, "Brain Food"));
        if (mc(e, "Soul Feed")) healFoe(e, "stability", 5 * mc(e, "Soul Feed"));
      }
      if (mc(e, "Deadly") && alive(t)) hitStatus(t, GE.param(e.def.mods, "Deadly") || "bleeding");
      if (mc(e, "Toxic") && dice[0] + dice[1] === 12 && alive(t)) hitStatus(t, GE.param(e.def.mods, "Toxic") || "poisoned");
      if (mc(e, "Explosive")) for (const x of c.units.filter((q) => q.zone === t.zone && q !== t && alive(q))) { log(`The blast catches ${x.name}.`, "hurt"); if (x.kind === "enemy") hurtEnemy(x, "health", dmg); else await hurt(x, "health", dmg, { direct: true }); }
      if (mc(e, "Swallow") && t.kind === "agent" && alive(t) && !c.units.some((x) => x.kind === "agent" && statusOf(x, "swallowed")) && rnd() < 0.5) {
        if (ga(t, "Spiked")) { log(`${t.name}'s armor bristles: ${e.name} takes 6.`, "good"); hurtEnemy(e, "health", 6); }
        if (alive(e)) { addStatus(t, { id: "swallowed", label: "Swallowed", rounds: 99, by: e.uid, fails: 0 }); log(`<b>${e.name} swallows ${t.name}.</b>`, "bad"); G.refreshParty(); render(); }
      }
    }
    await retaliate(e, t, opts);
  }
  async function retaliate(e, t, opts) {
    if (opts.counter || t.kind !== "agent" || !alive(t) || !alive(e) || !gw(t, "Retaliate") || !within(t.zone, rangeOf(t)).includes(e.zone) || statusOf(t, "swallowed")) return;
    cs(t).retal = (cs(t).retal || 0) + 2;
    log(`${t.name} retaliates (−2 ER and BR this round).`);
    await agentAttack(t, e, { free: true, noBacklash: true });
  }

  /* ---------------------------------------------------------------- the Paper Ghost */
  const BARKS = ["You are not the right shape.", "Fold what remains.", "We stood upright. We did not fall.", "Remember us.", "Who called us home?", "Finally. Finally."];
  async function bossIntro() {
    render();
    AudioMan.sfx("paper_tear");
    await G.api.aloud(M.text.ghostFree);
    AudioMan.sfx("ghost_free");
    U.shake();
    U.flash("#ffffff");
    U.print("“Finally I am free.”", "said ghost", { who: { name: "The Paper Ghost", jp: "紙の幽霊" } });
    await U.waitContinue("Fight");
    log("<b>The Paper Ghost</b> rises in the bedroom. Its paper doubles of Kaede Yamada and Daisuke Nomura turn toward the door.");
  }

  async function ghostTurn(e) {
    for (const k of Object.keys(e.cd)) e.cd[k] = Math.max(0, e.cd[k] - 1);
    if (e.shape) { revertShape(e); }
    if (rnd() < 0.3) U.print(`“${R.pick(BARKS)}”`, "said ghost small", { who: { name: "The Paper Ghost" } });
    const anyNear = friends().some((u) => near(e.zone).includes(u.zone));
    if (e.cd.shape === 0 && c.round >= 2 && anyNear) changeShape(e);
    for (let i = 0; i < e.actions && !c.done; i++) {
      await sleep(500);
      render();
      const here = inZone(e.zone, friends());
      const agentsAlive = c.units.filter((u) => isAgent(u) && alive(u));
      if (e.cd.walls === 0 && agentsAlive.length >= 2 && (rnd() < 0.45 || (!here.length && rnd() < 0.7))) { e.cd.walls = 3; await shiftingWalls(e); continue; }
      if (here.length) {
        const agentsHere = here.filter(isAgent);
        const caster = agentsHere.find((u) => u.ref.magic);
        if (e.cd.palm === 0 && agentsHere.length && rnd() < 0.4) { e.cd.palm = 2; await folded(e, caster || R.pick(agentsHere)); continue; }
        const fleshy = agentsHere.filter((u) => !statusOf(u, "paper"));
        if (e.cd.fold === 0 && fleshy.length && rnd() < 0.35) { e.cd.fold = 2; await foldingFlesh(e, R.pick(fleshy)); continue; }
        const paperOnes = here.filter((u) => statusOf(u, "paper"));
        const t = paperOnes[0] || here.sort((x, y) => poolsOf(x).health.cur - poolsOf(y).health.cur)[0];
        await enemyAttack(e, t);
      } else {
        const step = bfsStep(e.zone, friends().map((u) => u.zone));
        if (step !== e.zone) { e.zone = step; AudioMan.sfx("paper_crinkle"); log(`The Paper Ghost unfolds itself into ${c.zones[step].name}.`); }
      }
    }
  }

  function changeShape(e) {
    const form = rnd() < 0.5 ? "blades" : "lantern";
    e.cd.shape = 4;
    e.shape = form;
    if (form === "blades") { e._swap = { attack: e.attack, br: e.br }; [e.attack, e.br] = [e.br, e.attack]; }
    else { e._swap = { attack: e.attack, mr: e.mr }; [e.attack, e.mr] = [e.mr, e.attack]; }
    AudioMan.sfx("ghost_shape");
    U.shake();
    log(form === "blades"
      ? `<b>Change Shape.</b> The Paper Ghost refolds its arms into long creased blades. (Attack and Body Resistance swap: Attack +${e.attack}, BR ${e.br}, for one round.)`
      : `<b>Change Shape.</b> The Paper Ghost balloons into a lantern of ribbed paper, light pouring from its eyes. (Attack and Mind Resistance swap: Attack +${e.attack}, MR ${e.mr}, for one round.)`, "bad");
    render();
  }
  function revertShape(e) {
    if (e._swap) Object.assign(e, e._swap);
    if (e._swap && e.br < e._swap.br) e.br = e._swap.br;
    e._swap = null;
    e.shape = null;
    log("The Paper Ghost folds back into its slender shape.");
  }

  async function shiftingWalls(e) {
    AudioMan.sfx("shift_walls");
    U.shake();
    log("<b>Shifting Walls.</b> The walls fold into themselves, rearranging the rooms.", "bad");
    const agents = c.units.filter((u) => isAgent(u) && alive(u));
    const res = await G.groupCheck({ aspect: "agility", cr: R.cr("medium"), label: "Shifting Walls", agents: agents.map((u) => u.ref), tags: ["trap"],
      intro: `Agility vs ${R.cr("medium")} to keep your footing, or be folded into another room (3 Sanity and 3 Stability damage).`,
      ctx: (a) => { const u = agents.find((x) => x.ref === a); const k = zoneCtx(u); if (u.knife) k.extra.push({ label: "Bleeding knife", value: 2 }); return k; } });
    for (const r of res) {
      if (r.ok) continue;
      const u = agents.find((x) => x.ref === r.agent);
      const others = Object.keys(c.zones).filter((z) => z !== u.zone);
      u.zone = R.pick(others);
      log(`${u.name} is folded away into ${c.zones[u.zone].name}.`, "hurt");
      await hurt(u, "stability", 3, { direct: true });
      if (alive(u)) await hurt(u, "sanity", 3, { direct: true });
    }
    render();
  }

  async function foldingFlesh(e, t) {
    AudioMan.sfx("folding_flesh");
    log(`<b>Folding Flesh.</b> The Paper Ghost reaches for ${t.name}.`, "bad");
    const r = await G.rollModal({ agent: t.ref, label: "Folding Flesh", sub: "Morality: stay flesh", mods: [{ label: "Morality", value: R.aspect(t.ref, "morality"), base: true }, ...penalties(t)],
      target: R.cr("medium"), targetLabel: `CR ${R.cr("medium")}`, items: G.itemsFor(t.ref, "morality"), kind: "check" });
    if (r.ok) { log(`${t.name}'s skin creases, then holds.`); return; }
    const rounds = R.d6();
    addStatus(t, { id: "paper", label: `Paper ${rounds}`, rounds: rounds + 1 });
    log(`${t.name} turns to paper for ${rounds} round${rounds > 1 ? "s" : ""}. Any hit over 10 will tear straight through.`, "bad");
    G.refreshParty();
  }

  async function folded(e, t) {
    AudioMan.sfx("stun_gong");
    log(`<b>Way of the Folded Palm.</b> A sweeping brushstroke of a strike at ${t.name}.`, "bad");
    const r = await G.rollModal({ agent: t.ref, label: "Way of the Folded Palm", sub: "Willpower: stay in control", mods: [{ label: "Willpower", value: R.aspect(t.ref, "willpower"), base: true }, ...penalties(t)],
      target: 8, targetLabel: "CR 8", items: G.itemsFor(t.ref, "willpower"), kind: "check" });
    if (r.ok) { log(`${t.name} keeps their feet.`); return; }
    addStatus(t, { id: "stun", label: "Stunned" });
    log(`${t.name} is stunned and will lose their next turn.`, "bad");
  }

  /* ================================================================== finish */
  async function finish() {
    const st = G.state;
    st.gmFate = c.gmFate;
    for (const u of c.units) {
      if (u.kind === "enemy") continue;
      const a = u.ref;
      for (const st of a.statuses || []) if (st.id === "disease") R.afflict(a, "disease", st.cr || 10); else if (st.id === "blind" || st.id === "befuddled" || st.id === "exhausted") R.afflict(a, st.id);
      a.statuses = []; a._zp = 0;
      if (u.kind === "agent" && window.MAGIC) window.MAGIC.endCombat({ log: () => {}, dispelAll: () => {} }, [a]);
      if (!a.dead && GE.a(a, "Recycled Blood")) { const n = R.d6(); a.pools.health.cur = Math.min(a.pools.health.max, a.pools.health.cur + n); }
      if (!a.dead) {
        for (const k of ["health", "sanity", "stability"]) if (a.pools[k].cur <= 0) a.pools[k].cur = 1;
        u.out = false;
      }
    }
    await sleep(300);
    U.$("#board").hidden = true;
    U.$("#scene").classList.remove("combat");
    delete document.body.dataset.mode;
    G.state.phase = c.outcome === "victory" ? "explore" : G.state.phase;
    const out = c.outcome;
    c.resolve(out);
    if (out === "victory") { G.renderLocation(); }
  }

  window.COMBAT = C;
})();
