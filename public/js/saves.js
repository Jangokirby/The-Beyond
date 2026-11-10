/* ============================================================================
   SAVE FILES — "Download save" and "Load save".
   A campaign lives in this browser's storage. A save file is a copy you keep:
   clearing the browser, changing computer or reinstalling never loses it.
     campaign file  one campaign, with its mission in progress
     backup file    every campaign, plus the GM workshop, packs and settings
   Files are plain JSON (*.beyond.json).
   ========================================================================== */
(function () {
  const CAMP = window.CAMP;
  if (!CAMP) return;
  const FORMAT = "the-beyond-save", VERSION = 1;
  const PREFIX = "beyond.";
  const rd = (k) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } };
  const wr = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } };
  const slug = (s) => (s || "campaign").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "campaign";
  const stamp = () => new Date().toISOString().slice(0, 10);

  const download = (name, data) => {
    const blob = new Blob([JSON.stringify(data, null, 1)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = name; document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  };

  const S = (window.SAVES = {});

  /* one campaign: the live copy if it is open, else the stored one */
  S.campaignData = (id) => {
    const camp = CAMP.camp && CAMP.camp.id === id ? CAMP.camp : CAMP.peek(id);
    if (!camp) return null;
    return { format: FORMAT, version: VERSION, kind: "campaign", exported: new Date().toISOString(), campaign: camp, mission: rd(PREFIX + "mission." + id) };
  };
  S.downloadCampaign = (id) => {
    if (CAMP.camp && CAMP.camp.id === id) CAMP.save();
    const d = S.campaignData(id);
    if (!d) { window.UI.toast("That campaign could not be found."); return; }
    download(`the-beyond-${slug(d.campaign.name)}-day${d.campaign.day || 0}-${stamp()}.beyond.json`, d);
    window.UI.toast(`Saved ${d.campaign.name} to a file. Keep it somewhere safe.`);
  };
  S.backupAll = () => {
    if (CAMP.camp) CAMP.save();
    const keys = {};
    try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith(PREFIX) && !/^beyond\.(uid|token|host\.)/.test(k)) keys[k] = localStorage.getItem(k); } } catch (e) {}
    download(`the-beyond-backup-${stamp()}.beyond.json`, { format: FORMAT, version: VERSION, kind: "backup", exported: new Date().toISOString(), keys });
    window.UI.toast("Everything is saved to one backup file.");
  };

  /* ---------------------------------------------------------------- loading */
  const pickFile = () => new Promise((resolve) => {
    const inp = document.createElement("input");
    inp.type = "file"; inp.accept = ".json,application/json";
    inp.onchange = () => { const f = inp.files && inp.files[0]; if (!f) return resolve(null); const r = new FileReader(); r.onload = () => resolve(String(r.result || "")); r.onerror = () => resolve(null); r.readAsText(f); };
    inp.click();
  });

  S.importText = async (text) => {
    const U = window.UI;
    let d;
    try { d = JSON.parse(text); } catch (e) { U.toast("That file is not a save from The Beyond."); return null; }
    if (!d || d.format !== FORMAT) { U.toast("That file is not a save from The Beyond."); return null; }
    if (d.version > VERSION) { U.toast("That save comes from a newer version of the game. Update the game first."); return null; }
    if (d.kind === "backup") {
      const keys = d.keys || {}, camps = Object.keys(keys).filter((k) => /^beyond\.camp\.(?!index)/.test(k)).length;
      const r = await U.modal({ title: "Restore a backup?", body: `<p>This file holds ${camps} campaign${camps === 1 ? "" : "s"}, plus the GM workshop, packs and settings from ${(d.exported || "").slice(0, 10) || "an earlier date"}.</p><p>Campaigns with the same name and id are replaced by the copies in the file. Anything else in this browser stays.</p>`,
        buttons: [{ id: "no", label: "Cancel" }, { id: "yes", label: "Restore", cls: "primary" }] });
      if (r !== "yes") return null;
      const idx = rd(PREFIX + "camp.index.v1") || [];
      for (const [k, v] of Object.entries(keys)) {
        if (k === PREFIX + "camp.index.v1") { let inc = []; try { inc = JSON.parse(v) || []; } catch (e) {} for (const x of inc) { const i = idx.findIndex((y) => y.id === x.id); if (i >= 0) idx[i] = x; else idx.push(x); } continue; }
        try { localStorage.setItem(k, v); } catch (e) { U.toast("This browser ran out of room while restoring."); return null; }
      }
      wr(PREFIX + "camp.index.v1", idx);
      U.toast("Backup restored. Reloading.");
      setTimeout(() => location.reload(), 900);
      return "backup";
    }
    if (d.kind !== "campaign" || !d.campaign || !d.campaign.id || !Array.isArray(d.campaign.chars)) { U.toast("That save file is damaged."); return null; }
    let camp = d.campaign;
    const existing = CAMP.peek(camp.id);
    if (existing) {
      const r = await U.modal({ title: "This campaign is already here", body: `<p><b>${camp.name}</b> is already in this browser (day ${existing.day || 0}). The file is from day ${camp.day || 0}.</p>`,
        buttons: [{ id: "no", label: "Cancel" }, { id: "copy", label: "Keep both" }, { id: "replace", label: "Replace it", cls: "primary" }] });
      if (r === "no" || !r) return null;
      if (r === "copy") { const old = camp.id; camp = { ...camp, id: "c" + Math.random().toString(36).slice(2, 10), name: camp.name + " (from file)" }; if (d.mission) d.mission = { ...d.mission, campId: camp.id }; if (old === camp.id) return null; }
    }
    CAMP.camp = camp;
    CAMP.migrate(camp);
    CAMP.save();
    if (d.mission) wr(PREFIX + "mission." + camp.id, d.mission); else { try { localStorage.removeItem(PREFIX + "mission." + camp.id); } catch (e) {} }
    U.toast(`${camp.name} loaded.`);
    return camp.id;
  };
  S.load = async () => {
    const text = await pickFile();
    if (!text) return null;
    return S.importText(text);
  };

  /* ---------------------------------------------------------------- buttons */
  const ui = CAMP.ui;
  if (!ui) return;
  const el = window.UI.el;
  const btn = (label, fn, cls) => el("button", { class: "btn " + (cls || ""), onclick: () => { window.UI.click && window.UI.click(); fn(); } }, label);
  const afterLoad = (id) => { if (id && id !== "backup" && CAMP.load(id)) ui.hub(); };

  const campaigns0 = ui.campaigns;
  ui.campaigns = (...args) => {
    campaigns0(...args);
    const wrap = document.querySelector(".cwrap");
    if (!wrap) return;
    const list = CAMP.list();
    wrap.querySelectorAll(".campaign-card").forEach((card, i) => {
      const c = list[i], row = card.querySelector(".row");
      if (c && row) row.prepend(btn("Download save", () => S.downloadCampaign(c.id), "small"));
    });
    const rows = wrap.querySelectorAll(":scope > .row");
    const last = rows[rows.length - 1];
    const bar = el("div", { class: "row" }, btn("Load save", async () => afterLoad(await S.load()), "primary"), btn("Back up everything", () => S.backupAll(), "ghost"));
    if (last) wrap.insertBefore(bar, last); else wrap.append(bar);
    wrap.insertBefore(el("p", { class: "small muted" }, "Campaigns are kept in this browser. Download a save now and then: a save file brings a campaign back on any computer, even after the browser is cleared."), bar);
  };

  const title0 = ui.title;
  ui.title = (...args) => {
    title0(...args);
    const acts = document.querySelector(".title-actions");
    if (!acts) return;
    const learn = acts.querySelector("#learn");
    const b = btn("Load save", async () => afterLoad(await S.load()), "ghost");
    if (learn) acts.insertBefore(b, learn); else acts.append(b);
  };

  const hub0 = ui.hub;
  ui.hub = (...args) => {
    hub0(...args);
    const row = document.querySelector(".hubtitle") && document.querySelector(".hubtitle").parentElement.querySelector(".row");
    if (row && CAMP.camp && !row.querySelector(".dl-save")) {
      const b = btn("Download save", () => S.downloadCampaign(CAMP.camp.id), "ghost small dl-save");
      row.insertBefore(b, row.lastElementChild);
    }
  };
})();
