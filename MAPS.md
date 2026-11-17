# Maps: how they are made, and what to reuse

**Everything lives in `public/lab/`.** Nothing here touches the game itself.

| File | What it is |
|---|---|
| `kit.js` | The pieces (`CATALOG`: 27 so far: beds, desks, tables, shelves, barrels, stoves, lamps...) and the builder that turns a layout into a 3D room and renders it from a tilted camera. |
| `gen.js` | Auto-furnishing presets (ward, tavern, study, office, cellar, bedroom, canteen). Starting points to edit, not finished rooms. |
| `editor.html` | The Map Builder: size the room, draw walls, place doors and windows, drop pieces, mark examine spots and a person, fill from a preset, render a 3D preview, save. |
| `index.html` | The Map Lab: walk a map (WASD or click), examine, open doors, talk in a close-up, lights out. Opens `.beyondmap` packs and Dungeondraft `.dd2vtt` files. |
| `layouts/`, `maps/` | Saved layouts and finished map packs (`.beyondmap` = picture + walls + lights + examine spots in one file). |
| `tools/room3d/render.js` | The same renderer from the command line: `node tools/room3d/render.js preset:tavern:16:11 public/lab/maps/tavern` |

## To make a map
1. Open `/lab/editor.html`. Set the size, pick a preset and press Fill (or place pieces by hand), add walls, doors, windows.
2. Click an object or use "Examine spot" to say what you see and what a search finds.
3. Render 3D to check it, then Download map pack (or Test in the lab).

## To add a piece
Add one entry to `CATALOG` in `kit.js`: a name, tags, a footprint `[width, depth]` in metres, whether it blocks you, and a `make` that builds it from boxes and cylinders (look at `desk` or `barrel`). It then appears in the editor and in presets.

## To add an era's look
Add floor and wall surfaces to `FLOORS` and `WALLS`, then pieces tagged for that period. A new era is mostly pieces (40 or so cover a period).

## What this is for
Each place in each case gets a layout. Places repeat as types (a ward, a cellar, a street), so a preset gets most of the way and the examine spots and people come from the case text.
