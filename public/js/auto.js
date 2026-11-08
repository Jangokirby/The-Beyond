/* ============================================================================
   Auto-roll: agents, bonds and monsters.
   Everything rolled here goes through the same rules checks as hand-made choices
   (CAMP.draftErrors, CAMP.weaponValid, the monster builder), so a rolled agent
   or monster is always legal.
   ========================================================================== */
(function () {
  const R = window.R, GD = window.GD, C = window.CDATA, CAMP = window.CAMP, ADV = window.ADV, ART = window.ART;
  const rnd = () => R.rand();
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const shuffle = (a) => { const o = a.slice(); for (let i = o.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [o[i], o[j]] = [o[j], o[i]]; } return o; };
  const roll = (n) => 1 + Math.floor(rnd() * n);

  /* ---------------------------------------------------------------- names and people */
  const FIRST = ["Arthur", "Mei", "Tomás", "Ingrid", "Kofi", "Yuki", "Rafael", "Nadia", "Elias", "Priya", "Marcus", "Sofia", "Hiroshi", "Amara", "Viktor", "Leila", "Declan", "Ana", "Jamal", "Freya", "Dmitri", "Chen", "Isabel", "Omar", "Maeve", "Takeshi", "Zora", "Nils", "Camille", "Gideon", "Soo-jin", "Ezekiel", "Rosa", "Anders", "Imani", "Pavel", "Clara", "Idris", "Wren", "Luca"];
  const LAST = ["Blackwell", "Okafor", "Tanaka", "Moreau", "Ivanov", "Reyes", "Lindqvist", "Hale", "Nakamura", "Abara", "Kowalski", "Costa", "Whitlock", "Park", "Haddad", "Sinclair", "Mbeki", "Fontaine", "Duarte", "Varga", "Oyelaran", "Ward", "Petrov", "Yamada", "Quinn", "Salazar", "Brandt", "Achebe", "Lowe", "Ferrari", "Morrow", "Kim", "Abbott", "Delacroix", "Navarro", "Strand"];
  const RELS = ["Mother", "Father", "Sister", "Brother", "Old friend from school", "Fellow agent who covers for you", "Mentor who trained you", "Partner or spouse", "Childhood neighbour", "Landlady", "Priest or confessor", "Ex-lover you never got over", "Cousin who writes to you", "Bartender who listens", "Doctor who patched you up", "Informant you trust", "Best friend", "Grandmother", "Rival turned friend", "Child you don't see enough", "Old army buddy", "Teacher who believed in you"];
  const BIO_OPEN = ["Something happened that the official report never mentioned.", "A case went wrong, and they were the only one who saw why.", "They answered an ad they should have ignored.", "They saw something once, and no one has believed them since.", "Someone close to them vanished, and the Beyond was the only lead."];

  /* names follow where a person is from and their gender (js/people.js); with no origin, anywhere */
  const P = () => window.PEOPLE;
  CAMP.rollName = (origin, sex) => (P() ? P().name(origin, sex) : `${pick(FIRST)} ${pick(LAST)}`);
  /* a bond is usually from the agent's own world: family share the surname */
  const bondName = (d, rel) => {
    if (!P()) return pick(FIRST) + (rnd() < 0.5 ? " " + pick(LAST) : "");
    const fam = /\b(mother|father|sister|brother|cousin|aunt|uncle|grand\w*|child|son|daughter)\b/i.test(rel || "");
    const home = d && d.origin && (fam || rnd() < 0.7) ? d.origin : P().randomOrigin();
    const sex = /mother|sister|aunt|daughter|grandmother|landlady|wife/i.test(rel || "") ? "f" : /father|brother|uncle|son\b|grandfather|husband/i.test(rel || "") ? "m" : "";
    const first = P().first(home, sex);
    if (fam && d && d.name && d.name.trim().includes(" ")) return `${first} ${d.name.trim().split(/\s+/).slice(1).join(" ")}`;
    return rnd() < 0.5 ? `${first} ${P().last(home)}` : first;
  };
  CAMP.rollBond = (b, keepName, d) => {
    b.rel = pick(RELS);
    if (!keepName || !b.name.trim()) b.name = bondName(d, b.rel);
    return b;
  };
  CAMP.rollBonds = (d, keepNames) => {
    const rels = shuffle(RELS).slice(0, 3);
    d.bonds.forEach((b, i) => { b.rel = rels[i]; if (!keepNames || !b.name.trim()) b.name = bondName(d, b.rel); });
    return d;
  };
  CAMP.rollLook = (d) => {
    if (P() && !d.origin) d.origin = P().randomOrigin();
    if (!d.sex) d.sex = rnd() < 0.5 ? "f" : "m";
    d.look.skin = P() ? P().skinFor(d.origin) : pick(ART.SKIN); d.look.hairC = pick(ART.HAIRC); d.look.outfit = pick(ART.OUTFIT); d.look.hair = pick(ART.HAIRS);
    d.look.extra = rnd() < 0.55 ? "none" : pick(ART.EXTRAS); d.look.clothes = pick(ART.CLOTHES); d.look.bg = pick(ART.BGS);
    d.look.face = pick(ART.FACES); d.look.eyes = pick(ART.EYES); d.look.eyeC = pick(ART.EYEC); d.look.brows = pick(ART.BROWS); d.look.nose = pick(ART.NOSES); d.look.mouth = pick(ART.MOUTHS);
    d.look.facial = d.sex === "f" || rnd() < 0.7 ? "none" : pick(ART.FACIAL); d.look.marks = rnd() < 0.6 ? "none" : pick(ART.MARKS);
    return d;
  };

  /* ---------------------------------------------------------------- Core Stats and Aspects */
  CAMP.rollAspects = (d) => {
    const ranks = shuffle(["specialty", "good", "mundane"]);
    d.coreRank = { body: ranks[0], mind: ranks[1], spirit: ranks[2] };
    d.aspects = {};
    for (const k of ["body", "mind", "spirit"]) {
      const keys = shuffle(C.ASPECTS[k]);
      CAMP.aspectSlots(d.coreRank[k]).forEach((v, i) => { d.aspects[keys[i]] = v; });
    }
    return d;
  };

  /* ---------------------------------------------------------------- background */
  CAMP.rollBackground = (d) => {
    const bg = pick(C.BACKGROUNDS);
    d.bg = bg.id;
    if (bg.core === "choice") d.bgCore = pick(["body", "mind", "spirit"]);
    if (bg.core === "choice2") d.bgBody = pick(["body", "mind"]);
    if (bg.aspectPlus) d.bgAspect = pick(Object.keys(C.ASPECT_NAMES));
    if (bg.artifact) d.pickArtifact = pick(GD.artifacts).name;
    if (bg.patron) d.pickPatron = pick(GD.deities).name;
    return d;
  };

  /* ---------------------------------------------------------------- gear */
  const fillPicks = (item, which, mods, spec) => {
    item.picks = {};
    for (const k of window.GEAR.pickKeys(which, mods, spec)) { const o = window.GEAR.PICKS[which][k].opts(); item.picks[k] = pick(o); }
  };
  CAMP.rollGear = (d) => {
    const w = d.weapon;
    for (let tries = 0; tries < 80; tries++) {
      w.type = pick(GD.weaponTypes).name;
      w.mods = shuffle(GD.weaponMods.map((m) => m.name)).slice(0, 2);
      if (!CAMP.weaponValid({ name: "x", type: w.type, mods: w.mods, specialty: "x" }).length) break;
    }
    w.specialty = pick(GD.weaponSpecialties).name;
    w.aspect = pick(CAMP.weaponAspects(w, d.aspects));
    fillPicks(w, "w", w.mods, w.specialty);
    w.name = `${w.mods[0]} ${w.type.replace(/ One-Handed| Two-Handed/, "").toLowerCase()}`.replace(/^./, (x) => x.toUpperCase());
    const ar = d.armor;
    ar.type = pick(GD.armorTypes).name;
    ar.mods = shuffle(GD.armorMods.map((m) => m.name)).slice(0, 2);
    ar.specialty = pick(GD.armorSpecialties).name;
    fillPicks(ar, "a", ar.mods, ar.specialty);
    ar.name = `${ar.mods[0]} ${pick(["coat", "jacket", "vest", "cloak", "duster", "plates"])}`;
    return d;
  };

  /* a whole agent, legal on the first try (retries until draftErrors is empty) */
  CAMP.rollDraft = (d) => {
    d = d || CAMP.blankDraft();
    for (let tries = 0; tries < 60; tries++) {
      d.age = 20 + roll(30) + roll(10);
      CAMP.rollLook(d);
      d.name = CAMP.rollName(d.origin, d.sex); CAMP.rollAspects(d); CAMP.rollBackground(d);
      d.magic = { on: false, source: pick(["faith", "occult", "ancient"]) };
      const bg = CAMP.bgDef(d.bg);
      if (bg && bg.words) d.magic.on = true;
      else if ((d.aspects.occult || d.aspects.faith || d.aspects.ancient) && rnd() < 0.7) d.magic.on = true;
      if (d.magic.on) { const best = ["faith", "occult", "ancient"].sort((x, y) => (d.aspects[y] || 0) - (d.aspects[x] || 0))[0]; if (d.aspects[best]) d.magic.source = best; }
      CAMP.rollBonds(d);
      CAMP.rollGear(d);
      d.bio = `${pick(BIO_OPEN)} ${d.name.split(" ")[0]} came to the work as a ${d.bg.toLowerCase()}.`;
      if (!CAMP.draftErrors(d).length) return d;
    }
    return d;
  };

  /* ---------------------------------------------------------------- monsters */
  const ADJ = { Human: ["Hollow", "Silent", "Hired", "Grinning", "Debt-ridden"], Undead: ["Gaunt", "Restless", "Shambling", "Grave-cold", "Patient"], Spirit: ["Weeping", "Pale", "Whispering", "Bound", "Lingering"],
    Feral: ["Starved", "Matted", "Slavering", "Scarred", "Night"], Folklore: ["Old", "Hungry", "Crossroads", "Hollow-hill", "Bargaining"], Golem: ["Cracked", "Stone", "Clockwork", "Rust-eaten", "Patchwork"],
    Beyond: ["Folded", "Unlit", "Many-edged", "Tide-of", "Wrong"], Construct: ["Humming", "Rigged", "Watching", "Welded", "Obedient"], Divine: ["Radiant", "Unforgiving", "Chosen", "Burning", "Silent"], Swarm: ["Crawling", "Chittering", "Black", "Endless", "Gnawing"] };
  const NOUN = { Human: ["Cultist", "Enforcer", "Gunman", "Deacon", "Smuggler"], Undead: ["Ghoul", "Revenant", "Wight", "Feaster", "Walker"], Spirit: ["Shade", "Lantern-Ghost", "Widow", "Echo", "Presence"],
    Feral: ["Hound", "Stalker", "Boar", "Crawler", "Hunter"], Folklore: ["Hag", "Troll", "Changeling", "Wendigo", "Redcap"], Golem: ["Sentinel", "Guardian", "Puppet", "Statue", "Colossus"],
    Beyond: ["Thing", "Herald", "Mouth", "Geometry", "Gaze"], Construct: ["Engine", "Warden", "Mirror", "Door", "Automaton"], Divine: ["Angel", "Messenger", "Judge", "Idol", "Seraph"], Swarm: ["Swarm", "Plague", "Tide", "Cloud", "Horde"] };
  const SPRITE = { Human: "humanoid", Undead: "undead", Spirit: "spirit", Feral: "beast", Folklore: "beast", Golem: "construct", Beyond: "beyond", Construct: "construct", Divine: "spirit", Swarm: "swarm" };
  const DTYPE = { Human: ["health"], Undead: ["health", "sanity"], Spirit: ["stability", "sanity"], Feral: ["health"], Folklore: ["health", "sanity", "stability"], Golem: ["health"], Beyond: ["sanity", "stability"], Construct: ["health", "stability"], Divine: ["stability"], Swarm: ["health"] };
  const PARAMS = { "Aura of Damage": ["health", "sanity", "stability"], "Deadly": ["bleeding", "burning", "poisoned", "frozen", "crippled", "terrified", "stun"], "Toxic": ["bleeding", "burning", "poisoned", "frozen", "crippled", "terrified", "stun"] };
  const NOROLL = new Set(["Death Mark", "God-Like", "Rage"]);   // too swingy to hand out blindly
  const STACKABLE = new Set(["Nimble", "Thick Skin", "Steel Mind", "Quick", "Tanky", "Vicious"]);

  /* the modifiers for an existing build: as many as the difficulty allows */
  ADV.rollMods = (b) => {
    const allowed = ADV.buildMonster({ ...b, mods: [] }).modsAllowed;
    const names = shuffle(GD.monsterMods.map((m) => m.name).filter((n) => !NOROLL.has(n)));
    const out = [];
    for (const n of names) {
      if (out.length >= allowed) break;
      out.push(PARAMS[n] ? `${n}:${pick(PARAMS[n])}` : n);
      if (STACKABLE.has(n) && out.length < allowed && rnd() < 0.25) out.push(n);
    }
    b.mods = out;
    return b;
  };
  ADV.rollMonster = (o = {}) => {
    const type = o.type || pick(Object.keys(ADV.MB.TYPES));
    const difficulty = o.difficulty || pick(["easy", "medium", "medium", "challenging", "dangerous"]);
    const b = { name: `${pick(ADJ[type] || ADJ.Beyond)} ${pick(NOUN[type] || NOUN.Beyond)}`, type, difficulty, sprite: SPRITE[type] || "beast", hue: roll(360) - 1, dtype: pick(DTYPE[type] || ["health"]), range: rnd() < 0.2 ? 1 : 0, mods: [], text: "" };
    ADV.rollMods(b);
    return b;
  };
})();
