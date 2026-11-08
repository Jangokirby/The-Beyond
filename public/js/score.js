/* ============================================================================
   SCORE — music that knows when and where it is. Recordings only.

   The game asks for a mood ("investigation", "combat", "hideout"...). This
   file turns that into a recording for the era and the place:
       cue_<era>_<mood>       six eras x home / explore / tension / fight / boss
       cue_<place>_<mood>     a place's own colour where there is one (jp)
       src_<kind>             music playing inside the scene: gramophone,
                              radio, piano, music box
   Files live in assets/audio/music/<key>.mp3 (see assets/audio/CREDITS.md).
   FILES below lists what exists; anything missing falls back along a chain
   (place -> era -> a neighbouring mood) and never to made-up music.
   When the team is badly hurt or close to breaking, exploring music gives way
   to the tension cue.
   ========================================================================== */
(function () {
  const A = window.AudioMan; if (!A) return;
  const FILES = ["title",
    "cue_medieval_home", "cue_medieval_explore", "cue_medieval_tension", "cue_medieval_fight", "cue_medieval_boss",
    "cue_victorian_home", "cue_victorian_explore", "cue_victorian_tension", "cue_victorian_fight", "cue_victorian_boss",
    "cue_wars_home", "cue_wars_explore", "cue_wars_tension", "cue_wars_fight", "cue_wars_boss",
    "cue_atomic_home", "cue_atomic_explore", "cue_atomic_tension", "cue_atomic_fight", "cue_atomic_boss",
    "cue_modern_home", "cue_modern_explore", "cue_modern_tension", "cue_modern_fight", "cue_modern_boss",
    "cue_now_home", "cue_now_explore", "cue_now_tension", "cue_now_fight", "cue_now_boss",
    "cue_jp_explore", "cue_jp_fight",
    "src_gramophone", "src_radio", "src_piano", "src_musicbox"];
  const HAVE = new Set(FILES);
  for (const k of FILES) if (k !== "title") window.ASSETS.music[k] = window.ASSETS.music[k] || { src: `assets/audio/music/${k}.mp3`, loop: 0, volume: k.startsWith("src_") ? 0.45 : 0.7 };
  if (window.ASSETS.music.title) window.ASSETS.music.title.loop = 0;

  const SCORE = (window.SCORE = { on: true, FILES });
  const MOOD = { title: "title", hideout: "home", investigation: "explore", basement: "tension", paperhouse: "tension", combat: "fight", boss: "boss", ending_banish: "home", ending_kill: "tension" };
  const NEXT = { home: ["home", "explore"], explore: ["explore", "home"], tension: ["tension", "explore"], fight: ["fight", "boss", "tension"], boss: ["boss", "fight", "tension"] };
  const ERAS = ["medieval", "victorian", "wars", "atomic", "modern", "now"];
  const eraNow = () => {
    const M = window.MODULE, inCase = window.GAME && GAME.state && document.body.dataset.mode !== "hub";
    const year = (inCase && M && M.year) || (window.CAMP && CAMP.camp && CAMP.camp.year) || 1976;
    return window.CDATA ? CDATA.eraOf(year).id : "modern";
  };
  const flavNow = () => {
    const M = window.MODULE; if (!M || !(window.GAME && GAME.state)) return null;
    const a = (window.ADV && ADV.LIBRARY[M.id]) || M, s = `${a.setting || ""} ${M.flavor || a.flavor || ""}`;
    if (M.id === "death-of-a-bloodline" || /japan|tokyo|aomori|kyoto|\bjp\b/i.test(s)) return "jp";
    return null;
  };
  const strain = () => { try { const t = GAME.active(); if (!t.length) return 0; return Math.max(...t.map((a) => 1 - Math.min(a.pools.health.cur / a.pools.health.max, a.pools.sanity.cur / a.pools.sanity.max))); } catch (e) { return 0; } };
  /* the first recording that exists: place, then era, then the era's neighbouring moods, then the nearest era */
  SCORE.pick = (key) => {
    if (key == null) return key;
    if (HAVE.has(key) && (key.startsWith("cue_") || key.startsWith("src_") || key === "title")) return key;
    const mood = MOOD[key]; if (!mood) return HAVE.has(key) ? key : null;
    if (mood === "title") return "title";
    if (key === "paperhouse" && HAVE.has("src_musicbox")) return "src_musicbox";
    let m = mood; if (m === "explore" && strain() > 0.6) m = "tension";
    const era = eraNow(), fl = flavNow();
    const near = ERAS.slice().sort((x, y) => Math.abs(ERAS.indexOf(x) - ERAS.indexOf(era)) - Math.abs(ERAS.indexOf(y) - ERAS.indexOf(era)));
    for (const mm of NEXT[m]) { if (fl && HAVE.has(`cue_${fl}_${mm}`) && mm === m) return `cue_${fl}_${mm}`; for (const e of near) if (HAVE.has(`cue_${e}_${mm}`)) return `cue_${e}_${mm}`; }
    return null;
  };
  const music0 = A.music;
  let asked = null;
  A.music = (key, fade) => { asked = key; return music0.call(A, SCORE.on ? SCORE.pick(key) : (HAVE.has(key) ? key : SCORE.pick(key)), fade); };

  /* music in the room: a scene that mentions a gramophone, radio, piano or music box plays it, quietly, instead */
  const SRC_WORDS = [["gramophone", /gramophone|phonograph|victrola/i], ["radio", /\bradio\b|wireless|transistor/i], ["musicbox", /music[- ]box/i], ["piano", /\bpiano\b|pianola/i]];
  SCORE.sourceFor = (text) => { for (const [k, re] of SRC_WORDS) if (re.test(text || "") && HAVE.has(`src_${k}`)) return k; return null; };
  let srcOn = null;
  document.addEventListener("DOMContentLoaded", () => {
    const G = window.GAME; if (!G || !G.goto) return;
    const goto0 = G.goto;
    G.goto = async function () {
      const r = await goto0.apply(this, arguments);
      try {
        const story = (document.querySelector("#story") || {}).textContent || "";
        const k = SCORE.sourceFor(story.slice(-1400));
        if (k && document.body.dataset.mode !== "combat") { srcOn = k; music0.call(A, `src_${k}`, 1.5); }
        else if (srcOn) { srcOn = null; A.music(asked || "investigation"); }
      } catch (e) { /* music is never worth a crash */ }
      return r;
    };
    /* slide between exploring and tension as the team's state changes */
    setInterval(() => { if (!SCORE.on || srcOn || !asked || MOOD[asked] !== "explore" || document.body.dataset.mode === "combat") return; const want = SCORE.pick(asked); if (want && A.musicKey !== want) A.music(asked); }, 6000);
  });
})();
