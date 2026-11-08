/* ============================================================================
   GM SCREEN — the host's drawer at a live table (or anyone who turns on
   "GM tools" in the hideout). Everything here shows on the players' screens
   through the shared table, like the rest of the game.
     narrate      type a line; it appears in everyone's story
     reveal       hand over a clue from the case (it opens as a handout)
     mood         change the music
     adjust       Health, Sanity, Stability or a Fate Point, up or down
     next roll    the GM's thumb on the dice: high (5+6) or low (1+2), once
   ========================================================================== */
(function () {
  const GS = (window.GMSCREEN = {});
  const allowed = () => (window.LIVE && LIVE.hosting && LIVE.hosting()) || !!(window.CAMP && CAMP.camp && CAMP.camp.rules && CAMP.camp.rules.gmTools);
  let force = null;
  const R = window.R;
  if (R && R.roll2d6) { const r0 = R.roll2d6; R.roll2d6 = () => { if (force) { const f = force; force = null; GS.paint(); return f === "high" ? [5, 6] : [1, 2]; } return r0(); }; }
  GS.open = () => {
    const U = window.UI, el = U.el, G = window.GAME, M = window.MODULE; if (!G || !G.state || !M) return U.toast("The GM screen works during a case.");
    const pane = el("div", { class: "gmscreen" });
    const draw = () => {
      const missing = Object.entries(M.clues || {}).filter(([id]) => !G.state.clues.includes(id));
      const txt = el("textarea", { rows: "2", placeholder: "Something only the GM knows…" });
      const cues = Object.keys((window.ASSETS && ASSETS.music) || {}).filter((k) => /^(cue_|src_)/.test(k) || ["hideout", "investigation", "basement", "combat", "boss"].includes(k));
      const cueSel = el("select", {}, ...cues.map((k) => el("option", { value: k }, k.replace(/^cue_|^src_/, "").replace(/_/g, " "))));
      pane.replaceChildren(
        el("h4", {}, "Narrate"), txt, el("button", { class: "btn small primary", onclick: () => { if (txt.value.trim()) { U.print(`<i>${txt.value.trim().replace(/</g, "&lt;")}</i>`, "narr gmline"); txt.value = ""; } } }, "Say it"),
        el("h4", {}, "Reveal a clue"), missing.length ? el("div", { class: "gmlist" }, ...missing.map(([id, c]) => el("button", { class: "btn small ghost", onclick: () => { G.api.clue(id); if (window.HANDOUT) HANDOUT.show(c, M); draw(); } }, c.t))) : el("p", { class: "small muted" }, "They have every clue."),
        el("h4", {}, "Mood"), el("div", { class: "row tight" }, cueSel, el("button", { class: "btn small", onclick: () => AudioMan.music(cueSel.value) }, "Play"), el("button", { class: "btn small ghost", onclick: () => AudioMan.music(null) }, "Silence")),
        el("h4", {}, "Adjust"), ...G.active().map((a) => el("div", { class: "gmrow" }, el("b", {}, a.short),
          ...["health", "sanity", "stability"].map((k) => el("span", { class: "gmpool" }, el("small", {}, k[0].toUpperCase()),
            el("button", { class: "btn tiny", onclick: () => { a.pools[k].cur = Math.max(0, a.pools[k].cur - 1); G.refreshParty(); draw(); } }, "−"), el("span", {}, `${a.pools[k].cur}`),
            el("button", { class: "btn tiny", onclick: () => { a.pools[k].cur = Math.min(a.pools[k].max, a.pools[k].cur + 1); G.refreshParty(); draw(); } }, "+"))),
          el("span", { class: "gmpool" }, el("small", {}, "Fate"), el("button", { class: "btn tiny", onclick: () => { a.fate = Math.max(0, (a.fate || 0) - 1); G.refreshParty(); draw(); } }, "−"), el("span", {}, `${a.fate || 0}`), el("button", { class: "btn tiny", onclick: () => { a.fate = (a.fate || 0) + 1; G.refreshParty(); draw(); } }, "+")))),
        el("h4", {}, "Next roll"), el("div", { class: "row tight" }, ...[["high", "High (5+6)"], ["low", "Low (1+2)"], [null, "Let the dice fall"]].map(([v, l]) => el("button", { class: "btn small" + (force === v ? " primary" : " ghost"), onclick: () => { force = v; draw(); } }, l))),
        el("p", { class: "small muted" }, "The players see what you narrate, reveal, play and change. They don't see this screen."));
    };
    GS.paint = () => { if (pane.isConnected) draw(); };
    draw();
    U.modal({ title: "GM screen", cls: "wide gmmodal", body: pane });
  };
  /* the button: in the case header, for the host (or with GM tools on) */
  document.addEventListener("DOMContentLoaded", () => {
    setInterval(() => {
      const caseBtn = document.querySelector("#btn-case"), bar = caseBtn && caseBtn.parentNode;
      const want = allowed() && window.GAME && GAME.state;
      let b = document.querySelector("#gmbtn");
      if (want && !b && bar) bar.prepend(b = window.UI.el("button", { id: "gmbtn", class: "icon-btn labeled", "aria-label": "GM screen", onclick: () => GS.open() }, window.UI.el("span", { class: "ico", "aria-hidden": "true" }, "◈"), window.UI.el("span", { class: "txt" }, "GM")));
      else if (!want && b) b.remove();
    }, 1000);
    const H = window.HIDE; if (!H || !H.tab) return;
    const tab0 = H.tab;
    H.tab = function () {
      const box = tab0.apply(this, arguments), foot = box.querySelector(".hfoot"), c = CAMP.camp, el = window.UI.el;
      if (foot && c) foot.append(el("label", { class: "field inline check", title: "Shows a GM screen during cases: narrate, reveal clues, change the music, adjust pools, steer the next roll." },
        el("input", { type: "checkbox", checked: c.rules.gmTools ? "checked" : null, onchange: (e) => { c.rules.gmTools = e.target.checked; CAMP.save(); } }), el("span", {}, "GM tools")));
      return box;
    };
    if (CAMP.ui.tabs) CAMP.ui.tabs.hideout = H.tab;
  });
})();
