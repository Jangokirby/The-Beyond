/* ============================================================================
   Live shared cases.
   The host runs the game exactly as before. Their screen is copied into a shared
   document ("live/view") a few times a second. Players open that copy in a frame,
   and when it is their agent's turn their taps are sent back through their own
   document ("live/lobby/in/<them>"); the host replays the tap on the real screen.
   Everything is stored in the artifact's shared database, so nothing here needs a
   server of its own. Players need Contributor access or better on the page.
   ========================================================================== */
(function () {
  const U = window.UI, G = window.GAME, CAMP = window.CAMP, R = window.R;
  const el = U.el;
  const LIVE = (window.LIVE = { avail: false, stack: [], seq: 0, me: null, host: false, view: null });
  const clone = (x) => JSON.parse(JSON.stringify(x));
  let db = null, user = null;

  /* ------------------------------------------------------------------ actor tracking */
  /* Whoever is deciding right now. A remote agent's owner may tap while it is that agent's turn. */
  LIVE.wrap = async (agent, fn) => { LIVE.stack.push(agent || null); try { return await fn(); } finally { LIVE.stack.pop(); schedule(); } };
  LIVE.stack = LIVE.stack || [];
  LIVE.mode = "vote"; LIVE.spot = 0;
  const FREE = "#choices, #hotspots, #cast";
  const seatIds = () => Object.keys(seats).filter((u) => !seats[u].done).sort();
  /* What a player may touch while no agent is acting: story choices, hotspots, documents, and their own row in a group roll */
  function allowed(n, uid) {
    if (!n || !n.closest) return false;
    if (n.closest(FREE)) return true;
    const m = n.closest("#overlay .modal"); if (!m) return false;
    if (m.querySelector(".group-roll")) { const row = n.closest(".grow[data-owner]"); return row ? row.getAttribute("data-owner") === uid : !!n.closest(".modal-actions"); }
    if (m.classList.contains("doc")) return !!n.closest(".modal-actions, .close");
    return false;
  }
  LIVE.allowed = allowed;
  LIVE.turn = () => LIVE.stack.some(Boolean);
  LIVE.actor = () => {
    for (let i = LIVE.stack.length - 1; i >= 0; i--) { const a = LIVE.stack[i]; if (a) return a.ownerUid || "host"; }
    if (LIVE.mode === "host") return "host";
    const ov = document.querySelector("#overlay"), m = ov && !ov.hidden && ov.querySelector(".modal");
    if (m) return m.querySelector(".group-roll") || m.classList.contains("doc") ? "any" : "host";
    const g = document.querySelector("#screen-game"); if (!g || g.hidden) return "host";
    if (LIVE.mode === "spotlight") { const ids = seatIds(); return ids.length ? ids[LIVE.spot % ids.length] : "host"; }
    return "any";
  };

  const origRoll = G.rollModal;
  G.rollModal = (o) => LIVE.wrap(o && o.agent, () => origRoll(o));

  /* ------------------------------------------------------------------ setup */
  LIVE.init = async () => {
    try {
      if (!window.claude || !window.claude.use) return;
      db = await window.claude.use("db"); user = await window.claude.use("user");
      if (!db || !user) return;
      LIVE.me = await user.id(); LIVE.host = await user.canEdit();
      LIVE.avail = !!LIVE.me;
      if (LIVE.avail) watchLobby();
    } catch (e) { LIVE.avail = false; }
  };

  let lobby = null, seats = {}, unsubs = [];
  const lobbyRef = () => db.doc("live/lobby");
  const seatsCol = () => db.collection("live/lobby/seats");
  const inCol = () => db.collection("live/lobby/in");
  const viewRef = () => db.doc("live/view");

  function watchLobby() {
    unsubs.push(lobbyRef().onSnapshot((s) => {
      lobby = s.exists ? s.data() : null; LIVE.mode = (lobby && lobby.mode) || "vote"; LIVE.tableOpen = !!(lobby && lobby.status === "open");
      if (LIVE.host && LIVE.tableOpen && !hosting) startHosting();
      LIVE.syncRoster(); LIVE.redraw();
    }, () => {}));
    unsubs.push(seatsCol().onSnapshot((q) => {
      const readyBefore = JSON.stringify(Object.fromEntries(Object.entries(seats).map(([u, x]) => [u, !!x.ready])));
      seats = {}; for (const d of q.docs) seats[d.id] = d.data();
      const readyNow = JSON.stringify(Object.fromEntries(Object.entries(seats).map(([u, x]) => [u, !!x.ready])));
      LIVE.syncRoster(); LIVE.redraw(); LIVE.onView();
      if (LIVE.host) { LIVE.pubCamp(); if (readyBefore !== readyNow) hubRefresh(); }
    }, () => {}));
    unsubs.push(db.doc("live/camp").onSnapshot((s) => { LIVE.campDoc = s.exists ? s.data() : null; if (!LIVE.host) { showMyResult(); LIVE.redraw(); } }, () => {}));
    unsubs.push(viewRef().onSnapshot((s) => { LIVE.view = s.exists ? s.data() : null; LIVE.onView(); }, () => {}));
  }
  /* host: seated players join the roster by themselves, and leave it once their agent has gone home */
  LIVE.syncRoster = () => {
    if (!LIVE.host || !hosting || !CAMP.camp) return;
    let changed = false;
    for (const uid of Object.keys(seats)) {
      const s = seats[uid];
      if (s.done || !s.ch || CAMP.camp.chars.some((c) => c.ownerUid === uid)) continue;
      if (LIVE.importSeat(uid)) changed = true;
    }
    const g = document.querySelector("#screen-game");
    if (!g || g.hidden) { const keep = CAMP.camp.chars.filter((c) => !c.ownerUid || seats[c.ownerUid]); if (keep.length !== CAMP.camp.chars.length) { CAMP.camp.chars = keep; CAMP.save(); changed = true; } }
    if (changed && LIVE.screenOpen) LIVE.redraw();
  };
  LIVE.redraw = () => { if (LIVE.screenOpen) LIVE.screen(); };

  /* ------------------------------------------------------------------ host: copy the screen */
  const INTER = (n) => n._h || n.onclick || n.tagName === "BUTTON" || n.tagName === "SELECT" || n.tagName === "TEXTAREA" || n.tagName === "INPUT";
  let timer = 0, writing = false, dirty = false, lastHtml = "", hosting = false;
  function schedule() { if (!hosting) return; clearTimeout(timer); timer = setTimeout(push, 450); }

  function serialize() {
    const root = document.querySelector("#screen-game");
    if (!root || root.hidden) return null;
    let k = 0;
    for (const n of document.querySelectorAll("#screen-game *, #overlay *")) {
      if (n.hasAttribute("data-k")) n.removeAttribute("data-k");
      if (INTER(n) && n.tagName !== "SCRIPT") n.setAttribute("data-k", String(k++));
      if (n.tagName === "INPUT") { if (n.type === "checkbox" || n.type === "radio") { if (n.checked) n.setAttribute("checked", ""); else n.removeAttribute("checked"); } else n.setAttribute("value", n.value); }
      if (n.tagName === "TEXTAREA") n.textContent = n.value;
      if (n.tagName === "OPTION") { if (n.selected) n.setAttribute("selected", ""); else n.removeAttribute("selected"); }
    }
    const c = root.cloneNode(true);
    const lines = c.querySelectorAll("#story .line"); for (let i = 0; i < lines.length - 40; i++) lines[i].remove();
    for (const cv of c.querySelectorAll("canvas")) cv.remove();
    const ov = document.querySelector("#overlay");
    const html = `<div id="app">${c.outerHTML}</div>${ov && !ov.hidden ? ov.outerHTML : '<div id="overlay" hidden></div>'}`;
    return shrink(html);
  }

  /* Big inline pictures (drawn scenes, portraits) are sent once each as their own document and the view
     refers to them by a short name, so a screen never outgrows one update. */
  const hashStr = (t) => { let h = 2166136261; for (let i = 0; i < t.length; i += 7) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36) + t.length.toString(36); };
  const sentAssets = new Set(), pendingAssets = new Map();
  function shrink(html) {
    return html.replace(/data:image\/[a-z+]+[;,][^"'\s)&]{2000,}/g, (uri) => {
      const h = hashStr(uri);
      if (!sentAssets.has(h)) { sentAssets.add(h); pendingAssets.set(h, uri); }
      return "beyond-asset:" + h;
    });
  }
  async function sendAssets() {
    for (const [h, uri] of [...pendingAssets]) {
      pendingAssets.delete(h);
      try { await db.doc("live/asset/" + h).set({ uri }); } catch (e) { sentAssets.delete(h); }
    }
  }
  async function push() {
    if (!hosting || !db) return;
    if (writing) { dirty = true; return; }
    voteTick();
    const html = serialize();
    const status = html === null ? "camp" : "game";
    const key = status + "|" + (window.FLAVOR && window.FLAVOR.jp ? "jp" : "") + "|" + (html || "") + "|" + LIVE.actor() + "|" + LIVE.turn() + "|" + LIVE.mode;
    if (key === lastHtml) return;
    lastHtml = key;
    writing = true;
    try {
      LIVE.seq += 1;
      if (pendingAssets.size) await sendAssets();
      await viewRef().set({ seq: LIVE.seq, status, html: html && html.length < 250000 ? html : "", actor: LIVE.actor(), turn: LIVE.turn(), mode: LIVE.mode, jp: !!(window.FLAVOR && window.FLAVOR.jp), t: Date.now(), title: (lobby && lobby.title) || "" });
    } catch (e) { /* a dropped frame is fine, the next change sends another */ }
    writing = false;
    if (dirty) { dirty = false; schedule(); }
  }

  /* ------------------------------------------------------------------ host: voting on story choices
     In "vote" mode every seated player whose agent is in the case, plus the host, taps a choice.
     When everyone has voted the majority wins (a tie goes to the host's pick). "Decide now" closes it early.
     "Who tries?" prompts are not voted: each player can step up with their own agent. */
  const votes = new Map(); let voteSig = "", resolving = false;
  const choiceBox = () => document.querySelector("#screen-game #choices");
  const choiceBtns = () => [...document.querySelectorAll("#screen-game #choices .btn.choice")];
  const isWho = () => { const b = choiceBox(); return !!(b && b.dataset.kind === "who"); };
  const sigNow = () => choiceBtns().map((b) => (b.querySelector(".lbl") || b).textContent.trim()).join("|");
  const voters = () => {
    const party = new Set(((G.state && G.state.agents) || []).filter((a) => !a.dead).map((a) => a.ownerUid).filter(Boolean));
    return ["host", ...Object.keys(seats).filter((u) => party.has(u) && !LIVE.away(u)).sort()];
  };
  const voting = () => hosting && LIVE.mode === "vote" && !LIVE.turn() && !isWho() && choiceBtns().length > 1 && voters().length > 1;
  const firstName = (u) => (u === "host" ? "Host" : ((seats[u] && seats[u].who) || "Player").split(/\s+/)[0]);
  let deadline = 0, timerSig = "";
  function syncVotes() { const sig = sigNow(); if (sig !== voteSig) { votes.clear(); voteSig = sig; } if (voteSig !== timerSig) { timerSig = voteSig; const t = +((lobby && lobby.timer) || 0); deadline = t ? Date.now() + t * 1000 : 0; } }
  setInterval(() => {
    if (!hosting || !voting() || !deadline) return;
    const left = Math.ceil((deadline - Date.now()) / 1000);
    const bar = choiceBox() && choiceBox().querySelector(".votebar .vtime"); if (bar) bar.textContent = left > 0 ? ` · ${left}s` : "";
    if (left <= 0) { deadline = 0; if (votes.size) resolveVote(); else { const b = choiceBox() && choiceBox().querySelector(".votebar .vtime"); if (b) b.textContent = " · time's up: waiting for a vote"; } schedule(); }
  }, 1000);
  function castVote(uid, b) {
    syncVotes();
    const i = choiceBtns().indexOf(b); if (i < 0) return;
    votes.set(uid, i); drawVotes();
    const vs = voters();
    if (vs.every((u) => votes.has(u))) setTimeout(resolveVote, 700);   // a beat so everyone sees the final tally
  }
  function resolveVote() {
    syncVotes();
    const vs = voters(), t = new Map();
    for (const [u, i] of votes) if (vs.includes(u)) t.set(i, (t.get(i) || 0) + 1);
    if (!t.size) { U.toast("No votes yet."); return; }
    const best = Math.max(...t.values()), tied = [...t.keys()].filter((i) => t.get(i) === best);
    const hv = votes.get("host"), win = tied.includes(hv) ? hv : tied[Math.floor(Math.random() * tied.length)];
    const b = choiceBtns()[win]; votes.clear(); voteSig = "";
    if (b) { resolving = true; try { b.click(); } finally { resolving = false; } }
  }
  function drawVotes() {
    const box = choiceBox(); if (!box) return;
    const bs = choiceBtns(), vs = voters();
    for (const b of bs) { const c = b.querySelector(".vchips"); if (c) c.remove(); }
    for (const [u, i] of votes) { const b = bs[i]; if (!b || !vs.includes(u)) continue; let c = b.querySelector(".vchips"); if (!c) { c = el("span", { class: "vchips" }); b.append(c); } c.append(el("i", {}, firstName(u))); }
    let bar = box.querySelector(".votebar");
    if (!bar) { bar = el("div", { class: "votebar", "data-hostonly": "" }); box.append(bar); }
    const n = vs.filter((u) => votes.has(u)).length, waiting = vs.filter((u) => !votes.has(u)).map(firstName);
    bar.replaceChildren(el("span", {}, el("b", {}, "Table vote "), `${n} of ${vs.length}${waiting.length ? " · waiting on " + waiting.join(", ") : ""}`, el("span", { class: "vtime" }, deadline ? ` · ${Math.max(0, Math.ceil((deadline - Date.now()) / 1000))}s` : "")),
      el("button", { class: "btn small", "data-hostonly": "", onclick: () => resolveVote() }, "Decide now"));
  }
  function voteTick() {
    if (!voting()) { const bar = choiceBox() && choiceBox().querySelector(".votebar"); if (bar) bar.remove(); return; }
    syncVotes();
    if (!choiceBox().querySelector(".votebar")) drawVotes();
  }

  /* ------------------------------------------------------------------ host: between cases
     The host's campaign holds every seated player's agent. Players spend that agent's downtime from
     their own device: the request comes in here, the host applies it, and the result (a splash scene)
     goes back through "live/camp", which also lists the team for everyone. */
  LIVE.seat = (uid) => seats[uid] || null;
  LIVE.seats = () => seats;
  LIVE.hosting = () => hosting;
  LIVE.lobby = () => lobby;
  LIVE.db = () => db;
  /* a player whose device hasn't checked in for 45 seconds is away: votes don't wait for them */
  LIVE.away = (uid) => { const x = seats[uid]; return !!(x && x.seen && Date.now() - x.seen > 45000); };
  const campScreen = () => { const g = document.querySelector("#screen-game"); return !g || g.hidden; };
  function hubRefresh() { if (CAMP.camp && campScreen() && !LIVE.screenOpen && !U.modalOpen() && !document.querySelector(".splash") && (CAMP.tab === "hideout" || CAMP.tab === "downtime")) CAMP.ui.hub(); }
  const results = {};
  let campTimer = 0;
  LIVE.pubCamp = () => { clearTimeout(campTimer); campTimer = setTimeout(pubCampNow, 300); };
  async function pubCampNow() {
    if (!db || !LIVE.host || !hosting || !CAMP.camp || !window.HIDE) return;
    const c = CAMP.camp, H = window.HIDE;
    const party = CAMP.active().map((a) => ({
      uid: a.ownerUid || null, id: a.id, name: a.name, short: a.short, src: CAMP.ui.portraitSrc(a), lvl: a.level, bg: a.background || "",
      pools: a.pools, left: H.left(a) === Infinity ? -1 : H.left(a), max: H.max(a) === Infinity ? -1 : H.max(a),
      ready: !!(a.ownerUid && seats[a.ownerUid] && seats[a.ownerUid].ready),
      opts: a.ownerUid ? H.options(a) : null
    }));
    try { await db.doc("live/camp").set({ t: Date.now(), inCase: !campScreen(), name: c.name, day: c.day, year: c.year, era: C().eraOf(c.year).id, ag: CAMP.agency().short, favors: c.favors.length, party, results }); } catch (e) {}
  }
  const C = () => window.CDATA;
  function handleDowntime(uid, d) {
    const a = CAMP.camp && CAMP.camp.chars.find((x) => x.ownerUid === uid && x.status === "active");
    let r;
    if (!a) r = { err: "Your agent isn't in the host's campaign yet." };
    else if (!campScreen()) r = { err: "A case is running. Downtime waits until it ends." };
    else { const spec = window.HIDE.apply(a, String(d.act), { bond: +d.bond }); r = spec ? { spec } : { err: `${a.short} has no downtime left before the next job.` }; if (spec) { U.toast(`${a.short}: ${spec.title}`); const s = seats[uid]; if (s && s.done) db.doc("live/lobby/seats/" + uid).update({ done: clone(a) }).catch(() => {}); } }
    results[uid] = { n: d.n, ...r };
    hubRefresh(); LIVE.pubCamp();
  }
  /* a new case clears everyone's "ready" */
  const origStart = CAMP.startMission;
  CAMP.startMission = async function () {
    if (db && LIVE.host && hosting) for (const u of Object.keys(seats)) if (seats[u].ready) db.doc("live/lobby/seats/" + u).update({ ready: false }).catch(() => {});
    const r = await origStart.apply(this, arguments); LIVE.pubCamp(); return r;
  };
  const origHub = CAMP.ui.hub;
  CAMP.ui.hub = function () { const r = origHub.apply(this, arguments); if (LIVE.host && hosting) LIVE.pubCamp(); return r; };

  /* apply a tap that arrived from a player */
  const lastN = {};
  function onInput(q) {
    for (const ch of q.docChanges()) {
      if (ch.type === "removed") continue;
      const uid = ch.doc.id, d = ch.doc.data() || {};
      if ((lastN[uid] || 0) >= d.n) continue;
      lastN[uid] = d.n;
      if (!seats[uid]) continue;
      if (d.op === "dt") { handleDowntime(uid, d); continue; }
      if (LIVE.ops && LIVE.ops[d.op]) { try { LIVE.ops[d.op](uid, d); } catch (e) { console.warn(e); } continue; }
      const who = LIVE.actor(), turn = LIVE.turn();
      if (turn ? who !== uid : !(who === "any" || who === uid)) continue;
      const n = document.querySelector(`#screen-game [data-k="${+d.k}"], #overlay [data-k="${+d.k}"]`);
      if (!n || n.disabled) continue;
      if (d.t != null && (n.textContent || "").trim().slice(0, 40) !== d.t && n.tagName !== "SELECT" && n.tagName !== "INPUT") continue;   // the screen moved on under their finger
      if (!turn && !allowed(n, uid)) continue;
      if (n.closest("[data-hostonly]")) continue;
      if (!turn && isWho() && n.classList.contains("choice")) { const ag = G.agentById(n.getAttribute("data-id")); if (!ag || ag.ownerUid !== uid) continue; }
      if (d.op === "click" && voting() && n.classList.contains("choice") && n.closest("#choices")) { castVote(uid, n); schedule(); continue; }
      if (!turn && who === uid && LIVE.mode === "spotlight" && n.closest("#choices")) LIVE.spot++;
      if (d.op === "click") n.click();
      else if (d.op === "set") {
        if (n.tagName === "INPUT" && (n.type === "checkbox" || n.type === "radio")) n.checked = !!d.v;
        else n.value = String(d.v == null ? "" : d.v).slice(0, 600);
        n.dispatchEvent(new Event("input", { bubbles: true })); n.dispatchEvent(new Event("change", { bubbles: true }));
      }
      schedule();
    }
  }

  LIVE.openTable = async (title) => {
    await lobbyRef().set({ host: LIVE.me, title: title || "Live case", status: "open", mode: LIVE.mode || "vote", t: Date.now() });
    hosting = true; startHosting();
  };
  let obs = null, inUnsub = null, chatUnsub = null, spotHook = false, voteHook = false;
  const lastChat = {};
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function onChat(q) {
    for (const ch of q.docChanges()) {
      if (ch.type === "removed") continue;
      const uid = ch.doc.id, d = ch.doc.data() || {};
      if (!seats[uid] || (lastChat[uid] || 0) >= d.n) continue;
      lastChat[uid] = d.n;
      const g = document.querySelector("#screen-game");
      const line = `<b>${esc(seats[uid].who)}:</b> ${esc(String(d.text || "").slice(0, 300))}`;
      if (g && !g.hidden) U.print(line, "echo chat"); else U.toast(line);
    }
  }
  function startHosting() {
    hosting = true;
    if (!obs) {
      obs = new MutationObserver(schedule);
      obs.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["class", "style", "disabled", "hidden", "src", "aria-selected"] });
      document.addEventListener("input", schedule, true);
    }
    if (!inUnsub) inUnsub = inCol().onSnapshot(onInput, () => {});
    if (!chatUnsub) chatUnsub = db.collection("live/lobby/chat").onSnapshot(onChat, () => {});
    LIVE.pubCamp();
    if (!voteHook) { voteHook = true; document.addEventListener("click", (e) => {
      if (!e.isTrusted || resolving || !voting()) return;
      const b = e.target.closest && e.target.closest("#screen-game #choices .btn.choice"); if (!b || b.disabled) return;
      e.preventDefault(); e.stopImmediatePropagation(); castVote("host", b); schedule();
    }, true); }
    if (!spotHook) { spotHook = true; document.addEventListener("click", (e) => { if (LIVE.mode === "spotlight" && e.isTrusted && e.target.closest && e.target.closest("#choices button")) LIVE.spot++; }, true); }
    schedule();
  }
  LIVE.closeTable = async () => {
    hosting = false; if (obs) { obs.disconnect(); obs = null; } if (inUnsub) { inUnsub(); inUnsub = null; } if (chatUnsub) { chatUnsub(); chatUnsub = null; }
    try { await viewRef().set({ seq: ++LIVE.seq, status: "closed", html: "", actor: "host", t: Date.now() }); } catch (e) {}
    try { await lobbyRef().delete(); } catch (e) {}
    for (const id of Object.keys(seats)) { try { await db.doc("live/lobby/seats/" + id).delete(); } catch (e) {} }
  };

  /* ------------------------------------------------------------------ host: seats */
  LIVE.importSeat = (uid) => {
    const s = seats[uid]; if (!s || !s.ch || !CAMP.camp) return false;
    const ch = clone(s.ch);
    ch.id = "lv_" + uid.slice(0, 6) + "_" + ch.id;
    ch.ownerUid = uid; ch.guest = true; ch.lvOrigin = { camp: s.camp, id: s.ch.id };
    CAMP.camp.chars = CAMP.camp.chars.filter((x) => x.id !== ch.id);
    CAMP.camp.chars.push(ch); CAMP.save(); return ch;
  };
  /* After a case: send each guest agent home with what happened to them */
  const origDebrief = CAMP.debrief;
  CAMP.debrief = function (r) {
    const out = origDebrief.apply(this, arguments);
    if (db && LIVE.host && CAMP.camp) for (const ch of CAMP.camp.chars) if (ch.ownerUid && seats[ch.ownerUid]) {
      db.doc("live/lobby/seats/" + ch.ownerUid).update({ done: clone(ch), doneAt: Date.now() }).catch(() => {});
    }
    return out;
  };

  /* ------------------------------------------------------------------ player: seat */
  LIVE.takeSeat = async (campId, ch) => {
    const camp = CAMP.peek(campId);
    const copy = clone(ch);
    await db.doc("live/lobby/seats/" + LIVE.me).set({ uid: LIVE.me, who: ch.name, camp: campId, ch: copy, t: Date.now() });
  };
  LIVE.leaveSeat = async () => { await db.doc("live/lobby/seats/" + LIVE.me).delete(); };
  LIVE.collect = async () => {
    const s = seats[LIVE.me]; if (!s || !s.done) return false;
    const camp = CAMP.peek(s.camp); if (!camp) return false;
    const i = camp.chars.findIndex((x) => x.id === s.ch.id); if (i < 0) return false;
    const back = clone(s.done); back.id = s.ch.id; delete back.ownerUid; delete back.guest; delete back.lvOrigin;
    camp.chars[i] = back;
    const keep = CAMP.camp; CAMP.camp = camp; CAMP.save(); CAMP.camp = keep && keep.id !== camp.id ? keep : camp;
    await LIVE.leaveSeat(); return true;
  };

  /* ------------------------------------------------------------------ player: the mirror */
  let frame = null, bar = null, shell = null, lastSeq = -1;
  const SHELL_CSS = "position:fixed;inset:0;z-index:9000;display:flex;flex-direction:column;background:#000";
  LIVE.openMirror = () => {
    if (shell) return;
    shell = el("div", { style: SHELL_CSS });
    bar = el("div", { class: "livebar" });
    const inp = el("input", { type: "text", class: "lvsay", placeholder: "Say something to the table…", maxlength: "300" });
    const go = () => { LIVE.say(inp.value); inp.value = ""; };
    inp.addEventListener("keydown", (e) => { if (e.key === "Enter") go(); });
    bar.append(el("b", { class: "lvstat" }), el("span", { class: "lvflash" }), el("button", { class: "btn small ghost", onclick: () => LIVE.closeMirror() }, "Leave view"),
      el("div", { class: "lvsayrow" }, inp, el("button", { class: "btn small", onclick: go }, "Say")));
    frame = el("iframe", { style: { flex: "1", border: "0", width: "100%", background: "#0b0a0c" }, title: "The table" });
    shell.append(bar, frame);
    document.body.append(shell);
    frame.addEventListener("load", wireFrame);
    frame.srcdoc = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><base href="${document.baseURI}">`
      + `<link rel="stylesheet" href="css/game.css"><link rel="stylesheet" href="css/camp.css"><link rel="stylesheet" href="css/hideout.css"><link rel="stylesheet" href="css/world.css"><link rel="stylesheet" href="css/dossier.css"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Dela+Gothic+One&family=Shippori+Mincho:wght@400;600;700;800&display=swap">`
      + `<style>body{margin:0}.screen[hidden]{display:none}#overlay[hidden]{display:none}</style></head><body><div id="mirror"></div></body></html>`;
    lastSeq = -1;
  };
  LIVE.closeMirror = () => { if (shell) { shell.remove(); shell = frame = bar = null; } };

  let netN = 0;
  /* player: downtime requests and their splash scenes */
  let dtSent = 0, dtShown = 0;
  function showMyResult() {
    const r = LIVE.campDoc && LIVE.campDoc.results && LIVE.campDoc.results[LIVE.me];
    if (!r || r.n === dtShown || r.n !== dtSent) return;
    dtShown = r.n;
    if (r.err) U.toast(r.err); else if (window.HIDE && r.spec) window.HIDE.splash(r.spec);
  }
  LIVE.requestDowntime = (act, bond) => {
    if (!db) return;
    netN += 1; dtSent = Date.now() * 10 + (netN % 10);
    db.doc("live/lobby/in/" + LIVE.me).set({ n: dtSent, op: "dt", act, bond: bond == null ? -1 : bond }).catch(() => U.toast("Could not reach the table."));
  };
  LIVE.setReady = (on) => db.doc("live/lobby/seats/" + LIVE.me).update({ ready: !!on }).catch(() => {});
  function dtPanel(cd, me) {
    const ui = CAMP.ui, H = window.HIDE;
    const inf = (n) => (n < 0 ? Infinity : n);
    const head = el("p", { class: "note" }, `${cd.ag} · ${cd.name} · day ${cd.day}, ${cd.year}. Spend your agent's downtime before the next case. The host sees what you do.`);
    if (!me) return el("div", {}, head, el("p", { class: "warn" }, "Your agent isn't in the host's campaign yet. It joins as soon as the host opens their campaign."));
    const left = inf(me.left), max = inf(me.max), out = left <= 0;
    const card = el("div", { class: "pcard on static" }, el("img", { class: "pface", src: me.src, alt: "" }),
      el("div", { class: "pinfo" }, el("div", { class: "pname" }, el("b", {}, me.name), el("small", {}, `Lv ${me.lvl} · ${me.bg}`)),
        el("div", { class: "pools" }, ...["health", "sanity", "stability"].map((k) => ui.bar(me.pools[k], k))),
        el("div", { class: "pfoot" }, H ? H.pips(left, max) : null)));
    const acts = me.opts ? [...me.opts.rest, ...me.opts.out] : [];
    const list = el("div", { class: "hacts" }, ...acts.map((o) => el("button", { class: "hact", disabled: out ? "disabled" : null, onclick: () => { U.click(); LIVE.requestDowntime(o.act, o.bond); } },
      el("b", {}, o.label), el("small", {}, o.hint || ""), o.cost ? el("span", { class: "hcost" }, o.cost) : null)));
    const team = el("div", { class: "lvteam" }, ...cd.party.filter((p) => p.uid !== LIVE.me).map((p) => el("span", { class: "lvmate" + (p.ready ? " ready" : "") }, el("img", { src: p.src, alt: "" }), p.short, p.uid ? el("small", {}, p.ready ? "ready" : "getting ready") : el("small", {}, "host's agent"))));
    const say = el("input", { type: "text", class: "lvsay", placeholder: "Say something to the table…", maxlength: "300", onkeydown: (e) => { if (e.key === "Enter") { LIVE.say(say.value); say.value = ""; } } });
    return el("div", {}, head, card, out ? el("p", { class: "note" }, `${me.short} has done all they can before the next job.`) : null, list,
      el("div", { class: "row" }, CAMP.ui.btn(me.ready ? "Not ready yet" : "I'm ready for the next job", () => LIVE.setReady(!me.ready), me.ready ? "ghost" : "primary")),
      el("h4", {}, "The team"), team, el("div", { class: "lvsayrow" }, say, CAMP.ui.btn("Say", () => { LIVE.say(say.value); say.value = ""; }, "small")));
  }
  const myAgentId = () => { const s = seats[LIVE.me]; return s && s.ch ? "lv_" + LIVE.me.slice(0, 6) + "_" + s.ch.id : ""; };
  const v0 = (n) => LIVE.view && LIVE.view.mode === "vote" && !LIVE.view.turn && n.classList && n.classList.contains("choice") && !(n.closest && n.closest("#choices[data-kind=who]"));
  function mayTap(n) {
    const v = LIVE.view; if (!v || !seats[LIVE.me]) return false;
    if (v.turn) return v.actor === LIVE.me;
    if (n.closest && n.closest("[data-hostonly]")) return false;
    if (n.closest && n.closest("#choices[data-kind=who]") && n.getAttribute("data-id") !== myAgentId()) return false;
    return (v.actor === "any" || v.actor === LIVE.me) && allowed(n, LIVE.me);
  }
  function send(d, n) {
    if (!db) return;
    if (!mayTap(n)) { const v = LIVE.view; flashBar(!v ? "" : n.closest && n.closest("[data-hostonly]") ? "Only the host can close the vote." : n.closest && n.closest("#choices[data-kind=who]") ? "Step up with your own agent." : v.turn ? "Not your agent's turn." : v.actor === "host" ? "The host decides this one." : v.actor !== "any" && v.actor !== LIVE.me ? "It is someone else's call." : "That one is not yours to press."); return; }
    netN += 1;
    db.doc("live/lobby/in/" + LIVE.me).set({ n: Date.now() * 10 + (netN % 10), seq: LIVE.view.seq, t: (n.textContent || "").trim().slice(0, 40), ...d }).catch(() => {});
    flashBar(v0(n) ? "Vote sent" : "Sent");
  }
  let chatN = 0;
  LIVE.say = (text) => { text = String(text || "").trim().slice(0, 300); if (!text || !db || !seats[LIVE.me]) return; db.doc("live/lobby/chat/" + LIVE.me).set({ n: Date.now() * 10 + (++chatN % 10), text }).catch(() => {}); flashBar("Said"); };
  function flashBar(t) { if (!bar) return; const f = bar.querySelector(".lvflash"); if (f) { f.textContent = t; setTimeout(() => { f.textContent = ""; }, 1500); } }
  function wireFrame() {
    const d = frame.contentDocument; if (!d) return;
    d.addEventListener("click", (e) => {
      const n = e.target.closest && e.target.closest("[data-k]");
      if (!n || n.disabled) return;
      if (n.tagName === "INPUT" && (n.type === "checkbox" || n.type === "radio")) return;   // the change event carries these
      if (n.tagName === "INPUT" || n.tagName === "TEXTAREA" || n.tagName === "SELECT") return;
      e.preventDefault(); e.stopPropagation();
      send({ k: +n.getAttribute("data-k"), op: "click" }, n);
    }, true);
    d.addEventListener("change", (e) => {
      const n = e.target.closest && e.target.closest("[data-k]"); if (!n) return;
      const v = n.type === "checkbox" || n.type === "radio" ? n.checked : n.value;
      send({ k: +n.getAttribute("data-k"), op: "set", v }, n);
    }, true);
    LIVE.onView();
  }
  const assetCache = {}, assetWait = new Set();
  function expand(html) {
    return html.replace(/beyond-asset:([a-z0-9]+)/g, (all, h) => {
      if (assetCache[h]) return assetCache[h];
      if (!assetWait.has(h) && db) { assetWait.add(h); db.doc("live/asset/" + h).get().then((s) => { const x = s.exists ? s.data() : null; if (x && x.uri) { assetCache[h] = x.uri; lastSeq = -1; LIVE.onView(); } }).catch(() => {}).finally(() => assetWait.delete(h)); }
      return "";
    });
  }
  LIVE.onView = () => {
    const v = LIVE.view;
    if (LIVE.screenOpen) LIVE.redraw();
    if (!shell) { if (v && v.status === "game" && seats[LIVE.me] && !LIVE.host) LIVE.openMirror(); return; }
    if (!v || v.status === "closed") { LIVE.closeMirror(); U.toast("The table has closed."); return; }
    if (v.status === "camp" && !LIVE.host) { LIVE.closeMirror(); LIVE.screen(); return; }
    const name = (u) => (seats[u] && seats[u].who) || "Another player";
    const who = v.turn ? (v.actor === LIVE.me ? "Your turn" : v.actor === "host" ? "The host is acting" : name(v.actor) + " is acting") : v.actor === "any" ? (v.mode === "vote" ? "Vote on what happens next" : "Your call: anyone can choose") : v.actor === LIVE.me ? "Your call" : v.actor === "host" ? "The host is deciding" : name(v.actor) + "'s call";
    const st = bar.querySelector(".lvstat");
    st.textContent = v.status === "game" ? who : "Between scenes: the host is in camp.";
    st.className = "lvstat" + (v.actor === LIVE.me || v.actor === "any" ? " lvyou" : "");
    bar.querySelector(".lvsayrow").hidden = !seats[LIVE.me];
    const d = frame && frame.contentDocument;
    if (!d || !d.body || v.seq === lastSeq || v.status !== "game" || !v.html) return;
    lastSeq = v.seq;
    const m = d.getElementById("mirror"); if (!m) return;
    const keep = {}; for (const id of ["story", "panel", "scene"]) { const n = d.getElementById(id); if (n) keep[id] = { top: n.scrollTop, bottom: n.scrollHeight - n.scrollTop - n.clientHeight < 60 }; }
    d.documentElement.classList.toggle("jp-flavor", !!v.jp);
    if (window.DOSSIER) d.documentElement.classList.add("ed-dossier", window.ART_STYLE === "painted" ? "ed-painted" : "ed-photo");
    m.innerHTML = expand(v.html);
    for (const id of Object.keys(keep)) { const n = d.getElementById(id); if (n) n.scrollTop = keep[id].bottom ? n.scrollHeight : keep[id].top; }
  };

  /* ------------------------------------------------------------------ the lobby screen */
  LIVE.screen = () => {
    LIVE.screenOpen = true;
    const ui = CAMP.ui, btn = ui.btn, panel = ui.panel;
    const back = () => { LIVE.screenOpen = false; if (CAMP.camp) ui.hub(); else ui.title(); };
    const body = el("div", { class: "hub" });
    body.append(el("header", { class: "hubhead" }, el("div", { class: "hubtitle" }, el("div", {}, el("b", {}, "Live table"), el("small", { class: "mono" }, "play one case together, in real time"))), el("div", { class: "row" }, btn("Back", back, "ghost small"))));
    const main = el("main", { class: "hubbody" });
    body.append(main);
    const step = (title, done, ...kids) => el("section", { class: "lvstep cpanel" + (done ? " done" : "") }, el("h3", {}, title), ...kids);
    const N = window.NET;

    /* ---- not at a table yet */
    if (!LIVE.avail) {
      if (!N) main.append(panel("Not available here", el("p", { class: "note" }, "Live tables need the hosted game. Open it from its web address and come back to this screen.")));
      else {
        const inp = el("input", { type: "text", placeholder: "Table code, for example K7M2Q", maxlength: "8", style: { textTransform: "uppercase" } });
        main.append(
          panel("I am the host", el("p", { class: "note" }, "You run the case. Your friends join from their own phones or computers and play their own agents."),
            btn("Start a table", async () => { try { await N.start(); await LIVE.openTable("Live case"); LIVE.screen(); } catch (e) { U.toast("Could not start a table: " + e.message); } }, "primary")),
          panel("I am joining a friend", el("p", { class: "note" }, N.error ? "Could not join: " + N.error : "Type the code your host gave you, or just open the link they sent."),
            inp, btn("Join", () => { if (inp.value.trim()) N.join(inp.value); }, "primary")));
        if (N.relay) {
          const srv = el("input", { type: "url", value: N.relay() || "", placeholder: "https://your-server.onrender.com" });
          main.append(el("details", { class: "lvserver" }, el("summary", {}, `Server: ${N.relay() || "not set"}`),
            el("p", { class: "note" }, "The live table runs through one server. Everyone at the table must use the same one. The game sets this for you; change it only if your group runs its own."),
            srv, el("div", { class: "row" }, btn("Save", () => { N.setRelay(srv.value); U.toast("Server saved."); LIVE.screen(); }, "small"), btn("Use the default", () => { N.setRelay(""); LIVE.screen(); }, "small ghost"))));
        }
      }
      ui.mount(body); return;
    }

    const open = !!(lobby && lobby.status === "open");
    const seated = Object.entries(seats);

    /* ---- host */
    if (LIVE.host) {
      const link = N && N.room ? N.link() : "";
      const linkBox = el("input", { type: "text", readonly: true, value: link, onfocus: (e) => e.target.select() });
      main.append(
        step("Invite your players", open && seated.length > 0,
          N && N.room ? el("div", {}, el("div", { class: "lvcode" }, N.room), el("p", { class: "note" }, "Send this link. They can also open the game and type the code under Live table."), linkBox,
            el("div", { class: "row" }, btn("Copy link", async () => { try { await navigator.clipboard.writeText(link); U.toast("Link copied."); } catch (e) { linkBox.select(); U.toast("Press Ctrl+C to copy."); } }, "small primary"))) : null,
          !open ? el("div", {}, el("p", { class: "warn" }, "The table is closed."), btn("Open the table", async () => { await LIVE.openTable("Live case"); LIVE.screen(); }, "primary")) : null),
        step("Who is at the table", seated.some(([, x]) => !x.done),
          seated.length ? el("div", {}, ...seated.map(([uid, x]) => el("div", { class: "assetrow on" }, el("div", { class: "grow" }, el("b", {}, x.who), el("small", { class: "mono" }, `${(x.ch && x.ch.bg) || ""}${LIVE.away(uid) ? " · away (reconnecting)" : x.ready ? " · ready for the next job" : x.done ? " · between jobs" : " · seated"}`)))),
            el("p", { class: "note" }, "Seated players join your party automatically."))
            : el("p", { class: "note" }, "No one has sat down yet. This list updates by itself."),
          !CAMP.camp ? el("p", { class: "warn" }, "Open a campaign first (Back, then Continue campaign). Players are added to it as they arrive.") : null),
        step("How the table decides", true,
          el("p", { class: "note" }, "This is who makes story choices, picks who tries a check, and clicks things in the scene. Players always control their own agent in combat and on their own rolls."),
          el("div", { class: "lvmode" },
            ...[["vote", "Table vote", "Everyone votes on story choices and the majority wins. On \u201cWho tries?\u201d players step up with their own agent."], ["open", "Everyone", "Anyone can choose. First tap wins."], ["spotlight", "Take turns", "Each choice goes to the next player in order. You can always override."], ["host", "Host only", "Only you choose. Players act with their own agents."]].map(([id, label, hint]) =>
              el("button", { class: "segbtn" + (LIVE.mode === id ? " on" : ""), onclick: async () => { LIVE.mode = id; try { await lobbyRef().update({ mode: id }); } catch (e) {} LIVE.screen(); } }, label, el("small", {}, hint))))),
        LIVE.tableOptions ? LIVE.tableOptions() : null,
        step("Start a case", false,
          CAMP.camp ? el("div", {}, el("p", { class: "note" }, "Pick any case. Everyone seated is already in the party list."), btn("Choose a case", () => { LIVE.screenOpen = false; ui.hub("missions"); }, "primary")) : el("p", { class: "note" }, "Open a campaign first."),
          el("p", { class: "note" }, "When it ends, players press Collect my agent on this screen to take their rewards home.")),
        el("div", { class: "row" }, btn("Close the table", async () => { await LIVE.closeTable(); LIVE.screen(); }, "danger small")));
      if (open && !hosting) startHosting();
      LIVE.syncRoster();
      ui.mount(body); return;
    }

    /* ---- player */
    const mine = seats[LIVE.me];
    const campList = CAMP.list();
    const choices = [];
    for (const c of campList) { const raw = CAMP.peek(c.id); if (raw) for (const ch of raw.chars.filter((x) => x.status === "active" && !x.guest)) choices.push({ camp: c, ch }); }
    const inGame = LIVE.view && LIVE.view.status === "game";
    main.append(
      step("Pick your agent", !!mine,
        !open ? el("p", { class: "note" }, "Waiting for the host to open the table. This screen updates by itself.")
          : mine ? el("p", {}, "You are seated as ", el("b", {}, mine.who), ".  ", btn("Leave my seat", async () => { await LIVE.leaveSeat(); }, "ghost small"))
          : choices.length ? el("div", {}, el("p", { class: "note" }, "Choose which of your agents sits down. They come home with their injuries and rewards after the case."),
              ...choices.map(({ camp, ch }) => el("div", { class: "assetrow" }, el("div", { class: "grow" }, el("b", {}, ch.name), el("small", { class: "mono" }, `${ch.bg || ""} · ${camp.name}`)), btn("Sit down", async () => { await LIVE.takeSeat(camp.id, ch); U.toast(`${ch.name} has taken a seat.`); }, "small primary"))))
          : el("p", { class: "note" }, "You have no active agents on this device. Go back, start a campaign, and make one. Then come back here.")),
      ...(mine && LIVE.campDoc && !LIVE.campDoc.inCase && !inGame ? [step("Between jobs", !!(LIVE.campDoc.party || []).find((p) => p.uid === LIVE.me && p.ready), dtPanel(LIVE.campDoc, (LIVE.campDoc.party || []).find((p) => p.uid === LIVE.me)))] : []),
      step("Watch and play", inGame && !!mine,
        !mine ? el("p", { class: "note" }, "Sit down first.") : inGame ? el("div", {}, el("p", { class: "note" }, "A case is running."), btn("Watch the table", () => LIVE.openMirror(), "primary")) : el("p", { class: "note" }, "Waiting for the host to start a case. The table opens by itself when it begins.")),
      step("Bring your agent home", !!(mine && mine.done),
        mine && mine.done ? el("div", {}, el("p", { class: "note" }, "Collect your agent when you're leaving the table: their rewards, injuries and downtime come home with them. Staying for another case? Don't collect yet."),
          btn("Collect my agent", async () => { const ok = await LIVE.collect(); U.toast(ok ? "Your agent is back in your campaign, changes and all." : "Could not find that campaign on this device."); LIVE.screen(); }, "primary"))
          : el("p", { class: "note" }, "After the case ends, this button appears.")));
    ui.mount(body);
  };

  /* hub and title entry points */
  LIVE.entry = () => { LIVE.screen(); };
  window.addEventListener("load", () => setTimeout(LIVE.init, 400));
  if (document.readyState === "complete") setTimeout(LIVE.init, 400);
})();
