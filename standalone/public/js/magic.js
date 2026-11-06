/* ============================================================================
   MAGIC: all 26 Magic Words, spell strings, targeting, Duration limits, and the
   Word Pool buffer for Stability damage.

   A string is built from the caster's daily Word Pool. A word's strength is its
   place in the string. Potency caps the string length and the number of lasting
   (Duration) spells. Where a word is pure fiction (Appearance, Remembrance...) the
   spell is logged for the GM to rule on; where the rules give numbers they run.
   ========================================================================== */
(function () {
  const R = window.R, U = window.UI, el = U.el, GD = window.GD;
  const MAGIC = (window.MAGIC = {});
  const POOLS = ["health", "sanity", "stability"];
  const PL = R.POOL_LABEL;
  const s = (n) => (n === 1 ? "" : "s");
  const ASPECT_LIST = [...R.ASPECTS.body, ...R.ASPECTS.mind, ...R.ASPECTS.spirit];
  const DIFFS = ["easy", "medium", "challenging", "dangerous", "hopeless"];

  /* the statuses a spell's Element word can apply (names and numbers from the Statuses list) */
  MAGIC.ELEMENTS = {
    burning: { label: "Burning", mk: (p) => ({ id: "burning", label: "Burning", dmg: 3 + p, rounds: 99, text: "Elemental damage each round until put out" }) },
    bleeding: { label: "Bleed", mk: (p) => ({ id: "bleeding", label: "Bleeding", dmg: 2 + p, rounds: 3 }) },
    fear: { label: "Fear", mk: (p) => ({ id: "fear", label: "Fear", pool: "sanity", dmg: 1, rounds: 2 + p }) },
    terrified: { label: "Terrified", mk: (p) => ({ id: "terrified", label: "Terrified", rounds: 2 + p }) },
    soulsevered: { label: "Soul Severed", mk: (p) => ({ id: "soulsevered", label: "Soul Severed", pool: "stability", dmg: 3, rounds: 2 + p }) },
    frozen: { label: "Frozen", mk: (p) => ({ id: "frozen", label: "Frozen", rounds: 1 + p }) },
    poisoned: { label: "Poisoned", mk: (p) => ({ id: "poisoned", label: "Poisoned", rounds: 2 + p }) },
    suffocation: { label: "Suffocation", mk: (p) => ({ id: "suffocation", label: "Suffocation", rounds: 2 + p }) },
    crippled: { label: "Crippled", mk: () => ({ id: "crippled", label: "Crippled", rounds: 99 }) }
  };
  const elemChoices = Object.keys(MAGIC.ELEMENTS);
  const WEATHER = ["Rain", "Fog", "Snow", "Wind", "Storm", "Heat", "Cold"];

  /* ---------------------------------------------------------------- the words
     kind: target | effect | mod.  opts(p, a) lists the choices the caster makes for that word. */
  const sel = (key, label, choices, labels) => ({ key, label, type: "select", choices, labels });
  const multi = (key, label, choices, max) => ({ key, label, type: "multi", choices, max });
  const txt = (key, label, ph) => ({ key, label, type: "text", ph });
  const srcPool = (a) => R.MAGIC_POOL[(a && a.magic && a.magic.source) || "faith"];

  R.WORDS = {
    Ally: { kind: "target", help: "Target an Ally or yourself, +1 target per placement.", text: (p) => `${p} ally target${s(p)} (you count)` },
    Appearance: { kind: "effect", help: "Change the color, smell, or sound of something.", opts: () => [txt("what", "What changes?", "e.g. the coat turns black")], text: (p) => `change ${p} feature${s(p)} (color, smell or sound)` },
    Area: { kind: "target", help: "Affect an area (not creatures), 1 Zone +1 per placement.", text: (p) => `an area of ${p} Zone${s(p)} (not creatures)` },
    Awaken: { kind: "effect", help: "Give non-living things features. Uses a CR Easy Golem's Aspects.", opts: (p) => [multi("features", `Features (up to ${p})`, ["Speech", "Mobility", "Sight", "Hearing", "Taste"], p)], text: (p) => `awaken with ${p} feature${s(p)}` },
    Brightness: { kind: "effect", help: "Adjust the light by 1, +1 per placement: Glow/Shadow, Bright/Dark, Blinding/Pitch.", opts: () => [sel("dir", "Direction", ["up", "down"], { up: "Brighter", down: "Darker" })], text: (p, src, ch) => `light ${ch && ch.dir === "down" ? "darker" : "brighter"} by ${p} step${s(p)}` },
    Command: { kind: "effect", help: "Forcefully command someone. Placement sets how complex the order can be.", opts: () => [txt("order", "The command", "e.g. Run, Home, Now")], text: (p) => ["", "a command of 1 harmless word", "a command of 3 harmless words", "a command of 1 harmless sentence", "a command of 2 sentences, no restrictions", "a command of 3 sentences, no restrictions"][Math.min(p, 5)] || `a command of ${p - 2} sentences, no restrictions` },
    Damage: { kind: "effect", help: "3 damage per placement, of your Magic Source's type. Bypasses ER and can't be negated unless specified.", text: (p, src) => `${3 * p} ${PL[R.MAGIC_POOL[src] || "stability"]} damage, bypassing Evasion` },
    Duration: { kind: "mod", help: "Extend how long an effect lasts: Instant, 10 Rounds, 1 Hour, 8 Hours, 1 Day.", text: (p) => `lasts ${["an instant", "10 rounds", "1 hour", "8 hours", "1 day"][Math.min(p, 5) - 1]}` },
    Element: { kind: "effect", help: "Apply a status. +1 damage or duration per placement.", opts: () => [sel("status", "Status", elemChoices, Object.fromEntries(elemChoices.map((k) => [k, MAGIC.ELEMENTS[k].label])))], text: (p, src, ch) => `apply ${MAGIC.ELEMENTS[(ch && ch.status) || "burning"].label} (strength ${p})` },
    Enemy: { kind: "target", help: "Target an Enemy, +1 target per placement.", text: (p) => `${p} enemy target${s(p)}` },
    Enhance: { kind: "effect", help: "Add +1 to an Aspect, +1 per placement.", opts: () => [sel("aspect", "Aspect", ASPECT_LIST, R.ASPECT_LABEL)], text: (p, src, ch) => `+${p} ${R.ASPECT_LABEL[(ch && ch.aspect) || "strength"]}` },
    Form: { kind: "effect", help: "Change to Gas, Liquid, or Solid.", opts: () => [sel("form", "Form", ["Gas", "Liquid", "Solid"])], text: (p, src, ch) => `turn to ${(ch && ch.form) || "Gas"}` },
    Heal: { kind: "effect", help: "Instantly heal 1 type of Healing Pool, 2 per placement.", opts: () => [sel("pool", "Pool", POOLS, PL)], text: (p, src, ch) => `heal ${2 * p} ${PL[(ch && ch.pool) || "health"]}, instantly` },
    Mimic: { kind: "effect", help: "Create an illusion. CR Easy to see past it, +1 CR per placement.", opts: () => [txt("what", "The illusion", "e.g. a second you")], text: (p) => `an illusion: CR ${Math.min(R.cr("dangerous") + 1, R.cr("easy") + p - 1)} to see past${R.cr("easy") + p - 1 > R.cr("dangerous") ? " (impossible)" : ""}` },
    Modify: { kind: "effect", help: "Add a Monster Modifier to your character, +1 more past the 3rd placement.", opts: (p) => [multi("mods", `Modifier${p > 3 ? "s (up to " + (1 + p - 3) + ")" : ""}`, GD.monsterMods.map((m) => m.name), Math.max(1, p - 2))], text: (p) => `add ${Math.max(1, p - 2)} Monster Modifier${s(Math.max(1, p - 2))}` },
    Move: { kind: "effect", help: "Throw or drag something. Placement raises size, Zone range, or distance.", text: (p) => `move a target up to ${p} Zone${s(p)}` },
    Object: { kind: "target", help: "Target an Object or non-living thing, +1 per placement.", text: (p) => `${p} object${s(p)}` },
    Protect: { kind: "effect", help: "Negate 2 damage of one type; per placement +2 and +1 type.", opts: (p) => [multi("pools", `Damage types (up to ${p})`, POOLS, Math.min(3, p))], text: (p) => `negate ${2 * p} damage of ${Math.min(3, p)} type${s(Math.min(3, p))}` },
    Remembrance: { kind: "effect", help: "Access the memories of non-living things, +1 memory per placement.", opts: () => [txt("ask", "What do you ask?", "e.g. who came through this door last night")], text: (p) => `ask ${p} question${s(p)} of an object's memory` },
    Size: { kind: "effect", help: "Increase or decrease size by 1, +1 per placement.", opts: () => [sel("dir", "Direction", ["up", "down"], { up: "Bigger", down: "Smaller" })], text: (p, src, ch) => `${ch && ch.dir === "down" ? "shrink" : "grow"} by ${p} size step${s(p)}` },
    Speed: { kind: "effect", help: "Raise or lower Speed by 1, with +1 Zone of movement per placement.", opts: () => [sel("dir", "Direction", ["up", "down"], { up: "Faster", down: "Slower" })], text: (p, src, ch) => `${ch && ch.dir === "down" ? "slow" : "speed up"} by ${p}` },
    Summon: { kind: "effect", help: "Call something to you. 1-2 objects, 3-4 a living creature (CR Easy), +1 CR per level past 4.", opts: () => [txt("what", "What do you call?", "e.g. a hound, a rope, a lantern")], text: (p) => p <= 2 ? "summon an inanimate object" : `summon a living creature, CR ${DIFFS[Math.min(4, p - 3 > 0 ? Math.max(0, p - 4) : 0)]}` },
    Transmutation: { kind: "effect", help: "Swap Damage Types or split Damage into other types, +1 split per placement.", opts: (p) => [multi("pools", `Split across (up to ${p})`, POOLS, Math.min(3, p))], text: (p) => `split damage across up to ${Math.min(3, p)} types` },
    Treat: { kind: "effect", help: "Remove a status, +1 more per placement.", text: (p) => `remove ${p} status${p > 1 ? "es" : ""}` },
    Weather: { kind: "effect", help: "Choose a weather type, +1 severity per placement.", opts: () => [sel("kind", "Weather", WEATHER)], text: (p, src, ch) => `${(ch && ch.kind) || "Rain"}, severity ${p}` },
    Weight: { kind: "effect", help: "Change the weight of something within 100 lbs of its original, 2x increment per placement.", opts: () => [sel("dir", "Direction", ["up", "down"], { up: "Heavier", down: "Lighter" })], text: (p, src, ch) => `${ch && ch.dir === "down" ? "lighter" : "heavier"} by ${2 * p}x increments` }
  };
  MAGIC.WORD_ORDER = Object.keys(R.WORDS);
  const defaultCh = (w, p, a) => {
    const out = {};
    for (const f of (R.WORDS[w].opts ? R.WORDS[w].opts(p, a) : [])) out[f.key] = f.type === "select" ? f.choices[0] : f.type === "multi" ? f.choices.slice(0, f.key === "pools" ? f.max : 1) : "";
    return out;
  };

  /* the whole string -> what it does */
  R.evalSpell = (words, caster, slots) => {
    const src = (caster.magic && caster.magic.source) || "faith";
    const out = { words: [...words], slots: slots || words.map((w) => ({ w })), enemies: 0, allies: 0, areas: 0, objects: 0, self: false, effects: [], duration: 1, lines: [] };
    words.forEach((w, i) => {
      const p = i + 1, ch = (slots && slots[i] && slots[i].ch) || {};
      if (w === "Enemy") out.enemies = p;
      else if (w === "Ally") out.allies = p;
      else if (w === "Area") out.areas = p;
      else if (w === "Object") out.objects = p;
      else if (w === "Duration") out.duration = p;
      else out.effects.push({ word: w, p, i, ch });
      out.lines.push(`<b>${w}</b>: ${R.WORDS[w].text(p, src, ch)}`);
    });
    if (!out.enemies && !out.allies && !out.areas && !out.objects) { out.self = true; out.allies = 1; }
    out.valid = out.effects.length > 0;
    out.rounds = [1, 10, 600, 4800, 14400][Math.min(5, out.duration) - 1];
    return out;
  };

  /* ---------------------------------------------------------------- Word Pool and Potency */
  const origMax = R.wordPoolMax;
  R.wordPoolMax = (a) => Math.max(0, origMax(a) - (a.wordLoss || 0));

  /* ---------------------------------------------------------------- buffs from spells */
  const origAspect = R.aspect, origEr = R.er, origBr = R.br, origMr = R.mr, origSr = R.sr;
  const buff = (a, f) => (a.spellBuffs || []).filter(f).reduce((n, b) => n + b.n, 0);
  R.aspect = (a, key) => Math.max(0, origAspect(a, key) + buff(a, (b) => b.aspect === key));
  R.er = (a) => origEr(a) + buff(a, (b) => b.stat === "er");
  R.br = (a) => origBr(a) + buff(a, (b) => b.stat === "br");
  R.mr = (a) => origMr(a) + buff(a, (b) => b.stat === "mr");
  R.sr = (a) => origSr(a) + buff(a, (b) => b.stat === "sr");

  const NUMERIC_MODS = { "Nimble": ["er", 2], "Thick Skin": ["br", 2], "Steel Mind": ["mr", 2], "Unshakable Faith": ["sr", 2], "Quick": ["aspect:speed", 3] };

  /* undo callbacks live here, not on the agent, so saved characters stay plain data */
  const UNDO = new Map();
  let uid = 1;
  const addUndo = (id, fn) => { if (!UNDO.has(id)) UNDO.set(id, []); UNDO.get(id).push(fn); };

  /* ---------------------------------------------------------------- the builder */
  MAGIC.build = (a) => new Promise((resolve) => {
    const pot = R.potency(a);
    let slots = [];   // [{w, ch}]
    let flavor = "";
    const body = el("div", { class: "spell" });
    const left = (w) => (a.magic.words[w] || 0) - slots.filter((x) => x.w === w).length;
    const draw = () => {
      body.innerHTML = "";
      const words = slots.map((x) => x.w);
      const sp = slots.length ? R.evalSpell(words, a, slots) : null;
      const fields = [];
      slots.forEach((x, i) => {
        const def = R.WORDS[x.w];
        if (!def.opts) return;
        for (const f of def.opts(i + 1, a)) {
          let ctl;
          if (f.type === "select") ctl = el("select", { onchange: (e) => { x.ch[f.key] = e.target.value; draw(); } }, ...f.choices.map((c) => el("option", { value: c, selected: x.ch[f.key] === c ? "selected" : null }, (f.labels && f.labels[c]) || c)));
          else if (f.type === "multi") ctl = el("div", { class: "row tight wrap" }, ...f.choices.map((c) => {
            const on = (x.ch[f.key] || []).includes(c);
            return el("button", { class: "tier" + (on ? " sel" : ""), "aria-pressed": on ? "true" : "false", onclick: () => {
              const cur = x.ch[f.key] || [];
              x.ch[f.key] = on ? cur.filter((y) => y !== c) : [...cur, c].slice(-f.max);
              if (!x.ch[f.key].length) x.ch[f.key] = [c];
              draw();
            } }, (R.POOL_LABEL[c]) || c);
          }));
          else ctl = el("input", { type: "text", maxlength: "120", placeholder: f.ph || "", value: x.ch[f.key] || "", oninput: (e) => { x.ch[f.key] = e.target.value; } });
          fields.push(el("label", { class: "field" }, el("span", {}, `${x.w} (place ${i + 1}): ${f.label}`), ctl));
        }
      });
      body.append(
        el("p", { class: "small" }, `Potency ${pot}: up to ${pot} word${s(pot)} in a string. A word's strength is its place in the string.`),
        el("div", { class: "slots", style: { gridTemplateColumns: `repeat(${Math.min(5, Math.max(1, pot))}, 1fr)` } }, ...Array.from({ length: pot }, (_, i) => el("button", { class: "slot" + (slots[i] ? " full" : ""), onclick: () => { slots.splice(i, 1); draw(); } },
          el("small", {}, String(i + 1)), slots[i] ? slots[i].w : "·"))),
        el("div", { class: "wordbank" }, ...MAGIC.WORD_ORDER.filter((w) => (a.magic.words[w] || 0) > 0).map((w) => el("button", {
          class: "word", title: R.WORDS[w].help, disabled: left(w) <= 0 || slots.length >= pot, onclick: () => { U.click(); slots.push({ w, ch: defaultCh(w, slots.length + 1, a) }); draw(); } },
          el("b", {}, w), el("small", {}, `×${left(w)}`)))),
        el("div", { class: "preview" }, sp ? el("ul", {}, ...sp.lines.map((l) => el("li", { html: l })), sp.self ? el("li", {}, "No target word: the spell targets the caster") : null)
          : el("p", { class: "muted" }, Object.values(a.magic.words).some((n) => n > 0) ? "Tap words to build a string." : "No words left in your pool today.")),
        ...fields,
        sp ? el("label", { class: "field" }, el("span", {}, "How does it look? (flavor, optional)"), el("input", { type: "text", maxlength: "140", value: flavor, placeholder: "a blast of blazing wind, a psychic push...", oninput: (e) => { flavor = e.target.value; } })) : null);
      castBtn.disabled = !(sp && sp.valid);
    };
    const castBtn = el("button", { class: "btn primary", onclick: () => { const words = slots.map((x) => x.w); const sp = R.evalSpell(words, a, slots); sp.flavor = flavor.trim(); close(sp); } }, "Cast");
    const bar = el("div", { class: "modal-actions" }, el("button", { class: "btn", onclick: () => close(null) }, "Cancel"), castBtn);
    const m = el("div", { class: "modal roll-modal", role: "dialog", "aria-modal": "true", "aria-label": "Build a spell" },
      el("div", { class: "modal-head" }, el("h2", {}, "Magic words"), el("span", { class: "jp" }, "祝詞")), el("div", { class: "modal-body" }, body), bar);
    const ov = U.$("#overlay");
    ov.hidden = false; ov.innerHTML = ""; ov.append(m);
    function close(v) { ov.innerHTML = ""; ov.hidden = true; resolve(v); }
    draw();
  });

  /* ---------------------------------------------------------------- the engine
     env supplies the scene: units, damage, statuses, zones. Combat and a quiet
     moment between fights both use this same code. */
  const modInfo = (n) => (GD.monsterMods.find((m) => m.name === n) || {}).text || "";

  MAGIC.run = async (env, u, spell, T) => {
    const a = u.ref;
    const src = a.magic.source, pool = R.MAGIC_POOL[src];
    const id = "sp" + uid++;
    const rec = { id, rounds: spell.rounds, words: spell.words.join(", "), tag: spell.words.join(" ") };
    const lasting = spell.duration >= 2;
    const note = spell.flavor ? ` <i>${spell.flavor}</i>` : "";
    env.log(`${u.name} speaks: <i>${spell.words.join(", ")}</i>.${note}`, "spell");
    const hostile = T.enemies.length ? T.enemies : T.allies;
    const friendly = T.allies.length ? T.allies : T.enemies;
    const gm = (w, txt) => env.log(`<b>${w}:</b> ${txt} <span class="muted">The GM rules the details.</span>`, "spell");
    let persists = false;
    const transmute = spell.effects.find((e) => e.word === "Transmutation");

    for (const eff of spell.effects) {
      const p = eff.p, ch = eff.ch || {};
      switch (eff.word) {
        case "Damage": {
          let pools = [pool], total = 3 * p;
          if (transmute) pools = (transmute.ch.pools && transmute.ch.pools.length ? transmute.ch.pools : [pool]).slice(0, Math.min(3, transmute.p));
          const part = pools.map((_, i) => Math.floor(total / pools.length) + (i < total % pools.length ? 1 : 0));
          for (const t of hostile) {
            await env.familiar(t);
            for (let i = 0; i < pools.length; i++) { if (!env.alive(t)) break; env.log(`${t.name} takes <b>${part[i]}</b> ${PL[pools[i]]}.`, "hurt"); await env.hurt(t, pools[i], part[i]); }
          }
          break;
        }
        case "Heal": {
          const pl = ch.pool || "health";
          for (const t of friendly) { const n = env.heal(t, pl, 2 * p); env.log(`${t.name} recovers ${n} ${PL[pl]}.`, "good"); }
          break;
        }
        case "Treat": {
          for (const t of friendly) {
            const list = env.statuses(t).filter((x) => x.id !== "protect" && !x.spellBuff);
            let n = p, gone = [];
            for (const st of list) { if (n <= 0) break; env.removeStatus(t, st.id); gone.push(st.label || st.id); n--; }
            if (t.kind === "agent" && n > 0 && t.ref.crippled) { t.ref.crippled = false; gone.push("Crippled"); n--; }
            env.log(gone.length ? `${t.name} is freed of ${gone.join(", ")}.` : `${t.name} has no status to remove.`);
          }
          break;
        }
        case "Protect": {
          const types = (ch.pools && ch.pools.length ? ch.pools : POOLS).slice(0, Math.min(3, p));
          for (const t of friendly) { env.addStatus(t, { id: "protect", label: `Ward ${2 * p}`, amt: 2 * p, pools: types, rounds: lasting ? spell.rounds : 1, caster: u.uid, spell: id }); env.log(`${t.name} is warded: ${2 * p} less ${types.map((k) => PL[k]).join(", ")} damage.`, "good"); }
          persists = true;
          break;
        }
        case "Element": {
          const def = MAGIC.ELEMENTS[ch.status || "burning"];
          for (const t of hostile) { const st = def.mk(p); st.spell = id; env.addStatus(t, st); env.log(`${t.name} is ${def.label}.`, "bad"); AudioMan.sfx("burn"); }
          persists = true;
          break;
        }
        case "Enhance": {
          const k = ch.aspect || "strength";
          for (const t of friendly) {
            if (t.kind === "agent") { (t.ref.spellBuffs = t.ref.spellBuffs || []).push({ aspect: k, n: p, rounds: spell.rounds, spell: id }); G().refreshParty(); }
            else env.allyBoost(t, k, p, id);
            env.log(`${t.name} gains +${p} ${R.ASPECT_LABEL[k]}.`, "good");
          }
          persists = true;
          break;
        }
        case "Modify": {
          const mods = (ch.mods && ch.mods.length ? ch.mods : []).slice(0, Math.max(1, p - 2));
          for (const t of friendly) for (const m of mods) {
            const num = NUMERIC_MODS[m];
            if (num && t.kind === "agent") {
              const [what, n] = num;
              (t.ref.spellBuffs = t.ref.spellBuffs || []).push(what.startsWith("aspect:") ? { aspect: what.split(":")[1], n, rounds: spell.rounds, spell: id } : { stat: what, n, rounds: spell.rounds, spell: id });
            }
            env.log(`${t.name} takes on <b>${m}</b>. ${num ? "" : modInfo(m)}`, "spell");
          }
          if (!mods.length) gm("Modify", "no Modifier chosen");
          persists = true;
          break;
        }
        case "Speed": {
          const up = ch.dir !== "down";
          const group = up ? friendly : (T.enemies.length ? T.enemies : friendly);
          for (const t of group) env.speed(t, up ? p : -p, spell.rounds, id);
          persists = true;
          break;
        }
        case "Brightness": {
          const zones = T.zones && T.zones.length ? T.zones : [env.zoneOf(u)];
          for (const z of zones) { env.light(z, ch.dir === "down" ? -p : p, id); }
          env.log(`The light ${ch.dir === "down" ? "drains from" : "swells in"} ${zones.map((z) => env.zoneName(z)).join(", ")} (${ch.dir === "down" ? "−" : "+"}${p}).`, "spell");
          persists = true;
          break;
        }
        case "Move": {
          const group = T.enemies.length ? T.enemies : friendly;
          for (const t of group) await env.move(t, p);
          break;
        }
        case "Command": {
          for (const t of T.enemies.length ? T.enemies : []) {
            const rounds = p >= 4 ? 2 : 1;
            env.addStatus(t, { id: "commanded", label: "Commanded", rounds, order: ch.order || "", spell: id });
            env.log(`${t.name} is commanded${ch.order ? ': <i>"' + ch.order + '"</i>' : ""} and loses ${rounds} turn${s(rounds)}.${p >= 4 ? " <span class=\"muted\">With no restrictions on the order, the GM decides what else it does.</span>" : ""}`, "spell");
          }
          if (!T.enemies.length) gm("Command", ch.order || "an order is given");
          break;
        }
        case "Mimic": {
          const cr = R.cr("easy") + p - 1;
          env.mimic({ cr, rounds: spell.rounds, owner: u.uid, spell: id, what: ch.what || "an illusion" });
          env.log(`An illusion of ${ch.what || "something"} shimmers into being (CR ${Math.min(cr, R.cr("dangerous") + 1)} to see through${cr > R.cr("dangerous") ? ", impossible" : ""}).`, "spell");
          persists = true;
          break;
        }
        case "Summon": {
          if (p <= 2) { gm("Summon", `${ch.what || "an object"} arrives`); break; }
          const diff = DIFFS[Math.min(4, Math.max(0, p - 4))];
          await env.spawn({ name: ch.what || "Summoned creature", diff, who: u, spell: id });
          persists = true;
          break;
        }
        case "Awaken": {
          const f = ch.features || [];
          if (T.objects && f.includes("Mobility")) { await env.spawn({ name: "Awakened object", diff: "easy", type: "Golem", who: u, spell: id }); persists = true; }
          else gm("Awaken", `${f.join(", ") || "features"} granted${T.objects ? "; use a CR Easy Golem's Aspects" : ""}`);
          break;
        }
        case "Appearance": gm("Appearance", ch.what || "something changes"); break;
        case "Form": gm("Form", `becomes ${ch.form || "Gas"}`); break;
        case "Remembrance": gm("Remembrance", `${p} question${s(p)}: ${ch.ask || "(asked aloud)"}`); break;
        case "Size": gm("Size", `${ch.dir === "down" ? "smaller" : "bigger"} by ${p}`); break;
        case "Weight": gm("Weight", `${ch.dir === "down" ? "lighter" : "heavier"} by ${2 * p}x increments`); break;
        case "Weather": env.weather(ch.kind || "Rain", p); gm("Weather", `${ch.kind || "Rain"}, severity ${p}`); break;
        default: break;
      }
    }
    if (T.areas && !spell.effects.some((e) => ["Brightness", "Weather"].includes(e.word))) env.log("An area is affected. Creatures in it are not.");
    /* lasting spells count against Potency */
    if (lasting && persists) {
      a.activeSpells = a.activeSpells || [];
      a.activeSpells.push(rec);
      while (a.activeSpells.length > R.potency(a)) {
        const old = a.activeSpells.shift();
        env.log(`${u.name} can only hold ${R.potency(a)} lasting spell${s(R.potency(a))}. <i>${old.words}</i> ends.`, "bad");
        MAGIC.dispel(env, a, old);
      }
    } else if (persists) {
      /* instant spells end with the round */
      a.activeSpells = a.activeSpells || [];
      rec.rounds = 1; rec.instant = true; a.activeSpells.push(rec);
    }
    return rec;
  };
  const G = () => window.GAME;

  MAGIC.dispel = (env, a, rec) => {
    a.spellBuffs = (a.spellBuffs || []).filter((b) => b.spell !== rec.id);
    for (const fn of UNDO.get(rec.id) || []) { try { fn(); } catch (e) { /* ignore */ } }
    UNDO.delete(rec.id);
    if (env && env.dispelAll) env.dispelAll(rec.id);
    a.activeSpells = (a.activeSpells || []).filter((x) => x.id !== rec.id);
  };
  MAGIC.undo = addUndo;

  /* a round passes in combat */
  MAGIC.tick = (env, agents) => {
    for (const a of agents) {
      for (const b of a.spellBuffs || []) if (b.rounds < 99999) b.rounds -= 1;
      a.spellBuffs = (a.spellBuffs || []).filter((b) => b.rounds > 0 || b.rounds >= 99999);
      for (const rec of [...(a.activeSpells || [])]) {
        rec.rounds -= 1;
        if (rec.rounds <= 0) { if (!rec.instant) env.log(`${a.short || a.name}'s <i>${rec.words}</i> fades.`); MAGIC.dispel(env, a, rec); }
      }
    }
  };
  /* combat is over: short spells end, hour-long ones wait for a rest */
  MAGIC.endCombat = (env, agents) => {
    for (const a of agents) {
      for (const rec of [...(a.activeSpells || [])]) if (rec.rounds <= 10) MAGIC.dispel(env, a, rec);
      a.spellBuffs = (a.spellBuffs || []).filter((b) => b.rounds > 10);
    }
  };
  MAGIC.rest = (a) => { for (const rec of [...(a.activeSpells || [])]) MAGIC.dispel(null, a, rec); a.activeSpells = []; a.spellBuffs = []; a.wordsSpentToday = 0; };

  /* Word Pool buffer: give up words to soak Stability damage that would drop you to 0 */
  MAGIC.stabilityBuffer = async (a, amount, name) => {
    if (!a.magic) return 0;
    const bank = Object.entries(a.magic.words || {}).filter(([, n]) => n > 0);
    const total = bank.reduce((x, [, n]) => x + n, 0);
    if (!total) return 0;
    const max = Math.min(total, amount);
    const opts = [{ id: "0", label: "Take it", hint: "no words lost" }];
    for (let n = 1; n <= max; n++) opts.push({ id: String(n), label: `Give up ${n} word${s(n)}`, hint: `soaks ${n}; Word Pool maximum drops by ${n} for good` });
    const pick = await U.choose(`${name}'s Stability is about to break (${amount} damage). Cut loose part of the Word Pool to stay in this world?`, opts);
    const n = +pick || 0;
    if (!n) return 0;
    let left = n;
    for (const [w] of bank.sort((x, y) => y[1] - x[1])) { while (left > 0 && a.magic.words[w] > 0) { a.magic.words[w] -= 1; left--; } }
    a.wordLoss = (a.wordLoss || 0) + n;
    a.magic.max = R.wordPoolMax(a);
    return n;
  };

  /* ---------------------------------------------------------------- casting between fights */
  MAGIC.freeCast = async (a) => {
    if (!a.magic) { U.toast ? U.toast("No magic.") : null; return; }
    if (R.potency(a) < 1) { U.modal({ title: "No Potency", body: "<p>Without Potency, no string of words can be spoken.</p>", buttons: [{ id: "ok", label: "OK" }] }); return; }
    const spell = await MAGIC.build(a);
    if (!spell) return;
    const party = G().active();
    const T = { enemies: [], allies: [], zones: [], areas: spell.areas, objects: spell.objects };
    const ag = (x) => ({ kind: "agent", uid: x.id, ref: x, name: x.short });
    const me = ag(a);
    if (spell.self) T.allies = [me];
    else if (spell.allies) {
      const cand = party.map(ag);
      while (T.allies.length < Math.min(spell.allies, cand.length)) {
        const left = cand.filter((x) => !T.allies.includes(x));
        const id = await U.choose(`Ally target ${T.allies.length + 1} of ${spell.allies}`, left.map((x) => ({ id: x.uid, label: x.name })));
        const t = left.find((x) => x.uid === id); if (!t) break; T.allies.push(t);
      }
    }
    for (const w of spell.words) a.magic.words[w] -= 1;
    AudioMan.sfx("spell_cast");
    const lines = [];
    const env = {
      log: (h) => lines.push(h), alive: () => true, familiar: async () => {},
      hurt: async () => {}, heal: (t, pl, n) => { const p = t.ref.pools[pl], b = p.cur; p.cur = Math.min(p.max, p.cur + n); return p.cur - b; },
      statuses: (t) => t.ref.statuses || (t.ref.statuses = []), removeStatus: (t, sid) => { t.ref.statuses = (t.ref.statuses || []).filter((x) => x.id !== sid); },
      addStatus: (t, st) => { (t.ref.statuses = t.ref.statuses || []).push(st); }, allyBoost: () => {}, speed: () => {}, light: () => {}, zoneOf: () => null, zoneName: () => "the area",
      move: async () => {}, mimic: () => {}, spawn: async () => {}, weather: () => {}
    };
    await MAGIC.run(env, { kind: "agent", uid: a.id, ref: a, name: a.short }, spell, T);
    G().refreshParty();
    await U.modal({ title: "The words take hold", body: `<ul>${lines.map((l) => `<li>${l}</li>`).join("")}</ul>`, buttons: [{ id: "ok", label: "OK", cls: "primary" }] });
  };

  /* ---------------------------------------------------------------- lasting effects of Disorders and Mutations
     Read from the injuries an agent carries, so they follow the agent between missions and vanish when treated. */
  const fxList = (a) => (a.injuries || []).flatMap((i) => [i.dfx, i.mfx].filter(Boolean));
  const fxSum = (a, k) => fxList(a).reduce((n, f) => n + (f[k] || 0), 0);
  R.fx = (a, flag) => fxList(a).some((f) => f[flag]);
  const baseAspect2 = R.aspect;
  R.aspect = (a, key) => {
    if (fxList(a).some((f) => (f.zero || []).includes(key))) return 0;
    return Math.max(0, baseAspect2(a, key) + fxList(a).reduce((n, f) => n + ((f.mod && f.mod[key]) || 0), 0));
  };
  const baseBr = R.br, baseEr = R.er, baseMr = R.mr, baseSr = R.sr;
  /* Recreational Drug: +2 Resistance (+1 per Wealth Class above Mundane) on a day it is used, then −2 for a few clean days */
  const drugMod = (a) => {
    const d = a.drug; if (!d) return 0;
    const day = window.CAMP && window.CAMP.camp ? window.CAMP.camp.day : null;
    if (day === null) return 0;
    if (d.last === day) return d.boost || 2;
    return d.user && (d.clean || 0) < 3 ? -2 : 0;
  };
  R.br = (a) => Math.max(0, baseBr(a) + fxSum(a, "br") + drugMod(a));
  R.mr = (a) => Math.max(0, baseMr(a) + fxSum(a, "mr") + drugMod(a));
  R.sr = (a) => Math.max(0, baseSr(a) + fxSum(a, "sr") + drugMod(a));
  const baseActions = R.actionsPerTurn;
  R.actionsPerTurn = (a, round) => (R.fx(a, "ocd") && round ? (round % 2 === 1 ? 1 : 3) : baseActions(a));
  /* Magic Wellspring zones lend +1 Potency while in the fight */
  const _pot = R.potency;
  R.potency = (a) => { const b = _pot(a); return b > 0 || a._zp ? b + (a._zp || 0) : b; };
})();
