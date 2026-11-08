/* ============================================================================
   ERA SKIN — the interface dresses for the period: page colour, paper, ink,
   accent and type change with the era of the case (or of the campaign, in
   the hideout). Sets <html data-era="...">; the looks live in css/world.css.
   The first case (Tokyo, 1976) keeps its own look. Settings: "Era styles".
   ========================================================================== */
(function () {
  const root = document.documentElement;
  const on = () => { try { return localStorage.getItem("beyond.eraSkin") !== "off"; } catch (e) { return true; } };
  const era = () => {
    if (!on()) return "";
    const M = window.MODULE, inCase = window.GAME && GAME.state && document.body.dataset.mode && document.body.dataset.mode !== "hub";
    if (inCase && M && M.id === "death-of-a-bloodline") return "";
    const y = (inCase && M && M.year) || (window.CAMP && CAMP.camp && CAMP.camp.year) || 0;
    return y && window.CDATA ? CDATA.eraOf(y).id : "";
  };
  const apply = () => { const e = era(); if ((root.dataset.era || "") !== e) { if (e) root.dataset.era = e; else delete root.dataset.era; } };
  window.ERASKIN = { apply, set: (v) => { try { localStorage.setItem("beyond.eraSkin", v ? "on" : "off"); } catch (e) {} apply(); }, on };
  document.addEventListener("DOMContentLoaded", () => { apply(); new MutationObserver(apply).observe(document.body, { attributes: true, attributeFilter: ["data-mode"] }); setInterval(apply, 1500); });
})();
