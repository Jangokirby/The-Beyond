/* v6 PLACES, part C: the new cases for The Present and The Far Future. Same format as part A. */
module.exports = {
  LOCALE: {
    "long-count": { where: "Lagos, Nigeria, 2038", era: ["a thin grey sleep-tracking wristband", "a smart-speaker with an amber ring", "a ceiling fan over a bed", "a rack-mounted server"], local: ["tin roofs", "yellow danfo minibuses", "a concrete tower block", "palm trees"] },
    "last-reef": { where: "a floating coral laboratory in the Coral Sea off Queensland, Australia, 2047", era: ["a solar-panel canopy", "a rigid-hull inflatable boat", "a rack of tanks with LED grow lamps", "a dive computer on a wrist strap"], local: ["bleached white coral", "a steel pontoon deck", "open sea", "salt-crusted rails"] },
    "heat-dome": { where: "Chandni Chowk in Old Delhi, India, 2061", era: ["a driverless cab with a roof screen", "a cooling-vest rack", "a shade-sail on a steel pylon", "a drone water-delivery pod"], local: ["red sandstone arcades", "overhead wires", "a clay-pot water stand", "a neem tree"] },
    "core-samples": { where: "Vostok-Deep research station on the Antarctic ice sheet, 2144", era: ["a heated pressure airlock door", "a drill tower with a winch", "a rack of ice-core tubes", "a wall panel with an amber AI ring"], local: ["blown snow", "stilts over ice", "orange survival flags", "frost on steel"] },
    "tidewater": { where: "a half-drowned Venice, Italy, 2203", era: ["an autonomous gondola with a lit prow", "a floating pontoon quay", "a steel piling raised over the water", "a booking-app kiosk"], local: ["stone palazzi with green waterlines", "a narrow canal", "mooring poles", "bridges"] },
    "the-climber": { where: "the Quito space-elevator tether base in Ecuador, 2290", era: ["a glass climber cabin on a beam of light", "a cable-maintenance climbing suit", "a pressure door with a blue light ring", "a platform clock"], local: ["a high Andean plateau", "volcano cones", "a woven nano-cable", "wind-bent grass"] },
    "rupture-season": { where: "Marine Drive in Mumbai, India, 2412", era: ["a Vanguard rifle with a hooked glowing barrel", "a hand-held rupture sealer", "a drone gantry", "a modular evacuation transport"], local: ["a curved sea-wall", "monsoon rain", "art-deco apartment blocks", "palm trees"] }
  },
  PLACE: {
    "long-count": {
      flat: "a Lagos third-floor flat bedroom | a boy asleep in bed with a band on his wrist; a ceiling fan; a stopwatch on a table",
      clinic: "a long hospital sleep-ward with forty beds | monitors; sleeping patients in a row; a laptop of traces",
      market: "a covered market in Ikeja with tin roofs | a stall of tomatoes; plastic crates; phone-charging stalls",
      ajo: "an open-plan tech office on a fourth floor | beanbags; a table football; a wall of screens showing a sleeping-blue city map",
      lekki: "the core hall of a data centre with amber-lit racks | two hundred beds on wheels in the aisle; an open book on a desk of cables",
      end: "a Lagos street in the morning after rain | a danfo bus; a phone screen; a market awning",
      "fight:core": "a data-centre hall | an airlock, a row of beds and a ledger desk"
    },
    "last-reef": {
      deck: "the main deck of a floating coral laboratory in open sea | solar canopies; a desalination stack; racks of dive gear",
      sickbay: "a small white sick bay with three bunks | a medical tablet on a trolley; a porthole; a rolled blanket",
      engine: "an engine room of pumps and pipes under a deck | a manifold; valve wheels; a bucket",
      office: "a cramped laboratory office with a porthole | coral samples in glass jars on a desk; a sun hat; a coffee mug",
      lower: "a flooded hall under a platform, four metres of green water | pink coral on every surface; a dive locker",
      end: "a quiet platform deck at dusk | towels on a rail; a hydrofoil at the pontoon; calm sea",
      "fight:tank": "a flooded laboratory hall | an access stair, rows of coral plantings and a lattice at the far end"
    },
    "heat-dome": {
      hospital: "a hospital heat ward corridor | rows of cooling beds, all taken; fans at maximum; a tablet on a trolley",
      cab: "the inside of a driverless cab pulled over under a flyover | a phone on the dash showing a map of red dots; a gamchha on the mirror",
      chowk: "Chandni Chowk, an empty market street with shutters down | heat haze shaking the air; a clay-pot water stand under a green tarpaulin; an old clock shop at the end",
      roof: "a flat tar rooftop under a steel shade-sail | a bolted pylon; a long shadow falling the wrong way; a cooling bench",
      noon: "the end of a market street at noon with a cool green arcade of neem trees standing in the heat haze | a fountain; white tiles; a queue of waiting shapes' shoes",
      end: "an Old Delhi street in the evening with a breeze moving a tarpaulin | a clay water pot; a neem tree; dusk light",
      "fight:quarter": "a cool arcade of neem trees | the arcade mouth, a shaded avenue and a long table of ledgers"
    },
    "core-samples": {
      airlock: "the wind-scoured main airlock of a long, low polar station | a heavy outer door; thermal jackets on hooks; a boot rack",
      lab: "a white core laboratory of cold benches | a playback rig with a long clear ice core on rollers; freezers; dry ice",
      deck: "a great cold drill hall with the drill head hanging into a black shaft | winches; steel rails; an upturned crate",
      control: "a low control room of screens and a window onto a white horizon | a small amber ring in the ceiling; a coffee flask; a console",
      vault_in: "a minus-forty core vault of racked ice cores | frost on steel; a single warm section at the far end; a red valve wheel",
      end: "a polar station corridor in morning light | a window onto the ice; a taped coin on a door; a mug",
      "fight:vault": "a core vault | a vault door, racks of core and a warm section"
    },
    "tidewater": {
      harbour: "a glass-walled harbourmaster's office over a lagoon | lines of lit gondolas at pontoons; a tide table on the wall; a brass whistle on a hook",
      hospital: "a white hospital room with a bed by a window onto a canal | a paper cup; a borrowed anorak on a chair",
      bellini: "a tiny back canal behind a fish market | a hand-built wooden gondola on trestles under a tarpaulin; a stone landing; a straw boater",
      yard: "a long brick boatyard of cradles and slips | half-built gondolas; a net on a pole; slip-water",
      tide: "a long black canal between sunken palazzi at the lowest tide | a lit house at the end; a gondola with a single oar; still water",
      end: "a Venetian quay at dawn | blankets on a bench; a row of dark gondolas; rising tide",
      "fight:lagoon": "a drowned canal | a landing stage, a black canal and a gondola stern"
    },
    "the-climber": {
      base: "the operations floor at the foot of a space-elevator tether | a wall of screens; a manifest board; a nano-cable rising through a skylight",
      bay: "a vast steel hangar of climbing suits on hooks | tool-rolls on benches; a harness; a visor on a stand",
      lounge: "a bright passenger lounge with a long window onto a cable | rows of chairs; a coffee cart; a paper cup",
      cabin: "the empty cabin of a climber with a hundred and sixty-four seats | a small blue ring of light in the ceiling; long rows of seats",
      sixty: "the dark window of a climber cabin high on a cable | a thin pale ring above; a platform of lit windows hanging where nothing is",
      end: "an orbital ring arrival hall | a curved window; luggage carts; a clock ticking",
      "fight:sixtyone": "a platform of grey tile and pale light | a gangway, benches and a ticket hall with stopped clocks"
    },
    "rupture-season": {
      hq: "a field command tent on a sea-wall road in monsoon rain | a map table; an evacuation screen; modular transports queued",
      roof: "a flat rooftop in rain with a firing line of foam barricades | a wide view of a sea-wall; tracer lines; a drone gantry",
      pumps: "a flooded concrete sub-basement under a sea-wall | thigh-deep water; old pumps; valve wheels overhead",
      menon: "a pop-up laboratory under a tarpaulin in rain | a rack of spectrometers; folded graphs on a screen; a probe",
      oval: "a great green open field under rain-capes with a tear in the air at one edge | lines of seated shapes' capes; a road; transport lanes",
      bay: "a black bay under a curve of street-lights | a fold of nothing in the middle of the water; a sea-wall; a fast boat",
      end: "a sea-wall road at dawn, wet and gold | a mug of chai on a wall; an empty road; calm sea",
      "fight:oval": "an open field with a rupture at one end | a transport lane, a field and a rupture",
      "fight:charni": "a long narrow road of arcades with a rupture at the sea end | arcades, a road and a rupture",
      "fight:seam": "a black bay with a fold of nothing at its centre | a sea-wall, shallows and the seam"
    }
  },
  MONSTERS: {
    "long-count/tally": ["The Tally", "(a vast ledger-clerk of ink and cable seated at a desk made of server cabling, twenty arms writing, a face of rows of tiny sleeping eyes, a book the size of a door open before it:1.3), eldritch horror, monstrous"],
    "long-count/sleeper": ["A sleeper, walking", "(a Lagos resident in a sleep-shirt walking with open eyes, a grey band on one wrist glowing a number:1.3)"],
    "last-reef/reef": ["The Remembering Reef", "(a huge branching lattice of pink coral shaped like a drowned diver's hand, hundreds of tiny faces in its polyps, regulators and bubbles caught in its branches:1.3), eldritch horror, monstrous"],
    "last-reef/diver": ["A planted diver", "(a diver in a half-zipped wetsuit with a fine pink coral lattice growing under the skin of her forearms, regulator hanging, eyes calm:1.3), eldritch horror"],
    "heat-dome/mirage": ["The Cool Quarter", "(a tall avenue of neem trees standing upright like a figure, its shade a long black cloak, a table of ink-dripping clerks in its chest, countless cool white-tiled faces:1.3), eldritch horror, monstrous"],
    "heat-dome/shaded": ["A shaded one", "(a heat-stricken Delhi resident in a damp kurta walking calmly toward a patch of shade, a faint ink-black stain on his hands:1.3)"],
    "core-samples/voice": ["The Waiting Voice", "(a tall figure formed of a clear ice core with a speaker's grille of frost for a mouth, the crew's faces frozen in its length, a pulse of faint warmth in its centre:1.3), eldritch horror, monstrous"],
    "core-samples/walker": ["One who heard", "(a researcher in a thermal shirt and no gloves walking with calm open eyes, frost in her eyebrows, a station badge on a lanyard:1.3)"],
    "tidewater/boatman": ["The Boatman", "(a tall figure in a straw hat at the stern of a gondola, a long single oar, a face of calm still water with small lit rooms in it, hands of grey pear-wood:1.3), eldritch horror, monstrous"],
    "tidewater/gondola": ["A night gondola", "(a sleek black autonomous gondola with a lit prow like an eye, long oar-limbs of grey wood folding out of its sides, a lock of wet hair caught in its keel:1.3), eldritch horror, monstrous"],
    "the-climber/station": ["Floor 61", "(a long grey-tiled platform building itself in the shape of a hollow figure, a clock face in every window all showing the same minute, hundreds of hands holding grey tickets pressed against the glass:1.3), eldritch horror, monstrous"],
    "the-climber/dweller": ["A counted one", "(a travel-worn passenger in a rumpled jacket sitting stiffly with a grey ticket in his hand, his face a little too pale, a watch with no hands:1.3)"],
    "rupture-season/spawn": ["Rupture spawn", "(a swarm of small translucent pink-and-black creatures like squid made of static pulled out of a tear in the air, countless tiny eyes, salt-water streaming:1.3), eldritch horror, monstrous"],
    "rupture-season/brute": ["Tidal brute", "(a huge many-legged wall of salt-water and barnacled flesh walking on a hundred legs, a drowned city's windows glowing in its sides, a mouth of rusted sea-wall:1.3), eldritch horror, monstrous"],
    "rupture-season/mother": ["The Seam Mother", "(an enormous figure folded three times like a hand, a woman's face made of tide and street-lights, a thousand singing mouths along her folds, black sea running from her sleeves:1.3), eldritch horror, monstrous"]
  }
};
