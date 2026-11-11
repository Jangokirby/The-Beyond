/* ============================================================================
   CAMPAIGN UPGRADES: brings the nine parts of the three arcs (Lamp-Black,
   The Pilgrim Road, Dead Air) up to the Death of a Bloodline floor without
   losing what they already carry forward. Loaded after the packs; each part
   gains a place to investigate, a person worth interviewing (Charisma-limited
   with extra topics), more clues, a secondary objective that pays off, a
   named way to solve it for each existing option, an enemy with its own rules,
   and endings that depend on how it went.
   ========================================================================== */
(function () {
  const ADV = window.ADV, K = window.CASEKIT, F = K.face, N = K.person;
  const L = (id) => ADV.LIBRARY[id];
  const opt = (id, scene, lab) => { const o = L(id).scenes[scene].options.find((x) => x.label.startsWith(lab)); if (!o) throw new Error(`${id}: no option "${lab}" in ${scene}`); return o; };
  const res = (id, scene, lab, flag) => opt(id, scene, lab).steps.unshift({ set: flag });
  const bonus = (id, oid, benefit) => { const o = L(id).objectives.find((x) => x.id === oid); if (!o) throw new Error(id + " " + oid); o.benefit = benefit; };
  const text = (id, enemy, t) => { L(id).enemies[enemy].build.text = t; };
  const hook = (id, scene, option) => { const os = L(id).scenes[scene].options; os.splice(Math.max(0, os.length - 1), 0, option); };
  const tier = (id, steps) => {
    let n = 0;
    (function walk(x) { if (Array.isArray(x)) { const i = x.findIndex((s) => s && s.end === "win"); if (i >= 0) { x.splice(i, 0, ...steps); n++; return; } x.forEach(walk); } else if (x && typeof x === "object") Object.values(x).forEach(walk); })(L(id).scenes);
    if (!n) throw new Error(id + ": no end to tier");
  };
  const add = (id, p) => { const a = L(id); Object.assign(a.clues, p.clues || {}); Object.assign(a.npcs, p.npcs || {}); for (const o of p.obj || []) a.objectives.push(o); Object.assign(a.scenes, p.scenes || {}); };
  const back = (to, label) => K.go(label || "Back", to);

  /* ======================================================================= LAMP-BLACK I */
  if (L("lb-1-portraits")) {
    const id = "lb-1-portraits";
    add(id, {
      clues: {
        c_shop: { t: "Lamp-Black No. 9", s: "Ashgrove's of Southwark", x: "A black sold at Ashgrove's of Southwark in a plain tin, at ten times the price of any other. Eleven customers have bought it since the winter. Edmund Hale is the first on the list." },
        c_soot: { t: "The soot is not from a lamp", s: "The shop-boy", x: "The soot in the tins is not lamp soot, and not coal. It is warm when it arrives, and it smells of a house that has been shut up a long time." },
        c_dates: { t: "They all sat in October", s: "Hale's sitters", x: "Every sitter who is wasting sat for Hale in the same month, in the same room, wearing the same black coat, and each coat was lent by the painter from a rail he does not remember buying." }
      },
      obj: [{ id: "so2", kind: "secondary", t: "Learn how Hale mixes the black into the paint", done: "Hale grinds Lamp-Black No. 9 into the shadow of every portrait, last, by the light of a single candle, because it 'wants to be looked at'.", benefit: { label: "How the black is laid", text: "You know where to scrape: a bonus on every roll to undo a portrait.", bonus: { tags: ["scrape"], value: 2 } } }],
      npcs: { pym: N("Mr. Pym", "Clerk at Ashgrove's, Southwark", "Thin, stooped and inky, with a clerk's soft hands and the look of a man who has not been allowed to leave the counter in a long while.", F(0, 5, "short", 5, "none", { sex: "m" })) },
      scenes: {
        southwark: { name: "Ashgrove's of Southwark", theme: "interior", mood: "weird", lighting: "shadow", weather: "none", cast: ["pym"],
          onEnter: [{ once: "in", steps: [{ say: "A narrow shop in a narrow street, its window full of coloured powders in glass jars: ochre, ultramarine, vermilion, and one shelf, at the back, of plain black tins. A clerk with an ink-black cuff is arranging them very carefully, one finger pressed to each lid." }] }],
          options: [
            K.ask("pym", [
              K.t("Who buys the black?", ["Painters. Eleven since the winter. Mr. Hale was the first, and he buys it by the pound. It is Lamp-Black No. 9. It is not sold across the counter. You must be introduced."], { free: true, clue: "c_shop", obj: "so1" }),
              K.t("Where does it come from?", "Our principal supplies it. Mr. Ashgrove. He grinds it himself. I have never been allowed to see the room.", { free: true, set: "ashgrove_named" }),
              K.t("Why is it warm?", [{ say: "His hand drifts to a tin, and away." }, "It comes in the morning, from the back. It's always warm. And I have never been told what it burns."], { cha: 7, clue: "c_soot" }),
              K.t("Do you sleep well, Mr. Pym?", "I dream I'm being painted. It is only a dream.", { cha: 10, set: "pym_dream" })
            ], { label: "Talk to Mr. Pym", name: "Mr. Pym", bye: ["Do come again, if you are introduced."] }),
            K.find("Read the order book", "iq", "easy", "Eleven orders for Lamp-Black No. 9 since the winter: Hale, a Royal Academician, two sculptors, a society photographer, six society ladies. Against each, in a careful clerk's hand, the date of the sitting that followed.", "A great many orders for blues.", { clue: ["c_shop", "c_dates"], hint: "Easy" }),
            K.find("Smell the tin", "awareness", "medium", "The black inside is warm, and smells of something you cannot place: not coal, not lamp-oil. It smells like a room where someone has been sitting for a very long time, waiting to be asked in.", "A tin of black.", { clue: "c_soot", hint: "Awareness, Medium", failDamage: ["sanity", 2] }),
            K.find("Watch how the black is ground, from the back room door", "willpower", "medium", "Through a gap in the back door you see Ashgrove at a stone slab with a muller, grinding. As he works, the grey in his gloves gets darker, and the black on the slab gets a little brighter, like a pupil.", "He is too careful. You cannot see.", { clue: "c_soot", hint: "Willpower, Medium", tags: ["scrape"], failDamage: ["sanity", 2] }),
            back("surgery", "Back to the surgery")] }
      }
    });
    hook(id, "surgery", K.go("Visit Ashgrove's of Southwark", "southwark", { hint: "The colourman Hale buys his black from", if: { clue: "c_black" } }));
    bonus(id, "so1", { label: "A name for the wall", text: "You have Ashgrove's name. A bonus on every roll against a thing painted with his black.", bonus: { tags: ["pigment"], value: 2 } });
    text(id, "sitter", "Hale's black wants to be looked at. Watch: each round it asks one agent to look at it. Willpower Medium or lose your next action and 3 Sanity. It cannot hurt anyone who looks only at the frame.");
    res(id, "gallery", "Scrape the black", "res_scrape"); res(id, "gallery", "Burn them", "res_burn");
    tier(id, [{ if: { flag: "res_scrape" }, then: [{ say: "You scraped the black from every canvas, and the sitters woke, hungry and ashamed. The paintings were only paintings after that. Ashgrove's tins were seized, and there were eleven fewer in the world." }] }, { if: { flag: "res_burn" }, then: [{ say: "You burned every canvas. The sitters woke, and the smoke over Chelsea was black for a day. Hale stood at the window and watched, and wept." }] }, { if: { obj: "so1" }, then: [{ say: "You have a name now: Silas Ashgrove, colourman." }] }, { if: { obj: "so2" }, then: [{ say: "Hale's way of laying the black goes into the Association's notes, in a box marked: do not teach." }] }]);
  }

  /* ======================================================================= LAMP-BLACK II */
  if (L("lb-2-flues")) {
    const id = "lb-2-flues";
    add(id, {
      clues: {
        c_minutes: { t: "The guardians' minutes", s: "The workhouse", x: "The Ancoats workhouse guardians' minutes record eleven deaths a month, with every body 'sent to the works'. For the rendering works' boiler, the entry says: fuel supplied." },
        c_canal: { t: "The canal runs black", s: "The canal", x: "The canal below the works runs black, and the black does not wash off. Barge-folk have started to wrap their hands." },
        c_warmth: { t: "The soot comes down warm", s: "The sweeps", x: "Every sweep in Ancoats says the soot from Ashgrove's chimney is warm when it lands, and each year warmer. They say it is not soot that is landing: it is something coming down." }
      },
      obj: [{ id: "so2", kind: "secondary", t: "Learn the sweep masters' old rule for a bad flue", done: "Old sweeps tie a wet rag over the mouth and sing, because soot that is listened to stays soot.", benefit: { label: "Sing, and stay soot", text: "A bonus on every roll to endure the flues.", bonus: { tags: ["flue"], value: 3 } } }],
      npcs: { oakes: N("Master Oakes", "Sweep master of Ancoats", "A short, grim, bow-legged man in a soot-grey coat with a brush over his shoulder, who has lost three boys this winter and says each name when he lights his pipe.", F(0, 5, "short", 3, "hat", { sex: "m" })) },
      scenes: {
        canal: { name: "The canal at Ancoats", theme: "fog", mood: "dread", lighting: "shadow", weather: "rain", cast: ["oakes"],
          onEnter: [{ once: "in", steps: [{ say: "A black canal under a yellow sky, lined with mills whose chimneys all lean the same way. A short, grim man with a brush over his shoulder stands on the towpath with three boys' names on his lips." }] }],
          options: [
            K.ask("oakes", [
              K.t("How many boys have you lost?", ["Three of mine. Eleven, in all, in the district. We send them up in the morning. By evening there's less of them."], { free: true, clue: "c_boys" }),
              K.t("What is wrong with the works' flues?", "They're not flues. They go in too far. A boy goes up and doesn't come out on the other side. And the soot, you must feel it, it's warm.", { free: true, clue: "c_warmth" }),
              K.t("How do you keep a boy safe in a flue?", [{ say: "He takes off his pipe." }, "A wet rag over the mouth, and he sings. The old rule. Soot that's listened to stays soot. It's only when they stop singing that it takes them."], { cha: 7, obj: "so2", set: "sing_rule" }),
              K.t("What do you think is in there?", "The dead. Dozens. I'd not want to say it in front of the boys.", { cha: 11 })
            ], { label: "Talk to Master Oakes", name: "Master Oakes", bye: ["Mind the black."] }),
            K.find("Wash a hand in the canal", "awareness", "easy", "The canal water is black, and the black does not wash off. When you rub it, it feels like cloth. When you rub harder, you can feel, faintly, a warmth beneath it, like something breathing.", "Canal water. Cold.", { clue: "c_canal", hint: "Easy" }),
            K.find("Read the workhouse guardians' ledger", "iq", "medium", "Eleven deaths a month, and eleven bodies sent 'to the works.' No funerals, no burial grounds. The works has taken the workhouse's dead for a year, as fuel.", "The ledger is a great mess of numbers.", { clue: "c_minutes", hint: "Intelligence, Medium" }),
            K.find("Ask the barge-folk about the black", "charisma", "easy", "A bargee, wrapping his hands in rags, says the black came on the water a month after the works opened, and has not washed off since. 'You can hear it,' he says. 'Under the keel. Like someone saying their name, very quietly, again and again.'", "They won't talk to a stranger.", { clue: "c_canal", hint: "Charisma, Easy" }),
            back("hennessy", "Back to Mother Hennessy's")] }
      }
    });
    hook(id, "hennessy", K.go("Walk down to the canal, and find a sweep master", "canal", { hint: "Master Oakes has lost three boys" }));
    bonus(id, "so1", { label: "Six boys, alive", text: "The boys come with you. A bonus on every roll in the flues, and Tolly will go ahead of you.", bonus: { tags: ["flue"], value: 2 } });
    text(id, "saint", "The soot of the workhouse's dead, in a saint's shape. Soot-fall: each round everyone in the room takes 2 Sanity and breathes black: Durability Medium or lose the next action. It cannot stand a clean flame. Only Stability harms it.");
    res(id, "furnace", "Bank the furnaces", "res_bank"); res(id, "furnace", "Break the great flue", "res_flue");
    tier(id, [{ if: { flag: "res_bank" }, then: [{ say: "You banked the furnaces. The works is cold, and the soot has stopped falling. The workhouse will have to bury its dead again, the long way." }] }, { if: { flag: "res_flue" }, then: [{ say: "You broke the great flue, and a hundred years of soot came down on Ancoats in a single black afternoon. The canal ran black for a week and then, at last, ran clear." }] }, { if: { obj: "so1" }, then: [{ say: "Six boys came down the ladders alive." }], else: [{ say: "Some of the boys never came down. Master Oakes says their names, every night, with his pipe." }] }, { if: { obj: "so2" }, then: [{ say: "The sweeps of Ancoats sing in the flues now, and the old rule is cut over the door of the guild." }] }]);
  }

  /* ======================================================================= LAMP-BLACK III */
  if (L("lb-3-opening")) {
    const id = "lb-3-opening";
    add(id, {
      clues: {
        c_orders: { t: "Every lamp in the district", s: "The gasworks", x: "The Bloomsbury gas company has been supplying a new grade of coal-gas for two months, special order, 'from the gallery', to every lamp within half a mile of Great Russell Street. The gas burns a little blacker." },
        c_hale: { t: "Hale remembers Ashgrove's face", s: "Edmund Hale", x: "Hale has painted nothing but Ashgrove's face for two years, and knows where the black is thin: around the eyes, where he painted it first." },
        c_keys: { t: "The invitation is a key", s: "The invitation", x: "The printed invitation is in the black. Anyone who touches it and enters the gallery is, as of the doorway, a sitter." },
        c_cellar: { t: "A master canvas in the cellar", s: "The gasworks foreman", x: "The gas main under the gallery has been tapped into the cellar. The coal-gas that lights every lamp in Bloomsbury comes from a single burner, under a single canvas." }
      },
      obj: [{ id: "so2", kind: "secondary", t: "Cut the gas to the lamps", done: "A turn of the main valve at the gasworks, and Bloomsbury goes dark for a night, and the Saint cannot look out of the lamps.", benefit: { label: "A dark street", text: "The Saint cannot look through the lamps. A bonus on every roll to resist it.", bonus: { tags: ["lamps"], value: 3 } } }],
      npcs: { foreman: N("Mr. Gaunt", "Foreman, Bloomsbury gasworks", "A square, soot-black man with a pocket-watch on a chain and the manner of someone who has been told exactly what not to ask.", F(0, 5, "short", 3, "hat", { sex: "m" })) },
      scenes: {
        gasworks: { name: "The Bloomsbury gasworks", theme: "interior", mood: "tense", lighting: "shadow", weather: "fire", cast: ["foreman"],
          onEnter: [{ once: "in", steps: [{ say: "A gasholder like a drum in a yard of coke and coal, the smell of tar. A square man with a pocket-watch counts valves as you come in." }] }],
          options: [
            K.ask("foreman", [
              K.t("What gas are you sending to the gallery?", ["A special grade. Ordered by the gallery, two months ago. Better burn, they said. It's blacker. I'd say 'dirtier', but they pay double."], { free: true, clue: "c_orders" }),
              K.t("Where does it go?", "Every lamp in a half-mile of Great Russell Street. And a branch to the cellar of the gallery. That I did not lay.", { free: true, clue: "c_cellar" }),
              K.t("Can you turn it off?", [{ say: "He puts a hand on a wheel." }, "On the night? There'd be a riot. But if the Association says it's a matter of the Crown, I'll turn it."], { cha: 7, obj: "so2", set: "gas_cut" }),
              K.t("Have you noticed anything about the lamps?", "They look at you, sir. I don't say it to the lads.", { cha: 10 })
            ], { label: "Talk to Mr. Gaunt", name: "the foreman", bye: ["God keep the lamps."] }),
            K.find("Read the supply ledger", "iq", "easy", "Two months of orders: 'Special grade, Gallery, G.R. Street. Pressure doubled.' The first order has a squiggle at the bottom that is meant to be a signature, but looks like a flame.", "Gas and pressure, columns of them.", { clue: "c_orders", hint: "Easy" }),
            K.find("Trace the main to the gallery", "awareness", "medium", "The new main runs from the gasholder along the back of the terrace and under the gallery's cellar wall. A fresh joint, rimed with black. The pipe hums.", "Pipes. A great many.", { clue: "c_cellar", hint: "Awareness, Medium", tags: ["lamps"] }),
            back("street", "Back to Great Russell Street")] }
      }
    });
    hook(id, "street", K.go("Visit the gasworks first", "gasworks", { hint: "Every lamp is fed from one main" }));
    bonus(id, "so1", { label: "Ashgrove, himself", text: "You can reach the man under the black. A bonus on every roll to reach him.", bonus: { tags: ["ashgrove"], value: 2 } });
    text(id, "saint", "Every lamp in Bloomsbury, looking. Gaze: each round one agent per lit lamp in the room takes 2 Sanity and loses the next action unless they pass Willpower Medium. It is weakest where the black is thinnest: the eyes. Only Sanity harms it.");
    res(id, "cellar", "Have Hale thin the black", "res_hale"); res(id, "cellar", "Light the canvas with clean flame", "res_flame"); res(id, "cellar", "Destroy the master canvas", "res_destroy");
    tier(id, [{ if: { flag: "res_hale" }, then: [{ say: "Edmund Hale thinned the black with his own brush, around the eyes, where he painted it first, and the Saint looked out of the canvas for the last time, and was a painting." }] }, { if: { flag: "res_flame" }, then: [{ say: "Clean flame burned the black away, from the edges inward. Every lamp in Bloomsbury burned yellow, for the first time in two months." }] }, { if: { flag: "res_destroy" }, then: [{ say: "You destroyed the master canvas, and the Saint with it. In Bloomsbury every lamp went out, and came back on, yellow." }] }, { if: { obj: "so2" }, then: [{ say: "The gas was cut at the main, and the lamps of Bloomsbury went dark for the first night in a hundred years. People said it was a fault." }] }]);
  }

  /* ======================================================================= PILGRIM ROAD I */
  if (L("pr-1-bones")) {
    const id = "pr-1-bones";
    add(id, {
      clues: {
        c_buyers: { t: "Eleven who bought", s: "The inn at Burguete", x: "The innkeeper's tally: eleven pilgrims bought the bones from the pardoner, and every one of them paid in advance, and every one prayed with him first. He did not take money until they had prayed." },
        c_cairn: { t: "He buried one at the cairn", s: "A mule-driver", x: "A mule-driver saw the pardoner bury a single bone under the cairn at the top of the pass, on the first night of the new moon, and say a prayer over it that he did not know." },
        c_ama: { t: "No saint of that name", s: "The prior's calendar", x: "There is no Saint Ama in the calendar of any diocese in Christendom. There is a Saint Amalberga of Maubeuge. Her feast is in July. Her relics are in Ghent." }
      },
      obj: [{ id: "so2", kind: "secondary", t: "Learn the old salt custom at the charnel house", done: "Brother Íñigo remembers it: salt in the grave, salt in the bread, salt on the sill, and a name said aloud.", benefit: { label: "Salt, and a name", text: "A bonus on every roll to lay the bones to rest.", bonus: { tags: ["salt"], value: 2 } } }],
      npcs: { pello: N("Pello", "Innkeeper at Burguete", "Big, slow-spoken, in a leather apron, with a wine-stained ledger and a very Basque suspicion of everyone from beyond the pass.", F(0, 5, "short", 6, "none", { sex: "m" })) },
      scenes: {
        inn: { name: "The inn at Burguete", theme: "interior", mood: "calm", lighting: "shadow", weather: "fire", cast: ["pello"],
          onEnter: [{ once: "in", steps: [{ say: "A low-beamed inn at the foot of the pass, a long table, a fire, and a big man in a leather apron wiping a ledger with a damp cloth as if it might wriggle." }] }],
          options: [
            K.ask("pello", [
              K.t("Did you see the pardoner?", ["Tobiah. In a green cloak. He lodged here three nights. Very pleasant. He prayed with every pilgrim at the table, and not one of them paid until after they had prayed."], { free: true, clue: "c_buyers" }),
              K.t("What did he sell?", "A finger bone of a saint of the pass. He said her name was Ama. I never heard of her. I'm Basque; I know every saint on this mountain.", { free: true, clue: "c_ama" }),
              K.t("Where did he go?", [{ say: "He glances at the ledger." }, "Up. Toward the cairn. At night. I thought it was to piss. He took a bone with him, and left it."], { cha: 7, clue: "c_cairn" }),
              K.t("Do you know how to keep the dead down?", "My mother did. Salt. And the name. Say the name of the dead aloud, three times, and put salt in the grave. It's older than the church.", { cha: 10, obj: "so2", set: "salt_custom" })
            ], { label: "Talk to Pello", name: "Pello", bye: ["Go carefully on the pass."] }),
            K.find("Read the guest ledger", "iq", "easy", "Eleven pilgrims, three nights, one pardoner. Every pilgrim's entry has a note in the margin, in a hand that is not Pello's: PAID IN PRAYER. And a green ink flourish.", "Names, beds, a good deal of wine.", { clue: "c_buyers", hint: "Easy" }),
            K.find("Walk up to the cairn at the top of the pass", "awareness", "medium", "At the top of the pass, a heap of stones. Under the top stone, a small brown finger bone wrapped in a bit of green cloth, warm to the touch, in the snow. It is the same bone.", "Snow, stones, wind.", { clue: "c_cairn", hint: "Awareness, Medium" }),
            back("hospice", "Back to the hospice")] }
      }
    });
    hook(id, "hospice", K.go("Go down to the inn at Burguete", "inn", { hint: "Where the pardoner lodged" }));
    bonus(id, "so1", { label: "The pardoner, caught", text: "You know what he was selling, and what it wants. A bonus on every roll to speak to the saint.", bonus: { tags: ["saint"], value: 2 } });
    text(id, "hand", "A saint being made out of eleven people. Litany: each round it asks one agent for something (eyes, hands, voice, name): Willpower Medium or lose the next action and 3 Sanity. Salt in the circle stops it. Only Stability harms it.");
    res(id, "pass", "Break the ring", "res_fight"); res(id, "pass", "Sing them back", "res_sing");
    tier(id, [{ if: { flag: "res_sing" }, then: [{ say: "You sang them down, by hymn, and the saint's hand lay still in the snow. The pilgrims woke, singing a hymn they knew." }] }, { if: { flag: "res_fight" }, then: [{ say: "You broke the ring, and the saint's hand with it. The pilgrims woke in the snow, weeping, and wondering at their feet." }] }, { if: { obj: "so2" }, then: [{ say: "Brother Íñigo salts the charnel house every Candlemas, and says each pilgrim's name aloud, three times." }] }]);
  }

  /* ======================================================================= PILGRIM ROAD II */
  if (L("pr-2-quarry")) {
    const id = "pr-2-quarry";
    add(id, {
      clues: {
        c_ledger: { t: "The lodge's quarry ledger", s: "Master Enrique", x: "The masons' lodge ledger for the new statue: every block from Hontoria seam delivered finished. No mason's mark. Every block has been paid for. The payee is 'the chapter', who say they have never heard of it." },
        c_dream: { t: "The masons dream in the same hand", s: "The tavern", x: "Eight masons of the lodge have had the same dream: a woman in a pilgrim's cloak walking toward the cathedral, and every time she takes a step, one more of them forgets their own name." },
        c_salt2: { t: "Salt in the quarry road", s: "The carters", x: "The carters who bring the stone to the cathedral say the road from Hontoria never freezes where they have salted it, and the white stone does not like salt. It sweats." }
      },
      obj: [{ id: "so2", kind: "secondary", t: "Learn what the stone dislikes", done: "Salt. The stone sweats where it touches it. The old masons used salt water to cut the soft seams.", benefit: { label: "A salted chisel", text: "A bonus on every roll to cut the seam, and +2 to your attacks against the Quarry Saint.", bonus: { tags: ["stone"], value: 2 }, combat: { enemy: "saint", attack: 2 } } }],
      npcs: { carter: N("Berto", "Carter of the Hontoria road", "A broad, unshaven carter in a leather jerkin, with salt on his boots and a mule that will not go within fifty paces of the quarry.", F(0, 3, "short", 6, "hat", { sex: "m" })) },
      scenes: {
        road: { name: "The Hontoria road", theme: "forest", mood: "calm", lighting: "glow", weather: "wind", cast: ["carter"],
          onEnter: [{ once: "in", steps: [{ say: "A white dusty road between wheat fields, with deep cart-ruts and a line of salt spilled along one rut, as if from a torn sack. A carter has stopped his mule on the verge and is watching you come." }] }],
          options: [
            K.ask("carter", [
              K.t("What do you carry?", ["Stone. White stone, for the new statue. From the Hontoria seam. It comes out ready. The masons only have to polish it."], { free: true, clue: "c_vein" }),
              K.t("Why the salt?", "My mother's trick. Salt on the road keeps the stone quiet. It sweats, you see, if it touches it. And the stone sweats, and it's less heavy.", { free: true, clue: "c_salt2", obj: "so2" }),
              K.t("Has anything happened on the road?", [{ say: "He looks at the quarry, and at his mule." }, "I hear a woman, on the road, at night. Walking behind the cart. She's very quiet. When I look round, there's no one. But the cart's heavier."], { cha: 7, set: "woman_hint" }),
              K.t("Will you take us to the seam?", "To the gate. Not past it. Never past it.", { cha: 10, set: "carter_help" })
            ], { label: "Talk to Berto", name: "Berto", bye: ["Salt your boots."] }),
            K.find("Look at the salted rut", "awareness", "easy", "In the salted rut, the white dust has darkened to the colour of wet slate, and the stone chips have a faint shine, like sweat. The stone is damp, and cold, and, very faintly, tastes of a name.", "Dust. Wheat. Heat.", { clue: "c_salt2", obj: "so2", hint: "Easy", tags: ["stone"] }),
            K.find("Read the lodge's ledger of deliveries", "iq", "medium", "Blocks, by day, delivered finished, no mason's mark. The payee for every block is 'the chapter'. The chapter has never heard of it.", "A ledger, of many columns.", { clue: "c_ledger", hint: "Intelligence, Medium" }),
            K.find("Ask the quarrymen what they dream", "charisma", "easy", "At the tavern, a quarryman says the same dream: a woman in a cloak walking toward the cathedral. Every step she takes, one of them forgets who he is.", "They won't say. They're afraid.", { clue: "c_dream", hint: "Charisma, Easy" }),
            back("door", "Back to the cathedral")] }
      }
    });
    hook(id, "door", K.go("Take the Hontoria road to the quarry", "road", { hint: "The carters know the seam" }));
    bonus(id, "so1", { label: "Names, said aloud", text: "The quarrymen remember their names. A bonus on every roll to speak to the quarry saint.", bonus: { tags: ["names"], value: 2 } });
    text(id, "saint", "A saint growing in stone. Slow Stone: each round the saint takes a step toward the cathedral, and one agent forgets a name: Mindfulness Medium or lose the next action and 3 Sanity. Salt makes it sweat and shrink. Only Stability harms it.");
    res(id, "lodge", "Persuade the master", "res_master"); res(id, "quarry", "Go down to the Saint", "res_fight");
    tier(id, [{ if: { flag: "res_master" }, then: [{ say: "Master Enrique broke the seam himself, and the lodge cuts no more from it. The cathedral will be finished in common stone." }] }, { if: { flag: "res_fight" }, then: [{ say: "You went down to the Saint's Vein and broke her. The statue's face fell off the cathedral door in the night, in a single piece, and was found at the foot of the stair, wet with salt." }] }, { if: { obj: "so2" }, then: [{ say: "The masons of Burgos cut every seam in the cathedral with salt water now, and call it a lodge secret." }] }]);
  }

  /* ======================================================================= PILGRIM ROAD III */
  if (L("pr-3-finisterre")) {
    const id = "pr-3-finisterre";
    add(id, {
      clues: {
        c_fogbell: { t: "The fog has a bell", s: "The harbour", x: "The fisherfolk hear a bell in the fog on the nights she comes: a pilgrim's cow-bell, ringing time with a woman's footsteps. They stay in. They have stayed in for a fortnight." },
        c_shoes: { t: "A path of shoes", s: "The beach", x: "Every dawn on the beach below the cape, a fresh line of pilgrims' shoes: worn, wet, lined up toe to the sea. They are from every road in Christendom. There are two thousand." },
        c_mother: { t: "She wants to go home", s: "Tobiah", x: "The woman made of pilgrims does not want to be a saint. She wants to be done. Every pilgrim in her is a person who wanted, once, to go home and could not." }
      },
      obj: [{ id: "so2", kind: "secondary", t: "Hear what Saint Ama asks for", done: "Not worship. To be walked home. Every pilgrim who wanted to turn back and could not is in her, and she wants, at last, to turn.", benefit: { label: "Walk her home", text: "A bonus on every roll to answer her, and an attack that is also an offer: +2 against Ama.", bonus: { tags: ["home"], value: 2 }, combat: { enemy: "ama", attack: 2 } } }],
      npcs: { sancha: N("Sancha", "Net-mender of Finisterre", "A tiny old woman with a net across her knees and a rosary of fish-bones, who has sat on the harbour wall every night of her life and has no intention of stopping now.", F(0, 5, "bun", 1, "headscarf", { sex: "f" })) },
      scenes: {
        beach: { name: "The beach below the cape", theme: "sea", mood: "dread", lighting: "shadow", weather: "sea", cast: ["sancha"],
          onEnter: [{ once: "in", steps: [{ say: "A curve of grey sand under a cliff, the Atlantic rolling in from nowhere, and, at the tide-line, in a row, toe to the sea, a thousand pairs of shoes. An old woman on the harbour wall is mending a net and watching you come." }] }],
          options: [
            K.ask("sancha", [
              K.t("Whose shoes are those?", ["The pilgrims'. They come to Finisterre to burn their clothes. A few leave their shoes. Lately, more of them. Every dawn, a new line. They've been here, some of them, since before I was born."], { free: true, clue: "c_shoes" }),
              K.t("What do you hear in the fog?", "A cow-bell. A pilgrim's bell. Ringing in time with a woman walking. We stay in. We've stayed in a fortnight.", { free: true, clue: "c_fogbell" }),
              K.t("What does she want?", [{ say: "Her hands stop on the net." }, "To go home. That's all. They all do. Every pilgrim who gets to the end of the world wants to turn round and go back, and they cannot. That's the ache of Finisterre."], { cha: 8, clue: "c_mother", obj: "so2" }),
              K.t("Will you come to the cape?", "I'll ring the bell. I know how.", { cha: 11, set: "sancha_bell" })
            ], { label: "Talk to Sancha", name: "Sancha", bye: ["Don't answer the bell."] }),
            K.find("Count the shoes", "iq", "easy", "Two thousand and eleven pairs. Boots from the Alps, sandals from Provence, a child's wooden clog from the Rhine, a crusader's iron-shod sabaton. Every pair is wet. Every pair points at the sea.", "Too many shoes.", { clue: "c_shoes", hint: "Easy" }),
            K.find("Listen to the fog", "awareness", "medium", "Out of the white, a long way off, a cow-bell, and under it, in step, the sound of a large number of people walking very softly on wet sand.", "Fog. Surf.", { clue: "c_fogbell", hint: "Awareness, Medium", tags: ["home"], failDamage: ["sanity", 2] }),
            back("village", "Back to the harbour")] }
      }
    });
    hook(id, "village", K.go("Walk down to the beach", "beach", { hint: "Shoes, in rows" }));
    bonus(id, "so1", { label: "The pardoner's help", text: "Tobiah knows her from the inside. A bonus on every roll to unmake her.", bonus: { tags: ["unmake"], value: 2 } });
    text(id, "ama", "A woman made of a thousand pilgrims. Litany: each round she asks one agent for something: Willpower Medium or lose the next action and 4 Sanity. She wants to be walked home: answered with the names of those who made her, she falters. Only Sanity harms her.");
    res(id, "cape", "Answer the litany", "res_names"); res(id, "cape", "Give the first bone", "res_bone"); res(id, "cape", "Stand at the cross and fight", "res_fight");
    tier(id, [{ if: { flag: "res_names" }, then: [{ say: "You answered her litany with the names, every one, until she had none left to ask for." }] }, { if: { flag: "res_bone" }, then: [{ say: "You gave the first bone back to the sea, and answered the prayer it was made from. She walked into the water, with a thousand pilgrims, home." }] }, { if: { flag: "res_fight" }, then: [{ say: "You stood at the cross and fought her. She came apart on the cape, and a thousand people across Christendom woke remembering their names." }] }, { if: { obj: "so2" }, then: [{ say: "Sancha rings the bell on the harbour wall each dawn for any pilgrim who might still be walking." }] }]);
  }

  /* ======================================================================= DEAD AIR I */
  if (L("da-1-channel")) {
    const id = "da-1-channel";
    add(id, {
      clues: {
        c_schedule: { t: "The programme guide has a hole", s: "Lorain Cable", x: "Lorain Cable's programme guide, 1994: Channel 31 is listed as 'Off air' from 2 to 4 a.m. every night. The cable company says nothing is broadcasting. Their own head-end log shows a signal, from a transmitter they do not own." },
        c_signal: { t: "The signal comes from the old studio", s: "The engineer", x: "A cable engineer traced the 3 a.m. signal to the old Channel 31 studio on Kansas Avenue. Power to the building was cut in 1988. The transmitter is still on." },
        c_kids: { t: "They watch it with the sound off", s: "The parents", x: "All four kids sit up at 3 a.m. with the sound off and mouth along. Their lips move on every word, in perfect time, without having heard a sound." }
      },
      obj: [{ id: "so2", kind: "secondary", t: "Trace the signal to its source", done: "The cable company's own engineer traced it: a transmitter on the roof of the old studio, with a power line that has been dead since 1988.", benefit: { label: "A way in", text: "You know how to cut it. A bonus on every roll to take the show off the air.", bonus: { tags: ["signal"], value: 2 } } }],
      npcs: { glenn: N("Glenn Tiberi", "Cable engineer, Lorain Cable", "A sunburnt, rumpled man in a company jacket, with a clipboard and a coffee he has let go cold three times.", F(0, 4, "short", 3, "none", { sex: "m" })) },
      scenes: {
        cable: { name: "Lorain Cable, head-end", theme: "interior", mood: "tense", lighting: "shadow", weather: "none", cast: ["glenn"],
          onEnter: [{ once: "in", steps: [{ say: "A windowless concrete room full of humming racks, banks of monitors, a map of Lorain County pinned to the wall with a hundred coloured pins, and a rumpled man in a company jacket checking a log at the back." }] }],
          options: [
            K.ask("glenn", [
              K.t("Is Channel 31 on the air?", ["Officially, no. It hasn't aired since '87. The old public-access channel went dark. But I'm looking at it right now, between two and four every night, a clean signal on 31. I didn't put it there."], { free: true, clue: "c_schedule" }),
              K.t("Where is the signal coming from?", "I traced it. It's from the roof of the old studio on Kansas Avenue. Power was cut in '88. It's still on.", { free: true, clue: "c_signal", obj: "so2" }),
              K.t("What do you see on the monitors?", [{ say: "He turns a monitor, and turns it back." }, "A man in a cardigan, at a desk, with a puppet. He's very friendly. He looks right at the camera. And I swear to God he's talking to me."], { cha: 7, clue: "c_kids" }),
              K.t("Would you cut it?", "I'd cut it in a heartbeat. But I can't turn off something that isn't on my system.", { cha: 10, set: "glenn_help" })
            ], { label: "Talk to Glenn", name: "Glenn", bye: ["I'll leave the monitor on 31, if you want to watch."] }),
            K.find("Read the head-end log for 3 a.m.", "iq", "easy", "Between 3:00 and 4:00 a.m., every night since March, an uncatalogued signal appears on Channel 31, power-level steady, no source in the system. The log's last column, the 'origin' field, is blank: until the third week of March, when someone has typed one word: HOME.", "A very long log.", { clue: "c_schedule", hint: "Easy" }),
            K.find("Watch a few minutes of the 3 a.m. feed", "willpower", "medium", "A man in a cardigan, at a desk, a hand puppet on one arm. He says a child's name, very softly. You feel your own mouth begin to move on the next word before he says it. You turn it off, and your lips are still going.", "You hold out for a few seconds, and have to look away.", { clue: "c_kids", hint: "Willpower, Medium", tags: ["signal"], failDamage: ["sanity", 2] }),
            back("pruitt", "Back to the Pruitts'")] }
      }
    });
    hook(id, "pruitt", K.go("Call at Lorain Cable's head-end", "cable", { hint: "Someone must know where the signal comes from" }));
    bonus(id, "so1", { label: "Who Dewey was", text: "You know the man behind the show. A bonus on every roll to speak to the Dewey on the tape.", bonus: { tags: ["dewey"], value: 2 } });
    text(id, "dewey", "A host who learns names. Hello, friend: each round Uncle Dewey says one agent's name and asks a question: Willpower Medium or lose the next action and 3 Sanity. He is a broadcast: he cannot reach an agent who is not looking or listening. Only Sanity harms him.");
    res(id, "studio", "Play the real goodbye", "res_goodbye"); res(id, "studio", "Kill the transmitter", "res_kill");
    tier(id, [{ if: { flag: "res_goodbye" }, then: [{ say: "You played the real goodbye, and Uncle Dewey, at last, said it back. The studio went dark." }] }, { if: { flag: "res_kill" }, then: [{ say: "You killed the transmitter. The signal stopped, and the four kids slept through the night. The show is still out there somewhere, on a tape, waiting." }] }, { if: { obj: "so2" }, then: [{ say: "Glenn Tiberi writes the signal's strength into a memo to the FCC, and gets a polite reply that there is nothing to report." }] }]);
  }

  /* ======================================================================= DEAD AIR II */
  if (L("da-2-rewind")) {
    const id = "da-2-rewind";
    add(id, {
      clues: {
        c_invoice: { t: "Orders in a child's hand", s: "The post office", x: "Every order for a lost episode arrives in a child's handwriting, with a ten-dollar bill in a plain envelope. They all give the same return address: a P.O. box in Pahrump that was rented in 1987, in the name of D. Hollister." },
        c_decks: { t: "Four hundred decks, one source", s: "The barn", x: "Four hundred VCRs on racks in the barn, all running at once, each one dubbing from a single master loop on a reel-to-reel in a locked cage at the back." },
        c_pairs: { t: "They come out in pairs", s: "The workers", x: "Workers who go into the dubbing barn come out in pairs: the original and the copy. The copy blinks late. The copy never eats." }
      },
      obj: [{ id: "so2", kind: "secondary", t: "Find the master loop", done: "A reel-to-reel in a locked cage at the back of the barn: the master loop, eleven minutes long, running a goodbye that never ends.", benefit: { label: "The master loop", text: "You can cut it at the source. A bonus on every roll to shut down the duplication.", bonus: { tags: ["loop"], value: 2 } } }],
      npcs: { dot: N("Dot Pruitt", "Night clerk, Sagebrush Motel", "A big-boned woman in a flowered smock with a cigarette that never leaves her lips, and a family photo behind the desk with one face cut out.", F(0, 3, "bob", 1, "none", { sex: "f" })) },
      scenes: {
        barn: { name: "The Silver Sage barn", theme: "interior", mood: "dread", lighting: "shadow", weather: "none", cast: ["dot"],
          onEnter: [{ once: "in", steps: [{ say: "Eighty feet of corrugated steel, and inside it four hundred VCRs on steel racks, all running at once, a hum like a hive. A woman in a flowered smock stands at the door with a cigarette and does not look at you." }] }],
          options: [
            K.ask("dot", [
              K.t("Who runs the barn?", ["Nobody. It runs. I used to work the day shift. I don't any more. My sister works the night shift. She came in one night, and there were two of her."], { free: true, clue: "c_pairs" }),
              K.t("What does it dub?", "Uncle Dewey. All of it. Lost episodes. Ten dollars a copy. The orders come in the post, in kids' handwriting. We never meet the kids.", { free: true, clue: "c_invoice" }),
              K.t("Where is the master?", [{ say: "She glances at the cage at the back, and away." }, "In the cage. A reel-to-reel loop. Eleven minutes long. It never stops."], { cha: 7, obj: "so2", clue: "c_decks" }),
              K.t("Which of your sister is the real one?", "I don't know. I don't know which I am, some days.", { cha: 10 })
            ], { label: "Talk to Dot", name: "Dot", bye: ["Don't stand next to the racks."] }),
            K.find("Count the decks", "iq", "easy", "Four hundred decks, all running. Every one is dubbing from the same master, fed by a single cable that runs back along the roof beam to a locked cage. The cable is warm.", "Too many machines, too much noise.", { clue: "c_decks", hint: "Easy" }),
            K.find("Look at a pair of workers", "awareness", "medium", "Two men in matching overalls stand by a rack: Wendell, and Wendell. One of them blinks a half second after the other. The second is the one who has stopped sweating. You watch them for a long time, and he does not look at you once.", "Two men. They look the same.", { clue: "c_pairs", hint: "Awareness, Medium", failDamage: ["sanity", 2] }),
            K.find("Pick the lock on the cage", "agility", "medium", "The cage opens on a reel-to-reel on a steel stand, a tape loop eleven minutes long, whirring round and round. On the nameplate: AFTER HOURS #212 — MASTER LOOP. Every deck in the barn is listening to it.", "The lock holds.", { clue: "c_loop", obj: "so2", hint: "Agility, Medium", tags: ["loop"] }),
            back("office", "Back to the office")] }
      }
    });
    res(id, "office", "Get the workers out first", "res_workers"); res(id, "office", "Go into the barn", "res_barn");
    hook(id, "office", K.go("Search the barn's racks first", "barn", { hint: "Four hundred decks, one source" }));
    L(id).scenes.barn.options.splice(L(id).scenes.barn.options.length - 1, 0, { label: "Cut the master loop and walk out", hint: "Needs the loop", if: { obj: "so2" }, steps: [{ check: { aspect: "agility", cr: "medium", label: "Cut the loop before the decks notice", who: "choose", tags: ["loop"], ok: [{ say: "You cut the master loop with a pair of tin-snips, and four hundred decks, one by one, run down to silence. The copies stand where they are, and then, quietly, sit down." }, { set: "res_loop" }, { objective: "po2" }, { end: "win" }], fail: [{ say: "The loop catches your sleeve. All four hundred decks look up." }, { damage: { pool: "sanity", amount: 3 } }] } }] });
    bonus(id, "so1", { label: "The copied people", text: "The copies are loose. A bonus on every roll to fight the barn.", bonus: { tags: ["barn"], value: 2 } });
    text(id, "duplicator", "A machine that copies. Dub: each round it copies one agent (Willpower Medium to resist): the copy fights beside it for one round. Every copy it makes loses one pool. It is one reel, run four hundred ways. Only Stability harms it.");
    tier(id, [{ if: { obj: "so2" }, then: [{ say: "The master loop is cut, and the decks, one by one, run down to silence." }] }, { if: { obj: "so1" }, then: [{ say: "Six workers and six copies came out into the sun; only one of each walked to the cars." }], else: [{ say: "Some of the workers never came out of the barn. They are on a rack somewhere in Pahrump, dubbing." }] }]);
  }

  /* ======================================================================= DEAD AIR III */
  if (L("da-3-signoff")) {
    const id = "da-3-signoff";
    add(id, {
      clues: {
        c_snow: { t: "The snow won't stick on the hill", s: "Murray Ridge", x: "The snow on Murray Ridge has not stuck for a week. The hill is warm. A line of kids' footprints leads up it, and all of them are bare." },
        c_loop: { t: "The sign-off is on a loop", s: "The transmitter", x: "The sign-off has been playing at the transmitter, to nobody, on a loop, at a whisper, since the first of December. At midnight it will be played at full power to every set in Ohio." },
        c_ham: { t: "A ham radio operator heard it first", s: "Marv", x: "A ham radio operator on Murray Ridge, Marv Kowalski, has been hearing the sign-off in his headphones for a month. He wrote it down. It is eleven minutes long, and it ends with the viewer's name." }
      },
      obj: [{ id: "so2", kind: "secondary", t: "Find out what the sign-off says", done: "Marv Kowalski's transcript: eleven minutes of a friendly man saying goodnight to each child by name, ending with their address.", benefit: { label: "The transcript", text: "You know what it will say. A bonus on every roll to answer it.", bonus: { tags: ["signoff"], value: 2 } } }],
      npcs: { marv: N("Marv Kowalski", "Ham radio operator", "Sixty-eight, in a plaid shirt and a headset round his neck, with a logbook open on his knee and a mug of cold coffee he has stopped noticing.", F(0, 5, "bald", 5, "none", { sex: "m" })) },
      scenes: {
        shack: { name: "Marv's radio shack, Murray Ridge", theme: "interior", mood: "tense", lighting: "shadow", weather: "none", cast: ["marv"],
          onEnter: [{ once: "in", steps: [{ say: "A cramped wooden shack at the foot of the ridge, racks of old radios, a bank of dials, a logbook and a man in a headset, who stands up when you come in and says: 'You're about the sign-off.'" }] }],
          options: [
            K.ask("marv", [
              K.t("What have you heard?", ["Since the first of December. In my headphones, very low. A friendly voice saying goodnight. Eleven minutes of it. And at the end, a name. A different one each time. I've written them all down."], { free: true, clue: "c_loop" }),
              K.t("Can we read the log?", "You'll want to. Every name in it is a child in Lorain County. Every name has a date. The dates are in the future.", { free: true, obj: "so2", clue: "c_ham" }),
              K.t("What happens at midnight?", [{ say: "He takes off his headset." }, "Full power. Every set in Ohio. Every kid who ever watched the tape will hear their own name. And they'll get up."], { cha: 7, clue: "c_walkers" }),
              K.t("Can it be stopped from here?", "From here, no. From the tower, yes. But the tower won't let you near it after dark. Not unless you've something it wants.", { cha: 10, set: "marv_hint" })
            ], { label: "Talk to Marv", name: "Marv", bye: ["Good luck. And listen."] }),
            K.find("Read Marv's transcript", "iq", "easy", "Eleven minutes of a friendly, soft voice, saying goodnight: 'Goodnight, Emily. Goodnight, Tyler. Goodnight, Marcus.' Every name in the log, and next to each, an address, a date, and a time. The last entry is this morning. It is Marv's own name.", "Pages and pages of names.", { clue: "c_ham", obj: "so2", hint: "Easy" }),
            K.find("Walk the footprints up the ridge", "awareness", "medium", "Bare footprints in the snow, a hundred of them, small, going up. The snow is melted where they trod. At the top of the line, a thin black cable, running into the ground, humming.", "Snow. Wind.", { clue: "c_snow", hint: "Awareness, Medium", tags: ["signoff"] }),
            back("road", "Back to Murray Ridge Road")] }
      }
    });
    hook(id, "road", K.go("Call at Marv's radio shack", "shack", { hint: "He has been listening for a month" }));
    bonus(id, "so1", { label: "Home, behind locked doors", text: "The kids are home. A bonus on every roll on the tower.", bonus: { tags: ["tower"], value: 2 } });
    text(id, "signoff", "A goodnight that is also a summons. Goodnight: each round Uncle Dewey says one agent's name: Willpower Medium or lose the next action and walk a step toward the transmitter. He is at full power at midnight. Played backward, the real goodbye drowns him. Only Sanity harms him.");
    res(id, "tower", "Play the real goodbye", "res_goodbye"); res(id, "tower", "Throw the main breaker", "res_breaker");
    tier(id, [{ if: { flag: "res_goodbye" }, then: [{ say: "You played the real goodbye backward through the transmitter, and Uncle Dewey, for the first time, said goodnight and meant it." }] }, { if: { flag: "res_breaker" }, then: [{ say: "You threw the main breaker. The transmitter went dark at 11:58, and Ohio slept through the fireworks. The show is still out there, on a tape, in a drawer." }] }, { if: { obj: "so2" }, then: [{ say: "Marv Kowalski's logbook goes to the NSBD, every name in it crossed off." }] }]);
  }

  /* ======================================================================= more places to search in the upgraded parts */
  const finds = (id, scene, list) => { const os = L(id).scenes[scene].options; os.splice(Math.max(0, os.length - 1), 0, ...list); };
  finds("lb-2-flues", "canal", [K.find("Look under the canal bridge", "awareness", "medium", "Under the bridge, wedged in the stonework, a row of small black handprints, a boy's size, at the height of a boy's hand: and beside each, a smear of soot in the shape of a mouth. They face the works.", "Dark water. Slime.", { clue: "c_boys", hint: "Awareness, Medium", tags: ["flue"] })]);
  finds("lb-3-opening", "gasworks", [
    K.find("Search the foreman's desk", "iq", "easy", "In the drawer, a printed invitation in black ink that will not come off your fingers, addressed to the gasworks foreman: 'Mr. Ashgrove requests the pleasure of your company at a private view.' Under it, scribbled: 'If I do not go, my lamps will.'", "Receipts, a spanner, a pipe.", { clue: "c_keys", hint: "Easy" }),
    K.find("Walk the main under Great Russell Street", "awareness", "medium", "In the gas-main's access shaft, a fresh black stain on the iron, in the shape of a hand, at the height of a man's shoulder. Where the main turns toward the gallery, the pipe is warm, and in the warmth, very faintly, you can hear someone humming a tune you almost know.", "A long dark pipe, a smell of tar.", { clue: "c_cellar", hint: "Awareness, Medium", tags: ["lamps"] }),
    K.find("Find Hale, and ask where the black is thin", "charisma", "medium", "Hale is in a doorway across the street with a satchel of brushes. He says: 'Around the eyes. I painted them first. They never quite took the black. Whatever it is, it looks out through its eyes.'", "He will not look at you.", { clue: "c_hale", hint: "Charisma, Medium", if: { arc: "hale_spared" } })
  ]);
  finds("pr-1-bones", "inn", [K.find("Question the mule-driver at the stable", "charisma", "easy", "A mule-driver, over a bucket of oats, says the pardoner prayed with each pilgrim before he took their money, and that every pilgrim, afterward, 'walked taller'. And in the night, he says, he heard the pardoner talking in the stable, to nobody, in a woman's voice.", "He shrugs, and goes on with the oats.", { clue: "c_buyers", hint: "Charisma, Easy" })]);
  finds("pr-2-quarry", "road", [K.find("Climb the quarry wall and look down", "agility", "medium", "From the quarry's rim you can see the Saint's Vein: a white seam, thirty feet high, with a shape in it, a woman in a cloak, walking out of the stone. The quarrymen's picks have been cutting round her, not into her, for weeks.", "The rock is too steep.", { clue: "c_vein", hint: "Agility, Medium", tags: ["stone"], failDamage: ["health", 2] })]);
  finds("pr-3-finisterre", "beach", [
    K.find("Search the old hermit's cairn on the beach", "awareness", "easy", "A little cairn at the high-tide line, with a single pilgrim's staff stuck in it, and below it, scratched in the sand with a stick, a list: places, and beside each a number. The last line says: 'Finisterre. 1. The end.'", "Sand. Shells.", { clue: "c_shoes", hint: "Easy" }),
    K.find("Ask the old women where the pilgrims go to burn their clothes", "charisma", "easy", "The old women say pilgrims burn their clothes at the cape to leave the road behind. In the last month, they say, the clothes have been burning without a match, and the ash, in the morning, is in the shape of someone walking.", "They shake their heads, and look at the fog.", { clue: "c_fires", hint: "Charisma, Easy" }),
    K.find("Walk down to the tide-line, alone", "willpower", "medium", "At the edge of the water you feel the whole of it: two thousand pilgrims, standing in the surf, facing the sea, wanting to turn back, and unable. The sound they make is not a sound. It is the pause before a sob.", "You turn back before you reach the water.", { clue: "c_mother", hint: "Willpower, Medium", tags: ["home"], failDamage: ["sanity", 2] })
  ]);
  finds("da-1-channel", "cable", [
    K.find("Ask who rents the P.O. box", "charisma", "easy", "The postal clerk, flustered, checks a card index. The box was rented in 1987, for cash, by a D. Hollister, and renewed every January since, in the same handwriting, by cashier's cheque. Nobody has ever come in to collect the mail.", "She is not allowed to say.", { clue: "c_signal", hint: "Charisma, Easy" }),
    K.find("Walk the cable's route on the map", "iq", "medium", "On Glenn's map of the head-end, a thin line of unpinned cable runs from the old Channel 31 studio on Kansas Avenue to every one of the four households. It was not laid by the company. It is not on any plan. It is warm.", "The map is a snarl.", { clue: "c_signal", obj: "so2", hint: "Intelligence, Medium", tags: ["signal"] })
  ]);
  finds("da-2-rewind", "barn", [K.find("Read the workers' time-cards", "iq", "easy", "Two cards for every worker, in the same hand: 6 a.m. to 2 p.m., and 6 a.m. to 2 p.m. The copies punch in a minute after the originals, and never punch out.", "Time-cards.", { clue: "c_pairs", hint: "Easy" })]);
  finds("da-3-signoff", "shack", [
    K.find("Listen to a minute of the sign-off on Marv's headset", "willpower", "medium", "A friendly, warm voice, saying goodnight to a child. It says the child's name, and then a street, and then a time, and it says: 'See you soon.' You take the headset off, and your own mouth is saying the next name.", "You can't bring yourself to put the headset on.", { clue: "c_loop", hint: "Willpower, Medium", tags: ["signoff"], failDamage: ["sanity", 2] }),
    K.find("Check the transmitter's license in Marv's logbook", "iq", "easy", "An FCC license from 1961, for a 50-kilowatt television transmitter on Murray Ridge, issued to 'Hollister Broadcasting'. The renewal for 1996 was filed in November, in the same hand, with the same cashier's cheque.", "A great many licences.", { clue: "c_loop", hint: "Easy" }),
    K.find("Count the footprints at the foot of the ridge", "awareness", "easy", "A hundred and twelve, small and bare, going up, and one, much larger, in a clean-soled shoe, going down. It leaves no print on the snow where it steps, only a faint warmth.", "Snow, wind, and footprints.", { clue: "c_snow", hint: "Easy" })
  ]);

  /* ======================================================================= companions: a local who goes with you, and says what they think */
  const companion = (id, scene, cid, cdef, label, hint, joinText) => {
    const a = L(id); a.companions = Object.assign(a.companions || {}, { [cid]: cdef });
    const os = a.scenes[scene].options; os.splice(Math.max(0, os.length - 1), 0, { label, hint, once: true, steps: [{ say: joinText }, { join: cid }] });
  };
  companion("black-roller", "town", "hanks", { npc: "hanks", attack: 3, build: { difficulty: "medium", mods: ["Ranged"], bonus: { health: 5 } }, nothing: "Don't you stand there looking at the sky. Do something.",
    hints: [{ text: "Four o'clock. Always four. Whatever it wants, it keeps an appointment.", if: { clue: "c_sunday" } }, { text: "Reverend Early says the ones that come back get the Lord's Prayer wrong. I've listened. He's right.", if: { clue: "c_tell" } }, { text: "Amos Pruitt's a good man. Don't be too hard on him.", if: { clue: "c_bargain" } }] },
    "Ask Sheriff Hanks to ride with you", "A local lawman who knows the county", "Hanks puts down his bandanna, picks up his hat, and says he was going to ask.");
  companion("counting-stair", "meera", "meera", { npc: "meera", attack: 2, build: { difficulty: "easy", mods: [] }, nothing: "Count with me. It helps.",
    hints: [{ text: "My grandfather's rod says nine hundred and ninety-nine cubits. The stair is longer. Every time.", if: { clue: "c_hari" } }, { text: "Kishan said there is an extra step on the way up. We must find the one that is not there on the way down.", if: { clue: "c_child" } }] },
    "Ask Meera to guide you down", "She knows the stair's measure", "Meera ties the cloth bundle to her belt, and says she will go as far as the second landing, and not a step beyond.");
  companion("trench-chorus", "sap", "prosser", { npc: "prosser", attack: 3, build: { difficulty: "easy", mods: ["Ranged"] }, nothing: "Keep your head down. And keep your ears open.",
    hints: [{ text: "Thirty-seven. I counted them from the lip. They stand in a ring, and none of them are looking at us. They're looking at the middle.", if: { clue: "c_crater" } }, { text: "The wire's cut eleven paces left of the stake with the red rag. I marked it myself.", if: { clue: "c_wire" } }] },
    "Take Lieutenant Prosser with you", "A sap officer who knows no-man's-land", "Prosser folds his map, tucks it into his tunic, and says the colonel need not know.");
  companion("hour-of-the-fog", "lamps", "tam", { npc: "tam", attack: 2, build: { difficulty: "easy", mods: [] }, nothing: "Keep the flame steady. It's all I know.",
    hints: [{ text: "Where the lamp is trimmed true, the fog stops dead. Remember that, when it comes.", if: { clue: "c_light" } }, { text: "My wife is in the cistern. I know it. Don't tell me, if you find her.", if: { clue: "c_flood" } }] },
    "Take Tam and his brass pole along", "He knows every lamp in the lower quarter", "Tam shoulders his pole, and says he's been waiting twenty-seven years to be asked.");
})();
