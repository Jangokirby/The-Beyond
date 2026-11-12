# Reply to the picture pipeline: list v6

Written 2026-11-11, after the game's cases were rebuilt. This is the list your v6 instructions asked for.

Files (in this folder):
- `asset-list-v6.csv`: every picture the game uses (907 rows). Columns: file, size, subject, group, era, kind, year, hero, prompt, negative, note. The `style` column is gone.
- `asset-list-v6-todo.csv`: the same, without the patrons and the title screen (which keep the rulebook's art): 889 rows to make.
- `ASSET-LIST-v6.md`: the same list to read, grouped by case.
- `V6-PICTURE-RULES.md`: your v6 rules, which the list was written to.

## Delivery size (please)
The game shows portraits at 28 to 96 pixels, so **512x512 is plenty** for portraits, monsters, items and emblems; places and fight backdrops are **1344x768**. Please send **JPEG at about 80% quality** (same base file name, any extension). The size column in the CSV is now that delivery size. The full set comes to under 100 MB; full-size PNGs are not needed and are too big to move around. Generating larger and scaling down is fine.

## Changes since the first v6 list
- Agent portraits are adults, mostly in their twenties to forties, with a few in their fifties. No frail elders, and no old soldiers.
- Heritage pool widened to 22 (British, Italian, Polish, Russian, Irish, French, American, Scandinavian, Turkish, Pacific Islander, Maori, Filipino, Korean, Japanese, Chinese, Indian, Arab, West African, Afro-Caribbean, Black American, Mexican, Brazilian). Every group of ten has ten different heritages. Named people take theirs from where their case is set.

What is in it: 280 portraits (120 agents with 120 different outfits across 16 heritages (British, French, Italian, Polish, American, West African, Afro-Caribbean, Black American, Japanese, Chinese, Vietnamese, Indian, Arab, Persian, Mexican, Brazilian; about eight of each, spread across every era and sex), and named people take their heritage from where their case is set, 12 knights and soldiers, and every named person of every case), 399 places (every scene and fight backdrop of 36 cases, all the Death of a Bloodline places that were missing, and the generic ones), 142 monsters (every enemy of every case, the Death of a Bloodline boss forms, and the generic ones by era), 57 items, 6 hideouts, 5 emblems, plus the title screen and patrons (marked keep).

How each rule was met:
1. No style words: the `style` column is empty, and a check script scans every prompt for the banned list (none left).
2. Era by content: every place row has three weighted era objects chosen for that case's year; every portrait is dressed in dated garments.
3. Setting by content: every place row repeats the case's country, city or region and building, and local materials (outdoors).
4. Subject first: the hero is the first phrase, weighted 1.3, once per picture.
5. Interiors: the interior rows list indoor objects only; outdoor rows list local materials.
6. Places are empty; fight backdrops end "plain empty ground across the bottom third"; scenes end "calm empty space on the right third".
7. Portraits start "head-and-shoulders portrait of" and end ", face in the upper middle"; the background is "a dim plain wall"; every agent of an era and sex has a different outfit of two or three garments and one detail.
8. Monsters: wrongness in anatomy and materials, "eldritch horror" or "monstrous" in every creature row. Human enemies (villagers, sleepwalkers) are shown as people with one telling detail.
9. Negatives: only what is specific to the row.
10. No readable text.
11. Complete: Death of a Bloodline's 20 places, hideouts, items and emblems are all in. File names follow the same pattern as before; the new cases' files are `scenes/<case>-<scene>.png`, `portraits/npc/<case>-<person>.png` and `monsters/<case>-<enemy>.png`.
12. Length: places and portraits are about 40 to 65 words.

What was dropped: the generated side jobs and their "threat" monsters (18 rows) no longer exist in the game. What stays generic: the 84 stand-in places and 60 stand-in monsters, because cases a game master writes (and the Director) still use them.

Two things to know: (a) the named people of Death of a Bloodline have no recorded sex in the game's data, so their rows say "a person" with the description from the case. (b) A few places (the end-of-case scenes) reuse the look of an earlier scene of the same case on purpose, at dawn or after the event.
