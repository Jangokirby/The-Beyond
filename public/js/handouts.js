/* ============================================================================
   HANDOUTS — clues as the documents they are.

   A clue in the case file opens as a period document: a letter, a telegram,
   a newspaper clipping, a typed report, a photograph, a diary page, a scrap
   of notes, or (before 1700) a sheet of parchment. The kind is read from the
   clue's own words; a case can set clue.doc to choose ("letter", "telegram",
   "news", "report", "photo", "diary", "notes", "parchment").
   The paper, type and stamps follow the case's year.
   ========================================================================== */
(function () {
  const H = (window.HANDOUT = {});
  const KIND = [
    ["telegram", /telegram|\bwire\b|cable/i], ["news", /newspaper|clipping|headline|gazette|times\b|herald|courier|paper says|obituar/i],
    ["photo", /photo|photograph|snapshot|negative|portrait|picture/i], ["letter", /letter|wrote|dear |envelope|postcard|note from|signed/i],
    ["diary", /diary|journal|notebook|log\b|ledger entry/i], ["report", /report|file|statement|register|record|ledger|certificate|form|dossier|transcript|list/i]
  ];
  H.kind = (c, year) => c.doc || (KIND.find(([, re]) => re.test(`${c.t} ${c.s || ""} ${c.x}`)) || [year < 1700 ? "parchment" : "notes"])[0];
  const esc = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const date = (year) => { const d = 1 + (String(year).length * 7) % 27, months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; return `${d} ${months[(year * 5) % 12]} ${year}`; };
  const PAPER = (y) => (y < 1700 ? "parch" : y < 1900 ? "laid" : y < 1950 ? "aged" : y < 1990 ? "office" : "print");

  H.render = (c, M) => {
    const y = +(M && M.year) || 1950, k = H.kind(c, y), place = esc(((M && M.setting) || "").split("·")[0].trim());
    const body = esc(c.x).replace(/\n/g, "<br>");
    let inner = "";
    if (k === "telegram") inner = `<div class="ho-tg-head">${y < 1930 ? "POSTAL TELEGRAPH" : "WESTERN UNION"} <span>${date(y).toUpperCase()}</span></div>
      <div class="ho-tg-body">${esc(c.x).toUpperCase().replace(/\.\s*/g, " STOP ").replace(/,/g, "")}</div><div class="ho-tg-foot">${esc(c.s || "").toUpperCase()}</div>`;
    else if (k === "news") inner = `<div class="ho-mast">${place ? `The ${place.split(",")[0]} ${y < 1900 ? "Gazette" : y < 1960 ? "Herald" : "Evening Post"}` : "The Evening Post"}</div>
      <div class="ho-dateline">${date(y)} · Price ${y < 1950 ? "One Penny" : "Ten Cents"}</div><h3 class="ho-head">${esc(c.t)}</h3><div class="ho-cols">${body}</div>`;
    else if (k === "photo") inner = `<div class="ho-photo">${(() => { try { const l = window.GAME && GAME.state && GAME.loc(); return l ? `<img src="${window.UI.img(l.scene)}" alt="">` : ""; } catch (e) { return ""; } })()}</div><div class="ho-caption">${esc(c.t)}</div><div class="ho-back">${body}</div>`;
    else if (k === "letter") inner = `<div class="ho-addr">${place || ""}<br>${date(y)}</div><div class="ho-hand">${body}</div><div class="ho-sig">— ${esc(c.s || "")}</div>`;
    else if (k === "diary") inner = `<div class="ho-diary-date">${date(y)}</div><div class="ho-hand">${body}</div>`;
    else if (k === "report") inner = `<div class="ho-form"><div class="ho-form-head">${y < 1900 ? "Official record" : "REPORT"} <span>Ref. ${String(c.t.length * 37 + y).slice(-4)}/${String(y).slice(-2)}</span></div>
      <table><tr><th>Subject</th><td>${esc(c.t)}</td></tr><tr><th>Source</th><td>${esc(c.s || "")}</td></tr><tr><th>Date</th><td>${date(y)}</td></tr></table><div class="ho-typed">${body}</div><div class="ho-stamp">${y < 1950 ? "FILED" : "CONFIDENTIAL"}</div></div>`;
    else if (k === "parchment") inner = `<div class="ho-illum">${esc(c.t).charAt(0)}</div><div class="ho-script"><b>${esc(c.t)}</b><br>${body}</div><div class="ho-seal"></div>`;
    else inner = `<div class="ho-notes-head">${esc(c.t)}</div><div class="ho-hand">${body}</div><div class="ho-notes-src">(${esc(c.s || "")})</div>`;
    return `<div class="handout ho-${k} paper-${PAPER(y)}">${inner}</div>`;
  };
  H.show = (c, M) => window.UI.modal({ title: c.t, cls: "wide homodal", body: H.render(c, M), buttons: [{ id: "ok", label: "Put it back in the file" }] });
})();
