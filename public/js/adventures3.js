/* ============================================================================
   MORE CASES, PART THREE — same data format as adventures.js (see adv.js).
   ========================================================================== */
(function () {
  const A = window.ART, ADV = window.ADV;
  const F = (s, hc, h, o, x = "none", more = {}) => ({ skin: A.SKIN[s], hairC: A.HAIRC[hc], hair: h, outfit: A.OUTFIT[o], extra: x, bg: "#2b2f3a", ...more });
  const N = (name, tag, look, face) => ({ name, tag, look, face });

  /* ---------------------------------------------------------------- 1871 · WCA */
  ADV.register({
    id: "sitting-room", title: "The Sitting Room", setting: "Bath, England · 1871", year: 1871, level: [1, 3], agencies: ["WCA", "OID"],
    summary: "Mrs. Honoria Vane's séances are the talk of Bath: the dead really do answer. Lately they don't leave. Three of her regular sitters have stopped going home, and the house on the Circus is getting crowded with guests no one can see.",
    objectives: [
      { id: "po1", kind: "primary", t: "Find out what Mrs. Vane is really contacting", done: "It isn't the dead. It's one thing wearing all of them, and it lives in her late husband's planchette." },
      { id: "po2", kind: "primary", t: "End the sittings for good", done: "The planchette is broken and burned. The sitting room is only a room." },
      { id: "so1", kind: "secondary", t: "Bring the three missing sitters home", done: "Colonel Ashby, Miss Pell and young Mr. Lowe walk out of the house blinking, a week of their lives gone." }],
    clues: {
      c_sitters: { t: "The sitters never left", s: "The housemaid", x: "Three regular sitters arrived for Thursday's séance and never came out. The maid still lays out their tea every afternoon. The cups come back empty." },
      c_voices: { t: "Every voice says the same word", s: "The séance record", x: "Mrs. Vane writes down every message. Read them in order and every 'spirit', whoever it claims to be, ends with the same word: 'stay'." },
      c_board: { t: "The planchette came from abroad", s: "Mr. Vane's study", x: "Her husband brought the planchette home from Vienna, a month before he died. His diary calls it 'the listener'. He stopped writing two days later." },
      c_cold: { t: "The cold follows the board", s: "The sitting room", x: "Wherever the planchette sits, the room is ten degrees colder, and the gaslight bends toward it like a plant to a window." }
    },
    npcs: {
      vane: N("Mrs. Honoria Vane", "Medium · widow", "Black silk, a cameo of her husband at her throat, and the most sincere eyes in Bath.", F(1, 5, "bun", 5, "none", { clothes: "robe", face: "long", mouth: "neutral", marks: "wrinkles" })),
      tilly: N("Tilly", "Housemaid · 15", "Red hands, a starched cap and the grim courage of a girl who still has to dust the sitting room.", F(1, 7, "ponytail", 6, "headscarf", { clothes: "vest", marks: "freckles" })),
      ashby: N("Colonel Ashby", "Sitter · missing", "A big moustache and a bigger voice, now just a pale shape at the end of the table who won't look at you.", F(0, 5, "slicked", 7, "none", { clothes: "uniform", facial: "mutton chops" }))
    },
    enemies: {
      listener: { build: { name: "The Listener", type: "Spirit", difficulty: "challenging", sprite: "spirit", hue: 210, dtype: "sanity", range: 1, core: { body: 0, mind: 3, spirit: 2 }, mods: ["Psychological Attacks", "Mimic"], dies: "falls silent mid-word, like a voice on a broken wire" } },
      sitter: { build: { name: "Held sitter", type: "Human", difficulty: "easy", sprite: "humanoid", hue: 220, attack: 0, hitSfx: "health_hit", dies: "slumps in their chair, breathing, themselves again" } }
    },
    encounters: {
      seance: { name: "The last sitting", theme: "interior", fightText: "The table rises. Every chair is full. Every voice says stay.", zones: [
        { id: "a", name: "The door", col: 0, row: 0 }, { id: "b", name: "Around the table", col: 1, row: 0 }, { id: "c", name: "The cabinet", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "listener", zone: "c" }, { t: "sitter", zone: "b", name: "Colonel Ashby" }, { t: "sitter", zone: "b", name: "Miss Pell" }] }
    },
    start: "circus",
    scenes: {
      circus: { name: "The Circus, Bath", theme: "fog", mood: "calm", weather: "rain", onEnter: [{ once: "arrive", steps: [
        { say: "Bath, 1871. The Circus: a ring of honey-coloured Georgian townhouses around a dripping green, chimney pots smoking, a brougham waiting at one door with its horse steaming in the rain. It's the most respectable street in the most respectable town in England." },
        { say: "Number 17 has every curtain drawn at four in the afternoon. In the window, a neat card in copperplate: <i>Sittings Thursday. All welcome. The dead are waiting.</i>" }] }],
        options: [
          { label: "Ring at number 17", steps: [{ goto: "hall" }] },
          { label: "Ask the neighbours about Mrs. Vane", once: true, steps: [{ check: { aspect: "charisma", cr: "easy", label: "Gossip with the neighbours", ok: [{ say: "Everyone adores her. Everyone also crosses the street rather than pass her door after dark, and nobody can quite say why." }], fail: [{ say: "Doors close politely in your face." }] } }] }] },
      hall: { name: "The hall at number 17", theme: "interior", mood: "tense", cast: ["tilly"],
        onEnter: [{ once: "hall", steps: [
          { say: "The maid opens the door a crack, sees you're not sitters, and lets you in so fast she nearly pulls you over the step. She shuts it behind you and leans on it, breathing hard, a girl of fifteen in a starched cap with red-raw hands." },
          { say: "The hall is cold: much colder than the street. Three hats hang on the stand, a top hat, a lady's bonnet with a feather and a young man's boater, and under them three pairs of galoshes, dry. They've been dry for a week." }] }],
        options: [
          { label: "Talk to Tilly", hint: "Housemaid, and frightened", steps: [{ converse: { npc: "tilly", id: "main",
            open: ["You're not here for a sitting. Thank the Lord. Please, sir, madam, keep your voices down. Madam's resting."],
            topics: [
              { ask: "Whose hats are those?", lines: [{ say: "She looks at the hat stand as if it might bite her." }, "The Colonel's, Miss Pell's and young Mr. Lowe's. They came Thursday for the sitting, same as every week. They never went home.", "I lay their tea every day like madam says. Three cups in the sitting room. Every day the cups come back empty and cold, and nobody's drunk from them."], then: [{ clue: "c_sitters" }] },
              { ask: "Have you seen them?", lines: ["Once. Through the keyhole. They're sat round the table in the dark, holding hands, very still. The Colonel's moustache has gone all white. It was black on Thursday.", "And there's more of them than there ought to be. There's chairs round that table I never put there."] },
              { ask: "What's Mrs. Vane like?", lines: ["Kind. Truly kind, I mean it. Pays on the nail, never shouts, gives me Sunday afternoons.", "Only since Mr. Vane passed she's been different. Happier. She talks to him every Thursday through that board of his. She says he's never been so attentive."] },
              { ask: "Will you go into that room?", lines: ["Not after the lamps are lit. Not for a hundred pounds. I'm not paid enough to go in that room, and I'm not paid at all to come out of it different."] }],
            bye: ["Madam's in the parlour. She'll be glad to see you. She's always glad to see people. That's what frightens me."] } }] },
          { label: "See Mrs. Vane in the parlour", steps: [{ goto: "parlour" }] },
          { label: "Slip upstairs to Mr. Vane's study", steps: [{ goto: "study" }] },
          { label: "Go into the sitting room", steps: [{ goto: "sitting" }] }] },
      parlour: { name: "The parlour", theme: "interior", mood: "calm", cast: ["vane"],
        onEnter: [{ once: "par", steps: [
          { say: "The front parlour is crowded with mourning: black crape on the mirror, a photograph of a whiskered gentleman wreathed in immortelles, a clock stopped at twenty past three." },
          { say: "Mrs. Honoria Vane rises to meet you in black silk, a cameo of her husband at her throat. Fifty, handsome, and with the most sincere eyes in Bath. She pours tea with perfectly steady hands." },
          { talk: { npc: "vane", text: "You've come about my gift. Everyone does, in the end. Sugar? Sit, please, you're letting the warmth out." } }] }],
        options: [
          { label: "Ask what happened to her sitters", steps: [
            { talk: { npc: "vane", text: "Happened? Nothing has happened. They're resting. Our Thursday was so very successful, you see. The Colonel spoke to his brother from Balaclava. Miss Pell heard her mother. Young Mr. Lowe heard from his twin." } },
            { talk: { npc: "vane", text: "The spirits asked them to stay a little longer, and who am I to refuse the dead? My Edmund asked me to stay too, you know. Every Thursday he asks. I told him I can't, not yet. Someone must keep the house." } },
            { read: { cr: "medium", lying: false, ok: [{ say: "She believes every word. That's the worst of it." }] } }] },
          { label: "Ask to see the séance record", once: true, steps: [{ check: { aspect: "iq", cr: "medium", label: "Read the record of sittings", investigate: true, ok: [{ say: "Forty sittings in her neat hand: grandmothers, drowned sailors, a dead child. Line them up and every message ends the same way. Stay. Stay. Stay." }, { clue: "c_voices" }], fail: [{ say: "Grief, page after page. It takes hours, and it hurts, but eventually the pattern surfaces: every message ends with the same word. Stay." }, { damage: { pool: "sanity", amount: 3 } }, { clue: "c_voices" }] } }] },
          { label: "Back to the hall", steps: [{ goto: "hall" }] }] },
      study: { name: "Mr. Vane's study", theme: "interior", mood: "dread", lighting: "shadow",
        onEnter: [{ say: "Dust sheets, a cold grate, and a dead man's diary on the desk, as if he'd stepped out." }],
        options: [
          { label: "Read the diary", once: true, steps: [{ check: { aspect: "iq", cr: "easy", label: "Read Edmund Vane's last entries", ok: [{ say: "'Bought a planchette in Vienna from a dealer who would not give his name. It listens, Honoria says. I think it is learning.' Two days later the handwriting changes. Then it stops." }, { clue: "c_board" }], fail: [{ say: "The ink has run. You make out 'Vienna', 'planchette' and 'it listens', and the date he stopped writing. It's enough, and it chills you." }, { damage: { pool: "sanity", amount: 2 } }, { clue: "c_board" }] } }] },
          { label: "Back down to the hall", steps: [{ goto: "hall" }] }] },
      sitting: { name: "The sitting room", theme: "interior", mood: "weird", lighting: "shadow",
        onEnter: [{ say: "A round table set for nine, and three chairs already taken by people who don't move. At the centre of the table, a heart-shaped planchette on little brass wheels. The gaslights lean toward it." }, { clue: "c_cold" }],
        options: [
          { label: "Shake Colonel Ashby awake", once: true, steps: [{ check: { aspect: "willpower", cr: "medium", label: "Call the Colonel back", ok: [{ say: "His eyes focus for a moment. 'It sounds like my wife,' he whispers. 'But my wife never said stay. She always said go on, Henry.'" }, { set: "ashby_stirred" }], fail: [{ say: "He turns his head toward you, slowly, and says 'stay' in your mother's voice." }, { damage: { pool: "sanity", amount: 3 } }] } }] },
          { label: "Tell Mrs. Vane the truth and bring her in", if: { all: [{ clue: "c_voices" }, { clue: "c_board" }] }, once: true, steps: [
            { talk: { npc: "vane", text: "Edmund said stay. They all said stay. It was always the same voice, wasn't it? I wanted it to be him so badly." } }, { objective: "po1" }, { set: "vane_with_us" }] },
          { label: "Take the planchette from the table", steps: [{ combat: "seance", surpriseIf: "vane_with_us", win: [
            { say: "The planchette splits along the grain. Something like a long breath goes out of the room, and the gaslights stand up straight." }, { objective: "po2" },
            { if: "ashby_stirred", then: [{ say: "The three sitters wake together, stiff and starving and very much alive. Tilly brings real tea. Nobody leaves it in the cups." }, { objective: "so1" }], else: [{ say: "The sitters wake slowly over the next day. Miss Pell doesn't remember her own name for a week." }] },
            { end: "win" }] }] },
          { label: "Back to the hall", steps: [{ goto: "hall" }] }] }
    }
  });

})();
