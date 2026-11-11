# The case standard

Death of a Bloodline is the floor, not the template. Every case in the game, whatever its length, has to be at least as real as it is:
real player investigation, an enemy with its own rules, people worth talking to, more than one way to solve it, and an ending that
depends on how it went. Cases are curated: there is no recommended level.

`node tools/floor-check.js` measures this. A case passes when it has:
- at least 6 clues, and at least 5 searches (`check` with `investigate`);
- 2 or more primary objectives told up front, and 2 or more secondary objectives found by investigating, each with a `benefit`
  (a Situational Bonus on tagged rolls or attacks, a flag, items);
- an interview that is limited by a Charisma roll (`limit`) and has topics only a persuasive agent gets (`cha`); topics that the case needs to progress are `free`;
- two or more ways to solve it (`set: "res_..."` flags), and an ending that reads those flags and the objectives;
- an enemy with its own rules (`build.text`);
- a size of about 17 KB of data or more.

`node tools/softlock.js` walks every case (every roll won and lost, every choice, every order of options) and reports any state with
nothing to click or no way to win. A search that gates progress gives its clue on a failed roll too (`failClue`), at a cost.

Writing helpers are in `public/js/casekit.js` (`K.find`, `K.ask`, `K.t`, `K.go`). The engine supports: hidden secondary objectives with
benefits, Charisma-limited interviews, local agents who travel with the team (`companions`, `{join}`), allies and civilians in fights,
counters (`{inc}`, `{ge}`), and an opt-in conversation approach.
