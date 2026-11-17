# Letting an AI use the map tool

The map tool is built so a person, a script, a local model or a cloud model can all drive the same thing. Everything is plain JSON and every
mistake comes back as a plain sentence saying what to fix, so even a small local model can correct itself.

## What it can do
Make and edit rooms; check them (overlaps, pieces outside the room, doors or examine spots that cannot be reached); draw a room as text so a
model without vision can "see" it; render a room to a picture and a map pack the game uses; **define new pieces of furniture as data**
(boxes, cylinders, cones, spheres); **import free 3D models** (.glb); **convert Dungeon Alchemist / Dungeondraft exports** (.dd2vtt) into
map packs; **install a map into a scene of a written case**; map a whole case automatically.

## Ways to plug a model in (pick one)
1. **MCP (best: works with Claude Desktop, Claude Code, Cursor, and local setups like LM Studio or Open WebUI with an MCP bridge).**
   Add to the client's MCP config:

       { "mcpServers": { "beyond-maps": { "command": "node", "args": ["/full/path/to/the-beyond/tools/room3d/mcp.js"] } } }

2. **Function calling (any model that supports tools: OpenAI-style APIs, Ollama with tool-capable models, Anthropic API).**
   `tools/room3d/tools.json` has the tool list in both shapes (`openai` and `anthropic`). When the model calls a tool, run
   `node tools/room3d/cli.js <tool_name> '<the arguments as JSON>'` and give the output back to the model.
3. **Command line only (any agent that can run commands: Claude Code, Aider, Open Interpreter).** `node tools/room3d/cli.js help`.
4. **No tools at all.** Paste the system prompt below, ask for the JSON ops, run `apply_ops` yourself, and paste back `ascii` and `validate`.

## A system prompt that works for small models
> You build top-down room maps for a horror RPG. Work in this loop: `new_room`, then `apply_ops` (try `furnish` with a preset first, then add or move
> pieces), then `validate` and `ascii`. Fix every problem `validate` reports, then `render`. x runs left to right (0 to w), z runs top to bottom
> (0 to h); the back wall is z=0, the camera looks from the bottom. Use only piece ids from `list_pieces`. Leave walking space between pieces and in front of
> doors. Put an examine spot (`add_thing`) on 2 to 5 pieces and say what the players see in one or two plain sentences. Never invent a piece id: if you need a new
> kind of furniture, define it with `add_piece_type` using boxes and cylinders, then use it.

## Adding assets from free sources
- **3D models (.glb/.gltf):** put the file anywhere and run `node tools/room3d/cli.js import_model '{"file":"/path/chair.glb","id":"old_chair","name":"Old chair","tags":["any"],"height":0.9}'`.
  It measures the model, scales it to the height you give, and adds it to the catalog. Free sources: Kenney, Quaternius, Poly Haven, Sketchfab (check the licence).
- **Maps from Dungeon Alchemist, Dungeondraft or any VTT:** export as `.dd2vtt`/`.uvtt`, then `import_vtt`, then `install_map` into a scene.
  Dungeon Alchemist is fantasy-themed, so use it for fantasy places and this tool's kit for the rest.
- **Local image-to-3D tools** (such as Hunyuan3D or TripoSR) make .glb files: feed those to `import_model`.

## Honest limits
Models make bad layouts sometimes: that is why `validate` and `ascii` exist. Small models do best with a preset plus a few edits. Pieces made from
primitives look like the current style (clean and simple); .glb models can look very different from them, so test one before importing a hundred.
