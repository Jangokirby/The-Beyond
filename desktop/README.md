# The Beyond: desktop app

The same game as the web version, packaged as a Windows, Mac or Linux app. Players install it and play; online tables go through your hosted server.

## Before you build
Set your server's address in `../public/js/config.js`:

```js
window.BEYOND_CONFIG = Object.assign({ relay: "https://the-beyond.onrender.com", appName: "The Beyond" }, window.BEYOND_CONFIG || {});
```

Invite links the app makes then point at that server, so friends without the app can join from a browser.

## Try it
Needs Node.js 18 or newer.

```
cd desktop
npm install
npm start
```

## Build installers
- Windows: `npm run dist:win` (on Windows) makes an installer and a portable .exe in `desktop/dist/`.
- Mac: `npm run dist:mac` (on a Mac) makes a .dmg. Unsigned apps need right-click, Open the first time.
- Linux: `npm run dist:linux` makes an AppImage.

Or push the repository to GitHub: the workflow in `.github/workflows/desktop.yml` builds all three on GitHub's machines and attaches them to the run. Start it from the Actions tab (Build desktop app, Run workflow).

## Steam later
This build is what goes on Steam. When you're ready: a Steamworks account ($100 one-time fee per game), an app ID, and the Steam SDK hooked in for achievements and overlay.
