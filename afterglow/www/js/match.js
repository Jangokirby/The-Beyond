// The "algorithm": who shows up in your deck, who likes you back, and how
// your swipes teach it your type.
import { S, saveWoman, saveMeta, saveMatch } from "./state.js";
import { generateWoman, userTags } from "./gen.js";

// How much she'd be into the player, 0..1 (before her pickiness).
export function attraction(w) {
  const tags = userTags(S.profile);
  let score = 0;
  for (const t of tags) score += w.likes[t] || 0;
  // shared interests make for better chemistry
  const hob = (S.profile.hobbies || "").toLowerCase();
  for (const i of w.interests) {
    const word = i.toLowerCase().split(/\s+/).find((x) => x.length > 4);
    if (word && hob.includes(word.slice(0, 5))) score += 1.2;
  }
  // age gap she'd accept
  const gap = Math.abs((S.profile.age || 30) - w.age);
  score -= Math.max(0, gap - (w.age < 25 ? 6 : 10)) * 0.35;
  const lf = S.profile.lookingFor;
  if (lf && lf !== "open") {
    const compatible = { casual: ["casual", "fwb", "curious", "attention"], dating: ["dating", "curious", "fwb"], friends: ["friends", "attention", "curious"] }[lf] || [];
    score += compatible.includes(w.goal) ? 1 : -1.2;
  }
  return 1 / (1 + Math.exp(-(score - 2.5) / 1.6));
}

// How much the player tends to like this kind of profile, -1..1.
export function playerTaste(w) {
  let s = 0, n = 0;
  for (const [k, v] of Object.entries(w.attr)) { s += S.bias[k + ":" + v] || 0; n++; }
  return Math.tanh(s / Math.max(1, n));
}

export function compatibility(w) {
  return Math.round(100 * (0.65 * attraction(w) + 0.35 * (0.5 + playerTaste(w) / 2)));
}

function recentNames() {
  return [...S.women.values()].sort((a, b) => b.createdAt - a.createdAt).slice(0, 30).map((w) => w.name);
}

// Keep the deck topped up; ordering mixes "top picks" with exploration.
export async function refillDeck(target = 10) {
  let made = 0;
  while (S.deck.length < target) {
    const w = generateWoman({ prefs: S.settings.prefs, bias: S.bias, mode: "dating", recentNames: recentNames() });
    w.attraction = attraction(w);
    // some of them have already seen you and swiped right
    w.likedYou = Math.random() < w.attraction * (1 - w.pickiness) * 0.9;
    await saveWoman(w);
    if (w.likedYou && Math.random() < 0.35) S.likesYou.push(w.id);
    else S.deck.push(w.id);
    made++;
  }
  if (made) {
    const rank = (id) => { const w = S.women.get(id); return 0.55 * attraction(w) + 0.45 * (0.5 + playerTaste(w) / 2) + Math.random() * 0.25; };
    const top = S.deck.slice(0, 1), rest = S.deck.slice(1);
    rest.sort((a, b) => rank(b) - rank(a));
    S.deck = top.concat(rest);
    await saveMeta();
  }
}

// Swiping teaches the algorithm your type.
export function learn(w, dir) {
  const d = dir === "right" ? 1 : dir === "super" ? 1.6 : -0.6;
  for (const [k, v] of Object.entries(w.attr)) {
    const key = k + ":" + v;
    S.bias[key] = Math.max(-3, Math.min(3, (S.bias[key] || 0) * 0.97 + d * 0.25));
  }
  S.swipes.total++;
  if (d > 0) S.swipes.right++; else S.swipes.left++;
}

// Result of swiping right: "match" now, "later" (she'll see you later), or "no".
export function resolveLike(w, superLike) {
  if (w.likedYou) return { result: "match" };
  const p = w.attraction * (1 - w.pickiness * 0.8) + (superLike ? 0.25 : 0);
  if (Math.random() < p) {
    // she hasn't opened the app yet; she'll swipe on you later
    const mins = 5 + Math.random() * (Math.random() < 0.5 ? 60 : 600);
    return { result: "later", at: Date.now() + mins * 60000 };
  }
  return { result: "no" };
}

export function newMatch(w, extra = {}) {
  const m = {
    id: w.id,
    matchedAt: Date.now(),
    kind: w.mode === "roulette" ? "roulette" : "dating",
    status: "active", // active | left | unmatched
    affection: Math.round(10 + w.attraction * 25), // 0..100, slow-moving
    willingness: w.willingness, // 1..10
    patience: w.patience, // 1..10
    messages: [],
    memories: [],
    outbox: [], // her messages waiting to be delivered: {at, text, photo, kind}
    unread: 0,
    lastUserAt: 0,
    lastHerAt: 0,
    nextFirstText: 0,
    photoCount: 0,
    userMsgCount: 0,
    pinned: false,
    ...extra,
  };
  return m;
}

export async function makeMatch(w, extra) {
  const m = newMatch(w, extra);
  S.likesYou = S.likesYou.filter((id) => id !== w.id);
  S.deck = S.deck.filter((id) => id !== w.id);
  await saveMatch(m);
  await saveMeta();
  return m;
}
