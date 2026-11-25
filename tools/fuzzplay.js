#!/usr/bin/env node
/* FUZZ PLAY: a bot that actually plays a case in a real (headless) browser: it clicks options, rolls dice, answers prompts and fights,
   and reports crashes ("Something went wrong in this scene"), page errors, and places where nothing can be clicked (stuck).
   Dice and choices come from a seeded random number, so a problem can be reproduced: same seed, same game.
     node tools/fuzzplay.js <case-id> [<case-id> ...] [--steps 250] [--seed 1] [--runs 2] [--map]     (--map = play on maps where they exist; default off)
   It does not judge whether a case is fun; it finds what is broken, and shows how far a random player gets (scenes seen, endings reached). */
const { chromium } = require("playwright"); const { spawn } = require("child_process");
const arg = (n, d) => { const i = process.argv.indexOf("--" + n); return i > 0 ? process.argv[i + 1] : d; };
const ids = process.argv.slice(2).filter((x, i, a) => !x.startsWith("--") && !(i > 0 && /^--(steps|seed|runs)$/.test(a[i - 1])));
const STEPS = +arg("steps", 250), SEED = +arg("seed", 1), RUNS = +arg("runs", 2), MAPS = process.argv.includes("--map"), PORT = 8790 + Math.floor(Math.random() * 50);
if (!ids.length) { console.error("give one or more case ids"); process.exit(1); }
(async () => {
  const srv = spawn("node", ["server.js"], { cwd: require("path").join(__dirname, ".."), env: { ...process.env, PORT: String(PORT) } }); await new Promise((r) => setTimeout(r, 1500));
  const b = await chromium.launch({ args: require("./room3d/gpu.js")() }); let bad = 0;
  for (const id of ids) for (let run = 0; run < RUNS; run++) {
    const seed = SEED + run * 7919, page = await b.newPage({ viewport: { width: 1280, height: 800 } }), errs = [];
    page.on("pageerror", (e) => errs.push("page error: " + e.message.slice(0, 160)));
    await page.addInitScript((seed) => { let s = seed >>> 0; Math.random = () => { s = (Math.imul(s ^ (s >>> 15), 2246822519) + 0x9e3779b9) >>> 0; s ^= s >>> 13; return (s >>> 0) / 4294967296; }; }, seed);
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: "networkidle" }); await page.waitForTimeout(1200);
    const r = await page.evaluate(async ([id, steps, maps]) => {
      const out = { id, steps: 0, scenes: new Set(), problems: [], ending: null, trail: [] }, sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      try {
        localStorage.setItem("beyond.rpgx", JSON.stringify({ unlock: true, ...(maps ? {} : { maps: false, walk: false }) }));
        window.RPGX && RPGX.set && RPGX.set("maps", !!maps);
        const M = await CAMP.loadAdventure(id); CAMP.camp = { id: "fz", day: 1, mission: { adv: id, ids: [] }, chars: {} };
        GAME.state = GAME.newState(CAMP.premades().slice(0, 3).map((x) => JSON.parse(JSON.stringify(x)))); GAME.state.phase = "explore";
        CAMP.endAdventure = async (k) => { out.ending = "case ended: " + k; }; const ge = GAME.ending; GAME.ending = async (k) => { out.ending = "game ending: " + k; };   // record how it ended instead of showing the report
        GAME.show && GAME.show("screen-game"); GAME.enterGame && GAME.enterGame(); await sleep(2500);
      } catch (e) { out.problems.push("could not start: " + e.message); return { ...out, scenes: [] }; }
      const visible = (el) => !!(el && el.offsetParent !== null && !el.disabled);
      let idle = 0, last = "", lastSig = ""; const clicked = new Set();
      for (let i = 0; i < steps; i++) {
        const loc = GAME.state && GAME.state.loc; if (loc) out.scenes.add(loc);
        if (out.ending || (GAME.state && GAME.state.ending)) { out.ending = out.ending || GAME.state.ending; break; }
        const log = (document.querySelector("#log") || document.body).innerText; const m = log.match(/Something went wrong in this scene: ([^\n]*)/); if (m && !out.problems.includes("scene error: " + m[1])) out.problems.push(`scene error in "${loc}": ${m[1]}`);
        let el = null, why = "";
        const modalBtns = [...document.querySelectorAll(".modal .modal-actions .btn")].filter(visible);
        const zpick = [...document.querySelectorAll("#board .zpick")].filter(visible), target = [...document.querySelectorAll("#board .token.target")].filter(visible);
        const choices = [...document.querySelectorAll("#choices button")].filter(visible);
        const pickR = (a) => a[Math.floor(Math.random() * a.length)];
        if (modalBtns.length) { const pref = modalBtns.filter((b) => /roll|continue|ok|begin|go|accept|yes|close|next|done|rest|start|attack|guess|submit|try/i.test(b.textContent)); el = pickR(pref.length ? pref : modalBtns); why = "modal"; }
        else if (target.length) { el = pickR(target); why = "target"; }
        else if (zpick.length) { el = pickR(zpick); why = "zone"; }
        else if (choices.length) {
          /* play like someone trying to get somewhere: options not tried yet come first, forward moves are preferred, "back" is the last resort */
          const label = (b) => (loc + "|" + b.textContent.trim().replace(/\s+/g, " ").slice(0, 50)), forward = /(face|fight|confront|enter|go (down|up|to|on|in|east|west|north|south)|follow|climb|descend|open|cut|take the|accept|refuse|walk|ride|wait|speak the|call|say:|pull|light|read|search|look|talk)/i;
          const meta = /^(\d+)?(walk around|stop walking|speak a string|try something else|field work|regroup|take stock|scavenge|look at the map|take a moment|ask about something else)/i;   // always-available menu entries: not story progress
          const notBack0 = choices.filter((b) => !/^(back|leave|end turn|never mind|no\b)/i.test(b.textContent.trim().replace(/^\d+/, "")));
          const story = notBack0.filter((b) => !meta.test(b.textContent.trim()));
          const leaving = choices.filter((b) => /^(\d+)?(back|leave|return|go (back|on|to))/i.test(b.textContent.trim()) && !meta.test(b.textContent.trim()));
          const notBack = story.length && Math.random() > 0.06 ? story : leaving.length ? leaving : notBack0;   // story options used up: do what a person does, move on
          const fresh = notBack.filter((b) => !clicked.has(label(b))); const fwd = fresh.filter((b) => forward.test(b.textContent));
          el = pickR(fwd.length && Math.random() < .7 ? fwd : fresh.length ? fresh : notBack.length ? notBack : choices); clicked.add(label(el)); why = "choice"; }
        if (!el) { const sig = ((document.querySelector("#log") || {}).innerText || "").length + ":" + ((document.querySelector("#board") || {}).innerText || "").length + ":" + (document.querySelector("#hotspots") ? document.querySelector("#hotspots").children.length : 0); if (sig !== lastSig) { lastSig = sig; idle = 0; } /* text is still changing: an animation or a long enemy turn, not a dead end */
          idle++; if (idle > 24) { out.problems.push(`stuck in "${loc}": nothing to click for ${Math.round(idle * .25)}s. Last action: ${last}`); out.dom = ((document.querySelector("#choices") || {}).outerHTML || "(no #choices)").replace(/\s+/g, " ").slice(0, 500); out.modal = !!document.querySelector(".modal"); break; } await sleep(250); continue; }
        idle = 0; last = (why + ": " + (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 60)); if (out.trail.length < 400) out.trail.push(`${loc}: ${last}`); el.click(); out.steps++; await sleep(why === "modal" ? 220 : 140);
      }
      return { ...out, scenes: [...out.scenes] };
    }, [id, STEPS, MAPS]).catch((e) => ({ id, steps: 0, scenes: [], problems: ["browser: " + e.message.slice(0, 120)], ending: null, trail: [] }));
    const total = await page.evaluate((id) => { try { return Object.keys(window.ADV.LIBRARY[id].scenes).length; } catch (e) { return "?"; } }, id).catch(() => "?");
    const probs = [...r.problems, ...errs]; if (probs.length) bad++;
    console.log(`${probs.length ? "PROBLEM" : "ok     "} ${id} (seed ${seed}): ${r.steps} clicks, ${r.scenes.length}/${total} scenes${r.ending ? ", ended: " + (typeof r.ending === "string" ? r.ending : JSON.stringify(r.ending).slice(0, 40)) : ""}`);
    for (const p of probs) console.log("        - " + p);
    if (process.argv.includes("--trace")) console.log(r.trail.map((x, i) => `   ${String(i).padStart(3)} ${x}`).join("\n"));
    if (probs.length) { console.log("        last clicks: " + r.trail.slice(-5).join(" | ")); if (r.dom) console.log("        choices area: " + r.dom + (r.modal ? " [a modal is open]" : "")); const f = `/tmp/fuzz-${id}-${seed}.png`; await page.screenshot({ path: f }).catch(() => {}); console.log("        screenshot: " + f); }
    await page.close();
  }
  await b.close(); srv.kill(); console.log(bad ? `\n${bad} run(s) with problems` : "\nno problems found"); process.exit(bad ? 1 : 0);
})();
