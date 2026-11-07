/* Tells the game it is running as the desktop app. Nothing else from the computer is exposed to it. */
const { contextBridge } = require("electron");
contextBridge.exposeInMainWorld("BEYOND_DESKTOP", { version: process.env.npm_package_version || "0.1.0", platform: process.platform });
