/* ============================================================================
   CORKBOARD (house rule, off unless the campaign turns it on)

   Once the team holds two clues, the case file gets a Theory tab: pin the
   clues that matter and say what you think it is and where it will be.
   One theory per case. Both right: the team goes in prepared, and every
   agent gains a Fate Point for this case. Wrong: nothing lost but the
   certainty. Works on any written case or side job; the answer is read from
   the case itself (its strongest enemy and the fight it waits in).
   ========================================================================== */
(function () {
  const K = (window.CORK = {});
  K.on = () => { const c = window.CAMP && CAMP.camp; return !!(c && c.rules && c.rules.cork); };
  const TYPES = ["Spirit", "Undead", "Beyond", "Feral", "Folklore", "Swarm", "Construct", "Golem", "Divine", "Human"];
  const TYPE_WORDS = { Spirit: "A ghost or spirit", Undead: "Something dead that walks", Beyond: "A thing from the Beyond", Feral: "A beast", Folklore: "A creature out of folklore", Swarm: "A swarm", Construct: "Something made that moves", Golem: "Stone or clay, given life", Divine: "A false holiness", Human: "A person, twisted" };
  const hash = (s) => { let h = 7; for (const ch of String(s)) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; };
  /* the answer: the case's toughest enemy, and the fight it is in */
  K.answer = (M) => {
    const encs = Object.entries(M.encounters || {});
    if (!encs.length) return null;
    let best = null;
    for (const [id, e] of encs) for (const f of e.foes || []) { const d = (M.enemies || {})[f.t]; if (!d) continue; const score = (d.boss ? 1000 : 0) + (d.health || 0) + (d.sanity || 0); if (!best || score > best.score) best = { score, type: d.type || "Beyond", name: d.name, enc: id, where: e.name }; }
    return best;
  };
  K.pane = (M, redraw) => {
    const el = window.UI.el, G = window.GAME, st = G.state, ans = K.answer(M);
    const box = el("div", { class: "cork" });
    if (!ans) return el("p", { class: "muted" }, "Nothing to theorise about here.");
    const th = (st.theory = st.theory || { pins: [], type: "", where: "", done: false });
    if (G.state.clues.length < 2) return el("p", { class: "muted" }, "Pin up at least two clues before you try to put it together.");
    box.append(el("p", { class: "small muted" }, "House rule. Pin the clues that matter, then say what it is and where it will be. One theory per case: both right, and everyone gains a Fate Point for this case."));
    const board = el("div", { class: "corkboard" });
    for (const id of G.state.clues) {
      const c = M.clues[id]; const on = th.pins.includes(id);
      board.append(el("button", { class: "pinnote" + (on ? " on" : ""), disabled: th.done ? "disabled" : null, style: { transform: `rotate(${(hash(id) % 7) - 3}deg)` },
        onclick: () => { th.pins = on ? th.pins.filter((x) => x !== id) : [...th.pins, id]; redraw(); } }, el("b", {}, c.t), el("small", {}, c.s)));
    }
    box.append(board);
    const seed = hash(M.id);
    const types = [ans.type, ...TYPES.filter((t) => t !== ans.type).sort((a, b) => hash(a + seed) - hash(b + seed)).slice(0, 3)].sort((a, b) => hash(a + "t" + seed) - hash(b + "t" + seed));
    const places = [...new Set([ans.where, ...Object.values(M.locations || {}).map((l) => l.name).filter((n) => n && n !== ans.where)])].slice(0, 4).sort((a, b) => hash(a + "w" + seed) - hash(b + "w" + seed));
    const seg = (label, list, key, words) => el("div", { class: "field" }, el("span", {}, label), el("div", { class: "seg wrap" }, ...list.map((v) => el("button", { class: "segbtn" + (th[key] === v ? " on" : ""), disabled: th.done ? "disabled" : null, onclick: () => { th[key] = v; redraw(); } }, words ? words[v] || v : v))));
    box.append(seg("What is it?", types, "type", TYPE_WORDS), seg("Where will it be?", places, "where"));
    if (th.done) box.append(el("p", { class: th.right ? "good" : "warn" }, th.right ? "You were right. Everyone goes in prepared: +1 Fate Point each for this case." : "The pieces don't fit the way you hoped. You'll find out the rest the hard way."));
    else box.append(el("button", { class: "btn primary", disabled: th.pins.length < 2 || !th.type || !th.where ? "disabled" : null, onclick: () => {
      th.done = true; th.right = th.type === ans.type && th.where === ans.where;
      if (th.right) { for (const a of G.active()) a.fate = (a.fate || 0) + 1; G.refreshParty(); window.UI.toast("<b>Theory confirmed.</b> +1 Fate Point each.", "clue"); }
      redraw();
    } }, th.pins.length < 2 ? "Pin at least two clues" : "Commit to the theory"));
    return box;
  };
  /* the switch, with the other house rules in the hideout */
  document.addEventListener("DOMContentLoaded", () => {
    const H = window.HIDE; if (!H || !H.tab) return;
    const tab0 = H.tab;
    H.tab = function () {
      const box = tab0.apply(this, arguments), foot = box.querySelector(".hfoot"), c = CAMP.camp, el = window.UI.el;
      if (foot && c) foot.append(el("label", { class: "field inline check", title: "Pin clues into a theory before the end of a case. Right: +1 Fate Point each for that case." },
        el("input", { type: "checkbox", checked: c.rules.cork ? "checked" : null, onchange: (e) => { c.rules.cork = e.target.checked; CAMP.save(); } }), el("span", {}, "Corkboard theories (house rule)")));
      return box;
    };
    if (CAMP.ui.tabs) CAMP.ui.tabs.hideout = H.tab;
  });
})();
