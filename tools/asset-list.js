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
        npcs: Object.entries(a.npcs || {}).map(([id, n]) => ({ id, name: n.name, tag: n.tag || "", look: n.look || "", sex: (n.face && n.face.sex) || "" })),
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
  const add = (group, file, size, subject, prompt, note = "", negative = "", redo = "", style = "") => rows.push({ group, file, size, subject, prompt: prompt.replace(/\s+/g, " ").trim(), note, negative, redo, style });
  const NOPEOPLE = "(people, person, figure, crowd, face:1.4)";
  const missing = [];
  const SQ = "1024x1024", WIDE = "1344x768", TALL = "832x1216";
  const eraWords = { medieval: "medieval or early-modern Europe", victorian: "Victorian era, 1850s-1900s", wars: "World War era, 1910s-1940s", atomic: "atomic age, 1950s-1980s", modern: "the 1990s and early 2000s, before smartphones", now: "near present day, 2020s-2030s" };
  const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  /* 1. player portraits */
  const LOOKS = {
    f: ["young woman, sharp eyes, hair pinned up", "woman in her thirties, tired but determined", "older woman, grey hair, stern", "woman in her twenties, freckles, wary smile", "woman in her forties, scar on her cheek", "woman with short cropped hair, steady gaze", "heavyset woman, warm face, guarded eyes", "woman with glasses, scholarly, ink on her fingers", "athletic woman, braided hair, weathered", "elderly woman, kind face, very alert"],
    m: ["young man, clean-shaven, nervous energy", "man in his thirties, stubble, haunted look", "older man, white beard, calm", "man in his twenties, broad shoulders, crooked nose", "man in his forties, moustache, sardonic", "lean man with sunken cheeks, sharp suit for the era", "heavyset man, bald, gentle eyes", "man with spectacles, bookish, unruly hair", "scarred veteran, hard jaw", "elderly man, deeply lined face, wry smile"]
  };
  for (const e of data.eras) for (const sex of ["f", "m"]) LOOKS[sex].forEach((lk, i) => {
    const n = String(i + 1).padStart(2, "0");
    add("Agent portraits (character creator)", `portraits/agents/${e.id}-${sex}-${n}.png`, SQ, `${e.name}: ${sex === "f" ? "woman" : "man"} ${n}`,
      `head-and-shoulders portrait of (a ${ES.HERITAGE[i]} ${lk}:1.3), (wearing ${ES.WARDROBE[e.id][sex]}:1.2), ${eraWords[e.id]}, investigator of the supernatural, ${ES.BACKDROP[e.id]}, looking at the viewer, face in the upper middle`,
      "Heritage, wardrobe and medium all date the face: the same person in two eras should look like two different paintings.", "(modern clothes:1.2), (signature, text, watermark:1.5), frame, cartoon, 3d render, photograph", "v4", ES.STYLE[e.id]);
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
    `head-and-shoulders portrait of (${d}:1.3), ${eraWords[era]}, ${ES.BACKDROP[era]}, looking at the viewer, face in the upper middle`,
    "A fighter from this era. The black sun is the Order of Infinite Dark's emblem (the book's knightly agency).", "(modern clothes, cosplay, costume:1.2), (signature, text, watermark:1.5), frame, cartoon, 3d render, photograph", "v4", ES.STYLE[era]));

  /* 2. named characters */
  const npcRow = (c, n, prefix = "npc") => add(`Characters: ${c.title} (${c.year})`, `portraits/${prefix}/${c.id}-${n.id}.png`, SQ, `${n.name}, ${n.tag}`,
    `head-and-shoulders portrait of ${n.name}, ${n.tag}, ${c.setting}. ${n.look} (Clothing of the ${eraWords[c.era]}:1.2), ${ES.BACKDROP[c.era] || "dim background"}.`, "", "(signature, text, watermark:1.5), frame, cartoon, 3d render, photograph", "v4", ES.STYLE[c.era]);
  for (const c of [data.dob, ...data.cases]) { for (const a of c.agents || []) npcRow(c, a, "npc"); for (const n of c.npcs) npcRow(c, n); }

  /* 3. monsters: every one written to art/MONSTER-DESIGN.md (tools/monster-prompts.js) */
  const MONSTER_FRAME = (era) => `a monster of the ${eraWords[era]}, eldritch and wrong, full figure, centred, filling most of the frame, dramatic low light, plain dark background`;
  const MNOTE = "An eldritch copy of something real or imagined: keep what it copies recognisable, make it wrong. Shown as a round token in fights and as a plate when inspected. See MONSTER-DESIGN.md.";
  for (const c of [data.dob, ...data.cases]) for (const e of c.enemies) {
    const m = MP.CASE[`${c.id}/${e.id}`]; if (!m) missing.push(`monster ${c.id}/${e.id}`);
    add(`Monsters: ${c.title} (${c.year})`, `monsters/${c.id}-${e.id}.png`, SQ, m ? m[0] : e.name,
      m ? `${m[1]}, ${MONSTER_FRAME(c.era)}` : `${e.name}, a supernatural creature from "${c.title}", ${c.setting}, ${MONSTER_FRAME(c.era)}`,
      MNOTE + (e.dies ? ` When defeated it ${e.dies}.` : ""), MP.NEGATIVE, "v4", ES.STYLE[c.era]);
  }
  for (const [k, d] of Object.entries({ ghost_blades: "the Paper Ghost enraged: (paper folded into knife-edges all around her:1.3), lilies shredded", ghost_lantern: "the Paper Ghost as a lantern: (a paper lantern with her face glowing through it:1.3), lilies burning" }))
    add(`Monsters: ${data.dob.title} (1976)`, `monsters/death-of-a-bloodline-${k}.png`, SQ, k, `${d}, ${MONSTER_FRAME("atomic")}`, "The boss changes shape during the final fight.", MP.NEGATIVE, "v4", ES.STYLE.atomic);
  for (const e of data.eras) for (const [kind, m] of Object.entries(MP.GENERIC[e.id] || {}))
    add("Monsters: generic, by era (side jobs and your own cases)", `monsters/generic/${e.id}-${kind}.png`, SQ, `${e.name}: ${m[0]}`, `${m[1]}, ${MONSTER_FRAME(e.id)}`,
      MNOTE + ` Kind: ${kind}. The file name carries the era so the game can pick a monster that belongs to the case's time.`, MP.NEGATIVE, "v4", ES.STYLE[e.id]);
  for (const e of data.eras) for (const [kind, m] of Object.entries(MP.THREATS[e.id] || {}))
    add("Threats that are not creatures: places, cursed objects, events", `monsters/threats/${e.id}-${kind}.png`, SQ, `${e.name}: ${m[0]}`, `${m[1]}, ${MONSTER_FRAME(e.id)}`,
      `Side jobs "${({ place: "The House That Wants", object: "The Heirloom", hour: "The Hour That Won't End" })[kind]}": ended with a rite or a fight. Picture the thing itself as the threat, with one human detail in the wrong place.`, MP.NEGATIVE, "v4", ES.STYLE[e.id]);

  /* 4. places in each case */
  for (const c of [...data.cases]) {
    for (const sc of c.scenes) {
      const v = VIS[`${c.id}/${sc.id}`]; if (!v) missing.push(`${c.id}/${sc.id}`);
      add(`Places: ${c.title} (${c.year})`, `scenes/${c.id}-${sc.id}.png`, WIDE, `${sc.name}`,
        v ? `${v[0]}, ${eraWords[c.era]}, (${ES.MARKERS[c.era]}:1.1), lit by ${ES.PARTS[c.era].light}, wide establishing view, atmospheric, empty of people` : `${sc.name}, ${c.setting}. ${sc.desc} Wide establishing view, atmospheric, no people in the foreground.`,
        "The right third is partly covered by character portraits; keep it calm.", [NOPEOPLE, v && v[1]].filter(Boolean).join(", "), "v4", ES.STYLE[c.era]);
    }
    for (const f of c.fights) {
      const v = VIS[`${c.id}/fight:${f.id}`]; if (!v) missing.push(`${c.id}/fight:${f.id}`);
      add(`Places: ${c.title} (${c.year})`, `scenes/${c.id}-fight-${f.id}.png`, WIDE, `${f.name} (fight)`,
        v ? `${v[0]}, ${eraWords[c.era]}, (${ES.MARKERS[c.era]}:1.1), lit by ${ES.PARTS[c.era].light}, wide view, dramatic, empty of people` : `${f.name}, ${c.setting}. ${f.desc} Wide view, room to read three areas left to right, no figures.`,
        "Fight backdrop: three zones are laid over it left to right; keep the bottom third fairly plain.", [NOPEOPLE, v && v[1]].filter(Boolean).join(", "), "v4", ES.STYLE[c.era]);
    }
  }
  const DOB = { street: "a rain-soaked Tokyo backstreet at night outside an old two-storey apartment block, 1976", station: "a police interview room, Kanda Station, 1976, fluorescent light", hall1: "ground floor hallway of a shabby 1970s Tokyo apartment building, doors along one side", hall2: "second floor hallway, same building, a door at the end left ajar", hall3: "third floor hallway, same building, dim and silent", doorway: "an apartment doorway seen from the hall, a neighbour's door half open", apt2b_living: "a small Tokyo apartment living room, tatami, a low table, everything too neat", apt2b_kitchen: "a narrow apartment kitchen, dishes in the sink, a calendar on the wall", apt2b_bedroom: "a small bedroom with futon rolled away, a child's drawings on the wall", apt2b_storage: "a cramped storage cupboard full of boxes and folded paper", apt2a: "a young courier's messy apartment, posters, a motorbike helmet", basement: "a dark boiler-room basement under the building, pipes and a locked door", paper_guest: "a guest room made entirely of folded white paper, uncanny", paper_dojo: "a dojo made entirely of folded paper, white lilies drifting", paper_study: "a study made of folded paper, shelves of paper books", paper_hall: "an apartment hallway made of folded paper, lilies on the floor", paper_2b: "the apartment living room rebuilt in folded paper, a figure-shaped space at its centre", title: "title art: a rainy Tokyo night street, one lit window, folded paper lilies floating in puddles", end_banish: "ending: dawn light through paper walls as they dissolve into lilies", end_kill: "ending: a ruined paper room, ash and torn lilies, rain outside" };
  for (const [k, d] of Object.entries(DOB)) add(`Places: ${data.dob.title} (1976)`, `scenes/death-of-a-bloodline-${k}.png`, WIDE, k, `${d}. Wide establishing view, atmospheric.`);

  /* 5. generic places for side jobs and your own cases */
  const THEMES = { street: "a city street at night", interior: "a lived-in room", cellar: "a cellar or basement", forest: "a dark forest", village: "a small village", castle: "a ruined castle", fog: "a fog-bound street", trench: "a war trench", desert: "a dusty plain or desert", sea: "a harbour or stormy coast", snow: "a snowbound landscape", church: "a church interior", lab: "a laboratory or workshop", modern: "an urban building interior", future: "a city of glass and screens", drive: "a lonely road or drive-in", cave: "a cave", train: "a train carriage" };
  const FITS = { trench: ["wars"], future: ["now"], drive: ["atomic", "modern"], modern: ["modern", "now"], castle: ["medieval", "victorian"], train: ["victorian", "wars", "atomic", "modern", "now"], lab: ["victorian", "wars", "atomic", "modern", "now"] };
  for (const [t, d] of Object.entries(THEMES)) for (const e of data.eras) {
    if (FITS[t] && !FITS[t].includes(e.id)) continue;
    add("Places: generic (side jobs and your own cases)", `scenes/generic/${t}-${e.id}.png`, WIDE, `${t}, ${e.name}`, `${d}, ${eraWords[e.id]}, (${ES.MARKERS[e.id]}:1.2), lit by ${ES.PARTS[e.id].light}, at night or in gloom, wide establishing view, atmospheric, no people`, "", "(people, person, figure:1.4), (signature, text, watermark:1.5)", "v4", ES.STYLE[e.id]);
  }

  /* 6. the hideout, one per era */
  for (const e of data.eras) add("Hideout", `hideout/${e.id}.png`, WIDE, `The agency hideout, ${e.name}`,
    `interior of a secret investigators' headquarters in the ${eraWords[e.id]}, (${ES.MARKERS[e.id]}, ${ES.PARTS[e.id].tech}:1.1), lit by ${ES.PARTS[e.id].light}. Left to right: a case board pinned with photos and string; a weapons rack; a door; a telephone on the wall; tall shelves of files; a safe or strongbox; a doorway to a garage or stable. In front: a common table with chairs, a small desk with a logbook, an infirmary cot. Warm lamp light, slightly cluttered.`,
    "Keep the objects roughly in that left-to-right order; I'll place the clickable spots on them.", "(people:1.3), (signature, text, watermark:1.5)", "v4", ES.STYLE[e.id]);

  /* 7. patrons */
  for (const d of data.patrons) add("Patrons", `patrons/${slug(d.name)}.png`, WIDE, d.name, `${d.name}, a patron deity of the Beyond: ${d.text} Shown as an idol or presence on a dark altar, candlelight, awe and dread.`,
    "KEEP: the game shows the rulebook's own art for every patron. Listed only so the list is complete; do not replace.", "", "keep");

  /* 8. title and agencies */
  add("Title and agencies", "ui/title.png", WIDE, "Title screen", "a lone investigator under a street lamp at night, rain, something vast and wrong in the clouds above the rooftops, room on the left for the game's title", "KEEP: the title screen uses the rulebook's painting. Listed only so the list is complete; do not replace.", "", "keep");
  for (const a of data.agencies) add("Title and agencies", `ui/agency-${a.id.toLowerCase()}.png`, "512x512", `${a.name} emblem`, `an emblem or seal for "${a.name}" (${a.short}), founded ${a.founded}, a secret organisation that fights the supernatural, (in the visual language of its founding time: ${({ medieval: "an engraved wax seal and heraldic shield", victorian: "an embossed brass and enamel badge", wars: "a stencilled military insignia on canvas", atomic: "a 1950s chrome and enamel emblem", modern: "a 1990s embroidered patch", now: "a clean modern glowing logo on matte black" })[(data.eras.find((e) => a.founded >= e.from && a.founded <= e.to) || data.eras[0]).id]}:1.2). Simple, iconic, centred, on a plain dark background, no text.`, "Round agency seals: shown as round badges in the game.", "(text, letters, words:1.4)", "v4", ES.STYLE[(data.eras.find((e) => a.founded >= e.from && a.founded <= e.to) || data.eras[0]).id]);

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
    `${d}, a single object, still-life study, centred, seen slightly from above, plain dark background, soft side light`,
    "Shown small (about 60px) on the spot you click and in the case file, so keep one clear object with a strong silhouette.", "(hands, people, multiple objects, clutter:1.3)", "new", "oil-painted still-life study in a dark Dutch Golden Age manner, single candle or lamp light from one side, deep shadow, varnished canvas");

  if (missing.length) console.log("NO VISUAL PROMPT for", missing.join(", "));
  /* write */
  fs.writeFileSync(path.join(out, "asset-list.csv"), "group,file,size,subject,style,prompt,negative,redo,note\n" + rows.map((r) => ["group", "file", "size", "subject", "style", "prompt", "negative", "redo", "note"].map((k) => `"${String(r[k]).replace(/"/g, '""')}"`).join(",")).join("\n") + "\n");
  const groups = [...new Set(rows.map((r) => r.group))];
  let md = `# The Beyond: picture list for an illustrated edition\n\n${rows.length} images. Every row in \`asset-list.csv\` is one picture, with its file name, size and a description to turn into a prompt.\n\n`;
  md += `## Version 4: a fresh take on everything\n\n` +
    `- **Every picture is listed and every one is marked to make again**, except the patrons and the title screen, which keep the rulebook's own art.\n` +
    `- **Eras pull apart on five axes, not one.** Each era's style (the **style** column; put it at the start of the prompt) now names its medium, its light, its palette, its print or film texture and the technology in frame (tools/era-style.js). Atomic stays the 1950s pulp gouache that already read well. **Late Century** is now 1990s horror paperback and VHS box art: airbrush, harsh flash, sodium orange against CRT green, film grain and tape fringing, beige computers and payphones. **Present** is now prestige-TV cinematography as a digital matte painting: cold LED and magenta neon, phone glow, razor-sharp detail, rain reflections, drones and smart devices.\n` +
    `- **Monsters follow MONSTER-DESIGN.md.** Every monster in the written cases has its own concept: what it copies, what is wrong with it, the fear underneath (tools/monster-prompts.js). The generic monsters are now one of each kind for each era (60), so a 1990s side job gets a 1990s monster.\n` +
    `- **Threats that are not creatures**: a place, a cursed object and an event for each era (18), for the side jobs that are ended with a rite.\n` +
    `- **Items** get one painted still-life style; **agency seals** are drawn in the visual language of the year each agency was founded.\n` +
    `- File names follow the game's folders, so finished pictures can be dropped in as they come.\n\n| Group | Pictures |\n|---|---|\n`;
  for (const g of groups) md += `| ${g} | ${rows.filter((r) => r.group === g).length} |\n`;
  md += `\n## The full list\n`;
  for (const g of groups) {
    md += `\n### ${g}\n\n`;
    for (const r of rows.filter((x) => x.group === g)) md += `- \`${r.file}\` (${r.size})${r.redo === "keep" ? " **[keep: rulebook art]**" : r.redo === "new" ? " **[new]**" : ""}: **${r.subject}**. ${r.prompt}${r.negative ? ` Keep out: ${r.negative}.` : ""}${r.note ? ` _${r.note}_` : ""}\n`;
  }
  fs.writeFileSync(path.join(out, "ASSET-LIST.md"), md);
  /* the batch for the generator: only what has to be made again or is new */
  const todo = rows.filter((r) => r.redo && r.redo !== "keep");
  fs.writeFileSync(path.join(out, "asset-list-v4-todo.csv"), "group,file,size,subject,style,prompt,negative,redo,note\n" + todo.map((r) => ["group", "file", "size", "subject", "style", "prompt", "negative", "redo", "note"].map((k) => `"${String(r[k]).replace(/"/g, '""')}"`).join(",")).join("\n") + "\n");
  console.log(todo.length, "to make in asset-list-v4-todo.csv");
  console.log(rows.length, "images in", groups.length, "groups");
  for (const g of groups) console.log(" ", rows.filter((r) => r.group === g).length, g);
})();
