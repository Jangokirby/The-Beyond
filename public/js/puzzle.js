/* ============================================================================
   PUZZLES: things to solve with your own head, alongside the dice.
   In a case:  { puzzle: { kind, aspect, cr, label, ok: [...], fail: [...], ...kind options } }
     kind "code"      a combination: guess it from feedback (digits: "4173", tries: 6)
     kind "cipher"    a Caesar-shifted message: turn the dial until it reads (text: "...", shift: 7)
     kind "sequence"  a ritual or a lock that remembers: repeat the pattern (length: 5)
   The dice help: first someone rolls `aspect` against `cr`. A good roll gives a real advantage (a revealed digit
   and more tries; a range for the shift; the pattern shown slowly); a bad roll gives a disadvantage.
   `needs: { aspect, min }` limits the puzzle to a team with the skill: otherwise nobody can even begin.
   With the Puzzles switch off, the dice alone decide (the classic way).
   ========================================================================== */
(function () {
  const U = window.UI, el = U.el, R = window.R, P = (window.PUZZLE = {});
  const shift = (t, n) => t.replace(/[a-z]/gi, (c) => { const b = c <= "Z" ? 65 : 97; return String.fromCharCode(((c.charCodeAt(0) - b + n + 26) % 26) + b); });
  const modal = (title, body, giveUp) => { let done = false, out = { ok: false }; const pr = U.modal({ title, body, buttons: [{ id: "x", label: giveUp || "Give up" }] }).then(() => { if (!done) out.gaveUp = true; }); return { pr, out, finish: (ok) => { done = true; out.ok = ok; setTimeout(() => U.closeModal(), 900); } }; };
  P.run = async (pz, g) => {
    const G = window.GAME;
    if (pz.needs && Math.max(0, ...G.active().map((a) => R.aspect(a, pz.needs.aspect))) < pz.needs.min) { await g.narrate(pz.lockedText || `Nobody here has the ${R.ASPECT_LABEL[pz.needs.aspect]} for this. You can see that it is a puzzle, and that is as far as you get.`); return false; }
    const roll = await G.check({ aspect: pz.aspect || "iq", cr: R.cr(pz.cr || "medium"), label: pz.label || "Study the puzzle", who: "choose", tags: pz.tags || ["puzzle"], investigate: true });
    if (!window.RPGX.on("puzzles")) return !!roll.ok;
    const good = !!roll.ok;
    await g.narrate(good ? (pz.goodText || "You have a feel for it. It will go a little easier.") : (pz.badText || "Something about it will not sit right. It is going to be harder than it should."));
    if (pz.kind === "cipher") return cipher(pz, good);
    if (pz.kind === "sequence") return sequence(pz, good);
    return code(pz, good);
  };

  /* ---------------------------------------------------------------- code */
  const code = async (pz, good) => {
    const secret = String(pz.digits || "4173"), n = secret.length; let tries = (pz.tries || 6) + (good ? 3 : -2); const hist = [];
    const known = good ? Math.floor(Math.random() * n) : -1;
    const tr = el("div", { class: "pz-hist" }), msg = el("p", { class: "small muted" }), inp = el("input", { type: "text", maxlength: String(n), inputmode: "numeric", style: "font-size:1.6rem;letter-spacing:.4em;width:8em;text-align:center" });
    const clue = good ? el("p", { class: "small" }, `Digit ${known + 1} is ${secret[known]}.`) : null;
    const btn = el("button", { class: "btn primary", type: "button" }, "Try it");
    const body = el("div", {}, el("p", {}, pz.prompt || `A ${n}-digit combination. Each try tells you how many digits are right (●) and how many are right but in the wrong place (○).`), clue, el("p", { class: "small" }, ""), inp, btn, tr, msg);
    const M = modal(pz.title || "The lock", body);
    const upd = () => { msg.textContent = `${tries} ${tries === 1 ? "try" : "tries"} left`; }; upd();
    btn.onclick = () => { const v = inp.value.replace(/\D/g, ""); if (v.length !== n) { msg.textContent = `Enter ${n} digits.`; return; } tries--; let r = 0, w = 0; const used = []; for (let i = 0; i < n; i++) if (v[i] === secret[i]) { r++; used[i] = true; }
      for (let i = 0; i < n; i++) if (v[i] !== secret[i]) { const j = [...secret].findIndex((c, k) => c === v[i] && !used[k] && v[k] !== secret[k]); if (j >= 0) { w++; used[j] = true; } }
      tr.append(el("div", { class: "pz-row" }, `${v}   ${"●".repeat(r)}${"○".repeat(w)}`)); inp.value = "";
      if (r === n) { msg.textContent = "Click. It opens."; M.finish(true); } else if (tries <= 0) { msg.textContent = "It will not give. Whatever you tried, it is jammed now."; M.finish(false); } else upd(); };
    await M.pr; return M.out.ok;
  };

  /* ---------------------------------------------------------------- cipher */
  const cipher = async (pz, good) => {
    const plain = pz.text || "THE DOOR IS UNDER THE BELL", key = pz.shift || 7, cipherText = shift(plain, key); let tries = pz.tries || 6;
    const out = el("p", { class: "pz-text", style: "font:1.2rem/1.5 monospace;word-break:break-word" }, cipherText), dial = el("input", { type: "range", min: "0", max: "25", value: "0" }), val = el("b", {}, "0");
    const hint = good ? el("p", { class: "small" }, `The key is between ${Math.max(0, key - 3)} and ${Math.min(25, key + 3)}.`) : null, btn = el("button", { class: "btn primary", type: "button" }, "That is it"), msg = el("p", { class: "small muted" }, `${tries} guesses left`);
    dial.oninput = () => { val.textContent = dial.value; out.textContent = shift(cipherText, -dial.value); };
    const body = el("div", {}, el("p", {}, pz.prompt || "A message, shifted along the alphabet. Turn the dial until it reads."), hint, out, el("label", { class: "small" }, "Shift ", val), dial, btn, msg);
    const M = modal(pz.title || "The cipher", body);
    btn.onclick = () => { if (+dial.value === key) { msg.textContent = "It reads."; M.finish(true); } else { tries--; msg.textContent = tries > 0 ? `That is nonsense. ${tries} guesses left.` : "You cannot make it read."; if (tries <= 0) M.finish(false); } };
    await M.pr; return M.out.ok;
  };

  /* ---------------------------------------------------------------- sequence */
  const sequence = async (pz, good) => {
    const GL = pz.glyphs || ["☉", "☽", "✦", "✚", "♆", "⚕"], len = pz.length || 5, seq = Array.from({ length: len }, () => Math.floor(Math.random() * GL.length)); let lives = 3; let i = 0, playing = true;
    const pads = GL.map((g, k) => el("button", { class: "btn pz-pad", type: "button", style: "font-size:2rem;width:3.2em;height:3.2em;margin:4px", onclick: () => press(k) }, g));
    const msg = el("p", { class: "small muted" }, "Watch.");
    const body = el("div", {}, el("p", {}, pz.prompt || "A pattern, shown once. Repeat it."), el("div", {}, ...pads), msg);
    const M = modal(pz.title || "The pattern", body);
    const flash = async (k, ms) => { pads[k].classList.add("primary"); await new Promise((r) => setTimeout(r, ms)); pads[k].classList.remove("primary"); await new Promise((r) => setTimeout(r, 180)); };
    const show = async () => { playing = true; msg.textContent = "Watch."; await new Promise((r) => setTimeout(r, 500)); for (const k of seq) await flash(k, good ? 800 : 360); playing = false; i = 0; msg.textContent = `Your turn. ${lives} ${lives === 1 ? "life" : "lives"}.`; };
    const press = (k) => { if (playing) return; if (k === seq[i]) { i++; if (i >= len) { msg.textContent = "It answers."; M.finish(true); } } else { lives--; if (lives <= 0) { msg.textContent = "It does not answer. It never will, now."; M.finish(false); } else show(); } };
    show(); await M.pr; return M.out.ok;
  };
})();
