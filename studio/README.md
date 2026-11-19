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

## On the Goblin Den (Ubuntu Desktop server)
- **Needs nobody logged in:** run it as a system service (`studio/goblin-studio.service`, a template: set the user and the checkout path). It is plain Node plus headless Chromium, with no desktop session.
- **Port 47330** does not clash with the Den's ports (dashboard 8080, Theater 8091, Jellyfin 8096, Rooms 8110-8115, Overlord 8090).
- **Auth:** set `GOBLIN_TOKEN` (or `STUDIO_TOKEN`) and send `X-Token: <token>` (or `Authorization: Bearer <token>`), the same convention as the dashboard API.
- **Overlord in Docker:** `localhost` inside a container is the container itself. Either run Overlord's calls against the host's address with `STUDIO_HOST=0.0.0.0` **and a token**, or run Overlord on the host. Do not expose the port beyond the Den's network.
- **GPU:** drawing uses the CPU by default so the RTX's VRAM stays free for the models. `STUDIO_GPU=1` lets Chromium use the GPU (faster, a few hundred MB of VRAM); not tested.
- **Not yet verified:** Playwright's Chromium on Ubuntu 26.04 (its official support list may lag a new Ubuntu). If `node tools/room3d/selftest.js` fails on drawing, run `sudo npx playwright install-deps chromium` first.
- Where apps should live on the Den (path under `/opt/goblinden`, data under `/srv/goblinden`) is a Den convention I haven't seen: adjust the unit's paths to match.

## Fab assets: what to check before using them with AI agents
Not legal advice; read the current Fab EULA (fab.com/eula) and each listing.
- **Using the models to make a game's pictures** (rendering them into maps) is the normal use under Fab's Standard License. **Redistributing the asset files themselves is not allowed**, so keep the models out of git (`licensed: true` does this) and publish only the rendered maps.
- **"NoAI" tag:** publishers can mark a listing NoAI. Fab's terms say you may not use NoAI content in datasets for generative AI, in developing generative AI programs, or as inputs to them. The EULA and the Terms of Service word this slightly differently ("training inputs" versus "inputs"), so the exact boundary is unclear.
- **What that means for an AI crew:** the tools place and render models with ordinary code, but if an agent *looks at* renders of NoAI assets (a vision QA step) or an AI 3D generator is *given* them as reference, that may count as use as an input. Safe habits: do not feed any bought asset to a 3D generator or use it as training or reference data; for NoAI-tagged packs, check the licence before letting a vision model see renders of them (placing pieces by id, tag and size is not looking at them).
- Check which licence your Humble keys give you (Standard or Professional) and whether each pack is tagged NoAI.
