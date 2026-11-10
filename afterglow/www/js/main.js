import { S, load, saveSettings, saveProfile, saveMeta, saveWoman, saveMatch, forgetWoman, exportAll, importAll, wipe, DEFAULT_SETTINGS } from "./state.js";
import { generateWoman, GOALS, BODY_TYPES, ETHNICITIES } from "./gen.js";
import * as match from "./match.js";
import * as chat from "./chat.js";
import * as planner from "./planner.js";
import * as notify from "./notify.js";
import * as llm from "./llm.js";
import * as img from "./img.js";
import { portraitURL } from "./avatar.js";

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const view = $("#view"), top = $("#top");
let tab = "discover", activeChat = null;

// ---------- images ----------
function face(w) { return `<img class="hyd" data-key="${esc(w.anchor || "")}" src="${portraitURL(w)}" alt="">`; }
function faceAv(w, cls = "av") { return `<img class="${cls} hyd" data-key="${esc(w.anchor || "")}" src="${portraitURL(w)}" alt="">`; }
async function hydrate(root = document) {
  for (const el of $$("img.hyd[data-key]", root)) {
    const k = el.dataset.key; if (!k) continue;
    const u = await img.url(k); if (u && el.src !== u) { el.src = u; const g = el.closest(".card")?.querySelector(".gen"); if (g) g.style.display = "none"; }
  }
  for (const el of $$(".ph[data-key]", root)) {
    const u = await img.url(el.dataset.key);
    if (u) { const i = document.createElement("img"); i.src = u; i.dataset.key = el.dataset.key; i.className = "pimg"; el.replaceWith(i); }
  }
}
img.onImage(() => hydrate());
chat.events.addEventListener("imgerror", (e) => toast("Image generator", e.detail.msg));

// ---------- toast ----------
let toastT;
function toast(title, body, w, onClick) {
  const t = $("#toast");
  t.innerHTML = `${w ? faceAv(w, "") : ""}<div><div class="tt">${esc(title)}</div><div class="tb">${esc(body || "")}</div></div>`;
  t.classList.add("on"); hydrate(t);
  t.onclick = () => { t.classList.remove("on"); onClick && onClick(); };
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("on"), 3500);
}

// ---------- tabs ----------
$$("#tabs button").forEach((b) => b.onclick = () => go(b.dataset.tab));
function go(t) {
  tab = t; activeChat = null; document.body.classList.remove("inchat");
  $$("#tabs button").forEach((b) => b.classList.toggle("on", b.dataset.tab === t));
  render();
}
function render() {
  ({ discover, likes, chats, roulette, me }[tab] || discover)();
  badges();
}
function badges() {
  const unread = [...S.matches.values()].filter((m) => m.unread > 0 && m.status !== "left" && (m.kind === "dating" || S.roulette === m.id)).length;
  const bc = $("#b-chats"); bc.textContent = unread; bc.classList.toggle("on", unread > 0);
  const bl = $("#b-likes"); bl.textContent = S.likesYou.length; bl.classList.toggle("on", S.likesYou.length > 0);
}
function header(html) { top.innerHTML = html; }
const logo = `<h1><b>afterglow</b></h1>`;

// ---------- discover ----------
async function discover() {
  header(`${logo}<button class="ic" id="prefs" title="Who you see">⚙︎</button>`);
  $("#prefs").onclick = () => { go("me"); setTimeout(() => $("#sec-prefs")?.scrollIntoView(), 50); };
  if (S.deck.length < 3) { view.innerHTML = `<div class="empty"><div class="big">🔥</div>Finding people near you…</div>`; await match.refillDeck(); if (tab !== "discover") return; }
  const ids = S.deck.slice(0, 2);
  // pre-make profile photos for the next few cards
  if (S.settings.autoProfilePhotos) S.deck.slice(0, 4).forEach((id) => chat.ensureAnchor(S.women.get(id)));
  if (!ids.length) { view.innerHTML = `<div class="empty"><div class="big">🌙</div>No one new right now.</div>`; return; }
  view.innerHTML = `<div class="deck">${ids.slice().reverse().map((id) => cardHTML(S.women.get(id))).join("")}</div>
  <div class="actions"><button class="no" id="bn">✕</button><button class="sup" id="bs">★</button><button class="yes" id="by">♥</button></div>`;
  hydrate(view);
  const cards = $$(".card", view); const card = cards[cards.length - 1];
  dragify(card);
  $("#bn").onclick = () => fling(card, "left");
  $("#by").onclick = () => fling(card, "right");
  $("#bs").onclick = () => fling(card, "super");
}

function cardHTML(w) {
  const comp = match.compatibility(w);
  const chips = w.interests.slice(0, 3).map((i) => `<span class="chip">${esc(i)}</span>`).join("");
  return `<div class="card" data-id="${w.id}">
    <div class="ph">${face(w)}</div>
    ${!w.anchor && img.enabled() ? `<span class="gen">photo coming…</span>` : ""}
    <div class="stamp like">LIKE</div><div class="stamp nope">NOPE</div><div class="stamp sup">SUPER</div>
    <div class="shade"></div>
    <div class="info">
      <h2>${esc(w.name)} <small>${w.age}</small></h2>
      <div class="sub">${esc(w.job.split(" (")[0])} · ${w.distance} mi away</div>
      <div class="chips">${comp >= 72 ? `<span class="chip hot">Top pick · ${comp}%</span>` : ""}<span class="chip">${esc(GOALS[w.goal].label)}</span>${chips}</div>
      <div class="bio">${esc(w.bio)}</div>
    </div>
    <button class="more">i</button>
  </div>`;
}

function dragify(card) {
  if (!card) return;
  let sx = 0, sy = 0, dx = 0, dy = 0, down = false, moved = false;
  const like = $(".stamp.like", card), nope = $(".stamp.nope", card), sup = $(".stamp.sup", card);
  card.addEventListener("pointerdown", (e) => { down = true; moved = false; sx = e.clientX; sy = e.clientY; card.setPointerCapture(e.pointerId); card.style.transition = "none"; });
  card.addEventListener("pointermove", (e) => {
    if (!down) return; dx = e.clientX - sx; dy = e.clientY - sy; if (Math.abs(dx) + Math.abs(dy) > 6) moved = true;
    card.style.transform = `translate(${dx}px,${dy}px) rotate(${dx / 18}deg)`;
    like.style.opacity = Math.max(0, dx / 100); nope.style.opacity = Math.max(0, -dx / 100); sup.style.opacity = Math.max(0, -dy / 120 - Math.abs(dx) / 200);
  });
  const up = () => {
    if (!down) return; down = false;
    if (dx > 110) fling(card, "right"); else if (dx < -110) fling(card, "left"); else if (dy < -140) fling(card, "super");
    else { card.style.transition = "transform .25s"; card.style.transform = ""; like.style.opacity = nope.style.opacity = sup.style.opacity = 0; if (!moved) openProfile(S.women.get(card.dataset.id), "deck"); }
    dx = dy = 0;
  };
  card.addEventListener("pointerup", up); card.addEventListener("pointercancel", up);
}

async function fling(card, dir) {
  if (!card || card.dataset.gone) return; card.dataset.gone = 1;
  const x = dir === "left" ? -600 : dir === "right" ? 600 : 0, y = dir === "super" ? -900 : 40;
  card.style.transition = "transform .3s ease-in"; card.style.transform = `translate(${x}px,${y}px) rotate(${x / 20}deg)`;
  const w = S.women.get(card.dataset.id);
  await swipe(w, dir);
  setTimeout(() => { if (tab === "discover") discover(); }, 280);
}

async function swipe(w, dir) {
  match.learn(w, dir);
  S.deck = S.deck.filter((id) => id !== w.id);
  if (dir === "left") { await saveMeta(); await forgetIfLoose(w); return; }
  const r = match.resolveLike(w, dir === "super");
  if (r.result === "match") { const m = await match.makeMatch(w); m.isNew = true; await saveMatch(m); planner.maybeOpener(w, m); celebrate(w); }
  else if (r.result === "later") { w.pendingMatchAt = r.at; await saveWoman(w); notify.schedule({ nid: notify.idFor("match" + w.id), at: r.at, title: "It's a match! 🔥", body: `${w.name} liked you back`, matchId: w.id, channel: "matches" }); }
  else await forgetIfLoose(w);
  await saveMeta();
  match.refillDeck();
}
async function forgetIfLoose(w) { if (!S.matches.has(w.id) && !w.pendingMatchAt) await forgetWoman(w.id); }

function celebrate(w) {
  chat.ensureAnchor(w);
  const el = document.createElement("div");
  el.className = "matchfx";
  el.innerHTML = `<h1>It's a match!</h1><p>You and ${esc(w.name)} liked each other.</p>
  <div class="pair">${S.profile.photo ? `<img src="${S.profile.photo}">` : `<img src="icons/icon-192.png">`}${faceAv(w, "")}</div>
  <button class="btn hot" id="mx-chat">Send a message</button><button class="btn" id="mx-keep">Keep swiping</button>`;
  document.body.appendChild(el); hydrate(el);
  $("#mx-chat", el).onclick = () => { el.remove(); openChat(w.id); };
  $("#mx-keep", el).onclick = () => el.remove();
}

// ---------- profile sheet ----------
async function openProfile(w, from) {
  const sh = $("#sheet");
  const m = S.matches.get(w.id);
  const photos = m ? m.messages.filter((x) => x.photo).map((x) => x.photo) : [];
  const comp = match.compatibility(w);
  if (!w.anchor) chat.ensureAnchor(w);
  sh.innerHTML = `<div class="in prof">
    <img class="hero hyd" data-key="${esc(w.anchor || "")}" src="${portraitURL(w)}">
    <div class="body">
      <h2>${esc(w.name)}, ${w.age}</h2>
      <div class="sub" style="color:var(--mute)">${esc(w.job)} · ${esc(w.city)} · ${w.distance} mi</div>
      <div class="chips"><span class="chip hot">${comp}% match</span><span class="chip">${esc(GOALS[w.goal].label)}</span><span class="chip">${esc(w.height.replace(/\s*\(.*\)/, ""))}</span><span class="chip">${esc(w.body)}</span></div>
      <div class="box"><div>${esc(w.bio)}</div></div>
      ${w.prompts.map((p) => `<div class="box"><div class="q">${esc(p.q)}</div><div class="a">${esc(p.a)}</div></div>`).join("")}
      <div class="box"><div class="q">Into</div><div class="chips">${w.interests.map((i) => `<span class="chip">${esc(i)}</span>`).join("")}</div></div>
      <div class="box kv"><b>From</b><span>${esc(w.origin)}</span><b>Looks</b><span>${esc(w.hair.color)} ${esc(w.hair.texture)} hair, ${esc(w.eyes.color)} eyes, ${esc(w.bodyDesc)}</span><b>Vibe</b><span>${esc(w.traits.slice(0, 4).join(", "))}</span></div>
      ${m ? `<div class="box"><div class="q">${esc(chat.stage(m))}</div><div class="meter"><i style="width:${m.affection}%"></i></div>
        ${m.memories?.length ? `<div class="q" style="margin-top:10px">She remembers</div><div style="font-size:14px">${m.memories.map(esc).join("<br>")}</div>` : ""}
        ${photos.length ? `<div class="q" style="margin-top:10px">Photos she sent</div><div class="photogrid">${photos.map((p) => `<img class="hyd" data-key="${esc(p.key)}" src="${portraitURL(w)}" data-view="${esc(p.key)}">`).join("")}</div>` : ""}</div>` : ""}
      <div id="pacts"></div>
      <button class="btn" id="pclose">Close</button>
      ${S.settings.showSheet ? `<details class="box"><summary class="q">Character sheet (debug)</summary><pre style="white-space:pre-wrap;font-size:11px">${esc(JSON.stringify({ ...w, likes: undefined }, null, 1))}${m ? "\n" + esc(JSON.stringify({ affection: m.affection, willingness: m.willingness, patience: m.patience, allowedPhoto: chat.allowedLevel(w, m) })) : ""}</pre></details>` : ""}
    </div></div>`;
  sh.hidden = false; hydrate(sh);
  const acts = $("#pacts", sh);
  if (from === "deck") { acts.innerHTML = `<div class="btns2"><button class="btn" id="pn">✕ Pass</button><button class="btn hot" id="py">♥ Like</button></div>`; $("#pn").onclick = () => { closeSheet(); fling($(`.card[data-id="${w.id}"]`), "left"); }; $("#py").onclick = () => { closeSheet(); fling($(`.card[data-id="${w.id}"]`), "right"); }; }
  if (from === "likes") { acts.innerHTML = `<div class="btns2"><button class="btn" id="pn">✕ Pass</button><button class="btn hot" id="py">♥ Like back</button></div>`; $("#pn").onclick = async () => { S.likesYou = S.likesYou.filter((i) => i !== w.id); await saveMeta(); await forgetIfLoose(w); closeSheet(); render(); }; $("#py").onclick = async () => { const mm = await match.makeMatch(w); mm.isNew = true; await saveMatch(mm); planner.maybeOpener(w, mm); closeSheet(); celebrate(w); render(); }; }
  if (from === "chat" && m) {
    acts.innerHTML = `${m.kind === "roulette" ? `<button class="btn hot" id="psave">Save her to your chats</button>` : ""}
      ${img.enabled() ? `<button class="btn" id="preanchor">Re-roll her profile photo</button>` : ""}
      ${m.status === "active" ? `<button class="btn" id="punm" style="color:var(--hot)">Unmatch</button>` : `<button class="btn" id="pdel" style="color:var(--hot)">Delete chat</button>`}`;
    $("#psave") && ($("#psave").onclick = async () => { m.kind = "dating"; w.mode = "dating"; S.roulette = null; await saveMatch(m); await saveWoman(w); closeSheet(); toast("Saved", `${w.name} is in your chats now`); render(); });
    $("#preanchor") && ($("#preanchor").onclick = async () => { await img.generate({ key: "anchor:" + w.id + ":" + Date.now(), prompt: chat.anchorPrompt(w), seed: w.seed + 1 + Math.floor(Math.random() * 1000), kind: "anchor" }).then(async (k) => { w.anchor = k; await saveWoman(w); openProfile(w, from); render(); }).catch((e) => toast("Image generator", e.message)); toast("Re-rolling", "Making a new profile photo…"); });
    $("#punm") && ($("#punm").onclick = async () => { if (!confirm(`Unmatch ${w.name}? The chat will be gone.`)) return; await forgetWoman(w.id); closeSheet(); go("chats"); });
    $("#pdel") && ($("#pdel").onclick = async () => { await forgetWoman(w.id); closeSheet(); go("chats"); });
  }
  $("#pclose").onclick = closeSheet;
  sh.onclick = (e) => { if (e.target === sh) closeSheet(); const v = e.target.dataset?.view; if (v) viewImage(v); };
}
function closeSheet() { $("#sheet").hidden = true; $("#sheet").innerHTML = ""; }

async function viewImage(key) {
  const u = await img.url(key); if (!u) return;
  const rec = await (await import("./store.js")).get("images", key);
  const el = document.createElement("div"); el.className = "viewer";
  el.innerHTML = `<img src="${u}"><button class="x">✕</button><div class="pr">${esc(rec?.prompt || "")}</div>`;
  el.onclick = (e) => { if (e.target.classList.contains("x") || e.target === el) el.remove(); else el.classList.toggle("showp"); };
  document.body.appendChild(el);
}

// ---------- likes ----------
function likes() {
  header(`<h1>Likes you</h1>`);
  S.likesYou.slice(0, 6).forEach((id) => S.settings.autoProfilePhotos && chat.ensureAnchor(S.women.get(id)));
  if (!S.likesYou.length) { view.innerHTML = `<div class="empty"><div class="big">💌</div>When someone likes you first, she shows up here.<br><br>Keep your profile interesting — the algorithm shows you to people who'd be into you.</div>`; return; }
  view.innerHTML = `<div class="grid">${S.likesYou.map((id) => { const w = S.women.get(id); return `<div class="tile" data-id="${id}">${face(w)}<div class="cap">${esc(w.name)}, ${w.age}<small>${match.compatibility(w)}% match</small></div></div>`; }).join("")}</div>`;
  $$(".tile", view).forEach((t) => t.onclick = () => openProfile(S.women.get(t.dataset.id), "likes"));
  hydrate(view);
}

// ---------- chats list ----------
function when(t) {
  if (!t) return "";
  const d = new Date(t), now = new Date();
  if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  if (now - d < 6 * 864e5) return d.toLocaleDateString([], { weekday: "short" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}
function chats() {
  header(`<h1>Chats</h1>`);
  const all = [...S.matches.values()].filter((m) => S.women.has(m.id) && (m.kind === "dating" || m.id === S.roulette));
  const fresh = all.filter((m) => !m.messages.some((x) => x.from !== "sys") && m.status === "active");
  const convos = all.filter((m) => !fresh.includes(m)).sort((a, b) => lastAt(b) - lastAt(a));
  if (!all.length) { view.innerHTML = `<div class="empty"><div class="big">💬</div>No matches yet. Go swipe!</div>`; return; }
  view.innerHTML = `${fresh.length ? `<h3 class="sec">New matches</h3><div class="newm">${fresh.map((m) => { const w = S.women.get(m.id); return `<div class="nm" data-id="${m.id}">${face(w)}<div>${esc(w.name)}</div></div>`; }).join("")}</div>` : ""}
  <h3 class="sec">Messages</h3><div class="list">${convos.map((m) => rowHTML(m)).join("") || `<div class="empty">Say hi to a new match ↑</div>`}</div>`;
  $$("[data-id]", view).forEach((r) => r.onclick = () => openChat(r.dataset.id));
  hydrate(view);
}
function lastAt(m) { const l = m.messages[m.messages.length - 1]; return l ? l.at : m.matchedAt; }
function rowHTML(m) {
  const w = S.women.get(m.id);
  const l = [...m.messages].reverse().find((x) => x.from !== "sys") || m.messages[m.messages.length - 1];
  const typing = chat.typing(m);
  const prev = typing ? "typing…" : !l ? "" : (l.from === "me" ? "You: " : "") + (l.photo && !l.text ? "📷 Photo" : l.text);
  const ended = m.status !== "active";
  return `<div class="row" data-id="${m.id}" style="${ended ? "opacity:.5" : ""}">${faceAv(w)}<div class="t"><div class="n">${esc(w.name)} ${m.unread ? `<span class="dot"></span>` : ""} ${m.kind === "roulette" ? `<span class="stage">roulette</span>` : `<span class="stage">${esc(chat.stage(m))}</span>`}</div><div class="p ${m.unread ? "unread" : ""}" style="${typing ? "color:var(--good)" : ""}">${esc(prev)}</div></div><div class="when">${when(l?.at)}</div></div>`;
}

// ---------- a chat ----------
function openChat(id) {
  closeSheet();
  const m = S.matches.get(id); if (!m) return;
  tab = m.kind === "roulette" ? "roulette" : "chats";
  $$("#tabs button").forEach((b) => b.classList.toggle("on", b.dataset.tab === tab));
  activeChat = id; document.body.classList.add("inchat");
  const w = S.women.get(id);
  m.unread = 0; m.isNew = false; saveMatch(m); badges();
  chat.refreshState(w);
  header(`<button class="ic" id="back">‹</button><div class="chathead" id="hd">${faceAv(w, "")}<div style="min-width:0"><div class="n">${esc(w.name)}</div><div class="s" id="hs"></div></div></div>${m.kind === "roulette" && m.status === "active" ? `<button class="ic" id="skip" title="Next">⏭</button>` : `<button class="ic" id="info">i</button>`}`);
  $("#back").onclick = () => go(m.kind === "roulette" ? "roulette" : "chats");
  $("#hd").onclick = () => openProfile(w, "chat");
  $("#info") && ($("#info").onclick = () => openProfile(w, "chat"));
  $("#skip") && ($("#skip").onclick = () => skipRoulette(true));
  view.innerHTML = `<div class="chatwrap"><div class="scroll" id="sc"><div class="msgs" id="msgs"></div></div>
    ${m.status === "active" ? `<div class="composer"><textarea id="tx" rows="1" placeholder="Message ${esc(w.name)}…"></textarea><button id="send">➤</button></div>` : `<div class="ended">${m.kind === "roulette" ? `She left. <button class="btn hot" id="again">Spin again</button>` : "This conversation is over."}</div>`}</div>`;
  hydrate(top);
  drawMsgs(true);
  const tx = $("#tx");
  if (tx) {
    const send = () => { const t = tx.value.trim(); if (!t) return; tx.value = ""; tx.style.height = ""; chat.userSends(m, t); drawMsgs(true); };
    $("#send").onclick = send;
    tx.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey && !matchMedia("(pointer:coarse)").matches) { e.preventDefault(); send(); } });
    tx.addEventListener("input", () => { tx.style.height = "auto"; tx.style.height = Math.min(120, tx.scrollHeight) + "px"; });
  }
  $("#again") && ($("#again").onclick = () => spin());
}

function drawMsgs(scroll) {
  const m = S.matches.get(activeChat); if (!m) return;
  const w = S.women.get(m.id);
  const box = $("#msgs"); if (!box) return;
  const sc = $("#sc");
  const atBottom = sc.scrollHeight - sc.scrollTop - sc.clientHeight < 80;
  let html = "", lastDay = "";
  const lastMine = [...m.messages].reverse().find((x) => x.from === "me");
  for (const x of m.messages) {
    const day = new Date(x.at).toDateString();
    if (day !== lastDay) { html += `<div class="daysep">${new Date(x.at).toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" })}</div>`; lastDay = day; }
    if (x.from === "sys") { html += `<div class="b sys">${esc(x.text)} ${x.retry ? `<button data-retry>Retry</button>` : ""}</div>`; continue; }
    const cls = x.from === "her" ? "her" : "me";
    if (x.photo) {
      html += `<div class="b ${cls} photo">${img.enabled() ? `<div class="ph" data-key="${esc(x.photo.key)}" data-view="${esc(x.photo.key)}">📷<br>developing…</div>` : `<div class="ph">📷<br>${esc(x.photo.desc)}<br><br><small>Connect an image generator in Me → Photos to see it</small></div>`}${x.text ? `<div class="tx">${esc(x.text)}</div>` : ""}</div>`;
    } else html += `<div class="b ${cls}">${esc(x.text)}</div>`;
    if (x === lastMine) html += `<div class="meta">${x.status === "read" ? "Read " + when(x.readAt) : "Delivered"}</div>`;
  }
  if (chat.typing(m)) html += `<div class="typingb"><i></i><i></i><i></i></div>`;
  box.innerHTML = html;
  box.querySelectorAll("[data-retry]").forEach((b) => b.onclick = () => chat.retry(m));
  box.querySelectorAll("[data-view]").forEach((b) => b.onclick = () => viewImage(b.dataset.view));
  hydrate(box).then(() => { box.querySelectorAll("img.pimg").forEach((i) => i.onclick = () => viewImage(i.dataset.key)); if (scroll || atBottom) sc.scrollTop = sc.scrollHeight; });
  if (scroll || atBottom) sc.scrollTop = sc.scrollHeight;
  const hs = $("#hs");
  if (hs) {
    const typing = chat.typing(m);
    const block = (w.state || {}).block;
    hs.className = "s" + (typing ? " typing" : "");
    hs.textContent = typing ? "typing…" : m.status !== "active" ? chat.stage(m) : m.lastHerAt && Date.now() - m.lastHerAt < 5 * 60000 ? "Active now" : block === "asleep" ? "Probably asleep 😴" : block === "work" ? "Busy" : m.lastHerAt ? "Active " + agoText(m.lastHerAt) : chat.stage(m);
  }
}
function agoText(t) { const s = (Date.now() - t) / 1000; return s < 3600 ? Math.round(s / 60) + "m ago" : s < 86400 ? Math.round(s / 3600) + "h ago" : Math.round(s / 86400) + "d ago"; }

chat.events.addEventListener("update", (e) => {
  if (activeChat === e.detail.id) { const m = S.matches.get(activeChat); if (m) { m.unread = 0; } drawMsgs(); if (m && m.status !== "active" && !$(".ended")) openChat(m.id); }
  else if (tab === "chats" && !activeChat) chats();
  badges();
});
chat.events.addEventListener("match", (e) => { const w = S.women.get(e.detail.id); toast("It's a match! 🔥", `${w.name} liked you back`, w, () => openChat(w.id)); badges(); if (tab === "chats" && !activeChat) chats(); });

// ---------- roulette ----------
function roulette() {
  header(`<h1>Roulette</h1>`);
  const cur = S.roulette && S.matches.get(S.roulette);
  view.innerHTML = `<div class="roul"><p style="color:var(--mute)">Random text chat with a stranger. New woman every spin. She can skip you — and you can skip her.</p>
    <div class="spin" id="wheel"><span>SPIN</span></div>
    ${cur && cur.status === "active" ? `<button class="btn hot" id="resume">Back to ${esc(S.women.get(cur.id).name)}</button>` : ""}
    <p style="color:var(--mute);font-size:13px">Tip: tap her name in the chat to save her to your regular chats.</p></div>`;
  $("#wheel").onclick = () => spin();
  $("#resume") && ($("#resume").onclick = () => openChat(cur.id));
}

async function skipRoulette(andSpin) {
  const old = S.roulette && S.matches.get(S.roulette);
  if (old && old.kind === "roulette") await forgetWoman(old.id);
  S.roulette = null;
  if (andSpin) spin();
}

async function spin() {
  const wheel = $("#wheel"); if (wheel) { wheel.classList.remove("go"); void wheel.offsetWidth; wheel.classList.add("go"); }
  await skipRoulette(false);
  const w = generateWoman({ prefs: S.settings.prefs, bias: S.bias, mode: "roulette", recentNames: [...S.women.values()].map((x) => x.name) });
  w.attraction = match.attraction(w);
  await saveWoman(w);
  const m = await match.makeMatch(w, { kind: "roulette" });
  S.roulette = w.id;
  chat.ensureAnchor(w);
  m.messages.push({ id: chat.uid(), from: "sys", text: `Connected with ${w.name}, ${w.age}`, at: Date.now() });
  await saveMatch(m);
  setTimeout(() => openChat(w.id), wheel ? 900 : 0);
  // she opens with her photo (framework v9), or you can go first
  if (Math.random() < 0.75) {
    m.nextFirstText = Date.now() + 2500 + Math.random() * 5000;
    chat.firstText(w.id, "normal").then(() => {
      const mm = S.matches.get(w.id);
      const o = mm && mm.outbox[0];
      if (o && w.anchor && !o.photo) { o.photo = { key: w.anchor, level: 0, desc: "her profile photo", prompt: chat.anchorPrompt(w) }; saveMatch(mm); }
    }).catch((e) => { m.messages.push({ id: chat.uid(), from: "sys", text: "Couldn't reach the AI: " + e.message, at: Date.now() }); saveMatch(m); chat.events.dispatchEvent(new CustomEvent("update", { detail: { id: m.id } })); });
  }
}

// ---------- me / settings ----------
function seg(name, opts, val) { return `<div class="seg" data-seg="${name}">${opts.map(([v, l]) => `<button data-v="${v}" class="${String(v) === String(val) ? "on" : ""}">${l}</button>`).join("")}</div>`; }
function me() {
  header(`<h1>You</h1>`);
  const p = S.profile, st = S.settings, pr = st.prefs;
  view.innerHTML = `<div class="form">
  <h3>Your profile</h3><p class="hint">Every woman can see this — they'll never ask you to describe yourself.</p>
  <div class="row2"><div><label>Your name</label><input id="p-name" value="${esc(p.name)}" placeholder="what they call you"></div><div><label>Age</label><input id="p-age" type="number" min="18" value="${esc(p.age)}"></div></div>
  <div class="row2"><div><label>Height</label><input id="p-height" value="${esc(p.height)}"></div><div><label>Build</label><input id="p-build" value="${esc(p.build)}"></div></div>
  <div class="row2"><div><label>Eyes</label><input id="p-eyes" value="${esc(p.eyes)}"></div><div><label>Face</label><input id="p-face" value="${esc(p.face)}"></div></div>
  <label>Hair</label><input id="p-hair" value="${esc(p.hair)}">
  <label>Work history</label><input id="p-jobs" value="${esc(p.jobs)}">
  <label>Hobbies &amp; interests</label><textarea id="p-hobbies">${esc(p.hobbies)}</textarea>
  <label>Bio</label><textarea id="p-bio">${esc(p.bio)}</textarea>
  <label>Looking for</label>${seg("lookingFor", [["open", "Open"], ["dating", "Dating"], ["casual", "Casual"], ["friends", "Friends"]], p.lookingFor)}
  <label>Your photo (shown on match screen)</label><input type="file" id="p-photo" accept="image/*">

  <h3 id="sec-ai">AI texting</h3>
  <p class="hint">Use AI Box (or any local OpenAI-style server). In AI Box: load a model, then turn on <b>Local API Server</b> and copy its address here.</p>
  <label>Server address</label><input id="s-llmUrl" value="${esc(st.llmUrl)}">
  <div class="row2"><div><label>API key</label><input id="s-llmKey" value="${esc(st.llmKey)}"></div><div><label>Model name</label><input id="s-llmModel" value="${esc(st.llmModel)}"></div></div>
  <div class="row2"><div><label>Max reply length (tokens)</label><input id="s-maxTokens" type="number" value="${esc(st.maxTokens)}"></div><div><label>Creativity (temp)</label><input id="s-temperature" type="number" step="0.05" value="${esc(st.temperature)}"></div></div>
  <button class="btn small" id="t-llm">Test connection</button><button class="btn small" id="f-llm">Find on this phone</button> <span id="r-llm" class="hint"></span>

  <h3 id="sec-img">Photos (image generator)</h3>
  <p class="hint">Selfies and profile photos come from a local Stable Diffusion server. Without one you get drawn portraits and photo descriptions.</p>
  ${seg("imgBackend", [["none", "None"], ["a1111", "A1111/Forge/Kobold"], ["comfy", "ComfyUI"], ["openai", "OpenAI-style"]], st.imgBackend)}
  <label>Image server address</label><input id="s-imgUrl" value="${esc(st.imgUrl)}">
  <div class="row2"><div><label>Size</label><select id="s-imgSize">${["512x768", "576x1024", "640x960", "768x1152", "832x1216", "896x1152"].map((s) => `<option ${s === st.imgSize ? "selected" : ""}>${s}</option>`).join("")}</select></div><div><label>Steps</label><input id="s-imgSteps" type="number" value="${esc(st.imgSteps)}"></div></div>
  <div class="row2"><div><label>CFG</label><input id="s-imgCfg" type="number" step="0.5" value="${esc(st.imgCfg)}"></div><div><label>Sampler (A1111)</label><input id="s-imgSampler" value="${esc(st.imgSampler)}"></div></div>
  <label>Checkpoint / model name (ComfyUI, OpenAI-style)</label><input id="s-imgModel" value="${esc(st.imgModel)}" placeholder="e.g. realisticVision.safetensors">
  <label>Extra prompt prefix (quality tags, LoRA triggers)</label><input id="s-imgPrefix" value="${esc(st.imgPrefix)}" placeholder="e.g. RAW photo, 8k, film grain">
  <label>Negative prompt (blank = built-in)</label><textarea id="s-imgNegative" placeholder="${esc(img.NEGATIVE)}">${esc(st.imgNegative)}</textarea>
  <details><summary class="hint">ComfyUI custom workflow (API format JSON)</summary><p class="hint">Use placeholders "%prompt%", "%negative%", "%seed%", "%width%", "%height%", "%steps%", "%cfg%", "%ckpt%". Blank = a basic txt2img workflow.</p><textarea id="s-comfyWorkflow" style="min-height:140px;font-family:monospace;font-size:12px">${esc(st.comfyWorkflow)}</textarea></details>
  <label><input type="checkbox" id="c-autoProfilePhotos" ${st.autoProfilePhotos ? "checked" : ""} style="width:auto"> Make profile photos for upcoming cards automatically</label>
  <button class="btn small" id="t-img">Test image</button> <span id="r-img" class="hint"></span><div id="img-out"></div>

  <h3>How they behave</h3>
  <label>Reply speed</label>${seg("replySpeed", [["realistic", "Realistic"], ["quick", "Quick"], ["instant", "Instant"]], st.replySpeed)}
  <p class="hint">Realistic: she might be at work, asleep, or leave you on read. Quick: a few seconds.</p>
  <label>How often they text first</label>${seg("textFirst", [[0, "Never"], [0.5, "Rarely"], [1, "Normal"], [2, "A lot"]], st.textFirst)}
  <label>Spice</label>${seg("spice", [[0, "PG-13"], [1, "Normal"], [2, "Spicier"]], st.spice)}
  <div class="row2"><div><label>Quiet hours from</label><input id="s-quietStart" type="number" min="0" max="23" value="${st.quietStart}"></div><div><label>to</label><input id="s-quietEnd" type="number" min="0" max="23" value="${st.quietEnd}"></div></div>
  <label><input type="checkbox" id="c-notifications" ${st.notifications ? "checked" : ""} style="width:auto"> Notifications</label>
  <button class="btn small" id="t-notif">Allow notifications</button> <span class="hint" id="r-notif">${notify.status()}</span>
  <label><input type="checkbox" id="c-showSheet" ${st.showSheet ? "checked" : ""} style="width:auto"> Show character sheets &amp; scores (spoilers)</label>

  <h3 id="sec-prefs">Who you see</h3>
  <div class="row2"><div><label>Age from</label><input id="pr-ageMin" type="number" min="18" value="${pr.ageMin}"></div><div><label>to</label><input id="pr-ageMax" type="number" min="18" value="${pr.ageMax}"></div></div>
  <label>Body types</label><div class="checks">${Object.entries(BODY_TYPES).map(([k, d]) => `<label><input type="checkbox" data-body="${k}" ${pr.bodyTypes.includes(k) ? "checked" : ""}>${k}</label>`).join("")}</div>
  <label>Backgrounds (none ticked = everyone)</label><div class="checks">${Object.entries(ETHNICITIES).map(([k, e]) => `<label><input type="checkbox" data-eth="${k}" ${pr.ethnicities.includes(k) ? "checked" : ""}>${esc(e.label)}</label>`).join("")}</div>
  <p class="hint">The algorithm also learns from your swipes (${S.swipes.right} likes, ${S.swipes.left} passes). <button class="btn small" id="resetbias">Reset what it learned</button></p>
  <button class="btn small" id="newdeck">Refresh the deck</button>

  <h3>Data</h3>
  <p class="hint">Everything stays on this device.</p>
  <button class="btn small" id="exp">Export backup</button><button class="btn small" id="imp">Import backup</button><button class="btn small" id="wipe" style="color:var(--hot)">Erase everything</button>
  <input type="file" id="impf" accept=".json" hidden>
  <p class="hint" style="margin-top:20px">Afterglow is fiction for adults 18+. Every character is made up and an adult.</p>
  </div>`;

  const bindText = (pre, obj, save, num) => $$(`[id^="${pre}"]`, view).forEach((el) => el.addEventListener("change", () => { const k = el.id.slice(pre.length); obj[k] = el.type === "number" ? +el.value : el.value; save(); }));
  bindText("p-", S.profile, saveProfile);
  bindText("s-", S.settings, saveSettings);
  $$("[id^='c-']", view).forEach((el) => el.addEventListener("change", () => { S.settings[el.id.slice(2)] = el.checked; saveSettings(); }));
  $$("[id^='pr-']", view).forEach((el) => el.addEventListener("change", () => { pr[el.id.slice(3)] = +el.value; saveSettings(); }));
  $$("[data-seg]", view).forEach((sg) => sg.onclick = (e) => {
    const b = e.target.closest("button"); if (!b) return;
    const k = sg.dataset.seg; let v = b.dataset.v; if (/^[\d.]+$/.test(v)) v = +v;
    if (k === "lookingFor") { S.profile.lookingFor = v; saveProfile(); } else { S.settings[k] = v; saveSettings(); }
    $$("button", sg).forEach((x) => x.classList.toggle("on", x === b));
    if (k === "imgBackend" && v === "comfy" && /7860/.test(S.settings.imgUrl)) { S.settings.imgUrl = "http://127.0.0.1:8188"; saveSettings(); $("#s-imgUrl").value = S.settings.imgUrl; }
  });
  $$("[data-body]", view).forEach((c) => c.onchange = () => { pr.bodyTypes = $$("[data-body]:checked", view).map((x) => x.dataset.body); if (!pr.bodyTypes.length) pr.bodyTypes = DEFAULT_SETTINGS.prefs.bodyTypes.slice(); saveSettings(); });
  $$("[data-eth]", view).forEach((c) => c.onchange = () => { pr.ethnicities = $$("[data-eth]:checked", view).map((x) => x.dataset.eth); saveSettings(); });
  $("#p-photo").onchange = (e) => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => shrink(r.result).then((d) => { S.profile.photo = d; saveProfile(); toast("Saved", "Profile photo updated"); }); r.readAsDataURL(f); };
  $("#t-llm").onclick = async () => { const r = $("#r-llm"); r.textContent = "Testing…"; try { const models = await llm.ping(); r.innerHTML = `<span class="ok">Connected</span> ${esc(models.slice(0, 3).join(", "))}`; const t = await llm.chat([{ role: "user", content: "Say hi in five words." }], { max_tokens: 20 }); r.innerHTML += `<br>Model says: “${esc(t.trim())}”`; } catch (e) { r.innerHTML = `<span class="bad">Not reachable</span> ${esc(e.message)}. Is the AI Box server on?`; } };
  $("#f-llm").onclick = async () => { const r = $("#r-llm"); r.textContent = "Looking…"; const u = await llm.discover(); if (u) { S.settings.llmUrl = u; saveSettings(); $("#s-llmUrl").value = u; r.innerHTML = `<span class="ok">Found ${esc(u)}</span>`; } else r.innerHTML = `<span class="bad">Nothing found.</span> Start the Local API Server in AI Box.`; };
  $("#t-img").onclick = async () => { const r = $("#r-img"); r.textContent = "Generating… (can take a while on a phone)"; try { const u = await img.test(); r.innerHTML = `<span class="ok">Works</span>`; $("#img-out").innerHTML = `<img src="${u}" style="width:160px;border-radius:12px;margin-top:8px">`; } catch (e) { r.innerHTML = `<span class="bad">Failed</span> ${esc(e.message)}`; } };
  $("#t-notif").onclick = async () => { const ok = await notify.permission(); $("#r-notif").textContent = ok ? "allowed" : "blocked"; };
  $("#resetbias").onclick = async () => { S.bias = {}; S.swipes = { right: 0, left: 0, total: 0 }; await saveMeta(); toast("Reset", "The algorithm forgot your type"); me(); };
  $("#newdeck").onclick = async () => { for (const id of S.deck) await forgetIfLoose(S.women.get(id)); S.deck = []; await saveMeta(); toast("Deck refreshed", "New people with your current filters"); };
  $("#exp").onclick = async () => { const data = await exportAll(); const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: "application/json" })); a.download = "afterglow-backup.json"; a.click(); };
  $("#imp").onclick = () => $("#impf").click();
  $("#impf").onchange = async (e) => { try { await importAll(JSON.parse(await e.target.files[0].text())); toast("Imported", "Backup restored (photos regenerate)"); me(); } catch (err) { toast("Import failed", err.message); } };
  $("#wipe").onclick = async () => { if (!confirm("Erase all matches, chats, photos and settings?")) return; await wipe(); location.reload(); };
}
function shrink(dataUrl) { return new Promise((res) => { const i = new Image(); i.onload = () => { const c = document.createElement("canvas"); const s = 320 / Math.max(i.width, i.height); c.width = i.width * s; c.height = i.height * s; c.getContext("2d").drawImage(i, 0, 0, c.width, c.height); res(c.toDataURL("image/jpeg", 0.85)); }; i.src = dataUrl; }); }

// ---------- first run ----------
function gate() {
  document.body.classList.add("inchat");
  header("");
  view.innerHTML = `<div class="gate"><h1><b style="background:linear-gradient(90deg,#ff4f7b,#ff8a5c);-webkit-background-clip:text;background-clip:text;color:transparent">afterglow</b></h1>
  <p>A pretend dating app with AI women who swipe, match, text first, flirt, ghost and get attached.</p>
  <p><b>Adults only (18+).</b> Contains sexual content. All characters are fictional adults. Nothing here is a real person, and nothing leaves your phone.</p>
  <button class="btn hot" id="ok18">I'm 18 or older — enter</button><button class="btn" id="no18">Leave</button></div>`;
  $("#ok18").onclick = async () => { S.settings.adultConfirmed = true; await saveSettings(); document.body.classList.remove("inchat"); notify.permission().catch(() => {}); go("me"); toast("Welcome", "Check your profile, then connect AI Box below"); setTimeout(() => $("#sec-ai")?.scrollIntoView(), 200); };
  $("#no18").onclick = () => { view.innerHTML = `<div class="empty">Bye 👋</div>`; };
}

// ---------- loop ----------
async function loop() {
  try {
    const n = await chat.tick(activeChat);
    if (activeChat) drawMsgs();
    if (n && !activeChat) { if (tab === "chats") chats(); }
  } catch (e) { console.error(e); }
}
let lastNotified = new Set();
chat.events.addEventListener("update", (e) => {
  const m = S.matches.get(e.detail.id); if (!m) return;
  const l = m.messages[m.messages.length - 1];
  if (l && l.from === "her" && activeChat !== m.id && !lastNotified.has(l.id) && Date.now() - l.at < 60000 && !document.hidden) {
    lastNotified.add(l.id);
    const w = S.women.get(m.id);
    toast(w.name, l.photo && !l.text ? "📷 Photo" : l.text, w, () => openChat(m.id));
  }
});

async function start() {
  await load();
  await notify.init((id) => { if (S.matches.has(id)) openChat(id); });
  if ("serviceWorker" in navigator && !window.Capacitor) navigator.serviceWorker.register("sw.js").catch(() => {});
  // roulette strangers you didn't save are gone after a restart
  for (const m of [...S.matches.values()]) if (m.kind === "roulette") await forgetWoman(m.id);
  if (!S.settings.adultConfirmed) return gate();
  const q = new URLSearchParams(location.search).get("chat");
  if (q && S.matches.has(q)) openChat(q); else go("discover");
  await chat.tick(activeChat);
  setInterval(loop, 1500);
  setInterval(() => planner.plan().catch(console.error), 15000);
  setTimeout(() => planner.plan().catch(console.error), 3000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) { loop(); planner.plan().catch(() => {}); if (activeChat) drawMsgs(true); } });
}
start();
