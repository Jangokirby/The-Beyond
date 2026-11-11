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
