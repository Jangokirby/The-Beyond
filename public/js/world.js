/* ============================================================================
   THE LIVING WORLD — what the campaign remembers between cases.

   Stored on the campaign as c.world:
     standing   agency standing points (ranks below); perks are a house rule,
                off unless c.rules.standingPerks is true
     pull       how hard the Beyond is pressing on the city, 0..10
     threats    things a failed case left loose: { id, adv, name, case, day, grown }
     contacts   people met on cases: { id, adv, npc, name, tag, portrait, attitude, case, day, uses }
     news       newest first, what happened around you between cases

   Nothing here changes a rule from the book. Standing perks are optional and
   say so wherever they appear.
   ========================================================================== */
(function () {
  const C = window.CDATA, U = window.UI, CAMP = window.CAMP, ui = CAMP.ui, el = U.el, A = window.ART;
  const W = (window.WORLD = {});
  const rnd = () => Math.random();
  const pick = (xs) => xs[Math.floor(rnd() * xs.length)];
  const uid = (p) => p + Math.random().toString(36).slice(2, 9);

  /* ------------------------------------------------------------ ranks */
  W.RANKS = [
    { at: 0, name: "Probationary cell", perk: null },
    { at: 6, name: "Recognised cell", perk: "+1 downtime action every break" },
    { at: 15, name: "Trusted cell", perk: "The agency sends a Mundane Favor every break" },
    { at: 28, name: "Senior cell", perk: "The agency's Favor is Quality instead" },
    { at: 45, name: "The agency's first call", perk: "+1 more downtime action every break" }
  ];
  W.rankOf = (pts) => { let i = 0; W.RANKS.forEach((r, k) => { if (pts >= r.at) i = k; }); return i; };
  W.perksOn = () => !!(CAMP.camp && CAMP.camp.rules && CAMP.camp.rules.standingPerks);

  const PULL = ["Quiet", "Quiet", "Uneasy", "Uneasy", "Restless", "Restless", "Bleeding through", "Bleeding through", "Breaking", "Breaking", "Open"];
  W.pullName = (n) => PULL[Math.max(0, Math.min(10, n))];

  /* ------------------------------------------------------------ setup and migration */
  W.ensure = (c = CAMP.camp) => {
    if (!c) return null;
    if (!c.world) c.world = { standing: 0, pull: 2, threats: [], contacts: [], news: [] };
    const w = c.world;
    for (const k of ["threats", "contacts", "news"]) w[k] = w[k] || [];
    delete w.rivals; delete c.genSeeds;   // the rivals chart and the side jobs are gone
    if (w.standing == null) w.standing = 0;
    if (w.pull == null) w.pull = 2;
    return w;
  };
  const migrate0 = CAMP.migrate;
  CAMP.migrate = (c) => { migrate0(c); W.ensure(c); };
  const new0 = CAMP.newCampaign;
  CAMP.newCampaign = function () { const r = new0.apply(this, arguments); W.ensure(CAMP.camp); CAMP.save(); return r; };

  /* ------------------------------------------------------------ news lines */
  const N = {
    threatGrow: ["{t} has been seen again. Closer, this time.", "Someone matching the description of {t} was reported. Nobody followed it up.", "Small things go wrong where {t} was last seen: milk sours, dogs won't settle."],
    threatOpen: ["{t} is still out there. The file stays open on the wall."],
    calm: ["A quiet week. The night shift has nothing to report.", "The city sleeps without dreams for a few nights."],
    restless: ["Three missing-persons reports in one district. None of them are ordinary.", "A church bell rang at 3 a.m. with nobody in the tower.", "Animals are leaving the old quarter."],
    contact: ["{n} sent a note: 'If you need anything, you know where I am.'", "{n} asked after the team. People remember what you did."],
    wary: ["{n} won't return your calls since what happened."]
  };
  const fill = (s, o) => s.replace(/\{(\w)\}/g, (_, k) => o[k] || "");
  const addNews = (w, line) => { w.news.unshift({ day: CAMP.camp.day, line }); w.news = w.news.slice(0, 14); };

  /* ------------------------------------------------------------ after every case */
  const villainOf = (M) => {
    const src = M.src || {};
    const RANK = { easy: 1, medium: 2, challenging: 3, hard: 4, dangerous: 5, deadly: 6 };
    const list = Object.values(src.enemies || {}).map((e) => e.build || e).filter((b) => b && b.name);
    list.sort((x, y) => (RANK[String(y.difficulty).toLowerCase()] || 0) - (RANK[String(x.difficulty).toLowerCase()] || 0));
    return list.length ? list[0].name : M.title;
  };
  W.afterCase = (M, r) => {
    const c = CAMP.camp, w = W.ensure(c), lines = [];
    const before = W.rankOf(w.standing);
    /* standing */
    const second = (M.objectives || []).filter((o) => o.kind === "secondary" && window.GAME && GAME.state && GAME.state.obj && GAME.state.obj[o.id] === "done").length;
    const dead = ((window.GAME && GAME.state && GAME.state.agents) || []).filter((a) => a.dead).length;
    let delta = r.primDone + second + (r.solved ? 2 : -2) - dead;
    w.standing = Math.max(0, w.standing + delta);
    lines.push(`Agency standing ${delta >= 0 ? "+" : ""}${delta} (${w.standing} points).`);
    const after = W.rankOf(w.standing);
    if (after > before) lines.push(`The agency now treats you as a ${W.RANKS[after].name}.${W.RANKS[after].perk ? ` ${W.perksOn() ? "Perk" : "Optional perk (house rule, off)"}: ${W.RANKS[after].perk}.` : ""}`);
    if (after < before) lines.push(`The agency's confidence slips: you are a ${W.RANKS[after].name} again.`);
    /* threats */
    for (const t of w.threats) t.grown = (t.grown || 0) + 1;
    const old = w.threats.find((t) => t.adv === M.id);
    if (r.solved && old) { w.threats = w.threats.filter((t) => t !== old); lines.push(`${old.name} is finished. The file comes off the wall.`); w.pull = Math.max(0, w.pull - 1); }
    else if (!r.solved && !old) {
      const t = { id: uid("t"), adv: M.id, name: villainOf(M), case: M.title, day: c.day, grown: 0 };
      w.threats.unshift(t);
      lines.push(`${t.name} is still out there. It goes on the wall as an open threat.`);
    }
    for (const t of w.threats) if (t.grown && t.grown % 3 === 0) { w.pull = Math.min(10, w.pull + 1); addNews(w, fill(pick(N.threatGrow), { t: t.name })); }
    /* the city */
    w.pull = Math.max(0, Math.min(10, w.pull + (r.solved ? -1 : 1)));
    lines.push(`The pull of the Beyond on the city: ${W.pullName(w.pull)} (${w.pull} of 10).`);
    /* contacts */
    const met = [];
    for (const [id, n] of Object.entries(M.npcs || {})) {
      if (!n || !n.name) continue;
      const key = M.id + ":" + id;
      let k = w.contacts.find((x) => x.id === key);
      const attitude = r.solved ? "friendly" : "wary";
      if (!k) { k = { id: key, adv: M.id, npc: id, name: n.name, tag: n.tag || "", portrait: n.portrait || "", attitude, case: M.title, day: c.day, uses: 0 }; w.contacts.unshift(k); met.push(k.name); }
      else if (r.solved && k.attitude !== "friendly") { k.attitude = "friendly"; met.push(k.name); }
    }
    if (met.length) lines.push(`${r.solved ? "New contacts who owe you" : "People who remember how it went"}: ${met.join(", ")}.`);
    w.contacts = w.contacts.slice(0, 40);
    /* news */
    addNews(w, pick(w.pull >= 5 ? N.restless : N.calm));
    const friend = w.contacts.filter((x) => x.attitude === "friendly");
    if (friend.length && rnd() < 0.5) addNews(w, fill(pick(N.contact), { n: pick(friend).name }));
    return lines;
  };

  /* hook the debrief: world first (it reads the finished mission), then the original */
  const debrief0 = CAMP.debrief;
  CAMP.debrief = function (r) {
    let lines = [];
    try { if (window.MODULE && window.MODULE.id && CAMP.camp && !CAMP.playtest) lines = W.afterCase(window.MODULE, r); } catch (e) { console.warn("world", e); }
    W._pending = lines;
    return debrief0.apply(this, arguments);
  };
  const uiDebrief0 = ui.debrief;
  ui.debrief = function (out) {
    out.world = [...(out.world || []), ...(W._pending || [])]; W._pending = null;
    let bonus = 0;
    if (out.world.length && W.perksOn() && CAMP.camp && CAMP.camp.world) {
      const rk = W.rankOf(CAMP.camp.world.standing);
      if (rk >= 2) { CAMP.camp.favors.push({ wc: rk >= 3 ? 3 : 2, from: "Agency standing" }); out.world.push(`Standing perk (house rule): the agency sends a ${rk >= 3 ? "Quality" : "Mundane"} Favor.`); }
      bonus = (rk >= 1 ? 1 : 0) + (rk >= 4 ? 1 : 0);
    }
    const res = uiDebrief0.apply(this, arguments);
    if (bonus && window.HIDE) { for (const a of CAMP.active()) { const d = HIDE.dt(a); d.left += bonus; d.max += bonus; } CAMP.save(); }
    return res;
  };

  /* a contact's name in "Work contacts": same rules effect, a person you know */
  if (window.HIDE && HIDE.apply) {
    const apply0 = HIDE.apply;
    HIDE.apply = function (a, act) {
      const spec = apply0.apply(this, arguments);
      const w = W.ensure();
      if (act === "contacts" && spec && w) {
        const f = w.contacts.filter((x) => x.attitude === "friendly");
        if (f.length) { const k = pick(f); k.uses = (k.uses || 0) + 1; spec.lines = (spec.lines || []).concat(`${k.name} (${k.case}) made the call for you.`); }
      }
      return spec;
    };
  }

  /* ------------------------------------------------------------ the wall (top of the case board) */
  const portraitSrc = (k) => {
    if (k.portrait && !(window.ASSETS.portraits || {})[k.portrait] && k.adv && window.ADV && ADV.get) { try { ADV.get(k.adv); } catch (e) {} }
    return U.img(k.portrait, "portraits");
  };
  W.wall = () => {
    const c = CAMP.camp, w = W.ensure(c), rk = W.rankOf(w.standing), next = W.RANKS[rk + 1];
    const ag = CAMP.agency();
    const pin = (cls, ...kids) => el("div", { class: "wpin " + cls }, el("i", { class: "tack" }), ...kids);
    const meter = el("div", { class: "pullbar", title: `${w.pull} of 10` }, ...Array.from({ length: 10 }, (_, i) => el("i", { class: i < w.pull ? "on" + (i >= 6 ? " hot" : "") : "" })));
    const standing = pin("standing",
      el("h4", {}, `${ag.short} standing`),
      el("b", { class: "wbig" }, W.RANKS[rk].name),
      el("div", { class: "wprog" }, el("i", { style: { width: next ? Math.round(((w.standing - W.RANKS[rk].at) / (next.at - W.RANKS[rk].at)) * 100) + "%" : "100%" } })),
      el("small", {}, next ? `${w.standing} point${w.standing === 1 ? "" : "s"} · ${next.at - w.standing} to ${next.name}` : `${w.standing} points · the highest rank`),
      el("label", { class: "wperk" }, el("input", { type: "checkbox", checked: W.perksOn() ? "checked" : null, onchange: (e) => { c.rules.standingPerks = e.target.checked; CAMP.save(); ui.hub("missions"); } }),
        el("span", {}, "Use standing perks (house rule, not in the book)")),
      W.perksOn() && W.RANKS.slice(1, rk + 1).length ? el("ul", { class: "wlist small" }, ...W.RANKS.slice(1, rk + 1).map((r) => el("li", {}, r.perk))) : null);
    const pull = pin("pull", el("h4", {}, "The pull of the Beyond"), el("b", { class: "wbig" }, W.pullName(w.pull)), meter,
      el("small", {}, "Solved cases push it back. Failures and loose threats let it grow."));
    const threats = pin("threats", el("h4", {}, "Open threats"),
      w.threats.length ? el("ul", { class: "wlist" }, ...w.threats.map((t) => el("li", {}, el("b", {}, t.name), el("small", {}, ` from ${t.case}, day ${t.day}${t.grown >= 3 ? " · growing" : ""}`))))
        : el("small", {}, "Nothing loose. A case you fail stays here until you go back and solve it."));
    const people = pin("contacts", el("h4", {}, `Contacts (${w.contacts.length})`),
      w.contacts.length ? el("div", { class: "wfaces" }, ...w.contacts.slice(0, 12).map((k) => el("div", { class: "wface " + k.attitude, title: `${k.name}${k.tag ? ", " + k.tag : ""} · ${k.case} · ${k.attitude}` },
        el("img", { src: portraitSrc(k), alt: "" }), el("small", {}, k.name.split(" ").slice(-1)[0]))))
        : el("small", {}, "People you help on cases end up here, and they remember."));
    const news = pin("news", el("h4", {}, "Around town"),
      w.news.length ? el("ul", { class: "wlist" }, ...w.news.slice(0, 5).map((n) => el("li", {}, el("small", { class: "mono" }, `Day ${n.day} `), n.line)))
        : el("small", {}, "News arrives after your first case."));
    return el("section", { class: "wall", "aria-label": "The wall" }, standing, pull, threats, people, news);
  };

  if (ui.tabs && ui.tabs.missions) {
    const missions0 = ui.tabs.missions;
    ui.tabs.missions = function () { const box = missions0.apply(this, arguments); try { box.prepend(W.wall()); } catch (e) { console.warn("wall", e); } return box; };
  }

  /* standing on the hideout's day sign */
  if (window.HIDE && HIDE.tab) {
    const tab0 = HIDE.tab;
    HIDE.tab = function () {
      const box = tab0.apply(this, arguments);
      const w = W.ensure(), sign = box.querySelector(".hday");
      if (w && sign) sign.append(el("span", { class: "hrank" }, `${W.RANKS[W.rankOf(w.standing)].name} · ${W.pullName(w.pull)}`));
      return box;
    };
    if (ui.tabs) ui.tabs.hideout = HIDE.tab;
  }
})();
