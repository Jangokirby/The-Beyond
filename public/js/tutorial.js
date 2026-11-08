/* ============================================================================
   TUTORIAL — "The First Night": a short training case that teaches the
   book's rules one at a time. Reached from the title screen ("Learn to
   play"), which makes a practice campaign with two rolled agents, or from
   any case board. Every explanation is the book's rule as the game uses it.
   ========================================================================== */
(function () {
  const A = window.ART, ADV = window.ADV; if (!ADV) return;
  const F = (s, hc, h, o, x = "none", bg = "#2b2f3a") => ({ skin: A.SKIN[s], hairC: A.HAIRC[hc], hair: h, outfit: A.OUTFIT[o], extra: x, bg });
  const tip = (t) => ({ say: `<span class="tut">How it works</span> ${t}` });
  ADV.register({
    id: "tutorial", title: "Training: The First Night", setting: "The agency's training house · 1925", year: 1925, level: [1, 2], agencies: ["OID", "WCA", "NSBD", "EHG", "BFV"], tutorial: true,
    summary: "Every new agent spends one night in the old house on Ashcombe Lane. Something there has been knocking on the coal-store door since 1911. It is very good practice.",
    objectives: [
      { id: "po1", kind: "primary", t: "Find out what knocks in the coal store", done: "A coal-heaver called Ned Pike, who went in for a sack in 1911 and never came out." },
      { id: "po2", kind: "primary", t: "Put it to rest", done: "The knocking has stopped. The house is very quiet." },
      { id: "so1", kind: "secondary", t: "Hear Mrs. Hobb's story", done: "She's kept the house for forty years. She'd like to be thanked, once." }],
    clues: {
      c_letter: { t: "A letter in the desk", s: "The study desk", doc: "letter", x: "Dear Agency. The knocking began the night Ned went into the coal store and has not stopped since. Three knocks, then a pause, then three. I leave the key in the desk for your trainees. Yours, R. Ashcombe, 1912." },
      c_hobb: { t: "Ned liked a song", s: "Mrs. Hobb", x: "Ned Pike whistled 'Keep the Home Fires Burning' every time he went down. She says if you whistle it at the door, the knocking answers." },
      c_cellar: { t: "Coal dust that moves", s: "The cellar", doc: "notes", x: "The coal dust on the cellar floor shifts in a slow circle when nobody is looking, like something walking round and round." }
    },
    npcs: { hobb: { name: "Mrs. Hobb", tag: "Housekeeper · forty years", look: "Grey bun, black apron, a ring of keys and the steady eye of someone who has seen fifty trainees come and go.", face: F(1, 5, "bun", 5) } },
    enemies: { ned: { build: { name: "The Knocking Man", type: "Spirit", difficulty: "easy", sprite: "spirit", hue: 30, dtype: "sanity", attack: 0, dies: "stops knocking, and is only coal dust settling" } } },
    encounters: {
      coal: { name: "The coal store", theme: "cellar", fightText: "Coal dust lifts off the floor and stands up in the shape of a man with a sack on his shoulder.",
        zones: [{ id: "a", name: "The cellar steps", col: 0, row: 0 }, { id: "b", name: "The coal heap", col: 1, row: 0 }, { id: "c", name: "The back wall", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "ned", zone: "c" }] }
    },
    start: "hall",
    scenes: {
      hall: { name: "The front hall, Ashcombe Lane", theme: "interior", mood: "calm", lighting: "lit", cast: ["hobb"], onEnter: [{ once: "intro", steps: [
        { say: "A tall, cold house at the end of a quiet lane. Gas lamps turned low, a grandfather clock, a smell of polish and old coal. Somewhere below your feet: three knocks, a pause, three more." },
        tip("The picture is the place you're in. The marks on it are things you can do: look at something, talk to someone, or go somewhere. Hover one to see what it is, whether it needs a roll, and what it costs."),
        tip("Looking and talking cost <b>Focus</b>, a few points per agent per case (a house rule; change it in the hideout). Choose who does what: the right agent for the job matters.")] }],
        options: [
          { label: "Talk to Mrs. Hobb", hint: "The housekeeper", steps: [
            { once: "tip_talk", steps: [tip("Before you talk to someone for the first time, you choose how to come at them. Kindness opens some people and closes others; leaning on a frightened person rarely works. A lie is always a <b>Charisma</b> roll.")] },
            { converse: { npc: "hobb", id: "main", open: ["Another one. Come in, then, and wipe your feet. You'll be wanting to know about the knocking."],
              topics: [
                { ask: "Who was he?", lines: ["Ned Pike. Coal man. Sweet on the cook, God rest her. Whistled the same tune every time he went down those steps.", { say: "She hums a bar of it without meaning to." }], then: [{ clue: "c_hobb" }] },
                { ask: "Have you ever seen him?", lines: ["Once. 1919. Standing in the coal with his sack, looking at me like I owed him money.", "I didn't go down for a month after."] },
                { ask: "How long have you kept this house?", lines: ["Forty years this spring. Fifty of you lot I've watched go down to that cellar. All came back up, mind.", "None of them ever said thank you."], then: [{ objective: "so1" }] }],
              bye: ["Mind the third step down. It's loose. It's always been loose."] } }] },
          { label: "Search the study desk", hint: "An old roll-top desk", once: true, steps: [
            tip("A roll is <b>2d6 + an Aspect</b> (and any bonuses) against a <b>Challenge Rating</b>: Easy 7, Medium 10, Challenging 14, Dangerous 18, Hopeless 20. Meet it or beat it and you succeed."),
            tip("If a roll fails and you have a <b>Fate Point</b> (the ◆ by your name), you can spend it to succeed instead. Every agent starts a case with at least one."),
            { check: { aspect: "iq", cr: "easy", label: "Search the desk", investigate: true,
              ok: [{ say: "The bottom drawer has a false back, and behind it a letter and an iron key." }, { clue: "c_letter" }, { set: "key" }, tip("Clues go into the <b>Case file</b> (top right). Click a clue there to read it as the document it is.")],
              fail: [{ say: "You pull out a drawer too hard and it comes away in your hands, spilling sixty years of receipts. Under them, a letter and an iron key. It took a while, and your nerves are worse for it." }, { damage: { pool: "stability", amount: 1 } }, { clue: "c_letter" }, { set: "key" },
                tip("A failure rarely stops you; it costs you. Here, 1 <b>Stability</b>. Your three pools are Health (body), Sanity (mind) and Stability (spirit).")] } }] },
          { label: "Go down to the cellar", if: "key", steps: [{ goto: "cellar" }] },
          { label: "Go down to the cellar", if: { not: "key" }, hint: "The door is locked", steps: [{ say: "The cellar door is locked. Mrs. Hobb says the key is 'where it always is', which is no help at all." }] }] },
      cellar: { name: "The cellar", theme: "cellar", mood: "tense", lighting: "shadow", onEnter: [{ once: "cel", steps: [
        { say: "Twelve steps down (the third one loose). Brick, damp, a single bulb on a string. Across the cellar, the coal-store door, and behind it: three knocks, a pause, three more." },
        tip("In <b>Shadow</b> some rolls are harder (−2). A lamp or a light-giving power makes a place <b>Lit</b>.")] }],
        options: [
          { label: "Look at the floor", hint: "The coal dust", once: true, steps: [{ say: "The coal dust lies in a wide, smooth circle, as if something has been walking round and round for years." }, { clue: "c_cellar" }, { objective: "po1" }] },
          { label: "Steady yourselves before the door", once: true, hint: "Everyone rolls", steps: [
            tip("Some rolls are made by <b>everyone</b>: here, <b>Willpower</b> against the dread on the other side of the door."),
            { group: { aspect: "willpower", cr: "easy", label: "Hold your nerve", intro: "Everyone takes a breath and looks at the door.", ok: [{ say: "Nobody looks away. Good." }], fail: [{ say: "The knocking gets inside your head and stays there." }, { damage: { pool: "sanity", amount: 2 } },
              tip("Sanity damage. If an agent's Sanity would break, a <b>Bond</b> (someone they love) can take the hit instead, and the relationship suffers. Visit your Bonds between cases to keep them strong.")] } }] },
          { label: "Whistle Ned's tune at the door", if: { clue: "c_hobb" }, once: true, steps: [{ say: "You whistle the first bar of 'Keep the Home Fires Burning'. The knocking stops. Then, very softly, someone on the other side whistles the second bar." }, { set: "tune" },
            tip("Learning about a monster pays: knowing what it wants can open a way that doesn't need a fight. Here, it makes the fight shorter.")] },
          { label: "Open the coal store", steps: [
            tip("A fight happens in <b>zones</b>. On your turn you have two actions: move, attack, use a power or an item. Attacks are <b>2d6 + your attack</b> against the enemy's <b>Evasion (ER)</b>; damage is reduced by its <b>Resistance</b>. Click an enemy to see its numbers."),
            { combat: "coal", win: [
              { if: "tune", then: [{ say: "As it comes apart, the dust whistles the last bar, and settles. Somewhere above, Mrs. Hobb stops humming." }], else: [{ say: "It comes apart under your blows, a man-shape of coal dust slumping into a heap. The cellar is suddenly, completely quiet." }] },
              { objective: "po2" },
              tip("That's a case. Back at the hideout you can rest, visit your Bonds, buy gear, read your agents' journals and choose the next job from the case board."),
              { end: "win" }] }] },
          { label: "Back upstairs", steps: [{ goto: "hall" }] }] }
    }
  });
  /* the title screen's "Learn to play": a practice campaign, two agents, straight into the case */
  window.TUTORIAL = {
    start: async () => {
      const CAMP = window.CAMP; if (!CAMP) return;
      CAMP.newCampaign({ name: "Training", year: 1925, agency: "WCA" });
      for (let i = 0; i < 2; i++) CAMP.camp.chars.push(CAMP.buildChar(CAMP.rollDraft(CAMP.blankDraft()), 1925, "WCA"));
      CAMP.save();
      await CAMP.startMission("tutorial", CAMP.active().map((a) => a.id));
    }
  };
})();
