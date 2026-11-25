# Map Studio: start here

**What it is:** tools that build maps (rooms, outdoors, whole cases) and bring in 3D assets and characters for The Beyond. It runs on your own PC.

## To use it yourself
1. One time: `node mapstudio/setup.js`
2. Each time: `node mapstudio/studio.js --open` (a page opens with everything: Map Builder, Map Lab, tool console)
3. In the Map Builder, pick a kind of place and press **Generate**.

## To let Overlord's goblins use it
Run `node mapstudio/overlord/install-into-overlord.js <Overlord folder>`, restart Overlord, and use this folder as the Overlord project (details: `mapstudio/overlord/INSTALL.md`). After that the goblins start Map Studio by themselves.

## To bring in bought 3D packs (Unity / Fab)
Convert to `.glb` with Blender (`mapstudio/convert/fbx_to_glb.py`), then use `import_models` with `licensed: true` (keeps the files out of git). Commit only the maps you render.

## That's all you need. The rest is detail for when you want it
- `mapstudio/README.md`: setup details, the HTTP API, the Den notes, licence notes
- `MAPS.md`: the full tool list and the rules agents follow
- `CHARACTER-IMPORT.md`: how character models must be built
- `mapstudio/AGENT-BRIEF.md`: the instructions the goblins read

Check everything works: `node tools/room3d/selftest.js` (ends with "all passed").
