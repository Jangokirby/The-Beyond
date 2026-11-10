/* ============================================================================
   GM CAMPAIGNS — string cases into a campaign (an arc) in the GM workshop.
   A campaign is: title, summary, villain, agencies, and parts (case ids, in
   order). Parts can be your own cases or the game's. Choices carry forward
   with the step "Remember a choice for the campaign" ({arcSet}) and the
   condition "An earlier case's choice was made" ({arc}). The builder shows
   which part remembers what, which part reads it, and what never connects.
   Install to play it in this browser, or save it as a pack file to share
   (the same pack format the game's own campaigns use; see js/packs.js).
   ========================================================================== */
(function () {
  const CAMP = window.CAMP, ADV = window.ADV, U = window.UI, el = U.el, C = window.CDATA;
  if (!CAMP || !CAMP.ui || !window.GM) return;
  const ui = CAMP.ui, GM = window.GM;
  const KEY = "beyond.gm.arcs.v1";
  const rd = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } };
  const wr = (v) => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} };
  const clone = (x) => JSON.parse(JSON.stringify(x));
  const uid = () => "arc-" + Math.random().toString(36).slice(2, 8);
  const btn = ui.btn, panel = ui.panel, note = (t, cls) => el("p", { class: "note small" + (cls ? " " + cls : "") }, t);

  const G = (window.GMCAMP = {});
  G.list = () => rd();
  G.save = (r) => { r.updated = Date.now(); wr([clone(r), ...rd().filter((x) => x.id !== r.id)]); };
  G.remove = (id) => wr(rd().filter((x) => x.id !== id));
  G.caseOf = (id) => GM.get(id) || ADV.LIBRARY[id] || null;
  /* what a case remembers for the campaign and what it reads from earlier parts */
  G.flagsOf = (a) => {
    const t = JSON.stringify(a || {});
    const sets = [...new Set([...t.matchAll(/"arcSet":"([^"]+)"/g)].map((m) => m[1]))];
    const reads = [...new Set([...t.matchAll(/"arc":"([^"]+)"/g)].map((m) => m[1]))];
    return { sets, reads };
  };
  G.allArcFlags = () => { const s = new Set(); for (const a of [...GM.list(), ...Object.values(ADV.LIBRARY)]) G.flagsOf(a).sets.forEach((f) => s.add(f)); return [...s].sort(); };

  /* problems a GM should know about before players start */
  G.check = (r) => {
    const out = [], set = new Map();
    if (!r.title.trim()) out.push("Give the campaign a title.");
    if (r.parts.length < 2) out.push("A campaign needs at least two cases.");
    if (!r.agencies.length) out.push("Choose at least one agency that can play it.");
    r.parts.forEach((id, i) => {
      const a = G.caseOf(id);
      if (!a) { out.push(`Part ${i + 1}: the case "${id}" is missing.`); return; }
      const f = G.flagsOf(a);
      for (const x of f.reads) if (!set.has(x)) out.push(`Part ${i + 1} (${a.title}) checks the choice "${x}", but no earlier part remembers it.`);
      for (const x of f.sets) if (!set.has(x)) set.set(x, i);
      const miss = r.agencies.filter((ag) => !(a.agencies || []).includes(ag));
      if (miss.length) out.push(`Part ${i + 1} (${a.title}) isn't open to ${miss.join(", ")}: those agencies won't see it on their case board.`);
      if (i > 0) { const prev = G.caseOf(r.parts[i - 1]); if (prev && C.eraOf(prev.year).id !== C.eraOf(a.year).id) out.push(`Part ${i + 1} (${a.year}) is in a different era from part ${i} (${prev.year}). A campaign is played in one era.`); }
      if (!a.custom && ADV.LIBRARY[id] && window.ARCS && ARCS.of(id) && ARCS.of(id).id !== "gmc-" + r.id) out.push(`Part ${i + 1} (${a.title}) already belongs to the game's campaign "${ARCS.of(id).title}".`);
    });
    return out;
  };
  G.pack = (r) => ({
    format: "beyond-pack", id: "gmc-" + r.id, name: r.title, version: String(r.version || 1), author: r.author || "", description: r.summary,
    cases: r.parts.map((id) => GM.get(id)).filter(Boolean).map(clone),
    arcs: [{ id: "gmc-" + r.id, title: r.title, summary: r.summary, agencies: r.agencies, villain: r.villain, parts: r.parts.slice() }]
  });
  G.install = async (r) => {
    const p = G.pack(r), file = new File([JSON.stringify(p)], "campaign.json", { type: "application/json" });
    const errs = await window.PACKS.addFile(file);
    if (errs.length) { U.modal({ title: "It couldn't be installed", body: `<ul>${errs.map((e) => `<li>${e}</li>`).join("")}</ul>`, buttons: [{ id: "ok", label: "OK" }] }); return false; }
    r.installed = Date.now(); G.save(r); U.toast(`${r.title} is installed. Its first case is on the case board for ${r.agencies.join(", ")}.`); return true;
  };
  G.download = (r) => {
    const a = el("a", { href: URL.createObjectURL(window.PACKS.toFile(G.pack(r))), download: (r.title.replace(/[^\w-]+/g, "-") || "campaign") + ".beyondpack.json" });
    document.body.append(a); a.click(); a.remove();
  };

  /* ------------------------------------------------------------ editor */
  ui.gmCampaign = (r) => {
    const mine = GM.list(), game = Object.values(ADV.LIBRARY).filter((a) => !a.custom && !a.generated && a.id !== "tutorial").sort((x, y) => x.year - y.year);
    const redraw = () => ui.gmCampaign(r);
    const field = (label, input) => el("label", { class: "field" }, el("span", {}, label), input);
    const txt = (k, ph) => el("input", { type: "text", value: r[k] || "", placeholder: ph || "", oninput: (e) => { r[k] = e.target.value; } });
    const area = (k, ph) => el("textarea", { rows: "3", placeholder: ph || "", oninput: (e) => { r[k] = e.target.value; } }, r[k] || "");
    const body = el("div", { class: "cwrap" }, el("p", { class: "eyebrow" }, "GM workshop · campaign"), el("h2", {}, r.title || "New campaign"));
    body.append(panel("About it",
      field("Title", txt("title", "e.g. The Pilgrim Road")),
      field("What it's about (players read this)", area("summary", "Three cases, one relic, and a road that doesn't end where it should.")),
      field("Who or what is behind it", txt("villain", "The recurring villain, for your notes")),
      el("div", { class: "field" }, el("span", {}, "Agencies that can play it"), el("div", { class: "row tight wrap" }, ...C.AGENCIES.map((ag) => el("label", { class: "wperk" },
        el("input", { type: "checkbox", checked: r.agencies.includes(ag.id) ? "checked" : null, onchange: (e) => { r.agencies = e.target.checked ? [...new Set([...r.agencies, ag.id])] : r.agencies.filter((x) => x !== ag.id); } }),
        el("span", {}, `${ag.short} (from ${ag.founded})`)))))));
    /* the parts and what passes between them */
    const set = new Map();
    const rows = r.parts.map((id, i) => {
      const a = G.caseOf(id), f = G.flagsOf(a);
      const reads = f.reads.map((x) => el("span", { class: "tagchip" + (set.has(x) ? "" : " bad"), title: set.has(x) ? `remembered in part ${set.get(x) + 1}` : "nothing earlier remembers this" }, "reads " + x));
      f.sets.forEach((x) => { if (!set.has(x)) set.set(x, i); });
      const sets = f.sets.map((x) => el("span", { class: "tagchip good" }, "remembers " + x));
      return el("div", { class: "cpanel arcpart" },
        el("div", {}, el("b", {}, `Part ${i + 1}: ${a ? a.title : id}`), el("div", { class: "small muted" }, a ? `${a.year} · ${(a.agencies || []).join(", ")} · ${a.custom ? "your case" : "the game's case"}` : "missing"),
          el("div", { class: "row tight wrap" }, ...sets, ...reads, !sets.length && !reads.length ? el("span", { class: "small muted" }, "carries nothing between cases") : null)),
        el("div", { class: "row tight" },
          btn("↑", () => { if (i) { [r.parts[i - 1], r.parts[i]] = [r.parts[i], r.parts[i - 1]]; redraw(); } }, "tiny ghost"),
          btn("↓", () => { if (i < r.parts.length - 1) { [r.parts[i + 1], r.parts[i]] = [r.parts[i], r.parts[i + 1]]; redraw(); } }, "tiny ghost"),
          a && a.custom ? btn("Edit case", () => { G.save(r); window.GM_EDIT_RETURN = () => ui.gmCampaign(G.list().find((x) => x.id === r.id) || r); ui.gmEditCase && ui.gmEditCase(a.id); }, "small ghost") : null,
          btn("Remove", () => { r.parts.splice(i, 1); redraw(); }, "small ghost danger")));
    });
    const pick = el("select", {}, el("option", { value: "" }, "Add a case…"),
      el("optgroup", { label: "Your cases" }, ...mine.map((a) => el("option", { value: a.id }, `${a.title} · ${a.year}`))),
      el("optgroup", { label: "The game's cases" }, ...game.map((a) => el("option", { value: a.id }, `${a.title} · ${a.year}`))));
    body.append(panel("The cases, in order",
      note("Players see one part at a time: the next part appears on the case board when the last one is finished. To carry a choice forward, add the step \"Remember a choice for the campaign\" in one case, and in a later case use the condition \"An earlier case's choice was made\"."),
      ...rows,
      el("div", { class: "row tight" }, pick, btn("Add", () => { if (pick.value && !r.parts.includes(pick.value)) { r.parts.push(pick.value); redraw(); } }, "small primary"),
        btn("New case for this campaign", () => { const a = GM.blank(); a.title = `${r.title || "Campaign"}: part ${r.parts.length + 1}`; a.agencies = r.agencies.length ? r.agencies.slice() : a.agencies; const prev = G.caseOf(r.parts[r.parts.length - 1]); if (prev) a.year = prev.year + 1; GM.save(a); r.parts.push(a.id); G.save(r); redraw(); }, "small"))));
    const probs = G.check(r);
    body.append(panel("Before you play", probs.length ? el("ul", {}, ...probs.map((t) => el("li", {}, t))) : note("Every part is open to the chosen agencies, in one era, and every choice a part reads is remembered earlier.")));
    body.append(el("div", { class: "row" },
      btn("Save", () => { G.save(r); U.toast("Campaign saved."); redraw(); }, "primary"),
      btn("Install to play here", async () => { G.save(r); if (G.check(r).some((t) => /missing|at least/.test(t))) return U.toast("Fix the problems listed first."); await G.install(r); }, ""),
      btn("Save as a pack file", () => { G.save(r); G.download(r); }, ""),
      btn("Delete", async () => { const x = await U.modal({ title: "Delete this campaign?", body: `<p>${r.title} will be removed from the workshop. Its cases stay.</p>`, buttons: [{ id: "no", label: "Keep" }, { id: "yes", label: "Delete", cls: "danger" }] }); if (x === "yes") { G.remove(r.id); ui.gmHome(); } }, "ghost danger"),
      btn("Back", () => { G.save(r); ui.gmHome(); }, "ghost")));
    ui.mount(body);
  };

  /* the workshop home gets a Campaigns panel */
  const home0 = ui.gmHome;
  ui.gmHome = (...args) => {
    if (window.GM_EDIT_RETURN) { const f = window.GM_EDIT_RETURN; window.GM_EDIT_RETURN = null; return f(); }   // back from editing a campaign's case
    home0(...args);
    const wrap = document.querySelector(".cwrap"); if (!wrap) return;
    const list = G.list();
    const box = panel("Campaigns",
      note("String cases together into a campaign: one case leads to the next, and what the players chose in one changes the next. Use your own cases, the game's, or both."),
      ...list.map((r) => el("div", { class: "campaign-card cpanel" },
        el("div", {}, el("b", {}, r.title || "Untitled campaign"), el("div", { class: "small muted" }, `${r.parts.length} case${r.parts.length === 1 ? "" : "s"} · ${r.agencies.join(", ") || "no agency yet"}${r.installed ? " · installed" : ""}`)),
        el("div", { class: "row tight" }, btn("Open", () => ui.gmCampaign(clone(r)), "small primary"), btn("Pack file", () => G.download(r), "small ghost")))),
      el("div", { class: "row" }, btn("New campaign", () => { const r = { id: uid(), title: "", summary: "", villain: "", agencies: CAMP.camp ? [CAMP.camp.agency] : [], parts: [] }; G.save(r); ui.gmCampaign(r); }, "primary")));
    const firstCase = wrap.querySelector(".campaign-card");
    wrap.insertBefore(box, firstCase || null);
  };
})();
