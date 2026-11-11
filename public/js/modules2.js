/* ============================================================================
   REBUILT CASES, BATCH ONE. Each is written to the Death of a Bloodline floor:
   real investigation (places to search, people to interview, clues that add up),
   an enemy with its own rules, secondary objectives that are earned and pay off,
   several ways to solve it, and endings that depend on how it went.
   ========================================================================== */
(function () {
  const ADV = window.ADV, K = window.CASEKIT, F = K.face, N = K.person;

  /* ======================================================================= 1187 · The Bell of Saint-Rémy */
  ADV.register({
    id: "bell-of-saint-remy", title: "The Bell of Saint-Rémy", setting: "Burgundy, France · 1187", year: 1187, level: [1, 9], agencies: ["OID"], region: "europe", theme: "village",
    summary: "Every night at the third watch a new bell tolls over a monastery village, and everyone who hears it rises from bed and walks to the chapel, singing a verse. Eleven are in the chapel now. The hymn has twelve.",
    objectives: [
      { id: "po1", kind: "primary", t: "Learn what the bell is, and who sings in it", done: "The bell was recast in autumn with the silver of a drowned chorister's reliquary. Brother Jean sings in it, and he needs twelve voices to finish a hymn he drowned before he could end." },
      { id: "po2", kind: "primary", t: "End the tolling and wake the sleepers", done: "The sleepers wake at dawn, hoarse and unharmed, and none of them remember the walk." },
      { id: "so1", kind: "secondary", t: "Find Brother Jean's bones", done: "The founder never melted them: they are in a sack in his yard, wrapped in an old cassock.", benefit: { label: "Jean's bones", text: "You can return him to the river. A bonus on every roll to release him, and the Cantor falters when it sees them.", bonus: { tags: ["release"], value: 2 }, flag: "have_bones" } },
      { id: "so2", kind: "secondary", t: "Learn what the shepherd girl knows about the sound", done: "Mathilde plugged her ears with wax the night her mother stopped speaking. The note only reaches those who hear it.", benefit: { label: "Candle wax in the ears", text: "Wax keeps the bell's note out. Your rolls against its compulsion are far easier, and you may muffle the clapper.", bonus: { tags: ["bell"], value: 4 }, flag: "have_wax" } },
      { id: "so3", kind: "secondary", t: "Hear the abbot's confession", done: "Abbot Anselm gave the silver reliquary to the founder himself, to save the cost of new bronze.", benefit: { label: "A confession, heard", text: "A bonus on every roll to release the Cantor: what he was owed has finally been said aloud.", bonus: { tags: ["release", "sing"], value: 2 }, flag: "confessed" } }
    ],
    clues: {
      c_sleep: { t: "They walk toward the chapel", s: "The village", x: "Every villager stands in a doorway at the third watch, eyes open, facing the abbey. They do not answer. By dawn they are back in bed with muddy feet." },
      c_wax: { t: "Wax keeps the sound out", s: "Mathilde", x: "Mathilde plugged her ears with candle wax after her mother stopped speaking. Only the bell's note reaches the sleepers." },
      c_recast: { t: "The bell was recast in autumn", s: "The abbey ledger", x: "The old bell cracked in the August frost. The abbot paid a founder from Auxerre to recast it, and supplied silver of his own: a reliquary from the crypt." },
      c_novice: { t: "A drowned chorister", s: "The crypt", x: "Brother Jean, a chorister of nineteen, drowned at the ford fifty years ago on the night he was to sing the Vigil. His niche in the crypt is empty." },
      c_hymn: { t: "The hymn has twelve verses", s: "The chapel", x: "The sleepers sing one verse each, and they are always the same eleven. The twelfth verse has no words written for it at all." },
      c_foundry: { t: "The founder kept what he did not melt", s: "Gervais the founder", x: "Gervais melted the silver casket, but the bones inside were in his way. He sacked them and put them behind the furnace, and he has not slept well since." },
      c_ford: { t: "Where he drowned", s: "The river ford", x: "The river below the abbey bends into a still pool at the ford. On the night of the Vigil, the water there goes quiet, and from under it you can hear a boy's voice, almost out of breath." },
      c_clapper: { t: "The clapper is hung wrong", s: "The belfry", x: "The clapper is hung by a silver chain, and it swings by itself, a little behind the note. Whatever rings the bell is in the metal, not on the rope." }
    },
    npcs: {
      anselm: N("Abbot Anselm", "Abbot of Saint-Rémy", "Gaunt, grey, and awake only by force of will. He has not slept in six nights, and has the grey look of a man hearing a sound no one else will tell him is there.", F(0, 4, "bald", 5, "none", { sex: "m" })),
      mathilde: N("Mathilde", "Shepherd girl · 13", "Barefoot, hair tied in a rag, a plug of wax in each ear. She watches you, not trusting adults.", F(1, 2, "braids", 1, "headscarf", { sex: "f" })),
      odo: N("Brother Odo", "Bell-ringer · sleepwalking", "Hands on the rope. His eyes are open and his mouth moves with a hymn that has no words.", F(1, 1, "short", 5, "none", { sex: "m" })),
      gervais: N("Gervais of Auxerre", "Bell founder · returned to the abbey", "A thick, soot-black man in a leather apron, who flinches when he looks up at the belfry and is sure he has seen your face before.", F(2, 5, "short", 6, "none", { sex: "m" }))
    },
    enemies: {
      cantor: { build: { name: "The Cantor", type: "Spirit", difficulty: "challenging", sprite: "spirit", hue: 200, dtype: "stability", range: 1, core: { body: 0, mind: 3, spirit: 3 }, mods: ["Occult"],
        text: "Brother Jean, in the bell. He needs twelve voices. Verse: each round the Cantor sings one more verse; any agent with no wax in the ears takes 2 Sanity and cannot move away from the chapel. Only Stability harms him. He falters when he sees his bones, and goes quiet when the abbot's debt is spoken.", dies: "the bell cracks along its length, and a boy's voice, finally, finishes the verse" } },
      sleeper: { build: { name: "Sleepwalking villager", type: "Human", difficulty: "easy", sprite: "humanoid", hue: 210, attack: 0, dtype: "health", dies: "sits down where they stand, eyes closing, breathing quietly" } }
    },
    encounters: {
      belfry: { name: "The belfry at the third watch", theme: "church", lit: false, fightText: "The bell swings without a rope, and the note goes out over the roofs. In the chapel below, eleven voices catch it. At the top of the stair, something like a boy in a wet surplice is singing in the metal.", zones: [{ id: "a", name: "The stair", col: 0, row: 0 }, { id: "b", name: "The ringing floor", col: 1, row: 0 }, { id: "c", name: "The bell", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "cantor", zone: "c" }, { t: "sleeper", zone: "b" }, { t: "sleeper", zone: "b", name: "Sleepwalking villager (2)" }] }
    },
    start: "arrive",
    scenes: {
      arrive: { name: "The village of Saint-Rémy", theme: "village", mood: "dread", lighting: "shadow", weather: "night", cast: ["mathilde"],
        onEnter: [{ once: "in", steps: [
          { say: "Burgundy in late autumn: bare vines, a village of low stone houses around a Cistercian abbey, and a silence that doesn't belong to the hour. It is not yet dark. Every door in the village stands open. Every doorway has someone in it." },
          { say: "Eleven villagers stand on their thresholds, eyes open, facing the abbey. They are not ill. They are not afraid. They are waiting." },
          { clue: "c_sleep" },
          { say: "A girl of about thirteen watches you from a wall, barefoot, a plug of wax in each ear. She doesn't come closer." }] }],
        options: [
          K.ask("mathilde", [
            K.t("What are they waiting for?", ["The bell. It rings at the third watch, and they get up, and they go."]),
            K.t("Why aren't you waiting?", [{ say: "She touches one ear." }, "I put wax in. When my mother stopped answering I tried everything I had. Wax worked."], { clue: "c_wax", obj: "so2", cha: 6 }),
            K.t("When did it start?", "After the new bell. It came up from Auxerre on a cart. It was a good bell. People say it was too good.", { set: "bell_new" }),
            K.t("What do they do at the chapel?", ["They sing. One each. The same eleven, always. They stop when the sun comes."], { cha: 9, clue: "c_hymn", then: [{ say: "\"Twelve, there should be. I counted. There's always one gap.\"" }] }),
            K.t("Where is your mother now?", { say: "She looks away." }, { cha: 12, then: [{ say: "\"In the chapel. Sixth. The one who sings 'And no man shall return by the water.' I know it by the tune.\"" }] })
          ], { label: "Talk to the girl on the wall", name: "Mathilde", open: ["You're from the Order. You've a black sun on your cloaks. Father Anselm said someone would come."], bye: ["Keep something in your ears. I mean it."] }),
          K.go("Go up to the abbey", "abbey", { hint: "The abbot sent for you" }),
          K.go("Look round the village", "village"),
          K.go("Stay in the village until the third watch", "night", { hint: "You will hear it yourselves", if: { clue: "c_recast" } })] },
      village: { name: "The village and the doorways", theme: "village", mood: "dread", lighting: "shadow", weather: "night",
        onEnter: [{ once: "in", steps: [{ say: "Eleven houses. In each, someone stands waiting at the door. They do not answer, but they follow you with their eyes." }] }],
        options: [
          K.find("Look at the sleepers' feet", "awareness", "medium", "Every one of them has mud to the ankle, and the mud is wet and smells of river. They are walking to the river, not only the chapel, and coming back before dawn.", "Just feet. Just mud. You cannot tell where it is from.", { clue: "c_ford", hint: "Muddy, though it hasn't rained", pre: "At the doors, the sleepers' feet are bare." }),
          K.find("Ask the old women who can still speak", "charisma", "easy", "The old women say the same thing in different words: the bell was too good, and it was Abbot Anselm's silver, and nobody asked where he got it.", "They shake their heads and shut their doors.", { clue: "c_recast", hint: "Charisma, Easy", roll: "Win a little trust" }),
          K.go("Go up to the abbey", "abbey"),
          K.go("Walk down to the river ford", "ford", { hint: "Where the sleepers' mud comes from" }),
          K.go("Visit Gervais at the foundry", "foundry", { if: "bell_new" }),
          K.go("Stay until the third watch", "night", { if: { clue: "c_recast" } })] },
      abbey: { name: "Saint-Rémy abbey", theme: "church", mood: "calm", lighting: "shadow", weather: "none", cast: ["anselm", "odo"],
        onEnter: [{ once: "in", steps: [
          { say: "The abbey is bare stone and cold, and half the brothers are asleep on their feet in the cloister. The abbot comes to the gate himself." },
          { talk: { npc: "anselm", text: "You came. Thank God. Please, eat first, then I'll tell you everything, and I will leave out nothing." } }] }],
        options: [
          K.ask("anselm", [
            K.t("What has been happening?", ["The new bell was hung in September. By All Saints, the third watch was ringing by itself. Eleven people have gone to the chapel each night since, singing. In the morning, they remember nothing. Brother Odo rings it. He does not wake."], { clue: "c_sleep" }),
            K.t("Who cast the bell?", ["A founder from Auxerre. Gervais. A good man, and honest. I paid him well, and I gave him some silver of our own to put in the alloy. It's tradition."], { clue: "c_recast" }),
            K.t("Where did the silver come from?", [{ say: "His hands are very still." }, "From the crypt. An old reliquary, empty, we thought. Brother Jean's. He was a chorister. He drowned long ago and we had no bones."], { clue: "c_novice", cha: 6 }),
            K.t("Was it empty?", [{ say: "He closes his eyes." }, "I did not look. I did not want to know. The silver would pay for the casting and I had a roof to mend. God forgive me, I did not look."], { cha: 10, obj: "so3", set: "abbot_guilt" }),
            K.t("Can we see where the bell is rung?", "Up the stair, behind the chapel. Brother Odo is there. Don't wake him. Don't speak to him.", { free: true, set: "belfry_known" })
          ], { label: "Talk to Abbot Anselm", name: "the abbot", open: ["You came. Ask me anything."], bye: ["God keep you."] }),
          K.find("Read the abbey's ledger of works", "iq", "easy", "A neat entry in the abbot's own hand: 'to the founder Gervais of Auxerre, for the recasting of the great bell, forty livres and the silver reliquary of the crypt, to be melted into the same.' Nothing about the bones.", "Latin, accounts, and a great deal of mud on the page.", { clue: "c_recast", hint: "He kept careful accounts" }),
          K.go("Down to the crypt", "crypt"),
          K.go("Up to the belfry", "belfry_look", { if: "belfry_known" }),
          K.go("Back to the village", "village")] },
      crypt: { name: "The crypt of Saint-Rémy", theme: "cellar", mood: "dread", lighting: "dark", weather: "none",
        onEnter: [{ once: "in", steps: [{ say: "A vaulted undercroft of old Burgundian stone, with wall niches for the brothers. Most hold bones in linen. One, near the stair, is empty and swept clean." }] }],
        options: [
          K.find("Examine the empty niche", "awareness", "medium", "On the wall above it, cut in a boy's careful letters: JEAN, CHORISTER. XIX. QVI CANTAVIT AQVAM. Who sang to the water. Under the dust at the back of the niche: a few shreds of old cassock, and a scrap of vellum, a Vigil hymn, abandoned at the twelfth verse.", "A niche. Empty. Cold.", { clue: ["c_novice", "c_hymn"], hint: "Scraped clean" }),
          K.find("Check the other niches for a sign", "iq", "easy", "None of the brothers' bones have been disturbed. The only grave to have been robbed was Jean's.", "A great deal of dead men, and no way to tell.", { hint: "Easy" }),
          K.go("Back up", "abbey")] },
      belfry_look: { name: "The belfry stair", theme: "church", mood: "weird", lighting: "dark", weather: "none", cast: ["odo"],
        onEnter: [{ once: "in", steps: [{ say: "A winding stair, and at the top a square stone room with the great bell hanging in it. Brother Odo stands with his hands round the rope, eyes open, singing a hymn with no words. The bell is still. The clapper is moving." }] }],
        options: [
          K.find("Examine the clapper and its chain", "occult", "medium", "The clapper hangs from a chain of silver, swinging a little behind the note. Whatever rings the bell is in the metal itself, not on the rope. The metal is warm, like a hand.", "A bell. A very good bell.", { clue: "c_clapper", hint: "Occult, Medium" }),
          K.find("Try to wake Brother Odo", "charisma", "medium", "Odo's eyes close, and he sags into your arms, whispering: 'I did not choose the note. I only pull when it's pulling me.'", "He doesn't wake, and the bell moves a little harder.", { hint: "Don't, said the abbot", failDamage: ["sanity", 2] }),
          K.go("Back down to the abbey", "abbey")] },
      ford: { name: "The river ford", theme: "forest", mood: "dread", lighting: "shadow", weather: "night",
        onEnter: [{ once: "in", steps: [{ say: "The river below the abbey bends into a still pool at the ford: reeds, old stepping stones, and a flat rock where a boy could stand to sing." }] }],
        options: [
          K.find("Listen at the water", "ancient", "medium", "Below the surface you can hear a boy's voice, almost out of breath, singing a verse and stopping before the end. The water here is very still, and the reeds lean toward the abbey.", "The river is cold, and loud, and tells you nothing.", { clue: "c_ford", hint: "Where he drowned" }),
          K.find("Take a pinch of river clay from the bank", "faith", "easy", "The clay is warm. In it, a very small bone: a finger joint. It is old, and it is the same as the finger on a boy of nineteen.", "Clay.", { hint: "Faith, Easy", set: "ford_clay" }),
          K.go("Back to the village", "village")] },
      foundry: { name: "Gervais's foundry", theme: "interior", mood: "tense", lighting: "shadow", weather: "fire", cast: ["gervais"],
        onEnter: [{ once: "in", steps: [{ say: "A long shed at the edge of the village with the great furnace cold, and a man sitting in front of it who flinches when you come in." }] }],
        options: [
          K.ask("gervais", [
            K.t("You cast the new bell?", "I did. It was my best. It was the best bell I ever cast. That's what frightens me.", { set: "bell_cast" }),
            K.t("What went into the metal?", "Bronze. Tin. And silver, the abbot's, from a little reliquary. Beautiful work. I melted it with the rest, and I took out the bones.", { clue: "c_foundry" }),
            K.t("What did you do with the bones?", [{ say: "He doesn't look up." }, "I could not put them in the fire. I had never not been able to. I sacked them and put them behind the furnace."], { cha: 8, set: "bones_behind" }),
            K.t("Do you hear it?", "Every night. I don't sleep. I hear a boy singing in the shop. He sings the last verse, and he stops, and he waits.", { cha: 10 })
          ], { label: "Talk to the founder", name: "Gervais", open: ["Not now. I've nothing to say."], bye: ["God forgive me."] }),
          K.find("Search behind the furnace", "awareness", "medium", "In the dark behind the cold furnace, a sack. Inside, wrapped in an old cassock, a boy's bones, small and clean, with a rosary of river-stones round the wrist. Brother Jean.", "Soot, and ash, and old tools.", { if: "bones_behind", obj: "so1", clue: "c_foundry", hint: "A sack, behind the furnace" }),
          K.go("Back to the village", "village")] },
      night: { name: "The third watch", theme: "church", mood: "dread", lighting: "dark", weather: "night",
        onEnter: [
          { say: "The bell does not ring. It begins. A note out of nowhere, and every door in the village opens at once, and the eleven sleepers walk toward the abbey. And you hear it, a boy's voice, almost out of breath, inside the bronze." },
          { check: { aspect: "willpower", cr: "medium", label: "Hold against the bell", who: "choose", tags: ["bell"],
            ok: [{ say: "You hold your place. It takes everything. The note goes through you like water through a net." }],
            fail: [{ say: "You wake standing in the chapel doorway with your mouth open on a verse you have never heard. Eleven voices are singing around you, and you were the twelfth, and you stop." }, { damage: { pool: "sanity", amount: 3 } }, { clue: "c_hymn" }] } },
          { goto: "chapel" }], options: [] },
      chapel: { name: "The chapel, at the third watch", theme: "church", mood: "boss", lighting: "dark", weather: "none",
        onEnter: [{ if: { all: [{ clue: "c_recast" }, { clue: "c_novice" }] }, then: [{ objective: "po1" }] }, { once: "in", steps: [{ say: "Eleven villagers, in the pews, singing. Mathilde's mother is sixth. Above them, through the ceiling, the bell is ringing itself. The hymn is on its eleventh verse, and there is a gap in the pews beside the aisle where the twelfth would sit." }] }],
        options: [
          { label: "Return Jean's bones to the river", hint: "Needs his bones, and the dawn", if: "have_bones", steps: [{ check: { aspect: "faith", cr: "challenging", label: "Carry the bones to the ford before the twelfth verse", who: "choose", tags: ["release"],
            ok: [{ say: "You run, through the sleepers, down the path to the ford, and kneel at the flat rock. You lay the bones in the water, with the rosary, and say his name. For a long moment the river is perfectly still. Then, in the metal above the village, a boy's voice finishes the verse." }, { set: "res_river" }, { objective: "po1" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "You lose the path in the dark, and the twelfth voice rises behind you." }, { damage: { pool: "stability", amount: 4 } }, { goto: "belfry_fight" }] } }] },
          { label: "Silence the clapper and keep the bell", hint: "Wax, and a rope", if: "have_wax", steps: [{ check: { aspect: "agility", cr: "medium", label: "Tie off the clapper before the twelfth verse", who: "choose", tags: ["bell"],
            ok: [{ say: "You get a loop of wax-soaked rope round the clapper, and cinch it. The bell tries to ring, and gives out a dull, wet knock. In the pews, the sleepers sag. Dawn comes, and they wake." }, { set: "res_silence" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "The clapper swings, and the note goes out." }, { damage: { pool: "sanity", amount: 3 } }, { goto: "belfry_fight" }] } }] },
          { label: "Break the bell in Gervais's furnace", hint: "The founder will help", if: { all: ["bell_cast", "bones_behind"] }, steps: [{ say: "You rouse Gervais, and the three of you, with the abbot's mules and a rope and all the strength the villagers' mud will lend, get the bell down the stair and across the yard to the foundry, and hold it in the fire until dawn. The voice in the metal sings every verse it knows, the whole night. It does not scream. When the bronze runs, it stops." }, { set: "res_melt" }, { objective: "po1" }, { objective: "po2" }, { goto: "end" }] },
          { label: "Go up to the belfry and fight it", steps: [{ goto: "belfry_fight" }] }] },
      belfry_fight: { name: "The belfry", theme: "church", mood: "boss", lighting: "dark", weather: "none",
        onEnter: [{ say: "You climb the stair, past the singing, to the ringing floor." }],
        options: [
          { label: "Face the Cantor", steps: [{ set: "res_fight" }, { combat: "belfry", win: [{ say: "The bell cracks along its length. The voice breaks off. Then, very faint, from inside the split bronze: Amen." }, { objective: "po1" }, { objective: "po2" }, { goto: "end" }] }] }] },
      end: { name: "Dawn at Saint-Rémy", theme: "village", mood: "calm", lighting: "glow", weather: "none",
        onEnter: [{ once: "in", steps: [
          { say: "The village wakes at dawn, hoarse and unharmed. Mathilde runs to her mother, and her mother, for the first time in six weeks, answers." },
          { if: { flag: "res_river" }, then: [{ say: "You laid Brother Jean in the river, and the bell never rang again. It hangs in the tower, an ordinary bell, and the Cantor has gone on to wherever a chorister goes when he has finished his Vigil." }] },
          { if: { flag: "res_silence" }, then: [{ say: "The bell is muffled, for good. It is in the tower, and no one will ring it, and Brother Jean is still in it, waiting for a twelfth voice. The abbot has made his brothers swear not to remove the wax." }] },
          { if: { flag: "res_melt" }, then: [{ say: "The bronze ran in the foundry at dawn, and the silver ran with it. The abbey will have a new bell next spring, a smaller one, and Gervais will cast it, and not sleep for a week." }] },
          { if: { flag: "res_fight" }, then: [{ say: "You broke the bell, and Jean with it. You hope he is somewhere that has finished the verse." }] },
          { if: { obj: "so3" }, then: [{ say: "The abbot goes to the river alone that morning, and what he says there is between him and the water." }], else: [{ say: "Abbot Anselm never says what he did with the silver. You do not ask." }] },
          { if: { obj: "so1" }, then: [{ say: "Brother Jean's bones are buried in the crypt, in a niche with his name cut over it." }] },
          { end: "win" }] }], options: [] }
    }
  });

  /* ======================================================================= 1349 · Bread for the Dead */
  ADV.register({
    id: "bread-for-the-dead", title: "Bread for the Dead", setting: "Hollebeke, Flanders · 1349", year: 1349, level: [1, 9], agencies: ["OID"], region: "europe", theme: "village",
    summary: "The plague took half of Hollebeke in a month. Now, every night, the buried come home and sit at their family tables, and every morning the living are weaker. The village keeps setting out bread. Nobody will say who told them to.",
    objectives: [
      { id: "po1", kind: "primary", t: "Find out who started the bread, and why it works", done: "Father Willem, in the first week of the plague, told the village to leave a loaf out for the dead so they would not walk. It worked. That was the trouble." },
      { id: "po2", kind: "primary", t: "Send the dead back, and stop the weakening of the living", done: "The dead leave the tables at dawn and do not come back. The living eat, and keep it down." },
      { id: "so1", kind: "secondary", t: "Recover the gravedigger's list of names", done: "Pieter wrote down every name he buried, in order, so none would be forgotten.", benefit: { label: "Every name", text: "You can call the dead by name: a bonus on every roll to speak to them or send them away.", bonus: { tags: ["names", "farewell"], value: 2 } } },
      { id: "so2", kind: "secondary", t: "Learn the old salt custom", done: "Salt across a threshold keeps the dead on their side, and salt in the bread keeps them from wanting it.", benefit: { label: "Salt on the sill", text: "A bonus when resisting the dead's hunger, and the Oven-Mother cannot cross a line of salt.", bonus: { tags: ["hunger"], value: 3 }, flag: "have_salt" } },
      { id: "so3", kind: "secondary", t: "Find the first loaf", done: "Baker Wouter's first loaf was made with ash from the plague pit.", benefit: { label: "The ash recipe", text: "You know what the Oven-Mother is made of: +2 to your attacks against her.", combat: { enemy: "mother", attack: 2 } } }
    ],
    clues: {
      c_table: { t: "They sit at their own tables", s: "The Maes house", x: "The dead come at dusk and take their old seats. They do not speak and do not move. They only look at the bread. By dawn, the loaf is crumbs, and the family is thinner." },
      c_bread: { t: "Every house bakes the same loaf", s: "The village", x: "Every house in Hollebeke bakes the same dark round loaf, from the same recipe, set at the same hour. Nobody will say who started it." },
      c_willem: { t: "Father Willem told them to", s: "Father Willem", x: "In the first week of the plague, when the dead would not stay buried, Father Willem told the village to leave a loaf for them. It worked. They sat, and ate, and stayed." },
      c_oven: { t: "The loaves all come from one oven", s: "The communal oven", x: "Hollebeke has one communal oven. Every house brings its dough there. It has not gone cold since the first week of the plague, and nobody feeds it." },
      c_ash: { t: "Ash in the dough", s: "The oven house", x: "The first loaf was baked from flour mixed with ash from the plague pit, where the first forty were burned. The ash is why the dead can smell it." },
      c_names: { t: "The gravedigger kept every name", s: "Pieter's ledger", x: "Pieter the gravedigger wrote each name as he buried it. 211 in six weeks. The last ten pages have nothing but a single name, over and over: his own." },
      c_salt: { t: "Salt keeps them out", s: "Sister Aleid", x: "Sister Aleid's convent kept the old custom: salt across the sill, salt in the bread, and the dead stay where they are laid. Willem did not remember it, in the panic." }
    },
    npcs: {
      willem: N("Father Willem", "Parish priest of Hollebeke", "A young priest who looks fifty: shaven head, grey skin, hands that will not stop folding a handkerchief into smaller and smaller squares.", F(0, 4, "bald", 5, "none", { sex: "m" })),
      griet: N("Griet Maes", "Baker's widow · head of the family at the first table", "A strong woman in a flour-white apron, grief set so hard in her face that it has become part of it. She sets the table every night anyway.", F(0, 3, "braids", 1, "headscarf", { sex: "f" })),
      pieter: N("Pieter the gravedigger", "Gravedigger · last of his gang", "Thin and hunched, with a spade he does not put down, and a ledger tied to his belt with twine.", F(1, 5, "short", 6, "none", { sex: "m" })),
      aleid: N("Sister Aleid", "Beguine from the convent at Ypres", "A calm, weathered woman in grey who has seen a great deal of plague and has stopped being surprised.", F(0, 4, "headscarf", 5, "none", { sex: "f" }))
    },
    enemies: {
      mother: { build: { name: "The Oven-Mother", type: "Beyond", difficulty: "challenging", sprite: "construct", hue: 15, dtype: "sanity", core: { body: 3, mind: 2, spirit: 3 }, mods: ["Occult", "Tanky"],
        text: "She is the fire the dead are fed from. Hunger: each round everyone in the room without salt loses 2 Health and 2 Sanity, and the Oven-Mother heals as much. She cannot cross a line of salt. The dead obey her: while she burns, the guests keep sitting.", dies: "gutters, and for the first time in two months the oven is only an oven" } },
      guest: { build: { name: "The returned dead", type: "Undead", difficulty: "easy", sprite: "humanoid", hue: 100, attack: 0, dtype: "health", dies: "folds back into the grave-clothes, and is quiet, and is only a person who has died" } }
    },
    encounters: {
      oven: { name: "The communal oven", theme: "interior", fightText: "The oven door swings open on its own, and the fire in it is not a fire. Round the walls of the oven house, the guests of Hollebeke stand up from the benches.", zones: [{ id: "a", name: "The door", col: 0, row: 0 }, { id: "b", name: "The benches", col: 1, row: 0 }, { id: "c", name: "The oven mouth", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "mother", zone: "c" }, { t: "guest", zone: "b" }, { t: "guest", zone: "b", name: "The returned dead (2)" }] }
    },
    start: "arrive",
    scenes: {
      arrive: { name: "Hollebeke", theme: "village", mood: "dread", lighting: "shadow", weather: "wind", cast: ["willem"],
        onEnter: [{ once: "in", steps: [
          { say: "Flanders, in the second year of the plague. Hollebeke is a straggle of thatch and mud round a stone church, half its doors painted with the cross of the sick. It is nearly dusk, and in every doorway a woman is putting a loaf on a table, quietly, as if for company." },
          { say: "A young priest meets you at the church gate with his hands full of a folded handkerchief. He looks fifty." },
          { talk: { npc: "willem", text: "The Order. Bishop Gerolf wrote that you would come. God forgive me, I did not think you would come so soon." } }] }],
        options: [
          K.ask("willem", [
            K.t("What is happening here?", ["Every night at dusk the dead of Hollebeke come home. They sit at their own tables, in their own seats. They do not speak. They look at the bread. By dawn, the bread is gone, and the family at the table is weaker."], { clue: "c_table" }),
            K.t("How many?", "Two hundred and eleven buried since Candlemas. Eighty-one still living in the village. Every night, more of them sit down.", { clue: "c_bread" }),
            K.t("Who told them to set out bread?", [{ say: "The handkerchief is now the size of a coin." }, "I did. God help me, I did. In the first week they would not stay buried. They came back and wandered, and clawed at the church door. So I told the village to leave them a loaf. And they sat down. And they ate. And they stayed."], { cha: 7, clue: "c_willem", obj: "po1" }),
            K.t("Why did you not stop it?", "Because it worked. And because it was kind. And because the village was so frightened, and so tired. I told them it was a charity. I called it a Mass.", { cha: 11 }),
            K.t("Where does the bread come from?", "Every house. They bring their dough to the oven in the old brewhouse. It was warm when I got there. It is always warm.", { free: true, set: "oven_known" })
          ], { label: "Press Father Willem", name: "the priest", bye: ["Do not let them go hungry. And do not let them eat."] }),
          K.go("Visit the Maes house", "maes", { hint: "The first table" }),
          K.go("Find the gravedigger", "graves"),
          K.go("Look at the oven in the old brewhouse", "oven_house", { if: "oven_known" }),
          K.go("Go up to the plague pit on the hill", "pit", { hint: "Where the first forty were burned" }),
          K.go("Search the church", "church")] },
      pit: { name: "The plague pit", theme: "village", mood: "dread", lighting: "shadow", weather: "wind",
        onEnter: [{ once: "in", steps: [{ say: "A bare shoulder of hillside above the village, scorched black in a long oval. Nothing grows on it. Salt has been spread round the edge, in a thin white line, and the line has been broken in several places." }] }],
        options: [
          K.find("Examine the broken salt line", "awareness", "medium", "The salt line was laid by someone who knew the custom, and broken from the inside, by something that went out, not in. The pit is empty. Whatever was burned here was not left to lie.", "Salt and ash and nothing readable.", { clue: "c_salt", hint: "Awareness, Medium" }),
          K.find("Sift the ash", "iq", "easy", "The ash has been taken, a great deal of it, by the sackful: shovel marks in the pit, and the cart ruts lead down toward the village, to the old brewhouse.", "Ash. Cold, grey, fine.", { clue: "c_ash", hint: "Easy" }),
          K.go("Back to the village", "arrive")] },
      church: { name: "The church of Hollebeke", theme: "church", mood: "calm", lighting: "shadow", weather: "none",
        onEnter: [{ once: "in", steps: [{ say: "A small stone church, its floor strewn with straw, and rows of cots down the nave. Nobody is in them. The altar candles have burned down to stubs." }] }],
        options: [
          K.find("Read the parish register", "iq", "medium", "Burials in a hasty hand, a dozen to a page. In the second week of the plague, the entries change: no more names. Just a number, and beside it: bread. And a date, and the date is three days before the first of the dead returned.", "The register is a mess of crosses and splashes of lye.", { clue: "c_willem", hint: "Intelligence, Medium" }),
          K.find("Search the vestry", "awareness", "easy", "Under the vestment chest, a rolled letter from Sister Aleid at the Ypres convent, addressed to Willem, never answered: 'If they will not stay buried, salt the sills. Do not feed them. For the love of God, do not feed them.'", "Vestments. Candles. A stale smell.", { clue: "c_salt", hint: "Easy" }),
          K.go("Back to the village", "arrive")] },
      maes: { name: "The Maes house", theme: "interior", mood: "dread", lighting: "shadow", weather: "fire", cast: ["griet"],
        onEnter: [{ once: "in", steps: [{ say: "A low room, a long table, five chairs. At the head, the baker's widow lays out a loaf with the care of a woman setting a place for a king. Four chairs are empty. The room is cold, and the bread is already warm." }] }],
        options: [
          K.ask("griet", [
            K.t("Who comes to your table?", ["My husband, my father-in-law, our two boys. They come as the light goes. They sit. They look at the loaf. They do not speak, and they do not eat until I look away."], { clue: "c_table" }),
            K.t("Why do you keep setting the bread?", [{ say: "She straightens the loaf." }, "Because they come anyway. At least this way they are quiet. At least they're mine."]),
            K.t("What has the bread done to you?", "I am thin. Everyone is. We eat what the dead leave, and it is ash. I cannot taste anything. I cannot taste my own children's names.", { cha: 8, set: "ash_hint" }),
            K.t("What does the bread look like?", [{ say: "She shows you the heel of one." }, "Dark. Dense. Willem said it must be this loaf, and no other, and the ash from the pit stirred in, for the dead to know it by."], { cha: 10, clue: "c_ash" })
          ], { label: "Talk to Griet", name: "Griet", bye: ["Stay for the evening, if you like. They won't mind."] }),
          K.find("Watch the table at dusk", "willpower", "medium", "Dusk. They come in without a sound, four of them: a big man, a stooped man, two boys. They sit. They look at the loaf. By dawn the loaf is crumbs, and you are fifty pounds lighter inside, as if you had lent them something.", "You cannot bear to watch. You leave, and are told in the morning what you missed.", { hint: "Willpower, Medium", clue: "c_table", tags: ["hunger"], failDamage: ["sanity", 3] }),
          K.go("Back to the village", "arrive")] },
      graves: { name: "The graveyard of Hollebeke", theme: "village", mood: "dread", lighting: "shadow", weather: "wind", cast: ["pieter"],
        onEnter: [{ once: "in", steps: [{ say: "Row on row of fresh-turned earth, and no crosses on most of it. By a half-dug trench a man leans on his spade, and watches you come." }] }],
        options: [
          K.ask("pieter", [
            K.t("How many have you buried?", "Two hundred and eleven. I wrote each one down. Name, house, day. So that no one is forgotten. That's the only decent thing I had left to give them.", { set: "ledger_known" }),
            K.t("Do the dead come from these graves?", "They all do. They rise at dusk, and walk home, and sit down. At dawn they come back and lie down. I tidy the earth.", { clue: "c_table" }),
            K.t("May we see your ledger?", [{ say: "He holds it against his chest." }, "It is the only thing I have. But you are the Order. Look."], { cha: 7, set: "ledger_open" }),
            K.t("Why do the last pages have only one name?", [{ say: "He says nothing for a very long time." }, "It's mine. It's mine, over and over. I think I am already dead. I think I have been for weeks. It is only that the bread has not reached me yet."], { cha: 12 })
          ], { label: "Talk to Pieter", name: "the gravedigger" }),
          K.find("Read Pieter's ledger of names", "iq", "easy", "Page after page in a careful hand: name, house, day. 211 in six weeks. You know them now; you could call any one of them. The last ten pages say only: PIETER. PIETER. PIETER.", "Names, hundreds, running together.", { if: "ledger_open", clue: "c_names", obj: "so1" }),
          K.go("Back to the village", "arrive")] },
      oven_house: { name: "The old brewhouse", theme: "interior", mood: "weird", lighting: "shadow", weather: "fire",
        onEnter: [{ once: "in", steps: [{ say: "A long stone shed with a vaulted oven at one end, the size of a cottage. The brick is hot to the touch, and the fire is not wood: it is low, and white, and steady. Racks of dark round loaves line the walls." }] }],
        options: [
          K.find("Examine the oven and the fire", "occult", "medium", "The oven has not gone cold since the first week of the plague, and nobody feeds it. At its back, a hatch, and in the hatch a thing like a woman in a bread-oven's shape, banked down, listening.", "A very hot oven.", { clue: "c_oven", hint: "Occult, Medium" }),
          K.find("Take apart one of the loaves", "iq", "easy", "Inside the dark crust: ash. Grey, fine, and gritty, with a sweet, cold smell. Not grain ash. Bone ash.", "Bread.", { clue: "c_ash", obj: "so3", hint: "Easy" }),
          K.go("Back to the village", "arrive"),
          K.go("Send for Sister Aleid, the beguine from Ypres", "aleid", { if: { clue: "c_oven" } })] },
      aleid: { name: "The edge of the village", theme: "village", mood: "calm", lighting: "shadow", weather: "wind", cast: ["aleid"],
        onEnter: [{ once: "in", steps: [{ say: "Sister Aleid walks in from the Ypres road at the end of the afternoon, with a pack on her back and a very small, very practical smile." }] }],
        options: [
          K.ask("aleid", [
            K.t("What do you know about the dead and bread?", "It is an old thing. Bread for the dead, before there were priests. You do not feed them. You give them something to stop them wanting.", { clue: "c_salt" }),
            K.t("How do you stop it?", "Salt. Across the sill, and in the bread. And the proper rites, the whole of them, not just the Mass. The dead must be told they are dead. Gently. By name.", { obj: "so2", set: "farewell_known" }),
            K.t("What is the oven?", [{ say: "She looks a long time at the brewhouse door." }, "A fire the dead were burned in, and something that learned how to be fed. If it is the oven, the bread is only its hand."], { cha: 9, set: "oven_mother" })
          ], { label: "Talk to Sister Aleid", name: "Sister Aleid", bye: ["Bring me salt. A great deal."] }),
          K.go("Back to the village", "arrive"),
          K.go("Wait for dusk, and the dead", "dusk", { if: { all: [{ clue: "c_table" }, { clue: "c_oven" }] } })] },
      dusk: { name: "Dusk in Hollebeke", theme: "village", mood: "boss", lighting: "dark", weather: "night",
        onEnter: [{ once: "in", steps: [{ say: "Dusk. In every house, the loaf is set out. In every house the dead come in, and sit, and look. Eighty-one living, two hundred and eleven dead, and the oven in the old brewhouse roaring." }, { objective: "po1" }] }],
        options: [
          { label: "Call the dead by name, and send them home", hint: "Needs the names, and the proper rite", if: { all: ["farewell_known", { obj: "so1" }] }, steps: [{ check: { aspect: "faith", cr: "challenging", label: "Speak every name, and tell them gently", who: "choose", tags: ["names", "farewell"],
            ok: [{ say: "You go from house to house with Pieter's ledger, and say every name, and the proper words, gently. The dead listen. One by one, they stand, and bow to the table, and go out, and lie down. The oven, deprived of its guests, burns lower. By dawn it is cold." }, { set: "res_names" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "You lose the thread of the names. The dead turn toward the oven." }, { damage: { pool: "sanity", amount: 3 } }] } }] },
          { label: "Salt the sills, and every loaf", hint: "Needs Sister Aleid's custom", if: { obj: "so2" }, steps: [{ check: { aspect: "durability", cr: "medium", label: "Salt every threshold in the village before the dead arrive", who: "choose", tags: ["hunger"],
            ok: [{ say: "You, and the village, and Sister Aleid with a sack of salt on her shoulder, go from door to door. The dead come to the thresholds, and stop. The bread has salt in it, and they have no taste for it. They stand there, bewildered, in the dark, until dawn, and then they go." }, { set: "res_salt" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "You are one house short. The dead come in there." }, { damage: { pool: "health", amount: 3 } }] } }] },
          { label: "Break the oven", steps: [{ goto: "oven_fight" }] }] },
      oven_fight: { name: "The oven house", theme: "interior", mood: "boss", lighting: "shadow", weather: "fire",
        onEnter: [{ say: "You go into the brewhouse. The fire in the mouth of the oven turns toward you." }],
        options: [{ label: "Fight the Oven-Mother", steps: [{ set: "res_fire" }, { combat: "oven", win: [{ say: "The fire goes out. Round the village, a great weight lifts. In every house, the dead stand up from their tables, and look at one another, and lie down." }, { objective: "po2" }, { goto: "end" }] }] }] },
      end: { name: "Hollebeke, the morning after", theme: "village", mood: "calm", lighting: "glow", weather: "none",
        onEnter: [{ once: "in", steps: [
          { say: "No one sits at the table in Hollebeke that morning. Griet Maes sets the loaf out for her sons out of habit, and then, shaking, puts it back in the bin." },
          { if: { flag: "res_names" }, then: [{ say: "Every name was spoken. The village buries its dead again, the proper way, with Pieter's ledger carried in front." }] },
          { if: { flag: "res_salt" }, then: [{ say: "The dead went home confused but quiet. The salt will have to be renewed every year, and Hollebeke will remember to do it." }] },
          { if: { flag: "res_fire" }, then: [{ say: "The oven is cold, and the brewhouse is empty. Nothing will bake there ever again. The village will have to build a new oven, further from the church." }] },
          { if: { obj: "so3" }, then: [{ say: "You know now what the plague pit's ash was made into, and you have told the Prior." }] },
          { if: { obj: "so1" }, then: [{ say: "Pieter closes his ledger. For the first time in weeks he puts down his spade." }], else: [{ say: "Pieter keeps his ledger. He does not show it to anyone. He writes one more name in it, in the margin." }] },
          { say: "Father Willem sits on the church steps with his handkerchief unfolded. He is a young man again, a little. He thanks you, and says that he will write to the bishop about his own part in it." },
          { end: "win" }] }], options: [] }
    }
  });
})();
