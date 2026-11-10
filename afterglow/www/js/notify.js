// Notifications. In the Android app (Capacitor) messages are scheduled as real
// local notifications, so they pop up at the right time even when the app is
// closed. In a browser we show them through the service worker while the page
// is alive, and anything that came due while it was closed arrives on next open.
import { S } from "./state.js";

const Cap = () => window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform() ? window.Capacitor.Plugins : null;
const LN = () => Cap() && Cap().LocalNotifications;
const shown = new Set();
let onOpen = () => {};

export function idFor(s) { let h = 7; for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0; return Math.abs(h) % 2000000000; }

export async function init(openChat) {
  onOpen = openChat;
  const ln = LN();
  if (ln) {
    try {
      await ln.createChannel?.({ id: "messages", name: "Messages", importance: 5, visibility: 1, vibration: true });
      await ln.createChannel?.({ id: "matches", name: "Matches", importance: 4, visibility: 1 });
    } catch {}
    ln.addListener("localNotificationActionPerformed", (e) => { const id = e.notification?.extra?.matchId; if (id) onOpen(id); });
  } else if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("message", (e) => { if (e.data && e.data.open) onOpen(e.data.open); });
  }
}

export async function permission() {
  const ln = LN();
  if (ln) { const r = await ln.requestPermissions(); return r.display === "granted"; }
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  return (await Notification.requestPermission()) === "granted";
}

export function status() {
  if (LN()) return "app";
  if (!("Notification" in window)) return "unsupported";
  return Notification.permission;
}

// Schedule for later (native only; the browser can't wake itself up).
export function schedule({ nid, at, title, body, matchId, channel = "messages" }) {
  if (!S.settings.notifications) return;
  const ln = LN();
  if (!ln || !nid) return;
  if (at < Date.now() + 1500) return; // will be shown on delivery instead
  ln.schedule({ notifications: [{ id: nid, title, body: body || "", schedule: { at: new Date(at), allowWhileIdle: true }, extra: { matchId }, channelId: channel, smallIcon: "ic_stat_icon", group: matchId }] }).catch(() => {});
  shown.add(nid);
}

export function cancel(nid) {
  const ln = LN();
  if (ln && nid) ln.cancel({ notifications: [{ id: nid }] }).catch(() => {});
}

// Called when a message is delivered and you're not looking at that chat.
export async function showNow({ nid, title, body, matchId, at, channel = "messages" }) {
  if (!S.settings.notifications) return;
  const ln = LN();
  if (ln) {
    if (shown.has(nid) && at < Date.now() - 1000) return; // the scheduled one already fired
    if (!document.hidden) return; // in-app toast handles it
    ln.schedule({ notifications: [{ id: nid || idFor(String(Math.random())), title, body: body || "", extra: { matchId }, channelId: channel }] }).catch(() => {});
    return;
  }
  if (!document.hidden) return;
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const reg = await navigator.serviceWorker?.getRegistration();
  const opts = { body: body || "", tag: "m-" + matchId, renotify: true, icon: "icons/icon-192.png", badge: "icons/badge.png", data: { matchId }, vibrate: [80, 40, 80] };
  if (reg) reg.showNotification(title, opts); else new Notification(title, opts);
}
