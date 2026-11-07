/* ============================================================================
   PACK · THE LAMP-BLACK CYCLE
   A three-part campaign arc for the WCA and OID, 1889-1891.
   A dealer in artists' pigment, Mr. Silas Ashgrove, sells a black so deep it
   holds whatever it is painted over. It's made from soot, and the soot comes
   from somewhere it shouldn't.
   Choices that carry forward (arc flags):
     kept_portrait   part 1: you kept one of the portraits as evidence
     hale_spared     part 1: you let the painter Edmund Hale go free
     children_saved  part 2: you got the sweep boys out of the flues
     ledger          part 2: you took Ashgrove's order ledger
   ========================================================================== */
(function () {
  const A = window.ART;
  const F = (s, hc, h, o, x = "none", more = {}) => ({ skin: A.SKIN[s], hairC: A.HAIRC[hc], hair: h, outfit: A.OUTFIT[o], extra: x, bg: "#2b2f3a", ...more });
  const N = (name, tag, look, face) => ({ name, tag, look, face });
  const ASHGROVE = N("Mr. Silas Ashgrove", "Colourman · purveyor of pigments", "Grey gloves, a soft voice, and a smell of soot that follows him into every room. His face is easy to forget, which he seems to count on.", F(1, 5, "slicked", 5, "none", { sex: "m" }));

  /* ---------------------------------------------------------------- part 1 · 1889 · London */
  const part1 = {
    id: "lb-1-portraits", title: "Lamp-Black I: The Sitters", setting: "Chelsea, London · 1889", year: 1889, level: [1, 3], agencies: ["WCA", "OID"],
    summary: "Edmund Hale paints society portraits that look more alive than their sitters. Lately the sitters agree: four of them are wasting away in their beds, and each one swears their portrait watches them sleep.",
    objectives: [
      { id: "po1", kind: "primary", t: "Find out what is wrong with Hale's portraits", done: "The black in every portrait is the same pigment, bought from one dealer: Ashgrove's of Southwark." },
      { id: "po2", kind: "primary", t: "Free the sitters", done: "The portraits are dealt with. In four houses across London, someone sits up in bed and asks for breakfast." },
      { id: "so1", kind: "secondary", t: "Learn the name of the man who sold the pigment", done: "Silas Ashgrove, colourman. A name for the wall." }],
    clues: {
      c_waste: { t: "The sitters fade as the paint dries", s: "Dr. Phoebe Larkin", x: "Every sitter began to sicken the week their portrait was varnished. The doctor has charted it: the deeper the shadows in the painting, the faster the decline." },
      c_black: { t: "One black, from one dealer", s: "Hale's studio", x: "Hale's palette is ordinary except for one cake of black, unlabelled, that leaves no stain on your fingers and drinks the lamplight." },
      c_breath: { t: "The paintings breathe", s: "Lady Vere's portrait", x: "In the dark, with your ear to the canvas, you can hear it: slow breathing, in time with the woman upstairs." },
      c_name: { t: "Ashgrove's of Southwark", s: "Edmund Hale", x: "Hale bought the black from a colourman named Silas Ashgrove, who came to the studio himself, unasked, and named a very low price." }
    },
    npcs: {
      larkin: N("Dr. Phoebe Larkin", "Physician · refuses to be ignored", "Spectacles, a medical bag, and a chart of four patients drawn in a hand that has started to shake.", F(1, 2, "bun", 3, "round glasses", { sex: "f" })),
      hale: N("Edmund Hale", "Portrait painter", "Paint under his nails, wine on his cuffs, and a terrible suspicion he has been trying very hard not to have.", F(2, 1, "wavy", 6, "none", { sex: "m" })),
      vere: N("Lady Augusta Vere", "Sitter · bedridden", "Grey as paper in a bed too large for her. She asks you to turn her portrait to the wall, and then asks you not to.", F(0, 5, "bun", 8, "none", { sex: "f" }))
    },
    enemies: {
      sitter: { build: { name: "The Painted Lady", type: "Spirit", difficulty: "challenging", sprite: "spirit", hue: 30, dtype: "sanity", range: 1, core: { body: 0, mind: 2, spirit: 3 }, mods: ["Psychological Attacks", "Possession"], dies: "goes flat, and is only oil and canvas" } },
      frame: { build: { name: "Gilt frame", type: "Construct", difficulty: "easy", sprite: "construct", hue: 45, dies: "falls apart into gilt and splinters" } }
    },
    encounters: {
      gallery: { name: "Hale's gallery", theme: "interior", fightText: "Every portrait in the room turns its eyes to you.", zones: [
        { id: "a", name: "The door", col: 0, row: 0 }, { id: "b", name: "The hanging wall", col: 1, row: 0 }, { id: "c", name: "Lady Vere's portrait", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "sitter", zone: "c" }, { t: "frame", zone: "b" }, { t: "frame", zone: "b", name: "Gilt frame (2)" }] }
    },
    start: "surgery",
    scenes: {
      surgery: { name: "Dr. Larkin's surgery", theme: "interior", mood: "calm", weather: "rain", cast: ["larkin"],
        onEnter: [{ once: "in", steps: [{ say: "A narrow surgery off the King's Road, gaslight hissing, rain on the glass. Dr. Phoebe Larkin has four patient files open on her desk and four small portraits pinned beside them." }] }],
        options: [
          { label: "Hear the doctor out", hint: "She's been charting this for a month", once: true, steps: [
            { talk: { npc: "larkin", text: "Four patients. Healthy in March. All sat for Edmund Hale in April. By June they couldn't climb stairs. I've ruled out arsenic, consumption, and their husbands. What I can't rule out is that it's the paintings." } },
            { clue: "c_waste" }] },
          { label: "Study her chart", hint: "Dates, weights, and the paintings beside them", once: true, steps: [
            { check: { aspect: "iq", cr: "medium", label: "Read the doctor's chart", investigate: true,
              ok: [{ say: "The pattern is exact: each patient's decline began within a day of their portrait being varnished, and the darkest portrait belongs to the sickest woman: Lady Augusta Vere." }, { set: "chart" }],
              fail: [{ say: "Columns of weights and dates. You see that they're all getting worse, which you knew." }] } }] },
          { label: "Go to Hale's studio", steps: [{ goto: "studio" }] },
          { label: "Call on Lady Vere", steps: [{ goto: "vere" }] }] },
      vere: { name: "Vere House, Cheyne Walk", theme: "interior", mood: "dread", lighting: "shadow", cast: ["vere"],
        onEnter: [{ once: "in", steps: [{ say: "Curtains drawn at noon. Lady Vere lies propped on pillows, and across the room her portrait hangs over the mantel: the same woman, ten years younger and much more alive." }] }],
        options: [
          { label: "Speak to Lady Vere", hint: "She hasn't much breath to spare", once: true, steps: [
            { talk: { npc: "vere", text: "It watches me. I know how that sounds. When the lamps are out I hear it breathing, and every breath it takes, I can't." } },
            { read: { cr: "medium", lying: false, ok: [{ say: "Every word is the plain truth, and she knows you can see it." }] } }] },
          { label: "Listen to the portrait in the dark", hint: "Put out the lamps and put your ear to the canvas", once: true, steps: [
            { check: { aspect: "awareness", cr: "medium", label: "Hear what the painting is doing", investigate: true,
              ok: [{ say: "Slow, wet breathing, from behind the varnish, in perfect time with the woman in the bed." }, { clue: "c_breath" }],
              fail: [{ say: "Silence. Then you realise you've been holding your breath for a long time, and so has Lady Vere, and the painting hasn't." }, { damage: { pool: "sanity", amount: 3 } }, { clue: "c_breath" }] } }] },
          { label: "Take the portrait down and keep it", hint: "Evidence, if you can carry it out", if: { clue: "c_breath" }, once: true, steps: [
            { say: "It comes off the wall heavier than it should. Lady Vere gasps, then breathes, properly, for the first time since you arrived. You wrap the canvas in a sheet. It's warm." },
            { arcSet: "kept_portrait" }, { set: "vere_free" }] },
          { label: "Back to the surgery", steps: [{ goto: "surgery" }] }] },
      studio: { name: "Hale's studio, Chelsea", theme: "interior", mood: "tense", cast: ["hale"],
        onEnter: [{ once: "in", steps: [{ say: "Skylight, easels, the smell of linseed. Edmund Hale opens the door with a brush in his teeth and the look of a man who has been expecting someone like you." }] }],
        options: [
          { label: "Examine his palette", hint: "Paints, oils, one unlabelled cake of black", once: true, steps: [
            { check: { aspect: "awareness", cr: "medium", label: "Find what doesn't belong", investigate: true,
              ok: [{ say: "Every colour is from Winsor and Newton but one: a cake of black, unwrapped, that leaves no mark on your thumb and seems to pull the light out of the room." }, { clue: "c_black" }, { objective: "po1" }],
              fail: [{ say: "Paints, lots of paints, and cobalt on your cuff. It's only when you put your hand down on a cake of black and feel the cold go up your arm that you find it. Your fingers stay numb for an hour." }, { damage: { pool: "health", amount: 2 } }, { clue: "c_black" }, { objective: "po1" }] } }] },
          { label: "Press Hale about the black", hint: "He knows more than he wants to", if: { clue: "c_black" }, once: true, steps: [
            { talk: { npc: "hale", text: "A colourman came to the door. Ashgrove, from Southwark. He said my shadows were timid. He was right, God help me. I have never painted anything like those portraits. I've also never been so afraid of them." } },
            { clue: "c_name" }, { objective: "so1" }] },
          { label: "Decide what happens to Hale", if: { clue: "c_name" }, once: true, steps: [
            { choice: { prompt: "Hale didn't know what the paint was. He still painted four people into their graves, very nearly.", options: [
              { label: "Let him go, and ask him to remember Ashgrove's face", steps: [{ say: "He shakes your hand too long. 'If you need a painter who knows what that black does,' he says, 'I'll be here. I'm not painting anything else.'" }, { arcSet: "hale_spared" }] },
              { label: "Hand him to the police", steps: [{ say: "He goes quietly. The constable doesn't understand the charge and doesn't need to." }] }] } }] },
          { label: "Go through to his gallery", steps: [{ goto: "gallery" }] },
          { label: "Back to the surgery", steps: [{ goto: "surgery" }] }] },
      gallery: { name: "The gallery behind the studio", theme: "interior", mood: "boss", lighting: "shadow",
        onEnter: [{ say: "Four portraits hang finished and varnished, waiting for delivery. In the lamplight their shadows are too deep to see the bottom of." }],
        options: [
          { label: "Scrape the black from the canvases", hint: "Slow, careful work with a palette knife", if: { clue: "c_black" }, once: true, steps: [
            { group: { aspect: "agility", cr: "medium", label: "Lift the black without tearing the canvas", intro: "Everyone takes a portrait and a knife. Work fast; they know what you're doing.",
              ok: [{ say: "The black comes away in long dry curls, like ash. Behind it there's nothing but primed linen. The paintings sigh, all at once." }, { set: "scraped" }],
              fail: [{ say: "The black clings and spits. Someone's knife slips into a painted eye, and the painting screams." }, { damage: { pool: "stability", amount: 3 } }, { set: "scraped" }] } }] },
          { label: "Burn them", hint: "Fast, final, and the portraits will fight", steps: [{ combat: "gallery", surpriseIf: "scraped", win: [
            { say: "The canvases curl in the grate and the black goes up the chimney in a thin grey smoke that smells of somebody's hair." },
            { objective: "po2" },
            { if: { arc: "kept_portrait" }, then: [{ say: "Except one: Lady Vere's portrait, wrapped in its sheet in your cab, still warm. Dr. Larkin says Lady Vere is recovering. The painting still breathes, slowly, all by itself now." }] },
            { say: "Southwark is on the other side of the river. Mr. Ashgrove, by every account, has already closed his shop." },
            { end: "win" }] }] },
          { label: "Back to the studio", steps: [{ goto: "studio" }] }] }
    }
  };

  /* ---------------------------------------------------------------- part 2 · 1890 · Manchester */
  const part2 = {
    id: "lb-2-flues", title: "Lamp-Black II: The Flues", setting: "Ancoats, Manchester · 1890", year: 1890, level: [2, 4], agencies: ["WCA", "OID"],
    summary: "Ashgrove's has reopened in Manchester as a rendering works on the canal. The sweep masters of Ancoats say their climbing boys have been going missing in the works' chimneys, and the soot that comes down is warm.",
    objectives: [
      { id: "po1", kind: "primary", t: "Find out what Ashgrove makes his black from", done: "Soot from the flues of the dead: the rendering works burns what the workhouse can't bury, and the chimneys hold more than smoke." },
      { id: "po2", kind: "primary", t: "Shut the works", done: "The great flue is broken and the furnaces are cold. The canal runs clear for the first time in a year." },
      { id: "so1", kind: "secondary", t: "Get the sweep boys out of the flues", done: "Six boys come down the ladders black from head to foot, and every one of them is alive." }],
    clues: {
      c_boys: { t: "Six boys, one chimney", s: "Mother Hennessy", x: "Six climbing boys sent up the works' great flue this year. The master says they ran away. Their boots came down the flue without them." },
      c_warm: { t: "The soot is warm", s: "The works yard", x: "The soot heaped in the yard is warm to the touch on a frost morning, and when you hold a handful to your ear you can hear voices, very small." },
      c_contract: { t: "The workhouse contract", s: "The board of guardians", x: "The works holds a contract with the workhouse to 'dispose of the unclaimed dead by means of furnace'. It was signed by S. Ashgrove a week after the London shop closed." },
      c_saint: { t: "The thing in the flue", s: "The furnace room", x: "Ashgrove doesn't run the works. He serves something in the great flue: a shape of soot that the boys call the Saint, because it hums like a choir." }
    },
    npcs: {
      hennessy: N("Mother Hennessy", "Sweep's widow · keeps the boys", "Sleeves rolled, a cane she doesn't need for walking, and six empty cots in her back room.", F(3, 5, "headscarf", 6, "headscarf", { sex: "f" })),
      tolly: N("Tolly", "Climbing boy · 9", "Black from the soot, quick as a cat, and the only boy who came back down the great flue.", F(4, 0, "buzz", 9, "cap", { sex: "m" })),
      ashgrove: ASHGROVE
    },
    enemies: {
      saint: { build: { name: "The Soot-Saint (first face)", type: "Beyond", difficulty: "challenging", sprite: "beyond", hue: 0, dtype: "stability", core: { body: 2, mind: 2, spirit: 3 }, mods: ["Unimaginable Horror", "Ethereal"], dies: "breaks apart into a fall of warm black snow, and somewhere above, something hums a lower note" } },
      stoker: { build: { name: "Stoker", type: "Human", difficulty: "easy", sprite: "humanoid", hue: 20, dies: "drops the shovel and runs" } }
    },
    encounters: {
      furnace: { name: "The furnace room", theme: "cellar", fightText: "The great flue roars, and the soot in it opens its mouth.", zones: [
        { id: "a", name: "The stair", col: 0, row: 0 }, { id: "b", name: "The furnace floor", col: 1, row: 0 }, { id: "c", name: "The flue mouth", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "saint", zone: "c" }, { t: "stoker", zone: "b" }, { t: "stoker", zone: "b", name: "Stoker (2)" }] }
    },
    start: "hennessy",
    scenes: {
      hennessy: { name: "Mother Hennessy's, Jersey Street", theme: "interior", mood: "calm", weather: "rain", cast: ["hennessy"],
        onEnter: [{ once: "in", steps: [{ say: "A two-up-two-down full of brushes and sacks. Mother Hennessy pours you tea in chipped cups and doesn't sit down." },
          { if: { arc: "kept_portrait" }, then: [{ say: "The portrait you kept from Chelsea is in your luggage, wrapped in its sheet. On the train north it breathed faster as you came into Manchester. It hasn't slowed since." }] }] }],
        options: [
          { label: "Ask about the missing boys", once: true, steps: [
            { talk: { npc: "hennessy", text: "Six of mine, sent up the great flue at the canal works. Master says they ran off to sea. Their boots come down the flue in a sack, laces still tied. Boys don't run off without their boots." } },
            { clue: "c_boys" }] },
          { label: "Read the workhouse guardians' minutes", hint: "Public record, if you can stomach it", once: true, steps: [
            { check: { aspect: "iq", cr: "medium", label: "Find the works in the minutes", investigate: true,
              ok: [{ say: "Halfway down a dull page: the guardians have contracted 'the unclaimed dead' to the canal works, for disposal by furnace. Signed, S. Ashgrove." }, { clue: "c_contract" }],
              fail: [{ say: "Coal, bread, a new roof for the infirmary. If the works is in here, it's hidden well. The clerk watches you leave." }] } }] },
          { label: "Go to the works yard", steps: [{ goto: "yard" }] }] },
      yard: { name: "Ashgrove's Rendering Works", theme: "street", mood: "tense", weather: "rain",
        onEnter: [{ once: "in", steps: [{ say: "A yard of black heaps beside the canal, under a chimney so tall it disappears into the low cloud. The heaps steam in the rain." }] }],
        options: [
          { label: "Handle the soot", hint: "Bare hands, if you dare", once: true, steps: [
            { check: { aspect: "willpower", cr: "medium", label: "Hold a handful long enough to understand it",
              ok: [{ say: "It's warm. Held close, it whispers: names, prayers, someone asking for their mother. It's people. It was people." }, { clue: "c_warm" }, { objective: "po1" }],
              fail: [{ say: "It's warm, and it whispers, and you drop it and keep wiping your hands long after they're clean." }, { damage: { pool: "sanity", amount: 4 } }, { clue: "c_warm" }, { objective: "po1" }] } }] },
          { label: "Find the boy who came back", hint: "The sweeps say one did", once: true, steps: [
            { check: { aspect: "charisma", cr: "easy", label: "Coax Tolly out of the coal shed",
              ok: [{ say: "A small black face behind the coal. Tolly comes out for a shilling and a promise." }, { set: "tolly" }],
              fail: [{ say: "He bolts. You find him later, on the canal wall, and he only comes with you because it's raining." }, { set: "tolly" }] } }] },
          { label: "Climb into the flues with Tolly", hint: "He knows the way up and the way down", if: "tolly", steps: [{ goto: "flues" }] },
          { label: "Take the stairs down to the furnaces", steps: [{ goto: "office" }] }] },
      flues: { name: "Inside the great flue", theme: "cave", mood: "dread", lighting: "shadow", cast: ["tolly"],
        onEnter: [{ say: "Brick a hand's width from your face on every side, warm as a body. Far above, a sound like a church choir humming one note." }],
        options: [
          { label: "Follow Tolly to the boys", once: true, steps: [
            { group: { aspect: "agility", cr: "medium", label: "Climb the flue in the dark", intro: "Knees and elbows, brick by brick. Tolly goes first and whistles so you can follow.",
              ok: [{ say: "Six boys, wedged in a ledge high up the flue, too frightened to climb either way. They're thin and black and alive. One by one, Tolly leads them down." }, { objective: "so1" }, { arcSet: "children_saved" }],
              fail: [{ say: "Someone slips and catches themselves bloody on the brick. You reach the ledge late: three boys, alive. The other three are already part of the soot." }, { damage: { pool: "health", amount: 4 } }] } }] },
          { label: "Climb toward the humming", hint: "The thing the boys call the Saint", once: true, steps: [
            { check: { aspect: "occult", cr: "challenging", label: "Look at it without losing yourself",
              ok: [{ say: "A shape of soot hanging in the flue like a hive. It's made of what the furnaces burn, and it is singing to itself. Ashgrove isn't its master. He's its servant." }, { clue: "c_saint" }],
              fail: [{ say: "You look up and it looks down and for a long minute you forget your own name." }, { damage: { pool: "sanity", amount: 6 } }, { clue: "c_saint" }] } }] },
          { label: "Down to the furnace room", steps: [{ goto: "furnace" }] }] },
      office: { name: "The works office", theme: "interior", mood: "weird", cast: ["ashgrove"],
        onEnter: [{ once: "in", steps: [{ say: "A neat office over the furnaces, everything grey with fine soot. Mr. Silas Ashgrove looks up from his ledger and smiles as if you're a customer he's been expecting." },
          { if: { arc: "kept_portrait" }, then: [{ say: "In your bag, wrapped in its sheet, the Chelsea portrait stops breathing entirely. Ashgrove's eyes go to the bag and stay there." }, { set: "ash_rattled" }] }] }],
        options: [
          { label: "Talk to Ashgrove", once: true, steps: [
            { talk: { npc: "ashgrove", text: "Lamp-black is the oldest pigment there is. Soot from a lamp. I only use better lamps. You've seen what it can do in a painting. Imagine what it can do in a city." } },
            { read: { cr: "challenging", lying: true, liar: "Every word is said for someone else's benefit, and that someone is above you, in the chimney.", ok: [{ say: "He isn't proud. He's terrified, and he's selling the thing he's terrified of." }] } }] },
          { label: "Take his ledger", hint: "While he's watching someone else", once: true, steps: [
            { check: { aspect: "agility", cr: "medium", label: "Lift the ledger off the desk",
              ok: [{ say: "Every order of black for two years: dozens of buyers, most of them in London, and one standing order for 'the opening', dated next spring." }, { arcSet: "ledger" }],
              fail: [{ say: "He puts his hand flat on the book and looks at you with no expression at all. You decide not to try again." }] } }] },
          { label: "Go down to the furnaces", steps: [{ goto: "furnace" }] }] },
      furnace: { name: "The furnace room", theme: "cellar", mood: "boss", lighting: "shadow",
        onEnter: [{ say: "Three furnaces under one great flue, and stokers feeding them from a cart of canvas-wrapped bundles you don't look at twice." }],
        options: [
          { label: "Bank the furnaces", hint: "Shut the dampers and starve the flue", once: true, steps: [
            { check: { aspect: "strength", cr: "medium", label: "Wrench the dampers shut",
              ok: [{ say: "The great flue coughs. Above you, the humming drops a note, uncertain." }, { set: "banked" }],
              fail: [{ say: "The damper is too hot to hold. You burn your hands and the flue roars on." }, { damage: { pool: "health", amount: 3 } }] } }] },
          { label: "Break the great flue", steps: [{ combat: "furnace", surpriseIf: "banked", win: [
            { say: "The flue cracks, and the soot comes down all at once in a warm black snow that covers the floor and then is only soot." },
            { objective: "po2" },
            { say: "Ashgrove's office is empty. The window over the canal is open. Somewhere above Manchester, something is still humming, further off now, heading south." },
            { end: "win" }] }] },
          { label: "Back up the stairs", steps: [{ goto: "office" }] }] }
    }
  };

  /* ---------------------------------------------------------------- part 3 · 1891 · London */
  const part3 = {
    id: "lb-3-opening", title: "Lamp-Black III: The Opening", setting: "Bloomsbury, London · 1891", year: 1891, level: [3, 6], agencies: ["WCA", "OID"],
    summary: "Ashgrove has taken a gallery in Bloomsbury for a grand private view. The invitations are printed in a black that won't come off your fingers. On the night of the opening every gas lamp in London will be lit with his black, and the Saint will look out of all of them at once.",
    objectives: [
      { id: "po1", kind: "primary", t: "Get into the opening", done: "You're inside, among the guests, with the black canvases on every wall." },
      { id: "po2", kind: "primary", t: "End the Soot-Saint", done: "The master canvas is destroyed and the Saint with it. At midnight the gas lamps of London burn yellow." },
      { id: "so1", kind: "secondary", t: "Bring Silas Ashgrove out alive", done: "Ashgrove walks out with you, grey and shaking and himself, and starts talking before you've asked a question." }],
    clues: {
      c_invite: { t: "The invitations", s: "The guest list", x: "Two hundred invitations, every one printed in lamp-black, sent to everyone who bought from Ashgrove and everyone who sat for a portrait painted with it." },
      c_lamps: { t: "The gas company's order", s: "The gasworks", x: "The Gas Light and Coke Company has been sold a 'lamp improver' by Ashgrove's. It goes into the mains at nine on the night of the opening." },
      c_master: { t: "The master canvas", s: "The gallery cellar", x: "Under the gallery, a single canvas thirty feet wide, black from edge to edge. The Saint isn't painted on it. It's waiting behind it, like a door." }
    },
    npcs: {
      hale: N("Edmund Hale", "Painter · trying to make amends", "Thinner than he was, paint-stained and sober, carrying a satchel of brushes and turpentine.", F(2, 1, "wavy", 6, "none", { sex: "m" })),
      tolly: N("Tolly", "Sweep · 10", "A year older, a head taller, and the best climber in Manchester, he says, and London too.", F(4, 0, "buzz", 9, "cap", { sex: "m" })),
      ashgrove: ASHGROVE
    },
    enemies: {
      saint: { build: { name: "The Soot-Saint", type: "Beyond", difficulty: "dangerous", sprite: "beyond", hue: 0, dtype: "sanity", core: { body: 3, mind: 3, spirit: 4 }, mods: ["Unimaginable Horror", "Nightmare", "Void"], dies: "comes apart into ordinary soot that drifts down over the canvases like a fall of snow, and the humming stops" } },
      guest: { build: { name: "Painted guest", type: "Human", difficulty: "easy", sprite: "humanoid", hue: 0, attack: 0, dies: "blinks, wipes the black from their eyes and sits down hard on the floor" } }
    },
    encounters: {
      cellar: { name: "The cellar under the gallery", theme: "cellar", fightText: "The canvas opens like a mouth, and the Saint steps through it.", zones: [
        { id: "a", name: "The stair", col: 0, row: 0 }, { id: "b", name: "The candles", col: 1, row: 0 }, { id: "c", name: "The master canvas", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "saint", zone: "c" }, { t: "guest", zone: "b" }, { t: "guest", zone: "b", name: "Painted guest (2)" }] }
    },
    start: "street",
    scenes: {
      street: { name: "Great Russell Street", theme: "fog", mood: "tense", weather: "rain",
        onEnter: [{ once: "in", steps: [{ say: "Carriages nose-to-tail outside a new gallery with blacked-out windows. The gas lamps along the street burn with a flame so dark it's almost not there." },
          { if: { arc: "hale_spared" }, then: [{ say: "A thin man in a paint-stained coat steps out of a doorway: Edmund Hale, with a satchel of brushes. 'I said I'd remember his face,' he says. 'I've been painting nothing else for two years. I know where his black is weakest.'" }, { set: "hale_here" }] },
          { if: { arc: "children_saved" }, then: [{ say: "And on the railings, grinning: Tolly from Ancoats, who came down on the train with a sweep's brush over his shoulder. 'You'll want the flues,' he says. 'Gallery's got the biggest chimney in Bloomsbury.'" }, { set: "tolly_here" }] }] }],
        options: [
          { label: "Get in through the front door", hint: "Bluff past the doorman", once: true, steps: [
            { check: { aspect: "charisma", cr: "challenging", label: "Talk your way into the private view",
              ok: [{ say: "The doorman looks at your hands for black ink, finds none, and lets you in anyway, because you look like you belong." }, { objective: "po1" }, { goto: "gallery" }],
              fail: [{ say: "The doorman steps in front of you. Behind him, two guests turn their heads in exactly the same way, at exactly the same moment. You go round by the kitchens instead, through steam and shouting, and get in, but the house knows you're here." }, { damage: { pool: "stability", amount: 3 } }, { objective: "po1" }, { goto: "gallery" }] } }] },
          { label: "Go in by the chimney with Tolly", if: "tolly_here", steps: [{ say: "Up the drainpipe, over the leads, and down a flue that's still cold. Tolly leads you out through a fireplace into a back room of the gallery." }, { objective: "po1" }, { goto: "gallery" }] },
          { label: "Show the doorman the ledger", hint: "Every name in it was invited", if: { arc: "ledger" }, once: true, steps: [{ say: "You read him his master's own order for 'the opening'. He doesn't understand it, but he understands that you have the book, and he steps aside." }, { objective: "po1" }, { goto: "gallery" }] },
          { label: "Visit the gasworks first", hint: "Find out what's going into the lamps", once: true, steps: [
            { check: { aspect: "iq", cr: "medium", label: "Find Ashgrove's order in the gas company's books",
              ok: [{ say: "A 'lamp improver', supplied by Ashgrove's, into the mains at nine tonight. You get the engineer to shut the valve. Half of London's lamps will burn yellow tonight. Half." }, { clue: "c_lamps" }, { set: "half_lamps" }],
              fail: [{ say: "By the time you find the right clerk, it's nine o'clock. Across the city, the lamps darken all at once." }, { clue: "c_lamps" }] } }] }] },
      gallery: { name: "The private view", theme: "interior", mood: "weird", cast: ["ashgrove"],
        onEnter: [{ once: "in", steps: [{ say: "Two hundred guests and two hundred black canvases. Nobody is talking. They stand in front of the paintings with their faces very close, breathing in time." }, { clue: "c_invite" }] }],
        options: [
          { label: "Confront Ashgrove", once: true, steps: [
            { talk: { npc: "ashgrove", text: "You can't stop an opening. The invitations have gone out. It's very rude not to come." } },
            { if: { arc: "kept_portrait" }, then: [
              { say: "You unwrap Lady Vere's portrait and hold it up. It's breathing hard now. Ashgrove sees it and something behind his face flinches, as if a hand let go of him for a second." },
              { talk: { npc: "ashgrove", text: "That one got away from it. It hates that one. Please. It's in the cellar. I can't go down there, and I can't stop going down there." } }, { set: "ash_turned" }] }] },
          { label: "Wake the guests", hint: "Turn them away from the paintings", once: true, steps: [
            { group: { aspect: "charisma", cr: "medium", label: "Break the spell on the room", intro: "Spill a drink, pull a fire bell, shout someone's name. Anything to make them look away.",
              ok: [{ say: "One by one the guests blink and step back from the canvases, rubbing their eyes and complaining about the gas." }, { set: "woken" }],
              fail: [{ say: "Some of them wake. Most of them don't, and the ones who don't turn to watch you go downstairs." }] } }] },
          { label: "Go down to the cellar", steps: [{ goto: "cellar" }] }] },
      cellar: { name: "The cellar under the gallery", theme: "cellar", mood: "boss", lighting: "shadow",
        onEnter: [{ say: "Candles, and a single canvas thirty feet wide that fills the end wall, black as a pit. It hums." }, { clue: "c_master" }],
        options: [
          { label: "Have Hale thin the black", hint: "He knows where it's weakest", if: "hale_here", once: true, steps: [
            { say: "Hale walks up to the canvas with turpentine and a rag as if it's any other painting. Where he works, the black runs, and behind it there's only linen. The humming falters." }, { set: "weakened" }] },
          { label: "Light the canvas with clean flame", hint: "A lamp the Saint never touched", if: "half_lamps", once: true, steps: [
            { say: "You carry in a lantern filled from a main you shut off yourself, and hold its plain yellow light to the black. The canvas smokes and shrinks from it." }, { set: "weakened" }] },
          { label: "Bring Ashgrove out of it", hint: "There's a man under the soot", if: "ash_turned", once: true, steps: [
            { check: { aspect: "faith", cr: "challenging", label: "Pull Ashgrove back to himself",
              ok: [{ say: "You hold him by the shoulders and say his name until he says it back. Then he's only a frightened man in grey gloves, and he runs for the stairs." }, { objective: "so1" }],
              fail: [{ say: "He looks at you, and for a moment you see the Saint looking out. He doesn't come with you." }] } }] },
          { label: "Destroy the master canvas", steps: [{ combat: "cellar", surpriseIf: "weakened", win: [
            { say: "The canvas splits from top to bottom, and there is nothing behind it but a cellar wall. Upstairs, two hundred people start talking at once." },
            { objective: "po2" },
            { if: "woken", then: [{ say: "The guests stream out into Great Russell Street, cross and confused and alive." }] },
            { if: { all: [{ arc: "kept_portrait" }, { arc: "children_saved" }, { arc: "hale_spared" }] }, then: [{ say: "Lady Vere's portrait, at last, stops breathing. When you unwrap it in the morning it's only a painting of a woman who's sitting up in bed in Chelsea, eating her breakfast. The cycle is closed." }] },
            { end: "win" }] }] },
          { label: "Back upstairs", steps: [{ goto: "gallery" }] }] }
    }
  };

  window.PACKS.define({
    format: "beyond-pack", id: "lamp-black", name: "The Lamp-Black Cycle", version: "1", author: "Gage Lee", builtIn: true,
    description: "A three-part arc for the WCA and OID, 1889 to 1891. A colourman sells a black that holds whatever it's painted over, and the soot he makes it from comes from somewhere it shouldn't.",
    cases: [part1, part2, part3],
    arcs: [{ id: "lamp-black", title: "The Lamp-Black Cycle", agencies: ["WCA", "OID"], villain: "Silas Ashgrove and the Soot-Saint", parts: [part1.id, part2.id, part3.id],
      summary: "Three cases, two years, one black pigment. What you keep and who you spare in one case changes the next." }]
  });
})();
