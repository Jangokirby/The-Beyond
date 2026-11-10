/* ============================================================================
   PACK · DEAD AIR
   A three-part campaign arc for the NSBD and WCA, 1994-1996. A late-night
   cable-access show, "Uncle Dewey's After Hours", went off the air in 1987
   when its host died. Someone is still taping it. Kids who watch the tapes
   start to sleepwalk to the television, and the Uncle Dewey on the tape is
   learning their names.
   Choices that carry forward (arc flags):
     master_kept    part 1: you kept the master tape, sealed, instead of burning it
     dewey_found    part 1: you found the real Dewey's widow and heard the truth
     list_taken     part 2: you took the mail-order customer list
     dupes_freed    part 2: you got the copied people out of the dubbing house
   ========================================================================== */
(function () {
  const A = window.ART;
  const F = (s, hc, h, o, x = "none", more = {}) => ({ skin: A.SKIN[s], hairC: A.HAIRC[hc], hair: h, outfit: A.OUTFIT[o], extra: x, bg: "#2b2f3a", ...more });
  const RECUR = { "June Hollister": "da-june" };
  const N = (name, tag, look, face) => ({ name, tag, look, face, ...(RECUR[name] ? { recurs: RECUR[name] } : {}) });

  /* ---------------------------------------------------------------- part 1 · 1994 · Ohio */
  const part1 = {
    id: "da-1-channel", title: "Dead Air I: Channel 31", setting: "Lorain, Ohio · 1994", year: 1994, level: [1, 3], agencies: ["NSBD", "WCA"],
    summary: "In Lorain, Ohio, four kids have started getting up at 3 a.m. to sit in front of the TV with the sound off. Their parents find them there at dawn, cold, smiling, mouthing along to a show that went off the air in 1987: Uncle Dewey's After Hours, on cable-access Channel 31.",
    objectives: [
      { id: "po1", kind: "primary", t: "Find where the tapes come from", done: "A rental copy of an Uncle Dewey tape at Video Vault, with no master anywhere, and Channel 31's old studio still broadcasting at 3 a.m. to nobody." },
      { id: "po2", kind: "primary", t: "Take the show off the air", done: "The Channel 31 studio is dark, the host on the tape is gone, and four kids sleep through the night." },
      { id: "so1", kind: "secondary", t: "Find out who Uncle Dewey was", done: "Dewey Hollister, a children's entertainer who taped his last show the night before he died, and asked his wife to burn it." }],
    clues: {
      c_tape: { t: "The rental tape", s: "The Pruitts' living room", x: "A black VHS tape in the Pruitts' VCR, rented from Video Vault on Broadway. Handwritten label: AFTER HOURS #212. There was never a #212: the show ended at #211." },
      c_3am: { t: "Channel 31 at 3 a.m.", s: "The cable company", x: "Lorain Cable confirms Channel 31 has been off the air since 1987. Their meter says something has been sending a signal on it every night at 3 a.m. from the old community college studio." },
      c_names: { t: "He says their names", s: "The tape, frame by frame", x: "Played slowly, the tape shows Uncle Dewey reading out birthday names, as he did on the old show. The names are Kayla, Marcus, Becky and Josh: the four kids. A fifth name is cut off by tracking noise." },
      c_widow: { t: "The last show", s: "June Hollister", x: "Dewey Hollister taped one more show the night before his heart gave out, alone, at 3 a.m. He told his wife the kids at home were the only ones who ever watched, and he wanted to say goodbye. She was told to burn the master. She couldn't." }
    },
    npcs: {
      pruitt: N("Donna Pruitt", "Mother of Kayla, 9 · night-shift nurse", "Scrubs under a parka, a coffee she's forgotten, and the look of someone who has been sitting up with a sleeping child for a week.", F(2, 3, "ponytail", 9, "none", { sex: "f" })),
      rudy: N("Rudy Kaminski", "Owner of Video Vault", "A Cleveland Browns jacket, a mullet he's defending, and a returns box he's started to be afraid of.", F(1, 2, "long", 7, "cap", { sex: "m" })),
      june: N("June Hollister", "Dewey's widow", "A housecoat, a TV tray, a cat called Mister, and a shoebox on the top shelf of the closet that she hasn't touched in seven years.", F(0, 5, "curly", 4, "glasses", { sex: "f" }))
    },
    enemies: {
      tracking: { build: { name: "Tracking ghost", type: "Spirit", difficulty: "easy", sprite: "spirit", hue: 160, dtype: "sanity", dies: "rolls up the screen like a bad tracking line and is gone" } },
      dewey: { build: { name: "Uncle Dewey (on tape)", type: "Folklore", difficulty: "challenging", sprite: "humanoid", hue: 290, dtype: "sanity", core: { body: 1, mind: 3, spirit: 2 }, mods: ["Psychological Attacks", "Speech"], dies: "freezes on a single frame, smiling, and the tape snaps" } }
    },
    encounters: {
      studio: { name: "The Channel 31 studio", theme: "modern", fightText: "The ON AIR light goes red. On every monitor in the control room Uncle Dewey leans toward the camera, and then he isn't on the monitors.", zones: [
        { id: "a", name: "The control room", col: 0, row: 0 }, { id: "b", name: "The studio floor", col: 1, row: 0 }, { id: "c", name: "Dewey's set", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "tracking", zone: "b" }, { t: "tracking", zone: "a", name: "Tracking ghost (2)" }, { t: "dewey", zone: "c" }] }
    },
    start: "pruitt",
    scenes: {
      pruitt: { name: "The Pruitts' living room", theme: "interior", mood: "tense", weather: "building", cast: ["pruitt"],
        onEnter: [{ once: "in", steps: [
          { say: "A split-level on a street of split-levels. Wood paneling, a plaid couch, a big Zenith TV in a cabinet with the doors hanging open, and on the carpet in front of it, a dent where a small person has been sitting very still." },
          { say: "The VCR's clock is blinking 3:00. It's two in the afternoon." },
          { talk: { npc: "pruitt", text: "You're the federal people? The detective said you weren't federal. I don't care who you are. She's asleep upstairs. She'll sleep till three. Then she'll come down here." } }] }],
        options: [
          { label: "Talk to Donna", steps: [{ converse: { npc: "pruitt", id: "main",
            again: "What else? I've got to be at the hospital at ten.",
            topics: [
              { ask: "What happens at three?", lines: ["She comes down the stairs like she's being called for dinner. Sits right there, two feet from the screen. Sound off. Doesn't blink.", "And she mouths along. Like she's singing. When I turn it off she screams until I turn it back on, and then she's fine, and she's smiling, and I hate it more than the screaming."] },
              { ask: "What's on?", lines: ["Channel 31. Snow. It's been snow since the eighties.", { say: "She swallows." }, "Except she sees something. And one night I looked over her shoulder and for one second there was a man in a bow tie, waving."] },
              { ask: "Is she the only one?", lines: ["Marcus Bell two streets over. Becky and Josh from her class. It's going round the school like chicken pox. All four of them rented the same tape at Video Vault for Becky's sleepover."] }],
            bye: ["Bring her back. That's all. Bring her back to being nine."] } }] },
          { label: "Eject the tape from the VCR", hint: "It's still in there", once: true, steps: [
            { say: "The VCR doesn't want to give it up. It whirs, clunks, and spits out a black tape with a handwritten label: AFTER HOURS #212. The cassette is warm." },
            { clue: "c_tape" }] },
          { label: "Watch the tape, slowly", hint: "Frame by frame, sound down", if: { clue: "c_tape" }, once: true, steps: [
            { check: { aspect: "awareness", cr: "medium", label: "Find what's under the noise", investigate: true,
              ok: [{ say: "A cheap set: a cardboard moon, a puppet owl, a man in a bow tie with a voice like warm milk. 'And happy birthday to…' he says, and reads four names off a card. Kayla. Marcus. Becky. Josh. Then a fifth, eaten by tracking noise. He looks up into the camera, right at you, and the tape jumps." }, { clue: "c_names" }],
              fail: [{ say: "You lean in to see the names. The man on the screen leans in too. When you sit back, your nose is bleeding and a minute of the tape is missing from your memory." }, { damage: { pool: "sanity", amount: 3 } }, { clue: "c_names" }] } }] },
          { label: "Go to Video Vault", steps: [{ goto: "vault" }] },
          { label: "Call Lorain Cable", hint: "Someone must be sending a signal", once: true, steps: [
            { check: { aspect: "charisma", cr: "easy", label: "Get past the phone menu to a human",
              ok: [{ say: "A bored engineer called Pat finds it after twenty minutes: Channel 31 has been dark since '87, but their meter shows a signal every night at 3 a.m., three minutes long, from the old community-college studio on Kansas Avenue. 'Probably kids,' Pat says. 'Probably,' you say." }, { clue: "c_3am" }, { objective: "po1" }],
              fail: [{ say: "Forty minutes on hold to a synthesizer version of 'Greensleeves'. Then a man who tells you it's off the air, and before he hangs up, quieter: 'Except at three. It comes from the old college studio. Don't tell my boss I said.'" }, { clue: "c_3am" }, { objective: "po1" }] } }] },
          { label: "Drive to the old Channel 31 studio", if: { clue: "c_3am" }, steps: [{ goto: "studio" }] }] },
      vault: { name: "Video Vault, Broadway", theme: "modern", mood: "calm", weather: "city", cast: ["rudy"],
        onEnter: [{ once: "in", steps: [
          { say: "Fluorescent tubes, carpet worn grey, a cardboard Arnold by the door. New Releases on the wall, a bead curtain over the back room, and the hum of a dozen rewinders." },
          { talk: { npc: "rudy", text: "If this is about the Dewey tape, I didn't order it. I want that on the record. It was in the returns box one morning with no case and no barcode." } }] }],
        options: [
          { label: "Talk to Rudy", steps: [{ converse: { npc: "rudy", id: "main",
            topics: [
              { ask: "Where did it come from?", lines: ["Returns box, a month ago. No sticker, no case. I figured somebody's dad dumped his old tapes. I put it in Kids' Classics for a buck.", "It came back the next day. And the next. Somebody rents it, I swear I see 'em take it, and in the morning it's back in the box. I've never once checked it in."] },
              { ask: "Did you watch it?", lines: [{ say: "He rubs the back of his neck." }, "Once. In the back. Dewey was a big deal when I was a kid, okay? He did birthdays. He read your name if your mom sent a card in.", "He read mine. On a tape made in 1994. 'Happy birthday, Rudy.' He looked right at me. I went outside and smoked a whole pack."] },
              { ask: "Who was Dewey?", lines: ["Dewey Hollister. Did the late show on 31 for ten years, for the night-shift kids, the ones whose folks worked at the steel plant. Died in '87. His wife's still in town, over on Reid Avenue. Nice lady. Don't upset her."], then: [{ set: "june_known" }] }],
            bye: ["If you take that tape, take it. Don't bring it back. I mean it."] } }] },
          { label: "Search the back room for copies", once: true, steps: [
            { check: { aspect: "awareness", cr: "medium", label: "Search the back room",
              ok: [{ say: "Behind the adult section, in a milk crate, eleven more tapes: AFTER HOURS #212, every one of them, every label in the same handwriting. They're all warm. One of them is whispering." }, { set: "copies" }],
              fail: [{ say: "Boxes of returns and a dead cat in a trap. You leave. In the car, there's a black tape on the back seat with a handwritten label." }, { set: "copies" }] } }] },
          { label: "Visit June Hollister", if: "june_known", steps: [{ goto: "june" }] },
          { label: "Back to the Pruitts'", steps: [{ goto: "pruitt" }] }] },
      june: { name: "June Hollister's kitchen", theme: "interior", mood: "calm", weather: "building", cast: ["june"],
        onEnter: [{ once: "in", steps: [
          { say: "A small house, very clean. A TV tray with a crossword. A cat on the windowsill. On the wall, a framed photo of a man in a bow tie with a puppet owl on his arm, laughing at something off camera." },
          { talk: { npc: "june", text: "You've come about Dewey. Nobody's come about Dewey in seven years. Sit down, I'll put coffee on. Mister, get down." } }] }],
        options: [
          { label: "Talk to June", steps: [{ converse: { npc: "june", id: "main",
            topics: [
              { ask: "Tell me about Dewey", lines: ["He loved those kids. The night-shift kids. Their folks at the plant, the hospital, the docks. He said three a.m. was the loneliest hour in Ohio and somebody ought to be up with them.", "Ten years. He never missed a night."] },
              { ask: "How did he die?", lines: ["His heart. Fifty-one. The station cancelled the show that spring and he couldn't stand it. The night before he died he went down to the studio alone and taped one more show. Number 212.", { say: "She looks at the closet." }, "He made me promise to burn the master. He said, 'June, it's not for anybody. It's just goodbye.' I couldn't do it. I put it in a shoebox."], then: [{ clue: "c_widow" }, { objective: "so1" }] },
              { ask: "Can we see the tape?", if: { clue: "c_widow" }, lines: [{ say: "She brings down the shoebox. Inside, a U-matic master tape in a grey case labelled in his hand: AFTER HOURS #212, GOODBYE." }, "Take it. Do what he asked. I couldn't."], then: [{ set: "master" }, { arcSet: "dewey_found" }] }],
            bye: ["He wasn't a bad man. Whatever's on those tapes isn't him. He'd never have frightened a child."] } }] },
          { label: "Back to Video Vault", steps: [{ goto: "vault" }] },
          { label: "Drive to the old Channel 31 studio", if: { clue: "c_3am" }, steps: [{ goto: "studio" }] }] },
      studio: { name: "The old Channel 31 studio, Kansas Avenue", theme: "modern", mood: "boss", lighting: "dark", weather: "building",
        onEnter: [{ once: "in", steps: [
          { say: "A cinderblock wing of the community college, chained shut, with the old Channel 31 logo still on the door. The chain is on the ground. Inside, it's warm, and every light in the control room is on." },
          { say: "At 2:59 the monitors flick on by themselves. A cardboard moon. A puppet owl. A man in a bow tie, his back to the camera. At 3:00 the ON AIR light goes red, and he turns round." }] }],
        options: [
          { label: "Play the real goodbye", hint: "Put June's master tape on the studio deck", if: "master", once: true, steps: [
            { check: { aspect: "iq", cr: "medium", label: "Thread a U-matic deck by flashlight",
              ok: [{ say: "The real 212 plays. Dewey Hollister, tired, kind, alone on his cardboard set at 3 a.m. in 1987. 'This is the last one, kids,' he says. 'You go to bed now. Somebody's always up with you, even when it isn't me.' On the other monitors the thing in his bow tie stops smiling, and listens." }, { set: "goodbye" }],
              fail: [{ say: "The tape snarls in the heads. The thing on the monitors laughs, in Dewey's voice, at the wrong speed." }, { damage: { pool: "sanity", amount: 3 } }] } }] },
          { label: "Kill the transmitter", hint: "Take the show off the air", steps: [{ combat: "studio", surpriseIf: "goodbye", win: [
            { say: "The thing in the bow tie freezes on a single frame, smiling, and the tape in every deck in the building snaps at once. The ON AIR light goes out." },
            { objective: "po2" },
            { if: "master", then: [{ choice: { prompt: "June's master tape, the real goodbye, is still in the deck. You promised to burn it. The Order's archive would want it: it's the only clean copy of what the Beyond was copying.", options: [
              { label: "Seal it and keep it", steps: [{ say: "You seal it in a lead case and write June's name on it. Someday someone will need to know what the real one sounded like." }, { arcSet: "master_kept" }] },
              { label: "Burn it, as Dewey asked", steps: [{ say: "You burn it in a trash can behind the studio. It smells of hot plastic and, for a moment, of somebody's aftershave." }] }] } }] },
            { say: "At 3 a.m. the next night, Kayla Pruitt sleeps through. So do the others. But Rudy calls in the morning: the tape in the returns box is gone, and so are the eleven in the back room, and a mail-order slip was left in the box. Postmarked Nevada." },
            { end: "win" }] }] }] }
    }
  };

  /* ---------------------------------------------------------------- part 2 · 1995 · Nevada */
  const part2 = {
    id: "da-2-rewind", title: "Dead Air II: Be Kind, Rewind", setting: "Pahrump, Nevada · 1995", year: 1995, level: [2, 4], agencies: ["NSBD", "WCA"],
    summary: "The Uncle Dewey tapes have gone mail order: ads in the back of comic books, ten dollars for a 'lost episode'. They're dubbed in a duplication house in the Nevada desert. The people who work there have started to come out of the machines in pairs.",
    objectives: [
      { id: "po1", kind: "primary", t: "Find the dubbing house", done: "Silver Sage Video Duplicating, in a steel barn off Highway 160, running 400 decks day and night." },
      { id: "po2", kind: "primary", t: "Shut down the duplication", done: "The decks are dead, the master loop is cut, and the desert is quiet." },
      { id: "so1", kind: "secondary", t: "Get the copied people out", done: "Six workers and their copies come out into the sun, and only one of each walks to the cars." }],
    clues: {
      c_ad: { t: "The comic-book ad", s: "The post office", x: "LOST EPISODES OF UNCLE DEWEY! The show they took off the air! $10 cash or money order to Box 31, Pahrump NV. The post office says Box 31 gets two hundred letters a day, all from kids." },
      c_doubles: { t: "Two of Wendell", s: "The Sagebrush Motel", x: "The motel clerk swears Wendell Price from the dubbing house checked in twice last Tuesday: once at six, once at nine, same face, same truck. The second one asked what his own name was." },
      c_loop: { t: "The master loop", s: "Silver Sage's office", x: "Every deck in the barn records from one master: a loop of tape in a deck nobody installed, playing 212 over and over. Each pass, the copy on it is a little more like the person standing nearest the deck." },
      c_list: { t: "Box 31's customer list", s: "Silver Sage's office", x: "A dot-matrix printout eleven feet long: every kid who has sent ten dollars to Box 31, with an address. Four thousand, two hundred names." }
    },
    npcs: {
      lorna: N("Lorna Diaz", "Postmistress", "Reading glasses on a chain, a cardigan in the desert heat, and a mail sack she keeps at arm's length.", F(4, 0, "bob", 3, "glasses", { sex: "f" })),
      wendell: N("Wendell Price", "Dubbing-house foreman", "A sunburnt neck, a company polo, and the uneasy manner of a man who isn't sure he's the original.", F(1, 3, "buzz", 1, "cap", { sex: "m" })),
      clerk: N("Kenny", "Night clerk, Sagebrush Motel", "Nineteen, a Walkman, a Discman, and a skin-crawling certainty that he's seen everyone in Pahrump twice.", F(5, 0, "curly", 8, "none", { sex: "m" }))
    },
    enemies: {
      dub: { build: { name: "Dub", type: "Construct", difficulty: "easy", sprite: "humanoid", hue: 0, dtype: "health", dies: "unspools into a heap of magnetic tape shaped like a person" } },
      duplicator: { build: { name: "The Duplicator", type: "Beyond", difficulty: "challenging", sprite: "construct", hue: 100, dtype: "sanity", core: { body: 3, mind: 2, spirit: 2 }, mods: ["Tanky", "Psychological Attacks"], dies: "stops, rewinds itself with a long shriek, and is a heap of dead VCRs" } }
    },
    encounters: {
      barn: { name: "The duplication barn", theme: "lab", fightText: "Four hundred VCRs click to RECORD at once. Between the racks, the copies stand up.", zones: [
        { id: "a", name: "The loading door", col: 0, row: 0 }, { id: "b", name: "The rack aisles", col: 1, row: 0 }, { id: "c", name: "The master deck", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "dub", zone: "b" }, { t: "dub", zone: "b", name: "Dub (2)" }, { t: "dub", zone: "a", name: "Dub (3)" }, { t: "duplicator", zone: "c" }] }
    },
    start: "post",
    scenes: {
      post: { name: "Pahrump post office", theme: "desert", mood: "calm", weather: "wind", cast: ["lorna"],
        onEnter: [{ once: "in", steps: [
          { say: "A low stucco building on a highway in the middle of nothing, flag snapping in a hot wind. Inside, a swamp cooler roars and a radio plays country. Behind the counter, the postmistress is weighing a mail sack full of envelopes in crayon handwriting." },
          { if: { arc: "dewey_found" }, then: [{ say: "In your bag, June Hollister's letter: a list of every kid Dewey ever read a birthday for. The names on these envelopes aren't on it. They're new." }] }] }],
        options: [
          { label: "Talk to Lorna", steps: [{ converse: { npc: "lorna", id: "main",
            topics: [
              { ask: "Box 31", lines: ["Two hundred letters a day. Kids. Ten-dollar bills taped to notebook paper. 'Dear Uncle Dewey, please send the lost episode.' Some of them have drawings.", "Wendell from Silver Sage picks them up at eight. He used to pick them up at eight. Now he comes at eight and again at nine, and the second time he doesn't know me."], then: [{ clue: "c_ad" }] },
              { ask: "Silver Sage?", lines: ["Video duplicating. Out on 160, past the brothel and the fireworks stand. Used to do wedding tapes and real estate. Now they run all night. You can hear the decks from the road."], then: [{ objective: "po1" }] }],
            bye: ["If you go out there, take water. And check the face of anybody who offers you a ride back."] } }] },
          { label: "Read the kids' letters", hint: "A sack of them is right there", once: true, steps: [
            { check: { aspect: "willpower", cr: "medium", label: "Read them without letting them in",
              ok: [{ say: "Crayon, glitter, ten-dollar bills. 'Dear Uncle Dewey, my dad works nights too.' 'Dear Uncle Dewey, will you say my name?' A few, the newest, in adult handwriting: 'Thank you for the episode. My son sits with you every night now.'" }],
              fail: [{ say: "Halfway down the sack, a letter in your own handwriting, asking Uncle Dewey to say your name. You don't remember writing it." }, { damage: { pool: "sanity", amount: 3 } }] } }] },
          { label: "Check in at the Sagebrush Motel", steps: [{ goto: "motel" }] },
          { label: "Drive out to Silver Sage", if: { obj: "po1" }, steps: [{ goto: "office" }] }] },
      motel: { name: "The Sagebrush Motel", theme: "drive", mood: "tense", weather: "night", cast: ["clerk"],
        onEnter: [{ once: "in", steps: [
          { say: "Twelve rooms in an L around a gravel lot, a neon cactus with half its tubes out, an ice machine that sounds like it's chewing. In the office, a kid with a Walkman looks at you, and then very carefully looks at you again." }] }],
        options: [
          { label: "Talk to Kenny", steps: [{ converse: { npc: "clerk", id: "main",
            topics: [
              { ask: "You looked twice", lines: ["Sorry. Habit now. Everybody's coming in twice. Wendell Price checked into 7 at six last Tuesday, and then Wendell Price checked into 7 at nine, same truck, same everything, and asked me what his name was.", "I gave him the key. What was I gonna do? The first one never checked out. Nobody's come out of 7 since."], then: [{ clue: "c_doubles" }] },
              { ask: "Room 7", lines: ["Be my guest. I'm not going in there. It's been playing the TV for a week. Same show. I can hear the theme song through the wall."], then: [{ set: "room7" }] }],
            bye: ["If you come back, I'm gonna look at you twice. Don't take it personal."] } }] },
          { label: "Open room 7", if: "room7", once: true, steps: [
            { say: "The TV is on, Uncle Dewey waving on a cardboard moon. Two men sit on the end of the bed watching it, shoulder to shoulder, identical, both Wendell Price, both mouthing along." },
            { check: { aspect: "charisma", cr: "challenging", label: "Get the real Wendell to look at you",
              ok: [{ say: "You say his name until one of them blinks. That one stands up, shaking, and walks out into the lot with you. The other keeps watching. When you look back through the door, he's a heap of tape on the bedspread." }, { set: "wendell_real" }],
              fail: [{ say: "They both turn to you at once and say, together, 'Happy birthday.' You back out and shut the door." }, { damage: { pool: "stability", amount: 3 } }] } }] },
          { label: "Back to the post office", steps: [{ goto: "post" }] },
          { label: "Drive out to Silver Sage", if: { obj: "po1" }, steps: [{ goto: "office" }] }] },
      office: { name: "Silver Sage Video Duplicating", theme: "desert", mood: "dread", weather: "wind", cast: [],
        onEnter: [{ once: "in", steps: [
          { say: "A steel barn the size of an aircraft hangar in a field of creosote, a trailer office beside it, and a hum you can feel in your fillings: four hundred VCRs recording at once, day and night." },
          { if: "wendell_real", then: [{ say: "Wendell Price, the real one, sits in your car with the air-conditioning on and draws you a map of the barn on a napkin: the racks, the loading door, and at the back, a deck he swears nobody ever installed." }] }] }],
        options: [
          { label: "Search the trailer office", once: true, steps: [
            { check: { aspect: "iq", cr: "medium", label: "Make sense of the paperwork", investigate: true,
              ok: [{ say: "Work orders for a company that doesn't exist. And taped to the wall, a wiring diagram in Wendell's hand: every deck in the barn fed from one source, labelled MASTER (???), with a loop drawn round it." }, { clue: "c_loop" }],
              fail: [{ say: "Invoices, coffee rings, a calendar from 1993. Then you see it on the wall, half under a pin-up: every deck fed from one source, MASTER (???)." }, { clue: "c_loop" }] } },
            { say: "In the filing cabinet, under the invoices: a dot-matrix printout, folded into a block a foot thick. Box 31's customers." },
            { choice: { prompt: "Four thousand two hundred names and addresses: every kid who has a tape.", options: [
              { label: "Take the list", steps: [{ say: "It goes in the trunk. It weighs more than paper should." }, { clue: "c_list" }, { arcSet: "list_taken" }] },
              { label: "Leave it", steps: [{ say: "You leave it in the drawer. You'll have enough to carry." }] }] } }] },
          { label: "Get the workers out first", hint: "There are people in there, and copies of people", once: true, steps: [
            { group: { aspect: "awareness", cr: "challenging", label: "Tell the people from the copies", intro: "Six workers on the floor, and twelve of them. You have to pick, fast, and walk the right ones out.",
              ok: [{ say: "The copies blink a little too slowly. The people sweat. You walk six sunburnt, terrified people out into the desert, and twelve figures watch you from between the racks." }, { objective: "so1" }, { arcSet: "dupes_freed" }],
              fail: [{ say: "You get four out before the copies notice. Two of the people you walk out are not people, and they come apart into tape in the sunlight in front of the others." }, { damage: { pool: "sanity", amount: 3 } }] } }] },
          { label: "Go into the barn", steps: [{ combat: "barn", surpriseIf: "wendell_real", win: [
            { say: "The Duplicator rewinds itself with a long shriek and is only a heap of dead VCRs. In the master deck, the loop of tape keeps turning by itself, until you cut it." },
            { objective: "po2" },
            { say: "Four hundred decks stop at once. The silence in the desert is enormous." },
            { say: "But the tapes already went out. Four thousand, two hundred of them, in padded envelopes, to kids who watch at three in the morning. And the cut master, when you hold it up to the light, has a date written on the leader in a hand like Dewey's: 12.31.96. SIGN-OFF." },
            { end: "win" }] }] }] }
    }
  };

  /* ---------------------------------------------------------------- part 3 · 1996 · Ohio, New Year's Eve */
  const part3 = {
    id: "da-3-signoff", title: "Dead Air III: Sign-Off", setting: "Lorain County, Ohio · New Year's Eve 1996", year: 1996, level: [3, 5], agencies: ["NSBD", "WCA"],
    summary: "New Year's Eve, 1996. An old TV transmitter on a hill outside Lorain has switched itself back on. At midnight it will broadcast Uncle Dewey's sign-off to every set in Ohio, and every kid who ever watched a tape will get up and go to it.",
    objectives: [
      { id: "po1", kind: "primary", t: "Reach the transmitter before midnight", done: "You're at the foot of the tower at 11:40, with the snow coming down." },
      { id: "po2", kind: "primary", t: "Stop the sign-off", done: "Midnight comes and goes. Across Ohio, kids sleep through the fireworks." },
      { id: "so1", kind: "secondary", t: "Keep the kids at home", done: "The kids who got up are turned around and walked home before they reach the hill." }],
    clues: {
      c_tower: { t: "WLRN's old tower", s: "The hotel lobby TV", x: "Every TV in the county shows the same test card tonight, with a time in the corner counting down to midnight. The engineer at the cable company traced it to WLRN's old transmitter on Murray Ridge, dead since 1982." },
      c_walkers: { t: "The kids are walking", s: "The police scanner", x: "Since eleven, the scanner has been calling in kids walking in pajamas along the county roads, all heading west toward Murray Ridge. Dozens. No one can stop them without them screaming." },
      c_reverse: { t: "Play it backwards", s: "June Hollister", x: "June says Dewey's last words on the real goodbye tape were the end of every show: 'Rewind it and say goodnight.' The real master, played backwards through the transmitter, unsays everything the copy has said." }
    },
    npcs: {
      june: N("June Hollister", "Dewey's widow", "A good winter coat over her housecoat and a thermos of coffee. She insisted on coming.", F(0, 5, "curly", 4, "glasses", { sex: "f" })),
      pat: N("Pat Szabo", "Cable engineer", "A Carhartt jacket, a toolbelt, and the jumpy good humour of a man who's been waiting all year for someone to believe him.", F(2, 1, "short", 2, "cap", { sex: "f" }))
    },
    enemies: {
      kid: { build: { name: "Sleepwalking kid (held)", type: "Human", difficulty: "easy", sprite: "humanoid", hue: 220, dtype: "health", dies: "sits down in the snow and asks for their mom" } },
      signoff: { build: { name: "The Sign-Off", type: "Beyond", difficulty: "dangerous", sprite: "beyond", hue: 300, dtype: "sanity", core: { body: 2, mind: 4, spirit: 3 }, mods: ["Psychological Attacks", "Leader", "Steel Mind"], dies: "says 'goodnight, kids' in a thousand voices, and goes to snow" } }
    },
    encounters: {
      tower: { name: "The transmitter on Murray Ridge", theme: "snow", fightText: "The tower lights go red, top to bottom. On the hill, a shape the height of the mast leans down out of the static: a bow tie, a cardboard moon, a smile made of every kid who ever watched.", zones: [
        { id: "a", name: "The access road", col: 0, row: 0 }, { id: "b", name: "The transmitter shed", col: 1, row: 0 }, { id: "c", name: "The foot of the mast", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "kid", zone: "b" }, { t: "kid", zone: "b", name: "Sleepwalking kid (2)" }, { t: "signoff", zone: "c" }] }
    },
    start: "hotel",
    scenes: {
      hotel: { name: "The Holiday Inn lobby, Lorain", theme: "modern", mood: "tense", weather: "building", cast: ["pat"],
        onEnter: [{ once: "in", steps: [
          { say: "Tinsel, a New Year's party in the ballroom, a bar full of people in paper hats counting down an hour early. On the lobby TV, instead of Dick Clark, a test card: a cardboard moon and a puppet owl, and in the corner, white numbers counting down to midnight." },
          { say: "Pat Szabo from Lorain Cable is waiting by the TV with a toolbelt over her party dress." },
          { if: { arc: "list_taken" }, then: [{ say: "In the trunk of your car: four thousand two hundred names. You've had a year. Every family on that list in Ohio got a phone call this afternoon: unplug the TV tonight, lock the doors, sit up with your kid." }] }] }],
        options: [
          { label: "Talk to Pat", steps: [{ converse: { npc: "pat", id: "main",
            topics: [
              { ask: "Where's it coming from?", lines: ["WLRN's old tower on Murray Ridge. Analog, VHF, dead since '82. The FCC pulled the licence. It's on. It's on at full power and it's not connected to anything.", "It's riding every cable channel in the county. At midnight it'll be on every set in Ohio. I checked."], then: [{ clue: "c_tower" }] },
              { ask: "Can it be turned off?", lines: ["From the shed at the foot of the mast. There's a main breaker. If you can get to it. If whatever turned it on lets you."] }],
            bye: ["I'll drive. I know the back road. Bring coffee."] } }] },
          { label: "Listen to the police scanner", hint: "Pat has one on her belt", once: true, steps: [
            { say: "Calls stacking up, one after another: a nine-year-old girl walking west on Route 58 in pajamas. Two boys on Murray Ridge Road. A child, three children, eleven. 'They won't stop. They scream if you touch them.'" },
            { clue: "c_walkers" },
            { if: { arc: "list_taken" }, then: [{ say: "Fewer than there should be. Far fewer. The phone calls worked: most of the kids on the list are home, behind locked doors, sitting up with their parents. Only the ones you couldn't reach are walking." }, { set: "fewer" }] }] },
          { label: "Go to June's", if: { arc: "master_kept" }, steps: [{ goto: "june" }] },
          { label: "Drive to Murray Ridge", if: { clue: "c_tower" }, steps: [{ objective: "po1" }, { goto: "road" }] }] },
      june: { name: "June Hollister's kitchen", theme: "interior", mood: "calm", weather: "building", cast: ["june"],
        onEnter: [{ once: "in", steps: [
          { say: "June has the TV unplugged and turned to the wall. The cat is under the table. She's in her coat already." },
          { talk: { npc: "june", text: "You kept it. The real one. I knew you would. Dewey would've been cross. I'm not." } }] }],
        options: [
          { label: "Talk to June", steps: [{ converse: { npc: "june", id: "main",
            topics: [
              { ask: "How do we stop it?", lines: ["Every night for ten years he ended the show the same way. He'd hold up the tape of that night's show and say, 'That's all, kids. Rewind it and say goodnight.'", "That's what that thing hasn't got. It's got everything he said, and it's never once said goodnight."], then: [{ clue: "c_reverse" }] },
              { ask: "Will you come?", lines: [{ say: "She's already got her thermos." }, "Somebody has to say goodnight to him properly."] }],
            bye: ["Let's go. It's nearly twelve."] } }] },
          { label: "Drive to Murray Ridge", steps: [{ objective: "po1" }, { goto: "road" }] }] },
      road: { name: "Murray Ridge Road", theme: "snow", mood: "dread", lighting: "dark", weather: "wind",
        onEnter: [{ once: "in", steps: [
          { say: "Snow in the headlights. The red lights of the mast blinking on the ridge ahead. And on the road, in the snow, in pajamas and slippers and one in a Power Rangers costume, kids. Walking west. Not looking at you." },
          { if: "fewer", then: [{ say: "A handful. Fewer than a dozen. The rest are at home, held by their parents in front of dark TVs, because of you." }] }] }],
        options: [
          { label: "Turn the kids around", hint: "Gently. They scream if you're rough", once: true, steps: [
            { group: { aspect: "charisma", cr: "challenging", label: "Walk them home", intro: "Kneel in the snow. Say their names before he does.",
              ok: [{ say: "One by one they stop, and blink, and start to cry from the cold, which is a very good sign. Pat's van fills with sleepy, frightened kids in wet slippers." }, { objective: "so1" }],
              fail: [{ say: "They walk round you like water round a stone. One of them looks back and says, in Dewey's voice, 'Happy birthday.'" }, { damage: { pool: "sanity", amount: 3 } }] } }] },
          { label: "Go up to the tower", steps: [{ goto: "tower" }] }] },
      tower: { name: "The transmitter on Murray Ridge", theme: "snow", mood: "boss", lighting: "dark", weather: "storm",
        onEnter: [{ once: "in", steps: [
          { say: "A chain-link fence, a concrete shed, and the mast going up four hundred feet into the snow, every light on it red. The air hums. The hair on your arms stands up. In the shed window, a test card glows. 11:52." }] }],
        options: [
          { label: "Play the real goodbye backwards through the transmitter", hint: "Rewind it and say goodnight", if: { all: [{ arc: "master_kept" }, { clue: "c_reverse" }] }, once: true, steps: [
            { check: { aspect: "iq", cr: "challenging", label: "Patch June's master into a forty-year-old transmitter",
              ok: [{ say: "Pat holds the flashlight. You splice, and patch, and press PLAY with the tape running backwards, and out over Ohio goes Dewey Hollister's real goodbye, unsaid, word by word. June leans to the old microphone and says, very clearly, 'Goodnight, Dewey.'" }, { say: "Up on the mast, something huge stops, and listens." }, { set: "rewound" }],
              fail: [{ say: "The transmitter howls feedback and throws you across the shed. The tape is still whole. There isn't time to try again." }, { damage: { pool: "health", amount: 4 } }] } }] },
          { label: "Throw the main breaker", hint: "Whatever's on the hill will stop you", steps: [{ combat: "tower", surpriseIf: "rewound", win: [
            { say: "The Sign-Off says 'goodnight, kids' in a thousand voices, and goes to snow. You throw the breaker. Every red light on the mast goes out, top to bottom, and the hum stops." },
            { objective: "po2" },
            { say: "Midnight comes. Down in Lorain there are fireworks over the lake, and every TV in the county shows Dick Clark in Times Square, three minutes late." },
            { if: "rewound", then: [{ say: "On the drive back June falls asleep against the window, smiling. Pat says nobody in Lorain County will dream about a bow tie again. You believe her." }] },
            { if: { all: [{ arc: "dupes_freed" }, { arc: "dewey_found" }] }, then: [{ say: "In February, a letter comes care of the NSBD: Wendell Price and five others from Silver Sage, a card signed by all of them, once each." }] },
            { end: "win" }] }] }] }
    }
  };

  window.PACKS.define({
    format: "beyond-pack", id: "dead-air", name: "Dead Air", version: "1", author: "Gage Lee", builtIn: true,
    description: "A three-part arc for the NSBD and WCA, 1994 to 1996. A late-night cable-access show went off the air when its host died. Someone is still taping it.",
    cases: [part1, part2, part3],
    arcs: [{ id: "dead-air", title: "Dead Air", agencies: ["NSBD", "WCA"], villain: "The thing on the Uncle Dewey tapes", parts: [part1.id, part2.id, part3.id],
      summary: "Three cases, three years, one cable-access show that won't go off the air. A tape you keep, a list you take and the people you save all come back on the night it signs off." }]
  });
})();
