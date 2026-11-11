/* v6 PLACES, part B (cases from the 1980s on, and the three campaign arcs, and the regions beyond Europe). Same format as part A. */
module.exports = {
  LOCALE: {
    "dial-up": { where: "Rotterdam, the Netherlands, 1999", era: ["a beige desktop PC tower with a CRT monitor", "a 56k external modem with blinking lights", "a grey push-button phone", "a floppy disk box"], local: ["red brick rowhouses", "a bicycle against a wall", "a canal", "a double-glazed window"] },
    "quiet-hours": { where: "Chengdu, Sichuan, China, 2026", era: ["a smart speaker with an amber ring", "a wall-mounted touch panel", "a glass lift with a screen", "a rack-mounted server"], local: ["a living wall of plants", "a glass tower", "a bamboo screen", "a stone lion"] },
    "vacancy": { where: "the Old Town of Edinburgh, Scotland, 2016", era: ["a smartphone on a table", "a wireless router with green lights", "a keysafe on a wall", "a laptop with a booking page"], local: ["black sandstone tenements", "a steep cobbled close", "a chimney pot", "a wet slate roof"] },
    "counting-stair": { where: "the village of Vaikunthpur in Rajasthan, India, 1603", era: ["a brass oil lamp", "a carved sandstone pillar", "a clay water pot", "a saffron flag on a pole"], local: ["ochre mud-brick walls", "a stepwell", "marigold garlands", "dry scrub"] },
    "salt-road": { where: "Ain al-Milh, a salt-road oasis in the Sahara, 1270", era: ["a camel saddle with a leather water-skin", "a woven goat-hair tent", "a brass scale with one pan", "a clay oil lamp"], local: ["white salt crust", "a single date palm", "wind-carved dunes", "mud-brick walls"] },
    "last-servo": { where: "a roadhouse on the Eyre Highway across the Nullarbor Plain, Australia, 1983", era: ["a Holden Kingswood sedan", "a manual petrol bowser", "a formica table", "a wall-mounted analogue clock"], local: ["red dirt", "saltbush", "a corrugated-iron roof", "a straight bitumen road"] },
    "white-shoes": { where: "São Gabriel, a river village on the Rio Negro in Brazil, 1927", era: ["a hurricane lamp", "a gramophone with a horn", "a wooden dugout canoe", "a straw hat"], local: ["palm-thatch stilt houses", "black river water", "drowned forest", "a plank landing"] },
    "da-1-channel": { where: "Lorain, Ohio, USA, 1994", era: ["a wood-grain television with a cable box on top", "a VHS tape in a rental case", "a corded wall telephone", "a console TV"], local: ["vinyl siding", "a storm door", "a Lake Erie sky", "a strip mall sign"] },
    "da-2-rewind": { where: "Pahrump, Nevada, USA, 1995", era: ["a wall of VHS duplicating decks", "a shrink-wrapped tape stack", "a motel key on a plastic tag", "a pickup truck"], local: ["red desert", "a steel barn", "a flat-roofed motel", "creosote bushes"] },
    "da-3-signoff": { where: "Lorain County, Ohio, USA, New Year's Eve 1996", era: ["a TV transmitter tower with red lights", "a ham radio set with dials", "a wood-panelled hotel lobby", "a police scanner"], local: ["snow", "a bare ridge road", "pine trees", "a hotel sign shape"] },
    "lb-1-portraits": { where: "Chelsea, London, England, 1889", era: ["a gas bracket with a glass shade", "an artist's easel", "a mahogany doctor's cabinet", "a velvet drawing-room chair"], local: ["red London brick", "Cheyne Walk", "a plane tree", "a Thames fog"] },
    "lb-2-flues": { where: "Ancoats, Manchester, England, 1890", era: ["a rendering works chimney", "a sweep's brush", "a boiler with riveted plates", "a workhouse bench"], local: ["soot-black brick", "a canal", "terraced houses", "a mill"] },
    "lb-3-opening": { where: "Bloomsbury, London, England, 1891", era: ["a gas street lamp", "a private view gallery with framed canvases", "a gasholder", "a hansom cab"], local: ["Georgian terraces", "iron railings", "a London fog", "plane trees"] },
    "pr-1-bones": { where: "the pilgrims' hospice at Roncesvalles in the Pyrenees, Spain and France, 1321", era: ["a pilgrim's scallop shell", "a rushlight", "an iron-bound chest", "a woollen pilgrim's cloak"], local: ["grey stone", "snow", "beech woods", "a mountain pass"] },
    "pr-2-quarry": { where: "Burgos in Castile, Spain, 1322, beside a half-built Gothic cathedral", era: ["a wooden crane with a treadwheel", "a mason's plumb line", "a pilgrim's staff", "a tallow candle"], local: ["pale limestone", "wheat fields", "red tiled roofs", "a stone quarry"] },
    "pr-3-finisterre": { where: "Finisterre on the Galician coast of Spain, 1323", era: ["a stone granary on stilts", "a pilgrim's staff", "a fishing net of hemp", "a bronze church bell"], local: ["grey granite", "Atlantic surf", "heather", "sea fog"] }
  },
  PLACE: {
    "dial-up": {
      room: "a student's bedsit with a CRT monitor and a blinking modem | a hand-drawn map on the wall with red pins; a plate of cold chips; a rolled duvet",
      bedroom: "a teenager's bedroom with a computer in a corner | a lava lamp; band posters; a bed with a rumpled quilt; a beige tower",
      jansen: "a tidy living room of a retired engineer | a scale model of a telephone exchange built from matchsticks on a table; a cardigan on a chair",
      dewit: "a small immaculate care-home sitting room | a standard-issue black telephone on a side table; doilies; an armchair",
      exchange: "a concrete multi-storey car park at night with a steel door in the basement wall | rain on the ramp; a security light; painted bay numbers",
      board_room: "a dim room with an old manual telephone switchboard | brass jacks; green baize; a headset on a hook; cable runs overhead",
      line: "a vast dark space with a switchboard of a thousand jacks | cords hanging; tiny lamps; a single chair at the centre",
      end: "a Rotterdam street in the morning after rain | a tram stop; a bicycle; a lit window",
      "fight:board": "a switchboard room | a stair, cable runs and the board"
    },
    "quiet-hours": {
      lobby: "the lobby of a glass skyscraper with a living wall | a smart-lobby panel with an amber ring; jasmine in planters; a glass lift",
      deng: "a neat apartment living room | a photograph of a man in a straw hat on every surface; a smart speaker glowing amber on the table; a quilted armchair",
      liwei: "a glass-walled engineers' office | a cold half-eaten dumpling box; a locked drawer; a window over server racks",
      xiao: "a concrete maintenance stairwell | a laptop covered in stickers on a landing; coiled cables; a handrail",
      quiet: "a server room with rows of rack servers in the dark | amber lights; a cold aisle; a floor grille",
      end: "a glass skyscraper lobby in morning sun | a living wall; an empty reception desk; a lift door",
      "fight:server": "a server room | a door, rows of racks and the core"
    },
    "vacancy": {
      street: "a steep cobbled close in Edinburgh's Old Town in rain | a black sandstone tenement with three bells; overflowing bins",
      platform: "an open-plan tech office with beanbags and a table football | a wall of screens; a glass meeting room",
      dougie: "a dim pub interior on a cold day | a gas fire; a pint on a table; a window onto the Grassmarket; a dark wood bar",
      library: "a hushed library reading room with high windows | old maps in glass cases; bound volumes; a long oak table",
      landing: "a bare tenement stairwell with a timer bulb | a row of overflowing bins; a grey door with a faded number",
      flat4: "a cosy old-fashioned room with a bed, a table and one very large window | a lamp; a doily; a ledger on the table",
      end: "an Edinburgh close on a wet Sunday morning | a tenement door; a dropped suitcase; wet cobbles",
      "fight:flat4": "a cosy old-fashioned flat | a door, a sitting room and a table"
    },
    "counting-stair": {
      village: "an ochre mud-brick Rajasthani village square | a great square stepwell pit with flights of steps going down; a whitewashed tally-wall",
      shrine: "a small shrine at the mouth of a stepwell | hanging marigolds; brass bells; clay lamps in a long row",
      meera: "a long low stone house with a stonecutter's yard | chisels hung on the wall; brass measuring rods on a table; sandstone blocks",
      boy: "a mud-brick schoolroom with a thatched roof | a slate; a single bench; a stick drawing on the earth floor",
      stair: "a carved stepwell with flights of stone steps going down to green water | pillared landings; wet stone; a tiny inscription on a wall",
      end: "a stepwell at dawn with water at the bottom | marigolds; a wall painted over; an empty courtyard",
      "fight:landing": "the lowest landing of a stepwell | the upper stair, a middle landing and the lowest landing"
    },
    "salt-road": {
      camp: "a ring of low black goat-hair tents round a well in a bowl of white sand at dusk | nineteen pale salt pillars standing round the well",
      palm: "a single old date-palm leaning over a well | a squat idol of salt holding scales with one pan; a well-curb",
      inn: "a low mud-brick desert inn with a veranda of palm trunks | a table; a ledger; coin scales; a lamp",
      qadi: "a prayer-mat and a chair under a palm tree | a tea pot gone cold; a ledger; a white robe on the chair",
      boy: "a small brown tent with a stack of goatskins | a ladle; a water jar; a donkey",
      midnight: "a well under a palm at night with white pillars round it | thick stars; a salt idol; shifting sand",
      end: "a desert well at sunrise with caravan camels drinking | a palm; white salt flats; skins being filled",
      "fight:well": "an oasis well at night | the camp, the pillars and the palm"
    },
    "last-servo": {
      madura: "a corrugated-iron outback roadhouse with a single bowser | a police Land Rover; a long straight highway; red dirt",
      clinic: "a one-room outback clinic with a single bed | a window onto a flat red horizon; a medicine cabinet; a chair",
      ray: "a tin hut on the edge of an escarpment | a Land Cruiser; a kettle on a fire; scrub",
      highway: "a straight outback highway at dusk with a faint light on the horizon | red dust; saltbush; a distant white roadhouse",
      servo: "a 1980s roadhouse diner interior | formica tables; a wall clock stuck at one time; four petrol pumps seen through the window",
      finale: "a 1980s roadhouse diner interior | a counter; an apron folded on it; a wall clock; four pumps outside",
      end: "a bare patch of red ground at dawn with a rusted petrol pump on its side | a few old bricks; saltbush; a straight road",
      "fight:servo": "a roadhouse | a forecourt, a dining room and a counter"
    },
    "white-shoes": {
      village: "a village of palm-thatch stilt houses on a black river bank | a plank jetty; a lantern on a pole; a jungle wall behind",
      rita: "a small stilt house interior with a hammock | a clay pipe; a wooden stool; an old cigar box; a shuttered window",
      bank: "a slope of grey clay running down to a black river | a crooked wooden landing; eleven pairs of shoes in a row",
      ze: "a dugout canoe drawn up on a river bank | a net spread to dry; a straw hat; a clay pot",
      luzia: "a small clean stilt house interior | a mirror turned to face the wall; a half-sewn red dress; a flower in a jar",
      dance: "a long palm-thatch dance hall with a plank floor | oil lamps; a band's platform; benches along the walls",
      end: "a river landing at morning with shoes set in a row | a plank jetty; a canoe; black water",
      "fight:landing": "a river landing | the path, the landing and the water's edge"
    },
    "da-1-channel": {
      pruitt: "a 1990s suburban living room | a wood-grain TV with a cable box on top; a VHS tape in the player; a corded phone",
      vault: "a video rental shop interior | wall racks of VHS tapes; a counter; a Nintendo poster shape; a bell-door",
      june: "a widow's kitchen in a 1990s Ohio house | a shoebox on the table; a rotary clock; a percolator",
      studio: "a derelict low-power television studio | a dead camera on a tripod; a plywood set with a desk and a chair; a rack of old gear",
      cable: "a windowless cable company head-end room | racks of humming equipment; banks of monitors; a coloured-pin map of a county",
      "fight:studio": "a derelict television studio | a hallway, the set and the transmitter room"
    },
    "da-2-rewind": {
      post: "a small desert-town post office | a counter with brass boxes; a rack of mailers; a flag; a letter scale",
      motel: "a one-storey desert motel office and rooms | a key rack with plastic tags; a vending machine; a flickering sign shape",
      office: "a steel dubbing barn exterior in the desert with a trailer office | a pickup truck; a satellite dish; a gravel lot",
      barn: "the interior of a long steel barn with racks of video decks | blinking lights; stacked tapes; a locked cage at the back",
      "fight:barn": "a duplication barn | the door, the racks and the cage"
    },
    "da-3-signoff": {
      hotel: "a 1990s hotel lobby | wood panelling; a front desk; a sofa; a police scanner on a desk",
      june: "a widow's kitchen in a 1990s Ohio house | a shoebox on the table; a rotary clock; a percolator",
      road: "a snowy ridge road at night | a line of small bare footprints in the snow; bare trees; a distant red tower light",
      tower: "the foot of a snow-covered television transmitter tower | a steel lattice rising; a small control building; red warning lights",
      shack: "a cramped wooden radio shack | racks of old radios; a logbook; a headset on a hook; a coffee mug",
      "fight:tower": "a hilltop transmitter site in snow | a road, a gate and the tower"
    },
    "lb-1-portraits": {
      surgery: "a Victorian doctor's surgery | a mahogany cabinet of bottles; a desk lamp; a patient's chart; a leather couch",
      vere: "a drawing room in a Victorian house with a large portrait over the fireplace | a dim gas lamp; a velvet chair; a sheeted mirror",
      studio: "a painter's Victorian studio with a tall north window | an easel; a palette with a streak of black; jars of brushes; canvases against the wall",
      gallery: "a long gallery behind a studio hung with dark portraits | gilt frames; a bare plank floor; a single candle",
      southwark: "a Victorian colourman's shop with jars of coloured powder in the window | a shelf of plain black tins; a ledger; a counter",
      "fight:gallery": "a portrait gallery | a doorway, the floor and the far wall of frames"
    },
    "lb-2-flues": {
      hennessy: "a Victorian lodging-house kitchen | a range; a long table; a row of small sooty boots by the fire",
      yard: "the yard of a rendering works beside a canal | a tall brick chimney; coal heaps; a boiler house; black soot on everything",
      flues: "the inside of a huge brick chimney flue | iron rungs; soot-black walls; shafts of light from a grate",
      office: "a works office with a high clerk's desk | a ledger; a gas lamp; a coat rack; a window onto the yard",
      furnace: "a furnace room with banked fires and a tall iron flue | shovels; a coal heap; a pressure gauge",
      canal: "a black canal under a yellow sky | mills with leaning chimneys; a towpath; a lock gate",
      "fight:furnace": "a furnace room | stairs, the furnaces and the great flue"
    },
    "lb-3-opening": {
      street: "a Bloomsbury street in fog with gas lamps lit | a grand terrace; a doorman's box; a black-edged invitation card on the steps",
      gallery: "a grand private-view gallery lit by gas | framed black canvases on every wall; a marble floor; a champagne table",
      cellar: "a cellar under a gallery | a gas main tapped into a burner; a large canvas on a stand; brick vaults",
      gasworks: "the yard of a gasworks | a gasholder; coke heaps; valve wheels; a foreman's hut",
      "fight:cellar": "a cellar under a gallery | a stair, the vault and the master canvas"
    },
    "pr-1-bones": {
      hospice: "the stone refectory of a mountain pilgrims' hospice | two long tables; a huge fire; wet wool steaming on benches",
      infirmary: "a long low infirmary with eleven beds | tallow lamps; herbs hanging from the beams; cloth bundles on a shelf",
      hut: "a dry-stone beehive hut on a snowy pass | a small fire; a sack of identical small brown bones; a green cloak on a peg",
      pass: "a high snowy mountain pass at night with a cairn | a ring of footprints in the snow; a wooden cross; a pale moon",
      silo: "a squat stone charnel house with a vault below | bones laid in salt; a stone stair; a single lantern",
      inn: "a low-beamed mountain inn at the foot of a pass | a long table; a fire; a ledger on a barrel",
      "fight:pass": "a mountain pass in snow | a track, a cairn and a cross in the drift"
    },
    "pr-2-quarry": {
      door: "the west door of a half-built Gothic cathedral with scaffolding | a statue of a saint with a blank face; wooden cranes",
      lodge: "a masons' lodge workshop | chisels in racks; plumb lines; a white stone block half-carved; a bench",
      tavern: "a village tavern with a low ceiling | a slate on the wall with six names chalked; wedges hung over the bar; a long bench",
      fair: "a cathedral cloister turned into a relic fair | stalls of small reliquaries; a pardoner's table; pointed arches",
      quarry: "a limestone quarry in a Castilian hillside | a white seam in the stone; wooden cranes; stacked blocks",
      road: "a white dusty road between wheat fields | a deep cart rut with a line of spilled salt; a mule; a wooden wheel",
      "fight:gallery": "a quarry gallery | an adit, a cutting floor and a white vein in the wall"
    },
    "pr-3-finisterre": {
      village: "a Galician fishing harbour with stone granaries | hemp nets; boats drawn up; fog over the sea",
      hermitage: "a tiny stone hermitage on a headland | a bell in a gable; a single cell with a cot; a cross",
      cape: "a rocky cape with a stone cross at the end of the world | the Atlantic below; thick sea fog; a pile of burned cloth",
      beach: "a grey beach at dawn under a cliff | a thousand pairs of shoes set in a row at the tide-line; fog",
      "fight:cape": "a cape and a cross | the path, the cliff and the cross"
    }
  }
};
