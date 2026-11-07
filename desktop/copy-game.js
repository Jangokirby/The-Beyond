/* Copies the game (../public) into ./game so the app ships the same files as the web version. */
const fs = require("fs"), path = require("path");
const src = path.join(__dirname, "..", "public"), dst = path.join(__dirname, "game");
fs.rmSync(dst, { recursive: true, force: true });
fs.cpSync(src, dst, { recursive: true });
console.log("Copied the game into", dst);
