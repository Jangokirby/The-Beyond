/* ============================================================================
   v6 PLACES, part A (cases set before 1960 in Europe and the Americas).
   One line per place: "HERO | extra object; extra object" (the generator adds the
   locale, the case's era objects and the local materials, and the wide-view tail).
   Rules (art/V6-PICTURE-RULES.md): no style words, no people, interiors indoors,
   era and place from content, no readable text.
   ========================================================================== */
module.exports = {
  LOCALE: {
    "hunt-man-eaters": { where: "Dunlaith, County Louth, Ireland, tenth century", era: ["a round-headed stone cross", "a wattle fence", "an iron-bound oak door", "a clay lamp with a rush wick"], local: ["peat smoke", "thatched roofs", "wet green hills", "bog water"] },
    "beyond-life": { where: "Hannisburg, a snow-bound mining town in Germany, 1884", era: ["a cast-iron gas bracket", "a brass pocket-watch chain", "a hand-cranked coffee mill", "a coal-fired tiled stove"], local: ["half-timbered houses", "slate roofs", "pit-head winding gear", "deep snow"] },
    "show-continues": { where: "an opera house in Paris, France, 1901", era: ["a gas chandelier with etched glass globes", "a red velvet curtain with brass tassels", "a prompter's box", "a Belle Epoque poster stand"], local: ["gilt plasterwork", "Haussmann stone", "ironwork balconies", "zinc roofs"] },
    "traitor": { where: "Neo France, a cyberpunk Paris in 2150", era: ["a holographic advertising panel", "a quadcopter drone", "a mirror-glass monolith tower", "a sealed airlock door"], local: ["wet black pavement", "stacked megablocks", "cable bundles", "a Haussmann facade built over with scaffolding"] },
    "bell-of-saint-remy": { where: "a Cistercian abbey village in Burgundy, France, 1187", era: ["a Romanesque round arch", "a rushlight on an iron stand", "a hand-forged iron hinge", "a wooden pilgrim's staff"], local: ["pale limestone", "bare vines", "terracotta roof tiles", "a slow brown river"] },
    "bread-for-the-dead": { where: "Hollebeke, a plague-struck village in Flanders, 1349", era: ["a wooden bread peel", "a tallow dip on a spike", "a painted red cross on a door", "a clay bread oven"], local: ["brick and thatch", "mud lanes", "a flat grey sky", "reed beds"] },
    "hour-of-the-fog": { where: "Wapping, on the Thames in London, England, 1888", era: ["a cast-iron gas street lamp", "a brass lamplighter's pole", "a hansom cab", "a coal-smoke chimney"], local: ["yellow London brick", "warehouse cranes", "river stairs", "wet cobbles"] },
    "trench-chorus": { where: "a British front-line trench on the Western Front, 1916", era: ["a Brodie steel helmet", "a coil of barbed wire on screw pickets", "a corrugated-iron revetment", "a Lee-Enfield rifle"], local: ["chalk mud", "duckboards", "sandbags", "shell craters"] },
    "night-train-aomori": { where: "a Japanese sleeper train on the Tohoku Main Line, 1957", era: ["a steam-era sleeper car with wooden slat berths", "a brass luggage rack", "a paper lantern", "a sliding frosted-glass door"], local: ["tatami mats", "green velvet curtains", "a station name board in the dark", "overhead wires"] },
    "last-picture-show": { where: "a drive-in cinema in the Nevada desert, USA, 1958", era: ["a chrome-fendered 1950s sedan", "a window speaker on a post", "a neon-tube marquee", "a pump-style popcorn machine"], local: ["red dust", "a hot-dog stand", "sagebrush", "a long straight highway"] },
    "black-roller": { where: "Cimarron County in the Oklahoma Panhandle, USA, 1935", era: ["a Model A Ford truck", "a wooden windmill", "a taped-up window", "a kerosene lamp"], local: ["drifted dust", "dead wheat", "wire fence", "a clapboard farmhouse"] },
    "lantern-on-the-water": { where: "Eleuthera, an island in the Bahamas, 1942", era: ["a blackout shutter", "a brass ship's lantern", "a hand-painted dinghy", "a wartime telegraph office"], local: ["coral limestone", "pastel clapboard houses", "casuarina trees", "a turquoise-less grey reef"] },
    "tutorial": { where: "a training house in Ashcombe Lane, London, 1925", era: ["a Bakelite telephone", "a gas fire", "a wireless set", "a brass door knocker"], local: ["brown wallpaper", "coal dust", "a worn runner carpet", "iron radiators"] }
  },
  PLACE: {
    "hunt-man-eaters": {
      camp: "a fog-bound hill camp with two leather tents and a dead campfire | the hills of Louth rolling away",
      parish: "a ruined parish street of wattle-and-daub houses with shattered doors | a stone church standing untouched at the end",
      church: "the inside of a small stone church with a bare nave | a plain altar; benches pushed together; a rush torch in a bracket",
      barony: "a walled barony of timber halls with the gate broken and houses burning | a muddy cobbled square",
      dawn: "a barony courtyard at dawn after a siege | a baron's hall door; an overturned cart; smouldering thatch",
      marsh: "an endless bog with a faint path of trodden reeds | pools of black water; a mist; a rotten plank causeway",
      cave: "the flooded mouth of a cave in a bog hillside | a carved stone lintel half under water",
      end: "a quiet road leaving a burned barony at sunrise | the hills; a stone cross; a wheel rut",
      "fight:barony": "a barony of fifteen timber buildings, the streets and houses laid out in rows | a gate, a hall and a burning cottage",
      "fight:ruins": "flooded underground ruins of an old hall | stone pillars standing in black water; a collapsed roof; a golden sanctuary at the far end",
      "fight:ruinsb": "flooded underground ruins of an old hall | stone pillars standing in black water; a collapsed roof; a golden sanctuary at the far end"
    },
    "beyond-life": {
      train: "the first-class cabin of a snowbound steam train | brass luggage racks; plush seats; a window of falling snow",
      station: "a small stone railway station on a snow-covered platform | a gas lamp; a wooden bench; the town's dark roofs behind",
      town: "the main street of a run-down German mining town in snow | closed shutters; a bakery window; a tall brick factory beyond",
      apartment: "a dilapidated tenement stairwell with bloodstains on the stair | a banister; peeling walls; an iron railing on the fifth floor",
      cemetery: "a snow-covered village cemetery with open graves | a stone pipe in the ground; a small funeral lantern; a kneeling spot with no one",
      smithy: "a blacksmith's forge that doubles as a church | pews pushed to the wall; an anvil; a barrel of acid; a hammer rack",
      factory: "the cutting room of a Victorian textile mill with the looms stilled | bolts of cloth shot with gold thread; a long cutting table; iron columns",
      marcel: "a manufacturer's panelled office | a heavy oak desk; a crystal decanter; a gold watch on a chain; a window onto the mill yard",
      cafe: "a small French-style cafe with only a few round tables | an espresso machine; a chalkboard menu; a window of falling snow",
      assembly: "a town assembly room with rows of mostly empty chairs | a long council table; a wall of portraits; a coal stove",
      mine: "a sealed mine door of riveted iron in a hillside | a heavy lock; snow on the arch; a mine cart rail disappearing into the dark",
      end: "a German mountain town in early spring after the snow | wet slate roofs; a church spire; a sealed mine hillside in the distance",
      "fight:railing": "a tenement fifth-floor landing with an iron railing over a stairwell | a noose; scattered gold coins on the boards",
      "fight:assembly": "a town assembly room cleared for a fight | a long table; scattered chairs; a doorway",
      "fight:mine": "a vast underground cavern with an abandoned stone city and a towering golden statue | black pools round its feet; a gantry; stone stairs"
    },
    "show-continues": {
      cafe: "a busy Paris cafe interior at a corner table by a tall window | round marble tables; a zinc bar; folded playbills on the table",
      lobby: "the marble lobby of a Paris opera house | a red carpet; a glass chandelier; carved stone pillars; painted puppet posters",
      performance: "a tiny puppet stage lit at the centre of a dark opera house | red velvet curtains; a marionette on strings; rows of velvet seats",
      house: "the dim foyer and stair of an opera house after a show | a gas wall bracket; gilt mirrors; a sweeping stair",
      stage: "the stage of a Paris opera house with thick red curtains and counterweights | scratched floorboards; ropes and iron rods overhead; wooden seating",
      dressing: "a narrow actor's dressing room with a long mirror | a table of grease paint and brushes; costumes on pegs; a porcelain theatre mask",
      hall: "the audience hall of an opera house with several seats cut open | velvet seats; scattered programmes; stuffing on the carpet",
      under: "the cramped space beneath an opera stage | wooden supports; pulleys; coiled rope; stacked crates",
      trap: "a narrow back corridor and trap room behind a stage | a ladder up to a trap door; hanging coats; a gas jet",
      lodging: "a narrow lodging room with three iron beds over a stage door | a stove; a washstand; neat made beds",
      renard: "a puppeteer's front room with hundreds of puppets hanging from hooks | carving tables; chisels; wooden limbs on shelves",
      basement: "a puppeteer's basement workshop with a tall marionette frame hanging from beams | a desk; a lamp; dozens of puppets on hooks",
      end: "an empty opera stage after a show with every puppet fallen to the floor | red curtains; scattered strings; a single bare stage light",
      "fight:stage": "an opera stage with ropes hanging from the rigging | three zones: stalls, stage, flies",
      "fight:workshop": "a basement workshop with a tall marionette frame | three zones: stairs, tables, the frame"
    },
    "traitor": {
      debrief: "the office of a Victorian-style agency headquarters inside a cyberpunk Paris | classical art; vintage hand-crafted furniture; a holographic city map over the desk",
      roof: "the roof of a mirror-glass hotel in a cyberpunk Paris at dusk | a shut-down relay tower; a roof access door; a fire escape; adware billboards across the street",
      f18: "a pitch-dark corridor of a rented-room hotel floor | king-bed doors; a stairwell lobby; an emergency exit sign",
      f17: "a hotel corridor with rented rooms on both sides | a worn carpet; a vending machine; a stairwell door",
      f16: "a hotel corridor ending in a relay room wired into the wall | cable bundles; a ring of small drones circling a socket; a vent",
      street: "an empty cyberpunk street in District 55 at dusk with every light coming on | LED billboards; abandoned cars; a convenience store; a garage",
      cafe: "a cafe on a corner in a cyberpunk Paris with the chairs stacked | an espresso machine; a dark sign; a neon-edged window",
      clinique: "the lobby of a futuristic hospital with the long corridor slightly too long | white tiles; a reception desk; a surgical theatre door at the end",
      end: "a cyberpunk Paris street at night after an operation | rain on the road; a drone leaving; a warm window",
      "fight:roof": "a hotel roof at dusk | a relay tower, a roof door and a fire escape in three zones",
      "fight:f18": "a pitch-dark hotel floor | a stair well, a corridor, a maintenance room and a suite",
      "fight:f18t": "a hotel floor with the lights on | two ceiling turrets; a corridor; a suite",
      "fight:f17": "a hotel floor of rented rooms | a stair well, a hallway and a row of rooms",
      "fight:f16": "a hotel relay room wired into the wall | a hallway, a stair well and the relay room with drones",
      "fight:street": "a cyberpunk street with a convenience store and a garage mouth | glowing billboards; abandoned cars",
      "fight:clinique": "a hospital lobby, a long ward and a surgical theatre in a row | white tiles; a sealed door"
    },
    "bell-of-saint-remy": {
      arrive: "a Burgundian village at dusk with every door open | low stone houses; bare vines; a Cistercian abbey on the hill",
      village: "a row of low stone cottages with open doors | a well; a dung-heap; bare vines; a church roof above",
      abbey: "a bare stone Cistercian cloister with a well-head | round arches; a pale stone floor; a bell rope",
      crypt: "a vaulted undercroft with wall niches holding bones in linen | one empty niche swept clean; a rushlight; a stair",
      belfry_look: "a square stone bell chamber at the top of a stair | a great bronze bell with a silver chain; a rope; wooden louvres",
      ford: "a river ford with flat stepping stones and a still pool | reeds leaning toward an abbey; a flat rock; mist",
      foundry: "a long open-fronted shed holding a cold furnace | clay moulds; leather bellows; tongs on a rack; a sack behind the furnace",
      night: "an abbey village at night with a bell ringing | open doorways; a pale moon; a belfry against the sky",
      chapel: "the inside of a small Romanesque chapel | rows of rough pews; a plain altar; one lit rushlight; a gap in the pews",
      belfry_fight: "a belfry ringing floor with a great bell swinging without a rope | a stair; wooden louvres; moonlight",
      end: "a Burgundian village at dawn | smoke from chimneys; an abbey; a bell in its tower",
      "fight:belfry": "a belfry with a great bell | a stair, a ringing floor and the bell"
    },
    "bread-for-the-dead": {
      arrive: "a muddy village street of brick-and-thatch houses | red crosses painted on doors; loaves on windowsills; a stone church",
      pit: "a scorched oval on a bare hillside | a broken line of white salt round the edge; black ash; a few charred stakes",
      church: "a small stone church whose nave is strewn with straw and rows of cots | an altar with burned-down candle stubs",
      maes: "a low farm kitchen with a long table and five chairs | a hearth; a loaf on a board; a rushlight",
      graves: "a churchyard of fresh-turned earth with almost no crosses | a half-dug trench; a spade stuck upright; a wall",
      oven_house: "a long stone brewhouse with a huge vaulted bread oven | racks of dark round loaves; a white steady fire; a peel",
      aleid: "the edge of a village with an old stone cross and a road going out | thatched roofs; a goat; a bare field",
      dusk: "a village street at dusk with a loaf set on every doorstep | thatched roofs; lit windows; a church tower",
      oven_fight: "the interior of a brewhouse with a vaulted oven mouth glowing white | benches round the walls; racks of loaves",
      end: "a village street at dawn after the plague | open doors; a loaf in a bin; a church tower",
      "fight:oven": "a brewhouse with a great oven | three zones: door, benches, oven mouth"
    },
    "hour-of-the-fog": {
      yard: "a Wapping high street in yellow fog at half past four | a gas lamp burning dim and blue; warehouse walls; wet cobbles",
      lamps: "a flight of Thames stairs lit by gas lamps trimmed bright | a brass lamplighter's pole leaned on a post; river fog banked at the edge",
      pell: "a tidy Victorian kitchen with the table laid for two | a black range; a cat's saucer; a teacup; a gas mantle",
      church: "a low brick Victorian church with wet hymn-books on the pews | a lectern with a parish register; a cold stove",
      gasworks: "the yard of a gas works | a gas holder like a drum; heaps of coke; a clerk's hut with a lit window",
      dawn: "a Wapping street at four in the morning with fog rolling up from the river | gas lamps; shuttered shops; a cart",
      cistern_fight: "an iron gantry over a dark cistern of water | a valve wheel; a ladder; fog rising from the water",
      end: "a Wapping street at dawn with the fog thinning | gas lamps going out; wet brick; a cart",
      "fight:street": "Wapping Old Stairs | gas lamps, a landing and the river edge in three zones",
      "fight:cistern": "a gas cistern | an iron gantry, a valve wheel and the black water"
    },
    "trench-chorus": {
      arrive: "a British support trench at dusk | duckboards; a dugout door; a candle in a bully-beef tin",
      sap: "a narrow flooded sap running out toward no-man's land | a sandbagged listening post at its end; barbed wire beyond",
      fire: "a fire step along a trench wall | sleeping bundles in blankets; rifles stacked; a periscope",
      prisoner: "a barbed-wire pen behind the trench lines | a wooden hut; a single bench; a lantern",
      out: "no-man's land at night with a shell crater ahead | barbed wire on screw pickets; mud; the skeleton of a tree",
      end: "a front-line trench at dawn | a grey sky; duckboards; a lone mess tin",
      "fight:crater": "a shell crater with a slope down to a flat floor | a lip, a slope and a circle in the mud"
    },
    "night-train-aomori": {
      platform: "a 1950s Japanese railway platform at night with a steam train at the platform | a station clock; a hanging lantern; a wooden bench",
      train: "the corridor of a Japanese sleeper train | wooden-framed windows; green curtains; a swaying lamp",
      car4: "a second-class sleeper car with berths and half-drawn curtains | a small luggage net; a tea kettle on a tray",
      dining: "a dining car with white tablecloths and a corner table | a ledger open on the cloth; a punch; sleeping waiters' stools",
      engine: "the cab of a steam locomotive with the firebox glowing | gauges; a regulator; a driver's cap on a hook",
      speaker: "a train corridor beside a ceiling speaker | a tangle of wire going through a wall; a dark window; a sliding door",
      car5: "the end of a train carriage with a sliding paper door that has no handle | a child's shoe on the sill; a faint warm light under the door",
      car7: "a long tatami room inside a train with paper walls and one paper lantern | a moving landscape on the walls; low lamps",
      stop: "a locomotive footplate racing through a night landscape | a speed gauge; a brass whistle cord",
      end: "a Japanese railway platform at dawn | an early train; wet wooden boards; a station name board",
      "fight:car7": "a long tatami car with paper lanterns hanging down it | three zones: door, floor, lamp end"
    },
    "last-picture-show": {
      lot: "a drive-in cinema lot with a huge blank screen and rows of cars | window speakers on posts; a neon marquee",
      snack: "a drive-in snack bar interior | a popcorn machine; a counter; a paper hat on a hook; a neon sign in the window",
      booth: "a cramped projection booth with two film projectors | a rewind bench; a film can; a small square window",
      bunker: "a squat concrete bunker half-buried in desert sand | a tripod and an old film camera at the door; a chain-link gate",
      finale: "a projection booth with a projector beam going out of the window | a film reel on a spool; a dark lot below",
      end: "a drive-in cinema lot at sunrise | an empty white screen; a few cars driving away; a marquee",
      "fight:booth": "a projection booth with a beam going out | a stair, the booth and the beam"
    },
    "black-roller": {
      town: "the single main street of a Depression-era Oklahoma town | false-front shops; dust drifted to the windows; a Model A truck",
      church: "a white clapboard country church with taped windows | pews with wet sheets laid over them; a pulpit",
      tate: "a neat clapboard farmhouse with every window taped | a clothesline; a kitchen table laid for two seen through the door",
      pruitt: "a gaunt wooden farmhouse on a bare rise with a tall windmill | a yard where nothing grows; a wet sheet over the door",
      school: "a one-room country schoolhouse | a blackboard drifted with dust; small desks pushed aside; a school photograph on the wall",
      sunday: "a farmyard under a yellow sky with a black wall of dust on the horizon | a windmill; a porch; a drift against the fence",
      end: "a farmyard on a clear blue morning | green grass at the foot of a windmill; a hand-rail cross",
      "fight:storm": "a farmyard with a windmill under a black dust storm | a porch, a yard and the windmill in three zones"
    },
    "lantern-on-the-water": {
      dock: "a blacked-out Bahamian harbour dock at night | a hooded torch; fishing boats; a stack of nets",
      church: "a whitewashed stone island church on a rise | a small belfry; hibiscus in a jar; a pew",
      mabel: "a small clapboard house on a rocky point | a boat drawn up on a ramp; oars against the wall; a net drying",
      knowles: "a wooden veranda on a hill with a rocking chair | a battered brass lantern on the arm; a straw hat",
      reef: "a black sea with a reef line of white surf at midnight | a wooden dinghy; a hurricane lamp",
      schooner: "the deck of an old three-masted schooner | rows of burning lanterns; torn sails; wet planking",
      end: "a quiet island harbour at dawn | fishing boats pulled up on the sand; calm water",
      "fight:schooner": "the deck of a schooner at a reef | a boarding rail, a deck and a quarterdeck with lanterns"
    },
    "tutorial": {
      hall: "the front hall of a London training house | a hat-stand; a Bakelite telephone on a table; a brown runner on the stairs",
      cellar: "a brick cellar under a London house | a coal chute; wooden shelves; a bare bulb",
      "fight:coal": "a coal store with a heap of coal | a door, a heap and a back wall"
    }
  }
};
