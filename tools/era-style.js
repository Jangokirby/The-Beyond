/* ============================================================================
   ERA STYLE — what makes a picture from one era look like that era.
   Used by tools/asset-list.js. Every picture tied to an era gets:
     style     the medium it's painted in (replaces the single house style,
               so a 1190 face and a 2026 face never look like the same artist)
     wardrobe  what people wear, by gender, spelled out
     backdrop  what's behind a portrait
     markers   the things in a place that date it: light, transport, signs
   The tone stays the same in every era: dark, quiet, something wrong.
   ========================================================================== */
module.exports = {
  /* v4: each era's look is built from five parts, so the eras pull apart on every axis, not just the medium:
     medium (how it is painted), light (what lights the scene), palette, texture (the print or film it looks like
     it came from) and tech (what is in the frame). Atomic was already distinct; Late Century and Present are now
     pushed far apart from it and from each other. */
  PARTS: {
    medieval: { medium: "medieval egg tempera and gold leaf panel painting, Gothic altarpiece style, flat perspective, figures outlined in dark line", light: "candle, torch and rushlight only, gold-leaf glow behind the subject", palette: "lapis blue, vermilion, bone white and burnished gold on near-black", texture: "cracked aged varnish, worn gesso, tiny craquelure", tech: "no glass windows, no lamps but flame, iron, wood, wool and stone" },
    victorian: { medium: "Victorian academic oil painting with Pre-Raphaelite detail, soft glazes", light: "warm amber gaslight and oil lamps, deep shadow, fog diffusing every light", palette: "umber, bottle green, oxblood and sepia", texture: "varnished canvas with the faint sepia of an albumen photograph", tech: "gas lamps, brass, cast iron, steam, top hats, no electric light" },
    wars: { medium: "1910s-1930s expressionist oil painting mixed with a hand-tinted photograph, bold angular brushwork", light: "flat grey daylight, bare electric bulbs, flare and searchlight glare", palette: "muted khaki, slate grey, mud brown and sepia with one tinted accent", texture: "newsprint halftone and dust, heavy grain, faded tinting", tech: "early motor lorries, telegraph wires, field telephones, gas masks, sandbags, propaganda posters" },
    atomic: { medium: "1950s pulp magazine cover illustration in gouache", light: "dramatic coloured rim lighting and hard shadows, neon and fluorescent glow", palette: "saturated Kodachrome reds, turquoise, mustard and cream", texture: "smooth gouache with a faint halftone print dot", tech: "chrome, tail fins, television aerials, valve radios, neon diner signs, civil-defence posters" },
    modern: { medium: "late-1980s and 1990s horror paperback and VHS box art in airbrushed acrylic", light: "harsh on-camera flash with hard drop shadows, sodium-vapour orange street light against cathode-ray green and blue", palette: "sodium orange, CRT green, bruise purple and washed-out blacks", texture: "heavy film grain, VHS tracking lines and colour fringing at the edges, slightly soft focus", tech: "chunky CRT televisions and beige computers, payphones, pagers, flip phones, camcorders, VHS tapes, boxy 1990s cars" },
    now: { medium: "contemporary prestige-TV cinematography rendered as a digital matte painting", light: "cold blue-white LED light and magenta neon, phone-screen glow on faces, anamorphic lens flare", palette: "cyan, teal, magenta and crushed black", texture: "razor-sharp detail, shallow depth of field, rain-slick reflections, clean digital noise", tech: "smartphones, LED billboards, delivery drones, glass towers, e-scooters, smart speakers, CCTV domes, a touch of cyberpunk" }
  },
  get STYLE() {
    const o = {};
    for (const [k, p] of Object.entries(this.PARTS)) o[k] = `${p.medium}, ${p.light}, ${p.palette}, ${p.texture}, dark and unsettling`;
    return o;
  },
  WARDROBE: {
    medieval: { f: "a linen coif or veil, a wool kirtle and surcoat, a cloak pinned with a brooch, a rosary or pilgrim badge", m: "a hooded wool cloak, a tunic and belt, a gambeson or a monk's habit, a pilgrim badge or a cross on a cord" },
    victorian: { f: "a high-collared dark dress with jet buttons, a cameo, hair pinned up, a bonnet or veiled hat", m: "a frock coat, waistcoat with a watch chain, a high starched collar and cravat, side whiskers or a waxed moustache, a top hat or bowler" },
    wars: { f: "a 1920s cloche hat or bobbed hair, a drop-waist coat or a nurse's or land-army uniform, a long string of beads", m: "a 1910s-30s trench coat or army greatcoat, a flat cap or fedora, a stiff collar and tie, a pencil moustache or clean-shaven" },
    atomic: { f: "1950s-60s victory rolls or a beehive, cat-eye glasses, a pencil skirt suit or a swing dress, red lipstick", m: "a 1950s-60s grey flannel suit and narrow tie, a crew cut or slicked quiff, horn-rimmed glasses, a fedora or a leather jacket" },
    modern: { f: "1990s oversized denim jacket or flannel shirt, a choker, big hair or a sleek bob, a pager or a Walkman", m: "1990s windbreaker or leather jacket, an oversized shirt, curtain hair or a buzz cut, a pager clipped to the belt" },
    now: { f: "a technical shell jacket or a tailored modern coat, wireless earbuds, a smartwatch, a lanyard or face mask round the neck", m: "a technical jacket or hoodie under a modern coat, wireless earbuds, a smartwatch, a tactical vest or messenger bag" }
  },
  BACKDROP: {
    medieval: "a dim background of candlelit stone and a gold-leaf halo of light",
    victorian: "a dim background of gaslit damask wallpaper",
    wars: "a dim background of a sepia office or sandbags, out of focus",
    atomic: "a dim background with a blurred neon sign and a television glow",
    modern: "a dim background of a flickering CRT screen and a payphone, out of focus",
    now: "a dim background of rain on glass and city LED screens, out of focus"
  },
  MARKERS: {
    medieval: "torches and rushlights only, thatch and timber and rough stone, carts and horses, no glass windows, no street lamps, no modern objects",
    victorian: "gas lamps, horse-drawn carriages, chimney smoke, cobbles, cast-iron railings, sash windows, no cars, no electric light",
    wars: "bare electric bulbs and early street lamps, 1910s-30s motor cars or army lorries, telegraph poles, faded posters, sandbags",
    atomic: "neon signs, chrome, 1950s-60s cars with fins, television aerials on the roofs, fluorescent light, diner signs",
    modern: "sodium-orange street lights, a payphone, satellite dishes, 1990s cars, CRT monitors and VHS tapes, flickering fluorescent tubes",
    now: "LED screens and signs, glass towers, phone glow, electric scooters, CCTV cameras, delivery drones far off, cold white LED light"
  },

  /* ---------------------------------------------------------------- v5: concrete, era-true things to put in a row
     (light and palette words are NOT here: the picture generator adds its own era cues for those.)
     Late Century is split: "modern" is the 1990s and early 2000s; "late" is 2007-2021 (smartphones, flat screens, LED bulbs). */
  eraKey(era, year) { return era === "modern" && year >= 2007 ? "late" : era; },
  ERAWORD: {
    medieval: "medieval Europe", victorian: "the Victorian era", wars: "the 1910s to 1940s", atomic: "the 1950s to 1980s",
    modern: "the 1990s and early 2000s, before smartphones", late: "the late 2000s and 2010s, the smartphone era", now: "the present day, 2020s"
  },
  /* outdoor, street-level things */
  STREET: {
    medieval: "timber-framed houses with thatch, a muddy rutted lane, a well, a wayside cross, ox carts and pack horses",
    victorian: "gas lamp posts, cast-iron railings, horse-drawn cabs and drays, sooty brick terraces, shop fronts with small panes",
    wars: "motor lorries and a Model T, telegraph poles, sandbag walls, enamel advertising signs, a hand-painted wartime poster shape",
    atomic: "tail-fin cars at the kerb, a neon diner sign, television aerials on the roofs, a roadside billboard shape, chrome and glass storefronts",
    modern: "boxy 1990s hatchbacks, a payphone booth, a satellite dish on a flat roof, a hand-lettered shop sign shape, a bus stop with a paper timetable",
    late: "hatchbacks and SUVs, a flat-screen advert panel on a bus shelter, a mobile-phone mast, a cash-point, rental key boxes on a railing",
    now: "glass towers, LED advertising screens, electric scooters, a delivery drone far off, CCTV domes on poles, EV charging posts"
  },
  /* inside a home or office */
  INDOOR: {
    medieval: "stone hall with a central hearth fire and a trestle table, rush-strewn flagstones, an iron-hinged oak door, a shuttered slit window, tallow candles in an iron stand, exposed roof beams",
    victorian: "parlour with a gas bracket lamp on a papered wall, heavy velvet drapes, a mahogany table with an oil lamp, a cast-iron fireplace with a mantel clock, a sash window with fog outside",
    wars: "bare billet room with a single bulb on a flex, an iron bedstead with an army blanket, a black telephone on a deal desk, blackout paper on the window, a paraffin stove, a map pinned to the wall",
    atomic: "1950s living room with a walnut television set, a vinyl-covered sofa, a round-dial telephone, a console radio, venetian blinds, a fluorescent tube in the kitchen doorway",
    modern: "apartment with a bulky CRT television on a stand and a VCR, a beige desktop computer, a cordless phone, vertical blinds, tapes in a rack, a blinking answering machine",
    late: "rented flat with a flat-screen television on a wall bracket, a laptop and a router with green lights, a smartphone on a charger, a lockbox key by the door, IKEA shelves, a cheap LED lamp",
    now: "open-plan flat with a wall-mounted flat screen on standby, a laptop on a glass desk, a round smart speaker, LED strip lighting, a grey sofa, floor-to-ceiling windows onto city lights"
  },
  /* themes that are not a street or a room, one trace of the period each */
  WILD: {
    medieval: "a cart track and a wayside shrine", victorian: "a distant gas-lit road and a railway embankment", wars: "a line of telegraph poles and barbed wire",
    atomic: "a television mast on a far ridge and a dirt road with a tail-fin car", modern: "a satellite dish on a distant farmhouse and a pylon line", late: "a mobile-phone mast and a wind turbine on the horizon",
    now: "wind turbines and a pylon line on the horizon, a drone light in the sky"
  },
  /* themes that are rooms of a particular kind, by era (a missing entry falls back to INDOOR) */
  THEME_TECH: {
    church: { medieval: "stone nave with a rood screen and a carved font, rushlights before an altar", victorian: "box pews, gas brackets on the pillars, a brass lectern, a harmonium", wars: "sandbags against the window, a hand-lettered noticeboard shape, camp beds along the aisle",
      atomic: "folding chairs and a bare altar table, fluorescent tubes, an electric organ", modern: "stacking chairs, a TV on a trolley, a photocopied notice shape, fluorescent tubes", late: "stacking chairs, a projector and screen, a noticeboard of flyers shapes", now: "LED spotlights, a projector screen, a CCTV dome, a donation card reader" },
    cellar: { medieval: "stone vault with casks and sacks and a rushlight", victorian: "coal chute, wine racks, a gas bracket, a brick vault", wars: "a bare bulb, ammunition crates, a duckboard floor", atomic: "steel shelving of tinned food and water drums, a fallout-shelter sign shape, a bare bulb",
      modern: "a washing machine, boxes of video tapes, a bare bulb, an old sofa", late: "a boiler and meter box, storage boxes, a dehumidifier, a bare LED bulb", now: "a server rack, boxes, LED strip lights, a smart meter" },
    train: { victorian: "wooden compartments with brass luggage racks and a gas lamp, buttoned seats", wars: "slatted wooden seats, a blackout blind, a luggage net, a swaying bare bulb", atomic: "vinyl bench seats, a chrome luggage rack, a ceiling fan, a drop-down window", modern: "moulded plastic seats, a pull-down window, a scuffed floor, a faded route map shape", late: "grey fabric seats, a flat information screen, a charging socket, an emergency alarm handle", now: "a sleek carriage with LED strip lights, a map screen, a USB socket, a CCTV dome" },
    village: { medieval: "thatched cottages, a stone well, a duck pond, a wooden church tower", victorian: "a village green, a smithy, a church spire, cottage gardens, a post box", wars: "a war memorial shape, a red telephone box, an army lorry, sandbags at the pub door", atomic: "a post office, a single petrol pump, television aerials on the cottages", modern: "a phone box, a pub with a satellite dish, hatchbacks on the green", late: "a bus shelter, a broadband cabinet, a mobile-phone mast behind the church, SUVs on the green", now: "a bus shelter with a screen, an EV charge point, a fibre cabinet, a drone far off" },
    lab: { victorian: "brass microscopes, glass retorts, a gas burner, specimen jars", wars: "valve equipment, bakelite switches, a wooden bench, a bare bulb", atomic: "a Geiger counter, a reel-to-reel computer, steel benches, a fume cupboard",
      modern: "beige PCs and CRT monitors, a fume hood, plastic sample trays", late: "flat monitors, a centrifuge, plastic racks, a fume hood", now: "glass-walled lab, monitors, a centrifuge, white LED panels" }
  },
  /* portrait variety: rotated so that people of one era do not share a pose */
  POSES: ["head turned three-quarters to the left", "head turned three-quarters to the right", "facing the viewer, chin slightly raised", "head slightly bowed, eyes lifted", "in profile, looking away", "looking over one shoulder", "head tilted a little to one side", "facing the viewer squarely", "three-quarters left, eyes down", "three-quarters right, a half-turn smile"],
  EXPRESSIONS: ["a guarded half-smile", "a weary, level stare", "wary and alert", "grim and set", "quietly amused", "haunted, hollow-eyed", "tired but determined", "suspicious, one brow raised", "calm, almost serene", "worried, lips pressed"],
  BUILDS: ["slight build", "broad shoulders", "tall and angular", "stocky", "lean and wiry", "soft-faced and round-shouldered", "a firm jaw, strong shoulders", "narrow face, long neck", "a strong brow, sturdy frame", "delicate, high cheekbones"],
  WORN: ["a mended collar", "ink-stained fingers", "a healed scar on the chin", "a missing button", "a faded old bruise", "a worn leather strap across the chest", "rain-damp hair", "a chipped tooth", "a small tattoo at the wrist", "dust on the shoulders"],
  /* clothing worn by the Late Century people of 2007-2021 */
  WARDROBE_LATE: { f: "a puffer jacket or a cardigan, skinny jeans, a smartphone in hand, earbuds, a lanyard", m: "a hoodie or a bomber jacket, chinos or jeans, a smartphone in hand, earbuds, a rucksack strap" },
  HERITAGE: ["white European", "Black African", "South Asian", "East Asian", "Middle Eastern", "Latin American", "Afro-Caribbean", "Southeast Asian", "North African", "Mediterranean"]
};
