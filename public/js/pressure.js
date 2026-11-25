/* ============================================================================
   TIME AND FUEL: the case does not wait.
   Every action takes time. As it passes the day wears on (stage 1), dusk comes down (2), and the small
   hours arrive (3): each stage makes every place one step darker, and in the small hours everyone is
   tired (-1 to rolls). A light you carry burns down while you use it in the dark; spare lights matter.
   Both can be turned off in Settings (Roleplaying features).
   ========================================================================== */
(function () {
  const G = window.GAME, U = window.UI; if (!G || !U) return;
  const el = U.el, P = (window.PRESS = {});
  const TIERS = ["normal", "shadow", "dark", "pitch"], STEP = 8;
  P.val = () => (G.state && G.state._press) || 0;
  P.stage = () => (window.RPGX.on("clock") ? Math.min(3, Math.floor(P.val() / STEP)) : 0);
  P.name = () => ["Fresh", "Wearing on", "Late", "The small hours"][P.stage()];
  G.lightOf = (loc) => { const l = loc || G.loc(); const L = (l && l.lighting) || "normal", i = TIERS.indexOf(L); return i < 0 ? L : TIERS[Math.min(3, i + [0, 1, 1, 2][P.stage()])]; };
  P.paint = () => {
    let m = U.$("#press"); const badge = U.$("#loc-light"); if (!badge) return;
    if (!window.RPGX.on("clock")) { if (m) m.remove(); return; }
    if (!m) { m = el("span", { id: "press", class: "light-badge" }); badge.insertAdjacentElement("afterend", m); }
    const s = P.stage(), into = P.val() - s * STEP, bars = s >= 3 ? 8 : Math.min(8, into);
    m.textContent = `${P.name()} ${"▮".repeat(bars)}${"▯".repeat(8 - bars)}`; m.dataset.s = s;
  };
  const lightItem = () => { for (const a of G.active()) for (const it of a.items || []) { const d = it.def || ((window.MODULE || {}).items || {})[it.id]; if (d && d.light && it.uses > 0 && (it.fuel === undefined || it.fuel > 0)) return { a, it, d }; } return null; };
  const WORDS = ["", "The light is going. Every place is a shade darker than it was.", "Dusk has come down. The streets have emptied, and the dark is not neutral any more.", "The small hours. Everyone is tired, and everything is dark. Whatever this is, it has had all day to get ready."];
  const run1 = G.run;
  G.run = async function (fn) {
    const wasBusy = G.busy, before = P.stage(), r = await run1.call(this, fn);
    try {
      if (wasBusy || !G.state || G.state.phase !== "explore" || !G.loc()) return r;
      if (window.RPGX.on("clock")) {
        G.state._press = P.val() + 1;
        const now = P.stage();
        if (now > before) { G.busy = true; document.body.classList.add("busy"); try { await G.api.narrate(`<b>${P.name()}.</b> ${WORDS[now]}`); } finally { G.busy = false; document.body.classList.remove("busy"); G.showIdle(); } }   // the message clears the buttons: put the scene's options back
      }
      if (window.RPGX.on("fuel") && ["shadow", "dark", "pitch"].includes(G.lightOf())) {
        const L = lightItem();
        if (L) { L.it.fuel = (L.it.fuel === undefined ? 8 : L.it.fuel) - 1; U.print(L.it.fuel <= 0 ? `<small>${L.a.short}'s ${L.d.name.toLowerCase()} gives out. It is dark.</small>` : L.it.fuel === 2 ? `<small>${L.a.short}'s ${L.d.name.toLowerCase()} is burning low.</small>` : "", "narr"); }
      }
      G.paintLight(); P.paint(); G.refreshParty();
    } catch (e) { console.error(e); }
    return r;
  };
  const enter0 = G.enterGame; document.addEventListener("DOMContentLoaded", P.paint);
  setInterval(() => { try { P.paint(); } catch (e) {} }, 1500);
})();
