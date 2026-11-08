// Decides when each woman texts you first, follows up when you go quiet,
// gives up on you, or swipes right on you later.
import { S, saveMatch, saveWoman } from "./state.js";
import { timeBlock } from "./gen.js";
import * as chat from "./chat.js";
import * as notify from "./notify.js";
import { makeMatch } from "./match.js";

const H = 3600e3;
const working = new Set();

function inQuiet(d) {
  const h = d.getHours();
  const a = S.settings.quietStart, b = S.settings.quietEnd;
  if (a === b) return false;
  return a < b ? h >= a && h < b : h >= a || h < b;
}

function pickTime(w, m, from) {
  const freq = S.settings.textFirst ?? 1;
  if (!freq) return 0;
  // more into you + more outgoing = texts more often
  const rate = (0.25 + w.initiative * 1.4 + m.affection / 55) * freq; // texts per ~20h
  let gap = -Math.log(1 - Math.random()) * (20 * H) / rate;
  gap = Math.max(gap, 35 * 60000);
  let t = from + gap;
  const d = new Date(t);
  for (let i = 0; i < 60 && (inQuiet(d) || timeBlock(w, d) === "asleep"); i++) d.setTime(d.getTime() + 30 * 60000 + Math.random() * 20 * 60000);
  return d.getTime();
}

export async function plan() {
  const now = Date.now();
  // delayed likes: she swiped on you later
  for (const w of S.women.values()) {
    if (w.pendingMatchAt && w.pendingMatchAt <= now && !S.matches.has(w.id)) {
      w.pendingMatchAt = 0; await saveWoman(w);
      const m = await makeMatch(w);
      m.isNew = true; await saveMatch(m);
      notify.showNow({ nid: notify.idFor("match" + w.id), title: "It's a match! 🔥", body: `${w.name} liked you back`, matchId: w.id, at: now, channel: "matches" });
      chat.events.dispatchEvent(new CustomEvent("match", { detail: { id: w.id } }));
      maybeOpener(w, m);
    }
  }
  for (const m of S.matches.values()) {
    if (m.status !== "active" || m.kind === "roulette" || working.has(m.id)) continue;
    const w = S.women.get(m.id); if (!w) continue;
    const userLast = [...m.messages].reverse().find((x) => x.from === "me");
    const herLast = [...m.messages].reverse().find((x) => x.from === "her");
    const unanswered = herLast && (!userLast || herLast.at > userLast.at);
    // still waiting on her own reply / first text
    if (m.outbox.length) continue;
    // she gives up if you keep ignoring her
    if (unanswered && (m.followups || 0) >= 2) {
      const since = now - herLast.at;
      if (since > 24 * H) {
        m.affection = Math.max(0, m.affection - 4); m.followups = 2; m.lastDecay = now;
        if (m.affection < 18 && Math.random() < 0.5) {
          m.status = "unmatched";
          m.messages.push({ id: chat.uid(), from: "sys", text: `${w.name} unmatched you.`, at: now });
        }
        await saveMatch(m);
      }
      continue;
    }
    // her last message is waiting on him: no new topic, but maybe a follow-up later
    if (unanswered && !m.nextFirstText) {
      m.nextFirstText = herLast.at + (3 + Math.random() * 20) * H / (0.5 + w.initiative + m.affection / 60);
      if (inQuiet(new Date(m.nextFirstText))) m.nextFirstText = pickTime(w, m, m.nextFirstText);
      await saveMatch(m);
      continue;
    }
    if (!m.nextFirstText) {
      const last = Math.max(m.lastUserAt || 0, m.lastHerAt || 0, m.matchedAt);
      const t = pickTime(w, m, Math.max(last, now));
      if (!t) continue;
      m.nextFirstText = t;
      m.firstKind = m.willingness >= 7 && m.affection >= 55 && new Date(t).getHours() >= 21 && Math.random() < 0.45 ? "spicy" : "normal";
      await saveMatch(m);
    }
    // write it ahead of time (up to 10h early) so it can arrive even with the app closed
    if (m.nextFirstText > 0 && m.nextFirstText - now < 10 * H) {
      if (m.firstTry && now - m.firstTry < 10 * 60000) continue;
      m.firstTry = now;
      working.add(m.id);
      chat.firstText(m.id, m.firstKind).catch(() => {}).finally(() => working.delete(m.id));
      return; // one at a time — the phone only has one brain
    }
  }
}

// a new match may message you first
export function maybeOpener(w, m) {
  if (Math.random() < 0.3 + w.initiative * 0.5) {
    m.nextFirstText = Date.now() + (2 + Math.random() * 80) * 60000;
    m.firstKind = "normal";
    saveMatch(m);
  }
}
