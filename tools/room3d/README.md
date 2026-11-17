# room3d

Builds a room from a layout file and a kit of 3D pieces, and renders it once to a picture.

    cd tools/room3d && npm install && node render.js ward.json ward.png

`ward.json` is the layout (size, walls, doors, windows, props with positions). `room.html` holds the kit (floor, walls,
iron bed, lamp, desk, stove, crate, gramophone, stretcher), the lights and the camera (tilted orthographic, 52 degrees).
The picture goes to `public/lab/`; the layout gives the game its walls, so what you see is what you collide with.
`public/lab/` also reads `.dd2vtt` files (Dungeondraft, Dungeon Alchemist and others export them): picture, walls, doors, lights.
