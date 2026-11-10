/* ============================================================================
   BACKGROUND RULES — the parts of each background (rulebook pp.19-22) that the
   engine enforces, beyond the stat changes in CAMP.buildChar.
     Brawler           +1 Damage
     Chef              starts with five food items
     Healer            starts with 3 Medicine; agents resting at the hideout with a
                       Healer heal +3 Health a day
     Adrenaline Junkie +1 to all rolls for every 10 missing in any Healing Pool
     Survivor          a Core Stat must reach −1 to kill (rules.js R.deathFloor)
     Local             starts with 3 Quality Favors
     Mutant            starts with the chosen Mutant Trait
     Vampire Traitor   Bloodthirsty + Undeath in combat (combat.js); no other healing
   Tactician, Spy, Trapper, Gifted, Veteran Hunter and Engineer live where they act
   (combat.js and the creator). Services, companions and free contacts stay on the
   sheet for the table.
   ========================================================================== */
(function () {
  const CAMP = window.CAMP, R = window.R;
  if (!CAMP || !R) return;
  const apply = (a) => {
    if (!a || !a.background) return a;
    if (a.background === "Brawler") a.bonusDamage = Math.max(a.bonusDamage || 0, 1);
    if (a.background === "Survivor") a.survivor = true;
    return a;
  };

  const build0 = CAMP.buildChar;
  CAMP.buildChar = (d, year, agencyId) => {
    const a = apply(build0(d, year, agencyId));
    const give = (ref, n) => { for (let i = 0; i < n; i++) { const as = CAMP.addAsset(a, { kind: "item", ref, name: CAMP.itemName ? CAMP.itemName(ref, year) : ref, wc: 1 }); as.owned = true; as.note = a.background + " background"; } };
    if (a.background === "Chef") give("food", 5);
    if (a.background === "Healer") give("medicine", 3);
    if (a.background === "Mutant") {
      const m = R.MUTATIONS.find((x) => x.id === d.pickMutation) || R.pick(R.MUTATIONS);
      a.injuries.push({ id: "mut_" + m.id, name: `Mutation: ${m.name}`, text: m.text, trait: true, mfx: m.fx ? JSON.parse(JSON.stringify(m.fx)) : null });
    }
    if (a.background === "Local" && CAMP.camp && !a.localFavors) { a.localFavors = 3; for (let i = 0; i < 3; i++) CAMP.camp.favors.push({ wc: 2, from: `${a.short}'s neighbourhood` }); }
    return a;
  };

  /* older agents pick up the rules when they go on a mission */
  const party0 = CAMP.partyDefs;
  CAMP.partyDefs = (...args) => party0(...args).map(apply);

  if (window.GEAR) {
    const mods0 = window.GEAR.rollMods;
    window.GEAR.rollMods = (a) => {
      const out = mods0(a);
      if (a.background === "Adrenaline Junkie" && a.pools) {
        const n = ["health", "sanity", "stability"].reduce((s, k) => s + Math.floor(Math.max(0, a.pools[k].max - a.pools[k].cur) / 10), 0);
        if (n) out.push({ label: "Adrenaline Junkie", value: n });
      }
      return out;
    };
  }

  const rest0 = CAMP.restDay;
  CAMP.restDay = (a, o = {}) => {
    if (a && a.background === "Vampire Traitor") { window.GEAR && window.GEAR.longRest(a); return { health: 0, sanity: 0, stability: 0, note: `${a.short} cannot heal from anything but blood.` }; }
    const g = rest0(a, o);
    if (!g || g.note && /could not sleep/.test(g.note)) return g;
    const healer = (CAMP.camp.chars || []).find((x) => x.status === "active" && x.background === "Healer");
    if (healer && R.canHeal(a)) {
      const hp = a.pools.health, add = Math.min(3, hp.max - hp.cur);
      if (add > 0) { hp.cur += add; g.health = (g.health || 0) + add; }
      g.note = (g.note ? g.note + " " : "") + `${healer.short === a.short ? a.short + " treats their own wounds" : healer.short + " treats " + a.short}: +3 Health (Healer).`;
    }
    return g;
  };
})();
