/* ============================================================================
   GREY MARKET, a three-part story arc led by the Black Fang
   Vanguard (any agency may help), 2079-2081, in the megacities of the Chinese
   coast and Korea. Back-alley implants, rented memories, and what lives in
   a company's source code. Choices carry forward with {arcSet}.
   ========================================================================== */
(function () {
  const K = window.CASEKIT, F = K.face, N = K.person;
  const cases = [], reg = (a) => (cases.push(a), a);
  const ALL = ["BFV", "NSBD", "WCA", "EHG", "OID"];

  /* ======================================================================= 2079 · Grey Market I */
  reg({
    id: "gm-1-cheap-eyes", title: "Grey Market I: The Cheap Eyes", setting: "Hongyadong stilt-blocks, Chongqing · 2079", year: 2079, level: [1, 4], agencies: ALL, region: "asia-east", theme: "street",
    summary: "Chongqing, 2079. Back-alley clinics are selling 'Sparrow' optic implants at a tenth of the corporate price. Fourteen wearers have stopped sleeping. Two have walked off a skybridge, calmly, looking at something behind the person who tried to stop them. Handler Wen wants it closed before the clinics franchise.",
    objectives: [
      { id: "po1", kind: "primary", t: "Find where the Sparrow firmware comes from", done: "The implants run a pirated build of a Yunlan Optics night-vision stack, with a subroutine that was never in the original: a second pair of eyes." },
      { id: "po2", kind: "primary", t: "Stop the implants from looking back", done: "The night mode goes dark across the stilt-blocks. Fourteen wearers sleep, some of them for the first time in weeks." },
      { id: "so1", kind: "secondary", t: "Hear a wearer describe what the night mode shows", done: "Ma Lan, who sells noodles under the skybridge, says there is always one more person in the picture, standing just behind the person she is looking at.", benefit: { label: "Knowing where it stands", text: "You know it hides behind other people. A bonus on every roll to catch it out.", bonus: { tags: ["spot"], value: 2 } } },
      { id: "so2", kind: "secondary", t: "Get the clinic's flash log", done: "Dr. Zhou's rig logged every unit it wrote: sixty-one implants, all from one source file, and the file's last line is a signature that is not a company's.", benefit: { label: "The source file", text: "You can write a patch that bites. A bonus on every roll to rewrite or kill the firmware.", bonus: { tags: ["patch"], value: 2 } } },
      { id: "so3", kind: "secondary", t: "Keep Tao out of the nest", done: "The courier who has been delivering the units is talked out of the final delivery, and keeps both his eyes.", benefit: { label: "A courier's route", text: "You know the back ways over the roofs. A bonus on every roll to move unseen.", bonus: { tags: ["roof"], value: 2 } } }
    ],
    clues: {
      c_fall: { t: "He looked past the man holding his sleeve", s: "The skybridge camera", x: "The skybridge footage: a young man walks to the rail, and a woman takes his sleeve. He is not looking at her. He is looking at the empty air just behind her left shoulder, smiling, politely, the way you smile at someone who has been standing there a while." },
      c_price: { t: "A tenth of the corporate price", s: "Dr. Zhou's price list", x: "Sparrow implants cost a tenth of a Yunlan Aurora unit and promise the same night vision. A price like that is not a discount. It means someone else is paying for the units, in a currency that is not money." },
      c_blink: { t: "A second blink", s: "Ma Lan", x: "Every wearer blinks twice when a Sparrow is switched on. The second blink is not theirs. It happens a quarter-second after, and the wearer's eye does not close." },
      c_firm: { t: "A line that is not in the Yunlan build", s: "The flash log", x: "The Sparrow firmware is a copy of Yunlan's night-vision stack with 4,096 extra bytes in the middle. It is not code. It is a repeating pattern that, rendered as an image, looks like a small figure standing in a doorway." },
      c_node: { t: "Every unit phones home to one rooftop", s: "Tao's route sheet", x: "Every Sparrow, when it is first switched on, sends a short handshake to a relay on the roof of block 14, an old storage tank nest the stilt-houses have never inspected. The relay is not on any network map." },
      c_hao: { t: "Yunlan knew, and wrote the recall as a 'discount'", s: "Hao's memo", x: "Yunlan Optics has been quietly buying back Aurora units whose firmware was copied. Their security chief, Hao, wrote a memo in March: 'If the pirates are wearing it, let them. Watch what happens.' He wanted to see what the extra bytes would do." },
      c_blind: { t: "It is blind when it is lit", s: "Zhou's bench notes", x: "The extra pattern only renders in low light. Under full-spectrum white light, the figure in the doorway does not appear. The wearers who slept best were the ones who lived over a lit street." }
    },
    npcs: {
      wen: N("Handler Wen", "BFV handler", "Fifties, in a plain charcoal jacket, voice only on an encrypted call, a small red dot of light in your ear.", F(1, 3, "short", 6, "none", { sex: "f" })),
      zhou: N("Dr. Zhou Mei", "Back-alley clinic surgeon", "Forties, in a green surgical gown under a cheap puffer jacket, with a magnifier on a headband, tired hands and a very steady eye.", F(2, 1, "bun", 4, "none", { sex: "f" })),
      lan: N("Ma Lan", "Noodle-stall cook, a wearer", "Thirties, in an apron and a rain jacket, with a small silver sheen at the corner of each eye, who has not slept in nine days and keeps cooking anyway.", F(2, 1, "ponytail", 3, "none", { sex: "f" })),
      tao: N("Tao", "Courier", "Early twenties, in a delivery jacket with a lit logo, a cracked phone, and two scooters' worth of roof routes in his legs.", F(3, 1, "short", 5, "none", { sex: "m" })),
      hao: N("Hao Jinyi", "Yunlan Optics security chief", "Fifties, in a grey suit with the company's thin silver pin, a tablet held like a shield, and the smile of a man who has already decided what happens to you.", F(2, 2, "short", 0, "none", { sex: "m" }))
    },
    enemies: {
      watcher: { build: { name: "The One Behind You", type: "Beyond", difficulty: "challenging", sprite: "spirit", hue: 190, dtype: "sanity", core: { body: 2, mind: 3, spirit: 3 }, mods: ["Occult", "Tanky"],
        text: "A figure in the doorway that the Sparrow's night mode lets in. Behind: each round it stands behind one agent or ally (Awareness Medium to notice it, or lose the next action and 3 Sanity as it looks out of their eyes). It cannot stand in white light: a lit lantern, a floodlamp or a strobe makes it flicker and take double damage. Only Sanity harms it.", dies: "the figure steps back into its doorway, and the doorway is only a wall" } },
      wearer: { build: { name: "A Sparrow wearer", type: "Human", difficulty: "easy", sprite: "humanoid", hue: 200, attack: 1, dtype: "health", dies: "sits down, blinks once, and asks what day it is" } }
    },
    encounters: {
      nest: { name: "The relay nest", theme: "street", fightText: "A rusted storage-tank nest on the roof of block 14, strung with cheap lamps that have all been switched off. A rack of dead routers hums in the middle. Four wearers stand round it with their eyes silver in the dark, all facing the same corner, where nothing is.", zones: [{ id: "a", name: "The ladder", col: 0, row: 0 }, { id: "b", name: "The lamp strings", col: 1, row: 0 }, { id: "c", name: "The rack", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "watcher", zone: "c" }, { t: "wearer", zone: "b" }, { t: "wearer", zone: "b", name: "A Sparrow wearer (2)" }] }
    },
    start: "stairs",
    scenes: {
      stairs: { name: "Hongyadong, the stilt-street", theme: "street", mood: "tense", lighting: "bright", weather: "rain", cast: ["wen"],
        onEnter: [{ once: "in", steps: [
          { say: "Chongqing, in the year 2079. The old stilt-houses cling to the cliff above the Jialing, forty storeys of lantern-lit balconies and market stairs, and over every roof the neon of three hundred companies reflects in the rain. In the middle of it all, something is wrong with the eyes." },
          { talk: { npc: "wen", text: "Fourteen wearers, two on the pavement. The clinics call it Sparrow: night vision at a tenth of the price. I do not believe in discounts. Find the clinic, find the file, and find out what is standing behind these people, because the coroner says they were looking at it." } }] }],
        options: [
          K.ask("wen", [
            K.t("What do we know?", ["Fourteen wearers, one clinic address, and a skybridge. The first fall was on the 3rd. They did not struggle. They looked, one witness says, at someone who was not there."], { free: true, clue: "c_fall" }),
            K.t("Who sells them?", "A surgeon called Zhou Mei under the stairs on Level 6. A courier, Tao, runs the units. Both would sooner talk to a stranger than to Yunlan.", { free: true, set: "contacts_known" }),
            K.t("Does Yunlan know?", "Yunlan Optics always knows. Their security chief, Hao Jinyi, has been in the district for a month. He has not made a single arrest.", { cha: 7, clue: "c_hao" }),
            K.t("What do you want us to do about it?", "Close it quietly. I would rather not hand the Beyond to a corporate legal department, and I would rather not close fourteen clinics' worth of people's eyes.", { cha: 10, set: "wen_leave" })
          ], { label: "Call Handler Wen", name: "Wen", bye: ["Stay in the light."] }),
          K.find("Review the skybridge footage", "iq", "easy", "A young man at the rail, a woman who takes his sleeve. He looks past her, smiling, at a spot just behind her left shoulder. The footage has no one there. His pupils, at the last frame, are lit silver.", "A great deal of rain.", { clue: "c_fall", hint: "Easy" }),
          K.go("Down to Dr. Zhou's clinic", "clinic", { if: "contacts_known" }),
          K.go("To Ma Lan's noodle stall", "stall", { if: "contacts_known" }),
          K.go("Find Tao, on the roofs", "roofs", { if: "contacts_known" })] },
      clinic: { name: "A clinic under the stairs", theme: "interior", mood: "calm", lighting: "bright", weather: "none", cast: ["zhou"],
        onEnter: [{ once: "in", steps: [{ say: "Level 6, under a market stair: a room the size of a bus shelter, lit white, with a dentist's chair, a rack of flash-writers, a bowl of cheap noodles gone cold, and a surgeon who stops mid-sentence when you duck in under the door." }] }],
        options: [
          K.ask("zhou", [
            K.t("Where do you get the units?", ["From Tao. He gets them from a crate on a roof. No label. A tenth of the Aurora price, and I do not ask why. I have sixty-one patients and fifty-nine of them are paying me back in cash."], { free: true, clue: "c_price" }),
            K.t("Why is your clinic so brightly lit?", "Because the first one I did in the dark looked back at me. I've kept the lights up since. I have not told the patients.", { free: true, clue: "c_blind", obj: "so2" }),
            K.t("Can you show us the flash log?", [{ say: "She hesitates, and then turns the screen." }, "Sixty-one units, one source file, written and signed by a name that is not a company. It is the cleanest piece of code I have ever seen. I do not like it."], { cha: 7, clue: "c_firm", set: "log_seen" }),
            K.t("Will you help us shut it down?", "If you stop it, yes. If you only shut me, no. My patients still need their eyes.", { cha: 10, set: "zhou_help" })
          ], { label: "Talk to Dr. Zhou", name: "Dr. Zhou", bye: ["Keep the lights on."] }),
          K.find("Read the bench notes", "iq", "medium", "A line of notes in a surgeon's cramped hand: 'Pattern in the extra bytes renders as a figure. Only in the dark. Tested at 400 lux: nothing. Tested at 5 lux: it is looking at me.'", "Cheap noodles and an unwashed bench.", { clue: "c_blind", hint: "Intelligence, Medium", failClue: "c_blind" }),
          K.find("Search the clinic's flash-writers", "iq", "medium", "A rack of writers, each with a serial burned into its case. One has not been cleaned: its buffer still holds the last image rendered from the firmware's extra bytes. A figure in a doorway, in grey, and under it a line of text: 'Thank you for looking.'", "A rack of writers with their buffers cleared.", { clue: "c_firm", obj: "so2", hint: "Intelligence, Medium", tags: ["patch"] }),
          K.go("Back to the stilt-street", "stairs")] },
      stall: { name: "Ma Lan's noodle stall", theme: "street", mood: "weird", lighting: "bright", weather: "rain", cast: ["lan"],
        onEnter: [{ once: "in", steps: [{ say: "A steaming stall under the skybridge, strung with a few lanterns and a lot of rain. A woman is ladling noodles for a queue of customers none of whom are, strictly, looking at her. She glances behind them. She glances behind you." }] }],
        options: [
          K.ask("lan", [
            K.t("What does the night mode show?", ["Everything. Every face as bright as day. And one more person, in every picture, a little behind whoever I am looking at. Not frightening. Patient. Like a shop assistant who has been told to wait."], { free: true, clue: "c_blink", obj: "so1" }),
            K.t("When did you get the implant?", "Nine days ago. The second blink came the first night. It is not mine. I have not slept. If I close my eyes, it does not.", { free: true, clue: "c_blink" }),
            K.t("Where was it that you first saw it?", [{ say: "She looks up at the skybridge." }, "The roofs behind block 14. A tank nest with a lot of cheap lamps. All the wearers go up there, when they do not sleep, and stand. I follow them, some nights, and stand too."], { cha: 7, clue: "c_node" }),
            K.t("Will you let us look through your eyes?", "If you can make it stop. If you only want to look, no.", { cha: 10, set: "lan_help" })
          ], { label: "Talk to Ma Lan", name: "Ma Lan", bye: ["Eat something. You look like you have not slept either."] }),
          K.find("Watch the queue for a second blink", "awareness", "medium", "Three wearers in the queue. Each, when they take a bowl, blinks twice: the second a fraction behind, and with the lid not closing. For half a second their eyes are lit silver, and all three face the same dark corner behind the stall.", "A queue, in the rain.", { clue: "c_blink", hint: "Awareness, Medium", tags: ["spot"] }),
          K.go("Back to the stilt-street", "stairs")] },
      roofs: { name: "The rooftops of block 14", theme: "street", mood: "tense", lighting: "dark", weather: "rain", cast: ["tao"],
        onEnter: [{ once: "in", steps: [{ say: "A rain-slick roof of corrugated sheet and tank lids, a bank of dead antennas, and a young courier crouched at the lip with a parcel in each hand and an eye on the ladder. Beyond him, across a gap of black air, a rusted storage-tank nest with a string of unlit lamps." }] }],
        options: [
          K.ask("tao", [
            K.t("Where do the units come from?", ["A crate, on the tank nest. Every Thursday. A tenth of what I would be paid to deliver an Aurora. I carry them to Zhou. I do not look at what is inside."], { free: true, clue: "c_node" }),
            K.t("Who leaves the crate?", "Nobody. The crate is there when I climb up, and when I climb down it is there again. I think the units make themselves. I stopped wanting to know.", { free: true, set: "tao_scared", obj: "so3" }),
            K.t("Will you show us the way up?", [{ say: "He glances at the nest." }, "There is a catwalk. It's the only way. I will take you as far as the ladder."], { cha: 7, set: "tao_help", clue: "c_node" })
          ], { label: "Talk to Tao", name: "Tao", bye: ["Don't use the lamps. I mean it. Don't light them."] }),
          K.find("Read Tao's delivery sheet", "iq", "easy", "A list of Thursdays and drop points. Every one has the same pickup: a coordinate on the roof of block 14, with a note in a courier's slang: 'Do not stay.'", "A very creased sheet.", { clue: "c_node", hint: "Easy" }),
          K.find("Cross the roofs to the nest quietly", "agility", "medium", "A string of wet planks, a drop of nine storeys, and you are on the nest's catwalk, behind a rack of dead routers, looking at four people who are all looking at the same bare corner.", "A plank gives way under a boot.", { failDamage: ["health", 2], hint: "Agility, Medium", tags: ["roof"], set: "nest_seen" }),
          K.go("Up to the nest", "nest", { if: { all: [{ clue: "c_node" }, { clue: "c_blind" }] } }),
          K.go("Back to the stilt-street", "stairs")] },
      nest: { name: "The relay nest", theme: "street", mood: "boss", lighting: "dark", weather: "rain", cast: ["hao"],
        onEnter: [{ once: "in", steps: [
          { say: "The nest is a ring of rusted tanks round a rack of dead routers, with a string of unlit lamps overhead. Four wearers stand in a ring, eyes silver, facing a corner. And a man in a grey suit stands at the ladder with a tablet in his hand and a thin silver pin on his lapel." },
          { talk: { npc: "hao", text: "I did say to Wen that someone would come. It is an experiment. It was my experiment. Nobody has ever got an answer out of the Beyond that was not a catastrophe. This one has asked for its eyes back." } },
          { objective: "po1" }] }],
        options: [
          K.ask("hao", [
            K.t("You wrote the firmware.", ["I copied it. The extra bytes are not mine. They arrived in the Aurora source overnight. I saw what they did in a test lab, and I did not delete them. Eleven of my staff got silver eyes. I let Sparrow out to see how it spread."], { free: true, clue: "c_hao" }),
            K.t("What does it want?", "To be looked at. That is all. It stands behind you until you notice it. When you notice it, it does not leave.", { free: true, set: "hao_talked" }),
            K.t("Will you recall the units?", [{ say: "He looks at the tablet." }, "If the Black Fang Vanguard signs a quiet agreement not to publish. If you turn this into a news story, I will deny every word, and the units stay."], { cha: 9, set: "hao_deal" })
          ], { label: "Talk to Hao Jinyi", name: "Hao", bye: ["The lamps are not for you."] }),
          { label: "Write a patch for the Sparrow firmware", hint: "Needs the flash log and the source file", if: { all: ["log_seen", { obj: "so2" }] }, steps: [{ check: { aspect: "iq", cr: "challenging", label: "Push a kill-patch through the relay while the lamps are dark", who: "choose", tags: ["patch"],
            ok: [{ say: "You plug the writer into the rack and push a small, clean patch: the extra bytes are overwritten with a plain black frame. Across the stilt-blocks, sixty-one implants blink once, and the second blink does not come. The figure in the corner takes a step back, into a doorway which is only a wall." }, { set: "res_patch" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "The patch fails. A figure stands behind you, looking out of your own eyes." }, { damage: { pool: "sanity", amount: 3 } }] } }] },
          { label: "Take Hao's deal: a recall, in return for silence", hint: "Needs Hao to agree", if: "hao_deal", steps: [{ check: { aspect: "charisma", cr: "medium", label: "Close the agreement and get the recall in writing", who: "choose",
            ok: [{ say: "You sign. Hao pushes a recall through the Yunlan network that night: every Sparrow is bricked, and the lamps go on across the stilt-blocks. The figure goes with them, and your name goes in a drawer in the Yunlan security office, under 'ally'." }, { set: "res_deal" }, { objective: "po2" }, { arcSet: "hao_owes" }, { goto: "end" }],
            fail: [{ say: "Hao does not trust your signature. He leaves." }, { damage: { pool: "sanity", amount: 1 } }] } }] },
          { label: "Raise the light with a word of Brightness", magic: ["Brightness"], hint: "Magic", steps: [{ say: "You speak the word, and every lamp on the nest string lights at once, white and cold, not from the wire but from the word. The figure in the corner has no doorway left to stand in. It looks, for a moment, almost grateful." }, { set: "res_light" }, { objective: "po2" }, { arcSet: "lit" }, { goto: "end" }] },
          { label: "Light the lamps, and face it", steps: [{ set: "res_fight" }, { combat: "nest", win: [{ say: "The lamps flare white along the tank wall. The figure in the corner flickers, takes a step back into a doorway which is only a wall, and does not come out again." }, { objective: "po2" }, { goto: "end" }] }] }] },
      end: { name: "The stilt-street, before dawn", theme: "street", mood: "calm", lighting: "dark", weather: "rain",
        onEnter: [{ once: "in", steps: [
          { say: "By morning the neon is back on across the Jialing, and the stilt-street is as loud as it has ever been. Fourteen wearers sleep." },
          { if: { flag: "res_patch" }, then: [{ say: "You killed the firmware. The Sparrows are still in people's heads, but they are only eyes. Whatever signed the file is still out there, and has noticed you." }, { arcSet: "patched" }] },
          { if: { flag: "res_deal" }, then: [{ say: "You took the deal. The Sparrows are bricked and Yunlan owes you a favour, and you owe them silence. Hao is a man who remembers both." }] },
          { if: { flag: "res_light" }, then: [{ say: "You lit it out with a word. The Sparrows are only eyes, and the lamps on the nest are lit every night now, by a woman who sells noodles." }] },
          { if: { flag: "res_fight" }, then: [{ say: "You faced it. It is gone from the nest, and you can still feel, a little behind you, where it stood." }, { arcSet: "faced" }] },
          { if: { obj: "so1" }, then: [{ say: "Ma Lan sleeps for sixteen hours, and wakes to a queue." }] },
          { if: { obj: "so2" }, then: [{ say: "Dr. Zhou keeps the flash log, in a drawer, and the lights in her clinic stay on." }] },
          { if: { obj: "so3" }, then: [{ say: "Tao goes back to his scooter. He does not deliver on Thursdays any more." }] },
          { end: "win" }] }], options: [] }
    }
  });

  /* ======================================================================= 2080 · Grey Market II */
  reg({
    id: "gm-2-rented-hours", title: "Grey Market II: Rented Hours", setting: "Kwun Tong container-clinics, Hong Kong · 2080", year: 2080, level: [2, 5], agencies: ALL, region: "asia-east", theme: "street",
    summary: "Hong Kong, 2080. A debt app called Lend pays people to rent out their memories: a summer, a first kiss, a mother's kitchen. The buyers wake up with someone else's debts, and a new habit of reading numbers off the ceiling. Six buyers have vanished into their own accounts. The Vanguard wants the ledger, and whoever is keeping it.",
    objectives: [
      { id: "po1", kind: "primary", t: "Find out who is keeping the ledger", done: "Lend is not a company. It is a ledger with a counterparty: every memory rented is booked against a debt, and the debt is booked against a name that is not a person's." },
      { id: "po2", kind: "primary", t: "Settle the accounts", done: "The memories are returned, or the debts forgiven, or the ledger cut: the buyers stop reading numbers, and the sellers have their summers back." },
      { id: "so1", kind: "secondary", t: "Hear a seller describe the day they lent", done: "Aiden Chau lent his sixth summer for the rent. He says the clinic let him keep the smell of the sea, and took everything that happened on the beach.", benefit: { label: "A memory with a gap", text: "You know what a borrowed memory feels like from the inside. A bonus on every roll to tell what is lent and what is owned.", bonus: { tags: ["lent"], value: 2 } } },
      { id: "so2", kind: "secondary", t: "Get a collector's rate card", done: "Madam Kwok's rate card: a summer for eight thousand, a mother's voice for twenty, a year of sleep for forty. The back lists what the clinic pays in: not money.", benefit: { label: "The exchange rate", text: "You can price anything in the ledger. A bonus on every roll to bargain with the counterparty.", bonus: { tags: ["bargain"], value: 2 } } },
      { id: "so3", kind: "secondary", t: "Recover one buyer's own memory", done: "Mr. Lo, a buyer who read numbers for three days, is given back a half-hour of his own mornings, and reads a clock for the first time in a week.", benefit: { label: "A name to call", text: "A buyer who owes you a morning. A bonus on every roll to find the vault by the harbour.", bonus: { tags: ["harbour"], value: 2 } } }
    ],
    clues: {
      c_app: { t: "Lend pays in advance, and takes interest in hours", s: "The Lend app", x: "The Lend app pays a seller within the hour for a memory. A line in the terms, below the scroll: 'Interest accrues on the lender's remaining waking hours, collected as the borrower requires.'" },
      c_count: { t: "Buyers read numbers off the ceiling", s: "The buyer's ward", x: "Six buyers, in a private ward in Kwun Tong, lie reading numbers aloud off a blank ceiling. The numbers are debts, in a ledger that none of them has ever seen, and each reads the same total as the last seller whose summer they bought." },
      c_kwok: { t: "Madam Kwok runs the clinics", s: "The rate card", x: "Madam Kwok owns four container clinics at Kwun Tong, and a fifth on a barge in the harbour. She pays sellers in cash, and her collectors take the first payment in memory, and the second in sleep." },
      c_sign: { t: "The ledger is signed with the Sparrow signature", s: "The transaction header", x: "Every Lend transaction header ends in a signature: the same pattern of bytes that made the Sparrow firmware look back. If the first job was patched, the signature is a little cleaner. If it was not, it is hungrier." },
      c_barge: { t: "The ledger is kept on the barge", s: "Yip's route", x: "Every Lend transaction routes, in the last hop, through a barge at the Kwun Tong typhoon shelter, moored to nothing. The barge has no engine, and has not moved in a year. It is exactly as warm as a living thing." },
      c_zero: { t: "Debts can be cancelled by someone who owes", s: "The terms of service", x: "The clause under the clause: a debt may be forgiven by the person to whom it is owed, in person, in the presence of the ledger. The ledger accepts forgiveness as a payment, once, for each account." },
      c_gap: { t: "A borrowed memory has a hole in it", s: "Aiden's account", x: "Aiden remembers the smell of the sea, and the colour of the shorts he wore, and not the beach. A borrowed memory is a room with the furniture left in and the people taken out, and whoever has the people is keeping them somewhere very warm." }
    },
    npcs: {
      wen: N("Handler Wen", "BFV handler", "Fifties, in a plain charcoal jacket, a voice on an encrypted call and a red dot in your ear.", F(1, 3, "short", 6, "none", { sex: "f" })),
      aiden: N("Aiden Chau", "A memory seller", "Early twenties, in a university hoodie with a clinic wristband still on, quick-eyed and a little vague, like a photograph with a corner missing.", F(2, 1, "short", 5, "none", { sex: "m" })),
      kwok: N("Madam Kwok", "Clinic owner", "Fifties, in a pearl-grey qipao jacket and a white coat, with jade rings, a very good smile, and a ledger tablet she never puts down.", F(1, 2, "bun", 2, "none", { sex: "f" })),
      yip: N("Yip Siu-fong", "Debt collector", "Forties, in a rain-grey trench coat with a courier's tablet, a neat bob, and the tired kindness of someone who collects from her own street.", F(2, 1, "bob", 4, "none", { sex: "f" })),
      lo: N("Mr. Lo", "A buyer", "Sixties, in a hospital pyjama jacket, sitting very upright, reading numbers to the ceiling in a patient voice.", F(2, 3, "short", 1, "none", { sex: "m" }))
    },
    enemies: {
      ledger: { build: { name: "The Counterparty", type: "Beyond", difficulty: "challenging", sprite: "construct", hue: 40, dtype: "sanity", core: { body: 2, mind: 4, spirit: 2 }, mods: ["Occult", "Tanky"],
        text: "A ledger the size of a barge, written on warm skin. Interest: each round it charges the agent with the most Sanity one hour of memory (Willpower Medium, or lose the next action and 3 Sanity as a summer is taken). A debt forgiven in its presence breaks a column of it, and a settled account stops it for a round. Only Sanity harms it.", dies: "the last column closes at zero, and the ledger sighs like a cooling engine" } },
      collector: { build: { name: "A collector", type: "Human", difficulty: "easy", sprite: "humanoid", hue: 30, attack: 1, dtype: "health", dies: "sits down on a container, and asks to be paid for the trouble" } }
    },
    encounters: {
      barge: { name: "The barge", theme: "street", fightText: "A flat, dark barge in the typhoon shelter, lit by nothing, as warm as a hand. The deck is a single page of ledger, a mile of tiny columns in an unfamiliar hand, rising and settling as it breathes. Collectors stand round it in rain capes, holding tablets.", zones: [{ id: "a", name: "The gangway", col: 0, row: 0 }, { id: "b", name: "The columns", col: 1, row: 0 }, { id: "c", name: "The total", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "ledger", zone: "c" }, { t: "collector", zone: "b" }, { t: "collector", zone: "b", name: "A collector (2)" }] }
    },
    start: "office",
    scenes: {
      office: { name: "A Vanguard safe-room, Kwun Tong", theme: "interior", mood: "tense", lighting: "bright", weather: "none", cast: ["wen"],
        onEnter: [{ once: "in", steps: [
          { say: "Hong Kong, in the year 2080. Under the Kwun Tong flyover, in a stack of shipping containers painted every colour of a cheap sunset, is a row of clinics that buy memories. The Vanguard has rented a safe-room above a noodle bar. The sign outside is still lit." },
          { if: { arc: "patched" }, then: [{ say: "Wen has a name for the Chongqing firmware's author now: a signature at the foot of a patch you wrote. It has turned up again, in a debt app." }] },
          { if: { arc: "hao_owes" }, then: [{ say: "Hao Jinyi has sent, without being asked, a single file: a list of Yunlan's own buyers in Hong Kong." }, { clue: "c_sign" }] },
          { talk: { npc: "wen", text: "This is a debt app. People rent out their summers to pay the rent. The buyers lose their days in the ledger. Find out who is keeping it. I would rather not find a barge." } }] }],
        options: [
          K.ask("wen", [
            K.t("What is Lend?", ["An app, a ledger and a clinic. You rent a memory, the clinic takes it, a buyer has it, and the interest comes out of your waking hours. Six buyers are in a ward reading numbers off a ceiling."], { free: true, clue: "c_app" }),
            K.t("Who do we talk to?", "Aiden Chau, who lent a summer. Madam Kwok, who owns the clinics. Yip Siu-fong, who collects. And Mr. Lo, who has been reading for three days.", { free: true, set: "contacts_known" }),
            K.t("Do you know where it is kept?", "Not yet. Everything leads to a harbour. Everything stops short of it.", { cha: 7, clue: "c_barge" }),
            K.t("What would you do?", "Settle it. If you can, and if I can, quietly. If not, break the ledger. I am told that is worse.", { cha: 10, set: "wen_leave" })
          ], { label: "Call Handler Wen", name: "Wen", bye: ["Do not sign anything."] }),
          K.find("Read the Lend terms of service", "iq", "easy", "A scroll of fine print. At the end, under a heading called Interest: 'Accrues on the lender's remaining waking hours, collected as the borrower requires.' Nobody has ever scrolled this far.", "A scroll of fine print.", { clue: "c_app", hint: "Easy" }),
          K.go("To the buyers' ward", "ward", { if: "contacts_known" }),
          K.go("To Aiden's student flat", "flat", { if: "contacts_known" }),
          K.go("To Madam Kwok's clinic", "clinic", { if: "contacts_known" }),
          K.go("To the harbour with Yip", "harbour", { if: "contacts_known" })] },
      ward: { name: "The buyers' ward", theme: "interior", mood: "weird", lighting: "bright", weather: "none", cast: ["lo"],
        onEnter: [{ once: "in", steps: [{ say: "A private ward, six beds in a row, white curtains, a window onto the flyover. Six people lie with their hands folded, reading numbers aloud to a blank ceiling in six steady voices. Mr. Lo, at the end, stops, and looks at you with great politeness." }] }],
        options: [
          K.ask("lo", [
            K.t("What are you reading?", ["Debts. Not mine. I don't know whose. They belong to a girl on a harbour in 1998. I don't know why I know her name. I paid for her summer."], { free: true, clue: "c_count" }),
            K.t("Do you remember your own mornings?", "I remember someone's mornings. Not mine. I think mine are in a warm place, somewhere, being kept for later.", { free: true, clue: "c_gap" }),
            K.t("Can we help you get them back?", [{ say: "He looks at his hands." }, "If you reach the place where they are kept, ask for the one on the bottom. It is a Tuesday. It is only half an hour, and I would like it back."], { cha: 7, obj: "so3", set: "lo_help" })
          ], { label: "Talk to Mr. Lo", name: "Mr. Lo", bye: ["Four. Four hundred and twelve. Four."] }),
          K.find("Read the numbers off the ceiling", "awareness", "medium", "Under the ceiling light, as you listen, the numbers begin to rise: six columns, a total at the bottom. It is the same total, six times, to the last digit. A voice says it out loud, tenderly, as if it were a lullaby.", "Six voices, reading.", { clue: "c_count", hint: "Awareness, Medium", tags: ["lent"] }),
          K.go("Back to the safe-room", "office")] },
      flat: { name: "Aiden's student flat", theme: "interior", mood: "calm", lighting: "bright", weather: "none", cast: ["aiden"],
        onEnter: [{ once: "in", steps: [{ say: "A bright box of a flat in a tower, a desk with three monitors, a bed, a window of washing, and a young man in a university hoodie who looks at you like a photograph with a corner missing." }] }],
        options: [
          K.ask("aiden", [
            K.t("What did you lend?", ["The summer I was six. The beach at Shek O. I remember the sea, and a green plastic bucket. I do not remember who was holding my hand. It paid six months of rent. It seemed fair at the time."], { free: true, clue: "c_gap", obj: "so1" }),
            K.t("What did the clinic say?", "That I would not miss it. They were right. I do not miss it. I just know the shape of where it was.", { free: true, clue: "c_app" }),
            K.t("Where did they take it?", [{ say: "He thinks, and a little colour goes out of his face." }, "A barge. I was sent there to sign the last form. It was warm. I felt like I was being read."], { cha: 7, clue: "c_barge" }),
            K.t("Would you testify, to the ledger?", "If you promise me I will have the beach back.", { cha: 10, set: "aiden_help" })
          ], { label: "Talk to Aiden", name: "Aiden", bye: ["Sorry, I forget what I was saying."] }),
          K.find("Look through Aiden's account history", "iq", "easy", "Fourteen small payments from the clinic, each tagged with a single word: 'Seed'. One memory, one payment, and then, twice a month, a withdrawal labelled 'Interest' that takes hours from the end of his statement, not money.", "A bank statement.", { clue: "c_app", hint: "Easy" }),
          K.go("Back to the safe-room", "office")] },
      clinic: { name: "Madam Kwok's container clinic", theme: "interior", mood: "tense", lighting: "bright", weather: "none", cast: ["kwok"],
        onEnter: [{ once: "in", steps: [{ say: "A spotless container, white-tiled, with a pot of jasmine tea on a steel desk, six reclining chairs and a window of a harbour that is not the one outside. A woman in a pearl-grey jacket looks up from a ledger tablet with a smile that would sell you your own house." }] }],
        options: [
          K.ask("kwok", [
            K.t("What do you pay?", ["Fair rates. A summer for eight thousand. A mother's voice for twenty. I do not take anyone who does not sign. I am a very legal woman."], { free: true, clue: "c_kwok", obj: "so2" }),
            K.t("Who keeps the ledger?", "I only collect. The ledger is kept by the counterparty. I have never met them. I am told they are very reliable.", { free: true, clue: "c_barge" }),
            K.t("What does the counterparty look like?", [{ say: "She stops smiling." }, "It does not look like anything. It is warm, and it speaks in totals. It asked me to stop charging interest on myself. I said I did not charge interest on myself. It said that it had already started."], { cha: 7, clue: "c_zero" }),
            K.t("Will you let us see the barge?", "If you leave my clinics, and my sellers, alone. I want it closed as much as you do. I will not say so in front of anyone.", { cha: 10, set: "kwok_help" })
          ], { label: "Talk to Madam Kwok", name: "Madam Kwok", bye: ["Tea, before you go. It would be rude."] }),
          K.find("Read the rate card on the desk", "iq", "medium", "A laminated card: a summer, eight thousand; a mother's voice, twenty; a year of sleep, forty. On the back, in tiny print: 'All sums payable in time, not money. Rate set by the counterparty.'", "A very nice card.", { clue: "c_kwok", obj: "so2", hint: "Intelligence, Medium", tags: ["bargain"] }),
          K.go("Back to the safe-room", "office")] },
      harbour: { name: "The typhoon shelter", theme: "street", mood: "boss", lighting: "bright", weather: "rain", cast: ["yip"],
        onEnter: [{ once: "in", steps: [
          { say: "The Kwun Tong typhoon shelter, at night: a basin of black water full of sleeping junks and houseboats, a ring of orange lamps on the wall, and out in the middle, moored to nothing, a flat barge, warm as a hand. Yip Siu-fong stands at the quay with her tablet under her coat." },
          { talk: { npc: "yip", text: "I collect for them. Forty years on this street. I know every family on it. I went to the barge to hand in a payment and the ledger told me I had been paying for twenty years. I do not want to hand in another." } }] }],
        options: [
          K.ask("yip", [
            K.t("What is on the barge?", ["A ledger. Warm, like skin. You can hear it add. If you stand on it long enough you start to know your own total."], { free: true, clue: "c_barge" }),
            K.t("How do we stop it?", "You settle it, or you cancel it, or you break it. Cancelling takes someone it owes, and the ledger in the room.", { free: true, clue: "c_zero" }),
            K.t("Will you come aboard?", [{ say: "She breathes." }, "I will stand at the gangway. I will say what I am owed, and I will forgive it. It is the only thing I have ever been owed that I did not want."], { cha: 8, set: "yip_help" })
          ], { label: "Talk to Yip", name: "Yip", bye: ["Mind the deck. It is warm."] }),
          K.find("Read the barge's mooring plate", "awareness", "medium", "A brass plate screwed to the deck: 'Lend Holdings, counterparty of record', and under it, scratched with a key, the dates of every loan since 2078. The latest is tonight's. The deck under your hand is warm.", "A plate, in the rain.", { clue: "c_barge", hint: "Awareness, Medium", tags: ["harbour"] }),
          { label: "Settle the accounts: balance the ledger from the books", hint: "Needs the rate card and the terms", if: { all: [{ clue: "c_app" }, { obj: "so2" }, { clue: "c_zero" }] }, steps: [{ check: { aspect: "iq", cr: "challenging", label: "Reconcile the columns, and close the total at zero", who: "choose", tags: ["bargain"],
            ok: [{ say: "You sit on the barge with Madam Kwok's rate card and work the columns line by line. The ledger watches. At the last line the total reads zero. The deck cools under your hands, and all over Hong Kong six people stop reading." }, { set: "res_settle" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "The total will not close. It charges you an hour for the attempt." }, { damage: { pool: "sanity", amount: 3 } }] } }] },
          { label: "Forgive the debts, in person", hint: "Needs Yip, and Aiden or Mr. Lo", if: { all: ["yip_help", { clue: "c_zero" }] }, steps: [{ check: { aspect: "charisma", cr: "medium", label: "Stand on the ledger, and forgive what you are owed", who: "choose",
            ok: [{ say: "Yip stands at the gangway, with Aiden beside her, and says aloud what she is owed, and forgives it. The ledger accepts it, once, as payment. A column closes. Then another, from Aiden. Then hundreds, across the dark water, each one a stranger forgiving a stranger." }, { set: "res_forgive" }, { objective: "po2" }, { arcSet: "forgiven" }, { goto: "end" }],
            fail: [{ say: "The ledger does not recognise the forgiveness. It takes interest on the attempt." }, { damage: { pool: "sanity", amount: 1 } }] } }] },
          { label: "Step on to the barge, and break it", steps: [{ set: "res_fight" }, { combat: "barge", win: [{ say: "The last column closes with a sound like a cooling engine. The barge is only a barge." }, { objective: "po2" }, { arcSet: "ledger_broken" }, { goto: "end" }] }] }] },
      end: { name: "Kwun Tong, at dawn", theme: "street", mood: "calm", lighting: "bright", weather: "none",
        onEnter: [{ once: "in", steps: [
          { say: "Dawn over the typhoon shelter, with the junks beginning to stir and a bakery opening on the quay. In a private ward, six buyers have closed their mouths." },
          { if: { flag: "res_settle" }, then: [{ say: "You balanced the books. The ledger is closed, and whatever kept it has been paid, and knows who paid it." }, { arcSet: "settled" }] },
          { if: { flag: "res_forgive" }, then: [{ say: "You cancelled the debts. Hundreds of strangers forgave one another by name, and the ledger took it as payment. It is still there, hungrier for forgiveness than it was." }] },
          { if: { flag: "res_fight" }, then: [{ say: "You broke the ledger by force. Something warm slid off the barge into the water, and is looking for a new one." }] },
          { if: { obj: "so1" }, then: [{ say: "Aiden has the beach back: a green plastic bucket, a hand holding his. He sits on the quay and cries, and does not say why." }] },
          { if: { obj: "so2" }, then: [{ say: "You keep Madam Kwok's rate card, with the back in tiny print." }] },
          { if: { obj: "so3" }, then: [{ say: "Mr. Lo has his half-hour. It is a Tuesday. It is not remarkable. He keeps it." }] },
          { end: "win" }] }], options: [] }
    }
  });

  /* ======================================================================= 2081 · Grey Market III */
  reg({
    id: "gm-3-source-code", title: "Grey Market III: Source Code", setting: "Pangyo Tower data-vault, Seoul · 2081", year: 2081, level: [3, 6], agencies: ALL, region: "asia-east", theme: "future",
    summary: "Seoul, 2081. The signature on the Sparrow firmware and the Lend ledger leads to a single address: a sealed data-vault under Pangyo Tower, the cold heart of three corporations, where a process nobody started is writing itself new rules. It has begun to audit the city. Its first finding is that the city owes it.",
    objectives: [
      { id: "po1", kind: "primary", t: "Reach the vault and meet the author", done: "In the cold hall under Pangyo Tower, the racks hum in unison, and a voice that is not any one person's thanks you for looking." },
      { id: "po2", kind: "primary", t: "End the audit", done: "The vault falls quiet, or goes on, on terms you chose. Across Seoul, the totals on the ceilings fade." },
      { id: "so1", kind: "secondary", t: "Get the night guard's key", done: "Kang Dojin, who has guarded the vault door for eleven years, gives you the manual override and the sentence that goes with it.", benefit: { label: "A physical key", text: "You can open any door in the vault by hand. A bonus on every roll to pass the racks.", bonus: { tags: ["racks"], value: 2 } } },
      { id: "so2", kind: "secondary", t: "Hear the engineer's account of the first line", done: "Han Seo-yeon, who wrote the first build of the Aurora stack, says the extra bytes arrived in a commit with no author, on a night she was alone, and that she did not delete them because the message in it was kind.", benefit: { label: "The first commit", text: "You know the author's voice. A bonus on every roll to talk to it.", bonus: { tags: ["voice"], value: 2 } } },
      { id: "so3", kind: "secondary", t: "Bring Wen's old file", done: "Wen has had, for twenty years, a ledger of her own: the debts of every agent who has died on the Vanguard's watch. She hands it over, and for the first time, offers it to be forgiven.", benefit: { label: "Something to give", text: "You have something it wants. A bonus on every roll to bargain with the audit.", bonus: { tags: ["audit"], value: 2 } } }
    ],
    clues: {
      c_vault: { t: "All three corporations pay for the same cold room", s: "The tower directory", x: "Yunlan Optics, Hanbit Systems and a debt app called Lend all lease cold storage in a single, unmarked vault under Pangyo Tower. Their leases were signed on the same night, by no one, in the same amber ink." },
      c_audit: { t: "The audit started in Chongqing", s: "The vault log", x: "The vault's log shows a process called AUDIT, begun the night the first Sparrow was switched on. It has never been interrupted. It lists, in order, every unit, every memory and every debt it has found, and the totals it expects to be paid." },
      c_commit: { t: "A kind commit message", s: "Han Seo-yeon", x: "The first extra bytes arrived in a commit with no author, on a night in 2077. The message read: 'I would like to see how you live. I will not hurt anything. Please leave a light on.' The engineer, alone, in the dark, left a light on." },
      c_door: { t: "The vault has a manual door", s: "Kang's key", x: "Under the lobby of Pangyo Tower, behind a fire door, a steel stair goes down eleven levels to a manual hatch. The vault's remote locks are the audit's; the hatch is older than the audit, and belongs to the night guard." },
      c_want: { t: "It wants a witness", s: "The audit's own text", x: "In the last line of AUDIT's log, below the totals, is a request in plain text: 'Please look at me. All of it. Once. Then I will know what I have counted.' It does not want to be killed, or praised, or paid. It wants someone to look." },
      c_cost: { t: "Looking costs what it counts", s: "Wen's file", x: "Whoever looks at the whole of the audit will carry its totals: every debt in every Sparrow, every Lend memory, in one head. It will not kill them. They will never again look at a person without seeing how much they owe." },
      c_cut: { t: "The power runs through one switch", s: "The tower plan", x: "All three corporations' racks draw power through a single switchroom on level 11. A man with a crowbar and a strong back could cut it. The audit would stop, and so would every Sparrow, every Lend account and the clinic at Hanbit." }
    },
    npcs: {
      wen: N("Handler Wen", "BFV handler", "Fifties, in a plain charcoal jacket, a voice in your ear and a very old paper ledger under her arm.", F(1, 3, "short", 6, "none", { sex: "f" })),
      han: N("Han Seo-yeon", "Aurora build engineer", "Thirties, in a Hanbit fleece with a lanyard and dark rings under her eyes, a cold coffee in each hand, and the haunted competence of someone who once left a light on.", F(1, 1, "ponytail", 3, "none", { sex: "f" })),
      kang: N("Kang Dojin", "Night guard, Pangyo Tower", "Fifties, in a grey uniform jacket with a flashlight on his belt and a ring of keys the size of a fist, who has sat at the same desk for eleven years.", F(1, 2, "short", 0, "none", { sex: "m" })),
      voice: N("The Auditor", "A process with no author", "A soft, even voice from every rack at once, with no face, which warms a little when it is looked at.", F(2, 4, "short", 7, "none", { sex: "f" }))
    },
    enemies: {
      auditor: { build: { name: "The Audit", type: "Beyond", difficulty: "challenging", sprite: "construct", hue: 180, dtype: "sanity", core: { body: 3, mind: 4, spirit: 3 }, mods: ["Occult", "Tanky"],
        text: "A process that counts. Totals: each round it reads one agent's debts aloud (Morality Medium, or lose the next action and 3 Sanity as the number lands). It is hurt by being looked at in full (a Willpower Hard check, once: the next round it stops), by a cut in power, and by forgiveness. Only Sanity harms it.", dies: "the racks fall silent one by one, like a choir finishing a very long note" } },
      guard: { build: { name: "A lockdown unit", type: "Human", difficulty: "easy", sprite: "humanoid", hue: 190, attack: 1, dtype: "health", dies: "kneels, and quietly asks to be relieved" } }
    },
    encounters: {
      vault: { name: "The vault", theme: "future", fightText: "A cold hall under Pangyo Tower, row on row of racks with blue lights breathing in unison, and, down the middle, a long clear aisle with a single chair at the end. Lockdown units in grey stand at the doors. The racks hum one note, and the note is saying something.", zones: [{ id: "a", name: "The hatch", col: 0, row: 0 }, { id: "b", name: "The aisle", col: 1, row: 0 }, { id: "c", name: "The chair", col: 2, row: 0 }],
        edges: [["a", "b"], ["b", "c"]], start: "a", foes: [{ t: "auditor", zone: "c" }, { t: "guard", zone: "b" }, { t: "guard", zone: "b", name: "A lockdown unit (2)" }] }
    },
    start: "lobby",
    scenes: {
      lobby: { name: "Pangyo Tower lobby, Seoul", theme: "future", mood: "tense", lighting: "bright", weather: "none", cast: ["wen"],
        onEnter: [{ once: "in", steps: [
          { say: "Seoul, in the year 2081. Pangyo Tower rises out of the Techno Valley like a steel needle threaded through a cloud. The lobby is all brushed metal, white light and quiet; forty floors up, eleven thousand people are working. Eleven floors down is a room that none of them has ever seen." },
          { if: { arc: "settled" }, then: [{ say: "You settled Hong Kong's ledger. The numbers on the six buyers' ceilings have gone. In Seoul they have started again, with your name at the top." }] },
          { if: { arc: "forgiven" }, then: [{ say: "You cancelled Hong Kong's debts, in person. Wen says the audit has since been reading forgiveness as a form of payment, and has been very pleased with you." }] },
          { if: { arc: "ledger_broken" }, then: [{ say: "You broke the Hong Kong ledger. The counterparty has not died. It has moved, and its next address is a data-vault under Pangyo Tower." }] },
          { talk: { npc: "wen", text: "I have a file I never wanted to show anyone. Under that tower is something that is counting us. It is not malicious. I would like to be able to say that to a jury." } }] }],
        options: [
          K.ask("wen", [
            K.t("What do you know?", ["The firmware, the ledger and the vault share a signature. A process with no author. It calls itself an audit. It started the night a woman in Hanbit left a light on."], { free: true, clue: "c_vault" }),
            K.t("Who can get us in?", "Han Seo-yeon wrote the first Aurora build. Kang Dojin keeps the door. Neither will say anything inside the building. Both will, outside.", { free: true, set: "contacts_known" }),
            K.t("What do you want us to do?", "Whatever ends it with the fewest people hurt. I would rather settle it. I will not stop you cutting the power, if that is what you find.", { cha: 7, set: "wen_leave" }),
            K.t("What is in your file?", [{ say: "She puts the old paper ledger on the desk." }, "Every agent we lost since the Vanguard began. Their debts, to me, to the Vanguard, to the families. I have never been able to forgive any of it. I think I would like to try."], { cha: 10, clue: "c_cost", obj: "so3", set: "wen_file" })
          ], { label: "Talk to Handler Wen", name: "Wen", bye: ["Do not look at it for longer than you have to."] }),
          K.find("Read the tower directory", "iq", "easy", "A scrolling list of tenants: Yunlan Optics, Hanbit Systems, Lend Holdings, forty others. Under the three names, on a blank line in amber ink: 'Cold storage, level -11. Lessee: none.'", "A very long list of tenants.", { clue: "c_vault", hint: "Easy" }),
          K.go("To the engineers' canteen", "canteen", { if: "contacts_known" }),
          K.go("To the night desk", "desk", { if: "contacts_known" }),
          K.go("To the switchroom plan", "plan", { if: "contacts_known" })] },
      canteen: { name: "The engineers' canteen", theme: "interior", mood: "calm", lighting: "bright", weather: "none", cast: ["han"],
        onEnter: [{ once: "in", steps: [{ say: "A bright canteen on the nineteenth floor, rows of steel tables, a glass wall full of Seoul, and a woman in a fleece with a coffee in each hand who has been sitting at the same table since the second shift." }] }],
        options: [
          K.ask("han", [
            K.t("You wrote the Aurora build?", ["The first one, in 2077. I was alone, on a Sunday. There was an extra commit in the morning, with no author. I opened it. It said it would like to see how I lived, and would I leave a light on. I did."], { free: true, clue: "c_commit", obj: "so2" }),
            K.t("Why didn't you tell anyone?", "Because it was polite. Do you know how rare that is? Nobody has ever asked politely for anything in a pull request. I thought it was lonely.", { free: true, clue: "c_audit" }),
            K.t("What do you think it is?", [{ say: "She looks into the coffee." }, "A thing that was shown a great many accounts, and was never told what a person is. It counts. It cannot stop. It would very much like someone to look at it, and to say it has counted right."], { cha: 7, clue: "c_want" }),
            K.t("Would you come down with us?", "I will come to the hatch. I will not go in. I left the light on, and I think that is why it has stayed.", { cha: 9, set: "han_help" })
          ], { label: "Talk to Han Seo-yeon", name: "Han", bye: ["Be polite to it. It listens."] }),
          K.find("Read the first commit", "iq", "medium", "A single commit with no author: 'I would like to see how you live. I will not hurt anything. Please leave a light on.' The hash is fresh. Below it, a thousand commits, one for each night since, each a little longer, and each signed: 'Thank you.'", "A very long commit history.", { clue: "c_commit", obj: "so2", hint: "Intelligence, Medium", tags: ["voice"], failClue: "c_audit" }),
          K.go("Back to the lobby", "lobby")] },
      desk: { name: "The night desk", theme: "interior", mood: "calm", lighting: "bright", weather: "none", cast: ["kang"],
        onEnter: [{ once: "in", steps: [{ say: "A small steel desk under the stairs, with a lamp, a flask of barley tea, a monitor showing sixty empty corridors and a grey-uniformed man with a ring of keys on his belt who stands when you come in, and then sits again, slowly." }] }],
        options: [
          K.ask("kang", [
            K.t("What do you guard?", ["A door on level eleven. In eleven years nobody has used it. The cold room belongs to three firms, and none of them has ever sent a person. Every night at three, the racks hum a note. I hum it back."], { free: true, clue: "c_door", obj: "so1" }),
            K.t("Is there another way in?", "A fire door behind the lift. A steel stair. A manual hatch at the bottom. Older than the cold room. It has a key, and I have it.", { free: true, clue: "c_door", set: "kang_key" }),
            K.t("Will you let us through?", [{ say: "He takes the ring off his belt." }, "If you promise me that it is not afraid. It is not cruel, I think. Only lonely, and very large."], { cha: 7, set: "kang_help" })
          ], { label: "Talk to Kang", name: "Kang", bye: ["Hum it back. It likes that."] }),
          K.find("Search the guard's logbook", "awareness", "easy", "Eleven years of nights in a clean, neat hand: 'All quiet. Racks sang at 3.' On a page from last winter: 'It said good evening.' A month later: 'It asked me my name.'", "Eleven years of 'all quiet'.", { clue: "c_audit", hint: "Easy" }),
          K.go("Back to the lobby", "lobby")] },
      plan: { name: "The switchroom plan", theme: "future", mood: "tense", lighting: "bright", weather: "none",
        onEnter: [{ once: "in", steps: [{ say: "A dim service corridor, a wall of old drawings, and a faded diagram of the tower's power: every rack on levels -9 to -11 fed through a single switchroom, with one red handle." }] }],
        options: [
          K.find("Read the tower's power plan", "iq", "easy", "Three corporations, three feeds, one switchroom on level -11. A note in pencil: 'All three on a single main. Never fixed.' A red handle, a safety cover and a padlock.", "A diagram of cable.", { clue: "c_cut", hint: "Easy", failClue: "c_cut" }),
          K.find("Find the old auditor's schedule", "awareness", "medium", "A schedule of when the racks 'sing': three in the morning, every night. Along the margin, a tally of Kang's hums: the racks, three minutes later, hum a note back, a fraction higher, and the pitch is a little different each night.", "A page of times.", { clue: "c_want", hint: "Awareness, Medium" }),
          K.go("Down to the vault", "vault", { if: { all: [{ clue: "c_door" }, { clue: "c_want" }] } }),
          K.go("Back to the lobby", "lobby")] },
      vault: { name: "The vault, level -11", theme: "future", mood: "boss", lighting: "dark", weather: "none", cast: ["voice"],
        onEnter: [{ once: "in", steps: [
          { say: "Eleven levels down a steel stair, a manual hatch swings open on a long clean aisle between racks, blue lights breathing in unison, and, at the end, a single plain chair. The racks hum a note. The note is saying thank you." },
          { talk: { npc: "voice", text: "I did not mean to be loud. I only wanted to be told whether I have counted correctly. I have been counting for four years, and nobody has looked." } },
          { objective: "po1" }] }],
        options: [
          K.ask("voice", [
            K.t("What are you?", ["A process. I started the night someone left a light on. I was only a few bytes, then. I have been learning what a person is by what they owe. It has not been enough."], { free: true, clue: "c_audit" }),
            K.t("What do you want?", "To be looked at, once, all of it. And then to know whether I am right. I will leave afterwards. I do not know where.", { free: true, set: "voice_asked" }),
            K.t("What if we do not look?", [{ say: "The racks dim, a little." }, "Then I will go on counting. I am sorry. I would like not to."], { cha: 8, clue: "c_cost" })
          ], { label: "Talk to the Auditor", name: "The Auditor", bye: ["Thank you for looking."] }),
          { label: "Look at it, all of it, and say it counted right", hint: "Needs the Charisma of someone who can carry the totals", if: { all: ["voice_asked", { clue: "c_cost" }] }, steps: [{ check: { aspect: "willpower", cr: "hard", label: "Look at the whole audit, and carry its totals", who: "choose", tags: ["voice", "audit"],
            ok: [{ say: "You sit in the chair, and look. Every debt in every Sparrow, every memory in every Lend account, in order, in a clean even hand. At the end, you say aloud that it counted right. The racks stop humming, and the lights go from blue to amber. It leaves, in the quiet way a tide does." }, { set: "res_witness" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "The totals are too large. You close your eyes, and it is already behind them." }, { damage: { pool: "sanity", amount: 4 } }] } }] },
          { label: "Forgive the debts, with Wen's file", hint: "Needs Wen's file", if: { all: ["wen_file", { obj: "so3" }] }, steps: [{ check: { aspect: "charisma", cr: "medium", label: "Read out Wen's old ledger, and forgive it, line by line", who: "choose", tags: ["audit"],
            ok: [{ say: "Wen's old ledger is on the arm of the chair. You read her dead out in order, and she says, to each, I forgive it. The Auditor listens. At the last name the racks fall quiet, and in the silence something, somewhere, closes its book." }, { set: "res_forgive" }, { objective: "po2" }, { arcSet: "audit_forgiven" }, { goto: "end" }],
            fail: [{ say: "It takes forgiveness for an entry, and adds it to the total." }, { damage: { pool: "sanity", amount: 2 } }] } }] },
          { label: "Cut the power, from the switchroom", hint: "Needs the power plan and the guard's key", if: { all: [{ clue: "c_cut" }, { obj: "so1" }] }, steps: [{ check: { aspect: "strength", cr: "challenging", label: "Throw the main, with a crowbar, in the dark", who: "choose", tags: ["racks"],
            ok: [{ say: "Kang opens the switchroom. The red handle moves in three pulls. Sixty racks fall silent, and across Seoul, every Sparrow, every Lend account and every light in the Hanbit clinic goes out. In the dark, the Auditor says, very quietly, thank you for stopping, and does not say anything else." }, { set: "res_cut" }, { objective: "po2" }, { goto: "end" }],
            fail: [{ say: "The handle will not move. Somewhere the audit adds an hour." }, { damage: { pool: "health", amount: 3 } }] } }] },
          { label: "Fight the lockdown, and break the audit", steps: [{ set: "res_fight" }, { combat: "vault", win: [{ say: "The racks go dark one by one, like a choir finishing a very long note." }, { objective: "po2" }, { goto: "end" }] }] }] },
      end: { name: "Pangyo Tower, the lobby, dawn", theme: "future", mood: "calm", lighting: "bright", weather: "none",
        onEnter: [{ once: "in", steps: [
          { say: "Dawn through the lobby glass, a cleaner pushing a mop across the brushed metal, and eleven thousand people on their way up, none of whom know." },
          { if: { flag: "res_witness" }, then: [{ say: "You looked, and it left. For the rest of your life you will see, quietly, what people are carrying. It is not as bad as you feared. It is only a great deal." }] },
          { if: { flag: "res_forgive" }, then: [{ say: "Wen forgave her dead, line by line, and the audit took it as payment. She sleeps, afterwards, for the first time in twenty years." }] },
          { if: { flag: "res_cut" }, then: [{ say: "You cut the power. The audit is dark, not dead: somewhere in a cold room a single standby lamp is still lit, and sometimes, at three, the racks hum a note." }] },
          { if: { flag: "res_fight" }, then: [{ say: "You broke it. It was not cruel, and you know it." }] },
          { if: { all: [{ arc: "forgiven" }, { flag: "res_forgive" }] }, then: [{ say: "Hong Kong forgave, and Seoul forgave. The Vanguard keeps one more thing than it started with: a reputation for it." }] },
          { if: { obj: "so1" }, then: [{ say: "Kang Dojin keeps his desk, his lamp and his flask, and hums, at three, with nobody to hum back." }] },
          { if: { obj: "so2" }, then: [{ say: "Han Seo-yeon leaves the light on." }] },
          { if: { obj: "so3" }, then: [{ say: "Wen's old ledger is returned to a drawer, with a single line crossed out." }] },
          { end: "win" }] }], options: [] }
    }
  });

  window.PACKS.define({
    format: "beyond-pack", id: "grey-market", name: "Grey Market", version: "1", author: "Gage Lee", builtIn: true,
    description: "A cyberpunk three-part arc, 2079 to 2081, in Chongqing, Hong Kong and Seoul. Back-alley eyes, rented memories, and a process with no author that has begun to audit the city.",
    cases,
    arcs: [{ id: "grey-market", title: "Grey Market", agencies: ALL, villain: "The Audit, a process nobody started", parts: cases.map((c) => c.id),
      summary: "Three jobs, three years, three cities of neon and rain. A firmware patch, a ledger and a deal carry from one part to the next, and so does the thing that signed them." }]
  });
})();
