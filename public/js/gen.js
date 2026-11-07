/* ============================================================================
   SIDE JOBS — short cases built on the fly.

   GEN.make(seed, campaign) returns an adventure in the normal format (adv.js),
   so it plays, saves, debriefs and feeds the wall like a written case. The
   seed decides everything, so the same job always comes out the same.

   What shapes a job: the campaign's era and agency, the pull of the Beyond
   (higher pull, tougher monster), and open threats on the wall (a follow-up
   job brings that monster back, and solving it closes the file).
   Monsters are built with the book's monster rules (ADV.buildMonster).
   ========================================================================== */
(function () {
  const ADV = window.ADV, CAMP = window.CAMP, C = window.CDATA;
  const GEN = (window.GEN = {});
  const hash = (s) => { let h = 2166136261; for (const ch of String(s)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  const rng = (seed) => { let s = hash(seed) || 1; const next = () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; for (let i = 0; i < 8; i++) next(); return next; };
  const FITS = { Spirit: "haunt", Undead: "haunt", Feral: "beast", Folklore: "missing", Swarm: "swarm", Construct: "machine", Golem: "machine", Beyond: "cult", Divine: "cult", Human: "cult" };

  /* ------------------------------------------------------------ the world by era */
  const ERA = {
    medieval: { towns: ["the village of Haverleigh", "the market town of Saint-Aubin", "the fen hamlet of Wendmere", "the abbey lands at Kirkby Moor"],
      roles: [["Reeve", "m"], ["Alewife", "f"], ["Parish priest", "m"], ["Shepherd", "m"], ["Midwife", "f"], ["Miller's widow", "f"]],
      street: "village", room: "interior", deep: "cellar", wild: "forest", holy: "church", tech: "castle" },
    victorian: { towns: ["Whitechapel", "a Lancashire mill town", "Edinburgh's Old Town", "a Boston boarding-house street"],
      roles: [["Constable", "m"], ["Landlady", "f"], ["Lamplighter", "m"], ["Curate", "m"], ["Washerwoman", "f"], ["Governess", "f"]],
      street: "fog", room: "interior", deep: "cellar", wild: "forest", holy: "church", tech: "lab" },
    wars: { towns: ["a village behind the lines", "the Liverpool docks", "a Kansas farm town", "a blacked-out London street"],
      roles: [["Military policeman", "m"], ["Nurse", "f"], ["Farmer's widow", "f"], ["Air raid warden", "m"], ["Chaplain", "m"], ["Telephone girl", "f"]],
      street: "street", room: "interior", deep: "cellar", wild: "trench", holy: "church", tech: "lab" },
    atomic: { towns: ["a brand-new suburb", "a desert test town", "a motel strip on Route 66", "a Tokyo backstreet"],
      roles: [["Sheriff's deputy", "m"], ["Housewife", "f"], ["Night clerk", "m"], ["Radio ham", "m"], ["Waitress", "f"], ["Schoolteacher", "f"]],
      street: "drive", room: "interior", deep: "cellar", wild: "desert", holy: "church", tech: "lab" },
    modern: { towns: ["a council estate", "an out-of-town retail park", "a college campus", "a ferry port"],
      roles: [["Community officer", "f"], ["Security guard", "m"], ["Student", "f"], ["Night nurse", "f"], ["Taxi driver", "m"], ["Caretaker", "m"]],
      street: "modern", room: "interior", deep: "cellar", wild: "forest", holy: "church", tech: "lab" },
    now: { towns: ["a smart-city district", "a data-centre town", "a high-rise estate", "a container port"],
      roles: [["Drone pilot", "m"], ["Delivery rider", "m"], ["Facility manager", "f"], ["Night nurse", "f"], ["Streamer", "f"], ["Security contractor", "m"]],
      street: "future", room: "modern", deep: "cellar", wild: "forest", holy: "church", tech: "lab" }
  };

  /* ------------------------------------------------------------ job shapes */
  const ADJ = ["Hollow", "Quiet", "Pale", "Patient", "Smiling", "Grey", "Weeping", "Hungry", "Kind", "Thin"];
  const HOOKS = [
    { id: "missing", title: ["The {Adj} Lodger", "Nobody Came Home", "The Empty Rooms"], types: ["Folklore", "Spirit", "Beyond"],
      villain: ["The {Adj} Lodger", "The {Adj} Neighbour", "The {Adj} Caller"], minion: "Taken guest",
      hook: "People in {town} are going missing from their own homes. Doors locked from the inside, beds still warm.",
      site: ["the last house it happened in", "room", "The bed is made. The tea is cold. The door was bolted from inside, and the bolt is rusted shut."],
      lair: ["the room that shouldn't be there", "deep", "A door you didn't see on the way in. Behind it, a room furnished with other people's things."],
      clue1: "Every one of them took in a lodger in the week before they vanished.", clue2: "The missing all heard knocking from inside the walls at the same hour.", weak: "It can only come in when it is invited. Say the words that send a guest away." },
    { id: "haunt", title: ["The House on {Street}", "Something in the Walls", "The {Adj} Tenant"], types: ["Spirit", "Undead"],
      villain: ["The {Adj} Tenant", "The {Adj} Lady", "The Man in the Wallpaper"], minion: "Echo",
      hook: "A building in {town} won't stay empty. Every family that moves in leaves within a week, if they leave at all.",
      site: ["the front parlour", "room", "Furniture under dust sheets. One chair is uncovered, facing the wall, and the dust on its seat is disturbed."],
      lair: ["the sealed attic", "room", "Nails on the inside of the hatch. Somebody up here wanted to keep something in, or somebody out."],
      clue1: "The first owner died in the house and was never buried; the grave in the churchyard is empty.", clue2: "The haunting always starts at the same room and spreads outward, a little further each night.", weak: "Its name, spoken aloud in the room where it died, pins it in place." },
    { id: "beast", title: ["The {Adj} Hound", "Tracks at the Edge of Town", "What Took the Flock"], types: ["Feral", "Folklore"],
      villain: ["The {Adj} Hound", "The Thing in the Hedges", "The {Adj} Stag"], minion: "Wild dog",
      hook: "Livestock torn open on the outskirts of {town}. Last night it was a man, and the tracks walked upright for the last few yards.",
      site: ["the killing field", "wild", "Trampled ground, a broken fence, and tracks that change halfway across the field."],
      lair: ["the den", "wild", "Bones sorted into neat piles by size. Whatever lives here likes things tidy."],
      clue1: "It only hunts on nights when the church bell is silent.", clue2: "The tracks lead to the same place every time, and they always come back.", weak: "It flinches from cold iron. A horseshoe nailed over the den's mouth will slow it." },
    { id: "cult", title: ["The {Adj} Congregation", "Night Meetings", "The Society of the {Adj} Hour"], types: ["Beyond", "Divine"],
      villain: ["The {Adj} Saint", "The Speaker Below", "The {Adj} Choir"], minion: "Congregant",
      hook: "A new society meets after dark in {town}. Its members are happier than they have any right to be, and they keep recruiting.",
      site: ["the meeting hall", "holy", "Chairs in a circle, facing inward. In the middle, a stain that someone has scrubbed and scrubbed."],
      lair: ["the room below the hall", "deep", "Candles, a congregation on its knees, and something they are feeding."],
      clue1: "Every new member gave something up: a name, a memory, a child's birthday.", clue2: "The hymns are the same tune played backward, and the words are a set of directions.", weak: "Break the circle and the thing in the middle loses its hold on the faithful." },
    { id: "swarm", title: ["The {Adj} Plague", "Something in the Drains", "The Itch"], types: ["Swarm", "Undead"],
      villain: ["The {Adj} Swarm", "The Mother of Flies", "The Thing Under the Market"], minion: "Crawling mass",
      hook: "Rats, then flies, then worse. Something under {town} is breeding, and the people who go down to look come back wrong.",
      site: ["the market cellars", "deep", "Sacks gnawed open from the inside. The walls are moving, very slightly."],
      lair: ["the nest", "deep", "A chamber of packed earth and old bones, humming like a hive."],
      clue1: "The swarm moves as one, and it always retreats toward the same street.", clue2: "There is something at the centre that the swarm is protecting.", weak: "Fire and smoke drive the swarm back from its heart." },
    { id: "machine", title: ["The {Adj} Engine", "Clockwork Hearts", "The Machine That Runs Itself"], types: ["Construct", "Golem"], from: 1850,
      villain: ["The {Adj} Engine", "The Automaton", "The Iron Foreman"], minion: "Spare part",
      hook: "A machine in {town} keeps working after it is switched off. Last week it started building something.",
      site: ["the workshop", "tech", "Tools laid out in perfect order, every one of them still warm."],
      lair: ["the engine room", "tech", "Pistons, wire and a shape at the centre that is almost, but not quite, a person."],
      clue1: "Every worker who touched it dreamed of the same blueprint.", clue2: "It is missing one part, and it has been trying to make it out of people.", weak: "Its heart is the oldest part. Jam it and the rest of it stutters." }
  ];
  const SPRITE = { Spirit: "spirit", Undead: "undead", Feral: "beast", Folklore: "beast", Swarm: "swarm", Construct: "construct", Golem: "construct", Beyond: "beyond", Divine: "beyond", Human: "humanoid" };
  const MODS = { Spirit: ["Ethereal", "Psychological Attacks", "Elusive"], Undead: ["Vengeful", "Bloodthirsty"], Feral: ["Quick", "Vicious", "Nimble"], Folklore: ["Disguised", "Mimic", "Elusive"],
    Swarm: ["Toxic", "Small"], Construct: ["Thick Skin", "Tanky"], Golem: ["Large"], Beyond: ["Unimaginable Horror", "Nightmare", "Void"], Divine: ["Radiance", "Leader"], Human: ["Leader"] };
  const DTYPE = { Spirit: "sanity", Beyond: "sanity", Divine: "stability", Folklore: "stability" };

  /* ------------------------------------------------------------ building one job */
  GEN.make = (seed, c, opts = {}) => {
    const R = rng(seed), pick = (xs) => xs[Math.floor(R() * xs.length)];
    const era = C.eraOf(c.year), E = ERA[era.id] || ERA.modern, w = (window.WORLD && WORLD.ensure(c)) || { pull: 2, threats: [] };
    const hooks = HOOKS.filter((h) => !h.from || c.year >= h.from);
    const threat0 = opts.threat || null;
    const tSrc = threat0 && ADV.LIBRARY[threat0.adv], tBuild = tSrc && Object.values(tSrc.enemies || {}).map((e) => e.build).find((b) => b && b.name === threat0.name);
    /* the board's jobs share one base number and step through hooks and towns from it, so the three never repeat */
    const base = opts.base != null ? opts.base : Math.floor(R() * 1000), slot = opts.slot || 0;
    const H = (tBuild && hooks.find((h) => h.id === FITS[tBuild.type])) || hooks[(base + slot) % hooks.length];
    const town = E.towns[(base + slot) % E.towns.length], adj = ADJ[(base * 7 + slot * 3) % ADJ.length];
    const fillT = (s) => s.replace(/\{Adj\}/g, adj).replace(/\{town\}/g, town).replace(/\{Town\}/g, town.replace(/^(the |a |an )/i, "").replace(/^\w/, (m) => m.toUpperCase())).replace(/\{Street\}/g, pick(["Mercer Street", "Ash Lane", "Chapel Row", "the Hill"]));
    const pull = w.pull || 0, diff = pull >= 7 ? "dangerous" : pull >= 4 ? "challenging" : "medium";
    const threat = opts.threat || null;
    /* the monster: the book's builder, or the open threat's own build */
    let boss;
    if (threat) {
      const src = ADV.LIBRARY[threat.adv], list = Object.values((src && src.enemies) || {}).map((e) => e.build).filter(Boolean);
      boss = list.find((b) => b.name === threat.name) || null;
      if (boss) boss = { ...JSON.parse(JSON.stringify(boss)), difficulty: diff === "medium" ? "challenging" : diff };
    }
    if (!boss) {
      const type = pick(H.types);
      boss = { name: fillT(pick(H.villain)), type, difficulty: diff, sprite: SPRITE[type] || "beyond", hue: Math.floor(R() * 360), dtype: DTYPE[type] || "health",
        mods: [pick(MODS[type] || ["Elusive"])], dies: "comes apart, and the air in the room changes" };
    }
    const minion = { name: H.minion, type: boss.type === "Swarm" ? "Swarm" : boss.type === "Construct" || boss.type === "Golem" ? "Construct" : "Human", difficulty: "easy",
      sprite: boss.type === "Swarm" ? "swarm" : boss.type === "Construct" || boss.type === "Golem" ? "construct" : "humanoid", hue: boss.hue || 0, attack: 0, dies: "goes still" };
    /* people */
    const [role, sex] = pick(E.roles), [role2, sex2] = pick(E.roles.filter((r) => r[0] !== role));
    const nm = () => (CAMP.rollName ? CAMP.rollName() : "A local");
    const wit = { name: nm(), tag: role, look: `${role}. Has been waiting a long time for someone to take this seriously.`, face: { sex } };
    const surv = { name: nm(), tag: `${role2}, still missing`, look: `${sex2 === "f" ? "She" : "He"} is the last one taken, and the only one who might still be alive.`, face: { sex: sex2 } };
    const T = (k) => E[k] || "interior";
    const title = threat ? `${threat.name} Returns` : fillT(pick(H.title));
    const id = "gen-" + hash(seed).toString(36);
    const asp = (xs) => pick(xs);
    const a1 = asp(["awareness", "iq"]), a2 = asp(["awareness", "iq", "occult"]), a3 = asp(["occult", "faith", "willpower"]);
    /* the writing for this kind of job, with this job's names filled in */
    const TX = ((window.GEN_TEXT || {}).hooks || {})[H.id] || {};
    const src = pick(((window.GEN_TEXT || {}).sources || {})[era.id] || ["the town's records"]);
    const pr = sex2 === "f" ? { sp: "she", op: "her", pp: "her" } : { sp: "he", op: "him", pp: "his" };
    const cap1 = (t) => t.replace(/(^|[.!?]\s+)([a-z])/g, (m, p1, c1) => p1 + c1.toUpperCase());
    const fillS = (t) => cap1(fillT(String(t)).replace(/\{wit\}/g, wit.name).replace(/\{witFirst\}/g, wit.name.split(" ")[0]).replace(/\{role\}/g, role)
      .replace(/\{surv\}/g, surv.name).replace(/\{survFirst\}/g, surv.name.split(" ")[0]).replace(/\{sp\}/g, pr.sp).replace(/\{op\}/g, pr.op).replace(/\{pp\}/g, pr.pp)
      .replace(/\{villain\}/g, boss.name).replace(/\{src\}/g, src).replace(/\{Src\}/g, src.replace(/^\w/, (m) => m.toUpperCase())));
    const deep = (x) => (typeof x === "string" ? fillS(x) : Array.isArray(x) ? x.map(deep) : x && typeof x === "object" ? Object.fromEntries(Object.entries(x).map(([k, v]) => [k, deep(v)])) : x);
    /* a line of writing as a story step: plain text is narration, {npc,text} is someone speaking, {you} is your agent */
    const step = (l) => (typeof l === "string" ? { say: fillS(l) } : l.npc ? { talk: { npc: l.npc, text: fillS(l.text) } } : l.you ? { say: `<i>You:</i> “${fillS(l.you)}”` } : l.say ? { say: fillS(l.say) } : l);
    const steps = (ls) => (ls || []).map(step);
    const speech = (TX.speech || []).map((l) => (typeof l === "string" ? { say: `<b>${boss.name}:</b> “${fillS(l)}”` } : step(l)));
    const hookText = threat ? `${threat.name}, the thing you failed to stop in ${threat.case}, has surfaced in ${town}. The same signs as before, and worse.` : fillT(H.hook);
    const site = TX.site || H.site, lair = TX.lair || H.lair;
    const clueText = (k, d) => fillS((TX.clues || {})[k] || d);
    const topics = (TX.topics || []).map((t) => ({ ask: fillS(t.ask), lines: deep(t.lines), then: t.clue ? [{ clue: t.clue }] : [] }));
    if (!topics.some((t) => t.then.length) && topics.length) topics[0].then = [{ clue: "c1" }];
    return {
      id, title, generated: true, seed, closes: threat ? threat.id : null,
      setting: `${town.replace(/^\w/, (m) => m.toUpperCase())} · ${c.year}`, year: c.year, level: [1, 6], agencies: [c.agency],
      summary: hookText,
      objectives: [
        { id: "po1", kind: "primary", t: "Find out what is behind it", done: "You know what you are dealing with, and where it lives." },
        { id: "po2", kind: "primary", t: `Stop ${boss.name}`, done: `${boss.name} is finished.` },
        { id: "so1", kind: "secondary", t: `Get ${surv.name} out alive`, done: `${surv.name} walks out with you.` }],
      clues: {
        c1: { t: "What the witness told you", s: wit.name, x: clueText("c1", H.clue1) },
        c2: { t: "What the place told you", s: site[0], x: clueText("c2", H.clue2) },
        c3: { t: "What the old records say", s: src, x: clueText("c3", H.weak) } },
      npcs: { wit, surv },
      enemies: { boss: { build: boss }, min: { build: minion } },
      encounters: { fight: { name: lair[0].replace(/^\w/, (m) => m.toUpperCase()), theme: T(lair[1]), fightText: `${boss.name} rises to meet you.`,
        zones: [{ id: "a", name: "The way in", col: 0, row: 0 }, { id: "b", name: "Halfway", col: 1, row: 0 }, { id: "c", name: "The heart of it", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "boss", zone: "c" }, { t: "min", zone: "b" }, { t: "min", zone: "b", name: `${minion.name} (2)` }] } },
      start: "arrive",
      scenes: {
        arrive: { name: town.replace(/^\w/, (m) => m.toUpperCase()), theme: T("street"), mood: "calm", cast: ["wit"],
          onEnter: [{ once: "intro", steps: [...(threat ? [{ say: hookText }] : []), ...steps(TX.arrive || [hookText])] }],
          options: [
            { label: `Talk to ${wit.name}`, hint: `${role}. They sent for you`, steps: [{ converse: { npc: "wit", id: "main", open: deep(TX.open || []), again: `Ask me anything. I've had a lot of time to think about it.`, topics, bye: deep(TX.bye || []) } }] },
            { label: "Look into the history of the place", hint: `Read ${src}`, once: true, steps: [{ check: { aspect: a3 === "faith" ? "iq" : a3, cr: "medium", label: `Search ${src}`, investigate: true,
              ok: [...steps(TX.doc || [H.weak]), { clue: "c3" }, { set: "weak" }],
              fail: steps(TX.docFail || ["Dead ends and mouldy pages. Whatever this is, nobody wrote it down properly."]) } }] },
            { label: `Go to ${site[0]}`, steps: [{ goto: "site" }] }] },
        site: { name: site[0].replace(/^\w/, (m) => m.toUpperCase()), theme: T(site[1]), mood: "tense", lighting: "shadow",
          onEnter: [{ once: "site", steps: steps(Array.isArray(site[2]) ? site[2] : [site[2]]) }],
          options: [
            { label: "Search it properly", hint: "Every room, every corner", once: true, steps: [{ check: { aspect: a1, cr: diff === "medium" ? "medium" : "challenging", label: "Read the scene", investigate: true,
              ok: [...steps(TX.searchOk || [H.clue2]), { clue: "c2" }, { objective: "po1" }],
              fail: [...steps(TX.searchFail || ["Something here notices you looking."]), { damage: { pool: "sanity", amount: 4 } }, { clue: "c2" }, { objective: "po1" }] } }] },
            { label: `Find ${surv.name}`, hint: "The last one taken", if: { clue: "c2" }, once: true, steps: [{ check: { aspect: a2, cr: "medium", label: `Follow ${surv.name}'s trail`,
              ok: [...steps(TX.survOk || [`${surv.name} is alive.`]), { objective: "so1" }],
              fail: steps(TX.survFail || [`You hear ${surv.name} calling, always one room away.`]) } }] },
            { label: `Go to ${lair[0]}`, if: { clue: "c2" }, steps: [{ goto: "lair" }] },
            { label: "Back to town", steps: [{ goto: "arrive" }] }] },
        lair: { name: lair[0].replace(/^\w/, (m) => m.toUpperCase()), theme: T(lair[1]), mood: "boss", lighting: "shadow",
          onEnter: [{ once: "lairIn", steps: [...steps(Array.isArray(lair[2]) ? lair[2] : [lair[2]]), ...speech] }],
          options: [
            { label: "Use what you learned about it", hint: "What the old records said", if: "weak", once: true, steps: [{ check: { aspect: a3, cr: "medium", label: "Turn its weakness against it",
              ok: [...steps(TX.weakOk || ["For the first time, it is the one that's afraid."]), { set: "shaken" }], fail: steps(TX.weakFail || ["It knows you're here now."]) } }] },
            { label: `Face ${boss.name}`, steps: [{ combat: "fight", surpriseIf: "shaken", win: [
              { say: `${boss.name} ${boss.dies || "is gone"}.` }, ...steps(TX.win || []), { objective: "po2" }, { end: "win" }] }] },
            { label: "Fall back for now", steps: [{ goto: "site" }] }] }
      }
    };
  };

  /* ------------------------------------------------------------ the board's three side jobs */
  GEN.jobs = (c = CAMP.camp) => {
    const w = (window.WORLD && WORLD.ensure(c)) || { threats: [] };
    c.genSeeds = c.genSeeds || {};
    const out = [];
    for (let i = 0; i < 3; i++) {
      const seed = `${c.id}:${c.missionsDone || 0}:${i}`;
      const threat = i === 0 && w.threats.length ? w.threats[0] : null;
      const base = hash(`${c.id}:${c.missionsDone || 0}`) % 997;
      const a = GEN.make(seed, c, { threat, slot: i, base });
      c.genSeeds[a.id] = { seed, threat: threat ? { ...threat } : null, slot: i, base };
      ADV.register(a);
      out.push(a);
    }
    const keep = Object.entries(c.genSeeds).slice(-24); c.genSeeds = Object.fromEntries(keep);
    return out;
  };
  /* re-register jobs a saved campaign knows about, so a job in progress can be resumed */
  GEN.restore = (c) => { for (const [, v] of Object.entries(c.genSeeds || {})) { try { ADV.register(GEN.make(v.seed, c, { threat: v.threat, slot: v.slot, base: v.base })); } catch (e) {} } };
  const migrate0 = CAMP.migrate;
  CAMP.migrate = (c) => { migrate0(c); GEN.restore(c); };

  /* written cases stay on the main board; side jobs get their own row */
  const advList0 = CAMP.advList;
  CAMP.advList = () => advList0().filter((m) => !String(m.id).startsWith("gen-"));
  const all0 = CAMP.allAdventures;
  CAMP.allAdventures = () => all0().filter((m) => !String(m.id).startsWith("gen-") || (CAMP.camp && CAMP.camp.genSeeds && CAMP.camp.genSeeds[m.id]));

  const ui = CAMP.ui, U = window.UI, el = U.el;
  if (ui.tabs && ui.tabs.missions) {
    const m0 = ui.tabs.missions;
    ui.tabs.missions = function () {
      const box = m0.apply(this, arguments), c = CAMP.camp;
      try {
        const jobs = GEN.jobs(c);
        CAMP.save();
        const grid = el("div", { class: "cardgrid" }, ...jobs.map((a) => el("button", { class: "mcard gen", onclick: () => { U.click(); if (!CAMP.active().length) return U.toast("You need an active agent."); ui.briefing(a.id); } },
          el("img", { src: U.img(window.ART.scene(a.scenes.arrive.theme, a.id)), alt: "" }),
          el("div", { class: "etxt" }, el("b", {}, a.title), el("span", { class: "mono" }, `${a.setting} · side job${a.closes ? " · open threat" : ""}`), el("small", {}, a.summary)))));
        const head = el("h3", { class: "sect" }, "Side jobs");
        const sub = el("p", { class: "cnote" }, "Short cases built from this period, the agency's files and what's on the wall. New ones come in after every case. A follow-up on an open threat closes the file when solved.");
        box.append(head, sub, grid);
      } catch (e) { console.warn("side jobs", e); }
      return box;
    };
  }
})();
