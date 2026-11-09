# Next work (agreed 2026-11-09, start when Gage says "go")

Order: 1, 2, 4 first, then 3, 5, 7.

## 1. Rules audit against the full 2025 rulebook
- Source: TBRPG_Layout-2025 (127 pages). Compare every rule the game uses (aspects, rolls and CRs, damage, healing,
  injuries and afflictions, weapons and armour and their modifiers, monster creation, patrons, artifacts, downtime,
  wealth, bonds) with the book. List each difference first; fix after. House rules stay labelled as house rules.

## 2. Save export and import
- "Download save" and "Load save" for campaigns (a file the player keeps), so clearing the browser never loses a campaign.

## 3. A fresh art list for everything (one CSV + one .md)
- Every location, monster, character, agent portrait, item, hideout and title: one complete list.
- Each era must read clearly as its own time AND its own art style. Atomic already reads well; Late Century (modern)
  and Present must be pushed much further apart (and both away from Atomic). Strengthen tools/era-style.js:
  stronger medium per era, period-specific light, colour, film/print texture, technology in frame.
- Monsters follow art/MONSTER-DESIGN.md (eldritch copies of things people know, era-flavoured; places, cursed
  objects and events too). Test 2 and Test 3 looked good, so the format is approved.

## 4. One game, painted as the main edition
- Merge the three editions (main = drawn, dossier = photo, painted) into one codebase with an "Art style" setting
  (Painted default, Photo, Drawn). One Render site. Painted is the main game for now.

## 5. Recorded spooky sound effects and ambience
- Replace the code-made sound effects and ambience with good recordings (CC0 first, CC BY with credits), the way
  the music was done. Credits screen and assets/audio/CREDITS.md.

## 7. More adventures, campaigns and GM tools
- More written adventures, and a few full campaigns in the base game (multi-case arcs like Lamp-Black) across eras.
- GM tools: import/create adventures and whole campaigns (cases, encounters, NPCs, monsters, handouts) more easily,
  and a "run a game" mode so a GM can run players live without a premade adventure: build or improvise scenes and
  encounters on the fly, drop in monsters and NPCs, reveal handouts, call for rolls, manage the table.

## Housekeeping
- Code lives on GitLab: gitlab.com/bio4shock/the-beyond (main, dossier, painted). GitHub account suspended.
- Live site (drawn): https://the-beyond-yvb3.onrender.com. Painted/photo Blueprints use branches painted/dossier.
- Desktop installers need rebuilding on GitLab with the new server address.
