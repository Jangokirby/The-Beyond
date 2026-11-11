/* ============================================================================
   REBUILT CASES, BATCH TWO: The Hour of the Fog (1888) and The Trench Chorus (1916).
   ========================================================================== */
(function () {
  const ADV = window.ADV, K = window.CASEKIT, F = K.face, N = K.person;

  /* ======================================================================= 1888 · The Hour of the Fog */
  ADV.register({
    id: "hour-of-the-fog", title: "The Hour of the Fog", setting: "London, Wapping · 1888", year: 1888, level: [1, 9], agencies: ["WCA", "OID"], region: "europe", theme: "fog",
    summary: "A yellow fog rolls off the Thames each dawn, and the people it passes come home wearing the face of someone they lost, or do not come home at all. Scotland Yard has begun to cooperate with a very quiet association.",
    objectives: [
      { id: "po1", kind: "primary", t: "Find where the fog comes from, and what it wants", done: "The Wapping Gas Works: a cistern flooded in 1861, with forty families still in it. The fog is their grief, looking for faces to put on." },
      { id: "po2", kind: "primary", t: "End the Fog Mother", done: "The fog thins at dawn and does not come back. The people it took wake in their own faces." },
      { id: "so1", kind: "secondary", t: "Put Mrs. Pell's husband to rest", done: "The thing at her supper table is laid to rest, and she keeps the Bible he left her.", benefit: { label: "A widow's Bible", text: "A bonus on every roll to lay the dead to rest.", bonus: { tags: ["farewell"], value: 2 } } },
      { id: "so2", kind: "secondary", t: "Learn what the lamplighter knows", done: "A steady, true-trimmed flame holds the fog back. Tam Rudd's wife is in the cistern.", benefit: { label: "A lamplighter's flame", text: "A bonus on rolls in the fog, and +2 to your attacks against the Fog Mother.", bonus: { tags: ["fog"], value: 2 }, combat: { enemy: "mother", attack: 2 } } },
      { id: "so3", kind: "secondary", t: "Recover the company's ledger of the 1861 dead", done: "The Wapping Gas Company kept a list of the families who lived above the cistern and never dug them out.", benefit: { label: "Forty families", text: "You can say their names. A bonus on every roll to speak for them.", bonus: { tags: ["names"], value: 2 } } }
    ],
    clues: {
      c_faces: { t: "The fog gives the living the faces of the dead", s: "Inspector Crewe", x: "Eleven residents have been found standing in the street at dawn, blank, wearing the face of someone they lost. A drowned son. A wife in the graveyard. They don't know their own names." },
      c_gas: { t: "The lamps burn lower every night", s: "Tam the lamplighter", x: "The Wapping lamps burn lower every night. The gas is being drawn off somewhere, down toward the river." },
      c_pell: { t: "The husband at the table", s: "Mrs. Pell", x: "Her husband drowned in March. Four nights ago he sat down for supper. He eats nothing. He grows more solid every night." },
      c_light: { t: "Fog fears a steady flame", s: "Tam the lamplighter", x: "Lamps in the lower quarter burn bluer where the fog won't come. A lamplighter's flame, trimmed true, holds it back." },
      c_flood: { t: "The flood of 1861", s: "The gas company", x: "In the surge of 1861 the river poured into the new gas cistern under the river wall. Forty families from the tenement above were drowned in it. The company capped it and never dug them out." },
      c_register: { t: "No burials for 1861", s: "St. Peter's register", x: "The parish register for the autumn of 1861 has no burials for the Wapping tenement. Forty families, and not one line. They were never buried." },
      c_cistern: { t: "A cistern that should be empty", s: "The gas works", x: "The works' own plan shows the cistern capped and dry. The valve wheel is warm, and the iron of the cap sweats yellow." }
    },
    npcs: {
      crewe: N("Inspector Crewe", "Scotland Yard", "A stout Scot in a damp bowler hat, who has stopped pretending not to be afraid.", F(0, 3, "short", 5, "beard", { sex: "m" })),
      tam: N("Tam Rudd", "Lamplighter", "Wiry, soot-faced, with a long brass pole slung over one shoulder like a pilgrim's staff.", F(0, 1, "short", 3, "hat", { sex: "m" })),
      pell: N("Mrs. Pell", "Widow", "Black dress, red hands, a teacup she has not drunk from.", F(0, 4, "bun", 5, "none", { sex: "f" })),
      hargreaves: N("Mr. Hargreaves", "Clerk of the Wapping Gas Company", "A thin, careful man with ink to the wrist and a bad conscience he has trained like a lapdog.", F(0, 5, "parted", 7, "none", { sex: "m" }))
    },
    enemies: {
      wisp: { build: { name: "Fog Wisp", type: "Spirit", difficulty: "easy", sprite: "spirit", hue: 55, dtype: "sanity", range: 1, dies: "thins and drifts apart" } },
      mother: { build: { name: "The Fog Mother", type: "Folklore", difficulty: "challenging", sprite: "spirit", hue: 70, dtype: "sanity", range: 1, variable: "sanity", core: { body: 0, mind: 2, spirit: 3 }, mods: ["Elusive"],
        text: "Forty families' grief. Mirror: each round she wears the face of someone an agent has lost, and that agent must pass Willpower Medium or lose their next action. She cannot stand in a steady flame, and she answers to a name: speak the right one and she stops.", dies: "thins, and from the thinning fall forty small sighs, one after another" } }
    },
    encounters: {
      street: { name: "Wapping Old Stairs", theme: "fog", fightText: "The fog folds into shapes at the edge of the lamplight.", zones: [{ id: "a", name: "Gaslight", col: 0, row: 0 }, { id: "b", name: "Stair landing", col: 1, row: 0 }, { id: "c", name: "River edge", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "wisp", zone: "b" }, { t: "wisp", zone: "c" }] },
      cistern: { name: "The gas cistern", theme: "cave", lit: false, fightText: "The fog rises from the dark water in the shape of a woman, and then of many.", zones: [{ id: "a", name: "Iron gantry", col: 0, row: 0 }, { id: "b", name: "Valve wheel", col: 1, row: 0 }, { id: "c", name: "The water", col: 1, row: 1 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "mother", zone: "c" }, { t: "wisp", zone: "b" }, { t: "wisp", zone: "b", name: "Fog Wisp (2)" }] }
    },
    start: "yard",
    scenes: {
      yard: { name: "Wapping High Street", theme: "fog", mood: "calm", lighting: "shadow", weather: "rain", cast: ["crewe"],
        onEnter: [{ once: "in", steps: [
          { say: "Half past four in the morning, and you can barely see the other side of the street. Wapping is wet brick and warehouse cranes and the slap of the Thames somewhere close, and over all of it a fog the colour of old mustard that tastes of copper." },
          { say: "Inspector Crewe waits under a gas lamp that burns dim and blue, collar up, a damp bowler pulled low. He doesn't offer his hand. He is looking past you into the fog, the way a man watches a dog he doesn't trust." },
          { talk: { npc: "crewe", text: "You'll be the Association. Good. I've run out of people who'll listen to me without sending for a doctor." } }] }],
        options: [
          K.ask("crewe", [
            K.t("What has been happening here?", ["It comes off the river at four, regular as a clock. It rolls up the stairs and along the high street and into every house with a crack under the door.", "By dawn there's a dozen of them stood in the street, blank, wearing a face."], { clue: "c_faces" }),
            K.t("Whose faces?", [{ say: "Crewe takes his hat off, turns it in his hands, puts it back on." }, "Mrs. Annie Doyle, forty-one, stood in her doorway on Thursday with her drowned son's face on. His face. Freckles and all. She didn't know her name. She wanted to go down to the river."], { cha: 6, set: "faces_known" }),
            K.t("Who else knows about this?", "The lamplighters. Tam Rudd in particular: he's started carrying his pole like a pikestaff. And there's a widow on Pier Head, a Mrs. Pell. Her neighbours say her husband's come home for supper.", { free: true, set: "pell_known", then: [{ set: "tam_known" }] }),
            K.t("What do you think it is?", ["I'm a Presbyterian and a policeman, so I don't think anything at all.", { say: "He lowers his voice." }, "But I've stood out here every night for a fortnight, and I'd swear on my mother it's looking for someone."], { cha: 10, set: "crewe_fear" })
          ], { label: "Talk to Inspector Crewe", name: "Crewe", hint: "Scotland Yard, out of his depth", bye: ["Mind the fog. If you see someone you know in it, keep walking."] }),
          K.go("Find the lamplighter, Tam Rudd", "lamps", { if: "tam_known" }),
          K.go("Visit Mrs. Pell on Pier Head", "pell", { if: "pell_known" }),
          K.go("Go to St. Peter's, the parish church", "church"),
          K.go("Go to the Wapping Gas Works", "gasworks")] },
      lamps: { name: "The lamp round, Wapping Stairs", theme: "fog", mood: "tense", lighting: "shadow", weather: "rain", cast: ["tam"],
        onEnter: [{ once: "in", steps: [{ say: "A man with a long brass pole is working his way up the street, reaching up to each lamp in turn, turning the gas, adjusting the mantle. He does it with the care of a man who thinks he is doing something much bigger." }] }],
        options: [
          K.ask("tam", [
            K.t("What are you doing?", "Trimming. A steady flame holds it back. Don't ask me how I know. I only know that the lamps I trim true, the fog won't cross.", { clue: "c_light" }),
            K.t("Why are the lamps dim?", ["The gas is going somewhere. The pressure's down every night, an hour before the fog. Someone's drawing it down toward the river."], { clue: "c_gas" }),
            K.t("Why do you do this?", [{ say: "His brass pole has stopped moving." }, "My wife went down to the water in '61. I was on the round. I trimmed the lamp outside our house to a pinpoint that night, and I've trimmed it to a pinpoint ever since, so she'd find the way back."], { cha: 8, obj: "so2", set: "tam_wife" }),
            K.t("Where did she go?", "To the gas works. A whole tenement, forty families, in the surge. The company said it was a flood and walled it up. Nobody went in after.", { cha: 11, clue: "c_flood" })
          ], { label: "Talk to Tam", name: "Tam", bye: ["Mind the dark between the lamps."] }),
          K.find("Watch where the fog won't cross", "awareness", "medium", "Where the lamp is trimmed true, the fog stops dead at the edge of the light, as if at a wall. It piles up there like snow against a window.", "Fog. Lamps. You can't tell which is which.", { hint: "Awareness, Medium", clue: "c_light", tags: ["fog"], failDamage: ["sanity", 2] }),
          K.go("Back to the high street", "yard")] },
      pell: { name: "Mrs. Pell's kitchen, Pier Head", theme: "interior", mood: "dread", lighting: "shadow", weather: "none", cast: ["pell"],
        onEnter: [{ once: "in", steps: [{ say: "A small tidy kitchen. The table is laid for two. In the second chair sits a thin man in a drowned man's good coat, with his hands folded, who looks at you with a pleasant, empty face." }] }],
        options: [
          K.ask("pell", [
            K.t("When did he come back?", ["Four nights ago, at supper. He sat down. He did not speak. He eats nothing. And every night he is more solid, and I am less."], { clue: "c_pell" }),
            K.t("Is it your husband?", [{ say: "She does not look at him." }, "He wears his coat and his face. He doesn't have his habits. He's never once asked after the cat."], { cha: 7 }),
            K.t("Will you let us lay him to rest?", ["I'll let you. I want him back. I know he's not coming. I know the thing at the table is not him."], { cha: 9, set: "pell_leave" })
          ], { label: "Talk to Mrs. Pell", name: "Mrs. Pell", bye: ["Please be kind to him. Whatever he is."] }),
          { label: "Lay the thing at the table to rest", hint: "Faith, Medium", if: "pell_leave", steps: [{ check: { aspect: "faith", cr: "medium", label: "Say the words over what sits at the table", who: "choose", tags: ["farewell"],
            ok: [{ say: "You say what you would say over any grave: his name, and the day, and a prayer. The figure at the table listens, the way a child listens to a story it knows, and then it stands, and bows to his widow, and is only fog, running out under the door." }, { objective: "so1" }],
            fail: [{ say: "The words do not take. It looks at you with all the patience in the world." }, { damage: { pool: "sanity", amount: 2 } }] } }] },
          K.find("Look through Mr. Pell's papers", "iq", "easy", "In his Bible: a ticket from the gas company's Christmas dinner of 1860, and a name in the margin of the family page: his sister, Emily, 'taken with the others, October 1861.' Not buried. Not found.", "A Bible, a pipe, a rent book.", { clue: "c_flood", hint: "Easy" }),
          K.go("Back to the high street", "yard")] },
      church: { name: "St. Peter's, Wapping", theme: "church", mood: "calm", lighting: "shadow", weather: "none",
        onEnter: [{ once: "in", steps: [{ say: "A low brick church, cold, and smelling of wet hymn-books. The vicar is out among the sick. The parish register lies open on the lectern." }] }],
        options: [
          K.find("Read the parish register for 1861", "iq", "medium", "Autumn of 1861 has no entries for the tenement on Cooper's Wharf. Forty families, and not one burial. Beside the page for October, in a later hand: 'Flooded. See company.'", "Ten thousand names in a cramped hand. Nothing stands out.", { clue: ["c_register", "c_flood"], hint: "Intelligence, Medium" }),
          K.find("Ask the sexton about the old tenement", "charisma", "easy", "The sexton, over a pipe, says the Cooper's Wharf tenement fell silent in October '61. Nobody asked, and the company paid for a new wall.", "He doesn't want to talk about it.", { clue: "c_flood", hint: "Charisma, Easy" }),
          K.go("Back to the high street", "yard")] },
      gasworks: { name: "The Wapping Gas Works", theme: "interior", mood: "tense", lighting: "shadow", weather: "fire", cast: ["hargreaves"],
        onEnter: [{ once: "in", steps: [{ say: "Gas holders like drums, a smell of coal-tar, and under it a deeper smell of river. A clerk meets you at the gate with a ledger held to his chest." }] }],
        options: [
          K.ask("hargreaves", [
            K.t("Tell us about the cistern.", ["It was capped in 1862. Dry. We have the plans."], { free: true, clue: "c_cistern" }),
            K.t("Was it flooded in 1861?", [{ say: "His hand stops moving on the ledger." }, "The river surged. The tenement above was a slum. The company's liability was nil, and nobody could have gone in. That is the record."], { cha: 6, clue: "c_flood" }),
            K.t("May we see the ledger?", [{ say: "He holds it a moment longer." }, "I have kept it for twenty-seven years. I have not been able to throw it out."], { cha: 9, set: "ledger_open", obj: "so3" }),
            K.t("What do you hear at night?", "Water, in a cistern that has no water in it.", { cha: 12 })
          ], { label: "Talk to Mr. Hargreaves", name: "the clerk", bye: ["I have things to do."] }),
          K.find("Read the company's ledger of the 1861 tenement", "iq", "easy", "Forty families, by name and by trade, with their children's names in a smaller hand. The final page: 'Tenement abandoned. No further liability.'", "Rows of names, none of them readable in this light.", { if: "ledger_open", clue: "c_register", hint: "Easy" }),
          K.find("Go down to the cistern cap", "awareness", "medium", "The iron cap over the cistern sweats yellow in the lamplight. The valve wheel is warm to the touch, and the cap hums, very faintly, on a long single note.", "A great deal of iron, and a great deal of dark.", { clue: "c_cistern", hint: "Awareness, Medium" }),
          K.go("Back to the high street", "yard"),
          K.go("Wait for the fog at four in the morning", "dawn", { if: { all: [{ clue: "c_flood" }, { clue: "c_cistern" }] } })] },
      dawn: { name: "Four in the morning", theme: "fog", mood: "boss", lighting: "dark", weather: "rain",
        onEnter: [{ once: "in", steps: [{ say: "At four the fog comes off the river like breath on a mirror. It rolls up the stairs, down the high street, and into the cracks under every door. In the lamplight, shapes gather at its edges: drowned children, a woman with a lamp, a man in a good coat." }, { objective: "po1" }] }],
        options: [
          { label: "Speak the names of the forty families", hint: "Needs the ledger, and your voice", if: { obj: "so3" }, steps: [{ check: { aspect: "charisma", cr: "challenging", label: "Say every name in the ledger, and mean it", who: "choose", tags: ["names", "farewell"],
            ok: [{ say: "You read them one after another, out loud, into the fog: surnames, trades, the children in their smaller hand. The shapes at the edge of the light stop moving. One by one, they turn toward the river and lie down in it, as if into a bed." }, { set: "res_names" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "Your voice cracks on the ninth family. The fog turns toward you." }, { damage: { pool: "sanity", amount: 3 } }] } }] },
          { label: "Light every lamp in the lower quarter, true and steady", hint: "Needs Tam's craft", if: { obj: "so2" }, steps: [{ check: { aspect: "agility", cr: "medium", label: "Light every lamp on the stairs before the fog reaches them", who: "choose", tags: ["fog"],
            ok: [{ say: "You, Tam, and half of Wapping run the stairs with brass poles and matches. One by one the lamps steady and blue. The fog piles up against them like snow, and stops, and is forced back down the stairs, toward the water, and into its cistern." }, { set: "res_lamps" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "You're a lamp short. The fog gets through." }, { damage: { pool: "stability", amount: 3 } }] } }] },
          { label: "Take the Fog Mother in the cistern", steps: [{ goto: "cistern_fight" }] }] },
      cistern_fight: { name: "The cistern", theme: "cave", mood: "boss", lighting: "dark", weather: "none",
        onEnter: [{ say: "You open the cap. The air that comes out is warm and yellow and tastes of copper." }],
        options: [{ label: "Face the Fog Mother", steps: [{ set: "res_fight" }, { combat: "cistern", win: [{ say: "The fog thins at the water's edge, and from the thinning fall forty small sighs, one after another." }, { objective: "po2" }, { goto: "end" }] }] }] },
      end: { name: "Wapping, in the morning", theme: "fog", mood: "calm", lighting: "glow", weather: "none",
        onEnter: [{ once: "in", steps: [
          { say: "The fog thins at dawn, and does not come back. On the high street, eleven people in their own faces blink in the morning sun and ask what day it is." },
          { if: { flag: "res_names" }, then: [{ say: "The forty families are named, and a stone will be cut for them in St. Peter's churchyard, paid for by the Gas Company, with the clerk's own savings behind it." }] },
          { if: { flag: "res_lamps" }, then: [{ say: "The fog went back down into the cistern, and the cap was bolted. It will sleep as long as the lamps burn true. Tam has been made Wapping's first Lamplighter-in-Chief, and does not have to be asked twice." }] },
          { if: { flag: "res_fight" }, then: [{ say: "The Fog Mother is gone. The faces are gone with her. You will remember, for a long time, whose face she wore for each of you." }] },
          { if: { obj: "so1" }, then: [{ say: "Mrs. Pell keeps the Bible, and feeds the cat." }] },
          { if: { obj: "so2" }, then: [{ say: "Tam turns the lamp outside his old house down to a pinpoint, one last time, and then, for the first time in twenty-seven years, turns it up." }] },
          { end: "win" }] }], options: [] }
    }
  });

  /* ======================================================================= 1916 · The Trench Chorus */
  ADV.register({
    id: "trench-chorus", title: "The Trench Chorus", setting: "Western Front · 1916", year: 1916, level: [1, 9], agencies: ["WCA", "NSBD", "OID"], region: "europe", theme: "trench",
    summary: "Men in Sector Nine hear singing from no-man's land at night. Four have walked out to join it. The Association has been asked to find out why before the whole line follows.",
    objectives: [
      { id: "po1", kind: "primary", t: "Find out who is singing, and why", done: "A choir of dead men from a German company caught in the same shell crater in 1914, singing the one hymn they knew while they ran out of air. It is calling the living to finish the verse." },
      { id: "po2", kind: "primary", t: "Stop the men walking out", done: "The line holds, and the hymn goes quiet at night." },
      { id: "so1", kind: "secondary", t: "Find the German hymn book", done: "A pocket hymnal off a dead Feldwebel, with one hymn marked. It is the one they sing.", benefit: { label: "The hymn, in their own tongue", text: "You can sing it back. A bonus on every roll to answer the Chorus.", bonus: { tags: ["sing"], value: 2 } } },
      { id: "so2", kind: "secondary", t: "Get a sentry to tell what he heard", done: "Private Eddowes heard his brother's voice in the choir. His brother is not dead; he's in a hospital in Rouen.", benefit: { label: "A sentry's trust", text: "A bonus on every roll to resist the call: a man who knows what it sounds like is a steadier hand.", bonus: { tags: ["call"], value: 2 } } },
      { id: "so3", kind: "secondary", t: "Map the crater", done: "The crater's lip and its mouth: where the choir stands, and the one way in.", benefit: { label: "A way through the wire", text: "You cross no-man's land unseen: no rolls against the wire or the flares.", flag: "wire_mapped" } }
    ],
    clues: {
      c_walkers: { t: "Four men walked out", s: "Captain Hollis", x: "Four men have walked out of the line at night, singing. Two came back at dawn with their eyes open, and have not spoken since. Two did not." },
      c_hymn: { t: "A hymn nobody knows", s: "The sentries", x: "The sentries all describe the same hymn. Slow. In German. A tenor, a bass, and a boy's treble somewhere in the middle. None of them know the words." },
      c_crater: { t: "A shell crater at the sap-head", s: "Lt. Prosser", x: "A big shell crater, forty yards out, from a mine in 1914. Both sides fought for it and gave it up. Some of the German company that held it never came out." },
      c_dead: { t: "A choir of the dead", s: "The listening post", x: "At the listening post you can hear them: three dozen voices, very close, very still. They are not marching. They are standing in a circle." },
      c_call: { t: "The call is to a verse", s: "The listening post", x: "The hymn stops one line short, over and over, and waits. The men who walked out were not summoned: they were asked to finish it." },
      c_air: { t: "They died singing", s: "The German prisoner", x: "A prisoner from the same company says: they were buried when the mine went off. They sang the last hymn they had while the air ran out. They had thirty-seven voices. One was a boy of fifteen." },
      c_wire: { t: "The wire thins at the crater", s: "Lt. Prosser", x: "The wire in front of the crater was cut by shell-fire in the last bombardment, and nobody has repaired it. There is a way through, if you can find it in the dark." }
    },
    npcs: {
      hollis: N("Captain Hollis", "Company commander, Sector Nine", "Tired, polite, and extremely clean-shaven for the front, with the look of a man who has stopped telling anyone he doesn't sleep.", F(0, 5, "short", 7, "none", { sex: "m" })),
      prosser: N("Lieutenant Prosser", "Sap officer", "A young, mud-caked subaltern with a trench map folded to the size of his palm and an eagerness he is trying not to show.", F(0, 3, "short", 7, "none", { sex: "m" })),
      eddowes: N("Private Eddowes", "Sentry · heard his brother", "A boy of nineteen with raw red hands and an expression like someone listening for a footstep.", F(0, 4, "short", 6, "none", { sex: "m" })),
      kessler: N("Gefreiter Kessler", "German prisoner · from the choir's company", "A thin man in a grey greatcoat, hands tied, not afraid, and listening, the way you listen to music you know.", F(0, 5, "short", 6, "none", { sex: "m" }))
    },
    enemies: {
      voice: { build: { name: "The Walking Chorister", type: "Undead", difficulty: "easy", sprite: "humanoid", hue: 210, dtype: "sanity", range: 1, dies: "sings one note too long, and stops" } },
      chorus: { build: { name: "The Chorus", type: "Spirit", difficulty: "challenging", sprite: "spirit", hue: 30, dtype: "stability", range: 1, core: { body: 0, mind: 3, spirit: 3 }, mods: ["Occult"],
        text: "Thirty-seven voices in one. Verse: each round the Chorus sings a line, and anyone who has not answered with the hymn takes 2 Sanity and steps one zone closer. Only Stability harms it. It cannot finish the hymn without an answering voice: when the verse is answered, it loses an action.", dies: "finishes the hymn, in a hundred slow voices, and the circle breaks into men who are only dead" } }
    },
    encounters: {
      crater: { name: "The crater, no-man's land", theme: "trench", lit: false, fightText: "In the dark at the bottom of the crater, thirty-seven men stand in a circle. As one, they turn their heads to you, and begin to sing.", zones: [{ id: "a", name: "The lip", col: 0, row: 0 }, { id: "b", name: "The slope", col: 1, row: 0 }, { id: "c", name: "The circle", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "chorus", zone: "c" }, { t: "voice", zone: "b" }, { t: "voice", zone: "b", name: "The Walking Chorister (2)" }] }
    },
    start: "arrive",
    scenes: {
      arrive: { name: "Sector Nine, a support trench", theme: "trench", mood: "tense", lighting: "shadow", weather: "rain", cast: ["hollis"],
        onEnter: [{ once: "in", steps: [
          { say: "Duckboards, mud to the knee, and the smell: wet wool, tobacco, chloride of lime, and underneath, the sweet thing you do not name. It is twilight. The guns are quiet. That is what they tell you to be afraid of." },
          { say: "Captain Hollis meets you in a dugout lit by a single candle in a bully-beef tin. He has asked for the Association. He has not told his own colonel." },
          { talk: { npc: "hollis", text: "They'll tell you I'm a man who's lost four. I've lost forty to wounds and thought nothing of it. These four, I want to know about." } }] }],
        options: [
          K.ask("hollis", [
            K.t("What happened?", ["Four men have walked out of the line at night, over the parapet, into no-man's land. Singing. Two came back at dawn with their eyes open. They won't speak. The other two, we've not found."], { free: true, clue: "c_walkers" }),
            K.t("Singing what?", "The sentries say it's a hymn. In German. They don't know the words. It carries, and the men can't unhear it.", { clue: "c_hymn" }),
            K.t("Is it the enemy?", ["It's not their line. Their line is two hundred yards further. This is something between."], { cha: 6, clue: "c_crater" }),
            K.t("Is there anything you haven't told us?", [{ say: "He closes his eyes, briefly." }, "I've started to hear it myself. At night. Faintly. It's not a bad tune."], { cha: 10, set: "hollis_hears" })
          ], { label: "Talk to the captain", name: "the captain", bye: ["Be careful. It's nicer than it should be."] }),
          K.find("Read the battalion war diary", "iq", "easy", "A week of flat entries in the adjutant's hand: 'Quiet. Pte. Marsh missing. Quiet. Pte. Dunn missing. Singing reported.' The word singing appears in the margin, crossed out, and written again.", "Dates, rations, casualties. Nothing stands out.", { clue: "c_walkers", hint: "Easy" }),
          K.find("Look at the two who came back", "awareness", "medium", "The two who came back sit on their bunks with their eyes open and their lips moving. Nothing comes out. Their feet are wet to the knee, and one of them has a small brass button in his fist that is not British.", "Two blank faces. They do not look at you.", { clue: "c_crater", hint: "Awareness, Medium", failDamage: ["sanity", 1] }),
          K.go("Go up to the sap-head", "sap"),
          K.go("Visit the sentries on the fire step", "fire"),
          K.go("See the German prisoner at the back of the line", "prisoner", { if: { clue: "c_walkers" } })] },
      sap: { name: "The sap-head", theme: "trench", mood: "tense", lighting: "dark", weather: "night", cast: ["prosser"],
        onEnter: [{ once: "in", steps: [{ say: "A narrow trench, half-flooded, running out into no-man's land. At the end of it, a listening post, a sandbagged hole with a sentry in it, and beyond that, the dark." }] }],
        options: [
          K.ask("prosser", [
            K.t("What's out there?", "A crater, forty yards. A mine in '14. Both sides fought for it and gave it up. Some of the Germans never came out.", { clue: "c_crater" }),
            K.t("Can we cross?", ["There's wire. But the last bombardment cut it in front of the crater, and nobody's mended it. If you know where to look, there's a gap."], { free: true, clue: "c_wire", set: "wire_hint" }),
            K.t("Have you been out?", "Once. To the lip. I heard them. They're not marching. They're standing in a circle, and I could count them, and there were thirty-seven.", { cha: 7 })
          ], { label: "Talk to Lieutenant Prosser", name: "Prosser" }),
          K.find("Listen at the post", "awareness", "medium", "At the post you hear them: three dozen voices, very close, very still. They are not marching. They are standing in a circle. And the hymn stops, always one line short, and waits.", "You hear wind, and rats, and your own heartbeat.", { hint: "Awareness, Medium", clue: ["c_dead", "c_call"], tags: ["call"], failDamage: ["sanity", 2] }),
          K.find("Chart the wire and the crater edge", "iq", "medium", "By flare-light and sense, you sketch it: the lip, the slope, the one good approach. The gap in the wire is eleven paces left of the stake with the red rag.", "Too dark, too wet, too close.", { if: "wire_hint", obj: "so3", hint: "Intelligence, Medium" }),
          K.go("Back to the support trench", "arrive")] },
      fire: { name: "The fire step", theme: "trench", mood: "dread", lighting: "shadow", weather: "rain", cast: ["eddowes"],
        onEnter: [{ once: "in", steps: [{ say: "A fire step, a row of sleeping men, a sentry standing very still with his rifle held in front of him, listening." }] }],
        options: [
          K.ask("eddowes", [
            K.t("What did you hear?", ["A hymn. A tenor and a bass and a boy somewhere in the middle. I thought it was lovely."], { clue: "c_hymn" }),
            K.t("Did you know any of the voices?", [{ say: "He swallows." }, "My brother's. Georgie's. He's in the Rifle Brigade. He's not dead. I had a letter on Tuesday. But I heard him."], { cha: 6, obj: "so2", set: "brother_heard" }),
            K.t("Why did you not walk out?", "Because I said to myself: it's not the hymn that's wrong, it's that they are asking. Nobody should ask you for something and not say what.", { cha: 9 })
          ], { label: "Talk to Private Eddowes", name: "Eddowes", bye: ["Don't go out there alone."] }),
          K.find("Search the men's kit for the ones who walked out", "iq", "easy", "In a missing man's pack, wrapped in a handkerchief: a small German pocket hymnal, torn out at one page, taken from a dead Feldwebel in a crater in '15. It has been marked, in pencil, at a hymn.", "Kit and letters and tins of bully beef.", { clue: "c_hymn", obj: "so1", hint: "Easy" }),
          K.go("Back to the support trench", "arrive")] },
      prisoner: { name: "The prisoners' cage", theme: "trench", mood: "calm", lighting: "shadow", weather: "rain", cast: ["kessler"],
        onEnter: [{ once: "in", steps: [{ say: "A wire pen behind the line, with three bored sentries and one prisoner in a grey greatcoat, who looks up when you come near and, very slightly, nods." }] }],
        options: [
          K.ask("kessler", [
            K.t("Do you know the hymn?", [{ say: "He says nothing for a long moment. Then, quietly, he hums the first line." }, "It is the Fourth Company's. We had it from the chaplain. We sang it every evening."], { clue: "c_hymn" }),
            K.t("What happened to the Fourth Company?", "A mine, in December of '14. The crater. Thirty-seven were buried. They sang the last hymn they had, while the air ran out. One was a boy of fifteen.", { free: true, clue: "c_air" }),
            K.t("Why are they calling men out?", [{ say: "He closes his eyes." }, "The hymn has twelve lines. They sang eleven. The boy was the twelfth voice, and he died before he could."], { cha: 8, clue: "c_call" }),
            K.t("Will you help us?", "I will tell you the last line. I will not sing it. It is theirs.", { cha: 11, set: "kessler_line" })
          ], { label: "Talk to the prisoner", name: "Kessler", bye: ["Please. Be gentle with them."] }),
          K.go("Back to the support trench", "arrive"),
          K.go("Go out into no-man's land, at night", "out", { if: { all: [{ clue: "c_dead" }, { clue: "c_air" }] } })] },
      out: { name: "No-man's land", theme: "trench", mood: "dread", lighting: "dark", weather: "night",
        onEnter: [{ once: "in", steps: [{ say: "Over the parapet in the dark, on your belly in the wet, the flares going up and down behind you, and the hymn, the whole way, coming nearer. Forty yards. The wire is where Prosser said it would be." }, { objective: "po1" }] }],
        options: [
          { label: "Get through the wire", if: { not: "wire_ok" }, steps: [{ if: { flag: "wire_mapped" }, then: [{ say: "You find the gap eleven paces left of the red rag, and go through it as if there were a path." }, { set: "wire_ok" }], else: [{ check: { aspect: "agility", cr: "medium", label: "Cross the wire without a flare catching you", who: "choose",
            ok: [{ say: "You are through, on your bellies, and nothing fires." }, { set: "wire_ok" }],
            fail: [{ say: "A flare goes up. A machine gun, somewhere left, answers it." }, { damage: { pool: "health", amount: 4 } }, { set: "wire_ok" }] } }] }] },
          { label: "Sing the hymn, and finish it", hint: "Needs the hymnal, and the last line", if: { all: ["wire_ok", { obj: "so1" }, "kessler_line"] }, steps: [{ check: { aspect: "faith", cr: "challenging", label: "Sing the twelfth line in German, in time", who: "choose", tags: ["sing"],
            ok: [{ say: "You stand at the lip of the crater, and when the hymn stops one line short, you sing the line. Thirty-seven men in a circle turn their heads to you, and the boy in the middle lifts his chin and joins in. When the verse is finished, they are quiet, and then, one by one, they lie down." }, { set: "res_sing" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "Your voice cracks on the last line. They turn on you." }, { damage: { pool: "sanity", amount: 3 } }] } }] },
          { label: "Fill in the crater with the engineers", hint: "Needs the map, and Prosser's men", if: { all: ["wire_ok", { obj: "so3" }] }, steps: [{ check: { aspect: "strength", cr: "medium", label: "Collapse the lip into the crater, with the sappers", who: "choose",
            ok: [{ say: "The sappers pack the charges at the lip, and the crater falls in on itself with a muffled whump. The hymn goes on for a few seconds, from the ground, and then it stops." }, { set: "res_bury" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "The charges fail, and the crater rings." }, { damage: { pool: "stability", amount: 3 } }] } }] },
          { label: "Go down into the circle", if: "wire_ok", steps: [{ set: "res_fight" }, { combat: "crater", win: [{ say: "The circle breaks. The dead men lie down in the mud where they stand, and for the first time in two years the crater is silent." }, { objective: "po2" }, { goto: "end" }] }] }] },
      end: { name: "The line, at dawn", theme: "trench", mood: "calm", lighting: "glow", weather: "none",
        onEnter: [{ once: "in", steps: [
          { say: "Dawn comes grey over Sector Nine, and for the first time in a fortnight no one in the line has heard singing in the night." },
          { if: { flag: "res_sing" }, then: [{ say: "You gave them what they were calling for: the last line. In the morning a German padre under a white flag asks quietly if the crater might be left unshelled, and no one on either side refuses." }] },
          { if: { flag: "res_bury" }, then: [{ say: "The crater is buried. Thirty-seven men and a boy lie under it. A small wooden cross appears there a week later, and no one will say who set it." }] },
          { if: { flag: "res_fight" }, then: [{ say: "You broke the circle. It will haunt some of you." }] },
          { if: { obj: "so2" }, then: [{ say: "Private Eddowes writes to his brother Georgie in Rouen, and puts in a line he was not going to put in." }] },
          { if: { obj: "so3" }, then: [{ say: "Prosser's map is kept, and sent up the line, and for a time, no-man's land in front of Sector Nine is quiet." }] },
          { end: "win" }] }], options: [] }
    }
  });
})();
