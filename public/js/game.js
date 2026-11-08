/* Game core: state, saves, rolls, exploration, interviews, case file, endings. */
(function () {
  const M = window.MODULE;   // the adventure being played (swapped live by CAMP.loadAdventure)
  const U = window.UI;
  const el = U.el;
  const G = { state: null, busy: false, settings: { quick: false, labels: "auto", master: 0.9, music: 0.7, sfx: 0.9, cr: "module" } };
  const SAVE_KEY = "beyond.deathOfABloodline.v1";
  const SET_KEY = "beyond.settings.v1";

  /* ================================================================== state */
  const clone = (o) => JSON.parse(JSON.stringify(o));
  G.makeAgent = (def) => {
    const a = clone(def);
    a.pools = R.makePools(a.core);
    if (a.poolMax) for (const k of ["health", "sanity", "stability"]) a.pools[k] = { cur: a.poolMax[k], max: a.poolMax[k] };
    a.items = (a.items || []).map((it) => ({ ...it, uses: R.TIERS[it.tier].uses }));
    a.statuses = [];
    a.injuries = a._campId ? (a.injuries || []) : [];
    a.noticed = a._campId ? (a.noticed || 0) : 0;
    a.fateUsed = 0;
    a.dead = false;
    a.marked = null;
    a.lastStandUsed = false;
    a.dailyUsed = {};
    a.flareUsed = false;
    if (a.magic) {
      a.magic.max = R.wordPoolMax(a);
      a.magic.words = { ...(a.words || {}) };
    }
    return a;
  };
  G.newState = (party) => ({
    v: 2, loc: M.start, phase: "prep", flags: {}, clues: [], lore: [], obj: {}, items: [],
    agents: (party || M.agents).map(G.makeAgent),
    nomura: M.id === "death-of-a-bloodline" ? { joined: false, name: "Daisuke Nomura", short: "Nomura", portrait: "nomura", core: { body: 2, mind: 3, spirit: 1 },
      pools: { health: { cur: 20, max: 20 }, sanity: { cur: 15, max: 15 }, stability: { cur: 15, max: 15 } } } : { joined: false },
    interviews: {}, gmFate: 1 + 3 * (party || M.agents).filter((x) => (x.injuries || []).some((i) => i.id === "prophetic")).length, tried: {}, ending: null, log: [], hintAt: -1
  });
  G.saveKey = SAVE_KEY;
  G.save = () => {
    if (!G.state || G.state.phase !== "explore") return;
    try { localStorage.setItem(G.saveKey, JSON.stringify({ adv: M.id, state: G.state })); } catch (e) {}
  };
  G.loadSave = () => { try { const s = localStorage.getItem(G.saveKey); return s ? JSON.parse(s) : null; } catch (e) { return null; } };
  G.clearSave = () => { try { localStorage.removeItem(G.saveKey); } catch (e) {} };
  G.saveSettings = () => { try { localStorage.setItem(SET_KEY, JSON.stringify(G.settings)); } catch (e) {} };
  G.loadSettings = () => {
    try { const s = JSON.parse(localStorage.getItem(SET_KEY) || "null"); if (s) Object.assign(G.settings, s); } catch (e) {}
    AudioMan.vol = { master: G.settings.master, music: G.settings.music, sfx: G.settings.sfx };
    R.CR_SCALE = G.settings.cr || "module";
  };

  G.agents = () => G.state.agents;
  G.active = () => G.state.agents.filter((a) => !a.dead && !a.out);
  G.agentById = (id) => G.state.agents.find((a) => a.id === id);
  G.partyGlow = () => G.active().some((a) => a.traits && a.traits.torchBearer);

  /* ================================================================== rolls
     roll({ agent, label, aspect, target, targetLabel, mods:[{label,value}], tags, crShift, kind }) */
  G.itemsFor = (agent, aspect, tags = []) => (agent.items || []).filter((it) => {
    const d = it.def || M.items[it.id];
    if (!d || it.uses <= 0) return false;
    const fits = d.applies.some((ap) => ap === "aspect:" + aspect || tags.some((t) => ap === "tag:" + t));
    it._maybe = !fits;
    return fits || !!d.custom;
  });
  G.checkMods = (agent, opts, ctx = {}) => {
    const mods = [];
    const val = R.aspect(agent, opts.aspect);
    mods.push({ label: R.ASPECT_LABEL[opts.aspect] || opts.aspect, value: val, base: true });
    if (opts.aspect === "iq" && agent.traits && agent.traits.autoIQ) mods.push({ label: "The Never Speak's Collection", value: 50 });
    const lighting = ctx.lighting || (G.loc() && G.loc().lighting) || "normal";
    const glow = ctx.glow !== undefined ? ctx.glow : G.partyGlow();
    if (lighting === "shadow" && agent.vision !== "dark") {
      if (glow) mods.push({ label: "Shadow, lit by a lantern", value: 0, note: true });
      else mods.push({ label: "Shadow", value: -R.SHADOW_PENALTY });
    }
    if ((agent.injuries || []).some((i) => i.blind)) mods.push({ label: "Blind (Maimed)", value: -R.BLIND_PENALTY });
    if (R.fx(agent, "dependent") && G.active().length < 2) mods.push({ label: "Alone (Dependent)", value: -2 });
    if (R.has(agent, "blind")) mods.push({ label: "Blind", value: -R.BLIND_PENALTY });
    if ((lighting === "bright" && !(agent.traits && agent.traits.sunSight)) || (lighting === "dark" && agent.vision !== "dark")) mods.push({ label: lighting === "bright" ? "Too bright: Blind" : "Too dark: Blind", value: -R.BLIND_PENALTY });
    if ((lighting === "blinding" && !(agent.traits && agent.traits.sunSight)) || (lighting === "pitch" && agent.vision !== "dark")) mods.push({ label: lighting === "blinding" ? "Blinding light" : "Pitch black", value: -R.BLIND_PENALTY, });
    if (opts.aspect === "charisma" && agent.prop && agent.prop.decorated && ((G.loc() && G.loc().theme) || "") === "interior") mods.push({ label: "Well Decorated", value: 2 });
    const sev = ctx.severity !== undefined ? ctx.severity : ((G.loc() && G.loc().severity) || 0);
    if (R.weatherMod(sev)) mods.push({ label: `Weather ${sev}`, value: R.weatherMod(sev) });
    if (window.GEAR) for (const m of window.GEAR.rollMods(agent)) mods.push(m);
    if (window.GEAR && window.GEAR.a(agent, "Discreet") && (opts.tags || []).includes("hide")) mods.push({ label: "Discreet", value: 1 });
    for (const m of ctx.extra || []) mods.push(m);
    if (opts.situational) mods.push({ label: opts.situationalLabel || "Situational bonus", value: opts.situational });
    let cr = opts.cr;
    if (opts.investigate && agent.traits && agent.traits.detective) { cr -= 1; mods.push({ label: "Detective: CR −1", value: 0, note: true }); }
    return { mods, cr };
  };
  G.chance = (bonus, need) => {
    let n = 0;
    for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (R.meets(a + b + bonus, need)) n++;
    return Math.round((n / 36) * 100);
  };
  const sumMods = (mods) => mods.reduce((s, m) => s + (m.value || 0), 0);

  /* The dice modal. Resolves { ok, crit, fumble, total, dice, agent }. */
  G.rollModal = (o) => new Promise((resolve) => {
    const agent = o.agent;
    let items = (o.items || []).map((it) => ({ it, on: false }));
    const body = el("div", { class: "roll" });
    const head = el("div", { class: "roll-who" },
      el("span", { class: "chip big", style: { backgroundImage: `url(${U.img(agent.portrait, "portraits")})` } }),
      el("div", {}, el("b", {}, agent.short || agent.name), el("div", { class: "sub" }, o.sub || "")));
    const list = el("ul", { class: "mods" });
    const itemsBox = el("div", { class: "items-pick" });
    const tgt = el("div", { class: "target" });
    const diceRow = el("div", { class: "dice-row" });
    const d1 = U.die(1, "blank"), d2 = U.die(1, "blank");
    diceRow.append(d1, d2);
    const result = el("div", { class: "result", "aria-live": "polite" });
    body.append(head, list, itemsBox, tgt, diceRow, result);
    const bonusNow = () => sumMods(o.mods) + items.filter((x) => x.on).reduce((s, x) => s + R.TIERS[x.it.tier].bonus, 0);
    const draw = () => {
      list.innerHTML = "";
      list.append(el("li", {}, el("span", {}, "2d6"), el("b", {}, "")));
      for (const m of o.mods) list.append(el("li", { class: m.note ? "note" : "" }, el("span", {}, m.label), el("b", {}, m.note ? "" : (m.value >= 0 ? "+" : "−") + Math.abs(m.value))));
      itemsBox.innerHTML = "";
      for (const x of items) {
        const d = x.it.def || M.items[x.it.id];
        const tier = R.TIERS[x.it.tier];
        itemsBox.append(el("button", { class: "item-toggle" + (x.on ? " on" : "") + (x.it._maybe ? " maybe" : ""), title: (x.it._maybe ? "Only if the GM agrees it fits this roll. " : "") + (d.text || ""), "aria-pressed": x.on ? "true" : "false", disabled: rolled,
          onclick: () => { x.on = !x.on; U.click(); draw(); } },
          el("img", { src: U.img(d.icon, "items"), alt: "" }), el("span", {}, `${d.name} +${tier.bonus}${x.it._maybe ? " ?" : ""}`), el("small", {}, `${x.it.uses} left`)));
      }
      const need = o.target - bonusNow();
      tgt.innerHTML = "";
      tgt.append(el("span", {}, o.targetLabel), el("span", { class: "need" }, need <= 2 ? "automatic" : need > 12 ? "needs a miracle" : `need ${need}+ on the dice · ${G.chance(bonusNow(), o.target)}%`));
    };
    let rolled = false, outcome = null;
    const finish = (dice, viaFate) => {
      const total = dice[0] + dice[1] + bonusNow();
      const nat = dice[0] + dice[1];
      const crit = nat === 12;
      const fumble = nat === 2 && o.kind === "attack";
      const ok = !fumble && R.meets(total, o.target);
      outcome = { ok, crit, fumble, total, dice, agent, nat };
      result.innerHTML = "";
      result.append(el("div", { class: "total" }, String(total)),
        el("div", { class: "verdict " + (ok ? (crit ? "crit" : "ok") : "fail") },
          ok ? (crit ? "Critical" : "Success") : (fumble ? "Fumble" : "Failure"),
          el("span", { class: "jp" }, ok ? (crit ? "会心" : "成功") : "失敗")));
      if (viaFate) result.append(el("div", { class: "fate-note" }, "Fate Point spent"));
      AudioMan.sfx(ok ? (crit ? "roll_crit" : "roll_success") : (fumble ? "roll_fumble" : "roll_fail"));
      actions();
    };
    const actions = () => {
      bar.innerHTML = "";
      if (!rolled) {
        bar.append(el("button", { class: "btn primary", id: "btn-roll", onclick: doRoll }, "Roll 2d6"));
        return;
      }
      const fateLeft = agent.fate || 0;
      if (fateLeft > 0 && o.allowFate !== false && !outcome.crit) {
        const extra = (agent.fateUsed || 0) >= 1 ? " (+1 Noticed)" : "";
        const spend = (dice, why) => {
          agent.fate -= 1; agent.fateUsed = (agent.fateUsed || 0) + 1;
          if (agent.fateUsed > 1) { R.addNoticed(agent, 1); U.toast(`${agent.short} is <b>Noticed</b> by the Beyond.`, "bad"); }
          AudioMan.sfx("fate"); U.setDie(d1, dice[0]); U.setDie(d2, dice[1]); finish(dice, true); G.refreshParty && G.refreshParty();
        };
        if (!outcome.ok) {
          /* Fate Point: the roll becomes the result the player wants. The lowest roll that still passes, or a Critical. */
          let pass = null;
          for (let t = 3; t <= 11 && !pass; t++) if (R.meets(t + bonusNow(), o.target)) pass = [Math.min(6, t - 1), t - Math.min(6, t - 1)];
          if (pass) bar.append(el("button", { class: "btn fate", onclick: () => spend(pass) }, `Fate: make it a success${extra}`));
        }
        bar.append(el("button", { class: "btn fate", onclick: () => spend([6, 6]) }, `Fate: make it a Critical${extra}`));
      }
      bar.append(el("button", { class: "btn primary", id: "btn-roll-done", onclick: () => { U.click(); close(); } }, "Continue"));
      bar.querySelector(".btn.primary").focus({ preventScroll: true });
    };
    const doRoll = async () => {
      if (rolled) return;
      rolled = true;
      for (const x of items) if (x.on) x.it.uses -= 1;
      draw();
      bar.innerHTML = "";
      const dice = o.forceDice || R.roll2d6();
      await U.tumble([d1, d2], dice);
      finish(dice, false);
    };
    const bar = el("div", { class: "modal-actions" });
    const m = el("div", { class: "modal roll-modal", role: "dialog", "aria-modal": "true", "aria-label": o.label },
      el("div", { class: "modal-head" }, el("h2", {}, o.label), el("span", { class: "jp" }, "判定")),
      el("div", { class: "modal-body" }, body), bar);
    const ov = U.$("#overlay");
    ov.hidden = false; ov.innerHTML = ""; ov.append(m); ov.onclick = null;
    function close() { ov.innerHTML = ""; ov.hidden = true; resolve(outcome); }
    draw();
    actions();
    if (G.settings.quick && !items.length) doRoll();
  });

  /* Pick an agent, then roll. opts: aspect, cr, label, investigate, tags, who, situational */
  G.check = async (opts) => {
    const pool = G.active();
    if (!pool.length) return { ok: false };
    let agent = null;
    if (opts.who && opts.who !== "choose" && opts.who !== "best") agent = G.agentById(opts.who);
    const scored = pool.map((a) => { const { mods, cr } = G.checkMods(a, opts); return { a, bonus: sumMods(mods), cr }; });
    const tried = opts.tryKey ? (G.state.tried[opts.tryKey] || []) : [];
    if (!agent && opts.who === "best") agent = scored.sort((x, y) => (y.bonus - y.cr) - (x.bonus - x.cr))[0].a;
    if (!agent) {
      const options = scored.map(({ a, bonus, cr }) => ({ id: a.id, label: `${a.short} · ${R.ASPECT_LABEL[opts.aspect]} ${bonus >= 0 ? "+" : ""}${bonus}`,
        hint: tried.includes(a.id) ? "already tried" : `${G.chance(bonus, cr)}% vs CR ${cr}`, disabled: tried.includes(a.id) }));
      if (options.every((x) => x.disabled)) return { ok: false, exhausted: true };
      U.choicesBox().dataset.kind = "who";   // live tables: players step up with their own agent
      const id = await U.choose(`<span class="checkcall">${opts.label}</span> · ${R.ASPECT_LABEL[opts.aspect]} vs CR ${opts.cr} (${R.crName(opts.cr)}). Who tries?`, options);
      delete U.choicesBox().dataset.kind;
      agent = G.agentById(id);
    }
    if (opts.tryKey) { G.state.tried[opts.tryKey] = [...tried, agent.id]; }
    const { mods, cr } = G.checkMods(agent, opts);
    const r = await G.rollModal({ agent, label: opts.label, sub: `${R.ASPECT_LABEL[opts.aspect]} check`, mods, target: cr,
      targetLabel: `CR ${cr} · ${R.crName(opts.cr)}`, items: G.itemsFor(agent, opts.aspect, opts.tags || []), kind: "check" });
    G.refreshParty();
    return r;
  };

  /* Everyone rolls (sneaking, Familiar Faces, Shifting Walls). Returns [{agent, ok, total}] */
  G.groupCheck = (opts) => new Promise((resolve) => {
    const agents = opts.agents || G.active();
    const rows = agents.map((a) => {
      const { mods, cr } = G.checkMods(a, opts, opts.ctx ? opts.ctx(a) : {});
      return { a, mods, cr, items: G.itemsFor(a, opts.aspect, opts.tags || []).map((it) => ({ it, on: false })), res: null };
    });
    const body = el("div", { class: "group-roll" });
    if (opts.intro) body.append(el("p", { class: "intro" }, opts.intro));
    const bar = el("div", { class: "modal-actions" });
    let rolled = false;
    const bonusOf = (r) => sumMods(r.mods) + r.items.filter((x) => x.on).reduce((s, x) => s + R.TIERS[x.it.tier].bonus, 0);
    const draw = () => {
      body.querySelectorAll(".grow").forEach((n) => n.remove());
      for (const r of rows) {
        const b = bonusOf(r);
        const row = el("div", { class: "grow" + (r.res ? (r.res.ok ? " ok" : " fail") : ""), "data-owner": r.a.ownerUid || "host" },
          el("span", { class: "chip", style: { backgroundImage: `url(${U.img(r.a.portrait, "portraits")})` } }),
          el("div", { class: "who" }, el("b", {}, r.a.short), el("small", {}, `${R.ASPECT_LABEL[opts.aspect]} ${b >= 0 ? "+" : ""}${b} vs ${r.cr}` + (r.mods.filter((m) => !m.base && m.value).map((m) => ` · ${m.label} ${m.value > 0 ? "+" : ""}${m.value}`).join("")))),
          el("div", { class: "gdice" }, r.res ? [U.die(r.res.dice[0]), U.die(r.res.dice[1]), el("b", {}, String(r.res.total))] : r.items.map((x) => el("button", {
            class: "item-toggle mini" + (x.on ? " on" : ""), "aria-pressed": x.on ? "true" : "false", onclick: () => { x.on = !x.on; U.click(); draw(); } },
            el("img", { src: U.img((x.it.def || M.items[x.it.id]).icon, "items"), alt: "" }), el("span", {}, `+${R.TIERS[x.it.tier].bonus}`)))),
          r.res && !r.res.ok && r.a.fate > 0 ? el("button", { class: "btn fate small", onclick: () => {
            r.a.fate -= 1; r.a.fateUsed = (r.a.fateUsed || 0) + 1;
            if (r.a.fateUsed > 1) R.addNoticed(r.a, 1);
            AudioMan.sfx("fate"); r.res = { ok: true, dice: [6, 6], total: 12 + bonusOf(r), fate: true }; draw(); G.refreshParty();
          } }, "Fate") : r.res ? el("span", { class: "tag " + (r.res.ok ? "ok" : "fail") }, r.res.ok ? U.jpOr("成功", "Success") : U.jpOr("失敗", "Failure")) : null);
        body.append(row);
      }
      bar.innerHTML = "";
      if (!rolled) bar.append(el("button", { class: "btn primary", onclick: rollAll }, "Roll for everyone"));
      else bar.append(el("button", { class: "btn primary", onclick: () => { U.click(); close(); } }, "Continue"));
      const f = bar.querySelector(".btn"); if (f) f.focus({ preventScroll: true });
    };
    const rollAll = async () => {
      rolled = true;
      AudioMan.sfx("dice_roll");
      for (const r of rows) {
        for (const x of r.items) if (x.on) x.it.uses -= 1;
        const dice = R.roll2d6();
        const total = dice[0] + dice[1] + bonusOf(r);
        r.res = { dice, total, ok: R.meets(total, r.cr) };
      }
      await U.sleep(U.reduced() ? 0 : 450);
      draw();
      AudioMan.sfx(rows.every((r) => r.res.ok) ? "roll_success" : "roll_fail");
    };
    const m = el("div", { class: "modal roll-modal", role: "dialog", "aria-modal": "true", "aria-label": opts.label },
      el("div", { class: "modal-head" }, el("h2", {}, opts.label), el("span", { class: "jp" }, "判定")), el("div", { class: "modal-body" }, body), bar);
    const ov = U.$("#overlay");
    ov.hidden = false; ov.innerHTML = ""; ov.append(m); ov.onclick = null;
    function close() { ov.innerHTML = ""; ov.hidden = true; G.refreshParty(); resolve(rows.map((r) => ({ agent: r.a, ok: r.res.ok, total: r.res.total }))); }
    draw();
  });

  /* ================================================================== script API */
  const api = {};
  G.api = api;
  Object.defineProperty(api, "party", { get: () => ({ agents: G.state.agents, nomuraJoined: G.state.nomura.joined }) });
  api.flag = (k) => G.state.flags[k];
  api.set = (k, v = true) => { G.state.flags[k] = v; };
  api.has = (c) => G.state.clues.includes(c);
  api.knows = (l) => G.state.lore.includes(l);
  api.done = (o) => G.state.obj[o] === "done";
  api.sfx = (k) => AudioMan.sfx(k);
  api.shake = () => U.shake();
  api.flicker = () => { U.flicker(); AudioMan.sfx("replica_flicker", { volume: 0.4 }); };
  api.narrate = async (t) => { U.print(t, "narr"); await U.waitContinue(); };
  api.aloud = async (t) => { U.print(`<span class="readmark" aria-hidden="true">${U.jpOr("読", "»")}</span>${t}`, "aloud"); await U.waitContinue(); };
  api.say = async (t, o = {}) => {
    const who = o.who ? (M.npcs[o.who] || G.agentById(o.who)) : null;
    U.print(`“${t}”`, "said", { who });
    await U.waitContinue();
  };
  api.sayAll = async (lines) => { for (const l of lines) await api.narrate(l); };
  api.choose = (p, opts) => U.choose(p, opts);
  api.check = (o) => G.check(o);
  api.clue = (id) => {
    if (G.state.clues.includes(id)) return false;
    G.state.clues.push(id);
    const c = M.clues[id];
    AudioMan.sfx("clue");
    U.toast(`<span class="tk">${U.jpOr("手掛かり", "Clue")}</span> Clue added: <b>${c.t}</b>`, "clue");
    G.badge();
    return true;
  };
  api.learn = async (id) => {
    if (G.state.lore.includes(id)) return;
    G.state.lore.push(id);
    AudioMan.sfx("page_turn");
    await G.document(M.lore[id].t, M.lore[id].x);
    G.badge();
  };
  api.offerExtraLore = async () => {
    if (api.knows("extra") || api.flag("extraTried")) return;
    const c = await U.choose("The history is coming back. Someone might remember the folklore attached to the place.", [
      { id: "try", label: "Try to recall the folklore (Ancient, Medium)" }, { id: "no", label: "Leave it" }]);
    if (c !== "try") return;
    api.set("extraTried");
    const r = await G.check({ aspect: "ancient", cr: R.cr("medium"), label: "Recall the folklore", tags: ["lore"], who: "choose" });
    if (r.ok) await api.learn("extra");
    else await api.narrate("There was a story about the founder and his students, but it won't come.");
  };
  api.complete = async (id) => {
    if (G.state.obj[id] === "done") return;
    G.state.obj[id] = "done";
    const o = M.objectives.find((x) => x.id === id);
    AudioMan.sfx("objective");
    await G.stamp(o);
    G.badge();
  };
  api.addItem = (id) => { if (!G.state.items.includes(id)) G.state.items.push(id); };
  api.goto = async (id) => G.goto(id);
  api.interview = (n) => G.interview(n);
  api.interviewDone = (n) => { const iv = G.state.interviews[n]; return !!(iv && iv.closed); };
  api.asked = (n, q) => { const iv = G.state.interviews[n]; return !!(iv && iv.asked.includes(q)); };
  api.talkNomura = () => G.talkNomura();
  api.checkObjectives = () => G.checkObjectives();
  api.basementDoor = () => G.basementDoor();
  api.searchCrack = () => G.searchCrack();
  api.searchJournal = () => G.searchJournal();
  api.encounter = (id) => G.encounter(id);
  api.boss = () => G.boss();

  /* ================================================================== exploration */
  G.loc = () => M.locations[G.state && G.state.loc];
  G.goto = async (id) => {
    G.state.loc = id;
    AudioMan.sfx("footsteps", { volume: 0.6 });
    G.renderLocation();
    const loc = G.loc();
    if (loc.enter) await loc.enter(api);
  };

  G.renderLocation = () => {
    const loc = G.loc();
    const scene = U.$("#scene");
    scene.classList.toggle("paper", !!loc.paper);
    scene.classList.remove("combat");
    U.$("#board").hidden = true;
    const bg = U.$("#bg");
    const src = U.img(loc.scene);
    if (bg.getAttribute("src") !== src) { bg.src = src; }
    scene.style.setProperty("--scene-url", `url("${new URL(src, location.href).href}")`);
    bg.alt = loc.name;
    U.$("#loc-name").textContent = loc.name;
    U.$("#loc-jp").textContent = loc.jp || "";
    const light = loc.lighting === "shadow" ? (G.partyGlow() ? "Shadow · lantern: Glow" : "Shadow −2") : "Lit";
    U.$("#loc-light").textContent = light;
    U.$("#loc-light").dataset.l = loc.lighting;
    AudioMan.music(loc.music);
    AudioMan.ambience(loc.ambience || null);
    U.particles(loc.particles || (loc.paper ? "lilies" : "none"));
    G.renderHotspots();
    G.renderCast();
    G.refreshParty();
  };

  G.visibleHotspots = () => (G.loc().hotspots || []).filter((h) => !h.if || h.if(api));
  G.renderHotspots = () => {
    const box = U.$("#hotspots");
    box.innerHTML = "";
    const loc = G.loc();
    const lay = (window.LAYOUT || {})[loc.scene] || {};
    for (const h of G.visibleHotspots()) {
      const r = lay[h.id];
      if (!r) continue;
      const b = el("button", { class: "hot" + (h.go ? " exit" : ""), "data-id": h.id, "aria-label": h.label, disabled: G.busy,
        style: { left: r.x + "%", top: r.y + "%", width: r.w + "%", height: r.h + "%" },
        onclick: () => G.useHotspot(h) }, el("span", { class: "mark" }), el("span", { class: "tag" }, h.label));
      box.append(b);
    }
    box.dataset.labels = G.settings.labels;
  };
  G.renderCast = (override) => {
    const box = U.$("#cast");
    box.innerHTML = "";
    const loc = G.loc();
    const ids = override || (loc.cast ? loc.cast(api) : []);
    box.classList.toggle("solo", !!override);
    for (const id of ids) {
      const n = M.npcs[id];
      box.append(el("figure", { class: "castmember", "data-id": id },
        el("img", { src: U.img(n.portrait, "portraits"), alt: n.name }), el("figcaption", {}, n.name)));
    }
  };

  G.useHotspot = (h) => {
    if (G.busy) return;
    U.click();
    G.run(async () => {
      if (h.go) await G.goto(h.go);
      else if (h.run) await h.run(api);
    });
  };

  G.run = async (fn) => {
    if (G.busy) return;
    G.busy = true;
    document.body.classList.add("busy");
    U.$("#hotspots").querySelectorAll(".hot").forEach((b) => (b.disabled = true));
    try { await fn(); } catch (e) { console.error(e); U.print("Something went wrong in this scene: " + e.message, "narr error"); }
    G.busy = false;
    document.body.classList.remove("busy");
    if (G.state.phase !== "explore") return;
    await G.checkObjectives();
    G.save();
    G.renderHotspots();
    G.renderCast();
    G.refreshParty();
    G.showIdle();
  };

  G.showIdle = () => {
    const box = U.choicesBox();
    box.innerHTML = "";
    const loc = G.loc();
    const opts = [];
    for (const h of G.visibleHotspots()) opts.push({ label: h.label, exit: !!h.go, fn: () => G.useHotspot(h) });
    for (const a of loc.actions || []) if (!a.if || a.if(api)) opts.push({ label: a.label, fn: () => { U.click(); G.run(() => a.run(api)); } });
    box.append(el("div", { class: "idle-label" }, "What do you do?"));
    const wrap = el("div", { class: "idle-grid" });
    for (const o of opts) wrap.append(el("button", { class: "btn choice idle" + (o.exit ? " exit" : ""), onclick: o.fn }, el("span", { class: "lbl" }, o.label)));
    box.append(wrap);
  };

  /* ================================================================== interviews */
  G.interview = async (npcId) => {
    const iv = M.interviews[npcId];
    const npc = M.npcs[npcId];
    const st = (G.state.interviews[npcId] = G.state.interviews[npcId] || { limit: null, used: 0, asked: [], closed: false });
    const prevScene = U.$("#bg").getAttribute("src");
    const back = U.img(npcId === "kaede" ? "station" : "doorway");
    U.$("#bg").src = back;
    U.$("#hotspots").innerHTML = "";
    G.renderCast([npcId]);
    if (npcId !== "kaede") AudioMan.sfx("door_knock");
    if (st.closed) {
      await api.narrate(`${npc.name} has said all they're going to say tonight.`);
    } else {
      if (st.limit === null) {
        await api.narrate(`<b>${npc.name}</b>, ${npc.tag}. ${npc.look}`);
        await api.narrate(iv.opener);
        const r = await G.check({ aspect: "charisma", cr: R.cr("medium"), label: `Win ${npc.name.split(" ")[0]}'s trust`, investigate: true, who: "choose" });
        const shift = r.agent && r.agent.traits && r.agent.traits.detective ? 1 : 0;
        const t = r.total || 0;
        st.limit = t >= R.cr("challenging") - shift ? 99 : t >= R.cr("medium") - shift ? 5 : 2;
        st.lead = r.agent ? r.agent.id : null;
        await api.narrate(st.limit === 99 ? `${npc.name.split(" ")[0]} relaxes. They'll answer anything you ask.` :
          st.limit === 5 ? `${npc.name.split(" ")[0]} will give you a few minutes. (5 questions)` : `${npc.name.split(" ")[0]} keeps one hand on the door. (2 questions)`);
      }
      while (true) {
        const left = st.limit - st.used;
        const qs = iv.questions.filter((q) => !st.asked.includes(q.id) && (!q.cond || q.cond(api)));
        if (left <= 0 || !qs.length) { st.closed = true; await api.narrate(iv.excuse); break; }
        const choice = await U.choose(`<span class="qleft">${st.limit >= 99 ? "Ask anything" : `${left} question${left > 1 ? "s" : ""} left`}</span>`,
          [...qs.map((q) => ({ id: q.id, label: q.q })), { id: "_bye", label: "Thank them and leave" }]);
        if (choice === "_bye") break;
        const q = iv.questions.find((x) => x.id === choice);
        st.asked.push(q.id);
        st.used += 1;
        for (const line of q.a) await api.say(line, { who: npcId });
        for (const c of q.clues) api.clue(c);
        await G.checkObjectives();
      }
    }
    G.renderCast();
    U.$("#bg").src = prevScene;
  };

  G.talkNomura = async () => {
    const asked = (G.state.flags.nomuraAsked = G.state.flags.nomuraAsked || []);
    if (!G.state.flags.nomuraIntroDone && G.state.loc === "apt2b_living") {
      G.state.flags.nomuraIntroDone = true;
      await api.narrate(`<b>Daisuke Nomura</b>, homicide, 49. ${M.npcs.nomura.look} He jots in a leather notebook with a stubby pencil, a 35mm camera around his neck.`);
    }
    while (true) {
      const opts = [];
      for (const t of M.nomuraTopics) opts.push({ id: t.id, label: t.q, hint: asked.includes(t.id) ? "asked" : null });
      for (const e of M.nomuraEvidence) if (api.has(e.need) && !asked.includes(e.id)) opts.push({ id: e.id, label: e.q, hint: "evidence" });
      if (!G.state.nomura.joined && G.state.loc === "apt2b_living") opts.push({ id: "_join", label: "Ask him to come with you" });
      opts.push({ id: "_bye", label: "That's all for now" });
      const c = await U.choose("Nomura flips to a clean page.", opts);
      if (c === "_bye") break;
      if (c === "_join") {
        G.state.nomura.joined = true;
        await api.say("Thought you'd never ask. I'll keep my head down and my revolver up.", { who: "nomura" });
        U.toast("<b>Daisuke Nomura</b> joins the investigation.", "clue");
        G.refreshParty();
        continue;
      }
      const t = M.nomuraTopics.find((x) => x.id === c) || M.nomuraEvidence.find((x) => x.id === c);
      if (!asked.includes(c)) asked.push(c);
      for (const line of t.a) await api.say(line, { who: "nomura" });
      for (const cl of t.clues || []) api.clue(cl);
      if (t.tape) await G.playTape();
      if (c === "ev_photo" && !api.has("c_folded_palm")) await api.narrate("A folded hand. The Folded Palm? Somebody in this building might know the name.");
    }
  };

  G.playTape = async () => {
    const c = await U.choose("He holds up a microcassette recorder.", [{ id: "play", label: "Ask him to play it back" }, { id: "no", label: "Maybe later" }]);
    if (c !== "play") return;
    AudioMan.sfx("tape_click");
    await U.sleep(400);
    AudioMan.sfx("tape_whisper");
    await api.narrate("Hiss. Then paper crumpling, slow and even. In. Out. The sound is faint but rhythmic.");
    if (api.has("c_tape_name")) return;
    const r = await G.check({ aspect: "awareness", cr: 9, label: "Listen under the hiss", investigate: true, tryKey: "tape", who: "choose" });
    if (r.ok) {
      await api.narrate("There's a second track under the first. A voice like static, whispering a name: <i>Yamada</i>.");
      api.clue("c_tape_name");
    } else if (!r.exhausted) await api.narrate("Just the paper, breathing.");
  };

  G.basementDoor = async () => {
    if (api.flag("basementOpen")) { AudioMan.sfx("door_creak"); return G.goto("basement"); }
    if (api.flag("lilyTrail")) {
      AudioMan.sfx("paper_crinkle");
      await api.narrate("The lilies slip under the steel door one after another. When you reach for the padlock it has become paper, folded into the shape of a padlock. It falls open in your hand.");
      api.set("basementOpen");
      AudioMan.sfx("door_creak");
      return G.goto("basement");
    }
    const c = await U.choose("A steel door marked B1, padlocked. \"Maintenance only.\"", [
      { id: "pick", label: "Pick the padlock (IQ, Medium)" }, { id: "force", label: "Force it (Strength, Challenging)" }, { id: "no", label: "Leave it" }]);
    if (c === "no") return;
    const r = c === "pick"
      ? await G.check({ aspect: "iq", cr: R.cr("medium"), label: "Pick the padlock", tags: ["lock"], tryKey: "lockpick", who: "choose" })
      : await G.check({ aspect: "strength", cr: R.cr("challenging"), label: "Force the basement door", tryKey: "force", who: "choose" });
    if (r.exhausted) return api.narrate("Everyone has had a go at it. Maybe something else in this building wants to show you the way down.");
    if (r.ok) { api.set("basementOpen"); AudioMan.sfx("door_creak"); await api.narrate("The lock gives."); return G.goto("basement"); }
    await api.narrate("The padlock holds.");
  };

  G.searchCrack = async () => {
    if (api.flag("crackFound")) return api.narrate("The seam runs through the tatami where the room was split and put back together. Lilies keep squeezing through it.");
    const tried = G.state.tried.crack || [];
    const hinted = api.flag("crackHint");
    if (tried.length >= G.active().length && !hinted) {
      api.set("crackHint");
      G.state.tried.crack = [];
      await api.narrate("Nomura's words come back: the blood splatter doesn't match where he fell. Like something in the room shifted after the fact. Look where the chalk outline doesn't line up. (+2 to search again)");
    }
    const r = await G.check({ aspect: "awareness", cr: R.cr("medium"), label: "Search the floor where Riku lay", investigate: true, tags: ["search"],
      tryKey: "crack", who: "choose", situational: api.flag("crackHint") ? R.SITUATIONAL : 0, situationalLabel: "Nomura's observation" });
    if (r.exhausted) return api.narrate("You've all looked. Talk it through, or ask Nomura what bothered him about this room.");
    if (!r.ok) return api.narrate("Tatami, blood, chalk. Nothing more, as far as you can see.");
    api.set("crackFound");
    api.set("lilyTrail");
    U.shake();
    await api.narrate("Part of the room doesn't quite line up. The blood on the floor shifts across a seam, as if the room had been split and put back together. Where the split runs there is a crack in the floorboards that leads below.");
    AudioMan.sfx("lily_chime");
    U.particles("lilies");
    await api.aloud(M.text.crack1);
    api.clue("c_crack");
    await api.narrate("If 2A is searched at the same spot, it might show where the crack goes.");
  };

  G.searchJournal = async () => {
    if (api.done("so3")) return api.narrate("The tear in the wall is open. Behind it, only more paper, folded back on itself forever.");
    const tried = G.state.tried.tear || [];
    if (tried.length >= G.active().length && !api.flag("tearHint")) {
      api.set("tearHint");
      G.state.tried.tear = [];
      await api.narrate("A draft moves the lilies on the desk, always toward the same wall. (+2 to search again)");
    }
    const r = await G.check({ aspect: "awareness", cr: R.cr("medium"), label: "Search the paper walls", investigate: true, tags: ["search"],
      tryKey: "tear", who: "choose", situational: api.flag("tearHint") ? R.SITUATIONAL : 0, situationalLabel: "The draft" });
    if (r.exhausted) return api.narrate("Nothing yet. The lilies on the desk keep stirring, though there's no wind.");
    if (!r.ok) return api.narrate("Paper, paper, paper. Every wall looks the same.");
    AudioMan.sfx("paper_tear");
    await api.narrate("A space in the paper wall has a tear within it. Peeling it back reveals a stitched notebook, its cover lettered 一番. The Journal of Ichiban.");
    api.clue("c_journal");
    api.addItem("journal");
    await api.complete("so3");
    await api.learn("journal");
    if (!api.knows("history")) await api.learn("history");
    await api.offerExtraLore();
    await api.narrate(api.done("so1") ? "With the Yamada family book and Ichiban's instructions, you could attempt the banishment rite when you face the spirit. Someone in its reach must perform it (Occult, Ancient or Faith, Medium)." :
      "The rite needs the Yamada name spoken from the family's own record. Riku's papers are somewhere in the real 2B.");
  };

  G.checkObjectives = async () => {
    if (M.id !== "death-of-a-bloodline") return;
    if (!api.done("po1") && api.has("c_shrine") && api.knows("history")) {
      await api.narrate("This is the memorial. The Folded Palm's shrine to the students who were taken, flattened in 1945 and buried under Yanagi-sō's concrete. Remade here, in paper.");
      await api.complete("po1");
    }
    if (!api.done("po2")) {
      const deduced = api.has("c_remembrance") && (api.has("c_memorial") || api.knows("history")) && (api.has("c_foundation") || api.has("c_dig"));
      if (api.knows("journal") || deduced) {
        if (!api.knows("journal")) await api.narrate("<b>Deduction.</b> Lilies are left for spirits who never came home. There was a memorial on this lot. They poured the building over its rubble and told the workers not to dig. The lilies used to be left at that memorial, until it was demolished. Now they're coming back on their own.");
        await api.complete("po2");
      }
    }
  };

  /* ================================================================== hints */
  G.hint = async () => {
    const known = G.state.clues.length + G.state.lore.length;
    if (G.state.hintAt === known) return U.modal({ title: "Think it over", body: "<p>You've already chewed on everything you know. Find something new first.</p>", buttons: [{ id: "ok", label: "OK" }] });
    G.state.hintAt = known;
    U.closeModal();
    G.run(async () => {
      const r = await G.check({ aspect: "iq", cr: R.cr("medium"), label: "Put the pieces together", investigate: true, who: "best" });
      if (!r.ok) return api.narrate("The pieces don't fit yet.");
      const f = G.state.flags;
      let h;
      if (!f.crackFound) h = "The blood in 2B doesn't match where Riku fell. Search the bedroom floor.";
      else if (!f.crack2a) h = "The crack in 2B runs down past Daigo's apartment in 2A. Ask to see his floor.";
      else if (!f.seen_basement) h = "The lilies are leading down. The basement door is on the ground floor.";
      else if (!api.done("so1")) h = "Riku was obsessed with his family records. They must be somewhere in 2B.";
      else if (!api.knows("history") && !f.seen_paper) h = "This building sits on something older. Ask the tenants who have been here longest, or the one who studies folklore.";
      else if (!f.seen_paper) h = "The paper house in the basement is big enough to crawl into.";
      else if (!api.done("so3")) h = "Someone lived in the paper study. Search its walls.";
      else h = "You have what you need. Upstairs, in the paper building, 2B is waiting.";
      await api.narrate(`<b>${r.agent.short}:</b> ${h}`);
    });
  };

  /* ================================================================== objective stamp + documents */
  G.stamp = (o) => new Promise((resolve) => {
    const box = el("div", { class: "stamp-pop", role: "status" },
      el("img", { src: U.img("seal_done", "ui"), alt: "" }),
      el("div", {}, el("small", {}, o.kind === "primary" ? "Primary objective complete" : "Secondary objective found"), el("b", {}, o.t), o.done ? el("p", {}, o.done) : null));
    document.body.append(box);
    setTimeout(() => { box.classList.add("out"); }, 2600);
    setTimeout(() => { box.remove(); resolve(); }, 3100);
  });
  G.document = (title, html) => U.modal({ title, jp: "記録", cls: "doc", body: `<div class="docpaper">${html}</div>`, buttons: [{ id: "ok", label: "Close", cls: "primary" }] });

  /* ================================================================== party strip */
  G.badge = () => {
    const n = G.state.clues.length;
    const b = U.$("#btn-case .count");
    if (b) b.textContent = n;
  };
  const bar = (p, k) => el("div", { class: "pool " + k, title: `${R.POOL_LABEL[k]} ${p.cur}/${p.max}` },
    el("span", { class: "k" }, R.POOL_KANJI[k]), el("span", { class: "track" }, el("span", { class: "fill", style: { width: Math.max(0, (p.cur / p.max) * 100) + "%" } })),
    el("span", { class: "n" }, String(Math.max(0, p.cur))));
  G.refreshParty = () => {
    const box = U.$("#party");
    if (!box || !G.state) return;
    box.innerHTML = "";
    const all = [...G.state.agents];
    for (const a of all) {
      const card = el("button", { class: "agent" + (a.dead ? " dead" : "") + (a.out ? " out" : "") + (a.marked ? " marked" : ""), "data-id": a.id,
        onclick: () => { U.click(); G.sheet(a); } },
        el("span", { class: "chip", style: { backgroundImage: `url(${U.img(a.portrait, "portraits")})` } }),
        el("div", { class: "meta" }, el("b", {}, a.short), el("span", { class: "fate", title: "Fate Points" }, "◆".repeat(Math.max(0, a.fate)) || "·"),
          ...["health", "sanity", "stability"].map((k) => bar(a.pools[k], k)),
          a.statuses && a.statuses.length ? el("div", { class: "st" }, a.statuses.map((s) => el("span", { class: "s " + s.id }, s.label || s.id))) : null));
      box.append(card);
    }
    if (G.state.nomura && G.state.nomura.joined) {
      const n = G.state.nomura;
      box.append(el("div", { class: "agent ally" + (n.dead ? " dead" : "") },
        el("span", { class: "chip", style: { backgroundImage: `url(${U.img("nomura", "portraits")})` } }),
        el("div", { class: "meta" }, el("b", {}, "Nomura"), el("span", { class: "fate" }, "ally"), bar(n.pools.health, "health"), bar(n.pools.sanity, "sanity"), bar(n.pools.stability, "stability"))));
    }
  };

  /* ================================================================== agent sheet */
  G.sheetBody = (a) => {
    const asp = (core) => el("div", { class: "aspects" }, el("h4", {}, `${core[0].toUpperCase() + core.slice(1)} ${a.core[core]}`),
      ...R.ASPECTS[core].map((k) => el("div", { class: "asp" + (a.special === k ? " special" : "") }, el("span", {}, R.ASPECT_LABEL[k]), el("b", {}, String(R.aspect(a, k))))));
    const items = el("div", { class: "kit" }, ...(a.items || []).map((it) => {
      const d = it.def || M.items[it.id]; const t = R.TIERS[it.tier];
      return el("div", { class: "kititem" }, el("img", { src: U.img(d.icon, "items"), alt: "" }), el("div", {}, el("b", {}, d.name), el("small", {}, `${t.name} · +${t.bonus} · ${it.uses}/${t.uses} uses · ${d.text}`)));
    }));
    return el("div", { class: "sheet" },
      el("div", { class: "sheet-top" }, el("img", { class: "portrait", src: U.img(a.portrait, "portraits"), alt: a.name }),
        el("div", {}, el("h3", {}, a.name), el("div", { class: "jp" }, a.jp || ""), el("p", { class: "role" }, `${a.role || ""} · age ${a.age} · Background: ${a.background}`),
          el("p", { class: "small" }, a.bgText || ""), el("p", { class: "bio" }, a.bio || ""))),
      el("div", { class: "pools-big" }, ...["health", "sanity", "stability"].map((k) => bar(a.pools[k], k))),
      el("div", { class: "defense" },
        ...[["ER", R.er(a)], ["BR", R.br(a)], ["MR", R.mr(a)], ["SR", R.sr(a)], ["Speed", R.initiative(a)], ["Fate", a.fate], ["Noticed", a.noticed || 0]]
          .map(([k, v]) => el("div", {}, el("small", {}, k), el("b", {}, String(v))))),
      el("div", { class: "asp-grid" }, asp("body"), asp("mind"), asp("spirit")),
      el("div", { class: "gear" },
        el("div", {}, el("h4", {}, "Weapon"), el("b", {}, a.weapon.name), el("p", { class: "small" }, `${a.weapon.type} +${a.weapon.bonus} · uses ${R.ASPECT_LABEL[a.weapon.aspect]} · ${(a.weapon.mods || []).join(", ")} · Specialty: ${a.weapon.specialty}`)),
        el("div", {}, el("h4", {}, "Armor"), el("b", {}, a.armor.name), el("p", { class: "small" }, `${a.armor.type} (+${a.armor.br} BR, +${a.armor.er} ER) · ${(a.armor.mods || []).join(", ")} · Specialty: ${a.armor.specialty}`))),
      a.magic ? el("div", { class: "words-own" }, el("h4", {}, `Words (${a.magic.source} magic · Potency ${R.potency(a)})`),
        el("p", { class: "small" }, Object.entries(a.magic.words).filter(([, n]) => n > 0).map(([w, n]) => `${w} ×${n}`).join(" · ") || "No words left today."),
        el("button", { class: "btn small", onclick: () => { const ov = U.$("#overlay"); ov.innerHTML = ""; ov.hidden = true; window.MAGIC.freeCast(a); } }, "Speak a string (outside a fight)")) : null,
      el("h4", {}, "Kit"), items,
      el("h4", {}, "Bonds"), el("div", { class: "bonds" }, ...a.bonds.map((b) => el("div", { class: "bond" + (b.value <= 0 ? " severed" : "") }, el("b", {}, b.name), el("small", {}, b.rel), el("span", { class: "v" }, b.value <= 0 ? "severed" : String(b.value))))),
      a.injuries.length ? el("div", {}, el("h4", {}, "Injuries"), ...a.injuries.map((i) => el("p", { class: "small" }, `${i.name}: ${i.text}${i.disorderName ? " (" + i.disorderName + ")" : ""}`))) : null);
  };
  G.sheet = (a) => { AudioMan.sfx("ui_open"); U.modal({ title: a.name, jp: a.jp, cls: "wide", body: G.sheetBody(a) }); };

  /* ================================================================== case file */
  G.caseFile = (tab = "obj") => {
    AudioMan.sfx("ui_open");
    const tabs = [["obj", "Objectives"], ["clues", "Clues"], ...(window.CORK && CORK.on() ? [["theory", "Theory"]] : []), ["lore", "Lore"], ["rules", "Rules"]];
    const body = el("div", { class: "casefile" });
    const nav = el("div", { class: "tabs", role: "tablist" });
    const pane = el("div", { class: "pane" });
    const show = (t) => {
      nav.querySelectorAll("button").forEach((b) => b.setAttribute("aria-selected", b.dataset.t === t ? "true" : "false"));
      pane.innerHTML = "";
      if (t === "obj") {
        for (const o of M.objectives) {
          const done = G.state.obj[o.id] === "done";
          if (o.kind === "secondary" && !done) continue;
          pane.append(el("div", { class: "obj" + (done ? " done" : "") }, el("img", { src: U.img(done ? "seal_done" : "seal_secret", "ui"), alt: "" }),
            el("div", {}, el("small", {}, o.kind === "primary" ? "Primary" : "Secondary"), el("b", {}, o.t), done && o.done ? el("p", {}, o.done) : null)));
        }
        const hidden = M.objectives.filter((o) => o.kind === "secondary" && G.state.obj[o.id] !== "done").length;
        if (hidden) pane.append(el("p", { class: "small muted" }, `${hidden} secondary objective${hidden > 1 ? "s" : ""} not yet discovered.`));
        if (M.id === "death-of-a-bloodline") pane.append(el("button", { class: "btn", onclick: () => G.hint() }, "Think it over (IQ, Medium)"));
      } else if (t === "clues") {
        if (!G.state.clues.length) pane.append(el("p", { class: "muted" }, "Nothing yet. Talk to people and search the places you visit."));
        for (const id of [...G.state.clues].reverse()) {
          const c = M.clues[id];
          const pk = window.PROPS ? PROPS.find(c.t + " " + (c.x || "").slice(0, 60)) : null;
          pane.append(el("div", { class: "clue" + (pk ? " withprop" : "") + (window.HANDOUT ? " opens" : ""), role: window.HANDOUT ? "button" : null, tabindex: window.HANDOUT ? "0" : null, title: window.HANDOUT ? "Read the document" : null,
            onclick: () => window.HANDOUT && HANDOUT.show(c, M), onkeydown: (e) => { if (e.key === "Enter" && window.HANDOUT) HANDOUT.show(c, M); } },
            pk ? el("img", { class: "clueprop", src: PROPS.src(pk), alt: "" }) : "", el("b", {}, c.t), el("small", {}, c.s), el("p", {}, c.x)));
        }
      } else if (t === "theory") {
        pane.append(window.CORK.pane(M, () => show("theory")));
      } else if (t === "lore") {
        if (!G.state.lore.length) pane.append(el("p", { class: "muted" }, "No history recovered yet."));
        for (const id of G.state.lore) pane.append(el("details", { class: "lore" }, el("summary", {}, M.lore[id].t), el("div", { class: "docpaper", html: M.lore[id].x })));
      } else {
        pane.innerHTML = G.rulesHTML();
      }
    };
    for (const [id, lbl] of tabs) nav.append(el("button", { role: "tab", "data-t": id, onclick: () => { U.click(); show(id); } }, lbl));
    body.append(nav, pane);
    show(tab);
    U.modal({ title: "Case File", jp: "捜査記録", cls: "wide", body });
  };

  G.rulesHTML = () => `
    <div class="rules">
      <p><b>Checks.</b> Roll 2d6, add an Aspect, and meet the Challenge Rating. This module uses Easy ${R.cr("easy")}, Medium ${R.cr("medium")}, Challenging ${R.cr("challenging")}, Dangerous ${R.cr("dangerous")}.</p>
      <p><b>Fate Points.</b> One per agent per mission. Spend one to turn the dice into a natural 12. Spending more than one in a mission adds Noticed.</p>
      <p><b>Healing Pools.</b> ${R.POOL_KANJI.health} Health (Body), ${R.POOL_KANJI.sanity} Sanity (Mind), ${R.POOL_KANJI.stability} Stability (Spirit). At 0 an agent takes an Injury (back to 10, but a Core Stat drops) or rolls the Death Die (7+ regains half of every pool; below 7 they are marked for death). A Core Stat at 0 is death.</p>
      <p><b>Bonds.</b> When Sanity damage would break an agent, a Bond can take it instead. Relationships wear down.</p>
      <p><b>Combat.</b> Two actions a turn, in Speed order (ties go to agents). Attack: 2d6 + Aspect + weapon vs the target's ER; damage is the attack total minus the matching Resistance. A natural 12 is a critical and triggers the weapon's Specialty; a natural 2 fumbles and invites a counter-attack.</p>
      <p><b>Zones.</b> Rooms are zones. Melee needs the same zone; pistols reach one zone. A zone where one side outnumbers the other two to one is controlled; leaving an enemy-held zone takes a Speed roll.</p>
      <p><b>Lighting.</b> In Shadow, agents with normal vision take −2. Torch Bearer armor lights its wearer's zone (Glow). Dark Vision ignores the penalty.</p>
      <p><b>Magic.</b> A caster strings up to Potency words. A word's strength is its position: Enemy, Damage, Element at positions 1-2-3 hits one enemy for 9 Stability (3×3) and sets it Burning (+2). Words come out of a daily pool.</p>
    </div>`;

  /* ================================================================== settings */
  G.settingsModal = () => {
    AudioMan.sfx("ui_open");
    const s = G.settings;
    const slider = (id, label, key) => el("label", { class: "set" }, el("span", {}, label),
      el("input", { type: "range", id, min: "0", max: "1", step: "0.05", value: String(s[key]), oninput: (e) => {
        s[key] = parseFloat(e.target.value); AudioMan.vol[key] = s[key]; AudioMan.applyVolumes(); G.saveSettings(); } }));
    const sel = (id, label, key, opts, after) => el("label", { class: "set" }, el("span", {}, label),
      el("select", { id, onchange: (e) => { s[key] = e.target.value; G.saveSettings(); after && after(); } },
        ...opts.map(([v, t]) => el("option", { value: v, selected: s[key] === v ? "selected" : null }, t))));
    const body = el("div", { class: "settings" },
      slider("set-master", "Master volume", "master"), slider("set-music", "Music", "music"), slider("set-sfx", "Sound effects", "sfx"),
      sel("set-labels", "Hotspot labels", "labels", [["auto", "Wide screens only"], ["always", "Always"], ["off", "Off"]], () => G.state && G.renderHotspots()),
      el("label", { class: "set check" }, el("input", { type: "checkbox", id: "set-quick", checked: s.quick ? "checked" : null, onchange: (e) => { s.quick = e.target.checked; G.saveSettings(); } }),
        el("span", {}, "Roll at once when there's nothing to choose")),
      sel("set-cr", "Challenge Ratings", "cr", [["module", "Module (7 / 10 / 14 / 18)"], ["rulebook", "Rulebook (5 / 8 / 12 / 16)"]], () => { R.CR_SCALE = s.cr; }),
      G.state && (G.state.phase === "explore") ? el("button", { class: "btn danger", onclick: () => G.confirmRestart() }, "Abandon the mission") : null,
      G.state && (G.state.phase === "explore") ? el("button", { class: "btn", onclick: () => { U.closeModal(); window.CAMP.suspend(); } }, "Save and return to HQ") : null);
    U.modal({ title: "Settings", jp: "設定", body });
  };
  G.powersModal = async () => {
    const act = G.active().filter((a) => window.MECH.powers(a).length);
    if (!act.length) return U.toast("No one here has a patron's gift or a usable artifact.");
    const who = act.length === 1 ? act[0].id : await U.choose("Whose power?", act.map((a) => ({ id: a.id, label: a.short })));
    const a = act.find((x) => x.id === who); if (!a) return;
    const list = window.MECH.powers(a);
    const id = await U.choose(`${a.short}'s gifts`, [...list.map((p) => ({ id: p.key, label: p.name, hint: `${p.kind === "auto" ? "automatic" : p.kind === "passive" ? "always on" : p.kind === "lost" ? "lost (two patrons)" : "ruled at the table"}${p.cost ? " · " + p.cost.n + " " + R.POOL_LABEL[p.cost.pool] : ""}` })), { id: "x", label: "Never mind" }]);
    const p = list.find((x) => x.key === id); if (p) { await window.MECH.use(a, p); G.refreshParty(); }
  };
  G.confirmRestart = async () => {
    const c = await U.modal({ title: "Abandon the mission?", body: "<p>The mission ends with no result. Nothing is gained or lost, but your progress in it is gone.</p>",
      buttons: [{ id: "no", label: "Keep playing" }, { id: "yes", label: "Abandon", cls: "danger" }] });
    if (c === "yes") { G.clearSave(); window.CAMP.abandon(); }
  };

  /* ================================================================== screens */
  G.show = (id) => {
    for (const s of document.querySelectorAll(".screen")) s.hidden = s.id !== id;
    document.body.dataset.screen = id;
  };

  G.title = () => {
    G.show("screen-title");
    U.$("#title-art").src = U.img("title");
    const save = G.loadSave();
    U.$("#btn-continue-save").hidden = !save;
  };

  G.begin = async (fromSave) => {
    await AudioMan.unlock();
    AudioMan.applyVolumes();
    AudioMan.preload(["ui_click", "dice_roll", "roll_success", "roll_fail", "clue", "footsteps"]);
    if (fromSave) {
      G.state = G.loadSave();
      G.enterGame();
      return;
    }
    G.state = G.newState();
    AudioMan.music("title");
    G.prep();
  };

  /* ---- prep: the dossier, loadout and words */
  G.prep = () => {
    G.show("screen-prep");
    const box = U.$("#prep-body");
    box.innerHTML = "";
    const brief = el("section", { class: "brief" },
      el("div", { class: "brief-head" }, el("img", { src: U.img("emblem", "ui"), alt: "Emperor's Heavenly Guard emblem" }),
        el("div", {}, el("small", {}, "Emperor's Heavenly Guard · Field Dossier 1976-114"), el("h2", {}, M.title), el("div", { class: "jp" }, M.jp))),
      el("p", {}, M.text.intro),
      el("h4", {}, "Primary objectives"),
      el("ol", {}, ...M.objectives.filter((o) => o.kind === "primary").map((o) => el("li", {}, o.t))),
      el("p", { class: "small muted" }, "Secondary objectives are not disclosed. Find them."));
    const team = el("section", { class: "team" }, el("h3", {}, "Your agents"));
    for (const a of G.state.agents) {
      const spent = a.items.reduce((s, it) => s + R.TIERS[it.tier].sp, 0);
      const card = el("article", { class: "dossier" },
        el("img", { class: "portrait", src: U.img(a.portrait, "portraits"), alt: a.name }),
        el("div", { class: "d-main" },
          el("div", { class: "d-name" }, el("b", {}, a.name), el("span", { class: "jp" }, a.jp)),
          el("div", { class: "small" }, `${a.role} · ${a.background} · ${a.age}`),
          el("div", { class: "pools-big" }, ...["health", "sanity", "stability"].map((k) => bar(a.pools[k], k))),
          el("p", { class: "bio" }, a.bio),
          el("div", { class: "loadout" }, el("div", { class: "lo-head" }, el("b", {}, "Spending Power"), el("span", { class: "sp" + (spent > 7 ? " over" : "") }, `${spent} / 7`)),
            ...Object.entries(M.items).map(([id, d]) => {
              const cur = a.items.find((x) => x.id === id);
              const tier = cur ? cur.tier : 0;
              return el("div", { class: "lo-item" + (tier ? " on" : "") },
                el("img", { src: U.img(d.icon, "items"), alt: "" }),
                el("div", { class: "lo-txt" }, el("b", {}, d.name), el("small", {}, d.text)),
                el("div", { class: "tiers", role: "group", "aria-label": `${d.name} quality` }, ...[0, 1, 2, 3].map((t) => el("button", {
                  class: "tier" + (t === tier ? " sel" : ""), "aria-pressed": t === tier ? "true" : "false",
                  title: t ? `${R.TIERS[t].name}: ${R.TIERS[t].sp} SP, +${R.TIERS[t].bonus}, ${R.TIERS[t].uses} use${t > 1 ? "s" : ""}` : "None",
                  onclick: () => {
                    U.click();
                    a.items = a.items.filter((x) => x.id !== id);
                    if (t) a.items.push({ id, tier: t, uses: R.TIERS[t].uses });
                    G.prep();
                  } }, t ? ["", "M", "Q", "A"][t] : "–"))));
            })),
          a.magic ? G.wordsEditor(a) : null));
      team.append(card);
    }
    const over = G.state.agents.some((a) => a.items.reduce((s, it) => s + R.TIERS[it.tier].sp, 0) > 7);
    box.append(brief, team);
    const go = U.$("#btn-start");
    go.disabled = over;
    go.textContent = over ? "Over budget: trim someone's kit" : "Begin the investigation";
  };

  G.wordsEditor = (a) => {
    const max = a.magic.max;
    const used = Object.values(a.magic.words).reduce((s, n) => s + n, 0);
    const words = Object.keys(R.WORDS);
    return el("div", { class: "words-editor" },
      el("div", { class: "lo-head" }, el("b", {}, "Today's Word Pool"), el("span", { class: "sp" + (used > max ? " over" : "") }, `${used} / ${max}`)),
      el("p", { class: "small" }, "Choose the words prepared at dawn. Each cast spends one of each word used."),
      el("div", { class: "wgrid" }, ...words.map((w) => el("div", { class: "wcell" }, el("span", { class: "w" }, w),
        el("button", { class: "icon-btn", "aria-label": `Fewer ${w}`, onclick: () => { a.magic.words[w] = Math.max(0, (a.magic.words[w] || 0) - 1); G.prep(); } }, "−"),
        el("b", {}, String(a.magic.words[w] || 0)),
        el("button", { class: "icon-btn", "aria-label": `More ${w}`, disabled: used >= max, onclick: () => { a.magic.words[w] = (a.magic.words[w] || 0) + 1; G.prep(); } }, "+")))));
  };

  G.startMission = () => {
    G.state.phase = "explore";
    G.enterGame(true);
  };

  G.enterGame = (fresh) => {
    G.show("screen-game");
    G.state.phase = "explore";
    U.story().innerHTML = "";
    G.badge();
    G.renderLocation();
    if (fresh) {
      G.busy = false; document.body.classList.remove("busy");   // a case left mid-sentence must not hold up the next one
      G.run(async () => { const loc = G.loc(); if (loc.enter) await loc.enter(api); });
    } else {
      U.print(`<i>Case resumed.</i> ${G.loc().name}.`, "narr");
      G.showIdle();
    }
  };

  /* ================================================================== encounters */
  G.encounter = async (id) => {
    if (api.flag(id + "_done")) return;
    const enc = M.encounters[id];
    await api.aloud(enc.intro);
    const c = await U.choose("The dolls haven't noticed you. Yet.", [
      { id: "sneak", label: "Sneak past them", hint: `everyone rolls Awareness vs ${enc.sneakCR}` },
      { id: "strike", label: "Strike first", hint: "they lose their first round" },
      { id: "approach", label: "Walk up to them" }]);
    if (c === "sneak") {
      const res = await G.groupCheck({ aspect: "awareness", cr: enc.sneakCR, label: "Sneak past the paper dolls", intro: "Every agent has to slip by unseen." });
      if (res.every((r) => r.ok)) {
        api.set(id + "_done");
        AudioMan.sfx("paper_crinkle", { volume: 0.5 });
        return api.narrate("You move between them like people avoiding strangers on a train. They keep folding, nodding, leaning. None of them turns.");
      }
      await api.narrate("A floorboard of paper creases under someone's foot. Every doll turns at once.");
    } else if (c === "approach") {
      await api.narrate("They flicker as you come close, and lunge for the nearest of you.");
    }
    const out = await window.COMBAT.start(id, { surprise: c === "strike" });
    if (out === "victory") { api.set(id + "_done"); await api.narrate("The last of the dolls slumps into a heap of creased paper. The hallway is quiet."); return; }
    if (out === "wiped") return G.ending("failed");
  };
  G.boss = async () => {
    const out = await window.COMBAT.start("boss", {});
    if (out === "banished") return G.ending("banish");
    if (out === "killed") return G.ending("kill");
    return G.ending("failed");
  };

  /* ================================================================== endings + debrief */
  G.ending = async (kind) => {
    G.state.ending = kind;
    G.state.phase = "ending";
    G.clearSave();
    G.show("screen-game");
    const scene = U.$("#scene");
    scene.classList.remove("combat");
    scene.classList.toggle("paper", false);
    U.$("#board").hidden = true;
    U.$("#hotspots").innerHTML = "";
    U.$("#cast").innerHTML = "";
    const art = { banish: "end_banish", kill: "end_kill", failed: "paper_2b" }[kind];
    U.$("#bg").src = U.img(art);
    U.$("#loc-name").textContent = kind === "failed" ? "Mission failed" : "Apartment 2B, Yanagi-sō";
    U.$("#loc-jp").textContent = kind === "failed" ? "任務失敗" : "夜明け";
    U.$("#loc-light").textContent = "";
    AudioMan.ambience(kind === "banish" ? null : "rain");
    AudioMan.music(kind === "banish" ? "ending_banish" : "ending_kill");
    U.particles(kind === "banish" ? "embers" : "lilies");
    if (kind === "banish") {
      G.state.obj.po3 = "done";
      G.state.po3 = "Banished. The spirits of the Folded Palm are at rest, and the lilies stop.";
      AudioMan.sfx("banish");
      await api.aloud(M.text.banish);
      AudioMan.sfx("lotus");
    } else if (kind === "kill") {
      G.state.obj.po3 = "done";
      G.state.po3 = "Destroyed through combat. The lilies persist.";
      AudioMan.sfx("ghost_die");
      await api.aloud(M.text.kill);
      await api.narrate("Outside, the paper lilies keep falling on Kanda.");
    } else {
      await api.aloud(M.text.failed);
    }
    G.debrief(kind);
  };

  G.debrief = (kind) => {
    const box = U.choicesBox();
    box.innerHTML = "";
    const prim = M.objectives.filter((o) => o.kind === "primary");
    const primDone = prim.filter((o) => G.state.obj[o.id] === "done").length;
    const solved = kind !== "failed" && primDone === prim.length;
    const lines = G.state.agents.map((a) => {
      let fate;
      if (a.dead) fate = `${a.short} did not come back. ${a.deathText || ""}`;
      else if (a.marked) fate = a.marked === "days" ? `${a.short} walked out of Yanagi-sō, and died ${2 + Math.floor(R.rand() * 4)} days later, at home.` : `${a.short} was marked for death. On the sixth day the fever broke: a recovery, and an injury that will never quite heal.`;
      else fate = `${a.short} came home.`;
      const inj = a.injuries.length ? ` Injuries: ${a.injuries.map((i) => i.name).join(", ")}.` : "";
      const bonds = a.bonds.filter((b) => b.value <= 0).map((b) => b.name);
      const b = bonds.length ? ` Lost: ${bonds.join(", ")}.` : "";
      const n = a.noticed ? ` Noticed ${a.noticed}.` : "";
      return el("li", {}, el("b", {}, a.name), " ", fate + inj + b + n);
    });
    const report = el("div", { class: "debrief" },
      el("div", { class: "seal-row" }, el("img", { src: U.img(solved ? "seal_solved" : "seal_failed", "ui"), alt: solved ? "Solved" : "Failed" }),
        el("div", {}, el("h3", {}, solved ? "Case solved" : "Case not solved"), el("p", {}, `Primary objectives: ${primDone} of ${prim.length}. Favors earned: ${primDone}. ${solved ? "Cases Solved +1." : "It won't count toward Cases Solved."}`))),
      el("ul", { class: "objlist" }, ...M.objectives.filter((o) => o.kind === "primary" || G.state.obj[o.id] === "done").map((o) =>
        el("li", { class: G.state.obj[o.id] === "done" ? "done" : "" }, el("b", {}, o.t), el("span", {}, G.state.obj[o.id] === "done" ? (o.id === "po3" ? G.state.po3 : o.done) : "Not completed")))),
      el("h4", {}, "The agents"), el("ul", { class: "fates" }, ...lines),
      G.state.nomura.joined ? el("p", { class: "small" }, G.state.nomura.dead ? "Daisuke Nomura's notebook was found in the hallway, the last page blank." : "Nomura files his report: domestic homicide, suspect in custody. He keeps a second notebook for everything else.") : null,
      el("button", { class: "btn primary", onclick: () => { G.clearSave(); window.CAMP.legacyDone({ kind, solved, primDone, primTotal: prim.length }); } }, "Return to the agency"));
    U.story().append(report);
    report.scrollIntoView({ block: "start" });
  };

  window.GAME = G;
})();
