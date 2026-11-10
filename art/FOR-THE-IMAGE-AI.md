# Reply to the picture pipeline briefing (list v5)

Written 2026-11-10. This goes with `asset-list.csv`, `asset-list-v5-todo.csv` and `ASSET-LIST.md`.

## What changed in the lists (your section 6, done)

1. **Era is explicit now.** New columns: `era` (medieval, victorian, wars, atomic, modern, now, or items), `kind`
   (portrait, monster, place, item, emblem, hideout), `year`, `variant`, `hero`, `mood`, `seed`. The era comes from the
   game's own era table, so you do not need the year thresholds or the file-name suffix any more. If the column is
   present, trust it. (Your thresholds, 1600/1910/1946/1985/2017, do not match the game's eras: medieval to 1852,
   Victorian 1853-1909, World Wars 1910-1948, Atomic 1949-1989, Late Century 1990-2021, Present 2022 on.)
2. **Rows no longer repeat era light and palette.** Those come from your cues. Rows carry concrete period things only:
   furniture, vehicles, appliances, clothing.
3. **Indoor rows are indoor.** Generic interior, cellar, church, lab, train and village rows each have their own
   per-era list. No row borrows the street list. The six interiors are in the CSV (`scenes/generic/interior-*.png`).
4. **No readable text anywhere** (signs, labels, countdowns, "ON AIR"): shapes only. **At most three weighted
   phrases** per prompt.
5. **Portraits vary** in head angle, expression, build and one worn detail. The shared tail "looking at the viewer,
   face in the upper middle" is gone.
6. **Recurring characters have one row and one file** (`portraits/npc/recurring-*.png`: Tobiah, June Hollister, Hale,
   Tolly, Ashgrove). The game shows that picture in every case they appear in.
7. **Drive-in screen**: rewritten as a blazing white screen, with "black screen, dark screen, dim screen" in the
   negative.
8. **Fight backdrops** no longer ask for a plain bottom third. The game darkens them and lays zones over them.

## Late Century is two looks (important)

The game's Late Century runs 1990-2021. Cases in it: Dial-Up (1999) and Vacancy (2016). Please treat `variant=late`
(2007-2021) separately from the 1990s:

| | 1990s and early 2000s (`variant` blank) | 2007-2021 (`variant=late`) |
|---|---|---|
| Light | harsh on-camera flash, sodium-vapour orange street light, a hint of CRT green | warm-white LED bulbs, phone-screen glow, grey overcast daylight, no orange sodium wash |
| Palette | washed-out blacks, beige, bruise purple | cool greys, muted teal, white plastic, a little orange |
| Technology | CRT televisions, VCRs, payphones, beige PCs, pagers | flat screens, smartphones, routers, rental key boxes, SUVs |
| Anachronism negative | smartphone, flat screen, LED | CRT, payphone, VHS, pager, drone |

Generic Late Century rows are the 1990s look. Only case rows carry `variant=late` (Vacancy).

## Suggested cue changes (light, palette and technology words only)

- **Medieval**: add "smoke haze", "wet stone", "wool and linen". For snow cases, "breath mist".
- **Victorian**: add "fog glow around every lamp", "soot-dark brick".
- **World Wars**: add "mud", "wet canvas", "breath in cold air", "paraffin lamp". Keep "one tinted accent".
- **Atomic**: fine. For 1970s cases, "faded orange and brown" is the cue to add.
- **Late Century**: see the table. Keep "washed-out blacks".
- **Present**: fine. "Soft grey overcast" helps the daylight rows.

## A second lever to test: a painter at low weight, per era

Keep Arntzenius in the lead. Add one era-matched painter at 0.3 to 0.5 and compare against the plain version on the
same seed:

- Victorian: Atkinson Grimshaw (gaslit wet streets), or Whistler's nocturnes.
- World Wars: Paul Nash, C. R. W. Nevinson.
- Atomic and Late Century: Edward Hopper (diners, motels, offices, sodium light).
- Present: Jeremy Mann (rain-slick city nights).
- Medieval: Pieter Bruegel the Elder.

SDXL knows some of these better than others. If a name does nothing at 0.4, drop it.

## Things in section 4 that work against us

1. **"dark moody atmosphere, deep shadows" in every lead.** Rows with `mood=bright` (daylight interiors, desert, snow,
   the white quarry) need that part dropped, or the picture comes out dim. They also carry "bright diffused daylight"
   in the prompt as a fallback.
2. **The Arntzenius weight on Late Century and Present.** Try 1.0 instead of 1.2 for those two eras. The name pulls
   everything toward 1800s Holland and Britain.
3. **Portraits on the photo model for the modern eras.** Try SDXL base, or lower guidance (5 to 6), for `modern` and
   `now` portraits only.
4. **Fixed seeds from file names.** Use the `seed` column (blank now) to re-roll a bad picture without rewording it.
5. **Items need an era too.** They use one still-life manner, which is fine, but the row names the period shape.
