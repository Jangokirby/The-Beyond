/* ============================================================================
   ADVENTURE FORMAT + MONSTER BUILDER

   An adventure is plain data (JSON-friendly, no functions). ADV.compile turns it
   into the object the engine plays. The GM toolkit edits this same format.

   adventure = {
     id, title, jp?, setting, year, agencies: ["OID",...], summary, level: [min,max],
     objectives: [{id, kind:"primary"|"secondary", t, done}],
     clues: {id: {t, s, x}},                      npcs: {id: {name, tag, look, face:{...}}},
     enemies: {id: {build:{type,difficulty,...}}  or raw stat block},
     encounters: {id: {name, theme, zones:[{id,name,col,row}], edges:[[a,b]], start, foes:[{t,zone,name?}], lit?, fightText?}},
     start: "sceneId",
     scenes: {id: {name, theme, mood, lighting, weather, cast:[npcId], onEnter:[steps], options:[{label, if?, once?, steps}]}}
   }
   step = {say:"text"} {aloud:"text"} {talk:{npc, text}} {check:{aspect, cr, label, ok:[], fail:[], who?}}
          {group:{aspect, cr, label, ok:[], fail:[]}} {combat:"id", surprise?, win:[], lose:[]} {goto:"scene"}
          {set:"flag"} {unset:"flag"} {clue:"id"} {objective:"id"} {if:cond, then:[], else:[]} {once:"key", steps:[]}
          {choice:{prompt, options:[{label, if?, steps}]}} {damage:{pool, amount}} {heal:{pool, amount}} {sfx:"key"} {end:"win"|"lose"}
          {converse:{npc, id?, open:[line], topics:[{ask, if?, once?, lines:[line], then:[steps]}], leave?, bye:[line], done:[line], again?}}
          line = "spoken by the npc" | {say:"narration"} | {you:"spoken by the agent who is talking"} | {npc:"id", text}
   cond = "flag" | {flag} | {not:cond} | {clue:"id"} | {obj:"id"} | {all:[...]} | {any:[...]} | {arc:"flag"}
   arcs:  a case that belongs to a campaign arc has arc: {id, part}. {arcSet:"flag"} remembers a choice for
          the rest of the arc (kept when the case ends), and {arc:"flag"} checks it in a later part.
   ========================================================================== */
(function () {
  const ADV = { LIBRARY: {} };

  /* ================================================================ monster builder
     Base stats per type and adjustments per difficulty come straight from the
     rulebook's Creating a Monster section. Beyond and Construct leave their
     stats to the GM ("?"), so those two use the defaults below. */
  const TYPES = {
    Beyond:   { h: 30, s: 30, t: 30, atk: 4, er: 10, br: 4, mr: 4, sr: 4, spd: 2, mods: 1, note: "Rulebook leaves stats open (defaults chosen) and grants 1 Legendary Modifier of choice." },
    Construct:{ h: 15, s: 10, t: 10, atk: 3, er: 5, br: 8, mr: 8, sr: 8, spd: 0, mods: 0, note: "Rulebook: Health 15, other stats open, no Attack and no Modifiers. Attack +3 is a house default so a Construct that fights can hit." },
    Divine:   { h: 40, s: 40, t: 40, atk: 6, er: 14, br: 8, mr: 8, sr: 8, spd: 3, mods: 1 },
    Feral:    { h: 30, s: 20, t: 25, atk: 4, er: 8, br: 3, mr: 1, sr: 1, spd: 1, mods: 0 },
    Folklore: { h: 35, s: 35, t: 35, atk: 5, er: 13, br: 8, mr: 6, sr: 6, spd: 2, mods: 1 },
    Golem:    { h: 20, s: 20, t: 20, atk: 3, er: 5, br: 15, mr: 15, sr: 15, spd: 0, mods: 0, free: ["Statue"] },
    Human:    { h: 25, s: 25, t: 25, atk: 3, er: 7, br: 3, mr: 1, sr: 1, spd: 1, mods: 0, free: ["Speech"] },
    Spirit:   { h: 20, s: 20, t: 30, atk: 3, er: 11, br: 10, mr: 10, sr: 2, spd: 0, mods: 0, free: ["Possession"] },
    Swarm:    { h: 15, s: 15, t: 15, atk: 0, er: 10, br: 2, mr: 1, sr: 1, spd: 2, mods: 0, free: ["Swarm"] },
    Undead:   { h: 30, s: 25, t: 20, atk: 3, er: 6, br: 5, mr: 4, sr: 0, spd: 0, mods: 0, free: ["Undeath"] }
  };
  const DIFFS = {
    easy:        { cr: 7,  atk: -1, res: -1, spd: -1, er: -1, pool: -5,  mods: -1, act: 0, core: -1, weight: 1 },
    medium:      { cr: 10, atk: 0,  res: 0,  spd: 0,  er: 0,  pool: 0,   mods: 0,  act: 0, core: 0,  weight: 1 },
    challenging: { cr: 14, atk: 2,  res: 2,  spd: 2,  er: 2,  pool: 10,  mods: 1,  act: 1, core: 1,  weight: 2 },
    dangerous:   { cr: 18, atk: 3,  res: 3,  spd: 3,  er: 3,  pool: 25,  mods: 2,  act: 2, core: 2,  weight: 3 },
    hopeless:    { cr: 20, atk: 5,  res: 5,  spd: 5,  er: 5,  pool: 35,  mods: 3,  act: 3, core: 4,  weight: 4 }
  };
  ADV.MB = { TYPES, DIFFS };
  ADV.buildMonster = (o) => {
    const T = TYPES[o.type] || TYPES.Beyond, D = DIFFS[o.difficulty || "medium"];
    const bump = o.variable || null; // "health" | "sanity" | "stability": +5 for Human/Undead/Folklore nature
    const pool = (base, key) => Math.max(1, base + D.pool + (bump === key ? 5 : 0) + (o.bonus && o.bonus[key] || 0));
    const res = (v) => Math.max(0, v + D.res);
    const core = o.core || { body: 3, mind: 1, spirit: 2 };
    const m = {
      name: o.name, type: o.type, crLabel: `${D === DIFFS.easy ? "Easy" : o.difficulty[0].toUpperCase() + o.difficulty.slice(1)}, CR ${D.cr}`, cr: D.cr, weight: D.weight,
      sprite: o.sprite || "humanoid", hue: o.hue || 0,
      core: { body: Math.max(0, core.body + D.core), mind: Math.max(0, core.mind + D.core), spirit: Math.max(0, core.spirit + D.core) },
      health: pool(T.h, "health"), sanity: pool(T.s, "sanity"), stability: pool(T.t, "stability"),
      attack: Math.max(0, T.atk + D.atk + (o.attack || 0)), er: Math.max(0, T.er + D.er + (o.er || 0)),
      br: res(T.br) + (o.br || 0), mr: res(T.mr) + (o.mr || 0), sr: res(T.sr) + (o.sr || 0),
      speed: Math.max(0, T.spd + D.spd + (o.speed || 0)), actions: 1 + D.act,
      mods: [...(T.free || []), ...(o.mods || [])], dtype: o.dtype || "health", range: o.range || 0, regen: o.regen || 0,
      hitSfx: o.hitSfx || null, dies: o.dies || null, modsAllowed: Math.max(0, 3 + D.mods + (T.mods || 0)), text: o.text || "", deathMark: o.deathMark || 0
    };
    return window.GEAR ? window.GEAR.applyMonsterMods(m) : m;
  };

  /* ================================================================ compile */
  const asArr = (x) => (x == null ? [] : Array.isArray(x) ? x : [x]);
  const MUSIC = { calm: "investigation", dread: "basement", weird: "paperhouse", tense: "investigation", boss: "boss" };
  /* ambience beds (recorded, assets/audio/sfx): a scene's weather picks one; with no weather, its theme does.
     weather "none" keeps a scene silent. */
  const AMB = { rain: "rain", building: "building", boiler: "boiler", wind: "wind", storm: "storm", sea: "sea", night: "night", fire: "fire", city: "city", train: "train", dread: "dread" };
  const THEME_AMB = { sea: "sea", forest: "night", village: "night", desert: "wind", snow: "wind", trench: "wind", castle: "wind", fog: "wind", train: "train", cellar: "boiler", lab: "building", modern: "building", future: "city", street: "city", drive: "night", cave: "dread", church: "dread" };
  /* machine sounds only after their time: a 1187 cellar gets dread, not a boiler */
  const AMB_FROM = { boiler: 1880, building: 1925, city: 1925, train: 1830 };
  const AMB_BEFORE = { boiler: "dread", building: "dread", city: "wind", train: "wind" };
  ADV.ambienceFor = (sc, year) => {
    if (sc.weather === "none") return null;
    if (AMB[sc.weather]) return AMB[sc.weather];
    const k = THEME_AMB[sc.theme || "street"] || null;
    return k && year && AMB_FROM[k] > year ? AMB_BEFORE[k] : k;
  };

  ADV.cond = (c, g) => {
    if (c == null) return true;
    if (typeof c === "string") return !!g.flag(c);
    if (c.flag) return !!g.flag(c.flag);
    if (c.not !== undefined) return !ADV.cond(c.not, g);
    if (c.clue) return g.has(c.clue);
    if (c.obj) return g.done(c.obj);
    if (c.all) return c.all.every((x) => ADV.cond(x, g));
    if (c.any) return c.any.some((x) => ADV.cond(x, g));
    if (c.arc) return !!(window.ARCS && window.ARCS.flag(c.arc));
    return true;
  };

  ADV.exec = async (steps, g, M) => {
    const G = window.GAME, U = window.UI;
    for (const st of asArr(steps)) {
      if (G.state.phase === "ending") return true;
      if (st.say) await g.narrate(st.say);
      else if (st.aloud) await g.aloud(st.aloud);
      else if (st.talk) await g.say(st.talk.text, { who: st.talk.npc });
      else if (st.sfx) g.sfx(st.sfx);
      else if (st.set) g.set(st.set);
      else if (st.unset) g.set(st.unset, false);
      else if (st.clue) g.clue(st.clue);
      else if (st.objective) await g.complete(st.objective);
      else if (st.shake) g.shake();
      else if (st.check) {
        const c = st.check;
        const r = await G.check({ aspect: c.aspect, cr: R.cr(c.cr), label: c.label || "Check", who: c.who || "choose", tags: c.tags || [], investigate: !!c.investigate, tryKey: c.tryKey });
        if (await ADV.exec(r.ok ? c.ok : c.fail, g, M)) return true;
      } else if (st.group) {
        const c = st.group;
        const res = await G.groupCheck({ aspect: c.aspect, cr: R.cr(c.cr), label: c.label || "Everyone rolls", intro: c.intro || "", tags: c.tags || [] });
        if (await ADV.exec(res.every((x) => x.ok) ? c.ok : c.fail, g, M)) return true;
      } else if (st.combat) {
        const out = await window.COMBAT.start(st.combat, { surprise: !!st.surprise || !!(st.surpriseIf && g.flag(st.surpriseIf)), canFlee: true });
        if (out === "wiped") { await window.CAMP.endAdventure("wiped"); return true; }
        if (out === "fled") { await g.narrate("You get out alive. Whatever it was stays where it was, and you can try again, or try something else."); await g.goto(window.GAME.state.loc); return true; }
        if (await ADV.exec(st.win, g, M)) return true;
      } else if (st.goto) { await g.goto(st.goto); return true; }
      else if (st.if) {
        if (await ADV.exec(ADV.cond(st.if, g) ? st.then : st.else, g, M)) return true;
      } else if (st.once) {
        const k = "once:" + st.once;
        if (!g.flag(k)) { g.set(k); if (await ADV.exec(st.steps, g, M)) return true; }
      } else if (st.choice) {
        const opts = st.choice.options.filter((o) => ADV.cond(o.if, g));
        const id = await g.choose(st.choice.prompt, opts.map((o, i) => ({ id: String(i), label: o.label })));
        if (await ADV.exec(opts[+id].steps, g, M)) return true;
      } else if (st.fall) {
        /* each story is about 10 feet and costs 8 flat Health. A fall that would surely kill allows one Free Fall roll. */
        const f = st.fall, dmg = 8 * Math.max(1, f.stories | 0);
        await g.narrate(f.text || `The ground is ${f.stories || 1} stor${(f.stories | 0) > 1 ? "ies" : "y"} down.`);
        for (const ag of G.active()) {
          const p = ag.pools.health;
          if (ag.prop && ag.prop.flying) { await g.narrate(`${ag.short}'s flying ride swoops under and catches them.`); continue; }
          if (dmg >= p.cur) {
            await g.narrate(`${ag.short} falls far enough to be certain death. One chance.`);
            const r = await G.check({ aspect: "agility", cr: R.cr("challenging"), label: "Free Fall", who: ag.id, tags: [] });
            if (r.ok) { p.cur = 1; await g.narrate(`${ag.short} catches something, twists, and lands alive on 1 Health.`); }
            else if (f.lethal === false) p.cur = 1;
            else { ag.dead = true; ag.deathText = "A fall from a height no one walks away from."; p.cur = 0; await g.narrate(`${ag.short} does not get up.`); }
          } else { p.cur -= dmg; await g.narrate(`${ag.short} hits the ground for ${dmg}.`); }
        }
        G.refreshParty(); window.AudioMan.sfx("health_hit");
      } else if (st.trap) {
        /* a trap has a CR. Spot it (Awareness), then disarm it (IQ) or take it with Resistance. Unseen traps hit flat. */
        const t = st.trap, cr = R.cr(t.cr || "medium"), pool = t.pool || "health", amt = t.amount || 6;
        const seen = await G.check({ aspect: "awareness", cr, label: t.label || "Is something wrong here?", who: "choose", tags: [], tryKey: t.tryKey });
        let outcome = "hit";
        if (seen.ok) {
          const pick = await g.choose(`${t.label || "A trap"} is spotted.`, [{ id: "d", label: "Disarm it", hint: "IQ vs the trap's CR" }, { id: "w", label: "Walk through and brace", hint: "Resistance can soak the blow" }]);
          if (pick === "d") { const d = await G.check({ aspect: "iq", cr, label: "Disarm", who: "choose", tags: [] }); outcome = d.ok ? "off" : "sprung"; } else outcome = "sprung";
        }
        const victim = G.active()[Math.floor(R.rand() * G.active().length)];
        if (outcome === "off") await g.narrate("The trap is dead. It will not hurt anyone now.");
        else if (victim) {
          const resist = outcome === "sprung" ? (pool === "health" ? R.br(victim) : pool === "sanity" ? R.mr(victim) : R.sr(victim)) : 0;
          const dmg = Math.max(0, amt - resist);
          victim.pools[pool].cur = Math.max(1, victim.pools[pool].cur - dmg);
          await g.narrate(outcome === "hit" ? `It was hidden. ${victim.short} takes ${dmg} flat ${pool}, and nothing can turn it.` : `${victim.short} braces and takes ${dmg} ${pool} (${resist} soaked).`);
          G.refreshParty(); window.AudioMan.sfx(pool + "_hit");
        }
        if (await ADV.exec(outcome === "off" || (outcome === "sprung" && !t.sprungFail) ? t.ok : t.fail, g, M)) return true;
      } else if (st.afflict) {
        const f = st.afflict;
        for (const ag of G.active()) R.afflict(ag, f.id, R.cr(f.cr || "medium"));
        await g.narrate(f.text || `${(R.AFFLICTIONS[f.id] || {}).name || f.id}: ${(R.AFFLICTIONS[f.id] || {}).text || ""}`);
        G.refreshParty();
      } else if (st.read) {
        /* Truth or Lies: Charisma vs the CR. On a success the GM tells the truth about the person. */
        const rd = st.read;
        const r = await G.check({ aspect: "charisma", cr: R.cr(rd.cr || "medium"), label: rd.label || "Read them", who: "choose", tags: [] });
        if (r.ok) await g.narrate(rd.lying ? (rd.liar || "You can tell. They are lying to you.") : "You can tell. They are telling the truth.");
        else await g.narrate("You can't tell either way.");
        if (await ADV.exec(r.ok ? rd.ok : rd.fail, g, M)) return true;
      } else if (st.damage) {
        const targets = window.GAME.active();
        for (const a of targets) { const p = a.pools[st.damage.pool]; p.cur = Math.max(1, p.cur - st.damage.amount); }
        window.GAME.refreshParty(); window.AudioMan.sfx(st.damage.pool + "_hit");
      } else if (st.heal) {
        for (const a of window.GAME.active()) { if (!R.canHeal(a)) continue; const p = a.pools[st.heal.pool]; p.cur = Math.min(p.max, p.cur + st.heal.amount); }
        window.GAME.refreshParty(); window.AudioMan.sfx("heal");
      } else if (st.converse) {
        /* a conversation: the players pick what to ask, in any order, until they're done */
        const cv = st.converse, npcId = cv.npc, G = window.GAME;
        const speak = async (line) => {
          if (typeof line === "string") return g.say(line, { who: npcId });
          if (line.say) return g.narrate(line.say);
          if (line.you) { const ag = (G._actor && G.agentById(G._actor)) || G.active()[0]; return g.say(line.you, { who: ag ? ag.id : null }); }
          if (line.npc) return g.say(line.text, { who: line.npc });
          return ADV.exec([line], g, M);
        };
        const k = (i) => `conv:${npcId}:${cv.id || ""}:${i}`;
        if (cv.approach && window.APPROACH && !(await window.APPROACH.open(g, M, npcId))) return false;
        if (!(cv.id && g.flag(`conv:${npcId}:${cv.id}:opened`))) { for (const l of cv.open || []) await speak(l); if (cv.id) g.set(`conv:${npcId}:${cv.id}:opened`); }
        else if (cv.again) await speak(cv.again);
        /* A limited interview (the rulebook's interview rule, as in Death of a Bloodline): the first time, a Charisma roll decides
           how many questions this person will answer. Medium 10 or better: five. Challenging 14 or better: as many as you like.
           Below that: two. Topics with `cha: N` are the extra things only a persuasive agent in the party can draw out. */
        const lk = `conv:${npcId}:${cv.id || ""}:limit`;
        if (cv.limit && g.flag(lk) == null) {
          const r = await G.check({ aspect: "charisma", cr: R.cr("medium"), label: `Win ${(M.npcs[npcId] || {}).name ? M.npcs[npcId].name.split(" ")[0] : "their"} trust`, investigate: true, who: "choose", tags: ["interview"] });
          const tot = r.total || 0;
          g.set(lk, tot >= R.cr("challenging") ? 99 : tot >= R.cr("medium") ? 5 : 2);
          const lim = g.flag(lk);
          await g.narrate(lim >= 99 ? "They relax, and it is clear they will tell you whatever you ask." : lim === 5 ? "They will answer some questions, but not all night." : "They will give you a minute, and not a second more.");
        }
        const bestCha = Math.max(0, ...G.active().map((a) => R.aspect(a, "charisma")));
        for (;;) {
          const used = (cv.topics || []).reduce((n, t, i) => n + (g.flag(k(i)) && !t.free ? 1 : 0), 0);
          const cap = cv.limit ? g.flag(lk) : 99;
          const left = (cv.topics || []).map((t, i) => ({ t, i })).filter(({ t, i }) => ADV.cond(t.if, g) && !(t.once !== false && g.flag(k(i))) && (!t.cha || bestCha >= t.cha));
          if (!left.length) { for (const l of cv.done || []) await speak(l); break; }
          if (cv.limit && cap < 99 && used >= cap && left.every(({ t }) => !t.free)) { for (const l of cv.cutoff || ["That's all I have to say. I have things to do."]) await speak(l); break; }
          const npc = M.npcs[npcId] || {};
          const more = cv.limit && cap < 99 ? ` (${Math.max(0, cap - used)} question${cap - used === 1 ? "" : "s"} left)` : "";
          const id = await g.choose((cv.prompt || `What do you ask ${npc.name || "them"}?`) + more, [...left.map(({ t, i }) => ({ id: String(i), label: t.ask, hint: t.cha ? "Your Charisma draws this out" : t.free ? "" : undefined })), { id: "bye", label: cv.leave || "That's all for now" }]);
          if (id === "bye" || id == null) { for (const l of cv.bye || []) await speak(l); break; }
          const t = cv.topics[+id]; g.set(k(+id));
          for (const l of t.lines || []) { if (window.GAME.state.phase === "ending") return true; await speak(l); }
          if (t.then && await ADV.exec(t.then, g, M)) return true;
        }
      } else if (st.join) { await g.join(st.join); }
      else if (st.leave) { g.leave(st.leave); }
      else if (st.arcSet) { if (window.ARCS) window.ARCS.set(st.arcSet); }
      else if (st.arcUnset) { if (window.ARCS) window.ARCS.set(st.arcUnset, false); }
      else if (st.end) { await window.CAMP.endAdventure(st.end); return true; }
    }
    return false;
  };

  ADV.compile = (a) => {
    const M = { id: a.id, title: a.title, jp: a.jp || "", flavor: a.flavor || "", downtime: a.downtime, agency: a.agencies.join(" / "), setting: a.setting, year: a.year, summary: a.summary,
      agents: [], items: {}, npcs: {}, companions: a.companions || {}, clues: a.clues || {}, lore: {}, objectives: a.objectives, text: { intro: a.intro || a.summary }, interviews: {},
      enemies: {}, encounters: {}, locations: {}, start: a.start, modText: {}, src: a };
    for (const [id, n] of Object.entries(a.npcs || {})) M.npcs[id] = { name: n.name, jp: "", tag: n.tag || "", look: n.look || "", portrait: n.portraitKey && (window.ASSETS.portraits || {})[n.portraitKey] ? n.portraitKey : window.ART.portrait(n.face || {}) };
    for (const [id, e] of Object.entries(a.enemies || {})) {
      const d = e.build ? ADV.buildMonster(e.build) : { ...e };
      d.sprite = window.ART.sprite(d.sprite || "humanoid", d.hue || 0);
      d.boss = false;
      if (e.build) for (const m of d.mods) M.modText[m] = (window.GD.monsterMods.find((x) => x.name === m) || {}).text || (e.modText || {})[m] || "";
      for (const [k, v] of Object.entries(e.modText || {})) M.modText[k] = v;
      M.enemies[id] = d;
    }
    for (const [id, e] of Object.entries(a.encounters || {})) {
      M.encounters[id] = { ...e, scene: window.ART.scene(e.theme || "interior", id), music: e.music || "combat", sneakCR: 7 };
    }
    for (const [id, sc] of Object.entries(a.scenes)) {
      M.locations[id] = {
        name: sc.name, theme: sc.theme || "street", jp: sc.jp || "", scene: window.ART.scene(sc.theme || "street", id), music: MUSIC[sc.mood || "calm"] || "investigation",
        ambience: ADV.ambienceFor(sc, a.year), lighting: sc.lighting || "normal", severity: +sc.severity || 0, particles: sc.weather === "rain" || sc.weather === "storm" ? "rain" : "none",
        cast: () => (sc.cast || []).filter((n) => !sc.castIf || ADV.cond(sc.castIf[n], window.GAME.api)),
        enter: async (g) => { if (sc.onEnter) await ADV.exec(sc.onEnter, g, M); },
        hotspots: [],
        actions: (sc.options || []).map((o, i) => ({
          label: o.label,
          if: (g) => ADV.cond(o.if, g) && !(o.once && g.flag(`opt:${id}:${i}`)),
          run: async (g) => { if (o.once) g.set(`opt:${id}:${i}`); await ADV.exec(o.steps, g, M); }
        }))
      };
    }
    return M;
  };

  ADV.register = (a) => { ADV.LIBRARY[a.id] = a; };
  ADV.get = (id) => {
    if (window.ADVENTURES[id]) return window.ADVENTURES[id];
    const a = ADV.LIBRARY[id];
    if (!a) return null;
    window.ADVENTURES[id] = ADV.compile(a);
    return window.ADVENTURES[id];
  };

  window.ADV = ADV;
})();
