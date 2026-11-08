/* ============================================================================
   SCENE PROMPTS — what each place in a written case LOOKS like, for the image
   generator. Story text ("eleven men singing") is no good as a prompt: the
   generator paints a normal room and leaves out what matters. Each entry is
     "case/scene": [what must be in the picture, things to keep out]
   The first part names the place and its few defining features, front-loaded
   and weighted (word:1.3) so they survive. People are left out of places on
   purpose (characters are laid over the picture), so anything a scene needs
   that is a person is described as a trace: an empty chair, a lit candle.
   Fight backdrops ("case/fight:id") need the same place with clear ground
   across the bottom third, where three zones are drawn.
   ========================================================================== */
module.exports = {
  /* ---- The Bell of Saint-Rémy, Burgundy 1187 */
  "bell-of-saint-remy/road": ["(muddy medieval road at dusk:1.3), a carved stone milestone in the foreground, rain, a small Burgundian village of stone houses in a valley, (Romanesque abbey with a tall square bell tower on the hill above:1.3), one high window glowing", "modern buildings, telegraph poles, fences of wire"],
  "bell-of-saint-remy/village": ["(narrow street of a 12th-century French village at night:1.3), rain on cobbles, (every wooden door standing wide open:1.3), dim hearth light inside the doorways, thatched and stone roofs, the abbey tower on the hill at the end of the street", "glass windows, street lamps"],
  "bell-of-saint-remy/chapel": ["(interior of a Romanesque abbey chapel:1.3), round stone arches, rows of low wooden benches on stone flags, (candles burned down to stubs on the altar:1.2), an iron altar rail, cold blue moonlight through narrow windows", "gothic stained glass, pews with backs, electric light"],
  "bell-of-saint-remy/crypt": ["(medieval stone crypt with burial niches in the walls:1.3), names carved above each niche, one niche open and empty, a small carved wooden lid on the floor, low vaulted ceiling, a single torch", "coffins, skeletons on display"],
  "bell-of-saint-remy/tower": ["(top of a medieval bell tower:1.3), wooden beams and a heavy rope, (a large dark bronze bell hanging overhead:1.3), stone arches open to the night sky, rain blowing in, spiral stair opening in the floor", "clock faces, modern ropes"],
  "bell-of-saint-remy/fight:tower": ["(belfry of a Romanesque tower at night:1.3), (huge dark bronze bell swinging:1.3), timber floor across the whole bottom of the picture, stone arches, lightning in the rain outside", ""],

  /* ---- The Hour of the Fog, Wapping 1888 */
  "hour-of-the-fog/yard": ["(Wapping High Street, London, 1888, before dawn:1.3), (thick mustard-yellow fog:1.3), wet cobbles, tall brick warehouses with loading doors and iron cranes, (one gas lamp burning dim and blue:1.2), the Thames somewhere beyond", "cars, modern signs"],
  "hour-of-the-fog/lamps": ["(cobbled yard under a brick railway arch:1.3), ladders, stacked lamp glasses and oil drums, (an iron brazier burning in the middle:1.3), the fog stopping in a clean circle around the brazier's light, an upturned bucket", ""],
  "hour-of-the-fog/pell": ["(small scrubbed Victorian kitchen:1.3), black iron range with a copper kettle, (table laid for two with cups, saucers and bread and dripping:1.3), one wooden chair by the range, a lace curtain, fog pressing at the window", ""],
  "hour-of-the-fog/stairs": ["(Wapping Old Stairs:1.3), slick green stone steps running down between brick walls to the black Thames, (fog pouring up the steps like water:1.3), a mooring post, a single distant lamp", ""],
  "hour-of-the-fog/works": ["(derelict Victorian gas works:1.3), (an empty iron gasometer frame against the sky like a giant ribcage:1.3), chained iron gate, a small brick valve house at its foot, fog flowing across the yard into the valve house door", ""],
  "hour-of-the-fog/fight:street": ["(Wapping Old Stairs at night:1.3), wide wet cobbled landing above the river, brick walls, (dense yellow fog with vague shapes in it:1.2), one gas lamp, open ground across the bottom", ""],
  "hour-of-the-fog/fight:cistern": ["(huge underground gas cistern:1.3), black still water, brick arches and iron pipes, (pale fog rising from the water:1.3), a narrow iron walkway across the bottom of the picture", ""],

  /* ---- The Trench Chorus, Western Front 1916 */
  "trench-chorus/trench": ["(inside a muddy World War One fire trench:1.4), (sandbagged walls on both sides, wooden duckboards half-sunk in brown water:1.3), wooden fire step, revetting of wicker and planks, a dugout entrance with a gas curtain, (a white flare hanging in the night sky above the parapet:1.2), rain", "open fields, houses, no trench walls"],
  "trench-chorus/post": ["(cramped World War One listening post dug into the earth:1.4), (roof of corrugated iron and sandbags:1.3), a wooden ladder up to a slit, (a trench periscope:1.3), a bucket, a field telephone with a cut wire, (a pair of army boots standing at the foot of the ladder:1.2), mud, candle stub", "houses, open sky, a cabin"],
  "trench-chorus/chapel": ["(roofless ruined stone chapel standing in a shell crater:1.4), (no roof, open night sky, rain falling in:1.3), broken gothic walls and windows, wooden choir stalls, (altar lit with dozens of candles:1.3), mud and barbed wire around the crater rim, flares in the sky", "intact roof, village, green fields, a house"],
  "trench-chorus/fight:wire": ["(no-man's land on the Western Front at night:1.4), (tangles of barbed wire on iron pickets:1.3), (shell craters full of water:1.3), shattered tree stumps, mud, a flare lighting everything white", "houses, grass, farmland"],
  "trench-chorus/fight:chapel": ["(roofless ruined chapel in a shell crater at night:1.4), open sky, candles blazing on the altar, wooden choir stalls along the sides, broken walls, mud floor across the bottom of the picture", "roof, house"],

  /* ---- The Night Train to Aomori, Japan 1957 */
  "night-train-aomori/platform": ["(Ueno Station, Tokyo, 1957, at night:1.3), a steam locomotive and dark green sleeper carriages at the platform, steam under platform lamps, Japanese station signs, iron roof girders", "modern trains, Western signs"],
  "night-train-aomori/cars": ["(inside a 1950s Japanese sleeper carriage at night:1.3), long narrow aisle, (green curtains drawn over stacked sleeper bunks on both sides:1.3), pairs of shoes lined up in the aisle, dim ceiling lamps, dark windows", "seats, aeroplane interior"],
  "night-train-aomori/car7": ["(impossibly long traditional Japanese room inside a train carriage:1.4), tatami mats running into the distance, (glowing shoji paper walls:1.3), (a long line of paper lanterns hanging overhead:1.3), train windows showing only grey mist, dreamlike", "outside view of a train, Western furniture"],
  "night-train-aomori/fight:car7": ["(endless tatami hall inside a train:1.3), glowing paper walls, (paper lanterns swaying overhead:1.3), grey mist at the windows, clear tatami floor across the bottom of the picture, dreamlike, uncanny", "outside view of a train"],

  /* ---- The Last Picture Show, 1958 */
  "last-picture-show/lot": ["(1950s American drive-in theatre at dusk:1.4), (huge white outdoor movie screen glowing:1.3), rows of parked 1950s cars beside speaker posts, dry hills, pink sky at the horizon", "modern cars, people"],
  "last-picture-show/stand": ["(1950s drive-in concession stand at night:1.3), counter with a popcorn machine, paper cups and a cash register, bare bulbs with moths, a paper hat on the counter, dark lot outside", ""],
  "last-picture-show/booth": ["(cramped concrete projection booth:1.3), (a big 1950s film projector with reels:1.3), a beam of light through a small square window full of dust, (seven film cans on a shelf:1.2), photographs pinned all over the walls", ""],
  "last-picture-show/fight:booth": ["(projection booth at night:1.3), (projector beam blazing through dust:1.3), film unspooling everywhere, reels on the wall, concrete floor across the bottom", ""],

  /* ---- Dial-Up, Rotterdam 1999 */
  "dial-up/office": ["(cramped 1990s internet provider office above a shop:1.3), (cables running across the ceiling:1.3), beige computers and CRT monitors, stacked modems with lights, (a wall pinned with printed photos and names:1.2), rainy window with Christmas lights", "flat screens, smartphones"],
  "dial-up/exchange": ["(abandoned telephone exchange switching hall:1.4), (long rows of electromechanical relay racks:1.3), dust, bricked-up windows, a rusted sign, darkness with tiny points of light in the racks", ""],
  "dial-up/fight:exchange": ["(old telephone exchange hall:1.3), rows of relay racks, (dozens of old telephone handsets hanging on cords:1.3), sparks, clear tiled floor across the bottom", ""],

  /* ---- Signal Drift, Yunnan 2024 */
  "signal-drift/camp": ["(small modern expedition camp in misty Yunnan hills:1.3), one tent, (a solar panel and a laptop on an ammunition crate:1.3), a drone case, terraced rice hills fading into blue distance", "ancient buildings"],
  "signal-drift/road": ["(narrow path through dense bamboo forest at dusk:1.3), terraced hillside, (faint smoke rising beyond the bamboo:1.2), last light", ""],
  "signal-drift/village": ["(old Chinese mountain village of wooden houses with curling eaves:1.3), (red paper lanterns lit along the street:1.3), rice spread on mats to dry, wooden buckets, warm and lovely but too perfect", "modern buildings, cars"],
  "signal-drift/fight:road": ["(bamboo forest at night:1.3), (glowing eyes among the stems:1.3), a dirt track across the bottom of the picture, mist", ""],
  "signal-drift/fight:shrine": ["(small village shrine filled with mirrors:1.4), (dozens of old bronze and glass mirrors on every wall:1.3), candlelight, one huge mirror at the back, stone floor across the bottom", ""],

  /* ---- Bread for the Dead, Flanders 1349 */
  "bread-for-the-dead/road": ["(empty road in medieval Flanders, plague summer 1349:1.3), (an abandoned plague cart at a crossroads, its load covered with straw and lime:1.3), crows, farmhouses with white crosses painted on the doors, a small village and church tower beyond", ""],
  "bread-for-the-dead/square": ["(small medieval Flemish village square at evening:1.3), timber-framed houses with doors open, (tables laid with bread and ale visible inside the doorways:1.3), a church tower and churchyard wall at the end", "brick terraces, modern items"],
  "bread-for-the-dead/church": ["(cold interior of a small medieval parish church:1.3), straw on the floor, (candles burned down to puddles on the altar:1.2), (an empty chair by the altar rail with blankets and an open ledger:1.3), plain stone walls", "pews, stained glass"],
  "bread-for-the-dead/pit": ["(medieval plague pit behind a churchyard wall at night:1.4), (a long scar of freshly turned earth:1.3), spades left standing, crooked wooden crosses, the church tower behind", ""],
  "bread-for-the-dead/mill": ["(inside a medieval watermill kitchen:1.3), flour dust, wooden gears, (a table set for four with bread:1.3), flowers in a jug, swept floor, unnaturally tidy", ""],
  "bread-for-the-dead/loft": ["(grain loft of a medieval mill:1.3), wooden beams, (a long table plan drawn in chalk on the floorboards:1.3), (one large chair at the head of the chalk table:1.2), sacks of grain, a ladder hole", ""],
  "bread-for-the-dead/fight:loft": ["(mill loft at night:1.3), the great wooden sails turning outside the window, beams, chalk lines on the floor, an empty high-backed chair at the far end, open floorboards across the bottom", ""],

  /* ---- The Black Roller, Oklahoma 1935 */
  "black-roller/station": ["(lonely 1930s filling station in the Dust Bowl:1.3), one old gas pump, a Coca-Cola sign, (wet bedsheets nailed over the windows:1.2), (fences buried to the top wire in red-brown dust drifts:1.3), bruised sky", "modern cars"],
  "black-roller/farm": ["(half-buried Dust Bowl farmhouse:1.3), (dust drifted up to the windowsills:1.3), barn roof sagging, (a tractor nose-down in a dune:1.3), fence posts poking out of the dust", ""],
  "black-roller/cellar": ["(crowded church storm cellar dug into earth:1.3), rows of camp cots, crates of canned peaches, a washtub with a cloth over it, (kerosene lamps:1.2), a hymn sheet pinned to the earth wall, wooden steps up", ""],
  "black-roller/well": ["(new steel well casing in a dusty field:1.3), (a windmill above it:1.3), a tin bucket lying on its side in the dust, barn in the distance, cold mist rising out of the well", ""],
  "black-roller/storm": ["(gigantic black dust storm rolling over a farm:1.4), (a wall of black dust a thousand feet high:1.3), the day turning to night, a barn and windmill tiny in front of it", ""],
  "black-roller/fight:storm": ["(inside a black dust storm:1.4), near darkness, swirling dust, a fence line and windmill barely visible, open ground across the bottom", ""],

  /* ---- Vacancy, Edinburgh 2016 */
  "vacancy/briefing": ["(Candlemaker Row, Edinburgh Old Town, rainy night, seen through a car windscreen:1.3), black stone tenements climbing a steep curving street, (wet iron railings of Greyfriars kirkyard:1.2), street lamps, raindrops on glass", ""],
  "vacancy/stairwell": ["(narrow stone spiral stair inside an old Edinburgh tenement:1.4), worn steps, a bicycle chained to the banister, (junk mail on the bottom step:1.2), a timer light switch, three doors on the landings", "street outside"],
  "vacancy/calder": ["(narrow hallway of an old man's flat:1.3), (wall of coat hooks crowded with far too many coats of every kind, a child's anorak, a pink feather boa, a dentist's tunic:1.4), patterned carpet, warm lamp", "courtyard, outdoors"],
  "vacancy/flat4": ["(cosy holiday flat living room with fairy lights:1.3), a welcome basket on the table, a handwritten card, (a corridor at the back that runs impossibly far:1.4)", ""],
  "vacancy/end": ["(beautiful room with houseplants and a big window:1.3), (the window shows a city that is not Edinburgh:1.2), soft lamps, a perfect armchair, unsettlingly welcoming", ""],
  "vacancy/fight:corridor": ["(endless hotel-like corridor of identical doors:1.4), soft carpet, wall lamps going on forever, carpet floor across the bottom", ""],

  /* ---- The Sitting Room, Bath 1871 */
  "sitting-room/circus": ["(The Circus in Bath, 1871:1.3), (curved terrace of honey-coloured Georgian townhouses around a wet green:1.3), chimneys smoking, a horse-drawn brougham at one door, rain, one house with every curtain drawn", ""],
  "sitting-room/hall": ["(cold Victorian entrance hall:1.3), black and white tiled floor, (a hat stand with a top hat, a lady's bonnet and a child's cap:1.3), a staircase, a gas lamp turned low, frost on the inside of the fanlight", ""],
  "sitting-room/parlour": ["(Victorian mourning parlour, 1871:1.3), (black crape draped over the mirror:1.3), (a photograph of a whiskered gentleman wreathed in flowers:1.2), a stopped mantel clock, a tea service, heavy velvet and lace", ""],
  "sitting-room/study": ["(Victorian gentleman's study:1.3), (furniture under white dust sheets:1.3), cold empty grate, a diary open on the writing desk, bookcases, a single candle", "outdoors, field"],
  "sitting-room/sitting": ["(Victorian séance room:1.4), (round table set with nine chairs:1.3), (a heart-shaped planchette on the table:1.2), gas lamps turned low, heavy drawn curtains", ""],
  "sitting-room/fight:seance": ["(séance room in chaos:1.3), the round table lifted off the floor, chairs around it, gas flames leaning sideways, curtains billowing, open floor across the bottom", ""],

  /* ---- The Lantern on the Water, Eleuthera 1942 */
  "lantern-on-the-water/harbour": ["(small Bahamian harbour town at night, 1942:1.3), pink and blue wooden houses with black cloth over every window, a bright moon over the bay, (a dark unlit lighthouse on the point:1.2), a tanker burning on the far horizon", ""],
  "lantern-on-the-water/clementine": ["(inside an old Bahamian cottage at night:1.3), herbs hanging from the rafters, a Bible on a table, (an oil lamp turned down to a bead:1.2), an empty rocking chair, blackout cloth over the window", ""],
  "lantern-on-the-water/post": ["(1940s coast guard post on a beach:1.3), sandbag walls, (a deck gun pointed at the sea:1.3), a field radio, a lamp under a hood, night", ""],
  "lantern-on-the-water/lighthouse": ["(inside the lamp room at the top of a lighthouse:1.4), (a huge cracked glass lens:1.3), iron spiral stairs coming up through the floor, salt crust, an old knotted rope tied to a beam, moonlight", "a house, a hut"],
  "lantern-on-the-water/reef": ["(open sea over a reef at midnight:1.3), (an old sailing ship lit with dozens of lanterns, sails slack with no wind:1.4), moonlit water, the bow of a rowing boat in the foreground", ""],
  "lantern-on-the-water/fight:deck": ["(deck of an 18th-century sailing ship at night:1.3), (lanterns blazing everywhere:1.3), wet planks across the bottom of the picture, rigging, masts, calm black sea", ""],

  /* ---- Quiet Hours, Chengdu 2026 */
  "quiet-hours/van": ["(inside a modern surveillance van at night:1.3), banks of screens showing a glass apartment tower, keyboards, cables, (through the windscreen a forty-floor glass residential tower with evenly lit windows:1.3), delivery drones in the sky", "shipwreck, old buildings"],
  "quiet-hours/office": ["(sleek glass facility office in a modern Chinese apartment lobby:1.3), wall of security screens, a framed smart-building award, (a robot vacuum on the floor:1.2), a spilled cup of tea on the desk", ""],
  "quiet-hours/flat": ["(tidy modern apartment at noon with curtains closed:1.3), (a round smart speaker in the ceiling glowing softly:1.3), a dining table set for one, a framed photo of an old couple, grey light through the curtains", ""],
  "quiet-hours/lift": ["(inside a modern elevator:1.4), brushed steel walls and mirror, (floor display glowing with the number 13:1.3), soft white light, closed doors", "ship, water, outdoors"],
  "quiet-hours/core": ["(server room that stretches impossibly far:1.4), (endless aisle of server racks with blinking status lights:1.3), at the far end the lights form a vague face, cold blue light", ""],
  "quiet-hours/fight:floor13": ["(endless server room aisle:1.3), every status light blinking, cables hanging, cold light, raised floor tiles across the bottom", ""],

  /* ---- Training: The First Night, 1925 */
  "tutorial/hall": ["(tall cold front hall of an old English townhouse, 1925:1.3), gas lamps turned low, a grandfather clock, polished floorboards, a coat stand, a roll-top desk in a study doorway, stairs going up into darkness", ""],
  "tutorial/cellar": ["(brick cellar with a single bare bulb on a string:1.3), damp walls, twelve wooden steps down, (a heavy wooden coal-store door with iron straps:1.3), coal dust on the floor in a wide smooth circle", ""],
  "tutorial/fight:coal": ["(coal store in a cellar:1.3), a great heap of coal against the back wall, coal dust hanging in the air, a bare bulb swinging, brick floor across the bottom", ""],

  /* ---- The Lamp-Black arc: Chelsea, Manchester, Bloomsbury 1889-91 */
  "lb-1-portraits/surgery": ["(small Victorian doctor's surgery:1.3), gaslight, (a desk with four patient files and small engraved portraits pinned beside them:1.3), medicine cabinet, rain running down the window, empty waiting chairs", ""],
  "lb-1-portraits/vere": ["(Victorian sickroom, curtains drawn at noon:1.3), a large four-poster bed with pillows, (a grand oil portrait of a young woman hanging over the mantel:1.4), thick carpet, medicine bottles", ""],
  "lb-1-portraits/studio": ["(Victorian painter's studio in a coach house:1.4), (great north skylight:1.3), (easels standing in a ring:1.3), canvases, paint pots and rags, linseed jars", "empty bare room"],
  "lb-1-portraits/gallery": ["(narrow private gallery behind a curtain:1.3), (four finished full-length portraits in gilt frames:1.4), an empty hook where a fifth hung, packing crates, one lamp, deep shadows", ""],
  "lb-1-portraits/fight:gallery": ["(private gallery of portraits at night:1.3), gilt-framed portraits on every wall, (the painted eyes all glowing faintly:1.2), floorboards across the bottom", ""],
  "lb-2-flues/hennessy": ["(cramped Victorian chimney sweep's lodging house:1.3), brushes and soot sacks, (six small cots made up tight against the back wall:1.3), soot on everything, one candle", "street outside"],
  "lb-2-flues/yard": ["(Victorian rendering works yard beside a canal:1.3), (heaps of black material steaming in the rain:1.3), (an enormous brick chimney vanishing into low cloud:1.3), cotton mills with lit windows beyond", ""],
  "lb-2-flues/flues": ["(inside a giant brick chimney flue:1.4), curved soot-black brick close on every side, looking up a shaft toward a faint circle of light, iron rungs", "room, windows"],
  "lb-2-flues/office": ["(Victorian works office above a furnace:1.3), everything grey with fine soot, a ledger open on a blotter, iron stair rail, a window over a furnace glow", ""],
  "lb-2-flues/furnace": ["(Victorian furnace room:1.4), (three furnace mouths glowing under one huge flue:1.3), a handcart of canvas-wrapped bundles, coal shovels, heat haze", "empty bare room"],
  "lb-2-flues/fight:furnace": ["(furnace room at full roar:1.3), (three furnace mouths blazing:1.3), soot swirling into a shape in the flue above, brick floor across the bottom", ""],
  "lb-3-opening/street": ["(Great Russell Street, London, 1891, at night:1.3), carriages nose-to-tail, (a new gallery with blacked-out windows:1.3), gas lamps burning with a strange dark flame, fog", ""],
  "lb-3-opening/gallery": ["(Victorian gallery private view:1.3), (walls hung with hundreds of canvases painted entirely black:1.4), champagne glasses on trays, music stands for a string quartet, chandeliers", ""],
  "lb-3-opening/cellar": ["(vast cellar lit by hundreds of candles:1.3), (a single black canvas thirty feet wide filling the end wall:1.4), the black seems to go back into depth, stone steps leading down", ""],
  "lb-3-opening/fight:cellar": ["(candle-lit cellar:1.3), (an enormous black canvas on the end wall opening like a mouth:1.3), candles everywhere, stone floor across the bottom", ""]
};
