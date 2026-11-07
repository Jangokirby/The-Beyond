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

  /* ---------------------------------------------------------------- 1187 · OID */
  ADV.register({
    id: "bell-of-saint-remy", title: "The Bell of Saint-Rémy", setting: "Burgundy, France · 1187", year: 1187, level: [1, 3], agencies: ["OID"],
    summary: "Every night at the third watch a new bell tolls over a monastery village, and everyone who hears it rises from bed and walks to the chapel. Only a shepherd girl with wax in her ears is still awake.",
    objectives: [
      { id: "po1", kind: "primary", t: "Learn why the bell tolls", done: "The bell was recast with the drowned novice's reliquary in the metal." },
      { id: "po2", kind: "primary", t: "End the tolling and wake the sleepers", done: "The village wakes at dawn, hoarse and unharmed." },
      { id: "so1", kind: "secondary", t: "Return the novice's bones to the river", done: "The Cantor is given to the water, not to the bell." }],
    clues: {
      c_sleep: { t: "They walk toward the chapel", s: "The village", x: "Every villager stands in a doorway at the third watch, eyes open, facing the abbey. They do not answer." },
      c_wax: { t: "Wax keeps the sound out", s: "Mathilde", x: "Mathilde plugged her ears with candle wax after her mother stopped speaking. Only the bell's note reaches the sleepers." },
      c_recast: { t: "The bell was recast in autumn", s: "Abbot Anselm", x: "The old bell cracked. The abbot paid to recast it, and gave the founder a silver reliquary from the crypt to melt into the alloy." },
      c_novice: { t: "A drowned novice's reliquary", s: "The crypt", x: "Brother Jean, a chorister, drowned in the river fifty years ago. His bones were laid in a silver reliquary and his voice, they say, was the best in Burgundy." }
    },
    npcs: {
      anselm: N("Abbot Anselm", "Abbot of Saint-Rémy", "Gaunt, grey, and awake only by force of will. He has not slept in six nights.", F(0, 4, "bald", 5)),
      mathilde: N("Mathilde", "Shepherd girl · 13", "Barefoot, hair tied in a rag, a plug of wax in each ear. She watches you, not trusting adults.", F(1, 2, "long", 3)),
      odo: N("Brother Odo", "Bell-ringer · sleepwalking", "Hands on the rope. His eyes are open and his mouth moves with a hymn that has no words.", F(1, 1, "short", 5))
    },
    enemies: {
      cantor: { build: { name: "The Drowned Cantor", type: "Spirit", difficulty: "challenging", sprite: "spirit", hue: 200, dtype: "stability", range: 1, core: { body: 0, mind: 1, spirit: 3 }, mods: ["Ethereal", "Quick"] }, modText: { "Ethereal": "Can only be hurt by magic or blessed weapons (the Order's blades count).", "Quick": "Acts early in the round." } },
      sleeper: { build: { name: "Sleepwalker", type: "Human", difficulty: "easy", sprite: "humanoid", hue: 30, attack: 1, hitSfx: "blade_hit", dies: "slumps to the stone, still dreaming" } }
    },
    encounters: {
      tower: { name: "The bell tower", theme: "church", fightText: "The bell tolls on its own. The Cantor sings from the metal.", zones: [
        { id: "a", name: "Stairs", col: 0, row: 0 }, { id: "b", name: "Belfry floor", col: 1, row: 0 }, { id: "c", name: "Under the bell", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "cantor", zone: "c" }, { t: "sleeper", zone: "b", name: "Brother Odo" }] }
    },
    start: "road",
    scenes: {
      road: { name: "The road to Saint-Rémy", theme: "village", mood: "dread", weather: "rain", onEnter: [{ once: "arrive", steps: [
        { say: "Dusk. The Order's letter said little: a monastery village, a new bell, and the entire parish gone strange at night. Your horse will go no further than the last milestone." }] }],
        options: [
          { label: "Walk into the village", steps: [{ goto: "village" }] },
          { label: "Study the abbey tower from the road", once: true, steps: [{ check: { aspect: "awareness", cr: "easy", label: "Watch the tower", ok: [{ say: "No one is in the belfry window, yet the rope moves, steady as breathing." }, { clue: "c_sleep" }], fail: [{ say: "Too much rain, too little light." }] } }] }] },
      village: { name: "Saint-Rémy village", theme: "village", mood: "dread", weather: "rain", cast: ["mathilde"],
        onEnter: [{ once: "vill", steps: [{ say: "Doors stand open. Men, women and children stand inside them, barefoot, facing the abbey. None blink. The village is quiet except for the rain and one small, hostile voice from a hayloft: 'Don't go near them!'" }, { clue: "c_sleep" }] }],
        options: [
          { label: "Talk to Mathilde", steps: [{ talk: { npc: "mathilde", text: "Mother stopped talking when the new bell came. I stuffed my ears with candle wax and it stopped working on me. It sings. At night. You can feel it in your teeth." } }, { clue: "c_wax" }] },
          { label: "Search the sleepers' houses for what changed", once: true, steps: [{ check: { aspect: "iq", cr: "medium", label: "What changed in autumn?", investigate: true, ok: [{ say: "A tithe ledger: the abbey sold the old bell for scrap, and paid a founder named Gerard in coin and a 'relic of no use.'" }, { clue: "c_recast" }], fail: [{ say: "Ledgers, rosaries, sleeping faces. Nothing leaps out." }] } }] },
          { label: "Go up to the abbey", steps: [{ goto: "chapel" }] }] },
      chapel: { name: "Abbey chapel", theme: "church", mood: "weird", cast: ["anselm"], lighting: "shadow",
        onEnter: [{ once: "chap", steps: [{ say: "Rows of villagers kneel in perfect silence. Candles burn low. Abbot Anselm leans on the altar rail, awake and shaking." }] }],
        options: [
          { label: "Question the Abbot", steps: [
            { talk: { npc: "anselm", text: "The old bell cracked at Michaelmas. Gerard the founder said he'd need silver for the tone. I gave him Brother Jean's reliquary from the crypt. God forgive me: it was only bones." } }, { clue: "c_recast" }, { clue: "c_novice" },
            { objective: "po1" }] },
          { label: "Try to wake a sleeper", once: true, steps: [{ check: { aspect: "faith", cr: "medium", label: "Call a soul back", ok: [{ say: "A woman gasps, blinks, and begins to cry. For three breaths she is herself. Then the pull returns, and she kneels again." }], fail: [{ say: "Nothing answers. Something under the floor hums as you try." }, { damage: { pool: "sanity", amount: 2 } }] } }] },
          { label: "Go down to the crypt", steps: [{ goto: "crypt" }] },
          { label: "Climb to the bell tower", steps: [{ goto: "tower" }] }] },
      crypt: { name: "The crypt", theme: "cellar", mood: "dread", lighting: "shadow",
        onEnter: [{ say: "Cold stone, old names. One niche stands open, its silver reliquary gone, the little carved lid left on the floor." }],
        options: [
          { label: "Search the niche", once: true, steps: [{ check: { aspect: "awareness", cr: "medium", label: "Search the empty niche", ok: [{ say: "Wedged behind the stone, a scrap of vellum: the novice's psalter. Wet, though the crypt is dry. The last line is a name and a river, 'La Cure.'" }, { clue: "c_novice" }, { objective: "so1" }], fail: [{ say: "Dust and cold." }] } }] },
          { label: "Back up to the chapel", steps: [{ goto: "chapel" }] }] },
      tower: { name: "The bell tower", theme: "church", mood: "boss", lighting: "shadow", cast: ["odo"],
        onEnter: [{ say: "Brother Odo hauls the rope with blank, unhurried arms. The bell is new, dark, almost wet in the candlelight. It does not make a sound when it swings. The sound is inside your head." }],
        options: [
          { label: "Ring the bell yourself with the old Office of the Dead", if: { clue: "c_novice" }, once: true, steps: [{ check: { aspect: "faith", cr: "challenging", label: "Sing the Office against the Cantor", ok: [{ say: "Your voice is thin against the bell's note, but it is a human voice, and the Cantor, a chorister, turns toward it. For a moment he is only listening." }, { set: "cantor_calmed" }], fail: [{ say: "The bell wins. Your voice stumbles out of your mouth and into the stone." }, { damage: { pool: "stability", amount: 3 } }] } }] },
          { label: "Seize the rope and silence Odo", steps: [{ combat: "tower", surpriseIf: "cantor_calmed", win: [
            { say: "The bell stops. The tower is silent for the first time in weeks. Below, in the village, a child begins to cry." }, { objective: "po2" },
            { if: { obj: "so1" }, then: [{ say: "You carry the vellum to the river at dawn and read the name aloud. The water takes it." }], else: [{ say: "At dawn the village wakes. In the river, a voice finishes its hymn." }] }, { end: "win" }] }] },
          { label: "Back down to the chapel", steps: [{ goto: "chapel" }] }] }
    }
  });

  /* ---------------------------------------------------------------- 1888 · WCA / OID */
  ADV.register({
    id: "hour-of-the-fog", title: "The Hour of the Fog", setting: "London, Wapping · 1888", year: 1888, level: [1, 3], agencies: ["WCA", "OID"],
    summary: "A yellow fog rolls off the Thames each dawn, and the people it passes come home as someone else, or do not come home at all. Scotland Yard has begun to cooperate with a very quiet association.",
    objectives: [
      { id: "po1", kind: "primary", t: "Find where the fog comes from", done: "The Wapping Gas Works: a cistern that should be empty." },
      { id: "po2", kind: "primary", t: "End the Fog Mother", done: "The fog thins at dawn and does not return." },
      { id: "so1", kind: "secondary", t: "Reunite Mrs. Pell with her husband's grave", done: "The thing at her table is laid to rest." }],
    clues: {
      c_faces: { t: "The fog takes shapes from the dead", s: "Inspector Crewe", x: "Eleven residents are found standing in the street at dawn, blank, wearing the face of someone they lost." },
      c_gas: { t: "A gas works that burns nothing", s: "Tam the lamplighter", x: "The Wapping lamps burn lower every night. The gas is being drawn off somewhere. Down toward the river." },
      c_pell: { t: "The husband at the table", s: "Mrs. Pell", x: "Her husband drowned in March. Four nights ago he sat down for supper. He eats nothing. He grows more solid every night." },
      c_light: { t: "Fog fears a steady flame", s: "Tam the lamplighter", x: "Lamps in the lower quarter burn bluer where the fog won't come. A lamplighter's flame, trimmed true, holds it back." }
    },
    npcs: {
      crewe: N("Inspector Crewe", "Scotland Yard", "A stout Scot in a damp bowler hat, who has stopped pretending not to be afraid.", F(0, 3, "short", 5, "beard")),
      tam: N("Tam Rudd", "Lamplighter", "Wiry, soot-faced, with a long brass pole slung over one shoulder like a pilgrim's staff.", F(0, 1, "short", 3, "hat")),
      pell: N("Mrs. Pell", "Widow", "Black dress, red hands, a teacup she has not drunk from.", F(0, 4, "bun", 5))
    },
    enemies: {
      wisp: { build: { name: "Fog Wisp", type: "Spirit", difficulty: "easy", sprite: "spirit", hue: 55, dtype: "sanity", range: 1 } },
      mother: { build: { name: "The Fog Mother", type: "Folklore", difficulty: "challenging", sprite: "spirit", hue: 70, dtype: "sanity", range: 1, variable: "sanity", core: { body: 0, mind: 2, spirit: 3 }, mods: ["Elusive"] }, modText: { "Elusive": "Hard to pin down: attackers take a -1 penalty." } }
    },
    encounters: {
      street: { name: "Wapping Old Stairs", theme: "fog", fightText: "The fog folds into shapes at the edge of the lamplight.", zones: [
        { id: "a", name: "Gaslight", col: 0, row: 0 }, { id: "b", name: "Stair landing", col: 1, row: 0 }, { id: "c", name: "River edge", col: 2, row: 0 }], edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "wisp", zone: "b" }, { t: "wisp", zone: "c" }] },
      cistern: { name: "The gas cistern", theme: "cave", lit: false, fightText: "The fog rises from the dark water in the shape of a woman.", zones: [
        { id: "a", name: "Iron gantry", col: 0, row: 0 }, { id: "b", name: "Valve wheel", col: 1, row: 0 }, { id: "c", name: "The water", col: 1, row: 1 }], edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "mother", zone: "c" }, { t: "wisp", zone: "b" }] }
    },
    start: "yard",
    scenes: {
      yard: { name: "Wapping High Street", theme: "fog", mood: "calm", weather: "rain", cast: ["crewe"], onEnter: [{ once: "a", steps: [
        { say: "Half past four in the morning, and you can barely see the other side of the street. Inspector Crewe waits under a lamp that burns dim and blue." },
        { talk: { npc: "crewe", text: "It comes off the river at four. By dawn there's a dozen of 'em stood in the street wearing the faces of their dead. I don't know what it is, but I know it wants something. And I know a man called Tam knows more than he's telling." } }, { clue: "c_faces" }] }],
        options: [
          { label: "Find Tam the lamplighter", steps: [{ goto: "lamps" }] },
          { label: "Visit Mrs. Pell", steps: [{ goto: "pell" }] },
          { label: "Walk down to Wapping Old Stairs", steps: [{ goto: "stairs" }] }] },
      lamps: { name: "Lamplighters' yard", theme: "street", mood: "calm", cast: ["tam"], lighting: "shadow",
        onEnter: [{ say: "Tam is trimming a lamp wick with a tiny pair of silver scissors as if nothing in the world could be more important. Possibly nothing can." }],
        options: [
          { label: "Ask about the gas", steps: [{ talk: { npc: "tam", text: "The mains in the lower quarter are drawn down every night. Somebody's siphoning at the Gas Works on Wapping Wall. And the fog keeps clear of a good flame, I've seen it." } }, { clue: "c_gas" }, { clue: "c_light" }] },
          { label: "Borrow a lamplighter's pole", once: true, steps: [{ say: "Tam lets you take a trimmed lamp. 'Don't let it gutter,' he says." }, { set: "has_lamp" }] },
          { label: "Back to the high street", steps: [{ goto: "yard" }] }] },
      pell: { name: "Mrs. Pell's kitchen", theme: "interior", mood: "weird", cast: ["pell"], lighting: "shadow",
        onEnter: [{ say: "A set table, two cups. A man sits at the far end. He looks like a man. He is not breathing, and the fog moves faintly around his feet like a dog." }],
        options: [
          { label: "Talk to Mrs. Pell", steps: [{ talk: { npc: "pell", text: "He came back Tuesday. I know he's not my Walter. But he sat down, and I made him tea. What else is a body to do?" } }, { clue: "c_pell" }] },
          { label: "Lead the thing at the table out into the lamplight", once: true, steps: [{ check: { aspect: "charisma", cr: "medium", label: "Coax it into the light", ok: [{ say: "It rises, polite, and lets itself be walked out. In the lamplight it thins to nothing, with a sound like a sigh. Mrs. Pell sits down and weeps, but she is herself." }, { objective: "so1" }], fail: [{ say: "It does not move. The room feels crowded." }, { damage: { pool: "sanity", amount: 2 } }] } }] },
          { label: "Leave", steps: [{ goto: "yard" }] }] },
      stairs: { name: "Wapping Old Stairs", theme: "fog", mood: "tense", lighting: "shadow",
        onEnter: [{ once: "ws", steps: [{ say: "The fog is here now, thick as wool. Something steps out of it wearing the face of someone you once loved." }, { combat: "street", win: [{ say: "The wisps tear in the lamplight. Behind them, downriver, a high brick chimney pulls the fog into itself." }, { clue: "c_gas" }] }] }],
        options: [{ label: "Follow the fog to the Gas Works", steps: [{ goto: "works" }] }, { label: "Back up the street", steps: [{ goto: "yard" }] }] },
      works: { name: "Wapping Gas Works", theme: "fog", mood: "dread", lighting: "shadow",
        onEnter: [{ once: "w", steps: [{ say: "The gasometer is full of nothing. A valve wheel, cold to the touch, opens onto a stairway down to a cistern the plans never showed. You can hear water lapping." }, { objective: "po1" }] }],
        options: [
          { label: "Descend to the cistern", steps: [{ say: "The air is warm and wet, and it smells of the river and of old perfume." }, { combat: "cistern", surpriseIf: "lit_stair", win: [{ say: "The Fog Mother comes apart with a sound like a thousand sighs. The valve wheel turns easily now. At the top of the stairs, the first grey light of dawn." }, { objective: "po2" }, { end: "win" }] }] },
          { label: "Light the lamp at the cistern mouth first", if: "has_lamp", once: true, steps: [{ say: "You trim the wick and hold the lamp high. The fog sulks away from the circle of true light, and the cistern stairs are lit." }, { set: "lit_stair" }] },
          { label: "Leave", steps: [{ goto: "stairs" }] }] }
    }
  });

  /* ---------------------------------------------------------------- 1916 · WCA / NSBD / OID */
  ADV.register({
    id: "trench-chorus", title: "The Trench Chorus", setting: "Western Front · 1916", year: 1916, level: [2, 4], agencies: ["WCA", "NSBD", "OID"],
    summary: "Men in Sector Nine hear singing from no-man's land at night. Four have walked out to join it. The Association has been asked to find out why before the whole line follows.",
    objectives: [
      { id: "po1", kind: "primary", t: "Find where the singing comes from", done: "A shelled chapel in the crater field." },
      { id: "po2", kind: "primary", t: "Silence the Chorus", done: "The Chorus Master falls, and the song breaks apart." },
      { id: "so1", kind: "secondary", t: "Bring Private Lowell home", done: "Lowell returns, hoarse and shaking, with all ten fingers." }],
    clues: {
      c_song: { t: "The song is a hymn nobody knows", s: "Sergeant Maddox", x: "It starts at 02:00. It is in perfect harmony, which is impossible: no choir is that large on this front." },
      c_walked: { t: "They walk out smiling", s: "Padre Iain", x: "The four who left were the ones who sang loudest at services. They walked unarmed across the wire, and the wire opened." },
      c_chapel: { t: "A chapel in the crater field", s: "Listening post", x: "Through the periscope: a roofless chapel, 300 yards out, candles lit in a shell hole. No one has lit candles there." },
      c_lowell: { t: "Lowell left his boots", s: "Sergeant Maddox", x: "Private Lowell, tone-deaf, volunteered for the post. He was found at dawn without boots, humming." }
    },
    npcs: {
      maddox: N("Sgt. Maddox", "Sector Nine", "Mud to the eyebrows, a mouth like a ruled line. He hasn't slept properly since June.", F(0, 3, "short", 3)),
      iain: N("Padre Iain", "Chaplain", "A young Highlander with a cracked prayer book and shakes in his hands that he hides in his pockets.", F(0, 5, "short", 5, "glasses"))
    },
    enemies: {
      rats: { build: { name: "Trench Rats", type: "Swarm", difficulty: "easy", sprite: "swarm", hue: 25, hitSfx: "blade_hit", dies: "scatters into the mud" } },
      singer: { build: { name: "Choir Soldier", type: "Undead", difficulty: "easy", sprite: "undead", hue: 90, variable: "stability", attack: 1, hitSfx: "blade_hit", dies: "falls silent" } },
      master: { build: { name: "The Chorus Master", type: "Undead", difficulty: "challenging", sprite: "undead", hue: 130, dtype: "stability", range: 1, variable: "stability", mods: ["Bloodthirsty"] }, modText: { "Bloodthirsty": "Heals when it deals damage." } }
    },
    encounters: {
      wire: { name: "No-man's land", theme: "trench", fightText: "The rats come out of the mud as one dark ripple.", zones: [
        { id: "a", name: "Our wire", col: 0, row: 0 }, { id: "b", name: "Shell hole", col: 1, row: 0 }, { id: "c", name: "Crater lip", col: 2, row: 0 }], edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "rats", zone: "b" }, { t: "rats", zone: "c" }] },
      chapel: { name: "The crater chapel", theme: "church", fightText: "The Chorus Master lifts his baton and the dead take their breath.", zones: [
        { id: "a", name: "Roofless nave", col: 0, row: 0 }, { id: "b", name: "Choir stalls", col: 1, row: 0 }, { id: "c", name: "The altar crater", col: 2, row: 0 }], edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "master", zone: "c" }, { t: "singer", zone: "b" }, { t: "singer", zone: "b" }] }
    },
    start: "trench",
    scenes: {
      trench: { name: "Sector Nine, fire trench", theme: "trench", mood: "calm", cast: ["maddox", "iain"], weather: "rain", onEnter: [{ once: "a", steps: [
        { say: "Duckboards, wet wool, the smell of old tobacco and older fear. Sergeant Maddox meets you with a mug of something that is not quite tea." },
        { talk: { npc: "maddox", text: "Two a.m. every night. It's a hymn, and it's perfect. Four of my boys have walked out into it. Private Lowell went last night. Lowell couldn't carry a tune in a bucket." } }, { clue: "c_song" }, { clue: "c_lowell" }] }],
        options: [
          { label: "Talk to Padre Iain", steps: [{ talk: { npc: "iain", text: "They were the ones who sang loudest in church. I think it chose them. I think it's lonely." } }, { clue: "c_walked" }] },
          { label: "Take the listening post", steps: [{ goto: "post" }] }] },
      post: { name: "The listening post", theme: "trench", mood: "dread", lighting: "shadow", weather: "rain",
        onEnter: [{ say: "A sap, forward of the wire, with a periscope and a bucket. At two the singing begins: soft, close, perfectly in tune." }],
        options: [
          { label: "Search no-man's land with the periscope", once: true, steps: [{ check: { aspect: "awareness", cr: "medium", label: "Find the singers", ok: [{ say: "Candlelight in a shell hole three hundred yards out. A roofless chapel, nave and altar standing in the mud." }, { clue: "c_chapel" }, { objective: "po1" }], fail: [{ say: "Mud, wire, the glow of a distant flare. You can't see them, but you listen too long, and the song gets into you. When you come to, you're halfway up the ladder, facing a shell hole three hundred yards out where candles are burning." }, { damage: { pool: "sanity", amount: 4 } }, { clue: "c_chapel" }, { objective: "po1" }] } }] },
          { label: "Go over the top toward the chapel", if: { clue: "c_chapel" }, steps: [{ say: "You slip over the parapet. The wire is already cut." }, { combat: "wire", win: [{ say: "The rats scatter. Ahead, the candles flicker in a roofless chapel." }, { goto: "chapel" }] }] },
          { label: "Back to the fire trench", steps: [{ goto: "trench" }] }] },
      chapel: { name: "The crater chapel", theme: "church", mood: "weird", lighting: "shadow",
        onEnter: [{ say: "Eleven men in the choir stalls, singing. Their uniforms are different years, some older than the war. Private Lowell stands at the end of the front row, boots off, mouth open, silent." }],
        options: [
          { label: "Pull Lowell out of the choir", once: true, steps: [{ check: { aspect: "strength", cr: "medium", label: "Drag Lowell clear", ok: [{ say: "He comes, limp, humming. At the chapel door the humming stops and he vomits a mouthful of candle wax." }, { objective: "so1" }], fail: [{ say: "The choir's note rises, and Lowell will not be moved." }, { damage: { pool: "stability", amount: 2 } }] } }] },
          { label: "Face the Chorus Master", steps: [{ combat: "chapel", win: [{ say: "The Master's baton snaps. The chorus gives one last sustained note, and then the only sound is rain on the old stone." }, { objective: "po2" }, { end: "win" }] }] },
          { label: "Retreat toward the line", steps: [{ goto: "post" }] }] }
    }
  });

  /* ---------------------------------------------------------------- 1957 · EHG */
  ADV.register({
    id: "night-train-aomori", flavor: "jp", title: "The Night Train to Aomori", setting: "Tōhoku Main Line, Japan · 1957", year: 1957, level: [1, 3], agencies: ["EHG", "WCA", "NSBD"],
    summary: "A sleeper from Ueno has an extra car that is not on the manifest. Passengers who step into it do not come back out. The conductor insists he has never seen it.",
    objectives: [
      { id: "po1", kind: "primary", t: "Find the car that isn't on the manifest", done: "Car 7, a tatami room that should not exist." },
      { id: "po2", kind: "primary", t: "Stop the train before the last station", done: "The Station Master of Nowhere loses his hold; the train slows to a halt in Aomori." },
      { id: "so1", kind: "secondary", t: "Bring back the missing child", done: "Little Ayame returns to her mother, clutching a paper ticket." }],
    clues: {
      c_manifest: { t: "Six cars, seven doors", s: "Conductor Satō", x: "The manifest lists six cars. The conductor has been counting doors all night and arrives at seven." },
      c_ticket: { t: "A ticket to nowhere", s: "Mrs. Hasegawa", x: "Ayame's little hand was holding a ticket that read 'LAST STATION, ONE WAY' before she walked through the door at the end of car 5." },
      c_lantern: { t: "The lantern keeps the car in place", s: "Car 7", x: "A paper lantern hangs by the door. When it burns, the car exists. If it goes out, it may drift away." }
    },
    npcs: {
      sato: N("Conductor Satō", "Japan National Railways", "Pale, stiff in his uniform, with a pocket watch he checks every thirty seconds.", F(1, 0, "short", 0, "hat")),
      hase: N("Mrs. Hasegawa", "Passenger, car 4", "A mother in a plain kimono, hands clasped hard. Her daughter's seat is empty.", F(1, 0, "bun", 1)),
      station: N("The Station Master", "Beyond", "White gloves, black cap, a face you cannot hold in memory. He says each station name very softly.", F(1, 0, "short", 5, "hat", "#1b1b26"))
    },
    enemies: {
      lantern: { build: { name: "Lantern Wisp", type: "Spirit", difficulty: "easy", sprite: "spirit", hue: 40, dtype: "sanity", range: 1 } },
      master: { build: { name: "Station Master of Nowhere", type: "Spirit", difficulty: "challenging", sprite: "spirit", hue: 280, dtype: "sanity", range: 1, core: { body: 0, mind: 2, spirit: 3 }, mods: ["Quick"] }, modText: { "Quick": "Acts early in the round." } }
    },
    encounters: {
      car7: { name: "Car 7", theme: "train", fightText: "The Station Master calls the next stop, and the lanterns lean in.", zones: [
        { id: "a", name: "Car 6 door", col: 0, row: 0 }, { id: "b", name: "Tatami floor", col: 1, row: 0 }, { id: "c", name: "Lamp end", col: 2, row: 0 }], edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "master", zone: "c" }, { t: "lantern", zone: "b" }, { t: "lantern", zone: "b" }] }
    },
    start: "platform",
    scenes: {
      platform: { name: "Ueno Station, platform 9", theme: "train", mood: "calm", cast: ["sato"], onEnter: [{ once: "a", steps: [
        { say: "The night train for Aomori idles at the platform, steam drifting under the lamps. The conductor looks at you, at his watch, at you." },
        { talk: { npc: "sato", text: "I've counted the doors a dozen times. Six cars on my manifest, seven doors at night. Last stop's not on my line. And a little girl walked into the thing already." } }, { clue: "c_manifest" }] }],
        options: [{ label: "Board the train", steps: [{ goto: "cars" }] }] },
      cars: { name: "Sleeper cars 3 to 6", theme: "train", mood: "dread", cast: ["hase"], lighting: "shadow",
        onEnter: [{ once: "c", steps: [{ say: "Curtains drawn, bunks creaking, a thousand sleepers dreaming along the same long dark. At the end of car 6, a door that was not on the manifest." }] }],
        options: [
          { label: "Speak with the girl's mother", steps: [{ talk: { npc: "hase", text: "She went through that door when I looked away. She had her ticket. I don't remember buying it." } }, { clue: "c_ticket" }] },
          { label: "Count the doors", once: true, steps: [{ check: { aspect: "awareness", cr: "easy", label: "Count the doors", ok: [{ say: "Six cars. Seven doors. The extra stands between six and the engine." }, { objective: "po1" }], fail: [{ say: "You lose count twice." }] } }] },
          { label: "Step through the extra door", steps: [{ goto: "car7" }] }] },
      car7: { name: "Car 7", theme: "train", mood: "weird", lighting: "shadow", cast: ["station"],
        onEnter: [{ once: "k", steps: [{ say: "Tatami, rice-paper walls, a long line of paper lanterns sway in a draft you cannot feel. A voice softly, politely announces the next station. There is no name. The speaker leans in: 'Last stop.'" }, { clue: "c_lantern" }] }],
        options: [
          { label: "Find Ayame in the rear compartment", once: true, steps: [{ check: { aspect: "charisma", cr: "medium", label: "Coax the child out", ok: [{ say: "She takes your hand and tears her paper ticket in half. 'I don't want to go there.'" }, { objective: "so1" }], fail: [{ say: "She stares through you." }, { damage: { pool: "sanity", amount: 2 } }] } }] },
          { label: "Confront the Station Master", steps: [{ combat: "car7", win: [{ say: "The Station Master removes his cap, bows, and is gone. The lanterns gutter out, one by one. The train brakes hard. Outside, the lights of Aomori." }, { objective: "po2" }, { end: "win" }] }] },
          { label: "Go back to the sleepers", steps: [{ goto: "cars" }] }] }
    }
  });

  /* ---------------------------------------------------------------- 1958 · NSBD / WCA */
  ADV.register({
    id: "last-picture-show", title: "The Last Picture Show", setting: "Nevada · 1958", year: 1958, level: [2, 4], agencies: ["NSBD", "WCA"],
    summary: "The Starlite Drive-In runs a free film every night, and every night the audience sits very still. Tonight's feature, the posters say, is 'THE END.'",
    objectives: [
      { id: "po1", kind: "primary", t: "Learn what is on tonight's reel", done: "Reel seven shows the lot itself, the audience dead in their seats at 11:42." },
      { id: "po2", kind: "primary", t: "Stop the screening", done: "The projector is silent and the screen is blank." },
      { id: "so1", kind: "secondary", t: "Find out who Mr. Vale was", done: "Vale, a projectionist who died here in 1949. The cinema kept his hands." }],
    clues: {
      c_free: { t: "Free admission, every night", s: "Ruby", x: "Mr. Vale has not charged anyone since June. The audience is always couples, and nobody leaves before the credits." },
      c_reels: { t: "Seven reels, seven nights", s: "The booth", x: "Labelled by date. Tonight's reel is the only one without a title, only a time: 11:42." },
      c_vale: { t: "Vale died in 1949", s: "County records", x: "The projectionist Alden Vale died in a booth fire. His hands were never recovered." }
    },
    npcs: {
      ruby: N("Ruby", "Concession stand", "A tired girl in a paper hat who smiles for customers and flinches when the screen flickers.", F(1, 5, "bun", 7)),
      dunn: N("Sheriff Dunn", "Humboldt County", "Heavy-set, sunburnt, resigned. He's been here a lot lately.", F(0, 4, "short", 1, "hat")),
      vale: N("Mr. Vale", "Projectionist", "A thin man in a white coat. His gloves are stitched on at the wrists.", F(0, 0, "short", 6, "glasses", "#1b1b26"))
    },
    enemies: {
      cutout: { build: { name: "Cardboard Usher", type: "Golem", difficulty: "easy", sprite: "construct", hue: 20, hitSfx: "blade_hit", dies: "folds flat" } },
      vale: { build: { name: "Alden Vale", type: "Folklore", difficulty: "challenging", sprite: "humanoid", hue: 0, dtype: "sanity", range: 1, variable: "sanity", mods: ["Intimidating"] }, modText: { "Intimidating": "Fear: foes in its zone are shaken." } }
    },
    encounters: {
      booth: { name: "The projection booth", theme: "interior", fightText: "Vale's gloved hands settle on the projector. The reels start to turn.", zones: [
        { id: "a", name: "Stairs", col: 0, row: 0 }, { id: "b", name: "Booth floor", col: 1, row: 0 }, { id: "c", name: "The projector", col: 2, row: 0 }], edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "vale", zone: "c" }, { t: "cutout", zone: "b" }] }
    },
    start: "lot",
    scenes: {
      lot: { name: "The Starlite Drive-In", theme: "drive", mood: "calm", cast: ["dunn"], onEnter: [{ once: "a", steps: [
        { say: "Cars in tidy rows, dim lights in the windows, heads tipped toward the huge white screen. It is dusk, 9:15. The screen is already lit." },
        { talk: { npc: "dunn", text: "Eight couples last week didn't go home. Nobody's complained. Not one. Just, they're not found. The cars are there at morning and the seats are warm." } }] }],
        options: [{ label: "Visit the concession stand", steps: [{ goto: "stand" }] }, { label: "Walk to the projection booth", steps: [{ goto: "booth" }] }, { label: "Inspect the sleeping audience", once: true, steps: [{ check: { aspect: "awareness", cr: "easy", label: "Look closely at the audience", ok: [{ say: "No one is breathing. Every window is fogged. Every face is lit by the screen, and every face is smiling." }], fail: [{ say: "They look like they're sleeping." }] } }] }] },
      stand: { name: "Concession stand", theme: "drive", mood: "calm", cast: ["ruby"],
        onEnter: [{ say: "The popcorn machine hums, a stack of cups waits unused." }],
        options: [{ label: "Talk to Ruby", steps: [{ talk: { npc: "ruby", text: "Mr. Vale says it's the best picture we've ever run. I'm not supposed to watch it. I put my fingers in my ears when the lights go down." } }, { clue: "c_free" }] },
          { label: "Ask about Vale's past", once: true, steps: [{ check: { aspect: "charisma", cr: "medium", label: "Get Ruby to talk", ok: [{ say: "'The old booth burned in '49,' she whispers. 'They never found his hands.'" }, { clue: "c_vale" }, { objective: "so1" }], fail: [{ say: "She shakes her head and busies herself with the cups." }] } }] },
          { label: "Back to the lot", steps: [{ goto: "lot" }] }] },
      booth: { name: "The projection booth", theme: "interior", mood: "dread", lighting: "shadow",
        onEnter: [{ say: "Seven film cans on a shelf, dates in white grease pencil. Beyond the little window, the lot lies like a graveyard." }],
        options: [{ label: "Read the reels", once: true, steps: [{ check: { aspect: "iq", cr: "easy", label: "Check the reel labels", investigate: true, ok: [{ say: "Seven nights, six titled. Tonight's reel has no title, only a time stamp, 11:42, and a photograph of the lot taken from above." }, { clue: "c_reels" }, { objective: "po1" }], fail: [{ say: "Dates and smudges." }] } }] },
          { label: "Seize the projector", steps: [{ combat: "booth", win: [{ say: "The projector shudders and stops. On the lot, one by one, the windows clear. Somewhere a woman gasps. The screen goes white, and then dark." }, { objective: "po2" }, { end: "win" }] }] },
          { label: "Back to the lot", steps: [{ goto: "lot" }] }] }
    }
  });

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
        { say: "A cramped ISP office above a kebab shop, cables across the ceiling like vines. Priya has pinned eleven names to the wall." },
        { talk: { npc: "priya", text: "They all dialled the same number the same night. Nobody runs it. The greeting says your name. Some of them are sleeping like logs, and their screens are all showing the same blinking prompt." } }, { clue: "c_bbs" }] }],
        options: [
          { label: "Examine one victim's terminal", once: true, steps: [{ check: { aspect: "iq", cr: "medium", label: "Dig through the logs", investigate: true, ok: [{ say: "A final message from the board's own sysop, scrolling on a dead man's screen." }, { clue: "c_sysop" }, { objective: "so1" }], fail: [{ say: "Garbled characters, then a long grey nothing." }] } }] },
          { label: "Trace the number", once: true, steps: [{ check: { aspect: "iq", cr: "challenging", label: "Trace the line", investigate: true, ok: [{ say: "The call is routed through Exchange 31, closed in 1971. And still switched on." }, { clue: "c_exchange" }, { objective: "po1" }], fail: [{ say: "The trace folds back on itself, and your own phone number appears in the logs." }, { damage: { pool: "sanity", amount: 2 } }, { say: "Then your phone rings. The caller ID reads EXCHANGE 31, a building closed in 1971. It keeps ringing until you write the address down." }, { clue: "c_exchange" }, { objective: "po1" }] } }] },
          { label: "Go to Exchange 31", if: { clue: "c_exchange" }, steps: [{ goto: "exchange" }] }] },
      exchange: { name: "Telephone Exchange 31", theme: "lab", mood: "weird", lighting: "normal",
        onEnter: [{ say: "Relays chatter in the dark like a thousand cicadas. Every handset in the building has been lifted off its hook." }],
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
        { say: "A tent, a generator, a laptop on a crate. The last frame of the drone's footage is frozen on the screen: a figure looking up at the lens. Lin is the figure." },
        { talk: { npc: "lin", text: "That's me. I haven't been there. I haven't moved from this crate. I've been right here, drinking tea, since lunch." } }, { clue: "c_footage" }] }],
        options: [{ label: "Hike up the terrace road", steps: [{ goto: "road" }] }] },
      road: { name: "The terrace road", theme: "forest", mood: "tense", lighting: "shadow",
        onEnter: [{ once: "r", steps: [{ say: "The map shows nothing. The bamboo thickens as the sun drops. Then the smell of rice smoke, impossible this far from any town." }, { combat: "road", win: [{ say: "The last wolf drops. A faint light shows through the bamboo ahead: terraces, lanterns, the roofs of a village." }, { objective: "po1" }] }] }],
        options: [{ label: "Enter the village", steps: [{ goto: "village" }] }, { label: "Back to camp", steps: [{ goto: "camp" }] }] },
      village: { name: "Lüshui village", theme: "village", mood: "weird", cast: ["mei"], lighting: "shadow",
        onEnter: [{ say: "Lanterns, drying rice, a dog barking in a hollow. Everyone smiles. Everyone is mid-chore." }],
        options: [
          { label: "Talk to Auntie Mei", steps: [{ talk: { npc: "mei", text: "Today is the day the rice is drying." }}, { clue: "c_loop" }] },
          { label: "Study the round mirrors above the doors", once: true, steps: [{ check: { aspect: "awareness", cr: "medium", label: "Watch the mirrors", ok: [{ say: "At dusk, every mirror turns on its own, a few degrees at a time, to face the hill." }, { clue: "c_mirror" }], fail: [{ say: "Your own face, looking tired. You stare too long, and when you blink it's dusk, and every mirror in the street has turned to face the hill. So has your reflection. You haven't moved." }, { damage: { pool: "sanity", amount: 3 } }, { clue: "c_mirror" }] } }] },
          { label: "Search the street for the drone", once: true, steps: [{ check: { aspect: "iq", cr: "easy", label: "Find the crashed drone", ok: [{ say: "In a ditch, black and bent: the drone. Its black box is still warm." }, { objective: "so1" }], fail: [{ say: "Nothing but rice and shadows." }] } }] },
          { label: "Climb to the shrine on the hill", if: { clue: "c_mirror" }, steps: [{ combat: "shrine", win: [{ say: "The Mother cracks along every reflection at once. Dawn finally breaks over the terraces, for the first time in years. People in the street stop mid-sentence, and then they weep." }, { objective: "po2" }, { end: "win" }] }] },
          { label: "Return down the road", steps: [{ goto: "road" }] }] }
    }
  });
})();
