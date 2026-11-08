/* ============================================================================
   THE HIDEOUT — the agency's home base between cases.

   A drawn room (styled for the campaign's period) with places to click instead
   of a row of menu tabs, a party panel, and downtime activities that play out as
   short splash scenes. The rules underneath are unchanged: every activity calls
   the same CAMP functions the Downtime tab always used (restDay, passDays ...).

   To add an activity line, add a string to LINES below. Tokens in {braces} are
   filled in from the agent, their bond, the period (ERA_WORDS) and the agency.
   ========================================================================== */
(function () {
  const C = window.CDATA, U = window.UI, CAMP = window.CAMP, ui = CAMP.ui, el = U.el, A = window.ART;
  const HIDE = (window.HIDE = {});
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const svgUri = (svg) => "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg).replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/'/g, "%27");
  const POOLS = ["health", "sanity", "stability"];

  /* ------------------------------------------------------------ period styling */
  const STYLE = {
    medieval:  { name: "Chapter house", wall: "#2c241d", wall2: "#221b15", floor: "#1b1510", trim: "#0e0a07", light: "#f0b45a", board: "#5c4630", metal: "#4a4038", phone: "Messenger bell", garage: "Stables", vault: "Reliquary", lamp: "candle" },
    victorian: { name: "Safehouse", wall: "#2b211f", wall2: "#211917", floor: "#1a1312", trim: "#0d0908", light: "#f2c27a", board: "#5b4128", metal: "#3d3a38", phone: "Telegraph", garage: "Carriage house", vault: "Vault", lamp: "gas" },
    wars:      { name: "Bunker", wall: "#262a22", wall2: "#1d2019", floor: "#171a14", trim: "#0b0d09", light: "#e8d08a", board: "#4f4430", metal: "#3a4034", phone: "Field radio", garage: "Motor pool", vault: "Vault", lamp: "bulb" },
    atomic:    { name: "Hideout", wall: "#2e2419", wall2: "#241c13", floor: "#1b150e", trim: "#0e0a06", light: "#e3a447", board: "#6b4a2c", metal: "#3b4048", phone: "Telephone", garage: "Garage", vault: "Vault", lamp: "pendant" },
    modern:    { name: "Field office", wall: "#23272d", wall2: "#1b1f24", floor: "#15181c", trim: "#0a0c0f", light: "#dfe9f2", board: "#5a4a36", metal: "#41474f", phone: "Phone", garage: "Garage", vault: "Vault", lamp: "fluor" },
    now:       { name: "Ops room", wall: "#141a24", wall2: "#10151d", floor: "#0b0f15", trim: "#05080c", light: "#60f0ff", board: "#1d2a38", metal: "#2a3644", phone: "Comms", garage: "Drone bay", vault: "Vault", lamp: "strip" }
  };
  const eraId = () => C.eraOf(CAMP.camp.year).id;
  const style = () => STYLE[eraId()] || STYLE.atomic;

  /* Words that make a line sound like its century. */
  const ERA_WORDS = {
    medieval:  { drink: "watered ale", game: "knucklebones", light: "the candles", news: "a pilgrim's gossip", music: "a lute somewhere upstairs", food: "black bread and stew", street: "the village lane", incense: "a stub of beeswax" },
    victorian: { drink: "strong tea", game: "whist", light: "the gas lamps", news: "the evening paper", music: "a music-hall tune through the wall", food: "mutton pie", street: "the fogged embankment", incense: "a pinch of sandalwood" },
    wars:      { drink: "tinned coffee", game: "rummy", light: "the bare bulb", news: "the wireless", music: "a crackling gramophone", food: "bully beef and biscuits", street: "the blacked-out street", incense: "a cigarette left to burn" },
    atomic:    { drink: "canned coffee", game: "poker", light: "the pendant lamp", news: "the late news on the radio", music: "the transistor radio", food: "takeout noodles", street: "the wet streets", incense: "a stick of incense" },
    modern:    { drink: "vending-machine coffee", game: "a handheld console", light: "the fluorescents", news: "the TV news", music: "a mixtape", food: "cold pizza", street: "the neon streets", incense: "a scented candle" },
    now:       { drink: "energy drinks", game: "a co-op game on the big screen", light: "the LED strips", news: "the news feeds", music: "a lo-fi playlist", food: "delivery noodles", street: "the drone-lit streets", incense: "an app's breathing timer" }
  };
  const AGENCY_WORDS = { EHG: { atomic: { game: "hanafuda", music: "enka on the transistor radio", food: "takeout ramen" } } };
  const words = () => {
    const e = eraId(), ag = CAMP.camp.agency;
    return { ...ERA_WORDS[e], ...((AGENCY_WORDS[ag] || {})[e] || {}) };
  };

  /* ------------------------------------------------------------ lines for each activity */
  const LINES = {
    natural: [
      "{a} sleeps most of the day on the infirmary cot. Someone has left {drink} on the crate beside it.",
      "{a} changes the dressings, eats {food}, and lets the body do its slow work.",
      "The hours pass to {music}. {a} wakes up hungry, which is a good sign.",
      "{a} sleeps badly, then well. By evening the ache has dulled to a bruise."
    ],
    meditate: [
      "{a} sits facing the wall until the noise in the head runs out.",
      "Breath in, breath out. {a} counts to a thousand and starts again.",
      "{a} lights {incense} and waits for the room to stop feeling watched.",
      "{a} kneels in the quiet corner under {light}. Something unclenches."
    ],
    week: [
      "A week passes. {news} talks about ordinary things, and {a} lets it.",
      "Seven days of {food}, {drink} and sleep. The bruises go yellow, then go.",
      "{a} keeps the hideout's hours for a week: up late, up early, never quite rested, but better."
    ],
    visit: [
      "{a} spends the day with {b}, {rel}. They don't talk about work. It helps.",
      "{b} sees how tired {a} looks and doesn't ask why. {a} is grateful for that.",
      "{a} and {b} walk along {street} until dark, talking about nothing at all.",
      "{a} brings {b} {food}. They eat it together, badly, and laugh about it."
    ],
    contacts: [
      "{a} spends two days buying {drink} for people who owe the {ag} something.",
      "A name, a number, a promise. By the second night someone agrees to owe {a} a favor.",
      "{a} works the old list: a clerk, a fence, a retired priest. One of them still answers."
    ],
    meal: [
      "{a} and {p} split {food} at the common table. {p} tells a story about the old days that is probably half true.",
      "{p} cooks, which nobody asked for. {a} eats two helpings anyway.",
      "Over {food}, {a} and {p} argue about the last case. They agree on more than either expected."
    ],
    stories: [
      "{a} asks {p} why they joined. {p} answers with a question of their own.",
      "{p} shows {a} an old photograph and doesn't explain it. {a} doesn't ask.",
      "Late, over {drink}, {a} and {p} trade the worst things they've seen. Saying them out loud makes them smaller."
    ],
    game: [
      "{a} and {p} play {game} well past midnight. {w} wins, and is insufferable about it.",
      "A game of {game} turns into three. {w} swears the others cheated.",
      "{a} teaches {p} {game}. {p} wins the first hand and the lesson is over."
    ],
    gear: [
      "{a} strips the {aw} while {p} checks the {pw}. Neither says much. Neither needs to.",
      "{p} notices a fault in {a}'s {aw} and fixes it without being asked.",
      "Oil, cloth and {music}. {a} and {p} make sure everything will work when it has to."
    ],
    spar: [
      "{a} and {p} spar in the cleared space by the {garage}. {w} lands the last hit.",
      "{p} drills {a} on a grip they learned the hard way. {a} learns it the easy way.",
      "They spar until both are laughing too hard to stand. {w} claims the win."
    ],
    alone: [
      "{a} sits alone at the common table with {drink}, reading old case notes by {light}.",
      "{a} plays solitaire with a deck that's missing a card. The hideout creaks around them.",
      "{a} writes a letter they probably won't send."
    ]
  };
  const fill = (t, x) => t.replace(/\{(\w+)\}/g, (_, k) => (x[k] != null ? x[k] : _));
  const ctx = (a, more = {}) => ({ ...words(), a: a.short, ag: CAMP.agency().short, garage: style().garage.toLowerCase(), aw: (a.weapon && a.weapon.name) || "weapon", ...more });

  /* ------------------------------------------------------------ the room, drawn */
  const W = 1600, H = 900;
  function roomSvg(id) {
    const S = STYLE[id] || STYLE.atomic;
    const r = ((s) => () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; })(id.length * 7919 + 17);
    const f = (n) => Math.round(n * 10) / 10;
    let g = `<defs>
<linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${S.wall2}"/><stop offset="1" stop-color="${S.wall}"/></linearGradient>
<linearGradient id="flr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${S.floor}"/><stop offset="1" stop-color="${S.trim}"/></linearGradient>
<radialGradient id="glow"><stop offset="0" stop-color="${S.light}" stop-opacity="0.85"/><stop offset="1" stop-color="${S.light}" stop-opacity="0"/></radialGradient>
<linearGradient id="cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${S.light}" stop-opacity="0.22"/><stop offset="1" stop-color="${S.light}" stop-opacity="0"/></linearGradient>
<radialGradient id="vig" cx="50%" cy="55%" r="75%"><stop offset="0.5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.8"/></radialGradient>
<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 .08 0"/></filter>
</defs>`;
    // walls and floor
    g += `<rect width="${W}" height="640" fill="url(#wall)"/>`;
    if (id === "medieval") for (let y = 20; y < 640; y += 46) for (let x = (y / 46) % 2 ? -40 : 0; x < W; x += 92) g += `<rect x="${x}" y="${y}" width="88" height="42" fill="none" stroke="${S.trim}" stroke-opacity="0.35" stroke-width="2"/>`;
    else if (id === "wars") for (let y = 60; y < 640; y += 80) g += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${S.trim}" stroke-opacity="0.3" stroke-width="2"/>`;
    else if (id === "atomic" || id === "victorian") for (let x = 0; x < W; x += 54) g += `<rect x="${x}" y="470" width="50" height="170" fill="${S.trim}" opacity="0.18"/>`;
    else if (id === "now") for (let x = 0; x < W; x += 120) g += `<line x1="${x}" y1="0" x2="${x}" y2="640" stroke="${S.light}" stroke-opacity="0.05" stroke-width="2"/>`;
    g += `<rect y="0" width="${W}" height="34" fill="${S.trim}"/><rect y="632" width="${W}" height="10" fill="${S.trim}"/>`;
    g += `<rect y="640" width="${W}" height="260" fill="url(#flr)"/>`;
    for (let i = -6; i < 14; i++) g += `<line x1="${800 + i * 70}" y1="640" x2="${800 + i * 190}" y2="${H}" stroke="${S.trim}" stroke-width="2" opacity="0.5"/>`;
    for (const y of [690, 760, 850]) g += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${S.trim}" stroke-width="2" opacity="0.35"/>`;

    // case board (80..420 x 150..430)
    g += `<rect x="72" y="142" width="356" height="296" fill="${S.trim}"/><rect x="80" y="150" width="340" height="280" fill="${S.board}"/>`;
    const pins = [];
    for (let i = 0; i < 9; i++) {
      const x = 100 + (i % 3) * 105 + r() * 30, y = 168 + Math.floor(i / 3) * 86 + r() * 20, rot = f(r() * 10 - 5);
      const paper = i % 4 === 1 ? "#cfc6b0" : i % 4 === 3 ? "#9fa7ad" : "#e3dccb";
      g += `<g transform="rotate(${rot} ${f(x + 35)} ${f(y + 30)})"><rect x="${f(x)}" y="${f(y)}" width="72" height="${i % 2 ? 58 : 66}" fill="${paper}"/>`;
      for (let l = 0; l < 4; l++) g += `<rect x="${f(x + 8)}" y="${f(y + 12 + l * 11)}" width="${f(30 + r() * 26)}" height="3" fill="#5a5245" opacity="0.6"/>`;
      g += `</g>`;
      pins.push([x + 36, y + 6]);
    }
    for (const [a, b] of [[0, 4], [4, 8], [2, 4], [4, 6], [1, 5]]) g += `<line x1="${f(pins[a][0])}" y1="${f(pins[a][1])}" x2="${f(pins[b][0])}" y2="${f(pins[b][1])}" stroke="#b8322a" stroke-width="2.5" opacity="0.9"/>`;
    for (const [x, y] of pins) g += `<circle cx="${f(x)}" cy="${f(y)}" r="5" fill="#d23a30"/>`;

    // lockers / armory (460..650 x 220..640)
    for (let i = 0; i < 3; i++) {
      const x = 460 + i * 64;
      g += `<rect x="${x}" y="220" width="60" height="420" fill="${S.metal}" stroke="${S.trim}" stroke-width="4"/>`;
      for (let v = 0; v < 5; v++) g += `<rect x="${x + 14}" y="${240 + v * 10}" width="32" height="4" fill="${S.trim}"/>`;
      g += `<rect x="${x + 46}" y="400" width="6" height="34" fill="${S.light}" opacity="0.55"/>`;
    }
    if (id === "medieval") g += `<line x1="470" y1="600" x2="560" y2="230" stroke="#b9b2a6" stroke-width="6"/><line x1="640" y1="600" x2="560" y2="230" stroke="#b9b2a6" stroke-width="6"/>`;

    // door (690..810 x 300..640)
    g += `<rect x="682" y="292" width="136" height="348" fill="${S.trim}"/><rect x="690" y="300" width="120" height="336" fill="${S.wall2}"/>`;
    g += `<rect x="712" y="324" width="76" height="70" fill="${S.light}" opacity="0.12"/><circle cx="792" cy="476" r="6" fill="${S.light}" opacity="0.8"/>`;
    g += `<rect x="690" y="628" width="120" height="8" fill="${S.light}" opacity="0.55"/>`;

    // phone / bell / radio / comms (815..875 x 350..470)
    if (S.phone === "Messenger bell") g += `<line x1="845" y1="300" x2="845" y2="380" stroke="${S.metal}" stroke-width="4"/><path d="M820 430 Q 845 370 870 430 Z" fill="#b08a3e"/><circle cx="845" cy="436" r="6" fill="#b08a3e"/>`;
    else if (S.phone === "Telegraph") g += `<rect x="818" y="410" width="56" height="40" fill="#4a3424"/><rect x="826" y="396" width="40" height="16" fill="#9c8a5a"/><circle cx="866" cy="398" r="6" fill="#222"/>`;
    else if (S.phone === "Field radio") g += `<rect x="815" y="380" width="62" height="70" fill="#4a5238"/><circle cx="834" cy="404" r="9" fill="#222"/><circle cx="858" cy="404" r="9" fill="#222"/><rect x="826" y="424" width="40" height="14" fill="${S.light}" opacity="0.5"/><line x1="870" y1="380" x2="884" y2="290" stroke="#555" stroke-width="3"/>`;
    else if (S.phone === "Comms") g += `<rect x="812" y="360" width="70" height="100" rx="6" fill="#0c1a26" stroke="${S.light}" stroke-width="2"/><rect x="820" y="370" width="54" height="60" fill="${S.light}" opacity="0.25"/><circle cx="847" cy="444" r="6" fill="${S.light}"/>`;
    else g += `<rect x="822" y="372" width="48" height="74" rx="6" fill="${id === "modern" ? "#bbb" : "#1d1d1d"}"/><circle cx="846" cy="420" r="15" fill="none" stroke="${id === "modern" ? "#444" : "#777"}" stroke-width="5"/><path d="M816 380 q 30 -24 60 0 v 10 h -60z" fill="${id === "modern" ? "#999" : "#2c2c2c"}"/><path d="M846 446 q 0 40 -26 70" fill="none" stroke="#111" stroke-width="3"/>`;

    // archive shelves (880..1110 x 150..640)
    g += `<rect x="880" y="150" width="230" height="490" fill="${S.trim}"/>`;
    const bookCols = ["#6b2a24", "#2f4a5c", "#4f5b33", "#7a6234", "#3b2f45", "#8a8170", "#5b3b25"];
    for (let s = 0; s < 5; s++) {
      const y = 160 + s * 96;
      g += `<rect x="888" y="${y + 84}" width="214" height="8" fill="${S.metal}"/>`;
      let x = 892;
      while (x < 1090) {
        if (r() < 0.18) { const w = 46; if (x + w > 1100) break; g += `<rect x="${f(x)}" y="${y + 44}" width="${w}" height="40" fill="#8b7a5a"/><rect x="${f(x + 14)}" y="${y + 56}" width="18" height="8" fill="#e8dfc8"/>`; x += w + 4; continue; }
        const w = 10 + r() * 12, h = 50 + r() * 30;
        if (x + w > 1100) break;
        g += `<rect x="${f(x)}" y="${f(y + 84 - h)}" width="${f(w)}" height="${f(h)}" fill="${bookCols[Math.floor(r() * bookCols.length)]}"/>`;
        x += w + 2;
      }
    }

    // vault (1125..1315 x 345..535)
    g += `<rect x="1125" y="345" width="190" height="190" fill="${S.metal}" stroke="${S.trim}" stroke-width="6"/>`;
    g += `<circle cx="1220" cy="440" r="80" fill="${S.wall2}" stroke="${S.trim}" stroke-width="8"/><circle cx="1220" cy="440" r="22" fill="${S.metal}"/>`;
    for (let k = 0; k < 6; k++) { const an = (k * Math.PI) / 3; g += `<line x1="1220" y1="440" x2="${f(1220 + Math.cos(an) * 60)}" y2="${f(440 + Math.sin(an) * 60)}" stroke="${S.light}" stroke-opacity="0.45" stroke-width="5"/>`; }
    if (id === "medieval") g += `<path d="M1205 380 h30 v-12 h-30z M1214 368 v-14 h12 v14" fill="#b08a3e"/>`;

    // garage / stables / bay (1340..1580 x 250..640)
    g += `<rect x="1332" y="242" width="256" height="398" fill="${S.trim}"/>`;
    if (id === "medieval" || id === "victorian") {
      g += `<rect x="1340" y="250" width="118" height="390" fill="#3b2a1c"/><rect x="1462" y="250" width="118" height="390" fill="#3b2a1c"/>`;
      g += `<path d="M1340 250 L1458 640 M1458 250 L1340 640 M1462 250 L1580 640 M1580 250 L1462 640" stroke="#24180f" stroke-width="8"/>`;
    } else {
      g += `<rect x="1340" y="250" width="240" height="390" fill="${S.metal}"/>`;
      for (let y = 262; y < 640; y += 24) g += `<line x1="1340" y1="${y}" x2="1580" y2="${y}" stroke="${S.trim}" stroke-width="3" opacity="0.7"/>`;
      g += `<rect x="1340" y="600" width="240" height="18" fill="${id === "now" ? S.light : "#d9a637"}" opacity="0.55"/>`;
    }

    // lamp and light cone over the table
    if (S.lamp === "candle") {
      g += `<rect x="740" y="0" width="40" height="150" fill="${S.trim}"/><circle cx="760" cy="170" r="70" fill="url(#glow)" opacity="0.6"/>`;
      for (const x of [700, 760, 820]) g += `<rect x="${x - 4}" y="150" width="8" height="26" fill="#e8dcc0"/><ellipse cx="${x}" cy="144" rx="5" ry="10" fill="${S.light}"/>`;
    } else if (S.lamp === "fluor" || S.lamp === "strip") {
      g += `<rect x="560" y="34" width="420" height="16" fill="${S.light}" opacity="0.8"/><ellipse cx="770" cy="60" rx="380" ry="60" fill="url(#glow)" opacity="0.35"/>`;
    } else {
      g += `<line x1="760" y1="34" x2="760" y2="190" stroke="#111" stroke-width="3"/><path d="M712 230 L740 186 L780 186 L808 230 Z" fill="${S.metal}"/><circle cx="760" cy="232" r="70" fill="url(#glow)" opacity="0.55"/>`;
    }
    g += `<polygon points="712,232 808,232 1090,760 430,760" fill="url(#cone)"/>`;

    // common table with clutter, logbook at 860..960
    g += `<ellipse cx="760" cy="770" rx="320" ry="62" fill="${S.trim}" opacity="0.7"/><ellipse cx="760" cy="752" rx="310" ry="56" fill="#3a2a1c"/><ellipse cx="760" cy="746" rx="300" ry="50" fill="#4a3624"/>`;
    g += `<rect x="520" y="770" width="16" height="100" fill="#24180f"/><rect x="990" y="770" width="16" height="100" fill="#24180f"/>`;
    g += `<rect x="560" y="724" width="150" height="34" fill="#c8bfa4" transform="rotate(-6 635 741)"/><path d="M590 730 l 40 10 l 30 -8 l 40 12" stroke="#b8322a" stroke-width="2" fill="none"/>`;
    g += `<ellipse cx="780" cy="730" rx="16" ry="7" fill="#ddd"/><rect x="766" y="712" width="28" height="20" fill="#ddd"/><ellipse cx="820" cy="740" rx="22" ry="8" fill="#555"/>`;
    g += `<path d="M868 722 h44 v38 h-44z" fill="#e3dccb"/><path d="M912 722 h44 v38 h-44z" fill="#d9d1bc"/><line x1="912" y1="722" x2="912" y2="760" stroke="#5a4a36" stroke-width="2"/><rect x="866" y="756" width="92" height="6" fill="#6b2a24"/>`;
    for (let l = 0; l < 4; l++) g += `<rect x="874" y="${730 + l * 7}" width="${24 + l * 3}" height="2" fill="#5a5245"/><rect x="918" y="${730 + l * 7}" width="${28 - l * 2}" height="2" fill="#5a5245"/>`;

    // infirmary cot (1150..1560 x 680..800) with IV stand
    g += `<rect x="1170" y="740" width="360" height="12" fill="#5d6268"/><rect x="1180" y="752" width="10" height="56" fill="#3d4146"/><rect x="1510" y="752" width="10" height="56" fill="#3d4146"/>`;
    g += `<rect x="1170" y="706" width="360" height="36" rx="6" fill="#c9c4b4"/><rect x="1180" y="694" width="90" height="26" rx="10" fill="#e8e3d4"/><path d="M1300 706 h 220 v 30 h -220z" fill="#6b7b6e" opacity="0.9"/>`;
    g += `<line x1="1550" y1="560" x2="1550" y2="808" stroke="#9aa0a6" stroke-width="5"/><rect x="1532" y="566" width="30" height="44" rx="6" fill="#cfe3ea" opacity="0.8"/><line x1="1547" y1="610" x2="1500" y2="716" stroke="#cfe3ea" stroke-width="2" opacity="0.7"/>`;
    g += `<rect x="1170" y="790" width="40" height="40" fill="#e3dccb"/><path d="M1184 798 h12 v10 h10 v12 h-10 v10 h-12 v-10 h-10 v-12 h10z" fill="#b8322a"/>`;

    // armchair in the left foreground
    g += `<path d="M30 900 V 720 q 0 -40 40 -40 h 220 q 40 0 40 40 V 900z" fill="${S.trim}"/><rect x="60" y="770" width="240" height="60" rx="14" fill="#3b2b25" opacity="0.8"/>`;

    g += `<rect width="${W}" height="${H}" filter="url(#grain)"/><rect width="${W}" height="${H}" fill="url(#vig)"/>`;
    return svgUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${g}</svg>`);
  }
  const roomCache = {};
  HIDE.room = (id = eraId()) => roomCache[id] || (roomCache[id] = roomSvg(id));

  /* Splash backdrops for leaving the hideout: a street in the right century. */
  const OUTSIDE = { medieval: "village", victorian: "fog", wars: "fog", atomic: "street", modern: "modern", now: "future" };
  HIDE.outside = (id = eraId()) => U.img(A.scene(OUTSIDE[id] || "street", "hideout-out"));

  /* ------------------------------------------------------------ places in the room
     x, y, w, h in percent of the drawing. go: a hub tab, or an action below. */
  const PLACES = () => {
    const S = style();
    return [
      { id: "board",  label: "Case board", ic: "▦", jp: "事件", x: 5, y: 16.7, w: 21.3, h: 31, go: "missions", hint: "Take a case" },
      { id: "armory", label: "Armory", ic: "⚔", jp: "武器", x: 28.7, y: 24.4, w: 12, h: 46.7, go: "quarter", hint: "Gear, weapons and kit" },
      { id: "door",   label: "Go out", ic: "➜", jp: "外出", x: 43, y: 33, w: 7.6, h: 38, go: "out", hint: "Visit someone, work contacts" },
      { id: "phone",  label: S.phone, ic: "☎", jp: "電話", x: 50.6, y: 38, w: 4.4, h: 15, go: "patrons", hint: "Patrons" },
      { id: "archive",label: "Archive", ic: "▤", jp: "書庫", x: 55, y: 16.7, w: 14.4, h: 54.4, go: "library", hint: "Rules library" },
      { id: "vault",  label: S.vault, ic: "◎", jp: "金庫", x: 70.3, y: 38.3, w: 11.9, h: 21.1, go: "artifacts", hint: "Artifacts" },
      { id: "garage", label: S.garage, ic: "▣", jp: "車庫", x: 83.7, y: 27, w: 15, h: 44, go: "home", hint: "Housing and vehicles" },
      { id: "table",  label: "Common table", ic: "☕", jp: "食卓", x: 30, y: 76, w: 23, h: 15, go: "table", hint: "Spend the evening together" },
      { id: "log",    label: "Case log", ic: "✎", jp: "日誌", x: 53.5, y: 78.5, w: 7, h: 7, go: "log", hint: "What has happened" },
      { id: "cot",    label: "Infirmary", ic: "✚", jp: "医務", x: 72, y: 75, w: 26, h: 16, go: "rest", hint: "Rest and recover" }
    ];
  };

  const go = (p) => {
    U.click();
    if (p.go === "out") return HIDE.outMenu();
    if (p.go === "table") return HIDE.tableMenu();
    if (p.go === "rest") return HIDE.restMenu();
    ui.hub(p.go);
  };

  /* ------------------------------------------------------------ the party, JRPG style */
  const mood = (a) => {
    const pct = (k) => a.pools[k].cur / a.pools[k].max;
    if (a.pending > 0) return ["Ready to level up", "up"];
    if (a.doomed != null) return ["Dying", "bad"];
    if (pct("health") < 0.4) return ["Badly hurt", "bad"];
    if (pct("sanity") < 0.4) return ["Shaken", "bad"];
    if (pct("stability") < 0.4) return ["Unsteady", "bad"];
    if ((a.injuries || []).length) return ["Carrying an injury", "warn"];
    if (POOLS.every((k) => pct(k) >= 1)) return ["Ready", "ok"];
    return ["Recovering", "warn"];
  };
  const partyCard = (a, sel) => {
    const [m, cls] = mood(a);
    return el("button", { class: "pcard" + (sel ? " on" : ""), "aria-pressed": sel ? "true" : "false", onclick: () => { U.click(); CAMP.sel = a.id; ui.hub(); } },
      el("img", { class: "pface", src: ui.portraitSrc(a), alt: "" }),
      el("div", { class: "pinfo" },
        el("div", { class: "pname" }, el("b", {}, a.name), el("small", {}, `Lv ${a.level} · ${a.background || a.role || "Agent"}`)),
        el("div", { class: "pools" }, ...POOLS.map((k) => ui.bar(a.pools[k], k))),
        el("small", { class: "pmood " + cls }, m),
        el("div", { class: "pfoot" }, HIDE.pips(HIDE.left(a), HIDE.max(a)),
          a.ownerUid ? el("span", { class: "premote" + (window.LIVE && LIVE.seat(a.ownerUid) && LIVE.seat(a.ownerUid).ready ? " ready" : "") }, window.LIVE && LIVE.seat(a.ownerUid) && LIVE.seat(a.ownerUid).ready ? "Player ready" : "Live player") : null)));
  };

  /* ------------------------------------------------------------ the hideout tab */
  HIDE.tab = () => {
    const c = CAMP.camp, S = style(), ag = CAMP.agency(), sel = ui.selected();
    const wrap = el("div", { class: "hideout" });
    const places = PLACES();
    const scene = el("div", { class: "hroom" },
      el("img", { class: "hbg", src: HIDE.room(), alt: `The ${ag.short} ${S.name.toLowerCase()}` }),
      el("div", { class: "hday" }, el("b", {}, `${ag.short} ${S.name}`), el("span", {}, `Day ${c.day} · ${c.year}`)),
      ...places.map((p) => el("button", { class: "hspot", "data-place": p.id, style: { left: p.x + "%", top: p.y + "%", width: p.w + "%", height: p.h + "%" }, "aria-label": `${p.label}: ${p.hint}`, onclick: () => go(p) },
        el("span", { class: "htag" }, el("i", {}, p.ic), p.label))));
    wrap.append(scene);
    // the same places as a plain list, for phones and keyboards
    wrap.append(el("nav", { class: "hlist", "aria-label": "Places in the hideout" }, ...places.map((p) => el("button", { class: "hitem", onclick: () => go(p) }, el("i", {}, p.ic), el("b", {}, p.label), el("small", {}, p.hint)))));
    const act = CAMP.active();
    wrap.append(el("h3", { class: "sect" }, "The team"));
    wrap.append(el("div", { class: "party" }, ...act.map((a) => partyCard(a, sel && a.id === sel.id)),
      el("button", { class: "pcard add", onclick: () => ui.creator(null, () => ui.hub("hideout")) }, el("span", { class: "plus" }, "+"), el("b", {}, "Recruit an agent"))));
    const rule = el("select", { onchange: (e) => { c.rules.downtime = +e.target.value; for (const a of CAMP.active()) { const d = HIDE.dt(a), used = d.max - d.left; const n = c.rules.downtime || 3; a.dt = { max: n, left: Math.max(0, n - used) }; } CAMP.save(); ui.hub(); } },
      ...[1, 2, 3, 4, 5, 6, 0].map((n) => el("option", { value: String(n), selected: houseMax() === n ? "selected" : null }, n === 0 ? "No limit" : `${n} per break`)));
    wrap.append(el("div", { class: "row hfoot" }, sel ? ui.btn(`Open ${sel.short}'s file`, () => ui.hub("agents"), "ghost small") : null,
      el("label", { class: "field inline" }, el("span", {}, "Downtime between jobs"), rule)));
    return wrap;
  };

  /* ------------------------------------------------------------ downtime budget
     Between jobs each agent gets a few downtime actions (3 by default). An adventure
     can set its own number with M.downtime; the campaign's house rule is
     camp.rules.downtime (0 means no limit). Evenings at the table are free. */
  const houseMax = () => { const r = (CAMP.camp && CAMP.camp.rules) || {}; return r.downtime != null ? r.downtime : 3; };
  const unlimited = () => houseMax() === 0;
  HIDE.dt = (a) => { if (!a.dt) a.dt = { left: houseMax() || 3, max: houseMax() || 3 }; return a.dt; };
  HIDE.left = (a) => (unlimited() ? Infinity : HIDE.dt(a).left);
  HIDE.max = (a) => (unlimited() ? Infinity : HIDE.dt(a).max);
  HIDE.resetDowntime = (n) => { for (const a of CAMP.active()) a.dt = { left: n, max: n }; };
  const spend = (a) => { if (!unlimited()) HIDE.dt(a).left = Math.max(0, HIDE.dt(a).left - 1); };
  HIDE.pips = (left, max) => max === Infinity || max == null ? el("span", { class: "dtpips" }, "Downtime: no limit")
    : el("span", { class: "dtpips", title: `${left} of ${max} downtime actions left` }, "Downtime ", ...Array.from({ length: max }, (_, i) => el("i", { class: i < left ? "on" : "" })));
  const costTag = (days) => `1 action · ${days} day${days > 1 ? "s" : ""}`;

  /* a fresh break after every case */
  const origDebrief = CAMP.debrief;
  CAMP.debrief = function (r) {
    const M = window.MODULE;
    const n = M && M.downtime != null ? M.downtime : houseMax() || 3;
    HIDE._pendingReset = n;
    return origDebrief.apply(this, arguments);
  };
  /* the reset runs before the debrief screen is drawn, so live tables send the fresh budget home too */
  const origUiDebrief = ui.debrief;
  ui.debrief = function (out) {
    const n = HIDE._pendingReset;
    if (n != null) {
      HIDE.resetDowntime(n); HIDE._pendingReset = null; CAMP.save();
      out.lines.push(unlimited() ? "Between jobs: downtime has no limit in this campaign." : `Between jobs: each agent has ${n} downtime action${n === 1 ? "" : "s"} before the next case.`);
    }
    return origUiDebrief.apply(this, arguments);
  };

  /* ------------------------------------------------------------ activity sheets */
  const strip = (reopen) => {
    const sel = ui.selected();
    return el("div", { class: "agentstrip" }, ...CAMP.active().map((a) => el("button", { class: "agentchip" + (sel && a.id === sel.id ? " on" : ""), onclick: () => { CAMP.sel = a.id; U.closeModal(null); reopen(); } },
      el("img", { src: ui.portraitSrc(a), alt: "" }), el("span", {}, a.short))));
  };
  const actList = (items) => el("div", { class: "hacts" }, ...items.map((it) => el("button", { class: "hact", disabled: it.disabled ? "disabled" : null, onclick: () => { U.click(); U.closeModal(null); it.run(); } },
    el("b", {}, it.label), el("small", {}, it.hint || ""), it.cost ? el("span", { class: "hcost" }, it.cost) : null)));
  const budgetNote = (a) => HIDE.left(a) > 0 ? el("div", { class: "dtline" }, HIDE.pips(HIDE.left(a), HIDE.max(a)))
    : el("div", { class: "dtline spent" }, HIDE.pips(0, HIDE.max(a)), el("span", {}, `${a.short} has done all they can before the next job. Take a case from the board.`));
  const chooser = (title, jp, intro, reopen, items) => {
    const a = ui.selected(), out = HIDE.left(a) <= 0;
    U.modal({ title, jp, cls: "hmodal", body: el("div", {}, el("p", { class: "cnote" }, intro), strip(reopen), budgetNote(a), actList(items.map((it) => ({ ...it, disabled: it.disabled || (out && it.cost) })))) });
  };

  /* menu entries for an agent; also used by live-table players on their own devices */
  HIDE.options = (a) => {
    const asp = (k) => R.aspect(a, k);
    return {
      rest: [
        { act: "natural", label: "Rest a day", hint: `Natural Recovery: about +${2 + asp("humors")} Health, +${1 + asp("mindfulness")} Sanity`, cost: costTag(1) },
        { act: "meditate", label: "Meditate a day", hint: `About +${1 + asp("potency")} Stability, +${1 + asp("mindfulness")} Sanity`, cost: costTag(1) },
        { act: "week", label: "Rest a week", hint: "Seven days of Natural Recovery", cost: costTag(7) }
      ],
      out: [
        ...a.bonds.map((b, i) => ({ act: "visit", bond: i, label: `Visit ${b.name}`, hint: `${b.rel}${window.BONDS && !BONDS.def(b).rels.includes(b.rel) && BONDS.def(b).label !== b.rel ? ` (${BONDS.def(b).label.toLowerCase()})` : ""} · bond ${b.value}. Restores some Sanity.`, cost: costTag(1) })),
        { act: "contacts", label: "Work contacts", hint: `Call in debts for a Favor. The team has ${CAMP.camp.favors.length}.`, cost: costTag(2) }
      ]
    };
  };

  HIDE.restMenu = () => {
    const a = ui.selected(); if (!a) return;
    chooser("Infirmary", "医務室", `${a.short}: Health ${a.pools.health.cur}/${a.pools.health.max}, Sanity ${a.pools.sanity.cur}/${a.pools.sanity.max}, Stability ${a.pools.stability.cur}/${a.pools.stability.max}.`, HIDE.restMenu,
      [...HIDE.options(a).rest.map((o) => ({ ...o, run: () => HIDE.run(a, o.act) })), { label: "Medicine, services and more", hint: "The full Downtime screen", run: () => ui.hub("downtime") }]);
  };

  HIDE.outMenu = () => {
    const a = ui.selected(); if (!a) return;
    chooser("Go out", "外出", `Where does ${a.short} go?`, HIDE.outMenu, HIDE.options(a).out.map((o) => ({ ...o, run: () => HIDE.run(a, o.act, { bond: o.bond }) })));
  };

  const TABLE_ACTS = [
    { id: "meal", label: "Share a meal" },
    { id: "stories", label: "Swap stories" },
    { id: "game", label: () => `Play ${words().game}` },
    { id: "gear", label: "Clean and check gear" },
    { id: "spar", label: "Spar" }
  ];
  HIDE.tableMenu = () => {
    const a = ui.selected(); if (!a) return;
    const others = CAMP.active().filter((x) => x.id !== a.id);
    let partner = others[0] || null;
    const pSel = others.length ? el("select", { onchange: (e) => { partner = others.find((x) => x.id === e.target.value); } }, ...others.map((x) => el("option", { value: x.id }, x.name))) : null;
    const items = others.length
      ? TABLE_ACTS.map((t) => ({ label: typeof t.label === "function" ? t.label() : t.label, hint: "An evening: free, no time lost", run: () => HIDE.evening(a, partner, t.id) }))
      : [{ label: "Sit with your thoughts", hint: "An evening alone: free, no time lost", run: () => HIDE.evening(a, null, "alone") }];
    U.modal({ title: "Common table", jp: "食卓", cls: "hmodal", body: el("div", {}, el("p", { class: "cnote" }, "Evenings at the table don't use downtime and change no numbers. They are for the story: who these people are when nothing is chasing them."),
      strip(HIDE.tableMenu), pSel ? el("label", { class: "field" }, el("span", {}, `${a.short} spends the evening with`), pSel) : null, actList(items)) });
  };

  /* ------------------------------------------------------------ activities (same rules as the Downtime tab) */
  const snap = (a) => Object.fromEntries(POOLS.map((k) => [k, a.pools[k].cur]));
  const diff = (a, before) => POOLS.map((k) => ({ k, v: a.pools[k].cur - before[k] })).filter((x) => x.v);
  const dayKick = (from, to) => (to > from ? `Day ${from} → Day ${to}` : `Day ${from}`);
  const face = (a) => ({ short: a.short, src: ui.portraitSrc(a) });

  /* Apply one downtime action and return the splash to show (or null if it can't be done).
     Plain data only, so a live table can send it to the player who asked for it. */
  HIDE.apply = (a, act, o = {}) => {
    const c = CAMP.camp;
    if (!a || a.status !== "active" || HIDE.left(a) <= 0) return null;
    const d0 = c.day, before = snap(a), era = eraId();
    let spec;
    if (act === "natural" || act === "meditate" || act === "week") {
      const days = act === "week" ? 7 : 1, mode = act === "meditate" ? "meditate" : "natural", notes = [];
      for (let i = 0; i < days; i++) {
        const g = CAMP.restDay(a, { mode, ...(o.opts || {}) });
        if (g && g.note) notes.push(g.note);
        notes.push(...CAMP.passDays(1));
        if (a.status !== "active") break;
      }
      CAMP.logAdd(`${a.name} ${mode === "meditate" ? "meditated" : "rested"} ${days} day${days > 1 ? "s" : ""}.`);
      spec = { bg: "room", title: act === "meditate" ? "Meditation" : act === "week" ? "A quiet week" : "Rest", jp: act === "meditate" ? "瞑想" : "休息",
        lines: [fill(pick(LINES[act]), ctx(a))], results: diff(a, before), notes };
    } else if (act === "visit") {
      const b = a.bonds[o.bond]; if (!b) return null;
      const bv = b.value;
      a.pools.sanity.cur = Math.min(a.pools.sanity.max, a.pools.sanity.cur + 3); b.value = Math.min(20, b.value + 1);
      const notes = CAMP.passDays(1);
      CAMP.logAdd(`${a.name} spent a day with ${b.name}.`);
      const res = diff(a, before);
      if (b.value !== bv) res.push({ label: `Bond with ${b.name} ${bv} → ${b.value}` });
      const x = ctx(a, { b: b.name.split(" ")[0], rel: (b.rel || "an old friend").toLowerCase() });
      const tl = window.BONDS ? BONDS.lines(b, o.activity, pick) : [pick(LINES.visit)];
      const bf = window.BONDS ? BONDS.face(a, b) : null;
      spec = { bg: "out", title: b.name, jp: "絆", lines: tl.map((t) => fill(t, x)), results: res, notes, bondFace: bf };
    } else if (act === "contacts") {
      c.favors.push({ wc: 1, from: "Contacts" });
      const notes = CAMP.passDays(2);
      CAMP.logAdd(`${a.name} worked contacts for a Favor.`);
      spec = { bg: "out", title: "Working contacts", jp: "人脈", lines: [fill(pick(LINES.contacts), ctx(a))], results: [{ label: `+1 Favor (Mundane) · ${c.favors.length} total` }], notes };
    } else return null;
    spend(a);
    const left = HIDE.left(a);
    spec.results.push({ label: left === Infinity ? "Downtime: no limit" : left > 0 ? `${left} downtime action${left > 1 ? "s" : ""} left` : "Downtime spent: ready for the next job" });
    CAMP.save();
    return { ...spec, era, kicker: dayKick(d0, c.day), who: [face(a), spec.bondFace].filter(Boolean) };
  };

  /* a visit first asks how the day is spent (js/bonds.js); the rules effect is the same whatever is chosen */
  HIDE.visitMenu = (a, i) => {
    const b = a.bonds[i]; if (!b || !window.BONDS) return HIDE.run(a, "visit", { bond: i, activity: "_" });
    const d = BONDS.def(b);
    chooser(`A day with ${b.name}`, "絆", `${b.rel || d.label} · bond ${b.value}. How do they spend it?`, HIDE.outMenu,
      BONDS.acts(b).map((x) => ({ label: x.label, hint: "1 action · 1 day", run: () => HIDE.run(a, "visit", { bond: i, activity: x.id }) })));
  };
  HIDE.run = async (a, act, o = {}) => {
    if (act === "visit" && !o.activity && window.BONDS) return HIDE.visitMenu(a, o.bond);
    if (HIDE.left(a) <= 0) { U.toast(`${a.short} has used all their downtime. Take the next job from the case board.`); return; }
    const spec = HIDE.apply(a, act, o);
    if (!spec) return;
    await HIDE.splash(spec);
    ui.hub();
  };
  /* older entry points, still used by the Downtime tab */
  HIDE.rest = (a, mode, days = 1, opts = {}) => HIDE.run(a, days > 1 ? "week" : mode === "meditate" ? "meditate" : "natural", { opts });
  HIDE.visit = (a, b) => HIDE.run(a, "visit", { bond: a.bonds.indexOf(b) });
  HIDE.contacts = (a) => HIDE.run(a, "contacts");

  HIDE.evening = async (a, p, kind) => {
    const w = p ? pick([a.short, p.short]) : a.short;
    const line = fill(pick(LINES[kind]), ctx(a, p ? { p: p.short, pw: (p.weapon && p.weapon.name) || "weapon", w } : {}));
    CAMP.logAdd(line);
    CAMP.save();
    const t = TABLE_ACTS.find((x) => x.id === kind);
    await HIDE.splash({ bg: "room", kicker: `Day ${CAMP.camp.day} · evening`, title: t ? (typeof t.label === "function" ? t.label() : t.label) : "An evening alone", jp: "夜", who: (p ? [a, p] : [a]).map(face), lines: [line], results: [{ label: "Free: no downtime used" }] });
    ui.hub();
  };

  /* the Downtime tab shows the same budget */
  const origDowntime = ui.tabs.downtime;
  ui.tabs.downtime = () => { const w = origDowntime(), a = ui.selected(); if (a && w.children.length > 1) w.insertBefore(budgetNote(a), w.children[1]); return w; };

  /* ------------------------------------------------------------ the splash scene */
  HIDE.splash = (o) => new Promise((resolve) => {
    AudioMan.sfx("page_turn");
    const bg = o.bg === "room" ? HIDE.room(o.era) : o.bg === "out" ? HIDE.outside(o.era) : o.bg;
    const lines = [...(o.lines || []), ...(o.notes || [])].filter(Boolean);
    const lineEls = lines.map((t, i) => el("p", { class: "sline" + (i >= (o.lines || []).length ? " snote" : "") }, t));
    const chips = (o.results || []).map((r) => r.k
      ? el("span", { class: "schip " + r.k }, `${r.v > 0 ? "+" : ""}${r.v} ${R.POOL_LABEL[r.k]}`)
      : el("span", { class: "schip" }, r.label));
    if (!chips.length && o.results) chips.push(el("span", { class: "schip" }, "Already at full strength"));
    const cont = el("button", { class: "btn primary scont" }, "Continue");
    const res = el("div", { class: "sres" }, ...chips);
    const box = el("div", { class: "splash", role: "dialog", "aria-modal": "true", "aria-label": o.title },
      el("img", { class: "sbg", src: bg, alt: "" }), el("div", { class: "sveil" }),
      el("div", { class: "scard" },
        o.jp ? el("span", { class: "sjp jp", lang: "ja", "aria-hidden": "true" }, o.jp) : null,
        el("p", { class: "skick" }, o.kicker || ""),
        el("h2", { class: "stitle" }, o.title),
        el("div", { class: "sfaces" }, ...(o.who || []).map((a) => el("figure", {}, el("img", { src: a.src || ui.portraitSrc(a), alt: "" }), el("figcaption", {}, a.short)))),
        el("div", { class: "slines" }, ...lineEls), res, cont));
    document.body.append(box);
    const reduced = U.reduced();
    const steps = [...lineEls, res, cont];
    let i = 0, timer = null;
    const showNext = () => { if (i < steps.length) { steps[i++].classList.add("in"); timer = setTimeout(showNext, reduced ? 0 : i === 1 ? 500 : 900); } };
    const showAll = () => { clearTimeout(timer); while (i < steps.length) steps[i++].classList.add("in"); };
    const done = () => { clearTimeout(timer); document.removeEventListener("keydown", key); box.classList.add("out"); setTimeout(() => { box.remove(); resolve(); }, reduced ? 0 : 250); };
    const key = (e) => { if (e.key === "Enter" || e.key === " " || e.key === "Escape") { e.preventDefault(); if (i < steps.length) showAll(); else done(); } };
    box.addEventListener("click", (e) => { if (e.target === cont && i >= steps.length) return done(); if (i < steps.length) showAll(); });
    document.addEventListener("keydown", key);
    requestAnimationFrame(() => { box.classList.add("on"); timer = setTimeout(showNext, reduced ? 0 : 450); cont.focus({ preventScroll: true }); });
  });

  ui.tabs.hideout = HIDE.tab;
})();
