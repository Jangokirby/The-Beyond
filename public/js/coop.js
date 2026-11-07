/* ============================================================================
   CO-OP DEPTH — on top of the live table (live.js).

   Your own screen: every seated player gets a "My agent" drawer beside the
     shared view: their sheet, Focus, gear, and their private notes.
   Private discoveries (table option, on by default): when a player's agent
     examines something, what they find goes only to that player. The table
     sees that they looked. They choose when to share it, and only then does
     the clue go in the shared case file.
   Hallucinations: an agent below half Sanity sometimes sees things only their
     player is told about. Flavour only, never a rule.
   Reconnecting: players check in every 15 s; the host marks anyone silent for
     45 s as away (votes stop waiting for them) and they pick up where they
     left off when they're back.
   Turn timer: an optional time limit on table votes (live.js).
   ========================================================================== */
(function () {
  const LIVE = window.LIVE, G = window.GAME, U = window.UI, CAMP = window.CAMP, el = U.el;
  if (!LIVE) return;
  const CO = (window.COOP = {});
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const strip = (h) => { const d = document.createElement("div"); d.innerHTML = h; return d.textContent || ""; };
  const lobby = () => (LIVE.lobby && LIVE.lobby()) || {};
  CO.secrets = () => lobby().secrets !== false;

  /* ================================================================ host side */
  const isRemote = (a) => a && a.ownerUid && LIVE.hosting && LIVE.hosting() && LIVE.seat(a.ownerUid);
  const priv = () => { G.state.priv = G.state.priv || {}; return G.state.priv; };
  const inbox = (uid) => (priv()[uid] = priv()[uid] || { n: 0, items: [] });
  const note = (uid, item) => { const b = inbox(uid); b.n += 1; b.items.push({ id: b.n, at: Date.now(), ...item }); b.items = b.items.slice(-30); CO.pushSoon(); };

  /* while a remote player's agent examines something, the findings are theirs */
  const api = G.api, narrate0 = api.narrate, clue0 = api.clue;
  let finding = null;   // { uid, agent, texts:[], clues:[], told }
  const privateNow = () => {
    if (!CO.secrets() || !G._actor || G._actorKind !== "look") return null;
    const a = G.agentById(G._actor); if (!isRemote(a)) return null;
    if (!finding || finding.agent !== a.id) finding = { uid: a.ownerUid, agent: a.id, short: a.short, texts: [], clues: [], told: false };
    return finding;
  };
  api.narrate = async function (t) {
    const f = privateNow(); if (!f) return narrate0.apply(this, arguments);
    f.texts.push(t);
    if (!f.told) { f.told = true; U.print(`<b>${esc(f.short)}</b> takes a closer look. What they find is theirs to share.`, "narr private-note"); await U.waitContinue(); }
  };
  api.clue = function (id) {
    const f = privateNow(); if (!f) return clue0.apply(this, arguments);
    if (G.state.clues.includes(id) || f.clues.includes(id)) return false;
    f.clues.push(id); return true;
  };
  /* the action ends: file the findings with the player */
  const use0 = G.useHotspot;
  G.useHotspot = function (h) {
    const r = use0.apply(this, arguments);
    const wait = setInterval(() => {
      if (G.busy) return; clearInterval(wait);
      if (finding && (finding.texts.length || finding.clues.length)) {
        const M = window.MODULE;
        note(finding.uid, { kind: "find", title: h.label, texts: finding.texts, clues: finding.clues, clueText: finding.clues.map((c) => (M.clues[c] || {}).t || c), shared: false });
      }
      finding = null;
    }, 200);
    return r;
  };
  /* sharing: the player says "tell the table" */
  LIVE.ops = LIVE.ops || {};
  LIVE.ops.share = (uid, d) => {
    const b = inbox(uid), it = b.items.find((x) => x.id === +d.id);
    if (!it || it.shared || it.kind !== "find") return;
    it.shared = true;
    const who = (LIVE.seat(uid) && LIVE.seat(uid).who) || "A player";
    U.print(`<b>${esc(who.split(" ")[0])}</b> shares what they found at <i>${esc(it.title)}</i>:`, "narr");
    for (const t of it.texts) U.print(t, "narr");
    for (const c of it.clues) clue0.call(api, c);
    G.save(); G.refreshParty && G.refreshParty();
    if (!G.busy) { G.renderHotspots(); G.showIdle(); }
    CO.pushSoon();
  };

  /* hallucinations: only the player hears about them */
  const VISIONS = [
    "Someone is standing behind the others. When you look straight at them, there's no one.",
    "You hear your name, whispered, from the next room. Nobody else turns their head.",
    "For a second the walls are breathing. Then they're only walls.",
    "A face in the window, pressed to the glass. It mouths something. It's gone.",
    "Your hands are wet. When you look, they're dry.",
    "You smell smoke. No one else does.",
    "One of your friends just smiled at you with too many teeth. Now they look normal.",
    "There's writing on the floor in a hand you know. When you crouch to read it, it's a crack in the boards.",
    "The clock on the wall is running backward. Nobody mentions it.",
    "A child laughs somewhere very close. You're the only one who flinches."
  ];
  const goto0 = G.goto;
  G.goto = async function () {
    const r = await goto0.apply(this, arguments);
    try {
      if (CO.secrets() && G.state && G.state.phase !== "ending") for (const a of G.state.agents || []) {
        if (!isRemote(a) || a.dead) continue;
        const s = a.pools.sanity; if (s.cur / s.max >= 0.5 || Math.random() > 0.3) continue;
        note(a.ownerUid, { kind: "vision", text: VISIONS[Math.floor(Math.random() * VISIONS.length)] });
      }
    } catch (e) {}
    return r;
  };

  /* publish each seated player's own page: live/me/<uid> */
  const lastMe = {};
  let pushT = 0;
  CO.pushSoon = () => { clearTimeout(pushT); pushT = setTimeout(CO.pushMe, 400); };
  CO.pushMe = async () => {
    const db = LIVE.db && LIVE.db(); if (!db || !LIVE.host || !LIVE.hosting || !LIVE.hosting()) return;
    const seats = LIVE.seats ? LIVE.seats() : {};
    const inGame = !!(G.state && G.state.agents && document.querySelector("#screen-game") && !document.querySelector("#screen-game").hidden);
    for (const uid of Object.keys(seats)) {
      let me = { at: 0, inGame };
      const a = inGame ? G.state.agents.find((x) => x.ownerUid === uid) : null;
      if (a) {
        const f = window.FOCUS && FOCUS.on() ? FOCUS.get(a) : null;
        me = { inGame, name: a.name, short: a.short, src: U.img(a.portrait, "portraits"), dead: !!a.dead,
          pools: Object.fromEntries(["health", "sanity", "stability"].map((k) => [k, { cur: a.pools[k].cur, max: a.pools[k].max }])),
          fate: a.fate || 0, focus: f ? { cur: f.cur, max: f.max } : null,
          statuses: (a.statuses || []).map((s) => s.label || s.id),
          gear: [a.weapon && a.weapon.name, a.armor && a.armor.name, ...((a.items || []).map((i) => (window.MODULE.items[i] || {}).name || i))].filter(Boolean).slice(0, 12),
          aspects: window.R ? Object.fromEntries(Object.keys(R.ASPECT_LABEL).map((k) => [R.ASPECT_LABEL[k], R.aspect(a, k)])) : {},
          inbox: inbox(uid).items, secrets: CO.secrets() };
      }
      const j = JSON.stringify(me);
      if (lastMe[uid] === j) continue;
      lastMe[uid] = j;
      try { await db.doc("live/me/" + uid).set(me); } catch (e) {}
    }
  };
  setInterval(() => { if (LIVE.host && LIVE.hosting && LIVE.hosting()) CO.pushMe(); }, 1500);

  /* the host's switches */
  LIVE.tableOptions = () => {
    const lb = lobby(), db = LIVE.db && LIVE.db();
    const set = async (k, v) => { try { await db.doc("live/lobby").update({ [k]: v }); } catch (e) {} };
    return el("section", { class: "lvstep cpanel done" }, el("h3", {}, "Table options"),
      el("label", { class: "wperk" }, el("input", { type: "checkbox", checked: lb.secrets !== false ? "checked" : null, onchange: (e) => set("secrets", e.target.checked) }),
        el("span", {}, "Private discoveries: what a player's agent finds goes to that player first, and they choose when to share it.")),
      el("label", { class: "field inline" }, el("span", {}, "Time limit on table votes"),
        el("select", { onchange: (e) => set("timer", +e.target.value) }, ...[0, 30, 60, 90, 120].map((n) => el("option", { value: String(n), selected: (+lb.timer || 0) === n ? "selected" : null }, n ? `${n} seconds` : "No limit")))));
  };

  /* ================================================================ player side */
  let meDoc = null, meUnsub = null, drawer = null, seen = 0;
  const myKey = () => "beyond.seen." + ((window.NET && NET.room) || "");
  try { seen = +localStorage.getItem(myKey()) || 0; } catch (e) {}
  CO.watchMe = () => {
    const db = LIVE.db && LIVE.db(); if (!db || LIVE.host || meUnsub || !LIVE.me) return;
    meUnsub = db.doc("live/me/" + LIVE.me).onSnapshot((s) => { meDoc = s.exists ? s.data() : null; CO.drawBadge(); if (drawer && !drawer.hidden) CO.drawDrawer(); }, () => {});
  };
  /* heartbeat: tells the host we're still here */
  setInterval(() => {
    const db = LIVE.db && LIVE.db();
    if (!db || LIVE.host || !LIVE.me || !LIVE.seat(LIVE.me)) return;
    db.doc("live/lobby/seats/" + LIVE.me).update({ seen: Date.now() }).catch(() => {});
    CO.watchMe();
  }, 15000);
  const unread = () => ((meDoc && meDoc.inbox) || []).filter((x) => x.id > seen).length;
  CO.drawBadge = () => {
    const b = document.querySelector(".livebar .mybtn"); if (!b) return;
    const n = unread(); b.querySelector("i").textContent = n ? String(n) : ""; b.classList.toggle("ping", n > 0);
    const st = document.querySelector(".livebar .lvnet"); if (st) { const on = !window.NET || NET.status === "on"; st.hidden = on; }
  };
  CO.drawDrawer = () => {
    if (!drawer) return;
    const m = meDoc;
    const body = [];
    if (!m || !m.name) body.push(el("p", { class: "note" }, m && m.inGame === false ? "Between cases. Your agent's file is on the main screen." : "Your agent isn't in this scene yet."));
    else {
      const seat = LIVE.seat(LIVE.me), mine = seat && seat.ch && seat.ch.look && window.ART ? U.img(ART.portrait(seat.ch.look), "portraits") : "";
      body.push(el("div", { class: "mycard" }, el("img", { src: (m.src && m.src.length > 4 ? m.src : "") || mine, alt: "", onerror: (e) => { if (mine && e.target.src !== mine) e.target.src = mine; } }), el("div", {}, el("b", {}, m.name), el("small", {}, `Fate ${"◆".repeat(m.fate) || "none"}${m.dead ? " · dead" : ""}`)),
        el("div", { class: "pools" }, ...["health", "sanity", "stability"].map((k) => CAMP.ui.bar(m.pools[k], k)))));
      if (m.focus) body.push(el("p", { class: "myfocus" }, "Focus ", ...Array.from({ length: m.focus.max }, (_, i) => el("i", { class: i < m.focus.cur ? "on" : "" })), ` ${m.focus.cur} of ${m.focus.max}`));
      if (m.statuses && m.statuses.length) body.push(el("p", { class: "note" }, "Status: " + m.statuses.join(", ")));
      body.push(el("details", {}, el("summary", {}, "Aspects and gear"), el("div", { class: "myasp" }, ...Object.entries(m.aspects || {}).map(([k, v]) => el("span", {}, `${k} ${v}`))), el("p", { class: "note" }, (m.gear || []).join(" · "))));
      const items = (m.inbox || []).slice().reverse();
      body.push(el("h4", {}, "Only you know"));
      if (!items.length) body.push(el("p", { class: "note" }, m.secrets ? "When your agent examines something, what they find appears here first. Share it with the table when you're ready." : "The host has private discoveries switched off: everything is shared."));
      for (const it of items) {
        if (it.kind === "vision") body.push(el("div", { class: "myitem vision" + (it.id > seen ? " new" : "") }, el("small", {}, "Something only you saw"), el("p", {}, it.text)));
        else body.push(el("div", { class: "myitem" + (it.id > seen ? " new" : "") + (it.shared ? " shared" : "") }, el("small", {}, `What you found: ${it.title}`),
          ...it.texts.map((t) => el("p", {}, strip(t))),
          it.clueText.length ? el("p", { class: "myclue" }, "Clue: " + it.clueText.join(", ")) : null,
          it.shared ? el("small", { class: "ok" }, "Shared with the table") : CAMP.ui.btn("Tell the table", () => CO.share(it.id), "small primary")));
      }
    }
    drawer.replaceChildren(el("div", { class: "myhead" }, el("b", {}, "My agent"), CAMP.ui.btn("Close", () => { drawer.hidden = true; }, "small ghost")), ...body.filter(Boolean));
    if (!drawer.hidden && meDoc && meDoc.inbox && meDoc.inbox.length) { seen = Math.max(seen, ...meDoc.inbox.map((x) => x.id)); try { localStorage.setItem(myKey(), String(seen)); } catch (e) {} CO.drawBadge(); }
  };
  CO.share = (id) => {
    const db = LIVE.db && LIVE.db(); if (!db) return;
    db.doc("live/lobby/in/" + LIVE.me).set({ n: Date.now() * 10 + Math.floor(Math.random() * 10), op: "share", id }).then(() => U.toast("Shared with the table.")).catch(() => U.toast("Could not reach the table."));
  };
  /* add the button and drawer to the player's shared view */
  const open0 = LIVE.openMirror;
  LIVE.openMirror = function () {
    const r = open0.apply(this, arguments);
    const bar = document.querySelector(".livebar");
    if (bar && !bar.querySelector(".mybtn") && !LIVE.host) {
      bar.prepend(el("button", { class: "btn small mybtn", onclick: () => { drawer.hidden = !drawer.hidden; if (!drawer.hidden) CO.drawDrawer(); } }, "My agent ", el("i", {})),
        el("span", { class: "lvnet", hidden: true }, "Reconnecting…"));
      drawer = el("aside", { class: "mydrawer", hidden: true });
      bar.parentNode.append(drawer);
      CO.watchMe(); CO.drawBadge();
    }
    return r;
  };
  setInterval(() => { if (!LIVE.host) CO.drawBadge(); }, 2000);
})();
