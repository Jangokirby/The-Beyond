/* Weapon / armor Modifiers and Specialties, statuses, and monster Modifier math.
   Static bonuses live here (wrapping the R.* stat functions); the in-fight effects are called from combat.js. */
(function () {
  const G_ = {};
  const R = window.R, GD = window.GD;

  /* Luxury and Exotic items: +4 / +5 and that many uses */
  R.TIERS[4] = { name: "Luxury", sp: 5, bonus: 4, uses: 4 };
  R.TIERS[5] = { name: "Exotic", sp: 6, bonus: 5, uses: 5 };

  /* ---------------------------------------------------------------- queries */
  const modsOf = (a, which) => (which === "w" ? (a.weapon && a.weapon.mods) : (a.armor && a.armor.mods)) || [];
  G_.w = (a, name) => !!a && !!a.weapon && modsOf(a, "w").includes(name);              // weapon Modifier
  G_.a = (a, name) => !!a && !!a.armor && (modsOf(a, "a").includes(name) || a.armor.specialty === name);   // armor Modifier or Specialty
  G_.ws = (a, name) => !!a && !!a.weapon && a.weapon.specialty === name;               // weapon Specialty
  G_.any = (a, name) => G_.w(a, name) || G_.a(a, name);
  G_.pick = (a, which, name) => ((a[which === "w" ? "weapon" : "armor"].picks) || {})[name];

  /* choices a Modifier needs when it is taken */
  const BODY = ["strength", "agility", "durability", "speed", "humors"];
  const MIND = ["iq", "awareness", "mindfulness", "charisma", "memory"].filter((k) => R.ASPECTS.mind.includes(k));
  const SPIRIT = R.ASPECTS.spirit;
  G_.PICKS = {
    w: {
      "Master Craft": { label: "+1 to which Body Aspect?", opts: () => R.ASPECTS.body },
      "Historical": { label: "+1 to which Mind Aspect?", opts: () => R.ASPECTS.mind },
      "Sacred": { label: "+1 to which Spirit Aspect?", opts: () => R.ASPECTS.spirit },
      "Foe Hater": { label: "Which Monster type?", opts: () => Object.keys(window.ADV && ADV.MB ? ADV.MB.TYPES : { Human: 1, Undead: 1, Spirit: 1, Folklore: 1, Beyond: 1, Golem: 1 }) },
      "Heirloom": { label: "Inherited in your backstory? (+1)", opts: () => ["no", "yes"] }
    },
    a: {
      "Drenched In Magic": { label: "+1 to which?", opts: () => ["occult", "faith", "ancient"] },
      "Heirloom": { label: "Inherited in your backstory? (+1)", opts: () => ["no", "yes"] },
      "Enhanced Vision": { label: "Which sight?", opts: () => ["Dark Vision", "Sun Sight"] }
    }
  };
  G_.pickKeys = (which, mods, spec) => Object.keys(G_.PICKS[which]).filter((k) => mods.includes(k) || spec === k);

  /* previous owners of an Heirloom (+1 each, up to 5) */
  G_.heirloom = (a, which) => {
    const it = a[which === "w" ? "weapon" : "armor"];
    if (!it || !(it.mods || []).includes("Heirloom")) return 0;
    const owners = it.owners != null ? it.owners : (G_.pick(a, which, "Heirloom") === "yes" ? 1 : 0);
    return Math.min(5, owners);
  };

  /* ---------------------------------------------------------------- static stat wraps */
  const origAspect = R.aspect, origEr = R.er, origBr = R.br, origMr = R.mr, origSr = R.sr;
  R.aspect = (a, key) => {
    let v = origAspect(a, key);
    if (a.weapon && a.armor) {
      for (const m of ["Master Craft", "Historical", "Sacred"]) if (G_.w(a, m) && G_.pick(a, "w", m) === key) v += 1;
      if (G_.a(a, "Drenched In Magic") && G_.pick(a, "a", "Drenched In Magic") === key) v += 1;
      if (a.crippled && R.ASPECTS.body.includes(key)) v = Math.max(0, v - 2);
      if (a.afflict) {
        if (a.afflict.befuddled && R.ASPECTS.mind.includes(key)) v -= 2;
        if (a.afflict.exhausted) v -= 2 * (a.afflict.exhausted.days || 1);
      }
    }
    return Math.max(0, v);
  };
  R.er = (a) => {
    const v = origEr(a);
    if (v === 0 && (a.injuries || []).some((i) => i.id === "ruined_legs")) return 0;
    return v + G_.heirloom(a, "a");
  };
  R.br = (a) => origBr(a) + G_.heirloom(a, "a");

  /* general roll bonuses that apply to every roll the agent makes */
  G_.rollMods = (a) => {
    const out = [];
    if (G_.w(a, "Elder") && (a.age || 0) > 65) out.push({ label: "Elder", value: Math.floor(((a.age || 0) - 65) / 10) });
    if (G_.w(a, "Polytheistic") && (a.patrons || []).length) out.push({ label: "Polytheistic", value: (a.patrons || []).length });
    if (G_.w(a, "Heirloom") && G_.heirloom(a, "w")) out.push({ label: "Heirloom", value: G_.heirloom(a, "w") });
    if (G_.a(a, "Junkie") && a.pools && a.pools.health.cur <= a.pools.health.max / 2) out.push({ label: "Junkie (half Health)", value: 4 });
    return out.filter((m) => m.value);
  };

  /* sight chosen with Enhanced Vision */
  G_.applySight = (def, ch) => {
    if (G_.a(ch, "Enhanced Vision") && G_.pick(ch, "a", "Enhanced Vision") !== "Sun Sight") def.vision = "dark";
    if (G_.a(ch, "Enhanced Vision") && G_.pick(ch, "a", "Enhanced Vision") === "Sun Sight") def.traits = { ...(def.traits || {}), sunSight: true };
  };

  /* extra storage from Large Pockets */
  G_.storageBonus = (a) => (G_.a(a, "Large Pockets") ? 2 : 0);

  /* things that heal at the end of each day */
  G_.daily = (a) => {
    const notes = [];
    if (!a.pools) return notes;
    const heal = (pool, n, src) => { const p = a.pools[pool]; const before = p.cur; p.cur = Math.min(p.max, p.cur + n); if (p.cur > before) notes.push(`${a.short || a.name}: ${src} restores ${p.cur - before} ${R.POOL_LABEL[pool]}.`); };
    if (G_.w(a, "Bliss")) heal("sanity", 3, "Bliss");
    if (G_.w(a, "Chained")) heal("stability", 3, "Chained");
    if (G_.w(a, "Healing")) heal("health", 3, "Healing");
    a.dailyUsed = {};
    return notes;
  };

  /* long rest ends Crippled */
  G_.longRest = (a) => { if (window.MAGIC) window.MAGIC.rest(a); if (a.afflict) { delete a.afflict.befuddled; delete a.afflict.exhausted; } if (a.crippled) { a.crippled = false; return true; } return false; };

  /* ---------------------------------------------------------------- statuses */
  G_.STATUS = {
    frozen: { label: "Frozen", rounds: 2, text: "Immobilized: cannot move." },
    crippled: { label: "Crippled", rounds: 99, text: "Body −2 until a long rest." },
    poisoned: { label: "Poisoned", rounds: 99, text: "One fewer action for the rest of the scene." },
    terrified: { label: "Terrified", rounds: 3, text: "3 Sanity damage each turn." },
    bleeding: { label: "Bleeding", rounds: 3, dmg: 3, text: "3 Health damage a turn." },
    burning: { label: "Burning", rounds: 99, dmg: 4, text: "4 Elemental damage a turn until put out." },
    grappled: { label: "Grappled", rounds: 99, text: "Held. Can only try to break free." },
    disease: { label: "Disease", rounds: 99, text: "Diseased: each day Humors vs the source CR or all Core Stats −1." },
    blind: { label: "Blind", rounds: 99, text: "All rolls −4." },
    befuddled: { label: "Befuddled", rounds: 99, text: "Mind Aspects −2 until rest." },
    exhausted: { label: "Exhausted", rounds: 99, text: "All Aspects −2 until rest." },
    stun: { label: "Stunned", rounds: 1, text: "Loses their next turn." }
  };
  G_.statusObj = (id) => ({ id, ...G_.STATUS[id] });

  /* ---------------------------------------------------------------- monster Modifier math */
  const count = (mods, n) => (mods || []).filter((m) => m === n || (typeof m === "string" && m.split(":")[0] === n)).length;
  G_.count = count;
  G_.param = (mods, n) => { const m = (mods || []).find((x) => typeof x === "string" && x.split(":")[0] === n && x.includes(":")); return m ? m.split(":")[1] : null; };

  /* applies the numeric Modifiers to a freshly built monster */
  G_.applyMonsterMods = (m) => {
    const mods = m.mods || [];
    const n = (x) => count(mods, x);
    m.built = true;
    m.dmgBonus = { health: 0, sanity: 0, stability: 0 };
    m.er += 2 * n("Nimble");
    m.br += 2 * n("Thick Skin");
    m.mr += 2 * n("Steel Mind");
    m.sr += 2 * n("Unshakable Faith");
    const tank = 5 * n("Tanky");
    for (const k of ["health", "sanity", "stability"]) m[k] += tank;
    if (n("God-Like")) { for (const k of ["health", "sanity", "stability"]) m[k] += 15; m.br += 5; m.mr += 5; m.sr += 5; }
    m.move = 1 + (n("Quick") ? n("Quick") : 0) + (n("Godspeed") ? 2 : 0);
    if (n("Quick")) m.speed += 3 * n("Quick");
    if (n("Vengeful")) m.actions += 1;
    if (n("Multi-Limbed")) m.actions = Math.max(m.actions, 3);
    if (n("Rage")) { m.dmgBonus.health += 5; m.dmgBonus.sanity += 5; m.dmgBonus.stability += 5; m.br = 0; m.mr = 0; m.sr = 0; }
    m.dmgBonus.health += 4 * n("Vicious");
    m.dmgBonus.stability += 4 * n("Ungodly");
    m.dmgBonus.sanity += 4 * n("Unimaginable Horror");
    if (n("Psychological Attacks")) m.dtype = "sanity";
    if (n("Occult")) m.dtype = "stability";
    if (n("Elemental")) m.dtype = "elemental";
    if (n("Void")) m.dtype = "corrupted";
    if (n("Ranged")) { m.range = Math.max(m.range || 0, 2); m.rangedPenalty = 2; }
    if (n("Caster")) { m.words = 5 * n("Caster"); m.potency = n("Caster"); }
    for (const k of ["health", "sanity", "stability"]) m[k] = Math.max(1, m[k]);
    return m;
  };

  window.GEAR = G_;
})();
