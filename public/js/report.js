/* ============================================================================
   CASE REPORT — the agency's write-up of every case.
   Captured when a case ends (objectives, the evidence, how each agent came
   out of it, their journal entries) and kept in the campaign (last 30).
   The debrief has a "Case report" button; the Case log tab lists them all.
   A report opens as a typed document and can be downloaded as a page to
   keep or share.
   ========================================================================== */
(function () {
  const RP = (window.REPORT = {});
  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const debrief0 = window.CAMP && CAMP.debrief;
  if (debrief0) CAMP.debrief = function (r) {
    /* read the case before the debrief clears it; journals are written during the debrief, so they're added after */
    let rep = null;
    try {
      const M = window.MODULE, G = window.GAME, c = CAMP.camp;
      if (M && G && G.state && c && !CAMP.playtest) rep = { id: `${M.id}:${c.day}:${Date.now() % 100000}`, title: M.title, setting: M.setting || "", year: M.year, day: c.day, agency: (CAMP.agency && CAMP.agency().name) || "", solved: !!r.solved,
        objectives: (M.objectives || []).map((o) => ({ t: o.t, kind: o.kind, done: G.state.obj[o.id] === "done", note: o.done || "" })).filter((o) => o.kind === "primary" || o.done),
        clues: (G.state.clues || []).map((id) => M.clues[id]).filter(Boolean).map((x) => ({ t: x.t, s: x.s, x: x.x })),
        agents: (G.state.agents || []).filter((a) => a._campId).map((a) => ({ camp: a._campId, name: a.name, dead: !!a.dead, health: `${a.pools.health.cur}/${a.pools.health.max}`, sanity: `${a.pools.sanity.cur}/${a.pools.sanity.max}`,
          stability: `${a.pools.stability.cur}/${a.pools.stability.max}`, injuries: (a.injuries || []).map((i) => i.name), journal: "" })) };
    } catch (e) { console.warn("report", e); }
    if (rep) { const c = CAMP.camp; (c.reports = c.reports || []).unshift(rep); c.reports = c.reports.slice(0, 30); RP.last = rep; }
    const res = debrief0.apply(this, arguments);
    try { if (rep) { for (const a of rep.agents) { const ch = CAMP.char(a.camp) || {}; const jn = (ch.journal || [])[0]; if (jn && jn.title === rep.title) a.journal = jn.text; } CAMP.save(); } } catch (e) { /* the report is a nicety */ }
    return res;
  };
  RP.html = (rep) => `<div class="creport">
    <div class="cr-head"><span>${esc(rep.agency || "Agency")} · Case report</span><span>Day ${esc(rep.day)} · ${esc(rep.year)}</span></div>
    <h2>${esc(rep.title)}</h2><p class="cr-set">${esc(rep.setting)}</p>
    <div class="cr-stamp ${rep.solved ? "ok" : "no"}">${rep.solved ? "CLOSED" : "UNRESOLVED"}</div>
    <h3>Objectives</h3><ul>${rep.objectives.map((o) => `<li class="${o.done ? "done" : ""}">${o.done ? "☑" : "☐"} ${esc(o.t)}${o.done && o.note ? ` <i>${esc(o.note)}</i>` : ""}</li>`).join("")}</ul>
    <h3>Evidence</h3>${rep.clues.length ? `<ol>${rep.clues.map((c) => `<li><b>${esc(c.t)}</b> <small>(${esc(c.s)})</small><br>${esc(c.x)}</li>`).join("")}</ol>` : "<p><i>None recorded.</i></p>"}
    <h3>Personnel</h3><table><tr><th>Agent</th><th>Health</th><th>Sanity</th><th>Stability</th><th>Notes</th></tr>${rep.agents.map((a) => `<tr><td>${esc(a.name)}</td><td>${a.dead ? "—" : esc(a.health)}</td><td>${a.dead ? "—" : esc(a.sanity)}</td><td>${a.dead ? "—" : esc(a.stability)}</td><td>${a.dead ? "<b>Killed in the line of duty</b>" : esc(a.injuries.join(", "))}</td></tr>`).join("")}</table>
    ${rep.agents.some((a) => a.journal) ? `<h3>From their journals</h3>${rep.agents.filter((a) => a.journal).map((a) => `<blockquote><b>${esc(a.name)}:</b> ${esc(a.journal)}</blockquote>`).join("")}` : ""}
  </div>`;
  RP.show = (rep) => window.UI.modal({ title: "Case report", cls: "wide", body: RP.html(rep), buttons: [{ id: "dl", label: "Download" }, { id: "ok", label: "Close", cls: "primary" }] }).then((v) => { if (v === "dl") RP.download(rep); });
  RP.download = (rep) => {
    const css = [...document.styleSheets].map((s) => { try { return [...s.cssRules].map((r) => r.cssText).filter((t) => t.includes("creport") || t.includes("cr-")).join("\n"); } catch (e) { return ""; } }).join("\n");
    const page = `<!doctype html><html><head><meta charset="utf-8"><title>${esc(rep.title)} · case report</title><style>body{background:#2a2622;margin:0;padding:2rem;font-family:Georgia,serif}${css}</style></head><body>${RP.html(rep)}</body></html>`;
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([page], { type: "text/html" })); a.download = `${rep.title.replace(/[^\w]+/g, "-")}-report.html`; document.body.append(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  };
  /* a button on the debrief, and the list in the case log */
  document.addEventListener("DOMContentLoaded", () => {
    const ui = window.CAMP && CAMP.ui; if (!ui) return;
    const deb0 = ui.debrief;
    ui.debrief = function () { const r = deb0.apply(this, arguments); try { const row = [...document.querySelectorAll(".cwrap .row")].pop(); if (row && RP.last) row.prepend(window.UI.el("button", { class: "btn", onclick: () => RP.show(RP.last) }, "Case report")); } catch (e) {} return r; };
    const tabs = ui.tabs || {}; const log0 = tabs.log;
    if (log0) tabs.log = function () { const w = log0.apply(this, arguments); const reps = (CAMP.camp && CAMP.camp.reports) || []; if (reps.length) { const el = window.UI.el; w.prepend(el("div", { class: "reports" }, el("h3", { class: "sect" }, "Case reports"), ...reps.map((r) => el("button", { class: "btn small ghost", onclick: () => RP.show(r) }, `${r.solved ? "✓" : "✗"} ${r.title} · day ${r.day}`)))); } return w; };
  });
})();
