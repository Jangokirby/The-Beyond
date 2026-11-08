/* ============================================================================
   APPROACH — how you come at someone, the first time you talk to them in a case.

   Kind, Hard, Lie, Pay or Just listen. Every person has a temper (a case can
   set npc.temper; otherwise it is read from their description): frightened,
   grieving, proud, hostile, greedy, official or kindly. The right approach
   for the person opens them up; the wrong one closes them down.
     good      they open up (and the Focus spent on the talk comes back)
     neutral   the conversation goes on as written
     bad       they clam up: winning them back is a Charisma roll (the book's
               social roll); failing, they still talk, but it costs a Focus
     lie       always a Charisma roll: success counts as good, failure as bad
   Turn it off in Settings ("Conversation approaches").
   ========================================================================== */
(function () {
  const AP = (window.APPROACH = {});
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  AP.KINDS = [
    { id: "kind", label: "Gently", hint: "Sympathy, patience, a kind word" },
    { id: "hard", label: "Lean on them", hint: "Pressure, authority, a raised voice" },
    { id: "lie", label: "Lie", hint: "A cover story. Charisma roll" },
    { id: "pay", label: "Make it worth their while", hint: "Money, a favour, a drink" },
    { id: "listen", label: "Just listen", hint: "Say little. Let them fill the silence" }
  ];
  const TEMPERS = [
    ["frightened", /afraid|scared|frighten|shak|nervous|pale|trembl|jump|terrified|haunted/i],
    ["grieving", /widow|mourn|grief|griev|lost (his|her)|dead (husband|wife|son|daughter)|bereav|in black/i],
    ["hostile", /sneer|suspicious|hostile|bitter|angry|scowl|spits|glare|resent/i],
    ["greedy", /merchant|landlord|owner|dealer|shop|broker|smile like|price|money|profit|innkeeper|publican/i],
    ["official", /sergeant|sgt|constable|police|officer|clerk|station ?master|conductor|sheriff|deputy|inspector|manager|guard|official|coast guard|analyst/i],
    ["proud", /lady|lord|master|director|professor|abbot|colonel|captain|doctor|dr\.|gentleman|aristocrat|sir\b|mrs\. [a-z]+ vane/i],
    ["kindly", /midwife|priest|padre|nurse|old woman|grandmother|pastor|father|mother|teacher|maid|child|girl|boy/i]
  ];
  AP.temper = (n) => (n && n.temper) || (TEMPERS.find(([, re]) => re.test(`${(n && n.tag) || ""} ${(n && n.look) || ""}`)) || ["kindly"])[0];
  const FIT = {
    frightened: { kind: "good", hard: "bad", lie: "lie", pay: "neutral", listen: "good" },
    grieving: { kind: "good", hard: "bad", lie: "bad", pay: "bad", listen: "good" },
    proud: { kind: "good", hard: "bad", lie: "lie", pay: "bad", listen: "neutral" },
    hostile: { kind: "neutral", hard: "good", lie: "lie", pay: "good", listen: "bad" },
    greedy: { kind: "neutral", hard: "neutral", lie: "lie", pay: "good", listen: "bad" },
    official: { kind: "neutral", hard: "bad", lie: "lie", pay: "neutral", listen: "neutral" },
    kindly: { kind: "good", hard: "bad", lie: "bad", pay: "neutral", listen: "good" }
  };
  /* what the agent says: {n} the person's first name or title */
  const SAY = {
    kind: ["Take your time. Nobody here is going to hurry you.", "I'm sorry. I know this isn't easy. We only want to help.", "Sit down a minute. You look like you haven't slept."],
    hard: ["I haven't got all night, and neither have you. Talk.", "People are dying. Whatever you're keeping back, it isn't worth it.", "We can do this here, or we can do it somewhere you'll like a lot less."],
    lie: ["We're from the insurance company. Just a few routine questions.", "The authorities sent us. Purely a formality.", "We're old friends of the family. They asked us to look in."],
    pay: ["There's something in it for you, if you help us.", "Let me buy you a drink, and you tell me what you know.", "Call it a donation. For your trouble."],
    listen: [null, null, null]
  };
  const REACT = {
    good: {
      frightened: ["{n}'s shoulders come down an inch. 'All right. All right. I'll tell you what I saw.'", "{n} lets out a breath that sounds like it's been held for days."],
      grieving: ["{n}'s eyes fill. 'Nobody's asked me how I am. Not once.' And then it all comes out.", "{n} nods, and nods, and starts to talk as if a door has opened."],
      proud: ["{n} straightens, pleased to be treated properly. 'Well. Since you ask so civilly.'", "{n} warms by a degree, which for {n} is a great deal."],
      hostile: ["{n} weighs you up and decides you're worth the trouble. 'Fine. Ask.'", "{n} laughs once, without humour. 'You've got nerve. I like that. Go on.'"],
      greedy: ["{n} pockets it so fast you barely see it go. 'Now, what was it you wanted to know?'", "{n} smiles for the first time. 'Well, why didn't you say so?'"],
      official: ["{n} checks your face and seems satisfied. 'Right. This is how it is.'", "{n} relaxes. 'That's all right then. Ask away.'"],
      kindly: ["{n} pats your hand. 'You poor things. Of course I'll help.'", "{n} pours you something warm before you can refuse."]
    },
    neutral: {
      frightened: ["{n} watches the door while you talk.", "{n} answers, but quietly, and not looking at you."],
      grieving: ["{n} listens without much interest in anything.", "{n} answers like someone reading from a list."],
      proud: ["{n} gives you a look that says you'll be tolerated, for now.", "{n} answers the way a busy person answers a tradesman."],
      hostile: ["{n} folds their arms. 'Ask, then.'", "{n} doesn't make it easy, but doesn't throw you out either."],
      greedy: ["{n} glances at your pockets, then at you. 'What is it?'", "{n} answers, but there's a meter running somewhere behind those eyes."],
      official: ["{n} answers by the book, every word chosen.", "{n} gives you exactly what you ask for and not a crumb more."],
      kindly: ["{n} answers as best they can.", "{n} does their best to help."]
    },
    bad: {
      frightened: ["{n} flinches as if struck and backs against the wall.", "{n}'s mouth shuts. You can see the fear go behind a locked door."],
      grieving: ["{n} looks at you with flat, terrible eyes. 'Get out of my house.'", "{n} turns away and doesn't turn back."],
      proud: ["{n} goes very cold. 'I don't think I care for your manner.'", "{n} looks at you as if you've tracked mud across the carpet."],
      hostile: ["{n} spits on the floor between your feet.", "{n} smiles, unpleasantly, and says nothing at all."],
      greedy: ["{n} shrugs. 'Then I don't see what's in it for me.'", "{n} turns back to the till."],
      official: ["{n}'s face shuts like a ledger. 'I'll need to see some papers.'", "{n} reaches for the telephone, then thinks better of it. 'I think you'd better go.'"],
      kindly: ["{n} looks hurt, and then a little afraid of you.", "{n} goes quiet in a way that's worse than shouting."]
    }
  };
  AP.on = () => { const c = window.CAMP && CAMP.camp; return !(c && c.rules && c.rules.approach === false); };

  /* called by js/adv.js before a conversation's opening lines; false ends the talk for now */
  AP.open = async (g, M, npcId) => {
    if (!AP.on() || !npcId || !M.npcs[npcId] || g.flag(`appr:${npcId}`)) return true;
    const G = window.GAME, src = ((M.src || {}).npcs || {})[npcId] || M.npcs[npcId], n = M.npcs[npcId];
    const first = (n.name || "They").replace(/^(Mrs?\.|Miss|Dr\.|Sgt\.|Sergeant|Inspector|Padre|Father|Mother|Lady|Sir|Mr\.|Captain|Conductor|Pastor|Analyst)\s+/i, "").split(" ")[0];
    const title = /^(Mrs?\.|Miss|Dr\.|Sgt\.|Sergeant|Inspector|Padre|Father|Mother|Lady|Sir|Mr\.|Captain|Conductor|Pastor)\s/i.test(n.name || "") ? n.name : first;
    const id = await g.choose(`How do you come at ${n.name || "them"}?`, AP.KINDS.map((k) => ({ id: k.id, label: k.label, hint: k.hint })));
    if (!id) return true;
    g.set(`appr:${npcId}`);
    const line = pick(SAY[id]); const ag = (G._actor && G.agentById(G._actor)) || G.active()[0];
    if (line) await g.say(line, { who: ag ? ag.id : null }); else await g.narrate(`${ag ? ag.short : "You"} says nothing, and waits.`);
    const temper = AP.temper(src);
    let fit = FIT[temper][id];
    if (fit === "lie") fit = (await AP.roll(g, "Sell the lie", "medium")) ? "good" : "bad";
    await g.narrate(pick(REACT[fit][temper]).replace(/\{n\}/g, title));
    if (fit === "good") {
      if (window.FOCUS && FOCUS.on() && G._actor && G._actorKind === "talk") { const f = FOCUS.get(G.agentById(G._actor)); if (f.cur < f.max) { f.cur += 1; G.refreshParty(); U().print("<small>The talk came easily: 1 Focus back.</small>", "narr"); } }
      return true;
    }
    if (fit === "bad") {
      if (await AP.roll(g, "Keep them talking", "challenging")) { await g.narrate("You find the right words, just. They don't like it, but they keep talking."); return true; }
      /* never a dead end: they still talk, grudgingly, and it costs */
      await g.narrate("They answer, grudgingly, every word dragged out of them.");
      if (window.FOCUS && FOCUS.on() && G._actor) { const f = FOCUS.get(G.agentById(G._actor)); if (f.cur > 0) { f.cur -= 1; G.refreshParty(); U().print("<small>Hard going: 1 more Focus.</small>", "narr"); } }
      return true;
    }
    return true;
  };
  const U = () => window.UI;
  AP.roll = async (g, label, cr) => {
    try { const r = await window.GAME.check({ aspect: "charisma", cr, label, who: window.GAME._actor || "choose" }); return r && (r.success || r.ok || r === true); }
    catch (e) { return Math.random() < 0.5; }
  };
})();
