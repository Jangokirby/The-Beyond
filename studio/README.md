# Map Studio (local app)

The map and character tools as one program that runs on your own computer, for you and for other apps such as Overlord.
Nothing leaves your machine. It needs **Node 18+**; drawing uses headless Chromium (no graphics card needed).

## First time
```
node studio/setup.js         # installs what drawing needs (Playwright + Chromium); does not change package.json
node tools/room3d/selftest.js    # optional: runs every tool once and cleans up (should end "all passed")
```
## Run
- `node studio/studio.js --open`  (or double-click `studio/start.bat` on Windows, run `studio/start.sh` on Mac/Linux)
  opens the hub at http://127.0.0.1:47330/ : links to the Map Builder, Map Lab and Character Builder, plus a console that runs any tool.
- **Desktop window** (optional): `cd studio && npm install && npm run app`. This is a thin Electron wrapper around the same server; it has not been run on a real desktop by the author.

## For Overlord and other programs
Plain HTTP on localhost, JSON in and out:
```
GET  /api/health          GET /api/tools          POST /api/tool/<name>   (body = the tool's arguments)
PUT  /api/upload/<file>   raw bytes -> { path }   (for agents on another machine)
POST /api/selftest
```
Tools run one at a time. The same tools are also available as a command line (`node tools/room3d/cli.js <tool> '<json>'`) and as an MCP server (`node tools/room3d/mcp.js`).
To allow other machines, set `STUDIO_HOST=0.0.0.0` **and** `STUDIO_TOKEN=<secret>`; send `Authorization: Bearer <secret>`.
`STUDIO_PORT` changes the port (default 47330).
The tool list and rules for agents are in `MAPS.md`; character model rules are in `CHARACTER-IMPORT.md`.

## Bringing in bought 3D packs (Unity, Unreal)
These arrive as Unity or Unreal packages, not `.glb`. Convert, then import in one go:
1. **Unity**: a `.unitypackage` is a gzipped archive; import it into a (free) Unity project, or extract it, and take the `.fbx` files and textures. **Unreal** (Fab) packs: open in the Unreal editor and export meshes to glTF/FBX.
2. FBX to GLB: `blender -b -P studio/convert/fbx_to_glb.py -- <fbx folder> <glb folder>`.
3. `import_models { dir: "<glb folder>", pack: "dungeon", licensed: true }`. Licensed packs go to git-ignored places (`public/lab/models/_licensed/`, `pieces/_licensed-*.json`, `pieces/index.local.json`): **commit only the maps you render**, never the models. Check the pack's licence for rendered images.
4. Modular kits (wall, corner, door, window, floor pieces on a grid): `register_kit { kit: { id, grid, wall, door, window, floor, licensed: true } }`, then `apply_ops set_style { style: { kit: "<id>" } }` and render. If the pack's pivots differ, adjust the kit with `rot` (degrees) and `offset` ([x,y,z] metres).
   Wall pieces are expected to face +z, centred on x, standing on y=0, one grid wide.
