# Working on The Beyond: how to keep this cheap

The owner has a limited weekly allowance. Spend it on things that cannot be done another way.

1. **Ask before a big build.** Say what you think of an idea, how long it will take and what it costs, and wait for a yes. Do not code three versions to find out.
2. **One check per change.** One screenshot, one test run. Do not re-run scripts to look at the same thing again. Read a file's parts, not the whole file, and only if the text is not already in the conversation.
3. **Use the tools that exist, do not rebuild them.**
   - Maps: `MAPS.md` and `HOW-TO-MAKE-A-MAP.md`. `node tools/room3d/automap.js <case>` makes a map for every scene of a case with no AI. The owner tidies rooms in `/lab/editor.html`.
   - Cases: `CASE-STANDARD.md`, `tools/floor-check.js` and `tools/softlock.js` check a case in seconds. Run them instead of playing.
   - Pictures: `tools/build-painted.py`, `tools/build-pixel.py`, the picture lists in `art/`.
4. **Writing content is the biggest cost.** Keep new case parts near 12 KB, not 25. Write one or two parts per session and stop there, so a limit never lands mid-campaign. Reuse the engine's features (puzzles, clocks, magic spots) and do not invent new ones for each case.
5. **Push to GitLab** (`git push gitlab main`). Render deploys from there. GitHub is not used (its Actions minutes ran out). Remote `origin` resets to GitHub between sessions, so name `gitlab` explicitly.
6. **Never commit** wheel files, `node_modules`, or big downloads. `*.whl` is ignored.
7. The old behaviour is kept: git tag `classic-v1`, and Settings > Roleplaying features can switch each new feature off.
