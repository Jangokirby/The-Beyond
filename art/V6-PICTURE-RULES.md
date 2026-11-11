# Picture list v6: the owner's instructions (2026-11-11), kept here so they are never lost

Source: INSTRUCTIONS-FOR-ASSET-AI-v6.txt from the picture generator's side. Where it disagrees with any older
briefing, THIS wins. Write the v6 list to these rules AFTER the case restructure is finished.

Short version: (1) NO style, palette, lighting or mood words anywhere: the generator adds one fixed style tail.
(2) Make each era and each place unmistakable from the CONTENT of the row. (3) Hero subject first.

Row becomes: [lead for places/monsters/items] + MY PROMPT + FIXED STYLE TAIL ("classical oil painting by Floris
Arntzenius, Hague School, ..."; do not imitate it). Negative = standard list + MY NEGATIVE + type items.

1. NO STYLE WORDS. `style` column EMPTY. Banned: oil painting, gouache, tempera, airbrush, matte painting,
   illustration, cinematic, film grain, VHS, halftone, photograph, dramatic lighting, moody, "dark and unsettling",
   atmospheric, glow, flare, saturated, neon (as a colour), sepia, palette colour names (teal, turquoise, magenta,
   mustard, bruise purple). A light source is fine as an OBJECT (a bare bulb, a gas bracket, a fluorescent tube).
   A colour is fine on an object (a red enamel sign, a green leather jacket).
2. ERA BY CONTENT. At least three era-specific objects or garments per row, each weighted 1.2 to 1.4. Drop words
   that date nothing: old, antique, vintage, weathered, worn, gothic, cobbled, rustic, period.
3. SETTING BY CONTENT. Every row names country/city/region, kind of building, and 3+ local materials/objects.
   Repeat the case's setting in EVERY row (the generator cannot read headings). Non-Western: local building
   words (danchi, fusuma, shoji, tatami, genkan, vending machines, overhead wires, corrugated roofs, minarets).
4. SUBJECT FIRST. Hero subject weighted, nothing before it. One hero per picture.
5. INTERIORS ARE INDOORS: furniture, appliances, light fittings, window view. Never a street list indoors.
6. PLACES ARE EMPTY: no people, faces, crowds, silhouettes. Fight backdrops: plain bottom third. Scenes: calm right third.
7. PORTRAITS: start "head-and-shoulders portrait of (...)", end ", face in the upper middle". Background: a dim plain
   wall or one simple object; NO coloured wall, neon sign or coloured backdrop. Every agent of an era and sex has a
   different outfit: 2-3 SPECIFIC garments + one distinguishing detail (a repaired sleeve, a medal ribbon), never
   "or" lists. Vary heritage, age, build.
8. MONSTERS MUST LOOK LIKE MONSTERS: wrongness in visible anatomy and materials ("a mouth where the chest should be",
   "countless eyes", "wet sinew between the rotors"). Add "eldritch horror" or "monstrous". Never rely on "spirit" or
   "ghost" alone. Test: from the words alone, would a stranger say monster, not a person or an animal?
9. NEGATIVES: only what is specific to the row and tends to appear by mistake ("(multiple people:1.3)",
   "(a cute dog:1.3)"). Never forbid the row's own era. No style negatives.
10. NO READABLE TEXT: describe a sign's shape and colour, not what it says. No headlines, labels, book titles.
11. COMPLETE AND STABLE: list EVERY picture, including all Death of a Bloodline places (they were missing from
    the CSV), hideouts, items, emblems. Keep file names exactly as in earlier lists.
12. LENGTH: about 40 to 70 words per prompt.

CSV columns: file, size, subject, group, era (medieval, victorian, wars, atomic, modern, now, items), kind, year,
hero, prompt, negative, note. `style` empty or omitted. Doubled quote marks inside fields.

Check each row: country+decade+kind of place guessable? 3+ weighted era objects? style/palette/lighting/mood words
gone? hero first? interior indoor-only? monster monstrous in words? agents' outfits all different? case setting
repeated in this row? every picture present with its original file name?

Worked example (place): (a narrow kitchen in a 1970s Japanese danchi apartment, two-ring gas hob, aluminium sink,
a sliding fusuma door to a tatami room, a fluorescent ceiling light, Tokyo:1.3), dishes in the sink, a paper
calendar on the wall, wide view
Worked example (monster): (a tall figure of television static in a 1950s suit and hat, its face a blank glowing
screen, cables trailing from its sleeves:1.3), eldritch horror, full figure, centred, plain dark background

Test sheets showed: row FIRST + fixed style LAST (the "tail recipe") beats per-era recipes. Era comes from content.
