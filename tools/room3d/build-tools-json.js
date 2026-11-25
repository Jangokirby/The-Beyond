/* Writes tools/room3d/tools.json (function-calling shapes for OpenAI-style and Anthropic) from TOOLS in public/lab/api.js.
   Run after changing the tool list:  node tools/room3d/build-tools-json.js */
const fs = require("fs"), path = require("path"), { pathToFileURL } = require("url");
(async () => {
  const { TOOLS } = await import(pathToFileURL(path.join(__dirname, "..", "..", "public", "lab", "api.js")).href);
  const out = { openai: TOOLS.map((t) => ({ type: "function", function: { name: t.name, description: t.description, parameters: t.parameters } })), anthropic: TOOLS.map((t) => ({ name: t.name, description: t.description, input_schema: t.parameters })) };
  fs.writeFileSync(path.join(__dirname, "tools.json"), JSON.stringify(out, null, 1)); console.log("tools.json: " + TOOLS.length + " tools");
})();
