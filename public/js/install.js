/* Install the game as an app (browser version), and offline support. Only on http(s), never inside the desktop app. */
(function () {
  if (!/^https?:$/.test(location.protocol) || window.BEYOND_DESKTOP) return;
  if ("serviceWorker" in navigator && location.hostname !== "localhost") navigator.serviceWorker.register("sw.js").catch(() => {});
  let deferred = null;
  window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferred = e; document.documentElement.classList.add("can-install"); });
  window.BEYOND_INSTALL = {
    available: () => !!deferred,
    installed: () => window.matchMedia && matchMedia("(display-mode: standalone)").matches,
    prompt: async () => { if (!deferred) return false; deferred.prompt(); const r = await deferred.userChoice; deferred = null; document.documentElement.classList.remove("can-install"); return r.outcome === "accepted"; },
    iosHint: () => /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window.matchMedia && matchMedia("(display-mode: standalone)").matches)
  };
})();
