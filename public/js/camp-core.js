/* ============================================================================
   CAMPAIGN CORE — saves, characters, economy, missions, level-ups.
   No drawing in here; camp-ui.js draws. Everything is plain data on CAMP.camp
   and is saved to localStorage after every change.
   ========================================================================== */
(function () {
  const C = window.CDATA, GD = window.GD, G = window.GAME, U = window.UI;
  const CAMP = (window.CAMP = {});
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const IDX = "beyond.camp.index.v1", KEY = (id) => "beyond.camp." + id + ".v1";
  const mem = {};   // fallback when localStorage is unavailable
  const rd = (k) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : (mem[k] || null); } catch (e) { return mem[k] || null; } };
  const wr = (k, v) => { mem[k] = v; try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const rm = (k) => { delete mem[k]; try { localStorage.removeItem(k); } catch (e) {} };
  const uid = (p = "x") => p + Math.random().toString(36).slice(2, 8);

  /* ---------------------------------------------------------------- extend the rules engine */
  R.TIERS[4] = { name: "Luxury", sp: 5, bonus: 4, uses: 4 };
  R.TIERS[5] = { name: "Exotic", sp: 6, bonus: 5, uses: 5 };
  const _mr = R.mr, _sr = R.sr;
  R.mr = (a) => _mr(a) + (a.mrBonus || 0);
  R.sr = (a) => _sr(a) + (a.srBonus || 0);
  CAMP.WC = ["", "Mundane", "Quality", "Advanced", "Luxury", "Exotic"];
  const costOf = (kind, wc) => { const w = GD.wealth[wc - 1]; return kind === "housing" ? w.housing : kind === "vehicle" ? w.transport : w.item; };
  CAMP.costOf = costOf;

  /* ---------------------------------------------------------------- shop catalog (items usable in checks) */
  CAMP.ITEMS = {
    flashlight: { name: "Flashlight", old: ["Oil lantern", 1900], icon: "flashlight", applies: ["aspect:awareness"], text: "Searching, spotting, noticing.", size: 1 },
    lockpicks: { name: "Lockpick set", icon: "lockpicks", applies: ["tag:lock", "aspect:iq"], text: "Locks and latches.", size: 1 },
    crowbar: { name: "Crowbar", icon: "crowbar", applies: ["aspect:strength"], text: "Forcing, lifting, prying.", size: 1 },
    rope: { name: "Rope", icon: "rope", applies: ["aspect:agility"], text: "Climbing, securing, binding.", size: 1 },
    book: { name: "Folklore reference", icon: "book", applies: ["tag:lore", "aspect:iq"], text: "Remembering history and legends.", size: 1 },
    camera: { name: "Camera", icon: "camera", applies: ["aspect:awareness", "tag:photo"], text: "Evidence, details, a second look.", size: 1, from: 1888 },
    recorder: { name: "Tape recorder", icon: "tape", applies: ["aspect:charisma", "tag:record"], text: "Interviews and evidence.", size: 1, from: 1950 },
    salt: { name: "Purifying salt", icon: "salt", applies: ["aspect:faith", "aspect:occult", "aspect:ancient"], text: "Rites, wards and banishings.", size: 1 },
    talisman: { name: "Holy symbol", icon: "talisman", applies: ["aspect:faith", "aspect:morality"], text: "Devotion, resolve.", size: 1 },
    charm: { name: "Lucky charm", icon: "omamori", applies: ["aspect:morality"], text: "Holding on to yourself.", size: 1 },
    flask: { name: "Strong coffee or spirits", icon: "medicine", applies: ["aspect:willpower"], text: "Staying in control.", size: 1 },
    knife: { name: "Utility knife", icon: "knife", applies: ["tag:cut", "aspect:agility"], text: "Cutting, scraping, opening.", size: 1 },
    notebook: { name: "Case notebook", icon: "journal", applies: ["aspect:iq", "aspect:awareness"], text: "Organized notes help investigations.", size: 1 },
    records: { name: "Records & maps", icon: "records", applies: ["aspect:iq", "tag:lore"], text: "Archives, plans, family trees.", size: 1 },
    medicine: { name: "Medicine", icon: "medicine", applies: [], text: "Heals in downtime: 3× the pool for the day, +1 per Wealth Class above Mundane.", size: 1, med: true },
    food: { name: "Provisions", icon: "records", applies: [], text: "Food: 1 Health a day, +2 per Wealth Class above Mundane.", size: 1, food: true }
  };
  CAMP.itemDef = (x) => x.custom || CAMP.ITEMS[x.ref] || { name: x.name, applies: [], size: 1, text: "" };
  CAMP.itemName = (id, year) => { const d = CAMP.ITEMS[id]; return d.old && year < d.old[1] ? d.old[0] : d.name; };

  /* ---------------------------------------------------------------- era flavour for weapons and armor names */
  CAMP.GEAR_HINTS = (year) => year < 1300 ? { melee: "longsword, mace, war axe", ranged: "crossbow, short bow", armor: "mail hauberk, gambeson" }
    : year < 1850 ? { melee: "saber, boarding axe", ranged: "flintlock pistol, musket", armor: "greatcoat, leather brigandine" }
      : year < 1910 ? { melee: "cane sword, fire axe", ranged: "revolver, shotgun", armor: "frock coat, oilskin" }
        : year < 1950 ? { melee: "trench club, bayonet", ranged: "Webley revolver, Lee-Enfield", armor: "trench coat, steel helmet" }
          : year < 1990 ? { melee: "fire axe, crowbar", ranged: "revolver, pump shotgun", armor: "raincoat, flak vest" }
            : year < 2022 ? { melee: "tire iron, katana", ranged: "9mm pistol, assault rifle", armor: "kevlar vest, leather jacket" }
              : { melee: "monomolecular blade, stun baton", ranged: "smart pistol, carbine", armor: "plate carrier, smart fabric" };

  /* ---------------------------------------------------------------- storage */
  CAMP.list = () => (rd(IDX) || []).sort((a, b) => b.updated - a.updated);
  CAMP.save = () => {
    const c = CAMP.camp; if (!c) return;
    c.updated = Date.now();
    wr(KEY(c.id), c);
    const idx = (rd(IDX) || []).filter((x) => x.id !== c.id);
    idx.push({ id: c.id, name: c.name, year: c.year, agency: c.agency, updated: c.updated, chars: c.chars.filter((x) => x.status === "active").length });
    wr(IDX, idx);
  };
  CAMP.peek = (id) => rd(KEY(id));
  CAMP.load = (id) => { const c = rd(KEY(id)); if (c) { CAMP.camp = c; CAMP.migrate(c); } return c; };
  CAMP.remove = (id) => { rm(KEY(id)); rm("beyond.mission." + id); wr(IDX, (rd(IDX) || []).filter((x) => x.id !== id)); if (CAMP.camp && CAMP.camp.id === id) CAMP.camp = null; };
  CAMP.migrate = (c) => { c.favors = c.favors || []; c.log = c.log || []; c.history = c.history || []; c.retired = c.retired || []; c.rules = c.rules || { rest: "rulebook" }; c.day = c.day || 0; for (const ch of c.chars) { ch.portraitKey = window.ART.portrait(ch.look); ch.portrait = ch.portraitKey; ch.grants = ch.grants || { artifact: 0, patron: 0 }; } };

  CAMP.newCampaign = ({ name, year, agency }) => {
    const c = { id: uid("c"), name: name || "Untitled campaign", year, agency, day: 0, created: Date.now(), updated: Date.now(), chars: [], retired: [], favors: [], log: [], history: [],
      casesSolved: 0, missionsDone: 0, rules: { rest: "rulebook" }, mission: null };
    CAMP.camp = c; CAMP.save();
    return c;
  };
  CAMP.logAdd = (text) => { const c = CAMP.camp; c.log.unshift({ day: c.day, text }); if (c.log.length > 200) c.log.length = 200; };
  CAMP.agency = () => C.AGENCIES.find((a) => a.id === CAMP.camp.agency);
  CAMP.active = () => CAMP.camp.chars.filter((c) => c.status === "active");
  CAMP.char = (id) => CAMP.camp.chars.find((c) => c.id === id);

  /* ================================================================ character building
     draft = { name, age, bio, look, size, languages, coreRank:{body,mind,spirit} each "specialty"|"good"|"mundane",
               aspects:{key:n}, bg, bgCore, bgAspect, bgBody, magic:{on,source}, bonds:[{name,rel}],
               weapon:{name,type,mods:[],specialty,aspect}, armor:{name,type,mods:[],specialty} }          */
  CAMP.blankDraft = () => ({
    name: "", origin: "", sex: "", age: 30, bio: "", look: { skin: "#c68d62", hairC: "#3a2619", hair: "short", outfit: "#3a4a5c", extra: "none", bg: "#2b2f3a", clothes: "coat", face: "oval", eyes: "plain", eyeC: "#5a3a22", brows: "straight", nose: "straight", mouth: "neutral", facial: "none", marks: "none" }, size: "medium", languages: "",
    coreRank: { body: "good", mind: "specialty", spirit: "mundane" }, aspects: {}, bg: "", bgCore: "body", bgAspect: "strength",
    magic: { on: false, source: "faith" }, bonds: [{ name: "", rel: "" }, { name: "", rel: "" }, { name: "", rel: "" }],
    weapon: { name: "", type: "Ranged One-Handed", mods: [], specialty: "", aspect: "awareness", picks: {} },
    armor: { name: "", type: "Light", mods: [], specialty: "", picks: {} }
  });
  const RANK_VALUE = { specialty: 4, good: 3, mundane: 1 };
  CAMP.aspectSlots = (rank) => ({ specialty: [4, 3, 2, 1], good: [3, 2, 1], mundane: [2, 1] }[rank]);
  CAMP.bgDef = (id) => C.BACKGROUNDS.find((b) => b.id === id);

  /* the Aspect that a weapon uses to attack, given its mods */
  CAMP.weaponAspects = (w, aspects = {}) => {
    const t = C.WEAPON_TYPES.find((x) => x.name === w.type) || C.WEAPON_TYPES[0];
    const base = /Ranged/.test(w.type) ? "awareness" : "strength";
    const set = [base];
    if ((w.mods || []).includes("Light") && !/Ranged/.test(w.type)) set.push("agility");
    if ((w.mods || []).includes("Holy")) set.push("faith");
    if ((w.mods || []).includes("Magic")) set.push("occult", "ancient");
    return set;
  };
  /* Veteran Hunter: one additional Modifier on the weapon. Engineer: any Modifier on any weapon. */
  CAMP.weaponModCount = (bg) => (bg === "Veteran Hunter" ? 3 : 2);
  CAMP.weaponValid = (w, bg) => {
    const errs = [], need = CAMP.weaponModCount(bg);
    const t = GD.weaponTypes.find((x) => x.name === w.type);
    if (!w.name.trim()) errs.push("Name the weapon.");
    if ((w.mods || []).length !== need) errs.push(`Choose exactly ${need} Modifiers.`);
    if (!w.specialty) errs.push("Choose 1 Specialty.");
    const ranged = /Ranged/.test(w.type);
    const banned = ranged ? GD.bannedRanged : GD.bannedMelee;
    if (bg !== "Engineer") for (const m of w.mods || []) {
      if (banned.includes(m)) errs.push(`${m} cannot go on a ${ranged ? "ranged" : "melee"} weapon.`);
      for (const other of GD.weaponTypes) if (other.name !== w.type && other.only.includes(m) && !(m === "Throwing")) errs.push(`${m} belongs to ${other.name} weapons.`);
    }
    return errs;
  };

  CAMP.buildChar = (d, year, agencyId) => {
    const bg = CAMP.bgDef(d.bg);
    const core = {};
    for (const k of ["body", "mind", "spirit"]) core[k] = RANK_VALUE[d.coreRank[k]];
    let bgCore = bg && bg.core;
    if (bgCore === "choice") bgCore = d.bgCore;
    if (bgCore === "choice2") bgCore = d.bgBody === "mind" ? "mind" : "body";
    if (bgCore) core[bgCore] += 1;
    const aspects = {};
    for (const k of Object.keys(C.ASPECT_NAMES)) aspects[k] = d.aspects[k] || 0;
    if (bg && bg.aspectPlus) aspects[d.bgAspect] = (aspects[d.bgAspect] || 0) + bg.aspectPlus;
    const special = Object.entries(d.aspects).find(([k, v]) => v === 4 && C.ASPECTS[d.coreRank.body === "specialty" ? "body" : d.coreRank.mind === "specialty" ? "mind" : "spirit"].includes(k));
    const size = C.SIZES.find((s) => s.id === d.size) || C.SIZES[2];
    const wt = C.WEAPON_TYPES.find((x) => x.name === d.weapon.type);
    const wbonus = (d.weapon.mods.includes("Empowered") && d.weapon.type === "Melee One-Handed") ? 3 : wt.bonus;
    const gt = GD.weaponTypes.find((x) => x.name === d.weapon.type);
    const at = GD.armorTypes.find((x) => x.name === d.armor.type);
    const sfx = /Ranged/.test(d.weapon.type) ? "gunshot" : d.weapon.type.includes("Two") ? "axe_hit" : "blade_hit";
    const poolMax = { health: 5 + 5 * core.body + size.health + (bg && bg.hp || 0), sanity: 5 + 5 * core.mind, stability: 5 + 5 * core.spirit };
    const a = {
      id: uid("a"), name: d.name.trim(), short: d.name.trim().split(/\s+/)[0], jp: "", origin: d.origin || "", sex: d.sex || "", age: d.age, bio: d.bio, look: clone(d.look), portrait: null,
      role: bg ? bg.group : "", background: d.bg, bgText: bg ? bg.text : "", size: d.size, languages: d.languages,
      core, special: special ? special[0] : null, aspects, poolMax, vision: "normal",
      weapon: { name: d.weapon.name.trim(), type: d.weapon.type, bonus: wbonus, range: gt.zones || 0, aspect: d.weapon.aspect, mods: [...d.weapon.mods], specialty: d.weapon.specialty, picks: { ...(d.weapon.picks || {}) }, owners: d.weaponOwners != null ? d.weaponOwners : undefined, sfx },
      armor: { name: d.armor.name.trim(), type: d.armor.type, br: at.br + size.br, er: at.er + size.er, mods: [...d.armor.mods], specialty: d.armor.specialty, picks: { ...(d.armor.picks || {}) }, owners: d.armorOwners != null ? d.armorOwners : undefined },
      brBonus: (bg && bg.brBonus || 0), mrBonus: bg && bg.mrsr || 0, srBonus: bg && bg.mrsr || 0,
      traits: { ...(bg && bg.trait ? { [bg.trait]: true } : {}), ...(d.armor.specialty === "Torch Bearer" ? { torchBearer: true } : {}), ...(d.armor.specialty === "Last Stand" ? { lastStand: true } : {}) },
      fate: 1 + (bg && bg.extraFate || 0), baseFate: 1 + (bg && bg.extraFate || 0),
      bonds: d.bonds.map((b) => ({ name: b.name.trim(), rel: b.rel.trim(), type: window.BONDS ? BONDS.typeOf(b) : undefined, origin: b.origin || d.origin || undefined, value: bg && bg.bonds15 ? 15 : 10 })),
      items: [], injuries: [], noticed: 0, level: 1, missions: 0, levelUps: 0, pending: d.startLevel === 2 ? 1 : 0, solved: 0,
      sp: 7 + (bg && bg.spBonus || 0), promotions: 0, grants: { artifact: bg && bg.artifact ? 1 : 0, patron: bg && bg.patron ? 1 : 0 }, portraitKey: null, assets: [], artifacts: [], patrons: [], questions: [], status: "active", doomed: null, agency: agencyId, since: year
    };
    if (size.attack) a.attackSize = size.attack;
    if (d.magic.on) a.magic = { source: d.magic.source }, a.words = {};
    a.pools = { health: { cur: poolMax.health, max: poolMax.health }, sanity: { cur: poolMax.sanity, max: poolMax.sanity }, stability: { cur: poolMax.stability, max: poolMax.stability } };
    if (bg && bg.artifact && d.pickArtifact) { const def = GD.artifacts.find((x) => x.name === d.pickArtifact); if (def) { a.artifacts.push({ name: def.name, custom: false, def: null, memories: 0, equipped: false }); a.grants.artifact = 0; } }
    if (bg && bg.patron && d.pickPatron) { a.patrons.push({ deity: d.pickPatron, gifts: 1 }); a.grants.patron = 0; window.MECH.syncGifts(a); }
    a.look.name = a.name;
    a.portraitKey = window.ART.portrait(a.look); a.portrait = a.portraitKey;
    return a;
  };

  /* returns [] when the draft is complete enough to build */
  CAMP.draftErrors = (d) => {
    const e = [];
    if (!d.name.trim()) e.push("Give your agent a name.");
    const ranks = Object.values(d.coreRank);
    if (new Set(ranks).size !== 3) e.push("Assign Specialty, Good and Mundane to different Core Stats.");
    else for (const k of ["body", "mind", "spirit"]) {
      const slots = CAMP.aspectSlots(d.coreRank[k]).slice().sort();
      const got = C.ASPECTS[k].map((a) => d.aspects[a] || 0).filter(Boolean).sort();
      if (JSON.stringify(slots) !== JSON.stringify(got)) e.push(`Spend all ${k[0].toUpperCase() + k.slice(1)} Aspect points (${CAMP.aspectSlots(d.coreRank[k]).join(", ")}).`);
    }
    if (!d.bg) e.push("Choose a background.");
    if (d.bg) { const bg = CAMP.bgDef(d.bg); if (bg.artifact && !d.pickArtifact) e.push("Choose your Beyond Artifact."); if (bg.patron && !d.pickPatron) e.push("Choose your patron."); if (bg.aspectPlus && !d.bgAspect) e.push("Choose the Aspect for your +2."); }
    if (d.bonds.some((b) => !b.name.trim())) e.push("Name all three Bonds.");
    e.push(...CAMP.weaponValid(d.weapon, d.bg));
    if ((d.armor.mods || []).length !== 2) e.push("Choose exactly 2 armor Modifiers.");
    if (!d.armor.specialty) e.push("Choose 1 armor Specialty.");
    if (!d.armor.name.trim()) e.push("Name the armor.");
    return e;
  };

  /* ================================================================ economy */
  CAMP.spMax = (a) => (window.MECH && window.MECH.unlimitedSP(a) ? 99 : a.sp + a.promotions);
  CAMP.assetCost = (a, as) => (as.owned || as.guest ? 0 : as.waived ? 0 : costOf(as.kind, as.wc));
  /* Guests: a service you let move in costs nothing, for good. Capacity comes from housing plus Guest Rooms. */
  CAMP.guestCap = (a) => a.assets.filter((x) => x.kind === "housing" && (x.committed || x.owned) && x.state === "ok").reduce((s, x) => s + (GD.wealth[x.wc - 1].hGuests || 0) + x.mods.filter((m) => m === "Guest Room").length, 0);
  CAMP.guestCount = (a) => a.assets.filter((x) => x.guest).length;
  /* Property stats: a Construct. Advanced and up add +10 to each pool and +2 to each resistance; Fortified adds +2 and +5 */
  CAMP.propStats = (x) => {
    const base = x.kind === "housing" ? 30 : 15, up = x.wc >= 3, fort = x.mods.includes("Fortified");
    const pool = base + (up ? 10 : 0) + (fort ? 5 : 0), res = (up ? 2 : 0) + (fort ? 2 : 0);
    return { pool, br: 10 + res, mr: 20 + res, sr: 20 + res, traps: x.mods.filter((m) => m === "Trapped").length };
  };
  CAMP.committed = (a) => a.assets.filter((x) => x.committed || x.owned);
  CAMP.spUsed = (a) => a.assets.filter((x) => x.committed && !x.owned).reduce((s, x) => s + CAMP.assetCost(a, x) * (1 + (x.extra || 0)), 0);
  CAMP.vehicleSlots = (a) => a.assets.filter((x) => x.kind === "vehicle" && (x.committed || x.owned) && x.state === "ok").reduce((s, x) => s + (GD.wealth[x.wc - 1].tStorage || 0) + (x.mods.includes("Well-Stocked") ? 12 : 0), 0);
  CAMP.carryLimit = (a) => 6 + (a.background === "Mule" ? 2 : 0) + CAMP.vehicleSlots(a) + (window.GEAR ? window.GEAR.storageBonus(a) : 0);
  CAMP.carried = (a) => a.assets.filter((x) => x.kind === "item" && (x.committed || x.owned) && x.state === "ok").reduce((s, x) => s + (CAMP.itemDef(x).size || 1), 0);
  CAMP.favorsFor = (wc) => CAMP.camp.favors.filter((f) => f.wc >= wc).length;

  CAMP.addAsset = (a, def) => {
    const as = { uid: uid("s"), kind: def.kind, ref: def.ref || null, name: def.name, wc: def.wc, mods: def.mods || [], committed: false, state: "ok", dis: 0, secure: 0, secureOn: false, owned: false, waived: false, note: def.note || "" };
    a.assets.push(as);
    return as;
  };
  CAMP.commitCheck = (a) => {
    const e = [];
    if (CAMP.spUsed(a) > CAMP.spMax(a)) e.push(`${a.short} has committed ${CAMP.spUsed(a)} of ${CAMP.spMax(a)} Spending Power.`);
    if (CAMP.carried(a) > CAMP.carryLimit(a)) e.push(`${a.short} is carrying ${CAMP.carried(a)} of ${CAMP.carryLimit(a)} storage slots.`);
    return e;
  };
  CAMP.useFavor = (a, as) => {
    const f = CAMP.camp.favors.findIndex((x) => x.wc >= as.wc);
    if (f < 0 || as.waived) return false;
    CAMP.camp.favors.splice(f, 1); as.waived = true; as.committed = true; CAMP.save(); return true;
  };

  /* After each mission: uncommitted assets slip toward Disrepair and Ruin, over-commits progress. */
  CAMP.settleAssets = (a) => {
    const notes = [];
    const hk = a.assets.find((s) => s.kind === "service" && s.ref === "Housekeeper" && s.wc >= 2 && (s.committed || s.owned));
    let protect = hk ? 1 + hk.wc : 0;
    a.labUsed = 0; a.foodUsed = 0;
    for (const as of [...a.assets]) {
      if (as.kind === "service") { as.used = 0; as.extra = 0; }
      if (as.owned) continue;
      if (as.guest) { as.committed = true; as.used = 0; as.extra = 0; continue; }
      if (as.kind === "service" && as.ref !== "Apprentice") { as.committed = false; as.waived = false; continue; }
      if (as.committed) {
        as.dis = 0; as.state = "ok";
        if (as.secureOn) { as.secure += 1; if (as.secure >= 3) { as.owned = true; notes.push(`${as.name} is now yours for good.`); } }
      } else {
        as.dis += 1; as.state = "disrepair";
        if (as.dis >= 3 && protect > 0) { protect -= 1; as.dis = 2; notes.push(`${as.name} would have been Ruined, but your Housekeeper kept it together.`); }
        else if (as.dis >= 3) { a.assets.splice(a.assets.indexOf(as), 1); notes.push(`${as.name} fell into Ruin after 3 missions in Disrepair.`); }
        else notes.push(`${as.name} is in Disrepair (${as.dis}/3). Commit it to repair it.`);
      }
      as.committed = false; as.waived = false;
    }
    return notes;
  };

  /* ================================================================ resting (downtime) */
  CAMP.restBonuses = (a) => {
    const housing = a.assets.filter((x) => x.kind === "housing" && (x.committed || x.owned) && x.state === "ok");
    const has = (m) => housing.some((h) => h.mods.includes(m));
    return { warm: has("Warm Beds") ? 2 : 0, food: has("Free Food"), lab: has("Medical Lab"), housingWc: Math.max(0, ...housing.map((h) => h.wc)) };
  };
  CAMP.restDay = (a, o = {}) => {
    if (a.status !== "active") return null;
    const rb = CAMP.restBonuses(a), asp = (k) => R.aspect(a, k);
    const med = a.assets.find((x) => x.kind === "item" && CAMP.itemDef(x).med && (x.committed || x.owned) && x.state === "ok");
    const labLeft = rb.lab ? 3 - (a.labUsed || 0) : 0;
    const freeFood = rb.food && (a.foodUsed || 0) < 8;
    const noFood = R.fx(a, "noFood");
    const food = !noFood && (freeFood || a.assets.some((x) => x.kind === "item" && CAMP.itemDef(x).food && (x.committed || x.owned) && x.state === "ok"));
    if (freeFood && !a.assets.some((x) => x.kind === "item" && CAMP.itemDef(x).food && (x.committed || x.owned) && x.state === "ok")) a.foodUsed = (a.foodUsed || 0) + 1;
    const gain = { health: 0, sanity: 0, stability: 0 };
    if (R.fx(a, "insomnia")) { const d = R.d6(); if (d <= 3) { gain.note = `Insomnia (${d}): ${a.short} could not sleep tonight.`; return gain; } }
    window.GEAR.longRest(a);
    /* Rest Options (rulebook p.47): choose ONE each night. Natural Recovery 2 + Humors Health;
       Therapy 1 + Mindfulness Sanity; Meditation 1 + Potency Stability. A favourite pastime adds +1 to Therapy or Meditation. */
    if (o.mode === "meditate") gain.stability += 1 + asp("potency") + (a.pastime ? 1 : 0);
    else if (o.mode === "therapy") gain.sanity += 1 + asp("mindfulness") + (a.pastime ? 1 : 0);
    else gain.health += 2 + asp("humors");
    if (food) gain.health += 1 + 2 * Math.max(0, (rb.housingWc || 1) - 1);
    if (o.useMedicine && (med || labLeft > 0)) { const m = med ? med.wc : rb.housingWc; gain[o.medicinePool || "health"] += 3 + (m - 1); if (!med) a.labUsed = (a.labUsed || 0) + 1; }
    for (const k of Object.keys(gain)) if (gain[k] && rb.warm) gain[k] += rb.warm;
    if (o.drug) {
      const wcUp = Math.max(0, (rb.housingWc || 1) - 1);
      a.drug = { last: CAMP.camp.day, user: true, clean: 0, boost: 2 + wcUp };
    }
    if (!R.canHeal(a)) { for (const k of Object.keys(gain)) gain[k] = 0; }
    for (const k of Object.keys(gain)) a.pools[k].cur = Math.min(a.pools[k].max, a.pools[k].cur + gain[k]);
    return gain;
  };
  CAMP.passDays = (n) => {
    const c = CAMP.camp, notes = [];
    for (let i = 0; i < n; i++) {
      c.day += 1;
      for (const a of c.chars) if (a.status === "active") { notes.push(...window.MECH.weekly(a, 1)); notes.push(...window.GEAR.daily(a)); }
      for (const a of c.chars) if (a.status === "active" && a.doomed != null) {
        a.doomed -= 1;
        if (a.doomed <= 0) { a.status = "dead"; notes.push(`${a.name} died, as the Death Die foretold. ${a.doomText || ""}`); CAMP.logAdd(`${a.name} died of their wounds.`); }
      }
    }
    return notes;
  };
  CAMP.fullHealth = (a) => ["health", "sanity", "stability"].every((k) => a.pools[k].cur >= a.pools[k].max);

  /* ================================================================ level ups */
  CAMP.aspectCap = (a, k) => (a.special === k ? a.level + 3 : a.level + 2);
  CAMP.canRetire = (a) => a.levelUps >= 3 && a.status === "active";
  CAMP.levelUp = (a, o) => {
    // o: { core, aspects:{k:+n} (total 2), benefit:'answers'|'artifact'|'patron'|'recovery'|'promotion', ... }
    a.level += 1; a.levelUps += 1; a.pending -= 1;
    a.core[o.core] += 1; a.poolMax[{ body: "health", mind: "sanity", spirit: "stability" }[o.core]] += 5;
    const pk = { body: "health", mind: "sanity", spirit: "stability" }[o.core];
    a.pools[pk].max += 5; a.pools[pk].cur += 5;
    for (const [k, n] of Object.entries(o.aspects || {})) a.aspects[k] = (a.aspects[k] || 0) + n;
    if (o.benefit === "promotion") a.promotions += 1;
    if (o.benefit === "artifact") a.grants.artifact += 1;
    if (o.benefit === "patron") a.grants.patron += 1;
    if (o.benefit === "answers") a.questions.push({ q: o.question || "", a: "" });
    if (o.benefit === "recovery" && a.injuries.length) { const i = a.injuries.splice(o.injury || 0, 1)[0]; }
    CAMP.logAdd(`${a.name} reached level ${a.level} (${o.benefit}).`);
  };
  CAMP.retire = (a) => {
    a.status = "retired"; CAMP.camp.retired.push({ name: a.name, level: a.level, solved: a.solved, day: CAMP.camp.day, bg: a.background });
    CAMP.logAdd(`${a.name} retired at level ${a.level}.`);
  };

  /* ================================================================ artifacts */
  CAMP.artifactDefs = () => GD.artifacts.map((x) => ({ ...x, id: x.name }));
  /* Spoils of the Void: a fallen agent leaves something precious behind. The GM's secrets (modifier, debuff, five memories) are rolled here. */
  const SP_MODS = ["Modifier: This weapon gains +5 Attack.", "Modifier: +2 to every Awareness and Mindfulness roll while carried.", "Modifier: The bearer gains +3 BR.", "Modifier: The bearer gains +3 MR and +3 SR.", "Modifier: Once a mission the bearer may reroll one failed roll.", "Modifier: The bearer ignores the first 5 damage from any single Attack."];
  const SP_DEB = ["Debuff: The bearer loses 1 Stability every day it is carried.", "Debuff: The bearer takes a -2 penalty to Charisma rolls.", "Debuff: The bearer cannot rest on the night they sleep near it, on a 1-2 on 1d6.", "Debuff: Every time the bearer is Noticed, they are Noticed twice.", "Debuff: The bearer hears the previous owner whisper when they are alone, and loses 1 Sanity each day.", "Debuff: The bearer takes 2 extra damage from every Damage Type."];
  CAMP.makeSpoils = (ch, item, story) => {
    const c = CAMP.camp, pick = (l) => l[Math.floor(R.rand() * l.length)], first = ch.name.split(" ")[0];
    const mems = [`"${first} sat at a kitchen table with a cup gone cold, ${story ? story.slice(0, 80) : "listening to the quiet"}, and decided to keep going."`, `"You remember the first time you saw the Beyond. You told no one. It was easier that way."`, `"${ch.bonds && ch.bonds[0] ? ch.bonds[0].name : "Someone"} called, and you let it ring."`, `"There was a room you were not supposed to open. You opened it."`, `"The last thing you held was this, and you knew it would be the last."`];
    const def = { custom: true, spoils: true, name: item.toUpperCase(), text: `Left behind by ${ch.name}. ${story || ""}`.trim(), effects: pick(SP_MODS), drawback: pick(SP_DEB), memories: mems.map((t, i) => ({ n: i + 1, text: t })) };
    c.spoils = c.spoils || []; c.spoils.push(def); ch.spoiled = true; CAMP.logAdd(`${ch.name}'s ${item} joins the Beyond Artifacts.`); CAMP.save();
    return def;
  };
  CAMP.giveArtifact = (a, def) => {
    if (a.artifacts.some((x) => x.name === def.name)) return false;
    a.artifacts.push({ name: def.name, custom: !!def.custom, def: def.custom ? def : null, memories: 0, equipped: false });
    return true;
  };
  CAMP.artifactData = (ar) => ar.custom ? ar.def : GD.artifacts.find((x) => x.name === ar.name);
  const MEM_CR = ["easy", "medium", "challenging", "dangerous", "dangerous"];
  CAMP.memoryCR = (n) => MEM_CR[n];

  /* ================================================================ missions */
  CAMP.allAdventures = () => {
    const seen = new Map();
    for (const a of Object.values(window.ADV.LIBRARY)) seen.set(a.id, a);
    if (window.ADVENTURES["death-of-a-bloodline"]) seen.set("death-of-a-bloodline", window.ADVENTURES["death-of-a-bloodline"]);
    return [...seen.values()];
  };
  CAMP.advList = () => {
    const c = CAMP.camp, era = C.eraOf(c.year);
    return CAMP.allAdventures().filter((m) => m.year >= era.from && m.year <= era.to && (m.agencies || []).includes(c.agency)).sort((x, y) => x.year - y.year);
  };
  CAMP.advMeta = (id) => CAMP.allAdventures().find((m) => m.id === id);

  CAMP.loadAdventure = (id) => {
    const adv = window.ADV.get(id);
    const M = window.MODULE;
    for (const k of Object.keys(M)) delete M[k];
    Object.assign(M, adv);
    window.UI.flavor(adv.flavor || "");
    const year = adv.year || CAMP.camp.year;
    M.items = Object.assign({}, adv.items || {}, Object.fromEntries(Object.entries(CAMP.ITEMS).map(([k, v]) => [k, { ...v, name: CAMP.itemName(k, year) }])));
    return M;
  };

  CAMP.premades = () => (window.ADVENTURES["death-of-a-bloodline"] ? window.ADVENTURES["death-of-a-bloodline"].agents : []);

  CAMP.partyDefs = (ids, fillPremade) => {
    const defs = ids.map((id) => {
      const ch = CAMP.char(id), d = clone(ch);
      d.items = d.assets.filter((x) => x.kind === "item" && (x.committed || x.owned) && x.state === "ok").map((x) => (x.custom ? { id: "cu_" + x.uid, tier: x.wc, def: { ...x.custom, custom: true, name: x.name } } : { id: x.ref, tier: x.wc }));
      d.portrait = ch.portraitKey || window.ART.portrait(ch.look);
      d.fate = ch.baseFate + (window.GEAR && window.GEAR.a(ch, "Plot Armor") ? 1 : 0) + (ch.bonusFate || 0) + (ch.fateBank || 0);
      d.core = clone(ch.core);
      const live = ch.assets.filter((x) => (x.kind === "housing" || x.kind === "vehicle") && (x.committed || x.owned) && x.state === "ok");
      const has = (m) => live.filter((x) => x.mods.includes(m));
      d.prop = { easyEscape: has("Easy Escape").length > 0, fast: has("Fast").length > 0, flying: has("Flying").length > 0, vault: has("Beyond Vault").length > 0, hidden: has("Hidden").length > 0,
        decorated: has("Well Decorated").length > 0, guns: has("Guns").map((x) => x.wc), traps: live.reduce((s, x) => s + x.mods.filter((m) => m === "Trapped").length, 0) };
      window.MECH.applyArtifacts(d, ch);
      window.MECH.applyGifts(d, ch);
      window.GEAR.applySight(d, ch);
      if (d.magic) { d.words = ch.words || {}; d.wordLoss = ch.wordLoss || 0; }
      d._campId = ch.id; if (ch.ownerUid) d.ownerUid = ch.ownerUid;
      return d;
    });
    if (fillPremade && defs.length < 3) {
      const taken = new Set();
      for (const p of CAMP.premades()) { if (defs.length >= 3) break; if (!taken.has(p.id)) { defs.push(clone(p)); taken.add(p.id); } }
    }
    return defs;
  };

  CAMP.startMission = async (advId, ids, opts = {}) => {
    const c = CAMP.camp;
    const M = CAMP.loadAdventure(advId);
    const defs = CAMP.partyDefs(ids, M.id === "death-of-a-bloodline" && opts.fill !== false);
    for (const id of ids) { const ch = CAMP.char(id); for (const e of CAMP.commitCheck(ch)) throw new Error(e); }
    G.saveKey = "beyond.mission." + c.id;
    G.state = G.newState(defs);
    // enter with the wounds they carry
    for (const a of G.state.agents) {
      const ch = a._campId && CAMP.char(a._campId);
      if (ch) for (const k of ["health", "sanity", "stability"]) { a.pools[k].cur = Math.max(1, ch.pools[k].cur); a.pools[k].max = ch.pools[k].max; }
    }
    G.state.guards = window.SVC ? window.SVC.allies(ids) : [];
    G.state.phase = "explore";
    c.mission = { adv: advId, ids, fill: opts.fill !== false, startedDay: c.day };
    CAMP.save();
    await AudioMan.unlock();
    AudioMan.applyVolumes();
    AudioMan.preload(["ui_click", "dice_roll", "roll_success", "roll_fail", "clue", "footsteps"]);
    AudioMan.music("investigation");
    G.enterGame(true);
  };

  CAMP.resumeMission = async () => {
    const c = CAMP.camp;
    if (!c.mission) return false;
    const save = G.loadSave && (G.saveKey = "beyond.mission." + c.id, G.loadSave());
    if (!save || save.adv !== c.mission.adv) { c.mission = null; CAMP.save(); return false; }
    CAMP.loadAdventure(save.adv);
    G.state = save.state;
    await AudioMan.unlock();
    AudioMan.applyVolumes();
    G.enterGame(false);
    return true;
  };

  CAMP.abandon = () => { const c = CAMP.camp; G.clearSave(); c.mission = null; CAMP.save(); if (CAMP.playtest) return CAMP.ui.gmBack(); CAMP.ui.hub(); };
  CAMP.suspend = () => { if (CAMP.playtest) { G.clearSave(); AudioMan.music(null); return CAMP.ui.gmBack(); } G.save(); CAMP.save(); AudioMan.music(null); CAMP.ui.hub(); };

  /* Ends the adventure currently being played (called by the runner and by the legacy debrief). */
  CAMP.endAdventure = async (kind) => {
    const M = window.MODULE;
    G.state.phase = "ending";
    G.clearSave();
    const prim = M.objectives.filter((o) => o.kind === "primary");
    const primDone = prim.filter((o) => G.state.obj[o.id] === "done").length;
    const solved = kind === "win" && primDone === prim.length;
    return CAMP.debrief({ kind: kind === "wiped" ? "failed" : (solved ? "solved" : "failed"), solved, primDone, primTotal: prim.length });
  };
  CAMP.legacyDone = (r) => CAMP.debrief({ kind: r.solved ? "solved" : "failed", solved: r.solved, primDone: r.primDone, primTotal: r.primTotal });

  CAMP.debrief = (r) => {
    const c = CAMP.camp, M = window.MODULE;
    const m = c.mission || { ids: [] };
    const out = { solved: r.solved, primDone: r.primDone, primTotal: r.primTotal, title: M.title, lines: [], favors: 0, levelUps: [] };
    for (const a of G.state.agents) {
      const ch = a._campId && CAMP.char(a._campId);
      if (!ch) continue;
      ch.core = clone(a.core); ch.afflict = clone(a.afflict || {}); ch.drug = a.drug ? clone(a.drug) : ch.drug; ch.crippled = !!a.crippled; ch.injuries = clone(a.injuries); ch.noticed = a.noticed || 0; ch.bonds = clone(a.bonds);
      for (const k of ["health", "sanity", "stability"]) { ch.pools[k] = { cur: Math.max(a.dead ? 0 : 1, a.pools[k].cur), max: a.pools[k].max }; ch.poolMax[k] = a.pools[k].max; }
      if (a.magic) { ch.wordLoss = a.wordLoss || 0; ch.words = ch.words || {}; let tot = Object.values(ch.words).reduce((x, n) => x + n, 0); const cap = R.wordPoolMax(ch); for (const w of Object.keys(ch.words)) while (tot > cap && ch.words[w] > 0) { ch.words[w] -= 1; tot -= 1; } }
      /* Fate Points do not expire (rulebook p.14): whatever is left over is stored for later missions. */
      ch.fateBank = Math.max(0, a.fate || 0); ch.fate = ch.baseFate + ch.fateBank; ch.bonusFate = 0;
      if (a.dead) { ch.status = "dead"; out.lines.push(`${ch.name} did not come back. ${a.deathText || ""}`); CAMP.logAdd(`${ch.name} died on ${M.title}.`); continue; }
      if (a.marked === "days") { ch.doomed = 2 + Math.floor(R.rand() * 4); ch.doomText = R.deathCause(a.markedPool || "health", ch.name.split(" ")[0]); out.lines.push(`${ch.name} is marked for death and has ${ch.doomed} days left. Only a miracle can change that.`); }
      else if (a.marked) out.lines.push(`${ch.name} was marked for death, but the fever broke on the sixth day: a recovery, and an injury that won't heal.`);
      ch.missions += 1; ch.solved += r.solved ? 1 : 0;
      if (ch.missions % 2 === 0) { ch.pending += 1; out.levelUps.push(ch.name); }
      for (const n of CAMP.settleAssets(ch)) out.lines.push(n);
      if (!out.lines.length) out.lines.push(`${ch.name} came home.`);
    }
    /* Completing any Primary Objective, even if not all of them, earns one additional Favor (rulebook p.14). */
    if (r.primDone > 0) c.favors.push({ wc: 2, from: M.title });
    out.favors = r.primDone > 0 ? 1 : 0;
    if (r.solved) c.casesSolved += 1;
    c.missionsDone += 1;
    c.history.unshift({ adv: M.id, title: M.title, year: M.year, result: r.solved ? "Solved" : "Not solved", day: c.day });
    CAMP.logAdd(`${M.title}: ${r.solved ? "case solved" : "not solved"}.`);
    c.mission = null;
    c.day += 2;
    CAMP.save();
    CAMP.ui.debrief(out);
  };

  window.CAMP = CAMP;
})();
