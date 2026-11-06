# The Beyond — web game with live tables

A static game (everything in `public/`) plus a tiny Node server (`server.js`) that relays live tables.
Characters and campaigns are saved in each player's own browser; the server only holds the live table
(who is seated, what the host's screen shows, players' taps). No accounts, no database.

## Run it on your computer
    npm install
    npm start          # http://localhost:3000

## Put it on the internet (pick one — all have free tiers)
**Render:** push this folder to a GitHub repo → render.com → New → Blueprint → pick the repo (uses `render.yaml`).
**Railway / Fly.io / any Docker host:** deploy the `Dockerfile`. Any host that runs Node and supports WebSockets works.
The host must be a *server*, not static-only hosting (GitHub Pages, Netlify static) — live tables need the WebSocket relay.
Free tiers sleep when idle, so the first load after a quiet spell can take ~30s.

## Playing together
1. Host opens the site → any campaign screen → **Live table** → **Host a new table**. Send the link (`…/#room=ABCDE`).
2. Players open the link → **Live table** → pick an agent → **Take this seat**.
3. Host: **Open a table**, add seated players to the roster, start a case with them in the party.
4. On a player's turn their device shows the controls; everything else they watch live.
Hosts keep control with a secret token in their browser — reopening the link in the same browser keeps host rights;
other browsers join as players. After a case, players press **Collect my agent** to bring results home.

Limits: story choices, "Who tries?" prompts and group checks are host-only; allies are host-controlled; ~1s mirror delay.
Rooms are kept 3 days idle. Set `PORT` / `DATA_DIR` env vars if your host needs them.
