/* ============================================================================
   REBUILT CASES, BATCH FIVE: The Black Roller (1935), The Lantern on the Water
   (1942) and Vacancy (2016).
   ========================================================================== */
(function () {
  const ADV = window.ADV, K = window.CASEKIT, F = K.face, N = K.person;

  /* ======================================================================= 1935 · The Black Roller */
  ADV.register({
    id: "black-roller", title: "The Black Roller", setting: "Cimarron County, Oklahoma · 1935", year: 1935, level: [1, 9], agencies: ["NSBD", "WCA", "OID"], region: "americas-north", theme: "desert", downtime: 2,
    summary: "Every Sunday at four the same black dust storm rolls over the Pruitt farm. When it passes, someone in the county is gone, and something wearing their face walks out of the dust, saying their prayers a little wrong.",
    objectives: [
      { id: "po1", kind: "primary", t: "Find out what the storm is, and what it wants", done: "Ruth Pruitt, nine, suffocated in the first black blizzard of 1931. Her father struck a bargain with the dust to bring her back, and the dust has been collecting the price in neighbours ever since." },
      { id: "po2", kind: "primary", t: "Stop the storm before Sunday, and bring the taken home", done: "The Black Roller does not come on Sunday. The taken walk out of the dust, themselves." },
      { id: "so1", kind: "secondary", t: "Learn the counterfeits' tell", done: "The ones the dust sends back say their prayers wrong: one word is changed. In the Lord's Prayer, it is always 'forgive'.", benefit: { label: "A word out of place", text: "You can spot a counterfeit. A bonus on every roll to tell them from the real.", bonus: { tags: ["tell"], value: 3 } } },
      { id: "so2", kind: "secondary", t: "Find Ruth's real grave", done: "Under the windmill, with a dust-stopped cross made of two hand-rails.", benefit: { label: "A grave to tend", text: "Where the dust cannot reach: a bonus on every roll to lay her to rest.", bonus: { tags: ["farewell"], value: 2 } } },
      { id: "so3", kind: "secondary", t: "Learn how to breathe in the storm", done: "Mrs. Pruitt's trick: wet sheets over the face, and breathe through the flour.", benefit: { label: "Wet sheets", text: "A bonus on every roll to endure the dust.", bonus: { tags: ["dust"], value: 3 } } }
    ],
    clues: {
      c_sunday: { t: "Every Sunday at four", s: "Sheriff Hanks", x: "A black blizzard rolls over the Pruitt place every Sunday at four, the same way, no matter the wind. Afterward, somebody in the county is missing. Six since Easter." },
      c_return: { t: "They come back wrong", s: "Orrin Tate", x: "Orrin Tate's wife went missing after the storm. She came back the following Monday, and lives in the house, and says her prayers, and eats, and is not her." },
      c_tell: { t: "The prayer has a word changed", s: "Reverend Early", x: "The ones who came back say the Lord's Prayer at the table, and every one says 'forgive us our trespasses as we forgive' wrong: the word is 'forgot'." },
      c_ruth: { t: "Ruth Pruitt", s: "The schoolhouse", x: "Ruth Pruitt, nine, died in the first black blizzard in April 1931. She was found in the hog pen, with dirt in her mouth. Her father has not spoken of her since." },
      c_bargain: { t: "Amos asked the dust", s: "Mrs. Pruitt", x: "Amos Pruitt went out into the second storm with his hat in his hand and asked the dust for his girl back. The dust said yes. It said it would take a price." },
      c_grave: { t: "The grave under the windmill", s: "Amos Pruitt", x: "Ruth's real grave is under the windmill, with a cross of two hand-rails. The ground there never has any dust on it, however hard the wind blows." },
      c_ledger: { t: "Six names, one per Sunday", s: "The county ledger", x: "The county recorder's missing-persons ledger lists six names since Easter, one per Sunday. The next Sunday's entry has already been written in a different hand: 'To be taken: the sheriff.'" }
    },
    npcs: {
      hanks: N("Sheriff Dub Hanks", "County sheriff", "A lean man in a sweat-stained hat, a star pinned crooked to a dust-yellow shirt, and the long stare of someone who has dug a lot of graves and doesn't like where this is going.", F(0, 4, "short", 7, "hat", { sex: "m" })),
      early: N("Reverend Early", "Preacher, Dry Creek Church", "Heavy, kind, soft-spoken, with a Bible held shut with a rubber band and a handkerchief tied over his nose against the dust.", F(2, 5, "bald", 5, "none", { sex: "m" })),
      pruitt: N("Amos Pruitt", "Farmer · the Pruitt place", "A big man worn thin, in overalls grey with dust. He does not look at the horizon. He has not looked at the horizon in four years.", F(0, 4, "short", 5, "none", { sex: "m" })),
      mrs: N("Lena Pruitt", "Amos's wife", "Small, sharp and upright, a wet sheet over one arm, who has kept the house clean through four years of dust by sheer cussedness.", F(0, 3, "bun", 1, "headscarf", { sex: "f" })),
      tate: N("Orrin Tate", "Farmer · his wife came back", "Gaunt, with the haunted politeness of a man who sits at a table every night with a stranger.", F(0, 5, "short", 5, "none", { sex: "m" }))
    },
    enemies: {
      replica: { build: { name: "A neighbour, sent back", type: "Beyond", difficulty: "easy", sprite: "humanoid", hue: 30, dtype: "health", attack: 1, dies: "comes apart in a long sigh of grey dust, and is only a heap of it on the floor" } },
      roller: { build: { name: "The Black Roller", type: "Folklore", difficulty: "challenging", sprite: "spirit", hue: 20, dtype: "stability", range: 1, core: { body: 1, mind: 2, spirit: 3 }, mods: ["Occult"],
        text: "A black blizzard with a child in the middle. Dust: each round everyone without wet cloth takes 2 Health. Mimic: it speaks in the voice of someone an agent knows. It cannot cross ground that has been blessed: Ruth's grave. Stability harms it; it is a grief.", dies: "slumps, and a little girl in a dirty frock steps out of it, and says, quite calmly, 'Papa?'" } }
    },
    encounters: {
      storm: { name: "The Pruitt place, Sunday at four", theme: "desert", severity: 3, fightText: "The wall of black comes over the horizon at four, as it does every Sunday. When it hits the farmyard it has a face, and the face is a little girl's.", zones: [{ id: "a", name: "The porch", col: 0, row: 0 }, { id: "b", name: "The farmyard", col: 1, row: 0 }, { id: "c", name: "The windmill", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "roller", zone: "c" }, { t: "replica", zone: "b" }, { t: "replica", zone: "b", name: "A neighbour, sent back (2)" }] }
    },
    start: "town",
    scenes: {
      town: { name: "Boise City, Cimarron County", theme: "desert", mood: "dread", lighting: "glow", weather: "wind", cast: ["hanks"],
        onEnter: [{ once: "in", steps: [
          { say: "Cimarron County, Oklahoma, the Panhandle, the spring of 1935, in the fourth year of the dust. The air is yellow. Every window is taped. Every doorstep has a drift. In a single street of false-fronted shops, a sheriff leans on a rail with a wet bandanna over his nose." },
          { talk: { npc: "hanks", text: "You're the Division. Fine. Whatever you think you know about dust, forget it. It's Wednesday. We've got till Sunday at four." } }] }],
        options: [
          K.ask("hanks", [
            K.t("What happens on Sunday?", ["A black roller comes over the Pruitt place at four, the same way, no matter which way the wind's blowing. When it's passed, somebody in the county's missing. Six since Easter."], { free: true, clue: "c_sunday" }),
            K.t("Who is missing?", "A hired man. Two women. A schoolteacher. Old Tom Early, the Reverend's brother. A boy of fifteen. And one that I'd rather not talk about.", { clue: "c_ledger" }),
            K.t("Has anyone come back?", [{ say: "He takes his hat off." }, "Mrs. Tate. Orrin's wife. After the second Sunday. She came walking out of the dust the next morning, and she lives in his house. He says it isn't her."], { free: true, clue: "c_return", set: "tate_known" }),
            K.t("Who knows about the Pruitts?", "Amos and Lena. Their girl died in '31, first storm. Amos has not been right since. It's their land the thing comes in over.", { cha: 7, clue: "c_ruth", set: "pruitt_known" }),
            K.t("What do you think it is?", "I think it's what's left of the dust, when it's been asked too many times for something.", { cha: 11 })
          ], { label: "Talk to Sheriff Hanks", name: "the sheriff", bye: ["I'll be on the porch of the Rexall. Where I can see the sky."] }),
          K.find("Read the county ledger of missing persons", "iq", "easy", "Six names, one a Sunday since Easter. The page for the coming Sunday has already been filled in, in a hand that is not the recorder's: 'To be taken: Sheriff D. Hanks.'", "Names, dates, a pressed-down blot of dust on each page.", { clue: "c_ledger", hint: "Easy" }),
          K.go("Dry Creek Church", "church", { hint: "The Reverend's brother is among the missing" }),
          K.go("Orrin Tate's farm", "tate", { if: "tate_known" }),
          K.go("The Pruitt place", "pruitt", { if: "pruitt_known" }),
          K.go("The schoolhouse", "school")] },
      church: { name: "Dry Creek Church", theme: "church", mood: "calm", lighting: "shadow", weather: "wind", cast: ["early"],
        onEnter: [{ once: "in", steps: [{ say: "A white frame church with a taped window, and inside, a wet sheet over every pew against the dust. A heavy man in a black coat stands at the pulpit with his Bible held shut with a rubber band." }] }],
        options: [
          K.ask("early", [
            K.t("What have you noticed about the ones who come back?", ["They're polite. Better than polite. They say grace. And when they say the Lord's Prayer, they change a word. 'Forgive us our trespasses, as we forgot'. Every one of them. They say it so nicely."], { free: true, clue: "c_tell", obj: "so1" }),
            K.t("Where is your brother?", "Tom was the fourth Sunday. I've buried an empty coffin. I will not bury a stranger in it.", { clue: "c_sunday" }),
            K.t("Do you know what the storm is?", [{ say: "He turns the rubber band on his Bible." }, "It's a grief. That's what I tell myself. Something somebody asked, and it said yes. I've seen Amos Pruitt on the steps of this church at three in the morning, praying with his hat in his hands."], { cha: 8, clue: "c_bargain" }),
            K.t("Can a grief be put to rest?", "If you give it what it's looking for. What it actually wants. Not what it asked for.", { cha: 11, set: "rest_hint" })
          ], { label: "Talk to Reverend Early", name: "the Reverend", bye: ["God keep you from the roller."] }),
          K.find("Test the prayer", "charisma", "medium", "You ask a parishioner who has been 'better' lately to say grace. She does, flawlessly: until the very last line, where she says, with a sweet, serene smile, 'as we forgot.' The word catches in the air.", "She prays beautifully. You hear nothing wrong. You are no judge.", { hint: "Charisma, Medium", clue: "c_tell", obj: "so1", tags: ["tell"] }),
          K.go("Back to town", "town")] },
      tate: { name: "The Tate farm", theme: "desert", mood: "dread", lighting: "shadow", weather: "wind", cast: ["tate"],
        onEnter: [{ once: "in", steps: [{ say: "A neat little farmhouse with every window taped, and a woman in an apron setting a table for two. She smiles at you from the stove. She is entirely warm, and pleasant, and very still around the eyes." }] }],
        options: [
          K.ask("tate", [
            K.t("How long has she been back?", ["Since the Monday after the second Sunday. She walked in at breakfast. I thought it was her, and then I thought it wasn't. She makes my eggs the way she always did. She has never once been tired."], { free: true, clue: "c_return" }),
            K.t("What is wrong with her?", [{ say: "He lowers his voice." }, "Everything's right. That's what's wrong. She says the blessing, and every night she says it exactly the same, and one word's off. I'm too afraid to say which."], { clue: "c_tell", obj: "so1" }),
            K.t("Where is your real wife?", [{ say: "He looks at the window." }, "In the storm. I think she's in the storm. I think she's somewhere in the middle of it, waiting for me to come and get her."], { cha: 8, set: "wife_in_storm" })
          ], { label: "Talk to Orrin Tate", name: "Orrin", bye: ["Don't make her cry. She cries so well."] }),
          K.find("Look at the woman's hands", "awareness", "medium", "Her hands are perfect, like a catalogue's. No calluses, no scars, nothing from twenty years of farm work. Where her nails meet the skin, there is fine grey powder, which sifts, very slightly, when she moves.", "She smiles, and turns away, and you can't see.", { clue: "c_tell", hint: "Awareness, Medium", tags: ["tell"] }),
          K.go("Back to town", "town")] },
      pruitt: { name: "The Pruitt place", theme: "desert", mood: "dread", lighting: "shadow", weather: "wind", cast: ["pruitt", "mrs"],
        onEnter: [{ once: "in", steps: [{ say: "A gaunt wooden house on a bare rise, a tall windmill beside it, and a yard in which nothing grows. The wind has scoured the paint down to the grain. A wet sheet hangs over the door, and behind it a small, sharp woman waits with her arms folded." }] }],
        options: [
          K.ask("mrs", [
            K.t("How do you breathe in the storm?", ["Wet sheets over the face, and flour in the weave. I learned it the first year. We lost one, and I swore I'd lose no more."], { obj: "so3", set: "sheets_known", free: true }),
            K.t("What happened to Ruth?", [{ say: "Her arms tighten." }, "She was nine. She went out to bring the pig in. I found her in the hog pen. Dirt in her mouth. Amos has not spoken her name since."], { free: true, clue: "c_ruth" }),
            K.t("What did Amos do?", "He went out into the second storm with his hat in his hand and asked. I watched him from the window. The dust said yes. That's when I knew we'd all pay.", { cha: 7, clue: "c_bargain", free: true }),
            K.t("Will you help us?", "I'll tell Amos. I won't make him.", { cha: 10, set: "mrs_help" })
          ], { label: "Talk to Lena Pruitt", name: "Mrs. Pruitt", bye: ["Don't let him go out when it comes."] }),
          K.ask("pruitt", [
            K.t("Can we talk about Ruth?", [{ say: "He turns toward the windmill, and away." }, "I asked for her. I asked the dust to give her back. It said it would. It's been giving her back every Sunday, in someone else's face. I did that. I did that."], { cha: 7, set: "amos_confess" }),
            K.t("Where is she buried?", "Under the windmill. The only ground on this farm the dust doesn't settle on. I put a cross of two hand-rails there.", { clue: "c_grave", obj: "so2", cha: 9, free: true })
          ], { label: "Talk to Amos Pruitt", name: "Amos", if: "mrs_help", bye: ["I'll be on the porch."] }),
          K.find("Search the farmyard", "awareness", "medium", "Under the windmill, the ground is bare and clean: not a speck of dust has settled on a little mound a few feet long, and at its head stands a cross of two rusted hand-rails. Around the farm, everything else is drifted in.", "Wind. Dirt. The sound of the windmill.", { clue: "c_grave", obj: "so2", hint: "Awareness, Medium" }),
          K.go("Back to town", "town"),
          K.go("Wait for Sunday at four", "sunday", { if: { all: [{ clue: "c_bargain" }, { clue: "c_grave" }] } })] },
      school: { name: "The Dry Creek schoolhouse", theme: "interior", mood: "calm", lighting: "shadow", weather: "wind",
        onEnter: [{ once: "in", steps: [{ say: "A one-room school, desks pushed to one side, a blackboard with a drift of dust across the lower half. On the wall, a school photograph from 1930: twenty children in a row, with Ruth Pruitt in the front, her hair in two plaits." }] }],
        options: [
          K.find("Read the school register for 1931", "iq", "easy", "In the register for April 1931: 'Ruth Pruitt, aged 9. Absent. Deceased. April 14, in the black blizzard.' And below it, in a child's hand: 'Ruth said she would come back.'", "Names and attendance, nothing else.", { clue: "c_ruth", hint: "Easy" }),
          K.find("Ask the old teacher about Ruth", "charisma", "easy", "Miss Ellis remembers a fierce, funny girl who said her prayers aloud and always got 'forgive' right, in a very small, very serious voice. 'She'd tell you off if you got it wrong.'", "Miss Ellis is not in the mood to talk.", { clue: "c_tell", hint: "Charisma, Easy" }),
          K.go("Back to town", "town")] },
      sunday: { name: "Sunday, four o'clock", theme: "desert", mood: "boss", lighting: "dark", weather: "storm",
        onEnter: [{ once: "in", steps: [{ say: "Sunday, a quarter to four. The Pruitt place under a yellow sky, the windmill creaking. On the horizon, a wall of black rises from the ground like a mountain, rolling forward without a sound. The wind drops dead. You can hear a child singing in it." }, { objective: "po1" }] }],
        options: [
          { label: "Lay Ruth to rest, at her own grave", hint: "Needs her grave, and her father", if: { all: [{ obj: "so2" }, "amos_confess"] }, steps: [{ check: { aspect: "faith", cr: "challenging", label: "Stand at the grave with Amos, and give her what she actually wants", who: "choose", tags: ["farewell", "dust"],
            ok: [{ say: "You stand at the grave with Amos Pruitt. When the storm comes over the farm, it has a child in the middle of it, and the child is looking for her father. And Amos, for the first time in four years, says her name, and takes his hat off, and tells her it is all right to stop." }, { set: "res_rest" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "Amos cannot say it. The storm breaks over the farm." }, { damage: { pool: "health", amount: 4 } }] } }] },
          { label: "Seal the farm with wet sheets, and wait it out", hint: "Needs Lena's trick", if: "sheets_known", steps: [{ check: { aspect: "durability", cr: "medium", label: "Hold the line of wet sheets through the whole storm", who: "choose", tags: ["dust"],
            ok: [{ say: "Every door, window and crack hung with wet sheets. For an hour you sit in the dark kitchen with the roar going over, and when it's gone, the sheriff is still there, and so are you. It was a short storm. Nobody was taken." }, { set: "res_sheets" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "The sheets dry out. The dust finds you." }, { damage: { pool: "health", amount: 3 } }] } }] },
          { label: "Face the Black Roller", steps: [{ set: "res_fight" }, { combat: "storm", win: [{ say: "The dust falls, all at once, like a curtain. In the farmyard, a very small girl in a dirty frock stands blinking in the sun." }, { objective: "po2" }, { goto: "end" }] }] }] },
      end: { name: "The Pruitt place, Monday morning", theme: "desert", mood: "calm", lighting: "glow", weather: "none",
        onEnter: [{ once: "in", steps: [
          { say: "On Monday morning the sky over Cimarron County is blue, for the first time in four years. Six people walk out of the dust, blinking, in their own faces. The one who was in Orrin Tate's kitchen falls quiet, and is only a heap of grey dust on the floor." },
          { if: { flag: "res_rest" }, then: [{ say: "Amos Pruitt tended his daughter's grave, that spring, in the new green grass. The dust never came on his place again." }] },
          { if: { flag: "res_sheets" }, then: [{ say: "You sat out the storm, and the taken came back. But the storm still comes, and the grief in it is still looking. Lena keeps the wet sheets on the door." }] },
          { if: { flag: "res_fight" }, then: [{ say: "You broke the Roller, and its child walked out of it. Amos stood in the yard with his hat in his hand, and nobody knew what to say." }] },
          { if: { obj: "so1" }, then: [{ say: "Reverend Early preaches the following Sunday on a word out of place, and every parishioner says 'forgive' very carefully." }] },
          { if: { obj: "so3" }, then: [{ say: "Lena Pruitt's wet-sheet trick goes into the Division's field manual, with her name on it." }] },
          { end: "win" }] }], options: [] }
    }
  });

  /* ======================================================================= 1942 · The Lantern on the Water */
  ADV.register({
    id: "lantern-on-the-water", title: "The Lantern on the Water", setting: "Eleuthera, Bahamas · 1942", year: 1942, level: [1, 9], agencies: ["NSBD", "WCA"], region: "americas-north", theme: "sea",
    summary: "There is a blackout on every island for fear of U-boats. Yet every night a schooner with every lantern lit sails straight for the reef at Governor's Harbour, and every morning one more fisherman's boat is missing from the beach.",
    objectives: [
      { id: "po1", kind: "primary", t: "Find out what the schooner is, and who crews it", done: "The Mary Providence, a wrecker's schooner lost on the reef in 1799 with eighty hands, rigged with false lights to lure ships onto the rocks. Her dead crew are still wrecking." },
      { id: "po2", kind: "primary", t: "Stop the lights, and keep the boats off the reef", done: "The schooner does not sail again, and no more boats are lost." },
      { id: "so1", kind: "secondary", t: "Learn the old wreckers' signal", done: "Three lanterns high, one low: the wreckers' call for 'ship in distress, come close.' It is the lie the schooner tells.", benefit: { label: "The true signal", text: "You know the lie, and you know the answer. A bonus on every roll to send the true call.", bonus: { tags: ["signal"], value: 2 } } },
      { id: "so2", kind: "secondary", t: "Find the Mary Providence's ship's bell", done: "The bell is in the church at Governor's Harbour, taken off the wreck in 1800, silent for a hundred and forty years.", benefit: { label: "The wreck's bell", text: "A bonus on every roll to turn the crew's attention: they know their own bell.", bonus: { tags: ["bell"], value: 3 } } },
      { id: "so3", kind: "secondary", t: "Learn how a wrecker's lantern is lit", done: "Mabel Rolle's grandfather lit them for the wreckers, as a boy, and told her the trick: a lantern lit with a dead man's oil can only be put out with the sea.", benefit: { label: "A way to quench it", text: "+2 to your attacks against the Captain.", combat: { enemy: "captain", attack: 2 } } }
    ],
    clues: {
      c_blackout: { t: "A blackout, and one ship with every lantern lit", s: "Lt. Carver", x: "The Navy has ordered a strict blackout across the Bahamas against U-boats. Every night, a schooner with every lantern lit sails straight for the reef. The Coast Watch has not been able to fire on her, because nobody can find her by day." },
      c_boats: { t: "One boat a night", s: "Harbourmaster Pinder", x: "Every morning, one fisherman's boat is missing from the beach, with its owner's nets still on the thwarts. Fourteen since March. The reef is full of splinters." },
      c_wreck: { t: "The Mary Providence, 1799", s: "Church register", x: "The Mary Providence, a wrecker's schooner, went on the Governor's Harbour reef in a gale on 4 November 1799, with all eighty hands. She had been luring ships onto the rocks for eleven years." },
      c_signal: { t: "Three high, one low", s: "Obadiah Knowles", x: "The wreckers' signal: three lanterns high, one low, means 'ship in distress, come close.' It is what the schooner shows, and why the fishermen follow it." },
      c_bell: { t: "The ship's bell is in the church", s: "The church at Governor's Harbour", x: "The Mary Providence's ship's bell was taken off the wreck in 1800 and hung in the church. It has not been rung since the wreck." },
      c_oil: { t: "A dead man's oil", s: "Mabel Rolle", x: "A wrecker's lantern is lit with a dead man's oil, and can only be put out with seawater. Mabel's grandfather lit them as a boy. He said they burn whether you want them to or not." },
      c_captain: { t: "Captain Ezra Pyke", s: "The church register", x: "The schooner's master was Captain Ezra Pyke, hanged in Nassau for piracy in 1790 and cut down, and sailed again. He was lost with her in 1799, and the register records only: 'Master. Unshriven.'" }
    },
    npcs: {
      carver: N("Lt. Carver", "Royal Navy, blackout officer", "Crisp, sunburned and perpetually irritated, in a white uniform with a pencil behind one ear and a clipboard he holds like a shield.", F(0, 3, "short", 7, "none", { sex: "m" })),
      pinder: N("Ellis Pinder", "Harbourmaster", "A heavy, courteous Bahamian in a straw hat, who counts the boats each dawn and has started leaving the number unspoken.", F(3, 5, "short", 5, "hat", { sex: "m" })),
      mabel: N("Mabel Rolle", "Fisherman's widow", "A strong, straight-backed woman in a faded blue dress, with a pair of oars on her shoulder and the manner of someone who will not be told the sea is only water.", F(3, 5, "braids", 1, "headscarf", { sex: "f" })),
      knowles: N("Obadiah Knowles", "Old wrecker's grandson", "Ninety, near blind, in a rocker on a veranda, with a battered lantern in his lap that he runs his thumb over without stopping.", F(3, 5, "bald", 5, "none", { sex: "m" }))
    },
    enemies: {
      crew: { build: { name: "Drowned wrecker", type: "Undead", difficulty: "easy", sprite: "humanoid", hue: 190, dtype: "health", attack: 1, dies: "falls apart into weed and brine, and a lantern rolls away across the deck" } },
      captain: { build: { name: "Captain Ezra Pyke", type: "Undead", difficulty: "challenging", sprite: "humanoid", hue: 180, dtype: "health", core: { body: 3, mind: 2, spirit: 2 }, mods: ["Speech", "Tanky"],
        text: "The master of the Mary Providence. Lights: each round he lights another lantern; while all of them burn, his crew rise again. Cutlass: 5 Body. He is unshriven, and the sea can put out any lantern: seawater dropped on one puts it out for good. He answers to his own bell.", dies: "goes down in the lantern-light, and the sea pulls the schooner under, mast first" } }
    },
    encounters: {
      schooner: { name: "The Mary Providence, at the reef", theme: "sea", severity: 2, fightText: "The schooner comes out of nowhere, every lantern blazing, her sails shredded to ribbons. On her deck, eighty men in rags turn to look at you, and a tall man in a captain's coat lifts a lantern.", zones: [{ id: "a", name: "The boarding rail", col: 0, row: 0 }, { id: "b", name: "The deck", col: 1, row: 0 }, { id: "c", name: "The quarterdeck", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "captain", zone: "c" }, { t: "crew", zone: "b" }, { t: "crew", zone: "b", name: "Drowned wrecker (2)" }, { t: "crew", zone: "b", name: "Drowned wrecker (3)" }] }
    },
    start: "dock",
    scenes: {
      dock: { name: "The dock at Governor's Harbour", theme: "sea", mood: "tense", lighting: "shadow", weather: "sea", cast: ["carver", "pinder"],
        onEnter: [{ once: "in", steps: [
          { say: "Governor's Harbour, Eleuthera, a night in the spring of 1942. The war is a long way off, but not that far: the island is blacked out, every window shuttered, and the sea at dusk is a dark pewter slab under a darker sky. On the dock a Navy officer in a white uniform checks a clipboard under a hooded torch." },
          { talk: { npc: "carver", text: "Thank God. The Governor said you'd be sending someone. There's a ship out there with every lantern lit, and I can't prove it exists." } }] }],
        options: [
          K.ask("carver", [
            K.t("What are you seeing?", ["A schooner. Gaff-rigged, three masts, every lantern lit. She comes in toward the reef each night, near midnight, and the fishermen follow her. By morning there's a boat missing."], { free: true, clue: "c_blackout" }),
            K.t("Can you not fire on her?", "She's not on any chart, any radar, any picket report. By day there's nothing. We can't find her. We can only see her at night, and only the lights.", { clue: "c_blackout" }),
            K.t("Who has lost boats?", "Ask the harbourmaster. He keeps count.", { free: true, set: "pinder_known" }),
            K.t("What do the fishermen say?", [{ say: "He lowers his clipboard." }, "That they see a signal: three lanterns high, one low. And that it feels like someone calling. They say it isn't a Navy signal. I wouldn't know. I'm from Surrey."], { cha: 8, set: "signal_hint" })
          ], { label: "Talk to Lt. Carver", name: "the Lieutenant", bye: ["Don't use a light on the dock. I mean it."] }),
          K.ask("pinder", [
            K.t("How many boats?", ["Fourteen since March. One a night, regular as church. The owners are never found. Their nets are always left on the thwarts, neatly coiled. The boats are always found on the reef, broken, in the morning."], { free: true, clue: "c_boats" }),
            K.t("Where does the schooner come from?", "Nobody has seen her by day. Old Obadiah up on the hill says he knows her. He won't tell us which.", { free: true, set: "obadiah_known" }),
            K.t("Does it have a name?", [{ say: "He looks at the water." }, "The old people say it's the Providence. The Mary Providence. She went down in '99. My grandmother used to say she was a wrecker, and the sea took her for it."], { cha: 7, clue: "c_wreck", free: true })
          ], { label: "Talk to the harbourmaster", name: "Mr. Pinder", bye: ["Keep clear of the reef."] }),
          K.find("Look at the beach at dawn", "awareness", "easy", "A boat's nets, coiled in a neat heap on the shingle, as if the owner had stepped out for a moment. The tide has left a line of wet splinters up the beach, and in the splinters, a single brass lantern with the oil still warm.", "Boats, nets, shingle.", { clue: "c_boats", hint: "Easy" }),
          K.find("Examine the lantern left on the beach", "iq", "easy", "A brass ship's lantern, very old, with a wick that has not burned down. The oil in it is dark, and smells of tallow and the bottom of a well. A name is scratched under the base: 'Providence'.", "A lantern.", { clue: "c_oil", hint: "Easy" }),
          K.find("Watch the sea from the point until midnight", "willpower", "medium", "At midnight a low light comes up from the water, a long way out: not a ship's light, a lantern's, then three more, in a line, three high and one low. Your hands move toward the boat before you notice. You hold them back, only just.", "You look away for an instant, and the lantern is gone. When you look back, there is nothing.", { clue: "c_signal", hint: "Willpower, Medium", tags: ["signal"], failDamage: ["sanity", 2] }),
          K.go("To the church of St. Peter", "church"),
          K.go("To Mabel Rolle's house on the point", "mabel"),
          K.go("To Obadiah Knowles's veranda", "knowles", { if: "obadiah_known" })] },
      church: { name: "St. Peter's, Governor's Harbour", theme: "church", mood: "calm", lighting: "shadow", weather: "sea",
        onEnter: [{ once: "in", steps: [{ say: "A whitewashed stone church on a rise above the harbour, a small belfry, and a bell that no one rings. A rector's wife is arranging hibiscus in a jar and does not look up." }] }],
        options: [
          K.find("Read the church register for 1799", "iq", "easy", "In a faded hand under November 1799: 'The Mary Providence, schooner, lost on the reef in a gale. All hands. Master, Ezra Pyke: unshriven. God have mercy on a hard man.'", "Hymn numbers and baptisms. Nothing about the wreck.", { clue: ["c_wreck", "c_captain"], hint: "Easy" }),
          K.find("Examine the church bell", "awareness", "medium", "On the bell, under a hundred and forty years of verdigris, in raised letters: MARY PROVIDENCE, 1788. It was taken off the wreck in 1800. It has been silent ever since. When you strike it with a knuckle, the note goes out over the water, and, far away, something answers.", "A bell. Old. Heavy.", { clue: "c_bell", obj: "so2", tags: ["bell"], hint: "Awareness, Medium" }),
          K.go("Back to the dock", "dock")] },
      mabel: { name: "Mabel Rolle's house, the point", theme: "sea", mood: "calm", lighting: "shadow", weather: "sea", cast: ["mabel"],
        onEnter: [{ once: "in", steps: [{ say: "A small clapboard house on the point, a boat drawn up on a ramp, a pair of oars leaning against the wall. A strong woman in a faded blue dress is mending a net, and does not stop when you come near." }] }],
        options: [
          K.ask("mabel", [
            K.t("Did you lose someone?", ["My husband. The ninth boat. He saw the lights. He said: 'There's a ship in trouble, Mabel.' He was always going to help."], { free: true, clue: "c_boats" }),
            K.t("Do you know the lights?", "My grandfather lit them. As a boy. For the wreckers, on the point. He said a wrecker's lantern burns a dead man's oil, and you put it out with the sea, nothing else will do.", { clue: "c_oil", obj: "so3", free: true }),
            K.t("Will you take us out?", [{ say: "She puts the net down." }, "I'll take you to the reef. I won't follow a light. But I'll take you."], { cha: 7, set: "mabel_boat" })
          ], { label: "Talk to Mabel Rolle", name: "Mabel", bye: ["Don't answer the light."] }),
          K.go("Back to the dock", "dock")] },
      knowles: { name: "Obadiah Knowles's veranda", theme: "sea", mood: "weird", lighting: "shadow", weather: "sea", cast: ["knowles"],
        onEnter: [{ once: "in", steps: [{ say: "A veranda on the hill, a rocker, an old man in a straw hat with a battered brass lantern in his lap. He runs his thumb over it as you climb the steps, and says, without looking up: 'You'll be wanting to know about the lights.'" }] }],
        options: [
          K.ask("knowles", [
            K.t("What are the lights?", ["Three high, one low. 'Ship in distress, come close.' It's the wreckers' call. My grandfather's grandfather used it. It's a lie, you understand. It says: come and be helped. It means: come and be wrecked."], { free: true, clue: "c_signal", obj: "so1" }),
            K.t("Who is the captain?", "Pyke. Ezra Pyke. They hanged him in Nassau for piracy in '90 and cut him down, and he sailed again. The sea took him in '99. He'd not been shriven.", { clue: "c_captain", free: true }),
            K.t("How do we stop them?", [{ say: "He turns the lantern in his lap." }, "Their lanterns burn a dead man's oil. Only the sea puts them out. And the bell: they know their own bell. If it rings, they listen. Even the dead can't help it."], { cha: 8, set: "bell_hint" }),
            K.t("Why do you keep the lantern?", "So I'll know when they're near.", { cha: 11 })
          ], { label: "Talk to Obadiah", name: "Obadiah", bye: ["Don't follow a lantern."] }),
          K.go("Back to the dock", "dock"),
          K.go("Out to the reef, at midnight", "reef", { if: { all: [{ clue: "c_signal" }, { clue: "c_oil" }] } })] },
      reef: { name: "The reef at Governor's Harbour, midnight", theme: "sea", mood: "boss", lighting: "dark", weather: "storm",
        onEnter: [{ once: "in", steps: [{ say: "Midnight, the sea a black slab, a low wind and a loud surf on the reef. And out of nothing a schooner, three masts, every lantern blazing, three high and one low, sails straight toward the rocks." }, { objective: "po1" }] }],
        options: [
          { label: "Ring the Mary Providence's bell", hint: "Needs the church's bell", if: { obj: "so2" }, steps: [{ check: { aspect: "strength", cr: "medium", label: "Get the bell down to the point, and ring it across the water", who: "choose", tags: ["bell"],
            ok: [{ say: "The bell goes out over the water, long and flat, a hundred and forty years of silence broken in one note. On the schooner, eighty heads turn, as one. The lanterns waver. A tall man in a captain's coat lowers his, and listens. And then, one by one, they turn the schooner away from the reef." }, { set: "res_bell" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "You cannot get it down in time." }, { damage: { pool: "stability", amount: 3 } }] } }] },
          { label: "Show the true signal: three low, one high", hint: "Needs the wreckers' call", if: { obj: "so1" }, steps: [{ check: { aspect: "agility", cr: "challenging", label: "Swing the true lanterns before the schooner reaches the reef", who: "choose", tags: ["signal"],
            ok: [{ say: "You swing the lanterns, with Mabel at the oars, three low and one high: the reverse of the wreckers' call. It means: danger, keep away. On the schooner, eighty dead men see it, and for the first time in a hundred and forty years, hear their own warning." }, { set: "res_signal" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "You get one lantern up, and the schooner does not turn." }, { damage: { pool: "health", amount: 3 } }] } }] },
          { label: "Board the schooner and put out the lanterns with seawater", hint: "Needs a boat", if: "mabel_boat", steps: [{ goto: "schooner" }] }] },
      schooner: { name: "Aboard the Mary Providence", theme: "sea", mood: "boss", lighting: "dark", weather: "storm",
        onEnter: [{ say: "Mabel brings her skiff alongside. You climb a rotten rope up to a deck that is slick, and cold, and alive with lanterns." }],
        options: [{ label: "Face the crew", steps: [{ set: "res_fight" }, { combat: "schooner", win: [{ say: "The last lantern goes out in a bucket of the sea. The schooner groans, and slides back under the water, mast first, lantern-lit all the way down." }, { objective: "po2" }, { goto: "end" }] }] }] },
      end: { name: "Governor's Harbour, in the morning", theme: "sea", mood: "calm", lighting: "glow", weather: "none",
        onEnter: [{ once: "in", steps: [
          { say: "The morning is calm, and nobody is missing from the beach. For the first time since March, Harbourmaster Pinder reads out a number of boats, and the number is all of them." },
          { if: { flag: "res_bell" }, then: [{ say: "The bell rang the Mary Providence home. At dawn the church rector rang it again, once, in memory. It has rung for every wreck on that coast since." }] },
          { if: { flag: "res_signal" }, then: [{ say: "You showed the dead the true call, and they kept away from the reef. Sometimes, on very still nights, fishermen still see three lanterns low and one high, far out, on the water, going the other way." }] },
          { if: { flag: "res_fight" }, then: [{ say: "The Mary Providence is on the bottom, and Captain Pyke with her. The reef is clear." }] },
          { if: { obj: "so3" }, then: [{ say: "Mabel Rolle takes up her oars and goes fishing again." }] },
          { if: { obj: "so1" }, then: [{ say: "Old Obadiah finally sets down the brass lantern, and does not pick it up again." }] },
          { end: "win" }] }], options: [] }
    }
  });

  /* ======================================================================= 2016 · Vacancy */
  ADV.register({
    id: "vacancy", title: "Vacancy", setting: "Edinburgh, Old Town · 2016", year: 2016, level: [1, 9], agencies: ["WCA", "NSBD", "OID"], region: "europe", theme: "modern",
    summary: "Flat 4, 9 Candlemaker Row. Five stars, two hundred reviews, always available. There is no Flat 4 at 9 Candlemaker Row, and nobody who has stayed there has been seen since. The reviews keep coming in.",
    objectives: [
      { id: "po1", kind: "primary", t: "Find out what Flat 4 is, and who is running it", done: "A booking that was never made: the building's old Boarding Rule, from when 9 Candlemaker Row was a lodging-house for the condemned. It takes guests, and keeps them, and asks them, nicely, to leave a review." },
      { id: "po2", kind: "primary", t: "Close the listing, and bring the guests back", done: "The listing goes dark, and eleven people step out of a door that was never there." },
      { id: "so1", kind: "secondary", t: "Find the original lodging-house ledger", done: "The 1778 ledger of Mrs. Ogilvy's lodging-house: every guest recorded, in order, with 'did not depart' beside most.", benefit: { label: "The Boarding Rule", text: "You know what the Rule is, and how to break it. A bonus on every roll to check out.", bonus: { tags: ["checkout"], value: 2 } } },
      { id: "so2", kind: "secondary", t: "Get a former guest to talk", done: "Dougie, a stag-party straggler who left Flat 4 in the middle of the night, minus an hour and eleven friends.", benefit: { label: "What he left behind", text: "Dougie kept the key he took. A bonus on every roll to find the door.", bonus: { tags: ["door"], value: 2 }, flag: "have_key" } },
      { id: "so3", kind: "secondary", t: "Read the listing's host profile", done: "The host's name is 'Mrs. O.', last active 1778. Her reviews are all in the same voice.", benefit: { label: "The Host's voice", text: "+2 to your attacks against the Landlady: you know what she is.", combat: { enemy: "landlady", attack: 2 } } }
    ],
    clues: {
      c_listing: { t: "Flat 4, 9 Candlemaker Row", s: "The listing", x: "Five stars, two hundred and eleven reviews, always available. Photos of a cosy, old-fashioned room with a bed, a table and a very large, very ordinary window. The host is 'Mrs. O.'" },
      c_nodoor: { t: "There is no Flat 4", s: "Mr. Hume", x: "No. 9 Candlemaker Row has three flats and a basement. There is no Flat 4. The stair stops on the third floor. A door on the landing, behind the bins, that nobody has ever opened." },
      c_reviews: { t: "The reviews are written after the stay", s: "The platform", x: "Every review is posted after the guest has checked in and before they have checked out, in the first person, in the same voice, praising the stay and recommending others 'do come.' Several describe things that haven't happened yet." },
      c_rule: { t: "The Boarding Rule", s: "The lodging-house ledger", x: "In 1778 the building was a lodging-house for debtors awaiting the Tolbooth. The landlady, Mrs. Ogilvy, held that anyone who accepted a bed and a candle was a guest until they had paid in full, and could not leave until they had." },
      c_checkin: { t: "It begins when you click Accept", s: "The platform", x: "Every guest, without exception, clicked 'Accept booking'. The listing cannot take anyone who has not agreed. The Rule needs your consent, and an unsigned bill." },
      c_door: { t: "The door behind the bins", s: "The landing", x: "Behind the bins on the third landing is a door that is not on any plan. It has a number, painted in black: 4. It opens, if you have been invited." },
      c_keys: { t: "A guest keeps a key", s: "Dougie", x: "Dougie left Flat 4 at 3 a.m. with a key in his pocket he doesn't remember taking. It is a door-key with a paper tag: 'Mrs. O.'" }
    },
    npcs: {
      hume: N("Mr. Hume", "Neighbour, flat 2, No. 9", "A courteous, bewildered man in a cardigan, who has lived at No. 9 for thirty years and has started locking his door.", F(0, 5, "bald", 5, "none", { sex: "m" })),
      dougie: N("Dougie MacRae", "Stag party straggler", "Twenty-nine, hungover and shell-shocked, in a creased shirt with a lanyard still round his neck from some conference, and an eleven-friend-shaped hole in his weekend.", F(0, 3, "short", 7, "none", { sex: "m" })),
      fiona: N("Fiona Rae", "Trust and Safety, the booking platform", "Brisk, tired and conscientious, with a fleece, a headset round her neck, and the look of someone who has had to read two hundred and eleven reviews and cannot say why they upset her.", F(0, 3, "ponytail", 3, "none", { sex: "f" }))
    },
    enemies: {
      landlady: { build: { name: "Mrs. Ogilvy, the Host", type: "Beyond", difficulty: "challenging", sprite: "spirit", hue: 40, dtype: "sanity", range: 1, core: { body: 1, mind: 3, spirit: 3 }, mods: ["Occult"],
        text: "A landlady who never lets a guest go. Welcome: each round she offers an agent a bed and a candle; Willpower Medium or they sit down, and lose their next two actions. Bill: she heals when anyone is held. She cannot hurt anyone who has not accepted her booking, and cannot hold anyone whose bill has been paid.", dies: "closes her ledger, and goes out like a candle, and the door at the end of the corridor is only a wall" } },
      guest: { build: { name: "A held guest", type: "Human", difficulty: "easy", sprite: "humanoid", hue: 60, attack: 0, dtype: "health", dies: "sits down on the bed, and blinks, and starts to cry" } }
    },
    encounters: {
      flat4: { name: "Flat 4", theme: "interior", fightText: "The room is cosy, and old-fashioned, and warm. The window is very large, and shows a view of Candlemaker Row that is not the right way round. At a table in the corner an old woman in black looks up from a ledger. 'Oh,' says Mrs. Ogilvy, pleased. 'More guests.'", zones: [{ id: "a", name: "The door", col: 0, row: 0 }, { id: "b", name: "The sitting room", col: 1, row: 0 }, { id: "c", name: "The table", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "landlady", zone: "c" }, { t: "guest", zone: "b" }, { t: "guest", zone: "b", name: "A held guest (2)" }] }
    },
    start: "street",
    scenes: {
      street: { name: "Candlemaker Row, Edinburgh", theme: "modern", mood: "tense", lighting: "shadow", weather: "rain", cast: ["hume"],
        onEnter: [{ once: "in", steps: [
          { say: "Edinburgh in the rain, in the cold end of an October. Candlemaker Row runs down from George IV Bridge toward Greyfriars, a steep, cobbled lane of tall dark tenements. No. 9 is a narrow black building with three bells and a tired-looking door." },
          { say: "You have the listing open on a phone: Flat 4, 9 Candlemaker Row. Cosy, quiet, two hundred and eleven reviews. Five stars. Always available. You have the address in front of you. The stair outside ends at three." },
          { clue: "c_listing" },
          { talk: { npc: "hume", text: "You're not another one of those people with the phones, are you? There's no Flat Four. Never has been. I've told eleven people." } }] }],
        options: [
          K.ask("hume", [
            K.t("Has anyone come looking?", ["Eleven people, since July. With suitcases, bless them. Looking for Flat Four. I tell them it doesn't exist, and they laugh and say it's on the app. And they go up the stair."], { free: true, clue: "c_nodoor" }),
            K.t("Do they come back?", "I've never seen one come down. The bins are never full. The landing light stays on.", { clue: "c_door", free: true }),
            K.t("Have you been up there?", [{ say: "He turns the key in his own door." }, "Once. At three in the morning, on a night I couldn't sleep. There's a door behind the bins on the third landing. It has a number on it. In black. A four."], { cha: 6, set: "door_known" }),
            K.t("What was the building before?", "A lodging-house. For debtors, they say, before the Tolbooth. Mrs. Ogilvy's. She was a hard woman. They said nobody ever left her house who owed her a penny.", { cha: 10, clue: "c_rule", set: "ogilvy_known" })
          ], { label: "Talk to Mr. Hume", name: "Mr. Hume", bye: ["Don't take it. Don't accept."] }),
          K.find("Read the listing's reviews", "iq", "easy", "Two hundred and eleven five-star reviews. 'Cosy! Would stay again.' 'Mrs. O. was a delight.' They are in the first person, in a single voice, posted while the guest was still staying, and several describe things that haven't happened yet: 'We were a little sad to find the window did not open, but one never minds.'", "A great many five-star reviews.", { clue: "c_reviews", obj: "so3", hint: "Easy" }),
          K.go("Go up to the third landing", "landing", { if: "door_known" }),
          K.go("Find Fiona at the booking platform's office", "platform"),
          K.go("Find a guest who left", "dougie")] },
      platform: { name: "The platform's Edinburgh office", theme: "modern", mood: "calm", lighting: "glow", weather: "none", cast: ["fiona"],
        onEnter: [{ once: "in", steps: [{ say: "A bright, open-plan office above a bank on Princes Street, with beanbags, a table football and a wall of screens. A woman in a fleece with a headset round her neck leads you into a glass meeting room." }] }],
        options: [
          K.ask("fiona", [
            K.t("Tell us about the listing.", ["Flat 4, 9 Candlemaker Row. Registered in 2012 by a host whose ID we can't verify. No payments through us. No bookings through us. And yet: two hundred and eleven stays."], { free: true, clue: "c_listing" }),
            K.t("How do people book it?", [{ say: "She taps her screen." }, "That's the odd part. They all clicked 'Accept booking'. We have the logs. No one requests it. The system just offers it, and they accept."], { free: true, clue: "c_checkin" }),
            K.t("Can you delist it?", "Fourteen times. It reappears the next morning. The host's profile says: 'Mrs. O. Last active 1778.' It's a typo, obviously.", { cha: 7, obj: "so3", clue: "c_reviews" }),
            K.t("What do the reviews say?", [{ say: "She closes the laptop lid." }, "I've read two hundred and eleven. They all end the same way: 'Do come.' Not 'you must'. Not 'highly recommend'. 'Do come.'"], { cha: 11 })
          ], { label: "Talk to Fiona", name: "Fiona", bye: ["Please. Be careful what you click."] }),
          K.find("Search the platform's logs for the host's account", "iq", "medium", "The host's account was opened in 2012, from no IP address, with a payment method that is a name and a date: 'Mrs. O., 1778.' It has four hundred and three outstanding invoices, none ever paid. Beside each guest's name, a status: Pending.", "The logs are enormous.", { clue: ["c_checkin", "c_reviews"], hint: "Intelligence, Medium" }),
          K.go("Back to the street", "street")] },
      dougie: { name: "A pub on the Grassmarket", theme: "modern", mood: "calm", lighting: "shadow", weather: "rain", cast: ["dougie"],
        onEnter: [{ once: "in", steps: [{ say: "A cold, dim pub with a gas fire, and a young man in a creased shirt nursing a pint he isn't drinking. He has a conference lanyard round his neck, and he looks like he hasn't slept in a month." }] }],
        options: [
          K.ask("dougie", [
            K.t("You were in Flat 4?", ["Eleven of us. A stag weekend. We booked it on the app and it said it was one of those places that's always free. It was lovely. It was so cosy. It was ... lovely."], { free: true, clue: "c_nodoor" }),
            K.t("How did you get out?", "At three in the morning, I needed the loo, and the bathroom door was a corridor, and the corridor had a stair, and the stair went down. And I was out in the street, and it was a quarter to three, and I had a key in my pocket and no friends.", { clue: "c_keys", obj: "so2", free: true }),
            K.t("What did the landlady say?", [{ say: "He shudders." }, "She said: 'You'll leave a review, dear, won't you? The others did.' And then she said: 'Don't forget the bill.' I didn't see any bill."], { cha: 7, set: "bill_known" }),
            K.t("What was the bill?", "I think it's us. I think we're the bill. I think that's why she keeps us.", { cha: 11 })
          ], { label: "Talk to Dougie", name: "Dougie", bye: ["Please get them out. They're all my best mates."] }),
          K.go("Back to the street", "street"),
          K.go("Find the lodging-house ledger at the library", "library", { if: "ogilvy_known" })] },
      library: { name: "The Central Library, George IV Bridge", theme: "interior", mood: "calm", lighting: "glow", weather: "none",
        onEnter: [{ once: "in", steps: [{ say: "The Edinburgh Room of the Central Library: a long, hushed, high-ceilinged gallery of old maps and bound volumes, and a very polite librarian in a cardigan who says she has been expecting someone to ask." }] }],
        options: [
          K.find("Read Mrs. Ogilvy's lodging-house ledger", "iq", "medium", "A faded 1778 ledger: Mrs. Ogilvy's lodging-house, No. 9 Candlemaker Row. Guests by name, with a column for the bill: 'Paid' beside a few, and beside most, in her careful hand, 'Did not depart.' The final page has a note: 'The house keeps its guests. It is only manners.'", "The ledger is in a hand you cannot decipher.", { clue: "c_rule", obj: "so1", hint: "Intelligence, Medium" }),
          K.find("Ask the librarian about Mrs. Ogilvy", "charisma", "easy", "The librarian, fondly: 'Oh, Mrs. Ogilvy. She was a terror. She'd never turn a lodger out, if they were behind. She let them stay until they paid. Most of them didn't. The house was a prison with a doily.'", "She smiles. She has nothing to add.", { clue: "c_rule", hint: "Charisma, Easy" }),
          K.go("Back to the street", "street")] },
      landing: { name: "The third landing, 9 Candlemaker Row", theme: "interior", mood: "dread", lighting: "dark", weather: "none",
        onEnter: [{ once: "in", steps: [{ say: "A bare stairwell, a bulb on a timer, a row of overflowing bins on the landing, and behind them a door, grey with age, with a number painted on it in black: 4. A strip of light shows under it. You can hear, very faintly, a kettle." }, { objective: "po1" }] }],
        options: [
          K.find("Look at the door", "awareness", "medium", "The door has no handle on this side. It has a small brass plate, polished by many hands, engraved: 'Mrs. O. — Rooms for Gentlemen — Please Knock.' Under the plate someone has stuck a sticker, in the platform's colours: 5 stars.", "A door. Old. Painted.", { clue: "c_door", hint: "Awareness, Medium", tags: ["door"] }),
          { label: "Check out, properly, with the key and the bill", hint: "Needs the key, and the Rule", if: { all: ["have_key", { obj: "so1" }] }, steps: [{ check: { aspect: "charisma", cr: "challenging", label: "Settle the bill with Mrs. Ogilvy, and check everyone out", who: "choose", tags: ["checkout", "door"],
            ok: [{ say: "You knock, and the door opens on a cosy, warm, old-fashioned room. Mrs. Ogilvy is delighted. You offer her the key with its paper tag and settle, in the proper words, the bill of every guest, in the manner of her own house, for the whole of 1778. She stamps the ledger. Behind her, the room is full of people getting up." }, { set: "res_checkout" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "She is a very good landlady, and the bill is not yours to settle. She welcomes you in." }, { damage: { pool: "sanity", amount: 3 } }] } }] },
          { label: "Delist the account on the platform, at the door", hint: "Needs Fiona, and the host's account", if: { clue: "c_checkin" }, steps: [{ check: { aspect: "iq", cr: "medium", label: "Close Mrs. O.'s account while she is still logged in", who: "choose", tags: ["checkout"],
            ok: [{ say: "With Fiona on the phone, and the host's account on your own screen, you close it. The listing goes grey. The strip of light under the door goes out. Behind it, eleven people get up from a table, and the door, for the first time, opens on a stair." }, { set: "res_delist" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "The account will not close. The page says: 'Your host will respond shortly.'" }, { damage: { pool: "stability", amount: 3 } }] } }] },
          { label: "Go in, and take the Landlady", steps: [{ goto: "flat4" }] }] },
      flat4: { name: "Flat 4", theme: "interior", mood: "boss", lighting: "shadow", weather: "none",
        onEnter: [{ say: "You knock. The door opens, onto the cosy, old-fashioned room." }],
        options: [{ label: "Face Mrs. Ogilvy", steps: [{ set: "res_fight" }, { combat: "flat4", win: [{ say: "Mrs. Ogilvy closes her ledger, and goes out like a candle. In the room the guests rouse, and look about, and begin, one by one, to stand." }, { objective: "po2" }, { goto: "end" }] }] }] },
      end: { name: "Candlemaker Row, the next morning", theme: "modern", mood: "calm", lighting: "glow", weather: "rain",
        onEnter: [{ once: "in", steps: [
          { say: "Candlemaker Row, a wet Sunday morning. Eleven people walk down the stair of a building that has three flats, and out into the rain, blinking, with an hour missing from their weekend." },
          { if: { flag: "res_checkout" }, then: [{ say: "You paid the bill, in the proper words, and Mrs. Ogilvy let her guests go. The listing has been replaced by one for a perfectly ordinary flat in Leith." }] },
          { if: { flag: "res_delist" }, then: [{ say: "You closed the account, and the Host with it. The platform's Trust and Safety team has put a flag on every listing that says 'since 1778'." }] },
          { if: { flag: "res_fight" }, then: [{ say: "You broke the Landlady, and the door went with her. What she did to her guests is her bill, and now it is paid." }] },
          { if: { obj: "so1" }, then: [{ say: "The ledger goes to the Division, in a plastic sleeve." }] },
          { if: { obj: "so2" }, then: [{ say: "Dougie gets his friends back, and a stag weekend he'll never be able to explain." }] },
          { end: "win" }] }], options: [] }
    }
  });
})();
