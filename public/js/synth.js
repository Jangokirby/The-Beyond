/* ============================================================================
   SYNTH — ambience and sound effects made in code (music is recordings only, see js/score.js).

   Whenever an audio file listed in manifest.js can't be loaded, the player asks
   this file to build the sound instead, so the game is never silent. Drop real
   recordings into assets/audio/ (same names as manifest.js) and they win: this
   only runs for files that are missing.

   Everything renders once into an AudioBuffer with an OfflineAudioContext and
   is cached, so it costs nothing after the first time a sound plays.
   ========================================================================== */
(function () {
  const A = window.AudioMan;
  if (!A) return;
  const SR = 44100;
  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
  const seeded = (seed) => { let s = 0; for (const ch of String(seed)) s = (s * 31 + ch.charCodeAt(0)) >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; };

  /* ------------------------------------------------------------ building blocks */
  function kit(ctx, seed) {
    const rnd = seeded(seed);
    const noiseBuf = (() => { const b = ctx.createBuffer(1, SR * 2, SR), d = b.getChannelData(0); const r = seeded(seed + "n"); for (let i = 0; i < d.length; i++) d[i] = r() * 2 - 1; return b; })();
    const out = ctx.createGain(); out.gain.value = 0.9;
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 3; comp.attack.value = 0.01; comp.release.value = 0.3;
    out.connect(comp); comp.connect(ctx.destination);
    const verb = (sec = 3.2, decay = 3) => {
      const len = Math.floor(SR * sec), ir = ctx.createBuffer(2, len, SR), r = seeded(seed + "ir");
      for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (r() * 2 - 1) * Math.pow(1 - i / len, decay); }
      const cv = ctx.createConvolver(); cv.buffer = ir; return cv;
    };
    const wet = ctx.createGain(); wet.gain.value = 0.32;
    const rv = verb(); wet.connect(rv); rv.connect(out);
    /* a bus: dry to out, plus a send into the reverb */
    const bus = (send = 0.3, pan = 0) => {
      const g = ctx.createGain(), p = ctx.createStereoPanner(); p.pan.value = pan;
      g.connect(p); p.connect(out);
      if (send) { const s = ctx.createGain(); s.gain.value = send; g.connect(s); s.connect(wet); }
      return g;
    };
    const env = (param, t, a, peak, d, sus, r, len) => {
      param.setValueAtTime(0.0001, t);
      param.linearRampToValueAtTime(peak, t + a);
      param.exponentialRampToValueAtTime(Math.max(0.0001, peak * sus), t + a + d);
      param.setValueAtTime(Math.max(0.0001, peak * sus), t + Math.max(a + d, len));
      param.exponentialRampToValueAtTime(0.0001, t + Math.max(a + d, len) + r);
    };
    const osc = (type, f, t, dur, dest, o = {}) => {
      const s = ctx.createOscillator(); s.type = type; s.frequency.setValueAtTime(f, t);
      if (o.to) s.frequency.exponentialRampToValueAtTime(o.to, t + (o.glide || dur));
      if (o.detune) s.detune.value = o.detune;
      if (o.vib) { const l = ctx.createOscillator(), lg = ctx.createGain(); l.frequency.value = o.vib; lg.gain.value = o.vibDepth || 6; l.connect(lg); lg.connect(s.detune); l.start(t); l.stop(t + dur + (o.r || 0.5) + 0.1); }
      const g = ctx.createGain(); s.connect(g);
      let node = g;
      if (o.lp) { const f2 = ctx.createBiquadFilter(); f2.type = "lowpass"; f2.frequency.value = o.lp; f2.Q.value = o.q || 0.7; if (o.lpTo) f2.frequency.exponentialRampToValueAtTime(o.lpTo, t + dur); g.connect(f2); node = f2; }
      node.connect(dest);
      env(g.gain, t, o.a ?? 0.005, o.gain ?? 0.3, o.d ?? 0.1, o.s ?? 0.6, o.r ?? 0.3, dur);
      s.start(t); s.stop(t + dur + (o.r ?? 0.3) + 0.2);
      return s;
    };
    const noise = (t, dur, dest, o = {}) => {
      const s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
      const f = ctx.createBiquadFilter(); f.type = o.type || "bandpass"; f.frequency.setValueAtTime(o.f || 1200, t); f.Q.value = o.q || 0.8;
      if (o.fTo) f.frequency.exponentialRampToValueAtTime(o.fTo, t + dur);
      const g = ctx.createGain(); s.connect(f); f.connect(g); g.connect(dest);
      env(g.gain, t, o.a ?? 0.002, o.gain ?? 0.3, o.d ?? 0.05, o.s ?? 0.3, o.r ?? 0.1, dur);
      s.start(t, rnd() * 1.5); s.stop(t + dur + (o.r ?? 0.1) + 0.2);
    };
    /* instruments */
    const I = {
      pad: (notes, t, dur, dest, o = {}) => { for (const m of notes) for (const dt of [-7, 7]) osc(o.wave || "sawtooth", mtof(m), t, dur, dest, { detune: dt, a: o.a ?? 1.6, d: 0.5, s: 0.8, r: o.r ?? 2.2, gain: (o.gain ?? 0.05), lp: o.lp ?? 900, q: 0.5 }); },
      pluck: (m, t, dest, o = {}) => { osc("triangle", mtof(m), t, 0.05, dest, { a: 0.003, d: o.d ?? 0.7, s: 0.001, r: 0.3, gain: o.gain ?? 0.22, lp: o.lp ?? 2600 }); osc("sine", mtof(m + 12), t, 0.02, dest, { a: 0.002, d: 0.25, s: 0.001, r: 0.2, gain: (o.gain ?? 0.22) * 0.3 }); },
      bell: (m, t, dest, o = {}) => { const f = mtof(m); [[1, 1], [2.0, 0.5], [2.76, 0.35], [5.4, 0.18], [8.9, 0.08]].forEach(([k, g]) => osc("sine", f * k, t, 0.01, dest, { a: 0.002, d: (o.d ?? 2.2) / (k * 0.6), s: 0.001, r: 0.5, gain: (o.gain ?? 0.12) * g })); },
      bass: (m, t, dur, dest, o = {}) => { osc("sine", mtof(m), t, dur, dest, { a: 0.01, d: 0.2, s: 0.7, r: 0.15, gain: o.gain ?? 0.28 }); osc("square", mtof(m), t, dur, dest, { a: 0.01, d: 0.15, s: 0.4, r: 0.1, gain: (o.gain ?? 0.28) * 0.18, lp: 500 }); },
      drone: (m, t, dur, dest, o = {}) => { osc("sawtooth", mtof(m), t, dur, dest, { a: 3, d: 1, s: 0.9, r: 3, gain: o.gain ?? 0.06, lp: o.lp ?? 300, vib: 0.13, vibDepth: 9 }); osc("sine", mtof(m - 12), t, dur, dest, { a: 3, d: 1, s: 0.9, r: 3, gain: (o.gain ?? 0.06) * 2 }); },
      choir: (notes, t, dur, dest, o = {}) => { for (const m of notes) for (const fm of [650, 1080]) { const s = ctx.createOscillator(); s.type = "sawtooth"; s.frequency.value = mtof(m); s.detune.value = (rnd() - 0.5) * 14; const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = fm; bp.Q.value = 6; const g = ctx.createGain(); s.connect(bp); bp.connect(g); g.connect(dest); env(g.gain, t, 1.2, o.gain ?? 0.09, 0.4, 0.85, 1.8, dur); s.start(t); s.stop(t + dur + 2.2); } },
      stab: (notes, t, dest, o = {}) => { for (const m of notes) osc("sawtooth", mtof(m), t, 0.08, dest, { a: 0.005, d: 0.18, s: 0.2, r: 0.12, gain: o.gain ?? 0.07, lp: o.lp ?? 1800, lpTo: 600 }); },
      kick: (t, dest, g = 0.7) => osc("sine", 120, t, 0.25, dest, { to: 42, glide: 0.18, a: 0.002, d: 0.25, s: 0.01, r: 0.1, gain: g }),
      tom: (t, dest, f = 110, g = 0.5) => { osc("sine", f, t, 0.3, dest, { to: f * 0.55, glide: 0.3, a: 0.002, d: 0.35, s: 0.01, r: 0.15, gain: g }); noise(t, 0.03, dest, { f: 900, q: 1, gain: g * 0.25, d: 0.05, s: 0.01 }); },
      snare: (t, dest, g = 0.25) => { noise(t, 0.06, dest, { type: "highpass", f: 1500, gain: g, d: 0.12, s: 0.05, r: 0.08 }); osc("triangle", 190, t, 0.05, dest, { a: 0.001, d: 0.08, s: 0.01, r: 0.05, gain: g * 0.6 }); },
      hat: (t, dest, g = 0.06, len = 0.03) => noise(t, len, dest, { type: "highpass", f: 7000, gain: g, d: 0.04, s: 0.1, r: 0.03 }),
      shaker: (t, dest, g = 0.05) => noise(t, 0.05, dest, { f: 5000, q: 1.5, a: 0.02, gain: g, d: 0.05, s: 0.3, r: 0.05 }),
      heart: (t, dest, g = 0.5) => { osc("sine", 60, t, 0.1, dest, { to: 40, glide: 0.12, a: 0.004, d: 0.14, s: 0.01, r: 0.1, gain: g }); osc("sine", 55, t + 0.22, 0.08, dest, { to: 38, glide: 0.1, a: 0.004, d: 0.12, s: 0.01, r: 0.1, gain: g * 0.7 }); },
      clang: (t, dest, g = 0.08) => { const f = 180 + rnd() * 140; [1, 2.41, 3.77, 5.93, 8.2].forEach((k, i) => osc("sine", f * k, t, 0.01, dest, { a: 0.001, d: 3 / (i + 1), s: 0.001, r: 1, gain: g / (i * 0.5 + 1) })); },
      swell: (t, dur, dest, o = {}) => noise(t, dur, dest, { type: "bandpass", f: o.f || 400, fTo: o.fTo || 2400, q: 2, a: dur * 0.8, gain: o.gain ?? 0.12, d: 0.1, s: 0.8, r: dur * 0.3 })
    };
    return { ctx, out, bus, osc, noise, I, rnd };
  }
  const render = async (secs, fn, seed, ch = 2) => {
    const ctx = new OfflineAudioContext(ch, Math.ceil(SR * secs), SR);
    fn(kit(ctx, seed));
    return ctx.startRendering();
  };

  /* ------------------------------------------------------------ music
     Each cue is a few bars that loop; the player overlaps passes so the reverb tail
     carries across the seam. chords: arrays of MIDI notes. */
  const prog = (root, list) => list.map((ch) => ch.map((n) => root + n));
  const MUSIC = {
    title: { bpm: 60, bars: 8, render: (k, T) => {
      const pad = k.bus(0.5), pl = k.bus(0.6, 0.25), dr = k.bus(0.3), ch = prog(50, [[0, 3, 7, 10], [-4, 0, 3, 7], [-7, -3, 0, 5], [-5, -1, 2, 7]]);
      ch.forEach((c, i) => { const t = i * 8 * T; k.I.pad(c, t, 7.6 * T, pad, { gain: 0.035, lp: 800 }); k.I.drone(c[0] - 12, t, 7.6 * T, dr, { gain: 0.03 }); });
      const mel = [74, 72, 69, 67, 69, 72, 70, 69, 65, 67, 69, 62];
      mel.forEach((m, i) => k.I.pluck(m, (2 + i * 2.5) * T, pl, { gain: 0.12, d: 1.6 }));
      for (let b = 0; b < 32; b += 4) k.I.bell(86 - (b % 8 ? 5 : 0), (b + 3.5) * T, pl, { gain: 0.04, d: 3 });
    } },
    hideout: { bpm: 72, bars: 8, render: (k, T) => {
      const pad = k.bus(0.4), ep = k.bus(0.35, -0.2), bs = k.bus(0.1), dr = k.bus(0.15, 0.2), ch = prog(57, [[0, 3, 7, 10], [5, 8, 12, 15], [-2, 2, 5, 9], [3, 7, 10, 14]]);
      ch.forEach((c, i) => {
        const t = i * 8 * T; k.I.pad(c, t, 7.8 * T, pad, { gain: 0.025, lp: 1100, wave: "triangle" });
        for (let b = 0; b < 8; b++) { if (b % 2 === 0) k.I.pluck(c[(b / 2 + i) % 4] + 12, t + (b + (b % 4 === 2 ? 0.5 : 0)) * T, ep, { gain: 0.08, d: 0.9, lp: 1800 }); }
        k.I.bass(c[0] - 12, t, 1.6 * T, bs, { gain: 0.2 }); k.I.bass(c[0] - 12, t + 3 * T, 0.8 * T, bs, { gain: 0.15 }); k.I.bass(c[2] - 12, t + 4 * T, 1.6 * T, bs, { gain: 0.18 }); k.I.bass(c[0] - 12, t + 6.5 * T, 1.2 * T, bs, { gain: 0.15 });
        for (let b = 0; b < 8; b++) { k.I.hat(t + (b + 0.5) * T, dr, 0.035); if (b % 2 === 1) k.I.snare(t + b * T, dr, 0.06); if (b % 4 === 0) k.I.kick(t + b * T, dr, 0.25); }
      });
    } },
    investigation: { bpm: 84, bars: 8, render: (k, T) => {
      const pad = k.bus(0.45), pl = k.bus(0.5, 0.3), bs = k.bus(0.1), dr = k.bus(0.25, -0.2), ch = prog(50, [[0, 3, 7], [-2, 2, 5], [-4, 0, 3], [-5, -1, 2]]);
      ch.forEach((c, i) => {
        const t = i * 8 * T; k.I.pad(c.map((n) => n + 12), t, 7.8 * T, pad, { gain: 0.028, lp: 700 });
        for (let b = 0; b < 8; b++) k.I.bass(c[0] - 12, t + b * T, 0.35 * T, bs, { gain: b % 4 === 0 ? 0.22 : 0.12 });
        [0, 1.5, 3, 4.5, 6].forEach((b, j) => { if (k.rnd() < 0.75) k.I.pluck(c[j % 3] + 24 + (j === 4 ? 2 : 0), t + b * T, pl, { gain: 0.09, d: 0.8 }); });
        for (let b = 0; b < 8; b++) { k.I.shaker(t + (b + 0.5) * T, dr, 0.03); if (b === 3 || b === 7) k.I.snare(t + b * T, dr, 0.05); }
      });
    } },
    basement: { bpm: 56, bars: 8, render: (k, T) => {
      const dr = k.bus(0.5), fx = k.bus(0.8, 0), hb = k.bus(0.15);
      k.I.drone(38, 0, 32 * T, dr, { gain: 0.07, lp: 260 }); k.I.drone(44, 8 * T, 16 * T, dr, { gain: 0.04, lp: 400 });
      for (let b = 0; b < 32; b += 2) k.I.heart(b * T, hb, 0.35);
      [5, 13, 22, 29].forEach((b) => k.I.clang(b * T, fx, 0.06));
      [3, 11, 19, 27].forEach((b) => k.I.swell(b * T, 3 * T, fx, { f: 200, fTo: 900, gain: 0.05 }));
      [7.5, 15, 23.5].forEach((b, i) => k.I.pluck([62, 63, 61][i], b * T, fx, { gain: 0.06, d: 2.5, lp: 1200 }));
    } },
    paperhouse: { bpm: 66, bars: 8, render: (k, T) => {
      const box = k.bus(0.7, 0.2), pad = k.bus(0.6), wt = [60, 62, 64, 66, 68, 70];
      k.I.drone(42, 0, 32 * T, pad, { gain: 0.04, lp: 500 });
      k.I.choir([66, 70], 0, 15 * T, pad, { gain: 0.04 }); k.I.choir([64, 68], 16 * T, 15 * T, pad, { gain: 0.04 });
      for (let b = 0; b < 32; b += 0.75) if (k.rnd() < 0.55) k.I.bell(wt[Math.floor(k.rnd() * wt.length)] + 12 * (k.rnd() < 0.3 ? 2 : 1), (b + k.rnd() * 0.15) * T, box, { gain: 0.045, d: 1.6 });
    } },
    combat: { bpm: 126, bars: 8, render: (k, T) => {
      const dr = k.bus(0.2), bs = k.bus(0.05), st = k.bus(0.25, 0.2), pad = k.bus(0.4), ch = prog(45, [[0, 3, 7], [0, 3, 7], [-4, 0, 3], [-2, 2, 5]]);
      ch.forEach((c, i) => {
        const t = i * 8 * T; k.I.pad(c.map((n) => n + 12), t, 7.8 * T, pad, { gain: 0.025, lp: 1200, a: 0.3 });
        for (let b = 0; b < 8; b += 0.5) { k.I.bass(c[0] - 12 + (b % 2 === 1.5 ? 12 : 0), t + b * T, 0.22 * T, bs, { gain: 0.16 }); k.I.hat(t + b * T, dr, b % 1 ? 0.03 : 0.05); }
        [0, 0.75, 1.5, 4, 4.75, 5.5].forEach((b) => k.I.tom(t + b * T, dr, b < 2 ? 90 : 120, 0.5));
        [2, 6].forEach((b) => k.I.snare(t + b * T, dr, 0.2)); [0, 3.5, 4].forEach((b) => k.I.kick(t + b * T, dr, 0.55));
        [1, 3, 5, 7].forEach((b) => k.I.stab(c.map((n) => n + 12), t + (b + 0.5) * T, st, { gain: 0.05 }));
      });
    } },
    boss: { bpm: 108, bars: 8, render: (k, T) => {
      const dr = k.bus(0.25), bs = k.bus(0.05), br = k.bus(0.35), ch = k.bus(0.6), C = prog(41, [[0, 3, 7], [1, 5, 8], [0, 3, 7], [-1, 3, 6]]);
      C.forEach((c, i) => {
        const t = i * 8 * T; k.I.choir(c.map((n) => n + 24), t, 7.8 * T, ch, { gain: 0.05 }); k.I.drone(c[0], t, 7.8 * T, br, { gain: 0.05, lp: 500 });
        for (let b = 0; b < 8; b += 0.5) k.I.bass(c[0] - 12, t + b * T, 0.2 * T, bs, { gain: 0.18 });
        [0, 1.5, 3, 4, 5.5, 7].forEach((b) => k.I.tom(t + b * T, dr, 75, 0.65)); [2, 6].forEach((b) => k.I.snare(t + b * T, dr, 0.22)); for (let b = 0; b < 8; b++) k.I.kick(t + b * T, dr, 0.4);
        [0, 4].forEach((b) => k.I.stab(c.map((n) => n + 12), t + b * T, br, { gain: 0.08, lp: 1200 }));
      });
    } },
    ending_banish: { bpm: 64, bars: 6, render: (k, T) => {
      const pad = k.bus(0.6), bl = k.bus(0.7, 0.2), C = prog(53, [[0, 4, 7, 11], [5, 9, 12, 16], [-3, 0, 4, 7], [-5, -1, 2, 7], [0, 4, 7, 12], [0, 4, 7, 12]]);
      C.forEach((c, i) => { k.I.pad(c, i * 4 * T, 3.9 * T, pad, { gain: 0.035, lp: 1400 }); c.forEach((m, j) => k.I.bell(m + 12, (i * 4 + j * 0.5) * T, bl, { gain: 0.04, d: 2.5 })); });
    } },
    ending_kill: { bpm: 58, bars: 6, render: (k, T) => {
      const pad = k.bus(0.5), ml = k.bus(0.5, -0.1), C = prog(48, [[0, 3, 7], [-4, 0, 3], [-7, -3, 0], [-5, -2, 2], [0, 3, 7], [0, 3, 7]]);
      C.forEach((c, i) => k.I.pad(c, i * 4 * T, 3.9 * T, pad, { gain: 0.04, lp: 700 }));
      [72, 70, 67, 68, 67, 63, 65, 62, 63, 60].forEach((m, i) => k.osc("triangle", mtof(m), (1 + i * 2) * T, 1.6 * T, ml, { a: 0.2, d: 0.5, s: 0.6, r: 1, gain: 0.09, lp: 1600, vib: 5, vibDepth: 8 }));
    } }
  };

  /* ------------------------------------------------------------ ambience (seamless loops) */
  const AMB = {
    rain: (k) => { const b = k.bus(0.2); k.noise(0, 8, b, { type: "lowpass", f: 2200, q: 0.3, a: 0.001, gain: 0.25, d: 0.1, s: 1, r: 0.001 }); k.noise(0, 8, b, { type: "highpass", f: 5000, a: 0.001, gain: 0.05, d: 0.1, s: 1, r: 0.001 }); for (let i = 0; i < 90; i++) k.noise(k.rnd() * 7.9, 0.01, b, { f: 2500 + k.rnd() * 4000, q: 4, gain: 0.08 * k.rnd(), d: 0.03, s: 0.01 }); },
    building: (k) => { const b = k.bus(0.1); k.osc("sine", 60, 0, 8, b, { a: 0.001, d: 0.1, s: 1, r: 0.001, gain: 0.06 }); k.osc("sine", 120, 0, 8, b, { a: 0.001, d: 0.1, s: 1, r: 0.001, gain: 0.025 }); k.noise(0, 8, b, { type: "lowpass", f: 600, a: 0.001, gain: 0.08, d: 0.1, s: 1, r: 0.001 }); },
    boiler: (k) => { const b = k.bus(0.4); k.noise(0, 8, b, { type: "lowpass", f: 140, q: 2, a: 0.001, gain: 0.35, d: 0.1, s: 1, r: 0.001 }); [1.3, 4.1, 6.6].forEach((t) => k.I.clang(t, b, 0.05)); }
  };

  /* ------------------------------------------------------------ sound effects */
  const FX = {
    ui_click: [0.12, (k) => k.osc("sine", 1800, 0, 0.01, k.bus(0), { a: 0.001, d: 0.03, s: 0.01, r: 0.02, gain: 0.12 })],
    ui_open: [0.4, (k) => k.noise(0, 0.2, k.bus(0.2), { f: 600, fTo: 3000, q: 2, a: 0.08, gain: 0.12, d: 0.1, s: 0.3, r: 0.1 })],
    ui_close: [0.4, (k) => k.noise(0, 0.2, k.bus(0.2), { f: 3000, fTo: 500, q: 2, a: 0.02, gain: 0.1, d: 0.1, s: 0.3, r: 0.1 })],
    page_turn: [0.6, (k) => { k.noise(0, 0.25, k.bus(0.1), { f: 2500, fTo: 1200, q: 0.8, a: 0.05, gain: 0.18, d: 0.1, s: 0.4, r: 0.15 }); k.noise(0.18, 0.05, k.bus(0), { type: "highpass", f: 3000, gain: 0.1, d: 0.05 }); }],
    dice_roll: [0.9, (k) => { const b = k.bus(0.05); for (let i = 0; i < 9; i++) { const t = i * 0.07 + k.rnd() * 0.04; k.noise(t, 0.01, b, { f: 2500 + k.rnd() * 2500, q: 3, gain: 0.25 * (1 - i / 11), d: 0.03, s: 0.01 }); k.osc("sine", 900 + k.rnd() * 900, t, 0.01, b, { a: 0.001, d: 0.03, s: 0.01, r: 0.02, gain: 0.05 }); } }],
    roll_success: [1.4, (k) => { const b = k.bus(0.4); k.I.bell(76, 0, b, { gain: 0.14, d: 1.2 }); k.I.bell(83, 0.12, b, { gain: 0.14, d: 1.6 }); }],
    roll_fail: [1.2, (k) => { const b = k.bus(0.3); k.osc("triangle", mtof(57), 0, 0.15, b, { a: 0.005, d: 0.3, s: 0.3, r: 0.4, gain: 0.18, lp: 900 }); k.osc("triangle", mtof(52), 0.18, 0.3, b, { a: 0.005, d: 0.4, s: 0.3, r: 0.5, gain: 0.18, lp: 700 }); }],
    roll_crit: [2.2, (k) => { const b = k.bus(0.5); [72, 76, 79, 84, 88].forEach((m, i) => k.I.bell(m, i * 0.08, b, { gain: 0.12, d: 1.8 })); k.I.swell(0, 0.6, b, { f: 2000, fTo: 8000, gain: 0.05 }); }],
    roll_fumble: [1.6, (k) => { const b = k.bus(0.4); k.osc("sawtooth", 90, 0, 0.5, b, { to: 50, glide: 0.5, a: 0.005, d: 0.4, s: 0.4, r: 0.6, gain: 0.15, lp: 400 }); k.osc("sawtooth", 95, 0, 0.5, b, { to: 52, glide: 0.5, a: 0.005, d: 0.4, s: 0.4, r: 0.6, gain: 0.12, lp: 400 }); }],
    clue: [1.8, (k) => { const b = k.bus(0.5, 0.1); k.I.bell(81, 0, b, { gain: 0.13, d: 2 }); k.I.bell(88, 0.15, b, { gain: 0.07, d: 2 }); }],
    objective: [2.6, (k) => { const b = k.bus(0.5); [[67, 0], [72, 0.15], [76, 0.3], [79, 0.5]].forEach(([m, t]) => k.osc("sawtooth", mtof(m), t, t === 0.5 ? 0.9 : 0.12, b, { a: 0.01, d: 0.2, s: 0.6, r: 0.6, gain: 0.07, lp: 2200 })); k.I.bell(91, 0.5, b, { gain: 0.06, d: 2 }); }],
    fate: [2, (k) => { const b = k.bus(0.7); for (let i = 0; i < 10; i++) k.I.bell(84 + Math.floor(k.rnd() * 12), i * 0.06, b, { gain: 0.04, d: 1.2 }); }],
    footsteps: [1.4, (k) => { const b = k.bus(0.1); [0, 0.32, 0.64, 0.96].forEach((t) => { k.osc("sine", 80, t, 0.04, b, { to: 50, a: 0.002, d: 0.08, s: 0.01, r: 0.05, gain: 0.3 }); k.noise(t, 0.03, b, { f: 700, gain: 0.08, d: 0.05, s: 0.01 }); }); }],
    door_slide: [1.0, (k) => k.noise(0, 0.6, k.bus(0.2), { f: 500, fTo: 900, q: 1.2, a: 0.05, gain: 0.2, d: 0.2, s: 0.7, r: 0.2 })],
    door_knock: [1.2, (k) => { const b = k.bus(0.3); [0, 0.22, 0.44].forEach((t) => { k.osc("sine", 180, t, 0.03, b, { to: 120, a: 0.001, d: 0.08, s: 0.01, r: 0.05, gain: 0.35 }); k.noise(t, 0.02, b, { f: 1500, gain: 0.12, d: 0.03, s: 0.01 }); }); }],
    door_creak: [1.6, (k) => k.osc("sawtooth", 140, 0, 1.0, k.bus(0.3), { to: 220, glide: 1, a: 0.1, d: 0.3, s: 0.7, r: 0.3, gain: 0.06, lp: 900, q: 6, vib: 11, vibDepth: 40 })],
    radio: [1.5, (k) => { const b = k.bus(0.1); k.noise(0, 1.0, b, { f: 1800, q: 1.5, a: 0.02, gain: 0.12, d: 0.1, s: 0.8, r: 0.2 }); [0.2, 0.5].forEach((t) => k.osc("sine", 1200, t, 0.08, b, { a: 0.002, d: 0.02, s: 1, r: 0.02, gain: 0.06 })); }],
    camera_shutter: [0.5, (k) => { const b = k.bus(0.1); k.noise(0, 0.02, b, { type: "highpass", f: 2000, gain: 0.25, d: 0.02 }); k.noise(0.09, 0.02, b, { f: 1500, gain: 0.2, d: 0.03 }); }],
    tape_click: [0.4, (k) => { k.noise(0, 0.015, k.bus(0.1), { f: 1200, q: 2, gain: 0.3, d: 0.02 }); k.osc("sine", 300, 0, 0.02, k.bus(0), { a: 0.001, d: 0.04, s: 0.01, r: 0.02, gain: 0.1 }); }],
    tape_whisper: [2.4, (k) => { const b = k.bus(0.6); for (let i = 0; i < 6; i++) k.noise(i * 0.28, 0.2, b, { f: 900 + k.rnd() * 1800, q: 6, a: 0.06, gain: 0.1, d: 0.1, s: 0.5, r: 0.15 }); }],
    elevator_ding: [2, (k) => k.I.bell(84, 0, k.bus(0.4), { gain: 0.15, d: 2.2 })],
    mail_chute: [1.6, (k) => { const b = k.bus(0.3); for (let i = 0; i < 14; i++) k.noise(i * 0.06 + k.rnd() * 0.02, 0.01, b, { f: 1000 + k.rnd() * 1500, q: 2, gain: 0.15 * (1 - i / 16), d: 0.04, s: 0.01 }); }],
    hallway_stretch: [3, (k) => { const b = k.bus(0.7); k.osc("sawtooth", 220, 0, 2, b, { to: 55, glide: 2, a: 0.3, d: 0.5, s: 0.8, r: 0.6, gain: 0.07, lp: 700 }); k.I.swell(0, 2, b, { f: 2000, fTo: 200, gain: 0.07 }); }],
    lily_chime: [2.2, (k) => { const b = k.bus(0.7, 0.2); [88, 91, 95].forEach((m, i) => k.I.bell(m, i * 0.11, b, { gain: 0.06, d: 1.8 })); }],
    paper_crinkle: [0.8, (k) => { const b = k.bus(0.1); for (let i = 0; i < 16; i++) k.noise(k.rnd() * 0.5, 0.01, b, { type: "highpass", f: 2500 + k.rnd() * 3000, gain: 0.12, d: 0.02, s: 0.01 }); }],
    paper_tear: [0.9, (k) => k.noise(0, 0.4, k.bus(0.1), { type: "highpass", f: 1500, fTo: 4000, a: 0.02, gain: 0.25, d: 0.1, s: 0.8, r: 0.05 })],
    paper_unfold: [0.9, (k) => { k.noise(0, 0.3, k.bus(0.2), { f: 1400, fTo: 2800, q: 1, a: 0.1, gain: 0.15, d: 0.1, s: 0.5, r: 0.1 }); k.noise(0.3, 0.02, k.bus(0), { type: "highpass", f: 3000, gain: 0.15, d: 0.04 }); }],
    gunshot: [1.8, (k) => { const b = k.bus(0.45); k.noise(0, 0.03, b, { type: "lowpass", f: 6000, a: 0.0005, gain: 0.9, d: 0.08, s: 0.1, r: 0.25 }); k.osc("sine", 140, 0, 0.1, b, { to: 40, glide: 0.15, a: 0.001, d: 0.2, s: 0.01, r: 0.1, gain: 0.6 }); }],
    axe_hit: [1.0, (k) => { const b = k.bus(0.2); k.osc("sine", 90, 0, 0.1, b, { to: 45, a: 0.001, d: 0.18, s: 0.01, r: 0.1, gain: 0.6 }); k.noise(0, 0.05, b, { f: 900, q: 0.7, gain: 0.4, d: 0.1, s: 0.05 }); k.I.clang(0, b, 0.03); }],
    blade_hit: [1.0, (k) => { const b = k.bus(0.3); k.noise(0, 0.03, b, { type: "highpass", f: 3000, gain: 0.3, d: 0.05, s: 0.05 }); k.I.clang(0, b, 0.06); k.osc("sine", 110, 0, 0.05, b, { to: 60, a: 0.001, d: 0.1, s: 0.01, r: 0.05, gain: 0.3 }); }],
    miss_whoosh: [0.6, (k) => k.noise(0, 0.25, k.bus(0.1), { f: 400, fTo: 2500, q: 1.5, a: 0.1, gain: 0.25, d: 0.05, s: 0.4, r: 0.1 })],
    spell_cast: [2, (k) => { const b = k.bus(0.7); k.I.swell(0, 0.8, b, { f: 300, fTo: 5000, gain: 0.1 }); [72, 79, 84, 91].forEach((m, i) => k.I.bell(m, 0.5 + i * 0.07, b, { gain: 0.05, d: 1.5 })); }],
    heal: [2, (k) => { const b = k.bus(0.6); k.I.pad([64, 68, 71, 76], 0, 0.6, b, { gain: 0.04, a: 0.2, r: 1, lp: 2000, wave: "triangle" }); k.I.bell(88, 0.2, b, { gain: 0.05, d: 1.5 }); }],
    burn: [1.4, (k) => { const b = k.bus(0.3); k.noise(0, 0.8, b, { type: "lowpass", f: 900, a: 0.05, gain: 0.25, d: 0.2, s: 0.6, r: 0.3 }); for (let i = 0; i < 20; i++) k.noise(k.rnd() * 0.9, 0.005, b, { type: "highpass", f: 3000, gain: 0.15, d: 0.01, s: 0.01 }); }],
    stun_gong: [3.5, (k) => { const b = k.bus(0.6); [1, 1.48, 1.97, 2.63, 3.41].forEach((r, i) => k.osc("sine", 110 * r, 0, 0.01, b, { a: 0.002, d: 3 - i * 0.4, s: 0.001, r: 1, gain: 0.12 / (i + 1), vib: 4, vibDepth: 6 })); }],
    shift_walls: [2.6, (k) => { const b = k.bus(0.6); k.noise(0, 1.8, b, { type: "lowpass", f: 180, q: 3, a: 0.4, gain: 0.45, d: 0.3, s: 0.7, r: 0.6 }); k.I.clang(1.2, b, 0.04); }],
    folding_flesh: [1.6, (k) => { const b = k.bus(0.3); for (let i = 0; i < 6; i++) k.noise(i * 0.15, 0.1, b, { f: 300 + k.rnd() * 500, fTo: 150, q: 8, a: 0.01, gain: 0.25, d: 0.1, s: 0.3, r: 0.1 }); }],
    sanity_hit: [1.8, (k) => { const b = k.bus(0.6); [79, 80, 86].forEach((m) => k.osc("sawtooth", mtof(m), 0, 0.4, b, { a: 0.01, d: 0.4, s: 0.3, r: 0.8, gain: 0.04, lp: 3000, vib: 7, vibDepth: 25 })); }],
    stability_hit: [1.8, (k) => k.osc("sine", 70, 0, 0.8, k.bus(0.5), { to: 45, glide: 0.8, a: 0.02, d: 0.5, s: 0.6, r: 0.6, gain: 0.35, vib: 6, vibDepth: 60 })],
    health_hit: [0.8, (k) => { const b = k.bus(0.15); k.osc("sine", 100, 0, 0.08, b, { to: 45, glide: 0.12, a: 0.001, d: 0.15, s: 0.01, r: 0.1, gain: 0.6 }); k.noise(0, 0.04, b, { f: 600, gain: 0.25, d: 0.07, s: 0.01 }); }],
    replica_flicker: [0.8, (k) => { const b = k.bus(0.2); for (let i = 0; i < 6; i++) k.osc("square", 120, i * 0.07, 0.03, b, { a: 0.001, d: 0.02, s: 1, r: 0.01, gain: 0.05, lp: 1500 }); }],
    replica_scream: [1.8, (k) => { const b = k.bus(0.6); k.osc("sawtooth", 600, 0, 0.9, b, { to: 900, glide: 0.4, a: 0.05, d: 0.3, s: 0.7, r: 0.5, gain: 0.06, lp: 2500, q: 5, vib: 9, vibDepth: 50 }); k.noise(0, 0.9, b, { f: 1800, q: 5, a: 0.05, gain: 0.07, d: 0.3, s: 0.7, r: 0.5 }); }],
    ghost_free: [3, (k) => { const b = k.bus(0.8); k.I.choir([72, 76, 79], 0, 1.4, b, { gain: 0.06 }); k.I.swell(0, 2, b, { f: 800, fTo: 6000, gain: 0.05 }); }],
    ghost_hit: [1.4, (k) => { const b = k.bus(0.6); k.osc("sine", 420, 0, 0.3, b, { to: 210, glide: 0.4, a: 0.005, d: 0.3, s: 0.3, r: 0.5, gain: 0.15, vib: 8, vibDepth: 30 }); }],
    ghost_shape: [2.2, (k) => { const b = k.bus(0.8); k.I.swell(0, 1.4, b, { f: 200, fTo: 1600, gain: 0.08 }); k.I.choir([61, 67], 0.2, 1.2, b, { gain: 0.05 }); }],
    ghost_die: [3, (k) => { const b = k.bus(0.8); k.I.choir([67, 70], 0, 1.4, b, { gain: 0.07 }); k.osc("sine", 600, 0, 1.6, b, { to: 80, glide: 1.6, a: 0.05, d: 0.5, s: 0.6, r: 0.8, gain: 0.08 }); }],
    banish: [3.5, (k) => { const b = k.bus(0.8); k.I.swell(0, 1.2, b, { f: 300, fTo: 8000, gain: 0.14 }); k.I.stab([60, 67, 72, 76], 1.2, b, { gain: 0.06, lp: 3000 }); [84, 88, 91, 96].forEach((m, i) => k.I.bell(m, 1.2 + i * 0.05, b, { gain: 0.05, d: 2 })); }],
    death_die: [4, (k) => { const b = k.bus(0.7); [0, 1.4].forEach((t) => [1, 2.0, 2.4, 3.0, 4.2].forEach((r, i) => k.osc("sine", 82 * r, t, 0.01, b, { a: 0.002, d: 3.2 - i * 0.5, s: 0.001, r: 1, gain: 0.16 / (i + 1) }))); }],
    injury: [1.2, (k) => { const b = k.bus(0.2); k.noise(0, 0.05, b, { f: 1200, q: 0.8, gain: 0.4, d: 0.08, s: 0.05 }); k.osc("sine", 70, 0, 0.1, b, { to: 40, a: 0.001, d: 0.2, s: 0.01, r: 0.1, gain: 0.5 }); k.osc("sawtooth", mtof(52), 0.1, 0.4, b, { a: 0.01, d: 0.3, s: 0.4, r: 0.4, gain: 0.05, lp: 800 }); }],
    lotus: [2.2, (k) => { const b = k.bus(0.7); [76, 79, 83, 88].forEach((m, i) => k.I.bell(m, i * 0.14, b, { gain: 0.05, d: 1.8 })); }],
    turn_start: [0.5, (k) => { const b = k.bus(0.1); k.osc("sine", 880, 0, 0.04, b, { a: 0.002, d: 0.08, s: 0.1, r: 0.05, gain: 0.1 }); k.osc("sine", 1320, 0.08, 0.04, b, { a: 0.002, d: 0.08, s: 0.1, r: 0.05, gain: 0.08 }); }],
    guard: [1.0, (k) => { const b = k.bus(0.3); k.I.clang(0, b, 0.06); k.osc("sine", 160, 0, 0.06, b, { to: 90, a: 0.001, d: 0.1, s: 0.01, r: 0.05, gain: 0.3 }); }],
    flare: [1.6, (k) => { const b = k.bus(0.3); k.noise(0, 0.15, b, { f: 800, fTo: 4000, q: 1, a: 0.01, gain: 0.3, d: 0.05, s: 0.6, r: 0.05 }); k.noise(0.15, 1.0, b, { type: "highpass", f: 2500, a: 0.02, gain: 0.12, d: 0.2, s: 0.6, r: 0.3 }); }]
  };

  /* ------------------------------------------------------------ hook into the player */
  const keyOf = (() => { let map = null; return (src) => { if (!map) { map = {}; const AS = window.ASSETS; for (const grp of ["music", "ambience", "sfx"]) for (const [k, e] of Object.entries(AS[grp] || {})) map[e.src] = [grp, k]; } return map[src]; }; })();
  const SYN = (window.SYNTH = { MUSIC, FX, AMB, made: {} });
  /* bring every sound to a steady level so quiet recipes aren't lost and loud ones don't clip */
  const LEVEL = { music: 0.55, ambience: 0.35, sfx: 0.7, ui_click: 0.3, ui_open: 0.35, ui_close: 0.35, turn_start: 0.4 };
  const normalize = (buf, target) => {
    let peak = 0;
    for (let c = 0; c < buf.numberOfChannels; c++) { const d = buf.getChannelData(c); for (let i = 0; i < d.length; i++) { const a = Math.abs(d[i]); if (a > peak) peak = a; } }
    if (peak > 0.0001) { const k = target / peak; for (let c = 0; c < buf.numberOfChannels; c++) { const d = buf.getChannelData(c); for (let i = 0; i < d.length; i++) d[i] *= k; } }
    return buf;
  };
  SYN.make = async (grp, key) => normalize(await makeRaw(grp, key), LEVEL[key] || LEVEL[grp]);
  const makeRaw = async (grp, key) => {
    if (grp === "music") {
      const m = MUSIC[key] || MUSIC.investigation, T = 60 / m.bpm, len = m.bars * 4 * T;
      const e = window.ASSETS.music[key]; if (e) e.loop = len;          // loop at the bar line; the rest is reverb tail
      return render(len + 4, (k) => m.render(k, T), "m:" + key);
    }
    if (grp === "ambience") return render(8, (k) => (AMB[key] || AMB.building)(k), "a:" + key);
    const f = FX[key] || FX.ui_click;
    return render(f[0], (k) => f[1](k), "s:" + key);
  };
  const origLoad = A.load;
  A.load = async (src) => {
    try { return await origLoad(src); }
    catch (e) {
      const k = keyOf(src); if (!k || !window.OfflineAudioContext) throw e;
      if (k[0] === "music") throw e;   // music is recordings only (js/score.js); sound effects and ambience can still be made here
      if (!SYN.made[src]) SYN.made[src] = SYN.make(k[0], k[1]);
      const buf = await SYN.made[src];
      A.buffers[src] = Promise.resolve(buf);
      return buf;
    }
  };
  /* warm the common ones up once sound is allowed, so the first click isn't silent */
  const origUnlock = A.unlock;
  A.unlock = async () => { const r = await origUnlock(); if (A.ctx) A.mode = "webaudio"; setTimeout(() => A.preload(["ui_click", "ui_open", "ui_close", "page_turn", "dice_roll", "roll_success", "roll_fail", "clue"]), 50); return r; };
})();
