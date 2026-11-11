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
        { say: "Ueno at eleven at night, autumn 1957. The night express for Aomori idles at platform 9, steam drifting under the platform lamps, salarymen with their collars up hurrying for the sleeper cars." },
        { say: "Conductor Satō is waiting by the last car, pale and stiff in his uniform. He looks at you, at his pocket watch, at you, at his watch. He has been checking it every thirty seconds since you arrived." }] }],
        options: [
          { label: "Talk to Conductor Satō", hint: "Japan National Railways", steps: [{ converse: { npc: "sato", id: "main",
            open: ["You're the ones. Good. Please. I'm not a superstitious man. I've worked this line nineteen years."],
            topics: [
              { ask: "What's wrong with the train?", lines: ["Six cars on my manifest. I count them at Ueno: six. I count them at Sendai: six.", { say: "He opens his watch. Shuts it." }, "And somewhere between Sendai and Morioka, every night this month, I walk the train and count seven doors. The extra one is at the end of car six. It's not in the plans. It's not on any train this railway owns."], then: [{ clue: "c_manifest" }] },
              { ask: "What's behind the door?", lines: ["I don't know. I've stood in front of it with my hand on the handle every night for three weeks. I can't make my hand turn it.", "Sometimes I hear a voice through it, announcing stations. Very politely. It says the names of stations that aren't on this line. Then it says <i>last stop</i>."] },
              { ask: "Has anyone gone through?", lines: [{ say: "His face crumples for a moment, then he gets it under control." }, "Last night. A little girl, Ayame Hasegawa, seven years old, travelling with her mother in car four. She walked through it at two in the morning holding a ticket I never punched.", "Her mother is still on the train. She won't get off without her."] },
              { ask: "Why check your watch so often?", lines: ["Because the train is always on time. Every night. To the second.", "No train in Japan is ever exactly on time. Something is keeping this one to a schedule. I want to know whose."] }],
            bye: ["We leave in four minutes. Please. Car four. Mrs. Hasegawa."] } }] },
          { label: "Board the train", steps: [{ goto: "cars" }] }] },
      cars: { name: "Sleeper cars 3 to 6", theme: "train", mood: "dread", cast: ["hase"], lighting: "shadow",
        onEnter: [{ once: "c", steps: [
          { say: "The train pulls out into the dark. You walk it end to end as it rocks north through the night: green curtains drawn over the sleeper bunks, shoes lined up in the aisle, a hundred people breathing slowly in the same rhythm, dreaming along the same long dark." },
          { say: "In car four, one bunk curtain is open. A woman in a plain kimono sits on the edge of the bunk, upright, hands clasped hard in her lap, staring at the empty bunk opposite." },
          { say: "At the end of car six there's a door. Varnished wood, a brass handle, a frosted window with a lantern-glow behind it. Satō was right: it isn't on the plan pinned by the toilet. When you look away and back, it's still there." }] }],
        options: [
          { label: "Speak with the girl's mother", hint: "Mrs. Hasegawa, car four", steps: [{ converse: { npc: "hase", id: "main",
            open: [{ say: "She doesn't look up when you sit down opposite. Her voice is very quiet and very even, the voice of someone holding a great weight very still." }, "You've come about Ayame. The conductor said someone would."],
            topics: [
              { ask: "What happened last night?", lines: ["She woke me at two. She said a man had come by in white gloves and given her a ticket. She was so pleased. She showed it to me.", "I was half asleep. I said, that's nice, go back to bed. And when I opened my eyes again she was walking down the aisle toward the end of the car, holding it in front of her like a present."] },
              { ask: "What did the ticket say?", lines: ["<i>Last station. One way.</i> Printed, very neat. Railway paper.", { say: "Her hands tighten." }, "I don't remember buying it. I keep thinking I must have. That I bought it and forgot, and that's how he could take her."], then: [{ clue: "c_ticket" }] },
              { ask: "What was Ayame like?", lines: [{ say: "For the first time, something like a smile." }, "Is. She is. Seven. Very stubborn. Afraid of nothing except thunder. She won't eat pickles and she sings to her doll in a voice like a little bell.", "If anyone can refuse to get off at the wrong station, it's my daughter."] },
              { ask: "We'll bring her back", lines: ["Please. Tell her Mother is waiting in car four. Tell her she can have her own bunk with the window, like she wanted."] }],
            bye: ["Car four. I won't move from here."] } }] },
          { label: "Count the doors", once: true, steps: [{ check: { aspect: "awareness", cr: "easy", label: "Count the doors", ok: [{ say: "Six cars. Seven doors. The extra stands between six and the engine." }, { objective: "po1" }], fail: [{ say: "You lose count twice." }] } }] },
          { label: "Step through the extra door", steps: [{ goto: "car7" }] }] },
      car7: { name: "Car 7", theme: "train", mood: "weird", lighting: "shadow", cast: ["station"],
        onEnter: [{ once: "k", steps: [
          { say: "The door opens onto a car that cannot fit inside the train. Tatami matting runs away into distance, between walls of rice paper lit from behind. A long line of paper lanterns sways overhead in a draft you can't feel, and the windows show no landscape, only a soft grey nothing rushing past." },
          { say: "Passengers sit in neat rows on their heels, very still, tickets held out in front of them. Their clothes are from every decade of the century. Some of them have been travelling a very long time." },
          { say: "A voice from somewhere ahead, soft and polite, announces the next station. There is no name. Then a figure leans out of the next compartment: white gloves, black cap, a face you can't keep hold of." },
          { talk: { npc: "station", text: "Tickets, please. Ah. You don't have tickets. How unusual. Never mind; there's room for everyone at the last stop." } },
          { say: "Beside the door you came through hangs a single paper lantern, burning steadily, and you understand without being told that it's the only thing keeping this car attached to the train." }, { clue: "c_lantern" }] }],
        options: [
          { label: "Find Ayame in the rear compartment", once: true, steps: [{ check: { aspect: "charisma", cr: "medium", label: "Coax the child out", ok: [{ say: "You find her in the very last compartment, a small girl in a red cardigan sitting very straight, ticket held out in both hands like a good passenger." }, { say: "You crouch beside her and tell her that her mother is waiting in car four, that she can have the bunk with the window. Her eyes come slowly back from wherever they were." }, { say: "\"Mother didn't buy this,\" she says, looking at the ticket. \"The man did. I don't want to go there.\" And she tears it in half, very neatly, along the perforation." }, { objective: "so1" }], fail: [{ say: "She stares through you." }, { damage: { pool: "sanity", amount: 2 } }] } }] },
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
        { say: "Humboldt County, California, summer of '58. The Starlite Drive-In sits in a bowl of dry hills off Route 101, its huge white screen glowing against a sky still pink at the edges. It's 9:15. The picture shouldn't start till dark. The screen's already lit." },
        { say: "Cars stand in tidy rows, Chevys and Fords and a Studebaker with fins, speakers hooked on every window. Every window is fogged. Heads tip toward the screen inside, very still." },
        { say: "Sheriff Dunn is leaning on his cruiser by the ticket booth, hat pushed back, sunburnt and heavy and tired. He's been here a lot lately." }] }],
        options: [
          { label: "Talk to Sheriff Dunn", hint: "Humboldt County", steps: [{ converse: { npc: "dunn", id: "main",
            open: ["You the federal people? Funny-looking feds. Never mind. I'm past caring who helps."],
            topics: [
              { ask: "What's been happening here?", lines: ["Eight couples last week didn't go home. Kids, mostly. High school sweethearts, a couple of honeymooners from Eureka.", "Nobody's complained. That's the thing. Not one mother, not one boss. Just, they're not found. The cars are still here at sunup, seats warm, speaker still on the window, and nobody in 'em."] },
              { ask: "Who runs this place?", lines: ["Fella named Vale. Alden Vale. Projectionist and owner both. Keeps to the booth. Never seen him in daylight.", "Funny thing: he's been letting folks in free since June. Couples only. Says it's a promotion."] },
              { ask: "Have you watched the picture?", lines: [{ say: "Dunn looks at the screen and then quickly away from it." }, "I watched about a minute, Tuesday. It's this lot, from above. These cars. Folks walking up to the screen holding hands, real slow.", "I got back in my car and drove home and slept fourteen hours. Haven't looked at it since."] },
              { ask: "Why not shut it down?", lines: ["On what charge? Showing a picture? The county attorney laughed me out of his office.", "And between you and me, I came out here twice with a padlock and both times I found myself sitting in my car at dawn with the padlock in my lap. I don't remember sitting down."] }],
            bye: ["I'll be here. Somebody's got to count the cars in the morning."] } }] },{ label: "Visit the concession stand", steps: [{ goto: "stand" }] }, { label: "Walk to the projection booth", steps: [{ goto: "booth" }] }, { label: "Inspect the sleeping audience", once: true, steps: [{ check: { aspect: "awareness", cr: "easy", label: "Look closely at the audience", ok: [{ say: "No one is breathing. Every window is fogged. Every face is lit by the screen, and every face is smiling." }], fail: [{ say: "They look like they're sleeping." }] } }] }] },
      stand: { name: "Concession stand", theme: "drive", mood: "calm", cast: ["ruby"],
        onEnter: [{ once: "st", steps: [
          { say: "The concession stand is a pool of yellow light in the dark lot: the popcorn machine humming and popping to itself, a stack of paper cups waiting, a cash register that hasn't opened in weeks. Moths batter the bulbs." },
          { say: "Behind the counter a girl in a paper hat is wiping a clean counter, over and over. She has her back to the screen, and she's careful to keep it that way." }] }],
        options: [{ label: "Talk to Ruby", hint: "Concession stand", steps: [{ converse: { npc: "ruby", id: "main",
            open: [{ say: "She smiles the customer smile automatically, then sees your faces and lets it drop." }, "You're not here for popcorn. Nobody's here for popcorn any more."],
            topics: [
              { ask: "What's the picture?", lines: ["Mr. Vale says it's the best picture we've ever run. He made it himself.", "I'm not supposed to watch it. He told me, special, the first night. <i>Not you, Ruby. You keep the lights on.</i> I put my fingers in my ears when the lights go down."] },
              { ask: "Who comes to see it?", lines: ["Couples. Only couples. He lets them in free; he's not charged a dime since June. Says love's the best ticket.", "They park, and they look at the screen, and they don't come back for popcorn, and they don't leave before the credits. There aren't any credits."], then: [{ clue: "c_free" }] },
              { ask: "What's Mr. Vale like?", lines: [{ say: "She glances up at the booth window at the back of the lot. A white shape moves behind the glass." }, "Polite. Real polite. He wears white gloves, always, even in August. I asked him once why and he said his hands got cold.", "His gloves are sewn on at the wrists. I saw the stitches."] },
              { ask: "Why do you stay?", lines: ["Because if I leave, there's nobody to keep the lights on. And I think the lights are the only reason I'm still me."] }],
            bye: ["If you go up to the booth, don't look at the beam. Look at the floor."] } }] },
          { label: "Ask about Vale's past", once: true, steps: [{ check: { aspect: "charisma", cr: "medium", label: "Get Ruby to talk", ok: [{ say: "'The old booth burned in '49,' she whispers. 'They never found his hands.'" }, { clue: "c_vale" }, { objective: "so1" }], fail: [{ say: "She shakes her head and busies herself with the cups." }] } }] },
          { label: "Back to the lot", steps: [{ goto: "lot" }] }] },
      booth: { name: "The projection booth", theme: "interior", mood: "dread", lighting: "shadow",
        onEnter: [{ once: "bo", steps: [
          { say: "The projection booth is a concrete box at the back of the lot, hot as an oven, loud with the clatter of the projector. The beam goes out through a little square window, full of dust, toward the screen." },
          { say: "Seven film cans stand on a shelf, dates written on them in white grease pencil. The walls are papered with photographs of the lot taken from above, night after night, the same rows of cars, fewer each time." },
          { say: "A thin man in a white coat is threading a reel with great care. He doesn't turn round. His gloves are sewn on at the wrists." },
          { talk: { npc: "vale", text: "Booth's closed to the public. But since you're here: wouldn't you like to see yourselves in pictures? Everybody wants to be in pictures." } }] }],
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
