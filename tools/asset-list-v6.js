/* ============================================================================
   ASSET LIST v6 — every picture the game needs, written to the owner's v6 rules
   (art/V6-PICTURE-RULES.md). Reads the running game for what exists (cases, people,
   enemies, scenes), and takes the words from the hand-written tables:
     tools/v6-places-a.js, v6-places-b.js   places (one line each)
     tools/v6-monsters.js                    enemies
     tools/v6-outfits.js                     the 120 agent outfits
   Usage: start the game (npm start), then: node tools/asset-list-v6.js [url] [outdir]
   ========================================================================== */
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path");
const ES = require("./era-style.js");
const MP = require("./monster-prompts.js");
const OUT = require("./v6-outfits.js");
const MON = require("./v6-monsters.js");
const PA = require("./v6-places-a.js"), PB = require("./v6-places-b.js"), PC = require("./v6-places-c.js");
const LOCALE = { ...PA.LOCALE, ...PB.LOCALE, ...PC.LOCALE }, PLACE = { ...PA.PLACE, ...PB.PLACE, ...PC.PLACE };
Object.assign(MON.M, PC.MONSTERS);
const url = process.argv[2] || "http://localhost:3000", out = process.argv[3] || path.join(__dirname, "..");
const v5src = fs.readFileSync(path.join(__dirname, "asset-list.js"), "utf8");
const grab = (name) => {
  const i = v5src.indexOf(`const ${name} = {`); if (i < 0) return {};
  let j = v5src.indexOf("{", i), d = 0, q = null, esc = false;
  for (; j < v5src.length; j++) { const c = v5src[j]; if (q) { if (esc) esc = false; else if (c === "\\") esc = true; else if (c === q) q = null; } else if (c === '"' || c === "'" || c === "`") q = c; else if (c === "{") d++; else if (c === "}" && --d === 0) break; }
  return eval("(" + v5src.slice(v5src.indexOf("{", i), j + 1) + ")");
};

(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto(url); await p.waitForTimeout(1500);
  const data = await p.evaluate(() => {
    const strip = (h) => String(h || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    const eraOf = (y) => CDATA.eraOf(y).id;
    CAMP.newCampaign({ name: "x", year: 1976, agency: "OID" });
    const cases = [];
    for (const a of Object.values(ADV.LIBRARY)) {
      if (a.custom || a.generated) continue;
      cases.push({ id: a.id, title: a.title, year: a.year, era: eraOf(a.year), setting: a.setting, region: a.region || (CAMP.regionOfCase ? CAMP.regionOfCase(a) : ""),
        npcs: Object.entries(a.npcs || {}).map(([id, n]) => ({ skin: n.face ? ART.SKIN.indexOf(n.face.skin) : -1, id, name: n.name, tag: n.tag || "", look: n.look || "", sex: (n.face && n.face.sex) || "", recurs: n.recurs || "" })),
        enemies: Object.entries(a.enemies || {}).map(([id, e]) => { const x = e.build || e; return { id, name: x.name, type: x.type || "", dies: x.dies || "" }; }),
        scenes: Object.entries(a.scenes || {}).map(([id, s]) => ({ id, name: s.name, theme: s.theme || "street" })),
        fights: Object.entries(a.encounters || {}).map(([id, e]) => ({ id, name: e.name, theme: e.theme || "interior" })) });
    }
    CAMP.loadAdventure("death-of-a-bloodline");
    const M = window.MODULE;
    const dob = { id: "death-of-a-bloodline", title: M.title, year: M.year, era: eraOf(M.year), setting: "Kanda, Tokyo, Japan, 1976",
      agents: (M.agents || []).map((a) => ({ id: a.id, name: a.name, tag: `${a.role || ""}, ${a.age || ""}`, look: strip(a.bio), sex: "" })),
      npcs: Object.entries(M.npcs || {}).map(([id, n]) => ({ id, name: n.name, tag: n.tag || "", look: n.look || "", sex: "" })),
      enemies: Object.entries(M.enemies || {}).map(([id, e]) => ({ id, name: e.name, type: e.type || "" })),
      scenes: Object.entries(M.locations || {}).map(([id, l]) => ({ id: l.scene || id, name: l.name })) };
    const seen = new Set(); dob.scenes = dob.scenes.filter((s) => (seen.has(s.id) ? false : seen.add(s.id)));
    return { cases, dob, eras: CDATA.ERAS.map((e) => ({ id: e.id, name: e.name, from: e.from, to: e.to })), agencies: CDATA.AGENCIES.map((a) => ({ id: a.id, name: a.name, short: a.short, founded: a.founded })), patrons: GD.deities.map((d) => ({ name: d.name, text: strip(d.text).slice(0, 420) })) };
  });
  await b.close();

  /* ---- the ban list: style, palette, lighting and mood words never reach a row ---- */
  const BAN = [[/\b(oil[- ]painting|oil-painted|gouache|tempera|airbrush|matte painting|illustration|cinematic|film grain|halftone|dramatic lighting|dramatic|moody|dark and unsettling|atmospheric|sepia|saturated|lens flare|flare|uncanny|eerie|creepy|ominous|sinister|spooky)\b/gi, ""], [/\bphotograph(s|ic)?\b/gi, "framed picture"], [/\bglowing\b/gi, "lit"], [/\bglow\b/gi, "light"], [/\b(teal|turquoise|magenta|mustard|bruise purple)\b/gi, ""], [/\b(old|antique|vintage|weathered|worn|gothic|cobbled|rustic|period)\b /gi, ""]];
  const scrub = (t) => { let s = String(t); for (const [re, r] of BAN) s = s.replace(re, r); return s.replace(/\s{2,}/g, " ").replace(/\s+,/g, ",").replace(/,\s*,/g, ",").trim(); };
  const rows = [];
  const kindOf = (f) => (/^portraits\//.test(f) ? "portrait" : /^monsters\//.test(f) ? "monster" : /^scenes\//.test(f) ? "place" : /^items\//.test(f) ? "item" : /^hideout\//.test(f) ? "hideout" : /^ui\/agency/.test(f) ? "emblem" : /^patrons\//.test(f) ? "patron" : "title");
  const eraCol = (id, year) => { const k = ES.eraKey(id, year); return k === "late" || k === "future" ? "now" : id === "future" ? "now" : (k === "now" ? "now" : id); };
  const add = (group, file, size, subject, prompt, note = "", negative = "", meta = {}) => {
    const kind = kindOf(file);
    const row = { file, size, subject, group, era: meta.era || "", kind, year: meta.year || (group.match(/\((\d{4})\)/) || [])[1] || "", hero: meta.hero || String(subject).split(" (")[0], prompt: meta.keep ? prompt : scrub(prompt), negative, note, redo: meta.redo || "v6" };
    rows.push(row); return row;
  };
  const SQ = "1024x1024", WIDE = "1344x768";
  const hsh = (t) => [...String(t)].reduce((h, ch) => (Math.imul(h, 31) + ch.charCodeAt(0)) >>> 0, 7);
  const aOrAn = (s) => (/^[aeiou]/i.test(s) ? "an" : "a");
  const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const missing = [];

  /* 1. agent portraits: 120 (6 eras x 2 sexes x 10), every outfit different */
  /* adults who could be agents: mostly twenties to forties, one in fifty is older, nobody frail */
  const LOOKS = {
    f: ["young woman in her early twenties, sharp eyes", "woman in her thirties, tired but determined", "woman in her forties with a firm jaw, a few grey strands", "woman in her twenties, freckles, wary smile", "woman in her forties, a scar on her cheek", "woman in her thirties with cropped hair and a steady gaze", "woman in her late twenties, a crooked smile", "woman in her mid-thirties, strong shoulders, calm eyes", "woman in her fifties, weathered and lean, still upright", "woman in her early thirties, high cheekbones, watchful"],
    m: ["young man in his early twenties, clean-shaven, nervous", "man in his thirties, stubble, haunted look", "man in his forties with a moustache, sardonic", "man in his twenties, broad shoulders, crooked nose", "man in his thirties, lean with sunken cheeks and sharp eyes", "man in his late twenties, a chipped tooth, easy grin", "man in his mid-thirties, heavy-set, kind eyes", "man in his forties with a short beard, calm", "man in his fifties, weathered and lean, still upright", "man in his early thirties, dark circles under steady eyes"]
  };

  /* two of each group per era and sex, weighted to where the agencies are from (France and England, the Bahamas and the Americas, Japan, China, India and the Middle East) */
  const HERITAGE10 = ["white British", "white Italian", "Polish", "Black West African", "Japanese", "white French", "Turkish", "Mexican", "white American", "Pacific Islander", "Afro-Caribbean", "Chinese", "Russian", "Brazilian", "Irish", "Black American", "Korean", "Indian", "Maori", "Arab", "Scandinavian", "Filipino"];
  for (const e of data.eras.filter((x) => OUT[x.id])) for (const sex of ["f", "m"]) LOOKS[sex].forEach((lk, i) => {
    const n = String(i + 1).padStart(2, "0"), outfit = OUT[e.id][sex][i], her = HERITAGE10[(i * 2 + (sex === "f" ? 0 : 7) + data.eras.indexOf(e) * 5) % HERITAGE10.length];
    add("Agent portraits (character creator)", `portraits/agents/${e.id}-${sex}-${n}.png`, SQ, `${e.name}: ${sex === "f" ? "woman" : "man"} ${n}`,
      `head-and-shoulders portrait of (${aOrAn(her)} ${her} ${lk}:1.3), wearing (${outfit}:1.3), ${ES.POSES[(i * 3 + 1) % 10]}, ${ES.EXPRESSIONS[(i * 7 + 2) % 10]}, a dim plain wall, face in the upper middle`,
      "Every agent of an era and sex has a different outfit. Heritage, age and build vary within the era.", "(multiple people:1.3), (signature, text, watermark:1.5)" + (e.id === "modern" || e.id === "now" ? "" : ", (modern clothes:1.2)"), { era: e.id });
  });

  /* 1b. fighters: knights and soldiers through the ages */
  const FIGHTERS = [
    ["medieval", "f", "a woman knight of a holy order in a mail hauberk and a white surcoat marked with a black sun, cropped hair, a scar through one eyebrow, a sword hilt at her shoulder"],
    ["medieval", "m", "a North African man-at-arms in a battered kettle helmet, a quilted gambeson and a mail shirt, a spear over his shoulder, hard tired eyes"],
    ["victorian", "f", "a Black African woman in a ceremonial plate breastplate over a dark riding habit, a black-sun badge on the lapel, a sabre at her side"],
    ["victorian", "m", "a South Asian soldier of the 1880s in a khaki tunic with a turban and a bandolier, a Martini-Henry rifle, a veteran's calm face"],
    ["wars", "f", "a Great War woman ambulance driver in a greatcoat and a steel Brodie helmet, a gas-mask bag across her chest, mud on her face"],
    ["wars", "m", "a 1917 trench soldier with improvised steel armour plates strapped over his tunic, a Brodie helmet, a trench club, haunted eyes"],
    ["atomic", "f", "a 1950s Women's Army Corps radio sergeant in olive drab and a garrison cap, headphones round her neck, sharp and unafraid"],
    ["atomic", "m", "a 1950s paratrooper in an M1 helmet with netting and olive fatigues, a cigarette behind his ear, a thousand-yard stare"],
    ["modern", "f", "a 1990s UN peacekeeper in a blue helmet and a flak jacket over desert camouflage, dust in her hair"],
    ["modern", "m", "a 1990s special-forces soldier in woodland camouflage and a boonie hat, face paint, a radio handset clipped to his vest"],
    ["now", "f", "a modern holy-order knight in sleek matte-black ceramic plate armour with a black-sun sigil, tactical webbing, a short sword and a sidearm, hair tied back"],
    ["now", "m", "a present-day private military contractor in a plate carrier and a helmet with a night-vision mount, a black-sun patch on the shoulder"]
  ];
  FIGHTERS.forEach(([era, sex, d], i) => add("Agent portraits: knights and soldiers", `portraits/agents/${era}-${sex}-${String(23 + (i % 2)).padStart(2, "0")}.png`, SQ, d.split(",")[0],
    `head-and-shoulders portrait of (${d}:1.3), ${ES.POSES[(i * 3 + 1) % 10]}, ${ES.EXPRESSIONS[(i * 7 + 2) % 10]}, a dim plain wall, face in the upper middle`,
    "A fighter from this era. The black sun is the Order of Infinite Dark's emblem.", (era === "modern" || era === "now" ? "(cosplay, costume:1.2)" : "(modern clothes, cosplay, costume:1.2)") + ", (multiple people:1.3), (signature, text, watermark:1.5)", { era }));

  /* 2. named characters: one row for a recurring person, one picture for every case he or she is in */
  const recurring = {}, CLOTHES = /\b(wear|wears|wearing|duster|mail|pelt|boots|trousers|skirt|tie|glasses|spectacles|gloves|helmet|armour|armor|belt|badge|coat|dress|suit|cloak|robe|habit|uniform|jacket|apron|shirt|hat|veil|turban|sari|kimono|vest|jerkin|surcoat|tunic|cap|scarf|gown|cardigan|smock|fleece|hoodie|collar|shawl|sleeves|cravat|waistcoat|cassock|overalls|jumper|headscarf|bonnet|bowler)\b/i;
  const npcRow = (c, n) => {
    if (n.recurs && recurring[n.recurs]) { recurring[n.recurs].note += ` Also appears in ${c.title}: the game shows this one picture there too.`; return; }
    const ek = ES.eraKey(c.era, c.year), era = eraCol(c.era, c.year), eid = OUT[era] ? era : "now", h = hsh(n.name);
    const sx = n.sex === "f" ? "f" : "m";
    const clothed = CLOTHES.test(n.look || "");
    const REG = { europe: ["white European", "white European", "white European", "Mediterranean", "Black"], "asia-east": ["East Asian", "East Asian", "East Asian", "East Asian", "East Asian"], "asia-south": ["South Asian", "South Asian", "South Asian", "South Asian", "South Asian"], "africa-me": ["Arab", "Arab", "Arab", "North African", "Black West African"], "americas-north": ["white American", "white American", "Latino", "Black American", "Black American"], "americas-south": ["Latin American", "Latin American", "Latin American", "Indigenous Amazonian", "Afro-Brazilian"], oceania: ["white Australian", "white Australian", "Maori", "Aboriginal", "Aboriginal"] };
    const OVER = { "long-count": "Black Nigerian", "lantern-on-the-water": "Black Bahamian", "white-shoes": "Brazilian river-villager", "last-reef": "Pacific Islander", "heat-dome": "Indian" };
    let her = (REG[c.region || "europe"] || REG.europe)[!(n.skin >= 0) ? hsh(n.name) % 5 : Math.min(4, n.skin)];
    if (OVER[c.id] && (n.skin >= 3 || n.skin < 0)) her = OVER[c.id];
    const outfit = clothed ? "" : `, wearing (${OUT[eid][sx][h % 10]}:1.3)`;
    const sexw = n.sex === "f" ? "woman" : n.sex === "m" ? "man" : "person";
    const lk = String(n.look || n.tag).replace(/\.\s*$/, "").split(/(?<=\.)\s+/).slice(0, 2).join(" ").replace(/\.$/, "");
    const row = add(`Characters: ${c.title} (${c.year})`, n.recurs ? `portraits/npc/recurring-${n.recurs}.png` : `portraits/npc/${c.id}-${n.id}.png`, SQ, `${n.name}, ${n.tag}`,
      `head-and-shoulders portrait of (${aOrAn(her)} ${her} ${sexw}, ${n.tag ? n.tag.split(" · ")[0] + ", " : ""}${lk}:1.3)${outfit}, ${ES.POSES[h % 10]}, ${ES.EXPRESSIONS[(h >>> 3) % 10]}, a dim plain wall, face in the upper middle`,
      n.recurs ? `Recurring: appears in several cases of ${c.title.split(":")[0]}; one picture serves all.` : "", "(multiple people:1.3), (signature, text, watermark:1.5)" + (era === "modern" || era === "now" ? "" : ", (modern clothes:1.2)"), { era, year: c.year });
    if (n.recurs) recurring[n.recurs] = row;
  };
  for (const c of [data.dob, ...data.cases]) { for (const a of c.agents || []) npcRow(c, a); for (const n of c.npcs) npcRow(c, n); }

  /* 3. monsters: every enemy of every case */
  const MFRAME = "full figure, centred, plain dark background";
  for (const c of [data.dob, ...data.cases]) for (const e of c.enemies) {
    const m = MON.M[`${c.id}/${e.id}`] || MP.CASE[`${c.id}/${e.id}`];
    if (!m) { missing.push(`monster ${c.id}/${e.id}`); continue; }
    const mp = (/eldritch horror|monstrous/i.test(m[1]) ? m[1] : `${m[1]}, eldritch horror`).replace(/, full figure, centred.*$/, "");
    add(`Monsters: ${c.title} (${c.year})`, `monsters/${c.id}-${e.id}.png`, SQ, m[0], `${mp}, ${MFRAME}`, `Shown as a round token in fights and as a plate when inspected.${e.dies ? ` When defeated it ${e.dies}.` : ""}`, MON.NEGATIVE, { era: eraCol(c.era, c.year), year: c.year });
  }
  for (const [k, d] of Object.entries(MON.DOB)) if (k !== "ghost") add(`Monsters: ${data.dob.title} (1976)`, `monsters/death-of-a-bloodline-${k}.png`, SQ, d[0], `${d[1].replace(/, full figure, centred.*$/, "").replace(/, centred.*$/, "")}, ${MFRAME}`, "The boss changes shape during the final fight.", MON.NEGATIVE, { era: "atomic", year: "1976" });
  for (const e of data.eras) for (const [kind, m] of Object.entries(MP.GENERIC[e.id] || {})) {
    const pr = (/eldritch horror|monstrous/i.test(m[1]) ? m[1] : `${m[1]}, eldritch horror, monstrous`).replace(/, (full figure, )?centred.*$/, "");
    add("Monsters: generic, by era (your own cases and the Director)", `monsters/generic/${e.id}-${kind}.png`, SQ, `${e.name}: ${m[0]}`, `${pr}, ${MFRAME}`, `Kind: ${kind}. The file name carries the era so the game can pick a monster that belongs to the case's time.`, MON.NEGATIVE, { era: e.id });
  }

  /* 4. places */
  const INDOOR = /(inside|interior|room|kitchen|office|booth|hall|lobby|library|surgery|studio|workshop|crypt|cellar|cabin|car |chapel|nave|refectory|infirmary|pub|snack|cafe|stairwell|corridor|landing|galler|apartment|bedsit|foundry|brewhouse|hut|tent|clinic|shack|diner|cloister|stage|lodging|dressing|basement|cab of|flat|schoolroom|schoolhouse|tavern|vault|shop|bell chamber|sitting|surgical|ward|bedroom|church|smithy|factory|barn)/i;
  const WEIGH = ["1.3", "1.2", "1.2"];
  const placeRow = (c, key, file, name, fight, theme) => {
    const loc = LOCALE[c.id], line = (PLACE[c.id] || {})[key];
    if (!loc || !line) { missing.push(`place ${c.id}/${key}`); return; }
    const [hero, extra = ""] = line.split(" | ");
    const era = eraCol(c.era, c.year), i = hsh(key) % 4, eo = [loc.era[i % 4], loc.era[(i + 1) % 4], loc.era[(i + 2) % 4]];
    const indoor = INDOOR.test(hero);
    const lc = indoor ? "" : `, ${loc.local[i % 4]}, ${loc.local[(i + 1) % 4]}`;
    const prompt = `(${hero}:1.3), ${extra ? extra.split("; ").join(", ") + ", " : ""}(${eo[0]}:${WEIGH[0]}), (${eo[1]}:${WEIGH[1]}), (${eo[2]}:${WEIGH[2]}), ${loc.where}${lc}, wide view, ${fight ? "plain empty ground across the bottom third" : "calm empty space on the right third"}`;
    add(`Places: ${c.title} (${c.year})`, file, WIDE, name, prompt, fight ? "Fight backdrop: the game lays three zones over it left to right." : "In the game, character portraits cover part of the right side.", "(people, person, figure, crowd, face:1.4)", { era, year: c.year });
  };
  for (const c of data.cases) {
    for (const sc of c.scenes) placeRow(c, sc.id, `scenes/${c.id}-${sc.id}.png`, sc.name, false, sc.theme);
    for (const f of c.fights) placeRow(c, `fight:${f.id}`, `scenes/${c.id}-fight-${f.id}.png`, `${f.name} (fight)`, true, f.theme);
  }
  const DOB = grab("DOB");
  const DOBLOC = { where: "Kanda, Tokyo, Japan, 1976", era: ["a round-dial black telephone", "a wood-grain television set", "a fusuma sliding door", "a fluorescent ceiling tube"], local: ["vending machines", "overhead wires", "corrugated roofs", "a danchi block"] };
  for (const [k, d] of Object.entries(DOB)) {
    const dd = d.replace(/\.\s*$/, ""), era = DOBLOC.era;
    add(`Places: ${data.dob.title} (1976)`, `scenes/death-of-a-bloodline-${k}.png`, WIDE, k,
      `(${dd}:1.3), (${era[0]}:1.2), (${era[1]}:1.2), (${era[2]}:1.2), ${DOBLOC.where}, ${INDOOR.test(dd) || /interior|hall|apartment|kitchen|bedroom|study|dojo/i.test(dd) ? "" : DOBLOC.local.slice(0, 2).join(", ") + ", "}wide view, calm empty space on the right third`,
      "Death of a Bloodline: the original hand-built case. Its pictures were missing from the earlier lists.", "(people, person, figure, crowd, face:1.4)", { era: "atomic", year: "1976" });
  }

  /* 5. generic places for your own cases and the Director */
  const THEMES = { street: "a city street", interior: "a lived-in room", cellar: "a cellar", forest: "a forest path", village: "a small village lane", castle: "a ruined castle", fog: "a street in fog", trench: "a war trench", desert: "a dusty desert road", snow: "a snow-covered road", sea: "a harbour quay", cave: "a cave mouth", church: "a church interior", train: "a railway carriage", drive: "a roadside car park", modern: "an office", lab: "a laboratory", future: "a megacity street" };
  const FITS = { trench: ["wars"], future: ["now"], drive: ["atomic", "modern"], modern: ["modern", "now"], castle: ["medieval", "victorian"], train: ["victorian", "wars", "atomic", "modern", "now"], lab: ["victorian", "wars", "atomic", "modern", "now"] };
  const INDOORT = new Set(["interior", "modern", "church", "cellar", "train", "lab"]), STREETY = new Set(["street", "fog", "drive", "future", "village"]);
  for (const [t, d] of Object.entries(THEMES)) for (const e of data.eras.filter((x) => ES.INDOOR[x.id])) {
    if (FITS[t] && !FITS[t].includes(e.id)) continue;
    const k = e.id, tt = ES.THEME_TECH[t] && ES.THEME_TECH[t][k];
    const WAY = { medieval: "a pilgrim's staff, a rushlight lantern, a hooded wool cloak", victorian: "a brass hand lantern, a hooded cab, a coil of hemp rope", wars: "a motor lorry, a hurricane lamp, a coil of telephone cable", atomic: "a tail-fin car, a battery torch, a roadside billboard shape", modern: "a boxy hatchback, a payphone, a pylon", now: "an SUV, a head torch, a wind turbine" };
    const CAVE = { medieval: "an iron-ringed rush torch, a hemp rope, a wooden prop", victorian: "a miner's brass safety lamp, a timber prop, a wooden ladder", wars: "a hurricane lamp, a coil of field cable, a steel ladder", atomic: "a battery lantern, a steel-rung ladder, a coiled rope", modern: "a plastic helmet lamp, a nylon rope, an aluminium ladder", now: "a head torch, a carabiner rope, a folding ladder" };
    const base = tt || (INDOORT.has(t) ? ES.INDOOR[k] : STREETY.has(t) ? ES.STREET[k] : t === "cave" ? CAVE[k] : ES.WILD[k] + ", " + WAY[k]);
    const parts = base.split(", ").filter(Boolean).slice(0, 5).map((x, j) => (j === 0 ? `(${x}:1.3)` : j < 3 ? `(${x}:1.2)` : x));
    add("Places: generic (your own cases and the Director)", `scenes/generic/${t}-${e.id}.png`, WIDE, `${t}, ${e.name}`, `(${d}:1.3), ${parts.join(", ")}, wide view, calm empty space on the right third`,
      "A stand-in place for cases a game master writes. " + (k === "modern" ? "Modern means the 1990s and early 2000s here." : ""), "(people, person, figure, crowd, face:1.4)", { era: e.id, hero: d });
  }

  /* 6. hideouts, one per era */
  for (const e of data.eras.filter((x) => ES.INDOOR[x.id])) add("Hideout", `hideout/${e.id}.png`, WIDE, `The agency hideout, ${e.name}`,
    `(a secret investigators' headquarters room:1.3), (${ES.INDOOR[e.id].split(", ").slice(0, 3).join(", ")}:1.2), left to right: a case board pinned with pictures and string, a weapons rack, a door, a telephone on the wall, tall shelves of files, a safe or strongbox, wide view`,
    "Keep the objects roughly in that left-to-right order: the clickable spots are placed on them.", "(people:1.4)", { era: e.id });

  /* 7. patrons, title and emblems: unchanged, the rulebook's own art */
  for (const d of data.patrons) add("Patrons", `patrons/${slug(d.name)}.png`, WIDE, d.name, `${d.name}, a patron deity of the Beyond. KEEP the rulebook's own art.`, "KEEP: the game shows the rulebook's own art for every patron. Listed so the list is complete; do not replace.", "", { redo: "keep", keep: true });
  add("Title and agencies", "ui/title.png", WIDE, "Title screen", "KEEP the rulebook's painting.", "KEEP: the title screen uses the rulebook's painting. Listed so the list is complete; do not replace.", "", { redo: "keep", keep: true });
  for (const a of data.agencies) add("Title and agencies", `ui/agency-${a.id.toLowerCase()}.png`, "512x512", `${a.name} emblem`, `(a round emblem for "${a.name}" (${a.short}), founded ${a.founded}, in the heraldry of its founding time:1.3), simple, iconic, centred, plain dark background, no lettering`, "Round agency seals: shown as round badges in the game.", "(text, letters, words:1.4)", { era: "items" });

  /* 8. items */
  const ITEMS = grab("ITEMS");
  for (const [k, d] of Object.entries(ITEMS)) add("Items and things in scenes", `items/${k}.png`, SQ, k, `(${d}:1.3), its shape, material and one telling detail, centred, seen slightly from above, plain dark background`,
    "Shown small (about 60px) on the spot you click and in the case file, so keep one clear object with a strong silhouette.", "(hands, people, multiple objects, clutter:1.3)", { era: "items" });

  if (missing.length) console.log("MISSING:", missing.join(", "));
  /* the check: every row against the rules */
  const BANRE = /\b(oil[- ]painting|gouache|tempera|airbrush|matte painting|illustration|cinematic|film grain|halftone|dramatic|moody|atmospheric|sepia|saturated|glow|flare|teal|turquoise|magenta|mustard)\b/i;
  const bad = rows.filter((r) => !r.keep && BANRE.test(r.prompt));
  console.log("rows with a banned word left:", bad.length, bad.slice(0, 5).map((r) => r.file + " :: " + (r.prompt.match(BANRE) || [])[0]));
  const COLS = ["file", "size", "subject", "group", "era", "kind", "year", "hero", "prompt", "negative", "note"];
  const csv = (list) => COLS.join(",") + "\n" + list.map((r) => COLS.map((k) => `"${String(r[k]).replace(/"/g, '""')}"`).join(",")).join("\n") + "\n";
  if (fs.existsSync(path.join(out, "art", "asset-list.csv")) === false) { /* first run */ }
  fs.writeFileSync(path.join(out, "art", "asset-list-v6.csv"), csv(rows));
  fs.writeFileSync(path.join(out, "art", "asset-list-v6-todo.csv"), csv(rows.filter((r) => r.redo !== "keep")));
  const groups = [...new Set(rows.map((r) => r.group))];
  let md = `# The Beyond: picture list v6\n\n${rows.length} pictures, written to the owner's v6 rules (art/V6-PICTURE-RULES.md). \`asset-list-v6.csv\` has every row; \`asset-list-v6-todo.csv\` has only what has to be made (everything except the patrons and the title screen).\n\n`;
  md += `Columns: file, size, subject, group, era, kind, year, hero, prompt, negative, note. The \`style\` column is gone: the generator adds the fixed tail.\n\n`;
  md += `## What changed from v5\n- No style, palette, lighting or mood words in any row. Light sources appear only as objects.\n- Era and place come from content: three weighted era objects in every row, and the case's country, city and building repeated in every place row.\n- Hero subject first, once per picture. Interiors list indoor objects; places have no people; fight backdrops keep the bottom third plain.\n- Agent portraits: 120 different outfits (two to three garments and one detail each), every agent portrait ends "face in the upper middle".\n- Monsters are written to look like monsters: wrongness in anatomy and materials, "eldritch horror" or "monstrous" in every creature row.\n- The old rows for jobs that no longer exist (the generated side jobs and their "threat" monsters) are gone. Death of a Bloodline's places are all listed.\n- Every case, person and enemy is new or rewritten: see the group list below.\n\n`;
  md += `| Group | Pictures |\n|---|---|\n`;
  for (const g of groups) md += `| ${g} | ${rows.filter((r) => r.group === g).length} |\n`;
  md += `\n## The full list\n`;
  for (const g of groups) { md += `\n### ${g}\n\n`; for (const r of rows.filter((x) => x.group === g)) md += `- \`${r.file}\` (${r.size})${r.redo === "keep" ? " **[keep]**" : ""}: **${r.subject}**. ${r.prompt}${r.negative ? ` Keep out: ${r.negative}.` : ""}\n`; }
  fs.writeFileSync(path.join(out, "art", "ASSET-LIST-v6.md"), md);
  console.log(rows.length, "pictures in", groups.length, "groups;", rows.filter((r) => r.redo !== "keep").length, "to make");
  const cnt = {}; for (const r of rows) cnt[r.kind] = (cnt[r.kind] || 0) + 1; console.log(cnt);
})();
