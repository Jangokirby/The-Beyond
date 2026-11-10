/* ============================================================================
   THE BEYOND RPG — rules engine (dice, stats, checks, magic, injuries)
   Mirrors the PREVIEW rulebook. Numbers that a GM might want to change are
   gathered at the top.
   ========================================================================== */
(function () {
  const R = {};

  /* Challenge Ratings. The rulebook (2025 layout, "Challenge Ratings"): Easy 7, Medium 10,
     Challenging 14, Dangerous 18, Hopeless 20. An older draft used 5/8/12/16; it stays
     available in Settings for tables that started with it ("rulebook" is that old key). */
  R.CR_SCALE = "module";
  R.CR_TABLES = {
    module:   { easy: 7, medium: 10, challenging: 14, dangerous: 18, hopeless: 20 },
    rulebook: { easy: 5, medium: 8, challenging: 12, dangerous: 16, hopeless: 18 }
  };
  R.cr = (name) => (typeof name === "number" ? name : R.CR_TABLES[R.CR_SCALE][name]);
  R.crName = (n) => {
    const t = R.CR_TABLES[R.CR_SCALE];
    if (n >= t.dangerous) return "Dangerous";
    if (n >= t.challenging) return "Challenging";
    if (n >= t.medium) return "Medium";
    return "Easy";
  };
  /* A roll that meets the CR or ER succeeds (the rulebook's interview table and
     its Accurate example both count a tie as a success). */
  R.TIE_SUCCEEDS = true;
  R.SITUATIONAL = 2;
  R.SHADOW_PENALTY = 2;
  R.BLIND_PENALTY = 4;

  /* ---------------------------------------------------------------- dice */
  let seed = null;
  R.setSeed = (s) => { seed = s; };
  R.rand = () => {
    if (seed === null) return Math.random();
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  R.d6 = () => 1 + Math.floor(R.rand() * 6);
  R.roll2d6 = () => [R.d6(), R.d6()];
  R.meets = (total, target) => (R.TIE_SUCCEEDS ? total >= target : total > target);

  /* ---------------------------------------------------------------- aspects */
  R.ASPECTS = {
    body: ["strength", "agility", "speed", "durability", "humors"],
    mind: ["charisma", "iq", "awareness", "willpower", "mindfulness"],
    spirit: ["occult", "faith", "ancient", "potency", "morality"]
  };
  R.ASPECT_LABEL = {
    strength: "Strength", agility: "Agility", speed: "Speed", durability: "Durability", humors: "Humors",
    charisma: "Charisma", iq: "IQ", awareness: "Awareness", willpower: "Willpower", mindfulness: "Mindfulness",
    occult: "Occult", faith: "Faith", ancient: "Ancient", potency: "Potency", morality: "Morality"
  };
  R.POOL_LABEL = { health: "Health", sanity: "Sanity", stability: "Stability" };
  R.POOL_JP = { health: "体", sanity: "心", stability: "霊" };
  R.POOL_GLYPH = { health: "♥", sanity: "◉", stability: "✦" };
  R.POOL_KANJI = {};
  for (const k of ["health", "sanity", "stability"]) Object.defineProperty(R.POOL_KANJI, k, { enumerable: true, get: () => (window.FLAVOR && window.FLAVOR.jp ? R.POOL_JP[k] : R.POOL_GLYPH[k]) });
  R.POOL_CORE = { health: "body", sanity: "mind", stability: "spirit" };

  /* Armor/weapon modifiers that raise an Aspect */
  const MOD_ASPECT = {
    "Inscribed": { morality: 1 }, "Mind Shielded": { willpower: 1 }, "Cat-Like": { agility: 1 },
    "Distinguished": { charisma: 1 }, "Muscle Enhancement": { strength: 1 }, "Neural Enhancement": { iq: 1 },
    "Reflexive": { speed: 1 }
  };

  R.aspect = (a, key) => {
    let v = a.aspects[key] || 0;
    for (const m of [...(a.armor?.mods || []), ...(a.weapon?.mods || [])]) {
      if (MOD_ASPECT[m] && MOD_ASPECT[m][key]) v += MOD_ASPECT[m][key];
    }
    for (const inj of a.injuries || []) {
      if (inj.zero && inj.zero.includes(key)) v = 0;
      if (inj.id === "slurred" && key === "potency") v = 0;
      if (inj.zeroAspect === key) v = 0;
    }
    return Math.max(0, v);
  };

  R.er = (a) => {
    if ((a.injuries || []).some((i) => i.id === "ruined_legs")) return 0;
    let v = 7 + R.aspect(a, "agility") + (a.armor?.er || 0);
    const mods = [...(a.armor?.mods || []), ...(a.weapon?.mods || [])];
    if (mods.includes("Custom Fit")) v += 1;
    if (mods.includes("Parry")) v += 1;
    return v + (a.erBonus || 0);
  };
  R.br = (a) => {
    let v = (a.armor?.br || 0) + R.aspect(a, "durability");
    const mods = [...(a.armor?.mods || []), ...(a.weapon?.mods || [])];
    if (mods.includes("Dense")) v += 1;
    if (mods.includes("Stalwart")) v += 1;
    if (a.armor?.specialty === "Juggernaut") v += 4;
    return v + (a.brBonus || 0);
  };
  R.mr = (a) => R.aspect(a, "willpower") + (a.armor?.specialty === "Shielded by Faith" ? (a.armor.br || 0) : 0);
  R.sr = (a) => R.aspect(a, "morality") + (a.armor?.specialty === "Mage Armor" ? (a.armor.br || 0) : 0);
  R.initiative = (a) => R.aspect(a, "speed") + ((a.weapon?.mods || []).includes("Quick Draw") ? 3 : 0);
  R.attackBonus = (a) => {
    const w = a.weapon;
    let bonus = w.bonus;
    if ((w.mods || []).includes("Empowered")) bonus = 3;
    return bonus + R.aspect(a, w.aspect);
  };
  R.wordPoolMax = (a) => {
    if (!a.magic) return 0;
    let v = 5 * (R.aspect(a, "occult") + R.aspect(a, "faith") + R.aspect(a, "ancient"));
    if (a.background === "Magician") v += 5;
    if ((a.armor?.mods || []).includes("Battery")) v += 3;
    for (const inj of a.injuries || []) if (inj.id === "magical_scar") v -= 10;
    return Math.max(0, v);
  };
  R.potency = (a) => R.aspect(a, "potency");
  R.actionsPerTurn = (a) => {
    let n = 2;
    if ((a.injuries || []).some((i) => i.id === "broken_bones")) n = 1;
    return n;
  };

  /* ---------------------------------------------------------------- pools */
  R.makePools = (core, extra = {}) => {
    const p = {};
    for (const k of ["health", "sanity", "stability"]) {
      const max = 5 + 5 * core[R.POOL_CORE[k]] + (extra[k] || 0);
      p[k] = { cur: max, max };
    }
    return p;
  };

  /* ---------------------------------------------------------------- items */
  R.TIERS = [
    null,
    { name: "Mundane", sp: 1, bonus: 1, uses: 1 },
    { name: "Quality", sp: 2, bonus: 2, uses: 2 },
    { name: "Advanced", sp: 3, bonus: 3, uses: 3 }
  ];

  /* ---------------------------------------------------------------- magic
     Word placement: a word's strength equals its position in the string (1..n). */
  R.WORDS = {
    Enemy: { kind: "target", text: (p) => `${p} enemy target${p > 1 ? "s" : ""}` },
    Ally: { kind: "target", text: (p) => `${p} ally target${p > 1 ? "s" : ""} (you count)` },
    Damage: { kind: "effect", text: (p, src) => `${3 * p} ${R.POOL_LABEL[R.MAGIC_POOL[src]]} damage, cannot be dodged or resisted` },
    Heal: { kind: "effect", text: (p) => `heal ${2 * p} in one Healing Pool, instantly` },
    Element: { kind: "effect", text: (p) => `set targets Burning: ${4 + p} fire damage a round for ${2 + p} rounds` },
    Treat: { kind: "effect", text: (p) => `remove ${p} status${p > 1 ? "es" : ""}` },
    Protect: { kind: "effect", text: (p) => `negate ${2 * p} damage from ${["Health", "Health and Sanity", "Health, Sanity and Stability"][Math.min(p, 3) - 1]}` },
    Brightness: { kind: "effect", text: (p) => `raise the light in the zone ${p} step${p > 1 ? "s" : ""} (Shadow to Glow)` },
    Duration: { kind: "mod", text: (p) => ["lasts an instant", "lasts 10 rounds", "lasts an hour", "lasts 8 hours"][Math.min(p, 4) - 1] }
  };
  R.MAGIC_POOL = { faith: "stability", occult: "sanity", ancient: "health" };

  R.evalSpell = (words, caster) => {
    const out = { words: [...words], enemies: 0, allies: 0, self: false, effects: [], duration: 1, lines: [] };
    words.forEach((w, i) => {
      const p = i + 1;
      if (w === "Enemy") out.enemies = p;
      else if (w === "Ally") out.allies = p;
      else if (w === "Duration") out.duration = p;
      else out.effects.push({ word: w, p });
      out.lines.push(R.WORDS[w].text(p, caster.magic.source));
    });
    if (!out.enemies && !out.allies) { out.self = true; out.allies = 1; }
    out.valid = out.effects.length > 0;
    out.rounds = [0, 1, 10, 999, 999][Math.min(out.duration, 4)];
    return out;
  };

  /* ---------------------------------------------------------------- injuries */
  R.INJURIES = {
    health: [
      { id: "brain_damage", name: "Brain Damage", core: "mind", disorder: true, text: "Mind −1 and a Mental Disorder." },
      { id: "broken_bones", name: "Broken Bones", core: "body", text: "Body −1. Two actions now buy one: one action a turn." },
      { id: "broken_will", name: "Broken Will", core: "spirit", extraDamage: 2, text: "Spirit −1. Takes 2 extra damage from every source." },
      { id: "maimed", name: "Maimed", core: "body", blind: true, text: "Body −1. Permanently Blind: −4 to all rolls." },
      { id: "ruined_legs", name: "Ruined Legs", core: "body", text: "Body −1. Evasion Rating becomes 0." },
      { id: "useless_arm", name: "Useless Arm", core: "body", noTwoHanded: true, text: "Body −1. No two-handed weapons or dual wielding." },
      { id: "weak", name: "Weak", core: "body", zero: ["durability", "humors"], text: "Body −1. Durability and Humors drop to 0." }
    ],
    sanity: [
      { id: "absent", name: "Absent", core: "mind", absent: true, text: "Mind −1. Each combat turn roll Mindfulness vs 8 or lose the turn." },
      { id: "bad_nerves", name: "Bad Nerves", core: "body", actLast: true, text: "Body −1. Always acts last in combat." },
      { id: "distant", name: "Distant", core: "mind", loseBond: true, text: "Mind −1. One Bond is lost." },
      { id: "mental_disorder", name: "Mental Disorder", core: "mind", disorder: true, text: "Mind −1 and a Mental Disorder." },
      { id: "phobia", name: "Phobia", core: "mind", fear: true, text: "Mind −1. Always has the Fear status in a fight." },
      { id: "prophetic", name: "Prophetic", core: "spirit", text: "Spirit −1. The GM gains 3 Fate Points of ones to use against this agent each mission." },
      { id: "slow", name: "Slow", core: "mind", text: "Mind −1 and lose a level." }
    ],
    stability: [
      { id: "beyond_touched", name: "Beyond Touched", core: "spirit", noticed: 7, text: "Spirit −1 and gain 7 Noticed." },
      { id: "faithless", name: "Faithless", core: "spirit", text: "Spirit −1 and lose all patrons. With no patron, Spirit drops again." },
      { id: "gazed", name: "Gazed into the Deep", core: "mind", disorder: true, text: "Mind −1 and a Mental Disorder." },
      { id: "magical_scar", name: "Magical Scar", core: "spirit", text: "Spirit −1. Word Pool maximum −10." },
      { id: "mutation", name: "Mutation", core: "spirit", mutation: true, text: "Spirit −1. The Beyond leaves a Mutation." },
      { id: "ruined_body", name: "Ruined Body", core: "body", ruinBody: true, text: "Body −1 and one Body Aspect drops to 0." },
      { id: "slurred", name: "Slurred Speech", core: "spirit", text: "Spirit −1. Potency drops to 0: no more spellcasting." }
    ]
  };
  /* Every Mental Disorder in the rulebook. fx is read by the stat wrappers in magic.js. */
  R.DISORDERS = [
    { id: "acrophobia", name: "Acrophobia", text: "Gains the Fear status when above one story in an unenclosed space.", fx: { acro: true } },
    { id: "dependent", name: "Dependent Personality Disorder", text: "Must rely on another. If separated from them, all rolls are −2.", fx: { dependent: true } },
    { id: "depression", name: "Depression", pool: "stability", minus: 10, text: "Stability permanently −10." },
    { id: "derealization", name: "Derealization Disorder", text: "Awareness and Mindfulness drop to 0.", fx: { zero: ["awareness", "mindfulness"] } },
    { id: "amnesia", name: "Dissociative Amnesia", text: "Always has the Forgetfulness status. Each day roll 1d6; below 4 it triggers." },
    { id: "did", name: "Dissociative Identity Disorder", text: "The old identity is dead. Make a new character: the same person with new Aspects and memories.", fx: { dies: true } },
    { id: "eating", name: "Eating Disorder", text: "Can no longer eat food to heal.", fx: { noFood: true } },
    { id: "existential", name: "Existential Crisis", text: "Reduce one Core Stat and all its Aspects by 1, and move those points to another Core Stat." },
    { id: "hopeless", name: "Hopeless", text: "All magic Aspects (Occult, Faith, Ancient) are set to 0. If already 0, take a Spirit Injury too.", fx: { zero: ["occult", "faith", "ancient"] } },
    { id: "hysterical", name: "Hysterical Laughter", text: "Random fits of laughter. Can no longer take the Hiding action.", fx: { noHide: true } },
    { id: "insomnia", name: "Insomnia", text: "Roll 1d6 to rest: on a 1–3 the agent cannot rest that night.", fx: { insomnia: true } },
    { id: "ied", name: "Intermittent Explosive Disorder", text: "Forced to fight: cannot Flee, and −2 Charisma.", fx: { mod: { charisma: -2 }, noFlee: true } },
    { id: "ocd", name: "Obsessive-Compulsive Disorder", text: "Starts each fight with 1 action, then 3 the next round, swapping every round.", fx: { ocd: true } },
    { id: "psychosomatic", name: "Psychosomatic Disorder", pool: "health", minus: 10, text: "Health permanently −10." },
    { id: "ptsd", name: "PTSD", pool: "sanity", minus: 10, text: "Sanity permanently −10." },
    { id: "schizophrenia", name: "Schizophrenia", text: "The GM may impose hallucinations, and the agent can be harmed by these illusions." },
    { id: "mutism", name: "Selective Mutism", text: "Can no longer speak. Potency −1.", fx: { mod: { potency: -1 } } }
  ];
  /* Mutation Traits (rulebook). fx adds to Resistance Types. */
  R.MUTATIONS = [
    { id: "salvation", name: "Beyond Salvation", text: "Gain 1 Common Monster Modifier (the GM rules which)." },
    { id: "claws", name: "Clawed Hands", text: "Cannot wield weapons, but hands count as +3 weapons with an added status effect.", fx: { noWeapon: true } },
    { id: "flesh", name: "Hardened Flesh", text: "+4 BR, but MR and SR −2.", fx: { br: 4, mr: -2, sr: -2 } },
    { id: "hulking", name: "Hulking Mass", text: "Huge size. Can no longer wear armor." },
    { id: "mobility", name: "Mobility Change", text: "+1 Zone of movement, and wings (vertical movement) or fins (swimming) that can be concealed." },
    { id: "visage", name: "Monstrous Visage", text: "Humans who see your face gain the Fear status." },
    { id: "scarring", name: "Occult Scarring", text: "+3 MR and SR, but BR −5.", fx: { br: -5, mr: 3, sr: 3 } },
    { id: "regen", name: "Regeneration", text: "All Healing counts as magical and is instant, but you must eat two food every day or lose 2 Health each day." },
    { id: "rebirth", name: "Unholy Rebirth", text: "After death you remain alive for 3 days, immune to Health damage but taking +5 Sanity and Stability damage. Then you die." },
    { id: "brain", name: "Word of Brain", text: "Telepathy with creatures, but your speech is unintelligible: one Word for casting, and −5 on rolls involving communication." }
  ];

  /* The Mutation table: roll 3d6 twice. Each result names an Aspect; the two Aspects swap values.
     An 18 is a Mutation Trait instead (and swaps nothing). */
  R.MUTATION_TABLE = { 3: "strength", 4: "charisma", 5: "occult", 6: "agility", 7: "iq", 8: "faith", 9: "speed", 10: "awareness", 11: "ancient", 12: "durability", 13: "willpower", 14: "potency", 15: "humors", 16: "mindfulness", 17: "morality", 18: "trait" };
  /* Zone Modifiers (the Zone Statuses list). param: what the GM picks. */
  R.ZONE_MODS = [
    { id: "bound", name: "Bound", text: "Spectral chains: nobody can leave the zone during a round, every round." },
    { id: "chaoticHealing", name: "Chaotic Healing", text: "Healing hurts instead. A 6 on d6 when damaged turns that damage into healing." },
    { id: "constricted", name: "Constricted Space", text: "No more than 2 entities in this zone at once." },
    { id: "hazard", name: "Elemental Hazard", text: "Each round 2 Elemental damage and an element status until they leave.", param: "element" },
    { id: "livingShadows", name: "Living Shadows", text: "Each round shadows attack for 2 Corrupted damage unless Awareness beats Medium." },
    { id: "lost", name: "Lost", text: "Hopelessness. Unless Mindfulness beats Medium, the entity spends its turn sobbing." },
    { id: "wellspring", name: "Magic Wellspring", text: "+1 Potency for everyone standing here." },
    { id: "obstructed", name: "Obstructed", text: "Entering costs 2 movement (a whole turn of actions)." },
    { id: "plagued", name: "Plagued", text: "Each round, Humors beats Medium or gain Disease." },
    { id: "portal", name: "Portal", text: "Each round, a 6 on d6 spawns a new monster here." },
    { id: "flicker", name: "Reality Flicker", text: "Each round a 6 on d6 makes the zone intangible: no attacks or magic in or out." },
    { id: "weather", name: "Weather Change", text: "Weather severity here differs from the rest (0 to 4).", param: "severity" },
    { id: "rupture", name: "Rupture", text: "A gateway of the Beyond. Describe its source and how it is closed.", param: "text" },
    { id: "gravity", name: "Shifting Gravity", text: "Each round Strength or Agility CR 8, or be thrown to a neighbouring zone and fall for 8 Health." },
    { id: "soulDrain", name: "Soul Drain", text: "Each round everyone loses 1 Health, 1 Sanity and 1 Stability." },
    { id: "echoes", name: "Temporal Echoes", text: "Each round a 6 on d6 repeats all damage dealt here, in order." },
    { id: "timeSlip", name: "Time Slip", text: "Turn order reverses each round. A 6 on d6 undoes the whole round." },
    { id: "unpredictable", name: "Unpredictable", text: "Each round the damage type here changes (d6: 1-2 Health, 3 Sanity, 4 Stability, 5 Elemental, 6 Corrupted)." },
    { id: "warped", name: "Warped Sound", text: "No speech. Magic needs Willpower beats Medium each turn." },
    { id: "bloodMist", name: "Blood Mist", text: "Damage dealt heals the attacker's Health by the same amount." },
    { id: "bodySwap", name: "Body Swap", text: "Each round a 6 on d6 swaps bodies around until the round ends. Morality beats Medium to resist." }
  ];
  /* Lighting tiers: Glow/Shadow (±1), Bright/Dark (±2, Blind for Normal Vision), Blinding/Pitch (±3, Blind and one fewer action) */
  R.ZONE_LIGHT = { normal: 0, glow: 1, shadow: -1, bright: 2, dark: -2, blinding: 3, pitch: -3 };
  /* Weather severity: 1 nothing, 2 −1 to rolls, 3 −2 and sight of 1 zone, 4 −4 and sight of 1 zone */
  R.WEATHER_MOD = [0, 0, -1, -2, -4];
  R.weatherMod = (sev) => R.WEATHER_MOD[Math.max(0, Math.min(4, sev | 0))];
  /* Afflictions that follow an agent between scenes. cr is the source's CR. */
  R.AFFLICTIONS = {
    befuddled: { name: "Befuddled", text: "Mind Aspects −2 until rest." },
    beyondTouched: { name: "Beyond Touched", text: "No Healing of any kind until the source is removed." },
    blind: { name: "Blind", text: "All rolls −4." },
    disease: { name: "Disease", text: "Each day: Humors roll vs the source CR, or all Core Stats −1.", cr: true },
    exhausted: { name: "Exhausted", text: "All Aspects −2 for each consecutive day without sleep; restored on rest." },
    forgetfulness: { name: "Forgetfulness", text: "Each day: Mindfulness roll vs the source CR, or lose something important.", cr: true }
  };
  R.afflict = (a, id, cr) => { a.afflict = a.afflict || {}; const cur = a.afflict[id]; a.afflict[id] = id === "exhausted" ? { days: (cur ? cur.days : 0) + 1 } : { cr: cr || (cur && cur.cr) || 10 }; };
  R.cureAfflict = (a, id) => { if (a.afflict) delete a.afflict[id]; };
  R.has = (a, id) => !!(a.afflict && a.afflict[id]);
  R.canHeal = (a) => !R.has(a, "beyondTouched");
  /* How an agent dies depends on which Healing Pool gave out. The book lists examples; the GM may decide. */
  R.DEATHS = {
    health: ["Organ failure: {n} makes it home and does not wake up.", "Last words: {n} lives long enough to say something, and then the fight is over.", "Bled out: a slow death on the battlefield.", "Lost a limb: this time, it was fatal."],
    sanity: ["Madness: {n} becomes unplayable and walks away from the Agency, or turns on it.", "Gone: {n} could not go on. It may have happened that night, or weeks later.", "Vegetative: {n}'s mind is damaged beyond repair.", "Hidden knowledge: locked away in a study or off on a trip, {n} never returns."],
    stability: ["Martyrdom: a blaze of glory for whatever god {n} believed in.", "Soul destroyed: {n}'s soul is shattered and only a husk is left.", "Magic accident: a spell gone wrong ends {n}.", "Wretched mutation: the Beyond has touched {n}, and the body can't hold the changes."]
  };
  R.deathCause = (pool, name) => { const l = R.DEATHS[pool] || R.DEATHS.health; return l[Math.floor(R.rand() * l.length)].replace(/\{n\}/g, name || "They"); };
  R.rollMutation =
  R.rollMutation = () => [0, 1].map(() => { const dice = [R.d6(), R.d6(), R.d6()]; const total = dice[0] + dice[1] + dice[2]; return { dice, total, aspect: R.MUTATION_TABLE[total] }; });
  R.pick = (arr) => arr[Math.floor(R.rand() * arr.length)];

  /* Apply an injury to an agent. Returns { injury, died, notes[] }. */
  /* which injuries could this agent take without dying outright? */
  /* Survivor background: a Core Stat must reach −1, not 0, to kill. */
  R.deathFloor = (a) => (a && a.survivor ? -1 : 0);
  R.safeInjuries = (a, pool) => R.INJURIES[pool].filter((i) => (a.core[i.core] - 1 - (i.extraCore || 0)) > R.deathFloor(a));
  /* Apply one Mutation roll: mut = { rolls, traits } or nothing to roll here. Returns the text to show. */
  R.applyMutation = (a, mut) => {
    const notes = [];
    mut = mut && mut.rolls ? mut : { rolls: R.rollMutation(), traits: [] };
            const traits = [...(mut.traits || [])];
      const [r1, r2] = mut.rolls;
      const rolled = mut.rolls.map((r) => `${r.dice.join("+")}=${r.total} ${r.aspect === "trait" ? "Mutation" : R.ASPECT_LABEL[r.aspect]}`);
      if (r1.aspect !== "trait" && r2.aspect !== "trait") {
        if (r1.aspect === r2.aspect) notes.push(`Both rolls name ${R.ASPECT_LABEL[r1.aspect]}. Nothing swaps.`);
        else {
          const x = a.aspects[r1.aspect] || 0, y = a.aspects[r2.aspect] || 0;
          a.aspects[r1.aspect] = y; a.aspects[r2.aspect] = x;
          notes.push(`${R.ASPECT_LABEL[r1.aspect]} (${x}) and ${R.ASPECT_LABEL[r2.aspect]} (${y}) swap places.`);
        }
      }
      for (const r of mut.rolls) if (r.aspect === "trait") {
        const want = traits.shift(); const m = R.MUTATIONS.find((x) => x.id === want) || R.pick(R.MUTATIONS);
        a.injuries.push({ id: "mut_" + m.id, name: `Mutation: ${m.name}`, text: m.text, trait: true, mfx: m.fx ? JSON.parse(JSON.stringify(m.fx)) : null });
        notes.push(`The Beyond leaves a mark: ${m.name}. ${m.text}`);
      }
      
    return { rolls: mut.rolls, text: `Rolled ${rolled.join(" and ")}. ${notes.join(" ")}` };
  };
  const origAspectOf = (a, k) => (a.aspects && a.aspects[k]) || 0;
  /* Existential Crisis: one Core Stat and all its Aspects fall by 1; the same points go to another Core Stat. */
  R.existential = (a, from, to) => {
    if (from === to || (a.core[from] || 0) <= 1) return false;
    a.core[from] -= 1; a.core[to] += 1;
    for (const k of R.ASPECTS[from]) a.aspects[k] = Math.max(0, (a.aspects[k] || 0) - 1);
    for (const k of R.ASPECTS[to]) a.aspects[k] = (a.aspects[k] || 0) + 1;
    return true;
  };
  R.applyInjury = (a, pool, injuryId, disorderId, mutationId) => {
    const found = injuryId && R.INJURIES[pool].find((i) => i.id === injuryId);
    const inj = { ...(found || R.pick(R.INJURIES[pool])) };
    const notes = [];
    a.injuries = a.injuries || [];
    a.core[inj.core] -= 1;
    if (inj.extraCore) a.core[inj.core] -= inj.extraCore;
    if (inj.noticed) R.addNoticed(a, inj.noticed);
    if (inj.loseBond) {
      const b = (a.bonds || []).find((x) => x.value > 0);
      if (b) { b.value = 0; notes.push(`${b.name} stops answering ${a.short}'s calls.`); }
      else { inj.dfx = { zero: ["mindfulness"], mr: -99 }; notes.push("No Bond left to lose: Mindfulness and MR drop to 0."); }
    }
    if (inj.ruinBody) {
      const k = R.ASPECTS.body.find((x) => (a.aspects[x] || 0) > 0);
      if (k) { inj.zeroAspect = k; notes.push(`${R.ASPECT_LABEL[k]} drops to 0.`); }
    }
    if (inj.disorder) {
      const d = R.DISORDERS.find((x) => x.id === disorderId) || R.pick(R.DISORDERS);
      inj.disorderName = d.name;
      if (d.fx) inj.dfx = JSON.parse(JSON.stringify(d.fx));
      notes.push(`Mental Disorder: ${d.name}. ${d.text}`);
      if (d.fx && d.fx.dies) { a.survivor = false; inj.dies = true; }
      if (d.pool) { a.pools[d.pool].max = Math.max(1, a.pools[d.pool].max - d.minus); a.pools[d.pool].cur = Math.min(a.pools[d.pool].cur, a.pools[d.pool].max); }
    }
    if (inj.mutation) { const r = R.applyMutation(a, mutationId); inj.mutationRolls = r.rolls; inj.mutationText = r.text; notes.push(r.text); }
    if (inj.id === "slow" && (a.level || 1) > 1) { a.level -= 1; a.levelUps = Math.max(0, (a.levelUps || 0) - 1); notes.push(`Drops to level ${a.level}. Take back one Core point, two Aspect points and that level's benefit.`); }
    if (inj.id === "faithless") {
      if ((a.patrons || []).length) { a.patrons = []; if (window.MECH && window.MECH.syncGifts) window.MECH.syncGifts(a); notes.push("Every patron is lost."); }
      else { a.core.spirit -= 1; notes.push("No patron to lose, so Spirit drops again."); }
    }
    if (inj.disorder && disorderId === "amnesia") { R.afflict(a, "forgetfulness", 10); a.afflict.forgetfulness.d6 = true; notes.push("Always Forgetful: each day a 1d6 below 4 triggers it."); }
    if (inj.disorder && disorderId === "hopeless" && ["occult", "faith", "ancient"].every((k) => !origAspectOf(a, k))) { inj.needsSpirit = true; notes.push("Already at 0 in every magic Aspect: take a Spirit Injury too."); }
    a.injuries.push(inj);
    a.pools[pool].cur = Math.min(a.pools[pool].max, a.pools[pool].cur + 10);
    const died = Object.values(a.core).some((v) => v <= R.deathFloor(a)) || !!inj.dies;
    return { injury: inj, died, notes };
  };

  /* Death Die: 2d6, 7+ regains half of every Healing Pool. Below 7 the agent is
     marked for death; the GM's secret d6 decides how long they have. */
  R.deathDie = (a) => {
    const dice = R.roll2d6();
    const total = dice[0] + dice[1];
    if (total >= 7) {
      for (const k of ["health", "sanity", "stability"]) {
        const p = a.pools[k];
        p.cur = Math.min(p.max, p.cur + Math.floor(p.max / 2));
      }
      return { dice, total, survived: true };
    }
    const fate = R.d6();
    return { dice, total, survived: false, gmRoll: fate, outcome: fate <= 3 ? "now" : fate <= 5 ? "days" : "recovers" };
  };

  /* Noticed: points 1–5 cost max Sanity, 6–10 cost max Stability. */
  R.addNoticed = (a, n) => {
    for (let i = 0; i < n; i++) {
      a.noticed = (a.noticed || 0) + 1;
      if (a.noticed > 10) continue;   // past 10 the Beyond rolls for you instead (see SVC.beyondCheck)
      const pool = a.noticed <= 5 ? "sanity" : "stability";
      a.pools[pool].max = Math.max(1, a.pools[pool].max - 1);
      a.pools[pool].cur = Math.min(a.pools[pool].cur, a.pools[pool].max);
      if (a.poolMax) a.poolMax[pool] = Math.max(1, (a.poolMax[pool] || a.pools[pool].max + 1) - 1);
    }
  };

  window.R = R;
})();
