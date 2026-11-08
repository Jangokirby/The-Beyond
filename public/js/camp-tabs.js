/* ============================================================================
   HUB TABS — missions, agents, quartermaster, home & garage, downtime,
   artifacts, patrons, library, case log.
   ========================================================================== */
(function () {
  const C = window.CDATA, GD = window.GD, G = window.GAME, U = window.UI, CAMP = window.CAMP, ui = CAMP.ui, el = U.el, ADV = window.ADV;
  const { btn, panel, note, cap, bar, toast } = ui;
  const tabs = (ui.tabs = {});
  const redraw = () => { CAMP.save(); ui.hub(); };
  const modal = (o) => U.modal(o);
  const CRN = { easy: 7, medium: 10, challenging: 14, dangerous: 18, hopeless: 20 };
  const ph = (t) => (t || "").replace(/\s+/g, " ");

  /* agent picker strip used by several tabs */
  const picker = () => {
    const act = CAMP.active(), sel = ui.selected();
    if (!sel) return note("No active agents.");
    return el("div", { class: "agentstrip" }, ...act.map((a) => el("button", { class: "agentchip" + (a.id === sel.id ? " on" : ""), onclick: () => { U.click(); CAMP.sel = a.id; ui.hub(); } },
      el("img", { src: ui.portraitSrc(a), alt: "" }), el("span", {}, a.short), a.pending ? el("i", { class: "dot", title: "Level up ready" }) : null)));
  };
  const spMeter = (a) => {
    const used = CAMP.spUsed(a), max = CAMP.spMax(a), carried = CAMP.carried(a), lim = CAMP.carryLimit(a);
    return el("div", { class: "meters" },
      el("div", { class: "meter" + (used > max ? " over" : "") }, el("span", {}, `Spending Power ${used}/${max}`), el("span", { class: "track" }, el("span", { class: "fill", style: { width: Math.min(100, (used / max) * 100) + "%" } }))),
      el("div", { class: "meter" + (carried > lim ? " over" : "") }, el("span", {}, `Storage ${carried}/${lim}`), el("span", { class: "track" }, el("span", { class: "fill", style: { width: Math.min(100, (carried / lim) * 100) + "%" } }))));
  };

  /* ============================================================ MISSIONS */
  tabs.missions = () => {
    const c = CAMP.camp, era = C.eraOf(c.year), list = CAMP.advList();
    const wrap = el("div", {});
    if (c.mission) {
      const m = CAMP.advMeta(c.mission.adv);
      wrap.append(panel("Mission in progress", el("p", {}, `${m ? m.title : "A case"} was left unfinished.`),
        el("div", { class: "row" }, btn("Resume", async () => { if (!(await CAMP.resumeMission())) { toast("The saved mission could not be found."); ui.hub(); } }, "primary"),
          btn("Abandon it", async () => { const r = await modal({ title: "Abandon the mission?", body: "<p>Progress in it is lost. Nothing else changes.</p>", buttons: [{ id: "no", label: "Keep" }, { id: "yes", label: "Abandon", cls: "danger" }] }); if (r === "yes") { G.saveKey = "beyond.mission." + c.id; G.clearSave(); c.mission = null; redraw(); } }, "danger"))));
    }
    wrap.append(el("h3", { class: "sect" }, `Jobs for the ${CAMP.agency().short}, ${era.name} (${c.year})`));
    if (!list.length) wrap.append(note("Nothing on the board for this agency in this period yet. Change the period, or build your own with the GM toolkit (coming)."));
    const grid = el("div", { class: "cardgrid" });
    for (const m of list) {
      const done = c.history.filter((h) => h.adv === m.id);
      const lv = m.level ? `Lv ${m.level[0]}–${m.level[1]}` : "";
      grid.append(el("button", { class: "mcard", onclick: () => { U.click(); if (!CAMP.active().length) return toast("You need an active agent."); ui.briefing(m.id); } },
        el("img", { src: U.img(m.art || window.ART.scene(m.theme || "street", m.id)), alt: "" }),
        el("div", { class: "etxt" }, el("b", {}, m.title), el("span", { class: "mono" }, `${m.setting}${lv ? " · " + lv : ""}`), el("small", {}, m.summary || ""),
          done.length ? el("span", { class: "tag ok" }, done[0].result) : null)));
    }
    wrap.append(grid);
    const far = CAMP.allAdventures().filter((m) => !list.includes(m) && (m.agencies || []).includes(c.agency));
    if (far.length) wrap.append(note(`${far.length} more job${far.length > 1 ? "s are" : " is"} available for ${CAMP.agency().short} in other periods: ${far.map((m) => `${m.title} (${m.year})`).join(", ")}.`));
    return wrap;
  };

  /* ============================================================ AGENTS */
  tabs.agents = () => {
    const wrap = el("div", {}), a = ui.selected();
    wrap.append(picker());
    if (a) wrap.append(sheet(a));
    const row = el("div", { class: "row" }, btn("Recruit a new agent", () => ui.creator(null, () => ui.hub("agents")), "primary"));
    wrap.append(row);
    const gone = CAMP.camp.chars.filter((x) => x.status !== "active");
    if (gone.length || CAMP.camp.retired.length) wrap.append(panel("Memorial", ...gone.map((x) => {
      const app = x.status === "dead" && !x.succeeded && (x.assets || []).find((s) => s.kind === "service" && s.ref === "Apprentice" && s.owned);
      return el("div", { class: "assetrow" }, el("div", { class: "grow" }, el("small", {}, `${x.name}, level ${x.level}: ${x.status}.${x.deathText ? " " + x.deathText : ""}`)),
        app ? btn("Continue as their apprentice", () => { const d = CAMP.blankDraft(); d.startLevel = 2; d.bio = `Trained under ${x.name}.`; x.succeeded = true; ui.creator(d, () => ui.hub("agents")); }, "small primary") : null);
    })));
    return wrap;
  };

  const sheet = (a) => {
    const w = el("div", { class: "sheet" });
    w.append(el("div", { class: "sheethead" }, el("img", { class: "portrait", src: ui.portraitSrc(a), alt: "" }),
      el("div", {}, el("h3", {}, a.name), el("p", { class: "small muted" }, `Level ${a.level} · ${a.background} · age ${a.age} · ${cap(a.size)} · ${a.missions} mission${a.missions === 1 ? "" : "s"} (${a.solved} solved)`),
        window.PEOPLE ? el("p", { class: "small muted" }, [PEOPLE.get(a.origin) ? `From ${PEOPLE.get(a.origin).name}` : "", `Speaks ${PEOPLE.langsOf(a).join(", ")}`].filter(Boolean).join(" · ")) : null,
        a.doomed != null ? el("p", { class: "warn small" }, `Marked for death: ${a.doomed} days left.`) : null,
        el("div", { class: "pools" }, ...["health", "sanity", "stability"].map((k) => bar(a.pools[k], k))))));
    if (a.pending) w.append(btn(`Level up (${a.pending})`, () => ui.levelUp(a), "primary"));
    w.append(panel("Core Stats and Aspects", el("p", { class: "mono" }, `Body ${a.core.body} · Mind ${a.core.mind} · Spirit ${a.core.spirit}`),
      el("div", { class: "aspchips" }, ...Object.keys(C.ASPECT_NAMES).map((k) => el("span", { class: "achip" + (a.special === k ? " star" : ""), title: C.ASPECT_HELP[k] }, `${C.ASPECT_NAMES[k]} ${R.aspect(a, k)}`))),
      el("p", { class: "small muted" }, `BR ${R.br ? R.br(a) : "—"} · ER ${R.er ? R.er(a) : "—"} · MR ${R.mr(a)} · SR ${R.sr(a)}`)));
    w.append(panel("Gear", el("p", {}, el("b", {}, a.weapon.name), ` · ${a.weapon.type} (+${a.weapon.bonus}) · ${a.weapon.aspect ? C.ASPECT_NAMES[a.weapon.aspect] : ""}`), el("p", { class: "small muted" }, `Mods: ${a.weapon.mods.join(", ")} · Specialty: ${a.weapon.specialty}`),
      el("p", {}, el("b", {}, a.armor.name), ` · ${a.armor.type} (BR ${a.armor.br}, ER ${a.armor.er})`), el("p", { class: "small muted" }, `Mods: ${a.armor.mods.join(", ")} · Specialty: ${a.armor.specialty}`)));
    w.append(panel("Bonds", ...a.bonds.map((b) => el("p", { class: "small" }, `${b.name} (${b.rel}): ${b.value}`))));
    if (a.afflict && Object.keys(a.afflict).length) w.append(panel("Afflictions", ...Object.entries(a.afflict).map(([id, v]) => el("div", { class: "assetrow" }, el("div", { class: "grow" }, el("b", {}, (R.AFFLICTIONS[id] || {}).name || id), el("small", {}, `${(R.AFFLICTIONS[id] || {}).text || ""}${v.cr ? " Source CR " + v.cr + "." : ""}${v.days ? " " + v.days + " day(s)." : ""}`)),
      btn("Cured", () => { R.cureAfflict(a, id); redraw(); }, "small ghost")))));
    if (a.injuries.length) w.append(panel("Injuries and disorders", ...a.injuries.map((i) => el("p", { class: "small warn" }, `${i.name}${i.text ? ": " + i.text : ""}`))));
    if (a.noticed) w.append(note(`Noticed: ${a.noticed}`, "warn"));
    if (a.bio) w.append(panel("Backstory", el("p", { class: "small" }, a.bio)));
    if (a.questions.length) w.append(panel("Questions for the GM", ...a.questions.map((q, i) => el("label", { class: "field" }, el("span", {}, q.q || "(blank)"), el("input", { type: "text", value: q.a, placeholder: "The answer", oninput: (e) => { q.a = e.target.value; CAMP.save(); } })))));
    if (a.magic) w.append(wordsEditor(a));
    w.append(el("div", { class: "row" }, btn("Rename", async () => {
      const inp = el("input", { type: "text", value: a.name, maxlength: "40" });
      const r = await modal({ title: "Rename", body: el("div", {}, inp), buttons: [{ id: "no", label: "Cancel" }, { id: "ok", label: "Save", cls: "primary" }] });
      if (r === "ok" && inp.value.trim()) { a.name = inp.value.trim(); a.short = a.name.split(/\s+/)[0]; redraw(); }
    }, "ghost small"), btn("Retire", async () => {
      if (!CAMP.canRetire(a)) return modal({ title: "Not yet", body: "<p>An agent can retire after 3 level-ups.</p>", buttons: [{ id: "ok", label: "OK" }] });
      const r = await modal({ title: `Retire ${a.name}?`, body: "<p>They leave the field for good.</p>", buttons: [{ id: "no", label: "Keep working" }, { id: "yes", label: "Retire", cls: "danger" }] });
      if (r === "yes") { CAMP.retire(a); CAMP.sel = null; redraw(); }
    }, "ghost small")));
    return w;
  };

  const wordsEditor = (a) => {
    const aspMax = Math.max(R.aspect(a, "occult"), R.aspect(a, "faith"), R.aspect(a, "ancient"));
    const bg = CAMP.bgDef(a.background);
    const budget = R.wordPoolMax(a);
    const names = Object.keys(R.WORDS), used = () => Object.values(a.words || {}).reduce((s, n) => s + n, 0);
    a.words = a.words || {};
    const box = el("div", { class: "wordgrid" });
    for (const w of names) {
      const n = a.words[w] || 0;
      box.append(el("div", { class: "asp-row", title: "" }, el("span", {}, w), el("span", { class: "stepper" },
        el("button", { class: "icon-btn", disabled: !n, "aria-label": `Fewer ${w}`, onclick: () => { a.words[w] = n - 1; if (!a.words[w]) delete a.words[w]; redraw(); } }, "−"), el("b", {}, String(n)),
        el("button", { class: "icon-btn", disabled: used() >= budget, "aria-label": `More ${w}`, onclick: () => { a.words[w] = n + 1; redraw(); } }, "+"))));
    }
    return panel(`Magic words (${used()}/${budget}, ${cap(a.magic.source)})`, note("Words are spent as you cast and come back after a rest. Your Word Pool is 5 for every point of Occult, Faith and Ancient, plus any background bonus."), box);
  };

  /* ============================================================ QUARTERMASTER */
  const assetRow = (a, as) => {
    const cost = CAMP.assetCost(a, as);
    const favorOk = !as.committed && !as.owned && CAMP.favorsFor(as.wc) > 0;
    return el("div", { class: "assetrow" + (as.committed || as.owned ? " on" : "") + (as.state !== "ok" ? " bad" : "") },
      el("div", { class: "grow" }, el("b", {}, as.name), el("small", { class: "mono" }, `${CAMP.WC[as.wc]} ${as.kind}${as.mods.length ? " · " + as.mods.join(", ") : ""}`),
        as.custom ? el("small", {}, as.custom.text + (as.custom.applies.length ? " · helps: " + as.custom.applies.map((x) => R.ASPECT_LABEL[x.split(":")[1]]).join(", ") : " · ask the GM each time") + ` · size ${as.custom.size}`) : null,
        (as.kind === "housing" || as.kind === "vehicle") ? el("small", { class: "mono" }, (() => { const p = CAMP.propStats(as); return `Construct: ${p.pool} in each pool, BR ${p.br}, MR ${p.mr}, SR ${p.sr}${p.traps ? ", " + p.traps + " trap" + (p.traps > 1 ? "s" : "") : ""}`; })()) : null,
        as.state === "disrepair" ? el("small", { class: "warn" }, `Disrepair ${as.dis}/3. Commit it next mission to repair.`) : null,
        as.secureOn && !as.owned ? el("small", { class: "good" }, `Securing: ${as.secure}/3 missions`) : null, as.owned ? el("small", { class: "good" }, "Owned. No commit needed.") : null),
      el("div", { class: "row tight" },
        as.ref === "Apprentice" && !as.owned ? btn(as.secureOn ? "Stop training" : `Train for 3 missions (${cost} SP each)`, () => { as.secureOn = !as.secureOn; as.committed = as.secureOn; redraw(); }, "small") : null,
        as.kind === "service" && as.ref !== "Apprentice" && !as.guest && CAMP.guestCap(a) > CAMP.guestCount(a) ? btn("Invite as guest", async () => { const r = await modal({ title: `Let ${as.name} move in?`, body: "<p>A guest's service costs nothing from now on. Once accepted, a guest cannot be removed.</p>", buttons: [{ id: "no", label: "Not yet" }, { id: "yes", label: "Invite", cls: "primary" }] }); if (r === "yes") { as.guest = true; as.committed = true; redraw(); } }, "small ghost") : null,
        as.guest ? el("span", { class: "tag" }, "Guest · free") : null,
        as.ref === "Apprentice" || as.owned || as.guest ? null : el("label", { class: "tog" }, el("input", { type: "checkbox", checked: as.committed ? "checked" : null, onchange: (e) => { as.committed = e.target.checked; if (!as.committed) as.waived = false; redraw(); } }), el("span", {}, as.waived ? "Commit (free)" : `Commit ${cost} SP`)),
        as.custom ? btn("Edit", () => editCustom(a, as), "small ghost") : null,
        favorOk ? btn("Use a Favor", () => { CAMP.useFavor(a, as); redraw(); }, "small") : null,
        (as.kind === "housing" || as.kind === "vehicle") && !as.owned ? btn(as.secureOn ? "Stop securing" : "Secure", () => { as.secureOn = !as.secureOn; redraw(); }, "small ghost", { title: "Over-commit for 3 missions in a row to own it permanently" }) : null,
        btn("Sell", async () => { const r = await modal({ title: `Sell ${as.name}?`, body: "<p>It leaves your roster.</p>", buttons: [{ id: "no", label: "Keep" }, { id: "yes", label: "Sell", cls: "danger" }] }); if (r === "yes") { a.assets.splice(a.assets.indexOf(as), 1); redraw(); } }, "small ghost danger")));
  };

  /* ---------------------------------------------------------------- player-made items
     The book wants players to decide what an item is, its quality, and how it gets used.
     The player names it, describes it, picks quality (Wealth Class), size, and what it helps with.
     In play it can be offered on any roll; rolls it was not made for are marked "?" for the GM to allow. */
  const SIZES = [[1, "One-handed object (1)"], [2, "Two-handed object (2)"], [3, "Half your size (3)"], [4, "Your size (4, Strength 12 to move)"], [5, "Larger than you (5, Strength 16 to move)"]];
  const customForm = (a, ex, done) => {
    const iconKeys = Object.keys((window.ASSETS && window.ASSETS.items) || {});
    const st = ex ? { name: ex.name, use: ex.custom.text || "", size: ex.custom.size || 1, icon: ex.custom.icon, wc: ex.wc, applies: [...(ex.custom.applies || [])] }
      : { name: "", use: "", size: 1, icon: iconKeys.includes("journal") ? "journal" : iconKeys[0], wc: 1, applies: [] };
    const form = el("div", { class: "custom-form" });
    const draw = () => {
      form.replaceChildren();
      const w = GD.wealth[st.wc - 1];
      form.append(
        el("label", { class: "field" }, el("span", {}, "What is it called?"), el("input", { type: "text", maxlength: "40", value: st.name, placeholder: "e.g. Grandfather's brass pocket compass", oninput: (e) => { st.name = e.target.value; } })),
        el("label", { class: "field" }, el("span", {}, "What is it, and how will you use it?"), el("textarea", { rows: "3", maxlength: "240", placeholder: "Describe the item and the sort of thing it helps with. The bonus only counts when it makes sense for the roll.", oninput: (e) => { st.use = e.target.value; } }, st.use)),
        el("div", { class: "field" }, el("span", {}, `Quality (Wealth Class): bonus +${w.bonus}, ${w.uses} use${w.uses > 1 ? "s" : ""}, ${w.item} Spending Power to commit`),
          el("div", { class: "seg" }, ...GD.wealth.map((x) => el("button", { class: "segbtn" + (x.wc === st.wc ? " on" : ""), onclick: () => { st.wc = x.wc; draw(); } }, x.name)))),
        el("label", { class: "field" }, el("span", {}, "Size (storage slots)"), el("select", { onchange: (e) => { st.size = +e.target.value; } }, ...SIZES.map(([n, t]) => el("option", { value: n, selected: st.size === n ? "selected" : null }, t)))),
        el("div", { class: "field" }, el("span", {}, "Best at helping with (pick up to 4 Aspects, or none to ask the GM each time)"),
          el("div", { class: "aspchk" }, ...Object.keys(R.ASPECT_LABEL).map((k) => {
            const on = st.applies.includes("aspect:" + k);
            return el("label", { class: on ? "on" : "" }, el("input", { type: "checkbox", checked: on ? "checked" : null, onchange: (e) => {
              if (e.target.checked) st.applies = [...st.applies, "aspect:" + k].slice(-4); else st.applies = st.applies.filter((x) => x !== "aspect:" + k);
              draw();
            } }), R.ASPECT_LABEL[k]);
          }))),
        iconKeys.length ? el("label", { class: "field" }, el("span", {}, "Icon"), el("select", { onchange: (e) => { st.icon = e.target.value; } }, ...iconKeys.map((k) => el("option", { value: k, selected: st.icon === k ? "selected" : null }, k)))) : null);
    };
    draw();
    const read = () => {
      if (!st.name.trim()) { toast("Give it a name."); return null; }
      if (!st.use.trim()) { toast("Say how it gets used."); return null; }
      return { name: st.name.trim(), wc: st.wc, custom: { text: st.use.trim(), size: st.size, icon: st.icon, applies: st.applies, mine: true } };
    };
    return { form, read };
  };
  const editCustom = async (a, as) => {
    const f = customForm(a, as);
    const r = await modal({ title: "Edit item", cls: "wide", body: f.form, buttons: [{ id: "no", label: "Cancel" }, { id: "ok", label: "Save", cls: "primary" }] });
    if (r !== "ok") return;
    const v = f.read(); if (!v) return;
    as.name = v.name; as.wc = v.wc; as.custom = v.custom; redraw();
  };

  tabs.quarter = () => {
    const wrap = el("div", {}), a = ui.selected();
    wrap.append(picker());
    if (!a) return wrap;
    const c = CAMP.camp;
    wrap.append(spMeter(a), note(`Wealth Class decides what an item costs to carry on a mission: ${GD.wealth.map((w) => `${w.name} ${w.item}`).join(", ")}. Commit what you take. Uncommitted gear slips into Disrepair, and into Ruin after 3 missions. ${c.favors.length} Favor${c.favors.length === 1 ? "" : "s"} in hand.`));
    const items = a.assets.filter((x) => x.kind === "item");
    wrap.append(panel("Your kit", ...(items.length ? items.map((x) => assetRow(a, x)) : [note("Nothing yet. Buy something below.")])));
    let wc = 1;
    const cat = el("div", { class: "shopgrid" });
    const draw = () => {
      cat.replaceChildren();
      for (const [id, d] of Object.entries(CAMP.ITEMS)) {
        if (d.from && c.year < d.from) continue;
        cat.append(el("div", { class: "shopcard" }, el("b", {}, CAMP.itemName(id, c.year)), el("small", {}, d.text), el("small", { class: "mono" }, d.med || d.food ? "" : `Bonus +${GD.wealth[wc - 1].bonus}, ${GD.wealth[wc - 1].uses} use${GD.wealth[wc - 1].uses > 1 ? "s" : ""}`),
          btn(`Buy (${CAMP.WC[wc]}, ${CAMP.costOf("item", wc)} SP)`, () => { CAMP.addAsset(a, { kind: "item", ref: id, name: CAMP.itemName(id, c.year), wc }); toast(`${CAMP.itemName(id, c.year)} added.`); redraw(); }, "small")));
      }
    };
    const sel = el("div", { class: "seg" }, ...GD.wealth.map((w) => el("button", { class: "segbtn" + (w.wc === wc ? " on" : ""), onclick: (e) => { wc = w.wc; for (const b of sel.children) b.classList.remove("on"); e.currentTarget.classList.add("on"); draw(); } }, w.name)));
    draw();
    const mine = customForm(a, null);
    wrap.append(el("details", { class: "fold", open: items.some((x) => x.custom) ? null : "open" }, el("summary", {}, "Make your own item"),
      note("You decide what the item is and how it can be used. Quality sets its bonus and how often it counts. The GM decides when it fits the situation."), mine.form,
      btn("Add to my kit", () => { const v = mine.read(); if (!v) return; const as = CAMP.addAsset(a, { kind: "item", ref: null, name: v.name, wc: v.wc }); as.custom = v.custom; toast(`${v.name} added.`); redraw(); }, "small primary")));
    wrap.append(panel("Shop", note("Ready-made examples. Pick a Wealth Class. Better quality means a bigger bonus and more uses, and costs more Spending Power to commit."), sel, cat));
    const svc = a.assets.filter((x) => x.kind === "service");
    wrap.append(panel("Services", ...svc.map((x) => assetRow(a, x)), shopServices(a)));
    return wrap;
  };

  const shopServices = (a) => {
    let wc = 1;
    const out = el("div", { class: "shopgrid" });
    const draw = () => {
      out.replaceChildren();
      for (const s of GD.services) {
        const ok = wc >= s.min;
        out.append(el("div", { class: "shopcard" + (ok ? "" : " locked") }, el("b", {}, s.name), el("small", {}, ph(s.text).slice(0, 170) + (s.text.length > 170 ? "…" : "")),
          btn(ok ? `Hire (${CAMP.WC[wc]}, ${CAMP.costOf("item", wc)} SP)` : `Needs ${CAMP.WC[s.min]}`, () => { CAMP.addAsset(a, { kind: "service", ref: s.name, name: s.name, wc }); redraw(); }, "small", { disabled: !ok })));
      }
    };
    const sel = el("div", { class: "seg" }, ...GD.wealth.map((w) => el("button", { class: "segbtn" + (w.wc === wc ? " on" : ""), onclick: (e) => { wc = w.wc; for (const b of sel.children) b.classList.remove("on"); e.currentTarget.classList.add("on"); draw(); } }, w.name)));
    draw();
    return el("details", { class: "fold" }, el("summary", {}, "Hire a service"), sel, out);
  };

  /* ============================================================ HOME & GARAGE */
  tabs.home = () => {
    const wrap = el("div", {}), a = ui.selected();
    wrap.append(picker());
    if (!a) return wrap;
    wrap.append(spMeter(a));
    for (const kind of ["housing", "vehicle"]) {
      const list = a.assets.filter((x) => x.kind === kind);
      wrap.append(panel(kind === "housing" ? "Housing" : "Vehicles", ...(list.length ? list.map((x) => assetRow(a, x)) : [note(kind === "housing" ? "You are sleeping on a friend's couch." : "You travel on foot.")]), buyProperty(a, kind)));
    }
    const rb = CAMP.restBonuses(a);
    wrap.append(note(`Committed housing: storage +${GD.wealth[Math.max(0, rb.housingWc - 1)].hStorage || 0}, ${rb.warm ? "warm beds (+" + rb.warm + " recovery), " : ""}${rb.food ? "free food, " : ""}${rb.lab ? "medical lab" : "no special features"}. Vehicles add carry slots when committed.`));
    return wrap;
  };

  const buyProperty = (a, kind) => {
    let wc = 1;
    const name = el("input", { type: "text", maxlength: "40", placeholder: kind === "housing" ? "e.g. Flat above the laundromat" : "e.g. Rusty Datsun" });
    const mod = el("select", {}, el("option", { value: "" }, "No modifier"), ...GD.housingMods.map((m) => el("option", { value: m.name }, `${m.name}: ${ph(m.text).slice(0, 60)}`)));
    const info = el("p", { class: "small muted" });
    const upd = () => {
      const w = GD.wealth[wc - 1];
      info.textContent = kind === "housing" ? `${w.name}: ${w.housing} SP to commit, storage ${w.hStorage}, guests ${w.hGuests}. ${wc >= 3 ? "One modifier." : "No modifiers at this class."}` : `${w.name}: ${w.transport} SP to commit, ${w.tStorage} carry slots, ${w.tZones} Zones of movement. ${wc >= 3 ? "One modifier." : "No modifiers at this class."}`;
      mod.disabled = wc < 3; if (wc < 3) mod.value = "";
    };
    const sel = el("div", { class: "seg" }, ...GD.wealth.map((w) => el("button", { class: "segbtn" + (w.wc === wc ? " on" : ""), onclick: (e) => { wc = w.wc; for (const b of sel.children) b.classList.remove("on"); e.currentTarget.classList.add("on"); upd(); } }, w.name)));
    upd();
    return el("details", { class: "fold" }, el("summary", {}, kind === "housing" ? "Rent or buy a home" : "Get a vehicle"), sel, info,
      el("label", { class: "field" }, el("span", {}, "Name"), name), el("label", { class: "field" }, el("span", {}, "Modifier"), mod),
      btn("Acquire", () => { CAMP.addAsset(a, { kind, name: name.value.trim() || (kind === "housing" ? CAMP.WC[wc] + " home" : CAMP.WC[wc] + " vehicle"), wc, mods: mod.value ? [mod.value] : [] }); redraw(); }, "small primary"));
  };

  /* ============================================================ DOWNTIME */
  tabs.downtime = () => {
    const wrap = el("div", {}), a = ui.selected(), c = CAMP.camp;
    wrap.append(picker());
    if (!a) return wrap;
    const rb = CAMP.restBonuses(a), asp = (k) => R.aspect(a, k);
    wrap.append(el("div", { class: "pools wide" }, ...["health", "sanity", "stability"].map((k) => bar(a.pools[k], k))),
      note(`Day ${c.day}. One day of rest: Natural Recovery gives ${2 + asp("humors")} Health, or Meditation gives ${1 + asp("potency")} Stability. Either way Sanity recovers ${1 + asp("mindfulness")}${a.pastime ? ", and your pastime adds more" : ""}. ${rb.warm ? `Warm beds add ${rb.warm} to every gain.` : ""}`));
    const med = a.assets.some((x) => x.kind === "item" && CAMP.itemDef(x).med && (x.committed || x.owned));
    const useMed = el("input", { type: "checkbox", disabled: !med ? "disabled" : null });
    const medPool = el("select", {}, ...["health", "sanity", "stability"].map((k) => el("option", { value: k }, R.POOL_LABEL[k])));
    const useDrug = el("input", { type: "checkbox" });
    const rest = (mode, days = 1) => window.HIDE.rest(a, mode, days, { useMedicine: useMed.checked, medicinePool: medPool.value, drug: useDrug.checked });
    wrap.append(panel("Rest", el("div", { class: "row" }, btn("Rest a day", () => rest("natural"), "primary"), btn("Meditate a day", () => rest("meditate")), btn("Rest a week", () => rest("natural", 7), "ghost")),
      el("label", { class: "field check" }, useMed, el("span", {}, "Use committed medicine (restores to"), medPool, el("span", {}, ")")),
      el("label", { class: "field check" }, useDrug, el("span", {}, "Take a recreational drug (Resistances up today; down 2 for a few days after)")),
      el("label", { class: "field check" }, el("input", { type: "checkbox", checked: a.pastime ? "checked" : null, onchange: (e) => { a.pastime = e.target.checked; redraw(); } }), el("span", {}, "I have a restful pastime (+1 Sanity and Stability a day)")),
      el("p", { class: "small muted" }, "Medicine only counts while it is committed. Resting a day is a day the world gets to move too.")));
    const svcPanel = ui.servicesPanel && ui.servicesPanel(a);
    if (svcPanel) wrap.append(svcPanel);
    wrap.append(panel("Bonds", note("Visiting someone you love is a day well spent. It restores a little Sanity and keeps the bond from fraying."),
      ...a.bonds.map((b) => el("div", { class: "assetrow" }, el("div", { class: "grow" }, el("b", {}, b.name), el("small", {}, `${b.rel} · bond ${b.value}`)),
        btn("Visit", () => window.HIDE.visit(a, b), "small")))));
    wrap.append(panel("Work a contact", note(`House rule: two days calling in debts earns a Favor (Mundane quality). You have ${c.favors.length}.`),
      btn("Work contacts (2 days)", () => window.HIDE.contacts(a), "small")));
    return wrap;
  };

  /* ============================================================ ARTIFACTS */
  tabs.artifacts = () => {
    const wrap = el("div", {}), a = ui.selected();
    wrap.append(picker());
    if (!a) return wrap;
    wrap.append(note("A Beyond Artifact carries the memories of its dead owner. Equip one and your agent gets its Modifier and its Debuff. Sleep beside it to unlock its five Memories, one at a time: roll 2d6 + your best of Occult, Faith, Ancient or IQ against a Challenge Rating that climbs with each memory. Failure draws 1 Noticed."));
    const dead = CAMP.camp.chars.filter((x) => x.status === "dead" && !x.spoiled);
    if (dead.length) wrap.append(spoilsPanel(dead));
    if (a.grants.artifact > 0) wrap.append(claimPanel(a));
    if (!a.artifacts.length) wrap.append(note("This agent owns no artifacts."));
    for (const ar of a.artifacts) wrap.append(artifactCard(a, ar));
    return wrap;
  };

  const artifactCard = (a, ar) => {
    const d = CAMP.artifactData(ar), mem = (d.memories || []);
    const sec = el("div", { class: "artcard" + (ar.equipped ? " on" : "") },
      el("h4", {}, d.name, ar.custom ? el("span", { class: "tag" }, "custom") : null), el("p", { class: "small" }, ph(d.text || "")),
      el("p", { class: "small" }, el("b", {}, "Effect: "), ph(d.effects || "")), el("p", { class: "small warn" }, el("b", {}, "Drawback: "), ph(d.drawback || "")));
    sec.append(el("div", { class: "memlist" }, ...mem.slice(0, ar.memories).map((m) => el("blockquote", {}, el("b", {}, `Memory ${m.n}`), " ", ph(m.text))), ar.memories < 5 ? el("p", { class: "small muted" }, `${5 - ar.memories} memor${5 - ar.memories === 1 ? "y" : "ies"} still sealed.`) : el("p", { class: "small good" }, "All five memories unlocked.")));
    const mm = window.MECH.ART[ar.name];
    sec.append(el("p", { class: "small " + (mm ? "good" : "muted") }, mm ? (mm.act ? "Automated: use it from here in downtime." : "In play: " + mm.note) : ar.custom ? "Forged artifact: a '+N Attack' modifier counts as a +5 weapon. Everything else is ruled at the table." : "Ruled at the table: the book leaves this one to the GM."));
    if (mm && mm.act) {
      const log2 = el("p", { class: "small" });
      const eyes = mm.act === "eyes" ? el("select", { "aria-label": "How far back", onchange: (e) => window.MECH.eyesSpan(ar, +e.target.value) }, ...["Last 3 days", "Last week", "Last month"].map((t, i) => el("option", { value: String(i) }, t))) : null;
      sec.append(el("div", { class: "row" }, eyes, btn(window.MECH.ACT_LABEL[mm.act], async () => {
        if (mm.act === "facts") { const r = await modal({ title: "Read the Book of Beyond Facts?", body: "<p>Roll 2d6 plus a resistance against 9. Success: gain a level. Failure: your mind melts and your character dies.</p>", buttons: [{ id: "no", label: "Close it" }, { id: "yes", label: "Read it", cls: "danger" }] }); if (r !== "yes") return; }
        const res = await window.MECH.downtime(a, ar, mm.act); CAMP.logAdd(`${a.name}: ${res.text}`); CAMP.save();
        await modal({ title: window.MECH.ACT_LABEL[mm.act], body: `<p>${res.text}</p>`, buttons: [{ id: "ok", label: "OK" }] }); ui.hub();
      }, "small")), log2);
    }
    sec.append(el("div", { class: "row" },
      btn(ar.equipped ? "Unequip" : "Equip", () => { if (!ar.equipped) a.artifacts.forEach((x) => (x.equipped = false)); ar.equipped = !ar.equipped; redraw(); }, ar.equipped ? "" : "primary small"),
      ar.memories < 5 ? btn("Sleep beside it", () => dream(a, ar), "small") : null));
    return sec;
  };

  const dream = (a, ar) => {
    const cr = CRN[CAMP.memoryCR(ar.memories)], stat = Math.max(R.aspect(a, "occult"), R.aspect(a, "faith"), R.aspect(a, "ancient"), R.aspect(a, "iq"));
    const d1 = R.d6(), d2 = R.d6(), tot = d1 + d2 + stat, ok = tot >= cr;
    AudioMan.sfx(ok ? "roll_success" : "roll_fail");
    let extra = "";
    if (ok) extra = " " + window.SVC.memoryUnlocked(a, ar).join(" "); else { R.addNoticed(a, 1); CAMP.logAdd(`${a.name} was Noticed in a dream.`); }
    CAMP.passDays(1);
    modal({ title: ok ? "The memory opens" : "Something looked back", body: `<p class="mono">${d1} + ${d2} + ${stat} = ${tot} vs CR ${cr}</p><p>${ok ? "A new memory surfaces." + extra : "The Beyond noticed you. +1 Noticed."}</p>`, buttons: [{ id: "ok", label: "OK" }] }).then(redraw);
  };

  const spoilsPanel = (dead) => panel("Spoils of the Void", note("A fallen agent leaves something precious behind. Name the item and say what it was to them. The Beyond decides what it does, and its secrets are kept from you until someone claims it."),
    ...dead.map((ch) => {
      const f = { item: "", story: "" };
      return el("div", { class: "optbox" }, el("b", {}, ch.name),
        el("label", { class: "field" }, el("span", {}, "The item"), el("input", { type: "text", placeholder: "a cracked pocket watch", oninput: (e) => { f.item = e.target.value; } })),
        el("label", { class: "field" }, el("span", {}, "Who they were, and what it meant"), el("textarea", { rows: "2", oninput: (e) => { f.story = e.target.value; } })),
        btn("Leave it to the Beyond", () => { if (!f.item.trim()) return toast("Name the item."); CAMP.makeSpoils(ch, f.item.trim(), f.story.trim()); toast(`${f.item.trim().toUpperCase()} joins the Beyond Artifacts.`); redraw(); }, "small primary"),
        btn("Leave nothing", () => { ch.spoiled = true; CAMP.save(); redraw(); }, "small ghost"));
    }));
  const claimPanel = (a) => {
    const have = new Set(CAMP.camp.chars.flatMap((x) => x.artifacts.map((y) => y.name)));
    const list = [...GD.artifacts, ...(CAMP.camp.spoils || [])].filter((x) => !have.has(x.name));
    const box = el("div", { class: "bggrid" }, ...list.map((x) => el("button", { class: "bgcard", onclick: () => { CAMP.giveArtifact(a, x); a.grants.artifact -= 1; redraw(); } }, el("b", {}, x.name), el("small", {}, x.spoils ? "The Beyond has not said what it does." : ph(x.effects).slice(0, 130) + "…"))));
    return panel(`Claim an artifact (${a.grants.artifact} available)`, box, forge(a));
  };

  const forge = (a) => {
    const f = { name: "", idea: "", effects: "", drawback: "", mem: ["", "", "", "", ""] };
    const mk = (label, key, rows) => el("label", { class: "field" }, el("span", {}, label), rows ? el("textarea", { rows: String(rows), oninput: (e) => { f[key] = e.target.value; } }) : el("input", { type: "text", oninput: (e) => { f[key] = e.target.value; } }));
    return el("details", { class: "fold" }, el("summary", {}, "…or forge your own"), note("The rulebook's recipe: who owned it and why; a Modifier plus a Debuff (a weapon gets +5 Attack); exactly five Memories."),
      mk("Name", "name"), mk("Who owned it, and what happened to them", "idea", 3), mk("Modifier (what it gives)", "effects", 2), mk("Debuff (what it costs)", "drawback", 2),
      ...f.mem.map((_, i) => el("label", { class: "field" }, el("span", {}, `Memory ${i + 1}`), el("textarea", { rows: "2", oninput: (e) => { f.mem[i] = e.target.value; } }))),
      btn("Forge it", () => {
        if (!f.name.trim() || !f.effects.trim() || !f.drawback.trim() || f.mem.some((m) => !m.trim())) return toast("Fill the name, modifier, debuff and all five memories.");
        CAMP.giveArtifact(a, { name: f.name.trim(), custom: true, text: f.idea, effects: "Modifier: " + f.effects, drawback: "Debuff: " + f.drawback, memories: f.mem.map((t, i) => ({ n: i + 1, text: t })) });
        a.grants.artifact -= 1; redraw();
      }, "small primary"));
  };

  /* ============================================================ PATRONS */
  tabs.patrons = () => {
    const wrap = el("div", {}), a = ui.selected();
    wrap.append(picker());
    if (!a) return wrap;
    wrap.append(note("Deities and entities from the Beyond can take a mortal as a patron. Each offers three gifts. A patron gift is one of the five level-up benefits. Holding more than one patron costs you every patron's second gift."));
    const multi = a.patrons.length > 1;
    for (const p of a.patrons) {
      const d = GD.deities.find((x) => x.name === p.deity);
      wrap.append(panel(`${p.deity} · ${p.gifts}/3 gifts`, el("p", { class: "small" }, ph(d.text).slice(0, 360) + "…"),
        ...d.gifts.slice(0, p.gifts).map((g) => { const lost = multi && g.number === 2; const pw = window.MECH.powers(a).find((x) => x.deity === p.deity && x.n === g.number); return el("div", { class: "gift" + (lost ? " lost" : "") }, el("b", {}, `Gift ${g.number}: ${g.name}`), el("small", { class: "quote" }, g.quote), el("small", {}, ph(g.effect)), pw && !lost ? el("small", { class: pw.kind === "narrative" ? "muted" : "good" }, pw.kind === "auto" ? "Automated: use it from the Powers button in a mission or fight." : pw.kind === "passive" ? "Always on." : "Costs paid automatically in a mission. The effect is ruled at the table.") : null, lost ? el("small", { class: "warn" }, "Lost: you hold more than one patron.") : null); }),
        a.grants.patron > 0 && p.gifts < 3 ? btn("Receive the next gift", () => { p.gifts += 1; a.grants.patron -= 1; window.MECH.syncGifts(a); redraw(); }, "small primary") : null));
    }
    if (a.grants.patron > 0) {
      wrap.append(panel(`Choose a patron (${a.grants.patron} gift available)`, el("div", { class: "bggrid" }, ...GD.deities.filter((d) => !a.patrons.some((p) => p.deity === d.name)).map((d) =>
        el("button", { class: "bgcard", onclick: () => { a.patrons.push({ deity: d.name, gifts: 1 }); a.grants.patron -= 1; window.MECH.syncGifts(a); CAMP.logAdd(`${a.name} took ${d.name} as a patron.`); redraw(); } }, el("b", {}, d.name), el("small", {}, ph(d.domain || d.pantheon || "") ), el("small", {}, ph(d.demands || "").slice(0, 110)))))));
    } else if (!a.patrons.length) wrap.append(note("This agent has no patron and no gift to spend. A level-up benefit or the Zealot background grants one."));
    return wrap;
  };

  /* ============================================================ LIBRARY */
  tabs.library = () => ui.libraryBody();
  ui.library = (back) => {
    ui.mount(el("div", { class: "cwrap" }, el("h2", {}, "Rules library"), ui.libraryBody(), el("div", { class: "row" }, btn("Back", back, "ghost"))));
  };
  ui.libraryBody = () => {
    const wrap = el("div", {});
    wrap.append(panel("How a check works", el("p", {}, "Roll 2d6 and add the Aspect. Beat or match the Challenge Rating (CR) to succeed. Attacks roll against the target's Evasion Rating (ER). Damage is reduced by the target's Resistance (BR for Health, MR for Sanity, SR for Stability)."),
      el("p", { class: "small muted" }, "Difficulty CRs: " + Object.entries(CRN).map(([k, v]) => `${cap(k)} ${v}`).join(" · ")), el("p", { class: "small muted" }, "Level up every 2 missions. Retire after 3 level-ups. Spending Power: 7 base, commit gear per mission.")));
    const mons = el("div", { class: "modlist" }, ...GD.monsterExamples.map((m) => el("details", { class: "fold" }, el("summary", {}, `${m.name} · ${m.type_line}`),
      el("p", { class: "mono small" }, `Health ${m.health} · Sanity ${m.sanity} · Stability ${m.stability} · Attack +${m.attack} · ER ${m.er} · BR ${m.br} · MR ${m.mr} · SR ${m.sr} · Speed ${m.speed}`),
      ...(m.mods || []).map((x) => el("p", { class: "small" }, el("b", {}, x.name + ": "), x.text)))));
    wrap.append(panel("Example monsters", mons));
    const mb = ADV.MB, out = el("div", { class: "mono small" });
    const t = el("select", {}, ...Object.keys(mb.TYPES).map((k) => el("option", { value: k }, k))), d = el("select", {}, ...Object.keys(mb.DIFFS).map((k) => el("option", { value: k, selected: k === "medium" ? "selected" : null }, cap(k))));
    const upd = () => { const m = ADV.buildMonster({ name: "Monster", type: t.value, difficulty: d.value }); out.textContent = `${m.crLabel}: Health ${m.health} · Sanity ${m.sanity} · Stability ${m.stability} · Attack +${m.attack} · ER ${m.er} · BR ${m.br} · MR ${m.mr} · SR ${m.sr} · Speed ${m.speed} · ${m.actions} action${m.actions > 1 ? "s" : ""} · up to ${m.modsAllowed} modifiers`; };
    t.onchange = upd; d.onchange = upd; upd();
    wrap.append(panel("Monster calculator", note("Pick a type and a difficulty to see the starting stat block the rulebook gives. The full monster builder is part of the GM toolkit."), el("div", { class: "two" }, t, d), out));
    wrap.append(panel("Deities", ...GD.deities.map((x) => el("details", { class: "fold" }, el("summary", {}, x.name), el("p", { class: "small" }, ph(x.text).slice(0, 600) + "…")))));
    return wrap;
  };

  /* ============================================================ CASE LOG */
  tabs.log = () => {
    const c = CAMP.camp;
    return el("div", {}, panel("Case history", ...(c.history.length ? c.history.map((h) => el("p", { class: "small" }, `Day ${h.day} · ${h.title} (${h.year}): ${h.result}`)) : [note("No cases yet.")])),
      panel("Journal", ...c.log.slice(0, 60).map((l) => el("p", { class: "small" }, el("span", { class: "mono muted" }, `d${l.day} `), l.text))));
  };
})();
