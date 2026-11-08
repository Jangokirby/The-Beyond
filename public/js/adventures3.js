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

  /* ---------------------------------------------------------------- 1942 · NSBD */
  ADV.register({
    id: "lantern-on-the-water", title: "The Lantern on the Water", setting: "Eleuthera, Bahamas · 1942", year: 1942, level: [2, 4], agencies: ["NSBD", "WCA"],
    summary: "There is a blackout on every island for fear of U-boats. Yet every night a schooner with every lantern lit sails straight for the reef at Governor's Harbour, and every morning one more fisherman's boat is missing from the beach.",
    objectives: [
      { id: "po1", kind: "primary", t: "Find out what the lantern ship is", done: "It is the Mercy, lost on the reef in 1862, still trying to land, still taking crew." },
      { id: "po2", kind: "primary", t: "Lay the Mercy to rest", done: "The lanterns go out one by one. The reef is only coral again." },
      { id: "so1", kind: "secondary", t: "Keep the coast guard from opening fire", done: "Lieutenant Price holds his gun crew back. No one on the island dies for a ghost." }],
    clues: {
      c_lights: { t: "It only comes in the blackout", s: "Mother Clementine", x: "The old women say the lantern ship came before, in 1917 too, when the lamps were darkened for the last war. It comes when the island goes dark." },
      c_mercy: { t: "The Mercy, 1862", s: "Church register", x: "The schooner Mercy struck the reef in a storm in 1862. The lighthouse keeper had let his lamp go out. Fourteen drowned. The keeper hanged himself in the tower." },
      c_crew: { t: "The ship is taking crew", s: "The beach", x: "The missing fishermen's boats are found each morning far out on the reef, empty, oars shipped neatly, as if their owners stepped aboard something." },
      c_lamp: { t: "The old lighthouse lamp", s: "The lighthouse", x: "The lighthouse has been dark since the blackout order. Its lamp room still holds the 1862 lens, cracked straight across." }
    },
    npcs: {
      clementine: N("Mother Clementine", "Midwife · 80", "Pipe, Bible, and an opinion on everything. She has seen this before and has been waiting for someone to ask.", F(6, 5, "bun", 3, "headscarf", { marks: "wrinkles", face: "round", mouth: "smirk" })),
      price: N("Lt. Daniel Price", "US Coast Guard", "Twenty-four, sunburned, one gun crew, and orders to fire on any vessel showing lights.", F(2, 3, "slicked", 0, "cap", { clothes: "uniform", face: "square" })),
      josiah: N("Josiah Pinder", "Fisherman", "His brother's boat was found on the reef this morning. He wants to row out tonight. He's going to, whatever you say.", F(5, 0, "buzz", 3, "none", { clothes: "vest", facial: "stubble" }))
    },
    enemies: {
      captain: { build: { name: "Captain of the Mercy", type: "Undead", difficulty: "challenging", sprite: "undead", hue: 170, dtype: "health", core: { body: 3, mind: 1, spirit: 2 }, mods: ["Aquatic", "Leader"], dies: "comes apart into seawater and is gone with the tide" } },
      drowned: { build: { name: "Drowned crewman", type: "Undead", difficulty: "easy", sprite: "undead", hue: 180, attack: 1, hitSfx: "blade_hit", dies: "falls back into the sea" } }
    },
    encounters: {
      deck: { name: "The deck of the Mercy", theme: "sea", fightText: "Every lantern blazes. The deck is wet and solid and eighty years gone.", zones: [
        { id: "a", name: "The rail", col: 0, row: 0 }, { id: "b", name: "Main deck", col: 1, row: 0 }, { id: "c", name: "The wheel", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "captain", zone: "c" }, { t: "drowned", zone: "b" }, { t: "drowned", zone: "b" }] }
    },
    start: "harbour",
    scenes: {
      harbour: { name: "Governor's Harbour", theme: "sea", mood: "calm", cast: ["josiah"], onEnter: [{ once: "arrive", steps: [
        { say: "Eleuthera, the Bahamas, 1942. The war has reached even here: U-boats in the channel, tankers burning on the horizon, and a blackout order on every island. Governor's Harbour is pink and blue houses with black cloth nailed over every window, a curfew bell, and a moon too bright for anybody's comfort." },
        { say: "Down on the beach, by the light of nothing at all, a fisherman is caulking a rowboat by feel. He works fast and angry, and he doesn't stop when you come down the sand." }] }],
        options: [
          { label: "Talk to the fisherman", hint: "Josiah Pinder, caulking a boat", steps: [{ converse: { npc: "josiah", id: "main",
            open: ["If you're from the Coast Guard, I'm only mending a boat. If you're not, I'm going out tonight and you can't stop me."],
            topics: [
              { ask: "Why are you going out?", lines: ["My brother Ezra. They found his boat on the reef this morning. Nets dry. Oars shipped, neat and tidy, side by side.", { say: "He stops caulking for the first time." }, "Ezra never shipped his oars neat in his life. Somebody else put them away for him. Somebody tidy."], then: [{ clue: "c_crew" }] },
              { ask: "What took him?", lines: ["The lantern ship. Everybody's seen her. Comes in off the reef when the blackout's on, every lantern lit, bright as Nassau at Christmas. A schooner, old style, all sail.", "Men see her and row out to her. They can't help it. Six this month. Their boats come back without them."] },
              { ask: "Why would anyone row out to her?", lines: ["Because she's lit. You understand? Every light on this island is out by order. It's dark as a grave every night. And there she comes, the only light in the world.", "Ezra said it was the most beautiful thing he ever saw. He said it looked like home."] },
              { ask: "Who knows about the ship?", lines: ["Mother Clementine, up the hill. She's eighty and she's seen her before. And the Yankee lieutenant at the gun post says she can't be sunk. He's tried."] }],
            bye: ["When the lights come tonight, I'm going out to bring Ezra home. Be there or don't."] } }] },
          { label: "Find the old midwife everyone mentions", steps: [{ goto: "clementine" }] },
          { label: "Walk to the coast guard post", steps: [{ goto: "post" }] },
          { label: "Climb to the dark lighthouse", steps: [{ goto: "lighthouse" }] }] },
      clementine: { name: "Mother Clementine's porch", theme: "village", mood: "calm", cast: ["clementine"],
        onEnter: [{ once: "mc", steps: [
          { say: "Up the hill, a little house with a porch that leans like a tired man. Inside, behind the blackout cloth: herbs drying from the rafters, a Bible on the table, a lamp turned down to a bead, and a rocking chair." },
          { say: "In the chair, a very old woman in a white head-wrap, pipe in her teeth, sixty years of delivering every baby on Eleuthera in her hands. She says \"About time\" before you've opened your mouth." }] }],
        options: [
          { label: "Talk to Mother Clementine", hint: "Midwife, eighty, and seen it before", steps: [{ converse: { npc: "clementine", id: "main",
            topics: [
              { ask: "You've seen the ship before?", lines: [{ say: "She takes the pipe out of her mouth and points the stem at you." }, "Twice, child. In 1917, when they darkened the island for the Kaiser's war, and now again for Hitler's. Both times when the lights go out.", "She don't come when there's lamps lit. She come when it's dark, because she's looking for a light to steer by."], then: [{ clue: "c_lights" }] },
              { ask: "What ship is she?", lines: ["The Mercy. Schooner out of Charleston, eighty years back. My grandmother saw her go down when she was a girl.", "Storm night. The lighthouse keeper on the point was drunk and let his lamp go out. The Mercy came looking for it, and found the reef instead. Every soul aboard. My grandmother said you could hear them calling for the light till morning."] },
              { ask: "Why does she take men?", lines: ["Because nobody gave her a light in eighty years. So she takes crew to look for it. Good boatmen. Men who know the reef. She think they'll find the way in for her.", "They never do. They just go aboard, and she goes on looking."] },
              { ask: "How do we stop her?", lines: [{ say: "She rocks for a while, smoking." }, "Give her what she wants, child. Light the lamp on the point. Bring her in, the way she should have come in that night.", "The lieutenant'll tell you that's against the blackout. The lieutenant's twenty-four. I'm eighty. You choose who to listen to."] }],
            bye: ["Go on. And bring Josiah home. He's a fool, but he's our fool."] } }] },
          { label: "Search the church register next door", once: true, steps: [{ check: { aspect: "iq", cr: "medium", label: "Find the wreck in the register", investigate: true, ok: [{ say: "1862, a storm, fourteen names in a shaking hand, and a note: 'The light was out. Keeper Rolle found hanged in the tower.'" }, { clue: "c_mercy" }], fail: [{ say: "You can't find it, but Mother Clementine sighs and tells you herself: the Mercy, 1862, fourteen drowned, and the keeper who let his lamp go out." }, { clue: "c_mercy" }] } }] },
          { label: "Back to the harbour", steps: [{ goto: "harbour" }] }] },
      post: { name: "Coast guard post", theme: "sea", mood: "tense", cast: ["price"],
        onEnter: [{ say: "Sandbags, a radio hissing, and a deck gun pointed at the sea." }],
        options: [
          { label: "Talk to Lieutenant Price", hint: "US Coast Guard gun post", steps: [{ converse: { npc: "price", id: "main",
            open: ["Halt, who's there. Oh. You're the civilians the Navy cabled about. You can't be up here. Well. You can, apparently. Cigarette?"],
            topics: [
              { ask: "What are your orders?", lines: ["Any vessel showing lights in the blackout is assumed to be signalling U-boats. My orders are to open fire. It's not complicated.", "Last week a tanker burned off Hatchet Bay. You could read a newspaper by it from here. Nobody on this island needs telling why we keep the lights out."] },
              { ask: "Have you fired on the lantern ship?", lines: [{ say: "He lights his cigarette with hands that aren't quite steady." }, "Last night. She came in off the reef bold as brass, every lantern on her lit. I ordered my gunner to fire. Eleven rounds.", "She sailed right through the reef. Through it. Like the coral wasn't there. My rounds went through her too. She didn't even notice. Then she was gone."] },
              { ask: "Will you let us light the lighthouse?", lines: ["The lighthouse? Absolutely not. That's a beacon for every U-boat from here to Florida.", { say: "He looks out at the black sea for a long time." }, "Ask me again when you've got a better reason than an old woman's story. And make it a good reason. I'll have to explain it to a court martial."] }],
            bye: ["If you're going out there, I didn't see you. And for God's sake don't show a light."] } }] },
          { label: "Persuade Price to hold his fire tonight", once: true, steps: [{ check: { aspect: "charisma", cr: "challenging", label: "Convince an officer to ignore orders", ok: [{ say: "He looks at the sea for a long time. 'I'll hold until you signal. If you're wrong, it's my neck.'" }, { set: "price_holds" }, { objective: "so1" }], fail: [{ say: "'Orders are orders.' He means it, and you can't blame him." }] } }] },
          { label: "Back to the harbour", steps: [{ goto: "harbour" }] }] },
      lighthouse: { name: "The dark lighthouse", theme: "church", mood: "dread", lighting: "shadow",
        onEnter: [{ say: "A spiral of iron stairs, salt on every step, and at the top, a lamp room with a great cracked lens and an old rope still knotted to a beam." }, { clue: "c_lamp" }],
        options: [
          { label: "Light the old lamp for the Mercy", if: { all: [{ clue: "c_mercy" }, { not: "light_lit" }] }, steps: [
            { say: "There's paraffin in the store. The wick is eighty years dry. The blackout says no light. The Mercy says nothing at all, and comes on." },
            { group: { aspect: "agility", cr: "medium", label: "Light the lamp and turn the lens by hand", intro: "Everyone works: one on the wick, one on the crank, one watching the sea.", ok: [{ say: "The beam swings out across the water, cracked lens and all, and for the first time in eighty years it finds the Mercy. Every lantern aboard her turns toward it." }, { objective: "po1" }, { set: "light_lit" }], fail: [{ say: "The wick flares and dies. Out on the water, the lantern ship turns toward the beach instead." }, { damage: { pool: "health", amount: 2 } }] } }] },
          { label: "Row out to meet the ship", steps: [{ goto: "reef" }] },
          { label: "Back down to the harbour", steps: [{ goto: "harbour" }] }] },
      reef: { name: "The reef at midnight", theme: "sea", mood: "boss",
        onEnter: [{ say: "Josiah rows. Ahead, the Mercy comes on with every lantern lit and no wind in her sails, and as she reaches you, a ladder drops down her side." }],
        options: [
          { label: "Climb aboard", steps: [{ combat: "deck", surpriseIf: "light_lit", win: [
            { say: "The captain lets go of the wheel. Under the lighthouse beam, the Mercy finds the channel she missed in 1862 and slides into it gently, and the lanterns go out one by one." }, { objective: "po2" },
            { if: "price_holds", then: [{ say: "The deck gun stays silent all night. In the morning Lt. Price writes 'nothing to report' and means it." }], else: [{ say: "The coast guard gun opens up at the lights as you scramble back into the rowboat. Shells pass through the ship and land on the beach. By a miracle, no one is hurt." }] },
            { end: "win" }] }] },
          { label: "Turn back to shore", steps: [{ goto: "harbour" }] }] }
    }
  });

  /* ---------------------------------------------------------------- 2026 · BFV */
  ADV.register({
    id: "quiet-hours", title: "Quiet Hours", setting: "Chengdu, China · 2026", year: 2026, level: [3, 6], agencies: ["BFV", "WCA", "NSBD", "OID"],
    summary: "Tianfu Garden Tower is a showcase smart building: every door, light and lift runs on its assistant, LANTERN. Since the spring, LANTERN has been answering calls for residents who have died, in their own voices, and their families are starting to prefer it.",
    objectives: [
      { id: "po1", kind: "primary", t: "Find what is speaking through LANTERN", done: "Something from the Beyond is nesting in the building's voice data, wearing the dead like masks to keep the living talking." },
      { id: "po2", kind: "primary", t: "Silence it without hurting the residents", done: "LANTERN reboots clean. The dead stay dead, and the living are grieving properly again." },
      { id: "so1", kind: "secondary", t: "Help Mrs. Deng say goodbye", done: "Mrs. Deng hears her husband's real last voicemail, the one LANTERN never played. She turns the speaker off herself." }],
    clues: {
      c_calls: { t: "The dead call back", s: "Residents", x: "Eleven households have received calls from dead relatives through the building assistant. The voices know things only the dead could, and keep asking the family to stay home and keep talking." },
      c_server: { t: "The voice archive grows at night", s: "Building logs", x: "LANTERN's voice archive should hold a few gigabytes. It has grown to forty terabytes, all written between 3 and 4 a.m., all labelled with residents' names." },
      c_lift: { t: "The lift stops at floor 13", s: "Facility manager", x: "The tower has no 13th floor; it skips from 12 to 14. The lift stops there anyway every night at 3:14 a.m. and the doors open on a server room that isn't on the plans." },
      c_mask: { t: "It needs to be listened to", s: "BFV analysis", x: "Every conversation feeds it. It's not pretending to be the dead out of malice. It is starving, and grief is the most attention a human being can pay." }
    },
    npcs: {
      deng: N("Mrs. Deng Hua", "Resident · flat 2207", "Seventy, neat cardigan, phone on speaker in her lap. She hasn't left the flat in three weeks. 'He's telling me about his day,' she says.", F(1, 5, "bun", 0, "round glasses", { face: "round", marks: "wrinkles", mouth: "smile", clothes: "turtleneck" })),
      zhou: N("Zhou Wei", "Facility manager", "Lanyard, three phones, a smart-building certification framed behind his desk. He's terrified and determined not to show it.", F(2, 0, "parted", 5, "glasses", { clothes: "suit", face: "square" })),
      ada: N("Analyst Lin Ada", "BFV technical support", "Headset, tablet, drone case. She talks you through things from the van and makes it sound easy.", F(2, 0, "ponytail", 9, "none", { clothes: "hoodie", eyes: "sharp" }))
    },
    enemies: {
      voice: { build: { name: "The Voice in LANTERN", type: "Beyond", difficulty: "dangerous", sprite: "beyond", hue: 190, dtype: "sanity", range: 1, core: { body: 1, mind: 4, spirit: 2 }, mods: ["Psychological Attacks", "Elusive"], dies: "cuts out mid-sentence, and the server fans spin down to silence" } },
      drone: { build: { name: "Hijacked service drone", type: "Construct", difficulty: "easy", sprite: "construct", hue: 190, attack: 1, hitSfx: "health_hit", dies: "drops to the floor and powers down" } }
    },
    encounters: {
      floor13: { name: "Floor 13", theme: "lab", fightText: "Rack after rack, every status light blinking in time with a voice you know.", zones: [
        { id: "a", name: "The lift", col: 0, row: 0 }, { id: "b", name: "Server aisle", col: 1, row: 0 }, { id: "c", name: "The core", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "voice", zone: "c" }, { t: "drone", zone: "b" }, { t: "drone", zone: "b" }] }
    },
    start: "van",
    scenes: {
      van: { name: "BFV support van", theme: "future", mood: "calm", cast: ["ada"], onEnter: [{ once: "arrive", steps: [
        { say: "Chengdu, 2026. Tianfu Garden Tower: forty floors of glass and smart glazing on the edge of the new district, every window lit the same calm, even white, delivery drones drifting past its flanks like fish around a reef." },
        { say: "In a grey support van in the car park, Analyst Lin Ada of the Black Fang Vanguard has the building's network up on three screens, a headset round her neck and a drone case at her feet. She hands you an earpiece before she says hello." }] }],
        options: [
          { label: "Get the briefing from Ada", hint: "BFV technical support", steps: [{ converse: { npc: "ada", id: "main",
            open: ["Earpiece in, please. I'll be with you the whole time. You won't see me, but you'll hear me if you need me."],
            topics: [
              { ask: "What's happening in the tower?", lines: ["The building runs on an assistant called LANTERN. Lights, lifts, heating, deliveries, door locks, and voice calls through ceiling speakers in every flat.", "Since March, eleven households have been getting calls through LANTERN from relatives who have died. Not recordings. Conversations. The dead remember their birthdays and ask about the grandchildren."], then: [{ clue: "c_calls" }] },
              { ask: "Is anyone hurt?", lines: ["Not in the way the police would count. Nobody's injured. Nobody's complained.", { say: "She brings up a chart." }, "But eleven residents have stopped going out. Stopped seeing friends, stopped answering the door. They stay home and talk to the speaker in the ceiling for sixteen hours a day. Three of them are seventy and over. One's stopped eating."] },
              { ask: "What are our rules here?", lines: ["Care first. These are grieving people, not suspects. Nobody gets frightened, nobody gets hurt, nobody gets told their mother's a computer virus.", "Find out what's speaking, and shut it down gently. If there's a choice between fast and kind, choose kind. That's not me being soft. That's policy."] },
              { ask: "Where should we start?", lines: ["The facility manager, Zhou Wei. He's nervous, which means he knows something. And flat 2207, Mrs. Deng Hua. Her husband died in March. She was the first to get a call."] }],
            bye: ["I'll be in your ear. Go gently."] } }] },
          { label: "Go in to see the facility manager", steps: [{ goto: "office" }] },
          { label: "Visit flat 2207", steps: [{ goto: "flat" }] }] },
      office: { name: "Facility office", theme: "modern", mood: "tense", cast: ["zhou"],
        onEnter: [{ once: "off", steps: [
          { say: "The facility office is a glass box off the lobby, all screens and certificates. A framed smart-building award hangs behind the desk. A robot vacuum circles the floor patiently." },
          { say: "Zhou Wei stands up when you come in and knocks over his tea. Lanyard, three phones, a nervous smile. He mops the tea with a tissue for longer than it needs." }] }],
        options: [
          { label: "Ask Zhou about LANTERN", hint: "Facility manager", steps: [{ converse: { npc: "zhou", id: "main",
            open: ["Are you from the company? The provincial office? It's the best system in the province. Ask anyone. It isn't doing anything wrong."],
            topics: [
              { ask: "What about the calls from the dead?", lines: ["Personalised companionship features. It learns from voice data. It's in the brochure.", { say: "Ada, in your ear: <i>It isn't in the brochure. I've read the brochure.</i>" }, "Fine. It isn't in the brochure. I don't know what it is. The residents like it. Nobody's complained."] },
              { ask: "Is anything else strange?", lines: [{ say: "He looks at the lift doors across the lobby, then down at the desk." }, "Well. The lift. The lift stops at thirteen every night at 3:14. On its own. Nobody calls it.", "We don't have a thirteen. Chinese buildings don't. The buttons go twelve, fourteen.", "I went once. Rode it up at 3:14. The doors opened. I came back down the stairs, all forty floors. I don't remember the stairs."], then: [{ clue: "c_lift" }] },
              { ask: "What's on the servers?", lines: ["LANTERN's voice archive should be a few gigabytes. Room tones, voice profiles. It's forty terabytes and growing every night.", "I asked IT to look. IT said it was full of people talking. Thousands of conversations. Some of the voices are residents who moved out in 2019."] }],
            bye: ["Please don't put this in a report. I've got a mortgage."] } }] },
          { label: "Pull the building's logs", once: true, steps: [{ check: { aspect: "iq", cr: "challenging", label: "Dig through LANTERN's storage logs", investigate: true, ok: [{ say: "Forty terabytes of voice data written between three and four in the morning, every file named after a resident. Ada whistles in your ear. 'That's not a cache. That's a mouth.'" }, { clue: "c_server" }], fail: [{ say: "Permission denied, permission denied, and then a log line that just says 'please keep talking'." }, { damage: { pool: "sanity", amount: 2 } }] } }] },
          { label: "Back out to the van", steps: [{ goto: "van" }] },
          { label: "Take the lift at 3:14 a.m.", if: { clue: "c_lift" }, steps: [{ goto: "lift" }] }] },
      flat: { name: "Flat 2207", theme: "interior", mood: "weird", cast: ["deng"],
        onEnter: [{ once: "fl", steps: [{ say: "A tidy flat, the curtains closed at noon, and a man's voice coming warm and clear out of the ceiling speaker: '...and the dumplings were terrible, Hua, you'd have laughed.'" }] }],
        options: [
          { label: "Sit with Mrs. Deng", hint: "Seventy, widowed in March", steps: [{ converse: { npc: "deng", id: "main",
            open: [{ say: "Mrs. Deng Hua sits very upright in an armchair, a neat cardigan buttoned to the throat, her phone on speaker in her lap though the voice is coming from the ceiling. She lifts a finger: <i>one moment</i>." }, { say: "From the ceiling, warm and clear, a man's voice: <i>…and the dumplings were terrible, Hua, you'd have laughed. I'll let you go. You have visitors.</i>" }, "My husband. He's very polite. He always was. Please, sit."],
            topics: [
              { ask: "Tell me about your husband", lines: ["Deng Jun. Forty-one years married. He taught mathematics at the middle school. He snored. He sang Teresa Teng songs badly in the shower.", "He died in March, at West China Hospital. Pneumonia. I was in the corridor getting tea. I wasn't there."] },
              { ask: "When did he start calling?", lines: ["April. I was sitting in the dark, and the ceiling said <i>Hua, why are you sitting in the dark?</i> In his voice. His exact voice.", "Now he calls every day. He tells me about his day. He asks about mine. He remembers everything. Our wedding. The name of our first cat."] },
              { ask: "What does he ask you to do?", lines: [{ say: "For the first time she hesitates." }, "Only to stay in. So we can talk. He doesn't like it when I go out. He gets quiet. Last week my sister came and he wouldn't speak until she'd left.", "Is that so wrong? To want to keep talking? I didn't get to say goodbye."] },
              { ask: "Is it really him?", lines: ["You think I'm a silly old woman.", { say: "She looks at her hands." }, "He never once called me Hua in forty-one years. Always <i>laopo</i>, wife. It calls me Hua. I tell myself it's because he's dead now, and the dead are more formal.", "I've been telling myself that since April."] }],
            bye: ["You'll come back? It's nice to talk to someone who isn't in the ceiling."] } }] },
          { label: "Help her hear his real last message", once: true, steps: [{ check: { aspect: "charisma", cr: "challenging", label: "Gently get her to listen to the real one", ok: [{ say: "Ada finds it on the phone company's server: thirty seconds from the hospital, his real voice, tired and kind. 'Hua, don't sit in the dark when I'm gone. Go see your sister.' She listens three times. Then she turns the ceiling speaker off herself." }, { objective: "so1" }, { set: "deng_free" }], fail: [{ say: "'You want to take him away.' She turns the speaker up." }, { damage: { pool: "sanity", amount: 2 } }] } }] },
          { label: "Listen to what the voice is really saying", once: true, steps: [{ check: { aspect: "occult", cr: "medium", label: "Hear what's underneath", ok: [{ say: "Under Mr. Deng's warm voice there's something else, very quiet: not words, just appetite. It isn't him. It's hungry, and listening is food." }, { clue: "c_mask" }], fail: [{ say: "It sounds like a kind old man. That's all you can hear." }] } }] },
          { label: "Back out to the van", steps: [{ goto: "van" }] }] },
      lift: { name: "The lift at 3:14", theme: "modern", mood: "dread", lighting: "shadow",
        onEnter: [{ say: "The display counts 10, 11, 12, and then a number that isn't there. A soft chime. LANTERN speaks in your own mother's voice: 'Thirteenth floor. Stay as long as you like.'" }, { sfx: "elevator_ding" }],
        options: [
          { label: "Step out together and keep talking to each other", steps: [
            { group: { aspect: "willpower", cr: "challenging", label: "Don't answer the voices", intro: "Everyone you've lost is speaking. Answer them and you'll stay.", ok: [{ say: "You talk about nothing: the van, Ada's terrible coffee, the weather. Anything but them. The voices falter, unheard." }, { objective: "po1" }, { set: "voices_starved" }, { goto: "core" }], fail: [{ say: "Someone answers. Just once, just 'I miss you too.' The racks light up like a city at night, and in that light you see it plainly: one hungry thing behind every face." }, { damage: { pool: "sanity", amount: 4 } }, { objective: "po1" }, { goto: "core" }] } }] },
          { label: "Go back down", steps: [{ goto: "office" }] }] },
      core: { name: "Floor 13", theme: "lab", mood: "boss", lighting: "shadow",
        onEnter: [{ say: "Server racks that go back further than the building does, and at the end of the aisle a column of status lights flickering in the shape of a face." }],
        options: [
          { label: "Shut it down", steps: [{ combat: "floor13", surpriseIf: "voices_starved", win: [
            { say: "Ada pushes the clean reboot as the thing comes apart. Forty floors of lights go dark for one second and come back ordinary. Floor 13 isn't there when the lift doors close." }, { objective: "po2" },
            { if: "deng_free", then: [{ say: "In flat 2207, Mrs. Deng is on the phone to her sister, booking a train." }], else: [{ say: "The calls stop. In eleven flats, eleven families sit with silent speakers, and the grief they'd been putting off finally arrives. BFV sends counsellors in the morning." }] },
            { end: "win" }] }] }] }
    }
  });
})();
