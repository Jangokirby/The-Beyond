/* ============================================================================
   CAMPAIGN SCREENS — title, campaigns, new-campaign wizard, character creator,
   hub shell, mission briefing, level-up and debrief. Hub tabs live in camp-tabs.js.
   ========================================================================== */
(function () {
  const C = window.CDATA, GD = window.GD, G = window.GAME, U = window.UI, A = window.ART, CAMP = window.CAMP, el = U.el;
  const ui = (CAMP.ui = {});
  const root = () => U.$("#camp-root");
  const mount = (node, keep) => { const r = root(); const y = keep ? r.scrollTop : 0; G.show("screen-camp"); r.replaceChildren(node); r.scrollTop = y; };
  const btn = (label, fn, cls = "", extra = {}) => el("button", { class: "btn " + cls, onclick: () => { U.click(); fn(); }, ...extra }, label);
  const panel = (title, ...kids) => el("section", { class: "cpanel" }, title ? el("h3", {}, title) : null, ...kids);
  const cap = (s) => s[0].toUpperCase() + s.slice(1);
  const bar = (p, k) => el("div", { class: "pool " + k, title: `${R.POOL_LABEL[k]} ${p.cur}/${p.max}` },
    el("span", { class: "k" }, R.POOL_KANJI[k]), el("span", { class: "track" }, el("span", { class: "fill", style: { width: Math.max(0, (p.cur / p.max) * 100) + "%" } })), el("span", { class: "n" }, `${Math.max(0, p.cur)}/${p.max}`));
  ui.bar = bar; ui.btn = btn; ui.panel = panel; ui.cap = cap; ui.mount = mount;
  const portraitSrc = (ch) => U.img(ch.portraitKey || A.portrait(ch.look), "portraits");
  ui.portraitSrc = portraitSrc;
  const note = (txt, cls = "") => el("p", { class: "cnote " + cls }, txt);
  ui.note = note;
  const toast = (t) => U.toast(t);
  ui.toast = toast;
  const modal = (o) => U.modal(o);

  /* ================================================================== TITLE */
  ui.title = () => {
    const art = A.scene("street", "title");
    const list = CAMP.list();
    const body = el("div", { class: "ctitle" },
      el("img", { class: "ctitle-art", src: U.img(art), alt: "" }), el("div", { class: "ctitle-veil" }),
      el("div", { class: "ctitle-copy" },
        el("p", { class: "eyebrow" }, "A tabletop RPG by Gage Lee"),
        el("h1", { class: "title" }, el("span", {}, "The"), " ", el("span", {}, "Beyond")),
        el("p", { class: "pitch" }, "Pick a time. Pick an agency. Build an agent, buy your own gun, take the case. Between jobs, patch yourself up, buy a flat, and wonder what is watching."),
        el("div", { class: "title-actions" },
          list.length ? btn("Continue campaign", () => ui.campaigns(), "primary") : null,
          btn("New campaign", () => ui.newCampaign(), list.length ? "" : "primary"),
          btn("Rules library", () => ui.library(() => ui.title()), "ghost"),
          btn("GM workshop", () => ui.gmHome(), "ghost"),
          btn("Live table", () => window.LIVE && window.LIVE.entry(), "ghost"),
          btn("Settings", () => { AudioMan.unlock(); G.settingsModal(); }, "ghost"),
          window.BEYOND_INSTALL && !BEYOND_INSTALL.installed() && (BEYOND_INSTALL.available() || BEYOND_INSTALL.iosHint())
            ? btn("Install the game", async () => { if (BEYOND_INSTALL.available()) { if (await BEYOND_INSTALL.prompt()) U.toast("Installed. Open The Beyond from your home screen or app list."); }
              else U.modal({ title: "Install on iPhone or iPad", body: "<p>Tap the Share button in Safari, then <b>Add to Home Screen</b>. The game then opens full-screen like an app.</p>", buttons: [{ id: "ok", label: "OK", cls: "primary" }] }); }, "ghost") : null),
        el("p", { class: "fine" }, `${window.BEYOND_DESKTOP ? "Saved on this computer" : "Saved in this browser"}. Sound on, headphones if you have them.`)));
    mount(body);
    AudioMan.unlock().then(() => AudioMan.music("title"));
  };

  /* ================================================================== CAMPAIGN LIST */
  ui.campaigns = () => {
    const list = CAMP.list();
    const body = el("div", { class: "cwrap" }, el("h2", {}, "Your campaigns"),
      ...(list.length ? list.map((c) => {
        const ag = C.AGENCIES.find((a) => a.id === c.agency);
        return el("article", { class: "cpanel campaign-card" }, el("div", {}, el("b", {}, c.name), el("div", { class: "small muted" }, `${ag ? ag.short : c.agency} · ${c.year} · ${c.chars} active agent${c.chars === 1 ? "" : "s"}`)),
          el("div", { class: "row" }, btn("Open", () => { CAMP.load(c.id); ui.hub(); }, "primary"),
            btn("Delete", async () => {
              const r = await modal({ title: "Delete this campaign?", body: `<p>${c.name} and all its agents will be erased from this browser.</p>`, buttons: [{ id: "no", label: "Keep it" }, { id: "yes", label: "Delete", cls: "danger" }] });
              if (r === "yes") { CAMP.remove(c.id); ui.campaigns(); }
            }, "danger")));
      }) : [note("No campaigns yet.")]),
      el("div", { class: "row" }, btn("New campaign", () => ui.newCampaign(), "primary"), btn("Back", () => ui.title(), "ghost")));
    mount(body);
  };

  /* ================================================================== NEW CAMPAIGN WIZARD (period → agency → agent) */
  ui.newCampaign = (st) => {
    st = st || { step: 1, eraId: null, year: null, agency: null, name: "" };
    const redraw = () => ui.newCampaign(st);
    const body = el("div", { class: "cwrap" }, el("p", { class: "eyebrow" }, `Step ${st.step} of 3`));
    if (st.step === 1) {
      body.append(el("h2", {}, "When do you play?"), note("Agencies and adventures depend on the period you pick."));
      const grid = el("div", { class: "cardgrid" });
      for (const e of C.ERAS) {
        grid.append(el("button", { class: "ecard" + (st.eraId === e.id ? " sel" : ""), onclick: () => { U.click(); st.eraId = e.id; st.year = e.sample; st.agency = null; redraw(); } },
          el("img", { src: U.img(A.scene(({ medieval: "castle", victorian: "fog", wars: "trench", atomic: "street", modern: "modern", now: "future" })[e.id], e.id)), alt: "" }),
          el("div", { class: "etxt" }, el("b", {}, e.name), el("span", { class: "mono" }, e.to >= 2100 ? `${e.from} –` : `${e.from} – ${e.to}`), el("small", {}, e.blurb))));
      }
      body.append(grid);
      if (st.eraId) {
        const e = C.ERAS.find((x) => x.id === st.eraId);
        const out = el("b", { class: "yearbig" }, String(st.year));
        body.append(el("div", { class: "cpanel" }, el("label", { class: "field" }, el("span", {}, "Year"),
          el("input", { type: "range", min: String(e.from), max: String(Math.min(e.to, 2060)), value: String(st.year), oninput: (ev) => { st.year = +ev.target.value; out.textContent = st.year; ag.replaceChildren(...agencyHint(st.year)); } }), out),
          (() => null)()));
        var ag = el("div", { class: "small muted" }, ...agencyHint(st.year));
        body.append(ag);
      }
      body.append(el("div", { class: "row" }, btn("Back", () => ui.title(), "ghost"), btn("Choose an agency", () => { st.step = 2; redraw(); }, "primary", { disabled: !st.eraId })));
    } else if (st.step === 2) {
      body.append(el("h2", {}, `Which agency? · ${st.year}`), note("Only agencies founded by this year exist yet."));
      const grid = el("div", { class: "cardgrid" });
      for (const a of C.AGENCIES) {
        const ok = a.founded <= st.year;
        grid.append(el("button", { class: "acard" + (st.agency === a.id ? " sel" : "") + (ok ? "" : " locked"), disabled: !ok, onclick: () => { U.click(); st.agency = a.id; redraw(); } },
          el("div", { class: "crest" }, a.short), el("div", { class: "etxt" }, el("b", {}, a.name), el("span", { class: "mono" }, ok ? `Founded ${a.founded < 1000 ? "in the " + a.founded + "s" : a.founded} · ${a.home}` : `Not founded until ${a.founded}`), el("small", {}, a.blurb))));
      }
      body.append(grid, el("label", { class: "field" }, el("span", {}, "Campaign name"), el("input", { type: "text", maxlength: "40", value: st.name, placeholder: "e.g. Kanda Station", oninput: (e) => { st.name = e.target.value; } })),
        el("div", { class: "row" }, btn("Back", () => { st.step = 1; redraw(); }, "ghost"), btn("Create your first agent", () => {
          const c = CAMP.newCampaign({ name: st.name.trim() || `${C.AGENCIES.find((a) => a.id === st.agency).short} ${st.year}`, year: st.year, agency: st.agency });
          ui.creator(null, () => ui.hub());
        }, "primary", { disabled: !st.agency })));
    }
    mount(body);
  };
  const agencyHint = (y) => [C.agenciesIn(y).map((a) => a.short).join(", ") + ` can field agents in ${y}.`];

  /* ================================================================== CHARACTER CREATOR */
  /* where the agent is from and their gender: names, portraits and the "Local tongue" house rule follow them (js/people.js) */
  ui.originFields = (draft, redraw) => {
    const P = window.PEOPLE; if (!P) return null;
    const o = P.get(draft.origin);
    return el("div", { class: "two origin" },
      el("label", { class: "field" }, el("span", {}, "From"), el("select", { onchange: (e) => { draft.origin = e.target.value; redraw(); } },
        el("option", { value: "", selected: !draft.origin ? "selected" : null }, "Choose where they grew up"),
        ...P.ORIGINS.map((x) => el("option", { value: x.id, selected: draft.origin === x.id ? "selected" : null }, `${x.name} (${x.langs.join(", ")})`)))),
      el("label", { class: "field" }, el("span", {}, "Gender"), el("select", { onchange: (e) => { draft.sex = e.target.value; redraw(); } },
        el("option", { value: "", selected: !draft.sex ? "selected" : null }, "Choose"),
        ...P.SEXES.map(([v, l]) => el("option", { value: v, selected: draft.sex === v ? "selected" : null }, l)))),
      o ? el("p", { class: "small muted", style: { gridColumn: "1 / -1", margin: "0" } }, `Grew up speaking ${o.langs.join(" and ")}. Rolling picks a name from ${o.name} and a face to match.`) : null);
  };
  ui.creator = (draft, done) => {
    const c = CAMP.camp;
    draft = draft || CAMP.blankDraft();
    const hints = CAMP.GEAR_HINTS(c.year);
    const redraw = () => ui.creator(draft, done);
    const errs = CAMP.draftErrors(draft);
    const body = el("div", { class: "cwrap creator" },
      el("p", { class: "eyebrow" }, `${CAMP.agency().name} · ${c.year}`), el("h2", {}, "Create an agent"),
      el("div", { class: "row tight" }, btn("Roll a whole agent", () => { CAMP.rollDraft(draft); redraw(); }, "small primary"),
        el("small", { class: "muted" }, "Everything below can still be changed after a roll.")));

    /* ---- 1 who were you */
    const look = draft.look;
    const prev = el("img", { class: "lookprev", alt: "Portrait preview", src: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(A.portraitSvg(look)) });
    const swatch = (key, list) => el("div", { class: "swatches", role: "group" }, ...list.map((v) => el("button", { class: "sw" + (look[key] === v ? " on" : ""), style: { background: v }, "aria-label": v, onclick: () => { look[key] = v; redraw(); } })));
    const pick = (key, list) => el("select", { onchange: (e) => { look[key] = e.target.value; redraw(); } }, ...list.map((v) => el("option", { value: v, selected: look[key] === v ? "selected" : null }, cap(v))));
    const fld = (label, ctl) => el("label", { class: "field" }, el("span", {}, label), ctl);
    const grp = (title, open, ...kids) => el("details", { class: "lookgrp", open: open ? "open" : null }, el("summary", {}, title), el("div", { class: "lookgrid" }, ...kids));
    body.append(panel("1 · Who were you?",
      ui.originFields(draft, redraw),
      el("div", { class: "look" }, prev, el("div", { class: "lookctl" },
        grp("Face", true, fld("Skin", swatch("skin", A.SKIN)), fld("Face shape", pick("face", A.FACES)), fld("Eyes", pick("eyes", A.EYES)), fld("Eye colour", swatch("eyeC", A.EYEC)),
          fld("Eyebrows", pick("brows", A.BROWS)), fld("Nose", pick("nose", A.NOSES)), fld("Expression", pick("mouth", A.MOUTHS)), fld("Marks", pick("marks", A.MARKS))),
        grp("Hair", true, fld("Hair colour", swatch("hairC", A.HAIRC)), fld("Hairstyle", pick("hair", A.HAIRS)), fld("Facial hair", pick("facial", A.FACIAL))),
        grp("Clothes and background", true, fld("Clothes", pick("clothes", A.CLOTHES)), fld("Colour", swatch("outfit", A.OUTFIT)), fld("Accessory", pick("extra", A.EXTRAS)), fld("Background", swatch("bg", A.BGS))))),
      btn("Roll a name and look", () => { CAMP.rollLook(draft); draft.name = CAMP.rollName(draft.origin, draft.sex); redraw(); }, "small ghost"),
      el("div", { class: "two" },
        el("label", { class: "field" }, el("span", {}, "Name"), el("input", { type: "text", maxlength: "40", value: draft.name, oninput: (e) => { draft.name = e.target.value; refreshBar(); } })),
        el("label", { class: "field" }, el("span", {}, "Age"), el("input", { type: "number", min: "16", max: "90", value: String(draft.age), oninput: (e) => { draft.age = +e.target.value || 30; } }))),
      el("label", { class: "field" }, el("span", {}, "Backstory: how did you end up in this work?"), el("textarea", { rows: "4", oninput: (e) => { draft.bio = e.target.value; } }, draft.bio)),
      el("div", { class: "two" },
        el("label", { class: "field" }, el("span", {}, "Size"), el("select", { onchange: (e) => { draft.size = e.target.value; redraw(); } }, ...C.SIZES.map((s) => el("option", { value: s.id, selected: draft.size === s.id ? "selected" : null },
          `${s.name}${s.er ? `, ${s.er > 0 ? "+" : ""}${s.er} ER` : ""}${s.health ? `, ${s.health > 0 ? "+" : ""}${s.health} Health` : ""}${s.br ? `, +${s.br} BR` : ""}${s.attack ? `, +${s.attack} Attack` : ""}`)))),
        el("label", { class: "field" }, el("span", {}, "Languages besides English"), el("input", { type: "text", value: draft.languages, placeholder: window.PEOPLE && PEOPLE.get(draft.origin) ? `${PEOPLE.get(draft.origin).langs.filter((l) => l !== "English").join(", ") || "English only"} from home; more needs IQ above 3` : "needs IQ above 3 for more than your native one", oninput: (e) => { draft.languages = e.target.value; } })))));

    /* ---- 2 core stats and aspects */
    const rankLabel = { specialty: "Specialty (4)", good: "Good (3)", mundane: "Mundane (1)" };
    const coreBox = el("div", { class: "cores" });
    for (const k of ["body", "mind", "spirit"]) {
      const sel = el("select", { "aria-label": `${cap(k)} rank`, onchange: (e) => {
        const nv = e.target.value, old = draft.coreRank[k];
        const other = ["body", "mind", "spirit"].find((x) => x !== k && draft.coreRank[x] === nv);
        draft.coreRank[k] = nv; if (other) draft.coreRank[other] = old;
        draft.aspects = {};
        redraw();
      } }, ...Object.keys(rankLabel).map((r) => el("option", { value: r, selected: draft.coreRank[k] === r ? "selected" : null }, rankLabel[r])));
      const slots = CAMP.aspectSlots(draft.coreRank[k]);
      const col = el("div", { class: "corecol" }, el("h4", {}, cap(k), " ", el("span", { class: "mono" }, `${R.POOL_LABEL[R.POOL_CORE ? Object.keys(R.POOL_CORE).find((p) => R.POOL_CORE[p] === k) : k]} ${5 + 5 * ({ specialty: 4, good: 3, mundane: 1 })[draft.coreRank[k]]}+`)), sel);
      for (const asp of C.ASPECTS[k]) {
        const used = C.ASPECTS[k].filter((x) => x !== asp).map((x) => draft.aspects[x]).filter(Boolean);
        const avail = slots.filter((v, i) => !used.includes(v) || (draft.aspects[asp] === v));
        col.append(el("label", { class: "asp-row", title: C.ASPECT_HELP[asp] }, el("span", {}, C.ASPECT_NAMES[asp]),
          el("select", { onchange: (e) => { const v = +e.target.value; if (v) draft.aspects[asp] = v; else delete draft.aspects[asp]; redraw(); } },
            el("option", { value: "0" }, "0"), ...[...new Set(avail)].sort((a, b) => b - a).map((v) => el("option", { value: String(v), selected: draft.aspects[asp] === v ? "selected" : null }, String(v))))));
      }
      col.append(el("p", { class: "small muted" }, `Spend ${slots.join(", ")}`));
      coreBox.append(col);
    }
    body.append(panel("2 · Core Stats and Aspects", note("Assign Specialty (4), Good (3) and Mundane (1) to Body, Mind and Spirit. Each Core Stat gives values to spread over its five Aspects. The Aspect with your 4 is your Special Aspect."),
      coreBox, btn("Roll Core Stats and Aspects", () => { CAMP.rollAspects(draft); redraw(); }, "small primary"), btn("Auto-fill Aspects", () => {
        draft.aspects = {};
        const fav = { body: ["strength", "agility", "speed", "durability", "humors"], mind: ["awareness", "iq", "charisma", "willpower", "mindfulness"], spirit: ["morality", "faith", "potency", "occult", "ancient"] };
        for (const k of ["body", "mind", "spirit"]) CAMP.aspectSlots(draft.coreRank[k]).forEach((v, i) => { draft.aspects[fav[k][i]] = v; });
        redraw();
      }, "small")));

    /* ---- 3 background */
    const bgBox = el("div", { class: "bggrid" });
    for (const grp of ["Body", "Mind", "Spirit", "Other"]) {
      bgBox.append(el("h4", {}, grp === "Other" ? "Choice / other" : grp + " backgrounds"));
      for (const b of C.BACKGROUNDS.filter((x) => x.group === grp)) bgBox.append(el("button", { class: "bgcard" + (draft.bg === b.id ? " sel" : ""), onclick: () => { U.click(); draft.bg = b.id; redraw(); } }, el("b", {}, b.id), el("small", {}, b.text)));
    }
    const bgd = draft.bg && CAMP.bgDef(draft.bg);
    const extra = [];
    if (bgd && bgd.core === "choice") extra.push(el("label", { class: "field" }, el("span", {}, "+1 Core Stat to"), el("select", { onchange: (e) => { draft.bgCore = e.target.value; redraw(); } }, ...["body", "mind", "spirit"].map((k) => el("option", { value: k, selected: draft.bgCore === k ? "selected" : null }, cap(k))))));
    if (bgd && bgd.core === "choice2") extra.push(el("label", { class: "field" }, el("span", {}, "+1 to"), el("select", { onchange: (e) => { draft.bgBody = e.target.value; redraw(); } }, ...["body", "mind"].map((k) => el("option", { value: k, selected: draft.bgBody === k ? "selected" : null }, cap(k))))));
    if (bgd && bgd.aspectPlus) extra.push(el("label", { class: "field" }, el("span", {}, "+2 in which Aspect?"), el("select", { onchange: (e) => { draft.bgAspect = e.target.value; } }, ...Object.keys(C.ASPECT_NAMES).map((k) => el("option", { value: k, selected: draft.bgAspect === k ? "selected" : null }, C.ASPECT_NAMES[k])))));
    const ph2 = (t) => (t || "").replace(/\s+/g, " ");
    if (bgd && bgd.artifact) extra.push(el("div", {}, el("h4", {}, "Your Beyond Artifact"), note("Every artifact belonged to someone who is gone. Pick the one you carry."),
      el("div", { class: "bggrid" }, ...GD.artifacts.map((x) => el("button", { class: "bgcard" + (draft.pickArtifact === x.name ? " sel" : ""), onclick: () => { draft.pickArtifact = x.name; redraw(); } }, el("b", {}, x.name), el("small", {}, ph2(x.effects).slice(0, 140) + (x.effects.length > 140 ? "…" : "")))))));
    if (bgd && bgd.patron) extra.push(el("div", {}, el("h4", {}, "Your patron"), note("You begin with this patron's first gift. More gifts come from level-ups."),
      el("div", { class: "bggrid" }, ...GD.deities.map((d) => el("button", { class: "bgcard" + (draft.pickPatron === d.name ? " sel" : ""), onclick: () => { draft.pickPatron = d.name; redraw(); } }, el("b", {}, d.name), el("small", {}, ph2(d.domain || d.pantheon || "")), el("small", {}, ph2(d.demands || "").slice(0, 110)))))));
    const hasSpirit = (draft.aspects.occult || draft.aspects.faith || draft.aspects.ancient || bgd && bgd.words);
    body.append(panel("3 · Background", btn("Roll a background", () => { CAMP.rollBackground(draft); redraw(); }, "small primary"), bgBox, ...extra,
      el("label", { class: "field check" }, el("input", { type: "checkbox", checked: draft.magic.on ? "checked" : null, onchange: (e) => { draft.magic.on = e.target.checked; redraw(); } }), el("span", {}, "My agent uses magic (Occult, Faith or Ancient)")),
      draft.magic.on ? el("label", { class: "field" }, el("span", {}, "Magic source (decides your spell damage type)"), el("select", { onchange: (e) => { draft.magic.source = e.target.value; } },
        ...[["faith", "Faith · hits Stability"], ["occult", "Occult · hits Sanity"], ["ancient", "Ancient · hits Health"]].map(([v, t]) => el("option", { value: v, selected: draft.magic.source === v ? "selected" : null }, t)))) : null));

    /* ---- 4 bonds */
    body.append(panel("4 · Bonds", note("Three people close to you. Each starts at 10. When your Sanity would break, a Bond can take the damage instead, and the relationship suffers."),
      el("div", { class: "row tight" }, btn("Roll all three Bonds", () => { CAMP.rollBonds(draft, false); redraw(); }, "small primary"), btn("Roll relationships only", () => { CAMP.rollBonds(draft, true); redraw(); }, "small ghost")),
      ...draft.bonds.map((b, i) => el("div", { class: "two" },
        el("label", { class: "field" }, el("span", {}, `Bond ${i + 1}`), el("input", { type: "text", maxlength: "30", value: b.name, placeholder: "Name", oninput: (e) => { b.name = e.target.value; refreshBar(); } })),
        el("label", { class: "field" }, el("span", {}, "Who are they to you?"), el("input", { type: "text", maxlength: "50", value: b.rel, oninput: (e) => { b.rel = e.target.value; } })),
        window.BONDS ? el("label", { class: "field" }, el("span", {}, "Kind of bond (shapes your visits)"), el("select", { onchange: (e) => {
          const was = BONDS.def(b); b.type = e.target.value; const now = BONDS.TYPES[b.type];
          if (!b.rel.trim() || was.rels.includes(b.rel)) b.rel = now.rels[0]; redraw(); } },
          ...BONDS.ORDER.map((k) => el("option", { value: k, selected: BONDS.typeOf(b) === k ? "selected" : null }, BONDS.TYPES[k].label)))) : null,
        btn("Roll this Bond", () => { CAMP.rollBond(b, !!b.name.trim(), draft); redraw(); }, "small ghost")))));

    /* ---- 5 gear */
    const w = draft.weapon, ar = draft.armor;
    const heirs = window.SVC ? window.SVC.heirlooms() : [];
    if (heirs.length) body.append(panel("Heirlooms", note("A fallen agent's Heirloom can be passed on. It gains +1 for each owner, up to +5."),
      ...heirs.map((h) => btn(`Inherit ${h.item.name} (${h.from.name}, +${Math.min(5, h.owners + 1)})`, () => {
        const it = h.item;
        if (h.which === "weapon") { draft.weapon = { name: it.name, type: it.type, mods: [...it.mods], specialty: it.specialty, aspect: it.aspect, picks: { ...(it.picks || {}) } }; draft.weaponOwners = Math.min(5, h.owners + 1); }
        else { draft.armor = { name: it.name, type: it.type, mods: [...it.mods], specialty: it.specialty, picks: { ...(it.picks || {}) } }; draft.armorOwners = Math.min(5, h.owners + 1); }
        redraw();
      }, "small"))));
    const wT = GD.weaponTypes.find((x) => x.name === w.type);
    const ranged = /Ranged/.test(w.type);
    const modOK = (m) => { const banned = ranged ? GD.bannedRanged : GD.bannedMelee; return !banned.includes(m) && !GD.weaponTypes.some((o) => o.name !== w.type && o.only.includes(m) && m !== "Throwing"); };
    const modList = (all, chosen, filter, onToggle) => el("div", { class: "modlist" }, ...all.filter((m) => filter(m.name)).map((m) => {
      const on = chosen.includes(m.name);
      return el("label", { class: "modrow" + (on ? " on" : "") }, el("input", { type: "checkbox", checked: on ? "checked" : null, disabled: !on && chosen.length >= 2 ? "disabled" : null, onchange: () => onToggle(m.name) }), el("b", {}, m.name), el("small", {}, m.text));
    }));
    const toggle = (list, name) => { const i = list.indexOf(name); if (i >= 0) list.splice(i, 1); else if (list.length < 2) list.push(name); redraw(); };
    const pickBlock = (which, item) => {
      item.picks = item.picks || {};
      const keys = window.GEAR.pickKeys(which, item.mods, item.specialty);
      for (const k of Object.keys(item.picks)) if (!keys.includes(k)) delete item.picks[k];
      if (!keys.length) return null;
      return el("div", { class: "pickrow" }, ...keys.map((k) => {
        const def = window.GEAR.PICKS[which][k], opts = def.opts();
        if (!opts.includes(item.picks[k])) item.picks[k] = opts[0];
        return el("label", { class: "field" }, el("span", {}, `${k}: ${def.label}`),
          el("select", { onchange: (e) => { item.picks[k] = e.target.value; } }, ...opts.map((o) => el("option", { value: o, selected: item.picks[k] === o ? "selected" : null }, C.ASPECT_NAMES[o] || o))));
      }));
    };
    const aspects = CAMP.weaponAspects(w);
    if (!aspects.includes(w.aspect)) w.aspect = aspects[0];
    body.append(panel("5 · Weapon", btn("Roll a weapon and armor", () => { CAMP.rollGear(draft); redraw(); }, "small primary"), note(`One custom weapon. A type, 2 Modifiers and 1 Specialty. Want a gun? Take a Ranged type. ${c.year} suggestions: ${ranged ? hints.ranged : hints.melee}.`),
      el("div", { class: "two" },
        el("label", { class: "field" }, el("span", {}, "Name"), el("input", { type: "text", maxlength: "40", value: w.name, placeholder: ranged ? hints.ranged.split(",")[0] : hints.melee.split(",")[0], oninput: (e) => { w.name = e.target.value; refreshBar(); } })),
        el("label", { class: "field" }, el("span", {}, "Type"), el("select", { onchange: (e) => { w.type = e.target.value; w.mods = w.mods.filter(modOK); w.aspect = CAMP.weaponAspects(w)[0]; redraw(); } },
          ...GD.weaponTypes.map((t) => el("option", { value: t.name, selected: w.type === t.name ? "selected" : null }, `${t.name} · +${t.bonus} · ${t.zones ? "reaches 1 zone" : "same zone"}`))))),
      el("label", { class: "field" }, el("span", {}, "Attack Aspect"), el("select", { onchange: (e) => { w.aspect = e.target.value; } }, ...aspects.map((a) => el("option", { value: a, selected: w.aspect === a ? "selected" : null }, C.ASPECT_NAMES[a])))),
      el("h4", {}, `Modifiers (${w.mods.length}/2)`), modList(GD.weaponMods, w.mods, modOK, (n) => toggle(w.mods, n)), pickBlock("w", w),
      el("h4", {}, "Specialty (on a Critical hit)"),
      el("div", { class: "modlist" }, ...GD.weaponSpecialties.map((s) => el("label", { class: "modrow" + (w.specialty === s.name ? " on" : "") }, el("input", { type: "radio", name: "wspec", checked: w.specialty === s.name ? "checked" : null, onchange: () => { w.specialty = s.name; redraw(); } }), el("b", {}, s.name), el("small", {}, s.text))))));
    body.append(panel("6 · Armor", note(`Armor is part of who you are. ${c.year} suggestions: ${hints.armor}.`),
      el("div", { class: "two" },
        el("label", { class: "field" }, el("span", {}, "Name"), el("input", { type: "text", maxlength: "40", value: ar.name, placeholder: hints.armor.split(",")[0], oninput: (e) => { ar.name = e.target.value; refreshBar(); } })),
        el("label", { class: "field" }, el("span", {}, "Type"), el("select", { onchange: (e) => { ar.type = e.target.value; redraw(); } }, ...GD.armorTypes.map((t) => el("option", { value: t.name, selected: ar.type === t.name ? "selected" : null }, `${t.name} · +${t.br} BR · +${t.er} ER`))))),
      el("h4", {}, `Modifiers (${ar.mods.length}/2)`), modList(GD.armorMods, ar.mods, () => true, (n) => toggle(ar.mods, n)),
      pickBlock("a", ar),
      el("h4", {}, "Specialty"),
      el("div", { class: "modlist" }, ...GD.armorSpecialties.map((s) => el("label", { class: "modrow" + (ar.specialty === s.name ? " on" : "") }, el("input", { type: "radio", name: "aspec", checked: ar.specialty === s.name ? "checked" : null, onchange: () => { ar.specialty = s.name; redraw(); } }), el("b", {}, s.name), el("small", {}, s.text))))));

    /* ---- review + finish */
    const barEl = el("div", { class: "createbar" });
    const refreshBar = () => {
      const e2 = CAMP.draftErrors(draft);
      barEl.replaceChildren(
        e2.length ? el("details", { class: "errs" }, el("summary", {}, `${e2.length} thing${e2.length > 1 ? "s" : ""} left to finish`), el("ul", {}, ...e2.map((x) => el("li", {}, x)))) : el("span", { class: "ok" }, "Ready."),
        el("div", { class: "row" }, c.chars.length || done === undefined ? btn("Cancel", () => ui.hub(), "ghost") : btn("Cancel", () => ui.newCampaign(), "ghost"),
          btn("Create agent", () => {
            const ch = CAMP.buildChar(draft, c.year, c.agency);
            c.chars.push(ch);
            CAMP.logAdd(`${ch.name} joined the ${CAMP.agency().short}.`);
            CAMP.save();
            done ? done(ch) : ui.hub();
          }, "primary", { disabled: e2.length > 0 })));
    };
    refreshBar();
    mount(el("div", {}, body, barEl), true);
  };

  /* ================================================================== HUB SHELL */
  const TABS = [["hideout", "Hideout"], ["missions", "Missions"], ["agents", "Agents"], ["quarter", "Quartermaster"], ["home", "Home & Garage"], ["downtime", "Downtime"], ["artifacts", "Artifacts"], ["patrons", "Patrons"], ["library", "Library"], ["log", "Case log"]];
  ui.TABS = TABS;
  CAMP.tab = CAMP.tab || "hideout";
  CAMP.sel = null;
  ui.selected = () => {
    const act = CAMP.active();
    let ch = CAMP.sel && act.find((x) => x.id === CAMP.sel);
    if (!ch) { ch = act[0]; CAMP.sel = ch && ch.id; }
    return ch;
  };

  ui.hub = (tab) => {
    const c = CAMP.camp;
    if (!c) return ui.title();
    G.state = null; document.body.dataset.mode = "";
    U.flavor("");
    AudioMan.music("hideout");
    if (tab) CAMP.tab = tab;
    if (window.SVC && !ui._beyond && c.chars.some((x) => x.status === "active" && window.SVC.beyondOwed(x) > 0)) { ui._beyond = true; window.SVC.beyondCheck().then(() => { ui._beyond = false; ui.hub(); }); }
    if (!CAMP.active().length && c.chars.length && !c.chars.some((x) => x.status === "active")) return ui.wiped();
    const era = C.eraOf(c.year), ag = CAMP.agency();
    const head = el("header", { class: "hubhead" },
      el("div", { class: "hubtitle" }, el("div", { class: "crest sm" }, ag.short), el("div", {}, el("b", {}, c.name), el("small", { class: "mono" }, `${era.name} · ${c.year} · day ${c.day} · ${c.casesSolved} case${c.casesSolved === 1 ? "" : "s"} solved · ${c.favors.length} favor${c.favors.length === 1 ? "" : "s"}`))),
      el("div", { class: "row" }, btn("GM workshop", () => ui.gmHome(), "ghost small"), btn("Live table", () => window.LIVE && window.LIVE.entry(), "ghost small"), btn("Period", () => ui.changeEra(), "ghost small"), btn("Settings", () => G.settingsModal(), "ghost small"), btn("Title", () => ui.title(), "ghost small")));
    const nav = el("nav", { class: "hubnav", role: "tablist" }, ...TABS.map(([id, label]) => el("button", { role: "tab", "aria-selected": CAMP.tab === id ? "true" : "false", onclick: () => { U.click(); CAMP.tab = id; ui.hub(); } }, label)));
    const content = el("main", { class: "hubbody" });
    const fn = ui.tabs && ui.tabs[CAMP.tab];
    if (fn) content.append(fn());
    const pending = CAMP.active().filter((a) => a.pending > 0);
    const banner = pending.length ? el("button", { class: "lvbanner", onclick: () => ui.levelUp(pending[0]) }, `${pending[0].name} can level up${pending.length > 1 ? ` (and ${pending.length - 1} more)` : ""}. Tap to choose.`) : null;
    mount(el("div", { class: "hub" }, head, nav, banner, content), true);
  };

  ui.changeEra = () => {
    const c = CAMP.camp, ag = CAMP.agency();
    let year = c.year;
    const out = el("b", { class: "yearbig" }, String(year));
    const label = el("div", { class: "small muted" }, C.eraOf(year).name);
    const body = el("div", {}, el("p", { class: "small" }, `${ag.short} was founded in ${ag.founded < 1000 ? "the " + ag.founded + "s" : ag.founded}. Your agents can work in any year from then on, using the gear of the day. Adventures are listed by period.`),
      el("label", { class: "field" }, el("span", {}, "Year"), el("input", { type: "range", min: String(Math.max(ag.founded, 800)), max: "2060", step: "1", value: String(year), oninput: (e) => { year = +e.target.value; out.textContent = year; label.textContent = C.eraOf(year).name; } }), out), label);
    modal({ title: "Change time period", body, buttons: [{ id: "no", label: "Cancel" }, { id: "ok", label: "Go", cls: "primary" }] }).then((r) => {
      if (r === "ok") { c.year = year; CAMP.logAdd(`The campaign moved to ${year}.`); CAMP.save(); ui.hub("missions"); }
    });
  };

  ui.wiped = () => {
    const body = el("div", { class: "cwrap" }, el("h2", {}, "No agents left"), note("Everyone in this campaign is dead, retired, or lost. Create a new agent to continue in the same period."),
      el("div", { class: "row" }, btn("Create an agent", () => ui.creator(null, () => ui.hub()), "primary"), btn("Title", () => ui.title(), "ghost")));
    mount(body);
  };

  /* ================================================================== MISSION BRIEFING */
  ui.briefing = (advId) => {
    const c = CAMP.camp, adv = CAMP.advMeta(advId);
    const act = CAMP.active();
    const maxParty = window.LIVE && LIVE.tableOpen ? 6 : 3;
    const chosen = new Set((c.briefPick && c.briefPick.adv === advId ? c.briefPick.ids : [...act.filter((x) => x.ownerUid), ...act.filter((x) => !x.ownerUid)].slice(0, maxParty).map((x) => x.id)));
    const redraw = () => { c.briefPick = { adv: advId, ids: [...chosen] }; ui.briefing(advId); };
    const legacy = !!adv.legacy;
    const body = el("div", { class: "cwrap" },
      el("p", { class: "eyebrow" }, `${adv.setting} · ${adv.agencies.join(" / ")}`),
      el("h2", {}, adv.title),
      el("p", {}, adv.summary || (adv.text && adv.text.intro)),
      el("h4", {}, "Primary objectives"), el("ol", {}, ...adv.objectives.filter((o) => o.kind === "primary").map((o) => el("li", {}, o.t))),
      el("p", { class: "small muted" }, "Secondary objectives are not disclosed. Find them."));
    const team = el("div", { class: "cpanel" }, el("h3", {}, `Who goes? (up to ${maxParty})`));
    for (const ch of act) {
      const probs = CAMP.commitCheck(ch), on = chosen.has(ch.id);
      team.append(el("label", { class: "pickrow" + (on ? " on" : "") }, el("input", { type: "checkbox", checked: on ? "checked" : null, disabled: !on && chosen.size >= maxParty ? "disabled" : null, onchange: () => { if (on) chosen.delete(ch.id); else chosen.add(ch.id); redraw(); } }),
        el("img", { class: "chip", src: portraitSrc(ch), alt: "" }),
        el("div", {}, el("b", {}, ch.name), el("small", {}, `Lv ${ch.level} · ${ch.background} · ${R.POOL_LABEL.health} ${ch.pools.health.cur}/${ch.pools.health.max} · ${R.POOL_LABEL.sanity} ${ch.pools.sanity.cur}/${ch.pools.sanity.max} · ${R.POOL_LABEL.stability} ${ch.pools.stability.cur}/${ch.pools.stability.max}`),
          el("small", { class: "kit" }, `Kit: ${ch.assets.filter((x) => x.kind === "item" && (x.committed || x.owned)).map((x) => (x.custom ? x.name : CAMP.itemName(x.ref, adv.year))).join(", ") || "nothing committed"} · SP ${CAMP.spUsed(ch)}/${CAMP.spMax(ch)}`),
          ...probs.map((p) => el("small", { class: "warn" }, p)))));
    }
    const picks = act.filter((x) => chosen.has(x.id));
    const bad = picks.some((ch) => CAMP.commitCheck(ch).length);
    const hurt = picks.some((ch) => ["health", "sanity", "stability"].some((k) => ch.pools[k].cur < ch.pools[k].max * 0.5));
    const fillable = legacy && picks.length < 3;
    body.append(team,
      ...[hurt ? note("Someone is hurt. The Downtime tab is where wounds heal.", "warn") : null,
      fillable ? note(`This module is written for three agents. ${3 - picks.length} premade agent${3 - picks.length > 1 ? "s" : ""} will join you.`) : null].filter(Boolean),
      el("div", { class: "row" }, btn("Back", () => ui.hub("missions"), "ghost"), btn("Quartermaster", () => ui.hub("quarter"), "ghost"),
        btn("Begin", async () => {
          try { await CAMP.startMission(advId, [...chosen]); } catch (e) { modal({ title: "Not ready", body: `<p>${e.message}</p>`, buttons: [{ id: "ok", label: "OK" }] }); }
        }, "primary", { disabled: !picks.length || bad })));
    mount(body);
  };

  /* ================================================================== LEVEL UP */
  ui.levelUp = (a) => {
    const st = { core: "body", asp: {}, benefit: "promotion", question: "", injury: 0 };
    const pts = () => Object.values(st.asp).reduce((s, n) => s + n, 0);
    const redraw = () => {
      const left = 2 - pts();
      const body = el("div", { class: "cwrap" }, el("p", { class: "eyebrow" }, `${a.name} · level ${a.level} → ${a.level + 1}`), el("h2", {}, "Level up"),
        note(`Every 2 missions: +1 Core Stat, +2 Aspect points, and one of five benefits. Aspects cap at level +2 (your Special Aspect: level +3), so at level ${a.level + 1}: ${a.level + 3} / ${a.level + 4}.`));
      body.append(panel("+1 Core Stat (and +5 to its Healing Pool)", el("div", { class: "seg" }, ...["body", "mind", "spirit"].map((k) => el("button", { class: "segbtn" + (st.core === k ? " on" : ""), onclick: () => { st.core = k; redraw(); } }, `${cap(k)} ${a.core[k]} → ${a.core[k] + 1}`)))));
      const asp = el("div", { class: "aspgrid" });
      for (const k of Object.keys(C.ASPECT_NAMES)) {
        const cur = a.aspects[k] || 0, add = st.asp[k] || 0, cap2 = a.special === k ? a.level + 4 : a.level + 3;
        asp.append(el("div", { class: "asp-row" }, el("span", {}, C.ASPECT_NAMES[k], a.special === k ? " ★" : ""), el("span", { class: "stepper" },
          el("button", { class: "icon-btn", disabled: !add, "aria-label": "Less", onclick: () => { st.asp[k] = add - 1; if (!st.asp[k]) delete st.asp[k]; redraw(); } }, "−"), el("b", {}, String(cur + add)),
          el("button", { class: "icon-btn", disabled: left <= 0 || cur + add >= cap2, "aria-label": "More", onclick: () => { st.asp[k] = add + 1; redraw(); } }, "+"))));
      }
      body.append(panel(`+2 Aspect points (${left} left)`, asp));
      const bens = el("div", { class: "bggrid" });
      for (const b of C.BENEFITS) bens.append(el("button", { class: "bgcard" + (st.benefit === b.id ? " sel" : ""), disabled: b.id === "recovery" && !a.injuries.length, onclick: () => { st.benefit = b.id; redraw(); } }, el("b", {}, b.name), el("small", {}, b.text)));
      body.append(panel("One benefit", bens,
        st.benefit === "answers" ? el("label", { class: "field" }, el("span", {}, "Your question for the GM"), el("input", { type: "text", maxlength: "200", value: st.question, oninput: (e) => { st.question = e.target.value; } })) : null,
        st.benefit === "recovery" ? el("label", { class: "field" }, el("span", {}, "Which injury?"), el("select", { onchange: (e) => { st.injury = +e.target.value; } }, ...a.injuries.map((i, n) => el("option", { value: String(n) }, i.name)))) : null,
        st.benefit === "artifact" ? note("You will claim the artifact in the Artifacts tab.") : null, st.benefit === "patron" ? note("You will choose or advance a patron in the Patrons tab.") : null));
      body.append(el("div", { class: "row" }, btn("Later", () => ui.hub(), "ghost"), btn("Level up", () => {
        CAMP.levelUp(a, { core: st.core, aspects: st.asp, benefit: st.benefit, question: st.question, injury: st.injury });
        CAMP.save(); toast(`${a.name} is now level ${a.level}.`);
        if (a.pending > 0) ui.levelUp(a); else ui.hub();
      }, "primary", { disabled: left !== 0 })));
      mount(body);
    };
    redraw();
  };

  /* ================================================================== DEBRIEF */
  ui.debrief = (out) => {
    G.state = null; document.body.dataset.mode = "";
    const body = el("div", { class: "cwrap" },
      el("p", { class: "eyebrow" }, out.title), el("h2", {}, out.solved ? "Case solved" : "Case not solved"),
      note(`Primary objectives: ${out.primDone} of ${out.primTotal}.${out.solved ? " Cases Solved +1." : " It won't count toward Cases Solved."}`),
      out.favors ? note(`${out.favors} Favor${out.favors > 1 ? "s" : ""} earned. A Favor waives one commit on any Quality (or lesser) item, housing or vehicle for a mission.`) : null,
      el("ul", { class: "fates" }, ...out.lines.map((l) => el("li", {}, l))),
      out.world && out.world.length ? el("div", { class: "dwall" }, el("h4", {}, "On the wall"), el("ul", { class: "fates" }, ...out.world.map((l) => el("li", {}, l)))) : null,
      out.levelUps.length ? note(`${out.levelUps.join(", ")} can level up.`, "good") : null,
      el("div", { class: "row" }, btn("Return to HQ", () => ui.hub(out.levelUps.length ? "agents" : "missions"), "primary")));
    mount(body);
  };

  /* ================================================================== boot */
  CAMP.boot = () => { ui.title(); };
})();
