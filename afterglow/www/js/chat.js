// The brain behind each woman. JavaScript decides WHAT she does (reply, go
// cold, leave, send or refuse a photo, text first) from her locked sheet and
// her Willingness / Patience / Affection; the local model only writes HOW she
// says it. That keeps small phone models consistent.
import { S, saveMatch, saveWoman } from "./state.js";
import { GOALS, dailyState, timeBlock, lingerieSet } from "./gen.js";
import * as llm from "./llm.js";
import * as img from "./img.js";
import * as notify from "./notify.js";

const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-3);
export const events = new EventTarget();
const emit = (type, detail) => events.dispatchEvent(new CustomEvent(type, { detail }));

// ---------- reading the player's message ----------
const RE = {
  photo: /\b(pic|pics|photo|photos|selfie|selfies|picture|pictures|snap|show me|send (me )?(one|another|more|something)|let me see|can i see|wanna see|want to see|see (you|it|them|more|what))\b/i,
  l5: /\b(pussy|spread|finger(ing)?|touch(ing)? yourself|masturbat\w*|dildo|vibrator|toy|wet for)\b/i,
  l4: /\b(nude|nudes|naked|nothing on|full body|everything off|take it all off|no clothes)\b/i,
  l3: /\b(tits|titties|boobs|boobies|topless|breasts|nipples|top off)\b/i,
  l2: /\b(lingerie|underwear|bra|panties|thong|bikini|ass|butt|booty|bum)\b/i,
  l1: /\b(sexy|hot pic|outfit|cleavage|legs|what you('re| are) wearing|wyw)\b/i,
  sexual: /\b(sex|fuck|fucking|horny|cock|dick|pussy|cum|naked|nude|tits|boobs|ass|suck|lick|bed with|turned on|hard for|wet|kiss you all over|ride|moan|daddy)\b/i,
  rude: /\b(bitch|slut|whore|stupid|ugly|fat|shut up|retard|cunt|dumb|idiot|worthless)\b/i,
  compliment: /\b(beautiful|gorgeous|pretty|cute|stunning|hot|sexy|adorable|lovely|amazing smile|great smile|your eyes|you look)\b/i,
  respect: /\b(no worries|no pressure|that'?s (fine|ok|okay|cool)|totally fine|i respect|sorry|my bad|all good|take your time|whenever you('re| are) ready)\b/i,
  bye: /\b(goodnight|good night|gotta go|talk (to you )?(later|tomorrow)|ttyl|bye|gn)\b/i,
  lowEffort: /^(hey+|hi+|hello|sup|wyd|wbu|hbu|k|ok|okay|lol|lmao|haha|yeah|yes|no|nice|cool|mhm|hm+|same|true)[.!? ]*$/i,
  laugh: /\b(lol|lmao|lmfao|haha\w*|hehe)\b|😂|🤣|😭|💀/i,
};

export function requestedLevel(t) {
  if (RE.l5.test(t)) return 5; if (RE.l4.test(t)) return 4; if (RE.l3.test(t)) return 3;
  if (RE.l2.test(t)) return 2; if (RE.l1.test(t)) return 1; return 0;
}

// Highest photo level she'd send right now (-1 = none).
export function allowedLevel(w, m) {
  const spice = S.settings.spice ?? 1;
  // rapport matters more than raw willingness: you have to build it
  let v = m.willingness * 0.6 + m.affection / 12 + (spice - 1) * 1.5;
  const G = GOALS[w.goal];
  let cap = G.cap;
  if (w.goal === "dating") cap = m.affection >= 70 ? 4 : m.affection >= 50 ? 2 : 1;
  if (w.goal === "fwb" && m.affection < 30) cap = 2;
  if (spice === 0) cap = Math.min(cap, 1);
  const th = [1.5, 5, 7, 8.5, 9.5, 11];
  let lvl = -1;
  for (let i = 0; i < th.length; i++) if (v >= th[i]) lvl = i;
  if (m.patience <= 2) lvl = Math.min(lvl, 0);
  if (m.userMsgCount < 4) lvl = Math.min(lvl, w.goal === "casual" ? 2 : 1);
  return Math.min(lvl, cap);
}

export function stage(m) {
  const a = m.affection;
  if (m.status !== "active") return m.status === "left" ? "Gone" : "Unmatched";
  return a < 20 ? "New match" : a < 35 ? "Getting to know you" : a < 50 ? "Vibing" : a < 65 ? "Flirting" : a < 80 ? "Into you" : "Hooked";
}

function analyze(text, w, m) {
  const t = text.toLowerCase();
  const f = {
    photo: RE.photo.test(t), level: requestedLevel(t), sexual: RE.sexual.test(t), rude: RE.rude.test(t),
    compliment: RE.compliment.test(t), respect: RE.respect.test(t), bye: RE.bye.test(t),
    lowEffort: RE.lowEffort.test(t.trim()), question: /\?|\b(what|how|why|where|which|who|do you|are you|tell me)\b/.test(t),
    interestHit: w.interests.some((i) => i.toLowerCase().split(/\W+/).some((wd) => wd.length > 4 && t.includes(wd))),
    dislikeHit: w.dislikes.some((d) => d.toLowerCase().split(/\W+/).some((wd) => wd.length > 4 && t.includes(wd))),
    long: t.length > 90,
  };
  if (f.level > 0 && /\b(send|show|see|pic|photo|wanna|want|can i)\b/.test(t)) f.photo = true;
  return f;
}

function lastHer(m) { for (let i = m.messages.length - 1; i >= 0; i--) if (m.messages[i].from === "her") return m.messages[i]; return null; }

function applyMood(w, m, f) {
  let dW = 0, dP = 0, dA = 0.6 + w.attraction * 0.8;
  const prev = lastHer(m);
  if (f.question) dW += 0.25;
  if (f.interestHit) { dW += 0.4; dA += 1; }
  if (prev && RE.laugh.test(prev.text || "")) { dW += 0.3; dA += 1; }
  if (f.compliment) { const recentComp = m.compStreak || 0; dW += (m.willingness >= 4 || m.affection >= 30 ? 0.35 : 0.1) / (1 + recentComp); m.compStreak = recentComp + 1; } else m.compStreak = 0;
  if (f.long && !f.sexual) { dW += 0.2; dA += 0.7; }
  if (f.sexual || (f.photo && f.level >= 2)) {
    if (w.goal === "friends") { dP -= 2.2; dA -= 3; }
    else if (m.willingness >= 6 || allowedLevel(w, m) >= 2) { dW += 0.35; dA += 0.5; }
    else { dP -= (6 - m.willingness) * 0.45 + 0.5; dA -= 1.5; }
  }
  if (f.photo && m.lastRefusalAt && Date.now() - m.lastRefusalAt < 30 * 60000) dP -= 1.4; // asking again right after a no
  if (f.rude && !(m.willingness >= 8 && f.sexual)) { dP -= 3; dA -= 6; }
  if (f.dislikeHit) dP -= 0.7;
  if (f.lowEffort && m.userMsgCount > 2) { dP -= 0.4; dA -= 0.3; }
  if (f.respect && m.lastRefusalAt && Date.now() - m.lastRefusalAt < 3 * 3600e3) { dP += 0.9; dW += 0.3; dA += 1.5; m.lastRefusalAt = 0; }
  m.willingness = clamp(m.willingness + dW, 1, 10);
  m.patience = clamp(m.patience + dP, 0, 10);
  m.affection = clamp(m.affection + dA, 0, 100);
}

// ---------- deciding what she does ----------
function decide(w, m, f) {
  const d = { mode: "reply", photo: null };
  if (m.patience <= 0) return { mode: "leave" };
  if (m.patience <= 2.5 || (m.affection < 12 && Math.random() < 0.4)) d.mode = "cold";
  const allowed = allowedLevel(w, m);
  if (f && f.photo) {
    if (allowed >= f.level) d.photo = { level: f.level, asked: true };
    else {
      d.refuse = { asked: f.level, allowed };
      if (allowed >= 0 && allowed >= f.level - 2 && /teases/.test(w.photoStyle) && Math.random() < 0.5) d.photo = { level: allowed, counter: true };
    }
  } else if (allowed >= 0 && d.mode !== "cold") {
    const heat = f && f.sexual ? 1 : 0;
    const p = m.userMsgCount < 3 ? 0 : Math.max(0, (m.willingness - 4.5) / 22) * w.talkative + heat * 0.12 + (m.photoCount === 0 && m.userMsgCount >= 6 ? 0.08 : 0);
    if (Math.random() < p) d.photo = { level: Math.min(allowed, heat ? allowed : Math.min(allowed, 1)), unprompted: true };
  }
  if (f && f.sexual && m.willingness >= 7 && allowed >= 3) d.heated = true;
  if (f && f.bye) d.bye = true;
  return d;
}

// ---------- photos ----------
function photoSpec(w, m, level) {
  const st = w.state;
  const spec = { level, top: st.top, bottom: st.bottom, underwear: st.underwear, location: st.location.replace(/^asleep in bed$/, "in her bed") };
  const poses = level <= 1
    ? ["arm's-length front camera selfie, slight high angle", "mirror selfie holding her phone", "selfie with her chin resting on her hand", "candid selfie, phone held low"]
    : ["mirror selfie in her bedroom mirror", "lying in bed, phone held above her", "over-the-shoulder mirror selfie", "kneeling on her bed, mirror selfie", "close-up selfie from a high angle"];
  spec.pose = poses[(m.photoCount + w.seed) % poses.length];
  spec.expression = level >= 2 ? ["flirty smirk", "biting her lip", "sultry half-lidded look", "playful smile"][m.photoCount % 4] : ["warm smile", "playful grin", "soft smile", "pouty face", "tongue out laughing"][m.photoCount % 5];
  if (level === 1) { spec.pose += ", showing off her outfit"; }
  if (level >= 2) {
    if (/no bra|sports bra|nothing/.test(st.underwear) || !/bra|set|bralette/.test(st.underwear)) spec.underwear = lingerieSet(w);
    if (!/bed|bedroom|bathroom|home|couch|locker/.test(st.location)) spec.location = "her bathroom mirror";
    spec.location = spec.location.replace(/^asleep in bed$/, "in her bed");
  }
  if (level === 3) spec.bottomOnly = /thong|panties|boyshorts/.test(spec.underwear) ? spec.underwear.replace(/^.*?and (matching )?/, "") : "panties";
  return spec;
}

function changeStateForPhoto(w, level, spec) {
  if (level >= 2) {
    w.state.underwear = level >= 4 ? "nude" : level === 3 ? "topless, only " + spec.bottomOnly : spec.underwear;
    w.state.top = level >= 2 ? "none" : w.state.top;
    w.state.bottom = level >= 2 ? "none" : w.state.bottom;
    w.state.location = spec.location;
    w.state.undressedAt = Date.now();
  }
}

function describeLevel(l) { return ["a normal cute selfie", "a flirty selfie showing off her outfit", "a photo in just her underwear", "a topless photo", "a fully nude photo", "an explicit nude photo"][l]; }

export function makePhoto(w, m, level, why) {
  const spec = photoSpec(w, m, level);
  changeStateForPhoto(w, level, spec);
  const prompt = img.photoPrompt(w, spec);
  const key = `${w.id}:p${m.photoCount}:${uid()}`;
  m.photoCount++;
  w.state.lastPhoto = `${describeLevel(level)} — ${spec.pose}, ${spec.expression}`;
  const ph = { key, level, desc: w.state.lastPhoto, prompt };
  if (img.enabled()) img.generate({ key, prompt, seed: w.seed + (S.settings.photoSeedShift ? m.photoCount : 0), kind: "photo" }).catch((e) => emit("imgerror", { msg: e.message }));
  return ph;
}

export function anchorPrompt(w) {
  const st = w.state;
  return img.photoPrompt(w, { level: 0, top: st.top === "none" ? "a fitted t-shirt" : st.top, bottom: st.bottom, location: "a bright room with natural window light", pose: "dating-profile photo, front-facing selfie, head and shoulders, looking at camera", expression: "natural friendly smile" });
}

export function ensureAnchor(w) {
  if (!img.enabled() || w.anchor) return;
  w.anchor = "anchor:" + w.id;
  saveWoman(w);
  img.generate({ key: w.anchor, prompt: anchorPrompt(w), seed: w.seed, kind: "anchor" }).catch((e) => { w.anchor = null; saveWoman(w); emit("imgerror", { msg: e.message }); });
}

// ---------- prompt ----------
function timeWords(d) {
  const h = d.getHours();
  const day = d.toLocaleDateString(undefined, { weekday: "long" });
  const t = d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return `${day}, ${t}` + (h < 5 ? " (very late at night)" : h < 12 ? " (morning)" : h < 17 ? " (afternoon)" : h < 21 ? " (evening)" : " (night)");
}

function moodWords(w, m) {
  const a = m.affection, wi = m.willingness, p = m.patience;
  const parts = [];
  parts.push(a < 20 ? "You barely know him yet and you're deciding if he's worth your time." : a < 35 ? "He seems okay, you're getting to know him." : a < 50 ? "You like talking to him and you're curious about him." : a < 65 ? "You're attracted to him and enjoy flirting with him." : a < 80 ? "You're really into him and look forward to his texts." : "You're hooked on him — you think about him a lot and want him.");
  if (wi >= 8) parts.push("You feel very open and sexually confident with him.");
  else if (wi >= 6) parts.push("You're open to flirting and some spicy talk.");
  else if (wi <= 3) parts.push("You're reserved; keep flirting light and don't get sexual.");
  if (p <= 3) parts.push("He's been annoying you and your patience is thin.");
  return parts.join(" ");
}

function styleLine(w) {
  const iq = w.intelligence;
  const iqDesc = iq <= 3 ? "Simple vocabulary, sometimes misspells words." : iq >= 8 ? "Sharp and articulate, quick wit, knows a lot about her interests." : "Normal everyday vocabulary.";
  return `${w.styleDesc}. ${iqDesc} Example of how you text: "${w.styleSample}"`;
}

export function systemPrompt(w, m, d = {}, when = new Date()) {
  const p = S.profile;
  const G = GOALS[w.goal];
  const st = { ...w.state };
  if (st.block === "asleep" || /asleep/.test(st.location)) st.location = "in bed (you should be sleeping, but you're on your phone)";
  const app = m.kind === "roulette" ? "a random text-chat roulette app (you were paired with him at random a few minutes ago)" : "a dating app called Afterglow (you matched with him)";
  const lines = [
    `You are ${w.name}, a ${w.age}-year-old ${w.ethnicity} woman from ${w.origin}, now living in ${w.city}. You work as a ${w.job}. You're texting a man${p.name ? " named " + p.name : ""} on ${app}. You are a real person, not an AI, and you don't know this is a simulation.`,
    `Personality: ${w.traits.join(", ")}. You love ${w.interests.join(", ")}. Boring or annoying to you: ${w.dislikes.join(", ")}. Your limits: ${w.boundaries.join("; ")}.`,
    `Why you're on the app: ${G.desc}`,
    `Your looks (only mention naturally): ${w.hair.color} ${w.hair.texture} hair, ${w.eyes.color} eyes, ${w.bodyDesc}, ${w.height}${w.marks.length ? ", " + w.marks.join(", ") : ""}.`,
    `Right now it's ${timeWords(when)}. You are ${st.location}, wearing ${st.top === "none" ? "no top" : st.top}${st.bottom && !/nothing/.test(st.bottom) ? (st.bottom === "none" ? ", no bottoms" : ", " + st.bottom) : ""}; underneath: ${st.underwear}.${st.lastPhoto && st.lastPhoto !== "none yet" ? ` The last photo you sent him was ${st.lastPhoto}.` : ""}`,
    `How you text: ${styleLine(w)}`,
    `About him (you've seen his profile; never ask him to describe himself): ${p.age ? p.age + ", " : ""}${p.height}, ${p.build} build, ${p.face}, ${p.hair}, ${p.eyes} eyes. Work: ${p.jobs}. Hobbies: ${p.hobbies}.${p.bio ? " His bio: " + p.bio : ""}`,
  ];
  if (m.memories && m.memories.length) lines.push(`Things you remember from talking to him: ${m.memories.join("; ")}.`);
  lines.push(`How you feel: ${moodWords(w, m)}`);
  const dir = directive(w, m, d);
  if (dir) lines.push(`For this message: ${dir}`);
  lines.push(`Rules: write ONLY your next text message as ${w.name} would type it on her phone — 1 to 3 short lines, normal texting length. No narration, no *actions*, no quotation marks, no name labels, no options or menus. Never write his side of the chat.${S.settings.spice === 0 ? " Keep it PG-13." : " This is an adults-only app: if the mood is right you can be explicit and dirty."}`);
  return lines.join("\n");
}

function directive(w, m, d) {
  const out = [];
  if (d.mode === "leave") out.push(m.kind === "roulette" ? "You're done with this chat. Send a short goodbye (or a blunt 'next') and leave." : "You're done with him. Send one short final message telling him you're not feeling it, then you unmatch.");
  else if (d.mode === "cold") out.push("You're not very into this right now. Give a short, low-effort reply.");
  if (d.first) out.push(d.first);
  if (d.refuse && !d.photo) out.push(d.refuse.allowed < 0 ? `He asked for a photo. You're not sending him any pics right now — say no ${w.traits.includes("blunt") ? "bluntly" : "in your own way"}.` : `He asked for ${describeLevel(d.refuse.asked).replace("a ", "a ")}. You're NOT comfortable sending that yet — turn him down ${/teasing|flirty|bratty|playful/.test(w.traits.join(" ")) ? "teasingly, make him earn it" : "politely but firmly"}.`);
  if (d.photo) {
    const what = describeLevel(d.photo.level);
    if (d.photo.counter) out.push(`He asked for more than you'll give, so instead you send him ${what}. Tease him about it.`);
    else if (d.photo.unprompted) out.push(`You decide to send him ${what} without being asked. ${captionStyle(w)}`);
    else out.push(`He asked for a photo and you're sending him ${what}. ${captionStyle(w)}`);
    if (d.photo.level >= 2) out.push(`(You're now in: ${w.state.underwear}.)`);
  }
  if (d.heated) out.push("Things are heating up and you're turned on; flirt back hard and be as explicit as you want.");
  if (d.bye) out.push("He's saying goodbye for now; reply naturally.");
  return out.join(" ");
}

function captionStyle(w) {
  if (/silently/.test(w.photoStyle)) return "Write almost nothing — an emoji or a couple of words.";
  if (/teases/.test(w.photoStyle)) return "Tease him a little about it.";
  if (/then comments/.test(w.photoStyle)) return "Comment on the photo after sending it.";
  return "Add a short caption.";
}

function history(m, n = 16) {
  const msgs = [{ role: "user", content: m.kind === "roulette" ? "(chat connected)" : "(you two matched)" }];
  for (const x of m.messages.slice(-n)) {
    if (x.from === "sys") continue;
    let c = x.text || "";
    if (x.photo) c = (c ? c + "\n" : "") + `[sent a photo: ${x.photo.desc}]`;
    if (!c) continue;
    const role = x.from === "her" ? "assistant" : "user";
    if (msgs.length && msgs[msgs.length - 1].role === role) msgs[msgs.length - 1].content += "\n" + c;
    else msgs.push({ role, content: c });
  }
  return msgs;
}

// clean up whatever the model wrote into real text bubbles
export function clean(text, w) {
  let t = (text || "").replace(/<think>[\s\S]*?<\/think>/g, "").replace(/<\/?[a-z_|]+>/gi, "");
  const p = S.profile.name || "User";
  // cut off if the model starts writing his side
  const cut = new RegExp(`\\n\\s*(${escapeRe(p)}|User|Him|Me|You)\\s*:`, "i");
  const mm = cut.exec(t); if (mm) t = t.slice(0, mm.index);
  t = t.replace(new RegExp(`^\\s*(${escapeRe(w.name)}|Her|Assistant)\\s*:\\s*`, "gim"), "");
  t = t.replace(/\*[^*\n]{1,120}\*/g, " ").replace(/\((?:sends|she|laughs|smiles|winks|giggles)[^)]*\)/gi, " ");
  t = t.replace(/\[sent a photo:[^\]]*\]/gi, "").replace(/\[[^\]]{0,60}\]/g, "");
  t = t.replace(/^["“]+|["”]+$/gm, "");
  let lines = t.split(/\n+/).map((l) => l.replace(/\s{2,}/g, " ").trim()).filter(Boolean);
  // small models sometimes repeat themselves
  lines = lines.filter((l, i) => lines.indexOf(l) === i);
  if (lines.length > 4) lines = lines.slice(0, 4);
  // merge tiny fragments so it's not a wall of one-word bubbles
  const out = [];
  for (const l of lines) { if (out.length && (out[out.length - 1].length < 12 || l.length < 6) && out.length >= 2) out[out.length - 1] += " " + l; else out.push(l); }
  return out;
}
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ---------- timing ----------
function nextWake(w, from) {
  const d = new Date(from);
  for (let i = 0; i < 48; i++) { d.setTime(d.getTime() + 30 * 60000); if (timeBlock(w, d) !== "asleep") return d.getTime() + Math.random() * 40 * 60000; }
  return from + 8 * 3600e3;
}

function replyDelay(w, m, d, chars) {
  const mode = S.settings.replySpeed;
  if (mode === "instant") return 400;
  const typing = Math.min(25000, 1500 + chars * (60 + Math.random() * 80));
  if (mode === "quick") return 1000 + Math.random() * 2000 + typing * 0.25;
  const now = Date.now();
  const block = timeBlock(w, new Date(now));
  if (block === "asleep" && m.affection < 85 && m.kind !== "roulette" && !(m.lastHerAt && now - m.lastHerAt < 20 * 60000)) return nextWake(w, now) - now + typing;
  const interest = (m.affection / 100 + m.willingness / 10) / 2;
  const inConvo = m.lastHerAt && now - m.lastHerAt < 20 * 60000;
  let read;
  if (inConvo) read = (3 + Math.random() * 25) * 1000 * (1.6 - interest);
  else read = -Math.log(1 - Math.random()) * (block === "work" ? 35 : 7) * 60000 * (1.5 - interest);
  if (d.mode === "cold") read *= 2.5;
  if (m.kind === "roulette") read = Math.min(read, 40000);
  return read + typing;
}

// ---------- main flows ----------
const pending = new Map(); // matchId -> timer for debouncing double texts
const gen = new Map(); // matchId -> counter, so a stale reply is thrown away

export function userSends(m, text, photo) {
  const now = Date.now();
  // anything she was already typing gets sent; the rest she reconsiders
  m.outbox.sort((a, b) => a.at - b.at);
  for (const o of m.outbox) if (o.kind === "reply" && o.typingFrom <= now && (o.text || o.photo)) {
    notify.cancel(o.nid);
    m.messages.push({ id: o.id, from: "her", text: o.text, photo: o.photo, at: now - 1 });
    m.lastHerAt = now - 1;
    o.done = true;
  }
  dropOutbox(m, (o) => o.done || o.kind !== "leave");
  for (const x of m.messages) if (x.from === "me" && x.readAt && x.readAt > now && m.messages.some((y) => y.from === "her" && y.at >= x.at)) x.status = "read";
  const msg = { id: uid(), from: "me", text, at: now, status: "sent" };
  if (photo) msg.photo = photo;
  m.messages.push(msg);
  m.lastUserAt = now;
  m.userMsgCount++;
  gen.set(m.id, (gen.get(m.id) || 0) + 1);
  m.nextFirstText = 0;
  m.followups = 0;
  saveMatch(m);
  emit("update", { id: m.id });
  clearTimeout(pending.get(m.id));
  pending.set(m.id, setTimeout(() => respond(m.id).catch((e) => failed(m, e)), S.settings.replySpeed === "instant" ? 200 : 2500));
}

function dropOutbox(m, pred) {
  const keep = [];
  for (const o of m.outbox) { if (pred(o)) notify.cancel(o.nid); else keep.push(o); }
  m.outbox = keep;
}

function failed(m, e) {
  m.messages.push({ id: uid(), from: "sys", text: "Couldn't reach the AI: " + e.message + " — check Settings → AI texting.", at: Date.now(), retry: true });
  saveMatch(m);
  emit("update", { id: m.id });
}

export async function respond(id) {
  const m = S.matches.get(id); if (!m || m.status !== "active") return;
  const w = S.women.get(id);
  const myGen = gen.get(id) || 0;
  refreshState(w);
  const userMsgs = []; for (let i = m.messages.length - 1; i >= 0 && m.messages[i].from === "me"; i--) userMsgs.unshift(m.messages[i]);
  const text = userMsgs.map((x) => x.text).join("\n");
  const f = analyze(text, w, m);
  applyMood(w, m, f);
  const d = decide(w, m, f);
  if (d.photo) d.photoObj = makePhoto(w, m, d.photo.level);
  if (d.refuse && !d.photo) m.lastRefusalAt = Date.now();
  emit("thinking", { id, on: true });
  let raw;
  try { raw = await llm.chat([{ role: "system", content: systemPrompt(w, m, d) }, ...history(m)]); }
  finally { emit("thinking", { id, on: false }); }
  if (myGen !== (gen.get(id) || 0)) return; // he sent more while she was thinking; a newer reply is coming
  let bubbles = clean(raw, w);
  if (!bubbles.length) bubbles = [d.photo ? "" : d.mode === "cold" ? "k" : "haha"];
  if (d.mode === "cold" && bubbles.length > 1) bubbles = bubbles.slice(0, 1);
  queueBubbles(w, m, bubbles, d, "reply");
  await saveWoman(w);
  await saveMatch(m);
  if (m.userMsgCount && m.userMsgCount % 14 === 0) remember(w, m).catch(() => {});
}

function queueBubbles(w, m, bubbles, d, kind, baseAt) {
  let at = baseAt || Date.now() + replyDelay(w, m, d, bubbles.join(" ").length);
  const readAt = at - Math.min(20000, 1500 + bubbles.join(" ").length * 80);
  if (kind === "reply") for (const x of m.messages) if (x.from === "me" && x.status !== "read") x.readAt = Math.max(Date.now() + 500, readAt);
  const tease = d.photo && /teases/.test(w.photoStyle) && !d.photo.counter;
  const photoFirst = d.photo && /silently|then comments/.test(w.photoStyle);
  const items = bubbles.filter(Boolean).map((t) => ({ text: t }));
  if (d.photoObj) {
    const pItem = { text: "", photo: d.photoObj };
    if (photoFirst) items.unshift(pItem);
    else if (tease) items.push(pItem);
    else { if (items.length) items[items.length - 1].photo = d.photoObj; else items.push(pItem); }
  }
  items.forEach((it, i) => {
    if (i > 0) at += 1200 + (it.text || "").length * 70 + Math.random() * 2500 + (it.photo && tease ? 15000 + Math.random() * 30000 : 0);
    const o = { id: uid(), at, text: it.text, photo: it.photo || null, kind: d.mode === "leave" && i === items.length - 1 ? "leave" : kind, typingFrom: at - Math.min(12000, 1200 + (it.text || "").length * 90) };
    o.nid = notify.idFor(o.id);
    m.outbox.push(o);
    notify.schedule({ nid: o.nid, at: o.at, title: w.name, body: o.photo ? (o.text ? o.text + " 📷" : "📷 Sent a photo") : o.text, matchId: m.id });
  });
  if (d.mode === "leave" && !items.length) m.outbox.push({ id: uid(), at, kind: "leave", text: "" });
  emit("update", { id: m.id });
}

// she texts first
export async function firstText(id, kind) {
  const m = S.matches.get(id); if (!m || m.status !== "active") return;
  const w = S.women.get(id);
  const when = new Date(m.nextFirstText || Date.now());
  const saved = w.state; w.state = dailyState(w, when); w.state.lastPhoto = saved.lastPhoto;
  const block = w.state.block;
  const userLast = m.messages.filter((x) => x.from === "me").pop();
  const herLast = lastHer(m);
  const unanswered = herLast && (!userLast || herLast.at > userLast.at);
  let first;
  if (!m.messages.some((x) => x.from !== "sys")) first = m.kind === "roulette" ? "You just got connected with him. Send the first message, like a real opener on a random chat app." : `You just matched with him and you're messaging first. Open with something about his profile (his hobbies or job) in your own style.`;
  else if (unanswered && (m.followups || 0) >= 1) first = m.affection > 55 ? "He hasn't answered your last texts in a while. You're a bit hurt — double text him, and let it show." : "He left you on read. Send a short, slightly annoyed message (or a dry 'ok then').";
  else if (unanswered) first = "He hasn't replied to your last message yet. Send a casual follow-up to get his attention.";
  else if (kind === "spicy") first = `It's ${timeWords(when)} and you're ${w.state.location}, thinking about him in a naughty way. Text him first and make it flirty.`;
  else first = `You're texting him first, out of nowhere. It's ${timeWords(when)} and you're ${w.state.location}. ${{ morning: "Say good morning in your own way or tell him what you're up to.", work: "You're bored at work/class and thinking of him.", gym: "You just finished working out.", evening: "Tell him something that happened today, or ask what he's doing.", late: "You can't sleep / you're winding down in bed and he's on your mind.", night: "You're out and a little tipsy and you thought of him." }[block] || "Ask what he's up to."} You can reference something you two talked about.`;
  const d = { mode: "reply", first };
  const allowed = allowedLevel(w, m);
  if ((kind === "spicy" || (block === "late" && Math.random() < 0.3)) && allowed >= 1 && !unanswered) d.photo = { level: Math.min(allowed, kind === "spicy" ? 3 : 1), unprompted: true };
  else if (!unanswered && allowed >= 0 && Math.random() < 0.12 * w.talkative) d.photo = { level: 0, unprompted: true };
  if (d.photo) d.photoObj = makePhoto(w, m, d.photo.level);
  const startedAt = Date.now();
  const h = history(m, 12);
  const note = `[${timeWords(when)} — you text him]`;
  if (h[h.length - 1].role === "user") h[h.length - 1].content += "\n" + note; else h.push({ role: "user", content: note });
  const raw = await llm.chat([{ role: "system", content: systemPrompt(w, m, d, when) }, ...h]);
  if (m.lastUserAt > startedAt || m.status !== "active") return; // he texted meanwhile
  let bubbles = clean(raw, w);
  if (!bubbles.length && !d.photoObj) { m.nextFirstText = 0; await saveMatch(m); return; }
  if (unanswered) m.followups = (m.followups || 0) + 1;
  queueBubbles(w, m, bubbles.slice(0, 3), d, "first", Math.max(Date.now() + 1500, when.getTime()));
  m.nextFirstText = -1; // planned and queued
  await saveWoman(w); await saveMatch(m);
}

// called often: delivers due messages, marks things read
export async function tick(activeChatId) {
  const now = Date.now();
  const delivered = [];
  for (const m of S.matches.values()) {
    let changed = false;
    for (const x of m.messages) if (x.from === "me" && x.status !== "read" && x.readAt && x.readAt <= now) { x.status = "read"; changed = true; }
    if (m.outbox.length) {
      m.outbox.sort((a, b) => a.at - b.at);
      while (m.outbox.length && m.outbox[0].at <= now) {
        const o = m.outbox.shift();
        if (o.text || o.photo) {
          m.messages.push({ id: o.id, from: "her", text: o.text, photo: o.photo, at: o.at });
          m.lastHerAt = o.at;
          if (activeChatId !== m.id || document.hidden) m.unread++;
          delivered.push({ m, o });
        }
        if (o.kind === "leave") {
          m.status = m.kind === "roulette" ? "left" : "unmatched";
          m.messages.push({ id: uid(), from: "sys", text: m.kind === "roulette" ? `${S.women.get(m.id).name} left the chat.` : `${S.women.get(m.id).name} unmatched you.`, at: o.at + 1 });
          dropOutbox(m, () => true);
        }
        if (o.kind === "first") m.nextFirstText = 0;
        changed = true;
      }
    }
    // patience slowly comes back
    if (m.status === "active" && now - (m.patienceTick || 0) > 3600e3) {
      const w = S.women.get(m.id);
      if (w && m.patience < w.patience) { m.patience = Math.min(w.patience, m.patience + (now - (m.patienceTick || now)) / (6 * 3600e3)); changed = true; }
      m.patienceTick = now;
    }
    if (changed) { await saveMatch(m); emit("update", { id: m.id }); }
  }
  for (const { m, o } of delivered) {
    if (activeChatId === m.id && !document.hidden) notify.cancel(o.nid);
    else notify.showNow({ nid: o.nid, title: S.women.get(m.id).name, body: o.photo ? (o.text || "📷 Sent a photo") : o.text, matchId: m.id, at: o.at });
  }
  return delivered.length;
}

export function typing(m) {
  const now = Date.now();
  return m.outbox.some((o) => o.typingFrom <= now && o.at > now && (o.text || o.photo));
}

export function refreshState(w) {
  const now = new Date();
  const st = w.state || {};
  const block = timeBlock(w, now);
  const keepUndressed = st.undressedAt && Date.now() - st.undressedAt < 90 * 60000;
  if ((st.block !== block || Date.now() - (st.rolledAt || 0) > 6 * 3600e3) && !keepUndressed) {
    const lp = st.lastPhoto;
    w.state = dailyState(w, now);
    w.state.lastPhoto = lp || "none yet";
  }
}

async function remember(w, m) {
  const convo = m.messages.slice(-30).filter((x) => x.text).map((x) => (x.from === "me" ? (S.profile.name || "Him") : w.name) + ": " + x.text).join("\n");
  const raw = await llm.chat([
    { role: "system", content: `Read this text conversation between ${w.name} and ${S.profile.name || "Him"}. List up to 4 short facts ${w.name} learned about him, or plans they made. One per line, each starting with "- ". Nothing else.` },
    { role: "user", content: convo },
  ], { max_tokens: 120, temperature: 0.3, stop: [] });
  const facts = raw.split("\n").map((l) => l.replace(/^[-*•\d.\s]+/, "").trim()).filter((l) => l.length > 6 && l.length < 140).slice(0, 4);
  m.memories = [...(m.memories || []), ...facts].slice(-10);
  await saveMatch(m);
}

export function retry(m) {
  m.messages = m.messages.filter((x) => !x.retry);
  saveMatch(m);
  respond(m.id).catch((e) => failed(m, e));
}

export { uid };
