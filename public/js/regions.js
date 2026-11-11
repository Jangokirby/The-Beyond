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

  /* ------------------------------------------------------------ the board: era, then region, then jobs */
  let view = null;
  ui.board = (wrap) => {
    const c = CAMP.camp, era = C.eraOf(c.year), ag = CAMP.agency(), here = c.region || CAMP.homeRegion(c.agency);
    const list = CAMP.advList();                       // this era, any case this agency can take
    const byRegion = {}; for (const m of list) (byRegion[CAMP.regionOfCase(m)] = byRegion[CAMP.regionOfCase(m)] || []).push(m);
    if (!view || (!byRegion[view] && view !== here)) view = byRegion[here] ? here : (Object.keys(byRegion).sort((x, y) => byRegion[y].length - byRegion[x].length)[0] || here);
    wrap.append(el("h3", { class: "sect" }, `Jobs for the ${ag.short} · ${era.name} (${c.year})`));
    /* time first: the eras this agency exists in, with how many jobs each holds */
    const all = CAMP.allAdventures();
    wrap.append(el("div", { class: "regionbar eras" }, ...C.ERAS.filter((e) => ag.founded <= e.to).map((e) => {
      const n = all.filter((m) => m.year >= e.from && m.year <= e.to && CAMP.canTake(m, c.agency)).length;
      return el("button", { class: "region" + (e.id === era.id ? " on" : ""), onclick: () => { if (e.id === era.id) return; c.year = Math.max(e.from, Math.min(e.to, Math.max(e.sample, ag.founded))); CAMP.logAdd(`The campaign moved to ${c.year}.`); CAMP.save(); view = null; ui.hub("missions"); } },
        el("b", {}, e.name), el("small", {}, `${e.from < 1000 ? e.from : e.from}–${e.to >= 2100 ? "" : e.to} · ${n} job${n === 1 ? "" : "s"}`));
    })));
    const chips = el("div", { class: "regionbar" }, ...C.REGIONS.filter((r) => byRegion[r.id] || r.id === here).map((r) => {
      const n = (byRegion[r.id] || []).length;
      return el("button", { class: "region" + (r.id === view ? " on" : "") + (r.id === here ? " here" : ""), onclick: () => { view = r.id; ui.hub("missions"); } },
        el("b", {}, r.name), el("small", {}, `${n} job${n === 1 ? "" : "s"}${r.id === here ? " · your team is here" : ""}`));
    }));
    wrap.append(chips);
    const rv = C.regionOf(view);
    if (view !== here) {
      const days = CAMP.travelDays(here, view);
      wrap.append(note(`Your team is in ${C.regionOf(here).name}. Getting to ${rv.name} takes about ${days} day${days === 1 ? "" : "s"}; ${ag.short} covers it. Picking a job here sends you there.`, ""));
    } else wrap.append(el("p", { class: "small muted" }, rv.blurb));
    const jobs = byRegion[view] || [];
    if (!jobs.length) wrap.append(note(`Nothing on the board in ${rv.name} in this period for the ${ag.short}. Try another region, or change the period.`));
    const grid = el("div", { class: "cardgrid" });
    for (const m of jobs) {
      const done = c.history.filter((h) => h.adv === m.id), joint = !CAMP.isLead(m, c.agency);
      grid.append(el("button", { class: "mcard", onclick: async () => {
        U.click(); if (!CAMP.active().length) return U.toast("You need an active agent.");
        if (view !== here) { const ok = await ui.travel(view); if (!ok) return; }
        ui.briefing(m.id);
      } },
        el("img", { src: U.img(m.art || window.ART.scene(m.theme || "street", m.id)), alt: "" }),
        el("div", { class: "etxt" }, el("b", {}, m.title), el("span", { class: "mono" }, m.setting), el("small", {}, m.summary || ""),
          joint ? el("span", { class: "tag" }, "Joint operation") : null,
          done.length ? el("span", { class: "tag ok" }, done[0].result) : null)));
    }
    wrap.append(grid);
    const elsewhere = CAMP.allAdventures().filter((m) => !list.includes(m) && CAMP.canTake(m, c.agency) && !(m.year >= era.from && m.year <= era.to));
    if (elsewhere.length) wrap.append(note(`${elsewhere.length} more job${elsewhere.length > 1 ? "s are" : " is"} open to the ${ag.short} in other periods. Use Period to move through time.`, ""));
    return wrap;
  };

  /* ------------------------------------------------------------ the briefing says who assigned it */
  const HANDLER = { OID: "the Prior", WCA: "Mr. Wells", NSBD: "the Division desk", EHG: "your section chief", BFV: "Vanguard dispatch" };
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
