/* ============================================================================
   ASSET LIST — reads the running game and writes the list of every picture an
   illustrated edition needs: ASSET-LIST.md (to read) and asset-list.csv (one
   row per image, for an image generator to work through).
   Usage: start the game (npm start), then: node tools/asset-list.js [url] [outdir]
   ========================================================================== */
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path");
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
  const add = (group, file, size, subject, prompt, note = "") => rows.push({ group, file, size, subject, prompt: prompt.replace(/\s+/g, " ").trim(), note });
  const SQ = "1024x1024", WIDE = "1344x768", TALL = "832x1216";
  const eraWords = { medieval: "medieval or early-modern Europe", victorian: "Victorian era, 1850s-1900s", wars: "World War era, 1910s-1940s", atomic: "atomic age, 1950s-1980s", modern: "late 20th century, 1990s-2010s", now: "near present day, 2020s-2030s" };
  const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  /* 1. player portraits */
  const LOOKS = {
    f: ["young woman, sharp eyes, hair pinned up", "woman in her thirties, tired but determined", "older woman, grey hair, stern", "woman in her twenties, freckles, wary smile", "woman in her forties, scar on her cheek", "woman with short cropped hair, steady gaze", "heavyset woman, warm face, guarded eyes", "woman with glasses, scholarly, ink on her fingers", "athletic woman, braided hair, weathered", "elderly woman, kind face, very alert"],
    m: ["young man, clean-shaven, nervous energy", "man in his thirties, stubble, haunted look", "older man, white beard, calm", "man in his twenties, broad shoulders, crooked nose", "man in his forties, moustache, sardonic", "lean man with sunken cheeks, sharp suit for the era", "heavyset man, bald, gentle eyes", "man with spectacles, bookish, unruly hair", "scarred veteran, hard jaw", "elderly man, deeply lined face, wry smile"]
  };
  for (const e of data.eras) for (const sex of ["f", "m"]) LOOKS[sex].forEach((lk, i) => {
    const n = String(i + 1).padStart(2, "0");
    add("Agent portraits (character creator)", `portraits/agents/${e.id}-${sex}-${n}.png`, SQ, `${e.name}: ${sex === "f" ? "woman" : "man"} ${n}`,
      `head-and-shoulders portrait of a ${lk}, clothing and hairstyle of the ${eraWords[e.id]}, investigator of the supernatural, plain dark background, looking at the viewer`,
      "Vary ethnicity and build across the set.");
  });

  /* 2. named characters */
  const npcRow = (c, n, prefix = "npc") => add(`Characters: ${c.title} (${c.year})`, `portraits/${prefix}/${c.id}-${n.id}.png`, SQ, `${n.name}, ${n.tag}`,
    `head-and-shoulders portrait of ${n.name}, ${n.tag}, ${c.setting}. ${n.look} Plain dark background.`);
  for (const c of [data.dob, ...data.cases]) { for (const a of c.agents || []) npcRow(c, a, "npc"); for (const n of c.npcs) npcRow(c, n); }

  /* 3. monsters */
  for (const c of [data.dob, ...data.cases]) for (const e of c.enemies) add(`Monsters: ${c.title} (${c.year})`, `monsters/${c.id}-${e.id}.png`, SQ, `${e.name}${e.type ? ` (${e.type})` : ""}`,
    `${e.name}, ${({ beyond: "a being from the Beyond", spirit: "a ghost", undead: "an undead thing", human: "a possessed or twisted person", construct: "an animated thing that should not move", swarm: "a swarm", feral: "a monstrous beast", folklore: "a creature out of folklore", divine: "a false holy presence", golem: "a figure of stone or clay brought to life" })[String(e.type).toLowerCase()] || "a supernatural creature"} from "${c.title}", ${c.setting}. ${e.dies ? `When defeated it ${e.dies}.` : ""} Full figure, centred, menacing, plain background.`,
    "Shown as a round token in fights and as a plate when inspected: keep the figure centred with space around it.");
  for (const [k, d] of Object.entries({ ghost_base: "the Paper Ghost: a woman made of folded white paper and lilies, hair like torn strips", ghost_blades: "the Paper Ghost enraged: paper folded into knife-edges around her", ghost_lantern: "the Paper Ghost as a paper lantern burning from inside" }))
    add(`Monsters: ${data.dob.title} (1976)`, `monsters/death-of-a-bloodline-${k}.png`, SQ, k, `${d}, Tokyo 1976. Full figure, centred, menacing, plain background.`, "The boss changes shape during the final fight.");
  const GENERIC = { spirit: "a ghost or restless spirit", undead: "a walking corpse or revenant", beast: "a monstrous animal or wolf-thing", swarm: "a swarm of rats, insects or crawling things", construct: "an animated machine, doll or automaton", beyond: "an alien horror from beyond reality, eyes and tendrils", humanoid: "a possessed or twisted human figure", divine: "a radiant, terrible false saint", folklore: "a creature from folk tales, almost human", golem: "a figure of stone or clay brought to life" };
  for (const [k, d] of Object.entries(GENERIC)) for (const i of [1, 2, 3]) add("Monsters: generic (side jobs and your own cases)", `monsters/generic/${k}-${i}.png`, SQ, `${k} ${i}`, `${d}, full figure, centred, menacing, plain background`, "Three variants each, so side jobs don't repeat.");

  /* 4. places in each case */
  for (const c of [...data.cases]) {
    for (const s of c.scenes) add(`Places: ${c.title} (${c.year})`, `scenes/${c.id}-${s.id}.png`, WIDE, `${s.name}`, `${s.name}, ${c.setting}. ${s.desc} Wide establishing view, atmospheric, no people in the foreground.`,
      "The right third is partly covered by character portraits; keep it calm.");
    for (const f of c.fights) add(`Places: ${c.title} (${c.year})`, `scenes/${c.id}-fight-${f.id}.png`, WIDE, `${f.name} (fight)`, `${f.name}, ${c.setting}. ${f.desc} Wide view, room to read three areas left to right, no figures.`, "Fight backdrop: three zones are laid over it left to right.");
  }
  const DOB = { street: "a rain-soaked Tokyo backstreet at night outside an old two-storey apartment block, 1976", station: "a police interview room, Kanda Station, 1976, fluorescent light", hall1: "ground floor hallway of a shabby 1970s Tokyo apartment building, doors along one side", hall2: "second floor hallway, same building, a door at the end left ajar", hall3: "third floor hallway, same building, dim and silent", doorway: "an apartment doorway seen from the hall, a neighbour's door half open", apt2b_living: "a small Tokyo apartment living room, tatami, a low table, everything too neat", apt2b_kitchen: "a narrow apartment kitchen, dishes in the sink, a calendar on the wall", apt2b_bedroom: "a small bedroom with futon rolled away, a child's drawings on the wall", apt2b_storage: "a cramped storage cupboard full of boxes and folded paper", apt2a: "a young courier's messy apartment, posters, a motorbike helmet", basement: "a dark boiler-room basement under the building, pipes and a locked door", paper_guest: "a guest room made entirely of folded white paper, uncanny", paper_dojo: "a dojo made entirely of folded paper, white lilies drifting", paper_study: "a study made of folded paper, shelves of paper books", paper_hall: "an apartment hallway made of folded paper, lilies on the floor", paper_2b: "the apartment living room rebuilt in folded paper, a figure-shaped space at its centre", title: "title art: a rainy Tokyo night street, one lit window, folded paper lilies floating in puddles", end_banish: "ending: dawn light through paper walls as they dissolve into lilies", end_kill: "ending: a ruined paper room, ash and torn lilies, rain outside" };
  for (const [k, d] of Object.entries(DOB)) add(`Places: ${data.dob.title} (1976)`, `scenes/death-of-a-bloodline-${k}.png`, WIDE, k, `${d}. Wide establishing view, atmospheric.`);

  /* 5. generic places for side jobs and your own cases */
  const THEMES = { street: "a city street at night", interior: "a lived-in room", cellar: "a cellar or basement", forest: "a dark forest", village: "a small village", castle: "a ruined castle", fog: "a fog-bound street", trench: "a war trench", desert: "a dusty plain or desert", sea: "a harbour or stormy coast", snow: "a snowbound landscape", church: "a church interior", lab: "a laboratory or workshop", modern: "an urban building interior", future: "a city of glass and screens", drive: "a lonely road or drive-in", cave: "a cave", train: "a train carriage" };
  const FITS = { trench: ["wars"], future: ["now"], drive: ["atomic", "modern"], modern: ["modern", "now"], castle: ["medieval", "victorian"], train: ["victorian", "wars", "atomic", "modern", "now"], lab: ["victorian", "wars", "atomic", "modern", "now"] };
  for (const [t, d] of Object.entries(THEMES)) for (const e of data.eras) {
    if (FITS[t] && !FITS[t].includes(e.id)) continue;
    add("Places: generic (side jobs and your own cases)", `scenes/generic/${t}-${e.id}.png`, WIDE, `${t}, ${e.name}`, `${d}, ${eraWords[e.id]}, at night or in gloom. Wide establishing view, atmospheric, no people.`);
  }

  /* 6. the hideout, one per era */
  for (const e of data.eras) add("Hideout", `hideout/${e.id}.png`, WIDE, `The agency hideout, ${e.name}`,
    `interior of a secret investigators' headquarters in the ${eraWords[e.id]}. Left to right: a case board pinned with photos and string; a weapons rack; a door; a telephone on the wall; tall shelves of files; a safe or strongbox; a doorway to a garage or stable. In front: a common table with chairs, a small desk with a logbook, an infirmary cot. Warm lamp light, slightly cluttered.`,
    "Keep the objects roughly in that left-to-right order; I'll place the clickable spots on them.");

  /* 7. patrons */
  for (const d of data.patrons) add("Patrons", `patrons/${slug(d.name)}.png`, WIDE, d.name, `${d.name}, a patron deity of the Beyond: ${d.text} Shown as an idol or presence on a dark altar, candlelight, awe and dread.`,
    "If your rulebook already has art for this patron, use that instead.");

  /* 8. title and agencies */
  add("Title and agencies", "ui/title.png", WIDE, "Title screen", "a lone investigator under a street lamp at night, rain, something vast and wrong in the clouds above the rooftops, room on the left for the game's title");
  for (const a of data.agencies) add("Title and agencies", `ui/agency-${a.id.toLowerCase()}.png`, "512x512", `${a.name} emblem`, `an emblem or seal for "${a.name}" (${a.short}), founded ${a.founded}, a secret organisation that fights the supernatural. Simple, iconic, on a plain background, no text.`);

  /* write */
  fs.writeFileSync(path.join(out, "asset-list.csv"), "group,file,size,subject,prompt,note\n" + rows.map((r) => ["group", "file", "size", "subject", "prompt", "note"].map((k) => `"${String(r[k]).replace(/"/g, '""')}"`).join(",")).join("\n") + "\n");
  const groups = [...new Set(rows.map((r) => r.group))];
  let md = `# The Beyond: picture list for an illustrated edition\n\n${rows.length} images. Every row in \`asset-list.csv\` is one picture, with its file name, size and a description to turn into a prompt.\n\n`;
  md += `## How to make them\n\n- **One style for everything.** Decide the style once (for example: painted, ink-and-wash, muted colour, film grain) and put the same style words at the start of every prompt. The descriptions below only say what's in each picture.\n- **No text, logos, watermarks, signatures or frames** in any picture.\n- **Sizes:** portraits and monsters are square (1024x1024), places are wide (1344x768). PNG, JPG or WEBP are all fine; keep each file under about 1 MB if you can.\n- **Portraits:** head and shoulders, the face in the upper middle, plain dark background. They are shown in circles and small cards, so faces must read at small size.\n- **Monsters:** full figure, centred, with space around it; they appear as round tokens in fights.\n- **Places:** wide establishing views without people in the foreground. The right third of the picture is often covered by character portraits.\n- **File names matter.** Save each image with exactly the file name in the list, keeping the folders (for example \`portraits/agents/victorian-f-01.png\`). Then zip the whole folder and send it over; I'll wire everything in as its own edition, next to the drawn and photo editions.\n- Anything you skip falls back to the drawn art, so you can deliver in batches. A good first batch: the agent portraits for one era, the characters and places of one case, and a few monsters.\n\n## Counts\n\n| Group | Images |\n|---|---|\n`;
  for (const g of groups) md += `| ${g} | ${rows.filter((r) => r.group === g).length} |\n`;
  md += `\n## The full list\n`;
  for (const g of groups) {
    md += `\n### ${g}\n\n`;
    for (const r of rows.filter((x) => x.group === g)) md += `- \`${r.file}\` (${r.size}): **${r.subject}**. ${r.prompt}${r.note ? ` _${r.note}_` : ""}\n`;
  }
  fs.writeFileSync(path.join(out, "ASSET-LIST.md"), md);
  console.log(rows.length, "images in", groups.length, "groups");
  for (const g of groups) console.log(" ", rows.filter((r) => r.group === g).length, g);
})();
