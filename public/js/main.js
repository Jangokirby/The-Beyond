/* Boot: restore settings, hand control to the campaign layer. */
(function () {
  const G = window.GAME, U = window.UI;
  function start() {
    G.loadSettings();
    U.$("#btn-case").onclick = () => { if (G.state && G.state.phase !== "hub") G.caseFile(); };
    U.$("#btn-settings").onclick = () => G.settingsModal();
    U.$("#btn-powers").onclick = () => { if (G.state && G.state.phase === "explore") G.powersModal(); else U.toast("Powers can be used while exploring, or from the fight menu."); };
    document.addEventListener("pointerdown", () => AudioMan.unlock(), { once: true });
    window.CAMP.boot();
  }
  start();
})();
