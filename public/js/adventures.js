/* ============================================================================
   ADVENTURE LIBRARY — new cases written in the data format from adv.js.
   Death of a Bloodline (content.js) is the original hand-scripted module.
   Add your own with ADV.register({...}) or build one in the GM toolkit.
   ========================================================================== */
(function () {
  const A = window.ART, ADV = window.ADV;
  /* quick faces: F(skinIdx, hairColorIdx, hairStyle, outfitIdx, extra) */
  const F = (s, hc, h, o, x = "none", bg = "#2b2f3a") => ({ skin: A.SKIN[s], hairC: A.HAIRC[hc], hair: h, outfit: A.OUTFIT[o], extra: x, bg });
  const N = (name, tag, look, face) => ({ name, tag, look, face });
  const win = [{ end: "win" }];

  /* ---------------------------------------------------------------- 1999 · any */
  ADV.register({
    id: "dial-up", title: "Dial-Up", setting: "Rotterdam, Netherlands · 1999", year: 1999, level: [2, 5], agencies: ["WCA", "NSBD", "EHG", "OID"],
    summary: "A bulletin board with no host answers on a phone number that doesn't exist. Eleven users have logged in. Their bodies are in their bedrooms, and none of them are waking up.",
    objectives: [
      { id: "po1", kind: "primary", t: "Trace the phone number", done: "It is routed through an exchange that was decommissioned in 1971." },
      { id: "po2", kind: "primary", t: "Sever the line and free the logged-in", done: "Eleven users wake with a gasp, their screens black." },
      { id: "so1", kind: "secondary", t: "Read the Sysop's last message", done: "'Do not answer it twice.' It was signed by someone who answered twice." }],
    clues: {
      c_bbs: { t: "Threshold BBS", s: "Priya", x: "Nobody runs it. Callers get a greeting that uses their name, and sometimes a name they haven't used since childhood." },
      c_exchange: { t: "An exchange that doesn't exist", s: "Telephone exchange", x: "The number routes to Exchange 31, closed in 1971. There is still a line connected." },
      c_sysop: { t: "The Sysop's last message", s: "Dead user's terminal", x: "'It remembers everyone who calls. It wants to remember everyone. Do not answer it twice.'" }
    },
    npcs: {
      priya: N("Priya Das", "ISP technician", "Thin, wired on coffee, a lanyard full of keys and a laptop held like a shield.", F(2, 0, "long", 0, "glasses")),
      lazarus: N("Lazarus", "Sysop (deceased)", "Only a green cursor. It blinks to the rhythm of a heartbeat.", F(4, 0, "bald", 5, "none", "#0a1a14"))
    },
    enemies: {
      static: { build: { name: "Static Wraith", type: "Spirit", difficulty: "easy", sprite: "spirit", hue: 150, dtype: "sanity", range: 1 } },
      operator: { build: { name: "The Operator", type: "Beyond", difficulty: "challenging", sprite: "beyond", hue: 160, dtype: "sanity", range: 1, core: { body: 0, mind: 3, spirit: 2 }, mods: ["Mimic"] }, modText: { "Mimic": "Speaks with the voices of those it has taken." } }
    },
    encounters: {
      exchange: { name: "Exchange 31", theme: "lab", lit: true, fightText: "The racks hum. A dozen handsets lift all at once.", zones: [
        { id: "a", name: "Cable door", col: 0, row: 0 }, { id: "b", name: "Switching racks", col: 1, row: 0 }, { id: "c", name: "The patch panel", col: 2, row: 0 }], edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "operator", zone: "c" }, { t: "static", zone: "b" }, { t: "static", zone: "b" }] }
    },
    start: "office",
    scenes: {
      office: { name: "Priya's ISP office", theme: "lab", mood: "calm", cast: ["priya"], onEnter: [{ once: "a", steps: [
        { say: "Rotterdam, December 1999. Everyone is talking about the Millennium Bug. Rain on the harbour cranes, Christmas lights on the Witte de Withstraat, and above a kebab shop a cramped ISP office where cables run across the ceiling like vines and three modems screech at once." },
        { say: "Priya Das has pinned eleven names to the wall, each with a printout and a polaroid of a sleeping face. She's on her fourth coffee and her hands shake when she isn't typing." }] }],
        options: [
          { label: "Talk to Priya", hint: "ISP technician", steps: [{ converse: { npc: "priya", id: "main",
            open: ["Finally. My manager thinks I'm having a breakdown. My manager might be right. Sit anywhere that isn't a cable."],
            topics: [
              { ask: "What's Threshold?", lines: ["A bulletin board. Dial-up, old school, green text on black. It's not on any list. There's no sysop. The number's not even in our routing tables.", "When you connect, it says hello. By name. Not your handle: your real name. Sometimes a name you haven't used since you were a kid. It said hello to me as <i>Pree-Pree</i>. That's what my grandmother called me."], then: [{ clue: "c_bbs" }] },
              { ask: "What happened to the eleven?", lines: ["They all dialled it the same night, December 3rd, between midnight and two. All my customers. I checked the logs.", { say: "She points at the polaroids." }, "Next morning their families find them asleep at their desks. Not dead. Asleep. Breathing, pulse, everything. They just don't wake up.", "And their screens are all showing the same thing: a blinking green cursor. Waiting for them to type."] },
              { ask: "Did you call it yourself?", lines: ["Once. Before I knew. It said hello, Pree-Pree, and asked how my grandmother was. She died in 1987.", "I pulled the phone cable out of the wall with my bare hands. My modem still lights up at three in the morning, all by itself. I've unplugged it. It still lights up."] },
              { ask: "Who was the sysop?", lines: ["There's a handle in the old logs: <i>LAZARUS</i>. Ran a board on the same number back in '94, '95. Then nothing.", "Hendrik Vos. Found dead at his keyboard in 1996. Heart failure. He was twenty-six."] }],
            bye: ["Whatever you do, don't connect to it twice. I don't know why I know that. I just do."] } }] },
          { label: "Examine one victim's terminal", once: true, steps: [{ check: { aspect: "iq", cr: "medium", label: "Dig through the logs", investigate: true, ok: [{ say: "A final message from the board's own sysop, scrolling on a dead man's screen." }, { clue: "c_sysop" }, { objective: "so1" }], fail: [{ say: "Garbled characters, then a long grey nothing." }] } }] },
          { label: "Trace the number", once: true, steps: [{ check: { aspect: "iq", cr: "challenging", label: "Trace the line", investigate: true, ok: [{ say: "The call is routed through Exchange 31, closed in 1971. And still switched on." }, { clue: "c_exchange" }, { objective: "po1" }], fail: [{ say: "The trace folds back on itself, and your own phone number appears in the logs." }, { damage: { pool: "sanity", amount: 2 } }, { say: "Then your phone rings. The caller ID reads EXCHANGE 31, a building closed in 1971. It keeps ringing until you write the address down." }, { clue: "c_exchange" }, { objective: "po1" }] } }] },
          { label: "Go to Exchange 31", if: { clue: "c_exchange" }, steps: [{ goto: "exchange" }] }] },
      exchange: { name: "Telephone Exchange 31", theme: "lab", mood: "weird", lighting: "normal",
        onEnter: [{ once: "ex", steps: [
          { say: "Exchange 31 is a squat brick building on a dead-end street in Delfshaven, windows bricked up, a KPN sign rusted to illegibility. The door opens when you touch it." },
          { say: "Inside, the old switching hall: rack after rack of electromechanical relays in the dark, chattering like a thousand cicadas, though the building has had no power since 1971. Every handset on every test bench has been lifted off its hook and laid on its side, and from each one a thin voice is talking." },
          { say: "You know some of the voices. They're the eleven. They're saying hello to each other, over and over, in green-text cadence: <i>hello. hello. are you there. hello.</i>" }] }],
        options: [
          { label: "Pull the main trunk cable", steps: [{ combat: "exchange", win: [{ say: "The trunk comes loose in a spray of sparks. Across the city, eleven monitors go dark, and eleven people sit up in bed, gasping." }, { objective: "po2" }, { end: "win" }] }] },
          { label: "Back to Priya's office", steps: [{ goto: "office" }] }] }
    }
  });

  /* ---------------------------------------------------------------- 2024 · BFV (and others) */
  ADV.register({
    id: "signal-drift", title: "Signal Drift", setting: "Yunnan Province, China · 2024", year: 2024, level: [3, 6], agencies: ["BFV", "WCA", "NSBD", "EHG", "OID"],
    summary: "A survey drone loses its signal over a valley and sends back footage of a village that is on no map. The drone's last frame shows its own operator, looking up from the street.",
    objectives: [
      { id: "po1", kind: "primary", t: "Find the village that is on no map", done: "Lüshui, a terraced hamlet outside time." },
      { id: "po2", kind: "primary", t: "Break the loop and bring the survivors out", done: "The Mirror Mother shatters; the day finally ends." },
      { id: "so1", kind: "secondary", t: "Recover the drone's black box", done: "It records the operator, Lin, walking in. He is now trapped in the loop." }],
    clues: {
      c_footage: { t: "Footage of a village not on any map", s: "Drone log", x: "A terraced village at dusk. Same 41 seconds of footage, repeated nine times. In frame 9 a face is looking up at the drone, in the street." },
      c_loop: { t: "The same day", s: "Auntie Mei", x: "'Today is the day the rice is drying,' she says, again. She says it every time you walk past. By the third time her words are identical down to the cough." },
      c_mirror: { t: "A shrine of mirrors", s: "Village shrine", x: "Every house keeps a small round mirror above the door. At dusk they all turn, one by one, to face the shrine on the hill." }
    },
    npcs: {
      lin: N("Lin Wei", "BFV drone pilot", "Mid-twenties, calm voice, hands that won't stop moving over his controller.", F(1, 0, "short", 0, "glasses", "#10202b")),
      mei: N("Auntie Mei", "Villager", "A woman in a blue apron, smiling fixedly. She says the same sentence every time you ask.", F(2, 4, "bun", 2))
    },
    enemies: {
      wolf: { build: { name: "Rabid Wolf", type: "Feral", difficulty: "medium", sprite: "beast", hue: 30, hitSfx: "blade_hit", dies: "falls, snarling" } },
      villager: { build: { name: "Looping Villager", type: "Human", difficulty: "easy", sprite: "humanoid", hue: 200, hitSfx: "blade_hit", dies: "stills, mid-sentence" } },
      mother: { build: { name: "The Mirror Mother", type: "Folklore", difficulty: "challenging", sprite: "spirit", hue: 330, dtype: "sanity", range: 1, variable: "sanity", core: { body: 0, mind: 2, spirit: 3 }, mods: ["Mimic"] }, modText: { "Mimic": "Copies the face of the last agent who wounded her." } }
    },
    encounters: {
      road: { name: "The terrace road", theme: "forest", fightText: "Eyes in the bamboo. The wolves are thin, and wrong, and moving too well.", zones: [
        { id: "a", name: "Track", col: 0, row: 0 }, { id: "b", name: "Bamboo", col: 1, row: 0 }, { id: "c", name: "Ditch", col: 2, row: 0 }], edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "wolf", zone: "b" }, { t: "wolf", zone: "c" }] },
      shrine: { name: "The shrine of mirrors", theme: "church", fightText: "Every mirror in the village turns toward you. The Mother steps out of the biggest.", zones: [
        { id: "a", name: "Steps", col: 0, row: 0 }, { id: "b", name: "Courtyard", col: 1, row: 0 }, { id: "c", name: "The great mirror", col: 2, row: 0 }], edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "mother", zone: "c" }, { t: "villager", zone: "b" }, { t: "villager", zone: "b" }] }
    },
    start: "camp",
    scenes: {
      camp: { name: "BFV forward camp", theme: "forest", mood: "calm", cast: ["lin"], onEnter: [{ once: "a", steps: [
        { say: "Yunnan, 2024. Mist in the valleys, terraced hills folding away into blue distance, the whine of the generator. The Black Fang Vanguard's forward camp is a tent, a solar panel and a laptop on an ammunition crate." },
        { say: "Lin Wei, the drone pilot, has frozen the last frame of the footage on screen: a terraced village at dusk, lanterns lit, and in the middle of the street a figure looking straight up at the lens." },
        { say: "The figure is Lin." }] }],
        options: [
          { label: "Talk to Lin", hint: "BFV drone pilot", steps: [{ converse: { npc: "lin", id: "main",
            open: [{ say: "His hands won't stop moving over the controller in his lap, though the drone has been lost for six hours." }, "That's me. You can see it's me. I haven't been there."],
            topics: [
              { ask: "What happened to the drone?", lines: ["Routine survey. Mapping the valley for the dam project. It crossed the second ridge at 14:12 and lost signal.", "Then it started sending footage. The same forty-one seconds, over and over. Nine times. A village on no map, at dusk, though it was two in the afternoon."], then: [{ clue: "c_footage" }] },
              { ask: "How can you be in the footage?", lines: ["I can't. I've been right here on this crate since lunch, drinking tea. Ask anyone.", { say: "He scrolls back through the frames with a shaking finger." }, "In loop one, the street's empty. Loop five, there's someone at the end of the street. Loop nine, it's me, looking up. Like I've been walking toward the camera for a long time."] },
              { ask: "Do the locals know the place?", lines: ["There's an old woman in the last village who talks about Lüshui. A village that had a good harvest every year, until one year it decided it didn't want the harvest to end.", "She says nobody's seen it since her grandmother's time. She says if you see it, don't go in, and if you go in, don't look in the mirrors."] },
              { ask: "Will you come with us?", lines: [{ say: "He looks at the frozen frame for a long time." }, "No. I think I already went. I think part of me is still walking up that street. I'll stay here and keep the camp lit, in case you need a way back."] }],
            bye: ["Follow the ridge road. And if you see me up there, don't let me talk to you."] } }] },
          { label: "Hike up the terrace road", steps: [{ goto: "road" }] }] },
      road: { name: "The terrace road", theme: "forest", mood: "tense", lighting: "shadow",
        onEnter: [{ once: "r", steps: [{ say: "The map shows nothing. The bamboo thickens as the sun drops. Then the smell of rice smoke, impossible this far from any town." }, { combat: "road", win: [{ say: "The last wolf drops. A faint light shows through the bamboo ahead: terraces, lanterns, the roofs of a village." }, { objective: "po1" }] }] }],
        options: [{ label: "Enter the village", steps: [{ goto: "village" }] }, { label: "Back to camp", steps: [{ goto: "camp" }] }] },
      village: { name: "Lüshui village", theme: "village", mood: "weird", cast: ["mei"], lighting: "shadow",
        onEnter: [{ once: "vi", steps: [
          { say: "Lüshui is lovely. That's the first thing. Wooden houses with curling eaves, paper lanterns lit along the street, rice spread on mats to dry, a dog barking somewhere in a hollow. Smoke and woodsmoke and the smell of supper." },
          { say: "Everyone is smiling. Everyone is in the middle of a chore: sweeping, carrying water, turning rice with a wooden rake. You watch a man lift a bucket, and lift it, and lift it. Above every door hangs a small round mirror in a red frame." },
          { say: "An old woman in a blue apron looks up from her rice and beams at you as if she's been waiting all day." }] }],
        options: [
          { label: "Talk to Auntie Mei", hint: "Smiling, and smiling", steps: [{ converse: { npc: "mei", id: "main",
            open: ["Visitors! On the day the rice is drying. How lucky."],
            topics: [
              { ask: "What day is it today?", lines: ["Today is the day the rice is drying.", { say: "She turns the rice with her rake. Her smile doesn't move." }, "Today is the day the rice is drying.", { say: "She coughs, once, into her hand. Then she says it again, and coughs again, in exactly the same place." }], then: [{ clue: "c_loop" }] },
              { ask: "How long have you lived here?", lines: ["Oh, always. Since this morning. Since the harvest. The harvest was so good this year.", { say: "For one moment her eyes go wide and frightened and very old, as if someone underneath the smile is looking out at you." }, "Please. Please, it's been such a long day."] },
              { ask: "Have you seen a young man with a controller?", lines: ["Lin? Oh, Lin is a good boy. He's walking up the street. He's always walking up the street. Today is the day the rice is drying."] },
              { ask: "What are the mirrors for?", lines: ["For the Mother. So she can see us and keep us. She loves us so much. She doesn't want the day to end.", "Don't look in them too long. She'll love you too."] }],
            bye: ["Today is the day the rice is drying. Come back tomorrow!", { say: "She laughs, and the laugh catches in her throat like a sob." }] } }] },
          { label: "Study the round mirrors above the doors", once: true, steps: [{ check: { aspect: "awareness", cr: "medium", label: "Watch the mirrors", ok: [{ say: "At dusk, every mirror turns on its own, a few degrees at a time, to face the hill." }, { clue: "c_mirror" }], fail: [{ say: "Your own face, looking tired. You stare too long, and when you blink it's dusk, and every mirror in the street has turned to face the hill. So has your reflection. You haven't moved." }, { damage: { pool: "sanity", amount: 3 } }, { clue: "c_mirror" }] } }] },
          { label: "Search the street for the drone", once: true, steps: [{ check: { aspect: "iq", cr: "easy", label: "Find the crashed drone", ok: [{ say: "In a ditch, black and bent: the drone. Its black box is still warm." }, { objective: "so1" }], fail: [{ say: "Nothing but rice and shadows." }] } }] },
          { label: "Climb to the shrine on the hill", if: { clue: "c_mirror" }, steps: [{ combat: "shrine", win: [{ say: "The Mother cracks along every reflection at once. Dawn finally breaks over the terraces, for the first time in years. People in the street stop mid-sentence, and then they weep." }, { objective: "po2" }, { end: "win" }] }] },
          { label: "Return down the road", steps: [{ goto: "road" }] }] }
    }
  });
})();
