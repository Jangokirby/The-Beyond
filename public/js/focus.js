/* ============================================================================
   POINT AND CLICK + FOCUS

   1. Every option in a scene becomes a spot on the picture (exits on the left,
      people top right, things to examine in the scene). Hovering a spot shows
      what it is, whether a roll is needed, and what it costs. The same
      details sit under the buttons below the scene for phones.
   2. Focus (house rule, on by default): each agent has a few points of
      attention per case. Examining something or talking to someone costs 1
      from the agent who does it, and that agent makes the rolls it calls for.
      Moving and fighting are free. When the team runs dry it can regroup:
      Focus refills and each agent pays 2 Stability for the strain.
   Settings: camp.rules.focus = 0 (off) or the points per agent (default 4).
   ========================================================================== */
(function () {
  const G = window.GAME, U = window.UI, ADV = window.ADV, el = U.el;
  const FOCUS = (window.FOCUS = {});
  const hash = (s) => { let h = 2166136261; for (const ch of String(s)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  const Rr = () => window.R;

  /* ------------------------------------------------------------ settings */
  FOCUS.max = () => { const c = window.CAMP && CAMP.camp; const n = c && c.rules && c.rules.focus; return n == null ? 4 : n; };
  FOCUS.on = () => FOCUS.max() > 0 && !!G.state;
  FOCUS.get = (a) => {
    G.state.focus = G.state.focus || {};
    if (!G.state.focus[a.id]) G.state.focus[a.id] = { cur: FOCUS.max(), max: FOCUS.max() };
    return G.state.focus[a.id];
  };
  FOCUS.left = () => G.active().reduce((s, a) => s + FOCUS.get(a).cur, 0);

  /* ------------------------------------------------------------ reading an option */
  const flat = (steps, out = []) => { for (const s of [].concat(steps || [])) { out.push(s); if (s.once) flat(s.steps, out); if (s.if) { flat(s.then, out); } } return out; };
  const crText = (cr) => { const n = Rr().cr(cr); return `${Rr().crName(n)} (CR ${n})`; };
  FOCUS.describe = (o) => {
    const st = flat(o.steps);
    const k = st.find((s) => s.check) || null, gr = st.find((s) => s.group) || null;
    const exit = st.length && st.every((s) => s.goto) ;
    const fight = st.some((s) => s.combat);
    const talk = !k && !gr && st.some((s) => s.talk || s.converse);
    const kind = exit ? "exit" : fight ? "fight" : talk ? "talk" : "look";
    let roll = "No roll";
    if (k) roll = `${Rr().ASPECT_LABEL[k.check.aspect] || k.check.aspect} roll, ${crText(k.check.cr)}`;
    else if (gr) roll = `Everyone rolls ${Rr().ASPECT_LABEL[gr.group.aspect] || gr.group.aspect}, ${crText(gr.group.cr)}`;
    const desc = o.hint || (k && k.check.label) || (gr && gr.group.label) || (talk ? "Have a word" : exit ? "Go there" : fight ? "This will come to a fight" : "Take a closer look");
    return { kind, roll, desc, aspect: k ? k.check.aspect : null, cr: k ? Rr().cr(k.check.cr) : null, tags: k ? k.check.tags || [] : [], cost: kind === "look" || kind === "talk" ? 1 : 0 };
  };
  /* function-based hotspots (the first case): read what we can from the code */
  const describeFn = (h) => {
    if (h.go) return { kind: "exit", roll: "No roll", desc: "Go there", cost: 0 };
    const src = String(h.run || "");
    const m = src.match(/aspect:\s*"(\w+)"[^}]*?cr:\s*(?:R\.cr\("(\w+)"\)|(\d+))/);
    const talk = /talk|interview|say\(/.test(src) && !m;
    return { kind: talk ? "talk" : "look", roll: m ? `${Rr().ASPECT_LABEL[m[1]] || m[1]} roll, ${crText(m[2] || +m[3])}` : "Maybe a roll", desc: h.hint || (talk ? "Have a word" : "Take a closer look"), aspect: m ? m[1] : null, cr: m ? Rr().cr(m[2] || +m[3]) : null, tags: [], cost: 1 };
  };

  /* ------------------------------------------------------------ placing spots on the picture */
  const CELLS = [[22, 32], [38, 28], [54, 34], [26, 52], [44, 50], [60, 56], [20, 70], [36, 72], [52, 74], [66, 40]];
  const place = (sceneId, spots) => {
    let ex = 0, tk = 0;
    const order = CELLS.map((c, i) => [c, hash(sceneId + i)]).sort((x, y) => x[1] - y[1]).map((x) => x[0]);
    let li = 0;
    for (const s of spots) {
      if (s.info.kind === "exit") s.pos = { x: 1.5, y: 14 + ex++ * 17, w: 9, h: 12 };
      else if (s.info.kind === "talk") s.pos = { x: 74 + (tk % 2) * 12, y: 4 + Math.floor(tk++ / 2) * 12, w: 10, h: 10 };
      else { const c = order[li++ % order.length]; s.pos = { x: c[0] - 4, y: c[1] - 5, w: 8, h: 10 }; }
    }
  };

  /* data cases: options -> spots */
  const compile0 = ADV.compile;
  ADV.compile = (a) => {
    const M = compile0(a);
    for (const [id, sc] of Object.entries(a.scenes || {})) {
      const loc = M.locations[id]; if (!loc) continue;
      const spots = (loc.actions || []).map((act, i) => ({ act, info: FOCUS.describe((sc.options || [])[i] || {}), i }));
      place(id, spots);
      loc.hotspots = spots.map((s) => ({ id: "o" + s.i, label: s.act.label, if: s.act.if, run: s.act.run, pos: s.pos, info: s.info }));
      loc.actions = [];
    }
    return M;
  };

  /* ------------------------------------------------------------ who does it */
  FOCUS.pick = async (h, info) => {
    const team = G.active();
    const fresh = team.filter((a) => FOCUS.get(a).cur > 0);
    if (!fresh.length) return (await FOCUS.regroupAsk()) ? FOCUS.pick(h, info) : null;
    if (fresh.length === 1 && team.length === 1) return fresh[0];
    const opts = team.map((a) => {
      const f = FOCUS.get(a);
      let odds = null;
      if (info.aspect && info.cr && G.checkMods && G.chance) { try { const { mods, cr } = G.checkMods(a, { aspect: info.aspect, cr: info.cr, tags: info.tags }); const b = mods.reduce((x, m) => x + (m.value || 0), 0); odds = `${Rr().ASPECT_LABEL[info.aspect]} ${b >= 0 ? "+" : ""}${b} · ${G.chance(b, cr)}% to succeed`; } catch (e) {} }
      if (!odds && info.aspect) odds = `${Rr().ASPECT_LABEL[info.aspect]} +${Rr().aspect(a, info.aspect)}`;
      return { id: a.id, label: `${a.short} · Focus ${f.cur}/${f.max}`, hint: f.cur ? (odds || (info.kind === "talk" ? "will do the talking" : "will look")) : "no Focus left", disabled: !f.cur };
    });
    opts.push({ id: "_back", label: "Never mind" });
    U.choicesBox().dataset.kind = "who";
    const id = await U.choose(`<span class="checkcall">${h.label}</span> · ${info.roll}. Who ${info.kind === "talk" ? "talks" : "looks"}? (1 Focus)`, opts);
    delete U.choicesBox().dataset.kind;
    return id === "_back" ? null : G.agentById(id);
  };
  FOCUS.regroupAsk = async () => {
    const r = await U.modal({ title: "The team is spent", body: "<p>Nobody has any Focus left for this case. You can regroup: a coffee, a cigarette, a quiet minute. Everyone's Focus refills, and each agent loses 2 Stability from the strain.</p><p class='small'>Focus is a house rule; switch it off in the hideout.</p>",
      buttons: [{ id: "no", label: "Not yet" }, { id: "yes", label: "Regroup", cls: "primary" }] });
    if (r !== "yes") return false;
    FOCUS.regroup(); return true;
  };
  FOCUS.regroup = () => {
    for (const a of G.active()) { const f = FOCUS.get(a); f.cur = f.max; a.pools.stability.cur = Math.max(1, a.pools.stability.cur - 2); }
    U.print("You regroup. Everyone's Focus is back, and everyone feels it: 2 Stability each.", "narr");
    G.refreshParty();
  };

  /* checks inside an action are made by the agent who took it */
  const check0 = G.check;
  G.check = (opts) => (G._actor && (!opts.who || opts.who === "choose") && G.agentById(G._actor) && !G.agentById(G._actor).out ? check0({ ...opts, who: G._actor }) : check0(opts));

  const use0 = G.useHotspot;
  G.useHotspot = (h) => {
    if (G.busy) return;
    const info = h.info || (h.info = describeFn(h));
    if (!FOCUS.on() || !info.cost) return use0(h);
    U.click();
    G.run(async () => {
      const a = await FOCUS.pick(h, info);
      if (!a) return;
      FOCUS.get(a).cur -= info.cost; G.refreshParty();
      G._actor = a.id; G._actorKind = info.kind;
      try { if (h.go) await G.goto(h.go); else if (h.run) await h.run(G.api); } finally { G._actor = null; G._actorKind = null; }
    });
  };

  /* ------------------------------------------------------------ drawing spots, tooltip, buttons */
  let tip = null;
  const tipText = (h) => { const i = h.info || (h.info = describeFn(h)); return [h.label, i.desc, i.roll, i.cost && FOCUS.on() ? "Costs 1 Focus" : "Free"]; };
  const showTip = (b, h) => {
    if (!tip) { tip = el("div", { class: "hottip", role: "tooltip" }); document.body.append(tip); }
    const [t, d, r, c] = tipText(h);
    tip.replaceChildren(el("b", {}, t), el("span", {}, d), el("span", { class: "roll" + (r === "No roll" ? " none" : "") }, r), el("span", { class: "cost" }, c));
    const rc = b.getBoundingClientRect(); tip.hidden = false;
    const tw = tip.offsetWidth, th = tip.offsetHeight;
    let x = rc.left + rc.width / 2 - tw / 2, y = rc.top - th - 10;
    if (y < 8) y = rc.bottom + 10;
    x = Math.max(8, Math.min(window.innerWidth - tw - 8, x));
    tip.style.left = x + "px"; tip.style.top = y + "px";
  };
  const hideTip = () => { if (tip) tip.hidden = true; };
  G.renderHotspots = () => {
    const box = U.$("#hotspots"); box.innerHTML = ""; hideTip();
    const loc = G.loc(); if (!loc) return;
    const lay = (window.LAYOUT || {})[loc.scene] || {};
    for (const h of G.visibleHotspots()) {
      const r = lay[h.id] || h.pos; if (!r) continue;
      const info = h.info || (h.info = describeFn(h));
      const [t, d, rl, c] = tipText(h);
      const b = el("button", { class: `hot k-${info.kind}` + (h.go || info.kind === "exit" ? " exit" : ""), "data-id": h.id, "aria-label": `${t}. ${d}. ${rl}. ${c}.`, title: `${t} · ${rl} · ${c}`, disabled: G.busy,
        style: { left: r.x + "%", top: r.y + "%", width: r.w + "%", height: r.h + "%" }, onclick: () => { hideTip(); G.useHotspot(h); },
        onmouseenter: (e) => showTip(e.currentTarget, h), onmouseleave: hideTip, onfocus: (e) => showTip(e.currentTarget, h), onblur: hideTip },
        el("span", { class: "mark" }, el("i", {}, info.kind === "talk" ? "❝" : info.kind === "exit" ? "➜" : info.kind === "fight" ? "✕" : info.aspect || info.roll !== "No roll" ? "?" : "◉")), el("span", { class: "tag" }, h.label));
      b.removeAttribute("title");
      box.append(b);
    }
    box.dataset.labels = G.settings.labels;
  };
  G.showIdle = () => {
    const box = U.choicesBox(); box.innerHTML = "";
    const loc = G.loc(); if (!loc) return;
    box.append(el("div", { class: "idle-label" }, FOCUS.on() ? `What do you do? · Focus left: ${FOCUS.left()}` : "What do you do?"));
    const wrap = el("div", { class: "idle-grid" });
    for (const h of G.visibleHotspots()) {
      const info = h.info || (h.info = describeFn(h));
      wrap.append(el("button", { class: "btn choice idle" + (info.kind === "exit" || h.go ? " exit" : ""), "data-id": "spot:" + h.id, onclick: () => G.useHotspot(h) },
        el("span", { class: "lbl" }, h.label), info.kind === "exit" ? null : el("small", { class: "spotinfo" }, `${info.roll}${info.cost && FOCUS.on() ? " · 1 Focus" : ""}`)));
    }
    for (const a of loc.actions || []) if (!a.if || a.if(G.api)) wrap.append(el("button", { class: "btn choice idle", onclick: () => { U.click(); G.run(() => a.run(G.api)); } }, el("span", { class: "lbl" }, a.label)));
    if (FOCUS.on() && G.active().some((a) => FOCUS.get(a).cur < FOCUS.get(a).max))
      wrap.append(el("button", { class: "btn choice idle ghost", onclick: () => { U.click(); G.run(async () => { await FOCUS.regroupAsk(); }); } }, el("span", { class: "lbl" }, "Regroup"), el("small", { class: "spotinfo" }, "Refill Focus · 2 Stability each")));
    /* safety net: a scene with nothing left to do never leaves the table stuck */
    if (!wrap.children.length || (![...wrap.children].some((b) => !b.classList.contains("ghost")) && !(G.visibleHotspots().length))) {
      box.append(el("p", { class: "cnote" }, "There's nothing left to try here."));
      wrap.append(el("button", { class: "btn choice idle", onclick: () => { U.click(); G.run(() => window.CAMP.endAdventure("lose")); } }, el("span", { class: "lbl" }, "Close the case as it stands"), el("small", { class: "spotinfo" }, "Counts as not solved")));
    }
    box.append(wrap);
  };

  /* focus pips on the party cards */
  const party0 = G.refreshParty;
  G.refreshParty = () => {
    party0();
    if (!FOCUS.on()) return;
    for (const a of G.state.agents) {
      const card = document.querySelector(`#party .agent[data-id="${a.id}"] .meta`); if (!card || a.dead) continue;
      const f = FOCUS.get(a);
      card.append(el("span", { class: "focus", title: `Focus ${f.cur} of ${f.max}` }, ...Array.from({ length: f.max }, (_, i) => el("i", { class: i < f.cur ? "on" : "" }))));
    }
  };

  /* ------------------------------------------------------------ the house rule, in the hideout */
  document.addEventListener("DOMContentLoaded", () => {
    if (!window.HIDE || !HIDE.tab) return;
    const tab0 = HIDE.tab;
    HIDE.tab = function () {
      const box = tab0.apply(this, arguments), foot = box.querySelector(".hfoot"), c = CAMP.camp;
      if (foot && c) foot.append(el("label", { class: "field inline" }, el("span", {}, "Focus per agent (house rule)"),
        el("select", { onchange: (e) => { c.rules.focus = +e.target.value; CAMP.save(); } }, ...[3, 4, 5, 6, 0].map((n) => el("option", { value: String(n), selected: FOCUS.max() === n ? "selected" : null }, n ? `${n} per case` : "Off")))));
      return box;
    };
    if (CAMP.ui.tabs) CAMP.ui.tabs.hideout = HIDE.tab;
  });
})();
