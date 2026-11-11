/* ============================================================================
   MORE CASES — written in the same data format as adventures.js (see adv.js).
   Optional fields used here:
     flavor:   "jp" turns on Japanese labels while the case runs (none of these do)
     downtime: how many downtime actions each agent gets in the break AFTER this case
   ========================================================================== */
(function () {
  const A = window.ART, ADV = window.ADV;
  const F = (s, hc, h, o, x = "none", bg = "#2b2f3a") => ({ skin: A.SKIN[s], hairC: A.HAIRC[hc], hair: h, outfit: A.OUTFIT[o], extra: x, bg });
  const N = (name, tag, look, face) => ({ name, tag, look, face });

})();
