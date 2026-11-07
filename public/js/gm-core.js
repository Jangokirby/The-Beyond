/* ============================================================================
   GM TOOLKIT CORE — storage for homebrew adventures, templates, validation,
   import/export, and throwaway playtest campaigns.
   Homebrew adventures are the same plain-data format as the built-in ones.
   ========================================================================== */
(function () {
  const ADV = window.ADV, CAMP = window.CAMP, C = window.CDATA, GD = window.GD;
  const GM = (window.GM = {});
  const KEY = "beyond.gm.v1";
  let mem = null;
  const rd = () => { try { const s = localStorage.getItem(KEY); return s ? JSON.parse(s) : []; } catch (e) { return mem || []; } };
  const wr = (v) => { mem = v; try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* in-memory only */ } };
  const clone = (x) => JSON.parse(JSON.stringify(x));
  const uid = () => "gm-" + Math.random().toString(36).slice(2, 8);

  GM.list = () => rd();
  GM.get = (id) => rd().find((a) => a.id === id);
  GM.register = (a) => { delete window.ADVENTURES[a.id]; ADV.register(a); };
  GM.save = (a) => {
    a.custom = true; a.updated = Date.now();
    const l = rd().filter((x) => x.id !== a.id); l.unshift(clone(a)); wr(l);
    GM.register(a);
  };
  GM.remove = (id) => { wr(rd().filter((x) => x.id !== id)); delete ADV.LIBRARY[id]; delete window.ADVENTURES[id]; };
  GM.loadAll = () => { for (const a of rd()) ADV.register(a); };

  GM.blank = () => ({
    id: uid(), custom: true, title: "Untitled case", setting: "", year: 1976, level: [1, 3], agencies: ["EHG"], summary: "", notes: "",
    objectives: [{ id: "po1", kind: "primary", t: "Find out what happened", done: "" }, { id: "po2", kind: "primary", t: "Put a stop to it", done: "" }],
    clues: {}, npcs: {}, enemies: {}, encounters: {}, start: "start",
    scenes: { start: { name: "The scene", theme: "street", mood: "calm", lighting: "normal", weather: "", cast: [], notes: "", onEnter: [{ say: "Describe what the agents see." }], options: [{ label: "Wrap it up", steps: [{ end: "win" }] }] } }
  });

  /* a starter case that shows every piece working */
  GM.sample = () => {
    const a = GM.blank();
    a.title = "The Quiet Room"; a.setting = "Your city"; a.summary = "Replace this with a hook the agents can act on.";
    a.clues = { c1: { t: "A door that should not be there", s: "The hallway", x: "The floor plan shows no room at the end of the hall." } };
    a.npcs = { witness: { name: "Mr. Alder", tag: "Caretaker", look: "Nervous, keys in hand.", face: { skin: window.ART.SKIN[1], hairC: window.ART.HAIRC[4], hair: "short", outfit: window.ART.OUTFIT[6], extra: "glasses", bg: "#2b2f3a" } } };
    a.enemies = { thing: { build: { name: "The Thing in the Room", type: "Folklore", difficulty: "medium", sprite: "beyond", hue: 280, dtype: "sanity", range: 0, mods: [] } } };
    a.encounters = { room: { name: "The quiet room", theme: "interior", fightText: "The air goes flat.", zones: [{ id: "z00", name: "Doorway", col: 0, row: 0 }, { id: "z10", name: "Far wall", col: 1, row: 0 }], edges: [["z00", "z10"]], start: "z00", foes: [{ t: "thing", zone: "z10" }] } };
    a.scenes = {
      start: { name: "The hallway", theme: "interior", mood: "weird", lighting: "shadow", weather: "", cast: ["witness"], notes: "",
        onEnter: [{ say: "A long corridor. At the end is a door that is not on any plan." }],
        options: [
          { label: "Talk to Mr. Alder", steps: [{ talk: { npc: "witness", text: "It was a wall yesterday." } }, { clue: "c1" }, { objective: "po1" }] },
          { label: "Open the door", steps: [{ combat: "room", win: [{ objective: "po2" }, { end: "win" }] }] }] }
    };
    return a;
  };

  /* ------------------------------------------------------------ import / export */
  GM.export = (a) => JSON.stringify(a, null, 2);
  /* accepts one adventure, an array of them, or a pack {adventures:[...]} */
  GM.importMany = (txt) => {
    let d;
    try { d = JSON.parse(txt); } catch (e) { return { err: "That isn't valid JSON: " + e.message }; }
    const raw = Array.isArray(d) ? d : Array.isArray(d && d.adventures) ? d.adventures : Array.isArray(d && d.pack) ? d.pack : [d];
    const list = [], errs = [];
    for (const r of raw) {
      const res = GM.import(JSON.stringify(r));
      if (res.err) errs.push(res.err); else list.push(res.a);
    }
    if (!list.length) return { err: errs[0] || "Nothing to import." };
    return { list, errs, name: d && d.name };
  };
  GM.import = (txt) => {
    let a;
    try { a = JSON.parse(txt); } catch (e) { return { err: "That isn't valid JSON: " + e.message }; }
    if (!a || typeof a !== "object" || !a.scenes || !a.title) return { err: "This doesn't look like an adventure (needs a title and scenes)." };
    a = Object.assign(GM.blank(), a);
    if (!/^gm-/.test(a.id) || ADV.LIBRARY[a.id] && !ADV.LIBRARY[a.id].custom) a.id = uid();
    return { a };
  };

  /* ------------------------------------------------------------ walk steps */
  const stepLists = (st) => {
    const out = [];
    if (st.check) out.push(st.check.ok, st.check.fail);
    if (st.group) out.push(st.group.ok, st.group.fail);
    if (st.trap) out.push(st.trap.ok, st.trap.fail);
    if (st.read) out.push(st.read.ok, st.read.fail);
    if (st.combat) out.push(st.win);
    if (st.if) out.push(st.then, st.else);
    if (st.once) out.push(st.steps);
    if (st.choice) for (const o of st.choice.options || []) out.push(o.steps);
    return out.filter(Array.isArray);
  };
  GM.walk = (steps, fn) => { for (const st of steps || []) { fn(st); for (const l of stepLists(st)) GM.walk(l, fn); } };
  GM.allSteps = (a) => {
    const lists = [];
    for (const sc of Object.values(a.scenes || {})) { lists.push(sc.onEnter || []); for (const o of sc.options || []) lists.push(o.steps || []); }
    return lists;
  };
  const condRefs = (c, f) => { if (!c) return; if (typeof c === "string") return f("flag", c); if (c.clue) f("clue", c.clue); if (c.obj) f("obj", c.obj); if (c.not) condRefs(c.not, f); for (const x of [...(c.all || []), ...(c.any || [])]) condRefs(x, f); };

  /* ------------------------------------------------------------ validation */
  GM.validate = (a) => {
    const err = [], warn = [];
    const sc = a.scenes || {}, ids = Object.keys(sc);
    if (!a.title.trim()) err.push("Give the adventure a title.");
    if (!a.agencies.length) err.push("Choose at least one agency.");
    if (!sc[a.start]) err.push(`The start scene "${a.start}" doesn't exist.`);
    if (!(a.objectives || []).some((o) => o.kind === "primary")) err.push("Add at least one primary objective.");
    const has = (m, k) => Object.prototype.hasOwnProperty.call(m || {}, k);
    const ref = (kind, id, where) => {
      const m = { clue: a.clues, npc: a.npcs, enc: a.encounters, scene: sc }[kind];
      if (kind === "obj") { if (!(a.objectives || []).some((o) => o.id === id)) err.push(`${where}: objective "${id}" doesn't exist.`); }
      else if (!has(m, id)) err.push(`${where}: ${kind === "enc" ? "encounter" : kind} "${id}" doesn't exist.`);
    };
    let hasEnd = false;
    const reach = new Set([a.start]);
    for (const [sid, s] of Object.entries(sc)) {
      const where = `Scene "${s.name || sid}"`;
      for (const n of s.cast || []) ref("npc", n, where);
      const lists = [s.onEnter || [], ...(s.options || []).map((o) => o.steps || [])];
      for (const o of s.options || []) { if (!o.label || !o.label.trim()) warn.push(`${where} has an option with no label.`); condRefs(o.if, (k, v) => k === "clue" ? ref("clue", v, where) : k === "obj" ? ref("obj", v, where) : 0); }
      for (const l of lists) GM.walk(l, (st) => {
        if (st.goto) { ref("scene", st.goto, where); reach.add(st.goto); }
        if (st.clue) ref("clue", st.clue, where);
        if (st.objective) ref("obj", st.objective, where);
        if (st.combat) ref("enc", st.combat, where);
        if (st.talk) ref("npc", st.talk.npc, where);
        if (st.end) hasEnd = true;
        if (st.if) condRefs(st.if, (k, v) => k === "clue" ? ref("clue", v, where) : k === "obj" ? ref("obj", v, where) : 0);
        if (st.say === "" || st.aloud === "") warn.push(`${where} has an empty text step.`);
      });
      if (!(s.options || []).length && !GM.hasGoto(s.onEnter)) warn.push(`${where} has no options and no way out.`);
    }
    // reachability
    let grew = true;
    while (grew) { grew = false; for (const id of [...reach]) { const s = sc[id]; if (!s) continue; for (const l of [s.onEnter || [], ...(s.options || []).map((o) => o.steps || [])]) GM.walk(l, (st) => { if (st.goto && !reach.has(st.goto)) { reach.add(st.goto); grew = true; } }); } }
    for (const id of ids) if (!reach.has(id)) warn.push(`Scene "${sc[id].name || id}" can't be reached from the start.`);
    if (!hasEnd) err.push('Nothing ends the adventure. Add an "End the adventure" step somewhere.');
    const prim = (a.objectives || []).filter((o) => o.kind === "primary");
    const doneSet = new Set(); for (const l of GM.allSteps(a)) GM.walk(l, (st) => st.objective && doneSet.add(st.objective));
    for (const o of a.objectives || []) if (!doneSet.has(o.id)) (o.kind === "primary" ? err : warn).push(`Objective "${o.t || o.id}" is never completed by any step.`);
    // encounters + monsters
    for (const [eid, e] of Object.entries(a.encounters || {})) {
      const w = `Encounter "${e.name || eid}"`, zs = new Set((e.zones || []).map((z) => z.id));
      if (!zs.size) err.push(`${w} has no zones.`);
      if (!zs.has(e.start)) err.push(`${w}: the agents' starting zone is missing.`);
      if (!(e.foes || []).length) err.push(`${w} has no foes.`);
      for (const f of e.foes || []) { if (!has(a.enemies, f.t)) err.push(`${w}: monster "${f.t}" doesn't exist.`); if (!zs.has(f.zone)) err.push(`${w}: a foe stands in a zone that doesn't exist.`); }
      // connected?
      const adj = {}; for (const z of zs) adj[z] = [];
      for (const [x, y] of e.edges || []) if (adj[x] && adj[y]) { adj[x].push(y); adj[y].push(x); }
      const seen = new Set([e.start]), q = [e.start];
      while (q.length) for (const n of adj[q.pop()] || []) if (!seen.has(n)) { seen.add(n); q.push(n); }
      if (zs.size && seen.size < zs.size) warn.push(`${w}: some zones can't be reached from the start.`);
      if (!Object.keys(a.encounters).some((k) => Object.values(sc).some((s) => JSON.stringify(s).includes(`"combat":"${k}"`)))) warn.push(`${w} isn't used by any scene.`);
    }
    for (const [mid, m] of Object.entries(a.enemies || {})) {
      if (m.build) {
        const b = ADV.buildMonster(m.build);
        if ((m.build.mods || []).length > b.modsAllowed) warn.push(`Monster "${m.build.name}" has ${(m.build.mods || []).length} modifiers; ${m.build.difficulty} allows ${b.modsAllowed}.`);
        if (!m.build.name) err.push(`Monster "${mid}" needs a name.`);
      }
    }
    if (a.level && a.level[0] > a.level[1]) err.push("Minimum level is higher than maximum level.");
    return { err, warn };
  };
  GM.hasGoto = (steps) => { let f = false; GM.walk(steps, (st) => { if (st.goto || st.end) f = true; }); return f; };

  /* ------------------------------------------------------------ playtest in a throwaway campaign */
  GM.playtest = async (a) => {
    const stash = CAMP.camp;
    const prevTab = CAMP.tab;
    GM.save(a);
    const era = C.eraOf(a.year);
    const ag = a.agencies[0];
    const camp = CAMP.newCampaign({ name: "GM playtest", year: a.year, agency: ag });
    CAMP.playtest = { stash, id: camp.id, advId: a.id, tab: prevTab };
    const mk = (name, ranged, look) => {
      const d = CAMP.blankDraft(); d.name = name; d.look = look; d.coreRank = { body: "specialty", mind: "good", spirit: "mundane" };
      d.aspects = { strength: 4, agility: 3, speed: 2, durability: 1, awareness: 3, iq: 2, charisma: 1, morality: 2, faith: 1 };
      d.bg = "Adrenaline Junkie"; d.bonds.forEach((b, i) => { b.name = "Friend " + (i + 1); b.rel = "friend"; });
      const wt = ranged ? "Ranged One-Handed" : "Melee One-Handed", ban = ranged ? GD.bannedRanged : GD.bannedMelee;
      const mods = GD.weaponMods.map((m) => m.name).filter((m) => !ban.includes(m) && !GD.weaponTypes.some((o) => o.name !== wt && o.only.includes(m))).slice(0, 2);
      d.weapon = { name: ranged ? CAMP.GEAR_HINTS(a.year).ranged.split(",")[0] : CAMP.GEAR_HINTS(a.year).melee.split(",")[0], type: wt, aspect: CAMP.weaponAspects({ type: wt, mods })[0], mods, specialty: GD.weaponSpecialties[0].name };
      d.armor = { name: CAMP.GEAR_HINTS(a.year).armor.split(",")[0], type: GD.armorTypes[0].name, mods: GD.armorMods.slice(0, 2).map((m) => m.name), specialty: GD.armorSpecialties[0].name };
      const ch = CAMP.buildChar(d, a.year, ag);
      for (const id of ["flashlight", "notebook"]) { const as = CAMP.addAsset(ch, { kind: "item", ref: id, name: CAMP.itemName(id, a.year), wc: 1 }); as.committed = true; }
      return ch;
    };
    const L = window.ART.SKIN, A = window.ART;
    camp.chars.push(mk("Tester Gray", true, { skin: L[2], hairC: A.HAIRC[1], hair: "short", outfit: A.OUTFIT[0], extra: "none", bg: "#2b2f3a" }), mk("Tester Rowe", false, { skin: L[1], hairC: A.HAIRC[3], hair: "long", outfit: A.OUTFIT[2], extra: "glasses", bg: "#2b2f3a" }));
    camp.chars.forEach((c) => { c.level = a.level ? a.level[0] : 1; });
    CAMP.save();
    await CAMP.startMission(a.id, camp.chars.map((c) => c.id));
  };
  GM.endPlaytest = () => {
    const p = CAMP.playtest; if (!p) return false;
    CAMP.remove(p.id); CAMP.camp = p.stash; CAMP.playtest = null; CAMP.tab = p.tab;
    return p;
  };

  GM.loadAll();
})();
