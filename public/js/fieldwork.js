/* ============================================================================
   FIELD WORK: things to do in a place besides choosing from its list.
     Use an item        pick something from the kit and something in the scene to use it on
     Use what you know  each Background has its own thing to do: heal, cook, pray, call in a deal
     Ask around         talk to whoever is near; a Charisma roll for a lead and a rumour of the age
     Take stock         what you have found, and what is still unexamined
   and the day itself pushes back: every few actions something happens (a noise, a stranger,
   a failing light, a doubt) and the team chooses how to meet it.
   ========================================================================== */
(function () {
  const G = window.GAME, U = window.UI, R = window.R; if (!G || !U) return;
  const el = U.el, FW = (window.FIELD = {});
  const M = () => window.MODULE || {};
  const yr = () => (M().year) || (window.CAMP && CAMP.camp && CAMP.camp.year) || 2000;
  const LIGHT = () => (yr() < 1890 ? "lantern" : yr() < 1995 ? "torch" : "phone light");
  const used = () => ((G.state._fw = G.state._fw || {}));
  const here = () => (G.state && G.state.loc) || "";
  const clampPool = (a, pool, n) => { const p = a.pools && a.pools[pool]; if (!p) return; p.cur = Math.max(1, Math.min(p.max, p.cur + n)); };
  const addFocus = (a, n) => { if (window.FOCUS && FOCUS.on()) { const f = FOCUS.get(a); f.cur = Math.max(0, Math.min(f.max, f.cur + n)); } };
  const live = () => G.visibleHotspots().filter((h) => h.src && !h.go);
  const hint = async () => {
    const left = live().filter((h) => JSON.stringify(h.src.steps || []).includes('"check"') || JSON.stringify(h.src.steps || []).includes('"converse"'));
    const h = left[Math.floor(Math.random() * left.length)];
    await G.api.narrate(h ? `You keep coming back to one thing: <b>${h.label}</b>.` : "You are fairly sure you have seen everything here that is going to help.");
  };
  const RUMOURS = {
    old: ["The carter says the well was bricked up after the last bad winter, and nobody will say why.", "A woman at the door swears the bell rings on its own, but only when nobody is listening.", "Someone mentions a stranger who paid in old coin and asked after the cellar."],
    mid: ["The porter says the night shift stopped coming in two weeks ago, all together, and nobody has asked.", "A boy tells you the lamp on the corner goes out whenever somebody looks at it too long.", "Someone's aunt, he says, has been talking to the wireless."],
    late: ["The cleaner says the security feed has a gap every night at the same minute, and the gap is never reported.", "A kid on a bike says the signal goes strange near the old exchange.", "Someone on the corner says the whole block went quiet at once, last week, and nobody remembers why."]
  };
  const rumour = () => { const y = yr(), L = y < 1850 ? RUMOURS.old : y < 1990 ? RUMOURS.mid : RUMOURS.late; return L[Math.floor(Math.random() * L.length)]; };

  /* ---------------------------------------------------------------- Backgrounds */
  const BG = {
    Healer: { label: "Treat someone's wounds", once: "scene", run: async (a) => { const t = G.active().sort((x, y) => x.pools.health.cur / x.pools.health.max - y.pools.health.cur / y.pools.health.max)[0]; clampPool(t, "health", 3); await G.api.narrate(`${a.short} dresses ${t === a ? "their own" : t.short + "'s"} wounds with what is to hand. (+3 Health)`); } },
    Chef: { label: "Cook something warm", once: "case", run: async (a) => { for (const x of G.active()) { clampPool(x, "health", 3); addFocus(x, 1); } await G.api.narrate(`${a.short} finds a pot, a flame and an onion, and ten minutes later everyone is eating. (+3 Health, +1 Focus, all)`); } },
    Entrepreneur: { label: "Call in a deal", once: "scene", run: async (a) => { G.state.spellLight = here(); window.dispatchEvent(new Event("beyond:light")); await G.api.narrate(`${a.short} knows a man who knows a man. A ${LIGHT()} arrives within the quarter-hour, and the cost goes on somebody else's account. (Light for this place)`); await hint(); } },
    Empath: { label: "Read the room", once: "scene", run: async (a) => { const ids = (G.loc().cast ? G.loc().cast(G.api) : []); await G.api.narrate(ids.length ? ids.map((i) => `${M().npcs[i].name} is ${["frightened and hiding it", "angry at something else", "tired in a way sleep will not fix", "holding something back", "relieved you came"][Math.floor(Math.random() * 5)]}.`).join(" ") : `${a.short} listens to the place itself, and it feels like a place that is waiting.`); await hint(); } },
    Artisan: { label: "Make something from what is here", once: "scene", run: async (a) => { G.state.spellLight = here(); window.dispatchEvent(new Event("beyond:light")); await G.api.narrate(`${a.short} lashes a ${LIGHT()} together from a bottle, a rag and two lengths of wire. It will do. (Light for this place)`); } },
    Zealot: { label: "Pray, and mean it", once: "scene", run: async (a) => { for (const x of G.active()) clampPool(x, "stability", 3); await G.api.narrate(`${a.short} kneels. Nobody else does, and nobody leaves. (+3 Stability, all)`); } },
    Local: { label: "Ask a neighbour", once: "scene", run: async (a) => { await G.api.narrate(rumour()); await hint(); } },
    Detective: { label: "Piece it together", once: "scene", run: async (a) => { const n = G.state.clues.length; await G.api.narrate(n ? `${a.short} lays out what is known: ${G.state.clues.map((c) => `<i>${(M().clues[c] || {}).t || c}</i>`).join("; ")}.` : `${a.short} finds nothing yet to piece together.`); await hint(); } },
    Tactician: { label: "Make a plan", once: "scene", run: async (a) => { for (const x of G.active()) addFocus(x, 1); await G.api.narrate(`${a.short} gives everyone a job and a fallback. (+1 Focus, all)`); } },
    Guardian: { label: "Stand watch", once: "scene", run: async (a) => { G.state._watch = here(); await G.api.narrate(`${a.short} takes the door. Whatever comes to this place next will meet them first. (The next event here costs you nothing.)`); } },
    _: { label: "Steel yourself", once: "scene", run: async (a) => { clampPool(a, "sanity", 2); await G.api.narrate(`${a.short} takes a long breath and counts to ten. (+2 Sanity)`); } }
  };
  FW.skill = async () => {
    const team = G.active(), who = team.length === 1 ? team[0].id : await U.choose("Who?", team.map((a) => ({ id: a.id, label: `${a.short} · ${a.background || "Agent"}` })));
    const a = team.find((x) => x.id === who); if (!a) return;
    const b = BG[a.background] || BG._, k = `${a.id}:${b.label}:${b.once === "case" ? "case" : here()}`;
    if (used()[k]) return U.toast("Already done here.");
    used()[k] = true; await G.run(async () => { await b.run(a); });
  };

  /* ---------------------------------------------------------------- Use an item on something */
  FW.useItem = async () => {
    const kit = G.active().flatMap((a) => (a.items || []).filter((it) => it.uses > 0).map((it) => ({ a, it, d: it.def || (M().items || {})[it.id] }))).filter((x) => x.d);
    if (!kit.length) return U.toast("Nobody is carrying anything to use.");
    const pick = await U.choose("Use which item?", kit.map((x, i) => ({ id: String(i), label: `${x.d.name} · ${x.a.short}`, hint: x.d.text })));
    const k = kit[+pick]; if (!k) return;
    const targets = live();
    if (!targets.length) return U.toast("Nothing here to use it on.");
    const tid = await U.choose(`Use the ${k.d.name} on…`, targets.map((h) => ({ id: h.id, label: h.label })));
    const h = targets.find((x) => x.id === tid); if (!h) return;
    const asp = ((k.d.applies || []).find((x) => String(x).startsWith("aspect:")) || "aspect:awareness").split(":")[1];
    const stems = (t) => new Set(String(t || "").toLowerCase().replace(/[^a-z\s]/g, " ").split(/\s+/).filter((w) => w.length > 3).map((w) => w.slice(0, 5)));
    const have = stems(`${h.label} ${h.src.hint || ""} ${JSON.stringify(h.src.steps || []).replace(/[{}\[\]":,]/g, " ")}`), mine = stems(`${k.d.name} ${k.d.text} ${(k.d.applies || []).join(" ")}`);
    let fit = 0; for (const w of mine) if (have.has(w)) fit++;
    const tags = (k.d.applies || []).filter((x) => String(x).startsWith("tag:")).map((x) => x.slice(4)), tagFit = tags.some((t) => JSON.stringify(h.src.steps || []).includes(`"${t}"`));
    if (!JSON.stringify(h.src.steps || []).includes('"check"')) { await G.run(async () => { await G.api.narrate(`The ${k.d.name} has no part to play in this. It is not that sort of problem.`); }); return; }
    const good = fit > 0 || tagFit;
    ADV.improv = { aspect: asp, shift: good ? -2 : 1, note: good ? `The ${k.d.name} is the right tool. (CR −2)` : `The ${k.d.name} is not obviously the right tool, and you have to make it work. (CR +1)` };
    G.useHotspot(h);
    setTimeout(() => { if (!G.busy) ADV.improv = null; }, 600);
  };

  /* ---------------------------------------------------------------- Ask around, take stock */
  FW.ask = async () => {
    const k = "ask:" + here(); if (used()[k]) return U.toast("You have already asked everyone here.");
    used()[k] = true;
    await G.run(async () => {
      await G.api.narrate("You find someone who looks as if they would rather talk than not, and you buy them the time.");
      const r = await G.check({ aspect: "charisma", cr: R.cr("medium"), label: "Ask around", who: "choose", tags: ["talk"] });
      if (r.ok) { await G.api.narrate(rumour()); await hint(); } else { await G.api.narrate("They give you their name, the weather, and the opinions of their neighbours. It is an hour you will not get back."); if (r.agent) addFocus(r.agent, -1); G.refreshParty(); }
    });
  };
  FW.stock = async () => {
    await G.run(async () => {
      const left = live(), done = G.state.clues.length, total = Object.keys(M().clues || {}).length;
      await G.api.narrate(`<b>Where things stand.</b> ${done} clue${done === 1 ? "" : "s"} found${total ? " of what this case holds" : ""}. Here, still open: ${left.length ? left.map((h) => `<i>${h.label}</i>`).join("; ") : "nothing you can see."}`);
    });
  };
  FW.menu = async () => {
    const c = await U.choose("Field work", [{ id: "item", label: "Use an item on something", hint: "The right tool makes it easier" }, { id: "skill", label: "Use what you know", hint: "Your Background gives you something to do" }, { id: "ask", label: "Ask around", hint: "Charisma, for a lead" }, { id: "stock", label: "Take stock", hint: "What you have, and what is open" }, { id: "x", label: "Never mind" }]);
    if (c === "item") FW.useItem(); else if (c === "skill") FW.skill(); else if (c === "ask") FW.ask(); else if (c === "stock") FW.stock();
  };

  /* ---------------------------------------------------------------- the day pushes back: events */
  const EV = [
    { t: "Something moves in the next room: a scrape, a pause, the click of something small.", c: [
      { l: "Go and look", a: "awareness", cr: "medium", ok: "It is only a nervous animal. But what it was nosing at is a thing you would have missed.", okfx: "hint", fail: "It is not an animal. Whatever it was has gone, and it left you with a cold hand on your neck.", failfx: ["sanity", -2] },
      { l: "Hold still and listen", a: "willpower", cr: "easy", ok: "It passes. You let out a breath you did not know you were holding.", fail: "It goes on, and on, and you spend a long time not moving.", failfx: ["focus", -1] }] },
    { t: "Your ${L} gutters, steadies and gutters again.", c: [
      { l: "Shield it and trim it", a: "agility", cr: "easy", ok: "It burns clean. For a moment you see the whole room very clearly.", okfx: "hint", fail: "It gutters out, and you spend a minute in the dark.", failfx: ["focus", -1] },
      { l: "Press on regardless", a: "willpower", cr: "medium", ok: "You do not need it. You move as if you did not.", fail: "Without it, every shape in the room is a person.", failfx: ["sanity", -2] }] },
    { t: "Someone is watching you. You cannot say how you know.", c: [
      { l: "Meet their eye", a: "charisma", cr: "medium", ok: "A man steps back from a doorway, and then, because you waited, comes forward. He knows something.", okfx: "rumour", fail: "They are gone before you turn, and the feeling stays.", failfx: ["stability", -2] },
      { l: "Slip away", a: "agility", cr: "medium", ok: "You turn two corners, and the feeling goes.", fail: "You turn three, and it is still there, a step behind.", failfx: ["focus", -1] }] },
    { t: "A stranger asks you for something small: a light, a coin, a minute.", c: [
      { l: "Give them the minute", a: "morality", cr: "easy", ok: "They tell you something, not much, in return: the way a person does when they were not expecting to be asked.", okfx: "rumour", fail: "It takes longer than a minute.", failfx: ["focus", -1] },
      { l: "Move on", a: "willpower", cr: "easy", ok: "You do not look back.", fail: "You do look back, and they are still standing there.", failfx: ["stability", -1] }] },
    { t: "Doubt settles on the team, quietly, like dust. Nobody says it, but everyone is thinking: what if we are wrong?", c: [
      { l: "Say it aloud, and answer it", a: "charisma", cr: "medium", ok: "Saying it takes the weight off it. The team is steadier for having been honest.", okfx: ["stability", 2, "all"], fail: "It is the wrong moment, and the wrong words.", failfx: ["stability", -2] },
      { l: "Keep working", a: "willpower", cr: "medium", ok: "Work is an answer of a kind.", fail: "The doubt works too.", failfx: ["sanity", -1] }] },
    { t: "The weather turns: the wind, the damp, the light going yellow and flat.", c: [
      { l: "Find cover and wait it out", a: "iq", cr: "easy", ok: "You lose a quarter-hour, and nothing worse.", fail: "You choose the wrong doorway, and the cold gets into you.", failfx: ["health", -2] },
      { l: "Go on in it", a: "durability", cr: "medium", ok: "You are wet through, and ahead of everyone who sheltered.", okfx: "hint", fail: "It is worse than it looked.", failfx: ["health", -3] }] },
    { t: "You find something that someone dropped: a scrap of paper, a button, a ticket stub.", c: [
      { l: "Look at it properly", a: "awareness", cr: "easy", ok: "It means something to somebody. It points at something here.", okfx: "hint", fail: "It is just litter. You are sure of it.", failfx: ["focus", -0] },
      { l: "Pocket it for later", a: "iq", cr: "easy", ok: "You will remember where you found it.", fail: "You will not.", failfx: ["focus", -0] }] },
    { t: "A wrongness in the air: the smell of the place, or the quiet of it, or the way the shadows lie.", c: [
      { l: "Reach for it", a: "occult", cr: "medium", ok: "Whatever it is, it has a direction. You know where to look.", okfx: "hint", fail: "It looks back.", failfx: ["sanity", -3] },
      { l: "Do not look at it", a: "willpower", cr: "medium", ok: "A thing you do not look at has less to say to you.", fail: "You look.", failfx: ["sanity", -2] }] },
    { t: "Someone begins to tell an old story about this place, half to themselves, half to you.", c: [
      { l: "Listen", a: "ancient", cr: "medium", ok: "It is mostly nonsense. One detail in it is not.", okfx: "hint", fail: "It is a good story, and no use at all.", failfx: ["focus", -0] },
      { l: "Ask a question", a: "charisma", cr: "easy", ok: "They stop, and think, and tell you the thing they were not going to.", okfx: "rumour", fail: "They stop, and do not start again.", failfx: ["focus", -0] }] },
    { t: "Something small and ordinary goes wrong, and the whole team notices at once: laughter, almost.", c: [
      { l: "Let it be a joke", a: "charisma", cr: "easy", ok: "For a moment you are only people on a job. It helps more than it should.", okfx: ["stability", 1, "all"], fail: "It lands badly, and nobody laughs.", failfx: ["focus", -0] },
      { l: "Get on", a: "willpower", cr: "easy", ok: "Fine.", fail: "Fine.", failfx: ["focus", -0] }] }
  ];
  const fx = async (a, f) => {
    if (!f) return;
    if (f === "hint") return hint();
    if (f === "rumour") { await G.api.narrate(rumour()); return hint(); }
    const [pool, n, all] = f; const who = all === "all" ? G.active() : [a];
    for (const x of who) { if (!x) continue; if (pool === "focus") addFocus(x, n); else clampPool(x, pool, n); }
    if (n) U.print(`<small>${n > 0 ? "+" : ""}${n} ${pool}${all === "all" ? ", all" : ""}</small>`, "narr");
  };
  FW.event = async () => {
    const e = EV[Math.floor(Math.random() * EV.length)], txt = e.t.replace("${L}", LIGHT());
    if (G.state._watch === here()) { G.state._watch = null; await G.api.narrate(`<i>${txt.replace(/\$\{L\}/g, LIGHT())}</i> ${G.active()[0].short} was already at the door, and it came to nothing.`); return; }
    await G.api.narrate(`<i>${txt}</i>`);
    const id = await U.choose("What do you do?", e.c.map((c, i) => ({ id: String(i), label: c.l, hint: `${R.ASPECT_LABEL[c.a] || c.a} · ${c.cr}` })));
    const c = e.c[+id] || e.c[0];
    const r = await G.check({ aspect: c.a, cr: R.cr(c.cr), label: c.l, who: "choose", tags: ["event"] });
    await G.api.narrate(r.ok ? c.ok : c.fail); await fx(r.agent, r.ok ? c.okfx : c.failfx); G.refreshParty();
  };
  const run0 = G.run;
  G.run = async function (fn) {
    const wasBusy = G.busy; const r = await run0.call(this, fn);
    try {
      if (wasBusy || !window.RPGX.on("events") || !G.state || G.state.phase !== "explore" || !G.loc() || /boss|combat/.test(G.loc().music || "")) return r;
      G.state._beat = (G.state._beat || 0) + 1; const k = "ev:" + here();
      if (G.state._beat % 4 === 0 && (used()[k] || 0) < 2) {
        used()[k] = (used()[k] || 0) + 1;
        G.busy = true; document.body.classList.add("busy");
        try { await FW.event(); } catch (e) { console.error(e); }
        G.busy = false; document.body.classList.remove("busy"); G.refreshParty(); G.showIdle();
      }
    } catch (e) { console.error(e); }
    return r;
  };
  const idle0 = G.showIdle;
  G.showIdle = function () {
    idle0.apply(this, arguments);
    const g = U.choicesBox().querySelector(".idle-grid");
    if (g && window.RPGX.on("fieldwork") && G.state && G.state.phase === "explore") g.append(el("button", { class: "btn choice idle fieldwork", onclick: () => { U.click(); FW.menu(); } }, el("span", { class: "lbl" }, "Field work…"), el("small", { class: "spotinfo" }, "Use an item · your skills · ask around")));
  };
})();
