# Using Map Studio from Overlord (the goblin crew)

Overlord (the `Agents` repository) defines goblin tools in code (`src/main/tools.js`) and decides which goblin gets which in `src/main/roles.js`.
A goblin only knows about a tool if it is in that list, so Map Studio has to be added there. This folder is the ready-made addition.
It was written by reading Overlord's code and tested against a copy of it (cold start of Studio, a goblin tool call that made, validated and rendered a room, the project-folder fence, error messages). It has **not** been run inside the real Overlord app.

## What you get
Every Map Studio tool appears to the goblins as `mapstudio_<tool>` (for example `mapstudio_apply_ops`, `mapstudio_render`, `mapstudio_import_models`), with the right risk level (read tools never ask; anything that writes follows Overlord's normal approval mode).
Each goblin gets only what its job needs, because shorter tool lists suit small local models:

| Goblin | Gets | Why |
|---|---|---|
| Mapper | list pieces/presets/rooms/maps/kits, new_room, apply_ops, validate, ascii, render, plan_case, map_case, install_map | builds and tunes rooms and whole cases |
| Sculptor | add_piece_type, import_model(s), register_kit, character model import/inspect/render, portrait helpers | brings models into the game's kit |
| Snoop | list tools, validate, ascii, render, plan_case | checks the Mapper's work and looks at the picture |
| Foreman | list_rooms, list_maps, list_presets, plan_case | plans and reviews; never edits |
| Wizard, Grunt | all | general helpers |

## Install (in the Overlord repository folder)
1. Run: `node mapstudio/overlord/install-into-overlord.js <path to the Overlord folder>` (add `--check` first to see what it would do).
   It copies two files into Overlord's `src/main/` and adds one line to `tools.js` and one block to `roles.js`. It finds its places by what the code looks like, so small changes to Overlord do not break it, and running it twice is harmless. Tested against **Overlord v0.7.0**.
2. Restart Overlord.
3. Make the Overlord **project** the folder that holds The Beyond (it must contain `mapstudio/studio.js`), and run `node mapstudio/setup.js` once there, **as the same user that runs Overlord** (on a Linux server that is the user in the `overlord` service). After that, the first mapstudio tool a goblin uses starts Map Studio by itself (about 4 seconds); files it makes land inside the project.

**Names:** Overlord has its own "Studio" now (video shorts, stored in `<project>/studio/`). Map Studio is deliberately called `mapstudio` everywhere (folder, tools `mapstudio_*`, settings) so the two never mix.

Already running Studio somewhere else? Set `MAPSTUDIO_URL` (and `MAPSTUDIO_TOKEN`) for Overlord instead; then nothing is started and files are wherever that Studio runs.

## How goblins know what to do
- The tool descriptions come from Map Studio, so they are always current (re-run `node tools/room3d/build-overlord-adapter.js` after the tool list changes, then copy `mapstudio-tools.json` again).
- The roles file edit also tells Mapper, Sculptor, Snoop and Wizard to read `mapstudio/AGENT-BRIEF.md` first: the workflow and the rules (validate before render, never overwrite hand-tuned maps, licensed packs, no AI reference use of bought assets).
- Rooms are kept by name (`new_room`, then `room: "cellar"` on every later call), so a small model does not have to pass big JSON back and forth.

## Worth knowing
- The Mapper in Overlord is built for Godot scenes (`home: scenes`); its Godot tools stay available. For The Beyond (a web game) tell it to use the `mapstudio_*` tools, or hire a goblin just for maps.
- A goblin can now carry about 30 tools. If a small model gets confused, trim the Mapper's list in `build-overlord-adapter.js`.
- The 3D generator (the Forge) must not be given bought Fab/Unity assets as input; see the licence notes in `mapstudio/README.md`.
