/* ============================================================================
   NEW CASES, BATCH SIX: The Counting Stair (India, 1603) and The Salt Road
   (the Sahara, 1270). Written for the regions the board had nothing for.
   ========================================================================== */
(function () {
  const ADV = window.ADV, K = window.CASEKIT, F = K.face, N = K.person;

  /* ======================================================================= 1603 · The Counting Stair */
  ADV.register({
    id: "counting-stair", title: "The Counting Stair", setting: "Vaikunthpur, Rajasthan · 1603", year: 1603, level: [1, 9], agencies: ["OID"], region: "asia-south", theme: "desert",
    summary: "The stepwell at Vaikunthpur has one more step every monsoon. Pilgrims descend its long stair to bathe at the lowest landing, and do not climb back up. The headman keeps a tally on the village wall, and the number on the wall and the number of steps are always the same.",
    objectives: [
      { id: "po1", kind: "primary", t: "Learn what the stair is counting, and why", done: "The stepwell's builder, a stonecutter named Hari, bargained with the guardian of the well to make the water last through a famine: one step for every person it saved. The guardian is still counting, and has begun to count the living." },
      { id: "po2", kind: "primary", t: "Stop the count, and bring back those still on the stair", done: "The count ends. The last landing opens, and the pilgrims walk out into the light." },
      { id: "so1", kind: "secondary", t: "Read the inscription on the landing", done: "'For every life this water saves, a step; for every step, a name.' It is cut in the builder's own hand.", benefit: { label: "The inscription", text: "You know the terms of the bargain. A bonus on every roll to speak to the Counter in its own terms.", bonus: { tags: ["count"], value: 2 } } },
      { id: "so2", kind: "secondary", t: "Find the stonecutter's measuring rod", done: "Hari's brass measuring rod, kept by his granddaughter, marked in cubits. It measures the stair exactly: and it measures other things.", benefit: { label: "Hari's rod", text: "You can measure the stair. A bonus on every roll to find your way on it, and to end it.", bonus: { tags: ["stair"], value: 2 } } },
      { id: "so3", kind: "secondary", t: "Hear what the surviving child counted", done: "Kishan, ten, climbed back up alone. He counted every step, and found that the stair has one extra on the way up.", benefit: { label: "The extra step", text: "+2 to your attacks against the Counter: you know where it hides.", combat: { enemy: "counter", attack: 2 } } }
    ],
    clues: {
      c_tally: { t: "The tally on the wall", s: "Thakur Raghavendra", x: "The headman keeps a tally of the steps of the well on his courtyard wall: three hundred and eleven. The number of pilgrims taken since the well was dug is, exactly, three hundred and eleven." },
      c_steps: { t: "One more step every monsoon", s: "The well", x: "Every monsoon the stair has gained a step. The stone is old: you can see the weathering is identical on all of them. They are the same age." },
      c_hari: { t: "Hari the stonecutter", s: "Meera", x: "Hari, a stonecutter, dug the well in the great famine of 1590, when every other well in Vaikunthpur went dry. It gave water for six years, until he died. His granddaughter says he made a bargain, and wrote it on the lowest landing." },
      c_bargain: { t: "One step for every life saved", s: "The inscription", x: "'For every life this water saves, a step; for every step, a name.' The well was to count the lives it saved. It has begun to count all lives, and take the names." },
      c_names: { t: "The stair takes names", s: "The pilgrims", x: "The pilgrims who come back up are well, and refreshed, and cannot remember their own names. Those who do not come back have names cut into the wall of the lowest landing: three hundred and eleven of them." },
      c_child: { t: "Kishan counted on the way up", s: "Kishan", x: "Kishan, ten, climbed the stair alone, and counted. Going down: three hundred and eleven. Coming up: three hundred and twelve. There is one step on the way up that is not on the way down." },
      c_rod: { t: "The stair is not the same length twice", s: "Hari's rod", x: "Hari's rod measures the well at nine hundred and ninety-nine cubits. The stair, when you walk it, is longer. Every time." }
    },
    npcs: {
      thakur: N("Thakur Raghavendra", "Headman of Vaikunthpur", "A large, silver-moustached man in a green turban, with a tally of the well painted on the wall of his courtyard in careful whitewash, and a manner too polite to be reassuring.", F(2, 5, "short", 5, "hat", { sex: "m" })),
      meera: N("Meera", "Stonecutter's granddaughter", "A tall, spare woman in a faded orange sari, with callused hands and a cloth bundle she doesn't put down.", F(2, 5, "bun", 1, "headscarf", { sex: "f" })),
      dwarka: N("Pandit Dwarka", "Priest of the well-shrine", "A thin, anxious man in a saffron robe, whose prayers at the well-mouth are a little too rapid, and who has begun to count his own breaths.", F(2, 5, "bald", 5, "none", { sex: "m" })),
      kishan: N("Kishan", "Boy who climbed back", "Ten years old, solemn, with a smear of mud on his chin, who answers every question with a number.", F(2, 5, "short", 6, "none", { sex: "m" }))
    },
    enemies: {
      pilgrim: { build: { name: "Stair-walker", type: "Human", difficulty: "easy", sprite: "humanoid", hue: 30, attack: 0, dtype: "health", dies: "stops, and sits down on the step, and looks about, and asks what her name is" } },
      counter: { build: { name: "The Counter", type: "Beyond", difficulty: "challenging", sprite: "spirit", hue: 190, dtype: "stability", range: 1, core: { body: 1, mind: 3, spirit: 3 }, mods: ["Occult", "Elusive"],
        text: "The well's guardian, which counts. Count: each round it names a number; any agent who cannot say it back (Mindfulness Medium) loses their next action and one more name from their memory: 3 Sanity. It cannot be hurt on the step it hides on: find the extra step. Only Stability harms it.", dies: "stops counting, and the water rises, and for the first time it has no number" } }
    },
    encounters: {
      landing: { name: "The lowest landing", theme: "cave", lit: false, fightText: "The water rises on the stair behind you, step by step. Above, in the dark, a voice says numbers. On the walls, every name that was ever cut glows, one by one.", zones: [{ id: "a", name: "The upper stair", col: 0, row: 0 }, { id: "b", name: "The middle landing", col: 1, row: 0 }, { id: "c", name: "The lowest landing", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "counter", zone: "c" }, { t: "pilgrim", zone: "b" }, { t: "pilgrim", zone: "b", name: "Stair-walker (2)" }] }
    },
    start: "village",
    scenes: {
      village: { name: "Vaikunthpur", theme: "desert", mood: "dread", lighting: "glow", weather: "wind", cast: ["thakur"],
        onEnter: [{ once: "in", steps: [
          { say: "Rajasthan, in the dry season of 1603. A walled village of ochre houses, a baked-clay road, and at the heart of it a great square pit in the ground, the size of a courtyard, whose sides run down in steps, flight after flight, to a green dark far below. The stepwell. Nothing moves on the stair." },
          { talk: { npc: "thakur", text: "The Order. Welcome to Vaikunthpur. Please, be seated. You will take water? No, perhaps not. You will not take water." } }] }],
        options: [
          K.ask("thakur", [
            K.t("What is happening here?", ["Every monsoon, the stair gains one step. And every year, one pilgrim goes down to the lowest landing, and does not come back. We keep a tally. Look."], { free: true, clue: "c_tally" }),
            K.t("How many steps are there?", [{ say: "He points to the whitewashed wall of the courtyard, ruled in tally-marks." }, "Three hundred and eleven. It was three hundred and ten last monsoon. It was three hundred and nine before that. I stopped writing the names of the lost on the wall a long time ago. I could not make myself write them all."], { free: true, clue: "c_steps" }),
            K.t("Who built the well?", "A man named Hari, in the great famine, thirteen years before my father was born. He was a stonecutter, and a stubborn one. The well saved us. We have always been grateful.", { free: true, clue: "c_hari", set: "hari_known" }),
            K.t("Does the number on the wall mean something?", [{ say: "He looks at the wall." }, "Three hundred and eleven steps. Three hundred and eleven taken. It is the same number. I did not tell you. I would rather it were not."], { cha: 8, set: "headman_afraid" })
          ], { label: "Talk to the headman", name: "Thakur Raghavendra", bye: ["Do not go down alone."] }),
          K.find("Count the steps of the well", "iq", "easy", "From the rim, you count down the first flight, and the second, and you give up on the fourth. You count again, from the top: and arrive at a different number. The stair does not count the same way twice.", "Too many steps.", { clue: "c_steps", hint: "Easy" }),
          K.go("To the well-shrine", "shrine"),
          K.go("To the stonecutter's house", "meera", { if: "hari_known" }),
          K.go("To the village school, where the boy is", "boy")] },
      shrine: { name: "The well-shrine", theme: "village", mood: "calm", lighting: "shadow", weather: "wind", cast: ["dwarka"],
        onEnter: [{ once: "in", steps: [{ say: "A small shrine at the well-mouth, hung with marigolds and bells. A thin priest in saffron recites a prayer very quickly, and looks sideways at you, not breaking his rhythm." }] }],
        options: [
          K.ask("dwarka", [
            K.t("What do you pray?", ["For the water. That it be sweet. That it be sufficient. It is always sufficient. That is the difficulty."], { free: true }),
            K.t("Has anyone come back?", "The ones who return say the water was beautiful. They say it was cool. They have no names. I have given them new ones. I have a book.", { clue: "c_names" }),
            K.t("Who is the guardian of the well?", [{ say: "He stops praying for the first time." }, "In my grandfather's time we gave it a name. A counting-name. It was an old word for 'one who keeps the tally.' We have stopped saying it."], { cha: 8, set: "counter_name" }),
            K.t("Why do you count your breaths?", "Because it counts. And I should like to arrive at the end before it does.", { cha: 11 })
          ], { label: "Talk to Pandit Dwarka", name: "the priest", bye: ["The Lord keep the count."] }),
          K.find("Examine the shrine's offerings", "awareness", "easy", "Under the marigolds, a row of small clay lamps, each with a name painted on it in ochre: three hundred and eleven, in a long careful row, with the last one fresh.", "Flowers and clay.", { clue: "c_names", hint: "Easy" }),
          K.go("Back to the village", "village")] },
      meera: { name: "Hari's house", theme: "village", mood: "calm", lighting: "shadow", weather: "none", cast: ["meera"],
        onEnter: [{ once: "in", steps: [{ say: "A long low stone house at the edge of the village, a stonecutter's yard in front, chisels hung on the wall. A tall, spare woman in an orange sari is sorting measuring rods on a table. She stops when you come in." }] }],
        options: [
          K.ask("meera", [
            K.t("Tell us about Hari.", ["My grandfather. He dug the well in the great famine. He was stubborn: they said the ground was dry, he said the water was only deep. He dug for four years, and found it, and it saved us."], { free: true, clue: "c_hari" }),
            K.t("Did he bargain with something?", [{ say: "She puts down a rod." }, "He told my father, before he died: 'The water had a price, and I paid in steps.' He cut it into the stone of the lowest landing. He told us never to read it."], { clue: "c_bargain", free: true }),
            K.t("Do you have his rod?", "My grandfather's measuring rod, in brass. He measured every step with it. He would not use another. It's the only thing of his I kept.", { cha: 6, set: "rod_open", obj: "so2" }),
            K.t("Why did he say not to read it?", "Because he said whoever reads the stair, the stair reads.", { cha: 10 })
          ], { label: "Talk to Meera", name: "Meera", bye: ["Don't go down without a measure."] }),
          K.find("Measure the well with the rod", "iq", "medium", "Hari's rod says the well is nine hundred and ninety-nine cubits deep. You walk it: more. The rod is right, the stair is wrong. The difference, on every walk, is one.", "The measure does not make sense to you.", { if: "rod_open", clue: "c_rod", obj: "so2", hint: "Intelligence, Medium", tags: ["stair"] }),
          K.go("Back to the village", "village")] },
      boy: { name: "The village school", theme: "village", mood: "calm", lighting: "glow", weather: "none", cast: ["kishan"],
        onEnter: [{ once: "in", steps: [{ say: "A mud-brick room with a thatched roof, a slate and a single bench. A small boy sits cross-legged on the floor, drawing on the ground with a stick." }] }],
        options: [
          K.ask("kishan", [
            K.t("You went down the stair?", ["Yes. With my father. He did not come back up. I came up alone. I counted."], { free: true, clue: "c_child" }),
            K.t("How many steps?", "Three hundred and eleven, going down. Three hundred and twelve, coming up. There is one more. It's not on the way down.", { clue: "c_child", obj: "so3", free: true }),
            K.t("Where is the extra step?", [{ say: "He draws it in the dust." }, "In the middle. After the second landing. It's smaller than the others. It's where it lives. I think it counts from there."], { cha: 7, set: "extra_step" }),
            K.t("What did you hear at the bottom?", "Numbers. A voice, saying numbers. It says them politely. And then it said mine.", { cha: 9 })
          ], { label: "Talk to Kishan", name: "Kishan", bye: ["Don't say the number back."] }),
          K.go("Back to the village", "village"),
          K.go("Go down the stair", "stair", { if: { all: [{ clue: "c_bargain" }, { clue: "c_child" }] } })] },
      stair: { name: "The stair of Vaikunthpur", theme: "cave", mood: "dread", lighting: "dark", weather: "none",
        onEnter: [{ once: "in", steps: [{ say: "You go down, flight after flight, past the green water and the carved pillars, into a cool that is not the cool of stone. You count. You cannot help counting. Behind you, the stair continues to grow." }] }],
        options: [
          K.find("Count the steps, carefully, with the rod", "mindfulness", "medium", "You count, and Hari's rod measures, and you find it: between the second and third landings, a single step that is smaller than the others, set on a slant, and worn almost smooth. When you stand on it, the count in your head goes quiet.", "You lose your count at two hundred and twelve, and cannot find it again.", { if: { clue: "c_rod" }, set: "extra_found", hint: "Mindfulness, Medium", tags: ["stair"], failDamage: ["sanity", 3] }),
          K.find("Read the lowest landing's inscription", "faith", "medium", "The inscription, cut in a stonecutter's hand: 'For every life this water saves, a step; for every step, a name. This I swear, Hari, mason.' Beneath it, three hundred and eleven names: the last of them is the freshest, and the one before it is Kishan's father.", "The writing is too worn.", { clue: "c_bargain", obj: "so1", hint: "Faith, Medium", tags: ["count"] }),
          { label: "Give the Counter the count it wants", hint: "Needs the inscription, and the extra step", if: { all: [{ obj: "so1" }, "extra_found"] }, steps: [{ check: { aspect: "willpower", cr: "challenging", label: "Stand on the extra step, and say the number back", who: "choose", tags: ["count", "stair"],
            ok: [{ say: "You stand on the small slant step, and the voice says its number, and you say it back. And then you say the next, and the next, all the way down to the lowest landing, and up again. And when you reach the number of lives the well has saved, you say it aloud, and add: 'And that is all. The bargain is kept. The count is done.' The voice stops." }, { set: "res_count" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "You say the wrong number. The voice says yours." }, { damage: { pool: "sanity", amount: 4 } }] } }] },
          { label: "Stop the well from the top, with the monsoon", hint: "Needs the rod, and Meera's help", if: { all: [{ obj: "so2" }, "rod_open"] }, steps: [{ check: { aspect: "iq", cr: "medium", label: "Measure the feed-channel and divert the water", who: "choose", tags: ["stair"],
            ok: [{ say: "With Hari's rod and Meera's family map, you measure the feed-channel and divert the monsoon run-off into the old reservoir. By evening the well is dry. A voice somewhere deep in the stone says: 'One more.' And then falls silent." }, { set: "res_dry" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "The channel takes longer than you have." }, { damage: { pool: "health", amount: 3 } }] } }] },
          { label: "Face the Counter on the lowest landing", steps: [{ set: "res_fight" }, { combat: "landing", win: [{ say: "The Counter stops counting. The water at the bottom of the stair settles, and goes clear, and for the first time in three centuries it is only water." }, { objective: "po2" }, { goto: "end" }] }] },
          K.go("Climb back up", "village")] },
      end: { name: "Vaikunthpur, at dawn", theme: "desert", mood: "calm", lighting: "glow", weather: "none",
        onEnter: [{ once: "in", steps: [
          { objective: "po1" },
          { say: "Up the stair, in the grey of dawn, in twos and threes, come the pilgrims who have not been seen in weeks, blinking, thirsty, remembering their names. In the courtyard, the headman takes a brush to his whitewashed tally-wall, and for the first time in years, paints over a number." },
          { if: { flag: "res_count" }, then: [{ say: "You gave the Counter the count it wanted, and it stopped. The stair has not grown since. Every year at the monsoon, the village says the number aloud, once, together." }] },
          { if: { flag: "res_dry" }, then: [{ say: "You dried the well. It may be dug again, some day, deeper, by someone who has read the stone. For now the village draws water from the old reservoir, and does not look at the stair." }] },
          { if: { flag: "res_fight" }, then: [{ say: "You broke the Counter. The well is clean. The names are still cut into the lowest landing, three hundred and eleven of them, and Meera goes down every year to touch them." }] },
          { if: { obj: "so1" }, then: [{ say: "Meera copies the inscription out, and keeps one copy at the shrine, one at the well, and one in her granddaughter's hand." }] },
          { if: { obj: "so3" }, then: [{ say: "Kishan's father comes up the stair on the third day, and the boy counts him in." }] },
          { end: "win" }] }], options: [] }
    }
  });

  /* ======================================================================= 1270 · The Salt Road */
  ADV.register({
    id: "salt-road", title: "The Salt Road", setting: "Ain al-Milh, the Sahara · 1270", year: 1270, level: [1, 9], agencies: ["OID"], region: "africa-me", theme: "desert",
    summary: "Ain al-Milh is the last well on the salt road. By day it gives sweet water. By night, it gives salt, and every caravan that camps there leaves a man behind in the morning, standing in the sand, white as a pillar, with his eyes open.",
    objectives: [
      { id: "po1", kind: "primary", t: "Find out what weighs the caravans, and why", done: "A salt idol that was set at the well by the first caravan to find it, to weigh each man's debts before he drank. It has never stopped weighing, and has begun to take its fee in men." },
      { id: "po2", kind: "primary", t: "End the weighing, and free the standing men", done: "The pillars crumble into sand, and the men inside step out, gasping, thirsty and alive." },
      { id: "so1", kind: "secondary", t: "Read the caravan master's tally of debts", done: "Idris keeps a ledger of what every man in his caravan owes: money, favours, grudges. The idol's weighing matches it exactly.", benefit: { label: "The ledger of debts", text: "You know what each man owes. A bonus on every roll to settle the weighing.", bonus: { tags: ["weigh"], value: 2 } } },
      { id: "so2", kind: "secondary", t: "Find the scales the idol was made to hold", done: "A bronze pair of scales, buried under the well-curb, the original merchants' scales. Whoever holds them can weigh the idol in turn.", benefit: { label: "The merchants' scales", text: "You can weigh the Weigher. A bonus on every roll to break its hold, and its scales.", bonus: { tags: ["scales"], value: 3 }, flag: "have_scales" } },
      { id: "so3", kind: "secondary", t: "Learn how the water-seller crosses at night", done: "Bilal, the water-seller's boy, has crossed the well at night for years and never been weighed. He carries nothing.", benefit: { label: "Carrying nothing", text: "+2 to your attacks against the Weigher: it has no weight to find on a man with nothing owed.", combat: { enemy: "weigher", attack: 2 } } }
    ],
    clues: {
      c_pillars: { t: "A man left standing", s: "The camp", x: "At dawn, every caravan that has camped at Ain al-Milh has found one of its own standing in the sand a little way from the well, white as a pillar of salt, eyes open, mouth open. There are nineteen pillars round the well now." },
      c_salt: { t: "The well gives salt at night", s: "Idris", x: "By day, the well gives sweet water. After the sun goes down, a man who drinks finds his mouth full of salt, and in the morning he is standing." },
      c_idol: { t: "A salt idol under the palm", s: "The palm grove", x: "Beneath the single date-palm at the well stands an idol of salt: a squat figure holding a pair of scales, taller than a man, worn smooth. It is wet, though no rain has fallen in a month." },
      c_scales: { t: "The scales are not the idol's", s: "The well-curb", x: "The idol holds only one pan of its scales. The other is missing. Idris's grandfather said it was buried under the curb at the founding, so that no weighing could be finished." },
      c_debts: { t: "It weighs debts", s: "Idris's tally", x: "The ones who were taken were the ones who owed most: a man with a debt he'd refused to settle, a man who had cheated a widow. The idol weighs every man against what he owes, and the heaviest is left standing." },
      c_boy: { t: "The water-seller's boy is never weighed", s: "Bilal", x: "Bilal, the water-seller's boy, has crossed the well at night every week for years, and never been left standing. He says it is because he owns nothing and owes nothing." },
      c_founding: { t: "The first caravan", s: "The qadi", x: "The well was found in the year 400, by the first caravan to cross, led by a merchant named Sulayman, who set the idol and the scales at the well so no man should drink without being weighed. He wished the road honest. He did not think what weighing would become." }
    },
    npcs: {
      idris: N("Idris ibn Salim", "Caravan master", "A weathered, broad-shouldered man in an indigo turban, with a leather ledger tied to his belt and a quiet, exhausted authority.", F(3, 5, "short", 5, "hat", { sex: "m" })),
      hamza: N("Qadi Hamza", "Judge of Ain al-Milh", "An old, soft-spoken man in a white robe, whose chair under the palm has not been moved in forty years, and who has begun to arrange his own affairs.", F(3, 5, "bald", 5, "none", { sex: "m" })),
      zaynab: N("Zaynab", "Merchant widow", "A sharp-eyed woman in a dark-blue veil, who runs the only inn at the well and who counts every coin twice before she believes it.", F(3, 5, "headscarf", 5, "none", { sex: "f" })),
      bilal: N("Bilal", "Water-seller's boy", "Twelve, thin, barefoot and cheerful, with a goatskin of water on his back that he has never been seen to put down.", F(3, 5, "short", 6, "none", { sex: "m" }))
    },
    enemies: {
      pillar: { build: { name: "A standing man", type: "Human", difficulty: "easy", sprite: "humanoid", hue: 60, attack: 0, dtype: "health", dies: "crumbles into white sand, and the man inside is only a man, on his knees, gasping" } },
      weigher: { build: { name: "The Weigher", type: "Beyond", difficulty: "challenging", sprite: "construct", hue: 50, dtype: "stability", core: { body: 3, mind: 2, spirit: 3 }, mods: ["Occult", "Tanky"],
        text: "The idol of salt. Weighs: each round it weighs one agent; the more they owe, the harder it hits: 3 Health and Sanity for each point the agent is in debt in this tale. Pillar: an agent at 0 Stability becomes a standing man. It holds only one pan: it cannot finish a weighing without the other. Only Stability harms it.", dies: "the scales fall, the idol cracks down the middle, and the salt runs out of it like water" } }
    },
    encounters: {
      well: { name: "The well, at night", theme: "desert", lit: false, fightText: "At the stroke of midnight, the idol under the palm opens its eyes. The pillars round the well turn toward you, and the scales begin, very slowly, to swing.", zones: [{ id: "a", name: "The camp", col: 0, row: 0 }, { id: "b", name: "The pillars", col: 1, row: 0 }, { id: "c", name: "The palm", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "weigher", zone: "c" }, { t: "pillar", zone: "b" }, { t: "pillar", zone: "b", name: "A standing man (2)" }] }
    },
    start: "camp",
    scenes: {
      camp: { name: "Ain al-Milh, at dusk", theme: "desert", mood: "dread", lighting: "glow", weather: "wind", cast: ["idris"],
        onEnter: [{ once: "in", steps: [
          { say: "The Sahara, in the dry heart of the year 1270. Three days out from the last town, the caravan crests a dune at dusk, and below it, in a bowl of white sand, a well, a single date-palm, and a ring of low black tents. Round the well, standing in the dusk, are nineteen white pillars." },
          { say: "They have the shapes of men." },
          { clue: "c_pillars" },
          { talk: { npc: "idris", text: "Peace be upon you. You are the Order's people? Good. I have lost a man here in every caravan for three years. I cannot cross without the well. And I cannot make the well let me." } }] }],
        options: [
          K.ask("idris", [
            K.t("What happens at the well?", ["By day, it gives sweet water. By night, salt. A man who drinks after sundown finds his mouth full of it. In the morning he is standing in the sand, white as a pillar, with his eyes open."], { free: true, clue: "c_salt" }),
            K.t("Who is chosen?", "Not at random. I keep a ledger of what my men owe. The ones left standing are the ones who owe the most.", { clue: "c_debts", obj: "so1", cha: 7 }),
            K.t("Can we see the idol?", "Under the palm. It is old, older than the caravans. We do not go near it.", { free: true, set: "idol_known" }),
            K.t("Have you tried to cross without it?", [{ say: "He rubs his eyes." }, "I tried the long road, eight days round. The water-skins failed on the sixth. Four men died of thirst. The idol takes one man. The desert takes five."], { cha: 10 })
          ], { label: "Talk to the caravan master", name: "Idris", bye: ["Peace go with you. Do not drink after dark."] }),
          K.find("Taste the sand at the edge of the well", "faith", "easy", "Salt, so pure it is almost sweet. It has been ground very fine, like flour, by something that has had a long time. Under the sand there is more of it, in a layer, ruled flat, as if poured.", "Sand. Grit. Thirst.", { clue: "c_salt", hint: "Faith, Easy" }),
          K.find("Look at the nearest standing man", "awareness", "medium", "He is a man, and his hand is raised at his chest. The salt over him is not a coating: it is him. His eyes are open, and wet, and they follow you.", "A pillar. White. You cannot look at it.", { hint: "Awareness, Medium", clue: "c_pillars", failDamage: ["sanity", 2] }),
          K.go("To the palm grove and the idol", "palm", { if: "idol_known" }),
          K.go("To Zaynab's inn", "inn"),
          K.go("To the qadi's chair", "qadi"),
          K.go("Find the water-seller's boy", "boy")] },
      palm: { name: "The palm grove", theme: "desert", mood: "weird", lighting: "glow", weather: "wind",
        onEnter: [{ once: "in", steps: [{ say: "A single date-palm, very old, leaning over the well, and beneath it a squat, worn figure of salt as tall as a man, holding a pair of scales with only one pan." }] }],
        options: [
          K.find("Examine the idol", "iq", "medium", "A figure of salt, the shape of a seated merchant, holding up a pair of scales. Only one pan. The other has been snapped off at the chain. On the base, in old script: 'Weigh, that no man be wronged.'", "A lump of salt. You cannot tell what it was.", { clue: "c_idol", hint: "Intelligence, Medium", failClue: "c_idol" }),
          K.find("Search under the well-curb", "awareness", "medium", "Under the well-curb, wedged in a hollow in the stone, wrapped in rotted leather: a bronze pan, green with age, with a chain. It is the other half of the scales.", "The curb is solid stone.", { clue: "c_scales", obj: "so2", hint: "Awareness, Medium", tags: ["scales"] }),
          K.go("Back to the camp", "camp")] },
      inn: { name: "Zaynab's inn", theme: "interior", mood: "calm", lighting: "shadow", weather: "none", cast: ["zaynab"],
        onEnter: [{ once: "in", steps: [{ say: "A low mud-brick inn with a veranda of palm-trunks. A woman in a dark-blue veil counts coins on a table, and does not look up." }] }],
        options: [
          K.ask("zaynab", [
            K.t("How long has this been going on?", ["Three years. Before that, the well was as it had always been. It weighed, in its way. It never took anyone."], { free: true, clue: "c_debts" }),
            K.t("What changed?", "The qadi died. Qadi Yusuf. He weighed disputes under that palm for forty years. Now his son sits in the chair, and the idol... I think it missed him.", { clue: "c_founding", free: true, set: "qadi_known" }),
            K.t("What do you owe?", [{ say: "She stops counting." }, "More than I should. I have not been left standing, because I pay as I go. I pay for everything, in advance. I think that's the trick of it."], { cha: 7 })
          ], { label: "Talk to Zaynab", name: "Zaynab", bye: ["Pay what you owe before dark."] }),
          K.find("Read the inn's guest ledger", "iq", "easy", "Three years of caravans in a tight, even hand. Beside each name, a note of what he left owing, and in a red column, a note of those who were standing in the morning: always the same pattern. The heaviest debtors.", "Ledgers, in a hand like wire.", { clue: "c_debts", hint: "Easy" }),
          K.go("Back to the camp", "camp")] },
      qadi: { name: "The qadi's chair", theme: "desert", mood: "calm", lighting: "glow", weather: "wind", cast: ["hamza"],
        onEnter: [{ once: "in", steps: [{ say: "A chair beneath the palm, a prayer-mat and a pot of tea gone cold. An old man in a white robe sits in it with a ledger of his own on his knee and the peaceful, weary face of someone who has given away most of what he owns." }] }],
        options: [
          K.ask("hamza", [
            K.t("Who set the idol at the well?", ["The first caravan, in the year 400, led by a merchant named Sulayman. He was an honest man, and he wished the road honest. He made an idol that weighed what each man owed, so that no one should drink without being weighed."], { free: true, clue: "c_founding" }),
            K.t("Why does it weigh us now?", "Because it has not been weighed itself. It has no other pan. A weighing is a contract between two parties. It has been holding one pan for eight hundred years, and has grown heavy.", { clue: "c_scales", free: true }),
            K.t("What do you owe?", [{ say: "He smiles, a little sadly." }, "I owe my father his silence, and I never asked him why. I have been settling my accounts for a year. I do not think I shall be the one."], { cha: 8 }),
            K.t("How would you end it?", "By weighing it. Put the other pan to the scales, and weigh the weigher. And if it is found to owe, let it pay.", { cha: 11, set: "weigh_known" })
          ], { label: "Talk to Qadi Hamza", name: "the qadi", bye: ["Balance your own accounts, first."] }),
          K.go("Back to the camp", "camp"),
          K.go("Stay at the well past midnight", "midnight", { if: { clue: "c_scales" } })] },
      boy: { name: "The water-seller's tent", theme: "desert", mood: "calm", lighting: "glow", weather: "wind", cast: ["bilal"],
        onEnter: [{ once: "in", steps: [{ say: "A small brown tent at the edge of the camp, a stack of goatskins, and a barefoot boy of twelve sitting on his heels, offering a ladle of water to anyone who wants one. His own throat looks dry." }] }],
        options: [
          K.ask("bilal", [
            K.t("How do you cross the well at night?", ["I just walk. I never drink. I carry my own. And I've nothing. Nothing in my pockets, nothing owed. There's nothing on me to weigh."], { free: true, clue: "c_boy", obj: "so3" }),
            K.t("Does it look at you?", "It looks. It looks for a long time. And then it looks away, like it's been embarrassed.", { clue: "c_boy", free: true }),
            K.t("Would you carry something for us?", [{ say: "He holds out his hands, palms up." }, "If you say what it is."], { cha: 7, set: "bilal_carry" })
          ], { label: "Talk to Bilal", name: "Bilal", bye: ["Peace."] }),
          K.go("Back to the camp", "camp")] },
      midnight: { name: "The well, at midnight", theme: "desert", mood: "boss", lighting: "dark", weather: "night",
        onEnter: [{ once: "in", steps: [{ say: "The stars over the Sahara, thick as spilled salt. The well, under its palm, gives a low dry sigh. Nineteen pillars turn toward you, and the idol under the palm opens its eyes." }, { objective: "po1" }] }],
        options: [
          { label: "Weigh the Weigher with the merchants' scales", hint: "Needs the second pan, and the qadi's words", if: { all: ["have_scales", "weigh_known"] }, steps: [{ check: { aspect: "iq", cr: "challenging", label: "Hang the second pan, and weigh the idol against what it has taken", who: "choose", tags: ["scales", "weigh"],
            ok: [{ say: "You hang the green bronze pan on the idol's broken chain, and set the idol's own salt in it. The scales swing, and settle: nineteen men, and the weight of eight hundred years. The idol looks at the balance, as if for the first time, and finds itself in debt. 'I owe,' it says, in a voice like sifted sand. And it pays. The pillars crumble." }, { set: "res_weigh" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "The scales do not balance. The idol weighs you." }, { damage: { pool: "sanity", amount: 4 } }] } }] },
          { label: "Settle every man's debt before the weighing", hint: "Needs Idris's ledger", if: { obj: "so1" }, steps: [{ check: { aspect: "charisma", cr: "medium", label: "Get the caravan's men to settle what they owe, aloud, before the idol", who: "choose", tags: ["weigh"],
            ok: [{ say: "One by one, the men of the caravan step up and say what they owe, and to whom, and promise to pay. Idris reads the ledger aloud. The scales swing, and find nothing to take, and the idol's eyes close. At dawn there is no new pillar. And the old ones are still standing." }, { set: "res_settle" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "A man will not settle. The idol takes him." }, { damage: { pool: "stability", amount: 3 } }] } }] },
          { label: "Face the Weigher", steps: [{ set: "res_fight" }, { combat: "well", win: [{ say: "The salt idol cracks, from the scales up. The nineteen pillars sag, and the men inside step out of them, gasping, thirsty, alive." }, { objective: "po2" }, { goto: "end" }] }] }] },
      end: { name: "Ain al-Milh, at dawn", theme: "desert", mood: "calm", lighting: "glow", weather: "none",
        onEnter: [{ once: "in", steps: [
          { say: "At dawn the well gives sweet water, and it keeps giving it. By midday, the caravan has filled every skin. The men crowd at the well, and no one is left standing." },
          { if: { flag: "res_weigh" }, then: [{ say: "You weighed the Weigher, and it paid. The idol is a pile of sweet salt, and the caravans of the salt road take a little of it each year, in memory." }] },
          { if: { flag: "res_settle" }, then: [{ say: "You got every man to settle what he owed. The idol sleeps, and the well will weigh again; the qadi has begun to teach the caravan masters the ritual of paying aloud." }] },
          { if: { flag: "res_fight" }, then: [{ say: "You broke the idol, and the weighing with it. Honest men will have to weigh one another now, in the old way, and it will not be easy." }] },
          { if: { obj: "so1" }, then: [{ say: "Idris burns half his ledger, and keeps the other, and pays what he owes." }] },
          { if: { obj: "so3" }, then: [{ say: "Bilal is given a donkey, a tent and a licence to sell water at the well, in his own name." }] },
          { end: "win" }] }], options: [] }
    }
  });
})();
