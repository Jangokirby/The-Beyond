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

## Eras (what exists for each period)
The auto-mapper reads the case's **year, setting and theme** plus each scene's name, and picks a period-right preset. Check the choices for any case without drawing anything:
`node tools/room3d/automap.js --plan [case ...]`

| Period | Rooms | Outdoors |
|---|---|---|
| Medieval and older (to 1700) | great_hall, dungeon, smithy, chapel, tavern | medieval_village, castle_yard, graveyard, woods, ruins, temple_court, desert_town |
| Victorian to WWII (1700-1960) | tenement, factory, theatre, cinema, gallery, ward, study, cellar, canteen | street, yard, trench, harbour, rail, ship_deck, garden |
| Modern (1960-2070) | apartment, office_mod, shop, subway, server_room, hospital_mod | modern_street, rooftop |
| Far future (2070+) | lab_scifi, corridor, cargo_bay, quarters, reactor_hall | neon_alley, orbital, rooftop |
| Anywhere | train_car | jungle, reef, polar_station, snowfield, camp |

About 100 era pieces live in `public/lab/pieces/era-*.json`, written by `node tools/room3d/make-era-pieces.js` (add a piece = add one line, run it). New floors: asphalt, carpet, marble, metal, flag, water, gravel, sand. New walls: stone, metal, adobe, tin, whitewash. Glowing materials for neon, screens, torches.
To change which preset a word picks, edit `ERA_RULES` / `GENERIC` in `public/lab/auto.js`.

## For agents (Overlord and other local AIs): the contract
**Stable contract.** The tool list `TOOLS` in `public/lab/api.js` (also `tools/room3d/tools.json`, the MCP server `tools/room3d/mcp.js` and the CLI `tools/room3d/cli.js`) is what outside agents depend on.
Tools (23, defined once in `TOOLS` in `public/lab/api.js`; the MCP server reads that list and `node tools/room3d/build-tools-json.js` regenerates `tools.json`): `list_pieces, list_presets, new_room, apply_ops, validate, ascii, render, add_piece_type, import_model, import_vtt, install_map, plan_case, map_case, list_bust_parts, suggest_bust, render_portrait`.
Check a machine or a change with `node tools/room3d/selftest.js` (runs every tool once, cleans up after itself).
Ops for `apply_ops`: `set_style, furnish, clear_props, add_piece, move_piece, remove_piece, add_door, add_window, add_wall, add_thing, set_npc, set_start`.
Rule: **adding** tools, ops, presets or pieces is fine. **Renaming or removing** any of the above needs a note here first. Layout fields (`w,h,style{floor,wall,mood,outdoor},walls,doors,windows,props{t,x,z,rot},things,npcs,start`) follow the same rule.
`style.outdoor: true` draws no walls (walls still block walking). `furnish{preset}` takes any id from `presets()`; new era presets are listed in the Eras table above.

**Running outside the browser.** `api.js` is plain data logic and runs in Node. Only drawing needs a browser: `render` and `map_case` start the game's own server and drive headless Chromium (Playwright) with
`--use-gl=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist` (CPU rendering, no GPU needed). Era pieces are plain JSON in `public/lab/pieces/*.json` listed in `pieces/index.json`; nothing special is needed. A new piece an agent adds with `add_piece_type` goes to `pieces/custom.json` and is added to the index (the era generator keeps such extra entries).
Models (`.glb`) go in `public/lab/models/` and become pieces through `import_model` (needs size and a name; the kit scales to metres).

**Where AI-made maps go.**
- One-off room: `public/lab/layouts/<name>.json` (the layout) and `public/lab/maps/<name>.beyondmap` + `.jpg` (what `render` writes). Open it in `/lab/editor.html` (Load layout) to check it.
- A scene of a written case: `public/lab/maps/<case-id>/<scene-id>.beyondmap`, with that case's `index.json` holding `start`, `npcs`, `spots` for each scene, and the case id listed in `public/lab/maps/index.json`. The tool `install_map` does all three; so does `map_case`.
- **Start with `map_case` (`automap.js`), then hand-tune.** It makes a period-right first draft for every scene for free. Check its choices first with `node tools/room3d/automap.js --plan <case>` (nothing is drawn). Then improve single scenes: new_room + apply_ops (or load the layout), `validate`, `ascii`, `render`, and look at the picture. Re-running `automap` on a case overwrites its maps, so do the hand-tuning after, and `install_map` the result.
- Nothing in the repo pushes by itself. Review the maps in `/lab/editor.html` or the game, then commit.

## Outdoors
Presets `street, woods, camp, yard, graveyard, harbour, trench, snowfield` build outdoor maps (ground, trees, tents, lamps, fences, boats, sandbags). The auto-mapper chooses
indoor or outdoor from the scene's theme and name. Outdoor pieces are data files in `public/lab/pieces/outdoor.json`.

## What this is for
Each place in each case gets a layout. Places repeat as types (a ward, a cellar, a street), so a preset gets most of the way and the examine spots and people come from the case text.

## Characters
**Real characters come from 3D models** made by another tool (Overlord, Blender, a 3D generator): see `CHARACTER-IMPORT.md` for the exact model rules. Tools: `inspect_character_model`, `import_character`, `list_character_kit`, `render_character`, `import_models`, `list_kits`, `register_kit` (base body + swappable parts, tinted by material name, rendered as portraits or full body). Kit file: `public/lab/characters/kit.json`.
**Prototype busts** (smooth mannequin heads built from code) are kept as a stand-in until real models exist: `/lab/characters.html`, `list_bust_parts`, `suggest_bust`, `render_portrait`. Rules in `public/lab/bust-rules.js` (period-right clothes and facial hair from era, job, age, origin).

## Map Studio (the local app) and bought 3D packs
`studio/` packages everything as a program that runs on your computer: a hub page, the Map Builder, Map Lab and Character Builder, and an HTTP API so other apps (Overlord) can call every tool. See `studio/README.md` (setup, run, API, desktop window).
Bought Unity/Unreal packs: convert to `.glb` (`studio/convert/fbx_to_glb.py`), then `import_models` with `licensed: true` (models and piece files stay out of git), and `register_kit` for modular wall/door/floor sets, used with `style.kit`. Commit rendered maps only.
Tools added: `import_models` (a whole folder, one measuring pass), `list_kits`, `register_kit`. Contract unchanged: only additions.
