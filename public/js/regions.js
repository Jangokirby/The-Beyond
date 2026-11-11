/* ============================================================================
   TIME AND PLACE — how the job board works.
   A job has a TIME (its year, so its era) and a PLACE (its region of the world).
     - Any agency that exists in the job's year can be assigned it; the agency
       that usually takes it (case.agencies) is the lead, and a team from another
       agency goes as a joint operation. OID, the oldest, can work in any year.
     - The board shows the era you are in, then the regions that have jobs in it.
       Your team is somewhere (c.region). A job elsewhere means travelling: a
       short, era-accurate journey that takes days. The agency pays for it and
       supplies what a team needs on the road.
   ========================================================================== */
(function () {
  const CAMP = window.CAMP, U = window.UI, C = window.CDATA, el = U.el, ui = CAMP.ui;
  if (!CAMP || !ui || !C) return;
  const btn = ui.btn, panel = ui.panel, note = ui.note;
  const pick = (a) => a[Math.floor(Math.random() * a.length)];

  /* where the game's own cases happen */
  const WHERE = {
    "death-of-a-bloodline": "asia-east", "night-train-aomori": "asia-east", "signal-drift": "asia-east", "quiet-hours": "asia-east",
    "last-picture-show": "americas-north", "black-roller": "americas-north", "lantern-on-the-water": "americas-north",
    "da-1-channel": "americas-north", "da-2-rewind": "americas-north", "da-3-signoff": "americas-north"
  };
  CAMP.regionOfCase = (m) => (m && (m.region || WHERE[m.id])) || "europe";
  CAMP.homeRegion = (agencyId) => ((C.AGENCIES.find((a) => a.id === agencyId) || {}).region) || "europe";

  /* any agency that exists in the case's year can take it (a case may name `only` to restrict it) */
  CAMP.canTake = (m, agencyId) => {
    const ag = C.AGENCIES.find((a) => a.id === agencyId);
    return !!ag && ag.founded <= m.year && (!m.only || m.only.includes(agencyId));
  };
  CAMP.isLead = (m, agencyId) => (m.agencies || []).includes(agencyId);

  /* the team's location */
  const migrate0 = CAMP.migrate;
  CAMP.migrate = (c) => { migrate0(c); if (!c.region) c.region = CAMP.homeRegion(c.agency); };
  const new0 = CAMP.newCampaign;
  CAMP.newCampaign = function () { const r = new0.apply(this, arguments); if (CAMP.camp && !CAMP.camp.region) CAMP.camp.region = CAMP.homeRegion(CAMP.camp.agency); return r; };
  const start0 = CAMP.startMission;
  CAMP.startMission = async function (advId) {
    const r = await start0.apply(this, arguments);
    const m = CAMP.advMeta(advId);
    if (CAMP.camp && m) { CAMP.camp.region = CAMP.regionOfCase(m); CAMP.save(); }
    return r;
  };

  /* ------------------------------------------------------------ travel */
  CAMP.travelDays = (from, to, year) => {
    const era = C.artEra(year || CAMP.camp.year), base = C.regionDays(from, to);
    if (!base) return 0;
    return Math.max(1, Math.round(base * ((C.TRAVEL[era] || C.TRAVEL.modern).mult)));
  };
  /* the journey: a short screen, then the days pass and the team is there */
  ui.travel = (to, then) => new Promise((resolve) => {
    const c = CAMP.camp, from = c.region || CAMP.homeRegion(c.agency), era = C.artEra(c.year), T = C.TRAVEL[era] || C.TRAVEL.modern;
    const days = CAMP.travelDays(from, to, c.year), ag = CAMP.agency(), rf = C.regionOf(from), rt = C.regionOf(to);
    const OCEAN = new Set(["europe|americas-north", "europe|americas-south", "africa-me|americas-north", "africa-me|americas-south", "asia-east|americas-north", "asia-east|americas-south", "asia-south|americas-north", "asia-south|americas-south"]);
    const sea = from === "oceania" || to === "oceania" || OCEAN.has(from + "|" + to) || OCEAN.has(to + "|" + from);
    const how = pick(T.how);
    const lines = [
      `The ${ag.short} books it: ${how}.`,
      `${rf.name} to ${rt.name}. ${days} day${days === 1 ? "" : "s"} on the road.`,
      era === "medieval" ? "The order's lay brothers carry the purse, the relics and the letters of passage."
        : era === "victorian" || era === "wars" ? "Tickets, lodgings and a trunk of what the team needs are waiting at every stop. The agency's name is never spoken."
          : era === "atomic" || era === "modern" ? "Tickets, a hotel and a case of the usual are waiting at every stop. Everything is on the agency."
            : "Tickets, a room and a sealed case of kit are waiting at every stop. The agency covers all of it."
    ];
    AudioMan.music("hideout");
    const go = () => { for (const a of CAMP.active()) a.travelled = (a.travelled || 0) + 1; c.region = to; const notes = CAMP.passDays(days); CAMP.logAdd(`Travelled to ${rt.name} (${days} day${days === 1 ? "" : "s"}).`); CAMP.save(); resolve(true); if (then) then(notes); };
    const body = el("div", { class: "cwrap travel" },
      el("p", { class: "eyebrow" }, `${rf.name} → ${rt.name}`), el("h2", {}, "On the road"),
      el("img", { class: "travelart", src: U.img(window.ART.scene(sea ? "sea" : "train", "travel-" + from + to)), alt: "" }),
      ...lines.map((t) => el("p", {}, t)),
      note("The agency pays for the journey and supplies what the team needs on the road. Time passes; wounds heal and the world moves on.", ""),
      el("div", { class: "row" }, btn("Arrive", go, "primary"), btn("Stay where we are", () => { resolve(false); ui.hub("missions"); }, "ghost")));
    ui.mount(body);
  });

  /* ------------------------------------------------------------ the board: pick the period; your agency's HQ contact sends the jobs
     Your agency is who you work for, not what you may do: every job of the period reaches you from your own HQ, and where it is
     (and who usually leads it) comes from the job. The contact changes with the agency and the period, and so does how they reach you. */
  const HQ = {
    OID: { medieval: ["Prior Anselm", "Prior of the Order", "a sealed letter, carried by a lay brother", "Peace to you. Brother Anselm writes."], victorian: ["Prior Cuthbert", "Prior of the Order", "a letter and, when it is urgent, a telegram", "Prior Cuthbert to the agents of the Order."], wars: ["Prior Cuthbert", "Prior of the Order", "a telegram delivered to your billet", "STOP. The Prior writes."], atomic: ["Brother Amadeo", "the Prior's secretary", "a telephone call at an odd hour", "It is Brother Amadeo, from the Prior's office."], modern: ["Brother Amadeo", "the Prior's secretary", "a call on your mobile, and a fax to follow", "Amadeo here, for the Prior."], now: ["Sister Odile", "Keeper of the Order's correspondence", "a message on your phone", "Sister Odile. The Order has a job."], future: ["Sister Odile", "Keeper of the Order's correspondence", "a call that arrives on your wrist", "Odile, from the Priory. Eight hundred years of this and it still rings at night."] },
    WCA: { victorian: ["Mr. Wells", "Senior partner, Wells and Constantine", "a letter in a plain envelope", "Mr. Wells presents his compliments."], wars: ["Mr. Wells", "Senior partner, Wells and Constantine", "a telegram to your lodgings", "WELLS HERE. A MATTER FOR THE ASSOCIATION."], atomic: ["Miss Pembroke", "Mr. Wells's private secretary", "a telephone call", "Miss Pembroke, from Mr. Wells's office."], modern: ["Mr. Quill", "Duty officer, the Association", "a call, and a file by courier", "Quill, at the Association."], now: ["Ms. Okafor", "Head of Operations", "an encrypted message", "Okafor, Operations. We have something."], future: ["Agent Hugo", "Handler, Neo France", "a call that opens in the air in front of you", "Agent Hugo, from headquarters."] },
    NSBD: { wars: ["Commissioner Hale", "Division headquarters, Nassau", "a coded telegram", "NSBD HEADQUARTERS. COMMISSIONER HALE."], atomic: ["Director Mallory", "Division director", "a telephone call on a scrambled line", "Mallory. The Division has a case."], modern: ["Agent Ruiz", "Dispatcher, the Division", "your pager, then a call", "Ruiz, dispatch. Call me back from a payphone."], now: ["Dana Whitcombe", "Field coordinator", "a secure text", "Whitcombe, Division. Read, then delete."], future: ["Dana Whitcombe", "Field coordinator", "a call that appears on your lenses", "Whitcombe. Division. It is a long way from the Bahamas."] },
    EHG: { atomic: ["Captain Mori", "Guard liaison", "a sealed note delivered by a courier on a scooter", "From Captain Mori of the Heavenly Guard."], modern: ["Colonel Ishikawa", "Guard operations", "a call from Tokyo", "Ishikawa, Guard operations."], now: ["Lieutenant Tanabe", "Guard watch officer", "a message on your phone", "Tanabe, watch officer."], future: ["Marshal Aoki", "Commander of the Guard", "a call that stands in the room like a person", "Marshal Aoki, of the Guard."] },
    BFV: { now: ["Handler Wen", "Vanguard handler", "an encrypted app message", "Wen, Vanguard. Job."], future: ["Dispatcher Lin", "Vanguard dispatch", "a call that is already in your ear when you wake", "Lin, Vanguard dispatch. Everyone who is awake, listen."] }
  };
  C.HQ = HQ;
  CAMP.hq = (agencyId, year) => {
    const order = ["medieval", "victorian", "wars", "atomic", "modern", "now", "future"], e = C.eraOf(year || CAMP.camp.year).id, t = HQ[agencyId] || HQ.OID;
    for (let i = order.indexOf(e); i >= 0; i--) if (t[order[i]]) return t[order[i]];
    return Object.values(t)[0];
  };
  /* the jobs of the player's chosen period: every one of them, sorted by year */
  CAMP.periodJobs = () => { const c = CAMP.camp, era = C.eraOf(c.year); return CAMP.allAdventures().filter((m) => m.year >= era.from && m.year <= era.to && CAMP.canTake(m, c.agency) && !CAMP.isBlank(m)).sort((x, y) => x.year - y.year); };
  CAMP.isBlank = (m) => { const src = m.src || m; return !!(m.custom || src.custom) && ((m.title || "") === "Untitled case" || !(m.summary || (src && src.summary))); };
  ui.board = (wrap) => {
    const c = CAMP.camp, era = C.eraOf(c.year), ag = CAMP.agency(), here = c.region || CAMP.homeRegion(c.agency);
    const list = CAMP.periodJobs(), hq = CAMP.hq(c.agency, c.year);
    wrap.append(el("h3", { class: "sect" }, `Choose the period · ${ag.short}`));
    const all = CAMP.allAdventures().filter((m) => !CAMP.isBlank(m));
    wrap.append(el("div", { class: "regionbar eras" }, ...C.ERAS.filter((e) => ag.founded <= e.to).map((e) => {
      const n = all.filter((m) => m.year >= e.from && m.year <= e.to && CAMP.canTake(m, c.agency)).length;
      return el("button", { class: "region" + (e.id === era.id ? " on" : ""), onclick: () => { if (e.id === era.id) return; c.year = Math.max(e.from, Math.min(e.to, Math.max(e.sample, ag.founded))); CAMP.logAdd(`The campaign moved to ${c.year}.`); CAMP.save(); ui.hub("missions"); } },
        el("b", {}, e.name), el("small", {}, `${e.from}–${e.to >= 2600 ? "" : e.to} · ${n} job${n === 1 ? "" : "s"}`));
    })));
    wrap.append(el("div", { class: "hqcard" },
      el("p", { class: "eyebrow" }, `${era.name} · ${c.year}`),
      el("b", {}, `${hq[0]}, ${hq[1]}`),
      el("p", { class: "small muted" }, `Reaches you by ${hq[2]}.`),
      el("p", { class: "hqsay" }, `“${hq[3]} ${list.length ? `There ${list.length === 1 ? "is one matter" : `are ${list.length} matters`} on the desk.` : "Nothing on the desk for this period just now."}”`)));
    if (!list.length) wrap.append(note(`${hq[0]} has nothing for the ${ag.short} in this period. Choose another period above.`));
    const grid = el("div", { class: "cardgrid" });
    for (const m of list) {
      const done = c.history.filter((h) => h.adv === m.id), joint = !CAMP.isLead(m, c.agency), rg = C.regionOf(CAMP.regionOfCase(m));
      grid.append(el("button", { class: "mcard", onclick: async () => {
        U.click(); if (!CAMP.active().length) return U.toast("You need an active agent.");
        const to = CAMP.regionOfCase(m);
        if (to !== here) { const ok = await ui.travel(to); if (!ok) return; }
        ui.briefing(m.id);
      } },
        el("img", { src: U.img(m.art || window.ART.scene(m.theme || "street", m.id)), alt: "" }),
        el("div", { class: "etxt" }, el("b", {}, m.title), el("span", { class: "mono" }, `${m.setting} · ${rg.name}`), el("small", {}, m.summary || ""),
          joint ? el("span", { class: "tag" }, "Joint operation") : null,
          done.length ? el("span", { class: "tag ok" }, done[0].result) : null)));
    }
    wrap.append(grid);
    return wrap;
  };

  /* ------------------------------------------------------------ the briefing says who assigned it */
  const HANDLER = new Proxy({}, { get: (_, k) => { try { return CAMP.hq(k)[0]; } catch (e) { return "your agency"; } } });
  const brief0 = ui.briefing;
  ui.briefing = (advId, ...rest) => {
    const r = brief0.call(ui, advId, ...rest);
    try {
      const c = CAMP.camp, m = CAMP.advMeta(advId), ag = CAMP.agency(), wrap = document.querySelector(".cwrap h2");
      if (!m || !wrap) return r;
      const lead = (m.agencies || []).map((id) => (C.AGENCIES.find((a) => a.id === id) || {}).short).filter(Boolean);
      const region = C.regionOf(CAMP.regionOfCase(m));
      const line = CAMP.isLead(m, c.agency) || !lead.length
        ? `Assigned by ${HANDLER[c.agency] || "your agency"} of the ${ag.short}. ${region.name}, ${m.year}.`
        : `A joint operation: the ${lead.join(" / ")} asked for help and ${HANDLER[c.agency] || "your agency"} of the ${ag.short} is sending your team. ${region.name}, ${m.year}.`;
      wrap.insertAdjacentElement("afterend", el("p", { class: "small muted assigned" }, line));
    } catch (e) { /* the briefing still works */ }
    return r;
  };

  /* the hub shows where the team is */
  const hub0 = ui.hub;
  ui.hub = (...a) => {
    const r = hub0(...a);
    try {
      const c = CAMP.camp, t = c && document.querySelector(".hubtitle small.mono");
      if (t && c && !t.dataset.loc) { t.dataset.loc = "1"; t.textContent += ` · ${C.regionOf(c.region || CAMP.homeRegion(c.agency)).name}`; }
    } catch (e) { /* cosmetic */ }
    return r;
  };
})();
