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
  HERITAGE: ["white European", "Black African", "South Asian", "East Asian", "Middle Eastern", "Latin American", "Afro-Caribbean", "Southeast Asian", "North African", "Mediterranean"]
};
