/* ============================================================================
   SCORE — music that knows when and where it is.

   The game asks for a mood ("investigation", "combat", "hideout"...). This
   file turns that into a cue for the era and the place:
       cue_<era>_<mood>            six eras x home / explore / tension / fight / boss
       cue_<flavour>_<mood>        place colours: jp, cn, carib, plains
       src_<kind>                  music playing inside the scene: gramophone,
                                   radio, organ, musicbox, jukebox, piano
   Every cue is a file name first (assets/audio/music/<key>.mp3): drop a real
   recording in with that name and it plays instead. Missing files are
   composed here, in code, by js/synth.js's instruments (era palettes below).

   It also follows the table: when the team is badly hurt or close to
   breaking, exploration music gives way to the tension cue.
   ========================================================================== */
(function () {
  const A = window.AudioMan, SYN = window.SYNTH;
  if (!A || !SYN) return;
  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
  const seeded = (seed) => { let s = 7; for (const ch of String(seed)) s = (s * 31 + ch.charCodeAt(0)) >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; };

  /* ---------------------------------------------------------------- extra instruments, built from the kit's osc/noise */
  const X = (k) => ({
    piano: (m, t, dest, g = 0.12, d = 1.6) => { k.osc("triangle", mtof(m), t, 0.02, dest, { a: 0.003, d, s: 0.001, r: 0.4, gain: g, lp: 3200 }); k.osc("sine", mtof(m + 12), t, 0.02, dest, { a: 0.002, d: d * 0.5, s: 0.001, r: 0.2, gain: g * 0.3 }); },
    organ: (notes, t, dur, dest, g = 0.025) => { for (const m of notes) for (const [h, w] of [[1, 1], [2, 0.6], [3, 0.35], [4, 0.25], [6, 0.12]]) k.osc("sine", mtof(m) * h, t, dur, dest, { a: 0.08, d: 0.1, s: 1, r: 0.6, gain: g * w }); },
    strings: (notes, t, dur, dest, g = 0.02) => { for (const m of notes) for (const dt of [-9, 0, 9]) k.osc("sawtooth", mtof(m), t, dur, dest, { detune: dt, a: dur * 0.35, d: 0.3, s: 0.85, r: 1.2, gain: g, lp: 1500, vib: 5.2, vibDepth: 7 }); },
    brass: (notes, t, dur, dest, g = 0.05) => { for (const m of notes) k.osc("sawtooth", mtof(m), t, dur, dest, { a: 0.05, d: 0.3, s: 0.7, r: 0.25, gain: g, lp: 600, lpTo: 1800, q: 2 }); },
    flute: (m, t, dur, dest, g = 0.08) => { k.osc("sine", mtof(m), t, dur, dest, { a: 0.12, d: 0.2, s: 0.8, r: 0.35, gain: g, vib: 5, vibDepth: 10 }); k.noise(t, dur, dest, { type: "bandpass", f: mtof(m) * 2, q: 6, a: 0.1, gain: g * 0.25, d: 0.2, s: 0.5, r: 0.2 }); },
    koto: (m, t, dest, g = 0.14) => { k.osc("triangle", mtof(m), t, 0.04, dest, { a: 0.002, d: 1.2, s: 0.001, r: 0.4, gain: g, lp: 2400 }); k.osc("square", mtof(m), t, 0.02, dest, { a: 0.001, d: 0.25, s: 0.001, r: 0.1, gain: g * 0.18, lp: 3000 }); },
    erhu: (m, t, dur, dest, g = 0.06) => k.osc("sawtooth", mtof(m - 0.3), t, dur, dest, { to: mtof(m), glide: 0.12, a: 0.15, d: 0.2, s: 0.8, r: 0.3, gain: g, lp: 1400, q: 3, vib: 6, vibDepth: 18 }),
    theremin: (m, t, dur, dest, g = 0.07) => k.osc("sine", mtof(m - 1), t, dur, dest, { to: mtof(m), glide: 0.3, a: 0.25, d: 0.2, s: 0.9, r: 0.6, gain: g, vib: 6.5, vibDepth: 30 }),
    vibes: (m, t, dest, g = 0.07) => { k.osc("sine", mtof(m), t, 0.02, dest, { a: 0.002, d: 2, s: 0.001, r: 0.6, gain: g, vib: 4.5, vibDepth: 4 }); k.osc("sine", mtof(m) * 4, t, 0.01, dest, { a: 0.001, d: 0.3, s: 0.001, r: 0.1, gain: g * 0.2 }); },
    pan: (m, t, dest, g = 0.08) => { const f = mtof(m); [[1, 1], [2, 0.5], [3.01, 0.2]].forEach(([h, w]) => k.osc("sine", f * h, t, 0.02, dest, { a: 0.004, d: 0.9 / h, s: 0.001, r: 0.3, gain: g * w })); },
    reed: (m, t, dur, dest, g = 0.05) => k.osc("square", mtof(m), t, dur, dest, { a: 0.04, d: 0.2, s: 0.7, r: 0.2, gain: g, lp: 1300, q: 1.5, vib: 5, vibDepth: 12 }),
    hurdy: (m, t, dur, dest, g = 0.04) => { k.osc("sawtooth", mtof(m), t, dur, dest, { a: 0.3, d: 0.2, s: 0.9, r: 0.5, gain: g, lp: 1800, q: 4 }); k.osc("sawtooth", mtof(m - 12), t, dur, dest, { a: 0.4, d: 0.2, s: 0.9, r: 0.5, gain: g * 0.7, lp: 700 }); },
    synth: (m, t, dur, dest, g = 0.05) => k.osc("sawtooth", mtof(m), t, dur, dest, { a: 0.01, d: 0.2, s: 0.4, r: 0.15, gain: g, lp: 400, lpTo: 2600, q: 5 }),
    sub: (m, t, dur, dest, g = 0.18) => k.osc("sine", mtof(m), t, dur, dest, { a: 0.4, d: 0.3, s: 0.9, r: 0.8, gain: g }),
    taiko: (t, dest, g = 0.7) => { k.osc("sine", 70, t, 0.4, dest, { to: 40, glide: 0.35, a: 0.003, d: 0.5, s: 0.01, r: 0.2, gain: g }); k.noise(t, 0.05, dest, { f: 300, q: 0.7, gain: g * 0.4, d: 0.12, s: 0.01 }); },
    frame: (t, dest, g = 0.3) => { k.osc("sine", 140, t, 0.15, dest, { to: 90, glide: 0.12, a: 0.002, d: 0.2, s: 0.01, r: 0.1, gain: g }); k.noise(t, 0.04, dest, { f: 1800, q: 1, gain: g * 0.3, d: 0.06, s: 0.01 }); },
    brush: (t, dest, g = 0.05) => k.noise(t, 0.12, dest, { type: "bandpass", f: 4000, q: 0.6, a: 0.02, gain: g, d: 0.1, s: 0.3, r: 0.08 }),
    crackle: (len, dest, g = 0.04, rnd) => { for (let t = 0; t < len; t += 0.03 + rnd() * 0.12) k.noise(t, 0.004, dest, { type: "highpass", f: 3000 + rnd() * 4000, gain: g * (0.3 + rnd()), d: 0.01, s: 0.01, r: 0.01 }); k.noise(0, len, dest, { type: "bandpass", f: 900, q: 0.4, a: 0.01, gain: g * 0.15, d: 0.1, s: 1, r: 0.01 }); }
  });

  /* ---------------------------------------------------------------- harmony */
  const MODES = { dorian: [0, 2, 3, 5, 7, 9, 10], aeolian: [0, 2, 3, 5, 7, 8, 10], phrygian: [0, 1, 3, 5, 7, 8, 10], harm: [0, 2, 3, 5, 7, 8, 11], mixo: [0, 2, 4, 5, 7, 9, 10],
    blues: [0, 3, 5, 6, 7, 10, 12], in: [0, 1, 5, 7, 8, 12, 13], yo: [0, 2, 5, 7, 9, 12, 14], penta: [0, 3, 5, 7, 10, 12, 15], whole: [0, 2, 4, 6, 8, 10, 12], major: [0, 2, 4, 5, 7, 9, 11] };
  const deg = (mode, root, d) => { const s = MODES[mode], n = s.length; const o = Math.floor(d / n), i = ((d % n) + n) % n; return root + s[i] + 12 * o; };
  const triad = (mode, root, d, ext) => [deg(mode, root, d), deg(mode, root, d + 2), deg(mode, root, d + 4), ...(ext ? [deg(mode, root, d + 6)] : [])];
  /* a short tune: steps around the chord tones, a phrase that answers itself */
  const tune = (rnd, mode, root, len, chordDegs) => { const out = []; let d = 7 + chordDegs[0]; for (let i = 0; i < len; i++) { const step = [-2, -1, -1, 0, 1, 1, 2, 3][Math.floor(rnd() * 8)]; d = Math.max(4, Math.min(13, d + step)); if (i % 4 === 0) d = 7 + chordDegs[Math.floor(i / 4) % chordDegs.length] + (rnd() < 0.5 ? 2 : 0); out.push(deg(mode, root, d)); } return out; };

  /* ---------------------------------------------------------------- the eras */
  const ERA = {
    medieval: { mode: "dorian", root: 50, bpm: { home: 64, explore: 60, tension: 50, fight: 104, boss: 96 }, prog: [0, 6, 3, 0] },
    victorian: { mode: "harm", root: 50, bpm: { home: 84, explore: 72, tension: 54, fight: 120, boss: 100 }, prog: [0, 3, 4, 0] },
    wars: { mode: "aeolian", root: 48, bpm: { home: 76, explore: 70, tension: 52, fight: 116, boss: 98 }, prog: [0, 5, 3, 4] },
    atomic: { mode: "dorian", root: 50, bpm: { home: 96, explore: 88, tension: 60, fight: 132, boss: 112 }, prog: [0, 3, 1, 4] },
    modern: { mode: "aeolian", root: 45, bpm: { home: 90, explore: 92, tension: 70, fight: 128, boss: 110 }, prog: [0, 5, 2, 6] },
    now: { mode: "phrygian", root: 43, bpm: { home: 80, explore: 76, tension: 64, fight: 140, boss: 118 }, prog: [0, 1, 5, 0] }
  };
  const FLAV = {
    jp: { mode: "in", root: 52 }, cn: { mode: "penta", root: 50 }, carib: { mode: "mixo", root: 50 }, plains: { mode: "blues", root: 45 }
  };

  /* one cue = 8 bars of 4 beats (a waltz uses 3-beat bars and fills the same number of beats) */
  const compose = (era, mood, flav) => {
    const E = ERA[era] || ERA.modern, F = flav ? FLAV[flav] : null;
    const mode = F ? F.mode : mood === "tension" ? (era === "atomic" ? "whole" : "phrygian") : E.mode, root = F ? F.root : E.root;
    const bpm = E.bpm[mood] || 70, waltz = era === "victorian" && mood === "home";
    return { bpm, bars: 8, render: (k, T) => {
      const rnd = seeded(`${era}-${mood}-${flav || ""}`), x = X(k);
      const pad = k.bus(0.45), lead = k.bus(0.45, 0.2), low = k.bus(0.08), perc = k.bus(0.2, -0.15), far = k.bus(0.8, -0.3);
      const beats = 32, bar = waltz ? 3 : 4, chords = E.prog.map((d) => triad(mode, root, d, era === "atomic" || era === "modern"));
      const chordAt = (b) => chords[Math.floor(b / 8) % chords.length];
      const mel = tune(rnd, mode, root, 16, E.prog);
      /* ---- harmony bed by era (or place) */
      for (let i = 0; i < 4; i++) {
        const t = i * 8 * T, c = chords[i], dur = 7.8 * T;
        if (flav === "jp") { x.koto(c[0] + 12, t, lead, 0.1); k.I.drone(root - 12, t, dur, pad, { gain: 0.03 }); }
        else if (flav === "cn") { k.I.pad(c.map((n) => n + 12), t, dur, pad, { gain: 0.016, lp: 900, wave: "triangle" }); }
        else if (flav === "carib") { k.I.pad(c, t, dur, pad, { gain: 0.016, lp: 1200, wave: "triangle" }); }
        else if (flav === "plains") { x.reed(c[0] + 12, t, 3.8 * T, pad, 0.02); x.reed(c[2] + 12, t + 4 * T, 3.8 * T, pad, 0.02); }
        else if (era === "medieval") { k.I.drone(root - 12, t, dur, pad, { gain: 0.05, lp: 420 }); if (mood !== "fight") k.I.choir([c[0] + 12, c[2] + 12], t, dur, pad, { gain: 0.03 }); }
        else if (era === "victorian") x.strings(c.map((n) => n + 12), t, dur, pad, mood === "tension" ? 0.012 : 0.016);
        else if (era === "wars") x.organ(c, t, dur, pad, mood === "fight" ? 0.012 : 0.02);
        else if (era === "atomic") { if (mood === "tension") k.I.pad(c, t, dur, pad, { gain: 0.016, lp: 600 }); else for (let b = 0; b < 8; b += 2) c.slice(1).forEach((m) => x.piano(m + 12, t + (b + (b % 4 ? 0.66 : 0)) * T, lead, 0.05, 0.6)); }
        else if (era === "modern") k.I.pad(c.map((n) => n + 12), t, dur, pad, { gain: 0.024, lp: 900 });
        else { k.I.drone(c[0] - 12, t, dur, pad, { gain: 0.05, lp: 320 }); k.I.swell(t + 2 * T, 5 * T, far, { f: 200, fTo: 1600, gain: 0.04 }); }
      }
      /* ---- bass */
      if (mood !== "tension") for (let b = 0; b < beats; b += (era === "atomic" ? 1 : 2)) {
        const c = chordAt(b), m = era === "atomic" ? deg(mode, root, [0, 2, 4, 5][b % 4] + E.prog[Math.floor(b / 8) % 4]) - 12 : c[0] - 12;
        if (era === "now") x.sub(m - 12, b * T, 1.8 * T, low, 0.16); else if (era !== "medieval" || mood === "fight") k.I.bass(m, b * T, (era === "atomic" ? 0.8 : 1.6) * T, low, { gain: 0.16 });
      }
      /* ---- the tune */
      if (mood === "home" || mood === "explore") mel.forEach((m, i) => {
        const t = (i * 2 + (i % 4 === 3 ? 1 : 0)) * T;
        if (flav === "jp") x.flute(m + 12, t, 1.6 * T, lead, 0.05);
        else if (flav === "cn") x.erhu(m + 12, t, 1.7 * T, lead, 0.045);
        else if (flav === "carib") { x.pan(m + 12, t, lead, 0.07); x.pan(m + 12, t + 0.5 * T, lead, 0.035); }
        else if (flav === "plains") x.reed(m + 12, t, 1.4 * T, lead, 0.035);
        else if (era === "medieval") x.hurdy(m, t, 1.8 * T, lead, 0.025);
        else if (era === "victorian") x.piano(m + 12, t, lead, 0.1, waltz ? 1.2 : 1.8);
        else if (era === "wars") (mood === "home" ? x.piano : (mm, tt, dd, gg) => x.flute(mm, tt, 1.6 * T, dd, gg))(m + 12, t, lead, 0.07);
        else if (era === "atomic") x.vibes(m + 12, t, lead, 0.07);
        else if (era === "modern") { x.synth(m + 12, t, 0.5 * T, lead, 0.035); x.synth(m + 24, t + 0.75 * T, 0.25 * T, lead, 0.02); }
        else if (i % 2 === 0) k.I.bell(m + 24, t, far, { gain: 0.035, d: 3 });
      });
      if (waltz) for (let b = 0; b < beats; b++) if (b % 3) chordAt(b).slice(1).forEach((m) => x.piano(m + 12, b * T, lead, 0.035, 0.5));
      /* ---- tension: what's wrong with the room */
      if (mood === "tension") {
        for (let b = 0; b < beats; b += 2) k.I.heart(b * T, low, 0.25);
        [3, 11, 19, 27].forEach((b, i) => { if (era === "atomic") x.theremin(deg(mode, root, 9 + i), b * T, 4 * T, far, 0.05); else if (era === "victorian") x.strings([root + 25 + i], b * T, 3 * T, far, 0.012); else k.I.swell(b * T, 3 * T, far, { f: 180, fTo: 1100, gain: 0.045 }); });
        [6, 14, 22, 30].forEach((b) => (flav === "jp" ? x.koto(root + 13, b * T, far, 0.08) : k.I.clang(b * T, far, 0.04)));
      }
      /* ---- rhythm for fights (and a pulse for the modern eras) */
      if (mood === "fight" || mood === "boss") for (let b = 0; b < beats; b += 0.5) {
        const on = b % 1 === 0, bt = b % 8;
        if (flav === "jp" || era === "medieval") { if ([0, 1.5, 3, 4, 5.5, 7].includes(bt)) (flav === "jp" ? x.taiko : x.frame)(b * T, perc, flav === "jp" ? 0.6 : 0.35); }
        else if (era === "victorian") { if (on && bt % 2 === 0) k.I.tom(b * T, perc, 70, 0.5); if (bt === 3.5 || bt === 7.5) chordAt(b).forEach((m) => x.strings([m + 12], b * T, 0.4 * T, lead, 0.02)); }
        else if (era === "wars") { k.I.snare(b * T, perc, on ? 0.12 : 0.05); if (bt === 0 || bt === 4) x.brass(chordAt(b).map((n) => n + 12), b * T, 1.5 * T, lead, 0.04); }
        else if (era === "atomic") { x.brush(b * T, perc, on ? 0.05 : 0.03); if (bt === 1.5 || bt === 5.5) x.brass(chordAt(b).map((n) => n + 12), b * T, 0.4 * T, lead, 0.045); }
        else { if (on) k.I.hat(b * T, perc, 0.05); if (bt === 0 || bt === 2.5 || bt === 4) k.I.kick(b * T, perc, 0.55); if (bt === 2 || bt === 6) k.I.snare(b * T, perc, 0.18); if (bt % 2 === 1) x.synth(chordAt(b)[0], b * T, 0.3 * T, lead, 0.04); }
        if (mood === "boss" && bt === 0) k.I.choir(chordAt(b).map((n) => n + 12), b * T, 7.6 * T, far, { gain: 0.035 });
      }
      if ((era === "modern" || era === "now") && mood === "explore") for (let b = 0; b < beats; b++) k.I.hat((b + 0.5) * T, perc, 0.025);
    } };
  };

  /* ---------------------------------------------------------------- music inside the scene (lo-fi, crackly, far away) */
  const SRC = {
    gramophone: { bpm: 92, era: "wars", inst: "piano", crackle: 0.05, lp: 2400 },
    radio: { bpm: 100, era: "atomic", inst: "vibes", crackle: 0.03, lp: 3000 },
    jukebox: { bpm: 132, era: "atomic", inst: "rock", crackle: 0.01, lp: 4000 },
    organ: { bpm: 60, era: "victorian", inst: "organ", crackle: 0, lp: 6000 },
    musicbox: { bpm: 80, era: "victorian", inst: "box", crackle: 0, lp: 8000 },
    piano: { bpm: 76, era: "victorian", inst: "piano", crackle: 0, lp: 5000 },
    lute: { bpm: 70, era: "medieval", inst: "lute", crackle: 0, lp: 5000 }
  };
  const source = (kind) => { const S = SRC[kind]; return { bpm: S.bpm, bars: 8, render: (k, T) => {
    const rnd = seeded("src" + kind), x = X(k), E = ERA[S.era], mode = kind === "musicbox" || kind === "jukebox" ? "major" : E.mode, root = E.root + 2;
    const room = k.bus(0.6, 0.3);
    const chords = [0, 3, 4, 0].map((d) => triad(mode, root, d, true)), mel = tune(rnd, mode, root, 16, [0, 3, 4, 0]);
    if (S.crackle) x.crackle(32 * T + 2, room, S.crackle, rnd);
    chords.forEach((c, i) => {
      const t = i * 8 * T;
      if (S.inst === "organ") x.organ(c, t, 7.8 * T, room, 0.02);
      else if (S.inst === "piano") for (let b = 0; b < 8; b++) { x.piano((b % 2 ? c[1 + (b % 3)] : c[0] - 12), t + b * T, room, 0.08, 0.7); }
      else if (S.inst === "vibes") for (let b = 0; b < 8; b += 2) c.slice(1).forEach((m) => x.vibes(m, t + b * T, room, 0.04));
      else if (S.inst === "rock") for (let b = 0; b < 8; b++) { k.I.bass(c[0] - 12 + (b % 2 ? 7 : 0), t + b * T, 0.8 * T, room, { gain: 0.15 }); if (b % 2) k.I.snare(t + b * T, room, 0.1); else k.I.kick(t + b * T, room, 0.3); }
      else if (S.inst === "lute") for (let b = 0; b < 8; b += 0.5) if (rnd() < 0.6) k.I.pluck(c[Math.floor(rnd() * 3)] + 12, t + b * T, room, { gain: 0.08, d: 0.6 });
    });
    mel.forEach((m, i) => { const t = i * 2 * T; if (S.inst === "box") k.I.bell(m + 24, t, room, { gain: 0.05, d: 1.4 }); else if (S.inst === "organ") x.organ([m + 12], t, 1.8 * T, room, 0.015); else if (S.inst === "vibes") x.vibes(m + 12, t, room, 0.06); else if (S.inst !== "rock") x.piano(m + 12, t, room, 0.09); else x.synth(m + 12, t, T, room, 0.04); });
  } }; };
  const SRC_WORDS = [["gramophone", /gramophone|phonograph|victrola/i], ["jukebox", /jukebox/i], ["radio", /\bradio\b|wireless|transistor/i], ["organ", /\borgan\b|harmonium/i],
    ["musicbox", /music[- ]box/i], ["piano", /\bpiano\b|pianola/i], ["lute", /\blute\b|minstrel|fiddler/i]];

  /* ---------------------------------------------------------------- registering the cues */
  const MOODS = ["home", "explore", "tension", "fight", "boss"];
  const reg = (key, make, vol = 0.7) => { if (!window.ASSETS.music[key]) window.ASSETS.music[key] = { src: `assets/audio/music/${key}.mp3`, loop: 0, volume: vol }; SYN.MUSIC[key] = make; };
  for (const era of Object.keys(ERA)) for (const m of MOODS) reg(`cue_${era}_${m}`, compose(era, m));
  for (const f of Object.keys(FLAV)) for (const m of ["explore", "tension", "fight"]) for (const era of Object.keys(ERA)) reg(`cue_${f}_${era}_${m}`, compose(era, m, f));
  for (const s of Object.keys(SRC)) reg(`src_${s}`, source(s), 0.45);

  /* ---------------------------------------------------------------- choosing */
  const SCORE = (window.SCORE = { on: true, ERA, FLAV });
  const MOOD = { title: "title", hideout: "home", investigation: "explore", basement: "tension", paperhouse: "tension", combat: "fight", boss: "boss" };
  const eraNow = () => {
    const M = window.MODULE, inCase = window.GAME && GAME.state && document.body.dataset.mode !== "hub";
    const year = (inCase && M && M.year) || (window.CAMP && CAMP.camp && CAMP.camp.year) || 1976;
    return window.CDATA ? CDATA.eraOf(year).id : "modern";
  };
  const flavNow = () => {
    const M = window.MODULE; if (!M || !(window.GAME && GAME.state)) return null;
    const a = (window.ADV && ADV.LIBRARY[M.id]) || M, s = `${a.setting || ""} ${M.flavor || a.flavor || ""}`;
    if (M.id === "death-of-a-bloodline" || /japan|tokyo|aomori|kyoto|\bjp\b/i.test(s)) return "jp";
    if (/china|yunnan|chengdu|beijing|shanghai/i.test(s)) return "cn";
    if (/bahamas|eleuthera|jamaica|caribbean|haiti|trinidad/i.test(s)) return "carib";
    if (/oklahoma|nevada|kansas|texas|route 66|dust|cimarron|humboldt/i.test(s)) return "plains";
    return null;
  };
  /* how close to breaking is the team: the worst ratio of anyone's Health or Sanity */
  const strain = () => { try { const t = GAME.active(); if (!t.length) return 0; return Math.max(...t.map((a) => 1 - Math.min(a.pools.health.cur / a.pools.health.max, a.pools.sanity.cur / a.pools.sanity.max))); } catch (e) { return 0; } };
  SCORE.pick = (key) => {
    if (!SCORE.on || key == null || key.startsWith("cue_") || key.startsWith("src_")) return key;
    if (window.MODULE && MODULE.id === "death-of-a-bloodline" && (key === "paperhouse" || key === "ending_banish" || key === "ending_kill")) return key;   // the first case keeps its own score
    const mood = MOOD[key]; if (!mood || mood === "title") return key;
    let m = mood; if (m === "explore" && strain() > 0.6) m = "tension";
    const era = eraNow(), fl = flavNow();
    if (fl && (m === "explore" || m === "tension" || m === "fight")) return `cue_${fl}_${era}_${m}`;
    return `cue_${era}_${m}`;
  };
  const music0 = A.music;
  let asked = null;
  A.music = (key, fade) => { asked = key; return music0.call(A, SCORE.pick(key), fade); };

  /* music in the room: a scene that mentions a gramophone, radio, organ... plays it, quietly, instead */
  SCORE.sourceFor = (text) => { for (const [k, re] of SRC_WORDS) if (re.test(text || "")) return k; return null; };
  let srcOn = null;
  document.addEventListener("DOMContentLoaded", () => {
    const G = window.GAME; if (!G || !G.goto) return;
    const goto0 = G.goto;
    G.goto = async function (id) {
      const r = await goto0.apply(this, arguments);
      try {
        const story = (document.querySelector("#story") || {}).textContent || "";
        const k = SCORE.sourceFor(story.slice(-1400));
        if (k && document.body.dataset.mode !== "combat") { srcOn = k; music0.call(A, `src_${k}`, 1.5); }
        else if (srcOn) { srcOn = null; A.music(asked || "investigation"); }
      } catch (e) { /* music is never worth a crash */ }
      return r;
    };
    /* re-check strain after each turn of play: slide between explore and tension */
    setInterval(() => { if (!SCORE.on || srcOn || !asked || MOOD[asked] !== "explore" || document.body.dataset.mode === "combat") return; const want = SCORE.pick(asked); if (A.musicKey !== want) A.music(asked); }, 6000);
  });
})();
