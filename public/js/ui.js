/* UI toolkit: story panel, choices, modals, dice tray, toasts, particles. */
(function () {
  const U = {};
  const $ = (s, r = document) => r.querySelector(s);
  U.$ = $;
  U.el = (tag, attrs = {}, ...kids) => {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v === undefined || v === null || v === false) continue;
      if (k === "class") e.className = v;
      else if (k === "html") e.innerHTML = v;
      else if (k.startsWith("on")) { e.addEventListener(k.slice(2), v); e._h = 1; }
      else if (k === "style" && typeof v === "object") Object.assign(e.style, v);
      else e.setAttribute(k, v === true ? "" : v);
    }
    for (const k of kids.flat()) if (k !== null && k !== undefined && k !== false) e.append(k.nodeType ? k : document.createTextNode(k));
    return e;
  };
  const el = U.el;
  U.img = (key, group = "scenes") => (window.ASSETS[group] || {})[key] || "";
  U.click = () => window.AudioMan && AudioMan.sfx("ui_click");
  /* Flavor: the interface is plain English. An adventure with flavor "jp" (set in its data) turns on
     Japanese labels and symbols while it runs; anything marked class="jp" only shows then. */
  U.flavor = (f) => { const on = f === "jp"; window.FLAVOR = { id: f || "", jp: on }; document.documentElement.classList.toggle("jp-flavor", on); };
  U.jpOr = (jp, plain) => (window.FLAVOR && window.FLAVOR.jp ? jp : plain);
  window.FLAVOR = { id: "", jp: false };
  U.reduced = () => window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  U.sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ---------------------------------------------------------------- story panel */
  U.story = () => $("#story");
  U.choicesBox = () => $("#choices");
  U.print = (html, cls = "", opts = {}) => {
    const box = U.story();
    const p = el("div", { class: "line " + cls, html });
    if (opts.who) {
      const n = opts.who;
      const head = el("div", { class: "speaker" },
        n.portrait ? el("span", { class: "chip", style: { backgroundImage: `url(${U.img(n.portrait, "portraits")})` } }) : null,
        el("b", {}, n.name), n.jp ? el("span", { class: "jp" }, n.jp) : null);
      p.prepend(head);
    }
    box.append(p);
    while (box.children.length > 80) box.firstChild.remove();
    requestAnimationFrame(() => { p.scrollIntoView({ block: "end", behavior: U.reduced() ? "auto" : "smooth" }); });
    return p;
  };
  U.clearChoices = () => { U.choicesBox().innerHTML = ""; };

  U.waitContinue = (label = "Continue") => new Promise((resolve) => {
    const box = U.choicesBox();
    box.innerHTML = "";
    const b = el("button", { class: "btn continue", id: "btn-continue", onclick: () => { U.click(); done(); } },
      el("span", {}, label), el("span", { class: "kbd" }, "▸"));
    const key = (e) => { if (e.key === "Enter" || e.key === " ") { if (document.activeElement && document.activeElement.tagName === "BUTTON" && document.activeElement !== b) return; e.preventDefault(); done(); } };
    function done() { document.removeEventListener("keydown", key); box.innerHTML = ""; resolve(); }
    box.append(b);
    document.addEventListener("keydown", key);
    if (!U.modalOpen()) b.focus({ preventScroll: true });
  });

  U.choose = (prompt, options) => new Promise((resolve) => {
    if (prompt) U.print(prompt, "prompt");
    const box = U.choicesBox();
    box.innerHTML = "";
    options.forEach((o, i) => {
      const b = el("button", { class: "btn choice" + (o.danger ? " danger" : ""), disabled: o.disabled, title: o.hint || null, "data-id": o.id != null ? String(o.id) : null,
        onclick: () => { U.click(); box.innerHTML = ""; if (o.echo !== false) U.print(o.label, "echo"); resolve(o.id); } },
        el("span", { class: "num" }, String(i + 1)), el("span", { class: "lbl" }, o.label),
        o.hint ? el("span", { class: "hint" }, o.hint) : null);
      box.append(b);
    });
    const first = box.querySelector("button:not([disabled])");
    if (first && !U.modalOpen() && matchMedia("(pointer:fine)").matches) first.focus({ preventScroll: true });
  });

  /* ---------------------------------------------------------------- modals */
  U.modalOpen = () => !!document.querySelector("#overlay .modal");
  U.modal = ({ title, jp, body, cls = "", buttons = [], dismiss = true, onClose }) => new Promise((resolve) => {
    const ov = $("#overlay");
    ov.hidden = false;
    const close = (v) => { ov.innerHTML = ""; ov.hidden = true; if (onClose) onClose(); resolve(v); document.removeEventListener("keydown", esc); };
    const esc = (e) => { if (e.key === "Escape" && dismiss) close(null); };
    document.addEventListener("keydown", esc);
    const m = el("div", { class: "modal " + cls, role: "dialog", "aria-modal": "true", "aria-label": title || "Dialog" });
    if (title) m.append(el("div", { class: "modal-head" }, el("h2", {}, title), jp ? el("span", { class: "jp" }, jp) : null,
      dismiss ? el("button", { class: "icon-btn close", "aria-label": "Close", onclick: () => { AudioMan.sfx("ui_close"); close(null); } }, "×") : null));
    const content = el("div", { class: "modal-body" });
    if (typeof body === "string") content.innerHTML = body; else if (body) content.append(body);
    m.append(content);
    if (buttons.length) {
      const bar = el("div", { class: "modal-actions" });
      for (const b of buttons) bar.append(el("button", { class: "btn " + (b.cls || ""), disabled: b.disabled, onclick: () => { U.click(); if (b.keepOpen) { b.run && b.run(); return; } close(b.id); } }, b.label));
      m.append(bar);
    }
    ov.innerHTML = "";
    ov.append(m);
    ov.onclick = (e) => { if (e.target === ov && dismiss) close(null); };
    m._close = close;
    const f = m.querySelector(".modal-actions .btn") || m.querySelector("button");
    if (f) f.focus({ preventScroll: true });
  });
  U.closeModal = (v) => { const m = document.querySelector("#overlay .modal"); if (m && m._close) m._close(v); };

  /* ---------------------------------------------------------------- dice tray */
  const PIPS = { 1: [5], 2: [1, 9], 3: [1, 5, 9], 4: [1, 3, 7, 9], 5: [1, 3, 5, 7, 9], 6: [1, 3, 4, 6, 7, 9] };
  U.die = (v, cls = "") => {
    const d = el("div", { class: "die " + cls, "data-v": v });
    for (let i = 1; i <= 9; i++) d.append(el("i", { class: PIPS[v].includes(i) ? "on" : "" }));
    return d;
  };
  U.setDie = (d, v) => { d.dataset.v = v; [...d.children].forEach((p, i) => p.classList.toggle("on", PIPS[v].includes(i + 1))); };
  U.tumble = async (dice, finals) => {
    AudioMan.sfx("dice_roll");
    if (U.reduced()) { dice.forEach((d, i) => U.setDie(d, finals[i])); return; }
    dice.forEach((d) => d.classList.add("rolling"));
    const t0 = performance.now();
    while (performance.now() - t0 < 700) {
      dice.forEach((d) => U.setDie(d, 1 + Math.floor(Math.random() * 6)));
      await U.sleep(70);
    }
    dice.forEach((d, i) => { U.setDie(d, finals[i]); d.classList.remove("rolling"); d.classList.add("landed"); });
  };

  /* ---------------------------------------------------------------- toasts */
  U.toast = (html, kind = "") => {
    const box = $("#toasts");
    const t = el("div", { class: "toast " + kind, html });
    box.append(t);
    while (box.children.length > 2) box.firstChild.remove();
    setTimeout(() => t.classList.add("out"), 2600);
    setTimeout(() => t.remove(), 3200);
  };

  /* ---------------------------------------------------------------- scene fx */
  U.shake = () => { const s = $("#scene"); if (!s || U.reduced()) return; s.classList.remove("shake"); void s.offsetWidth; s.classList.add("shake"); };
  U.flicker = () => { const s = $("#scene"); if (!s || U.reduced()) return; s.classList.remove("flicker"); void s.offsetWidth; s.classList.add("flicker"); };
  U.flash = (color = "#b8322a") => {
    const f = el("div", { class: "flash", style: { background: color } });
    document.body.append(f);
    setTimeout(() => f.remove(), 600);
  };

  /* Particles: rain streaks, drifting lilies, embers */
  const P = { mode: "none", parts: [], img: {}, raf: 0, last: 0 };
  U.particles = (mode) => {
    P.mode = mode || "none";
    const cv = $("#fx");
    if (!cv) return;
    P.parts = [];
    if (!P.raf) P.raf = requestAnimationFrame(tick);
  };
  const loadImg = (key) => {
    if (P.img[key]) return P.img[key];
    const i = new Image();
    i.src = U.img(key, "ui");
    P.img[key] = i;
    return i;
  };
  function tick(t) {
    P.raf = requestAnimationFrame(tick);
    const cv = $("#fx");
    if (!cv || !cv.isConnected) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = cv.clientWidth, h = cv.clientHeight;
    if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
    const c = cv.getContext("2d");
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, w, h);
    const dt = Math.min(0.05, (t - (P.last || t)) / 1000);
    P.last = t;
    if (P.mode === "none") return;
    const reduced = U.reduced();
    const wantRain = P.mode.includes("rain") ? (reduced ? 0 : 90) : 0;
    const wantLily = P.mode.includes("lilies") ? (reduced ? 4 : 12) : 0;
    const wantEmber = P.mode.includes("embers") ? (reduced ? 8 : 50) : 0;
    const count = (k) => P.parts.filter((p) => p.k === k).length;
    while (count("rain") < wantRain) P.parts.push({ k: "rain", x: Math.random() * w, y: Math.random() * h, v: 500 + Math.random() * 300, l: 10 + Math.random() * 16 });
    while (count("lily") < wantLily) P.parts.push({ k: "lily", x: Math.random() * w, y: Math.random() * h, s: 14 + Math.random() * 18, ph: Math.random() * 6, v: 6 + Math.random() * 10, r: Math.random() * 6, blood: Math.random() < 0.08 });
    while (count("ember") < wantEmber) P.parts.push({ k: "ember", x: Math.random() * w, y: h + Math.random() * 40, s: 4 + Math.random() * 8, v: 20 + Math.random() * 40, ph: Math.random() * 6 });
    const lilyImg = loadImg("lily"), bloodImg = loadImg("lily_blood"), emberImg = loadImg("ember");
    for (const p of P.parts) {
      if (p.k === "rain") {
        p.y += p.v * dt; p.x -= p.v * 0.12 * dt;
        if (p.y > h) { p.y = -20; p.x = Math.random() * w * 1.1; }
        c.strokeStyle = "rgba(170,190,210,0.28)"; c.lineWidth = 1;
        c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(p.x + p.l * 0.12, p.y - p.l); c.stroke();
      } else if (p.k === "lily") {
        p.ph += dt * 0.6; p.y += p.v * dt; p.x += Math.sin(p.ph) * 12 * dt;
        if (p.y > h + 30) { p.y = -30; p.x = Math.random() * w; }
        const im = p.blood ? bloodImg : lilyImg;
        if (im.complete && im.naturalWidth) {
          c.save(); c.translate(p.x, p.y); c.rotate(Math.sin(p.ph) * 0.35 + p.r);
          c.globalAlpha = 0.85; c.drawImage(im, -p.s, -p.s, p.s * 2, p.s * 2); c.restore();
        }
      } else if (p.k === "ember") {
        p.ph += dt * 2; p.y -= p.v * dt; p.x += Math.sin(p.ph) * 18 * dt;
        if (p.y < -20) { p.y = h + 10; p.x = Math.random() * w; }
        if (emberImg.complete && emberImg.naturalWidth) { c.globalAlpha = 0.7 + 0.3 * Math.sin(p.ph * 3); c.drawImage(emberImg, p.x - p.s, p.y - p.s, p.s * 2, p.s * 2); c.globalAlpha = 1; }
      }
    }
    P.parts = P.parts.filter((p) => (p.k === "rain" && wantRain) || (p.k === "lily" && wantLily) || (p.k === "ember" && wantEmber));
  }

  window.UI = U;
})();
