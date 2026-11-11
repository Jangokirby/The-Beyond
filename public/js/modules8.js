/* ============================================================================
   NEW CASES, BATCH SEVEN: The Last Servo (Australia, 1983) and The Man in
   White Shoes (the Amazon, 1927).
   ========================================================================== */
(function () {
  const ADV = window.ADV, K = window.CASEKIT, F = K.face, N = K.person;

  /* ======================================================================= 1983 · The Last Servo */
  ADV.register({
    id: "last-servo", title: "The Last Servo", setting: "The Nullarbor, Australia · 1983", year: 1983, level: [1, 9], agencies: ["NSBD", "WCA", "EHG", "OID"], region: "oceania", theme: "desert",
    summary: "Four hundred kilometres of nothing between the last two towns on the Eyre Highway, and in the middle of it a roadhouse that is not on any map. Travellers who stop for the night leave in the morning, and drive on, and are found a week later, at the wheel, years older or years younger than they were.",
    objectives: [
      { id: "po1", kind: "primary", t: "Find out what the roadhouse is selling, and what it takes", done: "The Last Servo sells whatever you ask for. It takes the same worth in time. Ask for a meal, and lose an hour. Ask for a bed, and lose a night. Ask for a way home, and lose the years." },
      { id: "po2", kind: "primary", t: "End the trade, and give back what was taken", done: "The pumps stop, the clock starts, and what was taken from the travellers is returned." },
      { id: "so1", kind: "secondary", t: "Hear the ranger's warning about the road at night", done: "Ray has driven the Nullarbor for thirty years, and will not stop at the Servo after dark. His country has always told people to keep going.", benefit: { label: "Keep going", text: "You know what not to ask for. A bonus on every roll to resist the Attendant's offers.", bonus: { tags: ["ask"], value: 3 } } },
      { id: "so2", kind: "secondary", t: "Find the old station logbook", done: "The original owner's logbook from 1962: every fill, every night, with a note on the last page: 'Nobody stays at a place that isn't there.'", benefit: { label: "A true clock", text: "You can restart the clock from the logbook. A bonus on every roll to stop the trade.", bonus: { tags: ["clock"], value: 2 } } },
      { id: "so3", kind: "secondary", t: "Find out what Marj asked for", done: "Marj Dunmore, who runs the Servo, asked it for a way to keep the place open, years ago. It said yes.", benefit: { label: "Marj's bargain", text: "+2 to your attacks against the Attendant: you know the price it already took.", combat: { enemy: "attendant", attack: 2 } } }
    ],
    clues: {
      c_aged: { t: "Found at the wheel, years out", s: "Constable Brodie", x: "Four travellers in two months have been found at the wheel of their cars on the Eyre Highway, a week after they left Madura: two aged thirty years, one a child, one a stranger to the photograph in his wallet. All had stopped at 'a roadhouse' the night before." },
      c_clock: { t: "The clock says 3:17", s: "The Servo", x: "The Servo's wall clock says 3:17. It has said 3:17 for as long as anyone can remember, in a place where every other clock keeps time. Travellers mention it: 'It must be broken.'" },
      c_ask: { t: "It gives you what you ask", s: "Annika", x: "Annika stopped for a coffee and a bed. She got a coffee and a bed, which were better than they had any right to be. In the morning, she was thirty-one hours older in a face that had been twenty-two." },
      c_pumps: { t: "The pumps count down", s: "The Servo", x: "The petrol pumps' dials do not count up. They count down, in minutes and seconds: the amount of time you have left to leave." },
      c_marj: { t: "Marj has not aged", s: "The Servo", x: "Marj Dunmore has run the Last Servo since 1962. She looks forty. There is a photograph on the wall of her on the day it opened, and she looks forty in that, too." },
      c_ray: { t: "The ranger keeps going", s: "Ray", x: "Ray, a local ranger who has driven the Nullarbor for thirty years, has never stopped at the Servo after dark. He says the country has always told people to keep going, and it is only the newcomers who stop." },
      c_log: { t: "A logbook with a last page", s: "The cellar", x: "The original station-owner's logbook in the cellar, 1962 to 1971. The last entry is in a different hand: 'I asked for it to stay open. It said yes. It did not say for how long.'" }
    },
    npcs: {
      brodie: N("Constable Brodie", "Police, Madura", "A young, sunburned constable in a uniform dark at the armpits, with a notebook he keeps opening and closing.", F(0, 3, "short", 6, "none", { sex: "m" })),
      marj: N("Marj Dunmore", "Owner of the Last Servo", "Brisk, welcoming, in a faded apron over a floral dress, with a smile that has been on her face for twenty-one years and has begun to show it.", F(0, 4, "bob", 1, "none", { sex: "f" })),
      annika: N("Annika Lindqvist", "Backpacker, 22 (or 53)", "A woman with a Swedish accent and a face that cannot decide how old it is, wrapped in a blanket in the back of a Land Cruiser.", F(0, 3, "braids", 3, "none", { sex: "f" })),
      ray: N("Ray Hillier", "Ranger", "A lean, weathered man in a khaki uniform and a battered hat, who speaks slowly and does not look at the roadhouse when he talks about it.", F(3, 5, "short", 6, "hat", { sex: "m" }))
    },
    enemies: {
      attendant: { build: { name: "The Attendant", type: "Beyond", difficulty: "challenging", sprite: "humanoid", hue: 30, dtype: "stability", core: { body: 2, mind: 3, spirit: 3 }, mods: ["Occult", "Speech"],
        text: "It serves whatever you ask for, and takes the same worth in time. Order: each round it offers one agent something they want; Willpower Medium to refuse, or they age one year in a round (3 Health, 3 Sanity) and lose their next action. Stopped clock: it cannot act while a true clock runs. Only Stability harms it.", dies: "smiles, politely, takes off its apron, and goes; the pumps stop, and the clock on the wall ticks over to 3:18" } },
      patron: { build: { name: "A regular", type: "Human", difficulty: "easy", sprite: "humanoid", hue: 40, attack: 0, dtype: "health", dies: "sits down heavily on a stool, a lot younger, or a lot older, and asks where he is" } }
    },
    encounters: {
      servo: { name: "The Last Servo, 3:17", theme: "interior", fightText: "The clock says 3:17. The pumps begin to count down. Behind the counter, where Marj was, a pleasant-faced figure in an apron smiles, and asks what you would like.", zones: [{ id: "a", name: "The forecourt", col: 0, row: 0 }, { id: "b", name: "The dining room", col: 1, row: 0 }, { id: "c", name: "The counter", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "attendant", zone: "c" }, { t: "patron", zone: "b" }, { t: "patron", zone: "b", name: "A regular (2)" }] }
    },
    start: "madura",
    scenes: {
      madura: { name: "Madura Pass Roadhouse", theme: "desert", mood: "tense", lighting: "glow", weather: "wind", cast: ["brodie"],
        onEnter: [{ once: "in", steps: [
          { say: "Western Australia, a Friday afternoon in the summer of 1983. The Eyre Highway runs east across the Nullarbor in a long, dead-straight line, and at the top of the Madura escarpment it begins to look like a road to nowhere. The Madura roadhouse is a corrugated-iron shed with a single bowser. Beside it, a police Land Rover, and a young constable with a notebook." },
          { talk: { npc: "brodie", text: "Thank God. They told me the Division would send someone. I've had four people turn up at the wheel of their cars, a week out, and not one of them can tell me where they spent the night." } }] }],
        options: [
          K.ask("brodie", [
            K.t("What happened to them?", ["Four people, two months. Found at the wheel, a week after they left here. Two aged thirty years. One a child. One I can't identify at all, he doesn't match his photograph. All stopped at 'a roadhouse' the night before. There's no roadhouse."], { free: true, clue: "c_aged" }),
            K.t("Where is it?", "Between here and Eucla. Somewhere in the middle. Four hundred kilometres of nothing. No roadhouse on any map. But they all describe it. A white building, a row of pumps, a clock.", { free: true, clue: "c_clock", set: "servo_known" }),
            K.t("Who are the survivors?", "Annika Lindqvist, a Swedish backpacker, is in the clinic in Madura. And a driver, a Mr. Pascoe. Ask Ray Hillier, the ranger, about the road. He knows it better than anyone.", { free: true, set: "ray_known" }),
            K.t("Has anyone gone looking?", [{ say: "He glances at the road." }, "Three of us. In daylight, in a Land Rover. We drove the full length twice. It isn't there. And at dusk, I swear to God, there's a light on the horizon that was not there before, and it looks like a petrol station."], { cha: 8, set: "brodie_saw" })
          ], { label: "Talk to Constable Brodie", name: "Brodie", bye: ["Keep your tank full."] }),
          K.find("Read the missing persons board", "iq", "easy", "A cork board in the roadhouse porch: a row of photographs of travellers, with dates beside each. Four of the dates are crossed out. Four are circled in red: every one the night of a new moon, 3:17 a.m.", "Faces. Dates. Dust.", { clue: "c_clock", hint: "Easy" }),
          K.go("To the Madura clinic", "clinic", { if: "servo_known" }),
          K.go("Find Ray the ranger", "ray", { if: "ray_known" })] },
      clinic: { name: "Madura clinic", theme: "interior", mood: "weird", lighting: "glow", weather: "none", cast: ["annika"],
        onEnter: [{ once: "in", steps: [{ say: "A one-room clinic with a single bed and a window onto a flat red horizon. In the bed, a woman in her fifties with the face of a twenty-two-year-old is looking at her own hands." }] }],
        options: [
          K.ask("annika", [
            K.t("What happened to you?", ["I stopped for a coffee. And a bed. The woman at the counter said: what would you like? And I said what I wanted. And it was better than I'd imagined. The coffee. The bed. They were perfect."], { free: true, clue: "c_ask" }),
            K.t("What was the cost?", "Nothing, she said. I never paid. In the morning I woke up, and I was thirty-one hours older. I mean, I looked it. I'm twenty-two. I think. I haven't a clue what I am.", { clue: "c_ask", free: true }),
            K.t("What was the clock?", [{ say: "She looks up." }, "It said 3:17. I remember thinking: it's broken. And the pumps. They were counting down."], { cha: 7, clue: ["c_clock", "c_pumps"] }),
            K.t("Did the woman at the counter say anything else?", "'You don't have to ask for much. Most people don't.'", { cha: 10, set: "marj_line" })
          ], { label: "Talk to Annika", name: "Annika", bye: ["Don't ask for anything. Whatever it is."] }),
          K.find("Look at Annika's possessions", "iq", "easy", "In her pocket: a paper napkin from the Servo, printed in blue: THE LAST SERVO. EAT. SLEEP. FILL UP. ASK AND IT'S YOURS. And on the back, in biro: 3:17.", "Clothes, a passport, a map. Nothing else.", { clue: ["c_clock", "c_pumps"], hint: "Easy" }),
          K.go("Back to the roadhouse", "madura")] },
      ray: { name: "The ranger's hut", theme: "desert", mood: "calm", lighting: "glow", weather: "wind", cast: ["ray"],
        onEnter: [{ once: "in", steps: [{ say: "A tin hut on the edge of the escarpment, a Land Cruiser, a kettle on a fire. A lean man in a khaki shirt looks at you without surprise." }] }],
        options: [
          K.ask("ray", [
            K.t("What do you know about the road?", ["I've driven it thirty years. I've never stopped after dark, and I've never wanted to. The old people said: keep going. That's all. Keep going, and you'll be all right. People from away stop, and that's when it's got you."], { free: true, clue: "c_ray", obj: "so1" }),
            K.t("What is the Servo?", "It's not mine to say. I can tell you what I've seen. It's there some nights. It isn't there others. And the people who stop in it, they come out wrong.", { clue: "c_marj", free: true }),
            K.t("Who runs it?", [{ say: "He pours tea, and doesn't look up." }, "Marj Dunmore. She's been there since '62. I was a boy. She looked forty then. She looks forty now."], { cha: 7, clue: "c_marj" }),
            K.t("Would you come with us?", "I'll take you as far as the turn. I won't go in.", { cha: 10, set: "ray_guide" })
          ], { label: "Talk to Ray", name: "Ray", bye: ["Keep going."] }),
          K.go("Back to the roadhouse", "madura"),
          K.go("Drive out along the highway, at dusk", "highway", { if: { all: [{ clue: "c_clock" }, { clue: "c_ask" }] } })] },
      highway: { name: "The Eyre Highway, at dusk", theme: "desert", mood: "dread", lighting: "dark", weather: "night",
        onEnter: [{ once: "in", steps: [{ say: "The sun goes down in a slab of orange. The road is dead straight to the horizon in both directions, and there is nothing, nothing at all, for as far as the headlights reach. And then, a little before eight, a light, where no light was." }] }],
        options: [
          K.go("Drive to the light", "servo"),
          K.go("Turn back", "madura")] },
      servo: { name: "The Last Servo", theme: "interior", mood: "weird", lighting: "glow", weather: "none", cast: ["marj"],
        onEnter: [{ once: "in", steps: [
          { say: "A white building under a hard light, a long forecourt with four petrol pumps and a diner behind them. A neon sign: THE LAST SERVO. EAT. SLEEP. FILL UP. A woman in a faded apron waves from the door as if she'd been waiting for you all day." },
          { clue: "c_pumps" },
          { talk: { npc: "marj", text: "Come in, come in! You must be dead on your feet. What would you like? You only have to ask." } }] }],
        options: [
          K.ask("marj", [
            K.t("How long have you run this place?", ["Since '62. My husband built it. He's long gone. I kept it going. I wouldn't know how to stop."], { free: true, clue: "c_marj" }),
            K.t("Why does the clock say 3:17?", [{ say: "She glances up, and her smile doesn't move." }, "It always has. It's a nice time. It's the time we opened."], { clue: "c_clock", free: true }),
            K.t("What does the Servo give people?", "Whatever they ask for. It's only polite. We never refuse. Not once, not in twenty-one years.", { free: true, clue: "c_ask" }),
            K.t("What did you ask for?", [{ say: "For a moment, there is nothing at all in her face." }, "A way to keep it open. When Jim died, and the highway board wanted to close us down. I asked. And it said yes. It said it wouldn't be any trouble."], { cha: 8, obj: "so3", set: "marj_confessed" })
          ], { label: "Talk to Marj", name: "Marj", bye: ["Don't forget to ask."] }),
          K.find("Look at the wall clock", "awareness", "easy", "3:17. The second hand is not moving. But behind the clock-face, you can hear something ticking, very slowly, somewhere under the floor.", "A clock. Brass hands.", { clue: "c_clock", hint: "Easy", tags: ["clock"] }),
          K.find("Examine the pumps", "iq", "easy", "The pump dials count down, not up, in minutes and seconds. You're looking at the amount of time you have left to leave. Yours says 4:12:00.", "Pumps.", { clue: "c_pumps", hint: "Easy" }),
          K.find("Look in the cellar", "awareness", "medium", "A steel door, in the back of the kitchen, and behind it a stair. At the bottom, on a shelf, a leather-bound logbook, 1962 to 1971. The last entry, in a different hand: 'I asked for it to stay open. It said yes. It did not say for how long.'", "The cellar door is locked.", { clue: "c_log", obj: "so2", hint: "Awareness, Medium", tags: ["clock"] }),
          K.go("To the 3:17 hour", "finale", { if: { clue: "c_pumps" } })] },
      finale: { name: "The Last Servo, 3:17", theme: "interior", mood: "boss", lighting: "shadow", weather: "none",
        onEnter: [{ once: "in", steps: [{ say: "The pumps count down to zero. The clock on the wall, for the first time, makes a sound. The woman at the counter takes off her apron, folds it, and puts it on the bar. Behind her, something else is standing, in the exact same shape, smiling." }, { objective: "po1" }] }],
        options: [
          { label: "Start the clock from the logbook's last true time", hint: "Needs the station logbook", if: { obj: "so2" }, steps: [{ check: { aspect: "iq", cr: "challenging", label: "Set the clock to the time written in the logbook, and wind it", who: "choose", tags: ["clock"],
            ok: [{ say: "You climb on the counter and set the hands to the time in the old logbook, eleven minutes past six on the thirtieth of March, 1962, and wind the spring. The second hand twitches, and goes. In the cellar, something under the floor begins to tick in time. The pumps stop counting. Behind the counter, the thing in the apron is only Marj, and she is, suddenly, very old." }, { set: "res_clock" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "The hands will not move. The pumps keep counting." }, { damage: { pool: "stability", amount: 3 } }] } }] },
          { label: "Ask for nothing, together, and walk out", hint: "Needs Ray's warning, and Marj's confession", if: { all: [{ obj: "so1" }, "marj_confessed"] }, steps: [{ check: { aspect: "willpower", cr: "medium", label: "Refuse every offer, and walk out into the dark", who: "choose", tags: ["ask"],
            ok: [{ say: "It offers you everything: a cold drink, a warm bed, a way home, your mother's voice. You say, one after another, 'No, thank you', and put your hand on the door. At the last, Marj lifts her head, and says, very softly: 'Could you ask me for something?' And you say: 'Close the Servo, Marj.' And she does." }, { set: "res_refuse" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "You ask for a drink of water. It is the best water you've ever tasted." }, { damage: { pool: "health", amount: 4 } }] } }] },
          { label: "Face the Attendant", steps: [{ set: "res_fight" }, { combat: "servo", win: [{ say: "The Attendant takes off its apron, folds it neatly, and goes. The pumps stop. The clock on the wall ticks over to 3:18." }, { objective: "po2" }, { goto: "end" }] }] }] },
      end: { name: "The Eyre Highway, dawn", theme: "desert", mood: "calm", lighting: "glow", weather: "none",
        onEnter: [{ once: "in", steps: [
          { say: "The dawn comes up red over the Nullarbor. Where the Servo stood, there is a patch of flat ground, a few old bricks, and a rusted petrol pump on its side. Annika Lindqvist, three hundred kilometres away in a hospital bed, wakes up and counts her fingers. She is twenty-two." },
          { if: { flag: "res_clock" }, then: [{ say: "You wound the old clock from the logbook, and what the Servo had taken came back. Marj Dunmore, in the early light, sat down in the dirt, an old woman of eighty-one, and said, with great politeness, that she was sorry." }] },
          { if: { flag: "res_refuse" }, then: [{ say: "You asked for nothing, and Marj asked you to ask her for something, and you did. She is sitting in the dirt, still forty, and not for long." }] },
          { if: { flag: "res_fight" }, then: [{ say: "You broke the Attendant, and the time it held went back to the people it was taken from, all at once, like a tide." }] },
          { if: { obj: "so1" }, then: [{ say: "Ray Hillier puts a plain white sign at the Madura turn: KEEP GOING." }] },
          { if: { obj: "so3" }, then: [{ say: "The highway board closes the road for a week. Marj Dunmore is found, alive, and old, and sits beside the road with a cup of tea, and says it was not a bad twenty-one years." }] },
          { end: "win" }] }], options: [] }
    }
  });

  /* ======================================================================= 1927 · The Man in White Shoes */
  ADV.register({
    id: "white-shoes", title: "The Man in White Shoes", setting: "The Rio Negro, Brazil · 1927", year: 1927, level: [1, 9], agencies: ["NSBD", "WCA", "OID"], region: "americas-south", theme: "forest",
    summary: "On every night of the full moon, a handsome stranger in a white linen suit, a white hat and white shoes appears at the dance in a riverside village on the Rio Negro. Every month, one young woman walks into the river with him. He is never seen to take his hat off.",
    objectives: [
      { id: "po1", kind: "primary", t: "Find out who the stranger is, and where the women go", done: "An encantado: a river-dweller in man's shape, who takes a wife each full moon to a city under the water, and keeps her until she forgets the shore. His hat hides the breathing-hole on the top of his head." },
      { id: "po2", kind: "primary", t: "Stop the next taking, and bring back those who can be brought", done: "The next woman stays on the shore, and the river gives back those whose names are still remembered." },
      { id: "so1", kind: "secondary", t: "Hear what Dona Rita saw on the riverbank", done: "Dona Rita, the village's oldest woman, saw the stranger take off his hat, once, to dive: and what she saw is why she never goes near the water.", benefit: { label: "What's under the hat", text: "You know his weakness. A bonus on every roll to unmask him, and +2 to your attacks against him.", bonus: { tags: ["unmask"], value: 2 }, combat: { enemy: "encantado", attack: 2 } } },
      { id: "so2", kind: "secondary", t: "Find the women's names on the riverside", done: "Eleven names, cut in the clay of the bank by the women who went, so that someone would remember them.", benefit: { label: "Eleven names", text: "You can call them home. A bonus on every roll to bring them back.", bonus: { tags: ["names"], value: 2 } } },
      { id: "so3", kind: "secondary", t: "Learn what the stranger cannot stand", done: "Old Zé the fisherman says the stranger has never once passed a lit tallow-lamp, a smoke of tobacco, or a mirror without turning his head away.", benefit: { label: "Smoke and glass", text: "A bonus on every roll to drive him off, using a mirror and the pipe-smoke.", bonus: { tags: ["drive"], value: 2 }, flag: "have_mirror" } }
    ],
    clues: {
      c_stranger: { t: "A man in white, at every full moon", s: "Dona Rita", x: "A handsome man in a white suit, white hat and white shoes comes to the dance at every full moon. He dances with every girl, and leaves with one. He is never seen to eat, drink, or take off his hat." },
      c_women: { t: "Eleven have walked into the river", s: "The riverbank", x: "Eleven young women have walked into the Rio Negro with him since the dry season. They went without a struggle, smiling. The village found their shoes, set neatly side by side on the bank." },
      c_hat: { t: "He never takes off the hat", s: "Zé the fisherman", x: "He has never taken off the hat. Old Zé saw him dive once, at the far end of the landing, and swears the hat was held on with one hand. Where it lifted, he saw a mouth, open, on the top of his head, breathing." },
      c_names: { t: "The women's names, in clay", s: "The bank", x: "Below the landing, in the clay of the riverbank, eleven names are scratched, in eleven different hands. The earliest is eleven months old, the latest three weeks. They are the women who went." },
      c_smoke: { t: "He turns from smoke and glass", s: "Zé", x: "The stranger never passes a tallow-lamp, a tobacco-smoke, or a looking-glass without turning his head away. He dances with every girl, but never in front of a mirror." },
      c_encantado: { t: "The encantado", s: "Father Anselmo", x: "The river-folk say the botos, the pink dolphins, can take the shape of a man on the nights of the full moon, to take a wife for the city under the water. The priest has written to the bishop four times and had no reply." },
      c_return: { t: "They can be brought back, if remembered", s: "Dona Rita", x: "A woman taken by the river can be called back so long as someone on the shore still says her name. After seven years, no one does. Most of the first eleven are still within the year." }
    },
    npcs: {
      rita: N("Dona Rita", "Eldest of the village", "Ninety if she's a day, small and upright in a faded blue dress, with a cigar in the corner of her mouth and a scowl that has outlasted three governors.", F(3, 5, "bun", 1, "headscarf", { sex: "f" })),
      ze: N("Zé Cardoso", "Fisherman", "Lean and sun-darkened, in a straw hat and a patched shirt, with a net on one shoulder and a gaze that checks the water before it checks you.", F(3, 5, "short", 6, "hat", { sex: "m" })),
      anselmo: N("Father Anselmo", "Priest of São Gabriel", "A round, harassed priest in a salt-stained cassock, who has written to Manaus four times and learned to say Mass with a flask of holy water in his pocket.", F(0, 4, "bald", 5, "none", { sex: "m" })),
      luzia: N("Luzia", "Next on the list", "Nineteen, bright-eyed, with a flower in her hair and the awful brightness of someone who has been told what she is meant to be afraid of and has decided not to be.", F(3, 5, "braids", 1, "headscarf", { sex: "f" }))
    },
    enemies: {
      encantado: { build: { name: "The Man in White Shoes", type: "Beyond", difficulty: "challenging", sprite: "humanoid", hue: 190, dtype: "sanity", core: { body: 2, mind: 3, spirit: 3 }, mods: ["Speech", "Occult", "Quick"],
        text: "An encantado of the river. Charm: each round he dances with one agent; Willpower Medium or they follow him a step nearer the water and lose their action. His hat holds his breath: knock it off, and he loses an action every round he is on land. He turns from smoke and glass. Only Sanity harms him.", dies: "falls into the river, and the river takes him, and for a moment the water is full of small pink backs" } },
      follower: { build: { name: "A charmed villager", type: "Human", difficulty: "easy", sprite: "humanoid", hue: 200, attack: 0, dtype: "health", dies: "sits down on the bank, shaking his head as if out of water" } }
    },
    encounters: {
      landing: { name: "The landing, full moon", theme: "forest", lit: false, fightText: "On the landing at the edge of the river, the stranger in the white suit turns, and, in the moonlight, he does not seem to be standing quite on the ground. Behind him the water is very still, and very full of eyes.", zones: [{ id: "a", name: "The path", col: 0, row: 0 }, { id: "b", name: "The landing", col: 1, row: 0 }, { id: "c", name: "The water's edge", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "encantado", zone: "c" }, { t: "follower", zone: "b" }, { t: "follower", zone: "b", name: "A charmed villager (2)" }] }
    },
    start: "village",
    scenes: {
      village: { name: "São Gabriel, on the Rio Negro", theme: "forest", mood: "dread", lighting: "glow", weather: "night", cast: ["anselmo"],
        onEnter: [{ once: "in", steps: [
          { say: "The Rio Negro, in the wet season of 1927. A village of stilt-houses and palm-thatch on the bank of a black river a mile wide, and above it the great drowned forest, going to the horizon. The air is hot and sweet and smells of mud and wood-smoke. A round priest in a salt-stained cassock waits at the jetty with a lantern." },
          { talk: { npc: "anselmo", text: "You have come from the Association? I have written to the bishop four times. He wrote back to say that the river is a long way from the diocese." } }] }],
        options: [
          K.ask("anselmo", [
            K.t("What is happening?", ["Every full moon, a stranger comes to the dance. A man in a white suit. White hat, white shoes. He dances with every girl. He leaves with one. She walks into the river, with him, smiling. We find her shoes in the morning, side by side on the bank."], { free: true, clue: "c_stranger" }),
            K.t("How many?", "Eleven. Since the dry season. The last was the daughter of the schoolmistress. I buried her shoes.", { free: true, clue: "c_women" }),
            K.t("Who is he?", [{ say: "He touches the flask in his pocket." }, "The river-folk say the botos, the pink dolphins, can take the shape of a man on the full moon. To take a wife. They have a city under the water. I did not believe it, when I came. I am a Jesuit."], { clue: "c_encantado", free: true, set: "boto_known" }),
            K.t("Who is next?", "Luzia. She is nineteen. The stranger danced with her last month. She has been wearing a flower since, and she says she is not afraid.", { cha: 8, set: "luzia_known" })
          ], { label: "Talk to Father Anselmo", name: "the priest", bye: ["God keep you on the river."] }),
          K.find("Ask the schoolmistress about her daughter", "charisma", "easy", "The schoolmistress, grey with grief, says her daughter went to the dance in a red dress, as she did every month, and came home humming a tune she did not know. That night she took off her shoes at the water, set them side by side, and walked in without a word.", "The schoolmistress cannot speak of it.", { clue: "c_women", hint: "Charisma, Easy" }),
          K.find("Look at the dancers' hall", "awareness", "easy", "A long palm-thatch hall with a plank floor, a few oil-lamps, a band's platform. In a corner, on the boards, a pair of small, neat, white footprints, dry as bone in the damp.", "A hall. Benches. Dust.", { clue: "c_stranger", hint: "Easy" }),
          K.go("To Dona Rita's house", "rita"),
          K.go("To the riverbank landing", "bank"),
          K.go("To Zé the fisherman's canoe", "ze"),
          K.go("To see Luzia", "luzia", { if: "luzia_known" })] },
      rita: { name: "Dona Rita's house", theme: "forest", mood: "calm", lighting: "shadow", weather: "none", cast: ["rita"],
        onEnter: [{ once: "in", steps: [{ say: "A little stilt-house at the top of the village, a hammock, a smoking clay pipe, and a very old woman with a cigar in the corner of her mouth, who does not get up." }] }],
        options: [
          K.ask("rita", [
            K.t("What do you know about the stranger?", ["Everything. And I don't talk to people about it, and I don't go near the water. I saw him once, when I was a girl. In another year, another man in white. His hat came off. I will not say what was under it."], { free: true, clue: "c_stranger" }),
            K.t("What was under his hat?", [{ say: "She takes the cigar out of her mouth." }, "A hole. A mouth, in the top of his head. Breathing. It opened and shut like a fish. He put the hat back, and smiled at me."], { cha: 7, clue: "c_hat", obj: "so1" }),
            K.t("Can the women be brought back?", "A woman the river takes can be called home, so long as somebody on the shore says her name. After seven years, nobody does. The first eleven are within the year. There is time.", { clue: "c_return", free: true }),
            K.t("Why do you never go near the water?", "Because I know what's in it. It's not cruelty. That's the worst. He's tender. They are happy, down there. They forget they were ever anywhere else.", { cha: 10 })
          ], { label: "Talk to Dona Rita", name: "Dona Rita", bye: ["Say their names."] }),
          K.go("Back to the village", "village")] },
      bank: { name: "The riverbank below the landing", theme: "forest", mood: "dread", lighting: "dark", weather: "night",
        onEnter: [{ once: "in", steps: [{ say: "A slope of grey clay running down to the black river, and a crooked wooden landing. The water moves very slowly. On the bank, in a neat row, side by side, are eleven pairs of shoes." }] }],
        options: [
          K.find("Examine the shoes", "iq", "easy", "Eleven pairs of shoes, from a girl's ballet pumps to a woman's patent leather. Every pair has been polished. In each, set on the toe, a single white flower: the same flower, fresh.", "Shoes. Damp. Sad.", { clue: "c_women", hint: "Easy" }),
          K.find("Look for names in the clay", "awareness", "medium", "Below the landing, scratched in the grey clay with a fingernail, a stick, a hairpin: eleven names, in eleven hands. The earliest is eleven months old. The latest, three weeks. They were written by the women, before they went in.", "Clay, in the dark.", { clue: "c_names", obj: "so2", hint: "Awareness, Medium", tags: ["names"] }),
          K.go("Back to the village", "village")] },
      ze: { name: "Zé's canoe", theme: "forest", mood: "calm", lighting: "shadow", weather: "none", cast: ["ze"],
        onEnter: [{ once: "in", steps: [{ say: "A dugout canoe drawn up on the bank, a net spread to dry, and a lean man in a straw hat mending a hook and watching the water as he does it." }] }],
        options: [
          K.ask("ze", [
            K.t("What have you seen on the river?", ["Pink backs, in the moonlight. A lot of them, at the full moon. They go round the landing. In circles. Like people waiting."], { free: true, clue: "c_encantado" }),
            K.t("What have you seen of the stranger?", "I saw him dive. Once, from the far landing. He held his hat on with one hand, and when it lifted, I saw. I have not fished at night since.", { clue: "c_hat", free: true }),
            K.t("Does he fear anything?", [{ say: "He holds up the net." }, "Smoke. A tallow-lamp. A looking-glass. He's never passed a mirror without turning his head. I thought it was vanity."], { cha: 6, clue: "c_smoke", obj: "so3" }),
            K.t("Will you help us?", "I'll take you out. I won't be in the boat.", { cha: 9, set: "ze_boat" })
          ], { label: "Talk to Zé", name: "Zé", bye: ["Stay out of the water after dark."] }),
          K.find("Test the stranger's fear of smoke", "charisma", "easy", "Zé lights a pipe, and the smoke drifts toward the hall. At the door, a man in a white suit is about to step across: he stops, as if at an invisible line, and steps back into the dark, and does not come in until the pipe is out.", "The smoke goes up. Nobody notices.", { clue: "c_smoke", obj: "so3", hint: "Charisma, Easy", tags: ["drive"] }),
          K.go("Back to the village", "village")] },
      luzia: { name: "Luzia's house", theme: "forest", mood: "calm", lighting: "glow", weather: "none", cast: ["luzia"],
        onEnter: [{ once: "in", steps: [{ say: "A small clean house on stilts, with a mirror, very obviously, turned to face the wall. A girl of nineteen with a flower in her hair is sewing a dress." }] }],
        options: [
          K.ask("luzia", [
            K.t("Are you afraid?", ["Of course. I'm not stupid. But I'll be at the dance. If I'm not there, he'll take somebody who doesn't know."], { free: true }),
            K.t("What does he say?", "That I'll be loved. That it's beautiful. That nobody there is ever lonely. And I think he means it. That's what frightens me.", { cha: 6, set: "luzia_trust" }),
            K.t("Will you let us stand beside you?", [{ say: "She puts down her needle." }, "If you promise to say my name, afterwards. Even if I forget."], { cha: 9, set: "luzia_help" })
          ], { label: "Talk to Luzia", name: "Luzia", bye: ["I'll wear the red dress."] }),
          K.go("Back to the village", "village"),
          K.go("Wait for the full moon, at the dance", "dance", { if: { all: [{ clue: "c_hat" }, { clue: "c_smoke" }] } })] },
      dance: { name: "The dance, full moon", theme: "forest", mood: "boss", lighting: "dark", weather: "night",
        onEnter: [{ once: "in", steps: [{ say: "The full moon, over the river. The hall is lit with oil-lamps and loud with a band. Every girl in the village is here. At half past nine, the door opens, and a handsome man in a white linen suit steps in, and takes off his hat to nobody, and doesn't take it off." }, { objective: "po1" }] }],
        options: [
          { label: "Call out the women's names at the landing", hint: "Needs the names, and Luzia's trust", if: { all: [{ obj: "so2" }, "luzia_help"] }, steps: [{ check: { aspect: "charisma", cr: "challenging", label: "Say all eleven names aloud, and don't stop", who: "choose", tags: ["names"],
            ok: [{ say: "At the water's edge, as the stranger leads Luzia down, you start to say the names: the eleven from the clay. Dona Rita joins in, from her hammock, and then Father Anselmo, and Zé, and half the village. In the river, the pink backs stop circling. The stranger turns, for the first time, away from Luzia. And one by one, eleven women come up out of the black water, in their ballroom dresses, blinking, shaking the river from their hair." }, { set: "res_names" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "You lose the order of the names. The stranger smiles." }, { damage: { pool: "sanity", amount: 3 } }] } }] },
          { label: "Drive him off with smoke and glass", hint: "Needs the mirror, and the pipe", if: { obj: "so3" }, steps: [{ check: { aspect: "agility", cr: "medium", label: "Light the pipes, and turn the mirrors on the hall before he reaches the door", who: "choose", tags: ["drive"],
            ok: [{ say: "Zé, and half the men of the village, light their pipes at once. You turn the mirrors on the hall. At the door the stranger stops, and turns his head. He puts a hand to his hat. For a long moment he stands in the light, and then he is gone, into the dark, running. For a month, no girl is taken. And the next month, none." }, { set: "res_drive" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "A mirror falls and breaks. He steps across the line." }, { damage: { pool: "health", amount: 3 } }] } }] },
          { label: "Face the Man in White Shoes", steps: [{ set: "res_fight" }, { combat: "landing", win: [{ say: "The hat comes off. Something breathes, once, on the top of his head. He drops into the river, and the water, for a moment, is full of small pink backs." }, { objective: "po2" }, { goto: "end" }] }] }] },
      end: { name: "São Gabriel, the morning after", theme: "forest", mood: "calm", lighting: "glow", weather: "none", cast: [],
        onEnter: [{ once: "in", steps: [
          { say: "The morning is hot and wet and smells of coffee. On the landing, a row of shoes lies waiting, and one by one, the women of São Gabriel, back from the water, put them on." },
          { if: { flag: "res_names" }, then: [{ say: "You called the eleven home. Some of them remember the city under the river. None of them will say what it was like. All of them, at the next full moon, stand on the bank, and look at the water, and say a name." }] },
          { if: { flag: "res_drive" }, then: [{ say: "You drove him off, and the river is quiet. But he will find another village, and the village will have to learn what Zé knows about smoke and glass." }] },
          { if: { flag: "res_fight" }, then: [{ say: "You broke the Man in White Shoes. In the river, for a moment, the water was very full. Then it was only water." }] },
          { if: { obj: "so1" }, then: [{ say: "Dona Rita smokes her cigar on the landing, and for the first time in seventy years, looks at the river." }] },
          { if: { obj: "so2" }, then: [{ say: "The eleven names are cut into a wooden board on the landing, and Father Anselmo reads them every full moon." }] },
          { end: "win" }] }], options: [] }
    }
  });
})();
