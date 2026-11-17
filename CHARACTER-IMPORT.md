# Making characters for the game: model rules

For Overlord, Blender, or any 3D generator. A character is **one base body plus swappable parts** (hair, hat, beard, eyes, brows, mouth, nose, glasses, outfit),
drawn as portraits (head and shoulders) or full body. Keep models **simple, smooth or faceted, a little stylised**; faces can be nearly blank, the parts give the person.
Everything is checked by the tools, so you can iterate without a human: `inspect_character_model` -> fix -> `import_character` -> `render_character` -> look at the picture.

## File rules (all models)
- **.glb** (binary glTF 2.0), **static meshes only**: no armature, no skinned meshes (apply modifiers, delete the rig; bake poses if you need one).
- **Metres**, **+Y up**, **+Z is the front** (the way the character faces). Blender's glTF export does this if "+Y Up" is ticked.
- Keep it light: base <= 20,000 triangles, each part <= 5,000.
- **Name your materials** `skin`, `hair`, `cloth`, `cloth2`, `trim` for anything whose colour should be changeable (names may carry a suffix, e.g. `cloth.001`). Other materials keep their own colour (eyes, buttons, metal).
- Optional **morph targets** (shape keys) for expressions, named `brow_worried`, `brow_stern`, `brow_raised`, `mouth_smile`, `mouth_frown`, `mouth_open`, `eyes_closed`. A spec sets them with `morphs: { "mouth_smile": 1 }`. (If a model has none, swap brows and mouth parts instead.)

## A base body
- Standing, relaxed, feet at **y = 0**, centred on x and z.
- Three **empty nodes** (Blender: Add > Empty), named exactly:
  - `anchor_head`: the **centre of the head**.
  - `anchor_face`: the middle of the **front of the face**, between the eyes and mouth, on the surface.
  - `anchor_torso`: the centre of the chest (optional but good).
- Name the major meshes plainly (`Body`, `Head`, `Hands`) so outfits can hide them (see below).
- Give the real height when importing (`height`, metres) and the tool scales it.
- Optional: `portrait: { "fov": 24, "extent": 0.78, "ty": 1.45 }` in the kit entry to adjust the portrait framing.

## Parts: where the origin goes, slot by slot
Model each part **in place on the base** (as if it were already on the character), then **set the object's origin to the point below** so the file sits at (0,0,0):

| slot | origin | notes |
|---|---|---|
| `hair`, `hat` | the **head centre** (same place as `anchor_head`) | hats and hair wrap the head from there |
| `glasses`, `brows`, `eyes`, `nose`, `mouth`, `moustache`, `beard` | the **face anchor** (`anchor_face`) | z points out of the face |
| `outfit`, `accessory` | the **world origin** (the base's feet) | model it around the base's body; it can list base meshes to hide with `hides: ["Body"]` so skin does not poke through |

One part per slot at a time. Parts are placed by the importer from `slot`; you do not need to position anything in code.

## The kit and the spec
`import_character { file, kind: "base" | "part", id, name, slot (parts), height (bases), hides, tags }` writes `public/lab/characters/kit.json` and copies the model to `public/lab/characters/models/`.
Tag parts so a person can be dressed automatically later: `1890s`, `medieval`, `modern`, `future`, `male`, `female`, `nurse`, `soldier`, `worker`, `formal` ...

A character is a small JSON spec:
```json
{ "base": "adult_a",
  "parts": { "hair": "bun_01", "hat": "nurse_veil", "outfit": "nurse_dress", "brows": "brows_worried" },
  "colors": { "skin": "#e8c4a4", "hair": "#6a4a2e", "cloth": "#7d8794", "trim": "#f3f1ea" },
  "morphs": { "mouth_frown": 1 }, "yaw": 10 }
```
`render_character { spec, name, view: "portrait" | "full" }` draws it to `public/lab/portraits/<name>.png`.

## Checks the tools run for you
`inspect_character_model` reports: size, anchors found, material names, morph names, triangle count, and **problems** (skinned/rigged, not in metres, unnamed materials).
`import_character` adds **warnings** (base not standing on y=0, no anchors, nothing tintable). Fix the warnings, re-export, import again (same `id` replaces).
Run `node tools/room3d/selftest.js` to confirm the whole path works on a machine.

## Not done yet
Choosing parts automatically from a person's age, era and job (as the bust prototype did with `suggest_bust`) is waiting for real parts to exist; tag them and it is a short rule table.
Wiring portraits into the game's own portrait slots is separate and comes after the look is settled.
