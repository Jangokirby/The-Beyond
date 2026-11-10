/* ============================================================================
   PACK · THE PILGRIM ROAD
   A three-part campaign arc for the Order of Infinite Dark, 1321-1323, along
   the road to Santiago. A pardoner sells finger bones of a saint nobody has
   heard of, Saint Ama of the Pass. Every bone is the same bone. The Beyond
   is copying a saint out of the pilgrims who pray to her, and it is nearly
   finished.
   Choices that carry forward (arc flags):
     kept_bone       part 1: you kept one of the pardoner's bones, sealed
     tobiah_taken    part 1: you took the pardoner alive instead of letting him run
     mason_warned    part 2: you got the master mason to stop carving
     chart_taken     part 2: you took the cliff path chart from the quarry
   ========================================================================== */
(function () {
  const A = window.ART;
  const F = (s, hc, h, o, x = "none", more = {}) => ({ skin: A.SKIN[s], hairC: A.HAIRC[hc], hair: h, outfit: A.OUTFIT[o], extra: x, bg: "#2b2f3a", ...more });
  const N = (name, tag, look, face) => ({ name, tag, look, face });

  /* ---------------------------------------------------------------- part 1 · 1321 · Roncesvalles */
  const part1 = {
    id: "pr-1-bones", title: "The Pilgrim Road I: The Pardoner's Bones", setting: "Roncesvalles, the Pyrenees · 1321", year: 1321, level: [1, 3], agencies: ["OID"],
    summary: "At the pilgrims' hospice below the pass of Roncesvalles, eleven pilgrims rise in the night and walk barefoot up into the snow, singing a hymn none of them knows. Every one of them bought a finger bone of Saint Ama from the same pardoner.",
    objectives: [
      { id: "po1", kind: "primary", t: "Find out what the bones are doing to the pilgrims", done: "The bones are all one bone, copied: a saint is being made out of the people who carry her, and she is calling them up the mountain to finish her." },
      { id: "po2", kind: "primary", t: "Stop the walking", done: "The bones are buried in salt in the old charnel house, and the pilgrims sleep through the night." },
      { id: "so1", kind: "secondary", t: "Find the pardoner", done: "Tobiah of Nájera, pardoner, found in a shepherd's hut on the pass with a sack of identical bones." }],
    clues: {
      c_same: { t: "Eleven bones, one bone", s: "The infirmary", x: "Laid side by side, the pilgrims' relics are not alike: they are the same. The same nick at the knuckle, the same brown stain, the same hairline crack. Eleven copies of one finger." },
      c_hymn: { t: "The hymn has a name in it", s: "The sleepwalkers", x: "The hymn the sleepwalkers sing is a litany. Every verse asks Saint Ama to take something: eyes, hands, voice, name. Every verse is sung in a different pilgrim's voice." },
      c_letter: { t: "The pardoner's licence is false", s: "Prior Arnaut", x: "The pardoner's letter of indulgence bears the seal of a bishop of Pamplona who died nine years ago. The prior keeps a copy of every seal in the diocese; this one is drawn freehand, very well." },
      c_charnel: { t: "Salt and the old charnel house", s: "Brother Íñigo", x: "The infirmarian says the old charnel house, Charlemagne's Silo, was salted when it was dug, so that nothing buried there could rise. Pilgrims who die on the pass still go there." }
    },
    npcs: {
      arnaut: N("Prior Arnaut", "Prior of the hospice · tired of miracles", "A big, slow man in a black habit, with ink on his fingers and the patience of someone who has fed four thousand pilgrims this year.", F(2, 5, "bald", 5, "none", { sex: "m" })),
      inigo: N("Brother Íñigo", "Infirmarian · young, frightened, careful", "Sleeves rolled to the elbow, a satchel of herbs, and the eleven bones wrapped in a cloth he will not unwrap again.", F(3, 1, "short", 5, "none", { sex: "m" })),
      maialen: N("Maialen", "Pilgrim from Bayonne · the only one who woke", "A fishwife with frost-bitten feet and a rosary she grips like a rope. She woke on the pass, alone, with her mouth still singing.", F(1, 3, "braids", 3, "headscarf", { sex: "f" })),
      tobiah: N("Tobiah of Nájera", "Pardoner · sells relics on the road", "A thin man in a green cloak covered in pilgrim badges, every one of them a different saint. His smile arrives a moment before the rest of his face.", F(2, 0, "long", 2, "hat", { sex: "m" }))
    },
    enemies: {
      walker: { build: { name: "Sleepwalking pilgrim", type: "Human", difficulty: "easy", sprite: "humanoid", hue: 210, dtype: "health", dies: "sits down in the snow and weeps, awake" } },
      hand: { build: { name: "The Reliquary Hand", type: "Construct", difficulty: "challenging", sprite: "construct", hue: 40, dtype: "stability", core: { body: 2, mind: 0, spirit: 3 }, mods: ["Occult", "Thick Skin"], dies: "comes apart into eleven small bones and a smell of candle wax" } }
    },
    encounters: {
      pass: { name: "The pass in the snow", theme: "snow", fightText: "The singing stops. Every pilgrim turns at once, and behind them, something gilded drags itself out of the drift on its fingers.", zones: [
        { id: "a", name: "The track", col: 0, row: 0 }, { id: "b", name: "The cairn", col: 1, row: 0 }, { id: "c", name: "The cross in the drift", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "walker", zone: "b" }, { t: "walker", zone: "b", name: "Sleepwalking pilgrim (2)" }, { t: "hand", zone: "c" }] }
    },
    start: "hospice",
    scenes: {
      hospice: { name: "The hospice refectory", theme: "church", mood: "calm", lighting: "shadow", weather: "fire", cast: ["arnaut"],
        onEnter: [{ once: "in", steps: [
          { say: "Stone walls a yard thick, a fire you could roast an ox in, and two long tables of pilgrims eating soup in silence. Wet wool steams on every bench. Outside, the wind comes down off the pass like a thing with a grievance." },
          { say: "Prior Arnaut meets you at the door himself, which priors don't. He looks at the black sun on your cloak for a long moment and then takes your hand in both of his." },
          { talk: { npc: "arnaut", text: "The Order. Thank God, and I mean it. Come into the warm. Eat first. You'll want to have eaten." } }] }],
        options: [
          { label: "Hear the prior", hint: "He has told the bishop; the bishop sent you", steps: [{ converse: { npc: "arnaut", id: "main",
            again: "Ask. I've answered worse questions this week.",
            topics: [
              { ask: "What happened?", lines: [
                "Three nights ago the dormitory bell rang at midnight. No one rang it. When Brother Íñigo went up, eleven beds were empty, and the door to the pass was open.",
                { say: "He wipes his hands on his habit, over and over." },
                "We found them at dawn on the track above the tree line. Standing in a ring in the snow, barefoot, singing. They didn't know us. When we led them down, they came like lambs, and the next night they went again."] },
              { ask: "Who are they?", lines: ["A cooper from Ghent. Two sisters from Tours. A knight who's walking for his brother's soul. A boy of fourteen. Farmers, merchants. They have nothing in common but the road.", "And Saint Ama. Each of them has her finger in a little pouch round the neck, and won't be parted from it."] },
              { ask: "Saint Ama?", lines: ["Exactly. I have kept the calendar of saints for thirty years. There is no Saint Ama. There is no shrine to her, no feast, no vita.", { say: "His mouth tightens." }, "A pardoner sold them her bones on the road from Saint-Jean. A shilling a finger. He said she was the saint of the pass, and that she would carry them over it."] },
              { ask: "What do you want us to do?", lines: ["Make them sleep. Make them pilgrims again and not… whatever she wants them to be.", "And if you find that pardoner, I want to speak to him before you do whatever the Order does."] }],
            bye: ["Brother Íñigo has them in the infirmary, tied to their beds, God forgive us. Go gently with him. He's young."] } }] },
          { label: "Study the pardoner's letter", hint: "The prior took one from a pilgrim", once: true, steps: [
            { check: { aspect: "iq", cr: "medium", label: "Read the seal and the hand", investigate: true,
              ok: [{ say: "The Latin is perfect and the seal is very fine. It is also the seal of Bishop Arnalt of Pamplona, who died in 1312. Someone has drawn it from memory, lovingly, with a brush." }, { clue: "c_letter" }],
              fail: [{ say: "It looks like an indulgence. The prior, gently, shows you the date of the bishop's death in his book." }, { clue: "c_letter" }] } }] },
          { label: "Go to the infirmary", steps: [{ goto: "infirmary" }] },
          { label: "Go out to the old charnel house", if: { clue: "c_charnel" }, steps: [{ goto: "silo" }] }] },
      infirmary: { name: "The infirmary", theme: "interior", mood: "dread", lighting: "shadow", cast: ["inigo", "maialen"],
        onEnter: [{ once: "in", steps: [
          { say: "Eleven beds in a long low room that smells of vinegar and tallow. Eleven pilgrims tied at the wrists with soft cloth, asleep, every one of them breathing in time with the others." },
          { say: "Their lips are moving. You lean close: they're humming, all on the same note, so quietly you can only hear it with your ear an inch from their mouths." },
          { talk: { npc: "inigo", text: "Don't wake them. When they wake they're worse. They look at you as if they're trying to remember which of them you are." } }] }],
        options: [
          { label: "Talk to Brother Íñigo", hint: "He's been sitting up with them for three nights", steps: [{ converse: { npc: "inigo", id: "main",
            topics: [
              { ask: "How are they?", lines: ["Cold. All of them, though the room is warm. Their feet are black from the snow and they don't feel it.", "And they're changing. The cooper had a beard on Sunday. He hasn't now. The two sisters had brown eyes and grey. Now all four are the same grey."] },
              { ask: "Where are the bones?", lines: [{ say: "He nods at a cloth bundle on the shelf over the door, as far from the beds as the room allows." }, "I took them off their necks while they slept. They screamed, all together, without waking. When I put the bundle by the door they stopped."] },
              { ask: "Is there anywhere a relic can be made safe?", lines: ["The old charnel house. Charlemagne's Silo, the pilgrims call it, though he never saw it. When the brothers dug it they lined it with salt from Salinas, so that nothing buried there could walk.", "No one's walked out of it yet."], then: [{ clue: "c_charnel" }] }],
            bye: ["If they go again tonight, I can't stop them. I've tried."] } }] },
          { label: "Lay the bones side by side", hint: "Unwrap the bundle on the table", once: true, steps: [
            { check: { aspect: "awareness", cr: "medium", label: "Compare the relics", investigate: true,
              ok: [{ say: "Eleven small brown finger bones. You lay them in a row and your stomach turns over: they are not alike, they are identical. The same nick at the knuckle. The same stain. The same crack, hair-fine, in the same place." }, { clue: "c_same" }, { objective: "po1" }],
              fail: [{ say: "You unwrap the cloth and every sleeper in the room sits up at once, eyes closed, and turns their face to you. It takes Íñigo and all of you to lay them back down. When you look at the bones again, you see it: they're all the same bone." }, { damage: { pool: "sanity", amount: 3 } }, { clue: "c_same" }, { objective: "po1" }] } }] },
          { label: "Speak to Maialen", hint: "The one who woke on the pass", steps: [{ converse: { npc: "maialen", id: "main",
            open: [{ say: "She is sitting up in the last bed, untied, wrapped in a blanket, her rosary wound round her fist." }, "You're the ones with the black sun. Good. I want to tell somebody who'll believe me."],
            topics: [
              { ask: "What happened on the pass?", lines: ["I was singing. I didn't know the words and I was singing them. We were in a ring, and in the middle of the ring was a woman made of all of us.", "My hands were her hands. I could feel the cold on her face. She was so happy, being made."] },
              { ask: "Why did you wake?", lines: [{ say: "She opens her fist. There's no pouch on her rosary, only a knot of broken cord." }, "My cord broke on the way up. The bone fell in the snow. I woke up standing in the drift with my mouth open."] },
              { ask: "Tell me about the hymn", lines: ["It's a list. Every verse she asks for something. Your eyes, so she can see the road. Your hands, so she can carry the cross. Your voice, so she can sing to God.", "The last verse asks for your name. We hadn't sung the last verse yet. I think tonight they will."], then: [{ clue: "c_hymn" }, { read: { cr: "medium", lying: false, ok: [{ say: "She isn't lying, and she isn't mad. She's terrified, and she's telling you so you'll be quick." }] } }] },
              { ask: "Who sold you the bone?", lines: ["A man in a green cloak at Saint-Jean, with badges all over him. Tobiah, he said. He had a sack of Ama's fingers, and a kind way of talking, and he didn't take my money until I'd prayed with him.", "He went up the pass ahead of us. I saw his lantern up by the shepherds' huts."], then: [{ set: "hut_known" }] }],
            bye: ["Don't let them sing the last verse."] } }] },
          { label: "Back to the refectory", steps: [{ goto: "hospice" }] },
          { label: "Climb to the shepherds' huts", if: "hut_known", steps: [{ goto: "hut" }] },
          { label: "Follow the singing up the pass", hint: "Tonight they'll go again", if: { clue: "c_hymn" }, steps: [{ goto: "pass" }] }] },
      hut: { name: "A shepherd's hut on the pass", theme: "snow", mood: "tense", weather: "wind", cast: ["tobiah"],
        onEnter: [{ once: "in", steps: [
          { say: "A beehive of dry stone half buried in the drift, a thread of smoke from the roof. Inside, a man in a green cloak sits by a small fire with a sack between his knees, counting." },
          { say: "Small brown finger bones, by the hundred. As you watch he takes one, holds it to the fire, and there are two." },
          { talk: { npc: "tobiah", text: "Pilgrims! No. Not pilgrims. Ah. Well. You'll want a pardon, I expect." } }] }],
        options: [
          { label: "Talk to the pardoner", steps: [{ converse: { npc: "tobiah", id: "main",
            topics: [
              { ask: "Where did you get the first bone?", lines: ["Saint-Jean, two years back. A woman died on the road, frozen, holding a little finger bone in her fist. She'd been praying to it the whole way. I took it. Who wouldn't?", "That night I put it in my sack with my bread, and in the morning I had two."] },
              { ask: "Who is Saint Ama?", lines: [{ say: "His smile slips, and for a moment there's nothing in the middle of his face." }, "She's who they pray to. There wasn't a saint of the pass, so I gave them one, and they prayed, and now there is. Isn't that what saints are?"] },
              { ask: "Do you know what she's doing to them?", lines: ["Carrying them. She said she'd carry them.", { say: "He looks at the sack. His hands won't stop counting." }, "She's nearly finished. She told me. When she's finished she'll walk to the end of the world, and I'll walk with her, and I'll be the man who found her."], then: [{ objective: "so1" }, { read: { cr: "challenging", lying: false, ok: [{ say: "He believes every word, and he's frightened of every word, and he can't stop. Something in the sack is counting for him." }] } }] }],
            bye: ["A shilling. Only a shilling. You'd be carried."] } }] },
          { label: "Decide what to do with Tobiah", if: { obj: "so1" }, once: true, steps: [
            { choice: { prompt: "He's a cheat and a thief and he has started something he can't stop. He's also the only man who's heard her speak.", options: [
              { label: "Take him down to the prior, in chains", steps: [{ say: "He comes without a fight, still counting under his breath. The sack you leave in the fire; it burns with a smell of candle wax for a long time." }, { arcSet: "tobiah_taken" }] },
              { label: "Take the sack and let him run", steps: [{ say: "He's gone into the dark before you've finished saying it, down the far side of the pass toward Spain. You hear him laughing, or crying, a long way off." }] }] } }] },
          { label: "Go down to the infirmary", steps: [{ goto: "infirmary" }] }] },
      pass: { name: "The pass at midnight", theme: "snow", mood: "boss", lighting: "dark", weather: "wind",
        onEnter: [{ once: "in", steps: [
          { say: "The bell rings at midnight. You're ready, and still you're not ready: eleven pilgrims walk out of the infirmary through a door you barred, past you, into the snow, singing." },
          { say: "You follow them up the track to the cairn where Roland's men are meant to have died. They make a ring. In the middle of the ring the snow is moving, and the hymn reaches its last verse." }] }],
        options: [
          { label: "Break the ring and fight what's in it", steps: [{ combat: "pass", win: [
            { say: "The gilded hand comes apart into small bones in the snow, and the pilgrims fall where they stand, and wake, crying with the cold, asking where they are." },
            { goto: "silo" }] }] },
          { label: "Sing them back down", hint: "Everyone sings a hymn they do know, louder", once: true, steps: [
            { group: { aspect: "faith", cr: "challenging", label: "Drown out the last verse", intro: "Start a hymn the pilgrims learned as children. Make them hear it.",
              ok: [{ say: "Your voices go up over theirs, ragged and certain. One by one the pilgrims falter, and listen, and sing with you. The moving snow goes still. A gilded hand lies in it, small and dead." }, { goto: "silo" }],
              fail: [{ say: "Your hymn breaks on the cold. The last verse goes on without you, and something gilded rises out of the drift on its fingers." }, { damage: { pool: "stability", amount: 3 } }, { combat: "pass", surprise: false, win: [{ say: "The pilgrims fall where they stand, and wake." }, { goto: "silo" }] }] } }] }] },
      silo: { name: "Charlemagne's Silo, the charnel house", theme: "cellar", mood: "dread", lighting: "shadow",
        onEnter: [{ once: "in", steps: [
          { say: "A squat stone barn with a vault beneath it, and in the vault the bones of eight hundred years of pilgrims, laid in salt. The air tastes of it. Nothing here has ever stood up." }] }],
        options: [
          { label: "Bury the bones in the salt", hint: "All of them", once: true, steps: [
            { say: "You lay the finger bones in the salt one by one. Each one is warm. Each one, as the salt closes over it, gives a very small sigh." },
            { choice: { prompt: "One bone left in your hand. The Order might want it, sealed, to know what made it. Or it might want the rest of them back.", options: [
              { label: "Seal it in lead and keep it", steps: [{ say: "You wrap it in lead and wax and the prior's stole. Even so, you can feel it through the lead: a slow, patient warmth, like a hand held in yours." }, { arcSet: "kept_bone" }] },
              { label: "Bury it with the rest", steps: [{ say: "The salt takes it. Nothing sighs." }] }] } },
            { objective: "po2" },
            { say: "That night the pilgrims sleep. At dawn they eat their soup and go over the pass into Spain, and you hear one of them singing, a hymn you all know, badly, all the way up the track." },
            { if: { not: { arc: "tobiah_taken" } }, then: [{ say: "Somewhere on the other side of the mountains a man in a green cloak is counting." }] },
            { end: "win" }] }] }
    }
  };

  /* ---------------------------------------------------------------- part 2 · 1322 · Burgos */
  const part2 = {
    id: "pr-2-quarry", title: "The Pilgrim Road II: The Quarry Saint", setting: "Burgos, Castile · 1322", year: 1322, level: [2, 4], agencies: ["OID"],
    summary: "Burgos is building a cathedral to make Paris jealous. The new statue of Saint Ama over the pilgrims' door has a face no mason carved, and the quarrymen who cut its stone have started to forget their own names.",
    objectives: [
      { id: "po1", kind: "primary", t: "Find out where the saint's face came from", done: "From the quarry: the stone at Hontoria has a saint growing in it, and the masons only cut away what isn't her." },
      { id: "po2", kind: "primary", t: "Stop the carving", done: "The statue's face is broken off and the quarry gallery is sealed with salt and chain." },
      { id: "so1", kind: "secondary", t: "Save the quarrymen's names", done: "The quarrymen say their names out loud at the chapter house door, and remember their children's." }],
    clues: {
      c_face: { t: "The statue's face is new every morning", s: "The pilgrims' door", x: "The canons swear the saint's face changes overnight: a different nose one day, a different mouth the next. Each is the face of a pilgrim who prayed under it the evening before." },
      c_names: { t: "The quarrymen are forgetting", s: "The quarrymen's tavern", x: "Six men from the Hontoria quarry cannot remember their own names. They remember the saint's: every one of them can sing her litany, though none of them can read." },
      c_vein: { t: "A seam of white in the stone", s: "The masons' lodge", x: "The stone for the statue came from one seam at Hontoria, white and warm, that the quarrymen call the Saint's Vein. Cut a block from it and by morning the face is roughed out on it already." },
      c_tobiah: { t: "The pardoner's road", s: "The relic fair", x: "A pardoner in a green cloak has been selling bones of Saint Ama at the relic fair, and before that at Logroño and Nájera. He leaves the city on the road west, toward the end of the world." }
    },
    npcs: {
      master: N("Master Enrique", "Master mason of the cathedral", "Grey dust in every line of his face, plans under his arm, and the stubborn pride of a man who has given twenty years to one building.", F(2, 5, "short", 6, "cap", { sex: "m" })),
      urraca: N("Urraca", "Tavern keeper · quarrymen's widow", "Big arms, small patience, and a slate behind the bar with six names chalked on it that she reads out every night to the men who own them.", F(3, 1, "bun", 1, "headscarf", { sex: "f" })),
      canon: N("Canon Domingo", "Keeper of the relics", "Thin, clean and furious, with the cathedral's relic book chained to his wrist.", F(1, 5, "parted", 5, "none", { sex: "m" }))
    },
    enemies: {
      quarryman: { build: { name: "Nameless quarryman", type: "Human", difficulty: "easy", sprite: "humanoid", hue: 30, dtype: "health", dies: "drops his maul and says his own name, surprised" } },
      saint: { build: { name: "The Quarry Saint", type: "Golem", difficulty: "challenging", sprite: "construct", hue: 50, dtype: "stability", core: { body: 3, mind: 1, spirit: 3 }, mods: ["Occult", "Tanky"], dies: "cracks down the middle, and the faces fall out of her like plates" } }
    },
    encounters: {
      gallery: { name: "The quarry gallery", theme: "cave", fightText: "The white seam in the wall opens its eyes. The quarrymen lift their mauls and turn to you with her face.", zones: [
        { id: "a", name: "The adit", col: 0, row: 0 }, { id: "b", name: "The cutting floor", col: 1, row: 0 }, { id: "c", name: "The Saint's Vein", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "quarryman", zone: "b" }, { t: "quarryman", zone: "b", name: "Nameless quarryman (2)" }, { t: "saint", zone: "c" }] }
    },
    start: "door",
    scenes: {
      door: { name: "The pilgrims' door of the cathedral", theme: "church", mood: "calm", cast: ["canon"],
        onEnter: [{ once: "in", steps: [
          { say: "Scaffolding to the sky, the ring of a hundred chisels, and in the middle of it all, finished and painted and gilded, the pilgrims' door with its carved saints: Peter, James, and over the lintel, a new one. Saint Ama of the Pass, arms open, carrying a cross." },
          { say: "Pilgrims kneel under her by the dozen. Her face is beautiful. It takes you a moment to understand why it bothers you: it is the face of the woman kneeling nearest the door." },
          { if: { arc: "kept_bone" }, then: [{ say: "Under your cloak, in its lead and wax, the bone from Roncesvalles is warm. It's warmer here. It's pleased." }] }] }],
        options: [
          { label: "Talk to Canon Domingo", steps: [{ converse: { npc: "canon", id: "main",
            topics: [
              { ask: "Who carved Saint Ama?", lines: ["Master Enrique's lodge. The chapter didn't commission her. She was simply there one morning on the bench, finished, and the masons said they'd carved her, and couldn't say when.", "The chapter was going to break her up. Then the pilgrims came. Do you know what pilgrims bring a cathedral? Coin, and coin, and a good name."] },
              { ask: "The face", lines: [{ say: "He doesn't look up at her." }, "It changes. Every morning. The sacristan says she wears the face of whoever prayed longest under her the night before.", "The sacristan prayed under her on Tuesday. On Wednesday she had his face, and he couldn't remember his mother's name."], then: [{ clue: "c_face" }] },
              { ask: "Anything else strange?", lines: ["A pardoner at the relic fair selling her bones. I had him thrown out of the cloister. He laughed and said she didn't need my cloister any more."], then: [{ set: "fair_known" }] }],
            bye: ["If you break her, do it at night. The pilgrims would tear you to pieces."] } }] },
          { label: "Pray under the saint, and watch", hint: "Someone has to, to see what she does", once: true, steps: [
            { check: { aspect: "morality", cr: "challenging", label: "Keep your own face", investigate: true,
              ok: [{ say: "You kneel and pray and hold on to your own name with both hands. Overhead, very slowly, the stone face turns toward you, tries your features on like a glove, and fails. She goes back to the woman by the door." }, { clue: "c_face" }],
              fail: [{ say: "You kneel. You pray. When you stand you can't for a moment remember what your mother called you, and the saint over the door has your mouth." }, { damage: { pool: "stability", amount: 4 } }, { clue: "c_face" }] } }] },
          { label: "Visit the masons' lodge", steps: [{ goto: "lodge" }] },
          { label: "Walk through the relic fair", if: "fair_known", steps: [{ goto: "fair" }] },
          { label: "Find the quarrymen's tavern", steps: [{ goto: "tavern" }] }] },
      lodge: { name: "The masons' lodge", theme: "interior", mood: "tense", weather: "fire", cast: ["master"],
        onEnter: [{ once: "in", steps: [
          { say: "A long timber shed full of dust and light and the smell of wet stone. Blocks on trestles, chalk drawings on the walls, apprentices asleep on sacks. At the far end, under a sheet, something the size of a man." },
          { talk: { npc: "master", text: "No visitors in the lodge. That's the rule, and you can tell the bishop so. …Order of Infinite Dark. Ah. Then you'd better see what's under the sheet." } }] }],
        options: [
          { label: "Talk to Master Enrique", steps: [{ converse: { npc: "master", id: "main",
            topics: [
              { ask: "What's under the sheet?", lines: [{ say: "He pulls it away. A block of white stone, rough-cut, and in it, waiting, the first shape of a woman with her arms open." }, "Cut from the Hontoria seam on Monday. Nobody's touched it with a chisel. She's coming out of it by herself. The masons only help."] },
              { ask: "Where does the stone come from?", lines: ["Hontoria de la Cantera, two hours on a cart. The best white stone in Castile. And one seam in the deep gallery that the men call the Saint's Vein, warm as bread when you cut it."], then: [{ clue: "c_vein" }, { objective: "po1" }] },
              { ask: "Will you stop cutting it?", lines: ["The chapter wants a second saint for the north door. They pay my men. My men eat.", { say: "He looks at the shape in the stone for a long time." }, "Give me a reason I can tell the chapter, and I'll stop."] }],
            bye: ["Go to Hontoria if you must. Take lamps. Take more lamps than that."] } }] },
          { label: "Persuade the master to stop", if: { clue: "c_vein" }, once: true, steps: [
            { check: { aspect: "charisma", cr: "challenging", label: "Give him a reason he can live with",
              ok: [{ say: "He hears you out. Then he takes a maul from the wall and, without a word, breaks the white block in two. Nothing bleeds. Nearly nothing. 'The lodge cuts no more from that seam,' he says. 'Tell the chapter it's cracked.'" }, { arcSet: "mason_warned" }],
              fail: [{ say: "'Saints and stones,' he says. 'I've heard it from better men.' He pulls the sheet back over her. You can see the shape of her face through it." }] } }] },
          { label: "Back to the cathedral", steps: [{ goto: "door" }] },
          { label: "Ride out to the quarry at Hontoria", if: { clue: "c_vein" }, steps: [{ goto: "quarry" }] }] },
      tavern: { name: "The Sign of the Wedge, quarrymen's tavern", theme: "village", mood: "calm", weather: "fire", cast: ["urraca"],
        onEnter: [{ once: "in", steps: [
          { say: "Low beams, sawdust, wine in leather jacks. Six quarrymen sit together at one table, not drinking, their hands folded. They are singing, softly, in harmony, a litany to Saint Ama." },
          { talk: { npc: "urraca", text: "Don't mind them. Or do. You're the first who's looked at them all week like they were worth looking at." } }] }],
        options: [
          { label: "Talk to Urraca", steps: [{ converse: { npc: "urraca", id: "main",
            topics: [
              { ask: "What's wrong with them?", lines: ["They came up from the deep gallery a fortnight ago with white dust in their hair and no names. Pedro. Sancho. Miguel. Gil. Lope. My Diego.", { say: "She nods at the slate behind the bar." }, "I read their names to them every night. Every night it takes longer for them to say them back."], then: [{ clue: "c_names" }] },
              { ask: "Your Diego?", lines: ["My husband. Twenty-two years. He looked at me on Sunday and asked me whose wife I was.", "He knows the saint's name. He knows her whole litany. He can't read and he sings it like a canon."] }],
            bye: ["If you go down that gallery, bring them back their names. Or bring them back. I'll take either."] } }] },
          { label: "Read the names to the quarrymen, together", hint: "Everyone holds a man's hands and says his name until he says it back", once: true, steps: [
            { group: { aspect: "charisma", cr: "medium", label: "Give them back their names", intro: "Urraca reads from the slate. You each take a man and won't let go.",
              ok: [{ say: "It takes an hour. Then Diego says 'Diego,' and looks at Urraca, and says hers, and she sits down on the floor. One after another the others follow." }, { objective: "so1" }],
              fail: [{ say: "They smile at you kindly, the way the saint smiles, and go on singing. Two of them say their names, and lose them again by morning." }, { damage: { pool: "sanity", amount: 2 } }] } }] },
          { label: "Back to the cathedral", steps: [{ goto: "door" }] }] },
      fair: { name: "The relic fair in the cloister", theme: "village", mood: "tense",
        onEnter: [{ once: "in", steps: [
          { say: "Booths along the cloister walk: saints' teeth, splinters of the Cross, phials of the Virgin's milk, all at reasonable prices. Pilgrims haggle. A dog runs off with a holy finger." },
          { say: "The booth where the pardoner stood is empty. Someone has drawn a small cross in the dust, and an arrow, pointing west." }] }],
        options: [
          { label: "Ask after the pardoner", once: true, steps: [
            { check: { aspect: "charisma", cr: "easy", label: "Loosen a relic-seller's tongue",
              ok: [{ say: "'Tobiah? Gone west on the Compostela road, three days back, with a cartload of bones and a madman's smile. Said he was walking to the end of the world to meet his lady.'" }, { clue: "c_tobiah" }],
              fail: [{ say: "Nobody wants to talk about him. They talk anyway, when you're leaving: west, three days ago, toward the end of the world." }, { clue: "c_tobiah" }] } },
            { if: { arc: "tobiah_taken" }, then: [{ say: "Taken. Tied to a cart, under guard, sent to the prior of Roncesvalles. You saw to it. And still he's here, selling bones, laughing. Either the prior let him go, or there are two of him now." }] }] },
          { label: "Back to the cathedral", steps: [{ goto: "door" }] }] },
      quarry: { name: "The quarry at Hontoria", theme: "cave", mood: "dread", lighting: "dark",
        onEnter: [{ once: "in", steps: [
          { say: "White cliffs, white dust, white light that hurts. The open quarry gives onto a gallery driven into the hill, and the gallery goes down, and down, and somewhere down it a chisel is ringing with nobody holding it." },
          { if: { arc: "mason_warned" }, then: [{ say: "Master Enrique has sent two of his best men with you, and chain, and three sacks of salt from the lodge kitchen." }] }] }],
        options: [
          { label: "Go down to the Saint's Vein", steps: [{ combat: "gallery", surpriseIf: "mason_warned", win: [
            { say: "The Quarry Saint cracks in two, and the faces fall out of her like plates off a shelf: the sacristan's, the woman's from the door, a hundred pilgrims'. Each shatters on the floor and is only stone." },
            { if: { arc: "mason_warned" }, then: [{ say: "Enrique's men salt the seam and chain the gallery shut." }] },
            { objective: "po2" },
            { choice: { prompt: "On the floor of the gallery, among the chips, a pilgrim's chart drawn in charcoal: the coast road west, and a cliff path marked with a cross, at Finisterre.", options: [
              { label: "Take the chart", steps: [{ say: "You fold it into your jerkin. It's the way the saint wanted to walk. You'll get there first." }, { arcSet: "chart_taken" }] },
              { label: "Burn it with the rest", steps: [{ say: "It goes up in a quick bright flame. Whatever it showed, you'll have to find it the hard way." }] }] } },
            { say: "Over the pilgrims' door in Burgos the next morning, Saint Ama has no face at all, only smooth stone. The canons cover her with a cloth. West, on the road to the end of the world, a cartload of bones goes on without her." },
            { end: "win" }] }] },
          { label: "Back to Burgos", steps: [{ goto: "door" }] }] }
    }
  };

  /* ---------------------------------------------------------------- part 3 · 1323 · Finisterre */
  const part3 = {
    id: "pr-3-finisterre", title: "The Pilgrim Road III: The End of the World", setting: "Finisterre, Galicia · 1323", year: 1323, level: [3, 5], agencies: ["OID"],
    summary: "At Finisterre, where the pilgrims burn their clothes and the world runs out, a woman made of a thousand pilgrims is walking up out of the sea fog. Tobiah walks beside her. If she reaches the cross on the cape she will be finished, and she will walk home with every pilgrim on the road.",
    objectives: [
      { id: "po1", kind: "primary", t: "Reach the cape before she does", done: "You are at the cross on the cape when the fog comes in." },
      { id: "po2", kind: "primary", t: "Unmake Saint Ama", done: "The woman made of pilgrims comes apart on the cape, and a thousand people across Christendom wake up remembering their own names." },
      { id: "so1", kind: "secondary", t: "Deal with Tobiah", done: "The pardoner is stopped, one way or another." }],
    clues: {
      c_fires: { t: "The fires on the cape", s: "The fishermen", x: "Pilgrims who reach Finisterre burn their old clothes on the rocks below the cross. This week the fires light themselves, and the smoke goes up the cliff in the shape of a woman walking." },
      c_litany: { t: "The last verse of the litany", s: "Brother Martiño", x: "Martiño has written down the whole litany from the pilgrims who sing it in their sleep. The last verse asks for a name. Whoever answers it with their own name gives it; whoever answers with hers takes her apart." },
      c_bone: { t: "The first bone", s: "The Order's reliquary", x: "The bone sealed in lead at Roncesvalles is the copy nearest the first: a woman who died on the road at Saint-Jean, praying to the bone in her fist. The saint was made from her prayer. Give the bone back to the sea and the prayer is answered." }
    },
    npcs: {
      martino: N("Brother Martiño", "Hermit of San Guillerme", "Barefoot, sunburnt, laughing at nothing, with a wax tablet covered on both sides in small careful writing.", F(4, 2, "bald", 6, "hood", { sex: "m" })),
      carme: N("Carme", "Fisherwoman · lights the beacon", "Salt-cracked hands, a red shawl, and a boat she won't take out while the fog is on the water.", F(3, 0, "long", 7, "headscarf", { sex: "f" })),
      tobiah: N("Tobiah of Nájera", "Pardoner · the saint's companion", "The green cloak is grey with salt now, and every badge on it has her face.", F(2, 0, "long", 2, "hat", { sex: "m" }))
    },
    enemies: {
      pilgrim: { build: { name: "Fog pilgrim", type: "Spirit", difficulty: "easy", sprite: "spirit", hue: 200, dtype: "sanity", dies: "thins into fog with someone's name on its lips" } },
      ama: { build: { name: "Saint Ama of the Pass", type: "Beyond", difficulty: "dangerous", sprite: "beyond", hue: 45, dtype: "stability", core: { body: 2, mind: 3, spirit: 4 }, mods: ["Unshakable Faith", "Occult", "Leader"], dies: "comes apart into a thousand pilgrims' voices, each saying its own name, and is gone" } }
    },
    encounters: {
      cape: { name: "The cape at Finisterre", theme: "sea", fightText: "She comes up the last of the cliff out of the fog: a woman made of everyone who ever prayed to her, arms open, carrying a cross of driftwood. The fog pilgrims kneel. She smiles with a thousand mouths.", zones: [
        { id: "a", name: "The cliff path", col: 0, row: 0 }, { id: "b", name: "The burning rocks", col: 1, row: 0 }, { id: "c", name: "The cross on the cape", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "c", foes: [{ t: "pilgrim", zone: "b" }, { t: "pilgrim", zone: "b", name: "Fog pilgrim (2)" }, { t: "pilgrim", zone: "a", name: "Fog pilgrim (3)" }, { t: "ama", zone: "a" }] }
    },
    start: "village",
    scenes: {
      village: { name: "Finisterre harbour", theme: "sea", mood: "tense", weather: "sea", cast: ["carme"],
        onEnter: [{ once: "in", steps: [
          { say: "Grey stone houses, grey water, boats drawn up on grey sand. Fog lies on the sea a mile out like a wall, and it hasn't moved in four days. The fishermen won't go out. The pilgrims who came to the end of the world are all asleep in the church, smiling." },
          { talk: { npc: "carme", text: "You came the long way. Everybody comes the long way, here. Did you see her on the road?" } }] }],
        options: [
          { label: "Talk to Carme", steps: [{ converse: { npc: "carme", id: "main",
            topics: [
              { ask: "Her?", lines: ["The woman in the fog. Four nights she's been walking up out of the sea toward the cape. Every night she gets a little further. Every night another pilgrim lies down in the church and doesn't get up.", "And a man walks beside her with a lantern. Green cloak. He waves."] },
              { ask: "The fires", lines: ["Pilgrims burn their clothes on the rocks under the cross. It's the custom. The end of the road, a new life.", "This week the fires light themselves at dusk. The smoke goes up the cliff in a shape. You'll see."], then: [{ clue: "c_fires" }] },
              { ask: "Is there a fast way to the cape?", lines: ["The road's two hours round by the hermitage. There's a path up the cliff from the cove, but you'd need to know it, and nobody's taken it since my grandfather."] }],
            bye: ["I'll light the beacon tonight. If you see it go out, run."] } }] },
          { label: "Climb to the hermitage", steps: [{ goto: "hermitage" }] },
          { label: "Take the cliff path from the cove", hint: "The chart from the quarry marks it", if: { arc: "chart_taken" }, steps: [
            { say: "The chart is right to a stone. It's a terrible path, hand over hand up a cliff of wet granite, the sea booming below, and it brings you out on the cape an hour before dusk, with the cross above you and the fires not yet lit." },
            { set: "early" }, { objective: "po1" }, { goto: "cape" }] },
          { label: "Take the road to the cape", if: { clue: "c_litany" }, steps: [
            { say: "Two hours on foot by the long road, round the headland, the fog coming in beside you the whole way. You reach the cross as the fires light themselves." },
            { objective: "po1" }, { goto: "cape" }] }] },
      hermitage: { name: "The hermitage of San Guillerme", theme: "church", mood: "calm", weather: "wind", cast: ["martino"],
        onEnter: [{ once: "in", steps: [
          { say: "A stone hut on the shoulder of the headland with a bed carved into the rock, where barren wives come to lie and pray. The wind never stops. Brother Martiño is sitting in the doorway, writing on a wax tablet, laughing." },
          { talk: { npc: "martino", text: "The Order! At the end of the world! Sit, sit. I've been writing her down. Someone ought to." } }] }],
        options: [
          { label: "Talk to Brother Martiño", steps: [{ converse: { npc: "martino", id: "main",
            topics: [
              { ask: "What are you writing?", lines: ["Her litany. The sleepers in the church sing it, all of them, all night. I've got every verse now.", { say: "He turns the tablet to you. Small, clear letters, both sides." }, "Eyes, hands, voice, heart, breath, and the last verse: <i>give me your name</i>. That's the one they haven't sung yet. Tonight they will."] },
              { ask: "Can she be stopped?", lines: ["Oh, certainly. She's a prayer. A prayer is a question. You stop a question by answering it.", "When she asks for a name, don't give her yours. Give her hers. Every name she's made of, one after another, until there's no saint left over."], then: [{ clue: "c_litany" }] },
              { ask: "Where did she come from?", if: { arc: "kept_bone" }, lines: ["You've got something in lead under your cloak that's been humming since you came up the hill. Let me see it."], then: [{ say: "He holds the sealed bone a long time, eyes closed. 'A woman,' he says. 'Frozen on the road at Saint-Jean, two winters ago. She prayed for someone to carry her over the pass. Nobody came. The Beyond heard her.'" }, { clue: "c_bone" }] }],
            bye: ["Go and stand at the cross. And answer her. It's only polite."] } }] },
          { label: "Back to the harbour", steps: [{ goto: "village" }] }] },
      cape: { name: "The cross on the cape", theme: "sea", mood: "boss", lighting: "dark", weather: "storm", cast: [],
        onEnter: [{ once: "in", steps: [
          { say: "The cross stands on the last rock of the world, black against a sky the colour of pewter. Below it the pilgrims' fires burn on the rocks, and the smoke goes up the cliff path in the shape of a woman walking." },
          { say: "Out of the fog, at the bottom of the path, a lantern. A man in a grey-green cloak, waving. Behind him, taller than the cross, she comes." },
          { if: "early", then: [{ say: "You've had an hour to ready yourselves. The cross is at your back and the path is narrow, and she has to come up it to you." }] }] }],
        options: [
          { label: "Call to Tobiah", hint: "He's on the path ahead of her", once: true, steps: [
            { if: { arc: "tobiah_taken" }, then: [
              { say: "'You,' he shouts up, delighted. 'You put me in chains! The prior was so kind. She came for me in the night, and the chains were only ever iron.' He looks at you with real love. 'Come down. She'll carry you too.'" }],
              else: [{ say: "'Pilgrims!' he calls up, and waves the lantern. 'I told you I'd meet you at the end. Come down! She's nearly finished!'" }] },
            { check: { aspect: "charisma", cr: "challenging", label: "Make him look at what's walking behind him",
              ok: [{ say: "He turns, and looks up at her, properly, for the first time in two years. He sees his own face in her, among the thousand. He drops the lantern. 'Oh,' he says. 'Oh, I'm in her.' He sits down on the path and doesn't get up." }, { objective: "so1" }, { set: "tobiah_down" }],
              fail: [{ say: "He laughs and turns back to her and she gathers him up in her arms like a child, and he's in her, his face one among the thousand, smiling." }, { damage: { pool: "sanity", amount: 3 } }, { objective: "so1" }] } }] },
          { label: "Answer the litany with her names", hint: "Every name she's made of, before she asks for yours", if: { clue: "c_litany" }, once: true, steps: [
            { group: { aspect: "willpower", cr: "challenging", label: "Answer the last verse with her names", intro: "She asks: give me your name. You give her the cooper from Ghent, the sisters from Tours, Diego, the sacristan, the woman at the door. You give her all of them.",
              ok: [{ say: "With every name a face goes out of her like a candle. She shrinks. She falters on the path. She is only a few hundred pilgrims tall, then a few dozen, then one woman, frozen, praying." }, { set: "unmade" }],
              fail: [{ say: "Somebody's voice cracks and gives her the wrong name: their own. She takes it gratefully. You feel it go." }, { damage: { pool: "stability", amount: 5 } }] } }] },
          { label: "Give the first bone back to the sea", hint: "Answer the prayer it was made from", if: { all: [{ arc: "kept_bone" }, { clue: "c_bone" }] }, once: true, steps: [
            { say: "You break the lead, and the wax, and hold the warm small bone up in the wind. 'You're carried,' you tell it. 'You're over the pass. You can stop.' Then you throw it as far as you can, out past the fires, into the sea." },
            { say: "On the path below, the saint stops walking. For a moment she looks down at her own hands as if they're someone else's, and they are." },
            { set: "answered" }] },
          { label: "Stand at the cross and fight", steps: [{ combat: "cape", surpriseIf: "early", win: [
            { say: "She comes apart on the path below the cross into a thousand voices, each one saying its own name, very surprised, and then into fog, and then into nothing." },
            { objective: "po2" },
            { if: "answered", then: [{ say: "Out on the water, where you threw the bone, the fog lifts all at once, and the sun comes down on the sea at the end of the world." }] },
            { if: { all: [{ arc: "kept_bone" }, { arc: "mason_warned" }, "unmade"] }, then: [{ say: "In the church at Finisterre the sleeping pilgrims wake and ask for breakfast. In Burgos, Master Enrique's men take down the faceless saint and grind her into mortar for the cloister. At Roncesvalles the bell hangs quiet. The road is only a road again." }],
              else: [{ say: "Most of the sleeping pilgrims wake. A few never do, and lie smiling in the church with someone else's face. The road is only a road again, nearly." }] },
            { if: "tobiah_down", then: [{ say: "Tobiah of Nájera is still sitting on the path when you come down, looking at his hands. He goes back over the mountains to Saint-Jean, they say, and digs a proper grave for a woman nobody knew, and stays there." }] },
            { end: "win" }] }] }] }
    }
  };

  window.PACKS.define({
    format: "beyond-pack", id: "pilgrim-road", name: "The Pilgrim Road", version: "1", author: "Gage Lee", builtIn: true,
    description: "A three-part arc for the Order of Infinite Dark, 1321 to 1323. A pardoner sells bones of a saint nobody has heard of, and every bone is the same bone.",
    cases: [part1, part2, part3],
    arcs: [{ id: "pilgrim-road", title: "The Pilgrim Road", agencies: ["OID"], villain: "Saint Ama of the Pass, and Tobiah of Nájera", parts: [part1.id, part2.id, part3.id],
      summary: "Three cases on the road to Santiago, from the bone-house at Roncesvalles to the end of the world. Keep a bone, spare a man, stop a mason: it all comes back on the cape." }]
  });
})();
