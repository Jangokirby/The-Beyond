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

## Putting it online, step by step
You need two free accounts: **GitHub** (stores the code) and **Render** (runs the game).
1. github.com → sign up → **New repository** → name it `the-beyond` → Create.
2. On the new repository page choose **uploading an existing file** and drag in everything inside this folder
   (not the folder itself, and not `node_modules`). Commit.
3. render.com → sign up with your GitHub account → **New** → **Blueprint** → pick `the-beyond` → Apply.
4. After a few minutes Render shows an address like `https://the-beyond.onrender.com`. That's your game.
   Send it to your friends. Every time you upload new files to GitHub, Render updates the game by itself.
The free plan sleeps when nobody is playing; the first visit after a quiet spell takes about 30 seconds to wake.

## Swapping in your own art and sound
Every picture and sound is looked up by name in `public/js/manifest.js`. Drop a file into `public/assets/`
and point its line at it. Anything without a file is drawn or played by the game itself
(`js/art.js` draws scenes, portraits and monsters; `js/synth.js` makes music and sound effects).

## Writing cases
Cases are plain data in `js/adventures.js`, `js/adventures2.js` and `js/adventures3.js` (format described at the
top of `js/adv.js`). The **GM workshop** builds the same thing without code, and can copy any built-in case as a
starting point. Useful optional fields: `flavor: "jp"` (Japanese labels while it runs) and `downtime: 2`
(downtime actions in the break after it).

## Playing together
1. Host opens their campaign → **Live table** → **Start a table**. Send the link (`…/#room=ABCDE`).
2. Players open the link → **Live table** → **Sit down** with one of their own agents. They join the host's team automatically.
3. **Between jobs**, each player spends their own agent's downtime from their phone (rest, meditate, visit a Bond,
   work contacts) and sees the scene play out, then presses **I'm ready for the next job**. The host's Hideout shows who is ready.
4. Host takes a case from the Case board. During the case:
   - **Table vote** (default): everyone votes on story choices; the majority wins, ties go to the host. The host can press **Decide now**.
   - **Who tries?** prompts: players step up by tapping their own agent.
   - Each player rolls for their own agent and acts on their own turns in combat.
   The host can switch to *Everyone* (first tap wins), *Take turns* or *Host only* on the Live table screen.
5. Players stay seated for the next case. When they leave the table they press **Collect my agent** to take them home.

Hosts keep control with a secret token in their browser — reopening the link in the same browser keeps host rights;
other browsers join as players. Allies are host-controlled; ~1s mirror delay.
Rooms are kept 3 days idle. Set `PORT` / `DATA_DIR` env vars if your host needs them.

## Downtime
Between jobs each agent has 3 downtime actions (change it in the Hideout: 1–6 or no limit). An adventure can set its own
number with `M.downtime = 2` in its module. Evenings at the Common table are story only and free.

## Checking cases for soft locks
`node tools/softlock.js` walks every path through every written case (each roll passing and failing, every choice, every order of options) and reports anywhere players would be left with nothing to click, or unable to win. `node tools/softlock-sidejobs.js` does the same for several hundred generated side jobs. Run them after writing or editing a case.
