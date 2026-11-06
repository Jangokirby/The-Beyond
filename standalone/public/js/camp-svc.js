/* ============================================================================
   Services (Doctor, Therapist, Company, Spy, Occult Representative, Trade Service,
   Taxi, Guard, Apprentice, Housekeeper), artifact memory rewards, Heirlooms,
   and the Beyond's claim on a heavily Noticed agent.
   ========================================================================== */
(function () {
  const GD = window.GD, R = window.R, CAMP = window.CAMP, U = window.UI, ui = CAMP.ui, el = U.el, ADV = window.ADV;
  const { btn, panel, note, toast } = ui;
  const SVC = (window.SVC = {});
  const modal = (o) => U.modal(o);
  const redraw = () => { CAMP.save(); ui.hub(); };
  const ph = (t) => (t || "").replace(/\s+/g, " ");

  /* ---------------------------------------------------------------- uses */
  SVC.limit = (s) => 1 + (s.extra || 0);
  SVC.left = (s) => SVC.limit(s) - (s.used || 0);
  const useOne = (s) => { if (SVC.left(s) <= 0) { toast(`${s.name} won't take another call this mission. Commit it again for another use.`); return false; } s.used = (s.used || 0) + 1; return true; };
  const active = (a) => a.assets.filter((x) => x.kind === "service" && (x.committed || x.owned) && x.ref !== "Apprentice");

  /* a Taxi above Mundane doubles as one other Mundane service */
  SVC.effective = (a) => {
    const out = [];
    for (const s of active(a)) {
      out.push({ s, ref: s.ref, wc: s.wc });
      if (s.ref === "Taxi" && s.wc >= 2 && s.also) out.push({ s, ref: s.also, wc: 1, virtual: true });
    }
    return out;
  };
  SVC.has = (a, ref, minWc = 1) => SVC.effective(a).some((e) => e.ref === ref && e.wc >= minWc);

  const heal = (a, map) => {
    const lines = [];
    for (const [k, v] of Object.entries(map)) { const p = a.pools[k], b = p.cur; p.cur = Math.min(p.max, p.cur + v); lines.push(`${p.cur - b} ${R.POOL_LABEL[k]}`); }
    return lines.join(", ");
  };
  const companyAmt = (wc) => { let n = 3; for (let k = 2; k <= wc; k++) n += 1 + k; return n; };

  /* ---------------------------------------------------------------- injuries and disorders */
  SVC.cureDisorder = (a, inj) => {
    const d = R.DISORDERS.find((x) => x.name === inj.disorderName);
    if (d && d.pool) { a.pools[d.pool].max += d.minus; if (a.poolMax) a.poolMax[d.pool] = (a.poolMax[d.pool] || a.pools[d.pool].max - d.minus) + d.minus; }
    inj.disorderName = null; inj.disorderTreated = true; delete inj.dfx;
  };
  SVC.cureInjury = (a, inj) => {
    if (inj.core) a.core[inj.core] += 1 + (inj.extraCore || 0);
    if (inj.disorderName) SVC.cureDisorder(a, inj);
    a.injuries.splice(a.injuries.indexOf(inj), 1);
  };
  const pickInjury = async (a, title, filter) => {
    const list = (a.injuries || []).filter(filter);
    if (!list.length) { toast("Nothing here to treat."); return null; }
    const sel = el("select", {}, ...list.map((i, n) => el("option", { value: String(n) }, `${i.name}${i.disorderName ? " (" + i.disorderName + ")" : ""}`)));
    const r = await modal({ title, body: el("div", {}, note("Choose which one to treat."), sel), buttons: [{ id: "no", label: "Cancel" }, { id: "ok", label: "Treat", cls: "primary" }] });
    return r === "ok" ? list[+sel.value] : null;
  };

  /* ---------------------------------------------------------------- artifact memories */
  SVC.memoryUnlocked = (a, ar) => {
    ar.memories += 1;
    CAMP.logAdd(`${a.name} unlocked memory ${ar.memories} of ${ar.name}.`);
    const lines = [];
    if (ar.memories === 3 || ar.memories === 4) { a.bonusFate = (a.bonusFate || 0) + 1; lines.push("A Fate Point is yours to spend on the next mission."); }
    if (ar.memories === 5) lines.push("The item's curse lifts, and you can speak freely with its previous owner.");
    return lines;
  };

  /* ---------------------------------------------------------------- the panel */
  ui.servicesPanel = (a) => {
    const rows = active(a);
    const app = a.assets.filter((x) => x.kind === "service" && x.ref === "Apprentice");
    if (!rows.length && !app.length) return null;
    const mk = (s) => {
      const acts = [];
      const eff = [{ ref: s.ref, wc: s.wc }];
      if (s.ref === "Taxi" && s.wc >= 2 && s.also) eff.push({ ref: s.also, wc: 1 });
      for (const e of eff) {
        if (e.ref === "Doctor") {
          const n = 10 + 4 * (e.wc - 3);
          acts.push(btn(`Doctor: heal ${n} Health`, () => { if (!useOne(s)) return; toast(`Healed ${heal(a, { health: n })}.`); CAMP.passDays(1); redraw(); }, "small"));
          if (e.wc >= 4) acts.push(btn("Doctor: treat an injury", async () => { const inj = await pickInjury(a, "Doctor: treat an injury", () => true); if (!inj || !useOne(s)) return; SVC.cureInjury(a, inj); CAMP.logAdd(`${a.name}'s ${inj.name} was treated.`); toast(`${inj.name} treated. The lost Core point is back.`); redraw(); }, "small"));
        }
        if (e.ref === "Therapist") {
          const n = 10 + 4 * (e.wc - 3);
          acts.push(btn(`Therapist: heal ${n} Sanity`, () => therapy(a, s, e.wc), "small"));
          if (e.wc >= 4) acts.push(btn("Therapist: treat a disorder", async () => { const inj = await pickInjury(a, "Therapist: treat a Mental Disorder", (i) => i.disorderName); if (!inj || !useOne(s)) return; SVC.cureDisorder(a, inj); CAMP.logAdd(`${a.name}'s disorder was treated.`); toast("Treated."); redraw(); }, "small"));
        }
        if (e.ref === "Company") {
          const n = companyAmt(e.wc);
          acts.push(btn(`Company: +${n} to every pool`, () => { if (!useOne(s)) return; toast(`Recovered ${heal(a, { health: n, sanity: n, stability: n })}.`); CAMP.passDays(1); redraw(); }, "small"));
        }
        if (e.ref === "Spy") acts.push(btn("Spy: ask for information", () => spy(a, s, e.wc), "small"));
        if (e.ref === "Occult Representative") {
          acts.push(btn(`Occult Rep: reveal ${1 + (e.wc - 4)} memor${e.wc > 4 ? "ies" : "y"}`, () => repMemory(a, s, e.wc), "small"));
          acts.push(btn(`Occult Rep: reveal ${2 + (e.wc - 4)} Modifiers`, () => repMods(a, s, e.wc), "small"));
        }
        if (e.ref === "Trade Service") acts.push(btn("Trade Service: craft gear", () => workshop(a, s, e.wc), "small"));
      }
      if (s.ref === "Taxi" && s.wc >= 2) acts.push(el("label", { class: "field" }, el("span", {}, "Also acts as"),
        el("select", { onchange: (ev) => { s.also = ev.target.value; redraw(); } }, el("option", { value: "" }, "Nothing"), ...["Housekeeper", "Company", "Guard"].map((x) => el("option", { value: x, selected: s.also === x ? "selected" : null }, x)))));
      return el("div", { class: "assetrow" }, el("div", { class: "grow" }, el("b", {}, s.name), el("small", {}, `${CAMP.WC[s.wc]} · ${SVC.left(s)} of ${SVC.limit(s)} use${SVC.limit(s) === 1 ? "" : "s"} left this mission`
        + (s.ref === "Guard" || s.ref === "Apprentice" ? " · joins your missions as an ally" : s.ref === "Housekeeper" ? (s.wc >= 2 ? ` · keeps ${1 + s.wc} items out of Ruin` : " · upgrade it to keep items out of Ruin") : "")), el("div", { class: "row tight" }, ...acts.filter(Boolean))),
        btn("Commit again", () => { if (CAMP.spUsed(a) + CAMP.assetCost(a, s) > CAMP.spMax(a)) { toast("Not enough Spending Power."); return; } s.extra = (s.extra || 0) + 1; redraw(); }, "small ghost", { title: "One more use this mission, for the same Spending Power" }));
    };
    return panel("Services", note("A committed service can be used once per commit this mission, then they refuse until it is committed again."), ...rows.map(mk),
      ...app.map((s) => el("div", { class: "assetrow" }, el("div", { class: "grow" }, el("b", {}, s.name), el("small", {}, s.owned ? "Trained. Joins your missions as an ally, and carries on your work if you fall." : `In training ${s.secure}/3 missions. Over-commit it each mission to finish.`)))));
  };

  const therapy = async (a, s, wc) => {
    const total = 10 + 4 * (wc - 3), slots = 1 + (wc - 3);
    const bonds = a.bonds.filter((b) => b.value >= 0);
    const num = (v) => el("input", { type: "number", min: "0", max: String(total), value: String(v), style: { width: "5rem" } });
    const mine = num(total);
    const bondRows = bonds.map((b) => ({ b, on: el("input", { type: "checkbox" }), n: num(0) }));
    const body = el("div", {}, note(`${total} Sanity to hand out. You can bring up to ${slots} Bond${slots > 1 ? "s" : ""}; their share restores the Bond's value.`),
      el("label", { class: "field" }, el("span", {}, a.short), mine),
      ...bondRows.map((r) => el("label", { class: "field check" }, r.on, el("span", {}, `${r.b.name} (bond ${r.b.value})`), r.n)));
    const res = await modal({ title: "Therapy session", body, buttons: [{ id: "no", label: "Cancel" }, { id: "ok", label: "Begin", cls: "primary" }] });
    if (res !== "ok") return;
    const chosen = bondRows.filter((r) => r.on.checked).slice(0, slots);
    const give = (+mine.value || 0) + chosen.reduce((x, r) => x + (+r.n.value || 0), 0);
    if (give > total) { toast(`That adds up to ${give}, more than ${total}.`); return; }
    if (!useOne(s)) return;
    const got = heal(a, { sanity: +mine.value || 0 });
    for (const r of chosen) { const add = +r.n.value || 0; const cap = Math.max(10, r.b.value); r.b.value = Math.min(cap, r.b.value + add); }
    CAMP.logAdd(`${a.name} had a therapy session.`);
    toast(`Healed ${got}.`);
    CAMP.passDays(1); redraw();
  };

  const spy = async (a, s, wc) => {
    const cr = Math.max(2, 8 - 2 * Math.max(0, wc - 3));
    const asp = el("select", {}, ...["iq", "charisma", "awareness"].map((k) => el("option", { value: k }, R.ASPECT_LABEL[k])));
    const q = el("input", { type: "text", placeholder: "Who or what do you want to know about?", maxlength: "120" });
    const res = await modal({ title: "Send the Spy", body: el("div", {}, note(`Roll against CR ${cr}. The GM chooses which Aspect fits, so pick the one you'll argue for. On a success the GM may give the information, an alternative, or a mission built from it.`), el("label", { class: "field" }, el("span", {}, "Aspect"), asp), q), buttons: [{ id: "no", label: "Cancel" }, { id: "ok", label: "Roll", cls: "primary" }] });
    if (res !== "ok" || !useOne(s)) return;
    const d1 = R.d6(), d2 = R.d6(), v = R.aspect(a, asp.value), tot = d1 + d2 + v, ok = R.meets(tot, cr);
    AudioMan.sfx(ok ? "roll_success" : "roll_fail");
    CAMP.logAdd(`${a.name}'s Spy ${ok ? "came back with" : "came back empty on"}: ${q.value || "a question"}.`);
    CAMP.passDays(1);
    modal({ title: ok ? "The Spy delivers" : "The Spy comes back empty", body: `<p class="mono">${d1} + ${d2} + ${v} = ${tot} vs CR ${cr}</p><p>${ok ? "Tell the GM what you asked. They decide what comes back." : "Nothing solid. The trail is cold."}</p>`, buttons: [{ id: "ok", label: "OK" }] }).then(redraw);
  };

  const repMemory = async (a, s, wc) => {
    const list = a.artifacts.filter((x) => x.memories < 5);
    if (!list.length) { toast("No artifact has a hidden memory left."); return; }
    const sel = el("select", {}, ...list.map((x, i) => el("option", { value: String(i) }, `${x.name} (${x.memories}/5)`)));
    const res = await modal({ title: "Occult Representative", body: el("div", {}, note("They reveal the next memory without a roll or risk."), sel), buttons: [{ id: "no", label: "Cancel" }, { id: "ok", label: "Ask", cls: "primary" }] });
    if (res !== "ok" || !useOne(s)) return;
    const ar = list[+sel.value];
    const n = Math.min(1 + Math.max(0, (wc || 4) - 4), 5 - ar.memories);
    const lines = [];
    for (let i = 0; i < n; i++) lines.push(...SVC.memoryUnlocked(a, ar));
    await modal({ title: n > 1 ? "Memories surface" : "A memory surfaces", body: `<p>${n > 1 ? n + " memories" : "Memory " + ar.memories} of ${ar.name} ${n > 1 ? "are" : "is"} open (${ar.memories} of 5). ${lines.join(" ")}</p>`, buttons: [{ id: "ok", label: "OK" }] });
    redraw();
  };
  const repMods = async (a, s, wc) => {
    const n = 2 + (wc - 4), all = [];
    for (const adv of CAMP.advList()) { try { const M = ADV.get(adv.id); for (const [k, e] of Object.entries(M.enemies || {})) if ((e.mods || []).length) all.push({ name: e.name, mods: e.mods, from: adv.title }); } catch (e) { /* skip */ } }
    if (!all.length) { toast("Nothing to look up."); return; }
    const sel = el("select", {}, ...all.map((x, i) => el("option", { value: String(i) }, `${x.name} (${x.from})`)));
    const res = await modal({ title: "Occult Representative", body: el("div", {}, note(`They name ${n} of its Modifiers.`), sel), buttons: [{ id: "no", label: "Cancel" }, { id: "ok", label: "Ask", cls: "primary" }] });
    if (res !== "ok" || !useOne(s)) return;
    const m = all[+sel.value];
    const uniq = [...new Set(m.mods.map((x) => x.split(":")[0]))].slice(0, n);
    await modal({ title: m.name, body: `<ul>${uniq.map((x) => { const t = GD.monsterMods.find((y) => y.name === x); return `<li><b>${x}.</b> ${t ? ph(t.text) : ""}</li>`; }).join("")}</ul>`, buttons: [{ id: "ok", label: "OK" }] });
    redraw();
  };

  /* Trade Service: craft or rework weapon and armor. +1 unrestricted Modifier per class above Advanced. */
  const workshop = async (a, s, wc) => {
    const extra = Math.max(0, wc - 3);
    let which = "weapon";
    const body = el("div", {});
    const state = { weapon: { mods: [...a.weapon.mods], spec: a.weapon.specialty, name: a.weapon.name, picks: { ...(a.weapon.picks || {}) } }, armor: { mods: [...a.armor.mods], spec: a.armor.specialty, name: a.armor.name, picks: { ...(a.armor.picks || {}) } } };
    const draw = () => {
      body.replaceChildren();
      const st = state[which], isW = which === "weapon", pool = isW ? GD.weaponMods : GD.armorMods, specs = isW ? GD.weaponSpecialties : GD.armorSpecialties;
      const limit = 2 + extra, key = isW ? "w" : "a";
      body.append(el("div", { class: "seg" }, ...["weapon", "armor"].map((k) => el("button", { class: "segbtn" + (which === k ? " on" : ""), onclick: () => { which = k; draw(); } }, k === "weapon" ? "Weapon" : "Armor"))),
        el("label", { class: "field" }, el("span", {}, "Name"), el("input", { type: "text", value: st.name, maxlength: "40", oninput: (e) => { st.name = e.target.value; } })),
        note(`Modifiers ${st.mods.length}/${limit}${extra ? ` (the extra ${extra} ignore the usual restrictions)` : ""}.`),
        el("div", { class: "modlist" }, ...pool.map((m) => { const on = st.mods.includes(m.name); return el("label", { class: "modrow" + (on ? " on" : "") }, el("input", { type: "checkbox", checked: on ? "checked" : null, disabled: !on && st.mods.length >= limit ? "disabled" : null, onchange: () => { if (on) st.mods.splice(st.mods.indexOf(m.name), 1); else st.mods.push(m.name); draw(); } }), el("b", {}, m.name), el("small", {}, ph(m.text))); })),
        el("label", { class: "field" }, el("span", {}, "Specialty"), el("select", { onchange: (e) => { st.spec = e.target.value; draw(); } }, ...specs.map((x) => el("option", { value: x.name, selected: st.spec === x.name ? "selected" : null }, x.name)))),
        ...window.GEAR.pickKeys(key, st.mods, st.spec).map((k) => { const def = window.GEAR.PICKS[key][k], opts = def.opts(); if (!opts.includes(st.picks[k])) st.picks[k] = opts[0]; return el("label", { class: "field" }, el("span", {}, `${k}: ${def.label}`), el("select", { onchange: (e) => { st.picks[k] = e.target.value; } }, ...opts.map((o) => el("option", { value: o, selected: st.picks[k] === o ? "selected" : null }, o)))); }));
    };
    draw();
    const res = await modal({ title: "Trade Service", cls: "wide", body: el("div", {}, note("The craftsman takes a day. Anything unique has to be made by someone."), body), buttons: [{ id: "no", label: "Cancel" }, { id: "ok", label: "Craft it (1 day)", cls: "primary" }] });
    if (res !== "ok") return;
    const w = state.weapon, ar = state.armor;
    if (w.mods.length > 2 + extra || ar.mods.length > 2 + extra) { toast("Too many Modifiers."); return; }
    if (w.mods.length <= 2) { const probe = { name: w.name || "x", type: a.weapon.type, mods: w.mods, specialty: w.spec }; const errs = CAMP.weaponValid(probe); if (errs.length) { toast(errs[0]); return; } }
    if (!useOne(s)) return;
    a.weapon.mods = w.mods; a.weapon.specialty = w.spec; a.weapon.name = w.name.trim() || a.weapon.name; a.weapon.picks = w.picks;
    a.weapon.bonus = (a.weapon.mods.includes("Empowered") && a.weapon.type === "Melee One-Handed") ? 3 : (GD.weaponTypes.find((x) => x.name === a.weapon.type) || {}).bonus || a.weapon.bonus;
    a.armor.mods = ar.mods; a.armor.specialty = ar.spec; a.armor.name = ar.name.trim() || a.armor.name; a.armor.picks = ar.picks;
    a.traits = a.traits || {};
    a.traits.torchBearer = ar.spec === "Torch Bearer"; a.traits.lastStand = ar.spec === "Last Stand";
    CAMP.logAdd(`${a.name}'s gear was reworked by a craftsman.`);
    CAMP.passDays(1);
    redraw();
  };

  /* ---------------------------------------------------------------- allies for missions: Guard and a trained Apprentice */
  const LOOK = { skin: "#c68d62", hairC: "#17120f", hair: "short", outfit: "#2b2b2b", extra: "none", bg: "#2b2f3a" };
  const DIFF = ["easy", "medium", "challenging", "dangerous", "hopeless"];
  /* the book's Guard: Human, Easy. Health 20, Sanity 15, Stability 15, Attack +2, ER 6, BR 1, MR 0, SR 0, Speed 0 (Speech, Ranged, Quick Draw).
     Each Wealth Class above Mundane raises its difficulty by 1. */
  const mkGuard = (a, e, id) => {
    const D = ADV.MB.DIFFS, step = DIFF[Math.min(4, e.wc - 1)], d = D[step], e0 = D.easy;
    const name = `${a.short}'s guard`, key = window.ART.portrait({ ...LOOK, name });
    const pool = (b) => Math.max(1, b + d.pool - e0.pool);
    return { id: "al_" + id + "_guard" + e.s.uid, name, short: name, portrait: key, owner: id, who: "guard" + e.s.uid,
      attackBonus: 2 + 2 + d.atk - e0.atk, er: Math.max(0, 6 + d.er - e0.er), br: Math.max(0, 1 + d.res - e0.res), mr: Math.max(0, d.res - e0.res), sr: Math.max(0, d.res - e0.res),
      pools: { health: { cur: pool(20), max: pool(20) }, sanity: { cur: pool(15), max: pool(15) }, stability: { cur: pool(15), max: pool(15) } } };
  };
  SVC.allies = (ids) => {
    const out = [];
    for (const id of ids) {
      const a = CAMP.char(id); if (!a) continue;
      const mk = (name, diff, who) => {
        const m = ADV.buildMonster({ name, type: "Human", difficulty: diff, sprite: "humanoid", mods: [] });
        const look = { ...LOOK, name };
        const key = window.ART.portrait(look);
        return { id: "al_" + id + "_" + who, name, short: name, portrait: key, attackBonus: m.attack + 2, er: m.er, br: m.br, mr: m.mr, sr: m.sr, owner: id, who,
          pools: { health: { cur: m.health, max: m.health }, sanity: { cur: m.sanity, max: m.sanity }, stability: { cur: m.stability, max: m.stability } } };
      };
      for (const e of SVC.effective(a)) if (e.ref === "Guard") out.push(mkGuard(a, e, id));
      for (const s of a.assets) if (s.kind === "service" && s.ref === "Apprentice" && s.owned) out.push(mk(`${a.short}'s apprentice`, DIFF[Math.max(0, Math.min(4, s.wc - 2))], "app" + s.uid));
    }
    return out;
  };

  /* ---------------------------------------------------------------- Beyond: Noticed above 10 */
  SVC.beyondOwed = (a) => Math.max(0, (a.noticed || 0) - 10 - (a.beyondRolled || 0));
  SVC.beyondCheck = async () => {
    for (const a of CAMP.camp.chars.filter((x) => x.status === "active")) {
      while (SVC.beyondOwed(a) > 0 && a.status === "active") {
        a.beyondRolled = (a.beyondRolled || 0) + 1;
        const best = Math.max(...Object.keys(R.ASPECT_LABEL).map((k) => R.aspect(a, k)));
        const d1 = R.d6(), d2 = R.d6(), tot = d1 + d2 + best, cr = R.cr("medium"), ok = R.meets(tot, cr);
        AudioMan.sfx(ok ? "roll_success" : "roll_fail");
        await modal({ title: "The Beyond looks through you", dismiss: false, body: `<p>${a.name} is Noticed past 10. The Beyond wants to use them as a gateway. 2d6 + best Aspect against CR ${cr}.</p><p class="mono">${d1} + ${d2} + ${best} = ${tot}: ${ok ? "held" : "opened"}</p><p>${ok ? "Something you value keeps the door shut, for now." : `${a.name} manifests a Beyond Event. They have become another conduit, and the GM runs a Beyond Entity or a Rupture.`}</p>`, buttons: [{ id: "ok", label: "Continue", cls: "primary" }] });
        if (!ok) { a.status = "dead"; a.deathText = "Became a conduit for the Beyond."; CAMP.logAdd(`${a.name} became a conduit for the Beyond.`); }
      }
    }
    CAMP.save();
  };

  /* ---------------------------------------------------------------- Heirlooms */
  SVC.heirlooms = () => {
    const out = [];
    for (const a of CAMP.camp.chars.filter((x) => x.status === "dead")) {
      for (const which of ["weapon", "armor"]) {
        const it = a[which]; if (!it || !(it.mods || []).includes("Heirloom")) continue;
        out.push({ from: a, which, item: it, owners: window.GEAR.heirloom(a, which === "weapon" ? "w" : "a") });
      }
    }
    return out;
  };
})();
