/* ============================================================================
   FIGHT FX — the look of a fight. Nothing here touches the rules: it watches
   the fight board (js/combat.js) and dresses it.
     - a face-off card when a fight opens: the enemies large, with their names
     - zones you can see the backdrop through, bigger tokens
     - a banner for each turn and each new round
     - hits: the token shakes and flashes, a burst of colour by damage type,
       the screen jolts on a heavy blow and reddens when an agent is hurt
     - enemies dissolve when they're destroyed
   Respects "reduce motion" (U.reduced()).
   ========================================================================== */
(function () {
  const U = window.UI; if (!U) return;
  const el = U.el;
  const reduced = () => (U.reduced ? U.reduced() : false);
  let lastActive = "", lastRound = "", seenFoes = new Map(), inFight = false;

  /* ---------------------------------------------------------------- the face-off */
  const faceOff = () => {
    const toks = [...document.querySelectorAll("#board .token.enemy")];
    if (!toks.length) return;
    const uniq = []; const names = new Set();
    for (const t of toks) { const n = (t.querySelector(".tname") || {}).textContent || ""; const img = t.querySelector("img"); if (!names.has(n) && img) { names.add(n); uniq.push({ n, src: img.src, boss: t.classList.contains("boss") }); } }
    const count = toks.length;
    const title = (document.querySelector("#loc-name") || {}).textContent || "";
    const box = el("div", { class: "faceoff", role: "dialog", "aria-label": `Fight: ${title}` },
      el("div", { class: "fo-slash" }),
      el("div", { class: "fo-foes" }, ...uniq.slice(0, 4).map((f, i) => el("figure", { class: "fo-foe" + (f.boss ? " boss" : ""), style: { animationDelay: `${0.15 + i * 0.12}s` } },
        el("img", { src: f.src, alt: "" }), el("figcaption", {}, f.n)))),
      el("div", { class: "fo-text" }, el("span", { class: "fo-kick" }, count > 1 ? `${count} enemies` : "Enemy"), el("b", {}, title), el("span", { class: "fo-hint" }, "Click to fight")));
    document.body.append(box);
    const close = () => { if (!box.isConnected) return; box.classList.add("out"); setTimeout(() => box.remove(), 350); };
    box.addEventListener("click", close);
    setTimeout(close, reduced() ? 600 : 2600);
  };

  /* ---------------------------------------------------------------- banners */
  const banner = (text, cls) => {
    const host = document.querySelector("#scene"); if (!host) return;
    host.querySelectorAll(".fbanner").forEach((b) => b.remove());
    const b = el("div", { class: "fbanner " + cls }, el("span", {}, text));
    host.append(b);
    setTimeout(() => b.remove(), reduced() ? 700 : 1500);
  };

  /* ---------------------------------------------------------------- hits */
  const burst = (tok, kind) => {
    const r = el("span", { class: "fhit " + kind });
    tok.append(r); setTimeout(() => r.remove(), 600);
  };
  const jolt = (strong) => {
    const s = document.querySelector("#scene"); if (!s || reduced()) return;
    s.classList.remove("fshake", "fshake2"); void s.offsetWidth; s.classList.add(strong ? "fshake2" : "fshake");
    setTimeout(() => s.classList.remove("fshake", "fshake2"), 500);
  };
  const redden = () => {
    const s = document.querySelector("#scene"); if (!s) return;
    s.classList.remove("fhurt"); void s.offsetWidth; s.classList.add("fhurt"); setTimeout(() => s.classList.remove("fhurt"), 700);
  };
  const onFloat = (f) => {
    const tok = f.closest(".token"); if (!tok) return;
    const kind = ["health", "sanity", "stability", "heal", "zero"].find((k) => f.classList.contains(k)) || "health";
    const n = Math.abs(parseInt(f.textContent, 10)) || 0;
    tok.classList.remove("fstruck"); void tok.offsetWidth; tok.classList.add("fstruck"); setTimeout(() => tok.classList.remove("fstruck"), 450);
    if (kind === "heal" || kind === "zero") return;
    burst(tok, kind);
    if (tok.classList.contains("agent") || tok.classList.contains("ally")) { redden(); jolt(n >= 5); }
    else if (n >= 6) jolt(false);
  };

  /* ---------------------------------------------------------------- deaths: an enemy whose token is gone dissolves where it stood */
  const dissolve = (info) => {
    const board = document.querySelector("#board"); if (!board || !info.rect) return;
    const br = board.getBoundingClientRect();
    const g = el("img", { class: "fdie", src: info.src, alt: "", style: { left: `${info.rect.left - br.left + board.scrollLeft}px`, top: `${info.rect.top - br.top + board.scrollTop}px`, width: `${info.rect.width}px` } });
    board.append(g); setTimeout(() => g.remove(), 1400);
  };

  /* ---------------------------------------------------------------- watching the board */
  const scan = () => {
    const board = document.querySelector("#board"); if (!board || board.hidden) return;
    const now = board.querySelector(".initbar .ini.now");
    const rnd = (board.querySelector(".initbar .rnd") || {}).textContent || "";
    if (rnd && rnd !== lastRound) { if (lastRound) banner(rnd, "round"); lastRound = rnd; }
    if (now) {
      const key = rnd + "|" + now.textContent;
      if (key !== lastActive) { lastActive = key; const foe = now.classList.contains("foe"); setTimeout(() => banner(foe ? `${now.textContent} moves` : `${now.textContent}'s turn`, foe ? "foe" : "ally"), 120); }
    }
    const present = new Map();
    for (const t of board.querySelectorAll(".token.enemy")) {
      const img = t.querySelector("img"); const r = t.getBoundingClientRect();
      present.set(t.dataset.uid, { src: img ? img.src : "", rect: r.width ? r : (seenFoes.get(t.dataset.uid) || {}).rect });
    }
    for (const [uid, info] of seenFoes) if (!present.has(uid)) dissolve(info);
    seenFoes = present;
  };

  const start = () => {
    const mode = document.body.dataset.mode;
    if (mode === "combat" && !inFight) {
      inFight = true; lastActive = ""; lastRound = ""; seenFoes = new Map();
      document.body.classList.add("fightfx");
      setTimeout(() => { scan(); faceOff(); }, 60);
    } else if (mode !== "combat" && inFight) {
      inFight = false; document.body.classList.remove("fightfx");
      document.querySelectorAll(".faceoff, .fbanner").forEach((x) => x.remove());
    }
  };
  document.addEventListener("DOMContentLoaded", () => {
    new MutationObserver(start).observe(document.body, { attributes: true, attributeFilter: ["data-mode"] });
    const watch = () => {
      const board = document.querySelector("#board"); if (!board) return setTimeout(watch, 500);
      new MutationObserver((ms) => {
        if (!inFight) return;
        let rescan = false;
        for (const m of ms) for (const n of m.addedNodes) { if (n.nodeType !== 1) continue; if (n.classList.contains("floatnum")) onFloat(n); else rescan = true; }
        if (rescan) requestAnimationFrame(scan);
      }).observe(board, { childList: true, subtree: true });
    };
    watch();
  });
})();
