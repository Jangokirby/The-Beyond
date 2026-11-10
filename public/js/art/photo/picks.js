/* ============================================================================
   HAND-PICKED DOSSIER ART
   DOSSIER_PICKS pins a picture to a case's characters (npcs), monsters
   (enemies) or places (scenes), by the ids in js/dossier-lib.js. Anything not
   pinned here is chosen automatically by era, sex and age.
   DOSSIER_FIXED points the handmade first case and the title screen at photos.
   ========================================================================== */
window.DOSSIER_PICKS = {
  "bell-of-saint-remy": { npcs: { anselm: "pmed516", mathilde: "pmed32", odo: "pmed36" } },
  "hour-of-the-fog": { npcs: { crewe: "lbainm2", tam: "pvic518", pell: "pvic316" } },
  "trench-chorus": { npcs: { maddox: "pmod412", iain: "pmod45" } },
  "night-train-aomori": { npcs: { sato: "pato111", hase: "lgirl4", station: "lbainm5" } },
  "last-picture-show": { npcs: { ruby: "lfsawoman18", dunn: "lsheriff5", vale: "lfarmer1" } },
  "dial-up": { npcs: { priya: "pmod29", lazarus: "pmod11" } },
  "signal-drift": { npcs: { lin: "pasm0", mei: "loldw8" } },
  "bread-for-the-dead": { npcs: { wouter: "pato40", aleidis: "pmed21", grietje: "pmed32", boys: "pvic214" } },
  "black-roller": { npcs: { hollis: "lfsaman10", tom: "lfarmer7", ruth: "lfarmwife0", jessup: "lfarmwife3" } },
  "vacancy": { npcs: { calder: "pmod116", morag: "pmod50", priya: "pmod26" } },
  "sitting-room": { npcs: { vane: "pvic36", tilly: "pvic213", ashby: "pvic42" } },
  "lantern-on-the-water": { npcs: { clementine: "lmidwife13", price: "lfisher9", josiah: "lpreacher1" } },
  "quiet-hours": { npcs: { deng: "pold16", zhou: "psa24", ada: "psa14" } }
};

window.DOSSIER_FIXED = {
  portraits: { haruka: "psa111", kenji: "psa24", daichi: "pasm0", nomura: "psa213", kaede: "psa112", naoko: "psa14", hideki: "psa118",
    kenjiro: "pasm1", daigo: "pjpm4", chihiro: "psa116", ayaka: "pold16" },
  scenes: { title: "lnight17", street: "sfog19", station: "shall3", hall1: "shotel1", hall2: "shotel2", hall3: "shall0", doorway: "shotel0",
    apt2b_living: "sapt3", apt2b_kitchen: "sapt4", apt2b_bedroom: "sapt12", apt2b_storage: "scellar9", apt2a: "sapt14", basement: "scave9",
    paper_guest: "sint214", paper_dojo: "lpcabbey17", paper_study: "sint217", paper_hall: "lpccrypt0", paper_2b: "schurch17",
    end_banish: "ssnow3", end_kill: "sfog17" },
  sprites: { ghost_base: "mhokusai1", ghost_blades: "mhokusai2", ghost_lantern: "mhokusai0", replica: "mbake2" }
};
