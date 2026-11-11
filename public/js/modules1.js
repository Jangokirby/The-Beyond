/* ============================================================================
   MODULE ONE — the author's own one-shot adventures, built as playable cases.
   Hunt for the Man-Eaters (OID, Ireland 910). Beyond Life, The Show Continues
   and Traitor follow in modules1b.js.
   They follow the structure of the book: a goal, primary objectives told up
   front, secondary objectives found by investigating (each with a real benefit),
   and more than one way to the end.
   ========================================================================== */
(function () {
  const A = window.ART, ADV = window.ADV;
  const F = (s, hc, h, o, x = "none", more = {}) => ({ skin: A.SKIN[s], hairC: A.HAIRC[hc], hair: h, outfit: A.OUTFIT[o], extra: x, bg: "#2b2f3a", ...more });
  const N = (name, tag, look, face) => ({ name, tag, look, face });

  const LOST = [{ say: "You lose the path. The fog thickens and you are back where you started, and it costs you." }, { choice: { prompt: "Each of you must choose: pay in body or in mind.", options: [
    { label: "Take 4 Health damage, each", steps: [{ damage: { pool: "health", amount: 4 } }] },
    { label: "Take 4 Sanity damage, each", steps: [{ damage: { pool: "sanity", amount: 4 } }] }] } }];

  ADV.register({
    id: "hunt-man-eaters", title: "Hunt for the Man-Eaters", setting: "Dunlaith, Ireland · 910", year: 910, level: [1, 9], agencies: ["OID"], region: "europe", theme: "village",
    summary: "Slaughter at the parish of St. McCarthy: bodies drained dry, the church left untouched, and a horn sounding from the barony to the east. OID's scouts are already in the hills.",
    objectives: [
      { id: "po1", kind: "primary", t: "Find the Man-Eaters' origin", done: "Underground ruins in the marsh, and a man in a golden mask who called them there: a member of the Order of the Golden Mask." },
      { id: "po2", kind: "primary", t: "Battle report: describe the fight and the tactics used", done: "The fight is written down for the Prior: what you did, and why." },
      { id: "po3", kind: "primary", t: "Save more than half the civilians", done: "More than half the barony still has a pulse and a roof." },
      { id: "so1", kind: "secondary", t: "Recognise what the creatures are", done: "Vampires. Everything the old stories say about them now applies.", benefit: { label: "Know your enemy", text: "You know what they are, and how they die: +2 to attack them.", combat: { attack: 2 } } },
      { id: "so2", kind: "secondary", t: "Save the baron", done: "Lord Danberth lives, and owes you.", benefit: { label: "The baron's debt", text: "Each agent may take two Spending Power of goods from the baron's storehouse and cellar. Spending Power returns to normal after this case." } },
      { id: "so3", kind: "secondary", t: "Decipher the Liber Expugnationis", done: "A rite for consecrating the dead. Read at the right moment, it stops them being called back.", benefit: { label: "The Book of Vanquishing", text: "One action reading a passage in the ruins stops the Golden Mask raising the dead again." } },
      { id: "so4", kind: "secondary", t: "Find the Man-Eater tracks", done: "Three-toed prints pressed into the gore, leading east.", benefit: { label: "A trail through the marsh", text: "A situational bonus on every roll to keep your course through the marsh.", bonus: { tags: ["marsh"], value: 2 } } }
    ],
    clues: {
      c_dry: { t: "The meat is dry", s: "House of Donald", x: "The severed hand still holding the sword is bloodless. Everything that was torn apart here has been drained first." },
      c_dark: { t: "They saw without light", s: "Sister Maeve", x: "No torches, no fires, no smoke. Whatever came in the dark could see perfectly well without any light." },
      c_church: { t: "The church was left alone", s: "The parish", x: "The church is untouched. Whatever did this feared it, or was not permitted to enter." },
      c_desc: { t: "Grey skin, long teeth, human in shape", s: "The villagers", x: "Grey skin, unnaturally long teeth, human in shape: seen only in the dark and the chaos." },
      c_book: { t: "The pastor's father's book", s: "Pastor Kennith", x: "He read from it all night and the creatures did not come in. It is called Liber Expugnationis." },
      c_horn: { t: "A horn from the east", s: "The church", x: "Lord Dunberth's barony is under attack, due east. The horn is still sounding." },
      c_gold: { t: "A man in a golden mask", s: "The ruins", x: "He called them. He says the dark is for his children, and that he can offer brotherhood, immortality and an end to suffering." }
    },
    npcs: {
      kennith: N("Pastor Kennith", "Pastor of St. McCarthy · hoarse from reading all night", "Grey and shaking, with a cracked voice and a book clutched to his chest as if it might leave.", F(1, 5, "bald", 5, "none", { sex: "m" })),
      baron: N("Lord Danberth", "Baron of Dunlaith · shaken", "A broad man in a stained surcoat, with a cut over one eye and the manners of someone who has just been rescued and does not know how to say it.", F(2, 4, "short", 6, "none", { sex: "m" })),
      rory: N("Brother Rory “Splittooth”", "OID veteran protector", "Weather-beaten, broad and muscled despite his age, with a grey-red beard and a split left canine he leans into. A leather duster over scrap mail and the pelt of something long dead.", F(1, 3, "short", 5, "none", { sex: "m" })),
      carlin: N("Brother Carlin", "OID healer", "Lanky and soft-voiced, in plain black robes with a cord of saint bones round his neck, and hands stained from mixing tinctures.", F(2, 1, "short", 5, "none", { sex: "m" })),
      maeve: N("Sister Maeve", "OID scout", "Lean and sharp-featured, pale braids and eyes black as ink, in a patchwork cloak of fur and canvas with a longbow nearly as tall as she is.", F(0, 6, "braids", 5, "none", { sex: "f" })),
      mask: N("The Golden Mask", "Member of the Order of the Golden Mask · once human", "A man in a golden mask, his hands dripping, standing very still among his children in the dark.", F(1, 0, "long", 5, "none", { sex: "m" }))
    },
    companions: {
      rory: { npc: "rory", attack: 4, build: { difficulty: "medium", mods: ["Tanky", "Thick Skin"], bonus: { health: 10 } }, nothing: "I've buried more good men than I've got bones left that don't ache. Keep behind me.",
        hints: [{ text: "Disgusting. A massacre. Look at the meat: a lot of it's dry. They took the blood. That's a familiar sight.", if: { clue: "c_dry" } }, { text: "Marsh is bad for the mind as well as the boots. If you've found where they walked, use it.", if: { clue: "c_horn" } }] },
      carlin: { npc: "carlin", attack: 3, build: { difficulty: "easy", mods: ["Aura of Healing"], bonus: { health: 5 } }, nothing: "Pain's a holy thing, if you let it be. Don't mistake silence for healing.",
        hints: [{ text: "They fear the church. It's untouched. I think there may be more answers inside.", if: { clue: "c_dark" } }] },
      maeve: { npc: "maeve", attack: 3, build: { difficulty: "easy", mods: ["Ranged"] }, nothing: "I wasn't raised for this, but I walk ahead anyway. I know how to listen.",
        hints: [{ text: "There ain't no light out here, no torches, no campfires, no smell of smoke. Whoever did this could see perfectly well in the dark.", if: { flag: "parish_seen" } }, { text: "That fog's pregnant with teeth.", if: { clue: "c_church" } }] }
    },
    enemies: {
      eater: { build: { name: "Man-Eater", type: "Undead", difficulty: "easy", sprite: "humanoid", hue: 120, dtype: "health", mods: ["Bloodthirsty", "Tanky"], core: { body: 3, mind: 2, spirit: 1 }, dies: "folds into the mud, grey and drained, and for a moment you think it is smiling" } },
      eaterb: { build: { name: "Man-Eater", type: "Undead", difficulty: "easy", sprite: "humanoid", hue: 120, dtype: "health", noFree: true, mods: ["Bloodthirsty", "Tanky"], core: { body: 3, mind: 2, spirit: 1 }, dies: "folds into the mud, and stays there" } },
      militia: { build: { name: "Town Militia", type: "Human", difficulty: "easy", sprite: "humanoid", hue: 30, dtype: "health", mods: ["Speech", "Quick Draw", "Leader"], core: { body: 2, mind: 1, spirit: 3 }, bonus: { health: -10 } } },
      mask: { build: { name: "Member of the Order of the Golden Mask", type: "Human", difficulty: "challenging", sprite: "humanoid", hue: 50, dtype: "stability", mods: ["Speech", "Occult", "Tanky"], core: { body: 3, mind: 1, spirit: 2 }, attack: 1, boss: false,
        text: "Cancerous Death: 5 Elemental damage to one agent. Cancerous Mutation: Humors Easy or roll a Mutation, once a round. Wave of Sickness: everyone in the room takes 3 Corrupted damage. ReSummon: raise one dead Man-Eater with 5 in each pool. Health is Immortal: only Sanity and Stability hurt him.", dies: "falls like a puppet, and the golden mask rings on the stone for a long time" } }
    },
    encounters: {
      barony: { name: "The barony under siege", theme: "village", fightText: "You cross the wheat to the smell of smoke. Guards lie dead at the gate. Pale, long-fingered creatures slash and bite, and some houses are already burning.",
        start: "3", zones: [
          { id: "1", name: "The north street", col: 0, row: 0 }, { id: "2", name: "The mud track", col: 1, row: 0 }, { id: "3", name: "The gate road", col: 0, row: 1 }, { id: "4", name: "The market cobbles", col: 1, row: 1 },
          { id: "5", name: "The baron's hall", col: 2, row: 1 }, { id: "6", name: "The dining hall", col: 3, row: 1 }, { id: "7", name: "The store and back door", col: 3, row: 2 }, { id: "8", name: "The kitchen", col: 2, row: 2 },
          { id: "9", name: "The library", col: 4, row: 1 }, { id: "10", name: "The lounge", col: 4, row: 2 }, { id: "11", name: "The stairwell and master bedroom", col: 4, row: 0 },
          { id: "12", name: "The farmer's house", col: 0, row: 2 }, { id: "13", name: "The unfinished house", col: 1, row: 2 }, { id: "14", name: "The burning house", col: 0, row: 3 }, { id: "15", name: "The hunter's cottage", col: 1, row: 3 }],
        edges: [["1", "2"], ["1", "3"], ["2", "4"], ["3", "4"], ["3", "12"], ["4", "13"], ["4", "5"], ["5", "6"], ["5", "8"], ["6", "7"], ["6", "9"], ["8", "7"], ["9", "10"], ["9", "11"], ["10", "11"], ["12", "13"], ["12", "14"], ["13", "15"], ["14", "15"]],
        foes: [{ t: "eater", zone: "1" }, { t: "eater", zone: "1", name: "Man-Eater (2)" }, { t: "eater", zone: "2" }, { t: "eater", zone: "2", name: "Man-Eater (2)" },
          { t: "eater", zone: "3" }, { t: "eater", zone: "3", name: "Man-Eater (2)" }, { t: "eater", zone: "3", name: "Man-Eater (3)" }, { t: "eater", zone: "3", name: "Man-Eater (4)" }, { t: "eater", zone: "3", name: "Man-Eater (5)" },
          { t: "eater", zone: "4" }, { t: "eater", zone: "4", name: "Man-Eater (2)" }, { t: "eater", zone: "4", name: "Man-Eater (3)" }, { t: "eater", zone: "4", name: "Man-Eater (4)" }, { t: "eater", zone: "4", name: "Man-Eater (5)" }],
        allies: [{ t: "militia", zone: "1", name: "Militia" }, { t: "militia", zone: "1", name: "Militia (2)" }, { t: "militia", zone: "1", name: "Militia (3)" }, { t: "militia", zone: "2", name: "Militia (4)" }, { t: "militia", zone: "2", name: "Militia (5)" }, { t: "militia", zone: "2", name: "Militia (6)" },
          { t: "militia", zone: "3", name: "Militia (7)" }, { t: "militia", zone: "4", name: "Militia (8)" }, { t: "militia", zone: "5", name: "Militia (9)", stay: true }, { t: "militia", zone: "7", name: "Militia (10)", stay: true }],
        civilians: { "5": 3, "9": 2, "11": 1, "12": 2, "13": 5, "14": 3, "15": 2 }, keyCivilian: "11", trapped: { zone: "14", rounds: 6, cr: "challenging" },
        fleeAt: { t: "eater", n: 3, text: "With the sun coming, the last Man-Eaters break and run for the marsh." } },
      ruins: { name: "The sunken ruins", theme: "cave", lit: false, severity: 2, fightText: "The man in the golden mask lowers his hands. Out of the black water, three of his children stand up.",
        start: "1", zones: [{ id: "1", name: "The flooded stair", col: 0, row: 0 }, { id: "2", name: "The collapsed hall", col: 1, row: 0 }, { id: "3", name: "The pillars", col: 2, row: 0 }, { id: "4", name: "The black water", col: 2, row: 1 }, { id: "5", name: "The low arch", col: 3, row: 1 }, { id: "6", name: "The sanctuary", col: 3, row: 0 }],
        edges: [["1", "2"], ["2", "3"], ["3", "4"], ["3", "6"], ["4", "5"], ["5", "6"]], foes: [{ t: "mask", zone: "6" }, { t: "eater", zone: "3" }, { t: "eater", zone: "4", name: "Man-Eater (2)" }, { t: "eater", zone: "5", name: "Man-Eater (3)" }] },
      ruinsb: { name: "The sunken ruins", theme: "cave", lit: false, severity: 2, fightText: "The man in the golden mask lowers his hands. Out of the black water, three of his children stand up. You hold the Book of Vanquishing, and they cannot get up again.",
        start: "1", zones: [{ id: "1", name: "The flooded stair", col: 0, row: 0 }, { id: "2", name: "The collapsed hall", col: 1, row: 0 }, { id: "3", name: "The pillars", col: 2, row: 0 }, { id: "4", name: "The black water", col: 2, row: 1 }, { id: "5", name: "The low arch", col: 3, row: 1 }, { id: "6", name: "The sanctuary", col: 3, row: 0 }],
        edges: [["1", "2"], ["2", "3"], ["3", "4"], ["3", "6"], ["4", "5"], ["5", "6"]], foes: [{ t: "mask", zone: "6" }, { t: "eaterb", zone: "3" }, { t: "eaterb", zone: "4", name: "Man-Eater (2)" }, { t: "eaterb", zone: "5", name: "Man-Eater (3)" }] }
    },
    start: "camp",
    scenes: {
      camp: { name: "The hills above Dunlaith", theme: "fog", mood: "tense", lighting: "shadow", weather: "wind",
        onEnter: [{ once: "in", steps: [
          { say: "The fog crept all round you, clinging to clothes and tents like ghosts grasping for a little of the living. Thankfully that wasn't true, and you would know the difference." },
          { say: "You were camped among the rolling hills, a perfect place to watch the locals. Then you heard it: screaming, the kind that chills blood. The church bell began to ring, over and over. The parish of St. McCarthy was under attack, and you would not make it before morning." },
          { say: "You gathered your things and set out, not with haste, but with purpose, to cleanse whatever filth might be waiting at sun up." }] }],
        options: [
          { label: "Take the order's scouts with you", hint: "Rory, Carlin and Maeve: local brothers and a sister, willing to help", once: true, steps: [
            { say: "Three of the Order's people from the hills come down to your fire without being asked: a broad veteran, a gentle healer and a scout with a bow nearly as tall as she is. They fall in behind you." },
            { join: "rory" }, { join: "carlin" }, { join: "maeve" }] },
          { label: "Go to the parish", steps: [{ goto: "parish" }] }] },
      parish: { name: "The parish of St. McCarthy", theme: "village", mood: "dread", lighting: "shadow", weather: "wind", cast: [],
        onEnter: [{ once: "in", steps: [
          { say: "It is already mid-day when you reach the parish. The damage is plain: gore strewn about the street, limbs discarded among the wreckage. Shattered doors and windows everywhere. Except the church, which looks untouched." },
          { say: "Livestock and property, aside from the houses of the people who lived here, are in perfect order. Whatever was here had a purpose with its grisly assault." },
          { set: "parish_seen" }] }],
        options: [
          { label: "House of Donald", hint: "A fight broke loose here", steps: [
            { once: "donald", steps: [
              { say: "The floor is covered in scratch marks. A sword, chipped and battered, is wedged in the wall, and the severed hand still gripping it says how this went." },
              { damage: { pool: "sanity", amount: 1 } },
              { say: "There is a bed, a bookshelf, a chest of clothes: the things a person needs to live. Not much else." }] },
            { check: { aspect: "iq", cr: "easy", label: "Examine the severed hand", investigate: true,
              ok: [{ say: "The hand is entirely devoid of blood. Not drained by a wound: emptied." }, { clue: "c_dry" }],
              fail: [{ say: "A hand. A bad one. You cannot bring yourself to look any closer." }] } }] },
          { label: "The last stand", hint: "Where the villagers tried to escape", steps: [
            { say: "You should not have come in here. This is where the people tried to get away: a last stand, a final panic. Everything is covered in what remains of those who didn't. Faces twisted in agony, guts like tangled cords of meat, a squishy floor of meat. There is flesh everywhere." },
            { choice: { prompt: "Everyone in here takes 5 Sanity damage, or 1 if they leave at first glance.", options: [
              { label: "Back out at once", steps: [{ damage: { pool: "sanity", amount: 1 } }, { say: "You step out, retching. The smell comes with you." }] },
              { label: "Stay and look", steps: [{ damage: { pool: "sanity", amount: 5 } },
                { check: { aspect: "awareness", cr: 8, label: "Look at the floor", investigate: true, tags: ["tracks"],
                  ok: [{ say: "There, pressed into the gore: strange three-toed footprints. They lead out through the back and east." }, { objective: "so4" }],
                  fail: [{ say: "All you see is the meat. If there was something else to see, the horror has taken it." }] } }] }] } }] },
          { label: "The farmer's house", steps: [{ say: "Several beds, farming tools set neatly against the wall. The house is untouched, but blankets and sheets are thrown about as if everyone left in a hurry. There is nothing else of significance." }, { set: "farm_seen" }] },
          { label: "The small bakery", steps: [{ once: "bakery", steps: [{ say: "The smell of stale bread greets you, a welcome change from outside. A small woodstove and a few personal things. Entirely ordinary. You find a loaf of good bread, and eat." }] }] },
          { label: "Enter the church", steps: [{ goto: "church" }] }] },
      church: { name: "The church of St. McCarthy", theme: "church", mood: "calm", lighting: "shadow", weather: "none", cast: ["kennith"],
        onEnter: [{ once: "in", steps: [
          { say: "The moment you enter, screaming greets you: villagers huddled around the pastor. Some are wounded, and if you have a healer with you he goes to them." },
          { talk: { npc: "kennith", text: "The Lord has delivered us! He has sent us a saviour! Tell me, my friends: are those horrid demons gone? Have you vanquished them?" } }] }],
        options: [
          { label: "Talk to Pastor Kennith", steps: [{ converse: { npc: "kennith", id: "main", limit: true,
            topics: [
              { ask: "Who are you, and who are these people?", lines: ["My name is Kennith. This is my parish and these are my flock. I am ever grateful, and I will offer whatever I can."] },
              { ask: "What did they look like?", lines: ["Wicked things. Grey skin, unnaturally long teeth, but human in nature. It was dark and hard to see, with all the chaos."], then: [{ clue: "c_desc" }] },
              { ask: "How did you stay safe?", lines: ["By God's grace, of course! I read passages from my father's old book all night. If you plan to go after those devils, take it with you!"], then: [{ clue: "c_book" }, { set: "book_known" }] },
              { ask: "Did any of the dead look odd to you?", cha: 7, lines: ["They were not bitten and they were not bled. They were opened and emptied. The Lord forgive me, I thought: these things are thirsty."] },
              { ask: "Where are they now?", free: true, lines: [{ say: "As you speak, the sound of a horn carries from the east." }, "That is the horn of Lord Dunberth's estate! There is a barony due east. Go, my children, with God's speed, and save those people from our fate before it is too late!"], then: [{ clue: "c_horn" }, { set: "horn" }] }],
            bye: ["God be with you."] } }] },
          { label: "Take the book and try to read it", if: "book_known", once: true, steps: [
            { say: "The cover reads Liber Expugnationis. If anyone knows Latin, it is the Book of Vanquishing." },
            { check: { aspect: "faith", cr: "medium", label: "Read its symbols", investigate: true,
              ok: [{ say: "The symbols are a rite for consecrating the dead: a few lines, read aloud, that bind a body so it cannot be called back up again. You mark the page." }, { objective: "so3" }],
              fail: [{ say: "The words swim. It is a prayer of some kind. You are not sure what for." }] } }] },
          { label: "Put together what you've seen", hint: "The meat is dry. They saw without light. The church was spared.", if: { all: [{ clue: "c_dry" }, { clue: "c_dark" }, { clue: "c_church" }] }, once: true, steps: [
            { check: { aspect: "ancient", cr: "medium", label: "Remember the old stories", investigate: true,
              ok: [{ say: "Bloodless corpses, sight in the dark, and a hatred of holy ground: it is an old story, and every part of it fits. These are vampires." }, { objective: "so1" }],
              fail: [{ say: "It nags at you: something in the old stories. It will not come." }] } }] },
          { label: "Check the church for what the villagers saw", once: true, steps: [{ clue: "c_church" }, { say: "Apart from the dead at the doors, nothing has been disturbed. The villagers' account is that the creatures stood in the road outside and would not come in." }] },
          { label: "Go east, toward the horn", if: "horn", steps: [{ goto: "barony" }] },
          { label: "Back to the street", steps: [{ goto: "parish" }] }] },
      barony: { name: "The barony of Dunlaith", theme: "village", mood: "boss", lighting: "shadow", weather: "wind",
        onEnter: [{ once: "in", steps: [{ say: "You cross fields of wheat and farmland to the smell of smoke and the sound of battle. The barony is under siege: guards lie dead at the gate, and the few who remain are locked in combat with strange pale creatures, the height of men, with long fingers and sharp fangs. They storm into homes. The sound of death follows. Some houses are already burning, in desperation. You must stop them." }] }],
        options: [
          { label: "Fight for the barony", hint: "You can start in zone 3 or 4 · 14 Man-Eaters, 10 militia, 18 civilians", steps: [
            { combat: "barony", win: [{ goto: "dawn" }] }] }] },
      dawn: { name: "The barony at dawn", theme: "village", mood: "calm", lighting: "shadow", weather: "none", cast: ["baron"],
        onEnter: [{ once: "in", steps: [
          { if: { ge: ["civSaved", 9] }, then: [{ objective: "po3" }, { say: "More than half the people of the barony are alive." }], else: [{ say: "Corpses litter the street. How did this happen? You train for this. You should have done better." }] },
          { if: { flag: "keyCivAlive" }, then: [{ objective: "so2" },
            { if: { ge: ["civSaved", 9] },
              then: [{ talk: { npc: "baron", text: "Thank you. God bless you, heroes. My storage is open to you, and my study. Rest, eat, drink: I am in your debt. I assume you mean to finish this and slay those beasts once and for all? I shall toast your honour this fine morning, and see your names remembered here for all time." } }],
              else: [{ talk: { npc: "baron", text: "Well. Hardly a barony without people. I don't mean to sound ungrateful: I am glad to be alive. But could you not have come sooner? Or fought harder? Either way, help is help. My place is free for you as long as you stay, and I'll donate what I can, assuming you are noble heroes out to destroy those creatures, and not just here at the right time." } }] }],
            else: [{ if: { ge: ["civSaved", 9] },
              then: [{ say: "Lord Danberth lies torn to shreds in his home, the barony without a baron. But the people are safe, and in your line of work, no matter the station someone holds, a life saved is a life saved." }],
              else: [{ say: "The baron is dead, and most of his people with him. All that's left is to find the source and stop them for good." }] }] }] }],
        options: [
          { label: "Search the baron's library for folklore", if: { not: { obj: "so1" } }, once: true, steps: [{ check: { aspect: "ancient", cr: "easy", label: "Find the books on folklore", investigate: true,
            ok: [{ say: "Among local authors and obscure foreign texts you find a bestiary. The description fits exactly: vampires." }, { objective: "so1" }], fail: [{ say: "Too many books, not enough light." }] } }] },
          { label: "Take what the baron offers", if: { obj: "so2" }, once: true, steps: [{ say: "From the storehouse and the cellar each of you takes what you need: two Spending Power's worth each, and good wine. It will not last beyond this case." }] },
          { label: "Follow the Man-Eaters into the marsh", steps: [{ goto: "marsh" }] }] },
      marsh: { name: "The marsh", theme: "fog", mood: "tense", lighting: "shadow", weather: "wind",
        onEnter: [{ once: "in", steps: [{ say: "The ground sucks at your boots, the air heavy with wet earth, fog distorting the distant shapes. Every step is difficult, and not just the terrain: your very mind fights you. Something about this place is not natural. The mud shifts and pulls, and the longer you stay, the more you feel yourself losing yourself to it." }] }],
        options: [
          { label: "Hold your course through the marsh", hint: "Three rolls in a row: Awareness, Mindfulness, then Durability or Willpower, Medium 10 each", steps: [
            { check: { aspect: "awareness", cr: "medium", label: "Find the path", tags: ["marsh"], who: "choose",
              ok: [{ check: { aspect: "mindfulness", cr: "medium", label: "Remember the path", tags: ["marsh"], who: "choose",
                ok: [{ check: { aspect: "durability", cr: "medium", label: "Find it in yourself to go on", tags: ["marsh"], who: "choose",
                  ok: [{ say: "You find the way through, and the ground firms under you." }, { goto: "cave" }],
                  fail: [...LOST] } }],
                fail: [...LOST] } }],
              fail: [...LOST] } }] }] },
      cave: { name: "The sunken cave", theme: "cave", mood: "dread", lighting: "dark", weather: "none", cast: ["mask"],
        onEnter: [{ once: "in", steps: [
          { say: "You approach the mouth of a sunken cave, slurping marsh water down into its depths. In what little light there is, you see a structure caked in mud and partly submerged in the cold, wet dark." },
          { say: "Peeling back the dark reveals ruins: some old forgotten place, mostly underwater and mud. Your boots struggle with every step, and you can hear things scuttling. At the far end stands a man in a golden mask, his hands dripping with blood. He stands beckoning." },
          { objective: "po1" }, { clue: "c_gold" },
          { talk: { npc: "mask", text: "Welcome to my sanctuary. It is dark, because my children appreciate a place away from the sun. I can grant you brotherhood. I can grant you immortality. I can grant you community. I can grant you a way to escape suffering. Would you accept?" } }] }],
        options: [
          { label: "Accept his offer", hint: "Everyone must accept. They are baptised in the Black Coffin.", steps: [
            { say: "He will baptise any agent who accepts in the Black Coffin, and give them the first Effect of the Order of the Golden Mask. If all of you accept, there will be no fight, and you may leave unharmed." },
            { say: "But the Man-Eaters will keep eating if left to their devices." },
            { check: { aspect: "charisma", cr: "challenging", label: "Convince them to abandon this place", who: "choose",
              ok: [{ say: "He listens, with his head on one side. Then he laughs, a dry thing, and agrees: his children will leave this county." }, { objective: "po3" }, { set: "accepted" }, { goto: "end" }],
              fail: [{ say: "He is amused. He will not abandon his sanctuary, and his children are hungry." }, { set: "accepted" }, { goto: "end" }] } }] },
          { label: "Refuse, and fight", steps: [
            { if: { obj: "so3" }, then: [{ say: "You open the Liber Expugnationis, and read a passage aloud over the water. Something in the black water stops reaching." }, { combat: "ruinsb", win: [{ goto: "end" }] }], else: [{ combat: "ruins", win: [{ goto: "end" }] }] }] }] },
      end: { name: "What you leave behind", theme: "village", mood: "calm", lighting: "shadow", weather: "none",
        onEnter: [{ once: "in", steps: [
          { say: "The Prior will want a battle report: what you did, and the tactics you used." }, { objective: "po2" },
          { if: { flag: "accepted" }, then: [{ say: "Some of you walk out into the daylight with a coffin's cold still in your bones, and something new that has no name. The Order will want to know." }, { end: "win" }],
            else: [{ say: "The ruins lie empty, purged of evil. A county is safe under your watch. The world is a slightly better place this day, and it is thanks to you. Remember those who fell today, or don't: whichever is better for the living's sanity. I am sure they would understand." }, { end: "win" }] }] }], options: [] }
    }
  });
})();
