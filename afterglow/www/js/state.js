// App-wide state, loaded from IndexedDB at start.
import * as db from "./store.js";

export const DEFAULT_PROFILE = {
  name: "",
  age: 30,
  eyes: "grey",
  build: "stocky",
  height: "5'9\"",
  face: "handsome",
  hair: "short brown hair",
  jobs: "farmer, programmer, project manager",
  hobbies: "sword fighting, gaming, writing (wrote an eldritch horror roleplaying game), working out",
  bio: "Ex-farmer turned programmer. I swing swords for fun and write horror games about things that shouldn't exist.",
  lookingFor: "open",
  photo: null,
};

export const DEFAULT_SETTINGS = {
  adultConfirmed: false,
  llmUrl: "http://127.0.0.1:8080/v1",
  llmKey: "local",
  llmModel: "local",
  maxTokens: 160,
  temperature: 0.9,
  llmTimeout: 180,
  imgBackend: "none",
  imgUrl: "http://127.0.0.1:7860",
  imgSteps: 24,
  imgCfg: 6,
  imgSize: "512x768",
  imgSampler: "DPM++ 2M",
  imgModel: "",
  imgPrefix: "",
  imgNegative: "",
  comfyWorkflow: "",
  autoProfilePhotos: true,
  replySpeed: "realistic", // realistic | quick | instant
  notifications: true,
  quietStart: 1, quietEnd: 8, // she won't text first between these hours (your time)
  textFirst: 1, // 0 = never, 0.5 = rarely, 1 = normal, 2 = a lot
  spice: 1, // 0 = keep it PG-13, 1 = normal, 2 = spicier
  prefs: { ageMin: 18, ageMax: 40, bodyTypes: ["petite", "slim", "athletic", "hourglass", "fit", "leggy"], ethnicities: [], goals: null },
};

export const S = {
  settings: structuredClone(DEFAULT_SETTINGS),
  profile: structuredClone(DEFAULT_PROFILE),
  bias: {}, // learned from swipes: "attr:value" -> score
  swipes: { right: 0, left: 0, total: 0 },
  women: new Map(),
  matches: new Map(),
  deck: [], // woman ids waiting to be swiped
  likesYou: [], // woman ids who liked you first
  roulette: null, // current roulette match id
};

export async function load() {
  const [settings, profile, bias, swipes, deck, likesYou] = await Promise.all(["settings", "profile", "bias", "swipes", "deck", "likesYou"].map((k) => db.get("kv", k)));
  if (settings) S.settings = { ...structuredClone(DEFAULT_SETTINGS), ...settings, prefs: { ...DEFAULT_SETTINGS.prefs, ...(settings.prefs || {}) } };
  if (profile) S.profile = { ...structuredClone(DEFAULT_PROFILE), ...profile };
  if (bias) S.bias = bias;
  if (swipes) S.swipes = swipes;
  if (deck) S.deck = deck;
  if (likesYou) S.likesYou = likesYou;
  for (const w of await db.all("women")) S.women.set(w.id, w);
  for (const m of await db.all("matches")) S.matches.set(m.id, m);
  S.deck = S.deck.filter((id) => S.women.has(id));
  S.likesYou = S.likesYou.filter((id) => S.women.has(id) && !S.matches.has(id));
}

export const saveSettings = () => db.put("kv", "settings", S.settings);
export const saveProfile = () => db.put("kv", "profile", S.profile);
export const saveMeta = () => Promise.all([db.put("kv", "bias", S.bias), db.put("kv", "swipes", S.swipes), db.put("kv", "deck", S.deck), db.put("kv", "likesYou", S.likesYou)]);
export const saveWoman = (w) => { S.women.set(w.id, w); return db.put("women", w.id, w); };
export const saveMatch = (m) => { S.matches.set(m.id, m); return db.put("matches", m.id, m); };
export async function forgetWoman(id) {
  S.women.delete(id); S.matches.delete(id);
  await db.del("women", id); await db.del("matches", id);
}

export async function exportAll() {
  return { v: 1, settings: S.settings, profile: S.profile, bias: S.bias, swipes: S.swipes, women: [...S.women.values()], matches: [...S.matches.values()] };
}
export async function importAll(data) {
  if (!data || data.v !== 1) throw new Error("Not an Afterglow backup");
  await db.clear("women"); await db.clear("matches");
  S.women.clear(); S.matches.clear();
  S.settings = { ...DEFAULT_SETTINGS, ...data.settings }; S.profile = { ...DEFAULT_PROFILE, ...data.profile };
  S.bias = data.bias || {}; S.swipes = data.swipes || S.swipes; S.deck = []; S.likesYou = [];
  for (const w of data.women || []) await saveWoman(w);
  for (const m of data.matches || []) await saveMatch(m);
  await saveSettings(); await saveProfile(); await saveMeta();
}
export async function wipe() {
  for (const s of ["kv", "women", "matches", "images"]) await db.clear(s);
}
