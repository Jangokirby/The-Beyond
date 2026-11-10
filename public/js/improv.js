/* ============================================================================
   RUN A GAME — a GM runs the players live, with no written case.
   From the campaign hub: "Run a game (GM)". The GM names the case, the goal
   and the opening scene, picks who goes, and plays. During any case with GM
   tools on (always, in a game run this way) the Director (✦ in the case bar)
   builds the rest on the fly, and the players see it all as it happens:
     Scene      make a place and take everyone there (picture, music, sound bed,
                light), or go back to one; give the players things to do there
     People     bring someone in (or roll a stranger) and speak as them
     Roll       call for a roll: one agent or everyone, any Aspect and CR
     Fight      pick monsters by type and difficulty (the book's builder) and a
                room layout, and start the fight
     Clues      write a clue or handout and give it to the party
     Goals      add objectives and tick them off
     End        close the case (solved or not), and keep it as a written case
                in the GM workshop if you want to run it again
   ========================================================================== */
(function () {
  const CAMP = window.CAMP, ADV = window.ADV, U = window.UI, el = U.el, R = window.R, C = window.CDATA;
  if (!CAMP || !CAMP.ui || !ADV) return;
  const ui = CAMP.ui;
  const IM = (window.IMPROV = {});
  const uid = (p) => p + Math.random().toString(36).slice(2, 7);
  const esc = (t) => String(t || "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  const THEMES = (window.ART && window.ART.themes) || ["street", "interior", "cellar", "forest", "village", "church", "sea"];
  const MOODS = [["calm", "Calm"], ["tense", "Tense"], ["dread", "Dread"], ["weird", "Wrong"], ["boss", "The end is near"]];
  const BEDS = [["", "From the place"], ["none", "Silence"], ["rain", "Rain"], ["storm", "Storm"], ["wind", "Wind"], ["sea", "Sea"], ["night", "Night insects"], ["fire", "Fire"], ["city", "City"], ["train", "Train"], ["building", "Building hum"], ["boiler", "Boiler"], ["dread", "Low dread"]];
  const LIGHT = [["normal", "Lit"], ["shadow", "Shadow (−2)"], ["dark", "Dark (Blind)"], ["bright", "Bright"]];
  const CRS = [["easy", "Easy 7"], ["medium", "Medium 10"], ["challenging", "Challenging 14"], ["dangerous", "Dangerous 18"], ["hopeless", "Hopeless 20"]];
  const LAYOUTS = {
    line: { name: "Three rooms in a row", zones: [[0, 0], [1, 0], [2, 0]], edges: [[0, 1], [1, 2]] },
    square: { name: "Four rooms in a square", zones: [[0, 0], [1, 0], [0, 1], [1, 1]], edges: [[0, 1], [0, 2], [1, 3], [2, 3]] },
    one: { name: "One room", zones: [[0, 0]], edges: [] },
    hall: { name: "A hall with two side rooms", zones: [[1, 0], [0, 1], [1, 1], [2, 1]], edges: [[0, 2], [1, 2], [2, 3]] }
  };
  const sel = (opts, val, on) => el("select", { onchange: (e) => on(e.target.value) }, ...opts.map(([v, t]) => el("option", { value: v, selected: v === val ? "selected" : null }, t)));
  const field = (label, input) => el("label", { class: "field" }, el("span", {}, label), input);
  const input = (ph, val = "") => el("input", { type: "text", placeholder: ph, value: val });
  const area = (ph, rows = 3) => el("textarea", { rows: String(rows), placeholder: ph });

  /* ------------------------------------------------------------ the running case */
  const G = () => window.GAME, M = () => window.MODULE;
  const src = () => (M() && M().src) || null;
  IM.active = () => !!(src() && src().improv);
  IM.allowed = () => !!(G() && G().state && M()) && ((window.LIVE && LIVE.hosting && LIVE.hosting()) || !!(CAMP.camp && CAMP.camp.rules && CAMP.camp.rules.gmTools) || IM.active());
  /* add pieces to the case that is running: compile them the normal way and merge them in */
  const merge = (piece) => {
    const a = src(), m = M();
    const part = { id: a.id, title: a.title, year: a.year, agencies: a.agencies, objectives: m.objectives, clues: {}, npcs: {}, enemies: {}, encounters: {}, scenes: {}, start: a.start, ...piece };
    const P = ADV.compile(part);
    for (const k of ["npcs", "enemies", "encounters", "locations"]) Object.assign(m[k], P[k]);
    Object.assign(m.modText || (m.modText = {}), P.modText || {});
    for (const k of ["npcs", "enemies", "encounters", "scenes", "clues"]) if (piece[k]) a[k] = { ...(a[k] || {}), ...piece[k] };
  };
  /* everything the Director does runs as one beat of the game, like a player's action */
  const beat = (fn) => { const g = G(); if (g.busy) return U.toast("Wait for the current moment to finish."); U.closeModal && U.closeModal(); g.run(fn); };
  const api = () => G().api;

  /* ------------------------------------------------------------ start a game */
  IM.setup = () => {
    const c = CAMP.camp; if (!c) return;
    const era = C.eraOf(c.year);
    const f = { title: input("e.g. The Lights on Marsh Lane"), setting: input(`e.g. Norfolk · ${c.year}`), goal: input("e.g. Find out why the lights come back every night"),
      scene: input("e.g. The village green at dusk"), say: area("What the players see first. You can keep talking once you're in.", 4) };
    let theme = "village", mood = "calm";
    const body = el("div", { class: "grid" },
      el("p", { class: "small muted" }, `You run this one. There's no script: the Director (✦ in the case bar) lets you build scenes, people, rolls, fights and clues as you go, and the players see everything as it happens. ${era.name}, ${c.year}.`),
      field("Case title", f.title), field("Where and when", f.setting), field("What the agents are sent to do", f.goal),
      field("The first scene", f.scene), el("div", { class: "two" }, field("Picture", sel(THEMES.map((t) => [t, t]), theme, (v) => (theme = v))), field("Mood", sel(MOODS, mood, (v) => (mood = v)))),
      field("Opening narration", f.say));
    U.modal({ title: "Run a game", cls: "wide", body, buttons: [{ id: "no", label: "Cancel" }, { id: "go", label: "Choose who goes", cls: "primary" }] }).then((r) => {
      if (r !== "go") return;
      const a = {
        id: uid("improv-"), improv: true, custom: false, title: f.title.value.trim() || "An unwritten case", setting: f.setting.value.trim() || `${era.name} · ${c.year}`, year: c.year, level: [1, 9], agencies: [c.agency],
        summary: f.goal.value.trim() || "The GM will tell you.", objectives: [{ id: "po1", kind: "primary", t: f.goal.value.trim() || "Do what you were sent to do", done: "" }],
        clues: {}, npcs: {}, enemies: {}, encounters: {}, start: "s1",
        scenes: { s1: { name: f.scene.value.trim() || "Where it starts", theme, mood, lighting: "normal", weather: "", cast: [], onEnter: f.say.value.trim() ? [{ once: "in", steps: [{ say: esc(f.say.value.trim()) }] }] : [], options: [] } }
      };
      ADV.register(a);
      c.rules.gmTools = true; CAMP.save();
      ui.briefing(a.id);
    });
  };

  /* ------------------------------------------------------------ the Director */
  let tab = "scene";
  IM.open = () => {
    if (!IM.allowed()) return U.toast("The Director works during a case, with GM tools on.");
    const pane = el("div", { class: "gmscreen director" });
    const draw = () => {
      const tabs = [["scene", "Scene"], ["people", "People"], ["roll", "Roll"], ["fight", "Fight"], ["clues", "Clues"], ["goals", "Goals"], ["end", "End"]];
      pane.replaceChildren(el("div", { class: "seg" }, ...tabs.map(([k, t]) => el("button", { class: "segbtn" + (tab === k ? " on" : ""), onclick: () => { tab = k; draw(); } }, t))), TABS[tab](draw));
    };
    draw();
    U.modal({ title: "Director", cls: "wide gmmodal", body: pane });
  };
  const TABS = {};

  TABS.scene = () => {
    const a = src(), cur = G().state.loc;
    const name = input("Name of the place"), say = area("What they see, hear and smell when they arrive"), opts = { theme: "interior", mood: "tense", weather: "", lighting: "normal" };
    const w = el("div", {},
      el("h4", {}, "A new scene"), field("Name", name),
      el("div", { class: "two" }, field("Picture", sel(THEMES.map((t) => [t, t]), opts.theme, (v) => (opts.theme = v))), field("Mood (music)", sel(MOODS, opts.mood, (v) => (opts.mood = v)))),
      el("div", { class: "two" }, field("Sound", sel(BEDS, opts.weather, (v) => (opts.weather = v))), field("Light", sel(LIGHT, opts.lighting, (v) => (opts.lighting = v)))),
      field("Arrival", say),
      el("button", { class: "btn small primary", onclick: () => {
        const id = uid("s"), sc = { name: name.value.trim() || "Somewhere else", ...opts, cast: [], onEnter: say.value.trim() ? [{ once: "in", steps: [{ say: esc(say.value.trim()) }] }] : [], options: [] };
        merge({ scenes: { [id]: sc } });
        beat(() => api().goto(id));
      } }, "Take everyone there"));
    const others = Object.entries(a.scenes || {}).filter(([id]) => id !== cur && M().locations[id]);
    if (others.length) w.append(el("h4", {}, "Go back to"), el("div", { class: "gmlist" }, ...others.map(([id, sc]) => el("button", { class: "btn small ghost", onclick: () => beat(() => api().goto(id)) }, sc.name))));
    /* things the players can do here, without the GM */
    const here = (a.scenes || {})[cur];
    if (here) {
      const lab = input("e.g. Search the vestry"), kind = { v: "say" }, text = area("What happens (or what they find on a success)", 2), fail = area("On a failure", 2);
      let asp = "awareness", cr = "medium";
      const opBox = el("div", {});
      const drawOp = () => opBox.replaceChildren(...(kind.v === "check" ? [el("div", { class: "two" }, field("Aspect", sel(Object.entries(R.ASPECT_LABEL), asp, (v) => (asp = v))), field("Difficulty", sel(CRS, cr, (v) => (cr = v)))), field("On a success", text), field("On a failure", fail)] : [field("What happens", text)]));
      drawOp();
      w.append(el("h4", {}, `Something to do in ${here.name}`), el("p", { class: "small muted" }, "It appears in the players' choices here. They can use it while you think."),
        field("What the players see", lab), field("Kind", sel([["say", "Something happens (you write it)"], ["check", "A roll decides it"]], kind.v, (v) => { kind.v = v; drawOp(); })), opBox,
        el("button", { class: "btn small", onclick: () => {
          if (!lab.value.trim()) return U.toast("Name the action first.");
          const steps = kind.v === "check" ? [{ check: { aspect: asp, cr, label: lab.value.trim(), investigate: asp === "iq" || asp === "awareness", ok: text.value.trim() ? [{ say: esc(text.value.trim()) }] : [], fail: fail.value.trim() ? [{ say: esc(fail.value.trim()) }] : [] } }] : [{ say: esc(text.value.trim() || "Nothing comes of it.") }];
          here.options = [...(here.options || []), { label: lab.value.trim(), once: kind.v === "check", steps }];
          merge({ scenes: { [cur]: here } });
          if (!G().busy) G().showIdle(); U.toast("Added to the players' choices.");
        } }, "Add it"));
    }
    return w;
  };

  TABS.people = (draw) => {
    const a = src(), cur = G().state.loc, here = (a.scenes || {})[cur];
    const name = input("Name"), tag = input("Who they are, e.g. Verger · nervous"), look = input("How they look and act");
    let sex = "f";
    const roll = () => { const origin = (window.PEOPLE && PEOPLE.originForPlace && PEOPLE.originForPlace(a.setting)) || null; name.value = CAMP.rollName ? CAMP.rollName(origin, sex) : "A stranger"; };
    const w = el("div", {}, el("h4", {}, "Bring someone in"), el("div", { class: "two" }, field("Name", name), field("Woman or man", sel([["f", "Woman"], ["m", "Man"]], sex, (v) => (sex = v)))),
      el("button", { class: "btn tiny ghost", onclick: roll }, "Roll a name"), field("Who they are", tag), field("Look and manner", look),
      el("button", { class: "btn small primary", onclick: () => {
        if (!name.value.trim()) roll();
        const id = uid("n"); merge({ npcs: { [id]: { name: name.value.trim(), tag: tag.value.trim(), look: look.value.trim(), face: { sex } } } });
        if (here) { here.cast = [...(here.cast || []), id]; merge({ scenes: { [cur]: here } }); }
        G().renderCast(); U.print(`<b>${esc(name.value.trim())}</b>${tag.value.trim() ? `, ${esc(tag.value.trim())}` : ""}. ${esc(look.value.trim())}`, "narr gmline"); draw();
      } }, "Bring them in"));
    const npcs = Object.entries(M().npcs || {});
    if (npcs.length) {
      let who = npcs[0][0]; const line = area("What they say", 2);
      w.append(el("h4", {}, "Speak as someone"), field("Who", sel(npcs.map(([id, n]) => [id, n.name]), who, (v) => (who = v))), line,
        el("button", { class: "btn small", onclick: () => { if (!line.value.trim()) return; U.print(`“${esc(line.value.trim())}”`, "said", { who: M().npcs[who] }); line.value = ""; } }, "Say it"),
        here ? el("div", { class: "gmlist" }, ...npcs.filter(([id]) => (here.cast || []).includes(id)).map(([id, n]) => el("button", { class: "btn tiny ghost", onclick: () => { here.cast = here.cast.filter((x) => x !== id); merge({ scenes: { [cur]: here } }); G().renderCast(); draw(); } }, `${n.name} leaves`))) : null);
    }
    return w;
  };

  TABS.roll = () => {
    let asp = "awareness", cr = "medium", who = "choose", pool = "", dmg = 3;
    const label = input("What the roll is for, e.g. Keep your footing on the ice");
    return el("div", {}, el("h4", {}, "Call for a roll"), field("For", label),
      el("div", { class: "two" }, field("Aspect", sel(Object.entries(R.ASPECT_LABEL), asp, (v) => (asp = v))), field("Difficulty", sel(CRS, cr, (v) => (cr = v)))),
      field("Who rolls", sel([["choose", "One agent (the players choose)"], ["all", "Everyone"], ...G().active().map((x) => [x.id, x.name])], who, (v) => (who = v))),
      el("div", { class: "two" }, field("On a failure, they lose", sel([["", "nothing"], ["health", "Health"], ["sanity", "Sanity"], ["stability", "Stability"]], pool, (v) => (pool = v))),
        field("How much", el("input", { type: "number", min: "1", max: "20", value: dmg, oninput: (e) => (dmg = Math.max(1, +e.target.value || 1)) }))),
      el("button", { class: "btn small primary", onclick: () => beat(async () => {
        const lab = label.value.trim() || "A roll";
        const hurt = (agents) => { if (!pool) return; for (const x of agents) x.pools[pool].cur = Math.max(1, x.pools[pool].cur - dmg); G().refreshParty(); window.AudioMan && AudioMan.sfx(pool + "_hit"); };
        if (who === "all") {
          const res = await G().groupCheck({ aspect: asp, cr: R.cr(cr), label: lab, intro: "" });
          const failed = res.filter((x) => !x.ok).map((x) => x.agent || x.a).filter(Boolean); hurt(failed);
        } else {
          const r = await G().check({ aspect: asp, cr: R.cr(cr), label: lab, who: who === "choose" ? "choose" : who, investigate: asp === "iq" || asp === "awareness" });
          if (!r.ok && r.agent) hurt([r.agent]);
        }
      }) }, "Roll"));
  };

  TABS.fight = () => {
    const types = Object.keys(ADV.MB.TYPES);
    const rows = [{ name: "", type: "Undead", difficulty: "medium", n: 1, dtype: "health" }];
    let layout = "line"; const roomNames = input("Room names, left to right (optional), e.g. Porch, Nave, Crypt"); const text = input("What the agents see when it starts");
    const box = el("div", {});
    const drawRows = () => box.replaceChildren(...rows.map((r, i) => el("div", { class: "gmrow wrap" },
      el("input", { type: "text", placeholder: "Name, e.g. The Drowned Verger", value: r.name, oninput: (e) => (r.name = e.target.value) }),
      sel(types.map((t) => [t, t]), r.type, (v) => (r.type = v)), sel(CRS.map(([v, t]) => [v, t.split(" ")[0]]), r.difficulty, (v) => (r.difficulty = v)),
      sel([["health", "hits Health"], ["sanity", "hits Sanity"], ["stability", "hits Stability"]], r.dtype, (v) => (r.dtype = v)),
      el("input", { type: "number", min: "1", max: "6", value: r.n, style: { width: "4em" }, title: "How many", oninput: (e) => (r.n = Math.max(1, Math.min(6, +e.target.value || 1))) }),
      rows.length > 1 ? el("button", { class: "btn tiny ghost", onclick: () => { rows.splice(i, 1); drawRows(); } }, "×") : null)),
      el("button", { class: "btn tiny ghost", onclick: () => { rows.push({ name: "", type: "Human", difficulty: "easy", n: 2, dtype: "health" }); drawRows(); } }, "+ another kind"));
    drawRows();
    const SPR = { Human: "humanoid", Undead: "undead", Spirit: "spirit", Feral: "beast", Folklore: "beast", Golem: "construct", Construct: "construct", Beyond: "beyond", Divine: "spirit", Swarm: "swarm" };
    return el("div", {}, el("h4", {}, "Start a fight"), el("p", { class: "small muted" }, "Monsters are built with the rulebook's type and difficulty tables. Up to six of each kind."),
      box, field("Rooms", sel(Object.entries(LAYOUTS).map(([k, l]) => [k, l.name]), layout, (v) => (layout = v))), roomNames, field("Opening line", text),
      el("button", { class: "btn small primary", onclick: () => {
        const L = LAYOUTS[layout], names = roomNames.value.split(",").map((x) => x.trim()).filter(Boolean);
        const zid = (i) => "z" + i, enemies = {}, foes = [];
        rows.forEach((r, i) => {
          const id = uid("e"), nm = r.name.trim() || `${r.type} ${i + 1}`;
          enemies[id] = { build: { name: nm, type: r.type, difficulty: r.difficulty, sprite: SPR[r.type] || "beyond", hue: Math.floor(Math.random() * 360), dtype: r.dtype } };
          for (let k = 0; k < r.n; k++) foes.push({ t: id, zone: zid(Math.min(L.zones.length - 1, L.zones.length - 1 - (k % Math.max(1, L.zones.length - 1)))), name: r.n > 1 ? `${nm} (${k + 1})` : nm });
        });
        const here = (src().scenes || {})[G().state.loc] || {};
        const encId = uid("f");
        const enc = { name: here.name || "The fight", theme: here.theme || "interior", fightText: esc(text.value.trim()), start: zid(0),
          zones: L.zones.map(([col, row], i) => ({ id: zid(i), name: names[i] || `Room ${i + 1}`, col, row })), edges: L.edges.map(([x, y]) => [zid(x), zid(y)]), foes };
        merge({ enemies, encounters: { [encId]: enc } });
        beat(async () => {
          const out = await window.COMBAT.start(encId, { canFlee: true });
          if (out === "wiped") return CAMP.endAdventure("wiped");
          if (out === "fled") await api().narrate("You get out alive. Whatever it was is still there.");
          await api().goto(G().state.loc);
        });
      } }, "Fight!"));
  };

  TABS.clues = (draw) => {
    const t = input("What it is, e.g. The verger's diary"), x = area("What it says or shows. This is what the players read.", 4), s = input("Where it was found (optional)");
    const m = M(), have = G().state.clues;
    return el("div", {}, el("h4", {}, "Give the party a clue or handout"), field("Title", t), field("Text", x), field("Found at", s),
      el("button", { class: "btn small primary", onclick: () => {
        if (!t.value.trim()) return U.toast("Give it a title.");
        const id = uid("c"), c = { t: t.value.trim(), x: esc(x.value.trim()), s: s.value.trim() };
        m.clues[id] = c; src().clues = { ...(src().clues || {}), [id]: c };
        api().clue(id); if (window.HANDOUT) HANDOUT.show(c, m); else draw();
      } }, "Hand it over"),
      el("h4", {}, "Clues they have"), el("ul", { class: "small" }, ...have.map((id) => el("li", {}, (m.clues[id] || {}).t || id))));
  };

  TABS.goals = (draw) => {
    const m = M(), t = input("e.g. Find the missing choirboy"); let kind = "secondary";
    return el("div", {}, el("h4", {}, "Objectives"),
      el("ul", { class: "gmgoals" }, ...m.objectives.map((o) => el("li", {}, el("span", {}, `${o.kind === "primary" ? "Primary" : "Secondary"}: ${o.t}`), " ",
        G().state.obj[o.id] === "done" ? el("b", {}, "done") : el("button", { class: "btn tiny", onclick: () => beat(() => api().complete(o.id)) }, "Mark done")))),
      el("div", { class: "two" }, field("New objective", t), field("Kind", sel([["secondary", "Secondary"], ["primary", "Primary"]], kind, (v) => (kind = v)))),
      el("button", { class: "btn small", onclick: () => { if (!t.value.trim()) return; const o = { id: uid("o"), kind, t: t.value.trim(), done: "" }; m.objectives.push(o); if (src().objectives !== m.objectives) src().objectives.push(o); if (kind === "primary") U.toast("The players are told: " + o.t); draw(); } }, "Add"));
  };

  TABS.end = () => {
    const a = src();
    const keep = () => {
      if (!window.GM) return;
      const c = JSON.parse(JSON.stringify(a)); c.id = "gm-" + Math.random().toString(36).slice(2, 8); c.improv = false; c.custom = true; c.notes = (c.notes || "") + `\nRun live on ${new Date().toLocaleDateString()}.`;
      /* scenes the GM made by hand need a way on: link them in the order they were visited */
      const ids = Object.keys(c.scenes); ids.forEach((id, i) => { const s = c.scenes[id]; s.options = s.options || []; if (ids[i + 1] && !s.options.some((o) => (o.steps || []).some((st) => st.goto))) s.options.push({ label: `Go to ${c.scenes[ids[i + 1]].name}`, steps: [{ goto: ids[i + 1] }] }); });
      const last = c.scenes[ids[ids.length - 1]]; last.options.push({ label: "Close the case", steps: [{ end: "win" }] });
      for (const [id, e] of Object.entries(c.encounters || {})) { const s = Object.values(c.scenes).find((x) => x.name === e.name) || last; s.options.unshift({ label: `Fight: ${e.name}`, once: true, steps: [{ combat: id, win: [] }] }); }
      window.GM.save(c); U.toast(`Saved to the GM workshop as "${c.title}". Edit it there to tidy it up.`);
    };
    return el("div", {}, el("h4", {}, "Close the case"),
      el("p", { class: "small muted" }, "Solved means every primary objective is done. The debrief, rewards and level-ups work as in any case."),
      el("div", { class: "row" }, el("button", { class: "btn small primary", onclick: () => beat(() => CAMP.endAdventure("win")) }, "Solved"), el("button", { class: "btn small", onclick: () => beat(() => CAMP.endAdventure("failed")) }, "Not solved")),
      a.improv ? el("div", {}, el("h4", {}, "Keep it"), el("p", { class: "small muted" }, "Save what you made tonight (scenes, people, monsters, fights, clues, objectives) as a written case in the GM workshop, to run again or share."),
        el("button", { class: "btn small", onclick: keep }, "Save as a case")) : null);
  };

  /* ------------------------------------------------------------ buttons */
  document.addEventListener("DOMContentLoaded", () => {
    setInterval(() => {
      const caseBtn = document.querySelector("#btn-case"), bar = caseBtn && caseBtn.parentNode;
      let b = document.querySelector("#dirbtn");
      const want = IM.allowed();
      if (want && !b && bar) bar.prepend(el("button", { id: "dirbtn", class: "icon-btn labeled", "aria-label": "Director", title: "Director: build scenes, people, rolls, fights and clues on the fly", onclick: () => IM.open() }, el("span", { class: "ico", "aria-hidden": "true" }, "✦"), el("span", { class: "txt" }, "Director")));
      else if (!want && b) b.remove();
    }, 1000);
  });
  const hub0 = ui.hub;
  ui.hub = (...args) => {
    hub0(...args);
    const row = document.querySelector(".hubtitle") && document.querySelector(".hubtitle").parentElement.querySelector(".row");
    if (row && !row.querySelector(".runbtn")) row.prepend(ui.btn("Run a game (GM)", () => IM.setup(), "ghost small runbtn"));
  };
})();
