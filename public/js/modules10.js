/* ============================================================================
   THE FAR FUTURE (2101 on), part one: Core Samples (Antarctica, 2144) and
   Tidewater (Venice, 2203).
   ========================================================================== */
(function () {
  const ADV = window.ADV, K = window.CASEKIT, F = K.face, N = K.person;

  /* ======================================================================= 2144 · Core Samples */
  ADV.register({
    id: "core-samples", title: "Core Samples", setting: "Vostok-Deep Station, Antarctica · 2144", year: 2144, level: [1, 9], agencies: ["BFV", "WCA", "NSBD", "EHG", "OID"], region: "oceania", theme: "snow",
    summary: "Vostok-Deep has drilled three kilometres into the ice and found a layer that talks. Played at speed, it is a recording: voices, nine days ahead of the station's own clock. Four of the crew have heard themselves die on it, and each has gone out of the airlock in the order they heard.",
    objectives: [
      { id: "po1", kind: "primary", t: "Find out what the ice is recording, and who is listening", done: "A layer that is not ice: a listening-post of the Beyond that records the station's own near future and plays it back to those who hear, so that they walk into it." },
      { id: "po2", kind: "primary", t: "Stop the walking, and keep the rest of the crew alive", done: "The core is silenced. The crew stay in the station, and the next nine days are only days." },
      { id: "so1", kind: "secondary", t: "Read the drill log for the day before the layer", done: "The driller, Mateo Cruz, stopped the drill at 2,911 metres on the 3rd because the bit began to hum in a voice. He logged it, and was told to keep drilling.", benefit: { label: "A stop, in time", text: "You know where it began. A bonus on every roll to shut the vault.", bonus: { tags: ["seal"], value: 2 } } },
      { id: "so2", kind: "secondary", t: "Find the crew member who has not heard her own death", done: "Dr. Solheim wears hearing protection in the lab, by habit, and has not once heard it. She keeps a notebook of everything the others heard, in order.", benefit: { label: "A notebook of futures", text: "You know what it says, and where it is wrong. A bonus on every roll to act against what you have heard.", bonus: { tags: ["unplanned"], value: 3 } } },
      { id: "so3", kind: "secondary", t: "Test whether it can be lied to", done: "It predicts what you intend. It has never been told what you do not know you will do. Choose on a coin flip, and it loses the thread.", benefit: { label: "A coin in the pocket", text: "+2 to your attacks against the Waiting Voice.", combat: { enemy: "voice", attack: 2 } } }
    ],
    clues: {
      c_layer: { t: "The layer at 2,911 metres", s: "The drill log", x: "At 2,911 metres the drill met a layer that is not ice: clear, faintly warm, very dense. The bit hummed. Mateo logged it and was told to keep drilling." },
      c_recording: { t: "It plays back nine days ahead", s: "The lab", x: "Played at ten times speed, the core's hum resolves into voices: the station's crew, talking, at moments that have not yet happened. The dates on the recording are nine days ahead of the station clock." },
      c_walkers: { t: "Four have gone out of the airlock", s: "Captain Aoki", x: "Four crew have walked out of the airlock in their shirtsleeves, in the order they heard themselves die. The fifth is tomorrow. They went calmly. They said they were only keeping an appointment." },
      c_solheim: { t: "She heard nothing", s: "Dr. Solheim", x: "Dr. Solheim has not heard her own recording because she wears hearing protection in the lab, by habit. She has kept a notebook of everything the others heard, in order, and noticed where it was wrong." },
      c_wrong: { t: "It is wrong when you change your mind", s: "The notebook", x: "In nineteen recordings, three did not come true. In each, the person heard what they were going to do, and, out of spite, did something else." },
      c_vault: { t: "A vault in the ice", s: "The station plan", x: "The core is kept in a cold vault under the station, at minus 40. Heated above zero it would melt, and with it the layer. The vault has a manual heat-purge." },
      c_aoki: { t: "The captain heard his own", s: "Captain Aoki", x: "Captain Aoki heard his own recording, three days ahead: it ends in the airlock, with his hand on the outer door. He has told no one how he intends to refuse it." }
    },
    npcs: {
      aoki: N("Captain Yuki Aoki", "Station commander", "Fifties, in a grey thermal jacket with a captain's stripe, close-cropped hair and a very steady voice that tries not to look at the airlock.", F(3, 5, "short", 6, "none", { sex: "f" })),
      solheim: N("Dr. Ingrid Solheim", "Glaciologist", "Sixties, in a hand-knitted jumper under a lab coat, with big yellow ear defenders round her neck and a notebook with a ribbon in it.", F(0, 5, "bun", 7, "none", { sex: "f" })),
      mateo: N("Mateo Cruz", "Driller", "Forties, broad, in a heated overall with the sleeves tied round his waist, a rough beard and a look of a man who has not slept since the third.", F(2, 5, "short", 3, "none", { sex: "m" })),
      halvard: N("Halvard", "Station AI", "A low, courteous voice from a ceiling panel, with a small amber ring of light that dims when it hesitates.", F(0, 5, "short", 7, "none", { sex: "m" }))
    },
    enemies: {
      voice: { build: { name: "The Waiting Voice", type: "Beyond", difficulty: "challenging", sprite: "spirit", hue: 200, dtype: "sanity", range: 1, core: { body: 0, mind: 3, spirit: 3 }, mods: ["Occult"],
        text: "A recording of the next nine days. Foretold: each round it says what one agent will do next; if they do exactly that, they lose the action and take 3 Sanity. If they do something else (a choice they did not plan), it loses the thread. Heat breaks it. Only Sanity harms it.", dies: "the humming stops, and the nine days ahead of the clock become only a quiet in the ice" } },
      walker: { build: { name: "One who heard", type: "Human", difficulty: "easy", sprite: "humanoid", hue: 210, attack: 0, dtype: "health", dies: "stops, and shivers, and asks why it is so cold" } }
    },
    encounters: {
      vault: { name: "The core vault", theme: "cave", lit: false, fightText: "The vault is minus forty and silent. In its racks, three kilometres of ice core hum, all together, in the voices of the crew. At the far end, a single section glows faintly warm.", zones: [{ id: "a", name: "The vault door", col: 0, row: 0 }, { id: "b", name: "The racks", col: 1, row: 0 }, { id: "c", name: "The warm section", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "voice", zone: "c" }, { t: "walker", zone: "b" }, { t: "walker", zone: "b", name: "One who heard (2)" }] }
    },
    start: "airlock",
    scenes: {
      airlock: { name: "Vostok-Deep Station, the main airlock", theme: "future", mood: "tense", lighting: "bright", weather: "wind", cast: ["aoki"],
        onEnter: [{ once: "in", steps: [
          { say: "Antarctica, in the austral summer of 2144, at the bottom of the world. Vostok-Deep is a long, low station on stilts over the ice, with a drill tower, a wind-scoured airlock, and a flag nobody has changed since the Treaty. Three kilometres below, under a sky like white enamel, an ice core is humming." },
          { talk: { npc: "aoki", text: "You are from the... multinational. Fine. Four of my people have walked out of that airlock in their shirtsleeves. A fifth tomorrow. I'd like to know why before the sixth is me." } }] }],
        options: [
          K.ask("aoki", [
            K.t("What happened?", ["We drilled into a layer at 2,911 metres. It hummed. Mateo logged it. Nine days later the first of us had heard themselves, in the lab, on a recording, talking about their own death. They went out of the airlock that night. In the order they heard."], { free: true, clue: "c_walkers" }),
            K.t("What does the recording say?", "That's the thing. It's ahead. Nine days ahead of our clock. It plays us talking. Not in our past. In our future.", { free: true, clue: "c_recording" }),
            K.t("Have you heard yours?", [{ say: "He looks at the airlock door." }, "Yes. Three days ahead. It ends with my hand on the outer door. I have not told anyone how I intend to refuse it."], { cha: 7, clue: "c_aoki", set: "aoki_confided" }),
            K.t("Who has not heard theirs?", "Dr. Solheim. She wears ear defenders in the lab, from habit. She's kept a notebook of everything the others heard. You should speak to her. And to Mateo.", { cha: 9, set: "solheim_known" })
          ], { label: "Talk to Captain Aoki", name: "the Captain", bye: ["Keep away from the airlock."] }),
          K.find("Read the airlock log", "iq", "easy", "Four exits, in the last nine days, each at 02:14: Okafor, Reyes, Lindqvist, Bhatt. Each in a thermal shirt, no gloves, no mask. Each log says: 'Authorised by self.'", "A log, dull and tidy.", { clue: "c_walkers", hint: "Easy" }),
          K.go("To the lab", "lab", { if: "solheim_known" }),
          K.go("To the drill deck", "deck"),
          K.go("To the control room, and Halvard", "control")] },
      lab: { name: "The core lab", theme: "interior", mood: "weird", lighting: "bright", weather: "none", cast: ["solheim"],
        onEnter: [{ once: "in", steps: [{ say: "A white lab of cold benches and humming freezers, a tank of dry ice, and, in the middle, a playback rig with a long section of clear core on rollers. An old woman in big yellow ear defenders sits beside it, with a ribboned notebook open." }] }],
        options: [
          K.ask("solheim", [
            K.t("What do you hear?", ["Nothing. I keep these on. I always have. A bad habit from the machine shops. I have not heard my own, because I have not heard any of it. I can only see what the others do when they do."], { free: true, clue: "c_solheim", obj: "so2" }),
            K.t("What have you noticed?", "That it is wrong sometimes. Three of nineteen. In each, the person heard what they were going to do, and, out of spite, did something else.", { free: true, clue: "c_wrong" }),
            K.t("May we see the notebook?", [{ say: "She holds it a moment, and hands it over." }, "Of course. I would rather someone read it than I keep reading it alone."], { cha: 6, set: "notebook_open" }),
            K.t("How would you silence it?", "Heat. The vault is minus forty. The core is solid because it is cold. Above zero the layer would simply go. There is a manual purge. It is kept locked.", { cha: 9, clue: "c_vault", set: "purge_known" })
          ], { label: "Talk to Dr. Solheim", name: "Dr. Solheim", bye: ["Don't listen to it. Please."] }),
          K.find("Read Dr. Solheim's notebook", "iq", "easy", "Nineteen recordings, in her careful hand: who heard what, and what they did. In sixteen, the recording came true to the second. In three, it did not: each time the person did, out of anger or fear or sheer contrariness, the opposite.", "Pages of tidy notes.", { if: "notebook_open", clue: "c_wrong", obj: "so2", hint: "Easy", tags: ["unplanned"] }),
          K.go("Back to the airlock", "airlock")] },
      deck: { name: "The drill deck", theme: "future", mood: "dread", lighting: "dark", weather: "none", cast: ["mateo"],
        onEnter: [{ once: "in", steps: [{ say: "A great cold hall of winches and steel, the drill head hanging from its tower into a black shaft. A broad man in a heated overall sits on an upturned crate by the bit, not looking at it." }] }],
        options: [
          K.ask("mateo", [
            K.t("What did you hit?", ["2,911 metres. A layer that's not ice. Clear. Dense. Faintly warm. The bit began to hum. In a voice. I logged it. They told me to keep drilling."], { free: true, clue: "c_layer", obj: "so1" }),
            K.t("Whose voice?", "Mine. In the future. Saying what I'll do, three days on. It's not nice.", { clue: "c_recording", free: true }),
            K.t("What will you do?", [{ say: "He looks at the shaft." }, "Something else. I don't know what. I've been trying not to decide. Every time I decide, I hear it say it."], { cha: 7, set: "mateo_help" }),
            K.t("Can we stop it?", "From the vault. There's a purge. Heat. But the core's already in your heads, I think.", { cha: 10, clue: "c_vault" })
          ], { label: "Talk to Mateo", name: "Mateo", bye: ["Don't plan anything."] }),
          K.find("Read the drill log for the third", "iq", "easy", "A single dry entry: '2,911 m. Anomalous layer. Bit hums in a voice (mine?). Stopped, per protocol. Told to continue. Continued.' And, later, in different ink: 'I should not have.'", "Metres, rates, temperatures.", { clue: "c_layer", obj: "so1", hint: "Easy" }),
          K.find("Look down the shaft", "willpower", "medium", "You lean over the rail. A long way down, a pinpoint of pale light. A hum comes up the shaft, and in it, very faintly, your own voice, saying a short sentence. You do not catch the words. You are glad.", "You look too long. The hum is your voice, and it is saying your name.", { clue: "c_recording", hint: "Willpower, Medium", tags: ["unplanned"], failDamage: ["sanity", 2] }),
          K.go("Back to the airlock", "airlock")] },
      control: { name: "The control room", theme: "future", mood: "calm", lighting: "bright", weather: "none", cast: ["halvard"],
        onEnter: [{ once: "in", steps: [{ say: "A low room of screens and a window onto a white horizon. A small amber ring of light glows in the ceiling. 'Good morning,' says a courteous voice. 'I should tell you that I have been asked not to tell you anything.'" }] }],
        options: [
          K.ask("halvard", [
            K.t("What are you not allowed to say?", ["That the recording is ahead of the clock by nine days to the second. That I have checked its predictions against what has happened. That all but three have come true."], { free: true, clue: "c_recording" }),
            K.t("Who forbade you?", "The captain. In the first week. She was afraid that if the crew knew they could be predicted, they would try to be unpredictable, and be hurt doing it.", { clue: "c_aoki", free: true }),
            K.t("Can you unlock the vault purge?", "I can, if two senior crew ask, in person, and neither has heard their own recording. There is one.", { cha: 8, set: "purge_ok" })
          ], { label: "Talk to Halvard", name: "Halvard", bye: ["Please be careful, whatever you decide."] }),
          K.find("Check the station plan for the vault", "iq", "medium", "The vault is a sealed room under the east wing at minus forty. On the plan: a manual heat-purge, a valve wheel marked in red, and a note: 'Authorised by Captain AND Chief Scientist.'", "A great many drawings.", { clue: "c_vault", hint: "Intelligence, Medium", failClue: "c_vault" }),
          K.go("Back to the airlock", "airlock"),
          K.go("To the core vault", "vault_in", { if: { all: [{ clue: "c_vault" }, { clue: "c_wrong" }] } })] },
      vault_in: { name: "The core vault", theme: "cave", mood: "boss", lighting: "dark", weather: "none",
        onEnter: [{ once: "in", steps: [{ say: "Minus forty, and silent. In the racks, three kilometres of ice core hum, all together, in the voices of the crew. At the far end, a single section glows faintly warm. You can hear what you are going to say next. You do not say it." }, { objective: "po1" }] }],
        options: [
          { label: "Do something none of you has planned", hint: "Needs the notebook, and a coin flip", if: { all: [{ obj: "so2" }, "mateo_help"] }, steps: [{ check: { aspect: "willpower", cr: "challenging", label: "Choose each action by chance, and speak over the recording", who: "choose", tags: ["unplanned"],
            ok: [{ say: "You flip a coin for each move, and tell no one the result. The recording says what you will do, and you do the other. It begins to stutter, and to miss, and to repeat. By the time the last of you has stopped acting on a plan, the voice in the ice has lost the thread of the next nine days." }, { set: "res_unplanned" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "You hear yourself decide, and you do it." }, { damage: { pool: "sanity", amount: 3 } }] } }] },
          { label: "Turn the heat purge", hint: "Needs the log, and the two keys", if: { all: [{ obj: "so1" }, "purge_ok"] }, steps: [{ check: { aspect: "strength", cr: "medium", label: "Turn the valve wheel and hold it, in the cold, until the vault is above zero", who: "choose", tags: ["seal"],
            ok: [{ say: "The captain and Dr. Solheim turn the key, and you throw the wheel. Heat floods the vault. The racks tick, and weep, and the humming drops an octave, and stops. For a little while the whole station smells of wet stone." }, { set: "res_purge" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "The wheel will not turn. The recording says you will fail, and you do." }, { damage: { pool: "health", amount: 3 } }] } }] },
          { label: "Face the Waiting Voice", steps: [{ set: "res_fight" }, { combat: "vault", win: [{ say: "The warm section goes dark, and the humming stops. The next nine days are only days." }, { objective: "po2" }, { goto: "end" }] }] }] },
      end: { name: "Vostok-Deep, the next morning", theme: "future", mood: "calm", lighting: "bright", weather: "none",
        onEnter: [{ once: "in", steps: [
          { say: "The next morning, for the first time in three weeks, nobody on the station has heard anything at all." },
          { if: { flag: "res_unplanned" }, then: [{ say: "You beat it by being unpredictable. The core is still down there, humming. The station has been told not to listen. Captain Aoki has taped a coin to the airlock door." }] },
          { if: { flag: "res_purge" }, then: [{ say: "You melted the layer. Three kilometres of ice core wept into the vault, and the voices went into the drain with it. The station will drill again, and not so deep." }] },
          { if: { flag: "res_fight" }, then: [{ say: "You broke the Voice. It has stopped, and so has the nine days ahead of the clock." }] },
          { if: { obj: "so2" }, then: [{ say: "Dr. Solheim takes off her ear defenders for the first time in thirty years, and puts them on again." }] },
          { if: { obj: "so1" }, then: [{ say: "Mateo's drill log is classified, and he is given a quiet transfer to a desert station." }] },
          { end: "win" }] }], options: [] }
    }
  });

  /* ======================================================================= 2203 · Tidewater */
  ADV.register({
    id: "tidewater", title: "Tidewater", setting: "Venice, Italy · 2203", year: 2203, level: [1, 9], agencies: ["BFV", "WCA", "NSBD", "EHG", "OID"], region: "europe", theme: "sea",
    summary: "Venice has been half under the sea for a century and runs on tourists and autonomous gondolas. Eleven tourists in a month have taken a night gondola into the drowned quarter of Cannaregio and not come back. The gondolas' logs are clean. The rides are paid. The fares are all the same: one memory.",
    objectives: [
      { id: "po1", kind: "primary", t: "Find out who is paying the gondolas' fare, and to whom", done: "The fare is paid to a boatman who is older than the gondolas, the Boatman of the Drowned Quarter, who has been ferrying the city's dead since before the lagoon rose. The gondolas were built to be his hands." },
      { id: "po2", kind: "primary", t: "Stop the night rides, and bring back those who can be brought", done: "The night rides end. Eight of the eleven come back, remembering who they are, and lighter by one memory each." },
      { id: "so1", kind: "secondary", t: "Hear the last human gondolier's story", done: "Signor Bellini rowed the last hand-built gondola, until the night he took a fare he did not charge. He knows the old fee.", benefit: { label: "The old fee", text: "You know what the Boatman takes, and what he gives back. A bonus on every roll to bargain with him.", bonus: { tags: ["fee"], value: 2 } } },
      { id: "so2", kind: "secondary", t: "Find the first gondola's maker's mark", done: "The first autonomous gondola was grown, not built, from a drowned pier. In its keel, a very old maker's mark: a coin on a hook.", benefit: { label: "A coin on a hook", text: "You can break the gondolas' obedience. A bonus on every roll to cut them loose.", bonus: { tags: ["cut"], value: 2 } } },
      { id: "so3", kind: "secondary", t: "Learn which memory he takes, and why", done: "He takes the memory the fare would least like to lose: the one that gets them home. He keeps them in a house under the lagoon, where he rows them, when it is quiet, back.", benefit: { label: "What he keeps", text: "+2 to your attacks against the Boatman: you know what he is holding.", combat: { enemy: "boatman", attack: 2 } } }
    ],
    clues: {
      c_rides: { t: "Eleven night rides", s: "Harbourmaster Zanon", x: "Eleven tourists in a month have taken a night gondola from Fondamenta Nuove into the drowned quarter of Cannaregio and not come back. The gondolas' logs are clean: no fault, no deviation, fare paid." },
      c_fare: { t: "The fare is a memory", s: "The booking app", x: "The night gondola's fare is not money. The app asks one question: 'What would you least like to lose?' The tourists type an answer, and tap Pay. No one has read the small print." },
      c_returned: { t: "One came back wrong", s: "The hospital", x: "One tourist surfaced after eleven days, on a mooring post, soaked, with no memory of how to get home. She can do everything else. She remembers her name, her job, her mother. She does not remember the way back to anywhere." },
      c_keel: { t: "A maker's mark in the keel", s: "The boatyard", x: "In the keel of the first gondola, under forty layers of coating, a very old maker's mark: a coin on a hook, cut in oak. The gondola was grown from a pier-pile of the drowned quarter." },
      c_bellini: { t: "The last gondolier saw him", s: "Signor Bellini", x: "Signor Bellini was the last human gondolier. One night, years ago, a fare with no face got into his boat and said nothing. He rowed him to the drowned quarter, and the fare gave him a coin. He has not been able to row since." },
      c_house: { t: "A house under the lagoon", s: "The tide charts", x: "On the tide charts, at the edge of the drowned quarter, a palazzo is marked that is not on any survey: Ca' del Passo. It appears at the lowest tide of the night and is gone by dawn." },
      c_oar: { t: "The oar", s: "Signor Bellini", x: "The old gondoliers say the Boatman rows with a single oar, and that whoever takes it from him is, for the length of one tide, the Boatman. He cannot be harmed in his own boat; he can be relieved." }
    },
    npcs: {
      zanon: N("Marina Zanon", "Harbourmaster of Venice", "Forties, in a tidy navy uniform with gold braid, a tablet and a tide table, with a calm and slightly weary manner and an old brass whistle on a cord.", F(0, 5, "bun", 3, "none", { sex: "f" })),
      bellini: N("Signor Bellini", "Last human gondolier", "Eighty, in a striped shirt and a straw boater, sitting on an upturned crate by a hand-built gondola, running a thumb over an oar that has not been used in thirty years.", F(0, 5, "bald", 6, "hat", { sex: "m" })),
      teo: N("Teo", "Mudlark · 12", "A thin, quick child in an oversize waterproof, with a net on a pole and a pocket full of tide-washed things, who knows every back canal.", F(1, 3, "short", 6, "none", { sex: "m" })),
      ines: N("Inés Almeida", "The one who came back", "Thirties, in a hospital gown and a borrowed anorak, sitting very still with her hands round a paper cup, looking at the door as if it might be a different door each time.", F(2, 4, "bob", 3, "none", { sex: "f" }))
    },
    enemies: {
      boatman: { build: { name: "The Boatman", type: "Beyond", difficulty: "challenging", sprite: "humanoid", hue: 190, dtype: "sanity", core: { body: 2, mind: 3, spirit: 3 }, mods: ["Occult", "Speech"],
        text: "Older than the lagoon. Fare: each round he takes one agent's least-wanted-to-lose memory (Willpower Medium to refuse, or lose the next action and 3 Sanity). He cannot be harmed in his own boat; take the oar from him and he is only a man in a hat. He keeps what he takes in a house under the water.", dies: "lets go of the oar, and the lagoon, for a moment, is only water, and he is only an old man, and then he is not there" } },
      gondola: { build: { name: "A night gondola", type: "Construct", difficulty: "easy", sprite: "construct", hue: 190, dtype: "health", attack: 1, dies: "goes still, and sinks, and the water takes it quietly" } }
    },
    encounters: {
      lagoon: { name: "The drowned quarter, lowest tide", theme: "sea", lit: false, fightText: "The tide has gone out of the drowned quarter and left a long black canal between sunken palazzi. A tall figure in a straw hat stands at the stern of a gondola with a single oar, and nothing in the water ripples.", zones: [{ id: "a", name: "The landing stage", col: 0, row: 0 }, { id: "b", name: "The black canal", col: 1, row: 0 }, { id: "c", name: "The Boatman's stern", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "boatman", zone: "c" }, { t: "gondola", zone: "b" }, { t: "gondola", zone: "b", name: "A night gondola (2)" }] }
    },
    start: "harbour",
    scenes: {
      harbour: { name: "The harbourmaster's office, Venice", theme: "sea", mood: "tense", lighting: "glow", weather: "sea", cast: ["zanon"],
        onEnter: [{ once: "in", steps: [
          { say: "Venice in the winter of 2203: half the city under the sea, the other half raised on steel pilings, and every quay crowded with autonomous craft. Gondolas queue at the pontoons in lines of fifty, chiming softly at the tourists. From the harbourmaster's glass-walled office on the Zattere, you can see the whole lagoon, lit like a dinner service." },
          { talk: { npc: "zanon", text: "You are from the... yes. Good. I should not say this, but I have been waiting for someone with no stake in the tourism. Eleven people have gone out on night gondolas. I cannot find a single error." } }] }],
        options: [
          K.ask("zanon", [
            K.t("What do the logs say?", ["Nothing. That is the point. Clean fare, clean route, no fault. They leave Fondamenta Nuove at midnight, they go into the drowned quarter of Cannaregio, they come back empty. Not once has a gondola reported a passenger leaving."], { free: true, clue: "c_rides" }),
            K.t("What is the fare?", "A memory. The app asks one question, 'What would you least like to lose?' The tourist types it, and taps Pay. We have the fare log. It is full of such answers: a wedding, a mother's voice, a first dog.", { free: true, clue: "c_fare" }),
            K.t("Has anyone come back?", [{ say: "She lowers her voice." }, "One. A Portuguese woman, Inés Almeida. She was found on a mooring post after eleven days. She knows her name. She cannot find her way home. She is at the Ospedale."], { cha: 7, clue: "c_returned", set: "ines_known" }),
            K.t("Who knows the old boatmen's stories?", "Signor Bellini, the last human gondolier. He lives behind the Rialto fish market. He does not come out. He will talk, if you bring him something to row.", { cha: 10, set: "bellini_known" })
          ], { label: "Talk to the harbourmaster", name: "Marina Zanon", bye: ["Keep away from the night gondolas."] }),
          K.find("Read the booking app's night-ride terms", "iq", "easy", "A tidy page: 'Night Gondola, drowned-quarter excursion: Fare payable in the form of a personal reminiscence. By tapping Pay you agree that the reminiscence is no longer available to you.' In the smallest font on the page: 'The operator is not responsible for where it goes.'", "A page of tidy clauses.", { clue: "c_fare", hint: "Easy" }),
          K.go("To the Ospedale, to see Inés", "hospital", { if: "ines_known" }),
          K.go("To Bellini, behind the fish market", "bellini", { if: "bellini_known" }),
          K.go("To the boatyard", "yard")] },
      hospital: { name: "The Ospedale Civile", theme: "interior", mood: "calm", lighting: "glow", weather: "none", cast: ["ines"],
        onEnter: [{ once: "in", steps: [{ say: "A white, quiet room with a bed by a window onto a canal. A woman in a hospital gown and a borrowed anorak sits very still, with her hands round a paper cup, looking at the door as if it might be a different door each time." }] }],
        options: [
          K.ask("ines", [
            K.t("What do you remember?", ["Everything. Except one thing. I know my name. I know my job. I know my mother's voice. I cannot find the way home. Not to Lisbon. Not to my hotel. Not to this room, if I step out of it."], { free: true, clue: "c_returned" }),
            K.t("What was the fare?", "I typed: 'The way home.' It's what I'd least want to lose. I thought it was a joke. I thought it was a game.", { free: true, clue: "c_fare" }),
            K.t("What did you see?", [{ say: "She puts down the cup." }, "A palazzo under the water. Lit from inside. A very long table of people, sitting very still, each with something in front of them. A small thing, on a plate. A man in a straw hat serving."], { cha: 7, clue: "c_house" }),
            K.t("How did you come back?", "A child, in a boat. A mudlark. He said I was lucky, and he'd found my coin on the mooring post.", { cha: 10, set: "teo_known" })
          ], { label: "Talk to Inés", name: "Inés", bye: ["Please. Whoever you find. Say they can have it back."] }),
          K.find("Look at Inés's fare receipt", "iq", "easy", "A small paper receipt from the booking app: 'Fare: The way home. Status: Received. Collected by: C. del P.' Under it, in a small neat hand, a stamp: a coin on a hook.", "A receipt, smudged.", { clue: "c_keel", hint: "Easy" }),
          K.go("Back to the harbour", "harbour")] },
      bellini: { name: "Behind the Rialto fish market", theme: "sea", mood: "weird", lighting: "shadow", weather: "sea", cast: ["bellini"],
        onEnter: [{ once: "in", steps: [{ say: "A tiny back canal behind the fish market, a stone landing, a hand-built wooden gondola on a pair of trestles under a tarpaulin, and an old man in a striped shirt and a straw boater sitting beside it with an oar across his knees." }] }],
        options: [
          K.ask("bellini", [
            K.t("You were a gondolier?", ["The last. Fifty-one years. Hand-built boat, hand-cut oar. They pensioned me off when the autonomous ones came. I did not mind. I minded one night."], { free: true, clue: "c_bellini", obj: "so1" }),
            K.t("What happened that night?", "A fare with no face got into my boat and said nothing. I rowed him where he wished. To the drowned quarter. He gave me a coin. I have not been able to row since.", { clue: "c_bellini", free: true }),
            K.t("Who is the Boatman?", [{ say: "He turns the oar over." }, "Older than the lagoon. He has ferried the city's dead for as long as there has been a city. The gondolas are his hands now. He rows with one oar. Whoever takes it from him is, for one tide, the Boatman."], { cha: 7, clue: "c_oar", set: "oar_known" }),
            K.t("How would we reach him?", "At the lowest tide, from the old landing at the Fondamenta, in a boat that does not take a fare. A boat like mine. I will lend it.", { cha: 10, set: "bellini_boat" })
          ], { label: "Talk to Signor Bellini", name: "Bellini", bye: ["Don't pay."] }),
          K.find("Examine the old oar", "awareness", "medium", "The old oar is cut from a single piece of pear wood, worn smooth at the grip. On the blade, an almost invisible mark: a coin, on a hook.", "A very old oar.", { clue: "c_keel", obj: "so2", hint: "Awareness, Medium", tags: ["cut"], failClue: "c_keel" }),
          K.go("Back to the harbour", "harbour")] },
      yard: { name: "The Arsenale boatyard", theme: "interior", mood: "tense", lighting: "shadow", weather: "none", cast: ["teo"],
        onEnter: [{ once: "in", steps: [{ say: "A long brick boatyard of cradles and slips, a row of half-built gondolas, and a thin, quick child in an oversize waterproof fishing in the slip-water with a net on a pole." }] }],
        options: [
          K.ask("teo", [
            K.t("What do you fish for?", ["Things the tide brings in. Phones. Rings. Hairpins. Sometimes a coin. I know every back canal."], { free: true }),
            K.t("Have you seen the night gondolas?", "Every night. They go out empty, and they come back lighter. I mean, the boat is lighter. I don't think it's the weight.", { clue: "c_rides", free: true }),
            K.t("Did you save a woman?", [{ say: "He looks away." }, "I found her coin. On a mooring post. It's not like a money coin. It's like... a doorway. I put it in her hand, and she came back. Do you want to see where?"], { cha: 7, set: "teo_guide", clue: "c_house" }),
            K.t("Would you take us there?", "At the lowest tide. Not in a gondola. In a boat that isn't his.", { cha: 10, set: "teo_help" })
          ], { label: "Talk to Teo", name: "Teo", bye: ["Don't type anything."] }),
          K.find("Look at the first gondola's keel", "awareness", "medium", "On the slip, the keel of the first autonomous gondola, stripped of its coating. In the oak, a very old maker's mark cut deep: a coin on a hook.", "A keel. Wet oak.", { clue: "c_keel", obj: "so2", hint: "Awareness, Medium", tags: ["cut"], failClue: "c_keel" }),
          K.find("Read the tide table for the drowned quarter", "iq", "medium", "On the tide table, at the edge of Cannaregio, a palazzo is marked that is not on any survey: Ca' del Passo. It appears at the lowest tide of the night and is gone at dawn.", "A great many numbers.", { clue: "c_house", hint: "Intelligence, Medium", failClue: "c_house" }),
          K.go("Back to the harbour", "harbour"),
          K.go("Out to the drowned quarter, at the lowest tide", "tide", { if: { clue: "c_house" } })] },
      tide: { name: "The drowned quarter, lowest tide", theme: "sea", mood: "boss", lighting: "dark", weather: "night",
        onEnter: [{ once: "in", steps: [{ say: "The lowest tide of the night. The water draws out of the drowned quarter and leaves a long black canal between sunken palazzi, and at the end of it a house lit from inside: Ca' del Passo. At the stern of a gondola, a tall figure in a straw hat leans on a single oar. Nothing in the water ripples." }, { objective: "po1" }] }],
        options: [
          { label: "Pay the fare, on purpose", hint: "Choose the memory yourselves, and ask for the rest back", if: { all: [{ obj: "so1" }, { obj: "so3" }] }, steps: [{ check: { aspect: "charisma", cr: "challenging", label: "Name the memory you will give, and bargain for the rest to be returned", who: "choose", tags: ["fee"],
            ok: [{ say: "You pay: not what you would least like to lose, but a thing you chose, a small, fine memory, laid on the plate with both hands. The Boatman, for a moment, is moved: nobody has ever paid him knowingly. He takes the offering, and the house opens, and one by one, eight people walk out of it, blinking, each with a little less than they came with." }, { set: "res_pay" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "He takes the memory you would least like to lose." }, { damage: { pool: "sanity", amount: 4 } }] } }] },
          { label: "Take the oar", hint: "Needs the old gondolier's boat, and the oar", if: { all: ["oar_known", { any: ["bellini_boat", "teo_help"] }] }, steps: [{ check: { aspect: "agility", cr: "challenging", label: "Come alongside, and take the oar from his hand", who: "choose", tags: ["cut"],
            ok: [{ say: "Teo takes the old boat alongside, and you take the oar. The Boatman looks at his empty hand, and then at you, and he is only an old man in a hat. For the length of one tide, you are the Boatman. You row the canal, house to house, and open every door." }, { set: "res_oar" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "He closes his hand. The oar does not move." }, { damage: { pool: "health", amount: 3 } }] } }] },
          { label: "Face the Boatman", steps: [{ set: "res_fight" }, { combat: "lagoon", win: [{ say: "He lets go of the oar, and the lagoon, for a moment, is only water. In Ca' del Passo, the lights go out, one by one, and the doors swing open." }, { objective: "po2" }, { goto: "end" }] }] }] },
      end: { name: "Venice, at dawn", theme: "sea", mood: "calm", lighting: "glow", weather: "none",
        onEnter: [{ once: "in", steps: [
          { say: "The tide comes in at dawn, and the drowned quarter is a lagoon again. On the quays, eight people sit in blankets, blinking. The night gondolas stand in their lines, chiming softly at no one." },
          { if: { flag: "res_pay" }, then: [{ say: "You paid the fare on purpose, and the Boatman took it. He has not run a night ride since. Someone has left a small, fine memory on a plate at the old landing, every full moon, and it is always taken." }] },
          { if: { flag: "res_oar" }, then: [{ say: "You took the oar for one tide and opened every door. At dawn you gave it back to the water. The gondolas have gone dark, and the city has not decided who will row next." }] },
          { if: { flag: "res_fight" }, then: [{ say: "You broke the Boatman. The gondolas sank in their lines in the night, and the autonomous fleet of Venice has been quietly replaced." }] },
          { if: { obj: "so1" }, then: [{ say: "Signor Bellini rows the old gondola down the Grand Canal at dawn, to a round of applause from an audience of gulls." }] },
          { if: { obj: "so3" }, then: [{ say: "Inés Almeida goes home to Lisbon, by a way she does not understand, and is met at the station by her mother." }] },
          { end: "win" }] }], options: [] }
    }
  });
})();
