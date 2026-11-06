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

  function scene(theme, seed) {
    const T = THEMES[theme] || THEMES.street, R = rng(theme + ":" + seed);
    const W = 1600, H = 900;
    let g = "";
    g += `<defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${T.sky[0]}"/><stop offset="1" stop-color="${T.sky[1]}"/></linearGradient>
<radialGradient id="v" cx="50%" cy="55%" r="75%"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.75"/></radialGradient>
<radialGradient id="glow"><stop offset="0" stop-color="${T.accent}" stop-opacity="0.9"/><stop offset="1" stop-color="${T.accent}" stop-opacity="0"/></radialGradient>
<filter id="b"><feGaussianBlur stdDeviation="14"/></filter></defs>`;
    g += `<rect width="${W}" height="${H}" fill="url(#s)"/>`;
    const stars = theme === "street" || theme === "forest" || theme === "church" || theme === "cave" || theme === "village" || theme === "castle" || theme === "drive" || theme === "sea" || theme === "modern" || theme === "future";
    if (stars && T.kind !== "room") for (let i = 0; i < 50; i++) g += `<circle cx="${f(R() * W)}" cy="${f(R() * H * 0.5)}" r="${f(R() * 1.5 + 0.4)}" fill="#fff" opacity="${f(R() * 0.6 + 0.2)}"/>`;
    if (["city", "village", "forest", "castle", "dunes", "sea", "church", "trench"].includes(T.kind)) {
      const mx = 200 + R() * 1200;
      g += `<circle cx="${f(mx)}" cy="${f(120 + R() * 120)}" r="150" fill="url(#glow)" opacity="0.35"/><circle cx="${f(mx)}" cy="${f(150 + R() * 80)}" r="38" fill="${T.accent}" opacity="0.8"/>`;
    }
    const kind = T.kind;
    const bldg = (x, w, h, col, win) => {
      let s = `<rect x="${f(x)}" y="${f(H - h)}" width="${f(w)}" height="${f(h)}" fill="${col}"/>`;
      if (win) for (let wy = H - h + 24; wy < H - 60; wy += 34) for (let wx = x + 12; wx < x + w - 18; wx += 28) if (R() < 0.28) s += `<rect x="${f(wx)}" y="${f(wy)}" width="14" height="18" fill="${T.accent}" opacity="${f(0.35 + R() * 0.5)}"/>`;
      return s;
    };
    if (kind === "city") {
      for (let x = -20; x < W; x += 60 + R() * 70) g += bldg(x, 70 + R() * 80, 220 + R() * 330, T.far, false);
      for (let x = -40; x < W; x += 90 + R() * 90) g += bldg(x, 100 + R() * 90, 160 + R() * 280, T.mid, true);
      g += `<rect y="${H - 150}" width="${W}" height="150" fill="${T.near}"/>`;
      for (let i = 0; i < 4; i++) { const lx = 160 + i * 430 + R() * 80; g += `<rect x="${lx}" y="${H - 360}" width="8" height="260" fill="${T.near}"/><circle cx="${lx + 4}" cy="${H - 366}" r="70" fill="url(#glow)" opacity="0.55"/><circle cx="${lx + 4}" cy="${H - 366}" r="9" fill="${T.accent}"/>`; }
    } else if (kind === "village") {
      for (let x = -20; x < W; x += 120 + R() * 90) { const w = 120 + R() * 80, h = 90 + R() * 90; g += `<polygon points="${f(x)},${H - 150 - h} ${f(x + w / 2)},${H - 150 - h - 70} ${f(x + w)},${H - 150 - h}" fill="${T.mid}"/><rect x="${f(x)}" y="${H - 150 - h}" width="${f(w)}" height="${f(h)}" fill="${T.mid}"/><rect x="${f(x + w * 0.4)}" y="${H - 150 - h * 0.6}" width="${f(w * 0.2)}" height="${f(h * 0.45)}" fill="${T.accent}" opacity="0.65"/>`; }
      g += `<rect y="${H - 150}" width="${W}" height="150" fill="${T.near}"/>`;
    } else if (kind === "forest") {
      const tree = (x, s, col) => `<polygon points="${f(x)},${H - 140 - 260 * s} ${f(x - 70 * s)},${H - 140} ${f(x + 70 * s)},${H - 140}" fill="${col}"/><polygon points="${f(x)},${H - 140 - 340 * s} ${f(x - 50 * s)},${H - 140 - 140 * s} ${f(x + 50 * s)},${H - 140 - 140 * s}" fill="${col}"/>`;
      for (let x = -30; x < W + 30; x += 55 + R() * 50) g += tree(x, 0.7 + R() * 0.5, T.far);
      for (let x = -30; x < W + 30; x += 80 + R() * 70) g += tree(x, 1.0 + R() * 0.6, T.mid);
      g += `<rect y="${H - 140}" width="${W}" height="140" fill="${T.near}"/>`;
      for (let x = 0; x < W; x += 120 + R() * 160) g += tree(x, 1.5 + R() * 0.5, T.near);
    } else if (kind === "castle") {
      g += `<path d="M0 ${H - 200} Q 400 ${H - 330} 800 ${H - 230} T 1600 ${H - 260} V ${H} H0Z" fill="${T.far}"/>`;
      const cx = 500 + R() * 400;
      g += `<rect x="${cx}" y="${H - 520}" width="360" height="330" fill="${T.mid}"/>`;
      for (let i = 0; i < 6; i++) g += `<rect x="${cx + i * 62}" y="${H - 556}" width="36" height="36" fill="${T.mid}"/>`;
      g += `<rect x="${cx - 60}" y="${H - 650}" width="90" height="460" fill="${T.mid}"/><polygon points="${cx - 70},${H - 650} ${cx - 15},${H - 760} ${cx + 40},${H - 650}" fill="${T.mid}"/><rect x="${cx + 330}" y="${H - 650}" width="90" height="460" fill="${T.mid}"/><polygon points="${cx + 320},${H - 650} ${cx + 375},${H - 760} ${cx + 430},${H - 650}" fill="${T.mid}"/>`;
      g += `<rect x="${cx + 140}" y="${H - 360}" width="80" height="170" rx="40" fill="${T.accent}" opacity="0.55"/><rect y="${H - 190}" width="${W}" height="190" fill="${T.near}"/>`;
    } else if (kind === "church") {
      for (let i = 0; i < 5; i++) { const x = 100 + i * 330; g += `<rect x="${x}" y="${H - 640}" width="70" height="640" fill="${T.mid}"/><path d="M${x} ${H - 640} Q ${x + 165} ${H - 800} ${x + 330} ${H - 640}" fill="none" stroke="${T.mid}" stroke-width="40"/><path d="M${x + 110} ${H - 300} v -240 q 55 -80 110 0 v 240z" fill="${T.accent}" opacity="${f(0.15 + R() * 0.2)}"/>`; }
      g += `<rect y="${H - 140}" width="${W}" height="140" fill="${T.near}"/>`;
      for (let i = 0; i < 8; i++) g += `<rect x="${60 + i * 190}" y="${H - 230}" width="130" height="60" fill="${T.near}" opacity="0.85"/>`;
    } else if (kind === "trench") {
      g += `<path d="M0 ${H - 330} L300 ${H - 360} L500 ${H - 320} L900 ${H - 380} L1300 ${H - 330} L1600 ${H - 350} V ${H} H0Z" fill="${T.far}"/>`;
      for (let i = 0; i < 7; i++) { const x = 100 + i * 230 + R() * 60; g += `<rect x="${x}" y="${H - 520 - R() * 90}" width="7" height="260" fill="${T.mid}"/><line x1="${x}" y1="${H - 470}" x2="${x + 90}" y2="${H - 440}" stroke="${T.mid}" stroke-width="3"/>`; }
      g += `<path d="M0 ${H - 230} H1600 V ${H} H0Z" fill="${T.mid}"/><path d="M0 ${H - 140} H1600 V ${H} H0Z" fill="${T.near}"/>`;
      for (let i = 0; i < 14; i++) g += `<rect x="${i * 120}" y="${H - 250}" width="70" height="22" fill="${T.near}"/>`;
    } else if (kind === "dunes") {
      g += `<path d="M0 ${H - 300} Q 400 ${H - 420} 800 ${H - 300} T 1600 ${H - 330} V ${H} H0Z" fill="${T.far}"/><path d="M0 ${H - 190} Q 500 ${H - 300} 1000 ${H - 180} T 1600 ${H - 200} V ${H} H0Z" fill="${T.mid}"/><path d="M0 ${H - 90} Q 600 ${H - 160} 1200 ${H - 90} T 1600 ${H - 100} V ${H} H0Z" fill="${T.near}"/>`;
      if (theme === "drive") g += `<rect x="560" y="260" width="480" height="270" fill="#e9e4ff" opacity="0.85"/><rect x="545" y="245" width="510" height="300" fill="none" stroke="${T.mid}" stroke-width="16"/><rect x="790" y="545" width="20" height="200" fill="${T.mid}"/>`;
    } else if (kind === "sea") {
      g += `<rect y="${H - 330}" width="${W}" height="330" fill="${T.far}"/>`;
      for (let i = 0; i < 9; i++) g += `<path d="M0 ${H - 300 + i * 34} q 100 -${14 + i * 2} 200 0 t 200 0 t 200 0 t 200 0 t 200 0 t 200 0 t 200 0 t 200 0 V ${H} H0Z" fill="${i % 2 ? T.mid : T.far}" opacity="0.9"/>`;
      const sx = 400 + R() * 600;
      g += `<path d="M${sx} ${H - 330} h 340 l -50 60 h -240z" fill="${T.near}"/><rect x="${sx + 140}" y="${H - 560}" width="10" height="230" fill="${T.near}"/><path d="M${sx + 150} ${H - 555} l 120 150 h -120z" fill="${T.near}" opacity="0.9"/>`;
    } else if (kind === "cave") {
      g += `<path d="M0 0 H1600 V250 Q 1300 340 1100 220 T 700 280 T 300 200 T 0 300Z" fill="${T.near}"/>`;
      for (let i = 0; i < 16; i++) { const x = R() * W, h = 60 + R() * 200; g += `<polygon points="${f(x)},0 ${f(x + 28)},0 ${f(x + 14)},${f(h)}" fill="${T.mid}"/><polygon points="${f(x)},${H} ${f(x + 34)},${H} ${f(x + 17)},${f(H - h * 0.8)}" fill="${T.mid}"/>`; }
      g += `<ellipse cx="800" cy="${H - 130}" rx="420" ry="46" fill="${T.accent}" opacity="0.18"/>`;
    } else { // room
      g += `<rect y="0" width="${W}" height="${H - 220}" fill="${T.far}"/><polygon points="0,${H} ${W},${H} ${W - 220},${H - 220} 220,${H - 220}" fill="${T.mid}"/>`;
      for (let i = 1; i < 8; i++) g += `<line x1="${i * 200}" y1="${H}" x2="${220 + i * 165}" y2="${H - 220}" stroke="${T.near}" stroke-width="2" opacity="0.6"/>`;
      g += `<rect x="${200 + R() * 80}" y="150" width="260" height="300" fill="${T.sky[1]}" stroke="${T.near}" stroke-width="14"/><line x1="${330}" y1="150" x2="330" y2="450" stroke="${T.near}" stroke-width="8"/>`;
      g += `<rect x="1020" y="260" width="200" height="${H - 480}" fill="${T.near}"/><rect x="1030" y="270" width="180" height="${H - 500}" fill="${T.mid}"/><circle cx="1190" cy="${f(H / 2 - 40)}" r="8" fill="${T.accent}"/>`;
      g += `<ellipse cx="800" cy="260" rx="260" ry="190" fill="url(#glow)" opacity="0.22"/><rect x="560" y="${H - 380}" width="420" height="30" fill="${T.near}"/><rect x="590" y="${H - 350}" width="22" height="130" fill="${T.near}"/><rect x="930" y="${H - 350}" width="22" height="130" fill="${T.near}"/>`;
    }
    if (["fog", "street", "cave", "forest", "village", "trench", "cellar"].includes(theme)) for (let i = 0; i < 6; i++) g += `<ellipse cx="${f(R() * W)}" cy="${f(H - 120 - R() * 330)}" rx="${f(260 + R() * 260)}" ry="${f(26 + R() * 40)}" fill="#cfd6e0" opacity="0.07" filter="url(#b)"/>`;
    g += `<rect width="${W}" height="${H}" fill="url(#v)"/>`;
    return svgUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${g}</svg>`);
  }

  ART.scene = (theme, seed = "") => {
    const key = `gen:${theme}:${seed}`;
    if (!window.ASSETS.scenes[key]) window.ASSETS.scenes[key] = scene(theme, seed);
    return key;
  };

  /* ------------------------------------------------------------ portraits */
  ART.SKIN = ["#f1d2b5", "#e3b48c", "#c68d62", "#9c6542", "#74452b", "#4e2e1e"];
  ART.HAIRC = ["#17120f", "#3a2619", "#7a4a26", "#b8863f", "#c9c9c9", "#7b2f2a", "#2b3a67"];
  ART.OUTFIT = ["#3a4a5c", "#5c3a3a", "#3f5c42", "#6b5a38", "#4a3a5c", "#2b2b2b", "#7a7a7a", "#8a2f2f"];
  ART.HAIRS = ["short", "long", "bun", "bald", "curly", "mohawk"];
  ART.EXTRAS = ["none", "glasses", "hat", "scar", "beard"];

  ART.portraitSvg = (o) => {
    const skin = o.skin || ART.SKIN[2], hair = o.hairC || ART.HAIRC[1], out = o.outfit || ART.OUTFIT[0], hs = o.hair || "short", ex = o.extra || "none", bg = o.bg || "#2b2f3a";
    let g = `<rect width="256" height="256" fill="${bg}"/><radialGradient id="r" cx="50%" cy="40%"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient>`;
    g += `<path d="M20 256 Q 24 190 90 176 L 166 176 Q 232 190 236 256Z" fill="${out}"/><path d="M112 176 L128 214 L144 176Z" fill="${skin}"/>`;
    g += `<rect x="112" y="150" width="32" height="34" fill="${skin}"/>`;
    if (hs === "long") g += `<path d="M70 110 Q 66 190 82 214 L 100 150Z M186 110 Q 190 190 174 214 L 156 150Z" fill="${hair}"/>`;
    if (hs === "bun") g += `<circle cx="128" cy="48" r="22" fill="${hair}"/>`;
    g += `<ellipse cx="128" cy="108" rx="52" ry="62" fill="${skin}"/><ellipse cx="76" cy="112" rx="8" ry="14" fill="${skin}"/><ellipse cx="180" cy="112" rx="8" ry="14" fill="${skin}"/>`;
    if (hs === "short") g += `<path d="M74 100 Q 70 40 128 38 Q 188 40 182 100 Q 170 70 128 68 Q 90 70 74 100Z" fill="${hair}"/>`;
    if (hs === "long") g += `<path d="M72 106 Q 66 36 128 36 Q 190 36 184 106 Q 170 66 128 64 Q 90 66 72 106Z" fill="${hair}"/>`;
    if (hs === "bun") g += `<path d="M74 100 Q 70 46 128 44 Q 186 46 182 100 Q 170 70 128 68 Q 90 70 74 100Z" fill="${hair}"/>`;
    if (hs === "curly") for (let i = 0; i < 9; i++) g += `<circle cx="${82 + i * 11.5}" cy="${i % 2 ? 60 : 52}" r="18" fill="${hair}"/>`;
    if (hs === "mohawk") g += `<path d="M112 70 L120 22 L136 22 L144 70Z" fill="${hair}"/>`;
    g += `<circle cx="108" cy="108" r="5" fill="#1a1a1a"/><circle cx="148" cy="108" r="5" fill="#1a1a1a"/><path d="M112 140 Q 128 150 144 140" stroke="#5a2f26" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M124 112 L120 130 L128 132" stroke="#00000033" stroke-width="3" fill="none"/>`;
    if (ex === "glasses") g += `<circle cx="108" cy="108" r="14" fill="none" stroke="#111" stroke-width="3"/><circle cx="148" cy="108" r="14" fill="none" stroke="#111" stroke-width="3"/><line x1="122" y1="108" x2="134" y2="108" stroke="#111" stroke-width="3"/>`;
    if (ex === "hat") g += `<ellipse cx="128" cy="62" rx="76" ry="14" fill="#222"/><path d="M82 62 Q 84 18 128 18 Q 172 18 174 62Z" fill="#2c2c2c"/><rect x="82" y="50" width="92" height="9" fill="#7a2f2f"/>`;
    if (ex === "scar") g += `<path d="M146 82 L162 130" stroke="#8a3a3a" stroke-width="4" stroke-linecap="round"/>`;
    if (ex === "beard") g += `<path d="M82 128 Q 90 184 128 186 Q 166 184 174 128 Q 160 150 128 150 Q 96 150 82 128Z" fill="${hair}"/>`;
    g += `<rect width="256" height="256" fill="url(#r)"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">${g}</svg>`;
  };
  ART.portrait = (o) => {
    const key = "gen:" + [o.skin, o.hairC, o.outfit, o.hair, o.extra, o.bg].join("|");
    if (!window.ASSETS.portraits[key]) window.ASSETS.portraits[key] = svgUri(ART.portraitSvg(o));
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
