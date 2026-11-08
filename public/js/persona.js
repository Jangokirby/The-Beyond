/* ============================================================================
   PERSONA — agents as people between cases.

   Every agent has two traits (rolled when they join; change them in the
   agent's file). Traits colour three things, none of them rules:
     - banter at the common table: who needles whom, who looks after whom
     - a journal entry each agent writes after every case, in their own voice
       (kept in their file; edit it if they'd have put it differently)
     - a line in the agent's file describing them
   ========================================================================== */
(function () {
  const T = {
    dry: { label: "Dry wit", says: ["'{p}, if you sigh any louder, the ghosts will file a complaint.'", "'Cheer up, {p}. At least the dead don't ask for overtime.'"], journal: "Well, that happened.", mood: "wry" },
    devout: { label: "Devout", says: ["{a} says grace over the cold food, and waits until {p} at least bows their head.", "'You don't have to believe it, {p}. It only has to be true.'"], journal: "I prayed before we went in and I prayed after, and I am not ashamed of either.", mood: "faithful" },
    sceptic: { label: "Sceptic", says: ["'There's an explanation, {p}. There's always an explanation. I just haven't found this one yet.'", "{a} spends the evening explaining to {p} how every trick they saw today could have been done with wire."], journal: "I'm writing down what I saw, not what I believe. They're not the same thing yet.", mood: "doubtful" },
    reckless: { label: "Reckless", says: ["'You hesitated, {p}. I saw it. Next time, I go first.'", "{a} demonstrates, with a fork, exactly how close the thing came. {p} doesn't laugh."], journal: "Close one. I'd do it again.", mood: "bold" },
    bookish: { label: "Bookish", says: ["{a} reads aloud to {p} from something four hundred years old, and is delighted by every word.", "'There's a precedent, {p}. 1611. Different county, same teeth.'"], journal: "Three useful sources, two useless ones, and one that should be burned. Noted for the archive.", mood: "studious" },
    soft: { label: "Soft-hearted", says: ["{a} makes sure {p} eats something, and then makes sure again.", "'You're allowed to be upset about it, {p}. I am.'"], journal: "I keep thinking about the people we couldn't help.", mood: "tender" },
    grim: { label: "Grim", says: ["{a} cleans their weapon in silence while {p} talks. When {p} stops, {a} says, 'Good. Get some sleep.'", "'It'll be worse next time, {p}. It's always worse next time.'"], journal: "Job done. Nobody's coming to thank us. That's fine.", mood: "hard" },
    superstitious: { label: "Superstitious", says: ["{a} won't let {p} put new shoes on the table. They argue about it for an hour.", "{a} salts the doorstep again, and gives {p} a look that dares them to say something."], journal: "I turned my coat inside out before we went in. Laugh all you like. I came back.", mood: "wary" },
    owl: { label: "Night owl", says: ["{a} is still up when {p} comes down at four. Neither of them asks why.", "'Can't sleep, {p}? Me neither. Cards?'"], journal: "Writing this at 3 a.m. The house makes noises at night. I've stopped noticing. That worries me.", mood: "sleepless" },
    gambler: { label: "Gambler", says: ["{a} has {p} three hands down at {game} before {p} notices the deck is marked.", "'Bet you a week's dishes the next one's a ghost, {p}.'"], journal: "Odds were bad. We beat them. Don't push your luck, they say. I always do.", mood: "lucky" },
    talker: { label: "Chatterbox", says: ["{a} tells {p} the whole case again, start to finish, with improvements.", "{a} talks for an hour without stopping. {p} is, oddly, grateful for the noise."], journal: "So much to tell and no one outside the agency to tell it to, so here it is, all of it.", mood: "eager" },
    loner: { label: "Loner", says: ["{a} takes their plate to the stairs. {p} follows, and they eat in silence, which suits them both.", "'I'm fine, {p}.' {a} is not fine. {p} lets it go."], journal: "Not much to say.", mood: "private" },
    protective: { label: "Protective", says: ["{a} checks {p}'s bandages without asking, and redoes them properly.", "'Stay behind me next time, {p}. I mean it.'"], journal: "Everyone came home. That's the only thing I measure.", mood: "watchful" },
    vain: { label: "Vain", says: ["{a} mourns a ruined coat at length. {p} points out that {a} nearly died. {a} says 'And the coat did.'", "{a} asks {p} whether the scar will show. {p} says it suits them. {a} is mollified."], journal: "For the record, I looked magnificent.", mood: "proud" },
    haunted: { label: "Haunted", says: ["{a} stops mid-sentence and looks at the corner. {p} doesn't ask. {p} has a corner of their own.", "'Did you hear that, {p}?' {p} didn't. {a} doesn't believe them."], journal: "It followed me home. It always does. I've set a place for it.", mood: "haunted" },
    practical: { label: "Practical", says: ["{a} draws up a list of everything that went wrong today and slides it across to {p}.", "'Less talking, {p}, more sleeping. We're out at seven.'"], journal: "What worked: the plan. What didn't: everything after it. Fix for next time below.", mood: "steady" }
  };
  const IDS = Object.keys(T);
  const hash = (s) => { let h = 2166136261; for (const ch of String(s)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const P = (window.PERSONA = { TRAITS: T, IDS });
  P.ensure = (a) => { if (!a) return []; if (!Array.isArray(a.traits) || !a.traits.length) { const h = hash(a.id || a.name); const t1 = IDS[h % IDS.length]; let t2 = IDS[(h >> 5) % IDS.length]; if (t2 === t1) t2 = IDS[(h + 3) % IDS.length]; a.traits = [t1, t2]; } return a.traits; };
  P.label = (a) => P.ensure(a).map((t) => (T[t] || {}).label).filter(Boolean).join(" · ");

  /* banter: a line or two at the common table, from each side */
  P.banter = (a, p, words = {}) => {
    const ta = pick(P.ensure(a)), tp = pick(P.ensure(p));
    const fill = (s, x, y) => s.replace(/\{a\}/g, x.short).replace(/\{p\}/g, y.short).replace(/\{game\}/g, words.game || "cards");
    const lines = [fill(pick(T[ta].says), a, p)];
    if (Math.random() < 0.6) lines.push(fill(pick(T[tp].says), p, a));
    return lines;
  };

  /* journals: written after each case */
  P.write = (a, r, M) => {
    const tr = P.ensure(a), voice = T[tr[0]], second = T[tr[1]];
    const hurt = a.pools && a.pools.health.cur < a.pools.health.max * 0.5, shaken = a.pools && a.pools.sanity.cur < a.pools.sanity.max * 0.5;
    const outcome = r.solved ? pick([`We finished it at ${String(M.setting || "the scene").split("·")[0].trim()}.`, `${M.title} is closed.`, "It's over. We stopped it."]) : pick([`We didn't finish it at ${String(M.setting || "the scene").split("·")[0].trim()}.`, `${M.title} beat us, this time.`, "We got out. That's all I'll claim."]);
    const body = [outcome, voice.journal];
    if (hurt) body.push(pick(["Stitches again. The doctor has stopped asking questions.", "Every step up the stairs reminds me where I was hit."]));
    if (shaken) body.push(pick(["I'm not sleeping. When I close my eyes it's still there.", "My hands won't stop. I'm writing this slowly so it's legible."]));
    if (Math.random() < 0.5) body.push(second.journal);
    return body.join(" ");
  };
  const debrief0 = window.CAMP && CAMP.debrief;
  if (debrief0) CAMP.debrief = function (r) {
    try {
      const M = window.MODULE, G = window.GAME;
      if (M && G && G.state && !CAMP.playtest) for (const ag of G.state.agents || []) {
        const ch = ag._campId && CAMP.char(ag._campId); if (!ch) continue;
        (ch.journal = ch.journal || []).unshift({ day: (CAMP.camp && CAMP.camp.day) || 0, title: M.title, text: ag.dead ? "" : P.write(ag, r, M), dead: !!ag.dead });
        ch.journal = ch.journal.slice(0, 40);
      }
    } catch (e) { console.warn("journal", e); }
    return debrief0.apply(this, arguments);
  };

  /* the agent's file: traits and journal */
  P.panel = (a, redraw) => {
    const el = window.UI.el; P.ensure(a);
    const sel = (i) => el("select", { "aria-label": `Trait ${i + 1}`, onchange: (e) => { a.traits[i] = e.target.value; CAMP.save(); redraw && redraw(); } }, ...IDS.map((k) => el("option", { value: k, selected: a.traits[i] === k ? "selected" : null }, T[k].label)));
    const box = el("div", { class: "persona" },
      el("div", { class: "row tight" }, el("span", { class: "small muted" }, "Traits:"), sel(0), sel(1)),
      el("details", { class: "journal", open: (a.journal || []).length ? "open" : null }, el("summary", {}, `Journal (${(a.journal || []).length})`),
        ...(a.journal || []).filter((j) => j.text).map((j, i) => el("div", { class: "jentry" }, el("small", {}, `Day ${j.day} · ${j.title}`),
          el("p", { contenteditable: "true", spellcheck: "true", onblur: (e) => { j.text = e.target.textContent; CAMP.save(); } }, j.text))),
        (a.journal || []).length ? null : el("p", { class: "small muted" }, "Nothing yet. After each case, they'll write something here.")));
    return box;
  };
  /* banter is added to evenings at the table */
  document.addEventListener("DOMContentLoaded", () => {
    const H = window.HIDE; if (!H || !H.splash) return;
    const splash0 = H.splash;
    H.splash = function (o) {
      try {
        if (o && /evening/.test(o.kicker || "") && (o.who || []).length === 2 && Math.random() < 0.85) {
          const act = CAMP.active(), a = act.find((x) => x.short === o.who[0].short), p = act.find((x) => x.short === o.who[1].short);
          if (a && p) o = { ...o, lines: [...(o.lines || []), ...P.banter(a, p)] };
        }
      } catch (e) { /* never block an evening */ }
      return splash0.call(this, o);
    };
  });
})();
