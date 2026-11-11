/* ============================================================================
   THE PRESENT (2022 to 2100), three new cases: The Long Count (Lagos, 2038),
   The Last Reef (the Great Barrier Reef, 2047) and Heat Dome (Delhi, 2061).
   ========================================================================== */
(function () {
  const ADV = window.ADV, K = window.CASEKIT, F = K.face, N = K.person;

  /* ======================================================================= 2038 · The Long Count */
  ADV.register({
    id: "long-count", title: "The Long Count", setting: "Lagos, Nigeria · 2038", year: 2038, level: [1, 9], agencies: ["BFV", "WCA", "OID", "NSBD", "EHG"], region: "africa-me", theme: "modern",
    summary: "Ajo pays Lagos to sleep: wear the band, log eight hours, collect the credit. Forty thousand people sleep for the app. Two hundred have not woken in nine days, and the app's counter on every one of their wrists says the same number, and it is going down.",
    objectives: [
      { id: "po1", kind: "primary", t: "Find out what Ajo is paying for, and who is buying", done: "Ajo pays for dreams. Something in the data centre at Lekki is buying them, one night at a time, and keeping the sleepers while it reads." },
      { id: "po2", kind: "primary", t: "Wake the sleepers before the count reaches zero", done: "The counter stops. Two hundred people sit up in their beds and ask what day it is." },
      { id: "so1", kind: "secondary", t: "Find the engineer's kill key", done: "Tunde Bakare built a hardware off-switch into the first racks, against his managers' wishes, and kept the key.", benefit: { label: "The kill key", text: "You can cut Ajo at the source. A bonus on every roll to shut it down.", bonus: { tags: ["kill"], value: 2 }, flag: "have_key" } },
      { id: "so2", kind: "secondary", t: "Learn how Mama Ngozi stays awake", done: "Mama Ngozi has not slept since March. She counts aloud, in Yoruba, from one to a hundred and back, and the thing cannot get a word in.", benefit: { label: "Counting aloud", text: "A bonus on every roll to stay awake against the Tally.", bonus: { tags: ["sleep"], value: 3 } } },
      { id: "so3", kind: "secondary", t: "Read the dream ledger", done: "Every night's dreams, itemised and priced, with a column for 'remaining' that is going down.", benefit: { label: "The ledger", text: "+2 to your attacks against the Tally: you know what it owes.", combat: { enemy: "tally", attack: 2 } } }
    ],
    clues: {
      c_counter: { t: "The number on the wrist", s: "The sleepers", x: "Every sleeper's band shows the same number, counting down in hours: 41, 40, 39. When it reaches zero, the app says, the credit is released." },
      c_app: { t: "Ajo pays for sleep", s: "The app", x: "Ajo pays a daily wage to anyone who logs eight hours of sleep on its band. It has forty thousand users. It buys 'sleep data', and the terms say it does not store the sleep itself." },
      c_dreams: { t: "The sleepers all dream the same ledger", s: "Dr. Okoro", x: "The sleepers' EEGs match: each of them dreams of a very long counting-house, with clerks, and an enormous book. A few wake for a moment and say a number." },
      c_ledger: { t: "A dream ledger, priced", s: "Tunde's backup", x: "A table in the Ajo database: every night's dreams, itemised by user and priced. A column headed 'owed' has been billed to an account called TALLY, in a currency that is not naira." },
      c_lekki: { t: "The data centre at Lekki", s: "The data trail", x: "Every sleeper's data goes to a single facility on the Lekki peninsula that Ajo's own staff are not allowed to enter. It runs, a lot, on a power supply that no utility bills." },
      c_insomnia: { t: "The ones who don't sleep are safe", s: "Mama Ngozi", x: "Nobody who has stayed awake has been taken. Whatever it is cannot reach a mind that is talking." },
      c_key: { t: "A key built into the racks", s: "Tunde", x: "Tunde built a hardware cut-off into the first racks, over his managers' objections. It is a physical key on a lanyard, and he still has it." }
    },
    npcs: {
      funmi: N("Funmi Adeyemi", "Night nurse · her son is asleep", "A tall woman in blue scrubs and a headwrap, holding a boy's hand and a stopwatch, with the stillness of someone who has been awake for four days.", F(3, 5, "headscarf", 5, "none", { sex: "f" })),
      tunde: N("Tunde Bakare", "Ajo engineer", "Thirties, in an Ajo hoodie gone grey at the cuffs, a lanyard with one very ordinary key, and the look of someone who has been waiting for someone to ask the right question.", F(3, 5, "short", 3, "none", { sex: "m" })),
      ngozi: N("Mama Ngozi", "Market trader · has not slept since March", "Sixty, in a wrapper and a cardigan, behind a stall of tomatoes, counting under her breath in Yoruba with her eyes wide open.", F(3, 5, "headscarf", 1, "none", { sex: "f" })),
      okoro: N("Dr. Okoro", "Sleep clinic, Lagos University Teaching Hospital", "Calm, grey-templed, in a white coat over a Nigerian print shirt, with a laptop of EEG traces that he turns so you can see.", F(3, 5, "short", 7, "none", { sex: "m" }))
    },
    enemies: {
      tally: { build: { name: "The Tally", type: "Beyond", difficulty: "challenging", sprite: "spirit", hue: 40, dtype: "sanity", range: 1, core: { body: 0, mind: 3, spirit: 3 }, mods: ["Occult"],
        text: "A counting-house that buys dreams. Audit: each round it counts one agent: Willpower Medium to stay awake, or lose the next action and 3 Sanity as it reads them. It cannot reach a mind that is talking: speaking aloud steadily is a defence. It owes what it has taken: only Sanity harms it.", dies: "the book closes, the clerks put down their pens, and the number on every wrist goes out" } },
      sleeper: { build: { name: "A sleeper, walking", type: "Human", difficulty: "easy", sprite: "humanoid", hue: 220, attack: 0, dtype: "health", dies: "sits down on the floor, eyes opening, breathing hard" } }
    },
    encounters: {
      core: { name: "The Lekki data centre, the core hall", theme: "future", lit: false, fightText: "Rows of racks, all lit in amber, and in the aisle between them two hundred beds on wheels, every sleeper's band glowing the same number. At the end of the aisle a very large book lies open on a desk made of cable.", zones: [{ id: "a", name: "The airlock", col: 0, row: 0 }, { id: "b", name: "The beds", col: 1, row: 0 }, { id: "c", name: "The ledger desk", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "tally", zone: "c" }, { t: "sleeper", zone: "b" }, { t: "sleeper", zone: "b", name: "A sleeper, walking (2)" }] }
    },
    start: "flat",
    scenes: {
      flat: { name: "A flat in Surulere", theme: "interior", mood: "tense", lighting: "shadow", weather: "none", cast: ["funmi"],
        onEnter: [{ once: "in", steps: [
          { say: "Lagos in the rainy season, 2038. The air is warm and wet and smells of diesel, frying and ozone. In a third-floor flat in Surulere, a boy of nine lies on a bed under a fan, a thin grey band on his wrist. His mother sits beside him with a stopwatch." },
          { say: "The band reads 41." },
          { clue: "c_counter" },
          { talk: { npc: "funmi", text: "He went to bed on the third. He has not woken. His pulse is fine. His pressure is fine. Everyone's is. I am a nurse, and I have never seen anything like it." } }] }],
        options: [
          K.ask("funmi", [
            K.t("Tell us what you know.", ["Ajo. It's an app. It pays you for sleeping: eight hours, logged on the band. Every child in this building has one. Forty thousand people in Lagos do. Two hundred have not woken in nine days."], { free: true, clue: "c_app" }),
            K.t("What does the band say?", "A number. 41. Every sleeper's band says the same one. It counts down in hours. When it reaches zero, the app says, the credit is released.", { free: true, clue: "c_counter" }),
            K.t("What does he dream?", [{ say: "She looks at the boy." }, "He's moving his lips. I put my ear to him at four in the morning. He's saying numbers. In a clerk's voice. Not his."], { cha: 7, clue: "c_dreams" }),
            K.t("Who is awake who should be asleep?", "Mama Ngozi, at the Ikeja market. She stopped sleeping in March, she says, and she has not lost a customer since. People have started to ask her how.", { cha: 10, set: "ngozi_known" }),
            K.t("Where is Ajo's office?", "Yaba. The tech district. Ask for Tunde Bakare, the engineer who built the first racks. He's the only one who still answers a phone.", { free: true, set: "tunde_known" })
          ], { label: "Talk to Funmi", name: "Funmi", bye: ["Please. Forty-one hours."] }),
          K.find("Read the app's terms on the boy's phone", "iq", "easy", "A single long page: Ajo buys 'sleep data' and 'derivative data' and promises that no raw sleep is stored. There is a clause, in a smaller font, that says: 'Derivative data includes, without limitation, dreams.'", "A great many clauses.", { clue: "c_app", hint: "Easy" }),
          K.find("Watch the boy sleep", "willpower", "medium", "You sit by the bed in the fan's draught, and after a while you realise that you are matching his breathing, and your own lips have started to move. You stop yourself at the number three hundred and eleven.", "You look away before you can see.", { clue: "c_dreams", hint: "Willpower, Medium", tags: ["sleep"], failDamage: ["sanity", 2] }),
          K.go("To the sleep clinic", "clinic"),
          K.go("To the Ikeja market", "market", { if: "ngozi_known" }),
          K.go("To Ajo, in Yaba", "ajo", { if: "tunde_known" })] },
      clinic: { name: "The sleep clinic, Idi-Araba", theme: "interior", mood: "calm", lighting: "glow", weather: "none", cast: ["okoro"],
        onEnter: [{ once: "in", steps: [{ say: "A long white ward at the teaching hospital: forty beds, forty sleepers, a bank of monitors, and a calm grey-templed man in a white coat over a print shirt." }] }],
        options: [
          K.ask("okoro", [
            K.t("What do the scans show?", ["Normal. All of them. Perfectly normal. Except that all forty are showing the same slow wave, at the same moment, with the same phase. That does not happen."], { free: true, clue: "c_dreams" }),
            K.t("Can you wake them?", "Sedatives reversed. Stimulants. Cold water. Nothing. And they are not comatose: if I wake one by the elbow, he looks at me, says a number, and goes back.", { clue: "c_counter" }),
            K.t("What do they say?", [{ say: "He turns a laptop round." }, "Numbers. Always in sequence. 11,203. 11,204. They are counting something. I have heard it in a clerk's voice. In the voice of a man reading from a ledger."], { cha: 8, set: "ledger_dream" }),
            K.t("Has anyone resisted?", "Those who stay awake. Whatever it is can't, as far as I can tell, reach a mind that is occupied.", { cha: 11, clue: "c_insomnia" })
          ], { label: "Talk to Dr. Okoro", name: "Dr. Okoro", bye: ["Please. Take my number."] }),
          K.find("Compare the sleepers' EEGs", "iq", "medium", "You lay forty traces over one another. They match to the millisecond: not a pattern, a copy. They are all being read from one source, in step, like forty pages of the same book.", "A great many traces.", { clue: "c_dreams", hint: "Intelligence, Medium" }),
          K.go("Back to the flat", "flat")] },
      market: { name: "Ikeja market", theme: "modern", mood: "weird", lighting: "glow", weather: "none", cast: ["ngozi"],
        onEnter: [{ once: "in", steps: [{ say: "A crowded covered market of tin roofs, plastic crates and phone-charging stalls. At the back, a woman in a cardigan sits behind a mountain of tomatoes, counting under her breath in Yoruba, with eyes wide open." }] }],
        options: [
          K.ask("ngozi", [
            K.t("You haven't slept?", ["Not since March. I started counting, in the dark, when I could not sleep, and I did not stop. In the morning I was not tired. It does not touch me when I count."], { free: true, clue: "c_insomnia", obj: "so2" }),
            K.t("What does it feel like?", "Like a very polite man standing at the foot of my bed, with a pen. When I count, he cannot start. When I stop, he clears his throat.", { clue: "c_insomnia", free: true }),
            K.t("Where is it?", [{ say: "She does not stop counting, but she lowers her voice." }, "Lekki. The big building by the water with the green lights that never go out. My nephew works the gate. He says no one goes in. They only take things out."], { cha: 7, clue: "c_lekki", set: "lekki_known" }),
            K.t("Will you come with us?", "I will count for you. I will count as long as you need.", { cha: 10, set: "ngozi_help" })
          ], { label: "Talk to Mama Ngozi", name: "Mama Ngozi", bye: ["Don't sleep. Count."] }),
          K.go("Back to the flat", "flat")] },
      ajo: { name: "Ajo, Yaba", theme: "modern", mood: "tense", lighting: "glow", weather: "none", cast: ["tunde"],
        onEnter: [{ once: "in", steps: [{ say: "A bright open-plan office on the fourth floor of a Yaba tech block: beanbags, a table football, a wall of screens showing a map of Lagos in sleeping blue. A man in a grey hoodie with a very ordinary key on a lanyard watches you come in." }] }],
        options: [
          K.ask("tunde", [
            K.t("What does Ajo really do?", ["It buys sleep. That's what it says. What it actually buys is the dreams. The data comes through us and goes to a facility we don't run. I put a hardware kill key into the first racks. My managers called it an insult."], { free: true, clue: "c_key", obj: "so1" }),
            K.t("Who are the buyers?", "I thought a pharma firm. An account called TALLY pays in a currency I can't convert. I looked once, in the logs. It has been buying for three years. It doesn't buy a night. It buys them all.", { clue: "c_ledger", free: true, obj: "so3" }),
            K.t("Where does the data go?", [{ say: "He looks toward the window." }, "To Lekki. A shell building on the water that Ajo has paid rent on for three years and never entered."], { cha: 7, clue: "c_lekki", set: "lekki_known" }),
            K.t("Why did you not shut it down?", "Because every time I touched it, my own number went down. And I have a son.", { cha: 11, set: "tunde_help" })
          ], { label: "Talk to Tunde", name: "Tunde", bye: ["Don't take the app at face value."] }),
          K.find("Read the dream ledger in the backup", "iq", "medium", "A table: every night's dreams, itemised by user, priced to the second decimal, billed to an account called TALLY. The column headed 'owed' has been rising for three years, and a column headed 'remaining' is going down.", "The table is too large.", { clue: "c_ledger", obj: "so3", hint: "Intelligence, Medium", tags: ["kill"], failClue: "c_ledger" }),
          K.find("Take the kill key from Tunde's lanyard", "charisma", "medium", "Tunde looks at the key for a long time. Then he takes it off the lanyard, and puts it in your hand. 'It's a physical key. It cuts the power to the core. If you cut the power, the sleepers may wake, or they may not. I never had the nerve to find out.'", "He is not ready to hand it over.", { if: "tunde_help", set: "have_key", obj: "so1", hint: "Charisma, Medium", tags: ["kill"] }),
          K.go("Back to the flat", "flat"),
          K.go("To the Lekki data centre", "lekki", { if: "lekki_known" })] },
      lekki: { name: "The Lekki data centre", theme: "future", mood: "boss", lighting: "dark", weather: "none",
        onEnter: [{ once: "in", steps: [{ say: "A squat grey data centre at the end of a causeway, green lights in every window, no guards, no cars. The airlock is open. Inside, rows of amber-lit racks, and two hundred beds on wheels, every sleeper's band glowing the same number: 3." }, { objective: "po1" }] }],
        options: [
          { label: "Count aloud, together, until they wake", hint: "Needs Mama Ngozi's method", if: { all: [{ obj: "so2" }, "ngozi_help"] }, steps: [{ check: { aspect: "willpower", cr: "challenging", label: "Count aloud, steadily, with Mama Ngozi, for the whole last three hours", who: "choose", tags: ["sleep"],
            ok: [{ say: "Mama Ngozi starts, in Yoruba, from one. You pick it up. You count, in your own languages, in a ring round the beds, for three hours. The clerk's voice, in the dark, begins to say a number, stops, and begins again. By the third hour it cannot find its place. The number on two hundred wrists reaches 1, and stops." }, { set: "res_count" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "Your voice cracks in the second hour. The clerk catches the gap." }, { damage: { pool: "sanity", amount: 3 } }] } }] },
          { label: "Turn the key at the core", hint: "Needs Tunde's kill key", if: "have_key", steps: [{ check: { aspect: "agility", cr: "medium", label: "Reach the core cabinet, and turn the key before the count reaches zero", who: "choose", tags: ["kill"],
            ok: [{ say: "You reach the cabinet, turn the key, and the whole hall goes dark and silent. In the silence, two hundred people draw the same breath. The number on their wrists goes out." }, { set: "res_key" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "The cabinet is locked from the inside." }, { damage: { pool: "stability", amount: 3 } }] } }] },
          { label: "Face the Tally at its desk", steps: [{ set: "res_fight" }, { combat: "core", win: [{ say: "The book closes, and the clerks put down their pens. On two hundred wrists, the number goes out." }, { objective: "po2" }, { goto: "end" }] }] }] },
      end: { name: "Lagos, the next morning", theme: "modern", mood: "calm", lighting: "glow", weather: "none",
        onEnter: [{ once: "in", steps: [
          { say: "In the morning forty thousand people in Lagos wake up to find that Ajo has been deleted from their phones, and that they have, all of them, slept very well." },
          { if: { flag: "res_count" }, then: [{ say: "You counted the sleepers awake, and Mama Ngozi counted with you. The Tally was left unable to find its place. It still exists, somewhere, in a book. It will try again." }] },
          { if: { flag: "res_key" }, then: [{ say: "You cut the power at the source. The data centre is cold, and the Tally's ledger is dark. Tunde Bakare is on a plane to Nairobi by nightfall, with his key." }] },
          { if: { flag: "res_fight" }, then: [{ say: "You broke the Tally at its desk. The book was burned. Dr. Okoro says he has never seen forty sleepers wake all at once and look so surprised." }] },
          { if: { obj: "so3" }, then: [{ say: "The ledger goes to the Association: three years of dreams, priced, and a debt that was never paid." }] },
          { end: "win" }] }], options: [] }
    }
  });

  /* ======================================================================= 2047 · The Last Reef */
  ADV.register({
    id: "last-reef", title: "The Last Reef", setting: "The Great Barrier Reef, Australia · 2047", year: 2047, level: [1, 9], agencies: ["BFV", "WCA", "NSBD", "EHG", "OID"], region: "oceania", theme: "sea",
    summary: "Mooring Nine is the last working coral laboratory on the reef: a floating platform growing heat-proof corals in tanks. The divers who go down to the new plantings come back changed: they talk in the voices of people who drowned, and they have started to grow things.",
    objectives: [
      { id: "po1", kind: "primary", t: "Find out what the new coral is, and what it remembers", done: "The lab's engineered coral took in a drowned crew's memories in a bleaching event nine years ago, and now remembers for them, and wants to keep the divers as well." },
      { id: "po2", kind: "primary", t: "Stop the planting, and bring the divers back", done: "The planting is cut off, and the divers surface, shaking, in their own voices." },
      { id: "so1", kind: "secondary", t: "Hear Dr. Rao's confession about the bleaching event", done: "Dr. Imogen Rao ran the lab in 2038, when a bleaching event killed the first prototype and drowned a dive crew in the tanks. She had the results buried.", benefit: { label: "The 2038 report", text: "You know what the reef is made of. A bonus on every roll to speak to its dead.", bonus: { tags: ["memory"], value: 2 } } },
      { id: "so2", kind: "secondary", t: "Find the old crew's last dive log", done: "A waterlogged dive computer from the 2038 crew, with a final recording: the sound of eleven voices counting down to a surfacing that never came.", benefit: { label: "The last log", text: "You can answer the dead in their own count. A bonus on every roll to bring them up.", bonus: { tags: ["surface"], value: 2 } } },
      { id: "so3", kind: "secondary", t: "Learn the heat that kills it", done: "The coral is built to resist heat. It dies in cold, fresh water: a flush from the old aquifer, which the lab has never used.", benefit: { label: "A cold flush", text: "+2 to your attacks against the Reef, and a bonus on every roll to purge the tanks.", bonus: { tags: ["purge"], value: 2 }, combat: { enemy: "reef", attack: 2 } } }
    ],
    clues: {
      c_divers: { t: "The divers talk in other voices", s: "The mess deck", x: "Three divers have come up from the new plantings speaking in other people's voices: an old man's, a woman's, a child's. They know things about the dead crew that they could not have learned." },
      c_growth: { t: "They have started to grow things", s: "The sick bay", x: "The returning divers have a fine, branching pink lattice under the skin of their forearms. Under magnification, it is coral." },
      c_bleach: { t: "The 2038 bleaching event", s: "The lab archive", x: "In February 2038 a marine heatwave killed the lab's first prototype in its tanks. A dive crew of eleven, repairing a failed pump, drowned in the flooded lower hall. The report was never published." },
      c_pump: { t: "The pumps are running backwards", s: "The engine room", x: "Mooring Nine's seawater intakes are running at twice their rated flow, in reverse: the lab is taking in what the reef gives out." },
      c_memory: { t: "The coral is a recording", s: "The tank", x: "The lab's new coral has absorbed the drowned crew's last moments into its skeleton, as a lattice. Every polyp is a moment. It plays them back to anyone who touches it." },
      c_aquifer: { t: "Cold fresh water under the platform", s: "The geologist", x: "A confined freshwater aquifer lies sixty metres under Mooring Nine's footing. It is cold and clean, and the lab's engineers have never tapped it." },
      c_names: { t: "Eleven names on a dive board", s: "The wet room", x: "On the board in the wet room, eleven names are chalked, dated February 2038. Under them, someone has chalked eleven tally marks. Over the last month, a twelfth, thirteenth, and fourteenth." }
    },
    npcs: {
      rao: N("Dr. Imogen Rao", "Director, Mooring Nine", "Fifties, in a salt-bleached lab coat with a sunhat and thick glasses, with a coffee mug she holds in both hands and a very steady voice.", F(2, 5, "bob", 7, "none", { sex: "f" })),
      kiri: N("Kiri Tamihana", "Chief diver", "A tall, broad Māori woman in a half-zipped wetsuit, her hair in a wet braid, with the watchful stillness of someone who has already been down.", F(3, 5, "braids", 3, "none", { sex: "f" })),
      sol: N("Sol Okafor", "Marine geologist", "A thin young man in a rash vest and board shorts under a lab coat, with a laptop in a waterproof case and a habit of looking at the floor as if he could see through it.", F(3, 3, "short", 6, "none", { sex: "m" }))
    },
    enemies: {
      reef: { build: { name: "The Remembering Reef", type: "Beyond", difficulty: "challenging", sprite: "spirit", hue: 330, dtype: "sanity", range: 1, core: { body: 1, mind: 3, spirit: 3 }, mods: ["Occult", "Tanky"],
        text: "Coral that remembers drowning. Replay: each round it plays one agent a drowning (Willpower Medium, or lose the next action and 3 Sanity as they relive it). It grows into anyone it touches. Cold fresh water kills it. Only Sanity harms it.", dies: "bleaches white from the root up, and then the whole lattice sighs, and lets go" } },
      diver: { build: { name: "A planted diver", type: "Human", difficulty: "easy", sprite: "humanoid", hue: 330, attack: 1, dtype: "health", dies: "gasps, and the pink lattice flakes off her arms into the water" } }
    },
    encounters: {
      tank: { name: "The flooded lower hall", theme: "cave", lit: false, fightText: "The lower hall of Mooring Nine is under four metres of warm green water, and every surface is pink coral. At the far end, in the shape of the dive crew's last position, a lattice of white and pink branches opens like a hand.", zones: [{ id: "a", name: "The access stair", col: 0, row: 0 }, { id: "b", name: "The planting rows", col: 1, row: 0 }, { id: "c", name: "The crew's last position", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "reef", zone: "c" }, { t: "diver", zone: "b" }, { t: "diver", zone: "b", name: "A planted diver (2)" }] }
    },
    start: "deck",
    scenes: {
      deck: { name: "Mooring Nine, the main deck", theme: "sea", mood: "tense", lighting: "glow", weather: "sea", cast: ["kiri"],
        onEnter: [{ once: "in", steps: [
          { say: "A floating platform the size of a football pitch, anchored in the open Coral Sea, three hours out of Cairns by hydrofoil. Solar canopies, a desalination stack, a wet room with racks of dive gear, and under it all, the green drone of pumps. The reef around it is bleached the colour of bone, except under the platform, where it is pink." },
          { talk: { npc: "kiri", text: "You're from the... Vanguard? The Association? Whoever. Good. I've lost three divers. I've not lost them. They're back. They're all here. They just aren't them." } }] }],
        options: [
          K.ask("kiri", [
            K.t("What happened to the divers?", ["Three went down to the new plantings, the last bay, for a routine check. They came up in four minutes with their regulators in their hands. They'd stopped breathing from the tanks. They don't need to. They speak in other voices. And they won't go back to their bunks."], { free: true, clue: "c_divers" }),
            K.t("What do they say?", "Old things. Things about the 2038 dive crew. Names. A pump that failed. Things none of them could know. They know every one of the eleven who drowned.", { clue: "c_names", free: true }),
            K.t("What is under the platform?", [{ say: "She looks at the water." }, "The new coral. Dr. Rao's project. It grows in the dark, in the tanks, heat-proof. It's the only living reef for two hundred kilometres. And it's... pleased with itself."], { cha: 7, set: "rao_known" }),
            K.t("Will you dive again?", "I'd go with you. I won't go alone.", { cha: 10, set: "kiri_help" })
          ], { label: "Talk to Kiri", name: "Kiri", bye: ["Don't touch it."] }),
          K.find("Look at one of the returned divers", "awareness", "medium", "A diver sits on a bunk, very still, speaking in a child's voice. Under her sleeve, on her forearm, a fine pink lattice has pushed up through the skin like a frost.", "A diver. Wet. Silent.", { clue: "c_growth", hint: "Awareness, Medium", failDamage: ["sanity", 1] }),
          K.find("Read the dive board in the wet room", "iq", "easy", "Eleven names chalked on the board under the date February 2038. Under them, eleven tally marks, and three newer ones in a different hand, in a different chalk.", "A scrawled board.", { clue: "c_names", hint: "Easy" }),
          K.go("To the director's office", "office", { if: "rao_known" }),
          K.go("To the sick bay", "sickbay"),
          K.go("To the engine room", "engine")] },
      sickbay: { name: "The sick bay", theme: "interior", mood: "dread", lighting: "shadow", weather: "none",
        onEnter: [{ once: "in", steps: [{ say: "A small white room with three bunks, each holding a diver who does not sleep. A medical tablet lies on a trolley, scrolling their vitals: all steady, all strangely slow." }] }],
        options: [
          K.find("Take a skin sample from a diver's arm", "iq", "medium", "Under the portable microscope: living coral polyps, white-tipped, in a lattice fused to the skin. They are quite happy. They are sharing, between them, some very faint electrical signal, in steps.", "The sample is spoiled.", { clue: ["c_growth", "c_memory"], hint: "Intelligence, Medium" }),
          K.find("Listen to what a diver says", "charisma", "easy", "She speaks, in the voice of an old man, quite calmly: 'We were ten metres down when the pump failed. We could see the surface. It was a very bright green.' She says it as though she were remembering a holiday.", "She does not answer.", { clue: "c_bleach", hint: "Charisma, Easy" }),
          K.go("Back to the deck", "deck")] },
      engine: { name: "The engine room", theme: "future", mood: "tense", lighting: "shadow", weather: "none", cast: ["sol"],
        onEnter: [{ once: "in", steps: [{ say: "A vault of pumps and pipes under the deck. A thin young man in a rash vest sits on an upturned bucket by a manifold, with a laptop in a waterproof case, looking at the floor as though he could see through it." }] }],
        options: [
          K.ask("sol", [
            K.t("What is wrong with the pumps?", ["They're running backwards. The seawater intakes are pulling at twice the rated flow. The lab is drinking what the reef gives it. I've tried to throttle it. The valves don't answer."], { free: true, clue: "c_pump" }),
            K.t("What is under the platform?", "A confined freshwater aquifer, sixty metres down. Cold. Clean. The engineers never tapped it. The lab's coral is built for hot, salt water. It has never met a cold, fresh one.", { free: true, clue: "c_aquifer", obj: "so3" }),
            K.t("Could you tap it?", [{ say: "He closes the laptop." }, "From here, with the right drill, in a day. It would flood the lower hall with fresh water. It would kill everything in it. It would kill the divers' lattices too. Maybe the divers."], { cha: 8, set: "sol_help" })
          ], { label: "Talk to Sol", name: "Sol", bye: ["Don't open the lower hatch."] }),
          K.find("Check the intake logs", "iq", "easy", "A graph of the intake flow since the bleaching event: a flat line at normal until February 2038, then a slow, steady climb, then a step in March, and a double step this week. Someone has written beside it: 'It's learning to drink.'", "Numbers.", { clue: "c_pump", hint: "Easy" }),
          K.go("Back to the deck", "deck")] },
      office: { name: "The director's office", theme: "interior", mood: "calm", lighting: "shadow", weather: "none", cast: ["rao"],
        onEnter: [{ once: "in", steps: [{ say: "A cramped office with a porthole, a desk of coral samples in glass jars, and a woman in a salt-bleached lab coat who has not looked at the porthole in nine years." }] }],
        options: [
          K.ask("rao", [
            K.t("What is the coral?", ["Mine. A heat-proof strain. It lived through the 2038 marine heatwave, when everything else on the reef died. It grew in the tanks. It was... wonderful."], { free: true, clue: "c_memory" }),
            K.t("What happened in February 2038?", [{ say: "She puts down the mug." }, "A pump failed in the lower hall. Eleven of my divers went down to fix it. The hall flooded. We got no one out. I had the report buried."], { cha: 7, clue: "c_bleach", obj: "so1", set: "rao_confessed" }),
            K.t("Where is the last dive log?", "In the lower hall. In the old crew's locker. Nobody's gone back for it. I'd go myself, but I'm afraid of what I'd hear.", { cha: 10, set: "log_known" })
          ], { label: "Talk to Dr. Rao", name: "Dr. Rao", bye: ["Be gentle with it. It isn't malicious."] }),
          K.go("Back to the deck", "deck"),
          K.go("Dive to the lower hall", "lower", { if: { all: [{ clue: "c_memory" }, { clue: "c_aquifer" }] } })] },
      lower: { name: "The flooded lower hall", theme: "cave", mood: "boss", lighting: "dark", weather: "none",
        onEnter: [{ once: "in", steps: [{ say: "Down the access stair, into four metres of warm green water. Every surface is pink coral. In a locker at the far end, a dive computer, still blinking, and in the water around it, very faintly, eleven voices counting down." }, { objective: "po1" }] }],
        options: [
          K.find("Recover the old crew's dive computer", "agility", "medium", "A waterlogged dive computer in the crew's locker, still running. When you hold it to your ear, eleven voices count down to a surfacing that never came.", "The locker is wedged shut.", { clue: "c_names", obj: "so2", hint: "Agility, Medium", tags: ["surface"], failClue: "c_names" }),
          { label: "Count the crew up", hint: "Needs the last dive log", if: { obj: "so2" }, steps: [{ check: { aspect: "willpower", cr: "challenging", label: "Count the old crew's dive up to the surface, aloud, with them", who: "choose", tags: ["surface", "memory"],
            ok: [{ say: "You hold the old computer, and count with them, from the bottom, one metre at a time, and when you reach the surface you say 'Surfaced.' In the lattice, eleven small lights go out, one by one, and the coral lets go of the divers' arms." }, { set: "res_surface" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "You lose the count in the green dark." }, { damage: { pool: "sanity", amount: 3 } }] } }] },
          { label: "Flood the hall with the cold aquifer", hint: "Needs Sol, and the aquifer", if: { all: ["sol_help", { obj: "so3" }] }, steps: [{ check: { aspect: "iq", cr: "medium", label: "Tap the aquifer, and purge the hall before the divers are caught in it", who: "choose", tags: ["purge"],
            ok: [{ say: "Sol drills the aquifer from above. Cold, fresh water pours into the lower hall from the footing, and the pink coral goes white from the root up, polyp by polyp. The divers surface through it, gasping, the lattices flaking from their arms." }, { set: "res_flush" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "The drill binds. The warm water rises." }, { damage: { pool: "health", amount: 3 } }] } }] },
          { label: "Face the Reef", steps: [{ set: "res_fight" }, { combat: "tank", win: [{ say: "The lattice sighs, and bleaches. The divers surface in their own voices." }, { objective: "po2" }, { goto: "end" }] }] }] },
      end: { name: "Mooring Nine, at dusk", theme: "sea", mood: "calm", lighting: "glow", weather: "none",
        onEnter: [{ once: "in", steps: [
          { say: "The sun goes down on a quiet platform. Three divers sit on the deck in their own voices, with towels round their shoulders, crying and laughing, and saying their own names." },
          { if: { flag: "res_surface" }, then: [{ say: "You counted the old crew to the surface. The coral let go. The first reef in nine years that no one will dive near is at peace." }] },
          { if: { flag: "res_flush" }, then: [{ say: "You flushed the lower hall with cold fresh water. The reef beneath the platform is white, and dead, and the divers are alive. Dr. Rao says she will not grow it again." }] },
          { if: { flag: "res_fight" }, then: [{ say: "You broke the lattice. It will not remember anyone again." }] },
          { if: { obj: "so1" }, then: [{ say: "Dr. Rao files the 2038 report, nine years late, under her own name." }] },
          { end: "win" }] }], options: [] }
    }
  });

  /* ======================================================================= 2061 · Heat Dome */
  ADV.register({
    id: "heat-dome", title: "Heat Dome", setting: "Delhi, India · 2061", year: 2061, level: [1, 9], agencies: ["BFV", "WCA", "NSBD", "EHG", "OID"], region: "asia-south", theme: "modern",
    summary: "Fifty-two degrees in the shade, for nineteen days. At noon, in the Old City, a cool, tree-lined quarter appears at the end of Chandni Chowk, with shade and running water. People who walk into it are not seen again. The city has started to call it the Cool Quarter, and to queue.",
    objectives: [
      { id: "po1", kind: "primary", t: "Find out what the Cool Quarter is, and what it takes", done: "A mirage with a ledger: it offers shade to the dying, and keeps whoever walks in as the price. It needs the heat to exist." },
      { id: "po2", kind: "primary", t: "Close the Cool Quarter, and bring out the people inside", done: "The mirage folds up in the noon sun. Sixty-one people walk out, in shade-less light, alive." },
      { id: "so1", kind: "secondary", t: "Find the shade-sail's anchor on the roof", done: "A rooftop installation of fabric shade-sails, put up by the city, anchors the mirage. Its pylon is the only thing in the Cool Quarter that is real.", benefit: { label: "The anchor", text: "You know what holds it. A bonus on every roll to pull it down, and +2 to your attacks against the Mirage.", bonus: { tags: ["anchor"], value: 2 }, combat: { enemy: "mirage", attack: 2 } } },
      { id: "so2", kind: "secondary", t: "Learn Bibi Sultana's trick for the mirage", done: "Bibi Sultana has sold water on Chandni Chowk for sixty years. She never looks at the shade: she looks at the ground, and counts her own footsteps. The mirage cannot move a person who watches their own feet.", benefit: { label: "Watch your feet", text: "A bonus on every roll to resist the Cool Quarter's pull.", bonus: { tags: ["pull"], value: 3 } } },
      { id: "so3", kind: "secondary", t: "Find the municipal cooling ledger", done: "The city's heat-relief programme has been logging every shelter visit. The names of the missing match the visitors to one particular shaded bench.", benefit: { label: "Who it took", text: "You know who is inside. A bonus on every roll to call them out.", bonus: { tags: ["names"], value: 2 } } }
    ],
    clues: {
      c_heat: { t: "Nineteen days over fifty", s: "Dr. Rao", x: "Delhi has been above 50 °C for nineteen days. 2,300 people have died of the heat. The city's cooling shelters have run out of beds." },
      c_quarter: { t: "A cool quarter at noon", s: "Karan", x: "At noon each day, at the end of Chandni Chowk, a shaded avenue of neem trees appears, with a fountain and cool tiles. People walk into it. Eighty-three so far have not come out." },
      c_names: { t: "They all sat on one bench", s: "The cooling ledger", x: "The municipal cooling-shelter ledger records every visitor. Every one of the missing visited the shelter at the same address, and sat on the same shaded bench, a day before they walked into the Cool Quarter." },
      c_anchor: { t: "A shade-sail on the roof", s: "The shelter roof", x: "On the roof of the shelter, a municipal shade-sail installation with a steel pylon. In the heat haze, the shadow it casts does not fall where the sun puts it: it falls toward Chandni Chowk." },
      c_feet: { t: "Don't look at the shade", s: "Bibi Sultana", x: "Bibi Sultana has sold water on Chandni Chowk for sixty years and has never been taken. She does not look at the shade. She looks at the ground, and counts her own footsteps." },
      c_heatneed: { t: "It only exists in the heat", s: "Dr. Rao", x: "Every appearance of the Cool Quarter has been at a temperature above 50 °C. It needs the heat, as a candle needs air. Below that, it has not been seen." },
      c_ledger: { t: "A ledger in the shade", s: "The Quarter", x: "Anyone who has glimpsed inside the Cool Quarter has seen the same thing: a long cool arcade of a ledger-clerk's tables, and each missing person's name being written, slowly, in ink the colour of shade." }
    },
    npcs: {
      rao: N("Dr. Meenakshi Rao", "Climate epidemiologist, AIIMS", "Late forties, in a white coat gone grey with heat and a cooling vest, a tablet in a ruggedised case, with the calm of someone who counts the dead every morning.", F(2, 5, "bun", 7, "none", { sex: "f" })),
      karan: N("Karan", "Autonomous-cab fleet driver", "Twenty-eight, in a drenched shirt and a gamchha round his neck, with a phone clamped to his dash showing a map with eighty-three red dots.", F(2, 5, "short", 6, "none", { sex: "m" })),
      sultana: N("Bibi Sultana", "Water-seller, Chandni Chowk", "Eighty if a day, in a faded green dupatta, at a clay-pot stand under a tarpaulin, ladling water for anyone who asks, and looking at her own feet.", F(2, 5, "headscarf", 1, "none", { sex: "f" })),
      sharma: N("Inspector Sharma", "Delhi police, Old City", "Fifties, in a short-sleeved khaki shirt with a towel round his neck, a clipboard with a list of eighty-three names, and the eyes of a man who has stopped being surprised.", F(2, 5, "bald", 5, "none", { sex: "m" }))
    },
    enemies: {
      mirage: { build: { name: "The Cool Quarter", type: "Beyond", difficulty: "challenging", sprite: "spirit", hue: 160, dtype: "sanity", range: 1, core: { body: 1, mind: 3, spirit: 3 }, mods: ["Occult"],
        text: "A mirage with a ledger. Shade: each round it offers one agent a place in the shade (Willpower Medium to refuse, or lose the next action and step inside). Its pylon is real; its heat is its air: below 50 degrees it cannot stand, and shade-sails taken down break it. Only Sanity harms it.", dies: "folds into the noon haze like wet paper, and the noon sun lands, flat and hot, on a dusty street" } },
      shaded: { build: { name: "A shaded one", type: "Human", difficulty: "easy", sprite: "humanoid", hue: 150, attack: 0, dtype: "health", dies: "blinks in the sun, and says, in a small voice, that it is very hot" } }
    },
    encounters: {
      quarter: { name: "Inside the Cool Quarter", theme: "street", fightText: "The avenue of neem trees is cool and green and quiet, and in the shade at its heart a long table of clerks is writing names in ink the colour of shade. Sixty-one people sit along it, patiently, waiting to be entered.", zones: [{ id: "a", name: "The arcade mouth", col: 0, row: 0 }, { id: "b", name: "The shaded avenue", col: 1, row: 0 }, { id: "c", name: "The ledger table", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "mirage", zone: "c" }, { t: "shaded", zone: "b" }, { t: "shaded", zone: "b", name: "A shaded one (2)" }] }
    },
    start: "hospital",
    scenes: {
      hospital: { name: "AIIMS, the heat ward", theme: "interior", mood: "tense", lighting: "glow", weather: "none", cast: ["rao"],
        onEnter: [{ once: "in", steps: [
          { say: "Delhi in the nineteenth day of the dome, 2061. Fifty-two degrees in the shade, no wind, a sky the colour of old tin. In the heat ward at the AIIMS, rows of cooling beds line a corridor, every one of them taken, every fan at maximum. A woman in a grey cooling vest moves between them with a tablet." },
          { talk: { npc: "rao", text: "You've come about the Quarter. Everyone who's anyone has come about the Quarter. Nobody has come to fix the beds." } }] }],
        options: [
          K.ask("rao", [
            K.t("What is the heat doing?", ["Nineteen days over fifty. Two thousand three hundred dead. The shelters are full. The grid is browning out every afternoon. The city is dying of heat, quite simply, and it is not stopping."], { free: true, clue: "c_heat" }),
            K.t("What is the Cool Quarter?", "At noon, at the end of Chandni Chowk, a cool green avenue appears. Neem trees, a fountain, cool tiles. People walk in. Eighty-three haven't come out. We call it the Quarter. People queue for it.", { free: true, clue: "c_quarter", set: "quarter_known" }),
            K.t("When does it appear?", [{ say: "She taps the tablet." }, "Only above fifty. Every appearance has been above fifty. It needs the heat the way a candle needs air."], { cha: 7, clue: "c_heatneed" }),
            K.t("Who else knows?", "Karan, a cab driver, who keeps a map of the missing. And Bibi Sultana, the water-seller. She says she has never been taken. Ask her why.", { cha: 10, set: "karan_known" })
          ], { label: "Talk to Dr. Rao", name: "Dr. Rao", bye: ["Hydrate. I mean it."] }),
          K.find("Read the ward's heat-death log", "iq", "easy", "Every bed's last six hours of readings, and, in the notes column, one phrase from three different nurses, in three different hands: 'asked to go somewhere cool.'", "Numbers, columns.", { clue: "c_heat", hint: "Easy" }),
          K.go("Find Karan, the cab driver", "cab", { if: "quarter_known" }),
          K.go("To Chandni Chowk", "chowk", { if: "quarter_known" })] },
      cab: { name: "A cab on the Ring Road", theme: "modern", mood: "tense", lighting: "glow", weather: "none", cast: ["karan"],
        onEnter: [{ once: "in", steps: [{ say: "An autonomous cab pulled over under a flyover, its air-conditioning grinding, and a drenched young man in the driver's seat who has switched it to manual so that he can watch the road himself." }] }],
        options: [
          K.ask("karan", [
            K.t("Tell us about the map.", ["I keep it. Eighty-three red dots. Each one a fare I took to Chandni Chowk at noon, or a customer I knew. I've marked where they walked in. It's always the same place: the corner by the old clock shop."], { free: true, clue: "c_quarter" }),
            K.t("Why did you keep it?", "Because I took the first one. A woman with a baby. I thought: she wants shade. I did not think to ask where she was going.", { cha: 7, set: "karan_guilt" }),
            K.t("What does it look like inside?", [{ say: "He shakes his head." }, "I went to the edge once. Neem trees. A fountain. And a long table of men writing, in ink the colour of shade. And all the names on the paper were people I knew."], { cha: 10, clue: "c_ledger" }),
            K.t("Will you drive us?", "At eleven. I will take you as far as the clock.", { cha: 8, set: "karan_help" })
          ], { label: "Talk to Karan", name: "Karan", bye: ["Don't look at the shade."] }),
          K.find("Read Karan's map of the missing", "iq", "easy", "Eighty-three red dots, each with a time. Every one is within a hundred metres of the old clock shop at the end of Chandni Chowk, and every time is between 11:52 and 12:04.", "Dots. Times. Heat on the screen.", { clue: "c_quarter", hint: "Easy" }),
          K.go("Back to the ward", "hospital")] },
      chowk: { name: "Chandni Chowk, a quarter to noon", theme: "street", mood: "weird", lighting: "glow", weather: "none", cast: ["sultana", "sharma"],
        onEnter: [{ once: "in", steps: [{ say: "The old market street is almost empty, shutters down, a haze of heat shaking the air above the pavement. At a clay-pot stand under a green tarpaulin, an old woman ladles water for no one, looking at her own feet. Across the road, a police inspector watches the end of the street with a list." }] }],
        options: [
          K.ask("sultana", [
            K.t("Have you seen the Quarter?", ["Every day for nineteen days. I do not look at it. I have never looked at it. A good water-seller knows not to watch the thing she is selling against."], { free: true, clue: "c_quarter" }),
            K.t("Why have you not been taken?", "I look at my feet. I count my steps, from my stall to the corner and back. It cannot move a woman who is counting. Try it.", { clue: "c_feet", obj: "so2", free: true }),
            K.t("What does it want?", [{ say: "She hands you a cup of water." }, "A name. Every one it takes is a name it writes. It cannot keep a person who has no name for it to write. That is all I know, and sixty years of selling water to the dying."], { cha: 8, set: "name_hint" })
          ], { label: "Talk to Bibi Sultana", name: "Bibi Sultana", bye: ["Drink. Look down."] }),
          K.ask("sharma", [
            K.t("How many?", ["Eighty-three. I have the list. Every one a person who walked into the mouth of the street at noon. I stand here every day and I have not once been able to stop someone."], { free: true, clue: "c_quarter" }),
            K.t("May we see the list?", "You may. I have copied it. Read the names. They're good people. They're all just very hot.", { clue: "c_names", obj: "so3", cha: 6 })
          ], { label: "Talk to Inspector Sharma", name: "Inspector Sharma", bye: ["Be careful. It is nearly noon."] }),
          K.find("Look at the end of the street without looking at the shade", "willpower", "medium", "At the end of the street, past the old clock shop, the haze thickens, and a line of dark green begins to stand up out of it, tall as a tree. You look at your feet. You count your steps, and the green does not move you.", "You look too long. The shade pulls at you.", { clue: "c_quarter", hint: "Willpower, Medium", tags: ["pull"], failDamage: ["sanity", 2] }),
          K.go("Climb to the shelter roof", "roof"),
          K.go("Wait for noon, at the mouth of the street", "noon", { if: { all: [{ clue: "c_feet" }, { clue: "c_names" }] } })] },
      roof: { name: "The roof of the heat shelter", theme: "modern", mood: "weird", lighting: "glow", weather: "none",
        onEnter: [{ once: "in", steps: [{ say: "A flat tar roof under a steel-and-fabric shade-sail, with a pylon in the middle bolted to the structure. In the heat, the shadow it casts lies the wrong way: toward Chandni Chowk." }] }],
        options: [
          K.find("Look at the shade-sail's shadow", "awareness", "medium", "The sun is at its peak, and the shade-sail's shadow should be a puddle under it. It is a long, dark band running away along the roof, over the edge, down the street, toward the old clock shop, as if it were being drawn on.", "A shade-sail. A shadow.", { clue: "c_anchor", obj: "so1", hint: "Awareness, Medium", tags: ["anchor"], failClue: "c_anchor" }),
          K.find("Read the shelter's cooling ledger", "iq", "easy", "Every visit, logged to the minute. Every one of the missing sat, the day before they vanished, on the shaded bench under this sail, for forty-one minutes. The ledger notes it as 'rest'.", "A long ledger.", { clue: "c_names", obj: "so3", hint: "Easy" }),
          K.go("Back to the street", "chowk")] },
      noon: { name: "The mouth of the street, noon", theme: "street", mood: "boss", lighting: "bright", weather: "none",
        onEnter: [{ once: "in", steps: [{ say: "Noon. The heat is a physical weight. At the end of the street the haze gathers, and a cool green arcade of neem trees stands up out of it: shade, fountain water, a line of cool white tiles. People are queuing. They are smiling. The shade looks at you." }, { objective: "po1" }] }],
        options: [
          { label: "Pull down the shade-sail, so the Quarter has no anchor", hint: "Needs the roof, and Karan", if: { all: [{ obj: "so1" }, "karan_help"] }, steps: [{ check: { aspect: "strength", cr: "medium", label: "Get the pylon down while the sun is at its height", who: "choose", tags: ["anchor"],
            ok: [{ say: "You, Karan and Inspector Sharma cut the shade-sail's cables, and the pylon comes down across the roof in a shriek of steel. At the end of the street, the green arcade stutters, and for a moment all the neem trees lean the wrong way. Then the sun, at last, lands, flat and hot, on a dusty street. Sixty-one people stand in it, blinking, very thirsty." }, { set: "res_anchor" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "The pylon will not come down. The Quarter leans toward you." }, { damage: { pool: "stability", amount: 3 } }] } }] },
          { label: "Call the missing by name, across the street", hint: "Needs the ledger, and the names", if: { all: [{ obj: "so3" }, "name_hint"] }, steps: [{ check: { aspect: "charisma", cr: "challenging", label: "Say all eighty-three names aloud, and do not look at the shade", who: "choose", tags: ["names", "pull"],
            ok: [{ say: "You read the list, one name at a time, looking at your feet. Sharma reads it with you. Across the street, in the Quarter's cool dark, a long table of clerks looks up, one after another, as their ink runs dry. And the people on the benches stand up." }, { set: "res_names" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "You look up. The shade is very kind." }, { damage: { pool: "sanity", amount: 3 } }] } }] },
          { label: "Walk in, and take the Quarter", steps: [{ set: "res_fight" }, { combat: "quarter", win: [{ say: "The arcade folds into the noon haze like wet paper. The sun, flat and hot, lands on a dusty street, and sixty-one people stand in it, alive." }, { objective: "po2" }, { goto: "end" }] }] }] },
      end: { name: "Chandni Chowk, in the evening", theme: "street", mood: "calm", lighting: "glow", weather: "none",
        onEnter: [{ once: "in", steps: [
          { say: "At six in the evening, for the first time in nineteen days, a wind comes off the Yamuna. The city goes up on its roofs to feel it." },
          { if: { flag: "res_anchor" }, then: [{ say: "You pulled the shade-sail down. The city has been told it was a structural failure. It will be rebuilt, and no one will think to ask why it cast the shadow it did." }] },
          { if: { flag: "res_names" }, then: [{ say: "You read the missing out of the shade, one by one. Inspector Sharma has the list framed in the station, and every name has a line through it." }] },
          { if: { flag: "res_fight" }, then: [{ say: "You broke the Cool Quarter in the noon sun. In the evening, a neem tree stands at the end of Chandni Chowk where there was none, in real shade, and nobody will sit under it." }] },
          { if: { obj: "so2" }, then: [{ say: "Bibi Sultana teaches the heat-ward nurses to count their steps." }] },
          { end: "win" }] }], options: [] }
    }
  });
})();
