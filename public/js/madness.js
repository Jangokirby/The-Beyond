/* ============================================================================
   MADNESS — what low Sanity feels like, in solo play as well as at the live
   table. Rules don't change; only what the screen tells you does.
     below half Sanity   now and then a word in the narration flickers wrong
     below a quarter     lines that nobody wrote appear and fade; a thing to
                         examine appears that isn't there (it costs the look,
                         and finds nothing)
   Watches the worst-off agent on the case. Settings: "Sanity effects".
   ========================================================================== */
(function () {
  const U = window.UI, G = window.GAME; if (!U || !G) return;
  const on = () => { try { return localStorage.getItem("beyond.madness") !== "off"; } catch (e) { return true; } };
  const level = () => {
    if (!on() || !G.state || document.body.dataset.mode === "combat") return 0;
    try { const r = Math.min(...G.active().map((a) => a.pools.sanity.cur / a.pools.sanity.max)); return r < 0.25 ? 2 : r < 0.5 ? 1 : 0; } catch (e) { return 0; }
  };
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const FALSE = ["Someone behind you says your name. There is no one behind you.", "The wallpaper breathes in, and out, and in.", "You hear your mother laughing in the next room.",
    "For a moment every face in the room is looking at you. Then they aren't.", "Something drips. You count the drips. There are too many.", "A child's voice, very close: 'You left me there.'",
    "Your hands are wet. You look. They aren't.", "The light goes the colour of old teeth, and comes back.", "Someone has written your name in the dust. When you look again, it's gone.",
    "A door you didn't notice closes softly, somewhere.", "You smell smoke, and then you don't, and then you do."];
  const SWAP = ["teeth", "mother", "drowning", "behind you", "hungry", "yours", "inside", "awake", "listening", "open", "skin", "it knows"];
  const print0 = U.print;
  U.print = function (html, cls = "", opts) {
    const r = print0.apply(this, arguments);
    const lv = level();
    if (lv && /narr|say/.test(cls || "") && !/madness/.test(cls || "")) {
      /* a word flickers wrong for a moment */
      if (Math.random() < (lv === 2 ? 0.45 : 0.2)) setTimeout(() => {
        const story = document.querySelector("#story"); const last = story && story.lastElementChild; if (!last) return;
        const walker = document.createTreeWalker(last, NodeFilter.SHOW_TEXT); const nodes = []; while (walker.nextNode()) if (walker.currentNode.textContent.trim().length > 20) nodes.push(walker.currentNode);
        const n = nodes.length && pick(nodes); if (!n) return;
        const words = n.textContent.split(/(\s+)/), i = 2 * Math.floor(Math.random() * Math.floor(words.length / 2)); if (!words[i] || words[i].length < 4) return;
        const before = document.createTextNode(words.slice(0, i).join("")), after = document.createTextNode(words.slice(i + 1).join(""));
        const sp = document.createElement("span"); sp.className = "mflick"; sp.dataset.real = words[i]; sp.textContent = pick(SWAP);
        n.replaceWith(before, sp, after);
        setTimeout(() => { sp.textContent = sp.dataset.real; sp.classList.add("back"); }, 900 + Math.random() * 700);
      }, 400);
      /* a line nobody wrote */
      if (lv === 2 && Math.random() < 0.22) setTimeout(() => { const p = print0.call(U, `<i>${pick(FALSE)}</i>`, "narr madness"); setTimeout(() => { document.querySelectorAll("#story .madness").forEach((x) => x.classList.add("gone")); }, 4200); }, 1200);
    }
    return r;
  };
  /* a thing that isn't there */
  const vis0 = G.visibleHotspots;
  G.visibleHotspots = function () {
    const list = vis0.apply(this, arguments);
    try {
      if (level() < 2 || !G.state) return list;
      const loc = G.loc(), key = `mad:${G.state.loc}:${(G.state.flags && Object.keys(G.state.flags).length) || 0}`;
      if (G.state.flags[`madseen:${G.state.loc}`]) return list;
      const seed = [...key].reduce((s, c) => (s * 31 + c.charCodeAt(0)) >>> 0, 7);
      if (seed % 3) return list;
      const fake = { id: "mad", label: pick(["Someone standing very still", "A door that wasn't there", "Your own coat, hanging up", "A child, watching", "Writing on the wall"]),
        pos: { x: 15 + (seed % 60), y: 20 + ((seed >> 4) % 40), w: 12, h: 18 },
        info: { kind: "look", roll: "No roll", desc: "You're sure you saw it", aspect: null, cost: 1 },
        run: async (api) => { G.state.flags[`madseen:${G.state.loc}`] = true; await api.narrate("You go to it. There's nothing there. There was never anything there. When you turn around, the others are watching you."); } };
      return [...list, fake];
    } catch (e) { return list; }
  };
  window.MADNESS = { level, set: (v) => { try { localStorage.setItem("beyond.madness", v ? "on" : "off"); } catch (e) {} }, on };
})();
