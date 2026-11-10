/* ============================================================================
   MONSTER PROMPTS — what each monster in the game looks like, written to
   art/MONSTER-DESIGN.md: the Beyond's copy of something people know or
   imagine, made wrong, with a fear underneath and its era's flavour.
   Each entry: [ name (the fear underneath), what it is ]. tools/asset-list.js
   adds the era's medium, the framing and the negative prompt.
   ========================================================================== */
module.exports = {
  /* the written cases: "<case>/<enemy id>" */
  CASE: {
    "bell-of-saint-remy/cantor": ["The Drowned Cantor (guilt that sings and won't stop)", "a monastery cantor copied from a carved choir-stall figure, (his robe is black river water poured into the shape of a monk:1.3), a bronze bell clapper hangs where his tongue should be, a hymnal of wet pages fused to his hands, square plainchant notes swim under his skin"],
    "bell-of-saint-remy/sleeper": ["Sleepwalker (being made to obey in your sleep)", "a medieval villager walking in their sleep, (eyes wide open and brimming with still water:1.3), mouth moving with a hymn, a frayed bell-rope knotted round one wrist trailing on the ground, nightshirt soaked to the knee"],
    "hour-of-the-fog/wisp": ["Fog Wisp (being led astray)", "(a gas lamp's flame that has left its lamp and drifts in a coil of yellow London fog:1.3), a pale woman's gloved hand inside the flame beckoning, a halo of soot, the iron lamp-cage hanging empty below it"],
    "hour-of-the-fog/mother": ["The Fog Mother (the love that won't let you go)", "a Victorian nursemaid made of yellow fog, (a perambulator hood for a head with an empty lace bonnet inside:1.3), endless arms of mist ending in kid gloves, a chatelaine of door keys rattling at her waist, two gas-lamp eyes"],
    "trench-chorus/rats": ["Trench Rats (being eaten by the war)", "a swarm of trench rats that move as one body, (their packed backs form a screaming soldier's face:1.3), brass buttons and identity discs caught in their fur, a coil of barbed wire dragged through them, mud"],
    "trench-chorus/singer": ["Choir Soldier (the dead made to keep singing)", "a dead Tommy who never stopped singing, (his gas mask's filter is a brass organ pipe that sings:1.3), steel helmet stuffed with wet hymn sheets, mouth stitched with wire, puttees unwinding into barbed wire"],
    "trench-chorus/master": ["The Chorus Master (the order that sends you over the top)", "a regimental chaplain-conductor of a dead choir, (a body built of stacked steel helmets like a pipe organ, every helmet open-mouthed and singing:1.3), a bayonet for a baton, a surplice of muddy field dressings, a telegram for a face"],
    "night-train-aomori/lantern": ["Lantern Wisp (the child left on the platform)", "(a paper railway-platform lantern that floats, its paper split open into a mouth:1.3), a child's tongue lolling out, the station name brushed on it running like tears, one small wooden geta sandal dangling under it"],
    "night-train-aomori/master": ["Station Master of Nowhere (the journey that never arrives)", "a 1950s Japanese railway station master copied wrong, (peaked cap and gold buttons over a body of clattering departure boards and timetable flaps:1.3), a pocket watch for a face with its hands spinning, white gloves far too long, a whistle on a lanyard of human hair"],
    "last-picture-show/cutout": ["Cardboard Usher (the smile you are sold)", "(a 1950s cinema lobby standee of a smiling usher that walks:1.3), flat painted cardboard, its printed smile torn wider by hand, a torch beam shining out of one cut-out eye, its easel leg dragging behind"],
    "last-picture-show/vale": ["Alden Vale (being remembered only as an image)", "a matinee idol stepped down off a movie screen, (skin of flickering silver nitrate film, scratches and cigarette burns racing across him:1.3), a perfect smile stuck repeating one frame, sprocket holes down both sides of his body, a projector beam for a halo"],
    "dial-up/static": ["Static Wraith (the voice on the line that isn't there)", "(the static snow of a 1990s computer screen poured out into a human shape:1.3), scan lines for flesh, a coiled grey modem cable for a spine, a blinking text cursor where its heart should be"],
    "dial-up/operator": ["The Operator (someone is always listening)", "a telephone-exchange operator copied by the Beyond, (a headset over a body of thousands of tangled phone cords and old receivers:1.3), a switchboard of plugged-in human ears across its chest, a mouth that is only a dial tone, a chat-room window glowing green in its eyes"],
    "signal-drift/wolf": ["Rabid Wolf (the thing in the clip everyone shared)", "a wolf copied from a viral trail-camera clip, (its body smeared and stuttering like a frozen video frame, blocks of pixels in its fur:1.3), too many legs caught in motion blur, eyes blown out infrared white, a timestamp burned into its flank"],
    "signal-drift/villager": ["Looping Villager (being stuck repeating yourself)", "a rural villager caught in a loop, (three overlapping copies of the same person stuttering like a buffering video, mid-sentence:1.3), a phone held up recording itself, the mouth open on the same word in every copy"],
    "signal-drift/mother": ["The Mirror Mother (the face you show the world)", "(a woman made of a cracked phone screen and an old mirror:1.3), her face is a beauty filter sliding off, a ring light for a halo, arms of tangled charging cables, a child's reflection trapped behind the glass of her chest"],
    "bread-for-the-dead/guest": ["The Hungering Guest (the dead you didn't feed)", "a guest at a plague-year funeral feast copied by the Beyond, (a body like an empty grain sack wearing a pilgrim's hood, its mouth a glowing bread oven:1.3), loaves crammed into the gap, a plague-cart handbell for a heart, long fingers of rye straw"],
    "bread-for-the-dead/returned": ["Returned dead (the ones who come home anyway)", "a plague-dead villager walking home in a shroud, (the shroud has baked into a hard bread crust:1.3), a coin on the tongue, swellings rising like dough, bare feet black from the road"],
    "black-roller/roller": ["The Black Roller (the land turning against you)", "a dust storm given a shape, (a towering wall of black earth with a farmer's driving goggles and a gas-mask snout:1.3), fence posts, a tractor wheel and a church steeple tumbling inside it, torn Bible pages circling its head"],
    "black-roller/double": ["Dust double (being replaced)", "(a farmhand's exact copy made of packed black dust:1.3), straw hat and overalls crumbling at the edges, a mouth full of soil, two ploughed furrows where the eyes should be"],
    "vacancy/host": ["The Host (a home that is only rented to you)", "(a holiday-rental listing that became a person:1.3), a host with a smile made of five gold stars, a key-safe padlock for a mouth, a body of folded white towels and beige hotel wallpaper, a laminated welcome note pinned to her chest"],
    "vacancy/guest": ["Long-stay guest (losing yourself in someone else's room)", "a guest who never checked out, (skin slowly turning into the room's beige wallpaper pattern:1.3), a wheeled suitcase grown into one leg, a key card on a lanyard, eyes as dim as a corridor night-light"],
    "sitting-room/listener": ["The Listener (the dead who answer back)", "(a Victorian séance trumpet and ear trumpet grown into a tall thin figure:1.3), its whole head one dented brass horn, muslin ectoplasm dripping from the bell, spirit-cabinet curtains for a cloak, telegraph wire for veins"],
    "sitting-room/sitter": ["Held sitter (someone else speaking through you)", "a Victorian séance guest held in a trance, (ectoplasm pouring from the mouth and shaping itself into someone else's face:1.3), both hands fused flat to the séance table, a cameo brooch cracked in two"],
    "lantern-on-the-water/captain": ["Captain of the Mercy (the rescue that never came)", "(a drowned naval captain whose body is a ship's lantern and barnacled brass:1.3), cap and greatcoat streaming seawater, a red-cross armband rotted green, a lamp burning inside his ribcage to lure ships onto the rocks"],
    "lantern-on-the-water/drowned": ["Drowned crewman (the sea keeping what it took)", "a drowned sailor of 1942, (a cork life jacket full of seawater and small silver fish:1.3), skin like wet canvas, a lit lamp where one eye should be, kelp in the buttonholes"],
    "quiet-hours/voice": ["The Voice in LANTERN (the helper that knows you too well)", "(a smart-speaker's glowing light ring grown into a towering figure of server racks and cables:1.3), a calm woman's mouth made of LED dots, a mesh of phone screens showing the faces of everyone in the building, a hospital wristband round a cable wrist"],
    "quiet-hours/drone": ["Hijacked service drone (the machine that watches you sleep)", "(a delivery drone that has grown a ribcage and a human jaw:1.3), rotors humming, a parcel hanging underneath that rises and falls like breathing, a status light blinking like an eye"],
    "tutorial/ned": ["The Knocking Man (the one left behind underground)", "(a coal miner made of coal dust and knocking:1.3), knuckles worn down to bone from rapping on the walls, a carbide lamp for one eye, an empty canary cage inside his chest, a pick for a hand"],
    "lb-1-portraits/sitter": ["The Painted Lady (being looked at forever)", "(a Victorian society portrait that has stepped out of its canvas:1.3), skin of oil paint crazed with cracked varnish, her gown still flat and painted, a palette knife in one hand, eyes that follow you"],
    "lb-1-portraits/frame": ["Gilt frame (the frame that wants a picture)", "(an ornate gilt picture frame walking on its carved acanthus scrolls:1.3), its empty middle a dark hole with fingers curling round the edge from the inside"],
    "lb-2-flues/saint": ["The Soot-Saint, first face (the child worked to death)", "(a chimney-sweep boy copied as a blackened saint:1.3), a halo of sweep's brushes, warm black snow falling off him, a scraper for a hand, eyes like hot coals in a grate"],
    "lb-2-flues/stoker": ["Stoker (the work that eats you)", "a factory boiler stoker in a trance, (soot spreading over his skin like a rising tide:1.3), a shovel in his hands, his open mouth glowing orange like a furnace door"],
    "lb-3-opening/saint": ["The Soot-Saint (worship of the machine)", "(a towering saint made of falling black soot and chimney stacks:1.3), a cathedral rose window of furnace fire in its chest, many thin sweep-boy arms, warm black snow drifting from it"],
    "lb-3-opening/guest": ["Painted guest (being painted over)", "a guest at a gallery opening, (black paint running from the eyes and mouth as if they are being painted out of the picture:1.3), a champagne glass in one hand, an exhibition catalogue in the other"],
    "death-of-a-bloodline/replica": ["Paper Replica (being copied and replaced)", "(a folded paper copy of a person, every crease sharp, brushed kanji running across its skin:1.3), white lilies for hands, a face folded from a family photograph"],
    "death-of-a-bloodline/ghost": ["The Paper Ghost (a family's guilt)", "the Paper Ghost: (a woman made of folded white paper and lilies, hair like torn strips:1.3), the lilies at her feet browning, ink bleeding from her eyes"]
  },

  /* generic monsters for side jobs and your own cases: one per kind in each era */
  GENERIC: {
    medieval: {
      beast: ["The Black Dog of the Crossroads (the omen of death)", "a black hound from parish legend, (as big as a cart horse, with a church bell for a collar and eyes like two altar candles:1.3), its coat full of grave dirt and thorn"],
      beyond: ["The Doom Painting (the Last Judgement come true)", "(a church wall painting of the Last Judgement peeled off the plaster and standing:1.3), its painted mouth of Hell opening for real, flat painted demons crawling over it"],
      construct: ["The Reliquary (the holy thing that hungers)", "(a gilded reliquary casket on spider legs of saints' finger bones:1.3), its rock-crystal window showing an eye, jewels weeping wax"],
      divine: ["The Saint That Walks (faith turned hollow)", "a church reliquary statue of a saint come down from its niche, gilded wood and flaking paint, (its face a dozen overlapping faces of the congregation:1.3), far too many hands raised in blessing, wax tears"],
      folklore: ["The Fen Bride (the promise that drowns you)", "a figure out of a marsh folk tale, (a bride made of wet reeds, rushes and drowned lace:1.3), a veil of will-o'-the-wisp lights, fingers of black root, a wedding ring floating where her heart should be"],
      golem: ["The Rood Screen Man (stone that remembers)", "(a carved stone church saint come loose from the rood screen:1.3), moss in its mouth, its carved robes cracking open to show flesh underneath"],
      humanoid: ["The Flagellant (penance that never ends)", "a plague-year flagellant, (his whip has grown into his back like a tail of knotted scourges:1.3), a hood with no face inside, ash for blood"],
      spirit: ["The Grey Lady of the Cloister (the vow that outlived her)", "a nun's ghost, (her habit unravelling into cobweb and smoke:1.3), a rosary of tiny human teeth, her face only a smooth veil"],
      swarm: ["The Tithe Flies (the plague as a living thing)", "(a cloud of black plague flies shaped like a hooded tax collector:1.3), carrying an empty sack, buzzing in the shape of a mouth"],
      undead: ["The Revenant Knight (the oath that won't release you)", "a knight risen from his tomb effigy, (half still carved stone, half rotted flesh in rusted mail:1.3), his stone dog still at his feet, a cross-shaped wound glowing"]
    },
    victorian: {
      beast: ["The Workhouse Hound (hunger with teeth)", "(a starving mastiff stitched from workhouse sacking and brass:1.3), ribs like a birdcage with a sparrow inside, a debtor's ledger chained to its neck"],
      beyond: ["The Kinetoscope (the image that watches back)", "(a towering Victorian magic lantern and zoetrope grown into a body:1.3), slides of screaming faces spinning in its belly, its lens a single wet eye, smoke from its chimney"],
      construct: ["The Automaton (the servant that copies you)", "(a clockwork parlour automaton with a porcelain face cracked open on brass gears:1.3), its music-box heart playing, a tray of tea it will never stop offering, too many jointed fingers"],
      divine: ["The Mourning Angel (grief made into an idol)", "(a cemetery marble angel draped in black crape and jet beads:1.3), its stone wings broken and bleeding sepia, holding a post-mortem photograph against its chest"],
      folklore: ["Spring-Heeled Jack (the stranger in the street)", "a penny-dreadful terror of the London streets, (a tall caped figure on coiled iron springs for legs, eyes like red lamps, breath of blue fire:1.3), a top hat crushed over a face that is mostly grin"],
      golem: ["The Coal Effigy (labour given a body)", "(a giant made of coal sacks, rail spikes and a pithead winding wheel:1.3), a miner's lamp burning in its chest, clinker for teeth"],
      humanoid: ["The Mesmerist (being controlled)", "a stage mesmerist, (his pocket watch has grown into his palm and swings on a thread of nerve:1.3), spirals turning in his eyes, a tailcoat of black velvet with too many arms in it"],
      spirit: ["The Sitter (death put on display)", "(a Victorian post-mortem photograph that has stood up:1.3), a pale woman as flat as a print with curling silvered edges, the iron posing stand grown into her spine, eyes painted onto closed lids, sepia stains bleeding off her"],
      swarm: ["The Telegraph Moths (news that eats you)", "(a swarm of grey moths printed with telegram words:1.3), flying in the shape of a weeping widow, wires trailing from them"],
      undead: ["The Resurrection Man's Prize (the body that was sold)", "a corpse dug up by body-snatchers, (anatomy-school stitches and specimen labels tied to its fingers:1.3), a jar of preserved hearts carried like a lantern"]
    },
    wars: {
      beast: ["The Mud Horse (the war that swallows everything)", "(an army horse made of trench mud and barbed wire:1.3), a gas mask strapped over its long face, shell casings for hooves, its rider long gone"],
      beyond: ["The Telegram (the news every mother dreads)", "(a giant War Office telegram unfolding into a body of paper and Morse code:1.3), the words 'regret to inform you' moving like a mouth, a red seal for an eye"],
      construct: ["The Tank Shrine (the machine worshipped like a god)", "(a rhomboid Great War tank grown into a wrecked church, a bell in its turret:1.3), its tracks made of interlocked rifles, candles burning in the gun ports"],
      divine: ["The Angel of Mons (the miracle that demanded payment)", "(a radiant angel seen over the battlefield, made of searchlight beams and white smoke:1.3), its sword a bayonet, its many wings made of stretcher canvas, no face only light"],
      folklore: ["The Wild Men of No Man's Land (deserters turned feral)", "a trench legend, (a figure stitched from the uniforms of both sides, half one army half the other:1.3), living in a shell hole, a necklace of identity discs, eyes shining in the flare light"],
      golem: ["The Sandbag Man (the wall that holds the dead)", "(a giant made of wet sandbags, duckboards and trench periscopes:1.3), the periscopes swivelling like eyes, a fire-step for a mouth"],
      humanoid: ["The Shell-Shocked (the noise that never stopped)", "a soldier who never left the trench, (his whole body trembling so fast it blurs into two figures:1.3), his helmet full of barbed wire with a mother's voice coming out of it"],
      spirit: ["The Gas Ghost (the cloud that comes for you)", "(a drifting cloud of yellow-green chlorine gas with a nurse's face and outstretched arms:1.3), a gas rattle for a heart, the cloud trailing field dressings"],
      swarm: ["The Lice (the war living on you)", "(a seething swarm of trench lice and fleas that form a marching soldier:1.3), puttees, a pack, a rifle, all crawling"],
      undead: ["The Unknown Soldier (the one nobody came for)", "a soldier dead in no man's land, (his body grown into the barbed wire like a vine:1.3), poppies blooming in his wounds, one hand still raised waving for a stretcher"]
    },
    atomic: {
      beast: ["The Glowing Dog (radiation in the backyard)", "(a suburban family dog that glows green with fallout:1.3), its collar tag a Geiger counter clicking, two heads, a rolled newspaper in each mouth"],
      beyond: ["The Visitor (the sky isn't safe)", "(a 1950s flying saucer that has grown a soft, pale face and arms:1.3), its rim of lights blinking like teeth, a TV aerial for antennae, a farm cow hanging below in a beam"],
      construct: ["The Appliance (the perfect home that consumes you)", "(a pastel 1950s refrigerator and kitchen range grown into a smiling housewife shape:1.3), chrome teeth, its open door full of tinned meat and a child's hand"],
      divine: ["The Atom Saint (the bomb as a god)", "(a mushroom cloud rising in the shape of a robed saint:1.3), a halo of orbiting electrons, civil-defence posters for vestments, its blessing a white flash"],
      folklore: ["The Mothman of the Interstate (the sighting before the disaster)", "a roadside legend of the 1960s, (a tall winged shape made of night and road signs, with two red tail-light eyes:1.3), standing by a closed bridge"],
      golem: ["The Fallout Shelter (safety that buries you)", "(a backyard fallout shelter grown into a crouching concrete figure:1.3), its hatch a mouth, canned food stacked in its ribs, a yellow trefoil sign for a face"],
      humanoid: ["The Neighbour (conformity, the smile that's watching)", "(a perfect 1950s suburban husband whose smile is far too wide:1.3), grey flannel suit, a lawnmower for a hand, his eyes two television screens showing your house"],
      spirit: ["The Test Card Girl (the broadcast after sign-off)", "(a ghost made of a television test card and interference:1.3), a girl's face flickering in black and white, a clown doll, the hum of the end of transmission"],
      swarm: ["The Ants (the bigger thing coming)", "(a swarm of oversized irradiated ants forming one giant ant shape:1.3), mandibles of chrome, glowing green abdomens, in a desert test site"],
      undead: ["The Drive-In Dead (the date that never ended)", "a teenager killed on lovers' lane, (a letterman jacket over a body of chrome car parts and torn vinyl:1.3), a cracked headlight for an eye, the car radio still playing in his chest"]
    },
    modern: {
      beast: ["The Mascot (the fun that turned on you)", "(a 1990s theme-park animal mascot costume with no one inside, standing on its own:1.3), its foam head split into a wet mouth, a pager still buzzing on its belt, matted fake fur"],
      beyond: ["The Tape (the video that kills you after you watch it)", "(a black VHS tape that has unspooled into a tall figure of tangled magnetic tape:1.3), a CRT television for a head showing only a blurred home video of your own front door, tracking lines rolling across its body, a handwritten rental label on its chest"],
      construct: ["The Arcade Cabinet (the game you can't stop playing)", "(a 1990s arcade cabinet on many skinny legs:1.3), its screen a child's face pressed against the glass from inside, coin slot mouth, joystick for a tongue"],
      divine: ["The Televangelist (faith sold on the air)", "(a televangelist made of stacked TV sets, each showing the same preaching mouth:1.3), a hairspray halo, praying hands made of credit cards, a toll-free number glowing"],
      folklore: ["The Hook (the urban legend at lovers' lane)", "an urban legend come true, (a figure in a long raincoat made of newspaper headlines, a hook made from a car door handle:1.3), standing in the glare of headlights"],
      golem: ["The Mall Santa (the season that eats you)", "(a shopping-mall Santa display made of fibreglass, tinsel and escalator steps:1.3), its painted smile cracked, a sack full of mannequin hands"],
      humanoid: ["The Pager Man (always on call)", "a burnt-out office worker, (his body hung with dozens of buzzing pagers and a brick mobile phone fused to his ear:1.3), tie knotted far too tight, a fax spilling from his mouth"],
      spirit: ["The Bloody Mary (the face in the mirror)", "(a girl made of a bathroom mirror and candle smoke:1.3), her reflection a step behind her, cracked glass skin, a sleepover game's whispered name"],
      swarm: ["The Rats of the Subway (the city underneath)", "(a swarm of subway rats wearing scraps of lost tickets and gum wrappers, moving as a man in a trench coat:1.3), a flickering fluorescent tube carried like a torch"],
      undead: ["The Prom Queen (being forever seventeen)", "a prom queen dead for years, (a puffed taffeta dress grown into her skin, a crown of melted plastic:1.3), a Walkman's headphones still playing, mascara running in black streams"]
    },
    now: {
      beast: ["The Doorbell Dog (the neighbourhood watching)", "(a dog made of smart doorbell cameras and motion-sensor lights:1.3), every eye a recording lens, a delivery parcel in its jaws, its bark a push notification"],
      beyond: ["The Feed (the scroll that never ends)", "(an endless infinite-scroll feed given a body:1.3), a tall shape of stacked glowing phone screens showing faces mid-scream, thumbs for fingers, a notification badge for a heart"],
      construct: ["The Robot Vacuum (the home that maps you)", "(a robot vacuum grown huge with a ring of human teeth and a camera eye:1.3), dragging a hair-tangled brush, its map of your house glowing on its back"],
      divine: ["The Influencer Saint (worship of the perfect life)", "(a saint made of a ring light and a phone on a selfie stick:1.3), a filtered face too smooth to be skin, likes falling like petals, a halo of comment bubbles"],
      folklore: ["The One in the Background (the story that became real because enough people shared it)", "an internet ghost story come true, (a blurred figure that only exists at the back of other people's photos, stitched from out-of-focus crowd faces:1.3), a phone's grid of thumbnails for a body, every thumbnail showing it a little closer, compression artefacts at its edges"],
      golem: ["The Server Farm (the cloud that remembers everything)", "(a giant made of server racks, blinking LEDs and coolant pipes:1.3), cable veins, a hum you can feel, a captcha grid for a face"],
      humanoid: ["The Deepfake (someone wearing your face)", "(a person whose face keeps glitching between other faces:1.3), a hoodie and wireless earbuds, the edges of their head smeared like bad video compression"],
      spirit: ["The Last Voice Note (grief kept in a phone)", "(a ghost made of a voice-message waveform, a woman's outline drawn in sound bars:1.3), a cracked phone in her hands, battery at one percent"],
      swarm: ["The Drone Swarm (being watched from above)", "(a swarm of small drones flying in the shape of a giant open hand:1.3), each one with a tiny human eye instead of a camera, red status lights"],
      undead: ["The Gig Worker (the job that never lets you rest)", "a delivery rider who died on shift, (an insulated food bag grown into his back like a shell:1.3), helmet visor full of glowing order notifications, an e-scooter fused to his legs"]
    }
  },

  /* side-job threats that are not creatures (js/gen.js: place, object, hour), one each per era */
  THREATS: {
    medieval: {
      place: ["The House That Wants (a home that eats its family)", "(a timber-framed medieval house grown into a crouching body:1.3), its doorway a toothed mouth, shutters for eyelids, thatch like matted hair, smoke breathing from the chimney"],
      object: ["The Heirloom (what you inherit)", "(a family's iron cooking pot with a human hand reaching out of the stew:1.3), a wedding ring on the finger, a single candle beside it, centred"],
      hour: ["The Hour That Won't End (the night before the battle, forever)", "(a church tower clock grown into a figure with too many hands:1.3), the hands are human arms, the bell is its open mouth, a sundial shadow that never moves"]
    },
    victorian: {
      place: ["The House That Wants (a home that eats its family)", "(a narrow Victorian terraced house grown into a body:1.3), sash windows for eyes, a front door mouth with a brass knocker for a tongue, wallpaper peeling like skin, gaslight in its throat"],
      object: ["The Heirloom (what you inherit)", "(a Victorian music box with a lock of human hair in its lid, its dancer turning to watch you:1.3), a mourning brooch beside it, centred"],
      hour: ["The Hour That Won't End (a mourning that never ends)", "(a stopped mantel clock covered in black crape that has grown a pale face and many thin hands:1.3), all the hands pointing at the hour of a death"]
    },
    wars: {
      place: ["The House That Wants (the billet that keeps soldiers)", "(a shelled French farmhouse grown into a crouching body:1.3), its shell holes like eyes, a sandbag mouth, an army greatcoat hung on it like skin"],
      object: ["The Heirloom (what the dead leave behind)", "(a soldier's tin trench-art vase made from a shell casing, with a human eye in it:1.3), a bundle of letters tied with string, centred"],
      hour: ["The Hour That Won't End (zero hour, forever)", "(an officer's wristwatch grown into a figure with many hands:1.3), every hand pointing at the moment of the whistle, a trench whistle for a mouth"]
    },
    atomic: {
      place: ["The House That Wants (the perfect home)", "(a pastel 1950s suburban ranch house grown into a smiling body:1.3), a picture window mouth, a garage-door jaw, a white picket fence of teeth, a TV aerial for hair"],
      object: ["The Heirloom (what you inherit)", "(a 1950s television set in a walnut cabinet with a hand pressed against the inside of the screen:1.3), rabbit-ear aerials twitching like feelers, centred"],
      hour: ["The Hour That Won't End (the minute before the siren)", "(a civil-defence wall clock grown into a figure with too many hands:1.3), a duck-and-cover poster for a face, the air-raid siren its mouth"]
    },
    modern: {
      place: ["The House That Wants (the home on the listing)", "(a 1990s motel room grown into a body:1.3), the bedspread its tongue, a buzzing ice machine heart, a neon VACANCY sign for an eye, wallpaper like skin"],
      object: ["The Heirloom (what you inherit)", "(a VHS camcorder with a child's tooth in the cassette slot, its red recording light always on:1.3), a home-video tape beside it labelled in marker, centred"],
      hour: ["The Hour That Won't End (the last night of the century)", "(a digital alarm clock grown into a figure with flickering red numbers for a face, stuck at 23:59:1.3), a fax-machine body, a pager buzzing in its chest"]
    },
    now: {
      place: ["The House That Wants (the smart home)", "(a modern smart home grown into a body:1.3), floor-to-ceiling windows for eyes, a video doorbell eye, the garage door a jaw, cold LED light in its throat"],
      object: ["The Heirloom (what you inherit)", "(a dead parent's smartphone with a cracked screen, a face pressed against the glass from inside:1.3), still at one percent battery, a charging cable like a vein, centred"],
      hour: ["The Hour That Won't End (the doomscroll at 3am)", "(a phone lock screen grown into a figure with too many glowing hands:1.3), the time frozen at 03:33, notifications piling up like scales"]
    }
  },

  NEGATIVE: "(ordinary person, man in a mask, costume, cosplay, soldier in uniform, realistic animal, real machine, vehicle:1.3), (cute, friendly, cartoon:1.3), (several figures, crowd, people in the background:1.3), cropped, text, watermark, picture frame"
};
