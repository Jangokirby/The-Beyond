/* ============================================================================
   RPGX: switches for the roleplaying additions, so each can be tried and turned off.
   Settings > "Roleplaying features". The classic game is what you get with them all off
   (and the git tag classic-v1 holds the code as it was before they were added).
   ========================================================================== */
(function () {
  const KEY = "beyond.rpgx", D = { light: true, improv: true, fieldwork: true, events: true, typed: true, magic: true, clock: true, fuel: true, puzzles: true, perks: true, map: true, scavenge: true, specific: true, rapport: true, moments: true, walk: true };
  const read = () => { try { return Object.assign({}, D, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) { return Object.assign({}, D); } };
  let S = read();
  window.RPGX = {
    list: [["light", "Light and dark you can see, and a light to carry"], ["clock", "Time presses: the night deepens as you act"], ["fuel", "Lights burn down (carry spares)"], ["puzzles", "Puzzles to solve, alongside the dice"], ["improv", "Try something else: type what you do"], ["fieldwork", "Field work: items, skills, ask around"], ["events", "Events that interrupt the day"], ["typed", "Type your own questions to people"], ["magic", "Cast magic words in scenes"], ["perks", "A Perk to choose at every level"], ["map", "A map of the case, with quick travel"], ["scavenge", "Scavenge for spare lights and supplies"], ["specific", "Be specific and there is nothing to roll"], ["rapport", "Talk with a manner: trust, not dice"], ["moments", "Take a moment, in character (and a journal)"], ["walk", "Walk your team through the picture"]],
    on: (k) => S[k] !== false,
    set: (k, v) => { S[k] = !!v; try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} },
    all: (v) => { for (const k of Object.keys(D)) S[k] = !!v; try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  };
})();
