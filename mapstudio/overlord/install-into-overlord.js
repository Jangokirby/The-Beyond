#!/usr/bin/env node
/* Adds Map Studio's tools to an Overlord checkout (the `Agents` repository). Safe to run again; edits are found by what they look like, not by line numbers,
   so small changes in Overlord's own files do not break it. Tested against Overlord v0.7.0.
     node mapstudio/overlord/install-into-overlord.js <path to the Overlord folder> [--check]
   --check only reports what it would do. It changes three things in Overlord's src/main/: it copies mapstudio.js and mapstudio-tools.json in,
   adds one line to tools.js and one block to roles.js. To undo: delete those two files and the lines marked "Map Studio". */
const fs = require("fs"), path = require("path");
const root = path.resolve(process.argv[2] || "."), check = process.argv.includes("--check"), main = path.join(root, "src", "main");
const fail = (m) => { console.error("Cannot install: " + m); process.exit(1); };
if (!fs.existsSync(path.join(main, "tools.js")) || !fs.existsSync(path.join(main, "roles.js"))) fail(`${root} does not look like Overlord (no src/main/tools.js and roles.js).`);
const said = []; const say = (m) => { said.push(m); console.log((check ? "would: " : "") + m); };

/* 1. copy the two files */
for (const f of ["mapstudio.js", "mapstudio-tools.json"]) { const src = path.join(__dirname, f), dst = path.join(main, f); if (!fs.existsSync(dst) || fs.readFileSync(src, "utf8") !== fs.readFileSync(dst, "utf8")) { say(`copy ${f} into src/main/`); if (!check) fs.copyFileSync(src, dst); } }

/* 2. tools.js: register the tools after the last TOOLS.push(...) statement */
{ const f = path.join(main, "tools.js"); let t = fs.readFileSync(f, "utf8");
  if (t.includes("require('./mapstudio')")) console.log("tools.js: already installed");
  else { const i = t.lastIndexOf("TOOLS.push("); if (i < 0) fail("tools.js has no TOOLS.push(...) line to add after. Add this yourself after TOOLS is built: TOOLS.push(...require('./mapstudio').tools);");
    const end = t.indexOf(");", i); if (end < 0) fail("could not find the end of the TOOLS.push statement in tools.js"); const at = t.indexOf("\n", end);
    t = t.slice(0, at + 1) + "// Map Studio (The Beyond's map and asset tools)\nTOOLS.push(...require('./mapstudio').tools);\n" + t.slice(at + 1); say("tools.js: register the mapstudio_* tools"); if (!check) fs.writeFileSync(f, t); } }

/* 3. roles.js: give each goblin its tools, before module.exports */
{ const f = path.join(main, "roles.js"); let t = fs.readFileSync(f, "utf8");
  if (t.includes("require('./mapstudio')")) console.log("roles.js: already installed");
  else { const i = t.lastIndexOf("module.exports"); if (i < 0) fail("roles.js has no module.exports");
    const block = `// Map Studio (The Beyond's map and asset tools): each goblin gets the mapstudio_* tools for its job.
{
  const MS = require('./mapstudio').roleTools;
  for (const [role, names] of Object.entries(MS)) if (ROLES[role]) ROLES[role].tools.push(...names.filter(n => !ROLES[role].tools.includes(n)));
  const note = '\\nIf the project has mapstudio/AGENT-BRIEF.md (The Beyond), read it with read_file before using the mapstudio_* tools.';
  for (const r of ['mapper', 'sculptor', 'snoop', 'wizard']) if (ROLES[r]) ROLES[r].brief += note;
}

`; t = t.slice(0, i) + block + t.slice(i); say("roles.js: give the goblins their mapstudio_* tools and the brief"); if (!check) fs.writeFileSync(f, t); } }
console.log(check ? "\ncheck done: nothing was changed." : said.length ? "\nDone. Restart Overlord. Then open the project folder that holds The Beyond and run: node mapstudio/setup.js" : "\nNothing to do: already installed.");
