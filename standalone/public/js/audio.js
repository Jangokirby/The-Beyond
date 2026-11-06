/* Audio: Web Audio when the files can be fetched (gapless, overlapping music
   loops), HTMLAudio as a fallback (for example when opened from file://). */
(function () {
  const A = { ctx: null, buffers: {}, musicKey: null, musicNodes: null, ambKey: null, ambNode: null,
    vol: { master: 0.9, music: 0.7, sfx: 0.9 }, unlocked: false, mode: "webaudio", html: {} };

  const AS = () => window.ASSETS;

  A.unlock = async () => {
    if (A.unlocked) return;
    A.unlocked = true;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      A.ctx = new AC();
      A.masterGain = A.ctx.createGain();
      A.musicGain = A.ctx.createGain();
      A.sfxGain = A.ctx.createGain();
      A.musicGain.connect(A.masterGain);
      A.sfxGain.connect(A.masterGain);
      A.masterGain.connect(A.ctx.destination);
      A.applyVolumes();
      if (A.ctx.state === "suspended") await A.ctx.resume();
      if (location.protocol === "file:") A.mode = "html";
    } catch (e) {
      A.mode = "html";
    }
  };

  A.applyVolumes = () => {
    if (A.ctx) {
      A.masterGain.gain.value = A.vol.master;
      A.musicGain.gain.value = A.vol.music;
      A.sfxGain.gain.value = A.vol.sfx;
    }
    for (const el of Object.values(A.html)) if (el && el._isMusic) el.volume = A.vol.master * A.vol.music * (el._base || 1);
  };

  A.load = async (src) => {
    if (A.buffers[src]) return A.buffers[src];
    const p = fetch(src).then((r) => { if (!r.ok) throw new Error(src); return r.arrayBuffer(); })
      .then((b) => new Promise((res, rej) => A.ctx.decodeAudioData(b, res, rej)));
    A.buffers[src] = p;
    try { return await p; } catch (e) { delete A.buffers[src]; throw e; }
  };

  A.preload = (keys) => {
    if (!A.ctx || A.mode !== "webaudio") return;
    for (const k of keys) {
      const e = AS().sfx[k] || AS().music[k];
      if (e) A.load(e.src).catch(() => {});
    }
  };

  /* ---- sound effects */
  A.sfx = async (key, opts = {}) => {
    const e = AS().sfx[key];
    if (!e || !A.unlocked) return;
    const vol = (e.volume ?? 1) * (opts.volume ?? 1);
    if (A.mode === "webaudio" && A.ctx) {
      try {
        const buf = await A.load(e.src);
        const s = A.ctx.createBufferSource();
        s.buffer = buf;
        if (opts.rate) s.playbackRate.value = opts.rate;
        const g = A.ctx.createGain();
        g.gain.value = vol;
        s.connect(g).connect(A.sfxGain);
        s.start();
        return;
      } catch (err) { A.mode = "html"; }
    }
    const el = new Audio(e.src);
    el.volume = Math.min(1, vol * A.vol.master * A.vol.sfx);
    el.play().catch(() => {});
  };

  /* ---- music: overlapping loop passes, crossfade between cues */
  A.music = async (key, fade = 2.0) => {
    if (key === A.musicKey) return;
    const prevKey = A.musicKey;
    A.musicKey = key;
    A.stopMusic(prevKey, fade);
    if (!key || !A.unlocked) return;
    const e = AS().music[key];
    if (!e) return;
    if (A.mode === "webaudio" && A.ctx) {
      try {
        const buf = await A.load(e.src);
        if (A.musicKey !== key) return;
        const g = A.ctx.createGain();
        g.gain.setValueAtTime(0.0001, A.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(e.volume ?? 1, A.ctx.currentTime + fade);
        g.connect(A.musicGain);
        const loopLen = e.loop && e.loop > 0 && e.loop < buf.duration ? e.loop : buf.duration;
        const node = { key, gain: g, sources: [], timer: null, next: A.ctx.currentTime + 0.05 };
        const schedule = () => {
          while (node.next < A.ctx.currentTime + 4) {
            const s = A.ctx.createBufferSource();
            s.buffer = buf;
            s.connect(g);
            s.start(node.next);
            node.sources.push(s);
            s.onended = () => { node.sources = node.sources.filter((x) => x !== s); };
            node.next += loopLen;
          }
        };
        schedule();
        node.timer = setInterval(schedule, 1000);
        A.musicNodes = A.musicNodes || {};
        A.musicNodes[key] = node;
        return;
      } catch (err) { A.mode = "html"; }
    }
    const el = new Audio(e.src);
    el.loop = true;
    el._isMusic = true;
    el._base = e.volume ?? 1;
    el.volume = 0;
    A.html[key] = el;
    el.play().catch(() => {});
    A.fadeEl(el, A.vol.master * A.vol.music * el._base, fade);
  };

  A.fadeEl = (el, to, sec) => {
    const from = el.volume;
    const t0 = performance.now();
    const step = () => {
      const k = Math.min(1, (performance.now() - t0) / (sec * 1000));
      el.volume = Math.max(0, Math.min(1, from + (to - from) * k));
      if (k < 1) requestAnimationFrame(step);
      else if (to === 0) el.pause();
    };
    requestAnimationFrame(step);
  };

  A.stopMusic = (key, fade = 1.5) => {
    if (!key) return;
    const node = A.musicNodes && A.musicNodes[key];
    if (node) {
      clearInterval(node.timer);
      const now = A.ctx.currentTime;
      node.gain.gain.cancelScheduledValues(now);
      node.gain.gain.setValueAtTime(Math.max(0.0001, node.gain.gain.value), now);
      node.gain.gain.exponentialRampToValueAtTime(0.0001, now + fade);
      for (const s of node.sources) { try { s.stop(now + fade + 0.1); } catch (e) {} }
      delete A.musicNodes[key];
    }
    const el = A.html[key];
    if (el) { A.fadeEl(el, 0, fade); delete A.html[key]; }
  };

  /* ---- ambience bed (rain, hum, boiler): a single looping layer */
  A.ambience = async (key) => {
    if (key === A.ambKey) return;
    const old = A.ambNode;
    A.ambKey = key;
    A.ambNode = null;
    if (old) {
      if (old.gain) {
        const now = A.ctx.currentTime;
        old.gain.gain.setValueAtTime(old.gain.gain.value, now);
        old.gain.gain.linearRampToValueAtTime(0, now + 1.5);
        try { old.src.stop(now + 1.6); } catch (e) {}
      } else if (old.el) A.fadeEl(old.el, 0, 1.5);
    }
    if (!key || !A.unlocked) return;
    const e = AS().ambience[key];
    if (!e) return;
    if (A.mode === "webaudio" && A.ctx) {
      try {
        const buf = await A.load(e.src);
        if (A.ambKey !== key) return;
        const src = A.ctx.createBufferSource();
        src.buffer = buf;
        src.loop = true;
        const g = A.ctx.createGain();
        g.gain.value = 0;
        g.gain.linearRampToValueAtTime(e.volume ?? 1, A.ctx.currentTime + 2);
        src.connect(g).connect(A.sfxGain);
        src.start();
        A.ambNode = { src, gain: g };
        return;
      } catch (err) { A.mode = "html"; }
    }
    const el = new Audio(e.src);
    el.loop = true;
    el.volume = 0;
    el.play().catch(() => {});
    A.fadeEl(el, Math.min(1, (e.volume ?? 1) * A.vol.master * A.vol.sfx), 2);
    A.ambNode = { el };
  };

  window.AudioMan = A;
})();
