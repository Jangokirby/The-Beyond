/* ============================================================================
   RPGX 2: scavenging (lights and supplies), the case map with quick travel, the noise you make
   when you do things the loud way, and word of how you solved it getting around town.
   ========================================================================== */
(function () {
  const G = window.GAME, U = window.UI, R = window.R; if (!G || !U || !window.FIELD) return;
  const el = U.el, FW = window.FIELD;
  const here = () => (G.state && G.state.loc) || "";
  const used = () => (G.state._fw = G.state._fw || {});
  const has = (a, p) => (a.perks || []).includes(p);

  /* ---------------------------------------------------------------- scavenge */
  FW.scavenge = async () => {
    const k = "scav:" + here(); if (used()[k]) return U.toast("You have already picked this place over.");
    used()[k] = true;
    await G.run(async () => {
      await G.api.narrate("You spend a while going through what the place has left lying about.");
      const r = await G.check({ aspect: "awareness", cr: R.cr(G.active().some((a) => has(a, "scavenger")) ? "easy" : "medium"), label: "Scavenge", who: "choose", tags: ["scavenge"] });
      const who = r.agent || G.active()[0];
      if (!r.ok) { G.state._press = (G.state._press || 0) + 2; await G.api.narrate("Dust, string, a broken bottle. It takes longer than it should. (+2 time)"); return; }
      const lamp = G.active().flatMap((a) => (a.items || []).filter((it) => { const d = it.def || (window.MODULE.items || {})[it.id]; return d && d.light; })).find((it) => it.fuel !== undefined && it.fuel <= 4);
      if (lamp) { lamp.fuel = (lamp.fuel || 0) + 6; lamp.uses = Math.max(lamp.uses, 1); await G.api.narrate("Oil, a battery, a stub of candle: enough to top up the light. (+6 light)"); }
      else { (who.items = who.items || []).push({ id: "flashlight", tier: 1, uses: 1, fuel: 8 }); await G.api.narrate(`${who.short} finds a spare light, still good. It goes in the kit.`); }
      if (G.active().some((a) => has(a, "scavenger"))) { for (const a of G.active()) { const p = a.pools.health; p.cur = Math.min(p.max, p.cur + 2); } await G.api.narrate("<small>Scavenger: and a little food besides. (+2 Health, all)</small>"); }
      G.refreshParty();
    });
  };

  /* ---------------------------------------------------------------- the map */
  const gotos = (o, out = new Set()) => { if (Array.isArray(o)) o.forEach((x) => gotos(x, out)); else if (o && typeof o === "object") { if (typeof o.goto === "string") out.add(o.goto); for (const v of Object.values(o)) if (v && typeof v === "object") gotos(v, out); } return out; };
  FW.map = async () => {
    const src = (window.MODULE || {}).src; if (!src || !src.scenes) return U.toast("There is no map for this place.");
    const ids = Object.keys(src.scenes), seen = (G.state._seen = G.state._seen || {}); seen[here()] = 1;
    const edges = ids.map((id) => [id, [...gotos(src.scenes[id].options || [])].filter((t) => src.scenes[t])]);
    const depth = { [src.start]: 0 }, q = [src.start];
    while (q.length) { const c = q.shift(); for (const [id, ts] of edges) if (id === c) for (const t of ts) if (!(t in depth)) { depth[t] = depth[c] + 1; q.push(t); } }
    const cols = {}; for (const id of ids) (cols[depth[id] === undefined ? 9 : depth[id]] = cols[depth[id] === undefined ? 9 : depth[id]] || []).push(id);
    const box = el("div", { style: "display:flex;gap:18px;align-items:flex-start;overflow:auto;padding:6px" });
    for (const d of Object.keys(cols).sort((a, b) => a - b)) {
      box.append(el("div", { style: "display:flex;flex-direction:column;gap:8px;min-width:150px" }, ...cols[d].map((id) => {
        const s = src.scenes[id], isSeen = !!seen[id] || id === here(), reach = isSeen ? true : edges.some(([f, ts]) => seen[f] && ts.includes(id));
        return el("button", { class: "btn small" + (id === here() ? " primary" : ""), disabled: !isSeen && !reach, title: isSeen ? "Go there (costs time)" : "Not yet seen", onclick: () => { U.closeModal("go:" + id); } }, isSeen ? s.name : "? ? ?");
      })));
    }
    const r = await U.modal({ title: "The case so far", body: el("div", {}, el("p", { class: "small muted" }, "Places you have been, and the ones you know how to reach. Going somewhere takes time."), box), buttons: [{ id: "no", label: "Close" }] });
    if (typeof r === "string" && r.startsWith("go:") && r.slice(3) !== here()) { const to = r.slice(3); G.run(async () => { G.state._press = (G.state._press || 0) + 1; await G.goto(to); }); }
  };
  const mark = G.paintLight; G.paintLight = function () { try { (G.state._seen = G.state._seen || {})[here()] = 1; } catch (e) {} return mark.apply(this, arguments); };

  /* ---------------------------------------------------------------- a moment in character */
  FW.moment = async () => {
    const team = G.active(), who = team.length === 1 ? team[0].id : await U.choose("Whose moment?", team.map((a) => ({ id: a.id, label: a.short })));
    const a = team.find((x) => x.id === who); if (!a) return;
    const k = `mom:${a.id}:${here()}`; if (used()[k]) return U.toast(`${a.short} has already had their moment here.`);
    const c = await U.choose(`${a.short} takes a moment. How?`, [
      { id: "steady", label: "Steady yourself", hint: "+2 Sanity" }, { id: "say", label: "Say what you think, aloud", hint: "The team talks it through: a lead" },
      { id: "lighten", label: "Lighten the mood", hint: "+1 Stability, all" }, { id: "why", label: "Remember who you are doing this for", hint: "+1 Focus, +1 Stability" },
      { id: "own", label: "Say it in your own words…", hint: "Type a line, in character. It goes in the journal." }, { id: "x", label: "Never mind" }]);
    if (!c || c === "x") return;
    let line = "";
    if (c === "own") { line = await ADV.askText(`${a.short}, in character`, "What do they say, or think?"); if (!line) return; }
    used()[k] = true;
    const J = (G.state.journal = G.state.journal || []);
    const text = { steady: "Takes a breath, and counts. It helps.", say: "Says it aloud, and the others turn it over with them.", lighten: "Says something that is nearly a joke. Someone nearly laughs.", why: "Thinks, for a moment, of who is waiting at home.", own: line }[c];
    J.push({ who: a.name || a.short, where: (G.loc() || {}).name || "", text: c === "own" ? `“${line}”` : text });
    await G.run(async () => {
      if (c === "own") { U.print(`“${line.replace(/[<>&]/g, "")}”`, "said", { who: a }); await G.api.narrate(`${a.short} says it, and means it. It steadies the whole team. (+2 Stability, ${a.short})`); a.pools.stability.cur = Math.min(a.pools.stability.max, a.pools.stability.cur + 2); }
      else if (c === "steady") { a.pools.sanity.cur = Math.min(a.pools.sanity.max, a.pools.sanity.cur + 2); await G.api.narrate(`${a.short} takes a long breath, and counts to ten. (+2 Sanity)`); }
      else if (c === "lighten") { for (const x of team) x.pools.stability.cur = Math.min(x.pools.stability.max, x.pools.stability.cur + 1); await G.api.narrate(`${a.short} says something that is very nearly a joke. Someone very nearly laughs. (+1 Stability, all)`); }
      else if (c === "why") { a.pools.stability.cur = Math.min(a.pools.stability.max, a.pools.stability.cur + 1); if (window.FOCUS && FOCUS.on()) { const f = FOCUS.get(a); f.cur = Math.min(f.max, f.cur + 1); } await G.api.narrate(`${a.short} thinks, for a moment, of who is waiting. (+1 Focus, +1 Stability)`); }
      else if (c === "say") { await G.api.narrate(`${a.short} says it aloud, plainly, and the others turn it over with them.`); const left = G.visibleHotspots().filter((h) => h.src && !h.go); const h = left[Math.floor(Math.random() * left.length)]; if (h) await G.api.narrate(`Between you, it comes down to one thing: <b>${h.label}</b>.`); }
      G.refreshParty();
    });
  };

  /* ---------------------------------------------------------------- the menu */
  FW.menu = async () => {
    const o = [{ id: "item", label: "Use an item on something", hint: "The right tool makes it easier" }, { id: "skill", label: "Use what you know", hint: "Your Background gives you something to do" }, { id: "ask", label: "Ask around", hint: "Charisma, for a lead" }];
    if (RPGX.on("scavenge")) o.push({ id: "scav", label: "Scavenge", hint: "Spare lights and supplies. Takes time if it fails." });
    if (RPGX.on("map")) o.push({ id: "map", label: "Look at the map", hint: "Where you have been, and quick travel" });
    if (RPGX.on("moments")) o.push({ id: "moment", label: "Take a moment, in character", hint: "Steady yourself, speak, or say it your own way" });
    o.push({ id: "stock", label: "Take stock", hint: "What you have, and what is open" }, { id: "x", label: "Never mind" });
    const c = await U.choose("Field work", o);
    ({ item: FW.useItem, skill: FW.skill, ask: FW.ask, scav: FW.scavenge, map: FW.map, stock: FW.stock, moment: FW.moment }[c] || (() => {}))();
  };

  /* ---------------------------------------------------------------- loud ways have a price */
  const imp0 = G.improvise;
  G.improvise = async function () {
    const before = ADV.improv; const r = await imp0.apply(this, arguments);
    return r;
  };
  const useHot0 = G.useHotspot;
  G.useHotspot = function (h) {
    const im = window.ADV && ADV.improv;
    if (im && !im.priced) { im.priced = true; if (im.aspect === "strength") { G.state._press = (G.state._press || 0) + 2; G.state.noise = (G.state.noise || 0) + 1; im.note = (im.note || "") + " It is loud. (+2 time)"; } else if (im.aspect === "iq") { G.state._press = (G.state._press || 0) + 1; } else if (im.aspect === "charisma") { G.state.owed = (G.state.owed || 0) + 1; } }
    return useHot0.apply(this, arguments);
  };
  const run2 = G.run;
  G.run = async function (fn) {
    const r = await run2.apply(this, arguments);
    try {
      if (G.state && G.state.phase === "explore" && RPGX.on("events") && (G.state.noise || 0) >= 1 && !G.state._heard && !G.busy) {
        G.state._heard = true; G.busy = true; document.body.classList.add("busy");
        try {
          await G.api.narrate("<i>Someone has heard the noise. A door opens along the way, and a face looks out.</i>");
          const id = await U.choose("What do you do?", [{ id: "face", label: "Face them, and explain", hint: "Charisma · medium" }, { id: "slip", label: "Slip away", hint: "Agility · medium" }]);
          const rr = await G.check({ aspect: id === "face" ? "charisma" : "agility", cr: R.cr("medium"), label: id === "face" ? "Smooth it over" : "Slip away", who: "choose", tags: ["event", id === "face" ? "talk" : "sneak"] });
          if (rr.ok) await G.api.narrate(id === "face" ? "They are more curious than angry, and what they saw is worth hearing." : "By the time they look properly, there is nobody there."); else { await G.api.narrate("They saw enough. Word will get round. (-2 Stability)"); for (const a of G.active()) a.pools.stability.cur = Math.max(1, a.pools.stability.cur - 2); }
        } finally { G.busy = false; document.body.classList.remove("busy"); G.refreshParty(); G.showIdle(); }
      }
    } catch (e) { console.error(e); }
    return r;
  };

  /* ---------------------------------------------------------------- word gets around */
  const PHRASE = { res_fight: "by facing it head on", res_song: "by leading the line in song", res_truce: "by making a truce across the wire", res_noise: "with a gramophone and every voice in the ward", res_air: "by letting the night into a sealed ward", res_heal: "by easing the dying", res_record: "with a recording played backwards", res_speak: "by getting a whole room to speak", res_cut: "by cutting the wire", res_voice: "with a live voice on the air", res_choir: "by walking a choir into the tunnel", res_siren: "by sounding the all-clear early", res_wake: "by waking the sleepers one by one", res_lamps: "with forty signal lamps", res_ping: "with a depth charge and a recording", res_witness: "by hearing all of it", res_names: "by giving every name back", res_seal: "by sealing it in a room made for it", res_patch: "with a patch", res_deal: "with a deal", res_light: "with a word of light", res_flame: "with a ring of fire", res_settle: "by balancing the books", res_forgive: "by forgiveness" };
  if (window.CAMP) {
    const d0 = CAMP.debrief;
    CAMP.debrief = function (r) {
      try {
        const M = window.MODULE, fl = (G.state && G.state.flags) || {}, k = Object.keys(PHRASE).find((x) => fl[x]);
        if (M && M.id && CAMP.camp && CAMP.camp.world && k && !CAMP.playtest) { const w = CAMP.camp.world; w.news.unshift({ day: CAMP.camp.day, line: `${M.title}: it is said it was settled ${PHRASE[k]}.` }); w.news = w.news.slice(0, 14); }
      } catch (e) { console.warn(e); }
      return d0.apply(this, arguments);
    };
  }
})();
