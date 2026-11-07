/* ============================================================================
   MODULE: DEATH OF A BLOODLINE
   An investigation for Agents of the Emperor's Heavenly Guard (EHG)
   Tokyo, 1976.  Weather Severity 0.  Lighting: Shadow at night.

   Everything the game says and every place it lets you go lives in this file.
   Hotspot ids match the boxes in js/layout.js. Scripts are small async
   functions that call the engine (g.say, g.check, g.clue, g.goto ...).
   ========================================================================== */
(function () {
  const CR = R.cr;
  const M = {};
  M.id = "death-of-a-bloodline";
  M.title = "Death of a Bloodline";
  M.jp = "血脈の死";
  M.flavor = "jp";
  M.agency = "Emperor's Heavenly Guard";
  M.setting = "Kanda, Tokyo · 1976";
  M.year = 1976;
  M.agencies = ["EHG", "WCA", "NSBD"];
  M.level = [1, 4];
  M.legacy = true;
  M.summary = "A murder has stirred something long buried. In Kanda, paper lilies fall without wind around a small apartment building, perfectly dry in the rain. The Guard has been sent to find out why.";

  /* ------------------------------------------------------------------ AGENTS
     Built with the rulebook's creation rules: Core Stats Specialty 4 / Good 3 /
     Mundane 1, Aspects 4-3-2-1 / 3-2-1 / 2-1, background bonus, Healing Pools
     5 + 5 per Core point, ER 7 + Agility + armor. */
  M.agents = [
    {
      id: "haruka", name: "Haruka Mori", short: "Haruka", jp: "森 春香", age: 34, portrait: "haruka",
      role: "Investigator", background: "Detective",
      bgText: "+1 Mind. CR is 1 lower when investigating.",
      bio: "Eleven years in Tokyo Metropolitan homicide before a case with no body and too many witnesses brought the EHG to her door. Still carries her badge out of habit.",
      core: { body: 3, mind: 5, spirit: 1 }, special: "awareness",
      aspects: { strength: 0, agility: 3, speed: 2, durability: 1, humors: 0, charisma: 2, iq: 3, awareness: 4, willpower: 1, mindfulness: 0, occult: 1, faith: 0, ancient: 0, potency: 0, morality: 2 },
      vision: "dark",
      weapon: { name: "Nambu M60 revolver", type: "Ranged One-Handed", bonus: 1, range: 1, aspect: "awareness", mods: ["Accurate", "Quick Draw"], specialty: "Deadly", sfx: "gunshot" },
      armor: { name: "Police-issue raincoat", type: "Light", br: 1, er: 2, mods: ["Discreet", "Custom Fit"], specialty: "Enhanced Vision" },
      traits: { detective: true },
      fate: 1,
      bonds: [
        { name: "Shun Mori", rel: "younger brother, Waseda student", value: 10 },
        { name: "Det. Ono", rel: "her old partner, retired", value: 10 },
        { name: "Mrs. Kubo", rel: "landlady who leaves her rice", value: 10 }
      ],
      items: [{ id: "flashlight", tier: 2 }, { id: "cigarettes", tier: 2 }, { id: "lockpicks", tier: 2 }, { id: "book", tier: 1 }]
    },
    {
      id: "kenji", name: "Kenji Arai", short: "Kenji", jp: "新井 健司", age: 41, portrait: "kenji",
      role: "Priest", background: "Magician",
      bgText: "+1 Spirit and +5 Words.",
      bio: "Third-generation priest of a small Inari shrine in Ochanomizu. Joined the Guard in 1959 after the shrine's foxes stopped staying still at night.",
      core: { body: 1, mind: 3, spirit: 5 }, special: "faith",
      aspects: { strength: 0, agility: 2, speed: 0, durability: 1, humors: 0, charisma: 1, iq: 0, awareness: 0, willpower: 3, mindfulness: 2, occult: 0, faith: 4, ancient: 1, potency: 3, morality: 2 },
      vision: "normal",
      weapon: { name: "Shrine jitte", type: "Melee One-Handed", bonus: 2, range: 0, aspect: "faith", mods: ["Holy", "Breaching"], specialty: "Flaming", sfx: "blade_hit" },
      armor: { name: "Kariginu under a mackintosh", type: "Breezy", br: 0, er: 3, mods: ["Inscribed", "Battery"], specialty: "Torch Bearer" },
      magic: { source: "faith" },
      traits: { torchBearer: true },
      fate: 1,
      bonds: [
        { name: "Emiko Arai", rel: "his wife", value: 10 },
        { name: "Sachi Arai", rel: "his daughter, eight", value: 10 },
        { name: "Old Takeda", rel: "the priest who trained him", value: 10 }
      ],
      items: [{ id: "salt", tier: 3 }, { id: "omamori", tier: 2 }, { id: "thermos", tier: 2 }],
      words: { Enemy: 7, Damage: 7, Element: 4, Ally: 5, Heal: 5, Protect: 2, Treat: 2, Brightness: 1 }
    },
    {
      id: "daichi", name: "Daichi \"Ox\" Kuroda", short: "Ox", jp: "黒田 大地", age: 28, portrait: "daichi",
      role: "Guardian", background: "Guardian",
      bgText: "+1 Body, +2 BR, and can take a hit meant for an ally in the same zone.",
      bio: "Riot police, Shinjuku, until the night a crowd of commuters turned to face the wrong way all at once. He held the stairwell. Nobody else on his squad remembers it.",
      core: { body: 5, mind: 1, spirit: 3 }, special: "strength",
      aspects: { strength: 4, agility: 1, speed: 2, durability: 3, humors: 0, charisma: 1, iq: 0, awareness: 0, willpower: 2, mindfulness: 0, occult: 2, faith: 0, ancient: 0, potency: 1, morality: 3 },
      vision: "normal",
      weapon: { name: "Fire axe", type: "Melee Two-Handed", bonus: 4, range: 0, aspect: "strength", mods: ["Heavy", "Cleave"], specialty: "Sunder", sfx: "axe_hit" },
      armor: { name: "Riot vest under denim", type: "Medium", br: 2, er: 1, mods: ["Dense", "Mind Shielded"], specialty: "Last Stand" },
      brBonus: 2,
      traits: { guardian: true, lastStand: true },
      fate: 1,
      bonds: [
        { name: "Mother", rel: "runs a noodle stall in Osaka", value: 10 },
        { name: "Yumi", rel: "girlfriend, works at a record shop", value: 10 },
        { name: "Coach Hamada", rel: "his old judo coach", value: 10 }
      ],
      items: [{ id: "crowbar", tier: 1 }, { id: "omamori", tier: 2 }, { id: "rope", tier: 2 }, { id: "thermos", tier: 2 }]
    }
  ];

  /* ------------------------------------------------------------------ ITEMS */
  M.items = {
    flashlight: { name: "Flashlight", icon: "flashlight", applies: ["aspect:awareness"], text: "Searching, spotting, noticing." },
    cigarettes: { name: "Pack of Hi-Lites", icon: "cigarettes", applies: ["aspect:charisma"], text: "Offer one. People talk." },
    lockpicks: { name: "Lockpick set", icon: "lockpicks", applies: ["tag:lock"], text: "Locks and latches." },
    book: { name: "Pocket folklore dictionary", icon: "book", applies: ["tag:lore"], text: "Remembering history and legends." },
    salt: { name: "Purifying salt", icon: "salt", applies: ["aspect:faith", "aspect:occult", "aspect:ancient"], text: "Rites, wards and banishings." },
    omamori: { name: "Omamori charm", icon: "omamori", applies: ["aspect:morality"], text: "Holding on to yourself." },
    thermos: { name: "Thermos of strong coffee", icon: "medicine", applies: ["aspect:willpower"], text: "Staying in control." },
    crowbar: { name: "Crowbar", icon: "crowbar", applies: ["aspect:strength"], text: "Forcing, lifting, prying." },
    rope: { name: "Climbing rope", icon: "lockpicks", applies: ["aspect:agility"], text: "Keeping your footing." }
  };
  M.items.rope.icon = "crowbar";

  /* ------------------------------------------------------------------ PEOPLE */
  M.npcs = {
    nomura: { name: "Daisuke Nomura", jp: "野村 大輔", portrait: "nomura", tag: "Homicide, Tokyo Metropolitan Police · 49",
      look: "Thick-built and clean-shaven, salt-and-pepper hair combed back. A canvas trench coat over rumpled shirt sleeves; his wire-rimmed glasses fog in the rain. Cigarettes in a flat metal case beside his notebook." },
    kaede: { name: "Kaede Yamada", jp: "山田 楓", portrait: "kaede", tag: "2B · in custody · 36",
      look: "Tired and pale, black hair loosely tied, a municipal-issued robe. Her hands are folded tightly in her lap and her eyes keep to the table. She tenses at sharp sounds." },
    naoko: { name: "Naoko Fukuda", jp: "福田 直子", portrait: "naoko", tag: "1A · 33",
      look: "A young widow with tired eyes and shoulder-length hair tied back, a plain cardigan. She speaks gently but quickly, glancing back toward her silent toddler." },
    hideki: { name: "Hideki Masuda", jp: "増田 英樹", portrait: "hideki", tag: "1B · 41",
      look: "Gaunt and pale, shaved head, narrow eyes. Layered jackets and threadbare slippers. He keeps to the corner of the doorway and doesn't speak unless spoken to." },
    kenjiro: { name: "Kenjiro Watanabe", jp: "渡辺 健次郎", portrait: "kenjiro", tag: "1D · 67",
      look: "A broad man with large hands and a dented steel cane, white undershirt and work pants. He grumbles, and pauses between thoughts like he's half-forgotten them." },
    daigo: { name: "Daigo Shimizu", jp: "清水 大吾", portrait: "daigo", tag: "2A · 29",
      look: "A broad-shouldered courier in stained gloves and a postal cap, smelling faintly of cigarettes. He leans on the doorframe and talks with his hands." },
    chihiro: { name: "Chihiro Ishikawa", jp: "石川 千尋", portrait: "chihiro", tag: "2C · 24",
      look: "Slender, short hair, large round glasses and layered sweaters. A recorder in one hand and a notebook in the other. Fidgety, eager to please, a little lonely." },
    ayaka: { name: "Ayaka Toshiro", jp: "敏郎 綾香", portrait: "ayaka", tag: "3A · 79",
      look: "Small and blind, clouded eyes, a traditional house kimono. Her apartment smells of tea and incense. She sits very still and seems to know more than she says." }
  };

  /* ------------------------------------------------------------------ CLUES */
  M.clues = {
    c_brief: { t: "The brief", s: "Nomura", x: "Kaede Yamada stabbed her husband Riku in apartment 2B. Riku drank, shouted, hit her. Paper lilies started falling the same night." },
    c_riku_lineage: { t: "Riku was tracing his lineage", s: "Nomura", x: "Six months ago Riku filed an ancestral record search at the ward office. He was unusually fixated. Pamphlets about family shrines on his table." },
    c_riku_abuse: { t: "A history of harm", s: "Nomura", x: "Noise complaints, one hospitalization. Kaede always said she fell." },
    c_kaede_relieved: { t: "\"It was coming\"", s: "Nomura", x: "After the arrest Kaede asked for no lawyer: \"It was coming. He was going to do worse.\" She looked relieved." },
    c_lilies_dry: { t: "The lilies stay dry", s: "Nomura", x: "Dozens on the stairs and sills. They should be soaked. They are folded dry, and nobody in the building made them." },
    c_lilies_vanish: { t: "Lilies vanish", s: "Nomura", x: "Nomura zipped a few into his satchel. Later that day they were gone." },
    c_fight: { t: "A fight, not a plan", s: "Nomura", x: "One stab to the chest with their own kitchen knife. She was backed into the room, defensive. He had bruised forearms and scratches on his neck." },
    c_frame: { t: "The thrown frame", s: "Nomura", x: "Glass in the entry: Riku threw a picture frame. The photo inside was torn." },
    c_scene_shift: { t: "The room shifted", s: "Nomura", x: "The blood splatter doesn't match the final resting position. Something in the room moved after the fact." },
    c_hall_shift: { t: "The hallway changes length", s: "Nomura", x: "While photographing, Nomura watched the second-floor hall lengthen. His chalk mark on a doorframe vanished and came back a minute later." },
    c_foundation: { t: "Built over something", s: "Nomura", x: "Unofficially the building sits on a shrine or training hall flattened in the bombings. The record was marked \"archived with no action.\"" },
    c_tape: { t: "Something between the walls", s: "Nomura's tape", x: "Microcassette from the morning after: paper crumpling between the walls, steady, like breathing." },
    c_tape_name: { t: "A name in the static", s: "Nomura's tape", x: "Under the crumpling, a second track: a voice like static whispering \"Yamada.\"" },
    c_incense: { t: "Temple incense", s: "Naoko Fukuda, 1A", x: "The night after, Naoko smelled incense at 2B's door. Not the cheap kind: the kind temples burn at New Year. No lights on." },
    c_daughter_folds: { t: "\"The folds talk to her\"", s: "Naoko Fukuda, 1A", x: "Naoko's daughter has started folding paper. She says the folds talk to her." },
    c_lily_crumbles: { t: "Lilies crumble indoors", s: "Naoko Fukuda, 1A", x: "Her daughter brought a lily inside and it crumbled. Not like a real flower." },
    c_elevator: { t: "The empty elevator", s: "Hideki Masuda, 1B", x: "A week before: the elevator stopped on his floor and opened. Nobody got out. The lights never blinked." },
    c_rhythm: { t: "The building's rhythm", s: "Hideki Masuda, 1B", x: "\"There's a rhythm to this place. You'll hear it eventually.\"" },
    c_dig: { t: "Don't dig there", s: "Kenjiro Watanabe, 1D", x: "Kenjiro helped pour the foundation. Some parts they were told not to dig up. Old rubble, maybe." },
    c_memorial: { t: "There was a memorial", s: "Kenjiro Watanabe, 1D", x: "\"If they'd kept the memorial, none of this'd be happening.\"" },
    c_lilies_rot: { t: "They don't rot", s: "Kenjiro Watanabe, 1D", x: "Paper is supposed to soak, split and tear. These don't." },
    c_walls_breathe: { t: "Walls that breathe", s: "Kenjiro Watanabe, 1D", x: "\"You ever hear a wall groan like it's breathing?\"" },
    c_crooked: { t: "The crooked corner", s: "Daigo Shimizu, 2A", x: "A corner on the third floor lines up with no wall beneath it, built around old foundation stones they couldn't dig up. Boxes slide to it on flat floors." },
    c_mailchute: { t: "The mail chute is too deep", s: "Daigo Shimizu, 2A", x: "A package dropped down the chute fell for ten seconds." },
    c_flicker: { t: "Lights flickered that night", s: "Daigo Shimizu, 2A", x: "The hallway lights flickered a few times the night of the murder." },
    c_kaede_night: { t: "What Kaede says happened", s: "Kaede Yamada", x: "He came home drunk, said something in the walls was watching him, shoved her, screamed she \"wasn't the right shape anymore.\" She ran to the kitchen, took the knife. He kept coming. Once." },
    c_riku_dreams: { t: "Riku's last days", s: "Kaede Yamada", x: "He hadn't slept in two days. Said his dreams were folding in on themselves. Said his family would be proud of him soon." },
    c_kaede_abuse: { t: "Slow and quiet", s: "Kaede Yamada", x: "Years of emotional volatility, isolation and physical intimidation." },
    c_yamada_old: { t: "An old name", s: "Ayaka Toshiro, 3A", x: "\"Yamada. That surname... it's old. Not many left like it.\"" },
    c_remembrance: { t: "Lilies for those who never came home", s: "Ayaka Toshiro, 3A", x: "Paper lilies are left for spirits who never made it home. Folding one is a promise. So many falling now: someone is breaking promises." },
    c_exhaled: { t: "The hallway exhaled", s: "Ayaka Toshiro, 3A", x: "She didn't hear the murder. She felt something shift, like the hallway had exhaled." },
    c_phantom_door: { t: "A door that wasn't there", s: "Chihiro Ishikawa, 2C", x: "A week ago she saw a door at the end of the hall that doesn't exist. It blinked out." },
    c_slips: { t: "Riku's slips of paper", s: "Chihiro Ishikawa, 2C", x: "Riku left tiny quotes in the elevator. \"Fold what remains.\" \"Wind in the walls.\" She kept them." },
    c_folded_palm: { t: "The Folded Palm, in folklore", s: "Chihiro Ishikawa, 2C", x: "A mid-Edo dojo known for peaceful resistance and refusing conscription. The founder was a philosopher said to hide his final teachings in calligraphy folds." },
    c_photo: { t: "The torn photograph", s: "2B living room", x: "A man in a training gi before a wooden dojo sign. The tear took most of the sign; the last character, 掌 (palm), and part of a folded-hand crest remain." },
    c_pamphlets: { t: "Family shrine pamphlets", s: "2B living room", x: "Pamphlets on ancestral shrines and family graves, one ward-office form stamped RECEIVED. The surname Yamada is circled on every page." },
    c_knife_gap: { t: "The missing knife", s: "2B kitchen", x: "One slot on the knife rack is empty. The police took it: the kitchen knife that killed Riku." },
    c_crack: { t: "The split in the floor", s: "2B bedroom", x: "The bedroom doesn't line up, as if it were split and put back together. Along the seam the boards have cracked, and the crack leads down." },
    c_crack2a: { t: "Down to the basement", s: "Apartment 2A", x: "In the same spot in 2A the crack continues. It runs all the way to the basement." },
    c_records: { t: "Riku Yamada's box of records", s: "2B bedroom", x: "Tax statements, deeds, insurance, a birth certificate and an old book of family history: generations of Yamadas and their bond to the Folded Hand." },
    c_paperhouse: { t: "A paper house in the basement", s: "Basement", x: "Two meters tall, folded from paper, just big enough to crawl inside. It glows." },
    c_shrine: { t: "\"Remember those with courage\"", s: "The paper dojo", x: "A small shrine at the back of the training hall, the words written in ink across its face." },
    c_journal: { t: "The Journal of Ichiban", s: "The paper study", x: "The last student of the Folded Palm wrote down what happened to the dojo, and how the seal can be renewed." }
  };

  M.lore = {
    history: { t: "History of the Folded Palm",
      x: "The History of the Folded Palm is long. Established in 1793, the dojo was formed to teach self defense. The dojo took this practice very seriously and at all costs members were to avoid conflict whenever possible. The founder of this dojo was Ren Yamada, an artist and painter who incorporated the brush strokes used on a canvas for defense. In 1940 the military came to their dojo seeking skilled fighters for the war and all of them refused. Fighting broke loose but the young men of the dojo remained upright and the military was forced to leave. However later that night a number of the students were abducted from their homes and were never seen again. A small memorial was constructed in the dojo to commemorate the students they lost and honor their courage. The entire dojo was later destroyed during an air raid and the memorial reduced to rubble." },
    extra: { t: "Folklore: the sealing talismans",
      x: "It is said that Ren Yamada placed sealing talismans on the ruined memorial to appease the spirits, knowing that they would be angered at this injustice. The spirits had always been his loyal students, and if any harm would come to him or his family they would return with vengeance for whoever had called upon them." },
    journal: { t: "The Journal of Ichiban",
      x: [
        "<b>Spring, Shōwa 15 (1940).</b> The soldiers came at the hour of practice. They wanted the strong ones. Sensei bowed and said the Folded Palm does not strike first, and does not march. They struck first. We stood upright, all of us, and did not fall, and they left. That night they came to our houses instead. Kenta. Shirō. The Ōno brothers. Hajime. Eleven of us. I was at my uncle's in Chiba. I am the one they did not find.",
        "<b>Summer, 1940.</b> Sensei built a memorial at the back of the hall, a small shrine. He wrote on it: <i>remember those with courage</i>. We folded a lily for each of them and left it there. Sensei said a folded lily is a promise: that we will not forget, and that the way home stays open.",
        "<b>March, 1945.</b> The fire raid took Kanda. The dojo burned to the stones; the memorial is rubble. Sensei (Yamada Ren, fourth to carry the name; every head of the house takes it) laid sealing papers on what was left. He said they are angry, and they are loyal, and anger needs a lid. As long as the seal holds they rest. If harm comes to his blood, they will come back for whoever called them.",
        "<b>1958.</b> The ward cleared the lot for an apartment block. We petitioned. Nobody answered. They poured concrete over the stones and swept our lilies away with the rubble. I fold one every year and leave it at the curb. Someone always sweeps it up.",
        "<b>For whoever finds this.</b> If the seal ever breaks: speak the Yamada name from the family's own record, trace the old forms of the Folded Palm, and return the talisman to the place of remembrance. Then the paper will remember that it is only paper. — Ichiban (Satō Ichirō), last student of the Folded Palm"
      ].join("<br><br>") }
  };

  /* ------------------------------------------------------------------ OBJECTIVES
     Primary objectives are told at the start; secondary ones stay hidden. */
  M.objectives = [
    { id: "po1", kind: "primary", t: "Find the origin of the Beyond Event", done: "The Folded Palm memorial site, buried under the apartment." },
    { id: "po2", kind: "primary", t: "Learn the reason for the lilies", done: "Paper lilies were left at the young men's memorial, before the government demolished it." },
    { id: "po3", kind: "primary", t: "Deal with the Beyond Entity", done: "" },
    { id: "so1", kind: "secondary", t: "Riku Yamada's box of records", done: "The Yamada family history. Needed for the banishment rite." },
    { id: "so2", kind: "secondary", t: "The bleeding knife", done: "+2 when evading the Paper Ghost's traps or fighting it." },
    { id: "so3", kind: "secondary", t: "The Journal of Ichiban", done: "Teaches the agents how to banish the Paper Ghost." }
  ];

  /* ------------------------------------------------------------------ TEXT */
  M.text = {
    intro: "A murder has stirred something long buried. In the Kanda district of Tokyo, a small apartment homicide investigation turned supernatural as neighbors began reporting paper lilies floating in the air, drifting without wind. The Guard has dispatched you to investigate alongside local law enforcement and decipher what horrible connection this might entail.",
    arrival: [
      "All agents here were dispatched alongside the police to investigate the phenomenon currently taking place: paper lilies had begun to fall from the sky surrounding a particular apartment building in the Kanda district. There is a slight rain. The puddles in the street gently rock the lilies and reflect the blue and red flash of your police cruiser. The smell of blossoming flowers fills your nose as you step out into the street.",
      "Officer Daisuke Nomura greets the group and hands out coffees, knowing that being part of the Guard means you most likely haven't slept in a while. You recognise Nomura. While not a member of your organization, he does seem to often be working on similar cases; most likely he has become Tethered. He can be trusted, and while technically not a member he has seen his fair share of the paranormal and is always happy to help where he can."
    ],
    nomuraBrief: "Glad you could all make it out here tonight. I got a domestic homicide on my hands and unfortunately suspect that the paper lilies are connected, hence my call for you. So, the brief. Right now it's pretty cut and dry: Kaede Yamada killed her husband upstairs, Riku Yamada. As far as I can gather, seems like he had it coming. The guy had a history of alcoholism, and on multiple accounts shouting and violent outbursts would occur in their room. The neighbors also testify that they would often see Kaede with bruises. All that being said, it doesn't explain the other oddity. So if you need anything from me, let me know. I'll be snooping around in 2B, seeing if I missed anything from the crime scene.",
    crack1: "A small lily floats past your face and squeezes itself through the crack. Another appears behind you, and another. They lead out the door and down the stairs, calling to you.",
    crack2: "Another lily lazily drifts past your face, folding itself through another crack. The lilies begin to appear behind you once again, leading all the way to the basement. Each lily beckoning you to take another step to deeper and darker places.",
    basement: "Beneath the apartment lies a concrete room fixed with a boiler and a few boxes of storage and maintenance equipment. It is dusty and damp. The faint sound of dripping can be heard throughout the room; there seems to be a leak somewhere, either in the pipes or faulty construction letting the rain in. Within the middle of this room, however, is a small paper house about two meters in height, with just enough space to crawl inside.",
    lookInside: "Inside the house you can see a small area arranged for guests, with tea and chairs set around a lovely oval table. All of it is made from paper, and a latched door blocks the view of the rest of the house from the other side.",
    enterHouse: "Upon entering the paper house you smell burning incense and old musty books. As you continue further in, the house seems to unfold and expand around you, allowing space to stand and move around.",
    dojo: "The door swings open to reveal a well kept paper dojo. Mats are laid out for practice, as well as several training dummies. At the back of the training area is a small shrine with the words \"remember those with courage\" written in ink on its surface. Behind the shrine is another room; it appears to be a bedroom and study rolled into one for whoever owns this place. Paper lilies decorate the top of the desk. On the far left are a set of stairs that ascend, seemingly, back into the apartment.",
    paperApt: "While traveling through the apartment everything feels familiar, but in a bad-dream sort of way. The walls are paper, the floors are paper, the furniture is paper, and any attempt to look out a window shows a vague drawing of what the outside might look like. You are surrounded by an origami replica, some things folded in ways that shouldn't even be possible. The tenants are nothing but lifeless paper dolls, casually speaking to one another and going about their business. Except that they aren't. It's like small echoes of things they used to do, just pieces. They never fully finish a sentence or task, just repeating endlessly.",
    ghostFree: "The walls unfold. The crinkle of paper is broken by a sudden tearing sound. A looming slender figure rips free from the very floorboards where Riku's corpse once laid. Small drops of blood dot its perfect white paper skin. Its face folds into a grin as it says:",
    banish: "You complete the banishment ritual, a skill that you happen to need too often in your line of work. The creature begins to fold in on itself, over and over and over again, until it folds itself out of existence. The paper building begins to burn, drifting away in bright embers all around you. The walls give way to reality once more. You are left back in the apartment and all is normal once again, except a single lovely paper lotus at the base of your feet: a sign of peace and rest.",
    kill: "The Paper Ghost is torn to shreds, its body drifting to the floor. The building begins to burn, embers drifting all around, revealing the old brick walls of the apartment again. All seems normal once again. However, after a search of the apartment, Kaede Yamada is nowhere to be found. Only a single bloody shred of paper is found in apartment 2B. It is the same paper that was used in the sealing talisman.",
    failed: "The paper closes over the last of you like a page turning. Somewhere above, in the real building, the lilies keep falling. In the morning the Guard will send someone else, and they will find your names folded into the walls."
  };

  /* ------------------------------------------------------------------ INTERVIEWS
     Agents roll Charisma: below 10 = 2 questions, 10-13 = 5, 14+ = all of them. */
  const Q = (id, q, a, clues = [], cond = null) => ({ id, q, a, clues, cond });
  M.interviews = {
    naoko: {
      opener: "The door opens on its chain, then all the way. A toddler watches from behind her legs without a sound.",
      excuse: "\"I'm sorry, I have to put her down for the night.\" The door closes softly.",
      questions: [
        Q("self", "Tell us about yourself.", ["I stay home most days. My husband passed a few years ago, so it's just me and my daughter now. We get by."]),
        Q("couple", "Did you know the Yamadas?", ["I didn't know them personally. I'd hear them argue sometimes, but I tried not to get involved."]),
        Q("building", "What's the building like?", ["It's old, but not terrible. Just drafty. My heater cuts out sometimes, but that's Tokyo for you."]),
        Q("howlong", "How long have you lived here?", ["Almost six years. I was on the waiting list forever."]),
        Q("murder", "What do you know about the murder?", ["Just what the police told us. Tragic. I saw Kaede once after... she looked empty.", "Actually, there was something strange, now that I think about it. The night after it happened, I walked past their door and smelled incense. Not like the cheap kind. The kind temples use during New Year. But there were no lights on, and no one's burned anything like that here in years."], ["c_incense"]),
        Q("unusual", "Anything unusual lately?", ["Not really. Maybe a power flicker once. But this place creaks at night. I figured it was nothing."]),
        Q("lilies", "What do you make of the lilies?", ["Pretty, but strange. My daughter tried to bring one in and it sort of... crumbled. Not like a real flower."], ["c_lily_crumbles"]),
        Q("more", "Anything else on your mind?", ["My daughter's obsessed with folding paper lately. She says the folds talk to her. Kids, right?", "I've started cooking again since the weather changed. Nothing fancy, just miso and rice. Keeps us warm."], ["c_daughter_folds"])
      ]
    },
    hideki: {
      opener: "The door opens a hand's width. He stays in the dark of the genkan.",
      excuse: "He says nothing for a long moment, then closes the door.",
      questions: [
        Q("self", "Tell us about yourself.", ["Don't really go out much. This place is cheap. That's all I need."]),
        Q("couple", "Did you know the Yamadas?", ["Didn't talk to them. Heard yelling sometimes. Didn't see them in the halls much."]),
        Q("building", "What's the building like?", ["It's quiet if you know when to be still. People just don't know how to listen."]),
        Q("howlong", "How long have you lived here?", ["Long enough. You start to know the floorboard rhythms after a while."]),
        Q("murder", "Where were you that night?", ["Was out. Didn't hear it. Police asked already. I've got nothing."]),
        Q("unusual", "Anything unusual lately?", ["A week before, there was a day the elevator stopped on my floor but no one got out. I thought it was stuck, but the lights never blinked. Just... opened. Then closed."], ["c_elevator"]),
        Q("lilies", "What do you make of the lilies?", ["I don't mess with that stuff. Origami's for funerals or children. Not grown people."]),
        Q("more", "Anything else?", ["There's a rhythm to this place. You'll hear it eventually."], ["c_rhythm"])
      ]
    },
    kenjiro: {
      opener: "A radio is playing enka somewhere inside. He leans on the cane and looks you over.",
      excuse: "\"That's enough.\" He shuts the door with the end of his cane.",
      questions: [
        Q("self", "Tell us about yourself.", ["Retired. Poured concrete and drank cheap beer. Still do the latter."]),
        Q("couple", "Did you know the Yamadas?", ["Noisy. Didn't talk. I mind my own."]),
        Q("building", "What's the building like?", ["I helped pour it back in the day. Some parts they told us not to dig up. Old rubble, maybe."], ["c_dig"]),
        Q("howlong", "How long have you lived here?", ["Since the year it opened. Before they put in the second stairwell."]),
        Q("murder", "Did you hear anything that night?", ["Didn't hear a damn thing. I sleep with the radio on."]),
        Q("unusual", "Anything unusual lately?", ["You ever hear a wall groan like it's breathing? Never mind. Probably settling."], ["c_walls_breathe"]),
        Q("lilies", "What do you make of the lilies?", ["They don't rot. That's not right. Paper's supposed to soak, split, tear. These don't."], ["c_lilies_rot"]),
        Q("more", "Anything else you want to say?", ["If they'd kept the memorial, none of this'd be happening. That's my opinion.", "Ask too many questions, the building hears you."], ["c_memorial"])
      ]
    },
    daigo: {
      opener: "He's still in his uniform, a half-eaten bento in one hand.",
      excuse: "\"I've got a 6 a.m. route. Good luck, yeah?\"",
      questions: [
        Q("self", "Tell us about yourself.", ["Courier. I'm up and down stairs all day. This building's a cardio nightmare."]),
        Q("couple", "Did you know the Yamadas?", ["I delivered food to them once or twice. He always answered. She never came to the door."]),
        Q("building", "What's the building like?", ["Like, there's this corner on the third floor that doesn't line up with any walls beneath it. Not a big deal, just... someone screwed up construction.", "(He pauses, then shrugs.) They said it was to compensate for settling. Something about old foundation stones they couldn't fully dig up. I'm no architect, but it always felt crooked. Ever so slightly wrong when you stand in it. My boxes slide in that hallway, always to the same corner, even on flat floors."], ["c_crooked"]),
        Q("howlong", "How long have you lived here?", ["Couple years."]),
        Q("murder", "Did you see anything that night?", ["Didn't see anything. Just the lights in the hallway flickered a few times that night. Could've been unrelated."], ["c_flicker"]),
        Q("unusual", "Anything unusual lately?", ["I swear the mail chute's deeper than it should be. Dropped a package and heard it fall for, like, ten seconds. Maybe it bounced."], ["c_mailchute"]),
        Q("lilies", "What do you make of the lilies?", ["Pretty. Like something from a festival float. But I don't remember there being any festivals nearby. Who knows, I could have missed it."]),
        Q("more", "Anything else?", ["I saw a guy get lost trying to find 3B once. The door was right in front of him."])
      ]
    },
    chihiro: {
      opener: "\"Oh! You're the... investigators? Come in, sorry, it's a mess.\" Index cards are pinned to every wall.",
      excuse: "\"Sorry, sorry, I have a seminar at nine. Come back anytime!\"",
      questions: [
        Q("self", "Tell us about yourself.", ["I'm in grad school, studying folklore, actually. This building's not exactly ideal for quiet study, but it's cheap."]),
        Q("couple", "Did you know the Yamadas?", ["They mostly kept to themselves. I'd hear muffled arguments. I think he worked from home?"]),
        Q("building", "What's the building like?", ["The place is fine if you're used to weird plumbing. Sometimes my pipes bang for no reason."]),
        Q("howlong", "How long have you lived here?", ["Just under a year. Moved in last spring."]),
        Q("murder", "Were you home that night?", ["Yeah, I heard. I was home but had headphones on, so I didn't hear anything. Police asked a few questions."]),
        Q("unusual", "Anything unusual lately?", ["There was one night, maybe a week ago, I thought I saw a door at the end of the hall that didn't exist. Just a shape where it shouldn't be. But it blinked out.", "Also, Riku used to leave slips of paper in the elevator. Weird, tiny quotes. I collected them, thought it might be a found poetry project or something. One of them said: \"Fold what remains.\" Another just said: \"Wind in the walls.\" I still have them."], ["c_phantom_door", "c_slips"]),
        Q("lilies", "What do you make of the lilies?", ["Honestly? A little unsettling. I thought they were confetti or something at first. Then they didn't stop coming."]),
        Q("palm", "Have you heard of the Folded Palm?", ["That name came up in one of my papers, actually. It was a dojo, right? Mid-Edo period. Known for peaceful resistance; there's a famous story about them refusing military conscription. The founder was something of a philosopher. Some say he hid his final teachings in calligraphy folds, like origami riddles."], ["c_folded_palm"], (g) => g.knows("history") || g.has("c_photo") || g.has("c_records")),
        Q("more", "Anything else?", ["Do you know the story of the Three-Fold Death? No? Sorry, folklore habit. I always ask.", "There's a vent on the second floor that lets in voices from the stairwell. I think it echoes weird."])
      ]
    },
    ayaka: {
      opener: "She opens the door before you knock. \"Come in. The tea is still warm. It won't be for long.\"",
      excuse: "\"I'm tired now. Mind the step on your way out.\"",
      questions: [
        Q("self", "Tell us about yourself.", ["Retired. My eyesight's gone, but I still manage. Used to assist at a shrine decades ago."]),
        Q("couple", "Did you know the Yamadas?", ["Only by name. Riku Yamada. That surname... it's old. Not many left like it."], ["c_yamada_old"]),
        Q("building", "What's the building like?", ["I remember when they laid the concrete. It was quiet then. Now it's never still."]),
        Q("howlong", "How long have you lived here?", ["Since the '50s. I've seen tenants come and go."]),
        Q("murder", "Did you hear anything that night?", ["I didn't hear it. But I felt something shift. Like the hallway had exhaled."], ["c_exhaled"]),
        Q("unusual", "Anything unusual lately?", ["No. Just creaks and murmurs like always. But then again, I know better than to listen too closely."]),
        Q("lilies", "What are the lilies?", ["Those are for remembrance. But no one remembers why. That's the part that scares me.", "Lilies made of paper are left for spirits who never made it home. The old prayers say folding one is a promise. So many floating now... someone's breaking promises."], ["c_remembrance"]),
        Q("more", "Anything else?", ["When lilies fall from nowhere, someone is being mourned, even if we don't know who.", "Tea cools faster in this room. It always has."])
      ]
    },
    kaede: {
      opener: "Interview Room 2, Kanda Station. A fluorescent tube ticks overhead. Nomura leans on the wall by the door and lets you take the chair.",
      excuse: "She folds her hands tighter and stops answering. A matron comes to take her back.",
      questions: [
        Q("self", "Tell us about yourself.", ["I worked part-time. Mostly clerical stuff. I didn't really go out much... not unless I had to."]),
        Q("night", "Can you tell us what happened that night?", ["He came home drunk. Again. He said he heard something in the walls. That it was watching him. I tried to calm him down. Then he pushed me. Screamed that I \"wasn't the right shape anymore.\" I don't even know what that meant. I ran to the kitchen. He followed. I grabbed the knife. I thought he'd stop. But he kept coming. So I... I did it. Once. Just once."], ["c_kaede_night"]),
        Q("before", "Did Riku act unusual before the murder?", ["He hadn't slept in two days. Said his dreams were folding in on themselves. Said his family would be proud of him soon. I thought he was just being dramatic. I didn't know what it meant."], ["c_riku_dreams"]),
        Q("couple", "What were things like between you?", ["People always think it's loud fights and broken dishes. It wasn't. It was slow. Quiet. The kind of hurting where you can't tell where it starts."]),
        Q("abuse", "Did he hurt you?", ["(She is quiet for a long time.) Years. He'd go cold for weeks, then shout. He took my keys so I couldn't see my sister. He'd stand in the doorway so I couldn't leave the room. He didn't always have to hit me."], ["c_kaede_abuse"], (g) => g.asked("kaede", "couple")),
        Q("building", "What's the building like?", ["It's just an old apartment. Thin walls. Cold floors. You live with it."]),
        Q("howlong", "How long did you live there?", ["We moved in after we got married. That was... almost seven years ago."]),
        Q("murder", "Walk us through the murder.", ["He was drunk. Kept pacing. Kept saying strange things about shapes and walls. Then he shoved me. I panicked. I ran for the kitchen. When he followed, I picked up the knife. He didn't stop coming."]),
        Q("unusual", "Anything unusual in the apartment?", ["Strange how? Like ghosts? No. Just my husband. He was the only thing strange in that apartment."]),
        Q("lilies", "Have you seen the lilies?", ["They were there after. Floating outside the window. At first I thought someone left them for me. Now I don't know. I don't touch them."]),
        Q("more", "Is there anything you want to tell us?", ["Do you think I'm a monster? You can say it. I already know what people think.", "When it was over, I waited. I didn't run. I just sat there and waited."], ["c_kaede_relieved"])
      ]
    }
  };

  /* Nomura answers everything he knows; no Charisma roll needed. */
  M.nomuraTopics = [
    { id: "riku", q: "What do you know about Riku Yamada?", a: ["I've been on scene with him before. Mostly noise complaints, one hospitalization. Wife always claimed it was a fall or something clumsy.", "Six months ago he filed for an ancestral record search at a ward office. Said he was tracing his lineage. Not uncommon, but he was unusually... fixated. Had pamphlets about family shrines on his table."], clues: ["c_riku_abuse", "c_riku_lineage"] },
    { id: "kaede", q: "And Kaede?", a: ["Never gave us trouble. Worked part-time, something clerical. Kind woman. Kept quiet. I don't think she's ever been in trouble before this.", "After the arrest, she didn't ask for a lawyer. Just said, \"It was coming. He was going to do worse.\" She looked... relieved."], clues: ["c_kaede_relieved"] },
    { id: "lilies", q: "Tell us about the lilies.", a: ["Started showing up the morning after. Dozens of them, on the stairs, on windowsills. Should've been soaked through, but they weren't. Folded dry. No one in the building claims to have made them.", "I took a few. Left them in my satchel. Later that day? Gone. Satchel was zipped shut."], clues: ["c_lilies_dry", "c_lilies_vanish"] },
    { id: "scene", q: "Walk us through 2B.", a: ["The bedroom was the main scene. Blood on the futon, but more around it: floor lamp knocked over, dresser drawer half-pulled out. It wasn't clean. There was a fight.", "She stabbed him once in the chest. Knife was from their own kitchen, nothing special. But the angle says she was backed into the room. Defensive posture.", "He had bruising along the left forearm and scratches on his neck. She was trying to get away. Doesn't read like someone who planned this. Reads like someone who snapped.", "Glass fragments in the entry suggest he threw a picture frame. The photo inside was torn. Probably mid-argument.", "Only thing strange? The blood splatter doesn't match the final resting position. Like something in the room shifted after the fact. Maybe the body, maybe the layout. I'm sure you people can figure that one out."], clues: ["c_fight", "c_frame", "c_scene_shift"] },
    { id: "hall", q: "Anything odd in the building itself?", a: ["I didn't believe it until I saw it. While I was taking photos, the length of the second-floor hall changed. Just slightly. I had marked a doorframe with chalk, then it vanished. Came back a minute later.", "I sketched it down. Didn't tell HQ. They'd think I was sleep-deprived. Maybe I am."], clues: ["c_hall_shift"] },
    { id: "foundation", q: "What was here before the building?", a: ["Unofficially, this place was built over something. A shrine or training hall that got flattened during the bombings.", "The record was marked \"archived with no action.\" No follow-up."], clues: ["c_foundation"] },
    { id: "tape", q: "Did you record anything?", a: ["Used my own microcassette to record hallway noise the morning after. Something was walking between the walls. When I played it back, I heard paper crumpling. Steady, like breathing. Haven't told anyone else."], clues: ["c_tape"], tape: true }
  ];

  /* What Nomura can read from evidence you bring him */
  M.nomuraEvidence = [
    { need: "c_photo", id: "ev_photo", q: "Show him the torn photograph.", a: ["He tilts it under the light. \"That's a dojo sign. Old one. The character left is 掌, palm. And that crest, a hand folded like paper.\" He taps the edge of the tear. \"Riku threw this, but he didn't tear it. That's an old tear. Somebody kept it like this for years.\""], clues: [] },
    { need: "c_records", id: "ev_records", q: "Show him Riku's box of records.", a: ["He pages through the family registry with a pencil, not touching the paper. \"Goes back to Edo. Look. Yamada Ren. Yamada Ren. Yamada Ren. Every head of the house takes the same name. Riku's grandfather was the last one to carry it.\" He closes the book. \"And Riku was the last of the line. No kids, no brothers. When he died, that was the end of them.\""], clues: [] },
    { need: "c_slips", id: "ev_slips", q: "Tell him about Riku's slips of paper.", a: ["\"Fold what remains.\" He writes it down. \"That's the phrasing on his ward-office request, too. Under 'purpose of search' he wrote: to fold what remains of my family back together.\""], clues: [] }
  ];

  /* ------------------------------------------------------------------ LOCATIONS */
  const say = (g, ...lines) => g.sayAll(lines);
  M.start = "street";
  M.locations = {
    street: {
      name: "Kanda, outside Yanagi-sō", jp: "神田・柳荘前", scene: "street", music: "investigation", ambience: "rain",
      lighting: "shadow", particles: "rain-lilies",
      cast: (g) => (!g.flag("briefed") ? ["nomura"] : []),
      enter: async (g) => {
        if (g.flag("arrived")) return;
        g.set("arrived");
        await g.aloud(M.text.arrival[0]);
        await g.aloud(M.text.arrival[1]);
        await g.say(M.text.nomuraBrief, { who: "nomura" });
        g.clue("c_brief");
        g.set("briefed");
        g.sfx("radio");
        await g.narrate("Nomura heads inside toward 2B. Something about this street nags at one of you: the shape of the lot, the angle of the building. There used to be something else here.");
        const r = await g.check({ aspect: "iq", cr: CR("challenging"), label: "Remember what stood here", investigate: true, tags: ["lore"], who: "choose" });
        if (r.ok) {
          await g.narrate(`${r.agent.short} remembers: there used to be another building on this lot. A dojo, before the war.`);
          await g.learn("history");
          await g.offerExtraLore();
        } else {
          await g.narrate("The thought slips away in the rain. Whatever stood here, nobody remembers it tonight.");
        }
      },
      hotspots: [
        { id: "entrance", label: "Enter Yanagi-sō", go: "hall1" },
        { id: "nomura", label: "Officer Nomura", if: (g) => !g.flag("briefed"), run: async (g) => g.talkNomura() },
        { id: "puddle", label: "Lilies in the puddles", run: async (g) => {
          g.sfx("lily_chime");
          await g.narrate("The lilies ride the rain-rings in the puddles, folded perfectly dry. When a drop lands on one it beads and rolls off like oil. None of them have a crease out of place.");
          g.clue("c_lilies_dry");
        } },
        { id: "cruiser", label: "Nomura's cruiser", run: async (g) => {
          if (g.flag("station_done")) return g.narrate("The radio mutters about a traffic accident in Ochanomizu. Nothing for you.");
          const c = await g.choose("The cruiser is warm and smells of cigarettes. Kanda Station is five minutes away, and Kaede Yamada is being held there.", [
            { id: "go", label: "Ride to Kanda Station to see Kaede" }, { id: "no", label: "Not yet" }]);
          if (c === "go") { g.sfx("radio"); await g.goto("station"); }
        } }
      ]
    },
    station: {
      name: "Kanda Station, Interview Room 2", jp: "神田署・取調室", scene: "station", music: "investigation", ambience: "building",
      lighting: "normal",
      cast: () => ["kaede"],
      hotspots: [],
      actions: [
        { label: "Interview Kaede Yamada", run: async (g) => g.interview("kaede") },
        { label: "Ride back to Yanagi-sō", run: async (g) => { g.set("station_done", g.interviewDone("kaede")); await g.goto("street"); } }
      ]
    },
    hall1: {
      name: "Ground floor hallway", jp: "一階廊下", scene: "hall1", music: "investigation", ambience: "building", lighting: "normal",
      hotspots: [
        { id: "door_1a", label: "1A · Fukuda", run: async (g) => g.interview("naoko") },
        { id: "door_1b", label: "1B · Masuda", run: async (g) => g.interview("hideki") },
        { id: "door_1d", label: "1D · Watanabe", run: async (g) => g.interview("kenjiro") },
        { id: "mailchute", label: "Mail chute", run: async (g) => {
          const c = await g.choose("A brass mail slot. The chute behind it should drop one story, to a bin in the basement.", [
            { id: "drop", label: "Drop a coin down it" }, { id: "leave", label: "Leave it" }]);
          if (c !== "drop") return;
          g.sfx("mail_chute");
          await g.narrate("The coin rattles, scrapes, and keeps falling. And falling. You count to nine before something, far too far below, goes tink.");
          g.clue("c_mailchute");
        } },
        { id: "elevator", label: "Elevator", run: async (g) => {
          g.sfx("elevator_ding");
          await g.narrate("You press the call button. The elevator arrives, the doors open on an empty, lit car, and then close again before anyone moves. The floor indicator never changes from 1.");
          if (g.has("c_slips")) await g.narrate("Someone has tucked a folded slip of paper into the gap behind the button panel. It's blank except for a crease down the middle.");
        } },
        { id: "basement_door", label: "Basement door (B1)", run: async (g) => g.basementDoor() },
        { id: "stairs_up", label: "Stairs up", go: "hall2" },
        { id: "exit", label: "Back out to the street", go: "street" }
      ]
    },
    hall2: {
      name: "Second floor hallway", jp: "二階廊下", scene: "hall2", music: "investigation", ambience: "building", lighting: "normal",
      hotspots: [
        { id: "door_2a", label: "2A · Shimizu", run: async (g) => {
          if (g.flag("crackFound") && !g.flag("in2a")) {
            const c = await g.choose("Daigo Shimizu's door.", [
              { id: "talk", label: "Talk to Daigo" }, { id: "search", label: "Ask to check his floor, under 2B's bedroom" }]);
            if (c === "search") { g.sfx("door_slide"); await g.narrate("\"Sure, sure, mind the boxes.\" Daigo steps aside, curious."); return g.goto("apt2a"); }
          } else if (g.flag("in2a")) {
            const c = await g.choose("Daigo Shimizu's door.", [{ id: "talk", label: "Talk to Daigo" }, { id: "search", label: "Go back into 2A" }]);
            if (c === "search") return g.goto("apt2a");
          }
          return g.interview("daigo");
        } },
        { id: "door_2b", label: "2B · crime scene", run: async (g) => { g.sfx("door_slide"); await g.goto("apt2b_living"); } },
        { id: "door_2c", label: "2C · Ishikawa", run: async (g) => g.interview("chihiro") },
        { id: "chalk", label: "Chalk mark on the frame", run: async (g) => {
          if (!g.flag("hallStretch")) {
            g.set("hallStretch");
            g.sfx("hallway_stretch");
            g.shake();
            await g.narrate("Nomura's chalk tick on 2B's doorframe. You look away for a moment, and when you look back the hall is longer. Not by much: one more ceiling light, one more step of linoleum. The chalk mark is gone. A minute later both are back, as if nothing happened.");
            g.clue("c_hall_shift");
          } else {
            await g.narrate("The chalk tick is where Nomura left it. You don't take your eyes off it this time.");
          }
        } },
        { id: "vent", label: "Vent", run: async (g) => {
          await g.narrate("A grille high on the wall. Through it come voices from the stairwell, too clear and too close: someone humming, someone folding paper, the same fold over and over.");
          if (!g.has("c_tape") && !g.has("c_walls_breathe")) return;
          await g.narrate("Under the humming, a slow crumple. In. Out. Like breathing.");
        } },
        { id: "stairs_down", label: "Stairs", run: async (g) => {
          const c = await g.choose("The stairwell smells of wet concrete.", [
            { id: "up", label: "Up to the third floor" }, { id: "down", label: "Down to the ground floor" }]);
          await g.goto(c === "up" ? "hall3" : "hall1");
        } }
      ]
    },
    hall3: {
      name: "Third floor hallway", jp: "三階廊下", scene: "hall3", music: "investigation", ambience: "building", lighting: "normal",
      hotspots: [
        { id: "door_3a", label: "3A · Toshiro", run: async (g) => g.interview("ayaka") },
        { id: "corner", label: "The crooked corner", run: async (g) => {
          g.sfx("footsteps");
          await g.narrate("The end of the hall turns a few degrees off true. Standing in it makes your inner ear tilt. A stray parcel sits pressed into the corner. When you set it in the middle of the floor, it slides back.");
          g.clue("c_crooked");
        } },
        { id: "stairs_down", label: "Stairs down", go: "hall2" },
        { id: "exit", label: "Back to the stairwell", go: "hall2" }
      ]
    },
    apt2b_living: {
      name: "Apartment 2B · living room", jp: "二〇二号室・居間", scene: "apt2b_living", music: "investigation", ambience: "building", lighting: "normal",
      cast: (g) => (g.party.nomuraJoined ? [] : ["nomura"]),
      enter: async (g) => {
        if (g.flag("seen_living")) return;
        g.set("seen_living");
        await g.narrate("A sparsely decorated common area with faded tatami and a single low table between two mismatched cushions. The television is small and unplugged; the far window's curtain is half-torn, letting in hazy light. The room smells stale, and the faint outlines of old furniture are pressed into the floor. It feels like a space that used to hold more life, but has gradually emptied.");
      },
      hotspots: [
        { id: "table", label: "Low table", run: async (g) => {
          await g.narrate("Pamphlets fanned across the table: ancestral shrines, family graves, a ward-office genealogy form stamped RECEIVED. The surname Yamada is circled in pencil on every page, hard enough to dent the paper.");
          g.clue("c_pamphlets"); g.clue("c_riku_lineage");
        } },
        { id: "tv", label: "Television", run: async (g) => g.narrate("A small Sanyo set, unplugged at the wall. The cord has been cut cleanly, not pulled. The screen reflects the room a little wrong: the window is on the other side.") },
        { id: "photo", label: "Broken frame", run: async (g) => {
          g.sfx("paper_crinkle");
          await g.narrate("Glass crunches underfoot. The frame Riku threw lies face down. The photograph inside shows a man in a training gi in front of a wooden dojo sign. The tear runs through the sign, and it is old, the edges soft and yellowed. Only the last character survives: 掌, palm. Beside it, part of a crest: a hand folded like paper.");
          g.clue("c_photo");
        } },
        { id: "window", label: "Torn curtain", run: async (g) => { g.sfx("lily_chime"); await g.narrate("Lilies hang outside the glass, turning slowly in air that isn't moving. They don't come in. They seem to be waiting."); } },
        { id: "to_kitchen", label: "Kitchen", go: "apt2b_kitchen" },
        { id: "to_bedroom", label: "Bedroom", go: "apt2b_bedroom" },
        { id: "to_storage", label: "Storage", go: "apt2b_storage" },
        { id: "exit", label: "Back to the hallway", go: "hall2" }
      ],
      actions: [{ label: "Talk to Nomura", if: (g) => !g.party.nomuraJoined, run: async (g) => g.talkNomura() }]
    },
    apt2b_kitchen: {
      name: "Apartment 2B · kitchen", jp: "台所", scene: "apt2b_kitchen", music: "investigation", ambience: "building", lighting: "normal",
      enter: async (g) => {
        if (g.flag("seen_kitchen")) return;
        g.set("seen_kitchen");
        await g.narrate("A narrow galley kitchen with aging steel counters and a greasy stovetop that hasn't been cleaned in weeks. A single dim bulb flickers when the fridge kicks on. It feels cramped and forgotten, used mostly out of necessity.");
      },
      hotspots: [
        { id: "knives", label: "Knife rack", run: async (g) => { await g.narrate("Four knives, one empty slot. Kaede ran in here, and took the one closest to her hand."); g.clue("c_knife_gap"); } },
        { id: "cabinets", label: "Open cabinets", run: async (g) => g.narrate("Instant noodles, a cracked bowl, soy sauce packets. One shelf has been cleared and wiped, as if something lived there once and was put away.") },
        { id: "sink", label: "Sink", run: async (g) => g.narrate("One side is stacked with old dishes. The other has rice dried hard to its surface. Two cups, both his.") },
        { id: "stove", label: "Stove", run: async (g) => g.narrate("A two-ring gas stove, crusted with grease. A box of matches with one match left.") },
        { id: "bulb", label: "Flickering bulb", run: async (g) => { g.flicker(); await g.narrate("The bulb dims every time the fridge cycles. In the dark half-second the kitchen looks narrower, as if the walls lean in to listen."); } },
        { id: "exit", label: "Back to the living room", go: "apt2b_living" }
      ]
    },
    apt2b_bedroom: {
      name: "Apartment 2B · bedroom", jp: "寝室", scene: "apt2b_bedroom", music: "investigation", ambience: "building", lighting: "normal",
      enter: async (g) => {
        if (g.flag("seen_bedroom")) return;
        g.set("seen_bedroom");
        await g.narrate("The bedroom is small and oppressively quiet, a bloodstained futon in the corner and a dented floor lamp flickering near its base. The drawers are partly open, the clothes inside wrinkled and unfolded. Chalk lines and police markers still dot the tatami near the futon. This is clearly where Riku died. A faint metallic scent lingers. Despite the police cleanup, the room feels frozen in time.");
      },
      hotspots: [
        { id: "futon", label: "The futon", run: async (g) => g.narrate("The stain has dried brown at the edges and black at the center. The chalk outline runs off the futon and across the tatami, and one arm of it doesn't line up with the other, as if the floor had been redrawn.") },
        { id: "floor", label: "The floor where he lay", run: async (g) => g.searchCrack() },
        { id: "closet", label: "Closet", run: async (g) => {
          if (g.done("so1")) return g.narrate("The shelf where the box sat is bare. A rectangle of clean wood.");
          g.sfx("paper_crinkle");
          await g.narrate("Behind the bedding, a cardboard box with 山田 written on the lid. Riku's personal records: tax statements, deeds, insurance policies, old memories, a birth certificate. And under them all, an old book of family history, its binding sewn by hand. Generations of Yamadas, and their involvement with the Folded Hand.");
          g.clue("c_records");
          await g.complete("so1");
          g.addItem("records");
        } },
        { id: "dresser", label: "Dresser", run: async (g) => g.narrate("Two drawers half-pulled, exactly as Nomura described. Riku's shirts, unfolded and crumpled. Folded among them, very neatly, a single paper lily.") },
        { id: "lamp", label: "Floor lamp", run: async (g) => { g.flicker(); await g.narrate("The lamp lies dented where it hit the floor. It flickers. In each flicker the shadow of the futon falls in a slightly different place."); } },
        { id: "exit", label: "Back to the living room", go: "apt2b_living" }
      ]
    },
    apt2b_storage: {
      name: "Apartment 2B · storage", jp: "物置", scene: "apt2b_storage", music: "investigation", ambience: "building", lighting: "normal",
      enter: async (g) => {
        if (g.flag("seen_storage")) return;
        g.set("seen_storage");
        await g.narrate("Barely larger than a closet, crammed with boxes, bags of clothing and unused household items. The floor is uneven and there's barely room to turn around. It smells like mold and dust. Nothing here feels deliberately hidden, just carelessly packed away.");
      },
      hotspots: [
        { id: "seasonals", label: "Box marked \"Seasonals\"", run: async (g) => {
          await g.narrate("An old incense bowl, broken candles and water-damaged prayer paper. The incense bowl is the good kind, heavy bronze, the kind temples use at New Year. There is fresh ash in it.");
          if (g.has("c_incense")) await g.narrate("Naoko smelled temple incense at this door the night after the murder. Nobody here has burned any in years.");
        } },
        { id: "bags", label: "Bags of clothing", run: async (g) => g.narrate("Kaede's winter clothes, packed tight. A child's padded jacket, never worn, tags still on.") },
        { id: "exit", label: "Back to the living room", go: "apt2b_living" }
      ]
    },
    apt2a: {
      name: "Apartment 2A · Daigo's room", jp: "二〇一号室", scene: "apt2a", music: "investigation", ambience: "building", lighting: "normal",
      enter: async (g) => { g.set("in2a"); },
      hotspots: [
        { id: "floor", label: "The same spot on the floor", run: async (g) => {
          if (g.flag("crack2a")) return g.narrate("The crack runs down through the tatami toward the basement. A lily waits beside it, patient.");
          g.set("crack2a");
          await g.narrate("You stand where 2B's seam would fall. Daigo's tatami is split along the same line.");
          g.sfx("lily_chime");
          await g.aloud(M.text.crack2);
          g.clue("c_crack2a");
          g.set("lilyTrail");
        } },
        { id: "boxes", label: "Parcels", run: async (g) => g.narrate("Undelivered parcels stacked by route number. One has slid off the stack and lies against the wall, pressed into the corner.") },
        { id: "cap", label: "Postal cap", run: async (g) => g.narrate("A courier's cap and gloves, still damp from the evening route.") },
        { id: "exit", label: "Back to the hallway", go: "hall2" }
      ]
    },
    basement: {
      name: "Basement", jp: "地下室", scene: "basement", music: "basement", ambience: "boiler", lighting: "shadow",
      enter: async (g) => {
        if (g.flag("seen_basement")) return;
        g.set("seen_basement");
        await g.aloud(M.text.basement);
        g.clue("c_paperhouse");
      },
      hotspots: [
        { id: "paper_house", label: "The paper house", run: async (g) => {
          const c = await g.choose("The paper house glows faintly from inside. It is perfectly dry.", [
            { id: "look", label: "Look inside" }, { id: "enter", label: "Crawl inside" }, { id: "no", label: "Step back" }]);
          if (c === "look") { await g.aloud(M.text.lookInside); }
          if (c === "enter") { await g.goto("paper_guest"); }
        } },
        { id: "boiler", label: "Boiler", run: async (g) => g.narrate("The boiler ticks and groans. Its pressure gauge sits a hair past red, and has for years by the look of the dust on the glass.") },
        { id: "boxes", label: "Maintenance boxes", run: async (g) => {
          await g.narrate("Mops, fuses, a coil of wire. And a mail bin under the chute, with a single coin lying in it, still spinning.");
          if (g.has("c_mailchute")) await g.narrate("It's the coin you dropped.");
        } },
        { id: "leak", label: "The leak", run: async (g) => g.narrate("Water drips from a pipe joint into a shallow puddle. The puddle doesn't reflect the paper house.") },
        { id: "stairs_up", label: "Stairs up", go: "hall1" }
      ]
    },
    paper_guest: {
      name: "The paper house · guest room", jp: "紙の家・客間", scene: "paper_guest", music: "paperhouse", ambience: null, lighting: "shadow", paper: true,
      particles: "lilies",
      enter: async (g) => {
        if (g.flag("seen_paper")) return;
        g.set("seen_paper");
        g.sfx("paper_unfold");
        await g.aloud(M.text.enterHouse);
        await g.narrate("Important: the paper house is made of paper. Anything you mean to tear will tear. Anything you don't mean to break holds your weight.");
      },
      hotspots: [
        { id: "table", label: "Tea table", run: async (g) => g.narrate("Paper cups of paper tea, still steaming paper steam. Four places are set. The cups are folded so finely you can see the rings where lips would touch.") },
        { id: "latch", label: "Latched door", run: async (g) => { g.sfx("door_slide"); await g.narrate("The latch lifts easily from this side."); await g.goto("paper_dojo"); } },
        { id: "exit", label: "Crawl back out", go: "basement" }
      ]
    },
    paper_dojo: {
      name: "The paper dojo", jp: "紙の道場", scene: "paper_dojo", music: "paperhouse", lighting: "shadow", paper: true, particles: "lilies",
      enter: async (g) => {
        if (g.flag("seen_dojo")) return;
        g.set("seen_dojo");
        await g.aloud(M.text.dojo);
      },
      hotspots: [
        { id: "shrine", label: "The shrine", run: async (g) => {
          await g.narrate("勇者を忘れず. Remember those with courage. Two folded lilies rest at its base, fresh-creased. The shrine is the size of the one in the photograph's background.");
          g.clue("c_shrine");
          await g.checkObjectives();
          if (!g.done("po1")) await g.narrate("Whose memorial is this? You need the dojo's history to say what you have found.");
        } },
        { id: "mats", label: "Practice mats", run: async (g) => g.narrate("Footprints in the paper mats, pressed in as if dozens of people trained here an hour ago. They all face the shrine.") },
        { id: "dummies", label: "Training dummies", run: async (g) => g.narrate("Straw makiwara folded from paper. Each one is marked with a brushstroke where a palm would strike: wide, sweeping, more calligraphy than combat.") },
        { id: "to_study", label: "Study behind the shrine", go: "paper_study" },
        { id: "stairs", label: "Stairs up into the apartment", run: async (g) => {
          const c = await g.choose("The stairs climb into a paper replica of the building. Once you go up, the fighting may start.", [
            { id: "up", label: "Climb the stairs" }, { id: "no", label: "Not yet" }]);
          if (c === "up") await g.goto("paper_1f");
        } },
        { id: "exit", label: "Back to the guest room", go: "paper_guest" }
      ]
    },
    paper_study: {
      name: "The paper study", jp: "紙の書斎", scene: "paper_study", music: "paperhouse", lighting: "shadow", paper: true, particles: "lilies",
      hotspots: [
        { id: "desk", label: "Desk of lilies", run: async (g) => g.narrate("Lilies cover the desk, dozens, each folded from a page of something written. You catch fragments of brushwork on the petals: names. Kenta. Shirō. Hajime.") },
        { id: "bedroll", label: "Bedroll", run: async (g) => g.narrate("A futon folded from a single enormous sheet. Someone slept here, a long time ago, and the paper remembers the shape.") },
        { id: "tear", label: "The wall", run: async (g) => g.searchJournal() },
        { id: "exit", label: "Back to the dojo", go: "paper_dojo" }
      ]
    },
    paper_1f: {
      name: "The paper apartment · ground floor", jp: "紙の一階", scene: "paper_hall", music: "paperhouse", lighting: "shadow", paper: true, particles: "lilies",
      enter: async (g) => {
        if (!g.flag("seen_paperapt")) { g.set("seen_paperapt"); await g.aloud(M.text.paperApt); await g.narrate("The door plates read 2A, 2B, 2C, though you only climbed one flight."); }
        await g.encounter("hallA");
      },
      hotspots: [
        { id: "stairs_down", label: "Stairs up", if: (g) => g.flag("hallA_done"), go: "paper_2f" },
        { id: "exit", label: "Back down to the dojo", go: "paper_dojo" }
      ]
    },
    paper_2f: {
      name: "The paper apartment · second floor", jp: "紙の二階", scene: "paper_hall", music: "paperhouse", lighting: "shadow", paper: true, particles: "lilies",
      enter: async (g) => { await g.encounter("hallB"); },
      hotspots: [
        { id: "door_2b", label: "2B", if: (g) => g.flag("hallB_done"), run: async (g) => {
          const c = await g.choose("The paper door of 2B is stained red along its frame, and it breathes. Whatever is behind it will not let you leave once you go in.", [
            { id: "go", label: "Open 2B" }, { id: "no", label: "Not yet" }]);
          if (c === "go") await g.boss();
        } },
        { id: "window", label: "Window", run: async (g) => g.narrate("A child's drawing of the street outside: a lamp, a car, a smiling sun in a night sky.") },
        { id: "exit", label: "Back downstairs", go: "paper_1f" }
      ]
    }
  };

  /* ------------------------------------------------------------------ ENEMIES (module stat blocks) */
  M.enemies = {
    replica: { name: "Paper Replica", type: "Construct", crLabel: "CR 6", cr: 6, weight: 1, sprite: "replica",
      core: { body: 1, mind: 0, spirit: 1 }, health: 18, sanity: 16, stability: 16, attack: 2, er: 10, br: 4, mr: 3, sr: 4, speed: 3, actions: 1,
      mods: ["Familiar Faces", "Fragile Construction", "Disruption Aura"] },
    ghost: { name: "The Paper Ghost", type: "Beyond", crLabel: "Dangerous, CR 14", cr: 14, weight: 3, sprite: "ghost_base", boss: true,
      core: { body: 2, mind: 3, spirit: 3 }, health: 45, sanity: 50, stability: 45, attack: 6, er: 14, br: 9, mr: 12, sr: 12, speed: 4, actions: 2,
      mods: ["Folding Flesh", "Shifting Walls", "Way of the Folded Palm", "Change Shape"] }
  };
  M.modText = {
    "Familiar Faces": "The first time a replica is attacked, every agent rolls Morality vs 7 or takes 5 Sanity and 5 Stability damage.",
    "Fragile Construction": "Any single hit doing more than 10 damage after resistances destroys it.",
    "Disruption Aura": "Agents in the same zone take −2 to all rolls.",
    "Folding Flesh": "Target rolls Morality vs 10 or turns to paper for 1d6 rounds and becomes Fragile.",
    "Shifting Walls": "Every agent rolls Agility vs 10 or is folded into another room, taking 3 Sanity and 3 Stability damage.",
    "Way of the Folded Palm": "Target rolls Willpower vs 8 or is stunned and loses their next turn.",
    "Change Shape": "Swaps two of its stats for a round. Once every 4 rounds."
  };

  /* ------------------------------------------------------------------ ENCOUNTERS
     Zones are rooms; col/row place them on the map. Edges connect them. */
  M.encounters = {
    hallA: {
      name: "Paper hallway, ground floor", scene: "paper_hall", music: "combat",
      intro: "Three paper dolls stand in the hall. One folds and refolds a dish towel. One faces the wall, nodding along to a conversation nobody is having. One leans on a paper cane by the far door. They wear the faces of Naoko Fukuda, Hideki Masuda and Kenjiro Watanabe, painted on in a few brushstrokes.",
      zones: [
        { id: "z1", name: "Stair landing", col: 0, row: 0 },
        { id: "z2", name: "Hall by \"2A\"", col: 1, row: 0 },
        { id: "z3", name: "Hall by \"2B\"", col: 2, row: 0 },
        { id: "z4", name: "Far door", col: 2, row: 1 },
        { id: "z5", name: "Mail chute alcove", col: 1, row: 1 }
      ],
      edges: [["z1", "z2"], ["z2", "z3"], ["z3", "z4"], ["z4", "z5"], ["z5", "z2"]],
      start: "z1",
      foes: [{ t: "replica", as: "naoko", zone: "z2" }, { t: "replica", as: "hideki", zone: "z3" }, { t: "replica", as: "kenjiro", zone: "z4" }],
      sneakCR: 6
    },
    hallB: {
      name: "Paper hallway, second floor", scene: "paper_hall", music: "combat",
      intro: "The second floor. A paper courier leans in the doorway of 2A, mid-laugh, forever. A paper student with circles for glasses pins paper cards to the wall. A small paper woman stands at the window, very still, her face turned toward the door of 2B.",
      zones: [
        { id: "z1", name: "Stairs", col: 0, row: 0 },
        { id: "z2", name: "Hall by 2A", col: 1, row: 0 },
        { id: "z3", name: "Hall by 2C", col: 2, row: 0 },
        { id: "z4", name: "2B door", col: 2, row: 1 },
        { id: "z5", name: "Window", col: 1, row: 1 }
      ],
      edges: [["z1", "z2"], ["z2", "z3"], ["z3", "z4"], ["z2", "z5"], ["z5", "z4"]],
      start: "z1",
      foes: [{ t: "replica", as: "daigo", zone: "z2" }, { t: "replica", as: "chihiro", zone: "z3" }, { t: "replica", as: "ayaka", zone: "z5" }],
      sneakCR: 6
    },
    boss: {
      name: "Paper apartment 2B", scene: "paper_2b", music: "boss", boss: true,
      zones: [
        { id: "z6", name: "Paper 2A", col: 0, row: 0 },
        { id: "z1", name: "2F hallway", col: 1, row: 0 },
        { id: "z7", name: "Paper 2C", col: 2, row: 0 },
        { id: "z3", name: "2B kitchen", col: 0, row: 1, knife: true },
        { id: "z2", name: "2B living room", col: 1, row: 1 },
        { id: "z5", name: "2B storage", col: 2, row: 1 },
        { id: "z4", name: "2B bedroom", col: 1, row: 2, altar: true }
      ],
      edges: [["z1", "z2"], ["z1", "z6"], ["z1", "z7"], ["z2", "z3"], ["z2", "z4"], ["z2", "z5"]],
      start: "z1",
      foes: [{ t: "ghost", zone: "z4" }, { t: "replica", as: "kaede", zone: "z2" }, { t: "replica", as: "nomura", zone: "z2" }]
    }
  };

  (window.ADVENTURES = window.ADVENTURES || {})[M.id] = M;
})();
