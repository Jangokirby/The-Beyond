// Run after `npx cap add android`: allows plain-http calls to local AI servers,
// exact alarms for on-time texts, and adds the notification icon.
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..", "android", "app", "src", "main");
const mf = path.join(root, "AndroidManifest.xml");
let x = fs.readFileSync(mf, "utf8");
if (!x.includes("usesCleartextTraffic")) x = x.replace("<application", '<application android:usesCleartextTraffic="true"');
for (const perm of ["POST_NOTIFICATIONS", "SCHEDULE_EXACT_ALARM", "USE_EXACT_ALARM", "RECEIVE_BOOT_COMPLETED", "WAKE_LOCK"])
  if (!x.includes("android.permission." + perm)) x = x.replace("</manifest>", `    <uses-permission android:name="android.permission.${perm}" />\n</manifest>`);
fs.writeFileSync(mf, x);
const dr = path.join(root, "res", "drawable");
fs.mkdirSync(dr, { recursive: true });
fs.writeFileSync(path.join(dr, "ic_stat_icon.xml"), `<vector xmlns:android="http://schemas.android.com/apk/res/android" android:width="24dp" android:height="24dp" android:viewportWidth="96" android:viewportHeight="96"><path android:fillColor="#FFFFFFFF" android:pathData="M48,10c4,16 24,24 24,46a24,24 0,0 1,-48 0c0,-12 8,-20 12,-28 0,8 4,12 8,12 0,-12 0,-20 4,-30z"/></vector>`);
console.log("android patched");
