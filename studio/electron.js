/* Map Studio as a desktop window: starts the local server and shows the hub. Needs Electron (npm install inside studio/). Untested on a real desktop by the author. */
const { app, BrowserWindow, shell } = require("electron"); const { start, PORT } = require("./studio.js");
let srv; app.whenReady().then(async () => { try { srv = await start(); } catch (e) { /* already running: just open it */ }
  const win = new BrowserWindow({ width: 1500, height: 940, backgroundColor: "#12151a", title: "Map Studio", webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true } });
  win.webContents.setWindowOpenHandler(({ url }) => { if (!url.startsWith(`http://127.0.0.1:${PORT}`)) { shell.openExternal(url); return { action: "deny" }; } return { action: "allow" }; });
  win.loadURL(`http://127.0.0.1:${PORT}/`); });
app.on("window-all-closed", () => { if (srv) srv.close(); app.quit(); });
