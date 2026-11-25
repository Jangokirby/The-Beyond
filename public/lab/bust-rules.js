/* BUST RULES: turn what the cases know about a person (gender, age, era, job, origin, mood) into a bust spec for figure-bust.js.
   Plain data and rules, no drawing, so the game, the command line and an outside agent can all use it. Same person (same name/seed) = same face.
   suggestBust({ name, gender:"f"|"m"|"x", age, year, job, origin, mood:"neutral|worried|stern|happy|shocked" }) -> spec */
const hash = (s) => { let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const pick = (a, h, salt = 0) => a[(Math.imul(h ^ (salt * 2654435761), 2246822519) >>> 0) % a.length];
const SKIN = { light: ["#f3d3b8", "#efc9a8", "#e8bd98"], olive: ["#d9a982", "#cf9d74", "#c8956c"], tan: ["#c08a62", "#b57f58", "#a8744e"], brown: ["#8a5a3c", "#7d5036", "#704630"], dark: ["#5a3a28", "#4e3222", "#432b1e"], east: ["#ecc7a2", "#e3bb94", "#d9ae85"] };
const ORIGIN = [[/africa|nigeria|ghana|congo|kenya|ethiop|senegal|bahamas|caribbean|jamaica|haiti/i, "dark"], [/india|pakistan|bengal|sri lanka|nepal|rajasthan|mumbai|delhi/i, "brown"], [/arab|egypt|turk|persia|iran|iraq|sahara|morocc|algeri|levant|syria|lebanon|maghreb|berber/i, "tan"], [/japan|china|korea|vietnam|thai|mongol|chengdu|shanghai|hong kong|tibet/i, "east"], [/brazil|mexic|peru|ecuador|colomb|latin|spain|portugal|italy|greece|malta|sicily|castile|galicia/i, "olive"]];
const HAIRC = { young: ["#2a1c14", "#4a3322", "#6a4a2e", "#8a5a2a", "#c9a45a", "#1c1410"], old: ["#b8b4ac", "#d6d2c8", "#9a968e"] };
const CLOTH = { work: ["#5a4a3c", "#4a5058", "#6a5a44", "#3f4a3f"], smart: ["#2f3a52", "#3a3a40", "#4a2f38", "#2f4a8a"], plain: ["#7d8794", "#6d7683", "#8a7a68", "#5a6a5a"] };
const MOODS = { neutral: ["flat", "line"], worried: ["worried", "frown"], stern: ["stern", "line"], happy: ["raised", "smile"], shocked: ["raised", "open"] };
export function suggestBust(a = {}) {
  const h = hash(a.name || a.job || "x"), year = +a.year || 1900, age = +a.age || 35, g = (a.gender || "x").toLowerCase()[0], job = String(a.job || "").toLowerCase(), set = `${a.origin || ""}`;
  const old = age >= 58, female = g === "f", male = g === "m";
  const origin = (ORIGIN.find(([re]) => re.test(set)) || [0, pick(["light", "light", "olive", "tan", "east", "brown", "dark"], h)])[1];
  const mil = /soldier|officer|sergeant|captain|private|trooper|army|navy|marine|guard|constable|police|warden/.test(job), nurse = /nurse|medic|doctor|surgeon|physician|orderly|matron/.test(job), worker = /miner|farmer|dock|worker|mechanic|smith|labou?r|porter|driver|fisher|sailor|peasant|servant|stoker/.test(job), clergy = /priest|monk|nun|chaplain|abbot|pastor|imam|rabbi/.test(job);
  const s = { name: a.name || undefined, skin: pick(SKIN[origin], h, 1), hairColor: old ? pick(HAIRC.old, h, 2) : pick(HAIRC.young, h, 2), nose: pick(["small", "long", "button"], h, 3), yaw: ((h % 7) - 3) * 4 };
  const [br, mo] = MOODS[a.mood] || MOODS.neutral; s.brows = br; s.mouth = mo; s.eyes = "none";
  // hair
  if (female) s.hair = pick(year > 1915 && year < 1935 ? ["bob", "bob", "bun"] : year < 1700 ? ["long", "bun", "long"] : ["bun", "long", "bob", "pony", "curly"], h, 4); else s.hair = old && h % 3 === 0 ? "bald" : pick(["short", "parted", "short", "curly"], h, 4);
  if (a.gender === "x") s.hair = pick(["short", "bob", "pony"], h, 4);
  // facial hair: men, by era and age
  if (male) { const fashion = year > 1840 && year < 1935 ? .55 : year < 1700 ? .5 : .22; if ((h % 100) / 100 < fashion + (old ? .15 : 0)) { s.beard = pick(old || year < 1700 ? ["full", "long", "goatee"] : ["full", "goatee", "stubble"], h, 5); if (year > 1850 && year < 1935 && h % 2) s.moustache = pick(["full", "thin", "handlebar"], h, 6); } else if (year > 1850 && year < 1960 && h % 3 === 0) s.moustache = pick(["thin", "full"], h, 6); }
  if (old && (h % 4 === 0)) s.glasses = pick(["round", "square"], h, 7); else if (year > 1990 && h % 5 === 0) s.glasses = "square";
  // clothes and hat by era and job
  const pal = worker ? CLOTH.work : (mil || nurse) ? CLOTH.plain : CLOTH.smart;
  s.clothColor = pick(pal, h, 8);
  if (year < 1700) { s.outfit = "tunic"; s.hat = worker || h % 3 === 0 ? "wool_cap" : "none"; s.trimColor = pick(["#c9b27a", "#b8a47a", "#d8cfa8"], h, 9); if (clergy) { s.outfit = "shawl"; s.hat = "none"; s.hair = "bald"; } }
  else if (year <= 1913) { s.outfit = nurse ? "nurse" : worker ? "coat" : female ? "shawl" : "suit"; s.hat = nurse ? "nurse_veil" : worker ? "flat_cap" : male && !clergy && h % 2 ? "top_hat" : "none"; if (female && !nurse) s.clothColor = pick(["#6a4a50", "#4a4a58", "#5a4a3c"], h, 8); }
  else if (year <= 1960) { s.outfit = nurse ? "nurse" : mil ? "uniform" : worker ? "coat" : female ? "coat" : "suit"; s.hat = nurse ? "nurse_veil" : mil ? "helmet" : worker ? "flat_cap" : female && year > 1918 && year < 1935 ? "cloche" : "none"; if (mil) s.clothColor = pick(["#6b6a48", "#5a6048", "#4a5a50"], h, 8); }
  else if (year <= 2070) { s.outfit = nurse ? "plain" : mil ? "uniform" : "suit"; s.hat = "none"; if (nurse) s.clothColor = pick(["#8fb8c8", "#a8c8b0", "#b8b8d0"], h, 8); }
  else { s.outfit = "jumpsuit"; s.hat = "none"; s.clothColor = pick(["#3a4a58", "#4a4a5a", "#3a5a5a"], h, 8); if (h % 4 === 0) s.eyes = "visor"; }
  s.hatColor = pick(["#4a4038", "#5a5a50", "#3a3a40", "#5a4a3c"], h, 10);
  return s;
}
