// Drawn placeholder portraits, used until (or instead of) generated photos.
const SKIN = [[/porcelain|pale|fair/, "#f3d6c4"], [/ivory|light beige|light with/, "#ecc9ad"], [/peach/, "#efc6a6"], [/olive|beige|wheat/, "#d9b08a"], [/golden|honey|tan|morena|sun/, "#c99569"], [/caramel/, "#b57f54"], [/medium brown|light brown/, "#9c6a45"], [/mahogany|rich|deep brown|dark brown/, "#6e4429"], [/ebony|chocolate|dark/, "#4f301d"]];
const HAIR = [[/platinum/, "#e9dcc0"], [/ash blonde/, "#c9b48f"], [/honey|blonde/, "#d1a35d"], [/strawberry/, "#d0875a"], [/copper|red|auburn/, "#a2502c"], [/pink|rose/, "#d98aa6"], [/caramel|chestnut/, "#7a4a2a"], [/light brown/, "#8b6040"], [/espresso|chocolate|dark brown/, "#3d2618"], [/brown/, "#5a3a22"], [/black/, "#191414"]];
const EYES = [[/ice|blue/, "#6c93c4"], [/grey|gray/, "#8a96a0"], [/green/, "#5f8c5a"], [/hazel/, "#8a7442"], [/amber/, "#b07a2e"], [/light brown/, "#7b5233"], [/brown/, "#4a2f1d"]];
const pick = (tbl, s, d) => { s = (s || "").toLowerCase(); for (const [re, c] of tbl) if (re.test(s)) return c; return d; };

export function portraitSVG(w, opts = {}) {
  const skin = pick(SKIN, w.skin, "#d9b08a");
  const hair = pick(HAIR, w.hair.color, "#4a2f1d");
  const eye = pick(EYES, w.eyes.color, "#4a2f1d");
  const len = w.hair.length;
  const long = /long|waist|mid-back|past/.test(len) ? 2 : /shoulder|collarbone/.test(len) ? 1 : 0;
  const curly = /curl|coil|wav/.test(w.hair.texture);
  const hue = (w.seed % 360);
  const bg1 = `hsl(${hue},55%,62%)`, bg2 = `hsl(${(hue + 50) % 360},60%,35%)`;
  const hairBack = long === 2 ? `<path d="M60 150 Q50 330 80 420 L320 420 Q350 330 340 150 Q300 70 200 70 Q100 70 60 150Z" fill="${hair}"/>` : long === 1 ? `<path d="M70 150 Q60 270 90 310 L310 310 Q340 270 330 150 Q300 75 200 75 Q100 75 70 150Z" fill="${hair}"/>` : `<path d="M88 170 Q80 110 200 88 Q320 110 312 170 Q300 230 290 240 L110 240 Q100 230 88 170Z" fill="${hair}"/>`;
  const curls = curly ? Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2; const r = long ? 125 : 110; return `<circle cx="${200 + Math.cos(a) * r}" cy="${190 + Math.sin(a) * (r * 0.95)}" r="${22 + (i % 3) * 5}" fill="${hair}"/>`; }).join("") : "";
  const freckles = /freckle/.test(w.face.join(" ")) ? [0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${172 + (i % 3) * 9 + (i > 2 ? 40 : 0)}" cy="${232 + (i % 2) * 6}" r="1.8" fill="#8a5a3a" opacity=".6"/>`).join("") : "";
  const mole = /beauty mark|mole/.test(w.face.join(" ")) ? `<circle cx="236" cy="262" r="2.6" fill="#3a2418"/>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice">
<defs><linearGradient id="g${w.seed}" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/></linearGradient></defs>
<rect width="400" height="600" fill="url(#g${w.seed})"/>
${hairBack}${curls}
<path d="M120 600 Q120 420 200 400 Q280 420 280 600Z" fill="${skin}"/>
<rect x="176" y="300" width="48" height="90" rx="20" fill="${skin}"/>
<path d="M40 600 Q60 450 200 440 Q340 450 360 600Z" fill="hsl(${(hue + 180) % 360},35%,30%)"/>
<ellipse cx="200" cy="215" rx="88" ry="108" fill="${skin}"/>
<path d="M112 190 Q120 95 200 92 Q285 95 290 190 Q270 130 200 128 Q140 130 112 190Z" fill="${hair}"/>
<ellipse cx="166" cy="215" rx="14" ry="${/almond|cat|upturned|monolid/.test(w.eyes.shape) ? 7 : 9}" fill="#fff"/><ellipse cx="234" cy="215" rx="14" ry="${/almond|cat|upturned|monolid/.test(w.eyes.shape) ? 7 : 9}" fill="#fff"/>
<circle cx="167" cy="216" r="6.5" fill="${eye}"/><circle cx="233" cy="216" r="6.5" fill="${eye}"/>
<circle cx="167" cy="216" r="2.6" fill="#111"/><circle cx="233" cy="216" r="2.6" fill="#111"/>
<path d="M148 195 Q166 186 184 194" stroke="${hair}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M216 194 Q234 186 252 195" stroke="${hair}" stroke-width="4" fill="none" stroke-linecap="round"/>
<path d="M200 225 Q196 250 192 256 Q200 260 208 256" stroke="rgba(0,0,0,.18)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<path d="M180 280 Q200 ${/full|plump|wide/.test(w.face.join(" ")) ? 298 : 292} 220 280 Q200 284 180 280Z" fill="#c4626b"/>
<ellipse cx="150" cy="255" rx="14" ry="8" fill="#e88" opacity=".18"/><ellipse cx="250" cy="255" rx="14" ry="8" fill="#e88" opacity=".18"/>
${freckles}${mole}
</svg>`;
}

export function portraitURL(w) {
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(portraitSVG(w));
}
