/* ============================================================================
   REBUILT CASES, BATCH THREE: The Night Train to Aomori (1957) and The Last
   Picture Show (1958).
   ========================================================================== */
(function () {
  const ADV = window.ADV, K = window.CASEKIT, F = K.face, N = K.person;

  /* ======================================================================= 1957 · The Night Train to Aomori */
  ADV.register({
    id: "night-train-aomori", flavor: "jp", title: "The Night Train to Aomori", setting: "Tōhoku Main Line, Japan · 1957", year: 1957, level: [1, 9], agencies: ["EHG", "WCA", "NSBD"], region: "asia-east", theme: "train",
    summary: "A sleeper from Ueno has an extra car that is not on the manifest. Passengers who step into it do not come back out. The conductor insists he has never seen it, and the train has not stopped at a station for three hours.",
    objectives: [
      { id: "po1", kind: "primary", t: "Find the car that isn't on the manifest, and who runs it", done: "Car 7: a tatami room that should not exist, kept by the Station Master of Nowhere, who calls a station and one passenger steps off. He has been calling them along this line for nine years." },
      { id: "po2", kind: "primary", t: "Stop the train before the last station", done: "The Station Master loses his hold, and the train rolls into Aomori at dawn, an ordinary train, with every passenger still aboard that should be." },
      { id: "so1", kind: "secondary", t: "Bring back the missing child", done: "Little Ayame returns to her mother, clutching a paper ticket.", benefit: { label: "A child's ticket", text: "You hold a ticket the Station Master wrote himself. It is proof he can be made to keep his word: a bonus on every roll to bargain with him.", bonus: { tags: ["bargain"], value: 2 } } },
      { id: "so2", kind: "secondary", t: "Find out who the driver was", done: "Driver Mori walked into Car 7 nine years ago and has been driving the train ever since, in the front of the engine, forgetting to stop.", benefit: { label: "A driver who remembers", text: "Driver Mori will stop the train if you ask in his own name. A bonus on every roll to stop it.", bonus: { tags: ["stop"], value: 2 } } },
      { id: "so3", kind: "secondary", t: "Learn the Station Master's ticket-punch", done: "A ticket punched three times is a ticket to the dead. The Master's punch has a pattern.", benefit: { label: "The punch pattern", text: "+2 to your attacks against the Station Master.", combat: { enemy: "master", attack: 2 } } }
    ],
    clues: {
      c_manifest: { t: "Six cars, seven doors", s: "Conductor Satō", x: "The manifest lists six cars. The conductor has been counting doors all night and arrives at seven." },
      c_ticket: { t: "A ticket to nowhere", s: "Mrs. Hasegawa", x: "Ayame's little hand was holding a ticket that read 'LAST STATION, ONE WAY' before she walked through the door at the end of car 5." },
      c_lantern: { t: "The lantern keeps the car in place", s: "Car 7", x: "A paper lantern hangs by the door. When it burns, the car exists. If it goes out, the car may drift away, or the train may, or the passengers." },
      c_stations: { t: "Stations that aren't on the line", s: "The loudspeaker", x: "Between Utsunomiya and Fukushima a soft voice calls stations that are not on the line: Mukashi, Yomi, Kiri-no-Hashi. Each time it calls one, someone in the train gets off." },
      c_driver: { t: "The driver has not been relieved", s: "The engine cab", x: "The driver, Mori, has not been relieved in nine years. His relief is signed in the same pen, every week. He is still driving." },
      c_punch: { t: "The ticket-punch", s: "The Station Master", x: "A ticket punched three times is a ticket to the dead. The Station Master's punch cuts a small round hole, then another, then a third: in a line, like a path." },
      c_count: { t: "One passenger short at every station", s: "The ticket inspector's book", x: "The inspector's book shows one passenger fewer at every station the loudspeaker calls: five missing since Ueno. Nobody has noticed, because nobody remembers them." }
    },
    npcs: {
      sato: N("Conductor Satō", "Japan National Railways", "Pale, stiff in his uniform, with a pocket watch he checks every thirty seconds.", F(1, 0, "short", 0, "hat", { sex: "m" })),
      hase: N("Mrs. Hasegawa", "Passenger, car 4", "A mother in a plain kimono, hands clasped hard. Her daughter's seat is empty.", F(1, 0, "bun", 1, "none", { sex: "f" })),
      kuroda: N("Kuroda", "University student · always writing", "A thin young man in a black school uniform with a notebook, who counts things for fun and has lately stopped enjoying it.", F(1, 0, "short", 3, "none", { sex: "m" })),
      station: N("The Station Master of Nowhere", "Beyond", "White gloves, black cap, a face you cannot hold in memory. He says each station name very softly.", F(1, 0, "short", 5, "hat", { sex: "m", bg: "#1b1b26" }))
    },
    enemies: {
      lantern: { build: { name: "Lantern Wisp", type: "Spirit", difficulty: "easy", sprite: "spirit", hue: 40, dtype: "sanity", range: 1, dies: "gutters out with a small sigh" } },
      master: { build: { name: "Station Master of Nowhere", type: "Spirit", difficulty: "challenging", sprite: "spirit", hue: 280, dtype: "sanity", range: 1, core: { body: 0, mind: 2, spirit: 3 }, mods: ["Quick"],
        text: "He calls the stations. Next Stop: each round he names a station and one agent must pass Willpower Medium or step off: out of the fight, until the next round. He will bargain: he keeps his word, if you hold a ticket he wrote. He cannot be hurt while the lantern burns, and the lantern goes out if the train stops.", dies: "bows, takes off his cap, and is only a man in a uniform on an empty platform at dawn" } }
    },
    encounters: {
      car7: { name: "Car 7", theme: "train", fightText: "The Station Master calls the next stop, and the lanterns lean in.", zones: [{ id: "a", name: "Car 6 door", col: 0, row: 0 }, { id: "b", name: "Tatami floor", col: 1, row: 0 }, { id: "c", name: "Lamp end", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "master", zone: "c" }, { t: "lantern", zone: "b" }, { t: "lantern", zone: "b", name: "Lantern Wisp (2)" }] }
    },
    start: "platform",
    scenes: {
      platform: { name: "Ueno Station, Platform 9", theme: "train", mood: "calm", lighting: "glow", weather: "train", cast: ["sato"],
        onEnter: [{ once: "in", steps: [
          { say: "Ueno at ten at night: a long steel train breathing steam, and a conductor in a pressed uniform checking his pocket watch on the platform. The sleeper to Aomori leaves in five minutes. It has, as of this week, one more car than it is supposed to." },
          { talk: { npc: "sato", text: "You are from the... Guard? We have had a number of letters. I must say that I have not seen any extra car. I count six. I have counted six every night for nine years." } }] }],
        options: [
          K.ask("sato", [
            K.t("What is wrong with this train?", ["Passengers go missing. I count them at Ueno, and at Fukushima, and at Morioka, and the number is always one less. But the manifest says six cars and I can see six. It is only that, at night, when I walk the length of the train, I count seven doors."], { free: true, clue: "c_manifest" }),
            K.t("Who goes missing?", "Nobody I can name. That's what is so bad. I know there is a gap in my book. I do not know whose.", { clue: "c_count" }),
            K.t("Who is the driver?", [{ say: "His watch hand stops." }, "Mori. He... has the engine. He has had it for some time. I haven't seen him come down."], { cha: 8, clue: "c_driver", obj: "so2" }),
            K.t("Is there anything you aren't telling us?", [{ say: "He opens the watch, and closes it." }, "My father was a conductor on this line. He used to say: don't answer when a station you don't know is called. It is not for you. It is for someone else."], { cha: 11, set: "sato_father" })
          ], { label: "Talk to Conductor Satō", name: "the conductor", bye: ["All aboard, please."] }),
          K.go("Board the train", "train")] },
      train: { name: "The sleeper, Ueno to Aomori", theme: "train", mood: "tense", lighting: "shadow", weather: "train",
        onEnter: [{ once: "in", steps: [{ say: "The train pulls out into the dark. Six cars, a dining car, a lamplit corridor. The rails click, the lamps sway, the night goes by, and for the first hour nothing happens, which you will think about later." }, { inc: "stn", by: 0 }] }],
        options: [
          K.go("Car 4: the passengers", "car4"),
          K.go("The dining car and the ticket inspector", "dining"),
          K.go("The engine cab", "engine", { hint: "Through the tender, along the catwalk" }),
          K.go("The door at the end of Car 5", "car5", { if: { clue: "c_ticket" } }),
          K.go("Wait for the loudspeaker", "speaker", { hint: "It calls stations between Utsunomiya and Fukushima" })] },
      car4: { name: "Car 4", theme: "train", mood: "calm", lighting: "glow", weather: "train", cast: ["hase", "kuroda"],
        onEnter: [{ once: "in", steps: [{ say: "A second-class sleeper: rows of berths, curtains half drawn. In one berth a woman sits upright with her hands clasped, looking at a small empty seat. Across the aisle, a student writes in a notebook, counting under his breath." }] }],
        options: [
          K.ask("hase", [
            K.t("What happened to your daughter?", ["Ayame. She is six. She went to the lavatory at the end of Car 5. She had a ticket in her hand. When I went to look for her there was a door that was not there before."], { free: true, clue: "c_ticket" }),
            K.t("Did you see the ticket?", "It said LAST STATION, ONE WAY. A green ticket. Not one of ours. I thought it was a toy.", { free: true, clue: "c_ticket" }),
            K.t("Will you help us?", [{ say: "She finally looks at you." }, "Please. Whatever you need. I will go anywhere on this train."], { cha: 6, set: "hase_help" })
          ], { label: "Talk to Mrs. Hasegawa", name: "Mrs. Hasegawa", bye: ["Please find her."] }),
          K.ask("kuroda", [
            K.t("What are you counting?", ["Stations. The ones I've heard. Between Utsunomiya and Fukushima, they call names that aren't on the line. Five of them. Each time, someone isn't here."], { clue: "c_stations" }),
            K.t("Who is missing?", "A salaryman with a briefcase. An old nun. A baker's boy. And I do not know who the others were. I am writing their names, as I remember them, but they get less every time.", { clue: "c_count" }),
            K.t("What are the stations?", [{ say: "He turns the notebook round." }, "Mukashi. Yomi. Kiri-no-Hashi. They are the old words for things. The last one on the list is Nowhere. I think it's called at the end."], { cha: 8, set: "stations_known" })
          ], { label: "Talk to the student", name: "Kuroda" }),
          K.go("Back to the corridor", "train")] },
      dining: { name: "The dining car", theme: "train", mood: "calm", lighting: "glow", weather: "train",
        onEnter: [{ once: "in", steps: [{ say: "White tablecloths, a waiter asleep on his feet, and at a corner table an inspector in a peaked cap with a ledger open before him and a punch in his fist." }] }],
        options: [
          K.find("Read the ticket inspector's book", "iq", "easy", "The inspector's ledger shows one passenger fewer at every station the loudspeaker calls: five missing since Ueno. Nobody has noticed, because nobody remembers them. The last entry: 'Aya-' and then nothing.", "A very small hand. A very small book.", { clue: "c_count", hint: "Easy" }),
          K.find("Look at the inspector's punch", "awareness", "medium", "The inspector's punch has a worn, thick handle and cuts a small round hole. You check the tickets on the table. Some have been punched once. Some twice. One has been punched three times, in a line, like a path.", "A punch. Ordinary.", { hint: "Awareness, Medium", clue: "c_punch", obj: "so3" }),
          K.go("Back to the corridor", "train")] },
      engine: { name: "The engine cab", theme: "train", mood: "dread", lighting: "dark", weather: "fire",
        onEnter: [{ once: "in", steps: [{ say: "The cab is hot and loud, a firebox glowing orange. At the regulator a man in a driver's cap stands very upright, hands on the controls, and does not turn his head." }] }],
        options: [
          K.find("Check the driver's log", "iq", "easy", "The driver's log has been signed in the same pen, every week, for nine years: Mori, Hiroshi. His relief has never come. He has never stopped.", "Columns of numbers.", { clue: "c_driver", obj: "so2", hint: "Easy" }),
          K.find("Speak to the driver", "charisma", "medium", "Mori turns his head, slowly. 'I thought I was only to take it as far as Fukushima,' he says. 'That was nine years ago.' He looks at the gauge, then at you. 'Stop the train? I can't. He won't let me. But if you give me my name, I'll know what to do.'", "He doesn't hear you. The needle doesn't move.", { hint: "Charisma, Medium", set: "mori_hint", tags: ["stop"] }),
          K.go("Back through the tender", "train")] },
      speaker: { name: "Between Utsunomiya and Fukushima", theme: "train", mood: "weird", lighting: "dark", weather: "train",
        onEnter: [{ once: "in", steps: [{ say: "The loudspeaker in the corridor clicks. A soft voice, very polite, says: 'Next stop, Mukashi. Mukashi. Passengers for Mukashi, please prepare to alight.' Nobody in the corridor moves. But in Car 4, a curtain falls, and a berth that had someone in it is empty." }, { clue: "c_stations" }] }],
        options: [
          K.find("Trace the speaker wire", "awareness", "medium", "The wire does not go to the engine. It goes through the wall of Car 5, and under the door at the end, and into a very faint light, the colour of old paper.", "A wire. It goes into the wall.", { hint: "Awareness, Medium", clue: "c_lantern" }),
          K.go("Back to the corridor", "train")] },
      car5: { name: "The end of Car 5", theme: "train", mood: "dread", lighting: "dark", weather: "train",
        onEnter: [{ once: "in", steps: [{ say: "At the end of Car 5, past the lavatory, there is a sliding paper door that is not on any plan. A faint warm light comes through it, the colour of old paper. A child's shoe lies on the sill." }, { objective: "po1" }] }],
        options: [
          { label: "Slide the door open, and go in", steps: [{ goto: "car7" }] },
          K.go("Go back", "train")] },
      car7: { name: "Car 7: the tatami car", theme: "train", mood: "boss", lighting: "shadow", weather: "none", cast: ["station"],
        onEnter: [{ once: "in", steps: [
          { say: "It is a tatami room, long and low, with paper walls and a single paper lantern hanging at the far end. It has no windows, and yet the landscape goes by in it, on the walls, like a magic-lantern show. A very small girl sits by the lantern with her hands in her lap." },
          { say: "Beside her stands a man in white gloves and a black cap. He says, in a soft, polite voice, to no one in particular: 'Next stop, Nowhere.'" },
          { clue: "c_lantern" }] }],
        options: [
          K.ask("station", [
            K.t("Who are you?", "The Station Master. Of the last station on this line. There is a stop at the end of every line, and I keep it. Please do not be alarmed.", { free: true }),
            K.t("Why do you call stations?", "Because someone must. Passengers must be told where they are getting off. It is a courtesy.", { clue: "c_stations" }),
            K.t("Why the child?", [{ say: "He turns his head very slightly toward Ayame." }, "A ticket was in her hand. A ticket in the hand of a passenger is a ticket. I do not make the rules. I only keep them."], { cha: 7, set: "ticket_rule" }),
            K.t("Would you let her go?", "If another ticket were offered for the same stop, I would have to accept it. That is also a rule. I have never been offered one.", { cha: 11, set: "bargain_open" })
          ], { label: "Speak to the Station Master", name: "the Station Master", bye: ["Please do not distract the child."] }),
          { label: "Offer a ticket in her place", hint: "A passenger's ticket, for the same stop", if: { all: ["bargain_open", "hase_help"] }, steps: [{ check: { aspect: "charisma", cr: "challenging", label: "Offer your own ticket for Ayame's", who: "choose", tags: ["bargain"],
            ok: [{ say: "He takes your ticket, and punches it, once. It is a small, round hole. He gives you the child's, which he has punched three times, with a very faint smile. 'Thank you. It is rare to be offered.' Ayame runs to the door, and to her mother, who is on the other side of it, as if she had never left." }, { objective: "so1" }, { set: "child_back" }],
            fail: [{ say: "He considers it, and gently shakes his head. 'It is not the same stop.'" }, { damage: { pool: "sanity", amount: 2 } }] } }] },
          { label: "Put out the lantern", hint: "The car, and the Master with it, drift off the line", if: { clue: "c_lantern" }, steps: [{ check: { aspect: "agility", cr: "medium", label: "Snuff the paper lantern before he speaks again", who: "choose",
            ok: [{ say: "You pinch out the wick. The room goes the colour of old paper, then of nothing. The Station Master straightens his cap. 'Of course,' he says. 'I will have to get off here.' And the car is gone, and you are in an ordinary corridor, on an ordinary train, with a child in your arms." }, { set: "res_lantern" }, { objective: "so1" }, { goto: "stop" }],
            fail: [{ say: "The lantern swings away from your hand. He calls the stop." }, { damage: { pool: "sanity", amount: 3 } }] } }] },
          { label: "Fight the Station Master", steps: [{ set: "res_fight" }, { combat: "car7", win: [{ say: "The Station Master bows, takes off his cap, and fades. The lanterns gutter. The car shudders, and is only a car." }, { goto: "stop" }] }] },
          { label: "Make the train stop at Aomori", hint: "Needs the driver's name", if: { obj: "so2" }, steps: [{ goto: "stop" }] }] },
      stop: { name: "Aomori, before dawn", theme: "train", mood: "calm", lighting: "shadow", weather: "none",
        onEnter: [{ once: "in", steps: [
          { say: "The train is still running, and Car 7 is gone, if it was ever there. The needle is on the stop. The driver has not been relieved." },
          { check: { aspect: "charisma", cr: "medium", label: "Call the driver by his own name, and tell him he can stop", who: "choose", tags: ["stop"],
            ok: [{ say: "'Mori Hiroshi. Driver. You are relieved.' You say it in the cab, loudly, over the noise. For a moment he does not move. Then, very carefully, he lets go of the regulator, and takes his cap off, and the train begins, at last, to slow." }, { set: "res_driver" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "He will not hear his name. Not yet. The train races on." }, { damage: { pool: "stability", amount: 3 } }] } }] }],
        options: [
          K.go("Try again, in the cab", "engine", { if: { not: { obj: "po2" } } }),
          { label: "Pull the emergency brake", hint: "Strength, Challenging", if: { not: { obj: "po2" } }, steps: [{ check: { aspect: "strength", cr: "challenging", label: "Throw the brake against nine years of momentum", who: "choose", tags: ["stop"],
            ok: [{ say: "The brake screams. The train groans, and buckles, and slows." }, { set: "res_brake" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "The brake does not take." }, { damage: { pool: "health", amount: 4 } }] } }] }] },
      end: { name: "Aomori station, dawn", theme: "train", mood: "calm", lighting: "glow", weather: "none",
        onEnter: [{ once: "in", steps: [
          { say: "The train rolls into Aomori at dawn: an ordinary train, with every passenger who ought to be aboard still aboard. On the platform a very old railway man blinks at the sun, and takes off his cap, and goes home." },
          { if: { flag: "res_driver" }, then: [{ say: "Mori Hiroshi was relieved after nine years, by his own name, and by you." }] },
          { if: { flag: "res_brake" }, then: [{ say: "The brake held, and the train stopped, and the Station Master did not get his last stop. He will find another train, in time." }] },
          { if: { flag: "res_lantern" }, then: [{ say: "The lantern is out, and Car 7 with it. Somewhere on the line a paper lantern is still burning, waiting to be hung." }] },
          { if: { flag: "res_fight" }, then: [{ say: "You broke the Station Master, and nobody will call a station on this line again." }] },
          { if: { obj: "so1" }, then: [{ say: "Ayame sleeps with her ticket under her pillow. She doesn't remember the stop." }], else: [{ say: "Mrs. Hasegawa sits on the platform with a small shoe in her lap. The Guard will not stop looking for her daughter." }] },
          { end: "win" }] }], options: [] }
    }
  });

  /* ======================================================================= 1958 · The Last Picture Show */
  ADV.register({
    id: "last-picture-show", title: "The Last Picture Show", setting: "Nevada · 1958", year: 1958, level: [1, 9], agencies: ["NSBD", "WCA"], region: "americas-north", theme: "drive",
    summary: "The Starlite Drive-In runs a free film every night, and every night the audience sits very still. Tonight's feature, the posters say, is THE END. A projectionist, a snack-bar girl and a sheriff who has stopped coming to work: none of them will say what they see on the screen.",
    objectives: [
      { id: "po1", kind: "primary", t: "Find out what the film shows, and who made it", done: "A reel of 16mm found in a Nevada test-site bunker. It shows the watcher exactly how they will die, and then asks them, kindly, to buy a ticket." },
      { id: "po2", kind: "primary", t: "Stop the screening", done: "The projector stays dark. The audience wakes in their cars and drives home." },
      { id: "so1", kind: "secondary", t: "Get the projectionist to talk", done: "Walt Brannigan has run the Starlite for twenty years. He knows what the film has been doing to his regulars, and he has been splicing it shorter every night.", benefit: { label: "A cut reel", text: "Walt's spliced copy: a bonus on every roll to resist the film while it runs.", bonus: { tags: ["film"], value: 2 } } },
      { id: "so2", kind: "secondary", t: "Find the reel's origin: the test-site bunker", done: "The film came from a Nevada test-site bunker, where a cameraman who stayed to watch the blast filmed what he saw, and what he saw looked back.", benefit: { label: "The original can", text: "You can destroy the reel at its source. A bonus on every roll to unmake the film.", bonus: { tags: ["unmake"], value: 3 }, flag: "have_can" } },
      { id: "so3", kind: "secondary", t: "Learn what the Marshall girl saw", done: "Jean Marshall, the snack-bar girl, watched the film from the booth and saw nothing but the ending.", benefit: { label: "She knows the ending", text: "You know what the film shows last, and how to look away: +2 to your attacks against the Watcher.", combat: { enemy: "watcher", attack: 2 } } }
    ],
    clues: {
      c_still: { t: "The audience sits very still", s: "The lot", x: "Two hundred cars, windows up, engines off, and everyone in them looking at the screen. They do not answer when you knock on the glass." },
      c_poster: { t: "THE END", s: "The marquee", x: "The marquee says THE END in letters a foot high. It has said that every night for six weeks. Nobody has been able to find the booking for it." },
      c_sheriff: { t: "The sheriff stopped coming in", s: "Deputy Aldous", x: "Sheriff Boyd has not come into the office in three weeks. His car is parked at the Starlite every night. He is in it." },
      c_reel: { t: "The reel has no label", s: "The projection booth", x: "The projector is loaded with a 16mm reel in an unmarked can, scorched at the edges. The distributor's invoice says nothing; the film was not booked, it was delivered." },
      c_test: { t: "The can came from the test site", s: "Walt Brannigan", x: "The can was left at the box office in a truck with a Department of Energy plate. Inside it, a note: 'Found in bunker 4. Do not run.'" },
      c_cameraman: { t: "A man who stayed to watch", s: "The test-site bunker", x: "In 1952 a cameraman called Elias Frame stayed at the bunker door to film a blast, against orders. He was found three days later, in front of the shot, with his eyes open." },
      c_end: { t: "The last frame is a mirror", s: "Jean Marshall", x: "The film ends on a mirror. Anyone looking at it sees themselves watching, and then sees what happens to the watcher. After that, the film asks them, kindly, to buy a ticket." }
    },
    npcs: {
      walt: N("Walt Brannigan", "Projectionist · twenty years at the Starlite", "A big, stooped man in a plaid shirt with a cigarette that has burned down to his fingers, and the eyes of a man who has seen the same film too many times.", F(0, 5, "short", 5, "none", { sex: "m" })),
      jean: N("Jean Marshall", "Snack-bar girl · 19", "A bright, thin girl in a paper hat and a striped apron, with her fingers pressed against her eyelids, and a laugh that comes too quickly.", F(0, 3, "ponytail", 5, "none", { sex: "f" })),
      aldous: N("Deputy Aldous", "Deputy sheriff", "Young, clean, and exhausted, with a revolver he keeps touching as though he'd forgotten whether it was loaded.", F(0, 4, "short", 6, "none", { sex: "m" }))
    },
    enemies: {
      watcher: { build: { name: "The Watcher", type: "Beyond", difficulty: "challenging", sprite: "spirit", hue: 220, dtype: "sanity", range: 1, core: { body: 0, mind: 3, spirit: 3 }, mods: ["Occult"],
        text: "What the film lets in. Premonition: each round, one agent sees how they will die: Willpower Medium or take 4 Sanity and lose their action. It cannot be hurt in a lit zone; the projector is the only light that is its own. Only Sanity harms it, and each time it takes damage from the screen's reflection, it heals.", dies: "the screen goes white, and then dark, and for the first time in six weeks the lot is silent" } },
      viewer: { build: { name: "Entranced viewer", type: "Human", difficulty: "easy", sprite: "humanoid", hue: 210, attack: 0, dtype: "health", dies: "slumps against the car door, breathing, and wakes up in a moment" } }
    },
    encounters: {
      booth: { name: "The projection booth", theme: "interior", lit: false, fightText: "The projector turns itself on. The beam goes out through the little window, and across the lot, and a hundred car windows go white at once. Behind you, in the beam, something looks back.", zones: [{ id: "a", name: "The stair", col: 0, row: 0 }, { id: "b", name: "The booth", col: 1, row: 0 }, { id: "c", name: "The beam", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "watcher", zone: "c" }, { t: "viewer", zone: "b" }, { t: "viewer", zone: "b", name: "Entranced viewer (2)" }] }
    },
    start: "lot",
    scenes: {
      lot: { name: "The Starlite Drive-In", theme: "drive", mood: "dread", lighting: "shadow", weather: "night", cast: ["aldous"],
        onEnter: [{ once: "in", steps: [
          { say: "Out past Beatty, off the highway, in the middle of nothing: a huge white screen on legs, a marquee, and two hundred cars in rows facing it with their engines off and their windows up. Nobody is eating. Nobody is talking. A cold wind blows tumbleweed across the lot and the cars don't move." },
          { say: "The marquee says THE END in letters a foot high." },
          { clue: "c_still" }, { clue: "c_poster" },
          { talk: { npc: "aldous", text: "Thank God. They told me the Division would send someone. I can't look at the screen. I keep looking at it. Please." } }] }],
        options: [
          K.ask("aldous", [
            K.t("What is happening?", ["It started in the spring. People sit down in front of the film, and they don't look away. They sit through all of it, and they don't come out of their cars. In the morning they drive home. They don't talk about it. And they come back the next night."], { clue: "c_still" }),
            K.t("Where is the sheriff?", [{ say: "He glances toward a squad car in the third row." }, "Boyd. He's in that car. He's been in it for three weeks. I knock on the glass every night, and every night he tells me it's all right."], { clue: "c_sheriff" }),
            K.t("Have you seen the film?", "Once. Don't. I only saw the first minute. I don't want to say what it was.", { free: true, cha: 7 }),
            K.t("Who runs the drive-in?", "Walt Brannigan, the projectionist. He's in the booth. The snack-bar girl is Jean Marshall. They're the only two I'd trust to still be themselves.", { free: true, set: "booth_known" })
          ], { label: "Talk to Deputy Aldous", name: "the deputy", bye: ["I'll be here, with my back to it."] }),
          K.find("Knock on a car window", "charisma", "medium", "In the nearest car a woman in a headscarf, eyes wide and unblinking, mouths along with something. When you knock she turns her face, an inch at a time, and says very clearly: 'Not yet. I'm not at the part with me in it.'", "Nothing. Nothing at all.", { hint: "Charisma, Medium", clue: "c_still", failDamage: ["sanity", 2] }),
          K.go("To the snack bar", "snack"),
          K.go("To the projection booth", "booth", { if: "booth_known" }),
          K.go("Stay for tonight's screening", "finale", { hint: "When you know enough to stop it", if: { all: [{ clue: "c_reel" }, { clue: "c_end" }] } })] },
      snack: { name: "The snack bar", theme: "interior", mood: "calm", lighting: "glow", weather: "none", cast: ["jean"],
        onEnter: [{ once: "in", steps: [{ say: "A little concrete building under the screen, smelling of popcorn and hot oil, with neon in the window. A girl in a paper hat stands behind the counter with her fingers pressed against her eyelids." }] }],
        options: [
          K.ask("jean", [
            K.t("Are you all right?", ["I'm doing the counter. Somebody has to do the counter."], { free: true }),
            K.t("Have you seen the film?", [{ say: "She takes her fingers away from her eyes." }, "I saw it. From the booth. I saw the ending, only the ending. That was enough."], { clue: "c_end", obj: "so3" }),
            K.t("What does it show?", "A mirror. You see yourself, watching. And then you see what happens to the watcher. After that it asks you, very kindly, to buy a ticket.", { cha: 8, clue: "c_end" }),
            K.t("How do you not look?", [{ say: "She laughs, a little too quickly." }, "You look at the corner of the screen. Not at the middle. At the corner, there's a smudge, a place where the paint's peeled. You look at that."], { cha: 11, set: "corner_trick" })
          ], { label: "Talk to Jean", name: "Jean", bye: ["Popcorn's free. It's always free."] }),
          K.find("Search the snack bar office", "iq", "easy", "In a desk drawer: a delivery slip, a truck with a Department of Energy plate, dated the sixth of March. Handwritten on the back: 'Left at box office: one can, 16mm. Do not run.' Signed with a smudge.", "Receipts, a pencil, a Bible.", { clue: "c_test", hint: "Easy" }),
          K.go("Back to the lot", "lot")] },
      booth: { name: "The projection booth", theme: "interior", mood: "weird", lighting: "dark", weather: "none", cast: ["walt"],
        onEnter: [{ once: "in", steps: [{ say: "A cramped room over the snack bar, two big projectors, a rewind bench and a man in a plaid shirt with a cigarette burned down to his fingers. The projector is running. The reel is turning. He is not looking at it." }] }],
        options: [
          K.ask("walt", [
            K.t("What are you showing?", ["I don't book it. It was delivered. In March, a truck came, a government plate, left a can on the box-office step. I ran it, because I run what's delivered."], { free: true, clue: "c_reel" }),
            K.t("What is it?", [{ say: "He looks at the reel for the first time." }, "It's a man standing at a bunker door, filming. He's filming a blast. He turns round. And then it's you."], { free: true, clue: "c_test", obj: "so1" }),
            K.t("Why do you keep running it?", "Because if I don't, they don't go home. I tried, once. They sat in their cars all night, in the dark, waiting. In the morning two of them were dead.", { cha: 7 }),
            K.t("Can it be cut?", "I've cut it. Four minutes a night. I'm down to eleven. The ending's still the ending.", { cha: 10, set: "walt_cut" })
          ], { label: "Talk to Walt", name: "Walt", bye: ["Don't look at the window. Don't."] }),
          K.find("Examine the can and the reel", "awareness", "medium", "The can is scorched, with a stamp on its lid: US ATOMIC ENERGY COMMISSION, NEVADA PROVING GROUNDS, BUNKER 4. Inside, the film is 16mm, an inch of it brown with scorching. It smells of hot sand and cold metal.", "A can. A reel. Hard to see.", { clue: ["c_reel", "c_test"], hint: "Awareness, Medium", tags: ["film"] }),
          K.find("Splice a safe copy", "iq", "medium", "Working by flashlight, you splice a short, harmless loop for the projector, and set the real can aside. Walt, behind you, exhales for the first time in six weeks.", "The splice jams, and the beam flickers, and you feel it look at you.", { if: "walt_cut", hint: "Intelligence, Medium", tags: ["film"], set: "safe_loop", failDamage: ["sanity", 2] }),
          K.go("Back to the lot", "lot"),
          K.go("Drive out to the test-site bunker", "bunker", { if: { clue: "c_test" } })] },
      bunker: { name: "Bunker 4, Nevada Proving Grounds", theme: "desert", mood: "dread", lighting: "glow", weather: "wind",
        onEnter: [{ once: "in", steps: [{ say: "Eighty miles of dirt road, a chain-link gate nobody guards any more, and a squat concrete bunker half-sunk in the sand. The door is open. At its threshold there is a tripod, an old Bell & Howell on it, and a bleached skeleton still sitting in front of it, one hand on the crank." }, { objective: "so2" }] }],
        options: [
          K.find("Search the bunker's logbook", "iq", "medium", "A cameraman's logbook: Elias Frame, 1952. 'Disobeyed orders. Stayed to film the shot. I will film what I see.' The entries end the same day. The last is a single word, repeated in a ruled column, all the way down the page: WATCHING.", "A log. Mostly numbers.", { clue: "c_cameraman", hint: "Intelligence, Medium" }),
          K.find("Take the original can's twin from the shelf", "awareness", "easy", "On the bunker's shelf, under the dust, there are still two cans of the same film, unrun. Together with the one at the Starlite, they make a set of three. The lid of each bears a single word: MASTER.", "Dust. Rust.", { hint: "Easy", set: "have_cans" }),
          K.go("Back to the Starlite", "lot")] },
      finale: { name: "The projection booth, tonight", theme: "interior", mood: "boss", lighting: "dark", weather: "none",
        onEnter: [{ once: "in", steps: [{ say: "Dusk, and the lot fills up. Headlights, windows rolling up, engines off. The projector starts. In the beam, something is looking back." }, { objective: "po1" }] }],
        options: [
          { label: "Run the spliced loop in place of the reel", hint: "Needs Walt's cut, and the safe loop", if: "safe_loop", steps: [{ check: { aspect: "iq", cr: "medium", label: "Swap the reel and keep the beam steady", who: "choose", tags: ["film", "unmake"],
            ok: [{ say: "The beam wobbles, steadies, and fills the screen with a harmless loop of Walt's own home movies. Two hundred cars sit blinking in the dark, and one by one the engines start, and they drive home." }, { set: "res_loop" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "The reel jams. The beam goes white." }, { damage: { pool: "sanity", amount: 3 } }] } }] },
          { label: "Burn the three cans together", hint: "Needs the bunker's twins", if: "have_cans", steps: [{ check: { aspect: "strength", cr: "medium", label: "Break open the cans and light them in the booth", who: "choose", tags: ["unmake"],
            ok: [{ say: "You lay the three cans on the booth floor and put a match to them. The film curls and flares. For a moment, the beam shows you the mirror, and then nothing. Outside, the screen goes white, and dark." }, { set: "res_burn" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "The cans do not catch." }, { damage: { pool: "stability", amount: 3 } }] } }] },
          { label: "Face the Watcher in the beam", steps: [{ set: "res_fight" }, { combat: "booth", win: [{ say: "The beam goes white, and then dark. In two hundred cars, two hundred people sit up and ask where they are." }, { objective: "po2" }, { goto: "end" }] }] }] },
      end: { name: "The Starlite Drive-In, the morning after", theme: "drive", mood: "calm", lighting: "glow", weather: "none",
        onEnter: [{ once: "in", steps: [
          { say: "The sun comes up over the empty screen. Two hundred cars start up and pull out onto the highway, and nobody remembers what they came for." },
          { if: { flag: "res_loop" }, then: [{ say: "Walt's home movies run for a week at the Starlite, to full houses. The can goes to the Division in a lead-lined box, and Walt keeps the key." }] },
          { if: { flag: "res_burn" }, then: [{ say: "The three cans are ash, and the marquee, in the morning, says only STARLITE." }] },
          { if: { flag: "res_fight" }, then: [{ say: "You broke the thing in the beam. Some of you will not sleep with a window facing east for a long time." }] },
          { if: { obj: "so1" }, then: [{ say: "Walt Brannigan retires, and sells the drive-in to a man who runs westerns." }] },
          { if: { obj: "so3" }, then: [{ say: "Jean Marshall goes to Reno, to a school for typing. She looks at the corner of every screen she ever sits in front of." }] },
          { say: "Sheriff Boyd comes out of his car at dawn, blinking, and goes to work." },
          { end: "win" }] }], options: [] }
    }
  });
})();
