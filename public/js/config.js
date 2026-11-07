/* ============================================================================
   WHERE THE LIVE TABLE LIVES
   relay: the address of your hosted server (the one on Render), for example
          "https://the-beyond.onrender.com". Leave it empty when the game is
          served by that same server: it then talks to wherever it was loaded from.
   The desktop app and any copy opened from a file need this set to play online.
   Players can also override it under Live table > Server.
   ========================================================================== */
window.BEYOND_CONFIG = Object.assign({ relay: "", appName: "The Beyond" }, window.BEYOND_CONFIG || {});
