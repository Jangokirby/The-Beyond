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
  STYLE: {
    medieval: "medieval egg tempera and gold leaf panel painting, Gothic altarpiece style, flat perspective, rich lapis blue and vermilion, cracked aged varnish, dark and solemn",
    victorian: "Victorian academic oil painting, Pre-Raphaelite detail, gaslight warmth, deep umber and bottle green, varnished canvas, dark and melancholy",
    wars: "1910s-1930s expressionist oil painting mixed with hand-tinted photograph, muted khaki, slate grey and sepia, bold angular brushwork, grain, dark and sombre",
    atomic: "1950s pulp magazine cover illustration in gouache, saturated Kodachrome colour, dramatic rim lighting, hard shadows, lurid and menacing",
    modern: "1990s painted VHS cover and film poster art, airbrush, sodium orange and cathode cyan, film grain, flash-lit, eerie",
    now: "contemporary cinematic digital painting, cool teal and black with neon and LED glow, sharp detail, rain-slick reflections, a touch of cyberpunk, unsettling"
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
