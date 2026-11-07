/* ============================================================================
   CONTENT PACKS AND CAMPAIGN ARCS

   A pack is plain data, one file:
     { format: "beyond-pack", id, name, version, author, description,
       cases: [adventure, ...],            // the normal case format (adv.js)
       arcs:  [{ id, title, summary, agencies, villain, parts: [caseId, ...] }] }
   Packs that ship with the game call PACKS.define(pack) from a script (see
   packs/). Players can also add pack files under Content packs on the title
   screen; those are kept in this browser. A later Steam build can mark a pack
   as owned or not with pack.locked; the game already hides locked packs.

   Arcs: a run of cases with a recurring villain. Only the next part shows on
   the case board. Choices made with {arcSet:"flag"} carry into later parts
   and are read with the {arc:"flag"} condition. Progress lives on the
   campaign as camp.arcs[arcId] = { part, flags, results }.
   ========================================================================== */
(function () {
  const ADV = window.ADV, CAMP = window.CAMP, U = window.UI, el = U.el, ui = CAMP.ui;
  const PACKS = (window.PACKS = { list: [] });
  const ARCS = (window.ARCS = {});
  const KEY = "beyond.packs.v1", OFF = "beyond.packs.off";
  const rd = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
  const wr = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } };

  /* ------------------------------------------------------------ packs */
  PACKS.off = () => new Set(rd(OFF, []));
  PACKS.enabled = (p) => !p.locked && !PACKS.off().has(p.id);
  const install = (p, builtIn) => {
    p.builtIn = !!builtIn;
    PACKS.list = PACKS.list.filter((x) => x.id !== p.id).concat(p);
    if (!PACKS.enabled(p)) return;
    for (const a of p.cases || []) { a.pack = p.id; delete window.ADVENTURES[a.id]; ADV.register(a); }
  };
  PACKS.define = (p) => install(p, true);
  PACKS.validate = (p) => {
    const e = [];
    if (!p || p.format !== "beyond-pack") e.push("This isn't a Beyond pack file.");
    else {
      if (!p.id || !p.name) e.push("The pack has no id or name.");
      for (const a of p.cases || []) { if (!a.id || !a.scenes || !a.start) e.push(`Case ${a.title || a.id || "?"} is incomplete.`); }
      for (const r of p.arcs || []) for (const id of r.parts || []) if (!(p.cases || []).some((a) => a.id === id) && !ADV.LIBRARY[id]) e.push(`Arc ${r.title}: missing case ${id}.`);
    }
    return e;
  };
  PACKS.addFile = async (file) => {
    let p; try { p = JSON.parse(await file.text()); } catch (e) { return ["The file couldn't be read as a pack."]; }
    const errs = PACKS.validate(p); if (errs.length) return errs;
    const mine = rd(KEY, []).filter((x) => x.id !== p.id); mine.push(p);
    if (!wr(KEY, mine)) return ["There isn't room to keep this pack in this browser."];
    install(p, false); return [];
  };
  PACKS.remove = (id) => { wr(KEY, rd(KEY, []).filter((x) => x.id !== id)); const p = PACKS.list.find((x) => x.id === id); if (p) for (const a of p.cases || []) { delete ADV.LIBRARY[a.id]; delete window.ADVENTURES[a.id]; } PACKS.list = PACKS.list.filter((x) => x.id !== id); };
  PACKS.toggle = (id, on) => { const off = PACKS.off(); if (on) off.delete(id); else off.add(id); wr(OFF, [...off]); location.reload(); };
  PACKS.toFile = (pack) => new Blob([JSON.stringify(pack, null, 1)], { type: "application/json" });
  /* packs saved in this browser load right away */
  for (const p of rd(KEY, [])) { try { install(p, false); } catch (e) {} }

  /* ------------------------------------------------------------ arcs */
  ARCS.all = () => PACKS.list.filter(PACKS.enabled).flatMap((p) => (p.arcs || []).map((r) => ({ ...r, pack: p.id })));
  ARCS.of = (advId) => ARCS.all().find((r) => r.parts.includes(advId)) || null;
  ARCS.state = (arcId, c = CAMP.camp) => { if (!c) return null; c.arcs = c.arcs || {}; return (c.arcs[arcId] = c.arcs[arcId] || { part: 0, flags: {}, results: [] }); };
  const curArc = () => { const M = window.MODULE; return M && M.id ? ARCS.of(M.id) : null; };
  /* choices made during a case wait in the mission state until the debrief, so an abandoned case changes nothing */
  ARCS.set = (flag, on = true) => { const G = window.GAME; if (!G.state) return; G.state.arcFlags = G.state.arcFlags || {}; G.state.arcFlags[flag] = !!on; };
  ARCS.flag = (flag) => {
    const G = window.GAME, r = curArc();
    if (G.state && G.state.arcFlags && flag in G.state.arcFlags) return G.state.arcFlags[flag];
    return !!(r && ARCS.state(r.id).flags[flag]);
  };

  /* only the next part of an arc is offered */
  const advList0 = CAMP.advList;
  CAMP.advList = () => advList0().filter((m) => {
    const r = ARCS.of(m.id); if (!r) return true;
    const st = ARCS.state(r.id), i = r.parts.indexOf(m.id);
    return i === st.part || (CAMP.camp.history || []).some((h) => h.adv === m.id);
  });
  const all0 = CAMP.allAdventures;
  CAMP.allAdventures = () => all0().filter((m) => { const r = ARCS.of(m.id); return !r || r.parts.indexOf(m.id) <= ARCS.state(r.id).part; });

  /* the debrief moves the arc on and keeps the choices */
  const debrief0 = CAMP.debrief;
  CAMP.debrief = function (r) {
    try {
      const M = window.MODULE, arc = M && ARCS.of(M.id), G = window.GAME;
      if (arc && !CAMP.playtest) {
        const st = ARCS.state(arc.id), i = arc.parts.indexOf(M.id);
        Object.assign(st.flags, (G.state && G.state.arcFlags) || {});
        st.results[i] = r.solved ? "solved" : "failed";
        if (i === st.part) st.part = i + 1;
        const done = st.part >= arc.parts.length;
        ARCS._note = done ? `${arc.title} is over. ${st.results.filter((x) => x === "solved").length} of ${arc.parts.length} parts solved.`
          : `${arc.title}, part ${i + 1} of ${arc.parts.length} closed. The next part is on the case board.`;
        if (done) st.done = true;
      }
    } catch (e) { console.warn("arc", e); }
    return debrief0.apply(this, arguments);
  };
  const uiDebrief0 = ui.debrief;
  ui.debrief = function (out) { if (ARCS._note) { (out.world = out.world || []).unshift(ARCS._note); ARCS._note = null; } return uiDebrief0.apply(this, arguments); };

  /* arc cards on the case board, and an arc pin on the wall */
  const tag = (m) => { const r = ARCS.of(m.id); return r ? `${r.title} · part ${r.parts.indexOf(m.id) + 1} of ${r.parts.length}` : ""; };
  if (ui.tabs && ui.tabs.missions) {
    const m0 = ui.tabs.missions;
    ui.tabs.missions = function () {
      const box = m0.apply(this, arguments);
      try {
        for (const card of box.querySelectorAll(".mcard:not(.gen)")) {
          const t = card.querySelector("b"); const m = CAMP.allAdventures().find((x) => x.title === (t && t.textContent)); if (!m) continue;
          const s = tag(m); if (!s) continue;
          card.classList.add("arccard"); card.querySelector(".etxt").prepend(el("span", { class: "arctag" }, s));
        }
        const c = CAMP.camp, wall = box.querySelector(".wall");
        const live = ARCS.all().filter((r) => (r.agencies || []).includes(c.agency) && ARCS.state(r.id).part > 0 && !ARCS.state(r.id).done);
        if (wall && live.length) for (const r of live) {
          const st = ARCS.state(r.id);
          wall.prepend(el("div", { class: "wpin arcpin" }, el("i", { class: "tack" }), el("h4", {}, "The arc"), el("b", { class: "wbig" }, r.title),
            el("small", {}, `Part ${st.part + 1} of ${r.parts.length} next.${r.villain ? " Behind it all: " + r.villain + "." : ""}`),
            el("div", { class: "arcsteps" }, ...r.parts.map((id, i) => el("i", { class: st.results[i] || (i === st.part ? "next" : "") })))));
        }
      } catch (e) { console.warn("arc board", e); }
      return box;
    };
  }

  /* ------------------------------------------------------------ the Content packs screen */
  ui.packs = (back = () => ui.title()) => {
    const body = el("div", { class: "cwrap" }, el("h2", {}, "Content packs"),
      el("p", { class: "cnote" }, "Packs add cases, campaign arcs and more. The ones that come with the game are listed first. You can add pack files someone has shared with you, or make your own from the GM workshop."));
    const file = el("input", { type: "file", accept: ".json,.beyondpack,application/json", hidden: true, onchange: async (e) => {
      const f = e.target.files[0]; if (!f) return; const errs = await PACKS.addFile(f);
      if (errs.length) U.modal({ title: "That pack couldn't be added", body: "<ul>" + errs.map((x) => `<li>${x}</li>`).join("") + "</ul>", buttons: [{ id: "ok", label: "OK" }] });
      else { U.toast("Pack added."); ui.packs(back); }
    } });
    for (const p of PACKS.list) {
      const on = PACKS.enabled(p), cases = (p.cases || []).length, arcs = (p.arcs || []).length;
      body.append(el("section", { class: "cpanel packrow" + (on ? "" : " off") },
        el("div", {}, el("b", {}, p.name), el("small", { class: "mono" }, ` v${p.version || "1"}${p.author ? " · " + p.author : ""}${p.builtIn ? " · comes with the game" : ""}`),
          el("p", { class: "small" }, p.description || ""), el("small", { class: "muted" }, `${cases} case${cases === 1 ? "" : "s"}${arcs ? `, ${arcs} arc${arcs === 1 ? "" : "s"}` : ""}`)),
        el("div", { class: "row" }, p.locked ? el("span", { class: "tag" }, "Not owned") : ui.btn(on ? "Turn off" : "Turn on", () => PACKS.toggle(p.id, !on), "small ghost"),
          p.builtIn ? null : ui.btn("Remove", () => { PACKS.remove(p.id); ui.packs(back); }, "small ghost danger"))));
    }
    body.append(el("div", { class: "row" }, ui.btn("Add a pack file", () => file.click(), "primary"), ui.btn("Back", back, "ghost")), file);
    ui.mount(body);
  };
  const title0 = ui.title;
  ui.title = function () {
    const r = title0.apply(this, arguments);
    const row = document.querySelector(".title-actions");
    if (row) row.append(ui.btn("Content packs", () => ui.packs(), "ghost"));
    return r;
  };

  /* the workshop: bundle your own cases as a pack to share */
  ui.gmPackExport = () => {
    const mine = (window.GM ? GM.list() : []);
    if (!mine.length) return U.toast("Write a case in the workshop first.");
    const boxes = mine.map((a) => el("label", { class: "wperk" }, el("input", { type: "checkbox", checked: "checked", value: a.id }), el("span", {}, `${a.title} · ${a.year}`)));
    const name = el("input", { type: "text", placeholder: "Pack name, e.g. Tales from the Fens", maxlength: "60" });
    U.modal({ title: "Export cases as a pack", body: el("div", { class: "grid" }, name, ...boxes), buttons: [{ id: "no", label: "Cancel" }, { id: "go", label: "Make the pack file", cls: "primary" }] }).then((r) => {
      if (r !== "go") return;
      const ids = boxes.map((b) => b.querySelector("input")).filter((i) => i.checked).map((i) => i.value);
      const pack = { format: "beyond-pack", id: "pack-" + Math.random().toString(36).slice(2, 8), name: name.value.trim() || "My cases", version: "1", author: "", description: "", cases: mine.filter((a) => ids.includes(a.id)), arcs: [] };
      const a = el("a", { href: URL.createObjectURL(PACKS.toFile(pack)), download: (pack.name.replace(/[^\w-]+/g, "-") || "pack") + ".beyondpack.json" }); document.body.append(a); a.click(); a.remove();
    });
  };
})();
