/* ============================================================================
   ASSET LIST — reads the running game and writes the list of every picture an
   illustrated edition needs: ASSET-LIST.md (to read) and asset-list.csv (one
   row per image, for an image generator to work through).
   Usage: start the game (npm start), then: node tools/asset-list.js [url] [outdir]
   ========================================================================== */
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path");
const VIS = require("./scene-prompts.js");
const ES = require("./era-style.js");
const MP = require("./monster-prompts.js");
const url = process.argv[2] || "http://localhost:3000", out = process.argv[3] || path.join(__dirname, "..");

(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto(url); await p.waitForTimeout(1200);
  const data = await p.evaluate(() => {
    const strip = (h) => String(h || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    const firstSay = (steps) => { for (const st of [].concat(steps || [])) { if (st.say) return strip(st.say); if (st.once) { const r = firstSay(st.steps); if (r) return r; } } return ""; };
    const eraOf = (y) => CDATA.eraOf(y).id;
    const cases = [];
    for (const a of Object.values(ADV.LIBRARY)) {
      if (a.custom || a.generated) continue;
      cases.push({ id: a.id, title: a.title, year: a.year, era: eraOf(a.year), setting: a.setting, summary: a.summary,
        npcs: Object.entries(a.npcs || {}).map(([id, n]) => ({ id, name: n.name, tag: n.tag || "", look: n.look || "", sex: (n.face && n.face.sex) || "", recurs: n.recurs || "" })),
        enemies: Object.entries(a.enemies || {}).map(([id, e]) => { const x = e.build || e; return { id, name: x.name, type: x.type || "", dies: x.dies || "", difficulty: x.difficulty || "" }; }),
        scenes: Object.entries(a.scenes || {}).map(([id, s]) => ({ id, name: s.name, theme: s.theme || "street", desc: firstSay(s.onEnter) })),
        fights: Object.entries(a.encounters || {}).map(([id, e]) => ({ id, name: e.name, theme: e.theme || "interior", desc: strip(e.fightText) })) });
    }
    /* the first case is hand-built */
    CAMP.loadAdventure("death-of-a-bloodline");
    const M = window.MODULE;
    const dob = { id: "death-of-a-bloodline", title: M.title, year: M.year, era: eraOf(M.year), setting: M.setting || "Kanda, Tokyo · 1976", summary: strip(M.summary || (M.text && M.text.intro) || ""),
      agents: (M.agents || []).map((a) => ({ id: a.id, name: a.name, tag: `${a.role || ""}, ${a.age || ""}`, look: strip(a.bio), sex: "" })),
      npcs: Object.entries(M.npcs || {}).map(([id, n]) => ({ id, name: n.name, tag: n.tag || "", look: n.look || "", sex: "" })),
      enemies: Object.entries(M.enemies || {}).map(([id, e]) => ({ id, name: e.name, type: e.type || "", dies: e.dies || "", difficulty: "" })),
      scenes: Object.entries(M.locations || {}).map(([id, l]) => ({ id: l.scene || id, name: l.name, theme: "", desc: "" })) };
    const seen = new Set(); dob.scenes = dob.scenes.filter((s) => (seen.has(s.id) ? false : seen.add(s.id)));
    return {
      cases, dob,
      eras: CDATA.ERAS.map((e) => ({ id: e.id, name: e.name, from: e.from, to: e.to, blurb: e.blurb })),
      agencies: CDATA.AGENCIES.map((a) => ({ id: a.id, name: a.name, short: a.short, founded: a.founded })),
      patrons: GD.deities.map((d) => ({ name: d.name, text: strip(d.text).slice(0, 420) })),
      themes: ART.themes
    };
  });
  await b.close();

  const rows = [];
  /* keep at most three weighted phrases in a prompt: more than two or three at 1.3 distort the picture */
  const capWeights = (t, n = 3) => { let k = 0; return t.replace(/\(([^()]*?):([0-9.]+)\)/g, (m, inner) => (++k <= n ? m : inner)); };
  const ERA_OF_STYLE = Object.fromEntries(Object.entries(ES.STYLE).map(([k, v]) => [v, k]));
  const BRIGHT = /\b(noon|midday|daylight|sunlit|sunny|afternoon|white limestone|blinding white)\b/i;
  const kindOf = (f) => (/^portraits\//.test(f) ? "portrait" : /^monsters\//.test(f) ? "monster" : /^scenes\//.test(f) ? "place" : /^items\//.test(f) ? "item" : /^hideout\//.test(f) ? "hideout" : /^ui\/agency/.test(f) ? "emblem" : /^patrons\//.test(f) ? "patron" : /^ui\/title/.test(f) ? "title" : "");
  const add = (group, file, size, subject, prompt, note = "", negative = "", redo = "", style = "", meta = {}) => {
    const era = meta.era || (ERA_OF_STYLE[style] || (/oil-painted still-life/.test(style) ? "items" : ""));
    const year = meta.year || ((group.match(/\((\d{4})\)/) || [])[1] || "");
    const kind = kindOf(file);
    let pr = capWeights(prompt.replace(/\s+/g, " ").trim());
    const bright = meta.bright != null ? meta.bright : kind === "place" && (BRIGHT.test(pr) || /scenes\/generic\/(desert|snow)-/.test(file) || /quarry\/quarry/.test(file));
    if (bright && !BRIGHT.test(pr)) pr += ", bright diffused daylight";
    const row = { group, file, size, subject, era, kind, year, variant: era === "modern" && +year >= 2007 ? "late" : "", hero: meta.hero || String(subject).split(" (")[0], mood: bright ? "bright" : "", prompt: pr, note, negative, seed: "", redo, style };
    rows.push(row); return row;
  };
  const NOPEOPLE = "(people, person, figure, crowd, face:1.4)";
  const missing = [];
  const SQ = "1024x1024", WIDE = "1344x768", TALL = "832x1216";
  const eraWords = ES.ERAWORD;
  const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  /* 1. player portraits */
  const LOOKS = {
    f: ["young woman, sharp eyes, hair pinned up", "woman in her thirties, tired but determined", "older woman, grey hair, stern", "woman in her twenties, freckles, wary smile", "woman in her forties, scar on her cheek", "woman with short cropped hair, steady gaze", "heavyset woman, warm face, guarded eyes", "woman with glasses, scholarly, ink on her fingers", "athletic woman, braided hair, weathered", "elderly woman, kind face, very alert"],
    m: ["young man, clean-shaven, nervous energy", "man in his thirties, stubble, haunted look", "older man, white beard, calm", "man in his twenties, broad shoulders, crooked nose", "man in his forties, moustache, sardonic", "lean man with sunken cheeks, sharp suit for the era", "heavyset man, bald, gentle eyes", "man with spectacles, bookish, unruly hair", "scarred veteran, hard jaw", "elderly man, deeply lined face, wry smile"]
  };
  for (const e of data.eras) for (const sex of ["f", "m"]) LOOKS[sex].forEach((lk, i) => {
    const n = String(i + 1).padStart(2, "0");
    const ei = data.eras.indexOf(e), sx = sex === "f" ? 0 : 5;
    add("Agent portraits (character creator)", `portraits/agents/${e.id}-${sex}-${n}.png`, SQ, `${e.name}: ${sex === "f" ? "woman" : "man"} ${n}`,
      `head-and-shoulders portrait of (${/^[aeiou]/i.test(ES.HERITAGE[i]) ? "an" : "a"} ${ES.HERITAGE[i]} ${lk}:1.3), ${ES.BUILDS[(i + ei) % 10]}, ${ES.WORN[(i * 7 + ei + sx) % 10]}, (wearing ${ES.WARDROBES[e.id][sex][(i * 7 + 2 + sx) % 10]}:1.2), ${ES.POSES[(i * 3 + ei + sx) % 10]}, ${ES.EXPRESSIONS[(i * 7 + ei * 3 + sx) % 10]}, investigator of the supernatural, ${ES.BACKDROP[e.id]}, face in the upper middle`,
      "Heritage, wardrobe and medium all date the face: the same person in two eras should look like two different paintings. Ten different outfits per era and sex.", (e.id === "modern" || e.id === "now" ? "" : "(modern clothes:1.2), ") + "(signature, text, watermark:1.5), frame, cartoon, 3d render, photograph", "v5", ES.STYLE[e.id], { hero: lk });
  });

  /* 1b. fighters: knights and soldiers through the ages (and the Order of Infinite Dark's ceremonial armour) */
  const FIGHTERS = [
    ["medieval", "f", "a white European woman knight of a holy order, in mail and a white surcoat marked with a black sun, cropped hair, a scar through one eyebrow, sword hilt at her shoulder"],
    ["medieval", "m", "a North African man-at-arms in a battered kettle helmet, quilted gambeson and mail, a spear over his shoulder, tired hard eyes"],
    ["victorian", "f", "a Black African woman in ceremonial plate breastplate worn over a dark Victorian riding habit, a holy order's black-sun badge, a sabre at her side"],
    ["victorian", "m", "a South Asian soldier of the 1880s in a khaki uniform with a turban and bandolier, a rifle, an older veteran's calm face"],
    ["wars", "f", "a woman ambulance driver of the Great War in a greatcoat and steel Brodie helmet, a gas-mask bag across her chest, mud on her face"],
    ["wars", "m", "a 1917 trench soldier wearing improvised steel trench armour plates over his tunic like a modern knight, a Brodie helmet, a trench club, haunted eyes"],
    ["atomic", "f", "a 1950s Women's Army Corps radio sergeant, olive drab uniform and garrison cap, headphones round her neck, sharp and unafraid"],
    ["atomic", "m", "a 1950s paratrooper in an M1 helmet with netting, olive fatigues, a cigarette behind his ear, a thousand-yard stare"],
    ["modern", "f", "a 1990s UN peacekeeper in a blue helmet and flak jacket, desert camouflage, dust in her hair"],
    ["modern", "m", "a 1990s special-forces soldier in woodland camouflage and a boonie hat, face paint, a radio handset clipped to his vest"],
    ["now", "f", "a modern holy-order knight: (sleek matte black ceramic plate armour with a black-sun sigil:1.2), tactical webbing, a short sword and a sidearm, hair tied back"],
    ["now", "m", "a present-day private military contractor in plate carrier and helmet with night-vision mount, rain on his visor, a black-sun patch on the shoulder"]
  ];
  FIGHTERS.forEach(([era, sex, d], i) => add("Agent portraits: knights and soldiers", `portraits/agents/${era}-${sex}-${String(23 + (i % 2)).padStart(2, "0")}.png`, SQ, d.split(",")[0],
    `head-and-shoulders portrait of (${d}:1.3), ${ES.POSES[(i * 3 + 1) % 10]}, ${ES.EXPRESSIONS[(i * 7 + 2) % 10]}, ${ES.BACKDROP[era]}, face in the upper middle`,
    "A fighter from this era. The black sun is the Order of Infinite Dark's emblem (the book's knightly agency).", (era === "modern" || era === "now" ? "(cosplay, costume:1.2)" : "(modern clothes, cosplay, costume:1.2)") + ", (signature, text, watermark:1.5), frame, cartoon, 3d render, photograph", "v5", ES.STYLE[era], { hero: d.split(",")[0] }));

  /* 2. named characters */
  const hsh = (t) => [...String(t)].reduce((h, ch) => (Math.imul(h, 31) + ch.charCodeAt(0)) >>> 0, 7);
  const recurring = {};
  const npcRow = (c, n, prefix = "npc") => {
    if (n.recurs && recurring[n.recurs]) { recurring[n.recurs].note += ` Also appears in ${c.title}: the game shows this one picture there too.`; return; }
    const key = ES.eraKey(c.era, c.year), h = hsh(n.name);
    const dress = key === "late" ? `wearing ${ES.WARDROBES.late[n.sex === "f" ? "f" : "m"][h % 6]}` : `Clothing of ${eraWords[key]}`;
    const row = add(`Characters: ${c.title} (${c.year})`, n.recurs ? `portraits/npc/recurring-${n.recurs}.png` : `portraits/${prefix}/${c.id}-${n.id}.png`, SQ, `${n.name}, ${n.tag}`,
      `head-and-shoulders portrait of ${n.name}, ${n.tag}. ${n.look} (${dress}:1.2), ${ES.POSES[h % 10]}, ${ES.EXPRESSIONS[(h >> 3) % 10]}, ${ES.BACKDROP[c.era] || "dim background"}.`, n.recurs ? `Recurring: appears in several cases of ${c.title.split(":")[0]}. Make it once.` : "", "(signature, text, watermark:1.5), frame, cartoon, 3d render, photograph", "v5", ES.STYLE[c.era], { hero: `${n.name}, ${n.tag}` });
    if (n.recurs) recurring[n.recurs] = row;
  };
  for (const c of [data.dob, ...data.cases]) { for (const a of c.agents || []) npcRow(c, a, "npc"); for (const n of c.npcs) npcRow(c, n); }

  /* 3. monsters: every one written to art/MONSTER-DESIGN.md (tools/monster-prompts.js) */
  const MONSTER_FRAME = () => `eldritch and wrong, full figure, centred, filling most of the frame, plain dark background`;
  const MNOTE = "An eldritch copy of something real or imagined: keep what it copies recognisable, make it wrong. Shown as a round token in fights and as a plate when inspected. See MONSTER-DESIGN.md.";
  for (const c of [data.dob, ...data.cases]) for (const e of c.enemies) {
    const m = MP.CASE[`${c.id}/${e.id}`]; if (!m) missing.push(`monster ${c.id}/${e.id}`);
    add(`Monsters: ${c.title} (${c.year})`, `monsters/${c.id}-${e.id}.png`, SQ, m ? m[0] : e.name,
      m ? `${m[1]}, ${MONSTER_FRAME(c.era)}` : `${e.name}, a supernatural creature from "${c.title}", ${c.setting}, ${MONSTER_FRAME(c.era)}`,
      MNOTE + (e.dies ? ` When defeated it ${e.dies}.` : ""), MP.NEGATIVE, "v5", ES.STYLE[c.era]);
  }
  for (const [k, d] of Object.entries({ ghost_blades: "the Paper Ghost enraged: (paper folded into knife-edges all around her:1.3), lilies shredded", ghost_lantern: "the Paper Ghost as a lantern: (a paper lantern with her face glowing through it:1.3), lilies burning" }))
    add(`Monsters: ${data.dob.title} (1976)`, `monsters/death-of-a-bloodline-${k}.png`, SQ, k, `${d}, ${MONSTER_FRAME("atomic")}`, "The boss changes shape during the final fight.", MP.NEGATIVE, "v5", ES.STYLE.atomic);
  for (const e of data.eras) for (const [kind, m] of Object.entries(MP.GENERIC[e.id] || {}))
    add("Monsters: generic, by era (side jobs and your own cases)", `monsters/generic/${e.id}-${kind}.png`, SQ, `${e.name}: ${m[0]}`, `${m[1]}, ${MONSTER_FRAME(e.id)}`,
      MNOTE + ` Kind: ${kind}. The file name carries the era so the game can pick a monster that belongs to the case's time.`, MP.NEGATIVE, "v5", ES.STYLE[e.id]);
  for (const e of data.eras) for (const [kind, m] of Object.entries(MP.THREATS[e.id] || {}))
    add("Threats that are not creatures: places, cursed objects, events", `monsters/threats/${e.id}-${kind}.png`, SQ, `${e.name}: ${m[0]}`, `${m[1]}, ${MONSTER_FRAME(e.id)}`,
      `Side jobs "${({ place: "The House That Wants", object: "The Heirloom", hour: "The Hour That Won't End" })[kind]}": ended with a rite or a fight. Picture the thing itself as the threat, with one human detail in the wrong place.`, MP.NEGATIVE, "v5", ES.STYLE[e.id]);

  /* 4. places in each case */
  for (const c of [...data.cases]) {
    for (const sc of c.scenes) {
      const v = VIS[`${c.id}/${sc.id}`]; if (!v) missing.push(`${c.id}/${sc.id}`);
      add(`Places: ${c.title} (${c.year})`, `scenes/${c.id}-${sc.id}.png`, WIDE, `${sc.name}`,
        v ? `${v[0]}, wide view` : `${sc.name}, ${c.setting}. ${sc.desc} ${ES.STREET[ES.eraKey(c.era, c.year)]}. Wide view.`,
        "In the game, character portraits cover part of the right side.", [NOPEOPLE, v && v[1]].filter(Boolean).join(", "), "v5", ES.STYLE[c.era]);
    }
    for (const f of c.fights) {
      const v = VIS[`${c.id}/fight:${f.id}`]; if (!v) missing.push(`${c.id}/fight:${f.id}`);
      add(`Places: ${c.title} (${c.year})`, `scenes/${c.id}-fight-${f.id}.png`, WIDE, `${f.name} (fight)`,
        v ? `${v[0]}, wide view, dramatic` : `${f.name}, ${c.setting}. ${f.desc} Wide view, three areas left to right.`,
        "Fight backdrop: the game darkens it and lays three zones over it left to right.", [NOPEOPLE, v && v[1]].filter(Boolean).join(", "), "v5", ES.STYLE[c.era]);
    }
  }
  const DOB = { street: "a rain-soaked Tokyo backstreet at night outside an old two-storey apartment block, 1976", station: "a police interview room, Kanda Station, 1976, fluorescent light", hall1: "ground floor hallway of a shabby 1970s Tokyo apartment building, doors along one side", hall2: "second floor hallway, same building, a door at the end left ajar", hall3: "third floor hallway, same building, dim and silent", doorway: "an apartment doorway seen from the hall, a neighbour's door half open", apt2b_living: "a small Tokyo apartment living room, tatami, a low table, everything too neat", apt2b_kitchen: "a narrow apartment kitchen, dishes in the sink, a calendar on the wall", apt2b_bedroom: "a small bedroom with futon rolled away, a child's drawings on the wall", apt2b_storage: "a cramped storage cupboard full of boxes and folded paper", apt2a: "a young courier's messy apartment, posters, a motorbike helmet", basement: "a dark boiler-room basement under the building, pipes and a locked door", paper_guest: "a guest room made entirely of folded white paper, uncanny", paper_dojo: "a dojo made entirely of folded paper, white lilies drifting", paper_study: "a study made of folded paper, shelves of paper books", paper_hall: "an apartment hallway made of folded paper, lilies on the floor", paper_2b: "the apartment living room rebuilt in folded paper, a figure-shaped space at its centre", title: "title art: a rainy Tokyo night street, one lit window, folded paper lilies floating in puddles", end_banish: "ending: dawn light through paper walls as they dissolve into lilies", end_kill: "ending: a ruined paper room, ash and torn lilies, rain outside" };
  for (const [k, d] of Object.entries(DOB)) add(`Places: ${data.dob.title} (1976)`, `scenes/death-of-a-bloodline-${k}.png`, WIDE, k, `${d}. Wide establishing view, atmospheric.`);

  /* 5. generic places for side jobs and your own cases */
  const THEMES = { street: "a city street at night", interior: "a lived-in room", cellar: "a cellar or basement", forest: "a dark forest", village: "a small village", castle: "a ruined castle", fog: "a fog-bound street", trench: "a war trench", desert: "a dusty plain or desert", sea: "a harbour or stormy coast", snow: "a snowbound landscape", church: "a church interior", lab: "a laboratory or workshop", modern: "an urban building interior", future: "a city of glass and screens", drive: "a lonely road or drive-in", cave: "a cave", train: "a train carriage" };
  const FITS = { trench: ["wars"], future: ["now"], drive: ["atomic", "modern"], modern: ["modern", "now"], castle: ["medieval", "victorian"], train: ["victorian", "wars", "atomic", "modern", "now"], lab: ["victorian", "wars", "atomic", "modern", "now"] };
  const INDOOR_THEMES = new Set(["interior", "modern"]), STREETY = new Set(["street", "fog", "drive", "future"]), BARE = new Set(["cave"]);
  for (const [t, d] of Object.entries(THEMES)) for (const e of data.eras) {
    if (FITS[t] && !FITS[t].includes(e.id)) continue;
    const k = e.id, tt = ES.THEME_TECH[t] && ES.THEME_TECH[t][k];
    let hero = `(${d}:1.3)`, detail = tt || (INDOOR_THEMES.has(t) ? ES.INDOOR[k] : STREETY.has(t) ? ES.STREET[k] : BARE.has(t) ? "" : ES.WILD[k]);
    if (INDOOR_THEMES.has(t)) { const [first, ...rest] = ES.INDOOR[k].split(", "); hero = `(${first}:1.3)`; detail = rest.join(", "); }
    const day = t === "desert" || t === "snow";
    add("Places: generic (side jobs and your own cases)", `scenes/generic/${t}-${e.id}.png`, WIDE, `${t}, ${e.name}`, `${hero}, ${detail}${detail ? ", " : ""}${day ? "open sky" : INDOOR_THEMES.has(t) ? "dim interior light" : "at night or in deep gloom"}, wide view`,
      "Generic place for side jobs. " + (k === "modern" ? "Modern means the 1990s and early 2000s here." : ""), "(people, person, figure:1.4), (signature, text, watermark:1.5)", "v5", ES.STYLE[e.id], { hero: d.replace(/^an? /, "") });
  }

  /* 6. the hideout, one per era */
  for (const e of data.eras) add("Hideout", `hideout/${e.id}.png`, WIDE, `The agency hideout, ${e.name}`,
    `interior of a secret investigators' headquarters, ${ES.INDOOR[e.id].split(", ").slice(1, 4).join(", ")}. Left to right: a case board pinned with photos and string; a weapons rack; a door; a telephone on the wall; tall shelves of files; a safe or strongbox; a doorway to a garage or stable. In front: a common table with chairs, a small desk with a logbook, an infirmary cot. Slightly cluttered.`,
    "Keep the objects roughly in that left-to-right order; I'll place the clickable spots on them.", "(people:1.3), (signature, text, watermark:1.5)", "v5", ES.STYLE[e.id]);

  /* 7. patrons */
  for (const d of data.patrons) add("Patrons", `patrons/${slug(d.name)}.png`, WIDE, d.name, `${d.name}, a patron deity of the Beyond: ${d.text} Shown as an idol or presence on a dark altar, candlelight, awe and dread.`,
    "KEEP: the game shows the rulebook's own art for every patron. Listed only so the list is complete; do not replace.", "", "keep");

  /* 8. title and agencies */
  add("Title and agencies", "ui/title.png", WIDE, "Title screen", "a lone investigator under a street lamp at night, rain, something vast and wrong in the clouds above the rooftops, room on the left for the game's title", "KEEP: the title screen uses the rulebook's painting. Listed only so the list is complete; do not replace.", "", "keep");
  for (const a of data.agencies) add("Title and agencies", `ui/agency-${a.id.toLowerCase()}.png`, "512x512", `${a.name} emblem`, `an emblem or seal for "${a.name}" (${a.short}), founded ${a.founded}, a secret organisation that fights the supernatural, (in the visual language of its founding time: ${({ medieval: "an engraved wax seal and heraldic shield", victorian: "an embossed brass and enamel badge", wars: "a stencilled military insignia on canvas", atomic: "a 1950s chrome and enamel emblem", modern: "a 1990s embroidered patch", now: "a clean modern glowing logo on matte black" })[(data.eras.find((e) => a.founded >= e.from && a.founded <= e.to) || data.eras[0]).id]}:1.2). Simple, iconic, centred, on a plain dark background, no text.`, "Round agency seals: shown as round badges in the game.", "(text, letters, words:1.4)", "v5", ES.STYLE[(data.eras.find((e) => a.founded >= e.from && a.founded <= e.to) || data.eras[0]).id]);

  /* 9. items: gear and the things you find in scenes (drawn icons stand in until these exist) */
  const ITEMS = {
    flashlight: "an electric torch or, for older eras, a small oil lantern", cigarettes: "a crumpled packet of cigarettes and a box of matches", salt: "a jar of coarse purifying salt with a cork stopper",
    omamori: "a small Japanese silk omamori charm bag on a cord", crowbar: "an iron crowbar", lockpicks: "a leather roll of lockpicks", book: "an old leather folklore book", camera: "an old folding camera",
    records: "a bundle of papers and files tied with string", journal: "a battered investigator's notebook with a pencil", knife: "a plain sheath knife", tape: "a portable tape recorder", talisman: "a worn brass holy symbol on a chain",
    medicine: "a doctor's first-aid tin with a red cross", rope: "a coil of hemp rope",
    periscope: "a First World War trench periscope", telephone: "an old field telephone with a crank", radio: "an old valve radio set", letter: "a sealed letter with a red wax seal", map: "a folded paper map marked in red",
    key: "an old iron key", lantern: "a hanging oil lantern, lit", candle: "a single lit candle in a brass holder", picture: "a small oil portrait in a gilt frame", photo: "an old photograph with a torn corner",
    bell: "a small bronze hand bell", clock: "a pocket watch with its cover open", mirror: "a hand mirror with a tarnished silver back", door: "a heavy wooden door, slightly open", grave: "a weathered headstone",
    skull: "an old human skull", bottle: "a green glass apothecary bottle with a paper label", gun: "an old service revolver", tracks: "muddy footprints on floorboards", blood: "a dark smear of blood on stone",
    window: "a night window with a cracked pane", chest: "a small iron-bound wooden chest", bed: "a narrow iron bed with grey blankets", altar: "a small stone altar with two candles", coffin: "a plain wooden coffin",
    film: "a reel of cinema film", typewriter: "an old black typewriter", screen: "a computer monitor glowing green", ticket: "a paper railway ticket", boat: "a small wooden rowing boat", fire: "flames in an iron grate",
    drawing: "a child's crayon drawing of a tall figure", doll: "an old porcelain doll", bread: "a round loaf of dark bread", coins: "a few old coins", newspaper: "a folded old newspaper", paw: "an animal's muddy paw prints",
    wire: "a tangle of barbed wire", mask: "a pale theatre mask", well: "an old stone well with a wooden winch", stairs: "a narrow wooden stair going down into darkness", body: "a still figure under a grey sheet"
  };
  for (const [k, d] of Object.entries(ITEMS)) add("Items and things in scenes", `items/${k}.png`, "1024x1024", k,
    `${d}, its shape, material and one telling detail, centred, seen slightly from above, plain dark background`,
    "Shown small (about 60px) on the spot you click and in the case file, so keep one clear object with a strong silhouette.", "(hands, people, multiple objects, clutter:1.3)", "new", "oil-painted still-life study in a dark Dutch Golden Age manner, single candle or lamp light from one side, deep shadow, varnished canvas", { era: "items", hero: k });

  if (missing.length) console.log("NO VISUAL PROMPT for", missing.join(", "));
  /* write */
  const COLS = ["file", "size", "subject", "group", "era", "kind", "year", "variant", "hero", "mood", "style", "prompt", "negative", "seed", "redo", "note"];
  fs.writeFileSync(path.join(out, "asset-list.csv"), COLS.join(",") + "\n" + rows.map((r) => COLS.map((k) => `"${String(r[k]).replace(/"/g, '""')}"`).join(",")).join("\n") + "\n");
  const groups = [...new Set(rows.map((r) => r.group))];
  let md = `# The Beyond: picture list for an illustrated edition\n\n${rows.length} images. Every row in \`asset-list.csv\` is one picture, with its file name, size and a description to turn into a prompt.\n\n`;
  md += `## Version 5\n\n` +
    `Every row is marked to make again except the patrons and the title screen, which keep the rulebook's own art.\n\n` +
    `**New columns in the CSV:** \`era\` (medieval, victorian, wars, atomic, modern, now, or items), \`kind\` (portrait, monster, place, item, emblem, hideout), \`year\` (the case's year, when it has one), \`variant\` (\`late\` marks Late Century 2007-2021: smartphones, flat screens, LED bulbs), \`hero\` (the one subject of the picture), \`mood\` (\`bright\` marks daylight pictures, so the dark lead can be left off), and \`seed\` (blank: fill it to re-roll a picture without rewording it).\n\n` +
    `**What changed from v4**\n` +
    `- Rows no longer repeat the era's light and palette: the generator adds those. Rows keep concrete period things (furniture, vehicles, appliances) instead.\n` +
    `- Generic rooms and every indoor theme (cellar, church, lab, train, village) list indoor things for their era. They no longer borrow the street list.\n` +
    `- Late Century is split: 1990s and early 2000s, and 2007-2021 (the Vacancy case, 2016). Generic Late Century rows are the 1990s look.\n` +
    `- No readable text in any prompt (signs, labels, headlines, countdowns): shapes only. At most three weighted phrases per prompt.\n` +
    `- Portraits vary in head angle, expression, build and one worn detail, and every agent portrait has its own outfit (ten per era and sex, 120 in all, each with its own class, trade, colour and hair). Agent portraits end "face in the upper middle"; the 1990s and present-day portraits no longer have "modern clothes" in the negative.\n` +
    `- A character who appears in several cases of a campaign has one row and one picture (marked Recurring). The game shows that picture in every case.\n` +
    `- The drive-in screen row is rewritten (blazing white, black screen in the negative). Fight backdrops no longer ask for a plain bottom third: the game darkens them.\n\n`;
  md += `| Group | Pictures |\n|---|---|\n`;
  for (const g of groups) md += `| ${g} | ${rows.filter((r) => r.group === g).length} |\n`;
  md += `\n## The full list\n`;
  for (const g of groups) {
    md += `\n### ${g}\n\n`;
    for (const r of rows.filter((x) => x.group === g)) md += `- \`${r.file}\` (${r.size})${r.redo === "keep" ? " **[keep: rulebook art]**" : r.redo === "new" ? " **[new]**" : ""}: **${r.subject}**. ${r.prompt}${r.negative ? ` Keep out: ${r.negative}.` : ""}${r.note ? ` _${r.note}_` : ""}\n`;
  }
  fs.writeFileSync(path.join(out, "ASSET-LIST.md"), md);
  /* the batch for the generator: only what has to be made again or is new */
  const todo = rows.filter((r) => r.redo && r.redo !== "keep");
  fs.writeFileSync(path.join(out, "asset-list-v5-todo.csv"), COLS.join(",") + "\n" + todo.map((r) => COLS.map((k) => `"${String(r[k]).replace(/"/g, '""')}"`).join(",")).join("\n") + "\n");
  console.log(todo.length, "to make in asset-list-v5-todo.csv");
  console.log(rows.length, "images in", groups.length, "groups");
  for (const g of groups) console.log(" ", rows.filter((r) => r.group === g).length, g);
})();
