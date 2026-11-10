# Era styles for pictures

Every picture tied to an era is painted in that era's own medium, so a face from 1190 and a face from 2026 never look like
the same artist painted them. In `asset-list-v4-todo.csv` the **style** column replaces the single house style used for
Art 1 (the Floris Arntzenius / Hague School words): put the row's style words at the start of its prompt instead.
The tone stays the same everywhere: dark, quiet, something wrong.

Version 4 builds each era's style from five parts so the eras differ on every axis: **medium**, **light**,
**palette**, **texture** (the print or film it seems to come from) and **tech** in frame. Late Century and Present
were too close to each other; they are now pulled far apart.

| Era | Medium | Light | Palette | Texture | Tech in frame |
|---|---|---|---|---|---|
| Medieval | egg tempera and gold leaf, Gothic altarpiece | candle, torch, rushlight; gold-leaf glow | lapis, vermilion, bone, gold | craquelure, worn gesso | no glass, no lamps but flame |
| Victorian | academic oil, Pre-Raphaelite detail | amber gaslight in fog | umber, bottle green, oxblood, sepia | varnished canvas, albumen-print sepia | gas lamps, brass, steam, no electric light |
| World Wars | expressionist oil with hand-tinted photograph | flat grey daylight, bare bulbs, searchlights | khaki, slate, mud, one tinted accent | newsprint halftone, dust, grain | lorries, field telephones, gas masks, posters |
| Atomic | 1950s pulp-cover gouache | coloured rim light, neon, fluorescent | Kodachrome red, turquoise, mustard, cream | faint halftone dot | chrome, fins, TV aerials, valve radios |
| Late Century | 1990s horror paperback and VHS box art, airbrush | harsh on-camera flash, sodium orange against CRT green | sodium orange, CRT green, bruise purple, washed blacks | film grain, VHS tracking lines, colour fringing | CRTs, beige PCs, payphones, pagers, camcorders, tapes |
| Present | prestige-TV cinematography as a digital matte painting | cold LED, magenta neon, phone glow, lens flare | cyan, teal, magenta, crushed black | razor-sharp, shallow focus, rain reflections | smartphones, LED billboards, drones, smart speakers |

People: the wardrobe for each era is spelled out in the prompt (coif and kirtle; frock coat and watch chain; cloche hat or
greatcoat; flannel suit or beehive; 90s denim and pagers; tech shells and earbuds), and the background behind a portrait
dates it too (candlelit stone; gaslit damask; a sepia office; a neon sign; a CRT glow; city LEDs in the rain).
