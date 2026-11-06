/* ============================================================================
   GM WORKSHOP — build your own cases: scenes, dialogue, monsters, maps,
   clues, case notes. Everything saves to this browser and shows up on the
   job board for any agency you pick.
   ========================================================================== */
(function () {
  const C = window.CDATA, GD = window.GD, U = window.UI, CAMP = window.CAMP, ui = CAMP.ui, GM = window.GM, ADV = window.ADV, A = window.ART, el = U.el;
  const { btn, panel, note, cap, toast } = ui;
  const modal = (o) => U.modal(o);
  const clone = (x) => JSON.parse(JSON.stringify(x));
  const ph = (t) => (t || "").replace(/\s+/g, " ");
  const slug = (s, taken) => { let b = (s || "item").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") || "item", id = b, n = 2; while (taken && Object.prototype.hasOwnProperty.call(taken, id)) id = b + "_" + n++; return id; };
  const copyText = (t) => { try { navigator.clipboard.writeText(t).then(() => toast("Copied."), () => toast("Select the text and copy it.")); } catch (e) { toast("Select the text and copy it."); } };

  let cur = null, tab = "overview", sel = {};
  const modsOpen = {};
  const commit = () => { GM.save(cur); };

  /* ------------------------------------------------------------ small form helpers */
  const field = (label, ...kids) => el("label", { class: "field" }, el("span", {}, label), ...kids);
  const txt = (o, k, opts = {}) => el("input", { type: opts.type || "text", value: o[k] == null ? "" : String(o[k]), maxlength: opts.max || "200", placeholder: opts.ph || "", list: opts.list || null,
    oninput: (e) => { o[k] = opts.type === "number" ? +e.target.value : e.target.value; commit(); opts.after && opts.after(); } });
  const area = (o, k, rows = 3, opts = {}) => el("textarea", { rows: String(rows), placeholder: opts.ph || "", oninput: (e) => { o[k] = e.target.value; commit(); } }, o[k] || "");
  const pick = (o, k, opts, after) => el("select", { onchange: (e) => { o[k] = e.target.value; commit(); after && after(); } }, ...opts.map(([v, l]) => el("option", { value: v, selected: o[k] === v ? "selected" : null }, l)));
  const check = (o, k, label, after) => el("label", { class: "field check" }, el("input", { type: "checkbox", checked: o[k] ? "checked" : null, onchange: (e) => { if (e.target.checked) o[k] = true; else delete o[k]; commit(); after && after(); } }), el("span", {}, label));
  const ids = (m) => Object.keys(m || {});
  const opt = (m, label) => [["", "(choose)"], ...Object.entries(m || {}).map(([k, v]) => [k, label(v, k)])];

  /* ============================================================ HOME */
  ui.gmHome = () => {
    const list = GM.list();
    const body = el("div", { class: "cwrap" }, el("p", { class: "eyebrow" }, "GM workshop"), el("h2", {}, "Build your own cases"),
      note("Write a scene-by-scene adventure with checks, combat, clues and branching. It lands on the job board for the agencies and years you choose, so anyone playing here can take it. Export a case as text to share it."));
    body.append(el("div", { class: "row" },
      btn("New adventure", () => { cur = GM.blank(); GM.save(cur); tab = "overview"; sel = {}; ui.gmEdit(); }, "primary"),
      btn("Start from an example", () => { cur = GM.sample(); GM.save(cur); tab = "overview"; sel = {}; ui.gmEdit(); }),
      btn("Import", () => ui.gmImport(), ""), btn("Back", () => (CAMP.camp ? ui.hub() : ui.title()), "ghost")));
    if (!list.length) body.append(note("Nothing here yet. The example is a two-scene case with a witness, a clue and a fight, ready to play."));
    for (const a of list) {
      const v = GM.validate(a);
      body.append(el("article", { class: "cpanel campaign-card" },
        el("div", {}, el("b", {}, a.title), el("div", { class: "small muted" }, `${a.year} · ${a.agencies.join(", ")} · ${Object.keys(a.scenes).length} scenes · ${v.err.length ? v.err.length + " to fix" : "ready"}`)),
        el("div", { class: "row tight" },
          btn("Edit", () => { cur = clone(a); tab = "overview"; sel = {}; ui.gmEdit(); }, "primary small"),
          btn("Playtest", () => { const v2 = GM.validate(a); if (v2.err.length) return modal({ title: "Fix these first", body: `<ul>${v2.err.map((x) => `<li>${x}</li>`).join("")}</ul>`, buttons: [{ id: "ok", label: "OK" }] }); GM.playtest(clone(a)); }, "small"),
          btn("Copy", () => { const c = clone(a); c.id = "gm-" + Math.random().toString(36).slice(2, 8); c.title += " (copy)"; GM.save(c); ui.gmHome(); }, "small ghost"),
          btn("Export", () => ui.gmExport(a), "small ghost"),
          btn("Delete", async () => { const r = await modal({ title: "Delete this adventure?", body: `<p>${a.title} will be erased from this browser.</p>`, buttons: [{ id: "no", label: "Keep" }, { id: "yes", label: "Delete", cls: "danger" }] }); if (r === "yes") { GM.remove(a.id); ui.gmHome(); } }, "small danger"))));
    }
    ui.mount(body);
  };

  ui.gmExport = (a) => {
    const t = el("textarea", { rows: "14", readonly: "readonly", onfocus: (e) => e.target.select() }, GM.export(a));
    modal({ title: "Export adventure", body: el("div", {}, note("Copy this text and keep it anywhere. Anyone can paste it into Import."), t, btn("Copy to clipboard", () => copyText(GM.export(a)), "small")), buttons: [{ id: "ok", label: "Done" }] });
  };
  ui.gmImport = () => {
    const t = el("textarea", { rows: "10", placeholder: "Paste an exported adventure or adventure pack here, or choose a file below" });
    const f = el("input", { type: "file", accept: ".json,.txt,application/json,text/plain" });
    f.addEventListener("change", () => {
      const file = f.files && f.files[0];
      if (!file) return;
      const rd = new FileReader();
      rd.onload = () => { t.value = String(rd.result || ""); toast("Loaded " + file.name + ". Press Import."); };
      rd.onerror = () => toast("Couldn't read that file.");
      rd.readAsText(file);
    });
    modal({ title: "Import adventure or pack", body: el("div", {}, note("One adventure or a whole pack. Imported adventures appear in your GM workshop and in the adventure board."), el("div", { class: "row tight" }, f), t), buttons: [{ id: "no", label: "Cancel" }, { id: "ok", label: "Import", cls: "primary" }] }).then((r) => {
      if (r !== "ok") return;
      const res = GM.importMany(t.value);
      if (res.err) { toast(res.err); return; }
      for (const a of res.list) GM.save(a);
      toast("Imported " + res.list.map((a) => a.title).join(", ") + (res.errs.length ? ` (${res.errs.length} skipped)` : "") + ".");
      ui.gmHome();
    });
  };

  /* ============================================================ EDITOR SHELL */
  const TABS = [["overview", "Overview"], ["scenes", "Scenes"], ["npcs", "People"], ["clues", "Clues"], ["monsters", "Monsters"], ["maps", "Battle maps"], ["notes", "Case notes"], ["check", "Check"], ["json", "Raw data"]];
  ui.gmEdit = () => {
    const scroll = document.querySelector("#camp-root") ? document.querySelector("#camp-root").scrollTop : 0;
    const v = GM.validate(cur);
    const head = el("header", { class: "hubhead" }, el("div", { class: "hubtitle" }, el("div", {}, el("b", {}, cur.title || "Untitled"), el("small", { class: "mono" }, `${cur.year} · ${cur.agencies.join(", ")} · saved automatically`))),
      el("div", { class: "row tight" }, btn("Playtest", () => { if (v.err.length) { tab = "check"; return ui.gmEdit(); } GM.playtest(clone(cur)); }, "primary small"), btn("All adventures", () => ui.gmHome(), "ghost small")));
    const nav = el("nav", { class: "hubnav", role: "tablist" }, ...TABS.map(([id, label]) => el("button", { role: "tab", "aria-selected": tab === id ? "true" : "false", onclick: () => { U.click(); tab = id; ui.gmEdit(); } }, label + (id === "check" && v.err.length ? ` (${v.err.length})` : ""))));
    const body = el("main", { class: "hubbody" }, (TAB[tab] || TAB.overview)());
    ui.mount(el("div", { class: "hub" }, head, nav, body));
    document.querySelector("#camp-root").scrollTop = scroll;
  };
  const redraw = () => ui.gmEdit();

  const TAB = {};

  /* ============================================================ OVERVIEW */
  TAB.overview = () => {
    const w = el("div", {});
    w.append(panel("The case", field("Title", txt(cur, "title", { max: "60", after: null })), field("Setting", txt(cur, "setting", { ph: "Place · year" })),
      field("Hook (shown on the job board and in the briefing)", area(cur, "summary", 4)),
      el("div", { class: "two" }, field("Year", txt(cur, "year", { type: "number" })), el("div", {}, field("Level range"),
        el("div", { class: "two" }, el("input", { type: "number", min: "1", max: "9", value: String(cur.level[0]), oninput: (e) => { cur.level[0] = +e.target.value; commit(); } }), el("input", { type: "number", min: "1", max: "9", value: String(cur.level[1]), oninput: (e) => { cur.level[1] = +e.target.value; commit(); } }))))));
    w.append(panel("Agencies that can take this job", note("Only agencies founded by the case's year make sense. The job board also filters by the era the player picked."),
      el("div", { class: "seg" }, ...C.AGENCIES.map((ag) => el("button", { class: "segbtn" + (cur.agencies.includes(ag.id) ? " on" : ""), onclick: () => { const i = cur.agencies.indexOf(ag.id); if (i >= 0) cur.agencies.splice(i, 1); else cur.agencies.push(ag.id); commit(); redraw(); } }, ag.short + (ag.founded > cur.year ? " (not founded yet)" : ""))))));
    const ob = panel("Objectives", note("Primary objectives decide whether the case is solved, and each one earns a Favor. Secondary ones are hidden from the players until found. Complete them with an Objective step."));
    cur.objectives.forEach((o, i) => ob.append(el("div", { class: "objrow" },
      el("div", { class: "two" }, field("Objective", txt(o, "t")), field("Type", pick(o, "kind", [["primary", "Primary"], ["secondary", "Secondary"]]))), field("Text shown when it is done", txt(o, "done")),
      el("div", { class: "row tight" }, el("span", { class: "mono small muted" }, "id: " + o.id), btn("Remove", () => { cur.objectives.splice(i, 1); commit(); redraw(); }, "small ghost danger")))));
    ob.append(btn("Add an objective", () => { cur.objectives.push({ id: slug("obj", Object.fromEntries(cur.objectives.map((o) => [o.id, 1]))), kind: "secondary", t: "New objective", done: "" }); commit(); redraw(); }, "small"));
    w.append(ob);
    w.append(panel("Starting scene", field("The case opens in", pick(cur, "start", Object.entries(cur.scenes).map(([k, s]) => [k, s.name || k])))));
    return w;
  };

  /* ============================================================ STEP EDITOR */
  const ASPECT_OPTS = Object.entries(C.ASPECT_NAMES).map(([k, v]) => [k, v]);
  const CR_OPTS = [["easy", "Easy (7)"], ["medium", "Medium (10)"], ["challenging", "Challenging (14)"], ["dangerous", "Dangerous (18)"], ["hopeless", "Hopeless (20)"]];
  const flagsInUse = () => { const s = new Set(); for (const l of GM.allSteps(cur)) GM.walk(l, (st) => { if (st.set) s.add(st.set); if (st.unset) s.add(st.unset); }); return [...s]; };

  const condEditor = (o, k, label) => {
    const v = o[k];
    const kind = !v ? "" : typeof v === "string" ? "flag" : v.clue ? "clue" : v.obj ? "obj" : v.not && typeof v.not === "string" ? "nflag" : v.not && v.not.clue ? "nclue" : v.not && v.not.obj ? "nobj" : "custom";
    const val = !v ? "" : typeof v === "string" ? v : v.clue || v.obj || (v.not && (typeof v.not === "string" ? v.not : v.not.clue || v.not.obj)) || "";
    const set = (kd, vl) => { const mk = { flag: () => vl, clue: () => ({ clue: vl }), obj: () => ({ obj: vl }), nflag: () => ({ not: vl }), nclue: () => ({ not: { clue: vl } }), nobj: () => ({ not: { obj: vl } }) }[kd]; if (!kd || !mk) delete o[k]; else o[k] = mk(); commit(); };
    const valBox = el("span", { class: "condval" });
    const draw = (kd) => {
      valBox.replaceChildren();
      if (kd === "custom") { valBox.append(el("code", { class: "small" }, JSON.stringify(v)), el("span", { class: "small muted" }, " (advanced condition, edit in Raw data)")); return; }
      if (!kd) return;
      const base = kd.replace(/^n/, "");
      if (base === "flag") valBox.append(el("input", { type: "text", value: val, list: "gm-flags", placeholder: "flag name", oninput: (e) => set(kd, e.target.value) }));
      else if (base === "clue") valBox.append(el("select", { onchange: (e) => set(kd, e.target.value) }, ...opt(cur.clues, (c) => c.t || "clue").map(([x, l]) => el("option", { value: x, selected: x === val ? "selected" : null }, l))));
      else valBox.append(el("select", { onchange: (e) => set(kd, e.target.value) }, ...[["", "(choose)"], ...cur.objectives.map((ob) => [ob.id, ob.t])].map(([x, l]) => el("option", { value: x, selected: x === val ? "selected" : null }, l))));
    };
    draw(kind);
    const s = el("select", { onchange: (e) => { const kd = e.target.value; if (!kd) delete o[k]; else if (kd !== "custom") set(kd, ""); draw(kd); } },
      ...[["", "Always"], ["flag", "A flag is set"], ["nflag", "A flag is not set"], ["clue", "Clue is found"], ["nclue", "Clue is not found"], ["obj", "Objective is done"], ["nobj", "Objective is not done"], ...(kind === "custom" ? [["custom", "Custom"]] : [])].map(([x, l]) => el("option", { value: x, selected: x === kind ? "selected" : null }, l)));
    return el("div", { class: "condrow" }, el("span", { class: "small muted" }, label), s, valBox);
  };

  const T = {
    say: { label: "Narration", make: () => ({ say: "" }), fields: (st) => [{ kind: "area", o: st, k: "say", label: "Text" }] },
    aloud: { label: "Read aloud", make: () => ({ aloud: "" }), fields: (st) => [{ kind: "area", o: st, k: "aloud", label: "Text the GM reads aloud" }] },
    talk: { label: "Someone speaks", make: () => ({ talk: { npc: ids(cur.npcs)[0] || "", text: "" } }), fields: (st) => [{ kind: "sel", o: st.talk, k: "npc", label: "Who", opts: opt(cur.npcs, (n) => n.name) }, { kind: "area", o: st.talk, k: "text", label: "What they say" }] },
    check: { label: "Skill check", make: () => ({ check: { aspect: "awareness", cr: "medium", label: "", ok: [], fail: [] } }), fields: (st) => [
      { kind: "row", kids: [{ kind: "sel", o: st.check, k: "aspect", label: "Aspect", opts: ASPECT_OPTS }, { kind: "sel", o: st.check, k: "cr", label: "Difficulty", opts: CR_OPTS }] },
      { kind: "text", o: st.check, k: "label", label: "What the roll is for" }, { kind: "bool", o: st.check, k: "investigate", label: "This is an investigation roll" },
      { kind: "steps", o: st.check, k: "ok", label: "If it succeeds" }, { kind: "steps", o: st.check, k: "fail", label: "If it fails" }] },
    group: { label: "Everyone rolls", make: () => ({ group: { aspect: "agility", cr: "medium", label: "", ok: [], fail: [] } }), fields: (st) => [
      { kind: "row", kids: [{ kind: "sel", o: st.group, k: "aspect", label: "Aspect", opts: ASPECT_OPTS }, { kind: "sel", o: st.group, k: "cr", label: "Difficulty", opts: CR_OPTS }] },
      { kind: "text", o: st.group, k: "label", label: "What the roll is for" }, { kind: "steps", o: st.group, k: "ok", label: "If everyone succeeds" }, { kind: "steps", o: st.group, k: "fail", label: "If anyone fails" }] },
    combat: { label: "Fight", make: () => ({ combat: ids(cur.encounters)[0] || "", win: [] }), fields: (st) => [
      { kind: "sel", o: st, k: "combat", label: "Battle map", opts: opt(cur.encounters, (e) => e.name) }, { kind: "bool", o: st, k: "surprise", label: "The agents get a surprise round" },
      { kind: "text", o: st, k: "surpriseIf", label: "…or only if this flag is set", list: "gm-flags" }, { kind: "steps", o: st, k: "win", label: "After the agents win" }] },
    goto: { label: "Go to a scene", make: () => ({ goto: ids(cur.scenes)[0] || "" }), fields: (st) => [{ kind: "sel", o: st, k: "goto", label: "Scene", opts: opt(cur.scenes, (s) => s.name) }] },
    clue: { label: "Find a clue", make: () => ({ clue: "" }), fields: (st) => [{ kind: "sel", o: st, k: "clue", label: "Clue", opts: opt(cur.clues, (c) => c.t) }] },
    objective: { label: "Complete an objective", make: () => ({ objective: "" }), fields: (st) => [{ kind: "sel", o: st, k: "objective", label: "Objective", opts: [["", "(choose)"], ...cur.objectives.map((o) => [o.id, o.t])] }] },
    set: { label: "Set a flag", make: () => ({ set: "" }), fields: (st) => [{ kind: "text", o: st, k: "set", label: "Flag name (remember what happened)", list: "gm-flags" }] },
    unset: { label: "Clear a flag", make: () => ({ unset: "" }), fields: (st) => [{ kind: "text", o: st, k: "unset", label: "Flag name", list: "gm-flags" }] },
    if: { label: "If / else", make: () => ({ if: "", then: [], else: [] }), fields: (st) => [{ kind: "cond", o: st, k: "if", label: "Condition" }, { kind: "steps", o: st, k: "then", label: "Then" }, { kind: "steps", o: st, k: "else", label: "Otherwise" }] },
    once: { label: "Only the first time", make: () => ({ once: "first", steps: [] }), fields: (st) => [{ kind: "text", o: st, k: "once", label: "A name for this moment" }, { kind: "steps", o: st, k: "steps", label: "Happens once" }] },
    choice: { label: "Give a choice", make: () => ({ choice: { prompt: "", options: [{ label: "", steps: [] }, { label: "", steps: [] }] } }), fields: (st) => [{ kind: "text", o: st.choice, k: "prompt", label: "Prompt" }, { kind: "options", o: st.choice }] },
    damage: { label: "Hurt the party", make: () => ({ damage: { pool: "sanity", amount: 2 } }), fields: (st) => [{ kind: "row", kids: [{ kind: "sel", o: st.damage, k: "pool", label: "Pool", opts: [["health", "Health"], ["sanity", "Sanity"], ["stability", "Stability"]] }, { kind: "num", o: st.damage, k: "amount", label: "Amount" }] }] },
    heal: { label: "Heal the party", make: () => ({ heal: { pool: "health", amount: 3 } }), fields: (st) => [{ kind: "row", kids: [{ kind: "sel", o: st.heal, k: "pool", label: "Pool", opts: [["health", "Health"], ["sanity", "Sanity"], ["stability", "Stability"]] }, { kind: "num", o: st.heal, k: "amount", label: "Amount" }] }] },
    fall: { label: "A fall", make: () => ({ fall: { stories: 1, text: "" } }), fields: (st) => [{ kind: "num", o: st.fall, k: "stories", label: "Stories fallen (8 flat Health each; a fatal fall allows one Free Fall roll)" }, { kind: "text", o: st.fall, k: "text", label: "Describe it" }] },
    trap: { label: "A trap", make: () => ({ trap: { label: "A trap", cr: "medium", pool: "health", amount: 6, ok: [], fail: [] } }), fields: (st) => [
      { kind: "text", o: st.trap, k: "label", label: "What the trap is" },
      { kind: "row", kids: [{ kind: "sel", o: st.trap, k: "cr", label: "Trap CR", opts: CR_OPTS }, { kind: "sel", o: st.trap, k: "pool", label: "Hurts", opts: [["health", "Health"], ["sanity", "Sanity"], ["stability", "Stability"]] }, { kind: "num", o: st.trap, k: "amount", label: "Damage" }] },
      { kind: "steps", o: st.trap, k: "ok", label: "If it is disarmed or braced against" }, { kind: "steps", o: st.trap, k: "fail", label: "If it goes off unseen" }] },
    afflict: { label: "Afflict the party", make: () => ({ afflict: { id: "disease", cr: "medium", text: "" } }), fields: (st) => [
      { kind: "row", kids: [{ kind: "sel", o: st.afflict, k: "id", label: "Status", opts: Object.entries(R.AFFLICTIONS).map(([k, v]) => [k, v.name]) }, { kind: "sel", o: st.afflict, k: "cr", label: "Source CR", opts: CR_OPTS }] },
      { kind: "text", o: st.afflict, k: "text", label: "Describe it" }] },
    read: { label: "Truth or lies", make: () => ({ read: { label: "Read them", cr: "medium", lying: false, ok: [], fail: [] } }), fields: (st) => [
      { kind: "row", kids: [{ kind: "text", o: st.read, k: "label", label: "Who or what" }, { kind: "sel", o: st.read, k: "cr", label: "Difficulty", opts: CR_OPTS }] },
      { kind: "bool", o: st.read, k: "lying", label: "They are lying (Charisma success reveals it)" }, { kind: "steps", o: st.read, k: "ok", label: "If the agent sees through them" }, { kind: "steps", o: st.read, k: "fail", label: "If they can't tell" }] },
    sfx: { label: "Play a sound", make: () => ({ sfx: "door_creak" }), fields: (st) => [{ kind: "sel", o: st, k: "sfx", label: "Sound", opts: Object.keys(window.MANIFEST ? (window.MANIFEST.sfx || {}) : {}).map((x) => [x, x]).concat([["door_creak", "door_creak"]]).filter((v, i, a) => a.findIndex((z) => z[0] === v[0]) === i) }] },
    end: { label: "End the adventure", make: () => ({ end: "win" }), fields: (st) => [{ kind: "sel", o: st, k: "end", label: "Outcome", opts: [["win", "The agents finish the case"], ["lose", "The case is lost"]] }] }
  };
  const typeOf = (st) => Object.keys(T).find((k) => Object.prototype.hasOwnProperty.call(st, k));

  const renderField = (f) => {
    if (f.kind === "text") return field(f.label, txt(f.o, f.k, { list: f.list }));
    if (f.kind === "area") return field(f.label, area(f.o, f.k, 3));
    if (f.kind === "num") return field(f.label, txt(f.o, f.k, { type: "number" }));
    if (f.kind === "bool") return check(f.o, f.k, f.label);
    if (f.kind === "sel") return field(f.label, pick(f.o, f.k, f.opts));
    if (f.kind === "row") return el("div", { class: "two" }, ...f.kids.map(renderField));
    if (f.kind === "cond") return condEditor(f.o, f.k, f.label);
    if (f.kind === "steps") { f.o[f.k] = f.o[f.k] || []; return el("div", { class: "substeps" }, el("div", { class: "small muted" }, f.label), stepsEditor(f.o[f.k])); }
    if (f.kind === "options") return el("div", { class: "substeps" }, ...f.o.options.map((op, i) => el("div", { class: "optbox" },
      field(`Option ${i + 1}`, txt(op, "label")), condEditor(op, "if", "Only shown when"), el("div", { class: "substeps" }, stepsEditor(op.steps = op.steps || [])),
      f.o.options.length > 1 ? btn("Remove option", () => { f.o.options.splice(i, 1); commit(); redraw(); }, "small ghost danger") : null)),
      btn("Add an option", () => { f.o.options.push({ label: "", steps: [] }); commit(); redraw(); }, "small"));
    return null;
  };

  const stepsEditor = (list) => {
    const box = el("div", { class: "steps" });
    list.forEach((st, i) => {
      const ty = typeOf(st), def = T[ty];
      if (!def) { box.append(el("div", { class: "stepcard" }, el("code", { class: "small" }, JSON.stringify(st)), el("span", { class: "small muted" }, " (unknown step, edit in Raw data)"))); return; }
      const mv = (d) => { const j = i + d; if (j < 0 || j >= list.length) return; [list[i], list[j]] = [list[j], list[i]]; commit(); redraw(); };
      box.append(el("div", { class: "stepcard t-" + ty }, el("div", { class: "stephead" }, el("b", {}, def.label),
        el("span", { class: "row tight" }, el("button", { class: "icon-btn", "aria-label": "Move up", onclick: () => mv(-1) }, "↑"), el("button", { class: "icon-btn", "aria-label": "Move down", onclick: () => mv(1) }, "↓"),
          el("button", { class: "icon-btn", "aria-label": "Delete step", onclick: () => { list.splice(i, 1); commit(); redraw(); } }, "✕"))),
        ...def.fields(st).map(renderField)));
    });
    const sel2 = el("select", { "aria-label": "Add a step", onchange: (e) => { if (!e.target.value) return; list.push(T[e.target.value].make()); commit(); redraw(); } },
      el("option", { value: "" }, "+ Add a step…"), ...Object.entries(T).map(([k, d]) => el("option", { value: k }, d.label)));
    box.append(sel2);
    return box;
  };

  /* ============================================================ SCENES */
  TAB.scenes = () => {
    const w = el("div", {}); const sids = Object.keys(cur.scenes);
    if (!sel.scene || !cur.scenes[sel.scene]) sel.scene = sids[0];
    const fl = el("datalist", { id: "gm-flags" }, ...flagsInUse().map((f) => el("option", { value: f })));
    w.append(fl);
    w.append(el("div", { class: "seg" }, ...sids.map((id) => el("button", { class: "segbtn" + (id === sel.scene ? " on" : ""), onclick: () => { sel.scene = id; redraw(); } }, (cur.scenes[id].name || id) + (cur.start === id ? " ★" : ""))),
      btn("+ New scene", () => { const id = slug("scene", cur.scenes); cur.scenes[id] = { name: "New scene", theme: "interior", mood: "calm", lighting: "normal", weather: "", cast: [], notes: "", onEnter: [{ say: "" }], options: [] }; sel.scene = id; commit(); redraw(); }, "small")));
    const s = cur.scenes[sel.scene]; if (!s) return w;
    s.cast = s.cast || []; s.options = s.options || []; s.onEnter = s.onEnter || [];
    const prev = el("img", { class: "scenethumb", alt: "Scene preview", src: U.img(A.scene(s.theme || "street", sel.scene)) });
    const ref = () => { prev.src = U.img(A.scene(s.theme || "street", sel.scene)); };
    w.append(panel("This scene", el("div", { class: "look" }, prev, el("div", {},
      field("Name", txt(s, "name")), el("div", { class: "two" }, field("Look", pick(s, "theme", A.themes.map((t) => [t, cap(t)]), ref)), field("Mood (music)", pick(s, "mood", [["calm", "Calm"], ["tense", "Tense"], ["dread", "Dread"], ["weird", "Weird"], ["boss", "Climax"]]))),
      el("div", { class: "two" }, field("Lighting", pick(s, "lighting", [["normal", "Lit"], ["shadow", "Shadow (−2 to see)"], ["bright", "Bright (Blind without sun-sight)"], ["dark", "Dark (Blind without dark vision)"], ["blinding", "Blinding (Blind, one fewer action)"], ["pitch", "Pitch (Blind, one fewer action)"]])), field("Weather", pick(s, "weather", [["", "None"], ["rain", "Rain"], ["building", "Building hum"], ["boiler", "Boiler rumble"]]))),
      field("Weather severity", pick(s, "severity", [["0", "0 · none"], ["1", "1 · no effect"], ["2", "2 · −1 to rolls"], ["3", "3 · −2, sight of one zone"], ["4", "4 · −4, sight of one zone"]])))),
      el("div", { class: "row tight" }, btn(cur.start === sel.scene ? "This is the first scene" : "Make this the first scene", () => { cur.start = sel.scene; commit(); redraw(); }, "small", { disabled: cur.start === sel.scene }),
        btn("Delete scene", () => { if (sids.length < 2 || cur.start === sel.scene) return toast("A case needs a first scene. Move the start first."); delete cur.scenes[sel.scene]; sel.scene = null; commit(); redraw(); }, "small ghost danger"))));
    w.append(panel("Who is here", ids(cur.npcs).length ? el("div", { class: "seg" }, ...ids(cur.npcs).map((n) => el("button", { class: "segbtn" + (s.cast.includes(n) ? " on" : ""), onclick: () => { const i = s.cast.indexOf(n); if (i >= 0) s.cast.splice(i, 1); else s.cast.push(n); commit(); redraw(); } }, cur.npcs[n].name))) : note("Add people on the People tab, then place them in scenes here.")));
    w.append(panel("When the agents arrive", note("These steps run each time the scene starts. Use “Only the first time” for the opening description."), stepsEditor(s.onEnter)));
    const op = panel("What the agents can do here", note("Each option is a button the player can press. Steps run in order."));
    s.options.forEach((o, i) => {
      op.append(el("div", { class: "optbox" }, field(`Option ${i + 1}`, txt(o, "label", { ph: "e.g. Question the caretaker" })), el("div", { class: "two" }, check(o, "once", "Can only be done once"), condEditor(o, "if", "Only shown when")),
        el("div", { class: "substeps" }, stepsEditor(o.steps = o.steps || [])),
        el("div", { class: "row tight" }, btn("Up", () => { if (i) { [s.options[i - 1], s.options[i]] = [s.options[i], s.options[i - 1]]; commit(); redraw(); } }, "small ghost"), btn("Down", () => { if (i < s.options.length - 1) { [s.options[i + 1], s.options[i]] = [s.options[i], s.options[i + 1]]; commit(); redraw(); } }, "small ghost"),
          btn("Remove option", () => { s.options.splice(i, 1); commit(); redraw(); }, "small ghost danger"))));
    });
    op.append(btn("Add an option", () => { s.options.push({ label: "", steps: [] }); commit(); redraw(); }, "small primary"));
    w.append(op);
    w.append(panel("Notes for this scene (GM only)", area(s, "notes", 3, { ph: "What's really going on, how to run it, what the players might try." })));
    return w;
  };

  /* ============================================================ PEOPLE */
  TAB.npcs = () => {
    const w = el("div", {}); const keys = ids(cur.npcs);
    w.append(el("div", { class: "row" }, btn("Add a person", () => { const id = slug("npc", cur.npcs); cur.npcs[id] = { name: "New person", tag: "", look: "", face: { skin: A.SKIN[2], hairC: A.HAIRC[1], hair: "short", outfit: A.OUTFIT[0], extra: "none", bg: "#2b2f3a" } }; commit(); redraw(); }, "primary")));
    if (!keys.length) w.append(note("People appear in scenes and speak with the Someone speaks step."));
    for (const id of keys) {
      const n = cur.npcs[id]; n.face = n.face || {};
      const prev = el("img", { class: "lookprev", alt: "", src: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(A.portraitSvg(n.face)) });
      const rp = () => { prev.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(A.portraitSvg(n.face)); };
      const sw = (key, list) => el("div", { class: "swatches" }, ...list.map((v) => el("button", { class: "sw" + (n.face[key] === v ? " on" : ""), style: { background: v }, "aria-label": v, onclick: (e) => { n.face[key] = v; commit(); rp(); e.currentTarget.parentNode.querySelectorAll(".sw").forEach((b) => b.classList.toggle("on", b === e.currentTarget)); } })));
      w.append(panel(n.name, el("div", { class: "look" }, prev, el("div", {},
        el("div", { class: "two" }, field("Name", txt(n, "name")), field("Role", txt(n, "tag", { ph: "e.g. Caretaker" }))), field("How they look and act", area(n, "look", 2)),
        field("Skin", sw("skin", A.SKIN)), field("Hair colour", sw("hairC", A.HAIRC)), field("Clothes", sw("outfit", A.OUTFIT)),
        el("div", { class: "two" }, field("Hair", pick(n.face, "hair", A.HAIRS.map((h) => [h, cap(h)]), rp)), field("Detail", pick(n.face, "extra", A.EXTRAS.map((h) => [h, cap(h)]), rp))))),
        btn("Remove", () => { delete cur.npcs[id]; for (const s of Object.values(cur.scenes)) s.cast = (s.cast || []).filter((x) => x !== id); commit(); redraw(); }, "small ghost danger")));
    }
    return w;
  };

  /* ============================================================ CLUES */
  TAB.clues = () => {
    const w = el("div", {});
    w.append(note("A clue is something the agents learn. It shows in their case file with where it came from. Give it with a Find a clue step, and use it as a condition to unlock options."));
    w.append(btn("Add a clue", () => { const id = slug("c", cur.clues); cur.clues[id] = { t: "New clue", s: "", x: "" }; commit(); redraw(); }, "primary"));
    for (const id of ids(cur.clues)) {
      const c = cur.clues[id];
      w.append(panel(c.t || id, field("What the agents write down", txt(c, "t")), field("Where it came from", txt(c, "s", { ph: "A person or place" })), field("The full detail", area(c, "x", 3)),
        el("div", { class: "row tight" }, el("span", { class: "mono small muted" }, "id: " + id), btn("Remove", () => { delete cur.clues[id]; commit(); redraw(); }, "small ghost danger"))));
    }
    return w;
  };

  /* ============================================================ MONSTERS */
  TAB.monsters = () => {
    const w = el("div", {}); const keys = ids(cur.enemies);
    w.append(note("Monsters follow the rulebook: pick a type and a difficulty for the starting stats, then spend the modifiers that difficulty allows (Easy 2, Medium 3, Challenging 4, Dangerous 5, Hopeless 6, before the type's free ones)."));
    w.append(btn("Add a monster", () => { const id = slug("monster", cur.enemies); cur.enemies[id] = { build: { name: "New monster", type: "Feral", difficulty: "medium", sprite: "beast", hue: 20, dtype: "health", range: 0, mods: [] } }; commit(); redraw(); }, "primary"));
    let rollType = "", rollDiff = "";
    w.append(el("div", { class: "row tight wrap" },
      field("Type", el("select", { onchange: (ev) => { rollType = ev.target.value; } }, el("option", { value: "" }, "Any"), ...Object.keys(ADV.MB.TYPES).map((t) => el("option", { value: t }, t)))),
      field("Difficulty", el("select", { onchange: (ev) => { rollDiff = ev.target.value; } }, el("option", { value: "" }, "Any"), ...Object.keys(ADV.MB.DIFFS).map((t) => el("option", { value: t }, cap(t))))),
      btn("Roll a random monster", () => { const id = slug("monster", cur.enemies); cur.enemies[id] = { build: ADV.rollMonster({ type: rollType || null, difficulty: rollDiff || null }) }; commit(); redraw(); }, "primary")));
    for (const id of keys) {
      const e = cur.enemies[id]; if (!e.build) { w.append(panel(id, note("This monster uses a custom stat block. Edit it in Raw data."))); continue; }
      const b = e.build; b.mods = b.mods || [];
      const stat = el("p", { class: "mono small" }); const spr = el("img", { class: "sprprev", alt: "" });
      const upd = () => { const m = ADV.buildMonster(b); stat.textContent = `${m.crLabel}: Health ${m.health} · Sanity ${m.sanity} · Stability ${m.stability} · Attack +${m.attack} · ER ${m.er} · BR ${m.br} · MR ${m.mr} · SR ${m.sr} · Speed ${m.speed} · ${m.actions} action${m.actions > 1 ? "s" : ""} · ${b.mods.length}/${m.modsAllowed} modifiers`; spr.src = U.img(A.sprite(b.sprite || "humanoid", b.hue || 0), "sprites"); };
      const T0 = ADV.MB.TYPES[b.type] || {};
      const STACK = new Set(["Aquatic", "Aura of Damage", "Aura of Healing", "Bloodthirsty", "Brain Food", "Caster", "Flying", "Large", "Nimble", "Quick", "Small", "Soul Feed", "Steel Mind", "Tanky", "Thick Skin", "Toxic", "Ungodly", "Unimaginable Horror", "Unshakable Faith", "Vicious", "Mutant"]);
      const STATUSES = ["bleeding", "burning", "poisoned", "frozen", "crippled", "terrified", "stun"];
      const PARAMS = { "Aura of Damage": ["health", "sanity", "stability"], "Deadly": STATUSES, "Toxic": STATUSES };
      const nameOf = (x) => x.split(":")[0];
      const cnt = (n) => b.mods.filter((x) => nameOf(x) === n).length;
      const setParam = (n, v) => { const i = b.mods.findIndex((x) => nameOf(x) === n); if (i >= 0) b.mods[i] = n + ":" + v; };
      const modBox = el("div", { class: "modlist" }, ...GD.monsterMods.map((m) => {
        const n = cnt(m.name), on = n > 0, stack = STACK.has(m.name), par = PARAMS[m.name];
        const cur0 = (b.mods.find((x) => nameOf(x) === m.name && x.includes(":")) || "").split(":")[1] || (par ? par[0] : "");
        const add = () => { b.mods.push(par && !n ? m.name + ":" + par[0] : m.name); commit(); redraw(); };
        const sub = () => { const i = b.mods.map(nameOf).lastIndexOf(m.name); if (i >= 0) { const wasFirst = b.mods[i].includes(":"); b.mods.splice(i, 1); if (wasFirst && cnt(m.name) && par) setParam(m.name, cur0); } commit(); redraw(); };
        const head = stack
          ? el("div", { class: "modrow" + (on ? " on" : "") }, el("span", { class: "stepper" }, btn("−", sub, "small ghost"), el("b", { class: "mono" }, String(n)), btn("+", add, "small ghost")), el("b", {}, m.name + (m.tier ? ` (${m.tier})` : "")), el("small", {}, ph(m.text)))
          : el("label", { class: "modrow" + (on ? " on" : "") }, el("input", { type: "checkbox", checked: on ? "checked" : null, onchange: (ev) => { if (ev.target.checked) add(); else sub(); } }), el("b", {}, m.name + (m.tier ? ` (${m.tier})` : "")), el("small", {}, ph(m.text)));
        const extra = [];
        if (on && par) extra.push(el("label", { class: "field" }, el("span", {}, m.name === "Aura of Damage" ? "Damage type" : "Status applied"), el("select", { onchange: (ev) => { setParam(m.name, ev.target.value); commit(); } }, ...par.map((x) => el("option", { value: x, selected: x === cur0 ? "selected" : null }, x)))));
        if (on && m.name === "Death Mark") extra.push(el("label", { class: "field" }, el("span", {}, "Rounds before everyone rolls the Death Die"), el("input", { type: "number", min: "1", max: "30", value: String(b.deathMark || 6), oninput: (ev) => { b.deathMark = Math.max(1, +ev.target.value || 6); commit(); upd(); } })));
        return el("div", {}, head, ...extra);
      }));
      w.append(panel(b.name || id, el("div", { class: "look" }, spr, el("div", {},
        el("div", { class: "two" }, field("Name", txt(b, "name")), field("Type", pick(b, "type", Object.keys(ADV.MB.TYPES).map((t) => [t, t]), redraw))),
        el("div", { class: "two" }, field("Difficulty", pick(b, "difficulty", Object.keys(ADV.MB.DIFFS).map((t) => [t, cap(t) + ` (CR ${ADV.MB.DIFFS[t].cr})`]), redraw)), field("Hits the party's", pick(b, "dtype", [["health", "Health"], ["sanity", "Sanity"], ["stability", "Stability"]]))),
        el("div", { class: "two" }, field("Look", pick(b, "sprite", ["humanoid", "beast", "spirit", "swarm", "construct", "undead", "beyond"].map((x) => [x, cap(x)]), upd)), field("Colour", el("input", { type: "range", min: "0", max: "359", value: String(b.hue || 0), oninput: (ev) => { b.hue = +ev.target.value; commit(); upd(); } }))),
        el("div", { class: "two" }, field("Reach", pick(b, "range", [["0", "Same room"], ["1", "Adjacent room"], ["2", "Two rooms"]].map(([v, l]) => [v, l]), () => { b.range = +b.range; commit(); })), field("Attack bonus", txt(b, "attack", { type: "number", ph: "0" }))))),
        stat, el("details", { class: "fold", open: modsOpen[id] ? "open" : null, ontoggle: (ev) => { modsOpen[id] = ev.target.open; } }, el("summary", {}, `Modifiers (${b.mods.length})`), T0.note ? note(T0.note) : null, btn("Roll the modifiers for me", () => { ADV.rollMods(b); commit(); redraw(); }, "small ghost"), modBox), field("Description (shown in the Library)", area(b, "text", 2)),
        btn("Remove", () => { delete cur.enemies[id]; commit(); redraw(); }, "small ghost danger")));
      upd();
    }
    return w;
  };

  /* ============================================================ BATTLE MAPS */
  TAB.maps = () => {
    const w = el("div", {}); const keys = ids(cur.encounters);
    w.append(note("A battle map is a grid of rooms (zones). Tap a square to add or remove a zone, then pick a zone to name it, place monsters, and choose the agents' starting point. Neighbouring zones connect automatically; cut a link to build a wall."));
    w.append(btn("Add a battle map", () => { const id = slug("fight", cur.encounters); cur.encounters[id] = { name: "New fight", theme: "interior", fightText: "", zones: [{ id: "z00", name: "Entrance", col: 0, row: 0 }, { id: "z10", name: "Far side", col: 1, row: 0 }], edges: [["z00", "z10"]], walls: [], start: "z00", foes: [] }; sel.enc = id; commit(); redraw(); }, "primary"));
    if (!keys.length) return w;
    if (!sel.enc || !cur.encounters[sel.enc]) sel.enc = keys[0];
    w.append(el("div", { class: "seg" }, ...keys.map((k) => el("button", { class: "segbtn" + (k === sel.enc ? " on" : ""), onclick: () => { sel.enc = k; sel.zone = null; redraw(); } }, cur.encounters[k].name || k))));
    const e = cur.encounters[sel.enc]; e.walls = e.walls || []; e.foes = e.foes || [];
    const wallKey = (a2, b2) => [a2, b2].sort().join("|");
    const rebuild = () => {
      const byPos = {}; for (const z of e.zones) byPos[z.col + "," + z.row] = z;
      e.edges = []; for (const z of e.zones) for (const [dx, dy] of [[1, 0], [0, 1]]) { const n = byPos[(z.col + dx) + "," + (z.row + dy)]; if (n && !e.walls.includes(wallKey(z.id, n.id))) e.edges.push([z.id, n.id]); }
      e.foes = e.foes.filter((f) => e.zones.some((z) => z.id === f.zone)); if (!e.zones.some((z) => z.id === e.start)) e.start = e.zones[0] ? e.zones[0].id : "";
      commit();
    };
    w.append(panel("This map", el("div", { class: "two" }, field("Name", txt(e, "name")), field("Look", pick(e, "theme", A.themes.map((t) => [t, cap(t)])))), field("Text shown when the fight begins", txt(e, "fightText")), check(e, "lit", "The room is lit (no shadow penalty)")));
    const COLS = 6, ROWS = 4;
    const grid = el("div", { class: "mapgrid", style: { gridTemplateColumns: `repeat(${COLS}, 1fr)` } });
    const byPos = {}; for (const z of e.zones) byPos[z.col + "," + z.row] = z;
    for (let r = 0; r < ROWS; r++) for (let c2 = 0; c2 < COLS; c2++) {
      const z = byPos[c2 + "," + r];
      const foes = z ? e.foes.filter((f) => f.zone === z.id) : [];
      grid.append(el("button", { class: "mapcell" + (z ? " zone" : "") + (z && sel.zone === z.id ? " on" : "") + (z && e.start === z.id ? " start" : ""), "aria-label": z ? "Zone " + z.name : "Empty",
        onclick: () => { if (z) { sel.zone = sel.zone === z.id ? null : z.id; } else { const id = `z${c2}${r}`; e.zones.push({ id, name: "Zone", col: c2, row: r }); sel.zone = id; rebuild(); } redraw(); } },
        z ? el("b", {}, z.name) : el("span", { class: "muted" }, "+"), z && e.start === z.id ? el("small", {}, "START") : null, ...foes.map((f) => el("small", { class: "foe" }, "☠ " + ((cur.enemies[f.t] && cur.enemies[f.t].build && cur.enemies[f.t].build.name) || f.t)))));
    }
    w.append(grid);
    const z = e.zones.find((x) => x.id === sel.zone);
    if (z) {
      const zp = panel("Selected zone", field("Name", txt(z, "name", { after: () => {} })),
        el("div", { class: "row tight" }, btn(e.start === z.id ? "Agents start here" : "Agents start here?", () => { e.start = z.id; commit(); redraw(); }, "small", { disabled: e.start === z.id }),
          btn("Remove zone", () => { e.zones = e.zones.filter((x) => x.id !== z.id); sel.zone = null; rebuild(); redraw(); }, "small ghost danger")));
      const nb = e.zones.filter((o) => Math.abs(o.col - z.col) + Math.abs(o.row - z.row) === 1);
      if (nb.length) zp.append(el("h4", {}, "Connections"), el("div", { class: "seg" }, ...nb.map((o) => { const open = !e.walls.includes(wallKey(z.id, o.id)); return el("button", { class: "segbtn" + (open ? " on" : ""), onclick: () => { const k = wallKey(z.id, o.id); if (open) e.walls.push(k); else e.walls.splice(e.walls.indexOf(k), 1); rebuild(); redraw(); } }, `${open ? "Open to" : "Wall to"} ${o.name}`); })));
      zp.append(el("h4", {}, "Lighting"), el("div", { class: "seg" }, ...Object.keys(R.ZONE_LIGHT).map((k) => el("button", { class: "segbtn" + ((z.light || "normal") === k ? " on" : ""), onclick: () => { z.light = k === "normal" ? "" : k; commit(); redraw(); } }, k[0].toUpperCase() + k.slice(1)))));
      z.mods = z.mods || [];
      zp.append(el("h4", {}, "Zone modifiers"), note("Hazards that act on everyone standing in this zone. Tap to switch on."),
        el("div", { class: "seg wrap" }, ...R.ZONE_MODS.map((zm) => { const on = z.mods.find((m) => m.id === zm.id); return el("button", { class: "segbtn" + (on ? " on" : ""), title: zm.text, onclick: () => { if (on) z.mods = z.mods.filter((m) => m.id !== zm.id); else z.mods.push({ id: zm.id, p: zm.param === "element" ? "burning" : "" }); commit(); redraw(); } }, zm.name); })),
        ...z.mods.map((m) => { const d = R.ZONE_MODS.find((x) => x.id === m.id); if (!d) return null;
          return el("div", { class: "small" }, el("b", {}, d.name + ": "), d.text,
            d.param === "element" ? el("select", { onchange: (ev) => { m.p = ev.target.value; commit(); } }, ...["burning", "frozen", "suffocation", "poisoned", "bleeding", "crippled", "fear", "terrified"].map((k) => el("option", { value: k, selected: m.p === k }, k))) : null,
            d.param === "severity" ? el("select", { onchange: (ev) => { m.p = ev.target.value; commit(); } }, ...["0", "1", "2", "3", "4"].map((k) => el("option", { value: k, selected: (m.p || "2") === k }, "Severity " + k))) : null,
            d.param === "text" ? field("Source and how it closes", txt(m, "p", { ph: "a doll that must be returned to a child" })) : null); }));
      zp.append(el("h4", {}, "Monsters in this zone"), ...e.foes.map((f, i) => f.zone === z.id ? el("div", { class: "assetrow" }, el("div", { class: "grow" }, pick(f, "t", opt(cur.enemies, (m) => (m.build && m.build.name) || "monster")), field("Name override", txt(f, "name", { ph: "optional" }))), btn("Remove", () => { e.foes.splice(i, 1); commit(); redraw(); }, "small ghost danger")) : null),
        ids(cur.enemies).length ? btn("Add a monster here", () => { e.foes.push({ t: ids(cur.enemies)[0], zone: z.id }); commit(); redraw(); }, "small") : note("Create a monster on the Monsters tab first."));
      w.append(zp);
    }
    w.append(btn("Delete this map", () => { delete cur.encounters[sel.enc]; sel.enc = null; commit(); redraw(); }, "small ghost danger"));
    return w;
  };

  /* ============================================================ CASE NOTES */
  TAB.notes = () => {
    const w = el("div", {});
    w.append(panel("Case notes", note("Your private prep: the truth behind the case, timeline, villains' plans, who knows what. Players never see this."), area(cur, "notes", 14, { ph: "What actually happened?\nWho knows what?\nWhat happens if the agents do nothing?" })));
    const scenes = Object.entries(cur.scenes).filter(([, s]) => s.notes);
    if (scenes.length) w.append(panel("Scene notes", ...scenes.map(([id, s]) => el("div", {}, el("b", {}, s.name || id), el("p", { class: "small" }, s.notes)))));
    const lines = [];
    for (const [id, s] of Object.entries(cur.scenes)) for (const l of [s.onEnter || [], ...(s.options || []).map((o) => o.steps || [])]) GM.walk(l, (st) => { if (st.talk) lines.push([cur.npcs[st.talk.npc] ? cur.npcs[st.talk.npc].name : st.talk.npc, st.talk.text, s.name || id]); });
    w.append(panel("All dialogue", note("Every line a person speaks, in one place for a read-through."), ...(lines.length ? lines.map(([n, t, sc]) => el("p", { class: "small" }, el("b", {}, n), ` (${sc}): ${t}`)) : [note("No dialogue yet.")])));
    return w;
  };

  /* ============================================================ CHECK */
  TAB.check = () => {
    const v = GM.validate(cur), w = el("div", {});
    w.append(panel(v.err.length ? "Fix these before playtesting" : "Ready to play", v.err.length ? el("ul", { class: "fates" }, ...v.err.map((x) => el("li", { class: "warn" }, x))) : note("No blocking problems.", "good"),
      v.warn.length ? el("div", {}, el("h4", {}, "Worth a look"), el("ul", { class: "fates" }, ...v.warn.map((x) => el("li", {}, x)))) : null));
    w.append(el("div", { class: "row" }, btn("Playtest now", () => { if (v.err.length) return toast("Fix the problems first."); GM.playtest(clone(cur)); }, "primary", { disabled: v.err.length > 0 }),
      btn("Export", () => ui.gmExport(cur))));
    w.append(note("A playtest uses two throwaway agents and never touches your campaigns."));
    return w;
  };

  /* ============================================================ RAW */
  TAB.json = () => {
    const t = el("textarea", { rows: "22", spellcheck: "false" }, GM.export(cur));
    const msg = el("p", { class: "small" });
    return el("div", {}, note("Every part of the adventure as plain text. Edit it directly for things the editor doesn't cover, such as advanced conditions or custom stat blocks."), t, msg,
      btn("Apply changes", () => { try { const a = JSON.parse(t.value); if (!a.scenes || !a.title) throw new Error("Needs a title and scenes."); a.id = cur.id; cur = Object.assign(GM.blank(), a); commit(); toast("Applied."); redraw(); } catch (e) { msg.textContent = "Not applied: " + e.message; msg.className = "small warn"; } }, "primary small"));
  };

  /* ============================================================ playtest return */
  const _debrief = ui.debrief;
  ui.debrief = (out) => {
    if (!CAMP.playtest) return _debrief(out);
    window.GAME.state = null; document.body.dataset.mode = "";
    const body = el("div", { class: "cwrap" }, el("p", { class: "eyebrow" }, "Playtest · " + out.title), el("h2", {}, out.solved ? "Case solved" : "Case not solved"),
      note(`Primary objectives completed: ${out.primDone} of ${out.primTotal}.`), el("div", { class: "row" }, btn("Back to the editor", () => ui.gmBack(), "primary")));
    ui.mount(body);
  };
  ui.gmBack = () => {
    const p = GM.endPlaytest(); if (!p) return ui.title();
    cur = clone(GM.get(p.advId)); ui.gmEdit();
  };
})();
