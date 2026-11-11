/* ============================================================================
   MODULE ONE, continued: Beyond Life (WCA, Germany 1884) and The Show Continues
   (WCA, France 1901). Traitor is in modules1c.js.
   ========================================================================== */
(function () {
  const A = window.ART, ADV = window.ADV;
  const F = (s, hc, h, o, x = "none", more = {}) => ({ skin: A.SKIN[s], hairC: A.HAIRC[hc], hair: h, outfit: A.OUTFIT[o], extra: x, bg: "#2b2f3a", ...more });
  const N = (name, tag, look, face) => ({ name, tag, look, face });

  /* ======================================================================= Beyond Life */
  ADV.register({
    id: "beyond-life", title: "Beyond Life", setting: "Hannisburg, Germany · 1884", year: 1884, level: [1, 9], agencies: ["WCA"], region: "europe", theme: "snow",
    summary: "Winter training in a snowbound town where, in a year, ninety-four people have killed themselves or gone mad. Mr. Wells's dossier asks three things: find what is behind it, assess the after-effects, and decide whether it should be destroyed or contained.",
    objectives: [
      { id: "po1", kind: "primary", t: "Origin: find what is behind the disturbance", done: "A thirty-five-foot golden giant under the town, bleeding black ooze from the feet that settlers chipped at in 1788." },
      { id: "po2", kind: "primary", t: "Post side effects: assess what it leaves behind", done: "Golden nails. Pulled every two months they come back; left alone, the gold spreads up the arms until the victim is a statue." },
      { id: "po3", kind: "primary", t: "Beyond involvement: destroy or contain", done: "Containment, because the gold cannot be destroyed, and breaking it would only spread the sickness. The mine is sealed." },
      { id: "so1", kind: "secondary", t: "Golden Thread: find the factory's secret", done: "Marcel Fischer weaves the statue's gold into his clothing line.", benefit: { label: "Proof in your hand", text: "A bonus when you confront Marcel about the mine.", bonus: { tags: ["marcel"], value: 2 } } },
      { id: "so2", kind: "secondary", t: "Golden corpses: see what the gold does to the dead", done: "Corpses filled with coins that cannot be destroyed. The gold is not natural, and the statue has to be shut away.", benefit: { label: "Understanding the gold", text: "You know there is only one answer: trap the statue. Rolls to seal or contain it are easier.", bonus: { tags: ["seal"], value: 2 } } },
      { id: "so3", kind: "secondary", t: "Holy acid: bless Lukas's acid", done: "Lukas's acid, said over, melts what steel cannot.", benefit: { label: "Holy acid", text: "A bonus when fighting the Gold Gluttons.", combat: { enemy: "glutton", attack: 2 } } }
    ],
    clues: {
      c_dossier: { t: "Mr. Wells's dossier", s: "The train", x: "Increased suicides and violent hysteria in Hannisburg. Investigate the origin, assess the post-event side effects, and decide whether the responsible entity should be destroyed or contained." },
      c_1788: { t: "A gold rush that wasn't", s: "Johann Schneider", x: "The town was founded in 1788 in a gold rush. The settlers didn't find ore: they found a giant statue and began chipping its feet. The Order sealed the cavern and called it a mining accident." },
      c_thread: { t: "The golden thread", s: "The apartment · the factory", x: "The men who threw themselves from the railing wore clothes made from the golden thread from Fischer's factory. They gnawed their own shirts." },
      c_nails: { t: "Golden nails", s: "Hannah Weber · Lukas", x: "Everyone who wore the cloth has golden nails. Pulled every two months, the gold grows back; leave them and it spreads up the arms until you are a statue." },
      c_corpses: { t: "Bodies filled with coins", s: "The cemetery · the apartment", x: "The dead are bloated with golden coins, and the coins cannot be destroyed. The gold cannot be burned, melted or broken. Destruction would only spread it." },
      c_key: { t: "Marcel found the mine", s: "The factory", x: "In 1872, drunk, Marcel Fischer wandered into the sealed cavern and came out two days later with gold in his pockets. He has the key to the mine." },
      c_acid: { t: "Lukas's holy acid", s: "The smithy", x: "A big container of acid, made with prayers, that melts the gold from the Gluttons." }
    },
    npcs: {
      johann: N("Johann Schneider", "Train attendant · from Hannisburg", "Gaunt and sickly, with short brown hair and a nervous demeanour. He worked his way onto the train to get away from the town.", F(0, 4, "short", 6, "none", { sex: "m" })),
      juliette: N("Juliette Girard", "French journalist", "Charming, quick, and always one step closer than you'd like. Her notebook is never quite closed.", F(0, 5, "bob", 2, "hat", { sex: "f" })),
      marcel: N("Marcel Fischer", "Textile manufacturer · secretly bankrupt", "Well-dressed, confident and over-friendly, with a gold watch chain too heavy for a man in his position.", F(1, 3, "parted", 7, "none", { sex: "m" })),
      hannah: N("Hannah Weber", "Acting mayor", "Capable and no-nonsense, in plain neat clothes. She spends little on herself and everything she can on the town.", F(0, 4, "bun", 2, "none", { sex: "f" })),
      lukas: N("Lukas", "Priest and smith · a former agent of the OID", "A big man in a blacksmith's apron over a priest's collar, the smell of hot metal in his hair, and a look that says he has seen this before.", F(1, 5, "short", 3, "none", { sex: "m" })),
      jean: N("Jean Coeur", "Owner of Le Coeur Enchanté", "An excited man in a white apron, eager to please and quite certain he has told you all of this before.", F(0, 3, "slicked", 2, "none", { sex: "m" }))
    },
    enemies: {
      glutton: { build: { name: "Gold Glutton", type: "Undead", difficulty: "challenging", sprite: "humanoid", hue: 45, dtype: "sanity", mods: ["Blind Sight"], core: { body: 3, mind: 2, spirit: 1 },
        text: "Gold Rot: whoever it hurts is Gold Touched: 1 Sanity a day, and whispers.", dies: "slumps and spills; the coins go on rolling long after" } },
      madman: { build: { name: "Golden-thread man", type: "Human", difficulty: "easy", sprite: "humanoid", hue: 45, dtype: "health", mods: ["Speech"], core: { body: 2, mind: 1, spirit: 1 }, dies: "sits down, gnawing his shirt, and is quiet" } }
    },
    encounters: {
      railing: { name: "The fifth floor", theme: "interior", fightText: "One of the men has had enough of being told to leave. They come at you along the railing, laughing, chewing their shirts.", zones: [{ id: "a", name: "The stairs", col: 0, row: 0 }, { id: "b", name: "The landing", col: 1, row: 0 }, { id: "c", name: "The railing", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "madman", zone: "b" }, { t: "madman", zone: "c", name: "Golden-thread man (2)" }, { t: "madman", zone: "c", name: "Golden-thread man (3)" }] },
      assembly: { name: "The Town Assembly", theme: "interior", fightText: "The doors burst open. A dead man in a dead man's coat is walking across the floor, and with every step, coins fall out of him.", zones: [{ id: "a", name: "The doors", col: 0, row: 0 }, { id: "b", name: "The council table", col: 1, row: 0 }, { id: "c", name: "The chairs", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "b", foes: [{ t: "glutton", zone: "a" }] },
      mine: { name: "The mine under the town", theme: "cave", lit: false, fightText: "The feet of the statue are weeping black. Two things swollen with gold stand up out of the dark, their bellies split open and spilling coins.", zones: [{ id: "a", name: "The first corridor", col: 0, row: 0 }, { id: "b", name: "The sunken streets", col: 1, row: 0 }, { id: "c", name: "The foot of the giant", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "glutton", zone: "b" }, { t: "glutton", zone: "c", name: "Gold Glutton (2)" }] }
    },
    start: "train",
    scenes: {
      train: { name: "The train to Hannisburg", theme: "train", mood: "calm", lighting: "glow", weather: "train", cast: ["johann", "juliette", "marcel"],
        onEnter: [{ once: "in", steps: [
          { say: "All of you are travelling by train to Hannisburg, Germany, for winter training: to acclimatise you to terrain, cultures and weather. Mr. Wells has given each agent a dossier." },
          { say: "\"Reports of increased suicides and violent hysteria have come from the town of Hannisburg. Agents are to investigate the origin of the disturbance, assess post-event side effects, and determine if the responsible entity should be destroyed or contained.\"" },
          { clue: "c_dossier" },
          { say: "Snow outside, and the cold seems to come through the thick metal walls. The first-class cabin is warm and cosy. You have about twelve hours." }] }],
        options: [
          { label: "Talk to Johann, the attendant", hint: "A native of Hannisburg who left", steps: [{ converse: { npc: "johann", id: "main", limit: true,
            open: ["Another glass of something, sir? Madam?"],
            topics: [
              { ask: "You're from Hannisburg?", lines: ["I was. I left. I don't go back, not even to change trains."] },
              { ask: "What's wrong with the town?", lines: ["It's cursed. That's what they say. They've been saying it since the gold, and the gold wasn't even gold."], then: [{ set: "gold_hint" }] },
              { ask: "Tell me about the gold", cha: 8, lines: ["The settlers in 1788: they came for a gold rush. What they found underground was a statue. A man, thirty-five feet high, in gold. They chipped at his feet, and it bled, black, and the ones who took the gold went mad.", "The Order came and sealed it. Mining accident, they said. Everyone in town was told. Nobody forgot."], then: [{ clue: "c_1788" }] },
              { ask: "What happened to your family?", cha: 12, lines: [{ say: "His hands stop on the tray." }, "They were among the first. It was before the factory, before the thread. So it wasn't only the thread. I think it was always in the ground."] }],
            bye: ["I'll be in the next car."] } }] },
          { label: "Talk to Juliette Girard", hint: "French journalist, curious about the same town", steps: [{ converse: { npc: "juliette", id: "main", approach: true,
            open: ["Bonjour. I thought you were going to Hannisburg. So am I. What a coincidence."],
            topics: [
              { ask: "What do you know about Hannisburg?", lines: ["Ninety-four dead or mad in a year, and nothing in the papers. Isn't that strange? Someone has been very careful."] },
              { ask: "What are you hoping to find?", lines: ["A story. And, if I'm lucky, the people who keep it out of the papers. They are an organisation, no? You carry yourselves like one."], then: [{ set: "juliette_suspects" }] },
              { ask: "Stay out of our way", lines: ["Naturally.", { say: "She smiles. She does not mean it." }], then: [{ set: "juliette_follows" }] }],
            bye: ["Au revoir, for now."] } }] },
          { label: "Talk to Marcel Fischer", hint: "A well-dressed German businessman offering to show you round", steps: [{ converse: { npc: "marcel", id: "main", approach: true,
            open: ["Ah, you're for Hannisburg too? Allow me. I know everybody there. I employ half of them."],
            topics: [
              { ask: "What's your business?", lines: ["Textiles. Golden Thread, it's called: our own. Wear the legacy of our golden past! It was our slogan. It was doing so well."] },
              { ask: "Can you take us round the town?", lines: ["Of course. Any time. Anything you need."], then: [{ set: "marcel_guide" }] },
              { ask: "Why do you say 'was'?", cha: 10, lines: [{ say: "His smile falters, only for a moment." }, "The town's had a hard year. You'll see."], then: [{ set: "marcel_nervous" }] }],
            bye: ["I'll find you when we arrive."] } }] },
          { label: "Keep an eye out for anyone watching you", if: "juliette_follows", once: true, steps: [
            { check: { aspect: "awareness", cr: "medium", label: "Spot your tail", investigate: true,
              ok: [{ say: "Between cars, a moment too late: a glimpse of a blue coat turning away. She is not subtle, but she is persistent." }, { set: "juliette_spotted" }],
              fail: [{ say: "Nothing. Perhaps she isn't following. Perhaps she's good." }] } }] },
          { label: "Arrive in Hannisburg", steps: [{ goto: "station" }] }] },
      station: { name: "Hannisburg station", theme: "village", mood: "calm", lighting: "glow", weather: "wind", cast: ["hannah"],
        onEnter: [{ once: "in", steps: [
          { say: "The train pulls into a snow-covered station. The air is crisp and still, and the town seems almost abandoned. The station is in surprisingly good repair compared with the rest, where most buildings are run down. Across the street a group of men argue loudly before one storms into a large brick building." },
          { talk: { npc: "hannah", text: "Welcome to Hannisburg. I am Hannah Weber, acting mayor. I understand you're here to help us with our... issues. Please follow me. I will do my best to assist you." } }] }],
        options: [
          { label: "Talk to Hannah Weber", steps: [{ converse: { npc: "hannah", id: "main", limit: true,
            topics: [
              { ask: "What's been happening?", lines: ["A year ago a worker at the textile factory fell ill, with a fever, and whispers that wanted meat. Since then, ninety-four people have killed themselves or lost their minds. The town is dying."] },
              { ask: "Where should we start?", lines: ["The apartment block. It's where most of it happened, and everyone thinks it's haunted. After that, the guest house is ready for you."] },
              { ask: "Is there anything the sick have in common?", cha: 8, lines: [{ say: "She hesitates, as if she hasn't let herself say it." }, "Their nails. The first worker's nails had gone yellow. Hard. Metal. I thought it was a symptom. I pulled them myself and they grew back."], then: [{ clue: "c_nails" }] },
              { ask: "Who runs the factory?", lines: ["Marcel Fischer. Though lately it's been quiet. He's been away a good deal."] }],
            bye: ["The guest house is yours. Come back to me whenever you need."] } }] },
          { label: "Go to the guest house", hint: "Warm, with black curtains and coffee", steps: [{ goto: "town" }] }] },
      town: { name: "Hannisburg", theme: "village", mood: "dread", lighting: "glow", weather: "wind",
        onEnter: [{ once: "in", steps: [{ say: "The guest house is a stark contrast to the rest of the town: warm, clean beds and an inviting pot of coffee. Black curtains keep prying eyes out. It will be your base while you work." }] }],
        options: [
          { label: "The haunted apartment block", hint: "Where most of the deaths happened", steps: [{ goto: "apartment" }] },
          { label: "The cemetery", steps: [{ goto: "cemetery" }] },
          { label: "The smithy and church", steps: [{ goto: "smithy" }] },
          { label: "The textile factory", steps: [{ goto: "factory" }] },
          { label: "Marcel Fischer's office", if: { any: [{ clue: "c_thread" }, "marcel_guide"] }, steps: [{ goto: "marcel" }] },
          { label: "Le Coeur Enchanté, the café", steps: [{ goto: "cafe" }] },
          { label: "The Town Assembly", steps: [{ goto: "assembly" }] },
          { label: "The mine", if: "mine_open", steps: [{ goto: "mine" }] }] },
      apartment: { name: "The haunted apartment block", theme: "interior", mood: "dread", lighting: "shadow", weather: "none",
        onEnter: [{ once: "in", steps: [
          { say: "A dilapidated, freezing building. Bloodstains mark the stairs, and the building is heavy with recent tragedies. A man reeking of alcohol stumbles out of a ground-floor flat, shoves past you, and collapses in the street." }] }],
        options: [
          { label: "Examine the man in the street", once: true, steps: [{ say: "Nico Keller is dead. In his pocket, a wallet with his name, and the keys to his flat." }, { check: { aspect: "awareness", cr: "medium", label: "Look closer", investigate: true,
            ok: [{ say: "Under his coat, between the buttons: a glint. His chest is hard, and heavy, and full of gold coins." }, { clue: "c_corpses" }, { objective: "so2" }, { set: "nico_found" }],
            fail: [{ say: "He is simply dead. You note it, and move on." }, { set: "nico_found" }] } }] },
          { label: "Search Nico Keller's flat", if: "nico_found", once: true, steps: [{ say: "A trashed mess. Tally marks are scratched into every wall, hundreds of them, in groups of five." }, { damage: { pool: "sanity", amount: 1 } }, { check: { aspect: "iq", cr: "easy", label: "What are the marks counting?", investigate: true,
            ok: [{ say: "Days. Nothing but days. He counted them from the day he first put on a golden shirt, and when he got to the end of his wall, he started over." }, { clue: "c_thread" }], fail: [{ say: "A madman's tally." }] } }] },
          { label: "Go up to the fifth floor", steps: [{ say: "On the fifth floor a group of men dance recklessly along the railing, chanting: \"To break the curse ya break ya neck, the golden bed is one ya make, lay in it now and eat ya golden cake.\"" },
            { say: "As one is pushed over the edge, a noose rips his head off, spilling gold coins across the floor. The rest laugh hysterically; one gnaws his shirt. All of them wear clothes made from Marcel's cursed golden thread." },
            { clue: "c_thread" }, { clue: "c_corpses" }, { objective: "so2" },
            { choice: { prompt: "Ask them to leave, or try them: they will tell you to go to hell, and if you press, they will attack.", options: [
              { label: "Back away; leave them be", steps: [{ say: "You go down the stairs while the chanting goes on above." }] },
              { label: "Press them", steps: [{ combat: "railing", win: [{ say: "The last one sits, gnawing at the thread, and goes still. What is left of his shirt glints." }] }] }] } }] },
          { label: "Take Nico Keller's body to Lukas to be dealt with", if: { all: ["nico_found", "lukas_met"] }, once: true, steps: [{ say: "You carry the weight to the smithy. It is far heavier than a man should be. Lukas takes it from you without a word." }, { set: "corpse_handled" }] },
          { label: "Go back to the guest house", steps: [{ goto: "town" }] }] },
      cemetery: { name: "The cemetery", theme: "village", mood: "dread", lighting: "glow", weather: "wind", cast: ["lukas"],
        onEnter: [{ once: "in", steps: [{ say: "Snow blankets the cemetery, quiet except for a priest working near a grave. He is pouring a strange liquid into a pipe that leads down into the ground, and the air is thick with the metallic smell of melted gold." }, { set: "lukas_met" }] }],
        options: [
          { label: "Examine the graves", once: true, steps: [{ check: { aspect: "awareness", cr: "easy", label: "Look at the disturbed earth", investigate: true,
            ok: [{ say: "Where the earth has settled, a coin has pushed through, and another: the dead are bloated with gold. It does not burn, or melt, or break." }, { clue: "c_corpses" }, { objective: "so2" }],
            fail: [{ say: "Graves. Fresh ones. Too many." }] } }] },
          { label: "Talk to the priest", steps: [{ goto: "smithy" }] },
          { label: "Back to the town", steps: [{ goto: "town" }] }] },
      smithy: { name: "The smithy and church", theme: "church", mood: "calm", lighting: "shadow", weather: "fire", cast: ["lukas"],
        onEnter: [{ once: "in", steps: [{ say: "The smithy doubles as the church: the pews pushed aside to make room for tools and weapons. Lukas tends the forge. He looks at your agency badge a long time." }, { set: "lukas_met" }] }],
        options: [
          { label: "Show Lukas your credentials", hint: "He used to be OID", once: true, steps: [
            { check: { aspect: "charisma", cr: "medium", label: "Convince him you are what you say", who: "choose",
              ok: [{ set: "lukas_open" }, { say: "He puts down the hammer. \"Wells's people. Good. Then I don't have to explain what the Order forgot.\"" }],
              fail: [{ say: "He is not convinced, but he is not unkind either. Come back when you have something to show." }, { unset: "never" }] } }] },
          { label: "Talk to Lukas", if: "lukas_open", steps: [{ converse: { npc: "lukas", id: "main", limit: true,
            topics: [
              { ask: "What is this?", lines: ["A statue. A man, thirty-five feet, gold. It's the source. I was one of the three who sealed it in '88 when I was young. I should have taken it apart. We couldn't. You can't."], then: [{ clue: "c_corpses" }] },
              { ask: "Why do the dead fill with gold?", lines: ["It wants flesh. It sends the gold into the people who wear it, and the gold keeps what it has. The nails first. Then the arms."], then: [{ clue: "c_nails" }, { objective: "po2" }] },
              { ask: "Can it be destroyed?", lines: ["No. And if you break it, the sickness goes everywhere the gold goes. It must be shut away."], then: [{ objective: "so2" }] },
              { ask: "Is there anything that works against what it makes?", lines: ["Acid. Holy acid, made with prayers, and the prayers matter. I've made a vat. Take a flask."], then: [{ clue: "c_acid" }, { set: "acid_given" }] },
              { ask: "How can we seal the mine?", free: true, lines: ["I have charges, and the knowledge to use them. A cave-in. Or you can think of something yourselves."], then: [{ set: "charges_known" }] }],
            bye: ["I'll be here. I'm always here."] } }] },
          { label: "Study the holy acid", if: "acid_given", once: true, steps: [{ check: { aspect: "faith", cr: "medium", label: "Say the prayers over the acid", who: "choose",
            ok: [{ say: "You say the words Lukas taught you over the flask. The liquid darkens and clears, and when a drop touches a gold coin on the bench, the coin smokes." }, { objective: "so3" }],
            fail: [{ say: "The acid is acid. Whatever else it was, you have not found it." }] } }] },
          { label: "Back to the town", steps: [{ goto: "town" }] }] },
      factory: { name: "The textile factory", theme: "interior", mood: "dread", lighting: "shadow", weather: "none",
        onEnter: [{ once: "in", steps: [{ say: "A long brick building with its machines stilled. It has been quiet for months, but one corner of the cutting room is still lit: bolt after bolt of cloth, sewn with a thread that glints." }] }],
        options: [
          { label: "Examine the bolts of Golden Thread", once: true, steps: [{ check: { aspect: "iq", cr: "medium", label: "Study the thread", investigate: true,
            ok: [{ say: "It is real gold, drawn fine, woven into every thread. It has been used in every shirt, scarf and coat they have made since 1872. There is no way this much gold came out of a bank." }, { clue: "c_thread" }, { objective: "so1" }],
            fail: [{ say: "Thread. Expensive thread." }, { clue: "c_thread" }] } }] },
          { label: "Look through the office files", once: true, steps: [{ check: { aspect: "iq", cr: "easy", label: "Find the right ledger", investigate: true,
            ok: [{ say: "There is a note in the margin of 1872: Cavern. Keys. M.F. In his own hand. And a second key hangs on a hook, with a tag: Mine." }, { clue: "c_key" }, { set: "marcel_exposed" }],
            fail: [{ say: "Orders, invoices, bills. You can see he is bankrupt." }] } }] },
          { label: "Talk to the workers who are left", once: true, steps: [{ say: "A few of the workers stand about the cutting room. They keep their hands in their pockets. When one takes his out, you see all ten nails glinting yellow." }, { clue: "c_nails" }, { objective: "po2" }] },
          { label: "Back to the town", steps: [{ goto: "town" }] }] },
      marcel: { name: "Marcel Fischer's office", theme: "interior", mood: "tense", lighting: "shadow", weather: "none", cast: ["marcel"],
        onEnter: [{ once: "in", steps: [{ say: "Marcel receives you in his office with the door open, a drink already poured. It is the only room in Hannisburg that smells of cologne." }] }],
        options: [
          { label: "Confront Marcel about the mine", hint: "He has the key", steps: [{ check: { aspect: "charisma", cr: "challenging", label: "Make him hand over the key", who: "choose", tags: ["marcel"],
            ok: [{ say: "He sags. He puts the key on the desk. \"I only wanted my factory back. I'll never wear the stuff myself. You must believe me.\"" }, { set: "mine_open" }, { set: "marcel_key" }, { objective: "po1" }],
            fail: [{ say: "\"I don't know what you mean. A mine? In Hannisburg?\" He smiles, and you know he'll deny it again." }] } }] },
          { label: "Take the key from the factory", if: "marcel_exposed", once: true, steps: [{ say: "You take the key from its hook. He will know it is gone." }, { set: "mine_open" }] },
          { label: "Arrest or report Marcel, and leave it to the Association", if: { flag: "mine_open" }, once: true, steps: [{ say: "He lowers his head. The agency will send someone to collect him." }, { set: "marcel_taken" }] },
          { label: "Back to the town", steps: [{ goto: "town" }] }] },
      cafe: { name: "Le Coeur Enchanté", theme: "interior", mood: "calm", lighting: "glow", weather: "none", cast: ["jean"],
        onEnter: [{ once: "in", steps: [{ say: "A small French café that stands out among the dreary streets. The smell of coffee is inviting, but the café is empty. Jean Coeur jumps to his feet as you come in, thrilled." }] }],
        options: [
          { label: "Talk to Jean", steps: [{ converse: { npc: "jean", id: "main",
            topics: [
              { ask: "What do people say about the town?", lines: ["That it's cursed, that the apartment is haunted, that the factory is quiet. They always say the same three things, and I add a fourth for flavour: that the cursed gold was once a king's."] },
              { ask: "Is any of that true?", lines: ["Some of it. I never know which part."], then: [{ read: { cr: 16, lying: true, ok: [{ say: "He means no harm. He just wants you to sit, and order the pie." }] } }] }],
            bye: ["Do come again!"] } }] },
          { label: "Back to the town", steps: [{ goto: "town" }] }] },
      assembly: { name: "The Town Assembly", theme: "interior", mood: "tense", lighting: "shadow", weather: "none",
        onEnter: [{ once: "in", steps: [
          { say: "Only ten of twenty-five councillors have come. The discussion ranges from infrastructure and trade to ice-cream flavours and sock designs. The town's leaders are crumbling along with its economy." },
          { if: { not: "corpse_handled" }, then: [{ say: "The doors burst open." }, { combat: "assembly", win: [{ say: "The Glutton comes apart on the council floor, and the coins roll in every direction. Councillors scramble for the doors." }] }], else: [{ say: "No one is dead on the floor, and no one is walking in." }] }] }],
        options: [{ label: "Back to the town", steps: [{ goto: "town" }] }] },
      mine: { name: "The gold mine", theme: "cave", mood: "boss", lighting: "shadow", weather: "none",
        onEnter: [{ once: "in", steps: [
          { say: "Sealed by a heavy lock, the mine runs down a labyrinth of stone corridors to an underground city, long abandoned and overshadowed by a towering golden statue at its centre. Its feet are damaged, and black ooze seeps from the wounds into pools around its base. Touching the ooze costs 5 Sanity and 5 Stability." },
          { objective: "po1" }] }],
        options: [
          { label: "Go forward, into the cavern", if: { not: "mine_clear" }, steps: [{ combat: "mine", win: [{ say: "The Gluttons are down, spilling coins. The statue continues to ooze every three rounds. It cannot be destroyed, and the sickness will go on unless the mine is sealed." }, { set: "mine_clear" }] }] },
          { label: "Seal the mine with Lukas's charges", if: { all: ["mine_clear", "charges_known"] }, once: true, steps: [{ check: { aspect: "iq", cr: "medium", label: "Set the charges", tags: ["seal"], who: "choose",
            ok: [{ say: "The charges go off, one after another, bringing the roof down over the sunken streets." }, { set: "sealed" }],
            fail: [{ say: "Some of the charges fire. Not all. The roof comes down on a part of the cavern, and you have to go in again." }, { damage: { pool: "health", amount: 3 } }] } }] },
          { label: "Seal the mine with your own ingenuity", if: "mine_clear", once: true, steps: [{ choice: { prompt: "How do you shut away a thing that cannot be broken?", options: [
            { label: "Flood the cavern from the old stream", steps: [{ check: { aspect: "awareness", cr: "challenging", label: "Find where the stream was diverted", tags: ["seal"], who: "choose",
              ok: [{ say: "You find the sluice. The stream goes where it used to go, and the water comes up black around the giant's feet and does not stop." }, { set: "sealed" }],
              fail: [{ say: "You cannot find where the stream was turned away." }] } }] },
            { label: "Seal the corridor with iron from the smithy", steps: [{ check: { aspect: "durability", cr: "medium", label: "Hang the iron door", tags: ["seal"], who: "choose",
              ok: [{ say: "A door of Lukas's iron, set in the stone, and the keyhole stuffed with lead." }, { set: "sealed" }],
              fail: [{ say: "The door will not hang. Not yet." }] } }] }] } }] },
          { label: "Leave the mine", steps: [{ goto: "town" }] },
          { label: "Close the book on Hannisburg", if: "sealed", steps: [{ objective: "po3" }, { goto: "end" }] }] },
      end: { name: "Hannisburg, in the spring", theme: "village", mood: "calm", lighting: "glow", weather: "none",
        onEnter: [{ once: "in", steps: [
          { say: "With the statue buried deep beneath the earth once more, you feel the weight of the curse begin to lift. But Hannisburg will need more than a sealed cave to recover. As agents of the WCA, this is only your first test. There will always be more mysteries and curses in the shadows, and winter in Germany has only just begun." },
          { if: { flag: "marcel_taken" }, then: [{ say: "Marcel Fischer is taken to a quiet room in Berlin and asked a great many questions." }], else: [{ say: "Marcel Fischer is gone by morning, with whatever he could carry. The Association will find him, if it chooses to." }] },
          { say: "Everyone who touched the gold or wore the thread has golden nails, and if they are not pulled every two months, the gold will spread. Mr. Wells has put it in your file." },
          { end: "win" }] }], options: [] }
    }
  });

  /* ======================================================================= The Show Continues */
  ADV.register({
    id: "show-continues", title: "The Show Continues", setting: "Paris, France · 1901", year: 1901, level: [1, 9], agencies: ["WCA"], region: "europe", theme: "interior",
    summary: "A puppeteer at the Opéra Montclair vanished a month ago, came back two weeks later, and has performed nightly ever since. Attendance has doubled. Three stagehands are missing, and one usher says he has not spoken a word to anyone since.",
    objectives: [
      { id: "po1", kind: "primary", t: "Locate Nicolas Renard", done: "Beneath the stage: a clean skeleton with black threads at its wrists and jaw, posed to smile." },
      { id: "po2", kind: "primary", t: "Find how the Beyond Entity works", done: "Soul strings, sewn through the seats and the rigging: the audience is the engine, and the puppets are what it makes." },
      { id: "po3", kind: "primary", t: "Destroy or contain La Marionnette des Âmes", done: "The strings are cut, and what wore Nicolas Renard is gone." },
      { id: "so1", kind: "secondary", t: "The Mask of Applause", done: "A porcelain mask with black threads in the eye holes: the performer's own.", benefit: { label: "The Mask of Applause", text: "Wearing the mask, no puppet will harm you. But it wants you: Willpower CR 15 to take it off, and the longer you wear it, the more of you becomes wood.", flag: "mask_known" } },
      { id: "so2", kind: "secondary", t: "The Soul Threads", done: "Thin black fibres like dried veins, in the stage rigging: soul strings. Puppets animated by them are weak to Stability damage.", benefit: { label: "A weakness in the strings", text: "You know their weakness: Stability damage. A bonus when fighting the puppets.", combat: { attack: 2 } } }
    ],
    clues: {
      c_playbill: { t: "Nicolas Renard, Master of Strings", s: "Mr. Wells", x: "A puppeteer at the Opéra Montclair disappeared a month ago. Two weeks later he returned and began performing nightly. Attendance doubled; the reviews praise the realism of his puppets. Three stagehands have gone missing." },
      c_usher: { t: "He hasn't spoken", s: "The usher", x: "Renard hasn't spoken to anyone since he came back. He is always already in the theatre in the morning. Nobody has seen him arrive or leave." },
      c_scratches: { t: "Scratches on the stage", s: "The Grand Stage", x: "Long scratch marks run across the stage boards, as if fingernails were dragged through wood." },
      c_seats: { t: "Threads sewn into the seats", s: "The Audience Hall", x: "Thin black threads sewn into the cushions: a drain, to draw soul energy from the spectators during the performances." },
      c_ledger: { t: "Nicolas's address", s: "Under the stage", x: "In a ledger among the crates: Nicolas Renard's home address." },
      c_slack: { t: "The strings hung slack", s: "The performance", x: "For a moment the strings above the puppet hung slack. The puppet went on moving anyway." },
      c_bones: { t: "Renard's skeleton", s: "Under the stage", x: "Clean bones, no flesh at all. Black threads tied at the wrists and jaw. The skull is posed to smile." }
    },
    npcs: {
      wells: N("Mr. Wells", "Of the Wells & Constantine Association", "A tidy, grey man at a corner table with his back to the wall, and a pile of folded playbills in front of him.", F(0, 5, "parted", 7, "none", { sex: "m" })),
      usher: N("Étienne", "Usher at the Opéra Montclair", "A thin young man in a red jacket a size too big, who has stopped looking at the stage.", F(0, 3, "short", 7, "none", { sex: "m" })),
      director: N("Madame Valcourt", "Director of the Opéra Montclair", "Straight-backed and brisk, with a fan she doesn't use, and a very good smile that has begun to take effort.", F(0, 5, "bun", 5, "none", { sex: "f" }))
    },
    enemies: {
      small: { build: { name: "Small Marionette", type: "Construct", difficulty: "easy", sprite: "construct", hue: 20, dtype: "health", mods: ["Thick Skin"], core: { body: 2, mind: 1, spirit: 1 }, bonus: { health: -15 }, dies: "clatters in pieces across the boards, strings trailing" } },
      puppet: { build: { name: "La Marionnette des Âmes", type: "Beyond", difficulty: "dangerous", sprite: "construct", hue: 340, dtype: "health", mods: ["Speech", "Thick Skin"], core: { body: 4, mind: 3, spirit: 3 },
        text: "Soul Strings: a new Small Marionette each round. Body Puppet: 1 Sanity to all present. String Control: Willpower CR 10 or lose an action. Splinter Strike: 6 damage. Harvest Soul: gains 10 Stability when an agent falls.", dies: "Strings snap one by one. The fleshless body folds. Across the room, dozens of puppets drop from their hooks." } }
    },
    encounters: {
      stage: { name: "The Grand Stage", theme: "interior", fightText: "Three small marionettes drop from the rigging on their strings, and land on their feet.", zones: [{ id: "a", name: "The stalls", col: 0, row: 0 }, { id: "b", name: "The stage", col: 1, row: 0 }, { id: "c", name: "The flies", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "small", zone: "b" }, { t: "small", zone: "b", name: "Small Marionette (2)" }, { t: "small", zone: "c", name: "Small Marionette (3)" }] },
      workshop: { name: "The basement workshop", theme: "cellar", fightText: "At the centre of the room hangs a tall marionette frame. Something rises behind the desk, a patchwork of skin stretched across the room, barely able to fit.", zones: [{ id: "a", name: "The stairs", col: 0, row: 0 }, { id: "b", name: "The tables", col: 1, row: 0 }, { id: "c", name: "The frame", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "puppet", zone: "c" }, { t: "small", zone: "b" }, { t: "small", zone: "b", name: "Small Marionette (2)" }] }
    },
    start: "cafe",
    scenes: {
      cafe: { name: "Café du Sillage", theme: "interior", mood: "calm", lighting: "glow", weather: "none", cast: ["wells"],
        onEnter: [{ once: "in", steps: [
          { say: "The Café du Sillage is busy with the sound of cups and conversation. Small round tables fill the room, and a narrow bar runs along the far wall. Mr. Wells sits alone near the back beside a tall window. On the table in front of him are several folded playbills. Each advertises the same show: Nicolas Renard, Master of Strings." },
          { talk: { npc: "wells", text: "Good, you've arrived." }, },
          { clue: "c_playbill" },
          { talk: { npc: "wells", text: "A puppeteer at the Opéra Montclair disappeared a month ago. His name was Nicolas Renard. Two weeks later he returned and began performing nightly. Attendance doubled. Reviews praised the realism of his puppets. Three stagehands have gone missing. One usher claims Renard hasn't spoken to anyone since his return. Look into it." } }] }],
        options: [{ label: "Go to the Opéra Montclair", steps: [{ goto: "lobby" }] }] },
      lobby: { name: "The Opéra Montclair", theme: "interior", mood: "tense", lighting: "glow", weather: "none", cast: ["usher", "director"],
        onEnter: [{ once: "in", steps: [{ say: "The opera house stands four stories tall, with carved stone pillars framing the entrance. Painted posters cover the walls: puppet performances. The front doors are unlocked. Inside is a wide marble lobby with a red carpet leading toward the theatre, and glass chandeliers overhead." }] }],
        options: [
          { label: "Talk to the usher", steps: [{ converse: { npc: "usher", id: "main", limit: true,
            topics: [
              { ask: "What do you make of Renard?", lines: ["He hasn't spoken a word to anyone since he came back, monsieur. Not one. And he is here before any of us in the morning, and I never see him arrive."], then: [{ clue: "c_usher" }] },
              { ask: "Who has gone missing?", lines: ["Three stagehands: Marc, Paul and young Théo. All of them were working the rigging. People say they've gone to Marseille. I do not think they've gone to Marseille."] },
              { ask: "What changed about the show?", cha: 8, lines: ["The puppets. They don't look like puppets any more. And the audience, it's not that they clap. It's that after, they all go out very quietly, and they sleep for a day."] },
              { ask: "Can we see the performance?", free: true, lines: ["Tonight's, monsieur. Madame Valcourt will find you seats."] }],
            bye: ["I'll be at the door."] } }] },
          { label: "Watch tonight's performance", steps: [{ goto: "performance" }] }] },
      performance: { name: "The performance", theme: "interior", mood: "weird", lighting: "shadow", weather: "none",
        onEnter: [{ once: "in", steps: [
          { say: "The theatre lights dim until only the small puppet stage at the centre remains lit. Red velvet curtains part slowly. A single marionette lowers from above on thin strings: a black performer's coat with long tails, polished shoes, a painted face like a pale stage actor, thin brows, narrow lips. It resembles Nicolas, in a way. It bows to the audience." },
          { say: "Soft violin music begins. The marionette steps forward and dances. A small door in the stage floor opens and three smaller puppets climb up beside it: one carries a tiny violin, another spins in place, the third leaps and tumbles across the boards." },
          { say: "At one point the marionette turns toward the audience. For a moment the strings above it hang slack. The puppet continues moving anyway." },
          { clue: "c_slack" },
          { say: "The music slows. The smaller puppets kneel, and the larger one raises its arms and bows deeply. The curtain falls. Applause fills the theatre." }] }],
        options: [{ label: "Explore the opera house", steps: [{ goto: "house" }] }] },
      house: { name: "The Opéra Montclair", theme: "interior", mood: "dread", lighting: "shadow", weather: "none",
        onEnter: [{ once: "in", steps: [{ say: "After the show you are free to look around. Several puppets move on their own, and will interfere if you give them time." }] }],
        options: [
          { label: "The Grand Stage", steps: [{ goto: "stage" }] },
          { label: "Nicolas's dressing room", steps: [{ goto: "dressing" }] },
          { label: "The Audience Hall", steps: [{ goto: "hall" }] },
          { label: "Beneath the stage", steps: [{ goto: "under" }] },
          { label: "The back corridor and the trap room", steps: [{ goto: "trap" }] },
          { label: "Go to Nicolas Renard's house", if: { clue: "c_ledger" }, steps: [{ goto: "renard" }] }] },
      stage: { name: "The Grand Stage", theme: "interior", mood: "tense", lighting: "shadow", weather: "none",
        onEnter: [{ once: "in", steps: [{ say: "The stage is framed by thick red curtains hanging from iron rods. Rows of wooden seats face the puppet stage, which is built of painted wood and tall enough to hide a performer behind it. Thin ropes and counterweights hang from the ceiling. The stage floor is scratched in several places." }] }],
        options: [
          { label: "Examine the stage floor", once: true, steps: [{ check: { aspect: "awareness", cr: "medium", label: "Study the scratches", investigate: true,
            ok: [{ say: "Long scratch marks run across the boards, as if fingernails were dragged through the wood." }, { clue: "c_scratches" }],
            fail: [{ say: "Scratches. A stage is always scratched." }] } }] },
          { label: "Examine the rigging", hint: "Something hangs there that isn't rope", if: { not: "rigging_clear" }, steps: [{ say: "While you study the stage, three small marionettes fall from the rigging, and attack." },
            { combat: "stage", win: [{ set: "rigging_clear" }, { say: "Overhead, in the stage rigging, you find what they were hung from: thin black threads, not rope, not cloth. They look like dried veins." }] }] },
          { label: "Study the black threads in the rigging", if: { all: ["rigging_clear", { not: { obj: "so2" } }] }, steps: [
            { check: { aspect: "ancient", cr: "medium", label: "Recognise what they are", investigate: true,
              ok: [{ say: "Soul strings. The puppet animates its puppets with them. Whatever is strung on them is weak to Stability damage." }, { objective: "so2" }, { objective: "po2" }],
              fail: [{ say: "Black fibre. It crawls with a faint warmth. You cannot say what it is." }] } }] },
          { label: "Back to the house", steps: [{ goto: "house" }] }] },
      dressing: { name: "Nicolas's dressing room", theme: "interior", mood: "weird", lighting: "shadow", weather: "none",
        onEnter: [{ once: "in", steps: [{ say: "The dressing room is narrow, with a long mirror along one wall. A table beneath it is covered with brushes, grease paint and folded cloth costumes. Several puppets hang from hooks on the wall. Each is shaped like a person, and all of them have blank wooden faces." }] }],
        options: [
          { label: "Examine the porcelain mask", once: true, steps: [{ say: "The porcelain performance mask sits on the table. Inside it, in the eye holes, are thin black threads, set into the porcelain." }, { objective: "so1" }] },
          { label: "Put the mask on", if: { obj: "so1" }, once: true, hint: "No puppet will harm you while you wear it", steps: [
            { say: "The mask beckons in a whirlwind of black thread, offering you to the great orchestrator for a better life. Far away, enormous hands are pulling strings." },
            { set: "masked" },
            { check: { aspect: "willpower", cr: 15, label: "Take the mask off", who: "choose",
              ok: [{ say: "You wrench it off. Your face aches as if it had been somewhere else." }, { unset: "masked" }],
              fail: [{ say: "It will not come off. A little of you goes wooden, and you may try again after each change." }] } }] },
          { label: "Look at the blank-faced puppets", once: true, steps: [{ say: "All of them are the same height. All of them are your size." }, { damage: { pool: "sanity", amount: 1 } }] },
          { label: "Back to the house", steps: [{ goto: "house" }] }] },
      hall: { name: "The Audience Hall", theme: "interior", mood: "dread", lighting: "shadow", weather: "none",
        onEnter: [{ once: "in", steps: [{ say: "Rows of velvet seats fill the hall. Programmes are scattered across the floor, and several seats have been cut open, stuffing spilling onto the carpet." }] }],
        options: [
          { label: "Examine the cut seats", once: true, steps: [{ check: { aspect: "iq", cr: 12, label: "Work out what the threads are for", investigate: true,
            ok: [{ say: "Thin black threads sewn into the cushions: a drain, to draw soul energy from the spectators while they sit and applaud." }, { clue: "c_seats" }, { objective: "po2" }],
            fail: [{ say: "Threads, sewn into the seats. You cannot say what they are for." }, { clue: "c_seats" }] } }] },
          { label: "Back to the house", steps: [{ goto: "house" }] }] },
      under: { name: "Beneath the stage", theme: "cellar", mood: "dread", lighting: "dark", weather: "none",
        onEnter: [{ once: "in", steps: [
          { say: "A narrow staircase leads beneath the stage. The space is crowded with wooden supports, pulleys and coiled rope, and the smell of rot grows stronger as you go deeper. Behind several stacked crates lies a human skeleton. The bones are clean, with no flesh at all. Black threads are tied around the wrists and the jaw. The skull is posed so that the mouth seems to smile." },
          { say: "This is Nicolas Renard." }, { damage: { pool: "sanity", amount: 2 } }, { clue: "c_bones" }, { objective: "po1" }] }],
        options: [
          { label: "Search the crates", once: true, steps: [{ say: "Among the crates there is a ledger, and in it Nicolas's home address." }, { clue: "c_ledger" }] },
          { label: "Back to the house", steps: [{ goto: "house" }] }] },
      trap: { name: "The back corridor and the trap room", theme: "cellar", mood: "dread", lighting: "shadow", weather: "none",
        onEnter: [{ once: "in", steps: [{ say: "A dim corridor runs behind the stage to a trap room under the boards, with a door in the ceiling that opens on to the stage floor." }] }],
        options: [
          { label: "Search the trap room", once: true, steps: [{ check: { aspect: "awareness", cr: "medium", label: "Look through the trap room", investigate: true,
            ok: [{ say: "Three stagehands' coats hang on hooks, buttoned, with nothing in them but black thread. Marc, Paul and Théo. The strings go up through the trap, to the stage." }, { damage: { pool: "sanity", amount: 2 } }],
            fail: [{ say: "Props, costumes, dust." }] } }] },
          { label: "Back to the house", steps: [{ goto: "house" }] }] },
      renard: { name: "Nicolas Renard's house", theme: "interior", mood: "dread", lighting: "shadow", weather: "none",
        onEnter: [{ once: "in", steps: [
          { say: "The house sits along a narrow street lined with brick buildings. Every window is lit by candlelight. Inside the front room are wooden worktables covered with carving tools, and hundreds of puppets hang from hooks across the walls: some small enough to hold in one hand, others the size of a human body." },
          { say: "Their feet dangle inches above the floor." }] }],
        options: [
          { label: "The upper floor", once: true, steps: [{ say: "Shelves of puppet limbs, arranged by size: arms, legs, hands. Several half-finished puppets lie on tables with their wooden ribs open." }, { damage: { pool: "sanity", amount: 1 } }] },
          { label: "Search the workshop", once: true, steps: [{ check: { aspect: "iq", cr: "medium", label: "Search the worktables", investigate: true,
            ok: [{ say: "Under the carving tools, a notebook, in Renard's hand: sketches of a puppet that looks like him, and a sentence over and over: it learns what it is by being watched." }, { set: "notebook" }],
            fail: [{ say: "Carving tools, glue, sawdust." }] } }] },
          { label: "Go down to the basement", steps: [{ goto: "basement" }] },
          { label: "Back to the opera", steps: [{ goto: "house" }] }] },
      basement: { name: "The basement workshop", theme: "cellar", mood: "boss", lighting: "shadow", weather: "none",
        onEnter: [{ once: "in", steps: [{ say: "At the centre of the room stands a tall marionette frame, suspended from the ceiling beams. Something moves behind the desk. A figure rises slowly from the chair: a patchwork of skin, stretching across the room, barely able to fit. Thin strings run from its spine and shoulders up into the beams. Its head tilts as it turns." }] }],
        options: [
          { label: "Cut the strings and contain it", hint: "Needs what you learned about the strings", if: { all: [{ any: [{ obj: "so2" }, "notebook"] }, { not: "contain_tried" }] }, steps: [
            { set: "contain_tried" },
            { check: { aspect: "occult", cr: "challenging", label: "Find the master string and cut it", who: "choose",
              ok: [{ say: "You find the one string that does not run to a puppet, and cut it. The body sags, held up only by the frame. You pack the frame in salt, and iron, and take it away." }, { objective: "po3" }, { set: "contained" }, { goto: "end" }],
              fail: [{ say: "The master string moves under your knife. It has noticed you." }, { combat: "workshop", win: [{ objective: "po3" }, { goto: "end" }] }] } }] },
          { label: "Fight it", steps: [{ combat: "workshop", win: [{ objective: "po3" }, { goto: "end" }] }] }] },
      end: { name: "After the final curtain", theme: "interior", mood: "calm", lighting: "shadow", weather: "none",
        onEnter: [{ once: "in", steps: [
          { if: { flag: "contained" }, then: [{ say: "The frame is packed in a crate lined with salt and iron, and Mr. Wells has a vault to put it in. It will never perform again, but you know it has not stopped watching." }],
            else: [{ say: "The strings holding the body snap, one by one. The fleshless corpse collapses to the floor. Across the room, dozens of puppets drop from their hooks. None of them move again." }] },
          { if: { flag: "masked" }, then: [{ say: "Some of you still carry the faint weight of a mask you took off a long time ago." }] },
          { end: "win" }] }], options: [] }
    }
  });
})();
