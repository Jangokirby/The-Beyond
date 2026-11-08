/* ============================================================================
   SCARS — what the job has done to an agent, shown on their portrait.
   Injuries leave a mark (a bandage for the body, a crack for the mind, a
   shadow for the spirit); severed Bonds and afflictions show as small seals.
   Hover a mark for what it is. Purely a picture of the book's own records.
   ========================================================================== */
(function () {
  const S = (window.SCARS = {});
  const kindOf = (i) => { const t = `${i.name || ""} ${i.text || ""} ${i.pool || ""} ${i.type || ""}`.toLowerCase(); return i.disorder || /sanity|mind|disorder|phobia|paranoi|halluc/.test(t) ? "mind" : /spirit|stability|soul|faith/.test(t) ? "spirit" : "body"; };
  S.marks = (a) => {
    const el = window.UI.el, inj = a.injuries || [], sev = (a.bonds || []).filter((b) => b.value <= 0), aff = Object.keys(a.afflict || {}).filter((k) => a.afflict[k]);
    if (!inj.length && !sev.length && !aff.length && !a.crippled) return null;
    const box = el("span", { class: "scars", "aria-label": "Scars" });
    inj.slice(0, 4).forEach((i, n) => box.append(el("i", { class: "scar " + kindOf(i), style: { "--n": n }, title: `${i.name}${i.text ? ": " + i.text : ""}` })));
    if (a.crippled) box.append(el("i", { class: "scar crippled", title: "Crippled" }));
    if (sev.length) box.append(el("i", { class: "scar bond", title: `Bond severed: ${sev.map((b) => b.name).join(", ")}` }));
    if (aff.length) box.append(el("i", { class: "scar afflict", title: `Afflicted: ${aff.join(", ")}` }));
    return box;
  };
})();
