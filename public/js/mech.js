/* ============================================================================
   MECHANICS FOR ARTIFACTS, PATRON GIFTS AND THEIR COSTS
   Automated where the book is precise. Where the book says "the GM decides",
   the power is marked Narrative: it takes its cost and shows the text, and
   the table rules the effect.
   ========================================================================== */
(function () {
  const GD = window.GD, R = window.R, CAMP = window.CAMP, U = window.UI, G = window.GAME;
  const MECH = (window.MECH = {});
  const ph = (t) => (t || "").replace(/\s+/g, " ");

  /* ------------------------------------------------------------ artifacts */
  // passive: applied to the agent for missions while equipped. auto: list of downtime actions.
  MECH.ART = {
    "BLOOD DRINKER": { passive: { decay: 20 }, note: "Attack +20 on the first hit, losing 1 per hit until +1. Pick 1 extra weapon Modifier at the table." },
    "CLAWS OF DEAD BOOGEYMEN": { passive: { weapon: 5 }, note: "+5 weapon. The extra attack-only action and speaking to monsters are ruled at the table." },
    "THE CROSS THAT HOLDS THE DARK": { passive: { mr: 3, sr: 3, fearImmune: true }, note: "+3 MR and SR. If you flee combat, reduce Spirit by 1." },
    "LOVING ARMOR": { passive: { br: 3, mr: 3, sr: 3 }, note: "+3 in every Resistance Type. The GM may Suffocate you if you neglect it." },
    "ROULETTE": { passive: { weapon: 5 }, note: "+5 weapon. The bullet-and-extra-dice game is played at the table." },
    "SWORD OF GUT RIPPING": { passive: { weapon: 5, bleed: true }, note: "+5 weapon, and every hit causes Bleeding. It can move 2 Zones on command." },
    "THE WEIGHT OF SIN": { passive: { weapon: 5, combo: ["strength", "faith"] }, note: "+5 weapon. Attacks add Strength and Faith together. +1 Noticed on a Critical Failure." },
    "THE CHOKING COWL": { passive: { dark: true, noMagic: true }, note: "Dark Vision. You cannot speak or cast spells while it is worn." },
    "THE BOOTS OF THE CRYING PRINCE": { note: "+1 Charisma for each week worn. Each week roll 2d6 vs Easy or gain a Mental Disorder (applied as days pass in downtime)." },
    "CHALICE OF THE THIRSTY": { act: "chalice" }, "THE BOOK OF OLD MEN": { act: "oldmen" }, "THE BOOK OF BEYOND FACTS": { act: "facts" },
    "SUITCASE OF BAD DAYS": { act: "suitcase" }, "EYES OF PAST CRIMES": { act: "eyes" }
  };
  MECH.ACT_LABEL = { chalice: "Drink from the Chalice", oldmen: "Read the Book of Old Men", facts: "Read the Book of Beyond Facts", suitcase: "Reach into the suitcase", eyes: "Look into the past" };

  MECH.applyArtifacts = (d, ch) => {
    d.traits = d.traits || {};
    for (const art of ch.artifacts.filter((x) => x.equipped)) {
      const m = MECH.ART[art.name]; d.weapon.artifact = art.name;
      if (!m) { // forged artifacts: any "+N Attack" in the Modifier counts as a +5 weapon
        const t = ((art.def && art.def.effects) || "") + " " + ((art.def && art.def.text) || "");
        if (/\+\s?\d+\s+(?:to\s+)?Attack/i.test(t)) d.weapon.bonus += 5;
        continue;
      }
      const p = m.passive || {};
      const clean = (art.memories || 0) >= 5;
      if (clean) d.weapon.cleansed = true;
      if (art.name === "THE CROSS THAT HOLDS THE DARK" && !clean) d.traits.crossFlee = true;
      if (p.weapon) d.weapon.bonus += p.weapon;
      if (p.decay) d.weapon.decay = p.decay;
      if (p.combo) d.weapon.combo = p.combo;
      if (p.bleed) d.weapon.bleed = true;
      if (p.br) d.brBonus = (d.brBonus || 0) + p.br;
      if (p.mr) d.mrBonus = (d.mrBonus || 0) + p.mr;
      if (p.sr) d.srBonus = (d.srBonus || 0) + p.sr;
      if (p.fearImmune) d.traits.fearImmune = true;
      if (p.dark) d.vision = "dark";
      if (p.noMagic && !clean) { delete d.magic; d.words = {}; }
    }
  };

  /* ------------------------------------------------------------ gifts */
  const giftsOf = (a) => {
    const out = [], multi = (a.patrons || []).length > 1;
    for (const p of a.patrons || []) {
      const d = GD.deities.find((x) => x.name === p.deity); if (!d) continue;
      for (let n = 1; n <= p.gifts; n++) { const g = d.gifts[n - 1]; if (!g) continue; out.push({ deity: p.deity, n, gift: g, lost: multi && n === 2 }); }
    }
    return out;
  };
  MECH.gifts = giftsOf;
  const has = (a, deity, n) => giftsOf(a).some((x) => x.deity === deity && x.n === n && !x.lost);
  MECH.has = has;

  // permanent bonuses are applied once, when the gift is received
  const PERM = { "The Dead Mountain": { 2: { health: 10, sanity: 10, stability: 10 }, 3: { health: 20 } } };
  MECH.syncGifts = (a) => {
    for (const p of a.patrons || []) {
      p.applied = p.applied || [];
      for (let n = 1; n <= p.gifts; n++) {
        const perm = PERM[p.deity] && PERM[p.deity][n];
        if (!perm || p.applied.includes(n)) continue;
        p.applied.push(n);
        a.poolMax = a.poolMax || {};
        for (const [k, v] of Object.entries(perm)) { a.poolMax[k] = (a.poolMax[k] || a.pools[k].max) + v; a.pools[k].max += v; a.pools[k].cur += v; }
      }
    }
  };
  MECH.applyGifts = (d, ch) => {
    d.traits = d.traits || {};
    if (has(ch, "The Never Speak", 3)) d.traits.autoIQ = true;
    if (has(ch, "The Dead Mountain", 3)) d.traits.sanityImmune = true;
    if (has(ch, "The Master of Swords", 1) && d.weapon.range === 0) d.weapon.mastered = true;
    d.graceMax = has(ch, "God", 1) ? 10 : 0;
  };
  MECH.unlimitedSP = (a) => has(a, "The Perfumed Host", 3);

  /* every gift is a Power: automated, passive, or narrative */
  const AUTO = { "God:1": "grace", "God:2": "wrath", "Devil:2": "tricks", "The Late Prince:1": "arrival" };
  const PASSIVE = new Set(["God:3", "The Dead Mountain:2", "The Dead Mountain:3", "The Perfumed Host:3", "The Never Speak:3", "The Master of Swords:1", "Endless Gossip", "The Fate Abductor:3"]);
  const costOf = (g) => { const m = /(?:for|costs?|spend)\s+(\d+)\s+(Stability|Sanity)/i.exec(g.effect || "") || /(\d+)\s+(Stability|Sanity)\b/i.exec(g.effect || ""); return m ? { n: +m[1], pool: m[2].toLowerCase() } : null; };
  MECH.powers = (a) => giftsOf(a).map((x) => {
    const key = x.deity + ":" + x.n, auto = AUTO[key];
    const passive = PASSIVE.has(key) || (!auto && !costOf(x.gift) && /^(you|your|any|permanently|increase|this character|undead)/i.test(ph(x.gift.effect)));
    return { key, deity: x.deity, n: x.n, name: x.gift.name, text: ph(x.gift.effect), quote: x.gift.quote, lost: x.lost, cost: auto === "wrath" ? { n: 6, pool: "stability" } : auto === "tricks" ? { n: 5, pool: "stability" } : auto === "arrival" ? { n: 5, pool: "sanity" } : auto === "grace" ? null : costOf(x.gift),
      kind: x.lost ? "lost" : auto ? "auto" : passive ? "passive" : "narrative", auto };
  });

  const pay = (a, cost) => {
    if (!cost) return true;
    const p = a.pools[cost.pool];
    if (p.cur <= cost.n) { U.toast(`${a.short} doesn't have ${cost.n} ${R.POOL_LABEL[cost.pool]} to spare.`); return false; }
    p.cur -= cost.n; G.refreshParty && G.refreshParty(); return true;
  };
  MECH.pay = pay;

  /* run a power outside combat (or the non-combat part of one) */
  MECH.use = async (a, pw) => {
    if (pw.kind === "passive") { await U.modal({ title: pw.name, body: `<p><i>${ph(pw.quote)}</i></p><p>${pw.text}</p><p class="small">Always on.</p>`, buttons: [{ id: "ok", label: "OK" }] }); return false; }
    if (pw.kind === "lost") return false;
    if (pw.auto === "grace") return MECH.grace(a);
    if (pw.auto === "wrath" || pw.auto === "arrival") { U.toast("Use this one in a fight."); return false; }
    if (!pay(a, pw.cost)) return false;
    if (pw.auto === "tricks") {
      const st = G.state;
      if (st.gmFate > 0) { st.gmFate -= 1; a.fate += 1; U.toast(`${a.short} steals a Fate point from the GM.`); }
      else { a.fate += 2; U.toast(`${a.short} makes 2 Fate points from nothing.`); }
      G.refreshParty && G.refreshParty(); return true;
    }
    await U.modal({ title: pw.name, body: `<p><i>${ph(pw.quote)}</i></p><p>${pw.text}</p><p class="small">${pw.cost ? `Paid ${pw.cost.n} ${R.POOL_LABEL[pw.cost.pool]}. ` : ""}The effect is ruled at the table.</p>`, buttons: [{ id: "ok", label: "Done" }] });
    return true;
  };
  MECH.grace = async (a) => {
    a.graceLeft = a.graceLeft == null ? (a.graceMax || 10) : a.graceLeft;
    const refill = has(a, "God", 3) ? 2 : 5;
    const opts = [{ id: "heal", label: `Spend Grace on someone (${a.graceLeft} left)`, disabled: a.graceLeft <= 0 }, { id: "refill", label: `Refill Grace (${refill} Stability)` }, { id: "x", label: "Cancel" }];
    const c = await U.choose("God's Grace", opts);
    if (c === "refill") { if (!pay(a, { n: refill, pool: "stability" })) return false; a.graceLeft = a.graceMax || 10; U.toast("Grace is full."); return true; }
    if (c !== "heal") return false;
    const who = await U.choose("Heal whom?", G.active().map((x) => ({ id: x.id, label: `${x.short} (H ${x.pools.health.cur}/${x.pools.health.max}, S ${x.pools.sanity.cur}/${x.pools.sanity.max}, St ${x.pools.stability.cur}/${x.pools.stability.max})` })));
    const t = G.active().find((x) => x.id === who); if (!t) return false;
    const pool = await U.choose("Which pool?", ["health", "sanity", "stability"].map((k) => ({ id: k, label: `${R.POOL_LABEL[k]} (${t.pools[k].max - t.pools[k].cur} missing)` })));
    const n = Math.min(a.graceLeft, t.pools[pool].max - t.pools[pool].cur);
    if (n <= 0) { U.toast("Nothing to heal there."); return false; }
    t.pools[pool].cur += n; a.graceLeft -= n; AudioMan.sfx("heal"); G.refreshParty && G.refreshParty(); U.toast(`${t.short} recovers ${n} ${R.POOL_LABEL[pool]}.`);
    return true;
  };

  /* ------------------------------------------------------------ downtime actions (campaign characters) */
  const d6 = () => R.d6(), r2 = () => R.d6() + R.d6();
  MECH.downtime = async (a, ar, act) => {
    const day = CAMP.camp.day, S = (k) => R.aspect(a, k);
    const out = (t) => ({ text: t });
    ar.st = ar.st || {};
    if (act === "chalice") {
      if (ar.st.day !== day) ar.st = { day, drinks: 0, total: ar.st.total || 0 };
      if (ar.st.drinks >= 3) return out("The chalice is dry until tomorrow.");
      ar.st.drinks++; ar.st.total++;
      for (const k of ["health", "sanity", "stability"]) a.pools[k].cur = Math.min(a.pools[k].max, a.pools[k].cur + 10);
      const fx = d6();
      let t = `+10 in every pool. Beneficial effect roll: ${fx}. The effects table is ruled by your GM for the day.`;
      if (ar.st.total > 3) t += " It no longer offers extra options. Past the fourth drink, Challenging Aspect rolls guard against over-drinking.";
      return out(t);
    }
    if (act === "oldmen") {
      if (ar.st.day === day) return out("The book has given what it will today.");
      ar.st.day = day; ar.st.uses = (ar.st.uses || 0) + 1;
      const best = Math.max(S("occult"), S("faith"), S("ancient")), roll = r2(), ok = roll + best >= R.cr("easy");
      let age = 1; if (!ok) age += d6();
      a.age += age;
      let t = `${roll} + ${best} vs ${R.cr("easy")}: ${ok ? "success, +1 word" : "failed"}. You age ${age} year${age > 1 ? "s" : ""} (now ${a.age}).`;
      if (ok && a.magic) { const w = Object.keys(R.WORDS)[0]; a.words = a.words || {}; a.words[w] = (a.words[w] || 0) + 1; t += ` +1 ${w}.`; }
      if (ok && ar.st.uses % 3 === 0) { a.aspects.potency = (a.aspects.potency || 0) + 1; t += " Potency +1."; }
      if (a.age > 100) { a.status = "dead"; t += " You are older than a hundred. You die."; }
      return out(t);
    }
    if (act === "facts") {
      const res = Math.max(S("willpower"), S("morality"), S("durability")), roll = r2();
      if (roll + res >= 9) { a.pending = (a.pending || 0) + 1; return out(`${roll} + ${res} = ${roll + res} (9 needed): success. You gain a level (choose it from the Agents tab).`); }
      a.status = "dead"; return out(`${roll} + ${res} = ${roll + res}: your mind melts. ${a.name} dies and their knowledge joins the pages.`);
    }
    if (act === "suitcase") {
      if (ar.st.bad === day) return out("No more items today. It's a bad day.");
      const roll = d6();
      if (roll === 1) {
        ar.st.bad = day; ar.st.days = (ar.st.days || 0) + 1;
        const lose = a.assets.filter((x) => x.kind === "item"); let t = `1: a bad day (${ar.st.days}).`;
        if (lose.length) { const x = lose[Math.floor(R.rand() * lose.length)]; a.assets.splice(a.assets.indexOf(x), 1); t += ` ${x.name} is gone.`; }
        if (ar.st.days >= 7) { a.status = "lost"; t += " A week of bad days. You disappear into the suitcase."; }
        return out(t);
      }
      const ids = Object.keys(CAMP.ITEMS).filter((k) => !CAMP.ITEMS[k].med && !CAMP.ITEMS[k].food), id = ids[Math.floor(R.rand() * ids.length)], wc = roll === 6 ? 5 : 1;
      CAMP.addAsset(a, { kind: "item", ref: id, name: CAMP.itemName(id, CAMP.camp.year), wc });
      return out(`${roll}: you pull out ${CAMP.itemName(id, CAMP.camp.year)} (${CAMP.WC[wc]}).`);
    }
    if (act === "eyes") {
      const span = ar.st.span || 0; // 0: 3 days, 1: 1 week, 2: 1 month
      const crs = ["easy", "medium", "challenging"], roll = r2(), tot = roll + S("awareness"), cr = R.cr(crs[span]);
      if (tot >= cr) return out(`${roll} + ${S("awareness")} = ${tot} vs ${cr}: you watch the last ${["3 days", "week", "month"][span]} play out. Ask your GM what the scene shows.`);
      const yrs = r2(); a.pools.sanity.cur = Math.max(1, a.pools.sanity.cur - yrs);
      return out(`${tot} vs ${cr}: you looked too far. ${yrs} years of horror. -${yrs} Sanity.`);
    }
    return out("Nothing happens.");
  };
  MECH.eyesSpan = (ar, s) => { ar.st = ar.st || {}; ar.st.span = s; };

  /* weekly effects while days pass (called from CAMP.passDays) */
  MECH.weekly = (a, days) => {
    const notes = [];
    const day = window.CAMP.camp.day;
    if (a.drug && a.drug.last < day) { a.drug.clean = (a.drug.clean || 0) + 1; if (a.drug.clean >= 3) a.drug.user = false; }
    for (let d = 0; d < days; d++) {
      const af = a.afflict || {};
      if (af.disease) {
        const roll = r2() + R.aspect(a, "humors");
        if (roll < af.disease.cr) {
          for (const k of ["body", "mind", "spirit"]) a.core[k] = Math.max(0, a.core[k] - 1);
          notes.push(`${a.name}'s disease takes a toll (${roll} vs ${af.disease.cr}): every Core Stat falls by 1.`);
          if (Object.values(a.core).some((v) => v <= 0) && !a.survivor) { a.status = "dead"; notes.push(`${a.name} died of the disease.`); return notes; }
        } else notes.push(`${a.name} fights the disease off today (${roll} vs ${af.disease.cr}).`);
      }
      if (af.forgetfulness) {
        const dd = af.forgetfulness.d6, roll = dd ? R.d6() : r2() + R.aspect(a, "mindfulness");
        if (dd ? roll < 4 : roll < af.forgetfulness.cr) {
          const vault = (a.assets || []).some((x) => (x.kind === "housing" || x.kind === "vehicle") && (x.committed || x.owned) && x.mods.includes("Beyond Vault"));
          const items = vault ? [] : (a.assets || []).filter((x) => x.kind === "item" && x.state === "ok");
          const lost = items.length ? items[Math.floor(Math.random() * items.length)] : null;
          if (lost) { lost.state = "lost"; notes.push(`${a.name} forgets where they put something important: ${window.CAMP.itemDef(lost).name} is gone (${roll} vs ${af.forgetfulness.cr}).`); }
          else notes.push(`${a.name} loses the thread of something important (${roll} vs ${af.forgetfulness.cr}). Ask your GM what.`);
        }
      }
      if (af.exhausted === undefined && a.noSleep) { R.afflict(a, "exhausted"); }
    }
    for (const ar of a.artifacts || []) if (ar.equipped && ar.name === "CLAWS OF DEAD BOOGEYMEN" && (ar.memories || 0) < 5) {
      for (let d = 0; d < days; d++) {
        if (r2() !== 2) continue;
        a.pools.stability.cur = Math.max(1, a.pools.stability.cur - 1);
        const rolled = R.applyMutation(a).text;
        notes.push(`${a.name}'s Claws of Dead Boogeymen: a 2. The mutation takes hold and ${a.short} loses 1 Stability. ${rolled}`);
      }
    }
    for (const ar of a.artifacts || []) if (ar.equipped && ar.name === "THE BOOTS OF THE CRYING PRINCE") {
      ar.worn = (ar.worn || 0) + days;
      while (ar.worn >= 7) {
        ar.worn -= 7; a.aspects.charisma = (a.aspects.charisma || 0) + 1;
        let t = `${a.name}'s Charisma rises to ${a.aspects.charisma}.`;
        if ((ar.memories || 0) < 5 && r2() < R.cr("easy")) { a.injuries.push({ id: "boots_disorder", name: "Mental Disorder (Boots of the Crying Prince)", text: "Your GM chooses the disorder." }); t += " A mental disorder sets in."; }
        notes.push(t);
      }
    }
    return notes;
  };
})();
