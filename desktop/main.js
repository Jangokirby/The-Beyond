/* ============================================================================
   THE BEYOND — desktop app.
   Serves the game from a private address on this computer (so saves, sound and
   the live table behave exactly like the web version) and opens it in a window.
   Online play goes through the relay set in game/js/config.js.
   ========================================================================== */
const { app, BrowserWindow, shell, Menu } = require("electron");
const http = require("http"), fs = require("fs"), path = require("path");

const ROOT = path.join(__dirname, "game");
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json", ".webmanifest": "application/manifest+json",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".ogg": "audio/ogg", ".wav": "audio/wav", ".woff2": "font/woff2" };

/* a fixed port keeps the same browser storage (your saves) between launches */
const PORT = 47321;
function serve() {
  return new Promise((resolve, reject) => {
    const srv = http.createServer((req, res) => {
      let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
      if (p === "/") p = "/index.html";
      const file = path.normalize(path.join(ROOT, p));
      if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
      fs.readFile(file, (err, buf) => {
        if (err) { res.writeHead(404); return res.end("Not found"); }
        res.writeHead(200, { "Content-Type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream" });
        res.end(buf);
      });
    });
    srv.on("error", reject);
    srv.listen(PORT, "127.0.0.1", () => resolve(srv));
  });
}

async function createWindow() {
  await serve();
  const win = new BrowserWindow({
    width: 1400, height: 900, minWidth: 960, minHeight: 640, backgroundColor: "#0b0f15", title: "The Beyond",
    icon: path.join(ROOT, "assets/icons/icon-512.png"),
    webPreferences: { preload: path.join(__dirname, "preload.js"), contextIsolation: true, nodeIntegration: false, sandbox: true }
  });
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    { label: "Game", submenu: [{ role: "reload" }, { role: "togglefullscreen" }, { type: "separator" }, { role: "quit" }] },
    { label: "View", submenu: [{ role: "zoomIn" }, { role: "zoomOut" }, { role: "resetZoom" }] }
  ]));
  /* links to other sites open in the normal browser */
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: "deny" }; });
  win.webContents.on("will-navigate", (e, url) => { if (!url.startsWith(`http://127.0.0.1:${PORT}`)) { e.preventDefault(); shell.openExternal(url); } });
  win.loadURL(`http://127.0.0.1:${PORT}/`);
}

if (!app.requestSingleInstanceLock()) app.quit();
app.whenReady().then(createWindow);
app.on("window-all-closed", () => app.quit());
