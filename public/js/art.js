/* ============================================================================
   PROCEDURAL ART — backdrops, portraits and monster silhouettes drawn in code
   so every era, location and character has a picture without extra files.
   Everything is registered into window.ASSETS under a generated key, so the
   rest of the game just asks U.img(key, group) like it does for hand-made art.
   Swap any of it by pointing ASSETS at a real file instead.
   ========================================================================== */
(function () {
  const ART = {};
  const svgUri = (svg) => "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg).replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/'/g, "%27");
  const rng = (seed) => { let s = 0; for (const ch of String(seed)) s = (s * 31 + ch.charCodeAt(0)) >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; };
  const f = (n) => Math.round(n * 10) / 10;

  /* ------------------------------------------------------------ backdrops */
  const THEMES = {
    street:   { sky: ["#10131c", "#2a3040"], far: "#1b2130", mid: "#141824", near: "#0b0d14", accent: "#e7b563", kind: "city" },
    interior: { sky: ["#1d1814", "#2b241d"], far: "#2a221b", mid: "#1c1712", near: "#0f0c09", accent: "#e0a458", kind: "room" },
    cellar:   { sky: ["#0d0f12", "#181c22"], far: "#171b20", mid: "#101317", near: "#07090b", accent: "#6aa0a8", kind: "room" },
    forest:   { sky: ["#0c1511", "#1e3025"], far: "#14241c", mid: "#0e1a14", near: "#070d0a", accent: "#9fd1a0", kind: "forest" },
    village:  { sky: ["#1a1722", "#3b3248"], far: "#2a2433", mid: "#1d1824", near: "#0e0b13", accent: "#f0c27b", kind: "village" },
    castle:   { sky: ["#14141f", "#363a52"], far: "#22243a", mid: "#171829", near: "#0a0a14", accent: "#d9b36a", kind: "castle" },
    fog:      { sky: ["#1b1d22", "#4a4f57"], far: "#30343b", mid: "#23262c", near: "#101215", accent: "#f2d58f", kind: "city" },
    trench:   { sky: ["#241d17", "#5a4a3a"], far: "#3a3027", mid: "#2a221b", near: "#130e0a", accent: "#e8c58a", kind: "trench" },
    desert:   { sky: ["#2a1d2e", "#d98c5f"], far: "#8a4c3c", mid: "#5d3330", near: "#2a1618", accent: "#ffd9a0", kind: "dunes" },
    sea:      { sky: ["#0b1824", "#27506a"], far: "#173a52", mid: "#102a3d", near: "#08141f", accent: "#bfe3f0", kind: "sea" },
    snow:     { sky: ["#1d2733", "#8fa7bd"], far: "#5c7288", mid: "#41566b", near: "#1f2c3a", accent: "#ffffff", kind: "forest" },
    church:   { sky: ["#17131c", "#322a3d"], far: "#2a2234", mid: "#1c1625", near: "#0c0912", accent: "#e8b86b", kind: "church" },
    lab:      { sky: ["#0a1418", "#16323a"], far: "#12282f", mid: "#0c1c22", near: "#05100f", accent: "#7ef0d9", kind: "room" },
    modern:   { sky: ["#0e1226", "#3b2d5c"], far: "#251f42", mid: "#181530", near: "#090818", accent: "#ff7ad9", kind: "city" },
    future:   { sky: ["#071428", "#134a66"], far: "#0e3550", mid: "#0a2438", near: "#040e1a", accent: "#60f0ff", kind: "city" },
    drive:    { sky: ["#0b0b1e", "#2a1d4a"], far: "#241a3d", mid: "#170f2b", near: "#08050f", accent: "#ff5f6d", kind: "dunes" },
    cave:     { sky: ["#0a0a0d", "#1b1a22"], far: "#16151c", mid: "#0f0e14", near: "#06060a", accent: "#8f7ae0", kind: "cave" },
    train:    { sky: ["#10151f", "#2a3447"], far: "#1c2433", mid: "#141a26", near: "#090c12", accent: "#f2c36b", kind: "room" }
  };
  ART.themes = Object.keys(THEMES);

  /* Backdrops are built in layers, far to near. Each layer is mixed toward the sky colour by its
     distance (haze), the light source throws rays and rim light, and a fine grain sits over everything. */
  const hex2 = (c) => { const n = parseInt(c.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  const mixc = (a, b, t) => { const A = hex2(a), B = hex2(b); return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, "0")).join(""); };
  const lit = (c, k) => mixc(c, k > 0 ? "#ffffff" : "#000000", Math.abs(k));
  function scene(theme, seed) {
    const T = THEMES[theme] || THEMES.street, R = rng(theme + ":" + seed), W = 1600, H = 900;
    const rr = (a, b) => a + R() * (b - a), haze = T.sky[1], ac = T.accent;
    const kind = theme === "train" ? "train" : theme === "lab" ? "lab" : theme === "cellar" ? "cellar" : T.kind;
    const indoor = ["room", "lab", "cellar", "train", "church", "cave"].includes(kind);
    const wet = ["street", "fog", "modern", "future"].includes(theme);
    const mx = 260 + R() * 1080, my = 110 + R() * 120;   // moon / main light
    let g = `<defs>
<linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${lit(T.sky[0], -0.2)}"/><stop offset=".65" stop-color="${T.sky[1]}"/><stop offset="1" stop-color="${lit(T.sky[1], 0.08)}"/></linearGradient>
<radialGradient id="glow"><stop offset="0" stop-color="${ac}" stop-opacity=".9"/><stop offset=".4" stop-color="${ac}" stop-opacity=".25"/><stop offset="1" stop-color="${ac}" stop-opacity="0"/></radialGradient>
<radialGradient id="wglow"><stop offset="0" stop-color="#fff6dc" stop-opacity=".8"/><stop offset="1" stop-color="#fff6dc" stop-opacity="0"/></radialGradient>
<linearGradient id="ray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${ac}" stop-opacity=".22"/><stop offset="1" stop-color="${ac}" stop-opacity="0"/></linearGradient>
<linearGradient id="refl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${ac}" stop-opacity=".45"/><stop offset="1" stop-color="${ac}" stop-opacity="0"/></linearGradient>
<radialGradient id="v" cx="50%" cy="52%" r="72%"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".78"/></radialGradient>
<filter id="b"><feGaussianBlur stdDeviation="16"/></filter><filter id="b2"><feGaussianBlur stdDeviation="4"/></filter>
<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="${Math.floor(R() * 99)}"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 .09 0"/></filter>
</defs>`;
    g += `<rect width="${W}" height="${H}" fill="url(#s)"/>`;
    const sky = () => {
      if (!["city", "village", "forest", "castle", "dunes", "sea", "trench"].includes(kind)) return;
      if (!["fog", "trench", "desert"].includes(theme)) for (let i = 0; i < 90; i++) g += `<circle cx="${f(R() * W)}" cy="${f(R() * H * 0.55)}" r="${f(R() * 1.6 + 0.3)}" fill="#fff" opacity="${f(R() * 0.55 + 0.1)}"/>`;
      g += `<circle cx="${f(mx)}" cy="${f(my)}" r="260" fill="url(#glow)" opacity=".28"/>`;
      for (let i = 0; i < 7; i++) { const a0 = rr(0.3, 2.8), w = rr(0.03, 0.08); g += `<polygon points="${f(mx)},${f(my)} ${f(mx + Math.cos(a0) * 1400)},${f(my + Math.sin(a0) * 1400)} ${f(mx + Math.cos(a0 + w) * 1400)},${f(my + Math.sin(a0 + w) * 1400)}" fill="${ac}" opacity="${f(rr(0.015, 0.04))}"/>`; }
      g += `<circle cx="${f(mx)}" cy="${f(my)}" r="40" fill="${lit(ac, 0.25)}" opacity=".92"/><circle cx="${f(mx - 9)}" cy="${f(my - 8)}" r="10" fill="#000" opacity=".06"/><circle cx="${f(mx + 12)}" cy="${f(my + 10)}" r="7" fill="#000" opacity=".06"/>`;
      for (let i = 0; i < 6; i++) { const cx = rr(-100, W + 100), cy = rr(60, 380), rx = rr(180, 420); g += `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(rx * 0.12)}" fill="${lit(haze, 0.12)}" opacity="${f(rr(0.12, 0.28))}" filter="url(#b)"/>`; if (Math.abs(cx - mx) < 400) g += `<ellipse cx="${f(cx)}" cy="${f(cy - 6)}" rx="${f(rx * 0.8)}" ry="${f(rx * 0.05)}" fill="${ac}" opacity=".08" filter="url(#b2)"/>`; }
    };
    const layerCol = (d) => mixc(T.near, haze, d);       // d: 0 near .. 1 far
    sky();

    /* ---------------- outdoor kinds */
    if (kind === "city") {
      const depths = [0.78, 0.55, 0.32, 0.12];
      depths.forEach((d, li) => {
        const base = H - 150 + li * 6, col = layerCol(d), rim = mixc(col, ac, 0.35);
        for (let x = -40; x < W + 40;) {
          const w = rr(60, 150) * (1 - d * 0.3), h = (rr(140, 460) * (1 - d * 0.35) + li * 20) * (li === 3 ? 0.72 : 1);
          const y = base - h;
          g += `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h + 160)}" fill="${col}"/>`;
          if (R() < 0.35) g += `<rect x="${f(x + w * 0.2)}" y="${f(y - rr(20, 60))}" width="${f(w * 0.6)}" height="${f(rr(20, 60) + 1)}" fill="${col}"/>`;
          if (R() < 0.25) g += `<line x1="${f(x + w * 0.7)}" y1="${f(y)}" x2="${f(x + w * 0.7)}" y2="${f(y - rr(30, 80))}" stroke="${col}" stroke-width="3"/>`;
          if (R() < 0.2 && li < 3) { const tx = x + w * 0.3; g += `<rect x="${f(tx)}" y="${f(y - 34)}" width="26" height="22" rx="3" fill="${col}"/><line x1="${f(tx + 4)}" y1="${f(y - 12)}" x2="${f(tx + 2)}" y2="${f(y)}" stroke="${col}" stroke-width="3"/><line x1="${f(tx + 22)}" y1="${f(y - 12)}" x2="${f(tx + 24)}" y2="${f(y)}" stroke="${col}" stroke-width="3"/>`; }
          if (x + w / 2 < mx + 200) g += `<line x1="${f(x)}" y1="${f(y)}" x2="${f(x + w)}" y2="${f(y)}" stroke="${rim}" stroke-width="2" opacity=".6"/>`;
          { const ww = 9 + li * 2, wh = 12 + li * 3, gx = 20 + li * 4, gy = 26 + li * 5;
            for (let wy = y + 18; wy < base - 20; wy += gy) for (let wx = x + 10; wx < x + w - ww - 6; wx += gx) { const r = R(); if (r < (li === 3 ? 0.2 : 0.22 - li * 0.03)) g += `<rect x="${f(wx)}" y="${f(wy)}" width="${ww}" height="${wh}" fill="${r < 0.05 ? "#cfe3ff" : ac}" opacity="${f(0.35 + R() * 0.5 - d * 0.3)}"/>`; else if (r < 0.5) g += `<rect x="${f(wx)}" y="${f(wy)}" width="${ww}" height="${wh}" fill="#000" opacity=".18"/>`; } }
          if (theme === "modern" && li === 1 && R() < 0.3) g += `<rect x="${f(x + 8)}" y="${f(y + 30)}" width="${f(Math.min(60, w - 16))}" height="16" rx="3" fill="${ac}" opacity=".85"/><rect x="${f(x + 8)}" y="${f(y + 30)}" width="${f(Math.min(60, w - 16))}" height="16" rx="3" fill="${ac}" opacity=".5" filter="url(#b2)"/>`;
          x += w + rr(0, 14);
        }
      });
      const gy = H - 150;
      g += `<rect y="${gy}" width="${W}" height="150" fill="${T.near}"/><rect y="${gy}" width="${W}" height="10" fill="${lit(T.near, 0.08)}"/>`;
      for (let i = 0; i < 4; i++) { const lx = 140 + i * 420 + rr(-40, 40);
        g += `<polygon points="${f(lx - 4)},${H - 360} ${f(lx + 10)},${H - 360} ${f(lx + 150)},${H} ${f(lx - 140)},${H}" fill="url(#ray)" opacity=".55"/>`;
        g += `<rect x="${f(lx)}" y="${H - 370}" width="7" height="${370 - 150 + 10}" fill="${lit(T.near, -0.3)}"/><path d="M${f(lx - 12)} ${H - 372} h 31 l -6 -14 h -19z" fill="${lit(T.near, -0.3)}"/><circle cx="${f(lx + 3.5)}" cy="${H - 366}" r="90" fill="url(#glow)" opacity=".5"/><circle cx="${f(lx + 3.5)}" cy="${H - 364}" r="7" fill="${lit(ac, 0.4)}"/>`;
        if (wet) g += `<rect x="${f(lx - 10)}" y="${gy + 12}" width="26" height="130" fill="url(#refl)" opacity=".6" filter="url(#b2)"/>`; }
      if (wet) for (let i = 0; i < 40; i++) g += `<rect x="${f(R() * W)}" y="${f(gy + 14 + R() * 120)}" width="${f(rr(8, 40))}" height="2" fill="${R() < 0.3 ? ac : "#9fb3c8"}" opacity="${f(rr(0.08, 0.25))}"/>`;
    } else if (kind === "village" || kind === "castle") {
      [0.7, 0.45, 0.2].forEach((d, li) => { const yb = H - 330 + li * 70, amp = 60 - li * 12; g += `<path d="M0 ${yb} Q ${f(rr(200, 500))} ${f(yb - amp)} 800 ${f(yb - rr(0, amp))} T 1600 ${f(yb - rr(0, amp))} V ${H} H0Z" fill="${layerCol(d)}"/>`; });
      if (kind === "castle") {
        const cx = 480 + R() * 420, col = layerCol(0.35), yb = H - 250;
        g += `<rect x="${f(cx)}" y="${yb - 300}" width="380" height="320" fill="${col}"/>`;
        for (let i = 0; i < 7; i++) g += `<rect x="${f(cx + i * 56)}" y="${yb - 336}" width="32" height="38" fill="${col}"/>`;
        for (const tx of [cx - 70, cx + 360]) { g += `<rect x="${f(tx)}" y="${yb - 430}" width="92" height="450" fill="${col}"/><polygon points="${f(tx - 12)},${yb - 430} ${f(tx + 46)},${yb - 560} ${f(tx + 104)},${yb - 430}" fill="${col}"/><line x1="${f(tx + 46)}" y1="${yb - 560}" x2="${f(tx + 46)}" y2="${yb - 610}" stroke="${col}" stroke-width="4"/><path d="M${f(tx + 46)} ${yb - 610} l 40 10 l -40 12z" fill="#7a2f2f"/>`; for (let k = 0; k < 3; k++) if (R() < 0.7) g += `<rect x="${f(tx + 38)}" y="${yb - 400 + k * 90}" width="16" height="26" rx="8" fill="${ac}" opacity=".75"/>`; }
        g += `<rect x="${f(cx + 150)}" y="${yb - 140}" width="80" height="160" rx="40" fill="${ac}" opacity=".5"/><rect x="${f(cx + 150)}" y="${yb - 140}" width="80" height="160" rx="40" fill="${ac}" opacity=".3" filter="url(#b)"/>`;
        g += `<line x1="${f(cx)}" y1="${yb - 300}" x2="${f(cx + 380)}" y2="${yb - 300}" stroke="${mixc(col, ac, 0.4)}" stroke-width="2"/>`;
      } else {
        for (let x = -30; x < W;) { const w = rr(110, 190), h = rr(80, 140), base = H - 170 + rr(-12, 12), col = layerCol(0.15), roof = lit(col, -0.15);
          g += `<rect x="${f(x)}" y="${f(base - h)}" width="${f(w)}" height="${f(h + 30)}" fill="${col}"/><polygon points="${f(x - 14)},${f(base - h)} ${f(x + w / 2)},${f(base - h - rr(60, 90))} ${f(x + w + 14)},${f(base - h)}" fill="${roof}"/>`;
          if (R() < 0.6) { const chx = x + w * 0.72; g += `<rect x="${f(chx)}" y="${f(base - h - 70)}" width="16" height="50" fill="${roof}"/>`; for (let k = 0; k < 5; k++) g += `<circle cx="${f(chx + 8 + k * 10 + Math.sin(k) * 8)}" cy="${f(base - h - 84 - k * 26)}" r="${f(10 + k * 5)}" fill="${lit(haze, 0.2)}" opacity="${f(0.16 - k * 0.025)}" filter="url(#b2)"/>`; }
          for (let k = 0; k < 2; k++) if (R() < 0.7) { const wx = x + w * (0.2 + k * 0.45), wy = base - h * 0.62; g += `<rect x="${f(wx)}" y="${f(wy)}" width="26" height="30" fill="${ac}" opacity=".8"/><line x1="${f(wx + 13)}" y1="${f(wy)}" x2="${f(wx + 13)}" y2="${f(wy + 30)}" stroke="${col}" stroke-width="3"/><circle cx="${f(wx + 13)}" cy="${f(wy + 15)}" r="40" fill="url(#glow)" opacity=".35"/>`; }
          x += w + rr(30, 90); }
        for (let x = 0; x < W; x += 34) g += `<rect x="${x}" y="${H - 132}" width="6" height="${f(rr(34, 44))}" fill="${lit(T.near, 0.05)}"/>`;
        g += `<rect y="${H - 118}" width="${W}" height="4" fill="${lit(T.near, 0.05)}"/>`;
      }
      g += `<rect y="${H - 110}" width="${W}" height="110" fill="${T.near}"/><path d="M640 ${H} Q 760 ${H - 60} 800 ${H - 110} L 840 ${H - 110} Q 880 ${H - 60} 1000 ${H}Z" fill="${lit(T.near, 0.07)}"/>`;
    } else if (kind === "forest") {
      const snow = theme === "snow";
      const tree = (x, sc, col, cap) => { const base = H - 120; let t = `<rect x="${f(x - 5 * sc)}" y="${f(base - 60 * sc)}" width="${f(10 * sc)}" height="${f(70 * sc)}" fill="${col}"/>`;
        for (let k = 0; k < 4; k++) { const w = (80 - k * 16) * sc, y0 = base - 40 * sc - k * 62 * sc; t += `<polygon points="${f(x - w)},${f(y0)} ${f(x)},${f(y0 - 110 * sc)} ${f(x + w)},${f(y0)}" fill="${col}"/>`; if (cap) t += `<polygon points="${f(x - w * 0.45)},${f(y0 - 60 * sc)} ${f(x)},${f(y0 - 110 * sc)} ${f(x + w * 0.45)},${f(y0 - 60 * sc)}" fill="#e8eef5" opacity=".75"/>`; }
        return t; };
      [0.8, 0.6, 0.38, 0.16].forEach((d, li) => { const col = layerCol(d); for (let x = -40; x < W + 60; x += rr(40, 90) * (1 + li * 0.25)) g += tree(x, (0.55 + li * 0.3) * rr(0.8, 1.2), col, snow); g += `<rect y="${H - 120 - (3 - li) * 18}" width="${W}" height="200" fill="${col}"/>`; if (li < 3) g += `<rect y="${H - 260 + li * 30}" width="${W}" height="90" fill="${haze}" opacity=".14" filter="url(#b)"/>`; });
      for (let i = 0; i < 5; i++) { const x = rr(100, 1500); g += `<polygon points="${f(x)},0 ${f(x + 60)},0 ${f(x + 260)},${H} ${f(x + 120)},${H}" fill="${ac}" opacity=".05"/>`; }
      g += `<rect y="${H - 120}" width="${W}" height="120" fill="${snow ? "#c9d6e2" : T.near}"/>`;
      if (!snow) for (let i = 0; i < 60; i++) { const x = R() * W; g += `<path d="M${f(x)} ${H - 110} q ${f(rr(-20, 20))} -30 ${f(rr(-30, 30))} -${f(rr(20, 50))}" stroke="${lit(T.near, 0.1)}" stroke-width="3" fill="none"/>`; }
      if (snow) for (let i = 0; i < 160; i++) g += `<circle cx="${f(R() * W)}" cy="${f(R() * H)}" r="${f(rr(1, 3.4))}" fill="#fff" opacity="${f(rr(0.3, 0.8))}"/>`;
      for (const tx of [rr(20, 200), rr(1350, 1560)]) g += tree(tx, 2.6, lit(T.near, -0.4), false);
    } else if (kind === "trench") {
      for (let i = 0; i < 3; i++) { const fx = rr(200, 1400), fy = rr(120, 300); g += `<circle cx="${f(fx)}" cy="${f(fy)}" r="${f(rr(90, 160))}" fill="url(#glow)" opacity=".55"/><circle cx="${f(fx)}" cy="${f(fy)}" r="5" fill="#fff4c8"/><path d="M${f(fx)} ${f(fy)} q ${f(rr(-30, 30))} 120 ${f(rr(-60, 60))} 260" stroke="#e8d8b0" stroke-width="2" fill="none" opacity=".2"/>`; }
      [0.7, 0.45].forEach((d) => { const yb = H - 300 + (0.7 - d) * 180; let path = `M0 ${f(yb)}`; for (let x = 0; x <= W; x += 80) path += ` L ${x} ${f(yb + rr(-30, 20))}`; g += `<path d="${path} V ${H} H0Z" fill="${layerCol(d)}"/>`; });
      for (let i = 0; i < 9; i++) { const x = 60 + i * 190 + rr(-30, 30), y = H - 300 + rr(0, 40), col = layerCol(0.3); g += `<line x1="${f(x)}" y1="${f(y)}" x2="${f(x + rr(-14, 14))}" y2="${f(y - rr(70, 120))}" stroke="${col}" stroke-width="7"/><line x1="${f(x - 40)}" y1="${f(y - 30)}" x2="${f(x + 40)}" y2="${f(y - 80)}" stroke="${col}" stroke-width="5"/>`; if (i < 8) for (let k = 0; k < 3; k++) g += `<path d="M${f(x)} ${f(y - 30 - k * 24)} q 95 ${f(rr(10, 30))} 190 0" stroke="${col}" stroke-width="2" fill="none" stroke-dasharray="6 5"/>`; }
      g += `<path d="M0 ${H - 210} H${W} V${H} H0Z" fill="${layerCol(0.15)}"/>`;
      for (let r = 0; r < 3; r++) for (let x = -20; x < W; x += 92) g += `<rect x="${f(x + (r % 2) * 46)}" y="${H - 236 + r * 22}" width="86" height="24" rx="10" fill="${lit(layerCol(0.15), -0.1 + r * 0.04)}"/>`;
      g += `<rect y="${H - 150}" width="${W}" height="150" fill="${T.near}"/>`; for (let x = 0; x < W; x += 60) g += `<rect x="${x}" y="${H - 96}" width="52" height="10" fill="${lit(T.near, 0.1)}"/>`;
      for (let i = 0; i < 18; i++) g += `<ellipse cx="${f(R() * W)}" cy="${f(H - 60 + R() * 50)}" rx="${f(rr(30, 90))}" ry="6" fill="${ac}" opacity=".08"/>`;
    } else if (kind === "dunes") {
      [0.75, 0.5, 0.25, 0.05].forEach((d, li) => { const yb = H - 340 + li * 80; g += `<path d="M0 ${f(yb)} Q ${f(rr(200, 600))} ${f(yb - rr(40, 120))} ${f(rr(700, 900))} ${f(yb - rr(0, 40))} T 1600 ${f(yb - rr(0, 60))} V ${H} H0Z" fill="${layerCol(d)}"/><path d="M0 ${f(yb)} Q ${f(rr(200, 600))} ${f(yb - rr(40, 120))} ${f(rr(700, 900))} ${f(yb - rr(0, 40))}" stroke="${mixc(layerCol(d), ac, 0.35)}" stroke-width="2" fill="none" opacity=".5"/>`; });
      if (theme === "drive") { g += `<rect x="560" y="240" width="480" height="270" fill="#e9e4ff" opacity=".9"/><rect x="560" y="240" width="480" height="270" fill="#cfc8ff" opacity=".6" filter="url(#b)"/><rect x="545" y="225" width="510" height="300" fill="none" stroke="${T.mid}" stroke-width="16"/><rect x="785" y="525" width="30" height="230" fill="${T.mid}"/><polygon points="800,520 300,${H} 1300,${H}" fill="#e9e4ff" opacity=".05"/>`; for (let i = 0; i < 7; i++) { const cx = 160 + i * 210; g += `<path d="M${cx} ${H - 70} q 20 -46 70 -46 h 40 q 50 0 70 46 z" fill="${T.near}"/><rect x="${cx - 10}" y="${H - 72}" width="200" height="34" rx="8" fill="${T.near}"/>`; } }
      else { const wx = rr(1050, 1350); g += `<line x1="${f(wx)}" y1="${H - 120}" x2="${f(wx + 10)}" y2="${H - 380}" stroke="${T.near}" stroke-width="7"/><line x1="${f(wx + 30)}" y1="${H - 120}" x2="${f(wx + 12)}" y2="${H - 380}" stroke="${T.near}" stroke-width="7"/>`; for (let k = 0; k < 8; k++) { const a0 = k * Math.PI / 4 + 0.3; g += `<line x1="${f(wx + 11)}" y1="${H - 384}" x2="${f(wx + 11 + Math.cos(a0) * 60)}" y2="${f(H - 384 + Math.sin(a0) * 60)}" stroke="${T.near}" stroke-width="5"/>`; } for (let x = 0; x < 900; x += 70) g += `<line x1="${x}" y1="${H - 90}" x2="${x + 4}" y2="${H - 140}" stroke="${T.near}" stroke-width="5"/>`; g += `<line x1="0" y1="${H - 128}" x2="900" y2="${H - 122}" stroke="${T.near}" stroke-width="2"/>`;
        for (let i = 0; i < 8; i++) g += `<ellipse cx="${f(R() * W)}" cy="${f(rr(300, 700))}" rx="${f(rr(200, 500))}" ry="${f(rr(20, 50))}" fill="${lit(haze, 0.15)}" opacity=".18" filter="url(#b)"/>`; }
    } else if (kind === "sea") {
      const hz = H - 340;
      g += `<rect y="${hz}" width="${W}" height="${H - hz}" fill="${layerCol(0.5)}"/>`;
      for (let i = 0; i < 14; i++) { const y = hz + i * 26 + i * i * 0.8; g += `<path d="M0 ${f(y)} q 60 -${f(4 + i)} 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 V ${H} H0Z" fill="${layerCol(0.5 - i * 0.035)}" opacity=".92"/>`; }
      for (let i = 0; i < 70; i++) { const y = rr(hz + 4, H), spread = (y - hz) * 0.35; g += `<rect x="${f(mx + rr(-spread, spread) - 14)}" y="${f(y)}" width="${f(rr(10, 40))}" height="2.5" fill="${lit(ac, 0.3)}" opacity="${f(rr(0.2, 0.6))}"/>`; }
      const sx = R() < 0.5 ? rr(150, 500) : rr(1000, 1350), col = layerCol(0.55);
      g += `<path d="M${f(sx)} ${hz - 2} h 220 l -26 26 h -168z" fill="${col}"/><rect x="${f(sx + 96)}" y="${hz - 180}" width="7" height="180" fill="${col}"/><path d="M${f(sx + 103)} ${hz - 176} l 90 130 h -90z M${f(sx + 96)} ${hz - 160} l -70 116 h 70z" fill="${col}"/><circle cx="${f(sx + 100)}" cy="${hz - 186}" r="4" fill="${ac}"/>`;
      if (R() < 0.6) { const lx = sx > 800 ? 160 : 1380; g += `<rect x="${lx}" y="${hz - 210}" width="30" height="210" fill="${layerCol(0.4)}"/><rect x="${lx - 4}" y="${hz - 232}" width="38" height="24" fill="${ac}" opacity=".9"/><polygon points="${lx + 15},${hz - 220} ${lx + (lx > 800 ? -700 : 700)},${hz - 300} ${lx + (lx > 800 ? -700 : 700)},${hz - 150}" fill="${ac}" opacity=".07"/>`; }
    }

    /* ---------------- indoor kinds */
    else if (kind === "church") {
      g += `<rect width="${W}" height="${H}" fill="${lit(T.far, -0.2)}"/>`;
      const vx = 800, vy = 380;
      for (let i = 0; i < 5; i++) { const t = i / 5, x1 = 40 + t * 600, x2 = W - 40 - t * 600, top = 40 + t * 260, w = 90 - t * 60; for (const x of [x1, x2 - w]) { g += `<rect x="${f(x)}" y="${f(top)}" width="${f(w)}" height="${f(H - top)}" fill="${mixc(T.mid, T.near, 1 - t)}"/>`; g += `<rect x="${f(x)}" y="${f(top)}" width="${f(w * 0.25)}" height="${f(H - top)}" fill="#fff" opacity=".04"/>`; }
        g += `<path d="M${f(x1 + w)} ${f(top + 40)} Q ${vx} ${f(top - 140 + t * 60)} ${f(x2 - w)} ${f(top + 40)}" stroke="${mixc(T.mid, T.near, 1 - t)}" stroke-width="${f(26 - t * 16)}" fill="none"/>`; }
      const gw = 150, gh = 300, gx = vx - gw / 2, gy = vy - 260; const pane = ["#b8322a", "#2f5aa8", "#c9a24a", "#3f7a4a", "#7a3f8a"];
      g += `<path d="M${gx} ${gy + gh} V ${gy + 70} Q ${vx} ${gy - 30} ${gx + gw} ${gy + 70} V ${gy + gh} Z" fill="#141018"/>`;
      for (let r = 0; r < 6; r++) for (let c = 0; c < 4; c++) g += `<rect x="${gx + 8 + c * 34.5}" y="${gy + 60 + r * 40}" width="30" height="36" fill="${pane[(r * 4 + c + Math.floor(R() * 3)) % 5]}" opacity="${f(rr(0.55, 0.9))}"/>`;
      g += `<circle cx="${vx}" cy="${gy + 40}" r="26" fill="${pane[2]}" opacity=".8"/>`;
      g += `<polygon points="${gx},${gy + 60} ${gx + gw},${gy + 60} ${vx + 420},${H} ${vx - 420},${H}" fill="#e8c070" opacity=".07"/><rect x="${gx - 40}" y="${gy}" width="${gw + 80}" height="${gh}" fill="${ac}" opacity=".12" filter="url(#b)"/>`;
      g += `<rect x="${vx - 130}" y="${vy + 60}" width="260" height="60" fill="${lit(T.near, 0.1)}"/><rect x="${vx - 150}" y="${vy + 50}" width="300" height="14" fill="${lit(T.near, 0.18)}"/>`;
      for (const cx of [vx - 110, vx + 110]) g += `<rect x="${cx - 4}" y="${vy + 14}" width="8" height="36" fill="#e8dcc0"/><ellipse cx="${cx}" cy="${vy + 8}" rx="5" ry="10" fill="${ac}"/><circle cx="${cx}" cy="${vy + 8}" r="60" fill="url(#glow)" opacity=".5"/>`;
      g += `<polygon points="0,${H} ${W},${H} ${vx + 220},${vy + 120} ${vx - 220},${vy + 120}" fill="${T.near}"/>`;
      for (let i = 0; i < 6; i++) { const t = 1 - i / 6, y = vy + 140 + i * i * 9 + i * 20, wd = 160 + i * 90, gap = 70 + i * 40; for (const sd of [-1, 1]) { const x0 = sd < 0 ? vx - gap - wd : vx + gap; g += `<rect x="${f(x0)}" y="${f(y)}" width="${f(wd)}" height="${f(14 + i * 6)}" fill="${lit(T.near, 0.12 - t * 0.06)}"/><rect x="${f(x0)}" y="${f(y - 10 - i * 4)}" width="${f(wd)}" height="${f(6 + i * 2)}" fill="${lit(T.near, 0.16 - t * 0.06)}"/>`; } }
    } else if (kind === "cave") {
      g += `<rect width="${W}" height="${H}" fill="${T.far}"/>`;
      [0.7, 0.4, 0.1].forEach((d, li) => { const col = layerCol(d); let top = `M0 0 H${W} V${f(160 + li * 50)}`; for (let x = W; x >= 0; x -= 60) top += ` L ${x} ${f(150 + li * 60 + rr(-40, 60))}`; g += `<path d="${top} Z" fill="${col}"/>`; let bot = `M0 ${H} H${W} V${f(H - 120 - (2 - li) * 40)}`; for (let x = W; x >= 0; x -= 70) bot += ` L ${x} ${f(H - 110 - (2 - li) * 40 + rr(-30, 30))}`; g += `<path d="${bot} Z" fill="${col}"/>`;
        for (let i = 0; i < 9; i++) { const x = R() * W, h = rr(60, 220) * (1 - d * 0.5); g += `<polygon points="${f(x)},${f(100 + li * 50)} ${f(x + 30)},${f(100 + li * 50)} ${f(x + 15)},${f(160 + li * 50 + h)}" fill="${col}"/><polygon points="${f(x + 200)},${H} ${f(x + 240)},${H} ${f(x + 220)},${f(H - 140 - h * 0.6)}" fill="${col}"/>`; } });
      g += `<ellipse cx="800" cy="${H - 120}" rx="460" ry="50" fill="${ac}" opacity=".22"/><ellipse cx="800" cy="${H - 120}" rx="300" ry="30" fill="${ac}" opacity=".25" filter="url(#b)"/>`;
      for (let i = 0; i < 6; i++) { const x = rr(300, 1300), y = H - rr(130, 220); g += `<polygon points="${f(x)},${f(y)} ${f(x + 10)},${f(y - 40)} ${f(x + 20)},${f(y)}" fill="${lit(ac, 0.3)}" opacity=".7"/><circle cx="${f(x + 10)}" cy="${f(y - 20)}" r="30" fill="url(#glow)" opacity=".4"/>`; }
    } else {
      /* one-point perspective room: back wall, side walls, floor, ceiling */
      const bx0 = 330, bx1 = 1270, by0 = 150, by1 = 610;
      const wall = kind === "cellar" ? "#2a2c2f" : kind === "lab" ? "#1d3a40" : kind === "train" ? "#3a2a22" : T.far;
      const floorC = kind === "lab" ? "#1a2a2e" : kind === "cellar" ? "#1b1c1e" : kind === "train" ? "#2a1e1a" : T.mid;
      g += `<polygon points="0,0 ${W},0 ${bx1},${by0} ${bx0},${by0}" fill="${lit(wall, -0.45)}"/>`;
      g += `<polygon points="0,0 ${bx0},${by0} ${bx0},${by1} 0,${H}" fill="${lit(wall, -0.22)}"/><polygon points="${W},0 ${bx1},${by0} ${bx1},${by1} ${W},${H}" fill="${lit(wall, -0.3)}"/>`;
      g += `<rect x="${bx0}" y="${by0}" width="${bx1 - bx0}" height="${by1 - by0}" fill="${wall}"/>`;
      g += `<polygon points="0,${H} ${bx0},${by1} ${bx1},${by1} ${W},${H}" fill="${floorC}"/>`;
      for (let i = -8; i <= 8; i++) g += `<line x1="${f(800 + i * 58.75)}" y1="${by1}" x2="${f(800 + i * 200)}" y2="${H}" stroke="${lit(floorC, -0.3)}" stroke-width="2" opacity=".6"/>`;
      if (kind === "cellar") { for (let y = by0; y < by1; y += 34) for (let x = bx0 + ((y / 34) % 2) * 40; x < bx1; x += 80) g += `<rect x="${f(x)}" y="${f(y)}" width="76" height="30" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="2"/>`;
        g += `<line x1="0" y1="40" x2="${bx0}" y2="${by0 + 20}" stroke="#4a4f55" stroke-width="16"/><line x1="${bx0}" y1="${by0 + 20}" x2="${bx1}" y2="${by0 + 20}" stroke="#4a4f55" stroke-width="10"/><line x1="0" y1="80" x2="${bx0}" y2="${by0 + 44}" stroke="#3b3f44" stroke-width="10"/>`;
        for (let i = 0; i < 3; i++) { const x = bx0 + 80 + i * 110; g += `<rect x="${x}" y="${by1 - 90 - (i === 1 ? 70 : 0)}" width="100" height="${i === 1 ? 160 : 90}" fill="#4a3a28"/><path d="M${x} ${by1 - 90 - (i === 1 ? 70 : 0)} l100 ${i === 1 ? 160 : 90} M${x + 100} ${by1 - 90 - (i === 1 ? 70 : 0)} l-100 ${i === 1 ? 160 : 90}" stroke="#2e2418" stroke-width="5"/>`; }
        g += `<ellipse cx="1000" cy="${H - 120}" rx="160" ry="22" fill="${ac}" opacity=".12"/>`;
        g += `<line x1="800" y1="0" x2="800" y2="230" stroke="#111" stroke-width="2"/><circle cx="800" cy="240" r="10" fill="${lit(ac, 0.5)}"/><circle cx="800" cy="240" r="200" fill="url(#glow)" opacity=".4"/><polygon points="790,240 810,240 1100,${H} 500,${H}" fill="url(#ray)" opacity=".7"/>`;
      } else if (kind === "lab") {
        for (let i = 0; i < 3; i++) { const x = bx0 + 60 + i * 300; g += `<rect x="${x}" y="${by0 + 50}" width="200" height="130" rx="6" fill="#0a1416" stroke="#2f5a60" stroke-width="4"/><rect x="${x + 12}" y="${by0 + 62}" width="176" height="106" fill="${ac}" opacity=".18"/>`; for (let k = 0; k < 5; k++) g += `<rect x="${x + 22}" y="${by0 + 74 + k * 18}" width="${f(rr(40, 150))}" height="5" fill="${ac}" opacity=".55"/>`; }
        g += `<rect x="${bx0 + 20}" y="${by1 - 150}" width="${bx1 - bx0 - 40}" height="20" fill="#9fb4b8"/><rect x="${bx0 + 20}" y="${by1 - 130}" width="${bx1 - bx0 - 40}" height="130" fill="#2a3a3e"/>`;
        for (let i = 0; i < 9; i++) { const x = bx0 + 60 + i * 95, h = rr(30, 70); g += `<path d="M${f(x)} ${by1 - 150} l 10 -${f(h)} h 14 l 10 ${f(h)} z" fill="${i % 3 ? "#7ef0d9" : "#f07ec8"}" opacity=".45"/><rect x="${f(x + 10)}" y="${f(by1 - 150 - h - 14)}" width="14" height="16" fill="#9fb4b8" opacity=".7"/>`; }
        for (const lx of [500, 1100]) g += `<rect x="${lx - 120}" y="30" width="240" height="14" fill="#e8fbff"/><polygon points="${lx - 120},44 ${lx + 120},44 ${lx + 300},${H} ${lx - 300},${H}" fill="#e8fbff" opacity=".04"/>`;
      } else if (kind === "train") {
        for (let i = 0; i < 4; i++) { const x = bx0 + 40 + i * 230; g += `<rect x="${x}" y="${by0 + 60}" width="170" height="150" rx="14" fill="#0b1020"/><rect x="${x}" y="${by0 + 60}" width="170" height="150" rx="14" fill="none" stroke="#6b4a2c" stroke-width="10"/>`; for (let k = 0; k < 3; k++) g += `<rect x="${f(x + rr(10, 140))}" y="${f(by0 + rr(150, 190))}" width="${f(rr(4, 18))}" height="3" fill="${ac}" opacity=".7"/>`; g += `<line x1="${x}" y1="${by0 + 190}" x2="${x + 170}" y2="${by0 + 170}" stroke="#1b2438" stroke-width="10"/>`; }
        g += `<rect x="${bx0}" y="${by0 + 20}" width="${bx1 - bx0}" height="12" fill="#6b4a2c"/><rect x="${bx0}" y="${by0}" width="${bx1 - bx0}" height="12" fill="#8a6a3c" opacity=".7"/>`;
        for (const sd of [-1, 1]) for (let i = 0; i < 4; i++) { const t = i / 4, x = sd < 0 ? bx0 - 60 - i * 110 : bx1 + 60 + i * 110 - (150 + i * 50), y = by1 - 40 + i * 60; g += `<rect x="${f(x)}" y="${f(y - 120 - i * 30)}" width="${f(150 + i * 50)}" height="${f(120 + i * 30)}" rx="12" fill="${lit("#5c3a3a", -0.3 + t * 0.2)}"/><rect x="${f(x)}" y="${f(y - 20)}" width="${f(150 + i * 50)}" height="${f(40 + i * 10)}" rx="8" fill="${lit("#5c3a3a", -0.15 + t * 0.2)}"/>`; }
        for (const lx of [560, 1040]) g += `<circle cx="${lx}" cy="70" r="12" fill="${lit(ac, 0.4)}"/><circle cx="${lx}" cy="70" r="160" fill="url(#glow)" opacity=".35"/>`;
      } else {
        /* a lived-in room */
        g += `<rect x="${bx0}" y="${by1 - 150}" width="${bx1 - bx0}" height="150" fill="${lit(wall, -0.15)}"/><rect x="${bx0}" y="${by1 - 156}" width="${bx1 - bx0}" height="8" fill="${lit(wall, 0.12)}"/>`;
        for (let x = bx0 + 30; x < bx1; x += 90) g += `<rect x="${x}" y="${by1 - 130}" width="70" height="110" fill="none" stroke="${lit(wall, -0.3)}" stroke-width="3"/>`;
        for (let y = by0 + 20; y < by1 - 170; y += 50) for (let x = bx0 + 25; x < bx1; x += 50) g += `<circle cx="${x}" cy="${y}" r="3" fill="${lit(wall, 0.1)}" opacity=".5"/>`;
        const wx = bx0 + 90; g += `<rect x="${wx}" y="${by0 + 50}" width="230" height="250" fill="${lit(T.sky[0], -0.2)}"/>`; for (let i = 0; i < 18; i++) g += `<circle cx="${f(wx + R() * 230)}" cy="${f(by0 + 50 + R() * 250)}" r="1.4" fill="#fff" opacity=".6"/>`;
        g += `<circle cx="${wx + 160}" cy="${by0 + 110}" r="20" fill="#f2ebd0" opacity=".85"/><rect x="${wx}" y="${by0 + 50}" width="230" height="250" fill="none" stroke="${lit(wall, -0.5)}" stroke-width="12"/><line x1="${wx + 115}" y1="${by0 + 50}" x2="${wx + 115}" y2="${by0 + 300}" stroke="${lit(wall, -0.5)}" stroke-width="7"/><line x1="${wx}" y1="${by0 + 175}" x2="${wx + 230}" y2="${by0 + 175}" stroke="${lit(wall, -0.5)}" stroke-width="7"/>`;
        g += `<path d="M${wx - 40} ${by0 + 30} q 30 140 10 300 h 50 q -20 -150 0 -300z M${wx + 270} ${by0 + 30} q -30 140 -10 300 h -50 q 20 -150 0 -300z" fill="#5c2a2a"/>`;
        g += `<polygon points="${wx + 20},${by0 + 300} ${wx + 210},${by0 + 300} ${wx + 330},${H} ${wx - 210},${H}" fill="#cfe3ff" opacity=".05"/>`;
        const shx = bx1 - 300; g += `<rect x="${shx}" y="${by0 + 40}" width="230" height="${by1 - by0 - 40}" fill="${lit(wall, -0.55)}"/>`; for (let r = 0; r < 5; r++) { let x = shx + 10; while (x < shx + 210) { const w = rr(10, 22), h = rr(50, 76); g += `<rect x="${f(x)}" y="${f(by0 + 40 + r * 88 + 84 - h)}" width="${f(w)}" height="${f(h)}" fill="${["#6b2a24", "#2f4a5c", "#4f5b33", "#7a6234", "#3b2f45", "#8a8170"][Math.floor(R() * 6)]}"/>`; x += w + 2; } g += `<rect x="${shx}" y="${by0 + 40 + r * 88 + 84}" width="230" height="6" fill="${lit(wall, -0.3)}"/>`; }
        const fx = bx0 + 420; g += `<rect x="${fx}" y="${by0 + 70}" width="120" height="90" fill="${lit(wall, -0.5)}"/><rect x="${fx + 10}" y="${by0 + 80}" width="100" height="70" fill="${mixc(T.sky[1], ac, 0.3)}" opacity=".7"/><path d="M${fx + 10} ${by0 + 150} l 30 -30 l 25 20 l 20 -15 l 25 25z" fill="${lit(wall, -0.3)}" opacity=".7"/>`;
        g += `<ellipse cx="800" cy="${H - 120}" rx="380" ry="70" fill="#5c2a2a" opacity=".7"/><ellipse cx="800" cy="${H - 120}" rx="320" ry="52" fill="none" stroke="#c9a24a" stroke-width="3" opacity=".4"/>`;
        g += `<path d="M560 ${H - 160} q 0 -110 90 -110 h 70 q 90 0 90 110 v 60 h -250z" fill="${lit(T.near, 0.05)}"/><rect x="540" y="${H - 170}" width="40" height="90" rx="14" fill="${lit(T.near, 0.08)}"/><rect x="790" y="${H - 170}" width="40" height="90" rx="14" fill="${lit(T.near, 0.08)}"/>`;
        g += `<rect x="960" y="${H - 260}" width="160" height="14" fill="${lit(T.near, 0.1)}"/><rect x="976" y="${H - 246}" width="10" height="120" fill="${lit(T.near, 0.1)}"/><rect x="1094" y="${H - 246}" width="10" height="120" fill="${lit(T.near, 0.1)}"/>`;
        g += `<rect x="1030" y="${H - 330}" width="8" height="70" fill="#2a2a2a"/><path d="M1000 ${H - 330} L1068 ${H - 330} L1054 ${H - 380} L1014 ${H - 380}Z" fill="#c9a24a"/><circle cx="1034" cy="${H - 330}" r="240" fill="url(#glow)" opacity=".5"/><polygon points="1000,${H - 330} 1068,${H - 330} 1200,${H - 240} 880,${H - 240}" fill="${ac}" opacity=".12"/>`;
      }
      g += `<rect x="${bx0}" y="${by1 - 4}" width="${bx1 - bx0}" height="8" fill="#000" opacity=".3"/>`;
    }

    /* ---------------- atmosphere, grade, grain, vignette */
    if (["fog", "street", "cave", "forest", "village", "trench", "cellar", "sea"].includes(theme)) for (let i = 0; i < 7; i++) g += `<ellipse cx="${f(R() * W)}" cy="${f(H - 100 - R() * 330)}" rx="${f(260 + R() * 300)}" ry="${f(24 + R() * 40)}" fill="${lit(haze, 0.35)}" opacity="${theme === "fog" ? ".16" : ".07"}" filter="url(#b)"/>`;
    if (theme === "fog") g += `<rect width="${W}" height="${H}" fill="${lit(haze, 0.2)}" opacity=".12"/>`;
    g += `<rect width="${W}" height="${H}" fill="${ac}" opacity=".035"/>`;
    g += `<rect width="${W}" height="${H}" filter="url(#grain)"/>`;
    g += `<rect width="${W}" height="${H}" fill="url(#v)"/>`;
    return svgUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${g}</svg>`);
  }

  ART.scene = (theme, seed = "") => {
    const key = `gen:${theme}:${seed}`;
    if (!window.ASSETS.scenes[key]) window.ASSETS.scenes[key] = scene(theme, seed);
    return key;
  };

  /* ------------------------------------------------------------ portraits
     A look is plain data: { skin, hairC, hair, outfit, clothes, extra, bg, face, eyes, eyeC, brows,
     nose, mouth, facial, marks }. Every field is optional; missing face details are picked from a
     hash of the rest, so older looks and adventure NPCs still get a varied, stable face. */
  ART.SKIN = ["#f6dcc6", "#f1d2b5", "#e3b48c", "#d29e74", "#c68d62", "#9c6542", "#74452b", "#4e2e1e"];
  ART.HAIRC = ["#17120f", "#3a2619", "#7a4a26", "#b8863f", "#e3c78a", "#c9c9c9", "#7b2f2a", "#a8432a", "#2b3a67", "#6a3a6e"];
  ART.OUTFIT = ["#3a4a5c", "#5c3a3a", "#3f5c42", "#6b5a38", "#4a3a5c", "#2b2b2b", "#7a7a7a", "#8a2f2f", "#c9bfa8", "#1f3346", "#6e4a2f", "#2f4f4f"];
  ART.EYEC = ["#2a1c14", "#5a3a22", "#3d6a8f", "#4f7a4a", "#6f6f6f", "#8a6a2a"];
  ART.BGS = ["#2b2f3a", "#3a2b2b", "#2b3a30", "#3a3526", "#30283a", "#1e2430", "#4a3a2a", "#253a40"];
  ART.HAIRS = ["short", "long", "bun", "bald", "curly", "mohawk", "bob", "ponytail", "slicked", "parted", "braids", "buzz", "afro", "wavy", "topknot"];
  ART.EXTRAS = ["none", "glasses", "round glasses", "monocle", "eyepatch", "hat", "cap", "hood", "headscarf", "earrings", "headband"];
  ART.FACES = ["oval", "round", "square", "long", "heart"];
  ART.EYES = ["plain", "narrow", "wide", "tired", "sharp"];
  ART.BROWS = ["straight", "arched", "thick", "thin", "furrowed"];
  ART.NOSES = ["small", "straight", "broad", "hooked"];
  ART.MOUTHS = ["neutral", "smile", "smirk", "frown", "grim"];
  ART.FACIAL = ["none", "stubble", "moustache", "goatee", "beard", "mutton chops"];
  ART.MARKS = ["none", "freckles", "scar", "wrinkles", "bandage", "beauty mark"];
  ART.CLOTHES = ["coat", "suit", "turtleneck", "vest", "uniform", "hoodie", "robe", "armor"];
  const hx = (c) => { const n = parseInt(String(c).slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  const shade = (c, k) => { const [r, g, b] = hx(c), t = k < 0 ? 0 : 255, a = Math.abs(k); return "#" + [r, g, b].map((v) => Math.round(v + (t - v) * a).toString(16).padStart(2, "0")).join(""); };
  const hashPick = (seed, list, salt) => { let h = 2166136261; for (const ch of seed + salt) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0; return list[h % list.length]; };
  ART.fullLook = (o = {}) => {
    const seed = [o.skin, o.hairC, o.hair, o.outfit, o.extra].join("|");
    const L = { skin: o.skin || ART.SKIN[4], hairC: o.hairC || ART.HAIRC[1], hair: o.hair || "short", outfit: o.outfit || ART.OUTFIT[0], bg: o.bg || "#2b2f3a",
      clothes: o.clothes || "coat", extra: o.extra || "none", facial: o.facial, marks: o.marks,
      face: o.face || hashPick(seed, ART.FACES, "f"), eyes: o.eyes || hashPick(seed, ART.EYES, "e"), eyeC: o.eyeC || hashPick(seed, ART.EYEC.slice(0, 3), "c"),
      brows: o.brows || hashPick(seed, ART.BROWS, "b"), nose: o.nose || hashPick(seed, ART.NOSES, "n"), mouth: o.mouth || hashPick(seed, ["neutral", "neutral", "smile", "smirk", "grim"], "m") };
    // older looks kept beards and scars under "extra"
    if (L.extra === "beard") { L.facial = L.facial || "beard"; L.extra = "none"; }
    if (L.extra === "scar") { L.marks = L.marks || "scar"; L.extra = "none"; }
    L.facial = L.facial || "none"; L.marks = L.marks || "none";
    return L;
  };
  const FACE = { oval: [50, 30, 170], round: [56, 40, 166], square: [53, 45, 168], long: [46, 30, 180], heart: [55, 22, 172] };
  const headPath = (cw, jw, cy) => `M128 44 C ${128 + cw * 0.92} 44 ${128 + cw} 72 ${128 + cw} 108 C ${128 + cw} 132 ${128 + jw + 10} 148 ${128 + jw} ${cy - 12} Q ${128 + jw * 0.45} ${cy} 128 ${cy} Q ${128 - jw * 0.45} ${cy} ${128 - jw} ${cy - 12} C ${128 - jw - 10} 148 ${128 - cw} 132 ${128 - cw} 108 C ${128 - cw} 72 ${128 - cw * 0.92} 44 128 44Z`;

  ART.portraitSvg = (o) => {
    const L = ART.fullLook(o);
    const skin = L.skin, sk2 = shade(skin, -0.22), sk3 = shade(skin, -0.4), hair = L.hairC, h2 = shade(hair, -0.35), h3 = shade(hair, 0.25);
    const out = L.outfit, o2 = shade(out, -0.35), o3 = shade(out, 0.18), [cw, jw, cy] = FACE[L.face] || FACE.oval;
    const head = headPath(cw, jw, cy);
    let g = `<defs>
<radialGradient id="bgg" cx="50%" cy="38%" r="75%"><stop offset="0" stop-color="${shade(L.bg, 0.18)}"/><stop offset="1" stop-color="${shade(L.bg, -0.55)}"/></radialGradient>
<radialGradient id="skl" cx="38%" cy="32%" r="70%"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="${sk3}" stop-opacity=".55"/></radialGradient>
<linearGradient id="hrg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${h3}"/><stop offset="1" stop-color="${h2}"/></linearGradient>
<linearGradient id="clg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${o3}"/><stop offset="1" stop-color="${o2}"/></linearGradient>
<linearGradient id="mtl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c9ced4"/><stop offset=".5" stop-color="#6d747c"/><stop offset="1" stop-color="#2f3439"/></linearGradient>
<linearGradient id="nck" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sk3}"/><stop offset=".5" stop-color="${sk2}"/><stop offset="1" stop-color="${skin}"/></linearGradient>
<clipPath id="hc"><path d="${head}"/></clipPath>
<radialGradient id="vig" cx="50%" cy="45%" r="70%"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>
</defs>`;
    g += `<rect width="256" height="256" fill="url(#bgg)"/>`;
    for (let i = -256; i < 256; i += 18) g += `<line x1="${i}" y1="256" x2="${i + 256}" y2="0" stroke="#fff" stroke-opacity=".025" stroke-width="6"/>`;
    g += `<circle cx="128" cy="100" r="96" fill="${shade(L.bg, 0.3)}" opacity=".12"/>`;

    /* ---- hair behind the head */
    const back = {
      long: `<path d="M74 96 Q 60 170 70 226 L 112 214 L 110 140Z M182 96 Q 196 170 186 226 L 144 214 L 146 140Z" fill="url(#hrg)"/>`,
      bun: `<circle cx="128" cy="40" r="24" fill="url(#hrg)"/><path d="M114 30 Q 128 22 142 30" stroke="${h3}" stroke-width="3" fill="none" opacity=".6"/>`,
      topknot: `<ellipse cx="128" cy="34" rx="14" ry="18" fill="url(#hrg)"/><rect x="118" y="46" width="20" height="6" rx="2" fill="${h2}"/>`,
      bob: `<path d="M70 96 Q 64 150 80 168 L 176 168 Q 192 150 186 96Z" fill="url(#hrg)"/>`,
      ponytail: `<path d="M176 76 Q 214 96 204 170 Q 198 196 186 206 Q 196 160 172 110Z" fill="url(#hrg)"/>`,
      braids: `<path d="M80 110 Q 70 170 84 230" stroke="${hair}" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M176 110 Q 186 170 172 230" stroke="${hair}" stroke-width="16" fill="none" stroke-linecap="round"/>` + [0, 1, 2, 3, 4].map((i) => `<path d="M${76 + (i % 2) * 2} ${140 + i * 18} l 14 6 M${168 - (i % 2) * 2} ${140 + i * 18} l 14 -6" stroke="${h2}" stroke-width="2" opacity=".7"/>`).join(""),
      afro: `<circle cx="128" cy="92" r="78" fill="url(#hrg)"/>` + Array.from({ length: 18 }, (_, i) => { const a = (i / 18) * Math.PI * 2; return `<circle cx="${(128 + Math.cos(a) * 70).toFixed(1)}" cy="${(92 + Math.sin(a) * 70).toFixed(1)}" r="14" fill="${hair}"/>`; }).join(""),
      wavy: `<path d="M72 96 Q 60 140 74 176 Q 66 196 80 210 L 112 196 L 110 140Z M184 96 Q 196 140 182 176 Q 190 196 176 210 L 144 196 L 146 140Z" fill="url(#hrg)"/>`
    };
    if (L.extra === "hood") g += `<path d="M60 256 L 60 120 Q 60 26 128 24 Q 196 26 196 120 L 196 256Z" fill="${o2}"/>`;
    if (back[L.hair] && L.extra !== "hood") g += back[L.hair];

    /* ---- body and clothes */
    const shoulders = `M10 256 Q 14 194 82 180 L 174 180 Q 242 194 246 256Z`;
    g += `<rect x="111" y="140" width="34" height="50" fill="url(#nck)"/>`;
    const CL = {
      coat: `<path d="${shoulders}" fill="url(#clg)"/><path d="M96 180 L128 236 L160 180 L150 178 L128 212 L106 178Z" fill="${shade(out, -0.5)}"/><path d="M82 180 L104 178 L128 232 L120 256 L96 256Z" fill="${o3}" opacity=".35"/><path d="M174 180 L152 178 L128 232 L136 256 L160 256Z" fill="${o2}" opacity=".4"/><path d="M110 180 L128 216 L146 180" fill="${skin}"/>`,
      suit: `<path d="${shoulders}" fill="url(#clg)"/><path d="M104 180 L128 246 L152 180Z" fill="#e8e4da"/><path d="M122 192 L134 192 L138 244 L128 256 L118 244Z" fill="#7a2f2f"/><path d="M122 188 L134 188 L131 196 L125 196Z" fill="#5a1f1f"/><path d="M96 180 L120 250 L106 256 L88 196Z M160 180 L136 250 L150 256 L168 196Z" fill="${o2}"/>`,
      turtleneck: `<path d="${shoulders}" fill="url(#clg)"/><path d="M106 150 Q 128 160 150 150 L 152 186 Q 128 196 104 186Z" fill="${o3}"/>` + [0, 1, 2].map((i) => `<path d="M106 ${160 + i * 9} Q 128 ${170 + i * 9} 150 ${160 + i * 9}" stroke="${o2}" stroke-width="2" fill="none"/>`).join(""),
      vest: `<path d="${shoulders}" fill="#e8e4da"/><path d="M72 186 Q 70 220 74 256 L 120 256 L 128 220 L 136 256 L 182 256 Q 186 220 184 186 L 152 180 L 128 222 L 104 180Z" fill="url(#clg)"/>` + [0, 1, 2].map((i) => `<circle cx="${120 + i * 0}" cy="${232 + i * 9}" r="2.5" fill="${o2}"/>`).join("") + `<path d="M112 180 L128 214 L144 180" fill="${skin}"/>`,
      uniform: `<path d="${shoulders}" fill="url(#clg)"/><path d="M108 180 L128 200 L148 180 L148 190 L128 208 L108 190Z" fill="${o2}"/><rect x="40" y="194" width="44" height="10" rx="3" fill="#c9a24a" transform="rotate(12 62 199)"/><rect x="172" y="194" width="44" height="10" rx="3" fill="#c9a24a" transform="rotate(-12 194 199)"/>` + [0, 1, 2, 3].map((i) => `<circle cx="128" cy="${214 + i * 12}" r="3.5" fill="#c9a24a"/>`).join("") + `<rect x="112" y="174" width="32" height="10" fill="${o2}"/>`,
      hoodie: `<path d="M70 196 Q 60 150 128 150 Q 196 150 186 196Z" fill="${o2}"/><path d="${shoulders}" fill="url(#clg)"/><path d="M110 180 Q 128 196 146 180" stroke="${o2}" stroke-width="5" fill="none"/><path d="M116 190 L114 230 M140 190 L142 230" stroke="#ddd" stroke-width="3" stroke-linecap="round"/><rect x="96" y="232" width="64" height="24" rx="6" fill="${o2}" opacity=".5"/>`,
      robe: `<path d="${shoulders}" fill="url(#clg)"/><path d="M92 180 Q 128 260 164 180" stroke="${o2}" stroke-width="10" fill="none"/><path d="M60 196 Q 128 230 196 196" stroke="${o2}" stroke-width="4" fill="none" opacity=".6"/><path d="M120 236 Q 128 244 136 236 L 132 256 L 124 256Z" fill="#b8a27a"/>`,
      armor: `<path d="${shoulders}" fill="url(#mtl)"/>` + Array.from({ length: 40 }, (_, i) => `<circle cx="${30 + (i % 10) * 22 + (Math.floor(i / 10) % 2) * 11}" cy="${206 + Math.floor(i / 10) * 13}" r="4" fill="none" stroke="#2f3439" stroke-width="1.5" opacity=".7"/>`).join("") + `<path d="M22 230 Q 30 186 86 182 L 92 214 Q 54 214 22 230Z M234 230 Q 226 186 170 182 L 164 214 Q 202 214 234 230Z" fill="url(#mtl)" stroke="#23272b" stroke-width="2"/><path d="M104 180 L152 180 L146 196 L110 196Z" fill="#555c63"/>`
    };
    g += CL[L.clothes] || CL.coat;

    /* ---- head */
    g += `<ellipse cx="${128 - cw - 2}" cy="114" rx="9" ry="15" fill="${sk2}"/><ellipse cx="${128 + cw + 2}" cy="114" rx="9" ry="15" fill="${sk2}"/>`;
    if (L.extra === "earrings") g += `<circle cx="${128 - cw - 3}" cy="132" r="4" fill="#d9b44a"/><circle cx="${128 + cw + 3}" cy="132" r="4" fill="#d9b44a"/>`;
    g += `<path d="${head}" fill="${skin}"/>`;
    g += `<g clip-path="url(#hc)"><path d="${head}" fill="url(#skl)"/><ellipse cx="128" cy="${cy + 6}" rx="${jw + 20}" ry="22" fill="${sk3}" opacity=".35"/><ellipse cx="${128 - cw + 8}" cy="128" rx="10" ry="14" fill="#d9776a" opacity=".12"/><ellipse cx="${128 + cw - 8}" cy="128" rx="10" ry="14" fill="#d9776a" opacity=".12"/></g>`;

    /* ---- marks */
    if (L.marks === "freckles") { const pts = [[-26, 124], [-19, 128], [-31, 130], [-23, 134], [-14, 124], [-28, 138], [-17, 133]]; for (const [dx, y] of pts) for (const sd of [1, -1]) g += `<circle cx="${128 + dx * sd}" cy="${y}" r="1.5" fill="${sk3}" opacity=".65"/>`; g += `<circle cx="124" cy="122" r="1.2" fill="${sk3}" opacity=".5"/><circle cx="132" cy="121" r="1.2" fill="${sk3}" opacity=".5"/>`; }
    if (L.marks === "wrinkles") g += `<path d="M106 78 Q 128 74 150 78 M110 86 Q 128 83 146 86" stroke="${sk3}" stroke-width="1.6" fill="none" opacity=".55"/><path d="M106 132 Q 102 144 108 152 M150 132 Q 154 144 148 152" stroke="${sk3}" stroke-width="1.8" fill="none" opacity=".5"/>`;
    if (L.marks === "beauty mark") g += `<circle cx="152" cy="138" r="2.4" fill="#2a1a14"/>`;

    /* ---- eyes, brows, nose, mouth */
    const E = { plain: [6.5, 5], narrow: [7, 3], wide: [7, 6.5], tired: [6.5, 4.2], sharp: [7.5, 4] }[L.eyes] || [6.5, 5];
    for (const side of [-1, 1]) {
      const x = 128 + side * 21, y = 110;
      g += `<ellipse cx="${x}" cy="${y}" rx="${E[0] + 2}" ry="${E[1] + 1}" fill="#f4efe6"/><circle cx="${x}" cy="${y + 0.5}" r="${Math.min(E[1] + 0.5, 5)}" fill="${L.eyeC}"/><circle cx="${x}" cy="${y + 0.5}" r="2.2" fill="#0c0a09"/><circle cx="${x - 1.6}" cy="${y - 1.4}" r="1.2" fill="#fff" opacity=".85"/>`;
      const lid = L.eyes === "sharp" ? `M${x - side * 10} ${y + 1} Q ${x} ${y - E[1] - 4} ${x + side * 10} ${y - 3}` : `M${x - 10} ${y} Q ${x} ${y - E[1] - 4} ${x + 10} ${y}`;
      g += `<path d="${lid}" stroke="#1a1210" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
      if (L.eyes === "tired") g += `<path d="M${x - 8} ${y + 7} Q ${x} ${y + 11} ${x + 8} ${y + 7}" stroke="${sk3}" stroke-width="1.6" fill="none" opacity=".7"/>`;
      const by = 94, bw = { straight: [0, 4], arched: [-5, 3.6], thick: [-1, 6.5], thin: [-2, 2.2], furrowed: [4, 4.5] }[L.brows] || [0, 4];
      const inner = L.brows === "furrowed" ? by + 4 : by + 1;
      g += `<path d="M${x - side * 11} ${inner} Q ${x} ${by + bw[0] - 3} ${x + side * 12} ${by + 2}" stroke="${h2}" stroke-width="${bw[1]}" fill="none" stroke-linecap="round"/>`;
    }
    if (L.extra === "eyepatch") g += `<path d="M76 84 L180 120" stroke="#111" stroke-width="3"/><ellipse cx="149" cy="110" rx="13" ry="11" fill="#151515"/>`;
    const NS = { small: `M126 122 Q 124 132 128 134 Q 132 134 133 131`, straight: `M127 112 L 123 132 Q 128 136 134 133`, broad: `M126 114 L 120 132 Q 128 139 136 132 L 131 114`, hooked: `M128 110 Q 136 124 130 134 Q 126 136 122 132` }[L.nose] || "";
    g += `<path d="${NS}" stroke="${sk3}" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".85"/>`;
    const lip = shade(skin, -0.32);
    const MS = { neutral: `M114 148 Q 128 151 142 148`, smile: `M112 145 Q 128 158 144 145`, smirk: `M114 149 Q 130 152 144 143`, frown: `M114 152 Q 128 144 142 152`, grim: `M114 149 L 142 149` }[L.mouth] || "";
    g += `<path d="${MS}" stroke="${lip}" stroke-width="3.6" fill="none" stroke-linecap="round"/><path d="M120 156 Q 128 159 136 156" stroke="${sk2}" stroke-width="2" fill="none" opacity=".5"/>`;

    /* ---- facial hair */
    const FH = {
      stubble: `<g clip-path="url(#hc)"><path d="M${128 - cw} 126 Q ${128 - cw + 6} ${cy + 4} 128 ${cy + 4} Q ${128 + cw - 6} ${cy + 4} ${128 + cw} 126 L ${128 + cw} 140 Q 128 136 ${128 - cw} 140Z" fill="${hair}" opacity=".28"/></g>`,
      moustache: `<path d="M110 145 Q 118 136 128 141 Q 138 136 146 145 Q 138 142 128 146 Q 118 142 110 145Z" fill="${hair}" stroke="${h2}" stroke-width="1"/>`,
      goatee: `<path d="M112 145 Q 120 138 128 142 Q 136 138 144 145 Q 136 142 128 145 Q 120 142 112 145Z M118 156 Q 128 152 138 156 Q 136 ${cy + 4} 128 ${cy + 6} Q 120 ${cy + 4} 118 156Z" fill="${hair}"/>`,
      beard: `<path d="M${128 - cw + 2} 118 Q ${128 - cw + 4} ${cy + 16} 128 ${cy + 18} Q ${128 + cw - 4} ${cy + 16} ${128 + cw - 2} 118 Q ${128 + cw - 14} 150 ${128 + 14} 154 Q 128 148 ${128 - 14} 154 Q ${128 - cw + 14} 150 ${128 - cw + 2} 118Z" fill="url(#hrg)"/><path d="M110 145 Q 118 137 128 141 Q 138 137 146 145 Q 138 142 128 146 Q 118 142 110 145Z" fill="${hair}"/>`,
      "mutton chops": `<path d="M${128 - cw + 1} 100 L ${128 - cw + 14} 102 Q ${128 - cw + 16} 132 ${128 - jw - 2} 146 L ${128 - jw - 8} ${cy - 18} Q ${128 - cw + 2} 140 ${128 - cw + 1} 100Z M${128 + cw - 1} 100 L ${128 + cw - 14} 102 Q ${128 + cw - 16} 132 ${128 + jw + 2} 146 L ${128 + jw + 8} ${cy - 18} Q ${128 + cw - 2} 140 ${128 + cw - 1} 100Z" fill="url(#hrg)"/><path d="M112 146 Q 120 139 128 143 Q 136 139 144 146 Q 136 143 128 147 Q 120 143 112 146Z" fill="${hair}"/>`
    };
    g += FH[L.facial] || "";
    if (L.marks === "scar") g += `<path d="M148 84 L162 132" stroke="#8a3a3a" stroke-width="3.5" stroke-linecap="round" opacity=".85"/><path d="M150 96 l8 -3 M154 110 l8 -3 M157 122 l8 -3" stroke="#8a3a3a" stroke-width="1.6" opacity=".7"/>`;
    if (L.marks === "bandage") g += `<rect x="92" y="64" width="44" height="14" rx="3" fill="#ece6d6" transform="rotate(-14 114 71)"/><path d="M100 70 l26 -6" stroke="#c9bfa8" stroke-width="1.5" transform="rotate(-14 114 71)"/>`;

    /* ---- hair on top */
    const top = {
      short: `<path d="M${128 - cw - 2} 104 Q ${128 - cw - 6} 36 128 34 Q ${128 + cw + 6} 36 ${128 + cw + 2} 104 Q ${128 + cw - 8} 64 136 62 Q 116 72 ${128 - cw + 10} 70 Q ${128 - cw + 2} 84 ${128 - cw - 2} 104Z" fill="url(#hrg)"/>`,
      long: `<path d="M${128 - cw - 4} 112 Q ${128 - cw - 8} 32 128 30 Q ${128 + cw + 8} 32 ${128 + cw + 4} 112 Q ${128 + cw - 4} 66 128 60 Q ${128 - cw + 4} 66 ${128 - cw - 4} 112Z" fill="url(#hrg)"/>`,
      bun: `<path d="M${128 - cw - 2} 100 Q ${128 - cw - 4} 42 128 40 Q ${128 + cw + 4} 42 ${128 + cw + 2} 100 Q ${128 + cw - 8} 66 128 62 Q ${128 - cw + 8} 66 ${128 - cw - 2} 100Z" fill="url(#hrg)"/>`,
      topknot: `<path d="M${128 - cw} 96 Q ${128 - cw - 2} 46 128 44 Q ${128 + cw + 2} 46 ${128 + cw} 96 Q ${128 + cw - 10} 64 128 60 Q ${128 - cw + 10} 64 ${128 - cw} 96Z" fill="url(#hrg)"/>`,
      curly: Array.from({ length: 13 }, (_, i) => `<circle cx="${(128 - cw + 2 + i * (cw * 2 - 4) / 12).toFixed(1)}" cy="${(i % 2 ? 56 : 46) + Math.abs(6 - i) * 3}" r="16" fill="${i % 3 ? hair : h3}"/>`).join(""),
      mohawk: `<path d="M114 72 L118 14 Q 128 6 138 14 L142 72Z" fill="url(#hrg)"/><path d="M${128 - cw} 96 Q ${128 - cw} 60 114 56 L 142 56 Q ${128 + cw} 60 ${128 + cw} 96" fill="${hair}" opacity=".25"/>`,
      bob: `<path d="M${128 - cw - 6} 150 Q ${128 - cw - 10} 34 128 32 Q ${128 + cw + 10} 34 ${128 + cw + 6} 150 L ${128 + cw - 4} 150 Q ${128 + cw - 2} 96 ${128 + cw - 14} 80 Q 128 86 ${128 - cw + 6} 72 Q ${128 - cw - 2} 100 ${128 - cw + 4} 150Z" fill="url(#hrg)"/>`,
      ponytail: `<path d="M${128 - cw - 2} 100 Q ${128 - cw - 4} 38 128 36 Q ${128 + cw + 4} 38 ${128 + cw + 2} 100 Q ${128 + cw - 8} 62 128 60 Q ${128 - cw + 8} 64 ${128 - cw - 2} 100Z" fill="url(#hrg)"/><rect x="${128 + cw - 6}" y="70" width="12" height="8" rx="3" fill="#7a2f2f" transform="rotate(30 ${128 + cw} 74)"/>`,
      slicked: `<path d="M${128 - cw - 2} 98 Q ${128 - cw - 4} 38 128 36 Q ${128 + cw + 4} 38 ${128 + cw + 2} 98 Q ${128 + cw - 6} 64 128 60 Q ${128 - cw + 6} 64 ${128 - cw - 2} 98Z" fill="url(#hrg)"/>` + [0, 1, 2, 3].map((i) => `<path d="M${100 + i * 14} 62 Q ${106 + i * 14} 46 ${120 + i * 12} 40" stroke="${h3}" stroke-width="2" fill="none" opacity=".6"/>`).join(""),
      parted: `<path d="M${128 - cw - 2} 102 Q ${128 - cw - 6} 36 128 34 Q ${128 + cw + 6} 36 ${128 + cw + 2} 102 Q ${128 + cw - 4} 70 ${128 + cw - 20} 64 Q 120 58 106 50 Q ${128 - cw + 4} 72 ${128 - cw - 2} 102Z" fill="url(#hrg)"/><path d="M106 50 Q 110 40 116 36" stroke="${skin}" stroke-width="2.5" fill="none"/>`,
      braids: `<path d="M${128 - cw - 2} 102 Q ${128 - cw - 4} 38 128 36 Q ${128 + cw + 4} 38 ${128 + cw + 2} 102 Q ${128 + cw - 8} 64 128 62 Q ${128 - cw + 8} 64 ${128 - cw - 2} 102Z" fill="url(#hrg)"/><line x1="128" y1="38" x2="128" y2="62" stroke="${h2}" stroke-width="2"/>`,
      buzz: `<path d="M${128 - cw} 96 Q ${128 - cw - 2} 42 128 40 Q ${128 + cw + 2} 42 ${128 + cw} 96 Q ${128 + cw - 4} 68 128 64 Q ${128 - cw + 4} 68 ${128 - cw} 96Z" fill="${hair}" opacity=".55"/>`,
      afro: `<path d="M${128 - cw - 6} 100 Q ${128 - cw} 70 128 68 Q ${128 + cw} 70 ${128 + cw + 6} 100 Q ${128 + cw + 10} 40 128 36 Q ${128 - cw - 10} 40 ${128 - cw - 6} 100Z" fill="${hair}"/>`,
      wavy: `<path d="M${128 - cw - 4} 110 Q ${128 - cw - 8} 32 128 30 Q ${128 + cw + 8} 32 ${128 + cw + 4} 110 Q ${128 + cw - 2} 78 ${128 + cw - 14} 70 Q 140 64 128 70 Q 112 62 ${128 - cw + 12} 72 Q ${128 - cw - 2} 82 ${128 - cw - 4} 110Z" fill="url(#hrg)"/>`,
      bald: `<ellipse cx="114" cy="62" rx="16" ry="8" fill="#fff" opacity=".12"/>`
    };
    if (L.extra !== "hood") g += top[L.hair] || "";
    /* hair sheen */
    if (!["bald", "buzz"].includes(L.hair) && L.extra !== "hood") g += `<path d="M${128 - cw + 14} 58 Q 120 44 ${128 + cw - 16} 52" stroke="#fff" stroke-width="3" fill="none" opacity=".1"/>`;

    /* ---- accessories */
    const X = {
      glasses: `<rect x="94" y="100" width="28" height="20" rx="5" fill="#9fd4e6" fill-opacity=".12" stroke="#151515" stroke-width="3"/><rect x="134" y="100" width="28" height="20" rx="5" fill="#9fd4e6" fill-opacity=".12" stroke="#151515" stroke-width="3"/><line x1="122" y1="108" x2="134" y2="108" stroke="#151515" stroke-width="3"/>`,
      "round glasses": `<circle cx="107" cy="110" r="13" fill="#9fd4e6" fill-opacity=".1" stroke="#8a6a2a" stroke-width="2.5"/><circle cx="149" cy="110" r="13" fill="#9fd4e6" fill-opacity=".1" stroke="#8a6a2a" stroke-width="2.5"/><path d="M120 108 Q 128 103 136 108" stroke="#8a6a2a" stroke-width="2.5" fill="none"/>`,
      monocle: `<circle cx="149" cy="110" r="13" fill="#9fd4e6" fill-opacity=".14" stroke="#c9a24a" stroke-width="2.5"/><path d="M160 118 Q 170 160 150 200" stroke="#c9a24a" stroke-width="1.5" fill="none"/>`,
      hat: `<ellipse cx="128" cy="62" rx="${cw + 30}" ry="14" fill="#1f1f1f"/><path d="M${128 - cw + 6} 62 Q ${128 - cw + 6} 16 128 14 Q ${128 + cw - 6} 16 ${128 + cw - 6} 62Z" fill="#2c2c2c"/><path d="M${128 - cw + 6} 50 L ${128 + cw - 6} 50 L ${128 + cw - 6} 60 L ${128 - cw + 6} 60Z" fill="#7a2f2f"/><path d="M110 22 Q 128 30 146 22" stroke="#111" stroke-width="3" fill="none"/>`,
      cap: `<path d="M${128 - cw - 2} 74 Q ${128 - cw} 30 128 28 Q ${128 + cw} 30 ${128 + cw + 2} 74Z" fill="${o2}"/><path d="M${128 - cw - 4} 74 Q 128 64 ${128 + cw + 26} 80 Q 128 84 ${128 - cw - 4} 74Z" fill="${shade(out, -0.55)}"/><circle cx="128" cy="30" r="4" fill="${o3}"/>`,
      hood: `<path d="M62 150 Q 58 30 128 26 Q 198 30 194 150 Q 182 70 128 64 Q 74 70 62 150Z" fill="${o3}"/><path d="M70 140 Q 72 80 128 74 Q 184 80 186 140" stroke="${o2}" stroke-width="3" fill="none" opacity=".6"/>`,
      headscarf: `<path d="M${128 - cw - 8} 120 Q ${128 - cw - 10} 28 128 26 Q ${128 + cw + 10} 28 ${128 + cw + 8} 120 Q ${128 + cw - 4} 70 128 66 Q ${128 - cw + 4} 70 ${128 - cw - 8} 120Z" fill="${o3}"/><path d="M${128 + cw} 120 Q ${128 + cw + 20} 150 ${128 + cw + 6} 190" stroke="${o3}" stroke-width="12" fill="none" stroke-linecap="round"/>` + [0, 1, 2].map((i) => `<circle cx="${100 + i * 28}" cy="${44 + (i % 2) * 6}" r="3" fill="${o2}"/>`).join(""),
      headband: `<path d="M${128 - cw - 2} 82 Q 128 70 ${128 + cw + 2} 82 L ${128 + cw + 2} 92 Q 128 80 ${128 - cw - 2} 92Z" fill="#8a2f2f"/><path d="M${128 + cw} 86 q 18 6 22 26 M${128 + cw} 88 q 12 12 10 30" stroke="#8a2f2f" stroke-width="5" fill="none" stroke-linecap="round"/>`
    };
    g += X[L.extra] || "";

    /* ---- light and frame */
    g += `<path d="M${128 + cw - 2} 80 Q ${128 + cw + 4} 116 ${128 + jw + 6} ${cy - 16}" stroke="${shade(L.bg, 0.6)}" stroke-width="3" fill="none" opacity=".35"/>`;
    g += `<rect width="256" height="256" fill="url(#vig)"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">${g}</svg>`;
  };
  ART.portrait = (o) => {
    const L = ART.fullLook(o || {});
    const key = "gen2:" + ["skin", "hairC", "outfit", "hair", "extra", "bg", "clothes", "face", "eyes", "eyeC", "brows", "nose", "mouth", "facial", "marks"].map((k) => L[k]).join("|");
    if (!window.ASSETS.portraits[key]) window.ASSETS.portraits[key] = svgUri(ART.portraitSvg(o || {}));
    return key;
  };
  ART.registerPortrait = (look) => look ? ART.portrait(look) : "haruka";

  /* ------------------------------------------------------------ monster silhouettes */
  const SPR = {
    humanoid: (c, e) => `<path d="M100 250 L112 150 Q 90 140 96 100 Q 100 60 128 60 Q 156 60 160 100 Q 166 140 144 150 L156 250 Z" fill="${c}"/><circle cx="116" cy="92" r="5" fill="${e}"/><circle cx="140" cy="92" r="5" fill="${e}"/><path d="M96 150 L60 220 M160 150 L196 220" stroke="${c}" stroke-width="14" stroke-linecap="round"/>`,
    beast: (c, e) => `<path d="M40 190 Q 40 120 110 118 L190 118 Q 220 120 226 150 L216 200 L196 200 L192 168 L100 168 L92 200 L70 200 L68 168 Q 54 176 56 200Z" fill="${c}"/><path d="M200 120 L236 96 L240 140 L214 150Z" fill="${c}"/><circle cx="224" cy="116" r="5" fill="${e}"/><path d="M40 150 Q 20 140 14 112" stroke="${c}" stroke-width="12" fill="none" stroke-linecap="round"/>`,
    spirit: (c, e) => `<path d="M128 40 Q 200 50 196 140 Q 192 200 176 240 Q 160 220 150 244 Q 128 216 106 244 Q 96 220 80 240 Q 60 200 60 140 Q 56 50 128 40Z" fill="${c}" opacity=".85"/><ellipse cx="106" cy="110" rx="10" ry="16" fill="${e}"/><ellipse cx="150" cy="110" rx="10" ry="16" fill="${e}"/><ellipse cx="128" cy="152" rx="12" ry="18" fill="#000" opacity=".5"/>`,
    swarm: (c, e) => Array.from({ length: 26 }, (_, i) => { const x = 40 + (i * 53) % 180, y = 90 + (i * 37) % 130; return `<ellipse cx="${x}" cy="${y}" rx="14" ry="8" fill="${c}"/><circle cx="${x + 9}" cy="${y - 1}" r="2.5" fill="${e}"/>`; }).join(""),
    construct: (c, e) => `<rect x="86" y="60" width="84" height="70" rx="8" fill="${c}"/><rect x="70" y="130" width="116" height="90" rx="10" fill="${c}"/><rect x="40" y="136" width="30" height="80" rx="8" fill="${c}"/><rect x="186" y="136" width="30" height="80" rx="8" fill="${c}"/><rect x="92" y="220" width="30" height="30" fill="${c}"/><rect x="134" y="220" width="30" height="30" fill="${c}"/><rect x="104" y="86" width="14" height="10" fill="${e}"/><rect x="138" y="86" width="14" height="10" fill="${e}"/>`,
    undead: (c, e) => `<ellipse cx="128" cy="86" rx="36" ry="42" fill="${c}"/><rect x="108" y="116" width="40" height="16" fill="${c}"/><rect x="118" y="130" width="20" height="100" fill="${c}"/>` + [0, 1, 2, 3].map((i) => `<path d="M${84} ${150 + i * 18} Q 128 ${140 + i * 18} ${172} ${150 + i * 18}" stroke="${c}" stroke-width="8" fill="none"/>`).join("") + `<circle cx="114" cy="84" r="9" fill="#000"/><circle cx="142" cy="84" r="9" fill="#000"/><circle cx="114" cy="84" r="3" fill="${e}"/><circle cx="142" cy="84" r="3" fill="${e}"/>`,
    beyond: (c, e) => `<circle cx="128" cy="120" r="52" fill="${c}"/>` + Array.from({ length: 7 }, (_, i) => { const a = (i / 7) * Math.PI * 2; return `<path d="M${128 + Math.cos(a) * 40} ${120 + Math.sin(a) * 40} q ${Math.cos(a) * 60} ${Math.sin(a) * 60 + 20} ${Math.cos(a + 0.6) * 90} ${Math.sin(a + 0.6) * 90}" stroke="${c}" stroke-width="12" fill="none" stroke-linecap="round"/>`; }).join("") + `<circle cx="128" cy="116" r="24" fill="#000"/><circle cx="128" cy="116" r="12" fill="${e}"/>`
  };
  ART.spriteKinds = Object.keys(SPR);
  ART.sprite = (kind = "humanoid", hue = 0) => {
    const key = `gen:${kind}:${hue}`;
    if (!window.ASSETS.sprites[key]) {
      const c = `hsl(${hue},18%,16%)`, e = `hsl(${(hue + 20) % 360},90%,62%)`;
      window.ASSETS.sprites[key] = svgUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><radialGradient id="g" cx="50%" cy="60%"><stop offset="0" stop-color="${e}" stop-opacity=".25"/><stop offset="1" stop-color="${e}" stop-opacity="0"/></radialGradient><circle cx="128" cy="140" r="120" fill="url(#g)"/>${(SPR[kind] || SPR.humanoid)(c, e)}</svg>`);
    }
    return key;
  };

  window.ART = ART;
})();
