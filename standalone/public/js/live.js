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
  LIVE.actor = () => { for (let i = LIVE.stack.length - 1; i >= 0; i--) { const a = LIVE.stack[i]; if (a) return a.ownerUid || "host"; } return "host"; };

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
    unsubs.push(lobbyRef().onSnapshot((s) => { lobby = s.exists ? s.data() : null; LIVE.redraw(); }, () => {}));
    unsubs.push(seatsCol().onSnapshot((q) => { seats = {}; for (const d of q.docs) seats[d.id] = d.data(); LIVE.redraw(); }, () => {}));
    unsubs.push(viewRef().onSnapshot((s) => { LIVE.view = s.exists ? s.data() : null; LIVE.onView(); }, () => {}));
  }
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
    return html;
  }

  async function push() {
    if (!hosting || !db) return;
    if (writing) { dirty = true; return; }
    const html = serialize();
    const status = html === null ? "camp" : "game";
    const key = status + "|" + (html || "") + "|" + LIVE.actor();
    if (key === lastHtml) return;
    lastHtml = key;
    writing = true;
    try {
      LIVE.seq += 1;
      await viewRef().set({ seq: LIVE.seq, status, html: html && html.length < 250000 ? html : "", actor: LIVE.actor(), t: Date.now(), title: (lobby && lobby.title) || "" });
    } catch (e) { /* a dropped frame is fine, the next change sends another */ }
    writing = false;
    if (dirty) { dirty = false; schedule(); }
  }

  /* apply a tap that arrived from a player */
  const lastN = {};
  function onInput(q) {
    for (const ch of q.docChanges()) {
      if (ch.type === "removed") continue;
      const uid = ch.doc.id, d = ch.doc.data() || {};
      if ((lastN[uid] || 0) >= d.n) continue;
      lastN[uid] = d.n;
      if (d.seq !== LIVE.seq || LIVE.actor() !== uid) continue;     // not their turn, or they tapped a stale screen
      const n = document.querySelector(`#screen-game [data-k="${+d.k}"], #overlay [data-k="${+d.k}"]`);
      if (!n || n.disabled) continue;
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
    await lobbyRef().set({ host: LIVE.me, title: title || "Live case", status: "open", t: Date.now() });
    hosting = true; startHosting();
  };
  let obs = null, inUnsub = null;
  function startHosting() {
    hosting = true;
    if (!obs) {
      obs = new MutationObserver(schedule);
      obs.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["class", "style", "disabled", "hidden", "src", "aria-selected"] });
      document.addEventListener("input", schedule, true);
    }
    if (!inUnsub) inUnsub = inCol().onSnapshot(onInput, () => {});
    schedule();
  }
  LIVE.closeTable = async () => {
    hosting = false; if (obs) { obs.disconnect(); obs = null; } if (inUnsub) { inUnsub(); inUnsub = null; }
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
    frame = el("iframe", { style: { flex: "1", border: "0", width: "100%", background: "#0b0a0c" }, title: "The table" });
    shell.append(bar, frame);
    document.body.append(shell);
    frame.addEventListener("load", wireFrame);
    frame.srcdoc = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><base href="${document.baseURI}">`
      + `<link rel="stylesheet" href="css/game.css"><link rel="stylesheet" href="css/camp.css"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Dela+Gothic+One&family=Shippori+Mincho:wght@400;600;700;800&display=swap">`
      + `<style>body{margin:0}.screen[hidden]{display:none}#overlay[hidden]{display:none}</style></head><body><div id="mirror"></div></body></html>`;
    lastSeq = -1;
  };
  LIVE.closeMirror = () => { if (shell) { shell.remove(); shell = frame = bar = null; } };

  let netN = 0;
  const myTurn = () => LIVE.view && LIVE.view.actor === LIVE.me;
  function send(d) {
    if (!db) return;
    if (!myTurn()) { flashBar("Not your turn."); return; }
    netN += 1;
    db.doc("live/lobby/in/" + LIVE.me).set({ n: Date.now() * 10 + (netN % 10), seq: LIVE.view.seq, ...d }).catch(() => {});
  }
  function flashBar(t) { if (!bar) return; const f = bar.querySelector(".lvflash"); if (f) { f.textContent = t; setTimeout(() => { f.textContent = ""; }, 1500); } }
  function wireFrame() {
    const d = frame.contentDocument; if (!d) return;
    d.addEventListener("click", (e) => {
      const n = e.target.closest && e.target.closest("[data-k]");
      if (!n || n.disabled) return;
      if (n.tagName === "INPUT" && (n.type === "checkbox" || n.type === "radio")) return;   // the change event carries these
      if (n.tagName === "INPUT" || n.tagName === "TEXTAREA" || n.tagName === "SELECT") return;
      e.preventDefault(); e.stopPropagation();
      send({ k: +n.getAttribute("data-k"), op: "click" });
    }, true);
    d.addEventListener("change", (e) => {
      const n = e.target.closest && e.target.closest("[data-k]"); if (!n) return;
      const v = n.type === "checkbox" || n.type === "radio" ? n.checked : n.value;
      send({ k: +n.getAttribute("data-k"), op: "set", v });
    }, true);
    LIVE.onView();
  }
  LIVE.onView = () => {
    const v = LIVE.view;
    if (LIVE.screenOpen) LIVE.redraw();
    if (!shell) { if (v && v.status === "game" && seats[LIVE.me] && !LIVE.host) LIVE.openMirror(); return; }
    if (!v || v.status === "closed") { LIVE.closeMirror(); U.toast("The table has closed."); return; }
    const who = v.actor === LIVE.me ? "Your turn" : v.actor === "host" ? "The host is deciding" : "Another player is acting";
    bar.replaceChildren(el("b", { class: v.actor === LIVE.me ? "lvyou" : "" }, v.status === "game" ? who : "Between scenes: the host is in camp."), el("span", { class: "lvflash" }), el("button", { class: "btn small ghost", onclick: () => LIVE.closeMirror() }, "Leave view"));
    const d = frame && frame.contentDocument;
    if (!d || !d.body || v.seq === lastSeq || v.status !== "game" || !v.html) return;
    lastSeq = v.seq;
    const m = d.getElementById("mirror"); if (!m) return;
    const keep = {}; for (const id of ["story", "panel", "scene"]) { const n = d.getElementById(id); if (n) keep[id] = { top: n.scrollTop, bottom: n.scrollHeight - n.scrollTop - n.clientHeight < 60 }; }
    m.innerHTML = v.html;
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
    if (!LIVE.avail) {
      {
        const N = window.NET;
        if (!N) main.append(panel("Not available here", el("p", { class: "note" }, "Live tables need the hosted game. Open it from its web address and come back to this screen.")));
        else {
          const inp = el("input", { type: "text", placeholder: "Table code, e.g. K7M2Q", maxlength: "8", style: { textTransform: "uppercase" } });
          main.append(panel("Host a table", el("p", { class: "note" }, "Start a table, then send the link to your players. You run the case; they join from their own devices with their own agents."),
            btn("Host a new table", async () => { try { await N.start(); LIVE.screen(); } catch (e) { U.toast("Could not start a table: " + e.message); } }, "primary")),
            panel("Join a table", el("p", { class: "note" }, N.error ? "Could not join: " + N.error : "Got a code or link from your host? Enter the code here, or just open their link."),
              inp, btn("Join", () => { if (inp.value.trim()) N.join(inp.value); }, "primary")));
        }
      }
      ui.mount(body); return;
    }
    const open = lobby && lobby.status === "open";
    /* ---- host */
    if (LIVE.host) {
      const rows = Object.entries(seats).map(([uid, s]) => {
        const here = CAMP.camp && CAMP.camp.chars.find((c) => c.ownerUid === uid);
        return el("div", { class: "assetrow" + (here ? " on" : "") }, el("div", { class: "grow" }, el("b", {}, s.who), el("small", { class: "mono" }, `${(s.ch && s.ch.bg) || ""}${s.done ? " · case finished, waiting to be collected" : ""}`)),
          el("div", { class: "row tight" },
            CAMP.camp && !here ? btn("Add to my roster", () => { LIVE.importSeat(uid); U.toast(`${s.who} can now be picked for a case.`); LIVE.screen(); }, "small primary") : null,
            here ? btn("Remove from roster", () => { CAMP.camp.chars = CAMP.camp.chars.filter((c) => c !== here); CAMP.save(); LIVE.screen(); }, "small ghost") : null));
      });
      main.append(panel("You are the host",
        el("p", { class: "note" }, "You run the case on your own screen exactly as always. Everyone at the table watches it live, and when it is one of their agents' turn, they play it from their own device."),
        open ? el("div", {}, el("p", {}, el("b", {}, lobby.title), " is open. Players can take a seat now."),
          window.NET && window.NET.room ? el("div", { class: "cnote" }, "Table code ", el("b", {}, window.NET.room), ". Send players this link: ", el("input", { type: "text", readonly: true, value: window.NET.link(), onfocus: (e) => e.target.select() })) : null,
          rows.length ? el("div", {}, ...rows) : el("p", { class: "note" }, "No one has taken a seat yet."),
          !CAMP.camp ? el("p", { class: "warn" }, "Open or start a campaign first (Back, then Continue campaign), then come back here to add your players' agents to your roster.") : el("p", { class: "note" }, "Add each player's agent to your roster, then start the case from Missions and pick them in the party."),
          btn("Close the table", async () => { await LIVE.closeTable(); LIVE.screen(); }, "danger small"))
          : el("div", {}, btn("Open a table", async () => { await LIVE.openTable("Live case"); LIVE.screen(); }, "primary"))));
      if (open && !hosting) startHosting();
    }
    /* ---- player */
    const mine = seats[LIVE.me];
    const campList = CAMP.list();
    const choices = [];
    for (const c of campList) { const raw = CAMP.peek(c.id); if (raw) for (const ch of raw.chars.filter((x) => x.status === "active" && !x.guest)) choices.push({ camp: c, ch }); }
    main.append(panel(LIVE.host ? "Or play as a player too" : "Join a table",
      !open ? el("p", { class: "note" }, "No table is open right now. When your host opens one, this screen will update by itself.") : null,
      open && mine ? el("div", {}, el("p", {}, `You are seated as `, el("b", {}, mine.who), "."),
        el("div", { class: "row" },
          LIVE.view && LIVE.view.status === "game" && !LIVE.host ? btn("Watch the table", () => LIVE.openMirror(), "primary") : null,
          mine.done ? btn("Collect my agent", async () => { const ok = await LIVE.collect(); U.toast(ok ? "Your agent is back in your campaign, changes and all." : "Could not find that campaign on this device."); LIVE.screen(); }, "primary") : null,
          btn("Leave my seat", async () => { await LIVE.leaveSeat(); }, "ghost small"))) : null,
      open && !mine ? (choices.length ? el("div", {}, el("p", { class: "note" }, "Pick which of your agents sits down. They go home with their injuries, rewards and everything else when the case ends."),
        ...choices.map(({ camp, ch }) => el("div", { class: "assetrow" }, el("div", { class: "grow" }, el("b", {}, ch.name), el("small", { class: "mono" }, `${ch.bg || ""} · ${camp.name}`)), btn("Take this seat", async () => { await LIVE.takeSeat(camp.id, ch); U.toast(`${ch.name} has taken a seat.`); }, "small primary"))))
        : el("p", { class: "note" }, "You have no active agents on this device. Make one in a campaign first.")) : null));
    ui.mount(body);
  };

  /* hub and title entry points */
  LIVE.entry = () => { LIVE.screen(); };
  window.addEventListener("load", () => setTimeout(LIVE.init, 400));
  if (document.readyState === "complete") setTimeout(LIVE.init, 400);
})();
