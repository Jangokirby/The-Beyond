/* ============================================================================
   CASE KIT: small helpers for writing cases to the Death of a Bloodline floor.
   A case written with these still compiles to plain data (see adv.js).

     K.face(...)          a face for a person
     K.person(name, tag, look, face)
     K.find(label, aspect, cr, ok, fail, opts)   a search option: one roll, a clue on success
     K.ask(npc, topics, opts)                    an interview option (Charisma-limited by default)
     K.t(ask, lines, opts)                       one topic of an interview
     K.go(label, scene, opts)                    a plain way to move
   ========================================================================== */
(function () {
  const A = window.ART;
  const K = (window.CASEKIT = {});
  K.face = (s, hc, h, o, x = "none", more = {}) => ({ skin: A.SKIN[s], hairC: A.HAIRC[hc], hair: h, outfit: A.OUTFIT[o], extra: x, bg: "#2b2f3a", ...more });
  K.person = (name, tag, look, face) => ({ name, tag, look, face });
  const arr = (x) => (x == null ? [] : Array.isArray(x) ? x : [x]);
  const say = (t) => (typeof t === "string" ? { say: t } : t);

  /* a search: one roll; success tells you something and gives a clue; failure still moves you on but costs. */
  K.find = (label, aspect, cr, ok, fail, o = {}) => ({
    label, hint: o.hint, if: o.if, once: o.retry ? undefined : true,
    steps: [...arr(o.pre).map(say), { check: { aspect, cr, label: o.roll || label, investigate: o.investigate !== false, tags: o.tags || [], who: o.who || "choose",
      ok: [...arr(ok).map(say), ...arr(o.clue).map((c) => ({ clue: c })), ...arr(o.obj).map((c) => ({ objective: c })), ...arr(o.set).map((f) => ({ set: f })), ...arr(o.okSteps)],
      fail: [...arr(fail).map(say), ...(o.failDamage ? [{ damage: { pool: o.failDamage[0], amount: o.failDamage[1] } }] : []), ...arr(o.failClue).map((c) => ({ clue: c })), ...arr(o.failSteps)] } }]
  });
  /* an interview topic: `lines` are spoken in order; `then` is a list of steps. cha: lock behind the party's best Charisma. */
  K.t = (ask, lines, o = {}) => ({ ask, lines: arr(lines), then: [...arr(o.clue).map((c) => ({ clue: c })), ...arr(o.obj).map((c) => ({ objective: c })), ...arr(o.set).map((f) => ({ set: f })), ...arr(o.then)], cha: o.cha, free: o.free, if: o.if, once: o.once });
  /* an interview. By default the Charisma roll decides how many questions they will answer. */
  K.ask = (npc, topics, o = {}) => ({
    label: o.label || `Talk to ${o.name || "them"}`, hint: o.hint, if: o.if,
    steps: [{ converse: { npc, id: o.id || "main", limit: o.limit !== false, approach: !!o.approach, open: o.open, again: o.again, bye: o.bye, cutoff: o.cutoff, prompt: o.prompt, topics } }]
  });
  K.go = (label, scene, o = {}) => ({ label, hint: o.hint, if: o.if, steps: [...arr(o.pre).map(say), { goto: scene }] });
  /* tally text for the ending: the first branch whose condition is true */
  K.tiers = (list) => list.map(([c, text]) => ({ if: c, then: [say(text)] }));
})();
