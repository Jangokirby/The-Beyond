/* ============================================================================
   PATRONS — the altar, the gift ceremony, and the patron's voice.

   Everything a patron says here is the book's own text: gift quotes, the
   deity's description, and its access/demands notes where the book has them.
   No new rules. Picture per patron: window.ASSETS.patrons[name] if present
   (the book's illustrations go there), otherwise a drawn idol.
   ========================================================================== */
(function () {
  const U = window.UI, el = U.el, CAMP = window.CAMP, ui = CAMP.ui, GD = window.GD;
  const P = (window.PATRONS = {});
  window.ASSETS.patrons = window.ASSETS.patrons || {};
  /* the rulebook's own illustrations, one per patron (assets/book/) */
  const bookSrc = (p) => (window.BOOK_DATA && window.BOOK_DATA[p]) || p;   // the hosted test pages carry the art packed into one file
  const slugOf = (n) => String(n).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  for (const d of (window.GD && GD.deities) || []) if (!window.ASSETS.patrons[d.name]) window.ASSETS.patrons[d.name] = bookSrc(`assets/book/${slugOf(d.name)}.jpg`);
  /* and the book's agents-against-the-dark piece on the title screen */
  window.ASSETS.scenes["book:title"] = bookSrc("assets/book/title.jpg");
  const scene0 = window.ART.scene;
  window.ART.scene = (theme, seed = "") => (seed === "title" ? "book:title" : scene0(theme, seed));
  const ph = (t) => (t || "").replace(/\s+/g, " ").trim();
  const def = (name) => GD.deities.find((d) => d.name === name);
  const tint = (node, c) => { node.style.setProperty("--pc", c); return node; };

  /* ------------------------------------------------------------ look per patron: motif + candle colour */
  const LOOK = {
    "God": ["halo", "#f3d68a"], "Devil": ["horns", "#d9442e"], "The Dead Mountain": ["mountain", "#a9b4c2"], "The False Machine": ["gear", "#7fd6c8"],
    "The Fate Abductor": ["dice", "#c9a5f0"], "The Gossip Worm": ["worm", "#e59ab0"], "The Gluttonous Slaver": ["maw", "#c8763a"], "The Kennel King": ["crown", "#d8b25a"],
    "The Late Prince": ["coffin", "#b9a6d8"], "The Laughing Man": ["grin", "#f0e46a"], "The Lost Sailor": ["anchor", "#79b6d8"], "The Master of Swords": ["swords", "#d0d4dc"],
    "The Moon": ["moon", "#dfe6ff"], "The Never Speak": ["book", "#9ad08e"], "The Order of the Golden Mask": ["mask", "#e2b84a"], "The Perfumed Host": ["rose", "#e07aa8"],
    "The Thing Between The Walls": ["eye", "#c4c08e"]
  };
  const motif = (m, c) => ({
    halo: `<circle cx="200" cy="120" r="70" fill="none" stroke="${c}" stroke-width="6" opacity=".8"/><circle cx="200" cy="120" r="88" fill="none" stroke="${c}" stroke-width="1.5" opacity=".4"/>`,
    horns: `<path d="M140 150 Q120 70 160 40 Q150 100 180 140Z M260 150 Q280 70 240 40 Q250 100 220 140Z" fill="${c}"/>`,
    mountain: `<path d="M90 200 L170 70 L200 110 L235 55 L320 200Z" fill="${c}" opacity=".85"/><path d="M170 70 L185 95 L160 100Z M235 55 L250 80 L222 84Z" fill="#fff" opacity=".6"/>`,
    gear: Array.from({ length: 10 }, (_, i) => `<rect x="192" y="35" width="16" height="26" fill="${c}" transform="rotate(${i * 36} 200 120)"/>`).join("") + `<circle cx="200" cy="120" r="62" fill="${c}"/><circle cx="200" cy="120" r="24" fill="#0a0a10"/>`,
    dice: `<rect x="150" y="70" width="100" height="100" rx="14" fill="${c}" transform="rotate(12 200 120)"/>` + [[175, 95], [225, 95], [200, 120], [175, 145], [225, 145]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8" fill="#0a0a10" transform="rotate(12 200 120)"/>`).join(""),
    worm: `<path d="M110 170 Q140 60 200 120 T290 70" fill="none" stroke="${c}" stroke-width="26" stroke-linecap="round"/><circle cx="290" cy="70" r="6" fill="#0a0a10"/>`,
    maw: `<ellipse cx="200" cy="125" rx="95" ry="70" fill="${c}"/><ellipse cx="200" cy="130" rx="70" ry="42" fill="#0a0a10"/>` + Array.from({ length: 9 }, (_, i) => `<path d="M${140 + i * 15} 92 l7 18 l7 -18Z" fill="#eee"/>`).join(""),
    crown: `<path d="M120 170 L120 90 L160 130 L200 70 L240 130 L280 90 L280 170Z" fill="${c}"/><path d="M110 170 h180 v18 h-180Z" fill="${c}" opacity=".7"/>`,
    coffin: `<path d="M170 30 L230 30 L255 80 L235 210 L165 210 L145 80Z" fill="${c}" opacity=".85"/><path d="M200 60 v60 M178 85 h44" stroke="#0a0a10" stroke-width="7"/>`,
    grin: `<path d="M90 110 Q200 250 310 110 Q200 160 90 110Z" fill="#0a0a10" stroke="${c}" stroke-width="4"/>` + Array.from({ length: 11 }, (_, i) => `<path d="M${112 + i * 17} ${118 + Math.sin(i / 10 * Math.PI) * 22} l8 22 l8 -22Z" fill="${c}"/>`).join("") + `<path d="M140 70 q25 -18 50 0 M210 70 q25 -18 50 0" stroke="${c}" stroke-width="6" fill="none" stroke-linecap="round"/>`,
    anchor: `<circle cx="200" cy="55" r="16" fill="none" stroke="${c}" stroke-width="9"/><path d="M200 71 V195 M150 100 H250 M120 150 Q130 200 200 195 Q270 200 280 150" fill="none" stroke="${c}" stroke-width="11" stroke-linecap="round"/>`,
    swords: `<path d="M120 200 L270 40 M280 200 L130 40" stroke="${c}" stroke-width="10" stroke-linecap="round"/><path d="M150 150 l30 30 M250 150 l-30 30" stroke="${c}" stroke-width="16"/>`,
    moon: `<circle cx="200" cy="120" r="80" fill="${c}"/><circle cx="235" cy="100" r="75" fill="#0a0a10"/>`,
    book: `<path d="M110 70 Q160 55 200 75 Q240 55 290 70 V190 Q240 175 200 195 Q160 175 110 190Z" fill="${c}"/><path d="M200 75 V195" stroke="#0a0a10" stroke-width="4"/><circle cx="160" cy="120" r="15" fill="#0a0a10"/><circle cx="240" cy="120" r="15" fill="#0a0a10"/>`,
    mask: `<path d="M120 70 Q200 40 280 70 Q290 160 200 210 Q110 160 120 70Z" fill="${c}"/><path d="M150 110 q20 -14 40 0 q-20 10 -40 0Z M210 110 q20 -14 40 0 q-20 10 -40 0Z" fill="#0a0a10"/><path d="M175 165 q25 10 50 0" stroke="#0a0a10" stroke-width="5" fill="none"/>`,
    rose: Array.from({ length: 7 }, (_, i) => `<ellipse cx="200" cy="110" rx="${70 - i * 9}" ry="${55 - i * 7}" fill="${c}" opacity="${0.35 + i * 0.09}" transform="rotate(${i * 25} 200 110)"/>`).join("") + `<path d="M200 165 V215" stroke="#3c6a3a" stroke-width="8"/>`,
    eye: `<path d="M90 120 Q200 30 310 120 Q200 210 90 120Z" fill="${c}"/><circle cx="200" cy="120" r="38" fill="#0a0a10"/><circle cx="212" cy="108" r="9" fill="${c}"/>`
  })[m] || "";
  P.idol = (name) => {
    if (window.ASSETS.patrons[name]) return window.ASSETS.patrons[name];
    const [m, c] = LOOK[name] || ["eye", "#c4c08e"];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240"><defs><radialGradient id="g" cx="50%" cy="50%" r="60%"><stop offset="0" stop-color="${c}" stop-opacity=".35"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient><filter id="b"><feGaussianBlur stdDeviation="2"/></filter></defs><rect width="400" height="240" fill="#07060a"/><circle cx="200" cy="120" r="140" fill="url(#g)"/><g filter="url(#b)" opacity=".35">${motif(m, c)}</g><g>${motif(m, c)}</g></svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  };
  P.color = (name) => (LOOK[name] || ["", "#c4c08e"])[1];

  /* ------------------------------------------------------------ a low drone while the altar is open */
  let drone = null;
  P.droneOn = () => {
    try {
      if (drone) return; const Ctx = window.AudioContext || window.webkitAudioContext; if (!Ctx) return;
      const ctx = (window.AudioMan && AudioMan.ctx) || new Ctx(); const g = ctx.createGain(); g.gain.value = 0; g.connect(ctx.destination);
      const vol = (window.GAME && GAME.settings ? GAME.settings.master * GAME.settings.music : 0.6) * 0.06;
      const oscs = [55, 55.7, 82.4].map((f) => { const o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = f; o.connect(g); o.start(); return o; });
      g.gain.linearRampToValueAtTime(vol, ctx.currentTime + 2);
      drone = { ctx, g, oscs };
    } catch (e) { drone = null; }
  };
  P.droneOff = () => { if (!drone) return; const { ctx, g, oscs } = drone; drone = null; try { g.gain.linearRampToValueAtTime(0, ctx.currentTime + 1); setTimeout(() => oscs.forEach((o) => o.stop()), 1200); } catch (e) {} };

  /* ------------------------------------------------------------ typing text out, as if whispered */
  const whisper = (node, text, speed = 28) => new Promise((res) => {
    node.textContent = ""; let i = 0;
    const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { node.textContent = text; return res(); }
    const t = setInterval(() => { node.textContent = text.slice(0, ++i); if (i >= text.length) { clearInterval(t); res(); } }, speed);
  });

  /* ------------------------------------------------------------ the gift ceremony */
  P.ceremony = (a, deity, giftNo, isNew) => new Promise((resolve) => {
    const d = def(deity), g = d.gifts.find((x) => x.number === giftNo);
    const c = P.color(deity);
    const quote = el("p", { class: "cq" }), body = el("div", { class: "cbody" });
    const cont = el("button", { class: "btn primary", hidden: true, onclick: () => { U.click(); shell.classList.add("out"); P.droneOff(); setTimeout(() => { shell.remove(); resolve(); }, 600); } }, "Rise");
    const skip = el("button", { class: "btn ghost small cskip", onclick: () => { quote.textContent = ph(g.quote); show(); } }, "Skip");
    const shell = el("div", { class: "ceremony", role: "dialog", "aria-label": `${deity}: ${g.name}` },
      el("div", { class: "candles" }, ...Array.from({ length: 7 }, (_, i) => el("i", { style: { left: 8 + i * 14 + "%", animationDelay: i * 0.37 + "s" } }))),
      el("div", { class: "cinner" },
        el("img", { class: "cidol", src: P.idol(deity), alt: "" }),
        el("small", { class: "ckicker" }, isNew ? `${a.name} kneels before` : `${a.name} is called back to`),
        el("h2", { class: "cname" }, deity), quote, body, el("div", { class: "row center" }, cont)), skip);
    tint(shell, c); document.body.append(shell);
    P.droneOn();
    let shown = false;
    const show = () => {
      if (shown) return; shown = true; skip.remove();
      body.append(...[el("h3", {}, `Gift ${g.number}: ${g.name}`), el("p", { class: "cdesc" }, ph(g.description)),
        el("div", { class: "ccost" }, el("b", {}, "What it gives, and what it takes"), el("p", {}, ph(g.effect))),
        (a.patrons || []).length > 1 && g.number === 2 ? el("p", { class: "cwarn" }, "You serve more than one master. This second gift is withheld while you do.") : null].filter(Boolean));
      cont.hidden = false; cont.focus();
    };
    requestAnimationFrame(() => shell.classList.add("in"));
    setTimeout(() => whisper(quote, ph(g.quote), 38).then(() => setTimeout(show, 500)), 900);
  });

  /* ------------------------------------------------------------ the altar tab */
  const tabs = ui.tabs;
  tabs.patrons = () => {
    const wrap = el("div", { class: "altarwrap" }), a = ui.selected();
    if (CAMP.active().length) wrap.append(el("div", { class: "agentstrip" }, ...CAMP.active().map((x) => el("button", { class: "agentchip" + (a && x.id === a.id ? " on" : ""), onclick: () => { U.click(); CAMP.sel = x.id; ui.hub("patrons"); } },
      el("img", { src: ui.portraitSrc(x), alt: "" }), el("span", {}, x.short), x.patrons && x.patrons.length ? el("i", { class: "pmark", style: { background: P.color(x.patrons[0].deity), color: P.color(x.patrons[0].deity) } }) : null))));
    if (!a) return wrap;
    const redraw = () => ui.hub("patrons");
    const multi = a.patrons.length > 1;
    if (multi) wrap.append(el("p", { class: "cnote warnline" }, `${a.short} serves ${a.patrons.length} patrons. Each of them withholds its second gift.`));
    for (const p of a.patrons) {
      const d = def(p.deity); if (!d) continue;
      const c = P.color(p.deity);
      const said = d.gifts.slice(0, p.gifts).map((g) => ph(g.quote)).filter(Boolean);
      const altar = tint(el("section", { class: "altar" },
        el("div", { class: "candles" }, ...Array.from({ length: 5 }, (_, i) => el("i", { style: { left: 6 + i * 22 + "%", animationDelay: i * 0.5 + "s" } }))),
        el("img", { class: "aidol", src: P.idol(p.deity), alt: `${p.deity}` }),
        el("div", { class: "atext" },
          el("small", { class: "akicker" }, d.pantheon || "The Beyond"),
          el("h3", {}, p.deity),
          said.length ? el("p", { class: "aquote" }, said.at(-1)) : null,
          el("details", { class: "alore" }, el("summary", {}, "What the archive says"), el("p", {}, ph(d.text)), d.access ? el("p", {}, el("b", {}, "Reaching it. "), ph(d.access)) : null, d.demands ? el("p", {}, el("b", {}, "What it asks. "), ph(d.demands)) : null),
          el("div", { class: "agifts" }, ...d.gifts.map((g) => {
            const has = g.number <= p.gifts, lost = multi && g.number === 2 && has;
            const pw = has && window.MECH ? window.MECH.powers(a).find((x) => x.deity === p.deity && x.n === g.number) : null;
            return el("div", { class: "agift" + (has ? " has" : " sealed") + (lost ? " lost" : "") },
              el("b", {}, has ? `${g.number} · ${g.name}` : `${g.number} · Sealed`),
              has ? el("small", {}, ph(g.effect)) : el("small", {}, "Not yet given."),
              pw && !lost ? el("small", { class: pw.kind === "narrative" ? "muted" : "good" }, pw.kind === "auto" ? "Use it from the Powers button in a mission." : pw.kind === "passive" ? "Always on." : "Costs paid automatically; the effect is ruled at the table.") : null,
              lost ? el("small", { class: "warn" }, "Withheld: you serve more than one patron.") : null);
          })),
          a.grants.patron > 0 && p.gifts < 3 ? ui.btn("Kneel for the next gift", async () => { p.gifts += 1; a.grants.patron -= 1; window.MECH.syncGifts(a); CAMP.logAdd(`${a.name} received ${def(p.deity).gifts[p.gifts - 1].name} from ${p.deity}.`); CAMP.save(); await P.ceremony(a, p.deity, p.gifts, false); redraw(); }, "primary") : null)), c);
      wrap.append(altar);
    }
    if (a.grants.patron > 0) {
      wrap.append(el("h3", { class: "sect" }, `Something is listening (${a.grants.patron} gift to give)`));
      wrap.append(el("p", { class: "cnote" }, "Choose who to kneel to. A patron's gifts are one of the five level-up benefits. Serving more than one costs you every patron's second gift."));
      wrap.append(el("div", { class: "shrines" }, ...GD.deities.filter((d) => !a.patrons.some((p) => p.deity === d.name)).map((d) =>
        tint(el("button", { class: "shrine", onclick: async () => {
          const r = await U.modal({ title: d.name, body: `<p>${ph(d.text)}</p><p class="small"><i>${ph(d.gifts[0].quote)}</i></p>`, buttons: [{ id: "no", label: "Not this one" }, { id: "yes", label: `Kneel to ${d.name}`, cls: "primary" }] });
          if (r !== "yes") return;
          a.patrons.push({ deity: d.name, gifts: 1 }); a.grants.patron -= 1; window.MECH.syncGifts(a); CAMP.logAdd(`${a.name} took ${d.name} as a patron.`); CAMP.save();
          await P.ceremony(a, d.name, 1, true); redraw();
        } }, el("img", { src: P.idol(d.name), alt: "" }), el("b", {}, d.name), el("small", {}, ph(d.gifts[0].quote))), P.color(d.name)))));
    } else if (!a.patrons.length) wrap.append(el("p", { class: "cnote" }, `${a.short} kneels to no one. A level-up benefit or the Zealot background lets something in.`));
    return wrap;
  };

  /* ------------------------------------------------------------ the patron's voice in a mission */
  const G = window.GAME;
  const servants = () => ((G.state && G.state.agents) || []).filter((x) => !x.dead).map((x) => ({ x, ch: x._campId && CAMP.char && CAMP.char(x._campId) })).filter((o) => o.ch && o.ch.patrons && o.ch.patrons.length);
  const goto0 = G.goto;
  G.goto = async function (id) {
    const r = await goto0.apply(this, arguments);
    try {
      const st = G.state; if (!st || st.phase === "ending") return r;
      st.voices = st.voices || { n: 0, seen: {} };
      const list = servants();
      if (list.length && st.voices.n < 3 && !st.voices.seen[id] && Math.random() < 0.3) {
        st.voices.seen[id] = 1; st.voices.n += 1;
        const o = list[Math.floor(Math.random() * list.length)], p = o.ch.patrons[Math.floor(Math.random() * o.ch.patrons.length)], d = def(p.deity);
        const g = d.gifts[Math.floor(Math.random() * Math.max(1, p.gifts))];
        U.print(`<span class="pvoice" style="--pc:${P.color(p.deity)}"><small>${p.deity}, to ${o.x.short}</small>${ph(g.quote)}</span>`, "narr voice");
      }
    } catch (e) {}
    return r;
  };

  /* ------------------------------------------------------------ in the hideout: the patrons stir */
  document.addEventListener("DOMContentLoaded", () => {
    if (!window.HIDE || !HIDE.tab) return;
    const tab0 = HIDE.tab;
    HIDE.tab = function () {
      const box = tab0.apply(this, arguments);
      try {
        const lines = CAMP.active().filter((a) => a.patrons && a.patrons.length).map((a) => { const p = a.patrons[0], d = def(p.deity); return { a, p, d, q: ph((d.gifts[p.gifts - 1] || d.gifts[0]).quote) }; });
        if (lines.length) {
          const pick = lines[(CAMP.camp.day || 0) % lines.length];
          const note = tint(el("button", { class: "pstir", onclick: () => { CAMP.sel = pick.a.id; ui.hub("patrons"); } },
            el("img", { class: "pstirimg", src: P.idol(pick.p.deity), alt: "" }),
            el("small", {}, `${pick.a.short}'s patron stirs`), el("span", {}, pick.q), pick.d.demands ? el("small", { class: "pdem" }, ph(pick.d.demands).slice(0, 140) + (ph(pick.d.demands).length > 140 ? "…" : "")) : null), P.color(pick.p.deity));
          const team = box.querySelector("h3.sect"); if (team) team.before(note); else box.append(note);
        }
      } catch (e) {}
      return box;
    };
    if (ui.tabs) ui.tabs.hideout = HIDE.tab;
  });
})();
