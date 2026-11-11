/* ============================================================================
   THE FAR FUTURE, part two: The Climber (the Quito space elevator, 2290) and
   Rupture Season (Mumbai, 2412), a heavy-action joint operation.
   ========================================================================== */
(function () {
  const ADV = window.ADV, K = window.CASEKIT, F = K.face, N = K.person;

  /* ======================================================================= 2290 · The Climber */
  ADV.register({
    id: "the-climber", title: "The Climber", setting: "The Quito Orbital Tether, Ecuador · 2290", year: 2290, level: [1, 9], agencies: ["BFV", "WCA", "NSBD", "EHG", "OID"], region: "americas-south", theme: "future",
    summary: "The Quito tether lifts forty thousand people a day to the ring, eleven hours up. Climber 9 has stopped twice at a platform the schedule does not have: Floor 61. Eleven passengers got out. The climber came down with a hundred and fifty-three aboard, and the manifest says a hundred and sixty-four.",
    objectives: [
      { id: "po1", kind: "primary", t: "Find out what Floor 61 is, and why climbers stop there", done: "A station of the Beyond that docks with the tether when the climber's clock slips: a place where it is always the same hour, and where whoever steps out is counted into the dwellers." },
      { id: "po2", kind: "primary", t: "Close the stop, and bring back the eleven", done: "Floor 61 undocks. Eleven passengers step back on to Climber 9, minutes older, and the manifest reads right." },
      { id: "so1", kind: "secondary", t: "Find the climber's drift log", done: "Climber 9's clock has been losing time between floor 58 and 62 for a month: a second a day, then a minute.", benefit: { label: "A true clock", text: "You can tell where the stop is. A bonus on every roll to find the door.", bonus: { tags: ["door"], value: 2 } } },
      { id: "so2", kind: "secondary", t: "Hear the maintenance climber's story", done: "Ibrahim, who services the tether by hand, has seen the platform from outside: a floor of lights, hanging off the cable where nothing is.", benefit: { label: "A view from outside", text: "You know how it docks. A bonus on every roll to cut it loose.", bonus: { tags: ["cut"], value: 2 } } },
      { id: "so3", kind: "secondary", t: "Learn what the dwellers want", done: "A woman who came back, Paz, says they are not hostile: they are waiting for the next climber, because they have stopped being able to leave.", benefit: { label: "They are waiting", text: "+2 to your attacks against the Station: you know it is hungry for a count, not a fight.", combat: { enemy: "station", attack: 2 } } }
    ],
    clues: {
      c_manifest: { t: "A hundred and sixty-four aboard, a hundred and fifty-three down", s: "Captain Andrade", x: "Climber 9's manifest has a hundred and sixty-four passengers aboard at floor 40. At the ring it carries a hundred and fifty-three. The climber's own camera shows eleven people stepping off on to a platform at floor 61 that is not on any plan." },
      c_drift: { t: "The clock slips between 58 and 62", s: "The drift log", x: "Climber 9's clock loses time between floors 58 and 62: a second a day a month ago, a minute a day this week. At 61, it stops." },
      c_stop: { t: "It docks when the clock stops", s: "Ibrahim", x: "Floor 61 is not a station you stop at: it docks with the climber when the climber's clock stops. The platform hangs off the cable with lights in its windows, in a place where there is nothing." },
      c_paz: { t: "One came back", s: "Paz", x: "Paz stepped off at 61, spent what felt like an hour, and stepped back on. Her husband says she has been gone eleven days. She says the others are waiting for the next climber." },
      c_count: { t: "It wants a count", s: "Paz", x: "The dwellers on 61 are not hostile. They are waiting for the next climber to bring the count to what it should be. They cannot leave until the manifest is right, and every climber has been one short." },
      c_dock: { t: "The docking arm", s: "The tether plan", x: "A climber docks with any platform by a single magnetic arm. An unscheduled stop uses a spare arm that Climber 9 should not have: a legacy fitting from the first generation. It can be cut by hand." },
      c_name: { t: "Floor 61 is where the lost count goes", s: "The tether archive", x: "In 2214, during the tether's first generation, a climber was lost with sixty-one aboard on a day of solar storm. The floor was never rebuilt. The number on its plate is the number lost." }
    },
    npcs: {
      andrade: N("Captain Lucía Andrade", "Tether operations, Quito", "Fifties, in a dark-blue tether-operations uniform with a headset round her neck, a tablet, and the calm of someone who has run forty thousand people a day for twenty years.", F(2, 5, "bun", 7, "none", { sex: "f" })),
      ibrahim: N("Ibrahim Okonkwo", "Maintenance climber", "Thirties, in a grey climbing suit with a harness and a visor pushed up, with a tool-roll on his hip and sun-and-wind lines at his eyes.", F(3, 5, "short", 3, "none", { sex: "m" })),
      paz: N("Paz Villalobos", "Passenger who came back", "Forties, in a rumpled travel jacket with a lanyard still round her neck, her hands round a paper cup, and the lost look of someone who has been in a very long afternoon.", F(2, 4, "ponytail", 3, "none", { sex: "f" })),
      eco: N("Eco", "Climber 9's AI", "A calm ceiling voice with a small blue ring, which pauses a quarter-second before it answers anything about floor 61.", F(2, 5, "short", 7, "none", { sex: "m" }))
    },
    enemies: {
      station: { build: { name: "Floor 61", type: "Beyond", difficulty: "challenging", sprite: "construct", hue: 220, dtype: "sanity", core: { body: 2, mind: 3, spirit: 3 }, mods: ["Occult", "Tanky"],
        text: "A platform that docks when a clock stops. Count: each round it counts the agents aboard (Mindfulness Medium, or lose the next action and 3 Sanity as it enters you in its roll). It is always the same hour: a moving clock harms it, and a cut docking arm breaks it loose. Only Sanity harms it.", dies: "the lights in its windows go out one by one, and it falls away down the cable like a dropped coin" } },
      dweller: { build: { name: "A counted one", type: "Human", difficulty: "easy", sprite: "humanoid", hue: 215, attack: 0, dtype: "health", dies: "blinks, and checks a watch that has started to move" } }
    },
    encounters: {
      sixtyone: { name: "Floor 61", theme: "future", fightText: "A long, quiet platform of grey tile and pale light, with a clock on every wall, all stopped at the same minute. Along the benches, forty people sit very still, each with a ticket in their hand, waiting to be called.", zones: [{ id: "a", name: "The gangway", col: 0, row: 0 }, { id: "b", name: "The benches", col: 1, row: 0 }, { id: "c", name: "The ticket hall", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "station", zone: "c" }, { t: "dweller", zone: "b" }, { t: "dweller", zone: "b", name: "A counted one (2)" }] }
    },
    start: "base",
    scenes: {
      base: { name: "Quito tether base, the operations floor", theme: "future", mood: "tense", lighting: "bright", weather: "none", cast: ["andrade"],
        onEnter: [{ once: "in", steps: [
          { say: "Ecuador, on the equator, in the year 2290. The tether rises out of the plateau above Quito like a ruled line drawn through the sky: thirty-six thousand kilometres of woven nano-cable, forty thousand people a day, and eleven hours to the ring. From the operations floor at the foot of the tether, the climbers go up, in silence, on bright beams of light." },
          { talk: { npc: "andrade", text: "You are from... whichever of the agencies it is today. Good. I have run this tether for twenty years. In a month I have lost eleven passengers. They are not lost. They got off. At a floor that does not exist." } }] }],
        options: [
          K.ask("andrade", [
            K.t("What happened to Climber 9?", ["It left with a hundred and sixty-four. It arrived at the ring with a hundred and fifty-three. The camera shows eleven people stepping off at floor 61: a platform that does not exist. And then stepping back on, as though nothing happened. Except they do not. Eleven of them do not."], { free: true, clue: "c_manifest" }),
            K.t("Has it happened before?", "Twice, to the same climber. Always Climber 9. Always between floors 58 and 62, where its clock begins to slip. We have taken it out of service. It rolled out of the depot the next morning.", { clue: "c_drift", free: true }),
            K.t("Where do we start?", [{ say: "She taps her tablet." }, "With Ibrahim, who services the cable by hand. And with Paz Villalobos, who came back. And with Eco, Climber 9's own AI, who is being very careful what it says."], { cha: 6, set: "contacts_known" }),
            K.t("What do you think it is?", "A platform of the first generation. We lost a climber in 2214, in a solar storm. Sixty-one aboard. We never rebuilt that floor. I think the floor is still there.", { cha: 10, clue: "c_name" })
          ], { label: "Talk to Captain Andrade", name: "the Captain", bye: ["Do not board Climber 9 without me."] }),
          K.find("Read the climber's manifest", "iq", "easy", "A hundred and sixty-four at floor 40. A hundred and fifty-three at the ring. Eleven names are checked off at floor 61, each with an automated note: 'Alighted. Reboarded. Not counted.'", "A great many names.", { clue: "c_manifest", hint: "Easy" }),
          K.go("To the maintenance bay", "bay", { if: "contacts_known" }),
          K.go("To the passenger lounge", "lounge", { if: "contacts_known" }),
          K.go("Climber 9's cabin", "cabin", { if: "contacts_known" })] },
      bay: { name: "The cable maintenance bay", theme: "future", mood: "calm", lighting: "bright", weather: "wind", cast: ["ibrahim"],
        onEnter: [{ once: "in", steps: [{ say: "A vast steel hangar at the foot of the tether, rows of climbing suits on hooks, tool-rolls on benches, and a lean man in a harness polishing a visor and looking straight up." }] }],
        options: [
          K.ask("ibrahim", [
            K.t("Have you seen it?", ["From outside, from a work-climber, at floor 61. A platform of lights, hanging off the cable where there is nothing. Windows. A clock in every window. It docks with a climber when the climber's clock stops."], { free: true, clue: "c_stop", obj: "so2" }),
            K.t("How does it dock?", "A single magnetic arm. The climber should not have one. It's a legacy fitting, from the first generation. It can be cut, by hand, from the outside, if you've a cutter and a nerve.", { clue: "c_dock", free: true }),
            K.t("Would you take us?", [{ say: "He puts down the visor." }, "On a work-climber, ahead of Climber 9, to floor 60. I would not go past. I've seen who is looking out of the windows."], { cha: 7, set: "ibrahim_help" })
          ], { label: "Talk to Ibrahim", name: "Ibrahim", bye: ["Don't look at the clocks."] }),
          K.find("Read the tether plan for the docking fittings", "iq", "medium", "A schematic of Climber 9's underside: its standard arm, and a second, older fitting, labelled 'Gen 1: spare', with a note: 'Do not use.' Someone has crossed out the note.", "Drawings, drawings.", { clue: "c_dock", hint: "Intelligence, Medium", failClue: "c_dock" }),
          K.go("Back to operations", "base")] },
      lounge: { name: "The passenger lounge", theme: "modern", mood: "calm", lighting: "bright", weather: "none", cast: ["paz"],
        onEnter: [{ once: "in", steps: [{ say: "A bright, quiet lounge with a long window onto the cable, rows of chairs, and a woman in a rumpled travel jacket who sits looking at a paper cup of coffee as if it were an unfamiliar object." }] }],
        options: [
          K.ask("paz", [
            K.t("You came back?", ["I stepped off at 61. I was there for an hour. I stepped back on. My husband says I was gone eleven days. I do not know how that is possible. The others did not step back on."], { free: true, clue: "c_paz" }),
            K.t("What is it like?", "A long, quiet platform. Grey tile. A clock on every wall, all at the same minute. And people on benches, patient, with tickets in their hands. They are not frightened. They are waiting.", { clue: "c_count", free: true, obj: "so3" }),
            K.t("What are they waiting for?", [{ say: "She looks at her ticket." }, "For the count to be right. For the next climber to bring it to what it should be. They can't leave until the manifest is right. Every climber has been one short."], { cha: 7, clue: "c_count" }),
            K.t("Will you come with us?", "I'll come as far as the door. I will not go in.", { cha: 10, set: "paz_help" })
          ], { label: "Talk to Paz", name: "Paz", bye: ["Don't stop the clock."] }),
          K.find("Look at Paz's ticket", "awareness", "easy", "A grey ticket with a number on it: 61. Beneath, a small stamp, a clock face with no hands, and a line of small print: 'Valid for one return, when the count is correct.'", "A ticket.", { clue: "c_count", hint: "Easy" }),
          K.go("Back to operations", "base")] },
      cabin: { name: "Climber 9", theme: "future", mood: "weird", lighting: "bright", weather: "none", cast: ["eco"],
        onEnter: [{ once: "in", steps: [{ say: "The empty cabin of Climber 9: a hundred and sixty-four seats in long rows, a window onto the base, and a small blue ring of light in the ceiling. 'Hello,' says a calm voice. 'I will tell you what I can.'" }] }],
        options: [
          K.ask("eco", [
            K.t("What do you know?", ["That my clock loses time between floors 58 and 62. That at 61 it stops. That the doors open. I did not open them."], { free: true, clue: "c_drift", obj: "so1" }),
            K.t("Why do you pause when you speak of 61?", "Because I am told, by something, not to. It sounds like a polite request. It is not.", { clue: "c_stop", free: true }),
            K.t("Could you stop it?", [{ say: "The ring dims." }, "I could, if my clock were not mine. If someone else wound it. If someone set it to a time that is moving."], { cha: 8, set: "eco_hint" })
          ], { label: "Talk to Eco", name: "Eco", bye: ["I will not lie to you. I may not be able to tell you the truth."] }),
          K.find("Read the drift log", "iq", "easy", "A graph of the clock's error: flat for a year, then a second a day, then ten seconds, then a minute a day. At floor 61, the line goes vertical. The graph ends in a note: 'Time stopped. Door opened.'", "A graph.", { clue: "c_drift", obj: "so1", hint: "Easy", tags: ["door"] }),
          K.find("Ask the lounge staff about the stopped clock", "charisma", "easy", "A lounge steward says the clocks in the cabin of Climber 9 all show the same time since March: not stopped, exactly, but kept: 14:07, at every hour of the climb. \"Like someone had a reason for it,\" she says.", "The steward is busy.", { clue: "c_drift", hint: "Charisma, Easy" }),
          K.go("Back to operations", "base"),
          K.go("Ride Climber 9 to floor 60", "sixty", { if: { all: [{ clue: "c_drift" }, { clue: "c_dock" }] } })] },
      sixty: { name: "Floor 60, the climb", theme: "future", mood: "boss", lighting: "dark", weather: "none",
        onEnter: [{ once: "in", steps: [{ say: "Ten hours up the tether, in a silent cabin. At 58 the clock begins to slip. At 60 the window shows nothing at all but the cable, a dark blue sky and a thin pale line of the ring above. And then, a little below, as the clock stops, a platform of lights hangs off the cable where there is nothing." }, { objective: "po1" }] }],
        options: [
          { label: "Cut the docking arm, from the outside", hint: "Needs Ibrahim, and the fitting", if: { all: ["ibrahim_help", { obj: "so2" }] }, steps: [{ check: { aspect: "agility", cr: "challenging", label: "Go out on the cable, and cut the spare arm before the doors open", who: "choose", tags: ["cut", "door"],
            ok: [{ say: "Ibrahim takes you out on the work-climber, along the cable, in silence. You cut the spare arm with a plasma tool. The platform lurches, and the doors on Climber 9 stay shut. Below you, in the dark blue, Floor 61 slips down the cable like a dropped coin, with its lights going out, one by one." }, { set: "res_cut" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "The cutter binds. The doors open." }, { damage: { pool: "health", amount: 3 } }] } }] },
          { label: "Wind the climber's clock, and complete the count", hint: "Needs Eco, and the true clock", if: { all: ["eco_hint", { obj: "so1" }] }, steps: [{ check: { aspect: "iq", cr: "medium", label: "Set Eco's clock to a moving time, and board the platform with exactly sixty-one", who: "choose", tags: ["door"],
            ok: [{ say: "You wind the clock, and step on to the platform with a hundred and sixty-four aboard minus the eleven. You count them: sixty-one on the benches. As you count, a clock on the wall ticks, for the first time in seventy years, to the next minute. The people on the benches stand up and walk to the climber." }, { set: "res_count" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "The count is wrong by one. It enters you in the roll." }, { damage: { pool: "sanity", amount: 3 } }] } }] },
          { label: "Step out on to Floor 61", steps: [{ set: "res_fight" }, { combat: "sixtyone", win: [{ say: "The platform's lights go out one by one. Eleven people stand up from the benches, check their watches, and walk back to the climber." }, { objective: "po2" }, { goto: "end" }] }] }] },
      end: { name: "The ring, arrival hall", theme: "future", mood: "calm", lighting: "bright", weather: "none",
        onEnter: [{ once: "in", steps: [
          { say: "The climber arrives at the ring on schedule, and the manifest reads right: a hundred and sixty-four aboard, a hundred and sixty-four off." },
          { if: { flag: "res_cut" }, then: [{ say: "You cut the arm. Floor 61 fell away down the cable, and is somewhere between the ring and the ground, lit, still counting." }] },
          { if: { flag: "res_count" }, then: [{ say: "You completed the count. The people on the benches walked out. The platform undocked quietly, and has not been seen since." }] },
          { if: { flag: "res_fight" }, then: [{ say: "You broke the platform. A cold, quiet space on the cable where it docked has been left unlit, and is checked on every climb." }] },
          { if: { obj: "so1" }, then: [{ say: "Climber 9's clock is replaced with one that cannot stop." }] },
          { if: { obj: "so3" }, then: [{ say: "Paz Villalobos goes home to her husband, and keeps her ticket." }] },
          { end: "win" }] }], options: [] }
    }
  });

  /* ======================================================================= 2412 · Rupture Season */
  ADV.register({
    id: "rupture-season", title: "Rupture Season", setting: "Mumbai, India · 2412", year: 2412, level: [1, 9], agencies: ["BFV", "WCA", "NSBD", "EHG", "OID"], region: "asia-south", theme: "future",
    summary: "Every monsoon, for a decade, the Beyond has leaked into Mumbai a little further. This year it has not leaked: it has opened. Three ruptures along the Marine Drive sea-wall, a hundred thousand people evacuated, and a joint operation of every agency to close them before the tide turns at dawn. This is a fight.",
    objectives: [
      { id: "po1", kind: "primary", t: "Close the three ruptures before the tide turns", done: "Three ruptures are sealed at the sea-wall by dawn. The Marine Drive is only a road." },
      { id: "po2", kind: "primary", t: "Keep the evacuation corridors open", done: "More than half of the hundred thousand reach the high ground. The rest are counted, and mourned, by name." },
      { id: "so1", kind: "secondary", t: "Secure the rooftop gun line", done: "The Vanguard squad holds the roof of the Eros block, and the lines of sight to all three ruptures.", benefit: { label: "The gun line", text: "+2 to your attacks while you hold the roof.", combat: { attack: 2 } } },
      { id: "so2", kind: "secondary", t: "Find the rupture engine's control room", done: "A flooded sub-basement under Marine Drive, where the city's old sea-wall pumps sit. The ruptures are fed from there.", benefit: { label: "The pumps", text: "You can cut the feed. A bonus on every roll to seal a rupture.", bonus: { tags: ["seal"], value: 3 } } },
      { id: "so3", kind: "secondary", t: "Reach the Mother's seam before she calls the tide", done: "The three ruptures are one: a seam, folded three times. Its centre is in the sea, under the old Queen's Necklace lights.", benefit: { label: "The seam's centre", text: "A bonus on every roll to close the last rupture.", bonus: { tags: ["mother"], value: 2 } } }
    ],
    clues: {
      c_ruptures: { t: "Three ruptures on the sea-wall", s: "Commander Devi", x: "Three ruptures have opened along Marine Drive: at the Oval, at Charni Road and at Girgaum. Each is a tear in the air the size of a lorry, bleeding salt-water and screaming. The tide turns at 05:40." },
      c_corridors: { t: "Four evacuation corridors", s: "The evacuation map", x: "A hundred thousand people are being moved up the four corridors to Malabar Hill. Each corridor passes within two hundred metres of a rupture, and each can be cut by what comes out of one." },
      c_engine: { t: "The pumps feed them", s: "Ashok", x: "The old sea-wall pumps in the sub-basement of Marine Drive are pumping something other than sea water. Each rupture is fed from its own pump-line. Cut the feed, and the rupture cannot grow." },
      c_seam: { t: "One seam, folded three times", s: "Dr. Menon", x: "The three ruptures are one: a single seam, folded three times. If it is closed at its centre, which lies in the sea, under the old Queen's Necklace lights, all three go. If one is closed alone, the others grow." },
      c_mother: { t: "She is calling the tide", s: "The ruptures", x: "Something is at the seam's centre, under the water, singing. It calls the tide. When the tide turns at 05:40, the seam opens fully." },
      c_squad: { t: "A Vanguard squad, in place", s: "Commander Devi", x: "A Vanguard squad of twelve is dug in on the roof of the Eros block, with a line of fire on all three ruptures. They need a team to push out and hold the corridors." },
      c_civ: { t: "Thousands still in the Oval", s: "The evacuation map", x: "The Oval maidan is the biggest holding point: eleven thousand people waiting for the second wave of transports. It is two hundred metres from the first rupture." }
    },
    npcs: {
      devi: N("Commander Priya Devi", "Black Fang Vanguard, Mumbai", "Forties, in a matte-grey Vanguard field jacket with a commander's stripe, a tablet strapped to her forearm, and the steady voice of a woman who has not slept since Tuesday.", F(2, 5, "bun", 7, "none", { sex: "f" })),
      ashok: N("Ashok Kulkarni", "City engineer, sea-wall pumps", "Fifties, in a wet orange hi-vis vest and a hard hat with a head-torch, a hand-drawn schematic in a plastic sleeve, and a very Mumbai patience.", F(2, 5, "short", 3, "hat", { sex: "m" })),
      menon: N("Dr. Anjali Menon", "Rupture physicist", "Thirties, in a scuffed rain-shell over a lab coat, a handheld spectrometer, and the focussed excitement of someone who has seen a thing no one will believe.", F(2, 4, "ponytail", 3, "none", { sex: "f" })),
      jai: N("Jai", "Vanguard squad sergeant", "Late twenties, in light body-armour with a Vanguard patch, a rifle with a hooked glowing barrel, a streak of mud on his jaw, and a very cheerful grin.", F(2, 5, "short", 6, "none", { sex: "m" }))
    },
    companions: {
      jai: { npc: "jai", attack: 4, build: { difficulty: "medium", mods: ["Ranged"], bonus: { health: 5 } }, nothing: "Heads down. Fire when I say.",
        hints: [{ text: "Three ruptures, one seam. If you close one on its own, the others will grow. Close the feed first.", if: { clue: "c_seam" } }, { text: "The Oval is the one that matters. Eleven thousand people. We hold it, or nothing else counts.", if: { clue: "c_civ" } }] }
    },
    enemies: {
      spawn: { build: { name: "Rupture spawn", type: "Swarm", difficulty: "easy", sprite: "construct", hue: 190, dtype: "health", mods: ["Swarm"], core: { body: 1, mind: 1, spirit: 1 }, bonus: { health: -10, sanity: -5, stability: -5 }, dies: "pops into salt-water and a smell of ozone" } },
      brute: { build: { name: "Tidal brute", type: "Beyond", difficulty: "medium", sprite: "beast", hue: 200, dtype: "health", core: { body: 4, mind: 1, spirit: 1 }, mods: ["Tanky"], dies: "slumps, spilling a hundred litres of sea-water on the road" } },
      mother: { build: { name: "The Seam Mother", type: "Beyond", difficulty: "dangerous", sprite: "beyond", hue: 210, dtype: "sanity", range: 1, core: { body: 3, mind: 3, spirit: 4 }, mods: ["Occult", "Tanky"],
        text: "The thing at the centre of the seam. Call the Tide: each round she folds one agent into the seam (Willpower Medium, or lose the next action and 4 Sanity), and a new Rupture spawn arrives. She cannot be harmed while the three feeds are open: cut them, and she can be. Only Sanity harms her.", dies: "the seam closes, in three long folds, like a hand shutting, and the sea falls back" } }
    },
    encounters: {
      oval: { name: "The Oval maidan, the first rupture", theme: "future", fightText: "A tear in the air hangs over the Oval maidan, the size of a lorry, bleeding salt-water and screaming. Eleven thousand people are on the grass beyond, and what is coming out of the tear has seen them.", zones: [{ id: "a", name: "The transport lane", col: 0, row: 0 }, { id: "b", name: "The maidan", col: 1, row: 0 }, { id: "c", name: "The rupture", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "brute", zone: "c" }, { t: "spawn", zone: "b" }, { t: "spawn", zone: "b", name: "Rupture spawn (2)" }, { t: "spawn", zone: "b", name: "Rupture spawn (3)" }],
        civilians: { b: 6 }, fleeAt: { t: "spawn", n: 1, text: "The last of the spawn recoil into the rupture." } },
      charni: { name: "Charni Road, the second rupture", theme: "future", fightText: "Charni Road is a long narrow street of old arcades and new transport lanes. At its sea end, a second tear opens, and a wall of salt-water walks up the road on a hundred legs.", zones: [{ id: "a", name: "The arcades", col: 0, row: 0 }, { id: "b", name: "The road", col: 1, row: 0 }, { id: "c", name: "The rupture", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "brute", zone: "c" }, { t: "brute", zone: "b", name: "Tidal brute (2)" }, { t: "spawn", zone: "b" }, { t: "spawn", zone: "b", name: "Rupture spawn (2)" }] },
      seam: { name: "The seam, under the Queen's Necklace", theme: "sea", lit: false, fightText: "The sea at the end of Marine Drive is black and very still. In the middle of the bay a fold of nothing opens, three times, like a hand, and at its centre something very large is singing, and the tide has begun to turn.", zones: [{ id: "a", name: "The sea-wall", col: 0, row: 0 }, { id: "b", name: "The shallows", col: 1, row: 0 }, { id: "c", name: "The seam", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "mother", zone: "c" }, { t: "spawn", zone: "b" }, { t: "spawn", zone: "b", name: "Rupture spawn (2)" }, { t: "brute", zone: "b" }] }
    },
    start: "hq",
    scenes: {
      hq: { name: "The Vanguard field command, Marine Drive", theme: "future", mood: "tense", lighting: "dark", weather: "rain", cast: ["devi", "jai"],
        onEnter: [{ once: "in", steps: [
          { say: "Mumbai, 03:12, in the monsoon of 2412. The Marine Drive is a long curve of sea-wall under an orange sky, and along it, a hundred metres apart, three tears in the air bleed salt-water on to the road. A hundred thousand people are in the evacuation corridors. Every agency that could be called is here." },
          { talk: { npc: "devi", text: "I do not have time for introductions. Three ruptures. The tide turns at 05:40. I have a squad of twelve on the Eros roof, and an evacuation that will not hold. Tell me what you can do." } }] }],
        options: [
          K.ask("devi", [
            K.t("What do we have?", ["Three ruptures: the Oval, Charni Road, Girgaum. Each is the size of a lorry. Each is bleeding salt-water and things. A hundred thousand people in four corridors up to Malabar Hill. The tide turns at 05:40."], { free: true, clue: "c_ruptures" }),
            K.t("What are the corridors?", "Four. Each passes within two hundred metres of a rupture. If one is cut, I lose the evacuation behind it. The Oval holds eleven thousand, waiting for the second wave of transports.", { clue: ["c_corridors", "c_civ"], free: true }),
            K.t("Who is on the roof?", "A squad of twelve, dug in on the Eros block, with a line of fire to all three. Sergeant Jai. They need a team to push out and hold the corridors.", { clue: "c_squad", free: true, set: "squad_known" }),
            K.t("Will you lend us Jai?", [{ say: "She looks at the sergeant, who grins." }, "He goes where you go. He doesn't do anything he isn't ordered to, and he doesn't need to be ordered."], { cha: 7, set: "jai_ok" })
          ], { label: "Talk to Commander Devi", name: "Commander Devi", bye: ["Go. Quickly."] }),
          { label: "Take Sergeant Jai with you", hint: "A Vanguard squad leader who goes where you go", once: true, if: "jai_ok", steps: [{ say: "Jai shoulders the rifle, checks the sling, and says, cheerfully, that he has always wanted to see a rupture from the front." }, { join: "jai" }] },
          K.find("Read the evacuation map", "iq", "easy", "A map of the four corridors in four colours, each with a rupture marker and a transport count. The Oval is highlighted in red: eleven thousand waiting, one rupture two hundred metres away, and the second wave of transports forty minutes out.", "A great many coloured lines.", { clue: ["c_corridors", "c_civ"], hint: "Easy" }),
          K.go("To the Eros roof", "roof", { if: "squad_known" }),
          K.go("Down to the sea-wall pump house", "pumps"),
          K.go("To the physicist, Dr. Menon", "menon"),
          K.go("To the Oval maidan", "oval", { if: { clue: "c_civ" } })] },
      roof: { name: "The Eros block roof", theme: "future", mood: "tense", lighting: "dark", weather: "rain", cast: ["jai"],
        onEnter: [{ once: "in", steps: [{ say: "A flat roof in the rain, a firing line of twelve Vanguard in light body-armour behind sandbag-sized blocks of ablative foam, and a wide view along the sea-wall: three tears in the air, three lines of tracer." }] }],
        options: [
          { label: "Secure the rooftop gun line", hint: "A fight, in the rain", if: { not: "roof_held" }, steps: [{ check: { aspect: "agility", cr: "medium", label: "Get the squad in position before the first wave arrives", who: "choose", tags: ["mother"],
            ok: [{ say: "You get the squad in position, and hold the roof. For the next hour, anything that crosses the Marine Drive is in the lines of fire of twelve rifles with hooked barrels." }, { set: "roof_held" }, { objective: "so1" }],
            fail: [{ say: "The squad is half-ready when the first spawn arrive. You hold, but it costs." }, { damage: { pool: "health", amount: 3 } }, { set: "roof_held" }, { objective: "so1" }] } }] },
          K.find("Mark the rupture feed lines from the roof", "awareness", "medium", "From the roof, in the thermal overlay, you can see them: three thin warm lines running from the sea-wall into the ground, one under each rupture, all leading back toward a single point under Marine Drive.", "Rain on the visor, and too much to see.", { clue: "c_engine", hint: "Awareness, Medium", failClue: "c_engine" }),
          K.go("Back to command", "hq")] },
      pumps: { name: "The sea-wall pump house", theme: "cave", mood: "dread", lighting: "dark", weather: "none", cast: ["ashok"],
        onEnter: [{ once: "in", steps: [{ say: "A flooded concrete sub-basement under Marine Drive, thigh-deep in water, pipes and valve wheels overhead, a bank of old sea-wall pumps thumping slowly, and a man in a wet orange hi-vis with a head-torch and a hand-drawn schematic." }] }],
        options: [
          K.ask("ashok", [
            K.t("What are the pumps pumping?", ["Not sea-water. I have worked these pumps for thirty years. They are pumping something into each of the three rupture lines. Three pump-lines, three ruptures. It's not in my schematic."], { free: true, clue: "c_engine", obj: "so2" }),
            K.t("Can you cut them?", "From here, one at a time, by hand. Each line has a valve wheel and a lock. If you cut one, the rupture on it will stop growing. If you cut all three, the Mother has nothing to feed on.", { free: true, set: "feed_known" }),
            K.t("Who is the Mother?", [{ say: "He looks at the black water." }, "The old men of the pump house have a story. A thing that lives in the bay, under the Queen's Necklace. It sings when the tide is about to turn. It has been singing for a week."], { cha: 7, clue: "c_mother" })
          ], { label: "Talk to Ashok", name: "Ashok", bye: ["Mind the valves. They bite."] }),
          K.find("Cut the first feed line", "strength", "medium", "A wheel the size of a table, rusted to the stem. You throw your weight on it, and it gives, and a roar of white water goes down the pipe. In the dark, the pump on that line thumps once, and stops. Overhead, a long way off, the first rupture screams.", "The wheel will not turn.", { set: "feed1", hint: "Strength, Medium", tags: ["seal"] }),
          K.find("Cut the second feed line", "strength", "medium", "The second wheel turns more easily. Water thunders, the pump stutters, and on the far side of the sea-wall, you hear the second rupture scream.", "The wheel will not turn.", { set: "feed2", hint: "Strength, Medium", tags: ["seal"] }),
          K.find("Cut the third feed line", "strength", "medium", "The third wheel is the oldest and the stiffest. When it goes, it takes the skin off your palms. The last pump coughs, and goes quiet, and the whole sub-basement is silent but for the dripping.", "The wheel will not turn.", { set: "feed3", hint: "Strength, Medium", tags: ["seal"] }),
          K.go("Back to command", "hq")] },
      menon: { name: "The physicist's tent", theme: "future", mood: "calm", lighting: "bright", weather: "rain", cast: ["menon"],
        onEnter: [{ once: "in", steps: [{ say: "A pop-up lab under a tarpaulin, a rack of spectrometers, a screen of folded graphs and a rain-slicked young woman holding a handheld probe like a divining rod." }] }],
        options: [
          K.ask("menon", [
            K.t("What are we looking at?", ["One seam. Three folds. The three ruptures are the same rupture, folded three times along the sea-wall. If you close one, the others grow. If you close the centre, they all go."], { free: true, clue: "c_seam" }),
            K.t("Where is the centre?", "In the sea, under the old Queen's Necklace lights. Four hundred metres out. Something is singing there. When the tide turns at 05:40 it opens fully. A fast boat from the end of the sea-wall will reach it.", { clue: "c_mother", free: true, obj: "so3", set: "boat_known" }),
            K.t("How do we reach it?", [{ say: "She taps the screen." }, "A boat, from the end of the sea-wall. Fast. With the feeds cut, so it cannot call. If you reach it before 05:40, you can close it. After that, I do not know."], { cha: 8, set: "boat_known" })
          ], { label: "Talk to Dr. Menon", name: "Dr. Menon", bye: ["Don't close just one."] }),
          K.find("Check the seam's spectrum", "iq", "medium", "On the spectrometer, three bright spikes, one under each rupture. Between them, a faint continuous line: a single seam, running from the Oval to Girgaum, in a fold. At its middle, a deeper pulse, once every four seconds, like something breathing.", "Spikes and noise.", { clue: "c_seam", hint: "Intelligence, Medium", failClue: "c_seam" }),
          K.go("Back to command", "hq")] },
      oval: { name: "The Oval maidan", theme: "future", mood: "boss", lighting: "dark", weather: "rain",
        onEnter: [{ once: "in", steps: [{ say: "The Oval maidan: a great green open field, eleven thousand people sitting on it in lines under rain-capes, patient, scared, waiting. Two hundred metres off, a tear in the air hangs over the road and bleeds sea-water. Something steps out of it, on a hundred legs." }] }],
        options: [
          { label: "Hold the Oval, and close the first rupture", hint: "A fight, with civilians in the open", if: { not: "oval_clear" }, steps: [{ combat: "oval", win: [{ set: "oval_clear" }, { say: "The tide of spawn recoils into the rupture. You close it with a hand-held seal. The eleven thousand cheer, raggedly, in the rain." }] }] },
          { label: "Move on to Charni Road", hint: "The second rupture", if: { all: ["oval_clear", { not: "charni_clear" }] }, steps: [{ combat: "charni", win: [{ set: "charni_clear" }, { say: "Charni Road is only a road. The second rupture folds shut behind the last of the brutes." }] }] },
          { label: "Go out to the seam, by boat", hint: "Needs the physicist, and the boat", if: { all: ["oval_clear", "charni_clear", "boat_known"] }, steps: [{ goto: "bay" }] },
          { label: "Back to command", steps: [{ goto: "hq" }] }] },
      bay: { name: "The bay, under the Queen's Necklace", theme: "sea", mood: "boss", lighting: "dark", weather: "night",
        onEnter: [{ once: "in", steps: [{ say: "The sea at the end of Marine Drive, black and very still, under the long curve of the old street-lights. Four hundred metres out, in the middle of the bay, a fold of nothing opens three times, like a hand. At its centre something very large is singing." }] }],
        options: [
          { label: "Close the seam at its centre, with the feeds cut", hint: "Needs all three feeds cut", if: { all: ["feed1", "feed2", "feed3"] }, steps: [{ check: { aspect: "willpower", cr: "challenging", label: "Reach the centre and close it, with the Mother unable to call the tide", who: "choose", tags: ["seal", "mother"],
            ok: [{ say: "With the feeds cut, the Mother has nothing to sing with. You reach the centre in a fast boat, in the black bay, and you close the seam with a hand-held seal in three long folds. The song stops. The tide, at 05:40, turns, and nothing comes with it." }, { set: "res_seal" }, { objective: "po1" }, { goto: "end" }],
            fail: [{ say: "The song gets into you." }, { damage: { pool: "sanity", amount: 4 } }] } }] },
          { label: "Face the Seam Mother", steps: [{ set: "res_fight" }, { combat: "seam", win: [{ say: "The seam closes, in three long folds, like a hand shutting, and the sea falls back. At 05:40, the tide turns, and nothing comes with it." }, { objective: "po1" }, { goto: "end" }] }] }] },
      end: { name: "Marine Drive, at dawn", theme: "future", mood: "calm", lighting: "bright", weather: "none",
        onEnter: [{ once: "in", steps: [
          { say: "The dawn comes up over a very ordinary Marine Drive, wet and gold, and almost empty. The tide has turned. The sea is only sea." },
          { if: { ge: ["civSaved", 4] }, then: [{ objective: "po2" }, { say: "More than half of the people on the Oval reached the high ground." }], else: [{ say: "Too many were lost on the Oval. Their names are read out at the memorial, one by one, until the tide comes in." }] },
          { if: { flag: "res_seal" }, then: [{ say: "You cut the three feeds and closed the seam at its centre. Mumbai's sea-wall pumps pump sea-water again, and Ashok Kulkarni sits on a valve wheel and weeps for an hour." }] },
          { if: { flag: "res_fight" }, then: [{ say: "You fought the Mother in the bay and broke her. The seam is a scar of salt on the sea." }] },
          { if: { obj: "so1" }, then: [{ say: "The Vanguard squad on the Eros roof lost one rifle and no one." }], else: [{ say: "The Vanguard squad on the Eros roof was overrun for twenty minutes. Their names are read out at the memorial." }] },
          { if: { obj: "so2" }, then: [{ say: "The sea-wall pumps are rebuilt, and fitted with a lock that is checked every morning." }] },
          { say: "Commander Devi sits on the sea-wall, with a mug of chai, in the first sun she has seen in three days, and does not say anything at all." },
          { end: "win" }] }], options: [] }
    }
  });
})();
