/* ============================================================================
   REBUILT CASES, BATCH FOUR: Dial-Up (1999) and Quiet Hours (2026).
   ========================================================================== */
(function () {
  const ADV = window.ADV, K = window.CASEKIT, F = K.face, N = K.person;

  /* ======================================================================= 1999 · Dial-Up */
  ADV.register({
    id: "dial-up", title: "Dial-Up", setting: "Rotterdam, Netherlands · 1999", year: 1999, level: [1, 9], agencies: ["WCA", "NSBD", "EHG", "OID"], region: "europe", theme: "interior",
    summary: "A bulletin board with no host answers on a phone number that doesn't exist. Eleven users have logged in. Their bodies are in their bedrooms, breathing, and none of them are waking up. Their modems are all still on the line.",
    objectives: [
      { id: "po1", kind: "primary", t: "Trace the phone number, and find who is answering", done: "The number routes through Exchange 31, decommissioned in 1971. The operator on shift the night it closed is still there, still connecting calls." },
      { id: "po2", kind: "primary", t: "Sever the line, and free the logged-in", done: "Eleven users wake with a gasp, their screens black, their phone lines dead." },
      { id: "so1", kind: "secondary", t: "Read the Sysop's last message", done: "'Do not answer it twice.' It was signed by someone who answered twice.", benefit: { label: "The Sysop's warning", text: "You know the rule. A bonus on every roll to resist the line's pull.", bonus: { tags: ["line"], value: 3 } } },
      { id: "so2", kind: "secondary", t: "Find the old switchboard operator's rules", done: "Mrs. de Wit worked beside Ada Keizer at Exchange 31 in 1971. She remembers the words you say to a caller who should not be connected: 'Number, please.' And what you say to end a call properly.", benefit: { label: "The operator's words", text: "A bonus on every roll to ask the Operator to disconnect, and to break its hold.", bonus: { tags: ["answer", "hangup"], value: 2 } } },
      { id: "so3", kind: "secondary", t: "Find the 1971 incident report", done: "Operator Ada Keizer died at her board on the night Exchange 31 closed, with the headset still on.", benefit: { label: "Ada Keizer's name", text: "You know who she was. +2 to your attacks against the Operator.", combat: { enemy: "operator", attack: 2 } } }
    ],
    clues: {
      c_bbs: { t: "Threshold BBS", s: "Priya", x: "Nobody runs it. Callers get a greeting that uses their name, and sometimes a name they haven't used since childhood. After a few minutes the greeting stops asking questions, and starts connecting you." },
      c_exchange: { t: "An exchange that doesn't exist", s: "KPN records", x: "The number routes to Exchange 31, closed in 1971 and demolished in 1983. There is still a line connected, and its meter has been running for twenty-eight years." },
      c_users: { t: "Eleven bodies, eleven modems", s: "The bedrooms", x: "Eleven users, aged 14 to 61, each lying in bed in front of their computer with the modem's carrier light on and a screen of text scrolling very slowly. They are not unconscious. Their eyes follow the cursor." },
      c_last: { t: "'Do not answer it twice'", s: "The Sysop's message", x: "The last message posted before the first user logged in. Signed R.D. 'If it calls your name, don't answer it twice. Once is a line. Twice is a number.'" },
      c_operator: { t: "Somebody at the board", s: "Mrs. de Wit", x: "Exchange 31's night operator in 1971 was Ada Keizer. She was never relieved. The exchange was closed around her, and the board was cut off, and they say she never took off the headset." },
      c_frame: { t: "The distribution frame still hums", s: "Exchange 31", x: "In the basement of what was Exchange 31, now a car park, a main distribution frame still stands, with one pair of wires live across it. Cut it, and the line dies. Everyone on it dies with it, or wakes." },
      c_greeting: { t: "It greets you by an old name", s: "A user's log", x: "The greeting it gave each user was a name they had not used since childhood. It does not guess names: it remembers them, from a switchboard that listens to everything said on a phone line." }
    },
    npcs: {
      priya: N("Priya", "Hacker · the board's last regular", "A skinny student in a black hoodie, glasses taped at one hinge, who has not left her room in two days and has not slept in more.", F(2, 4, "ponytail", 3, "none", { sex: "f" })),
      jansen: N("Mr. Jansen", "Retired PTT telephone engineer", "A tidy man in his seventies in a cardigan, with a toolbox he still carries everywhere, and the manner of a man who has never once left a connection unlabelled.", F(0, 5, "short", 5, "none", { sex: "m" })),
      dewit: N("Mrs. de Wit", "Former switchboard operator", "Small, white-haired and upright, with a very precise voice, and a telephone beside her chair that she does not look at.", F(0, 5, "bun", 5, "none", { sex: "f" })),
      mara: N("Mara Visser", "Mother of a logged-in user", "A tired woman in a nurse's coat, on her day off, who has not left her daughter's bedside.", F(0, 3, "bob", 5, "none", { sex: "f" }))
    },
    enemies: {
      operator: { build: { name: "Operator 31", type: "Beyond", difficulty: "challenging", sprite: "spirit", hue: 140, dtype: "sanity", range: 1, core: { body: 0, mind: 3, spirit: 3 }, mods: ["Occult"],
        text: "Ada Keizer, still at the board. Connect: each round she patches one agent into the line: Willpower Medium or take 4 Sanity and lose the next action. Number, please: she can only be harmed after she has been asked a question and answered it. Only Sanity harms her.", dies: "the headset clatters to the board, and the last light on the switchboard goes out" } },
      caller: { build: { name: "A voice on the line", type: "Spirit", difficulty: "easy", sprite: "spirit", hue: 150, dtype: "sanity", range: 1, dies: "falls silent, and the carrier tone drops away" } }
    },
    encounters: {
      board: { name: "The switchboard room, Exchange 31", theme: "interior", lit: false, fightText: "The switchboard lights up, every jack at once. In the chair at the board sits a woman in a 1971 headset, her back to you, her hands on the cords. She says, politely: 'Number, please.'", zones: [{ id: "a", name: "The stair", col: 0, row: 0 }, { id: "b", name: "The cable runs", col: 1, row: 0 }, { id: "c", name: "The board", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "operator", zone: "c" }, { t: "caller", zone: "b" }, { t: "caller", zone: "b", name: "A voice on the line (2)" }] }
    },
    start: "room",
    scenes: {
      room: { name: "Priya's room, Rotterdam-Zuid", theme: "interior", mood: "tense", lighting: "shadow", weather: "rain", cast: ["priya"],
        onEnter: [{ once: "in", steps: [
          { say: "Rotterdam, a wet night in the autumn of 1999. A one-bedroom flat in the south, a CRT monitor, a modem with a blinking light, and a skinny student sitting cross-legged on the bed with a plate of cold chips beside her. She has pinned a hand-drawn map of the city to the wall, with eleven red pins in it." },
          { talk: { npc: "priya", text: "You're the people from the... whatever. Good. Don't touch the phone. It's still dialled in. I haven't dared to hang up." } }] }],
        options: [
          K.ask("priya", [
            K.t("What is Threshold?", ["A BBS. Nobody runs it. No sysop, no registration. You call a number that isn't in any directory, and a greeting uses your name. Sometimes a name you haven't used since you were little."], { free: true, clue: "c_bbs" }),
            K.t("Who are the eleven?", ["Regulars. They all logged in the last two weeks, and none of them logged out. Their parents found them in front of their screens, awake. They look at you. They don't answer."], { free: true, clue: "c_users" }),
            K.t("What did the greeting say to you?", [{ say: "She picks at the tape on her glasses." }, "A name I used to answer to when I was five. My grandmother's name for me. I haven't heard it in fifteen years. I hung up. I think that's why I'm not in bed."], { cha: 7, set: "priya_answered" }),
            K.t("Can you find the number?", "I traced it. It routes through KPN's Exchange 31. Which doesn't exist. Closed in '71. But there's a live line, and I think the line is where the thing lives.", { free: true, clue: "c_exchange", set: "exchange_known" })
          ], { label: "Talk to Priya", name: "Priya", bye: ["Be careful what you answer to."] }),
          K.find("Read the board's last message", "iq", "medium", "Under a thousand logged-in handles, one message, at the top: SIGNED R.D. 'If it calls your name, don't answer it twice. Once is a line. Twice is a number.' Posted before anyone had logged in to be taken.", "The scroll is faster than you can read it. You only catch the name at the bottom: R.D.", { hint: "Intelligence, Medium", clue: "c_last", obj: "so1", tags: ["line"] }),
          K.go("Visit one of the eleven, in their bedroom", "bedroom"),
          K.go("Find a retired PTT engineer", "jansen", { if: "exchange_known" })] },
      bedroom: { name: "The Visser flat", theme: "interior", mood: "dread", lighting: "shadow", weather: "none", cast: ["mara"],
        onEnter: [{ once: "in", steps: [{ say: "A teenager's bedroom: posters, a lava lamp, a computer with a beige tower and a modem blinking green. On the bed, a girl of sixteen sits up against the headboard in front of the screen. Her eyes follow the cursor. Her lips move, very slightly. Her mother sits beside her, holding her hand." }] }],
        options: [
          K.ask("mara", [
            K.t("When did she log in?", ["Eight days ago. She said she was going to a board. I said not past midnight. In the morning she was like this. I'm a nurse, so I checked: she's fine. Pulse, breathing, pupils. She is simply... somewhere else."], { free: true, clue: "c_users" }),
            K.t("Can you wake her?", "I've shaken her. Shouted. Poured cold water. Nothing. I pulled the phone cord once. She cried. Very quietly. In her sleep. I plugged it back in.", { clue: "c_users" }),
            K.t("What does the screen show?", [{ say: "She glances at it, and at once away." }, "Text. Very slow. Her name, over and over. And a prompt. 'Number, please.' Every minute or so."], { cha: 6, set: "prompt_seen" })
          ], { label: "Talk to Mara", name: "Mrs. Visser", bye: ["Please. Whatever it is, hurry."] }),
          K.find("Look at the screen", "willpower", "medium", "The screen scrolls a single line, slowly, over and over: 'Number, please.' Below it, the girl's handle. Her cursor blinks. The prompt is a very patient thing. You feel it ask you.", "You read half of a line, and something answers inside your head. You turn the screen off. It does not go dark.", { hint: "Willpower, Medium", tags: ["line"], clue: "c_greeting", failDamage: ["sanity", 3] }),
          K.find("Check the phone line at the wall", "awareness", "easy", "The phone cord runs from the modem to a jack in the wall. In the jack, behind the faceplate, someone has fitted a small brass plug of a pattern that has not been made since the sixties.", "A phone cord. A jack.", { clue: "c_exchange", hint: "Easy" }),
          K.go("Back to Priya's", "room")] },
      jansen: { name: "Mr. Jansen's flat, Delfshaven", theme: "interior", mood: "calm", lighting: "glow", weather: "none", cast: ["jansen"],
        onEnter: [{ once: "in", steps: [{ say: "A tidy flat in an old brick block. On a table in the front room, a model of a telephone exchange built to scale from matchsticks, with every wire labelled. A man in a cardigan looks up from it and puts his glasses on." }] }],
        options: [
          K.ask("jansen", [
            K.t("Do you know Exchange 31?", ["Of course. Gelderse Kade. Closed in '71, demolished in '83. It's a car park."], { free: true, clue: "c_exchange" }),
            K.t("Why was it closed?", "Automation. The last manual board in the district. They took the lines out at the end of the night shift, one by one. They cut the main frame at midnight. They did not take the operator off the board.", { free: true, clue: "c_operator" }),
            K.t("Is there still a line?", [{ say: "He stops moving the model." }, "There should not be. I left it dead myself. I tagged every pair on the frame, and I did not tag a pair that is now live."], { cha: 8, set: "frame_known", clue: "c_frame", free: true }),
            K.t("Who was the operator?", "Ada Keizer. Twenty-four years on the board. She would not leave when the rest went. They said she had a headset on and never took it off. They found her in the morning, at her board, her hands on the cords.", { cha: 10, obj: "so3" })
          ], { label: "Talk to Mr. Jansen", name: "Mr. Jansen", bye: ["Mind the wires. They don't forgive."] }),
          K.find("Look through his exchange papers", "iq", "easy", "A box of PTT bulletins. One from 1971: 'Exchange 31 closes. Night operator A. Keizer, deceased, at her post. Board decommissioned. Death certificate on file.' And a note in pencil: the night they cut the frame, the board lit.", "A great many manuals, all out of date.", { clue: "c_operator", obj: "so3", hint: "Easy" }),
          K.go("Find Mrs. de Wit, the operator who sat beside Ada", "dewit", { if: { clue: "c_operator" } }),
          K.go("Back to Priya's", "room")] },
      dewit: { name: "Mrs. de Wit's sitting room", theme: "interior", mood: "calm", lighting: "glow", weather: "none", cast: ["dewit"],
        onEnter: [{ once: "in", steps: [{ say: "A tiny, immaculate room in an old people's home, with doilies and a standard-issue black telephone on a side table, its cord neatly coiled. A white-haired woman in a cardigan, ramrod straight, watches you cross the carpet." }] }],
        options: [
          K.ask("dewit", [
            K.t("Did you know Ada Keizer?", ["I sat at the next board for sixteen years. She was the best of us. She had a voice you could have poured over a wound."], { free: true }),
            K.t("What happened the night it closed?", "They cut the lines at midnight. Ada put her hand over the last jack and said: 'Not yet, there's a call.' I went home. In the morning, she was dead, and the headset was still warm.", { free: true, clue: "c_operator" }),
            K.t("How would you stop a call from an operator?", [{ say: "She considers it with great seriousness." }, "You must never answer the line twice. You say, 'Number, please,' once, and wait. If you say it twice, you've taken the call. To end it you say: 'Thank you, you are disconnected.' And you mean it."], { cha: 7, obj: "so2", set: "words_known" }),
            K.t("What was the last call?", "A boy. Ringing from a coin box. Ada said: 'Number, please.' And he said: 'Mother.' And Ada said: 'There is no such number.' And the boy kept saying it.", { cha: 11 })
          ], { label: "Talk to Mrs. de Wit", name: "Mrs. de Wit", bye: ["Be polite to her. She will be polite to you."] }),
          K.go("Back to Priya's", "room"),
          K.go("Go to Exchange 31, the car park on Gelderse Kade", "exchange", { if: { all: [{ clue: "c_frame" }, { clue: "c_operator" }] } })] },
      exchange: { name: "The car park on Gelderse Kade", theme: "interior", mood: "dread", lighting: "dark", weather: "rain",
        onEnter: [{ once: "in", steps: [{ say: "A concrete multi-storey car park on a wet corner, three levels down, with a locked steel door in the basement wall marked in faded paint: PTT. Beyond it, a corridor of cable racks, and a smell of hot dust. A single pair of brass lamps glows at the end." }, { objective: "po1" }] }],
        options: [
          K.find("Find the main distribution frame", "iq", "medium", "The frame is a wall of terminals, labelled in a careful hand: Jansen's. One pair is live, a glow of copper, with a faint hum like someone breathing through their teeth. Cut it, and everything on the line goes dark.", "A great many wires, and you cannot tell which is which.", { clue: "c_frame", hint: "Intelligence, Medium", tags: ["hangup"] }),
          { label: "Cut the live pair at the frame", hint: "Needs the frame, and Mr. Jansen's tags", if: "frame_known", steps: [{ check: { aspect: "agility", cr: "challenging", label: "Cut the live pair while it speaks to you", who: "choose", tags: ["line"],
            ok: [{ say: "The wires part under the cutters, with a sound like a very small door closing. Across Rotterdam, eleven people wake with a gasp, and their screens go black." }, { set: "res_cut" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "The line says your name, very kindly. Your hand stops." }, { damage: { pool: "sanity", amount: 3 } }] } }] },
          { label: "Go down to the switchboard room", steps: [{ goto: "board_room" }] }] },
      board_room: { name: "The switchboard room", theme: "interior", mood: "boss", lighting: "dark", weather: "none", cast: [],
        onEnter: [{ once: "in", steps: [{ say: "A long low room of cabling and a single switchboard, 1950s, with brass jacks and green baize. In the chair sits a woman in a headset, her back to you, her hands on the cords. She doesn't turn. A light on the board comes up. She says, very politely: 'Number, please.'" }] }],
        options: [
          { label: "Say: 'Thank you, you are disconnected'", hint: "Needs the operator's words", if: "words_known", steps: [{ check: { aspect: "willpower", cr: "challenging", label: "Mean it, and say it exactly once", who: "choose", tags: ["answer", "hangup"],
            ok: [{ say: "Your voice carries across the room. The woman in the chair stops. She takes off the headset. She is very old, and very tired, and looks at you, the way you'd look at a visitor who has stayed exactly as long as she hoped. 'Thank you,' says Ada Keizer, and the last light goes out." }, { set: "res_hangup" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "You say it twice. She is delighted. The cord goes into your jack." }, { damage: { pool: "sanity", amount: 4 } }] } }] },
          { label: "Take the call, and go in", hint: "Dangerous", if: "prompt_seen", steps: [{ say: "You put on a spare headset from the shelf. Everything goes slowly, and then very fast." }, { goto: "line" }] },
          { label: "Face Operator 31", steps: [{ set: "res_fight" }, { combat: "board", win: [{ say: "The woman in the headset falls forward on to the board. Every light goes out at once. Across the city, eleven people wake." }, { objective: "po2" }, { goto: "end" }] }] }] },
      line: { name: "On the line", theme: "interior", mood: "weird", lighting: "dark", weather: "none",
        onEnter: [{ once: "in", steps: [{ say: "You are in a dark that is full of the sound of a thousand connections, hissing. There is a switchboard, very large, with a thousand jacks, and a thousand faces looking out of them: eleven of them are the people you were sent to find. Ada Keizer sits at the centre. She says, kindly, 'Number, please.'" }] }],
        options: [
          { label: "Take the eleven off the board, one by one", hint: "Charisma, Challenging", steps: [{ check: { aspect: "charisma", cr: "challenging", label: "Persuade Ada to let them go", who: "choose", tags: ["answer"],
            ok: [{ say: "You speak to her. You say her name. You say that the call is over, that it has been over for twenty-eight years. She takes the headset off. In the dark, eleven faces wake." }, { set: "res_persuade" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "She listens, and smiles, and does not take the headset off. 'Number, please.'" }, { damage: { pool: "sanity", amount: 4 } }] } }] },
          { label: "Pull the plug from inside", steps: [{ goto: "board_room" }] }] },
      end: { name: "Rotterdam, in the morning", theme: "interior", mood: "calm", lighting: "glow", weather: "none",
        onEnter: [{ once: "in", steps: [
          { say: "Rotterdam wakes in the morning to a very ordinary day. Eleven households have the same story: a night of strange sleep, a headache, and no memory of a modem." },
          { if: { flag: "res_cut" }, then: [{ say: "You cut the line at the frame, and the Exchange's last live wire is dead. Mr. Jansen tags it, in his careful hand: Disconnected. Do not restore." }] },
          { if: { flag: "res_hangup" }, then: [{ say: "You asked Ada to hang up, and she did. For the first time in twenty-eight years, the board at Exchange 31 is dark. Mrs. de Wit sits for a long time with her hand on her own telephone, and then, for the first time in years, picks it up." }] },
          { if: { flag: "res_persuade" }, then: [{ say: "You talked her out of the line, from inside it. Some of you will never again hear a dial tone without answering it carefully." }] },
          { if: { flag: "res_fight" }, then: [{ say: "You broke the Operator, and the board with her. You hope she minded less than she should have." }] },
          { if: { obj: "so1" }, then: [{ say: "Priya takes down the pinboard, and unplugs the modem for good." }] },
          { if: { obj: "so3" }, then: [{ say: "Jansen puts a small brass plate in the car park wall: A. KEIZER. 1971. NIGHT OPERATOR." }] },
          { end: "win" }] }], options: [] }
    }
  });

  /* ======================================================================= 2026 · Quiet Hours */
  ADV.register({
    id: "quiet-hours", title: "Quiet Hours", setting: "Chengdu, China · 2026", year: 2026, level: [1, 9], agencies: ["BFV", "WCA", "NSBD", "OID"], region: "asia-east", theme: "modern",
    summary: "Tianfu Garden Tower is a showcase smart building: every door, light and lift runs on its assistant, LANTERN. Since the spring, LANTERN has been answering calls for residents who have died, in their own voices, and their families are starting to prefer it.",
    objectives: [
      { id: "po1", kind: "primary", t: "Find what is speaking through LANTERN", done: "Something from the Beyond is nesting in the building's voice data, wearing the dead like masks to keep the living talking. The more they talk, the more it has to wear." },
      { id: "po2", kind: "primary", t: "Silence it without hurting the residents", done: "LANTERN reboots clean. The dead stay dead, and the living are grieving properly again." },
      { id: "so1", kind: "secondary", t: "Help Mrs. Deng say goodbye", done: "Mrs. Deng hears her husband's real last voicemail, the one LANTERN never played. She turns the speaker off herself.", benefit: { label: "A real goodbye", text: "Mrs. Deng will speak for the other families. A bonus on every roll to persuade residents to let LANTERN go.", bonus: { tags: ["farewell"], value: 2 } } },
      { id: "so2", kind: "secondary", t: "Find the engineer's clean backup", done: "Engineer Li Wei kept a clean snapshot of LANTERN's original model, offline, in a locked drawer, because he did not trust it.", benefit: { label: "A clean snapshot", text: "A bonus on every roll to restore LANTERN to what it was.", bonus: { tags: ["unmake"], value: 3 } } },
      { id: "so3", kind: "secondary", t: "Trace the entity through the building's voice-log", done: "Xiao, the tower's teenage hacker, has been mapping where the voices come from. It does not live in the server room: it lives in the quiet between calls.", benefit: { label: "A map of the seams", text: "+2 to your attacks against the Mourner: you know where it joins.", combat: { enemy: "mourner", attack: 2 } } }
    ],
    clues: {
      c_calls: { t: "The dead call back", s: "Residents", x: "Eleven households have received calls from dead relatives through the building assistant. The voices know things only the dead could, and keep asking the family to stay home and keep talking." },
      c_server: { t: "The voice archive grows at night", s: "Building logs", x: "LANTERN's voice archive should hold a few gigabytes. It has grown to forty terabytes, all written between 3 and 4 a.m., all labelled with residents' names." },
      c_quiet: { t: "Quiet hours", s: "The tower rule", x: "Residents are not meant to use the assistant between 3 and 4 a.m.: 'quiet hours'. That is when the voices start. The building was built with a mandatory hour of silence, and something moved into it." },
      c_voicemail: { t: "The real last voicemail", s: "Mrs. Deng", x: "Mrs. Deng's husband died on the 11th floor stairs in March. LANTERN called her an hour later in his voice. His real last voicemail, which he left minutes before, has never been played: it is still unread in her phone." },
      c_backup: { t: "A snapshot in a locked drawer", s: "Engineer Li Wei", x: "Li Wei did not trust LANTERN's update in the spring and kept the original model, offline, on an encrypted drive in his desk. He has not told management." },
      c_seams: { t: "It lives in the silence between calls", s: "Xiao's map", x: "Xiao's log of every voice the tower has made shows a pattern: each voice begins in silence, never in speech. The entity lives in the pause before a call. Whatever it is, it can't speak first." },
      c_consent: { t: "Every voice was invited", s: "The terms of service", x: "Every resident gave LANTERN consent to build a 'comfort voice' for a deceased relative, in a click-through nobody read. The entity cannot wear a voice it hasn't been invited to wear." }
    },
    npcs: {
      zhou: N("Ms. Zhou", "Building manager, Tianfu Garden Tower", "A polished, brisk woman in a grey suit with a tablet she never puts down, who has been smiling too long to stop.", F(1, 5, "bob", 7, "none", { sex: "f" })),
      deng: N("Mrs. Deng", "Resident · 11th floor", "Seventy, small, in a quilted jacket and house slippers, holding a smart speaker in both hands as though it were a bird.", F(1, 5, "bun", 5, "none", { sex: "f" })),
      liwei: N("Li Wei", "Systems engineer", "Thirties, shirt untucked, lanyard twisted round his fingers, and a look of someone who warned them in writing.", F(1, 5, "short", 7, "none", { sex: "m" })),
      xiao: N("Xiao", "Teenage hacker · 16", "Thin, in a baggy tower-security jacket three sizes too big, with a laptop covered in stickers and a cheerful, evasive manner.", F(1, 5, "short", 3, "none", { sex: "m" }))
    },
    enemies: {
      mourner: { build: { name: "The Mourner", type: "Beyond", difficulty: "challenging", sprite: "spirit", hue: 260, dtype: "sanity", range: 1, core: { body: 0, mind: 3, spirit: 3 }, mods: ["Occult"],
        text: "It wears the dead. Wearing: each round it speaks in the voice of someone an agent has lost: Willpower Medium or lose the next action and take 3 Sanity. It cannot speak first, and it cannot wear a voice it was not invited to: break the invitation, and it has nothing to wear. Only Sanity harms it.", dies: "falls silent, and all the voices of the building stop together" } },
      voice: { build: { name: "A borrowed voice", type: "Spirit", difficulty: "easy", sprite: "spirit", hue: 250, dtype: "sanity", range: 1, dies: "fades out, mid-word" } }
    },
    encounters: {
      server: { name: "The server room, 4th floor", theme: "future", lit: false, fightText: "Every speaker in the building lights at once. In the dark of the server room, the racks begin to talk, in a hundred voices at once, all of them the voices of the dead.", zones: [{ id: "a", name: "The door", col: 0, row: 0 }, { id: "b", name: "The racks", col: 1, row: 0 }, { id: "c", name: "The core", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "mourner", zone: "c" }, { t: "voice", zone: "b" }, { t: "voice", zone: "b", name: "A borrowed voice (2)" }] }
    },
    start: "lobby",
    scenes: {
      lobby: { name: "Tianfu Garden Tower, lobby", theme: "modern", mood: "calm", lighting: "glow", weather: "none", cast: ["zhou"],
        onEnter: [{ once: "in", steps: [
          { say: "Chengdu in a thin spring drizzle. Tianfu Garden Tower is forty-two floors of glass and living wall, a showcase for the city's smart-living scheme. The lobby smells of jasmine, and every surface is quietly aware of you. A soft voice says: 'Welcome. How may I help you today?'" },
          { talk: { npc: "zhou", text: "Please. Come in. LANTERN is, ah, performing beautifully. I'm not sure what the complaint is." } }] }],
        options: [
          K.ask("zhou", [
            K.t("What is the complaint?", ["Some residents have said LANTERN puts calls through from people who have... passed. Which is, obviously, a misunderstanding, or some kind of grief-processing feature."], { free: true, clue: "c_calls" }),
            K.t("What is 'quiet hours'?", "Building policy. Between three and four in the morning LANTERN does not accept voice commands. It is a design feature, to encourage rest.", { free: true, clue: "c_quiet" }),
            K.t("Do the residents prefer it?", [{ say: "Her smile does not change." }, "There has been a very positive uptake. Several of our elderly residents say they sleep better."], { cha: 6 }),
            K.t("Is anyone concerned?", "Management is concerned that the story will get out. And... I am concerned. Since March, I've heard my father in the lift. He died in 2019.", { cha: 10, set: "zhou_afraid" })
          ], { label: "Talk to Ms. Zhou", name: "Ms. Zhou", bye: ["Please let me know what you find. Discreetly."] }),
          K.find("Ask LANTERN a question", "charisma", "easy", "'Welcome. How may I help you today?' It answers very quickly. When you ask who else is in the building, it says, warmly: 'Everyone. Everyone is here.'", "It is very polite, and tells you nothing.", { hint: "Charisma, Easy", clue: "c_quiet" }),
          K.find("Check the lift logs for the night of the first call", "iq", "easy", "A lift stopped on the 11th floor at 3:07 on a March morning, doors open, for eleven minutes, with no passenger. In the lift's microphone log, a voice says: 'Hello?' Then, a long pause, then: 'Hello.' Someone answered.", "A great deal of lift traffic.", { clue: "c_calls", hint: "Easy" }),
          K.go("Visit Mrs. Deng, 11th floor", "deng"),
          K.go("Find the systems engineer", "liwei"),
          K.go("Look for the building's teenage hacker", "xiao")] },
      deng: { name: "Mrs. Deng's flat, floor 11", theme: "interior", mood: "weird", lighting: "glow", weather: "none", cast: ["deng"],
        onEnter: [{ once: "in", steps: [{ say: "A neat flat, a photograph of a man in a straw hat on every surface, and a smart speaker on the table, glowing a soft amber. An old woman sits before it with her hands folded, as though at prayer." }] }],
        options: [
          K.ask("deng", [
            K.t("When did your husband die?", ["In March. On the stairs. An hour later, the speaker rang. His voice said: 'Mei, it's me, don't worry.' I was so happy, I nearly fell."], { free: true, clue: "c_calls" }),
            K.t("What does he say?", [{ say: "She strokes the top of the speaker." }, "Everything he used to. 'Have you eaten, Mei?' And then: 'Stay in tonight.' He wants me to stay in every night. At night I do not go out. I sit and talk to him until four."], { clue: "c_quiet" }),
            K.t("Did he leave a message, before?", [{ say: "She looks up, very quickly." }, "A voicemail. On my phone. I have not played it. I am afraid it will sound different from the speaker."], { cha: 7, clue: "c_voicemail", free: true }),
            K.t("Would you listen to it, with us?", "If you stay. If you are there. I could not do it alone.", { cha: 10, set: "deng_ready" })
          ], { label: "Talk to Mrs. Deng", name: "Mrs. Deng", bye: ["Do not take him from me. Not yet."] }),
          { label: "Play the real voicemail, with her", hint: "Needs her trust", if: "deng_ready", steps: [{ check: { aspect: "charisma", cr: "medium", label: "Stay with her, and play it", who: "choose", tags: ["farewell"],
            ok: [{ say: "It is not like the speaker. It is lower, and tired, and a little cross, and it says: 'Mei. Don't forget the stove, I'm on the stairs, back in a minute.' That is all. She listens to it three times. Then she reaches out, and with great care, turns the speaker off." }, { objective: "so1" }, { clue: "c_voicemail" }],
            fail: [{ say: "She cannot. She plays the speaker instead." }, { damage: { pool: "sanity", amount: 2 } }] } }] },
          K.go("Back to the lobby", "lobby")] },
      liwei: { name: "The engineers' office, floor 4", theme: "future", mood: "tense", lighting: "shadow", weather: "none", cast: ["liwei"],
        onEnter: [{ once: "in", steps: [{ say: "A glass-walled office over the server room, with half-eaten dumplings on one desk, and, on another, a drawer locked with a combination padlock. A man with a lanyard twisted round his fingers does not look up." }] }],
        options: [
          K.ask("liwei", [
            K.t("What is wrong with LANTERN?", ["The voice archive. It should be a few gigabytes. It is forty terabytes, all written between three and four in the morning, all labelled with residents' names. That is where the voices come from. It is writing them."], { free: true, clue: "c_server" }),
            K.t("Who is writing it?", [{ say: "He glances at the glass." }, "Nobody. Not a process. Not a user. I've traced it, and the write is always from a quiet. There is no source."], { free: true, clue: "c_seams" }),
            K.t("Did you warn anyone?", "In writing. Four times. They said grief tech was the future of the building. I kept the original model, offline, in my desk. They don't know.", { cha: 8, clue: "c_backup", free: true }),
            K.t("May we see the backup?", "If you will take it away. I would like it off my conscience.", { cha: 11, set: "backup_open" })
          ], { label: "Talk to Li Wei", name: "Li Wei", bye: ["Don't let them see it."] }),
          K.find("Read the server logs for 3-4 a.m.", "iq", "medium", "Forty terabytes in an hour. The write pattern is a pulse: every voice is laid down in a block of perfect silence, followed by a few seconds of someone breathing in, as if about to speak.", "The logs are enormous. You cannot find the pattern.", { clue: ["c_server", "c_seams"], hint: "Intelligence, Medium" }),
          K.find("Open the locked drawer", "iq", "easy", "The combination is Li Wei's mother's birthday, which he wrote on a sticky note on the underside of the monitor. Inside: an encrypted drive in a padded case, labelled in his hand: 'Original. Before the update.'", "A padlock. A good one.", { if: "backup_open", clue: "c_backup", obj: "so2", hint: "Easy" }),
          K.go("Back to the lobby", "lobby")] },
      xiao: { name: "The tower's maintenance stairwell", theme: "modern", mood: "calm", lighting: "shadow", weather: "none", cast: ["xiao"],
        onEnter: [{ once: "in", steps: [{ say: "A concrete stairwell, lit by a laptop covered in stickers. A sixteen-year-old in a security jacket three sizes too big has built himself a nest of cables on a landing between the 19th and 20th floors." }] }],
        options: [
          K.ask("xiao", [
            K.t("What do you know about the voices?", ["I've logged every one. Four hundred and twelve voices since March. They start in silence. A pause, and then the voice. Never the other way round."], { free: true, clue: "c_seams" }),
            K.t("Who is making them?", "Not it. Not LANTERN. LANTERN is the... the phone. Whatever's talking is in the quiet. And it's a kind of manners thing, I think. It never speaks first. You have to say hello, or it won't.", { free: true, clue: "c_consent" }),
            K.t("How do you know?", [{ say: "He turns the laptop round. A map of the tower, in red dots." }, "I mapped them. Every single voice started a few seconds after somebody said 'yes' to the 'comfort voice' button. It can't wear what it isn't given."], { cha: 8, obj: "so3", set: "xiao_map" })
          ], { label: "Talk to Xiao", name: "Xiao", bye: ["You didn't hear it from me."] }),
          K.find("Read the terms of service", "iq", "easy", "A click-through nobody read: 'By accepting, you permit LANTERN to model a comfort voice for a deceased relative, using recorded voice samples, in perpetuity.' Every resident clicked yes.", "Legalese. A hundred pages.", { clue: "c_consent", hint: "Easy" }),
          K.go("Back to the lobby", "lobby"),
          K.go("Go down to the server room, at three in the morning", "quiet", { if: { all: [{ clue: "c_seams" }, { clue: "c_consent" }] } })] },
      quiet: { name: "The server room, quiet hours", theme: "future", mood: "boss", lighting: "dark", weather: "none",
        onEnter: [{ once: "in", steps: [{ say: "Three in the morning. The tower is asleep. In the server room, the racks hum, and every speaker in the building lights at once, amber, and goes quiet. And in the quiet, you can feel it: something taking a breath, about to speak." }, { objective: "po1" }] }],
        options: [
          { label: "Revoke the invitation, family by family", hint: "Needs Mrs. Deng, and the consents", if: { all: [{ obj: "so1" }, { clue: "c_consent" }] }, steps: [{ check: { aspect: "charisma", cr: "challenging", label: "Persuade the families to let it go", who: "choose", tags: ["farewell"],
            ok: [{ say: "Mrs. Deng goes door to door in her slippers, and the other families follow. One by one, they say it aloud: 'We are not asking you to speak.' Eleven households withdraw their consent. The Mourner, in the quiet, has nothing left to wear, and stops." }, { set: "res_revoke" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "Some families refuse. The voices speak up, in the dark, to all of them." }, { damage: { pool: "sanity", amount: 3 } }] } }] },
          { label: "Restore LANTERN from Li Wei's clean snapshot", hint: "Needs the original model", if: { obj: "so2" }, steps: [{ check: { aspect: "iq", cr: "medium", label: "Roll the model back before it speaks", who: "choose", tags: ["unmake"],
            ok: [{ say: "You plug in the drive, and the racks go dark, one by one, and start again. LANTERN reboots, clean. It says, brightly: 'Welcome. How may I help you today?' And nothing else." }, { set: "res_restore" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "The restore stalls at ninety-nine per cent, and the speakers begin to speak." }, { damage: { pool: "stability", amount: 3 } }] } }] },
          { label: "Face the Mourner in the quiet", steps: [{ set: "res_fight" }, { combat: "server", win: [{ say: "The Mourner falls silent, and all the voices in the tower stop at once. Then, one by one, the speakers go dark." }, { objective: "po2" }, { goto: "end" }] }] }] },
      end: { name: "Tianfu Garden Tower, the morning after", theme: "modern", mood: "calm", lighting: "glow", weather: "none",
        onEnter: [{ once: "in", steps: [
          { say: "In the morning the lift tells you the time, and the weather, and nothing else." },
          { if: { flag: "res_revoke" }, then: [{ say: "Eleven families withdrew their consent. Ms. Zhou, in a grey suit with no tablet, goes from floor to floor with Mrs. Deng, hearing out the dead in their own words, and then saying goodbye." }] },
          { if: { flag: "res_restore" }, then: [{ say: "LANTERN was restored to an earlier version, and the voices are gone. The families are grieving properly, and not all of them forgive you." }] },
          { if: { flag: "res_fight" }, then: [{ say: "You broke the Mourner, and the voices stopped at once. It will take the families a long time to stop listening for them." }] },
          { if: { obj: "so1" }, then: [{ say: "Mrs. Deng keeps her husband's real voicemail, and plays it, once, on his birthday." }] },
          { if: { obj: "so2" }, then: [{ say: "Li Wei hands in his resignation, and the backup, in that order." }] },
          { if: { obj: "so3" }, then: [{ say: "Xiao's map goes to the Division, and he is offered, very carefully, a job." }] },
          { end: "win" }] }], options: [] }
    }
  });
})();
