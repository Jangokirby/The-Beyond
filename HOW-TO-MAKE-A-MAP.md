> **Quickest way, no AI:** open the Map Builder (`/lab/editor.html`), pick a kind of place under **Generate a room (no AI)** (castle, tenement, neon alley, jungle...), press **Generate**, then **Shuffle** until you like it. Fix details by hand, then **Download map pack**.

# Making maps, without me

You can make and tidy maps yourself. There are three ways, cheapest first.

## 1. Let the computer lay out a whole job (free)
Ask me once to run this, or run it yourself from the project folder:

    node tools/room3d/automap.js the-case-id            (one or more case ids)
    node tools/room3d/automap.js --all-missing           (every job that has no maps yet)

It reads the job's places, picks a kind of room for each (ward, tavern, study, cellar, chapel, canteen, bedroom), puts a door for every
way out, places the people and puts a spot for every option, renders each room and saves it. The job then plays on the maps.
Case ids are the `id:` at the top of each case (for example `qf-2-grey-ward`). Needs `npm install` in the project once.

## 2. Tidy a room in the Map Builder (free)
Open `/lab/editor.html` (on your site, or locally). Load the layout from `public/lab/layouts/` or build a new one:
- **Fill** starts a room from a preset. **Pieces** on the left drops furniture. R rotates, Delete removes.
- **Wall / Door / Window** tools draw the room. **Examine spot** and **Person** mark what the players can look at and talk to.
- **Render 3D** shows the room. **Download map pack** saves it as one file. **Test in the lab** walks it at once.
To put a hand-made room into a job, save it over the automatic one: `public/lab/maps/<case>/<scene>.beyondmap`.

## 3. Let a local AI agent build rooms
The in-page AI box was removed. An agent (for example Overlord's Mapper) uses the same tools through Node, MCP or the CLI instead: see "For agents" in `MAPS.md`.

## Hand-made maps from Dungeondraft
Export as `.dd2vtt` and open it in the Map Lab (`/lab/`). Your walls, doors and lights come with it.

## Adding furniture
It is one entry in `public/lab/kit.js` (`CATALOG`). Ask me when you need a type of piece that does not exist; I only touch the tool.
