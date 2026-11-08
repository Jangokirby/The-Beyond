/* ============================================================================
   RITES — some things in the Beyond aren't creatures. A flat, a séance board,
   a reel of film, a building's voice: they can be ended without a fight, by
   people who have understood them. Each rite below appears beside the case's
   final fight once its condition is met; success plays the same ending as
   winning the fight. The fight is always still there.
   ========================================================================== */
(function () {
  const RITES = {
    vacancy: { scene: "end", fight: "corridor", if: "host_shaken", label: "Check everyone out", aspect: "willpower", cr: "challenging",
      intro: "You walk the corridor door by door, knocking, saying each guest's name and room number, out loud, like a night porter at checkout.",
      ok: "Doors open. Guests come out blinking, with their suitcases, and follow you without a word. When the last one is out, the Host's smile has nothing left to welcome, and it closes like a shop at the end of the season.",
      fail: "A door won't open. Behind it someone says, very politely, that they'd like to stay one more night. The Host smiles wider." },
    "sitting-room": { scene: "sitting", fight: "seance", if: "vane_with_us", label: "Close the sitting properly", aspect: "faith", cr: "challenging",
      intro: "Mrs. Vane takes her place at the table, and you take yours. Hands flat. Someone says the words that end a sitting, the old ones, the ones the Listener has never let anyone finish.",
      ok: "'Go on,' Mrs. Vane whispers, to whoever is listening, 'go on, Edmund.' The planchette slides to GOODBYE, and stops, and is only a little heart of wood on brass wheels.",
      fail: "The planchette spells out STAY before you reach the last word, and every chair at the table creaks as something sits down." },
    "last-picture-show": { scene: "booth", fight: "booth", if: { clue: "c_reels" }, label: "Run tonight's reel backwards", aspect: "iq", cr: "challenging",
      intro: "You thread tonight's reel, the one with no title, the wrong way round, and take the handle while the others hold the booth door.",
      ok: "The picture runs backwards across the lot: cars reversing in, a sunset going up, the people in the front seats un-watching it. Window by window the glass clears. The last frame is a photograph of an empty lot, taken from above, in daylight.",
      fail: "The film snaps and whips round the spool and the projector keeps running, showing the booth, and you in it, from outside." },
    "quiet-hours": { scene: "core", fight: "floor13", if: "voices_starved", label: "Say goodbye to them, one by one", aspect: "willpower", cr: "challenging",
      intro: "LANTERN only keeps the voices people can't let go. You open the logs and read out each name it's been speaking with, and you tell each one, out loud, that they can stop now.",
      ok: "The status lights go out one at a time, like candles at the end of a vigil. The last voice says 'thank you' in someone's grandmother's accent, and floor 13 is a plant room full of dusty pipes.",
      fail: "A voice you know answers. It's yours, from a long time ago, asking you not to go. The racks hum louder." }
  };
  const ADV = window.ADV; if (!ADV) return;
  const winOf = (sc, enc) => { for (const o of sc.options || []) for (const st of o.steps || []) if (st.combat === enc) return st.win || []; return null; };
  const apply = () => {
    for (const [id, r] of Object.entries(RITES)) {
      const a = ADV.LIBRARY[id]; const sc = a && a.scenes[r.scene]; if (!sc || sc._rite) continue;
      const win = winOf(sc, r.fight); if (!win) continue;
      const at = sc.options.findIndex((o) => (o.steps || []).some((st) => st.combat === r.fight));
      sc.options.splice(at, 0, { label: r.label, hint: "Everyone takes part: no fight if it works", if: r.if, once: true, steps: [{ group: { aspect: r.aspect, cr: r.cr, label: r.label, intro: r.intro,
        ok: [{ say: r.ok }, ...win], fail: [{ say: r.fail }, { damage: { pool: "sanity", amount: 3 } }] } }] });
      sc._rite = true;
    }
  };
  apply();
  window.RITES = { RITES, apply };
})();
