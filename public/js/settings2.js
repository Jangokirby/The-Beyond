/* ============================================================================
   MORE SETTINGS — reading, motion, colour and the atmosphere switches.
   Stored per device (localStorage); applied as classes on <html>.
     text size      S / M / L / XL
     readable font  Atkinson Hyperlegible for all body text
     colour-safe    Health / Sanity / Stability bars get patterns and
                    blue / orange / white colours that survive colour blindness
     reduce motion  no shakes, flashes or sliding banners (also follows the system)
     era styles, Sanity effects, conversation approaches, period music
   ========================================================================== */
(function () {
  const KEY = "beyond.access";
  const S = (() => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } })();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  const root = document.documentElement;
  const apply = () => {
    root.dataset.text = S.text || "m";
    root.classList.toggle("a-readable", !!S.readable);
    root.classList.toggle("a-colour", !!S.colour);
    root.classList.toggle("a-still", !!S.still);
    if (window.SCORE) window.SCORE.on = S.periodMusic !== false;
  };
  apply();
  const U = window.UI;
  if (U && U.reduced) { const r0 = U.reduced; U.reduced = () => !!S.still || r0(); }
  window.MORESET = {
    S, apply,
    controls: () => {
      const el = window.UI.el;
      const chk = (label, get, set, hint) => el("label", { class: "set check", title: hint || null }, el("input", { type: "checkbox", checked: get() ? "checked" : null, onchange: (e) => { set(e.target.checked); save(); apply(); } }), el("span", {}, label));
      const c = window.CAMP && CAMP.camp;
      return [
        el("h4", { class: "set-head" }, "Reading and comfort"),
        el("label", { class: "set" }, el("span", {}, "Text size"), el("select", { onchange: (e) => { S.text = e.target.value; save(); apply(); } },
          ...[["s", "Small"], ["m", "Normal"], ["l", "Large"], ["xl", "Extra large"]].map(([v, t]) => el("option", { value: v, selected: (S.text || "m") === v ? "selected" : null }, t)))),
        chk("Easy-to-read font", () => S.readable, (v) => (S.readable = v), "Atkinson Hyperlegible, designed for low vision"),
        chk("Colour-blind friendly bars", () => S.colour, (v) => (S.colour = v)),
        chk("Reduce motion (no shakes or flashes)", () => S.still, (v) => (S.still = v)),
        el("h4", { class: "set-head" }, "Atmosphere"),
        chk("Period music for each era and place", () => S.periodMusic !== false, (v) => (S.periodMusic = v)),
        chk("Era styles for the screen", () => (window.ERASKIN ? ERASKIN.on() : true), (v) => window.ERASKIN && ERASKIN.set(v)),
        chk("Sanity effects (what low Sanity does to the screen)", () => (window.MADNESS ? MADNESS.on() : true), (v) => window.MADNESS && MADNESS.set(v)),
        c ? chk("Conversation approaches (this campaign)", () => c.rules.approach !== false, (v) => { c.rules.approach = v; CAMP.save(); }) : null
      ].filter(Boolean);
    }
  };
})();
